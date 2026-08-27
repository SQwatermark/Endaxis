import {
  requireExactFields,
  requireBoolean,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';

export type ElementalInflictionTypeSource = 'Fire' | 'Pulse' | 'Cryst' | 'Natural';

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
  const element = requireNonEmptyString(action.spellBurstType, `${path}.spellBurstType`);
  if (!['Fire', 'Pulse', 'Cryst', 'Natural'].includes(element))
    throw new Error(`${path}.spellBurstType: unsupported element ${JSON.stringify(element)}`);
  return { kind: 'triggerSpellBurstEvent', element: element as ElementalInflictionTypeSource };
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
  const element = requireNonEmptyString(action.type, `${path}.type`);
  if (!['Fire', 'Pulse', 'Cryst', 'Natural', 'Burst'].includes(element))
    throw new Error(`${path}.type: unsupported element ${JSON.stringify(element)}`);
  return { kind: 'spellInflictionStartedEvent', element: element as ElementalInflictionTypeSource };
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
  const element = requireNonEmptyString(action.abnormalType, `${path}.abnormalType`);
  if (!['Fire', 'Pulse', 'Cryst', 'Natural', 'Burst'].includes(element))
    throw new Error(`${path}.abnormalType: unsupported element ${JSON.stringify(element)}`);
  return {
    kind: 'spellAbnormalLifecycleEvent',
    isStart: requireBoolean(action.isStart, `${path}.isStart`),
    abnormalType: element as ElementalInflictionTypeSource | 'Burst',
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
  const statusElement = requireNonEmptyString(action.spellStatusType, `${path}.spellStatusType`);
  if (!['Fire', 'Pulse', 'Cryst', 'Natural'].includes(statusElement)) {
    throw new Error(
      `${path}.spellStatusType: unsupported element ${JSON.stringify(statusElement)}`,
    );
  }
  return {
    kind: 'forcedElementalStatus',
    source: parseTargetReferenceSource(action.source, `${path}.source`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    statusElement: statusElement as ElementalInflictionTypeSource,
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
  const element = requireNonEmptyString(action.inflictionType, `${path}.inflictionType`);
  if (!['Fire', 'Pulse', 'Cryst', 'Natural'].includes(element))
    throw new Error(
      `${path}.inflictionType: unsupported elemental infliction ${JSON.stringify(element)}`,
    );
  return {
    kind: 'elementalInfliction',
    source: parseTargetReferenceSource(action.source, `${path}.source`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    element: element as ElementalInflictionTypeSource,
    isExtra: requireBoolean(action.isExtra, `${path}.isExtra`),
  };
}
