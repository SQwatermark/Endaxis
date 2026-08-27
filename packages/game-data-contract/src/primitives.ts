/**
 * 干员数据与编译器之间的接口约定。
 * 写干员时只声明“做什么”（顺序、倍率、条件），不写“怎么做”；数据来源的依据放到独立研究文档里。
 */
export const OPERATOR_ATTRIBUTES = ['strength', 'agility', 'intellect', 'will'] as const;

/** 干员养成、面板和条件判断共同使用的四维属性身份。 */
export type OperatorAttribute = (typeof OPERATOR_ATTRIBUTES)[number];

/** HealAction 的 MultiplyAttributeCalculation 可读取的已支持来源属性。 */
export type HealCalculationAttribute = OperatorAttribute | 'maxHealth';

export const OPERATOR_RARITIES = [4, 5, 6] as const;

/** 干员定义允许的星级；数据适配器不得传入定义外的数值。 */
export type OperatorRarity = (typeof OPERATOR_RARITIES)[number];

export const OPERATOR_WEAPON_TYPES = [
  'sword',
  'greatsword',
  'polearm',
  'handcannon',
  'arts-unit',
] as const;

/** 用于校验干员与武器配置兼容性的武器类型。 */
export type OperatorWeaponType = (typeof OPERATOR_WEAPON_TYPES)[number];

export const OPERATOR_ROLES = [
  'guard',
  'caster',
  'defender',
  'vanguard',
  'supporter',
  'striker',
] as const;

/** 干员定义和 UI 分类共同使用的战斗定位。 */
export type OperatorRole = (typeof OPERATOR_ROLES)[number];

export const DAMAGE_ELEMENTS = ['physical', 'heat', 'cryo', 'electric', 'nature'] as const;

/** 干员和伤害表现使用的元素身份，包含物理。 */
export type DamageElement = (typeof DAMAGE_ELEMENTS)[number];

export const INFLICTION_ELEMENTS = ['heat', 'electric', 'cryo', 'nature'] as const;

/** 能附着到敌人并参与复合状态的非物理元素。 */
export type InflictionElement = (typeof INFLICTION_ELEMENTS)[number];

/** 生命伤害计算使用的伤害类型。 */
export const DAMAGE_TYPES = [
  'physical',
  'true',
  'heat',
  'electric',
  'cryo',
  'lifeDrain',
  'nature',
  'ether',
] as const;

/** 生命伤害公式选择抗性和特殊路径时使用的伤害类型。 */
export type DamageType = (typeof DAMAGE_TYPES)[number];

export const ELEMENTAL_REACTIONS = ['electrification', 'corrosion'] as const;

/** 元素附着组合形成、可被状态和事件引用的复合反应。 */
export type ElementalReaction = (typeof ELEMENTAL_REACTIONS)[number];

/** 已解析伤害命中携带的可叠加分类。 */
export const DAMAGE_TAGS = [
  'normalAttack',
  'normalAttackLastCombo',
  'powerAttack',
  'normalSkill',
  'comboSkill',
  'ultimateSkill',
  'plungingAttack',
  'dashAttack',
  'fireBurst',
  'electricBurst',
  'cryoBurst',
  'natureBurst',
  'fireAbnormal',
  'electricAbnormal',
  'cryoAbnormal',
  'natureAbnormal',
] as const;

/** 单次伤害携带的可叠加语义分类，供公式、事件和机制筛选。 */
export type DamageTag = (typeof DAMAGE_TAGS)[number];

/** 不参与技能类型归类，但会影响命中处理或事件筛选的伤害特征。 */
export const DAMAGE_FEATURES = [
  'canBreakWeakness',
  'crush',
  'airborne',
  'shatter',
  'dot',
  'remainArea',
  'talentDamage',
  'physicalInfliction',
] as const;

export type DamageFeature = (typeof DAMAGE_FEATURES)[number];

export const SKILL_TYPES = [
  'basicAttack',
  'battleSkill',
  'comboSkill',
  'ultimate',
  'finisher',
  'plungingAttack',
] as const;

/** 技能库、养成等级和战斗事件共同使用的技能大类。 */
export type SkillType = (typeof SKILL_TYPES)[number];

export const SKILL_LEVEL_SOURCES = [
  'basicAttack',
  'battleSkill',
  'comboSkill',
  'ultimate',
] as const;

/** 指明一个技能组从干员养成方案的哪个字段读取等级。 */
export type SkillLevelSource = (typeof SKILL_LEVEL_SOURCES)[number];

export const OPERATOR_MISSING_CAPABILITIES = [
  'skillBehavior',
  'skillAvailability',
  'talentEffects',
  'potentialEffects',
  'runtimeDependencies',
] as const;

/** 宽松转换允许省略、但必须向使用者声明的能力类别。 */
export type OperatorMissingCapability = (typeof OPERATOR_MISSING_CAPABILITIES)[number];

/**
 * 干员定义相对原始数据的转换支持状态。
 * 这里只保存稳定、非本地化的能力摘要；解析异常、文件路径等审计细节留在生成报告中。
 */
export interface OperatorConversionSupport {
  readonly completeness: 'complete' | 'partial';
  readonly missingCapabilities: readonly {
    readonly capability: OperatorMissingCapability;
    /** 仅当缺失能力能明确归到某个技能组时，给出该技能组的稳定键。 */
    readonly skillGroupKeys?: readonly string[];
  }[];
}

export const COMBAT_RESOURCES = ['sp', 'ultimateEnergy'] as const;

/** 通用技能步骤当前允许结算的共享或个人战斗资源。 */
export type CombatResource = (typeof COMBAT_RESOURCES)[number];

export const COMBAT_TARGETS = ['caster', 'enemy'] as const;

/** 干员 DSL 中无需多敌人寻址的语义目标。 */
export type CombatTarget = (typeof COMBAT_TARGETS)[number];

export const TIMED_MARKER_TARGETS = [
  ...COMBAT_TARGETS,
  'eventTarget',
  'buffOwner',
  'buffSource',
] as const;

/** 定时标记还可明确落到触发当前响应的事件目标。 */
export type TimedMarkerTarget = (typeof TIMED_MARKER_TARGETS)[number];

export const TIME_DILATION_IGNORE_TARGETS = [...COMBAT_TARGETS, 'controlled'] as const;

/** 全局时间膨胀还可在动作执行帧排除当前主控干员。 */
export type TimeDilationIgnoreTarget = (typeof TIME_DILATION_IGNORE_TARGETS)[number];

export const BUFF_SINGLE_TARGETS = [
  ...COMBAT_TARGETS,
  'currentAbilityEntity',
  'eventTarget',
  'eventSource',
  'buffOwner',
  'buffSource',
] as const;

/** 需要解析到单个 Buff 容器的实例级目标。 */
export type BuffSingleTarget = (typeof BUFF_SINGLE_TARGETS)[number];

export const BUFF_APPLICATION_TARGETS = [
  ...BUFF_SINGLE_TARGETS,
  'controlledOperator',
  'party',
  'partyExceptCaster',
  'partyExceptCasterAndSameCharacterType',
  'casterAndControlledOperator',
  'casterAndLowestHealthRatioOperatorExceptCaster',
] as const;

/** Buff 施加允许面向单体、能力实体，以及由原生队伍选择器严格证明的集合。 */
export type BuffApplicationTarget = (typeof BUFF_APPLICATION_TARGETS)[number];

export const BUFF_APPLICATION_SOURCES = [
  ...COMBAT_TARGETS,
  'currentAbilityEntity',
  'eventSource',
  'buffSource',
  'buffOwner',
] as const;

/** Buff 来源允许保留能力实体 ActionOwner 的稳定身份。 */
export type BuffApplicationSource = (typeof BUFF_APPLICATION_SOURCES)[number];

export const COMPARISON_OPERATORS = [
  'equal',
  'notEqual',
  'greater',
  'greaterOrEqual',
  'less',
  'lessOrEqual',
] as const;

/** 数据驱动条件中支持的数值比较运算。 */
export type ComparisonOperator = (typeof COMPARISON_OPERATORS)[number];

/** 所有等级共用一个值，或为每个等级分别提供值。 */
export type LevelValues = number | readonly number[];

export const DAMAGE_CALCULATIONS = ['standard', 'breakingAttack', 'attribute'] as const;

/** 命中进入标准或破防专用公式前处理的计算路径。 */
export type DamageCalculation = (typeof DAMAGE_CALCULATIONS)[number];

export const RESOURCE_RECIPIENTS = ['caster', 'team'] as const;

/** 资源变化步骤当前允许作用的施法者或全队范围。 */
export type ResourceRecipient = (typeof RESOURCE_RECIPIENTS)[number];

export const HEAL_TARGETS = [
  'caster',
  'buffSource',
  'buffOwner',
  'controlledOperator',
  'lowestHealthRatioOperator',
  'lowestHealthRatioOperatorExceptControlled',
] as const;

/** 当前原生治疗样本能够严格归约的队伍目标身份。 */
export type HealTarget = (typeof HEAL_TARGETS)[number];

export const SP_GAIN_KINDS = ['gain', 'refund'] as const;

/** 技力增加是否计入返还技力；返还部分再次被消耗时不会重复转化为终结技能量。 */
export type SpGainKind = (typeof SP_GAIN_KINDS)[number];

export const SP_GAIN_SOURCES = ['default', 'normalAttack', 'powerAttack', 'skill'] as const;

/** 原生共享 SP 获取效率用于区分普攻、重击和其他动作来源。 */
export type SpGainSource = (typeof SP_GAIN_SOURCES)[number];

export type PhysicalInflictionType = 'airborne' | 'knockDown' | 'fracture' | 'crush';

/** 原生 EnemyTemplateData.rank；与用于筛选和展示的五档 EnemyTier 无关。 */
export const ENEMY_RANKS = ['mob', 'elite', 'boss'] as const;

export type EnemyRank = (typeof ENEMY_RANKS)[number];

export type ActionBlackboardValue = string | number | null;
