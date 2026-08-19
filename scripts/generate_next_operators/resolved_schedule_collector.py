"""将根技能及递归子调用图投影为统一的 resolved schedule 来源事实。"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable, cast

from source_models import (
    AbilityEntityHitSource,
    ProjectileTriggeredSkillSource,
    ResolvedDamageHitSource,
    ResolvedScheduleItemSource,
    ResolvedScheduleItemType,
    SkillSource,
)


@dataclass(frozen=True)
class ResolvedScheduleCollectorServices:
    """由入口注入项目证明与值域过滤，不在收集器内解释编译策略。"""

    conditional_action_contains_keyword: Callable[..., Any]
    filter_once_resource_gains: Callable[..., Any]
    logical_ability_entity_spawn_payload_for_compile: Callable[..., Any]
    resource_gain_can_change_value: Callable[..., Any]


def native_sequence_order(
    action: Any,
    parent_action_order: tuple[int, ...],
    path: str,
) -> tuple[int, ...]:
    """读取解析时保留的原生 Sequence；旧测试夹具按动作序号保持原行为。"""
    sequence_index = getattr(action, "sequenceIndex", -1)
    if sequence_index == -1:
        sequence_index = action.actionIndex
    if not isinstance(sequence_index, int) or sequence_index < 0:
        raise ValueError(f"{path}: action has invalid native sequence identity")
    return (*parent_action_order, sequence_index)


def native_condition_sequence_order(
    action_path: tuple[str, ...],
    parent_action_order: tuple[int, ...],
    path: str,
    fallback_action_index: int | None = None,
) -> tuple[int, ...]:
    """条件解析器保留了外层 timeline 路径，以它确定 Sequence，避免混用分支数组下标。"""
    for part in action_path:
        if part.startswith("timelineActions[") and part.endswith("]"):
            raw_index = part[len("timelineActions[") : -1]
            if raw_index.isdigit():
                return (*parent_action_order, int(raw_index))
    if fallback_action_index is not None:
        return (*parent_action_order, fallback_action_index)
    raise ValueError(f"{path}: condition has no native timeline sequence path")


def collect_resolved_damage_hits(
    skill: SkillSource,
) -> tuple[ResolvedDamageHitSource, ...]:
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
                    native_sequence_order(
                        hit, (), skill.skillId
                    ),
                )
            )

    for repeated in getattr(skill, "intervalDamageHits", ()):
        for tick_index, tick_frame in enumerate(repeated.tickFrames):
            append(
                ResolvedDamageHitSource(
                    tick_frame,
                    (
                        repeated.actionIndex,
                        tick_index,
                        repeated.damageActionIndex,
                    ),
                    "rootInterval",
                    (skill.skillId,),
                    repeated.damageUnits,
                    native_sequence_order(repeated, (), skill.skillId),
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
                        native_sequence_order(
                            damage, hit.actionOrder, hit.triggerSkillId
                        ),
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
                        native_sequence_order(
                            damage, hit.actionOrder, hit.skillId
                        ),
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
                        native_sequence_order(
                            repeated, hit.actionOrder, hit.skillId
                        ),
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


def collect_resolved_schedule(
    skill: SkillSource,
    *,
    services: ResolvedScheduleCollectorServices,
) -> tuple[ResolvedScheduleItemSource, ...]:
    """归并根技能中的伤害、Buff 施加与条件根，不展开条件分支内部的局部顺序。"""
    filter_once_resource_gains = services.filter_once_resource_gains
    logical_ability_entity_spawn_payload_for_compile = (
        services.logical_ability_entity_spawn_payload_for_compile
    )
    resource_gain_can_change_value = services.resource_gain_can_change_value
    result = [
        ResolvedScheduleItemSource(
            frame=hit.frame,
            actionOrder=hit.actionOrder,
            itemType="damage",
            sourcePath=hit.sourcePath,
            payload=hit,
            sequenceOrder=hit.sequenceOrder,
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
            sequenceOrder=native_sequence_order(
                action, (), skill.skillId
            ),
        )
        for action in skill.auxiliaryActions
        if action.actionType == "CreateBuffAction"
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=entity.spawnFrame,
            actionOrder=entity.actionOrder,
            itemType="abilityEntitySpawn",
            sourcePath=(skill.skillId,),
            payload=entity,
            inputTarget="enemy",
            sequenceOrder=entity.actionOrder[:-1],
        )
        for entity in skill.abilityEntityHits
        for payload in (logical_ability_entity_spawn_payload_for_compile(entity, skill),)
        if payload is not None
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=frame,
            actionOrder=(action.actionIndex,),
            itemType="condition",
            sourcePath=action.actionPath,
            payload=action,
            inputTarget="enemy",
            sequenceOrder=native_condition_sequence_order(
                action.actionPath, (), skill.skillId, action.actionIndex
            ),
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
            sequenceOrder=native_sequence_order(
                calculation, (), skill.skillId
            ),
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
                sequenceOrder=native_sequence_order(
                    action, (), skill.skillId
                ),
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
                sequenceOrder=native_sequence_order(
                    gain, (), skill.skillId
                ),
            )
        )
    result.extend(
        ResolvedScheduleItemSource(
            frame=infliction.startFrame,
            actionOrder=(infliction.actionIndex,),
            itemType="infliction",
            sourcePath=(skill.skillId,),
            payload=infliction,
            sequenceOrder=native_sequence_order(
                infliction, (), skill.skillId
            ),
        )
        for infliction in skill.inflictions
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=listener.startFrame,
            actionOrder=(listener.actionIndex,),
            itemType="eventListener",
            sourcePath=(skill.skillId,),
            payload=listener,
            sequenceOrder=native_sequence_order(
                listener, (), skill.skillId
            ),
        )
        for listener in getattr(skill, "eventListeners", ())
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=action.startFrame,
            actionOrder=(action.actionIndex,),
            itemType="timeDilation",
            sourcePath=(skill.skillId,),
            payload=action,
            sequenceOrder=native_sequence_order(
                action, (), skill.skillId
            ),
        )
        for action in getattr(skill, "timeDilations", ())
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=action.startFrame,
            actionOrder=(action.actionIndex,),
            itemType="keywordAction",
            sourcePath=(skill.skillId,),
            payload=action,
            inputTarget="enemy",
            sequenceOrder=native_sequence_order(action, (), skill.skillId),
        )
        for action in getattr(skill, "keywordActions", ())
    )
    for projectile in skill.projectileTriggeredSkills:
        collect_projectile_schedule(projectile, result, services=services)
    for entity in skill.abilityEntityHits:
        collect_ability_entity_schedule(entity, result, services=services)
    return tuple(
        sorted(
            result,
            key=lambda item: (item.frame, item.sequenceOrder, item.actionOrder),
        )
    )


def collect_projectile_schedule(
    hit: ProjectileTriggeredSkillSource,
    result: list[ResolvedScheduleItemSource],
    *,
    services: ResolvedScheduleCollectorServices,
) -> None:
    """把投射物命中子技能的条件与回能换算到根技能帧坐标。"""
    filter_once_resource_gains = services.filter_once_resource_gains
    resource_gain_can_change_value = services.resource_gain_can_change_value
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
            sequenceOrder=native_sequence_order(
                action, hit.actionOrder, hit.triggerSkillId
            ),
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
            sequenceOrder=native_condition_sequence_order(
                condition.actionPath,
                hit.actionOrder,
                hit.triggerSkillId,
                condition.actionIndex,
            ),
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
                sequenceOrder=native_sequence_order(
                    gain, hit.actionOrder, hit.triggerSkillId
                ),
            )
        )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit_frame + infliction.startFrame,
            actionOrder=(*hit.actionOrder, infliction.actionIndex),
            itemType="infliction",
            sourcePath=source_path,
            payload=infliction,
            sequenceOrder=native_sequence_order(
                infliction, hit.actionOrder, hit.triggerSkillId
            ),
        )
        for infliction in getattr(hit, "inflictions", ())
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit_frame + action.startFrame,
            actionOrder=(*hit.actionOrder, action.actionIndex),
            itemType="keywordAction",
            sourcePath=source_path,
            payload=action,
            inputTarget="enemy",
            sequenceOrder=native_sequence_order(
                action, hit.actionOrder, hit.triggerSkillId
            ),
        )
        for action in getattr(hit, "keywordActions", ())
    )
    for nested in hit.nestedProjectileTriggeredSkills:
        collect_projectile_schedule(nested, result, services=services)
    for entity in getattr(hit, "abilityEntityHits", ()):
        collect_ability_entity_schedule(entity, result, services=services)


def collect_ability_entity_schedule(
    hit: AbilityEntityHitSource,
    result: list[ResolvedScheduleItemSource],
    *,
    services: ResolvedScheduleCollectorServices,
) -> None:
    """把能力实体子技能中的非伤害动作换算到根技能帧坐标。"""
    conditional_action_contains_keyword = services.conditional_action_contains_keyword
    filter_once_resource_gains = services.filter_once_resource_gains
    resource_gain_can_change_value = services.resource_gain_can_change_value
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
                sequenceOrder=native_sequence_order(
                    action, hit.actionOrder, hit.skillId
                ),
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
            sequenceOrder=native_condition_sequence_order(
                condition.actionPath, hit.actionOrder, hit.skillId, condition.actionIndex
            ),
            targetGroupWrites=getattr(hit, "localTargetGroupWrites", ()),
        )
        for condition in getattr(hit, "conditionalActions", ())
        for frame in (
            getattr(condition, "executionFrames", ()) or (condition.startFrame,)
        )
        # 两个分支伤害等价时，周期伤害解析器已将其投影为确定伤害；这里不能重复排入。
        if getattr(condition, "executionFrames", ()) not in projected_interval_frames
        if len(getattr(condition, "executionFrames", ())) > 1
        or conditional_action_contains_keyword(condition)
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
                sequenceOrder=native_sequence_order(
                    gain, hit.actionOrder, hit.skillId
                ),
            )
        )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit.spawnFrame + infliction.startFrame,
            actionOrder=(*hit.actionOrder, infliction.actionIndex),
            itemType="infliction",
            sourcePath=source_path,
            payload=infliction,
            sequenceOrder=native_sequence_order(
                infliction, hit.actionOrder, hit.skillId
            ),
        )
        for infliction in getattr(hit, "inflictions", ())
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit.spawnFrame + action.startFrame,
            actionOrder=(*hit.actionOrder, action.actionIndex),
            itemType="keywordAction",
            sourcePath=source_path,
            payload=action,
            inputTarget="enemy",
            sequenceOrder=native_sequence_order(
                action, hit.actionOrder, hit.skillId
            ),
        )
        for action in getattr(hit, "keywordActions", ())
    )
    for nested in getattr(hit, "nestedAbilityEntityHits", ()):
        collect_ability_entity_schedule(nested, result, services=services)
