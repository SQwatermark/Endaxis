import type { GameplayTag, GameplayTagQueryType } from './gameplayTags.ts';
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
  type ActionStringOperand,
  type TimeDilationIgnoreTarget,
  type TimeDilationEntityTarget,
  type TimedMarkerTarget,
  type GlobalCooldownTarget,
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
  DamageScaleSide,
  DamageScaleZone,
} from './modifiers.ts';

/** 一次伤害步骤的完整声明；倍率使用小数，失衡与生命伤害同属该命中。 */
export interface DealDamageParameters {
  damageType: DamageType;
  /** 生成基础伤害所用的公式；标准攻击倍率路径可省略。 */
  calculation?: DamageCalculation;
  /** 单次命中的攻击倍率；原生允许在命中前通过动作黑板动态计算。 */
  attackScale: LevelValues | ActionValueOperand;
  /** 原生动作 Reset 时冻结本伤害单元的攻击计算结果，后续执行复用该值。 */
  takeAttackSnapshot?: boolean;
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
  /** DefiniteValueCalculation.applyScale 启用时在失衡基础值之后乘用的倍率。 */
  staggerMultiplier?: LevelValues | ActionValueOperand;
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
  /** 原生 DamageUnit.damageProcessors 中只对当前伤害包生效的命名伤害倍率区修正。 */
  instantDamageScaleModifiers?: readonly {
    side: DamageScaleSide;
    zone: DamageScaleZone;
    addition: ActionValueOperand;
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
  staggerMultiplier?: LevelValues | ActionValueOperand;
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
          readonly target: 'caster' | 'enemy' | 'eventTarget' | 'buffSource' | 'currentTarget';
        }
      | { readonly kind: 'context'; readonly contextKey: string }
    )[];
  };
  /** 查询当前队伍并把当时的实例身份快照覆盖写入 Context；后续消费者不得重新选人。 */
  findCharacterTeamTargets: {
    saveToContextKey: string;
    selection:
      | { readonly kind: 'allOperators' }
      | { readonly kind: 'controlledOperator' }
      | {
          readonly kind: 'lowestHealthRatioOperator';
          /** 在优先级筛选之前排除既有 Context 中保存的稳定身份。 */
          readonly excludedContextKey?: string;
          /** 在优先级筛选之前排除当前技能施术者。 */
          readonly excludeCaster?: true;
          /** 在 forEach Context 内排除当前迭代的干员目标。 */
          readonly excludeCurrentTarget?: true;
        };
  };
  /** 在零空间模型中只保存随机空间点的数量与稳定临时身份，不保存坐标。 */
  createSpatialPointTargets: {
    saveToContextKey: string;
    count: ActionValueOperand;
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
  /**
   * 对 Context 中的稳定目标句柄逐一同步执行；唯一木桩/施法者已被静态证明时，
   * 也可直接保留原生 ForEach 的即时生命周期与“忽略子序列返回值”边界。
   */
  forEachContextTarget:
    { contextKey: string; target?: never } | { contextKey?: never; target: 'enemy' | 'caster' };
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
  /** 结束当前能力实体子技能的 ActionOwner，不受内层 forEach 当前目标覆盖。 */
  finishActionOwnerAbilityEntity: Record<string, never>;
  /** 仅在当前能力实体的来源已经死亡时结束该实体。 */
  finishCurrentAbilityEntityWhenSourceDies: Record<string, never>;
  /** 在当前 Context 迭代目标所指向的既有能力实体上启动一个无施法子技能。 */
  startCurrentAbilityEntityChildSkill: {
    childSkill: AbilityEntityChildSkillDefinition;
  };
  /** 在当前 Context 能力实体自己的模板中按原生 Skill ID 启动具名子技能。 */
  startCurrentAbilityEntityChildSkillById: {
    childSkillId: string;
  };
  /** 在零空间模型中生成一个有独立身份、生命周期和实体黑板的逻辑能力实体。 */
  spawnAbilityEntity: {
    abilityEntityId: string;
    /** 手写定义可暂时内联；生成定义从干员或只读公共定义表按 ID 解析。 */
    definition?: AbilityEntityDefinition;
    /** 原生 assignBlackboard：生成时把当前动作黑板复制为实体黑板初值。 */
    inheritActionBlackboard?: boolean;
    /** 从实体模板的具名子技能集合选择本次 Spawn 绑定的原生子技能。 */
    childSkillId?: string;
    /** 生成位置锚点；Buff 局部时间线中的 Owner 是当前 Buff 宿主能力实体。 */
    target?: CombatTarget | 'currentAbilityEntity';
    overrideDurationSeconds?: ActionValueOperand;
    saveToContextKey?: string;
    dieWhenSourceDies: boolean;
    /** 原生 dieOnEnd：生成动作结束时同步结束本动作创建的实体。 */
    finishByAction?: boolean;
    blackboardAssignments?: Readonly<Record<string, ActionValueOperand>>;
    /** 原生 SpawnAbilityEntity 的直接字符串赋值；与数值操作数分开保存。 */
    stringBlackboardAssignments?: Readonly<Record<string, string>>;
  };
  applyElementalInfliction: {
    element: InflictionElement;
    isExtra: boolean;
    /** 省略时沿用技能的固定敌人；Buff Owner 必须按生命周期身份校验，不能无条件视为敌人。 */
    target?: 'enemy' | 'buffOwner';
  };
  /** Buff 触发周期中的原生 TriggerSpellBurstEventAction。 */
  triggerSpellBurst: { burstType: 'Fire' | 'Pulse' | 'Cryst' | 'Natural' };
  /** 在施放者 AbilitySystem 上同步发布一个已命名的原生自定义事件。 */
  triggerCustomAbilityEvent: {
    eventName: string;
    eventParam: number;
    target: 'caster';
    /** 省略沿用旧定义的 caster；能力实体子技能可保留原生 ActionOwner 事件来源身份。 */
    source?: 'caster' | 'currentAbilityEntity';
  };
  /** 原生 CastSkill：动作栈返回后覆盖写入 AbilitySystem 的单槽延迟施放请求。 */
  castSkillDuringAction: {
    /** 原生表内 Skill ID；装配层必须映射到同干员的稳定技能键。 */
    skillId: string;
    target: 'caster' | 'enemy';
    skipApplyCost: boolean;
    inheritSourceSkillCastInfo: boolean;
  };
  /** 普通根倒地动作；破防与状态 Buff 由公共目录解析，不等同于输出一次成功事件。 */
  applyKnockDown: {
    target: 'enemy';
    duration: ActionValueOperand;
    force: boolean;
    isExtra: boolean;
    /** 原生 AllValid/OnlyAlive 都只选存活目标；OnlyDead 实际跳过全部目标。 */
    targetFilter: 'aliveOnly' | 'skipAll';
    returnWhen: 'always' | 'successAndInterrupted' | 'success' | 'interrupted';
  };
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
    | {
        type: 'airborne';
        airborneBuffId: string;
        airborneDefinition: SkillBuffDefinition;
        duration: ActionValueOperand;
        height: ActionValueOperand;
        speedFactorMultiplier: number;
        force: boolean;
        /** 原生 AllValid/OnlyAlive 都只选存活目标；OnlyDead 实际跳过全部目标。 */
        targetFilter: 'aliveOnly' | 'skipAll';
        returnWhen: 'always' | 'successAndInterrupted' | 'success' | 'interrupted';
      }
  );
  applyElementalReaction: {
    reaction: ElementalReaction;
    target: CombatTarget;
    /** 原生反应触发 Buff 可从当前动作黑板转交持续时间。 */
    durationSeconds: number | ActionValueOperand;
    /** 构筑期持续时间修正；与动作黑板基础时长分离。 */
    durationMultiplier?: number;
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
  dealStagger: {
    value: LevelValues | ActionValueOperand;
    /** DefiniteValueCalculation.applyScale 启用时乘用的倍率。 */
    valueMultiplier?: LevelValues | ActionValueOperand;
    /** 保留原生 PoisePack 的装饰位；当前木桩没有弱点窗口，但不能从数据中丢弃。 */
    features?: readonly DamageFeature[];
  };
  /** 按施法者属性计算，并写入干员生命账本的普通治疗。 */
  heal: (
    | {
        target: 'contextTarget';
        /** 读取查询阶段已经保存的实例；治疗阶段不得重新选人。 */
        contextKey: string;
      }
    | {
        target: Exclude<HealTarget, 'contextTarget'>;
        contextKey?: never;
      }
  ) & {
    /** 原生 AbilityAction.alwaysNext；false 时保留治疗应用失败的序列短路。 */
    alwaysNext?: boolean;
    /** 原生 useHealTags 开启时的 GameplayTag 整数身份。 */
    tags: readonly GameplayTag[];
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
    /**
     * 在施加时覆盖 Buff 定义黑板的同名默认值。动作操作数从当前动作黑板求值；
     * 等级值在技能或养成初始化程序编译时解析。
     */
    blackboardAssignments?: Readonly<Record<string, LevelValues | ActionValueOperand>>;
    /** 原生字符串输入的字面覆盖；与数值赋值分开，避免把字符串伪装成计算操作数。 */
    stringBlackboardAssignments?: Readonly<Record<string, string>>;
    /**
     * 原生 KeywordAction.enhancingList：只附着到本次创建的关键词载体实例，不能改写共享模板。
     * value 在创建边沿从当前动作黑板求值，随后由载体自身监听普通 Buff 的加入边沿。
     */
    keywordEnhancements?: readonly {
      triggerBuffIds: readonly string[];
      operation: 'assign' | 'add' | 'multiply';
      value: ActionValueOperand;
    }[];
    /** 原生动作要求把当前施法身份复制到新 Buff 时为 true。 */
    inheritSourceSkillCastInfo?: boolean;
    /** 原生区域/动作生命周期结束时，只结束本步骤实际创建的 Buff 实例。 */
    finishByAction?: boolean;
    /**
     * 原生 Aura 离开边沿：先结束本步骤创建的区域 Buff，再在同一批目标上创建有限余效。
     * 只随 finishByAction=true 使用；余效是独立实例，不再归原 Aura 动作托管。
     */
    onActionEndBuffs?: readonly {
      buffId: string;
      target: BuffApplicationTarget;
      source?: BuffApplicationSource;
      blackboardAssignments?: Readonly<Record<string, ActionValueOperand>>;
      stringBlackboardAssignments?: Readonly<Record<string, string>>;
      inheritSourceSkillCastInfo?: boolean;
    }[];
    /**
     * 当前技能由白名单中的下一原生技能打断时，把本步骤创建的同一 Buff 实例转交给下一技能；
     * 不刷新层数、持续时间、来源或黑板。当前只与 finishByAction=true 的原生组合一起使用。
     */
    inheritToNextSkillIds?: readonly string[];
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
          tagQueryType: GameplayTagQueryType;
          buffTags: readonly GameplayTag[];
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
  /** 按 ID 读取目标首个有效 Buff 的剩余秒数；无限时长写入 0。 */
  readBuffRemainingDuration: {
    target: BuffSingleTarget;
    buffIds: readonly string[];
    outputKey: string;
  };
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
          tagQueryType: GameplayTagQueryType;
          buffTags: readonly GameplayTag[];
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
    tagQueryType: GameplayTagQueryType;
    buffTags: readonly GameplayTag[];
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
    source: BuffSingleTarget | 'currentBuffSource';
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
  /**
   * 从当前技能的结束清理集合摘下目标身上的首个同 ID Buff，并在技能转场时转交同一实例。
   * 该步骤不创建、刷新或复制 Buff；白名单使用原生 Skill ID。
   */
  inheritBuffById: {
    target: 'caster';
    buffId: string;
    inheritToNextSkillIds: readonly string[];
    finishByAction: boolean;
    finishWithNextSkillIfNotInherited: boolean;
  };
  /** 在动作存续期间只允许带指定标签的正向终结技能量回复；多个实例按原生语义取并集。 */
  restrictUltimateEnergyRecovery: {
    target: 'caster';
    allowedRecoveryTags: readonly GameplayTag[];
    clearUltimateEnergyOnEnd: boolean;
  };
  /** 设置角色的战斗级冷却：同角色/ID 刷新剩余秒数，不受角色时间膨胀或动作结束影响。 */
  setGlobalCooldown: {
    target: GlobalCooldownTarget;
    markerId: string;
    durationSeconds: ActionValueOperand;
  };
  /** 在目标能力系统上创建定时标记；同 ID 标记不会互相覆盖。 */
  createTimedMarker: {
    target: TimedMarkerTarget;
    markerId: ActionStringOperand;
    durationSeconds: ActionValueOperand;
    autoFinishByAction: boolean;
    /** 原生 useTimeDilationDt=true 时使用全局 allScaledDeltaTime；缺省使用普通帧时钟。 */
    timeDomain?: 'globalScaled';
  };
  /** 在当前能力实体上创建定时标记；每个标记显式选择共享战斗或实体自身时钟。 */
  createAbilityEntityTimedMarker: {
    markerId: ActionStringOperand;
    durationSeconds: ActionValueOperand;
    autoFinishByAction: boolean;
    timeDomain: 'global' | 'self';
  };
  /** 创建普通全局或实体时间膨胀实例；终结技专用时间动作另行建模。 */
  startTimeDilation:
    | {
        scope: 'global';
        durationSeconds: ActionValueOperand;
        slot: GameplayTag;
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
        slot: GameplayTag;
        priority: number;
        curve: TimeScaleCurveDefinition;
        finishByAction: boolean;
        targets: readonly TimeDilationEntityTarget[];
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
  /** 在动作区间内切换目标能力实体是否忽略全局时间倍率。 */
  setIgnoreGlobalTimeScale: {
    abilityEntityTargets: readonly AbilityEntityTargetQuery[];
    ignore: boolean;
    revertOnEnd: boolean;
  };
  /** 修改当前技能实例的动作黑板；不得用于跨技能持久状态。 */
  storeCurrentTimelineFrame: {
    /** 把 Owner AbilitySystem 当前技能的局部整数执行帧写入动作黑板。 */
    outputKey: string;
  };
  /** 读取当前 spGained 语义事件，分别保存原生 Value 与 RealDelta。 */
  storeEventSpGainAmount: {
    /** 效率结算后、共享技力上限截断前的 OnObtainAtb.Value。 */
    outputKey?: string;
    /** 共享技力实际变化量 OnObtainAtb.RealDelta。 */
    realDeltaOutputKey?: string;
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
    ultimateRecoveryTag?: GameplayTag;
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
    ultimateRecoveryTag?: GameplayTag;
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
  /** 原生 Switch：choice 求值一次，与各候选按 float32 差值容差 1e-5f 顺序匹配。 */
  switch: {
    choice: ActionValueOperand;
    /** 只覆盖本步骤的返回值，不取消选中序列内部的短路；无匹配时直接返回此值。 */
    alwaysNext: boolean;
  };
  /** 同一个技能释放实例内共享的只执行一次作用域。 */
  once: { scopeKey: string };
  /** 在一次原生子 SkillData 调用的 direct blackboard 中执行 body。 */
  withActionBlackboardScope: {
    scopeKey: string;
    /** 默认在同一父黑板内复用；execution 用于每次发射等独立实例，不跨循环项共享。 */
    lifetime?: 'parent' | 'execution';
    /** 回调边界忽略局部序列的短路结果，不阻止后续独立回调。 */
    alwaysNext?: boolean;
    /**
     * 原生同一 Buff 实例上的并列回调共享 Buff direct blackboard；仅隔离返回值控制流。
     * 启用时 initialValues 必须为空、inheritParent 必须为 true，且不得声明实体黑板初值或赋值。
     */
    shareParentBlackboard?: boolean;
    initialValues: Readonly<Record<string, LevelValues>>;
    /** 原生 assignBlackboard：调用时把父 direct blackboard 覆盖到子初值之上。 */
    inheritParent: boolean;
    /** 投射物等独立逻辑宿主在模板中声明的实体黑板；省略时继续共享父宿主实体层。 */
    entityInitialValues?: Readonly<Record<string, LevelValues>>;
    /** 创建独立宿主时从父动作黑板求值，并覆盖模板实体黑板初值。 */
    entityAssignments?: Readonly<Record<string, ActionValueOperand>>;
  };
  /** 在承载调度区间内逐 Tick 驱动 body；可保留原生 Channeling 的扫描与单目标门槛。 */
  repeatEachTick: {
    nativeChanneling?: {
      executeEachFrame: boolean;
      triggerIntervalSeconds: number;
      maxCountPerTarget: number;
      targetTriggerIntervalSeconds: number;
    };
    /** 1.4.4 TickIntervalAction：首次即时执行，之后按单精度累计周期推进。 */
    nativeTickInterval?: {
      executeEachFrame: boolean;
      intervalSeconds: number;
    };
  };
  /** 按动作黑板或常量次数同步执行独立 body；每次都创建新的子步骤实例。 */
  repeatByActionValue: { count: ActionValueOperand };
  /**
   * 原生 ProjectileComponent 的正数 finishDuration 到期回调。
   * 注册发生在发射动作实际执行时，且回调寿命独立于发射技能；不得用于普通技能延迟动作。
   */
  scheduleProjectileFinishCallback: { delaySeconds: number };
  setContextFlag: {
    flag: string;
    value: boolean | number | string;
    target: 'caster';
  };
  /** 为当前干员开启固定五秒的连携候选；下一段技能身份随候选进入场景级队列。 */
  openComboWindow:
    | { nextSkillKey: string }
    /** TriggerComboSkillAction 读取 owner 当前 ComboSkill 槽，不携带静态技能 ID。 */
    | { nextSkillKeyFromSlot: 'comboSkill' };
  /** 切换稳定技能组后续释放所使用的技能形态；当前已启动的释放不受影响。 */
  changeSkillSlot: {
    skillGroupKey: string;
    targetSkillKey: string;
    /** 原生 ChangeSkillAction 在切换前把当前形态的归一化冷却进度传给目标形态。 */
    inheritOriginSkillCooldownProgress?: boolean;
    /** 省略时为旧的显式一次换槽；原生 ChangeSkillAction 必须声明句柄寿命。 */
    lifetime?: 'infinite' | 'finishByAction';
    /** 原生指定还原技能；省略时由运行时快照替换前槽位。 */
    revertedSkillKey?: string;
  };
  /** SwitchModeAction：只改变后续玩家操作的原生路由，结束时恢复同层上一模式。 */
  changePlayerActionMode: {
    modeId: string;
    lifetime: 'finishByAction';
  };
  /** ChangeSkillType：原地改写既有技能实例的原生分类，不替换技能槽。 */
  changeNativeSkillType: {
    targetSkillKey: string;
    nativeSkillType: import('./skills.ts').NativeSkillType;
  };
  /** 原生 NotifyCharPassiveUIAction：更新角色专属 HUD 数值，不修改伤害状态。 */
  setCharacterPassiveUiValue: {
    target: CombatTarget;
    value: ActionValueOperand;
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
  'findCharacterTeamTargets',
  'createSpatialPointTargets',
  'findOwnerSpawnedAbilityEntities',
  'pickContextTarget',
  'forEachContextTarget',
  'readAbilityEntityRemainingDuration',
  'setAbilityEntityRemainingDuration',
  'finishCurrentAbilityEntity',
  'finishActionOwnerAbilityEntity',
  'finishCurrentAbilityEntityWhenSourceDies',
  'startCurrentAbilityEntityChildSkill',
  'startCurrentAbilityEntityChildSkillById',
  'spawnAbilityEntity',
  'applyElementalInfliction',
  'triggerSpellBurst',
  'triggerCustomAbilityEvent',
  'castSkillDuringAction',
  'applyPhysicalInfliction',
  'applyKnockDown',
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
  'readBuffRemainingDuration',
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
  'inheritBuffById',
  'restrictUltimateEnergyRecovery',
  'createTimedMarker',
  'setGlobalCooldown',
  'createAbilityEntityTimedMarker',
  'startTimeDilation',
  'startUltimateTimeDilation',
  'setIgnoreGlobalTimeScale',
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
  'switch',
  'once',
  'withActionBlackboardScope',
  'repeatEachTick',
  'repeatByActionValue',
  'scheduleProjectileFinishCallback',
  'setContextFlag',
  'openComboWindow',
  'changeSkillSlot',
  'changePlayerActionMode',
  'changeNativeSkillType',
  'setCharacterPassiveUiValue',
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
  : K extends 'switch'
    ? { options: readonly ActionSwitchOptionDefinition[] }
    : K extends 'once'
      ? { body: ActionSequenceDefinition }
      : K extends 'withActionBlackboardScope'
        ? { body: ActionSequenceDefinition }
        : K extends 'repeatEachTick'
          ? { body: ActionSequenceDefinition }
          : K extends 'repeatByActionValue'
            ? { body: ActionSequenceDefinition }
            : K extends 'scheduleProjectileFinishCallback'
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

/** 候选值是标签而非索引；允许重复，首个匹配获胜。空分支也是有效候选，不得删除。 */
export interface ActionSwitchOptionDefinition {
  readonly value: ActionValueOperand;
  readonly sequence: ActionSequenceDefinition;
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
  | { kind: 'buffOutput' }
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

/** 技能、Buff 与配装事件监听共用的语义触发器词表。 */
export const COMBAT_EVENT_TRIGGER_KINDS = [
  'operatorHit',
  'operatorHealed',
  'buffApplied',
  'buffOutput',
  'buffConsumed',
  'airborneOutput',
  'knockDownOutput',
  'spGained',
  'damageTagHit',
  'elementalInflictionApplied',
  'physicalInflictionApplied',
  'skillHit',
  'enemyDefeated',
  'statusExpired',
  'statusConsumed',
] as const satisfies readonly CombatEventTrigger['kind'][];

/** 一个技能在战斗事件发生后调度的条件化行为。 */
export interface CombatEventHandlerDefinition {
  key: string;
  event: CombatEventTrigger;
  condition?: CombatCondition;
  scheduledSequences: readonly ScheduledSequenceDefinition[];
}
