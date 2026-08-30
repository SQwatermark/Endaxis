import { type ActionSequenceDefinition, type ScheduledSequenceDefinition } from './actions.ts';
import {
  type ActionBlackboardValue,
  type DamageFeature,
  type DamageTag,
  type DamageType,
  type InflictionElement,
} from './primitives.ts';
import {
  type AttributeModifierSlot,
  type DamageModifierCondition,
  type DamageModifierDefinition,
  type DamageModifierNumber,
  type DamageProcessorDefinition,
  type HealModifierDefinition,
  type PoiseModifierDefinition,
} from './modifiers.ts';
import { type ActionValueOperand } from './conditions.ts';

/**
 * `applyBuff` 步骤内联的 Buff 蓝图，不重复保存步骤已经携带的 `buffId`。
 * 施加次数、目标和本次传入的黑板值属于施加行为，不属于这份定义。
 */
export type SkillBuffPresentation = CombatBuffPresentation;

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
    | 'beforeCalculateDamage'
    | 'beforeDamageAction'
    | 'beforeTakePhysicalInfliction'
    | 'beforeOutputPhysicalInfliction'
    | 'afterOutputPhysicalInfliction'
    | 'beforeOutputKnockDown'
    | 'afterOutputKnockDown'
    | 'beforeOutputInfliction'
    | 'beforeOutputSpellBurst'
    | 'beforeTakeSpellInfliction'
    | 'beforeTakeInfliction'
    | 'takeDamage'
    | 'takeCriticalDamage'
    | 'outputDamage'
    | 'outputCriticalDamage'
    | 'outputKnockDown'
    | 'outputHeal'
    | 'receiveHeal'
    | 'poiseZero'
    | 'beforeCastSkill'
    | 'afterSkillApplyCost'
    | 'skillEnd'
    | 'beforeOutputBuff'
    | 'beforeAddedBuff'
    | 'outputBuff'
    | 'addedBuff'
    | 'finishedBuff'
    /** 原生 OnBuffEndsEarly：只在 Ignite/Early 的提前结束消费路径广播。 */
    | 'buffEndsEarly'
    | 'afterOutputWeaknessTriggered'
    | 'customAbilityEvent'
    | 'afterKillEntity'
    | 'buffConsumed'
    /** OnObtainAtb + CheckObtainAtbType(Skill, Gain) 的编译后语义事件。 */
    | 'skillSpGained';
  /** 原生数据动作优先级；同一事件同优先级的顺序未证明时运行时会拒绝注册。 */
  priority: number;
  /** 已证明同优先级、同 key 的实例响应可交换时允许并列注册。 */
  samePriorityKey?: string;
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

export type SkillBuffDefinition = BuffDefinitionProperties & {
  /** 可在施加时从该 Buff 已合并的实例黑板解析。 */
  maxStackCount?: BuffMaxStackCount;
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
 * 一项 GlobalBuff 在固定队伍中的子 Buff 投影。赋值从已经完成创建参数覆盖的
 * GlobalBuff 实例黑板读取，不能直接回读创建动作的黑板。
 */
export interface SkillGlobalBuffChildDefinition {
  readonly buffId: string;
  readonly blackboardAssignments: Readonly<Record<string, ActionValueOperand>>;
}

/**
 * 战斗级 GlobalBuff 蓝图。它拥有独立实例、寿命和叠加组；子 Buff 只是该实例
 * 投影到每名队员身上的端口，不能把父层拍平成普通 Buff 叠层。
 */
export interface SkillGlobalBuffDefinition {
  readonly stackingType: 'unlimited' | 'stack';
  readonly maxStackCount?: number;
  readonly durationSeconds?: BuffDuration;
  /** 原生父 GlobalBuff 的时长同时作为子 Buff 图标时长；不改变子 Buff 的战斗寿命归属。 */
  readonly applyIconDurationToBuffs?: boolean;
  readonly blackboard: Readonly<Record<string, ActionBlackboardValue>>;
  readonly children: readonly SkillGlobalBuffChildDefinition[];
}

export const BUFF_STACKING_TYPES = [
  'unlimited',
  'highPriority',
  'stack',
  'enhance',
  'refresh',
  'extend',
  'modify',
  'unique',
  'enhanceAndRefresh',
  'overwriteDuration',
  'enhanceAndOverwriteDuration',
  'highPriorityWithMaxStack',
] as const;

/** 同身份 Buff 再次添加时采用的原生叠加策略。 */
export type BuffStackingType = (typeof BUFF_STACKING_TYPES)[number];

/** 固定秒数或由实例黑板提供的 Buff 持续时间。 */
export type BuffDuration = number | { readonly blackboardKey: string };

/** 固定值或由实例黑板提供的 Buff 可触发次数。 */
export type BuffTriggerCount = number | { readonly blackboardKey: string };

/** 固定最大层数，或从首次施加实例的黑板读取的动态最大层数。 */
export type BuffMaxStackCount = number | { readonly blackboardKey: string };

/** 固定优先级，或从实例黑板读取并按原生配置选择取反的动态优先级。 */
export type BuffPriority = number | { readonly blackboardKey: string; readonly negate?: boolean };

export type BuffShieldPriority = 'normal' | 'prioritizeConsume';

export interface BuffShieldDamageAbsorptionDefinition {
  readonly damageType: DamageType;
  readonly ratio: BuffDuration;
  readonly scale: BuffDuration;
}

export interface BuffShieldDefinition {
  readonly infinityValue: boolean;
  readonly value:
    | BuffDuration
    | {
        readonly attributeSource?: 'buffOwner' | 'buffSource';
        readonly attribute: string;
        readonly multiplier: BuffDuration;
        readonly addition: BuffDuration;
      };
  readonly damageAbsorptions: readonly BuffShieldDamageAbsorptionDefinition[];
  readonly absorbCount: BuffTriggerCount;
  readonly absorbAllDamageWhenConsumed: boolean;
  readonly removeBuffWhenConsumed: boolean;
  readonly priority: BuffShieldPriority;
  /** 只保留原生表现选择位；后端不解释 EffectActionCfg。 */
  readonly replaceHitEffect: boolean;
}

export interface BuffSustainedProtectionDefinition {
  readonly target: 'owner' | 'buffSource';
  readonly superArmor: BuffDuration;
  readonly impactResistance: BuffDuration;
}

/** Buff 生命周期可选择的原生时间域；缺省使用 TimeManager 默认时钟。 */
export type BuffTimeClock = 'default' | 'global' | 'self';

/** Buff 实例的用户可观察显示身份；不参与数值计算，但必须随定义进入运行时。 */
export interface CombatBuffPresentation {
  readonly iconId?: string;
  readonly iconPath?: string;
  readonly visible?: boolean;
  readonly showInHeadBarCommon?: boolean;
  readonly showInHeadBarAttached?: boolean;
  readonly showInSquadIcon?: boolean;
  readonly onlyShowForMainCharacter?: boolean;
  readonly iconStyleInSquad?: string;
  readonly abnormalColorType?: string;
  readonly orderPriority?: {
    readonly useDirectoryValue: boolean;
    readonly value: number;
    readonly category: string;
  };
}

export interface CombatBuffChildPresentation {
  readonly buffId: string;
  readonly presentation: CombatBuffPresentation;
}

/** 原生 KeywordEnhance：由普通 Buff 的加入边沿持久改写关键词 rate。 */
export interface BuffKeywordEnhancementDefinition {
  readonly triggerBuffIds: readonly string[];
  readonly operation: 'assign' | 'add' | 'multiply';
  readonly targetKey: string;
  readonly initialValue: BuffDuration;
  readonly value: BuffDuration;
}

export const COMBAT_BUFF_DEFINITIONS_SCHEMA_VERSION = 1 as const;

/** 核心能够理解并交给专用适配器处理的 Buff 语义角色。 */
export type CombatBuffSemanticRole =
  | { readonly kind: 'elementalAttachment'; readonly element: InflictionElement }
  | { readonly kind: 'elementalBurst'; readonly element: InflictionElement }
  | {
      readonly kind: 'compoundStatus';
      readonly consumedElement: InflictionElement;
      readonly incomingElement: InflictionElement;
    };

/** 定义动作可从常量或当前 Buff 黑板读取的数值。 */
export type CombatBuffDefinitionNumberOperand = number | { readonly blackboardKey: string };

/** StoreAttributeValue 在来源实体上选择属性的方式。 */
export type CombatBuffDefinitionAttributeSelector =
  | { readonly kind: 'specific'; readonly key: string }
  | { readonly kind: 'main' | 'secondary' | 'all' };

/** StoreAttributeValue 读取的原生属性聚合阶段，二者都必须排除 Converted 来源。 */
export type CombatBuffDefinitionAttributeStage = 'armedNonConverted' | 'finalNonConverted';

/** 外部 Buff 定义当前允许表达的生命周期动作。 */
export type CombatBuffDefinitionAction =
  | { readonly kind: 'emitElementalInflictionStarted' }
  | { readonly kind: 'refreshAttributeModifierValues' }
  | {
      readonly kind: 'storeAttributeValue';
      readonly target: 'source';
      readonly attribute: CombatBuffDefinitionAttributeSelector;
      readonly stage: CombatBuffDefinitionAttributeStage;
      readonly useFloor: boolean;
      readonly divisor: CombatBuffDefinitionNumberOperand;
      readonly multiplier: CombatBuffDefinitionNumberOperand;
      readonly base: CombatBuffDefinitionNumberOperand;
      readonly targetKey: string;
    }
  | {
      readonly kind: 'modifyBlackboard';
      readonly operation: 'assign' | 'add';
      readonly targetKey: string;
      readonly value: number | { readonly blackboardKey: string };
    }
  | {
      /**
       * 对一段已由原生 CompareFloat/IfElse/Assign 证明等价的数值链做边界投影。
       * 这不是把未知分支猜成 clamp；调用方必须保存原始动作顺序的证据。
       */
      readonly kind: 'clampBlackboard';
      readonly targetKey: string;
      readonly minimum?: CombatBuffDefinitionNumberOperand;
      readonly maximum?: CombatBuffDefinitionNumberOperand;
    }
  | {
      /** 触发法术爆发；伤害由运行时按定义中的 `spellBurst` 参数执行。 */
      readonly kind: 'triggerSpellBurst';
      readonly burstType: string;
    }
  | {
      /** Buff 生命周期中的原生 DamageAction；倍率读取当前 Buff 黑板并走标准玩家伤害。 */
      readonly kind: 'dealAttackScaledDamage';
      readonly damageType: DamageType;
      readonly attackScale: CombatBuffDefinitionNumberOperand;
      readonly tags: readonly DamageTag[];
      readonly features: readonly DamageFeature[];
      readonly canCritical: boolean;
    }
  | {
      /** 已确认对数值无影响的纯表现动作（动画/特效/声音/镜头等），`actionType` 记录原生类型名。 */
      readonly kind: 'visualOnly';
      readonly actionType: string;
    }
  | {
      /** 已恢复真实语义，但在 Endaxis 固定木桩模型中严格不可触发的动作。 */
      readonly kind: 'simulationNoEffect';
      readonly reason: 'enemyWeaknessWindowRequiresEnemyActiveBehavior';
      readonly nativeActionType: string;
    };

/** 法术爆发的伤害参数；从原生 `DamageAction` 与 `ReadSkillSettingData` 提取。 */
export interface CombatBuffSpellBurstDefinition {
  readonly burstType: string;
  /** 爆发伤害的元素类型（原生 damageType 归一化后的语义枚举）。 */
  readonly damageType: DamageType;
  /** 爆发倍率在 SkillSetting 中的 dataKey。 */
  readonly skillSettingDataKey: string;
  /** SkillSetting 列号（原生 1 基；运行时按列号减一取数组下标）。 */
  readonly skillSettingColumn: number;
  /** 原生 DamageAction 的基础倍率；被 SkillSetting 倍率覆盖，仅作证据保留。 */
  readonly atkScaleBase: number;
}

/** Buff 定义 在各生命周期边界执行的动作集合。 */
export interface CombatBuffDefinitionLifecycleActions {
  readonly start?: readonly CombatBuffDefinitionAction[];
  readonly trigger?: readonly CombatBuffDefinitionAction[];
  readonly enhanceChanged?: readonly CombatBuffDefinitionAction[];
  readonly afterEnhance?: readonly CombatBuffDefinitionAction[];
  readonly finish?: readonly CombatBuffDefinitionAction[];
}

/** 外部定义中一项可序列化的原生八槽属性修正。 */
export interface CombatBuffDefinitionAttributeModifier {
  readonly attribute: string;
  readonly slot: AttributeModifierSlot;
  readonly value: number | { readonly blackboardKey: string };
  readonly target?: 'owner' | 'buffSource';
  /** 原生 isConvertedAttribute=true 时保留 converted 来源身份。 */
  readonly source?: 'converted';
}

/** 外部和内联 Buff 定义中可序列化的伤害处理器。 */
export type CombatBuffDefinitionDamageProcessor =
  | {
      readonly kind: 'damageScale';
      readonly side: Extract<DamageProcessorDefinition, { readonly kind: 'damageScale' }>['side'];
      readonly zone: Extract<DamageProcessorDefinition, { readonly kind: 'damageScale' }>['zone'];
      readonly addition: DamageModifierNumber;
    }
  | {
      readonly kind: 'instantAttribute';
      readonly targetSide: Extract<
        DamageProcessorDefinition,
        { readonly kind: 'instantAttribute' }
      >['targetSide'];
      readonly attribute: string;
      readonly values: Extract<
        DamageProcessorDefinition,
        { readonly kind: 'instantAttribute' }
      >['values'];
      readonly attributeTiming: 'runtime';
    };

/** Buff 激活期间向伤害生命周期注册的一项纯数据修正。 */
export interface CombatBuffDefinitionDamageModifier {
  readonly enabledSide: DamageModifierDefinition['enabledSide'];
  readonly condition?: DamageModifierCondition;
  readonly processors: readonly CombatBuffDefinitionDamageProcessor[];
}

/** 兼容外部 Buff 文档的纯数据条目；编译后的回调不属于此协议。 */
export interface CombatBuffDefinitionEntry extends BuffDefinitionProperties {
  readonly id: string;
  readonly maxStackCount?: number;
  readonly actions?: CombatBuffDefinitionLifecycleActions;
}

/** 带 schema 版本的外部 Buff 定义文档。 */
export interface CombatBuffDefinitionsDocument {
  readonly schemaVersion: typeof COMBAT_BUFF_DEFINITIONS_SCHEMA_VERSION;
  readonly revision: string;
  readonly buffs: readonly CombatBuffDefinitionEntry[];
}

/**
 * 游戏数据提取边界输出的稳定纯数据表示。
 * 原生表结构和可执行回调不得跨越此边界。
 */
/** 外部定义中的一项稳定 Buff 定义。 */
export type BuffDefinitionProperties = {
  /** Buff 的用户可观察图标身份和显示规则；不参与数值计算但不得在编译边界丢失。 */
  readonly presentation?: CombatBuffPresentation;
  readonly childPresentations?: readonly CombatBuffChildPresentation[];
  /** 缺省为 default；仅在解包配置明确使用全局或实体时间时填写。 */
  readonly timeClock?: BuffTimeClock;
  /** 解包数据中的原始有符号 int32 applyTags。 */
  readonly applyTags?: readonly GameplayTag[];
  /** Buff 被延长动作阻止结束后，临时注册到所属实体的原始标签。 */
  readonly extendTags?: readonly GameplayTag[];
  readonly stackingType: BuffStackingType;
  readonly stackingKey?: string;
  readonly priority?: BuffPriority;
  readonly durationSeconds?: BuffDuration;
  readonly triggerIntervalSeconds?: BuffDuration;
  readonly waitFirstTriggerInterval?: boolean;
  readonly maxTriggerCount?: BuffTriggerCount;
  readonly blackboard?: Readonly<Record<string, ActionBlackboardValue>>;
  readonly attributeModifiers?: readonly CombatBuffDefinitionAttributeModifier[];
  readonly damageModifiers?: readonly CombatBuffDefinitionDamageModifier[];
  readonly keywordEnhancements?: readonly BuffKeywordEnhancementDefinition[];
  readonly healModifiers?: readonly HealModifierDefinition[];
  readonly poiseModifiers?: readonly PoiseModifierDefinition[];
  readonly shields?: readonly BuffShieldDefinition[];
  readonly sustainedProtection?: BuffSustainedProtectionDefinition;
  readonly role?: CombatBuffSemanticRole;
  /** 元素爆发 Buff 的伤害参数；非爆发条目省略。 */
  readonly spellBurst?: CombatBuffSpellBurstDefinition;
};
import type { GameplayTag } from './gameplayTags.ts';
