"""Buff 标签、修正、生命周期与递归定义来源解析。"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Iterable, Mapping

from action_kinds import AUDITED_COMBAT_ACTION_NAMES
from action_payload_parser import parse_scalar, parse_tag_query
from conditional_parser import parse_conditional_actions
from source_models import (
    AbilityEntityHitSource,
    AbilityEntitySpawnPayload,
    BuffAttributeModifierSource,
    BuffDamageModifierSource,
    BuffDamageNumberComparisonSource,
    BuffDamageScaleProcessorSource,
    BuffDefinitionSource,
    BuffLifecycleSource,
    BuffSourceDeathFinishSource,
    HealthConditionSource,
    ScalarSource,
    UnparsedBuffPayloadSource,
)
from source_utils import action_name, require_bool, require_dict, require_list
from target_parser import parse_target_reference


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
SLOW_GAMEPLAY_TAG_ID = 1925762097


@dataclass(frozen=True)
class BuffDefinitionParserServices:
    """由入口注入的递归依赖、动作载荷与项目映射服务。"""

    comparison_operator_map: Mapping[str, str]
    decode_damage_decorate_mask: Callable[..., Any]
    collect_created_buff_ids: Callable[..., Any]
    load_projected_skill_data: Callable[..., Any]
    parse_auxiliary_actions: Callable[..., Any]
    parse_blackboard_calculations: Callable[..., Any]
    parse_blackboard_runtime_actions: Callable[..., Any]
    parse_buff_aura_actions: Callable[..., Any]
    parse_buff_event_actions: Callable[..., Any]
    parse_buff_ignite_event_actions: Callable[..., Any]
    parse_buff_skill_replacements: Callable[..., Any]
    parse_declared_blackboard: Callable[..., Any]
    parse_direct_damage_hits: Callable[..., Any]
    parse_interval_damage_hits: Callable[..., Any]
    parse_inflictions: Callable[..., Any]
    parse_resource_gains: Callable[..., Any]
    parse_target_group_writes: Callable[..., Any]
    resolve_ability_entity_payload: Callable[..., Any]
    target_reference_is_plain: Callable[..., Any]
    walk_actions: Callable[..., Any]


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


def parse_buff_child_slow_tag_ids(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
    *,
    services: BuffDefinitionParserServices,
) -> tuple[int, ...]:
    """在定点模型中把与宿主同生命周期的 Slow 子效果折叠为宿主减速标签。"""
    found = 0
    projected = 0
    lifecycle_duration = parse_scalar(
        buff.get("duration"), f"{source_name}.duration", blackboard
    )
    for event_index, raw_event in enumerate(
        require_list(buff.get("buffEventAction", []), f"{source_name}.buffEventAction")
    ):
        event_path = f"{source_name}.buffEventAction[{event_index}]"
        event = require_dict(raw_event, event_path)
        for sequence_index, raw_sequence in enumerate(
            require_list(event.get("actions"), f"{event_path}.actions")
        ):
            sequence_path = f"{event_path}.actions[{sequence_index}]"
            sequence = require_dict(raw_sequence, sequence_path)
            if "$type" in sequence:
                raw_actions = [sequence]
            elif isinstance(sequence.get("actionData"), list):
                raw_actions = sequence["actionData"]
            else:
                continue
            for action_index, raw_action in enumerate(
                raw_actions
            ):
                action_path = f"{sequence_path}.actionData[{action_index}]"
                action = require_dict(raw_action, action_path)
                if action_name(str(action.get("$type", ""))) != "SlowAction":
                    continue
                if action.get("isEnable") is False:
                    continue
                found += 1
                source = parse_target_reference(action.get("source"), f"{action_path}.source")
                target = parse_target_reference(action.get("target"), f"{action_path}.target")
                duration = parse_scalar(action.get("duration"), f"{action_path}.duration", blackboard)
                parse_scalar(action.get("rate"), f"{action_path}.rate", blackboard)
                child_buff_id = require_dict(
                    action.get("childBuffId"), f"{action_path}.childBuffId"
                )
                duration_matches_lifecycle = (
                    duration.blackboardKey is not None
                    and duration.blackboardKey == lifecycle_duration.blackboardKey
                    and duration.levelValues == lifecycle_duration.levelValues
                )
                if (
                    event.get("buffEvent") == "DuringBuffEnable"
                    and source.targetSource == "Source"
                    and target.targetSource == "Owner"
                    and services.target_reference_is_plain(source)
                    and services.target_reference_is_plain(target)
                    and duration_matches_lifecycle
                    and action.get("overrideChildBuffId") is False
                    and child_buff_id
                    == {"useBlackboardKey": False, "value": "", "blackboardKey": ""}
                    and action.get("asChildBuff") is True
                    and action.get("enhancingList") == []
                    and action.get("autoFinishByAction") is True
                ):
                    projected += 1
    return (SLOW_GAMEPLAY_TAG_ID,) if found > 0 and projected == found else ()


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
    is_converted = config.get("isConvertedAttribute")
    if not isinstance(is_converted, bool):
        raise ValueError(
            f"{source_name}.attributeModifier.isConvertedAttribute: expected boolean"
        )
    # true 表示该 Buff 的修正来自“已转换属性”；具体来源身份由 BuffDefinitionSource
    # 继续传给运行时，attributeModifiers 本身仍按同一八槽公式逐项解析。

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


def parse_buff_damage_modifiers(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
    services: BuffDefinitionParserServices,
) -> tuple[tuple[BuffDamageModifierSource, ...], int]:
    """解析 Buff 在伤害结算阶段注册的目标标签条件与倍率处理器。"""
    COMPARISON_OPERATOR_MAP = services.comparison_operator_map
    decode_damage_decorate_mask = services.decode_damage_decorate_mask
    result: list[BuffDamageModifierSource] = []
    unsupported_count = 0
    for index, raw_modifier in enumerate(
        require_list(buff.get("damageModifier", []), f"{source_name}.damageModifier")
    ):
        path = f"{source_name}.damageModifier[{index}]"
        modifier = require_dict(raw_modifier, path)
        if set(modifier) != {"enableSide", "condition", "damageProcessors"}:
            raise ValueError(f"{path}: unexpected fields {sorted(modifier)}")
        enabled_side = modifier.get("enableSide")
        if enabled_side not in {"Attacker", "Defender"}:
            raise ValueError(f"{path}.enableSide: unsupported value {enabled_side!r}")

        condition = require_dict(modifier.get("condition"), f"{path}.condition")
        expected_condition_fields = {
            "actionData",
            "onlyExecuteWhenSourceIsMainChar",
            "onlyExecuteWhenSourceIsGuard",
        }
        if set(condition) != expected_condition_fields:
            raise ValueError(f"{path}.condition: unexpected fields {sorted(condition)}")
        if require_bool(
            condition.get("onlyExecuteWhenSourceIsMainChar"),
            f"{path}.condition.onlyExecuteWhenSourceIsMainChar",
        ) or require_bool(
            condition.get("onlyExecuteWhenSourceIsGuard"),
            f"{path}.condition.onlyExecuteWhenSourceIsGuard",
        ):
            raise ValueError(f"{path}.condition: source-role gates are unsupported")
        condition_actions = require_list(
            condition.get("actionData"), f"{path}.condition.actionData"
        )
        condition_types = tuple(
            action_name(str(require_dict(item, f"{path}.condition.actionData[]").get("$type", "")))
            for item in condition_actions
        )
        target = None
        query_type = "hasAny"
        tag_ids: tuple[int, ...] = ()
        owner_controlled = False
        damage_tag_match = None
        damage_tags: tuple[str, ...] = ()
        damage_feature_match = None
        damage_features: tuple[str, ...] = ()
        number_comparisons: tuple[BuffDamageNumberComparisonSource, ...] = ()
        health_comparisons: tuple[HealthConditionSource, ...] = ()
        if not condition_types:
            pass
        elif condition_types == ("CheckTagMatch",):
            tag_path = f"{path}.condition.actionData[0]"
            tag_condition = require_dict(condition_actions[0], tag_path)
            if set(tag_condition) != {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "checkTarget", "query",
            }:
                raise ValueError(f"{tag_path}: unexpected fields {sorted(tag_condition)}")
            if tag_condition.get("isEnable") is not True:
                raise ValueError(f"{tag_path}.isEnable: expected true")
            target = parse_target_reference(
                tag_condition.get("checkTarget"), f"{tag_path}.checkTarget"
            )
            query_type, tag_ids = parse_tag_query(
                tag_condition.get("query"), f"{tag_path}.query"
            )
            if not tag_ids:
                raise ValueError(f"{path}.condition: empty tag query")
        elif condition_types == (
            "CheckMainCharacterCondition", "CheckDamageDecorateMask", "CompareFloat"
        ):
            main_path = f"{path}.condition.actionData[0]"
            main = require_dict(condition_actions[0], main_path)
            if set(main) != {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "checkTarget",
            } or main.get("isEnable") is not True:
                raise ValueError(f"{main_path}: unsupported main-character condition shape")
            main_target = parse_target_reference(main.get("checkTarget"), f"{main_path}.checkTarget")
            if main_target.targetSource != "Owner" or main_target.targetGroupKey:
                raise ValueError(f"{main_path}.checkTarget: expected plain Owner")
            owner_controlled = True

            mask_path = f"{path}.condition.actionData[1]"
            mask_condition = require_dict(condition_actions[1], mask_path)
            if set(mask_condition) != {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "checkType", "mask",
            } or mask_condition.get("isEnable") is not True:
                raise ValueError(f"{mask_path}: unsupported damage-mask condition shape")
            damage_tag_match = {
                "HasAny": "hasAny", "HasAll": "hasAll",
                "ExceptAny": "exceptAny", "ExceptAll": "exceptAll",
            }.get(mask_condition.get("checkType"))
            if damage_tag_match is None:
                raise ValueError(
                    f"{mask_path}.checkType: unsupported value {mask_condition.get('checkType')!r}"
                )
            mask = mask_condition.get("mask")
            if not isinstance(mask, int) or isinstance(mask, bool) or mask < 0:
                raise ValueError(f"{mask_path}.mask: expected non-negative integer")
            damage_tags, damage_features = decode_damage_decorate_mask(mask, mask_path)
            damage_feature_match = damage_tag_match if damage_features else None

            compare_path = f"{path}.condition.actionData[2]"
            comparison = require_dict(condition_actions[2], compare_path)
            if set(comparison) != {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "valueA", "compare", "valueB",
            } or comparison.get("isEnable") is not True:
                raise ValueError(f"{compare_path}: unsupported float-comparison shape")
            operator = comparison.get("compare")
            if operator not in COMPARISON_OPERATOR_MAP:
                raise ValueError(f"{compare_path}.compare: unsupported value {operator!r}")
            number_comparisons = (
                BuffDamageNumberComparisonSource(
                    left=parse_scalar(comparison.get("valueA"), f"{compare_path}.valueA", blackboard),
                    comparison=str(operator),
                    right=parse_scalar(comparison.get("valueB"), f"{compare_path}.valueB", blackboard),
                ),
            )
        elif condition_types == ("CheckHp",):
            health_path = f"{path}.condition.actionData[0]"
            health_condition = require_dict(condition_actions[0], health_path)
            if set(health_condition) != {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "hpOwner", "compare", "isRatio", "value",
            } or health_condition.get("isEnable") is not True:
                raise ValueError(f"{health_path}: unsupported health condition shape")
            health_target = parse_target_reference(
                health_condition.get("hpOwner"), f"{health_path}.hpOwner"
            )
            if (
                health_target.targetSource != "Target"
                or health_target.targetGroupKey
                or not services.target_reference_is_plain(health_target)
            ):
                raise ValueError(f"{health_path}.hpOwner: expected plain damage Target")
            comparison = health_condition.get("compare")
            if comparison not in COMPARISON_OPERATOR_MAP:
                raise ValueError(f"{health_path}.compare: unsupported value {comparison!r}")
            health_comparisons = (
                HealthConditionSource(
                    targetSource="Target",
                    targetGroupKey="",
                    comparison=str(comparison),
                    isRatio=require_bool(health_condition.get("isRatio"), f"{health_path}.isRatio"),
                    value=parse_scalar(health_condition.get("value"), f"{health_path}.value", blackboard),
                ),
            )
        else:
            unsupported_count += 1
            continue

        processors: list[BuffDamageScaleProcessorSource] = []
        raw_processors = require_list(
            modifier.get("damageProcessors"), f"{path}.damageProcessors"
        )
        if any(
            action_name(str(require_dict(item, f"{path}.damageProcessors[]").get("$type", "")))
            != "DamageScaleProcessor"
            for item in raw_processors
        ):
            unsupported_count += 1
            continue
        for processor_index, raw_processor in enumerate(
            raw_processors
        ):
            processor_path = f"{path}.damageProcessors[{processor_index}]"
            processor = require_dict(raw_processor, processor_path)
            if action_name(str(processor.get("$type", ""))) != "DamageScaleProcessor":
                raise ValueError(f"{processor_path}: unsupported damage processor")
            if set(processor) != {"$type", "side", "zoneName", "addition"}:
                raise ValueError(f"{processor_path}: unexpected fields {sorted(processor)}")
            side = processor.get("side")
            if side not in {"Attacker", "Defender"}:
                raise ValueError(f"{processor_path}.side: unsupported value {side!r}")
            zone = processor.get("zoneName")
            if not isinstance(zone, str) or not zone:
                raise ValueError(f"{processor_path}.zoneName: expected string")
            processors.append(
                BuffDamageScaleProcessorSource(
                    side=side,
                    zone=zone,
                    addition=parse_scalar(
                        processor.get("addition"),
                        f"{processor_path}.addition",
                        blackboard,
                    ),
                )
            )
        if not processors:
            raise ValueError(f"{path}.damageProcessors: expected non-empty list")
        result.append(
            BuffDamageModifierSource(
                enabledSide=enabled_side,
                targetSource=target.targetSource if target is not None else "",
                targetGroupKey=target.targetGroupKey if target is not None else "",
                tagQueryType=query_type,
                tagIds=tag_ids,
                processors=tuple(processors),
                ownerControlled=owner_controlled,
                damageTagMatch=damage_tag_match,
                damageTags=damage_tags,
                damageFeatureMatch=damage_feature_match,
                damageFeatures=damage_features,
                numberComparisons=number_comparisons,
                healthComparisons=health_comparisons,
            )
        )
    return tuple(result), unsupported_count


def parse_buff_start_vulnerability(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
    *,
    services: BuffDefinitionParserServices,
) -> tuple[BuffDamageModifierSource, ...]:
    """把严格的 OnBuffStart VulnerableAction 投影为 Buff 生命周期伤害修正。"""
    target_reference_is_plain = services.target_reference_is_plain
    result: list[BuffDamageModifierSource] = []
    for event_index, raw_event in enumerate(
        require_list(buff.get("buffEventAction", []), f"{source_name}.buffEventAction")
    ):
        event_path = f"{source_name}.buffEventAction[{event_index}]"
        event = require_dict(raw_event, event_path)
        if event.get("buffEvent") not in {"OnBuffStart", "DuringBuffEnable"}:
            continue
        for sequence_index, raw_sequence in enumerate(
            require_list(event.get("actions"), f"{event_path}.actions")
        ):
            sequence_path = f"{event_path}.actions[{sequence_index}]"
            sequence = require_dict(raw_sequence, sequence_path)
            raw_action_data = sequence.get("actionData")
            if not isinstance(raw_action_data, list):
                continue
            for action_index, raw_action in enumerate(
                raw_action_data
            ):
                action_path = f"{sequence_path}.actionData[{action_index}]"
                action = require_dict(raw_action, action_path)
                if action_name(str(action.get("$type", ""))) != "VulnerableAction":
                    continue
                expected_fields = {
                    "$type", "isEnable", "priorityLevel", "priorityOffset",
                    "serverActionIndex", "source", "target", "duration", "rate",
                    "overrideChildBuffId", "childBuffId", "asChildBuff",
                    "enhancingList", "autoFinishByAction", "subType",
                }
                if set(action) != expected_fields:
                    continue
                source = parse_target_reference(action.get("source"), f"{action_path}.source")
                target = parse_target_reference(action.get("target"), f"{action_path}.target")
                duration = parse_scalar(action.get("duration"), f"{action_path}.duration", blackboard)
                lifecycle_duration = parse_scalar(
                    buff.get("duration"), f"{source_name}.duration", blackboard
                )
                saved_lifetime = False
                if action_index > 0 and duration.blackboardKey is not None:
                    previous = require_dict(
                        raw_action_data[action_index - 1],
                        f"{sequence_path}.actionData[{action_index - 1}]",
                    )
                    if action_name(str(previous.get("$type", ""))) == "SaveBuffLifeTime":
                        saved_owner = parse_target_reference(
                            previous.get("buffOwner"), f"{action_path}.previous.buffOwner"
                        )
                        saved_settings = require_dict(
                            previous.get("buffSettings"),
                            f"{action_path}.previous.buffSettings",
                        )
                        saved_lifetime = (
                            previous.get("isEnable") is True
                            and previous.get("key") == duration.blackboardKey
                            and saved_owner.targetSource == "Owner"
                            and target_reference_is_plain(saved_owner)
                            and saved_settings.get("checkType") == "Environment"
                        )
                duration_matches_lifecycle = (
                    duration.blackboardKey is not None
                    and duration.blackboardKey == lifecycle_duration.blackboardKey
                    and duration.levelValues == lifecycle_duration.levelValues
                )
                indefinite_during_enable = (
                    event.get("buffEvent") == "DuringBuffEnable"
                    and buff.get("lifeType") == "Infinity"
                    and duration.blackboardKey is None
                    and duration.value == -1
                )
                if not (
                    action.get("isEnable") is True
                    and source.targetSource == "Source"
                    and target.targetSource == "Owner"
                    and target_reference_is_plain(source)
                    and target_reference_is_plain(target)
                    and (duration_matches_lifecycle or indefinite_during_enable or saved_lifetime)
                    and isinstance(action.get("overrideChildBuffId"), bool)
                    and action.get("asChildBuff") is True
                    and action.get("enhancingList") == []
                    and action.get("autoFinishByAction") is saved_lifetime
                    and action.get("subType")
                    in {"Physical", "Spell", "Fire", "Pulse", "Crystal", "Natural"}
                ):
                    continue
                damage_types = {
                    "Physical": ("physical",),
                    "Spell": ("heat", "electric", "cryo", "nature"),
                    "Fire": ("heat",),
                    "Pulse": ("electric",),
                    "Crystal": ("cryo",),
                    "Natural": ("nature",),
                }[str(action.get("subType"))]
                result.append(
                    BuffDamageModifierSource(
                        enabledSide="Defender",
                        targetSource="Owner",
                        targetGroupKey="",
                        tagQueryType="hasAny",
                        tagIds=(),
                        processors=(
                            BuffDamageScaleProcessorSource(
                                side="Defender",
                                zone="VulnerableDmgIncreace",
                                addition=parse_scalar(
                                    action.get("rate"), f"{action_path}.rate", blackboard
                                ),
                            ),
                        ),
                        damageTypes=damage_types,
                    )
                )
    return tuple(result)

UNPARSED_BUFF_PAYLOAD_FIELDS = (
    "globalModifier",
    "healModifier",
    "poiseModifier",
    "shieldConfigs",
)


def collect_unparsed_buff_payloads(
    buff: dict[str, Any], source_name: str, unsupported_damage_modifiers: int = 0
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
    if unsupported_damage_modifiers:
        result.append(
            UnparsedBuffPayloadSource(
                field="damageModifier",
                entryCount=unsupported_damage_modifiers,
            )
        )
    return tuple(result)


def resolve_buff_definitions(
    buff_ids: tuple[str, ...],
    buff_source_dirs: Path | Iterable[Path],
    skill_source_dir: Path | None = None,
    excluded_buff_ids: Iterable[str] = (),
    *,
    services: BuffDefinitionParserServices,
) -> tuple[BuffDefinitionSource, ...]:
    """解析传递 Buff 依赖的定义事实；应用参数不得污染定义自身的黑板默认值。

    多个候选目录按顺序查找：主目录仍是人工整理的 `BuffData`，缺文件时回退到
    `buff-data-current` 之类的完整导出，避免公共 Buff 仅因不在精选目录中而被误报缺失。
    """
    collect_created_buff_ids = services.collect_created_buff_ids
    load_projected_skill_data = services.load_projected_skill_data
    parse_auxiliary_actions = services.parse_auxiliary_actions
    parse_blackboard_calculations = services.parse_blackboard_calculations
    parse_blackboard_runtime_actions = services.parse_blackboard_runtime_actions
    parse_buff_aura_actions = services.parse_buff_aura_actions
    parse_buff_event_actions = services.parse_buff_event_actions
    parse_buff_ignite_event_actions = services.parse_buff_ignite_event_actions
    parse_buff_skill_replacements = services.parse_buff_skill_replacements
    parse_declared_blackboard = services.parse_declared_blackboard
    parse_direct_damage_hits = services.parse_direct_damage_hits
    parse_interval_damage_hits = services.parse_interval_damage_hits
    parse_inflictions = services.parse_inflictions
    parse_resource_gains = services.parse_resource_gains
    parse_target_group_writes = services.parse_target_group_writes
    resolve_ability_entity_payload = services.resolve_ability_entity_payload
    walk_actions = services.walk_actions
    dirs = (
        (buff_source_dirs,)
        if isinstance(buff_source_dirs, Path)
        else tuple(buff_source_dirs)
    )
    result: dict[str, BuffDefinitionSource] = {}
    excluded = frozenset(excluded_buff_ids)
    pending = [buff_id for buff_id in buff_ids if buff_id not in excluded]
    while pending:
        buff_id = pending.pop(0)
        if buff_id in result:
            continue
        source_file = f"{buff_id}.json"
        source_path = next(
            (candidate / source_file for candidate in dirs if (candidate / source_file).is_file()),
            None,
        )
        if source_path is None:
            result[buff_id] = BuffDefinitionSource(
                buffId=buff_id,
                sourceFile=source_file,
                sourceAvailable=False,
                lifecycle=None,
                blackboard=(),
                applyTagIds=(),
                extendTagIds=(),
                attributeModifiers=(),
                damageModifiers=(),
                directDamageHits=(),
                inflictions=(),
                conditionalActions=(),
                blackboardCalculations=(),
                blackboardMutations=(),
                buffBlackboardReads=(),
                buffFinishes=(),
                eventActions=(),
                igniteEventActions=(),
                sourceDeathFinish=None,
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
        damage_modifiers, unsupported_damage_modifiers = parse_buff_damage_modifiers(
            buff, source_file, blackboard, services=services
        )
        damage_modifiers = (
            *damage_modifiers,
            *parse_buff_start_vulnerability(
                buff, source_file, blackboard, services=services
            ),
        )
        child_slow_tag_ids = parse_buff_child_slow_tag_ids(
            buff, source_file, blackboard, services=services
        )
        event_actions = parse_buff_event_actions(
            buff,
            source_file,
            blackboard,
            projected_action_names=(
                frozenset({"SlowAction"}) if child_slow_tag_ids else frozenset()
            ),
        )
        ignite_event_actions = parse_buff_ignite_event_actions(buff, source_file, blackboard)
        auxiliary_actions = parse_auxiliary_actions(
            adapted_root,
            source_file,
            skill_source_dir or source_path.parent,
            blackboard,
        )
        invoked_skills: list[AbilityEntityHitSource] = []
        invoked_skill_ids: set[str] = set()
        if skill_source_dir is not None:
            for event in event_actions:
                for loop in event.forEachActions:
                    for skill_cast in loop.skillCasts:
                        if skill_cast.skillId in invoked_skill_ids:
                            continue
                        invoked_skill_ids.add(skill_cast.skillId)
                        child_name = f"{skill_cast.skillId}.json"
                        child_path = skill_source_dir / child_name
                        if not child_path.is_file():
                            raise FileNotFoundError(
                                f"{source_file}: missing invoked AbilityEntity skill {child_path}"
                            )
                        child = load_projected_skill_data(child_path, child_name)
                        invoked_skills.append(
                            resolve_ability_entity_payload(
                                AbilityEntitySpawnPayload(
                                    abilityEntityId="<existingAbilityEntity>",
                                    skillId=skill_cast.skillId,
                                    assignBlackboard=True,
                                    sourceType="ActionSource",
                                ),
                                child,
                                child_name,
                                skill_source_dir,
                                0,
                                (),
                                blackboard,
                                (skill_cast.actionIndex,),
                            )
                        )
        result[buff_id] = BuffDefinitionSource(
            buffId=buff_id,
            sourceFile=source_file,
            sourceAvailable=True,
            lifecycle=parse_buff_lifecycle(buff, source_file, blackboard),
            blackboard=declared_blackboard,
            applyTagIds=tuple(
                dict.fromkeys(
                    (*parse_buff_apply_tag_ids(buff, source_file), *child_slow_tag_ids)
                )
            ),
            extendTagIds=parse_buff_extend_tag_ids(buff, source_file),
            attributeModifiers=parse_buff_attribute_modifiers(
                buff, source_file, blackboard
            ),
            damageModifiers=damage_modifiers,
            directDamageHits=parse_direct_damage_hits(adapted_root, source_file, blackboard),
            intervalDamageHits=parse_interval_damage_hits(
                adapted_root, source_file, blackboard
            ),
            inflictions=parse_inflictions(adapted_root, source_file),
            conditionalActions=parse_conditional_actions(adapted_root, source_file, blackboard),
            blackboardCalculations=parse_blackboard_calculations(
                adapted_root, source_file, blackboard
            ),
            blackboardMutations=mutations,
            buffBlackboardReads=reads,
            buffFinishes=finishes,
            eventActions=event_actions,
            igniteEventActions=ignite_event_actions,
            sourceDeathFinish=parse_buff_source_death_finish(
                buff, source_file, blackboard, services=services
            ),
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
            unparsedPayloads=collect_unparsed_buff_payloads(
                buff, source_file, unsupported_damage_modifiers
            ),
            auraActions=parse_buff_aura_actions(buff, source_file, blackboard),
            invokedAbilityEntitySkills=tuple(invoked_skills),
            auxiliaryActions=auxiliary_actions,
            targetGroupWrites=parse_target_group_writes(adapted_root, source_file),
            skillReplacements=parse_buff_skill_replacements(buff, source_file, blackboard),
            attributeModifiersConverted=require_dict(
                buff.get("attributeModifier"), f"{source_file}.attributeModifier"
            ).get("isConvertedAttribute")
            is True,
            useTimeDilationDt=require_bool(
                buff.get("useTimeDilationDt", False),
                f"{source_file}.useTimeDilationDt",
            ),
            onlyUseSelfTimeDilation=require_bool(
                buff.get("onlyUseSelfTimeDilation", False),
                f"{source_file}.onlyUseSelfTimeDilation",
            ),
        )
        pending.extend(
            child_id
            for child_id in collect_created_buff_ids(buff, source_file)
            if child_id not in result and child_id not in excluded
        )
        pending.extend(
            action.sourceId
            for child in invoked_skills
            for action in child.auxiliaryActions
            if action.actionType == "CreateBuffAction"
            and action.sourceId not in result
            and action.sourceId not in excluded
        )
    return tuple(result[buff_id] for buff_id in sorted(result))

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

    stack_effect_action_types: list[str] = []
    raw_stack_effects = settings.get("stackEffects", [])
    if not isinstance(raw_stack_effects, list):
        raise ValueError(f"{source_name}.stackingSettings.stackEffects: expected list")
    for effect_index, raw_effect in enumerate(raw_stack_effects):
        effect_path = f"{source_name}.stackingSettings.stackEffects[{effect_index}]"
        effect = require_dict(raw_effect, effect_path)
        if set(effect) != {"effectActions"}:
            raise ValueError(f"{effect_path}: unexpected fields {sorted(effect)}")
        actions = require_list(effect.get("effectActions"), f"{effect_path}.effectActions")
        for action_index, raw_action in enumerate(actions):
            action_path = f"{effect_path}.effectActions[{action_index}]"
            action = require_dict(raw_action, action_path)
            type_name = action.get("$type")
            if isinstance(type_name, str):
                stack_effect_action_types.append(action_name(type_name))
            elif "effectActionCfg" in action:
                # BuffData 的 stackEffects.effectActions 是原生 EffectAction.Data
                # 类型化列表；当前导出格式会省略该列表元素的 $type。
                stack_effect_action_types.append("EffectAction")
            else:
                raise ValueError(f"{action_path}: cannot identify stack effect action type")
    # 客户端数据会在 isNeedStackEffect=false 时保留未启用的序列化动作；
    # 仍保留其类型供审计，但只有开关为 true 时才是运行时 stack effect。

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
        stackEffectActionTypes=tuple(stack_effect_action_types),
    )

def parse_buff_source_death_finish(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
    *,
    services: BuffDefinitionParserServices,
) -> BuffSourceDeathFinishSource | None:
    """识别 Source HP ratio <= 0 后结束 plain Owner 的周期监视器。"""
    target_reference_is_plain = services.target_reference_is_plain
    events = require_list(buff.get("buffEventAction", []), f"{source_name}.buffEventAction")
    if len(events) != 1:
        return None
    event = require_dict(events[0], f"{source_name}.buffEventAction[0]")
    if set(event) != {"buffEvent", "actions"} or event.get("buffEvent") != "OnBuffTrigger":
        return None
    sequences = require_list(event.get("actions"), f"{source_name}.buffEventAction[0].actions")
    if len(sequences) != 1:
        return None
    sequence = require_dict(sequences[0], f"{source_name}.buffEventAction[0].actions[0]")
    if set(sequence) != {
        "actionData",
        "onlyExecuteWhenSourceIsMainChar",
        "onlyExecuteWhenSourceIsGuard",
    }:
        return None
    if sequence.get("onlyExecuteWhenSourceIsMainChar") is not False:
        return None
    if sequence.get("onlyExecuteWhenSourceIsGuard") is not False:
        return None
    actions = require_list(sequence.get("actionData"), f"{source_name}.sourceDeathFinish.actions")
    if len(actions) != 2:
        return None
    health = require_dict(actions[0], f"{source_name}.sourceDeathFinish.health")
    finish = require_dict(actions[1], f"{source_name}.sourceDeathFinish.finish")
    common = {"$type", "isEnable", "priorityLevel", "priorityOffset", "serverActionIndex"}
    if action_name(str(health.get("$type", ""))) != "CheckHp" or set(health) != common | {
        "hpOwner",
        "compare",
        "isRatio",
        "value",
    }:
        return None
    if action_name(str(finish.get("$type", ""))) != "FinishOwnerAction" or set(finish) != common | {
        "owner",
        "skipDieDisplay",
    }:
        return None
    if health.get("isEnable") is False or finish.get("isEnable") is False:
        return None
    health_target = parse_target_reference(
        health.get("hpOwner"), f"{source_name}.sourceDeathFinish.health.hpOwner"
    )
    finish_target = parse_target_reference(
        finish.get("owner"), f"{source_name}.sourceDeathFinish.finish.owner"
    )
    value = parse_scalar(
        health.get("value"), f"{source_name}.sourceDeathFinish.health.value", blackboard
    )
    if not (
        health_target.targetSource == "Source"
        and target_reference_is_plain(health_target)
        and health.get("compare") == "LE"
        and health.get("isRatio") is True
        and value.blackboardKey is None
        and value.value == 0
        and finish_target.targetSource == "Owner"
        and target_reference_is_plain(finish_target)
    ):
        return None
    return BuffSourceDeathFinishSource(
        skipDieDisplay=require_bool(
            finish.get("skipDieDisplay"), f"{source_name}.sourceDeathFinish.finish.skipDieDisplay"
        )
    )
