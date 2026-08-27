import { expectTypeOf, it } from 'vitest';
import type {
  ActionSequenceDefinition,
  CombatCondition,
  CombatStepDefinition,
  CombatStepParameters,
  CombatBuffDefinitionAttributeModifier,
  CombatBuffDefinitionDamageModifier,
  CombatBuffPresentation,
  HealModifierDefinition,
  PoiseModifierDefinition,
  SkillBuffDefinition,
  WeaponDefinition,
  WeaponRarity,
  OperatorWeaponType,
  GearDefinition,
  GearSlotType,
  EquipmentAbilityEvent,
  EquipmentEventHandlerDefinition,
  AttributeGrowthDefinition,
  TrustAttributeBonusDefinition,
  OperatorDefinition,
  OperatorRarity,
  OperatorRole,
  OperatorAttribute,
  GearSetDefinition,
  SkillDefinition,
  ScheduledSequenceDefinition,
  SkillType,
  SkillLevelSource,
  DamageElement,
} from '../../../packages/game-data-contract/src/index.ts';
import type {
  CompiledBuffAttributeModifierSource,
  CompiledBuffConditionSource,
  CompiledBuffDamageModifierSource,
  CompiledBuffDefinitionSource,
  CompiledBuffHealModifierSource,
  CompiledBuffPoiseModifierSource,
  CompiledBuffPresentationSource,
  CompiledBuffSequenceSource,
  CompiledBuffStepSource,
} from '../src/compiler/buffRuntimeProjection.ts';
import type {
  CompiledWeaponEventHandlerSource,
  CompiledWeaponRuntimeDefinitionSource,
} from '../src/domains/weapon/runtimeDefinition.ts';
import type {
  CompiledWeaponStaticDefinitionSource,
  CompiledWeaponTraitStaticDefinitionSource,
} from '../src/domains/weapon/staticDefinition.ts';
import type {
  CompiledGearDefinitionSource,
  CompiledGearSlotTypeSource,
} from '../src/domains/equipment/formalDefinition.ts';
import type { ProjectedWeaponTypeSource } from '../src/compiler/weaponType.ts';
import type {
  CompiledOperatorAttributeGrowthSource,
  ProjectedOperatorRoleSource,
  ProjectedOperatorRaritySource,
} from '../src/domains/operator/characterTable.ts';
import type { CompiledOperatorDefinitionHeaderSource } from '../src/domains/operator/definitionHeader.ts';
import type { CompiledTrustAttributeBonusSource } from '../src/domains/operator/talentNodes.ts';
import type { CompiledGearSetStaticDefinitionSource } from '../src/domains/equipment/suitStaticDefinition.ts';
import type { CompiledEquipmentSuitRuntimeBatchSource } from '../src/domains/equipment/suitRuntimeDefinition.ts';
import type { CompiledOperatorActiveSkillRuntimeDefinitionSource } from '../src/domains/operator/activeSkillRuntimeDefinition.ts';
import type { CompiledActiveSkillTimelineSequenceSource } from '../src/compiler/activeSkillRuntimeProjection.ts';
import type {
  OperatorSkillGroupSource,
  OperatorSkillGroupVariantSource,
  OperatorSkillIdentitySource,
} from '../src/domains/operator/skillGroups.ts';
import type { OperatorActiveSkillTypeSource } from '../src/domains/operator/activeSkills.ts';
import type { ProjectedDamageElementSource } from '../src/source/damageElement.ts';
import type { CompiledOperatorProgressionEntrySource } from '../src/domains/operator/progressionEffects.ts';

type IncompatibleParameters = {
  [K in CompiledBuffStepSource['kind']]: Extract<
    CompiledBuffStepSource,
    { kind: K }
  >['parameters'] extends CombatStepParameters[K]
    ? never
    : K;
}[CompiledBuffStepSource['kind']];

it('技能身份、等级来源与元素复用契约，但链接计划和养成 IR 保留自身信息', () => {
  expectTypeOf<OperatorSkillIdentitySource['skillType']>().toEqualTypeOf<SkillType>();
  expectTypeOf<OperatorActiveSkillTypeSource>().toEqualTypeOf<SkillType>();
  expectTypeOf<OperatorSkillGroupSource['levelSource']>().toEqualTypeOf<SkillLevelSource>();
  expectTypeOf<OperatorSkillGroupVariantSource['levelSource']>().toEqualTypeOf<SkillLevelSource>();
  expectTypeOf<ProjectedDamageElementSource>().toEqualTypeOf<DamageElement>();
  expectTypeOf<OperatorSkillGroupSource['nativeGroupType']>().toEqualTypeOf<number>();
  type BlackboardPatch = Extract<
    CompiledOperatorProgressionEntrySource,
    { kind: 'skillBlackboardModifier' }
  >;
  expectTypeOf<BlackboardPatch['operation']>().toEqualTypeOf<'add' | 'multiply' | 'overwrite'>();
  expectTypeOf<BlackboardPatch['stringValue']>().toEqualTypeOf<string>();
  expectTypeOf<BlackboardPatch['sourcePath']>().toEqualTypeOf<string>();
});

it('干员头部和成长复用正式契约，来源身份与具体信赖属性仍保留', () => {
  expectTypeOf<ProjectedOperatorRoleSource>().toEqualTypeOf<OperatorRole>();
  expectTypeOf<ProjectedOperatorRaritySource>().toEqualTypeOf<OperatorRarity>();
  expectTypeOf<CompiledOperatorAttributeGrowthSource>().toEqualTypeOf<
    Readonly<AttributeGrowthDefinition>
  >();
  type HeaderKeys =
    | 'slug'
    | 'gameId'
    | 'rarity'
    | 'weaponType'
    | 'element'
    | 'role'
    | 'mainAttribute'
    | 'secondaryAttribute';
  expectTypeOf<Pick<CompiledOperatorDefinitionHeaderSource, HeaderKeys>>().toEqualTypeOf<
    Readonly<Pick<OperatorDefinition, HeaderKeys>>
  >();
  expectTypeOf<
    CompiledOperatorDefinitionHeaderSource['sourceCharacterId']
  >().toEqualTypeOf<string>();
  expectTypeOf<CompiledTrustAttributeBonusSource>().toExtend<TrustAttributeBonusDefinition>();
  expectTypeOf<
    CompiledTrustAttributeBonusSource['attributes'][number]
  >().toEqualTypeOf<OperatorAttribute>();
  expectTypeOf<{
    values: readonly [1];
    attributes: readonly ['main'];
  }>().not.toExtend<CompiledTrustAttributeBonusSource>();
});

it('套装阶段输出符合正式契约但不自动纳入未支持事件', () => {
  type Runtime = CompiledEquipmentSuitRuntimeBatchSource['definitions'][number];
  expectTypeOf<CompiledGearSetStaticDefinitionSource>().toExtend<GearSetDefinition>();
  expectTypeOf<Runtime>().toExtend<GearSetDefinition>();
  expectTypeOf<{}>().not.toExtend<Pick<CompiledGearSetStaticDefinitionSource, 'modifiers'>>();
  expectTypeOf<Extract<keyof Runtime, 'eventHandlers' | 'displayName'>>().toBeNever();
});

it('主动技能及实体共用调度子集，结束帧和技能来源信息保持必填', () => {
  type Active = CompiledOperatorActiveSkillRuntimeDefinitionSource;
  expectTypeOf<Active>().toExtend<SkillDefinition>();
  expectTypeOf<CompiledActiveSkillTimelineSequenceSource>().toExtend<ScheduledSequenceDefinition>();
  expectTypeOf<
    Active['scheduledSequences'][number]
  >().toEqualTypeOf<CompiledActiveSkillTimelineSequenceSource>();
  expectTypeOf<{}>().not.toExtend<Pick<CompiledActiveSkillTimelineSequenceSource, 'endFrame'>>();
  expectTypeOf<{}>().not.toExtend<Pick<Active, 'blackboard' | 'sourceSkillId' | 'costFrame'>>();
  expectTypeOf<Extract<keyof Active, 'eventHandlers' | 'availability'>>().toBeNever();
});

// 由 type-check:game-data 真正检查，Vitest 执行本身不能替代类型门禁。
// 方向必须是“所有公共投影输出均能交给契约”，不只是某份 JSON 恰巧通过 validator。
it('公共 Buff、动作与武器装配输出是独立契约的子集', () => {
  expectTypeOf<IncompatibleParameters>().toEqualTypeOf<never>();
  expectTypeOf<CompiledBuffPresentationSource>().toExtend<CombatBuffPresentation>();
  expectTypeOf<CompiledBuffAttributeModifierSource>().toExtend<CombatBuffDefinitionAttributeModifier>();
  expectTypeOf<CompiledBuffDamageModifierSource>().toExtend<CombatBuffDefinitionDamageModifier>();
  expectTypeOf<CompiledBuffHealModifierSource>().toExtend<HealModifierDefinition>();
  expectTypeOf<CompiledBuffPoiseModifierSource>().toExtend<PoiseModifierDefinition>();
  expectTypeOf<CompiledBuffConditionSource>().toExtend<CombatCondition>();
  expectTypeOf<CompiledBuffStepSource>().toExtend<CombatStepDefinition>();
  expectTypeOf<CompiledBuffSequenceSource>().toExtend<ActionSequenceDefinition>();
  expectTypeOf<CompiledBuffDefinitionSource>().toExtend<SkillBuffDefinition>();
  expectTypeOf<CompiledWeaponRuntimeDefinitionSource>().toExtend<WeaponDefinition>();
});

type ProjectedParameters<K extends CompiledBuffStepSource['kind']> = Extract<
  CompiledBuffStepSource,
  { kind: K }
>['parameters'];

it('武器与装备阶段输出直接使用契约身份，兼容旧类型导出且保留必需字段', () => {
  expectTypeOf<CompiledWeaponStaticDefinitionSource['rarity']>().toEqualTypeOf<WeaponRarity>();
  expectTypeOf<
    CompiledWeaponStaticDefinitionSource['weaponType']
  >().toEqualTypeOf<OperatorWeaponType>();
  expectTypeOf<ProjectedWeaponTypeSource>().toEqualTypeOf<OperatorWeaponType>();
  expectTypeOf<CompiledGearSlotTypeSource>().toEqualTypeOf<GearSlotType>();
  expectTypeOf<CompiledWeaponStaticDefinitionSource>().toExtend<WeaponDefinition>();
  expectTypeOf<CompiledGearDefinitionSource>().toExtend<GearDefinition>();
  expectTypeOf<{}>().not.toExtend<Pick<CompiledGearDefinitionSource, 'assetSlug'>>();
  expectTypeOf<{}>().not.toExtend<Pick<CompiledWeaponTraitStaticDefinitionSource, 'modifiers'>>();
  expectTypeOf<Extract<keyof CompiledWeaponStaticDefinitionSource, 'displayName'>>().toBeNever();
});

it('武器事件复用契约但不放宽当前语义事件、必填项和物理异常范围', () => {
  type SemanticEvent = Extract<CompiledWeaponEventHandlerSource, { event: unknown }>['event'];
  type AbilityEvent = Extract<
    CompiledWeaponEventHandlerSource,
    { abilityEvent: unknown }
  >['abilityEvent'];
  expectTypeOf<CompiledWeaponEventHandlerSource>().toExtend<EquipmentEventHandlerDefinition>();
  expectTypeOf<AbilityEvent>().toEqualTypeOf<EquipmentAbilityEvent>();
  expectTypeOf<SemanticEvent['kind']>().toEqualTypeOf<
    'buffConsumed' | 'spGained' | 'physicalInflictionApplied'
  >();
  expectTypeOf<
    Extract<SemanticEvent, { kind: 'physicalInflictionApplied' }>['scope']
  >().toEqualTypeOf<'operator'>();
  expectTypeOf<{
    kind: 'physicalInflictionApplied';
    types: readonly ['airborne'];
    scope: 'operator';
  }>().not.toExtend<SemanticEvent>();
  expectTypeOf<
    Extract<
      keyof Extract<SemanticEvent, { kind: 'buffConsumed' | 'spGained' }>,
      'buffIds' | 'source' | 'gainKind'
    >
  >().toBeNever();
  expectTypeOf<{}>().not.toExtend<Pick<CompiledWeaponEventHandlerSource, 'priority'>>();
  expectTypeOf<{}>().not.toExtend<Pick<CompiledWeaponEventHandlerSource, 'blackboard'>>();
  // 正式契约要求两种触发入口互斥；不能让旧的宽松联合容许同时声明两者。
  expectTypeOf<{
    key: string;
    priority: number;
    blackboard: {};
    sequence: CompiledBuffSequenceSource;
    event: { kind: 'buffConsumed' };
    abilityEvent: 'enterFight';
  }>().not.toExtend<CompiledWeaponEventHandlerSource>();
});

it('契约派生仍保留条件种类、目标和递归子树的支持边界', () => {
  expectTypeOf<{
    kind: 'eventSkillTypeIn';
    skillTypes: readonly ['finisher'];
  }>().not.toExtend<CompiledBuffConditionSource>();
  expectTypeOf<{
    kind: 'not';
    condition: { kind: 'combatActive' };
  }>().not.toExtend<CompiledBuffConditionSource>();
  expectTypeOf<
    Extract<CompiledBuffConditionSource, { kind: 'healthCompare' }>['target']
  >().toEqualTypeOf<'controlledOperator' | 'enemy'>();
  expectTypeOf<
    Extract<
      keyof Extract<CompiledBuffConditionSource, { kind: 'buffStackCompare' }>,
      'sameSourceSkillCast'
    >
  >().toBeNever();
});

it('动作窄子集只纳入已证明的实体曲线，不扩张等级列或未知运算', () => {
  expectTypeOf<
    Extract<ProjectedParameters<'startTimeDilation'>, { scope: 'entity' }>['curve']['kind']
  >().toEqualTypeOf<'inline' | 'named'>();
  expectTypeOf<ProjectedParameters<'modifyActionValue'>['operation']>().toEqualTypeOf<
    'assign' | 'add' | 'multiply' | 'divide'
  >();
  expectTypeOf<
    ProjectedParameters<'gainSquadUltimateEnergyFromSkillCost'>['coefficient']
  >().toEqualTypeOf<number>();
  expectTypeOf<
    Extract<keyof ProjectedParameters<'applyBuff'>, 'definition' | 'durationSeconds'>
  >().toBeNever();
  expectTypeOf<{ target: 'caster'; tagIds: readonly [] }>().not.toExtend<
    ProjectedParameters<'heal'>
  >();
});

it('Buff 根定义保留必需字段与生命周期范围，不自动接入整个契约', () => {
  expectTypeOf<{}>().not.toExtend<Pick<CompiledBuffDefinitionSource, 'maxStackCount'>>();
  expectTypeOf<
    keyof NonNullable<CompiledBuffDefinitionSource['lifecycleSequences']>
  >().toEqualTypeOf<'start' | 'enable' | 'trigger' | 'enhanceChanged' | 'finish'>();
  expectTypeOf<
    Extract<keyof CompiledBuffDefinitionSource, 'scheduledSequences' | 'igniteEventResponses'>
  >().toBeNever();
});
