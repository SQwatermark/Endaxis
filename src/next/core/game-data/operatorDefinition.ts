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

export const TIME_DILATION_IGNORE_TARGETS = [...COMBAT_TARGETS, 'controlled'] as const;
/** 全局时间膨胀还可在动作执行帧排除当前主控干员。 */
export type TimeDilationIgnoreTarget = (typeof TIME_DILATION_IGNORE_TARGETS)[number];

export const BUFF_APPLICATION_TARGETS = [
  ...COMBAT_TARGETS,
  'party',
  'partyExceptCaster',
  'casterAndControlledOperator',
  'casterAndLowestHealthRatioOperatorExceptCaster',
  'currentAbilityEntity',
  'eventTarget',
] as const;
/** Buff 施加允许面向单体、能力实体，以及由原生队伍选择器严格证明的集合。 */
export type BuffApplicationTarget = (typeof BUFF_APPLICATION_TARGETS)[number];

export const BUFF_APPLICATION_SOURCES = [...COMBAT_TARGETS, 'currentAbilityEntity'] as const;
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

export const DAMAGE_CALCULATIONS = ['standard', 'breakingAttack'] as const;
/** 命中进入标准或破防专用公式前处理的计算路径。 */
export type DamageCalculation = (typeof DAMAGE_CALCULATIONS)[number];

/** 一次伤害步骤的完整声明；倍率使用小数，失衡与生命伤害同属该命中。 */
export interface DealDamageParameters {
  damageType: DamageType;
  /** 生成基础伤害所用的公式；标准攻击倍率路径可省略。 */
  calculation?: DamageCalculation;
  /** 单次命中的攻击倍率；原生允许在命中前通过动作黑板动态计算。 */
  attackScale: LevelValues | ActionValueOperand;
  /** 破防攻击计算中的逐命中倍率；标准伤害不得设置。 */
  calculationMultiplier?: LevelValues;
  tags: readonly DamageTag[];
  /** 原生伤害位中与技能分类无关的行为特征。 */
  features?: readonly DamageFeature[];
  /** 同一次命中在生命伤害之后结算的失衡伤害；原生同样允许从动作黑板读取。 */
  stagger?: LevelValues | ActionValueOperand;
  /** 每层语义化战斗状态提供的额外攻击倍率。 */
  attackScalePerStatusStack?: {
    statusKey: string;
    target: CombatTarget;
    coefficient: LevelValues;
  };
}

/**
 * 不读取攻击力的固定基础值伤害。
 * 固定值只替代标准伤害的“攻击力乘倍率”阶段，后续伤害修正与防御、抗性公式保持不变。
 */
export interface DealFixedDamageParameters {
  damageType: DamageType;
  value: LevelValues | ActionValueOperand;
  tags: readonly DamageTag[];
  /** 原生伤害位中与技能分类无关的行为特征。 */
  features?: readonly DamageFeature[];
  /** 同一次命中在生命伤害之后结算的失衡伤害。 */
  stagger?: LevelValues | ActionValueOperand;
}

/**
 * 技能可用性、条件步骤和事件响应共享的条件树。
 * 新条件必须能由运行时统一求值，不能在干员文件中嵌入函数。
 */
export type CombatCondition =
  /** 时间轴模拟始终处于战斗阶段，用于承接原生的队伍战斗状态检查。 */
  | { kind: 'combatActive' }
  /** Endaxis 固定单敌人场景中，表示原生智能目标数量检查已被模型保证。 */
  | { kind: 'singleEnemyPresent' }
  /** 当前技能所属干员是否为该帧的主控干员；必须由场景运行时提供主控身份。 */
  | { kind: 'casterControlled' }
  /** 当前单敌人是否属于任一原生 EnemyTemplateData.rank。 */
  | { kind: 'enemyRankIn'; ranks: readonly import('./enemyRank').EnemyRank[] }
  | {
      /** 比较当前单敌人的原生整数超级护甲值。 */
      kind: 'enemySuperArmorCompare';
      operator: ComparisonOperator;
      value: ActionValueOperand;
    }
  | {
      /** 比较镜头前向到施法者→目标方向、绕世界上轴的有符号角度。 */
      kind: 'cameraToTargetAngleCompare';
      operator: ComparisonOperator;
      value: ActionValueOperand;
    }
  | { kind: 'skillBranchEnabled'; branchKey: string }
  | { kind: 'targetStaggered'; target: CombatTarget }
  | {
      /** 比较目标当前生命值或当前/最大生命比例。 */
      kind: 'healthCompare';
      target: CombatTarget | HealTarget;
      valueType: 'current' | 'ratio';
      operator: ComparisonOperator;
      value: ActionValueOperand;
    }
  | {
      /** 比较目标当前失衡值；目标没有失衡系统时返回原生配置值。 */
      kind: 'poiseCompare';
      target: CombatTarget;
      returnValueIfMissing: boolean;
      operator: ComparisonOperator;
      value: ActionValueOperand;
    }
  | { kind: 'contextFlagEquals'; flag: string; value: boolean | number | string }
  | {
      /** 比较同一技能实例动作黑板中的动态值与常量，或比较两个动态值。 */
      kind: 'actionValueCompare';
      left: ActionValueOperand;
      operator: ComparisonOperator;
      right: ActionValueOperand;
    }
  | {
      /** 以原生 RandomUtil.Dice(float) 对动作黑板或常量概率取样。 */
      kind: 'probability';
      probability: ActionValueOperand;
    }
  | {
      /** 比较本次释放 Context 中已查询目标组的实例数量。 */
      kind: 'contextTargetCountCompare';
      contextKey: string;
      operator: ComparisonOperator;
      value: number;
    }
  | {
      /** 比较当前 Context 迭代目标的有限能力实体剩余时长。 */
      kind: 'abilityEntityRemainingDurationCompare';
      operator: ComparisonOperator;
      value: ActionValueOperand;
    }
  | { kind: 'statusActive'; statusKey: string; target: CombatTarget; minimumStacks?: number }
  | {
      /** 按原生 Buff 标签查询累计强化层数，并使用原生容差比较。 */
      kind: 'buffStackCompare';
      target: CombatTarget;
      tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      buffTagIds: readonly number[];
      sameSourceSkillCast?: boolean;
      operator: ComparisonOperator;
      value: ActionValueOperand;
    }
  | {
      /** 查询目标实体当前持有的 GameplayTag；它与 Buff 身份、数量和层数无关。 */
      kind: 'entityTagMatch';
      target: CombatTarget;
      tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      tagIds: readonly number[];
    }
  | {
      /** 按Buff 定义 身份查询累计强化层数；ID 列表按“任一匹配”处理。 */
      kind: 'buffIdStackCompare';
      target: CombatTarget | 'currentAbilityEntity';
      buffIds: readonly string[];
      sameSourceSkillCast?: boolean;
      operator: ComparisonOperator;
      value: number | ActionValueOperand;
    }
  | {
      /** 检查目标能力系统中是否存在仍有效的原生定时标记。 */
      kind: 'timedMarkerPresent';
      target: CombatTarget;
      markerId: string;
    }
  | {
      /** 检查当前能力实体或 Context 能力实体集合中仍有效的定时标记。 */
      kind: 'abilityEntityTimedMarkerPresent';
      markerId: string;
      contextKey?: string;
    }
  | {
      /** 匹配触发当前响应的伤害事件标签；普通技能步骤没有事件上下文。 */
      kind: 'eventDamageTagsMatch';
      match: 'exact' | 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      tags: readonly DamageTag[];
    }
  | {
      /** 匹配触发当前响应的伤害行为特征；普通技能步骤没有事件上下文。 */
      kind: 'eventDamageFeaturesMatch';
      match: 'exact' | 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      features: readonly DamageFeature[];
    }
  | {
      /** 匹配触发 Buff 响应的待施放技能类型。 */
      kind: 'eventSkillTypeIn';
      skillTypes: readonly SkillType[];
    }
  | {
      /** 匹配触发 Buff 响应的待施放技能稳定身份。 */
      kind: 'eventSkillIdIn';
      skillIds: readonly string[];
    }
  | {
      /** 匹配触发当前响应的新施加 Buff 身份。 */
      kind: 'eventBuffIdMatch';
      buffIds: readonly string[];
    }
  | {
      /** 匹配触发当前响应的新施加 Buff 原生标签。 */
      kind: 'eventBuffTagsMatch';
      match: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      buffTagIds: readonly number[];
    }
  /** Buff 宿主的承伤事件来源是否等于创建该 Buff 的实体。 */
  | { kind: 'eventSourceMatchesBuffSource' }
  /** 当前 Buff 的创建来源实体是否也是其宿主。 */
  | { kind: 'buffSourceMatchesOwner' }
  | {
      kind: 'elementalInflictionPresent';
      elements: DamageElement | readonly DamageElement[];
      minimumStacks?: number;
    }
  | {
      kind: 'elementalReactionActive';
      reaction: ElementalReaction;
      minimumLevel?: number;
    }
  | { kind: 'not'; condition: CombatCondition }
  | { kind: 'all'; conditions: readonly CombatCondition[] }
  | { kind: 'any'; conditions: readonly CombatCondition[] }
  | {
      kind: 'deckAttributeCompare';
      left: OperatorAttribute;
      operator: ComparisonOperator;
      right: OperatorAttribute;
    };
export const COMBAT_CONDITION_KINDS = [
  'combatActive',
  'singleEnemyPresent',
  'casterControlled',
  'enemyRankIn',
  'enemySuperArmorCompare',
  'cameraToTargetAngleCompare',
  'skillBranchEnabled',
  'targetStaggered',
  'healthCompare',
  'poiseCompare',
  'contextFlagEquals',
  'actionValueCompare',
  'probability',
  'contextTargetCountCompare',
  'abilityEntityRemainingDurationCompare',
  'statusActive',
  'buffStackCompare',
  'entityTagMatch',
  'buffIdStackCompare',
  'timedMarkerPresent',
  'abilityEntityTimedMarkerPresent',
  'eventDamageTagsMatch',
  'eventDamageFeaturesMatch',
  'eventSkillTypeIn',
  'eventSkillIdIn',
  'eventBuffIdMatch',
  'eventBuffTagsMatch',
  'eventSourceMatchesBuffSource',
  'buffSourceMatchesOwner',
  'elementalInflictionPresent',
  'elementalReactionActive',
  'not',
  'all',
  'any',
  'deckAttributeCompare',
] as const satisfies readonly CombatCondition['kind'][];
/** 条件构造器和严格解析器按 kind 区分的种类。 */
export type CombatConditionKind = (typeof COMBAT_CONDITION_KINDS)[number];

/** 条件判断读取的动作实例值；黑板键只在当前技能实例生命周期内有效。 */
export type ActionValueOperand =
  { kind: 'blackboard'; key: string } | { kind: 'constant'; value: number };

/** Unity AnimationCurve 的关键帧；权重位与原生 WeightedMode 保持一致。 */
export interface TimeScaleCurveKeyDefinition {
  readonly time: number;
  readonly value: number;
  readonly inTangent: number;
  readonly outTangent: number;
  readonly weightedMode: 0 | 1 | 2 | 3;
  readonly inWeight: number;
  readonly outWeight: number;
}

/** 时间膨胀可以引用版本配置中的公共曲线，也可以携带技能自己的内联曲线。 */
export type TimeScaleCurveDefinition =
  | { readonly kind: 'named'; readonly key: string }
  | { readonly kind: 'inline'; readonly keys: readonly TimeScaleCurveKeyDefinition[] };

export const ACTION_VALUE_OPERATIONS = [
  'assign',
  'add',
  'multiply',
  'divide',
  'floor',
  'ceil',
  'roundToInt',
] as const;
/** `ModifyDynamicBlackboard` 直接值路径已闭环的运算集合。 */
export type ActionValueOperation = (typeof ACTION_VALUE_OPERATIONS)[number];

export const ACTION_VALUE_CALCULATION_OPERATIONS = ['add', 'multiply', 'divide'] as const;
/** `SimpleCalcBBAction` 使用两个显式操作数计算结果，不读取目标键的旧值。 */
export type ActionValueCalculationOperation = (typeof ACTION_VALUE_CALCULATION_OPERATIONS)[number];

/** 只依赖养成面板、可在战斗开始前决定的条件子集。 */
export type BuildCondition = Extract<CombatCondition, { kind: 'deckAttributeCompare' }>;

export const RESOURCE_RECIPIENTS = ['caster', 'team'] as const;
/** 资源变化步骤当前允许作用的施法者或全队范围。 */
export type ResourceRecipient = (typeof RESOURCE_RECIPIENTS)[number];

export const HEAL_TARGETS = [
  'caster',
  'buffSource',
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

/** 生成期已从原生 born-tag 证据解析出的可执行能力实体查询。 */
export type AbilityEntityTargetQuery =
  | {
      readonly kind: 'ownerSpawned';
      readonly abilityEntityIds?: readonly string[];
    }
  | { readonly kind: 'context'; readonly contextKey: string };

/**
 * 语义战斗状态每层能够贡献的修正。
 * 这些定义由编译器展开，不能携带运行时回调或直接引用 UI 状态。
 */
export type StatusModifierDefinition =
  | { kind: 'attackPercent'; value: LevelValues }
  | {
      kind: 'susceptibility';
      damageTypes: readonly DamageType[];
      value: LevelValues;
      attributeScaling?: { attribute: OperatorAttribute; coefficient: LevelValues };
      cap?: LevelValues;
    }
  | { kind: 'slowed' }
  | { kind: 'blockResourceGain'; resource: CombatResource }
  | { kind: 'resourceCostMultiplier'; resource: CombatResource; value: number }
  | { kind: 'skillCooldownMultiplier'; skillGroupKey: string; value: number };
export const STATUS_MODIFIER_KINDS = [
  'attackPercent',
  'susceptibility',
  'slowed',
  'blockResourceGain',
  'resourceCostMultiplier',
  'skillCooldownMultiplier',
] as const satisfies readonly StatusModifierDefinition['kind'][];

/** 由一个逻辑能力实体独占、按该实体局部时钟执行的无施法子技能。 */
export interface AbilityEntityChildSkillDefinition {
  readonly skillId: string;
  readonly blackboard?: Readonly<Record<string, LevelValues>>;
  readonly scheduledSequences: readonly ScheduledSequenceDefinition[];
}

/** 可由干员级定义表复用的完整逻辑能力实体蓝图。 */
export interface AbilityEntityDefinition {
  readonly lifetime:
    { readonly kind: 'limited'; readonly durationSeconds: number } | { readonly kind: 'infinite' };
  readonly childSkill?: AbilityEntityChildSkillDefinition;
}

/** 干员级能力实体蓝图；技能只引用身份并提供本次生成参数。 */
export type OperatorAbilityEntityDefinitions = Readonly<Record<string, AbilityEntityDefinition>>;

/**
 * 所有战斗步骤与参数结构的集中映射。
 * 增加步骤时必须同时提供编译、运行时执行和严格校验，不能只扩展此类型。
 */
export interface CombatStepParameters {
  /** 按 owner 与生成期已解析的实体身份查询，并保存为本次释放的 Context 目标组。 */
  findOwnerSpawnedAbilityEntities: {
    saveToContextKey: string;
    abilityEntityIds?: readonly string[];
    /** 使用当前技能或 Buff 继承的施法序号执行 SkillCastIdValidator。 */
    sameSourceSkillCast?: boolean;
    /** 可选地把同一查询结果数量写入动作黑板，后续复用 actionValueCompare。 */
    saveCountToBlackboardKey?: string;
  };
  /** 从既有 Context 目标组按运行时索引选出一个稳定句柄，覆盖写入新组。 */
  pickContextTarget: {
    sourceContextKey: string;
    saveToContextKey: string;
    index: ActionValueOperand;
  };
  /** 对本次释放 Context 中已经固定的目标句柄逐一同步执行同一序列。 */
  forEachContextTarget: {
    contextKey: string;
  };
  /** 读取当前 Context 迭代目标的能力实体剩余时长到动作黑板。 */
  readAbilityEntityRemainingDuration: {
    outputKey: string;
  };
  /** 将当前 Context 迭代目标的能力实体剩余时长赋为一个明确数值。 */
  setAbilityEntityRemainingDuration: {
    value: ActionValueOperand;
  };
  /** 结束当前 Context 迭代目标所指向的能力实体。 */
  finishCurrentAbilityEntity: Record<string, never>;
  /** 仅在当前能力实体的来源已经死亡时结束该实体。 */
  finishCurrentAbilityEntityWhenSourceDies: Record<string, never>;
  /** 在当前 Context 迭代目标所指向的既有能力实体上启动一个无施法子技能。 */
  startCurrentAbilityEntityChildSkill: {
    childSkill: AbilityEntityChildSkillDefinition;
  };
  /** 在零空间模型中生成一个有独立身份、生命周期和实体黑板的逻辑能力实体。 */
  spawnAbilityEntity: {
    abilityEntityId: string;
    /** 手写定义可暂时内联；生成定义从干员或只读公共定义表按 ID 解析。 */
    definition?: AbilityEntityDefinition;
    /** 原生 assignBlackboard：生成时把当前动作黑板复制为实体黑板初值。 */
    inheritActionBlackboard?: boolean;
    target?: CombatTarget;
    overrideDurationSeconds?: ActionValueOperand;
    saveToContextKey?: string;
    dieWhenSourceDies: boolean;
    blackboardAssignments?: Readonly<Record<string, ActionValueOperand>>;
  };
  applyElementalInfliction: { element: InflictionElement; isExtra: boolean };
  /**
   * 对固定敌人执行物理异常入口。公共 Buff 蓝图随使用点内联，运行时按目标当前层数
   * 选择首次破防或后续异常链，不把公共 Buff 变成可编辑的项目级钻石依赖。
   */
  applyPhysicalInfliction: {
    type: 'fracture';
    target: 'enemy';
    isExtra: boolean;
    noGuardBuffId: string;
    noGuardDefinition: SkillBuffDefinition;
    fractureBuffId: string;
    fractureDefinition: SkillBuffDefinition;
  };
  applyElementalReaction: {
    reaction: ElementalReaction;
    target: CombatTarget;
    durationSeconds: number;
    effectiveness: number;
  };
  consumeElementalReaction: {
    reaction: ElementalReaction;
    target: 'enemy';
  };
  /** 报告一次对固定目标成功输出浮空；木桩模型不保存位移、朝向或控制状态。 */
  outputAirborne: { target: CombatTarget };
  dealDamage: DealDamageParameters;
  dealFixedDamage: DealFixedDamageParameters;
  /** 不伴随生命伤害的独立失衡单元；数值仍会经过来源与目标的失衡倍率。 */
  dealStagger: { value: LevelValues | ActionValueOperand };
  /** 按施法者属性计算，并写入干员生命账本的普通治疗。 */
  heal: {
    target: HealTarget;
    /** 原生 AbilityAction.alwaysNext；false 时保留治疗应用失败的序列短路。 */
    alwaysNext?: boolean;
    /** 原生 useHealTags 开启时的 GameplayTag 整数身份。 */
    tagIds: readonly number[];
  } & (
    | {
        /** 按施法者属性乘区与固定加区计算。 */
        attribute: HealCalculationAttribute;
        multiplier: LevelValues | ActionValueOperand;
        addition: LevelValues | ActionValueOperand;
        amount?: never;
      }
    | {
        /** 原生 DefiniteValueCalculation：直接使用动作值，不读取施法者属性。 */
        amount: LevelValues | ActionValueOperand;
        attribute?: never;
        multiplier?: never;
        addition?: never;
      }
  );
  applyBuff: {
    buffId: string;
    /** 本步骤施加的完整 Buff 蓝图；运行时实例创建后不再被后续同 key 步骤改写。 */
    definition?: SkillBuffDefinition;
    target: BuffApplicationTarget;
    /** 原生 CreateBuffAction 的循环次数；省略时执行一次，正小数按 `int < float` 语义向上取整。 */
    count?: ActionValueOperand;
    /**
     * Buff 的来源实体；省略时沿用当前动作来源。
     * 该字段与接收 Buff 的 `target` 相互独立，只应在原生动作显式改写来源时配置。
     */
    source?: BuffApplicationSource;
    /** 在施加时从当前技能动作黑板求值，并覆盖 Buff 定义黑板的同名默认值。 */
    blackboardAssignments?: Readonly<Record<string, ActionValueOperand>>;
    /** 原生动作要求把当前施法身份复制到新 Buff 时为 true。 */
    inheritSourceSkillCastInfo?: boolean;
    /** 原生区域/动作生命周期结束时，只结束本步骤实际创建的 Buff 实例。 */
    finishByAction?: boolean;
    durationSeconds?: number;
    effectiveness?: number;
  };
  /** 按原生 ID 或标签查询目标的首个有效 Buff，并把其数值黑板写入当前动作黑板。 */
  readBuffBlackboard: {
    target: CombatTarget;
    query:
      | { kind: 'id'; buffIds: readonly string[] }
      | {
          kind: 'tag';
          tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
          buffTagIds: readonly number[];
        };
    desiredKey: string;
    outputKey: string;
  };
  /** 查询匹配 Buff 的累计层数，并写入当前技能实例的动作黑板。 */
  readBuffStackCount: {
    target: CombatTarget;
    outputKey: string;
    query:
      | { kind: 'id'; buffIds: readonly string[] }
      | {
          kind: 'tag';
          tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
          buffTagIds: readonly number[];
        };
    sameSourceSkillCast?: boolean;
  };
  /** 按原生标签查询结束目标身上所有匹配的 Buff。 */
  finishBuffsByTag: {
    target: Exclude<
      BuffApplicationTarget,
      | 'party'
      | 'partyExceptCaster'
      | 'casterAndControlledOperator'
      | 'casterAndLowestHealthRatioOperatorExceptCaster'
    >;
    tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
    buffTagIds: readonly number[];
    reason: 'early' | 'absorbed' | 'other';
  };
  /** 按 Buff 定义身份结束目标身上的匹配实例；count 缺省时结束全部。 */
  finishBuffsById: {
    target: BuffApplicationTarget;
    buffIds: readonly string[];
    reason: 'early' | 'absorbed' | 'other';
    count?: ActionValueOperand;
  };
  /** 结束当前正在执行生命周期或事件响应的 Buff 实例。 */
  finishCurrentBuff: {
    reason: 'early' | 'absorbed' | 'other';
  };
  /** 设置当前正在执行事件响应的 Buff 实例是否暂停计时。 */
  setCurrentBuffTimePaused: {
    paused: boolean;
  };
  /** 以原生点燃类型同步触发目标身上所有匹配响应；来源与接收目标保持独立。 */
  igniteBuffs: {
    target: CombatTarget;
    source: CombatTarget | 'currentBuffSource';
    igniteType: string;
  };
  /** 按原生技能筛选立即修改当前冷却；比例基数是配置的基础冷却时长，绝对值单位为秒。 */
  adjustSkillCooldown: {
    target: 'caster';
    skill:
      | { readonly kind: 'type'; readonly skillType: SkillType }
      | { readonly kind: 'id'; readonly skillId: string };
    operation: 'reduce' | 'set';
    basis: 'baseDurationRatio' | 'absoluteSeconds';
    value: ActionValueOperand;
  };
  /** 在当前调度区间存续期间禁止施法者身上已匹配的 Buff 结束。 */
  holdBuffsById: {
    target: 'caster';
    buffIds: readonly string[];
  };
  /** 在目标能力系统上创建定时标记；同 ID 标记不会互相覆盖。 */
  createTimedMarker: {
    target: CombatTarget;
    markerId: string;
    durationSeconds: ActionValueOperand;
    autoFinishByAction: boolean;
  };
  /** 在当前能力实体上创建定时标记；每个标记显式选择共享战斗或实体自身时钟。 */
  createAbilityEntityTimedMarker: {
    markerId: string;
    durationSeconds: ActionValueOperand;
    autoFinishByAction: boolean;
    timeDomain: 'global' | 'self';
  };
  /** 创建普通全局或实体时间膨胀实例；终结技专用时间动作另行建模。 */
  startTimeDilation:
    | {
        scope: 'global';
        durationSeconds: ActionValueOperand;
        slot: number;
        priority: number;
        curve: TimeScaleCurveDefinition;
        finishByAction: boolean;
        ignoredTargets: readonly TimeDilationIgnoreTarget[];
        ignoredAbilityEntityTargets?: readonly AbilityEntityTargetQuery[];
        influenceSkillCooldownSeconds?: ActionValueOperand;
      }
    | {
        scope: 'entity';
        durationSeconds: ActionValueOperand;
        slot: number;
        priority: number;
        curve: TimeScaleCurveDefinition;
        finishByAction: boolean;
        targets: readonly CombatTarget[];
        abilityEntityTargets?: readonly AbilityEntityTargetQuery[];
        ignoreSlotCheck?: boolean;
      };
  /** 终结技专用恒定全局时间倍率；实例随承载动作结束，施法者自动忽略。 */
  startUltimateTimeDilation: {
    priority: number;
    targetScale: ActionValueOperand;
    ignoredTargets: readonly TimeDilationIgnoreTarget[];
    ignoredAbilityEntityTargets?: readonly AbilityEntityTargetQuery[];
  };
  /** 修改当前技能实例的动作黑板；不得用于跨技能持久状态。 */
  storeCurrentTimelineFrame: {
    /** 把宿主技能或能力实体子技能的局部整数执行帧写入动作黑板。 */
    outputKey: string;
  };
  modifyActionValue: {
    key: string;
    operation: ActionValueOperation;
    value: ActionValueOperand;
  };
  /** 计算两个动作黑板操作数，并将单精度结果写入当前技能实例。 */
  calculateActionValue: {
    key: string;
    operation: ActionValueCalculationOperation;
    left: ActionValueOperand;
    right: ActionValueOperand;
  };
  /** 按原生 StoreAttributeValue 语义读取动作来源实体的动态非转化属性。 */
  storeSourceAttributeValue: {
    attribute: { kind: 'specific'; key: string } | { kind: 'main' | 'secondary' | 'all' };
    stage: 'armedNonConverted' | 'finalNonConverted';
    useFloor: boolean;
    divisor: ActionValueOperand;
    multiplier: ActionValueOperand;
    base: ActionValueOperand;
    targetKey: string;
  };
  changeResource: {
    resource: CombatResource;
    amount: LevelValues;
    /** 原生 ObtainCostAction 在资源效率链之前乘到 amount 上；省略时为 1。 */
    coefficient?: LevelValues;
    recipient: ResourceRecipient;
    /** 仅对正向技力变化有效；省略时按普通获得处理。 */
    spGainKind?: SpGainKind;
    spGainSource?: SpGainSource;
    /** 终结技能量专用：按最大能量的比例解释倍率链结果。 */
    isPercentValue?: boolean;
    /** 终结技能量专用：正向回复携带的许可标签。 */
    ultimateRecoveryTagId?: number;
    /** 终结技能量专用：跳过目标自身的回能效率。 */
    ignoreUltimateEnergyGainMultiplier?: boolean;
  };
  /** 执行时从当前技能动作黑板读取数值，再交给同一资源账本处理。 */
  changeResourceByActionValue: {
    resource: CombatResource;
    amount: ActionValueOperand;
    /** 原生 ObtainCostAction 在资源效率链之前乘到动态 amount 上；省略时为 1。 */
    coefficient?: LevelValues | ActionValueOperand;
    recipient: ResourceRecipient;
    spGainKind?: SpGainKind;
    spGainSource?: SpGainSource;
    isPercentValue?: boolean;
    ultimateRecoveryTagId?: number;
    ignoreUltimateEnergyGainMultiplier?: boolean;
  };
  gainSquadUltimateEnergyFromSkillCost: { coefficient: LevelValues };
  gainFinisherSp: { factor: number; recipient: 'team' };
  applyStatus: {
    statusKey: string;
    target: CombatTarget;
    durationFrames?: LevelValues;
    stacks?: number;
    maxStacks?: number;
    modifiers?: readonly StatusModifierDefinition[];
  };
  consumeStatus: {
    statusKey: string;
    target: CombatTarget;
    stacks?: number;
  };
  /** 在所在调度区间内持续检查条件，首次通过时把宿主局部时间轴推进到目的帧。 */
  jumpTimeline: {
    destinationFrame: number;
    condition?: CombatCondition;
  };
  /** 立即结束当前宿主技能时间轴；只承接原生 InterruptCurSkillAction。 */
  finishTimeline: Record<string, never>;
  conditional: {
    condition: CombatCondition;
    /** 原生条件动作通过时无论分支结果如何都允许外层序列继续。 */
    alwaysNext?: boolean;
  };
  /** 同一个技能释放实例内共享的只执行一次作用域。 */
  once: { scopeKey: string };
  /** 在承载调度区间开始时以及之后每次宿主 Tick 中同步执行一次 body。 */
  repeatEachTick: Record<string, never>;
  setContextFlag: {
    flag: string;
    value: boolean | number | string;
    target: 'caster';
  };
  /** 为当前干员开启固定五秒的连携候选；下一段技能身份随候选进入场景级队列。 */
  openComboWindow: {
    nextSkillKey: string;
  };
  /** 切换稳定技能组后续释放所使用的技能形态；当前已启动的释放不受影响。 */
  changeSkillSlot: {
    skillGroupKey: string;
    targetSkillKey: string;
    /** 原生 ChangeSkillAction 在切换前把当前形态的归一化冷却进度传给目标形态。 */
    inheritOriginSkillCooldownProgress?: boolean;
  };
  /**
   * 在所在调度项的有效区间内监听战斗事件。
   * 调度项开始时注册，结束或技能中断时注销；响应序列在事件派发过程中同步执行。
   */
  listenForCombatEvents: {
    responses: readonly CombatEventResponseDefinition[];
  };
}

export const COMBAT_STEP_KINDS = [
  'findOwnerSpawnedAbilityEntities',
  'pickContextTarget',
  'forEachContextTarget',
  'readAbilityEntityRemainingDuration',
  'setAbilityEntityRemainingDuration',
  'finishCurrentAbilityEntity',
  'finishCurrentAbilityEntityWhenSourceDies',
  'startCurrentAbilityEntityChildSkill',
  'spawnAbilityEntity',
  'applyElementalInfliction',
  'applyPhysicalInfliction',
  'applyElementalReaction',
  'consumeElementalReaction',
  'outputAirborne',
  'dealDamage',
  'dealFixedDamage',
  'dealStagger',
  'heal',
  'applyBuff',
  'readBuffBlackboard',
  'readBuffStackCount',
  'finishBuffsByTag',
  'finishBuffsById',
  'finishCurrentBuff',
  'setCurrentBuffTimePaused',
  'igniteBuffs',
  'adjustSkillCooldown',
  'holdBuffsById',
  'createTimedMarker',
  'createAbilityEntityTimedMarker',
  'startTimeDilation',
  'startUltimateTimeDilation',
  'storeCurrentTimelineFrame',
  'modifyActionValue',
  'calculateActionValue',
  'storeSourceAttributeValue',
  'changeResource',
  'changeResourceByActionValue',
  'gainSquadUltimateEnergyFromSkillCost',
  'gainFinisherSp',
  'applyStatus',
  'consumeStatus',
  'jumpTimeline',
  'finishTimeline',
  'conditional',
  'once',
  'repeatEachTick',
  'setContextFlag',
  'openComboWindow',
  'changeSkillSlot',
  'listenForCombatEvents',
] as const satisfies readonly (keyof CombatStepParameters)[];
/** 步骤按 kind 区分类型，编译和执行靠它精确分支。 */
export type CombatStepKind = (typeof COMBAT_STEP_KINDS)[number];

type CombatStepForKind<K extends CombatStepKind> = {
  /** 仅当其他定义需要引用此步骤时提供。 */
  key?: string;
  kind: K;
  parameters: Readonly<CombatStepParameters[K]>;
} & (K extends 'conditional'
  ? { whenTrue: ActionSequenceDefinition; whenFalse?: ActionSequenceDefinition }
  : K extends 'once'
    ? { body: ActionSequenceDefinition }
    : K extends 'repeatEachTick'
      ? { body: ActionSequenceDefinition }
      : K extends 'forEachContextTarget'
        ? { body: ActionSequenceDefinition }
        : {});

/** 干员定义中可执行、按 `kind` 精确区分的一项步骤。 */
export type CombatStepDefinition = {
  [K in CombatStepKind]: CombatStepForKind<K>;
}[CombatStepKind];

/** 同一时点严格按数组顺序同步执行的步骤集合。 */
export interface ActionSequenceDefinition {
  steps: readonly CombatStepDefinition[];
}

/** 相对技能释放帧调度的点事件或持续序列。 */
export interface ScheduledSequenceDefinition {
  startFrame: number;
  /** 仅有状态动作需要；到达该帧时对已经开始的序列调用结束生命周期。 */
  endFrame?: number;
  sequence: ActionSequenceDefinition;
}

/** 技能临时监听器对一类战斗事件的同步响应。 */
export interface CombatEventResponseDefinition {
  key: string;
  event: CombatEventTrigger;
  /** 常驻数据动作显式使用 dataAction；技能区间监听器缺省为 skill。 */
  phase?: 'dataAction' | 'skill';
  /** 仅 dataAction 相位使用，数值越大越先执行。 */
  priority?: number;
  condition?: CombatCondition;
  sequence: ActionSequenceDefinition;
}

/** 技能的一项等级化资源费用；实际扣除时机由技能 `costFrame` 决定。 */
export interface SkillCostDefinition {
  resource: CombatResource;
  value: LevelValues;
}

/** 事件触发器筛选干员自身或全队来源的范围。 */
export type SkillTriggerScope = 'operator' | 'team';
/**
 * 技能和养成效果可以监听的语义战斗事件。
 * 事件身份不包含复杂筛选逻辑，额外限制应由条件树表达。
 */
export type CombatEventTrigger =
  | { kind: 'operatorHit' }
  | { kind: 'buffApplied' }
  | { kind: 'airborneOutput' }
  | { kind: 'damageTagHit'; tag: DamageTag; scope: SkillTriggerScope }
  | {
      kind: 'elementalInflictionApplied';
      elements: DamageElement | readonly DamageElement[];
      scope: SkillTriggerScope;
    }
  | { kind: 'skillHit'; skillGroupKey: string; scope: SkillTriggerScope }
  | { kind: 'enemyDefeated'; scope: SkillTriggerScope }
  | { kind: 'statusExpired'; statusKey: string; target: CombatTarget }
  | { kind: 'statusConsumed'; statusKey: string; target: CombatTarget };

/** 角色级连携入口的一条事件规则；条件成立后进入 pending 或立即尝试释放。 */
export interface ComboSkillTriggerRule {
  trigger: Extract<CombatEventTrigger, { kind: 'damageTagHit' | 'elementalInflictionApplied' }>;
  condition?: CombatCondition;
  /** 对应原生 `comboSkillConditionImmediately`；省略时进入连携窗口。 */
  castImmediately?: boolean;
}

export const COMBO_SKILL_PRIORITIES = ['default', 'firstBlackboard', 'enemyRank'] as const;
/** 同一干员存在多个目标候选时，原生运行时选择实际施法目标的策略。 */
export type ComboSkillPriority = (typeof COMBO_SKILL_PRIORITIES)[number];

/**
 * 角色进入战斗时向场景连携管理器注册的一组入口。
 * 它对应角色级 SkillDataBundle 数据，不属于某次技能释放，也不能在技能块编辑器中修改。
 */
export interface ComboSkillRegistrationDefinition {
  /** 条件成立后准备释放的稳定技能定义键。 */
  skillKey: string;
  priority: ComboSkillPriority;
  /** 创建候选时复制到本次连携施法参数中的默认黑板。 */
  blackboard?: Readonly<Record<string, LevelValues>>;
  rules: readonly ComboSkillTriggerRule[];
}

/** 一个技能在战斗事件发生后调度的条件化行为。 */
export interface CombatEventHandlerDefinition {
  key: string;
  event: CombatEventTrigger;
  condition?: CombatCondition;
  scheduledSequences: readonly ScheduledSequenceDefinition[];
}

/**
 * `applyBuff` 步骤内联的 Buff 蓝图，不重复保存步骤已经携带的 `buffId`。
 * 施加次数、目标和本次传入的黑板值属于施加行为，不属于这份定义。
 */
export interface SkillBuffPresentation {
  /** Endaxis 内部可直接加载的图标路径，只影响编辑器和时间轴显示。 */
  iconPath?: string;
}

/**
 * Buff 实例生命周期边界上的有序步骤。
 * 每个 Buff 实例独占步骤执行状态和动作黑板；同一时点仍严格按步骤数组顺序执行。
 */
export interface SkillBuffLifecycleSequences {
  /** Buff 第一次启用时执行一次，早于修正注册。 */
  start?: ActionSequenceDefinition;
  /** Buff 每次由停用转为启用后执行，晚于修正注册。 */
  enable?: ActionSequenceDefinition;
  /** Buff 暂停生效、准备注销修正前执行。 */
  disable?: ActionSequenceDefinition;
  /** 同组 Buff 即将增加强化层数前执行。 */
  beforeEnhance?: ActionSequenceDefinition;
  /** Buff 启用期间按触发间隔到点时执行。 */
  trigger?: ActionSequenceDefinition;
  /** Buff 叠层数发生变化时执行。 */
  enhanceChanged?: ActionSequenceDefinition;
  /** 一次叠层流程完成后执行。 */
  afterEnhance?: ActionSequenceDefinition;
  /** Buff 正式结束前执行，结束步骤仍能读取当前实例状态。 */
  finish?: ActionSequenceDefinition;
}

/** Buff 启用期间注册在其所有者 AbilitySystem 上的一条同步事件响应。 */
export interface SkillBuffAbilityEventResponse {
  /** 已接入实体 AbilitySystem 事件中心的同步事件。 */
  event:
    | 'enterFight'
    | 'ownerHpZero'
    | 'beforeTakeDamage'
    | 'takeDamage'
    | 'takeCriticalDamage'
    | 'outputDamage'
    | 'beforeCastSkill'
    | 'skillEnd'
    | 'beforeOutputBuff'
    | 'outputBuff'
    | 'addedBuff'
    | 'finishedBuff'
    | 'afterKillEntity';
  /** 原生数据动作优先级；同一事件同优先级的顺序未证明时运行时会拒绝注册。 */
  priority: number;
  sequence: ActionSequenceDefinition;
}

/** Buff 实例对原生 IgniteAction 类型的同步响应。 */
export interface SkillBuffIgniteEventResponse {
  igniteType: string;
  finishAfterIgnited: boolean;
  sequence: ActionSequenceDefinition;
}

/** 原生 ChangeSkillAction 随 DuringBuffEnable 动作结束而撤销的技能槽替换。 */
export interface SkillBuffSlotReplacement {
  readonly skillGroupKey: string;
  readonly targetSkillKey: string;
  readonly revertedSkillKey: string;
  /** 已保留证据位；运行时尚未接入 true 的双向冷却进度复制。 */
  readonly inheritOriginSkillCooldownProgress: boolean;
}

export type SkillBuffDefinition = Omit<
  import('../combat/buffs/combatBuffDefinitions').CombatBuffDefinitionEntry,
  'id' | 'actions' | 'maxStackCount'
> & {
  /** 可在施加时从该 Buff 已合并的实例黑板解析。 */
  maxStackCount?: import('../combat/buffs/combatBuffs').BuffMaxStackCount;
  /** Buff 启用期间按实例局部时钟执行的相对帧时间线。 */
  scheduledSequences?: readonly ScheduledSequenceDefinition[];
  /** 使用与技能相同的步骤协议描述 Buff 行为；旧外部定义的低层 actions 不进入技能内联定义。 */
  lifecycleSequences?: SkillBuffLifecycleSequences;
  /** 每个 Buff 实例独立注册、停用或结束时注销的 Ability 事件响应。 */
  abilityEventResponses?: readonly SkillBuffAbilityEventResponse[];
  /** 每个实例独立持有的点燃响应；处理后是否结束由来源数据显式决定。 */
  igniteEventResponses?: readonly SkillBuffIgniteEventResponse[];
  /** 每次启用时换入、停用或结束时还原；生命周期归当前 Buff 实例所有。 */
  skillSlotReplacements?: readonly SkillBuffSlotReplacement[];
  /** 不参与战斗计算的显示信息。 */
  presentation?: SkillBuffPresentation;
};

/** 干员拥有的 Buff 蓝图表；技能步骤只引用稳定 ID，并在施加时提供实例黑板覆盖值。 */
export type OperatorBuffDefinitions = Readonly<Record<string, SkillBuffDefinition>>;

/**
 * 一个可独立释放或触发的技能定义。
 * 它描述战斗身份和时序，不承载翻译后的名称或编辑器布局。
 */
export interface SkillDefinition {
  key: string;
  /** 原始游戏数据中的技能身份；事件守卫不得用编辑器 key 冒充它。 */
  sourceSkillId?: string;
  /** 技能实例创建时按当前技能等级解析、每次释放前恢复的原生动作黑板。 */
  blackboard?: Readonly<Record<string, LevelValues>>;
  /** 时间轴技能块的显示宽度；由可操作边界推导，不对应原生 `durationFrame`。 */
  timelineBlockFrames: number;
  /**
   * 技能释放条件只生成合法性诊断；不成立也不会阻止技能进入模拟。
   * 模拟层将用户排入时间轴的动作视为已经成功释放，不得改写或跳过。
   */
  availability?: CombatCondition;
  cooldownFrames?: LevelValues;
  costs?: readonly SkillCostDefinition[];
  /** 原生 `CastData.startCdFrame`；配置消耗时编译器要求此字段存在。 */
  costFrame?: number;
  scheduledSequences: readonly ScheduledSequenceDefinition[];
  eventHandlers?: readonly CombatEventHandlerDefinition[];
}

/**
 * 编辑器技能库中的稳定放置单元。
 * `skills` 为数组时表示一次放置所包含的有序技能链，而不是 UI 变体。
 */
export interface SkillGroupDefinition {
  key: string;
  /** 技能库条目内各技能共用的战斗分类。 */
  skillType: SkillType;
  /** 提供当前技能等级的四种养成字段之一。 */
  levelSource: SkillLevelSource;
  /** 单个可放置技能，或作为一个技能库条目放置的有序技能链。 */
  skills: SkillDefinition | readonly SkillDefinition[];
  /**
   * 与 `skills` 共用一个稳定放置身份、仅由运行时换槽动作选中的技能形态。
   * 它们不会被技能库展开为额外技能块，也不能由项目存档直接指定。
   */
  replacementSkills?: readonly SkillDefinition[];
  /** 同一稳定技能组的 UI 变体，不会产生独立的释放身份。 */
  presentationVariants?: readonly SkillPresentationVariantDefinition[];
}

/** 同一技能组根据养成条件切换的展示形态，不产生新的释放身份。 */
export interface SkillPresentationVariantDefinition {
  key: string;
  condition: BuildCondition;
}

/** 干员各等级四维、基础攻击与基础生命的成长定义表。 */
export type AttributeGrowthDefinition = Record<OperatorAttribute, readonly number[]> & {
  baseAttack: readonly number[];
  baseHealth: readonly number[];
};

/** 天赋阵列节点提供的四维属性；未配置时使用全局主属性规则。 */
export interface TrustAttributeBonusDefinition {
  readonly values: readonly number[];
  readonly attributes: readonly (OperatorAttribute | 'main' | 'secondary')[];
}

export const UPGRADE_BASE_PANEL_STATS = [
  'health',
  'defense',
  'criticalRate',
  'artsIntensity',
] as const;
/**
 * 构筑确定后写入角色静态属性基础层的面板字段。
 * 这里只包含能从面板继续无损传入战斗快照的属性；按伤害类型筛选的战斗属性不属于此集合。
 */
export type UpgradeBasePanelStat = (typeof UPGRADE_BASE_PANEL_STATS)[number];

export const UPGRADE_STATIC_DAMAGE_INCREASE_TARGETS = [
  'normalAttack',
  'battleSkill',
  'physical',
  'electric',
  'cryo',
] as const;
/**
 * 潜能在构筑期确定、在每次命中按伤害语义选择的增伤属性。
 * 普攻目标由命中标签选择，因此能够覆盖重击、下落攻击和冲刺攻击，不等同于 SkillType。
 */
export type UpgradeStaticDamageIncreaseTarget =
  (typeof UPGRADE_STATIC_DAMAGE_INCREASE_TARGETS)[number];

/**
 * 天赋和潜能能够施加到编译结果的结构化修正。
 * 新种类必须有明确合并规则，不能通过任意对象补丁修改技能定义。
 */
export type UpgradeModifierDefinition =
  | {
      kind: 'addConditionalDamage';
      condition: CombatCondition;
      values: LevelValues;
    }
  | {
      kind: 'enableSkillBranch';
      skillGroupKey: string;
      branchKey: string;
    }
  | {
      kind: 'multiplyEffectDuration';
      skillGroupKey: string;
      stepKey: string;
      multiplier: number;
    }
  | {
      kind: 'multiplySkillCost';
      skillGroupKey: string;
      resource: CombatResource;
      multiplier: number;
    }
  | {
      kind: 'setEffectiveness';
      skillGroupKey: string;
      stepKey: string;
      value: number;
    }
  | {
      /** 将构筑期常驻增伤写入对应伤害属性；数值使用小数，例如 15% 写作 0.15。 */
      kind: 'addStaticDamageIncrease';
      target: UpgradeStaticDamageIncreaseTarget;
      value: number;
    }
  | {
      kind: 'addSkillStat';
      skillGroupKey: string;
      stat: 'criticalRate';
      value: number;
    }
  | {
      /**
       * 养成效果直接修补目标技能组编译后的初始动作黑板。
       * `operation` 使用与原生 SkillBBModifier 相同的 add/multiply/assign 语义；
       * `value` 按天赋/潜能等级解析，而不是按技能等级解析。
       */
      kind: 'patchSkillBlackboard';
      skillGroupKey: string;
      /** 多形态技能组只修改指定技能定义；省略时修改组内全部形态。 */
      skillKey?: string;
      blackboardKey: string;
      operation: 'add' | 'multiply' | 'assign';
      value: LevelValues;
    }
  | {
      /** 修改已启用天赋安装的隐藏被动技能黑板；目标天赋关闭时不产生被动程序。 */
      kind: 'patchPassiveBlackboard';
      passiveSkillKey: string;
      blackboardKey: string;
      operation: 'add' | 'multiply' | 'assign';
      value: LevelValues;
    }
  | { kind: 'multiplySkillDamage'; skillGroupKey: string; multiplier: number }
  | {
      kind: 'multiplyStepDamage';
      skillGroupKey: string;
      stepKey: string;
      multiplier: number;
    }
  | {
      kind: 'multiplySkillCooldown';
      skillGroupKey: string;
      branchKey?: string;
      multiplier: number;
    }
  | {
      kind: 'addSkillCooldownFrames';
      skillGroupKey: string;
      /** 多形态技能组只修改指定技能定义；省略时修改组内全部形态。 */
      skillKey?: string;
      frames: number;
      condition?: CombatCondition;
    }
  | {
      kind: 'addBuildAttribute';
      attributes: readonly OperatorAttribute[];
      value: number;
    }
  | {
      /**
       * 修改静态面板属性的基础层。`flat` 在基础倍率前加算，`percent` 以小数累加到基础倍率。
       * 该边界对应原生八槽公式的基础加算与基础倍率，但名称描述实际运算，避免泄漏原生枚举名。
       */
      kind: 'modifyBasePanelStat';
      stat: UpgradeBasePanelStat;
      operation: 'flat' | 'percent';
      value: number;
    }
  | { kind: 'addReactionDuration'; reaction: ElementalReaction; seconds: LevelValues }
  | {
      kind: 'addReactionEffectiveness';
      reaction: ElementalReaction;
      value: LevelValues;
    };
export const UPGRADE_MODIFIER_KINDS = [
  'addConditionalDamage',
  'enableSkillBranch',
  'multiplyEffectDuration',
  'multiplySkillCost',
  'setEffectiveness',
  'addSkillStat',
  'patchSkillBlackboard',
  'patchPassiveBlackboard',
  'multiplySkillDamage',
  'multiplyStepDamage',
  'multiplySkillCooldown',
  'addSkillCooldownFrames',
  'addBuildAttribute',
  'modifyBasePanelStat',
  'addStaticDamageIncrease',
  'addReactionDuration',
  'addReactionEffectiveness',
] as const satisfies readonly UpgradeModifierDefinition['kind'][];
export type UpgradeModifierKind = (typeof UPGRADE_MODIFIER_KINDS)[number];

export type UpgradeEvent =
  | { kind: 'reactionApplied'; reaction: ElementalReaction }
  | { kind: 'spGained'; source: SpGainSource; gainKind: SpGainKind }
  | { kind: 'elementalAttachmentConsumed' }
  | Extract<CombatEventTrigger, { kind: 'skillHit' }>;

export interface UpgradeEventHandlerDefinition {
  event: UpgradeEvent;
  /** 监听器实例的原生常量黑板；数组按当前养成等级解析。 */
  blackboard?: Readonly<Record<string, LevelValues>>;
  sequence: ActionSequenceDefinition;
}

/**
 * 天赋启用后随干员能力系统一起安装的常驻被动。
 * 它复用技能步骤协议，但不属于技能库，也不能被时间轴输入释放。
 */
export interface OperatorPassiveSkillDefinition {
  key: string;
  /** 被动启用序列读取的初始黑板；数组按当前天赋等级解析。 */
  blackboard?: Readonly<Record<string, LevelValues>>;
  /** 原生被动 Skill.Enable 时执行的有序行为。 */
  enableSequence: ActionSequenceDefinition;
}

export interface OperatorUpgradeDefinition {
  key: string;
  levels: number;
  modifiers?: readonly UpgradeModifierDefinition[];
  eventHandlers?: readonly UpgradeEventHandlerDefinition[];
  /** 养成启用后直接安装的初始化行为；不是技能，也不进入可释放技能集合。 */
  initializationSequence?: ActionSequenceDefinition;
  /** 仅在这个养成项启用时安装；每个被动在一场战斗中只启用一次。 */
  passiveSkills?: readonly OperatorPassiveSkillDefinition[];
}

export const OPERATOR_EVENTS = ['deckAttributesChanged'] as const;
export type OperatorEvent = (typeof OPERATOR_EVENTS)[number];

export interface OperatorEventHandlerDefinition {
  key: string;
  event: OperatorEvent;
  sequence: ActionSequenceDefinition;
}

/** 由静态构筑条件派生、在本场战斗创建技能实例前写入的原生实体黑板值。 */
export interface OperatorEntityBlackboardInitializerDefinition {
  key: `EntityBB_${string}`;
  condition: BuildCondition;
  trueValue: number;
  falseValue: number;
}

export interface OperatorDefinition {
  slug: string;
  /** 项目模板可提供独立展示名；内置定义继续使用本地化文本。 */
  displayName?: string;
  /** 项目模板继承头像、技能图标和本地化回退时使用的内置资源 slug。 */
  assetSlug?: string;
  gameId: string;
  rarity: OperatorRarity;
  weaponType: OperatorWeaponType;
  element: DamageElement;
  role: OperatorRole;
  mainAttribute: OperatorAttribute;
  secondaryAttribute: OperatorAttribute;
  attributes: AttributeGrowthDefinition;
  /** 仅记录偏离全局 `[10, 15, 15, 20]` 主属性规则的干员。 */
  trustAttributeBonus?: TrustAttributeBonusDefinition;
  skillGroups: readonly SkillGroupDefinition[];
  /** 干员级附属对象；编辑器后续可在干员层级创建和修改，技能不得复制其完整定义。 */
  buffDefinitions?: OperatorBuffDefinitions;
  /** 干员级能力实体蓝图；子技能按引用它的技能等级编译。 */
  abilityEntityDefinitions?: OperatorAbilityEntityDefinitions;
  /** 角色级首段连携入口；多段连携的后续窗口仍由技能序列中的步骤开启。 */
  comboSkillRegistrations?: readonly ComboSkillRegistrationDefinition[];
  /** 技能间共享的实体黑板初值；条件只读取已解析的静态构筑。 */
  entityBlackboardInitializers?: readonly OperatorEntityBlackboardInitializerDefinition[];
  eventHandlers?: readonly OperatorEventHandlerDefinition[];
  talents: readonly OperatorUpgradeDefinition[];
  potentials: readonly OperatorUpgradeDefinition[];
  /** 未提供时视为人工审核完成；宽松转换产物必须显式携带该字段。 */
  conversionSupport?: OperatorConversionSupport;
}
