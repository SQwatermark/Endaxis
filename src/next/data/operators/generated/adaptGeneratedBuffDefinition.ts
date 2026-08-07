/**
 * 将可审计的解包 Buff 中间表示收敛为通用运行时目录条目。
 * 该边界只接受当前运行时能够完整表达的定义；缺源或残留行为不得静默降级。
 */
import type { CombatBuffCatalogEntry } from '../../../core/combat/buffs/combatBuffCatalog';
import type {
  GeneratedBuffDefinitionSource,
  GeneratedScalarSource,
} from './generatedOperatorSource';

const STACKING_TYPES = {
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
} as const;

const ATTRIBUTE_SLOTS = {
  Addition: 'addition',
  Multiplier: 'multiplier',
  FinalAddition: 'finalAddition',
  FinalMultiplier: 'finalMultiplier',
  BaseAddition: 'baseAddition',
  BaseMultiplier: 'baseMultiplier',
  BaseFinalAddition: 'baseFinalAddition',
  BaseFinalMultiplier: 'baseFinalMultiplier',
} as const;

export function adaptGeneratedBuffDefinition(
  source: GeneratedBuffDefinitionSource,
): CombatBuffCatalogEntry {
  if (!source.sourceAvailable || source.lifecycle === null) {
    throw new Error(`buff '${source.buffId}' has no available source definition`);
  }
  const incompleteFields = [
    ...source.unparsedPayloads.map(payload => payload.field),
    ...presentBehaviorFields(source),
  ];
  if (incompleteFields.length > 0) {
    throw new Error(
      `buff '${source.buffId}' contains unsupported behavior: ${incompleteFields.join(', ')}`,
    );
  }
  if (source.lifecycle.hasStackEffects) {
    throw new Error(`buff '${source.buffId}' uses unsupported stack effects`);
  }
  const lifecycle = source.lifecycle;
  return {
    id: source.buffId,
    applyTagIds: source.applyTagIds,
    stackingType: STACKING_TYPES[lifecycle.stackingType],
    ...(lifecycle.stackingIdentifierType === 'StackingKey'
      ? { stackingKey: lifecycle.stackingKey }
      : {}),
    priority: scalarValue(lifecycle.priority, lifecycle.negatePriority),
    maxStackCount: requireFixedInteger(lifecycle.maxStackCount, 'maxStackCount'),
    ...(lifecycle.lifeType === 'Limited'
      ? { durationSeconds: scalarValue(lifecycle.duration) }
      : {}),
    ...(lifecycle.triggerInterval.value < 0 && lifecycle.triggerInterval.blackboardKey === null
      ? {}
      : {
          triggerIntervalSeconds: scalarValue(lifecycle.triggerInterval),
          waitFirstTriggerInterval: lifecycle.waitFirstTriggerInterval,
          maxTriggerCount: requireFixedInteger(lifecycle.maxTriggerCount, 'maxTriggerCount'),
        }),
    blackboard: Object.fromEntries(source.blackboard.map(item => [item.key, item.value])),
    attributeModifiers: source.attributeModifiers.map(modifier => {
      if (modifier.targetType !== 'Specific') {
        throw new Error(
          `buff '${source.buffId}' uses unsupported attribute target '${modifier.targetType}'`,
        );
      }
      return {
        attribute: modifier.attributeType,
        slot: ATTRIBUTE_SLOTS[modifier.slot],
        value: scalarValue(modifier.value),
      };
    }),
  };
}

function scalarValue(
  source: GeneratedScalarSource,
  negate = false,
): number | { readonly blackboardKey: string; readonly negate?: boolean } {
  if (source.blackboardKey === null) return negate ? -source.value : source.value;
  return { blackboardKey: source.blackboardKey, ...(negate ? { negate: true } : {}) };
}

function requireFixedInteger(source: GeneratedScalarSource, field: string): number {
  if (source.blackboardKey !== null || !Number.isSafeInteger(source.value)) {
    throw new Error(`${field} requires an unresolved dynamic or non-integer value`);
  }
  return source.value;
}

function presentBehaviorFields(source: GeneratedBuffDefinitionSource): string[] {
  const fields = [
    'directDamageHits',
    'conditionalActions',
    'blackboardCalculations',
    'blackboardMutations',
    'buffBlackboardReads',
    'buffFinishes',
    'eventActions',
    'resourceGains',
    'combatActions',
  ] as const;
  return fields.filter(field => source[field].length > 0);
}
