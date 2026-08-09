/**
 * 干员数据作者与编译器之间的稳定 DSL 契约。
 * 定义应保持声明式并显式表达顺序、倍率和条件；原生证据说明应存放在独立研究文件中。
 */
export const OPERATOR_ATTRIBUTES = ['strength', 'agility', 'intellect', 'will'] as const;
/** 干员养成、面板和条件判断共同使用的四维属性身份。 */
export type OperatorAttribute = (typeof OPERATOR_ATTRIBUTES)[number];

export const OPERATOR_RARITIES = [4, 5, 6] as const;
/** 干员目录允许的星级；数据适配器不得传入目录外数值。 */
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
/** 干员目录和 UI 分类共同使用的战斗定位。 */
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
] as const;
/** 单次伤害携带的可叠加语义分类，供公式、事件和机制筛选。 */
export type DamageTag = (typeof DAMAGE_TAGS)[number];

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
    /** 仅当缺失能力可收窄到技能组时提供稳定技能组身份。 */
    readonly skillGroupKeys?: readonly string[];
  }[];
}

export const COMBAT_RESOURCES = ['sp', 'ultimateEnergy'] as const;
/** 通用技能步骤当前允许结算的共享或个人战斗资源。 */
export type CombatResource = (typeof COMBAT_RESOURCES)[number];

export const COMBAT_TARGETS = ['caster', 'enemy'] as const;
/** 干员 DSL 中无需多敌人寻址的语义目标。 */
export type CombatTarget = (typeof COMBAT_TARGETS)[number];

export const BUFF_APPLICATION_TARGETS = [...COMBAT_TARGETS, 'party'] as const;
/** Buff 施加允许面向单一战斗实体或当前队伍中的全部存活干员。 */
export type BuffApplicationTarget = (typeof BUFF_APPLICATION_TARGETS)[number];

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
  | { kind: 'skillBranchEnabled'; branchKey: string }
  | { kind: 'targetStaggered'; target: CombatTarget }
  | {
      /** 比较目标当前生命值或当前/最大生命比例。 */
      kind: 'healthCompare';
      target: CombatTarget;
      valueType: 'current' | 'ratio';
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
  | { kind: 'statusActive'; statusKey: string; target: CombatTarget; minimumStacks?: number }
  | {
      /** 按原生 Buff 标签查询累计强化层数，并使用原生容差比较。 */
      kind: 'buffStackCompare';
      target: CombatTarget;
      tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      buffTagIds: readonly number[];
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
      /** 按目录 Buff 身份查询累计强化层数；ID 列表按“任一匹配”处理。 */
      kind: 'buffIdStackCompare';
      target: CombatTarget;
      buffIds: readonly string[];
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
  'skillBranchEnabled',
  'targetStaggered',
  'healthCompare',
  'contextFlagEquals',
  'actionValueCompare',
  'statusActive',
  'buffStackCompare',
  'entityTagMatch',
  'buffIdStackCompare',
  'timedMarkerPresent',
  'elementalInflictionPresent',
  'elementalReactionActive',
  'not',
  'all',
  'any',
  'deckAttributeCompare',
] as const satisfies readonly CombatCondition['kind'][];
/** 条件构造器和严格解析器使用的可辨识种类。 */
export type CombatConditionKind = (typeof COMBAT_CONDITION_KINDS)[number];

/** 条件判断读取的动作实例值；黑板键只在当前技能实例生命周期内有效。 */
export type ActionValueOperand =
  { kind: 'blackboard'; key: string } | { kind: 'constant'; value: number };

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

export const SP_GAIN_KINDS = ['gain', 'refund'] as const;
/** 技力增加是否计入返还技力；返还部分再次被消耗时不会重复转化为终结技能量。 */
export type SpGainKind = (typeof SP_GAIN_KINDS)[number];

export const SP_GAIN_SOURCES = ['default', 'normalAttack', 'powerAttack', 'skill'] as const;
/** 原生共享 SP 获取效率用于区分普攻、重击和其他动作来源。 */
export type SpGainSource = (typeof SP_GAIN_SOURCES)[number];

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

/**
 * 所有战斗步骤与参数结构的集中映射。
 * 增加步骤时必须同时提供编译、运行时执行和严格校验，不能只扩展此类型。
 */
export interface CombatStepParameters {
  applyElementalInfliction: { element: InflictionElement; isExtra: boolean };
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
  dealDamage: DealDamageParameters;
  dealFixedDamage: DealFixedDamageParameters;
  /** 不伴随生命伤害的独立失衡单元；数值仍会经过来源与目标的失衡倍率。 */
  dealStagger: { value: LevelValues | ActionValueOperand };
  applyBuff: {
    buffId: string;
    target: BuffApplicationTarget;
    /** 原生 CreateBuffAction 的循环次数；省略时执行一次，正小数按 `int < float` 语义向上取整。 */
    count?: ActionValueOperand;
    /**
     * Buff 的来源实体；省略时沿用当前动作来源。
     * 该字段与接收 Buff 的 `target` 相互独立，只应在原生动作显式改写来源时配置。
     */
    source?: CombatTarget;
    /** 在施加时从当前技能动作黑板求值，并覆盖 Buff 定义黑板的同名默认值。 */
    blackboardAssignments?: Readonly<Record<string, ActionValueOperand>>;
    /** 原生动作要求把当前施法身份复制到新 Buff 时为 true。 */
    inheritSourceSkillCastInfo?: boolean;
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
  };
  /** 按原生标签查询结束目标身上所有匹配的 Buff。 */
  finishBuffsByTag: {
    target: CombatTarget;
    tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
    buffTagIds: readonly number[];
    reason: 'early' | 'absorbed' | 'other';
  };
  /** 按目录 Buff 身份结束目标身上的全部匹配实例。 */
  finishBuffsById: {
    target: CombatTarget;
    buffIds: readonly string[];
    reason: 'early' | 'absorbed' | 'other';
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
  /** 修改当前技能实例的动作黑板；不得用于跨技能持久状态。 */
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
    coefficient?: LevelValues;
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
  conditional: { condition: CombatCondition };
  /** 同一个技能释放实例内共享的只执行一次作用域。 */
  once: { scopeKey: string };
  setContextFlag: {
    flag: string;
    value: boolean | number | string;
    target: 'caster';
  };
}

export const COMBAT_STEP_KINDS = [
  'applyElementalInfliction',
  'applyElementalReaction',
  'consumeElementalReaction',
  'dealDamage',
  'dealFixedDamage',
  'dealStagger',
  'applyBuff',
  'readBuffBlackboard',
  'readBuffStackCount',
  'finishBuffsByTag',
  'finishBuffsById',
  'holdBuffsById',
  'createTimedMarker',
  'modifyActionValue',
  'calculateActionValue',
  'changeResource',
  'changeResourceByActionValue',
  'gainSquadUltimateEnergyFromSkillCost',
  'gainFinisherSp',
  'applyStatus',
  'consumeStatus',
  'conditional',
  'once',
  'setContextFlag',
] as const satisfies readonly (keyof CombatStepParameters)[];
/** 编译器和执行器用于收窄步骤负载的稳定种类。 */
export type CombatStepKind = (typeof COMBAT_STEP_KINDS)[number];

type CombatStepForKind<K extends CombatStepKind> = {
  /** 仅当其他目录定义需要引用此步骤时提供。 */
  key?: string;
  kind: K;
  parameters: Readonly<CombatStepParameters[K]>;
} & (K extends 'conditional'
  ? { whenTrue: ActionSequenceDefinition; whenFalse?: ActionSequenceDefinition }
  : K extends 'once'
    ? { body: ActionSequenceDefinition }
    : {});

/** 干员目录中可执行且能按 `kind` 精确收窄的一项步骤。 */
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
  | { kind: 'damageTagHit'; tag: DamageTag; scope: SkillTriggerScope }
  | {
      kind: 'elementalInflictionApplied';
      elements: DamageElement | readonly DamageElement[];
      scope: SkillTriggerScope;
    }
  | { kind: 'skillHit'; skillGroupKey: string; scope: SkillTriggerScope }
  | { kind: 'statusExpired'; statusKey: string; target: CombatTarget }
  | { kind: 'statusConsumed'; statusKey: string; target: CombatTarget };

/** 连携等窗口技能的一条开启规则及其附加战斗条件。 */
export interface SkillActivationRule {
  trigger: Extract<CombatEventTrigger, { kind: 'damageTagHit' | 'elementalInflictionApplied' }>;
  condition?: CombatCondition;
}

/** 一个技能在战斗事件发生后调度的条件化行为。 */
export interface CombatEventHandlerDefinition {
  key: string;
  event: CombatEventTrigger;
  condition?: CombatCondition;
  scheduledSequences: readonly ScheduledSequenceDefinition[];
}

/**
 * 一个可独立释放或触发的技能定义。
 * 它描述战斗身份和时序，不承载翻译后的名称或编辑器布局。
 */
export interface SkillDefinition {
  key: string;
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
  activationWindow?: {
    durationFrames: number;
    rules: SkillActivationRule | readonly SkillActivationRule[];
  };
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
  /** 同一稳定技能组的 UI 变体，不会产生独立的释放身份。 */
  presentationVariants?: readonly SkillPresentationVariantDefinition[];
}

/** 同一技能组根据养成条件切换的展示形态，不产生新的释放身份。 */
export interface SkillPresentationVariantDefinition {
  key: string;
  condition: BuildCondition;
}

/** 干员各等级四维、基础攻击与基础生命的目录成长表。 */
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
  | Extract<CombatEventTrigger, { kind: 'skillHit' }>;

export interface UpgradeEventHandlerDefinition {
  event: UpgradeEvent;
  sequence: ActionSequenceDefinition;
}

export interface OperatorUpgradeDefinition {
  key: string;
  levels: number;
  modifiers?: readonly UpgradeModifierDefinition[];
  eventHandlers?: readonly UpgradeEventHandlerDefinition[];
}

export const OPERATOR_EVENTS = ['deckAttributesChanged'] as const;
export type OperatorEvent = (typeof OPERATOR_EVENTS)[number];

export interface OperatorEventHandlerDefinition {
  key: string;
  event: OperatorEvent;
  sequence: ActionSequenceDefinition;
}

export interface OperatorDefinition {
  slug: string;
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
  eventHandlers?: readonly OperatorEventHandlerDefinition[];
  talents: readonly OperatorUpgradeDefinition[];
  potentials: readonly OperatorUpgradeDefinition[];
  /** 未提供时视为人工审核完成；宽松转换产物必须显式携带该字段。 */
  conversionSupport?: OperatorConversionSupport;
}
