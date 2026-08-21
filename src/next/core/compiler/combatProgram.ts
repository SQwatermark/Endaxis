/**
 * 游戏数据与战斗运行时之间的解析后协议。这里的值已经确定等级和引用，
 * 运行时可以直接消费，但不得修改或重新解释原始干员配置。
 */
import type {
  ActionValueOperand,
  AbilityEntityDefinition,
  CombatCondition,
  CombatEventTrigger,
  ComboSkillPriority,
  ComboSkillTriggerRule,
  CombatResource,
  CombatStepKind,
  CombatStepParameters,
  DamageFeature,
  DamageTag,
  DamageType,
  ElementalReaction,
  OperatorAttribute,
  ResourceRecipient,
  SkillBuffDefinition,
  SkillBuffLifecycleSequences,
  SkillBuffAbilityEventResponse,
  SkillBuffIgniteEventResponse,
  SpGainKind,
  SpGainSource,
  SkillType,
  StatusModifierDefinition,
  UpgradeEvent,
} from '../game-data/operatorDefinition';
import type { GameplayTagId } from '../combat/tags/gameplayTags';

/** 等级数值已经展开、可供运行时直接应用的状态修正。 */
export type ResolvedStatusModifier =
  | { kind: 'attackPercent'; value: number }
  | {
      kind: 'susceptibility';
      damageTypes: readonly DamageType[];
      value: number;
      attributeScaling?: { attribute: OperatorAttribute; coefficient: number };
      cap?: number;
    }
  | { kind: 'slowed' }
  | { kind: 'blockResourceGain'; resource: CombatResource }
  | { kind: 'resourceCostMultiplier'; resource: CombatResource; value: number }
  | { kind: 'skillCooldownMultiplier'; skillGroupKey: string; value: number };

/** 每种步骤经编译后允许进入运行时的参数映射。 */
export type ResolvedSkillBuffLifecycleSequences = {
  readonly [K in keyof SkillBuffLifecycleSequences]?: ResolvedActionSequence;
};

export type ResolvedSkillBuffAbilityEventResponse = Omit<
  SkillBuffAbilityEventResponse,
  'sequence'
> & {
  readonly sequence: ResolvedActionSequence;
};

export type ResolvedSkillBuffIgniteEventResponse = Omit<
  SkillBuffIgniteEventResponse,
  'sequence'
> & {
  readonly sequence: ResolvedActionSequence;
};

/** 技能等级已经展开、可用于创建 Buff 实例的内联定义。 */
export type ResolvedSkillBuffDefinition = Omit<
  SkillBuffDefinition,
  'scheduledSequences' | 'lifecycleSequences' | 'abilityEventResponses' | 'igniteEventResponses'
> & {
  readonly scheduledSequences?: readonly CompiledTimelineAction[];
  readonly lifecycleSequences?: ResolvedSkillBuffLifecycleSequences;
  readonly abilityEventResponses?: readonly ResolvedSkillBuffAbilityEventResponse[];
  readonly igniteEventResponses?: readonly ResolvedSkillBuffIgniteEventResponse[];
};

/** 等级已经展开、由单个能力实体实例按局部时钟执行的子技能。 */
export interface CompiledAbilityEntityChildSkillProgram {
  readonly skillId: string;
  readonly initialBlackboard: Readonly<Record<string, number>>;
  readonly timelineActions: readonly CompiledTimelineAction[];
}

/** 已按引用技能等级展开、可供逻辑能力实体运行时创建实例的蓝图。 */
export interface ResolvedAbilityEntityDefinition {
  readonly lifetime: AbilityEntityDefinition['lifetime'];
  readonly childSkill?: CompiledAbilityEntityChildSkillProgram;
}

export interface ResolvedCombatStepParameters {
  findOwnerSpawnedAbilityEntities: CombatStepParameters['findOwnerSpawnedAbilityEntities'];
  forEachContextTarget: CombatStepParameters['forEachContextTarget'];
  readAbilityEntityRemainingDuration: CombatStepParameters['readAbilityEntityRemainingDuration'];
  setAbilityEntityRemainingDuration: CombatStepParameters['setAbilityEntityRemainingDuration'];
  finishCurrentAbilityEntity: CombatStepParameters['finishCurrentAbilityEntity'];
  finishCurrentAbilityEntityWhenSourceDies: CombatStepParameters['finishCurrentAbilityEntityWhenSourceDies'];
  startCurrentAbilityEntityChildSkill: {
    readonly childSkill: CompiledAbilityEntityChildSkillProgram;
  };
  spawnAbilityEntity: Omit<CombatStepParameters['spawnAbilityEntity'], 'definition'> & {
    readonly definition?: ResolvedAbilityEntityDefinition;
  };
  applyElementalInfliction: CombatStepParameters['applyElementalInfliction'];
  applyPhysicalInfliction: Omit<
    CombatStepParameters['applyPhysicalInfliction'],
    'noGuardDefinition' | 'fractureDefinition'
  > & {
    readonly noGuardDefinition: ResolvedSkillBuffDefinition;
    readonly fractureDefinition: ResolvedSkillBuffDefinition;
  };
  applyElementalReaction: CombatStepParameters['applyElementalReaction'];
  consumeElementalReaction: CombatStepParameters['consumeElementalReaction'];
  outputAirborne: CombatStepParameters['outputAirborne'];
  dealDamage: {
    damageType: DamageType;
    calculation?: 'standard' | 'breakingAttack';
    attackScale: number | ActionValueOperand;
    calculationMultiplier?: number;
    tags: readonly DamageTag[];
    features?: readonly DamageFeature[];
    stagger?: number | ActionValueOperand;
    attackScalePerStatusStack?: {
      statusKey: string;
      target: 'caster' | 'enemy';
      coefficient: number;
    };
  };
  dealFixedDamage: {
    damageType: DamageType;
    value: number | ActionValueOperand;
    tags: readonly DamageTag[];
    features?: readonly DamageFeature[];
    stagger?: number | ActionValueOperand;
  };
  dealStagger: { value: number | ActionValueOperand };
  heal: {
    target: CombatStepParameters['heal']['target'];
    alwaysNext?: boolean;
    tagIds: readonly number[];
  } & (
    | {
        attribute: OperatorAttribute;
        multiplier: number | ActionValueOperand;
        addition: number | ActionValueOperand;
        amount?: never;
      }
    | {
        amount: number | ActionValueOperand;
        attribute?: never;
        multiplier?: never;
        addition?: never;
      }
  );
  applyBuff: Omit<CombatStepParameters['applyBuff'], 'definition'> & {
    readonly definition?: ResolvedSkillBuffDefinition;
  };
  readBuffBlackboard: CombatStepParameters['readBuffBlackboard'];
  readBuffStackCount: CombatStepParameters['readBuffStackCount'];
  finishBuffsByTag: CombatStepParameters['finishBuffsByTag'];
  finishBuffsById: CombatStepParameters['finishBuffsById'];
  finishCurrentBuff: CombatStepParameters['finishCurrentBuff'];
  setCurrentBuffTimePaused: CombatStepParameters['setCurrentBuffTimePaused'];
  igniteBuffs: CombatStepParameters['igniteBuffs'];
  adjustSkillCooldown: CombatStepParameters['adjustSkillCooldown'];
  holdBuffsById: CombatStepParameters['holdBuffsById'];
  createTimedMarker: CombatStepParameters['createTimedMarker'];
  createAbilityEntityTimedMarker: CombatStepParameters['createAbilityEntityTimedMarker'];
  startTimeDilation: CombatStepParameters['startTimeDilation'];
  startUltimateTimeDilation: CombatStepParameters['startUltimateTimeDilation'];
  storeCurrentTimelineFrame: CombatStepParameters['storeCurrentTimelineFrame'];
  modifyActionValue: CombatStepParameters['modifyActionValue'];
  calculateActionValue: CombatStepParameters['calculateActionValue'];
  changeResource: {
    resource: CombatResource;
    amount: number;
    coefficient?: number;
    recipient: ResourceRecipient;
    spGainKind?: SpGainKind;
    spGainSource?: SpGainSource;
    isPercentValue?: boolean;
    ultimateRecoveryTagId?: GameplayTagId;
    ignoreUltimateEnergyGainMultiplier?: boolean;
  };
  changeResourceByActionValue: Omit<
    CombatStepParameters['changeResourceByActionValue'],
    'coefficient' | 'ultimateRecoveryTagId'
  > & {
    coefficient?: number | ActionValueOperand;
    ultimateRecoveryTagId?: GameplayTagId;
  };
  gainSquadUltimateEnergyFromSkillCost: { coefficient: number };
  gainFinisherSp: CombatStepParameters['gainFinisherSp'];
  applyStatus: {
    statusKey: string;
    target: 'caster' | 'enemy';
    durationFrames?: number;
    stacks?: number;
    maxStacks?: number;
    modifiers?: readonly ResolvedStatusModifier[];
  };
  consumeStatus: CombatStepParameters['consumeStatus'];
  jumpTimeline: CombatStepParameters['jumpTimeline'];
  finishTimeline: CombatStepParameters['finishTimeline'];
  conditional: CombatStepParameters['conditional'];
  once: CombatStepParameters['once'];
  repeatEachTick: CombatStepParameters['repeatEachTick'];
  setContextFlag: CombatStepParameters['setContextFlag'];
  openComboWindow: CombatStepParameters['openComboWindow'];
  changeSkillSlot: CombatStepParameters['changeSkillSlot'];
  listenForCombatEvents: {
    responses: readonly {
      readonly key: string;
      readonly event: CombatEventTrigger;
      readonly condition?: CombatCondition;
      readonly sequence: ResolvedActionSequence;
    }[];
  };
}

type ResolvedCombatStepForKind<K extends CombatStepKind> = {
  readonly key?: string;
  /** 存档中的命中身份（放置时分配）；伤害回执凭它把伤害对应到具体命中点。 */
  readonly hitId?: string;
  readonly kind: K;
  readonly parameters: Readonly<ResolvedCombatStepParameters[K]>;
} & (K extends 'conditional'
  ? {
      readonly whenTrue: ResolvedActionSequence;
      readonly whenFalse?: ResolvedActionSequence;
    }
  : K extends 'once'
    ? { readonly body: ResolvedActionSequence }
    : K extends 'repeatEachTick'
      ? { readonly body: ResolvedActionSequence }
      : K extends 'forEachContextTarget'
        ? { readonly body: ResolvedActionSequence }
        : {});

/** 运行时可直接执行、按 kind 区分类型的单个步骤。 */
export type ResolvedCombatStep = {
  [K in CombatStepKind]: ResolvedCombatStepForKind<K>;
}[CombatStepKind];

/** 条件、once 与 Context 迭代由序列运行时解释，其余步骤交给操作链。 */
export type ResolvedCombatOperationStep = Exclude<
  ResolvedCombatStep,
  {
    kind:
      | 'conditional'
      | 'once'
      | 'repeatEachTick'
      | 'forEachContextTarget'
      | 'jumpTimeline'
      | 'finishTimeline';
  }
>;

/** 已解析且严格保持声明顺序的同步操作序列。 */
export interface ResolvedActionSequence {
  readonly steps: readonly ResolvedCombatStep[];
}

/** 构筑编译出的常驻被动程序；由战斗装配层启用，不进入时间轴技能集合。 */
export interface CompiledOperatorPassiveProgram {
  readonly key: string;
  readonly initialBlackboard: Readonly<Record<string, number>>;
  readonly enableSequence: ResolvedActionSequence;
}

/** 构筑启用的养成初始化程序；由战斗装配层执行一次，不伪装成被动技能。 */
export interface CompiledOperatorInitializationProgram {
  readonly key: string;
  readonly sequence: ResolvedActionSequence;
}

/** 技能释放时刻相对帧上的一个已编译调度项。 */
export interface CompiledTimelineAction {
  readonly startFrame: number;
  readonly endFrame?: number;
  readonly sequence: ResolvedActionSequence;
}

/** 等级已经展开的一项技能资源费用。 */
export interface CompiledSkillCost {
  readonly resource: CombatResource;
  readonly value: number;
}

/** 构筑启用后注册到整场战斗语义事件中心的养成事件程序。 */
export interface CompiledOperatorUpgradeEventProgram {
  readonly key: string;
  readonly event: UpgradeEvent;
  readonly initialBlackboard: Readonly<Record<string, number>>;
  readonly sequence: ResolvedActionSequence;
}

/** 只在当前技能程序及其派生操作链中参与伤害快照的构筑期属性修正。 */
export interface CompiledSkillStatModifiers {
  readonly criticalRate?: number;
  readonly damageToStaggeredEnemyIncrease?: number;
}

/** 供运行时技能实例使用的完整单等级程序。 */
export interface CompiledSkillProgram {
  readonly operatorId: string;
  /** 文档中对应的技能释放身份；缺失时表示不是从场景时间轴编译的单元测试程序。 */
  readonly castId?: string;
  readonly simulationInputs?: {
    readonly cameraToTargetSignedAngleDegrees?: number;
  };
  readonly skillGroupKey: string;
  readonly skillId: string;
  readonly sourceSkillId?: string;
  readonly skillType: SkillType;
  readonly skillLevel: number;
  /** 已按技能等级解析；每次释放复制到该运行实例的动作黑板。 */
  readonly initialBlackboard: Readonly<Record<string, number>>;
  /** 时间轴投影使用的技能块宽度，不参与技能生命周期和中断判断。 */
  readonly timelineBlockFrames: number;
  readonly cooldownFrames?: number;
  readonly costFrame?: number;
  readonly costs: readonly CompiledSkillCost[];
  readonly statModifiers?: CompiledSkillStatModifiers;
  readonly timelineActions: readonly CompiledTimelineAction[];
  /** 当前技能等级下实际引用到的能力实体闭包；支持子技能递归生成同一蓝图。 */
  readonly abilityEntityDefinitions?: Readonly<Record<string, ResolvedAbilityEntityDefinition>>;
}

/** 一个稳定技能组可在释放之间切换的已编译技能身份。 */
export interface CompiledSkillSlotGroup {
  readonly skillGroupKey: string;
  readonly baseSkillKey: string;
  readonly replacementSkillKeys: readonly string[];
}

/** 角色级首段连携入口的单等级编译结果；运行时不得再读取养成配置。 */
export interface CompiledComboSkillRegistration {
  readonly skillKey: string;
  readonly priority: ComboSkillPriority;
  readonly blackboard: Readonly<Record<string, number>>;
  readonly rules: readonly ComboSkillTriggerRule[];
}

export type { ElementalReaction, StatusModifierDefinition };
