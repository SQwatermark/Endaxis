import { compileResolvedAttributeModifierSource } from '../../compiler/attributeModifier.ts';
import { collectBuffActionReferences } from '../../source/buffActionGraph.ts';
import type { BuffApplicationActionSource } from '../../source/buffActions.ts';
import type { NativeActionNodeSource, NativeSequenceSource } from '../../source/controlFlow.ts';
import { requireRecord } from '../../source/primitives.ts';
import {
  parseBuffRuntimeSource,
  type BuffPresentationSource,
  type BuffRuntimeSource,
  type BuffStackingTypeSource,
} from '../../source/buffRuntime.ts';
import type { KnownNativeActionLeafSource } from '../../source/actionLeaf.ts';
import type { ScalarSource } from '../../source/scalar.ts';
import type {
  CompiledGearSetStaticDefinitionSource,
  CompiledGearSetToggleBuffGroupSource,
  UnresolvedSkillBlackboardValueSource,
} from './suitStaticDefinition.ts';
import type { EquipmentDefinitionDiagnosticSource } from './formalDefinition.ts';

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

export type CompiledEquipmentBuffConditionSource = {
  readonly kind: 'eventSkillTypeIn';
  readonly skillTypes: readonly ('battleSkill' | 'comboSkill' | 'ultimate')[];
};

export type CompiledEquipmentBuffStepSource =
  | {
      readonly kind: 'applyBuff';
      readonly parameters: {
        readonly buffId: string;
        readonly target: 'caster';
        readonly inheritSourceSkillCastInfo?: boolean;
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
      readonly parameters: { readonly condition: CompiledEquipmentBuffConditionSource };
      readonly whenTrue: CompiledEquipmentBuffSequenceSource;
    };

export interface CompiledEquipmentBuffSequenceSource {
  readonly steps: readonly CompiledEquipmentBuffStepSource[];
}

export interface CompiledEquipmentBuffDefinitionSource {
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
  readonly lifecycleSequences?: { readonly enable: CompiledEquipmentBuffSequenceSource };
  readonly abilityEventResponses?: readonly {
    readonly event: 'beforeCastSkill';
    readonly priority: 0;
    readonly sequence: CompiledEquipmentBuffSequenceSource;
  }[];
}

export interface CompiledEquipmentSuitRuntimeBatchSource {
  readonly definitions: readonly (CompiledGearSetStaticDefinitionSource & {
    readonly buffDefinitions?: Readonly<Record<string, CompiledEquipmentBuffDefinitionSource>>;
    readonly initializationSequence?: CompiledEquipmentBuffSequenceSource;
  })[];
  readonly diagnostics: readonly EquipmentDefinitionDiagnosticSource[];
}

/**
 * 将套装静态候选的根 Buff 闭包投影为正式 Next Buff 资源和帧 0 安装动作。
 * 当前公共动作 IR 只完整表达技能类型守卫与 CreateBuff；任何其他非表现行为都会阻塞该套装。
 */
export function compileEquipmentSuitRuntimeBatchSource(
  definitions: readonly CompiledGearSetStaticDefinitionSource[],
  dependencies: readonly {
    readonly suitId: string;
    readonly skillId: string;
    readonly startupBuffIds: readonly string[];
    readonly startupBuffs?: readonly {
      readonly buffId: string;
      readonly blackboardAssignments: Readonly<
        Record<string, number | string | UnresolvedSkillBlackboardValueSource>
      >;
    }[];
    readonly toggleBuffIds: readonly string[];
    readonly toggleBuffs: readonly CompiledGearSetToggleBuffGroupSource[];
  }[],
  buffDataValue: unknown,
): CompiledEquipmentSuitRuntimeBatchSource {
  const buffData = requireRecord(buffDataValue, 'BuffData');
  const dependenciesBySuit = new Map(dependencies.map(item => [item.suitId, item]));
  const diagnostics: EquipmentDefinitionDiagnosticSource[] = [];
  const output: CompiledEquipmentSuitRuntimeBatchSource['definitions'][number][] = [];

  for (const definition of definitions) {
    const dependency = dependenciesBySuit.get(definition.slug);
    if (dependency === undefined) {
      diagnostics.push({
        status: 'blocked',
        sourcePath: `EquipSuitTable.${definition.slug}`,
        reason: 'missing compiled suit runtime dependency',
      });
      continue;
    }
    const activeToggleInstallations: CompiledGearSetToggleBuffGroupSource['buffs'][number][] = [];
    let toggleBlocked = false;
    for (const [groupIndex, group] of dependency.toggleBuffs.entries()) {
      const conditionResults = group.conditions.map(condition =>
        evaluateFixedFullHealthToggleCondition(condition),
      );
      if (conditionResults.some(result => result === null)) {
        toggleBlocked = true;
        diagnostics.push({
          status: 'blocked',
          sourcePath: `SkillData.${dependency.skillId}.toggleBuffs[${groupIndex}]`,
          reason: 'toggle Buff condition requires an unmaterialized server passive skill value',
        });
        continue;
      }
      if (conditionResults.some(result => result === false)) {
        diagnostics.push({
          status: 'scenario-omitted',
          sourcePath: `SkillData.${dependency.skillId}.toggleBuffs[${groupIndex}]`,
          reason: 'toggle Buff condition is false at fixed full health',
        });
        continue;
      }
      for (const installation of group.buffs) {
        const raw = buffData[installation.buffId];
        if (raw === undefined)
          throw new Error(`BuffData: missing toggle Buff ${JSON.stringify(installation.buffId)}`);
        const source = parseBuffRuntimeSource(raw, `BuffData.${installation.buffId}`);
        if (isAfterEnemyDefeatedOnly(source)) {
          diagnostics.push({
            status: 'scenario-omitted',
            sourcePath: `BuffData.${installation.buffId}.abilityEventAction`,
            reason:
              'enemy-defeated response occurs after the fixed single target simulation has ended',
          });
          continue;
        }
        activeToggleInstallations.push(installation);
      }
    }
    if (toggleBlocked) continue;
    const startupInstallations =
      dependency.startupBuffs ??
      dependency.startupBuffIds.map(buffId => ({ buffId, blackboardAssignments: {} }));
    const installations = [...startupInstallations, ...activeToggleInstallations];
    if (installations.length === 0) {
      output.push(definition);
      continue;
    }

    const sources = collectRuntimeClosure(
      installations.map(installation => installation.buffId),
      buffData,
    );
    const visualOnlyIds = new Set(
      [...sources.entries()]
        .filter(([, source]) => isPresentationOnlyStackEffect(source))
        .map(([id]) => id),
    );
    for (const id of visualOnlyIds) {
      diagnostics.push({
        status: 'scenario-omitted',
        sourcePath: `BuffData.${id}.stackingSettings.stackEffects`,
        reason: 'particle-only stack effect does not affect the fixed-target damage simulation',
      });
    }

    const buffDefinitions: Record<string, CompiledEquipmentBuffDefinitionSource> = {};
    let blocked = false;
    for (const [buffId, source] of sources) {
      if (visualOnlyIds.has(buffId)) continue;
      const omittedAbilityEvents = new Set<string | number>();
      for (const event of source.graph.abilityEvents) {
        if (event.event !== 'OnTakeDamage') continue;
        omittedAbilityEvents.add(event.event);
        diagnostics.push({
          status: 'scenario-omitted',
          sourcePath: `BuffData.${buffId}.abilityEventAction`,
          reason: 'player damage taken cannot occur without enemy active behavior',
        });
      }
      try {
        buffDefinitions[buffId] = compileEquipmentBuffRuntimeDefinitionSource(
          source,
          visualOnlyIds,
          omittedAbilityEvents,
        );
      } catch (error) {
        blocked = true;
        diagnostics.push({
          status: 'blocked',
          sourcePath: `BuffData.${buffId}`,
          reason: error instanceof Error ? error.message : String(error),
        });
      }
    }
    if (blocked) continue;
    const initializationSteps: CompiledEquipmentBuffStepSource[] = [];
    for (const installation of installations) {
      if (visualOnlyIds.has(installation.buffId)) continue;
      const rootSource = sources.get(installation.buffId);
      if (rootSource === undefined) {
        blocked = true;
        diagnostics.push({
          status: 'blocked',
          sourcePath: `BuffData.${installation.buffId}`,
          reason: 'startup Buff is missing from the compiled runtime closure',
        });
        continue;
      }
      const assignments: Record<
        string,
        { readonly kind: 'constant'; readonly value: number | string }
      > = {};
      for (const [targetKey, value] of Object.entries(installation.blackboardAssignments)) {
        if (isUnresolvedSkillBlackboardValue(value)) {
          if (buffRuntimeReadsBlackboardKey(rootSource, targetKey)) {
            blocked = true;
            diagnostics.push({
              status: 'blocked',
              sourcePath: `SkillData.${dependency.skillId}.buffs.${installation.buffId}.${targetKey}`,
              reason: `server passive skill blackboard value ${JSON.stringify(value.key)} is required by the installed Buff`,
            });
          } else {
            diagnostics.push({
              status: 'scenario-omitted',
              sourcePath: `SkillData.${dependency.skillId}.buffs.${installation.buffId}.${targetKey}`,
              reason: `unmaterialized server passive skill blackboard value ${JSON.stringify(value.key)} is never read by the installed Buff`,
            });
          }
          continue;
        }
        assignments[targetKey] = { kind: 'constant', value };
      }
      initializationSteps.push({
        kind: 'applyBuff',
        parameters: {
          buffId: installation.buffId,
          target: 'caster',
          ...(Object.keys(assignments).length === 0 ? {} : { blackboardAssignments: assignments }),
        },
      });
    }
    if (blocked) continue;
    output.push({
      ...definition,
      buffDefinitions: Object.fromEntries(
        Object.entries(buffDefinitions).sort(([left], [right]) => left.localeCompare(right)),
      ),
      initializationSequence: {
        steps: initializationSteps,
      },
    });
  }
  return { definitions: output, diagnostics };
}

export function evaluateFixedFullHealthToggleCondition(
  condition: CompiledGearSetToggleBuffGroupSource['conditions'][number],
): boolean | null {
  if (isUnresolvedSkillBlackboardValue(condition.value)) return null;
  const currentHpRatio = 1;
  switch (condition.comparison) {
    case 'GE':
      return currentHpRatio >= condition.value;
    case 'GT':
      return currentHpRatio > condition.value;
    case 'LE':
      return currentHpRatio <= condition.value;
    case 'LT':
      return currentHpRatio < condition.value;
    case 'EQ':
      return currentHpRatio === condition.value;
    case 'NE':
      return currentHpRatio !== condition.value;
    default:
      throw new Error(
        `unsupported current HP ratio comparison ${JSON.stringify(condition.comparison)}`,
      );
  }
}

function isUnresolvedSkillBlackboardValue(
  value: number | string | UnresolvedSkillBlackboardValueSource,
): value is UnresolvedSkillBlackboardValueSource {
  return typeof value === 'object' && value.kind === 'unresolvedSkillBlackboard';
}

/** Whether any executable/lifecycle field consumes a value from this Buff's local blackboard. */
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

function collectRuntimeClosure(
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
          `${reference.sourcePath}: dynamic Buff references cannot form a static suit definition`,
        );
      }
      queue.push(reference.id);
    }
  }
  return result;
}

export function compileEquipmentBuffRuntimeDefinitionSource(
  source: BuffRuntimeSource,
  visualOnlyIds: ReadonlySet<string> = new Set(),
  omittedAbilityEvents: ReadonlySet<string | number> = new Set(),
): CompiledEquipmentBuffDefinitionSource {
  if (source.unsupportedPayloads.length > 0) {
    throw new Error(
      `unsupported Buff payloads: ${source.unsupportedPayloads.map(item => item.field).join(', ')}`,
    );
  }
  if (source.graph.timelineActions.length > 0 || source.graph.igniteEvents.length > 0) {
    throw new Error('Buff timelines and ignite events are not yet supported by the suit projector');
  }
  const enableSequences: CompiledEquipmentBuffSequenceSource[] = [];
  for (const event of source.graph.buffEvents) {
    if (event.event !== 'DuringBuffEnable')
      throw new Error(`unsupported Buff event ${JSON.stringify(event.event)}`);
    for (const sequence of event.actions) {
      const compiled = compileLinearSequence(sequence, visualOnlyIds);
      if (compiled.steps.length > 0) enableSequences.push(compiled);
    }
  }
  const beforeCastSteps: CompiledEquipmentBuffStepSource[] = [];
  for (const event of source.graph.abilityEvents) {
    if (omittedAbilityEvents.has(event.event)) continue;
    if (event.event !== 'OnBeforeCastSkill')
      throw new Error(`unsupported ability event ${JSON.stringify(event.event)}`);
    for (const sequence of event.actions)
      beforeCastSteps.push(...compileLinearSequence(sequence, visualOnlyIds).steps);
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
        attribute: modifier.attributeType,
        slot: compiled.slot,
        value: scalarOperand(modifier.parameter),
      };
    }),
    ...(enableSequences.length === 0
      ? {}
      : { lifecycleSequences: { enable: mergeSequences(enableSequences) } }),
    ...(beforeCastSteps.length === 0
      ? {}
      : {
          abilityEventResponses: [
            {
              event: 'beforeCastSkill' as const,
              priority: 0 as const,
              sequence: { steps: beforeCastSteps },
            },
          ],
        }),
  };
}

function compileLinearSequence(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
): CompiledEquipmentBuffSequenceSource {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    throw new Error('sequence owner/guard root filters are not yet supported');
  }
  const nodes = source.actions.filter(node => node.metadata.enabled);
  if (nodes.length === 0) return { steps: [] };
  const first = nodes[0]!;
  const condition = compileSkillTypeCondition(first);
  if (condition !== null) {
    const body = nodes.slice(1).flatMap(node => compileActionNode(node, visualOnlyIds));
    if (body.length === 0) return { steps: [] };
    return {
      steps: [{ kind: 'conditional', parameters: { condition }, whenTrue: { steps: body } }],
    };
  }
  return { steps: nodes.flatMap(node => compileActionNode(node, visualOnlyIds)) };
}

function compileSkillTypeCondition(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
): CompiledEquipmentBuffConditionSource | null {
  if (
    node.body.kind !== 'leaf' ||
    node.body.value.family !== 'condition' ||
    node.body.value.action.kind !== 'skillType'
  )
    return null;
  return {
    kind: 'eventSkillTypeIn',
    skillTypes: node.body.value.action.skillTypes.map(skillType => {
      const mapped = SKILL_TYPES[skillType];
      if (mapped === undefined)
        throw new Error(`unsupported native skill type ${JSON.stringify(skillType)}`);
      return mapped;
    }),
  };
}

function compileActionNode(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
): CompiledEquipmentBuffStepSource[] {
  if (node.body.kind !== 'leaf' || node.body.value.family !== 'buffApplication') {
    throw new Error(`${node.sourcePath}: unsupported suit Buff action`);
  }
  return compileBuffApplication(node.body.value.action, visualOnlyIds, node.sourcePath);
}

function compileBuffApplication(
  action: BuffApplicationActionSource,
  visualOnlyIds: ReadonlySet<string>,
  sourcePath: string,
): CompiledEquipmentBuffStepSource[] {
  if (action.count.blackboardKey !== null || action.count.value !== 1)
    throw new Error(`${sourcePath}: Buff count must be fixed at one`);
  if (action.target.targetSource !== 'Owner' || action.buffSource !== 'ActionOwner')
    throw new Error(`${sourcePath}: unsupported Buff target/source`);
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
  return action.buffs.flatMap(entry => {
    if (entry.readIdFromBlackboard || entry.buffId.length === 0)
      throw new Error(`${sourcePath}: dynamic Buff identity is unsupported`);
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
          target: 'caster' as const,
          ...(action.inheritSourceSkillCastInfo ? { inheritSourceSkillCastInfo: true } : {}),
          ...(Object.keys(assignments).length === 0 ? {} : { blackboardAssignments: assignments }),
        },
      },
    ];
  });
}

function isPresentationOnlyStackEffect(source: BuffRuntimeSource): boolean {
  return (
    source.lifecycle.stackEffectCount > 0 &&
    source.lifecycle.stackEffectActionTypes.every(type => type === 'EffectAction') &&
    !source.presentation.hasIcon &&
    source.presentation.spritePath === '' &&
    source.attributeModifiers.modifiers.length === 0 &&
    source.applyTagIds.length === 0 &&
    source.extendTagIds.length === 0 &&
    source.unsupportedPayloads.length === 0 &&
    source.graph.timelineActions.length === 0 &&
    source.graph.buffEvents.length === 0 &&
    source.graph.abilityEvents.length === 0 &&
    source.graph.igniteEvents.length === 0
  );
}

function isAfterEnemyDefeatedOnly(source: BuffRuntimeSource): boolean {
  return (
    source.unsupportedPayloads.length === 0 &&
    source.attributeModifiers.modifiers.length === 0 &&
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

function signed(value: number, negate: boolean): number {
  return negate ? -value : value;
}
function mergeSequences(
  sequences: readonly CompiledEquipmentBuffSequenceSource[],
): CompiledEquipmentBuffSequenceSource {
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
