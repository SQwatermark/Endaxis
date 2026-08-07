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

export const COMBAT_RESOURCES = ['sp', 'ultimateEnergy'] as const;
/** 通用技能步骤当前允许结算的共享或个人战斗资源。 */
export type CombatResource = (typeof COMBAT_RESOURCES)[number];

export const COMBAT_TARGETS = ['caster', 'enemy'] as const;
/** 干员 DSL 中无需多敌人寻址的语义目标。 */
export type CombatTarget = (typeof COMBAT_TARGETS)[number];

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
  /** 单次命中的攻击倍率，使用小数表示。 */
  attackScale: LevelValues;
  tags: readonly DamageTag[];
  /** 同一次命中在生命伤害之后结算的失衡伤害。 */
  stagger?: LevelValues;
  /** 每层语义化战斗状态提供的额外攻击倍率。 */
  attackScalePerStatusStack?: {
    statusKey: string;
    target: CombatTarget;
    coefficient: LevelValues;
  };
}

/**
 * 技能可用性、条件步骤和事件响应共享的条件树。
 * 新条件必须能由运行时统一求值，不能在干员文件中嵌入函数。
 */
export type CombatCondition =
  | { kind: 'skillBranchEnabled'; branchKey: string }
  | { kind: 'targetStaggered'; target: CombatTarget }
  | { kind: 'contextFlagEquals'; flag: string; value: boolean | number | string }
  | { kind: 'statusActive'; statusKey: string; target: CombatTarget; minimumStacks?: number }
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
  'skillBranchEnabled',
  'targetStaggered',
  'contextFlagEquals',
  'statusActive',
  'elementalInflictionPresent',
  'elementalReactionActive',
  'not',
  'all',
  'any',
  'deckAttributeCompare',
] as const satisfies readonly CombatCondition['kind'][];
/** 条件构造器和严格解析器使用的可辨识种类。 */
export type CombatConditionKind = (typeof COMBAT_CONDITION_KINDS)[number];

/** 只依赖养成面板、可在战斗开始前决定的条件子集。 */
export type BuildCondition = Extract<CombatCondition, { kind: 'deckAttributeCompare' }>;

export const RESOURCE_RECIPIENTS = ['caster', 'team'] as const;
/** 资源变化步骤当前允许作用的施法者或全队范围。 */
export type ResourceRecipient = (typeof RESOURCE_RECIPIENTS)[number];

export const SP_GAIN_KINDS = ['gain', 'refund'] as const;
/** 技力增加是否计入返还技力；返还部分再次被消耗时不会重复转化为终结技能量。 */
export type SpGainKind = (typeof SP_GAIN_KINDS)[number];

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
  applyBuff: {
    buffId: string;
    target: CombatTarget;
    durationSeconds?: number;
    effectiveness?: number;
  };
  changeResource: {
    resource: CombatResource;
    amount: LevelValues;
    recipient: ResourceRecipient;
    /** 仅对正向技力变化有效；省略时按普通获得处理。 */
    spGainKind?: SpGainKind;
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
  'applyBuff',
  'changeResource',
  'gainSquadUltimateEnergyFromSkillCost',
  'gainFinisherSp',
  'applyStatus',
  'consumeStatus',
  'conditional',
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
  endFrame: number;
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
  /** 时间轴技能块的显示宽度；由可操作边界推导，不对应原生 `durationFrame`。 */
  timelineBlockFrames: number;
  /** 用户尝试释放技能时检查的条件。 */
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
  | { kind: 'addPanelStat'; stat: 'artsIntensity'; value: number }
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
  'addPanelStat',
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
  skillGroups: readonly SkillGroupDefinition[];
  eventHandlers?: readonly OperatorEventHandlerDefinition[];
  talents: readonly OperatorUpgradeDefinition[];
  potentials: readonly OperatorUpgradeDefinition[];
}
