import {
  type BuffApplicationSource,
  type BuffApplicationTarget,
  type BuffSingleTarget,
  type CombatResource,
  type CombatTarget,
  type DamageCalculation,
  type DamageElement,
  type DamageFeature,
  type DamageTag,
  type DamageType,
  type ElementalReaction,
  type HealCalculationAttribute,
  type HealTarget,
  type InflictionElement,
  type LevelValues,
  type OperatorAttribute,
  type PhysicalInflictionType,
  type ResourceRecipient,
  type SkillType,
  type SpGainKind,
  type SpGainSource,
  type TimeDilationIgnoreTarget,
  type TimedMarkerTarget,
} from './primitives.ts';
import {
  type ActionValueCalculationOperation,
  type ActionValueOperand,
  type ActionValueOperation,
  type CombatCondition,
  type TimeScaleCurveDefinition,
} from './conditions.ts';
import {
  type AbilityEntityChildSkillDefinition,
  type AbilityEntityDefinition,
  type AbilityEntityTargetQuery,
  type SkillTriggerScope,
} from './skills.ts';
import { type SkillBuffDefinition, type SkillGlobalBuffDefinition } from './buffs.ts';
import type {
  AttributeModifierSlot,
  AttributeModifierTiming,
  DamageModifierSide,
} from './modifiers.ts';

/** 一次伤害步骤的完整声明；倍率使用小数，失衡与生命伤害同属该命中。 */
export interface DealDamageParameters {
  damageType: DamageType;
  /** 生成基础伤害所用的公式；标准攻击倍率路径可省略。 */
  calculation?: DamageCalculation;
  /** 单次命中的攻击倍率；原生允许在命中前通过动作黑板动态计算。 */
  attackScale: LevelValues | ActionValueOperand;
  /** 破防攻击计算中的逐命中倍率；标准伤害不得设置。 */
  calculationMultiplier?: LevelValues;
  /** MultiplyAttributeCalculation 读取的来源实体原生属性键。 */
  calculationAttribute?: string;
  /** MultiplyAttributeCalculation 在属性乘算后追加的固定或黑板值。 */
  calculationAddition?: LevelValues | ActionValueOperand;
  tags: readonly DamageTag[];
  /** 原生伤害位中与技能分类无关的行为特征。 */
  features?: readonly DamageFeature[];
  /** 同一次命中在生命伤害之后结算的失衡伤害；原生同样允许从动作黑板读取。 */
  stagger?: LevelValues | ActionValueOperand;
  /** 原生 Poise 单元 onlyEnableForMainChar；生命伤害仍正常结算。 */
  staggerOnlyWhenCasterControlled?: boolean;
  /** 每层语义化战斗状态提供的额外攻击倍率。 */
  attackScalePerStatusStack?: {
    statusKey: string;
    target: CombatTarget;
    coefficient: LevelValues;
  };
  /** 原生 DamageUnit.damageProcessors 中只对当前伤害包生效的属性修正。 */
  instantAttributeModifiers?: readonly {
    targetSide: DamageModifierSide;
    attribute: string;
    slot: AttributeModifierSlot;
    value: ActionValueOperand;
    attributeTiming: AttributeModifierTiming;
  }[];
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
  /** 原生 Poise 单元 onlyEnableForMainChar；生命伤害仍正常结算。 */
  staggerOnlyWhenCasterControlled?: boolean;
}

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
  /** 合并稳定目标身份并覆盖写入 Context 目标组；空 sources 用于初始化空组。 */
  mergeContextTargets: {
    saveToContextKey: string;
    sources: readonly (
      | {
          readonly kind: 'target';
          readonly target: 'caster' | 'enemy' | 'eventTarget' | 'buffSource';
        }
      | { readonly kind: 'context'; readonly contextKey: string }
    )[];
  };
  /** 按 owner 与生成期已解析的实体身份查询，并保存为本次释放的 Context 目标组。 */
  findOwnerSpawnedAbilityEntities: {
    saveToContextKey: string;
    abilityEntityIds?: readonly string[];
    /** 省略时使用当前动作施法者；存在时从已写入 Context 的单个干员解析 owner。 */
    ownerContextKey?: string;
    /** 原生查询后处理保留的目标数量；零空间模型会消去距离排序，但不能消去截断。 */
    maxTargets?: number;
    /** 使用当前技能或 Buff 继承的施法序号执行 SkillCastIdValidator。 */
    sameSourceSkillCast?: boolean;
    /** 可选地把同一查询结果数量写入动作黑板，后续复用 actionValueCompare。 */
    saveCountToBlackboardKey?: string;
    /** 原生 CircularOrderSort 在项目零空间投影下以槽位 0 为起点执行的环排序。 */
    circularOrder?: {
      indexBlackboardKey: string;
      desiredCount: number;
      /** 保留原生符号语义：非负递减，负值递增。 */
      reverseFlag: number;
    };
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
    /** 生成位置锚点；Buff 局部时间线中的 Owner 是当前 Buff 宿主能力实体。 */
    target?: CombatTarget | 'currentAbilityEntity';
    overrideDurationSeconds?: ActionValueOperand;
    saveToContextKey?: string;
    dieWhenSourceDies: boolean;
    blackboardAssignments?: Readonly<Record<string, ActionValueOperand>>;
  };
  applyElementalInfliction: {
    element: InflictionElement;
    isExtra: boolean;
    /** 省略时沿用技能的固定敌人；Buff Owner 必须按生命周期身份校验，不能无条件视为敌人。 */
    target?: 'enemy' | 'buffOwner';
  };
  /** Buff 触发周期中的原生 TriggerSpellBurstEventAction。 */
  triggerSpellBurst: { burstType: 'Fire' | 'Pulse' | 'Cryst' | 'Natural' };
  /**
   * 对固定敌人执行物理异常入口。公共 Buff 蓝图随使用点内联，运行时按目标当前层数
   * 选择首次破防或后续异常链，不把公共 Buff 变成可编辑的项目级钻石依赖。
   */
  applyPhysicalInfliction: {
    target: 'enemy';
    isExtra: boolean;
    noGuardBuffId: string;
    noGuardDefinition: SkillBuffDefinition;
  } & (
    | {
        type: 'fracture';
        fractureBuffId: string;
        fractureDefinition: SkillBuffDefinition;
      }
    | {
        type: 'crush';
        crushedBuffId: string;
        crushedDefinition: SkillBuffDefinition;
        damageMultiplier: ActionValueOperand;
        ignoreHitEffect: boolean;
      }
  );
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
  /** 报告一次对固定目标成功输出击倒；木桩模型不保存倒地控制状态。 */
  outputKnockDown: { target: CombatTarget };
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
    /** 动态身份在执行时从字符串黑板读取；不携带可被误用的字面回退 ID。 */
    buffId: string | { readonly blackboardKey: string };
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
    /** 原生字符串输入的字面覆盖；与数值赋值分开，避免把字符串伪装成计算操作数。 */
    stringBlackboardAssignments?: Readonly<Record<string, string>>;
    /** 原生动作要求把当前施法身份复制到新 Buff 时为 true。 */
    inheritSourceSkillCastInfo?: boolean;
    /** 原生区域/动作生命周期结束时，只结束本步骤实际创建的 Buff 实例。 */
    finishByAction?: boolean;
    /** 原生 asChildBuff：当前动作由 Buff 持有时，父 Buff 结束会同步结束该实例。 */
    asChildBuff?: boolean;
    /** CreateBuffAttachingSkill：绑定事件当前技能而非动作 owner 的寿命。 */
    lifetimeOwner?: 'currentCastSkill';
    durationSeconds?: number;
    effectiveness?: number;
  };
  /** 创建一个独立的战斗级 GlobalBuff 实例，并把其子 Buff 投影到当前固定队伍。 */
  createGlobalBuff: {
    globalBuffId: string;
    definition: SkillGlobalBuffDefinition;
    count?: ActionValueOperand;
    source?: BuffApplicationSource;
    blackboardAssignments?: Readonly<Record<string, ActionValueOperand>>;
    /** 所在动作结束时只清理本步骤创建的 GlobalBuff 实例。 */
    finishByAction?: boolean;
  };
  /** 只结束当前子 Buff 精确关联的那个父 GlobalBuff 实例。 */
  finishParentGlobalBuff: {
    reason: 'early' | 'other';
  };
  /** 从版本化 SkillSetting 的四列值按运行时列号读取，并写入当前动作黑板。 */
  readSkillSettingData: {
    items: readonly {
      values: readonly number[];
      column: ActionValueOperand;
      storeKey: string;
      enhance?: {
        target: 'caster' | 'buffOwner' | 'buffSource';
        formula:
          | { readonly kind: 'linear'; readonly paramA: number }
          | { readonly kind: 'saturating'; readonly paramA: number; readonly paramB: number };
      };
    }[];
  };
  /** 按原生 ID 或标签查询目标的首个有效 Buff，并把其数值黑板写入当前动作黑板。 */
  readBuffBlackboard: {
    target: BuffSingleTarget;
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
  /** 从 OnConsumeBuff/OnFinishedBuff 事件携带的运行时 Buff 快照读取黑板。 */
  readEventBuffBlackboard: {
    desiredKey: string;
    outputKey: string;
  };
  /** 把当前生命周期环境中有限时长 Buff 的剩余秒数写入动作黑板；无限时长写入 0。 */
  readCurrentBuffRemainingDuration: { outputKey: string };
  /** 直接修改当前生命周期环境中有限时长 Buff 的剩余秒数。 */
  setCurrentBuffRemainingDuration: {
    operation: 'assign' | 'add' | 'multiply';
    value: ActionValueOperand;
  };
  /** 按当前 Buff 黑板重新解析并替换已注册的属性修正值。 */
  refreshCurrentBuffAttributeModifiers: Record<string, never>;
  /** 查询匹配 Buff 的累计强化层数或实例数，并写入当前技能实例的动作黑板。 */
  readBuffStackCount: {
    target: BuffSingleTarget;
    outputKey: string;
    query:
      | { kind: 'id'; buffIds: readonly string[] }
      | { kind: 'environment' }
      | {
          kind: 'tag';
          tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
          buffTagIds: readonly number[];
        };
    sameSourceSkillCast?: boolean;
    /** 缺省保持历史的累计强化层数；原生 BuffCount 必须显式使用 instance。 */
    countType?: 'enhance' | 'instance';
  };
  /** 按原生标签查询结束目标身上的匹配 Buff；count 缺省时结束全部。 */
  finishBuffsByTag: {
    target: Exclude<
      BuffApplicationTarget,
      | 'controlledOperator'
      | 'party'
      | 'partyExceptCaster'
      | 'partyExceptCasterAndSameCharacterType'
      | 'casterAndControlledOperator'
      | 'casterAndLowestHealthRatioOperatorExceptCaster'
    >;
    tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
    buffTagIds: readonly number[];
    reason: 'early' | 'absorbed' | 'other';
    count?: ActionValueOperand;
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
    target: BuffSingleTarget;
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
  /** 在动作存续期间只允许带指定标签的正向终结技能量回复；多个实例按原生语义取并集。 */
  restrictUltimateEnergyRecovery: {
    target: 'caster';
    allowedRecoveryTagIds: readonly number[];
    clearUltimateEnergyOnEnd: boolean;
  };
  /** 在目标能力系统上创建定时标记；同 ID 标记不会互相覆盖。 */
  createTimedMarker: {
    target: TimedMarkerTarget;
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
    /** 把 Owner AbilitySystem 当前技能的局部整数执行帧写入动作黑板。 */
    outputKey: string;
  };
  /** 把当前 spGained 语义事件的实际获得量写入动作黑板。 */
  storeEventSpGainAmount: { outputKey: string };
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
  /** 在一次原生子 SkillData 调用独占的 direct blackboard 中执行 body。 */
  withActionBlackboardScope: {
    scopeKey: string;
    /** 默认在同一父黑板内复用；execution 用于每次发射等独立实例，不跨循环项共享。 */
    lifetime?: 'parent' | 'execution';
    /** 回调边界忽略局部序列的短路结果，不阻止后续独立回调。 */
    alwaysNext?: boolean;
    initialValues: Readonly<Record<string, LevelValues>>;
    /** 原生 assignBlackboard：调用时把父 direct blackboard 覆盖到子初值之上。 */
    inheritParent: boolean;
    /** 投射物等独立逻辑宿主在模板中声明的实体黑板；省略时继续共享父宿主实体层。 */
    entityInitialValues?: Readonly<Record<string, LevelValues>>;
  };
  /** 在承载调度区间内逐 Tick 驱动 body；可保留原生 Channeling 的扫描与单目标门槛。 */
  repeatEachTick: {
    nativeChanneling?: {
      executeEachFrame: boolean;
      triggerIntervalSeconds: number;
      maxCountPerTarget: number;
      targetTriggerIntervalSeconds: number;
    };
  };
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
  'mergeContextTargets',
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
  'triggerSpellBurst',
  'applyPhysicalInfliction',
  'applyElementalReaction',
  'consumeElementalReaction',
  'outputAirborne',
  'outputKnockDown',
  'dealDamage',
  'dealFixedDamage',
  'dealStagger',
  'heal',
  'applyBuff',
  'createGlobalBuff',
  'finishParentGlobalBuff',
  'readSkillSettingData',
  'readBuffBlackboard',
  'readEventBuffBlackboard',
  'readCurrentBuffRemainingDuration',
  'setCurrentBuffRemainingDuration',
  'refreshCurrentBuffAttributeModifiers',
  'readBuffStackCount',
  'finishBuffsByTag',
  'finishBuffsById',
  'finishCurrentBuff',
  'setCurrentBuffTimePaused',
  'igniteBuffs',
  'adjustSkillCooldown',
  'holdBuffsById',
  'restrictUltimateEnergyRecovery',
  'createTimedMarker',
  'createAbilityEntityTimedMarker',
  'startTimeDilation',
  'startUltimateTimeDilation',
  'storeCurrentTimelineFrame',
  'storeEventSpGainAmount',
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
  'withActionBlackboardScope',
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
    : K extends 'withActionBlackboardScope'
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

/**
 * 技能和养成效果可以监听的语义战斗事件。
 * 事件身份不包含复杂筛选逻辑，额外限制应由条件树表达。
 */
export type CombatEventTrigger =
  | { kind: 'operatorHit' }
  | { kind: 'operatorHealed'; role?: 'source' | 'target' }
  | { kind: 'buffApplied' }
  | { kind: 'buffConsumed'; buffIds?: readonly string[] }
  | { kind: 'airborneOutput' }
  | { kind: 'knockDownOutput' }
  | { kind: 'spGained'; source?: SpGainSource; gainKind?: SpGainKind }
  | { kind: 'damageTagHit'; tag: DamageTag; scope: SkillTriggerScope }
  | {
      kind: 'elementalInflictionApplied';
      elements: DamageElement | readonly DamageElement[];
      scope: SkillTriggerScope;
    }
  | {
      kind: 'physicalInflictionApplied';
      types: PhysicalInflictionType | readonly PhysicalInflictionType[];
      scope: SkillTriggerScope;
    }
  | { kind: 'skillHit'; skillGroupKey: string; scope: SkillTriggerScope }
  | { kind: 'enemyDefeated'; scope: SkillTriggerScope }
  | { kind: 'statusExpired'; statusKey: string; target: CombatTarget }
  | { kind: 'statusConsumed'; statusKey: string; target: CombatTarget };

/** 一个技能在战斗事件发生后调度的条件化行为。 */
export interface CombatEventHandlerDefinition {
  key: string;
  event: CombatEventTrigger;
  condition?: CombatCondition;
  scheduledSequences: readonly ScheduledSequenceDefinition[];
}
