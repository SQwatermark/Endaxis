import type { GameplayTag, GameplayTagQueryType } from './gameplayTags.ts';
import {
  type BuffSingleTarget,
  type CombatTarget,
  type ComparisonOperator,
  type DamageElement,
  type DamageFeature,
  type DamageTag,
  type DamageType,
  type ElementalReaction,
  type EnemyRank,
  type HealTarget,
  type InflictionElement,
  type OperatorAttribute,
  type SkillType,
  type SpGainKind,
  type SpGainSource,
  type TimedMarkerTarget,
} from './primitives.ts';

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
  | { kind: 'enemyRankIn'; ranks: readonly EnemyRank[] }
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
      /** 原生 CheckEntityNum.storeKey：判断时同步保存实际数量。 */
      outputKey?: string;
    }
  | {
      /** 原生 CheckObjectTypeMatch：命名组中任一对象的类型被 mask 完整包含。 */
      kind: 'contextTargetObjectTypeMatch';
      contextKey: string;
      objectTypeMask: number;
    }
  | {
      /** CheckBuffStackNumByTag 的首目标增强层数；空组直接 false，不读取阈值。 */
      kind: 'contextTargetBuffStackCompare';
      contextKey: string;
      tagQueryType: GameplayTagQueryType;
      buffTags: readonly GameplayTag[];
      operator: ComparisonOperator;
      value: ActionValueOperand;
    }
  | {
      /** 比较当前 Context 迭代目标的有限能力实体剩余时长。 */
      kind: 'abilityEntityRemainingDurationCompare';
      operator: ComparisonOperator;
      value: ActionValueOperand;
    }
  | { kind: 'statusActive'; statusKey: string; target: CombatTarget; minimumStacks?: number }
  | {
      /** Environment 查询只读取执行中 Buff 的增强层数，不查询任何目标容器。 */
      kind: 'currentBuffStackCompare';
      operator: ComparisonOperator;
      value: ActionValueOperand;
    }
  | {
      /** 按原生 Buff 标签查询累计强化层数，并使用原生容差比较。 */
      kind: 'buffStackCompare';
      target: BuffSingleTarget;
      tagQueryType: GameplayTagQueryType;
      buffTags: readonly GameplayTag[];
      sameSourceSkillCast?: boolean;
      operator: ComparisonOperator;
      value: ActionValueOperand;
    }
  | {
      /** 查询目标实体当前持有的 GameplayTag；它与 Buff 身份、数量和层数无关。 */
      kind: 'entityTagMatch';
      target: BuffSingleTarget;
      tagQueryType: GameplayTagQueryType;
      tags: readonly GameplayTag[];
    }
  | {
      /** 按Buff 定义 身份查询累计强化层数；ID 列表按“任一匹配”处理。 */
      kind: 'buffIdStackCompare';
      target: BuffSingleTarget;
      buffIds: readonly string[];
      sameSourceSkillCast?: boolean;
      operator: ComparisonOperator;
      value: number | ActionValueOperand;
    }
  | {
      /** 检查目标能力系统中是否存在仍有效的原生定时标记。 */
      kind: 'timedMarkerPresent';
      target: TimedMarkerTarget;
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
      /** 匹配触发当前响应的伤害类型；未声明类型的外部事实不会命中。 */
      kind: 'eventDamageTypeIn';
      damageTypes: readonly DamageType[];
    }
  | {
      /** 匹配触发当前响应的元素附着类型。 */
      kind: 'eventInflictionElementIn';
      elements: readonly InflictionElement[];
      /** 命中后把原生元素编号写入已声明键；缺键报错，EntityBB_ 写入共享实体板。 */
      outputKey?: string;
    }
  | {
      /** 匹配来源 AbilitySystem 即将输出的物理异常类型。 */
      kind: 'eventPhysicalInflictionTypeIn';
      types: readonly ('airborne' | 'knockDown' | 'fracture' | 'crush')[];
    }
  | {
      /** 匹配触发 Buff 响应的待施放技能类型。 */
      kind: 'eventSkillTypeIn';
      skillTypes: readonly SkillType[];
    }
  | {
      /** 匹配当前事件的来源施法类型；按原生载荷类型读取，不回退到监听 Buff 的来源。 */
      kind: 'originSkillTypeIn';
      skillTypes: readonly SkillType[];
    }
  | {
      /** 当前 Context 目标组是否包含事件目标。 */
      kind: 'contextTargetContains';
      parentContextKey: string;
      child: 'eventTarget';
    }
  | {
      /** 匹配触发 Buff 响应的待施放技能稳定身份。 */
      kind: 'eventSkillIdIn';
      skillIds: readonly string[];
    }
  /** 当前技能事件与持有此响应的 Buff 是否来自同一原生 SkillCastId。 */
  | { kind: 'eventSkillCastMatchesBuffSource' }
  | {
      /** 匹配触发当前响应的新施加 Buff 身份。 */
      kind: 'eventBuffIdMatch';
      buffIds: readonly string[];
      /** 条件命中后把事件 Buff ID 写入当前动作黑板。 */
      buffIdOutputKey?: string;
    }
  /** 当前 Buff 结束事件由原生 Ignite/Early 原因触发。 */
  | { kind: 'eventBuffEndedEarly' }
  | {
      /** 匹配触发当前响应的新施加 Buff 原生标签。 */
      kind: 'eventBuffTagsMatch';
      match: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      buffTags: readonly GameplayTag[];
      /** Advanced 条件命中后把事件 Buff ID 写入当前动作黑板。 */
      buffIdOutputKey?: string;
    }
  | {
      /** 按当前事件真实目标统计匹配标签的 Buff 实例数；不累计 Buff 增强层数。 */
      kind: 'eventTargetBuffCountCompare';
      tagQueryType: GameplayTagQueryType;
      buffTags: readonly GameplayTag[];
      operator: ComparisonOperator;
      value: ActionValueOperand;
    }
  | {
      /** 匹配当前治疗事件携带的原生治疗标签。 */
      kind: 'eventHealTagsMatch';
      match: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
      tags: readonly GameplayTag[];
    }
  | {
      /** 匹配 OnObtainAtb 事件携带的来源与获得方式。 */
      kind: 'eventSpGainMatch';
      sources?: readonly SpGainSource[];
      gainKinds?: readonly SpGainKind[];
    }
  | {
      /** 比较 OnConsumeBuff 事件快照中的实际消费层数；命中后可写入动作黑板。 */
      kind: 'eventConsumedBuffLayerCompare';
      operator: ComparisonOperator;
      value: ActionValueOperand;
      outputKey?: string;
    }
  | {
      /** 比较治疗事件的来源与目标身份。 */
      kind: 'eventSourceTargetMatch';
      operator: 'equal' | 'notEqual';
    }
  | {
      /** 比较当前动作宿主与事件目标，不把宿主身份猜成事件来源。 */
      kind: 'eventActionOwnerTargetMatch';
      operator: 'equal' | 'notEqual';
    }
  | {
      /** 原生 CheckOverHeal；非空键会在判断前接收对应事件值。 */
      kind: 'eventOverheal';
      overHealKey?: string;
      finalHealKey?: string;
      realHealKey?: string;
    }
  /** 承伤/加 Buff 事件的物理来源是否等于创建监听 Buff 的实体。 */
  | { kind: 'eventSourceMatchesBuffSource' }
  /** 事件来源是否等于 Buff 来源能力实体的原生 AbilitySystem.source。 */
  | { kind: 'eventSourceMatchesBuffSourceEntitySource' }
  /** 承伤事件的伤害来源是否是当前现实时间下的主控干员。 */
  | { kind: 'eventSourceControlled' }
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
  'contextTargetObjectTypeMatch',
  'contextTargetBuffStackCompare',
  'abilityEntityRemainingDurationCompare',
  'statusActive',
  'buffStackCompare',
  'currentBuffStackCompare',
  'entityTagMatch',
  'buffIdStackCompare',
  'timedMarkerPresent',
  'abilityEntityTimedMarkerPresent',
  'eventDamageTagsMatch',
  'eventDamageFeaturesMatch',
  'eventDamageTypeIn',
  'eventInflictionElementIn',
  'eventPhysicalInflictionTypeIn',
  'eventSkillTypeIn',
  'originSkillTypeIn',
  'contextTargetContains',
  'eventSkillIdIn',
  'eventSkillCastMatchesBuffSource',
  'eventBuffIdMatch',
  'eventBuffEndedEarly',
  'eventBuffTagsMatch',
  'eventTargetBuffCountCompare',
  'eventHealTagsMatch',
  'eventSpGainMatch',
  'eventSourceTargetMatch',
  'eventOverheal',
  'eventSourceMatchesBuffSource',
  'eventSourceMatchesBuffSourceEntitySource',
  'eventSourceControlled',
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
