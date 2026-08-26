import {
  compileResolvedAttributeModifierSource,
  projectCombatRuntimeAttributeKey,
} from './attributeModifier.ts';
import {
  compileEventTargetSimpleDamageOperationSource,
  type CompiledActionValueOperandSource,
  type CompiledSimpleDamageOperationSource,
} from './simpleDamageOperation.ts';
import { collectBuffActionReferences } from '../source/buffActionGraph.ts';
import type { BuffApplicationActionSource } from '../source/buffActions.ts';
import {
  collectNativeActionNodes,
  type NativeActionNodeSource,
  type NativeSequenceSource,
} from '../source/controlFlow.ts';
import {
  parseBuffRuntimeSource,
  type BuffPresentationSource,
  type BuffRuntimeSource,
  type BuffStackingTypeSource,
} from '../source/buffRuntime.ts';
import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import type { ScalarSource } from '../source/scalar.ts';
import { compileAbilityEventPrograms } from './abilityEventProgram.ts';
import {
  compileActionSequenceProgram,
  type CompileActionSequenceProgramOptions,
} from './actionSequenceProgram.ts';

export type CompiledBuffNumberSource = number | { readonly blackboardKey: string };

/** 原生 ActionOwner 在不同宿主中的运行目标；其余 Source/Target 仍来自事件载荷。 */
export interface CombatActionProjectionContextSource {
  readonly actionOwnerTarget: 'buffOwner' | 'caster';
  /** 当前公共投影只在已证明 Source 与干员宿主同一时开放该目标。 */
  readonly actionSourceTarget: 'caster';
  /** 普通事件序列的 Target 来自事件；可折叠逐队员循环时改为已证明的集合。 */
  readonly actionTargetTarget:
    | 'eventTarget'
    | 'partyExceptCaster'
    | 'partyExceptCasterAndSameCharacterType';
}

const BUFF_ACTION_CONTEXT: CombatActionProjectionContextSource = {
  actionOwnerTarget: 'buffOwner',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'eventTarget',
};

export interface CompiledBuffPresentationSource {
  readonly visible: boolean;
  readonly iconId?: string;
  readonly iconPath?: string;
  readonly showInHeadBarCommon: boolean;
  readonly showInHeadBarAttached: boolean;
  readonly showInSquadIcon: boolean;
  readonly onlyShowForMainCharacter: boolean;
  readonly iconStyleInSquad: string;
  readonly abnormalColorType: string;
  readonly orderPriority: {
    readonly useDirectoryValue: boolean;
    readonly value: number;
    readonly category: string;
  };
}

export interface CompiledBuffAttributeModifierSource {
  readonly attribute: string;
  readonly slot:
    | 'addition'
    | 'multiplier'
    | 'finalAddition'
    | 'finalMultiplier'
    | 'baseAddition'
    | 'baseMultiplier'
    | 'baseFinalAddition'
    | 'baseFinalMultiplier';
  readonly value: CompiledBuffNumberSource;
}

export interface CompiledBuffDamageModifierSource {
  readonly enabledSide: 'attacker' | 'defender';
  readonly condition?:
    | { readonly kind: 'sourceSkillCastMatch' }
    | {
        readonly kind: 'eventDamageTagsMatch';
        readonly match: 'hasAny' | 'hasAll';
        readonly tags: readonly ('normalSkill' | 'comboSkill' | 'ultimateSkill')[];
      }
    | {
        readonly kind: 'eventDamageTypesMatch';
        readonly damageTypes: readonly (
          'physical' | 'true' | 'heat' | 'electric' | 'cryo' | 'lifeDrain' | 'nature' | 'ether'
        )[];
      }
    | {
        readonly kind: 'entityTagMatch';
        readonly target: 'enemy';
        readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
        readonly tagIds: readonly number[];
      }
    | {
        readonly kind: 'buffIdCountCompare';
        readonly target: 'enemy';
        readonly buffIds: readonly string[];
        readonly operator:
          'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
        readonly value: CompiledBuffNumberSource;
      }
    | {
        readonly kind: 'targetPoiseCompare';
        readonly target: 'enemy';
        readonly returnValueIfMissing: boolean;
        readonly operator:
          'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
        readonly value: CompiledBuffNumberSource;
      }
    | {
        readonly kind: 'all';
        readonly conditions: readonly (
          | { readonly kind: 'sourceSkillCastMatch' }
          | {
              readonly kind: 'eventDamageTagsMatch';
              readonly match: 'hasAny' | 'hasAll';
              readonly tags: readonly ('normalSkill' | 'comboSkill' | 'ultimateSkill')[];
            }
          | {
              readonly kind: 'eventDamageTypesMatch';
              readonly damageTypes: readonly (
                | 'physical'
                | 'true'
                | 'heat'
                | 'electric'
                | 'cryo'
                | 'lifeDrain'
                | 'nature'
                | 'ether'
              )[];
            }
          | {
              readonly kind: 'entityTagMatch';
              readonly target: 'enemy';
              readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
              readonly tagIds: readonly number[];
            }
          | {
              readonly kind: 'buffIdCountCompare';
              readonly target: 'enemy';
              readonly buffIds: readonly string[];
              readonly operator:
                'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
              readonly value: CompiledBuffNumberSource;
            }
          | {
              readonly kind: 'targetPoiseCompare';
              readonly target: 'enemy';
              readonly returnValueIfMissing: boolean;
              readonly operator:
                'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
              readonly value: CompiledBuffNumberSource;
            }
        )[];
      };
  readonly processors: readonly {
    readonly kind: 'damageScale';
    readonly side: 'attacker' | 'defender';
    readonly zone:
      'product' | 'normal' | 'abnormalAndBurst' | 'enhanced' | 'combo' | 'vulnerable' | 'race';
    readonly addition: CompiledBuffNumberSource;
  }[];
}

export interface CompiledBuffHealModifierSource {
  readonly enabledSide: 'healer' | 'receiver';
  readonly condition?: {
    readonly kind: 'healTagsMatch';
    readonly match: 'hasAny' | 'hasAll';
    readonly tagIds: readonly number[];
  };
  readonly processors: readonly {
    readonly kind: 'modifyHealingIncrease';
    readonly timing: 'beforeCalculation';
    readonly side: 'healer' | 'receiver';
    readonly addition: CompiledBuffNumberSource;
  }[];
}

export interface CompiledBuffPoiseModifierSource {
  readonly enabledSide: 'attacker' | 'defender';
  readonly condition?:
    | { readonly kind: 'casterControlled' }
    | {
        readonly kind: 'eventDamageTagsMatch';
        readonly match: 'hasAny' | 'hasAll';
        readonly tags: readonly ['normalAttackLastCombo'];
      }
    | {
        readonly kind: 'all';
        readonly conditions: readonly (
          | { readonly kind: 'casterControlled' }
          | {
              readonly kind: 'eventDamageTagsMatch';
              readonly match: 'hasAny' | 'hasAll';
              readonly tags: readonly ['normalAttackLastCombo'];
            }
        )[];
      };
  readonly processors: readonly {
    readonly kind: 'modifyPoiseScalar';
    readonly timing: 'beforeCalculation';
    readonly side: 'attacker' | 'defender';
    readonly addition: CompiledBuffNumberSource;
  }[];
}

export type CompiledBuffConditionSource =
  | { readonly kind: 'casterControlled' }
  | {
      readonly kind: 'deckAttributeCompare';
      readonly left: 'strength' | 'agility' | 'intellect' | 'will';
      readonly operator:
        'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
      readonly right: 'strength' | 'agility' | 'intellect' | 'will';
    }
  | {
      readonly kind: 'eventInflictionElementIn';
      readonly elements: readonly ('heat' | 'electric' | 'cryo' | 'nature')[];
    }
  | {
      readonly kind: 'contextTargetCountCompare';
      readonly contextKey: string;
      readonly operator:
        'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
      readonly value: number;
      readonly outputKey?: string;
    }
  | {
      readonly kind: 'healthCompare';
      readonly target: 'controlledOperator';
      readonly valueType: 'current' | 'ratio';
      readonly operator:
        'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
      readonly value: CompiledActionValueOperandSource;
    }
  | {
      readonly kind: 'actionValueCompare';
      readonly left: CompiledActionValueOperandSource;
      readonly operator:
        'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
      readonly right: CompiledActionValueOperandSource;
    }
  | {
      readonly kind: 'eventOverheal';
      readonly overHealKey?: string;
      readonly finalHealKey?: string;
      readonly realHealKey?: string;
    }
  | { readonly kind: 'eventSkillCastMatchesBuffSource' }
  | {
      readonly kind: 'eventBuffIdMatch';
      readonly buffIds: readonly string[];
      readonly buffIdOutputKey?: string;
    }
  | {
      readonly kind: 'eventSourceTargetMatch';
      readonly operator: 'equal' | 'notEqual';
    }
  | {
      /** 比较当前动作宿主与事件目标；武器宿主是装备者，Buff 宿主是 Buff owner。 */
      readonly kind: 'eventActionOwnerTargetMatch';
      readonly operator: 'equal' | 'notEqual';
    }
  | {
      readonly kind: 'eventPhysicalInflictionTypeIn';
      readonly types: readonly ('airborne' | 'knockDown' | 'fracture' | 'crush')[];
    }
  | {
      readonly kind: 'eventDamageTypeIn';
      readonly damageTypes: readonly (
        'physical' | 'true' | 'heat' | 'electric' | 'cryo' | 'lifeDrain' | 'nature' | 'ether'
      )[];
    }
  | {
      readonly kind: 'eventDamageTagsMatch';
      readonly match: 'hasAny' | 'hasAll';
      readonly tags: readonly (
        'normalSkill' | 'comboSkill' | 'ultimateSkill' | 'normalAttackLastCombo'
      )[];
    }
  | {
      readonly kind: 'eventHealTagsMatch';
      readonly match: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      readonly tagIds: readonly number[];
    }
  | {
      readonly kind: 'eventSpGainMatch';
      readonly sources?: readonly ['skill'];
      readonly gainKinds?: readonly ['gain'];
    }
  | {
      /** CheckConsumeBuffLayer 读取 OnConsumeBuff 负载，而不是重新查询目标 Buff。 */
      readonly kind: 'eventConsumedBuffLayerCompare';
      readonly operator:
        'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
      readonly value: CompiledActionValueOperandSource;
      readonly outputKey?: string;
    }
  | {
      readonly kind: 'eventSkillTypeIn';
      readonly skillTypes: readonly ('battleSkill' | 'comboSkill' | 'ultimate')[];
    }
  | {
      readonly kind: 'contextTargetContains';
      readonly parentContextKey: string;
      readonly child: 'eventTarget';
    }
  | {
      readonly kind: 'originSkillTypeIn';
      readonly skillTypes: readonly (
        'basicAttack' | 'plungingAttack' | 'battleSkill' | 'comboSkill' | 'ultimate'
      )[];
    }
  | {
      readonly kind: 'eventBuffTagsMatch';
      readonly match: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      readonly buffTagIds: readonly number[];
      readonly buffIdOutputKey?: string;
    }
  | {
      readonly kind: 'eventTargetBuffCountCompare';
      readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      readonly buffTagIds: readonly number[];
      readonly operator:
        'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
      readonly value:
        | { readonly kind: 'constant'; readonly value: number }
        | { readonly kind: 'blackboard'; readonly key: string };
    }
  | {
      readonly kind: 'timedMarkerPresent';
      readonly target: 'caster' | 'eventTarget';
      readonly markerId: string;
    }
  | {
      readonly kind: 'buffStackCompare';
      readonly target: 'eventTarget';
      readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      readonly buffTagIds: readonly number[];
      readonly operator:
        'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
      readonly value:
        | { readonly kind: 'constant'; readonly value: number }
        | { readonly kind: 'blackboard'; readonly key: string };
    }
  | {
      readonly kind: 'buffIdStackCompare';
      readonly target: 'eventTarget' | 'buffOwner' | 'caster';
      readonly buffIds: readonly string[];
      readonly operator:
        'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
      readonly value:
        | { readonly kind: 'constant'; readonly value: number }
        | { readonly kind: 'blackboard'; readonly key: string };
    }
  | {
      readonly kind: 'poiseCompare';
      readonly target: 'enemy';
      readonly returnValueIfMissing: boolean;
      readonly operator:
        'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual';
      readonly value:
        | { readonly kind: 'constant'; readonly value: number }
        | { readonly kind: 'blackboard'; readonly key: string };
    }
  | {
      readonly kind: 'all' | 'any';
      readonly conditions: readonly CompiledBuffConditionSource[];
    }
  | {
      readonly kind: 'not';
      readonly condition: CompiledBuffConditionSource;
    };

export type CompiledBuffStepSource =
  | {
      readonly kind: 'mergeContextTargets';
      readonly parameters: {
        readonly saveToContextKey: string;
        readonly sources: readonly (
          | { readonly kind: 'target'; readonly target: 'eventTarget' }
          | { readonly kind: 'context'; readonly contextKey: string }
        )[];
      };
    }
  | {
      readonly kind: 'applyBuff';
      readonly parameters: {
        readonly buffId: string;
        readonly target:
          | 'caster'
          | 'enemy'
          | 'eventTarget'
          | 'eventSource'
          | 'buffOwner'
          | 'controlledOperator'
          | 'party'
          | 'partyExceptCaster'
          | 'partyExceptCasterAndSameCharacterType';
        readonly source?: 'eventSource';
        readonly count?: CompiledActionValueOperandSource;
        readonly inheritSourceSkillCastInfo?: boolean;
        readonly finishByAction?: boolean;
        readonly asChildBuff?: boolean;
        readonly blackboardAssignments?: Readonly<
          Record<
            string,
            | { readonly kind: 'constant'; readonly value: number | string }
            | { readonly kind: 'blackboard'; readonly key: string }
          >
        >;
      };
    }
  | {
      readonly kind: 'conditional';
      readonly parameters: {
        readonly condition: CompiledBuffConditionSource;
        readonly alwaysNext?: boolean;
      };
      readonly whenTrue: CompiledBuffSequenceSource;
      readonly whenFalse?: CompiledBuffSequenceSource;
    }
  | {
      readonly kind: 'readBuffStackCount';
      readonly parameters: {
        readonly target: 'eventTarget' | 'buffOwner' | 'caster';
        readonly outputKey: string;
        readonly countType?: 'instance';
        readonly query:
          | { readonly kind: 'id'; readonly buffIds: readonly string[] }
          | {
              readonly kind: 'tag';
              readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
              readonly buffTagIds: readonly number[];
            };
      };
    }
  | {
      readonly kind: 'readEventBuffBlackboard';
      readonly parameters: { readonly desiredKey: string; readonly outputKey: string };
    }
  | {
      readonly kind: 'modifyActionValue';
      readonly parameters: {
        readonly key: string;
        readonly operation: 'assign' | 'add' | 'multiply' | 'divide';
        readonly value:
          | { readonly kind: 'constant'; readonly value: number }
          | { readonly kind: 'blackboard'; readonly key: string };
      };
    }
  | {
      readonly kind: 'storeSourceAttributeValue';
      readonly parameters: {
        readonly attribute: { readonly kind: 'specific'; readonly key: 'maxHealth' };
        readonly stage: 'armedNonConverted' | 'finalNonConverted';
        readonly useFloor: boolean;
        readonly divisor: CompiledActionValueOperandSource;
        readonly multiplier: CompiledActionValueOperandSource;
        readonly base: CompiledActionValueOperandSource;
        readonly targetKey: string;
      };
    }
  | {
      readonly kind: 'calculateActionValue';
      readonly parameters: {
        readonly key: string;
        readonly operation: 'add' | 'multiply' | 'divide';
        readonly left: CompiledActionValueOperandSource;
        readonly right: CompiledActionValueOperandSource;
      };
    }
  | {
      readonly kind: 'readCurrentBuffRemainingDuration';
      readonly parameters: { readonly outputKey: string };
    }
  | {
      readonly kind: 'setCurrentBuffRemainingDuration';
      readonly parameters: {
        readonly operation: 'assign' | 'add' | 'multiply';
        readonly value: CompiledActionValueOperandSource;
      };
    }
  | {
      readonly kind: 'changeResourceByActionValue';
      readonly parameters: {
        readonly resource: 'sp' | 'ultimateEnergy';
        readonly amount: CompiledActionValueOperandSource;
        readonly coefficient: CompiledActionValueOperandSource;
        readonly recipient: 'caster' | 'team';
        readonly spGainKind?: 'gain' | 'refund';
        readonly spGainSource?: 'default' | 'normalAttack' | 'powerAttack' | 'skill';
        readonly isPercentValue?: boolean;
        readonly ultimateRecoveryTagId?: number;
        readonly ignoreUltimateEnergyGainMultiplier?: boolean;
      };
    }
  | CompiledSimpleDamageOperationSource
  | {
      readonly kind: 'heal';
      readonly parameters: {
        readonly target: 'caster' | 'controlledOperator';
        readonly alwaysNext?: boolean;
        readonly tagIds: readonly number[];
        readonly amount?: CompiledActionValueOperandSource;
        readonly attribute?: 'strength' | 'agility' | 'intellect' | 'will' | 'maxHealth';
        readonly multiplier?: CompiledActionValueOperandSource;
        readonly addition?: CompiledActionValueOperandSource;
      };
    }
  | {
      readonly kind: 'finishBuffsById';
      readonly parameters: {
        readonly target: 'buffOwner' | 'caster';
        readonly buffIds: readonly string[];
        readonly reason: 'early' | 'other';
        readonly count?:
          | { readonly kind: 'constant'; readonly value: number }
          | { readonly kind: 'blackboard'; readonly key: string };
      };
    }
  | {
      readonly kind: 'createTimedMarker';
      readonly parameters: {
        readonly target: 'caster' | 'eventTarget';
        readonly markerId: string;
        readonly durationSeconds:
          | { readonly kind: 'constant'; readonly value: number }
          | { readonly kind: 'blackboard'; readonly key: string };
        readonly autoFinishByAction: boolean;
      };
    }
  | {
      readonly kind: 'finishCurrentBuff';
      readonly parameters: { readonly reason: 'other' };
    };

export interface CompiledBuffSequenceSource {
  readonly steps: readonly CompiledBuffStepSource[];
}

export interface CompiledBuffDefinitionSource {
  readonly stackingType: string;
  readonly stackingKey?: string;
  readonly priority:
    CompiledBuffNumberSource | { readonly blackboardKey: string; readonly negate: true };
  readonly maxStackCount: CompiledBuffNumberSource;
  readonly durationSeconds?: CompiledBuffNumberSource;
  readonly triggerIntervalSeconds?: CompiledBuffNumberSource;
  readonly waitFirstTriggerInterval?: boolean;
  readonly maxTriggerCount?: CompiledBuffNumberSource;
  readonly timeClock?: 'global' | 'self';
  readonly presentation?: CompiledBuffPresentationSource;
  readonly applyTagIds: readonly number[];
  readonly extendTagIds: readonly number[];
  readonly blackboard: Readonly<Record<string, number | string>>;
  readonly attributeModifiers: readonly CompiledBuffAttributeModifierSource[];
  readonly damageModifiers?: readonly CompiledBuffDamageModifierSource[];
  readonly healModifiers?: readonly CompiledBuffHealModifierSource[];
  readonly poiseModifiers?: readonly CompiledBuffPoiseModifierSource[];
  readonly shields?: readonly {
    readonly infinityValue: boolean;
    readonly value: CompiledBuffNumberSource;
    readonly damageAbsorptions: readonly {
      readonly damageType:
        'physical' | 'true' | 'heat' | 'electric' | 'cryo' | 'lifeDrain' | 'nature' | 'ether';
      readonly ratio: CompiledBuffNumberSource;
      readonly scale: CompiledBuffNumberSource;
    }[];
    readonly absorbCount: CompiledBuffNumberSource;
    readonly absorbAllDamageWhenConsumed: boolean;
    readonly removeBuffWhenConsumed: boolean;
    readonly priority: 'normal' | 'prioritizeConsume';
    readonly replaceHitEffect: boolean;
  }[];
  readonly lifecycleSequences?: {
    readonly start?: CompiledBuffSequenceSource;
    readonly enable?: CompiledBuffSequenceSource;
    readonly enhanceChanged?: CompiledBuffSequenceSource;
    readonly finish?: CompiledBuffSequenceSource;
  };
  readonly abilityEventResponses?: readonly {
    readonly event:
      | 'beforeCastSkill'
      | 'outputBuff'
      | 'beforeOutputBuff'
      | 'beforeAddedBuff'
      | 'beforeOutputPhysicalInfliction'
      | 'afterOutputPhysicalInfliction'
      | 'beforeOutputInfliction'
      | 'beforeOutputSpellBurst'
      | 'outputCriticalDamage'
      | 'outputHeal'
      | 'skillEnd'
      | 'buffConsumed'
      | 'enterFight'
      /** 已严格融合 CheckObtainAtbType(Skill, Gain) 的共享技力事实事件。 */
      | 'skillSpGained';
    readonly priority: number;
    readonly sequence: CompiledBuffSequenceSource;
  }[];
}

type CompiledBuffAbilityEvent = NonNullable<
  CompiledBuffDefinitionSource['abilityEventResponses']
>[number]['event'];

const BUFF_ABILITY_EVENTS: Readonly<Record<string, CompiledBuffAbilityEvent>> = {
  OnBeforeCastSkill: 'beforeCastSkill',
  OnEnterFight: 'enterFight',
  OnOutputBuff: 'outputBuff',
  OnBeforeOutputBuff: 'beforeOutputBuff',
  OnBeforeAddedBuff: 'beforeAddedBuff',
  OnBeforeOutputPhysicalInfliction: 'beforeOutputPhysicalInfliction',
  OnAfterOutputPhysicalInfliction: 'afterOutputPhysicalInfliction',
  OnCharBeforeOutputSpellInfliction: 'beforeOutputInfliction',
  OnCharBeforeOutputSpellBurst: 'beforeOutputSpellBurst',
  OnOutputCriticalDamage: 'outputCriticalDamage',
  OnOutputHeal: 'outputHeal',
  OnObtainAtb: 'skillSpGained',
  OnConsumeBuff: 'buffConsumed',
};

function projectBuffAbilityEvent(
  event: string | number,
  sourcePath: string,
): CompiledBuffAbilityEvent {
  if (typeof event !== 'string' || BUFF_ABILITY_EVENTS[event] === undefined) {
    throw new Error(`${sourcePath}: unsupported ability event ${JSON.stringify(event)}`);
  }
  return BUFF_ABILITY_EVENTS[event]!;
}

export function buffRuntimeReadsBlackboardKey(source: BuffRuntimeSource, key: string): boolean {
  const readFieldNames = new Set(['blackboardKey', 'inputValueKey', 'buffIdKey']);
  const visit = (value: unknown): boolean => {
    if (Array.isArray(value)) return value.some(visit);
    if (value === null || typeof value !== 'object') return false;
    for (const [field, child] of Object.entries(value)) {
      if (readFieldNames.has(field) && child === key) return true;
      if (visit(child)) return true;
    }
    return false;
  };
  return visit(source);
}

export function collectBuffRuntimeClosure(
  rootIds: readonly string[],
  buffData: Record<string, unknown>,
): Map<string, BuffRuntimeSource> {
  const result = new Map<string, BuffRuntimeSource>();
  const queue = [...rootIds];
  while (queue.length > 0) {
    const buffId = queue.shift()!;
    if (result.has(buffId)) continue;
    const raw = buffData[buffId];
    if (raw === undefined)
      throw new Error(`BuffData: missing Buff definition ${JSON.stringify(buffId)}`);
    const source = parseBuffRuntimeSource(raw, `BuffData.${buffId}`);
    if (source.graph.buffId !== buffId) throw new Error(`BuffData.${buffId}.id: identity mismatch`);
    result.set(buffId, source);
    for (const reference of collectBuffActionReferences(source.graph)) {
      if (reference.kind !== 'buff' || reference.state === 'inactive') continue;
      if (reference.id === null) {
        throw new Error(
          `${reference.sourcePath}: dynamic Buff references cannot form a static Buff closure`,
        );
      }
      queue.push(reference.id);
    }
  }
  return result;
}

export function compileBuffRuntimeDefinitionSource(
  source: BuffRuntimeSource,
  visualOnlyIds: ReadonlySet<string> = new Set(),
  omittedAbilityEvents: ReadonlySet<string | number> = new Set(),
): CompiledBuffDefinitionSource {
  if (source.unsupportedPayloads.length > 0) {
    throw new Error(
      `unsupported Buff payloads: ${source.unsupportedPayloads.map(item => item.field).join(', ')}`,
    );
  }
  if (source.graph.timelineActions.length > 0 || source.graph.igniteEvents.length > 0) {
    throw new Error(
      'Buff timelines and ignite events are not yet supported by the runtime projector',
    );
  }
  const startSequences: CompiledBuffSequenceSource[] = [];
  const enableSequences: CompiledBuffSequenceSource[] = [];
  const enhanceChangedSequences: CompiledBuffSequenceSource[] = [];
  const finishSequences: CompiledBuffSequenceSource[] = [];
  let finishesWithSourceSkill = false;
  for (const event of source.graph.buffEvents) {
    const target =
      event.event === 'OnBuffStart'
        ? startSequences
        : event.event === 'DuringBuffEnable'
          ? enableSequences
          : event.event === 'OnBuffEnhanceChanged'
            ? enhanceChangedSequences
            : event.event === 'OnBuffFinish'
              ? finishSequences
              : null;
    if (target === null) throw new Error(`unsupported Buff event ${JSON.stringify(event.event)}`);
    for (const sequence of event.actions) {
      if (event.event === 'DuringBuffEnable' && isDirectSkillAffixSequence(sequence)) {
        finishesWithSourceSkill = true;
        continue;
      }
      const compiled = compileLinearSequence(sequence, visualOnlyIds);
      if (compiled.steps.length > 0) target.push(compiled);
    }
  }
  const abilityEventResponses = compileAbilityEventPrograms(
    source.graph.abilityEvents.map(event => ({
      abilityEvent: event.event,
      actions: event.actions,
    })),
    {
      sourcePath: `BuffData.${source.graph.buffId}.abilityEventAction`,
      omitEvent: event => omittedAbilityEvents.has(event),
      mapEvent: projectBuffAbilityEvent,
      compileSequence: (sequence, _sequencePath, abilityEvent) =>
        abilityEvent === 'OnObtainAtb'
          ? compileSkillSpGainSequence(sequence, visualOnlyIds)
          : compileLinearSequence(sequence, visualOnlyIds),
      isEmptySequence: sequence => sequence.steps.length === 0,
    },
  ).map(({ event, priority, sequence }) => ({ event, priority, sequence }));
  if (finishesWithSourceSkill) {
    abilityEventResponses.push({
      event: 'skillEnd',
      priority: 0,
      sequence: {
        steps: [
          {
            kind: 'conditional',
            parameters: { condition: { kind: 'eventSkillCastMatchesBuffSource' } },
            whenTrue: {
              steps: [{ kind: 'finishCurrentBuff', parameters: { reason: 'other' } }],
            },
          },
        ],
      },
    });
  }
  const blackboard = Object.fromEntries(
    source.graph.declaredBlackboard.map(item => [item.key, item.value]),
  );
  return {
    stackingType: STACKING_TYPES[source.lifecycle.stackingType],
    ...(source.lifecycle.stackingIdentifierType === 'StackingKey'
      ? { stackingKey: source.lifecycle.stackingKey }
      : {}),
    priority:
      source.lifecycle.priority.blackboardKey === null
        ? signed(source.lifecycle.priority.value, source.lifecycle.negatePriority)
        : {
            blackboardKey: source.lifecycle.priority.blackboardKey,
            ...(source.lifecycle.negatePriority ? { negate: true as const } : {}),
          },
    maxStackCount: scalarOperand(source.lifecycle.maxStackCount),
    ...(source.lifecycle.lifeType === 'Limited'
      ? { durationSeconds: scalarOperand(source.lifecycle.duration) }
      : {}),
    ...(source.lifecycle.triggerInterval.value < 0 &&
    source.lifecycle.triggerInterval.blackboardKey === null
      ? {}
      : {
          triggerIntervalSeconds: scalarOperand(source.lifecycle.triggerInterval),
          waitFirstTriggerInterval: source.lifecycle.waitFirstTriggerInterval,
          maxTriggerCount: scalarOperand(source.lifecycle.maxTriggerCount),
        }),
    ...(source.graph.useTimeDilationDeltaTime
      ? {
          timeClock: source.graph.onlyUseSelfTimeDilation ? ('self' as const) : ('global' as const),
        }
      : {}),
    ...(source.presentation.hasIcon || source.presentation.spritePath !== ''
      ? { presentation: compilePresentation(source.presentation) }
      : {}),
    applyTagIds: source.applyTagIds,
    extendTagIds: source.extendTagIds,
    blackboard,
    attributeModifiers: source.attributeModifiers.modifiers.map((modifier, index) => {
      if (modifier.modifyAttributeType !== 'Specific') {
        throw new Error(
          `attributeModifiers[${index}]: unsupported target ${modifier.modifyAttributeType}`,
        );
      }
      const compiled = compileResolvedAttributeModifierSource({
        sourcePath: `BuffData.${source.graph.buffId}.attributeModifier.attributeModifiers[${index}]`,
        modifyAttributeType: modifier.modifyAttributeType,
        attributeType: modifier.attributeType,
        formulaItem: modifier.formulaItem,
        value: 0,
      });
      return {
        attribute: projectCombatRuntimeAttributeKey(modifier.attributeType),
        slot: compiled.slot,
        value: scalarOperand(modifier.parameter),
      };
    }),
    ...compileBuffDamageModifiers(source),
    ...compileBuffHealModifiers(source),
    ...compileBuffPoiseModifiers(source),
    ...compileBuffShields(source),
    ...(startSequences.length === 0 &&
    enableSequences.length === 0 &&
    enhanceChangedSequences.length === 0 &&
    finishSequences.length === 0
      ? {}
      : {
          lifecycleSequences: {
            ...(startSequences.length === 0 ? {} : { start: mergeSequences(startSequences) }),
            ...(enableSequences.length === 0 ? {} : { enable: mergeSequences(enableSequences) }),
            ...(enhanceChangedSequences.length === 0
              ? {}
              : { enhanceChanged: mergeSequences(enhanceChangedSequences) }),
            ...(finishSequences.length === 0 ? {} : { finish: mergeSequences(finishSequences) }),
          },
        }),
    ...(abilityEventResponses.length === 0 ? {} : { abilityEventResponses }),
  };
}

function isDirectSkillAffixSequence(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
): boolean {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    return false;
  }
  const nodes = source.actions.filter(node => node.metadata.enabled);
  return (
    nodes.length === 1 &&
    nodes[0]!.body.kind === 'leaf' &&
    nodes[0]!.body.value.family === 'skillAffix'
  );
}

function compileBuffDamageModifiers(source: BuffRuntimeSource): {
  readonly damageModifiers?: readonly CompiledBuffDamageModifierSource[];
} {
  const modifiers = source.damageModifiers.map((modifier, index) => {
    const condition = compileDamageModifierCondition(modifier.condition, index);
    const enabledSide = DAMAGE_MODIFIER_SIDES[modifier.enabledSide];
    if (enabledSide === undefined) {
      throw new Error(
        `damageModifier[${index}]: unsupported enabled side ${JSON.stringify(modifier.enabledSide)}`,
      );
    }
    const processors = modifier.processors.map((processor, processorIndex) => {
      if (processor.kind !== 'damageScale') {
        throw new Error(
          `damageModifier[${index}].damageProcessors[${processorIndex}]: unsupported processor ${processor.kind}`,
        );
      }
      const side = DAMAGE_MODIFIER_SIDES[processor.side];
      const zone = DAMAGE_SCALE_ZONES[processor.zoneName];
      if (side === undefined || zone === undefined) {
        throw new Error(
          `damageModifier[${index}].damageProcessors[${processorIndex}]: unsupported side/zone`,
        );
      }
      return {
        kind: 'damageScale' as const,
        side,
        zone,
        addition: scalarOperand(processor.addition),
      };
    });
    if (processors.length === 0) {
      throw new Error(`damageModifier[${index}]: expected at least one processor`);
    }
    return { enabledSide, ...(condition === undefined ? {} : { condition }), processors };
  });
  return modifiers.length === 0 ? {} : { damageModifiers: modifiers };
}

function compileBuffHealModifiers(source: BuffRuntimeSource): {
  readonly healModifiers?: readonly CompiledBuffHealModifierSource[];
} {
  const modifiers = source.healModifiers.map((modifier, modifierIndex) => {
    const enabledSide =
      modifier.enabledSide === 'Healer'
        ? ('healer' as const)
        : modifier.enabledSide === 'HealReceiver'
          ? ('receiver' as const)
          : null;
    if (enabledSide === null) {
      throw new Error(
        `healModifier[${modifierIndex}]: unsupported enabled side ${JSON.stringify(modifier.enabledSide)}`,
      );
    }
    const nodes = modifier.condition.actions.filter(node => node.metadata.enabled);
    if (
      modifier.condition.onlyExecuteWhenSourceIsMainCharacter ||
      modifier.condition.onlyExecuteWhenSourceIsGuard ||
      nodes.length > 1
    ) {
      throw new Error(`healModifier[${modifierIndex}]: unsupported condition sequence`);
    }
    const condition = nodes.length === 0 ? undefined : compileHealModifierCondition(nodes[0]!);
    const processors = modifier.processors.map((processor, processorIndex) => {
      const targetSide =
        processor.modifyTargetSide === 'Attacker'
          ? ('healer' as const)
          : processor.modifyTargetSide === 'Defender'
            ? ('receiver' as const)
            : null;
      const expectedAttribute =
        targetSide === 'healer' ? 'HealOutputIncrease' : 'HealTakenIncrease';
      if (
        targetSide === null ||
        processor.modifier.modifyAttributeType !== 'Specific' ||
        processor.modifier.attributeType !== expectedAttribute ||
        processor.modifier.formulaItem !== 'BaseAddition'
      ) {
        throw new Error(
          `healModifier[${modifierIndex}].healProcessors[${processorIndex}]: unsupported instant healing attribute modifier`,
        );
      }
      return {
        kind: 'modifyHealingIncrease' as const,
        timing: 'beforeCalculation' as const,
        side: targetSide,
        addition: scalarOperand(processor.modifier.parameter),
      };
    });
    if (processors.length === 0) {
      throw new Error(`healModifier[${modifierIndex}]: expected at least one processor`);
    }
    return { enabledSide, ...(condition === undefined ? {} : { condition }), processors };
  });
  return modifiers.length === 0 ? {} : { healModifiers: modifiers };
}

function compileHealModifierCondition(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
): NonNullable<CompiledBuffHealModifierSource['condition']> {
  if (node.body.kind !== 'leaf' || node.body.value.family !== 'condition') {
    throw new Error(`${node.sourcePath}: expected a heal modifier condition`);
  }
  const condition = node.body.value.action;
  if (condition.kind !== 'healTag') {
    throw new Error(`${node.sourcePath}: unsupported heal modifier condition ${condition.kind}`);
  }
  const match =
    condition.queryType === 'hasAny'
      ? 'hasAny'
      : condition.queryType === 'hasAll'
        ? 'hasAll'
        : null;
  if (match === null) {
    throw new Error(`${node.sourcePath}: unsupported heal tag query ${condition.queryType}`);
  }
  return { kind: 'healTagsMatch', match, tagIds: condition.tagIds };
}

function compileBuffPoiseModifiers(source: BuffRuntimeSource): {
  readonly poiseModifiers?: readonly CompiledBuffPoiseModifierSource[];
} {
  const modifiers = source.poiseModifiers.map((modifier, modifierIndex) => {
    const enabledSide =
      modifier.enabledSide === 'Attacker'
        ? ('attacker' as const)
        : modifier.enabledSide === 'Defender'
          ? ('defender' as const)
          : null;
    if (enabledSide === null) {
      throw new Error(
        `poiseModifier[${modifierIndex}]: unsupported enabled side ${JSON.stringify(modifier.enabledSide)}`,
      );
    }
    const condition = compilePoiseModifierCondition(modifier.condition, modifierIndex);
    const processors = modifier.processors.map((processor, processorIndex) => {
      const side =
        processor.modifyTargetSide === 'Attacker'
          ? ('attacker' as const)
          : processor.modifyTargetSide === 'Defender'
            ? ('defender' as const)
            : null;
      const expectedAttribute =
        side === 'attacker' ? 'PoiseDamageOutputScalar' : 'PoiseDamageTakenScalar';
      if (
        side === null ||
        processor.modifier.modifyAttributeType !== 'Specific' ||
        processor.modifier.attributeType !== expectedAttribute ||
        processor.modifier.formulaItem !== 'BaseAddition'
      ) {
        throw new Error(
          `poiseModifier[${modifierIndex}].poiseProcessors[${processorIndex}]: unsupported instant poise attribute modifier`,
        );
      }
      return {
        kind: 'modifyPoiseScalar' as const,
        timing: 'beforeCalculation' as const,
        side,
        addition: scalarOperand(processor.modifier.parameter),
      };
    });
    if (processors.length === 0) {
      throw new Error(`poiseModifier[${modifierIndex}]: expected at least one processor`);
    }
    return { enabledSide, ...(condition === undefined ? {} : { condition }), processors };
  });
  return modifiers.length === 0 ? {} : { poiseModifiers: modifiers };
}

function compilePoiseModifierCondition(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  modifierIndex: number,
): CompiledBuffPoiseModifierSource['condition'] | undefined {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    throw new Error(`poiseModifier[${modifierIndex}]: root condition filters are unsupported`);
  }
  const conditions = source.actions
    .filter(node => node.metadata.enabled)
    .map(node => {
      if (node.body.kind !== 'leaf' || node.body.value.family !== 'condition') {
        throw new Error(`${node.sourcePath}: expected a poise modifier condition`);
      }
      const condition = node.body.value.action;
      if (condition.kind === 'mainOperator') {
        if (condition.targetSource !== 'Source' || condition.targetGroupKey !== '') {
          throw new Error(`${node.sourcePath}: unsupported poise main-character target`);
        }
        return { kind: 'casterControlled' as const };
      }
      if (condition.kind === 'damageDecorateMask') {
        if (
          (condition.checkType !== 'HasAny' && condition.checkType !== 'HasAll') ||
          condition.mask !== 2097152
        ) {
          throw new Error(`${node.sourcePath}: unsupported poise decorate mask ${condition.mask}`);
        }
        return {
          kind: 'eventDamageTagsMatch' as const,
          match: condition.checkType === 'HasAny' ? ('hasAny' as const) : ('hasAll' as const),
          tags: ['normalAttackLastCombo'] as const,
        };
      }
      throw new Error(`${node.sourcePath}: unsupported poise modifier condition ${condition.kind}`);
    });
  if (conditions.length === 0) return undefined;
  return conditions.length === 1 ? conditions[0] : { kind: 'all', conditions };
}

function compileBuffShields(source: BuffRuntimeSource): {
  readonly shields?: NonNullable<CompiledBuffDefinitionSource['shields']>;
} {
  const shields = source.shields.map((shield, shieldIndex) => {
    if (shield.applyScale) {
      throw new Error(
        `shieldConfigs[${shieldIndex}]: scaled DefiniteValueCalculation is unsupported`,
      );
    }
    const priority =
      shield.priority === 'Normal'
        ? ('normal' as const)
        : shield.priority === 'PrioritizeConsume'
          ? ('prioritizeConsume' as const)
          : null;
    if (priority === null) {
      throw new Error(
        `shieldConfigs[${shieldIndex}]: unsupported priority ${JSON.stringify(shield.priority)}`,
      );
    }
    return {
      infinityValue: shield.infinityValue,
      value: scalarOperand(shield.value),
      damageAbsorptions: shield.damageAbsorptions.map((absorption, absorptionIndex) => {
        const damageType = DAMAGE_TYPES[absorption.damageType];
        if (damageType === undefined) {
          throw new Error(
            `shieldConfigs[${shieldIndex}].damageAbsorptions[${absorptionIndex}]: unsupported damage type ${JSON.stringify(absorption.damageType)}`,
          );
        }
        return {
          damageType,
          ratio: scalarOperand(absorption.ratio),
          scale: scalarOperand(absorption.scale),
        };
      }),
      absorbCount:
        shield.absorbCount.blackboardKey === null
          ? shield.absorbCount.value
          : { blackboardKey: shield.absorbCount.blackboardKey },
      absorbAllDamageWhenConsumed: shield.absorbAllDamageWhenConsumed,
      removeBuffWhenConsumed: shield.removeBuffWhenConsumed,
      priority,
      replaceHitEffect: shield.replaceHitEffect,
    };
  });
  return shields.length === 0 ? {} : { shields };
}

function compileDamageModifierCondition(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  modifierIndex: number,
): CompiledBuffDamageModifierSource['condition'] | undefined {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    throw new Error(`damageModifier[${modifierIndex}]: root condition filters are unsupported`);
  }
  const conditions = source.actions
    .filter(node => node.metadata.enabled)
    .map(node => {
      if (node.body.kind !== 'leaf' || node.body.value.family !== 'condition') {
        throw new Error(`${node.sourcePath}: expected a damage modifier condition`);
      }
      const condition = node.body.value.action;
      if (condition.kind === 'skillCastId') return { kind: 'sourceSkillCastMatch' as const };
      if (condition.kind === 'damageType') {
        return {
          kind: 'eventDamageTypesMatch' as const,
          damageTypes: [condition.damageType] as readonly (
            'physical' | 'true' | 'heat' | 'electric' | 'cryo' | 'lifeDrain' | 'nature' | 'ether'
          )[],
        };
      }
      if (condition.kind === 'damageTypeMask') {
        return {
          kind: 'eventDamageTypesMatch' as const,
          damageTypes: condition.damageTypes.map(damageType => {
            const mapped = DAMAGE_TYPES[damageType];
            if (mapped === undefined) {
              throw new Error(
                `${node.sourcePath}: unsupported native damage type ${JSON.stringify(damageType)}`,
              );
            }
            return mapped;
          }),
        };
      }
      if (condition.kind === 'entityTag') {
        if (condition.targetSource !== 'Target' || condition.targetGroupKey !== '') {
          throw new Error(`${node.sourcePath}: unsupported damage modifier entity tag target`);
        }
        return {
          kind: 'entityTagMatch' as const,
          target: 'enemy' as const,
          tagQueryType: condition.tagQueryType,
          tagIds: condition.tagIds,
        };
      }
      if (condition.kind === 'buffStack') {
        const operator = COMPARISON_OPERATORS[condition.comparison];
        if (
          condition.targetSource !== 'Target' ||
          condition.targetGroupKey !== '' ||
          condition.buffCheckType !== 'Id' ||
          condition.buffIds.length === 0 ||
          condition.buffIds.some(id => id.length === 0) ||
          condition.buffTagIds.length !== 0 ||
          condition.countType !== 'BuffCount' ||
          condition.limitSkillCastId ||
          operator === undefined
        ) {
          throw new Error(`${node.sourcePath}: unsupported damage modifier Buff count condition`);
        }
        return {
          kind: 'buffIdCountCompare' as const,
          target: 'enemy' as const,
          buffIds: condition.buffIds,
          operator,
          value: scalarOperand(condition.value),
        };
      }
      if (condition.kind === 'poise') {
        const operator = COMPARISON_OPERATORS[condition.comparison];
        if (
          condition.target.targetSource !== 'Target' ||
          condition.target.targetGroupKey !== '' ||
          operator === undefined
        ) {
          throw new Error(`${node.sourcePath}: unsupported damage modifier poise condition`);
        }
        return {
          kind: 'targetPoiseCompare' as const,
          target: 'enemy' as const,
          returnValueIfMissing: condition.returnValueIfMissing,
          operator,
          value: scalarOperand(condition.value),
        };
      }
      if (
        condition.kind === 'damageDecorateMask' &&
        (condition.checkType === 'HasAny' || condition.checkType === 'HasAll')
      ) {
        const tags = [
          ...(condition.mask & 256 ? (['normalSkill'] as const) : []),
          ...(condition.mask & 512 ? (['ultimateSkill'] as const) : []),
          ...(condition.mask & 8192 ? (['comboSkill'] as const) : []),
        ];
        const knownMask = 256 | 512 | 8192;
        if (tags.length === 0 || (condition.mask & ~knownMask) !== 0) {
          throw new Error(`${node.sourcePath}: unsupported damage decorate mask ${condition.mask}`);
        }
        return {
          kind: 'eventDamageTagsMatch' as const,
          match: condition.checkType === 'HasAny' ? ('hasAny' as const) : ('hasAll' as const),
          tags,
        };
      }
      throw new Error(
        `${node.sourcePath}: unsupported damage modifier condition ${condition.kind}`,
      );
    });
  if (conditions.length === 0) return undefined;
  return conditions.length === 1 ? conditions[0] : { kind: 'all', conditions };
}

function compileSkillSpGainSequence(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
  context: CombatActionProjectionContextSource = BUFF_ACTION_CONTEXT,
): CompiledBuffSequenceSource {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    throw new Error('OnObtainAtb sequence owner/guard root filters are unsupported');
  }
  const nodes = source.actions.filter(node => node.metadata.enabled);
  const [filter] = nodes;
  if (
    filter?.body.kind !== 'leaf' ||
    filter.body.value.family !== 'condition' ||
    filter.body.value.action.kind !== 'obtainAtbType'
  ) {
    throw new Error('OnObtainAtb response must begin with CheckObtainAtbType');
  }
  const condition = filter.body.value.action;
  if (
    (condition.checkObtainType &&
      (condition.obtainTypes.length !== 1 || condition.obtainTypes[0] !== 'Skill')) ||
    (condition.checkObtainMethod &&
      (condition.obtainMethods.length !== 1 || condition.obtainMethods[0] !== 'Gain'))
  ) {
    throw new Error(`${filter.sourcePath}: unsupported CheckObtainAtbType filter`);
  }
  return compileLinearSequence(source, visualOnlyIds, context);
}

/** 被动技能、Buff、武器与装备共享的 Action/Condition 序列投影入口。 */
export function compileCombatActionSequenceSource(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  context: CombatActionProjectionContextSource,
  visualOnlyIds: ReadonlySet<string> = new Set(),
): CompiledBuffSequenceSource {
  return compileLinearSequence(source, visualOnlyIds, context);
}

/** OnObtainAtb 在公共事件映射前先严格融合 Skill + Gain 前缀条件。 */
export function compileSkillSpGainActionSequenceSource(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  context: CombatActionProjectionContextSource,
  visualOnlyIds: ReadonlySet<string> = new Set(),
): CompiledBuffSequenceSource {
  return compileSkillSpGainSequence(source, visualOnlyIds, context);
}

function compileLinearSequence(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
  context: CombatActionProjectionContextSource = BUFF_ACTION_CONTEXT,
): CompiledBuffSequenceSource {
  return compileActionSequenceProgram(source, createBuffSequenceProjection(visualOnlyIds, context));
}

function createBuffSequenceProjection(
  visualOnlyIds: ReadonlySet<string>,
  context: CombatActionProjectionContextSource,
): CompileActionSequenceProgramOptions<
  KnownNativeActionLeafSource,
  CompiledBuffConditionSource,
  CompiledBuffStepSource,
  ReadonlyMap<string, 'party' | 'partyExceptCaster'>
> {
  return {
    initialState: () => new Map<string, 'party' | 'partyExceptCaster'>(),
    compileCondition: node => compileEventCondition(node, context),
    combineConditions: conditions =>
      conditions.length === 1 ? conditions[0]! : { kind: 'all', conditions },
    negateCondition: condition => ({ kind: 'not', condition }),
    compileLeaf: (node, partyTargetGroups) =>
      compileBuffLeafNode(node, visualOnlyIds, partyTargetGroups, context),
    compileNodePrefix: (nodes, partyTargetGroups) =>
      compileDifferentCharacterTypePartyLoop(
        nodes,
        visualOnlyIds,
        partyTargetGroups,
        context,
      ),
    compileForEach: (node, partyTargetGroups) => {
      if (!isPartyExceptOwnerInstantSearch(node.body.target)) return null;
      if (
        node.body.action.onlyExecuteWhenSourceIsMainCharacter ||
        node.body.action.onlyExecuteWhenSourceIsGuard
      ) {
        return null;
      }
      const bodyNodes = node.body.action.actions.filter(child => child.metadata.enabled);
      if (
        bodyNodes.length === 0 ||
        bodyNodes.some(
          child =>
            child.body.kind !== 'leaf' ||
            child.body.value.family !== 'buffApplication' ||
            child.body.value.action.target.targetSource !== 'Target' ||
            child.body.value.action.target.targetGroupKey !== '',
        )
      ) {
        return null;
      }
      const loopContext: CombatActionProjectionContextSource = {
        ...context,
        actionTargetTarget: 'partyExceptCaster',
      };
      return {
        steps: bodyNodes.flatMap(child =>
          compileActionNode(child, visualOnlyIds, partyTargetGroups, loopContext),
        ),
        state: partyTargetGroups,
      };
    },
    createConditionalStep: ({ condition, whenTrue, whenFalse, alwaysNext }) => ({
      kind: 'conditional',
      parameters: { condition, ...(alwaysNext ? { alwaysNext: true } : {}) },
      whenTrue: { steps: [...whenTrue.steps] },
      ...(whenFalse === undefined ? {} : { whenFalse: { steps: [...whenFalse.steps] } }),
    }),
    rootFilterError: 'sequence owner/guard root filters are not yet supported',
    unsupportedNodeError: node => `${node.sourcePath}: unsupported Buff runtime action`,
  };
}

/**
 * SaveCharTypeId(owner) 后逐队员保存类型、取反 CompareString 的原生组合，等价于只选择不同
 * CharacterTable.charTypeId 的其他队员。Next 的 element 是该字段的一一投影，运行时仍以角色类型
 * 集合目标表达，不能把这条规则降成“任意其他队员”。
 */
function compileDifferentCharacterTypePartyLoop(
  nodes: readonly NativeActionNodeSource<KnownNativeActionLeafSource>[],
  visualOnlyIds: ReadonlySet<string>,
  partyTargetGroups: ReadonlyMap<string, 'party' | 'partyExceptCaster'>,
  context: CombatActionProjectionContextSource,
): {
  readonly consumedNodeCount: number;
  readonly steps: readonly CompiledBuffStepSource[];
  readonly state: ReadonlyMap<string, 'party' | 'partyExceptCaster'>;
} | null {
  const ownerRead = nodes[0];
  const loop = nodes[1];
  if (
    context.actionOwnerTarget !== 'caster' ||
    ownerRead?.body.kind !== 'leaf' ||
    ownerRead.body.value.family !== 'characterIdentity' ||
    ownerRead.body.value.action.target.targetSource !== 'Owner' ||
    ownerRead.body.value.action.target.targetGroupKey !== '' ||
    loop?.body.kind !== 'forEach' ||
    !isPartyExceptOwnerInstantSearch(loop.body.target) ||
    loop.body.action.onlyExecuteWhenSourceIsMainCharacter ||
    loop.body.action.onlyExecuteWhenSourceIsGuard
  ) {
    return null;
  }

  const body = loop.body.action.actions.filter(child => child.metadata.enabled);
  const teamRead = body[0];
  const negate = body[1];
  const compare = body[2];
  const applications = body.slice(3);
  if (
    teamRead?.body.kind !== 'leaf' ||
    teamRead.body.value.family !== 'characterIdentity' ||
    teamRead.body.value.action.target.targetSource !== 'Target' ||
    teamRead.body.value.action.target.targetGroupKey !== '' ||
    negate?.body.kind !== 'negateNextResult' ||
    compare?.body.kind !== 'leaf' ||
    compare.body.value.family !== 'condition' ||
    compare.body.value.action.kind !== 'stringCompare' ||
    applications.length === 0 ||
    applications.some(
      child =>
        child.body.kind !== 'leaf' ||
        child.body.value.family !== 'buffApplication' ||
        child.body.value.action.target.targetSource !== 'Target' ||
        child.body.value.action.target.targetGroupKey !== '',
    )
  ) {
    return null;
  }

  const ownerKey = ownerRead.body.value.action.outputKey;
  const teamKey = teamRead.body.value.action.outputKey;
  const leftKey = compare.body.value.action.left.blackboardKey;
  const rightKey = compare.body.value.action.right.blackboardKey;
  if (
    !(
      (leftKey === ownerKey && rightKey === teamKey) ||
      (leftKey === teamKey && rightKey === ownerKey)
    )
  ) {
    return null;
  }

  const loopContext: CombatActionProjectionContextSource = {
    ...context,
    actionTargetTarget: 'partyExceptCasterAndSameCharacterType',
  };
  return {
    consumedNodeCount: 2,
    steps: applications.flatMap(child =>
      compileActionNode(child, visualOnlyIds, partyTargetGroups, loopContext),
    ),
    state: partyTargetGroups,
  };
}

function compileBuffLeafNode(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
  partyTargetGroups: ReadonlyMap<string, 'party' | 'partyExceptCaster'>,
  context: CombatActionProjectionContextSource,
): {
  readonly steps: readonly CompiledBuffStepSource[];
  readonly state: ReadonlyMap<string, 'party' | 'partyExceptCaster'>;
} {
  if (node.body.kind !== 'leaf') {
    throw new Error(`${node.sourcePath}: expected an action leaf`);
  }
  if (node.body.value.family === 'targetGroup') {
    const action = node.body.value.action;
    if (action.producerType === 'MergeTargetAction') {
      const sources = action.inputTargets.map((target, index) => {
        if (target.targetSource === 'Target' && target.targetGroupKey === '') {
          return { kind: 'target' as const, target: 'eventTarget' as const };
        }
        if (target.targetSource === 'Context' && target.targetGroupKey !== '') {
          return { kind: 'context' as const, contextKey: target.targetGroupKey };
        }
        throw new Error(
          `${node.sourcePath}.targets[${index}]: unsupported Buff merge target source`,
        );
      });
      return {
        steps: [
          {
            kind: 'mergeContextTargets',
            parameters: { saveToContextKey: action.targetGroupKey, sources },
          },
        ],
        state: partyTargetGroups,
      };
    }
    const partyKind =
      action.postProcessorTypes.length === 0 && !action.excludesOwner
        ? ('party' as const)
        : action.postProcessorTypes.length === 1 &&
            action.postProcessorTypes[0] === 'ExcludeTarget' &&
            action.excludesOwner
          ? ('partyExceptCaster' as const)
          : null;
    const centerMatchesCaster =
      action.center === 'ActionOwner' ||
      (action.center === 'ActionSource' &&
        context.actionSourceTarget === 'caster' &&
        context.actionOwnerTarget === 'caster');
    if (
      action.producerType !== 'FindTargetAction' ||
      action.finderType !== 'CharacterTeamFinder' ||
      action.validatorTypes.length !== 0 ||
      partyKind === null ||
      !centerMatchesCaster ||
      action.centerContextKey !== '' ||
      action.selectorOwner !== 'ActionOwner' ||
      action.selectorOwnerContextKey !== ''
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff target group query`);
    }
    const nextGroups = new Map(partyTargetGroups);
    nextGroups.set(action.targetGroupKey, partyKind);
    return { steps: [], state: nextGroups };
  }
  return {
    steps: compileActionNode(node, visualOnlyIds, partyTargetGroups, context),
    state: partyTargetGroups,
  };
}

function compileEventCondition(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  context: CombatActionProjectionContextSource,
): CompiledBuffConditionSource | null {
  if (node.body.kind !== 'leaf' || node.body.value.family !== 'condition') return null;
  return compileConditionLeaf(node.body.value.action, node.sourcePath, context);
}

function compileConditionLeaf(
  condition: Extract<KnownNativeActionLeafSource, { family: 'condition' }>['action'],
  sourcePath: string,
  context: CombatActionProjectionContextSource,
): CompiledBuffConditionSource {
  if (condition.kind === 'mainOperator') {
    if (
      condition.targetSource !== 'Owner' ||
      condition.targetGroupKey !== '' ||
      context.actionOwnerTarget !== 'caster'
    ) {
      throw new Error(`${sourcePath}: unsupported main-character condition target`);
    }
    return { kind: 'casterControlled' };
  }
  if (condition.kind === 'deckAttributeCompare') {
    const attributes = {
      Str: 'strength',
      Agi: 'agility',
      Wisd: 'intellect',
      Will: 'will',
    } as const;
    const left = attributes[condition.leftAttribute as keyof typeof attributes];
    const right = attributes[condition.rightAttribute as keyof typeof attributes];
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (
      condition.targetSource !== 'Owner' ||
      condition.targetGroupKey !== '' ||
      condition.leftValue.blackboardKey !== null ||
      condition.leftValue.value !== 0 ||
      condition.rightValue.blackboardKey !== null ||
      condition.rightValue.value !== 0 ||
      left === undefined ||
      right === undefined ||
      operator === undefined
    ) {
      throw new Error(`${sourcePath}: unsupported Deck attribute comparison`);
    }
    return { kind: 'deckAttributeCompare', left, operator, right };
  }
  if (condition.kind === 'floatCompare') {
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (operator === undefined) throw new Error(`${sourcePath}: unsupported float comparison`);
    return {
      kind: 'actionValueCompare',
      left: actionValueOperand(condition.left),
      operator,
      right: actionValueOperand(condition.right),
    };
  }
  if (condition.kind === 'health') {
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (
      condition.targetSource !== 'InstantSearch' ||
      condition.characterTeamSelectionRole !== 'controlledOperator' ||
      operator === undefined
    ) {
      throw new Error(`${sourcePath}: unsupported health condition target`);
    }
    return {
      kind: 'healthCompare',
      target: 'controlledOperator',
      valueType: condition.isRatio ? 'ratio' : 'current',
      operator,
      value: actionValueOperand(condition.value),
    };
  }
  if (condition.kind === 'obtainAtbType') {
    if (
      (condition.checkObtainType &&
        (condition.obtainTypes.length !== 1 || condition.obtainTypes[0] !== 'Skill')) ||
      (condition.checkObtainMethod &&
        (condition.obtainMethods.length !== 1 || condition.obtainMethods[0] !== 'Gain'))
    ) {
      throw new Error(`${sourcePath}: unsupported ObtainAtb event filter`);
    }
    return {
      kind: 'eventSpGainMatch',
      ...(condition.checkObtainType ? { sources: ['skill'] as const } : {}),
      ...(condition.checkObtainMethod ? { gainKinds: ['gain'] as const } : {}),
    };
  }
  if (condition.kind === 'skillType') {
    return {
      kind: 'eventSkillTypeIn',
      skillTypes: condition.skillTypes.map(skillType => {
        const mapped = SKILL_TYPES[skillType];
        if (mapped === undefined)
          throw new Error(`unsupported native skill type ${JSON.stringify(skillType)}`);
        return mapped;
      }),
    };
  }
  if (condition.kind === 'originSkillType') {
    if (condition.attackTypeMask !== 'All') {
      throw new Error(
        `${sourcePath}: unsupported origin skill attack type mask ${JSON.stringify(condition.attackTypeMask)}`,
      );
    }
    return {
      kind: 'originSkillTypeIn',
      skillTypes: condition.skillTypes.flatMap(skillType => {
        if (skillType === 'Attack') return ['basicAttack', 'plungingAttack'] as const;
        const mapped = SKILL_TYPES[skillType];
        if (mapped === undefined)
          throw new Error(`unsupported native origin skill type ${JSON.stringify(skillType)}`);
        return [mapped];
      }),
    };
  }
  if (condition.kind === 'skillCastId') {
    return { kind: 'eventSkillCastMatchesBuffSource' };
  }
  if (condition.kind === 'inflictionType') {
    if (condition.savedKey !== '') {
      throw new Error(`${sourcePath}: saved infliction element is unsupported`);
    }
    return {
      kind: 'eventInflictionElementIn',
      elements: condition.elements as readonly ('heat' | 'electric' | 'cryo' | 'nature')[],
    };
  }
  if (condition.kind === 'entityCount') {
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (
      condition.targetSource !== 'Context' ||
      condition.targetGroupKey === '' ||
      condition.containsHittableTarget ||
      condition.excludeDeadEntity ||
      operator === undefined
    ) {
      throw new Error(`${sourcePath}: unsupported Context target count condition`);
    }
    return {
      kind: 'contextTargetCountCompare',
      contextKey: condition.targetGroupKey,
      operator,
      value: condition.minimumCount,
      ...(condition.storeKey === '' ? {} : { outputKey: condition.storeKey }),
    };
  }
  if (condition.kind === 'targetContains') {
    if (
      condition.parent.targetSource !== 'Context' ||
      condition.parent.targetGroupKey === '' ||
      condition.child.targetSource !== 'Target' ||
      condition.child.targetGroupKey !== ''
    ) {
      throw new Error(`${sourcePath}: unsupported target containment sources`);
    }
    return {
      kind: 'contextTargetContains',
      parentContextKey: condition.parent.targetGroupKey,
      child: 'eventTarget',
    };
  }
  if (condition.kind === 'damageTypeMask') {
    return {
      kind: 'eventDamageTypeIn',
      damageTypes: condition.damageTypes.map(damageType => {
        const mapped = DAMAGE_TYPES[damageType];
        if (mapped === undefined) {
          throw new Error(
            `${sourcePath}: unsupported native damage type ${JSON.stringify(damageType)}`,
          );
        }
        return mapped;
      }),
    };
  }
  if (condition.kind === 'damageDecorateMask') {
    const match =
      condition.checkType === 'HasAny'
        ? ('hasAny' as const)
        : condition.checkType === 'HasAll'
          ? ('hasAll' as const)
          : null;
    const tags = [
      ...(condition.mask & 256 ? (['normalSkill'] as const) : []),
      ...(condition.mask & 512 ? (['ultimateSkill'] as const) : []),
      ...(condition.mask & 8192 ? (['comboSkill'] as const) : []),
      ...(condition.mask & 2097152 ? (['normalAttackLastCombo'] as const) : []),
    ];
    const knownMask = 256 | 512 | 8192 | 2097152;
    if (match === null || tags.length === 0 || (condition.mask & ~knownMask) !== 0) {
      throw new Error(`${sourcePath}: unsupported damage decorate mask ${condition.mask}`);
    }
    return { kind: 'eventDamageTagsMatch', match, tags };
  }
  if (condition.kind === 'healTag') {
    return {
      kind: 'eventHealTagsMatch',
      match: condition.queryType,
      tagIds: condition.tagIds,
    };
  }
  if (condition.kind === 'consumeBuffLayer') {
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (operator === undefined) {
      throw new Error(`${sourcePath}: unsupported consumed Buff layer comparison`);
    }
    return {
      kind: 'eventConsumedBuffLayerCompare',
      operator,
      value: actionValueOperand(condition.value),
      ...(condition.outputKey === '' ? {} : { outputKey: condition.outputKey }),
    };
  }
  if (condition.kind === 'physicalInflictionType') {
    if (condition.savedKey !== '')
      throw new Error(`${sourcePath}: physical infliction savedKey is unsupported`);
    return { kind: 'eventPhysicalInflictionTypeIn', types: condition.types };
  }
  if (condition.kind === 'overHeal') {
    return {
      kind: 'eventOverheal',
      ...(condition.overHealKey === '' ? {} : { overHealKey: condition.overHealKey }),
      ...(condition.finalHealKey === '' ? {} : { finalHealKey: condition.finalHealKey }),
      ...(condition.realHealKey === '' ? {} : { realHealKey: condition.realHealKey }),
    };
  }
  if (condition.kind === 'contextBuff') {
    if (condition.matcher.kind === 'id') {
      const buffIds = condition.matcher.buffIds.map(buffId => {
        if (buffId.kind !== 'constant') {
          throw new Error(`${sourcePath}: dynamic event Buff ID conditions are unsupported`);
        }
        return buffId.value;
      });
      return {
        kind: 'eventBuffIdMatch',
        buffIds,
        ...(condition.buffIdOutputKey === undefined
          ? {}
          : { buffIdOutputKey: condition.buffIdOutputKey }),
      };
    }
    const match = TAG_QUERY_TYPES[condition.matcher.queryType];
    if (match === undefined) {
      throw new Error(
        `${sourcePath}: unsupported event Buff tag query ${JSON.stringify(condition.matcher.queryType)}`,
      );
    }
    return {
      kind: 'eventBuffTagsMatch',
      match,
      buffTagIds: condition.matcher.buffTagIds,
      ...(condition.buffIdOutputKey === undefined
        ? {}
        : { buffIdOutputKey: condition.buffIdOutputKey }),
    };
  }
  if (condition.kind === 'targetIdentity') {
    const first = condition.first;
    const second = condition.second;
    const matchesEventSourceAndTarget =
      first.targetGroupKey === '' &&
      second.targetGroupKey === '' &&
      ((first.targetSource === 'Target' && second.targetSource === 'Source') ||
        (first.targetSource === 'Source' && second.targetSource === 'Target'));
    if (!matchesEventSourceAndTarget) {
      const matchesOwnerAndEventTarget =
        first.targetGroupKey === '' &&
        second.targetGroupKey === '' &&
        ((first.targetSource === 'Owner' && second.targetSource === 'Target') ||
          (first.targetSource === 'Target' && second.targetSource === 'Owner'));
      if (matchesOwnerAndEventTarget) {
        return { kind: 'eventActionOwnerTargetMatch', operator: 'equal' };
      }
      throw new Error(`${sourcePath}: unsupported target identity sources`);
    }
    return { kind: 'eventSourceTargetMatch', operator: 'equal' };
  }
  if (condition.kind === 'buffStack') {
    if (
      (condition.targetSource !== 'Target' &&
        condition.targetSource !== 'Owner' &&
        condition.targetSource !== 'Source') ||
      condition.targetGroupKey !== '' ||
      condition.countType !== 'BuffCount' ||
      condition.limitSkillCastId
    ) {
      throw new Error(`${sourcePath}: unsupported event target Buff count condition`);
    }
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (operator === undefined) {
      throw new Error(`${sourcePath}: unsupported event target Buff count comparison`);
    }
    if (condition.buffCheckType === 'Tag' && condition.buffIds.length === 0) {
      return {
        kind: 'eventTargetBuffCountCompare',
        tagQueryType: condition.tagQueryType,
        buffTagIds: condition.buffTagIds,
        operator,
        value: actionValueOperand(condition.value),
      };
    }
    if (condition.buffCheckType === 'Id' && condition.buffIds.every(id => id.length > 0)) {
      return {
        kind: 'buffIdStackCompare',
        target:
          condition.targetSource === 'Owner'
            ? context.actionOwnerTarget
            : condition.targetSource === 'Source'
              ? context.actionSourceTarget
              : 'eventTarget',
        buffIds: condition.buffIds,
        operator,
        value: actionValueOperand(condition.value),
      };
    }
    throw new Error(`${sourcePath}: unsupported event target Buff identity condition`);
  }
  if (condition.kind === 'poise') {
    if (condition.target.targetSource !== 'Target' || condition.target.targetGroupKey !== '')
      throw new Error(`${sourcePath}: unsupported poise condition target`);
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (operator === undefined) throw new Error(`${sourcePath}: unsupported poise comparison`);
    return {
      kind: 'poiseCompare',
      target: 'enemy',
      returnValueIfMissing: condition.returnValueIfMissing,
      operator,
      value: actionValueOperand(condition.value),
    };
  }
  if (condition.kind === 'any') {
    const groups = condition.groups.map(group => {
      const conditions = group.conditions.map((child, index) => {
        const compiled = compileConditionLeaf(child, sourcePath, context);
        return group.negated[index] ? ({ kind: 'not', condition: compiled } as const) : compiled;
      });
      return conditions.length === 1 ? conditions[0]! : ({ kind: 'all', conditions } as const);
    });
    return groups.length === 1 ? groups[0]! : { kind: 'any', conditions: groups };
  }
  if (condition.kind === 'globalCooldown') {
    const target =
      condition.targetSource === 'Owner'
        ? ('caster' as const)
        : condition.targetSource === 'Source'
          ? context.actionSourceTarget
          : null;
    if (target !== 'caster' || condition.targetGroupKey !== '' || condition.buffId.length === 0) {
      throw new Error(`${sourcePath}: unsupported global cooldown condition target`);
    }
    return {
      kind: 'not',
      condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: condition.buffId },
    };
  }
  if (condition.kind === 'timedMarker') {
    const target =
      condition.targetSource === 'Target'
        ? ('eventTarget' as const)
        : condition.targetSource === 'Owner'
          ? context.actionOwnerTarget
          : condition.targetSource === 'Source'
            ? context.actionSourceTarget
            : null;
    if (
      (target !== 'caster' && target !== 'eventTarget') ||
      condition.targetGroupKey !== '' ||
      condition.useBlackboardKey ||
      condition.blackboardKey !== '' ||
      condition.markerId.length === 0
    ) {
      throw new Error(`${sourcePath}: unsupported timed marker condition`);
    }
    const present = {
      kind: 'timedMarkerPresent' as const,
      target,
      markerId: condition.markerId,
    };
    return condition.returnTrueIfNotExists ? { kind: 'not', condition: present } : present;
  }
  throw new Error(`${sourcePath}: unsupported Buff runtime condition ${condition.kind}`);
}

function compileActionNode(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
  partyTargetGroups: ReadonlyMap<string, 'party' | 'partyExceptCaster'> = new Map(),
  context: CombatActionProjectionContextSource = BUFF_ACTION_CONTEXT,
): CompiledBuffStepSource[] {
  if (node.body.kind !== 'leaf') {
    throw new Error(`${node.sourcePath}: unsupported Buff runtime action`);
  }
  if (node.body.value.family === 'buffApplication') {
    return compileBuffApplication(
      node.body.value.action,
      visualOnlyIds,
      node.sourcePath,
      partyTargetGroups,
      context,
    );
  }
  if (node.body.value.family === 'aura') {
    const aura = node.body.value.action;
    return aura.buffs.flatMap((entry, index) => {
      if (visualOnlyIds.has(entry.buffId)) return [];
      const assignments = entry.assignBlackboard
        ? Object.fromEntries(
            entry.assignments.map(item => [
              item.targetKey,
              item.useDirectValue
                ? {
                    kind: 'constant' as const,
                    value: item.valueType === 'Numeric' ? item.numericValue : item.stringValue,
                  }
                : { kind: 'blackboard' as const, key: item.inputValueKey },
            ]),
          )
        : {};
      if (!entry.assignBlackboard && entry.assignments.length > 0) {
        throw new Error(
          `${node.sourcePath}.buffInput[${index}]: disabled Aura assignment is nonempty`,
        );
      }
      return [
        {
          kind: 'applyBuff' as const,
          parameters: {
            buffId: entry.buffId,
            target: aura.target,
            finishByAction: true,
            ...(aura.inheritSourceSkillCastInfo ? { inheritSourceSkillCastInfo: true } : {}),
            ...(Object.keys(assignments).length === 0
              ? {}
              : { blackboardAssignments: assignments }),
          },
        },
      ];
    });
  }
  if (node.body.value.family === 'buffFinish') {
    const action = node.body.value.action;
    if (
      (action.owner.targetSource !== 'Owner' && action.owner.targetSource !== 'Source') ||
      action.owner.targetGroupKey !== '' ||
      action.limitSource ||
      action.buffSource.targetSource !== 'Source' ||
      action.buffSource.targetGroupKey !== '' ||
      action.finishSource.targetSource !== 'Source' ||
      action.finishSource.targetGroupKey !== ''
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff finish target/source`);
    }
    const buffIds =
      action.kind === 'buffFinishById'
        ? action.buffIds
        : action.settings.checkType === 'Id' &&
            action.settings.buffIds.length > 0 &&
            action.settings.tagQuery.tagIds.length === 0 &&
            !action.isAbsorbed
          ? action.settings.buffIds
          : null;
    if (buffIds === null || buffIds.length === 0 || buffIds.some(id => id.length === 0)) {
      throw new Error(`${node.sourcePath}: unsupported Buff finish query`);
    }
    return [
      {
        kind: 'finishBuffsById',
        parameters: {
          // combat-spec 的公共 TargetSettings 语义：Buff 环境 Owner 是 Buff 接收者，
          // Source 是 Buff 来源。这里保持二者身份，不因多数样本使用 Owner 而合并。
          target: action.owner.targetSource === 'Owner' ? context.actionOwnerTarget : 'caster',
          buffIds,
          reason: action.isFinishedEarly ? 'early' : 'other',
          ...(action.finishAll ? {} : { count: actionValueOperand(action.finishLayerCount) }),
        },
      },
    ];
  }
  if (node.body.value.family === 'damage') {
    return [
      compileEventTargetSimpleDamageOperationSource(
        node.body.value.action,
        node.sourcePath,
        context,
      ),
    ];
  }
  if (node.body.value.family === 'heal') {
    const action = node.body.value.action;
    const target =
      action.target.targetSource === 'Owner'
        ? ('caster' as const)
        : isControlledOperatorInstantSearch(action.target)
          ? ('controlledOperator' as const)
          : null;
    const attributeNames = {
      Str: 'strength',
      Agi: 'agility',
      Wisd: 'intellect',
      Will: 'will',
      MaxHp: 'maxHealth',
    } as const;
    const attribute =
      action.calculation.kind === 'attribute'
        ? attributeNames[action.calculation.attributeType as keyof typeof attributeNames]
        : undefined;
    if (
      action.healType !== 'Normal' ||
      action.healer !== 'ActionSource' ||
      action.contextKey !== '' ||
      target === null ||
      (action.calculation.kind === 'definite' && action.calculation.applyScale) ||
      (action.calculation.kind !== 'definite' &&
        (action.calculation.kind !== 'attribute' ||
          action.calculation.valueSource !== 'AttackerOrHealer' ||
          attribute === undefined))
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff runtime heal`);
    }
    const calculation =
      action.calculation.kind === 'definite'
        ? { amount: actionValueOperand(action.calculation.value) }
        : {
            attribute: attribute!,
            multiplier: actionValueOperand(action.calculation.multiplier),
            addition: actionValueOperand(action.calculation.addition),
          };
    return [
      {
        kind: 'heal',
        parameters: {
          target,
          ...(action.alwaysNext ? { alwaysNext: true } : {}),
          tagIds: action.useHealTags ? action.healTagIds : [],
          ...calculation,
        },
      },
    ];
  }
  if (node.body.value.family === 'buffQuery') {
    const action = node.body.value.action;
    if (
      action.target.targetSource !== 'Target' &&
      action.target.targetSource !== 'Owner' &&
      action.target.targetSource !== 'Source' ||
      action.target.targetGroupKey !== '' ||
      action.countType !== 'BuffCount' ||
      action.limitSkillCastId
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff stack read`);
    }
    const query =
      action.checkType === 'Id' && action.buffIds.length > 0 && action.buffTagIds.length === 0
        ? { kind: 'id' as const, buffIds: action.buffIds }
        : action.checkType === 'Tag' && action.buffIds.length === 0
          ? {
              kind: 'tag' as const,
              tagQueryType: action.tagQueryType,
              buffTagIds: action.buffTagIds,
            }
          : null;
    if (query === null) throw new Error(`${node.sourcePath}: unsupported BuffCount query`);
    return [
      {
        kind: 'readBuffStackCount',
        parameters: {
          target:
            action.target.targetSource === 'Owner'
              ? context.actionOwnerTarget
              : action.target.targetSource === 'Source'
                ? context.actionSourceTarget
                : 'eventTarget',
          outputKey: action.outputKey,
          countType: 'instance',
          query,
        },
      },
    ];
  }
  if (node.body.value.family === 'buffBlackboardRead') {
    const action = node.body.value.action;
    if (
      action.target.targetSource !== 'Target' ||
      action.target.targetGroupKey !== '' ||
      action.settings.checkType !== 'Context' ||
      action.settings.buffIds.length !== 1 ||
      action.settings.buffIds[0] !== '' ||
      action.settings.tagQuery.tagIds.length !== 0
    ) {
      throw new Error(`${node.sourcePath}: unsupported event Buff blackboard read`);
    }
    return [
      {
        kind: 'readEventBuffBlackboard',
        parameters: { desiredKey: action.desiredKey, outputKey: action.outputKey },
      },
    ];
  }
  if (node.body.value.family === 'buffLifeTimeRead') {
    const action = node.body.value.action;
    if (
      action.owner.targetSource !== 'Owner' ||
      action.owner.targetGroupKey !== '' ||
      action.settings.checkType !== 'Environment' ||
      action.settings.buffIds.length !== 0 ||
      action.settings.tagQuery.queryType !== 'hasAny' ||
      action.settings.tagQuery.tagIds.length !== 0
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff lifetime query`);
    }
    return [
      {
        kind: 'readCurrentBuffRemainingDuration',
        parameters: { outputKey: action.outputKey },
      },
    ];
  }
  if (node.body.value.family === 'buffDurationMutation') {
    const action = node.body.value.action;
    const operation = ACTION_VALUE_OPERATIONS[action.operation];
    if (
      action.target.targetSource !== 'Owner' ||
      action.target.targetGroupKey !== '' ||
      action.settings.checkType !== 'Environment' ||
      action.settings.buffIds.length !== 0 ||
      action.settings.tagQuery.queryType !== 'hasAny' ||
      action.settings.tagQuery.tagIds.length !== 0 ||
      action.isFinishedEarly ||
      (operation !== 'assign' && operation !== 'add' && operation !== 'multiply')
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff duration mutation`);
    }
    return [
      {
        kind: 'setCurrentBuffRemainingDuration',
        parameters: { operation, value: actionValueOperand(action.value) },
      },
    ];
  }
  if (node.body.value.family === 'blackboardMutation') {
    const action = node.body.value.action;
    if (!action.directValue)
      throw new Error(`${node.sourcePath}: indirect blackboard mutation is unsupported`);
    const operation = ACTION_VALUE_OPERATIONS[action.operation];
    if (operation === undefined)
      throw new Error(`${node.sourcePath}: unsupported blackboard operation ${action.operation}`);
    return [
      {
        kind: 'modifyActionValue',
        parameters: {
          key: action.key,
          operation,
          value: actionValueOperand(action.value),
        },
      },
    ];
  }
  if (node.body.value.family === 'attributeSnapshot') {
    const action = node.body.value.action;
    const target =
      action.target.targetSource === 'Owner'
        ? context.actionOwnerTarget
        : action.target.targetSource === 'Source'
          ? context.actionSourceTarget
          : null;
    if (
      target !== 'caster' ||
      action.primaryAttributeType !== 'Specific' ||
      action.attributeType !== 'MaxHp'
    ) {
      throw new Error(`${node.sourcePath}: unsupported attribute snapshot target or selector`);
    }
    return [
      {
        kind: 'storeSourceAttributeValue',
        parameters: {
          attribute: { kind: 'specific', key: 'maxHealth' },
          stage:
            action.storeAttributeType === 'BaseNonConverted'
              ? 'armedNonConverted'
              : 'finalNonConverted',
          useFloor: action.useFloor,
          divisor: actionValueOperand(action.divisor),
          multiplier: actionValueOperand(action.multiplier),
          base: actionValueOperand(action.baseValue),
          targetKey: action.outputKey,
        },
      },
    ];
  }
  if (node.body.value.family === 'blackboardCalculation') {
    const action = node.body.value.action;
    const operation = ACTION_VALUE_OPERATIONS[action.operation];
    if (
      (operation !== 'add' && operation !== 'multiply' && operation !== 'divide') ||
      action.addend !== null
    ) {
      throw new Error(`${node.sourcePath}: unsupported blackboard calculation`);
    }
    return [
      {
        kind: 'calculateActionValue',
        parameters: {
          key: action.key,
          operation,
          left: actionValueOperand(action.left),
          right: actionValueOperand(action.right),
        },
      },
    ];
  }
  if (node.body.value.family === 'resource') {
    const action = node.body.value.action;
    if (
      action.source.targetSource !== 'Owner' ||
      action.source.targetGroupKey !== '' ||
      action.target.targetSource !== 'Owner' ||
      action.target.targetGroupKey !== '' ||
      action.onlyMainOperator
    ) {
      throw new Error(`${node.sourcePath}: unsupported resource gain source/target`);
    }
    return [
      {
        kind: 'changeResourceByActionValue',
        parameters: {
          resource: action.resource,
          amount: actionValueOperand(action.amount),
          coefficient: actionValueOperand(action.coefficient),
          recipient: action.resource === 'sp' ? 'team' : 'caster',
          ...(action.spGainKind === null ? {} : { spGainKind: action.spGainKind }),
          ...(action.spGainSource === null ? {} : { spGainSource: action.spGainSource }),
          ...(action.isPercentValue ? { isPercentValue: true } : {}),
          ...(action.useUltimateRecoveryTag
            ? { ultimateRecoveryTagId: action.ultimateRecoveryTagId }
            : {}),
          ...(action.ignoreUltimateGainScalar ? { ignoreUltimateEnergyGainMultiplier: true } : {}),
        },
      },
    ];
  }
  if (node.body.value.family === 'globalCooldown') {
    const action = node.body.value.action;
    const target =
      action.target.targetSource === 'Owner'
        ? context.actionOwnerTarget
        : action.target.targetSource === 'Source'
          ? context.actionSourceTarget
          : null;
    if (target !== 'caster' || action.buffId.length === 0) {
      throw new Error(`${node.sourcePath}: unsupported global cooldown application target`);
    }
    return [
      {
        kind: 'createTimedMarker',
        parameters: {
          target: 'caster',
          markerId: action.buffId,
          durationSeconds:
            action.duration.blackboardKey === null
              ? { kind: 'constant', value: action.duration.value }
              : { kind: 'blackboard', key: action.duration.blackboardKey },
          autoFinishByAction: false,
        },
      },
    ];
  }
  if (node.body.value.family === 'timedMarker') {
    const action = node.body.value.action;
    const target =
      action.target.targetSource === 'Target'
        ? ('eventTarget' as const)
        : action.target.targetSource === 'Owner'
          ? context.actionOwnerTarget
          : action.target.targetSource === 'Source'
            ? context.actionSourceTarget
            : null;
    if (
      (target !== 'caster' && target !== 'eventTarget') ||
      action.marker.blackboardKey !== null ||
      action.marker.value.length === 0 ||
      action.useTimeDilationDeltaTime
    ) {
      throw new Error(`${node.sourcePath}: unsupported timed marker application`);
    }
    return [
      {
        kind: 'createTimedMarker',
        parameters: {
          target,
          markerId: action.marker.value,
          durationSeconds: actionValueOperand(action.duration),
          autoFinishByAction: action.autoFinishByAction,
        },
      },
    ];
  }
  if (node.body.value.family === 'presentation') return [];
  throw new Error(`${node.sourcePath}: unsupported Buff runtime action`);
}

/** 已严格解析、但在无渲染后端中不产生战斗状态的表现动作路径。 */
export function collectBuffRuntimePresentationActionPaths(
  source: BuffRuntimeSource,
): readonly string[] {
  const sequences = [
    ...source.graph.timelineActions.map(item => item.sequence),
    ...source.graph.buffEvents.flatMap(item => item.actions),
    ...source.graph.abilityEvents.flatMap(item => item.actions),
    ...source.graph.igniteEvents.flatMap(item => item.actions),
  ];
  return sequences
    .flatMap(sequence => collectNativeActionNodes(sequence))
    .filter(
      node =>
        node.metadata.enabled &&
        node.body.kind === 'leaf' &&
        node.body.value.family === 'presentation',
    )
    .map(node => node.sourcePath);
}

function compileBuffApplication(
  action: BuffApplicationActionSource,
  visualOnlyIds: ReadonlySet<string>,
  sourcePath: string,
  partyTargetGroups: ReadonlyMap<string, 'party' | 'partyExceptCaster'> = new Map(),
  context: CombatActionProjectionContextSource = BUFF_ACTION_CONTEXT,
): CompiledBuffStepSource[] {
  for (const entry of action.buffs) {
    if (entry.readIdFromBlackboard || entry.buffId.length === 0)
      throw new Error(`${sourcePath}: dynamic Buff identity is unsupported`);
  }
  // 纯表现子 Buff 的动作生命周期只持有并清理表现资源；来源已完整解析后可从无渲染后端省略。
  if (action.buffs.every(entry => visualOnlyIds.has(entry.buffId))) return [];
  if (
    action.inheritSkillIds.length > 0 ||
    action.inheritSourceSkillCastId ||
    action.isExtra ||
    action.passTargetGroupsToBuff ||
    action.overrideBuffIconDuration
  ) {
    throw new Error(`${sourcePath}: unsupported CreateBuff lifecycle options`);
  }
  const target =
    action.target.targetSource === 'Owner'
      ? context.actionOwnerTarget
      : action.target.targetSource === 'Source'
        ? ('eventSource' as const)
        : action.target.targetSource === 'Target'
          ? context.actionTargetTarget
          : action.target.targetSource === 'Context' &&
              partyTargetGroups.has(action.target.targetGroupKey ?? '')
            ? partyTargetGroups.get(action.target.targetGroupKey ?? '')!
            : isControlledOperatorInstantSearch(action.target)
              ? ('controlledOperator' as const)
              : isPartyExceptOwnerInstantSearch(action.target)
                ? ('partyExceptCaster' as const)
                : isPartyInstantSearch(action.target)
                  ? ('party' as const)
                  : null;
  const source =
    action.buffSource === 'ActionOwner'
      ? undefined
      : action.buffSource === 'ActionSource'
        ? ('eventSource' as const)
        : null;
  if (target === null || source === null)
    throw new Error(`${sourcePath}: unsupported Buff target/source`);
  return action.buffs.flatMap(entry => {
    if (visualOnlyIds.has(entry.buffId)) return [];
    const assignments = entry.assignBlackboard
      ? Object.fromEntries(
          entry.assignments.map(item => [
            item.targetKey,
            item.useDirectValue
              ? {
                  kind: 'constant' as const,
                  value: item.valueType === 'Numeric' ? item.numericValue : item.stringValue,
                }
              : { kind: 'blackboard' as const, key: item.inputValueKey },
          ]),
        )
      : {};
    return [
      {
        kind: 'applyBuff' as const,
        parameters: {
          buffId: entry.buffId,
          target,
          ...(source === undefined ? {} : { source }),
          ...(action.count.blackboardKey === null && action.count.value === 1
            ? {}
            : { count: actionValueOperand(action.count) }),
          ...(action.inheritSourceSkillCastInfo ? { inheritSourceSkillCastInfo: true } : {}),
          ...(action.autoFinishByAction ? { finishByAction: true } : {}),
          ...(action.asChildBuff ? { asChildBuff: true } : {}),
          ...(Object.keys(assignments).length === 0 ? {} : { blackboardAssignments: assignments }),
        },
      },
    ];
  });
}

/** 固定小队模型中严格折叠已证明的“全队成员排除动作 owner”即时搜索。 */
function isPartyExceptOwnerInstantSearch(target: BuffApplicationActionSource['target']): boolean {
  return (
    target.targetSource === 'InstantSearch' &&
    target.selectorOwner === 'ActionOwner' &&
    target.ownerContextKey === '' &&
    target.centerType === 'ActionSource' &&
    target.centerContextKey === '' &&
    !target.centerToGround &&
    target.target === 'ActionSource' &&
    target.targetContextKey === '' &&
    !target.enableAdvancedDirection &&
    target.selectorDirection === 'SourceForward' &&
    target.finderType === 'CharacterTeamFinder' &&
    target.finderShape === null &&
    target.finderOwnerPartsQuery === null &&
    target.validatorTypes.length === 1 &&
    target.validatorTypes[0] === 'ExcludeOwnerValidator' &&
    target.postProcessorTypes.length === 0 &&
    target.priorityFilters.length === 0 &&
    target.shuffleTargets.length === 0 &&
    target.distanceValidators.length === 0 &&
    target.finderSpawnedObjectType === null &&
    target.validatorTagQueries.length === 0
  );
}

/** 固定队伍模型中的 CharacterTeamFinder + MainCharacterValidator。 */
function isControlledOperatorInstantSearch(target: BuffApplicationActionSource['target']): boolean {
  return (
    target.targetSource === 'InstantSearch' &&
    target.finderType === 'CharacterTeamFinder' &&
    target.validatorTypes.length === 1 &&
    target.validatorTypes[0] === 'MainCharacterValidator' &&
    target.postProcessorTypes.length === 0
  );
}

/** 固定小队模型中严格折叠无筛选的即时全队搜索。 */
function isPartyInstantSearch(target: BuffApplicationActionSource['target']): boolean {
  return (
    target.targetSource === 'InstantSearch' &&
    target.selectorOwner === 'ActionOwner' &&
    target.ownerContextKey === '' &&
    target.centerType === 'ActionSource' &&
    target.centerContextKey === '' &&
    !target.centerToGround &&
    target.target === 'ActionSource' &&
    target.targetContextKey === '' &&
    !target.enableAdvancedDirection &&
    target.selectorDirection === 'SourceForward' &&
    target.finderType === 'CharacterTeamFinder' &&
    target.finderShape === null &&
    target.finderOwnerPartsQuery === null &&
    target.validatorTypes.length === 0 &&
    target.postProcessorTypes.length === 0 &&
    target.priorityFilters.length === 0 &&
    target.shuffleTargets.length === 0 &&
    target.distanceValidators.length === 0 &&
    target.finderSpawnedObjectType === null &&
    target.validatorTagQueries.length === 0
  );
}

export function isPresentationOnlyBuffStackEffect(source: BuffRuntimeSource): boolean {
  return (
    source.lifecycle.stackEffectCount > 0 &&
    source.lifecycle.stackEffectActionTypes.every(type => type === 'EffectAction') &&
    !source.presentation.hasIcon &&
    source.presentation.spritePath === '' &&
    source.attributeModifiers.modifiers.length === 0 &&
    source.damageModifiers.length === 0 &&
    source.healModifiers.length === 0 &&
    source.poiseModifiers.length === 0 &&
    source.shields.length === 0 &&
    source.applyTagIds.length === 0 &&
    source.extendTagIds.length === 0 &&
    source.unsupportedPayloads.length === 0 &&
    source.graph.timelineActions.length === 0 &&
    source.graph.buffEvents.length === 0 &&
    source.graph.abilityEvents.length === 0 &&
    source.graph.igniteEvents.length === 0
  );
}

export function isAfterEnemyDefeatedOnlyBuffRuntime(source: BuffRuntimeSource): boolean {
  return (
    source.unsupportedPayloads.length === 0 &&
    source.attributeModifiers.modifiers.length === 0 &&
    source.damageModifiers.length === 0 &&
    source.healModifiers.length === 0 &&
    source.poiseModifiers.length === 0 &&
    source.shields.length === 0 &&
    source.applyTagIds.length === 0 &&
    source.extendTagIds.length === 0 &&
    source.graph.timelineActions.length === 0 &&
    source.graph.buffEvents.length === 0 &&
    source.graph.igniteEvents.length === 0 &&
    source.graph.abilityEvents.length > 0 &&
    source.graph.abilityEvents.every(event => event.event === 'OnAfterKillEntity')
  );
}

function compilePresentation(source: BuffPresentationSource): CompiledBuffPresentationSource {
  return {
    visible: source.hasIcon,
    ...(source.spritePath === ''
      ? {}
      : { iconId: source.spritePath, iconPath: `/icons/${source.spritePath}.webp` }),
    showInHeadBarCommon: source.showInHeadBarCommon,
    showInHeadBarAttached: source.showInHeadBarAttached,
    showInSquadIcon: source.showInSquadIcon,
    onlyShowForMainCharacter: source.onlyShowForMainCharacter,
    iconStyleInSquad: source.iconStyleInSquad,
    abnormalColorType: source.abnormalColorType,
    orderPriority: {
      useDirectoryValue: source.orderUseDirectoryValue,
      value: source.orderPriorityValue,
      category: source.orderPriorityEnum,
    },
  };
}

function scalarOperand(source: ScalarSource): CompiledBuffNumberSource {
  return source.blackboardKey === null ? source.value : { blackboardKey: source.blackboardKey };
}

function actionValueOperand(source: ScalarSource):
  | { readonly kind: 'constant'; readonly value: number }
  | {
      readonly kind: 'blackboard';
      readonly key: string;
    } {
  return source.blackboardKey === null
    ? { kind: 'constant', value: source.value }
    : { kind: 'blackboard', key: source.blackboardKey };
}

function signed(value: number, negate: boolean): number {
  return negate ? -value : value;
}
function mergeSequences(
  sequences: readonly CompiledBuffSequenceSource[],
): CompiledBuffSequenceSource {
  return { steps: sequences.flatMap(item => item.steps) };
}

const STACKING_TYPES: Record<BuffStackingTypeSource, string> = {
  Unlimited: 'unlimited',
  HighPriority: 'highPriority',
  Stack: 'stack',
  Enhance: 'enhance',
  Refresh: 'refresh',
  Extend: 'extend',
  Modify: 'modify',
  Unique: 'unique',
  EnhanceAndRefresh: 'enhanceAndRefresh',
  OverwriteDuration: 'overwriteDuration',
  EnhanceAndOverwriteDuration: 'enhanceAndOverwriteDuration',
  HighPriorityWithMaxStack: 'highPriorityWithMaxStack',
};
const SKILL_TYPES: Readonly<Record<string, 'battleSkill' | 'comboSkill' | 'ultimate'>> = {
  NormalSkill: 'battleSkill',
  ComboSkill: 'comboSkill',
  UltimateSkill: 'ultimate',
};
const DAMAGE_TYPES: Readonly<
  Record<
    string,
    'physical' | 'true' | 'heat' | 'electric' | 'cryo' | 'lifeDrain' | 'nature' | 'ether'
  >
> = {
  Physical: 'physical',
  Real: 'true',
  Fire: 'heat',
  Pulse: 'electric',
  Cryst: 'cryo',
  LifeDrain: 'lifeDrain',
  Natural: 'nature',
  Ether: 'ether',
};
const TAG_QUERY_TYPES: Readonly<Record<string, 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll'>> = {
  HasAny: 'hasAny',
  HasAll: 'hasAll',
  ExceptAny: 'exceptAny',
  ExceptAll: 'exceptAll',
  hasAny: 'hasAny',
  hasAll: 'hasAll',
  exceptAny: 'exceptAny',
  exceptAll: 'exceptAll',
};
const COMPARISON_OPERATORS: Readonly<
  Record<string, 'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual'>
> = {
  EQ: 'equal',
  NE: 'notEqual',
  GT: 'greater',
  GE: 'greaterOrEqual',
  LT: 'less',
  LE: 'lessOrEqual',
  Equals: 'equal',
  NotEquals: 'notEqual',
  GreaterThan: 'greater',
  GreaterThanOrEqual: 'greaterOrEqual',
  LessThan: 'less',
  LessThanOrEqual: 'lessOrEqual',
};
const ACTION_VALUE_OPERATIONS: Readonly<Record<string, 'assign' | 'add' | 'multiply' | 'divide'>> =
  {
    Assign: 'assign',
    Add: 'add',
    Multiply: 'multiply',
    Divide: 'divide',
  };
const DAMAGE_MODIFIER_SIDES: Readonly<Record<string, 'attacker' | 'defender'>> = {
  Attacker: 'attacker',
  Defender: 'defender',
};
const DAMAGE_SCALE_ZONES: Readonly<
  Record<
    string,
    'product' | 'normal' | 'abnormalAndBurst' | 'enhanced' | 'combo' | 'vulnerable' | 'race'
  >
> = {
  ProdCalcZone: 'product',
  NormalCalcZone: 'normal',
  AbnormalAndBurstCalcZone: 'abnormalAndBurst',
  EnhanceCalcZone: 'enhanced',
  ComboCalcZone: 'combo',
  VulnerableCalcZone: 'vulnerable',
  RaceCalcZone: 'race',
};
