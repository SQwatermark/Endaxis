import {
  type CombatResource,
  type DamageElement,
  type ElementalReaction,
  type LevelValues,
  type OperatorAttribute,
  type OperatorConversionSupport,
  type OperatorRarity,
  type OperatorRole,
  type OperatorWeaponType,
  type SkillLevelSource,
} from './primitives.ts';
import { type BuildCondition, type CombatCondition } from './conditions.ts';
import { type ActionSequenceDefinition, type CombatEventTrigger } from './actions.ts';
import {
  type ComboSkillRegistrationDefinition,
  type OperatorAbilityEntityDefinitions,
  type SkillGroupDefinition,
} from './skills.ts';
import { type OperatorBuffDefinitions } from './buffs.ts';

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

/** 未单独声明时，干员四个信赖节点依次增加的主属性。编译器和编辑器共同读取。 */
export const DEFAULT_TRUST_ATTRIBUTE_BONUS = {
  values: [10, 15, 15, 20],
  attributes: ['main'],
} as const satisfies TrustAttributeBonusDefinition;

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
      /** 组内存在隐藏替换技能时，明确限定原生修正指向的可养成技能。 */
      skillKey?: string;
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
      /** 原生 HealOutputIncrease / HealTakenIncrease 的基础加算。 */
      kind: 'addStaticHealingIncrease';
      target: 'output' | 'taken';
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
      /** 仅该养成等级区间安装此补丁；用于原生按等级切换不同标志键的结构。 */
      minimumUpgradeLevel?: number;
      maximumUpgradeLevel?: number;
      /** 原生 activeCondition；按最终构筑属性选择是否应用。 */
      condition?: BuildCondition;
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
      condition?: BuildCondition;
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
  'addStaticHealingIncrease',
  'addReactionDuration',
  'addReactionEffectiveness',
] as const satisfies readonly UpgradeModifierDefinition['kind'][];

export type UpgradeModifierKind = (typeof UPGRADE_MODIFIER_KINDS)[number];

export type UpgradeEvent =
  | { kind: 'reactionApplied'; reaction: ElementalReaction }
  | Extract<CombatEventTrigger, { kind: 'spGained' }>
  | { kind: 'elementalAttachmentConsumed' }
  /** 原生 OnConsumeBuff：只匹配由当前干员作为 finish source 消费的明确 Buff 身份。 */
  | { kind: 'buffConsumed'; buffIds: readonly string[] }
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
  /** 角色基础被动跟随其所属原生技能组；养成附加被动不设置该字段。 */
  levelSource?: SkillLevelSource;
  /** 被动启用序列读取的初始黑板；数组按所属技能或当前养成等级解析。 */
  blackboard?: Readonly<Record<string, LevelValues>>;
  /** 原生被动 Skill.Enable 时执行的有序行为。 */
  enableSequence: ActionSequenceDefinition;
}

export interface OperatorUpgradeDefinition {
  key: string;
  levels: number;
  /**
   * 原生效果已经取证，但在 Endaxis 固定模拟模型中没有可观察结果。
   * 这是完整转换结论，不是尚未建模；保留原因以便模型边界改变时重新审计。
   */
  simulationNoEffect?:
    | 'uniqueEnemyHasNoAlternateTarget'
    | 'enemyDoesNotDealDamage'
    | 'enemyDoesNotInflictSpellStatusOnOperators';
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

export const COMBO_SKILL_CONDITION_EVENTS = [
  'beforeOutputInfliction',
  'beforeTakeInfliction',
  'afterOutputInfliction',
  'afterTakeInfliction',
] as const;

/** 原生角色常驻条件；独立于技能块，也不复用附着完成后的语义连携规则。 */
export interface ComboSkillConditionDefinition {
  key: string;
  /** 绑定当前连携槽位，条件序列按该组的 levelSource 编译。 */
  skillGroupKey: string;
  event: (typeof COMBO_SKILL_CONDITION_EVENTS)[number];
  /** 模板字面初值，不是等级数组；null 为禁用，{} 为启用空板，每条注册独立复制。 */
  initialValues: Readonly<Record<string, number | string | null>> | null;
  sequence: ActionSequenceDefinition;
}

export interface OperatorDefinition {
  slug: string;
  /** 项目模板可提供独立展示名；内置定义继续使用本地化文本。 */
  displayName?: string;
  /** 项目模板继承头像、技能图标和本地化回退时使用的内置资源 slug。 */
  assetSlug?: string;
  gameId: string;
  rarity: OperatorRarity;
  /** 编辑器选择和“拉满”时使用的产品默认潜能；省略时沿用旧版星级策略。 */
  defaultPotential?: number;
  weaponType: OperatorWeaponType;
  element: DamageElement;
  role: OperatorRole;
  mainAttribute: OperatorAttribute;
  secondaryAttribute: OperatorAttribute;
  attributes: AttributeGrowthDefinition;
  /** 仅记录偏离全局 `[10, 15, 15, 20]` 主属性规则的干员。 */
  trustAttributeBonus?: TrustAttributeBonusDefinition;
  skillGroups: readonly SkillGroupDefinition[];
  /** 战斗时可被 Buff/Mode 改写的技能槽；独立于技能库分组。 */
  skillSlots?: readonly import('./skills.ts').OperatorSkillSlotDefinition[];
  /** 四类玩家语义动作的原生路由；缺失边必须诊断为 unknown。 */
  playerActionRoutes?: import('./skills.ts').OperatorPlayerActionRoutes;
  /** 旧项目技能身份到当前规范身份的只读兼容映射；不得作为技能库中的额外入口展示。 */
  skillAliases?: readonly {
    readonly from: readonly [skillGroupKey: string, skillKey: string];
    readonly to: readonly [skillGroupKey: string, skillKey: string];
  }[];
  /** 干员级附属对象；编辑器后续可在干员层级创建和修改，技能不得复制其完整定义。 */
  buffDefinitions?: OperatorBuffDefinitions;
  /** 干员级能力实体蓝图；子技能按引用它的技能等级编译。 */
  abilityEntityDefinitions?: OperatorAbilityEntityDefinitions;
  /** 角色级首段连携入口；多段连携的后续窗口仍由技能序列中的步骤开启。 */
  comboSkillRegistrations?: readonly ComboSkillRegistrationDefinition[];
  /** 四类已取证附着事件的原生条件；与旧 semantic 连携入口明确分开。 */
  comboSkillConditions?: readonly ComboSkillConditionDefinition[];
  /** 角色模板的字面实体初值；不是技能初值，动态值也不随每次技能施放重置。 */
  entityBlackboard?: Readonly<Record<string, number | string>>;
  /** 技能间共享的实体黑板初值；条件只读取已解析的静态构筑。 */
  entityBlackboardInitializers?: readonly OperatorEntityBlackboardInitializerDefinition[];
  /** 角色自身始终安装的隐藏基础被动；与受构筑开关控制的天赋/潜能被动分开。 */
  passiveSkills?: readonly OperatorPassiveSkillDefinition[];
  eventHandlers?: readonly OperatorEventHandlerDefinition[];
  talents: readonly OperatorUpgradeDefinition[];
  potentials: readonly OperatorUpgradeDefinition[];
  /** 未提供时视为人工审核完成；宽松转换产物必须显式携带该字段。 */
  conversionSupport?: OperatorConversionSupport;
}
