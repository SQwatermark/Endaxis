/**
 * 将可审计的解包 Buff 中间表示收敛为通用运行时定义条目。
 * 该边界只接受当前运行时能够完整表达的定义；缺源或残留行为不得静默降级。
 */
import type { CombatBuffDefinitionEntry } from '../../../core/combat/buffs/combatBuffDefinitions';
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
): CombatBuffDefinitionEntry {
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
    ...(source.presentation === undefined
      ? {}
      : {
          presentation: {
            visible: source.presentation.hasIcon,
            ...(source.presentation.spritePath === ''
              ? {}
              : { iconId: source.presentation.spritePath }),
            showInHeadBarCommon: source.presentation.showInHeadBarCommon,
            showInHeadBarAttached: source.presentation.showInHeadBarAttached,
            showInSquadIcon: source.presentation.showInSquadIcon,
            onlyShowForMainCharacter: source.presentation.onlyShowForMainCharacter,
            iconStyleInSquad: source.presentation.iconStyleInSquad,
            abnormalColorType: source.presentation.abnormalColorType,
            orderPriority: {
              useDirectoryValue: source.presentation.orderUseDirectoryValue,
              value: source.presentation.orderPriorityValue,
              category: source.presentation.orderPriorityEnum,
            },
          },
        }),
    ...(source.childPresentations === undefined || source.childPresentations.length === 0
      ? {}
      : {
          childPresentations: source.childPresentations.map(child => ({
            buffId: child.buffId,
            presentation: {
              visible: child.presentation.hasIcon,
              ...(child.presentation.spritePath === ''
                ? {}
                : { iconId: child.presentation.spritePath }),
              showInHeadBarCommon: child.presentation.showInHeadBarCommon,
              showInHeadBarAttached: child.presentation.showInHeadBarAttached,
              showInSquadIcon: child.presentation.showInSquadIcon,
              onlyShowForMainCharacter: child.presentation.onlyShowForMainCharacter,
              iconStyleInSquad: child.presentation.iconStyleInSquad,
              abnormalColorType: child.presentation.abnormalColorType,
              orderPriority: {
                useDirectoryValue: child.presentation.orderUseDirectoryValue,
                value: child.presentation.orderPriorityValue,
                category: child.presentation.orderPriorityEnum,
              },
            },
          })),
        }),
    applyTagIds: source.applyTagIds,
    extendTagIds: source.extendTagIds,
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
    ...(source.shields === undefined
      ? {}
      : {
          shields: source.shields.map(shield => ({
            infinityValue: shield.infinityValue,
            value: scalarValue(shield.value),
            absorbCount: scalarValue(shield.absorbCount),
            absorbAllDamageWhenConsumed: shield.absorbAllDamageWhenConsumed,
            removeBuffWhenConsumed: shield.removeBuffWhenConsumed,
            priority: shield.priority === 'PrioritizeConsume' ? 'prioritizeConsume' : 'normal',
            replaceHitEffect: shield.replaceHitEffect,
            damageAbsorptions: shield.damageAbsorptions.map(absorption => ({
              damageType: absorption.damageType as import('../../../core/game-data/operatorDefinition').DamageType,
              ratio: scalarValue(absorption.ratio),
              scale: scalarValue(absorption.scale),
            })),
          })),
        }),
    ...(source.sustainedProtections === undefined || source.sustainedProtections.length === 0
      ? {}
      : source.sustainedProtections.length !== 1
        ? (() => {
            throw new Error(`buff '${source.buffId}' has multiple sustained protection actions`);
          })()
        : {
            sustainedProtection: {
              target:
                source.sustainedProtections[0]!.target.targetSource === 'Owner'
                  ? 'owner'
                  : source.sustainedProtections[0]!.target.targetSource === 'Source'
                    ? 'buffSource'
                    : (() => {
                        throw new Error(
                          `buff '${source.buffId}' uses unsupported sustained protection target`,
                        );
                      })(),
              superArmor: scalarValue(source.sustainedProtections[0]!.superArmor),
              impactResistance: scalarValue(
                source.sustainedProtections[0]!.impactResistance,
              ),
            },
          }),
  };
}

function scalarValue(
  source: GeneratedScalarSource,
  negate = false,
): number | { readonly blackboardKey: string; readonly negate?: boolean } {
  if (source.levelValues !== null && source.blackboardKey === null) {
    throw new Error('generated Buff scalar still contains unresolved level values');
  }
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
    'auraActions',
  ] as const;
  return fields.filter(field => source[field].length > 0);
}
