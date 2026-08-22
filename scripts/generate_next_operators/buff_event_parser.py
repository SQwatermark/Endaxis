"""Buff 与技能事件、点燃响应及技能替换来源解析。"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable, Literal, cast

from action_kinds import AUDITED_COMBAT_ACTION_NAMES
from action_payload_parser import (
    parse_buff_application_payload,
    parse_damage_units,
    parse_scalar,
)
from conditional_parser import parse_ordered_action_sequence
from source_models import (
    BuffEventActionSource,
    BuffEventForEachSource,
    BuffEventSkillCastSource,
    BuffEventTargetGroupWriteSource,
    BuffSkillReplacementSource,
    CollectedBuffReactionModifierSource,
    EventBuffApplicationSource,
    ObtainAtbFilterSource,
    SkillEventActionSequenceSource,
    SkillEventListenerSource,
    TargetGroupWriteSource,
)
from source_schema import TARGET_GROUP_FIND_ACTION_FIELDS
from source_utils import (
    action_name,
    require_bool,
    require_dict,
    require_list,
    require_non_negative_int,
    require_server_action_index,
)
from target_parser import (
    parse_selector_summary,
    parse_spawned_entity_selector_identity,
    parse_target_reference,
)


@dataclass(frozen=True)
class BuffEventParserServices:
    """由入口注入的递归动作遍历和目标组写入解析服务。"""

    collect_created_buff_ids: Callable[..., Any]
    parse_target_group_writes: Callable[..., Any]
    walk_actions: Callable[..., Any]
    walk_unconditional_actions: Callable[..., Any]


ABILITY_ACTION_PRIORITY_LEVELS = {
    "Low": -100,
    "Default": 0,
    "High": 100,
}


def _constant_scalar(value: Any, path: str, expected: float) -> bool:
    scalar = require_dict(value, path)
    return (
        scalar.get("useBlackboardKey") is False
        and scalar.get("blackboardKey") == ""
        and scalar.get("value") == expected
    )


def _blackboard_scalar(value: Any, path: str, key: str) -> bool:
    scalar = require_dict(value, path)
    return scalar.get("useBlackboardKey") is True and scalar.get("blackboardKey") == key


def _walk_serialized_actions(value: Any) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []
    if isinstance(value, dict):
        if isinstance(value.get("$type"), str):
            result.append(value)
        for child in value.values():
            result.extend(_walk_serialized_actions(child))
    elif isinstance(value, list):
        for child in value:
            result.extend(_walk_serialized_actions(child))
    return result


def parse_collected_buff_reaction_modifier(
    event_name: str,
    actions: list[dict[str, Any]],
    context_queries: list[tuple[str, tuple[int, ...]]],
    path: str,
) -> CollectedBuffReactionModifierSource | None:
    """识别已由原生复刻确认的“修改即将输出的反应 Buff 黑板”程序。"""
    if event_name != "OnCollectOutputBuffBbValue":
        return None
    if len(context_queries) != 1 or context_queries[0][0] != "HasAny":
        return None
    tag_ids = context_queries[0][1]
    if len(tag_ids) != 1:
        return None

    by_type: dict[str, list[dict[str, Any]]] = {}
    for action in actions:
        by_type.setdefault(action_name(action["$type"]), []).append(action)
    expected_counts = {
        "CheckBuffIdInContextAdvanced": 1,
        "SaveCollectedBuffBbValue": 1,
        "IfElseAction": 1,
        "CompareFloat": 1,
        "ModifyCollectedBuffBbValue": 3,
        "SimpleCalcBBAction": 2,
    }
    if set(by_type) != set(expected_counts) or any(
        len(by_type[name]) != count for name, count in expected_counts.items()
    ):
        return None

    save = by_type["SaveCollectedBuffBbValue"][0]
    if save.get("blackboardKey") != "duration" or save.get("storeKey") != "duration_dynamic":
        return None
    compare = by_type["CompareFloat"][0]
    if (
        compare.get("compare") != "GT"
        or not _blackboard_scalar(compare.get("valueA"), f"{path}.CompareFloat.valueA", "duration_dynamic")
        or not _constant_scalar(compare.get("valueB"), f"{path}.CompareFloat.valueB", 0.0)
    ):
        return None

    duration_key: str | None = None
    effectiveness_key: str | None = None
    for action in by_type["ModifyCollectedBuffBbValue"]:
        if action.get("useDirectValue") is not False:
            return None
        output_key = action.get("blackboardKey")
        if output_key == "duration":
            addition = require_dict(action.get("addition"), f"{path}.duration.addition")
            if (
                not _constant_scalar(action.get("multiplier"), f"{path}.duration.multiplier", 1.0)
                or addition.get("useBlackboardKey") is not True
                or not isinstance(addition.get("blackboardKey"), str)
                or not addition.get("blackboardKey")
            ):
                return None
            duration_key = str(addition["blackboardKey"])
        elif output_key == "max_def_decrease":
            multiplier = require_dict(action.get("multiplier"), f"{path}.effect.multiplier")
            if (
                multiplier.get("useBlackboardKey") is not True
                or multiplier.get("blackboardKey") != "final_corrupt_rate"
                or not _constant_scalar(action.get("addition"), f"{path}.effect.addition", 0.0)
            ):
                return None
        else:
            return None

    for action in by_type["SimpleCalcBBAction"]:
        if (
            action.get("key") != "final_corrupt_rate"
            or action.get("operation") != "Add"
            or not _constant_scalar(action.get("value2"), f"{path}.rate.value2", 1.0)
        ):
            return None
        value1 = require_dict(action.get("value1"), f"{path}.rate.value1")
        if value1.get("useBlackboardKey") is not True or not value1.get("blackboardKey"):
            return None
        current_key = str(value1["blackboardKey"])
        if effectiveness_key is not None and effectiveness_key != current_key:
            return None
        effectiveness_key = current_key

    if duration_key is None or effectiveness_key is None:
        return None
    return CollectedBuffReactionModifierSource(
        buffTagId=tag_ids[0],
        durationAdditionKey=duration_key,
        effectivenessAdditionKey=effectiveness_key,
    )


def parse_sequence_action_priority(
    actions: list[dict[str, Any]], path: str
) -> int:
    """还原原生 SequenceAction.Init 采用的首个启用动作排序值。"""
    if not actions:
        raise ValueError(f"{path}.actionData: expected at least one enabled action")
    entry = actions[0]
    level = entry.get("priorityLevel")
    offset = entry.get("priorityOffset")
    if not isinstance(level, str) or not level:
        raise ValueError(f"{path}.actionData[0].priorityLevel: expected non-empty string")
    base = ABILITY_ACTION_PRIORITY_LEVELS.get(level)
    if base is None:
        raise ValueError(
            f"{path}.actionData[0].priorityLevel: unsupported value {level!r}"
        )
    if not isinstance(offset, int) or isinstance(offset, bool):
        raise ValueError(f"{path}.actionData[0].priorityOffset: expected integer")
    return base + offset


def parse_buff_event_actions(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
    services: BuffEventParserServices,
    *,
    projected_action_names: frozenset[str] = frozenset(),
) -> tuple[BuffEventActionSource, ...]:
    """保留 Buff 与宿主实体事件中的动作事实；子 Buff 定义由中央目录递归解析。"""
    collect_created_buff_ids = services.collect_created_buff_ids
    parse_target_group_writes = services.parse_target_group_writes
    walk_actions = services.walk_actions
    walk_unconditional_actions = services.walk_unconditional_actions
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
            enabled_actions = [
                item
                for item in walk_unconditional_actions(actions)
                if item.get("isEnable") is not False
            ]
            walked_actions = [
                item
                for item in enabled_actions
                if action_name(item["$type"]) not in projected_action_names
            ]
            semantic_actions = [
                item
                for item in _walk_serialized_actions(actions)
                if item.get("isEnable") is not False
                and action_name(item["$type"]) not in projected_action_names
            ]
            if enabled_actions and not walked_actions:
                continue
            ordered_action_types = tuple(
                action_name(item["$type"]) for item in walked_actions
            )
            obtain_atb_filters: list[ObtainAtbFilterSource] = []
            obtain_atb_value_keys: list[tuple[str, str]] = []
            context_buff_tag_queries: list[tuple[str, tuple[int, ...]]] = []
            context_buff_id_queries: list[tuple[str, ...]] = []
            consume_buff_layer_checks: list[tuple[str, float, str]] = []
            for item in walked_actions:
                item_type = action_name(item["$type"])
                if item_type == "SaveAtbObtainValue":
                    expected_fields = {
                        "$type", "isEnable", "priorityLevel", "priorityOffset",
                        "serverActionIndex", "valueKey", "realDeltaKey",
                    }
                    if set(item) != expected_fields:
                        raise ValueError(f"{event_path}.SaveAtbObtainValue: unexpected fields")
                    value_key = item.get("valueKey")
                    real_delta_key = item.get("realDeltaKey")
                    if not isinstance(value_key, str) or not value_key:
                        raise ValueError(f"{event_path}.SaveAtbObtainValue.valueKey: expected key")
                    if not isinstance(real_delta_key, str):
                        raise ValueError(
                            f"{event_path}.SaveAtbObtainValue.realDeltaKey: expected string"
                        )
                    obtain_atb_value_keys.append((value_key, real_delta_key))
                    continue
                if item_type == "CheckBuffIdInContextAdvanced":
                    raw_buff_ids = require_list(
                        item.get("buffIdList"), f"{event_path}.buffIdList"
                    )
                    if item.get("checkType") == "Id":
                        buff_ids: list[str] = []
                        for buff_index, raw_buff_id in enumerate(raw_buff_ids):
                            buff_path = f"{event_path}.buffIdList[{buff_index}]"
                            scalar = require_dict(raw_buff_id, buff_path)
                            if (
                                scalar.get("useBlackboardKey") is not False
                                or scalar.get("blackboardKey") != ""
                                or not isinstance(scalar.get("value"), str)
                                or not scalar.get("value")
                            ):
                                raise ValueError(f"{buff_path}: expected direct Buff id")
                            buff_ids.append(str(scalar["value"]))
                        if buff_ids:
                            context_buff_id_queries.append(tuple(buff_ids))
                        continue
                    if item.get("checkType") != "Tag" or raw_buff_ids:
                        continue
                    query = require_dict(item.get("query"), f"{event_path}.query")
                    query_type = query.get("queryType")
                    if not isinstance(query_type, str) or not query_type:
                        raise ValueError(f"{event_path}.query.queryType: expected string")
                    tag_ids = tuple(
                        require_dict(raw_tag, f"{event_path}.query.tags[{index}]").get("tagId")
                        for index, raw_tag in enumerate(
                            require_list(query.get("tags"), f"{event_path}.query.tags")
                        )
                    )
                    if not tag_ids or any(
                        not isinstance(tag_id, int) or isinstance(tag_id, bool)
                        for tag_id in tag_ids
                    ):
                        raise ValueError(f"{event_path}.query.tags: expected integer tag ids")
                    context_buff_tag_queries.append((query_type, tag_ids))
                    continue
                if item_type == "CheckConsumeBuffLayer":
                    scalar = require_dict(item.get("num"), f"{event_path}.num")
                    if scalar.get("useBlackboardKey") is not False:
                        continue
                    value = scalar.get("value")
                    comparison = item.get("compareType")
                    store_key = item.get("storeKey")
                    if (
                        not isinstance(value, (int, float))
                        or isinstance(value, bool)
                        or not isinstance(comparison, str)
                        or not comparison
                        or not isinstance(store_key, str)
                        or not store_key
                    ):
                        raise ValueError(f"{event_path}: invalid consumed-layer check")
                    consume_buff_layer_checks.append((comparison, float(value), store_key))
                    continue
                if item_type != "CheckObtainAtbType":
                    continue
                item_path = f"{event_path}.CheckObtainAtbType"
                expected_fields = {
                    "$type", "isEnable", "priorityLevel", "priorityOffset",
                    "serverActionIndex", "checkObtainType", "obtainTypeList",
                    "checkObtainMethod", "obtainMethodList",
                }
                if set(item) != expected_fields:
                    raise ValueError(f"{item_path}: unexpected fields {sorted(item)}")
                obtain_types = require_list(
                    item.get("obtainTypeList"), f"{item_path}.obtainTypeList"
                )
                obtain_methods = require_list(
                    item.get("obtainMethodList"), f"{item_path}.obtainMethodList"
                )
                if not all(isinstance(value, str) and value for value in obtain_types):
                    raise ValueError(f"{item_path}.obtainTypeList: expected strings")
                if not all(isinstance(value, str) and value for value in obtain_methods):
                    raise ValueError(f"{item_path}.obtainMethodList: expected strings")
                obtain_atb_filters.append(
                    ObtainAtbFilterSource(
                        checkObtainType=require_bool(
                            item.get("checkObtainType"), f"{item_path}.checkObtainType"
                        ),
                        obtainTypes=tuple(obtain_types),
                        checkObtainMethod=require_bool(
                            item.get("checkObtainMethod"), f"{item_path}.checkObtainMethod"
                        ),
                        obtainMethods=tuple(obtain_methods),
                    )
                )
            for_each_actions: list[BuffEventForEachSource] = []
            event_target_group_writes: list[BuffEventTargetGroupWriteSource] = []
            for item in walked_actions:
                if action_name(item["$type"]) == "FindTargetAction":
                    item_path = f"{event_path}.FindTargetAction"
                    if set(item) != set(TARGET_GROUP_FIND_ACTION_FIELDS):
                        raise ValueError(
                            f"{item_path}: unexpected fields {sorted(item)}"
                        )
                    target_group_key = item.get("targetGroupKey")
                    if not isinstance(target_group_key, str) or not target_group_key:
                        raise ValueError(
                            f"{item_path}.targetGroupKey: expected non-empty string"
                        )
                    (
                        finder,
                        finder_faction_target,
                        finder_target_object_type,
                        finder_check_alive,
                        validators,
                        post_processors,
                    ) = parse_selector_summary(
                        item.get("selectorData"),
                        f"{item_path}.selectorData",
                        finder_required=True,
                    )
                    if finder is None:
                        raise ValueError(f"{item_path}: expected finder")
                    spawned_object_type, tag_queries = parse_spawned_entity_selector_identity(
                        item.get("selectorData"), f"{item_path}.selectorData"
                    )
                    event_target_group_writes.append(
                        BuffEventTargetGroupWriteSource(
                            actionIndex=require_server_action_index(item, item_path),
                            targetGroupKey=target_group_key,
                            finderType=finder,
                            finderFactionTarget=finder_faction_target,
                            finderTargetObjectType=finder_target_object_type,
                            finderCheckAlive=finder_check_alive,
                            validatorTypes=validators,
                            postProcessorTypes=post_processors,
                            spawnedObjectType=spawned_object_type,
                            tagQueries=tag_queries,
                            center=str(item.get("center", "")),
                            selectorOwner=str(item.get("selectorOwner", "")),
                        )
                    )
                    continue
                if action_name(item["$type"]) != "ForEachAction":
                    continue
                item_path = f"{event_path}.ForEachAction"
                expected_fields = {
                    "$type", "isEnable", "priorityLevel", "priorityOffset",
                    "serverActionIndex", "target", "action",
                }
                if set(item) != expected_fields:
                    raise ValueError(
                        f"{item_path}: unexpected fields {sorted(item)}"
                    )
                target_value = item.get("target")
                target = parse_target_reference(target_value, f"{item_path}.target")
                spawned_object_type, tag_queries = parse_spawned_entity_selector_identity(
                    require_dict(target_value, f"{item_path}.target").get("selectorData"),
                    f"{item_path}.target.selectorData",
                )
                body = require_dict(item.get("action"), f"{item_path}.action")
                body_actions = tuple(
                    require_dict(raw, f"{item_path}.action.actionData[{index}]")
                    for index, raw in enumerate(
                        require_list(body.get("actionData"), f"{item_path}.action.actionData")
                    )
                    if not isinstance(raw, dict) or raw.get("isEnable") is not False
                )
                body_types = tuple(action_name(action["$type"]) for action in body_actions)
                nested_buff_applications = tuple(
                    EventBuffApplicationSource(
                        actionIndex=require_server_action_index(action, item_path),
                        payload=parse_buff_application_payload(action, item_path, blackboard),
                    )
                    for action in body_actions
                    if action_name(action["$type"]) == "CreateBuffAction"
                )
                skill_casts: list[BuffEventSkillCastSource] = []
                for action in body_actions:
                    if action_name(action["$type"]) != "CastSkill":
                        continue
                    cast_path = f"{item_path}.CastSkill"
                    expected_cast_fields = {
                        "$type", "isEnable", "priorityLevel", "priorityOffset",
                        "serverActionIndex", "caster", "target", "skillId",
                        "skipApplyCost", "inheritSourceSkillCastId",
                    }
                    if set(action) != expected_cast_fields:
                        raise ValueError(
                            f"{cast_path}: unexpected fields {sorted(action)}"
                        )
                    skill_id = require_dict(action.get("skillId"), f"{cast_path}.skillId")
                    if (
                        skill_id.get("useBlackboardKey") is not False
                        or not isinstance(skill_id.get("value"), str)
                        or not skill_id["value"]
                    ):
                        raise ValueError(f"{cast_path}.skillId: expected direct non-empty id")
                    skip_apply_cost = action.get("skipApplyCost")
                    inherit_cast_id = action.get("inheritSourceSkillCastId")
                    if not isinstance(skip_apply_cost, bool) or not isinstance(inherit_cast_id, bool):
                        raise ValueError(f"{cast_path}: expected boolean cast flags")
                    skill_casts.append(
                        BuffEventSkillCastSource(
                            actionIndex=require_server_action_index(action, cast_path),
                            caster=parse_target_reference(action.get("caster"), f"{cast_path}.caster"),
                            target=parse_target_reference(action.get("target"), f"{cast_path}.target"),
                            skillId=skill_id["value"],
                            skipApplyCost=skip_apply_cost,
                            inheritSourceSkillCastId=inherit_cast_id,
                        )
                    )
                for_each_actions.append(
                    BuffEventForEachSource(
                        actionIndex=require_server_action_index(item, item_path),
                        target=target,
                        spawnedObjectType=spawned_object_type,
                        tagQueries=tag_queries,
                        orderedActionTypes=body_types,
                        buffApplications=nested_buff_applications,
                        skillCasts=tuple(skill_casts),
                    )
                )
            parsed_sequences: list[SkillEventActionSequenceSource] = []
            runtime_target_group_writes: list[TargetGroupWriteSource] = []
            for sequence_index, raw_sequence in enumerate(
                require_list(actions, f"{event_path}.actions")
            ):
                sequence_path = f"{event_path}.actions[{sequence_index}]"
                sequence = require_dict(raw_sequence, sequence_path)
                # 既有最小夹具可能把动作直接放进 actions；来源文件的 SequenceAction
                # 一定携带 actionData 与两个执行身份字段。此类扁平夹具继续由旧审计字段覆盖。
                if "$type" in sequence or not {
                    "actionData",
                    "onlyExecuteWhenSourceIsMainChar",
                    "onlyExecuteWhenSourceIsGuard",
                } <= set(sequence):
                    continue
                sequence_actions = [
                    item
                    for item in walk_unconditional_actions(sequence.get("actionData"))
                    if item.get("isEnable") is not False
                    and action_name(item["$type"]) not in projected_action_names
                ]
                # AbilityActionUtils.CreateSequenceAction 对没有启用动作的数据返回 null，
                # ActionContainer 因而不会注册一个可执行响应。
                if not sequence_actions:
                    continue
                sequence_types = tuple(
                    action_name(item["$type"]) for item in sequence_actions
                )
                ordered_actions = ()
                should_preserve_ordered_tree = (
                    "ForEachAction" not in sequence_types
                    or any(
                        guard in sequence_types
                        for guard in ("CheckHealTag", "CheckOverHeal")
                    )
                    # 固定单敌人模型中，先 FindTarget 再遍历该组的输出伤害响应
                    # 已有明确目标来源；其循环不能继续只留在 audit facts。
                    or (
                        event_name == "OnOutputDamage"
                        and "FindTargetAction" in sequence_types
                    )
                )
                if should_preserve_ordered_tree:
                    try:
                        ordered_actions = parse_ordered_action_sequence(
                            sequence.get("actionData"),
                            sequence_path,
                            blackboard,
                            include_target_group_provenance=True,
                        )
                    except ValueError as error:
                        # 仍未证明目标集合身份的旧 ForEach 保留 typed audit facts；
                        # 能证明为固定单敌人的循环必须进入正式有序树。
                        if "ForEachAction: unsupported target collection" not in str(error):
                            raise
                parsed_sequences.append(
                    SkillEventActionSequenceSource(
                        onlyMainOperator=require_bool(
                            sequence.get("onlyExecuteWhenSourceIsMainChar"),
                            f"{sequence_path}.onlyExecuteWhenSourceIsMainChar",
                        ),
                        onlyGuard=require_bool(
                            sequence.get("onlyExecuteWhenSourceIsGuard"),
                            f"{sequence_path}.onlyExecuteWhenSourceIsGuard",
                        ),
                        orderedActionTypes=sequence_types,
                        combatActions=tuple(
                            name
                            for name in sequence_types
                            if name in AUDITED_COMBAT_ACTION_NAMES
                        ),
                        buffApplications=tuple(
                            EventBuffApplicationSource(
                                actionIndex=require_server_action_index(item, sequence_path),
                                payload=parse_buff_application_payload(
                                    item, sequence_path, blackboard
                                ),
                            )
                            for item in sequence_actions
                            if action_name(item["$type"]) == "CreateBuffAction"
                        ),
                        # 有序树是唯一执行来源；ForEach typed facts只保留审计证据，
                        # 不能再令纯循环响应在正式 Buff 定义中静默消失。
                        actions=ordered_actions,
                        priority=parse_sequence_action_priority(
                            sequence_actions, sequence_path
                        ),
                    )
                )
                runtime_target_group_writes.extend(
                    parse_target_group_writes(
                        {
                            "actionGroupData": {
                                "timelineActions": [
                                    {
                                        "_startFrame": 0,
                                        "_endFrame": 0,
                                        "_sequenceActionData": {
                                            "actionData": sequence.get("actionData")
                                        },
                                    }
                                ]
                            }
                        },
                        sequence_path,
                    )
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
                    damageUnits=(
                        parse_damage_units(action_root, f"{source_name}.{event_name}", blackboard)
                        if any(
                            action_name(action["$type"]) == "DamageAction"
                            for action in walk_actions(actions)
                        )
                        else ()
                    ),
                    buffApplications=buff_applications,
                    createdBuffIds=collect_created_buff_ids(actions, source_name),
                    forEachActions=tuple(for_each_actions),
                    targetGroupWrites=tuple(event_target_group_writes),
                    sequences=tuple(parsed_sequences),
                    runtimeTargetGroupWrites=tuple(runtime_target_group_writes),
                    obtainAtbFilters=tuple(obtain_atb_filters),
                    obtainAtbValueKeys=tuple(obtain_atb_value_keys),
                    contextBuffTagQueries=tuple(context_buff_tag_queries),
                    contextBuffIdQueries=tuple(context_buff_id_queries),
                    consumeBuffLayerChecks=tuple(consume_buff_layer_checks),
                    collectedBuffReactionModifier=parse_collected_buff_reaction_modifier(
                        event_name,
                        semantic_actions,
                        context_buff_tag_queries,
                        event_path,
                    ),
                )
            )
    return tuple(result)


def parse_buff_ignite_event_actions(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
    services: BuffEventParserServices,
) -> tuple[BuffEventActionSource, ...]:
    """解析 BuffData 的点燃响应；点燃类型与结束标志保持原生身份。"""
    collect_created_buff_ids = services.collect_created_buff_ids
    parse_target_group_writes = services.parse_target_group_writes
    walk_unconditional_actions = services.walk_unconditional_actions
    result: list[BuffEventActionSource] = []
    for event_index, raw_event in enumerate(
        require_list(buff.get("igniteEventAction", []), f"{source_name}.igniteEventAction")
    ):
        event_path = f"{source_name}.igniteEventAction[{event_index}]"
        event = require_dict(raw_event, event_path)
        expected_fields = {"igniteType", "finishAfterIgnited", "actions"}
        if set(event) != expected_fields:
            raise ValueError(f"{event_path}: unexpected fields {sorted(event)}")
        ignite_type = event.get("igniteType")
        if not isinstance(ignite_type, str) or not ignite_type:
            raise ValueError(f"{event_path}.igniteType: expected non-empty string")
        finish_after_ignited = require_bool(
            event.get("finishAfterIgnited"), f"{event_path}.finishAfterIgnited"
        )
        parsed_sequences: list[SkillEventActionSequenceSource] = []
        all_actions: list[dict[str, Any]] = []
        runtime_target_group_writes: list[TargetGroupWriteSource] = []
        for sequence_index, raw_sequence in enumerate(
            require_list(event.get("actions"), f"{event_path}.actions")
        ):
            sequence_path = f"{event_path}.actions[{sequence_index}]"
            sequence = require_dict(raw_sequence, sequence_path)
            expected_sequence_fields = {
                "actionData", "onlyExecuteWhenSourceIsMainChar", "onlyExecuteWhenSourceIsGuard"
            }
            if set(sequence) != expected_sequence_fields:
                raise ValueError(f"{sequence_path}: unexpected fields {sorted(sequence)}")
            sequence_actions = [
                item
                for item in walk_unconditional_actions(sequence.get("actionData"))
                if item.get("isEnable") is not False
            ]
            if not sequence_actions:
                continue
            all_actions.extend(sequence_actions)
            sequence_types = tuple(action_name(item["$type"]) for item in sequence_actions)
            parsed_sequences.append(
                SkillEventActionSequenceSource(
                    onlyMainOperator=require_bool(
                        sequence.get("onlyExecuteWhenSourceIsMainChar"),
                        f"{sequence_path}.onlyExecuteWhenSourceIsMainChar",
                    ),
                    onlyGuard=require_bool(
                        sequence.get("onlyExecuteWhenSourceIsGuard"),
                        f"{sequence_path}.onlyExecuteWhenSourceIsGuard",
                    ),
                    orderedActionTypes=sequence_types,
                    combatActions=tuple(
                        name for name in sequence_types if name in AUDITED_COMBAT_ACTION_NAMES
                    ),
                    buffApplications=tuple(
                        EventBuffApplicationSource(
                            actionIndex=require_server_action_index(item, sequence_path),
                            payload=parse_buff_application_payload(item, sequence_path, blackboard),
                        )
                        for item in sequence_actions
                        if action_name(item["$type"]) == "CreateBuffAction"
                    ),
                    actions=parse_ordered_action_sequence(
                        sequence.get("actionData"),
                        sequence_path,
                        blackboard,
                        include_target_group_provenance=True,
                    ),
                    priority=parse_sequence_action_priority(sequence_actions, sequence_path),
                )
            )
            runtime_target_group_writes.extend(
                parse_target_group_writes(
                    {
                        "actionGroupData": {
                            "timelineActions": [
                                {
                                    "_startFrame": 0,
                                    "_endFrame": 0,
                                    "_sequenceActionData": {
                                        "actionData": sequence.get("actionData")
                                    },
                                }
                            ]
                        }
                    },
                    sequence_path,
                )
            )
        action_root = {"actionGroupData": {"actions": event.get("actions")}}
        ordered_action_types = tuple(action_name(item["$type"]) for item in all_actions)
        result.append(
            BuffEventActionSource(
                eventSource="ignite",
                event=ignite_type,
                orderedActionTypes=ordered_action_types,
                combatActions=tuple(
                    sorted({name for name in ordered_action_types if name in AUDITED_COMBAT_ACTION_NAMES})
                ),
                damageUnits=(
                    parse_damage_units(action_root, event_path, blackboard)
                    if "DamageAction" in ordered_action_types
                    else ()
                ),
                buffApplications=tuple(
                    EventBuffApplicationSource(
                        actionIndex=require_server_action_index(item, event_path),
                        payload=parse_buff_application_payload(item, event_path, blackboard),
                    )
                    for item in all_actions
                    if action_name(item["$type"]) == "CreateBuffAction"
                ),
                createdBuffIds=collect_created_buff_ids(event.get("actions"), source_name),
                sequences=tuple(parsed_sequences),
                finishAfterIgnited=finish_after_ignited,
                runtimeTargetGroupWrites=tuple(runtime_target_group_writes),
            )
        )
    return tuple(result)


def parse_buff_skill_replacements(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[BuffSkillReplacementSource, ...]:
    """严格保留 Buff 事件顶层对稳定技能槽的替换关系。"""
    result: list[BuffSkillReplacementSource] = []
    expected_fields = {
        "$type", "isEnable", "priorityLevel", "priorityOffset", "serverActionIndex",
        "skillSource", "skillSlot", "targetSkillId", "overrideCacheTime", "cacheTime",
        "lifeTimeType", "duration", "inheritOriginSkillCdProgress",
        "specificRevertedSkillId", "revertedSkillId",
    }
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
                raise ValueError(f"{event_path}.{event_key}: expected non-empty string")
            for sequence_index, raw_sequence in enumerate(
                require_list(event.get("actions"), f"{event_path}.actions")
            ):
                sequence_path = f"{event_path}.actions[{sequence_index}]"
                sequence = require_dict(raw_sequence, sequence_path)
                raw_actions = (
                    [sequence]
                    if "$type" in sequence
                    else require_list(sequence.get("actionData"), f"{sequence_path}.actionData")
                )
                for action_index, raw_action in enumerate(
                    raw_actions
                ):
                    action_path = f"{sequence_path}.actionData[{action_index}]"
                    action = require_dict(raw_action, action_path)
                    if (
                        action.get("isEnable") is False
                        or action_name(str(action.get("$type", ""))) != "ChangeSkillAction"
                    ):
                        continue
                    if set(action) != expected_fields:
                        raise ValueError(
                            f"{action_path}: expected fields {sorted(expected_fields)}, "
                            f"got {sorted(action)}"
                        )
                    string_fields = {
                        name: action.get(name)
                        for name in ("skillSlot", "targetSkillId", "lifeTimeType")
                    }
                    for name, value in string_fields.items():
                        if not isinstance(value, str) or not value:
                            raise ValueError(f"{action_path}.{name}: expected non-empty string")
                    reverted_skill_id = action.get("revertedSkillId")
                    if not isinstance(reverted_skill_id, str):
                        raise ValueError(f"{action_path}.revertedSkillId: expected string")
                    result.append(
                        BuffSkillReplacementSource(
                            eventSource=cast(Literal["buff", "ability"], event_source),
                            event=event_name,
                            actionIndex=require_server_action_index(action, action_path),
                            skillSource=parse_target_reference(
                                action.get("skillSource"), f"{action_path}.skillSource"
                            ),
                            skillSlot=cast(str, string_fields["skillSlot"]),
                            targetSkillId=cast(str, string_fields["targetSkillId"]),
                            overrideCacheTime=require_bool(
                                action.get("overrideCacheTime"),
                                f"{action_path}.overrideCacheTime",
                            ),
                            cacheTime=parse_scalar(
                                action.get("cacheTime"), f"{action_path}.cacheTime", blackboard
                            ),
                            lifeTimeType=cast(str, string_fields["lifeTimeType"]),
                            duration=parse_scalar(
                                action.get("duration"), f"{action_path}.duration", blackboard
                            ),
                            inheritOriginSkillCooldownProgress=require_bool(
                                action.get("inheritOriginSkillCdProgress"),
                                f"{action_path}.inheritOriginSkillCdProgress",
                            ),
                            specificRevertedSkillId=require_bool(
                                action.get("specificRevertedSkillId"),
                                f"{action_path}.specificRevertedSkillId",
                            ),
                            revertedSkillId=reverted_skill_id,
                        )
                    )
    return tuple(result)


def parse_skill_event_listeners(
    root: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
    services: BuffEventParserServices,
) -> tuple[SkillEventListenerSource, ...]:
    """解析技能区间内的事件监听器；事件动作不会被提升为无条件时间轴动作。"""
    walk_unconditional_actions = services.walk_unconditional_actions
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[SkillEventListenerSource] = []
    listener_fields = {
        "$type",
        "isEnable",
        "priorityLevel",
        "priorityOffset",
        "serverActionIndex",
        "abilityActionMap",
    }
    event_fields = {"abilityEvent", "actions"}
    sequence_fields = {
        "actionData",
        "onlyExecuteWhenSourceIsMainChar",
        "onlyExecuteWhenSourceIsGuard",
    }
    for timeline_index, raw_timeline in enumerate(
        require_list(
            group.get("timelineActions"),
            f"{source_name}.actionGroupData.timelineActions",
        )
    ):
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
                action.get("isEnable") is False
                or action_name(action["$type"]) != "EventListenerAction"
            ):
                continue
            action_path = f"{timeline_path}.EventListenerAction"
            unknown_listener_fields = sorted(set(action) - listener_fields)
            if unknown_listener_fields:
                raise ValueError(
                    f"{action_path}: unsupported fields {unknown_listener_fields}"
                )
            action_index = require_server_action_index(action, action_path)
            priority_level = action.get("priorityLevel")
            priority_offset = action.get("priorityOffset")
            if not isinstance(priority_level, str) or not priority_level:
                raise ValueError(f"{action_path}.priorityLevel: expected non-empty string")
            if not isinstance(priority_offset, int) or isinstance(priority_offset, bool):
                raise ValueError(f"{action_path}.priorityOffset: expected integer")
            for event_index, raw_event in enumerate(
                require_list(action.get("abilityActionMap"), f"{action_path}.abilityActionMap")
            ):
                event_path = f"{action_path}.abilityActionMap[{event_index}]"
                event = require_dict(raw_event, event_path)
                unknown_event_fields = sorted(set(event) - event_fields)
                if unknown_event_fields:
                    raise ValueError(
                        f"{event_path}: unsupported fields {unknown_event_fields}"
                    )
                event_name = event.get("abilityEvent")
                if not isinstance(event_name, str) or not event_name:
                    raise ValueError(f"{event_path}.abilityEvent: expected string")
                sequences: list[SkillEventActionSequenceSource] = []
                for sequence_index, raw_sequence in enumerate(
                    require_list(event.get("actions"), f"{event_path}.actions")
                ):
                    sequence_path = f"{event_path}.actions[{sequence_index}]"
                    sequence = require_dict(raw_sequence, sequence_path)
                    unknown_sequence_fields = sorted(set(sequence) - sequence_fields)
                    if unknown_sequence_fields:
                        raise ValueError(
                            f"{sequence_path}: unsupported fields {unknown_sequence_fields}"
                        )
                    actions = [
                        item
                        for item in walk_unconditional_actions(sequence.get("actionData"))
                        if item.get("isEnable") is not False
                    ]
                    if not actions:
                        continue
                    ordered_action_types = tuple(action_name(item["$type"]) for item in actions)
                    buff_applications = tuple(
                        EventBuffApplicationSource(
                            actionIndex=require_server_action_index(item, sequence_path),
                            payload=parse_buff_application_payload(
                                item, sequence_path, blackboard
                            ),
                        )
                        for item in actions
                        if action_name(item["$type"]) == "CreateBuffAction"
                    )
                    sequences.append(
                        SkillEventActionSequenceSource(
                            onlyMainOperator=require_bool(
                                sequence.get("onlyExecuteWhenSourceIsMainChar"),
                                f"{sequence_path}.onlyExecuteWhenSourceIsMainChar",
                            ),
                            onlyGuard=require_bool(
                                sequence.get("onlyExecuteWhenSourceIsGuard"),
                                f"{sequence_path}.onlyExecuteWhenSourceIsGuard",
                            ),
                            orderedActionTypes=ordered_action_types,
                            combatActions=tuple(
                                name
                                for name in ordered_action_types
                                if name in AUDITED_COMBAT_ACTION_NAMES
                            ),
                            buffApplications=buff_applications,
                            actions=parse_ordered_action_sequence(
                                sequence.get("actionData"),
                                sequence_path,
                                blackboard,
                            ),
                            priority=parse_sequence_action_priority(
                                actions, sequence_path
                            ),
                        )
                    )
                result.append(
                    SkillEventListenerSource(
                        startFrame=start_frame,
                        endFrame=end_frame,
                        actionIndex=action_index,
                        priorityLevel=priority_level,
                        priorityOffset=priority_offset,
                        event=event_name,
                        sequences=tuple(sequences),
                        sequenceIndex=timeline_index,
                    )
                )
    return tuple(result)
