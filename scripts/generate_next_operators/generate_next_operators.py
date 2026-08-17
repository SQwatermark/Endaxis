"""从解包 SkillData 生成 Next 干员数据的可审计中间层。"""

from __future__ import annotations

import argparse
import json
import math
import textwrap
from collections import Counter
from dataclasses import asdict, fields, is_dataclass, replace
from pathlib import Path
from typing import Any, Iterable, Iterator, Literal, cast

from source_models import (
    TimelineActionSource,
    ScalarSource,
    SkillPatchSource,
    DamageUnitSource,
    TimedDamageSource,
    TimedMarkerGateSource,
    EntityBlackboardAssignmentSource,
    AuxiliaryActionSource,
    InflictionPayload,
    TimedInflictionSource,
    TimedPhysicalInflictionSource,
    TimedResourceGainSource,
    TimedTimeDilationSource,
    TimedKeywordActionSource,
    TimeScaleCurveKeySource,
    ProjectileSkillTriggerSource,
    ProjectileTriggeredSkillSource,
    ProjectileLaunchSource,
    TimedIntervalDamageSource,
    AbilityEntityHitSource,
    ResolvedDamageHitSource,
    ResolvedScheduleItemSource,
    BuffLifecycleSource,
    BuffDefinitionSource,
    UnparsedBuffPayloadSource,
    BuffAttributeModifierSource,
    BuffDamageModifierSource,
    BuffDamageScaleProcessorSource,
    BuffEventActionSource,
    EventBuffApplicationSource,
    SkillEventActionSequenceSource,
    SkillEventListenerSource,
    EntityCountConditionSource,
    BuffStackConditionSource,
    HealthConditionSource,
    MainOperatorConditionSource,
    TargetReferenceSource,
    TargetIdentityConditionSource,
    DistanceConditionSource,
    TimedMarkerConditionSource,
    GlobalCooldownConditionSource,
    SkillHasHitConditionSource,
    ConditionSource,
    EntityTagConditionSource,
    BlackboardCalculationPayload,
    BlackboardMutationPayload,
    BuffBlackboardReadPayload,
    BuffFinishPayload,
    BuffHoldSource,
    BuffStackReadPayload,
    BuffApplicationEntryPayload,
    BuffApplicationPayload,
    Vector3Source,
    AuraShapeSource,
    AuraTargetFilterSource,
    AuraActionSource,
    TimedMarkerApplicationPayload,
    GlobalCooldownApplicationPayload,
    ResourceGainPayload,
    ProjectileLaunchPayload,
    ConditionalProjectileProjection,
    AbilityEntitySpawnPayload,
    ConditionalBranchActionSource,
    ConditionalActionSource,
    SequenceGuardActionSource,
    SwitchActionSource,
    DoOnceActionSource,
    UnconditionalActionSource,
    BlackboardCalculationSource,
    BlackboardMutationSource,
    BuffBlackboardReadSource,
    BuffFinishSource,
    BlackboardKeyProvenanceSource,
    DeclaredBlackboardValueSource,
    TargetGroupInputSource,
    TargetGroupWriteSource,
    SkillSource,
    ResolvedScheduleItemType,
)
from source_utils import (
    action_name,
    parse_vector3,
    project_tick_interval_frames,
    require_bool,
    require_dict,
    require_list,
    require_non_negative_int,
    require_number,
    require_server_action_index,
    table_row,
    ts_inline_literal,
    ts_literal,
)
from progression_renderer import (
    BUILD_ATTRIBUTE_TYPES,
    render_potentials,
    render_talents,
    skill_id_by_key,
)
from passive_skill_parser import PassiveSkillSource, parse_passive_skill
from action_kinds import (
    AUDITED_COMBAT_ACTION_NAMES,
    AUDITED_COMBAT_EFFECT_ACTION_NAMES,
    COMBAT_ACTION_NAMES,
    COMBAT_EFFECT_ACTION_NAMES,
    CONDITIONAL_AUDIT_ACTION_NAMES,
    CONSUMED_ROOT_TIMED_MARKERS,
    SEQUENCE_GUARD_ACTION_NAMES,
    STATEFUL_COMBAT_ACTION_NAMES,
)
from action_payload_parser import (
    classify_buff,
    parse_ability_entity_spawn_payload,
    parse_blackboard_calculation_payload,
    parse_blackboard_mutation_payload,
    parse_buff_application_entries,
    parse_buff_application_payload,
    parse_buff_assignments,
    parse_buff_blackboard_read_payload,
    parse_buff_find_settings,
    parse_buff_finish_payload,
    parse_buff_stack_read_payload,
    parse_damage_units,
    parse_entity_blackboard_assignments,
    parse_global_cooldown_application_payload,
    parse_infliction_payload,
    parse_physical_infliction_payload,
    parse_projectile_launch_payload,
    parse_resource_gain_payload,
    parse_scalar,
    parse_tag_query,
    parse_timed_marker_application_payload,
    to_float32,
    walk_single_enemy_actions,
)
from conditional_parser import (
    contains_combat_effect,
    parse_conditional_actions,
    parse_ordered_action_sequence,
)
from source_schema import (
    AURA_ACTION_FIELDS,
    AURA_SEQUENCE_FIELDS,
    AURA_SHAPE_FIELDS,
    AURA_TARGET_FILTER_FIELDS,
    KNOWN_TARGET_FINDER_TYPES,
    KNOWN_TARGET_POST_PROCESSOR_TYPES,
    KNOWN_TARGET_VALIDATOR_TYPES,
    TARGET_GROUP_FIND_ACTION_FIELDS,
    TARGET_GROUP_MERGE_ACTION_FIELDS,
    TARGET_GROUP_MERGE_INPUT_FIELDS,
)
from target_parser import (
    parse_selector_summary,
    parse_target_reference,
    selector_component_name,
)
from buff_definition_compiler import compile_inline_buff_definition
from keyword_action_parser import parse_timed_keyword_actions



SCRIPT_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = SCRIPT_DIR.parents[1]
DEFAULT_MANIFEST = SCRIPT_DIR / "operators.json"
DEFAULT_SOURCE = REPOSITORY_ROOT.parent / "vfs-index-browser" / "combat-spec" / "artifacts" / "skill-data-cdn"
DEFAULT_TABLES = (
    REPOSITORY_ROOT.parent
    / "vfs-index-browser"
    / "combat-spec"
    / "artifacts"
    / "TableCfg-1.4.4-8764515-7"
)
DEFAULT_OUTPUT = REPOSITORY_ROOT / "src" / "next" / "data" / "operators" / "generated"

# Endaxis 固定为单敌人且命中必然发生；暂不模拟距离、轨迹和碰撞体。
ASSUMED_PROJECTILE_TRAVEL_FRAMES = 0

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
CONNECTED_RUNTIME_ATTRIBUTE_MODIFIERS = {
    "AtkIncreaseFactorFromStr",
    "AtkIncreaseFactorFromAgi",
    "AtkIncreaseFactorFromWisd",
    "AtkIncreaseFactorFromWill",
}



OPTIONAL_SOURCE_PAYLOAD_KEYS = frozenset(
    {
        "entityCount",
        "buffStack",
        "health",
        "mainOperator",
        "targetIdentity",
        "distance",
        "entityTag",
        "timedMarker",
        "globalCooldown",
        "skillHasHit",
        "nestedCondition",
        "targetFinderType",
        "onceScopeKey",
        "onceActions",
        "blackboardCalculation",
        "blackboardMutation",
        "buffBlackboardRead",
        "buffFinish",
        "buffStackRead",
        "buffApplication",
        "timedMarkerApplication",
        "globalCooldownApplication",
        "resourceGain",
        "infliction",
        "physicalInfliction",
        "projectileLaunch",
        "projectileTriggeredSkills",
        "abilityEntitySpawn",
        "auraAbilityEntityHits",
        "damageUnits",
        "keywordAction",
        "projectedAbilityEntitySpawns",
        "projectedProjectileLaunches",
    }
)

EMPTY_SOURCE_SEQUENCE_KEYS = frozenset(
    {
        "executionFrames",
        "projectedAbilityEntitySpawns",
        "projectedProjectileLaunches",
        "keywordActions",
        "targetValidatorTypes",
        "targetPostProcessorTypes",
    }
)

# 这些字段只服务于生成期归约，不属于可审计的游戏源数据。
INTERNAL_SOURCE_KEYS = frozenset({"localTargetGroupWrites"})


def serialize_audit_value(value: Any) -> Any:
    """序列化审计对象，并省略仅对特定条件有意义的空详情。"""
    if hasattr(value, "__dataclass_fields__"):
        return serialize_audit_value(asdict(value))
    if isinstance(value, dict):
        return {
            key: serialize_audit_value(item)
            for key, item in value.items()
            if not (
                key in INTERNAL_SOURCE_KEYS
                or (key in EMPTY_SOURCE_SEQUENCE_KEYS and not item)
                or (key in OPTIONAL_SOURCE_PAYLOAD_KEYS and item is None)
            )
        }
    if isinstance(value, (list, tuple)):
        return [serialize_audit_value(item) for item in value]
    return value


def omit_empty_execution_frames(value: Any) -> Any:
    """保留旧审计结构，只省略没有重复执行语义的空帧列表。"""
    if hasattr(value, "__dataclass_fields__"):
        return omit_empty_execution_frames(asdict(value))
    if isinstance(value, dict):
        return {
            key: omit_empty_execution_frames(item)
            for key, item in value.items()
            if not (
                key in INTERNAL_SOURCE_KEYS
                or (key in EMPTY_SOURCE_SEQUENCE_KEYS and not item)
                or (key in OPTIONAL_SOURCE_PAYLOAD_KEYS and item is None)
            )
        }
    if isinstance(value, (list, tuple)):
        return [omit_empty_execution_frames(item) for item in value]
    return value


COMPARISON_OPERATOR_MAP = {
    "LT": "less",
    "LE": "lessOrEqual",
    "GT": "greater",
    "GE": "greaterOrEqual",
    "Equals": "equal",
    "NotEquals": "notEqual",
}
ACTION_VALUE_OPERATION_MAP = {
    "Assign": "assign",
    "Add": "add",
    "Multiply": "multiply",
    "Divide": "divide",
    "Floor": "floor",
    "Ceil": "ceil",
    "RoundToInt": "roundToInt",
}
OPERATOR_MISSING_CAPABILITIES = {
    "skillBehavior",
    "skillAvailability",
    "talentEffects",
    "potentialEffects",
    "runtimeDependencies",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--tables", type=Path, default=DEFAULT_TABLES)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--operator", action="append", dest="operators")
    parser.add_argument("--check", action="store_true", help="校验现有输出是否与重新生成结果一致")
    return parser.parse_args()


def infer_unmodeled_progression_capabilities(operator: dict[str, Any]) -> list[dict[str, Any]]:
    """从清单中明确标为未建模的编译器推导稳定能力缺口。"""
    inferred: list[dict[str, Any]] = []
    for field, capability in (
        ("talents", "talentEffects"),
        ("potentials", "potentialEffects"),
    ):
        configs = require_list(operator.get(field, []), f"{operator['slug']}.{field}")
        if any(
            str(require_dict(item, f"{operator['slug']}.{field}[]").get("compile", "")).startswith(
                "unmodeled"
            )
            for item in configs
        ):
            inferred.append({"capability": capability})
    skill_group_keys: list[str] = []
    raw_skills = operator.get("skills")
    if isinstance(raw_skills, list):
        for skill_index, raw_skill in enumerate(raw_skills):
            skill = require_dict(raw_skill, f"{operator['slug']}.skills[{skill_index}]")
            compile_config = skill.get("compile")
            if not isinstance(compile_config, dict):
                continue
            unmodeled_buff_ids = require_list(
                compile_config.get("unmodeledBuffIds", []),
                f"{operator['slug']}.skills[{skill_index}].compile.unmodeledBuffIds",
            )
            if unmodeled_buff_ids:
                skill_group_keys.append(str(skill["key"]))
    if skill_group_keys:
        inferred.append({"capability": "skillBehavior", "skillGroupKeys": skill_group_keys})
    return inferred


def parse_conversion_support(operator: dict[str, Any]) -> dict[str, Any]:
    """读取面向产物的稳定摘要，并拒绝漏报清单中明确未建模的养成效果。"""
    inferred = infer_unmodeled_progression_capabilities(operator)
    raw = operator.get("conversionSupport")
    if raw is None:
        return {
            "completeness": "partial" if inferred else "complete",
            "missingCapabilities": inferred,
        }
    support = require_dict(raw, f"{operator['slug']}.conversionSupport")
    completeness = support.get("completeness")
    if completeness not in {"complete", "partial"}:
        raise ValueError(
            f"{operator['slug']}.conversionSupport.completeness: expected 'complete' or 'partial'"
        )
    missing: list[dict[str, Any]] = []
    for index, raw_item in enumerate(
        require_list(
            support.get("missingCapabilities"),
            f"{operator['slug']}.conversionSupport.missingCapabilities",
        )
    ):
        path = f"{operator['slug']}.conversionSupport.missingCapabilities[{index}]"
        item = require_dict(raw_item, path)
        capability = item.get("capability")
        if capability not in OPERATOR_MISSING_CAPABILITIES:
            raise ValueError(f"{path}.capability: unsupported capability {capability!r}")
        group_keys = item.get("skillGroupKeys")
        normalized = {"capability": capability}
        if group_keys is not None:
            keys = [str(value) for value in require_list(group_keys, f"{path}.skillGroupKeys")]
            if not keys or any(not key for key in keys):
                raise ValueError(f"{path}.skillGroupKeys: expected non-empty stable identities")
            normalized["skillGroupKeys"] = keys
        missing.append(normalized)
    declared_capabilities = {item["capability"] for item in missing}
    omitted = [item for item in inferred if item["capability"] not in declared_capabilities]
    if omitted:
        raise ValueError(
            f"{operator['slug']}.conversionSupport: missing inferred capabilities {omitted!r}"
        )
    if (completeness == "complete") != (len(missing) == 0):
        raise ValueError(
            f"{operator['slug']}.conversionSupport: completeness and missing capabilities disagree"
        )
    return {"completeness": completeness, "missingCapabilities": missing}


def combat_action_signature(action: dict[str, Any]) -> tuple[Any, ...] | None:
    name = action_name(str(action.get("$type", "")))
    if name not in AUDITED_COMBAT_ACTION_NAMES or name == "IfElseAction":
        return None
    if name == "DamageAction":
        payload = action.get("damageUnits")
    elif name == "CreateBuffAction":
        payload = action.get("buffs")
    elif name == "DestroyBuffAction":
        payload = action.get("buffIdList")
    elif name == "LaunchProjectile":
        payload = (action.get("projectileId"), action.get("projectileSkillId"))
    elif name == "SpawnAbilityEntity":
        payload = (action.get("abilityEntityId"), action.get("abilityEntitySkillId"))
    elif name == "SpellInfliction":
        payload = (action.get("inflictionType"), action.get("isExtra"))
    elif name == "ObtainCostAction":
        payload = (
            action.get("costType"),
            action.get("isPercentValue"),
            action.get("costValue"),
            action.get("coefficient"),
        )
    else:
        payload = action
    return (name, json.dumps(payload, ensure_ascii=False, sort_keys=True))


def walk_actions(
    value: Any,
    *,
    opaque_action_names: frozenset[str] = frozenset(),
) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        if value.get("isEnable") is False:
            return
        type_name = value.get("$type")
        if isinstance(type_name, str) and action_name(type_name) == "IfElseAction":
            succeed = list(
                walk_actions(
                    value.get("succeedActions"),
                    opaque_action_names=opaque_action_names,
                )
            )
            fail = list(
                walk_actions(
                    value.get("failActions"),
                    opaque_action_names=opaque_action_names,
                )
            )
            succeed_signature = tuple(
                signature
                for action in succeed
                if (signature := combat_action_signature(action)) is not None
            )
            fail_signature = tuple(
                signature
                for action in fail
                if (signature := combat_action_signature(action)) is not None
            )
            if succeed_signature == fail_signature:
                yield from succeed
            else:
                yield value
                yield from succeed
                yield from fail
            return
        if isinstance(type_name, str):
            yield value
            if action_name(type_name) in opaque_action_names:
                return
        for child in value.values():
            yield from walk_actions(child, opaque_action_names=opaque_action_names)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            if isinstance(child, dict):
                type_name = child.get("$type")
                if (
                    child.get("isEnable") is not False
                    and isinstance(type_name, str)
                    and action_name(type_name) in SEQUENCE_GUARD_ACTION_NAMES
                ):
                    # 纯表现尾部不进入战斗生成器；含战斗效果的尾部必须保留守卫并阻止误编译。
                    if contains_combat_effect(value[index + 1 :]):
                        yield child
                    continue
            yield from walk_actions(child, opaque_action_names=opaque_action_names)


def walk_unconditional_actions(value: Any) -> Iterable[dict[str, Any]]:
    """只展开动作列表容器；具体 Action 的子树必须交给对应语义解析器。"""
    if isinstance(value, dict):
        if isinstance(value.get("$type"), str):
            yield value
            return
        for child in value.values():
            yield from walk_unconditional_actions(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_unconditional_actions(child)


def contains_serialized_value(value: Any, expected: Any) -> bool:
    """递归检查序列化动作树是否携带指定字面量。"""
    if value == expected:
        return True
    if isinstance(value, dict):
        return any(contains_serialized_value(child, expected) for child in value.values())
    if isinstance(value, list):
        return any(contains_serialized_value(child, expected) for child in value)
    return False


def project_channel_trigger_frames(
    start_frame: int,
    end_frame: int,
    *,
    execute_each_frame: bool,
    trigger_interval: float,
    max_count_per_target: int,
    target_trigger_interval: float,
) -> tuple[int, ...]:
    """投影固定 30 Hz、单目标模型下 ChannelingAction 的实际触发帧。

    原生动作先按全局扫描节奏寻找目标，再对每个目标分别检查次数和时间间隔。
    Endaxis 不模拟跳帧更新，因此这里逐逻辑帧推进；区间终点会先 Tick 再 End。
    """
    if start_frame < 0 or end_frame < start_frame:
        raise ValueError("channel frame range must be non-negative and ordered")
    if not isinstance(execute_each_frame, bool):
        raise ValueError("channel executeEachFrame must be boolean")
    if not isinstance(max_count_per_target, int) or isinstance(
        max_count_per_target, bool
    ):
        raise ValueError("channel maxCountPerTarget must be integer")
    for name, value in (
        ("triggerInterval", trigger_interval),
        ("targetTriggerInterval", target_trigger_interval),
    ):
        if (
            not isinstance(value, (int, float))
            or isinstance(value, bool)
            or not math.isfinite(value)
        ):
            raise ValueError(f"channel {name} must be a finite number")

    frame_delta = to_float32(1 / 30)
    trigger_interval_f32 = to_float32(float(trigger_interval))
    target_interval_f32 = to_float32(float(target_trigger_interval))
    timer = to_float32(0)
    global_trigger_count = 0
    target_trigger_count = 0
    last_target_trigger_time = to_float32(0)
    last_checked_frame = -1
    result: list[int] = []

    for frame in range(start_frame, end_frame + 1):
        # 技能施放入口会立即执行一次 OnTick(0, 0)；后续逻辑帧固定推进 1/30 秒。
        delta = 0.0 if frame == 0 else frame_delta
        timer = to_float32(timer + delta)
        previous_checked_frame = last_checked_frame
        last_checked_frame = frame

        should_scan = execute_each_frame and previous_checked_frame != frame
        if not should_scan:
            threshold = to_float32(
                to_float32(float(global_trigger_count)) * trigger_interval_f32
            )
            should_scan = timer >= threshold
        if not should_scan:
            continue
        global_trigger_count += 1

        if (
            max_count_per_target >= 0
            and target_trigger_count >= max_count_per_target
        ):
            continue
        if target_trigger_count > 0:
            elapsed = to_float32(timer - last_target_trigger_time)
            if not elapsed > target_interval_f32:
                continue

        result.append(frame)
        target_trigger_count += 1
        last_target_trigger_time = timer

    return tuple(result)


def project_single_enemy_channeling_timeline(
    root: dict[str, Any], source_name: str
) -> dict[str, Any]:
    """把根时间轴中的直接 ChannelingAction 展开为共享的一次性动作节点。

    Context/Target 在固定单敌人模型中投影为敌人。Owner 只有在子序列不读取当前
    Target 时才可展开，否则必须先保留原生输入目标身份。
    """
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    timelines = require_list(
        group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions"
    )
    projected_timelines: list[dict[str, Any]] = []

    for timeline_index, raw_timeline in enumerate(timelines):
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
        # 部分子技能测试夹具和已归一化输入会直接把单个动作放在该字段；其中没有
        # 可安全抽取的兄弟 ChannelingAction，保持原节点交给后续严格解析器处理。
        if "actionData" not in sequence:
            projected_timelines.append(timeline)
            continue
        actions = require_list(
            sequence.get("actionData"), f"{timeline_path}._sequenceActionData.actionData"
        )
        retained_actions: list[Any] = []
        emitted_timelines: list[dict[str, Any]] = []

        for action_index, raw_action in enumerate(actions):
            action_path = f"{timeline_path}.actionData[{action_index}]"
            action = require_dict(raw_action, action_path)
            if action_name(str(action.get("$type", ""))) != "ChannelingAction":
                retained_actions.append(action)
                continue
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
            if set(action) != expected_fields:
                raise ValueError(
                    f"{action_path}.ChannelingAction: unexpected fields {sorted(action)}"
                )
            if action.get("isEnable") is False:
                continue

            target = require_dict(
                action.get("targetSettings"),
                f"{action_path}.ChannelingAction.targetSettings",
            )
            target_source = target.get("targetSource")
            if target_source not in {"Context", "Target", "Owner"}:
                raise ValueError(
                    f"{action_path}.ChannelingAction: target source {target_source!r} "
                    "requires explicit input target projection"
                )
            selector = require_dict(
                target.get("selectorData"),
                f"{action_path}.ChannelingAction.targetSettings.selectorData",
            )
            if selector.get("validatorData") != [] or selector.get("postProcessorData") != []:
                raise ValueError(
                    f"{action_path}.ChannelingAction: target selector is not identity-only"
                )
            if "finderData" in selector:
                raise ValueError(
                    f"{action_path}.ChannelingAction: target selector finder is unsupported"
                )
            if target_source == "Context" and not target.get("targetGroupKey"):
                raise ValueError(
                    f"{action_path}.ChannelingAction: Context target requires a group key"
                )

            trigger_frames = project_channel_trigger_frames(
                start_frame,
                end_frame,
                execute_each_frame=action.get("executeEachFrame"),
                trigger_interval=action.get("triggerInterval"),
                max_count_per_target=action.get("maxCountPerTarget"),
                target_trigger_interval=action.get("targetTriggerInterval"),
            )
            action_on_tick = require_dict(
                action.get("actionOnTick"),
                f"{action_path}.ChannelingAction.actionOnTick",
            )
            if target_source == "Owner" and contains_serialized_value(
                action_on_tick, "Target"
            ):
                raise ValueError(
                    f"{action_path}.ChannelingAction: Owner target with Target-dependent "
                    "tick actions requires explicit input target projection"
                )
            for frame in trigger_frames:
                emitted_timelines.append(
                    {
                        "_startFrame": frame,
                        "_endFrame": frame,
                        "_sequenceActionData": action_on_tick,
                        "forceSyncAnimData": False,
                    }
                )

        if retained_actions:
            retained_sequence = {**sequence, "actionData": retained_actions}
            projected_timelines.append(
                {**timeline, "_sequenceActionData": retained_sequence}
            )
        projected_timelines.extend(emitted_timelines)

    projected_group = {
        **group,
        "timelineActions": projected_timelines,
    }
    return {**root, "actionGroupData": projected_group}


def load_projected_skill_data(source_path: Path, source_name: str) -> dict[str, Any]:
    """加载技能数据，并建立后续所有语义解析器共享的单敌人时间轴视图。"""
    root = require_dict(json.loads(source_path.read_text(encoding="utf-8")), source_name)
    return project_single_enemy_channeling_timeline(root, source_name)


def collect_timed_marker_damage_gates(value: Any, path: str) -> dict[int, TimedMarkerGateSource]:
    """识别 `检查目标标记 -> 伤害 -> 创建同标记` 的单目标去重序列。"""
    result: dict[int, TimedMarkerGateSource] = {}

    def visit(current: Any, current_path: str) -> None:
        if isinstance(current, list):
            for index, child in enumerate(current):
                visit(child, f"{current_path}[{index}]")
            return
        if not isinstance(current, dict):
            return
        if action_name(str(current.get("$type", ""))) == "ForEachAction":
            action_group = require_dict(current.get("action"), f"{current_path}.action")
            actions = [
                require_dict(raw, f"{current_path}.action.actionData[{index}]")
                for index, raw in enumerate(
                    require_list(action_group.get("actionData"), f"{current_path}.action.actionData")
                )
                if not isinstance(raw, dict) or raw.get("isEnable") is not False
            ]
            for index, action in enumerate(actions):
                if action_name(str(action.get("$type", ""))) != "DamageAction":
                    continue
                previous = actions[index - 1] if index > 0 else None
                following = actions[index + 1] if index + 1 < len(actions) else None
                if (
                    previous is None
                    or following is None
                    or action_name(str(previous.get("$type", ""))) != "CheckTimedMarkerCondition"
                    or action_name(str(following.get("$type", ""))) != "CreateTimedMarker"
                ):
                    continue
                check_target = require_dict(
                    previous.get("checkTarget"), f"{current_path}.CheckTimedMarkerCondition.checkTarget"
                )
                marker = require_dict(
                    following.get("markerId"), f"{current_path}.CreateTimedMarker.markerId"
                )
                duration = require_dict(
                    following.get("duration"), f"{current_path}.CreateTimedMarker.duration"
                )
                marker_key = previous.get("blackboardKey")
                if (
                    check_target.get("targetSource") != "Target"
                    or previous.get("useBlackboardKey") is not True
                    or not isinstance(marker_key, str)
                    or not marker_key
                    or marker.get("useBlackboardKey") is not True
                    or marker.get("blackboardKey") != marker_key
                    or duration.get("useBlackboardKey") is not False
                    or not isinstance(duration.get("value"), (int, float))
                    or isinstance(duration.get("value"), bool)
                ):
                    raise ValueError(f"{current_path}: unsupported timed marker damage gate")
                result[id(action)] = TimedMarkerGateSource(
                    markerBlackboardKey=marker_key,
                    returnTrueIfNotExists=previous.get("returnTrueIfNotExists") is True,
                    durationSeconds=float(duration["value"]),
                )
        for key, child in current.items():
            visit(child, f"{current_path}.{key}")

    visit(value, path)
    return result


def collect_once_resource_gain_gates(value: Any, path: str) -> dict[int, str]:
    """识别单敌人命中后只允许首次回能的动作黑板门。"""
    result: dict[int, str] = {}

    def visit(current: Any, current_path: str) -> None:
        if isinstance(current, list):
            for index, child in enumerate(current):
                visit(child, f"{current_path}[{index}]")
            return
        if not isinstance(current, dict):
            return
        raw_actions = current.get("actionData")
        if isinstance(raw_actions, list):
            actions = [require_dict(action, f"{current_path}.actionData") for action in raw_actions]
            for index in range(len(actions) - 3):
                check_entity, compare, gain, mutation = actions[index : index + 4]
                if [action_name(str(action.get("$type", ""))) for action in actions[index : index + 4]] != [
                    "CheckEntityNum",
                    "CompareFloat",
                    "ObtainCostAction",
                    "ModifyDynamicBlackboard",
                ]:
                    continue
                target = require_dict(
                    check_entity.get("checkTarget"), f"{current_path}.CheckEntityNum.checkTarget"
                )
                left = require_dict(compare.get("valueA"), f"{current_path}.CompareFloat.valueA")
                right = require_dict(compare.get("valueB"), f"{current_path}.CompareFloat.valueB")
                value = require_dict(
                    mutation.get("value"), f"{current_path}.ModifyDynamicBlackboard.value"
                )
                flag_key = left.get("blackboardKey")
                if not (
                    target.get("targetSource") == "Context"
                    and isinstance(target.get("targetGroupKey"), str)
                    and target.get("targetGroupKey")
                    and check_entity.get("minNum") == 1
                    and check_entity.get("compareType") == "GE"
                    and left.get("useBlackboardKey") is True
                    and isinstance(flag_key, str)
                    and flag_key
                    and compare.get("compare") == "Equals"
                    and right.get("useBlackboardKey") is False
                    and right.get("value") == 0
                    and mutation.get("key") == flag_key
                    and mutation.get("operation") == "Assign"
                    and mutation.get("directValue") is True
                    and value.get("useBlackboardKey") is False
                    and value.get("value") == 1
                ):
                    raise ValueError(f"{current_path}: unsupported once-only resource gain gate")
                result[id(gain)] = flag_key
        for key, child in current.items():
            visit(child, f"{current_path}.{key}")

    visit(value, path)
    return result


def collect_blackboard_keys(value: Any) -> tuple[str, ...]:
    keys: set[str] = set()
    if isinstance(value, dict):
        if value.get("useBlackboardKey") is True:
            key = value.get("blackboardKey")
            if key:
                if not isinstance(key, str):
                    raise ValueError("non-empty blackboardKey must be a string")
                keys.add(key)
        for child in value.values():
            keys.update(collect_blackboard_keys(child))
    elif isinstance(value, list):
        for child in value:
            keys.update(collect_blackboard_keys(child))
    return tuple(sorted(keys))


def parse_declared_blackboard(
    root: dict[str, Any], source_name: str
) -> tuple[DeclaredBlackboardValueSource, ...]:
    """严格读取 SkillData 的数值或字符串黑板声明。"""
    result: list[DeclaredBlackboardValueSource] = []
    for index, raw_entry in enumerate(require_list(root.get("blackboard"), f"{source_name}.blackboard")):
        entry = require_dict(raw_entry, f"{source_name}.blackboard[{index}]")
        key = entry.get("key")
        if not isinstance(key, str) or not key:
            raise ValueError(f"{source_name}.blackboard[{index}].key: expected non-empty string")
        value = entry.get("valueDouble")
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            raise ValueError(f"{source_name}.blackboard[{index}].valueDouble: expected number")
        value_str = entry.get("valueStr")
        if not isinstance(value_str, str):
            raise ValueError(f"{source_name}.blackboard[{index}].valueStr: expected string")
        if value_str and float(value) != 0.0:
            raise ValueError(
                f"{source_name}.blackboard[{index}]: numeric and string values are both set"
            )
        is_dynamic = entry.get("isDynamic")
        if not isinstance(is_dynamic, bool):
            raise ValueError(f"{source_name}.blackboard[{index}].isDynamic: expected boolean")
        result.append(
            DeclaredBlackboardValueSource(
                key,
                value_str if value_str else float(value),
                is_dynamic,
            )
        )
    if len({item.key for item in result}) != len(result):
        raise ValueError(f"{source_name}.blackboard: duplicate key")
    return tuple(sorted(result, key=lambda item: item.key))


def collect_declared_blackboard_keys(root: dict[str, Any], source_name: str) -> tuple[str, ...]:
    return tuple(item.key for item in parse_declared_blackboard(root, source_name))


def numeric_declared_blackboard(
    values: tuple[DeclaredBlackboardValueSource, ...],
) -> dict[str, tuple[float, ...]]:
    """只向数值计算层提供非动态数值；字符串身份保留在审计层。"""
    return {
        item.key: (item.value,)
        for item in values
        if not item.isDynamic and isinstance(item.value, float)
    }


def build_blackboard_provenance(
    root: dict[str, Any],
    source_name: str,
    patch: SkillPatchSource,
    calculations: tuple[BlackboardCalculationSource, ...],
    mutations: tuple[BlackboardMutationSource, ...],
    reads: tuple[BuffBlackboardReadSource, ...],
) -> tuple[BlackboardKeyProvenanceSource, ...]:
    referenced = set(collect_blackboard_keys(root))
    declared = set(collect_declared_blackboard_keys(root, source_name))
    supplied = set(patch.blackboard)
    calculated = {item.key for item in calculations}
    mutated = {item.key for item in mutations}
    read = {item.outputKey for item in reads}
    keys = referenced | declared | supplied | calculated | mutated | read
    return tuple(
        BlackboardKeyProvenanceSource(
            key=key,
            declaredInSkill=key in declared,
            suppliedByPatch=key in supplied,
            calculatedLocally=key in calculated,
            mutatedLocally=key in mutated,
            readFromBuff=key in read,
            externalRuntimeInput=(
                key in referenced
                and key not in declared
                and key not in supplied
                and key not in calculated
                and key not in mutated
                and key not in read
            ),
        )
        for key in sorted(keys)
    )


def resolve_skill_blackboard(
    root: dict[str, Any],
    source_name: str,
    patch: SkillPatchSource,
) -> dict[str, tuple[float, ...]]:
    """合并技能静态默认值与逐等级补丁；动态声明不能在导入时冻结。"""
    resolved = {
        key: values * len(patch.levels)
        for key, values in numeric_declared_blackboard(
            parse_declared_blackboard(root, source_name)
        ).items()
    }
    resolved.update(patch.blackboard)
    return resolved


def is_projectile_trigger_excluded_for_single_enemy(
    root: dict[str, Any],
    launch_frame: int,
    launch_action_index: int,
    trigger_root: dict[str, Any],
    trigger_source_name: str,
) -> bool:
    """识别先标记主目标、再仅处理未标记命中目标的额外目标投射物。"""

    active_markers: set[str] = set()
    group = require_dict(root.get("actionGroupData"), "projectile source.actionGroupData")
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), "projectile source.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"projectile source.timelineActions[{timeline_index}]")
        marker_frame = require_non_negative_int(
            timeline.get("_startFrame"),
            f"projectile source.timelineActions[{timeline_index}]._startFrame",
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action.get("isEnable") is False or action_name(action["$type"]) != "CreateTimedMarker":
                continue
            action_index = require_server_action_index(action, "projectile source.CreateTimedMarker")
            if marker_frame > launch_frame or (
                marker_frame == launch_frame and action_index >= launch_action_index
            ):
                continue
            target = require_dict(
                action.get("targetSettings"), "projectile source.CreateTimedMarker.targetSettings"
            )
            marker = require_dict(
                action.get("markerId"), "projectile source.CreateTimedMarker.markerId"
            )
            duration = require_dict(
                action.get("duration"), "projectile source.CreateTimedMarker.duration"
            )
            if (
                target.get("targetSource") != "Context"
                or target.get("targetGroupKey") != "smart_target"
                or marker.get("useBlackboardKey") is not False
                or not isinstance(marker.get("value"), str)
                or not marker["value"]
                or duration.get("useBlackboardKey") is not False
                or not isinstance(duration.get("value"), (int, float))
                or isinstance(duration.get("value"), bool)
            ):
                continue
            elapsed_seconds = (launch_frame - marker_frame) / 30
            if float(duration["value"]) > elapsed_seconds:
                active_markers.add(marker["value"])

    if not active_markers:
        return False

    combat_actions = [
        action
        for action in walk_actions(trigger_root.get("actionGroupData"))
        if action_name(action["$type"]) in COMBAT_ACTION_NAMES
    ]
    if not combat_actions:
        return False

    guarded_combat_action_ids: set[int] = set()
    for action in walk_actions(trigger_root.get("actionGroupData")):
        if action_name(action["$type"]) != "ForEachAction":
            continue
        target = require_dict(action.get("target"), f"{trigger_source_name}.ForEachAction.target")
        if target.get("targetSource") != "Target" or target.get("targetGroupKey") != "":
            continue
        nested = require_dict(action.get("action"), f"{trigger_source_name}.ForEachAction.action")
        nested_actions = [
            require_dict(item, f"{trigger_source_name}.ForEachAction.action.actionData")
            for item in require_list(
                nested.get("actionData"), f"{trigger_source_name}.ForEachAction.action.actionData"
            )
            if not isinstance(item, dict) or item.get("isEnable") is not False
        ]
        if not nested_actions:
            continue
        check = nested_actions[0]
        if action_name(str(check.get("$type", ""))) != "CheckTimedMarkerCondition":
            continue
        check_target = require_dict(
            check.get("checkTarget"), f"{trigger_source_name}.CheckTimedMarkerCondition.checkTarget"
        )
        marker_id = check.get("id")
        if (
            check_target.get("targetSource") != "Target"
            or check_target.get("targetGroupKey") != ""
            or check.get("useBlackboardKey") is not False
            or check.get("returnTrueIfNotExists") is not True
            or marker_id not in active_markers
        ):
            continue
        guarded_combat_action_ids.update(
            id(item)
            for item in walk_actions({"actionData": nested_actions[1:]})
            if action_name(item["$type"]) in COMBAT_ACTION_NAMES
        )

    return all(id(action) in guarded_combat_action_ids for action in combat_actions)


def parse_blackboard_calculations(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[BlackboardCalculationSource, ...]:
    """读取会为后续动作派生数值的 SimpleCalcBBAction。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[BlackboardCalculationSource] = []
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
        for action in walk_single_enemy_actions(
            timeline.get("_sequenceActionData"),
            f"{source_name}.timelineActions[{timeline_index}]",
        ):
            if action_name(action["$type"]) != "SimpleCalcBBAction":
                continue
            payload = parse_blackboard_calculation_payload(
                action,
                f"{source_name}.SimpleCalcBBAction",
                inherited_blackboard,
            )
            result.append(
                BlackboardCalculationSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        action, f"{source_name}.SimpleCalcBBAction"
                    ),
                    key=payload.key,
                    operation=payload.operation,
                    left=payload.left,
                    right=payload.right,
                    sequenceIndex=timeline_index,
                )
            )
    return tuple(result)


def parse_blackboard_runtime_actions(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[
    tuple[BlackboardMutationSource, ...],
    tuple[BuffBlackboardReadSource, ...],
    tuple[BuffFinishSource, ...],
]:
    """读取会改变技能黑板，或从目标 Buff 黑板取值的运行时动作。"""
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


def parse_buff_hold_actions(
    root: dict[str, Any], source_name: str
) -> tuple[BuffHoldSource, ...]:
    """读取 ExtendBuffAction 的固定实例保护区间；当前只保留原生查询事实。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[BuffHoldSource] = []
    timelines = require_list(
        group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions"
    )
    expected_action_fields = {
        "$type",
        "isEnable",
        "priorityLevel",
        "priorityOffset",
        "serverActionIndex",
        "buffOwner",
        "buffSettings",
    }
    for timeline_index, raw_timeline in enumerate(timelines):
        timeline_path = f"{source_name}.timelineActions[{timeline_index}]"
        timeline = require_dict(raw_timeline, timeline_path)
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{timeline_path}._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{timeline_path}._endFrame"
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "ExtendBuffAction":
                continue
            action_path = f"{timeline_path}.ExtendBuffAction"
            if set(action) != expected_action_fields:
                raise ValueError(f"{action_path}: unexpected fields {sorted(action)}")
            if action.get("isEnable") is not True:
                raise ValueError(f"{action_path}.isEnable: expected true")
            target = require_dict(action.get("buffOwner"), f"{action_path}.buffOwner")
            check_type, buff_ids, query_type, tag_ids = parse_buff_find_settings(
                action.get("buffSettings"), f"{action_path}.buffSettings"
            )
            result.append(
                BuffHoldSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(action, action_path),
                    targetSource=str(target.get("targetSource", "")),
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    buffCheckType=check_type,
                    buffIds=buff_ids,
                    tagQueryType=query_type,
                    buffTagIds=tag_ids,
                    sequenceIndex=timeline_index,
                )
            )
    return tuple(result)


def parse_direct_damage_hits(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[TimedDamageSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    marker_gates = collect_timed_marker_damage_gates(group, f"{source_name}.actionGroupData")
    result: list[TimedDamageSource] = []
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
        actions = list(
            walk_single_enemy_actions(
                timeline.get("_sequenceActionData"),
                f"{source_name}.timelineActions[{timeline_index}]",
            )
        )
        for action in actions:
            if action_name(action["$type"]) != "DamageAction":
                continue
            action_root = {"actionGroupData": {"action": action}}
            result.append(
                TimedDamageSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        action, f"{source_name}.DamageAction"
                    ),
                    damageUnits=parse_damage_units(action_root, source_name, inherited_blackboard),
                    timedMarkerGate=marker_gates.get(id(action)),
                    sequenceIndex=timeline_index,
                )
            )
    return tuple(result)


def parse_interval_damage_hits(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[TimedIntervalDamageSource, ...]:
    """解析固定间隔内每次都由等价分支执行的伤害。"""

    def enabled_actions(sequence: Any, path: str) -> list[dict[str, Any]]:
        data = require_dict(sequence, path)
        result: list[dict[str, Any]] = []
        for index, raw_action in enumerate(
            require_list(data.get("actionData"), f"{path}.actionData")
        ):
            action = require_dict(raw_action, f"{path}.actionData[{index}]")
            if action.get("isEnable") is not False:
                result.append(action)
        return result

    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedIntervalDamageSource] = []
    timelines = require_list(
        group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions"
    )
    for timeline_index, raw_timeline in enumerate(timelines):
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
                action_name(action["$type"]) != "TickIntervalAction"
                or action.get("isEnable") is False
            ):
                continue
            action_path = f"{timeline_path}.TickIntervalAction"
            if (
                action.get("executeEachFrame") is not False
                or action.get("useTickIntervalBlackboardKey") is not False
                or action.get("tickIntervalBlackboardKey") != ""
            ):
                raise ValueError(f"{action_path}: only a fixed literal interval is supported")
            interval_seconds = action.get("tickInterval")
            if (
                not isinstance(interval_seconds, (int, float))
                or isinstance(interval_seconds, bool)
                or interval_seconds <= 0
            ):
                raise ValueError(f"{action_path}.tickInterval: expected positive number")
            tick_actions = enabled_actions(
                action.get("actionOnTick"), f"{action_path}.actionOnTick"
            )
            branches = [
                item for item in tick_actions if action_name(item["$type"]) == "IfElseAction"
            ]
            if len(branches) != 1:
                if any(action_name(item["$type"]) == "DamageAction" for item in tick_actions):
                    raise ValueError(f"{action_path}: unsupported direct tick damage shape")
                continue
            branch = branches[0]
            branch_damage_actions: list[list[dict[str, Any]]] = []
            for branch_name in ("succeedActions", "failActions"):
                actions = enabled_actions(branch.get(branch_name), f"{action_path}.{branch_name}")
                branch_damage_actions.append(
                    [item for item in actions if action_name(item["$type"]) == "DamageAction"]
                )
            if not branch_damage_actions[0] and not branch_damage_actions[1]:
                continue
            if any(len(actions) != 1 for actions in branch_damage_actions):
                raise ValueError(f"{action_path}: tick branches have asymmetric direct damage")

            branch_damage: list[tuple[int, tuple[DamageUnitSource, ...]]] = []
            for branch_name, damage_actions in zip(
                ("succeedActions", "failActions"), branch_damage_actions, strict=True
            ):
                damage = damage_actions[0]
                damage_root = {"actionGroupData": {"action": damage}}
                branch_damage.append(
                    (
                        require_server_action_index(
                            damage, f"{action_path}.{branch_name}.DamageAction"
                        ),
                        parse_damage_units(damage_root, action_path, inherited_blackboard),
                    )
                )
            if branch_damage[0][1] != branch_damage[1][1]:
                raise ValueError(f"{action_path}: tick branches do not deal equivalent damage")
            # 原生按秒累计单精度计时器；激活帧立即触发，结束帧仍会更新一次。
            tick_frames = project_tick_interval_frames(
                start_frame, end_frame, float(interval_seconds)
            )
            if not tick_frames:
                raise ValueError(f"{action_path}: interval produces no ticks")
            result.append(
                TimedIntervalDamageSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(action, action_path),
                    intervalSeconds=float(interval_seconds),
                    tickFrames=tick_frames,
                    damageActionIndex=min(item[0] for item in branch_damage),
                    damageUnits=branch_damage[0][1],
                    sequenceIndex=timeline_index,
                )
            )
    return tuple(result)


def parse_inflictions(root: dict[str, Any], source_name: str) -> tuple[TimedInflictionSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedInflictionSource] = []
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
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "SpellInfliction":
                continue
            payload = parse_infliction_payload(action, f"{source_name}.SpellInfliction")
            result.append(
                TimedInflictionSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        action, f"{source_name}.SpellInfliction"
                    ),
                    element=payload.element,
                    isExtra=payload.isExtra,
                    sequenceIndex=timeline_index,
                )
            )
    return tuple(result)


def parse_physical_inflictions(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[TimedPhysicalInflictionSource, ...]:
    """解析根时间轴中的物理异常；条件分支由 conditional_parser 保留。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedPhysicalInflictionSource] = []
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
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "FractureAction":
                continue
            path = f"{source_name}.FractureAction"
            result.append(
                TimedPhysicalInflictionSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(action, path),
                    payload=parse_physical_infliction_payload(
                        action, path, inherited_blackboard
                    ),
                )
            )
    return tuple(result)


def collect_referenced_buff_ids(root: dict[str, Any], source_name: str) -> tuple[str, ...]:
    """收集整棵动作树直接创建或由光环维持的 Buff；不改变其控制流归属。"""
    return collect_created_buff_ids(root.get("actionGroupData"), source_name)


def collect_created_buff_ids(value: Any, source_name: str) -> tuple[str, ...]:
    """从任意动作容器收集 Buff 引用，供技能与 Buff 定义共同使用。"""
    result: set[str] = set()
    for action in walk_actions(value):
        name = action_name(action["$type"])
        if name not in {"CreateBuffAction", "AuraAction"}:
            continue
        field = "buffs" if name == "CreateBuffAction" else "buffInput"
        for index, raw_buff in enumerate(
            require_list(action.get(field), f"{source_name}.{name}.{field}")
        ):
            buff = require_dict(raw_buff, f"{source_name}.{name}.{field}[{index}]")
            buff_id = buff.get("buffId")
            if not isinstance(buff_id, str) or not buff_id:
                raise ValueError(
                    f"{source_name}.{name}.{field}[{index}].buffId: expected string"
                )
            result.add(buff_id)
    return tuple(sorted(result))


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
    # true 只表示该 Buff 的修正来自“已转换属性”，ConvertToServer 仍逐个转换
    # attributeModifiers；本层保留字段事实为 unparsedPayloads，避免把它当作普通修正放行。

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
) -> tuple[tuple[BuffDamageModifierSource, ...], int]:
    """解析 Buff 在伤害结算阶段注册的目标标签条件与倍率处理器。"""
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
        if len(condition_actions) != 1:
            unsupported_count += 1
            continue
        tag_condition = require_dict(
            condition_actions[0], f"{path}.condition.actionData[0]"
        )
        if action_name(str(tag_condition.get("$type", ""))) != "CheckTagMatch":
            unsupported_count += 1
            continue
        expected_tag_condition_fields = {
            "$type",
            "isEnable",
            "priorityLevel",
            "priorityOffset",
            "serverActionIndex",
            "checkTarget",
            "query",
        }
        if set(tag_condition) != expected_tag_condition_fields:
            raise ValueError(
                f"{path}.condition.actionData[0]: unexpected fields "
                f"{sorted(tag_condition)}"
            )
        if tag_condition.get("isEnable") is not True:
            raise ValueError(f"{path}.condition.actionData[0].isEnable: expected true")
        target = parse_target_reference(
            tag_condition.get("checkTarget"),
            f"{path}.condition.actionData[0].checkTarget",
        )
        query_type, tag_ids = parse_tag_query(
            tag_condition.get("query"), f"{path}.condition.actionData[0].query"
        )
        if not tag_ids:
            raise ValueError(f"{path}.condition: empty tag query")

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
                targetSource=target.targetSource,
                targetGroupKey=target.targetGroupKey,
                tagQueryType=query_type,
                tagIds=tag_ids,
                processors=tuple(processors),
            )
        )
    return tuple(result), unsupported_count


def parse_buff_event_actions(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[BuffEventActionSource, ...]:
    """保留 Buff 与宿主实体事件中的动作事实；子 Buff 定义由中央目录递归解析。"""
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
            walked_actions = [
                item
                for item in walk_unconditional_actions(actions)
                if item.get("isEnable") is not False
            ]
            ordered_action_types = tuple(
                action_name(item["$type"]) for item in walked_actions
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
                    damageUnits=parse_damage_units(
                        action_root, f"{source_name}.{event_name}", blackboard
                    ),
                    buffApplications=buff_applications,
                    createdBuffIds=collect_created_buff_ids(actions, source_name),
                )
            )
    return tuple(result)


def parse_skill_event_listeners(
    root: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[SkillEventListenerSource, ...]:
    """解析技能区间内的事件监听器；事件动作不会被提升为无条件时间轴动作。"""
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


UNPARSED_BUFF_PAYLOAD_FIELDS = (
    "globalModifier",
    "healModifier",
    "igniteEventAction",
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
    attribute_modifier = buff.get("attributeModifier")
    if unsupported_damage_modifiers:
        result.append(
            UnparsedBuffPayloadSource(
                field="damageModifier",
                entryCount=unsupported_damage_modifiers,
            )
        )
    if isinstance(attribute_modifier, dict) and attribute_modifier.get("isConvertedAttribute") is True:
        result.append(
            UnparsedBuffPayloadSource(
                field="attributeModifier.isConvertedAttribute",
                entryCount=1,
            )
        )
    return tuple(result)


def resolve_buff_definitions(
    buff_ids: tuple[str, ...],
    buff_source_dirs: Path | Iterable[Path],
) -> tuple[BuffDefinitionSource, ...]:
    """解析传递 Buff 依赖的定义事实；应用参数不得污染定义自身的黑板默认值。

    多个候选目录按顺序查找：主目录仍是人工整理的 `BuffData`，缺文件时回退到
    `buff-data-current` 之类的完整导出，避免公共 Buff 仅因不在精选目录中而被误报缺失。
    """
    dirs = (
        (buff_source_dirs,)
        if isinstance(buff_source_dirs, Path)
        else tuple(buff_source_dirs)
    )
    result: dict[str, BuffDefinitionSource] = {}
    pending = list(buff_ids)
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
                conditionalActions=(),
                blackboardCalculations=(),
                blackboardMutations=(),
                buffBlackboardReads=(),
                buffFinishes=(),
                eventActions=(),
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
            buff, source_file, blackboard
        )
        result[buff_id] = BuffDefinitionSource(
            buffId=buff_id,
            sourceFile=source_file,
            sourceAvailable=True,
            lifecycle=parse_buff_lifecycle(buff, source_file, blackboard),
            blackboard=declared_blackboard,
            applyTagIds=parse_buff_apply_tag_ids(buff, source_file),
            extendTagIds=parse_buff_extend_tag_ids(buff, source_file),
            attributeModifiers=parse_buff_attribute_modifiers(
                buff, source_file, blackboard
            ),
            damageModifiers=damage_modifiers,
            directDamageHits=parse_direct_damage_hits(adapted_root, source_file, blackboard),
            conditionalActions=parse_conditional_actions(adapted_root, source_file, blackboard),
            blackboardCalculations=parse_blackboard_calculations(
                adapted_root, source_file, blackboard
            ),
            blackboardMutations=mutations,
            buffBlackboardReads=reads,
            buffFinishes=finishes,
            eventActions=parse_buff_event_actions(buff, source_file, blackboard),
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
        )
        pending.extend(
            child_id
            for child_id in collect_created_buff_ids(buff, source_file)
            if child_id not in result
        )
    return tuple(result[buff_id] for buff_id in sorted(result))


def resolve_operator_buff_definitions(
    skills: Iterable[SkillSource],
    buff_source_dir: Path,
) -> tuple[BuffDefinitionSource, ...]:
    """按干员汇总技能引用，生成一份共享且去重的 Buff 定义目录。"""
    referenced_ids = tuple(
        sorted({buff_id for skill in skills for buff_id in skill.referencedBuffIds})
    )
    # 主目录保持精选 BuffData；完整导出回退用于公共 Buff 与尚未精选的干员 Buff。
    return resolve_buff_definitions(
        referenced_ids,
        (buff_source_dir, buff_source_dir.parent / "buff-data-current"),
    )


def resolve_passive_buff_definitions(
    passive_skills: dict[str, PassiveSkillSource],
    buff_source_dir: Path,
) -> tuple[tuple[BuffDefinitionSource, ...], dict[str, str]]:
    """逐个解析隐藏被动 Buff，使单个未知原生结构只影响对应被动。"""
    definitions: dict[str, BuffDefinitionSource] = {}
    issues: dict[str, str] = {}
    buff_ids = {
        buff_id
        for passive in passive_skills.values()
        for buff_id in passive.referenced_buff_ids
    }
    for buff_id in sorted(buff_ids):
        try:
            resolved = resolve_buff_definitions(
                (buff_id,),
                (buff_source_dir, buff_source_dir.parent / "buff-data-current"),
            )
        except (ValueError, FileNotFoundError) as error:
            issues[buff_id] = str(error)
            continue
        for definition in resolved:
            definitions[definition.buffId] = definition
    return tuple(definitions[key] for key in sorted(definitions)), issues


def collect_operator_passive_skills(
    char_id: str,
    growth: dict[str, Any],
    potential_table: dict[str, Any],
    effects: dict[str, Any],
    source_dir: Path,
) -> dict[str, PassiveSkillSource]:
    """收集该干员养成效果引用的隐藏技能，供 Buff 解析、审计和 DSL 生成共用。"""
    effect_ids: set[str] = set()
    nodes = require_dict(growth.get("talentNodeMap"), f"CharGrowthTable.{char_id}.talentNodeMap")
    for raw_node in nodes.values():
        node = require_dict(raw_node, f"CharGrowthTable.{char_id}.talentNodeMap[]")
        passive = require_dict(node.get("passiveSkillNodeInfo"), "passiveSkillNodeInfo")
        effect_id = passive.get("talentEffectId")
        if effect_id:
            effect_ids.add(str(effect_id))
    potential = table_row(potential_table, char_id, "CharacterPotentialTable")
    for index, raw_unlock in enumerate(
        require_list(potential.get("potentialUnlockBundle"), f"{char_id}.potentialUnlockBundle")
    ):
        unlock = require_dict(raw_unlock, f"{char_id}.potentialUnlockBundle[{index}]")
        effect_ids.add(str(unlock["potentialEffectId"]))

    skill_ids: set[str] = set()
    for effect_id in effect_ids:
        effect = table_row(effects, effect_id, "PotentialTalentEffectTable")
        for index, raw_entry in enumerate(
            require_list(effect.get("dataList"), f"{effect_id}.dataList")
        ):
            entry = require_dict(raw_entry, f"{effect_id}.dataList[{index}]")
            attach = require_dict(
                entry.get("attachSkill"),
                f"{effect_id}.dataList[{index}].attachSkill",
            )
            skill_id = attach.get("skillId")
            if skill_id:
                skill_ids.add(str(skill_id))
    return {
        skill_id: parse_passive_skill(skill_id, source_dir)
        for skill_id in sorted(skill_ids)
    }


def audit_passive_skill_generation(
    passive_skills: dict[str, PassiveSkillSource],
    buff_definitions: tuple[BuffDefinitionSource, ...],
    buff_resolution_issues: dict[str, str] | None = None,
) -> dict[str, tuple[str, ...]]:
    """检查隐藏被动能否无损生成；失败原因进入审计，不阻断其他已闭环内容。"""
    definitions_by_id = {definition.buffId: definition for definition in buff_definitions}
    buff_resolution_issues = buff_resolution_issues or {}
    issues: dict[str, tuple[str, ...]] = {}
    for skill_id, passive in passive_skills.items():
        reasons = list(passive.unsupported_reasons)
        if passive.can_generate_add_buff:
            for buff_id in passive.referenced_buff_ids:
                if buff_id in buff_resolution_issues:
                    reasons.append(
                        f"Buff {buff_id!r} could not be resolved: {buff_resolution_issues[buff_id]}"
                    )
                    continue
                definition = definitions_by_id.get(buff_id)
                if definition is None:
                    reasons.append(f"missing resolved Buff {buff_id!r}")
                    continue
                unconnected_attributes = sorted(
                    {
                        modifier.attributeType
                        for modifier in definition.attributeModifiers
                        if modifier.attributeType not in CONNECTED_RUNTIME_ATTRIBUTE_MODIFIERS
                    }
                )
                if unconnected_attributes:
                    reasons.append(
                        f"Buff {buff_id!r} modifies native attributes whose runtime consumers "
                        f"are not connected: {unconnected_attributes!r}"
                    )
                    continue
                try:
                    compile_inline_buff_definition(definition, f"passive {skill_id!r}")
                except ValueError as error:
                    reasons.append(str(error))
        if reasons:
            issues[skill_id] = tuple(dict.fromkeys(reasons))
    return issues


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
    )


def parse_aura_actions(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[AuraActionSource, ...]:
    """严格读取区域动作；当前只形成审计事实，不提前近似其持续生命周期。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[AuraActionSource] = []

    def parse_sequence(value: Any, path: str) -> tuple[dict[str, Any], tuple[str, ...]]:
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
        return sequence, tuple(
            action_name(str(action["$type"]))
            for action in actions
            if action.get("isEnable") is not False
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
            if set(value) != AURA_ACTION_FIELDS:
                raise ValueError(f"{action_path}: unexpected fields {sorted(value)}")

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
            if not isinstance(object_type, str) or not object_type:
                raise ValueError(f"{filter_path}.objectType: expected non-empty string")
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
            if set(icon_duration) != {"durationSourceType", "timedMarkerId"}:
                raise ValueError(f"{icon_path}: unexpected fields {sorted(icon_duration)}")
            duration_source_type = icon_duration.get("durationSourceType")
            timed_marker_id = icon_duration.get("timedMarkerId")
            if not isinstance(duration_source_type, str) or not duration_source_type:
                raise ValueError(f"{icon_path}.durationSourceType: expected non-empty string")
            if not isinstance(timed_marker_id, str):
                raise ValueError(f"{icon_path}.timedMarkerId: expected string")

            in_sequence, in_types = parse_sequence(
                value.get("actionInAura"), f"{action_path}.actionInAura"
            )
            exit_sequence, exit_types = parse_sequence(
                value.get("actionWhenExitAura"), f"{action_path}.actionWhenExitAura"
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
                    synthetic_root, source_name, inherited_blackboard
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


def parse_auxiliary_actions(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[AuxiliaryActionSource, ...]:
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


def parse_resource_gains(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[TimedResourceGainSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    once_gates = collect_once_resource_gain_gates(group, f"{source_name}.actionGroupData")
    if once_gates:
        declared_blackboard = {
            item.key: item for item in parse_declared_blackboard(root, source_name)
        }
        for flag_key in set(once_gates.values()):
            declaration = declared_blackboard.get(flag_key)
            if declaration is None or declaration.value != 0 or not declaration.isDynamic:
                raise ValueError(
                    f"{source_name}.blackboard: once-only resource flag {flag_key!r} "
                    "must be a dynamic value initialized to 0"
                )
    result: list[TimedResourceGainSource] = []
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
        for action in walk_single_enemy_actions(
            timeline.get("_sequenceActionData"),
            f"{source_name}.timelineActions[{timeline_index}]._sequenceActionData",
        ):
            if action_name(action["$type"]) != "ObtainCostAction" or action.get("isEnable") is False:
                continue
            payload = parse_resource_gain_payload(
                action,
                f"{source_name}.ObtainCostAction",
                inherited_blackboard,
            )
            result.append(
                TimedResourceGainSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(
                        action, f"{source_name}.ObtainCostAction"
                    ),
                    resource=payload.resource,
                    amount=payload.amount,
                    coefficient=payload.coefficient,
                    spGainKind=payload.spGainKind,
                    spGainSource=payload.spGainSource,
                    onlyMainOperator=payload.onlyMainOperator,
                    isPercentValue=payload.isPercentValue,
                    useUltimateRecoveryTag=payload.useUltimateRecoveryTag,
                    ultimateRecoveryTagId=payload.ultimateRecoveryTagId,
                    ignoreUltimateGainScalar=payload.ignoreUltimateGainScalar,
                    onceActionValueKey=once_gates.get(id(action)),
                    sequenceIndex=timeline_index,
                )
            )
    return tuple(result)


def filter_once_resource_gains(
    gains: Iterable[TimedResourceGainSource],
) -> tuple[TimedResourceGainSource, ...]:
    """按动作实例黑板门保留首次回能，未受门控的回能保持原顺序。"""
    result: list[TimedResourceGainSource] = []
    consumed_flags: set[str] = set()
    for gain in gains:
        flag_key = getattr(gain, "onceActionValueKey", None)
        if flag_key is not None:
            if flag_key in consumed_flags:
                continue
            consumed_flags.add(flag_key)
        result.append(gain)
    return tuple(result)


def resolve_projectile_payload_triggers(
    payload: ProjectileLaunchPayload,
    source_root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    launch_frame: int,
    action_order: tuple[int, ...],
    stack: tuple[str, ...],
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[ProjectileTriggeredSkillSource, ...]:
    """解析一次已定位的投射物发射；调用方负责提供其真实帧与动作顺序。"""
    result: list[ProjectileTriggeredSkillSource] = []
    projected_triggers = select_projectile_triggers_for_single_enemy(
        payload.skillTriggers
    )
    for trigger in projected_triggers:
        trigger_source_name = f"{trigger.skillId}.json"
        trigger_path = source_dir / trigger_source_name
        if not trigger_path.is_file():
            raise FileNotFoundError(
                f"{source_name}: missing projectile {trigger.event} skill {trigger_path}"
            )
        trigger_root = load_projected_skill_data(trigger_path, trigger_source_name)
        trigger_blackboard = numeric_declared_blackboard(
            parse_declared_blackboard(trigger_root, trigger_source_name)
        )
        if payload.assignBlackboard:
            trigger_blackboard.update(inherited_blackboard)
        cycle_truncated = trigger.skillId in stack
        child_stack = (*stack, trigger.skillId)
        parsed_conditions = parse_conditional_actions(
            trigger_root,
            trigger_source_name,
            trigger_blackboard,
        )
        trigger_conditions = (
            parsed_conditions
            if cycle_truncated
            else resolve_conditional_projectile_triggers(
                parsed_conditions,
                trigger_root,
                trigger_source_name,
                source_dir,
                launch_frame,
                child_stack,
                trigger_blackboard,
                action_order,
            )
        )
        if not cycle_truncated:
            trigger_conditions = resolve_conditional_aura_ability_entity_children(
                trigger_conditions,
                trigger_source_name,
                source_dir,
                launch_frame,
                child_stack,
                trigger_blackboard,
                action_order,
            )
            trigger_conditions = mark_projected_conditional_children(
                trigger_conditions
            )
        nested = (
            ()
            if cycle_truncated
            else (
                *resolve_projectile_triggered_skills(
                    trigger_root,
                    trigger_source_name,
                    source_dir,
                    launch_frame,
                    child_stack,
                    inherited_blackboard=trigger_blackboard,
                    parent_action_order=action_order,
                ),
                *collect_projected_conditional_projectile_skills(trigger_conditions),
            )
        )
        ability_entities = (
            ()
            if cycle_truncated
            else (
                *resolve_ability_entity_hits(
                    trigger_root,
                    trigger_source_name,
                    source_dir,
                    launch_frame,
                    child_stack,
                    trigger_blackboard,
                    parent_action_order=action_order,
                ),
                *resolve_guaranteed_conditional_ability_entity_hits(
                    trigger_conditions,
                    trigger_source_name,
                    source_dir,
                    launch_frame,
                    child_stack,
                    trigger_blackboard,
                    action_order,
                ),
            )
        )
        result.append(
            ProjectileTriggeredSkillSource(
                launchFrame=launch_frame,
                actionOrder=action_order,
                assumedTravelFrames=ASSUMED_PROJECTILE_TRAVEL_FRAMES,
                projectileId=payload.projectileId,
                triggerEvent=trigger.event,
                triggerSkillId=trigger.skillId,
                excludedByPrimaryTargetMarker=is_projectile_trigger_excluded_for_single_enemy(
                    source_root,
                    launch_frame,
                    action_order[-1],
                    trigger_root,
                    trigger_source_name,
                ),
                sourceFile=trigger_source_name,
                damageUnits=parse_damage_units(
                    trigger_root,
                    trigger_source_name,
                    trigger_blackboard,
                ),
                directDamageHits=parse_direct_damage_hits(
                    trigger_root,
                    trigger_source_name,
                    trigger_blackboard,
                ),
                conditionalActions=trigger_conditions,
                auxiliaryActions=parse_auxiliary_actions(
                    trigger_root,
                    trigger_source_name,
                    source_dir,
                    trigger_blackboard,
                ),
                resourceGains=parse_resource_gains(
                    trigger_root,
                    trigger_source_name,
                    trigger_blackboard,
                ),
                inflictions=parse_inflictions(trigger_root, trigger_source_name),
                combatActions=tuple(
                    sorted(
                        {
                            action_name(item["$type"])
                            for item in walk_actions(trigger_root.get("actionGroupData"))
                            if action_name(item["$type"]) in AUDITED_COMBAT_ACTION_NAMES
                        }
                    )
                ),
                cycleTruncated=cycle_truncated,
                nestedProjectileTriggeredSkills=nested,
                abilityEntityHits=ability_entities,
                auraActions=parse_aura_actions(
                    trigger_root, trigger_source_name, trigger_blackboard
                ),
                keywordActions=parse_timed_keyword_actions(
                    trigger_root, trigger_source_name, trigger_blackboard
                ),
            )
        )
    return tuple(result)


def select_projectile_triggers_for_single_enemy(
    triggers: tuple[ProjectileSkillTriggerSource, ...],
) -> tuple[ProjectileSkillTriggerSource, ...]:
    """在必命中模型中去掉同一子技能的 block 兜底回调。"""
    hit_skill_ids = {
        trigger.skillId for trigger in triggers if trigger.event == "hit"
    }
    return tuple(
        trigger
        for trigger in triggers
        # 同一命中技能兼挂 hit/block 是碰撞结果兜底；固定单敌人必命中时只走 hit。
        if not (trigger.event == "block" and trigger.skillId in hit_skill_ids)
    )


def resolve_projectile_triggered_skills(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    base_frame: int = 0,
    stack: tuple[str, ...] = (),
    inherited_blackboard: dict[str, tuple[float, ...]] | None = None,
    parent_action_order: tuple[int, ...] | None = None,
) -> tuple[ProjectileTriggeredSkillSource, ...]:
    result: list[ProjectileTriggeredSkillSource] = []
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        launch_frame = base_frame + require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "LaunchProjectile":
                continue
            if action.get("isEnable") is False:
                continue
            payload = parse_projectile_launch_payload(
                action, f"{source_name}.LaunchProjectile"
            )
            current_action_order = (
                *(parent_action_order or ()),
                require_server_action_index(action, f"{source_name}.LaunchProjectile"),
            )
            result.extend(
                resolve_projectile_payload_triggers(
                    payload,
                    root,
                    source_name,
                    source_dir,
                    launch_frame,
                    current_action_order,
                    stack,
                    inherited_blackboard or {},
                )
            )
    return tuple(result)


def resolve_conditional_projectile_triggers(
    conditions: tuple[ConditionalActionSource, ...],
    source_root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    base_frame: int,
    stack: tuple[str, ...],
    inherited_blackboard: dict[str, tuple[float, ...]],
    parent_action_order: tuple[int, ...] = (),
) -> tuple[ConditionalActionSource, ...]:
    """将条件叶子里的投射物触发技能挂回原分支，保留分支身份与原生顺序。"""

    def resolve_branch_action(
        condition: ConditionalActionSource,
        action: ConditionalBranchActionSource,
        nested_order: tuple[int, ...] = (),
    ) -> ConditionalBranchActionSource:
        action_order = (
            *parent_action_order,
            condition.actionIndex,
            *nested_order,
            action.actionIndex,
        )
        nested = action.nestedCondition
        if nested is not None:
            nested = resolve_conditional_projectile_triggers(
                (nested,),
                source_root,
                source_name,
                source_dir,
                base_frame,
                stack,
                inherited_blackboard,
                action_order,
            )[0]
        once_actions = action.onceActions
        if once_actions is not None:
            once_actions = tuple(
                resolve_branch_action(
                    condition,
                    nested_action,
                    (*nested_order, action.actionIndex),
                )
                for nested_action in once_actions
            )
        triggered = action.projectileTriggeredSkills
        if action.projectileLaunch is not None:
            triggered = resolve_projectile_payload_triggers(
                action.projectileLaunch,
                source_root,
                source_name,
                source_dir,
                base_frame + condition.startFrame,
                action_order,
                stack,
                inherited_blackboard,
            )
        return replace(
            action,
            nestedCondition=nested,
            onceActions=once_actions,
            projectileTriggeredSkills=triggered,
        )

    return tuple(
        replace(
            condition,
            succeedActions=tuple(
                resolve_branch_action(condition, action)
                for action in condition.succeedActions
            ),
            failActions=tuple(
                resolve_branch_action(condition, action)
                for action in condition.failActions
            ),
        )
        for condition in conditions
    )


def contains_structured_aura(value: Any) -> bool:
    """判断已解析调用子树中是否存在 AuraAction，供条件分支审计裁剪体积。"""
    if isinstance(value, AuraActionSource):
        return True
    if is_dataclass(value) and not isinstance(value, type):
        return any(contains_structured_aura(getattr(value, field.name)) for field in fields(value))
    if isinstance(value, dict):
        return any(contains_structured_aura(item) for item in value.values())
    if isinstance(value, (list, tuple)):
        return any(contains_structured_aura(item) for item in value)
    return False


def resolve_conditional_aura_ability_entity_children(
    conditions: tuple[ConditionalActionSource, ...],
    source_name: str,
    source_dir: Path,
    base_frame: int,
    stack: tuple[str, ...],
    inherited_blackboard: dict[str, tuple[float, ...]],
    parent_action_order: tuple[int, ...] = (),
) -> tuple[ConditionalActionSource, ...]:
    """解析条件分支专属的能力实体子技能，但不把它提升为必然发生的根调度。"""

    def resolve_branch_action(
        condition: ConditionalActionSource,
        action: ConditionalBranchActionSource,
        nested_order: tuple[int, ...] = (),
    ) -> ConditionalBranchActionSource:
        action_order = (
            *parent_action_order,
            condition.actionIndex,
            *nested_order,
            action.actionIndex,
        )
        nested = action.nestedCondition
        if nested is not None:
            nested = resolve_conditional_aura_ability_entity_children(
                (nested,),
                source_name,
                source_dir,
                base_frame,
                stack,
                inherited_blackboard,
                action_order,
            )[0]
        once_actions = action.onceActions
        if once_actions is not None:
            once_actions = tuple(
                resolve_branch_action(
                    condition,
                    nested_action,
                    (*nested_order, action.actionIndex),
                )
                for nested_action in once_actions
            )

        hits = action.auraAbilityEntityHits
        payload = action.abilityEntitySpawn
        if payload is not None and payload.skillId is not None:
            child_name = f"{payload.skillId}.json"
            child_path = source_dir / child_name
            if not child_path.is_file():
                raise FileNotFoundError(
                    f"{source_name}: missing conditional ability entity skill {child_path}"
                )
            child = load_projected_skill_data(child_path, child_name)
            resolved_hit = resolve_ability_entity_payload(
                    payload,
                    child,
                    child_name,
                    source_dir,
                    base_frame + condition.startFrame,
                    stack,
                    inherited_blackboard,
                    action_order,
                )
            hits = (resolved_hit,) if contains_structured_aura(resolved_hit) else None
        return replace(
            action,
            nestedCondition=nested,
            onceActions=once_actions,
            auraAbilityEntityHits=hits,
        )

    return tuple(
        replace(
            condition,
            succeedActions=tuple(
                resolve_branch_action(condition, action)
                for action in condition.succeedActions
            ),
            failActions=tuple(
                resolve_branch_action(condition, action)
                for action in condition.failActions
            ),
        )
        for condition in conditions
    )


def parse_projectile_launches(
    root: dict[str, Any],
    source_name: str,
    base_frame: int = 0,
) -> tuple[ProjectileLaunchSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[ProjectileLaunchSource] = []
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        launch_frame = base_frame + require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "LaunchProjectile" or action.get("isEnable") is False:
                continue
            payload = parse_projectile_launch_payload(
                action, f"{source_name}.LaunchProjectile"
            )
            result.append(
                ProjectileLaunchSource(
                    launchFrame=launch_frame,
                    projectileId=payload.projectileId,
                    skillTriggers=payload.skillTriggers,
                    assignBlackboard=payload.assignBlackboard,
                    entityBlackboardAssignments=payload.entityBlackboardAssignments,
                )
            )
    return tuple(result)


def resolve_ability_entity_hits(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    base_frame: int = 0,
    stack: tuple[str, ...] = (),
    inherited_blackboard: dict[str, tuple[float, ...]] | None = None,
    parent_action_order: tuple[int, ...] | None = None,
) -> tuple[AbilityEntityHitSource, ...]:
    """解析 SpawnAbilityEntity 引用的子技能，并保留父技能中的生成时刻。"""
    result: list[AbilityEntityHitSource] = []
    blackboard = inherited_blackboard or {}
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        spawn_frame = base_frame + require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        for action in walk_unconditional_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "SpawnAbilityEntity" or action.get("isEnable") is False:
                continue
            payload = parse_ability_entity_spawn_payload(
                action, f"{source_name}.SpawnAbilityEntity"
            )
            if payload.skillId is None:
                continue
            skill_id = payload.skillId
            child_name = f"{skill_id}.json"
            child_path = source_dir / child_name
            if not child_path.is_file():
                raise FileNotFoundError(f"{source_name}: missing ability entity skill {child_path}")
            child = load_projected_skill_data(child_path, child_name)
            current_action_order = (
                *(parent_action_order or ()),
                require_server_action_index(action, f"{source_name}.SpawnAbilityEntity"),
            )
            result.append(
                resolve_ability_entity_payload(
                    payload,
                    child,
                    child_name,
                    source_dir,
                    spawn_frame,
                    stack,
                    blackboard,
                    current_action_order,
                )
            )
    return tuple(result)


def resolve_ability_entity_payload(
    payload: AbilityEntitySpawnPayload,
    child: dict[str, Any],
    child_name: str,
    source_dir: Path,
    spawn_frame: int,
    stack: tuple[str, ...],
    blackboard: dict[str, tuple[float, ...]],
    action_order: tuple[int, ...],
) -> AbilityEntityHitSource:
    """解析一项已确定会发生的能力实体生成，不关心它来自根动作还是条件叶子。"""
    skill_id = payload.skillId
    if skill_id is None:
        raise AssertionError("combat ability entity payload must expose skillId")
    declared_blackboard = parse_declared_blackboard(child, child_name)
    child_blackboard = numeric_declared_blackboard(declared_blackboard)
    if payload.assignBlackboard:
        child_blackboard.update(blackboard)
    for assignment in payload.entityBlackboardAssignments:
        if assignment.valueType != "Numeric":
            continue
        if assignment.useDirectValue:
            child_blackboard[assignment.targetKey] = (assignment.numericValue,)
            continue
        inherited_value = blackboard.get(assignment.inputValueKey)
        if inherited_value is not None:
            child_blackboard[assignment.targetKey] = inherited_value

    cycle_truncated = skill_id in stack
    child_conditions = parse_conditional_actions(child, child_name, child_blackboard)
    child_calculations = parse_blackboard_calculations(child, child_name, child_blackboard)
    child_mutations, child_reads, child_finishes = parse_blackboard_runtime_actions(
        child, child_name, child_blackboard
    )
    nested = ()
    if not cycle_truncated:
        child_stack = (*stack, skill_id)
        child_conditions = mark_projected_conditional_children(child_conditions)
        nested = (
            *resolve_ability_entity_hits(
                child,
                child_name,
                source_dir,
                spawn_frame,
                child_stack,
                child_blackboard,
                parent_action_order=action_order,
            ),
            *resolve_guaranteed_conditional_ability_entity_hits(
                child_conditions,
                child_name,
                source_dir,
                spawn_frame,
                child_stack,
                child_blackboard,
                action_order,
            ),
        )
    combat_actions = tuple(
        sorted(
            {
                action_name(item["$type"])
                for item in walk_actions(child.get("actionGroupData"))
                if action_name(item["$type"]) in AUDITED_COMBAT_ACTION_NAMES
            }
        )
    )
    return AbilityEntityHitSource(
        spawnFrame=spawn_frame,
        actionOrder=action_order,
        abilityEntityId=payload.abilityEntityId,
        skillId=skill_id,
        sourceFile=child_name,
        entityBlackboardAssignments=payload.entityBlackboardAssignments,
        directDamageHits=parse_direct_damage_hits(child, child_name, child_blackboard),
        intervalDamageHits=parse_interval_damage_hits(child, child_name, child_blackboard),
        conditionalActions=child_conditions,
        inflictions=parse_inflictions(child, child_name),
        auxiliaryActions=parse_auxiliary_actions(child, child_name, source_dir, child_blackboard),
        resourceGains=parse_resource_gains(child, child_name, child_blackboard),
        projectileLaunches=parse_projectile_launches(child, child_name, spawn_frame),
        projectileTriggeredSkills=(
            *resolve_projectile_triggered_skills(
                child,
                child_name,
                source_dir,
                spawn_frame,
                inherited_blackboard=child_blackboard,
                parent_action_order=action_order,
            ),
            *collect_projected_conditional_projectile_skills(child_conditions),
        ),
        nestedAbilityEntityHits=nested,
        combatActions=combat_actions,
        cycleTruncated=cycle_truncated,
        inheritsSourceBlackboard=payload.assignBlackboard,
        declaredBlackboard=declared_blackboard,
        blackboardCalculations=child_calculations,
        blackboardMutations=child_mutations,
        buffBlackboardReads=child_reads,
        buffFinishes=child_finishes,
        auraActions=parse_aura_actions(child, child_name, child_blackboard),
        keywordActions=parse_timed_keyword_actions(
            child, child_name, child_blackboard
        ),
        localTargetGroupWrites=parse_target_group_writes(child, child_name),
    )


def guaranteed_ability_entity_spawns(
    condition: ConditionalActionSource,
) -> tuple[AbilityEntitySpawnPayload, ...]:
    """仅当条件树每条叶子路径生成完全相同的实体序列时返回该序列。"""

    def branch_outcomes(
        actions: tuple[ConditionalBranchActionSource, ...],
    ) -> tuple[tuple[AbilityEntitySpawnPayload, ...], ...]:
        outcomes: tuple[tuple[AbilityEntitySpawnPayload, ...], ...] = ((),)
        for action in actions:
            ability_entity_spawn = getattr(action, "abilityEntitySpawn", None)
            nested_condition = getattr(action, "nestedCondition", None)
            if ability_entity_spawn is not None:
                additions = ((ability_entity_spawn,),)
            elif nested_condition is not None:
                additions = condition_outcomes(nested_condition)
            elif getattr(action, "onceActions", None) is not None:
                additions = branch_outcomes(action.onceActions)
            else:
                additions = ((),)
            outcomes = tuple((*prefix, *addition) for prefix in outcomes for addition in additions)
        return outcomes

    def condition_outcomes(
        current: ConditionalActionSource,
    ) -> tuple[tuple[AbilityEntitySpawnPayload, ...], ...]:
        return (*branch_outcomes(current.succeedActions), *branch_outcomes(current.failActions))

    outcomes = condition_outcomes(condition)
    if not outcomes or any(outcome != outcomes[0] for outcome in outcomes[1:]):
        return ()
    return outcomes[0]


def guaranteed_projectile_projections(
    condition: ConditionalActionSource,
) -> tuple[ConditionalProjectileProjection, ...]:
    """仅当条件树每条叶子路径发射完全相同的已解析投射物时返回投影。"""

    def outcomes_are_equivalent(
        left: tuple[ConditionalProjectileProjection, ...],
        right: tuple[ConditionalProjectileProjection, ...],
    ) -> bool:
        return len(left) == len(right) and all(
            projectile_projections_are_equivalent(left_item, right_item)
            for left_item, right_item in zip(left, right, strict=True)
        )

    def branch_outcomes(
        actions: tuple[ConditionalBranchActionSource, ...],
    ) -> tuple[tuple[ConditionalProjectileProjection, ...], ...]:
        outcomes: tuple[tuple[ConditionalProjectileProjection, ...], ...] = ((),)
        for action in actions:
            launch = action.projectileLaunch
            nested_condition = action.nestedCondition
            if launch is not None and action.projectileTriggeredSkills:
                additions = (
                    (
                        ConditionalProjectileProjection(
                            launch,
                            action.projectileTriggeredSkills,
                        ),
                    ),
                )
            elif nested_condition is not None:
                additions = condition_outcomes(nested_condition)
            elif getattr(action, "onceActions", None) is not None:
                additions = branch_outcomes(action.onceActions)
            else:
                additions = ((),)
            outcomes = tuple((*prefix, *addition) for prefix in outcomes for addition in additions)
        return outcomes

    def condition_outcomes(
        current: ConditionalActionSource,
    ) -> tuple[tuple[ConditionalProjectileProjection, ...], ...]:
        return (*branch_outcomes(current.succeedActions), *branch_outcomes(current.failActions))

    outcomes = condition_outcomes(condition)
    if not outcomes or any(
        not outcomes_are_equivalent(outcome, outcomes[0]) for outcome in outcomes[1:]
    ):
        return ()
    return outcomes[0]


def projectile_projections_are_equivalent(
    left: ConditionalProjectileProjection,
    right: ConditionalProjectileProjection,
) -> bool:
    """比较投射物的战斗语义，忽略分支路径带来的同帧排序前缀。"""

    def without_action_order(value: Any) -> Any:
        if isinstance(value, dict):
            return {
                key: without_action_order(item)
                for key, item in value.items()
                if key != "actionOrder"
            }
        if isinstance(value, list):
            return [without_action_order(item) for item in value]
        if isinstance(value, tuple):
            return tuple(without_action_order(item) for item in value)
        if hasattr(value, "__dict__"):
            return without_action_order(vars(value))
        return value

    return without_action_order(asdict(left)) == without_action_order(asdict(right))


def contains_equivalent_projectile_projection(
    projections: tuple[ConditionalProjectileProjection, ...],
    candidate: ConditionalProjectileProjection,
) -> bool:
    """判断投影集合是否已包含同一战斗行为。"""

    return any(
        projectile_projections_are_equivalent(projection, candidate)
        for projection in projections
    )


def mark_projected_conditional_children(
    conditions: tuple[ConditionalActionSource, ...],
) -> tuple[ConditionalActionSource, ...]:
    """标记已由解析层提升为确定子技能的生成动作，供 DSL 编译器避免重复消费。"""

    def mark_action(action: ConditionalBranchActionSource) -> ConditionalBranchActionSource:
        nested_condition = (
            None
            if action.nestedCondition is None
            else mark_condition(action.nestedCondition)
        )
        once_actions = (
            None
            if action.onceActions is None
            else tuple(mark_action(item) for item in action.onceActions)
        )
        return replace(
            action,
            nestedCondition=nested_condition,
            onceActions=once_actions,
        )

    def mark_condition(condition: ConditionalActionSource) -> ConditionalActionSource:
        marked = replace(
            condition,
            succeedActions=tuple(mark_action(action) for action in condition.succeedActions),
            failActions=tuple(mark_action(action) for action in condition.failActions),
        )
        projected = tuple(
            payload
            for payload in guaranteed_ability_entity_spawns(marked)
            if payload.skillId is not None
        )
        return replace(
            marked,
            projectedAbilityEntitySpawns=projected,
            projectedProjectileLaunches=guaranteed_projectile_projections(marked),
        )

    def retain_root_owned_projectiles_in_action(
        action: ConditionalBranchActionSource,
        root_owned: tuple[ConditionalProjectileProjection, ...],
    ) -> ConditionalBranchActionSource:
        nested_condition = (
            None
            if action.nestedCondition is None
            else retain_root_owned_projectiles_in_condition(
                action.nestedCondition,
                root_owned,
                is_root=False,
            )
        )
        once_actions = (
            None
            if action.onceActions is None
            else tuple(
                retain_root_owned_projectiles_in_action(item, root_owned)
                for item in action.onceActions
            )
        )
        return replace(
            action,
            nestedCondition=nested_condition,
            onceActions=once_actions,
        )

    def retain_root_owned_projectiles_in_condition(
        condition: ConditionalActionSource,
        root_owned: tuple[ConditionalProjectileProjection, ...],
        *,
        is_root: bool,
    ) -> ConditionalActionSource:
        # 根调度只收集顶层投影；内层仅能消费由根节点唯一拥有的投影。
        retained = (
            condition.projectedProjectileLaunches
            if is_root
            else tuple(
                projection
                for projection in condition.projectedProjectileLaunches
                if sum(
                    projectile_projections_are_equivalent(projection, candidate)
                    for candidate in root_owned
                )
                == 1
            )
        )
        return replace(
            condition,
            succeedActions=tuple(
                retain_root_owned_projectiles_in_action(action, root_owned)
                for action in condition.succeedActions
            ),
            failActions=tuple(
                retain_root_owned_projectiles_in_action(action, root_owned)
                for action in condition.failActions
            ),
            projectedProjectileLaunches=retained,
        )

    result: list[ConditionalActionSource] = []
    for condition in conditions:
        marked = mark_condition(condition)
        result.append(
            retain_root_owned_projectiles_in_condition(
                marked,
                marked.projectedProjectileLaunches,
                is_root=True,
            )
        )
    return tuple(result)


def collect_projected_conditional_projectile_skills(
    conditions: tuple[ConditionalActionSource, ...],
) -> tuple[ProjectileTriggeredSkillSource, ...]:
    """汇总已标记的确定投射物子技能；其帧与动作顺序已在解析叶子时换算。"""
    return tuple(
        skill
        for condition in conditions
        for projection in condition.projectedProjectileLaunches
        for skill in projection.triggeredSkills
    )


def is_single_enemy_ability_entity_projection(condition: ConditionalActionSource) -> bool:
    """确认条件树除必然生成能力实体外，只修改单敌人定位使用的临时黑板。"""

    def branch_is_supported(actions: tuple[ConditionalBranchActionSource, ...]) -> bool:
        for action in actions:
            if getattr(action, "abilityEntitySpawn", None) is not None:
                continue
            nested_condition = getattr(action, "nestedCondition", None)
            if nested_condition is not None:
                if not condition_is_supported(nested_condition):
                    return False
                continue
            mutation = getattr(action, "blackboardMutation", None)
            if mutation is None:
                return False
            if (
                mutation.key != "target_in_range"
                or mutation.operation != "Assign"
                or mutation.value.blackboardKey is not None
                or mutation.value.value != 1
            ):
                return False
        return True

    def condition_is_supported(current: ConditionalActionSource) -> bool:
        return (
            bool(guaranteed_ability_entity_spawns(current))
            and branch_is_supported(current.succeedActions)
            and branch_is_supported(current.failActions)
        )

    return condition_is_supported(condition)


def resolve_guaranteed_conditional_ability_entity_hits(
    conditions: tuple[ConditionalActionSource, ...],
    source_name: str,
    source_dir: Path,
    base_frame: int,
    stack: tuple[str, ...],
    blackboard: dict[str, tuple[float, ...]],
    parent_action_order: tuple[int, ...] = (),
) -> tuple[AbilityEntityHitSource, ...]:
    """投影条件无关的能力实体生成；分支结果不一致时保留在条件审计层。"""
    result: list[AbilityEntityHitSource] = []
    for condition in conditions:
        for branch_index, payload in enumerate(guaranteed_ability_entity_spawns(condition)):
            if payload.skillId is None:
                continue
            child_name = f"{payload.skillId}.json"
            child_path = source_dir / child_name
            if not child_path.is_file():
                raise FileNotFoundError(f"{source_name}: missing ability entity skill {child_path}")
            child = load_projected_skill_data(child_path, child_name)
            result.append(
                resolve_ability_entity_payload(
                    payload,
                    child,
                    child_name,
                    source_dir,
                    base_frame + condition.startFrame,
                    stack,
                    blackboard,
                    (*parent_action_order, condition.actionIndex, branch_index),
                )
            )
    return tuple(result)


def native_sequence_order(
    action: Any,
    parent_action_order: tuple[int, ...],
    path: str,
) -> tuple[int, ...]:
    """读取解析时保留的原生 Sequence；旧测试夹具按动作序号保持原行为。"""
    sequence_index = getattr(action, "sequenceIndex", -1)
    if sequence_index == -1:
        sequence_index = action.actionIndex
    if not isinstance(sequence_index, int) or sequence_index < 0:
        raise ValueError(f"{path}: action has invalid native sequence identity")
    return (*parent_action_order, sequence_index)


def native_condition_sequence_order(
    action_path: tuple[str, ...],
    parent_action_order: tuple[int, ...],
    path: str,
    fallback_action_index: int | None = None,
) -> tuple[int, ...]:
    """条件解析器保留了外层 timeline 路径，以它确定 Sequence，避免混用分支数组下标。"""
    for part in action_path:
        if part.startswith("timelineActions[") and part.endswith("]"):
            raw_index = part[len("timelineActions[") : -1]
            if raw_index.isdigit():
                return (*parent_action_order, int(raw_index))
    if fallback_action_index is not None:
        return (*parent_action_order, fallback_action_index)
    raise ValueError(f"{path}: condition has no native timeline sequence path")


def collect_resolved_damage_hits(skill: SkillSource) -> tuple[ResolvedDamageHitSource, ...]:
    """将根技能及其引用子技能中的伤害动作投影到根技能的绝对帧。"""
    candidates: list[tuple[ResolvedDamageHitSource, str | None, int]] = []

    def append(
        resolved: ResolvedDamageHitSource,
        marker_id: str | None = None,
        marker_duration_frames: int = 0,
    ) -> None:
        candidates.append((resolved, marker_id, marker_duration_frames))

    for hit in skill.directDamageHits:
        if hit.damageUnits:
            append(
                ResolvedDamageHitSource(
                    hit.startFrame,
                    (hit.actionIndex,),
                    "direct",
                    (skill.skillId,),
                    hit.damageUnits,
                    native_sequence_order(
                        hit, (), skill.skillId
                    ),
                )
            )

    def collect_projectile(hit: ProjectileTriggeredSkillSource, path: tuple[str, ...]) -> None:
        if getattr(hit, "excludedByPrimaryTargetMarker", False):
            return
        current_path = (*path, hit.triggerSkillId)
        for damage in hit.directDamageHits:
            if damage.damageUnits:
                append(
                    ResolvedDamageHitSource(
                        hit.launchFrame + hit.assumedTravelFrames + damage.startFrame,
                        (*hit.actionOrder, damage.actionIndex),
                        "projectile",
                        current_path,
                        damage.damageUnits,
                        native_sequence_order(
                            damage, hit.actionOrder, hit.triggerSkillId
                        ),
                    )
                )
        for nested in hit.nestedProjectileTriggeredSkills:
            collect_projectile(nested, current_path)
        for entity in getattr(hit, "abilityEntityHits", ()):
            collect_entity(entity, current_path)

    def collect_entity(hit: AbilityEntityHitSource, path: tuple[str, ...]) -> None:
        current_path = (*path, hit.skillId)
        for damage in hit.directDamageHits:
            if damage.damageUnits:
                marker_id = None
                marker_duration_frames = 0
                gate = getattr(damage, "timedMarkerGate", None)
                if gate is not None:
                    if not gate.returnTrueIfNotExists:
                        raise ValueError(
                            f"{hit.skillId}: timed marker gate must pass when the marker is absent"
                        )
                    assignments = [
                        assignment
                        for assignment in getattr(hit, "entityBlackboardAssignments", ())
                        if assignment.targetKey == gate.markerBlackboardKey
                    ]
                    if (
                        len(assignments) != 1
                        or assignments[0].valueType != "String"
                        or not assignments[0].useDirectValue
                    ):
                        raise ValueError(
                            f"{hit.skillId}: timed marker key {gate.markerBlackboardKey!r} "
                            "does not resolve to one string assignment"
                        )
                    marker_id = assignments[0].stringValue
                    marker_duration_frames_float = gate.durationSeconds * 30
                    marker_duration_frames = round(marker_duration_frames_float)
                    if abs(marker_duration_frames_float - marker_duration_frames) > 1e-6:
                        raise ValueError(
                            f"{hit.skillId}: timed marker duration does not align to combat frames"
                        )
                append(
                    ResolvedDamageHitSource(
                        hit.spawnFrame + damage.startFrame,
                        (*hit.actionOrder, damage.actionIndex),
                        "abilityEntity",
                        current_path,
                        damage.damageUnits,
                        native_sequence_order(
                            damage, hit.actionOrder, hit.skillId
                        ),
                    ),
                    marker_id,
                    marker_duration_frames,
                )
        for repeated in getattr(hit, "intervalDamageHits", ()):
            for tick_index, tick_frame in enumerate(repeated.tickFrames):
                append(
                    ResolvedDamageHitSource(
                        hit.spawnFrame + tick_frame,
                        (
                            *hit.actionOrder,
                            repeated.actionIndex,
                            tick_index,
                            repeated.damageActionIndex,
                        ),
                        "abilityEntityInterval",
                        current_path,
                        repeated.damageUnits,
                        native_sequence_order(
                            repeated, hit.actionOrder, hit.skillId
                        ),
                    )
                )
        for projectile in hit.projectileTriggeredSkills:
            collect_projectile(projectile, current_path)
        for nested in hit.nestedAbilityEntityHits:
            collect_entity(nested, current_path)

    root_path = (skill.skillId,)
    for projectile in skill.projectileTriggeredSkills:
        collect_projectile(projectile, root_path)
    for entity in skill.abilityEntityHits:
        collect_entity(entity, root_path)
    result: list[ResolvedDamageHitSource] = []
    marker_expiry_frames: dict[str, int] = {}
    for hit, marker_id, duration_frames in sorted(
        candidates, key=lambda item: (item[0].frame, item[0].actionOrder)
    ):
        if marker_id is not None:
            if hit.frame < marker_expiry_frames.get(marker_id, -1):
                continue
            marker_expiry_frames[marker_id] = hit.frame + duration_frames
        result.append(hit)
    return tuple(result)


def collect_resolved_schedule(skill: SkillSource) -> tuple[ResolvedScheduleItemSource, ...]:
    """归并根技能中的伤害、Buff 施加与条件根，不展开条件分支内部的局部顺序。"""
    result = [
        ResolvedScheduleItemSource(
            frame=hit.frame,
            actionOrder=hit.actionOrder,
            itemType="damage",
            sourcePath=hit.sourcePath,
            payload=hit,
            sequenceOrder=hit.sequenceOrder,
        )
        for hit in collect_resolved_damage_hits(skill)
    ]
    result.extend(
        ResolvedScheduleItemSource(
            frame=action.startFrame,
            actionOrder=(action.actionIndex,),
            itemType="buffApplication",
            sourcePath=(skill.skillId,),
            payload=action,
            inputTarget="enemy",
            sequenceOrder=native_sequence_order(
                action, (), skill.skillId
            ),
        )
        for action in skill.auxiliaryActions
        if action.actionType == "CreateBuffAction"
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=frame,
            actionOrder=(action.actionIndex,),
            itemType="condition",
            sourcePath=action.actionPath,
            payload=action,
            inputTarget="enemy",
            sequenceOrder=native_condition_sequence_order(
                action.actionPath, (), skill.skillId, action.actionIndex
            ),
        )
        for action in skill.conditionalActions
        for frame in (getattr(action, "executionFrames", ()) or (action.startFrame,))
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=calculation.startFrame,
            actionOrder=(calculation.actionIndex,),
            itemType="blackboardCalculation",
            sourcePath=(skill.skillId,),
            payload=calculation,
            sequenceOrder=native_sequence_order(
                calculation, (), skill.skillId
            ),
        )
        for calculation in skill.blackboardCalculations
    )
    for item_type, actions in (
        ("blackboardMutation", skill.blackboardMutations),
        ("buffBlackboardRead", skill.buffBlackboardReads),
        ("buffFinish", skill.buffFinishes),
        ("buffHold", getattr(skill, "buffHolds", ())),
    ):
        result.extend(
            ResolvedScheduleItemSource(
                frame=action.startFrame,
                actionOrder=(action.actionIndex,),
                itemType=item_type,
                sourcePath=(skill.skillId,),
                payload=action,
                inputTarget="enemy",
                sequenceOrder=native_sequence_order(
                    action, (), skill.skillId
                ),
            )
            for action in actions
        )
    for index, gain in enumerate(filter_once_resource_gains(skill.resourceGains)):
        if not resource_gain_can_change_value(
            gain, f"{skill.key}.resourceGains[{index}].amount"
        ):
            continue
        result.append(
            ResolvedScheduleItemSource(
                frame=gain.startFrame,
                actionOrder=(gain.actionIndex,),
                itemType="resourceGain",
                sourcePath=(skill.skillId,),
                payload=gain,
                sequenceOrder=native_sequence_order(
                    gain, (), skill.skillId
                ),
            )
        )
    result.extend(
        ResolvedScheduleItemSource(
            frame=infliction.startFrame,
            actionOrder=(infliction.actionIndex,),
            itemType="infliction",
            sourcePath=(skill.skillId,),
            payload=infliction,
            sequenceOrder=native_sequence_order(
                infliction, (), skill.skillId
            ),
        )
        for infliction in skill.inflictions
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=listener.startFrame,
            actionOrder=(listener.actionIndex,),
            itemType="eventListener",
            sourcePath=(skill.skillId,),
            payload=listener,
            sequenceOrder=native_sequence_order(
                listener, (), skill.skillId
            ),
        )
        for listener in getattr(skill, "eventListeners", ())
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=action.startFrame,
            actionOrder=(action.actionIndex,),
            itemType="timeDilation",
            sourcePath=(skill.skillId,),
            payload=action,
            sequenceOrder=native_sequence_order(
                action, (), skill.skillId
            ),
        )
        for action in getattr(skill, "timeDilations", ())
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=action.startFrame,
            actionOrder=(action.actionIndex,),
            itemType="keywordAction",
            sourcePath=(skill.skillId,),
            payload=action,
            inputTarget="enemy",
            sequenceOrder=native_sequence_order(action, (), skill.skillId),
        )
        for action in getattr(skill, "keywordActions", ())
    )
    for projectile in skill.projectileTriggeredSkills:
        collect_projectile_schedule(projectile, result)
    for entity in skill.abilityEntityHits:
        collect_ability_entity_schedule(entity, result)
    return tuple(
        sorted(
            result,
            key=lambda item: (item.frame, item.sequenceOrder, item.actionOrder),
        )
    )


def validate_unmodeled_buff_ids(
    schedule: tuple[ResolvedScheduleItemSource, ...],
    unmodeled_buff_ids: frozenset[str],
    path: str,
) -> None:
    """确保清单中的未建模 Buff 确实由当前技能施加，避免过期配置静默放行。"""
    scheduled_buff_ids = {
        cast(AuxiliaryActionSource, item.payload).sourceId
        for item in schedule
        if item.itemType == "buffApplication"
    }
    unknown_ids = sorted(unmodeled_buff_ids - scheduled_buff_ids)
    if unknown_ids:
        raise ValueError(f"{path}: unmodeled Buff ids are not applied by this skill: {unknown_ids}")


def root_target_group_writes_for_condition(
    skill: SkillSource,
    item: ResolvedScheduleItemSource,
    condition: ConditionalActionSource,
) -> tuple[TargetGroupWriteSource, ...]:
    """只把根技能目标组目录交给根条件；递归子技能拥有独立动作上下文。"""
    if item.sourcePath != condition.actionPath:
        return ()
    return getattr(skill, "targetGroupWrites", ())


def resource_gain_can_change_value(
    gain: ResourceGainPayload | TimedResourceGainSource,
    path: str,
) -> bool:
    """动态 amount 必须进入运行时；只有已解析且全为零的值可以提前过滤。"""
    if gain.amount.blackboardKey is not None and gain.amount.levelValues is None:
        return True
    return any(value != 0 for value in require_level_values(gain.amount, path))


def root_skill_has_output_damage_before(
    schedule: tuple[ResolvedScheduleItemSource, ...],
    current_index: int,
    skill_id: str,
) -> bool:
    """判断当前调度项之前，根技能是否已经执行过必然命中的伤害。"""
    current = schedule[current_index]
    current_order = (current.frame, current.actionOrder)
    return any(
        item.itemType == "damage"
        and item.sourcePath == (skill_id,)
        and (item.frame, item.actionOrder) < current_order
        for item in schedule
    )


def collect_projectile_schedule(
    hit: ProjectileTriggeredSkillSource,
    result: list[ResolvedScheduleItemSource],
) -> None:
    """把投射物命中子技能的条件与回能换算到根技能帧坐标。"""
    if hit.excludedByPrimaryTargetMarker:
        return
    hit_frame = hit.launchFrame + hit.assumedTravelFrames
    source_path = (hit.triggerSkillId,)
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit_frame + action.startFrame,
            actionOrder=(*hit.actionOrder, action.actionIndex),
            itemType="buffApplication",
            sourcePath=source_path,
            payload=action,
            inputTarget="enemy",
            sequenceOrder=native_sequence_order(
                action, hit.actionOrder, hit.triggerSkillId
            ),
        )
        for action in getattr(hit, "auxiliaryActions", ())
        if action.actionType == "CreateBuffAction"
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit_frame + frame,
            actionOrder=(*hit.actionOrder, condition.actionIndex),
            itemType="condition",
            sourcePath=(*source_path, *condition.actionPath),
            payload=condition,
            inputTarget="enemy",
            sequenceOrder=native_condition_sequence_order(
                condition.actionPath,
                hit.actionOrder,
                hit.triggerSkillId,
                condition.actionIndex,
            ),
        )
        for condition in hit.conditionalActions
        for frame in (condition.executionFrames or (condition.startFrame,))
    )
    for gain in filter_once_resource_gains(hit.resourceGains):
        if not resource_gain_can_change_value(
            gain, f"{hit.triggerSkillId}.resourceGain"
        ):
            continue
        result.append(
            ResolvedScheduleItemSource(
                frame=hit_frame + gain.startFrame,
                actionOrder=(*hit.actionOrder, gain.actionIndex),
                itemType="resourceGain",
                sourcePath=source_path,
                payload=gain,
                sequenceOrder=native_sequence_order(
                    gain, hit.actionOrder, hit.triggerSkillId
                ),
            )
        )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit_frame + infliction.startFrame,
            actionOrder=(*hit.actionOrder, infliction.actionIndex),
            itemType="infliction",
            sourcePath=source_path,
            payload=infliction,
            sequenceOrder=native_sequence_order(
                infliction, hit.actionOrder, hit.triggerSkillId
            ),
        )
        for infliction in getattr(hit, "inflictions", ())
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit_frame + action.startFrame,
            actionOrder=(*hit.actionOrder, action.actionIndex),
            itemType="keywordAction",
            sourcePath=source_path,
            payload=action,
            inputTarget="enemy",
            sequenceOrder=native_sequence_order(
                action, hit.actionOrder, hit.triggerSkillId
            ),
        )
        for action in getattr(hit, "keywordActions", ())
    )
    for nested in hit.nestedProjectileTriggeredSkills:
        collect_projectile_schedule(nested, result)
    for entity in getattr(hit, "abilityEntityHits", ()):
        collect_ability_entity_schedule(entity, result)


def collect_ability_entity_schedule(
    hit: AbilityEntityHitSource,
    result: list[ResolvedScheduleItemSource],
) -> None:
    """把能力实体子技能中的非伤害动作换算到根技能帧坐标。"""
    source_path = (hit.skillId,)
    projected_interval_frames = {
        interval.tickFrames for interval in getattr(hit, "intervalDamageHits", ())
    }
    for item_type, actions in (
        ("blackboardCalculation", getattr(hit, "blackboardCalculations", ())),
        ("blackboardMutation", getattr(hit, "blackboardMutations", ())),
        ("buffBlackboardRead", getattr(hit, "buffBlackboardReads", ())),
        ("buffFinish", getattr(hit, "buffFinishes", ())),
    ):
        result.extend(
            ResolvedScheduleItemSource(
                frame=hit.spawnFrame + action.startFrame,
                actionOrder=(*hit.actionOrder, action.actionIndex),
                itemType=cast(ResolvedScheduleItemType, item_type),
                sourcePath=source_path,
                payload=action,
                sequenceOrder=native_sequence_order(
                    action, hit.actionOrder, hit.skillId
                ),
            )
            for action in actions
        )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit.spawnFrame + frame,
            actionOrder=(*hit.actionOrder, condition.actionIndex),
            itemType="condition",
            sourcePath=(*source_path, *condition.actionPath),
            payload=condition,
            inputTarget="enemy",
            sequenceOrder=native_condition_sequence_order(
                condition.actionPath, hit.actionOrder, hit.skillId, condition.actionIndex
            ),
            targetGroupWrites=getattr(hit, "localTargetGroupWrites", ()),
        )
        for condition in getattr(hit, "conditionalActions", ())
        for frame in (
            getattr(condition, "executionFrames", ()) or (condition.startFrame,)
        )
        # 两个分支伤害等价时，周期伤害解析器已将其投影为确定伤害；这里不能重复排入。
        if getattr(condition, "executionFrames", ()) not in projected_interval_frames
        if len(getattr(condition, "executionFrames", ())) > 1
        or conditional_action_contains_keyword(condition)
    )
    resource_gains = sorted(
        getattr(hit, "resourceGains", ()), key=lambda item: (item.startFrame, item.actionIndex)
    )
    for gain in filter_once_resource_gains(resource_gains):
        if not resource_gain_can_change_value(gain, f"{hit.skillId}.resourceGain"):
            continue
        result.append(
            ResolvedScheduleItemSource(
                frame=hit.spawnFrame + gain.startFrame,
                actionOrder=(*hit.actionOrder, gain.actionIndex),
                itemType="resourceGain",
                sourcePath=source_path,
                payload=gain,
                sequenceOrder=native_sequence_order(
                    gain, hit.actionOrder, hit.skillId
                ),
            )
        )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit.spawnFrame + infliction.startFrame,
            actionOrder=(*hit.actionOrder, infliction.actionIndex),
            itemType="infliction",
            sourcePath=source_path,
            payload=infliction,
            sequenceOrder=native_sequence_order(
                infliction, hit.actionOrder, hit.skillId
            ),
        )
        for infliction in getattr(hit, "inflictions", ())
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=hit.spawnFrame + action.startFrame,
            actionOrder=(*hit.actionOrder, action.actionIndex),
            itemType="keywordAction",
            sourcePath=source_path,
            payload=action,
            inputTarget="enemy",
            sequenceOrder=native_sequence_order(
                action, hit.actionOrder, hit.skillId
            ),
        )
        for action in getattr(hit, "keywordActions", ())
    )
    for nested in getattr(hit, "nestedAbilityEntityHits", ()):
        collect_ability_entity_schedule(nested, result)


def conditional_action_contains_keyword(action: ConditionalActionSource) -> bool:
    """判断条件树是否含已结构化关键词动作。"""

    def branch_contains(
        branch_actions: tuple[ConditionalBranchActionSource, ...],
    ) -> bool:
        for branch_action in branch_actions:
            if getattr(branch_action, "keywordAction", None) is not None:
                return True
            nested = getattr(branch_action, "nestedCondition", None)
            if nested is not None and conditional_action_contains_keyword(nested):
                return True
            once_actions = getattr(branch_action, "onceActions", None)
            if once_actions is not None and branch_contains(once_actions):
                return True
        return False

    return branch_contains((*action.succeedActions, *action.failActions))


def collect_consumed_root_timed_marker_action_ids(
    root: dict[str, Any], source_name: str
) -> frozenset[int]:
    """定位已由专用投影消费的根级标记；未知形状仍进入严格审计。"""
    skill_id = root.get("skillId")
    if not isinstance(skill_id, str):
        raise ValueError(f"{source_name}.skillId: expected string")
    result: set[int] = set()
    for action in walk_actions(root.get("actionGroupData")):
        if action_name(str(action.get("$type", ""))) != "CreateTimedMarker":
            continue
        marker = require_dict(action.get("markerId"), f"{source_name}.CreateTimedMarker.markerId")
        if marker.get("useBlackboardKey") is not False:
            continue
        marker_id = marker.get("value")
        if (skill_id, marker_id) in CONSUMED_ROOT_TIMED_MARKERS:
            result.add(id(action))
    return frozenset(result)


def parse_timeline(
    root: dict[str, Any],
    source_name: str,
    consumed_action_ids: frozenset[int] = frozenset(),
) -> tuple[TimelineActionSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    timeline = require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    result: list[TimelineActionSource] = []
    for index, raw in enumerate(timeline):
        item = require_dict(raw, f"{source_name}.timelineActions[{index}]")
        sequence = require_dict(item.get("_sequenceActionData"), f"{source_name}.timelineActions[{index}]._sequenceActionData")
        types: list[str] = []
        # 监听器响应体不属于根时间轴；它由专用解析器按事件触发时机消费。
        for action in walk_actions(
            sequence,
            opaque_action_names=frozenset({"EventListenerAction"}),
        ):
            if id(action) in consumed_action_ids:
                continue
            name = action_name(action["$type"])
            # Switch 只是控制流容器；纯镜头、停帧等选项不属于战斗模拟缺口。
            if name == "SwitchAction" and not contains_combat_effect(action):
                continue
            types.append(name)
        result.append(
            TimelineActionSource(
                startFrame=require_non_negative_int(item.get("_startFrame"), f"{source_name}.timelineActions[{index}]._startFrame"),
                endFrame=require_non_negative_int(item.get("_endFrame"), f"{source_name}.timelineActions[{index}]._endFrame"),
                actionTypes=tuple(types),
            )
        )
    return tuple(result)


def parse_time_dilation_target(
    value: Any,
    path: str,
) -> Literal["caster", "enemy", "abilityEntity"]:
    """把时间膨胀目标收窄到 Endaxis 当前实际模拟的实体身份。"""
    target = require_dict(value, path)
    source = target.get("targetSource")
    # 根技能动作中的 Source 和 Owner 都指向施法干员。
    if source in {"Source", "Owner"}:
        return "caster"
    if source == "Target":
        return "enemy"
    if source == "InstantSearch":
        selector = require_dict(target.get("selectorData"), f"{path}.selectorData")
        finder = require_dict(selector.get("finderData"), f"{path}.selectorData.finderData")
        finder_type = str(finder.get("$type", ""))
        if "+OwnerSpawnedEntityFinder+" in finder_type and finder.get("spawnedObjectType") == "AbilityEntity":
            return "abilityEntity"
    # 上下文目标在技能内通常是生成实体；没有目标组数据时不能冒充敌人或施法者。
    if source == "Context":
        return "abilityEntity"
    raise ValueError(f"{path}: unsupported time-dilation target source {source!r}")


def parse_time_scale_curve(value: Any, path: str) -> tuple[TimeScaleCurveKeySource, ...]:
    curve = require_dict(value, path)
    if curve.get("preWrapMode") != "ClampForever" or curve.get("postWrapMode") != "ClampForever":
        raise ValueError(f"{path}: only ClampForever curves are supported")
    result: list[TimeScaleCurveKeySource] = []
    for index, raw in enumerate(require_list(curve.get("keys"), f"{path}.keys")):
        key_path = f"{path}.keys[{index}]"
        key = require_dict(raw, key_path)
        if set(key) != {
            "time", "value", "inTangent", "outTangent", "tangentMode",
            "weightedMode", "inWeight", "outWeight",
        }:
            raise ValueError(f"{key_path}: unexpected curve-key fields {sorted(key)}")
        weighted_mode = key.get("weightedMode")
        if not isinstance(weighted_mode, int) or isinstance(weighted_mode, bool):
            raise ValueError(f"{key_path}.weightedMode: expected integer")
        result.append(
            TimeScaleCurveKeySource(
                time=require_number(key.get("time"), f"{key_path}.time"),
                value=require_number(key.get("value"), f"{key_path}.value"),
                inTangent=require_number(key.get("inTangent"), f"{key_path}.inTangent"),
                outTangent=require_number(key.get("outTangent"), f"{key_path}.outTangent"),
                weightedMode=weighted_mode,
                inWeight=require_number(key.get("inWeight"), f"{key_path}.inWeight"),
                outWeight=require_number(key.get("outWeight"), f"{key_path}.outWeight"),
            )
        )
    return tuple(result)


def parse_time_dilations(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, ScalarSource],
) -> tuple[TimedTimeDilationSource, ...]:
    """严格读取根时间轴上的普通和终结技时间膨胀动作。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    timeline = require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    result: list[TimedTimeDilationSource] = []
    parsed_action_ids: set[int] = set()
    for timeline_index, raw_timeline in enumerate(timeline):
        timeline_path = f"{source_name}.timelineActions[{timeline_index}]"
        item = require_dict(raw_timeline, timeline_path)
        sequence = require_dict(item.get("_sequenceActionData"), f"{timeline_path}._sequenceActionData")
        direct_actions = require_list(sequence.get("actionData"), f"{timeline_path}._sequenceActionData.actionData")
        for action_index, raw_action in enumerate(direct_actions):
            path = f"{timeline_path}._sequenceActionData.actionData[{action_index}]"
            action = require_dict(raw_action, path)
            if action.get("isEnable") is False:
                continue
            name = action_name(str(action.get("$type", "")))
            if name not in {"TimeDilationAction", "UltimateTimeAction"}:
                continue
            parsed_action_ids.add(id(action))
            common = {"$type", "isEnable", "priorityLevel", "priorityOffset", "serverActionIndex"}
            start_frame = require_non_negative_int(item.get("_startFrame"), f"{timeline_path}._startFrame")
            end_frame = require_non_negative_int(item.get("_endFrame"), f"{timeline_path}._endFrame")
            server_index = require_server_action_index(action, path)
            priority = require_dict(action.get("timeDilationPriority"), f"{path}.timeDilationPriority").get("tagId")
            if not isinstance(priority, int) or isinstance(priority, bool):
                raise ValueError(f"{path}.timeDilationPriority.tagId: expected integer")
            ignored = tuple(
                parse_time_dilation_target(target, f"{path}.ignoreTargets[{index}]")
                for index, target in enumerate(require_list(action.get("ignoreTargets"), f"{path}.ignoreTargets"))
            )
            omitted = sum(target == "abilityEntity" for target in ignored)
            fixed_ignored = tuple(cast(Literal["caster", "enemy"], target) for target in ignored if target != "abilityEntity")
            if name == "UltimateTimeAction":
                expected = common | {"timeScale", "timeDilationPriority", "ignoreTargets"}
                if set(action) != expected:
                    raise ValueError(f"{path}: unexpected UltimateTimeAction fields {sorted(set(action) - expected)}")
                result.append(TimedTimeDilationSource(
                    startFrame=start_frame, endFrame=end_frame, actionIndex=server_index,
                    kind="ultimate", priority=priority, scope=None, slot=None, duration=None,
                    namedCurve=None, inlineCurve=(), finishByAction=True,
                    ignoredTargets=fixed_ignored, targets=(), omittedAbilityEntityTargets=omitted,
                    influenceSkillCooldown=None,
                    targetScale=require_number(action.get("timeScale"), f"{path}.timeScale"),
                    sequenceIndex=timeline_index,
                ))
                continue
            expected = common | {
                "layer", "slot", "timeDilationPriority", "duration", "useCurveKey", "curveKey",
                "timeScaleCurve", "finishByAction", "ignoreTargets", "effectTargets",
                "useTimeScaleForSkillCdTick", "influenceSkillCdTime",
            }
            if set(action) != expected:
                raise ValueError(f"{path}: unexpected TimeDilationAction fields {sorted(set(action) - expected)}")
            layer = action.get("layer")
            if layer not in {"Global", "Entity"}:
                raise ValueError(f"{path}.layer: unsupported value {layer!r}")
            slot = require_dict(action.get("slot"), f"{path}.slot").get("tagId")
            if not isinstance(slot, int) or isinstance(slot, bool):
                raise ValueError(f"{path}.slot.tagId: expected integer")
            effect_targets = tuple(
                parse_time_dilation_target(target, f"{path}.effectTargets[{index}]")
                for index, target in enumerate(require_list(action.get("effectTargets"), f"{path}.effectTargets"))
            )
            if "abilityEntity" in effect_targets:
                raise ValueError(f"{path}.effectTargets: ability entities need an explicit runtime model")
            use_curve_key = require_bool(action.get("useCurveKey"), f"{path}.useCurveKey")
            curve_key = action.get("curveKey")
            if not isinstance(curve_key, str):
                raise ValueError(f"{path}.curveKey: expected string")
            inline_curve = parse_time_scale_curve(action.get("timeScaleCurve"), f"{path}.timeScaleCurve")
            if use_curve_key == bool(inline_curve):
                raise ValueError(f"{path}: expected exactly one named or inline curve")
            influence = None
            if require_bool(action.get("useTimeScaleForSkillCdTick"), f"{path}.useTimeScaleForSkillCdTick"):
                influence = parse_scalar(action.get("influenceSkillCdTime"), f"{path}.influenceSkillCdTime", inherited_blackboard)
            result.append(TimedTimeDilationSource(
                startFrame=start_frame, endFrame=end_frame, actionIndex=server_index,
                kind="normal", priority=priority,
                scope="global" if layer == "Global" else "entity", slot=slot,
                duration=parse_scalar(action.get("duration"), f"{path}.duration", inherited_blackboard),
                namedCurve=curve_key if use_curve_key else None, inlineCurve=inline_curve,
                finishByAction=require_bool(action.get("finishByAction"), f"{path}.finishByAction"),
                ignoredTargets=fixed_ignored,
                targets=tuple(cast(Literal["caster", "enemy"], target) for target in effect_targets),
                omittedAbilityEntityTargets=omitted, influenceSkillCooldown=influence, targetScale=None,
                sequenceIndex=timeline_index,
            ))
    for action in walk_actions(group):
        name = action_name(str(action.get("$type", "")))
        if name in {"TimeDilationAction", "UltimateTimeAction"} and id(action) not in parsed_action_ids:
            raise ValueError(
                f"{source_name}: nested {name} is not supported; "
                "the action must not be silently omitted"
            )
    return tuple(result)


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
                    inputTargets=(),
                    intervalSeconds=interval,
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


def collect_unresolved_combat_actions(
    timeline: tuple[TimelineActionSource, ...],
) -> tuple[str, ...]:
    """汇总根时间轴上仍需由正式 DSL 消费的战斗动作类型。"""
    action_counts = Counter(
        action_type for item in timeline for action_type in item.actionTypes
    )
    return tuple(sorted(name for name in action_counts if name in AUDITED_COMBAT_ACTION_NAMES))


def collect_windows(root: dict[str, Any], source_name: str) -> tuple[tuple[dict[str, Any], ...], tuple[dict[str, Any], ...]]:
    group = require_dict(root["actionGroupData"], f"{source_name}.actionGroupData")
    allows: list[dict[str, Any]] = []
    caches: list[dict[str, Any]] = []
    for index, raw in enumerate(require_list(group["timelineActions"], f"{source_name}.timelineActions")):
        item = require_dict(raw, f"{source_name}.timelineActions[{index}]")
        start = require_non_negative_int(item["_startFrame"], f"{source_name}.timelineActions[{index}]._startFrame")
        end = require_non_negative_int(item["_endFrame"], f"{source_name}.timelineActions[{index}]._endFrame")
        for action in walk_actions(item.get("_sequenceActionData")):
            name = action_name(action["$type"])
            if name == "AllowNextSkillAction":
                allowed = require_list(action.get("allowedSkillIdList"), f"{source_name}.AllowNextSkillAction.allowedSkillIdList")
                if not all(isinstance(skill_id, str) for skill_id in allowed):
                    raise ValueError(f"{source_name}: AllowNextSkillAction contains non-string skill id")
                allows.append({"startFrame": start, "endFrame": end, "skillIds": allowed})
            elif name == "ComboCacheAction":
                mappings = require_list(action.get("mappingDataList"), f"{source_name}.ComboCacheAction.mappingDataList")
                caches.append({"startFrame": start, "endFrame": end, "mappings": mappings})
    return tuple(allows), tuple(caches)


def derive_timeline_block(exclusive_frame: int, allow_windows: tuple[dict[str, Any], ...]) -> tuple[int, str]:
    candidates = [(exclusive_frame + 1, "exclusiveFrame+1")]
    candidates.extend((window["startFrame"], "AllowNextSkillAction.startFrame") for window in allow_windows)
    frame, source = min(candidates, key=lambda candidate: candidate[0])
    return frame, source


def parse_skill_patch(raw: Any, skill_id: str) -> SkillPatchSource:
    entry = require_dict(raw, f"SkillPatchTable.{skill_id}")
    bundles = require_list(entry.get("SkillPatchDataBundle"), f"SkillPatchTable.{skill_id}.SkillPatchDataBundle")
    if not bundles:
        raise ValueError(f"SkillPatchTable.{skill_id}: expected at least one level")
    levels: list[int] = []
    blackboard_rows: list[dict[str, float]] = []
    cooldowns: list[float] = []
    cost_types: list[int] = []
    costs: list[float] = []
    for index, raw_bundle in enumerate(bundles):
        bundle = require_dict(raw_bundle, f"SkillPatchTable.{skill_id}[{index}]")
        levels.append(require_non_negative_int(bundle.get("level"), f"SkillPatchTable.{skill_id}[{index}].level"))
        row: dict[str, float] = {}
        for raw_item in require_list(bundle.get("blackboard"), f"SkillPatchTable.{skill_id}[{index}].blackboard"):
            item = require_dict(raw_item, f"SkillPatchTable.{skill_id}[{index}].blackboard[]")
            key = item.get("key")
            value = item.get("value")
            if not isinstance(key, str) or not key:
                raise ValueError(f"SkillPatchTable.{skill_id}[{index}]: invalid blackboard key")
            if not isinstance(value, (int, float)) or isinstance(value, bool):
                raise ValueError(f"SkillPatchTable.{skill_id}[{index}].blackboard.{key}: expected number")
            if key in row:
                raise ValueError(f"SkillPatchTable.{skill_id}[{index}]: duplicate blackboard key {key}")
            row[key] = float(value)
        blackboard_rows.append(row)
        cooldowns.append(float(bundle.get("coolDown", 0)))
        cost_types.append(int(bundle.get("costType", 0)))
        costs.append(float(bundle.get("costValue", 0)))
    if levels != sorted(levels) or len(set(levels)) != len(levels):
        raise ValueError(f"SkillPatchTable.{skill_id}: levels must be unique and ascending")
    all_keys = set().union(*(row.keys() for row in blackboard_rows))
    for key in all_keys:
        if any(key not in row for row in blackboard_rows):
            raise ValueError(f"SkillPatchTable.{skill_id}: blackboard key {key} is missing at some levels")
    return SkillPatchSource(
        levels=tuple(levels),
        blackboard={key: tuple(row[key] for row in blackboard_rows) for key in sorted(all_keys)},
        cooldownSeconds=tuple(cooldowns),
        costTypes=tuple(cost_types),
        costValues=tuple(costs),
    )


def parse_skill(entry: dict[str, Any], source_dir: Path, patch_table: dict[str, Any]) -> SkillSource:
    source_name = entry.get("source")
    if not isinstance(source_name, str):
        raise ValueError("skill.source: expected string")
    source_path = source_dir / source_name
    if not source_path.is_file():
        raise FileNotFoundError(source_path)
    root = load_projected_skill_data(source_path, source_name)
    skill_id = root.get("skillId")
    if not isinstance(skill_id, str) or not skill_id:
        raise ValueError(f"{source_name}.skillId: expected non-empty string")
    if skill_id not in patch_table:
        raise ValueError(f"SkillPatchTable: missing {skill_id}")
    patch = parse_skill_patch(patch_table[skill_id], skill_id)
    resolved_blackboard = resolve_skill_blackboard(root, source_name, patch)
    cast = require_dict(root.get("castData"), f"{source_name}.castData")
    cost = require_dict(cast.get("costData"), f"{source_name}.castData.costData")
    consumed_root_timed_markers = collect_consumed_root_timed_marker_action_ids(
        root, source_name
    )
    timeline = parse_timeline(
        root,
        source_name,
        consumed_root_timed_markers,
    )
    allows, caches = collect_windows(root, source_name)
    exclusive = require_non_negative_int(root.get("exclusiveFrame"), f"{source_name}.exclusiveFrame")
    block_frame, block_source = derive_timeline_block(exclusive, allows)
    unresolved = collect_unresolved_combat_actions(timeline)
    blackboard_calculations = parse_blackboard_calculations(
        root, source_name, resolved_blackboard
    )
    conditional_actions = resolve_conditional_projectile_triggers(
        parse_conditional_actions(
            root,
            source_name,
            resolved_blackboard,
            consumed_root_timed_markers,
        ),
        root,
        source_name,
        source_dir,
        0,
        (skill_id,),
        resolved_blackboard,
    )
    conditional_actions = mark_projected_conditional_children(
        resolve_conditional_aura_ability_entity_children(
            conditional_actions,
            source_name,
            source_dir,
            0,
            (skill_id,),
            resolved_blackboard,
        )
    )
    blackboard_mutations, buff_blackboard_reads, buff_finishes = parse_blackboard_runtime_actions(
        root, source_name, resolved_blackboard
    )
    referenced_buff_ids = collect_referenced_buff_ids(root, source_name)
    return SkillSource(
        key=str(entry["key"]),
        skillId=skill_id,
        skillType=str(entry["skillType"]),
        sourceFile=source_name,
        timelineBlockFrames=block_frame,
        blockBoundarySource=block_source,
        cooldownSeconds=float(cast.get("cooldownTime", 0)),
        costFrame=require_non_negative_int(cast.get("startCdFrame"), f"{source_name}.castData.startCdFrame"),
        costType=str(cost.get("costType", "")),
        costValue=float(cost.get("costValue", 0)),
        offsetRecordFrame=require_non_negative_int(root.get("offsetRecordFrame"), f"{source_name}.offsetRecordFrame"),
        allowNextWindows=allows,
        inputCacheWindows=caches,
        timelineActions=timeline,
        directDamageHits=parse_direct_damage_hits(root, source_name, resolved_blackboard),
        conditionalActions=conditional_actions,
        inflictions=parse_inflictions(root, source_name),
        auxiliaryActions=parse_auxiliary_actions(
            root, source_name, source_dir, resolved_blackboard
        ),
        blackboardCalculations=blackboard_calculations,
        blackboardMutations=blackboard_mutations,
        buffBlackboardReads=buff_blackboard_reads,
        buffFinishes=buff_finishes,
        resourceGains=parse_resource_gains(root, source_name, resolved_blackboard),
        projectileLaunches=parse_projectile_launches(root, source_name),
        projectileTriggeredSkills=(
            *resolve_projectile_triggered_skills(
                root,
                source_name,
                source_dir,
                stack=(skill_id,),
                inherited_blackboard=resolved_blackboard,
            ),
            *collect_projected_conditional_projectile_skills(conditional_actions),
        ),
        abilityEntityHits=(
            *resolve_ability_entity_hits(
                root,
                source_name,
                source_dir,
                stack=(skill_id,),
                inherited_blackboard=resolved_blackboard,
            ),
            *resolve_guaranteed_conditional_ability_entity_hits(
                conditional_actions,
                source_name,
                source_dir,
                0,
                (skill_id,),
                resolved_blackboard,
            ),
        ),
        referencedBuffIds=referenced_buff_ids,
        patch=patch,
        declaredBlackboard=parse_declared_blackboard(root, source_name),
        blackboardKeys=collect_blackboard_keys(root),
        blackboardProvenance=build_blackboard_provenance(
            root,
            source_name,
            patch,
            blackboard_calculations,
            blackboard_mutations,
            buff_blackboard_reads,
        ),
        unresolvedCombatActions=unresolved,
        buffHolds=parse_buff_hold_actions(root, source_name),
        targetGroupWrites=parse_target_group_writes(root, source_name),
        targetGroupControlFlowActions=parse_conditional_actions(
            root,
            source_name,
            resolved_blackboard,
            consumed_root_timed_markers,
            include_target_group_provenance=True,
        ),
        auraActions=parse_aura_actions(root, source_name, resolved_blackboard),
        physicalInflictions=parse_physical_inflictions(
            root, source_name, resolved_blackboard
        ),
        eventListeners=parse_skill_event_listeners(
            root, source_name, resolved_blackboard
        ),
        timeDilations=parse_time_dilations(root, source_name, resolved_blackboard),
        keywordActions=parse_timed_keyword_actions(
            root, source_name, resolved_blackboard
        ),
    )


def render_typescript(
    export_name: str,
    slug: str,
    skills: list[SkillSource],
    buff_definitions: tuple[BuffDefinitionSource, ...],
) -> str:
    payload = {
        "slug": slug,
        "buffDefinitions": [serialize_audit_value(item) for item in buff_definitions],
        "skills": [serialize_audit_value(skill) for skill in skills],
    }
    return (
        "/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */\n"
        "import type { GeneratedOperatorSource } from './generatedOperatorSource';\n\n"
        "// prettier-ignore\n"
        f"export const {export_name} = {ts_literal(payload)} as const satisfies GeneratedOperatorSource;\n"
    )


DAMAGE_TYPE_MAP = {
    "Physical": "physical",
    "Fire": "heat",
    "Heat": "heat",
    "Cryst": "cryo",
    "Cold": "cryo",
    "Pulse": "electric",
    "Natural": "nature",
    "Nature": "nature",
}


def require_level_values(source: ScalarSource, path: str) -> tuple[float, ...]:
    if source.levelValues is not None:
        return source.levelValues
    if source.blackboardKey is None:
        return (source.value,)
    raise ValueError(f"{path}: scalar has no resolved level values")


def resolved_scalar_values(source: ScalarSource) -> tuple[float, ...]:
    return source.levelValues if source.levelValues is not None else (source.value,)


def compact_level_values(values: tuple[float, ...]) -> float | tuple[float, ...]:
    return values[0] if all(value == values[0] for value in values) else values


def compile_condition_operand(source: ScalarSource, path: str) -> str:
    """把原生条件操作数收窄为动作黑板键或与等级无关的常量。"""
    if source.blackboardKey is not None:
        return (
            "{ kind: 'blackboard', key: "
            f"{ts_inline_literal(source.blackboardKey)} }}"
        )
    values = source.levelValues
    if values is not None:
        if not values or any(value != values[0] for value in values[1:]):
            raise ValueError(f"{path}: level-dependent condition constants are not supported")
        value = values[0]
    else:
        value = source.value
    return f"{{ kind: 'constant', value: {ts_inline_literal(value)} }}"


def compile_time_dilation(action: TimedTimeDilationSource, path: str) -> str:
    """把已归一化的原生时间动作编译为 SkillDefinition 步骤。"""
    if action.kind == "ultimate":
        if action.targetScale is None:
            raise ValueError(f"{path}: ultimate time dilation has no target scale")
        return "\n".join(
            [
                "step('startUltimateTimeDilation', {",
                f"  priority: {action.priority},",
                "  targetScale: { kind: 'constant', value: "
                f"{ts_inline_literal(action.targetScale)} }},",
                f"  ignoredTargets: {ts_inline_literal(action.ignoredTargets)},",
                "})",
            ]
        )
    if action.duration is None or action.scope is None or action.slot is None:
        raise ValueError(f"{path}: normal time dilation is incomplete")
    if action.namedCurve is not None:
        curve = f"{{ kind: 'named', key: {ts_inline_literal(action.namedCurve)} }}"
    else:
        if not action.inlineCurve:
            raise ValueError(f"{path}: normal time dilation has no curve")
        curve = ts_inline_literal(
            {
                "kind": "inline",
                "keys": [asdict(key) for key in action.inlineCurve],
            }
        )
    fields = [
        f"scope: {ts_inline_literal(action.scope)}",
        f"durationSeconds: {compile_condition_operand(action.duration, f'{path}.duration')}",
        f"slot: {action.slot}",
        f"priority: {action.priority}",
        f"curve: {curve}",
        f"finishByAction: {ts_inline_literal(action.finishByAction)}",
    ]
    if action.scope == "global":
        fields.append(f"ignoredTargets: {ts_inline_literal(action.ignoredTargets)}")
        if action.influenceSkillCooldown is not None:
            fields.append(
                "influenceSkillCooldownSeconds: "
                f"{compile_condition_operand(action.influenceSkillCooldown, f'{path}.influenceSkillCooldown')}"
            )
    else:
        fields.append(f"targets: {ts_inline_literal(action.targets)}")
    return "\n".join(
        [
            "step('startTimeDilation', {",
            *(f"  {field}," for field in fields),
            "})",
        ]
    )


def resolve_fixed_combat_target(
    target_source: str,
    target_group_key: str,
    *,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    context_target_is_enemy: bool = False,
) -> Literal["caster", "enemy"] | None:
    """把原生目标引用归约为 Next 固定施法者/单敌人身份；无法证明时返回空。"""
    # 原生只有 Context 分支读取 targetGroupKey；其他固定来源中的同名字段是无效残留。
    if target_source == "Source":
        return "caster"
    if root_skill_context and target_source == "Owner":
        return "caster"
    if target_source == "Target" and input_target == "enemy":
        # 原生 Target 直接读取动作输入目标，命名目标组对该来源没有作用。
        return "enemy"
    if target_source == "Context" and (
        target_group_key == "smart_target" or context_target_is_enemy
    ):
        return "enemy"
    if target_source != "Context" or action is None:
        return None
    write = resolve_latest_target_group_write(
        action,
        target_group_key,
        target_group_writes,
    )
    if write is not None and target_group_write_guarantees_single_enemy(write):
        return "enemy"
    return None


NATIVE_DAMAGE_TAG_BITS = {
    4: "powerAttack",
    128: "normalAttack",
    256: "normalSkill",
    512: "ultimateSkill",
    1024: "plungingAttack",
    8192: "comboSkill",
    131072: "dashAttack",
    2097152: "normalAttackLastCombo",
}

NATIVE_DAMAGE_FEATURE_BITS = {
    4096: "canBreakWeakness",
    16384: "crush",
    32768: "airborne",
    268435456: "dot",
    536870912: "remainArea",
}

IMPLIED_DAMAGE_TAG_PARENTS = {
    "normalAttackLastCombo": "normalAttack",
}


def decode_damage_decorate_mask(mask: int, path: str) -> tuple[tuple[str, ...], tuple[str, ...]]:
    """把已确认的原生伤害位拆成技能分类与行为特征，未知位必须阻止生成。"""
    remaining = mask
    tags: list[str] = []
    features: list[str] = []
    for bit, tag in NATIVE_DAMAGE_TAG_BITS.items():
        if remaining & bit:
            tags.append(tag)
            remaining &= ~bit
    for bit, feature in NATIVE_DAMAGE_FEATURE_BITS.items():
        if remaining & bit:
            features.append(feature)
            remaining &= ~bit
    if remaining != 0:
        raise ValueError(f"{path}: damage decorate mask {mask} contains unmapped bits")
    return tuple(tags), tuple(features)


def compile_event_damage_property_condition(
    property_name: Literal["tags", "features"],
    match: str,
    values: tuple[str, ...],
) -> str:
    kind = "eventDamageTagsMatch" if property_name == "tags" else "eventDamageFeaturesMatch"
    return "\n".join(
        [
            "{",
            f"  kind: {ts_inline_literal(kind)},",
            f"  match: {ts_inline_literal(match)},",
            f"  {property_name}: {ts_inline_literal(values)},",
            "}",
        ]
    )


def compile_condition_collection(kind: Literal["all", "any", "not"], value: list[str] | str) -> str:
    if kind == "not":
        assert isinstance(value, str)
        lines = ["{", "  kind: 'not',", "  condition:"]
        nested = indent_source(value, 4)
        nested[-1] += ","
        lines.extend(nested)
        lines.append("}")
        return "\n".join(lines)
    assert isinstance(value, list) and value
    lines = ["{", f"  kind: {ts_inline_literal(kind)},", "  conditions: ["]
    for condition in value:
        nested = indent_source(condition, 4)
        nested[-1] += ","
        lines.extend(nested)
    lines.extend(["  ],", "}"])
    return "\n".join(lines)


def compile_combat_condition(
    source: ConditionSource,
    path: str,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    skill_has_output_damage: bool = False,
) -> str:
    """只编译已由 Next 运行时闭环的原生条件，其他条件必须显式失败。"""
    if is_guaranteed_single_enemy_condition(
        source, action=action, target_group_writes=target_group_writes
    ):
        return "{ kind: 'singleEnemyPresent' }"
    if source.sourceType == "CheckSquadInFight":
        return "{ kind: 'combatActive' }"
    if source.sourceType == "CheckDamageDecorateMask":
        damage_mask = source.damageDecorateMask
        if damage_mask is None:
            raise ValueError(f"{path}: missing damage decorate mask payload")
        match = {
            "HasAny": "hasAny",
            "HasAll": "hasAll",
            "ExceptAny": "exceptAny",
            "ExceptAll": "exceptAll",
        }.get(damage_mask.checkType)
        if match is None:
            raise ValueError(
                f"{path}: unsupported damage decorate check type {damage_mask.checkType!r}"
            )
        tags, features = decode_damage_decorate_mask(damage_mask.mask, path)
        conditions: list[str] = []
        if match == "exceptAll" and tags and features:
            positive = [
                compile_event_damage_property_condition("tags", "hasAll", tags),
                compile_event_damage_property_condition("features", "hasAll", features),
            ]
            return compile_condition_collection("not", compile_condition_collection("all", positive))
        child_match = "hasAll" if match == "hasAll" else match
        if tags:
            conditions.append(compile_event_damage_property_condition("tags", child_match, tags))
        if features:
            conditions.append(
                compile_event_damage_property_condition("features", child_match, features)
            )
        if len(conditions) == 1:
            return conditions[0]
        collection = "any" if match == "hasAny" else "all"
        return compile_condition_collection(collection, conditions)
    if source.sourceType == "CheckDistanceCondition":
        distance = source.distance
        if distance is None:
            raise ValueError(f"{path}: missing distance condition payload")
        result = evaluate_zero_distance_condition(
            distance,
            root_skill_context=root_skill_context,
        )
        if result is True:
            return "{ kind: 'singleEnemyPresent' }"
        if result is False:
            return "{ kind: 'not', condition: { kind: 'singleEnemyPresent' } }"
        raise ValueError(
            f"{path}: CheckDistanceCondition targets are not covered by the zero-distance model"
        )
    if source.sourceType == "CheckMainCharacterCondition":
        main_operator = source.mainOperator
        if main_operator is None:
            raise ValueError(f"{path}: missing main operator condition payload")
        if main_operator.targetSource in {"Owner", "Source"}:
            return "{ kind: 'casterControlled' }"
        raise ValueError(
            f"{path}: unsupported main operator target "
            f"{main_operator.targetSource!r}/{main_operator.targetGroupKey!r}"
        )
    if source.sourceType == "CompareFloat":
        if source.left is None or source.right is None or source.comparison is None:
            raise ValueError(f"{path}: incomplete CompareFloat condition")
        operator = COMPARISON_OPERATOR_MAP.get(source.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {source.comparison!r}")
        return "\n".join(
            [
                "{",
                "  kind: 'actionValueCompare',",
                f"  left: {compile_condition_operand(source.left, f'{path}.left')},",
                f"  operator: {ts_inline_literal(operator)},",
                f"  right: {compile_condition_operand(source.right, f'{path}.right')},",
                "}",
            ]
        )
    if source.sourceType == "CheckHp":
        health = source.health
        if health is None:
            raise ValueError(f"{path}: missing health condition payload")
        operator = COMPARISON_OPERATOR_MAP.get(health.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {health.comparison!r}")
        target = resolve_fixed_combat_target(
            health.targetSource,
            health.targetGroupKey,
            action=action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
        if target is None:
            raise ValueError(
                f"{path}: unsupported health target "
                f"{health.targetSource!r}/{health.targetGroupKey!r}"
            )
        return "\n".join(
            [
                "{",
                "  kind: 'healthCompare',",
                f"  target: {ts_inline_literal(target)},",
                f"  valueType: {ts_inline_literal('ratio' if health.isRatio else 'current')},",
                f"  operator: {ts_inline_literal(operator)},",
                f"  value: {compile_condition_operand(health.value, f'{path}.value')},",
                "}",
            ]
        )
    if source.sourceType == "CheckTagMatch":
        entity_tag = source.entityTag
        if entity_tag is None:
            raise ValueError(f"{path}: missing entity tag condition payload")
        target = resolve_fixed_combat_target(
            entity_tag.targetSource,
            entity_tag.targetGroupKey,
            action=action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
        if target is None:
            raise ValueError(
                f"{path}: unsupported entity tag target "
                f"{entity_tag.targetSource!r}/{entity_tag.targetGroupKey!r}"
            )
        return "\n".join(
            [
                "{",
                "  kind: 'entityTagMatch',",
                f"  target: {ts_inline_literal(target)},",
                f"  tagQueryType: {ts_inline_literal(entity_tag.tagQueryType)},",
                f"  tagIds: {ts_inline_literal(entity_tag.tagIds)},",
                "}",
            ]
        )
    if source.sourceType == "CheckTimedMarkerCondition":
        marker = source.timedMarker
        if marker is None:
            raise ValueError(f"{path}: missing timed marker condition payload")
        if marker.useBlackboardKey:
            raise ValueError(f"{path}: dynamic timed marker IDs are not supported")
        if not marker.markerId:
            raise ValueError(f"{path}: timed marker ID is empty")
        if not (
            marker.targetSource == "Source"
            or (root_skill_context and marker.targetSource == "Owner")
        ) or marker.targetGroupKey:
            raise ValueError(
                f"{path}: unsupported timed marker target "
                f"{marker.targetSource!r}/{marker.targetGroupKey!r}"
            )
        condition = (
            "{ kind: 'timedMarkerPresent', target: 'caster', markerId: "
            f"{ts_inline_literal(marker.markerId)} }}"
        )
        if marker.returnTrueIfNotExists:
            return f"{{ kind: 'not', condition: {condition} }}"
        return condition
    if source.sourceType == "CheckGlobalCDTimerAction":
        cooldown = source.globalCooldown
        if cooldown is None:
            raise ValueError(f"{path}: missing global cooldown condition payload")
        if not (
            cooldown.targetSource == "Source"
            or (root_skill_context and cooldown.targetSource == "Owner")
        ) or cooldown.targetGroupKey:
            raise ValueError(
                f"{path}: unsupported global cooldown target "
                f"{cooldown.targetSource!r}/{cooldown.targetGroupKey!r}"
            )
        # 原生检查在对应全局定时项不存在时成功，和普通标记检查的反向极性一致。
        present = (
            "{ kind: 'timedMarkerPresent', target: 'caster', markerId: "
            f"{ts_inline_literal(cooldown.buffId)} }}"
        )
        return f"{{ kind: 'not', condition: {present} }}"
    if source.sourceType == "CheckSkillHasHit":
        if source.skillHasHit is None:
            raise ValueError(f"{path}: missing skill hit condition payload")
        if not root_skill_context:
            raise ValueError(f"{path}: child skill hit state is not projected")
        if not skill_has_output_damage:
            raise ValueError(f"{path}: no prior guaranteed damage from the current skill")
        # Next 固定单敌人且伤害必然命中；调度器已证明当前技能此前输出过伤害。
        return "{ kind: 'singleEnemyPresent' }"
    if source.sourceType in {
        "CheckBuffStackNum",
        "CheckBuffStackNumAdvanced",
        "CheckBuffStackNumByTag",
    }:
        buff = source.buffStack
        if buff is None:
            raise ValueError(f"{path}: missing Buff stack condition payload")
        if buff.countType != "BuffCount" or buff.limitSkillCastId:
            raise ValueError(f"{path}: unsupported Buff stack count semantics")
        operator = COMPARISON_OPERATOR_MAP.get(buff.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {buff.comparison!r}")
        value_source = compile_condition_operand(buff.value, f"{path}.value")
        target = resolve_fixed_combat_target(
            buff.targetSource,
            buff.targetGroupKey,
            action=action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
        if (
            target is not None
            and buff.buffCheckType == "Tag"
            and buff.buffTagIds
            and not buff.buffIds
        ):
            return "\n".join(
                [
                    "{",
                    "  kind: 'buffStackCompare',",
                    f"  target: {ts_inline_literal(target)},",
                    f"  tagQueryType: {ts_inline_literal(buff.tagQueryType)},",
                    f"  buffTagIds: {ts_inline_literal(buff.buffTagIds)},",
                    f"  operator: {ts_inline_literal(operator)},",
                    f"  value: {value_source},",
                    "}",
                ]
            )
        if (
            target is not None
            and buff.buffCheckType == "Id"
            and buff.buffIds
            and not buff.buffTagIds
        ):
            return "\n".join(
                [
                    "{",
                    "  kind: 'buffIdStackCompare',",
                    f"  target: {ts_inline_literal(target)},",
                    f"  buffIds: {ts_inline_literal(buff.buffIds)},",
                    f"  operator: {ts_inline_literal(operator)},",
                    f"  value: {value_source},",
                    "}",
                ]
            )
        raise ValueError(f"{path}: unsupported Buff stack query target or identity")
    raise ValueError(f"{path}: unsupported condition type {source.sourceType!r}")


def compile_combat_condition_group(
    conditions: tuple[ConditionSource, ...],
    path: str,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    skill_has_output_damage: bool = False,
) -> str:
    """保持原生条件组的全满足语义，并生成可直接嵌入 DSL 的条件树。"""
    if not conditions:
        raise ValueError(f"{path}: empty condition group")
    compiled = [
        compile_combat_condition(
            condition,
            f"{path}[{index}]",
            action,
            target_group_writes,
            root_skill_context,
            input_target,
            skill_has_output_damage,
        )
        for index, condition in enumerate(conditions)
    ]
    if len(compiled) == 1:
        return compiled[0]
    lines = ["{", "  kind: 'all',", "  conditions: ["]
    for condition in compiled:
        condition_lines = [f"    {line}" for line in condition.splitlines()]
        condition_lines[-1] += ","
        lines.extend(condition_lines)
    lines.extend(["  ],", "}"])
    return "\n".join(lines)


def percentage_values(values: tuple[float, ...]) -> tuple[int | float, ...]:
    result: list[int | float] = []
    for value in values:
        percentage = round(value * 100, 8)
        result.append(int(percentage) if percentage.is_integer() else percentage)
    return tuple(result)


def compile_percentage_level_values(values: tuple[float, ...]) -> str:
    """固定百分比生成标量；只有真正随等级变化时才保留 LevelValues 数组。"""
    compact = compact_level_values(percentage_values(values))
    helper = "percentages" if isinstance(compact, tuple) else "percentage"
    return f"{helper}({ts_inline_literal(compact)})"


def compile_buff_blackboard_read(
    read: BuffBlackboardReadPayload | BuffBlackboardReadSource,
    path: str,
    *,
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    context_target_is_enemy: bool = False,
) -> str:
    """编译 Buff 黑板读取；目标身份和 ID/Tag 查询类型彼此独立。"""
    target = resolve_fixed_combat_target(
        read.targetSource,
        read.targetGroupKey,
        root_skill_context=root_skill_context,
        input_target=input_target,
        context_target_is_enemy=context_target_is_enemy,
    )
    if target is None:
        raise ValueError(f"{path}: unsupported buff blackboard target")
    if read.buffCheckType == "Id" and read.buffIds and not read.buffTagIds:
        query = "{ kind: 'id', buffIds: " + ts_inline_literal(read.buffIds) + " }"
    elif read.buffCheckType == "Tag" and read.buffTagIds and not read.buffIds:
        query = (
            "{ kind: 'tag', tagQueryType: "
            f"{ts_inline_literal(read.tagQueryType)}, buffTagIds: "
            f"{ts_inline_literal(read.buffTagIds)} }}"
        )
    else:
        raise ValueError(f"{path}: unsupported or empty Buff lookup")
    return "\n".join(
        [
            "step('readBuffBlackboard', {",
            f"  target: {ts_inline_literal(target)},",
            f"  query: {query},",
            f"  desiredKey: {ts_inline_literal(read.desiredKey)},",
            f"  outputKey: {ts_inline_literal(read.outputKey)},",
            "})",
        ]
    )


def compile_buff_finish(
    finish: BuffFinishPayload | BuffFinishSource,
    path: str,
    *,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    context_target_is_enemy: bool = False,
) -> str:
    """编译目标身份和 Buff 查询方式均已闭环的全量结束分支。"""
    if not finish.finishAll or finish.limitSource:
        raise ValueError(f"{path}: only finishAll without source limiting is supported")
    if finish.isFinishedEarly and finish.isAbsorbed:
        raise ValueError(f"{path}: conflicting finish reasons")
    reason = "early" if finish.isFinishedEarly else "absorbed" if finish.isAbsorbed else "other"
    target = resolve_fixed_combat_target(
        finish.targetSource,
        finish.targetGroupKey,
        action=action,
        target_group_writes=target_group_writes,
        root_skill_context=root_skill_context,
        input_target=input_target,
        context_target_is_enemy=context_target_is_enemy,
    )
    if (
        target is not None
        and finish.buffCheckType == "Tag"
        and finish.buffTagIds
    ):
        return "\n".join(
            [
                "step('finishBuffsByTag', {",
                f"  target: {ts_inline_literal(target)},",
                f"  tagQueryType: {ts_inline_literal(finish.tagQueryType)},",
                f"  buffTagIds: {ts_inline_literal(finish.buffTagIds)},",
                f"  reason: {ts_inline_literal(reason)},",
                "})",
            ]
        )
    if (
        target is not None
        and finish.buffCheckType == "Id"
        and finish.buffIds
    ):
        return "\n".join(
            [
                "step('finishBuffsById', {",
                f"  target: {ts_inline_literal(target)},",
                f"  buffIds: {ts_inline_literal(finish.buffIds)},",
                f"  reason: {ts_inline_literal(reason)},",
                "})",
            ]
        )
    raise ValueError(f"{path}: unsupported buff finish target or identity")


def compile_buff_hold(hold: BuffHoldSource, path: str) -> str:
    """编译当前已闭环的施法者 Buff ID 查询；标签查询留待取得使用样本后接入。"""
    if (
        hold.targetSource != "Source"
        or hold.targetGroupKey
        or hold.buffCheckType != "Id"
        or not hold.buffIds
        or hold.buffTagIds
    ):
        raise ValueError(f"{path}: unsupported buff hold target or identity")
    return "\n".join(
        [
            "step('holdBuffsById', {",
            "  target: 'caster',",
            f"  buffIds: {ts_inline_literal(hold.buffIds)},",
            "})",
        ]
    )


def indent_source(source: str, spaces: int) -> list[str]:
    prefix = " " * spaces
    return [f"{prefix}{line}" for line in source.splitlines()]


def compile_blackboard_calculation(
    calculation: BlackboardCalculationPayload | BlackboardCalculationSource,
    path: str,
) -> str:
    """将原生双操作数计算映射为独立步骤，避免与原地修改混淆。"""
    operation = ACTION_VALUE_OPERATION_MAP.get(calculation.operation)
    if operation not in {"add", "multiply", "divide"}:
        raise ValueError(
            f"{path}: unsupported action blackboard calculation {calculation.operation!r}"
        )
    return "\n".join(
        [
            "step('calculateActionValue', {",
            f"  key: {ts_inline_literal(calculation.key)},",
            f"  operation: {ts_inline_literal(operation)},",
            f"  left: {compile_condition_operand(calculation.left, f'{path}.left')},",
            f"  right: {compile_condition_operand(calculation.right, f'{path}.right')},",
            "})",
        ]
    )


def compile_blackboard_mutation(
    mutation: BlackboardMutationPayload | BlackboardMutationSource,
    path: str,
) -> str:
    """将原生单操作数修改映射为读取目标旧值的原地运算步骤。"""
    operation = ACTION_VALUE_OPERATION_MAP.get(mutation.operation)
    if operation is None:
        raise ValueError(f"{path}: unsupported action blackboard operation {mutation.operation!r}")
    return "\n".join(
        [
            "step('modifyActionValue', {",
            f"  key: {ts_inline_literal(mutation.key)},",
            f"  operation: {ts_inline_literal(operation)},",
            f"  value: {compile_condition_operand(mutation.value, f'{path}.value')},",
            "})",
        ]
    )


def resource_recipient(resource: str) -> str:
    """映射 Next 的资源所有权：技力属于全队，终结技能量属于施法者。"""
    if resource == "sp":
        return "team"
    if resource == "ultimateEnergy":
        return "caster"
    raise ValueError(f"unsupported resource recipient mapping for {resource!r}")


def compile_resource_gain(
    gain: ResourceGainPayload | TimedResourceGainSource,
    path: str,
) -> str:
    """编译原生资源获得；数值可读动作黑板，动态系数仍严格拒绝。"""
    dynamic_coefficient = gain.coefficient.blackboardKey is not None
    coefficient = (
        compile_condition_operand(gain.coefficient, f"{path}.coefficient")
        if dynamic_coefficient
        else compact_level_values(
            gain.coefficient.levelValues
            if gain.coefficient.levelValues is not None
            else (gain.coefficient.value,)
        )
    )
    recipient = resource_recipient(gain.resource)
    fields = [
        f"resource: {ts_inline_literal(gain.resource)}",
        f"recipient: {ts_inline_literal(recipient)}",
    ]
    if dynamic_coefficient:
        fields.insert(1, f"coefficient: {coefficient}")
    elif coefficient != 1:
        fields.insert(1, f"coefficient: {ts_inline_literal(coefficient)}")
    if gain.resource == "sp":
        if gain.spGainKind is None or gain.spGainSource is None:
            raise ValueError(f"{path}: missing SP gain method or source")
        fields.extend(
            [
                f"spGainKind: {ts_inline_literal(gain.spGainKind)}",
                f"spGainSource: {ts_inline_literal(gain.spGainSource)}",
            ]
        )
    else:
        if gain.isPercentValue:
            fields.append("isPercentValue: true")
        if gain.useUltimateRecoveryTag:
            fields.append(
                f"ultimateRecoveryTagId: {ts_inline_literal(gain.ultimateRecoveryTagId)}"
            )
        if gain.ignoreUltimateGainScalar:
            fields.append("ignoreUltimateEnergyGainMultiplier: true")
    if gain.amount.blackboardKey is not None:
        fields.insert(1, f"amount: {compile_condition_operand(gain.amount, f'{path}.amount')}")
        return "\n".join(
            [
                "step('changeResourceByActionValue', {",
                *(f"  {field}," for field in fields),
                "})",
            ]
        )
    amount = compact_level_values(require_level_values(gain.amount, f"{path}.amount"))
    fields.insert(1, f"amount: {ts_inline_literal(amount)}")
    return "step('changeResource', { " + ", ".join(fields) + " })"


def compile_infliction(infliction: TimedInflictionSource) -> str:
    """编译根时间轴上的元素附着，并保留额外附着标记。"""
    return (
        "step('applyElementalInfliction', "
        f"{{ element: {ts_inline_literal(infliction.element)}, "
        f"isExtra: {ts_inline_literal(infliction.isExtra)} }})"
    )


def compile_keyword_action(
    action: TimedKeywordActionSource,
    path: str,
    *,
    root_skill_context: bool,
    input_target: Literal["enemy"] | None,
    context_action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
) -> str:
    """把关键词动作投影为现有 Buff 步骤；移动效果不属于定点战斗模型。"""
    if action.kind != "slow":
        raise ValueError(f"{path}: unsupported keyword action {action.kind!r}")
    if action.autoFinishByAction:
        raise ValueError(f"{path}: keyword Buff lifetime tied to its action is not supported")
    source = resolve_fixed_combat_target(
        action.source.targetSource,
        action.source.targetGroupKey,
        root_skill_context=root_skill_context,
        input_target=input_target,
        action=context_action,
        target_group_writes=target_group_writes,
    )
    if source != "caster":
        raise ValueError(f"{path}: unsupported slow source {action.source.targetSource!r}")
    target = resolve_fixed_combat_target(
        action.target.targetSource,
        action.target.targetGroupKey,
        root_skill_context=root_skill_context,
        input_target=input_target,
        action=context_action,
        target_group_writes=target_group_writes,
    )
    if target != "enemy":
        raise ValueError(
            f"{path}: unsupported slow target "
            f"{action.target.targetSource!r}/{action.target.targetGroupKey!r}"
        )
    duration = compile_condition_operand(action.duration, f"{path}.duration")
    rate = compile_condition_operand(action.rate, f"{path}.rate")
    return "\n".join(
        [
            "step('applyBuff', {",
            "  buffId: 'buff_common_affixes_slow',",
            "  definition: {",
            "    stackingType: 'highPriority',",
            "    priority: { blackboardKey: 'rate' },",
            "    maxStackCount: 1,",
            "    durationSeconds: { blackboardKey: 'duration' },",
            "    applyTagIds: [1925762097],",
            "    blackboard: { rate: 0, duration: 0 },",
            "  },",
            "  target: 'enemy',",
            "  inheritSourceSkillCastInfo: true,",
            "  blackboardAssignments: {",
            f"    rate: {rate},",
            f"    duration: {duration},",
            "  },",
            "})",
        ]
    )


def compile_buff_application_values(
    *,
    buff_id: str,
    blackboard_assignments: dict[str, ScalarSource],
    target_source: str,
    target_group_key: str,
    count: ScalarSource,
    buff_source: str,
    inherit_source_skill_cast_info: bool,
    root_skill_context: bool,
    path: str,
    context_application_target: Literal["enemy", "party"] | None = None,
    input_target: Literal["enemy"] | None = None,
    allow_dynamic_count: bool = False,
    target_finder_type: str | None = None,
    target_validator_types: tuple[str, ...] = (),
    target_post_processor_types: tuple[str, ...] = (),
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> str:
    """编译已闭环的单个 Buff 施加；动作级公共字段由根动作和条件分支共同提供。"""
    if (count.blackboardKey is not None or count.value != 1) and not allow_dynamic_count:
        raise ValueError(f"{path}: only a literal application count of 1 is supported")
    # 根 SkillData 中 ActionSource 与 ActionOwner 都是施法干员；嵌套动作尚不能做相同假设。
    supported_sources = {"ActionSource", "ActionOwner"} if root_skill_context else {"ActionSource"}
    source = None
    if buff_source == "InputTarget" and (root_skill_context or input_target == "enemy"):
        source = "enemy"
    elif buff_source not in supported_sources:
        raise ValueError(f"{path}: unsupported Buff source {buff_source!r}")
    target: Literal["caster", "enemy", "party"] | None
    if target_source == "Context" and context_application_target is not None:
        target = context_application_target
    elif (
        target_source == "InstantSearch"
        and target_finder_type == "CharacterTeamFinder"
        and not target_validator_types
        and not target_post_processor_types
    ):
        target = "party"
    else:
        target = resolve_fixed_combat_target(
            target_source,
            target_group_key,
            root_skill_context=root_skill_context,
            input_target="enemy" if root_skill_context else input_target,
        )
    if target is None:
        raise ValueError(
            f"{path}: unsupported Buff target "
            f"{target_source!r}/{target_group_key!r}"
        )
    lines = [
        "step('applyBuff', {",
        f"  buffId: {ts_inline_literal(buff_id)},",
    ]
    if buff_definitions is not None:
        definition = buff_definitions.get(buff_id)
        if definition is None:
            raise ValueError(f"{path}: Buff definition {buff_id!r} was not resolved")
        definition_lines = compile_inline_buff_definition(definition, path).splitlines()
        lines.append("  definition: {")
        lines.extend(f"    {line}" for line in definition_lines)
        lines.append("  },")
    lines.extend([
        f"  target: {ts_inline_literal(target)},",
        "  inheritSourceSkillCastInfo: "
        f"{ts_inline_literal(inherit_source_skill_cast_info)},",
    ])
    if source is not None:
        lines.append(f"  source: {ts_inline_literal(source)},")
    if count.blackboardKey is not None or count.value != 1:
        lines.append(f"  count: {compile_condition_operand(count, f'{path}.count')},")
    if blackboard_assignments:
        lines.append("  blackboardAssignments: {")
        for key, value in blackboard_assignments.items():
            lines.append(
                f"    {ts_inline_literal(key)}: "
                f"{compile_condition_operand(value, f'{path}.blackboardAssignments.{key}')},"
            )
        lines.append("  },")
    lines.append("})")
    return "\n".join(lines)


def compile_buff_application(
    action: AuxiliaryActionSource,
    path: str,
    *,
    root_skill_context: bool = True,
    context_application_target: Literal["enemy", "party"] | None = None,
    input_target: Literal["enemy"] | None = None,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> str:
    """编译根时间轴上已拆分为单 Buff 的 CreateBuffAction。"""
    if action.actionType != "CreateBuffAction" or action.count is None:
        raise ValueError(f"{path}: expected parsed CreateBuffAction")
    if action.buffSource is None or action.inheritSourceSkillCastInfo is None:
        raise ValueError(f"{path}: incomplete CreateBuffAction source facts")
    return compile_buff_application_values(
        buff_id=action.sourceId,
        blackboard_assignments=action.blackboardAssignments,
        target_source=action.targetSource,
        target_group_key=action.targetGroupKey,
        count=action.count,
        buff_source=action.buffSource,
        inherit_source_skill_cast_info=action.inheritSourceSkillCastInfo,
        root_skill_context=root_skill_context,
        context_application_target=context_application_target,
        input_target=input_target,
        target_finder_type=action.targetFinderType,
        target_validator_types=action.targetValidatorTypes,
        target_post_processor_types=action.targetPostProcessorTypes,
        buff_definitions=buff_definitions,
        path=path,
    )


def compile_timed_marker_application(
    payload: TimedMarkerApplicationPayload,
    path: str,
    *,
    root_skill_context: bool,
) -> str:
    """编译固定身份、普通战斗时间增量的原生定时标记创建。"""
    if payload.useTimeDilationDt:
        raise ValueError(f"{path}: time-dilated timed markers are not supported")
    if not (
        payload.targetSource == "Source"
        or (root_skill_context and payload.targetSource == "Owner")
    ) or payload.targetGroupKey:
        raise ValueError(
            f"{path}: unsupported timed marker target "
            f"{payload.targetSource!r}/{payload.targetGroupKey!r}"
        )
    return "\n".join(
        [
            "step('createTimedMarker', {",
            "  target: 'caster',",
            f"  markerId: {ts_inline_literal(payload.markerId)},",
            "  durationSeconds: "
            f"{compile_condition_operand(payload.duration, f'{path}.duration')},",
            "  autoFinishByAction: "
            f"{ts_inline_literal(payload.autoFinishByAction)},",
            "})",
        ]
    )


def compile_global_cooldown_application(
    payload: GlobalCooldownApplicationPayload,
    path: str,
    *,
    root_skill_context: bool,
) -> str:
    """将原生全局冷却写入映射到 Next 的角色定时标记。"""
    if not (
        payload.targetSource == "Source"
        or (root_skill_context and payload.targetSource == "Owner")
    ) or payload.targetGroupKey:
        raise ValueError(
            f"{path}: unsupported global cooldown target "
            f"{payload.targetSource!r}/{payload.targetGroupKey!r}"
        )
    return "\n".join(
        [
            "step('createTimedMarker', {",
            "  target: 'caster',",
            f"  markerId: {ts_inline_literal(payload.buffId)},",
            "  durationSeconds: "
            f"{compile_condition_operand(payload.duration, f'{path}.duration')},",
            "  autoFinishByAction: false,",
            "})",
        ]
    )


def compile_buff_stack_read(
    payload: BuffStackReadPayload,
    path: str,
    *,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    context_target_is_enemy: bool = False,
) -> str:
    """把原生 Buff 层数查询编译为动作黑板写入步骤。"""
    if payload.countType != "BuffCount":
        raise ValueError(f"{path}: unsupported Buff count type {payload.countType!r}")
    if payload.limitSkillCastId:
        raise ValueError(f"{path}: skill-cast-limited Buff count is not supported")
    target = resolve_fixed_combat_target(
        payload.targetSource,
        payload.targetGroupKey,
        action=action,
        target_group_writes=target_group_writes,
        root_skill_context=root_skill_context,
        input_target=input_target,
        context_target_is_enemy=context_target_is_enemy,
    )
    if target is None:
        raise ValueError(
            f"{path}: unsupported Buff target "
            f"{payload.targetSource!r}/{payload.targetGroupKey!r}"
        )
    if payload.buffCheckType == "Id" and payload.buffIds:
        query = "{ kind: 'id', buffIds: " + ts_inline_literal(payload.buffIds) + " }"
    elif payload.buffCheckType == "Tag" and payload.buffTagIds:
        query = (
            "{ kind: 'tag', tagQueryType: "
            f"{ts_inline_literal(payload.tagQueryType)}, buffTagIds: "
            f"{ts_inline_literal(payload.buffTagIds)} }}"
        )
    else:
        raise ValueError(f"{path}: unsupported or empty Buff lookup")
    return "\n".join(
        [
            "step('readBuffStackCount', {",
            f"  target: {ts_inline_literal(target)},",
            f"  outputKey: {ts_inline_literal(payload.outputKey)},",
            f"  query: {query},",
            "})",
        ]
    )


def compile_conditional_buff_application(
    payload: BuffApplicationPayload,
    path: str,
    ignored_buff_ids: frozenset[str],
    *,
    root_skill_context: bool = False,
    context_application_target: Literal["enemy", "party"] | None = None,
    input_target: Literal["enemy"] | None = None,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> str:
    """保持原生 Buff 数组顺序编译条件分支内的一次创建动作。"""
    has_dynamic_count = payload.count.blackboardKey is not None or payload.count.value != 1
    if has_dynamic_count and len(payload.buffs) != 1:
        raise ValueError(
            f"{path}: repeated multi-Buff application requires a grouped repeat sequence"
        )
    compiled = [
        compile_buff_application_values(
            buff_id=buff.buffId,
            blackboard_assignments=buff.blackboardAssignments,
            target_source=payload.targetSource,
            target_group_key=payload.targetGroupKey,
            count=payload.count,
            buff_source=payload.buffSource,
            inherit_source_skill_cast_info=payload.inheritSourceSkillCastInfo,
            root_skill_context=root_skill_context,
            context_application_target=context_application_target,
            input_target=input_target,
            path=f"{path}.buffs[{index}]",
            allow_dynamic_count=has_dynamic_count,
            target_finder_type=payload.targetFinderType,
            target_validator_types=payload.targetValidatorTypes,
            target_post_processor_types=payload.targetPostProcessorTypes,
            buff_definitions=buff_definitions,
        )
        for index, buff in enumerate(payload.buffs)
        if buff.buffId not in ignored_buff_ids
    ]
    if not compiled:
        return "sequence()"
    if len(compiled) == 1:
        return compiled[0]
    lines = ["sequence("]
    for source in compiled:
        item_lines = indent_source(source, 2)
        item_lines[-1] += ","
        lines.extend(item_lines)
    lines.append(")")
    return "\n".join(lines)


def projectile_children_are_immediate(
    triggered_skills: tuple[ProjectileTriggeredSkillSource, ...],
) -> bool:
    """确认投射物命中子技能无需跨帧调度或递归展开。"""
    if len(triggered_skills) != 1:
        return False
    hit = triggered_skills[0]
    required_fields = (
        "assumedTravelFrames",
        "cycleTruncated",
        "conditionalActions",
        "auxiliaryActions",
        "resourceGains",
        "nestedProjectileTriggeredSkills",
        "abilityEntityHits",
        "directDamageHits",
        "inflictions",
        "combatActions",
    )
    if any(not hasattr(hit, field) for field in required_fields):
        return False
    if (
        hit.assumedTravelFrames != 0
        or hit.cycleTruncated
        or hit.conditionalActions
        or hit.auxiliaryActions
        or hit.resourceGains
        or hit.nestedProjectileTriggeredSkills
        or hit.abilityEntityHits
        or any(damage.startFrame != 0 for damage in hit.directDamageHits)
        or any(infliction.startFrame != 0 for infliction in hit.inflictions)
    ):
        return False
    expected_actions = {
        *({"DamageAction"} if hit.directDamageHits else set()),
        *({"SpellInfliction"} if hit.inflictions else set()),
    }
    return bool(expected_actions) and set(hit.combatActions) == expected_actions


def compile_immediate_projectile_children(
    triggered_skills: tuple[ProjectileTriggeredSkillSource, ...],
    damage_tags: tuple[str, ...],
    runtime_blackboard_keys: frozenset[str],
    path: str,
    *,
    step_key_prefix: str | None = None,
    source_path: tuple[str, ...] = (),
    source_order: tuple[int, ...] = (),
) -> str | None:
    """编译命中帧同步完成的投射物子技能；延迟、递归与实体生成继续留给调度层。"""

    if not projectile_children_are_immediate(triggered_skills):
        return None
    hit = triggered_skills[0]

    ordered_steps: list[tuple[int, str]] = []
    for index, damage in enumerate(hit.directDamageHits):
        step_key: str | None = None
        if step_key_prefix is not None:
            step_key = encode_damage_step_key(
                step_key_prefix,
                "conditional",
                (*source_path, hit.triggerSkillId),
                (*source_order, damage.actionIndex),
            )
        compiled = "\n".join(
            compile_damage_units_step(
                damage.damageUnits,
                damage_tags,
                f"{path}.triggeredSkills[0].directDamageHits[{index}]",
                runtime_blackboard_keys,
                step_key,
            )
        )
        ordered_steps.append((damage.actionIndex, compiled))
    ordered_steps.extend(
        (infliction.actionIndex, compile_infliction(infliction))
        for infliction in hit.inflictions
    )
    lines = ["sequence("]
    for _, source in sorted(ordered_steps, key=lambda item: item[0]):
        item_lines = indent_source(source, 2)
        item_lines[-1] += ","
        lines.extend(item_lines)
    lines.append(")")
    return "\n".join(lines)


def compile_conditional_branch_action(
    action: ConditionalBranchActionSource,
    path: str,
    ignored_buff_ids: frozenset[str] = frozenset(),
    damage_tags: tuple[str, ...] = (),
    runtime_blackboard_keys: frozenset[str] = frozenset(),
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    projected_ability_entity_spawns: tuple[AbilityEntitySpawnPayload, ...] = (),
    projected_projectile_launches: tuple[ConditionalProjectileProjection, ...] = (),
    context_action: ConditionalActionSource | None = None,
    step_key_prefix: str | None = None,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> str:
    """编译一个条件分支叶子；未闭环动作必须在这里显式拒绝。"""
    if action.actionType in {
        "ContinuousFindTargetAction",
        "FindTargetAction",
        "MergeTargetAction",
    }:
        # 目标组生产者只为后续 Context 身份溯源服务，不是独立战斗效果。
        return "sequence()"
    if getattr(action, "nestedCondition", None) is not None:
        return compile_conditional_action(
            action.nestedCondition,
            f"{path}.nestedCondition",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            step_key_prefix=step_key_prefix,
            buff_definitions=buff_definitions,
        )
    once_actions = getattr(action, "onceActions", None)
    if once_actions is not None:
        once_scope_key = getattr(action, "onceScopeKey", None)
        if once_scope_key is None:
            raise ValueError(f"{path}: DoOnceAction has no scope key")
        body = compile_conditional_branch(
            once_actions,
            f"{path}.onceActions",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            projected_ability_entity_spawns=projected_ability_entity_spawns,
            projected_projectile_launches=projected_projectile_launches,
            context_action=context_action,
            step_key_prefix=step_key_prefix,
            buff_definitions=buff_definitions,
        )
        body_lines = indent_source(body, 2)
        body_lines[-1] += ","
        return "\n".join(
            [
                "once(",
                f"  {ts_inline_literal(once_scope_key)},",
                *body_lines,
                ")",
            ]
        )
    ability_entity_spawn = getattr(action, "abilityEntitySpawn", None)
    if ability_entity_spawn is not None:
        if ability_entity_spawn in projected_ability_entity_spawns:
            return "sequence()"
        raise ValueError(f"{path}: unsupported conditional leaf {action.actionType!r}")
    projectile_launch = getattr(action, "projectileLaunch", None)
    if projectile_launch is not None:
        projection = ConditionalProjectileProjection(
            projectile_launch,
            getattr(action, "projectileTriggeredSkills", None) or (),
        )
        if contains_equivalent_projectile_projection(
            projected_projectile_launches, projection
        ):
            return "sequence()"
        compiled = compile_immediate_projectile_children(
            projection.triggeredSkills,
            damage_tags,
            runtime_blackboard_keys,
            path,
            step_key_prefix=step_key_prefix,
            source_path=action.actionPath,
            source_order=(getattr(action, "serverActionIndex", None) or action.actionIndex,),
        )
        if compiled is not None:
            return compiled
        raise ValueError(f"{path}: unsupported conditional leaf {action.actionType!r}")
    if getattr(action, "damageUnits", None) is not None:
        step_key: str | None = None
        if step_key_prefix is not None:
            step_key = encode_damage_step_key(
                step_key_prefix,
                "conditional",
                action.actionPath,
                (getattr(action, "serverActionIndex", None) or action.actionIndex,),
            )
        return "\n".join(
            compile_damage_units_step(
                action.damageUnits,
                damage_tags,
                path,
                runtime_blackboard_keys,
                step_key,
            )
        )
    if getattr(action, "keywordAction", None) is not None:
        return compile_keyword_action(
            action.keywordAction,
            path,
            root_skill_context=root_skill_context,
            input_target=input_target,
            context_action=context_action,
            target_group_writes=target_group_writes,
        )
    if getattr(action, "buffBlackboardRead", None) is not None:
        buff_read = action.buffBlackboardRead
        context_target_is_enemy = False
        if (
            buff_read.targetSource == "Context"
            and buff_read.targetGroupKey != "smart_target"
            and context_action is not None
        ):
            write = resolve_latest_target_group_write_at(
                read_frame=context_action.startFrame,
                read_action_index=(
                    getattr(action, "serverActionIndex", None)
                    if getattr(action, "serverActionIndex", None) is not None
                    else context_action.actionIndex
                ),
                read_action_path=(
                    getattr(action, "actionPath", ()) or context_action.actionPath
                ),
                target_group_key=buff_read.targetGroupKey,
                writes=target_group_writes,
            )
            context_target_is_enemy = (
                write is not None
                and target_group_write_guarantees_single_enemy(write)
            )
        return compile_buff_blackboard_read(
            buff_read,
            path,
            root_skill_context=root_skill_context,
            input_target=input_target,
            context_target_is_enemy=context_target_is_enemy,
        )
    if getattr(action, "buffFinish", None) is not None:
        return compile_buff_finish(
            action.buffFinish,
            path,
            action=context_action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
    if getattr(action, "buffStackRead", None) is not None:
        return compile_buff_stack_read(
            action.buffStackRead,
            path,
            action=context_action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
    if getattr(action, "buffApplication", None) is not None:
        buff_application = action.buffApplication
        context_application_target = None
        if (
            buff_application.targetSource == "Context"
            and context_action is not None
        ):
            write = resolve_latest_target_group_write_at(
                read_frame=context_action.startFrame,
                read_action_index=(
                    getattr(action, "serverActionIndex", None)
                    if getattr(action, "serverActionIndex", None) is not None
                    else context_action.actionIndex
                ),
                read_action_path=(
                    getattr(action, "actionPath", ()) or context_action.actionPath
                ),
                target_group_key=buff_application.targetGroupKey,
                writes=target_group_writes,
            )
            context_application_target = target_group_write_buff_application_target(write)
        return compile_conditional_buff_application(
            buff_application,
            path,
            ignored_buff_ids,
            root_skill_context=root_skill_context,
            context_application_target=context_application_target,
            input_target=input_target,
        )
    if getattr(action, "timedMarkerApplication", None) is not None:
        return compile_timed_marker_application(
            action.timedMarkerApplication,
            path,
            root_skill_context=root_skill_context,
        )
    if getattr(action, "globalCooldownApplication", None) is not None:
        return compile_global_cooldown_application(
            action.globalCooldownApplication,
            path,
            root_skill_context=root_skill_context,
        )
    if getattr(action, "blackboardMutation", None) is not None:
        return compile_blackboard_mutation(action.blackboardMutation, path)
    if getattr(action, "blackboardCalculation", None) is not None:
        return compile_blackboard_calculation(action.blackboardCalculation, path)
    if getattr(action, "resourceGain", None) is not None:
        return compile_resource_gain(action.resourceGain, path)
    infliction = getattr(action, "infliction", None)
    if infliction is not None:
        return (
            "step('applyElementalInfliction', { element: "
            f"{ts_inline_literal(infliction.element)}, isExtra: "
            f"{ts_inline_literal(infliction.isExtra)} }})"
        )
    raise ValueError(f"{path}: unsupported conditional leaf {action.actionType!r}")


def compile_conditional_branch(
    actions: tuple[ConditionalBranchActionSource, ...],
    path: str,
    ignored_buff_ids: frozenset[str] = frozenset(),
    damage_tags: tuple[str, ...] = (),
    runtime_blackboard_keys: frozenset[str] = frozenset(),
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    projected_ability_entity_spawns: tuple[AbilityEntitySpawnPayload, ...] = (),
    projected_projectile_launches: tuple[ConditionalProjectileProjection, ...] = (),
    context_action: ConditionalActionSource | None = None,
    step_key_prefix: str | None = None,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> str:
    """按原始数组顺序生成一个同步 action sequence。"""
    if not actions:
        return "sequence()"
    lines = ["sequence("]
    compiled_count = 0
    for index, action in enumerate(actions):
        compiled = compile_conditional_branch_action(
            action,
            f"{path}[{index}]",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            projected_ability_entity_spawns=projected_ability_entity_spawns,
            projected_projectile_launches=projected_projectile_launches,
            context_action=context_action,
            step_key_prefix=step_key_prefix,
            buff_definitions=buff_definitions,
        )
        if compiled == "sequence()":
            continue
        compiled_count += 1
        action_lines = indent_source(compiled, 2)
        action_lines[-1] += ","
        lines.extend(action_lines)
    if compiled_count == 0:
        return "sequence()"
    lines.append(")")
    return "\n".join(lines)


PRESENTATION_CAMERA_BLACKBOARD_KEYS = frozenset({"isWall", "camera_blocked"})


def is_presentation_only_camera_condition(action: ConditionalActionSource) -> bool:
    """确认条件树只传递已审计的镜头状态，不把镜头条件伪装成战斗条件。"""

    if not any(
        condition.sourceType == "CheckSkillCameraMotionFree"
        for condition in action.conditions
    ):
        return False

    for branch_action in (*action.succeedActions, *action.failActions):
        mutation = branch_action.blackboardMutation
        if (
            mutation is None
            or mutation.key not in PRESENTATION_CAMERA_BLACKBOARD_KEYS
            or mutation.operation != "Assign"
            or mutation.value.value != 1
            or mutation.value.blackboardKey is not None
            or mutation.value.levelValues is not None
        ):
            return False
    return True


def compile_conditional_action(
    action: ConditionalActionSource,
    path: str,
    ignored_buff_ids: frozenset[str] = frozenset(),
    damage_tags: tuple[str, ...] = (),
    runtime_blackboard_keys: frozenset[str] = frozenset(),
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    skill_has_output_damage: bool = False,
    step_key_prefix: str | None = None,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> str:
    """把递归审计树编译为正式 `branch(condition, sequence...)` DSL。"""
    if isinstance(action, DoOnceActionSource):
        body = compile_conditional_branch(
            action.succeedActions,
            f"{path}.succeedActions",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            projected_ability_entity_spawns=action.projectedAbilityEntitySpawns,
            projected_projectile_launches=action.projectedProjectileLaunches,
            context_action=action,
            step_key_prefix=step_key_prefix,
            buff_definitions=buff_definitions,
        )
        if body == "sequence()":
            return body
        body_lines = indent_source(body, 2)
        body_lines[-1] += ","
        return "\n".join(
            [
                "once(",
                f"  {ts_inline_literal(action.onceScopeKey)},",
                *body_lines,
                ")",
            ]
        )
    if isinstance(action, UnconditionalActionSource):
        return compile_conditional_branch(
            action.succeedActions,
            f"{path}.succeedActions",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            projected_ability_entity_spawns=action.projectedAbilityEntitySpawns,
            projected_projectile_launches=action.projectedProjectileLaunches,
            context_action=action,
            step_key_prefix=step_key_prefix,
            buff_definitions=buff_definitions,
        )
    if is_presentation_only_camera_condition(action):
        return "sequence()"
    projected_ability_entity_spawns = getattr(
        action, "projectedAbilityEntitySpawns", ()
    )
    projected_projectile_launches = getattr(action, "projectedProjectileLaunches", ())
    condition = compile_combat_condition_group(
        action.conditions,
        f"{path}.conditions",
        action,
        target_group_writes,
        root_skill_context,
        input_target,
        skill_has_output_damage,
    )
    succeed = compile_conditional_branch(
        action.succeedActions,
        f"{path}.succeedActions",
        ignored_buff_ids,
        damage_tags,
        runtime_blackboard_keys,
        target_group_writes=target_group_writes,
        root_skill_context=root_skill_context,
        input_target=input_target,
        projected_ability_entity_spawns=projected_ability_entity_spawns,
        projected_projectile_launches=projected_projectile_launches,
        context_action=action,
        step_key_prefix=step_key_prefix,
        buff_definitions=buff_definitions,
    )
    fail = (
        compile_conditional_branch(
            action.failActions,
            f"{path}.failActions",
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            projected_ability_entity_spawns=projected_ability_entity_spawns,
            projected_projectile_launches=projected_projectile_launches,
            context_action=action,
            step_key_prefix=step_key_prefix,
            buff_definitions=buff_definitions,
        )
        if action.failActions
        else None
    )
    if succeed == "sequence()" and (fail is None or fail == "sequence()"):
        return "sequence()"
    lines = ["branch("]
    condition_lines = indent_source(condition, 2)
    condition_lines[-1] += ","
    lines.extend(condition_lines)
    succeed_lines = indent_source(succeed, 2)
    succeed_lines[-1] += ","
    lines.extend(succeed_lines)
    if fail is not None:
        fail_lines = indent_source(fail, 2)
        fail_lines[-1] += ","
        lines.extend(fail_lines)
    lines.append(")")
    return "\n".join(lines)


def target_group_branch_scopes(path: tuple[str, ...]) -> tuple[tuple[str, ...], ...]:
    """返回动作所在的条件分支作用域；分支内写入不能解释分支外读取。"""
    return tuple(
        path[: index + 1]
        for index, segment in enumerate(path)
        if segment in {"succeedActions", "failActions"}
    )


def resolve_latest_target_group_write_at(
    *,
    read_frame: int,
    read_action_index: int,
    read_action_path: tuple[str, ...],
    target_group_key: str,
    writes: tuple[TargetGroupWriteSource, ...],
    control_flow_actions: tuple[ConditionalActionSource, ...] = (),
    root_skill_context: bool = False,
) -> TargetGroupWriteSource | None:
    """选择读取点之前、且其分支作用域支配读取点的最后一次目标组写入。"""
    candidates: list[TargetGroupWriteSource] = []
    for write in writes:
        if write.targetGroupKey != target_group_key:
            continue
        if not (
            write.startFrame < read_frame
            or (
                write.startFrame == read_frame
                and write.actionIndex < read_action_index
            )
        ):
            continue
        if any(
            read_action_path[: len(scope)] != scope
            and not target_group_branch_is_guaranteed(
                scope,
                control_flow_actions,
                writes,
                root_skill_context=root_skill_context,
            )
            for scope in target_group_branch_scopes(write.actionPath)
        ):
            continue
        candidates.append(write)
    if not candidates:
        return None
    latest_order = max((write.startFrame, write.actionIndex) for write in candidates)
    latest = [
        write
        for write in candidates
        if (write.startFrame, write.actionIndex) == latest_order
    ]
    if len(latest) != 1:
        raise ValueError(
            f"{'.'.join(read_action_path) or '<root>'}: ambiguous writes for target group "
            f"{target_group_key!r} at {latest_order}"
        )
    return latest[0]


def resolve_latest_target_group_write(
    action: ConditionalActionSource,
    target_group_key: str,
    writes: tuple[TargetGroupWriteSource, ...],
    control_flow_actions: tuple[ConditionalActionSource, ...] = (),
    root_skill_context: bool = False,
) -> TargetGroupWriteSource | None:
    """按条件读取点解析最近的支配写入。"""
    return resolve_latest_target_group_write_at(
        read_frame=action.startFrame,
        read_action_index=action.actionIndex,
        read_action_path=action.actionPath,
        target_group_key=target_group_key,
        writes=writes,
        control_flow_actions=control_flow_actions,
        root_skill_context=root_skill_context,
    )


def iter_conditional_actions(
    actions: tuple[ConditionalActionSource, ...],
) -> Iterator[ConditionalActionSource]:
    """遍历保留下来的条件树，供控制流来源证明复用。"""
    for action in actions:
        yield action
        for branch_action in (*action.succeedActions, *action.failActions):
            if branch_action.nestedCondition is not None:
                yield from iter_conditional_actions((branch_action.nestedCondition,))
            if branch_action.onceActions is not None:
                yield from iter_branch_conditional_actions(branch_action.onceActions)


def iter_branch_conditional_actions(
    actions: tuple[ConditionalBranchActionSource, ...],
) -> Iterator[ConditionalActionSource]:
    """遍历 DoOnce 等分支容器中的条件节点。"""
    for action in actions:
        if action.nestedCondition is not None:
            yield from iter_conditional_actions((action.nestedCondition,))
        if action.onceActions is not None:
            yield from iter_branch_conditional_actions(action.onceActions)


def evaluate_fixed_model_condition_group(
    action: ConditionalActionSource,
    writes: tuple[TargetGroupWriteSource, ...],
    *,
    root_skill_context: bool,
) -> bool | None:
    """只折叠在固定单敌人、零距离模型下可严格判定的条件组。"""
    results: list[bool] = []
    for condition in action.conditions:
        if is_guaranteed_single_enemy_condition(
            condition,
            action=action,
            target_group_writes=writes,
        ):
            results.append(True)
            continue
        if (
            condition.sourceType == "CheckDistanceCondition"
            and condition.distance is not None
        ):
            result = evaluate_zero_distance_condition(
                condition.distance,
                root_skill_context=root_skill_context,
            )
            if result is not None:
                results.append(result)
                continue
        return None
    return all(results) if results else None


def target_group_branch_is_guaranteed(
    scope: tuple[str, ...],
    control_flow_actions: tuple[ConditionalActionSource, ...],
    writes: tuple[TargetGroupWriteSource, ...],
    *,
    root_skill_context: bool,
) -> bool:
    """判断分支是否是固定模型下唯一会执行的路径。"""
    branch_name = scope[-1]
    owner_path = scope[:-1]
    owners = [
        action
        for action in iter_conditional_actions(control_flow_actions)
        if action.actionPath == owner_path
    ]
    if len(owners) != 1:
        return False
    result = evaluate_fixed_model_condition_group(
        owners[0],
        writes,
        root_skill_context=root_skill_context,
    )
    return result is not None and result == (branch_name == "succeedActions")


def target_group_write_guarantees_single_enemy(write: TargetGroupWriteSource) -> bool:
    """只接受已能在固定单敌人模型下闭环的目标查找形状。"""
    if write.validatorTypes or any(
        processor != "PriorityFilter" for processor in write.postProcessorTypes
    ):
        return False
    if write.finderType == "MainTargetFinder":
        return True
    if write.producerType == "MergeTargetAction" and len(write.inputTargets) == 1:
        source = write.inputTargets[0]
        if (
            source.validatorTypes
            or source.postProcessorTypes
            or source.finderType is not None
        ):
            return False
        return (
            source.targetSource == "MainTarget"
            or (
                source.targetSource == "Context"
                and source.targetGroupKey == "smart_target"
            )
        )
    return (
        write.producerType in {"FindTargetAction", "ContinuousFindTargetAction"}
        and write.finderType == "HitBoxFinder"
        and write.finderFactionTarget == "Anti"
        and write.finderTargetObjectType == "Normal"
        and write.finderCheckAlive is True
    )


def target_group_write_buff_application_target(
    write: TargetGroupWriteSource | None,
) -> Literal["enemy", "party"] | None:
    """把已闭环的目标组写入归约为 Buff 施加支持的单体或集合目标。"""
    if write is None:
        return None
    if target_group_write_guarantees_single_enemy(write):
        return "enemy"
    if (
        not write.validatorTypes
        and not write.postProcessorTypes
        and write.producerType in {"FindTargetAction", "ContinuousFindTargetAction"}
        and write.finderType == "CharacterTeamFinder"
    ):
        return "party"
    return None


def target_reference_has_plain_selector(reference: TargetReferenceSource) -> bool:
    """目标引用未附带会改变身份或位置的选择器配置。"""
    if (
        reference.selectorOwner != "ActionOwner"
        or reference.ownerContextKey
        or reference.centerType != "ActionSource"
        or reference.centerContextKey
        or reference.centerToGround
        or reference.target != "ActionSource"
        or reference.targetContextKey
        or reference.enableAdvancedDirection
        or reference.selectorDirection != "SourceForward"
        or reference.validatorTypes
        or reference.postProcessorTypes
    ):
        return False
    return True


def target_reference_is_plain(reference: TargetReferenceSource) -> bool:
    """目标引用既没有命名目标组，也没有会改变身份或位置的选择器配置。"""
    return not reference.targetGroupKey and target_reference_has_plain_selector(reference)


def target_identity_reference_guarantees_single_enemy(
    reference: TargetReferenceSource,
) -> bool:
    """仅接受不带筛选或重定向、且必然指向唯一敌人的目标引用。"""
    if not target_reference_is_plain(reference):
        return False
    return (
        reference.targetSource in {"Target", "MainTarget"}
        and reference.finderType is None
    ) or (
        reference.targetSource == "InstantSearch"
        and reference.finderType == "MainTargetFinder"
    )


def zero_distance_target_role(reference: TargetReferenceSource) -> str | None:
    """把根干员技能中的普通目标引用归类为共点的施法者或唯一敌人。"""
    if not target_reference_has_plain_selector(reference):
        return None
    if (
        reference.targetSource == "Context"
        and reference.targetGroupKey == "smart_target"
        and reference.finderType is None
    ):
        return "enemy"
    if reference.targetGroupKey:
        return None
    if (
        reference.targetSource in {"MainCharacter", "Owner", "Source"}
        and reference.finderType is None
    ):
        return "caster"
    if target_identity_reference_guarantees_single_enemy(reference):
        return "enemy"
    return None


def evaluate_zero_distance_condition(
    condition: DistanceConditionSource,
    *,
    root_skill_context: bool,
) -> bool | None:
    """仅在根干员技能的施法者与唯一敌人共点假设下折叠距离比较。"""
    if not root_skill_context or condition.distance < 0:
        return None
    roles = {
        zero_distance_target_role(condition.source),
        zero_distance_target_role(condition.target),
    }
    if None in roles or roles != {"caster", "enemy"}:
        return None
    # 原生 lessThan 分支实际使用 <=；半径只会把共点距离进一步减小。
    return condition.lessThan


def is_guaranteed_single_enemy_condition(
    condition: ConditionSource,
    *,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
) -> bool:
    """识别在 Endaxis 固定单个有效敌人模型下恒真的目标数量条件。"""
    identity = getattr(condition, "targetIdentity", None)
    if condition.sourceType == "CheckTargetsEqual" and identity is not None:
        return target_identity_reference_guarantees_single_enemy(
            identity.first
        ) and target_identity_reference_guarantees_single_enemy(identity.second)

    entity = getattr(condition, "entityCount", None)
    return (
        condition.sourceType == "CheckEntityNum"
        and entity is not None
        and entity.minimumCount == 1
        and entity.comparison == "GE"
        and not entity.storeKey
        and (
            # TargetSource.Target 直接读取技能输入目标，targetGroupKey 对该来源无效。
            entity.targetSource == "Target"
            or (
                entity.targetSource == "Context"
                and entity.targetGroupKey == "smart_target"
                and not entity.containsHittableTarget
            )
            or (
                entity.targetSource == "Context"
                and not entity.containsHittableTarget
                and action is not None
                and (
                    write := resolve_latest_target_group_write(
                        action, entity.targetGroupKey, target_group_writes
                    )
                )
                is not None
                and target_group_write_guarantees_single_enemy(write)
            )
        )
    )


def collect_compilable_conditional_action_types(
    actions: tuple[ConditionalActionSource, ...],
) -> set[str]:
    """返回条件树中已由 DSL 编译器完整消费的原生动作类型。"""
    result: set[str] = set()

    def visit_branch_actions(
        branch_actions: tuple[ConditionalBranchActionSource, ...],
        projected_spawns: tuple[AbilityEntitySpawnPayload, ...],
        projected_launches: tuple[ConditionalProjectileProjection, ...],
    ) -> None:
        for branch_action in branch_actions:
            if getattr(branch_action, "onceActions", None) is not None:
                result.add("DoOnceAction")
                visit_branch_actions(
                    branch_action.onceActions,
                    projected_spawns,
                    projected_launches,
                )
            if getattr(branch_action, "nestedCondition", None) is not None:
                visit(branch_action.nestedCondition)
            if getattr(branch_action, "buffBlackboardRead", None) is not None:
                result.add("GetTargetBuffBBAdvanced")
            if getattr(branch_action, "buffFinish", None) is not None:
                result.add("FinishBuffAdvanced")
            if getattr(branch_action, "buffStackRead", None) is not None:
                result.add("SaveBuffStackNumAdvanced")
            if getattr(branch_action, "buffApplication", None) is not None:
                result.add("CreateBuffAction")
            if getattr(branch_action, "timedMarkerApplication", None) is not None:
                result.add("CreateTimedMarker")
            if getattr(branch_action, "globalCooldownApplication", None) is not None:
                result.add("AddGlobalCDTimer")
            if getattr(branch_action, "blackboardMutation", None) is not None:
                result.add("ModifyDynamicBlackboard")
            if getattr(branch_action, "blackboardCalculation", None) is not None:
                result.add("SimpleCalcBBAction")
            if getattr(branch_action, "resourceGain", None) is not None:
                result.add("ObtainCostAction")
            if getattr(branch_action, "infliction", None) is not None:
                result.add("SpellInfliction")
            if getattr(branch_action, "damageUnits", None) is not None:
                result.add("DamageAction")
            if getattr(branch_action, "keywordAction", None) is not None:
                result.add("SlowAction")
            if getattr(branch_action, "abilityEntitySpawn", None) in projected_spawns:
                result.add("SpawnAbilityEntity")
            projectile_launch = getattr(branch_action, "projectileLaunch", None)
            if projectile_launch is not None and contains_equivalent_projectile_projection(
                projected_launches,
                ConditionalProjectileProjection(
                    projectile_launch,
                    getattr(branch_action, "projectileTriggeredSkills", None) or (),
                ),
            ):
                result.add("LaunchProjectile")
            elif projectile_launch is not None and projectile_children_are_immediate(
                getattr(branch_action, "projectileTriggeredSkills", None) or ()
            ):
                result.add("LaunchProjectile")

    def visit(action: ConditionalActionSource) -> None:
        if isinstance(action, DoOnceActionSource):
            result.add("DoOnceAction")
        elif isinstance(action, (UnconditionalActionSource, SequenceGuardActionSource)):
            pass
        else:
            result.add(
                "SwitchAction" if isinstance(action, SwitchActionSource) else "IfElseAction"
            )
        result.update(condition.sourceType for condition in action.conditions)
        projected_spawns = getattr(action, "projectedAbilityEntitySpawns", ())
        projected_launches = getattr(action, "projectedProjectileLaunches", ())
        visit_branch_actions(
            (*action.succeedActions, *action.failActions),
            projected_spawns,
            projected_launches,
        )

    for action in actions:
        visit(action)
    return result


def collect_runtime_blackboard_output_keys(skill: SkillSource) -> frozenset[str]:
    """收集会在本次技能执行中被动作写入的键；仅这些键必须延迟到运行时求值。"""
    result = {item.key for item in skill.blackboardCalculations}
    result.update(item.key for item in skill.blackboardMutations)
    result.update(item.outputKey for item in skill.buffBlackboardReads)

    def visit_conditions(actions: tuple[ConditionalActionSource, ...]) -> None:
        for condition in actions:
            for action in (*condition.succeedActions, *condition.failActions):
                calculation = getattr(action, "blackboardCalculation", None)
                mutation = getattr(action, "blackboardMutation", None)
                buff_read = getattr(action, "buffBlackboardRead", None)
                stack_read = getattr(action, "buffStackRead", None)
                nested = getattr(action, "nestedCondition", None)
                if calculation is not None:
                    result.add(calculation.key)
                if mutation is not None:
                    result.add(mutation.key)
                if buff_read is not None:
                    result.add(buff_read.outputKey)
                if stack_read is not None:
                    result.add(stack_read.outputKey)
                if nested is not None:
                    visit_conditions((nested,))
                if getattr(action, "onceActions", None) is not None:
                    visit_branch_actions(action.onceActions)

    def visit_branch_actions(
        actions: tuple[ConditionalBranchActionSource, ...],
    ) -> None:
        for action in actions:
            calculation = action.blackboardCalculation
            mutation = action.blackboardMutation
            buff_read = action.buffBlackboardRead
            stack_read = action.buffStackRead
            if calculation is not None:
                result.add(calculation.key)
            if mutation is not None:
                result.add(mutation.key)
            if buff_read is not None:
                result.add(buff_read.outputKey)
            if stack_read is not None:
                result.add(stack_read.outputKey)
            if action.nestedCondition is not None:
                visit_conditions((action.nestedCondition,))
            if getattr(action, "onceActions", None) is not None:
                visit_branch_actions(action.onceActions)

    def visit_entities(entities: tuple[AbilityEntityHitSource, ...]) -> None:
        for entity in entities:
            result.update(item.key for item in getattr(entity, "blackboardCalculations", ()))
            result.update(item.key for item in getattr(entity, "blackboardMutations", ()))
            result.update(item.outputKey for item in getattr(entity, "buffBlackboardReads", ()))
            visit_conditions(getattr(entity, "conditionalActions", ()))
            visit_projectiles(getattr(entity, "projectileTriggeredSkills", ()))
            visit_entities(getattr(entity, "nestedAbilityEntityHits", ()))

    def visit_projectiles(
        projectiles: tuple[ProjectileTriggeredSkillSource, ...],
    ) -> None:
        for projectile in projectiles:
            visit_conditions(projectile.conditionalActions)
            visit_entities(projectile.abilityEntityHits)
            visit_projectiles(projectile.nestedProjectileTriggeredSkills)

    visit_conditions(skill.conditionalActions)
    visit_projectiles(skill.projectileTriggeredSkills)
    visit_entities(skill.abilityEntityHits)
    return frozenset(result)


def compile_basic_attack(skill: SkillSource, config: dict[str, Any], factory_name: str) -> str:
    if skill.timeDilations:
        raise ValueError(f"{skill.key}: basic-attack factory cannot carry time dilation")
    if skill.unresolvedCombatActions != ("LaunchProjectile",):
        raise ValueError(
            f"{skill.key}: basic attack compiler expected only LaunchProjectile, got {skill.unresolvedCombatActions}"
        )
    if not skill.projectileTriggeredSkills:
        raise ValueError(f"{skill.key}: basic attack has no projectile hits")
    hit_frames: list[int] = []
    attack_scale: tuple[float, ...] | None = None
    stagger: tuple[float, ...] | None = None
    damage_type: str | None = None
    for index, hit in enumerate(skill.projectileTriggeredSkills):
        if hit.cycleTruncated or hit.nestedProjectileTriggeredSkills:
            raise ValueError(f"{skill.key}.projectileTriggeredSkills[{index}]: recursive projectile is not supported")
        hp_units = [unit for unit in hit.damageUnits if unit.attributeType == "Hp"]
        poise_units = [unit for unit in hit.damageUnits if unit.attributeType == "Poise"]
        unknown_units = [unit for unit in hit.damageUnits if unit.attributeType not in {"Hp", "Poise"}]
        if len(hp_units) != 1 or len(poise_units) > 1 or unknown_units:
            raise ValueError(f"{skill.key}.projectileTriggeredSkills[{index}]: unsupported DamageUnit layout")
        hp = hp_units[0]
        mapped_type = DAMAGE_TYPE_MAP.get(hp.damageType)
        if mapped_type is None:
            raise ValueError(f"{skill.key}: unsupported damage type {hp.damageType}")
        current_scale = require_level_values(hp.attackScale, f"{skill.key}.projectileTriggeredSkills[{index}].attackScale")
        current_stagger = (
            require_level_values(poise_units[0].poiseValue, f"{skill.key}.projectileTriggeredSkills[{index}].poise")
            if poise_units and poise_units[0].poiseValue
            else None
        )
        if damage_type is not None and damage_type != mapped_type:
            raise ValueError(f"{skill.key}: projectile hits use different damage types")
        if attack_scale is not None and attack_scale != current_scale:
            raise ValueError(f"{skill.key}: projectile hits use different attack scales")
        if stagger is not None and stagger != current_stagger:
            raise ValueError(f"{skill.key}: projectile hits use different stagger values")
        damage_type = mapped_type
        attack_scale = current_scale
        stagger = current_stagger
        hit_frames.append(hit.launchFrame + hit.assumedTravelFrames)
    if damage_type is None or attack_scale is None:
        raise ValueError(f"{skill.key}: incomplete damage source")
    options: dict[str, Any] = {}
    if config.get("final") is True:
        options["final"] = True
    recovery_key = config.get("spRecoveryBlackboardKey")
    if recovery_key is not None:
        if not isinstance(recovery_key, str) or recovery_key not in skill.patch.blackboard:
            raise ValueError(f"{skill.key}: invalid spRecoveryBlackboardKey")
        options["spRecovery"] = compact_level_values(skill.patch.blackboard[recovery_key])
    if stagger is not None:
        options["stagger"] = compact_level_values(stagger)
    frames: int | list[int] = hit_frames[0] if len(hit_frames) == 1 else hit_frames
    arguments = [
        ts_inline_literal(skill.key),
        str(skill.timelineBlockFrames),
        ts_inline_literal(frames),
        compile_percentage_level_values(attack_scale),
    ]
    if options:
        arguments.append(ts_inline_literal(options))
    return "\n".join(
        [f"  {factory_name}(", *(f"    {argument}," for argument in arguments), "  ),"]
    )


def render_time_dilation_scheduled_entries(skill: SkillSource) -> list[str]:
    result: list[str] = []
    for index, action in enumerate(skill.timeDilations):
        step_lines = compile_time_dilation(action, f"{skill.key}.timeDilations[{index}]").splitlines()
        result.extend(
            [
                "      scheduled(",
                f"        {action.startFrame},",
                "        sequence(",
                *(f"          {line}," if line.endswith(")") else f"          {line}" for line in step_lines),
                "        ),",
                f"        {action.endFrame},",
                "      ),",
            ]
        )
    return result


def resolve_skill_cooldown_frames(
    skill: SkillSource, config: dict[str, Any]
) -> tuple[float, ...] | None:
    """从 SkillPatch 推导冷却；清单中的旧开关只用于校验，不能决定是否生成。"""
    explicit = config.get("usePatchCooldown")
    if explicit not in {None, True}:
        raise ValueError(f"{skill.key}.compile.usePatchCooldown: expected true")
    patch = getattr(skill, "patch", None)
    if patch is None:
        if explicit is True:
            raise ValueError(f"{skill.key}.compile.usePatchCooldown: source patch is missing")
        return None
    frames = tuple(round(value * 30, 8) for value in patch.cooldownSeconds)
    has_cooldown = any(frame != 0 for frame in frames)
    if explicit is True and not has_cooldown:
        raise ValueError(f"{skill.key}.compile.usePatchCooldown: source cooldown is zero")
    return frames if has_cooldown else None


def resolve_skill_cost_resource(skill: SkillSource, config: dict[str, Any]) -> str | None:
    """只按稳定技能类型和 SkillPatch 的非零费用推导运行时资源。"""
    explicit = config.get("costResource")
    if explicit is not None and (not isinstance(explicit, str) or not explicit):
        raise ValueError(f"{skill.key}.compile.costResource: expected non-empty string")
    patch = getattr(skill, "patch", None)
    if patch is None:
        if explicit is not None:
            raise ValueError(f"{skill.key}.compile.costResource: source patch is missing")
        return None
    if not any(value != 0 for value in patch.costValues):
        if explicit is not None:
            raise ValueError(f"{skill.key}.compile.costResource: source cost is zero")
        return None

    inferred = {
        "battleSkill": "sp",
        "ultimate": "ultimateEnergy",
    }.get(skill.skillType)
    if inferred is None:
        raise ValueError(
            f"{skill.key}: non-zero source cost cannot be inferred for skill type {skill.skillType!r}"
        )
    expected_cost_type = 1 if inferred == "sp" else 0
    source_cost_types = set(patch.costTypes)
    if source_cost_types != {expected_cost_type}:
        raise ValueError(
            f"{skill.key}: {inferred} cost expects patch cost type {expected_cost_type}, "
            f"got {sorted(source_cost_types)!r}"
        )
    if explicit is not None and explicit != inferred:
        raise ValueError(
            f"{skill.key}.compile.costResource: expected inferred resource {inferred!r}, "
            f"got {explicit!r}"
        )
    return inferred


def compile_direct_damage(skill: SkillSource, config: dict[str, Any]) -> str:
    if len(skill.directDamageHits) != 1:
        raise ValueError(f"{skill.key}: direct damage compiler requires exactly one non-projectile hit")
    non_presentation_projectiles = [
        hit
        for hit in skill.projectileTriggeredSkills
        if hit.cycleTruncated or hit.combatActions or hit.nestedProjectileTriggeredSkills
    ]
    if non_presentation_projectiles:
        raise ValueError(f"{skill.key}: projectile contains combat behavior and cannot be omitted")
    unclassified = [action.sourceId for action in skill.auxiliaryActions if action.classification is None]
    if unclassified:
        raise ValueError(f"{skill.key}: unclassified auxiliary actions: {unclassified}")
    expected_actions = {
        "DamageAction",
        *(action.actionType for action in skill.auxiliaryActions),
        *({"ObtainCostAction"} if skill.resourceGains else set()),
        *({"SpellInfliction"} if skill.inflictions else set()),
        *({"LaunchProjectile"} if skill.projectileTriggeredSkills else set()),
        *({"GetTargetBuffBBAdvanced"} if skill.buffBlackboardReads else set()),
    }
    if set(skill.unresolvedCombatActions) != expected_actions:
        raise ValueError(f"{skill.key}: unresolved combat actions are not fully accounted for")
    hit = skill.directDamageHits[0]
    hp_units = [unit for unit in hit.damageUnits if unit.attributeType == "Hp"]
    poise_units = [unit for unit in hit.damageUnits if unit.attributeType == "Poise"]
    if len(hp_units) != 1 or len(poise_units) > 1 or len(hp_units) + len(poise_units) != len(hit.damageUnits):
        raise ValueError(f"{skill.key}: unsupported direct DamageUnit layout")
    hp = hp_units[0]
    damage_type = DAMAGE_TYPE_MAP.get(hp.damageType)
    if damage_type is None:
        raise ValueError(f"{skill.key}: unsupported damage type {hp.damageType}")
    scale = compile_percentage_level_values(
        require_level_values(hp.attackScale, f"{skill.key}.attackScale")
    )
    damage_fields = [
        f"damageType: {ts_inline_literal(damage_type)}",
        f"attackScale: {scale}",
        f"tags: {ts_inline_literal(require_list(config.get('tags'), f'{skill.key}.compile.tags'))}",
    ]
    if hp.calculation != "standard":
        damage_fields.append(f"calculation: {ts_inline_literal(hp.calculation)}")
    if hp.calculationMultiplier is not None:
        damage_fields.append(
            "calculationMultiplier: "
            f"{ts_inline_literal(compact_level_values(resolved_scalar_values(hp.calculationMultiplier)))}"
        )
    if poise_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{skill.key}: Poise unit has no value")
        stagger = compact_level_values(require_level_values(poise, f"{skill.key}.stagger"))
        damage_fields.append(f"stagger: {ts_inline_literal(stagger)}")
    step_key = encode_damage_step_key(
        skill.key,
        "direct",
        (skill.skillId,),
        (hit.actionIndex,),
    )
    damage_step = "\n".join(
        [
            "step('dealDamage', {",
            *(f"  {field}," for field in damage_fields),
            f"}}, {ts_inline_literal(step_key)})",
        ]
    )
    ordered_steps: list[tuple[float, str]] = [(hit.actionIndex, damage_step)]
    for index, read in enumerate(skill.buffBlackboardReads):
        if read.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: buff blackboard read and damage occur on different frames")
        ordered_steps.append(
            (
                read.actionIndex,
                compile_buff_blackboard_read(
                    read,
                    f"{skill.key}.buffBlackboardReads[{index}]",
                    root_skill_context=True,
                    input_target="enemy",
                ),
            )
        )
    for index, finish in enumerate(skill.buffFinishes):
        if finish.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: buff finish and damage occur on different frames")
        ordered_steps.append(
            (
                finish.actionIndex,
                compile_buff_finish(
                    finish,
                    f"{skill.key}.buffFinishes[{index}]",
                    root_skill_context=True,
                    input_target="enemy",
                ),
            )
        )
    for infliction in skill.inflictions:
        if infliction.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: infliction and damage occur on different frames")
        ordered_steps.append(
            (
                infliction.actionIndex,
                compile_infliction(infliction),
            )
        )
    for action in skill.auxiliaryActions:
        if action.classification != "skillCostUltimateEnergyGain":
            continue
        if action.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: ultimate energy gain and damage occur on different frames")
        ordered_steps.append(
            (
                action.actionIndex,
                "step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })",
            )
        )
    for gain in skill.resourceGains:
        if gain.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: resource gain and damage occur on different frames")
        amount_values = require_level_values(gain.amount, f"{skill.key}.resourceGain.amount")
        # 原生数据中存在已启用但全等级数值均为 0 的资源动作；保留在审计层，但不生成无效果步骤。
        if all(value == 0 for value in amount_values):
            continue
        ordered_steps.append(
            (
                gain.actionIndex,
                compile_resource_gain(gain, f"{skill.key}.resourceGain"),
            )
        )
    after_damage = config.get("afterDamage")
    if after_damage == "gainFinisherSp":
        ordered_steps.append(
            (hit.actionIndex + 0.5, "step('gainFinisherSp', { factor: 1, recipient: 'team' })")
        )
    elif after_damage is not None:
        raise ValueError(f"{skill.key}.compile.afterDamage: unsupported value")
    steps = [step_source for _, step_source in sorted(ordered_steps, key=lambda item: item[0])]
    rendered_steps = [
        f"          {line}{',' if index == len(lines) - 1 else ''}"
        for step_source in steps
        for lines in [step_source.splitlines()]
        for index, line in enumerate(lines)
    ]
    fields = [f"key: {ts_inline_literal(skill.key)},", f"timelineBlockFrames: {skill.timelineBlockFrames},"]
    availability = config.get("availability")
    if availability == "targetStaggered":
        fields.append("availability: { kind: 'targetStaggered', target: 'enemy' },")
    elif availability is not None:
        raise ValueError(f"{skill.key}.compile.availability: unsupported value")
    cooldown_frames = resolve_skill_cooldown_frames(skill, config)
    if cooldown_frames is not None:
        fields.append(
            f"cooldownFrames: {ts_inline_literal(compact_level_values(cooldown_frames))},"
        )
    cost_resource = resolve_skill_cost_resource(skill, config)
    if cost_resource is not None:
        cost = compact_level_values(skill.patch.costValues)
        fields.append(f"costs: [{{ resource: {ts_inline_literal(cost_resource)}, value: {ts_inline_literal(cost)} }}],")
        fields.append(f"costFrame: {skill.costFrame},")
    return "\n".join(
        [
            "  {",
            *(f"    {field}" for field in fields),
            "    scheduledSequences: [",
            *render_time_dilation_scheduled_entries(skill),
            "      scheduled(",
            f"        {hit.startFrame},",
            "        sequence(",
            *rendered_steps,
            "        ),",
            "      ),",
            "    ],",
            "  },",
        ]
    )


def compile_projectile_damage(skill: SkillSource, config: dict[str, Any]) -> str:
    if skill.unresolvedCombatActions != ("LaunchProjectile",):
        raise ValueError(
            f"{skill.key}: projectile damage compiler expected only root LaunchProjectile, "
            f"got {skill.unresolvedCombatActions}"
        )
    if len(skill.projectileTriggeredSkills) != 1:
        raise ValueError(f"{skill.key}: projectile damage compiler requires exactly one root projectile")
    hit = skill.projectileTriggeredSkills[0]
    if hit.cycleTruncated:
        raise ValueError(f"{skill.key}: root projectile unexpectedly truncates a cycle")
    if hit.assumedTravelFrames != 0:
        raise ValueError(f"{skill.key}: non-zero projectile travel is not supported yet")
    if len(hit.directDamageHits) != 1:
        raise ValueError(f"{skill.key}: projectile hit requires exactly one direct damage action")
    if hit.conditionalActions:
        if config.get("ignoreRecursiveProjectileForSingleTarget") is not True:
            raise ValueError(
                f"{skill.key}: conditional projectile branch requires an explicit single-target omission declaration"
            )
        validate_ignored_recursive_projectile_conditions(
            hit, f"{skill.key}.projectileTriggeredSkills[0].conditionalActions"
        )
    if hit.nestedProjectileTriggeredSkills:
        if config.get("ignoreRecursiveProjectileForSingleTarget") is not True:
            raise ValueError(
                f"{skill.key}: recursive projectile requires an explicit single-target omission declaration"
            )
        if any(
            nested.projectileId != hit.projectileId
            or nested.triggerSkillId != hit.triggerSkillId
            or not nested.cycleTruncated
            for nested in hit.nestedProjectileTriggeredSkills
        ):
            raise ValueError(f"{skill.key}: recursive projectile shape is not the expected self-cycle")

    expected_child_actions = {
        "DamageAction",
        *({"CreateBuffAction"} if hit.auxiliaryActions else set()),
        *({"ObtainCostAction"} if hit.resourceGains else set()),
        *({"LaunchProjectile"} if hit.nestedProjectileTriggeredSkills else set()),
        *({"IfElseAction", "LaunchProjectile"} if hit.conditionalActions else set()),
    }
    if set(hit.combatActions) != expected_child_actions:
        raise ValueError(f"{skill.key}: projectile child actions are not fully accounted for")
    unclassified = [action.sourceId for action in hit.auxiliaryActions if action.classification is None]
    if unclassified:
        raise ValueError(f"{skill.key}: unclassified projectile child actions: {unclassified}")

    damage = hit.directDamageHits[0]
    hp_units = [unit for unit in damage.damageUnits if unit.attributeType == "Hp"]
    poise_units = [unit for unit in damage.damageUnits if unit.attributeType == "Poise"]
    if len(hp_units) != 1 or len(poise_units) > 1 or len(hp_units) + len(poise_units) != len(damage.damageUnits):
        raise ValueError(f"{skill.key}: unsupported projectile DamageUnit layout")
    hp = hp_units[0]
    damage_type = DAMAGE_TYPE_MAP.get(hp.damageType)
    if damage_type is None:
        raise ValueError(f"{skill.key}: unsupported damage type {hp.damageType}")
    damage_fields = [
        f"damageType: {ts_inline_literal(damage_type)}",
        "attackScale: "
        + compile_percentage_level_values(
            require_level_values(hp.attackScale, f"{skill.key}.attackScale")
        ),
        f"tags: {ts_inline_literal(require_list(config.get('tags'), f'{skill.key}.compile.tags'))}",
    ]
    if poise_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{skill.key}: Poise unit has no value")
        damage_fields.append(
            f"stagger: {ts_inline_literal(compact_level_values(require_level_values(poise, f'{skill.key}.stagger')))}"
        )
    step_key = encode_damage_step_key(
        skill.key,
        "projectile",
        (skill.skillId, hit.triggerSkillId),
        (*hit.actionOrder, damage.actionIndex),
    )
    damage_step = "\n".join(
        [
            "step('dealDamage', {",
            *(f"  {field}," for field in damage_fields),
            f"}}, {ts_inline_literal(step_key)})",
        ]
    )
    ordered_steps: list[tuple[int, str]] = [(damage.actionIndex, damage_step)]
    for action in hit.auxiliaryActions:
        if action.classification == "tutorialMarker":
            continue
        if action.classification != "electrificationReaction":
            raise ValueError(f"{skill.key}: unsupported auxiliary classification {action.classification}")
        duration = action.blackboardAssignments.get("duration")
        if duration is None:
            raise ValueError(f"{skill.key}: electrification reaction has no duration assignment")
        duration_seconds = compact_level_values(
            require_level_values(duration, f"{skill.key}.electrification.duration")
        )
        ordered_steps.append(
            (
                action.actionIndex,
                "\n".join(
                    [
                        "step('applyElementalReaction', {",
                        "  reaction: 'electrification',",
                        "  target: 'enemy',",
                        f"  durationSeconds: {ts_inline_literal(duration_seconds)},",
                        "  effectiveness: 1,",
                        f"}}, {ts_inline_literal(f'{skill.key}.electrification')})",
                    ]
                ),
            )
        )
    for gain in hit.resourceGains:
        ordered_steps.append(
            (
                gain.actionIndex,
                compile_resource_gain(gain, f"{skill.key}.resourceGain"),
            )
        )
    rendered_steps = [
        f"          {line}{',' if index == len(lines) - 1 else ''}"
        for _, step_source in sorted(ordered_steps, key=lambda item: item[0])
        for lines in [step_source.splitlines()]
        for index, line in enumerate(lines)
    ]
    cooldown_frames = resolve_skill_cooldown_frames(skill, config)
    cost_resource = resolve_skill_cost_resource(skill, config)
    resource_fields: list[str] = []
    if cooldown_frames is not None:
        resource_fields.append(
            f"    cooldownFrames: {ts_inline_literal(compact_level_values(cooldown_frames))},"
        )
    if cost_resource is not None:
        resource_fields.extend(
            [
                "    costs: [{ resource: "
                f"{ts_inline_literal(cost_resource)}, value: "
                f"{ts_inline_literal(compact_level_values(skill.patch.costValues))} }}],",
                f"    costFrame: {skill.costFrame},",
            ]
        )
    return "\n".join(
        [
            "  {",
            f"    key: {ts_inline_literal(skill.key)},",
            f"    timelineBlockFrames: {skill.timelineBlockFrames},",
            *resource_fields,
            "    scheduledSequences: [",
            *render_time_dilation_scheduled_entries(skill),
            "      scheduled(",
            f"        {hit.launchFrame + hit.assumedTravelFrames + damage.startFrame},",
            "        sequence(",
            *rendered_steps,
            "        ),",
            "      ),",
            "    ],",
            "  },",
        ]
    )


def validate_ignored_recursive_projectile_conditions(
    hit: ProjectileTriggeredSkillSource, path: str
) -> None:
    """校验显式省略项确实只是在条件分支中再次发射同一命中技能。"""
    launches: list[ProjectileLaunchSource] = []
    for condition_index, condition in enumerate(hit.conditionalActions):
        if condition.failActions:
            raise ValueError(f"{path}[{condition_index}]: recursive omission has a fail branch")
        for action_index, action in enumerate(condition.succeedActions):
            if action.projectileLaunch is not None:
                launches.append(action.projectileLaunch)
                continue
            if action.blackboardMutation is not None:
                continue
            raise ValueError(
                f"{path}[{condition_index}].succeedActions[{action_index}]: "
                f"unsupported recursive omission leaf {action.actionType!r}"
            )
    if len(launches) != 1:
        raise ValueError(f"{path}: expected exactly one recursive projectile launch")
    launch = launches[0]
    if (
        launch.projectileId != hit.projectileId
        or ProjectileSkillTriggerSource(hit.triggerEvent, hit.triggerSkillId)
        not in launch.skillTriggers
    ):
        raise ValueError(f"{path}: recursive launch does not target the same projectile event skill")


def encode_step_key_parts(parts: tuple[int | str, ...]) -> str:
    """编码多个字段，并保留字段边界。"""
    return "".join(f"{len(str(part))}:{part}" for part in parts)


def encode_damage_step_key(
    skill_key: str,
    source_kind: str,
    source_path: tuple[str, ...],
    action_order: tuple[int, ...],
) -> str:
    """根据源数据中的命中位置生成稳定的伤害步骤 key。"""
    return encode_step_key_parts(
        (skill_key, source_kind, *source_path, "actionOrder", *action_order)
    )


def compile_damage_units_step(
    damage_units: tuple[DamageUnitSource, ...],
    declared_tags: tuple[str, ...],
    path: str,
    runtime_blackboard_keys: frozenset[str] = frozenset(),
    step_key: str | None = None,
) -> list[str]:
    """按原生 DamageUnit 顺序编译生命伤害及独立失衡单元。"""
    hp_units = [unit for unit in damage_units if unit.attributeType == "Hp"]
    poise_units = [unit for unit in damage_units if unit.attributeType == "Poise"]
    if (
        len(hp_units) > 1
        or len(poise_units) > 1
        or len(hp_units) + len(poise_units) != len(damage_units)
        or not damage_units
    ):
        raise ValueError(f"{path}: unsupported DamageUnit layout")
    if not hp_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{path}: Poise unit has no value")
        if poise.blackboardKey in runtime_blackboard_keys:
            value = (
                "{ kind: 'blackboard', key: "
                f"{ts_inline_literal(poise.blackboardKey)} }}"
            )
        else:
            value = ts_inline_literal(
                compact_level_values(require_level_values(poise, f"{path}.stagger"))
            )
        return [
            "step('dealStagger', {",
            f"  value: {value},",
            "})",
        ]
    if tuple(unit.attributeType for unit in damage_units) not in {("Hp",), ("Hp", "Poise")}:
        raise ValueError(f"{path}: unsupported DamageUnit execution order")
    hp = hp_units[0]
    tags, features = decode_damage_decorate_mask(hp.damageDecorateMask, path)
    undeclared_tags = {
        tag
        for tag in tags
        if tag not in declared_tags
        and IMPLIED_DAMAGE_TAG_PARENTS.get(tag) not in declared_tags
    }
    if undeclared_tags:
        raise ValueError(
            f"{path}: native damage tags {sorted(undeclared_tags)} are absent from the skill declaration"
        )
    damage_type = DAMAGE_TYPE_MAP.get(hp.damageType)
    if damage_type is None:
        raise ValueError(f"{path}: unsupported damage type {hp.damageType}")
    if hp.calculation == "definiteValue":
        fixed_value = hp.definiteValue
        if fixed_value is None:
            raise ValueError(f"{path}: definite damage unit has no value")
        if fixed_value.blackboardKey in runtime_blackboard_keys:
            value = (
                "{ kind: 'blackboard', key: "
                f"{ts_inline_literal(fixed_value.blackboardKey)} }}"
            )
        else:
            value = ts_inline_literal(
                compact_level_values(require_level_values(fixed_value, f"{path}.value"))
            )
        fields = [
            f"damageType: {ts_inline_literal(damage_type)}",
            f"value: {value}",
            f"tags: {ts_inline_literal(tags)}",
        ]
    else:
        if hp.attackScale.blackboardKey in runtime_blackboard_keys:
            attack_scale = (
                "{ kind: 'blackboard', key: "
                f"{ts_inline_literal(hp.attackScale.blackboardKey)} }}"
            )
        else:
            attack_scale = compile_percentage_level_values(
                require_level_values(hp.attackScale, f"{path}.attackScale")
            )
        fields = [
            f"damageType: {ts_inline_literal(damage_type)}",
            f"attackScale: {attack_scale}",
            f"tags: {ts_inline_literal(tags)}",
        ]
        if hp.calculation != "standard":
            fields.append(f"calculation: {ts_inline_literal(hp.calculation)}")
        if hp.calculationMultiplier is not None:
            fields.append(
                "calculationMultiplier: "
                f"{ts_inline_literal(compact_level_values(resolved_scalar_values(hp.calculationMultiplier)))}"
            )
    if features:
        fields.append(f"features: {ts_inline_literal(features)}")
    if poise_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{path}: Poise unit has no value")
        if poise.blackboardKey in runtime_blackboard_keys:
            fields.append(
                "stagger: { kind: 'blackboard', key: "
                f"{ts_inline_literal(poise.blackboardKey)} }}"
            )
        else:
            fields.append(
                "stagger: "
                f"{ts_inline_literal(compact_level_values(require_level_values(poise, f'{path}.stagger')))}"
            )
    step_kind = "dealFixedDamage" if hp.calculation == "definiteValue" else "dealDamage"
    if step_key is not None:
        return [
            f"step('{step_kind}', {{",
            *(f"  {field}," for field in fields),
            f"}}, {ts_inline_literal(step_key)})",
        ]
    return [f"step('{step_kind}', {{", *(f"  {field}," for field in fields), "})"]


def compile_resolved_damage_steps(
    skill: SkillSource,
    config: dict[str, Any],
    hit: ResolvedDamageHitSource,
    index: int,
    is_last_damage: bool,
    runtime_blackboard_keys: frozenset[str] = frozenset(),
) -> list[str]:
    """把一个已解析命中编译成同步步骤；收尾效果紧跟最后一次伤害。"""
    tags = tuple(require_list(config.get("tags"), f"{skill.key}.compile.tags"))
    step_key = encode_damage_step_key(
        skill.key,
        hit.sourceKind,
        hit.sourcePath,
        hit.actionOrder,
    )
    result = compile_damage_units_step(
        hit.damageUnits,
        tags,
        f"{skill.key}.resolvedDamageHits[{index}]",
        runtime_blackboard_keys,
        step_key,
    )
    if is_last_damage and config.get("afterDamage") == "gainFinisherSp":
        result.append("step('gainFinisherSp', { factor: 1, recipient: 'team' })")
    elif is_last_damage and config.get("afterDamage") is not None:
        raise ValueError(f"{skill.key}.compile.afterDamage: unsupported value")
    return result


def compile_skill_event_listener(
    listener: SkillEventListenerSource,
    path: str,
    *,
    runtime_blackboard_keys: frozenset[str],
    step_key_prefix: str,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> str:
    """把已闭环的原生技能临时监听器编译为通用事件监听步骤。"""
    event = {
        "OnAfterKillEntity": {"kind": "enemyDefeated", "scope": "operator"},
    }.get(listener.event)
    if event is None:
        raise ValueError(f"{path}: unsupported native skill event {listener.event!r}")
    if not listener.sequences:
        raise ValueError(f"{path}: event listener has no response sequence")

    responses: list[str] = []
    for index, response in enumerate(listener.sequences):
        response_path = f"{path}.sequences[{index}]"
        if response.onlyMainOperator or response.onlyGuard:
            raise ValueError(
                f"{response_path}: main-operator and guard filters are not mapped"
            )
        if not response.actions:
            raise ValueError(f"{response_path}: event response action tree is empty")
        sequence_source = compile_conditional_branch(
            response.actions,
            f"{response_path}.actions",
            runtime_blackboard_keys=runtime_blackboard_keys,
            root_skill_context=True,
            step_key_prefix=step_key_prefix,
            buff_definitions=buff_definitions,
        )
        if sequence_source == "sequence()":
            raise ValueError(f"{response_path}: event response compiles to an empty sequence")
        sequence_lines = indent_source(f"sequence: {sequence_source}", 8)
        sequence_lines[-1] += ","
        responses.extend(
            [
                "      {",
                "        key: "
                f"{ts_inline_literal(f'native-event-{listener.actionIndex}-{index}')},",
                f"        event: {ts_inline_literal(event)},",
                *sequence_lines,
                "      },",
            ]
        )

    return "\n".join(
        [
            "step('listenForCombatEvents', {",
            "  responses: [",
            *responses,
            "  ],",
            "})",
        ]
    )


def compile_resolved_sequence(
    skill: SkillSource,
    config: dict[str, Any],
    *,
    require_damage: bool,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> str:
    """将已闭环根动作统一编译为按原生顺序调度的序列。"""
    ignored_auxiliary_classifications = set(
        require_list(
            config.get("ignoreAuxiliaryClassifications", []),
            f"{skill.key}.compile.ignoreAuxiliaryClassifications",
        )
    )
    ignored_buff_ids = frozenset(
        require_list(config.get("ignoreBuffIds", []), f"{skill.key}.compile.ignoreBuffIds")
    )
    unmodeled_buff_ids = frozenset(
        require_list(
            config.get("unmodeledBuffIds", []),
            f"{skill.key}.compile.unmodeledBuffIds",
        )
    )
    damage_tags = tuple(require_list(config.get("tags", []), f"{skill.key}.compile.tags"))
    runtime_blackboard_keys = collect_runtime_blackboard_output_keys(skill)
    collapse_single_enemy_entity_branches = config.get(
        "collapseSingleEnemyAbilityEntityBranches", False
    )
    if not isinstance(collapse_single_enemy_entity_branches, bool):
        raise ValueError(
            f"{skill.key}.compile.collapseSingleEnemyAbilityEntityBranches: expected boolean"
        )
    projected_condition_paths = frozenset(
        condition.actionPath
        for condition in skill.conditionalActions
        if is_single_enemy_ability_entity_projection(condition)
    )
    if collapse_single_enemy_entity_branches and not projected_condition_paths:
        raise ValueError(f"{skill.key}: no single-enemy ability entity branch can be projected")
    combat_auxiliary_actions = [
        action
        for action in getattr(skill, "auxiliaryActions", [])
        if action.actionType == "CreateBuffAction"
    ]
    if any(not launch.skillTriggers for launch in skill.projectileLaunches):
        raise ValueError(f"{skill.key}: projectile without triggered SkillData remains unresolved")
    unmodeled_projectile_actions: list[str] = []

    def collect_unmodeled_projectile_actions(hit: ProjectileTriggeredSkillSource) -> None:
        if getattr(hit, "excludedByPrimaryTargetMarker", False):
            return
        projected_actions = {"DamageAction"}
        if hit.conditionalActions:
            projected_actions.update(
                collect_compilable_conditional_action_types(hit.conditionalActions)
            )
        if hit.resourceGains:
            projected_actions.add("ObtainCostAction")
        if any(
            action.actionType == "CreateBuffAction"
            for action in getattr(hit, "auxiliaryActions", ())
        ):
            projected_actions.add("CreateBuffAction")
        if getattr(hit, "inflictions", ()):
            projected_actions.add("SpellInfliction")
        if getattr(hit, "keywordActions", ()):
            projected_actions.add("SlowAction")
        if hit.nestedProjectileTriggeredSkills:
            projected_actions.add("LaunchProjectile")
        if getattr(hit, "abilityEntityHits", ()):
            projected_actions.add("SpawnAbilityEntity")
        unmodeled_projectile_actions.extend(
            action for action in hit.combatActions if action not in projected_actions
        )
        for nested in hit.nestedProjectileTriggeredSkills:
            collect_unmodeled_projectile_actions(nested)

    for projectile in skill.projectileTriggeredSkills:
        collect_unmodeled_projectile_actions(projectile)
    if unmodeled_projectile_actions:
        raise ValueError(
            f"{skill.key}: projectile child combat actions are not projected: "
            f"{sorted(set(unmodeled_projectile_actions))}"
        )
    allowed_actions = {"DamageAction", "LaunchProjectile", "SpawnAbilityEntity"}
    allowed_actions.update(collect_compilable_conditional_action_types(skill.conditionalActions))
    if skill.blackboardCalculations:
        allowed_actions.add("SimpleCalcBBAction")
    if skill.blackboardMutations:
        allowed_actions.add("ModifyDynamicBlackboard")
    if skill.buffBlackboardReads:
        allowed_actions.add("GetTargetBuffBBAdvanced")
    if skill.buffFinishes:
        allowed_actions.add("FinishBuffAdvanced")
    if skill.inflictions:
        allowed_actions.add("SpellInfliction")
    if combat_auxiliary_actions:
        allowed_actions.add("CreateBuffAction")
    if skill.resourceGains:
        allowed_actions.add("ObtainCostAction")
    if getattr(skill, "keywordActions", ()):
        allowed_actions.add("SlowAction")
    uncovered_actions = sorted(set(skill.unresolvedCombatActions) - allowed_actions)
    if uncovered_actions:
        raise ValueError(
            f"{skill.key}: unresolved combat actions are not covered by resolved damage "
            f"compiler: {uncovered_actions}"
        )
    hits = collect_resolved_damage_hits(skill)
    if require_damage and not hits:
        raise ValueError(f"{skill.key}: resolved damage compiler found no damage hits")
    resolved_schedule = collect_resolved_schedule(skill)
    overlap = sorted(ignored_buff_ids & unmodeled_buff_ids)
    if overlap:
        raise ValueError(
            f"{skill.key}.compile: Buff ids cannot be both ignored and unmodeled: {overlap}"
        )
    validate_unmodeled_buff_ids(
        resolved_schedule,
        unmodeled_buff_ids,
        f"{skill.key}.compile.unmodeledBuffIds",
    )
    schedule = tuple(
        item
        for item in resolved_schedule
        if not (
            item.itemType == "buffApplication"
            and (
                cast(AuxiliaryActionSource, item.payload).classification
                in ignored_auxiliary_classifications
                or cast(AuxiliaryActionSource, item.payload).sourceId in ignored_buff_ids
                or cast(AuxiliaryActionSource, item.payload).sourceId in unmodeled_buff_ids
            )
        )
        and not (
            item.itemType == "condition"
            and collapse_single_enemy_entity_branches
            and cast(ConditionalActionSource, item.payload).actionPath
            in projected_condition_paths
        )
    )
    damage_indexes = {hit: index for index, hit in enumerate(hits)}
    compiled_schedule: list[tuple[ResolvedScheduleItemSource, list[str]]] = []
    for schedule_index, item in enumerate(schedule):
        if item.itemType == "damage":
            payload = cast(ResolvedDamageHitSource, item.payload)
            index = damage_indexes[payload]
            step_lines = compile_resolved_damage_steps(
                skill,
                config,
                payload,
                index,
                index == len(hits) - 1,
                runtime_blackboard_keys,
            )
        elif item.itemType == "condition":
            payload = cast(ConditionalActionSource, item.payload)
            target_group_writes = (
                item.targetGroupWrites
                or root_target_group_writes_for_condition(skill, item, payload)
            )
            compiled_condition = compile_conditional_action(
                payload,
                f"{skill.key}.schedule[{schedule_index}].conditionalAction",
                ignored_buff_ids,
                damage_tags,
                runtime_blackboard_keys,
                target_group_writes=target_group_writes,
                root_skill_context=item.sourcePath == payload.actionPath,
                input_target=item.inputTarget,
                skill_has_output_damage=root_skill_has_output_damage_before(
                    schedule, schedule_index, skill.skillId
                ),
                step_key_prefix=skill.key,
                buff_definitions=buff_definitions,
            )
            if compiled_condition == "sequence()":
                continue
            step_lines = compiled_condition.splitlines()
        elif item.itemType == "blackboardCalculation":
            payload = cast(BlackboardCalculationSource, item.payload)
            step_lines = compile_blackboard_calculation(
                payload,
                f"{skill.key}.schedule[{schedule_index}].blackboardCalculation",
            ).splitlines()
        elif item.itemType == "blackboardMutation":
            payload = cast(BlackboardMutationSource, item.payload)
            step_lines = compile_blackboard_mutation(
                payload,
                f"{skill.key}.schedule[{schedule_index}].blackboardMutation",
            ).splitlines()
        elif item.itemType == "buffBlackboardRead":
            payload = cast(BuffBlackboardReadSource, item.payload)
            context_target_is_enemy = False
            if (
                item.sourcePath == (skill.skillId,)
                and payload.targetSource == "Context"
                and payload.targetGroupKey != "smart_target"
            ):
                write = resolve_latest_target_group_write_at(
                    read_frame=payload.startFrame,
                    read_action_index=payload.actionIndex,
                    read_action_path=(),
                    target_group_key=payload.targetGroupKey,
                    writes=skill.targetGroupWrites,
                    control_flow_actions=skill.targetGroupControlFlowActions,
                    root_skill_context=True,
                )
                context_target_is_enemy = (
                    write is not None
                    and target_group_write_guarantees_single_enemy(write)
                )
            step_lines = compile_buff_blackboard_read(
                payload,
                f"{skill.key}.schedule[{schedule_index}].buffBlackboardRead",
                root_skill_context=item.sourcePath == (skill.skillId,),
                input_target=item.inputTarget,
                context_target_is_enemy=context_target_is_enemy,
            ).splitlines()
        elif item.itemType == "buffFinish":
            payload = cast(BuffFinishSource, item.payload)
            step_lines = compile_buff_finish(
                payload,
                f"{skill.key}.schedule[{schedule_index}].buffFinish",
                root_skill_context=item.sourcePath == (skill.skillId,),
                input_target=item.inputTarget,
            ).splitlines()
        elif item.itemType == "buffHold":
            payload = cast(BuffHoldSource, item.payload)
            step_lines = compile_buff_hold(
                payload,
                f"{skill.key}.schedule[{schedule_index}].buffHold",
            ).splitlines()
        elif item.itemType == "resourceGain":
            payload = cast(TimedResourceGainSource, item.payload)
            step_lines = compile_resource_gain(
                payload,
                f"{skill.key}.schedule[{schedule_index}].resourceGain",
            ).splitlines()
        elif item.itemType == "infliction":
            payload = cast(TimedInflictionSource, item.payload)
            step_lines = compile_infliction(payload).splitlines()
        elif item.itemType == "buffApplication":
            payload = cast(AuxiliaryActionSource, item.payload)
            context_application_target = None
            if (
                item.sourcePath == (skill.skillId,)
                and payload.targetSource == "Context"
                and payload.targetGroupKey != "smart_target"
            ):
                write = resolve_latest_target_group_write_at(
                    read_frame=payload.startFrame,
                    read_action_index=payload.actionIndex,
                    read_action_path=(),
                    target_group_key=payload.targetGroupKey,
                    writes=skill.targetGroupWrites,
                    control_flow_actions=skill.targetGroupControlFlowActions,
                    root_skill_context=True,
                )
                context_application_target = target_group_write_buff_application_target(write)
            if payload.classification == "skillCostUltimateEnergyGain":
                # buff_common_obtain_ultimate_sp 的 CreateBuffAction 是原生
                # “按非返还技力消耗为全队回能”的载体；不展开为 Buff 实例。
                step_lines = [
                    "step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })"
                ]
            else:
                step_lines = compile_buff_application(
                    payload,
                    f"{skill.key}.schedule[{schedule_index}].buffApplication",
                    root_skill_context=item.sourcePath == (skill.skillId,),
                    context_application_target=context_application_target,
                    input_target=item.inputTarget,
                    buff_definitions=buff_definitions,
                ).splitlines()
        elif item.itemType == "eventListener":
            payload = cast(SkillEventListenerSource, item.payload)
            step_lines = compile_skill_event_listener(
                payload,
                f"{skill.key}.schedule[{schedule_index}].eventListener",
                runtime_blackboard_keys=runtime_blackboard_keys,
                step_key_prefix=skill.key,
                buff_definitions=buff_definitions,
            ).splitlines()
        elif item.itemType == "timeDilation":
            payload = cast(TimedTimeDilationSource, item.payload)
            step_lines = compile_time_dilation(
                payload,
                f"{skill.key}.schedule[{schedule_index}].timeDilation",
            ).splitlines()
        elif item.itemType == "keywordAction":
            payload = cast(TimedKeywordActionSource, item.payload)
            step_lines = compile_keyword_action(
                payload,
                f"{skill.key}.schedule[{schedule_index}].keywordAction",
                root_skill_context=item.sourcePath == (skill.skillId,),
                input_target=item.inputTarget,
            ).splitlines()
        else:
            raise AssertionError(f"{skill.key}: unknown schedule item type {item.itemType!r}")
        compiled_schedule.append((item, step_lines))

    grouped_schedule: dict[
        tuple[int, tuple[int, ...]],
        list[tuple[ResolvedScheduleItemSource, list[str]]],
    ] = {}
    for item, step_lines in compiled_schedule:
        grouped_schedule.setdefault((item.frame, item.sequenceOrder), []).append((item, step_lines))

    scheduled_entries: list[str] = []
    for frame, sequence_order in sorted(grouped_schedule):
        entries = sorted(
            grouped_schedule[(frame, sequence_order)],
            key=lambda entry: entry[0].actionOrder,
        )
        entry_lines = ["      scheduled(", f"        {frame},", "        sequence("]
        for _, step_lines in entries:
            entry_lines.extend(
                f"          {line}," if line.endswith(")") else f"          {line}"
                for line in step_lines
            )
        entry_lines.append("        ),")
        end_frames = {
            cast(BuffHoldSource | SkillEventListenerSource | TimedTimeDilationSource, item.payload).endFrame
            for item, _ in entries
            if item.itemType in {"buffHold", "eventListener", "timeDilation"}
        }
        if len(end_frames) > 1:
            raise ValueError(
                f"{skill.key}: one native sequence has conflicting end frames {sorted(end_frames)}"
            )
        if end_frames:
            entry_lines.append(f"        {next(iter(end_frames))},")
        entry_lines.append("      ),")
        scheduled_entries.extend(entry_lines)
    fields = [
            "  {",
            f"    key: {ts_inline_literal(skill.key)},",
            f"    timelineBlockFrames: {skill.timelineBlockFrames},",
    ]
    availability = config.get("availability")
    if availability == "targetStaggered":
        fields.append("    availability: { kind: 'targetStaggered', target: 'enemy' },")
    elif availability is not None:
        raise ValueError(f"{skill.key}.compile.availability: unsupported value")
    cooldown_frames = resolve_skill_cooldown_frames(skill, config)
    if cooldown_frames is not None:
        fields.append(
            "    cooldownFrames: "
            f"{ts_inline_literal(compact_level_values(cooldown_frames))},"
        )
    cost_resource = resolve_skill_cost_resource(skill, config)
    if cost_resource is not None:
        fields.append(
            "    costs: [{ resource: "
            f"{ts_inline_literal(cost_resource)}, value: "
            f"{ts_inline_literal(compact_level_values(skill.patch.costValues))} }}],"
        )
        fields.append(f"    costFrame: {skill.costFrame},")
    fields.extend(
        [
            "    scheduledSequences: [",
            *scheduled_entries,
            "    ],",
            "  },",
        ]
    )
    return "\n".join(fields)


def compile_resolved_damage_sequence(
    skill: SkillSource,
    config: dict[str, Any],
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> str:
    """兼容要求至少一个伤害命中的严格入口。"""
    return compile_resolved_sequence(
        skill,
        config,
        require_damage=True,
        buff_definitions=buff_definitions,
    )


def compile_skill_entries(
    operator: dict[str, Any],
    skills: list[SkillSource],
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> tuple[list[tuple[SkillSource, str]], set[str]]:
    entries = require_list(operator.get("skills"), f"{operator.get('slug')}.skills")
    compiled: list[tuple[SkillSource, str]] = []
    damage_type_factories: set[str] = set()
    for entry, skill in zip(entries, skills, strict=True):
        config = entry.get("compile")
        if config is None:
            continue
        config = require_dict(config, f"{skill.key}.compile")
        kind = config.get("kind")
        if skill.conditionalActions and kind not in {
            "resolvedDamageSequence",
            "resolvedSequence",
        }:
            raise ValueError(
                f"{skill.key}: compiler must consume conditional actions before emitting DSL"
            )
        if kind == "basicAttack":
            damage_types = {
                DAMAGE_TYPE_MAP[unit.damageType]
                for hit in skill.projectileTriggeredSkills
                for unit in hit.damageUnits
                if unit.attributeType == "Hp" and unit.damageType in DAMAGE_TYPE_MAP
            }
            if len(damage_types) != 1:
                raise ValueError(f"{skill.key}: expected exactly one supported health damage type")
            damage_type = next(iter(damage_types))
            factory_name = f"{damage_type}BasicAttack"
            damage_type_factories.add(factory_name)
            compiled.append((skill, compile_basic_attack(skill, config, factory_name)))
        elif kind == "directDamage":
            compiled.append((skill, compile_direct_damage(skill, config)))
        elif kind == "projectileDamage":
            compiled.append((skill, compile_projectile_damage(skill, config)))
        elif kind == "resolvedDamageSequence":
            compiled.append(
                (skill, compile_resolved_damage_sequence(skill, config, buff_definitions))
            )
        elif kind == "resolvedSequence":
            compiled.append(
                (
                    skill,
                    compile_resolved_sequence(
                        skill,
                        config,
                        require_damage=False,
                        buff_definitions=buff_definitions,
                    ),
                )
            )
        else:
            raise ValueError(f"{skill.key}.compile.kind: unsupported compiler {kind!r}")
    return compiled, damage_type_factories


def generated_skill_name(operator: dict[str, Any], skill_key: str) -> str:
    if not skill_key or not skill_key.replace("_", "").isalnum():
        raise ValueError(f"invalid stable skill key for TypeScript identifier: {skill_key!r}")
    return f"{typescript_identifier(str(operator['slug']))}{skill_key[0].upper()}{skill_key[1:]}"


def render_named_skills(
    operator: dict[str, Any], compiled: list[tuple[SkillSource, str]]
) -> list[str]:
    result: list[str] = []
    for skill, expression in compiled:
        value = expression.rstrip()
        if not value.endswith(","):
            raise ValueError(f"{skill.key}: compiled skill expression must end with a comma")
        value = textwrap.dedent(value[:-1])
        condition_blackboard_keys = collect_conditional_blackboard_keys(
            skill.conditionalActions
        )
        blackboard = {
            item.key: item.value
            for item in skill.declaredBlackboard
            if item.key in condition_blackboard_keys and isinstance(item.value, float)
        }
        blackboard.update(skill.patch.blackboard)
        if blackboard:
            blackboard_lines: list[str] = []
            for key, values in blackboard.items():
                compiled_values = compact_level_values(values) if isinstance(values, tuple) else values
                blackboard_lines.append(
                    f"  {ts_inline_literal(key)}: {ts_inline_literal(compiled_values)},"
                )
            value = "\n".join(
                [
                    "withSkillBlackboard(",
                    textwrap.indent(value, "  ") + ",",
                    "  {",
                    *(f"  {line}" for line in blackboard_lines),
                    "  },",
                    ")",
                ]
            )
        value_lines = value.splitlines()
        if len(value_lines) == 1:
            result.extend(
                [
                    f"export const {generated_skill_name(operator, skill.key)}: SkillDefinition = {value};",
                    "",
                ]
            )
            continue
        result.extend(
            [
                f"export const {generated_skill_name(operator, skill.key)}: SkillDefinition = {value_lines[0]}",
                *(f"{line}" for line in value_lines[1:-1]),
                f"{value_lines[-1]};",
                "",
            ]
        )
    return result


def collect_conditional_blackboard_keys(
    actions: tuple[ConditionalActionSource, ...],
) -> set[str]:
    """收集已编译条件树实际读写的动作黑板键，避免注入表现层原生变量。"""
    result: set[str] = set()

    def add_scalar(source: ScalarSource | None) -> None:
        if source is not None and source.blackboardKey is not None:
            result.add(source.blackboardKey)

    def visit_condition(action: ConditionalActionSource) -> None:
        for condition in action.conditions:
            add_scalar(condition.left)
            add_scalar(condition.right)
            if condition.buffStack is not None:
                add_scalar(condition.buffStack.value)
        for branch_action in (*action.succeedActions, *action.failActions):
            if getattr(branch_action, "onceActions", None) is not None:
                visit_branch_actions(branch_action.onceActions)
            if branch_action.nestedCondition is not None:
                visit_condition(branch_action.nestedCondition)
            if branch_action.blackboardMutation is not None:
                result.add(branch_action.blackboardMutation.key)
                add_scalar(branch_action.blackboardMutation.value)
            if branch_action.buffBlackboardRead is not None:
                result.add(branch_action.buffBlackboardRead.outputKey)

    def visit_branch_actions(
        actions: tuple[ConditionalBranchActionSource, ...],
    ) -> None:
        for branch_action in actions:
            if branch_action.nestedCondition is not None:
                visit_condition(branch_action.nestedCondition)
            if getattr(branch_action, "onceActions", None) is not None:
                visit_branch_actions(branch_action.onceActions)
            if branch_action.blackboardMutation is not None:
                result.add(branch_action.blackboardMutation.key)
                add_scalar(branch_action.blackboardMutation.value)
            if branch_action.buffBlackboardRead is not None:
                result.add(branch_action.buffBlackboardRead.outputKey)

    for action in actions:
        visit_condition(action)
    return result


def collect_definition_helpers(
    compiled: list[tuple[SkillSource, str]], damage_type_factories: set[str]
) -> str:
    """收集生成技能实际需要的 DSL helper，供两种输出入口共用。"""
    compiled_source = "\n".join(source for _, source in compiled)
    helpers = {
        *damage_type_factories,
        "scheduled",
        "sequence",
        "step",
        "withSkillBlackboard",
    }
    if "percentage(" in compiled_source:
        helpers.add("percentage")
    if "percentages(" in compiled_source:
        helpers.add("percentages")
    if any(skill.conditionalActions for skill, _ in compiled):
        helpers.add("branch")
    if any("once(" in source for _, source in compiled):
        helpers.add("once")
    return ", ".join(sorted(helpers))


def render_compiled_skills(
    operator: dict[str, Any],
    skills: list[SkillSource],
    buff_definitions: tuple[BuffDefinitionSource, ...] | None = None,
) -> str:
    definitions_by_id = (
        None
        if buff_definitions is None
        else {definition.buffId: definition for definition in buff_definitions}
    )
    compiled, damage_type_factories = compile_skill_entries(
        operator,
        skills,
        definitions_by_id,
    )
    helper_imports = collect_definition_helpers(compiled, damage_type_factories)
    return (
        "/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */\n"
        "import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';\n"
        f"import {{ {helper_imports} }} from '../definitionHelpers';\n\n"
        "// prettier-ignore\n"
        + "\n".join(render_named_skills(operator, compiled))
    )


# CharacterTable 枚举到 Next OperatorDefinition 身份的映射。2/5 已由佩丽卡样本验证；
# 其余取值由全量 CharacterTable 枚举分布与旧版干员表身份一致，生成时仍需审计确认。
WEAPON_TYPE_MAP = {
    1: "sword",
    2: "arts-unit",
    3: "greatsword",
    5: "polearm",
    6: "handcannon",
}
ELEMENT_TYPE_MAP = {
    "Physical": "physical",
    "Fire": "heat",
    "Pulse": "electric",
    "Cryst": "cryo",
    "Natural": "nature",
}
PROFESSION_MAP = {
    0: "guard",
    2: "defender",
    4: "supporter",
    5: "caster",
    7: "vanguard",
    8: "striker",
}
PANEL_ATTRIBUTE_TYPES = {
    "strength": 39,
    "agility": 40,
    "intellect": 41,
    "will": 42,
    "baseAttack": 2,
    "baseHealth": 1,
}
ATTRIBUTE_TYPE_MAP = {value: key for key, value in PANEL_ATTRIBUTE_TYPES.items()}
PANEL_LEVELS = (1, 20, 40, 60, 80, 90)
TRUST_BREAK_STAGES = (1, 2, 3, 4)
DEFAULT_TRUST_ATTRIBUTE_BONUS = {
    "values": (10, 15, 15, 20),
    "attributes": ("main",),
}


def parse_panel_attributes(character: dict[str, Any], path: str) -> dict[str, tuple[int, ...]]:
    rows_by_level: dict[int, dict[int, float]] = {}
    for index, raw_row in enumerate(require_list(character.get("attributes"), f"{path}.attributes")):
        row = require_dict(raw_row, f"{path}.attributes[{index}]")
        attributes = require_dict(row.get("Attribute"), f"{path}.attributes[{index}].Attribute")
        values = {
            require_non_negative_int(item.get("attrType"), f"{path}.attributes[{index}].attrType"): float(item["attrValue"])
            for item in (
                require_dict(raw_item, f"{path}.attributes[{index}].attrs[]")
                for raw_item in require_list(attributes.get("attrs"), f"{path}.attributes[{index}].attrs")
            )
        }
        level = int(values.get(0, -1))
        if level in PANEL_LEVELS and level not in rows_by_level:
            rows_by_level[level] = values
    missing = set(PANEL_LEVELS).difference(rows_by_level)
    if missing:
        raise ValueError(f"{path}.attributes: missing panel levels {sorted(missing)}")
    return {
        name: tuple(int(rows_by_level[level][attr_type]) for level in PANEL_LEVELS)
        for name, attr_type in PANEL_ATTRIBUTE_TYPES.items()
    }


def parse_trust_attribute_bonus(
    growth: dict[str, Any],
    main_attribute: str,
    path: str,
) -> dict[str, tuple[int, ...] | tuple[str, ...]] | None:
    """解析天赋阵列的四次属性节点；全局默认规则返回 ``None``。"""
    nodes_by_stage: dict[int, tuple[tuple[str, ...], int]] = {}
    nodes = require_dict(growth.get("talentNodeMap"), f"{path}.talentNodeMap")
    for node_id, raw_node in nodes.items():
        node_path = f"{path}.talentNodeMap.{node_id}"
        node = require_dict(raw_node, node_path)
        if node.get("nodeType") != 3:
            continue
        info = require_dict(node.get("attributeNodeInfo"), f"{node_path}.attributeNodeInfo")
        stage = require_non_negative_int(
            info.get("breakStage"), f"{node_path}.attributeNodeInfo.breakStage"
        )
        if stage in nodes_by_stage:
            raise ValueError(f"{path}.talentNodeMap: duplicate trust break stage {stage}")
        modifiers = require_list(
            info.get("attributeModifiers"),
            f"{node_path}.attributeNodeInfo.attributeModifiers",
        )
        if not modifiers:
            raise ValueError(f"{node_path}.attributeNodeInfo.attributeModifiers: expected entries")
        attributes: list[str] = []
        values: list[int] = []
        for index, raw_modifier in enumerate(modifiers):
            modifier_path = f"{node_path}.attributeNodeInfo.attributeModifiers[{index}]"
            modifier = require_dict(raw_modifier, modifier_path)
            if modifier.get("modifierType") != 5 or modifier.get("modifyAttributeType") != 0:
                raise ValueError(f"{modifier_path}: unsupported trust attribute modifier mode")
            attribute = BUILD_ATTRIBUTE_TYPES.get(modifier.get("attrType"))
            if attribute is None:
                raise ValueError(
                    f"{modifier_path}.attrType: unsupported attribute {modifier.get('attrType')!r}"
                )
            value = require_number(modifier.get("attrValue"), f"{modifier_path}.attrValue")
            if not value.is_integer():
                raise ValueError(f"{modifier_path}.attrValue: expected integer")
            attributes.append(attribute)
            values.append(int(value))
        if len(set(attributes)) != len(attributes):
            raise ValueError(f"{node_path}: duplicate trust attribute")
        if len(set(values)) != 1:
            raise ValueError(f"{node_path}: trust attributes must share one node value")
        nodes_by_stage[stage] = (tuple(attributes), values[0])

    if set(nodes_by_stage) != set(TRUST_BREAK_STAGES):
        raise ValueError(
            f"{path}.talentNodeMap: expected trust break stages {list(TRUST_BREAK_STAGES)}, "
            f"got {sorted(nodes_by_stage)}"
        )
    ordered = [nodes_by_stage[stage] for stage in TRUST_BREAK_STAGES]
    target_attributes = ordered[0][0]
    if any(attributes != target_attributes for attributes, _ in ordered[1:]):
        raise ValueError(f"{path}.talentNodeMap: trust attributes differ between break stages")
    result = {
        "values": tuple(value for _, value in ordered),
        "attributes": target_attributes,
    }
    if result == {
        "values": DEFAULT_TRUST_ATTRIBUTE_BONUS["values"],
        "attributes": (main_attribute,),
    }:
        return None
    return result


def typescript_identifier(slug: str) -> str:
    parts = slug.split("-")
    if not parts or any(not part or not part.replace("_", "").isalnum() for part in parts):
        raise ValueError(f"invalid operator slug for TypeScript identifier: {slug!r}")
    return parts[0] + "".join(part[0].upper() + part[1:] for part in parts[1:])


def render_skill_groups(
    operator: dict[str, Any],
    skills: list[SkillSource],
) -> list[str]:
    skill_by_key = {skill.key: skill for skill in skills}
    if len(skill_by_key) != len(skills):
        raise ValueError(f"{operator['slug']}.skills: duplicate stable skill key")
    result: list[str] = []
    for raw_group in require_list(operator.get("skillGroups"), f"{operator['slug']}.skillGroups"):
        group = require_dict(raw_group, f"{operator['slug']}.skillGroups[]")
        key = str(group["key"])
        skill_type = str(group["skillType"])
        level_source = str(group["levelSource"])
        skill_keys = [str(item) for item in require_list(group.get("skillKeys"), f"skillGroups.{key}.skillKeys")]
        if not skill_keys:
            raise ValueError(f"skillGroups.{key}: expected at least one skill")
        try:
            referenced_skills = [skill_by_key[skill_key] for skill_key in skill_keys]
        except KeyError as error:
            raise ValueError(f"skillGroups.{key}: unknown skill key {error.args[0]!r}") from error
        if any(skill.skillType != skill_type for skill in referenced_skills):
            raise ValueError(f"skillGroups.{key}: skill type does not match referenced skills")
        references = [generated_skill_name(operator, skill.key) for skill in referenced_skills]
        skills_source = references[0] if len(references) == 1 else f"[{', '.join(references)}]"
        result.append(
            "{ "
            f"key: {ts_inline_literal(key)}, skillType: {ts_inline_literal(skill_type)}, "
            f"levelSource: {ts_inline_literal(level_source)}, skills: {skills_source} "
            "}"
        )
    return result


def validate_skill_groups(
    operator: dict[str, Any],
    skills: list[SkillSource],
    growth: dict[str, Any],
    path: str,
) -> None:
    skill_by_key = {skill.key: skill for skill in skills}
    expected_by_type: dict[int, list[str]] = {}
    referenced_keys: list[str] = []
    for raw_group in require_list(operator.get("skillGroups"), f"{operator['slug']}.skillGroups"):
        group = require_dict(raw_group, f"{operator['slug']}.skillGroups[]")
        group_type = require_non_negative_int(group.get("nativeGroupType"), "nativeGroupType")
        skill_keys = [str(item) for item in require_list(group.get("skillKeys"), "skillKeys")]
        for key in skill_keys:
            if key not in skill_by_key:
                raise ValueError(f"{operator['slug']}.skillGroups: unknown skill key {key!r}")
            expected_by_type.setdefault(group_type, []).append(skill_by_key[key].skillId)
            referenced_keys.append(key)
    if len(referenced_keys) != len(set(referenced_keys)):
        raise ValueError(f"{operator['slug']}.skillGroups: a skill is assigned more than once")
    if set(referenced_keys) != set(skill_by_key):
        missing = sorted(set(skill_by_key).difference(referenced_keys))
        raise ValueError(f"{operator['slug']}.skillGroups: unassigned skills {missing}")
    actual_by_type: dict[int, list[str]] = {}
    for raw_group in require_dict(growth.get("skillGroupMap"), f"{path}.skillGroupMap").values():
        group = require_dict(raw_group, f"{path}.skillGroupMap[]")
        group_type = require_non_negative_int(group.get("skillGroupType"), "skillGroupType")
        skill_ids = [str(item) for item in require_list(group.get("skillIdList"), "skillIdList")]
        if group_type in actual_by_type:
            raise ValueError(f"{path}.skillGroupMap: duplicate group type {group_type}")
        actual_by_type[group_type] = skill_ids
    if actual_by_type != expected_by_type:
        raise ValueError(
            f"{path}.skillGroupMap does not match generated skill sources: "
            f"expected {expected_by_type}, got {actual_by_type}"
        )


def parse_combo_skill_registrations(
    operator: dict[str, Any],
    skills: list[SkillSource],
) -> list[dict[str, Any]] | None:
    """严格读取人工声明的首段连携入口，不在 Python 中复制条件树类型系统。"""
    raw_registrations = operator.get("comboSkillRegistrations")
    if raw_registrations is None:
        return None

    registrations = require_list(
        raw_registrations,
        f"{operator['slug']}.comboSkillRegistrations",
    )
    if not registrations:
        raise ValueError(f"{operator['slug']}.comboSkillRegistrations: expected non-empty array")

    skill_keys = {skill.key for skill in skills}
    parsed: list[dict[str, Any]] = []
    seen_skill_keys: set[str] = set()
    for index, value in enumerate(registrations):
        path = f"{operator['slug']}.comboSkillRegistrations[{index}]"
        registration = require_dict(value, path)
        unknown = set(registration).difference({"skillKey", "priority", "blackboard", "rules"})
        if unknown:
            raise ValueError(f"{path}: unexpected fields {sorted(unknown)}")

        skill_key = registration.get("skillKey")
        if not isinstance(skill_key, str) or skill_key not in skill_keys:
            raise ValueError(f"{path}.skillKey: expected a generated skill key")
        if skill_key in seen_skill_keys:
            raise ValueError(f"{path}.skillKey: duplicate registration for {skill_key!r}")
        seen_skill_keys.add(skill_key)

        priority = registration.get("priority")
        if priority not in {"default", "firstBlackboard", "enemyRank"}:
            raise ValueError(f"{path}.priority: unsupported combo priority")
        if registration.get("blackboard") is not None:
            require_dict(registration["blackboard"], f"{path}.blackboard")

        rules = require_list(registration.get("rules"), f"{path}.rules")
        if not rules:
            raise ValueError(f"{path}.rules: expected non-empty array")
        for rule_index, rule_value in enumerate(rules):
            rule_path = f"{path}.rules[{rule_index}]"
            rule = require_dict(rule_value, rule_path)
            unknown_rule = set(rule).difference({"trigger", "condition", "castImmediately"})
            if unknown_rule:
                raise ValueError(f"{rule_path}: unexpected fields {sorted(unknown_rule)}")
            if "castImmediately" in rule:
                require_bool(rule["castImmediately"], f"{rule_path}.castImmediately")

            trigger = require_dict(rule.get("trigger"), f"{rule_path}.trigger")
            trigger_kind = trigger.get("kind")
            expected_trigger_fields = {
                "damageTagHit": {"kind", "tag", "scope"},
                "elementalInflictionApplied": {"kind", "elements", "scope"},
            }.get(trigger_kind)
            if expected_trigger_fields is None:
                raise ValueError(f"{rule_path}.trigger.kind: unsupported combo trigger")
            if set(trigger) != expected_trigger_fields:
                raise ValueError(
                    f"{rule_path}.trigger: expected fields {sorted(expected_trigger_fields)}, "
                    f"got {sorted(trigger)}"
                )
            if trigger.get("scope") not in {"operator", "team"}:
                raise ValueError(f"{rule_path}.trigger.scope: unsupported trigger scope")

        parsed.append(registration)
    return parsed


def render_operator_definition(
    operator: dict[str, Any],
    skills: list[SkillSource],
    character_table: dict[str, Any],
    growth_table: dict[str, Any],
    potential_table: dict[str, Any],
    effects: dict[str, Any],
    buff_definitions: tuple[BuffDefinitionSource, ...] = (),
    passive_skills: dict[str, PassiveSkillSource] | None = None,
) -> str:
    char_id = str(operator["charId"])
    character = table_row(character_table, char_id, "CharacterTable")
    growth = table_row(growth_table, char_id, "CharGrowthTable")
    attributes = parse_panel_attributes(character, f"CharacterTable.{char_id}")
    weapon_type = WEAPON_TYPE_MAP.get(character.get("weaponType"))
    element = ELEMENT_TYPE_MAP.get(character.get("charTypeId"))
    role = PROFESSION_MAP.get(character.get("profession"))
    main_attribute = ATTRIBUTE_TYPE_MAP.get(character.get("mainAttrType"))
    secondary_attribute = ATTRIBUTE_TYPE_MAP.get(character.get("subAttrType"))
    if None in {weapon_type, element, role, main_attribute, secondary_attribute}:
        raise ValueError(f"{char_id}: unsupported operator metadata enum")
    identifier = typescript_identifier(str(operator["slug"]))
    operator_export_name = f"{identifier}GeneratedOperator"
    definitions_by_id = {definition.buffId: definition for definition in buff_definitions}
    passive_skills = passive_skills or {}
    skill_entries, damage_type_factories = compile_skill_entries(
        operator,
        skills,
        definitions_by_id,
    )
    validate_skill_groups(operator, skills, growth, f"CharGrowthTable.{char_id}")
    groups = render_skill_groups(operator, skills)
    combo_skill_registrations = parse_combo_skill_registrations(operator, skills)
    talents = render_talents(
        operator, skills, growth, effects, passive_skills, definitions_by_id
    )
    potentials = render_potentials(
        operator,
        skills,
        potential_table,
        effects,
        passive_skills,
        definitions_by_id,
    )
    trust_attribute_bonus = parse_trust_attribute_bonus(
        growth,
        main_attribute,
        f"CharGrowthTable.{char_id}",
    )
    attribute_lines = [f"    {key}: {ts_inline_literal(value)}," for key, value in attributes.items()]
    helper_imports = collect_definition_helpers(skill_entries, damage_type_factories)
    conversion_support = parse_conversion_support(operator)
    return "\n".join(
        [
            "/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */",
            "import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';",
            f"import {{ {helper_imports} }} from '../definitionHelpers';",
            "",
            "// prettier-ignore",
            *render_named_skills(operator, skill_entries),
            f"export const {operator_export_name}: OperatorDefinition = {{",
            f"  slug: {ts_inline_literal(operator['slug'])},",
            f"  gameId: {ts_inline_literal(str(character['engName']).upper())},",
            f"  rarity: {require_non_negative_int(character.get('rarity'), f'{char_id}.rarity')},",
            f"  weaponType: {ts_inline_literal(weapon_type)},",
            f"  element: {ts_inline_literal(element)},",
            f"  role: {ts_inline_literal(role)},",
            f"  mainAttribute: {ts_inline_literal(main_attribute)},",
            f"  secondaryAttribute: {ts_inline_literal(secondary_attribute)},",
            "  attributes: {",
            *attribute_lines,
            "  },",
            *(
                [f"  trustAttributeBonus: {ts_inline_literal(trust_attribute_bonus)},"]
                if trust_attribute_bonus is not None
                else []
            ),
            "  skillGroups: [",
            *(f"    {group}," for group in groups),
            "  ],",
            *(
                [
                    "  comboSkillRegistrations: "
                    f"{ts_inline_literal(combo_skill_registrations)},"
                ]
                if combo_skill_registrations is not None
                else []
            ),
            "  talents: [",
            *(textwrap.indent(talent, "    ") + "," for talent in talents),
            "  ],",
            "  potentials: [",
            *(textwrap.indent(potential, "    ") + "," for potential in potentials),
            "  ],",
            f"  conversionSupport: {ts_inline_literal(conversion_support)},",
            "};",
            "",
        ]
    )
def render_report(
    slug: str,
    skills: list[SkillSource],
    buff_definitions: tuple[BuffDefinitionSource, ...],
    passive_skills: dict[str, PassiveSkillSource] | None = None,
    passive_generation_issues: dict[str, tuple[str, ...]] | None = None,
) -> str:
    passive_skills = passive_skills or {}
    passive_generation_issues = passive_generation_issues or {}
    report = {
        "operator": slug,
        "complete": all(
            not skill.unresolvedCombatActions
            and not skill.blackboardKeys
            and not skill.conditionalActions
            for skill in skills
        )
        and not passive_generation_issues,
        "buffDefinitions": [
            serialize_audit_value(definition) for definition in buff_definitions
        ],
        **(
            {
                "passiveSkills": [
                    {
                        **serialize_audit_value(passive_skills[key]),
                        "generationIssues": list(passive_generation_issues.get(key, ())),
                    }
                    for key in sorted(passive_skills)
                ]
            }
            if passive_skills
            else {}
        ),
        "skills": [
            {
                "key": skill.key,
                "skillId": skill.skillId,
                "sourceFile": skill.sourceFile,
                "timelineBlockFrames": skill.timelineBlockFrames,
                "blockBoundarySource": skill.blockBoundarySource,
                "directDamageHits": [asdict(hit) for hit in skill.directDamageHits],
                "conditionalActions": [
                    serialize_audit_value(action) for action in skill.conditionalActions
                ],
                "auxiliaryActions": [
                    serialize_audit_value(action) for action in skill.auxiliaryActions
                ],
                "blackboardCalculations": [
                    asdict(calculation) for calculation in skill.blackboardCalculations
                ],
                "blackboardMutations": [
                    asdict(mutation) for mutation in skill.blackboardMutations
                ],
                "buffBlackboardReads": [asdict(read) for read in skill.buffBlackboardReads],
                "buffFinishes": [asdict(finish) for finish in skill.buffFinishes],
                "buffHolds": [asdict(hold) for hold in skill.buffHolds],
                "resourceGains": [asdict(gain) for gain in skill.resourceGains],
                "projectileLaunches": [asdict(launch) for launch in skill.projectileLaunches],
                "projectileTriggeredSkills": [
                    omit_empty_execution_frames(hit) for hit in skill.projectileTriggeredSkills
                ],
                "abilityEntityHits": [
                    omit_empty_execution_frames(hit) for hit in skill.abilityEntityHits
                ],
                "referencedBuffIds": skill.referencedBuffIds,
                "resolvedDamageHits": [asdict(hit) for hit in collect_resolved_damage_hits(skill)],
                "resolvedSchedule": [
                    {
                        "frame": item.frame,
                        "actionOrder": item.actionOrder,
                        "sequenceOrder": item.sequenceOrder,
                        "itemType": item.itemType,
                        "sourcePath": item.sourcePath,
                    }
                    for item in collect_resolved_schedule(skill)
                ],
                "blackboardKeys": skill.blackboardKeys,
                "blackboardProvenance": [
                    asdict(provenance) for provenance in skill.blackboardProvenance
                ],
                "targetGroupWrites": [
                    asdict(write) for write in skill.targetGroupWrites
                ],
                "timeDilations": [asdict(action) for action in skill.timeDilations],
                "unresolvedCombatActions": skill.unresolvedCombatActions,
            }
            for skill in skills
        ],
    }
    return json.dumps(report, ensure_ascii=False, indent=2) + "\n"


def write_or_check(path: Path, content: str, check: bool) -> None:
    if check:
        current = path.read_text(encoding="utf-8") if path.is_file() else None
        if current != content:
            raise RuntimeError(f"generated output is stale: {path}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")


def remove_obsolete_generated_file(path: Path, check: bool) -> None:
    """删除已被统一产物取代的旧文件；检查模式下把残留视为过期。"""
    if not path.exists():
        return
    if check:
        raise RuntimeError(f"obsolete generated output still exists: {path}")
    path.unlink()


def main() -> None:
    args = parse_args()
    manifest = require_dict(json.loads(args.manifest.read_text(encoding="utf-8")), str(args.manifest))
    patch_path = args.tables / "SkillPatchTable.json"
    patch_table = require_dict(json.loads(patch_path.read_text(encoding="utf-8")), str(patch_path))
    table_names = (
        "CharacterTable.json",
        "CharGrowthTable.json",
        "CharacterPotentialTable.json",
        "PotentialTalentEffectTable.json",
    )
    loaded_tables = {
        name: require_dict(
            json.loads((args.tables / name).read_text(encoding="utf-8")),
            str(args.tables / name),
        )
        for name in table_names
    }
    selected = set(args.operators or [])
    generated = 0
    for raw_operator in require_list(manifest.get("operators"), "operators"):
        operator = require_dict(raw_operator, "operators[]")
        slug = str(operator["slug"])
        if selected and slug not in selected:
            continue
        skills = [
            parse_skill(require_dict(entry, f"{slug}.skills[]"), args.source, patch_table)
            for entry in require_list(operator["skills"], f"{slug}.skills")
        ]
        char_id = str(operator["charId"])
        growth = table_row(loaded_tables["CharGrowthTable.json"], char_id, "CharGrowthTable")
        passive_skills = collect_operator_passive_skills(
            char_id,
            growth,
            loaded_tables["CharacterPotentialTable.json"],
            loaded_tables["PotentialTalentEffectTable.json"],
            args.source,
        )
        buff_source_dir = args.source.parent / "BuffData"
        skill_buff_definitions = resolve_operator_buff_definitions(
            skills,
            buff_source_dir,
        )
        passive_buff_definitions, passive_buff_resolution_issues = (
            resolve_passive_buff_definitions(passive_skills, buff_source_dir)
        )
        audited_buff_definitions_by_id = {
            definition.buffId: definition
            for definition in (*skill_buff_definitions, *passive_buff_definitions)
        }
        audited_buff_definitions = tuple(
            audited_buff_definitions_by_id[key]
            for key in sorted(audited_buff_definitions_by_id)
        )
        passive_generation_issues = audit_passive_skill_generation(
            passive_skills,
            audited_buff_definitions,
            passive_buff_resolution_issues,
        )
        renderable_passive_skills = {
            skill_id: passive
            for skill_id, passive in passive_skills.items()
            if skill_id not in passive_generation_issues
        }
        renderable_passive_buff_ids = {
            buff_id
            for passive in renderable_passive_skills.values()
            for buff_id in passive.referenced_buff_ids
        }
        buff_definitions_by_id = {
            definition.buffId: definition for definition in skill_buff_definitions
        }
        buff_definitions_by_id.update(
            {
                definition.buffId: definition
                for definition in passive_buff_definitions
                if definition.buffId in renderable_passive_buff_ids
            }
        )
        buff_definitions = tuple(
            buff_definitions_by_id[key] for key in sorted(buff_definitions_by_id)
        )
        write_or_check(
            args.output / f"{slug}.generated.ts",
            render_typescript(str(operator["exportName"]), slug, skills, buff_definitions),
            args.check,
        )
        write_or_check(
            args.output / f"{slug}.audit.json",
            render_report(
                slug,
                skills,
                buff_definitions,
                passive_skills,
                passive_generation_issues,
            ),
            args.check,
        )
        output_stage = operator.get("outputStage", "complete")
        if output_stage == "audit":
            write_or_check(
                args.output / f"{slug}.skills.audit.generated.ts",
                # 审计产物允许保留尚未闭环的 Buff 身份；完整事实仍在同名 audit.json 中。
                render_compiled_skills(operator, skills),
                args.check,
            )
            generated += 1
            print(f"[{slug}] audited {len(skills)} skills -> {args.output}")
            continue
        if output_stage != "complete":
            raise ValueError(f"{slug}.outputStage: expected 'audit' or 'complete'")
        remove_obsolete_generated_file(args.output / f"{slug}.skills.generated.ts", args.check)
        write_or_check(
            args.output / f"{slug}.operator.generated.ts",
            render_operator_definition(
                operator,
                skills,
                loaded_tables["CharacterTable.json"],
                loaded_tables["CharGrowthTable.json"],
                loaded_tables["CharacterPotentialTable.json"],
                loaded_tables["PotentialTalentEffectTable.json"],
                buff_definitions,
                renderable_passive_skills,
            ),
            args.check,
        )
        print(f"[{slug}] generated {len(skills)} skills -> {args.output}")
        generated += 1
    if selected and generated != len(selected):
        missing = selected.difference(
            str(item.get("slug")) for item in require_list(manifest.get("operators"), "operators") if isinstance(item, dict)
        )
        raise ValueError(f"unknown operators: {', '.join(sorted(missing))}")


if __name__ == "__main__":
    main()
