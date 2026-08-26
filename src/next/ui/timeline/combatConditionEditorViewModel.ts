/**
 * 条件编辑器使用的纯函数视图模型。
 *
 * 条件类型切换和逻辑条件新增都必须从这里取得可通过严格校验的完整默认结构，
 * 避免各 Vue 组件分别拼装条件并逐渐产生不同语义。
 */
import type { CombatCondition, CombatConditionKind } from '../../core/game-data/operatorDefinition';

/** 为指定条件类型创建可直接进入草稿的完整结构。 */
export function createCombatCondition(kind: CombatConditionKind): CombatCondition {
  switch (kind) {
    case 'combatActive':
      return { kind };
    case 'singleEnemyPresent':
      return { kind };
    case 'casterControlled':
      return { kind };
    case 'enemyRankIn':
      return { kind, ranks: ['mob'] };
    case 'enemySuperArmorCompare':
      return {
        kind,
        operator: 'greaterOrEqual',
        value: { kind: 'constant', value: 30 },
      };
    case 'cameraToTargetAngleCompare':
      return {
        kind,
        operator: 'less',
        value: { kind: 'constant', value: 0 },
      };
    case 'skillBranchEnabled':
      return { kind, branchKey: 'custom-branch' };
    case 'targetStaggered':
      return { kind, target: 'enemy' };
    case 'healthCompare':
      return {
        kind,
        target: 'enemy',
        valueType: 'ratio',
        operator: 'lessOrEqual',
        value: { kind: 'constant', value: 0.5 },
      };
    case 'poiseCompare':
      return {
        kind,
        target: 'enemy',
        returnValueIfMissing: false,
        operator: 'equal',
        value: { kind: 'constant', value: 0 },
      };
    case 'contextFlagEquals':
      return { kind, flag: 'custom-flag', value: true };
    case 'actionValueCompare':
      return {
        kind,
        left: { kind: 'constant', value: 0 },
        operator: 'equal',
        right: { kind: 'constant', value: 0 },
      };
    case 'probability':
      return { kind, probability: { kind: 'constant', value: 0.5 } };
    case 'contextTargetCountCompare':
      return { kind, contextKey: 'custom-targets', operator: 'greaterOrEqual', value: 1 };
    case 'abilityEntityRemainingDurationCompare':
      return {
        kind,
        operator: 'less',
        value: { kind: 'constant', value: 0 },
      };
    case 'statusActive':
      return { kind, statusKey: 'custom-status', target: 'caster' };
    case 'buffStackCompare':
      return {
        kind,
        target: 'caster',
        tagQueryType: 'hasAny',
        buffTagIds: [0],
        operator: 'greaterOrEqual',
        value: { kind: 'constant', value: 1 },
      };
    case 'entityTagMatch':
      return { kind, target: 'caster', tagQueryType: 'hasAny', tagIds: [0] };
    case 'buffIdStackCompare':
      return {
        kind,
        target: 'caster',
        buffIds: ['custom-buff'],
        operator: 'greaterOrEqual',
        value: 1,
      };
    case 'timedMarkerPresent':
      return { kind, target: 'caster', markerId: 'custom-marker' };
    case 'abilityEntityTimedMarkerPresent':
      return { kind, markerId: 'custom-marker' };
    case 'eventDamageTagsMatch':
      return { kind, match: 'hasAny', tags: ['normalSkill'] };
    case 'eventDamageFeaturesMatch':
      return { kind, match: 'hasAny', features: ['canBreakWeakness'] };
    case 'eventDamageTypeIn':
      return { kind, damageTypes: ['physical'] };
    case 'eventInflictionElementIn':
      return { kind, elements: ['heat'] };
    case 'eventPhysicalInflictionTypeIn':
      return { kind, types: ['fracture'] };
    case 'eventSkillTypeIn':
      return { kind, skillTypes: ['battleSkill'] };
    case 'originSkillTypeIn':
      return { kind, skillTypes: ['battleSkill'] };
    case 'contextTargetContains':
      return { kind, parentContextKey: 'targets', child: 'eventTarget' };
    case 'eventSkillIdIn':
      return { kind, skillIds: ['custom-skill'] };
    case 'eventBuffIdMatch':
      return { kind, buffIds: ['custom-buff'] };
    case 'eventBuffEndedEarly':
      return { kind };
    case 'eventBuffTagsMatch':
      return { kind, match: 'hasAny', buffTagIds: [0] };
    case 'eventTargetBuffCountCompare':
      return {
        kind,
        tagQueryType: 'hasAny',
        buffTagIds: [0],
        operator: 'greaterOrEqual',
        value: { kind: 'constant', value: 1 },
      };
    case 'eventHealTagsMatch':
      return { kind, match: 'hasAny', tagIds: [0] };
    case 'eventSpGainMatch':
      return { kind, sources: ['skill'], gainKinds: ['gain'] };
    case 'eventSourceTargetMatch':
      return { kind, operator: 'notEqual' };
    case 'eventOverheal':
      return { kind };
    case 'eventSourceMatchesBuffSource':
    case 'eventSourceMatchesBuffSourceEntitySource':
    case 'eventSkillCastMatchesBuffSource':
    case 'eventSourceControlled':
    case 'buffSourceMatchesOwner':
      return { kind };
    case 'elementalInflictionPresent':
      return { kind, elements: 'heat' };
    case 'elementalReactionActive':
      return { kind, reaction: 'electrification' };
    case 'not':
      return { kind, condition: { kind: 'combatActive' } };
    case 'all':
      return { kind, conditions: [{ kind: 'combatActive' }] };
    case 'any':
      return { kind, conditions: [{ kind: 'combatActive' }] };
    case 'deckAttributeCompare':
      return { kind, left: 'strength', operator: 'greaterOrEqual', right: 'agility' };
  }
}

/** 将逗号或换行分隔文本解析为非空字符串列表。 */
export function parseConditionStringList(value: string): readonly string[] | undefined {
  const values = value
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
}

/** 将逗号或换行分隔文本解析为非空整数列表。 */
export function parseConditionIntegerList(value: string): readonly number[] | undefined {
  const values = value
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean)
    .map(Number);
  return values.length > 0 && values.every(Number.isInteger) ? values : undefined;
}
