"""生成器解析层与审计层共享的不可变中间数据模型。

本模块只定义数据形状，不读取文件、不解释游戏语义，也不生成 DSL。
解析器、编译器和全员审计都依赖这里，禁止反向导入主生成脚本。
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal

__all__ = [
    "TimelineActionSource",
    "ScalarSource",
    "SkillPatchSource",
    "DamageUnitSource",
    "TimedDamageSource",
    "TimedMarkerGateSource",
    "EntityBlackboardAssignmentSource",
    "AuxiliaryActionSource",
    "InflictionPayload",
    "InterruptPayload",
    "TimedInflictionSource",
    "TimedResourceGainSource",
    "AbilityEntityTimeDilationTargetSource",
    "TimedTimeDilationSource",
    "ProjectileSkillTriggerSource",
    "ProjectileTriggeredSkillSource",
    "ProjectileLaunchSource",
    "TimedIntervalDamageSource",
    "AbilityEntityHitSource",
    "ResolvedDamageHitSource",
    "ResolvedScheduleItemSource",
    "BuffLifecycleSource",
    "BuffDefinitionSource",
    "UnparsedBuffPayloadSource",
    "BuffAttributeModifierSource",
    "BuffDamageModifierSource",
    "BuffDamageNumberComparisonSource",
    "BuffDamageScaleProcessorSource",
    "BuffEventActionSource",
    "EventBuffApplicationSource",
    "SkillEventActionSequenceSource",
    "SkillEventListenerSource",
    "EntityCountConditionSource",
    "BuffStackConditionSource",
    "HealthConditionSource",
    "PoiseConditionSource",
    "MainOperatorConditionSource",
    "EnemyRankConditionSource",
    "TargetReferenceSource",
    "TargetIdentityConditionSource",
    "DistanceConditionSource",
    "TimedMarkerConditionSource",
    "GlobalCooldownConditionSource",
    "SkillHasHitConditionSource",
    "HealTagConditionSource",
    "OverHealConditionSource",
    "ConditionSource",
    "EntityTagConditionSource",
    "BlackboardCalculationPayload",
    "BlackboardMutationPayload",
    "BuffBlackboardReadPayload",
    "BuffFinishPayload",
    "BuffHoldSource",
    "BuffStackReadPayload",
    "BuffApplicationEntryPayload",
    "BuffApplicationPayload",
    "Vector3Source",
    "AuraShapeSource",
    "AuraTargetFilterSource",
    "AuraActionSource",
    "TimedMarkerApplicationPayload",
    "GlobalCooldownApplicationPayload",
    "ResourceGainPayload",
    "ProjectileLaunchPayload",
    "ConditionalProjectileProjection",
    "AbilityEntitySpawnPayload",
    "ConditionalBranchActionSource",
    "StoreCurrentTimelineFrameActionSource",
    "StoreCurrentTimelineFramePayload",
    "ConditionalTimeDilationActionSource",
    "TimelineJumpBranchActionSource",
    "ConditionalActionSource",
    "SequenceGuardActionSource",
    "SwitchActionSource",
    "DoOnceActionSource",
    "UnconditionalActionSource",
    "EveryFrameActionSource",
    "BlackboardCalculationSource",
    "BlackboardMutationSource",
    "BuffBlackboardReadSource",
    "BuffFinishSource",
    "BlackboardKeyProvenanceSource",
    "DeclaredBlackboardValueSource",
    "TargetGroupInputSource",
    "TargetGroupWriteSource",
    "TimedKeywordActionSource",
    "SkillSource",
    "ResolvedScheduleItemType",
]

@dataclass(frozen=True)
class TimelineActionSource:
    startFrame: int
    endFrame: int
    actionTypes: tuple[str, ...]


@dataclass(frozen=True)
class ScalarSource:
    value: float
    blackboardKey: str | None
    levelValues: tuple[float, ...] | None


@dataclass(frozen=True)
class SkillPatchSource:
    levels: tuple[int, ...]
    blackboard: dict[str, tuple[float, ...]]
    cooldownSeconds: tuple[float, ...]
    costTypes: tuple[int, ...]
    costValues: tuple[float, ...]


@dataclass(frozen=True)
class DamageUnitSource:
    damageType: str
    attributeType: str
    calculation: str
    attackScale: ScalarSource
    calculationMultiplier: ScalarSource | None
    poiseValue: ScalarSource | None
    definiteValue: ScalarSource | None = None
    # 原生 DamageDecorateMask 完整位值；正式 DSL 尚未消费的位也必须保留。
    damageDecorateMask: int = 0


@dataclass(frozen=True)
class TimedDamageSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    damageUnits: tuple[DamageUnitSource, ...]
    timedMarkerGate: "TimedMarkerGateSource | None" = None
    sequenceIndex: int = -1


@dataclass(frozen=True)
class TimedMarkerGateSource:
    """同一目标上的短时命中标记；条件失败时会截断其后的伤害序列。"""

    markerBlackboardKey: str
    returnTrueIfNotExists: bool
    durationSeconds: float


@dataclass(frozen=True)
class EntityBlackboardAssignmentSource:
    targetKey: str
    valueType: str
    numericValue: float
    stringValue: str
    useDirectValue: bool = True
    inputValueKey: str = ""


@dataclass(frozen=True)
class AuxiliaryActionSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    actionType: str
    sourceId: str
    classification: str | None
    targetSource: str
    targetGroupKey: str
    count: ScalarSource | None
    buffSource: str | None
    inheritSourceSkillCastInfo: bool | None
    blackboardAssignments: dict[str, ScalarSource]
    nestedCombatActions: tuple[str, ...]
    buffSourceContextKey: str | None = None
    targetFinderType: str | None = None
    targetValidatorTypes: tuple[str, ...] = ()
    targetPostProcessorTypes: tuple[str, ...] = ()
    sequenceIndex: int = -1
    autoFinishByAction: bool | None = None


@dataclass(frozen=True)
class InflictionPayload:
    element: str
    isExtra: bool


@dataclass(frozen=True)
class TimedInflictionSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    element: str
    isExtra: bool
    sequenceIndex: int = -1


@dataclass(frozen=True)
class PhysicalInflictionPayload:
    """物理异常动作的完整战斗载荷；位移参数暂只保留证据，不在单敌人模型中执行。"""

    physicalType: str
    attackerTarget: TargetReferenceSource
    target: TargetReferenceSource
    blowOffDistance: ScalarSource
    distanceRandomRange: ScalarSource
    overwriteHeight: bool
    blowOffHeight: ScalarSource
    directionType: str
    sourceMountPoint: str
    targetMountPoint: str
    customSourceAndTarget: bool
    clampToXZ: bool
    invertDirection: bool
    totalTime: ScalarSource
    isExtra: bool
    deadOption: str
    immobilizedTime: float


@dataclass(frozen=True)
class InterruptPayload:
    """原生 InterruptAction 的完整数据载荷；仅保留事实，不解释控制效果。"""

    attacker: "TargetReferenceSource"
    defender: "TargetReferenceSource"
    overrideSuperArmorLimit: float
    immobilizedTime: float


@dataclass(frozen=True)
class TimedPhysicalInflictionSource:
    """根时间轴中一项已解析的物理异常动作。"""

    startFrame: int
    endFrame: int
    actionIndex: int
    payload: PhysicalInflictionPayload


@dataclass(frozen=True)
class TimedResourceGainSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    resource: str
    amount: ScalarSource
    coefficient: ScalarSource
    spGainKind: str | None
    spGainSource: str | None
    onlyMainOperator: bool
    isPercentValue: bool
    useUltimateRecoveryTag: bool
    ultimateRecoveryTagId: int
    ignoreUltimateGainScalar: bool
    onceActionValueKey: str | None = None
    sequenceIndex: int = -1


@dataclass(frozen=True)
class TimeScaleCurveKeySource:
    time: float
    value: float
    inTangent: float
    outTangent: float
    weightedMode: int
    inWeight: float
    outWeight: float


@dataclass(frozen=True)
class AbilityEntityTimeDilationTargetSource:
    """时间膨胀中的能力实体集合；仅保留身份查询，不声称已能执行。"""

    reference: "TargetReferenceSource"
    spawnedObjectType: str | None
    tagQueries: tuple[tuple[str, tuple[int, ...]], ...]


@dataclass(frozen=True)
class TimedTimeDilationSource:
    """根技能时间轴中的普通或终结技专用时间膨胀动作。"""

    startFrame: int
    endFrame: int
    actionIndex: int
    kind: Literal["normal", "ultimate"]
    priority: int
    scope: Literal["global", "entity"] | None
    slot: int | None
    duration: ScalarSource | None
    namedCurve: str | None
    inlineCurve: tuple[TimeScaleCurveKeySource, ...]
    finishByAction: bool
    ignoredTargets: tuple[Literal["caster", "enemy", "controlled"], ...]
    targets: tuple[Literal["caster", "enemy"], ...]
    omittedAbilityEntityTargets: int
    ignoredAbilityEntityTargets: tuple[AbilityEntityTimeDilationTargetSource, ...]
    influenceSkillCooldown: ScalarSource | None
    targetScale: float | None
    sequenceIndex: int = -1
    effectAbilityEntityTargets: tuple[AbilityEntityTimeDilationTargetSource, ...] = ()


@dataclass(frozen=True)
class TimedKeywordActionSource:
    """原生关键词动作在技能时间轴中的必要战斗语义。"""

    startFrame: int
    endFrame: int
    actionIndex: int
    kind: Literal["slow"]
    source: "TargetReferenceSource"
    target: "TargetReferenceSource"
    duration: ScalarSource
    rate: ScalarSource
    autoFinishByAction: bool
    sequenceIndex: int = -1


@dataclass(frozen=True)
class ProjectileSkillTriggerSource:
    event: Literal["hit", "block", "reach", "finish"]
    skillId: str


@dataclass(frozen=True)
class ProjectileTriggeredSkillSource:
    launchFrame: int
    actionOrder: tuple[int, ...]
    assumedTravelFrames: int
    projectileId: str
    triggerEvent: str
    triggerSkillId: str
    excludedByPrimaryTargetMarker: bool
    sourceFile: str
    damageUnits: tuple[DamageUnitSource, ...]
    directDamageHits: tuple[TimedDamageSource, ...]
    conditionalActions: tuple["ConditionalActionSource", ...]
    auxiliaryActions: tuple[AuxiliaryActionSource, ...]
    resourceGains: tuple[TimedResourceGainSource, ...]
    inflictions: tuple[TimedInflictionSource, ...]
    combatActions: tuple[str, ...]
    cycleTruncated: bool
    nestedProjectileTriggeredSkills: tuple["ProjectileTriggeredSkillSource", ...]
    abilityEntityHits: tuple["AbilityEntityHitSource", ...] = ()
    auraActions: tuple["AuraActionSource", ...] = ()
    keywordActions: tuple[TimedKeywordActionSource, ...] = ()
    localTargetGroupWrites: tuple["TargetGroupWriteSource", ...] = ()


@dataclass(frozen=True)
class ProjectileLaunchSource:
    launchFrame: int
    projectileId: str
    skillTriggers: tuple[ProjectileSkillTriggerSource, ...]
    assignBlackboard: bool
    entityBlackboardAssignments: tuple[EntityBlackboardAssignmentSource, ...]


@dataclass(frozen=True)
class TimedIntervalDamageSource:
    """固定周期动作中每次必然执行的同构伤害。"""

    startFrame: int
    endFrame: int
    actionIndex: int
    intervalSeconds: float
    tickFrames: tuple[int, ...]
    damageActionIndex: int
    damageUnits: tuple[DamageUnitSource, ...]
    sequenceIndex: int = -1


@dataclass(frozen=True)
class TimedAbilityEntityFinishSource:
    """能力实体子 SkillData 在本地时间轴上显式结束自身。"""

    startFrame: int
    endFrame: int
    actionIndex: int
    target: "TargetReferenceSource"
    skipDieDisplay: bool
    sequenceIndex: int = -1


@dataclass(frozen=True)
class TimedTimelineJumpSource:
    """SkillData 时间轴上的条件跳转；当前只用于保留控制流证据。"""

    startFrame: int
    endFrame: int
    destFrame: int
    actionIndex: int
    actionPath: tuple[str, ...]
    conditionActionTypes: tuple[str, ...]
    directConditions: tuple["ConditionSource", ...] = ()
    # 与 directConditions 一一对应；True 表示原生 NotNextCheckAction 只反转该项。
    directConditionNegated: tuple[bool, ...] = ()
    # OrConditionAction 逐项执行 SequenceAction：组内全满足，组间任一满足。
    directAnyConditions: tuple[tuple["ConditionSource", ...], ...] = ()
    directAnyConditionNegated: tuple[tuple[bool, ...], ...] = ()
    directConditionsSupported: bool = False
    isOnlySequenceAction: bool = False
    isOnlyBranchAction: bool = False
    isRootContainerOnlySequenceAction: bool = False
    sequenceIndex: int = -1


@dataclass(frozen=True)
class TimedTimelineFinishSource:
    """根 SkillData 对当前技能时间轴的显式终止。"""

    startFrame: int
    endFrame: int
    actionIndex: int
    sequenceIndex: int = -1


@dataclass(frozen=True)
class AbilityEntityHitSource:
    spawnFrame: int
    actionOrder: tuple[int, ...]
    abilityEntityId: str
    skillId: str
    sourceFile: str
    entityBlackboardAssignments: tuple[EntityBlackboardAssignmentSource, ...]
    spawnPayload: "AbilityEntitySpawnPayload"
    directDamageHits: tuple[TimedDamageSource, ...]
    intervalDamageHits: tuple[TimedIntervalDamageSource, ...]
    explicitFinishes: tuple[TimedAbilityEntityFinishSource, ...]
    timelineJumps: tuple[TimedTimelineJumpSource, ...]
    conditionalActions: tuple["ConditionalActionSource", ...]
    inflictions: tuple[TimedInflictionSource, ...]
    auxiliaryActions: tuple[AuxiliaryActionSource, ...]
    resourceGains: tuple[TimedResourceGainSource, ...]
    projectileLaunches: tuple[ProjectileLaunchSource, ...]
    projectileTriggeredSkills: tuple[ProjectileTriggeredSkillSource, ...]
    nestedAbilityEntityHits: tuple["AbilityEntityHitSource", ...]
    combatActions: tuple[str, ...]
    cycleTruncated: bool
    inheritsSourceBlackboard: bool = False
    declaredBlackboard: tuple[DeclaredBlackboardValueSource, ...] = ()
    blackboardCalculations: tuple[BlackboardCalculationSource, ...] = ()
    blackboardMutations: tuple[BlackboardMutationSource, ...] = ()
    buffBlackboardReads: tuple[BuffBlackboardReadSource, ...] = ()
    buffFinishes: tuple[BuffFinishSource, ...] = ()
    auraActions: tuple["AuraActionSource", ...] = ()
    keywordActions: tuple[TimedKeywordActionSource, ...] = ()
    localTargetGroupWrites: tuple["TargetGroupWriteSource", ...] = ()
    presentationOnlySwitchActionIndexes: tuple[int, ...] = ()


@dataclass(frozen=True)
class ResolvedDamageHitSource:
    frame: int
    actionOrder: tuple[int, ...]
    sourceKind: str
    sourcePath: tuple[str, ...]
    damageUnits: tuple[DamageUnitSource, ...]
    # 根技能坐标系中标识原生 Sequence 的稳定顺序。
    sequenceOrder: tuple[int, ...] = ()


ResolvedScheduleItemType = Literal[
    "abilityEntitySpawn",
    "damage",
    "condition",
    "blackboardCalculation",
    "blackboardMutation",
    "buffBlackboardRead",
    "buffFinish",
    "buffHold",
    "resourceGain",
    "infliction",
    "physicalInfliction",
    "buffApplication",
    "eventListener",
    "timeDilation",
    "keywordAction",
    "auraAction",
    "skillSlotReplacement",
]


@dataclass(frozen=True)
class ResolvedScheduleItemSource:
    """根技能坐标系中的有序战斗项；具体载荷始终只有一种。"""

    frame: int
    actionOrder: tuple[int, ...]
    itemType: ResolvedScheduleItemType
    sourcePath: tuple[str, ...]
    payload: (
        "ResolvedDamageHitSource"
        " | ConditionalActionSource"
        " | BlackboardCalculationSource"
        " | BlackboardMutationSource"
        " | BuffBlackboardReadSource"
        " | BuffFinishSource"
        " | BuffHoldSource"
        " | TimedResourceGainSource"
        " | TimedInflictionSource"
        " | TimedPhysicalInflictionSource"
        " | SkillEventListenerSource"
        " | TimedTimeDilationSource"
        " | TimedKeywordActionSource"
        " | AuraActionSource"
        " | TimedSkillReplacementSource"
        " | AbilityEntitySpawnPayload"
        " | AbilityEntityHitSource"
    )
    # 仅条件动作会读取其调用者传入的 Target；这里保存投影后已确认的目标身份。
    inputTarget: Literal["enemy"] | None = None
    # 同帧且相同 sequenceOrder 的项目来自同一个原生 Sequence。
    sequenceOrder: tuple[int, ...] = ()
    # 子 SkillData 的 Context 目标只能用自身写入证据归约，不能借用根技能目标组。
    targetGroupWrites: tuple["TargetGroupWriteSource", ...] = ()


@dataclass(frozen=True)
class BuffLifecycleSource:
    lifeType: str
    duration: ScalarSource
    triggerInterval: ScalarSource
    waitFirstTriggerInterval: bool
    maxTriggerCount: ScalarSource
    stackingIdentifierType: str
    stackingType: str
    stackingKey: str
    priority: ScalarSource
    negatePriority: bool
    maxStackCount: ScalarSource
    hasStackEffects: bool
    stackEffectActionTypes: tuple[str, ...] = ()


@dataclass(frozen=True)
class BuffDefinitionSource:
    buffId: str
    sourceFile: str
    sourceAvailable: bool
    lifecycle: BuffLifecycleSource | None
    blackboard: tuple["DeclaredBlackboardValueSource", ...]
    applyTagIds: tuple[int, ...]
    extendTagIds: tuple[int, ...]
    attributeModifiers: tuple["BuffAttributeModifierSource", ...]
    damageModifiers: tuple["BuffDamageModifierSource", ...]
    directDamageHits: tuple[TimedDamageSource, ...]
    inflictions: tuple[TimedInflictionSource, ...]
    conditionalActions: tuple["ConditionalActionSource", ...]
    blackboardCalculations: tuple["BlackboardCalculationSource", ...]
    blackboardMutations: tuple["BlackboardMutationSource", ...]
    buffBlackboardReads: tuple["BuffBlackboardReadSource", ...]
    buffFinishes: tuple["BuffFinishSource", ...]
    eventActions: tuple["BuffEventActionSource", ...]
    igniteEventActions: tuple["BuffEventActionSource", ...]
    sourceDeathFinish: "BuffSourceDeathFinishSource | None"
    resourceGains: tuple[TimedResourceGainSource, ...]
    combatActions: tuple[str, ...]
    unparsedPayloads: tuple["UnparsedBuffPayloadSource", ...]
    healModifiers: tuple["BuffHealModifierSource", ...] = ()
    auraActions: tuple["AuraActionSource", ...] = ()
    abilityEntityHits: tuple[AbilityEntityHitSource, ...] = ()
    invokedAbilityEntitySkills: tuple[AbilityEntityHitSource, ...] = ()
    auxiliaryActions: tuple[AuxiliaryActionSource, ...] = ()
    targetGroupWrites: tuple[TargetGroupWriteSource, ...] = ()
    skillReplacements: tuple["BuffSkillReplacementSource", ...] = ()
    # 仅由已证明并由 manifest 选择的运行时关系注入；不属于原始审计载荷。
    runtimeSkillSlotReplacements: tuple[dict[str, object], ...] = ()
    attributeModifiersConverted: bool = False
    # Buff.OnTick(deltaTime, allScaledDeltaTime, selfScaledDeltaTime) 的原始判别字段。
    useTimeDilationDt: bool = False
    onlyUseSelfTimeDilation: bool = False
    intervalDamageHits: tuple[TimedIntervalDamageSource, ...] = ()
    comboQteActions: tuple["BuffComboQteSource", ...] = ()
    pauseTimeActions: tuple["BuffPauseTimeSource", ...] = ()
    shields: tuple["BuffShieldSource", ...] = ()
    sustainedProtections: tuple["BuffSustainedProtectionSource", ...] = ()
    animationEndBuffApplications: tuple["BuffAnimationEndApplicationSource", ...] = ()
    projectileLaunches: tuple[ProjectileLaunchSource, ...] = ()
    presentationOnlySwitchActionIndexes: tuple[int, ...] = ()


@dataclass(frozen=True)
class BuffAnimationEndApplicationSource:
    """PlayAnimationAction 结束时执行的 Buff 应用及其已证实生命周期。"""

    naturalEndFrame: int
    sequenceIndex: int
    animationActionIndex: int
    executeOnNormalEndOnly: bool
    application: AuxiliaryActionSource


@dataclass(frozen=True)
class BuffShieldAbsorptionSource:
    damageType: str
    ratio: ScalarSource
    scale: ScalarSource


@dataclass(frozen=True)
class BuffShieldSource:
    infinityValue: bool
    value: ScalarSource
    damageAbsorptions: tuple[BuffShieldAbsorptionSource, ...]
    absorbCount: ScalarSource
    absorbAllDamageWhenConsumed: bool
    removeBuffWhenConsumed: bool
    priority: str
    replaceHitEffect: bool


@dataclass(frozen=True)
class BuffSustainedProtectionSource:
    target: "TargetReferenceSource"
    superArmor: ScalarSource
    impactResistance: ScalarSource


@dataclass(frozen=True)
class BuffComboQteSource:
    """原生 ShowComboRingQte 与其有效期 Buff、成功写入之间的闭环。"""

    actionIndex: int
    earlyDuration: ScalarSource
    activeDuration: ScalarSource
    activeTimerBuffId: str
    triggerMutation: BlackboardMutationSource


@dataclass(frozen=True)
class BuffPauseTimeSource:
    """Buff Ability 事件对当前实例计时状态的显式赋值。"""

    event: Literal["OnBeforeCastSkill", "OnFinishedBuff"]
    priority: int
    paused: bool
    skillIds: tuple[str, ...] = ()
    buffIds: tuple[str, ...] = ()


@dataclass(frozen=True)
class BuffSkillReplacementSource:
    eventSource: Literal["buff", "ability"]
    event: str
    actionIndex: int
    skillSource: TargetReferenceSource
    skillSlot: str
    targetSkillId: str
    overrideCacheTime: bool
    cacheTime: ScalarSource
    lifeTimeType: str
    duration: ScalarSource
    inheritOriginSkillCooldownProgress: bool
    specificRevertedSkillId: bool
    revertedSkillId: str


@dataclass(frozen=True)
class TimedSkillReplacementSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    skillSource: TargetReferenceSource
    skillSlot: str
    targetSkillId: str
    overrideCacheTime: bool
    cacheTime: ScalarSource
    lifeTimeType: str
    duration: ScalarSource
    inheritOriginSkillCooldownProgress: bool
    specificRevertedSkillId: bool
    revertedSkillId: str


@dataclass(frozen=True)
class BuffSourceDeathFinishSource:
    """周期检查来源 HP 归零后结束 Buff 所属能力实体的严格组合。"""

    skipDieDisplay: bool


@dataclass(frozen=True)
class UnparsedBuffPayloadSource:
    field: str
    entryCount: int


@dataclass(frozen=True)
class BuffAttributeModifierSource:
    targetType: str
    attributeType: str
    slot: str
    value: ScalarSource


@dataclass(frozen=True)
class BuffDamageScaleProcessorSource:
    side: str
    zone: str
    addition: ScalarSource


@dataclass(frozen=True)
class BuffInstantAttributeProcessorSource:
    targetSide: str
    attributeType: str
    slot: str
    value: ScalarSource


@dataclass(frozen=True)
class BuffDamageNumberComparisonSource:
    left: ScalarSource
    comparison: str
    right: ScalarSource


@dataclass(frozen=True)
class BuffDamageTagConditionSource:
    targetSource: str
    targetGroupKey: str
    queryType: str
    tagIds: tuple[int, ...]


@dataclass(frozen=True)
class BuffDamageBuffCountConditionSource:
    targetSource: str
    targetGroupKey: str
    buffIds: tuple[str, ...]
    comparison: str
    value: ScalarSource


@dataclass(frozen=True)
class BuffDamageModifierSource:
    enabledSide: str
    targetSource: str
    targetGroupKey: str
    tagQueryType: str
    tagIds: tuple[int, ...]
    processors: tuple[
        BuffDamageScaleProcessorSource | BuffInstantAttributeProcessorSource, ...
    ]
    tagConditions: tuple[BuffDamageTagConditionSource, ...] = ()
    ownerControlled: bool = False
    damageTagMatch: str | None = None
    damageTags: tuple[str, ...] = ()
    damageFeatureMatch: str | None = None
    damageFeatures: tuple[str, ...] = ()
    damageTypes: tuple[str, ...] = ()
    numberComparisons: tuple[BuffDamageNumberComparisonSource, ...] = ()
    healthComparisons: tuple["HealthConditionSource", ...] = ()
    buffCountComparisons: tuple[BuffDamageBuffCountConditionSource, ...] = ()


@dataclass(frozen=True)
class BuffHealModifierSource:
    enabledSide: str
    targetHealthComparison: "HealthConditionSource | None"
    baseMultiplier: ScalarSource
    multiplierCount: ScalarSource


@dataclass(frozen=True)
class BuffEventActionSource:
    eventSource: Literal["buff", "ability", "ignite"]
    event: str
    orderedActionTypes: tuple[str, ...]
    combatActions: tuple[str, ...]
    damageUnits: tuple[DamageUnitSource, ...]
    buffApplications: tuple["EventBuffApplicationSource", ...]
    createdBuffIds: tuple[str, ...]
    forEachActions: tuple["BuffEventForEachSource", ...] = ()
    targetGroupWrites: tuple["BuffEventTargetGroupWriteSource", ...] = ()
    sequences: tuple["SkillEventActionSequenceSource", ...] = ()
    finishAfterIgnited: bool = False
    runtimeTargetGroupWrites: tuple["TargetGroupWriteSource", ...] = ()
    obtainAtbFilters: tuple["ObtainAtbFilterSource", ...] = ()
    obtainAtbValueKeys: tuple[tuple[str, str], ...] = ()
    contextBuffTagQueries: tuple[tuple[str, tuple[int, ...]], ...] = ()
    contextBuffIdQueries: tuple[tuple[str, ...], ...] = ()
    consumeBuffLayerChecks: tuple[tuple[str, float, str], ...] = ()
    collectedBuffReactionModifier: "CollectedBuffReactionModifierSource | None" = None


@dataclass(frozen=True)
class CollectedBuffReactionModifierSource:
    """对 OnCollectOutputBuffBbValue 的严格、可归约子集。"""

    buffTagId: int
    durationAdditionKey: str
    effectivenessAdditionKey: str


@dataclass(frozen=True)
class ObtainAtbFilterSource:
    """OnObtainAtb 中显式声明的技力来源与获取方式筛选。"""

    checkObtainType: bool
    obtainTypes: tuple[str, ...]
    checkObtainMethod: bool
    obtainMethods: tuple[str, ...]


@dataclass(frozen=True)
class BuffEventTargetGroupWriteSource:
    actionIndex: int
    targetGroupKey: str
    finderType: str
    finderFactionTarget: str | None
    finderTargetObjectType: str | int | None
    finderCheckAlive: bool | None
    validatorTypes: tuple[str, ...]
    postProcessorTypes: tuple[str, ...]
    spawnedObjectType: str | None
    tagQueries: tuple[tuple[str, tuple[int, ...]], ...]
    center: str
    selectorOwner: str


@dataclass(frozen=True)
class BuffEventSkillCastSource:
    actionIndex: int
    caster: TargetReferenceSource
    target: TargetReferenceSource
    skillId: str
    skipApplyCost: bool
    inheritSourceSkillCastId: bool


@dataclass(frozen=True)
class BuffEventForEachSource:
    """Buff 事件中的目标集合与同步循环体；只保存来源事实，不执行目标搜索。"""

    actionIndex: int
    target: TargetReferenceSource
    spawnedObjectType: str | None
    tagQueries: tuple[tuple[str, tuple[int, ...]], ...]
    orderedActionTypes: tuple[str, ...]
    buffApplications: tuple["EventBuffApplicationSource", ...]
    skillCasts: tuple[BuffEventSkillCastSource, ...]


@dataclass(frozen=True)
class EventBuffApplicationSource:
    actionIndex: int
    payload: BuffApplicationPayload


@dataclass(frozen=True)
class SkillEventActionSequenceSource:
    """技能事件的一条有序动作序列；条件和动作仍按原始顺序保留。"""

    onlyMainOperator: bool
    onlyGuard: bool
    orderedActionTypes: tuple[str, ...]
    combatActions: tuple[str, ...]
    buffApplications: tuple[EventBuffApplicationSource, ...]
    # 事件回调中的同步动作树。顺序守卫会包住其后的动作，不能只靠动作类型摘要还原。
    actions: tuple["ConditionalBranchActionSource", ...] = ()
    # 原生 SequenceAction 取首个启用动作的 priorityLevel + priorityOffset。
    priority: int = 0


@dataclass(frozen=True)
class SkillEventListenerSource:
    """技能持续区间内注册的实体事件监听器，不应折叠为技能时间轴上的定时动作。"""

    startFrame: int
    endFrame: int
    actionIndex: int
    priorityLevel: str
    priorityOffset: int
    event: str
    sequences: tuple[SkillEventActionSequenceSource, ...]
    sequenceIndex: int = -1
    obtainAtbFilters: tuple["ObtainAtbFilterSource", ...] = ()
    obtainAtbValueKeys: tuple[tuple[str, str], ...] = ()


@dataclass(frozen=True)
class EntityCountConditionSource:
    targetSource: str
    targetGroupKey: str
    minimumCount: int
    comparison: str
    containsHittableTarget: bool
    excludeDeadEntity: bool
    storeKey: str


@dataclass(frozen=True)
class BuffStackConditionSource:
    targetSource: str
    targetGroupKey: str
    buffCheckType: str
    buffIds: tuple[str, ...]
    tagQueryType: str
    buffTagIds: tuple[int, ...]
    countType: str
    comparison: str
    value: ScalarSource
    limitSkillCastId: bool


@dataclass(frozen=True)
class HealthConditionSource:
    targetSource: str
    targetGroupKey: str
    comparison: str
    isRatio: bool
    value: ScalarSource
    characterTeamSelectionRole: str | None = None


@dataclass(frozen=True)
class PoiseConditionSource:
    target: "TargetReferenceSource"
    returnValueIfMissing: bool
    comparison: str
    value: ScalarSource


@dataclass(frozen=True)
class MainOperatorConditionSource:
    targetSource: str
    targetGroupKey: str


@dataclass(frozen=True)
class EnemyRankConditionSource:
    target: "TargetReferenceSource"
    # 原生 EnemyRankSet 位集：Mob=1、Elite=2、Boss=4。
    rankMask: int


@dataclass(frozen=True)
class SuperArmorConditionSource:
    """原生 CheckSuperArmor：比较首目标当前整数霸体值。"""

    target: "TargetReferenceSource"
    comparison: str
    value: ScalarSource


@dataclass(frozen=True)
class TwoDirectionAngleConditionSource:
    dir1Source: "TargetReferenceSource"
    dir1Target: "TargetReferenceSource"
    dir1DirectionType: str
    dir2Source: "TargetReferenceSource"
    dir2Target: "TargetReferenceSource"
    dir2DirectionType: str
    comparison: str
    value: ScalarSource


@dataclass(frozen=True)
class TargetAngleConditionSource:
    origin: "TargetReferenceSource"
    target: "TargetReferenceSource"
    angleType: str
    angle: ScalarSource


@dataclass(frozen=True)
class TargetReferenceSource:
    """一个原生 TargetSettings 引用；保留证明目标身份与位置所需的选择器语义。"""

    targetSource: str
    targetGroupKey: str
    selectorOwner: str
    ownerContextKey: str
    centerType: str
    centerContextKey: str
    centerToGround: bool
    target: str
    targetContextKey: str
    enableAdvancedDirection: bool
    selectorDirection: str
    finderType: str | None
    validatorTypes: tuple[str, ...]
    postProcessorTypes: tuple[str, ...]
    finderSpawnedObjectType: str | None = None
    validatorTagQueries: tuple[tuple[str, tuple[int, ...]], ...] = ()


@dataclass(frozen=True)
class TargetIdentityConditionSource:
    first: TargetReferenceSource
    second: TargetReferenceSource


@dataclass(frozen=True)
class DistanceConditionSource:
    source: TargetReferenceSource
    target: TargetReferenceSource
    distance: float
    lessThan: bool
    includeTargetRadius: bool
    containsHittableObject: bool


@dataclass(frozen=True)
class TimedMarkerConditionSource:
    targetSource: str
    targetGroupKey: str
    markerId: str
    blackboardKey: str
    useBlackboardKey: bool
    returnTrueIfNotExists: bool


@dataclass(frozen=True)
class GlobalCooldownConditionSource:
    """原生全局冷却检查；运行时以角色和 Buff ID 共同标识冷却项。"""

    targetSource: str
    targetGroupKey: str
    buffId: str


@dataclass(frozen=True)
class SkillHasHitConditionSource:
    """原生条件读取当前技能实例是否已经对战斗目标输出过伤害。"""


@dataclass(frozen=True)
class DamageDecorateMaskConditionSource:
    """事件伤害上下文中的原生标签位掩码；确认位定义前不转换成项目标签。"""

    checkType: str
    mask: int


@dataclass(frozen=True)
class BuffIdInContextConditionSource:
    """事件上下文携带的 Buff 身份检查，不等同于查询目标身上的 Buff 实例。"""

    checkType: str
    buffIds: tuple[str, ...]
    queryType: str
    buffTagIds: tuple[int, ...] = ()


@dataclass(frozen=True)
class HealTagConditionSource:
    """当前 HealContext 的原生 GameplayTagQuery。"""

    queryType: str
    tagIds: tuple[int, ...]


@dataclass(frozen=True)
class OverHealConditionSource:
    """当前 HealContext 的过量治疗判断与可选黑板输出键。"""

    overHealKey: str
    finalHealKey: str
    realHealKey: str


@dataclass(frozen=True)
class AbilityEntityDurationConditionSource:
    """原生能力实体剩余时长检查的完整可审计载荷。"""

    target: TargetReferenceSource
    comparison: str
    value: ScalarSource
    saveCurrentDuration: bool
    outputKey: str


@dataclass(frozen=True)
class ObjectTypeMatchConditionSource:
    target: TargetReferenceSource
    objectTypeMask: str | int


@dataclass(frozen=True)
class ConditionSource:
    sourceType: str
    supported: bool
    comparison: str | None
    left: ScalarSource | None
    right: ScalarSource | None
    skillTypes: tuple[str, ...]
    damageType: str | None = None
    inflictionElements: tuple[str, ...] = ()
    entityCount: EntityCountConditionSource | None = None
    buffStack: BuffStackConditionSource | None = None
    health: HealthConditionSource | None = None
    poise: "PoiseConditionSource | None" = None
    mainOperator: MainOperatorConditionSource | None = None
    enemyRank: "EnemyRankConditionSource | None" = None
    superArmor: "SuperArmorConditionSource | None" = None
    twoDirectionAngle: "TwoDirectionAngleConditionSource | None" = None
    targetAngle: "TargetAngleConditionSource | None" = None
    targetIdentity: TargetIdentityConditionSource | None = None
    distance: DistanceConditionSource | None = None
    entityTag: "EntityTagConditionSource | None" = None
    timedMarker: "TimedMarkerConditionSource | None" = None
    globalCooldown: "GlobalCooldownConditionSource | None" = None
    skillHasHit: "SkillHasHitConditionSource | None" = None
    damageDecorateMask: "DamageDecorateMaskConditionSource | None" = None
    contextBuffId: "BuffIdInContextConditionSource | None" = None
    healTag: "HealTagConditionSource | None" = None
    overHeal: "OverHealConditionSource | None" = None
    abilityEntityDuration: "AbilityEntityDurationConditionSource | None" = None
    objectTypeMatch: "ObjectTypeMatchConditionSource | None" = None
    deckAttributeCompare: "DeckAttributeCompareConditionSource | None" = None
    probability: ScalarSource | None = None
    # 原生 OrConditionAction：各 SequenceAction 内部全满足，组间任一满足。
    anyConditionGroups: tuple[tuple["ConditionSource", ...], ...] = ()
    anyConditionNegated: tuple[tuple[bool, ...], ...] = ()


@dataclass(frozen=True)
class DeckAttributeCompareConditionSource:
    targetSource: str
    targetGroupKey: str
    leftAttribute: str
    leftValue: ScalarSource
    comparison: str
    rightAttribute: str
    rightValue: ScalarSource


@dataclass(frozen=True)
class EntityTagConditionSource:
    targetSource: str
    targetGroupKey: str
    tagQueryType: str
    tagIds: tuple[int, ...]


@dataclass(frozen=True)
class BlackboardCalculationPayload:
    key: str
    operation: str
    left: ScalarSource
    right: ScalarSource
    addend: ScalarSource | None = None


@dataclass(frozen=True)
class StoreAttributeValuePayload:
    targetSource: str
    targetGroupKey: str
    attributeKind: str
    attributeKey: str | None
    stage: str
    useFloor: bool
    divisor: ScalarSource
    multiplier: ScalarSource
    base: ScalarSource
    outputKey: str


@dataclass(frozen=True)
class BlackboardMutationPayload:
    key: str
    operation: str
    value: ScalarSource


@dataclass(frozen=True)
class BuffBlackboardReadPayload:
    outputKey: str
    desiredKey: str
    targetSource: str
    targetGroupKey: str
    buffCheckType: str
    buffIds: tuple[str, ...]
    tagQueryType: str
    buffTagIds: tuple[int, ...]


@dataclass(frozen=True)
class BuffFinishPayload:
    targetSource: str
    targetGroupKey: str
    buffCheckType: str
    buffIds: tuple[str, ...]
    tagQueryType: str
    buffTagIds: tuple[int, ...]
    finishAll: bool
    limitSource: bool
    isFinishedEarly: bool
    isAbsorbed: bool
    finishLayerCount: ScalarSource | None = None


@dataclass(frozen=True)
class LegacyBuffFinishPayload:
    target: TargetReferenceSource
    buffIds: tuple[str, ...]
    finishAll: bool
    finishLayerCount: ScalarSource
    limitSource: bool
    buffSource: TargetReferenceSource
    isFinishedEarly: bool
    finishSource: TargetReferenceSource


@dataclass(frozen=True)
class SkillCooldownAdjustmentPayload:
    target: TargetReferenceSource
    useSkillType: bool
    skillTypeMask: str
    skillId: str
    functionType: str
    isPercentage: bool
    value: ScalarSource


@dataclass(frozen=True)
class HealPayload:
    healType: str
    healer: str
    alwaysNext: bool
    target: "TargetReferenceSource"
    # `None` 表示 DefiniteValueCalculation，治疗量直接取 addition。
    attribute: str | None
    multiplier: ScalarSource
    addition: ScalarSource
    tagIds: tuple[int, ...]


@dataclass(frozen=True)
class BuffIgnitePayload:
    source: TargetReferenceSource
    target: TargetReferenceSource
    igniteType: str
    successTargetContextKey: str


@dataclass(frozen=True)
class BuffHoldSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    targetSource: str
    targetGroupKey: str
    buffCheckType: str
    buffIds: tuple[str, ...]
    tagQueryType: str
    buffTagIds: tuple[int, ...]
    sequenceIndex: int = -1


@dataclass(frozen=True)
class BuffStackReadPayload:
    outputKey: str
    targetSource: str
    targetGroupKey: str
    buffCheckType: str
    buffIds: tuple[str, ...]
    tagQueryType: str
    buffTagIds: tuple[int, ...]
    countType: str
    limitSkillCastId: bool


@dataclass(frozen=True)
class BuffApplicationEntryPayload:
    buffId: str
    classification: str | None
    blackboardAssignments: dict[str, ScalarSource]


@dataclass(frozen=True)
class BuffApplicationPayload:
    buffs: tuple[BuffApplicationEntryPayload, ...]
    targetSource: str
    targetGroupKey: str
    count: ScalarSource
    buffSource: str
    buffSourceContextKey: str
    inheritSourceSkillCastInfo: bool
    targetFinderType: str | None
    targetValidatorTypes: tuple[str, ...]
    targetPostProcessorTypes: tuple[str, ...]


@dataclass(frozen=True)
class Vector3Source:
    x: float
    y: float
    z: float


@dataclass(frozen=True)
class AuraShapeSource:
    shapeType: str
    rotationOffset: Vector3Source
    useExtentKeys: bool
    extent: Vector3Source
    extentKeys: tuple[str, str, str]
    useCenterKeys: bool
    center: Vector3Source
    centerKeys: tuple[str, str, str]
    height: float
    heightKey: str
    radius: float
    radiusKey: str


@dataclass(frozen=True)
class AuraTargetFilterSource:
    checkAlive: bool
    autoSetTargetFaction: bool
    factionTarget: str
    factionTargetType: str | int
    filterObjectType: bool
    objectType: str | int
    filterSlot: bool
    slotIndex: int
    filterGameplayTag: bool
    tagQueryType: str
    tagIds: tuple[int, ...]


@dataclass(frozen=True)
class AirborneOutputSource:
    """原生 AirborneAction 的可审计战斗事实；空间与表现参数不进入木桩状态。"""

    actionIndex: int
    source: TargetReferenceSource
    target: TargetReferenceSource
    forceAirborne: bool
    floatingDuration: ScalarSource
    floatingHeight: ScalarSource
    speedFactorMultiplier: float
    faceDirectionType: str
    immobilizedTime: float
    isExtra: bool
    deadOption: str
    returnTrueWhen: str


@dataclass(frozen=True)
class AuraActionSource:
    """区域持续动作的审计事实；在生命周期语义闭环前不直接生成 DSL。"""

    startFrame: int | None
    endFrame: int | None
    actionIndex: int
    sourceFile: str
    activationSource: Literal["timeline", "buffEvent", "abilityEvent"]
    activationEvent: str | None
    actionPath: tuple[str, ...]
    priorityLevel: str
    priorityOffset: int
    debugName: str
    auraType: str
    root: TargetReferenceSource
    fixedWhenStart: bool
    shape: AuraShapeSource
    excludeColliderOptions: int
    targetObjectType: str | int
    targetFilter: AuraTargetFilterSource
    excludeOwner: bool
    includeUnmarkable: bool
    limitInfluenceCountPerTarget: bool
    maxInfluenceCountPerTarget: int
    buffSource: str
    buffs: tuple[BuffApplicationEntryPayload, ...]
    overrideBuffIconDuration: bool
    buffIconDurationSourceType: str
    buffIconDurationTimedMarkerId: str
    inheritSourceSkillCastId: bool
    actionInAuraOnlyMainOperator: bool
    actionInAuraOnlyGuard: bool
    actionInAuraTypes: tuple[str, ...]
    actionWhenExitAuraOnlyMainOperator: bool
    actionWhenExitAuraOnlyGuard: bool
    actionWhenExitAuraTypes: tuple[str, ...]
    nestedCombatActions: tuple[str, ...]
    airborneOutputs: tuple[AirborneOutputSource, ...] = ()
    actionInAuraBuffFinishes: tuple[BuffFinishPayload, ...] = ()
    actionWhenExitAuraBuffFinishes: tuple[BuffFinishPayload, ...] = ()
    actionWhenExitAuraBuffApplications: tuple[BuffApplicationPayload, ...] = ()


@dataclass(frozen=True)
class TimedMarkerApplicationPayload:
    targetSource: str
    targetGroupKey: str
    markerId: str
    duration: ScalarSource
    autoFinishByAction: bool
    useTimeDilationDt: bool


@dataclass(frozen=True)
class GlobalCooldownApplicationPayload:
    """原生全局冷却写入；在 Next 中复用同一角色上的定时标记容器。"""

    targetSource: str
    targetGroupKey: str
    buffId: str
    duration: ScalarSource


@dataclass(frozen=True)
class ResourceGainPayload:
    resource: str
    amount: ScalarSource
    coefficient: ScalarSource
    spGainKind: str | None
    spGainSource: str | None
    onlyMainOperator: bool
    isPercentValue: bool
    useUltimateRecoveryTag: bool
    ultimateRecoveryTagId: int
    ignoreUltimateGainScalar: bool


@dataclass(frozen=True)
class ProjectileLaunchPayload:
    projectileId: str
    skillTriggers: tuple[ProjectileSkillTriggerSource, ...]
    assignBlackboard: bool = False
    entityBlackboardAssignments: tuple[EntityBlackboardAssignmentSource, ...] = ()
    target: TargetReferenceSource | None = None


@dataclass(frozen=True)
class ConditionalProjectileProjection:
    """条件各路径一致时，可提升到根调度的一次投射物命中子技能。"""

    launch: ProjectileLaunchPayload
    triggeredSkills: tuple[ProjectileTriggeredSkillSource, ...]


@dataclass(frozen=True)
class AbilityEntitySpawnPayload:
    abilityEntityId: str
    skillId: str | None
    entityBlackboardAssignments: tuple[EntityBlackboardAssignmentSource, ...] = ()
    assignBlackboard: bool = False
    sourceType: str = ""
    sourceContextKey: str = ""
    target: TargetReferenceSource | None = None
    overrideDuration: ScalarSource | None = None
    saveToContextKey: str | None = None
    dieWhenSourceDies: bool = False
    dieOnEnd: bool = False


@dataclass(frozen=True)
class AbilityEntityDurationAssignmentPayload:
    """原生能力实体剩余时长赋值；目标选择语义由编译阶段证明。"""

    setMultipleTarget: bool
    actionTargetType: str
    targetContextKey: str
    operation: str
    value: ScalarSource
    targetSettings: TargetReferenceSource | None = None


@dataclass(frozen=True)
class StoreCurrentTimelineFramePayload:
    """把当前宿主技能的局部整数执行帧写入动作黑板。"""

    outputKey: str


@dataclass(frozen=True)
class ConditionalBranchActionSource:
    actionType: str
    # 分支 actionData 中的位置，只用于保持原始顺序。
    actionIndex: int
    # 原始动作树路径和服务器序号用于同帧目标组读写溯源。
    actionPath: tuple[str, ...] = ()
    serverActionIndex: int | None = None
    nestedCondition: ConditionalActionSource | None = None
    onceScopeKey: str | None = None
    onceActions: tuple[ConditionalBranchActionSource, ...] | None = None
    blackboardCalculation: BlackboardCalculationPayload | None = None
    storeAttributeValue: StoreAttributeValuePayload | None = None
    blackboardMutation: BlackboardMutationPayload | None = None
    buffBlackboardRead: BuffBlackboardReadPayload | None = None
    buffFinish: BuffFinishPayload | None = None
    legacyBuffFinish: LegacyBuffFinishPayload | None = None
    skillCooldownAdjustment: SkillCooldownAdjustmentPayload | None = None
    buffIgnite: BuffIgnitePayload | None = None
    buffStackRead: BuffStackReadPayload | None = None
    buffApplication: BuffApplicationPayload | None = None
    timedMarkerApplication: TimedMarkerApplicationPayload | None = None
    globalCooldownApplication: GlobalCooldownApplicationPayload | None = None
    resourceGain: ResourceGainPayload | None = None
    infliction: InflictionPayload | None = None
    physicalInfliction: PhysicalInflictionPayload | None = None
    interrupt: InterruptPayload | None = None
    projectileLaunch: ProjectileLaunchPayload | None = None
    projectileTriggeredSkills: tuple[ProjectileTriggeredSkillSource, ...] | None = None
    abilityEntitySpawn: AbilityEntitySpawnPayload | None = None
    abilityEntityDurationAssignment: AbilityEntityDurationAssignmentPayload | None = None
    conditionalAbilityEntityHits: tuple[AbilityEntityHitSource, ...] | None = None
    damageUnits: tuple[DamageUnitSource, ...] | None = None
    heal: HealPayload | None = None
    keywordAction: TimedKeywordActionSource | None = None


@dataclass(frozen=True)
class ConditionalTimeDilationActionSource(ConditionalBranchActionSource):
    """仍位于原条件分支中的时间膨胀动作。"""

    timeDilation: TimedTimeDilationSource | None = None


@dataclass(frozen=True)
class TimelineJumpBranchActionSource(ConditionalBranchActionSource):
    """事件有序响应中的宿主技能时间轴跳转。"""

    timelineJumpDestinationFrame: int | None = None


@dataclass(frozen=True)
class StoreCurrentTimelineFrameActionSource(ConditionalBranchActionSource):
    """保存宿主局部执行帧的分支叶子。"""

    storeCurrentTimelineFrame: StoreCurrentTimelineFramePayload | None = None


@dataclass(frozen=True)
class ConditionalActionSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    actionPath: tuple[str, ...]
    conditions: tuple[ConditionSource, ...]
    succeedActions: tuple[ConditionalBranchActionSource, ...]
    failActions: tuple[ConditionalBranchActionSource, ...]
    # 与 conditions 一一对应；原生 NotNextCheckAction 只反转紧随其后的条件。
    conditionNegated: tuple[bool, ...] = ()
    # 原生 IfElseAction/SwitchAction 的返回值覆盖；为真时外层序列继续。
    alwaysNext: bool = False
    executionFrames: tuple[int, ...] = ()
    projectedAbilityEntitySpawns: tuple[AbilityEntitySpawnPayload, ...] = ()
    projectedProjectileLaunches: tuple[ConditionalProjectileProjection, ...] = ()


@dataclass(frozen=True)
class SequenceGuardActionSource(ConditionalActionSource):
    """保留 SequenceAction 条件失败时截断后续兄弟动作的控制流。"""


@dataclass(frozen=True)
class SwitchActionSource(ConditionalActionSource):
    """由原生 SwitchAction 展开的首项匹配条件链。"""


@dataclass(frozen=True)
class DoOnceActionSource(ConditionalActionSource):
    """根时间轴中的一次性动作；同一技能释放内共享作用域。"""

    onceScopeKey: str = ""


@dataclass(frozen=True)
class UnconditionalActionSource(ConditionalActionSource):
    """借用统一动作树保存根时间轴中的直接战斗动作。"""


@dataclass(frozen=True)
class EveryFrameActionSource(ConditionalActionSource):
    """在原调度区间开始以及之后每个宿主 Tick 执行一次的动作树。"""


@dataclass(frozen=True)
class ForEachContextActionSource(ConditionalActionSource):
    """对原生 Context 目标组的稳定句柄逐一执行同步动作序列。"""

    contextKey: str = ""


@dataclass(frozen=True)
class BlackboardCalculationSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    key: str
    operation: str
    left: ScalarSource
    right: ScalarSource
    addend: ScalarSource | None = None
    sequenceIndex: int = -1


@dataclass(frozen=True)
class BlackboardMutationSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    key: str
    operation: str
    value: ScalarSource
    sequenceIndex: int = -1


@dataclass(frozen=True)
class BuffBlackboardReadSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    outputKey: str
    desiredKey: str
    targetSource: str
    targetGroupKey: str
    buffCheckType: str
    buffIds: tuple[str, ...]
    tagQueryType: str
    buffTagIds: tuple[int, ...]
    sequenceIndex: int = -1


@dataclass(frozen=True)
class BuffFinishSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    targetSource: str
    targetGroupKey: str
    buffCheckType: str
    buffIds: tuple[str, ...]
    tagQueryType: str
    buffTagIds: tuple[int, ...]
    finishAll: bool
    limitSource: bool
    isFinishedEarly: bool
    isAbsorbed: bool
    finishLayerCount: ScalarSource | None = None
    sourceActionType: str = "FinishBuffAdvanced"
    sequenceIndex: int = -1


@dataclass(frozen=True)
class BlackboardKeyProvenanceSource:
    key: str
    declaredInSkill: bool
    suppliedByPatch: bool
    calculatedLocally: bool
    mutatedLocally: bool
    readFromBuff: bool
    externalRuntimeInput: bool


@dataclass(frozen=True)
class DeclaredBlackboardValueSource:
    """SkillData 自身声明的黑板初值；字符串也可用于保存技能身份。"""

    key: str
    value: float | str
    isDynamic: bool


@dataclass(frozen=True)
class TargetGroupInputSource:
    """MergeTargetAction 的一个输入；即时查找输入同时记录选择器组成。"""

    targetSource: str
    targetGroupKey: str
    finderType: str | None
    finderFactionTarget: str | None
    finderTargetObjectType: str | None
    finderCheckAlive: bool | None
    validatorTypes: tuple[str, ...]
    postProcessorTypes: tuple[str, ...]
    finderSpawnedObjectType: str | None = None
    validatorTagQueries: tuple[tuple[str, tuple[int, ...]], ...] = ()


@dataclass(frozen=True)
class TargetGroupWriteSource:
    """技能动作树对命名目标组的一次写入，用于后续按控制流证明目标来源。"""

    startFrame: int
    endFrame: int
    actionIndex: int
    actionPath: tuple[str, ...]
    targetGroupKey: str
    producerType: str
    finderType: str | None
    finderFactionTarget: str | None
    finderTargetObjectType: str | None
    finderCheckAlive: bool | None
    validatorTypes: tuple[str, ...]
    postProcessorTypes: tuple[str, ...]
    inputTargets: tuple[TargetGroupInputSource, ...]
    intervalSeconds: float | None
    finderSpawnedObjectType: str | None = None
    validatorTagQueries: tuple[tuple[str, tuple[int, ...]], ...] = ()
    finderFixedPointSnapToNavmesh: bool | None = None
    center: str | None = None
    centerContextKey: str = ""
    selectorOwner: str | None = None
    selectorOwnerContextKey: str = ""
    characterTeamSelectionRole: str | None = None
    excludesCurrentTarget: bool = False
    excludesOwner: bool = False
    smartTargetFallsBackToMainTarget: bool = False
    distanceValidatorsPassAtZero: bool = False
    priorityFilterMaxTargets: int | None = None
    circularOrderIndexKey: str | None = None
    circularOrderDesiredCount: int | None = None
    circularOrderReverseFlag: float | None = None
    circularOrderHeightOffset: float | None = None
    circularOrderRangeThreshold: float | None = None
    circularOrderRangeCheckTarget: TargetReferenceSource | None = None
    pickIndexValue: float | None = None
    pickIndexBlackboardKey: str | None = None


@dataclass(frozen=True)
class SkillSource:
    key: str
    skillId: str
    skillType: str
    sourceFile: str
    timelineBlockFrames: int
    blockBoundarySource: str
    cooldownSeconds: float
    costFrame: int
    costType: str
    costValue: float
    offsetRecordFrame: int
    allowNextWindows: tuple[dict[str, Any], ...]
    inputCacheWindows: tuple[dict[str, Any], ...]
    timelineActions: tuple[TimelineActionSource, ...]
    directDamageHits: tuple[TimedDamageSource, ...]
    conditionalActions: tuple[ConditionalActionSource, ...]
    inflictions: tuple[TimedInflictionSource, ...]
    auxiliaryActions: tuple[AuxiliaryActionSource, ...]
    blackboardCalculations: tuple[BlackboardCalculationSource, ...]
    blackboardMutations: tuple[BlackboardMutationSource, ...]
    buffBlackboardReads: tuple[BuffBlackboardReadSource, ...]
    buffFinishes: tuple[BuffFinishSource, ...]
    resourceGains: tuple[TimedResourceGainSource, ...]
    projectileLaunches: tuple[ProjectileLaunchSource, ...]
    projectileTriggeredSkills: tuple[ProjectileTriggeredSkillSource, ...]
    abilityEntityHits: tuple[AbilityEntityHitSource, ...]
    referencedBuffIds: tuple[str, ...]
    patch: SkillPatchSource
    declaredBlackboard: tuple[DeclaredBlackboardValueSource, ...]
    blackboardKeys: tuple[str, ...]
    blackboardProvenance: tuple[BlackboardKeyProvenanceSource, ...]
    unresolvedCombatActions: tuple[str, ...]
    buffHolds: tuple[BuffHoldSource, ...] = ()
    targetGroupWrites: tuple[TargetGroupWriteSource, ...] = ()
    targetGroupControlFlowActions: tuple[ConditionalActionSource, ...] = ()
    auraActions: tuple[AuraActionSource, ...] = ()
    physicalInflictions: tuple[TimedPhysicalInflictionSource, ...] = ()
    eventListeners: tuple[SkillEventListenerSource, ...] = ()
    timeDilations: tuple[TimedTimeDilationSource, ...] = ()
    keywordActions: tuple[TimedKeywordActionSource, ...] = ()
    skillReplacements: tuple[TimedSkillReplacementSource, ...] = ()
    intervalDamageHits: tuple[TimedIntervalDamageSource, ...] = ()
    timelineJumps: tuple[TimedTimelineJumpSource, ...] = ()
    timelineJumpControlFlowActions: tuple[ConditionalActionSource, ...] = ()
    timelineFinishes: tuple[TimedTimelineFinishSource, ...] = ()
