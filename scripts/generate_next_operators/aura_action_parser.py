"""严格解析技能时间线与 Buff 事件中的 Aura 来源事实。"""

from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Any, Callable, Literal, cast

from action_kinds import AUDITED_COMBAT_ACTION_NAMES
from action_payload_parser import (
    parse_buff_application_entries,
    parse_buff_application_payload,
    parse_buff_finish_payload,
    parse_scalar,
)
from source_models import (
    AirborneOutputSource,
    AuraActionSource,
    AuraShapeSource,
    AuraTargetFilterSource,
)
from source_schema import (
    AIRBORNE_ACTION_FIELDS,
    AURA_ACTION_FIELDS,
    AURA_SEQUENCE_FIELDS,
    AURA_SHAPE_FIELDS,
    AURA_TARGET_FILTER_FIELDS,
)
from source_utils import (
    action_name,
    parse_vector3,
    require_bool,
    require_dict,
    require_list,
    require_non_negative_int,
    require_number,
    require_server_action_index,
)
from target_parser import parse_target_reference


@dataclass(frozen=True)
class AuraActionParserServices:
    """由入口注入共享动作树遍历，避免复制容器透明性规则。"""

    walk_actions: Callable[..., Any]


def parse_aura_actions(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
    *,
    services: AuraActionParserServices,
) -> tuple[AuraActionSource, ...]:
    """严格读取区域动作；当前只形成审计事实，不提前近似其持续生命周期。"""
    walk_actions = services.walk_actions
    aura_type_warning = "光环范围过大，每帧检测物理碰撞开销较大，建议使用全局光环"
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[AuraActionSource] = []

    def parse_sequence(
        value: Any, path: str
    ) -> tuple[dict[str, Any], tuple[str, ...], tuple[dict[str, Any], ...]]:
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
        enabled = tuple(action for action in actions if action.get("isEnable") is not False)
        return sequence, tuple(
            action_name(str(action["$type"]))
            for action in enabled
        ), enabled

    def parse_airborne_output(action: dict[str, Any], path: str) -> AirborneOutputSource:
        if set(action) != AIRBORNE_ACTION_FIELDS:
            raise ValueError(f"{path}: unexpected AirborneAction fields {sorted(action)}")
        priority_level = action.get("priorityLevel")
        priority_offset = action.get("priorityOffset")
        if not isinstance(priority_level, str) or not priority_level:
            raise ValueError(f"{path}.priorityLevel: expected non-empty string")
        if not isinstance(priority_offset, int) or isinstance(priority_offset, bool):
            raise ValueError(f"{path}.priorityOffset: expected integer")
        face_direction = require_dict(action.get("faceDirection"), f"{path}.faceDirection")
        direction_type = face_direction.get("directionType")
        if not isinstance(direction_type, str) or not direction_type:
            raise ValueError(f"{path}.faceDirection.directionType: expected non-empty string")
        # airborneEffect is presentation-only in Endaxis, but its container must still exist.
        require_dict(action.get("airborneEffect"), f"{path}.airborneEffect")
        dead_option = action.get("deadOption")
        return_true_when = action.get("returnTrueWhen")
        for key, item in (("deadOption", dead_option), ("returnTrueWhen", return_true_when)):
            if not isinstance(item, str) or not item:
                raise ValueError(f"{path}.{key}: expected non-empty string")
        return AirborneOutputSource(
            actionIndex=require_server_action_index(action, path),
            source=parse_target_reference(action.get("source"), f"{path}.source"),
            target=parse_target_reference(action.get("target"), f"{path}.target"),
            forceAirborne=require_bool(action.get("forceAirborne"), f"{path}.forceAirborne"),
            floatingDuration=parse_scalar(
                action.get("floatingDuration"), f"{path}.floatingDuration", inherited_blackboard
            ),
            floatingHeight=parse_scalar(
                action.get("floatingHeight"), f"{path}.floatingHeight", inherited_blackboard
            ),
            speedFactorMultiplier=require_number(
                action.get("speedFactorMultiplier"), f"{path}.speedFactorMultiplier"
            ),
            faceDirectionType=direction_type,
            immobilizedTime=require_number(
                action.get("immobilizedTime"), f"{path}.immobilizedTime"
            ),
            isExtra=require_bool(action.get("isExtra"), f"{path}.isExtra"),
            deadOption=dead_option,
            returnTrueWhen=return_true_when,
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
            action_fields = set(value)
            if action_fields not in (
                AURA_ACTION_FIELDS,
                AURA_ACTION_FIELDS | {"m_auraTypeWarning"},
            ):
                raise ValueError(f"{action_path}: unexpected fields {sorted(value)}")
            if (
                "m_auraTypeWarning" in value
                and value["m_auraTypeWarning"] != aura_type_warning
            ):
                raise ValueError(
                    f"{action_path}.m_auraTypeWarning: unexpected editor warning"
                )

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
            if (
                not isinstance(object_type, (str, int))
                or isinstance(object_type, bool)
                or (isinstance(object_type, str) and not object_type)
            ):
                raise ValueError(
                    f"{filter_path}.objectType: expected ObjectType name or signed integer mask"
                )
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
            icon_fields = {"durationSourceType", "timedMarkerId"}
            icon_editor_fields = {
                "m_abilityEntityTypeInfo",
                "m_timedMarkerInfo",
            }
            if set(icon_duration) not in (
                icon_fields,
                icon_fields | icon_editor_fields,
            ):
                raise ValueError(f"{icon_path}: unexpected fields {sorted(icon_duration)}")
            expected_icon_editor_info = {
                "m_abilityEntityTypeInfo": (
                    "当ActionOwner是AbilityEntity时，Buff图标倒计时显示Owner的剩余时间"
                ),
                "m_timedMarkerInfo": (
                    "选择ActionOwner身上的一个TimedMarker作为Buff图标倒计时显示的来源"
                ),
            }
            for key, expected in expected_icon_editor_info.items():
                if key in icon_duration and icon_duration[key] != expected:
                    raise ValueError(f"{icon_path}.{key}: unexpected editor info")
            duration_source_type = icon_duration.get("durationSourceType")
            timed_marker_id = icon_duration.get("timedMarkerId")
            if not isinstance(duration_source_type, str) or not duration_source_type:
                raise ValueError(f"{icon_path}.durationSourceType: expected non-empty string")
            if not isinstance(timed_marker_id, str):
                raise ValueError(f"{icon_path}.timedMarkerId: expected string")

            in_sequence, in_types, in_actions = parse_sequence(
                value.get("actionInAura"), f"{action_path}.actionInAura"
            )
            exit_sequence, exit_types, _exit_actions = parse_sequence(
                value.get("actionWhenExitAura"), f"{action_path}.actionWhenExitAura"
            )
            airborne_outputs = tuple(
                parse_airborne_output(
                    action, f"{action_path}.actionInAura.actionData[{index}]"
                )
                for index, action in enumerate(in_actions)
                if action_name(str(action["$type"])) == "AirborneAction"
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
                    airborneOutputs=airborne_outputs,
                    actionInAuraBuffFinishes=tuple(
                        parse_buff_finish_payload(
                            action,
                            f"{action_path}.actionInAura.actionData[{index}]",
                            inherited_blackboard,
                        )
                        for index, action in enumerate(in_actions)
                        if action_name(str(action["$type"])) == "FinishBuffAdvanced"
                    ),
                    actionWhenExitAuraBuffApplications=tuple(
                        parse_buff_application_payload(
                            action,
                            f"{action_path}.actionWhenExitAura.actionData[{index}]",
                            inherited_blackboard,
                        )
                        for index, action in enumerate(_exit_actions)
                        if action_name(str(action["$type"])) == "CreateBuffAction"
                    ),
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
    *,
    services: AuraActionParserServices,
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
                    synthetic_root,
                    source_name,
                    inherited_blackboard,
                    services=services,
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
