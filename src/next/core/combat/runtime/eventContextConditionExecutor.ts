import type { GameplayTag } from '../../../../../packages/game-data-contract/src/gameplayTags';
/**
 * 求值依赖当前事件负载的条件。
 *
 * 该执行器只读取 `CombatOperationContext.event`，不持有事件实例。它应同时进入技能临时监听器
 * 和常驻事件监听器的操作链；普通技能步骤误用事件条件时会明确失败。
 */
import type { CombatCondition, DamageFeature, DamageTag } from '../../game-data/operatorDefinition';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { GameplayTagQueryType } from '../tags/gameplayTags';
import { resolveActionValueOperand } from './actionBlackboard';
import { compareCombatNumbers } from './numericComparison';
import { NATIVE_ELEMENT_VALUES, spellBurstElement } from '../infliction/elementalInfliction';

type EventDamageTagsCondition = Extract<CombatCondition, { kind: 'eventDamageTagsMatch' }>;
type EventDamageFeaturesCondition = Extract<CombatCondition, { kind: 'eventDamageFeaturesMatch' }>;

export class EventContextConditionExecutor implements CombatOperationExecutor {
  constructor(
    readonly delegate: CombatOperationExecutor,
    readonly isOperatorControlled?: (operatorId: string) => boolean,
    readonly resolveEntitySourceId?: (entityId: string) => string,
    readonly matchBuffTags?: (
      targetId: string,
      ownedTags: readonly GameplayTag[],
      requiredTags: readonly GameplayTag[],
      match: GameplayTagQueryType,
    ) => boolean,
    readonly resolveCurrentSkillType?: (
      target: 'caster' | 'buffOwner',
      context?: CombatOperationContext,
    ) => import('../../game-data/operatorDefinition').SkillType | undefined,
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
      condition.kind !== 'eventCustomAbilityNameMatch' &&
      condition.kind !== 'currentSkillTypeIn' &&
      condition.kind !== 'eventSkillTypeIn' &&
      condition.kind !== 'originSkillTypeIn' &&
      condition.kind !== 'eventSkillIdIn' &&
      condition.kind !== 'eventSkillCastMatchesBuffSource' &&
      condition.kind !== 'eventBuffIdMatch' &&
      condition.kind !== 'eventBuffEndedEarly' &&
      condition.kind !== 'eventBuffTagsMatch' &&
      condition.kind !== 'eventHealTagsMatch' &&
      condition.kind !== 'eventSpGainMatch' &&
      condition.kind !== 'eventConsumedBuffLayerCompare' &&
      condition.kind !== 'eventSourceTargetMatch' &&
      condition.kind !== 'eventActionOwnerTargetMatch' &&
      condition.kind !== 'eventOverheal' &&
      condition.kind !== 'eventSourceMatchesBuffSource' &&
      condition.kind !== 'eventSourceMatchesBuffSourceEntitySource' &&
      condition.kind !== 'eventSourceControlled' &&
      condition.kind !== 'actionInputTargetObjectTypeMatch' &&
      condition.kind !== 'actionInputTargetIdentityMatch'
    ) {
      return context === undefined
        ? this.delegate.evaluate(condition)
        : this.delegate.evaluate(condition, context);
    }
    if (condition.kind === 'currentSkillTypeIn') {
      if (this.resolveCurrentSkillType === undefined) {
        throw new Error('currentSkillTypeIn requires an AbilitySystem resolver');
      }
      const skillType = this.resolveCurrentSkillType(condition.target, context);
      return skillType !== undefined && condition.skillTypes.includes(skillType);
    }
    if (condition.kind === 'originSkillTypeIn') {
      const event = context?.event;
      // combat-spec/origin-skill-event-context.md：按当前事件类型取来源；不回退到条件宿主。
      const carriesOrigin =
        event !== undefined &&
        (event.kind === 'buffApplied' ||
          event.kind === 'buffFinished' ||
          event.kind === 'buffConsumed' ||
          event.kind === 'abilityPhysicalInfliction' ||
          event.kind === 'physicalInflictionApplied' ||
          event.kind === 'abilitySpellBurst' ||
          (event.kind === 'abilitySpellInfliction' &&
            event.event !== 'beforeTakeSpellInfliction') ||
          (event.kind === 'abilityDamage' &&
            (event.event === 'beforeDamageAction' ||
              event.event === 'beforeOutputDamage' ||
              event.event === 'outputDamage' ||
              event.event === 'outputCriticalDamage')));
      if (!carriesOrigin) return false;
      const skillCastInfo = context?.eventSkillCastInfo;
      if (skillCastInfo === undefined) {
        throw new Error('originSkillTypeIn requires an event source skill cast identity');
      }
      if (skillCastInfo === null) return false;
      return condition.skillTypes.includes(skillCastInfo.originSkillType);
    }
    if (context?.event === undefined) {
      throw new Error(`${condition.kind} requires a combat event context`);
    }
    if (condition.kind === 'eventSourceMatchesBuffSource') {
      if (context.buffSourceId === undefined) {
        throw new Error('eventSourceMatchesBuffSource requires a Buff source identity');
      }
      return context.event.kind === 'abilityDamage' ||
        context.event.kind === 'abilityPhysicalInfliction' ||
        context.event.kind === 'buffApplied'
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
    if (condition.kind === 'actionInputTargetObjectTypeMatch') {
      const target = context.actionInputTarget;
      if (target === undefined) {
        throw new Error('actionInputTargetObjectTypeMatch requires an action InputTarget');
      }
      const mask =
        condition.objectTypeMask & 16 ? condition.objectTypeMask | 16384 : condition.objectTypeMask;
      const objectType =
        target.kind === 'enemy'
          ? 16
          : target.kind === 'operator'
            ? 8
            : target.kind === 'abilityEntity'
              ? 512
              : 0;
      return objectType !== 0 && (mask & objectType) === objectType;
    }
    if (condition.kind === 'actionInputTargetIdentityMatch') {
      const target = context.actionInputTarget;
      if (target === undefined) {
        throw new Error('actionInputTargetIdentityMatch requires an action InputTarget');
      }
      const targetId =
        target.kind === 'operator'
          ? target.operatorId
          : target.kind === 'abilityEntity'
            ? `abilityEntity:${target.instanceId}`
            : 'enemy';
      const matches =
        condition.other === 'controlledOperator'
          ? (() => {
              if (target.kind !== 'operator') return false;
              if (this.isOperatorControlled === undefined) {
                throw new Error('actionInputTargetIdentityMatch requires control state');
              }
              return this.isOperatorControlled(target.operatorId);
            })()
          : condition.other === 'actionSource'
            ? context.actionSourceId !== undefined && targetId === context.actionSourceId
            : context.actionOwnerId !== undefined && targetId === context.actionOwnerId;
      return condition.operator === 'equal' ? matches : !matches;
    }
    if (condition.kind === 'eventSkillTypeIn') {
      return (
        context.event.kind === 'abilitySkill' &&
        condition.skillTypes.includes(context.event.skillType)
      );
    }
    if (condition.kind === 'eventCustomAbilityNameMatch') {
      return (
        context.event.kind === 'abilityCustom' && context.event.eventName === condition.eventName
      );
    }
    if (condition.kind === 'eventInflictionElementIn') {
      const event = context.event;
      const element =
        event.kind === 'abilitySpellInfliction'
          ? event.element
          : event.kind === 'abilitySpellBurst'
            ? spellBurstElement(event.burstType)
            : undefined;
      if (element === undefined || !condition.elements.includes(element)) return false;
      if (condition.outputKey !== undefined && condition.outputKey !== '') {
        // CheckSpellInflictionType 先严格 GetFloat，再比较 float32 epsilon，最后 AssignDynamic。
        // 不能直接写入：缺声明、direct 遮蔽 entity 及相等时不写都属于可观察语义。
        const old = Math.fround(
          resolveActionValueOperand(
            { kind: 'blackboard', key: condition.outputKey },
            context.blackboard,
          ),
        );
        const value = NATIVE_ELEMENT_VALUES[element];
        if (!(Math.abs(Math.fround(old - value)) <= Math.fround(0.00001))) {
          context.blackboard.assignDynamicUnconditionally(condition.outputKey, value);
          context.refreshCurrentBuffAttributeModifiers?.();
        }
      }
      return true;
    }
    if (condition.kind === 'eventPhysicalInflictionTypeIn') {
      const type =
        context.event.kind === 'abilityPhysicalInfliction'
          ? context.event.type
          : context.event.kind === 'physicalInflictionApplied'
            ? context.event.type
            : undefined;
      const matched = type !== undefined && condition.types.includes(type);
      if (matched && condition.outputKey !== undefined) {
        const values = { airborne: 0, knockDown: 1, fracture: 2, crush: 3 } as const;
        const old = Math.fround(
          resolveActionValueOperand(
            { kind: 'blackboard', key: condition.outputKey },
            context.blackboard,
          ),
        );
        const value = values[type];
        if (!(Math.abs(Math.fround(old - value)) <= Math.fround(0.00001))) {
          context.blackboard.assignDynamicUnconditionally(condition.outputKey, value);
          context.refreshCurrentBuffAttributeModifiers?.();
        }
      }
      return matched;
    }
    if (condition.kind === 'eventSkillIdIn') {
      return (
        context.event.kind === 'abilitySkill' && condition.skillIds.includes(context.event.skillId)
      );
    }
    if (condition.kind === 'eventSkillCastMatchesBuffSource') {
      return (
        context?.skillCastInfo !== undefined &&
        context.eventSkillCastInfo != null &&
        context.eventSkillCastInfo.skillCastId === context.skillCastInfo.skillCastId
      );
    }
    if (condition.kind === 'eventBuffIdMatch') {
      const event = context.event;
      const matched =
        (event.kind === 'buffApplied' ||
          event.kind === 'buffFinished' ||
          event.kind === 'buffConsumed') &&
        condition.buffIds.includes(event.buffId);
      if (matched && condition.buffIdOutputKey !== undefined) {
        context.blackboard.assign({ [condition.buffIdOutputKey]: event.buffId });
      }
      return matched;
    }
    if (condition.kind === 'eventBuffEndedEarly') {
      return (
        context.event.kind === 'buffFinished' &&
        (context.event.reason === 'ignite' || context.event.reason === 'early')
      );
    }
    if (condition.kind === 'eventBuffTagsMatch') {
      const event = context.event;
      if (
        event.kind !== 'buffApplied' &&
        event.kind !== 'buffFinished' &&
        event.kind !== 'buffConsumed'
      )
        return false;
      const matched =
        this.matchBuffTags === undefined
          ? matchValues(event.buffTags ?? [], condition.buffTags, condition.match)
          : this.matchBuffTags(
              event.targetId,
              event.buffTags ?? [],
              condition.buffTags,
              condition.match,
            );
      if (matched && condition.buffIdOutputKey !== undefined) {
        context.blackboard.assign({ [condition.buffIdOutputKey]: event.buffId });
      }
      return matched;
    }
    if (condition.kind === 'eventHealTagsMatch') {
      const event = context.event;
      const tags =
        event.kind === 'abilityHeal' || event.kind === 'operatorHealed' ? event.tags : null;
      return tags !== null && matchValues(tags, condition.tags, condition.match);
    }
    if (condition.kind === 'eventSpGainMatch') {
      const event = context.event;
      return (
        event.kind === 'spGained' &&
        (condition.sources === undefined || condition.sources.includes(event.source)) &&
        (condition.gainKinds === undefined || condition.gainKinds.includes(event.gainKind))
      );
    }
    if (condition.kind === 'eventConsumedBuffLayerCompare') {
      const event = context.event;
      if (event.kind !== 'buffConsumed') return false;
      if (condition.outputKey !== undefined) {
        context.blackboard.assignDynamic(condition.outputKey, event.layers);
      }
      return compareCombatNumbers(
        event.layers,
        resolveActionValueOperand(condition.value, context.blackboard),
        condition.operator,
      );
    }
    if (condition.kind === 'eventSourceTargetMatch') {
      const event = context.event;
      const equal =
        event.kind === 'operatorHealed'
          ? event.sourceOperatorId === event.targetOperatorId
          : 'sourceId' in event &&
              typeof event.sourceId === 'string' &&
              'targetId' in event &&
              typeof event.targetId === 'string'
            ? event.sourceId === event.targetId
            : null;
      if (equal === null) return false;
      return condition.operator === 'equal' ? equal : !equal;
    }
    if (condition.kind === 'eventActionOwnerTargetMatch') {
      const ownerId = context.actionOwnerId ?? context.buffOwnerId;
      if (ownerId === undefined) {
        throw new Error('eventActionOwnerTargetMatch requires an action owner identity');
      }
      const event = context.event;
      const targetId =
        'targetId' in event && typeof event.targetId === 'string'
          ? event.targetId
          : event.kind === 'operatorHealed'
            ? event.targetOperatorId
            : null;
      if (targetId === null) return false;
      const equal = ownerId === targetId;
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
