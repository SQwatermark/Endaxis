import { parseDeclaredBlackboard, type DeclaredBlackboardValueSource } from './blackboard.ts';
import { parseNativeSequenceSource, type NativeSequenceSource } from './controlFlow.ts';
import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNativeEnum,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import {
  parseKnownNativeActionLeafSource,
  type KnownNativeActionLeafSource,
} from './actionLeaf.ts';
import {
  collectSkillActionReferences,
  parseReferenceAwareActionLeafSource,
  type DefinitionReferenceSource,
  type ReferenceAwareActionLeafSource,
} from './referenceGraph.ts';
import type { BlackboardLevelValues } from './scalar.ts';
import { parseNativeAbilityEventName } from './abilityEvent.ts';
import {
  parseSkillTimelineActionSource,
  type SkillActionGraphSource,
  type SkillTimelineActionSource,
} from './skillActionGraph.ts';

const BUFF_DATA_FIELDS = new Set([
  'abilityEventAction',
  'addingCooldown',
  'applyTags',
  'attributeModifier',
  'blackboard',
  'buffEventAction',
  'damageModifier',
  'dispelConfig',
  'duration',
  'finishOnRepatriate',
  'globalModifier',
  'hasAddingCooldown',
  'hasIcon',
  'healModifier',
  'iconConfig',
  'id',
  'igniteEventAction',
  'ignoreCooldownWhenAdding',
  'ignoreTagImmune',
  'lifeType',
  'maxTriggerCnt',
  'onlyUseSelfTimeDilation',
  'poiseModifier',
  'shieldConfigs',
  'stackingSettings',
  'tagsAfterTriggerExtendBuffAction',
  'timelineActions',
  'triggerInterval',
  'useTimeDilationDt',
  'waitFirstTriggerInterval',
]);

export interface BuffNamedActionEventSource<TLeaf> {
  /** 未命名原生事件会序列化成数字；不能猜成某个枚举名称。 */
  readonly event: string | number;
  readonly actions: readonly NativeSequenceSource<TLeaf>[];
}

export interface BuffIgniteActionEventSource<TLeaf> {
  readonly igniteType: string;
  readonly finishAfterIgnited: boolean;
  readonly actions: readonly NativeSequenceSource<TLeaf>[];
}

export interface BuffActionGraphSource<TLeaf> {
  readonly buffId: string;
  readonly declaredBlackboard: readonly DeclaredBlackboardValueSource[];
  readonly useTimeDilationDeltaTime: boolean;
  readonly onlyUseSelfTimeDilation: boolean;
  readonly timelineActions: readonly SkillTimelineActionSource<TLeaf>[];
  readonly buffEvents: readonly BuffNamedActionEventSource<TLeaf>[];
  readonly abilityEvents: readonly BuffNamedActionEventSource<TLeaf>[];
  readonly igniteEvents: readonly BuffIgniteActionEventSource<TLeaf>[];
}

export function parseReferenceAwareBuffActionGraphSource(
  value: unknown,
  sourcePath: string,
  inheritedBlackboard: BlackboardLevelValues,
): BuffActionGraphSource<ReferenceAwareActionLeafSource> {
  return parseBuffActionGraphSource(
    value,
    sourcePath,
    inheritedBlackboard,
    parseReferenceAwareActionLeafSource,
  );
}

/**
 * 可执行投影专用的 Buff 动作图入口。与引用闭包入口不同，此处要求每个动作叶子都已进入
 * 公共来源 IR；未知原生动作必须在精确路径失败，不能被投影层当成无效果动作跳过。
 */
export function parseKnownNativeBuffActionGraphSource(
  value: unknown,
  sourcePath: string,
  inheritedBlackboard: BlackboardLevelValues,
): BuffActionGraphSource<KnownNativeActionLeafSource> {
  return parseBuffActionGraphSource(
    value,
    sourcePath,
    inheritedBlackboard,
    parseKnownNativeActionLeafSource,
  );
}

function parseBuffActionGraphSource<TLeaf>(
  value: unknown,
  sourcePath: string,
  inheritedBlackboard: BlackboardLevelValues,
  parseLeaf: (value: unknown, path: string, inherited: BlackboardLevelValues) => TLeaf,
): BuffActionGraphSource<TLeaf> {
  const root = requireRecord(value, sourcePath);
  requireExactFields(root, BUFF_DATA_FIELDS, sourcePath);
  const parseSequence = (sequence: unknown, path: string) =>
    parseNativeSequenceSource(sequence, path, inheritedBlackboard, (leaf, leafPath) =>
      parseLeaf(leaf, leafPath, inheritedBlackboard),
    );
  return {
    buffId: requireNonEmptyString(root.id, `${sourcePath}.id`),
    declaredBlackboard: parseDeclaredBlackboard(root, sourcePath),
    useTimeDilationDeltaTime: requireBoolean(
      root.useTimeDilationDt,
      `${sourcePath}.useTimeDilationDt`,
    ),
    onlyUseSelfTimeDilation: requireBoolean(
      root.onlyUseSelfTimeDilation,
      `${sourcePath}.onlyUseSelfTimeDilation`,
    ),
    timelineActions: requireArray(root.timelineActions, `${sourcePath}.timelineActions`).map(
      (timeline, index) =>
        parseSkillTimelineActionSource(
          timeline,
          `${sourcePath}.timelineActions[${index}]`,
          inheritedBlackboard,
          (leaf, leafPath) => parseLeaf(leaf, leafPath, inheritedBlackboard),
        ),
    ),
    buffEvents: parseNamedEvents(
      root.buffEventAction,
      `${sourcePath}.buffEventAction`,
      'buffEvent',
      parseSequence,
    ),
    abilityEvents: parseNamedEvents(
      root.abilityEventAction,
      `${sourcePath}.abilityEventAction`,
      'abilityEvent',
      parseSequence,
    ),
    igniteEvents: requireArray(root.igniteEventAction, `${sourcePath}.igniteEventAction`).map(
      (rawEvent, index) => {
        const eventPath = `${sourcePath}.igniteEventAction[${index}]`;
        const event = requireRecord(rawEvent, eventPath);
        requireExactFields(
          event,
          new Set(['igniteType', 'finishAfterIgnited', 'actions']),
          eventPath,
        );
        return {
          igniteType: requireNativeEnum(
            event.igniteType,
            new Map([
              [1, 'PhysicalStatus'],
              [2, 'EnergyShardByFire'],
              [3, 'EnergyShardByPulse'],
              [4, 'EnergyShardByCryst'],
              [5, 'EnergyShardByNatural'],
              [6, 'EndminUlt'],
              [7, 'NoGuard'],
            ] as const),
            `${eventPath}.igniteType`,
          ),
          finishAfterIgnited: requireBoolean(
            event.finishAfterIgnited,
            `${eventPath}.finishAfterIgnited`,
          ),
          actions: parseEventSequences(event.actions, `${eventPath}.actions`, parseSequence),
        };
      },
    ),
  };
}

export function collectBuffActionReferences(
  graph: BuffActionGraphSource<ReferenceAwareActionLeafSource>,
): DefinitionReferenceSource[] {
  const actionGraph: SkillActionGraphSource<ReferenceAwareActionLeafSource> = {
    skillId: graph.buffId,
    level: 0,
    durationFrame: 0,
    declaredBlackboard: graph.declaredBlackboard,
    actionGroup: {
      timelineActions: graph.timelineActions,
      passiveEvents: [
        ...graph.buffEvents.map(item => ({ abilityEvent: item.event, actions: item.actions })),
        ...graph.abilityEvents.map(item => ({ abilityEvent: item.event, actions: item.actions })),
        ...graph.igniteEvents.map(item => ({
          abilityEvent: item.igniteType,
          actions: item.actions,
        })),
      ],
    },
  };
  return collectSkillActionReferences(actionGraph);
}

function parseNamedEvents<TLeaf>(
  value: unknown,
  path: string,
  eventField: 'buffEvent' | 'abilityEvent',
  parseSequence: (value: unknown, path: string) => NativeSequenceSource<TLeaf>,
): BuffNamedActionEventSource<TLeaf>[] {
  return requireArray(value, path).flatMap((rawEvent, index) => {
    const eventPath = `${path}[${index}]`;
    const event = requireRecord(rawEvent, eventPath);
    requireExactFields(event, new Set([eventField, 'actions']), eventPath);
    const actions = parseEventSequences(event.actions, `${eventPath}.actions`, parseSequence);
    // 当前 VFS 数据会序列化 Event.None + 空 actions 的占位项；它没有注册或执行语义。
    if (eventField === 'abilityEvent' && event[eventField] === 0 && actions.length === 0) return [];
    return [
      {
        event:
          eventField === 'buffEvent'
            ? parseBuffEventIdentity(event[eventField], `${eventPath}.${eventField}`)
            : parseEventIdentity(event[eventField], `${eventPath}.${eventField}`),
        actions,
      },
    ];
  });
}

function parseBuffEventIdentity(value: unknown, path: string): string {
  if (typeof value === 'string') return requireNonEmptyString(value, path);
  const names = [
    'OnBuffStart',
    'OnBuffTrigger',
    'OnBuffFinish',
    'OnBuffEnable',
    'OnBuffDisable',
    'DuringBuffEnable',
    'OnBuffEnhanceChanged',
    'OnBuffAfterTryEnhanced',
    'OnBuffBeforeTryEnhanced',
    'OnBuffDispelled',
    'OnBuffFinishedEarlyInterrupted',
    'OnBuffReleased',
  ] as const;
  const index = requireInteger(value, path);
  const name = names[index];
  if (name === undefined) throw new Error(`${path}: unknown Buff.Event value ${index}`);
  return name;
}

function parseEventIdentity(value: unknown, path: string): string {
  return parseNativeAbilityEventName(value, path);
}

function parseEventSequences<TLeaf>(
  value: unknown,
  path: string,
  parseSequence: (value: unknown, path: string) => NativeSequenceSource<TLeaf>,
): NativeSequenceSource<TLeaf>[] {
  return requireArray(value, path).map((sequence, index) =>
    parseSequence(sequence, `${path}[${index}]`),
  );
}
