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
  readonly calculation: 'standard' | 'breakingAttack' | 'definiteValue';
  readonly attackScale: GeneratedScalarSource;
  readonly calculationMultiplier: GeneratedScalarSource | null;
  readonly poiseValue: GeneratedScalarSource | null;
  /** 固定生命伤害使用的原生计算值；其他计算路径为 null。 */
  readonly definiteValue: GeneratedScalarSource | null;
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
  /** `ContextTarget` 读取来源实体时使用的上下文目标组键；其他来源通常为空。 */
  readonly buffSourceContextKey: string | null;
  /** 是否把本次施法身份传给新 Buff；不适用于能力实体时为 null。 */
  readonly inheritSourceSkillCastInfo: boolean | null;
  readonly blackboardAssignments: Readonly<Record<string, GeneratedScalarSource>>;
  readonly nestedCombatActions: readonly string[];
}

export interface GeneratedInflictionPayload {
  readonly element: 'heat' | 'cryo' | 'electric' | 'nature';
  readonly isExtra: boolean;
}

export interface GeneratedTimedInflictionSource extends GeneratedInflictionPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
}

export interface GeneratedTimedResourceGainSource extends GeneratedResourceGainPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  /** 非空时，同一动作实例只允许该黑板键从 0 变为 1 前的首次回能。 */
  readonly onceActionValueKey: string | null;
}

export interface GeneratedProjectileSkillTriggerSource {
  readonly event: 'hit' | 'block' | 'reach' | 'finish';
  readonly skillId: string;
}

export interface GeneratedProjectileTriggeredSkillSource {
  readonly launchFrame: number;
  /** 从根技能到当前投射物的分层原生动作顺序。 */
  readonly actionOrder: readonly number[];
  /** 暂定为0；后续接入 ProjectileData 飞行时间后替换。 */
  /** 单敌人必命中模型暂不计算距离、轨迹和范围，命中子技能与发射处于同一帧。 */
  readonly assumedTravelFrames: 0;
  readonly projectileId: string;
  readonly triggerEvent: GeneratedProjectileSkillTriggerSource['event'];
  readonly triggerSkillId: string;
  /** 主目标已被根技能标记、子技能只处理未标记目标时，在固定单敌人模型中排除该分支。 */
  readonly excludedByPrimaryTargetMarker: boolean;
  readonly sourceFile: string;
  readonly damageUnits: readonly GeneratedDamageUnitSource[];
  readonly directDamageHits: readonly GeneratedTimedDamageSource[];
  readonly conditionalActions: readonly GeneratedConditionalActionSource[];
  readonly auxiliaryActions: readonly GeneratedAuxiliaryActionSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  readonly inflictions: readonly GeneratedTimedInflictionSource[];
  /** 命中技能内仍可能影响战斗的原生行为；非空时不得作为纯表现投射物省略。 */
  readonly combatActions: readonly string[];
  /** 命中 SkillData 再次引用调用链中的同一技能时为真，避免静态生成无限递归。 */
  readonly cycleTruncated: boolean;
  readonly nestedProjectileTriggeredSkills: readonly GeneratedProjectileTriggeredSkillSource[];
  readonly abilityEntityHits: readonly GeneratedAbilityEntityHitSource[];
  readonly auraActions: readonly GeneratedAuraActionSource[];
}

export interface GeneratedProjectileLaunchSource extends GeneratedProjectileLaunchPayload {
  readonly launchFrame: number;
}

/** 固定周期动作中每次必然执行的同构伤害。 */
export interface GeneratedTimedIntervalDamageSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  readonly intervalFrames: number;
  readonly tickFrames: readonly number[];
  readonly damageActionIndex: number;
  readonly damageUnits: readonly GeneratedDamageUnitSource[];
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
  readonly intervalDamageHits: readonly GeneratedTimedIntervalDamageSource[];
  readonly conditionalActions: readonly GeneratedConditionalActionSource[];
  readonly inflictions: readonly GeneratedTimedInflictionSource[];
  readonly auxiliaryActions: readonly GeneratedAuxiliaryActionSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  /** 原始发射动作；没有命中子技能时仍保留在这里，不能据此推断为无战斗效果。 */
  readonly projectileLaunches: readonly GeneratedProjectileLaunchSource[];
  readonly projectileTriggeredSkills: readonly GeneratedProjectileTriggeredSkillSource[];
  readonly nestedAbilityEntityHits: readonly GeneratedAbilityEntityHitSource[];
  readonly combatActions: readonly string[];
  readonly cycleTruncated: boolean;
  /** 原生生成动作是否先把来源动作黑板复制给能力实体。 */
  readonly inheritsSourceBlackboard: boolean;
  readonly declaredBlackboard: readonly GeneratedDeclaredBlackboardValueSource[];
  readonly blackboardCalculations: readonly GeneratedBlackboardCalculationSource[];
  readonly blackboardMutations: readonly GeneratedBlackboardMutationSource[];
  readonly buffBlackboardReads: readonly GeneratedBuffBlackboardReadSource[];
  readonly buffFinishes: readonly GeneratedBuffFinishSource[];
  readonly auraActions: readonly GeneratedAuraActionSource[];
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
  /** Buff 生效期间注册的区域持续动作；仍需专用运行时消费。 */
  readonly auraActions: readonly GeneratedAuraActionSource[];
}

export interface GeneratedUnparsedBuffPayloadSource {
  readonly field:
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

/** 原生主控干员检查所解析的目标来源；目标组仅对 Context 来源有语义。 */
export interface GeneratedMainOperatorConditionSource {
  readonly targetSource: string;
  readonly targetGroupKey: string;
}

/** 原生生命值条件；阈值可以来自技能动作黑板。 */
export interface GeneratedHealthConditionSource {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly comparison: string;
  readonly isRatio: boolean;
  readonly value: GeneratedScalarSource;
}

/** 原生实体 GameplayTag 查询；与 Buff 身份和层数查询保持独立。 */
export interface GeneratedEntityTagConditionSource {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly tagQueryType: string;
  readonly tagIds: readonly number[];
}

/** 原生 TargetSettings 的审计投影；用于证明目标身份和距离折叠，而不是运行时选目标。 */
export interface GeneratedTargetReferenceSource {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly selectorOwner: string;
  readonly ownerContextKey: string;
  readonly centerType: string;
  readonly centerContextKey: string;
  readonly centerToGround: boolean;
  readonly target: string;
  readonly targetContextKey: string;
  readonly enableAdvancedDirection: boolean;
  readonly selectorDirection: string;
  readonly finderType: string | null;
  readonly validatorTypes: readonly string[];
  readonly postProcessorTypes: readonly string[];
}

export interface GeneratedVector3Source {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface GeneratedAuraShapeSource {
  readonly shapeType: string;
  readonly rotationOffset: GeneratedVector3Source;
  readonly useExtentKeys: boolean;
  readonly extent: GeneratedVector3Source;
  readonly extentKeys: readonly [string, string, string];
  readonly useCenterKeys: boolean;
  readonly center: GeneratedVector3Source;
  readonly centerKeys: readonly [string, string, string];
  readonly height: number;
  readonly heightKey: string;
  readonly radius: number;
  readonly radiusKey: string;
}

export interface GeneratedAuraTargetFilterSource {
  readonly checkAlive: boolean;
  readonly autoSetTargetFaction: boolean;
  readonly factionTarget: string;
  readonly factionTargetType: string | number;
  readonly filterObjectType: boolean;
  readonly objectType: string;
  readonly filterSlot: boolean;
  readonly slotIndex: number;
  readonly filterGameplayTag: boolean;
  readonly tagQueryType: string;
  readonly tagIds: readonly number[];
}

/** 区域持续动作的审计事实；生命周期闭环前不得直接近似成一次 Buff 应用。 */
export interface GeneratedAuraActionSource {
  readonly startFrame: number | null;
  readonly endFrame: number | null;
  readonly actionIndex: number;
  readonly sourceFile: string;
  readonly activationSource: 'timeline' | 'buffEvent' | 'abilityEvent';
  readonly activationEvent: string | null;
  readonly actionPath: readonly string[];
  readonly priorityLevel: string;
  readonly priorityOffset: number;
  readonly debugName: string;
  readonly auraType: string;
  readonly root: GeneratedTargetReferenceSource;
  readonly fixedWhenStart: boolean;
  readonly shape: GeneratedAuraShapeSource;
  readonly excludeColliderOptions: number;
  readonly targetObjectType: string | number;
  readonly targetFilter: GeneratedAuraTargetFilterSource;
  readonly excludeOwner: boolean;
  readonly includeUnmarkable: boolean;
  readonly limitInfluenceCountPerTarget: boolean;
  readonly maxInfluenceCountPerTarget: number;
  readonly buffSource: string;
  readonly buffs: readonly GeneratedBuffApplicationEntryPayload[];
  readonly overrideBuffIconDuration: boolean;
  readonly buffIconDurationSourceType: string;
  readonly buffIconDurationTimedMarkerId: string;
  readonly inheritSourceSkillCastId: boolean;
  readonly actionInAuraOnlyMainOperator: boolean;
  readonly actionInAuraOnlyGuard: boolean;
  readonly actionInAuraTypes: readonly string[];
  readonly actionWhenExitAuraOnlyMainOperator: boolean;
  readonly actionWhenExitAuraOnlyGuard: boolean;
  readonly actionWhenExitAuraTypes: readonly string[];
  readonly nestedCombatActions: readonly string[];
}

export interface GeneratedTargetIdentityConditionSource {
  readonly first: GeneratedTargetReferenceSource;
  readonly second: GeneratedTargetReferenceSource;
}

/** 原生距离条件使用三维距离；lessThan=true 的实际边界为小于等于。 */
export interface GeneratedDistanceConditionSource {
  readonly source: GeneratedTargetReferenceSource;
  readonly target: GeneratedTargetReferenceSource;
  readonly distance: number;
  readonly lessThan: boolean;
  readonly includeTargetRadius: boolean;
  readonly containsHittableObject: boolean;
}

/** 当前技能实例是否已经对战斗目标输出过伤害；该原生条件没有额外配置字段。 */
export type GeneratedSkillHasHitConditionSource = Readonly<Record<string, never>>;

export interface GeneratedConditionSource {
  readonly sourceType: string;
  readonly supported: boolean;
  readonly comparison: string | null;
  readonly left: GeneratedScalarSource | null;
  readonly right: GeneratedScalarSource | null;
  readonly skillTypes: readonly string[];
  readonly entityCount?: GeneratedEntityCountConditionSource;
  readonly buffStack?: GeneratedBuffStackConditionSource;
  readonly health?: GeneratedHealthConditionSource;
  readonly mainOperator?: GeneratedMainOperatorConditionSource;
  readonly targetIdentity?: GeneratedTargetIdentityConditionSource;
  readonly distance?: GeneratedDistanceConditionSource;
  readonly entityTag?: GeneratedEntityTagConditionSource;
  readonly skillHasHit?: GeneratedSkillHasHitConditionSource;
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
  /** 固定间隔动作会在多个帧重复执行同一条件树；普通条件仅含 startFrame。 */
  readonly executionFrames?: readonly number[];
  /** 已由解析层提升为确定子技能并进入全局调度的生成动作。 */
  readonly projectedAbilityEntitySpawns?: readonly GeneratedAbilityEntitySpawnPayload[];
  /** 已由解析层提升为确定命中子技能并进入全局调度的投射物。 */
  readonly projectedProjectileLaunches?: readonly GeneratedConditionalProjectileProjection[];
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
  /** `ContextTarget` 读取来源实体时使用的上下文目标组键。 */
  readonly buffSourceContextKey: string;
  /** 是否把当前技能施法身份复制给新 Buff。 */
  readonly inheritSourceSkillCastInfo: boolean;
}

/** 技能动作创建的短生命周期标记；身份和持续时间均来自原生动作。 */
export interface GeneratedTimedMarkerApplicationPayload {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly markerId: string;
  readonly duration: GeneratedScalarSource;
  readonly autoFinishByAction: boolean;
  readonly useTimeDilationDt: boolean;
}

/** 原生全局冷却写入；正式编译时复用角色定时标记。 */
export interface GeneratedGlobalCooldownApplicationPayload {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly buffId: string;
  readonly duration: GeneratedScalarSource;
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
  /** 仅保留原生布尔开关已启用的事件；关闭事件旁残留的 Skill ID 不具有触发语义。 */
  readonly skillTriggers: readonly GeneratedProjectileSkillTriggerSource[];
  readonly assignBlackboard: boolean;
  readonly entityBlackboardAssignments: readonly GeneratedEntityBlackboardAssignmentSource[];
}

export interface GeneratedConditionalProjectileProjection {
  readonly launch: GeneratedProjectileLaunchPayload;
  readonly triggeredSkills: readonly GeneratedProjectileTriggeredSkillSource[];
}

export interface GeneratedAbilityEntitySpawnPayload {
  readonly abilityEntityId: string;
  readonly skillId: string | null;
  readonly entityBlackboardAssignments: readonly GeneratedEntityBlackboardAssignmentSource[];
  readonly assignBlackboard: boolean;
}

/** 条件分支中的一个直接子动作；嵌套条件保持在原始动作位置。 */
export interface GeneratedConditionalBranchActionSource {
  readonly actionType: string;
  /** 在所属 succeedActions/failActions 原始 actionData 中的下标。 */
  readonly actionIndex: number;
  readonly nestedCondition?: GeneratedConditionalActionSource;
  /** 同一个原生动作实例生命周期内共享的 DoOnceAction 身份。 */
  readonly onceScopeKey?: string;
  readonly onceActions?: readonly GeneratedConditionalBranchActionSource[];
  readonly blackboardCalculation?: GeneratedBlackboardCalculationPayload;
  readonly blackboardMutation?: GeneratedBlackboardMutationPayload;
  readonly buffBlackboardRead?: GeneratedBuffBlackboardReadPayload;
  readonly buffFinish?: GeneratedBuffFinishPayload;
  readonly buffStackRead?: GeneratedBuffStackReadPayload;
  readonly buffApplication?: GeneratedBuffApplicationPayload;
  readonly timedMarkerApplication?: GeneratedTimedMarkerApplicationPayload;
  readonly globalCooldownApplication?: GeneratedGlobalCooldownApplicationPayload;
  readonly resourceGain?: GeneratedResourceGainPayload;
  readonly infliction?: GeneratedInflictionPayload;
  readonly projectileLaunch?: GeneratedProjectileLaunchPayload;
  readonly projectileTriggeredSkills?: readonly GeneratedProjectileTriggeredSkillSource[];
  readonly abilityEntitySpawn?: GeneratedAbilityEntitySpawnPayload;
  /** 仅当所属条件分支被选中时才会执行、且子调用中含 Aura 的能力实体。 */
  readonly auraAbilityEntityHits?: readonly GeneratedAbilityEntityHitSource[];
  readonly damageUnits?: readonly GeneratedDamageUnitSource[];
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

export interface GeneratedTargetGroupInputSource {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly finderType: string | null;
  readonly finderFactionTarget: string | null;
  readonly finderTargetObjectType: string | null;
  readonly finderCheckAlive: boolean | null;
  readonly validatorTypes: readonly string[];
  readonly postProcessorTypes: readonly string[];
}

/** 命名目标组的一次原生写入；它只保留来源证据，不代表已归约为单敌人语义。 */
export interface GeneratedTargetGroupWriteSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  readonly actionPath: readonly string[];
  readonly targetGroupKey: string;
  readonly producerType: 'FindTargetAction' | 'ContinuousFindTargetAction' | 'MergeTargetAction';
  readonly finderType: string | null;
  readonly finderFactionTarget: string | null;
  readonly finderTargetObjectType: string | null;
  readonly finderCheckAlive: boolean | null;
  readonly validatorTypes: readonly string[];
  readonly postProcessorTypes: readonly string[];
  readonly inputTargets: readonly GeneratedTargetGroupInputSource[];
  readonly intervalSeconds: number | null;
}

export interface GeneratedBuffEventActionSource {
  /** 事件由 Buff 生命周期还是 Buff 宿主实体发出。 */
  readonly eventSource: 'buff' | 'ability';
  readonly event: string;
  /** 启用动作按原生 SequenceAction 的执行顺序排列，不能用 combatActions 代替。 */
  readonly orderedActionTypes: readonly string[];
  readonly combatActions: readonly string[];
  readonly damageUnits: readonly GeneratedDamageUnitSource[];
  /** 事件顶层按顺序直接创建的 Buff；条件分支内的创建动作由条件树保存。 */
  readonly buffApplications: readonly GeneratedEventBuffApplicationSource[];
  readonly createdBuffIds: readonly string[];
}

export interface GeneratedEventBuffApplicationSource {
  readonly actionIndex: number;
  readonly payload: GeneratedBuffApplicationPayload;
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
  readonly projectileTriggeredSkills: readonly GeneratedProjectileTriggeredSkillSource[];
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
  /** 条件读取命名目标组前，用于证明该组由哪个动作和分支产生。 */
  readonly targetGroupWrites: readonly GeneratedTargetGroupWriteSource[];
  /** 原生区域持续动作；当前保留完整审计结构，由后续专用运行时消费。 */
  readonly auraActions: readonly GeneratedAuraActionSource[];
  /** 尚未转换成 Next 语义步骤的战斗行为；非空时不能把该技能视为生成完成。 */
  readonly unresolvedCombatActions: readonly string[];
}

export interface GeneratedOperatorSource {
  readonly slug: string;
  /** 所有技能直接引用及其传递创建依赖组成的干员级去重 Buff 定义目录。 */
  readonly buffDefinitions: readonly GeneratedBuffDefinitionSource[];
  readonly skills: readonly GeneratedSkillSource[];
}
