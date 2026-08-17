"""严格解析原生关键词动作，保留会影响战斗判断的部分。"""

from __future__ import annotations

from typing import Any, Iterable

from action_payload_parser import parse_scalar
from source_models import TimedKeywordActionSource
from source_utils import (
    action_name,
    require_bool,
    require_dict,
    require_list,
    require_non_negative_int,
    require_server_action_index,
)
from target_parser import parse_target_reference

__all__ = ["parse_timed_keyword_actions"]


SLOW_ACTION_FIELDS = {
    "$type",
    "isEnable",
    "priorityLevel",
    "priorityOffset",
    "serverActionIndex",
    "source",
    "target",
    "duration",
    "rate",
    "overrideChildBuffId",
    "childBuffId",
    "asChildBuff",
    "enhancingList",
    "autoFinishByAction",
}


def _validate_inactive_child_buff_id(value: Any, path: str) -> None:
    source = require_dict(value, path)
    if set(source) != {"useBlackboardKey", "value", "blackboardKey"}:
        raise ValueError(f"{path}: unexpected fields {sorted(source)}")
    if require_bool(source.get("useBlackboardKey"), f"{path}.useBlackboardKey"):
        raise ValueError(f"{path}: dynamic child Buff ids are not supported")
    if source.get("value") != "" or source.get("blackboardKey") != "":
        raise ValueError(f"{path}: inactive child Buff id must be empty")


def _walk_unconditional_actions(value: Any) -> Iterable[dict[str, Any]]:
    """只展开动作列表容器，不进入某个动作自身的条件或响应子树。"""
    if isinstance(value, dict):
        if isinstance(value.get("$type"), str):
            yield value
            return
        for child in value.values():
            yield from _walk_unconditional_actions(child)
    elif isinstance(value, list):
        for child in value:
            yield from _walk_unconditional_actions(child)


def parse_timed_keyword_actions(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[TimedKeywordActionSource, ...]:
    """解析根时间轴中直接执行的关键词动作；条件分支由条件编译器单独负责。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedKeywordActionSource] = []
    timelines = require_list(
        group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions"
    )
    for timeline_index, raw_timeline in enumerate(timelines):
        path = f"{source_name}.timelineActions[{timeline_index}]"
        timeline = require_dict(raw_timeline, path)
        start_frame = require_non_negative_int(timeline.get("_startFrame"), f"{path}._startFrame")
        end_frame = require_non_negative_int(timeline.get("_endFrame"), f"{path}._endFrame")
        for raw_action in _walk_unconditional_actions(timeline.get("_sequenceActionData")):
            action = require_dict(raw_action, f"{path}.action")
            type_name = action.get("$type")
            if not isinstance(type_name, str) or action_name(type_name) != "SlowAction":
                continue
            if action.get("isEnable") is False:
                continue
            action_path = f"{path}.SlowAction"
            if set(action) != SLOW_ACTION_FIELDS:
                raise ValueError(f"{action_path}: unexpected fields {sorted(action)}")
            if require_bool(action.get("overrideChildBuffId"), f"{action_path}.overrideChildBuffId"):
                raise ValueError(f"{action_path}: child Buff override is not supported")
            _validate_inactive_child_buff_id(action.get("childBuffId"), f"{action_path}.childBuffId")
            if require_bool(action.get("asChildBuff"), f"{action_path}.asChildBuff"):
                raise ValueError(f"{action_path}: child Buff lifetime is not supported")
            if require_list(action.get("enhancingList"), f"{action_path}.enhancingList"):
                raise ValueError(f"{action_path}: keyword enhancement chain is not supported")
            result.append(
                TimedKeywordActionSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(action, action_path),
                    kind="slow",
                    source=parse_target_reference(action.get("source"), f"{action_path}.source"),
                    target=parse_target_reference(action.get("target"), f"{action_path}.target"),
                    duration=parse_scalar(
                        action.get("duration"), f"{action_path}.duration", inherited_blackboard
                    ),
                    rate=parse_scalar(action.get("rate"), f"{action_path}.rate", inherited_blackboard),
                    autoFinishByAction=require_bool(
                        action.get("autoFinishByAction"), f"{action_path}.autoFinishByAction"
                    ),
                    sequenceIndex=timeline_index,
                )
            )
    return tuple(result)
