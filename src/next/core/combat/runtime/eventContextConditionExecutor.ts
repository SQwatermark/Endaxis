/**
 * 求值依赖当前事件负载的条件。
 *
 * 该执行器只读取 `CombatOperationContext.event`，不持有事件实例。它应同时进入技能临时监听器
 * 和常驻事件监听器的操作链；普通技能步骤误用事件条件时会明确失败。
 */
import type { CombatCondition, DamageFeature, DamageTag } from '../../game-data/operatorDefinition';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

type EventDamageTagsCondition = Extract<CombatCondition, { kind: 'eventDamageTagsMatch' }>;
type EventDamageFeaturesCondition = Extract<CombatCondition, { kind: 'eventDamageFeaturesMatch' }>;

export class EventContextConditionExecutor implements CombatOperationExecutor {
  constructor(readonly delegate: CombatOperationExecutor) {}

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
      condition.kind !== 'eventSkillTypeIn' &&
      condition.kind !== 'eventSkillIdIn' &&
      condition.kind !== 'eventBuffIdMatch' &&
      condition.kind !== 'eventBuffTagsMatch' &&
      condition.kind !== 'eventSourceMatchesBuffSource'
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
      return context.event.kind === 'abilityDamage'
        ? context.event.sourceId === context.buffSourceId
        : false;
    }
    if (condition.kind === 'eventSkillTypeIn') {
      return (
        context.event.kind === 'abilitySkill' &&
        condition.skillTypes.includes(context.event.skillType)
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
    if (condition.kind === 'eventBuffTagsMatch') {
      return (
        context.event.kind === 'buffApplied' &&
        matchValues(context.event.buffTagIds, condition.buffTagIds, condition.match)
      );
    }
    const damageEvent = eventDamageProperties(context.event);
    if (damageEvent === null) return false;
    return condition.kind === 'eventDamageTagsMatch'
      ? matchValues(damageEvent.tags, condition.tags, condition.match)
      : matchValues(damageEvent.features, condition.features, condition.match);
  }
}

function eventDamageProperties(
  event: NonNullable<CombatOperationContext['event']>,
): { readonly tags: readonly DamageTag[]; readonly features: readonly DamageFeature[] } | null {
  switch (event.kind) {
    case 'operatorHit':
      return { tags: event.tags, features: event.features };
    case 'abilityDamage':
      return { tags: event.tags, features: event.features };
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
