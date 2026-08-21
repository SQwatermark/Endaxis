"""解析解包数据中的目标选择器与目标引用。

该模块只保留判断目标身份所需的结构，不负责把目标归约为 Endaxis 的单敌人模型。
未知选择器和字段会立即报错，避免调用方在条件、Buff 与目标组解析中各自猜测。
"""

from __future__ import annotations

from typing import Any

from source_models import TargetReferenceSource
from source_schema import (
    KNOWN_TARGET_FINDER_TYPES,
    KNOWN_TARGET_POST_PROCESSOR_TYPES,
    KNOWN_TARGET_VALIDATOR_TYPES,
    TARGET_GROUP_MERGE_INPUT_FIELDS,
)
from source_utils import require_bool, require_dict, require_list

__all__ = [
    "parse_character_team_selection_role",
    "parse_selector_summary",
    "parse_spawned_entity_selector_identity",
    "parse_target_reference",
    "selector_component_name",
]


def parse_character_team_selection_role(value: Any, path: str) -> str | None:
    """识别已取证的主控与最低生命比例队友选择器。"""
    selector = require_dict(value, path)
    finder = selector.get("finderData")
    if not isinstance(finder, dict) or selector_component_name(finder, f"{path}.finderData") != "CharacterTeamFinder":
        return None
    if set(finder) != {"$type"}:
        raise ValueError(f"{path}.finderData: unexpected CharacterTeamFinder fields")
    validators = require_list(selector.get("validatorData"), f"{path}.validatorData")
    processors = require_list(selector.get("postProcessorData"), f"{path}.postProcessorData")
    if len(validators) == 1 and not processors:
        validator = require_dict(validators[0], f"{path}.validatorData[0]")
        if (
            selector_component_name(validator, f"{path}.validatorData[0]")
            == "MainCharacterValidator"
            and set(validator) == {"$type"}
        ):
            return "controlledOperator"
        return None
    if validators or len(processors) not in {1, 2}:
        return None
    exclusion_role: str | None = None
    priority_index = 1 if len(processors) == 2 else 0
    if len(processors) == 2:
        exclusion = require_dict(processors[0], f"{path}.postProcessorData[0]")
        if selector_component_name(exclusion, f"{path}.postProcessorData[0]") != "ExcludeTarget":
            return None
        if set(exclusion) != {"$type", "excludedTargetSettings"}:
            raise ValueError(f"{path}.postProcessorData[0]: unexpected ExcludeTarget fields")
        excluded = parse_target_reference(
            exclusion.get("excludedTargetSettings"),
            f"{path}.postProcessorData[0].excludedTargetSettings",
        )
        if (
            excluded.targetSource == "Context"
            and excluded.targetGroupKey == "Main"
            and excluded.finderType is None
            and not excluded.validatorTypes
            and not excluded.postProcessorTypes
        ):
            exclusion_role = "Controlled"
        elif (
            excluded.targetSource == "Owner"
            and not excluded.targetGroupKey
            and excluded.finderType is None
            and not excluded.validatorTypes
            and not excluded.postProcessorTypes
        ):
            exclusion_role = "Caster"
        else:
            return None
    priority_path = f"{path}.postProcessorData[{priority_index}]"
    priority = require_dict(processors[priority_index], priority_path)
    if selector_component_name(priority, priority_path) != "PriorityFilter":
        return None
    expected_priority_fields = {
        "$type", "filterType", "onlyReserveMaxPriorityTargets", "limitMaxNum",
        "maxNum", "buffFilterSettings",
    }
    if set(priority) != expected_priority_fields:
        raise ValueError(f"{priority_path}: unexpected PriorityFilter fields")
    if not (
        priority.get("filterType") == "CurHpRatioAsc"
        and priority.get("onlyReserveMaxPriorityTargets") is False
        and priority.get("limitMaxNum") is True
        and priority.get("maxNum") == 1
    ):
        return None
    buff_filter = require_dict(
        priority.get("buffFilterSettings"),
        f"{priority_path}.buffFilterSettings",
    )
    if set(buff_filter) != {"buffSettings", "buffStackNumType"}:
        raise ValueError(f"{priority_path}.buffFilterSettings: unexpected fields")
    buff_settings = require_dict(
        buff_filter.get("buffSettings"),
        f"{priority_path}.buffFilterSettings.buffSettings",
    )
    tag_query = require_dict(
        buff_settings.get("tagQuery"),
        f"{priority_path}.buffFilterSettings.buffSettings.tagQuery",
    )
    if not (
        set(buff_settings) == {"checkType", "buffIdList", "tagQuery"}
        and buff_settings.get("checkType") == "Id"
        and buff_settings.get("buffIdList") == []
        and set(tag_query) == {"queryType", "tags"}
        and tag_query.get("queryType") == "HasAny"
        and tag_query.get("tags") == []
        and buff_filter.get("buffStackNumType") == "BuffCount"
    ):
        return None
    if exclusion_role is None:
        return "lowestHealthRatioOperator"
    return f"lowestHealthRatioOperatorExcept{exclusion_role}"


def parse_spawned_entity_selector_identity(
    value: Any,
    path: str,
) -> tuple[str | None, tuple[tuple[str, tuple[int, ...]], ...]]:
    """保留 owner-spawned 实体集合的对象种类与标签查询，不推断其数量或位置。"""
    selector = require_dict(value, path)
    spawned_object_type: str | None = None
    if "finderData" in selector:
        finder = require_dict(selector.get("finderData"), f"{path}.finderData")
        if selector_component_name(finder, f"{path}.finderData") == "OwnerSpawnedEntityFinder":
            if set(finder) != {"$type", "spawnedObjectType"}:
                raise ValueError(
                    f"{path}.finderData: unexpected owner-spawned finder fields "
                    f"{sorted(finder)}"
                )
            spawned_object_type = finder.get("spawnedObjectType")
            if not isinstance(spawned_object_type, str) or not spawned_object_type:
                raise ValueError(
                    f"{path}.finderData.spawnedObjectType: expected non-empty string"
                )

    tag_queries: list[tuple[str, tuple[int, ...]]] = []
    for index, raw_validator in enumerate(
        require_list(selector.get("validatorData"), f"{path}.validatorData")
    ):
        validator_path = f"{path}.validatorData[{index}]"
        validator = require_dict(raw_validator, validator_path)
        if selector_component_name(validator, validator_path) != "TagValidator":
            continue
        if set(validator) != {"$type", "query"}:
            raise ValueError(
                f"{validator_path}: unexpected tag-validator fields {sorted(validator)}"
            )
        query = require_dict(validator.get("query"), f"{validator_path}.query")
        if set(query) != {"queryType", "tags"}:
            raise ValueError(
                f"{validator_path}.query: unexpected fields {sorted(query)}"
            )
        query_type = query.get("queryType")
        if query_type not in {"HasAny", "HasAll", "ExceptAny", "ExceptAll"}:
            raise ValueError(
                f"{validator_path}.query.queryType: unsupported value {query_type!r}"
            )
        tags: list[int] = []
        for tag_index, raw_tag in enumerate(
            require_list(query.get("tags"), f"{validator_path}.query.tags")
        ):
            tag_path = f"{validator_path}.query.tags[{tag_index}]"
            tag = require_dict(raw_tag, tag_path)
            if set(tag) != {"tagId"}:
                raise ValueError(f"{tag_path}: unexpected fields {sorted(tag)}")
            tag_id = tag.get("tagId")
            if not isinstance(tag_id, int) or isinstance(tag_id, bool):
                raise ValueError(f"{tag_path}.tagId: expected integer")
            tags.append(tag_id)
        tag_queries.append((query_type, tuple(tags)))
    return spawned_object_type, tuple(tag_queries)

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


