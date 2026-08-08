/**
 * 解包数据到正式干员 DSL 之间的可审计中间层。
 * 这里保存原始时间窗口和行为类型；未完成语义转换的行为不得直接进入战斗模拟。
 */
import type { SkillType } from '../../../core/game-data/operatorDefinition';

export interface GeneratedTimelineActionSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionTypes: readonly string[];
}

export interface GeneratedScalarSource {
  readonly value: number;
  readonly blackboardKey: string | null;
  /** 按技能等级排列的解析值；null 表示该标量不是等级黑板引用或仍未闭环。 */
  readonly levelValues: readonly number[] | null;
}

export interface GeneratedSkillPatchSource {
  readonly levels: readonly number[];
  readonly blackboard: Readonly<Record<string, readonly number[]>>;
  readonly cooldownSeconds: readonly number[];
  readonly costTypes: readonly number[];
  readonly costValues: readonly number[];
}

export interface GeneratedDamageUnitSource {
  readonly damageType: string;
  readonly attributeType: string;
  readonly calculation: 'standard' | 'breakingAttack';
  readonly attackScale: GeneratedScalarSource;
  readonly calculationMultiplier: GeneratedScalarSource | null;
  readonly poiseValue: GeneratedScalarSource | null;
}

export interface GeneratedTimedDamageSource {
  readonly startFrame: number;
  readonly endFrame: number;
  /** 同一原生 TimelineAction 展开后的动作顺序，用于维持同帧结算次序。 */
  readonly actionIndex: number;
  readonly damageUnits: readonly GeneratedDamageUnitSource[];
  /** 同一目标短时命中标记的门控；标记存在时原生 Sequence 会在伤害前短路。 */
  readonly timedMarkerGate: GeneratedTimedMarkerGateSource | null;
}

export interface GeneratedTimedMarkerGateSource {
  readonly markerBlackboardKey: string;
  readonly returnTrueIfNotExists: boolean;
  readonly durationSeconds: number;
}

export interface GeneratedEntityBlackboardAssignmentSource {
  readonly targetKey: string;
  readonly valueType: 'String' | 'Numeric';
  readonly numericValue: number;
  readonly stringValue: string;
  readonly useDirectValue: boolean;
  readonly inputValueKey: string;
}

export type GeneratedAuxiliaryClassification =
  | 'incomingDamageProtection'
  | 'inputLock'
  | 'skillCostUltimateEnergyGain'
  | 'tutorialMarker'
  | 'electrificationReaction'
  | 'nonCombatAbilityEntity'
  | null;

export interface GeneratedAuxiliaryActionSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  readonly actionType: 'CreateBuffAction' | 'SpawnAbilityEntity';
  readonly sourceId: string;
  /** 原生辅助行为的已确认语义；是否输出为步骤由具体分类决定，null 会阻止正式生成。 */
  readonly classification: GeneratedAuxiliaryClassification;
  /** CreateBuffAction 的原生目标来源；不适用于能力实体时为空字符串。 */
  readonly targetSource: string;
  /** Context 等目标来源使用的原生目标组；空字符串也是有意义的配置值。 */
  readonly targetGroupKey: string;
  /** 每个目标上的创建次数；不适用于能力实体时为 null。 */
  readonly count: GeneratedScalarSource | null;
  /** 新 Buff 的原生来源解析方式；不适用于能力实体时为 null。 */
  readonly buffSource: string | null;
  /** 是否把本次施法身份传给新 Buff；不适用于能力实体时为 null。 */
  readonly inheritSourceSkillCastInfo: boolean | null;
  readonly blackboardAssignments: Readonly<Record<string, GeneratedScalarSource>>;
  readonly nestedCombatActions: readonly string[];
}

export interface GeneratedTimedInflictionSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  readonly element: 'heat' | 'cryo' | 'electric' | 'nature';
  readonly isExtra: boolean;
}

export interface GeneratedTimedResourceGainSource extends GeneratedResourceGainPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  /** 非空时，同一动作实例只允许该黑板键从 0 变为 1 前的首次回能。 */
  readonly onceActionValueKey: string | null;
}

export interface GeneratedProjectileHitSource {
  readonly launchFrame: number;
  /** 从根技能到当前投射物的分层原生动作顺序。 */
  readonly actionOrder: readonly number[];
  /** 暂定为0；后续接入 ProjectileData 飞行时间后替换。 */
  /** 单敌人必命中模型暂不计算距离、轨迹和范围，命中子技能与发射处于同一帧。 */
  readonly assumedTravelFrames: 0;
  readonly projectileId: string;
  readonly hitSkillId: string;
  readonly sourceFile: string;
  readonly damageUnits: readonly GeneratedDamageUnitSource[];
  readonly directDamageHits: readonly GeneratedTimedDamageSource[];
  readonly conditionalActions: readonly GeneratedConditionalActionSource[];
  readonly auxiliaryActions: readonly GeneratedAuxiliaryActionSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  /** 命中技能内仍可能影响战斗的原生行为；非空时不得作为纯表现投射物省略。 */
  readonly combatActions: readonly string[];
  /** 命中 SkillData 再次引用调用链中的同一技能时为真，避免静态生成无限递归。 */
  readonly cycleTruncated: boolean;
  readonly nestedProjectileHits: readonly GeneratedProjectileHitSource[];
}

export interface GeneratedProjectileLaunchSource extends GeneratedProjectileLaunchPayload {
  readonly launchFrame: number;
}

/** SpawnAbilityEntity 引用的子 SkillData；其内部时间均相对 spawnFrame 记录。 */
export interface GeneratedAbilityEntityHitSource {
  readonly spawnFrame: number;
  /** 从根技能到当前能力实体的分层原生动作顺序。 */
  readonly actionOrder: readonly number[];
  readonly abilityEntityId: string;
  readonly skillId: string;
  readonly sourceFile: string;
  /** 父动作在生成实体时写入的实例黑板，用于解析子技能中的动态标记等身份。 */
  readonly entityBlackboardAssignments: readonly GeneratedEntityBlackboardAssignmentSource[];
  readonly directDamageHits: readonly GeneratedTimedDamageSource[];
  readonly conditionalActions: readonly GeneratedConditionalActionSource[];
  readonly inflictions: readonly GeneratedTimedInflictionSource[];
  readonly auxiliaryActions: readonly GeneratedAuxiliaryActionSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  /** 原始发射动作；没有命中子技能时仍保留在这里，不能据此推断为无战斗效果。 */
  readonly projectileLaunches: readonly GeneratedProjectileLaunchSource[];
  readonly projectileHits: readonly GeneratedProjectileHitSource[];
  readonly nestedAbilityEntityHits: readonly GeneratedAbilityEntityHitSource[];
  readonly combatActions: readonly string[];
  readonly cycleTruncated: boolean;
}

/** BuffData 自身的计时与叠加事实。 */
export interface GeneratedBuffLifecycleSource {
  readonly lifeType: 'Limited' | 'Infinity';
  readonly duration: GeneratedScalarSource;
  readonly triggerInterval: GeneratedScalarSource;
  readonly waitFirstTriggerInterval: boolean;
  readonly maxTriggerCount: GeneratedScalarSource;
  readonly stackingIdentifierType: 'Id' | 'StackingKey';
  readonly stackingType:
    | 'Unlimited'
    | 'HighPriority'
    | 'Stack'
    | 'Enhance'
    | 'Refresh'
    | 'Extend'
    | 'Modify'
    | 'Unique'
    | 'EnhanceAndRefresh'
    | 'OverwriteDuration'
    | 'EnhanceAndOverwriteDuration'
    | 'HighPriorityWithMaxStack';
  readonly stackingKey: string;
  readonly priority: GeneratedScalarSource;
  readonly negatePriority: boolean;
  readonly maxStackCount: GeneratedScalarSource;
  readonly hasStackEffects: boolean;
}

/** 与应用位置解耦的 Buff 定义；包含由直接依赖递归发现的事件依赖，并以 buffId 去重。 */
export interface GeneratedBuffDefinitionSource {
  readonly buffId: string;
  readonly sourceFile: string;
  readonly sourceAvailable: boolean;
  readonly lifecycle: GeneratedBuffLifecycleSource | null;
  readonly blackboard: readonly GeneratedDeclaredBlackboardValueSource[];
  /** 原生有符号 int32 GameplayTag ID，不得与 DamageTag 混用。 */
  readonly applyTagIds: readonly number[];
  /** Buff 到期但被 ExtendBuffAction 阻止结束后，临时挂到所属实体的标签。 */
  readonly extendTagIds: readonly number[];
  /** Buff 启用期间注册到原生八槽属性公式的修正；目标属性名仍保留原生身份。 */
  readonly attributeModifiers: readonly GeneratedBuffAttributeModifierSource[];
  readonly directDamageHits: readonly GeneratedTimedDamageSource[];
  readonly conditionalActions: readonly GeneratedConditionalActionSource[];
  readonly blackboardCalculations: readonly GeneratedBlackboardCalculationSource[];
  readonly blackboardMutations: readonly GeneratedBlackboardMutationSource[];
  readonly buffBlackboardReads: readonly GeneratedBuffBlackboardReadSource[];
  readonly buffFinishes: readonly GeneratedBuffFinishSource[];
  readonly eventActions: readonly GeneratedBuffEventActionSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  readonly combatActions: readonly string[];
  /** 数据源中存在但生成器尚未结构化解析的 Buff 根载荷；非空时不得视为完整行为定义。 */
  readonly unparsedPayloads: readonly GeneratedUnparsedBuffPayloadSource[];
}

export interface GeneratedUnparsedBuffPayloadSource {
  readonly field:
    | 'abilityEventAction'
    | 'damageModifier'
    | 'globalModifier'
    | 'healModifier'
    | 'igniteEventAction'
    | 'poiseModifier'
    | 'shieldConfigs';
  readonly entryCount: number;
}

export interface GeneratedBuffAttributeModifierSource {
  readonly targetType: 'Specific' | 'Main' | 'Sub' | 'All';
  readonly attributeType: string;
  readonly slot:
    | 'Addition'
    | 'Multiplier'
    | 'FinalAddition'
    | 'FinalMultiplier'
    | 'BaseAddition'
    | 'BaseMultiplier'
    | 'BaseFinalAddition'
    | 'BaseFinalMultiplier';
  readonly value: GeneratedScalarSource;
}

/** 原始目标集合数量检查；在单敌人模型中仍需判断是否可以安全消去。 */
export interface GeneratedEntityCountConditionSource {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly minimumCount: number;
  readonly comparison: string;
  readonly containsHittableTarget: boolean;
  readonly excludeDeadEntity: boolean;
  readonly storeKey: string;
}

/** 原始 Buff 层数检查；`BuffCount` 表示匹配 Buff 的强化层数总和。 */
export interface GeneratedBuffStackConditionSource {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly buffCheckType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: string;
  readonly buffTagIds: readonly number[];
  readonly countType: string;
  readonly comparison: string;
  readonly value: GeneratedScalarSource;
  readonly limitSkillCastId: boolean;
}

export interface GeneratedConditionSource {
  readonly sourceType: string;
  readonly supported: boolean;
  readonly comparison: string | null;
  readonly left: GeneratedScalarSource | null;
  readonly right: GeneratedScalarSource | null;
  readonly skillTypes: readonly string[];
  readonly entityCount?: GeneratedEntityCountConditionSource;
  readonly buffStack?: GeneratedBuffStackConditionSource;
}

export interface GeneratedConditionalActionSource {
  readonly startFrame: number;
  readonly endFrame: number;
  /** 条件根在所属原生时间轴中的动作顺序。 */
  readonly actionIndex: number;
  /** 从 timeline 下标开始的原始对象路径，用于回查嵌套分支。 */
  readonly actionPath: readonly string[];
  readonly conditions: readonly GeneratedConditionSource[];
  readonly succeedActions: readonly GeneratedConditionalBranchActionSource[];
  readonly failActions: readonly GeneratedConditionalBranchActionSource[];
}

export interface GeneratedBlackboardCalculationPayload {
  readonly key: string;
  readonly operation: string;
  readonly left: GeneratedScalarSource;
  readonly right: GeneratedScalarSource;
}

export interface GeneratedBlackboardMutationPayload {
  readonly key: string;
  readonly operation: string;
  readonly value: GeneratedScalarSource;
}

export interface GeneratedBuffBlackboardReadPayload {
  readonly outputKey: string;
  readonly desiredKey: string;
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly buffCheckType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
  /** 原始有符号 int32 标签；进入运行时前须转为 GameplayTagId，不得与 DamageTag 混用。 */
  readonly buffTagIds: readonly number[];
}

export interface GeneratedBuffFinishPayload {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly buffCheckType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
  readonly buffTagIds: readonly number[];
  readonly finishAll: boolean;
  readonly limitSource: boolean;
  readonly isFinishedEarly: boolean;
  readonly isAbsorbed: boolean;
}

export interface GeneratedBuffStackReadPayload {
  readonly outputKey: string;
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly buffCheckType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
  readonly buffTagIds: readonly number[];
  readonly countType: string;
  readonly limitSkillCastId: boolean;
}

export interface GeneratedBuffApplicationEntryPayload {
  readonly buffId: string;
  readonly classification: GeneratedAuxiliaryClassification;
  readonly blackboardAssignments: Readonly<Record<string, GeneratedScalarSource>>;
}

export interface GeneratedBuffApplicationPayload {
  readonly buffs: readonly GeneratedBuffApplicationEntryPayload[];
  /** 创建动作的原生目标来源；与每个 Buff 条目共享。 */
  readonly targetSource: string;
  /** Context 等目标来源使用的原生目标组。 */
  readonly targetGroupKey: string;
  /** 每个目标上的创建次数。 */
  readonly count: GeneratedScalarSource;
  /** 新 Buff 的原生来源解析方式。 */
  readonly buffSource: string;
  /** 是否把当前技能施法身份复制给新 Buff。 */
  readonly inheritSourceSkillCastInfo: boolean;
}

export interface GeneratedResourceGainPayload {
  readonly resource: 'sp' | 'ultimateEnergy';
  readonly amount: GeneratedScalarSource;
  readonly coefficient: GeneratedScalarSource;
  /** 仅 SP 使用；分别对应原生 Gain 和 Return。 */
  readonly spGainKind: 'gain' | 'refund' | null;
  /** 仅 SP 使用，决定普攻、重击或技能来源倍率。 */
  readonly spGainSource: 'default' | 'normalAttack' | 'powerAttack' | 'skill' | null;
  /** 原生 atbOnlyMainChar；当前仅由玩家主动攻击模型满足。 */
  readonly onlyMainOperator: boolean;
  readonly isPercentValue: boolean;
  readonly useUltimateRecoveryTag: boolean;
  readonly ultimateRecoveryTagId: number;
  readonly ignoreUltimateGainScalar: boolean;
}

export interface GeneratedProjectileLaunchPayload {
  readonly projectileId: string;
  readonly castSkillOnHit: boolean;
  readonly hitSkillId: string | null;
}

export interface GeneratedAbilityEntitySpawnPayload {
  readonly abilityEntityId: string;
  readonly skillId: string | null;
  readonly entityBlackboardAssignments: readonly GeneratedEntityBlackboardAssignmentSource[];
}

/** 条件分支中的一个直接子动作；嵌套条件保持在原始动作位置。 */
export interface GeneratedConditionalBranchActionSource {
  readonly actionType: string;
  /** 在所属 succeedActions/failActions 原始 actionData 中的下标。 */
  readonly actionIndex: number;
  readonly nestedCondition?: GeneratedConditionalActionSource;
  readonly blackboardCalculation?: GeneratedBlackboardCalculationPayload;
  readonly blackboardMutation?: GeneratedBlackboardMutationPayload;
  readonly buffBlackboardRead?: GeneratedBuffBlackboardReadPayload;
  readonly buffFinish?: GeneratedBuffFinishPayload;
  readonly buffStackRead?: GeneratedBuffStackReadPayload;
  readonly buffApplication?: GeneratedBuffApplicationPayload;
  readonly resourceGain?: GeneratedResourceGainPayload;
  readonly projectileLaunch?: GeneratedProjectileLaunchPayload;
  readonly abilityEntitySpawn?: GeneratedAbilityEntitySpawnPayload;
}

export interface GeneratedBlackboardCalculationSource
  extends GeneratedBlackboardCalculationPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
}

/** 直接修改当前动作黑板的原生运行时操作。 */
export interface GeneratedBlackboardMutationSource extends GeneratedBlackboardMutationPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
}

/** 从目标 Buff 实例黑板读取数值并写入当前动作黑板。 */
export interface GeneratedBuffBlackboardReadSource extends GeneratedBuffBlackboardReadPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
}

/** 原生 FinishBuffAdvanced 的可审计配置；正式 DSL 只接收已闭环的查询子集。 */
export interface GeneratedBuffFinishSource extends GeneratedBuffFinishPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
}

/** 在原生时间区间内禁止结束开始时匹配到的 Buff 实例。 */
export interface GeneratedBuffHoldSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly buffCheckType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
  readonly buffTagIds: readonly number[];
}

/** 黑板键在当前技能中的可追溯来源；外部输入不得由生成器猜值。 */
export interface GeneratedBlackboardKeyProvenanceSource {
  readonly key: string;
  readonly declaredInSkill: boolean;
  readonly suppliedByPatch: boolean;
  readonly calculatedLocally: boolean;
  readonly mutatedLocally: boolean;
  readonly readFromBuff: boolean;
  readonly externalRuntimeInput: boolean;
}

export interface GeneratedDeclaredBlackboardValueSource {
  readonly key: string;
  readonly value: number;
  readonly isDynamic: boolean;
}

export interface GeneratedBuffEventActionSource {
  readonly event: string;
  readonly combatActions: readonly string[];
  readonly damageUnits: readonly GeneratedDamageUnitSource[];
  readonly createdBuffIds: readonly string[];
}

export interface GeneratedSkillSource {
  readonly key: string;
  readonly skillId: string;
  readonly skillType: SkillType;
  readonly sourceFile: string;
  readonly timelineBlockFrames: number;
  readonly blockBoundarySource: 'exclusiveFrame+1' | 'AllowNextSkillAction.startFrame';
  readonly cooldownSeconds: number;
  readonly costFrame: number;
  readonly costType: string;
  readonly costValue: number;
  readonly offsetRecordFrame: number;
  readonly allowNextWindows: readonly {
    readonly startFrame: number;
    readonly endFrame: number;
    readonly skillIds: readonly string[];
  }[];
  readonly inputCacheWindows: readonly {
    readonly startFrame: number;
    readonly endFrame: number;
    readonly mappings: readonly Readonly<Record<string, unknown>>[];
  }[];
  readonly timelineActions: readonly GeneratedTimelineActionSource[];
  readonly directDamageHits: readonly GeneratedTimedDamageSource[];
  readonly conditionalActions: readonly GeneratedConditionalActionSource[];
  readonly inflictions: readonly GeneratedTimedInflictionSource[];
  readonly auxiliaryActions: readonly GeneratedAuxiliaryActionSource[];
  readonly blackboardCalculations: readonly GeneratedBlackboardCalculationSource[];
  readonly blackboardMutations: readonly GeneratedBlackboardMutationSource[];
  readonly buffBlackboardReads: readonly GeneratedBuffBlackboardReadSource[];
  readonly buffFinishes: readonly GeneratedBuffFinishSource[];
  readonly buffHolds: readonly GeneratedBuffHoldSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  readonly projectileLaunches: readonly GeneratedProjectileLaunchSource[];
  readonly projectileHits: readonly GeneratedProjectileHitSource[];
  readonly abilityEntityHits: readonly GeneratedAbilityEntityHitSource[];
  /** 整棵技能动作树直接引用的 Buff ID；条件分支只进入清单，不会被提升成无条件应用。 */
  readonly referencedBuffIds: readonly string[];
  /** 与本技能 SkillData 对应的逐等级补丁数据。 */
  readonly patch: GeneratedSkillPatchSource;
  /** SkillData 声明的黑板默认值；同名 SkillPatch 值在编译时覆盖它。 */
  readonly declaredBlackboard: readonly GeneratedDeclaredBlackboardValueSource[];
  /** 需要由 SkillPatch、Buff 或运行时上下文赋值后才能闭环的原生黑板键。 */
  readonly blackboardKeys: readonly string[];
  readonly blackboardProvenance: readonly GeneratedBlackboardKeyProvenanceSource[];
  /** 尚未转换成 Next 语义步骤的战斗行为；非空时不能把该技能视为生成完成。 */
  readonly unresolvedCombatActions: readonly string[];
}

export interface GeneratedOperatorSource {
  readonly slug: string;
  /** 所有技能直接引用及其传递创建依赖组成的干员级去重 Buff 定义目录。 */
  readonly buffDefinitions: readonly GeneratedBuffDefinitionSource[];
  readonly skills: readonly GeneratedSkillSource[];
}
