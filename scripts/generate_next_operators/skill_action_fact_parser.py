"""解析技能来源中的辅助动作、运行时黑板动作与时间线跳转事实。"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Iterable

from action_kinds import AUDITED_COMBAT_ACTION_NAMES
from action_payload_parser import (
    parse_ability_entity_spawn_payload,
    parse_blackboard_mutation_payload,
    parse_buff_application_payload,
    parse_buff_blackboard_read_payload,
    parse_buff_finish_payload,
)
from conditional_parser import (
    parse_legacy_buff_finish_payload,
    parse_timeline_jump_condition,
)
from source_models import (
    AuxiliaryActionSource,
    BlackboardMutationSource,
    BuffBlackboardReadSource,
    BuffFinishSource,
    ConditionSource,
    TimedTimelineJumpSource,
)
from source_utils import (
    action_name,
    require_dict,
    require_list,
    require_non_negative_int,
    require_server_action_index,
)


@dataclass(frozen=True)
class SkillActionFactParserServices:
    """由入口注入共享遍历、来源加载和目标引用证明。"""

    load_projected_skill_data: Callable[..., Any]
    target_reference_has_plain_selector: Callable[..., Any]
    target_reference_is_plain: Callable[..., Any]
    walk_actions: Callable[..., Any]
    walk_unconditional_actions: Callable[..., Any]


def parse_blackboard_runtime_actions(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
    *,
    services: SkillActionFactParserServices,
) -> tuple[
    tuple[BlackboardMutationSource, ...],
    tuple[BuffBlackboardReadSource, ...],
    tuple[BuffFinishSource, ...],
]:
    """读取会改变技能黑板，或从目标 Buff 黑板取值的运行时动作。"""
    target_reference_has_plain_selector = services.target_reference_has_plain_selector
    target_reference_is_plain = services.target_reference_is_plain
    walk_unconditional_actions = services.walk_unconditional_actions
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
                        sequenceIndex=timeline_index,
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
                        sequenceIndex=timeline_index,
                    )
                )
                continue
            if kind == "FinishBuffAction":
                payload = parse_legacy_buff_finish_payload(
                    action, f"{source_name}.FinishBuffAction", inherited_blackboard
                )
                if (
                    not target_reference_has_plain_selector(payload.target)
                    or not target_reference_is_plain(payload.buffSource)
                    or not target_reference_is_plain(payload.finishSource)
                    or payload.buffSource.targetSource != "Source"
                    or payload.finishSource.targetSource != "Source"
                ):
                    raise ValueError(
                        f"{source_name}.FinishBuffAction: unsupported target selector or source"
                    )
                finishes.append(
                    BuffFinishSource(
                        startFrame=start_frame,
                        endFrame=end_frame,
                        actionIndex=require_server_action_index(
                            action, f"{source_name}.FinishBuffAction"
                        ),
                        targetSource=payload.target.targetSource,
                        targetGroupKey=payload.target.targetGroupKey,
                        buffCheckType="Id",
                        buffIds=payload.buffIds,
                        tagQueryType="hasAny",
                        buffTagIds=(),
                        finishAll=payload.finishAll,
                        limitSource=payload.limitSource,
                        isFinishedEarly=payload.isFinishedEarly,
                        isAbsorbed=False,
                        finishLayerCount=(
                            None if payload.finishAll else payload.finishLayerCount
                        ),
                        sourceActionType="FinishBuffAction",
                        sequenceIndex=timeline_index,
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
                    sequenceIndex=timeline_index,
                )
            )
    return tuple(mutations), tuple(reads), tuple(finishes)


def parse_auxiliary_actions(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    inherited_blackboard: dict[str, tuple[float, ...]],
    *,
    services: SkillActionFactParserServices,
) -> tuple[AuxiliaryActionSource, ...]:
    load_projected_skill_data = services.load_projected_skill_data
    walk_actions = services.walk_actions
    walk_unconditional_actions = services.walk_unconditional_actions
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
                            sequenceIndex=timeline_index,
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
                            sequenceIndex=timeline_index,
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
                        sequenceIndex=timeline_index,
                    )
                )
    return tuple(result)

def parse_timeline_jumps(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]] | None = None,
    *,
    services: SkillActionFactParserServices,
) -> tuple[TimedTimelineJumpSource, ...]:
    """保留 JumpToAction 的位置、时间与条件类型；未建模控制流不得被线性化。"""
    walk_actions = services.walk_actions

    def walk_action_paths(
        value: Any,
        path: tuple[str, ...],
        is_only_branch_action: bool = False,
    ) -> Iterable[tuple[dict[str, Any], tuple[str, ...], bool]]:
        if isinstance(value, dict):
            if value.get("isEnable") is False:
                return
            type_name = value.get("$type")
            if isinstance(type_name, str):
                yield value, path, is_only_branch_action
            for key, child in value.items():
                if key == "actionData" and isinstance(child, list):
                    enabled_children = tuple(
                        item
                        for item in child
                        if isinstance(item, dict) and item.get("isEnable") is not False
                    )
                    for index, item in enumerate(child):
                        yield from walk_action_paths(
                            item,
                            (*path, key, f"[{index}]"),
                            len(enabled_children) == 1 and enabled_children[0] is item,
                        )
                else:
                    yield from walk_action_paths(child, (*path, key))
        elif isinstance(value, list):
            for index, child in enumerate(value):
                yield from walk_action_paths(child, (*path, f"[{index}]"))

    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedTimelineJumpSource] = []
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
        sequence_data = require_dict(
            timeline.get("_sequenceActionData"), f"{timeline_path}._sequenceActionData"
        )
        raw_root_actions = sequence_data.get("actionData")
        enabled_root_actions = tuple(
            action
            for action in raw_root_actions
            if isinstance(action, dict) and action.get("isEnable") is not False
        ) if isinstance(raw_root_actions, list) else ()
        for action, action_path, is_only_branch_action in walk_action_paths(
            sequence_data,
            (f"timelineActions[{timeline_index}]", "_sequenceActionData"),
        ):
            if action_name(action["$type"]) != "JumpToAction" or action.get("isEnable") is False:
                continue
            path = f"{source_name}.{'.'.join(action_path)}"
            condition_types = tuple(
                action_name(item["$type"])
                for item in walk_actions(action.get("conditionAction"))
                if item.get("isEnable") is not False
            )
            raw_conditions = tuple(
                item
                for item in walk_actions(action.get("conditionAction"))
                if item.get("isEnable") is not False
            )
            direct_conditions: tuple[ConditionSource, ...] = ()
            direct_conditions_supported = False
            if raw_conditions and all(
                action_name(str(item.get("$type", "")))
                in {"CheckHp", "CheckBuffStackNum", "CheckBuffStackNumAdvanced"}
                for item in raw_conditions
            ):
                direct_conditions = tuple(
                    parse_timeline_jump_condition(
                        item,
                        f"{path}.conditionAction[{index}]",
                        inherited_blackboard or {},
                    )
                    for index, item in enumerate(raw_conditions)
                )
                direct_conditions_supported = True
            result.append(
                TimedTimelineJumpSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    destFrame=require_non_negative_int(
                        action.get("destFrame"), f"{path}.destFrame"
                    ),
                    actionIndex=require_server_action_index(action, path),
                    actionPath=action_path,
                    conditionActionTypes=condition_types,
                    directConditions=direct_conditions,
                    directConditionsSupported=direct_conditions_supported,
                    isOnlySequenceAction=(
                        len(enabled_root_actions) == 1 and enabled_root_actions[0] is action
                    ),
                    isOnlyBranchAction=is_only_branch_action,
                    isRootContainerOnlySequenceAction=(
                        len(enabled_root_actions) == 1
                        and action_path[:4]
                        == (
                            f"timelineActions[{timeline_index}]",
                            "_sequenceActionData",
                            "actionData",
                            "[0]",
                        )
                    ),
                    sequenceIndex=timeline_index,
                )
            )
    return tuple(result)
