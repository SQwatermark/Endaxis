"""严格解析目标组 Finder、Merge 与选择器身份来源事实。"""

from __future__ import annotations

from typing import Any

from source_models import TargetGroupInputSource, TargetGroupWriteSource
from source_schema import (
    TARGET_GROUP_FIND_ACTION_FIELDS,
    TARGET_GROUP_MERGE_ACTION_FIELDS,
    TARGET_GROUP_MERGE_INPUT_FIELDS,
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
            spawned_object_type, validator_tag_queries = (
                parse_spawned_entity_selector_identity(
                    value.get("selectorData"),
                    f"{source_name}.{'.'.join(path)}.selectorData",
                )
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
