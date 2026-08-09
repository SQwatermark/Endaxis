"""从解包 SkillData 生成 Next 干员数据的可审计中间层。"""

from __future__ import annotations

import argparse
import json
import math
import struct
import textwrap
from collections import Counter
from dataclasses import asdict, dataclass, fields, is_dataclass, replace
from pathlib import Path
from typing import Any, Iterable, Literal, cast


SCRIPT_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = SCRIPT_DIR.parents[1]
DEFAULT_MANIFEST = SCRIPT_DIR / "operators.json"
DEFAULT_SOURCE = REPOSITORY_ROOT.parent / "vfs-index-browser" / "combat-spec" / "artifacts" / "skill-data-cdn"
DEFAULT_TABLES = (
    REPOSITORY_ROOT.parent
    / "vfs-index-browser"
    / "combat-spec"
    / "artifacts"
    / "TableCfg-1.4.4-8764515-7"
)
DEFAULT_OUTPUT = REPOSITORY_ROOT / "src" / "next" / "data" / "operators" / "generated"

# Endaxis 固定为单敌人且命中必然发生；暂不模拟距离、轨迹和碰撞体。
ASSUMED_PROJECTILE_TRAVEL_FRAMES = 0

BUFF_STACKING_IDENTIFIER_TYPES = {"Id", "StackingKey"}
BUFF_STACKING_TYPES = {
    "Unlimited",
    "HighPriority",
    "Stack",
    "Enhance",
    "Refresh",
    "Extend",
    "Modify",
    "Unique",
    "EnhanceAndRefresh",
    "OverwriteDuration",
    "EnhanceAndOverwriteDuration",
    "HighPriorityWithMaxStack",
}
BUFF_ATTRIBUTE_TARGET_TYPES = {"Specific", "Main", "Sub", "All"}
BUFF_ATTRIBUTE_MODIFIER_SLOTS = {
    "Addition",
    "Multiplier",
    "FinalAddition",
    "FinalMultiplier",
    "BaseAddition",
    "BaseMultiplier",
    "BaseFinalAddition",
    "BaseFinalMultiplier",
}


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


@dataclass(frozen=True)
class TimedDamageSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    damageUnits: tuple[DamageUnitSource, ...]
    timedMarkerGate: "TimedMarkerGateSource | None" = None


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
    intervalFrames: int
    tickFrames: tuple[int, ...]
    damageActionIndex: int
    damageUnits: tuple[DamageUnitSource, ...]


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
    )
    # 仅条件动作会读取其调用者传入的 Target；这里保存投影后已确认的目标身份。
    inputTarget: Literal["enemy"] | None = None


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
    actionIndex: int
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


@dataclass(frozen=True)
class BlackboardMutationSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    key: str
    operation: str
    value: ScalarSource


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
    """SkillData 自身声明的动作黑板初值；SkillPatch 可按等级覆盖同名键。"""

    key: str
    value: float
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
    auraActions: tuple[AuraActionSource, ...] = ()


OPTIONAL_SOURCE_PAYLOAD_KEYS = frozenset(
    {
        "entityCount",
        "buffStack",
        "health",
        "mainOperator",
        "targetIdentity",
        "distance",
        "entityTag",
        "timedMarker",
        "globalCooldown",
        "skillHasHit",
        "nestedCondition",
        "targetFinderType",
        "onceScopeKey",
        "onceActions",
        "blackboardCalculation",
        "blackboardMutation",
        "buffBlackboardRead",
        "buffFinish",
        "buffStackRead",
        "buffApplication",
        "timedMarkerApplication",
        "globalCooldownApplication",
        "resourceGain",
        "infliction",
        "projectileLaunch",
        "projectileTriggeredSkills",
        "abilityEntitySpawn",
        "auraAbilityEntityHits",
        "damageUnits",
        "projectedAbilityEntitySpawns",
        "projectedProjectileLaunches",
    }
)

EMPTY_SOURCE_SEQUENCE_KEYS = frozenset(
    {
        "executionFrames",
        "projectedAbilityEntitySpawns",
        "projectedProjectileLaunches",
        "targetValidatorTypes",
        "targetPostProcessorTypes",
    }
)


def serialize_audit_value(value: Any) -> Any:
    """序列化审计对象，并省略仅对特定条件有意义的空详情。"""
    if hasattr(value, "__dataclass_fields__"):
        return serialize_audit_value(asdict(value))
    if isinstance(value, dict):
        return {
            key: serialize_audit_value(item)
            for key, item in value.items()
            if not (
                (key in EMPTY_SOURCE_SEQUENCE_KEYS and not item)
                or (key in OPTIONAL_SOURCE_PAYLOAD_KEYS and item is None)
            )
        }
    if isinstance(value, (list, tuple)):
        return [serialize_audit_value(item) for item in value]
    return value


def omit_empty_execution_frames(value: Any) -> Any:
    """保留旧审计结构，只省略没有重复执行语义的空帧列表。"""
    if hasattr(value, "__dataclass_fields__"):
        return omit_empty_execution_frames(asdict(value))
    if isinstance(value, dict):
        return {
            key: omit_empty_execution_frames(item)
            for key, item in value.items()
            if not (
                (key in EMPTY_SOURCE_SEQUENCE_KEYS and not item)
                or (key in OPTIONAL_SOURCE_PAYLOAD_KEYS and item is None)
            )
        }
    if isinstance(value, (list, tuple)):
        return [omit_empty_execution_frames(item) for item in value]
    return value


# 这些条件作为 SequenceAction 子项时会用返回值截断同一 actionData 的剩余动作。
SEQUENCE_GUARD_ACTION_NAMES = {
    "CheckDistanceCondition",
    "CheckMainCharacterCondition",
    "CheckTargetsEqual",
}

COMBAT_ACTION_NAMES = {
    "DamageAction",
    "CreateBuffAction",
    "DestroyBuffAction",
    "LaunchProjectile",
    "SpawnAbilityEntity",
    "AbilityEventAction",
    "BuffEventAction",
    "SpellInfliction",
    "ObtainCostAction",
    "IfElseAction",
    "SwitchAction",
    "FractureAction",
    "AuraAction",
    # 条件直接位于 SequenceAction 时会以 false 截断后续动作；在保留序列边界前必须视为战斗动作。
    *SEQUENCE_GUARD_ACTION_NAMES,
}

# 标记本身不造成伤害，但会改变后续条件、事件冷却或时间轴控制，必须参与完备性审计。
STATEFUL_COMBAT_ACTION_NAMES = {"CreateTimedMarker", "AddGlobalCDTimer"}
AUDITED_COMBAT_ACTION_NAMES = COMBAT_ACTION_NAMES | STATEFUL_COMBAT_ACTION_NAMES

# 这些根级标记已由专用单敌人投影等价消费；这里只阻止完备性审计重复计数。
CONSUMED_ROOT_TIMED_MARKERS = {
    (
        "chr_0030_zhuangfy_combo_skill_ult",
        "zhuangfy_combo_ult_tar",
    ),
}

# 分支动作与序列守卫本身只组织控制流；是否影响战斗取决于其子树中的实际效果动作。
COMBAT_EFFECT_ACTION_NAMES = COMBAT_ACTION_NAMES - {
    "IfElseAction",
    "SwitchAction",
    *SEQUENCE_GUARD_ACTION_NAMES,
}
AUDITED_COMBAT_EFFECT_ACTION_NAMES = (
    COMBAT_EFFECT_ACTION_NAMES | STATEFUL_COMBAT_ACTION_NAMES
)

# 这些运行时动作已单独解析，不进入 unresolvedCombatActions，但必须出现在条件分支审计中。
CONDITIONAL_AUDIT_ACTION_NAMES = COMBAT_ACTION_NAMES | {
    "AddGlobalCDTimer",
    "CreateTimedMarker",
    "FinishBuffAdvanced",
    "GetTargetBuffBBAdvanced",
    "ModifyDynamicBlackboard",
    "SaveBuffStackNumAdvanced",
    "SimpleCalcBBAction",
}
TAG_QUERY_TYPE_MAP = {
    "HasAny": "hasAny",
    "HasAll": "hasAll",
    "ExceptAny": "exceptAny",
    "ExceptAll": "exceptAll",
}
COMPARISON_OPERATOR_MAP = {
    "LT": "less",
    "LE": "lessOrEqual",
    "GT": "greater",
    "GE": "greaterOrEqual",
    "Equals": "equal",
    "NotEquals": "notEqual",
}
ACTION_VALUE_OPERATION_MAP = {
    "Assign": "assign",
    "Add": "add",
    "Multiply": "multiply",
    "Divide": "divide",
    "Floor": "floor",
    "Ceil": "ceil",
    "RoundToInt": "roundToInt",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--tables", type=Path, default=DEFAULT_TABLES)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--operator", action="append", dest="operators")
    parser.add_argument("--check", action="store_true", help="校验现有输出是否与重新生成结果一致")
    return parser.parse_args()


def require_dict(value: Any, path: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ValueError(f"{path}: expected object")
    return value


def require_list(value: Any, path: str) -> list[Any]:
    if not isinstance(value, list):
        raise ValueError(f"{path}: expected array")
    return value


def require_non_negative_int(value: Any, path: str) -> int:
    if not isinstance(value, int) or isinstance(value, bool) or value < 0:
        raise ValueError(f"{path}: expected non-negative integer")
    return value


def require_bool(value: Any, path: str) -> bool:
    if not isinstance(value, bool):
        raise ValueError(f"{path}: expected boolean")
    return value


def require_number(value: Any, path: str) -> float:
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        raise ValueError(f"{path}: expected number")
    return float(value)


def parse_vector3(value: Any, path: str) -> Vector3Source:
    vector = require_dict(value, path)
    if set(vector) != {"x", "y", "z"}:
        raise ValueError(f"{path}: unexpected fields {sorted(vector)}")
    return Vector3Source(
        x=require_number(vector.get("x"), f"{path}.x"),
        y=require_number(vector.get("y"), f"{path}.y"),
        z=require_number(vector.get("z"), f"{path}.z"),
    )


def require_server_action_index(action: dict[str, Any], path: str) -> int:
    """读取原生动作顺序；该值用于归并同帧动作，不能用遍历序号代替。"""
    return require_non_negative_int(action.get("serverActionIndex"), f"{path}.serverActionIndex")


def action_name(type_name: str) -> str:
    qualified = type_name.split(",", 1)[0]
    return qualified.rsplit(".", 1)[-1].split("+", 1)[0]


TARGET_GROUP_FIND_ACTION_FIELDS = {
    "$type",
    "advancedSelectorDirection",
    "center",
    "centerContextKey",
    "centerMountPoint",
    "centerToGround",
    "contextKey",
    "isEnable",
    "priorityLevel",
    "priorityOffset",
    "selectorData",
    "selectorDirection",
    "selectorOwner",
    "selectorOwnerContextKey",
    "serverActionIndex",
    "target",
    "targetGroupKey",
    "useAdvancedDirectionSetting",
    "useCenterEntityMountPoint",
}
TARGET_GROUP_MERGE_ACTION_FIELDS = {
    "$type",
    "isEnable",
    "priorityLevel",
    "priorityOffset",
    "serverActionIndex",
    "targetGroupKey",
    "targets",
}
TARGET_GROUP_MERGE_INPUT_FIELDS = {
    "advancedDirection",
    "centerContextKey",
    "centerToGround",
    "centerType",
    "enableAdvancedDirection",
    "ownerContextKey",
    "selectorData",
    "selectorDirection",
    "selectorOwner",
    "target",
    "targetContextKey",
    "targetGroupKey",
    "targetSource",
}
AURA_ACTION_FIELDS = {
    "$type",
    "isEnable",
    "priorityLevel",
    "priorityOffset",
    "serverActionIndex",
    "auraDebugName",
    "auraType",
    "auraRoot",
    "fixedWhenStart",
    "shapeData",
    "excludeColliderOptions",
    "targetObjectType",
    "targetFilter",
    "excludeOwner",
    "includeUnmarkable",
    "limitInfluenceCountPerTarget",
    "maxInfluenceCountPerTarget",
    "buffSource",
    "buffInput",
    "overrideBuffIconDuration",
    "buffIconDurationSource",
    "inheritSourceSkillCastId",
    "actionInAura",
    "actionWhenExitAura",
}
AURA_SHAPE_FIELDS = {
    "_shape",
    "_rotationOffset",
    "_useExtentKey",
    "_extent",
    "_extentXKey",
    "_extentYKey",
    "_extentZKey",
    "_useCenterKey",
    "_center",
    "_centerXKey",
    "_centerYKey",
    "_centerZKey",
    "_heightKey",
    "_height",
    "_radiusKey",
    "_radius",
}
AURA_TARGET_FILTER_FIELDS = {
    "checkAlive",
    "autoSetTargetFaction",
    "factionTarget",
    "targetFactionType",
    "filterObjectType",
    "objectType",
    "filterSlot",
    "slotIndex",
    "filterGameplayTag",
    "tagQuery",
}
AURA_SEQUENCE_FIELDS = {
    "actionData",
    "onlyExecuteWhenSourceIsMainChar",
    "onlyExecuteWhenSourceIsGuard",
}
KNOWN_TARGET_FINDER_TYPES = {
    "CharacterTeamFinder",
    "FixedPointFinder",
    "HitBoxFinder",
    "InFightEnemyFinder",
    "MainTargetFinder",
    "OwnerSpawnedEntityFinder",
    "PointFinder",
    "RandomPointFinder",
    "SmartTargetFinder",
    "SnapPointFinder",
    "SourceFinder",
}
KNOWN_TARGET_VALIDATOR_TYPES = {
    "DistanceValidator",
    "HittableObjectValidator",
    "MainCharacterValidator",
    "SkillCastIdValidator",
    "TagValidator",
    "TargetContainsValidator",
}
KNOWN_TARGET_POST_PROCESSOR_TYPES = {
    "ConvertToSlot",
    "ExcludeTarget",
    "PriorityFilter",
    "ShuffleTarget",
}


def selector_component_name(value: Any, path: str) -> str:
    """读取 Selector 嵌套类型名；该格式与普通 Action 的类型名层级不同。"""
    item = require_dict(value, path)
    type_name = item.get("$type")
    if not isinstance(type_name, str):
        raise ValueError(f"{path}.$type: expected string")
    parts = type_name.split(",", 1)[0].split("+")
    if len(parts) < 3 or parts[-1] != "Data" or not parts[-2]:
        raise ValueError(f"{path}.$type: unsupported selector type {type_name!r}")
    return parts[-2]


def parse_selector_summary(
    value: Any,
    path: str,
    *,
    finder_required: bool,
) -> tuple[
    str | None,
    str | None,
    str | None,
    bool | None,
    tuple[str, ...],
    tuple[str, ...],
]:
    """保留决定目标组语义的选择器类型，不复制碰撞体等大体积参数。"""
    selector = require_dict(value, path)
    expected_fields = {"validatorData", "postProcessorData"}
    if finder_required or "finderData" in selector:
        expected_fields.add("finderData")
    if set(selector) != expected_fields:
        raise ValueError(f"{path}: unexpected fields {sorted(selector)}")

    finder_type: str | None = None
    finder_faction_target: str | None = None
    finder_target_object_type: str | None = None
    finder_check_alive: bool | None = None
    if "finderData" in selector:
        finder_data = require_dict(selector.get("finderData"), f"{path}.finderData")
        finder_type = selector_component_name(finder_data, f"{path}.finderData")
        if finder_type not in KNOWN_TARGET_FINDER_TYPES:
            raise ValueError(f"{path}.finderData: unsupported finder {finder_type!r}")
        if finder_type == "HitBoxFinder":
            finder_faction_target = finder_data.get("factionTarget")
            finder_target_object_type = finder_data.get("targetObjectType")
            finder_check_alive = finder_data.get("checkAlive")
            if not isinstance(finder_faction_target, str) or not finder_faction_target:
                raise ValueError(f"{path}.finderData.factionTarget: expected non-empty string")
            if not isinstance(finder_target_object_type, str) or not finder_target_object_type:
                raise ValueError(
                    f"{path}.finderData.targetObjectType: expected non-empty string"
                )
            if not isinstance(finder_check_alive, bool):
                raise ValueError(f"{path}.finderData.checkAlive: expected boolean")
    elif finder_required:
        raise ValueError(f"{path}.finderData: expected object")

    validators = tuple(
        selector_component_name(item, f"{path}.validatorData[{index}]")
        for index, item in enumerate(require_list(selector.get("validatorData"), f"{path}.validatorData"))
    )
    unknown_validators = set(validators).difference(KNOWN_TARGET_VALIDATOR_TYPES)
    if unknown_validators:
        raise ValueError(f"{path}.validatorData: unsupported validators {sorted(unknown_validators)}")

    post_processors = tuple(
        selector_component_name(item, f"{path}.postProcessorData[{index}]")
        for index, item in enumerate(
            require_list(selector.get("postProcessorData"), f"{path}.postProcessorData")
        )
    )
    unknown_post_processors = set(post_processors).difference(
        KNOWN_TARGET_POST_PROCESSOR_TYPES
    )
    if unknown_post_processors:
        raise ValueError(
            f"{path}.postProcessorData: unsupported processors {sorted(unknown_post_processors)}"
        )
    return (
        finder_type,
        finder_faction_target,
        finder_target_object_type,
        finder_check_alive,
        validators,
        post_processors,
    )


def parse_target_reference(value: Any, path: str) -> TargetReferenceSource:
    """解析完整目标设置；未知字段必须阻止生成，不能被当作既有目标语义忽略。"""
    target = require_dict(value, path)
    if set(target) != TARGET_GROUP_MERGE_INPUT_FIELDS:
        raise ValueError(f"{path}: unexpected fields {sorted(target)}")
    target_source = target.get("targetSource")
    target_group_key = target.get("targetGroupKey")
    selector_owner = target.get("selectorOwner")
    owner_context_key = target.get("ownerContextKey")
    center_type = target.get("centerType")
    center_context_key = target.get("centerContextKey")
    raw_target = target.get("target")
    target_context_key = target.get("targetContextKey")
    selector_direction = target.get("selectorDirection")
    for key, item in (
        ("targetSource", target_source),
        ("selectorOwner", selector_owner),
        ("centerType", center_type),
        ("target", raw_target),
        ("selectorDirection", selector_direction),
    ):
        if not isinstance(item, str) or not item:
            raise ValueError(f"{path}.{key}: expected non-empty string")
    for key, item in (
        ("targetGroupKey", target_group_key),
        ("ownerContextKey", owner_context_key),
        ("centerContextKey", center_context_key),
        ("targetContextKey", target_context_key),
    ):
        if not isinstance(item, str):
            raise ValueError(f"{path}.{key}: expected string")
    finder, _, _, _, validators, post_processors = parse_selector_summary(
        target.get("selectorData"),
        f"{path}.selectorData",
        finder_required=target_source == "InstantSearch",
    )
    return TargetReferenceSource(
        targetSource=target_source,
        targetGroupKey=target_group_key,
        selectorOwner=selector_owner,
        ownerContextKey=owner_context_key,
        centerType=center_type,
        centerContextKey=center_context_key,
        centerToGround=require_bool(target.get("centerToGround"), f"{path}.centerToGround"),
        target=raw_target,
        targetContextKey=target_context_key,
        enableAdvancedDirection=require_bool(
            target.get("enableAdvancedDirection"), f"{path}.enableAdvancedDirection"
        ),
        selectorDirection=selector_direction,
        finderType=finder,
        validatorTypes=validators,
        postProcessorTypes=post_processors,
    )


def combat_action_signature(action: dict[str, Any]) -> tuple[Any, ...] | None:
    name = action_name(str(action.get("$type", "")))
    if name not in AUDITED_COMBAT_ACTION_NAMES or name == "IfElseAction":
        return None
    if name == "DamageAction":
        payload = action.get("damageUnits")
    elif name == "CreateBuffAction":
        payload = action.get("buffs")
    elif name == "DestroyBuffAction":
        payload = action.get("buffIdList")
    elif name == "LaunchProjectile":
        payload = (action.get("projectileId"), action.get("projectileSkillId"))
    elif name == "SpawnAbilityEntity":
        payload = (action.get("abilityEntityId"), action.get("abilityEntitySkillId"))
    elif name == "SpellInfliction":
        payload = (action.get("inflictionType"), action.get("isExtra"))
    elif name == "ObtainCostAction":
        payload = (
            action.get("costType"),
            action.get("isPercentValue"),
            action.get("costValue"),
            action.get("coefficient"),
        )
    else:
        payload = action
    return (name, json.dumps(payload, ensure_ascii=False, sort_keys=True))


def walk_actions(value: Any) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        if value.get("isEnable") is False:
            return
        type_name = value.get("$type")
        if isinstance(type_name, str) and action_name(type_name) == "IfElseAction":
            succeed = list(walk_actions(value.get("succeedActions")))
            fail = list(walk_actions(value.get("failActions")))
            succeed_signature = tuple(
                signature
                for action in succeed
                if (signature := combat_action_signature(action)) is not None
            )
            fail_signature = tuple(
                signature
                for action in fail
                if (signature := combat_action_signature(action)) is not None
            )
            if succeed_signature == fail_signature:
                yield from succeed
            else:
                yield value
                yield from succeed
                yield from fail
            return
        if isinstance(type_name, str):
            yield value
        for child in value.values():
            yield from walk_actions(child)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            if isinstance(child, dict):
                type_name = child.get("$type")
                if (
                    child.get("isEnable") is not False
                    and isinstance(type_name, str)
                    and action_name(type_name) in SEQUENCE_GUARD_ACTION_NAMES
                ):
                    # 纯表现尾部不进入战斗生成器；含战斗效果的尾部必须保留守卫并阻止误编译。
                    if contains_combat_effect(value[index + 1 :]):
                        yield child
                    continue
            yield from walk_actions(child)


def contains_combat_effect(value: Any) -> bool:
    """判断动作子树是否包含会改变单敌人战斗模拟结果的已知效果。"""
    if isinstance(value, dict):
        if value.get("isEnable") is False:
            return False
        type_name = value.get("$type")
        if (
            isinstance(type_name, str)
            and action_name(type_name) in AUDITED_COMBAT_EFFECT_ACTION_NAMES
        ):
            return True
        return any(contains_combat_effect(child) for child in value.values())
    if isinstance(value, list):
        return any(contains_combat_effect(child) for child in value)
    return False


def walk_unconditional_actions(value: Any) -> Iterable[dict[str, Any]]:
    """只展开动作列表容器；具体 Action 的子树必须交给对应语义解析器。"""
    if isinstance(value, dict):
        if isinstance(value.get("$type"), str):
            yield value
            return
        for child in value.values():
            yield from walk_unconditional_actions(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_unconditional_actions(child)


def to_float32(value: float) -> float:
    """按原生单精度指令的舍入方式保存中间结果。"""
    return struct.unpack("<f", struct.pack("<f", value))[0]


def project_channel_trigger_frames(
    start_frame: int,
    end_frame: int,
    *,
    execute_each_frame: bool,
    trigger_interval: float,
    max_count_per_target: int,
    target_trigger_interval: float,
) -> tuple[int, ...]:
    """投影固定 30 Hz、单目标模型下 ChannelingAction 的实际触发帧。

    原生动作先按全局扫描节奏寻找目标，再对每个目标分别检查次数和时间间隔。
    Endaxis 不模拟跳帧更新，因此这里逐逻辑帧推进；区间终点会先 Tick 再 End。
    """
    if start_frame < 0 or end_frame < start_frame:
        raise ValueError("channel frame range must be non-negative and ordered")
    if not isinstance(execute_each_frame, bool):
        raise ValueError("channel executeEachFrame must be boolean")
    if not isinstance(max_count_per_target, int) or isinstance(
        max_count_per_target, bool
    ):
        raise ValueError("channel maxCountPerTarget must be integer")
    for name, value in (
        ("triggerInterval", trigger_interval),
        ("targetTriggerInterval", target_trigger_interval),
    ):
        if (
            not isinstance(value, (int, float))
            or isinstance(value, bool)
            or not math.isfinite(value)
        ):
            raise ValueError(f"channel {name} must be a finite number")

    frame_delta = to_float32(1 / 30)
    trigger_interval_f32 = to_float32(float(trigger_interval))
    target_interval_f32 = to_float32(float(target_trigger_interval))
    timer = to_float32(0)
    global_trigger_count = 0
    target_trigger_count = 0
    last_target_trigger_time = to_float32(0)
    last_checked_frame = -1
    result: list[int] = []

    for frame in range(start_frame, end_frame + 1):
        # 技能施放入口会立即执行一次 OnTick(0, 0)；后续逻辑帧固定推进 1/30 秒。
        delta = 0.0 if frame == 0 else frame_delta
        timer = to_float32(timer + delta)
        previous_checked_frame = last_checked_frame
        last_checked_frame = frame

        should_scan = execute_each_frame and previous_checked_frame != frame
        if not should_scan:
            threshold = to_float32(
                to_float32(float(global_trigger_count)) * trigger_interval_f32
            )
            should_scan = timer >= threshold
        if not should_scan:
            continue
        global_trigger_count += 1

        if (
            max_count_per_target >= 0
            and target_trigger_count >= max_count_per_target
        ):
            continue
        if target_trigger_count > 0:
            elapsed = to_float32(timer - last_target_trigger_time)
            if not elapsed > target_interval_f32:
                continue

        result.append(frame)
        target_trigger_count += 1
        last_target_trigger_time = timer

    return tuple(result)


def project_single_enemy_channeling_timeline(
    root: dict[str, Any], source_name: str
) -> dict[str, Any]:
    """把根时间轴中的直接 ChannelingAction 展开为共享的一次性动作节点。

    该投影只接受可确定为敌人的 Context/Target 输入。Owner 需要把后续动作的 Target
    重新绑定为自身，不能用根技能目标代替，因此在引入显式输入目标身份前继续拒绝。
    """
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    timelines = require_list(
        group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions"
    )
    projected_timelines: list[dict[str, Any]] = []

    for timeline_index, raw_timeline in enumerate(timelines):
        timeline_path = f"{source_name}.timelineActions[{timeline_index}]"
        timeline = require_dict(raw_timeline, timeline_path)
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{timeline_path}._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{timeline_path}._endFrame"
        )
        sequence = require_dict(
            timeline.get("_sequenceActionData"), f"{timeline_path}._sequenceActionData"
        )
        # 部分子技能测试夹具和已归一化输入会直接把单个动作放在该字段；其中没有
        # 可安全抽取的兄弟 ChannelingAction，保持原节点交给后续严格解析器处理。
        if "actionData" not in sequence:
            projected_timelines.append(timeline)
            continue
        actions = require_list(
            sequence.get("actionData"), f"{timeline_path}._sequenceActionData.actionData"
        )
        retained_actions: list[Any] = []
        emitted_timelines: list[dict[str, Any]] = []

        for action_index, raw_action in enumerate(actions):
            action_path = f"{timeline_path}.actionData[{action_index}]"
            action = require_dict(raw_action, action_path)
            if action_name(str(action.get("$type", ""))) != "ChannelingAction":
                retained_actions.append(action)
                continue
            expected_fields = {
                "$type",
                "isEnable",
                "priorityLevel",
                "priorityOffset",
                "serverActionIndex",
                "targetSettings",
                "executeEachFrame",
                "triggerInterval",
                "maxCountPerTarget",
                "targetTriggerInterval",
                "actionOnTick",
            }
            if set(action) != expected_fields:
                raise ValueError(
                    f"{action_path}.ChannelingAction: unexpected fields {sorted(action)}"
                )
            if action.get("isEnable") is False:
                continue

            target = require_dict(
                action.get("targetSettings"),
                f"{action_path}.ChannelingAction.targetSettings",
            )
            target_source = target.get("targetSource")
            if target_source not in {"Context", "Target"}:
                raise ValueError(
                    f"{action_path}.ChannelingAction: target source {target_source!r} "
                    "requires explicit input target projection"
                )
            selector = require_dict(
                target.get("selectorData"),
                f"{action_path}.ChannelingAction.targetSettings.selectorData",
            )
            if selector.get("validatorData") != [] or selector.get("postProcessorData") != []:
                raise ValueError(
                    f"{action_path}.ChannelingAction: target selector is not identity-only"
                )
            if "finderData" in selector:
                raise ValueError(
                    f"{action_path}.ChannelingAction: target selector finder is unsupported"
                )
            if target_source == "Context" and not target.get("targetGroupKey"):
                raise ValueError(
                    f"{action_path}.ChannelingAction: Context target requires a group key"
                )

            trigger_frames = project_channel_trigger_frames(
                start_frame,
                end_frame,
                execute_each_frame=action.get("executeEachFrame"),
                trigger_interval=action.get("triggerInterval"),
                max_count_per_target=action.get("maxCountPerTarget"),
                target_trigger_interval=action.get("targetTriggerInterval"),
            )
            action_on_tick = require_dict(
                action.get("actionOnTick"),
                f"{action_path}.ChannelingAction.actionOnTick",
            )
            for frame in trigger_frames:
                emitted_timelines.append(
                    {
                        "_startFrame": frame,
                        "_endFrame": frame,
                        "_sequenceActionData": action_on_tick,
                        "forceSyncAnimData": False,
                    }
                )

        if retained_actions:
            retained_sequence = {**sequence, "actionData": retained_actions}
            projected_timelines.append(
                {**timeline, "_sequenceActionData": retained_sequence}
            )
        projected_timelines.extend(emitted_timelines)

    projected_group = {
        **group,
        "timelineActions": projected_timelines,
    }
    return {**root, "actionGroupData": projected_group}


def load_projected_skill_data(source_path: Path, source_name: str) -> dict[str, Any]:
    """加载技能数据，并建立后续所有语义解析器共享的单敌人时间轴视图。"""
    root = require_dict(json.loads(source_path.read_text(encoding="utf-8")), source_name)
    return project_single_enemy_channeling_timeline(root, source_name)


def walk_single_enemy_actions(value: Any, path: str) -> Iterable[dict[str, Any]]:
    """在固定单敌人模型下，仅把证据明确的逐目标容器退化为一次顺序执行。"""
    if isinstance(value, dict):
        type_name = value.get("$type")
        if isinstance(type_name, str):
            name = action_name(type_name)
            if name == "ChannelingAction":
                expected_fields = {
                    "$type",
                    "isEnable",
                    "priorityLevel",
                    "priorityOffset",
                    "serverActionIndex",
                    "targetSettings",
                    "executeEachFrame",
                    "triggerInterval",
                    "maxCountPerTarget",
                    "targetTriggerInterval",
                    "actionOnTick",
                }
                if set(value) != expected_fields:
                    raise ValueError(
                        f"{path}.ChannelingAction: unexpected fields {sorted(value)}"
                    )
                if value.get("isEnable") is False:
                    return
                if value.get("maxCountPerTarget") != 1:
                    raise ValueError(
                        f"{path}.ChannelingAction: only one trigger per target is supported"
                    )
                yield from walk_single_enemy_actions(
                    value.get("actionOnTick"), f"{path}.ChannelingAction.actionOnTick"
                )
                return
            if name != "ForEachAction":
                yield value
                return
            expected_fields = {
                "$type",
                "isEnable",
                "priorityLevel",
                "priorityOffset",
                "serverActionIndex",
                "target",
                "action",
            }
            if set(value) != expected_fields:
                raise ValueError(f"{path}.ForEachAction: unexpected fields {sorted(value)}")
            if value.get("isEnable") is False:
                return
            target = require_dict(value.get("target"), f"{path}.ForEachAction.target")
            target_source = target.get("targetSource")
            target_group = target.get("targetGroupKey")
            if not (
                (target_source == "Context" and isinstance(target_group, str) and target_group)
                or (target_source == "Target" and target_group == "")
            ):
                raise ValueError(f"{path}.ForEachAction: unsupported target collection")
            yield from walk_single_enemy_actions(
                value.get("action"), f"{path}.ForEachAction.action"
            )
            return
        for key, child in value.items():
            yield from walk_single_enemy_actions(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk_single_enemy_actions(child, f"{path}[{index}]")


def collect_timed_marker_damage_gates(value: Any, path: str) -> dict[int, TimedMarkerGateSource]:
    """识别 `检查目标标记 -> 伤害 -> 创建同标记` 的单目标去重序列。"""
    result: dict[int, TimedMarkerGateSource] = {}

    def visit(current: Any, current_path: str) -> None:
        if isinstance(current, list):
            for index, child in enumerate(current):
                visit(child, f"{current_path}[{index}]")
            return
        if not isinstance(current, dict):
            return
        if action_name(str(current.get("$type", ""))) == "ForEachAction":
            action_group = require_dict(current.get("action"), f"{current_path}.action")
            actions = [
                require_dict(raw, f"{current_path}.action.actionData[{index}]")
                for index, raw in enumerate(
                    require_list(action_group.get("actionData"), f"{current_path}.action.actionData")
                )
                if not isinstance(raw, dict) or raw.get("isEnable") is not False
            ]
            for index, action in enumerate(actions):
                if action_name(str(action.get("$type", ""))) != "DamageAction":
                    continue
                previous = actions[index - 1] if index > 0 else None
                following = actions[index + 1] if index + 1 < len(actions) else None
                if (
                    previous is None
                    or following is None
                    or action_name(str(previous.get("$type", ""))) != "CheckTimedMarkerCondition"
                    or action_name(str(following.get("$type", ""))) != "CreateTimedMarker"
                ):
                    continue
                check_target = require_dict(
                    previous.get("checkTarget"), f"{current_path}.CheckTimedMarkerCondition.checkTarget"
                )
                marker = require_dict(
                    following.get("markerId"), f"{current_path}.CreateTimedMarker.markerId"
                )
                duration = require_dict(
                    following.get("duration"), f"{current_path}.CreateTimedMarker.duration"
                )
                marker_key = previous.get("blackboardKey")
                if (
                    check_target.get("targetSource") != "Target"
                    or previous.get("useBlackboardKey") is not True
                    or not isinstance(marker_key, str)
                    or not marker_key
                    or marker.get("useBlackboardKey") is not True
                    or marker.get("blackboardKey") != marker_key
                    or duration.get("useBlackboardKey") is not False
                    or not isinstance(duration.get("value"), (int, float))
                    or isinstance(duration.get("value"), bool)
                ):
                    raise ValueError(f"{current_path}: unsupported timed marker damage gate")
                result[id(action)] = TimedMarkerGateSource(
                    markerBlackboardKey=marker_key,
                    returnTrueIfNotExists=previous.get("returnTrueIfNotExists") is True,
                    durationSeconds=float(duration["value"]),
                )
        for key, child in current.items():
            visit(child, f"{current_path}.{key}")

    visit(value, path)
    return result


def collect_once_resource_gain_gates(value: Any, path: str) -> dict[int, str]:
    """识别单敌人命中后只允许首次回能的动作黑板门。"""
    result: dict[int, str] = {}

    def visit(current: Any, current_path: str) -> None:
        if isinstance(current, list):
            for index, child in enumerate(current):
                visit(child, f"{current_path}[{index}]")
            return
        if not isinstance(current, dict):
            return
        raw_actions = current.get("actionData")
        if isinstance(raw_actions, list):
            actions = [require_dict(action, f"{current_path}.actionData") for action in raw_actions]
            for index in range(len(actions) - 3):
                check_entity, compare, gain, mutation = actions[index : index + 4]
                if [action_name(str(action.get("$type", ""))) for action in actions[index : index + 4]] != [
                    "CheckEntityNum",
                    "CompareFloat",
                    "ObtainCostAction",
                    "ModifyDynamicBlackboard",
                ]:
                    continue
                target = require_dict(
                    check_entity.get("checkTarget"), f"{current_path}.CheckEntityNum.checkTarget"
                )
                left = require_dict(compare.get("valueA"), f"{current_path}.CompareFloat.valueA")
                right = require_dict(compare.get("valueB"), f"{current_path}.CompareFloat.valueB")
                value = require_dict(
                    mutation.get("value"), f"{current_path}.ModifyDynamicBlackboard.value"
                )
                flag_key = left.get("blackboardKey")
                if not (
                    target.get("targetSource") == "Context"
                    and isinstance(target.get("targetGroupKey"), str)
                    and target.get("targetGroupKey")
                    and check_entity.get("minNum") == 1
                    and check_entity.get("compareType") == "GE"
                    and left.get("useBlackboardKey") is True
                    and isinstance(flag_key, str)
                    and flag_key
                    and compare.get("compare") == "Equals"
                    and right.get("useBlackboardKey") is False
                    and right.get("value") == 0
                    and mutation.get("key") == flag_key
                    and mutation.get("operation") == "Assign"
                    and mutation.get("directValue") is True
                    and value.get("useBlackboardKey") is False
                    and value.get("value") == 1
                ):
                    raise ValueError(f"{current_path}: unsupported once-only resource gain gate")
                result[id(gain)] = flag_key
        for key, child in current.items():
            visit(child, f"{current_path}.{key}")

    visit(value, path)
    return result


def collect_blackboard_keys(value: Any) -> tuple[str, ...]:
    keys: set[str] = set()
    if isinstance(value, dict):
        if value.get("useBlackboardKey") is True:
            key = value.get("blackboardKey")
            if key:
                if not isinstance(key, str):
                    raise ValueError("non-empty blackboardKey must be a string")
                keys.add(key)
        for child in value.values():
            keys.update(collect_blackboard_keys(child))
    elif isinstance(value, list):
        for child in value:
            keys.update(collect_blackboard_keys(child))
    return tuple(sorted(keys))


def parse_declared_blackboard(
    root: dict[str, Any], source_name: str
) -> tuple[DeclaredBlackboardValueSource, ...]:
    """严格读取 SkillData 的数值黑板声明，不把运行时引用误当作声明。"""
    result: list[DeclaredBlackboardValueSource] = []
    for index, raw_entry in enumerate(require_list(root.get("blackboard"), f"{source_name}.blackboard")):
        entry = require_dict(raw_entry, f"{source_name}.blackboard[{index}]")
        key = entry.get("key")
        if not isinstance(key, str) or not key:
            raise ValueError(f"{source_name}.blackboard[{index}].key: expected non-empty string")
        value = entry.get("valueDouble")
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            raise ValueError(f"{source_name}.blackboard[{index}].valueDouble: expected number")
        if entry.get("valueStr") != "":
            raise ValueError(f"{source_name}.blackboard[{index}].valueStr: expected empty string")
        is_dynamic = entry.get("isDynamic")
        if not isinstance(is_dynamic, bool):
            raise ValueError(f"{source_name}.blackboard[{index}].isDynamic: expected boolean")
        result.append(DeclaredBlackboardValueSource(key, float(value), is_dynamic))
    if len({item.key for item in result}) != len(result):
        raise ValueError(f"{source_name}.blackboard: duplicate key")
    return tuple(sorted(result, key=lambda item: item.key))


def collect_declared_blackboard_keys(root: dict[str, Any], source_name: str) -> tuple[str, ...]:
    return tuple(item.key for item in parse_declared_blackboard(root, source_name))


def build_blackboard_provenance(
    root: dict[str, Any],
    source_name: str,
    patch: SkillPatchSource,
    calculations: tuple[BlackboardCalculationSource, ...],
    mutations: tuple[BlackboardMutationSource, ...],
    reads: tuple[BuffBlackboardReadSource, ...],
) -> tuple[BlackboardKeyProvenanceSource, ...]:
    referenced = set(collect_blackboard_keys(root))
    declared = set(collect_declared_blackboard_keys(root, source_name))
    supplied = set(patch.blackboard)
    calculated = {item.key for item in calculations}
    mutated = {item.key for item in mutations}
    read = {item.outputKey for item in reads}
    keys = referenced | declared | supplied | calculated | mutated | read
    return tuple(
        BlackboardKeyProvenanceSource(
            key=key,
            declaredInSkill=key in declared,
            suppliedByPatch=key in supplied,
            calculatedLocally=key in calculated,
            mutatedLocally=key in mutated,
            readFromBuff=key in read,
            externalRuntimeInput=(
                key in referenced
                and key not in declared
                and key not in supplied
                and key not in calculated
                and key not in mutated
                and key not in read
            ),
        )
        for key in sorted(keys)
    )


def parse_scalar(
    value: Any,
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> ScalarSource:
    source = require_dict(value, path)
    raw_value = source.get("value")
    if not isinstance(raw_value, (int, float)) or isinstance(raw_value, bool):
        raise ValueError(f"{path}.value: expected number")
    use_blackboard = source.get("useBlackboardKey")
    if not isinstance(use_blackboard, bool):
        raise ValueError(f"{path}.useBlackboardKey: expected boolean")
    key = source.get("blackboardKey")
    if not isinstance(key, str):
        raise ValueError(f"{path}.blackboardKey: expected string")
    if use_blackboard and not key:
        raise ValueError(f"{path}: active scalar blackboard reference has no key")
    blackboard_key = key if use_blackboard else None
    level_values = inherited_blackboard.get(blackboard_key) if blackboard_key else None
    return ScalarSource(
        value=float(raw_value),
        blackboardKey=blackboard_key,
        levelValues=level_values,
    )


def resolve_skill_blackboard(
    root: dict[str, Any],
    source_name: str,
    patch: SkillPatchSource,
) -> dict[str, tuple[float, ...]]:
    """合并技能静态默认值与逐等级补丁；动态声明不能在导入时冻结。"""
    resolved = {
        item.key: (item.value,) * len(patch.levels)
        for item in parse_declared_blackboard(root, source_name)
        if not item.isDynamic
    }
    resolved.update(patch.blackboard)
    return resolved


def parse_blackboard_calculation_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> BlackboardCalculationPayload:
    key = action.get("key")
    operation = action.get("operation")
    if not isinstance(key, str) or not key:
        raise ValueError(f"{path}.key: expected non-empty string")
    if not isinstance(operation, str) or not operation:
        raise ValueError(f"{path}.operation: expected non-empty string")
    return BlackboardCalculationPayload(
        key=key,
        operation=operation,
        left=parse_scalar(action.get("value1"), f"{path}.value1", inherited_blackboard),
        right=parse_scalar(action.get("value2"), f"{path}.value2", inherited_blackboard),
    )


def parse_blackboard_mutation_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> BlackboardMutationPayload:
    key = action.get("key")
    operation = action.get("operation")
    if not isinstance(key, str) or not key:
        raise ValueError(f"{path}.key: expected non-empty string")
    if not isinstance(operation, str) or not operation:
        raise ValueError(f"{path}.operation: expected non-empty string")
    if action.get("directValue") is not True:
        raise ValueError(f"{path}.directValue: unsupported false")
    return BlackboardMutationPayload(
        key=key,
        operation=operation,
        value=parse_scalar(action.get("value"), f"{path}.value", inherited_blackboard),
    )


def parse_buff_blackboard_read_payload(
    action: dict[str, Any],
    path: str,
) -> BuffBlackboardReadPayload:
    output_key = action.get("blackboardKey")
    desired_key = action.get("desiredKey")
    if not isinstance(output_key, str) or not output_key:
        raise ValueError(f"{path}.blackboardKey: expected non-empty string")
    if not isinstance(desired_key, str) or not desired_key:
        raise ValueError(f"{path}.desiredKey: expected non-empty string")
    target = require_dict(action.get("targetSettings"), f"{path}.targetSettings")
    check_type, buff_ids, query_type, tag_ids = parse_buff_find_settings(
        action.get("buffSettings"), f"{path}.buffSettings"
    )
    return BuffBlackboardReadPayload(
        outputKey=output_key,
        desiredKey=desired_key,
        targetSource=str(target.get("targetSource", "")),
        targetGroupKey=str(target.get("targetGroupKey", "")),
        buffCheckType=check_type,
        buffIds=buff_ids,
        tagQueryType=query_type,
        buffTagIds=tag_ids,
    )


def parse_buff_finish_payload(action: dict[str, Any], path: str) -> BuffFinishPayload:
    target = require_dict(action.get("buffOwner"), f"{path}.buffOwner")
    check_type, buff_ids, query_type, tag_ids = parse_buff_find_settings(
        action.get("buffSettings"), f"{path}.buffSettings"
    )
    return BuffFinishPayload(
        targetSource=str(target.get("targetSource", "")),
        targetGroupKey=str(target.get("targetGroupKey", "")),
        buffCheckType=check_type,
        buffIds=buff_ids,
        tagQueryType=query_type,
        buffTagIds=tag_ids,
        finishAll=action.get("finishAll") is True,
        limitSource=action.get("limitSource") is True,
        isFinishedEarly=action.get("isFinishedEarly") is True,
        isAbsorbed=action.get("isAbsorbed") is True,
    )


def parse_buff_stack_read_payload(action: dict[str, Any], path: str) -> BuffStackReadPayload:
    output_key = action.get("key")
    count_type = action.get("buffStackNumType")
    limit_skill_cast_id = action.get("limitSkillCastId")
    if not isinstance(output_key, str) or not output_key:
        raise ValueError(f"{path}.key: expected non-empty string")
    if not isinstance(count_type, str) or not count_type:
        raise ValueError(f"{path}.buffStackNumType: expected non-empty string")
    if not isinstance(limit_skill_cast_id, bool):
        raise ValueError(f"{path}.limitSkillCastId: expected boolean")
    target = require_dict(action.get("checkTarget"), f"{path}.checkTarget")
    check_type, buff_ids, query_type, tag_ids = parse_buff_find_settings(
        action.get("buffSettings"), f"{path}.buffSettings"
    )
    return BuffStackReadPayload(
        outputKey=output_key,
        targetSource=str(target.get("targetSource", "")),
        targetGroupKey=str(target.get("targetGroupKey", "")),
        buffCheckType=check_type,
        buffIds=buff_ids,
        tagQueryType=query_type,
        buffTagIds=tag_ids,
        countType=count_type,
        limitSkillCastId=limit_skill_cast_id,
    )


def parse_buff_application_entries(
    value: Any,
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[BuffApplicationEntryPayload, ...]:
    buffs: list[BuffApplicationEntryPayload] = []
    for index, raw_buff in enumerate(require_list(value, path)):
        buff_path = f"{path}[{index}]"
        buff = require_dict(raw_buff, buff_path)
        buff_id = buff.get("buffId")
        if not isinstance(buff_id, str) or not buff_id:
            raise ValueError(f"{buff_path}.buffId: expected non-empty string")
        buffs.append(
            BuffApplicationEntryPayload(
                buffId=buff_id,
                classification=classify_buff(buff_id),
                blackboardAssignments=parse_buff_assignments(
                    buff,
                    buff_path,
                    inherited_blackboard,
                ),
            )
        )
    return tuple(buffs)


def parse_buff_application_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> BuffApplicationPayload:
    target_settings = require_dict(action.get("targetSettings"), f"{path}.targetSettings")
    target_source = str(target_settings.get("targetSource", ""))
    target_finder_type: str | None = None
    target_validator_types: tuple[str, ...] = ()
    target_post_processor_types: tuple[str, ...] = ()
    if target_source == "InstantSearch":
        (
            target_finder_type,
            _,
            _,
            _,
            target_validator_types,
            target_post_processor_types,
        ) = parse_selector_summary(
            target_settings.get("selectorData"),
            f"{path}.targetSettings.selectorData",
            finder_required=True,
        )
    buff_source = action.get("buffSource")
    if not isinstance(buff_source, str) or not buff_source:
        raise ValueError(f"{path}.buffSource: expected non-empty string")
    context_key = action.get("contextKey", "")
    if not isinstance(context_key, str):
        raise ValueError(f"{path}.contextKey: expected string")
    if buff_source == "ContextTarget" and not context_key:
        raise ValueError(f"{path}.contextKey: ContextTarget requires a non-empty key")
    return BuffApplicationPayload(
        buffs=parse_buff_application_entries(
            action.get("buffs"), f"{path}.buffs", inherited_blackboard
        ),
        targetSource=target_source,
        targetGroupKey=str(target_settings.get("targetGroupKey", "")),
        count=parse_scalar(action.get("count"), f"{path}.count", inherited_blackboard),
        buffSource=buff_source,
        buffSourceContextKey=context_key,
        inheritSourceSkillCastInfo=require_bool(
            action.get("inheritSourceSkillCastInfo"),
            f"{path}.inheritSourceSkillCastInfo",
        ),
        targetFinderType=target_finder_type,
        targetValidatorTypes=target_validator_types,
        targetPostProcessorTypes=target_post_processor_types,
    )


def parse_resource_gain_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> ResourceGainPayload:
    raw_resource = action.get("costType")
    resource = RESOURCE_TYPE_MAP.get(raw_resource)
    if resource is None:
        raise ValueError(f"{path}.costType: unsupported value {raw_resource!r}")
    is_percent_value = require_bool(action.get("isPercentValue"), f"{path}.isPercentValue")
    atb_source_type = action.get("atbSourceType")
    atb_gain_method = action.get("atbGainMethod")
    sp_gain_source = {
        "Default": "default",
        "NormalAttack": "normalAttack",
        "PowerAttack": "powerAttack",
        "Skill": "skill",
    }.get(atb_source_type)
    sp_gain_kind = {"Gain": "gain", "Return": "refund"}.get(atb_gain_method)
    if sp_gain_source is None:
        raise ValueError(f"{path}.atbSourceType: unsupported value {atb_source_type!r}")
    if sp_gain_kind is None:
        raise ValueError(f"{path}.atbGainMethod: unsupported value {atb_gain_method!r}")
    recovery_tag = require_dict(action.get("uspRecoverTag"), f"{path}.uspRecoverTag")
    return ResourceGainPayload(
        resource=resource,
        amount=parse_scalar(action.get("costValue"), f"{path}.costValue", inherited_blackboard),
        coefficient=parse_scalar(
            action.get("coefficient"),
            f"{path}.coefficient",
            inherited_blackboard,
        ),
        spGainKind=sp_gain_kind if resource == "sp" else None,
        spGainSource=sp_gain_source if resource == "sp" else None,
        onlyMainOperator=require_bool(action.get("atbOnlyMainChar"), f"{path}.atbOnlyMainChar"),
        isPercentValue=is_percent_value,
        useUltimateRecoveryTag=require_bool(
            action.get("useUspRecoverTag"), f"{path}.useUspRecoverTag"
        ),
        ultimateRecoveryTagId=require_non_negative_int(
            recovery_tag.get("tagId"), f"{path}.uspRecoverTag.tagId"
        ),
        ignoreUltimateGainScalar=require_bool(
            action.get("ignoreUspGainScalar"), f"{path}.ignoreUspGainScalar"
        ),
    )


def parse_projectile_launch_payload(
    action: dict[str, Any],
    path: str,
) -> ProjectileLaunchPayload:
    projectile_id = action.get("projectileId")
    if not isinstance(projectile_id, str) or not projectile_id:
        raise ValueError(f"{path}.projectileId: expected non-empty string")
    assign_blackboard = require_bool(action.get("assignBlackboard"), f"{path}.assignBlackboard")
    trigger_fields = (
        ("hit", "castSkillOnHit", "projectileSkillId"),
        ("block", "castSkillOnBlock", "skillIdOnBlock"),
        ("reach", "castSkillOnReach", "skillIdOnReach"),
        ("finish", "castSkillOnFinish", "skillIdOnFinish"),
    )
    triggers: list[ProjectileSkillTriggerSource] = []
    for event, enabled_field, skill_field in trigger_fields:
        enabled = action.get(enabled_field, False)
        if not isinstance(enabled, bool):
            raise ValueError(f"{path}.{enabled_field}: expected boolean")
        if not enabled:
            continue
        skill_id = action.get(skill_field)
        if not isinstance(skill_id, str) or not skill_id:
            raise ValueError(f"{path}.{skill_field}: enabled projectile event requires a skill")
        triggers.append(ProjectileSkillTriggerSource(event=event, skillId=skill_id))
    return ProjectileLaunchPayload(
        projectileId=projectile_id,
        skillTriggers=tuple(triggers),
        assignBlackboard=assign_blackboard,
        entityBlackboardAssignments=parse_entity_blackboard_assignments(action, path),
    )


def is_projectile_trigger_excluded_for_single_enemy(
    root: dict[str, Any],
    launch_frame: int,
    launch_action_index: int,
    trigger_root: dict[str, Any],
    trigger_source_name: str,
) -> bool:
    """识别先标记主目标、再仅处理未标记命中目标的额外目标投射物。"""

    active_markers: set[str] = set()
    group = require_dict(root.get("actionGroupData"), "projectile source.actionGroupData")
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), "projectile source.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"projectile source.timelineActions[{timeline_index}]")
        marker_frame = require_non_negative_int(
            timeline.get("_startFrame"),
            f"projectile source.timelineActions[{timeline_index}]._startFrame",
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action.get("isEnable") is False or action_name(action["$type"]) != "CreateTimedMarker":
                continue
            action_index = require_server_action_index(action, "projectile source.CreateTimedMarker")
            if marker_frame > launch_frame or (
                marker_frame == launch_frame and action_index >= launch_action_index
            ):
                continue
            target = require_dict(
                action.get("targetSettings"), "projectile source.CreateTimedMarker.targetSettings"
            )
            marker = require_dict(
                action.get("markerId"), "projectile source.CreateTimedMarker.markerId"
            )
            duration = require_dict(
                action.get("duration"), "projectile source.CreateTimedMarker.duration"
            )
            if (
                target.get("targetSource") != "Context"
                or target.get("targetGroupKey") != "smart_target"
                or marker.get("useBlackboardKey") is not False
                or not isinstance(marker.get("value"), str)
                or not marker["value"]
                or duration.get("useBlackboardKey") is not False
                or not isinstance(duration.get("value"), (int, float))
                or isinstance(duration.get("value"), bool)
            ):
                continue
            elapsed_seconds = (launch_frame - marker_frame) / 30
            if float(duration["value"]) > elapsed_seconds:
                active_markers.add(marker["value"])

    if not active_markers:
        return False

    combat_actions = [
        action
        for action in walk_actions(trigger_root.get("actionGroupData"))
        if action_name(action["$type"]) in COMBAT_ACTION_NAMES
    ]
    if not combat_actions:
        return False

    guarded_combat_action_ids: set[int] = set()
    for action in walk_actions(trigger_root.get("actionGroupData")):
        if action_name(action["$type"]) != "ForEachAction":
            continue
        target = require_dict(action.get("target"), f"{trigger_source_name}.ForEachAction.target")
        if target.get("targetSource") != "Target" or target.get("targetGroupKey") != "":
            continue
        nested = require_dict(action.get("action"), f"{trigger_source_name}.ForEachAction.action")
        nested_actions = [
            require_dict(item, f"{trigger_source_name}.ForEachAction.action.actionData")
            for item in require_list(
                nested.get("actionData"), f"{trigger_source_name}.ForEachAction.action.actionData"
            )
            if not isinstance(item, dict) or item.get("isEnable") is not False
        ]
        if not nested_actions:
            continue
        check = nested_actions[0]
        if action_name(str(check.get("$type", ""))) != "CheckTimedMarkerCondition":
            continue
        check_target = require_dict(
            check.get("checkTarget"), f"{trigger_source_name}.CheckTimedMarkerCondition.checkTarget"
        )
        marker_id = check.get("id")
        if (
            check_target.get("targetSource") != "Target"
            or check_target.get("targetGroupKey") != ""
            or check.get("useBlackboardKey") is not False
            or check.get("returnTrueIfNotExists") is not True
            or marker_id not in active_markers
        ):
            continue
        guarded_combat_action_ids.update(
            id(item)
            for item in walk_actions({"actionData": nested_actions[1:]})
            if action_name(item["$type"]) in COMBAT_ACTION_NAMES
        )

    return all(id(action) in guarded_combat_action_ids for action in combat_actions)


def parse_entity_blackboard_assignments(
    action: dict[str, Any],
    path: str,
) -> tuple[EntityBlackboardAssignmentSource, ...]:
    """严格解析动作写入新实体黑板的显式赋值，并识别编辑器的关闭态空占位。"""
    assign_entity_blackboard = require_bool(
        action.get("assignEntityBlackboard"),
        f"{path}.assignEntityBlackboard",
    )
    raw_assignments = require_list(action.get("assignPairs"), f"{path}.assignPairs")
    if not assign_entity_blackboard:
        disabled_placeholder = [
            {
                "targetKey": "",
                "inputValueKey": "",
                "useDirectValue": False,
                "directValueType": "Numeric",
                "numericValue": 0.0,
                "stringValue": "",
            }
        ]
        if raw_assignments and raw_assignments != disabled_placeholder:
            raise ValueError(f"{path}.assignPairs: expected empty when assignment is disabled")
        return ()
    assignments: list[EntityBlackboardAssignmentSource] = []
    for index, raw_assignment in enumerate(raw_assignments):
        assignment = require_dict(raw_assignment, f"{path}.assignPairs[{index}]")
        target_key = assignment.get("targetKey")
        value_type = assignment.get("directValueType")
        numeric_value = assignment.get("numericValue")
        string_value = assignment.get("stringValue")
        use_direct_value = assignment.get("useDirectValue")
        input_value_key = assignment.get("inputValueKey")
        if not isinstance(use_direct_value, bool):
            raise ValueError(f"{path}.assignPairs[{index}].useDirectValue: expected boolean")
        if not isinstance(input_value_key, str):
            raise ValueError(f"{path}.assignPairs[{index}].inputValueKey: expected string")
        if not use_direct_value and not input_value_key:
            raise ValueError(
                f"{path}.assignPairs[{index}]: indirect assignment requires an input key"
            )
        if not isinstance(target_key, str) or not target_key:
            raise ValueError(f"{path}.assignPairs[{index}].targetKey: expected string")
        if value_type not in {"String", "Numeric"}:
            raise ValueError(
                f"{path}.assignPairs[{index}].directValueType: unsupported {value_type!r}"
            )
        if not isinstance(numeric_value, (int, float)) or isinstance(numeric_value, bool):
            raise ValueError(f"{path}.assignPairs[{index}].numericValue: expected number")
        if not isinstance(string_value, str):
            raise ValueError(f"{path}.assignPairs[{index}].stringValue: expected string")
        assignments.append(
            EntityBlackboardAssignmentSource(
                targetKey=target_key,
                valueType=value_type,
                numericValue=float(numeric_value),
                stringValue=string_value,
                useDirectValue=use_direct_value,
                inputValueKey=input_value_key,
            )
        )
    return tuple(assignments)


def parse_ability_entity_spawn_payload(
    action: dict[str, Any],
    path: str,
) -> AbilityEntitySpawnPayload:
    ability_id = action.get("abilityEntityId")
    skill_id = action.get("abilityEntitySkillId")
    if not isinstance(ability_id, str) or not ability_id:
        raise ValueError(f"{path}.abilityEntityId: expected non-empty string")
    if not isinstance(skill_id, str):
        raise ValueError(f"{path}.abilityEntitySkillId: expected string")
    assign_blackboard = require_bool(action.get("assignBlackboard"), f"{path}.assignBlackboard")
    return AbilityEntitySpawnPayload(
        abilityEntityId=ability_id,
        skillId=skill_id or None,
        entityBlackboardAssignments=parse_entity_blackboard_assignments(action, path),
        assignBlackboard=assign_blackboard,
    )


def parse_conditional_actions(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
    consumed_action_ids: frozenset[int] = frozenset(),
) -> tuple[ConditionalActionSource, ...]:
    """按原始顺序保留会改变战斗行为的 IfElse 树；展示动作不进入审计层。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[ConditionalActionSource] = []
    once_scope_keys: dict[int, str] = {}

    def parse_condition(raw_condition: Any, path: str) -> ConditionSource:
        condition = require_dict(raw_condition, path)
        condition_type = action_name(str(condition.get("$type", "")))
        if condition_type == "CompareFloat":
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=str(condition.get("compare", "")),
                left=parse_scalar(condition.get("valueA"), f"{path}.valueA", inherited_blackboard),
                right=parse_scalar(condition.get("valueB"), f"{path}.valueB", inherited_blackboard),
                skillTypes=(),
            )
        if condition_type == "CheckSkillType":
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=tuple(
                    str(item)
                    for item in require_list(condition.get("skillTypeList"), f"{path}.skillTypeList")
                ),
            )
        if condition_type == "CheckEntityNum":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            minimum_count = condition.get("minNum")
            if not isinstance(minimum_count, int) or isinstance(minimum_count, bool):
                raise ValueError(f"{path}.minNum: expected integer")
            contains_hittable = condition.get("containsHittableTarget")
            exclude_dead = condition.get("excludeDeadEntity")
            store_key = condition.get("storeKey")
            if not isinstance(contains_hittable, bool):
                raise ValueError(f"{path}.containsHittableTarget: expected boolean")
            if not isinstance(exclude_dead, bool):
                raise ValueError(f"{path}.excludeDeadEntity: expected boolean")
            if not isinstance(store_key, str):
                raise ValueError(f"{path}.storeKey: expected string")
            return ConditionSource(
                sourceType=condition_type,
                # 原生目标集合尚未进入单敌人模拟；这里只保真审计参数。
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                entityCount=EntityCountConditionSource(
                    targetSource=str(target.get("targetSource", "")),
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    minimumCount=minimum_count,
                    comparison=str(condition.get("compareType", "")),
                    containsHittableTarget=contains_hittable,
                    excludeDeadEntity=exclude_dead,
                    storeKey=store_key,
                ),
            )
        if condition_type == "CheckBuffStackNum":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            buff_id_value = require_dict(condition.get("buffId"), f"{path}.buffId")
            buff_id = buff_id_value.get("buffId")
            if not isinstance(buff_id, str) or not buff_id:
                raise ValueError(f"{path}.buffId.buffId: expected non-empty string")
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                buffStack=BuffStackConditionSource(
                    targetSource=str(target.get("targetSource", "")),
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    buffCheckType="Id",
                    buffIds=(buff_id,),
                    tagQueryType="hasAny",
                    buffTagIds=(),
                    countType="BuffCount",
                    comparison=str(condition.get("compareType", "")),
                    value=parse_scalar(
                        condition.get("value"),
                        f"{path}.value",
                        inherited_blackboard,
                    ),
                    limitSkillCastId=False,
                ),
            )
        if condition_type == "CheckBuffStackNumAdvanced":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            check_type, buff_ids, query_type, tag_ids = parse_buff_find_settings(
                condition.get("buffSettings"), f"{path}.buffSettings"
            )
            count_type = condition.get("buffStackNumType")
            limit_skill_cast_id = condition.get("limitSkillCastId")
            if not isinstance(count_type, str) or not count_type:
                raise ValueError(f"{path}.buffStackNumType: expected string")
            if not isinstance(limit_skill_cast_id, bool):
                raise ValueError(f"{path}.limitSkillCastId: expected boolean")
            return ConditionSource(
                sourceType=condition_type,
                supported=(
                    count_type == "BuffCount"
                    and not limit_skill_cast_id
                    and check_type in {"Id", "Tag"}
                ),
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                buffStack=BuffStackConditionSource(
                    targetSource=str(target.get("targetSource", "")),
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    buffCheckType=check_type,
                    buffIds=buff_ids,
                    tagQueryType=query_type,
                    buffTagIds=tag_ids,
                    countType=count_type,
                    comparison=str(condition.get("compareType", "")),
                    value=parse_scalar(condition.get("value"), f"{path}.value", inherited_blackboard),
                    limitSkillCastId=limit_skill_cast_id,
                ),
            )
        if condition_type == "CheckBuffStackNumByTag":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            query_type, tag_ids = parse_tag_query(
                condition.get("tagQuery"),
                f"{path}.tagQuery",
            )
            count_type = condition.get("buffStackNumType")
            if not isinstance(count_type, str) or not count_type:
                raise ValueError(f"{path}.buffStackNumType: expected string")
            target_source = str(target.get("targetSource", ""))
            return ConditionSource(
                sourceType=condition_type,
                supported=(
                    target_source == "Target"
                    and count_type == "BuffCount"
                    and bool(tag_ids)
                ),
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                buffStack=BuffStackConditionSource(
                    targetSource=target_source,
                    # 原生动作仅在 Context 来源时读取该键；Target 来源会直接读取传入目标。
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    buffCheckType="Tag",
                    buffIds=(),
                    tagQueryType=query_type,
                    buffTagIds=tag_ids,
                    countType=count_type,
                    comparison=str(condition.get("compareType", "")),
                    value=parse_scalar(
                        condition.get("value"),
                        f"{path}.value",
                        inherited_blackboard,
                    ),
                    limitSkillCastId=False,
                ),
            )
        if condition_type == "CheckTagMatch":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            query_type, tag_ids = parse_tag_query(
                condition.get("query"),
                f"{path}.query",
            )
            return ConditionSource(
                sourceType=condition_type,
                supported=bool(tag_ids),
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                entityTag=EntityTagConditionSource(
                    targetSource=str(target.get("targetSource", "")),
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    tagQueryType=query_type,
                    tagIds=tag_ids,
                ),
            )
        if condition_type == "CheckTimedMarkerCondition":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            marker_id = condition.get("id")
            blackboard_key = condition.get("blackboardKey")
            if not isinstance(marker_id, str):
                raise ValueError(f"{path}.id: expected string")
            if not isinstance(blackboard_key, str):
                raise ValueError(f"{path}.blackboardKey: expected string")
            use_blackboard_key = require_bool(
                condition.get("useBlackboardKey"), f"{path}.useBlackboardKey"
            )
            return_true_if_missing = require_bool(
                condition.get("returnTrueIfNotExists"),
                f"{path}.returnTrueIfNotExists",
            )
            return ConditionSource(
                sourceType=condition_type,
                supported=(
                    not use_blackboard_key
                    and bool(marker_id)
                    and str(target.get("targetSource", "")) in {"Owner", "Source"}
                    and not str(target.get("targetGroupKey", ""))
                ),
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                timedMarker=TimedMarkerConditionSource(
                    targetSource=str(target.get("targetSource", "")),
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    markerId=marker_id,
                    blackboardKey=blackboard_key,
                    useBlackboardKey=use_blackboard_key,
                    returnTrueIfNotExists=return_true_if_missing,
                ),
            )
        if condition_type == "CheckGlobalCDTimerAction":
            target = require_dict(condition.get("target"), f"{path}.target")
            buff_id = condition.get("buffId")
            if not isinstance(buff_id, str) or not buff_id:
                raise ValueError(f"{path}.buffId: expected non-empty string")
            target_source = str(target.get("targetSource", ""))
            target_group_key = str(target.get("targetGroupKey", ""))
            return ConditionSource(
                sourceType=condition_type,
                supported=(target_source in {"Owner", "Source"} and not target_group_key),
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                globalCooldown=GlobalCooldownConditionSource(
                    targetSource=target_source,
                    targetGroupKey=target_group_key,
                    buffId=buff_id,
                ),
            )
        if condition_type == "CheckSkillHasHit":
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                skillHasHit=SkillHasHitConditionSource(),
            )
        if condition_type == "CheckHp":
            target = require_dict(condition.get("hpOwner"), f"{path}.hpOwner")
            comparison = condition.get("compare")
            is_ratio = condition.get("isRatio")
            if not isinstance(comparison, str) or not comparison:
                raise ValueError(f"{path}.compare: expected string")
            if not isinstance(is_ratio, bool):
                raise ValueError(f"{path}.isRatio: expected boolean")
            target_source = str(target.get("targetSource", ""))
            target_group_key = str(target.get("targetGroupKey", ""))
            return ConditionSource(
                sourceType=condition_type,
                supported=(
                    target_source == "Context"
                    and target_group_key == "smart_target"
                ),
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                health=HealthConditionSource(
                    targetSource=target_source,
                    targetGroupKey=target_group_key,
                    comparison=comparison,
                    isRatio=is_ratio,
                    value=parse_scalar(
                        condition.get("value"),
                        f"{path}.value",
                        inherited_blackboard,
                    ),
                ),
            )
        if condition_type == "CheckMainCharacterCondition":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            target_source = str(target.get("targetSource", ""))
            return ConditionSource(
                sourceType=condition_type,
                supported=target_source in {"Owner", "Source"},
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                mainOperator=MainOperatorConditionSource(
                    targetSource=target_source,
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                ),
            )
        if condition_type == "CheckTargetsEqual":
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                targetIdentity=TargetIdentityConditionSource(
                    first=parse_target_reference(
                        condition.get("firstTargetSettings"),
                        f"{path}.firstTargetSettings",
                    ),
                    second=parse_target_reference(
                        condition.get("secondTargetSettings"),
                        f"{path}.secondTargetSettings",
                    ),
                ),
            )
        if condition_type == "CheckDistanceCondition":
            raw_distance = condition.get("distance")
            if not isinstance(raw_distance, (int, float)) or isinstance(raw_distance, bool):
                raise ValueError(f"{path}.distance: expected number")
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                distance=DistanceConditionSource(
                    source=parse_target_reference(condition.get("source"), f"{path}.source"),
                    target=parse_target_reference(condition.get("target"), f"{path}.target"),
                    distance=float(raw_distance),
                    lessThan=require_bool(condition.get("lessThan"), f"{path}.lessThan"),
                    includeTargetRadius=require_bool(
                        condition.get("includeTargetRadius"),
                        f"{path}.includeTargetRadius",
                    ),
                    containsHittableObject=require_bool(
                        condition.get("containsHittableObj"),
                        f"{path}.containsHittableObj",
                    ),
                ),
            )
        return ConditionSource(
            sourceType=condition_type,
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
        )

    def parse_if_else(
        value: dict[str, Any],
        start_frame: int,
        end_frame: int,
        path: tuple[str, ...],
        execution_frames: tuple[int, ...],
    ) -> ConditionalActionSource | None:
        source_path = f"{source_name}.{'.'.join(path)}"
        condition_group = require_dict(
            value.get("conditionAction"), f"{source_path}.conditionAction"
        )
        conditions = tuple(
            parse_condition(
                raw_condition,
                f"{source_path}.conditionAction.actionData[{index}]",
            )
            for index, raw_condition in enumerate(
                require_list(
                    condition_group.get("actionData"),
                    f"{source_path}.conditionAction.actionData",
                )
            )
        )
        succeed = parse_branch(
            value.get("succeedActions"),
            start_frame,
            end_frame,
            (*path, "succeedActions"),
            execution_frames,
        )
        fail = parse_branch(
            value.get("failActions"),
            start_frame,
            end_frame,
            (*path, "failActions"),
            execution_frames,
        )
        if not succeed and not fail:
            return None
        return ConditionalActionSource(
            startFrame=start_frame,
            endFrame=end_frame,
            actionIndex=require_non_negative_int(
                value.get("serverActionIndex"), f"{source_path}.serverActionIndex"
            ),
            actionPath=path,
            conditions=conditions,
            succeedActions=succeed,
            failActions=fail,
            executionFrames=execution_frames,
        )

    def parse_switch(
        value: dict[str, Any],
        start_frame: int,
        end_frame: int,
        path: tuple[str, ...],
        execution_frames: tuple[int, ...],
    ) -> ConditionalActionSource | None:
        """把当前真实数据中的 Blackboard 整数 Switch 展开为首个匹配的条件链。"""
        source_path = f"{source_name}.{'.'.join(path)}"
        if value.get("alwaysNext") is not True:
            raise ValueError(f"{source_path}.alwaysNext: only true is supported")
        choice = parse_scalar(
            value.get("choice"), f"{source_path}.choice", inherited_blackboard
        )
        if choice.blackboardKey is None:
            raise ValueError(f"{source_path}.choice: expected Blackboard value")
        options = require_list(value.get("options"), f"{source_path}.options")
        nested: ConditionalActionSource | None = None
        has_combat_actions = False
        for option_index in range(len(options) - 1, -1, -1):
            option = require_dict(
                options[option_index], f"{source_path}.options[{option_index}]"
            )
            option_value = parse_scalar(
                option.get("value"),
                f"{source_path}.options[{option_index}].value",
                inherited_blackboard,
            )
            if (
                option_value.blackboardKey is not None
                or not float(option_value.value).is_integer()
            ):
                raise ValueError(
                    f"{source_path}.options[{option_index}].value: "
                    "expected literal integer"
                )
            actions = parse_branch(
                option.get("actionData"),
                start_frame,
                end_frame,
                (*path, "options", f"[{option_index}]", "actionData"),
                execution_frames,
            )
            has_combat_actions = has_combat_actions or bool(actions)
            fail_actions = (
                ()
                if nested is None
                else (
                    ConditionalBranchActionSource(
                        actionType="SwitchAction",
                        actionIndex=option_index,
                        nestedCondition=nested,
                    ),
                )
            )
            nested = SwitchActionSource(
                startFrame=start_frame,
                endFrame=end_frame,
                actionIndex=require_non_negative_int(
                    value.get("serverActionIndex"),
                    f"{source_path}.serverActionIndex",
                ),
                actionPath=(*path, "options", f"[{option_index}]"),
                conditions=(
                    ConditionSource(
                        sourceType="CompareFloat",
                        supported=True,
                        comparison="Equals",
                        left=choice,
                        right=option_value,
                        skillTypes=(),
                    ),
                ),
                succeedActions=actions,
                failActions=fail_actions,
                executionFrames=execution_frames,
            )
        return nested if has_combat_actions else None

    def parse_branch(
        value: Any,
        start_frame: int,
        end_frame: int,
        path: tuple[str, ...],
        execution_frames: tuple[int, ...],
        first_action_index: int = 0,
    ) -> tuple[ConditionalBranchActionSource, ...]:
        branch = require_dict(value, f"{source_name}.{'.'.join(path)}")
        actions: list[ConditionalBranchActionSource] = []
        raw_actions = require_list(
            branch.get("actionData"), f"{source_name}.{'.'.join(path)}.actionData"
        )
        for index in range(first_action_index, len(raw_actions)):
            raw_action = raw_actions[index]
            action = require_dict(raw_action, f"{source_name}.{'.'.join(path)}.actionData[{index}]")
            if action.get("isEnable") is False:
                continue
            action_type = action_name(str(action.get("$type", "")))
            action_path = (*path, "actionData", f"[{index}]")
            if action_type in SEQUENCE_GUARD_ACTION_NAMES:
                if not any(
                    contains_combat_effect(item)
                    for item in raw_actions[index + 1 :]
                ):
                    continue
                guarded_actions = parse_branch(
                    value,
                    start_frame,
                    end_frame,
                    path,
                    execution_frames,
                    index + 1,
                )
                if guarded_actions:
                    actions.append(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=index,
                            nestedCondition=SequenceGuardActionSource(
                                startFrame=start_frame,
                                endFrame=end_frame,
                                actionIndex=require_non_negative_int(
                                    action.get("serverActionIndex"),
                                    f"{source_name}.{'.'.join(action_path)}.serverActionIndex",
                                ),
                                actionPath=action_path,
                                conditions=(
                                    parse_condition(
                                        action,
                                        f"{source_name}.{'.'.join(action_path)}",
                                    ),
                                ),
                                succeedActions=guarded_actions,
                                failActions=(),
                                executionFrames=execution_frames,
                            ),
                        )
                    )
                # 守卫已经接管全部后续兄弟动作，外层不能再次追加同一批动作。
                break
            if action_type == "IfElseAction":
                nested = parse_if_else(
                    action,
                    start_frame,
                    end_frame,
                    action_path,
                    execution_frames,
                )
                if nested is not None:
                    actions.append(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=index,
                            nestedCondition=nested,
                        )
                    )
            elif action_type == "ForEachAction":
                # 固定单敌人模型下，逐目标容器只执行一次；目标形状仍由严格遍历器校验。
                tuple(
                    walk_single_enemy_actions(
                        action, f"{source_name}.{'.'.join(action_path)}"
                    )
                )
                actions.extend(
                    parse_branch(
                        action.get("action"),
                        start_frame,
                        end_frame,
                        (*action_path, "action"),
                        execution_frames,
                    )
                )
            elif action_type == "SwitchAction":
                nested = parse_switch(
                    action,
                    start_frame,
                    end_frame,
                    action_path,
                    execution_frames,
                )
                if nested is not None:
                    actions.append(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=index,
                            nestedCondition=nested,
                        )
                    )
            elif action_type == "DoOnceAction":
                once_actions = parse_branch(
                    action.get("sequenceActionData"),
                    start_frame,
                    end_frame,
                    (*action_path, "sequenceActionData"),
                    execution_frames,
                )
                if once_actions:
                    actions.append(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=index,
                            onceScopeKey="do-once:" + ".".join(action_path),
                            onceActions=once_actions,
                        )
                    )
            elif action_type in CONDITIONAL_AUDIT_ACTION_NAMES:
                source_path = f"{source_name}.{'.'.join(action_path)}"
                calculation = None
                mutation = None
                buff_read = None
                buff_finish = None
                buff_stack_read = None
                buff_application = None
                timed_marker_application = None
                global_cooldown_application = None
                resource_gain = None
                infliction = None
                projectile_launch = None
                ability_entity_spawn = None
                damage_units = None
                if action_type == "SimpleCalcBBAction":
                    calculation = parse_blackboard_calculation_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "ModifyDynamicBlackboard":
                    mutation = parse_blackboard_mutation_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "GetTargetBuffBBAdvanced":
                    buff_read = parse_buff_blackboard_read_payload(action, source_path)
                elif action_type == "FinishBuffAdvanced":
                    buff_finish = parse_buff_finish_payload(action, source_path)
                elif action_type == "SaveBuffStackNumAdvanced":
                    buff_stack_read = parse_buff_stack_read_payload(action, source_path)
                elif action_type == "CreateBuffAction":
                    buff_application = parse_buff_application_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "CreateTimedMarker":
                    timed_marker_application = parse_timed_marker_application_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "AddGlobalCDTimer":
                    global_cooldown_application = parse_global_cooldown_application_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "ObtainCostAction":
                    resource_gain = parse_resource_gain_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "SpellInfliction":
                    infliction = parse_infliction_payload(action, source_path)
                elif action_type == "LaunchProjectile":
                    projectile_launch = parse_projectile_launch_payload(action, source_path)
                elif action_type == "SpawnAbilityEntity":
                    ability_entity_spawn = parse_ability_entity_spawn_payload(
                        action, source_path
                    )
                elif action_type == "DamageAction":
                    if "damageUnits" in action:
                        damage_units = parse_damage_units(
                            {"actionGroupData": {"action": action}},
                            source_path,
                            inherited_blackboard,
                        )
                actions.append(
                    ConditionalBranchActionSource(
                        actionType=action_type,
                        actionIndex=index,
                        blackboardCalculation=calculation,
                        blackboardMutation=mutation,
                        buffBlackboardRead=buff_read,
                        buffFinish=buff_finish,
                        buffStackRead=buff_stack_read,
                        buffApplication=buff_application,
                        timedMarkerApplication=timed_marker_application,
                        globalCooldownApplication=global_cooldown_application,
                        resourceGain=resource_gain,
                        infliction=infliction,
                        projectileLaunch=projectile_launch,
                        abilityEntitySpawn=ability_entity_spawn,
                        damageUnits=damage_units,
                    )
                )
        return tuple(actions)

    def visit(
        value: Any,
        start_frame: int,
        end_frame: int,
        path: tuple[str, ...],
        execution_frames: tuple[int, ...],
    ) -> None:
        if isinstance(value, list):
            for index, child in enumerate(value):
                visit(child, start_frame, end_frame, (*path, f"[{index}]"), execution_frames)
            return
        if not isinstance(value, dict):
            return
        action_type = action_name(str(value.get("$type", "")))
        if action_type == "TickIntervalAction":
            action_path = f"{source_name}.{'.'.join(path)}"
            if (
                value.get("executeEachFrame") is not False
                or value.get("useTickIntervalBlackboardKey") is not False
                or value.get("tickIntervalBlackboardKey") != ""
            ):
                raise ValueError(f"{action_path}: only a fixed literal interval is supported")
            interval_seconds = value.get("tickInterval")
            if (
                not isinstance(interval_seconds, (int, float))
                or isinstance(interval_seconds, bool)
                or interval_seconds <= 0
            ):
                raise ValueError(f"{action_path}.tickInterval: expected positive number")
            interval_frames_float = float(interval_seconds) * 30
            interval_frames = round(interval_frames_float)
            if interval_frames <= 0 or abs(interval_frames_float - interval_frames) > 1e-6:
                raise ValueError(f"{action_path}.tickInterval: does not align to combat frames")
            tick_frames = tuple(range(start_frame, end_frame, interval_frames))
            if not tick_frames:
                raise ValueError(f"{action_path}: interval produces no ticks")
            visit(
                value.get("actionOnTick"),
                start_frame,
                end_frame,
                (*path, "actionOnTick"),
                tick_frames,
            )
            return
        if action_type == "IfElseAction":
            conditional = parse_if_else(
                value,
                start_frame,
                end_frame,
                path,
                execution_frames,
            )
            if conditional is not None:
                result.append(conditional)
            # 嵌套 IfElse 已由分支节点递归保存，不能再提升为并列的顶层条件。
            return
        if action_type == "SwitchAction":
            conditional = parse_switch(
                value,
                start_frame,
                end_frame,
                path,
                execution_frames,
            )
            if conditional is not None:
                result.append(conditional)
            # Switch 选项已被保存为嵌套条件链，不能再把内部动作提升到根调度。
            return
        if action_type == "DoOnceAction":
            action_path = f"{source_name}.{'.'.join(path)}"
            once_actions = parse_branch(
                value.get("sequenceActionData"),
                start_frame,
                end_frame,
                (*path, "sequenceActionData"),
                execution_frames,
            )
            if once_actions:
                # ChannelingAction 投影会让多个时间点共享同一个 actionOnTick 对象；
                # 首次遇到时生成稳定作用域，后续投影必须沿用它。
                scope_key = once_scope_keys.setdefault(
                    id(value), "do-once:" + ".".join(path)
                )
                result.append(
                    DoOnceActionSource(
                        startFrame=start_frame,
                        endFrame=end_frame,
                        actionIndex=require_non_negative_int(
                            value.get("serverActionIndex"),
                            f"{action_path}.serverActionIndex",
                        ),
                        actionPath=path,
                        conditions=(),
                        succeedActions=once_actions,
                        failActions=(),
                        executionFrames=execution_frames,
                        onceScopeKey=scope_key,
                    )
                )
            # 内部动作已保存在一次性节点中，不能再提升到根调度。
            return
        if action_type == "CreateTimedMarker":
            if id(value) in consumed_action_ids:
                return
            marker = require_dict(value.get("markerId"), f"{source_name}.{'.'.join(path)}.markerId")
            # 动态标记当前仅在命中去重等专用投影中闭环；不能伪装成固定身份标记。
            if marker.get("useBlackboardKey") is not False:
                return
            action_path = f"{source_name}.{'.'.join(path)}"
            action_index = require_server_action_index(value, action_path)
            result.append(
                UnconditionalActionSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=action_index,
                    actionPath=path,
                    conditions=(),
                    succeedActions=(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=action_index,
                            timedMarkerApplication=parse_timed_marker_application_payload(
                                value, action_path, inherited_blackboard
                            ),
                        ),
                    ),
                    failActions=(),
                    executionFrames=execution_frames,
                )
            )
            return
        for key, child in value.items():
            visit(child, start_frame, end_frame, (*path, key), execution_frames)

    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{source_name}.timelineActions[{timeline_index}]._endFrame"
        )
        visit(
            timeline.get("_sequenceActionData"),
            start_frame,
            end_frame,
            (f"timelineActions[{timeline_index}]", "_sequenceActionData"),
            (),
        )
    return tuple(result)


def parse_blackboard_calculations(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[BlackboardCalculationSource, ...]:
    """读取会为后续动作派生数值的 SimpleCalcBBAction。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[BlackboardCalculationSource] = []
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{source_name}.timelineActions[{timeline_index}]._endFrame"
        )
        for action in walk_single_enemy_actions(
            timeline.get("_sequenceActionData"),
            f"{source_name}.timelineActions[{timeline_index}]",
        ):
            if action_name(action["$type"]) != "SimpleCalcBBAction":
                continue
            payload = parse_blackboard_calculation_payload(
                action,
                f"{source_name}.SimpleCalcBBAction",
                inherited_blackboard,
            )
            result.append(
                BlackboardCalculationSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        action, f"{source_name}.SimpleCalcBBAction"
                    ),
                    key=payload.key,
                    operation=payload.operation,
                    left=payload.left,
                    right=payload.right,
                )
            )
    return tuple(result)


def parse_buff_find_settings(
    value: Any,
    path: str,
) -> tuple[str, tuple[str, ...], str, tuple[int, ...]]:
    """严格读取 BuffFindSettings；未知查询枚举和非整数标签必须立即报错。"""
    settings = require_dict(value, path)
    raw_ids = require_list(settings.get("buffIdList"), f"{path}.buffIdList")
    buff_ids: list[str] = []
    for index, raw_id in enumerate(raw_ids):
        if not isinstance(raw_id, str):
            raise ValueError(f"{path}.buffIdList[{index}]: expected string")
        # Tag 查询的真实数据会用空字符串占住无效 ID 槽；它不构成 Buff 身份。
        if raw_id:
            buff_ids.append(raw_id)
    query_type, tag_ids = parse_tag_query(settings.get("tagQuery"), f"{path}.tagQuery")
    return (
        str(settings.get("checkType", "")),
        tuple(buff_ids),
        query_type,
        tag_ids,
    )


def parse_tag_query(value: Any, path: str) -> tuple[str, tuple[int, ...]]:
    """严格读取原生 GameplayTag 查询；一个 Buff 即使命中多个标签也只计数一次。"""
    tag_query = require_dict(value, path)
    raw_tags = require_list(tag_query.get("tags"), f"{path}.tags")
    raw_query_type = tag_query.get("queryType")
    query_type = TAG_QUERY_TYPE_MAP.get(raw_query_type)
    if query_type is None:
        raise ValueError(f"{path}.queryType: unsupported value {raw_query_type!r}")

    tag_ids: list[int] = []
    for tag_index, raw_tag in enumerate(raw_tags):
        tag = require_dict(raw_tag, f"{path}.tags[{tag_index}]")
        tag_id = tag.get("tagId")
        if not isinstance(tag_id, int):
            raise ValueError(f"{path}.tags[{tag_index}].tagId: expected integer")
        tag_ids.append(tag_id)
    return query_type, tuple(tag_ids)


def parse_blackboard_runtime_actions(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[
    tuple[BlackboardMutationSource, ...],
    tuple[BuffBlackboardReadSource, ...],
    tuple[BuffFinishSource, ...],
]:
    """读取会改变技能黑板，或从目标 Buff 黑板取值的运行时动作。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    mutations: list[BlackboardMutationSource] = []
    reads: list[BuffBlackboardReadSource] = []
    finishes: list[BuffFinishSource] = []
    timelines = require_list(
        group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions"
    )
    for timeline_index, raw_timeline in enumerate(timelines):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{source_name}.timelineActions[{timeline_index}]._endFrame"
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            kind = action_name(action["$type"])
            if kind == "ModifyDynamicBlackboard":
                payload = parse_blackboard_mutation_payload(
                    action,
                    f"{source_name}.ModifyDynamicBlackboard",
                    inherited_blackboard,
                )
                mutations.append(
                    BlackboardMutationSource(
                        startFrame=start_frame,
                        endFrame=end_frame,
                        actionIndex=require_server_action_index(
                            action, f"{source_name}.ModifyDynamicBlackboard"
                        ),
                        key=payload.key,
                        operation=payload.operation,
                        value=payload.value,
                    )
                )
                continue
            if kind == "FinishBuffAdvanced":
                payload = parse_buff_finish_payload(
                    action, f"{source_name}.FinishBuffAdvanced"
                )
                finishes.append(
                    BuffFinishSource(
                        startFrame=start_frame,
                        endFrame=end_frame,
                        actionIndex=require_server_action_index(
                            action, f"{source_name}.FinishBuffAdvanced"
                        ),
                        targetSource=payload.targetSource,
                        targetGroupKey=payload.targetGroupKey,
                        buffCheckType=payload.buffCheckType,
                        buffIds=payload.buffIds,
                        tagQueryType=payload.tagQueryType,
                        buffTagIds=payload.buffTagIds,
                        finishAll=payload.finishAll,
                        limitSource=payload.limitSource,
                        isFinishedEarly=payload.isFinishedEarly,
                        isAbsorbed=payload.isAbsorbed,
                    )
                )
                continue
            if kind != "GetTargetBuffBBAdvanced":
                continue
            payload = parse_buff_blackboard_read_payload(
                action, f"{source_name}.GetTargetBuffBBAdvanced"
            )
            reads.append(
                BuffBlackboardReadSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        action, f"{source_name}.GetTargetBuffBBAdvanced"
                    ),
                    outputKey=payload.outputKey,
                    desiredKey=payload.desiredKey,
                    targetSource=payload.targetSource,
                    targetGroupKey=payload.targetGroupKey,
                    buffCheckType=payload.buffCheckType,
                    buffIds=payload.buffIds,
                    tagQueryType=payload.tagQueryType,
                    buffTagIds=payload.buffTagIds,
                )
            )
    return tuple(mutations), tuple(reads), tuple(finishes)


def parse_buff_hold_actions(
    root: dict[str, Any], source_name: str
) -> tuple[BuffHoldSource, ...]:
    """读取 ExtendBuffAction 的固定实例保护区间；当前只保留原生查询事实。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[BuffHoldSource] = []
    timelines = require_list(
        group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions"
    )
    expected_action_fields = {
        "$type",
        "isEnable",
        "priorityLevel",
        "priorityOffset",
        "serverActionIndex",
        "buffOwner",
        "buffSettings",
    }
    for timeline_index, raw_timeline in enumerate(timelines):
        timeline_path = f"{source_name}.timelineActions[{timeline_index}]"
        timeline = require_dict(raw_timeline, timeline_path)
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{timeline_path}._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{timeline_path}._endFrame"
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "ExtendBuffAction":
                continue
            action_path = f"{timeline_path}.ExtendBuffAction"
            if set(action) != expected_action_fields:
                raise ValueError(f"{action_path}: unexpected fields {sorted(action)}")
            if action.get("isEnable") is not True:
                raise ValueError(f"{action_path}.isEnable: expected true")
            target = require_dict(action.get("buffOwner"), f"{action_path}.buffOwner")
            check_type, buff_ids, query_type, tag_ids = parse_buff_find_settings(
                action.get("buffSettings"), f"{action_path}.buffSettings"
            )
            result.append(
                BuffHoldSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(action, action_path),
                    targetSource=str(target.get("targetSource", "")),
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    buffCheckType=check_type,
                    buffIds=buff_ids,
                    tagQueryType=query_type,
                    buffTagIds=tag_ids,
                )
            )
    return tuple(result)


def parse_damage_units(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[DamageUnitSource, ...]:
    result: list[DamageUnitSource] = []
    for action in walk_single_enemy_actions(root.get("actionGroupData"), source_name):
        if action_name(action["$type"]) != "DamageAction":
            continue
        units = require_list(action.get("damageUnits"), f"{source_name}.DamageAction.damageUnits")
        for index, raw_unit in enumerate(units):
            unit = require_dict(raw_unit, f"{source_name}.DamageAction.damageUnits[{index}]")
            simple_calculation = unit.get("simpleCalculation")
            if not isinstance(simple_calculation, bool):
                raise ValueError(f"{source_name}.DamageAction.damageUnits[{index}].simpleCalculation: expected boolean")
            attack_scale_source = unit.get("atkScale")
            calculation = "standard"
            calculation_multiplier = None
            definite_value = None
            attribute_type = str(unit.get("damageAttributeType", ""))
            if attribute_type == "Hp" and not simple_calculation:
                raw_calculation = require_dict(
                    unit.get("atkCalculation"),
                    f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation",
                )
                calculation_type = action_name(str(raw_calculation.get("$type", "")))
                calculation_types = {
                    "AtkScaleCalculation": "standard",
                    "BreakingAttackCalculation": "breakingAttack",
                    "DefiniteValueCalculation": "definiteValue",
                }
                if calculation_type not in calculation_types:
                    raise ValueError(
                        f"{source_name}.DamageAction.damageUnits[{index}]: unsupported calculation {calculation_type}"
                    )
                calculation = calculation_types[calculation_type]
                if calculation == "definiteValue":
                    if raw_calculation.get("applyScale") is not False:
                        raise ValueError(
                            f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation: "
                            "scaled definite values are not supported"
                        )
                    definite_value = parse_scalar(
                        raw_calculation.get("value"),
                        f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation.value",
                        inherited_blackboard,
                    )
                else:
                    attack_scale_source = raw_calculation.get("atkScale")
                if calculation == "breakingAttack":
                    calculation_multiplier = parse_scalar(
                        raw_calculation.get("multiplier"),
                        f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation.multiplier",
                        inherited_blackboard,
                    )
            poise_value = None
            if attribute_type == "Poise":
                poise_calculation = require_dict(
                    unit.get("poiseCalculation"),
                    f"{source_name}.DamageAction.damageUnits[{index}].poiseCalculation",
                )
                poise_calculation_type = action_name(
                    str(poise_calculation.get("$type", ""))
                )
                if poise_calculation_type != "DefiniteValueCalculation":
                    raise ValueError(
                        f"{source_name}.DamageAction.damageUnits[{index}].poiseCalculation: "
                        f"unsupported calculation {poise_calculation_type}"
                    )
                poise_value = parse_scalar(
                    poise_calculation.get("value"),
                    f"{source_name}.DamageAction.damageUnits[{index}].poiseCalculation.value",
                    inherited_blackboard,
                )
                apply_scale = poise_calculation.get("applyScale")
                if not isinstance(apply_scale, bool):
                    raise ValueError(
                        f"{source_name}.DamageAction.damageUnits[{index}].poiseCalculation."
                        "applyScale: expected boolean"
                    )
                if apply_scale:
                    value_scale = parse_scalar(
                        poise_calculation.get("valueScale"),
                        f"{source_name}.DamageAction.damageUnits[{index}]."
                        "poiseCalculation.valueScale",
                        inherited_blackboard,
                    )
                    if value_scale.blackboardKey is not None:
                        raise ValueError(
                            f"{source_name}.DamageAction.damageUnits[{index}]."
                            "poiseCalculation.valueScale: dynamic scale is not supported"
                        )
                    if poise_value.levelValues is None:
                        raise ValueError(
                            f"{source_name}.DamageAction.damageUnits[{index}]."
                            "poiseCalculation.value: scaled value must resolve at generation time"
                        )
                    scale = to_float32(value_scale.value)
                    poise_value = ScalarSource(
                        value=poise_value.value * scale,
                        blackboardKey=None,
                        levelValues=tuple(value * scale for value in poise_value.levelValues),
                    )
            result.append(
                DamageUnitSource(
                    damageType=str(unit.get("damageType", "")),
                    attributeType=attribute_type,
                    calculation=calculation,
                    attackScale=parse_scalar(
                        attack_scale_source,
                        f"{source_name}.DamageAction.damageUnits[{index}].atkScale",
                        inherited_blackboard,
                    ),
                    calculationMultiplier=calculation_multiplier,
                    poiseValue=poise_value,
                    definiteValue=definite_value,
                )
            )
    return tuple(result)


def parse_direct_damage_hits(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[TimedDamageSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    marker_gates = collect_timed_marker_damage_gates(group, f"{source_name}.actionGroupData")
    result: list[TimedDamageSource] = []
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{source_name}.timelineActions[{timeline_index}]._endFrame"
        )
        actions = list(
            walk_single_enemy_actions(
                timeline.get("_sequenceActionData"),
                f"{source_name}.timelineActions[{timeline_index}]",
            )
        )
        for action in actions:
            if action_name(action["$type"]) != "DamageAction":
                continue
            action_root = {"actionGroupData": {"action": action}}
            result.append(
                TimedDamageSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        action, f"{source_name}.DamageAction"
                    ),
                    damageUnits=parse_damage_units(action_root, source_name, inherited_blackboard),
                    timedMarkerGate=marker_gates.get(id(action)),
                )
            )
    return tuple(result)


def parse_interval_damage_hits(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[TimedIntervalDamageSource, ...]:
    """解析固定间隔内每次都由等价分支执行的伤害。"""

    def enabled_actions(sequence: Any, path: str) -> list[dict[str, Any]]:
        data = require_dict(sequence, path)
        result: list[dict[str, Any]] = []
        for index, raw_action in enumerate(
            require_list(data.get("actionData"), f"{path}.actionData")
        ):
            action = require_dict(raw_action, f"{path}.actionData[{index}]")
            if action.get("isEnable") is not False:
                result.append(action)
        return result

    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedIntervalDamageSource] = []
    timelines = require_list(
        group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions"
    )
    for timeline_index, raw_timeline in enumerate(timelines):
        timeline_path = f"{source_name}.timelineActions[{timeline_index}]"
        timeline = require_dict(raw_timeline, timeline_path)
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{timeline_path}._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{timeline_path}._endFrame"
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if (
                action_name(action["$type"]) != "TickIntervalAction"
                or action.get("isEnable") is False
            ):
                continue
            action_path = f"{timeline_path}.TickIntervalAction"
            if (
                action.get("executeEachFrame") is not False
                or action.get("useTickIntervalBlackboardKey") is not False
                or action.get("tickIntervalBlackboardKey") != ""
            ):
                raise ValueError(f"{action_path}: only a fixed literal interval is supported")
            interval_seconds = action.get("tickInterval")
            if (
                not isinstance(interval_seconds, (int, float))
                or isinstance(interval_seconds, bool)
                or interval_seconds <= 0
            ):
                raise ValueError(f"{action_path}.tickInterval: expected positive number")
            interval_frames_float = float(interval_seconds) * 30
            interval_frames = round(interval_frames_float)
            if interval_frames <= 0 or abs(interval_frames_float - interval_frames) > 1e-6:
                raise ValueError(f"{action_path}.tickInterval: does not align to combat frames")

            tick_actions = enabled_actions(
                action.get("actionOnTick"), f"{action_path}.actionOnTick"
            )
            branches = [
                item for item in tick_actions if action_name(item["$type"]) == "IfElseAction"
            ]
            if len(branches) != 1:
                if any(action_name(item["$type"]) == "DamageAction" for item in tick_actions):
                    raise ValueError(f"{action_path}: unsupported direct tick damage shape")
                continue
            branch = branches[0]
            branch_damage_actions: list[list[dict[str, Any]]] = []
            for branch_name in ("succeedActions", "failActions"):
                actions = enabled_actions(branch.get(branch_name), f"{action_path}.{branch_name}")
                branch_damage_actions.append(
                    [item for item in actions if action_name(item["$type"]) == "DamageAction"]
                )
            if not branch_damage_actions[0] and not branch_damage_actions[1]:
                continue
            if any(len(actions) != 1 for actions in branch_damage_actions):
                raise ValueError(f"{action_path}: tick branches have asymmetric direct damage")

            branch_damage: list[tuple[int, tuple[DamageUnitSource, ...]]] = []
            for branch_name, damage_actions in zip(
                ("succeedActions", "failActions"), branch_damage_actions, strict=True
            ):
                damage = damage_actions[0]
                damage_root = {"actionGroupData": {"action": damage}}
                branch_damage.append(
                    (
                        require_server_action_index(
                            damage, f"{action_path}.{branch_name}.DamageAction"
                        ),
                        parse_damage_units(damage_root, action_path, inherited_blackboard),
                    )
                )
            if branch_damage[0][1] != branch_damage[1][1]:
                raise ValueError(f"{action_path}: tick branches do not deal equivalent damage")
            # 周期动作在激活帧先执行一次，之后每隔 intervalFrames 重复；结束帧不执行。
            tick_frames = tuple(range(start_frame, end_frame, interval_frames))
            if not tick_frames:
                raise ValueError(f"{action_path}: interval produces no ticks")
            result.append(
                TimedIntervalDamageSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(action, action_path),
                    intervalFrames=interval_frames,
                    tickFrames=tick_frames,
                    damageActionIndex=min(item[0] for item in branch_damage),
                    damageUnits=branch_damage[0][1],
                )
            )
    return tuple(result)


def classify_buff(buff_id: str) -> str | None:
    if buff_id.startswith("buff_common_damage_immune_"):
        return "incomingDamageProtection"
    if buff_id == "buff_common_power_attack_disable_cast_skill":
        return "inputLock"
    if buff_id == "buff_common_obtain_ultimate_sp":
        return "skillCostUltimateEnergyGain"
    if buff_id.startswith("buff_chr_") and buff_id.endswith("_tutorial_marker"):
        return "tutorialMarker"
    if buff_id == "buff_common_pulse_pulse_conduct_triggered":
        return "electrificationReaction"
    return None


INFLICTION_TYPE_MAP = {
    "Fire": "heat",
    "Cryst": "cryo",
    "Pulse": "electric",
    "Natural": "nature",
}


def parse_infliction_payload(action: dict[str, Any], path: str) -> InflictionPayload:
    raw_type = action.get("inflictionType")
    element = INFLICTION_TYPE_MAP.get(raw_type)
    if element is None:
        raise ValueError(f"{path}: unsupported inflictionType {raw_type!r}")
    is_extra = action.get("isExtra")
    if not isinstance(is_extra, bool):
        raise ValueError(f"{path}.isExtra: expected boolean")
    return InflictionPayload(element, is_extra)


def parse_timed_marker_application_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> TimedMarkerApplicationPayload:
    target = require_dict(action.get("targetSettings"), f"{path}.targetSettings")
    marker = require_dict(action.get("markerId"), f"{path}.markerId")
    use_marker_key = require_bool(
        marker.get("useBlackboardKey"), f"{path}.markerId.useBlackboardKey"
    )
    marker_id = marker.get("value")
    marker_key = marker.get("blackboardKey")
    if not isinstance(marker_id, str):
        raise ValueError(f"{path}.markerId.value: expected string")
    if not isinstance(marker_key, str):
        raise ValueError(f"{path}.markerId.blackboardKey: expected string")
    if use_marker_key or not marker_id:
        raise ValueError(f"{path}.markerId: dynamic or empty marker IDs are not supported")
    return TimedMarkerApplicationPayload(
        targetSource=str(target.get("targetSource", "")),
        targetGroupKey=str(target.get("targetGroupKey", "")),
        markerId=marker_id,
        duration=parse_scalar(
            action.get("duration"), f"{path}.duration", inherited_blackboard
        ),
        autoFinishByAction=require_bool(
            action.get("autoFinishByAction"), f"{path}.autoFinishByAction"
        ),
        useTimeDilationDt=require_bool(
            action.get("useTimeDilationDt"), f"{path}.useTimeDilationDt"
        ),
    )


def parse_global_cooldown_application_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> GlobalCooldownApplicationPayload:
    """读取原生 AddGlobalCDTimer；Buff ID 同时充当冷却项的稳定标识。"""
    target = require_dict(action.get("target"), f"{path}.target")
    buff_id = action.get("buffId")
    if not isinstance(buff_id, str) or not buff_id:
        raise ValueError(f"{path}.buffId: expected non-empty string")
    return GlobalCooldownApplicationPayload(
        targetSource=str(target.get("targetSource", "")),
        targetGroupKey=str(target.get("targetGroupKey", "")),
        buffId=buff_id,
        duration=parse_scalar(
            action.get("cdTime"), f"{path}.cdTime", inherited_blackboard
        ),
    )


def parse_inflictions(root: dict[str, Any], source_name: str) -> tuple[TimedInflictionSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedInflictionSource] = []
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{source_name}.timelineActions[{timeline_index}]._endFrame"
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "SpellInfliction":
                continue
            payload = parse_infliction_payload(action, f"{source_name}.SpellInfliction")
            result.append(
                TimedInflictionSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        action, f"{source_name}.SpellInfliction"
                    ),
                    element=payload.element,
                    isExtra=payload.isExtra,
                )
            )
    return tuple(result)


def parse_buff_assignments(
    buff: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> dict[str, ScalarSource]:
    if buff.get("assignBlackboard") is not True:
        return {}
    result: dict[str, ScalarSource] = {}
    for index, raw_item in enumerate(require_list(buff.get("assignItems"), f"{path}.assignItems")):
        item = require_dict(raw_item, f"{path}.assignItems[{index}]")
        target_key = item.get("targetKey")
        if not isinstance(target_key, str) or not target_key:
            raise ValueError(f"{path}.assignItems[{index}].targetKey: expected non-empty string")
        if target_key in result:
            raise ValueError(f"{path}: duplicate assignment for {target_key}")
        direct = item.get("useDirectValue")
        if not isinstance(direct, bool):
            raise ValueError(f"{path}.assignItems[{index}].useDirectValue: expected boolean")
        numeric = item.get("numericValue")
        if not isinstance(numeric, (int, float)) or isinstance(numeric, bool):
            raise ValueError(f"{path}.assignItems[{index}].numericValue: expected number")
        if direct:
            result[target_key] = ScalarSource(float(numeric), None, None)
            continue
        input_key = item.get("inputValueKey")
        if not isinstance(input_key, str) or not input_key:
            raise ValueError(f"{path}.assignItems[{index}].inputValueKey: expected non-empty string")
        result[target_key] = ScalarSource(
            float(numeric),
            input_key,
            inherited_blackboard.get(input_key),
        )
    return result


def collect_referenced_buff_ids(root: dict[str, Any], source_name: str) -> tuple[str, ...]:
    """收集整棵动作树直接创建或由光环维持的 Buff；不改变其控制流归属。"""
    return collect_created_buff_ids(root.get("actionGroupData"), source_name)


def collect_created_buff_ids(value: Any, source_name: str) -> tuple[str, ...]:
    """从任意动作容器收集 Buff 引用，供技能与 Buff 定义共同使用。"""
    result: set[str] = set()
    for action in walk_actions(value):
        name = action_name(action["$type"])
        if name not in {"CreateBuffAction", "AuraAction"}:
            continue
        field = "buffs" if name == "CreateBuffAction" else "buffInput"
        for index, raw_buff in enumerate(
            require_list(action.get(field), f"{source_name}.{name}.{field}")
        ):
            buff = require_dict(raw_buff, f"{source_name}.{name}.{field}[{index}]")
            buff_id = buff.get("buffId")
            if not isinstance(buff_id, str) or not buff_id:
                raise ValueError(
                    f"{source_name}.{name}.{field}[{index}].buffId: expected string"
                )
            result.add(buff_id)
    return tuple(sorted(result))


def parse_buff_apply_tag_ids(buff: dict[str, Any], source_name: str) -> tuple[int, ...]:
    result: list[int] = []
    for index, raw_tag in enumerate(require_list(buff.get("applyTags"), f"{source_name}.applyTags")):
        tag = require_dict(raw_tag, f"{source_name}.applyTags[{index}]")
        if set(tag) != {"tagId"}:
            raise ValueError(f"{source_name}.applyTags[{index}]: unexpected fields {sorted(tag)}")
        tag_id = tag.get("tagId")
        if not isinstance(tag_id, int) or isinstance(tag_id, bool):
            raise ValueError(f"{source_name}.applyTags[{index}].tagId: expected integer")
        result.append(tag_id)
    return tuple(result)


def parse_buff_extend_tag_ids(buff: dict[str, Any], source_name: str) -> tuple[int, ...]:
    """解析 ExtendBuffAction 阻止 Buff 结束后临时挂到所属实体的标签。"""
    result: list[int] = []
    field = "tagsAfterTriggerExtendBuffAction"
    if field not in buff:
        return ()
    for index, raw_tag in enumerate(require_list(buff.get(field), f"{source_name}.{field}")):
        path = f"{source_name}.{field}[{index}]"
        tag = require_dict(raw_tag, path)
        if set(tag) != {"tagId"}:
            raise ValueError(f"{path}: unexpected fields {sorted(tag)}")
        tag_id = tag.get("tagId")
        if not isinstance(tag_id, int) or isinstance(tag_id, bool):
            raise ValueError(f"{path}.tagId: expected integer")
        result.append(tag_id)
    return tuple(result)


def parse_buff_attribute_modifiers(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[BuffAttributeModifierSource, ...]:
    """保留 Buff 挂载期间注册到原生八槽属性公式的修正。"""
    config = require_dict(buff.get("attributeModifier"), f"{source_name}.attributeModifier")
    expected_config_fields = {"isConvertedAttribute", "attributeModifiers"}
    if set(config) != expected_config_fields:
        raise ValueError(
            f"{source_name}.attributeModifier: unexpected fields {sorted(config)}"
        )
    if config.get("isConvertedAttribute") is not False:
        raise ValueError(
            f"{source_name}.attributeModifier.isConvertedAttribute: expected false"
        )

    result: list[BuffAttributeModifierSource] = []
    for index, raw_modifier in enumerate(
        require_list(
            config.get("attributeModifiers"),
            f"{source_name}.attributeModifier.attributeModifiers",
        )
    ):
        path = f"{source_name}.attributeModifier.attributeModifiers[{index}]"
        modifier = require_dict(raw_modifier, path)
        expected_fields = {"modifyAttributeType", "attributeType", "formulaItem", "param"}
        if set(modifier) != expected_fields:
            raise ValueError(f"{path}: unexpected fields {sorted(modifier)}")
        target_type = modifier.get("modifyAttributeType")
        if target_type not in BUFF_ATTRIBUTE_TARGET_TYPES:
            raise ValueError(f"{path}.modifyAttributeType: unsupported value {target_type!r}")
        attribute_type = modifier.get("attributeType")
        if not isinstance(attribute_type, str) or not attribute_type:
            raise ValueError(f"{path}.attributeType: expected non-empty string")
        slot = modifier.get("formulaItem")
        if slot not in BUFF_ATTRIBUTE_MODIFIER_SLOTS:
            raise ValueError(f"{path}.formulaItem: unsupported value {slot!r}")
        result.append(
            BuffAttributeModifierSource(
                targetType=target_type,
                attributeType=attribute_type,
                slot=slot,
                value=parse_scalar(modifier.get("param"), f"{path}.param", blackboard),
            )
        )
    return tuple(result)


def parse_buff_event_actions(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[BuffEventActionSource, ...]:
    """保留 Buff 与宿主实体事件中的动作事实；子 Buff 定义由中央目录递归解析。"""
    result: list[BuffEventActionSource] = []
    for event_source, field, event_key in (
        ("buff", "buffEventAction", "buffEvent"),
        ("ability", "abilityEventAction", "abilityEvent"),
    ):
        for event_index, raw_event in enumerate(
            require_list(buff.get(field, []), f"{source_name}.{field}")
        ):
            event_path = f"{source_name}.{field}[{event_index}]"
            event = require_dict(raw_event, event_path)
            event_name = event.get(event_key)
            if not isinstance(event_name, str) or not event_name:
                raise ValueError(f"{event_path}.{event_key}: expected string")
            actions = event.get("actions")
            action_root = {"actionGroupData": {"actions": actions}}
            walked_actions = [
                item
                for item in walk_unconditional_actions(actions)
                if item.get("isEnable") is not False
            ]
            ordered_action_types = tuple(
                action_name(item["$type"]) for item in walked_actions
            )
            buff_applications = tuple(
                EventBuffApplicationSource(
                    actionIndex=require_server_action_index(item, event_path),
                    payload=parse_buff_application_payload(item, event_path, blackboard),
                )
                for item in walked_actions
                if action_name(item["$type"]) == "CreateBuffAction"
            )
            result.append(
                BuffEventActionSource(
                    eventSource=cast(Literal["buff", "ability"], event_source),
                    event=event_name,
                    orderedActionTypes=ordered_action_types,
                    combatActions=tuple(
                        sorted(
                            {
                                name
                                for name in ordered_action_types
                                if name in AUDITED_COMBAT_ACTION_NAMES
                            }
                        )
                    ),
                    damageUnits=parse_damage_units(
                        action_root, f"{source_name}.{event_name}", blackboard
                    ),
                    buffApplications=buff_applications,
                    createdBuffIds=collect_created_buff_ids(actions, source_name),
                )
            )
    return tuple(result)


UNPARSED_BUFF_PAYLOAD_FIELDS = (
    "damageModifier",
    "globalModifier",
    "healModifier",
    "igniteEventAction",
    "poiseModifier",
    "shieldConfigs",
)


def collect_unparsed_buff_payloads(
    buff: dict[str, Any], source_name: str
) -> tuple[UnparsedBuffPayloadSource, ...]:
    """列出尚未结构化解析的非空 Buff 根载荷，防止审计结果静默遗漏行为。"""
    result: list[UnparsedBuffPayloadSource] = []
    for field in UNPARSED_BUFF_PAYLOAD_FIELDS:
        value = buff.get(field)
        if value is None:
            continue
        entries = require_list(value, f"{source_name}.{field}")
        if entries:
            result.append(UnparsedBuffPayloadSource(field=field, entryCount=len(entries)))
    return tuple(result)


def resolve_buff_definitions(
    buff_ids: tuple[str, ...],
    buff_source_dir: Path,
) -> tuple[BuffDefinitionSource, ...]:
    """解析传递 Buff 依赖的定义事实；应用参数不得污染定义自身的黑板默认值。"""
    result: dict[str, BuffDefinitionSource] = {}
    pending = list(buff_ids)
    while pending:
        buff_id = pending.pop(0)
        if buff_id in result:
            continue
        source_file = f"{buff_id}.json"
        source_path = buff_source_dir / source_file
        if not source_path.is_file():
            result[buff_id] = BuffDefinitionSource(
                buffId=buff_id,
                sourceFile=source_file,
                sourceAvailable=False,
                lifecycle=None,
                blackboard=(),
                applyTagIds=(),
                extendTagIds=(),
                attributeModifiers=(),
                directDamageHits=(),
                conditionalActions=(),
                blackboardCalculations=(),
                blackboardMutations=(),
                buffBlackboardReads=(),
                buffFinishes=(),
                eventActions=(),
                resourceGains=(),
                combatActions=(),
                unparsedPayloads=(),
            )
            continue
        buff = require_dict(json.loads(source_path.read_text(encoding="utf-8")), source_file)
        declared_blackboard = parse_declared_blackboard(buff, source_file)
        blackboard = {entry.key: (entry.value,) for entry in declared_blackboard}
        adapted_root = {
            "actionGroupData": {
                "timelineActions": require_list(
                    buff.get("timelineActions"), f"{source_file}.timelineActions"
                )
            }
        }
        mutations, reads, finishes = parse_blackboard_runtime_actions(
            adapted_root, source_file, blackboard
        )
        result[buff_id] = BuffDefinitionSource(
            buffId=buff_id,
            sourceFile=source_file,
            sourceAvailable=True,
            lifecycle=parse_buff_lifecycle(buff, source_file, blackboard),
            blackboard=declared_blackboard,
            applyTagIds=parse_buff_apply_tag_ids(buff, source_file),
            extendTagIds=parse_buff_extend_tag_ids(buff, source_file),
            attributeModifiers=parse_buff_attribute_modifiers(
                buff, source_file, blackboard
            ),
            directDamageHits=parse_direct_damage_hits(adapted_root, source_file, blackboard),
            conditionalActions=parse_conditional_actions(adapted_root, source_file, blackboard),
            blackboardCalculations=parse_blackboard_calculations(
                adapted_root, source_file, blackboard
            ),
            blackboardMutations=mutations,
            buffBlackboardReads=reads,
            buffFinishes=finishes,
            eventActions=parse_buff_event_actions(buff, source_file, blackboard),
            resourceGains=parse_resource_gains(adapted_root, source_file, blackboard),
            combatActions=tuple(
                sorted(
                    {
                        action_name(item["$type"])
                        for item in walk_actions(adapted_root.get("actionGroupData"))
                        if action_name(item["$type"]) in AUDITED_COMBAT_ACTION_NAMES
                    }
                )
            ),
            unparsedPayloads=collect_unparsed_buff_payloads(buff, source_file),
            auraActions=parse_buff_aura_actions(buff, source_file, blackboard),
        )
        pending.extend(
            child_id
            for child_id in collect_created_buff_ids(buff, source_file)
            if child_id not in result
        )
    return tuple(result[buff_id] for buff_id in sorted(result))


def resolve_operator_buff_definitions(
    skills: Iterable[SkillSource],
    buff_source_dir: Path,
) -> tuple[BuffDefinitionSource, ...]:
    """按干员汇总技能引用，生成一份共享且去重的 Buff 定义目录。"""
    referenced_ids = tuple(
        sorted({buff_id for skill in skills for buff_id in skill.referencedBuffIds})
    )
    return resolve_buff_definitions(referenced_ids, buff_source_dir)


def parse_buff_lifecycle(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> BuffLifecycleSource:
    """读取 BuffData 的计时与叠加配置；这里仅保留事实，不推断运行时事件。"""
    life_type = buff.get("lifeType")
    if life_type not in {"Limited", "Infinity"}:
        raise ValueError(f"{source_name}.lifeType: unsupported value {life_type!r}")
    wait_first = buff.get("waitFirstTriggerInterval")
    if not isinstance(wait_first, bool):
        raise ValueError(f"{source_name}.waitFirstTriggerInterval: expected boolean")
    settings = require_dict(buff.get("stackingSettings"), f"{source_name}.stackingSettings")

    def configured_scalar(
        use_key_name: str,
        key_name: str,
        value_name: str,
    ) -> ScalarSource:
        use_key = settings.get(use_key_name)
        if not isinstance(use_key, bool):
            raise ValueError(f"{source_name}.stackingSettings.{use_key_name}: expected boolean")
        key = settings.get(key_name)
        if not isinstance(key, str):
            raise ValueError(f"{source_name}.stackingSettings.{key_name}: expected string")
        value = settings.get(value_name)
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            raise ValueError(f"{source_name}.stackingSettings.{value_name}: expected number")
        if use_key and not key:
            raise ValueError(
                f"{source_name}.stackingSettings.{key_name}: active reference has no key"
            )
        return ScalarSource(
            value=float(value),
            blackboardKey=key if use_key else None,
            levelValues=blackboard.get(key) if use_key else None,
        )

    identifier_type = settings.get("identifierType")
    stacking_type = settings.get("stackingType")
    stacking_key = settings.get("stackingKey")
    if identifier_type not in BUFF_STACKING_IDENTIFIER_TYPES:
        raise ValueError(
            f"{source_name}.stackingSettings.identifierType: unsupported value {identifier_type!r}"
        )
    if stacking_type not in BUFF_STACKING_TYPES:
        raise ValueError(
            f"{source_name}.stackingSettings.stackingType: unsupported value {stacking_type!r}"
        )
    if not isinstance(stacking_key, str):
        raise ValueError(f"{source_name}.stackingSettings.stackingKey: expected string")
    if identifier_type == "StackingKey" and not stacking_key:
        raise ValueError(
            f"{source_name}.stackingSettings.stackingKey: StackingKey requires a non-empty key"
        )
    negate_priority = settings.get("negatePriority")
    has_stack_effects = settings.get("isNeedStackEffect")
    if not isinstance(negate_priority, bool):
        raise ValueError(f"{source_name}.stackingSettings.negatePriority: expected boolean")
    if not isinstance(has_stack_effects, bool):
        raise ValueError(f"{source_name}.stackingSettings.isNeedStackEffect: expected boolean")

    return BuffLifecycleSource(
        lifeType=life_type,
        duration=parse_scalar(buff.get("duration"), f"{source_name}.duration", blackboard),
        triggerInterval=parse_scalar(
            buff.get("triggerInterval"), f"{source_name}.triggerInterval", blackboard
        ),
        waitFirstTriggerInterval=wait_first,
        maxTriggerCount=parse_scalar(
            buff.get("maxTriggerCnt"), f"{source_name}.maxTriggerCnt", blackboard
        ),
        stackingIdentifierType=identifier_type,
        stackingType=stacking_type,
        stackingKey=stacking_key,
        priority=configured_scalar("usePriorityKey", "priorityKey", "priority"),
        negatePriority=negate_priority,
        maxStackCount=configured_scalar(
            "useMaxStackCntKey", "maxStackCntKey", "maxStackCnt"
        ),
        hasStackEffects=has_stack_effects,
    )


def parse_aura_actions(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[AuraActionSource, ...]:
    """严格读取区域动作；当前只形成审计事实，不提前近似其持续生命周期。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[AuraActionSource] = []

    def parse_sequence(value: Any, path: str) -> tuple[dict[str, Any], tuple[str, ...]]:
        sequence = require_dict(value, path)
        if set(sequence) != AURA_SEQUENCE_FIELDS:
            raise ValueError(f"{path}: unexpected fields {sorted(sequence)}")
        actions = tuple(
            require_dict(item, f"{path}.actionData[{index}]")
            for index, item in enumerate(
                require_list(sequence.get("actionData"), f"{path}.actionData")
            )
        )
        for index, action in enumerate(actions):
            if not isinstance(action.get("$type"), str):
                raise ValueError(f"{path}.actionData[{index}].$type: expected string")
        return sequence, tuple(
            action_name(str(action["$type"]))
            for action in actions
            if action.get("isEnable") is not False
        )

    def visit(
        value: Any,
        start_frame: int,
        end_frame: int,
        path: tuple[str, ...],
    ) -> None:
        if isinstance(value, list):
            for index, child in enumerate(value):
                visit(child, start_frame, end_frame, (*path, f"[{index}]"))
            return
        if not isinstance(value, dict) or value.get("isEnable") is False:
            return
        if action_name(str(value.get("$type", ""))) == "AuraAction":
            action_path = f"{source_name}.{'.'.join(path)}"
            if set(value) != AURA_ACTION_FIELDS:
                raise ValueError(f"{action_path}: unexpected fields {sorted(value)}")

            shape_path = f"{action_path}.shapeData"
            shape = require_dict(value.get("shapeData"), shape_path)
            if set(shape) != AURA_SHAPE_FIELDS:
                raise ValueError(f"{shape_path}: unexpected fields {sorted(shape)}")
            shape_type = shape.get("_shape")
            if not isinstance(shape_type, str) or not shape_type:
                raise ValueError(f"{shape_path}._shape: expected non-empty string")
            shape_keys = (
                "_extentXKey",
                "_extentYKey",
                "_extentZKey",
                "_centerXKey",
                "_centerYKey",
                "_centerZKey",
                "_heightKey",
                "_radiusKey",
            )
            for key in shape_keys:
                if not isinstance(shape.get(key), str):
                    raise ValueError(f"{shape_path}.{key}: expected string")

            filter_path = f"{action_path}.targetFilter"
            target_filter = require_dict(value.get("targetFilter"), filter_path)
            if set(target_filter) != AURA_TARGET_FILTER_FIELDS:
                raise ValueError(f"{filter_path}: unexpected fields {sorted(target_filter)}")
            faction_target = target_filter.get("factionTarget")
            faction_target_type = target_filter.get("targetFactionType")
            object_type = target_filter.get("objectType")
            if not isinstance(faction_target, str) or not faction_target:
                raise ValueError(f"{filter_path}.factionTarget: expected non-empty string")
            if not isinstance(faction_target_type, (str, int)) or isinstance(
                faction_target_type, bool
            ):
                raise ValueError(f"{filter_path}.targetFactionType: expected string or integer")
            if not isinstance(object_type, str) or not object_type:
                raise ValueError(f"{filter_path}.objectType: expected non-empty string")
            tag_query = require_dict(
                target_filter.get("tagQuery"), f"{filter_path}.tagQuery"
            )
            if set(tag_query) != {"queryType", "tags"}:
                raise ValueError(
                    f"{filter_path}.tagQuery: unexpected fields {sorted(tag_query)}"
                )
            tag_query_type = tag_query.get("queryType")
            if not isinstance(tag_query_type, str) or not tag_query_type:
                raise ValueError(
                    f"{filter_path}.tagQuery.queryType: expected non-empty string"
                )
            tag_ids = tuple(
                require_non_negative_int(item, f"{filter_path}.tagQuery.tags[{index}]")
                for index, item in enumerate(
                    require_list(tag_query.get("tags"), f"{filter_path}.tagQuery.tags")
                )
            )

            icon_path = f"{action_path}.buffIconDurationSource"
            icon_duration = require_dict(value.get("buffIconDurationSource"), icon_path)
            if set(icon_duration) != {"durationSourceType", "timedMarkerId"}:
                raise ValueError(f"{icon_path}: unexpected fields {sorted(icon_duration)}")
            duration_source_type = icon_duration.get("durationSourceType")
            timed_marker_id = icon_duration.get("timedMarkerId")
            if not isinstance(duration_source_type, str) or not duration_source_type:
                raise ValueError(f"{icon_path}.durationSourceType: expected non-empty string")
            if not isinstance(timed_marker_id, str):
                raise ValueError(f"{icon_path}.timedMarkerId: expected string")

            in_sequence, in_types = parse_sequence(
                value.get("actionInAura"), f"{action_path}.actionInAura"
            )
            exit_sequence, exit_types = parse_sequence(
                value.get("actionWhenExitAura"), f"{action_path}.actionWhenExitAura"
            )
            nested_combat_actions = tuple(
                sorted(
                    {
                        action_name(str(action["$type"]))
                        for sequence in (in_sequence, exit_sequence)
                        for action in walk_actions(sequence)
                        if action_name(str(action["$type"]))
                        in AUDITED_COMBAT_ACTION_NAMES
                    }
                )
            )

            priority_level = value.get("priorityLevel")
            priority_offset = value.get("priorityOffset")
            debug_name = value.get("auraDebugName")
            aura_type = value.get("auraType")
            buff_source = value.get("buffSource")
            target_object_type = value.get("targetObjectType")
            for key, item in (
                ("priorityLevel", priority_level),
                ("auraDebugName", debug_name),
                ("auraType", aura_type),
                ("buffSource", buff_source),
            ):
                if not isinstance(item, str) or (key != "auraDebugName" and not item):
                    raise ValueError(f"{action_path}.{key}: expected string")
            if not isinstance(priority_offset, int) or isinstance(priority_offset, bool):
                raise ValueError(f"{action_path}.priorityOffset: expected integer")
            if not isinstance(target_object_type, (str, int)) or isinstance(
                target_object_type, bool
            ):
                raise ValueError(f"{action_path}.targetObjectType: expected string or integer")

            result.append(
                AuraActionSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(value, action_path),
                    sourceFile=source_name,
                    activationSource="timeline",
                    activationEvent=None,
                    actionPath=path,
                    priorityLevel=priority_level,
                    priorityOffset=priority_offset,
                    debugName=debug_name,
                    auraType=aura_type,
                    root=parse_target_reference(value.get("auraRoot"), f"{action_path}.auraRoot"),
                    fixedWhenStart=require_bool(
                        value.get("fixedWhenStart"), f"{action_path}.fixedWhenStart"
                    ),
                    shape=AuraShapeSource(
                        shapeType=shape_type,
                        rotationOffset=parse_vector3(
                            shape.get("_rotationOffset"), f"{shape_path}._rotationOffset"
                        ),
                        useExtentKeys=require_bool(
                            shape.get("_useExtentKey"), f"{shape_path}._useExtentKey"
                        ),
                        extent=parse_vector3(shape.get("_extent"), f"{shape_path}._extent"),
                        extentKeys=(
                            shape["_extentXKey"],
                            shape["_extentYKey"],
                            shape["_extentZKey"],
                        ),
                        useCenterKeys=require_bool(
                            shape.get("_useCenterKey"), f"{shape_path}._useCenterKey"
                        ),
                        center=parse_vector3(shape.get("_center"), f"{shape_path}._center"),
                        centerKeys=(
                            shape["_centerXKey"],
                            shape["_centerYKey"],
                            shape["_centerZKey"],
                        ),
                        height=require_number(shape.get("_height"), f"{shape_path}._height"),
                        heightKey=shape["_heightKey"],
                        radius=require_number(shape.get("_radius"), f"{shape_path}._radius"),
                        radiusKey=shape["_radiusKey"],
                    ),
                    excludeColliderOptions=require_non_negative_int(
                        value.get("excludeColliderOptions"),
                        f"{action_path}.excludeColliderOptions",
                    ),
                    targetObjectType=target_object_type,
                    targetFilter=AuraTargetFilterSource(
                        checkAlive=require_bool(
                            target_filter.get("checkAlive"), f"{filter_path}.checkAlive"
                        ),
                        autoSetTargetFaction=require_bool(
                            target_filter.get("autoSetTargetFaction"),
                            f"{filter_path}.autoSetTargetFaction",
                        ),
                        factionTarget=faction_target,
                        factionTargetType=faction_target_type,
                        filterObjectType=require_bool(
                            target_filter.get("filterObjectType"),
                            f"{filter_path}.filterObjectType",
                        ),
                        objectType=object_type,
                        filterSlot=require_bool(
                            target_filter.get("filterSlot"), f"{filter_path}.filterSlot"
                        ),
                        slotIndex=require_non_negative_int(
                            target_filter.get("slotIndex"), f"{filter_path}.slotIndex"
                        ),
                        filterGameplayTag=require_bool(
                            target_filter.get("filterGameplayTag"),
                            f"{filter_path}.filterGameplayTag",
                        ),
                        tagQueryType=tag_query_type,
                        tagIds=tag_ids,
                    ),
                    excludeOwner=require_bool(
                        value.get("excludeOwner"), f"{action_path}.excludeOwner"
                    ),
                    includeUnmarkable=require_bool(
                        value.get("includeUnmarkable"), f"{action_path}.includeUnmarkable"
                    ),
                    limitInfluenceCountPerTarget=require_bool(
                        value.get("limitInfluenceCountPerTarget"),
                        f"{action_path}.limitInfluenceCountPerTarget",
                    ),
                    maxInfluenceCountPerTarget=require_non_negative_int(
                        value.get("maxInfluenceCountPerTarget"),
                        f"{action_path}.maxInfluenceCountPerTarget",
                    ),
                    buffSource=buff_source,
                    buffs=parse_buff_application_entries(
                        value.get("buffInput"),
                        f"{action_path}.buffInput",
                        inherited_blackboard,
                    ),
                    overrideBuffIconDuration=require_bool(
                        value.get("overrideBuffIconDuration"),
                        f"{action_path}.overrideBuffIconDuration",
                    ),
                    buffIconDurationSourceType=duration_source_type,
                    buffIconDurationTimedMarkerId=timed_marker_id,
                    inheritSourceSkillCastId=require_bool(
                        value.get("inheritSourceSkillCastId"),
                        f"{action_path}.inheritSourceSkillCastId",
                    ),
                    actionInAuraOnlyMainOperator=require_bool(
                        in_sequence.get("onlyExecuteWhenSourceIsMainChar"),
                        f"{action_path}.actionInAura.onlyExecuteWhenSourceIsMainChar",
                    ),
                    actionInAuraOnlyGuard=require_bool(
                        in_sequence.get("onlyExecuteWhenSourceIsGuard"),
                        f"{action_path}.actionInAura.onlyExecuteWhenSourceIsGuard",
                    ),
                    actionInAuraTypes=in_types,
                    actionWhenExitAuraOnlyMainOperator=require_bool(
                        exit_sequence.get("onlyExecuteWhenSourceIsMainChar"),
                        f"{action_path}.actionWhenExitAura.onlyExecuteWhenSourceIsMainChar",
                    ),
                    actionWhenExitAuraOnlyGuard=require_bool(
                        exit_sequence.get("onlyExecuteWhenSourceIsGuard"),
                        f"{action_path}.actionWhenExitAura.onlyExecuteWhenSourceIsGuard",
                    ),
                    actionWhenExitAuraTypes=exit_types,
                    nestedCombatActions=nested_combat_actions,
                )
            )

        for key, child in value.items():
            visit(child, start_frame, end_frame, (*path, key))

    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline_path = f"{source_name}.timelineActions[{timeline_index}]"
        timeline = require_dict(raw_timeline, timeline_path)
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{timeline_path}._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{timeline_path}._endFrame"
        )
        visit(
            timeline.get("_sequenceActionData"),
            start_frame,
            end_frame,
            (f"timelineActions[{timeline_index}]", "_sequenceActionData"),
        )
    return tuple(result)


def parse_buff_aura_actions(
    buff: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[AuraActionSource, ...]:
    """读取 Buff 事件注册的光环；它们由事件和 Buff 生命周期定时，不属于技能帧。"""
    result: list[AuraActionSource] = []
    for activation_source, field, event_key in (
        ("buffEvent", "buffEventAction", "buffEvent"),
        ("abilityEvent", "abilityEventAction", "abilityEvent"),
    ):
        for event_index, raw_event in enumerate(
            require_list(buff.get(field, []), f"{source_name}.{field}")
        ):
            event_path = f"{source_name}.{field}[{event_index}]"
            event = require_dict(raw_event, event_path)
            event_name = event.get(event_key)
            if not isinstance(event_name, str) or not event_name:
                raise ValueError(f"{event_path}.{event_key}: expected non-empty string")
            for action_index, raw_sequence in enumerate(
                require_list(event.get("actions"), f"{event_path}.actions")
            ):
                sequence_path = f"{event_path}.actions[{action_index}]"
                sequence = require_dict(raw_sequence, sequence_path)
                synthetic_root = {
                    "actionGroupData": {
                        "timelineActions": [
                            {
                                "_startFrame": 0,
                                "_endFrame": 0,
                                "_sequenceActionData": sequence,
                            }
                        ]
                    }
                }
                for aura in parse_aura_actions(
                    synthetic_root, source_name, inherited_blackboard
                ):
                    result.append(
                        replace(
                            aura,
                            startFrame=None,
                            endFrame=None,
                            activationSource=cast(
                                Literal["buffEvent", "abilityEvent"],
                                activation_source,
                            ),
                            activationEvent=event_name,
                            actionPath=(
                                f"{field}[{event_index}]",
                                f"actions[{action_index}]",
                                *aura.actionPath[2:],
                            ),
                        )
                    )
    return tuple(result)


def parse_auxiliary_actions(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[AuxiliaryActionSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[AuxiliaryActionSource] = []
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{source_name}.timelineActions[{timeline_index}]._endFrame"
        )
        actions = list(walk_unconditional_actions(timeline.get("_sequenceActionData")))
        for action in actions:
            if action.get("isEnable") is False:
                continue
            name = action_name(action["$type"])
            if name == "CreateBuffAction":
                payload = parse_buff_application_payload(
                    action,
                    f"{source_name}.CreateBuffAction",
                    inherited_blackboard,
                )
                for buff in payload.buffs:
                    result.append(
                        AuxiliaryActionSource(
                            startFrame=start_frame,
                            endFrame=end_frame,
                            actionIndex=require_server_action_index(
                                action, f"{source_name}.CreateBuffAction"
                            ),
                            actionType=name,
                            sourceId=buff.buffId,
                            classification=buff.classification,
                            targetSource=payload.targetSource,
                            targetGroupKey=payload.targetGroupKey,
                            count=payload.count,
                            buffSource=payload.buffSource,
                            buffSourceContextKey=payload.buffSourceContextKey,
                            inheritSourceSkillCastInfo=payload.inheritSourceSkillCastInfo,
                            blackboardAssignments=buff.blackboardAssignments,
                            nestedCombatActions=(),
                            targetFinderType=payload.targetFinderType,
                            targetValidatorTypes=payload.targetValidatorTypes,
                            targetPostProcessorTypes=payload.targetPostProcessorTypes,
                        )
                    )
            elif name == "SpawnAbilityEntity":
                payload = parse_ability_entity_spawn_payload(
                    action, f"{source_name}.SpawnAbilityEntity"
                )
                if payload.skillId is None:
                    result.append(
                        AuxiliaryActionSource(
                            startFrame=start_frame,
                            endFrame=end_frame,
                            actionIndex=require_server_action_index(
                                action, f"{source_name}.SpawnAbilityEntity"
                            ),
                            actionType=name,
                            sourceId=payload.abilityEntityId,
                            classification="nonCombatAbilityEntity",
                            targetSource="",
                            targetGroupKey="",
                            count=None,
                            buffSource=None,
                            buffSourceContextKey=None,
                            inheritSourceSkillCastInfo=None,
                            blackboardAssignments={},
                            nestedCombatActions=(),
                        )
                    )
                    continue
                skill_id = payload.skillId
                child_name = f"{skill_id}.json"
                child_path = source_dir / child_name
                if not child_path.is_file():
                    raise FileNotFoundError(f"{source_name}: missing ability entity skill {child_path}")
                child = load_projected_skill_data(child_path, child_name)
                nested = tuple(
                    sorted(
                        {
                            action_name(item["$type"])
                            for item in walk_actions(child.get("actionGroupData"))
                            if action_name(item["$type"]) in AUDITED_COMBAT_ACTION_NAMES
                        }
                    )
                )
                result.append(
                    AuxiliaryActionSource(
                        startFrame=start_frame,
                        endFrame=end_frame,
                        actionIndex=require_server_action_index(
                            action, f"{source_name}.SpawnAbilityEntity"
                        ),
                        actionType=name,
                        sourceId=f"{payload.abilityEntityId}:{skill_id}",
                        classification="nonCombatAbilityEntity" if not nested else None,
                        targetSource="",
                        targetGroupKey="",
                        count=None,
                        buffSource=None,
                        buffSourceContextKey=None,
                        inheritSourceSkillCastInfo=None,
                        blackboardAssignments={},
                        nestedCombatActions=nested,
                    )
                )
    return tuple(result)


RESOURCE_TYPE_MAP = {
    "UltimateSp": "ultimateEnergy",
    "Atb": "sp",
}


def parse_resource_gains(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[TimedResourceGainSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    once_gates = collect_once_resource_gain_gates(group, f"{source_name}.actionGroupData")
    if once_gates:
        declared_blackboard = {
            item.key: item for item in parse_declared_blackboard(root, source_name)
        }
        for flag_key in set(once_gates.values()):
            declaration = declared_blackboard.get(flag_key)
            if declaration is None or declaration.value != 0 or not declaration.isDynamic:
                raise ValueError(
                    f"{source_name}.blackboard: once-only resource flag {flag_key!r} "
                    "must be a dynamic value initialized to 0"
                )
    result: list[TimedResourceGainSource] = []
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{source_name}.timelineActions[{timeline_index}]._endFrame"
        )
        for action in walk_single_enemy_actions(
            timeline.get("_sequenceActionData"),
            f"{source_name}.timelineActions[{timeline_index}]._sequenceActionData",
        ):
            if action_name(action["$type"]) != "ObtainCostAction" or action.get("isEnable") is False:
                continue
            payload = parse_resource_gain_payload(
                action,
                f"{source_name}.ObtainCostAction",
                inherited_blackboard,
            )
            result.append(
                TimedResourceGainSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        action, f"{source_name}.ObtainCostAction"
                    ),
                    resource=payload.resource,
                    amount=payload.amount,
                    coefficient=payload.coefficient,
                    spGainKind=payload.spGainKind,
                    spGainSource=payload.spGainSource,
                    onlyMainOperator=payload.onlyMainOperator,
                    isPercentValue=payload.isPercentValue,
                    useUltimateRecoveryTag=payload.useUltimateRecoveryTag,
                    ultimateRecoveryTagId=payload.ultimateRecoveryTagId,
                    ignoreUltimateGainScalar=payload.ignoreUltimateGainScalar,
                    onceActionValueKey=once_gates.get(id(action)),
                )
            )
    return tuple(result)


def filter_once_resource_gains(
    gains: Iterable[TimedResourceGainSource],
) -> tuple[TimedResourceGainSource, ...]:
    """按动作实例黑板门保留首次回能，未受门控的回能保持原顺序。"""
    result: list[TimedResourceGainSource] = []
    consumed_flags: set[str] = set()
    for gain in gains:
        flag_key = getattr(gain, "onceActionValueKey", None)
        if flag_key is not None:
            if flag_key in consumed_flags:
                continue
            consumed_flags.add(flag_key)
        result.append(gain)
    return tuple(result)


def resolve_projectile_payload_triggers(
    payload: ProjectileLaunchPayload,
    source_root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    launch_frame: int,
    action_order: tuple[int, ...],
    stack: tuple[str, ...],
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[ProjectileTriggeredSkillSource, ...]:
    """解析一次已定位的投射物发射；调用方负责提供其真实帧与动作顺序。"""
    result: list[ProjectileTriggeredSkillSource] = []
    for trigger in payload.skillTriggers:
        trigger_source_name = f"{trigger.skillId}.json"
        trigger_path = source_dir / trigger_source_name
        if not trigger_path.is_file():
            raise FileNotFoundError(
                f"{source_name}: missing projectile {trigger.event} skill {trigger_path}"
            )
        trigger_root = load_projected_skill_data(trigger_path, trigger_source_name)
        trigger_blackboard = {
            item.key: (item.value,)
            for item in parse_declared_blackboard(trigger_root, trigger_source_name)
        }
        if payload.assignBlackboard:
            trigger_blackboard.update(inherited_blackboard)
        cycle_truncated = trigger.skillId in stack
        child_stack = (*stack, trigger.skillId)
        parsed_conditions = parse_conditional_actions(
            trigger_root,
            trigger_source_name,
            trigger_blackboard,
        )
        trigger_conditions = (
            parsed_conditions
            if cycle_truncated
            else resolve_conditional_projectile_triggers(
                parsed_conditions,
                trigger_root,
                trigger_source_name,
                source_dir,
                launch_frame,
                child_stack,
                trigger_blackboard,
                action_order,
            )
        )
        if not cycle_truncated:
            trigger_conditions = resolve_conditional_aura_ability_entity_children(
                trigger_conditions,
                trigger_source_name,
                source_dir,
                launch_frame,
                child_stack,
                trigger_blackboard,
                action_order,
            )
            trigger_conditions = mark_projected_conditional_children(
                trigger_conditions
            )
        nested = (
            ()
            if cycle_truncated
            else (
                *resolve_projectile_triggered_skills(
                    trigger_root,
                    trigger_source_name,
                    source_dir,
                    launch_frame,
                    child_stack,
                    inherited_blackboard=trigger_blackboard,
                    parent_action_order=action_order,
                ),
                *collect_projected_conditional_projectile_skills(trigger_conditions),
            )
        )
        ability_entities = (
            ()
            if cycle_truncated
            else (
                *resolve_ability_entity_hits(
                    trigger_root,
                    trigger_source_name,
                    source_dir,
                    launch_frame,
                    child_stack,
                    trigger_blackboard,
                    parent_action_order=action_order,
                ),
                *resolve_guaranteed_conditional_ability_entity_hits(
                    trigger_conditions,
                    trigger_source_name,
                    source_dir,
                    launch_frame,
                    child_stack,
                    trigger_blackboard,
                    action_order,
                ),
            )
        )
        result.append(
            ProjectileTriggeredSkillSource(
                launchFrame=launch_frame,
                actionOrder=action_order,
                assumedTravelFrames=ASSUMED_PROJECTILE_TRAVEL_FRAMES,
                projectileId=payload.projectileId,
                triggerEvent=trigger.event,
                triggerSkillId=trigger.skillId,
                excludedByPrimaryTargetMarker=is_projectile_trigger_excluded_for_single_enemy(
                    source_root,
                    launch_frame,
                    action_order[-1],
                    trigger_root,
                    trigger_source_name,
                ),
                sourceFile=trigger_source_name,
                damageUnits=parse_damage_units(
                    trigger_root,
                    trigger_source_name,
                    trigger_blackboard,
                ),
                directDamageHits=parse_direct_damage_hits(
                    trigger_root,
                    trigger_source_name,
                    trigger_blackboard,
                ),
                conditionalActions=trigger_conditions,
                auxiliaryActions=parse_auxiliary_actions(
                    trigger_root,
                    trigger_source_name,
                    source_dir,
                    trigger_blackboard,
                ),
                resourceGains=parse_resource_gains(
                    trigger_root,
                    trigger_source_name,
                    trigger_blackboard,
                ),
                inflictions=parse_inflictions(trigger_root, trigger_source_name),
                combatActions=tuple(
                    sorted(
                        {
                            action_name(item["$type"])
                            for item in walk_actions(trigger_root.get("actionGroupData"))
                            if action_name(item["$type"]) in AUDITED_COMBAT_ACTION_NAMES
                        }
                    )
                ),
                cycleTruncated=cycle_truncated,
                nestedProjectileTriggeredSkills=nested,
                abilityEntityHits=ability_entities,
                auraActions=parse_aura_actions(
                    trigger_root, trigger_source_name, trigger_blackboard
                ),
            )
        )
    return tuple(result)


def resolve_projectile_triggered_skills(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    base_frame: int = 0,
    stack: tuple[str, ...] = (),
    inherited_blackboard: dict[str, tuple[float, ...]] | None = None,
    parent_action_order: tuple[int, ...] | None = None,
) -> tuple[ProjectileTriggeredSkillSource, ...]:
    result: list[ProjectileTriggeredSkillSource] = []
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        launch_frame = base_frame + require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "LaunchProjectile":
                continue
            if action.get("isEnable") is False:
                continue
            payload = parse_projectile_launch_payload(
                action, f"{source_name}.LaunchProjectile"
            )
            current_action_order = (
                *(parent_action_order or ()),
                require_server_action_index(action, f"{source_name}.LaunchProjectile"),
            )
            result.extend(
                resolve_projectile_payload_triggers(
                    payload,
                    root,
                    source_name,
                    source_dir,
                    launch_frame,
                    current_action_order,
                    stack,
                    inherited_blackboard or {},
                )
            )
    return tuple(result)


def resolve_conditional_projectile_triggers(
    conditions: tuple[ConditionalActionSource, ...],
    source_root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    base_frame: int,
    stack: tuple[str, ...],
    inherited_blackboard: dict[str, tuple[float, ...]],
    parent_action_order: tuple[int, ...] = (),
) -> tuple[ConditionalActionSource, ...]:
    """将条件叶子里的投射物触发技能挂回原分支，保留分支身份与原生顺序。"""

    def resolve_branch_action(
        condition: ConditionalActionSource,
        action: ConditionalBranchActionSource,
        nested_order: tuple[int, ...] = (),
    ) -> ConditionalBranchActionSource:
        action_order = (
            *parent_action_order,
            condition.actionIndex,
            *nested_order,
            action.actionIndex,
        )
        nested = action.nestedCondition
        if nested is not None:
            nested = resolve_conditional_projectile_triggers(
                (nested,),
                source_root,
                source_name,
                source_dir,
                base_frame,
                stack,
                inherited_blackboard,
                action_order,
            )[0]
        once_actions = action.onceActions
        if once_actions is not None:
            once_actions = tuple(
                resolve_branch_action(
                    condition,
                    nested_action,
                    (*nested_order, action.actionIndex),
                )
                for nested_action in once_actions
            )
        triggered = action.projectileTriggeredSkills
        if action.projectileLaunch is not None:
            triggered = resolve_projectile_payload_triggers(
                action.projectileLaunch,
                source_root,
                source_name,
                source_dir,
                base_frame + condition.startFrame,
                action_order,
                stack,
                inherited_blackboard,
            )
        return replace(
            action,
            nestedCondition=nested,
            onceActions=once_actions,
            projectileTriggeredSkills=triggered,
        )

    return tuple(
        replace(
            condition,
            succeedActions=tuple(
                resolve_branch_action(condition, action)
                for action in condition.succeedActions
            ),
            failActions=tuple(
                resolve_branch_action(condition, action)
                for action in condition.failActions
            ),
        )
        for condition in conditions
    )


def contains_structured_aura(value: Any) -> bool:
    """判断已解析调用子树中是否存在 AuraAction，供条件分支审计裁剪体积。"""
    if isinstance(value, AuraActionSource):
        return True
    if is_dataclass(value) and not isinstance(value, type):
        return any(contains_structured_aura(getattr(value, field.name)) for field in fields(value))
    if isinstance(value, dict):
        return any(contains_structured_aura(item) for item in value.values())
    if isinstance(value, (list, tuple)):
        return any(contains_structured_aura(item) for item in value)
    return False


def resolve_conditional_aura_ability_entity_children(
    conditions: tuple[ConditionalActionSource, ...],
    source_name: str,
    source_dir: Path,
    base_frame: int,
    stack: tuple[str, ...],
    inherited_blackboard: dict[str, tuple[float, ...]],
    parent_action_order: tuple[int, ...] = (),
) -> tuple[ConditionalActionSource, ...]:
    """解析条件分支专属的能力实体子技能，但不把它提升为必然发生的根调度。"""

    def resolve_branch_action(
        condition: ConditionalActionSource,
        action: ConditionalBranchActionSource,
        nested_order: tuple[int, ...] = (),
    ) -> ConditionalBranchActionSource:
        action_order = (
            *parent_action_order,
            condition.actionIndex,
            *nested_order,
            action.actionIndex,
        )
        nested = action.nestedCondition
        if nested is not None:
            nested = resolve_conditional_aura_ability_entity_children(
                (nested,),
                source_name,
                source_dir,
                base_frame,
                stack,
                inherited_blackboard,
                action_order,
            )[0]
        once_actions = action.onceActions
        if once_actions is not None:
            once_actions = tuple(
                resolve_branch_action(
                    condition,
                    nested_action,
                    (*nested_order, action.actionIndex),
                )
                for nested_action in once_actions
            )

        hits = action.auraAbilityEntityHits
        payload = action.abilityEntitySpawn
        if payload is not None and payload.skillId is not None:
            child_name = f"{payload.skillId}.json"
            child_path = source_dir / child_name
            if not child_path.is_file():
                raise FileNotFoundError(
                    f"{source_name}: missing conditional ability entity skill {child_path}"
                )
            child = load_projected_skill_data(child_path, child_name)
            resolved_hit = resolve_ability_entity_payload(
                    payload,
                    child,
                    child_name,
                    source_dir,
                    base_frame + condition.startFrame,
                    stack,
                    inherited_blackboard,
                    action_order,
                )
            hits = (resolved_hit,) if contains_structured_aura(resolved_hit) else None
        return replace(
            action,
            nestedCondition=nested,
            onceActions=once_actions,
            auraAbilityEntityHits=hits,
        )

    return tuple(
        replace(
            condition,
            succeedActions=tuple(
                resolve_branch_action(condition, action)
                for action in condition.succeedActions
            ),
            failActions=tuple(
                resolve_branch_action(condition, action)
                for action in condition.failActions
            ),
        )
        for condition in conditions
    )


def parse_projectile_launches(
    root: dict[str, Any],
    source_name: str,
    base_frame: int = 0,
) -> tuple[ProjectileLaunchSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[ProjectileLaunchSource] = []
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        launch_frame = base_frame + require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "LaunchProjectile" or action.get("isEnable") is False:
                continue
            payload = parse_projectile_launch_payload(
                action, f"{source_name}.LaunchProjectile"
            )
            result.append(
                ProjectileLaunchSource(
                    launchFrame=launch_frame,
                    projectileId=payload.projectileId,
                    skillTriggers=payload.skillTriggers,
                    assignBlackboard=payload.assignBlackboard,
                    entityBlackboardAssignments=payload.entityBlackboardAssignments,
                )
            )
    return tuple(result)


def resolve_ability_entity_hits(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    base_frame: int = 0,
    stack: tuple[str, ...] = (),
    inherited_blackboard: dict[str, tuple[float, ...]] | None = None,
    parent_action_order: tuple[int, ...] | None = None,
) -> tuple[AbilityEntityHitSource, ...]:
    """解析 SpawnAbilityEntity 引用的子技能，并保留父技能中的生成时刻。"""
    result: list[AbilityEntityHitSource] = []
    blackboard = inherited_blackboard or {}
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        spawn_frame = base_frame + require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "SpawnAbilityEntity" or action.get("isEnable") is False:
                continue
            payload = parse_ability_entity_spawn_payload(
                action, f"{source_name}.SpawnAbilityEntity"
            )
            if payload.skillId is None:
                continue
            skill_id = payload.skillId
            child_name = f"{skill_id}.json"
            child_path = source_dir / child_name
            if not child_path.is_file():
                raise FileNotFoundError(f"{source_name}: missing ability entity skill {child_path}")
            child = load_projected_skill_data(child_path, child_name)
            current_action_order = (
                *(parent_action_order or ()),
                require_server_action_index(action, f"{source_name}.SpawnAbilityEntity"),
            )
            result.append(
                resolve_ability_entity_payload(
                    payload,
                    child,
                    child_name,
                    source_dir,
                    spawn_frame,
                    stack,
                    blackboard,
                    current_action_order,
                )
            )
    return tuple(result)


def resolve_ability_entity_payload(
    payload: AbilityEntitySpawnPayload,
    child: dict[str, Any],
    child_name: str,
    source_dir: Path,
    spawn_frame: int,
    stack: tuple[str, ...],
    blackboard: dict[str, tuple[float, ...]],
    action_order: tuple[int, ...],
) -> AbilityEntityHitSource:
    """解析一项已确定会发生的能力实体生成，不关心它来自根动作还是条件叶子。"""
    skill_id = payload.skillId
    if skill_id is None:
        raise AssertionError("combat ability entity payload must expose skillId")
    declared_blackboard = parse_declared_blackboard(child, child_name)
    child_blackboard = {item.key: (item.value,) for item in declared_blackboard}
    if payload.assignBlackboard:
        child_blackboard.update(blackboard)
    for assignment in payload.entityBlackboardAssignments:
        if assignment.valueType != "Numeric":
            continue
        if assignment.useDirectValue:
            child_blackboard[assignment.targetKey] = (assignment.numericValue,)
            continue
        inherited_value = blackboard.get(assignment.inputValueKey)
        if inherited_value is not None:
            child_blackboard[assignment.targetKey] = inherited_value

    cycle_truncated = skill_id in stack
    child_conditions = parse_conditional_actions(child, child_name, child_blackboard)
    child_calculations = parse_blackboard_calculations(child, child_name, child_blackboard)
    child_mutations, child_reads, child_finishes = parse_blackboard_runtime_actions(
        child, child_name, child_blackboard
    )
    nested = ()
    if not cycle_truncated:
        child_stack = (*stack, skill_id)
        child_conditions = mark_projected_conditional_children(child_conditions)
        nested = (
            *resolve_ability_entity_hits(
                child,
                child_name,
                source_dir,
                spawn_frame,
                child_stack,
                child_blackboard,
                parent_action_order=action_order,
            ),
            *resolve_guaranteed_conditional_ability_entity_hits(
                child_conditions,
                child_name,
                source_dir,
                spawn_frame,
                child_stack,
                child_blackboard,
                action_order,
            ),
        )
    combat_actions = tuple(
        sorted(
            {
                action_name(item["$type"])
                for item in walk_actions(child.get("actionGroupData"))
                if action_name(item["$type"]) in AUDITED_COMBAT_ACTION_NAMES
            }
        )
    )
    return AbilityEntityHitSource(
        spawnFrame=spawn_frame,
        actionOrder=action_order,
        abilityEntityId=payload.abilityEntityId,
        skillId=skill_id,
        sourceFile=child_name,
        entityBlackboardAssignments=payload.entityBlackboardAssignments,
        directDamageHits=parse_direct_damage_hits(child, child_name, child_blackboard),
        intervalDamageHits=parse_interval_damage_hits(child, child_name, child_blackboard),
        conditionalActions=child_conditions,
        inflictions=parse_inflictions(child, child_name),
        auxiliaryActions=parse_auxiliary_actions(child, child_name, source_dir, child_blackboard),
        resourceGains=parse_resource_gains(child, child_name, child_blackboard),
        projectileLaunches=parse_projectile_launches(child, child_name, spawn_frame),
        projectileTriggeredSkills=(
            *resolve_projectile_triggered_skills(
                child,
                child_name,
                source_dir,
                spawn_frame,
                inherited_blackboard=child_blackboard,
                parent_action_order=action_order,
            ),
            *collect_projected_conditional_projectile_skills(child_conditions),
        ),
        nestedAbilityEntityHits=nested,
        combatActions=combat_actions,
        cycleTruncated=cycle_truncated,
        inheritsSourceBlackboard=payload.assignBlackboard,
        declaredBlackboard=declared_blackboard,
        blackboardCalculations=child_calculations,
        blackboardMutations=child_mutations,
        buffBlackboardReads=child_reads,
        buffFinishes=child_finishes,
        auraActions=parse_aura_actions(child, child_name, child_blackboard),
    )


def guaranteed_ability_entity_spawns(
    condition: ConditionalActionSource,
) -> tuple[AbilityEntitySpawnPayload, ...]:
    """仅当条件树每条叶子路径生成完全相同的实体序列时返回该序列。"""

    def branch_outcomes(
        actions: tuple[ConditionalBranchActionSource, ...],
    ) -> tuple[tuple[AbilityEntitySpawnPayload, ...], ...]:
        outcomes: tuple[tuple[AbilityEntitySpawnPayload, ...], ...] = ((),)
        for action in actions:
            ability_entity_spawn = getattr(action, "abilityEntitySpawn", None)
            nested_condition = getattr(action, "nestedCondition", None)
            if ability_entity_spawn is not None:
                additions = ((ability_entity_spawn,),)
            elif nested_condition is not None:
                additions = condition_outcomes(nested_condition)
            elif getattr(action, "onceActions", None) is not None:
                additions = branch_outcomes(action.onceActions)
            else:
                additions = ((),)
            outcomes = tuple((*prefix, *addition) for prefix in outcomes for addition in additions)
        return outcomes

    def condition_outcomes(
        current: ConditionalActionSource,
    ) -> tuple[tuple[AbilityEntitySpawnPayload, ...], ...]:
        return (*branch_outcomes(current.succeedActions), *branch_outcomes(current.failActions))

    outcomes = condition_outcomes(condition)
    if not outcomes or any(outcome != outcomes[0] for outcome in outcomes[1:]):
        return ()
    return outcomes[0]


def guaranteed_projectile_projections(
    condition: ConditionalActionSource,
) -> tuple[ConditionalProjectileProjection, ...]:
    """仅当条件树每条叶子路径发射完全相同的已解析投射物时返回投影。"""

    def outcomes_are_equivalent(
        left: tuple[ConditionalProjectileProjection, ...],
        right: tuple[ConditionalProjectileProjection, ...],
    ) -> bool:
        return len(left) == len(right) and all(
            projectile_projections_are_equivalent(left_item, right_item)
            for left_item, right_item in zip(left, right, strict=True)
        )

    def branch_outcomes(
        actions: tuple[ConditionalBranchActionSource, ...],
    ) -> tuple[tuple[ConditionalProjectileProjection, ...], ...]:
        outcomes: tuple[tuple[ConditionalProjectileProjection, ...], ...] = ((),)
        for action in actions:
            launch = action.projectileLaunch
            nested_condition = action.nestedCondition
            if launch is not None and action.projectileTriggeredSkills:
                additions = (
                    (
                        ConditionalProjectileProjection(
                            launch,
                            action.projectileTriggeredSkills,
                        ),
                    ),
                )
            elif nested_condition is not None:
                additions = condition_outcomes(nested_condition)
            elif getattr(action, "onceActions", None) is not None:
                additions = branch_outcomes(action.onceActions)
            else:
                additions = ((),)
            outcomes = tuple((*prefix, *addition) for prefix in outcomes for addition in additions)
        return outcomes

    def condition_outcomes(
        current: ConditionalActionSource,
    ) -> tuple[tuple[ConditionalProjectileProjection, ...], ...]:
        return (*branch_outcomes(current.succeedActions), *branch_outcomes(current.failActions))

    outcomes = condition_outcomes(condition)
    if not outcomes or any(
        not outcomes_are_equivalent(outcome, outcomes[0]) for outcome in outcomes[1:]
    ):
        return ()
    return outcomes[0]


def projectile_projections_are_equivalent(
    left: ConditionalProjectileProjection,
    right: ConditionalProjectileProjection,
) -> bool:
    """比较投射物的战斗语义，忽略分支路径带来的同帧排序前缀。"""

    def without_action_order(value: Any) -> Any:
        if isinstance(value, dict):
            return {
                key: without_action_order(item)
                for key, item in value.items()
                if key != "actionOrder"
            }
        if isinstance(value, list):
            return [without_action_order(item) for item in value]
        if isinstance(value, tuple):
            return tuple(without_action_order(item) for item in value)
        if hasattr(value, "__dict__"):
            return without_action_order(vars(value))
        return value

    return without_action_order(asdict(left)) == without_action_order(asdict(right))


def contains_equivalent_projectile_projection(
    projections: tuple[ConditionalProjectileProjection, ...],
    candidate: ConditionalProjectileProjection,
) -> bool:
    """判断投影集合是否已包含同一战斗行为。"""

    return any(
        projectile_projections_are_equivalent(projection, candidate)
        for projection in projections
    )


def mark_projected_conditional_children(
    conditions: tuple[ConditionalActionSource, ...],
) -> tuple[ConditionalActionSource, ...]:
    """标记已由解析层提升为确定子技能的生成动作，供 DSL 编译器避免重复消费。"""

    def mark_action(action: ConditionalBranchActionSource) -> ConditionalBranchActionSource:
        nested_condition = (
            None
            if action.nestedCondition is None
            else mark_condition(action.nestedCondition)
        )
        once_actions = (
            None
            if action.onceActions is None
            else tuple(mark_action(item) for item in action.onceActions)
        )
        return replace(
            action,
            nestedCondition=nested_condition,
            onceActions=once_actions,
        )

    def mark_condition(condition: ConditionalActionSource) -> ConditionalActionSource:
        marked = replace(
            condition,
            succeedActions=tuple(mark_action(action) for action in condition.succeedActions),
            failActions=tuple(mark_action(action) for action in condition.failActions),
        )
        projected = tuple(
            payload
            for payload in guaranteed_ability_entity_spawns(marked)
            if payload.skillId is not None
        )
        return replace(
            marked,
            projectedAbilityEntitySpawns=projected,
            projectedProjectileLaunches=guaranteed_projectile_projections(marked),
        )

    def retain_root_owned_projectiles_in_action(
        action: ConditionalBranchActionSource,
        root_owned: tuple[ConditionalProjectileProjection, ...],
    ) -> ConditionalBranchActionSource:
        nested_condition = (
            None
            if action.nestedCondition is None
            else retain_root_owned_projectiles_in_condition(
                action.nestedCondition,
                root_owned,
                is_root=False,
            )
        )
        once_actions = (
            None
            if action.onceActions is None
            else tuple(
                retain_root_owned_projectiles_in_action(item, root_owned)
                for item in action.onceActions
            )
        )
        return replace(
            action,
            nestedCondition=nested_condition,
            onceActions=once_actions,
        )

    def retain_root_owned_projectiles_in_condition(
        condition: ConditionalActionSource,
        root_owned: tuple[ConditionalProjectileProjection, ...],
        *,
        is_root: bool,
    ) -> ConditionalActionSource:
        # 根调度只收集顶层投影；内层仅能消费由根节点唯一拥有的投影。
        retained = (
            condition.projectedProjectileLaunches
            if is_root
            else tuple(
                projection
                for projection in condition.projectedProjectileLaunches
                if sum(
                    projectile_projections_are_equivalent(projection, candidate)
                    for candidate in root_owned
                )
                == 1
            )
        )
        return replace(
            condition,
            succeedActions=tuple(
                retain_root_owned_projectiles_in_action(action, root_owned)
                for action in condition.succeedActions
            ),
            failActions=tuple(
                retain_root_owned_projectiles_in_action(action, root_owned)
                for action in condition.failActions
            ),
            projectedProjectileLaunches=retained,
        )

    result: list[ConditionalActionSource] = []
    for condition in conditions:
        marked = mark_condition(condition)
        result.append(
            retain_root_owned_projectiles_in_condition(
                marked,
                marked.projectedProjectileLaunches,
                is_root=True,
            )
        )
    return tuple(result)


def collect_projected_conditional_projectile_skills(
    conditions: tuple[ConditionalActionSource, ...],
) -> tuple[ProjectileTriggeredSkillSource, ...]:
    """汇总已标记的确定投射物子技能；其帧与动作顺序已在解析叶子时换算。"""
    return tuple(
        skill
        for condition in conditions
        for projection in condition.projectedProjectileLaunches
        for skill in projection.triggeredSkills
    )


def is_single_enemy_ability_entity_projection(condition: ConditionalActionSource) -> bool:
    """确认条件树除必然生成能力实体外，只修改单敌人定位使用的临时黑板。"""

    def branch_is_supported(actions: tuple[ConditionalBranchActionSource, ...]) -> bool:
        for action in actions:
            if getattr(action, "abilityEntitySpawn", None) is not None:
                continue
            nested_condition = getattr(action, "nestedCondition", None)
            if nested_condition is not None:
                if not condition_is_supported(nested_condition):
                    return False
                continue
            mutation = getattr(action, "blackboardMutation", None)
            if mutation is None:
                return False
            if (
                mutation.key != "target_in_range"
                or mutation.operation != "Assign"
                or mutation.value.blackboardKey is not None
                or mutation.value.value != 1
            ):
                return False
        return True

    def condition_is_supported(current: ConditionalActionSource) -> bool:
        return (
            bool(guaranteed_ability_entity_spawns(current))
            and branch_is_supported(current.succeedActions)
            and branch_is_supported(current.failActions)
        )

    return condition_is_supported(condition)


def resolve_guaranteed_conditional_ability_entity_hits(
    conditions: tuple[ConditionalActionSource, ...],
    source_name: str,
    source_dir: Path,
    base_frame: int,
    stack: tuple[str, ...],
    blackboard: dict[str, tuple[float, ...]],
    parent_action_order: tuple[int, ...] = (),
) -> tuple[AbilityEntityHitSource, ...]:
    """投影条件无关的能力实体生成；分支结果不一致时保留在条件审计层。"""
    result: list[AbilityEntityHitSource] = []
    for condition in conditions:
        for branch_index, payload in enumerate(guaranteed_ability_entity_spawns(condition)):
            if payload.skillId is None:
                continue
            child_name = f"{payload.skillId}.json"
            child_path = source_dir / child_name
            if not child_path.is_file():
                raise FileNotFoundError(f"{source_name}: missing ability entity skill {child_path}")
            child = load_projected_skill_data(child_path, child_name)
            result.append(
                resolve_ability_entity_payload(
                    payload,
                    child,
                    child_name,
                    source_dir,
                    base_frame + condition.startFrame,
                    stack,
                    blackboard,
                    (*parent_action_order, condition.actionIndex, branch_index),
                )
            )
    return tuple(result)


def collect_resolved_damage_hits(skill: SkillSource) -> tuple[ResolvedDamageHitSource, ...]:
    """将根技能及其引用子技能中的伤害动作投影到根技能的绝对帧。"""
    candidates: list[tuple[ResolvedDamageHitSource, str | None, int]] = []

    def append(
        resolved: ResolvedDamageHitSource,
        marker_id: str | None = None,
        marker_duration_frames: int = 0,
    ) -> None:
        candidates.append((resolved, marker_id, marker_duration_frames))

    for hit in skill.directDamageHits:
        if hit.damageUnits:
            append(
                ResolvedDamageHitSource(
                    hit.startFrame,
                    (hit.actionIndex,),
                    "direct",
                    (skill.skillId,),
                    hit.damageUnits,
                )
            )

    def collect_projectile(hit: ProjectileTriggeredSkillSource, path: tuple[str, ...]) -> None:
        if getattr(hit, "excludedByPrimaryTargetMarker", False):
            return
        current_path = (*path, hit.triggerSkillId)
        for damage in hit.directDamageHits:
            if damage.damageUnits:
                append(
                    ResolvedDamageHitSource(
                        hit.launchFrame + hit.assumedTravelFrames + damage.startFrame,
                        (*hit.actionOrder, damage.actionIndex),
                        "projectile",
                        current_path,
                        damage.damageUnits,
                    )
                )
        for nested in hit.nestedProjectileTriggeredSkills:
            collect_projectile(nested, current_path)
        for entity in getattr(hit, "abilityEntityHits", ()):
            collect_entity(entity, current_path)

    def collect_entity(hit: AbilityEntityHitSource, path: tuple[str, ...]) -> None:
        current_path = (*path, hit.skillId)
        for damage in hit.directDamageHits:
            if damage.damageUnits:
                marker_id = None
                marker_duration_frames = 0
                gate = getattr(damage, "timedMarkerGate", None)
                if gate is not None:
                    if not gate.returnTrueIfNotExists:
                        raise ValueError(
                            f"{hit.skillId}: timed marker gate must pass when the marker is absent"
                        )
                    assignments = [
                        assignment
                        for assignment in getattr(hit, "entityBlackboardAssignments", ())
                        if assignment.targetKey == gate.markerBlackboardKey
                    ]
                    if (
                        len(assignments) != 1
                        or assignments[0].valueType != "String"
                        or not assignments[0].useDirectValue
                    ):
                        raise ValueError(
                            f"{hit.skillId}: timed marker key {gate.markerBlackboardKey!r} "
                            "does not resolve to one string assignment"
                        )
                    marker_id = assignments[0].stringValue
                    marker_duration_frames_float = gate.durationSeconds * 30
                    marker_duration_frames = round(marker_duration_frames_float)
                    if abs(marker_duration_frames_float - marker_duration_frames) > 1e-6:
                        raise ValueError(
                            f"{hit.skillId}: timed marker duration does not align to combat frames"
                        )
                append(
                    ResolvedDamageHitSource(
                        hit.spawnFrame + damage.startFrame,
                        (*hit.actionOrder, damage.actionIndex),
                        "abilityEntity",
                        current_path,
                        damage.damageUnits,
                    ),
                    marker_id,
                    marker_duration_frames,
                )
        for repeated in getattr(hit, "intervalDamageHits", ()):
            for tick_index, tick_frame in enumerate(repeated.tickFrames):
                append(
                    ResolvedDamageHitSource(
                        hit.spawnFrame + tick_frame,
                        (
                            *hit.actionOrder,
                            repeated.actionIndex,
                            tick_index,
                            repeated.damageActionIndex,
                        ),
                        "abilityEntityInterval",
                        current_path,
                        repeated.damageUnits,
                    )
                )
        for projectile in hit.projectileTriggeredSkills:
            collect_projectile(projectile, current_path)
        for nested in hit.nestedAbilityEntityHits:
            collect_entity(nested, current_path)

    root_path = (skill.skillId,)
    for projectile in skill.projectileTriggeredSkills:
        collect_projectile(projectile, root_path)
    for entity in skill.abilityEntityHits:
        collect_entity(entity, root_path)
    result: list[ResolvedDamageHitSource] = []
    marker_expiry_frames: dict[str, int] = {}
    for hit, marker_id, duration_frames in sorted(
        candidates, key=lambda item: (item[0].frame, item[0].actionOrder)
    ):
        if marker_id is not None:
            if hit.frame < marker_expiry_frames.get(marker_id, -1):
                continue
            marker_expiry_frames[marker_id] = hit.frame + duration_frames
        result.append(hit)
    return tuple(result)


def collect_resolved_schedule(skill: SkillSource) -> tuple[ResolvedScheduleItemSource, ...]:
    """归并根技能中的伤害、Buff 施加与条件根，不展开条件分支内部的局部顺序。"""
    result = [
        ResolvedScheduleItemSource(
            frame=hit.frame,
            actionOrder=hit.actionOrder,
            itemType="damage",
            sourcePath=hit.sourcePath,
            payload=hit,
        )
        for hit in collect_resolved_damage_hits(skill)
    ]
    result.extend(
        ResolvedScheduleItemSource(
            frame=action.startFrame,
            actionOrder=(action.actionIndex,),
            itemType="buffApplication",
            sourcePath=(skill.skillId,),
            payload=action,
            inputTarget="enemy",
        )
        for action in skill.auxiliaryActions
        if action.actionType == "CreateBuffAction"
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=frame,
            actionOrder=(action.actionIndex,),
            itemType="condition",
            sourcePath=action.actionPath,
            payload=action,
            inputTarget="enemy",
        )
        for action in skill.conditionalActions
        for frame in (getattr(action, "executionFrames", ()) or (action.startFrame,))
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=calculation.startFrame,
            actionOrder=(calculation.actionIndex,),
            itemType="blackboardCalculation",
            sourcePath=(skill.skillId,),
            payload=calculation,
        )
        for calculation in skill.blackboardCalculations
    )
    for item_type, actions in (
        ("blackboardMutation", skill.blackboardMutations),
        ("buffBlackboardRead", skill.buffBlackboardReads),
        ("buffFinish", skill.buffFinishes),
        ("buffHold", getattr(skill, "buffHolds", ())),
    ):
        result.extend(
            ResolvedScheduleItemSource(
                frame=action.startFrame,
                actionOrder=(action.actionIndex,),
                itemType=item_type,
                sourcePath=(skill.skillId,),
                payload=action,
                inputTarget="enemy",
            )
            for action in actions
        )
    for index, gain in enumerate(filter_once_resource_gains(skill.resourceGains)):
        if not resource_gain_can_change_value(
            gain, f"{skill.key}.resourceGains[{index}].amount"
        ):
            continue
        result.append(
            ResolvedScheduleItemSource(
                frame=gain.startFrame,
                actionOrder=(gain.actionIndex,),
                itemType="resourceGain",
                sourcePath=(skill.skillId,),
                payload=gain,
            )
        )
    result.extend(
        ResolvedScheduleItemSource(
            frame=infliction.startFrame,
            actionOrder=(infliction.actionIndex,),
            itemType="infliction",
            sourcePath=(skill.skillId,),
            payload=infliction,
        )
        for infliction in skill.inflictions
    )
    for projectile in skill.projectileTriggeredSkills:
        collect_projectile_schedule(projectile, result)
    for entity in skill.abilityEntityHits:
        collect_ability_entity_schedule(entity, result)
    return tuple(sorted(result, key=lambda item: (item.frame, item.actionOrder)))


def root_target_group_writes_for_condition(
    skill: SkillSource,
    item: ResolvedScheduleItemSource,
    condition: ConditionalActionSource,
) -> tuple[TargetGroupWriteSource, ...]:
    """只把根技能目标组目录交给根条件；递归子技能拥有独立动作上下文。"""
    if item.sourcePath != condition.actionPath:
        return ()
    return getattr(skill, "targetGroupWrites", ())


def resource_gain_can_change_value(
    gain: ResourceGainPayload | TimedResourceGainSource,
    path: str,
) -> bool:
    """动态 amount 必须进入运行时；只有已解析且全为零的值可以提前过滤。"""
    if gain.amount.blackboardKey is not None and gain.amount.levelValues is None:
        return True
    return any(value != 0 for value in require_level_values(gain.amount, path))


def root_skill_has_output_damage_before(
    schedule: tuple[ResolvedScheduleItemSource, ...],
    current_index: int,
    skill_id: str,
) -> bool:
    """判断当前调度项之前，根技能是否已经执行过必然命中的伤害。"""
    current = schedule[current_index]
    current_order = (current.frame, current.actionOrder)
    return any(
        item.itemType == "damage"
        and item.sourcePath == (skill_id,)
        and (item.frame, item.actionOrder) < current_order
        for item in schedule
    )


def collect_projectile_schedule(
    hit: ProjectileTriggeredSkillSource,
    result: list[ResolvedScheduleItemSource],
) -> None:
    """把投射物命中子技能的条件与回能换算到根技能帧坐标。"""
    if hit.excludedByPrimaryTargetMarker:
        return
    hit_frame = hit.launchFrame + hit.assumedTravelFrames
    source_path = (hit.triggerSkillId,)
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit_frame + action.startFrame,
            actionOrder=(*hit.actionOrder, action.actionIndex),
            itemType="buffApplication",
            sourcePath=source_path,
            payload=action,
            inputTarget="enemy",
        )
        for action in getattr(hit, "auxiliaryActions", ())
        if action.actionType == "CreateBuffAction"
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit_frame + frame,
            actionOrder=(*hit.actionOrder, condition.actionIndex),
            itemType="condition",
            sourcePath=(*source_path, *condition.actionPath),
            payload=condition,
            inputTarget="enemy",
        )
        for condition in hit.conditionalActions
        for frame in (condition.executionFrames or (condition.startFrame,))
    )
    for gain in filter_once_resource_gains(hit.resourceGains):
        if not resource_gain_can_change_value(
            gain, f"{hit.triggerSkillId}.resourceGain"
        ):
            continue
        result.append(
            ResolvedScheduleItemSource(
                frame=hit_frame + gain.startFrame,
                actionOrder=(*hit.actionOrder, gain.actionIndex),
                itemType="resourceGain",
                sourcePath=source_path,
                payload=gain,
            )
        )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit_frame + infliction.startFrame,
            actionOrder=(*hit.actionOrder, infliction.actionIndex),
            itemType="infliction",
            sourcePath=source_path,
            payload=infliction,
        )
        for infliction in getattr(hit, "inflictions", ())
    )
    for nested in hit.nestedProjectileTriggeredSkills:
        collect_projectile_schedule(nested, result)
    for entity in getattr(hit, "abilityEntityHits", ()):
        collect_ability_entity_schedule(entity, result)


def collect_ability_entity_schedule(
    hit: AbilityEntityHitSource,
    result: list[ResolvedScheduleItemSource],
) -> None:
    """把能力实体子技能中的非伤害动作换算到根技能帧坐标。"""
    source_path = (hit.skillId,)
    projected_interval_frames = {
        interval.tickFrames for interval in getattr(hit, "intervalDamageHits", ())
    }
    for item_type, actions in (
        ("blackboardCalculation", getattr(hit, "blackboardCalculations", ())),
        ("blackboardMutation", getattr(hit, "blackboardMutations", ())),
        ("buffBlackboardRead", getattr(hit, "buffBlackboardReads", ())),
        ("buffFinish", getattr(hit, "buffFinishes", ())),
    ):
        result.extend(
            ResolvedScheduleItemSource(
                frame=hit.spawnFrame + action.startFrame,
                actionOrder=(*hit.actionOrder, action.actionIndex),
                itemType=cast(ResolvedScheduleItemType, item_type),
                sourcePath=source_path,
                payload=action,
            )
            for action in actions
        )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit.spawnFrame + frame,
            actionOrder=(*hit.actionOrder, condition.actionIndex),
            itemType="condition",
            sourcePath=(*source_path, *condition.actionPath),
            payload=condition,
            inputTarget="enemy",
        )
        for condition in getattr(hit, "conditionalActions", ())
        for frame in (
            getattr(condition, "executionFrames", ()) or (condition.startFrame,)
        )
        # 两个分支伤害等价时，周期伤害解析器已将其投影为确定伤害；这里不能重复排入。
        if getattr(condition, "executionFrames", ()) not in projected_interval_frames
        if len(getattr(condition, "executionFrames", ())) > 1
    )
    resource_gains = sorted(
        getattr(hit, "resourceGains", ()), key=lambda item: (item.startFrame, item.actionIndex)
    )
    for gain in filter_once_resource_gains(resource_gains):
        if not resource_gain_can_change_value(gain, f"{hit.skillId}.resourceGain"):
            continue
        result.append(
            ResolvedScheduleItemSource(
                frame=hit.spawnFrame + gain.startFrame,
                actionOrder=(*hit.actionOrder, gain.actionIndex),
                itemType="resourceGain",
                sourcePath=source_path,
                payload=gain,
            )
        )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit.spawnFrame + infliction.startFrame,
            actionOrder=(*hit.actionOrder, infliction.actionIndex),
            itemType="infliction",
            sourcePath=source_path,
            payload=infliction,
        )
        for infliction in getattr(hit, "inflictions", ())
    )
    for nested in getattr(hit, "nestedAbilityEntityHits", ()):
        collect_ability_entity_schedule(nested, result)


def collect_consumed_root_timed_marker_action_ids(
    root: dict[str, Any], source_name: str
) -> frozenset[int]:
    """定位已由专用投影消费的根级标记；未知形状仍进入严格审计。"""
    skill_id = root.get("skillId")
    if not isinstance(skill_id, str):
        raise ValueError(f"{source_name}.skillId: expected string")
    result: set[int] = set()
    for action in walk_actions(root.get("actionGroupData")):
        if action_name(str(action.get("$type", ""))) != "CreateTimedMarker":
            continue
        marker = require_dict(action.get("markerId"), f"{source_name}.CreateTimedMarker.markerId")
        if marker.get("useBlackboardKey") is not False:
            continue
        marker_id = marker.get("value")
        if (skill_id, marker_id) in CONSUMED_ROOT_TIMED_MARKERS:
            result.add(id(action))
    return frozenset(result)


def parse_timeline(
    root: dict[str, Any],
    source_name: str,
    consumed_action_ids: frozenset[int] = frozenset(),
) -> tuple[TimelineActionSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    timeline = require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    result: list[TimelineActionSource] = []
    for index, raw in enumerate(timeline):
        item = require_dict(raw, f"{source_name}.timelineActions[{index}]")
        sequence = require_dict(item.get("_sequenceActionData"), f"{source_name}.timelineActions[{index}]._sequenceActionData")
        types: list[str] = []
        for action in walk_actions(sequence):
            if id(action) in consumed_action_ids:
                continue
            name = action_name(action["$type"])
            # Switch 只是控制流容器；纯镜头、停帧等选项不属于战斗模拟缺口。
            if name == "SwitchAction" and not contains_combat_effect(action):
                continue
            types.append(name)
        result.append(
            TimelineActionSource(
                startFrame=require_non_negative_int(item.get("_startFrame"), f"{source_name}.timelineActions[{index}]._startFrame"),
                endFrame=require_non_negative_int(item.get("_endFrame"), f"{source_name}.timelineActions[{index}]._endFrame"),
                actionTypes=tuple(types),
            )
        )
    return tuple(result)


def parse_target_group_writes(
    root: dict[str, Any], source_name: str
) -> tuple[TargetGroupWriteSource, ...]:
    """按原始动作树路径读取目标组生产者；这里不推断目标组在单敌人模型中的值。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TargetGroupWriteSource] = []

    def visit(value: Any, start_frame: int, end_frame: int, path: tuple[str, ...]) -> None:
        if isinstance(value, list):
            for index, child in enumerate(value):
                visit(child, start_frame, end_frame, (*path, f"[{index}]"))
            return
        if not isinstance(value, dict) or value.get("isEnable") is False:
            return

        producer_type = action_name(str(value.get("$type", "")))
        if producer_type in {"FindTargetAction", "ContinuousFindTargetAction"}:
            expected_fields = set(TARGET_GROUP_FIND_ACTION_FIELDS)
            if producer_type == "ContinuousFindTargetAction":
                expected_fields.add("findInterval")
            if set(value) != expected_fields:
                raise ValueError(
                    f"{source_name}.{'.'.join(path)}: unexpected fields {sorted(value)}"
                )
            target_group_key = value.get("targetGroupKey")
            if not isinstance(target_group_key, str) or not target_group_key:
                raise ValueError(
                    f"{source_name}.{'.'.join(path)}.targetGroupKey: expected non-empty string"
                )
            (
                finder,
                finder_faction_target,
                finder_target_object_type,
                finder_check_alive,
                validators,
                post_processors,
            ) = parse_selector_summary(
                value.get("selectorData"),
                f"{source_name}.{'.'.join(path)}.selectorData",
                finder_required=True,
            )
            interval: float | None = None
            if producer_type == "ContinuousFindTargetAction":
                raw_interval = value.get("findInterval")
                if (
                    not isinstance(raw_interval, (int, float))
                    or isinstance(raw_interval, bool)
                    or raw_interval <= 0
                ):
                    raise ValueError(
                        f"{source_name}.{'.'.join(path)}.findInterval: expected positive number"
                    )
                interval = float(raw_interval)
            result.append(
                TargetGroupWriteSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        value, f"{source_name}.{'.'.join(path)}"
                    ),
                    actionPath=path,
                    targetGroupKey=target_group_key,
                    producerType=producer_type,
                    finderType=finder,
                    finderFactionTarget=finder_faction_target,
                    finderTargetObjectType=finder_target_object_type,
                    finderCheckAlive=finder_check_alive,
                    validatorTypes=validators,
                    postProcessorTypes=post_processors,
                    inputTargets=(),
                    intervalSeconds=interval,
                )
            )
        elif producer_type == "MergeTargetAction":
            if set(value) != TARGET_GROUP_MERGE_ACTION_FIELDS:
                raise ValueError(
                    f"{source_name}.{'.'.join(path)}: unexpected fields {sorted(value)}"
                )
            target_group_key = value.get("targetGroupKey")
            if not isinstance(target_group_key, str) or not target_group_key:
                raise ValueError(
                    f"{source_name}.{'.'.join(path)}.targetGroupKey: expected non-empty string"
                )
            input_targets: list[TargetGroupInputSource] = []
            for index, raw_target in enumerate(
                require_list(value.get("targets"), f"{source_name}.{'.'.join(path)}.targets")
            ):
                target_path = f"{source_name}.{'.'.join(path)}.targets[{index}]"
                target = require_dict(raw_target, target_path)
                if set(target) != TARGET_GROUP_MERGE_INPUT_FIELDS:
                    raise ValueError(f"{target_path}: unexpected fields {sorted(target)}")
                target_source = target.get("targetSource")
                input_group_key = target.get("targetGroupKey")
                if not isinstance(target_source, str) or not target_source:
                    raise ValueError(f"{target_path}.targetSource: expected non-empty string")
                if not isinstance(input_group_key, str):
                    raise ValueError(f"{target_path}.targetGroupKey: expected string")
                (
                    finder,
                    finder_faction_target,
                    finder_target_object_type,
                    finder_check_alive,
                    validators,
                    post_processors,
                ) = parse_selector_summary(
                    target.get("selectorData"),
                    f"{target_path}.selectorData",
                    finder_required=target_source == "InstantSearch",
                )
                input_targets.append(
                    TargetGroupInputSource(
                        targetSource=target_source,
                        targetGroupKey=input_group_key,
                        finderType=finder,
                        finderFactionTarget=finder_faction_target,
                        finderTargetObjectType=finder_target_object_type,
                        finderCheckAlive=finder_check_alive,
                        validatorTypes=validators,
                        postProcessorTypes=post_processors,
                    )
                )
            result.append(
                TargetGroupWriteSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        value, f"{source_name}.{'.'.join(path)}"
                    ),
                    actionPath=path,
                    targetGroupKey=target_group_key,
                    producerType=producer_type,
                    finderType=None,
                    finderFactionTarget=None,
                    finderTargetObjectType=None,
                    finderCheckAlive=None,
                    validatorTypes=(),
                    postProcessorTypes=(),
                    inputTargets=tuple(input_targets),
                    intervalSeconds=None,
                )
            )

        for key, child in value.items():
            visit(child, start_frame, end_frame, (*path, key))

    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline_path = f"{source_name}.timelineActions[{timeline_index}]"
        timeline = require_dict(raw_timeline, timeline_path)
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{timeline_path}._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{timeline_path}._endFrame"
        )
        visit(
            timeline.get("_sequenceActionData"),
            start_frame,
            end_frame,
            (f"timelineActions[{timeline_index}]", "_sequenceActionData"),
        )
    return tuple(result)


def collect_unresolved_combat_actions(
    timeline: tuple[TimelineActionSource, ...],
) -> tuple[str, ...]:
    """汇总根时间轴上仍需由正式 DSL 消费的战斗动作类型。"""
    action_counts = Counter(
        action_type for item in timeline for action_type in item.actionTypes
    )
    return tuple(sorted(name for name in action_counts if name in AUDITED_COMBAT_ACTION_NAMES))


def collect_windows(root: dict[str, Any], source_name: str) -> tuple[tuple[dict[str, Any], ...], tuple[dict[str, Any], ...]]:
    group = require_dict(root["actionGroupData"], f"{source_name}.actionGroupData")
    allows: list[dict[str, Any]] = []
    caches: list[dict[str, Any]] = []
    for index, raw in enumerate(require_list(group["timelineActions"], f"{source_name}.timelineActions")):
        item = require_dict(raw, f"{source_name}.timelineActions[{index}]")
        start = require_non_negative_int(item["_startFrame"], f"{source_name}.timelineActions[{index}]._startFrame")
        end = require_non_negative_int(item["_endFrame"], f"{source_name}.timelineActions[{index}]._endFrame")
        for action in walk_actions(item.get("_sequenceActionData")):
            name = action_name(action["$type"])
            if name == "AllowNextSkillAction":
                allowed = require_list(action.get("allowedSkillIdList"), f"{source_name}.AllowNextSkillAction.allowedSkillIdList")
                if not all(isinstance(skill_id, str) for skill_id in allowed):
                    raise ValueError(f"{source_name}: AllowNextSkillAction contains non-string skill id")
                allows.append({"startFrame": start, "endFrame": end, "skillIds": allowed})
            elif name == "ComboCacheAction":
                mappings = require_list(action.get("mappingDataList"), f"{source_name}.ComboCacheAction.mappingDataList")
                caches.append({"startFrame": start, "endFrame": end, "mappings": mappings})
    return tuple(allows), tuple(caches)


def derive_timeline_block(exclusive_frame: int, allow_windows: tuple[dict[str, Any], ...]) -> tuple[int, str]:
    candidates = [(exclusive_frame + 1, "exclusiveFrame+1")]
    candidates.extend((window["startFrame"], "AllowNextSkillAction.startFrame") for window in allow_windows)
    frame, source = min(candidates, key=lambda candidate: candidate[0])
    return frame, source


def parse_skill_patch(raw: Any, skill_id: str) -> SkillPatchSource:
    entry = require_dict(raw, f"SkillPatchTable.{skill_id}")
    bundles = require_list(entry.get("SkillPatchDataBundle"), f"SkillPatchTable.{skill_id}.SkillPatchDataBundle")
    if not bundles:
        raise ValueError(f"SkillPatchTable.{skill_id}: expected at least one level")
    levels: list[int] = []
    blackboard_rows: list[dict[str, float]] = []
    cooldowns: list[float] = []
    cost_types: list[int] = []
    costs: list[float] = []
    for index, raw_bundle in enumerate(bundles):
        bundle = require_dict(raw_bundle, f"SkillPatchTable.{skill_id}[{index}]")
        levels.append(require_non_negative_int(bundle.get("level"), f"SkillPatchTable.{skill_id}[{index}].level"))
        row: dict[str, float] = {}
        for raw_item in require_list(bundle.get("blackboard"), f"SkillPatchTable.{skill_id}[{index}].blackboard"):
            item = require_dict(raw_item, f"SkillPatchTable.{skill_id}[{index}].blackboard[]")
            key = item.get("key")
            value = item.get("value")
            if not isinstance(key, str) or not key:
                raise ValueError(f"SkillPatchTable.{skill_id}[{index}]: invalid blackboard key")
            if not isinstance(value, (int, float)) or isinstance(value, bool):
                raise ValueError(f"SkillPatchTable.{skill_id}[{index}].blackboard.{key}: expected number")
            if key in row:
                raise ValueError(f"SkillPatchTable.{skill_id}[{index}]: duplicate blackboard key {key}")
            row[key] = float(value)
        blackboard_rows.append(row)
        cooldowns.append(float(bundle.get("coolDown", 0)))
        cost_types.append(int(bundle.get("costType", 0)))
        costs.append(float(bundle.get("costValue", 0)))
    if levels != sorted(levels) or len(set(levels)) != len(levels):
        raise ValueError(f"SkillPatchTable.{skill_id}: levels must be unique and ascending")
    all_keys = set().union(*(row.keys() for row in blackboard_rows))
    for key in all_keys:
        if any(key not in row for row in blackboard_rows):
            raise ValueError(f"SkillPatchTable.{skill_id}: blackboard key {key} is missing at some levels")
    return SkillPatchSource(
        levels=tuple(levels),
        blackboard={key: tuple(row[key] for row in blackboard_rows) for key in sorted(all_keys)},
        cooldownSeconds=tuple(cooldowns),
        costTypes=tuple(cost_types),
        costValues=tuple(costs),
    )


def parse_skill(entry: dict[str, Any], source_dir: Path, patch_table: dict[str, Any]) -> SkillSource:
    source_name = entry.get("source")
    if not isinstance(source_name, str):
        raise ValueError("skill.source: expected string")
    source_path = source_dir / source_name
    if not source_path.is_file():
        raise FileNotFoundError(source_path)
    root = load_projected_skill_data(source_path, source_name)
    skill_id = root.get("skillId")
    if not isinstance(skill_id, str) or not skill_id:
        raise ValueError(f"{source_name}.skillId: expected non-empty string")
    if skill_id not in patch_table:
        raise ValueError(f"SkillPatchTable: missing {skill_id}")
    patch = parse_skill_patch(patch_table[skill_id], skill_id)
    resolved_blackboard = resolve_skill_blackboard(root, source_name, patch)
    cast = require_dict(root.get("castData"), f"{source_name}.castData")
    cost = require_dict(cast.get("costData"), f"{source_name}.castData.costData")
    consumed_root_timed_markers = collect_consumed_root_timed_marker_action_ids(
        root, source_name
    )
    timeline = parse_timeline(
        root,
        source_name,
        consumed_root_timed_markers,
    )
    allows, caches = collect_windows(root, source_name)
    exclusive = require_non_negative_int(root.get("exclusiveFrame"), f"{source_name}.exclusiveFrame")
    block_frame, block_source = derive_timeline_block(exclusive, allows)
    unresolved = collect_unresolved_combat_actions(timeline)
    blackboard_calculations = parse_blackboard_calculations(
        root, source_name, resolved_blackboard
    )
    conditional_actions = resolve_conditional_projectile_triggers(
        parse_conditional_actions(
            root,
            source_name,
            resolved_blackboard,
            consumed_root_timed_markers,
        ),
        root,
        source_name,
        source_dir,
        0,
        (skill_id,),
        resolved_blackboard,
    )
    conditional_actions = mark_projected_conditional_children(
        resolve_conditional_aura_ability_entity_children(
            conditional_actions,
            source_name,
            source_dir,
            0,
            (skill_id,),
            resolved_blackboard,
        )
    )
    blackboard_mutations, buff_blackboard_reads, buff_finishes = parse_blackboard_runtime_actions(
        root, source_name, resolved_blackboard
    )
    referenced_buff_ids = collect_referenced_buff_ids(root, source_name)
    return SkillSource(
        key=str(entry["key"]),
        skillId=skill_id,
        skillType=str(entry["skillType"]),
        sourceFile=source_name,
        timelineBlockFrames=block_frame,
        blockBoundarySource=block_source,
        cooldownSeconds=float(cast.get("cooldownTime", 0)),
        costFrame=require_non_negative_int(cast.get("startCdFrame"), f"{source_name}.castData.startCdFrame"),
        costType=str(cost.get("costType", "")),
        costValue=float(cost.get("costValue", 0)),
        offsetRecordFrame=require_non_negative_int(root.get("offsetRecordFrame"), f"{source_name}.offsetRecordFrame"),
        allowNextWindows=allows,
        inputCacheWindows=caches,
        timelineActions=timeline,
        directDamageHits=parse_direct_damage_hits(root, source_name, resolved_blackboard),
        conditionalActions=conditional_actions,
        inflictions=parse_inflictions(root, source_name),
        auxiliaryActions=parse_auxiliary_actions(
            root, source_name, source_dir, resolved_blackboard
        ),
        blackboardCalculations=blackboard_calculations,
        blackboardMutations=blackboard_mutations,
        buffBlackboardReads=buff_blackboard_reads,
        buffFinishes=buff_finishes,
        resourceGains=parse_resource_gains(root, source_name, resolved_blackboard),
        projectileLaunches=parse_projectile_launches(root, source_name),
        projectileTriggeredSkills=(
            *resolve_projectile_triggered_skills(
                root,
                source_name,
                source_dir,
                stack=(skill_id,),
                inherited_blackboard=resolved_blackboard,
            ),
            *collect_projected_conditional_projectile_skills(conditional_actions),
        ),
        abilityEntityHits=(
            *resolve_ability_entity_hits(
                root,
                source_name,
                source_dir,
                stack=(skill_id,),
                inherited_blackboard=resolved_blackboard,
            ),
            *resolve_guaranteed_conditional_ability_entity_hits(
                conditional_actions,
                source_name,
                source_dir,
                0,
                (skill_id,),
                resolved_blackboard,
            ),
        ),
        referencedBuffIds=referenced_buff_ids,
        patch=patch,
        declaredBlackboard=parse_declared_blackboard(root, source_name),
        blackboardKeys=collect_blackboard_keys(root),
        blackboardProvenance=build_blackboard_provenance(
            root,
            source_name,
            patch,
            blackboard_calculations,
            blackboard_mutations,
            buff_blackboard_reads,
        ),
        unresolvedCombatActions=unresolved,
        buffHolds=parse_buff_hold_actions(root, source_name),
        targetGroupWrites=parse_target_group_writes(root, source_name),
        auraActions=parse_aura_actions(root, source_name, resolved_blackboard),
    )


def ts_literal(value: Any, indent: int = 0) -> str:
    # JSON 是 TypeScript 对当前中间层最稳定的字面量子集。
    return json.dumps(value, ensure_ascii=False, indent=2).replace("\n", "\n" + " " * indent)


def ts_inline_literal(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, str):
        return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return str(int(value)) if isinstance(value, float) and value.is_integer() else str(value)
    if isinstance(value, (list, tuple)):
        return "[" + ", ".join(ts_inline_literal(item) for item in value) + "]"
    if isinstance(value, dict):
        if not value:
            return "{}"
        return "{ " + ", ".join(f"{key}: {ts_inline_literal(item)}" for key, item in value.items()) + " }"
    raise TypeError(f"unsupported TypeScript literal: {type(value).__name__}")


def render_typescript(
    export_name: str,
    slug: str,
    skills: list[SkillSource],
    buff_definitions: tuple[BuffDefinitionSource, ...],
) -> str:
    payload = {
        "slug": slug,
        "buffDefinitions": [serialize_audit_value(item) for item in buff_definitions],
        "skills": [serialize_audit_value(skill) for skill in skills],
    }
    return (
        "/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */\n"
        "import type { GeneratedOperatorSource } from './generatedOperatorSource';\n\n"
        "// prettier-ignore\n"
        f"export const {export_name} = {ts_literal(payload)} as const satisfies GeneratedOperatorSource;\n"
    )


DAMAGE_TYPE_MAP = {
    "Physical": "physical",
    "Fire": "heat",
    "Heat": "heat",
    "Cryst": "cryo",
    "Cold": "cryo",
    "Pulse": "electric",
    "Natural": "nature",
    "Nature": "nature",
}


def require_level_values(source: ScalarSource, path: str) -> tuple[float, ...]:
    if source.levelValues is not None:
        return source.levelValues
    if source.blackboardKey is None:
        return (source.value,)
    raise ValueError(f"{path}: scalar has no resolved level values")


def resolved_scalar_values(source: ScalarSource) -> tuple[float, ...]:
    return source.levelValues if source.levelValues is not None else (source.value,)


def compact_level_values(values: tuple[float, ...]) -> float | tuple[float, ...]:
    return values[0] if all(value == values[0] for value in values) else values


def compile_condition_operand(source: ScalarSource, path: str) -> str:
    """把原生条件操作数收窄为动作黑板键或与等级无关的常量。"""
    if source.blackboardKey is not None:
        return (
            "{ kind: 'blackboard', key: "
            f"{ts_inline_literal(source.blackboardKey)} }}"
        )
    values = source.levelValues
    if values is not None:
        if not values or any(value != values[0] for value in values[1:]):
            raise ValueError(f"{path}: level-dependent condition constants are not supported")
        value = values[0]
    else:
        value = source.value
    return f"{{ kind: 'constant', value: {ts_inline_literal(value)} }}"


def resolve_fixed_combat_target(
    target_source: str,
    target_group_key: str,
    *,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    context_target_is_enemy: bool = False,
) -> Literal["caster", "enemy"] | None:
    """把原生目标引用归约为 Next 固定施法者/单敌人身份；无法证明时返回空。"""
    # 原生只有 Context 分支读取 targetGroupKey；其他固定来源中的同名字段是无效残留。
    if target_source == "Source":
        return "caster"
    if root_skill_context and target_source == "Owner":
        return "caster"
    if target_source == "Target" and input_target == "enemy":
        # 原生 Target 直接读取动作输入目标，命名目标组对该来源没有作用。
        return "enemy"
    if target_source == "Context" and (
        target_group_key == "smart_target" or context_target_is_enemy
    ):
        return "enemy"
    if target_source != "Context" or action is None:
        return None
    write = resolve_latest_target_group_write(
        action,
        target_group_key,
        target_group_writes,
    )
    if write is not None and target_group_write_guarantees_single_enemy(write):
        return "enemy"
    return None


def compile_combat_condition(
    source: ConditionSource,
    path: str,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    skill_has_output_damage: bool = False,
) -> str:
    """只编译已由 Next 运行时闭环的原生条件，其他条件必须显式失败。"""
    if is_guaranteed_single_enemy_condition(
        source, action=action, target_group_writes=target_group_writes
    ):
        return "{ kind: 'singleEnemyPresent' }"
    if source.sourceType == "CheckSquadInFight":
        return "{ kind: 'combatActive' }"
    if source.sourceType == "CheckDistanceCondition":
        distance = source.distance
        if distance is None:
            raise ValueError(f"{path}: missing distance condition payload")
        result = evaluate_zero_distance_condition(
            distance,
            root_skill_context=root_skill_context,
        )
        if result is True:
            return "{ kind: 'singleEnemyPresent' }"
        if result is False:
            return "{ kind: 'not', condition: { kind: 'singleEnemyPresent' } }"
        raise ValueError(
            f"{path}: CheckDistanceCondition targets are not covered by the zero-distance model"
        )
    if source.sourceType == "CheckMainCharacterCondition":
        main_operator = source.mainOperator
        if main_operator is None:
            raise ValueError(f"{path}: missing main operator condition payload")
        if main_operator.targetSource in {"Owner", "Source"}:
            return "{ kind: 'casterControlled' }"
        raise ValueError(
            f"{path}: unsupported main operator target "
            f"{main_operator.targetSource!r}/{main_operator.targetGroupKey!r}"
        )
    if source.sourceType == "CompareFloat":
        if source.left is None or source.right is None or source.comparison is None:
            raise ValueError(f"{path}: incomplete CompareFloat condition")
        operator = COMPARISON_OPERATOR_MAP.get(source.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {source.comparison!r}")
        return "\n".join(
            [
                "{",
                "  kind: 'actionValueCompare',",
                f"  left: {compile_condition_operand(source.left, f'{path}.left')},",
                f"  operator: {ts_inline_literal(operator)},",
                f"  right: {compile_condition_operand(source.right, f'{path}.right')},",
                "}",
            ]
        )
    if source.sourceType == "CheckHp":
        health = source.health
        if health is None:
            raise ValueError(f"{path}: missing health condition payload")
        operator = COMPARISON_OPERATOR_MAP.get(health.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {health.comparison!r}")
        target = resolve_fixed_combat_target(
            health.targetSource,
            health.targetGroupKey,
            action=action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
        if target is None:
            raise ValueError(
                f"{path}: unsupported health target "
                f"{health.targetSource!r}/{health.targetGroupKey!r}"
            )
        return "\n".join(
            [
                "{",
                "  kind: 'healthCompare',",
                f"  target: {ts_inline_literal(target)},",
                f"  valueType: {ts_inline_literal('ratio' if health.isRatio else 'current')},",
                f"  operator: {ts_inline_literal(operator)},",
                f"  value: {compile_condition_operand(health.value, f'{path}.value')},",
                "}",
            ]
        )
    if source.sourceType == "CheckTagMatch":
        entity_tag = source.entityTag
        if entity_tag is None:
            raise ValueError(f"{path}: missing entity tag condition payload")
        target = resolve_fixed_combat_target(
            entity_tag.targetSource,
            entity_tag.targetGroupKey,
            action=action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
        if target is None:
            raise ValueError(
                f"{path}: unsupported entity tag target "
                f"{entity_tag.targetSource!r}/{entity_tag.targetGroupKey!r}"
            )
        return "\n".join(
            [
                "{",
                "  kind: 'entityTagMatch',",
                f"  target: {ts_inline_literal(target)},",
                f"  tagQueryType: {ts_inline_literal(entity_tag.tagQueryType)},",
                f"  tagIds: {ts_inline_literal(entity_tag.tagIds)},",
                "}",
            ]
        )
    if source.sourceType == "CheckTimedMarkerCondition":
        marker = source.timedMarker
        if marker is None:
            raise ValueError(f"{path}: missing timed marker condition payload")
        if marker.useBlackboardKey:
            raise ValueError(f"{path}: dynamic timed marker IDs are not supported")
        if not marker.markerId:
            raise ValueError(f"{path}: timed marker ID is empty")
        if not (
            marker.targetSource == "Source"
            or (root_skill_context and marker.targetSource == "Owner")
        ) or marker.targetGroupKey:
            raise ValueError(
                f"{path}: unsupported timed marker target "
                f"{marker.targetSource!r}/{marker.targetGroupKey!r}"
            )
        condition = (
            "{ kind: 'timedMarkerPresent', target: 'caster', markerId: "
            f"{ts_inline_literal(marker.markerId)} }}"
        )
        if marker.returnTrueIfNotExists:
            return f"{{ kind: 'not', condition: {condition} }}"
        return condition
    if source.sourceType == "CheckGlobalCDTimerAction":
        cooldown = source.globalCooldown
        if cooldown is None:
            raise ValueError(f"{path}: missing global cooldown condition payload")
        if not (
            cooldown.targetSource == "Source"
            or (root_skill_context and cooldown.targetSource == "Owner")
        ) or cooldown.targetGroupKey:
            raise ValueError(
                f"{path}: unsupported global cooldown target "
                f"{cooldown.targetSource!r}/{cooldown.targetGroupKey!r}"
            )
        # 原生检查在对应全局定时项不存在时成功，和普通标记检查的反向极性一致。
        present = (
            "{ kind: 'timedMarkerPresent', target: 'caster', markerId: "
            f"{ts_inline_literal(cooldown.buffId)} }}"
        )
        return f"{{ kind: 'not', condition: {present} }}"
    if source.sourceType == "CheckSkillHasHit":
        if source.skillHasHit is None:
            raise ValueError(f"{path}: missing skill hit condition payload")
        if not root_skill_context:
            raise ValueError(f"{path}: child skill hit state is not projected")
        if not skill_has_output_damage:
            raise ValueError(f"{path}: no prior guaranteed damage from the current skill")
        # Next 固定单敌人且伤害必然命中；调度器已证明当前技能此前输出过伤害。
        return "{ kind: 'singleEnemyPresent' }"
    if source.sourceType in {
        "CheckBuffStackNum",
        "CheckBuffStackNumAdvanced",
        "CheckBuffStackNumByTag",
    }:
        buff = source.buffStack
        if buff is None:
            raise ValueError(f"{path}: missing Buff stack condition payload")
        if buff.countType != "BuffCount" or buff.limitSkillCastId:
            raise ValueError(f"{path}: unsupported Buff stack count semantics")
        operator = COMPARISON_OPERATOR_MAP.get(buff.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {buff.comparison!r}")
        value_source = compile_condition_operand(buff.value, f"{path}.value")
        target = resolve_fixed_combat_target(
            buff.targetSource,
            buff.targetGroupKey,
            action=action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
        if (
            target is not None
            and buff.buffCheckType == "Tag"
            and buff.buffTagIds
            and not buff.buffIds
        ):
            return "\n".join(
                [
                    "{",
                    "  kind: 'buffStackCompare',",
                    f"  target: {ts_inline_literal(target)},",
                    f"  tagQueryType: {ts_inline_literal(buff.tagQueryType)},",
                    f"  buffTagIds: {ts_inline_literal(buff.buffTagIds)},",
                    f"  operator: {ts_inline_literal(operator)},",
                    f"  value: {value_source},",
                    "}",
                ]
            )
        if (
            target is not None
            and buff.buffCheckType == "Id"
            and buff.buffIds
            and not buff.buffTagIds
        ):
            return "\n".join(
                [
                    "{",
                    "  kind: 'buffIdStackCompare',",
                    f"  target: {ts_inline_literal(target)},",
                    f"  buffIds: {ts_inline_literal(buff.buffIds)},",
                    f"  operator: {ts_inline_literal(operator)},",
                    f"  value: {value_source},",
                    "}",
                ]
            )
        raise ValueError(f"{path}: unsupported Buff stack query target or identity")
    raise ValueError(f"{path}: unsupported condition type {source.sourceType!r}")


def compile_combat_condition_group(
    conditions: tuple[ConditionSource, ...],
    path: str,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    skill_has_output_damage: bool = False,
) -> str:
    """保持原生条件组的全满足语义，并生成可直接嵌入 DSL 的条件树。"""
    if not conditions:
        raise ValueError(f"{path}: empty condition group")
    compiled = [
        compile_combat_condition(
            condition,
            f"{path}[{index}]",
            action,
            target_group_writes,
            root_skill_context,
            input_target,
            skill_has_output_damage,
        )
        for index, condition in enumerate(conditions)
    ]
    if len(compiled) == 1:
        return compiled[0]
    lines = ["{", "  kind: 'all',", "  conditions: ["]
    for condition in compiled:
        condition_lines = [f"    {line}" for line in condition.splitlines()]
        condition_lines[-1] += ","
        lines.extend(condition_lines)
    lines.extend(["  ],", "}"])
    return "\n".join(lines)


def percentage_values(values: tuple[float, ...]) -> tuple[int | float, ...]:
    result: list[int | float] = []
    for value in values:
        percentage = round(value * 100, 8)
        result.append(int(percentage) if percentage.is_integer() else percentage)
    return tuple(result)


def compile_buff_blackboard_read(
    read: BuffBlackboardReadPayload | BuffBlackboardReadSource,
    path: str,
    *,
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    context_target_is_enemy: bool = False,
) -> str:
    """编译 Buff 黑板读取；目标身份和 ID/Tag 查询类型彼此独立。"""
    target = resolve_fixed_combat_target(
        read.targetSource,
        read.targetGroupKey,
        root_skill_context=root_skill_context,
        input_target=input_target,
        context_target_is_enemy=context_target_is_enemy,
    )
    if target is None:
        raise ValueError(f"{path}: unsupported buff blackboard target")
    if read.buffCheckType == "Id" and read.buffIds and not read.buffTagIds:
        query = "{ kind: 'id', buffIds: " + ts_inline_literal(read.buffIds) + " }"
    elif read.buffCheckType == "Tag" and read.buffTagIds and not read.buffIds:
        query = (
            "{ kind: 'tag', tagQueryType: "
            f"{ts_inline_literal(read.tagQueryType)}, buffTagIds: "
            f"{ts_inline_literal(read.buffTagIds)} }}"
        )
    else:
        raise ValueError(f"{path}: unsupported or empty Buff lookup")
    return "\n".join(
        [
            "step('readBuffBlackboard', {",
            f"  target: {ts_inline_literal(target)},",
            f"  query: {query},",
            f"  desiredKey: {ts_inline_literal(read.desiredKey)},",
            f"  outputKey: {ts_inline_literal(read.outputKey)},",
            "})",
        ]
    )


def compile_buff_finish(
    finish: BuffFinishPayload | BuffFinishSource,
    path: str,
    *,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    context_target_is_enemy: bool = False,
) -> str:
    """编译目标身份和 Buff 查询方式均已闭环的全量结束分支。"""
    if not finish.finishAll or finish.limitSource:
        raise ValueError(f"{path}: only finishAll without source limiting is supported")
    if finish.isFinishedEarly and finish.isAbsorbed:
        raise ValueError(f"{path}: conflicting finish reasons")
    reason = "early" if finish.isFinishedEarly else "absorbed" if finish.isAbsorbed else "other"
    target = resolve_fixed_combat_target(
        finish.targetSource,
        finish.targetGroupKey,
        action=action,
        target_group_writes=target_group_writes,
        root_skill_context=root_skill_context,
        input_target=input_target,
        context_target_is_enemy=context_target_is_enemy,
    )
    if (
        target is not None
        and finish.buffCheckType == "Tag"
        and finish.buffTagIds
    ):
        return "\n".join(
            [
                "step('finishBuffsByTag', {",
                f"  target: {ts_inline_literal(target)},",
                f"  tagQueryType: {ts_inline_literal(finish.tagQueryType)},",
                f"  buffTagIds: {ts_inline_literal(finish.buffTagIds)},",
                f"  reason: {ts_inline_literal(reason)},",
                "})",
            ]
        )
    if (
        target is not None
        and finish.buffCheckType == "Id"
        and finish.buffIds
    ):
        return "\n".join(
            [
                "step('finishBuffsById', {",
                f"  target: {ts_inline_literal(target)},",
                f"  buffIds: {ts_inline_literal(finish.buffIds)},",
                f"  reason: {ts_inline_literal(reason)},",
                "})",
            ]
        )
    raise ValueError(f"{path}: unsupported buff finish target or identity")


def compile_buff_hold(hold: BuffHoldSource, path: str) -> str:
    """编译当前已闭环的施法者 Buff ID 查询；标签查询留待取得使用样本后接入。"""
    if (
        hold.targetSource != "Source"
        or hold.targetGroupKey
        or hold.buffCheckType != "Id"
        or not hold.buffIds
        or hold.buffTagIds
    ):
        raise ValueError(f"{path}: unsupported buff hold target or identity")
    return "\n".join(
        [
            "step('holdBuffsById', {",
            "  target: 'caster',",
            f"  buffIds: {ts_inline_literal(hold.buffIds)},",
            "})",
        ]
    )


def indent_source(source: str, spaces: int) -> list[str]:
    prefix = " " * spaces
    return [f"{prefix}{line}" for line in source.splitlines()]


def compile_blackboard_calculation(
    calculation: BlackboardCalculationPayload | BlackboardCalculationSource,
    path: str,
) -> str:
    """将原生双操作数计算映射为独立步骤，避免与原地修改混淆。"""
    operation = ACTION_VALUE_OPERATION_MAP.get(calculation.operation)
    if operation not in {"add", "multiply", "divide"}:
        raise ValueError(
            f"{path}: unsupported action blackboard calculation {calculation.operation!r}"
        )
    return "\n".join(
        [
            "step('calculateActionValue', {",
            f"  key: {ts_inline_literal(calculation.key)},",
            f"  operation: {ts_inline_literal(operation)},",
            f"  left: {compile_condition_operand(calculation.left, f'{path}.left')},",
            f"  right: {compile_condition_operand(calculation.right, f'{path}.right')},",
            "})",
        ]
    )


def compile_blackboard_mutation(
    mutation: BlackboardMutationPayload | BlackboardMutationSource,
    path: str,
) -> str:
    """将原生单操作数修改映射为读取目标旧值的原地运算步骤。"""
    operation = ACTION_VALUE_OPERATION_MAP.get(mutation.operation)
    if operation is None:
        raise ValueError(f"{path}: unsupported action blackboard operation {mutation.operation!r}")
    return "\n".join(
        [
            "step('modifyActionValue', {",
            f"  key: {ts_inline_literal(mutation.key)},",
            f"  operation: {ts_inline_literal(operation)},",
            f"  value: {compile_condition_operand(mutation.value, f'{path}.value')},",
            "})",
        ]
    )


def resource_recipient(resource: str) -> str:
    """映射 Next 的资源所有权：技力属于全队，终结技能量属于施法者。"""
    if resource == "sp":
        return "team"
    if resource == "ultimateEnergy":
        return "caster"
    raise ValueError(f"unsupported resource recipient mapping for {resource!r}")


def compile_resource_gain(
    gain: ResourceGainPayload | TimedResourceGainSource,
    path: str,
) -> str:
    """编译原生资源获得；数值可读动作黑板，动态系数仍严格拒绝。"""
    if gain.coefficient.blackboardKey is not None:
        raise ValueError(f"{path}: dynamic resource gain coefficient is not supported")
    coefficient = compact_level_values(
        gain.coefficient.levelValues
        if gain.coefficient.levelValues is not None
        else (gain.coefficient.value,)
    )
    recipient = resource_recipient(gain.resource)
    fields = [
        f"resource: {ts_inline_literal(gain.resource)}",
        f"recipient: {ts_inline_literal(recipient)}",
    ]
    if coefficient != 1:
        fields.insert(1, f"coefficient: {ts_inline_literal(coefficient)}")
    if gain.resource == "sp":
        if gain.spGainKind is None or gain.spGainSource is None:
            raise ValueError(f"{path}: missing SP gain method or source")
        fields.extend(
            [
                f"spGainKind: {ts_inline_literal(gain.spGainKind)}",
                f"spGainSource: {ts_inline_literal(gain.spGainSource)}",
            ]
        )
    else:
        if gain.isPercentValue:
            fields.append("isPercentValue: true")
        if gain.useUltimateRecoveryTag:
            fields.append(
                f"ultimateRecoveryTagId: {ts_inline_literal(gain.ultimateRecoveryTagId)}"
            )
        if gain.ignoreUltimateGainScalar:
            fields.append("ignoreUltimateEnergyGainMultiplier: true")
    if gain.amount.blackboardKey is not None:
        fields.insert(1, f"amount: {compile_condition_operand(gain.amount, f'{path}.amount')}")
        return "\n".join(
            [
                "step('changeResourceByActionValue', {",
                *(f"  {field}," for field in fields),
                "})",
            ]
        )
    amount = compact_level_values(require_level_values(gain.amount, f"{path}.amount"))
    fields.insert(1, f"amount: {ts_inline_literal(amount)}")
    return "step('changeResource', { " + ", ".join(fields) + " })"


def compile_infliction(infliction: TimedInflictionSource) -> str:
    """编译根时间轴上的元素附着，并保留额外附着标记。"""
    return (
        "step('applyElementalInfliction', "
        f"{{ element: {ts_inline_literal(infliction.element)}, "
        f"isExtra: {ts_inline_literal(infliction.isExtra)} }})"
    )


def compile_buff_application_values(
    *,
    buff_id: str,
    blackboard_assignments: dict[str, ScalarSource],
    target_source: str,
    target_group_key: str,
    count: ScalarSource,
    buff_source: str,
    inherit_source_skill_cast_info: bool,
    root_skill_context: bool,
    path: str,
    context_application_target: Literal["enemy", "party"] | None = None,
    input_target: Literal["enemy"] | None = None,
    allow_dynamic_count: bool = False,
    target_finder_type: str | None = None,
    target_validator_types: tuple[str, ...] = (),
    target_post_processor_types: tuple[str, ...] = (),
) -> str:
    """编译已闭环的单个 Buff 施加；动作级公共字段由根动作和条件分支共同提供。"""
    if (count.blackboardKey is not None or count.value != 1) and not allow_dynamic_count:
        raise ValueError(f"{path}: only a literal application count of 1 is supported")
    # 根 SkillData 中 ActionSource 与 ActionOwner 都是施法干员；嵌套动作尚不能做相同假设。
    supported_sources = {"ActionSource", "ActionOwner"} if root_skill_context else {"ActionSource"}
    source = None
    if buff_source == "InputTarget" and (root_skill_context or input_target == "enemy"):
        source = "enemy"
    elif buff_source not in supported_sources:
        raise ValueError(f"{path}: unsupported Buff source {buff_source!r}")
    target: Literal["caster", "enemy", "party"] | None
    if target_source == "Context" and context_application_target is not None:
        target = context_application_target
    elif (
        target_source == "InstantSearch"
        and target_finder_type == "CharacterTeamFinder"
        and not target_validator_types
        and not target_post_processor_types
    ):
        target = "party"
    else:
        target = resolve_fixed_combat_target(
            target_source,
            target_group_key,
            root_skill_context=root_skill_context,
            input_target="enemy" if root_skill_context else input_target,
        )
    if target is None:
        raise ValueError(
            f"{path}: unsupported Buff target "
            f"{target_source!r}/{target_group_key!r}"
        )
    lines = [
        "step('applyBuff', {",
        f"  buffId: {ts_inline_literal(buff_id)},",
        f"  target: {ts_inline_literal(target)},",
        "  inheritSourceSkillCastInfo: "
        f"{ts_inline_literal(inherit_source_skill_cast_info)},",
    ]
    if source is not None:
        lines.append(f"  source: {ts_inline_literal(source)},")
    if count.blackboardKey is not None or count.value != 1:
        lines.append(f"  count: {compile_condition_operand(count, f'{path}.count')},")
    if blackboard_assignments:
        lines.append("  blackboardAssignments: {")
        for key, value in blackboard_assignments.items():
            lines.append(
                f"    {ts_inline_literal(key)}: "
                f"{compile_condition_operand(value, f'{path}.blackboardAssignments.{key}')},"
            )
        lines.append("  },")
    lines.append("})")
    return "\n".join(lines)


def compile_buff_application(
    action: AuxiliaryActionSource,
    path: str,
    *,
    root_skill_context: bool = True,
    context_application_target: Literal["enemy", "party"] | None = None,
    input_target: Literal["enemy"] | None = None,
) -> str:
    """编译根时间轴上已拆分为单 Buff 的 CreateBuffAction。"""
    if action.actionType != "CreateBuffAction" or action.count is None:
        raise ValueError(f"{path}: expected parsed CreateBuffAction")
    if action.buffSource is None or action.inheritSourceSkillCastInfo is None:
        raise ValueError(f"{path}: incomplete CreateBuffAction source facts")
    return compile_buff_application_values(
        buff_id=action.sourceId,
        blackboard_assignments=action.blackboardAssignments,
        target_source=action.targetSource,
        target_group_key=action.targetGroupKey,
        count=action.count,
        buff_source=action.buffSource,
        inherit_source_skill_cast_info=action.inheritSourceSkillCastInfo,
        root_skill_context=root_skill_context,
        context_application_target=context_application_target,
        input_target=input_target,
        target_finder_type=action.targetFinderType,
        target_validator_types=action.targetValidatorTypes,
        target_post_processor_types=action.targetPostProcessorTypes,
        path=path,
    )


def compile_timed_marker_application(
    payload: TimedMarkerApplicationPayload,
    path: str,
    *,
    root_skill_context: bool,
) -> str:
    """编译固定身份、普通战斗时间增量的原生定时标记创建。"""
    if payload.useTimeDilationDt:
        raise ValueError(f"{path}: time-dilated timed markers are not supported")
    if not (
        payload.targetSource == "Source"
        or (root_skill_context and payload.targetSource == "Owner")
    ) or payload.targetGroupKey:
        raise ValueError(
            f"{path}: unsupported timed marker target "
            f"{payload.targetSource!r}/{payload.targetGroupKey!r}"
        )
    return "\n".join(
        [
            "step('createTimedMarker', {",
            "  target: 'caster',",
            f"  markerId: {ts_inline_literal(payload.markerId)},",
            "  durationSeconds: "
            f"{compile_condition_operand(payload.duration, f'{path}.duration')},",
            "  autoFinishByAction: "
            f"{ts_inline_literal(payload.autoFinishByAction)},",
            "})",
        ]
    )


def compile_global_cooldown_application(
    payload: GlobalCooldownApplicationPayload,
    path: str,
    *,
    root_skill_context: bool,
) -> str:
    """将原生全局冷却写入映射到 Next 的角色定时标记。"""
    if not (
        payload.targetSource == "Source"
        or (root_skill_context and payload.targetSource == "Owner")
    ) or payload.targetGroupKey:
        raise ValueError(
            f"{path}: unsupported global cooldown target "
            f"{payload.targetSource!r}/{payload.targetGroupKey!r}"
        )
    return "\n".join(
        [
            "step('createTimedMarker', {",
            "  target: 'caster',",
            f"  markerId: {ts_inline_literal(payload.buffId)},",
            "  durationSeconds: "
            f"{compile_condition_operand(payload.duration, f'{path}.duration')},",
            "  autoFinishByAction: false,",
            "})",
        ]
    )


def compile_buff_stack_read(
    payload: BuffStackReadPayload,
    path: str,
    *,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    context_target_is_enemy: bool = False,
) -> str:
    """把原生 Buff 层数查询编译为动作黑板写入步骤。"""
    if payload.countType != "BuffCount":
        raise ValueError(f"{path}: unsupported Buff count type {payload.countType!r}")
    if payload.limitSkillCastId:
        raise ValueError(f"{path}: skill-cast-limited Buff count is not supported")
    target = resolve_fixed_combat_target(
        payload.targetSource,
        payload.targetGroupKey,
        action=action,
        target_group_writes=target_group_writes,
        root_skill_context=root_skill_context,
        input_target=input_target,
        context_target_is_enemy=context_target_is_enemy,
    )
    if target is None:
        raise ValueError(
            f"{path}: unsupported Buff target "
            f"{payload.targetSource!r}/{payload.targetGroupKey!r}"
        )
    if payload.buffCheckType == "Id" and payload.buffIds:
        query = "{ kind: 'id', buffIds: " + ts_inline_literal(payload.buffIds) + " }"
    elif payload.buffCheckType == "Tag" and payload.buffTagIds:
        query = (
            "{ kind: 'tag', tagQueryType: "
            f"{ts_inline_literal(payload.tagQueryType)}, buffTagIds: "
            f"{ts_inline_literal(payload.buffTagIds)} }}"
        )
    else:
        raise ValueError(f"{path}: unsupported or empty Buff lookup")
    return "\n".join(
        [
            "step('readBuffStackCount', {",
            f"  target: {ts_inline_literal(target)},",
            f"  outputKey: {ts_inline_literal(payload.outputKey)},",
            f"  query: {query},",
            "})",
        ]
    )


def compile_conditional_buff_application(
    payload: BuffApplicationPayload,
    path: str,
    ignored_buff_ids: frozenset[str],
    *,
    root_skill_context: bool = False,
    context_application_target: Literal["enemy", "party"] | None = None,
    input_target: Literal["enemy"] | None = None,
) -> str:
    """保持原生 Buff 数组顺序编译条件分支内的一次创建动作。"""
    has_dynamic_count = payload.count.blackboardKey is not None or payload.count.value != 1
    if has_dynamic_count and len(payload.buffs) != 1:
        raise ValueError(
            f"{path}: repeated multi-Buff application requires a grouped repeat sequence"
        )
    compiled = [
        compile_buff_application_values(
            buff_id=buff.buffId,
            blackboard_assignments=buff.blackboardAssignments,
            target_source=payload.targetSource,
            target_group_key=payload.targetGroupKey,
            count=payload.count,
            buff_source=payload.buffSource,
            inherit_source_skill_cast_info=payload.inheritSourceSkillCastInfo,
            root_skill_context=root_skill_context,
            context_application_target=context_application_target,
            input_target=input_target,
            path=f"{path}.buffs[{index}]",
            allow_dynamic_count=has_dynamic_count,
            target_finder_type=payload.targetFinderType,
            target_validator_types=payload.targetValidatorTypes,
            target_post_processor_types=payload.targetPostProcessorTypes,
        )
        for index, buff in enumerate(payload.buffs)
        if buff.buffId not in ignored_buff_ids
    ]
    if not compiled:
        return "sequence()"
    if len(compiled) == 1:
        return compiled[0]
    lines = ["sequence("]
    for source in compiled:
        item_lines = indent_source(source, 2)
        item_lines[-1] += ","
        lines.extend(item_lines)
    lines.append(")")
    return "\n".join(lines)


def projectile_children_are_immediate(
    triggered_skills: tuple[ProjectileTriggeredSkillSource, ...],
) -> bool:
    """确认投射物命中子技能无需跨帧调度或递归展开。"""
    if len(triggered_skills) != 1:
        return False
    hit = triggered_skills[0]
    required_fields = (
        "assumedTravelFrames",
        "cycleTruncated",
        "conditionalActions",
        "auxiliaryActions",
        "resourceGains",
        "nestedProjectileTriggeredSkills",
        "abilityEntityHits",
        "directDamageHits",
        "inflictions",
        "combatActions",
    )
    if any(not hasattr(hit, field) for field in required_fields):
        return False
    if (
        hit.assumedTravelFrames != 0
        or hit.cycleTruncated
        or hit.conditionalActions
        or hit.auxiliaryActions
        or hit.resourceGains
        or hit.nestedProjectileTriggeredSkills
        or hit.abilityEntityHits
        or any(damage.startFrame != 0 for damage in hit.directDamageHits)
        or any(infliction.startFrame != 0 for infliction in hit.inflictions)
    ):
        return False
    expected_actions = {
        *({"DamageAction"} if hit.directDamageHits else set()),
        *({"SpellInfliction"} if hit.inflictions else set()),
    }
    return bool(expected_actions) and set(hit.combatActions) == expected_actions


def compile_immediate_projectile_children(
    triggered_skills: tuple[ProjectileTriggeredSkillSource, ...],
    damage_tags: tuple[str, ...],
    runtime_blackboard_keys: frozenset[str],
    path: str,
) -> str | None:
    """编译命中帧同步完成的投射物子技能；延迟、递归与实体生成继续留给调度层。"""

    if not projectile_children_are_immediate(triggered_skills):
        return None
    hit = triggered_skills[0]

    ordered_steps: list[tuple[int, str]] = []
    for index, damage in enumerate(hit.directDamageHits):
        compiled = "\n".join(
            compile_damage_units_step(
                damage.damageUnits,
                damage_tags,
                f"{path}.triggeredSkills[0].directDamageHits[{index}]",
                runtime_blackboard_keys,
            )
        )
        ordered_steps.append((damage.actionIndex, compiled))
    ordered_steps.extend(
        (infliction.actionIndex, compile_infliction(infliction))
        for infliction in hit.inflictions
    )
    lines = ["sequence("]
    for _, source in sorted(ordered_steps, key=lambda item: item[0]):
        item_lines = indent_source(source, 2)
        item_lines[-1] += ","
        lines.extend(item_lines)
    lines.append(")")
    return "\n".join(lines)


def compile_conditional_branch_action(
    action: ConditionalBranchActionSource,
    path: str,
    ignored_buff_ids: frozenset[str] = frozenset(),
    damage_tags: tuple[str, ...] = (),
    runtime_blackboard_keys: frozenset[str] = frozenset(),
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    projected_ability_entity_spawns: tuple[AbilityEntitySpawnPayload, ...] = (),
    projected_projectile_launches: tuple[ConditionalProjectileProjection, ...] = (),
    context_action: ConditionalActionSource | None = None,
) -> str:
    """编译一个条件分支叶子；未闭环动作必须在这里显式拒绝。"""
    if getattr(action, "nestedCondition", None) is not None:
        return compile_conditional_action(
            action.nestedCondition,
            f"{path}.nestedCondition",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
    once_actions = getattr(action, "onceActions", None)
    if once_actions is not None:
        once_scope_key = getattr(action, "onceScopeKey", None)
        if once_scope_key is None:
            raise ValueError(f"{path}: DoOnceAction has no scope key")
        body = compile_conditional_branch(
            once_actions,
            f"{path}.onceActions",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            projected_ability_entity_spawns=projected_ability_entity_spawns,
            projected_projectile_launches=projected_projectile_launches,
            context_action=context_action,
        )
        body_lines = indent_source(body, 2)
        body_lines[-1] += ","
        return "\n".join(
            [
                "once(",
                f"  {ts_inline_literal(once_scope_key)},",
                *body_lines,
                ")",
            ]
        )
    ability_entity_spawn = getattr(action, "abilityEntitySpawn", None)
    if ability_entity_spawn is not None:
        if ability_entity_spawn in projected_ability_entity_spawns:
            return "sequence()"
        raise ValueError(f"{path}: unsupported conditional leaf {action.actionType!r}")
    projectile_launch = getattr(action, "projectileLaunch", None)
    if projectile_launch is not None:
        projection = ConditionalProjectileProjection(
            projectile_launch,
            getattr(action, "projectileTriggeredSkills", None) or (),
        )
        if contains_equivalent_projectile_projection(
            projected_projectile_launches, projection
        ):
            return "sequence()"
        compiled = compile_immediate_projectile_children(
            projection.triggeredSkills,
            damage_tags,
            runtime_blackboard_keys,
            path,
        )
        if compiled is not None:
            return compiled
        raise ValueError(f"{path}: unsupported conditional leaf {action.actionType!r}")
    if getattr(action, "damageUnits", None) is not None:
        return "\n".join(
            compile_damage_units_step(
                action.damageUnits,
                damage_tags,
                path,
                runtime_blackboard_keys,
            )
        )
    if getattr(action, "buffBlackboardRead", None) is not None:
        buff_read = action.buffBlackboardRead
        context_target_is_enemy = False
        if (
            buff_read.targetSource == "Context"
            and buff_read.targetGroupKey != "smart_target"
            and context_action is not None
        ):
            write = resolve_latest_target_group_write(
                context_action,
                buff_read.targetGroupKey,
                target_group_writes,
            )
            context_target_is_enemy = (
                write is not None
                and target_group_write_guarantees_single_enemy(write)
            )
        return compile_buff_blackboard_read(
            buff_read,
            path,
            root_skill_context=root_skill_context,
            input_target=input_target,
            context_target_is_enemy=context_target_is_enemy,
        )
    if getattr(action, "buffFinish", None) is not None:
        return compile_buff_finish(
            action.buffFinish,
            path,
            action=context_action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
    if getattr(action, "buffStackRead", None) is not None:
        return compile_buff_stack_read(
            action.buffStackRead,
            path,
            action=context_action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
    if getattr(action, "buffApplication", None) is not None:
        buff_application = action.buffApplication
        context_application_target = None
        if (
            buff_application.targetSource == "Context"
            and context_action is not None
        ):
            write = resolve_latest_target_group_write(
                context_action,
                buff_application.targetGroupKey,
                target_group_writes,
            )
            context_application_target = target_group_write_buff_application_target(write)
        return compile_conditional_buff_application(
            buff_application,
            path,
            ignored_buff_ids,
            root_skill_context=root_skill_context,
            context_application_target=context_application_target,
            input_target=input_target,
        )
    if getattr(action, "timedMarkerApplication", None) is not None:
        return compile_timed_marker_application(
            action.timedMarkerApplication,
            path,
            root_skill_context=root_skill_context,
        )
    if getattr(action, "globalCooldownApplication", None) is not None:
        return compile_global_cooldown_application(
            action.globalCooldownApplication,
            path,
            root_skill_context=root_skill_context,
        )
    if getattr(action, "blackboardMutation", None) is not None:
        return compile_blackboard_mutation(action.blackboardMutation, path)
    if getattr(action, "blackboardCalculation", None) is not None:
        return compile_blackboard_calculation(action.blackboardCalculation, path)
    if getattr(action, "resourceGain", None) is not None:
        return compile_resource_gain(action.resourceGain, path)
    infliction = getattr(action, "infliction", None)
    if infliction is not None:
        return (
            "step('applyElementalInfliction', { element: "
            f"{ts_inline_literal(infliction.element)}, isExtra: "
            f"{ts_inline_literal(infliction.isExtra)} }})"
        )
    raise ValueError(f"{path}: unsupported conditional leaf {action.actionType!r}")


def compile_conditional_branch(
    actions: tuple[ConditionalBranchActionSource, ...],
    path: str,
    ignored_buff_ids: frozenset[str] = frozenset(),
    damage_tags: tuple[str, ...] = (),
    runtime_blackboard_keys: frozenset[str] = frozenset(),
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    projected_ability_entity_spawns: tuple[AbilityEntitySpawnPayload, ...] = (),
    projected_projectile_launches: tuple[ConditionalProjectileProjection, ...] = (),
    context_action: ConditionalActionSource | None = None,
) -> str:
    """按原始数组顺序生成一个同步 action sequence。"""
    if not actions:
        return "sequence()"
    lines = ["sequence("]
    compiled_count = 0
    for index, action in enumerate(actions):
        compiled = compile_conditional_branch_action(
            action,
            f"{path}[{index}]",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            projected_ability_entity_spawns=projected_ability_entity_spawns,
            projected_projectile_launches=projected_projectile_launches,
            context_action=context_action,
        )
        if compiled == "sequence()":
            continue
        compiled_count += 1
        action_lines = indent_source(compiled, 2)
        action_lines[-1] += ","
        lines.extend(action_lines)
    if compiled_count == 0:
        return "sequence()"
    lines.append(")")
    return "\n".join(lines)


PRESENTATION_CAMERA_BLACKBOARD_KEYS = frozenset({"isWall", "camera_blocked"})


def is_presentation_only_camera_condition(action: ConditionalActionSource) -> bool:
    """确认条件树只传递已审计的镜头状态，不把镜头条件伪装成战斗条件。"""

    if not any(
        condition.sourceType == "CheckSkillCameraMotionFree"
        for condition in action.conditions
    ):
        return False

    for branch_action in (*action.succeedActions, *action.failActions):
        mutation = branch_action.blackboardMutation
        if (
            mutation is None
            or mutation.key not in PRESENTATION_CAMERA_BLACKBOARD_KEYS
            or mutation.operation != "Assign"
            or mutation.value.value != 1
            or mutation.value.blackboardKey is not None
            or mutation.value.levelValues is not None
        ):
            return False
    return True


def compile_conditional_action(
    action: ConditionalActionSource,
    path: str,
    ignored_buff_ids: frozenset[str] = frozenset(),
    damage_tags: tuple[str, ...] = (),
    runtime_blackboard_keys: frozenset[str] = frozenset(),
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    skill_has_output_damage: bool = False,
) -> str:
    """把递归审计树编译为正式 `branch(condition, sequence...)` DSL。"""
    if isinstance(action, DoOnceActionSource):
        body = compile_conditional_branch(
            action.succeedActions,
            f"{path}.succeedActions",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            projected_ability_entity_spawns=action.projectedAbilityEntitySpawns,
            projected_projectile_launches=action.projectedProjectileLaunches,
            context_action=action,
        )
        if body == "sequence()":
            return body
        body_lines = indent_source(body, 2)
        body_lines[-1] += ","
        return "\n".join(
            [
                "once(",
                f"  {ts_inline_literal(action.onceScopeKey)},",
                *body_lines,
                ")",
            ]
        )
    if isinstance(action, UnconditionalActionSource):
        return compile_conditional_branch(
            action.succeedActions,
            f"{path}.succeedActions",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            projected_ability_entity_spawns=action.projectedAbilityEntitySpawns,
            projected_projectile_launches=action.projectedProjectileLaunches,
            context_action=action,
        )
    if is_presentation_only_camera_condition(action):
        return "sequence()"
    projected_ability_entity_spawns = getattr(
        action, "projectedAbilityEntitySpawns", ()
    )
    projected_projectile_launches = getattr(action, "projectedProjectileLaunches", ())
    condition = compile_combat_condition_group(
        action.conditions,
        f"{path}.conditions",
        action,
        target_group_writes,
        root_skill_context,
        input_target,
        skill_has_output_damage,
    )
    succeed = compile_conditional_branch(
        action.succeedActions,
        f"{path}.succeedActions",
        ignored_buff_ids,
        damage_tags,
        runtime_blackboard_keys,
        target_group_writes=target_group_writes,
        root_skill_context=root_skill_context,
        input_target=input_target,
        projected_ability_entity_spawns=projected_ability_entity_spawns,
        projected_projectile_launches=projected_projectile_launches,
        context_action=action,
    )
    fail = (
        compile_conditional_branch(
            action.failActions,
            f"{path}.failActions",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            projected_ability_entity_spawns=projected_ability_entity_spawns,
            projected_projectile_launches=projected_projectile_launches,
            context_action=action,
        )
        if action.failActions
        else None
    )
    if succeed == "sequence()" and (fail is None or fail == "sequence()"):
        return "sequence()"
    lines = ["branch("]
    condition_lines = indent_source(condition, 2)
    condition_lines[-1] += ","
    lines.extend(condition_lines)
    succeed_lines = indent_source(succeed, 2)
    succeed_lines[-1] += ","
    lines.extend(succeed_lines)
    if fail is not None:
        fail_lines = indent_source(fail, 2)
        fail_lines[-1] += ","
        lines.extend(fail_lines)
    lines.append(")")
    return "\n".join(lines)


def target_group_branch_scopes(path: tuple[str, ...]) -> tuple[tuple[str, ...], ...]:
    """返回动作所在的条件分支作用域；分支内写入不能解释分支外读取。"""
    return tuple(
        path[: index + 1]
        for index, segment in enumerate(path)
        if segment in {"succeedActions", "failActions"}
    )


def resolve_latest_target_group_write_at(
    *,
    read_frame: int,
    read_action_index: int,
    read_action_path: tuple[str, ...],
    target_group_key: str,
    writes: tuple[TargetGroupWriteSource, ...],
) -> TargetGroupWriteSource | None:
    """选择读取点之前、且其分支作用域支配读取点的最后一次目标组写入。"""
    candidates: list[TargetGroupWriteSource] = []
    for write in writes:
        if write.targetGroupKey != target_group_key:
            continue
        if not (
            write.startFrame < read_frame
            or (
                write.startFrame == read_frame
                and write.actionIndex < read_action_index
            )
        ):
            continue
        if any(
            read_action_path[: len(scope)] != scope
            for scope in target_group_branch_scopes(write.actionPath)
        ):
            continue
        candidates.append(write)
    if not candidates:
        return None
    latest_order = max((write.startFrame, write.actionIndex) for write in candidates)
    latest = [
        write
        for write in candidates
        if (write.startFrame, write.actionIndex) == latest_order
    ]
    if len(latest) != 1:
        raise ValueError(
            f"{'.'.join(read_action_path) or '<root>'}: ambiguous writes for target group "
            f"{target_group_key!r} at {latest_order}"
        )
    return latest[0]


def resolve_latest_target_group_write(
    action: ConditionalActionSource,
    target_group_key: str,
    writes: tuple[TargetGroupWriteSource, ...],
) -> TargetGroupWriteSource | None:
    """按条件读取点解析最近的支配写入。"""
    return resolve_latest_target_group_write_at(
        read_frame=action.startFrame,
        read_action_index=action.actionIndex,
        read_action_path=action.actionPath,
        target_group_key=target_group_key,
        writes=writes,
    )


def target_group_write_guarantees_single_enemy(write: TargetGroupWriteSource) -> bool:
    """只接受已能在固定单敌人模型下闭环的目标查找形状。"""
    if write.validatorTypes or any(
        processor != "PriorityFilter" for processor in write.postProcessorTypes
    ):
        return False
    if write.finderType == "MainTargetFinder":
        return True
    return (
        write.producerType in {"FindTargetAction", "ContinuousFindTargetAction"}
        and write.finderType == "HitBoxFinder"
        and write.finderFactionTarget == "Anti"
        and write.finderTargetObjectType == "Normal"
        and write.finderCheckAlive is True
    )


def target_group_write_buff_application_target(
    write: TargetGroupWriteSource | None,
) -> Literal["enemy", "party"] | None:
    """把已闭环的目标组写入归约为 Buff 施加支持的单体或集合目标。"""
    if write is None:
        return None
    if target_group_write_guarantees_single_enemy(write):
        return "enemy"
    if (
        not write.validatorTypes
        and not write.postProcessorTypes
        and write.producerType in {"FindTargetAction", "ContinuousFindTargetAction"}
        and write.finderType == "CharacterTeamFinder"
    ):
        return "party"
    return None


def target_reference_has_plain_selector(reference: TargetReferenceSource) -> bool:
    """目标引用未附带会改变身份或位置的选择器配置。"""
    if (
        reference.selectorOwner != "ActionOwner"
        or reference.ownerContextKey
        or reference.centerType != "ActionSource"
        or reference.centerContextKey
        or reference.centerToGround
        or reference.target != "ActionSource"
        or reference.targetContextKey
        or reference.enableAdvancedDirection
        or reference.selectorDirection != "SourceForward"
        or reference.validatorTypes
        or reference.postProcessorTypes
    ):
        return False
    return True


def target_reference_is_plain(reference: TargetReferenceSource) -> bool:
    """目标引用既没有命名目标组，也没有会改变身份或位置的选择器配置。"""
    return not reference.targetGroupKey and target_reference_has_plain_selector(reference)


def target_identity_reference_guarantees_single_enemy(
    reference: TargetReferenceSource,
) -> bool:
    """仅接受不带筛选或重定向、且必然指向唯一敌人的目标引用。"""
    if not target_reference_is_plain(reference):
        return False
    return (
        reference.targetSource in {"Target", "MainTarget"}
        and reference.finderType is None
    ) or (
        reference.targetSource == "InstantSearch"
        and reference.finderType == "MainTargetFinder"
    )


def zero_distance_target_role(reference: TargetReferenceSource) -> str | None:
    """把根干员技能中的普通目标引用归类为共点的施法者或唯一敌人。"""
    if not target_reference_has_plain_selector(reference):
        return None
    if (
        reference.targetSource == "Context"
        and reference.targetGroupKey == "smart_target"
        and reference.finderType is None
    ):
        return "enemy"
    if reference.targetGroupKey:
        return None
    if reference.targetSource in {"Owner", "Source"} and reference.finderType is None:
        return "caster"
    if target_identity_reference_guarantees_single_enemy(reference):
        return "enemy"
    return None


def evaluate_zero_distance_condition(
    condition: DistanceConditionSource,
    *,
    root_skill_context: bool,
) -> bool | None:
    """仅在根干员技能的施法者与唯一敌人共点假设下折叠距离比较。"""
    if not root_skill_context or condition.distance < 0:
        return None
    roles = {
        zero_distance_target_role(condition.source),
        zero_distance_target_role(condition.target),
    }
    if None in roles or roles != {"caster", "enemy"}:
        return None
    # 原生 lessThan 分支实际使用 <=；半径只会把共点距离进一步减小。
    return condition.lessThan


def is_guaranteed_single_enemy_condition(
    condition: ConditionSource,
    *,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
) -> bool:
    """识别在 Endaxis 固定单个有效敌人模型下恒真的目标数量条件。"""
    identity = getattr(condition, "targetIdentity", None)
    if condition.sourceType == "CheckTargetsEqual" and identity is not None:
        return target_identity_reference_guarantees_single_enemy(
            identity.first
        ) and target_identity_reference_guarantees_single_enemy(identity.second)

    entity = getattr(condition, "entityCount", None)
    return (
        condition.sourceType == "CheckEntityNum"
        and entity is not None
        and entity.minimumCount == 1
        and entity.comparison == "GE"
        and not entity.storeKey
        and (
            # TargetSource.Target 直接读取技能输入目标，targetGroupKey 对该来源无效。
            entity.targetSource == "Target"
            or (
                entity.targetSource == "Context"
                and entity.targetGroupKey == "smart_target"
                and not entity.containsHittableTarget
            )
            or (
                entity.targetSource == "Context"
                and not entity.containsHittableTarget
                and action is not None
                and (
                    write := resolve_latest_target_group_write(
                        action, entity.targetGroupKey, target_group_writes
                    )
                )
                is not None
                and target_group_write_guarantees_single_enemy(write)
            )
        )
    )


def collect_compilable_conditional_action_types(
    actions: tuple[ConditionalActionSource, ...],
) -> set[str]:
    """返回条件树中已由 DSL 编译器完整消费的原生动作类型。"""
    result: set[str] = set()

    def visit_branch_actions(
        branch_actions: tuple[ConditionalBranchActionSource, ...],
        projected_spawns: tuple[AbilityEntitySpawnPayload, ...],
        projected_launches: tuple[ConditionalProjectileProjection, ...],
    ) -> None:
        for branch_action in branch_actions:
            if getattr(branch_action, "onceActions", None) is not None:
                result.add("DoOnceAction")
                visit_branch_actions(
                    branch_action.onceActions,
                    projected_spawns,
                    projected_launches,
                )
            if getattr(branch_action, "nestedCondition", None) is not None:
                visit(branch_action.nestedCondition)
            if getattr(branch_action, "buffBlackboardRead", None) is not None:
                result.add("GetTargetBuffBBAdvanced")
            if getattr(branch_action, "buffFinish", None) is not None:
                result.add("FinishBuffAdvanced")
            if getattr(branch_action, "buffStackRead", None) is not None:
                result.add("SaveBuffStackNumAdvanced")
            if getattr(branch_action, "buffApplication", None) is not None:
                result.add("CreateBuffAction")
            if getattr(branch_action, "timedMarkerApplication", None) is not None:
                result.add("CreateTimedMarker")
            if getattr(branch_action, "globalCooldownApplication", None) is not None:
                result.add("AddGlobalCDTimer")
            if getattr(branch_action, "blackboardMutation", None) is not None:
                result.add("ModifyDynamicBlackboard")
            if getattr(branch_action, "blackboardCalculation", None) is not None:
                result.add("SimpleCalcBBAction")
            if getattr(branch_action, "resourceGain", None) is not None:
                result.add("ObtainCostAction")
            if getattr(branch_action, "infliction", None) is not None:
                result.add("SpellInfliction")
            if getattr(branch_action, "damageUnits", None) is not None:
                result.add("DamageAction")
            if getattr(branch_action, "abilityEntitySpawn", None) in projected_spawns:
                result.add("SpawnAbilityEntity")
            projectile_launch = getattr(branch_action, "projectileLaunch", None)
            if projectile_launch is not None and contains_equivalent_projectile_projection(
                projected_launches,
                ConditionalProjectileProjection(
                    projectile_launch,
                    getattr(branch_action, "projectileTriggeredSkills", None) or (),
                ),
            ):
                result.add("LaunchProjectile")
            elif projectile_launch is not None and projectile_children_are_immediate(
                getattr(branch_action, "projectileTriggeredSkills", None) or ()
            ):
                result.add("LaunchProjectile")

    def visit(action: ConditionalActionSource) -> None:
        if isinstance(action, DoOnceActionSource):
            result.add("DoOnceAction")
        elif isinstance(action, (UnconditionalActionSource, SequenceGuardActionSource)):
            pass
        else:
            result.add(
                "SwitchAction" if isinstance(action, SwitchActionSource) else "IfElseAction"
            )
        result.update(condition.sourceType for condition in action.conditions)
        projected_spawns = getattr(action, "projectedAbilityEntitySpawns", ())
        projected_launches = getattr(action, "projectedProjectileLaunches", ())
        visit_branch_actions(
            (*action.succeedActions, *action.failActions),
            projected_spawns,
            projected_launches,
        )

    for action in actions:
        visit(action)
    return result


def collect_runtime_blackboard_output_keys(skill: SkillSource) -> frozenset[str]:
    """收集会在本次技能执行中被动作写入的键；仅这些键必须延迟到运行时求值。"""
    result = {item.key for item in skill.blackboardCalculations}
    result.update(item.key for item in skill.blackboardMutations)
    result.update(item.outputKey for item in skill.buffBlackboardReads)

    def visit_conditions(actions: tuple[ConditionalActionSource, ...]) -> None:
        for condition in actions:
            for action in (*condition.succeedActions, *condition.failActions):
                calculation = getattr(action, "blackboardCalculation", None)
                mutation = getattr(action, "blackboardMutation", None)
                buff_read = getattr(action, "buffBlackboardRead", None)
                stack_read = getattr(action, "buffStackRead", None)
                nested = getattr(action, "nestedCondition", None)
                if calculation is not None:
                    result.add(calculation.key)
                if mutation is not None:
                    result.add(mutation.key)
                if buff_read is not None:
                    result.add(buff_read.outputKey)
                if stack_read is not None:
                    result.add(stack_read.outputKey)
                if nested is not None:
                    visit_conditions((nested,))
                if getattr(action, "onceActions", None) is not None:
                    visit_branch_actions(action.onceActions)

    def visit_branch_actions(
        actions: tuple[ConditionalBranchActionSource, ...],
    ) -> None:
        for action in actions:
            calculation = action.blackboardCalculation
            mutation = action.blackboardMutation
            buff_read = action.buffBlackboardRead
            stack_read = action.buffStackRead
            if calculation is not None:
                result.add(calculation.key)
            if mutation is not None:
                result.add(mutation.key)
            if buff_read is not None:
                result.add(buff_read.outputKey)
            if stack_read is not None:
                result.add(stack_read.outputKey)
            if action.nestedCondition is not None:
                visit_conditions((action.nestedCondition,))
            if getattr(action, "onceActions", None) is not None:
                visit_branch_actions(action.onceActions)

    def visit_entities(entities: tuple[AbilityEntityHitSource, ...]) -> None:
        for entity in entities:
            result.update(item.key for item in getattr(entity, "blackboardCalculations", ()))
            result.update(item.key for item in getattr(entity, "blackboardMutations", ()))
            result.update(item.outputKey for item in getattr(entity, "buffBlackboardReads", ()))
            visit_conditions(getattr(entity, "conditionalActions", ()))
            visit_entities(getattr(entity, "nestedAbilityEntityHits", ()))

    visit_conditions(skill.conditionalActions)
    visit_entities(skill.abilityEntityHits)
    return frozenset(result)


def compile_basic_attack(skill: SkillSource, config: dict[str, Any], factory_name: str) -> str:
    if skill.unresolvedCombatActions != ("LaunchProjectile",):
        raise ValueError(
            f"{skill.key}: basic attack compiler expected only LaunchProjectile, got {skill.unresolvedCombatActions}"
        )
    if not skill.projectileTriggeredSkills:
        raise ValueError(f"{skill.key}: basic attack has no projectile hits")
    hit_frames: list[int] = []
    attack_scale: tuple[float, ...] | None = None
    stagger: tuple[float, ...] | None = None
    damage_type: str | None = None
    for index, hit in enumerate(skill.projectileTriggeredSkills):
        if hit.cycleTruncated or hit.nestedProjectileTriggeredSkills:
            raise ValueError(f"{skill.key}.projectileTriggeredSkills[{index}]: recursive projectile is not supported")
        hp_units = [unit for unit in hit.damageUnits if unit.attributeType == "Hp"]
        poise_units = [unit for unit in hit.damageUnits if unit.attributeType == "Poise"]
        unknown_units = [unit for unit in hit.damageUnits if unit.attributeType not in {"Hp", "Poise"}]
        if len(hp_units) != 1 or len(poise_units) > 1 or unknown_units:
            raise ValueError(f"{skill.key}.projectileTriggeredSkills[{index}]: unsupported DamageUnit layout")
        hp = hp_units[0]
        mapped_type = DAMAGE_TYPE_MAP.get(hp.damageType)
        if mapped_type is None:
            raise ValueError(f"{skill.key}: unsupported damage type {hp.damageType}")
        current_scale = require_level_values(hp.attackScale, f"{skill.key}.projectileTriggeredSkills[{index}].attackScale")
        current_stagger = (
            require_level_values(poise_units[0].poiseValue, f"{skill.key}.projectileTriggeredSkills[{index}].poise")
            if poise_units and poise_units[0].poiseValue
            else None
        )
        if damage_type is not None and damage_type != mapped_type:
            raise ValueError(f"{skill.key}: projectile hits use different damage types")
        if attack_scale is not None and attack_scale != current_scale:
            raise ValueError(f"{skill.key}: projectile hits use different attack scales")
        if stagger is not None and stagger != current_stagger:
            raise ValueError(f"{skill.key}: projectile hits use different stagger values")
        damage_type = mapped_type
        attack_scale = current_scale
        stagger = current_stagger
        hit_frames.append(hit.launchFrame + hit.assumedTravelFrames)
    if damage_type is None or attack_scale is None:
        raise ValueError(f"{skill.key}: incomplete damage source")
    options: dict[str, Any] = {}
    if config.get("final") is True:
        options["final"] = True
    recovery_key = config.get("spRecoveryBlackboardKey")
    if recovery_key is not None:
        if not isinstance(recovery_key, str) or recovery_key not in skill.patch.blackboard:
            raise ValueError(f"{skill.key}: invalid spRecoveryBlackboardKey")
        options["spRecovery"] = compact_level_values(skill.patch.blackboard[recovery_key])
    if stagger is not None:
        options["stagger"] = compact_level_values(stagger)
    frames: int | list[int] = hit_frames[0] if len(hit_frames) == 1 else hit_frames
    arguments = [
        ts_inline_literal(skill.key),
        str(skill.timelineBlockFrames),
        ts_inline_literal(frames),
        f"percentages({ts_inline_literal(percentage_values(attack_scale))})",
    ]
    if options:
        arguments.append(ts_inline_literal(options))
    return "\n".join(
        [f"  {factory_name}(", *(f"    {argument}," for argument in arguments), "  ),"]
    )


def compile_direct_damage(skill: SkillSource, config: dict[str, Any]) -> str:
    if len(skill.directDamageHits) != 1:
        raise ValueError(f"{skill.key}: direct damage compiler requires exactly one non-projectile hit")
    non_presentation_projectiles = [
        hit
        for hit in skill.projectileTriggeredSkills
        if hit.cycleTruncated or hit.combatActions or hit.nestedProjectileTriggeredSkills
    ]
    if non_presentation_projectiles:
        raise ValueError(f"{skill.key}: projectile contains combat behavior and cannot be omitted")
    unclassified = [action.sourceId for action in skill.auxiliaryActions if action.classification is None]
    if unclassified:
        raise ValueError(f"{skill.key}: unclassified auxiliary actions: {unclassified}")
    expected_actions = {
        "DamageAction",
        *(action.actionType for action in skill.auxiliaryActions),
        *({"ObtainCostAction"} if skill.resourceGains else set()),
        *({"SpellInfliction"} if skill.inflictions else set()),
        *({"LaunchProjectile"} if skill.projectileTriggeredSkills else set()),
        *({"GetTargetBuffBBAdvanced"} if skill.buffBlackboardReads else set()),
    }
    if set(skill.unresolvedCombatActions) != expected_actions:
        raise ValueError(f"{skill.key}: unresolved combat actions are not fully accounted for")
    hit = skill.directDamageHits[0]
    hp_units = [unit for unit in hit.damageUnits if unit.attributeType == "Hp"]
    poise_units = [unit for unit in hit.damageUnits if unit.attributeType == "Poise"]
    if len(hp_units) != 1 or len(poise_units) > 1 or len(hp_units) + len(poise_units) != len(hit.damageUnits):
        raise ValueError(f"{skill.key}: unsupported direct DamageUnit layout")
    hp = hp_units[0]
    damage_type = DAMAGE_TYPE_MAP.get(hp.damageType)
    if damage_type is None:
        raise ValueError(f"{skill.key}: unsupported damage type {hp.damageType}")
    scale = percentage_values(require_level_values(hp.attackScale, f"{skill.key}.attackScale"))
    damage_fields = [
        f"damageType: {ts_inline_literal(damage_type)}",
        f"attackScale: percentages({ts_inline_literal(scale)})",
        f"tags: {ts_inline_literal(require_list(config.get('tags'), f'{skill.key}.compile.tags'))}",
    ]
    if hp.calculation != "standard":
        damage_fields.append(f"calculation: {ts_inline_literal(hp.calculation)}")
    if hp.calculationMultiplier is not None:
        damage_fields.append(
            "calculationMultiplier: "
            f"{ts_inline_literal(compact_level_values(resolved_scalar_values(hp.calculationMultiplier)))}"
        )
    if poise_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{skill.key}: Poise unit has no value")
        stagger = compact_level_values(require_level_values(poise, f"{skill.key}.stagger"))
        damage_fields.append(f"stagger: {ts_inline_literal(stagger)}")
    damage_step = "\n".join(
        [
            "step('dealDamage', {",
            *(f"  {field}," for field in damage_fields),
            "})",
        ]
    )
    ordered_steps: list[tuple[float, str]] = [(hit.actionIndex, damage_step)]
    for index, read in enumerate(skill.buffBlackboardReads):
        if read.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: buff blackboard read and damage occur on different frames")
        ordered_steps.append(
            (
                read.actionIndex,
                compile_buff_blackboard_read(
                    read,
                    f"{skill.key}.buffBlackboardReads[{index}]",
                    root_skill_context=True,
                    input_target="enemy",
                ),
            )
        )
    for index, finish in enumerate(skill.buffFinishes):
        if finish.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: buff finish and damage occur on different frames")
        ordered_steps.append(
            (
                finish.actionIndex,
                compile_buff_finish(
                    finish,
                    f"{skill.key}.buffFinishes[{index}]",
                    root_skill_context=True,
                    input_target="enemy",
                ),
            )
        )
    for infliction in skill.inflictions:
        if infliction.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: infliction and damage occur on different frames")
        ordered_steps.append(
            (
                infliction.actionIndex,
                compile_infliction(infliction),
            )
        )
    for action in skill.auxiliaryActions:
        if action.classification != "skillCostUltimateEnergyGain":
            continue
        if action.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: ultimate energy gain and damage occur on different frames")
        ordered_steps.append(
            (
                action.actionIndex,
                "step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })",
            )
        )
    for gain in skill.resourceGains:
        if gain.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: resource gain and damage occur on different frames")
        amount_values = require_level_values(gain.amount, f"{skill.key}.resourceGain.amount")
        # 原生数据中存在已启用但全等级数值均为 0 的资源动作；保留在审计层，但不生成无效果步骤。
        if all(value == 0 for value in amount_values):
            continue
        ordered_steps.append(
            (
                gain.actionIndex,
                compile_resource_gain(gain, f"{skill.key}.resourceGain"),
            )
        )
    after_damage = config.get("afterDamage")
    if after_damage == "gainFinisherSp":
        ordered_steps.append(
            (hit.actionIndex + 0.5, "step('gainFinisherSp', { factor: 1, recipient: 'team' })")
        )
    elif after_damage is not None:
        raise ValueError(f"{skill.key}.compile.afterDamage: unsupported value")
    steps = [step_source for _, step_source in sorted(ordered_steps, key=lambda item: item[0])]
    rendered_steps = [
        f"          {line}{',' if index == len(lines) - 1 else ''}"
        for step_source in steps
        for lines in [step_source.splitlines()]
        for index, line in enumerate(lines)
    ]
    fields = [f"key: {ts_inline_literal(skill.key)},", f"timelineBlockFrames: {skill.timelineBlockFrames},"]
    availability = config.get("availability")
    if availability == "targetStaggered":
        fields.append("availability: { kind: 'targetStaggered', target: 'enemy' },")
    elif availability is not None:
        raise ValueError(f"{skill.key}.compile.availability: unsupported value")
    if config.get("usePatchCooldown") is True:
        frames = tuple(round(value * 30, 8) for value in skill.patch.cooldownSeconds)
        fields.append(f"cooldownFrames: {ts_inline_literal(compact_level_values(frames))},")
    cost_resource = config.get("costResource")
    if cost_resource is not None:
        cost = compact_level_values(skill.patch.costValues)
        fields.append(f"costs: [{{ resource: {ts_inline_literal(cost_resource)}, value: {ts_inline_literal(cost)} }}],")
        fields.append(f"costFrame: {skill.costFrame},")
    return "\n".join(
        [
            "  {",
            *(f"    {field}" for field in fields),
            "    scheduledSequences: [",
            "      scheduled(",
            f"        {hit.startFrame},",
            "        sequence(",
            *rendered_steps,
            "        ),",
            "      ),",
            "    ],",
            "  },",
        ]
    )


def compile_projectile_damage(skill: SkillSource, config: dict[str, Any]) -> str:
    if skill.unresolvedCombatActions != ("LaunchProjectile",):
        raise ValueError(
            f"{skill.key}: projectile damage compiler expected only root LaunchProjectile, "
            f"got {skill.unresolvedCombatActions}"
        )
    if len(skill.projectileTriggeredSkills) != 1:
        raise ValueError(f"{skill.key}: projectile damage compiler requires exactly one root projectile")
    hit = skill.projectileTriggeredSkills[0]
    if hit.cycleTruncated:
        raise ValueError(f"{skill.key}: root projectile unexpectedly truncates a cycle")
    if hit.assumedTravelFrames != 0:
        raise ValueError(f"{skill.key}: non-zero projectile travel is not supported yet")
    if len(hit.directDamageHits) != 1:
        raise ValueError(f"{skill.key}: projectile hit requires exactly one direct damage action")
    if hit.conditionalActions:
        if config.get("ignoreRecursiveProjectileForSingleTarget") is not True:
            raise ValueError(
                f"{skill.key}: conditional projectile branch requires an explicit single-target omission declaration"
            )
        validate_ignored_recursive_projectile_conditions(
            hit, f"{skill.key}.projectileTriggeredSkills[0].conditionalActions"
        )
    if hit.nestedProjectileTriggeredSkills:
        if config.get("ignoreRecursiveProjectileForSingleTarget") is not True:
            raise ValueError(
                f"{skill.key}: recursive projectile requires an explicit single-target omission declaration"
            )
        if any(
            nested.projectileId != hit.projectileId
            or nested.triggerSkillId != hit.triggerSkillId
            or not nested.cycleTruncated
            for nested in hit.nestedProjectileTriggeredSkills
        ):
            raise ValueError(f"{skill.key}: recursive projectile shape is not the expected self-cycle")

    expected_child_actions = {
        "DamageAction",
        *({"CreateBuffAction"} if hit.auxiliaryActions else set()),
        *({"ObtainCostAction"} if hit.resourceGains else set()),
        *({"LaunchProjectile"} if hit.nestedProjectileTriggeredSkills else set()),
        *({"IfElseAction", "LaunchProjectile"} if hit.conditionalActions else set()),
    }
    if set(hit.combatActions) != expected_child_actions:
        raise ValueError(f"{skill.key}: projectile child actions are not fully accounted for")
    unclassified = [action.sourceId for action in hit.auxiliaryActions if action.classification is None]
    if unclassified:
        raise ValueError(f"{skill.key}: unclassified projectile child actions: {unclassified}")

    damage = hit.directDamageHits[0]
    hp_units = [unit for unit in damage.damageUnits if unit.attributeType == "Hp"]
    poise_units = [unit for unit in damage.damageUnits if unit.attributeType == "Poise"]
    if len(hp_units) != 1 or len(poise_units) > 1 or len(hp_units) + len(poise_units) != len(damage.damageUnits):
        raise ValueError(f"{skill.key}: unsupported projectile DamageUnit layout")
    hp = hp_units[0]
    damage_type = DAMAGE_TYPE_MAP.get(hp.damageType)
    if damage_type is None:
        raise ValueError(f"{skill.key}: unsupported damage type {hp.damageType}")
    damage_fields = [
        f"damageType: {ts_inline_literal(damage_type)}",
        f"attackScale: percentages({ts_inline_literal(percentage_values(require_level_values(hp.attackScale, f'{skill.key}.attackScale')))})",
        f"tags: {ts_inline_literal(require_list(config.get('tags'), f'{skill.key}.compile.tags'))}",
    ]
    if poise_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{skill.key}: Poise unit has no value")
        damage_fields.append(
            f"stagger: {ts_inline_literal(compact_level_values(require_level_values(poise, f'{skill.key}.stagger')))}"
        )
    damage_step = "\n".join(
        ["step('dealDamage', {", *(f"  {field}," for field in damage_fields), "})"]
    )
    ordered_steps: list[tuple[int, str]] = [(damage.actionIndex, damage_step)]
    for action in hit.auxiliaryActions:
        if action.classification == "tutorialMarker":
            continue
        if action.classification != "electrificationReaction":
            raise ValueError(f"{skill.key}: unsupported auxiliary classification {action.classification}")
        duration = action.blackboardAssignments.get("duration")
        if duration is None:
            raise ValueError(f"{skill.key}: electrification reaction has no duration assignment")
        duration_seconds = compact_level_values(
            require_level_values(duration, f"{skill.key}.electrification.duration")
        )
        ordered_steps.append(
            (
                action.actionIndex,
                "\n".join(
                    [
                        "step('applyElementalReaction', {",
                        "  reaction: 'electrification',",
                        "  target: 'enemy',",
                        f"  durationSeconds: {ts_inline_literal(duration_seconds)},",
                        "  effectiveness: 1,",
                        f"}}, {ts_inline_literal(f'{skill.key}.electrification')})",
                    ]
                ),
            )
        )
    for gain in hit.resourceGains:
        ordered_steps.append(
            (
                gain.actionIndex,
                compile_resource_gain(gain, f"{skill.key}.resourceGain"),
            )
        )
    rendered_steps = [
        f"          {line}{',' if index == len(lines) - 1 else ''}"
        for _, step_source in sorted(ordered_steps, key=lambda item: item[0])
        for lines in [step_source.splitlines()]
        for index, line in enumerate(lines)
    ]
    cooldown_frames = tuple(round(value * 30, 8) for value in skill.patch.cooldownSeconds)
    activation = require_dict(config.get("activationWindow"), f"{skill.key}.compile.activationWindow")
    trigger_tag = activation.get("damageTag")
    duration_frames = activation.get("durationFrames")
    if not isinstance(trigger_tag, str) or not trigger_tag:
        raise ValueError(f"{skill.key}.compile.activationWindow.damageTag: expected non-empty string")
    duration_frames = require_non_negative_int(duration_frames, f"{skill.key}.compile.activationWindow.durationFrames")
    return "\n".join(
        [
            "  {",
            f"    key: {ts_inline_literal(skill.key)},",
            f"    timelineBlockFrames: {skill.timelineBlockFrames},",
            f"    cooldownFrames: {ts_inline_literal(compact_level_values(cooldown_frames))},",
            "    activationWindow: {",
            f"      durationFrames: {duration_frames},",
            "      rules: {",
            "        trigger: {",
            "          kind: 'damageTagHit',",
            f"          tag: {ts_inline_literal(trigger_tag)},",
            "          scope: 'team',",
            "        },",
            "      },",
            "    },",
            "    scheduledSequences: [",
            "      scheduled(",
            f"        {hit.launchFrame + hit.assumedTravelFrames + damage.startFrame},",
            "        sequence(",
            *rendered_steps,
            "        ),",
            "      ),",
            "    ],",
            "  },",
        ]
    )


def validate_ignored_recursive_projectile_conditions(
    hit: ProjectileTriggeredSkillSource, path: str
) -> None:
    """校验显式省略项确实只是在条件分支中再次发射同一命中技能。"""
    launches: list[ProjectileLaunchSource] = []
    for condition_index, condition in enumerate(hit.conditionalActions):
        if condition.failActions:
            raise ValueError(f"{path}[{condition_index}]: recursive omission has a fail branch")
        for action_index, action in enumerate(condition.succeedActions):
            if action.projectileLaunch is not None:
                launches.append(action.projectileLaunch)
                continue
            if action.blackboardMutation is not None:
                continue
            raise ValueError(
                f"{path}[{condition_index}].succeedActions[{action_index}]: "
                f"unsupported recursive omission leaf {action.actionType!r}"
            )
    if len(launches) != 1:
        raise ValueError(f"{path}: expected exactly one recursive projectile launch")
    launch = launches[0]
    if (
        launch.projectileId != hit.projectileId
        or ProjectileSkillTriggerSource(hit.triggerEvent, hit.triggerSkillId)
        not in launch.skillTriggers
    ):
        raise ValueError(f"{path}: recursive launch does not target the same projectile event skill")


def compile_damage_units_step(
    damage_units: tuple[DamageUnitSource, ...],
    tags: tuple[str, ...],
    path: str,
    runtime_blackboard_keys: frozenset[str] = frozenset(),
) -> list[str]:
    """按原生 DamageUnit 顺序编译生命伤害及独立失衡单元。"""
    hp_units = [unit for unit in damage_units if unit.attributeType == "Hp"]
    poise_units = [unit for unit in damage_units if unit.attributeType == "Poise"]
    if (
        len(hp_units) > 1
        or len(poise_units) > 1
        or len(hp_units) + len(poise_units) != len(damage_units)
        or not damage_units
    ):
        raise ValueError(f"{path}: unsupported DamageUnit layout")
    if not hp_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{path}: Poise unit has no value")
        if poise.blackboardKey in runtime_blackboard_keys:
            value = (
                "{ kind: 'blackboard', key: "
                f"{ts_inline_literal(poise.blackboardKey)} }}"
            )
        else:
            value = ts_inline_literal(
                compact_level_values(require_level_values(poise, f"{path}.stagger"))
            )
        return [
            "step('dealStagger', {",
            f"  value: {value},",
            "})",
        ]
    if tuple(unit.attributeType for unit in damage_units) not in {("Hp",), ("Hp", "Poise")}:
        raise ValueError(f"{path}: unsupported DamageUnit execution order")
    hp = hp_units[0]
    damage_type = DAMAGE_TYPE_MAP.get(hp.damageType)
    if damage_type is None:
        raise ValueError(f"{path}: unsupported damage type {hp.damageType}")
    if hp.calculation == "definiteValue":
        fixed_value = hp.definiteValue
        if fixed_value is None:
            raise ValueError(f"{path}: definite damage unit has no value")
        if fixed_value.blackboardKey in runtime_blackboard_keys:
            value = (
                "{ kind: 'blackboard', key: "
                f"{ts_inline_literal(fixed_value.blackboardKey)} }}"
            )
        else:
            value = ts_inline_literal(
                compact_level_values(require_level_values(fixed_value, f"{path}.value"))
            )
        fields = [
            f"damageType: {ts_inline_literal(damage_type)}",
            f"value: {value}",
            f"tags: {ts_inline_literal(tags)}",
        ]
    else:
        if hp.attackScale.blackboardKey in runtime_blackboard_keys:
            attack_scale = (
                "{ kind: 'blackboard', key: "
                f"{ts_inline_literal(hp.attackScale.blackboardKey)} }}"
            )
        else:
            attack_scale = (
                "percentages("
                f"{ts_inline_literal(percentage_values(require_level_values(hp.attackScale, f'{path}.attackScale')))}"
                ")"
            )
        fields = [
            f"damageType: {ts_inline_literal(damage_type)}",
            f"attackScale: {attack_scale}",
            f"tags: {ts_inline_literal(tags)}",
        ]
        if hp.calculation != "standard":
            fields.append(f"calculation: {ts_inline_literal(hp.calculation)}")
        if hp.calculationMultiplier is not None:
            fields.append(
                "calculationMultiplier: "
                f"{ts_inline_literal(compact_level_values(resolved_scalar_values(hp.calculationMultiplier)))}"
            )
    if poise_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{path}: Poise unit has no value")
        if poise.blackboardKey in runtime_blackboard_keys:
            fields.append(
                "stagger: { kind: 'blackboard', key: "
                f"{ts_inline_literal(poise.blackboardKey)} }}"
            )
        else:
            fields.append(
                "stagger: "
                f"{ts_inline_literal(compact_level_values(require_level_values(poise, f'{path}.stagger')))}"
            )
    step_kind = "dealFixedDamage" if hp.calculation == "definiteValue" else "dealDamage"
    return [f"step('{step_kind}', {{", *(f"  {field}," for field in fields), "})"]


def compile_resolved_damage_steps(
    skill: SkillSource,
    config: dict[str, Any],
    hit: ResolvedDamageHitSource,
    index: int,
    is_last_damage: bool,
    runtime_blackboard_keys: frozenset[str] = frozenset(),
) -> list[str]:
    """把一个已解析命中编译成同步步骤；收尾效果紧跟最后一次伤害。"""
    tags = tuple(require_list(config.get("tags"), f"{skill.key}.compile.tags"))
    result = compile_damage_units_step(
        hit.damageUnits,
        tags,
        f"{skill.key}.resolvedDamageHits[{index}]",
        runtime_blackboard_keys,
    )
    if is_last_damage and config.get("afterDamage") == "gainFinisherSp":
        result.append("step('gainFinisherSp', { factor: 1, recipient: 'team' })")
    elif is_last_damage and config.get("afterDamage") is not None:
        raise ValueError(f"{skill.key}.compile.afterDamage: unsupported value")
    return result


def compile_resolved_sequence(
    skill: SkillSource,
    config: dict[str, Any],
    *,
    require_damage: bool,
) -> str:
    """将已闭环根动作统一编译为按原生顺序调度的序列。"""
    ignored_auxiliary_classifications = set(
        require_list(
            config.get("ignoreAuxiliaryClassifications", []),
            f"{skill.key}.compile.ignoreAuxiliaryClassifications",
        )
    )
    ignored_buff_ids = frozenset(
        require_list(config.get("ignoreBuffIds", []), f"{skill.key}.compile.ignoreBuffIds")
    )
    damage_tags = tuple(require_list(config.get("tags", []), f"{skill.key}.compile.tags"))
    runtime_blackboard_keys = collect_runtime_blackboard_output_keys(skill)
    collapse_single_enemy_entity_branches = config.get(
        "collapseSingleEnemyAbilityEntityBranches", False
    )
    if not isinstance(collapse_single_enemy_entity_branches, bool):
        raise ValueError(
            f"{skill.key}.compile.collapseSingleEnemyAbilityEntityBranches: expected boolean"
        )
    projected_condition_paths = frozenset(
        condition.actionPath
        for condition in skill.conditionalActions
        if is_single_enemy_ability_entity_projection(condition)
    )
    if collapse_single_enemy_entity_branches and not projected_condition_paths:
        raise ValueError(f"{skill.key}: no single-enemy ability entity branch can be projected")
    combat_auxiliary_actions = [
        action
        for action in getattr(skill, "auxiliaryActions", [])
        if action.actionType == "CreateBuffAction"
    ]
    if any(not launch.skillTriggers for launch in skill.projectileLaunches):
        raise ValueError(f"{skill.key}: projectile without triggered SkillData remains unresolved")
    unmodeled_projectile_actions: list[str] = []

    def collect_unmodeled_projectile_actions(hit: ProjectileTriggeredSkillSource) -> None:
        if getattr(hit, "excludedByPrimaryTargetMarker", False):
            return
        projected_actions = {"DamageAction"}
        if hit.conditionalActions:
            projected_actions.update(
                collect_compilable_conditional_action_types(hit.conditionalActions)
            )
        if hit.resourceGains:
            projected_actions.add("ObtainCostAction")
        if any(
            action.actionType == "CreateBuffAction"
            for action in getattr(hit, "auxiliaryActions", ())
        ):
            projected_actions.add("CreateBuffAction")
        if getattr(hit, "inflictions", ()):
            projected_actions.add("SpellInfliction")
        if hit.nestedProjectileTriggeredSkills:
            projected_actions.add("LaunchProjectile")
        if getattr(hit, "abilityEntityHits", ()):
            projected_actions.add("SpawnAbilityEntity")
        unmodeled_projectile_actions.extend(
            action for action in hit.combatActions if action not in projected_actions
        )
        for nested in hit.nestedProjectileTriggeredSkills:
            collect_unmodeled_projectile_actions(nested)

    for projectile in skill.projectileTriggeredSkills:
        collect_unmodeled_projectile_actions(projectile)
    if unmodeled_projectile_actions:
        raise ValueError(
            f"{skill.key}: projectile child combat actions are not projected: "
            f"{sorted(set(unmodeled_projectile_actions))}"
        )
    allowed_actions = {"DamageAction", "LaunchProjectile", "SpawnAbilityEntity"}
    allowed_actions.update(collect_compilable_conditional_action_types(skill.conditionalActions))
    if skill.blackboardCalculations:
        allowed_actions.add("SimpleCalcBBAction")
    if skill.blackboardMutations:
        allowed_actions.add("ModifyDynamicBlackboard")
    if skill.buffBlackboardReads:
        allowed_actions.add("GetTargetBuffBBAdvanced")
    if skill.buffFinishes:
        allowed_actions.add("FinishBuffAdvanced")
    if skill.inflictions:
        allowed_actions.add("SpellInfliction")
    if combat_auxiliary_actions:
        allowed_actions.add("CreateBuffAction")
    if skill.resourceGains:
        allowed_actions.add("ObtainCostAction")
    uncovered_actions = sorted(set(skill.unresolvedCombatActions) - allowed_actions)
    if uncovered_actions:
        raise ValueError(
            f"{skill.key}: unresolved combat actions are not covered by resolved damage "
            f"compiler: {uncovered_actions}"
        )
    hits = collect_resolved_damage_hits(skill)
    if require_damage and not hits:
        raise ValueError(f"{skill.key}: resolved damage compiler found no damage hits")
    schedule = tuple(
        item
        for item in collect_resolved_schedule(skill)
        if not (
            item.itemType == "buffApplication"
            and (
                cast(AuxiliaryActionSource, item.payload).classification
                in ignored_auxiliary_classifications
                or cast(AuxiliaryActionSource, item.payload).sourceId in ignored_buff_ids
            )
        )
        and not (
            item.itemType == "condition"
            and collapse_single_enemy_entity_branches
            and cast(ConditionalActionSource, item.payload).actionPath
            in projected_condition_paths
        )
    )
    damage_indexes = {hit: index for index, hit in enumerate(hits)}
    scheduled_entries: list[str] = []
    for schedule_index, item in enumerate(schedule):
        if item.itemType == "damage":
            payload = cast(ResolvedDamageHitSource, item.payload)
            index = damage_indexes[payload]
            step_lines = compile_resolved_damage_steps(
                skill,
                config,
                payload,
                index,
                index == len(hits) - 1,
                runtime_blackboard_keys,
            )
        elif item.itemType == "condition":
            payload = cast(ConditionalActionSource, item.payload)
            target_group_writes = root_target_group_writes_for_condition(
                skill, item, payload
            )
            compiled_condition = compile_conditional_action(
                payload,
                f"{skill.key}.schedule[{schedule_index}].conditionalAction",
                ignored_buff_ids,
                damage_tags,
                runtime_blackboard_keys,
                target_group_writes=target_group_writes,
                root_skill_context=item.sourcePath == payload.actionPath,
                input_target=item.inputTarget,
                skill_has_output_damage=root_skill_has_output_damage_before(
                    schedule, schedule_index, skill.skillId
                ),
            )
            if compiled_condition == "sequence()":
                continue
            step_lines = compiled_condition.splitlines()
        elif item.itemType == "blackboardCalculation":
            payload = cast(BlackboardCalculationSource, item.payload)
            step_lines = compile_blackboard_calculation(
                payload,
                f"{skill.key}.schedule[{schedule_index}].blackboardCalculation",
            ).splitlines()
        elif item.itemType == "blackboardMutation":
            payload = cast(BlackboardMutationSource, item.payload)
            step_lines = compile_blackboard_mutation(
                payload,
                f"{skill.key}.schedule[{schedule_index}].blackboardMutation",
            ).splitlines()
        elif item.itemType == "buffBlackboardRead":
            payload = cast(BuffBlackboardReadSource, item.payload)
            context_target_is_enemy = False
            if (
                item.sourcePath == (skill.skillId,)
                and payload.targetSource == "Context"
                and payload.targetGroupKey != "smart_target"
            ):
                write = resolve_latest_target_group_write_at(
                    read_frame=payload.startFrame,
                    read_action_index=payload.actionIndex,
                    read_action_path=(),
                    target_group_key=payload.targetGroupKey,
                    writes=skill.targetGroupWrites,
                )
                context_target_is_enemy = (
                    write is not None
                    and target_group_write_guarantees_single_enemy(write)
                )
            step_lines = compile_buff_blackboard_read(
                payload,
                f"{skill.key}.schedule[{schedule_index}].buffBlackboardRead",
                root_skill_context=item.sourcePath == (skill.skillId,),
                input_target=item.inputTarget,
                context_target_is_enemy=context_target_is_enemy,
            ).splitlines()
        elif item.itemType == "buffFinish":
            payload = cast(BuffFinishSource, item.payload)
            step_lines = compile_buff_finish(
                payload,
                f"{skill.key}.schedule[{schedule_index}].buffFinish",
                root_skill_context=item.sourcePath == (skill.skillId,),
                input_target=item.inputTarget,
            ).splitlines()
        elif item.itemType == "buffHold":
            payload = cast(BuffHoldSource, item.payload)
            step_lines = compile_buff_hold(
                payload,
                f"{skill.key}.schedule[{schedule_index}].buffHold",
            ).splitlines()
        elif item.itemType == "resourceGain":
            payload = cast(TimedResourceGainSource, item.payload)
            step_lines = compile_resource_gain(
                payload,
                f"{skill.key}.schedule[{schedule_index}].resourceGain",
            ).splitlines()
        elif item.itemType == "infliction":
            payload = cast(TimedInflictionSource, item.payload)
            step_lines = compile_infliction(payload).splitlines()
        elif item.itemType == "buffApplication":
            payload = cast(AuxiliaryActionSource, item.payload)
            context_application_target = None
            if (
                item.sourcePath == (skill.skillId,)
                and payload.targetSource == "Context"
                and payload.targetGroupKey != "smart_target"
            ):
                write = resolve_latest_target_group_write_at(
                    read_frame=payload.startFrame,
                    read_action_index=payload.actionIndex,
                    read_action_path=(),
                    target_group_key=payload.targetGroupKey,
                    writes=skill.targetGroupWrites,
                )
                context_application_target = target_group_write_buff_application_target(write)
            step_lines = compile_buff_application(
                payload,
                f"{skill.key}.schedule[{schedule_index}].buffApplication",
                root_skill_context=item.sourcePath == (skill.skillId,),
                context_application_target=context_application_target,
                input_target=item.inputTarget,
            ).splitlines()
        else:
            raise AssertionError(f"{skill.key}: unknown schedule item type {item.itemType!r}")
        entry_lines = [
                "      scheduled(",
                f"        {item.frame},",
                "        sequence(",
                *(f"          {line}," if line.endswith(")") else f"          {line}" for line in step_lines),
                "        ),",
            ]
        if item.itemType == "buffHold":
            entry_lines.append(f"        {cast(BuffHoldSource, item.payload).endFrame},")
        entry_lines.append("      ),")
        scheduled_entries.extend(entry_lines)
    fields = [
            "  {",
            f"    key: {ts_inline_literal(skill.key)},",
            f"    timelineBlockFrames: {skill.timelineBlockFrames},",
    ]
    availability = config.get("availability")
    if availability == "targetStaggered":
        fields.append("    availability: { kind: 'targetStaggered', target: 'enemy' },")
    elif availability is not None:
        raise ValueError(f"{skill.key}.compile.availability: unsupported value")
    if config.get("usePatchCooldown") is True:
        cooldown_frames = tuple(
            round(value * 30, 8) for value in skill.patch.cooldownSeconds
        )
        fields.append(
            "    cooldownFrames: "
            f"{ts_inline_literal(compact_level_values(cooldown_frames))},"
        )
    elif config.get("usePatchCooldown") is not None:
        raise ValueError(f"{skill.key}.compile.usePatchCooldown: expected true")
    cost_resource = config.get("costResource")
    if cost_resource is not None:
        if not isinstance(cost_resource, str) or not cost_resource:
            raise ValueError(f"{skill.key}.compile.costResource: expected non-empty string")
        fields.append(
            "    costs: [{ resource: "
            f"{ts_inline_literal(cost_resource)}, value: "
            f"{ts_inline_literal(compact_level_values(skill.patch.costValues))} }}],"
        )
        fields.append(f"    costFrame: {skill.costFrame},")
    fields.extend(
        [
            "    scheduledSequences: [",
            *scheduled_entries,
            "    ],",
            "  },",
        ]
    )
    return "\n".join(fields)


def compile_resolved_damage_sequence(skill: SkillSource, config: dict[str, Any]) -> str:
    """兼容要求至少一个伤害命中的严格入口。"""
    return compile_resolved_sequence(skill, config, require_damage=True)


def compile_skill_entries(
    operator: dict[str, Any], skills: list[SkillSource]
) -> tuple[list[tuple[SkillSource, str]], set[str]]:
    entries = require_list(operator.get("skills"), f"{operator.get('slug')}.skills")
    compiled: list[tuple[SkillSource, str]] = []
    damage_type_factories: set[str] = set()
    for entry, skill in zip(entries, skills, strict=True):
        config = entry.get("compile")
        if config is None:
            continue
        config = require_dict(config, f"{skill.key}.compile")
        kind = config.get("kind")
        if skill.conditionalActions and kind not in {
            "resolvedDamageSequence",
            "resolvedSequence",
        }:
            raise ValueError(
                f"{skill.key}: compiler must consume conditional actions before emitting DSL"
            )
        if kind == "basicAttack":
            damage_types = {
                DAMAGE_TYPE_MAP[unit.damageType]
                for hit in skill.projectileTriggeredSkills
                for unit in hit.damageUnits
                if unit.attributeType == "Hp" and unit.damageType in DAMAGE_TYPE_MAP
            }
            if len(damage_types) != 1:
                raise ValueError(f"{skill.key}: expected exactly one supported health damage type")
            damage_type = next(iter(damage_types))
            factory_name = f"{damage_type}BasicAttack"
            damage_type_factories.add(factory_name)
            compiled.append((skill, compile_basic_attack(skill, config, factory_name)))
        elif kind == "directDamage":
            compiled.append((skill, compile_direct_damage(skill, config)))
        elif kind == "projectileDamage":
            compiled.append((skill, compile_projectile_damage(skill, config)))
        elif kind == "resolvedDamageSequence":
            compiled.append((skill, compile_resolved_damage_sequence(skill, config)))
        elif kind == "resolvedSequence":
            compiled.append(
                (skill, compile_resolved_sequence(skill, config, require_damage=False))
            )
        else:
            raise ValueError(f"{skill.key}.compile.kind: unsupported compiler {kind!r}")
    return compiled, damage_type_factories


def generated_skill_name(operator: dict[str, Any], skill_key: str) -> str:
    if not skill_key or not skill_key.replace("_", "").isalnum():
        raise ValueError(f"invalid stable skill key for TypeScript identifier: {skill_key!r}")
    return f"{typescript_identifier(str(operator['slug']))}{skill_key[0].upper()}{skill_key[1:]}"


def render_named_skills(
    operator: dict[str, Any], compiled: list[tuple[SkillSource, str]]
) -> list[str]:
    result: list[str] = []
    for skill, expression in compiled:
        value = expression.rstrip()
        if not value.endswith(","):
            raise ValueError(f"{skill.key}: compiled skill expression must end with a comma")
        value = textwrap.dedent(value[:-1])
        condition_blackboard_keys = collect_conditional_blackboard_keys(
            skill.conditionalActions
        )
        blackboard = {
            item.key: item.value
            for item in skill.declaredBlackboard
            if item.key in condition_blackboard_keys
        }
        blackboard.update(skill.patch.blackboard)
        if blackboard:
            blackboard_lines: list[str] = []
            for key, values in blackboard.items():
                compiled_values = compact_level_values(values) if isinstance(values, tuple) else values
                blackboard_lines.append(
                    f"  {ts_inline_literal(key)}: {ts_inline_literal(compiled_values)},"
                )
            value = "\n".join(
                [
                    "withSkillBlackboard(",
                    textwrap.indent(value, "  ") + ",",
                    "  {",
                    *(f"  {line}" for line in blackboard_lines),
                    "  },",
                    ")",
                ]
            )
        value_lines = value.splitlines()
        if len(value_lines) == 1:
            result.extend(
                [
                    f"export const {generated_skill_name(operator, skill.key)}: SkillDefinition = {value};",
                    "",
                ]
            )
            continue
        result.extend(
            [
                f"export const {generated_skill_name(operator, skill.key)}: SkillDefinition = {value_lines[0]}",
                *(f"{line}" for line in value_lines[1:-1]),
                f"{value_lines[-1]};",
                "",
            ]
        )
    return result


def collect_conditional_blackboard_keys(
    actions: tuple[ConditionalActionSource, ...],
) -> set[str]:
    """收集已编译条件树实际读写的动作黑板键，避免注入表现层原生变量。"""
    result: set[str] = set()

    def add_scalar(source: ScalarSource | None) -> None:
        if source is not None and source.blackboardKey is not None:
            result.add(source.blackboardKey)

    def visit_condition(action: ConditionalActionSource) -> None:
        for condition in action.conditions:
            add_scalar(condition.left)
            add_scalar(condition.right)
            if condition.buffStack is not None:
                add_scalar(condition.buffStack.value)
        for branch_action in (*action.succeedActions, *action.failActions):
            if getattr(branch_action, "onceActions", None) is not None:
                visit_branch_actions(branch_action.onceActions)
            if branch_action.nestedCondition is not None:
                visit_condition(branch_action.nestedCondition)
            if branch_action.blackboardMutation is not None:
                result.add(branch_action.blackboardMutation.key)
                add_scalar(branch_action.blackboardMutation.value)
            if branch_action.buffBlackboardRead is not None:
                result.add(branch_action.buffBlackboardRead.outputKey)

    def visit_branch_actions(
        actions: tuple[ConditionalBranchActionSource, ...],
    ) -> None:
        for branch_action in actions:
            if branch_action.nestedCondition is not None:
                visit_condition(branch_action.nestedCondition)
            if getattr(branch_action, "onceActions", None) is not None:
                visit_branch_actions(branch_action.onceActions)
            if branch_action.blackboardMutation is not None:
                result.add(branch_action.blackboardMutation.key)
                add_scalar(branch_action.blackboardMutation.value)
            if branch_action.buffBlackboardRead is not None:
                result.add(branch_action.buffBlackboardRead.outputKey)

    for action in actions:
        visit_condition(action)
    return result


def collect_definition_helpers(
    compiled: list[tuple[SkillSource, str]], damage_type_factories: set[str]
) -> str:
    """收集生成技能实际需要的 DSL helper，供两种输出入口共用。"""
    helpers = {
        *damage_type_factories,
        "percentages",
        "scheduled",
        "sequence",
        "step",
        "withSkillBlackboard",
    }
    if any(skill.conditionalActions for skill, _ in compiled):
        helpers.add("branch")
    if any("once(" in source for _, source in compiled):
        helpers.add("once")
    return ", ".join(sorted(helpers))


def render_compiled_skills(operator: dict[str, Any], skills: list[SkillSource]) -> str:
    compiled, damage_type_factories = compile_skill_entries(operator, skills)
    helper_imports = collect_definition_helpers(compiled, damage_type_factories)
    return (
        "/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */\n"
        "import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';\n"
        f"import {{ {helper_imports} }} from '../definitionHelpers';\n\n"
        "// prettier-ignore\n"
        + "\n".join(render_named_skills(operator, compiled))
    )


WEAPON_TYPE_MAP = {2: "arts-unit"}
ELEMENT_TYPE_MAP = {"Pulse": "electric"}
PROFESSION_MAP = {5: "caster"}
ATTRIBUTE_TYPE_MAP = {39: "strength", 40: "agility", 41: "intellect", 42: "will"}
PANEL_ATTRIBUTE_TYPES = {
    "strength": 39,
    "agility": 40,
    "intellect": 41,
    "will": 42,
    "baseAttack": 2,
    "baseHealth": 1,
}
PANEL_LEVELS = (1, 20, 40, 60, 80, 90)


def table_row(table: dict[str, Any], key: str, path: str) -> dict[str, Any]:
    if key not in table:
        raise ValueError(f"{path}: missing {key}")
    return require_dict(table[key], f"{path}.{key}")


def parse_panel_attributes(character: dict[str, Any], path: str) -> dict[str, tuple[int, ...]]:
    rows_by_level: dict[int, dict[int, float]] = {}
    for index, raw_row in enumerate(require_list(character.get("attributes"), f"{path}.attributes")):
        row = require_dict(raw_row, f"{path}.attributes[{index}]")
        attributes = require_dict(row.get("Attribute"), f"{path}.attributes[{index}].Attribute")
        values = {
            require_non_negative_int(item.get("attrType"), f"{path}.attributes[{index}].attrType"): float(item["attrValue"])
            for item in (
                require_dict(raw_item, f"{path}.attributes[{index}].attrs[]")
                for raw_item in require_list(attributes.get("attrs"), f"{path}.attributes[{index}].attrs")
            )
        }
        level = int(values.get(0, -1))
        if level in PANEL_LEVELS and level not in rows_by_level:
            rows_by_level[level] = values
    missing = set(PANEL_LEVELS).difference(rows_by_level)
    if missing:
        raise ValueError(f"{path}.attributes: missing panel levels {sorted(missing)}")
    return {
        name: tuple(int(rows_by_level[level][attr_type]) for level in PANEL_LEVELS)
        for name, attr_type in PANEL_ATTRIBUTE_TYPES.items()
    }


def typescript_identifier(slug: str) -> str:
    parts = slug.split("-")
    if not parts or any(not part or not part.replace("_", "").isalnum() for part in parts):
        raise ValueError(f"invalid operator slug for TypeScript identifier: {slug!r}")
    return parts[0] + "".join(part[0].upper() + part[1:] for part in parts[1:])


def render_skill_groups(
    operator: dict[str, Any],
    skills: list[SkillSource],
) -> list[str]:
    skill_by_key = {skill.key: skill for skill in skills}
    if len(skill_by_key) != len(skills):
        raise ValueError(f"{operator['slug']}.skills: duplicate stable skill key")
    result: list[str] = []
    for raw_group in require_list(operator.get("skillGroups"), f"{operator['slug']}.skillGroups"):
        group = require_dict(raw_group, f"{operator['slug']}.skillGroups[]")
        key = str(group["key"])
        skill_type = str(group["skillType"])
        level_source = str(group["levelSource"])
        skill_keys = [str(item) for item in require_list(group.get("skillKeys"), f"skillGroups.{key}.skillKeys")]
        if not skill_keys:
            raise ValueError(f"skillGroups.{key}: expected at least one skill")
        try:
            referenced_skills = [skill_by_key[skill_key] for skill_key in skill_keys]
        except KeyError as error:
            raise ValueError(f"skillGroups.{key}: unknown skill key {error.args[0]!r}") from error
        if any(skill.skillType != skill_type for skill in referenced_skills):
            raise ValueError(f"skillGroups.{key}: skill type does not match referenced skills")
        references = [generated_skill_name(operator, skill.key) for skill in referenced_skills]
        skills_source = references[0] if len(references) == 1 else f"[{', '.join(references)}]"
        result.append(
            "{ "
            f"key: {ts_inline_literal(key)}, skillType: {ts_inline_literal(skill_type)}, "
            f"levelSource: {ts_inline_literal(level_source)}, skills: {skills_source} "
            "}"
        )
    return result


def validate_skill_groups(
    operator: dict[str, Any],
    skills: list[SkillSource],
    growth: dict[str, Any],
    path: str,
) -> None:
    skill_by_key = {skill.key: skill for skill in skills}
    expected_by_type: dict[int, list[str]] = {}
    referenced_keys: list[str] = []
    for raw_group in require_list(operator.get("skillGroups"), f"{operator['slug']}.skillGroups"):
        group = require_dict(raw_group, f"{operator['slug']}.skillGroups[]")
        group_type = require_non_negative_int(group.get("nativeGroupType"), "nativeGroupType")
        skill_keys = [str(item) for item in require_list(group.get("skillKeys"), "skillKeys")]
        for key in skill_keys:
            if key not in skill_by_key:
                raise ValueError(f"{operator['slug']}.skillGroups: unknown skill key {key!r}")
            expected_by_type.setdefault(group_type, []).append(skill_by_key[key].skillId)
            referenced_keys.append(key)
    if len(referenced_keys) != len(set(referenced_keys)):
        raise ValueError(f"{operator['slug']}.skillGroups: a skill is assigned more than once")
    if set(referenced_keys) != set(skill_by_key):
        missing = sorted(set(skill_by_key).difference(referenced_keys))
        raise ValueError(f"{operator['slug']}.skillGroups: unassigned skills {missing}")
    actual_by_type: dict[int, list[str]] = {}
    for raw_group in require_dict(growth.get("skillGroupMap"), f"{path}.skillGroupMap").values():
        group = require_dict(raw_group, f"{path}.skillGroupMap[]")
        group_type = require_non_negative_int(group.get("skillGroupType"), "skillGroupType")
        skill_ids = [str(item) for item in require_list(group.get("skillIdList"), "skillIdList")]
        if group_type in actual_by_type:
            raise ValueError(f"{path}.skillGroupMap: duplicate group type {group_type}")
        actual_by_type[group_type] = skill_ids
    if actual_by_type != expected_by_type:
        raise ValueError(
            f"{path}.skillGroupMap does not match generated skill sources: "
            f"expected {expected_by_type}, got {actual_by_type}"
        )


def skill_id_by_key(skills: list[SkillSource], key: str) -> str:
    matches = [skill.skillId for skill in skills if skill.key == key]
    if len(matches) != 1:
        raise ValueError(f"operator skills: expected exactly one skill with key {key!r}")
    return matches[0]


def render_talents(
    operator: dict[str, Any],
    skills: list[SkillSource],
    growth: dict[str, Any],
    effects: dict[str, Any],
) -> list[str]:
    nodes = require_dict(growth.get("talentNodeMap"), "CharGrowthTable.talentNodeMap")
    by_index: dict[int, list[tuple[int, str]]] = {}
    for raw_node in nodes.values():
        node = require_dict(raw_node, "CharGrowthTable.talentNodeMap[]")
        passive = require_dict(node.get("passiveSkillNodeInfo"), "passiveSkillNodeInfo")
        effect_id = passive.get("talentEffectId")
        if not effect_id:
            continue
        index = require_non_negative_int(passive.get("index"), "passiveSkillNodeInfo.index")
        level = require_non_negative_int(passive.get("level"), "passiveSkillNodeInfo.level")
        by_index.setdefault(index, []).append((level, str(effect_id)))
    result: list[str] = []
    for raw_config in require_list(operator.get("talents"), f"{operator['slug']}.talents"):
        config = require_dict(raw_config, f"{operator['slug']}.talents[]")
        index = require_non_negative_int(config.get("index"), "talent.index")
        entries = sorted(by_index.get(index, []))
        if not entries:
            raise ValueError(f"talent index {index}: no source effects")
        kind = config.get("compile")
        key = str(config["key"])
        if kind == "targetStaggeredDamage":
            values: list[float] = []
            for _, effect_id in entries:
                effect = table_row(effects, effect_id, "PotentialTalentEffectTable")
                data = require_list(effect.get("dataList"), f"{effect_id}.dataList")
                if len(data) != 1:
                    raise ValueError(f"{effect_id}: expected one talent effect")
                attach = require_dict(require_dict(data[0], f"{effect_id}.dataList[0]").get("attachBuff"), "attachBuff")
                buff_id = attach.get("buffId")
                if not isinstance(buff_id, str) or not buff_id:
                    raise ValueError(f"{effect_id}: missing stagger damage buff")
                blackboard = require_list(attach.get("blackboard"), f"{effect_id}.attachBuff.blackboard")
                item = next((item for item in blackboard if item.get("key") == "dmg"), None)
                if item is None:
                    raise ValueError(f"{effect_id}: missing dmg blackboard")
                values.append(float(item["value"]))
            result.append(
                "\n".join(
                    [
                        "{",
                        f"  key: {ts_inline_literal(key)},",
                        f"  levels: {len(entries)},",
                        "  modifiers: [",
                        "    {",
                        "      kind: 'addConditionalDamage',",
                        "      condition: { kind: 'targetStaggered', target: 'enemy' },",
                        f"      values: {ts_inline_literal(values)},",
                        "    },",
                        "  ],",
                        "}",
                    ]
                )
            )
        elif kind == "unmodeledMultiTarget":
            if len(entries) != 1:
                raise ValueError(f"talent {key}: expected one source level")
            effect = table_row(effects, entries[0][1], "PotentialTalentEffectTable")
            data = require_list(effect.get("dataList"), f"{entries[0][1]}.dataList")
            modifier = require_dict(require_dict(data[0], "dataList[0]").get("skillBbModifier"), "skillBbModifier")
            if (
                modifier.get("skillId") != skill_id_by_key(skills, "comboSkill")
                or modifier.get("bbKey") != "talent2"
                or float(modifier.get("floatValue", 0)) != 1
            ):
                raise ValueError(f"talent {key}: unexpected multi-target modifier source")
            result.append(
                "\n".join(
                    [
                        "{",
                        f"  key: {ts_inline_literal(key)},",
                        "  levels: 1,",
                        "  modifiers: [],",
                        "}",
                    ]
                )
            )
        else:
            raise ValueError(f"talent {key}: unsupported compiler {kind!r}")
    return result


def render_potentials(
    operator: dict[str, Any],
    skills: list[SkillSource],
    potential_table: dict[str, Any],
    effects: dict[str, Any],
) -> list[str]:
    char_id = str(operator["charId"])
    source = table_row(potential_table, char_id, "CharacterPotentialTable")
    unlocks = require_list(source.get("potentialUnlockBundle"), f"CharacterPotentialTable.{char_id}")
    configs = require_list(operator.get("potentials"), f"{operator['slug']}.potentials")
    if len(unlocks) != len(configs):
        raise ValueError(f"{char_id}: potential config count does not match source")
    result: list[str] = []
    combo_skill_id = skill_id_by_key(skills, "comboSkill")
    ultimate_skill_id = skill_id_by_key(skills, "ultimate")
    for raw_unlock, raw_config in zip(unlocks, configs, strict=True):
        unlock = require_dict(raw_unlock, f"{char_id}.potentialUnlockBundle[]")
        config = require_dict(raw_config, f"{operator['slug']}.potentials[]")
        effect_id = str(unlock["potentialEffectId"])
        effect = table_row(effects, effect_id, "PotentialTalentEffectTable")
        data_list = require_list(effect.get("dataList"), f"{effect_id}.dataList")
        if len(data_list) != 1:
            raise ValueError(f"{effect_id}: expected one effect entry")
        data = require_dict(data_list[0], f"{effect_id}.dataList[0]")
        key = str(config["key"])
        kind = config.get("compile")
        if kind in {"multiplyReactionDuration", "setReactionEffectiveness", "addUltimateCriticalRate"}:
            modifier = require_dict(data.get("skillBbModifier"), f"{effect_id}.skillBbModifier")
            value = float(modifier["floatValue"])
            if kind == "multiplyReactionDuration":
                if modifier.get("skillId") != combo_skill_id or modifier.get("bbKey") != "duration":
                    raise ValueError(f"{effect_id}: unexpected reaction duration modifier target")
                body = "\n".join(
                    [
                        "  modifiers: [",
                        "    {",
                        "      kind: 'multiplyEffectDuration',",
                        "      skillGroupKey: 'comboSkill',",
                        "      stepKey: 'comboSkill.electrification',",
                        f"      multiplier: {ts_inline_literal(value)},",
                        "    },",
                        "  ],",
                    ]
                )
            elif kind == "setReactionEffectiveness":
                if modifier.get("skillId") != combo_skill_id or modifier.get("bbKey") != "extra_scaling":
                    raise ValueError(f"{effect_id}: unexpected reaction effectiveness modifier target")
                body = "\n".join(
                    [
                        "  modifiers: [",
                        "    {",
                        "      kind: 'setEffectiveness',",
                        "      skillGroupKey: 'comboSkill',",
                        "      stepKey: 'comboSkill.electrification',",
                        f"      value: {ts_inline_literal(value)},",
                        "    },",
                        "  ],",
                    ]
                )
            else:
                if modifier.get("skillId") != ultimate_skill_id or modifier.get("bbKey") != "crit":
                    raise ValueError(f"{effect_id}: unexpected ultimate critical-rate modifier target")
                body = "\n".join(
                    [
                        "  modifiers: [",
                        "    {",
                        "      kind: 'addSkillStat',",
                        "      skillGroupKey: 'ultimate',",
                        "      stat: 'criticalRate',",
                        f"      value: {ts_inline_literal(value)},",
                        "    },",
                        "  ],",
                    ]
                )
        elif kind == "multiplyUltimateCost":
            modifier = require_dict(data.get("skillParamModifier"), f"{effect_id}.skillParamModifier")
            if modifier.get("skillId") != ultimate_skill_id or modifier.get("paramType") != 1:
                raise ValueError(f"{effect_id}: unexpected ultimate cost modifier target")
            value = float(modifier["paramValue"])
            body = "\n".join(
                [
                    "  modifiers: [",
                    "    {",
                    "      kind: 'multiplySkillCost',",
                    "      skillGroupKey: 'ultimate',",
                    "      resource: 'ultimateEnergy',",
                    f"      multiplier: {ts_inline_literal(value)},",
                    "    },",
                    "  ],",
                ]
            )
        elif kind == "attackAfterReaction":
            attach = require_dict(data.get("attachBuff"), f"{effect_id}.attachBuff")
            values = {str(item["key"]): float(item["value"]) for item in require_list(attach.get("blackboard"), "attachBuff.blackboard")}
            buff_id = attach.get("buffId")
            if not isinstance(buff_id, str) or not buff_id or set(values) != {"atk_up", "atk_duration", "max_stack"}:
                raise ValueError(f"{effect_id}: unexpected reaction attack buff shape")
            body = "\n".join(
                [
                    "  eventHandlers: [",
                    "    {",
                    "      event: { kind: 'reactionApplied', reaction: 'electrification' },",
                    "      sequence: sequence(",
                    "        step('applyStatus', {",
                    "          statusKey: 'attackAfterElectrification',",
                    "          target: 'caster',",
                    f"          durationFrames: {ts_inline_literal(values['atk_duration'] * 30)},",
                    f"          maxStacks: {ts_inline_literal(values['max_stack'])},",
                    "          modifiers: [",
                    f"            {{ kind: 'attackPercent', value: {ts_inline_literal(values['atk_up'])} }},",
                    "          ],",
                    "        }),",
                    "      ),",
                    "    },",
                    "  ],",
                ]
            )
        else:
            raise ValueError(f"potential {key}: unsupported compiler {kind!r}")
        result.append(
            "\n".join(
                [
                    "{",
                    f"  key: {ts_inline_literal(key)},",
                    "  levels: 1,",
                    body,
                    "}",
                ]
            )
        )
    return result


def render_operator_definition(
    operator: dict[str, Any],
    skills: list[SkillSource],
    character_table: dict[str, Any],
    growth_table: dict[str, Any],
    potential_table: dict[str, Any],
    effects: dict[str, Any],
) -> str:
    char_id = str(operator["charId"])
    character = table_row(character_table, char_id, "CharacterTable")
    growth = table_row(growth_table, char_id, "CharGrowthTable")
    attributes = parse_panel_attributes(character, f"CharacterTable.{char_id}")
    weapon_type = WEAPON_TYPE_MAP.get(character.get("weaponType"))
    element = ELEMENT_TYPE_MAP.get(character.get("charTypeId"))
    role = PROFESSION_MAP.get(character.get("profession"))
    main_attribute = ATTRIBUTE_TYPE_MAP.get(character.get("mainAttrType"))
    secondary_attribute = ATTRIBUTE_TYPE_MAP.get(character.get("subAttrType"))
    if None in {weapon_type, element, role, main_attribute, secondary_attribute}:
        raise ValueError(f"{char_id}: unsupported operator metadata enum")
    identifier = typescript_identifier(str(operator["slug"]))
    operator_export_name = f"{identifier}GeneratedOperator"
    skill_entries, damage_type_factories = compile_skill_entries(operator, skills)
    validate_skill_groups(operator, skills, growth, f"CharGrowthTable.{char_id}")
    groups = render_skill_groups(operator, skills)
    talents = render_talents(operator, skills, growth, effects)
    potentials = render_potentials(operator, skills, potential_table, effects)
    attribute_lines = [f"    {key}: {ts_inline_literal(value)}," for key, value in attributes.items()]
    helper_imports = collect_definition_helpers(skill_entries, damage_type_factories)
    return "\n".join(
        [
            "/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */",
            "import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';",
            f"import {{ {helper_imports} }} from '../definitionHelpers';",
            "",
            "// prettier-ignore",
            *render_named_skills(operator, skill_entries),
            f"export const {operator_export_name}: OperatorDefinition = {{",
            f"  slug: {ts_inline_literal(operator['slug'])},",
            f"  gameId: {ts_inline_literal(str(character['engName']).upper())},",
            f"  rarity: {require_non_negative_int(character.get('rarity'), f'{char_id}.rarity')},",
            f"  weaponType: {ts_inline_literal(weapon_type)},",
            f"  element: {ts_inline_literal(element)},",
            f"  role: {ts_inline_literal(role)},",
            f"  mainAttribute: {ts_inline_literal(main_attribute)},",
            f"  secondaryAttribute: {ts_inline_literal(secondary_attribute)},",
            "  attributes: {",
            *attribute_lines,
            "  },",
            "  skillGroups: [",
            *(f"    {group}," for group in groups),
            "  ],",
            "  talents: [",
            *(textwrap.indent(talent, "    ") + "," for talent in talents),
            "  ],",
            "  potentials: [",
            *(textwrap.indent(potential, "    ") + "," for potential in potentials),
            "  ],",
            "};",
            "",
        ]
    )
def render_report(
    slug: str,
    skills: list[SkillSource],
    buff_definitions: tuple[BuffDefinitionSource, ...],
) -> str:
    report = {
        "operator": slug,
        "complete": all(
            not skill.unresolvedCombatActions
            and not skill.blackboardKeys
            and not skill.conditionalActions
            for skill in skills
        ),
        "buffDefinitions": [
            serialize_audit_value(definition) for definition in buff_definitions
        ],
        "skills": [
            {
                "key": skill.key,
                "skillId": skill.skillId,
                "sourceFile": skill.sourceFile,
                "timelineBlockFrames": skill.timelineBlockFrames,
                "blockBoundarySource": skill.blockBoundarySource,
                "directDamageHits": [asdict(hit) for hit in skill.directDamageHits],
                "conditionalActions": [
                    serialize_audit_value(action) for action in skill.conditionalActions
                ],
                "auxiliaryActions": [
                    serialize_audit_value(action) for action in skill.auxiliaryActions
                ],
                "blackboardCalculations": [
                    asdict(calculation) for calculation in skill.blackboardCalculations
                ],
                "blackboardMutations": [
                    asdict(mutation) for mutation in skill.blackboardMutations
                ],
                "buffBlackboardReads": [asdict(read) for read in skill.buffBlackboardReads],
                "buffFinishes": [asdict(finish) for finish in skill.buffFinishes],
                "buffHolds": [asdict(hold) for hold in skill.buffHolds],
                "resourceGains": [asdict(gain) for gain in skill.resourceGains],
                "projectileLaunches": [asdict(launch) for launch in skill.projectileLaunches],
                "projectileTriggeredSkills": [
                    omit_empty_execution_frames(hit) for hit in skill.projectileTriggeredSkills
                ],
                "abilityEntityHits": [
                    omit_empty_execution_frames(hit) for hit in skill.abilityEntityHits
                ],
                "referencedBuffIds": skill.referencedBuffIds,
                "resolvedDamageHits": [asdict(hit) for hit in collect_resolved_damage_hits(skill)],
                "resolvedSchedule": [
                    {
                        "frame": item.frame,
                        "actionOrder": item.actionOrder,
                        "itemType": item.itemType,
                        "sourcePath": item.sourcePath,
                    }
                    for item in collect_resolved_schedule(skill)
                ],
                "blackboardKeys": skill.blackboardKeys,
                "blackboardProvenance": [
                    asdict(provenance) for provenance in skill.blackboardProvenance
                ],
                "targetGroupWrites": [
                    asdict(write) for write in skill.targetGroupWrites
                ],
                "unresolvedCombatActions": skill.unresolvedCombatActions,
            }
            for skill in skills
        ],
    }
    return json.dumps(report, ensure_ascii=False, indent=2) + "\n"


def write_or_check(path: Path, content: str, check: bool) -> None:
    if check:
        current = path.read_text(encoding="utf-8") if path.is_file() else None
        if current != content:
            raise RuntimeError(f"generated output is stale: {path}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")


def remove_obsolete_generated_file(path: Path, check: bool) -> None:
    """删除已被统一产物取代的旧文件；检查模式下把残留视为过期。"""
    if not path.exists():
        return
    if check:
        raise RuntimeError(f"obsolete generated output still exists: {path}")
    path.unlink()


def main() -> None:
    args = parse_args()
    manifest = require_dict(json.loads(args.manifest.read_text(encoding="utf-8")), str(args.manifest))
    patch_path = args.tables / "SkillPatchTable.json"
    patch_table = require_dict(json.loads(patch_path.read_text(encoding="utf-8")), str(patch_path))
    table_names = (
        "CharacterTable.json",
        "CharGrowthTable.json",
        "CharacterPotentialTable.json",
        "PotentialTalentEffectTable.json",
    )
    loaded_tables = {
        name: require_dict(
            json.loads((args.tables / name).read_text(encoding="utf-8")),
            str(args.tables / name),
        )
        for name in table_names
    }
    selected = set(args.operators or [])
    generated = 0
    for raw_operator in require_list(manifest.get("operators"), "operators"):
        operator = require_dict(raw_operator, "operators[]")
        slug = str(operator["slug"])
        if selected and slug not in selected:
            continue
        skills = [
            parse_skill(require_dict(entry, f"{slug}.skills[]"), args.source, patch_table)
            for entry in require_list(operator["skills"], f"{slug}.skills")
        ]
        buff_definitions = resolve_operator_buff_definitions(
            skills,
            args.source.parent / "BuffData",
        )
        write_or_check(
            args.output / f"{slug}.generated.ts",
            render_typescript(str(operator["exportName"]), slug, skills, buff_definitions),
            args.check,
        )
        write_or_check(
            args.output / f"{slug}.audit.json",
            render_report(slug, skills, buff_definitions),
            args.check,
        )
        output_stage = operator.get("outputStage", "complete")
        if output_stage == "audit":
            write_or_check(
                args.output / f"{slug}.skills.audit.generated.ts",
                render_compiled_skills(operator, skills),
                args.check,
            )
            generated += 1
            print(f"[{slug}] audited {len(skills)} skills -> {args.output}")
            continue
        if output_stage != "complete":
            raise ValueError(f"{slug}.outputStage: expected 'audit' or 'complete'")
        remove_obsolete_generated_file(args.output / f"{slug}.skills.generated.ts", args.check)
        write_or_check(
            args.output / f"{slug}.operator.generated.ts",
            render_operator_definition(
                operator,
                skills,
                loaded_tables["CharacterTable.json"],
                loaded_tables["CharGrowthTable.json"],
                loaded_tables["CharacterPotentialTable.json"],
                loaded_tables["PotentialTalentEffectTable.json"],
            ),
            args.check,
        )
        print(f"[{slug}] generated {len(skills)} skills -> {args.output}")
        generated += 1
    if selected and generated != len(selected):
        missing = selected.difference(
            str(item.get("slug")) for item in require_list(manifest.get("operators"), "operators") if isinstance(item, dict)
        )
        raise ValueError(f"unknown operators: {', '.join(sorted(missing))}")


if __name__ == "__main__":
    main()
