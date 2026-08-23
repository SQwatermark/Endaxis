"""解析战斗动作中可复用的结构化载荷。

条件、Buff、投射物和根时间轴解析器共用这里的严格载荷语义；本模块不决定动作是否必然执行，
也不负责把解析结果编译为 Next DSL。
"""

from __future__ import annotations

import struct
from typing import Any, Iterable

from source_models import (
    AbilityEntityDurationAssignmentPayload,
    AbilityEntitySpawnPayload,
    BlackboardCalculationPayload,
    BlackboardMutationPayload,
    BuffApplicationEntryPayload,
    BuffApplicationPayload,
    BuffBlackboardReadPayload,
    BuffFinishPayload,
    BuffStackReadPayload,
    DamageUnitSource,
    EntityBlackboardAssignmentSource,
    GlobalCooldownApplicationPayload,
    HealPayload,
    InflictionPayload,
    InterruptPayload,
    PhysicalInflictionPayload,
    ProjectileLaunchPayload,
    ProjectileSkillTriggerSource,
    ResourceGainPayload,
    ScalarSource,
    SkillCooldownAdjustmentPayload,
    TimedKnockDownOutputSource,
    TimedMarkerApplicationPayload,
)
from source_utils import (
    action_name,
    require_bool,
    require_dict,
    require_list,
    require_non_negative_int,
    require_number,
)
from target_parser import parse_selector_summary, parse_target_reference

__all__ = [
    "classify_buff",
    "parse_ability_entity_duration_assignment_payload",
    "parse_ability_entity_spawn_payload",
    "parse_blackboard_calculation_payload",
    "parse_blackboard_mutation_payload",
    "parse_buff_application_entries",
    "parse_buff_application_payload",
    "parse_buff_assignments",
    "parse_buff_blackboard_read_payload",
    "parse_buff_find_settings",
    "parse_buff_finish_payload",
    "parse_buff_stack_read_payload",
    "parse_damage_units",
    "parse_entity_blackboard_assignments",
    "parse_global_cooldown_application_payload",
    "parse_heal_payload",
    "parse_infliction_payload",
    "parse_interrupt_payload",
    "parse_knock_down_output_payload",
    "parse_physical_infliction_payload",
    "parse_projectile_launch_payload",
    "parse_resource_gain_payload",
    "parse_scalar",
    "parse_skill_cooldown_adjustment_payload",
    "parse_tag_query",
    "parse_timed_marker_application_payload",
    "to_float32",
    "walk_single_enemy_actions",
]


def parse_knock_down_output_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
    *,
    start_frame: int,
    end_frame: int,
    action_path: tuple[str, ...] = (),
) -> TimedKnockDownOutputSource:
    """Strictly preserve a KnockDownAction payload for later model projection."""
    expected_fields = {
        "$type", "isEnable", "priorityLevel", "priorityOffset", "serverActionIndex",
        "source", "targetSettings", "forceKnockDown", "duration", "faceDirection",
        "immobilizedTime", "isExtra", "deadOption", "returnTrueWhen",
    }
    if set(action) != expected_fields:
        raise ValueError(f"{path}: unexpected KnockDownAction fields {sorted(action)}")
    face = require_dict(action.get("faceDirection"), f"{path}.faceDirection")
    direction = face.get("directionType")
    if not isinstance(direction, str) or not direction:
        raise ValueError(f"{path}.faceDirection.directionType: expected string")
    for key in ("deadOption", "returnTrueWhen"):
        if not isinstance(action.get(key), str) or not action[key]:
            raise ValueError(f"{path}.{key}: expected non-empty string")
    return TimedKnockDownOutputSource(
        startFrame=start_frame,
        endFrame=end_frame,
        actionIndex=require_non_negative_int(
            action.get("serverActionIndex"), f"{path}.serverActionIndex"
        ),
        source=parse_target_reference(action.get("source"), f"{path}.source"),
        target=parse_target_reference(
            action.get("targetSettings"), f"{path}.targetSettings"
        ),
        forceKnockDown=require_bool(
            action.get("forceKnockDown"), f"{path}.forceKnockDown"
        ),
        duration=parse_scalar(action.get("duration"), f"{path}.duration", inherited_blackboard),
        faceDirectionType=direction,
        immobilizedTime=require_number(
            action.get("immobilizedTime"), f"{path}.immobilizedTime"
        ),
        isExtra=require_bool(action.get("isExtra"), f"{path}.isExtra"),
        deadOption=action["deadOption"],
        returnTrueWhen=action["returnTrueWhen"],
        actionPath=action_path,
    )

TAG_QUERY_TYPE_MAP = {
    "HasAny": "hasAny",
    "HasAll": "hasAll",
    "ExceptAny": "exceptAny",
    "ExceptAll": "exceptAll",
}


def to_float32(value: float) -> float:
    """按原生单精度指令的舍入方式保存中间结果。"""
    return struct.unpack("<f", struct.pack("<f", value))[0]


def parse_skill_cooldown_adjustment_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> SkillCooldownAdjustmentPayload:
    """严格读取原生 SetSkillCdAtOnce；具体可执行形状由编译器判定。"""
    expected_fields = {
        "$type",
        "isEnable",
        "priorityLevel",
        "priorityOffset",
        "serverActionIndex",
        "target",
        "useSkillType",
        "skillTypeMask",
        "skillId",
        "functionType",
        "isPercentage",
        "value",
    }
    if set(action) != expected_fields:
        raise ValueError(f"{path}: unexpected SetSkillCdAtOnce fields {sorted(action)}")
    skill_id = action.get("skillId")
    if not isinstance(skill_id, str):
        raise ValueError(f"{path}.skillId: expected string")
    skill_type_mask = action.get("skillTypeMask")
    function_type = action.get("functionType")
    if not isinstance(skill_type_mask, str) or not isinstance(function_type, str):
        raise ValueError(f"{path}: expected cooldown enum names")
    return SkillCooldownAdjustmentPayload(
        target=parse_target_reference(action.get("target"), f"{path}.target"),
        useSkillType=require_bool(action.get("useSkillType"), f"{path}.useSkillType"),
        skillTypeMask=skill_type_mask,
        skillId=skill_id,
        functionType=function_type,
        isPercentage=require_bool(action.get("isPercentage"), f"{path}.isPercentage"),
        value=parse_scalar(action.get("value"), f"{path}.value", inherited_blackboard),
    )


def walk_single_enemy_actions(value: Any, path: str) -> Iterable[dict[str, Any]]:
    """在固定单敌人模型下，仅把证据明确的逐目标容器退化为一次顺序执行。"""
    if isinstance(value, dict):
        type_name = value.get("$type")
        if isinstance(type_name, str):
            name = action_name(type_name)
            if name == "ChannelingAction":
                expected_fields = {
                    "$type",
                    "isEnable",
                    "priorityLevel",
                    "priorityOffset",
                    "serverActionIndex",
                    "targetSettings",
                    "executeEachFrame",
                    "triggerInterval",
                    "maxCountPerTarget",
                    "targetTriggerInterval",
                    "actionOnTick",
                }
                if set(value) != expected_fields:
                    raise ValueError(
                        f"{path}.ChannelingAction: unexpected fields {sorted(value)}"
                    )
                if value.get("isEnable") is False:
                    return
                if value.get("maxCountPerTarget") != 1:
                    raise ValueError(
                        f"{path}.ChannelingAction: only one trigger per target is supported"
                    )
                yield from walk_single_enemy_actions(
                    value.get("actionOnTick"), f"{path}.ChannelingAction.actionOnTick"
                )
                return
            if name != "ForEachAction":
                yield value
                return
            expected_fields = {
                "$type",
                "isEnable",
                "priorityLevel",
                "priorityOffset",
                "serverActionIndex",
                "target",
                "action",
            }
            if set(value) != expected_fields:
                raise ValueError(f"{path}.ForEachAction: unexpected fields {sorted(value)}")
            if value.get("isEnable") is False:
                return
            target = require_dict(value.get("target"), f"{path}.ForEachAction.target")
            target_source = target.get("targetSource")
            target_group = target.get("targetGroupKey")
            if not (
                (target_source == "Context" and isinstance(target_group, str) and target_group)
                or (target_source == "Target" and target_group == "")
            ):
                raise ValueError(f"{path}.ForEachAction: unsupported target collection")
            yield from walk_single_enemy_actions(
                value.get("action"), f"{path}.ForEachAction.action"
            )
            return
        for key, child in value.items():
            yield from walk_single_enemy_actions(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk_single_enemy_actions(child, f"{path}[{index}]")


def parse_scalar(
    value: Any,
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> ScalarSource:
    source = require_dict(value, path)
    raw_value = source.get("value")
    if not isinstance(raw_value, (int, float)) or isinstance(raw_value, bool):
        raise ValueError(f"{path}.value: expected number")
    use_blackboard = source.get("useBlackboardKey")
    if not isinstance(use_blackboard, bool):
        raise ValueError(f"{path}.useBlackboardKey: expected boolean")
    key = source.get("blackboardKey")
    if not isinstance(key, str):
        raise ValueError(f"{path}.blackboardKey: expected string")
    if use_blackboard and not key:
        raise ValueError(f"{path}: active scalar blackboard reference has no key")
    blackboard_key = key if use_blackboard else None
    level_values = inherited_blackboard.get(blackboard_key) if blackboard_key else None
    return ScalarSource(
        value=float(raw_value),
        blackboardKey=blackboard_key,
        levelValues=level_values,
    )


def parse_blackboard_calculation_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> BlackboardCalculationPayload:
    key = action.get("key")
    operation = action.get("operation")
    if not isinstance(key, str) or not key:
        raise ValueError(f"{path}.key: expected non-empty string")
    if not isinstance(operation, str) or not operation:
        raise ValueError(f"{path}.operation: expected non-empty string")
    return BlackboardCalculationPayload(
        key=key,
        operation=operation,
        left=parse_scalar(action.get("value1"), f"{path}.value1", inherited_blackboard),
        right=parse_scalar(action.get("value2"), f"{path}.value2", inherited_blackboard),
    )


def parse_blackboard_mutation_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> BlackboardMutationPayload:
    key = action.get("key")
    operation = action.get("operation")
    if not isinstance(key, str) or not key:
        raise ValueError(f"{path}.key: expected non-empty string")
    if not isinstance(operation, str) or not operation:
        raise ValueError(f"{path}.operation: expected non-empty string")
    if action.get("directValue") is not True:
        raise ValueError(f"{path}.directValue: unsupported false")
    return BlackboardMutationPayload(
        key=key,
        operation=operation,
        value=parse_scalar(action.get("value"), f"{path}.value", inherited_blackboard),
    )


def parse_buff_blackboard_read_payload(
    action: dict[str, Any],
    path: str,
) -> BuffBlackboardReadPayload:
    output_key = action.get("blackboardKey")
    desired_key = action.get("desiredKey")
    if not isinstance(output_key, str) or not output_key:
        raise ValueError(f"{path}.blackboardKey: expected non-empty string")
    if not isinstance(desired_key, str) or not desired_key:
        raise ValueError(f"{path}.desiredKey: expected non-empty string")
    target = require_dict(action.get("targetSettings"), f"{path}.targetSettings")
    check_type, buff_ids, query_type, tag_ids = parse_buff_find_settings(
        action.get("buffSettings"), f"{path}.buffSettings"
    )
    return BuffBlackboardReadPayload(
        outputKey=output_key,
        desiredKey=desired_key,
        targetSource=str(target.get("targetSource", "")),
        targetGroupKey=str(target.get("targetGroupKey", "")),
        buffCheckType=check_type,
        buffIds=buff_ids,
        tagQueryType=query_type,
        buffTagIds=tag_ids,
    )


def parse_buff_finish_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> BuffFinishPayload:
    target = require_dict(action.get("buffOwner"), f"{path}.buffOwner")
    check_type, buff_ids, query_type, tag_ids = parse_buff_find_settings(
        action.get("buffSettings"), f"{path}.buffSettings"
    )
    return BuffFinishPayload(
        targetSource=str(target.get("targetSource", "")),
        targetGroupKey=str(target.get("targetGroupKey", "")),
        buffCheckType=check_type,
        buffIds=buff_ids,
        tagQueryType=query_type,
        buffTagIds=tag_ids,
        finishAll=action.get("finishAll") is True,
        limitSource=action.get("limitSource") is True,
        isFinishedEarly=action.get("isFinishedEarly") is True,
        isAbsorbed=action.get("isAbsorbed") is True,
        finishLayerCount=(
            None
            if action.get("finishAll") is True
            else parse_scalar(
                action.get("finishLayerCnt"),
                f"{path}.finishLayerCnt",
                inherited_blackboard,
            )
        ),
    )


def parse_buff_stack_read_payload(action: dict[str, Any], path: str) -> BuffStackReadPayload:
    output_key = action.get("key")
    count_type = action.get("buffStackNumType")
    limit_skill_cast_id = action.get("limitSkillCastId")
    if not isinstance(output_key, str) or not output_key:
        raise ValueError(f"{path}.key: expected non-empty string")
    if not isinstance(count_type, str) or not count_type:
        raise ValueError(f"{path}.buffStackNumType: expected non-empty string")
    if not isinstance(limit_skill_cast_id, bool):
        raise ValueError(f"{path}.limitSkillCastId: expected boolean")
    target = require_dict(action.get("checkTarget"), f"{path}.checkTarget")
    check_type, buff_ids, query_type, tag_ids = parse_buff_find_settings(
        action.get("buffSettings"), f"{path}.buffSettings"
    )
    return BuffStackReadPayload(
        outputKey=output_key,
        targetSource=str(target.get("targetSource", "")),
        targetGroupKey=str(target.get("targetGroupKey", "")),
        buffCheckType=check_type,
        buffIds=buff_ids,
        tagQueryType=query_type,
        buffTagIds=tag_ids,
        countType=count_type,
        limitSkillCastId=limit_skill_cast_id,
    )


def parse_simple_buff_stack_read_payload(
    action: dict[str, Any], path: str
) -> BuffStackReadPayload:
    """解析原生 SaveBuffStackNum：固定 Buff ID 的累计层数写入动作黑板。"""
    expected_fields = {
        "$type", "isEnable", "priorityLevel", "priorityOffset", "serverActionIndex",
        "checkTarget", "buffId", "key",
    }
    if set(action) != expected_fields:
        raise ValueError(f"{path}: unexpected SaveBuffStackNum fields {sorted(action)}")
    output_key = action.get("key")
    if not isinstance(output_key, str) or not output_key:
        raise ValueError(f"{path}.key: expected non-empty string")
    target = require_dict(action.get("checkTarget"), f"{path}.checkTarget")
    buff = require_dict(action.get("buffId"), f"{path}.buffId")
    buff_id = buff.get("buffId")
    if set(buff) != {"buffId"} or not isinstance(buff_id, str) or not buff_id:
        raise ValueError(f"{path}.buffId.buffId: expected direct non-empty id")
    return BuffStackReadPayload(
        outputKey=output_key,
        targetSource=str(target.get("targetSource", "")),
        targetGroupKey=str(target.get("targetGroupKey", "")),
        buffCheckType="Id",
        buffIds=(buff_id,),
        tagQueryType="hasAny",
        buffTagIds=(),
        countType="BuffCount",
        limitSkillCastId=False,
    )


def parse_buff_application_entries(
    value: Any,
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[BuffApplicationEntryPayload, ...]:
    buffs: list[BuffApplicationEntryPayload] = []
    for index, raw_buff in enumerate(require_list(value, path)):
        buff_path = f"{path}[{index}]"
        buff = require_dict(raw_buff, buff_path)
        buff_id = buff.get("buffId")
        if not isinstance(buff_id, str) or not buff_id:
            raise ValueError(f"{buff_path}.buffId: expected non-empty string")
        buffs.append(
            BuffApplicationEntryPayload(
                buffId=buff_id,
                classification=classify_buff(buff_id),
                blackboardAssignments=parse_buff_assignments(
                    buff,
                    buff_path,
                    inherited_blackboard,
                ),
            )
        )
    return tuple(buffs)


def parse_buff_application_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> BuffApplicationPayload:
    target_settings = require_dict(action.get("targetSettings"), f"{path}.targetSettings")
    target_source = str(target_settings.get("targetSource", ""))
    target_finder_type: str | None = None
    target_validator_types: tuple[str, ...] = ()
    target_post_processor_types: tuple[str, ...] = ()
    if target_source == "InstantSearch":
        (
            target_finder_type,
            _,
            _,
            _,
            target_validator_types,
            target_post_processor_types,
        ) = parse_selector_summary(
            target_settings.get("selectorData"),
            f"{path}.targetSettings.selectorData",
            finder_required=True,
        )
    buff_source = action.get("buffSource")
    if not isinstance(buff_source, str) or not buff_source:
        raise ValueError(f"{path}.buffSource: expected non-empty string")
    context_key = action.get("contextKey", "")
    if not isinstance(context_key, str):
        raise ValueError(f"{path}.contextKey: expected string")
    if buff_source == "ContextTarget" and not context_key:
        raise ValueError(f"{path}.contextKey: ContextTarget requires a non-empty key")
    return BuffApplicationPayload(
        buffs=parse_buff_application_entries(
            action.get("buffs"), f"{path}.buffs", inherited_blackboard
        ),
        targetSource=target_source,
        targetGroupKey=str(target_settings.get("targetGroupKey", "")),
        count=parse_scalar(action.get("count"), f"{path}.count", inherited_blackboard),
        buffSource=buff_source,
        buffSourceContextKey=context_key,
        inheritSourceSkillCastInfo=require_bool(
            action.get("inheritSourceSkillCastInfo"),
            f"{path}.inheritSourceSkillCastInfo",
        ),
        targetFinderType=target_finder_type,
        targetValidatorTypes=target_validator_types,
        targetPostProcessorTypes=target_post_processor_types,
    )


def parse_heal_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> HealPayload:
    expected_fields = {
        "$type", "isEnable", "priorityLevel", "priorityOffset", "serverActionIndex",
        "alwaysNext", "healType", "healer", "contextKey", "target",
        "healCalculation", "showHealText", "playHealEffect", "effectData",
        "onlyPlayEffectOnActualHeal", "useHealTags", "healTags",
    }
    if set(action) != expected_fields:
        raise ValueError(f"{path}: unexpected HealAction fields {sorted(action)}")
    always_next = require_bool(action.get("alwaysNext"), f"{path}.alwaysNext")
    if action.get("healType") != "Normal" or action.get("healer") != "ActionSource":
        raise ValueError(f"{path}: unsupported healing type or healer identity")
    # HealAction.ExecuteInternal 把该键传给 GetActionTarget；已确认的 ActionSource
    # 分支直接返回动作来源，只有 ContextTarget 分支才读取目标组。因此当前受支持
    # 的 healer=ActionSource 允许保留任意序列化字符串，但不把它编译成目标引用。
    context_key = action.get("contextKey")
    if not isinstance(context_key, str):
        raise ValueError(f"{path}.contextKey: expected string")
    calculation = require_dict(action.get("healCalculation"), f"{path}.healCalculation")
    calculation_type = action_name(str(calculation.get("$type", "")))
    if calculation_type == "MultiplyAttributeCalculation":
        if set(calculation) != {"$type", "valueSource", "attributeType", "multiplier", "addition"}:
            raise ValueError(
                f"{path}.healCalculation: unexpected fields {sorted(calculation)}"
            )
        if calculation.get("valueSource") != "AttackerOrHealer":
            raise ValueError(f"{path}.healCalculation.valueSource: unsupported value")
        attribute = calculation.get("attributeType")
        if attribute not in {"Str", "Agi", "Wisd", "Will", "MaxHp"}:
            raise ValueError(
                f"{path}.healCalculation.attributeType: unsupported value {attribute!r}"
            )
        multiplier = parse_scalar(
            calculation.get("multiplier"),
            f"{path}.healCalculation.multiplier",
            inherited_blackboard,
        )
        addition = parse_scalar(
            calculation.get("addition"),
            f"{path}.healCalculation.addition",
            inherited_blackboard,
        )
    elif calculation_type == "DefiniteValueCalculation":
        if set(calculation) != {"$type", "value", "applyScale", "valueScale"}:
            raise ValueError(
                f"{path}.healCalculation: unexpected fields {sorted(calculation)}"
            )
        if calculation.get("applyScale") is not False:
            raise ValueError(f"{path}.healCalculation.applyScale: only false is supported")
        # 即使 scale 在该形状中禁用，也严格验证序列化标量结构，防止数据版本漂移。
        parse_scalar(
            calculation.get("valueScale"),
            f"{path}.healCalculation.valueScale",
            inherited_blackboard,
        )
        attribute = None
        multiplier = ScalarSource(0, None, None)
        addition = parse_scalar(
            calculation.get("value"),
            f"{path}.healCalculation.value",
            inherited_blackboard,
        )
    else:
        raise ValueError(f"{path}.healCalculation: unsupported calculation type")
    use_tags = require_bool(action.get("useHealTags"), f"{path}.useHealTags")
    tags = require_dict(action.get("healTags"), f"{path}.healTags")
    if set(tags) != {"predefinedTag"}:
        raise ValueError(f"{path}.healTags: unexpected fields {sorted(tags)}")
    tag_ids: list[int] = []
    for index, raw_tag in enumerate(
        require_list(tags.get("predefinedTag"), f"{path}.healTags.predefinedTag")
    ):
        tag_path = f"{path}.healTags.predefinedTag[{index}]"
        tag = require_dict(raw_tag, tag_path)
        if set(tag) != {"tagId"}:
            raise ValueError(f"{tag_path}: unexpected fields {sorted(tag)}")
        tag_id = tag.get("tagId")
        if not isinstance(tag_id, int) or isinstance(tag_id, bool):
            raise ValueError(f"{tag_path}.tagId: expected integer")
        tag_ids.append(tag_id)
    if not use_tags and tag_ids:
        raise ValueError(f"{path}: disabled heal tags must be empty")
    return HealPayload(
        healType="Normal",
        healer="ActionSource",
        alwaysNext=always_next,
        target=parse_target_reference(action.get("target"), f"{path}.target"),
        attribute=None if attribute is None else str(attribute),
        multiplier=multiplier,
        addition=addition,
        tagIds=tuple(tag_ids) if use_tags else (),
    )


def parse_resource_gain_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> ResourceGainPayload:
    raw_resource = action.get("costType")
    resource = RESOURCE_TYPE_MAP.get(raw_resource)
    if resource is None:
        raise ValueError(f"{path}.costType: unsupported value {raw_resource!r}")
    is_percent_value = require_bool(action.get("isPercentValue"), f"{path}.isPercentValue")
    atb_source_type = action.get("atbSourceType")
    atb_gain_method = action.get("atbGainMethod")
    sp_gain_source = {
        "Default": "default",
        "NormalAttack": "normalAttack",
        "PowerAttack": "powerAttack",
        "Skill": "skill",
    }.get(atb_source_type)
    sp_gain_kind = {"Gain": "gain", "Return": "refund"}.get(atb_gain_method)
    if sp_gain_source is None:
        raise ValueError(f"{path}.atbSourceType: unsupported value {atb_source_type!r}")
    if sp_gain_kind is None:
        raise ValueError(f"{path}.atbGainMethod: unsupported value {atb_gain_method!r}")
    recovery_tag = require_dict(action.get("uspRecoverTag"), f"{path}.uspRecoverTag")
    return ResourceGainPayload(
        resource=resource,
        amount=parse_scalar(action.get("costValue"), f"{path}.costValue", inherited_blackboard),
        coefficient=parse_scalar(
            action.get("coefficient"),
            f"{path}.coefficient",
            inherited_blackboard,
        ),
        spGainKind=sp_gain_kind if resource == "sp" else None,
        spGainSource=sp_gain_source if resource == "sp" else None,
        onlyMainOperator=require_bool(action.get("atbOnlyMainChar"), f"{path}.atbOnlyMainChar"),
        isPercentValue=is_percent_value,
        useUltimateRecoveryTag=require_bool(
            action.get("useUspRecoverTag"), f"{path}.useUspRecoverTag"
        ),
        ultimateRecoveryTagId=require_non_negative_int(
            recovery_tag.get("tagId"), f"{path}.uspRecoverTag.tagId"
        ),
        ignoreUltimateGainScalar=require_bool(
            action.get("ignoreUspGainScalar"), f"{path}.ignoreUspGainScalar"
        ),
    )


def parse_projectile_launch_payload(
    action: dict[str, Any],
    path: str,
) -> ProjectileLaunchPayload:
    projectile_id = action.get("projectileId")
    if not isinstance(projectile_id, str) or not projectile_id:
        raise ValueError(f"{path}.projectileId: expected non-empty string")
    assign_blackboard = require_bool(action.get("assignBlackboard"), f"{path}.assignBlackboard")
    trigger_fields = (
        ("hit", "castSkillOnHit", "projectileSkillId"),
        ("block", "castSkillOnBlock", "skillIdOnBlock"),
        ("reach", "castSkillOnReach", "skillIdOnReach"),
        ("finish", "castSkillOnFinish", "skillIdOnFinish"),
    )
    triggers: list[ProjectileSkillTriggerSource] = []
    for event, enabled_field, skill_field in trigger_fields:
        enabled = action.get(enabled_field, False)
        if not isinstance(enabled, bool):
            raise ValueError(f"{path}.{enabled_field}: expected boolean")
        if not enabled:
            continue
        skill_id = action.get(skill_field)
        if not isinstance(skill_id, str) or not skill_id:
            raise ValueError(f"{path}.{skill_field}: enabled projectile event requires a skill")
        triggers.append(ProjectileSkillTriggerSource(event=event, skillId=skill_id))
    return ProjectileLaunchPayload(
        projectileId=projectile_id,
        skillTriggers=tuple(triggers),
        assignBlackboard=assign_blackboard,
        entityBlackboardAssignments=parse_entity_blackboard_assignments(action, path),
        target=(
            parse_target_reference(action["targetSettings"], f"{path}.targetSettings")
            if "targetSettings" in action
            else None
        ),
    )


def parse_entity_blackboard_assignments(
    action: dict[str, Any],
    path: str,
) -> tuple[EntityBlackboardAssignmentSource, ...]:
    """严格解析动作写入新实体黑板的显式赋值，并识别编辑器的关闭态空占位。"""
    assign_entity_blackboard = require_bool(
        action.get("assignEntityBlackboard"),
        f"{path}.assignEntityBlackboard",
    )
    raw_assignments = require_list(action.get("assignPairs"), f"{path}.assignPairs")
    if not assign_entity_blackboard:
        disabled_placeholder = [
            {
                "targetKey": "",
                "inputValueKey": "",
                "useDirectValue": False,
                "directValueType": "Numeric",
                "numericValue": 0.0,
                "stringValue": "",
            }
        ]
        if raw_assignments and raw_assignments != disabled_placeholder:
            raise ValueError(f"{path}.assignPairs: expected empty when assignment is disabled")
        return ()
    assignments: list[EntityBlackboardAssignmentSource] = []
    for index, raw_assignment in enumerate(raw_assignments):
        assignment = require_dict(raw_assignment, f"{path}.assignPairs[{index}]")
        target_key = assignment.get("targetKey")
        value_type = assignment.get("directValueType")
        numeric_value = assignment.get("numericValue")
        string_value = assignment.get("stringValue")
        use_direct_value = assignment.get("useDirectValue")
        input_value_key = assignment.get("inputValueKey")
        if not isinstance(use_direct_value, bool):
            raise ValueError(f"{path}.assignPairs[{index}].useDirectValue: expected boolean")
        if not isinstance(input_value_key, str):
            raise ValueError(f"{path}.assignPairs[{index}].inputValueKey: expected string")
        if not use_direct_value and not input_value_key:
            raise ValueError(
                f"{path}.assignPairs[{index}]: indirect assignment requires an input key"
            )
        if not isinstance(target_key, str) or not target_key:
            raise ValueError(f"{path}.assignPairs[{index}].targetKey: expected string")
        if value_type not in {"String", "Numeric"}:
            raise ValueError(
                f"{path}.assignPairs[{index}].directValueType: unsupported {value_type!r}"
            )
        if not isinstance(numeric_value, (int, float)) or isinstance(numeric_value, bool):
            raise ValueError(f"{path}.assignPairs[{index}].numericValue: expected number")
        if not isinstance(string_value, str):
            raise ValueError(f"{path}.assignPairs[{index}].stringValue: expected string")
        assignments.append(
            EntityBlackboardAssignmentSource(
                targetKey=target_key,
                valueType=value_type,
                numericValue=float(numeric_value),
                stringValue=string_value,
                useDirectValue=use_direct_value,
                inputValueKey=input_value_key,
            )
        )
    return tuple(assignments)


def parse_ability_entity_spawn_payload(
    action: dict[str, Any],
    path: str,
) -> AbilityEntitySpawnPayload:
    ability_id = action.get("abilityEntityId")
    skill_id = action.get("abilityEntitySkillId")
    if not isinstance(ability_id, str) or not ability_id:
        raise ValueError(f"{path}.abilityEntityId: expected non-empty string")
    if not isinstance(skill_id, str):
        raise ValueError(f"{path}.abilityEntitySkillId: expected string")
    if not require_bool(action.get("setAbilityEntitySource"), f"{path}.setAbilityEntitySource"):
        raise ValueError(f"{path}.setAbilityEntitySource: disabled source is unsupported")
    source_type = action.get("abilityEntitySource")
    source_context_key = action.get("abilityEntitySourceContextKey")
    if not isinstance(source_type, str) or not source_type:
        raise ValueError(f"{path}.abilityEntitySource: expected non-empty string")
    if not isinstance(source_context_key, str):
        raise ValueError(f"{path}.abilityEntitySourceContextKey: expected string")
    set_target = require_bool(action.get("setAbilityEntityTarget"), f"{path}.setAbilityEntityTarget")
    target = (
        parse_target_reference(action.get("abilityEntityTarget"), f"{path}.abilityEntityTarget")
        if set_target
        else None
    )
    override_duration = require_bool(action.get("overrideDuration"), f"{path}.overrideDuration")
    duration = (
        parse_scalar(action.get("duration"), f"{path}.duration", {})
        if override_duration
        else None
    )
    save_to_context = require_bool(action.get("saveToContext"), f"{path}.saveToContext")
    context_key = action.get("contextKey")
    if not isinstance(context_key, str):
        raise ValueError(f"{path}.contextKey: expected string")
    if save_to_context != bool(context_key):
        raise ValueError(f"{path}.saveToContext/contextKey: inconsistent context output")
    assign_blackboard = require_bool(action.get("assignBlackboard"), f"{path}.assignBlackboard")
    return AbilityEntitySpawnPayload(
        abilityEntityId=ability_id,
        skillId=skill_id or None,
        entityBlackboardAssignments=parse_entity_blackboard_assignments(action, path),
        assignBlackboard=assign_blackboard,
        sourceType=source_type,
        sourceContextKey=source_context_key,
        target=target,
        overrideDuration=duration,
        saveToContextKey=context_key or None,
        dieWhenSourceDies=require_bool(action.get("dieWhenSourceDie"), f"{path}.dieWhenSourceDie"),
        dieOnEnd=require_bool(action.get("dieOnEnd"), f"{path}.dieOnEnd"),
    )


def parse_ability_entity_duration_assignment_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> AbilityEntityDurationAssignmentPayload:
    """严格读取语料中出现过的 SetAbilityEntityDuration 载荷。"""
    expected_fields = {
        "$type", "isEnable", "priorityLevel", "priorityOffset", "serverActionIndex",
        "setMultipleTarget", "targetSettings", "actionTargetType", "targetContextKey",
        "operation", "value",
    }
    if set(action) != expected_fields:
        raise ValueError(f"{path}: unexpected fields {sorted(action)}")
    set_multiple_target = require_bool(
        action.get("setMultipleTarget"), f"{path}.setMultipleTarget"
    )
    action_target_type = action.get("actionTargetType")
    target_context_key = action.get("targetContextKey")
    operation = action.get("operation")
    if action_target_type not in {"InputTarget", "ContextTarget"}:
        raise ValueError(
            f"{path}.actionTargetType: unsupported value {action_target_type!r}"
        )
    if not isinstance(target_context_key, str):
        raise ValueError(f"{path}.targetContextKey: expected string")
    if (action_target_type == "ContextTarget") != bool(target_context_key):
        raise ValueError(f"{path}.targetContextKey: inconsistent target context")
    if operation != "Assign":
        raise ValueError(f"{path}.operation: unsupported value {operation!r}")
    if set_multiple_target:
        raise ValueError(f"{path}.setMultipleTarget: unsupported true value")

    raw_target_settings = require_dict(action.get("targetSettings"), f"{path}.targetSettings")
    full_target_fields = {
        "targetSource", "targetGroupKey", "selectorOwner", "ownerContextKey",
        "centerType", "centerContextKey", "centerToGround", "selectorData",
        "enableAdvancedDirection", "advancedDirection", "selectorDirection",
        "target", "targetContextKey",
    }
    compact_target_fields = {
        "targetSource", "selectorOwner", "centerType", "centerToGround",
        "enableAdvancedDirection", "advancedDirection", "selectorDirection", "target",
    }
    target_settings = None
    if set(raw_target_settings) == full_target_fields:
        target_settings = parse_target_reference(
            raw_target_settings, f"{path}.targetSettings"
        )
    elif set(raw_target_settings) == compact_target_fields:
        if action_target_type != "InputTarget":
            raise ValueError(f"{path}.targetSettings: compact ContextTarget is unsupported")
        expected_compact_values = {
            "targetSource": "Target",
            "selectorOwner": "ActionOwner",
            "centerType": "ActionSource",
            "centerToGround": False,
            "enableAdvancedDirection": False,
            "selectorDirection": "SourceForward",
            "target": "ActionSource",
        }
        if any(
            raw_target_settings.get(key) != expected
            for key, expected in expected_compact_values.items()
        ):
            raise ValueError(f"{path}.targetSettings: unsupported compact target values")
        direction = require_dict(
            raw_target_settings.get("advancedDirection"),
            f"{path}.targetSettings.advancedDirection",
        )
        if direction != {
            "directionType": "SourceForward",
            "sourceMountPoint": "None",
            "targetMountPoint": "None",
            "customSourceAndTarget": False,
            "clampToXZ": True,
            "invertDirection": False,
        }:
            raise ValueError(f"{path}.targetSettings.advancedDirection: unsupported values")
    else:
        raise ValueError(f"{path}.targetSettings: unexpected fields {sorted(raw_target_settings)}")

    return AbilityEntityDurationAssignmentPayload(
        setMultipleTarget=set_multiple_target,
        actionTargetType=action_target_type,
        targetContextKey=target_context_key,
        operation=operation,
        value=parse_scalar(action.get("value"), f"{path}.value", inherited_blackboard),
        targetSettings=target_settings,
    )


def parse_buff_find_settings(
    value: Any,
    path: str,
) -> tuple[str, tuple[str, ...], str, tuple[int, ...]]:
    """严格读取 BuffFindSettings；未知查询枚举和非整数标签必须立即报错。"""
    settings = require_dict(value, path)
    raw_ids = require_list(settings.get("buffIdList"), f"{path}.buffIdList")
    buff_ids: list[str] = []
    for index, raw_id in enumerate(raw_ids):
        if not isinstance(raw_id, str):
            raise ValueError(f"{path}.buffIdList[{index}]: expected string")
        # Tag 查询的真实数据会用空字符串占住无效 ID 槽；它不构成 Buff 身份。
        if raw_id:
            buff_ids.append(raw_id)
    query_type, tag_ids = parse_tag_query(settings.get("tagQuery"), f"{path}.tagQuery")
    return (
        str(settings.get("checkType", "")),
        tuple(buff_ids),
        query_type,
        tag_ids,
    )


def parse_tag_query(value: Any, path: str) -> tuple[str, tuple[int, ...]]:
    """严格读取原生 GameplayTag 查询；一个 Buff 即使命中多个标签也只计数一次。"""
    tag_query = require_dict(value, path)
    raw_tags = require_list(tag_query.get("tags"), f"{path}.tags")
    raw_query_type = tag_query.get("queryType")
    query_type = TAG_QUERY_TYPE_MAP.get(raw_query_type)
    if query_type is None:
        raise ValueError(f"{path}.queryType: unsupported value {raw_query_type!r}")

    tag_ids: list[int] = []
    for tag_index, raw_tag in enumerate(raw_tags):
        tag = require_dict(raw_tag, f"{path}.tags[{tag_index}]")
        tag_id = tag.get("tagId")
        if not isinstance(tag_id, int):
            raise ValueError(f"{path}.tags[{tag_index}].tagId: expected integer")
        tag_ids.append(tag_id)
    return query_type, tuple(tag_ids)


def parse_damage_units(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[DamageUnitSource, ...]:
    result: list[DamageUnitSource] = []
    for action in walk_single_enemy_actions(root.get("actionGroupData"), source_name):
        if action_name(action["$type"]) != "DamageAction":
            continue
        units = require_list(action.get("damageUnits"), f"{source_name}.DamageAction.damageUnits")
        for index, raw_unit in enumerate(units):
            unit = require_dict(raw_unit, f"{source_name}.DamageAction.damageUnits[{index}]")
            damage_decorate_mask = unit.get("damageDecorateMask")
            if (
                not isinstance(damage_decorate_mask, int)
                or isinstance(damage_decorate_mask, bool)
                or damage_decorate_mask < 0
            ):
                raise ValueError(
                    f"{source_name}.DamageAction.damageUnits[{index}].damageDecorateMask: "
                    "expected non-negative integer"
                )
            simple_calculation = unit.get("simpleCalculation")
            if not isinstance(simple_calculation, bool):
                raise ValueError(f"{source_name}.DamageAction.damageUnits[{index}].simpleCalculation: expected boolean")
            attack_scale_source = unit.get("atkScale")
            calculation = "standard"
            calculation_multiplier = None
            definite_value = None
            calculation_attribute = None
            calculation_addition = None
            attribute_type = str(unit.get("damageAttributeType", ""))
            if attribute_type == "Hp" and not simple_calculation:
                raw_calculation = require_dict(
                    unit.get("atkCalculation"),
                    f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation",
                )
                calculation_type = action_name(str(raw_calculation.get("$type", "")))
                calculation_types = {
                    "AtkScaleCalculation": "standard",
                    "BreakingAttackCalculation": "breakingAttack",
                    "DefiniteValueCalculation": "definiteValue",
                    "MultiplyAttributeCalculation": "attribute",
                }
                if calculation_type not in calculation_types:
                    raise ValueError(
                        f"{source_name}.DamageAction.damageUnits[{index}]: unsupported calculation {calculation_type}"
                    )
                calculation = calculation_types[calculation_type]
                if calculation == "attribute":
                    if set(raw_calculation) != {
                        "$type", "valueSource", "attributeType", "multiplier", "addition"
                    }:
                        raise ValueError(
                            f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation: "
                            f"unexpected fields {sorted(raw_calculation)}"
                        )
                    if raw_calculation.get("valueSource") != "AttackerOrHealer":
                        raise ValueError(
                            f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation.valueSource: "
                            "unsupported value"
                        )
                    calculation_attribute = raw_calculation.get("attributeType")
                    if not isinstance(calculation_attribute, str) or not calculation_attribute:
                        raise ValueError(
                            f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation.attributeType: "
                            "expected string"
                        )
                    attack_scale_source = raw_calculation.get("multiplier")
                    calculation_addition = parse_scalar(
                        raw_calculation.get("addition"),
                        f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation.addition",
                        inherited_blackboard,
                    )
                elif calculation == "definiteValue":
                    if raw_calculation.get("applyScale") is not False:
                        raise ValueError(
                            f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation: "
                            "scaled definite values are not supported"
                        )
                    definite_value = parse_scalar(
                        raw_calculation.get("value"),
                        f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation.value",
                        inherited_blackboard,
                    )
                else:
                    attack_scale_source = raw_calculation.get("atkScale")
                if calculation == "breakingAttack":
                    calculation_multiplier = parse_scalar(
                        raw_calculation.get("multiplier"),
                        f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation.multiplier",
                        inherited_blackboard,
                    )
            poise_value = None
            if attribute_type == "Poise":
                poise_calculation = require_dict(
                    unit.get("poiseCalculation"),
                    f"{source_name}.DamageAction.damageUnits[{index}].poiseCalculation",
                )
                poise_calculation_type = action_name(
                    str(poise_calculation.get("$type", ""))
                )
                if poise_calculation_type != "DefiniteValueCalculation":
                    raise ValueError(
                        f"{source_name}.DamageAction.damageUnits[{index}].poiseCalculation: "
                        f"unsupported calculation {poise_calculation_type}"
                    )
                poise_value = parse_scalar(
                    poise_calculation.get("value"),
                    f"{source_name}.DamageAction.damageUnits[{index}].poiseCalculation.value",
                    inherited_blackboard,
                )
                apply_scale = poise_calculation.get("applyScale")
                if not isinstance(apply_scale, bool):
                    raise ValueError(
                        f"{source_name}.DamageAction.damageUnits[{index}].poiseCalculation."
                        "applyScale: expected boolean"
                    )
                if apply_scale:
                    value_scale = parse_scalar(
                        poise_calculation.get("valueScale"),
                        f"{source_name}.DamageAction.damageUnits[{index}]."
                        "poiseCalculation.valueScale",
                        inherited_blackboard,
                    )
                    if value_scale.blackboardKey is not None:
                        raise ValueError(
                            f"{source_name}.DamageAction.damageUnits[{index}]."
                            "poiseCalculation.valueScale: dynamic scale is not supported"
                        )
                    if poise_value.levelValues is None:
                        raise ValueError(
                            f"{source_name}.DamageAction.damageUnits[{index}]."
                            "poiseCalculation.value: scaled value must resolve at generation time"
                        )
                    scale = to_float32(value_scale.value)
                    poise_value = ScalarSource(
                        value=poise_value.value * scale,
                        blackboardKey=None,
                        levelValues=tuple(value * scale for value in poise_value.levelValues),
                    )
            result.append(
                DamageUnitSource(
                    damageType=str(unit.get("damageType", "")),
                    attributeType=attribute_type,
                    calculation=calculation,
                    attackScale=parse_scalar(
                        attack_scale_source,
                        f"{source_name}.DamageAction.damageUnits[{index}].atkScale",
                        inherited_blackboard,
                    ),
                    calculationMultiplier=calculation_multiplier,
                    poiseValue=poise_value,
                    definiteValue=definite_value,
                    damageDecorateMask=damage_decorate_mask,
                    calculationAttribute=calculation_attribute,
                    calculationAddition=calculation_addition,
                )
            )
    return tuple(result)


def classify_buff(buff_id: str) -> str | None:
    if buff_id.startswith("buff_common_damage_immune_"):
        return "incomingDamageProtection"
    if buff_id == "buff_common_power_attack_disable_cast_skill":
        return "inputLock"
    if buff_id == "buff_common_obtain_ultimate_sp":
        return "skillCostUltimateEnergyGain"
    if buff_id.startswith("buff_chr_") and buff_id.endswith("_tutorial_marker"):
        return "tutorialMarker"
    if buff_id == "buff_common_pulse_pulse_conduct_triggered":
        return "electrificationReaction"
    return None


INFLICTION_TYPE_MAP = {
    "Fire": "heat",
    "Cryst": "cryo",
    "Pulse": "electric",
    "Natural": "nature",
}


def parse_infliction_payload(action: dict[str, Any], path: str) -> InflictionPayload:
    raw_type = action.get("inflictionType")
    element = INFLICTION_TYPE_MAP.get(raw_type)
    if element is None:
        raise ValueError(f"{path}: unsupported inflictionType {raw_type!r}")
    is_extra = action.get("isExtra")
    if not isinstance(is_extra, bool):
        raise ValueError(f"{path}.isExtra: expected boolean")
    return InflictionPayload(element, is_extra)


def parse_physical_infliction_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> PhysicalInflictionPayload:
    """严格读取 Fracture/Crush；空间参数保留给未来的多目标或位移模型。"""
    action_type = action_name(str(action.get("$type", "")))
    if action_type not in {"FractureAction", "CrushAction"}:
        raise ValueError(f"{path}: expected FractureAction or CrushAction")
    expected_fields = {
        "$type",
        "isEnable",
        "priorityLevel",
        "priorityOffset",
        "serverActionIndex",
        "attackerTargetSettings",
        "targetSettings",
        "blowOffDistance",
        "distanceRandomRange",
        "overwriteHeight",
        "blowOffHeight",
        "directionSettings",
        "totalTime",
        "isExtra",
        "deadOption",
        "immobilizedTime",
    }
    if action_type == "CrushAction":
        expected_fields.update({"damageMultiplier", "ignoreHitEffect"})
    if set(action) != expected_fields:
        raise ValueError(f"{path}: unexpected fields {sorted(action)}")

    direction = require_dict(action.get("directionSettings"), f"{path}.directionSettings")
    expected_direction_fields = {
        "directionType",
        "sourceMountPoint",
        "targetMountPoint",
        "customSourceAndTarget",
        "clampToXZ",
        "invertDirection",
    }
    if set(direction) != expected_direction_fields:
        raise ValueError(f"{path}.directionSettings: unexpected fields {sorted(direction)}")
    direction_type = direction.get("directionType")
    source_mount_point = direction.get("sourceMountPoint")
    target_mount_point = direction.get("targetMountPoint")
    dead_option = action.get("deadOption")
    for key, value in (
        ("directionSettings.directionType", direction_type),
        ("directionSettings.sourceMountPoint", source_mount_point),
        ("directionSettings.targetMountPoint", target_mount_point),
        ("deadOption", dead_option),
    ):
        if not isinstance(value, str) or not value:
            raise ValueError(f"{path}.{key}: expected non-empty string")

    return PhysicalInflictionPayload(
        physicalType="crush" if action_type == "CrushAction" else "fracture",
        attackerTarget=parse_target_reference(
            action.get("attackerTargetSettings"), f"{path}.attackerTargetSettings"
        ),
        target=parse_target_reference(action.get("targetSettings"), f"{path}.targetSettings"),
        blowOffDistance=parse_scalar(
            action.get("blowOffDistance"), f"{path}.blowOffDistance", inherited_blackboard
        ),
        distanceRandomRange=parse_scalar(
            action.get("distanceRandomRange"),
            f"{path}.distanceRandomRange",
            inherited_blackboard,
        ),
        overwriteHeight=require_bool(action.get("overwriteHeight"), f"{path}.overwriteHeight"),
        blowOffHeight=parse_scalar(
            action.get("blowOffHeight"), f"{path}.blowOffHeight", inherited_blackboard
        ),
        directionType=direction_type,
        sourceMountPoint=source_mount_point,
        targetMountPoint=target_mount_point,
        customSourceAndTarget=require_bool(
            direction.get("customSourceAndTarget"),
            f"{path}.directionSettings.customSourceAndTarget",
        ),
        clampToXZ=require_bool(
            direction.get("clampToXZ"), f"{path}.directionSettings.clampToXZ"
        ),
        invertDirection=require_bool(
            direction.get("invertDirection"), f"{path}.directionSettings.invertDirection"
        ),
        totalTime=parse_scalar(action.get("totalTime"), f"{path}.totalTime", inherited_blackboard),
        isExtra=require_bool(action.get("isExtra"), f"{path}.isExtra"),
        deadOption=dead_option,
        immobilizedTime=require_number(action.get("immobilizedTime"), f"{path}.immobilizedTime"),
        damageMultiplier=(
            parse_scalar(
                action.get("damageMultiplier"),
                f"{path}.damageMultiplier",
                inherited_blackboard,
            )
            if action_type == "CrushAction"
            else None
        ),
        ignoreHitEffect=(
            require_bool(action.get("ignoreHitEffect"), f"{path}.ignoreHitEffect")
            if action_type == "CrushAction"
            else False
        ),
    )


def parse_interrupt_payload(action: dict[str, Any], path: str) -> InterruptPayload:
    """严格保存 InterruptAction 字段；运行时控制效果需由独立证据闭环。"""
    expected_fields = {
        "$type",
        "isEnable",
        "priorityLevel",
        "priorityOffset",
        "serverActionIndex",
        "attacker",
        "defender",
        "overrideSuperArmorLimit",
        "immobilizedTime",
    }
    if set(action) != expected_fields:
        raise ValueError(f"{path}: unexpected fields {sorted(action)}")
    if action_name(str(action.get("$type", ""))) != "InterruptAction":
        raise ValueError(f"{path}: expected InterruptAction")
    return InterruptPayload(
        attacker=parse_target_reference(action.get("attacker"), f"{path}.attacker"),
        defender=parse_target_reference(action.get("defender"), f"{path}.defender"),
        overrideSuperArmorLimit=require_number(
            action.get("overrideSuperArmorLimit"), f"{path}.overrideSuperArmorLimit"
        ),
        immobilizedTime=require_number(
            action.get("immobilizedTime"), f"{path}.immobilizedTime"
        ),
    )


def parse_timed_marker_application_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> TimedMarkerApplicationPayload:
    target = require_dict(action.get("targetSettings"), f"{path}.targetSettings")
    marker = require_dict(action.get("markerId"), f"{path}.markerId")
    use_marker_key = require_bool(
        marker.get("useBlackboardKey"), f"{path}.markerId.useBlackboardKey"
    )
    marker_id = marker.get("value")
    marker_key = marker.get("blackboardKey")
    if not isinstance(marker_id, str):
        raise ValueError(f"{path}.markerId.value: expected string")
    if not isinstance(marker_key, str):
        raise ValueError(f"{path}.markerId.blackboardKey: expected string")
    if use_marker_key or not marker_id:
        raise ValueError(f"{path}.markerId: dynamic or empty marker IDs are not supported")
    return TimedMarkerApplicationPayload(
        targetSource=str(target.get("targetSource", "")),
        targetGroupKey=str(target.get("targetGroupKey", "")),
        markerId=marker_id,
        duration=parse_scalar(
            action.get("duration"), f"{path}.duration", inherited_blackboard
        ),
        autoFinishByAction=require_bool(
            action.get("autoFinishByAction"), f"{path}.autoFinishByAction"
        ),
        useTimeDilationDt=require_bool(
            action.get("useTimeDilationDt"), f"{path}.useTimeDilationDt"
        ),
    )


def parse_global_cooldown_application_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> GlobalCooldownApplicationPayload:
    """读取原生 AddGlobalCDTimer；Buff ID 同时充当冷却项的稳定标识。"""
    target = require_dict(action.get("target"), f"{path}.target")
    buff_id = action.get("buffId")
    if not isinstance(buff_id, str) or not buff_id:
        raise ValueError(f"{path}.buffId: expected non-empty string")
    return GlobalCooldownApplicationPayload(
        targetSource=str(target.get("targetSource", "")),
        targetGroupKey=str(target.get("targetGroupKey", "")),
        buffId=buff_id,
        duration=parse_scalar(
            action.get("cdTime"), f"{path}.cdTime", inherited_blackboard
        ),
    )


def parse_buff_assignments(
    buff: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> dict[str, ScalarSource]:
    if buff.get("assignBlackboard") is not True:
        return {}
    result: dict[str, ScalarSource] = {}
    for index, raw_item in enumerate(require_list(buff.get("assignItems"), f"{path}.assignItems")):
        item = require_dict(raw_item, f"{path}.assignItems[{index}]")
        target_key = item.get("targetKey")
        if not isinstance(target_key, str) or not target_key:
            raise ValueError(f"{path}.assignItems[{index}].targetKey: expected non-empty string")
        if target_key in result:
            raise ValueError(f"{path}: duplicate assignment for {target_key}")
        direct = item.get("useDirectValue")
        if not isinstance(direct, bool):
            raise ValueError(f"{path}.assignItems[{index}].useDirectValue: expected boolean")
        numeric = item.get("numericValue")
        if not isinstance(numeric, (int, float)) or isinstance(numeric, bool):
            raise ValueError(f"{path}.assignItems[{index}].numericValue: expected number")
        if direct:
            result[target_key] = ScalarSource(float(numeric), None, None)
            continue
        input_key = item.get("inputValueKey")
        if not isinstance(input_key, str) or not input_key:
            raise ValueError(f"{path}.assignItems[{index}].inputValueKey: expected non-empty string")
        result[target_key] = ScalarSource(
            float(numeric),
            input_key,
            inherited_blackboard.get(input_key),
        )
    return result


RESOURCE_TYPE_MAP = {
    "UltimateSp": "ultimateEnergy",
    "Atb": "sp",
}
