"""严格解析目标组 Finder、Merge 与选择器身份来源事实。"""

from __future__ import annotations

from dataclasses import replace
from typing import Any

from source_models import TargetGroupInputSource, TargetGroupWriteSource, TargetReferenceSource
from source_schema import (
    TARGET_GROUP_FIND_ACTION_FIELDS,
    TARGET_GROUP_MERGE_ACTION_FIELDS,
    TARGET_GROUP_MERGE_INPUT_FIELDS,
    TARGET_GROUP_PICK_ACTION_FIELDS,
)
from source_utils import (
    action_name,
    require_bool,
    require_dict,
    require_list,
    require_non_negative_int,
    require_server_action_index,
)
from target_parser import (
    parse_character_team_selection_role,
    parse_target_reference,
    parse_selector_summary,
    parse_spawned_entity_selector_identity,
    selector_component_name,
)


def selector_excludes_plain_current_target(value: Any, path: str) -> bool:
    """识别选择器明确排除当前输入 Target 的过滤器。"""
    selector = require_dict(value, path)
    for index, raw_processor in enumerate(
        require_list(selector.get("postProcessorData"), f"{path}.postProcessorData")
    ):
        processor_path = f"{path}.postProcessorData[{index}]"
        processor = require_dict(raw_processor, processor_path)
        if selector_component_name(processor, processor_path) != "ExcludeTarget":
            continue
        if set(processor) != {"$type", "excludedTargetSettings"}:
            raise ValueError(f"{processor_path}: unexpected ExcludeTarget fields")
        excluded = parse_target_reference(
            processor.get("excludedTargetSettings"),
            f"{processor_path}.excludedTargetSettings",
        )
        if (
            excluded.targetSource == "Target"
            and not excluded.targetGroupKey
            and excluded.finderType is None
            and not excluded.validatorTypes
            and not excluded.postProcessorTypes
        ):
            return True
    return False


def selector_excludes_plain_owner(value: Any, path: str) -> bool:
    """识别 ExcludeTarget 明确排除当前动作 owner 的形状。"""
    selector = require_dict(value, path)
    for index, raw_processor in enumerate(
        require_list(selector.get("postProcessorData"), f"{path}.postProcessorData")
    ):
        processor_path = f"{path}.postProcessorData[{index}]"
        processor = require_dict(raw_processor, processor_path)
        if selector_component_name(processor, processor_path) != "ExcludeTarget":
            continue
        excluded = parse_target_reference(
            processor.get("excludedTargetSettings"),
            f"{processor_path}.excludedTargetSettings",
        )
        if (
            excluded.targetSource == "Owner"
            and not excluded.targetGroupKey
            and excluded.finderType is None
            and not excluded.validatorTypes
            and not excluded.postProcessorTypes
        ):
            return True
    return False


def smart_target_falls_back_to_main_target(value: Any, path: str) -> bool:
    """保存 SelectByTag finder 在无评分候选时无距离限制回退主目标的证据。"""
    selector = require_dict(value, path)
    finder = require_dict(selector.get("finderData"), f"{path}.finderData")
    if selector_component_name(finder, f"{path}.finderData") != "SmartTargetFinder":
        return False
    setting = require_dict(finder.get("selectSetting"), f"{path}.finderData.selectSetting")
    return (
        setting.get("smartTargetSelectStrategy") == "SelectByTag"
        and finder.get("limitFallbackRange") is False
    )


def distance_validators_pass_at_zero(value: Any, path: str) -> bool:
    """确认所有 DistanceValidator 在项目的零距离投影下均通过。"""
    selector = require_dict(value, path)
    validators = require_list(selector.get("validatorData"), f"{path}.validatorData")
    if not validators:
        return False
    for index, raw_validator in enumerate(validators):
        validator_path = f"{path}.validatorData[{index}]"
        validator = require_dict(raw_validator, validator_path)
        if selector_component_name(validator, validator_path) != "DistanceValidator":
            return False
        scalar = require_dict(validator.get("value"), f"{validator_path}.value")
        if scalar.get("useBlackboardKey") is not False:
            return False
        threshold = scalar.get("value")
        comparison = validator.get("compareType")
        if not isinstance(threshold, (int, float)) or isinstance(threshold, bool):
            return False
        if comparison not in ({"LT", "LE"} if threshold > 0 else {"LE"} if threshold == 0 else set()):
            return False
    return True


def priority_filter_max_targets(value: Any, path: str) -> int | None:
    """读取唯一 PriorityFilter 的显式最大保留数量。"""
    selector = require_dict(value, path)
    filters = []
    for index, raw_processor in enumerate(
        require_list(selector.get("postProcessorData"), f"{path}.postProcessorData")
    ):
        processor_path = f"{path}.postProcessorData[{index}]"
        processor = require_dict(raw_processor, processor_path)
        if selector_component_name(processor, processor_path) == "PriorityFilter":
            filters.append((processor, processor_path))
    if len(filters) != 1:
        return None
    processor, processor_path = filters[0]
    if processor.get("limitMaxNum") is not True:
        return None
    return require_non_negative_int(processor.get("maxNum"), f"{processor_path}.maxNum")


def parse_circular_order_sort(
    value: Any,
    path: str,
) -> tuple[str, int, float, float, float, TargetReferenceSource] | None:
    """严格读取已由 1.4.4 机器码闭环的 CircularOrderSort 载荷。"""
    selector = require_dict(value, path)
    matches: list[tuple[dict[str, Any], str]] = []
    for index, raw_processor in enumerate(
        require_list(selector.get("postProcessorData"), f"{path}.postProcessorData")
    ):
        processor_path = f"{path}.postProcessorData[{index}]"
        processor = require_dict(raw_processor, processor_path)
        if selector_component_name(processor, processor_path) == "CircularOrderSort":
            matches.append((processor, processor_path))
    if not matches:
        return None
    if len(matches) != 1:
        raise ValueError(f"{path}.postProcessorData: expected one CircularOrderSort")
    processor, processor_path = matches[0]
    if set(processor) != {
        "$type", "indexKey", "heightOffset", "rangeCheckTarget",
        "rangeThreshold", "reverseFlag", "desireCount",
    }:
        raise ValueError(f"{processor_path}: unexpected CircularOrderSort fields")

    index_key = processor.get("indexKey")
    if not isinstance(index_key, str) or not index_key:
        raise ValueError(f"{processor_path}.indexKey: expected non-empty string")

    def constant_number(field: str) -> float:
        scalar_path = f"{processor_path}.{field}"
        scalar = require_dict(processor.get(field), scalar_path)
        if set(scalar) != {"useBlackboardKey", "value", "blackboardKey"}:
            raise ValueError(f"{scalar_path}: unexpected scalar fields")
        if scalar.get("useBlackboardKey") is not False or scalar.get("blackboardKey") != "":
            raise ValueError(f"{scalar_path}: blackboard scalar is not yet supported")
        result = scalar.get("value")
        if not isinstance(result, (int, float)) or isinstance(result, bool):
            raise ValueError(f"{scalar_path}.value: expected number")
        return float(result)

    desired = constant_number("desireCount")
    if not desired.is_integer() or desired <= 0:
        raise ValueError(f"{processor_path}.desireCount.value: expected positive integer")
    return (
        index_key,
        int(desired),
        constant_number("reverseFlag"),
        constant_number("heightOffset"),
        constant_number("rangeThreshold"),
        parse_target_reference(
            processor.get("rangeCheckTarget"),
            f"{processor_path}.rangeCheckTarget",
        ),
    )


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
                if not isinstance(child, dict) or child.get("isEnable") is False:
                    continue
                if action_name(str(child.get("$type", ""))) != "CheckEntityNum":
                    continue
                store_key = child.get("storeKey")
                target = child.get("checkTarget")
                if (
                    not isinstance(store_key, str)
                    or not store_key
                    or not isinstance(target, dict)
                ):
                    continue
                target_group_key = target.get("targetGroupKey")
                if (
                    target.get("targetSource") != "Context"
                    or not isinstance(target_group_key, str)
                    or not target_group_key
                ):
                    continue
                check_index = require_server_action_index(
                    child, f"{source_name}.{'.'.join((*path, f'[{index}]'))}"
                )
                candidates = [
                    (result_index, write)
                    for result_index, write in enumerate(result)
                    if write.startFrame == start_frame
                    and write.endFrame == end_frame
                    and write.targetGroupKey == target_group_key
                    and write.actionIndex < check_index
                    and write.actionPath[:-1] == path
                ]
                if candidates:
                    result_index, write = max(candidates, key=lambda item: item[1].actionIndex)
                    result[result_index] = replace(
                        write, saveCountToBlackboardKey=store_key
                    )
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
            spawned_object_type, validator_tag_queries = (
                parse_spawned_entity_selector_identity(
                    value.get("selectorData"),
                    f"{source_name}.{'.'.join(path)}.selectorData",
                )
            )
            circular_order = parse_circular_order_sort(
                value.get("selectorData"),
                f"{source_name}.{'.'.join(path)}.selectorData",
            )
            finder_data = require_dict(
                require_dict(
                    value.get("selectorData"),
                    f"{source_name}.{'.'.join(path)}.selectorData",
                ).get("finderData"),
                f"{source_name}.{'.'.join(path)}.selectorData.finderData",
            )
            fixed_point_snap_to_navmesh = (
                require_bool(
                    finder_data.get("snapToNavmesh"),
                    f"{source_name}.{'.'.join(path)}.selectorData.finderData.snapToNavmesh",
                )
                if finder == "FixedPointFinder"
                else None
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
                    characterTeamSelectionRole=parse_character_team_selection_role(
                        value.get("selectorData"),
                        f"{source_name}.{'.'.join(path)}.selectorData",
                    ),
                    excludesCurrentTarget=selector_excludes_plain_current_target(
                        value.get("selectorData"),
                        f"{source_name}.{'.'.join(path)}.selectorData",
                    ),
                    excludesOwner=selector_excludes_plain_owner(
                        value.get("selectorData"),
                        f"{source_name}.{'.'.join(path)}.selectorData",
                    ),
                    smartTargetFallsBackToMainTarget=smart_target_falls_back_to_main_target(
                        value.get("selectorData"),
                        f"{source_name}.{'.'.join(path)}.selectorData",
                    ),
                    distanceValidatorsPassAtZero=distance_validators_pass_at_zero(
                        value.get("selectorData"),
                        f"{source_name}.{'.'.join(path)}.selectorData",
                    ),
                    priorityFilterMaxTargets=priority_filter_max_targets(
                        value.get("selectorData"),
                        f"{source_name}.{'.'.join(path)}.selectorData",
                    ),
                    circularOrderIndexKey=(
                        None if circular_order is None else circular_order[0]
                    ),
                    circularOrderDesiredCount=(
                        None if circular_order is None else circular_order[1]
                    ),
                    circularOrderReverseFlag=(
                        None if circular_order is None else circular_order[2]
                    ),
                    circularOrderHeightOffset=(
                        None if circular_order is None else circular_order[3]
                    ),
                    circularOrderRangeThreshold=(
                        None if circular_order is None else circular_order[4]
                    ),
                    circularOrderRangeCheckTarget=(
                        None if circular_order is None else circular_order[5]
                    ),
                    inputTargets=(),
                    intervalSeconds=interval,
                    finderSpawnedObjectType=spawned_object_type,
                    validatorTagQueries=validator_tag_queries,
                    finderFixedPointSnapToNavmesh=fixed_point_snap_to_navmesh,
                    center=str(value.get("center", "")),
                    centerContextKey=str(value.get("centerContextKey", "")),
                    selectorOwner=str(value.get("selectorOwner", "")),
                    selectorOwnerContextKey=str(
                        value.get("selectorOwnerContextKey", "")
                    ),
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
                spawned_object_type, validator_tag_queries = (
                    parse_spawned_entity_selector_identity(
                        target.get("selectorData"),
                        f"{target_path}.selectorData",
                    )
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
                        finderSpawnedObjectType=spawned_object_type,
                        validatorTagQueries=validator_tag_queries,
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
                    characterTeamSelectionRole=None,
                    inputTargets=tuple(input_targets),
                    intervalSeconds=None,
                )
            )
        elif producer_type == "PickTargetAction":
            if set(value) != TARGET_GROUP_PICK_ACTION_FIELDS:
                raise ValueError(
                    f"{source_name}.{'.'.join(path)}: unexpected fields {sorted(value)}"
                )
            context_key = value.get("contextKey")
            if not isinstance(context_key, str) or not context_key:
                raise ValueError(
                    f"{source_name}.{'.'.join(path)}.contextKey: expected non-empty string"
                )
            target = parse_target_reference(
                value.get("target"), f"{source_name}.{'.'.join(path)}.target"
            )
            index_data = require_dict(
                value.get("index"), f"{source_name}.{'.'.join(path)}.index"
            )
            if set(index_data) != {"useBlackboardKey", "value", "blackboardKey"}:
                raise ValueError(
                    f"{source_name}.{'.'.join(path)}.index: unexpected fields "
                    f"{sorted(index_data)}"
                )
            use_key = require_bool(
                index_data.get("useBlackboardKey"),
                f"{source_name}.{'.'.join(path)}.index.useBlackboardKey",
            )
            raw_index = index_data.get("value")
            index_key = index_data.get("blackboardKey")
            if not isinstance(raw_index, (int, float)) or isinstance(raw_index, bool):
                raise ValueError(f"{source_name}.{'.'.join(path)}.index.value: expected number")
            if not isinstance(index_key, str) or (use_key and not index_key):
                raise ValueError(f"{source_name}.{'.'.join(path)}.index.blackboardKey: invalid key")
            result.append(
                TargetGroupWriteSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        value, f"{source_name}.{'.'.join(path)}"
                    ),
                    actionPath=path,
                    targetGroupKey=context_key,
                    producerType=producer_type,
                    finderType=None,
                    finderFactionTarget=None,
                    finderTargetObjectType=None,
                    finderCheckAlive=None,
                    validatorTypes=(),
                    postProcessorTypes=(),
                    inputTargets=(
                        TargetGroupInputSource(
                            targetSource=target.targetSource,
                            targetGroupKey=target.targetGroupKey,
                            finderType=target.finderType,
                            finderFactionTarget=None,
                            finderTargetObjectType=None,
                            finderCheckAlive=None,
                            validatorTypes=target.validatorTypes,
                            postProcessorTypes=target.postProcessorTypes,
                        ),
                    ),
                    intervalSeconds=None,
                    pickIndexValue=float(raw_index),
                    pickIndexBlackboardKey=index_key if use_key else None,
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
