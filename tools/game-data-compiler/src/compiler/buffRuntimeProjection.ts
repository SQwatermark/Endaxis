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

export type CompiledBuffNumberSource = number | { readonly blackboardKey: string };

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
        readonly match: 'hasAll';
        readonly tags: readonly ['normalSkill' | 'comboSkill'];
      }
    | {
        readonly kind: 'all';
        readonly conditions: readonly (
          | { readonly kind: 'sourceSkillCastMatch' }
          | {
              readonly kind: 'eventDamageTagsMatch';
              readonly match: 'hasAll';
              readonly tags: readonly ['normalSkill' | 'comboSkill'];
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

export type CompiledBuffConditionSource =
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
      readonly target: 'caster';
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
      readonly target: 'eventTarget' | 'buffOwner';
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
          | 'party'
          | 'partyExceptCaster';
        readonly source?: 'eventSource';
        readonly count?: CompiledActionValueOperandSource;
        readonly inheritSourceSkillCastInfo?: boolean;
        readonly finishByAction?: boolean;
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
        readonly target: 'eventTarget' | 'buffOwner';
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
      readonly kind: 'finishBuffsById';
      readonly parameters: {
        readonly target: 'buffOwner';
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
        readonly target: 'caster';
        readonly markerId: string;
        readonly durationSeconds:
          | { readonly kind: 'constant'; readonly value: number }
          | { readonly kind: 'blackboard'; readonly key: string };
        readonly autoFinishByAction: false;
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
      | 'beforeOutputPhysicalInfliction'
      | 'outputCriticalDamage'
      | 'outputHeal'
      | 'skillEnd'
      | 'buffConsumed'
      | 'enterFight'
      /** 已严格融合 CheckObtainAtbType(Skill, Gain) 的共享技力事实事件。 */
      | 'skillSpGained';
    readonly priority: 0;
    readonly sequence: CompiledBuffSequenceSource;
  }[];
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
  const beforeCastSteps: CompiledBuffStepSource[] = [];
  const outputBuffSteps: CompiledBuffStepSource[] = [];
  const beforeOutputPhysicalInflictionSteps: CompiledBuffStepSource[] = [];
  const outputCriticalDamageSteps: CompiledBuffStepSource[] = [];
  const outputHealSteps: CompiledBuffStepSource[] = [];
  const skillSpGainedSteps: CompiledBuffStepSource[] = [];
  const buffConsumedSteps: CompiledBuffStepSource[] = [];
  const enterFightSteps: CompiledBuffStepSource[] = [];
  const skillEndSteps: CompiledBuffStepSource[] = finishesWithSourceSkill
    ? [
        {
          kind: 'conditional',
          parameters: { condition: { kind: 'eventSkillCastMatchesBuffSource' } },
          whenTrue: {
            steps: [{ kind: 'finishCurrentBuff', parameters: { reason: 'other' } }],
          },
        },
      ]
    : [];
  for (const event of source.graph.abilityEvents) {
    if (omittedAbilityEvents.has(event.event)) continue;
    const target =
      event.event === 'OnBeforeCastSkill'
        ? beforeCastSteps
        : event.event === 'OnEnterFight'
          ? enterFightSteps
          : event.event === 'OnOutputBuff'
            ? outputBuffSteps
            : event.event === 'OnBeforeOutputPhysicalInfliction'
              ? beforeOutputPhysicalInflictionSteps
              : event.event === 'OnOutputCriticalDamage'
                ? outputCriticalDamageSteps
                : event.event === 'OnOutputHeal'
                  ? outputHealSteps
                  : event.event === 'OnObtainAtb'
                    ? skillSpGainedSteps
                    : event.event === 'OnConsumeBuff'
                      ? buffConsumedSteps
                      : null;
    if (target === null)
      throw new Error(`unsupported ability event ${JSON.stringify(event.event)}`);
    for (const sequence of event.actions) {
      const compiled =
        event.event === 'OnObtainAtb'
          ? compileSkillSpGainSequence(sequence, visualOnlyIds)
          : compileLinearSequence(sequence, visualOnlyIds);
      target.push(...compiled.steps);
    }
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
    ...(beforeCastSteps.length === 0 &&
    outputBuffSteps.length === 0 &&
    beforeOutputPhysicalInflictionSteps.length === 0 &&
    outputCriticalDamageSteps.length === 0 &&
    outputHealSteps.length === 0 &&
    skillSpGainedSteps.length === 0 &&
    buffConsumedSteps.length === 0 &&
    skillEndSteps.length === 0
      ? {}
      : {
          abilityEventResponses: [
            ...(beforeCastSteps.length === 0
              ? []
              : [
                  {
                    event: 'beforeCastSkill' as const,
                    priority: 0 as const,
                    sequence: { steps: beforeCastSteps },
                  },
                ]),
            ...(outputBuffSteps.length === 0
              ? []
              : [
                  {
                    event: 'outputBuff' as const,
                    priority: 0 as const,
                    sequence: { steps: outputBuffSteps },
                  },
                ]),
            ...(beforeOutputPhysicalInflictionSteps.length === 0
              ? []
              : [
                  {
                    event: 'beforeOutputPhysicalInfliction' as const,
                    priority: 0 as const,
                    sequence: { steps: beforeOutputPhysicalInflictionSteps },
                  },
                ]),
            ...(outputCriticalDamageSteps.length === 0
              ? []
              : [
                  {
                    event: 'outputCriticalDamage' as const,
                    priority: 0 as const,
                    sequence: { steps: outputCriticalDamageSteps },
                  },
                ]),
            ...(outputHealSteps.length === 0
              ? []
              : [
                  {
                    event: 'outputHeal' as const,
                    priority: 0 as const,
                    sequence: { steps: outputHealSteps },
                  },
                ]),
            ...(skillSpGainedSteps.length === 0
              ? []
              : [
                  {
                    event: 'skillSpGained' as const,
                    priority: 0 as const,
                    sequence: { steps: skillSpGainedSteps },
                  },
                ]),
            ...(skillEndSteps.length === 0
              ? []
              : [
                  {
                    event: 'skillEnd' as const,
                    priority: 0 as const,
                    sequence: { steps: skillEndSteps },
                  },
                ]),
            ...(buffConsumedSteps.length === 0
              ? []
              : [
                  {
                    event: 'buffConsumed' as const,
                    priority: 0 as const,
                    sequence: { steps: buffConsumedSteps },
                  },
                ]),
            ...(enterFightSteps.length === 0
              ? []
              : [
                  {
                    event: 'enterFight' as const,
                    priority: 0 as const,
                    sequence: { steps: enterFightSteps },
                  },
                ]),
          ],
        }),
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
      const damageTag =
        condition.kind === 'damageDecorateMask' && condition.checkType === 'HasAll'
          ? ({ 256: 'normalSkill', 8192: 'comboSkill' } as const)[condition.mask as 256 | 8192]
          : undefined;
      if (damageTag !== undefined) {
        return {
          kind: 'eventDamageTagsMatch' as const,
          match: 'hasAll' as const,
          tags: [damageTag] as const,
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
): CompiledBuffSequenceSource {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    throw new Error('OnObtainAtb sequence owner/guard root filters are unsupported');
  }
  const nodes = source.actions.filter(node => node.metadata.enabled);
  const [filter, ...body] = nodes;
  if (
    filter?.body.kind !== 'leaf' ||
    filter.body.value.family !== 'condition' ||
    filter.body.value.action.kind !== 'obtainAtbType'
  ) {
    throw new Error('OnObtainAtb response must begin with CheckObtainAtbType');
  }
  const condition = filter.body.value.action;
  if (
    !condition.checkObtainType ||
    condition.obtainTypes.length !== 1 ||
    condition.obtainTypes[0] !== 'Skill' ||
    !condition.checkObtainMethod ||
    condition.obtainMethods.length !== 1 ||
    condition.obtainMethods[0] !== 'Gain'
  ) {
    throw new Error(`${filter.sourcePath}: only CheckObtainAtbType(Skill, Gain) can be projected`);
  }
  return { steps: compileLinearNodes(body, visualOnlyIds) };
}

function compileLinearSequence(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
): CompiledBuffSequenceSource {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    throw new Error('sequence owner/guard root filters are not yet supported');
  }
  const nodes = source.actions.filter(node => node.metadata.enabled);
  return { steps: compileLinearNodes(nodes, visualOnlyIds) };
}

function compileLinearNodes(
  nodes: readonly NativeActionNodeSource<KnownNativeActionLeafSource>[],
  visualOnlyIds: ReadonlySet<string>,
  partyTargetGroups: ReadonlySet<string> = new Set(),
): CompiledBuffStepSource[] {
  if (nodes.length === 0) return [];
  const [first, ...rest] = nodes;
  if (first!.body.kind === 'negateNextResult') {
    const [next, ...bodyNodes] = rest;
    if (next === undefined) throw new Error(`${first!.sourcePath}: dangling NotNextCheckAction`);
    const condition = compileEventCondition(next);
    if (condition === null)
      throw new Error(`${first!.sourcePath}: NotNextCheckAction must precede a condition`);
    const body = compileLinearNodes(bodyNodes, visualOnlyIds, partyTargetGroups);
    return body.length === 0
      ? []
      : [
          {
            kind: 'conditional',
            parameters: { condition: { kind: 'not', condition } },
            whenTrue: { steps: body },
          },
        ];
  }
  if (first!.body.kind === 'leaf' && first!.body.value.family === 'targetGroup') {
    const action = first!.body.value.action;
    if (action.producerType === 'MergeTargetAction') {
      const sources = action.inputTargets.map((target, index) => {
        if (target.targetSource === 'Target' && target.targetGroupKey === '') {
          return { kind: 'target' as const, target: 'eventTarget' as const };
        }
        if (target.targetSource === 'Context' && target.targetGroupKey !== '') {
          return { kind: 'context' as const, contextKey: target.targetGroupKey };
        }
        throw new Error(
          `${first!.sourcePath}.targets[${index}]: unsupported Buff merge target source`,
        );
      });
      return [
        {
          kind: 'mergeContextTargets',
          parameters: { saveToContextKey: action.targetGroupKey, sources },
        },
        ...compileLinearNodes(rest, visualOnlyIds, partyTargetGroups),
      ];
    }
    if (
      action.producerType !== 'FindTargetAction' ||
      action.finderType !== 'CharacterTeamFinder' ||
      action.validatorTypes.length !== 0 ||
      action.postProcessorTypes.length !== 0 ||
      action.center !== 'ActionOwner' ||
      action.centerContextKey !== '' ||
      action.selectorOwner !== 'ActionOwner' ||
      action.selectorOwnerContextKey !== ''
    ) {
      throw new Error(`${first!.sourcePath}: unsupported Buff target group query`);
    }
    const nextGroups = new Set(partyTargetGroups);
    nextGroups.add(action.targetGroupKey);
    return compileLinearNodes(rest, visualOnlyIds, nextGroups);
  }
  const condition = compileEventCondition(first!);
  if (condition !== null) {
    const body = compileLinearNodes(rest, visualOnlyIds, partyTargetGroups);
    return body.length === 0
      ? []
      : [{ kind: 'conditional', parameters: { condition }, whenTrue: { steps: body } }];
  }
  return [
    ...compileActionNode(first!, visualOnlyIds, partyTargetGroups),
    ...compileLinearNodes(rest, visualOnlyIds, partyTargetGroups),
  ];
}

function compileEventCondition(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
): CompiledBuffConditionSource | null {
  if (node.body.kind !== 'leaf' || node.body.value.family !== 'condition') return null;
  return compileConditionLeaf(node.body.value.action, node.sourcePath);
}

function compileConditionLeaf(
  condition: Extract<KnownNativeActionLeafSource, { family: 'condition' }>['action'],
  sourcePath: string,
): CompiledBuffConditionSource {
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
    if (condition.checkType !== 'Tag' || condition.buffIds.length > 0) {
      throw new Error(`${sourcePath}: unsupported event Buff identity condition`);
    }
    const match = TAG_QUERY_TYPES[condition.queryType];
    if (match === undefined) {
      throw new Error(
        `${sourcePath}: unsupported event Buff tag query ${JSON.stringify(condition.queryType)}`,
      );
    }
    return {
      kind: 'eventBuffTagsMatch',
      match,
      buffTagIds: condition.buffTagIds,
      ...(condition.buffIdOutputKey === undefined
        ? {}
        : { buffIdOutputKey: condition.buffIdOutputKey }),
    };
  }
  if (condition.kind === 'buffStack') {
    if (
      (condition.targetSource !== 'Target' && condition.targetSource !== 'Owner') ||
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
        target: condition.targetSource === 'Owner' ? 'buffOwner' : 'eventTarget',
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
        const compiled = compileConditionLeaf(child, sourcePath);
        return group.negated[index] ? ({ kind: 'not', condition: compiled } as const) : compiled;
      });
      return conditions.length === 1 ? conditions[0]! : ({ kind: 'all', conditions } as const);
    });
    return groups.length === 1 ? groups[0]! : { kind: 'any', conditions: groups };
  }
  if (condition.kind === 'globalCooldown') {
    if (
      condition.targetSource !== 'Owner' ||
      condition.targetGroupKey !== '' ||
      condition.buffId.length === 0
    ) {
      throw new Error(`${sourcePath}: unsupported global cooldown condition target`);
    }
    return {
      kind: 'not',
      condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: condition.buffId },
    };
  }
  throw new Error(`${sourcePath}: unsupported Buff runtime condition ${condition.kind}`);
}

function compileConditionSequence(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  sourcePath: string,
): CompiledBuffConditionSource {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard)
    throw new Error(`${sourcePath}: condition sequence owner/guard filters are unsupported`);
  const conditions = source.actions
    .filter(node => node.metadata.enabled)
    .map(node => {
      if (node.body.kind !== 'leaf' || node.body.value.family !== 'condition')
        throw new Error(`${node.sourcePath}: expected a condition-only sequence`);
      return compileConditionLeaf(node.body.value.action, node.sourcePath);
    });
  if (conditions.length === 0) throw new Error(`${sourcePath}: empty condition sequence`);
  return conditions.length === 1 ? conditions[0]! : { kind: 'all', conditions };
}

function compileActionNode(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
  partyTargetGroups: ReadonlySet<string> = new Set(),
): CompiledBuffStepSource[] {
  if (node.body.kind === 'ifElse') {
    if (!node.body.alwaysNext)
      throw new Error(`${node.sourcePath}: stopping IfElse is unsupported`);
    const condition = compileConditionSequence(node.body.condition, node.sourcePath);
    const whenTrue = compileLinearSequence(node.body.whenTrue, visualOnlyIds);
    const whenFalse = compileLinearSequence(node.body.whenFalse, visualOnlyIds);
    return [
      {
        kind: 'conditional',
        parameters: { condition, alwaysNext: true },
        whenTrue,
        ...(whenFalse.steps.length === 0 ? {} : { whenFalse }),
      },
    ];
  }
  if (node.body.kind !== 'leaf') {
    throw new Error(`${node.sourcePath}: unsupported Buff runtime action`);
  }
  if (node.body.value.family === 'buffApplication') {
    return compileBuffApplication(
      node.body.value.action,
      visualOnlyIds,
      node.sourcePath,
      partyTargetGroups,
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
      action.owner.targetSource !== 'Owner' ||
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
          target: 'buffOwner',
          buffIds,
          reason: action.isFinishedEarly ? 'early' : 'other',
          ...(action.finishAll ? {} : { count: actionValueOperand(action.finishLayerCount) }),
        },
      },
    ];
  }
  if (node.body.value.family === 'damage') {
    return [compileEventTargetSimpleDamageOperationSource(node.body.value.action, node.sourcePath)];
  }
  if (node.body.value.family === 'buffQuery') {
    const action = node.body.value.action;
    if (
      (action.target.targetSource !== 'Target' && action.target.targetSource !== 'Owner') ||
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
          target: action.target.targetSource === 'Owner' ? 'buffOwner' : 'eventTarget',
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
    if (
      action.target.targetSource !== 'Source' ||
      action.target.targetGroupKey !== '' ||
      action.buffId.length === 0
    ) {
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
  partyTargetGroups: ReadonlySet<string> = new Set(),
): CompiledBuffStepSource[] {
  for (const entry of action.buffs) {
    if (entry.readIdFromBlackboard || entry.buffId.length === 0)
      throw new Error(`${sourcePath}: dynamic Buff identity is unsupported`);
  }
  // 纯表现子 Buff 的动作生命周期只持有并清理表现资源；来源已完整解析后可从无渲染后端省略。
  if (action.buffs.every(entry => visualOnlyIds.has(entry.buffId))) return [];
  if (
    action.autoFinishByAction ||
    action.inheritSkillIds.length > 0 ||
    action.inheritSourceSkillCastId ||
    action.isExtra ||
    action.passTargetGroupsToBuff ||
    action.overrideBuffIconDuration
  ) {
    throw new Error(`${sourcePath}: unsupported CreateBuff lifecycle options`);
  }
  const target =
    (action.target.targetGroupKey ?? '') === '' && action.target.targetSource === 'Owner'
      ? ('buffOwner' as const)
      : (action.target.targetGroupKey ?? '') === '' && action.target.targetSource === 'Source'
        ? ('eventSource' as const)
        : (action.target.targetGroupKey ?? '') === '' && action.target.targetSource === 'Target'
          ? ('eventTarget' as const)
          : action.target.targetSource === 'Context' &&
              partyTargetGroups.has(action.target.targetGroupKey ?? '')
            ? ('party' as const)
            : isPartyExceptOwnerInstantSearch(action.target)
              ? ('partyExceptCaster' as const)
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
    target.targetGroupKey === '' &&
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

export function isPresentationOnlyBuffStackEffect(source: BuffRuntimeSource): boolean {
  return (
    source.lifecycle.stackEffectCount > 0 &&
    source.lifecycle.stackEffectActionTypes.every(type => type === 'EffectAction') &&
    !source.presentation.hasIcon &&
    source.presentation.spritePath === '' &&
    source.attributeModifiers.modifiers.length === 0 &&
    source.damageModifiers.length === 0 &&
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
