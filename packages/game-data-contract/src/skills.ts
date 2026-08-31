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
  | { readonly kind: 'current' }
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

/** 能力实体模板数值；原生可在生成时用实体黑板覆盖模板默认值。 */
export type AbilityEntityDefinitionNumber =
  number | { readonly blackboardKey: string; readonly fallback: number };

/** 可由干员级定义表复用的完整逻辑能力实体蓝图。 */
export interface AbilityEntityDefinition {
  readonly lifetime:
    | {
        readonly kind: 'limited';
        readonly durationSeconds: AbilityEntityDefinitionNumber;
      }
    | { readonly kind: 'infinite' };
  /** 实体死亡后仍留在 owner children / finder 目录中的控制器回收延迟。 */
  readonly deathReleaseDelaySeconds?: number;
  /** 正数时，同模板新实例会按原生 Group.Add 语义同步释放最早实例。 */
  readonly maxStackingCount?: AbilityEntityDefinitionNumber;
  readonly childSkill?: AbilityEntityChildSkillDefinition;
  /** 同一原生实体模板可由不同 Spawn 动作绑定不同子技能；键为原生技能 ID。 */
  readonly childSkills?: Readonly<Record<string, AbilityEntityChildSkillDefinition>>;
}

/** 干员级能力实体蓝图；技能只引用身份并提供本次生成参数。 */
export type OperatorAbilityEntityDefinitions = Readonly<Record<string, AbilityEntityDefinition>>;

/** 技能的一项等级化资源费用；实际扣除时机由技能 `costFrame` 决定。 */
export interface SkillCostDefinition {
  resource: CombatResource;
  value: LevelValues;
}

/** Endaxis 可编辑的四种玩家战斗操作语义；键鼠/手柄绑定不进入战斗数据。 */
export type PlayerSkillInput = 'basicAttack' | 'battleSkill' | 'comboSkill' | 'ultimate';

/**
 * 原生 AbilitySystem 中可被 ChangeSkillAction 改写的稳定技能槽。
 * 槽位属于战斗路由，不是技能库分组；编辑器可以恰好用同名 key，但二者没有运行时依赖。
 */
export interface OperatorSkillSlotDefinition {
  readonly key: string;
  readonly baseSkillKey: string;
  /** 未发生槽位替换时仍可由同一语义动作明确请求的技能。 */
  readonly stableSkillKeys?: readonly string[];
  readonly replacementSkillKeys: readonly string[];
}

export type PlayerActionRouteDefinition =
  | {
      readonly kind: 'skillSlot';
      readonly skillSlotKey: string;
    }
  | {
      readonly kind: 'basicAttack';
      /** 原生 normalAttackList、处决和下落等路径能够请求的技能全集。 */
      readonly skillKeys: readonly string[];
      /** 只有 SkillDataBundle/default mode 的命令映射已导入时才允许设置。 */
      readonly defaultSkillKey?: string;
    };

/** 四类语义动作到原生技能请求来源的显式边；不得从技能库分组反推。 */
export type OperatorPlayerActionRoutes = Readonly<
  Partial<Record<PlayerSkillInput, PlayerActionRouteDefinition>>
>;

/**
 * 原生 ComboCacheAction 在一段技能局部时间内对攻击操作的映射覆盖。
 * Skill 命令中的战技/连携会把映射中的 skillId 覆盖为当前槽位技能，
 * 终结技不读该映射，因此它们不能作为“选择哪个技能”的证据。
 */
export interface SkillInputCommandMappingWindow {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly input: 'basicAttack';
  /** 空值是原生的“该窗口没有直接技能路由”，不得回退为基础技能。 */
  readonly targetSourceSkillId: string | null;
}

/** 原生 AllowNextSkillAction 只授予提前接续许可，不负责选择技能。 */
export interface SkillAllowedNextWindow {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly sourceSkillIds: readonly string[];
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
  /**
   * 此技能执行体参与战斗事件与中断优先级判断时使用的分类。
   * 它属于单个技能，不能从编辑器技能库分组反推。当前枚举是 Endaxis 已支持的战斗分类；
   * 原生可变 SkillType 后续由运行时状态覆盖此初值。
   */
  skillType?: SkillType;
  /** 从原生 CharGrowthTable 技能组成员关系得到的等级来源；不属于编辑器分组。 */
  levelSource?: SkillLevelSource;
  /** 原始游戏数据中的技能身份；事件守卫不得用编辑器 key 冒充它。 */
  sourceSkillId?: string;
  /**
   * 该次释放所创建的强化状态 Buff 身份。时间轴只按实际 Buff 回执投影生命周期；
   * 省略表示没有已取证的强化状态，不能把任意自身 Buff 猜成强化条。
   */
  enhancementStateBuffId?: string;
  /** 技能实例创建时按当前技能等级解析、每次释放前恢复的原生动作黑板。 */
  blackboard?: Readonly<Record<string, LevelValues>>;
  /** 零距离木桩下 StoreSmartTarget 的归约结果；省略表示原技能不执行智能目标存储。 */
  smartTarget?: 'enemy' | 'input' | 'trigger';
  /** 时间轴技能块的显示宽度；由可操作边界推导，不对应原生 `durationFrame`。 */
  timelineBlockFrames: number;
  /** 原生 SkillData.exclusiveFrame；只在需要读取当前技能可中断状态时参与运行时判断。 */
  exclusiveFrame?: number;
  /**
   * 从原生顶层直连输入 Action 保留的操作解析证据。两类窗口职责不同：
   * commandMappings 选择该操作当前指向的技能，allowedNextSkills 只决定能否提前中断。
   */
  inputWindows?: {
    readonly commandMappings?: readonly SkillInputCommandMappingWindow[];
    readonly allowedNextSkills?: readonly SkillAllowedNextWindow[];
    /** 存在条件或嵌套输入 Action；当前输入状态不足时必须返回未知而不是猜测。 */
    readonly hasConditionalActions?: boolean;
  };
  /**
   * 技能释放条件只生成合法性诊断；不成立也不会阻止技能进入模拟。
   * 模拟层将用户排入时间轴的动作视为已经成功释放，不得改写或跳过。
   */
  availability?: CombatCondition;
  cooldownFrames?: LevelValues;
  costs?: readonly SkillCostDefinition[];
  /** 原生 `CastData.startCdFrame`；配置消耗时编译器要求此字段存在。 */
  costFrame?: number;
  /**
   * 原生 SwitchToAddBuff 的施放前旁路；命中时不启动或中断普通技能时间轴。
   * `currentSkillTypes` 表达依赖上一技能身份的结束技路径；`condition` 表达候选技能自身的
   * 普通条件路径。两者同时存在时均须成立。`asSkillCast` 保留原生是否发布完整施法事件。
   */
  switchToBuffCast?: {
    readonly currentSkillTypes?: readonly SkillType[];
    readonly requiresCurrentSkillNotInterruptible?: boolean;
    readonly condition?: import('./conditions.ts').CombatCondition;
    readonly asSkillCast?: boolean;
    readonly sequence: import('./actions.ts').ActionSequenceDefinition;
  };
  scheduledSequences: readonly ScheduledSequenceDefinition[];
  eventHandlers?: readonly CombatEventHandlerDefinition[];
}

/**
 * 编辑器技能库中的稳定放置单元。
 * `skills` 为数组时表示一次放置所包含的有序技能链，而不是 UI 变体。
 */
export interface SkillGroupDefinition {
  key: string;
  /** @deprecated 迁移期展示元数据；模拟不得读取，最终由卡片展示语义替代。 */
  skillType: SkillType;
  /** @deprecated 迁移期展示元数据；等级必须读取 SkillDefinition.levelSource。 */
  levelSource: SkillLevelSource;
  /** 单个可放置技能，或作为一个技能库条目放置的有序技能链。 */
  skills: SkillDefinition | readonly SkillDefinition[];
  /** 基础放置项在技能库中的语义强调；省略表示普通操作。 */
  libraryPresentation?: 'enhanced';
  /**
   * 运行时虽以换槽形态注册、但编辑器放置时具有明确先后关系的完整技能键序列。
   * 省略表示 replacement 是状态强化形态，应作为独立卡片；不得由 UI 按名称猜测。
   */
  placementSequenceSkillKeys?: readonly string[];
  /**
   * 同一稳定输入类型下的具名形态链。形态不是新的技能类型；它可以使用不同的养成等级来源，
   * 例如终结技状态下的强化普攻仍属于普攻，但倍率取终结技等级。
   */
  variants?: readonly SkillGroupVariantDefinition[];
  /**
   * 与 `skills` 共用一个稳定放置身份、仅由运行时换槽动作选中的技能形态。
   * 编辑器必须把它们作为可显式放置的具体技能展示；运行时槽位状态只负责校验该操作
   * 当前是否确实会解析到该技能，不能静默把基础块替换为这里的执行体。
   */
  replacementSkills?: readonly SkillDefinition[];
  /**
   * 每个运行时替换技能在技能库中的显式放置语义。运行时替换关系本身不能推出展示语义：
   * `standard` 是普通独立操作，`enhanced` 是强化形态，`internal` 不接受玩家输入。
   * 有序接续技能由 `placementSequenceSkillKeys` 表达，不重复出现在这里。
   */
  replacementSkillPlacements?: Readonly<Record<string, 'standard' | 'enhanced' | 'internal'>>;
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
  /** 具名形态在技能库中的语义强调；不能从 variant 结构或 key 名称推断。 */
  libraryPresentation?: 'enhanced';
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
