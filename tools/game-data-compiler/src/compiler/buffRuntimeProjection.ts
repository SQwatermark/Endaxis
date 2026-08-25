import {
  compileResolvedAttributeModifierSource,
  projectCombatRuntimeAttributeKey,
} from './attributeModifier.ts';
import {
  compileEventTargetSimpleDamageOperationSource,
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

export type CompiledBuffConditionSource =
  | {
      readonly kind: 'eventOverheal';
      readonly overHealKey?: string;
      readonly finalHealKey?: string;
      readonly realHealKey?: string;
    }
  | {
      readonly kind: 'eventPhysicalInflictionTypeIn';
      readonly types: readonly ('airborne' | 'knockDown' | 'fracture' | 'crush')[];
    }
  | {
      readonly kind: 'eventSkillTypeIn';
      readonly skillTypes: readonly ('battleSkill' | 'comboSkill' | 'ultimate')[];
    }
  | {
      readonly kind: 'eventBuffTagsMatch';
      readonly match: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      readonly buffTagIds: readonly number[];
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
      readonly target: 'eventTarget';
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
      readonly kind: 'applyBuff';
      readonly parameters: {
        readonly buffId: string;
        readonly target: 'caster' | 'eventTarget';
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
        readonly target: 'eventTarget';
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
      readonly kind: 'modifyActionValue';
      readonly parameters: {
        readonly key: string;
        readonly operation: 'assign' | 'add' | 'multiply' | 'divide';
        readonly value:
          | { readonly kind: 'constant'; readonly value: number }
          | { readonly kind: 'blackboard'; readonly key: string };
      };
    }
  | CompiledSimpleDamageOperationSource
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
  readonly lifecycleSequences?: {
    readonly start?: CompiledBuffSequenceSource;
    readonly enable?: CompiledBuffSequenceSource;
  };
  readonly abilityEventResponses?: readonly {
    readonly event:
      'beforeCastSkill' | 'outputBuff' | 'beforeOutputPhysicalInfliction' | 'outputHeal';
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
  for (const event of source.graph.buffEvents) {
    const target =
      event.event === 'OnBuffStart'
        ? startSequences
        : event.event === 'DuringBuffEnable'
          ? enableSequences
          : null;
    if (target === null) throw new Error(`unsupported Buff event ${JSON.stringify(event.event)}`);
    for (const sequence of event.actions) {
      const compiled = compileLinearSequence(sequence, visualOnlyIds);
      if (compiled.steps.length > 0) target.push(compiled);
    }
  }
  const beforeCastSteps: CompiledBuffStepSource[] = [];
  const outputBuffSteps: CompiledBuffStepSource[] = [];
  const beforeOutputPhysicalInflictionSteps: CompiledBuffStepSource[] = [];
  const outputHealSteps: CompiledBuffStepSource[] = [];
  for (const event of source.graph.abilityEvents) {
    if (omittedAbilityEvents.has(event.event)) continue;
    const target =
      event.event === 'OnBeforeCastSkill'
        ? beforeCastSteps
        : event.event === 'OnOutputBuff'
          ? outputBuffSteps
          : event.event === 'OnBeforeOutputPhysicalInfliction'
            ? beforeOutputPhysicalInflictionSteps
            : event.event === 'OnOutputHeal'
              ? outputHealSteps
              : null;
    if (target === null)
      throw new Error(`unsupported ability event ${JSON.stringify(event.event)}`);
    for (const sequence of event.actions)
      target.push(...compileLinearSequence(sequence, visualOnlyIds).steps);
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
    ...(startSequences.length === 0 && enableSequences.length === 0
      ? {}
      : {
          lifecycleSequences: {
            ...(startSequences.length === 0 ? {} : { start: mergeSequences(startSequences) }),
            ...(enableSequences.length === 0 ? {} : { enable: mergeSequences(enableSequences) }),
          },
        }),
    ...(beforeCastSteps.length === 0 &&
    outputBuffSteps.length === 0 &&
    beforeOutputPhysicalInflictionSteps.length === 0 &&
    outputHealSteps.length === 0
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
            ...(outputHealSteps.length === 0
              ? []
              : [
                  {
                    event: 'outputHeal' as const,
                    priority: 0 as const,
                    sequence: { steps: outputHealSteps },
                  },
                ]),
          ],
        }),
  };
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
): CompiledBuffStepSource[] {
  if (nodes.length === 0) return [];
  const [first, ...rest] = nodes;
  if (first!.body.kind === 'negateNextResult') {
    const [next, ...bodyNodes] = rest;
    if (next === undefined) throw new Error(`${first!.sourcePath}: dangling NotNextCheckAction`);
    const condition = compileEventCondition(next);
    if (condition === null)
      throw new Error(`${first!.sourcePath}: NotNextCheckAction must precede a condition`);
    const body = compileLinearNodes(bodyNodes, visualOnlyIds);
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
  const condition = compileEventCondition(first!);
  if (condition !== null) {
    const body = compileLinearNodes(rest, visualOnlyIds);
    return body.length === 0
      ? []
      : [{ kind: 'conditional', parameters: { condition }, whenTrue: { steps: body } }];
  }
  return [...compileActionNode(first!, visualOnlyIds), ...compileLinearNodes(rest, visualOnlyIds)];
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
    return { kind: 'eventBuffTagsMatch', match, buffTagIds: condition.buffTagIds };
  }
  if (condition.kind === 'buffStack') {
    if (
      condition.targetSource !== 'Target' ||
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
        target: 'eventTarget',
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
    return compileBuffApplication(node.body.value.action, visualOnlyIds, node.sourcePath);
  }
  if (node.body.value.family === 'damage') {
    return [compileEventTargetSimpleDamageOperationSource(node.body.value.action, node.sourcePath)];
  }
  if (node.body.value.family === 'buffQuery') {
    const action = node.body.value.action;
    if (
      action.target.targetSource !== 'Target' ||
      action.target.targetGroupKey !== '' ||
      action.countType !== 'BuffCount' ||
      action.limitSkillCastId
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff stack read`);
    }
    const query =
      action.checkType === 'Tag' && action.buffIds.length === 0
        ? {
            kind: 'tag' as const,
            tagQueryType: action.tagQueryType,
            buffTagIds: action.buffTagIds,
          }
        : null;
    if (query === null)
      throw new Error(
        `${node.sourcePath}: BuffCount projection currently requires a tag query with instance counting`,
      );
    return [
      {
        kind: 'readBuffStackCount',
        parameters: {
          target: 'eventTarget',
          outputKey: action.outputKey,
          countType: 'instance',
          query,
        },
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
): CompiledBuffStepSource[] {
  if (action.count.blackboardKey !== null || action.count.value !== 1)
    throw new Error(`${sourcePath}: Buff count must be fixed at one`);
  const target =
    (action.target.targetGroupKey ?? '') === '' && action.target.targetSource === 'Owner'
      ? ('caster' as const)
      : (action.target.targetGroupKey ?? '') === '' && action.target.targetSource === 'Target'
        ? ('eventTarget' as const)
        : null;
  if (target === null || action.buffSource !== 'ActionOwner')
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
          target,
          ...(action.inheritSourceSkillCastInfo ? { inheritSourceSkillCastInfo: true } : {}),
          ...(Object.keys(assignments).length === 0 ? {} : { blackboardAssignments: assignments }),
        },
      },
    ];
  });
}

export function isPresentationOnlyBuffStackEffect(source: BuffRuntimeSource): boolean {
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

export function isAfterEnemyDefeatedOnlyBuffRuntime(source: BuffRuntimeSource): boolean {
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
const TAG_QUERY_TYPES: Readonly<Record<string, 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll'>> = {
  HasAny: 'hasAny',
  HasAll: 'hasAll',
  ExceptAny: 'exceptAny',
  ExceptAll: 'exceptAll',
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
