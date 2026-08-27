import {
  type CombatResource,
  type LevelValues,
  type SkillLevelSource,
  type SkillType,
} from './primitives.ts';
import {
  type CombatEventHandlerDefinition,
  type CombatEventTrigger,
  type ScheduledSequenceDefinition,
} from './actions.ts';
import { type BuildCondition, type CombatCondition } from './conditions.ts';

/** 生成期已从原生 born-tag 证据解析出的可执行能力实体查询。 */
export type AbilityEntityTargetQuery =
  | {
      readonly kind: 'ownerSpawned';
      readonly abilityEntityIds?: readonly string[];
    }
  | { readonly kind: 'context'; readonly contextKey: string };

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

/** 技能的一项等级化资源费用；实际扣除时机由技能 `costFrame` 决定。 */
export interface SkillCostDefinition {
  resource: CombatResource;
  value: LevelValues;
}

/** 事件触发器筛选干员自身或全队来源的范围。 */
export type SkillTriggerScope = 'operator' | 'team';

/** 角色级连携入口的一条事件规则；条件成立后进入 pending 或立即尝试释放。 */
export interface ComboSkillTriggerRule {
  trigger: Extract<
    CombatEventTrigger,
    { kind: 'damageTagHit' | 'elementalInflictionApplied' | 'physicalInflictionApplied' }
  >;
  condition?: CombatCondition;
  /** 原生条件命中时随候选复制的事件分支参数；覆盖角色级连携默认黑板。 */
  blackboard?: Readonly<Record<string, LevelValues>>;
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
  /**
   * 时间轴强制释放但没有合法窗口时使用的模拟哨兵值。只允许让事件依赖分支不执行；
   * `ComboWindowUnavailableAtStart` 诊断仍保留，不能把它当成原生默认输入。
   */
  invalidCastBlackboard?: Readonly<Record<string, LevelValues>>;
  rules: readonly ComboSkillTriggerRule[];
}

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
  /** 零距离木桩下 SelectSmartObject 的两条连携策略；省略表示不执行 StoreSmartTarget。 */
  comboSmartTarget?: 'input' | 'trigger';
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
   * 同一稳定输入类型下的具名形态链。形态不是新的技能类型；它可以使用不同的养成等级来源，
   * 例如终结技状态下的强化普攻仍属于普攻，但倍率取终结技等级。
   */
  variants?: readonly SkillGroupVariantDefinition[];
  /**
   * 与 `skills` 共用一个稳定放置身份、仅由运行时换槽动作选中的技能形态。
   * 它们不会被技能库展开为额外技能块，也不能由项目存档直接指定。
   */
  replacementSkills?: readonly SkillDefinition[];
  /**
   * 跨原生技能组的换槽形态。技能仍占用本组的稳定槽位，但执行时使用其原生分类与等级源。
   * 仅用于原生输入旁路（例如战技包装器实际 Cast 连携技）；普通同组换槽继续使用 replacementSkills。
   */
  routedReplacementSkills?: readonly RoutedSkillReplacementDefinition[];
  /** 同一稳定技能组的 UI 变体，不会产生独立的释放身份。 */
  presentationVariants?: readonly SkillPresentationVariantDefinition[];
}

export interface SkillGroupVariantDefinition {
  key: string;
  levelSource: SkillLevelSource;
  skills: SkillDefinition | readonly SkillDefinition[];
}

export interface RoutedSkillReplacementDefinition {
  /** 已合并输入包装器资源规则、且拥有独立稳定 key 的执行定义。 */
  skill: SkillDefinition;
  /** 真正被 Cast 的原生技能分类，而不是所在槽位的分类。 */
  skillType: SkillType;
  /** 真正被 Cast 的原生技能等级来源。 */
  levelSource: SkillLevelSource;
  /** 执行体在原生养成定义中的技能组身份。 */
  executionSkillGroupKey: string;
  /** 执行体在原生养成定义中的稳定技能身份。 */
  executionSkillKey: string;
}

/** 同一技能组根据养成条件切换的展示形态，不产生新的释放身份。 */
export interface SkillPresentationVariantDefinition {
  key: string;
  condition: BuildCondition;
}
