/**
 * 求值依赖当前事件负载的条件。
 *
 * 该执行器只读取 `CombatOperationContext.event`，不持有事件实例。它应同时进入技能临时监听器
 * 和常驻事件监听器的操作链；普通技能步骤误用事件条件时会明确失败。
 */
import type { CombatCondition, DamageFeature, DamageTag } from '../../game-data/operatorDefinition';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { GameplayTagQueryType } from '../tags/gameplayTags';

type EventDamageTagsCondition = Extract<CombatCondition, { kind: 'eventDamageTagsMatch' }>;
type EventDamageFeaturesCondition = Extract<CombatCondition, { kind: 'eventDamageFeaturesMatch' }>;

export class EventContextConditionExecutor implements CombatOperationExecutor {
  constructor(
    readonly delegate: CombatOperationExecutor,
    readonly isOperatorControlled?: (operatorId: string) => boolean,
    readonly resolveEntitySourceId?: (entityId: string) => string,
    readonly matchBuffTagIds?: (
      targetId: string,
      ownedTagIds: readonly number[],
      requiredTagIds: readonly number[],
      match: GameplayTagQueryType,
    ) => boolean,
  ) {}

  execute(
    step: Parameters<CombatOperationExecutor['execute']>[0],
    context?: CombatOperationContext,
  ): boolean {
    return context === undefined
      ? this.delegate.execute(step)
      : this.delegate.execute(step, context);
  }

  end(
    step: Parameters<NonNullable<CombatOperationExecutor['end']>>[0],
    context?: CombatOperationContext,
  ): void {
    this.delegate.end?.(step, context);
  }

  evaluate(condition: CombatCondition, context?: CombatOperationContext): boolean {
    if (
      condition.kind !== 'eventDamageTagsMatch' &&
      condition.kind !== 'eventDamageFeaturesMatch' &&
      condition.kind !== 'eventDamageTypeIn' &&
      condition.kind !== 'eventInflictionElementIn' &&
      condition.kind !== 'eventPhysicalInflictionTypeIn' &&
      condition.kind !== 'eventSkillTypeIn' &&
      condition.kind !== 'eventSkillIdIn' &&
      condition.kind !== 'eventBuffIdMatch' &&
      condition.kind !== 'eventBuffEndedEarly' &&
      condition.kind !== 'eventBuffTagsMatch' &&
      condition.kind !== 'eventHealTagsMatch' &&
      condition.kind !== 'eventSourceTargetMatch' &&
      condition.kind !== 'eventOverheal' &&
      condition.kind !== 'eventSourceMatchesBuffSource' &&
      condition.kind !== 'eventSourceMatchesBuffSourceEntitySource' &&
      condition.kind !== 'eventSourceControlled'
    ) {
      return context === undefined
        ? this.delegate.evaluate(condition)
        : this.delegate.evaluate(condition, context);
    }
    if (context?.event === undefined) {
      throw new Error(`${condition.kind} requires a combat event context`);
    }
    if (condition.kind === 'eventSourceMatchesBuffSource') {
      if (context.buffSourceId === undefined) {
        throw new Error('eventSourceMatchesBuffSource requires a Buff source identity');
      }
      return context.event.kind === 'abilityDamage' ||
        context.event.kind === 'abilityPhysicalInfliction'
        ? context.event.sourceId === context.buffSourceId
        : false;
    }
    if (condition.kind === 'eventSourceMatchesBuffSourceEntitySource') {
      if (context.buffSourceId === undefined) {
        throw new Error('eventSourceMatchesBuffSourceEntitySource requires a Buff source identity');
      }
      if (this.resolveEntitySourceId === undefined) {
        throw new Error('eventSourceMatchesBuffSourceEntitySource requires entity provenance');
      }
      return context.event.kind === 'abilityDamage' ||
        context.event.kind === 'abilityPhysicalInfliction'
        ? context.event.sourceId === this.resolveEntitySourceId(context.buffSourceId)
        : false;
    }
    if (condition.kind === 'eventSourceControlled') {
      if (this.isOperatorControlled === undefined) {
        throw new Error('eventSourceControlled requires control state');
      }
      return context.event.kind === 'abilityDamage' ||
        context.event.kind === 'abilityPoise' ||
        context.event.kind === 'abilityHeal'
        ? this.isOperatorControlled(context.event.sourceId)
        : false;
    }
    if (condition.kind === 'eventSkillTypeIn') {
      return (
        context.event.kind === 'abilitySkill' &&
        condition.skillTypes.includes(context.event.skillType)
      );
    }
    if (condition.kind === 'eventInflictionElementIn') {
      return (
        context.event.kind === 'abilitySpellInfliction' &&
        context.event.element !== undefined &&
        condition.elements.includes(context.event.element)
      );
    }
    if (condition.kind === 'eventPhysicalInflictionTypeIn') {
      return (
        context.event.kind === 'abilityPhysicalInfliction' &&
        context.event.type !== undefined &&
        condition.types.includes(context.event.type)
      );
    }
    if (condition.kind === 'eventSkillIdIn') {
      return (
        context.event.kind === 'abilitySkill' && condition.skillIds.includes(context.event.skillId)
      );
    }
    if (condition.kind === 'eventBuffIdMatch') {
      return (
        (context.event.kind === 'buffApplied' || context.event.kind === 'buffFinished') &&
        condition.buffIds.includes(context.event.buffId)
      );
    }
    if (condition.kind === 'eventBuffEndedEarly') {
      return (
        context.event.kind === 'buffFinished' &&
        (context.event.reason === 'ignite' || context.event.reason === 'early')
      );
    }
    if (condition.kind === 'eventBuffTagsMatch') {
      if (context.event.kind !== 'buffApplied') return false;
      return this.matchBuffTagIds === undefined
        ? matchValues(context.event.buffTagIds, condition.buffTagIds, condition.match)
        : this.matchBuffTagIds(
            context.event.targetId,
            context.event.buffTagIds,
            condition.buffTagIds,
            condition.match,
          );
    }
    if (condition.kind === 'eventHealTagsMatch') {
      const event = context.event;
      const tagIds =
        event.kind === 'abilityHeal' || event.kind === 'operatorHealed' ? event.tagIds : null;
      return tagIds !== null && matchValues(tagIds, condition.tagIds, condition.match);
    }
    if (condition.kind === 'eventSourceTargetMatch') {
      const event = context.event;
      if (event.kind !== 'abilityHeal' && event.kind !== 'operatorHealed') return false;
      const equal =
        event.kind === 'operatorHealed'
          ? event.sourceOperatorId === event.targetOperatorId
          : event.sourceId === event.targetId;
      return condition.operator === 'equal' ? equal : !equal;
    }
    if (condition.kind === 'eventOverheal') {
      const event = context.event;
      if (event.kind !== 'abilityHeal' && event.kind !== 'operatorHealed') return false;
      if (condition.overHealKey) {
        context.blackboard.assignDynamic(condition.overHealKey, event.overhealing);
      }
      if (condition.finalHealKey) {
        context.blackboard.assignDynamic(condition.finalHealKey, event.requestedHealing);
      }
      if (condition.realHealKey) {
        context.blackboard.assignDynamic(condition.realHealKey, event.actualHealing);
      }
      return event.requestedHealing > event.actualHealing + 0.00001;
    }
    const damageEvent = eventDamageProperties(context.event);
    if (damageEvent === null) return false;
    if (condition.kind === 'eventDamageTypeIn') {
      return (
        damageEvent.damageType !== undefined &&
        condition.damageTypes.includes(damageEvent.damageType)
      );
    }
    return condition.kind === 'eventDamageTagsMatch'
      ? matchValues(damageEvent.tags, condition.tags, condition.match)
      : matchValues(damageEvent.features, condition.features, condition.match);
  }
}

function eventDamageProperties(event: NonNullable<CombatOperationContext['event']>): {
  readonly tags: readonly DamageTag[];
  readonly features: readonly DamageFeature[];
  readonly damageType?: import('../../game-data/operatorDefinition').DamageType;
} | null {
  switch (event.kind) {
    case 'operatorHit':
      return { tags: event.tags, features: event.features, damageType: event.damageType };
    case 'abilityDamage':
      return { tags: event.tags, features: event.features, damageType: event.damageType };
    case 'damageTagHit':
    case 'enemyDefeated':
      return { tags: event.tags, features: event.features ?? [] };
    default:
      return null;
  }
}

function matchValues<T>(
  actualValues: readonly T[],
  expectedValues: readonly T[],
  match: EventDamageTagsCondition['match'] | EventDamageFeaturesCondition['match'],
): boolean {
  const actual = new Set(actualValues);
  const expected = new Set(expectedValues);
  const hasAny = expectedValues.some(value => actual.has(value));
  const hasAll = expectedValues.every(value => actual.has(value));
  switch (match) {
    case 'exact':
      return actual.size === expected.size && hasAll;
    case 'hasAny':
      return hasAny;
    case 'hasAll':
      return hasAll;
    case 'exceptAny':
      return !hasAny;
    case 'exceptAll':
      return !hasAll;
  }
}
