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
    "TimedInflictionSource",
    "TimedResourceGainSource",
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
    "BuffEventActionSource",
    "EventBuffApplicationSource",
    "SkillEventActionSequenceSource",
    "SkillEventListenerSource",
    "EntityCountConditionSource",
    "BuffStackConditionSource",
    "HealthConditionSource",
    "MainOperatorConditionSource",
    "TargetReferenceSource",
    "TargetIdentityConditionSource",
    "DistanceConditionSource",
    "TimedMarkerConditionSource",
    "GlobalCooldownConditionSource",
    "SkillHasHitConditionSource",
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
    "ConditionalActionSource",
    "SequenceGuardActionSource",
    "SwitchActionSource",
    "DoOnceActionSource",
    "UnconditionalActionSource",
    "BlackboardCalculationSource",
    "BlackboardMutationSource",
    "BuffBlackboardReadSource",
    "BuffFinishSource",
    "BlackboardKeyProvenanceSource",
    "DeclaredBlackboardValueSource",
    "TargetGroupInputSource",
    "TargetGroupWriteSource",
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
    ignoredTargets: tuple[Literal["caster", "enemy"], ...]
    targets: tuple[Literal["caster", "enemy"], ...]
    omittedAbilityEntityTargets: int
    influenceSkillCooldown: ScalarSource | None
    targetScale: float | None
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
class AbilityEntityHitSource:
    spawnFrame: int
    actionOrder: tuple[int, ...]
    abilityEntityId: str
    skillId: str
    sourceFile: str
    entityBlackboardAssignments: tuple[EntityBlackboardAssignmentSource, ...]
    directDamageHits: tuple[TimedDamageSource, ...]
    intervalDamageHits: tuple[TimedIntervalDamageSource, ...]
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
    "damage",
    "condition",
    "blackboardCalculation",
    "blackboardMutation",
    "buffBlackboardRead",
    "buffFinish",
    "buffHold",
    "resourceGain",
    "infliction",
    "buffApplication",
    "eventListener",
    "timeDilation",
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
        " | SkillEventListenerSource"
        " | TimedTimeDilationSource"
    )
    # 仅条件动作会读取其调用者传入的 Target；这里保存投影后已确认的目标身份。
    inputTarget: Literal["enemy"] | None = None
    # 同帧且相同 sequenceOrder 的项目来自同一个原生 Sequence。
    sequenceOrder: tuple[int, ...] = ()


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
    directDamageHits: tuple[TimedDamageSource, ...]
    conditionalActions: tuple["ConditionalActionSource", ...]
    blackboardCalculations: tuple["BlackboardCalculationSource", ...]
    blackboardMutations: tuple["BlackboardMutationSource", ...]
    buffBlackboardReads: tuple["BuffBlackboardReadSource", ...]
    buffFinishes: tuple["BuffFinishSource", ...]
    eventActions: tuple["BuffEventActionSource", ...]
    resourceGains: tuple[TimedResourceGainSource, ...]
    combatActions: tuple[str, ...]
    unparsedPayloads: tuple["UnparsedBuffPayloadSource", ...]
    auraActions: tuple["AuraActionSource", ...] = ()


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
class BuffEventActionSource:
    eventSource: Literal["buff", "ability"]
    event: str
    orderedActionTypes: tuple[str, ...]
    combatActions: tuple[str, ...]
    damageUnits: tuple[DamageUnitSource, ...]
    buffApplications: tuple["EventBuffApplicationSource", ...]
    createdBuffIds: tuple[str, ...]


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


@dataclass(frozen=True)
class MainOperatorConditionSource:
    targetSource: str
    targetGroupKey: str


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


@dataclass(frozen=True)
class ConditionSource:
    sourceType: str
    supported: bool
    comparison: str | None
    left: ScalarSource | None
    right: ScalarSource | None
    skillTypes: tuple[str, ...]
    entityCount: EntityCountConditionSource | None = None
    buffStack: BuffStackConditionSource | None = None
    health: HealthConditionSource | None = None
    mainOperator: MainOperatorConditionSource | None = None
    targetIdentity: TargetIdentityConditionSource | None = None
    distance: DistanceConditionSource | None = None
    entityTag: "EntityTagConditionSource | None" = None
    timedMarker: "TimedMarkerConditionSource | None" = None
    globalCooldown: "GlobalCooldownConditionSource | None" = None
    skillHasHit: "SkillHasHitConditionSource | None" = None
    damageDecorateMask: "DamageDecorateMaskConditionSource | None" = None
    contextBuffId: "BuffIdInContextConditionSource | None" = None


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
    objectType: str
    filterSlot: bool
    slotIndex: int
    filterGameplayTag: bool
    tagQueryType: str
    tagIds: tuple[int, ...]


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
    blackboardMutation: BlackboardMutationPayload | None = None
    buffBlackboardRead: BuffBlackboardReadPayload | None = None
    buffFinish: BuffFinishPayload | None = None
    buffStackRead: BuffStackReadPayload | None = None
    buffApplication: BuffApplicationPayload | None = None
    timedMarkerApplication: TimedMarkerApplicationPayload | None = None
    globalCooldownApplication: GlobalCooldownApplicationPayload | None = None
    resourceGain: ResourceGainPayload | None = None
    infliction: InflictionPayload | None = None
    physicalInfliction: PhysicalInflictionPayload | None = None
    projectileLaunch: ProjectileLaunchPayload | None = None
    projectileTriggeredSkills: tuple[ProjectileTriggeredSkillSource, ...] | None = None
    abilityEntitySpawn: AbilityEntitySpawnPayload | None = None
    auraAbilityEntityHits: tuple[AbilityEntityHitSource, ...] | None = None
    damageUnits: tuple[DamageUnitSource, ...] | None = None


@dataclass(frozen=True)
class ConditionalActionSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    actionPath: tuple[str, ...]
    conditions: tuple[ConditionSource, ...]
    succeedActions: tuple[ConditionalBranchActionSource, ...]
    failActions: tuple[ConditionalBranchActionSource, ...]
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
class BlackboardCalculationSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    key: str
    operation: str
    left: ScalarSource
    right: ScalarSource
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
