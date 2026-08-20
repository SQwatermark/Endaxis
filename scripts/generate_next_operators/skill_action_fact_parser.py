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
    TimedTimelineFinishSource,
)
from source_utils import (
    action_name,
    require_bool,
    require_dict,
    require_list,
    require_non_negative_int,
    require_server_action_index,
)
from target_parser import parse_target_reference


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
                    action,
                    f"{source_name}.FinishBuffAdvanced",
                    inherited_blackboard,
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
                        finishLayerCount=payload.finishLayerCount,
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
                            autoFinishByAction=require_bool(
                                action.get("autoFinishByAction"),
                                f"{source_name}.CreateBuffAction.autoFinishByAction",
                            ),
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

    supported_condition_names = {
        "CheckHp",
        "CheckBuffStackNum",
        "CheckBuffStackNumAdvanced",
        "CompareFloat",
        "CheckMainCharacterCondition",
        "CheckTimedMarkerCondition",
    }

    def parse_condition_sequence(
        raw_items: tuple[dict[str, Any], ...], path: str
    ) -> tuple[tuple[ConditionSource, ...], tuple[bool, ...], bool]:
        parsed_conditions: list[ConditionSource] = []
        parsed_negations: list[bool] = []
        negate_next = False
        valid = bool(raw_items)
        for index, item in enumerate(raw_items):
            condition_name = action_name(str(item.get("$type", "")))
            if condition_name == "NotNextCheckAction":
                if negate_next:
                    return (), (), False
                negate_next = True
                continue
            if condition_name not in supported_condition_names:
                return (), (), False
            parsed_conditions.append(
                parse_timeline_jump_condition(
                    item,
                    f"{path}[{index}]",
                    inherited_blackboard or {},
                )
            )
            parsed_negations.append(negate_next)
            negate_next = False
        if negate_next or not valid:
            return (), (), False
        return tuple(parsed_conditions), tuple(parsed_negations), bool(parsed_conditions)

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
            condition_action = action.get("conditionAction")
            raw_condition_data = (
                condition_action.get("actionData")
                if isinstance(condition_action, dict)
                else None
            )
            raw_conditions = tuple(
                item
                for item in raw_condition_data
                if isinstance(item, dict) and item.get("isEnable") is not False
            ) if isinstance(raw_condition_data, list) else ()
            condition_types = tuple(
                action_name(str(item.get("$type", ""))) for item in raw_conditions
            )
            direct_conditions: tuple[ConditionSource, ...] = ()
            direct_condition_negated: tuple[bool, ...] = ()
            direct_any_conditions: tuple[tuple[ConditionSource, ...], ...] = ()
            direct_any_condition_negated: tuple[tuple[bool, ...], ...] = ()
            direct_conditions_supported = False
            if (
                len(raw_conditions) == 1
                and action_name(str(raw_conditions[0].get("$type", "")))
                == "OrConditionAction"
            ):
                raw_groups = raw_conditions[0].get("conditionList")
                parsed_groups: list[tuple[ConditionSource, ...]] = []
                parsed_group_negations: list[tuple[bool, ...]] = []
                valid_any = isinstance(raw_groups, list) and bool(raw_groups)
                if isinstance(raw_groups, list):
                    for group_index, raw_group in enumerate(raw_groups):
                        group = raw_group if isinstance(raw_group, dict) else {}
                        group_items = group.get("actionData")
                        enabled_group_items = tuple(
                            item
                            for item in group_items
                            if isinstance(item, dict) and item.get("isEnable") is not False
                        ) if isinstance(group_items, list) else ()
                        conditions, negations, supported = parse_condition_sequence(
                            enabled_group_items,
                            f"{path}.conditionAction[0].conditionList[{group_index}]",
                        )
                        if not supported:
                            valid_any = False
                            break
                        parsed_groups.append(conditions)
                        parsed_group_negations.append(negations)
                if valid_any:
                    direct_any_conditions = tuple(parsed_groups)
                    direct_any_condition_negated = tuple(parsed_group_negations)
                    direct_conditions_supported = True
            else:
                (
                    direct_conditions,
                    direct_condition_negated,
                    direct_conditions_supported,
                ) = parse_condition_sequence(
                    raw_conditions, f"{path}.conditionAction"
                )
            # directConditionsSupported 只表示 conditionAction 是可编译的直接条件
            # 结构；具体目标能否在当前上下文解析仍由条件编译器 fail-closed 判定。
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
                    directConditionNegated=direct_condition_negated,
                    directAnyConditions=direct_any_conditions,
                    directAnyConditionNegated=direct_any_condition_negated,
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


def parse_timeline_finishes(
    root: dict[str, Any], source_name: str
) -> tuple[TimedTimelineFinishSource, ...]:
    """严格保留根时间轴上结束当前技能的直接动作。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedTimelineFinishSource] = []
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
        sequence = require_dict(
            timeline.get("_sequenceActionData"), f"{timeline_path}._sequenceActionData"
        )
        actions = require_list(sequence.get("actionData"), f"{timeline_path}.actionData")
        enabled = tuple(
            action
            for action in actions
            if isinstance(action, dict) and action.get("isEnable") is not False
        )
        for action in enabled:
            if action_name(str(action.get("$type", ""))) != "InterruptCurSkillAction":
                continue
            if len(enabled) != 1:
                raise ValueError(
                    f"{timeline_path}: InterruptCurSkillAction must be the only enabled root action"
                )
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "skillOwner",
            }
            if set(action) != expected_fields:
                raise ValueError(
                    f"{timeline_path}: unexpected InterruptCurSkillAction fields {sorted(action)}"
                )
            owner = parse_target_reference(
                action.get("skillOwner"), f"{timeline_path}.skillOwner"
            )
            if (
                owner.targetSource != "Owner"
                or owner.targetGroupKey
                or owner.validatorTypes
                or owner.postProcessorTypes
                or owner.selectorOwner != "ActionOwner"
                or owner.ownerContextKey
                or owner.centerType != "ActionSource"
                or owner.centerContextKey
                or owner.centerToGround
                or owner.target != "ActionSource"
                or owner.targetContextKey
                or owner.enableAdvancedDirection
                or owner.selectorDirection != "SourceForward"
            ):
                raise ValueError(f"{timeline_path}.skillOwner: expected plain Owner")
            result.append(
                TimedTimelineFinishSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(action, timeline_path),
                    sequenceIndex=timeline_index,
                )
            )
    return tuple(result)
