import {
  requireExactFields,
  requireBoolean,
  requireNativeEnum,
  requireRecord,
} from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';

export type ElementalInflictionTypeSource = 'Fire' | 'Pulse' | 'Cryst' | 'Natural';
const ELEMENTAL_INFLICTION_TYPES = ['Fire', 'Pulse', 'Cryst', 'Natural'] as const;
const SPELL_ABNORMAL_TYPES = [...ELEMENTAL_INFLICTION_TYPES, 'Burst'] as const;

export interface ElementalInflictionActionSource {
  readonly kind: 'elementalInfliction';
  readonly source: TargetReferenceSource;
  readonly target: TargetReferenceSource;
  readonly element: ElementalInflictionTypeSource;
  readonly isExtra: boolean;
}

export interface ForcedElementalStatusActionSource {
  readonly kind: 'forcedElementalStatus';
  readonly source: TargetReferenceSource;
  readonly target: TargetReferenceSource;
  readonly statusElement: ElementalInflictionTypeSource;
  readonly consumedLayers: ScalarSource;
  readonly statusCount: ScalarSource;
  readonly consumedElement: ScalarSource;
  readonly isExtra: boolean;
}

export interface SpellAbnormalLifecycleEventSource {
  readonly kind: 'spellAbnormalLifecycleEvent';
  readonly isStart: boolean;
  readonly abnormalType: ElementalInflictionTypeSource | 'Burst';
}

export interface ForceTriggerWeaknessEventSource {
  readonly kind: 'forceTriggerWeaknessEvent';
  readonly attacker: TargetReferenceSource;
  readonly defender: TargetReferenceSource;
}

export interface SpellInflictionStartedEventSource {
  readonly kind: 'spellInflictionStartedEvent';
  readonly element: ElementalInflictionTypeSource;
}

export interface TriggerSpellBurstEventSource {
  readonly kind: 'triggerSpellBurstEvent';
  readonly element: ElementalInflictionTypeSource;
}

export function parseTriggerSpellBurstEventSource(
  value: unknown,
  path: string,
): TriggerSpellBurstEventSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'spellBurstType',
    ]),
    path,
  );
  const element = requireNativeEnum(
    action.spellBurstType,
    ELEMENTAL_INFLICTION_TYPES,
    `${path}.spellBurstType`,
  );
  return { kind: 'triggerSpellBurstEvent', element };
}

/** OnBuffAfterTryEnhanced 发布 ON_SPELL_INFLICTION(31)；动作本身不改变附着层数。 */
export function parseSpellInflictionStartedEventSource(
  value: unknown,
  path: string,
): SpellInflictionStartedEventSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set(['$type', 'isEnable', 'priorityLevel', 'priorityOffset', 'serverActionIndex', 'type']),
    path,
  );
  const element = requireNativeEnum(action.type, ELEMENTAL_INFLICTION_TYPES, `${path}.type`);
  return { kind: 'spellInflictionStartedEvent', element };
}

export function parseForceTriggerWeaknessEventSource(
  value: unknown,
  path: string,
): ForceTriggerWeaknessEventSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'attacker',
      'defender',
    ]),
    path,
  );
  return {
    kind: 'forceTriggerWeaknessEvent',
    attacker: parseTargetReferenceSource(action.attacker, `${path}.attacker`),
    defender: parseTargetReferenceSource(action.defender, `${path}.defender`),
  };
}

/** 发布到 GameLevelEvent/BattleRecorder 的异常状态开始/结束事实，不直接改变战斗状态。 */
export function parseSpellAbnormalLifecycleEventSource(
  value: unknown,
  path: string,
): SpellAbnormalLifecycleEventSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'isStart',
      'abnormalType',
    ]),
    path,
  );
  const element = requireNativeEnum(
    action.abnormalType,
    SPELL_ABNORMAL_TYPES,
    `${path}.abnormalType`,
  );
  return {
    kind: 'spellAbnormalLifecycleEvent',
    isStart: requireBoolean(action.isStart, `${path}.isStart`),
    abnormalType: element,
  };
}

export function parseForcedElementalStatusActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): ForcedElementalStatusActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'source',
      'target',
      'spellStatusType',
      'consumedLayer',
      'count',
      'consumedType',
      'isExtra',
    ]),
    path,
  );
  const statusElement = requireNativeEnum(
    action.spellStatusType,
    ELEMENTAL_INFLICTION_TYPES,
    `${path}.spellStatusType`,
  );
  return {
    kind: 'forcedElementalStatus',
    source: parseTargetReferenceSource(action.source, `${path}.source`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    statusElement,
    consumedLayers: parseScalarSource(
      action.consumedLayer,
      `${path}.consumedLayer`,
      inheritedBlackboard,
    ),
    statusCount: parseScalarSource(action.count, `${path}.count`, inheritedBlackboard),
    consumedElement: parseScalarSource(
      action.consumedType,
      `${path}.consumedType`,
      inheritedBlackboard,
    ),
    isExtra: requireBoolean(action.isExtra, `${path}.isExtra`),
  };
}

/**
 * 与 combat-spec SpellInflictionDataAdapter 同构的严格来源切片。动作会进入元素附着生命周期，
 * 不能像表现或空间动作一样省略。
 */
export function parseElementalInflictionActionSource(
  value: unknown,
  path: string,
): ElementalInflictionActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'source',
      'target',
      'inflictionType',
      'isExtra',
    ]),
    path,
  );
  const element = requireNativeEnum(
    action.inflictionType,
    ELEMENTAL_INFLICTION_TYPES,
    `${path}.inflictionType`,
  );
  return {
    kind: 'elementalInfliction',
    source: parseTargetReferenceSource(action.source, `${path}.source`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    element,
    isExtra: requireBoolean(action.isExtra, `${path}.isExtra`),
  };
}
