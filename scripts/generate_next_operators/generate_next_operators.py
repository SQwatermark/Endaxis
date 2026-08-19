"""从解包 SkillData 生成 Next 干员数据的可审计中间层。"""

from __future__ import annotations

import argparse
import json
import math
import re
import textwrap
from collections import Counter
from dataclasses import asdict, fields, is_dataclass, replace
from pathlib import Path
from types import SimpleNamespace
from typing import Any, Iterable, Iterator, Literal, cast

from compiler_ir import (
    CompiledNode,
    EMPTY_SEQUENCE as COMPILED_EMPTY_SEQUENCE,
    render as render_compiled_node,
    render_sequence_children as render_compiled_sequence_children,
)
from conditional_compiler import (
    ConditionalCompileContext,
    ConditionalCompiler,
    ConditionalCompilerServices,
)
from combat_condition_compiler import (
    CombatConditionServices,
    compile_combat_condition as compile_combat_condition_backend,
    compile_combat_condition_group as compile_combat_condition_group_backend,
)
from conditional_leaf_compiler import (
    ConditionalLeafServices,
    compile_conditional_branch_action as compile_conditional_branch_action_backend,
)
from resolved_sequence_compiler import (
    ResolvedSequenceAnalysisServices,
    ResolvedSequenceServices,
    ResolvedSequenceStepServices,
    compile_resolved_sequence as compile_resolved_sequence_backend,
)
from resolved_schedule_collector import (
    ResolvedScheduleCollectorServices,
    collect_ability_entity_schedule as collect_ability_entity_schedule_backend,
    collect_projectile_schedule as collect_projectile_schedule_backend,
    collect_resolved_damage_hits as collect_resolved_damage_hits_backend,
    collect_resolved_schedule as collect_resolved_schedule_backend,
    native_condition_sequence_order as native_condition_sequence_order_backend,
    native_sequence_order as native_sequence_order_backend,
)
from damage_step_compiler import (
    DamageStepCompilerServices,
    compile_damage_units_step as compile_damage_units_step_backend,
    compile_direct_damage as compile_direct_damage_backend,
    compile_projectile_damage as compile_projectile_damage_backend,
    compile_resolved_damage_steps as compile_resolved_damage_steps_backend,
    encode_damage_step_key as encode_damage_step_key_backend,
    encode_step_key_parts as encode_step_key_parts_backend,
    validate_ignored_recursive_projectile_conditions as validate_ignored_recursive_projectile_conditions_backend,
)
from buff_application_compiler import (
    BuffApplicationCompilerServices,
    compile_aura_action as compile_aura_action_backend,
    compile_buff_application as compile_buff_application_backend,
    compile_buff_application_values as compile_buff_application_values_backend,
)
from skill_source_builder import (
    SkillSourceBuilderServices,
    parse_skill as parse_skill_backend,
)
from audit_report_renderer import (
    AuditReportRendererServices,
    render_report as render_report_backend,
)
from operator_definition_renderer import (
    OperatorDefinitionRendererServices,
    render_operator_definition as render_operator_definition_backend,
)
from generation_pipeline import (
    GenerationPipelineServices,
    run_generation as run_generation_backend,
)
from ability_entity_child_compiler import (
    AbilityEntityChildServices,
    compile_ability_entity_child_skill as compile_ability_entity_child_skill_backend,
)
from inline_buff_compiler import (
    InlineBuffServices,
    compile_inline_buff_behaviors as compile_inline_buff_behaviors_backend,
    compile_inline_buff_event_responses as compile_inline_buff_event_responses_backend,
    compile_inline_buff_scheduled_sequences as compile_inline_buff_scheduled_sequences_backend,
)
from buff_event_parser import (
    BuffEventParserServices,
    parse_buff_event_actions as parse_buff_event_actions_backend,
    parse_buff_ignite_event_actions as parse_buff_ignite_event_actions_backend,
    parse_buff_skill_replacements as parse_buff_skill_replacements_backend,
    parse_skill_event_listeners as parse_skill_event_listeners_backend,
)
from buff_definition_parser import (
    BuffDefinitionParserServices,
    collect_unparsed_buff_payloads as collect_unparsed_buff_payloads_backend,
    parse_buff_apply_tag_ids as parse_buff_apply_tag_ids_backend,
    parse_buff_attribute_modifiers as parse_buff_attribute_modifiers_backend,
    parse_buff_damage_modifiers as parse_buff_damage_modifiers_backend,
    parse_buff_extend_tag_ids as parse_buff_extend_tag_ids_backend,
    parse_buff_lifecycle as parse_buff_lifecycle_backend,
    parse_buff_source_death_finish as parse_buff_source_death_finish_backend,
    parse_buff_start_vulnerability as parse_buff_start_vulnerability_backend,
    resolve_buff_definitions as resolve_buff_definitions_backend,
)
from projectile_graph_parser import (
    ProjectileGraphParserServices,
    collect_projected_conditional_projectile_skills,
    contains_equivalent_projectile_projection,
    is_projectile_trigger_excluded_for_single_enemy as is_projectile_trigger_excluded_for_single_enemy_backend,
    parse_projectile_launches as parse_projectile_launches_backend,
    projectile_projections_are_equivalent,
    resolve_conditional_projectile_triggers as resolve_conditional_projectile_triggers_backend,
    resolve_projectile_payload_triggers as resolve_projectile_payload_triggers_backend,
    resolve_projectile_triggered_skills as resolve_projectile_triggered_skills_backend,
    select_projectile_triggers_for_single_enemy,
)
from ability_entity_graph_parser import (
    AbilityEntityGraphParserServices,
    contains_structured_aura as contains_structured_aura_backend,
    guaranteed_ability_entity_spawns as guaranteed_ability_entity_spawns_backend,
    guaranteed_projectile_projections as guaranteed_projectile_projections_backend,
    is_single_enemy_ability_entity_projection as is_single_enemy_ability_entity_projection_backend,
    mark_projected_conditional_children as mark_projected_conditional_children_backend,
    resolve_ability_entity_hits as resolve_ability_entity_hits_backend,
    resolve_ability_entity_payload as resolve_ability_entity_payload_backend,
    resolve_conditional_aura_ability_entity_children as resolve_conditional_aura_ability_entity_children_backend,
    resolve_guaranteed_conditional_ability_entity_hits as resolve_guaranteed_conditional_ability_entity_hits_backend,
)
from aura_action_parser import (
    AuraActionParserServices,
    parse_aura_actions as parse_aura_actions_backend,
    parse_buff_aura_actions as parse_buff_aura_actions_backend,
)
from target_group_parser import parse_target_group_writes as parse_target_group_writes_backend
from skill_action_fact_parser import (
    SkillActionFactParserServices,
    parse_auxiliary_actions as parse_auxiliary_actions_backend,
    parse_blackboard_runtime_actions as parse_blackboard_runtime_actions_backend,
    parse_timeline_jumps as parse_timeline_jumps_backend,
)

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
    ProjectileSkillTriggerSource,
    ProjectileTriggeredSkillSource,
    ProjectileLaunchSource,
    TimedIntervalDamageSource,
    TimedAbilityEntityFinishSource,
    TimedTimelineJumpSource,
    AbilityEntityHitSource,
    AbilityEntityTimeDilationTargetSource,
    ResolvedDamageHitSource,
    ResolvedScheduleItemSource,
    BuffLifecycleSource,
    BuffDefinitionSource,
    BuffSkillReplacementSource,
    TimedSkillReplacementSource,
    BuffSourceDeathFinishSource,
    UnparsedBuffPayloadSource,
    BuffAttributeModifierSource,
    BuffDamageModifierSource,
    BuffDamageNumberComparisonSource,
    BuffDamageScaleProcessorSource,
    BuffEventActionSource,
    BuffEventForEachSource,
    BuffEventSkillCastSource,
    BuffEventTargetGroupWriteSource,
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
    AuraActionSource,
    TimedMarkerApplicationPayload,
    GlobalCooldownApplicationPayload,
    ResourceGainPayload,
    ProjectileLaunchPayload,
    ConditionalProjectileProjection,
    AbilityEntitySpawnPayload,
    AbilityEntityDurationAssignmentPayload,
    ConditionalBranchActionSource,
    ConditionalActionSource,
    SequenceGuardActionSource,
    SwitchActionSource,
    DoOnceActionSource,
    ForEachContextActionSource,
    UnconditionalActionSource,
    EveryFrameActionSource,
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
    indent_source,
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
    parse_timeline_jump_condition,
    parse_legacy_buff_finish_payload,
)
from source_schema import (
    KNOWN_TARGET_FINDER_TYPES,
    KNOWN_TARGET_POST_PROCESSOR_TYPES,
    KNOWN_TARGET_VALIDATOR_TYPES,
)
from target_parser import (
    parse_target_reference,
    selector_component_name,
)
from buff_definition_compiler import (
    compile_inline_buff_definition,
    is_strictly_presentation_only_buff,
)
from keyword_action_parser import parse_timed_keyword_actions
from time_dilation_parser import parse_time_dilation_action



SCRIPT_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = SCRIPT_DIR.parents[1]
DEFAULT_MANIFEST = SCRIPT_DIR / "operators.json"
DEFAULT_SOURCE = REPOSITORY_ROOT.parent / "vfs-index-browser" / "combat-spec" / "artifacts" / "skill-data-cdn"
DEFAULT_TABLES = (
    REPOSITORY_ROOT.parent
    / "vfs-index-browser"
    / "combat-spec"
    / "artifacts"
    / "TableCfg-1.4.4-9433094-12"
)
DEFAULT_OUTPUT = REPOSITORY_ROOT / "src" / "next" / "data" / "operators" / "generated"
DEFAULT_ABILITY_ENTITY_TEMPLATE_EVIDENCE = (
    REPOSITORY_ROOT
    / "src"
    / "next"
    / "data"
    / "ability-entities"
    / "ability-entity-templates-1.4.4.json"
)

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
        "enemyRank",
        "targetIdentity",
        "distance",
        "entityTag",
        "timedMarker",
        "globalCooldown",
        "skillHasHit",
        "abilityEntityDuration",
        "nestedCondition",
        "targetFinderType",
        "finderSpawnedObjectType",
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
        "interrupt",
        "projectileLaunch",
        "projectileTriggeredSkills",
        "abilityEntitySpawn",
        "abilityEntityDurationAssignment",
        "conditionalAbilityEntityHits",
        "damageUnits",
        "keywordAction",
        "projectedAbilityEntitySpawns",
        "projectedProjectileLaunches",
        "characterTeamSelectionRole",
        "heal",
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
        "validatorTagQueries",
        "skillReplacements",
        "obtainAtbFilters",
    }
)

# 这些字段只服务于生成期归约，不属于可审计的游戏源数据。
INTERNAL_SOURCE_KEYS = frozenset({"localTargetGroupWrites"})
TARGET_GROUP_WRITE_INTERNAL_KEYS = frozenset(
    {
        "finderFixedPointSnapToNavmesh",
        "center",
        "centerContextKey",
        "selectorOwner",
        "selectorOwnerContextKey",
    }
)


def serialize_audit_value(value: Any) -> Any:
    """序列化审计对象，并省略仅对特定条件有意义的空详情。"""
    if isinstance(value, TargetGroupWriteSource):
        return serialize_audit_value(
            {
                key: item
                for key, item in (
                    (field.name, getattr(value, field.name)) for field in fields(value)
                )
                if key not in TARGET_GROUP_WRITE_INTERNAL_KEYS
            }
        )
    if hasattr(value, "__dataclass_fields__"):
        return serialize_audit_value(
            {field.name: getattr(value, field.name) for field in fields(value)}
        )
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
    if isinstance(value, TargetGroupWriteSource):
        return omit_empty_execution_frames(
            {
                key: item
                for key, item in (
                    (field.name, getattr(value, field.name)) for field in fields(value)
                )
                if key not in TARGET_GROUP_WRITE_INTERNAL_KEYS
            }
        )
    if hasattr(value, "__dataclass_fields__"):
        return omit_empty_execution_frames(
            {field.name: getattr(value, field.name) for field in fields(value)}
        )
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


def skill_contains_ability_entity_timeline_jumps(skill: SkillSource) -> bool:
    """递归确认技能是否仍把 AbilityEntity JumpToAction 留在父投影中。"""
    found = False

    def visit_entities(entities: Iterable[AbilityEntityHitSource]) -> None:
        nonlocal found
        for entity in entities:
            jumps = entity.timelineJumps
            if jumps and (
                not all(timeline_jump_can_compile(jump, entity) for jump in jumps)
                or not ability_entity_child_finishes_are_terminal(entity)
            ):
                found = True
                return
            visit_entities(entity.nestedAbilityEntityHits)
            visit_projectiles(entity.projectileTriggeredSkills)

    def visit_projectiles(projectiles: Iterable[ProjectileTriggeredSkillSource]) -> None:
        nonlocal found
        for projectile in projectiles:
            visit_entities(projectile.abilityEntityHits)
            visit_projectiles(projectile.nestedProjectileTriggeredSkills)
            if found:
                return

    visit_entities(skill.abilityEntityHits)
    visit_projectiles(skill.projectileTriggeredSkills)
    return found


def infer_unmodeled_progression_capabilities(
    operator: dict[str, Any],
    skills: Iterable[SkillSource] = (),
) -> list[dict[str, Any]]:
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
    jump_skill_keys = [
        skill.key for skill in skills if skill_contains_ability_entity_timeline_jumps(skill)
    ]
    if jump_skill_keys:
        existing = next(
            (
                item
                for item in inferred
                if item["capability"] == "skillBehavior"
            ),
            None,
        )
        if existing is None:
            inferred.append(
                {"capability": "skillBehavior", "skillGroupKeys": jump_skill_keys}
            )
        else:
            existing["skillGroupKeys"] = list(
                dict.fromkeys([*existing["skillGroupKeys"], *jump_skill_keys])
            )
    return inferred


def parse_conversion_support(
    operator: dict[str, Any],
    skills: Iterable[SkillSource] = (),
) -> dict[str, Any]:
    """读取面向产物的稳定摘要，并拒绝漏报清单中明确未建模的养成效果。"""
    inferred = infer_unmodeled_progression_capabilities(operator, skills)
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
    omitted: list[dict[str, Any]] = []
    for inferred_item in inferred:
        declared = [
            item for item in missing if item["capability"] == inferred_item["capability"]
        ]
        if not declared:
            omitted.append(inferred_item)
            continue
        inferred_keys = set(inferred_item.get("skillGroupKeys", ()))
        if not inferred_keys:
            continue
        if any("skillGroupKeys" not in item for item in declared):
            continue
        declared_keys = {
            key for item in declared for key in item.get("skillGroupKeys", ())
        }
        uncovered_keys = sorted(inferred_keys - declared_keys)
        if uncovered_keys:
            omitted.append(
                {
                    "capability": inferred_item["capability"],
                    "skillGroupKeys": uncovered_keys,
                }
            )
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
    *,
    include_dynamic_defaults: bool = False,
) -> dict[str, tuple[float, ...]]:
    """提供数值声明；动态初值只在明确请求的局部子图解析中参与来源证明。"""
    return {
        item.key: (item.value,)
        for item in values
        if (include_dynamic_defaults or not item.isDynamic)
        and isinstance(item.value, float)
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


def _make_projectile_graph_parser_services() -> ProjectileGraphParserServices:
    return ProjectileGraphParserServices(
        load_projected_skill_data=load_projected_skill_data,
        numeric_declared_blackboard=numeric_declared_blackboard,
        parse_aura_actions=parse_aura_actions,
        parse_auxiliary_actions=parse_auxiliary_actions,
        parse_declared_blackboard=parse_declared_blackboard,
        parse_direct_damage_hits=parse_direct_damage_hits,
        parse_inflictions=parse_inflictions,
        parse_resource_gains=parse_resource_gains,
        resolve_ability_entity_hits=resolve_ability_entity_hits,
        resolve_conditional_aura_ability_entity_children=resolve_conditional_aura_ability_entity_children,
        resolve_guaranteed_conditional_ability_entity_hits=resolve_guaranteed_conditional_ability_entity_hits,
        resolve_projectile_payload_triggers=resolve_projectile_payload_triggers,
        mark_projected_conditional_children=mark_projected_conditional_children,
        walk_actions=walk_actions,
        walk_unconditional_actions=walk_unconditional_actions,
    )


def _make_ability_entity_graph_parser_services() -> AbilityEntityGraphParserServices:
    return AbilityEntityGraphParserServices(
        load_projected_skill_data=load_projected_skill_data,
        numeric_declared_blackboard=numeric_declared_blackboard,
        parse_ability_entity_finishes=parse_ability_entity_finishes,
        parse_aura_actions=parse_aura_actions,
        parse_auxiliary_actions=parse_auxiliary_actions,
        parse_blackboard_calculations=parse_blackboard_calculations,
        parse_blackboard_runtime_actions=parse_blackboard_runtime_actions,
        parse_declared_blackboard=parse_declared_blackboard,
        parse_direct_damage_hits=parse_direct_damage_hits,
        parse_inflictions=parse_inflictions,
        parse_interval_damage_hits=parse_interval_damage_hits,
        parse_projectile_launches=parse_projectile_launches,
        parse_resource_gains=parse_resource_gains,
        parse_target_group_writes=parse_target_group_writes,
        parse_timeline_jumps=parse_timeline_jumps,
        resolve_ability_entity_payload=resolve_ability_entity_payload,
        resolve_conditional_projectile_triggers=resolve_conditional_projectile_triggers,
        resolve_projectile_triggered_skills=resolve_projectile_triggered_skills,
        walk_actions=walk_actions,
        walk_unconditional_actions=walk_unconditional_actions,
    )


def _make_resolved_schedule_collector_services() -> ResolvedScheduleCollectorServices:
    return ResolvedScheduleCollectorServices(
        conditional_action_contains_keyword=conditional_action_contains_keyword,
        filter_once_resource_gains=filter_once_resource_gains,
        logical_ability_entity_spawn_payload_for_compile=(
            logical_ability_entity_spawn_payload_for_compile
        ),
        resource_gain_can_change_value=resource_gain_can_change_value,
    )


def _make_aura_action_parser_services() -> AuraActionParserServices:
    return AuraActionParserServices(walk_actions=walk_actions)


def _make_skill_action_fact_parser_services() -> SkillActionFactParserServices:
    return SkillActionFactParserServices(
        load_projected_skill_data=load_projected_skill_data,
        target_reference_has_plain_selector=target_reference_has_plain_selector,
        target_reference_is_plain=target_reference_is_plain,
        walk_actions=walk_actions,
        walk_unconditional_actions=walk_unconditional_actions,
    )


def _make_damage_step_compiler_services() -> DamageStepCompilerServices:
    return DamageStepCompilerServices(
        compile_buff_blackboard_read=compile_buff_blackboard_read,
        compile_buff_finish=compile_buff_finish,
        compile_infliction=compile_infliction,
        compile_percentage_level_values=compile_percentage_level_values,
        compile_resource_gain=compile_resource_gain,
        compact_level_values=compact_level_values,
        decode_damage_decorate_mask=decode_damage_decorate_mask,
        render_time_dilation_scheduled_entries=render_time_dilation_scheduled_entries,
        require_level_values=require_level_values,
        resolve_skill_cooldown_frames=resolve_skill_cooldown_frames,
        resolve_skill_cost_resource=resolve_skill_cost_resource,
        resolved_scalar_values=resolved_scalar_values,
        damage_type_map=DAMAGE_TYPE_MAP,
        implied_damage_tag_parents=IMPLIED_DAMAGE_TAG_PARENTS,
    )


def _make_buff_application_compiler_services() -> BuffApplicationCompilerServices:
    return BuffApplicationCompilerServices(
        compile_condition_operand=compile_condition_operand,
        compile_inline_buff_behaviors=compile_inline_buff_behaviors,
        compile_inline_buff_scheduled_sequences=compile_inline_buff_scheduled_sequences,
        resolve_fixed_combat_target=resolve_fixed_combat_target,
    )


def _make_skill_source_builder_services() -> SkillSourceBuilderServices:
    return SkillSourceBuilderServices(
        build_blackboard_provenance=build_blackboard_provenance,
        collect_blackboard_keys=collect_blackboard_keys,
        collect_consumed_root_timed_marker_action_ids=collect_consumed_root_timed_marker_action_ids,
        collect_referenced_buff_ids=collect_referenced_buff_ids,
        collect_unresolved_combat_actions=collect_unresolved_combat_actions,
        collect_windows=collect_windows,
        derive_timeline_block=derive_timeline_block,
        load_projected_skill_data=load_projected_skill_data,
        mark_projected_conditional_children=mark_projected_conditional_children,
        parse_aura_actions=parse_aura_actions,
        parse_auxiliary_actions=parse_auxiliary_actions,
        parse_blackboard_calculations=parse_blackboard_calculations,
        parse_blackboard_runtime_actions=parse_blackboard_runtime_actions,
        parse_buff_hold_actions=parse_buff_hold_actions,
        parse_declared_blackboard=parse_declared_blackboard,
        parse_direct_damage_hits=parse_direct_damage_hits,
        parse_inflictions=parse_inflictions,
        parse_physical_inflictions=parse_physical_inflictions,
        parse_projectile_launches=parse_projectile_launches,
        parse_resource_gains=parse_resource_gains,
        parse_skill_event_listeners=parse_skill_event_listeners,
        parse_skill_patch=parse_skill_patch,
        parse_target_group_writes=parse_target_group_writes,
        parse_time_dilations=parse_time_dilations,
        parse_timed_skill_replacements=parse_timed_skill_replacements,
        parse_timeline=parse_timeline,
        resolve_ability_entity_hits=resolve_ability_entity_hits,
        resolve_conditional_aura_ability_entity_children=resolve_conditional_aura_ability_entity_children,
        resolve_conditional_projectile_triggers=resolve_conditional_projectile_triggers,
        resolve_guaranteed_conditional_ability_entity_hits=resolve_guaranteed_conditional_ability_entity_hits,
        resolve_projectile_triggered_skills=resolve_projectile_triggered_skills,
        resolve_skill_blackboard=resolve_skill_blackboard,
    )


def _make_audit_report_renderer_services() -> AuditReportRendererServices:
    return AuditReportRendererServices(
        collect_resolved_damage_hits=collect_resolved_damage_hits,
        collect_resolved_schedule=collect_resolved_schedule,
        derive_skill_slot_replacement_relations=derive_skill_slot_replacement_relations,
        omit_empty_execution_frames=omit_empty_execution_frames,
        serialize_audit_value=serialize_audit_value,
    )


def _make_operator_definition_renderer_services() -> OperatorDefinitionRendererServices:
    return OperatorDefinitionRendererServices(
        parse_panel_attributes=parse_panel_attributes,
        typescript_identifier=typescript_identifier,
        select_runtime_skill_slot_replacement_relations=select_runtime_skill_slot_replacement_relations,
        derive_skill_slot_replacement_relations=derive_skill_slot_replacement_relations,
        compile_skill_entries=compile_skill_entries,
        validate_skill_groups=validate_skill_groups,
        render_skill_groups=render_skill_groups,
        parse_combo_skill_registrations=parse_combo_skill_registrations,
        derive_entity_blackboard_initializers=derive_entity_blackboard_initializers,
        parse_trust_attribute_bonus=parse_trust_attribute_bonus,
        collect_definition_helpers=collect_definition_helpers,
        parse_conversion_support=parse_conversion_support,
        render_named_skills=render_named_skills,
        compile_progression_buff_definition=compile_progression_buff_definition,
        weapon_type_map=WEAPON_TYPE_MAP,
        element_type_map=ELEMENT_TYPE_MAP,
        profession_map=PROFESSION_MAP,
        attribute_type_map=ATTRIBUTE_TYPE_MAP,
    )


def compile_progression_buff_definition(
    source: BuffDefinitionSource,
    path: str,
    buff_definitions: dict[str, BuffDefinitionSource],
) -> str:
    """编译施法者养成 Buff，并复用统一的内联生命周期动作链。"""
    has_event_sequences = any(
        sequence.actions
        for event in source.eventActions
        for sequence in event.sequences
    )
    return compile_inline_buff_definition(
        source,
        path,
        (
            lambda event_source, event_path: compile_inline_buff_behaviors(
                event_source,
                event_path,
                buff_owner_target="caster",
                buff_definitions=buff_definitions,
            )
            if has_event_sequences
            else None
        ),
    )


def _make_generation_pipeline_services() -> GenerationPipelineServices:
    return GenerationPipelineServices(
        audit_passive_skill_generation=audit_passive_skill_generation,
        collect_operator_passive_skills=collect_operator_passive_skills,
        derive_entity_blackboard_initializers=derive_entity_blackboard_initializers,
        derive_skill_slot_replacement_relations=derive_skill_slot_replacement_relations,
        parse_args=parse_args,
        parse_base_passive_skill_ids=parse_base_passive_skill_ids,
        parse_skill=parse_skill,
        remove_obsolete_generated_file=remove_obsolete_generated_file,
        render_compiled_skills=render_compiled_skills,
        render_operator_definition=render_operator_definition,
        render_report=render_report,
        render_typescript=render_typescript,
        resolve_operator_buff_definitions_for_stage=resolve_operator_buff_definitions_for_stage,
        resolve_passive_buff_definitions=resolve_passive_buff_definitions,
        resolve_progression_buff_definitions=resolve_progression_buff_definitions,
        write_or_check=write_or_check,
    )


def is_projectile_trigger_excluded_for_single_enemy(
    root: dict[str, Any],
    launch_frame: int,
    launch_action_index: int,
    trigger_root: dict[str, Any],
    trigger_source_name: str,
) -> bool:
    return is_projectile_trigger_excluded_for_single_enemy_backend(
        root,
        launch_frame,
        launch_action_index,
        trigger_root,
        trigger_source_name,
        services=_make_projectile_graph_parser_services(),
    )


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
                        addend=payload.addend,
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
    return parse_blackboard_runtime_actions_backend(
        root,
        source_name,
        inherited_blackboard,
        services=_make_skill_action_fact_parser_services(),
    )


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


def _make_buff_definition_parser_services() -> BuffDefinitionParserServices:
    return BuffDefinitionParserServices(
        comparison_operator_map=COMPARISON_OPERATOR_MAP,
        decode_damage_decorate_mask=decode_damage_decorate_mask,
        collect_created_buff_ids=collect_created_buff_ids,
        load_projected_skill_data=load_projected_skill_data,
        parse_auxiliary_actions=parse_auxiliary_actions,
        parse_blackboard_calculations=parse_blackboard_calculations,
        parse_blackboard_runtime_actions=parse_blackboard_runtime_actions,
        parse_buff_aura_actions=parse_buff_aura_actions,
        parse_buff_event_actions=parse_buff_event_actions,
        parse_buff_ignite_event_actions=parse_buff_ignite_event_actions,
        parse_buff_skill_replacements=parse_buff_skill_replacements,
        parse_declared_blackboard=parse_declared_blackboard,
        parse_direct_damage_hits=parse_direct_damage_hits,
        parse_inflictions=parse_inflictions,
        parse_resource_gains=parse_resource_gains,
        parse_target_group_writes=parse_target_group_writes,
        resolve_ability_entity_payload=resolve_ability_entity_payload,
        target_reference_is_plain=target_reference_is_plain,
        walk_actions=walk_actions,
    )


def parse_buff_apply_tag_ids(buff: dict[str, Any], source_name: str) -> tuple[int, ...]:
    return parse_buff_apply_tag_ids_backend(buff, source_name)


def parse_buff_extend_tag_ids(buff: dict[str, Any], source_name: str) -> tuple[int, ...]:
    return parse_buff_extend_tag_ids_backend(buff, source_name)


def parse_buff_attribute_modifiers(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[BuffAttributeModifierSource, ...]:
    return parse_buff_attribute_modifiers_backend(buff, source_name, blackboard)


def parse_buff_damage_modifiers(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[tuple[BuffDamageModifierSource, ...], int]:
    return parse_buff_damage_modifiers_backend(
        buff,
        source_name,
        blackboard,
        services=_make_buff_definition_parser_services(),
    )


def parse_buff_start_vulnerability(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[BuffDamageModifierSource, ...]:
    return parse_buff_start_vulnerability_backend(
        buff,
        source_name,
        blackboard,
        services=_make_buff_definition_parser_services(),
    )


def _make_buff_event_parser_services() -> BuffEventParserServices:
    return BuffEventParserServices(
        collect_created_buff_ids=collect_created_buff_ids,
        parse_target_group_writes=parse_target_group_writes,
        walk_actions=walk_actions,
        walk_unconditional_actions=walk_unconditional_actions,
    )


def parse_buff_event_actions(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[BuffEventActionSource, ...]:
    """兼容既有调用方的 Buff 事件解析入口。"""

    return parse_buff_event_actions_backend(
        buff,
        source_name,
        blackboard,
        services=_make_buff_event_parser_services(),
    )


def parse_buff_ignite_event_actions(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[BuffEventActionSource, ...]:
    """兼容既有调用方的 Buff 点燃事件解析入口。"""

    return parse_buff_ignite_event_actions_backend(
        buff,
        source_name,
        blackboard,
        services=_make_buff_event_parser_services(),
    )


def parse_buff_skill_replacements(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[BuffSkillReplacementSource, ...]:
    """兼容既有调用方的 Buff 技能替换解析入口。"""

    return parse_buff_skill_replacements_backend(buff, source_name, blackboard)


def parse_skill_event_listeners(
    root: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[SkillEventListenerSource, ...]:
    """兼容既有调用方的技能事件监听器解析入口。"""

    return parse_skill_event_listeners_backend(
        root,
        source_name,
        blackboard,
        services=_make_buff_event_parser_services(),
    )


def collect_unparsed_buff_payloads(
    buff: dict[str, Any],
    source_name: str,
    unsupported_damage_modifiers: int = 0,
) -> tuple[UnparsedBuffPayloadSource, ...]:
    return collect_unparsed_buff_payloads_backend(
        buff,
        source_name,
        unsupported_damage_modifiers,
    )


def resolve_buff_definitions(
    buff_ids: tuple[str, ...],
    buff_source_dirs: Path | Iterable[Path],
    skill_source_dir: Path | None = None,
    excluded_buff_ids: Iterable[str] = (),
) -> tuple[BuffDefinitionSource, ...]:
    """兼容既有调用方的递归 Buff 定义解析入口。"""

    return resolve_buff_definitions_backend(
        buff_ids,
        buff_source_dirs,
        skill_source_dir,
        excluded_buff_ids,
        services=_make_buff_definition_parser_services(),
    )


def _nested_aura_buff_ids(node: Any) -> set[str]:
    result = {
        buff.buffId
        for aura in getattr(node, "auraActions", ())
        for buff in aura.buffs
    }
    for field in (
        "abilityEntityHits",
        "nestedAbilityEntityHits",
        "projectileTriggeredSkills",
        "nestedProjectileTriggeredSkills",
        "conditionalAbilityEntityHits",
    ):
        for child in getattr(node, field, ()) or ():
            result.update(_nested_aura_buff_ids(child))
    for condition in getattr(node, "conditionalActions", ()):
        result.update(_nested_aura_buff_ids(condition))
    for field in ("succeedActions", "failActions", "onceActions"):
        for action in getattr(node, field, ()) or ():
            result.update(_nested_aura_buff_ids(action))
    nested_condition = getattr(node, "nestedCondition", None)
    if nested_condition is not None:
        result.update(_nested_aura_buff_ids(nested_condition))
    return result


def _nested_buff_targets(node: Any) -> dict[str, set[str]]:
    result: dict[str, set[str]] = {}
    for action in getattr(node, "auxiliaryActions", ()):
        if action.actionType == "CreateBuffAction":
            result.setdefault(action.sourceId, set()).add(action.targetSource)
    for field in (
        "abilityEntityHits",
        "nestedAbilityEntityHits",
        "projectileTriggeredSkills",
        "nestedProjectileTriggeredSkills",
    ):
        for child in getattr(node, field, ()):
            for buff_id, targets in _nested_buff_targets(child).items():
                result.setdefault(buff_id, set()).update(targets)
    return result


def _operator_root_buff_ids(skills: tuple[SkillSource, ...]) -> set[str]:
    result = {buff_id for skill in skills for buff_id in skill.referencedBuffIds}
    for skill in skills:
        result.update(_nested_aura_buff_ids(skill))
    return result


def _operator_nested_buff_targets(
    skills: tuple[SkillSource, ...],
) -> dict[str, set[str]]:
    result: dict[str, set[str]] = {}
    for skill in skills:
        for buff_id, targets in _nested_buff_targets(skill).items():
            result.setdefault(buff_id, set()).update(targets)
    return result


def resolve_operator_buff_definitions(
    skills: Iterable[SkillSource],
    buff_source_dir: Path,
    skill_source_dir: Path | None = None,
    excluded_buff_ids: Iterable[str] = (),
) -> tuple[BuffDefinitionSource, ...]:
    """按干员汇总技能引用，生成一份共享且去重的 Buff 定义目录。"""

    skills = tuple(skills)
    root_ids = _operator_root_buff_ids(skills)
    nested_targets = _operator_nested_buff_targets(skills)
    # 主目录保持精选 BuffData；完整导出回退用于公共 Buff 与尚未精选的干员 Buff。
    source_dirs = (buff_source_dir, buff_source_dir.parent / "buff-data-current")
    definitions = {
        definition.buffId: definition
        for definition in resolve_buff_definitions(
            tuple(sorted(root_ids)),
            source_dirs,
            skill_source_dir,
            excluded_buff_ids,
        )
    }
    owner_ids = tuple(
        sorted(
            buff_id
            for buff_id, targets in nested_targets.items()
            if "Owner" in targets and buff_id not in definitions
        )
    )
    for definition in resolve_buff_definitions(
        owner_ids,
        source_dirs,
        skill_source_dir,
        excluded_buff_ids,
    ):
        if definition.buffId in owner_ids and definition.sourceDeathFinish is not None:
            definitions[definition.buffId] = definition
    return tuple(definitions[buff_id] for buff_id in sorted(definitions))


def resolve_operator_buff_definitions_for_stage(
    skills: Iterable[SkillSource],
    buff_source_dir: Path,
    output_stage: Literal["audit", "complete"],
    skill_source_dir: Path | None = None,
    excluded_buff_ids: Iterable[str] = (),
) -> tuple[tuple[BuffDefinitionSource, ...], tuple[str, ...]]:
    """审计产物记录 Buff 缺口；正式产物继续对同一缺口失败关闭。"""
    skills = tuple(skills)
    if output_stage == "audit":
        definitions: dict[str, BuffDefinitionSource] = {}
        issues: list[str] = []
        source_dirs = (buff_source_dir, buff_source_dir.parent / "buff-data-current")
        for buff_id in sorted(_operator_root_buff_ids(skills)):
            try:
                for definition in resolve_buff_definitions(
                    (buff_id,), source_dirs, skill_source_dir, excluded_buff_ids
                ):
                    definitions[definition.buffId] = definition
            except ValueError as error:
                issues.append(f"ValueError: {error}")
        nested_targets = _operator_nested_buff_targets(skills)
        for buff_id in sorted(
            buff_id
            for buff_id, targets in nested_targets.items()
            if "Owner" in targets and buff_id not in definitions
        ):
            try:
                resolved = resolve_buff_definitions(
                    (buff_id,), source_dirs, skill_source_dir, excluded_buff_ids
                )
                definition = next(
                    (item for item in resolved if item.buffId == buff_id), None
                )
                if definition is not None and definition.sourceDeathFinish is not None:
                    definitions[buff_id] = definition
            except ValueError as error:
                issues.append(f"ValueError: {error}")
        return (
            tuple(definitions[buff_id] for buff_id in sorted(definitions)),
            tuple(issues),
        )
    return resolve_operator_buff_definitions(
        skills, buff_source_dir, skill_source_dir, excluded_buff_ids
    ), ()


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


def resolve_progression_buff_definitions(
    operator: dict[str, Any],
    potential_table: dict[str, Any],
    effects: dict[str, Any],
    buff_source_dir: Path,
) -> tuple[BuffDefinitionSource, ...]:
    """只解析 manifest 明确启用的直接 AddBuff 养成；复杂未建模 Buff 不污染正式生成。"""
    if "potentials" not in operator:
        return ()
    char_id = str(operator["charId"])
    potential = table_row(potential_table, char_id, "CharacterPotentialTable")
    unlocks = require_list(
        potential.get("potentialUnlockBundle"), f"CharacterPotentialTable.{char_id}.potentialUnlockBundle"
    )
    configs = require_list(operator.get("potentials"), f"{operator['slug']}.potentials")
    if len(unlocks) != len(configs):
        raise ValueError(f"{char_id}: potential config count does not match source")
    buff_ids: set[str] = set()
    for index, (raw_unlock, raw_config) in enumerate(zip(unlocks, configs, strict=True)):
        config = require_dict(raw_config, f"{operator['slug']}.potentials[{index}]")
        if config.get("compile") not in {
            "attachedBuff",
            "skillBlackboardPatchAndAttachedBuff",
            "skillSpGainAttackStack",
        }:
            continue
        unlock = require_dict(raw_unlock, f"{char_id}.potentialUnlockBundle[{index}]")
        effect_id = str(unlock["potentialEffectId"])
        effect = table_row(effects, effect_id, "PotentialTalentEffectTable")
        entries = require_list(effect.get("dataList"), f"{effect_id}.dataList")
        attached_entries: list[tuple[int, dict[str, Any]]] = []
        for entry_index, raw_entry in enumerate(entries):
            entry = require_dict(raw_entry, f"{effect_id}.dataList[{entry_index}]")
            attach = require_dict(
                entry.get("attachBuff"),
                f"{effect_id}.dataList[{entry_index}].attachBuff",
            )
            if attach.get("buffId"):
                attached_entries.append((entry_index, entry))
        if len(attached_entries) != 1:
            raise ValueError(
                f"{effect_id}: progression Buff compiler expects exactly one attached Buff entry"
            )
        entry_index, entry = attached_entries[0]
        attach = require_dict(
            entry.get("attachBuff"),
            f"{effect_id}.dataList[{entry_index}].attachBuff",
        )
        buff_id = attach.get("buffId")
        if not isinstance(buff_id, str) or not buff_id:
            raise ValueError(
                f"{effect_id}.dataList[{entry_index}].attachBuff.buffId: expected non-empty id"
            )
        buff_ids.add(buff_id)
    if not buff_ids:
        return ()
    return resolve_buff_definitions(
        tuple(sorted(buff_ids)),
        (buff_source_dir, buff_source_dir.parent / "buff-data-current"),
    )


def collect_operator_passive_skills(
    char_id: str,
    growth: dict[str, Any],
    potential_table: dict[str, Any],
    effects: dict[str, Any],
    source_dir: Path,
    base_passive_skill_ids: Iterable[str] = (),
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

    skill_ids: set[str] = set(base_passive_skill_ids)
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


def parse_base_passive_skill_ids(operator: dict[str, Any]) -> tuple[str, ...]:
    path = f"{operator['slug']}.basePassiveSkillIds"
    values = require_list(operator.get("basePassiveSkillIds", []), path)
    result: list[str] = []
    for index, value in enumerate(values):
        if not isinstance(value, str) or not value:
            raise ValueError(f"{path}[{index}]: expected non-empty string")
        result.append(value)
    if len(result) != len(set(result)):
        raise ValueError(f"{path}: duplicate skill id")
    return tuple(result)


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
    return parse_buff_lifecycle_backend(buff, source_name, blackboard)


def parse_aura_actions(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[AuraActionSource, ...]:
    return parse_aura_actions_backend(
        root,
        source_name,
        inherited_blackboard,
        services=_make_aura_action_parser_services(),
    )


def parse_buff_aura_actions(
    buff: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[AuraActionSource, ...]:
    return parse_buff_aura_actions_backend(
        buff,
        source_name,
        inherited_blackboard,
        services=_make_aura_action_parser_services(),
    )


def parse_auxiliary_actions(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[AuxiliaryActionSource, ...]:
    return parse_auxiliary_actions_backend(
        root,
        source_name,
        source_dir,
        inherited_blackboard,
        services=_make_skill_action_fact_parser_services(),
    )


def parse_ability_entity_finishes(
    root: dict[str, Any],
    source_name: str,
) -> tuple[TimedAbilityEntityFinishSource, ...]:
    """解析能力实体子时间轴中明确以 Owner 为目标的 FinishOwnerAction。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    fields = {
        "$type",
        "isEnable",
        "priorityLevel",
        "priorityOffset",
        "serverActionIndex",
        "owner",
        "skipDieDisplay",
    }
    result: list[TimedAbilityEntityFinishSource] = []
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
        for action in walk_single_enemy_actions(
            timeline.get("_sequenceActionData"),
            f"{timeline_path}._sequenceActionData",
        ):
            if (
                action_name(action["$type"]) != "FinishOwnerAction"
                or action.get("isEnable") is False
            ):
                continue
            path = f"{timeline_path}.FinishOwnerAction"
            unknown_fields = sorted(set(action) - fields)
            if unknown_fields:
                raise ValueError(f"{path}: unsupported fields {unknown_fields}")
            result.append(
                TimedAbilityEntityFinishSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=require_server_action_index(action, path),
                    target=parse_target_reference(action.get("owner"), f"{path}.owner"),
                    skipDieDisplay=require_bool(
                        action.get("skipDieDisplay"), f"{path}.skipDieDisplay"
                    ),
                    sequenceIndex=timeline_index,
                )
            )
    return tuple(result)


def parse_timeline_jumps(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]] | None = None,
) -> tuple[TimedTimelineJumpSource, ...]:
    return parse_timeline_jumps_backend(
        root,
        source_name,
        inherited_blackboard,
        services=_make_skill_action_fact_parser_services(),
    )


def parse_buff_source_death_finish(
    buff: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> BuffSourceDeathFinishSource | None:
    return parse_buff_source_death_finish_backend(
        buff,
        source_name,
        blackboard,
        services=_make_buff_definition_parser_services(),
    )


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
    return resolve_projectile_payload_triggers_backend(
        payload,
        source_root,
        source_name,
        source_dir,
        launch_frame,
        action_order,
        stack,
        inherited_blackboard,
        services=_make_projectile_graph_parser_services(),
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
    return resolve_projectile_triggered_skills_backend(
        root,
        source_name,
        source_dir,
        base_frame,
        stack,
        inherited_blackboard,
        parent_action_order,
        services=_make_projectile_graph_parser_services(),
    )


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
    return resolve_conditional_projectile_triggers_backend(
        conditions,
        source_root,
        source_name,
        source_dir,
        base_frame,
        stack,
        inherited_blackboard,
        parent_action_order,
        services=_make_projectile_graph_parser_services(),
    )


def contains_structured_aura(value: Any) -> bool:
    return contains_structured_aura_backend(value)


def resolve_conditional_aura_ability_entity_children(
    conditions: tuple[ConditionalActionSource, ...],
    source_name: str,
    source_dir: Path,
    base_frame: int,
    stack: tuple[str, ...],
    inherited_blackboard: dict[str, tuple[float, ...]],
    parent_action_order: tuple[int, ...] = (),
) -> tuple[ConditionalActionSource, ...]:
    return resolve_conditional_aura_ability_entity_children_backend(
        conditions,
        source_name,
        source_dir,
        base_frame,
        stack,
        inherited_blackboard,
        parent_action_order,
        services=_make_ability_entity_graph_parser_services(),
    )


def parse_projectile_launches(
    root: dict[str, Any],
    source_name: str,
    base_frame: int = 0,
) -> tuple[ProjectileLaunchSource, ...]:
    return parse_projectile_launches_backend(
        root,
        source_name,
        base_frame,
        services=_make_projectile_graph_parser_services(),
    )


def resolve_ability_entity_hits(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    base_frame: int = 0,
    stack: tuple[str, ...] = (),
    inherited_blackboard: dict[str, tuple[float, ...]] | None = None,
    parent_action_order: tuple[int, ...] | None = None,
) -> tuple[AbilityEntityHitSource, ...]:
    return resolve_ability_entity_hits_backend(
        root,
        source_name,
        source_dir,
        base_frame,
        stack,
        inherited_blackboard,
        parent_action_order,
        services=_make_ability_entity_graph_parser_services(),
    )


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
    return resolve_ability_entity_payload_backend(
        payload,
        child,
        child_name,
        source_dir,
        spawn_frame,
        stack,
        blackboard,
        action_order,
        services=_make_ability_entity_graph_parser_services(),
    )


def guaranteed_ability_entity_spawns(
    condition: ConditionalActionSource,
) -> tuple[AbilityEntitySpawnPayload, ...]:
    return guaranteed_ability_entity_spawns_backend(condition)


def guaranteed_projectile_projections(
    condition: ConditionalActionSource,
) -> tuple[ConditionalProjectileProjection, ...]:
    return guaranteed_projectile_projections_backend(condition)




def mark_projected_conditional_children(
    conditions: tuple[ConditionalActionSource, ...],
) -> tuple[ConditionalActionSource, ...]:
    return mark_projected_conditional_children_backend(conditions)




def is_single_enemy_ability_entity_projection(
    condition: ConditionalActionSource,
) -> bool:
    return is_single_enemy_ability_entity_projection_backend(condition)


def resolve_guaranteed_conditional_ability_entity_hits(
    conditions: tuple[ConditionalActionSource, ...],
    source_name: str,
    source_dir: Path,
    base_frame: int,
    stack: tuple[str, ...],
    blackboard: dict[str, tuple[float, ...]],
    parent_action_order: tuple[int, ...] = (),
) -> tuple[AbilityEntityHitSource, ...]:
    return resolve_guaranteed_conditional_ability_entity_hits_backend(
        conditions,
        source_name,
        source_dir,
        base_frame,
        stack,
        blackboard,
        parent_action_order,
        services=_make_ability_entity_graph_parser_services(),
    )


def native_sequence_order(
    action: Any,
    parent_action_order: tuple[int, ...],
    path: str,
) -> tuple[int, ...]:
    return native_sequence_order_backend(action, parent_action_order, path)


def native_condition_sequence_order(
    action_path: tuple[str, ...],
    parent_action_order: tuple[int, ...],
    path: str,
    fallback_action_index: int | None = None,
) -> tuple[int, ...]:
    return native_condition_sequence_order_backend(
        action_path,
        parent_action_order,
        path,
        fallback_action_index,
    )


def collect_resolved_damage_hits(
    skill: SkillSource,
) -> tuple[ResolvedDamageHitSource, ...]:
    return collect_resolved_damage_hits_backend(skill)


def collect_resolved_schedule(
    skill: SkillSource,
) -> tuple[ResolvedScheduleItemSource, ...]:
    return collect_resolved_schedule_backend(
        skill,
        services=_make_resolved_schedule_collector_services(),
    )


def collect_conditional_buff_ids(condition: ConditionalActionSource) -> frozenset[str]:
    """递归收集条件分支创建的 Buff；这些叶子不会成为独立根调度项。"""
    result: set[str] = set()

    def visit_actions(actions: Iterable[ConditionalBranchActionSource]) -> None:
        for action in actions:
            buff_application = getattr(action, "buffApplication", None)
            if buff_application is not None:
                result.update(buff.buffId for buff in buff_application.buffs)
            nested_condition = getattr(action, "nestedCondition", None)
            if nested_condition is not None:
                visit_condition(nested_condition)
            once_actions = getattr(action, "onceActions", None)
            if once_actions is not None:
                visit_actions(once_actions)

    def visit_condition(current: ConditionalActionSource) -> None:
        visit_actions(current.succeedActions)
        visit_actions(current.failActions)

    visit_condition(condition)
    return frozenset(result)


def collect_nested_combat_node_buff_ids(node: Any) -> frozenset[str]:
    """收集能力实体/投射物子程序中的直接与条件 Buff 创建。"""
    result = {
        action.sourceId
        for action in getattr(node, "auxiliaryActions", ())
        if action.actionType == "CreateBuffAction"
    }
    for condition in getattr(node, "conditionalActions", ()):
        result.update(collect_conditional_buff_ids(condition))
    for field in (
        "abilityEntityHits",
        "nestedAbilityEntityHits",
        "projectileTriggeredSkills",
        "nestedProjectileTriggeredSkills",
    ):
        for child in getattr(node, field, ()):
            result.update(collect_nested_combat_node_buff_ids(child))
    return frozenset(result)


def validate_unmodeled_buff_ids(
    schedule: tuple[ResolvedScheduleItemSource, ...],
    unmodeled_buff_ids: frozenset[str],
    path: str,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> None:
    """确保清单中的未建模 Buff 确实由当前技能施加，避免过期配置静默放行。"""
    scheduled_buff_ids = {
        cast(AuxiliaryActionSource, item.payload).sourceId
        for item in schedule
        if item.itemType == "buffApplication"
    }
    scheduled_buff_ids.update(
        buff_id
        for item in schedule
        if item.itemType == "condition"
        for buff_id in collect_conditional_buff_ids(
            cast(ConditionalActionSource, item.payload)
        )
    )
    scheduled_buff_ids.update(
        buff_id
        for item in schedule
        if item.itemType == "abilityEntitySpawn"
        for buff_id in collect_nested_combat_node_buff_ids(item.payload)
    )
    for definition in (buff_definitions or {}).values():
        for event in definition.eventActions:
            scheduled_buff_ids.update(event.createdBuffIds)
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
    collect_projectile_schedule_backend(
        hit,
        result,
        services=_make_resolved_schedule_collector_services(),
    )


def collect_ability_entity_schedule(
    hit: AbilityEntityHitSource,
    result: list[ResolvedScheduleItemSource],
) -> None:
    collect_ability_entity_schedule_backend(
        hit,
        result,
        services=_make_resolved_schedule_collector_services(),
    )


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
    """审计根时间轴动作，并按“技能已释放”边界省略直接入口守卫。

    直接位于 ``_sequenceActionData.actionData`` 的序列守卫只决定原生技能入口是否
    继续。Endaxis 会执行用户已经排入时间轴的技能，因此把这一级守卫视为已通过。
    ForEach、IfElse、Channeling、事件等内部序列中的同名守卫仍必须保留其动作帧
    控制流，不能借用这条入口规则。
    """
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    timeline = require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    result: list[TimelineActionSource] = []
    for index, raw in enumerate(timeline):
        item = require_dict(raw, f"{source_name}.timelineActions[{index}]")
        sequence = require_dict(item.get("_sequenceActionData"), f"{source_name}.timelineActions[{index}]._sequenceActionData")
        direct_root_guard_ids = frozenset(
            id(action)
            for action_index, raw_action in enumerate(
                require_list(
                    sequence.get("actionData", []),
                    f"{source_name}.timelineActions[{index}]._sequenceActionData.actionData",
                )
            )
            for action in (
                require_dict(
                    raw_action,
                    f"{source_name}.timelineActions[{index}]._sequenceActionData.actionData[{action_index}]",
                ),
            )
            if action.get("isEnable") is not False
            and action_name(str(action.get("$type", ""))) in SEQUENCE_GUARD_ACTION_NAMES
        )
        types: list[str] = []
        # 监听器响应体不属于根时间轴；它由专用解析器按事件触发时机消费。
        for action in walk_actions(
            sequence,
            opaque_action_names=frozenset({"EventListenerAction"}),
        ):
            if id(action) in consumed_action_ids or id(action) in direct_root_guard_ids:
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


def parse_time_dilations(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, ScalarSource],
) -> tuple[TimedTimeDilationSource, ...]:
    """严格读取根时间轴上的普通和终结技时间膨胀动作。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    timeline = require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    result: list[TimedTimeDilationSource] = []
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
            start_frame = require_non_negative_int(item.get("_startFrame"), f"{timeline_path}._startFrame")
            end_frame = require_non_negative_int(item.get("_endFrame"), f"{timeline_path}._endFrame")
            result.append(
                parse_time_dilation_action(
                    action,
                    path,
                    inherited_blackboard,
                    start_frame=start_frame,
                    end_frame=end_frame,
                    sequence_index=timeline_index,
                )
            )
    # 嵌套时间动作由条件动作解析器保留在原控制流中；这里仅收集根时间轴直接动作。
    return tuple(result)


def parse_target_group_writes(
    root: dict[str, Any],
    source_name: str,
) -> tuple[TargetGroupWriteSource, ...]:
    return parse_target_group_writes_backend(root, source_name)


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


def parse_timed_skill_replacements(
    root: dict[str, Any],
    source_name: str,
    blackboard: dict[str, tuple[float, ...]],
) -> tuple[TimedSkillReplacementSource, ...]:
    """解析技能根时间线上的直接技能槽替换；嵌套替换仍保留为未建模控制流。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedSkillReplacementSource] = []
    for index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.timelineActions")
    ):
        path = f"{source_name}.timelineActions[{index}]"
        timeline = require_dict(raw_timeline, path)
        start_frame = require_non_negative_int(timeline.get("_startFrame"), f"{path}._startFrame")
        end_frame = require_non_negative_int(timeline.get("_endFrame"), f"{path}._endFrame")
        sequence = require_dict(
            timeline.get("_sequenceActionData"), f"{path}._sequenceActionData"
        )
        parsed = parse_buff_skill_replacements(
            {
                "buffEventAction": [
                    {"buffEvent": "Timeline", "actions": [sequence]}
                ],
                "abilityEventAction": [],
            },
            source_name,
            blackboard,
        )
        result.extend(
            TimedSkillReplacementSource(
                startFrame=start_frame,
                endFrame=end_frame,
                actionIndex=item.actionIndex,
                skillSource=item.skillSource,
                skillSlot=item.skillSlot,
                targetSkillId=item.targetSkillId,
                overrideCacheTime=item.overrideCacheTime,
                cacheTime=item.cacheTime,
                lifeTimeType=item.lifeTimeType,
                duration=item.duration,
                inheritOriginSkillCooldownProgress=item.inheritOriginSkillCooldownProgress,
                specificRevertedSkillId=item.specificRevertedSkillId,
                revertedSkillId=item.revertedSkillId,
            )
            for item in parsed
        )
    return tuple(result)


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
                if row[key] != float(value):
                    raise ValueError(
                        f"SkillPatchTable.{skill_id}[{index}]: conflicting duplicate blackboard key {key}"
                    )
                continue
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


def parse_skill(
    entry: dict[str, Any],
    source_dir: Path,
    patch_table: dict[str, Any],
) -> SkillSource:
    return parse_skill_backend(
        entry,
        source_dir,
        patch_table,
        services=_make_skill_source_builder_services(),
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


def resolve_ability_entity_ids_from_tag_queries(
    tag_queries: tuple[tuple[str, tuple[int, ...]], ...],
    templates: dict[str, dict[str, Any]],
    path: str,
) -> tuple[str, ...]:
    """把原生实体标签查询严格求值为当前版本的稳定模板 ID。"""
    if len(tag_queries) != 1:
        raise ValueError(f"{path}: expected exactly one ability-entity tag query")
    query_type, tag_ids = tag_queries[0]
    required_tags = set(tag_ids)
    matching_ids: list[str] = []
    for template_id, evidence in templates.items():
        born_tags = set(
            require_list(
                evidence.get("bornTagIds"),
                f"abilityEntityTemplates.{template_id}.bornTagIds",
            )
        )
        matches = {
            "HasAny": bool(born_tags & required_tags),
            "HasAll": required_tags <= born_tags,
            "ExceptAny": not bool(born_tags & required_tags),
            "ExceptAll": not required_tags <= born_tags,
        }.get(query_type)
        if matches is None:
            raise ValueError(f"{path}: unsupported tag query {query_type!r}")
        if matches:
            matching_ids.append(template_id)
    if not matching_ids:
        raise ValueError(f"{path}: ability-entity tag query matches no template evidence")
    return tuple(sorted(matching_ids))


def compile_buff_event_target_group_write(
    write: BuffEventTargetGroupWriteSource,
    templates: dict[str, dict[str, Any]],
    path: str,
) -> str:
    """编译 Buff 事件中带同次施法约束的 owner-spawned 实体集合。"""
    if (
        write.finderType != "OwnerSpawnedEntityFinder"
        or write.spawnedObjectType != "AbilityEntity"
        or set(write.validatorTypes) != {"TagValidator", "SkillCastIdValidator"}
        or len(write.validatorTypes) != 2
        or write.postProcessorTypes
        or write.center != "ActionSource"
        or write.selectorOwner != "ActionSource"
    ):
        raise ValueError(f"{path}: unsupported Buff event target-group producer")
    ability_entity_ids = resolve_ability_entity_ids_from_tag_queries(
        write.tagQueries, templates, f"{path}.tagQueries"
    )
    return (
        "step('findOwnerSpawnedAbilityEntities', { "
        f"saveToContextKey: {ts_inline_literal(write.targetGroupKey)}, "
        f"abilityEntityIds: {ts_inline_literal(ability_entity_ids)}, "
        "sameSourceSkillCast: true })"
    )


def compile_ability_entity_time_dilation_query(
    target: AbilityEntityTimeDilationTargetSource,
    path: str,
    templates: dict[str, dict[str, Any]] | None = None,
) -> str:
    """把原生 born-tag 查询在生成期解析为实体身份；Context 仍需施法上下文。"""
    reference = target.reference
    if reference.targetSource == "Context":
        if (
            not reference.targetGroupKey
            or reference.finderType is not None
            or reference.validatorTypes
            or reference.postProcessorTypes
            or target.spawnedObjectType is not None
            or target.tagQueries
        ):
            raise ValueError(f"{path}: unsupported ability-entity Context query")
        return (
            "{ kind: 'context', contextKey: "
            f"{ts_inline_literal(reference.targetGroupKey)} }}"
        )
    if (
        reference.targetSource != "InstantSearch"
        or reference.targetGroupKey
        or reference.selectorOwner != "ActionOwner"
        or reference.ownerContextKey
        or reference.centerType != "ActionSource"
        or reference.centerContextKey
        or reference.centerToGround
        or reference.target != "ActionSource"
        or reference.targetContextKey
        or reference.enableAdvancedDirection
        or reference.selectorDirection != "SourceForward"
        or reference.finderType != "OwnerSpawnedEntityFinder"
        or target.spawnedObjectType != "AbilityEntity"
        or reference.postProcessorTypes
    ):
        raise ValueError(f"{path}: unsupported ability-entity runtime query")
    if len(target.tagQueries) > 1:
        raise ValueError(f"{path}: multiple ability-entity tag validators are not supported")
    fields = ["kind: 'ownerSpawned'"]
    if target.tagQueries:
        if templates is None:
            raise ValueError(f"{path}: ability-entity tag query requires template evidence")
        matching_ids = resolve_ability_entity_ids_from_tag_queries(
            target.tagQueries, templates, path
        )
        fields.append(
            "abilityEntityIds: " + ts_inline_literal(matching_ids)
        )
    return "{ " + ", ".join(fields) + " }"


TIME_DILATION_PRIORITY_BY_TAG_ID = {
    -1742631616: 100,
    -2059842104: 10,
    -361293424: 50,
    1718594970: 10,
    1798502681: 20,
    -593023102: 30,
    451969779: 10,
    1349735769: 21,
    -693798243: 15,
    513129183: 50,
}


def compile_time_dilation(
    action: TimedTimeDilationSource,
    path: str,
    *,
    effect_ability_entity_targets_proven: bool = False,
    ability_entity_templates: dict[str, dict[str, Any]] | None = None,
) -> str:
    """把已归一化的原生时间动作编译为 SkillDefinition 步骤。"""
    priority = TIME_DILATION_PRIORITY_BY_TAG_ID.get(action.priority)
    if priority is None:
        raise ValueError(
            f"{path}.timeDilationPriority: unknown tag id {action.priority}"
        )
    if action.effectAbilityEntityTargets and not effect_ability_entity_targets_proven:
        raise ValueError(
            f"{path}: ability-entity time-dilation targets require runtime support"
        )
    if action.kind == "ultimate":
        if action.targetScale is None:
            raise ValueError(f"{path}: ultimate time dilation has no target scale")
        fields = [
            f"priority: {priority}",
            "targetScale: { kind: 'constant', value: "
            f"{ts_inline_literal(action.targetScale)} }}",
            f"ignoredTargets: {ts_inline_literal(action.ignoredTargets)}",
        ]
        if action.ignoredAbilityEntityTargets:
            queries = ", ".join(
                compile_ability_entity_time_dilation_query(
                    target, f"{path}.ignoreTargets[{index}]", ability_entity_templates
                )
                for index, target in enumerate(action.ignoredAbilityEntityTargets)
            )
            fields.append(f"ignoredAbilityEntityTargets: [{queries}]")
        return "\n".join(
            [
                "step('startUltimateTimeDilation', {",
                *(f"  {field}," for field in fields),
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
        f"priority: {priority}",
        f"curve: {curve}",
        f"finishByAction: {ts_inline_literal(action.finishByAction)}",
    ]
    if action.scope == "global":
        fields.append(f"ignoredTargets: {ts_inline_literal(action.ignoredTargets)}")
        if action.ignoredAbilityEntityTargets:
            queries = ", ".join(
                compile_ability_entity_time_dilation_query(
                    target, f"{path}.ignoreTargets[{index}]", ability_entity_templates
                )
                for index, target in enumerate(action.ignoredAbilityEntityTargets)
            )
            fields.append(f"ignoredAbilityEntityTargets: [{queries}]")
        if action.influenceSkillCooldown is not None:
            fields.append(
                "influenceSkillCooldownSeconds: "
                f"{compile_condition_operand(action.influenceSkillCooldown, f'{path}.influenceSkillCooldown')}"
            )
    else:
        fields.append(f"targets: {ts_inline_literal(action.targets)}")
        if action.effectAbilityEntityTargets:
            queries = ", ".join(
                compile_ability_entity_time_dilation_query(
                    target, f"{path}.effectTargets[{index}]", ability_entity_templates
                )
                for index, target in enumerate(action.effectAbilityEntityTargets)
            )
            fields.append(f"abilityEntityTargets: [{queries}]")
    return "\n".join(
        [
            "step('startTimeDilation', {",
            *(f"  {field}," for field in fields),
            "})",
        ]
    )
    result.extend(
        ResolvedScheduleItemSource(
            frame=cast(int, aura.startFrame),
            actionOrder=(aura.actionIndex,),
            itemType="auraAction",
            sourcePath=(skill.skillId,),
            payload=aura,
            inputTarget="enemy",
            sequenceOrder=native_condition_sequence_order(
                aura.actionPath, (), skill.skillId, aura.actionIndex
            ),
        )
        for aura in skill.auraActions
        if aura.activationSource == "timeline" and aura.startFrame is not None
        if len(aura.actionPath) == 4
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
    if target_source == "Target" and input_target is not None:
        # 原生 Target 直接读取动作输入目标，命名目标组对该来源没有作用。
        return input_target
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
    134217728: "shatter",
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


def _make_combat_condition_services() -> CombatConditionServices:
    return CombatConditionServices(
        comparison_operator_map=COMPARISON_OPERATOR_MAP,
        compile_condition_operand=compile_condition_operand,
        decode_damage_decorate_mask=decode_damage_decorate_mask,
        evaluate_zero_distance_condition=evaluate_zero_distance_condition,
        is_guaranteed_single_enemy_condition=is_guaranteed_single_enemy_condition,
        resolve_fixed_combat_target=resolve_fixed_combat_target,
        resolve_latest_target_group_write=resolve_latest_target_group_write,
        resolve_latest_target_group_write_at=resolve_latest_target_group_write_at,
        target_group_write_ability_entity_collection_identity=(
            target_group_write_ability_entity_collection_identity
        ),
        target_group_write_guarantees_single_enemy=(
            target_group_write_guarantees_single_enemy
        ),
        target_reference_has_plain_selector=target_reference_has_plain_selector,
    )


def compile_combat_condition(
    source: ConditionSource,
    path: str,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    skill_has_output_damage: bool = False,
    ability_entity_current_target: bool = False,
    buff_ability_damage_event: bool = False,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
) -> str:
    """兼容既有调用方的单个战斗条件编译入口。"""

    return compile_combat_condition_backend(
        source,
        path,
        action,
        target_group_writes,
        root_skill_context,
        input_target,
        skill_has_output_damage,
        ability_entity_current_target,
        buff_ability_damage_event,
        buff_owner_target,
        services=_make_combat_condition_services(),
    )


def compile_combat_condition_group(
    conditions: tuple[ConditionSource, ...],
    path: str,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    skill_has_output_damage: bool = False,
    ability_entity_current_target: bool = False,
    buff_ability_damage_event: bool = False,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
) -> str:
    """兼容既有调用方的条件组编译入口。"""

    return compile_combat_condition_group_backend(
        conditions,
        path,
        action,
        target_group_writes,
        root_skill_context,
        input_target,
        skill_has_output_damage,
        ability_entity_current_target,
        buff_ability_damage_event,
        buff_owner_target,
        services=_make_combat_condition_services(),
    )


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
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
) -> str:
    """编译 Buff 黑板读取；目标身份和 ID/Tag 查询类型彼此独立。"""
    target = (
        buff_owner_target
        if (
            current_buff_environment
            and buff_owner_target is not None
            and read.targetSource == "Owner"
            and not read.targetGroupKey
        )
        else resolve_fixed_combat_target(
            read.targetSource,
            read.targetGroupKey,
            root_skill_context=root_skill_context,
            input_target=input_target,
            context_target_is_enemy=context_target_is_enemy,
        )
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
    input_target: Literal["caster", "enemy"] | None = None,
    context_target_is_enemy: bool = False,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
    context_finish_target: Literal["enemy", "party", "partyExceptCaster"] | None = None,
) -> str:
    """编译目标身份和 Buff 查询方式均已闭环的全量结束分支。"""
    if finish.limitSource:
        raise ValueError(f"{path}: source-limited Buff finish is not supported")
    if finish.isFinishedEarly and finish.isAbsorbed:
        raise ValueError(f"{path}: conflicting finish reasons")
    reason = "early" if finish.isFinishedEarly else "absorbed" if finish.isAbsorbed else "other"
    if (
        current_buff_environment
        and finish.finishAll
        and finish.buffCheckType == "Environment"
        and finish.targetSource == "Owner"
        and not finish.targetGroupKey
        and not finish.buffIds
        and not finish.buffTagIds
    ):
        return "step('finishCurrentBuff', { reason: " + ts_inline_literal(reason) + " })"
    target = (
        context_finish_target
        if finish.targetSource == "Context" and context_finish_target is not None
        else buff_owner_target
        if (
            buff_owner_target is not None
            and finish.targetSource == "Owner"
            and not finish.targetGroupKey
        )
        else resolve_fixed_combat_target(
            finish.targetSource,
            finish.targetGroupKey,
            action=action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            context_target_is_enemy=context_target_is_enemy,
        )
    )
    if (
        target is not None
        and finish.finishAll
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
        count = getattr(finish, "finishLayerCount", None)
        if not finish.finishAll and count is None:
            raise ValueError(f"{path}: partial Buff finish has no layer count")
        return "\n".join(
            [
                "step('finishBuffsById', {",
                f"  target: {ts_inline_literal(target)},",
                f"  buffIds: {ts_inline_literal(finish.buffIds)},",
                f"  reason: {ts_inline_literal(reason)},",
                *(
                    []
                    if finish.finishAll
                    else [
                        f"  count: {compile_condition_operand(count, f'{path}.finishLayerCount')},"
                    ]
                ),
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
    calculation_step = "\n".join(
        [
            "step('calculateActionValue', {",
            f"  key: {ts_inline_literal(calculation.key)},",
            f"  operation: {ts_inline_literal(operation)},",
            f"  left: {compile_condition_operand(calculation.left, f'{path}.left')},",
            f"  right: {compile_condition_operand(calculation.right, f'{path}.right')},",
            "})",
        ]
    )
    addend = getattr(calculation, "addend", None)
    if addend is None:
        return calculation_step
    return "\n".join(
        [
            "sequence(",
            *indent_source(calculation_step + ",", 2),
            "  step('modifyActionValue', {",
            f"    key: {ts_inline_literal(calculation.key)},",
            "    operation: 'add',",
            f"    value: {compile_condition_operand(addend, f'{path}.addend')},",
            "  }),",
            ")",
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
            *(["  finishByAction: true,"] if action.autoFinishByAction else []),
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
    buff_source_context_key: str | None = None,
    inherit_source_skill_cast_info: bool,
    root_skill_context: bool,
    path: str,
    context_application_target: Literal[
        "enemy", "party", "partyExceptCaster", "currentAbilityEntity"
    ] | None = None,
    input_target: Literal["caster", "enemy"] | None = None,
    allow_dynamic_count: bool = False,
    current_ability_entity_owner: bool = False,
    current_ability_entity_target: bool = False,
    target_finder_type: str | None = None,
    target_validator_types: tuple[str, ...] = (),
    target_post_processor_types: tuple[str, ...] = (),
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    ignored_buff_ids: frozenset[str] = frozenset(),
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
    finish_by_action: bool = False,
) -> str:
    return compile_buff_application_values_backend(
        buff_id=buff_id,
        blackboard_assignments=blackboard_assignments,
        target_source=target_source,
        target_group_key=target_group_key,
        count=count,
        buff_source=buff_source,
        buff_source_context_key=buff_source_context_key,
        inherit_source_skill_cast_info=inherit_source_skill_cast_info,
        root_skill_context=root_skill_context,
        path=path,
        context_application_target=context_application_target,
        input_target=input_target,
        allow_dynamic_count=allow_dynamic_count,
        current_ability_entity_owner=current_ability_entity_owner,
        current_ability_entity_target=current_ability_entity_target,
        target_finder_type=target_finder_type,
        target_validator_types=target_validator_types,
        target_post_processor_types=target_post_processor_types,
        buff_definitions=buff_definitions,
        invoked_child_context=invoked_child_context,
        ignored_buff_ids=ignored_buff_ids,
        buff_owner_target=buff_owner_target,
        current_buff_environment=current_buff_environment,
        finish_by_action=finish_by_action,
        services=_make_buff_application_compiler_services(),
    )


def compile_buff_application(
    action: AuxiliaryActionSource,
    path: str,
    *,
    root_skill_context: bool = True,
    context_application_target: Literal[
        "enemy", "party", "partyExceptCaster", "currentAbilityEntity"
    ] | None = None,
    input_target: Literal["caster", "enemy"] | None = None,
    current_ability_entity_owner: bool = False,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    ignored_buff_ids: frozenset[str] = frozenset(),
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
) -> str:
    return compile_buff_application_backend(
        action,
        path,
        root_skill_context=root_skill_context,
        context_application_target=context_application_target,
        input_target=input_target,
        current_ability_entity_owner=current_ability_entity_owner,
        buff_definitions=buff_definitions,
        invoked_child_context=invoked_child_context,
        ignored_buff_ids=ignored_buff_ids,
        buff_owner_target=buff_owner_target,
        current_buff_environment=current_buff_environment,
        services=_make_buff_application_compiler_services(),
    )


def compile_aura_action(
    aura: AuraActionSource,
    path: str,
    *,
    buff_definitions: dict[str, BuffDefinitionSource] | None,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
) -> str:
    return compile_aura_action_backend(
        aura,
        path,
        buff_definitions=buff_definitions,
        invoked_child_context=invoked_child_context,
        services=_make_buff_application_compiler_services(),
    )


def compile_timed_marker_application(
    payload: TimedMarkerApplicationPayload,
    path: str,
    *,
    root_skill_context: bool,
    input_target: Literal["enemy"] | None,
    ability_entity_current_target: bool = False,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
) -> str:
    """编译固定身份的原生定时标记，并严格区分全局与能力实体局部时间。"""
    if payload.useTimeDilationDt:
        if not (
            ability_entity_current_target
            and payload.targetSource == "Owner"
            and not payload.targetGroupKey
        ):
            raise ValueError(f"{path}: unsupported time-dilated timed marker target")
        return "\n".join(
            [
                "step('createAbilityEntityTimedMarker', {",
                f"  markerId: {ts_inline_literal(payload.markerId)},",
                "  durationSeconds: "
                f"{compile_condition_operand(payload.duration, f'{path}.duration')},",
                "  autoFinishByAction: "
                f"{ts_inline_literal(payload.autoFinishByAction)},",
                "})",
            ]
        )
    target = (
        buff_owner_target
        if current_buff_environment
        and buff_owner_target in {"caster", "enemy"}
        and payload.targetSource == "Owner"
        and not payload.targetGroupKey
        else resolve_fixed_combat_target(
            payload.targetSource,
            payload.targetGroupKey,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
    )
    if target is None:
        raise ValueError(
            f"{path}: unsupported timed marker target "
            f"{payload.targetSource!r}/{payload.targetGroupKey!r}"
        )
    return "\n".join(
        [
            "step('createTimedMarker', {",
            f"  target: {ts_inline_literal(target)},",
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
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
) -> str:
    """把原生 Buff 层数查询编译为动作黑板写入步骤。"""
    if payload.countType != "BuffCount":
        raise ValueError(f"{path}: unsupported Buff count type {payload.countType!r}")
    target = (
        buff_owner_target
        if (
            current_buff_environment
            and buff_owner_target is not None
            and payload.targetSource == "Owner"
            and not payload.targetGroupKey
        )
        else resolve_fixed_combat_target(
            payload.targetSource,
            payload.targetGroupKey,
            action=action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            context_target_is_enemy=context_target_is_enemy,
        )
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
            *(
                ["  sameSourceSkillCast: true,"]
                if payload.limitSkillCastId
                else []
            ),
            "})",
        ]
    )


def compile_conditional_buff_application(
    payload: BuffApplicationPayload,
    path: str,
    ignored_buff_ids: frozenset[str],
    *,
    root_skill_context: bool = False,
    context_application_target: Literal[
        "enemy", "party", "partyExceptCaster", "currentAbilityEntity"
    ] | None = None,
    input_target: Literal["enemy"] | None = None,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
    current_ability_entity_target: bool = False,
) -> str:
    """保持原生 Buff 数组顺序编译条件分支内的一次创建动作。"""
    has_dynamic_count = payload.count.blackboardKey is not None or payload.count.value != 1
    if has_dynamic_count and len(payload.buffs) != 1:
        raise ValueError(
            f"{path}: repeated multi-Buff application requires a grouped repeat sequence"
        )
    def compile_entry(buff: BuffApplicationEntryPayload, index: int) -> str:
        if getattr(buff, "classification", None) == "skillCostUltimateEnergyGain":
            if not (
                buff.buffId == "buff_common_obtain_ultimate_sp"
                and not buff.blackboardAssignments
                and payload.targetSource in {"Owner", "Source"}
                and not payload.targetGroupKey
                and payload.buffSource == "ActionSource"
                and payload.inheritSourceSkillCastInfo
                and payload.count.blackboardKey is None
                and payload.count.value == 1
            ):
                raise ValueError(f"{path}.buffs[{index}]: unsupported skill-cost SP carrier")
            return "step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })"
        return compile_buff_application_values(
            buff_id=buff.buffId,
            blackboard_assignments=buff.blackboardAssignments,
            target_source=payload.targetSource,
            target_group_key=payload.targetGroupKey,
            count=payload.count,
            buff_source=payload.buffSource,
            buff_source_context_key=getattr(payload, "buffSourceContextKey", None),
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
            invoked_child_context=invoked_child_context,
            ignored_buff_ids=ignored_buff_ids,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            current_ability_entity_target=current_ability_entity_target,
        )

    compiled = [
        compile_entry(buff, index)
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


def projectile_children_are_inline_conditional(
    triggered_skills: tuple[ProjectileTriggeredSkillSource, ...],
) -> bool:
    """确认零飞行时间的投射物子技能可在所在条件分支内同步展开。"""

    if not triggered_skills:
        return False
    for hit in triggered_skills:
        if (
            hit.assumedTravelFrames != 0
            or hit.cycleTruncated
            or hit.damageUnits
            or hit.directDamageHits
            or hit.auxiliaryActions
            or hit.resourceGains
            or hit.inflictions
            or hit.nestedProjectileTriggeredSkills
            or hit.abilityEntityHits
            or hit.auraActions
            or hit.keywordActions
            or not hit.conditionalActions
            or any(
                condition.startFrame != 0
                or any(frame != 0 for frame in condition.executionFrames)
                for condition in hit.conditionalActions
            )
        ):
            return False
        covered_actions = collect_compilable_conditional_action_types(
            hit.conditionalActions
        )
        if any(
            action_type not in covered_actions
            and action_type != "SpawnAbilityEntity"
            for action_type in hit.combatActions
        ):
            return False
    return True


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


def _make_conditional_leaf_services() -> ConditionalLeafServices:
    return ConditionalLeafServices(
        compile_aura_action=compile_aura_action,
        compile_blackboard_calculation=compile_blackboard_calculation,
        compile_blackboard_mutation=compile_blackboard_mutation,
        compile_buff_blackboard_read=compile_buff_blackboard_read,
        compile_buff_finish=compile_buff_finish,
        compile_buff_stack_read=compile_buff_stack_read,
        compile_condition_operand=compile_condition_operand,
        compile_conditional_action=compile_conditional_action,
        compile_conditional_branch=compile_conditional_branch,
        compile_conditional_buff_application=compile_conditional_buff_application,
        compile_damage_units_step=compile_damage_units_step,
        compile_global_cooldown_application=compile_global_cooldown_application,
        compile_immediate_projectile_children=compile_immediate_projectile_children,
        compile_keyword_action=compile_keyword_action,
        compile_resource_gain=compile_resource_gain,
        compile_time_dilation=compile_time_dilation,
        compile_timed_marker_application=compile_timed_marker_application,
        contains_equivalent_projectile_projection=contains_equivalent_projectile_projection,
        encode_damage_step_key=encode_damage_step_key,
        resolve_fixed_combat_target=resolve_fixed_combat_target,
        resolve_latest_target_group_write_at=resolve_latest_target_group_write_at,
        target_group_write_ability_entity_collection_identity=target_group_write_ability_entity_collection_identity,
        target_group_write_buff_application_target=target_group_write_buff_application_target,
        target_group_write_guarantees_single_enemy=target_group_write_guarantees_single_enemy,
    )


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
    ability_entity_current_target: bool = False,
    singleton_ability_entity_context_keys: frozenset[str] = frozenset(),
    buff_ability_damage_event: bool = False,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    unmodeled_action_types: frozenset[str] = frozenset(),
    aura_actions: tuple[AuraActionSource, ...] = (),
    compiled_ability_entity_spawns: tuple[
        tuple[tuple[str, ...], str], ...
    ] = (),
    compiled_projectile_launches: tuple[tuple[tuple[str, ...], str], ...] = (),
) -> str:
    """兼容既有调用方的条件分支叶子编译入口。"""

    return compile_conditional_branch_action_backend(
        action,
        path,
        ignored_buff_ids,
        damage_tags,
        runtime_blackboard_keys,
        target_group_writes,
        root_skill_context,
        input_target,
        projected_ability_entity_spawns,
        projected_projectile_launches,
        context_action,
        step_key_prefix,
        buff_definitions,
        ability_entity_current_target,
        singleton_ability_entity_context_keys,
        buff_ability_damage_event,
        buff_owner_target,
        current_buff_environment,
        invoked_child_context,
        unmodeled_action_types,
        aura_actions,
        compiled_ability_entity_spawns,
        compiled_projectile_launches,
        services=_make_conditional_leaf_services(),
    )


def _compile_conditional_branch_ir(
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
    ability_entity_current_target: bool = False,
    singleton_ability_entity_context_keys: frozenset[str] = frozenset(),
    buff_ability_damage_event: bool = False,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    unmodeled_action_types: frozenset[str] = frozenset(),
) -> CompiledNode:
    """把既有宽参数入口适配到独立条件编译模块。"""

    return _make_conditional_compiler().compile_branch(
        actions,
        path,
        ConditionalCompileContext(
            ignored_buff_ids=ignored_buff_ids,
            damage_tags=damage_tags,
            runtime_blackboard_keys=runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            step_key_prefix=step_key_prefix,
            buff_definitions=buff_definitions,
            ability_entity_current_target=ability_entity_current_target,
            singleton_ability_entity_context_keys=singleton_ability_entity_context_keys,
            buff_ability_damage_event=buff_ability_damage_event,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            invoked_child_context=invoked_child_context,
            unmodeled_action_types=unmodeled_action_types,
            projected_ability_entity_spawns=projected_ability_entity_spawns,
            projected_projectile_launches=projected_projectile_launches,
            context_action=context_action,
        ),
    )


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
    ability_entity_current_target: bool = False,
    singleton_ability_entity_context_keys: frozenset[str] = frozenset(),
    buff_ability_damage_event: bool = False,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    unmodeled_action_types: frozenset[str] = frozenset(),
) -> str:
    """兼容既有调用方的 TypeScript 渲染边界。"""

    return render_compiled_node(
        _compile_conditional_branch_ir(
            actions,
            path,
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
            ability_entity_current_target=ability_entity_current_target,
            singleton_ability_entity_context_keys=singleton_ability_entity_context_keys,
            buff_ability_damage_event=buff_ability_damage_event,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            invoked_child_context=invoked_child_context,
            unmodeled_action_types=unmodeled_action_types,
        )
    )


COMPILED_DAMAGE_STEP_KEY_SUFFIX = re.compile(
    r"}, '\d+:(?:[^'\\]|\\.)*'\)(,?)$"
)


def compiled_sequence_semantic_signature(source: str) -> str:
    """比较过滤后的执行序列；伤害步骤 key 标识命中身份，不改变步骤执行效果。"""

    return "\n".join(
        COMPILED_DAMAGE_STEP_KEY_SUFFIX.sub(r"})\1", line)
        for line in source.splitlines()
    )


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


def _compile_conditional_leaf_with_context(
    action: ConditionalBranchActionSource,
    path: str,
    context: ConditionalCompileContext,
) -> str:
    return compile_conditional_branch_action(
        action,
        path,
        context.ignored_buff_ids,
        context.damage_tags,
        context.runtime_blackboard_keys,
        target_group_writes=context.target_group_writes,
        root_skill_context=context.root_skill_context,
        input_target=context.input_target,
        projected_ability_entity_spawns=context.projected_ability_entity_spawns,
        projected_projectile_launches=context.projected_projectile_launches,
        context_action=context.context_action,
        step_key_prefix=context.step_key_prefix,
        buff_definitions=context.buff_definitions,
        ability_entity_current_target=context.ability_entity_current_target,
        singleton_ability_entity_context_keys=(
            context.singleton_ability_entity_context_keys
        ),
        buff_ability_damage_event=context.buff_ability_damage_event,
        buff_owner_target=context.buff_owner_target,
        current_buff_environment=context.current_buff_environment,
        invoked_child_context=context.invoked_child_context,
        unmodeled_action_types=context.unmodeled_action_types,
        aura_actions=context.aura_actions,
        compiled_ability_entity_spawns=context.compiled_ability_entity_spawns,
        compiled_projectile_launches=context.compiled_projectile_launches,
    )


def _compile_conditional_condition_with_context(
    action: ConditionalActionSource,
    path: str,
    context: ConditionalCompileContext,
) -> str:
    return compile_combat_condition_group(
        action.conditions,
        f"{path}.conditions",
        action,
        context.target_group_writes,
        context.root_skill_context,
        context.input_target,
        context.skill_has_output_damage,
        context.ability_entity_current_target,
        context.buff_ability_damage_event,
        context.buff_owner_target,
    )


def _conditional_is_guaranteed_success(
    action: ConditionalActionSource,
    context: ConditionalCompileContext,
) -> bool:
    return (
        len(action.conditions) == 1
        and is_guaranteed_non_empty_target_group_condition(
            action.conditions[0],
            action=action,
            target_group_writes=context.target_group_writes,
        )
    )


def _conditional_is_presentation_only(
    action: ConditionalActionSource,
    _context: ConditionalCompileContext,
) -> bool:
    return is_presentation_only_camera_condition(action)


def _validate_conditional_for_each(
    action: ForEachContextActionSource,
    path: str,
    context: ConditionalCompileContext,
) -> None:
    write = resolve_latest_target_group_write(
        action,
        action.contextKey,
        context.target_group_writes,
    )
    requires_ability_entity_provenance = any(
        condition.sourceType == "CheckDistanceCondition"
        for current in iter_conditional_actions((action,))
        for condition in current.conditions
    )
    if requires_ability_entity_provenance and (
        write is None
        or target_group_write_ability_entity_collection_identity(write) is None
    ):
        raise ValueError(
            f"{path}: Context ForEach target group does not have proven "
            "owner-spawned AbilityEntity provenance"
        )


def _make_conditional_compiler() -> ConditionalCompiler:
    return ConditionalCompiler(
        ConditionalCompilerServices(
            compile_leaf=_compile_conditional_leaf_with_context,
            compile_condition=_compile_conditional_condition_with_context,
            is_guaranteed_success=_conditional_is_guaranteed_success,
            is_presentation_only=_conditional_is_presentation_only,
            validate_for_each=_validate_conditional_for_each,
            logical_spawn_can_compile=logical_ability_entity_spawn_can_compile,
            leaf_semantic_source=compiled_sequence_semantic_signature,
        )
    )


def _compile_conditional_action_ir(
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
    ability_entity_current_target: bool = False,
    singleton_ability_entity_context_keys: frozenset[str] = frozenset(),
    buff_ability_damage_event: bool = False,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    unmodeled_action_types: frozenset[str] = frozenset(),
    aura_actions: tuple[AuraActionSource, ...] = (),
    compiled_ability_entity_spawns: tuple[
        tuple[tuple[str, ...], str], ...
    ] = (),
    compiled_projectile_launches: tuple[tuple[tuple[str, ...], str], ...] = (),
) -> CompiledNode:
    """把既有宽参数入口适配到独立条件编译模块。"""

    return _make_conditional_compiler().compile_action(
        action,
        path,
        ConditionalCompileContext(
            ignored_buff_ids=ignored_buff_ids,
            damage_tags=damage_tags,
            runtime_blackboard_keys=runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            skill_has_output_damage=skill_has_output_damage,
            step_key_prefix=step_key_prefix,
            buff_definitions=buff_definitions,
            ability_entity_current_target=ability_entity_current_target,
            singleton_ability_entity_context_keys=(
                singleton_ability_entity_context_keys
            ),
            buff_ability_damage_event=buff_ability_damage_event,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            invoked_child_context=invoked_child_context,
            unmodeled_action_types=unmodeled_action_types,
            aura_actions=aura_actions,
            compiled_ability_entity_spawns=compiled_ability_entity_spawns,
            compiled_projectile_launches=compiled_projectile_launches,
        ),
    )


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
    ability_entity_current_target: bool = False,
    singleton_ability_entity_context_keys: frozenset[str] = frozenset(),
    buff_ability_damage_event: bool = False,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    unmodeled_action_types: frozenset[str] = frozenset(),
    compiled_ability_entity_spawns: tuple[
        tuple[tuple[str, ...], str], ...
    ] = (),
    compiled_projectile_launches: tuple[tuple[tuple[str, ...], str], ...] = (),
) -> str:
    """兼容既有调用方的条件控制流 TypeScript 渲染边界。"""

    return render_compiled_node(
        _compile_conditional_action_ir(
            action,
            path,
            ignored_buff_ids,
            damage_tags,
            runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            skill_has_output_damage=skill_has_output_damage,
            step_key_prefix=step_key_prefix,
            buff_definitions=buff_definitions,
            ability_entity_current_target=ability_entity_current_target,
            singleton_ability_entity_context_keys=singleton_ability_entity_context_keys,
            buff_ability_damage_event=buff_ability_damage_event,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            invoked_child_context=invoked_child_context,
            unmodeled_action_types=unmodeled_action_types,
            compiled_ability_entity_spawns=compiled_ability_entity_spawns,
            compiled_projectile_launches=compiled_projectile_launches,
        )
    )


def _make_inline_buff_services() -> InlineBuffServices:
    return InlineBuffServices(
        compile_conditional_branch_ir=_compile_conditional_branch_ir,
        compile_conditional_action_ir=_compile_conditional_action_ir,
        decode_damage_decorate_mask=decode_damage_decorate_mask,
        collect_resolved_damage_hits=collect_resolved_damage_hits,
        compile_ability_entity_child_skill=compile_ability_entity_child_skill,
        compile_buff_event_target_group_write=compile_buff_event_target_group_write,
        load_ability_entity_template_evidence=load_ability_entity_template_evidence,
        target_reference_has_plain_selector=target_reference_has_plain_selector,
        target_reference_is_plain=target_reference_is_plain,
        collect_compilable_conditional_action_types=collect_compilable_conditional_action_types,
        compile_blackboard_calculation=compile_blackboard_calculation,
        compile_blackboard_mutation=compile_blackboard_mutation,
        compile_buff_application=compile_buff_application,
        compile_buff_blackboard_read=compile_buff_blackboard_read,
        compile_buff_finish=compile_buff_finish,
        compile_damage_units_step=compile_damage_units_step,
        compile_infliction=compile_infliction,
        compile_resource_gain=compile_resource_gain,
        encode_damage_step_key=encode_damage_step_key,
        resolve_latest_target_group_write_at=resolve_latest_target_group_write_at,
        resource_gain_can_change_value=resource_gain_can_change_value,
        target_group_write_buff_application_target=target_group_write_buff_application_target,
    )


def compile_inline_buff_event_responses(
    source: BuffDefinitionSource,
    path: str,
    *,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"],
    buff_definitions: dict[str, BuffDefinitionSource],
    ignored_buff_ids: frozenset[str] = frozenset(),
) -> str:
    """兼容既有调用方的 Buff 事件响应编译入口。"""

    return compile_inline_buff_event_responses_backend(
        source,
        path,
        buff_owner_target=buff_owner_target,
        buff_definitions=buff_definitions,
        ignored_buff_ids=ignored_buff_ids,
        services=_make_inline_buff_services(),
    )


def compile_inline_buff_behaviors(
    source: BuffDefinitionSource,
    path: str,
    *,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"],
    buff_definitions: dict[str, BuffDefinitionSource],
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    ignored_buff_ids: frozenset[str] = frozenset(),
) -> str:
    """兼容既有调用方的 Buff 生命周期编译入口。"""

    return compile_inline_buff_behaviors_backend(
        source,
        path,
        buff_owner_target=buff_owner_target,
        buff_definitions=buff_definitions,
        invoked_child_context=invoked_child_context,
        ignored_buff_ids=ignored_buff_ids,
        services=_make_inline_buff_services(),
    )


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


def target_group_write_guarantees_main_character(
    write: TargetGroupWriteSource,
) -> bool:
    """只识别固定模型中必然存在的主控角色查找。"""
    return (
        write.producerType in {"FindTargetAction", "ContinuousFindTargetAction"}
        and write.finderType == "CharacterTeamFinder"
        and write.validatorTypes == ("MainCharacterValidator",)
        and not write.postProcessorTypes
    )


def target_group_write_guarantees_non_empty(
    write: TargetGroupWriteSource,
    writes: tuple[TargetGroupWriteSource, ...],
) -> bool:
    """证明一次写入至少产生一个逻辑目标，不把位置目标归类为敌人。"""
    if target_group_write_guarantees_single_enemy(write):
        return True
    if not (
        write.producerType == "FindTargetAction"
        and write.finderType == "FixedPointFinder"
        and write.finderFixedPointSnapToNavmesh is False
        and not write.validatorTypes
        and not write.postProcessorTypes
        and write.center == "ContextTarget"
        and write.centerContextKey
        and write.selectorOwner == "ContextTarget"
        and write.selectorOwnerContextKey == write.centerContextKey
    ):
        return False
    center_write = resolve_latest_target_group_write_at(
        read_frame=write.startFrame,
        read_action_index=write.actionIndex,
        read_action_path=write.actionPath,
        target_group_key=write.centerContextKey,
        writes=writes,
    )
    return center_write is not None and target_group_write_guarantees_main_character(
        center_write
    )


def target_group_is_guaranteed_non_empty_at(
    *,
    read_frame: int,
    read_action_index: int,
    read_action_path: tuple[str, ...],
    target_group_key: str,
    writes: tuple[TargetGroupWriteSource, ...],
) -> bool:
    """穷尽读取点之前的二元控制流路径，并检查每条路径的最后写入非空。"""
    candidates = tuple(
        write
        for write in writes
        if write.targetGroupKey == target_group_key
        and (
            write.startFrame < read_frame
            or (
                write.startFrame == read_frame
                and write.actionIndex < read_action_index
            )
        )
    )
    if not candidates:
        return False

    read_requirements = target_group_branch_scopes(read_action_path)
    variables = tuple(
        sorted(
            {
                scope[:-1]
                for scopes in (
                    *(target_group_branch_scopes(write.actionPath) for write in candidates),
                    read_requirements,
                )
                for scope in scopes
            }
        )
    )
    # 这是一个小型静态证明器；异常复杂的控制流继续严格阻塞。
    if len(variables) > 12:
        return False
    variable_indexes = {variable: index for index, variable in enumerate(variables)}

    for bits in range(1 << len(variables)):
        if any(
            bool(bits & (1 << variable_indexes[scope[:-1]]))
            != (scope[-1] == "succeedActions")
            for scope in read_requirements
        ):
            continue
        executed: list[TargetGroupWriteSource] = []
        for write in candidates:
            requirements = target_group_branch_scopes(write.actionPath)
            if all(
                bool(bits & (1 << variable_indexes[scope[:-1]]))
                == (scope[-1] == "succeedActions")
                for scope in requirements
            ):
                executed.append(write)
        if not executed:
            return False
        latest_order = max(
            (write.startFrame, write.actionIndex) for write in executed
        )
        latest = [
            write
            for write in executed
            if (write.startFrame, write.actionIndex) == latest_order
        ]
        if len(latest) != 1 or not target_group_write_guarantees_non_empty(
            latest[0], writes
        ):
            return False
    return True


def compile_inline_buff_scheduled_sequences(
    source: BuffDefinitionSource,
    path: str,
    *,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"],
    buff_definitions: dict[str, BuffDefinitionSource],
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
) -> str:
    """兼容既有调用方的 Buff 实例本地时间线编译入口。"""

    return compile_inline_buff_scheduled_sequences_backend(
        source,
        path,
        buff_owner_target=buff_owner_target,
        buff_definitions=buff_definitions,
        invoked_child_context=invoked_child_context,
        services=_make_inline_buff_services(),
    )


def is_guaranteed_non_empty_target_group_condition(
    condition: ConditionSource,
    *,
    action: ConditionalActionSource | None,
    target_group_writes: tuple[TargetGroupWriteSource, ...],
) -> bool:
    """识别由穷尽生产者保证恒真的 `Context/<group> >= 1`。"""
    entity = getattr(condition, "entityCount", None)
    return (
        condition.sourceType == "CheckEntityNum"
        and entity is not None
        and entity.targetSource == "Context"
        and bool(entity.targetGroupKey)
        and entity.minimumCount == 1
        and entity.comparison == "GE"
        and not entity.containsHittableTarget
        and not entity.storeKey
        and action is not None
        and target_group_is_guaranteed_non_empty_at(
            read_frame=action.startFrame,
            read_action_index=action.actionIndex,
            read_action_path=action.actionPath,
            target_group_key=entity.targetGroupKey,
            writes=target_group_writes,
        )
    )


def target_group_write_ability_entity_collection_identity(
    write: TargetGroupWriteSource,
) -> tuple[tuple[str, tuple[int, ...]], ...] | None:
    """识别带完整标签证据的 owner-spawned AbilityEntity 集合，不推断实例状态。"""
    if (
        write.producerType not in {"FindTargetAction", "ContinuousFindTargetAction"}
        or write.finderType != "OwnerSpawnedEntityFinder"
        or write.finderSpawnedObjectType != "AbilityEntity"
        or any(
            processor != "PriorityFilter" for processor in write.postProcessorTypes
        )
        or write.validatorTypes.count("TagValidator") != 1
        or write.validatorTypes.count("SkillCastIdValidator") > 1
        or any(
            validator not in {"TagValidator", "SkillCastIdValidator"}
            for validator in write.validatorTypes
        )
        or len(write.validatorTagQueries)
        != write.validatorTypes.count("TagValidator")
    ):
        return None
    return write.validatorTagQueries


def compile_skill_target_group_ability_entity_query(
    write: TargetGroupWriteSource,
    templates: dict[str, dict[str, Any]],
    path: str,
    *,
    save_count_to_blackboard_key: str | None = None,
) -> str:
    """编译技能时间线中 owner-spawned 能力实体集合查询。"""
    identity = target_group_write_ability_entity_collection_identity(write)
    if (
        identity is None
        or write.center != "ActionSource"
        or write.centerContextKey
        or write.selectorOwner != "ActionOwner"
        or write.selectorOwnerContextKey
    ):
        raise ValueError(f"{path}: unsupported skill target-group producer")
    ability_entity_ids = resolve_ability_entity_ids_from_tag_queries(
        identity, templates, f"{path}.validatorTagQueries"
    )
    fields = [
        f"saveToContextKey: {ts_inline_literal(write.targetGroupKey)}",
        f"abilityEntityIds: {ts_inline_literal(ability_entity_ids)}",
    ]
    if "SkillCastIdValidator" in write.validatorTypes:
        fields.append("sameSourceSkillCast: true")
    if save_count_to_blackboard_key is not None:
        fields.append(
            "saveCountToBlackboardKey: "
            f"{ts_inline_literal(save_count_to_blackboard_key)}"
        )
    return f"step('findOwnerSpawnedAbilityEntities', {{ {', '.join(fields)} }})"


def target_group_write_buff_application_target(
    write: TargetGroupWriteSource | None,
) -> Literal["enemy", "party", "partyExceptCaster"] | None:
    """把已闭环的目标组写入归约为 Buff 施加支持的单体或集合目标。"""
    if write is None:
        return None
    if target_group_write_guarantees_single_enemy(write):
        return "enemy"
    if (
        not write.postProcessorTypes
        and write.producerType in {"FindTargetAction", "ContinuousFindTargetAction"}
        and write.finderType == "CharacterTeamFinder"
    ):
        if not write.validatorTypes:
            return "party"
        if write.validatorTypes == ("ExcludeOwnerValidator",):
            return "partyExceptCaster"
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
    if not target_reference_has_plain_selector(reference):
        return False
    if (
        reference.targetSource == "Context"
        and reference.targetGroupKey == "smart_target"
        and reference.finderType is None
    ):
        return True
    return (
        reference.targetSource in {"Target", "MainTarget"}
        and reference.finderType is None
    ) or (
        reference.targetSource == "InstantSearch"
        and not reference.targetGroupKey
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


def logical_ability_entity_spawn_can_compile(payload: AbilityEntitySpawnPayload) -> bool:
    """判断生成动作能否无损进入当前根技能零空间 DSL；其他形状继续留在审计层。"""
    return (
        payload.sourceType in {"ActionSource", "ActionOwner"}
        and not payload.sourceContextKey
        and not payload.dieOnEnd
        and (payload.target is None or zero_distance_target_role(payload.target) is not None)
        and all(
            assignment.valueType == "Numeric"
            for assignment in payload.entityBlackboardAssignments
        )
    )


def ability_entity_child_is_gameplay_inert(hit: AbilityEntityHitSource) -> bool:
    """只接受没有任何已知战斗动作或递归载荷的纯表现子技能。"""
    return (
        not hit.cycleTruncated
        and not hit.combatActions
        and not hit.directDamageHits
        and not hit.intervalDamageHits
        and not hit.explicitFinishes
        and not hit.timelineJumps
        and not hit.conditionalActions
        and not hit.inflictions
        and not hit.auxiliaryActions
        and not hit.resourceGains
        and not hit.projectileLaunches
        and not hit.projectileTriggeredSkills
        and not hit.nestedAbilityEntityHits
        and not hit.blackboardCalculations
        and not hit.blackboardMutations
        and not hit.buffBlackboardReads
        and not hit.buffFinishes
        and not hit.auraActions
        and not hit.keywordActions
    )


def logical_ability_entity_spawn_payload_for_compile(
    hit: AbilityEntityHitSource,
    skill: SkillSource,
) -> AbilityEntitySpawnPayload | None:
    """在零空间模型中删除由同帧固定点查找产生的纯位置 Context。"""
    payload = getattr(hit, "spawnPayload", None)
    if payload is None:
        return None
    if logical_ability_entity_spawn_can_compile(payload):
        return payload
    target = payload.target
    if not (
        target is not None
        and target.targetSource == "Context"
        and target.targetGroupKey
        and target_reference_has_plain_selector(target)
    ):
        return None
    writes = tuple(
        write
        for write in skill.targetGroupWrites
        if write.targetGroupKey == target.targetGroupKey
    )
    if len(writes) != 1:
        return None
    write = writes[0]
    if not (
        write.startFrame == hit.spawnFrame
        and hit.actionOrder
        and write.actionIndex < hit.actionOrder[-1]
        and write.producerType == "FindTargetAction"
        and write.finderType == "FixedPointFinder"
        and not write.validatorTypes
        and not write.postProcessorTypes
        and not write.inputTargets
    ):
        return None
    normalized = replace(payload, target=None)
    return normalized if logical_ability_entity_spawn_can_compile(normalized) else None


def compile_logical_ability_entity_spawn(
    payload: AbilityEntitySpawnPayload,
    path: str,
    templates: dict[str, dict[str, Any]],
    child_skill: str | None = None,
) -> str:
    """把有完整来源证据的 SpawnAbilityEntity 转为逻辑实例生成步骤。"""
    if not logical_ability_entity_spawn_can_compile(payload):
        raise ValueError(f"{path}: AbilityEntity spawn is outside the zero-space root subset")
    template = templates.get(payload.abilityEntityId)
    if template is None:
        raise ValueError(f"{path}: missing AbilityEntity template evidence {payload.abilityEntityId!r}")
    lifetime_kind = template.get("_endaxisLifetimeKind")
    if lifetime_kind == "limited":
        duration = template.get("durationSeconds")
        if not isinstance(duration, (int, float)) or isinstance(duration, bool) or duration < 0:
            raise ValueError(f"{path}.definition.durationSeconds: expected non-negative number")
        lifetime = (
            "{ kind: 'limited', durationSeconds: " + ts_inline_literal(duration) + " }"
        )
    elif lifetime_kind == "infinite":
        lifetime = "{ kind: 'infinite' }"
    else:
        raise ValueError(f"{path}.definition.lifetime: unresolved native lifetime")
    definition_prefix = "{ lifetime: " + lifetime
    fields = [
        f"dieWhenSourceDies: {ts_inline_literal(payload.dieWhenSourceDies)}",
    ]
    if payload.assignBlackboard:
        fields.append("inheritActionBlackboard: true")
    if payload.target is not None:
        target = zero_distance_target_role(payload.target)
        if target is None:
            raise AssertionError("compile predicate accepted an unresolved AbilityEntity target")
        fields.append(f"target: {ts_inline_literal(target)}")
    if payload.overrideDuration is not None:
        fields.append(
            "overrideDurationSeconds: "
            + compile_condition_operand(payload.overrideDuration, f"{path}.overrideDuration")
        )
    if payload.saveToContextKey is not None:
        fields.append(f"saveToContextKey: {ts_inline_literal(payload.saveToContextKey)}")
    assignments = []
    for assignment in payload.entityBlackboardAssignments:
        operand = (
            f"{{ kind: 'constant', value: {ts_inline_literal(assignment.numericValue)} }}"
            if assignment.useDirectValue
            else "{ kind: 'blackboard', key: "
            f"{ts_inline_literal(assignment.inputValueKey)} }}"
        )
        assignments.append(f"{ts_inline_literal(assignment.targetKey)}: {operand}")
    if assignments:
        fields.append("blackboardAssignments: { " + ", ".join(assignments) + " }")
    identity = f"abilityEntityId: {ts_inline_literal(payload.abilityEntityId)}"
    if child_skill is None:
        definition = definition_prefix + " }"
        return (
            "step('spawnAbilityEntity', { "
            + ", ".join([identity, "definition: " + definition, *fields])
            + " })"
        )
    definition_lines = indent_source(
        "definition: " + definition_prefix + ", childSkill: " + child_skill,
        2,
    )
    definition_lines[-1] += " },"
    return "\n".join(
        [
            "step('spawnAbilityEntity', {",
            f"  {identity},",
            *definition_lines,
            *(f"  {field}," for field in fields),
            "})",
        ]
    )


def ability_entity_child_buff_can_compile(
    action: AuxiliaryActionSource,
    *,
    input_target: Literal["caster", "enemy"] | None = None,
    ignored_auxiliary_classifications: frozenset[str] = frozenset(),
    ignored_buff_ids: frozenset[str] = frozenset(),
    unmodeled_buff_ids: frozenset[str] = frozenset(),
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> bool:
    """Accept only child Buff actions whose receiver identity is proven by its invocation."""
    if (
        action.classification in ignored_auxiliary_classifications
        or action.sourceId in ignored_buff_ids
        or action.sourceId in unmodeled_buff_ids
    ):
        return True
    if action.classification == "skillCostUltimateEnergyGain":
        return True
    if not (
        action.actionType == "CreateBuffAction"
        and action.targetSource in {"Source", "Owner", "Target"}
        and action.buffSource in {"ActionSource", "ActionOwner"}
        and action.inheritSourceSkillCastInfo is not None
        and action.count is not None
        and action.count.blackboardKey is None
        and action.count.value == 1
    ):
        return False
    if action.targetSource == "Source":
        return True
    if action.targetSource == "Target":
        return input_target is not None
    return True


def ability_entity_child_finishes_are_terminal(hit: AbilityEntityHitSource) -> bool:
    """Reject child graphs that still contain modeled combat work after their first host finish."""
    finishes = getattr(hit, "explicitFinishes", ())
    if not finishes:
        return True
    first_finish_frame = min(finish.startFrame for finish in finishes)
    action_frames = [
        action.startFrame
        for field in (
            "directDamageHits",
            "inflictions",
            "conditionalActions",
            "auxiliaryActions",
            "resourceGains",
            "blackboardCalculations",
            "blackboardMutations",
            "buffBlackboardReads",
            "buffFinishes",
            "keywordActions",
        )
        for action in getattr(hit, field, ())
    ]
    action_frames.extend(
        frame
        for interval in getattr(hit, "intervalDamageHits", ())
        for frame in interval.tickFrames
    )
    jumps = getattr(hit, "timelineJumps", ())
    if not jumps:
        return (
            not any(finish.startFrame > first_finish_frame for finish in finishes)
            and all(frame <= first_finish_frame for frame in action_frames)
        )

    destinations = tuple(sorted({jump.destFrame for jump in jumps}))
    finish_frames = tuple(sorted({finish.startFrame for finish in finishes}))
    if not destinations or any(jump.startFrame > first_finish_frame for jump in jumps):
        return False
    first_destination = destinations[0]
    if any(
        frame > first_finish_frame for frame in action_frames if frame < first_destination
    ):
        return False
    # 每个可跳入区段必须在下一个目的帧前显式结束；区段内的战斗动作也必须位于
    # 该结束点之前。这样正常路径和任一跳转路径都会在继续落入后续区段前终止。
    for index, destination in enumerate(destinations):
        next_destination = destinations[index + 1] if index + 1 < len(destinations) else None
        segment_finishes = tuple(
            frame
            for frame in finish_frames
            if frame >= destination and (next_destination is None or frame < next_destination)
        )
        if not segment_finishes:
            return False
        segment_finish = segment_finishes[0]
        if any(
            frame > segment_finish
            for frame in action_frames
            if frame >= destination and (next_destination is None or frame < next_destination)
        ):
            return False
    return True


def timeline_jump_outer_condition(
    hit: AbilityEntityHitSource,
    jump: TimedTimelineJumpSource,
) -> ConditionalActionSource | None:
    """关联唯一根 IfElse 成功分支中的一次性空条件跳转。"""
    if not (
        jump.isOnlyBranchAction
        and jump.isRootContainerOnlySequenceAction
        and not jump.conditionActionTypes
        and not jump.directConditions
    ):
        return None
    for condition in getattr(hit, "conditionalActions", ()):
        if (
            jump.actionPath
            == (*condition.actionPath, "succeedActions", "actionData", "[0]")
            and not condition.succeedActions
            and condition.conditions
        ):
            return condition
    return None


def timeline_jump_can_compile(
    jump: TimedTimelineJumpSource,
    hit: AbilityEntityHitSource | None = None,
    *,
    input_target: Literal["caster", "enemy"] = "enemy",
) -> bool:
    """只接受唯一根动作、前向目的地和完整直接条件的已证实跳转形状。"""
    sequence_index = getattr(jump, "sequenceIndex", -1)
    expected_path = (
        f"timelineActions[{sequence_index}]",
        "_sequenceActionData",
        "actionData",
        "[0]",
    )
    if not (
        getattr(jump, "startFrame", 1) <= getattr(jump, "endFrame", 0)
        and getattr(jump, "destFrame", -1) >= getattr(jump, "startFrame", 0)
    ):
        return False
    if (
        getattr(jump, "actionPath", ()) == expected_path
        and getattr(jump, "isOnlySequenceAction", False)
        and getattr(jump, "directConditionsSupported", False)
        and getattr(jump, "directConditions", ())
    ):
        try:
            compile_combat_condition_group(
                getattr(jump, "directConditions"),
                "timelineJump.condition",
                root_skill_context=False,
                input_target=input_target,
                ability_entity_current_target=hit is not None,
            )
        except ValueError:
            return False
        return True
    if hit is None or (outer := timeline_jump_outer_condition(hit, jump)) is None:
        return False
    try:
        compile_combat_condition_group(
            outer.conditions,
            "timelineJump.outerCondition",
            target_group_writes=getattr(hit, "localTargetGroupWrites", ()),
            root_skill_context=False,
            input_target=input_target,
            ability_entity_current_target=True,
        )
    except ValueError:
        return False
    return True


def ability_entity_child_combat_actions_can_compile(hit: AbilityEntityHitSource) -> bool:
    """核对能力实体子图中的原生战斗动作均有对应的共享编译路径。"""
    allowed = {
        "AuraAction",
        "CreateBuffAction",
        "CreateTimedMarker",
        "DamageAction",
        "FinishBuffAdvanced",
        "FinishBuffAction",
        "FinishOwnerAction",
        "JumpToAction",
        "ObtainCostAction",
        "SpellInfliction",
        "SpawnAbilityEntity",
    }
    conditional_actions = getattr(hit, "conditionalActions", ())
    if conditional_actions:
        allowed.add("IfElseAction")
        allowed.update(collect_compilable_conditional_action_types(conditional_actions))
    if getattr(hit, "projectileTriggeredSkills", ()) and all(
        projectile_children_are_immediate((projectile,))
        or projectile_children_are_inline_conditional((projectile,))
        for projectile in hit.projectileTriggeredSkills
    ):
        allowed.add("LaunchProjectile")
    return set(getattr(hit, "combatActions", ())) <= allowed


def ability_entity_child_timeline_can_compile(
    hit: AbilityEntityHitSource,
    *,
    input_target: Literal["caster", "enemy"] = "enemy",
    ignored_auxiliary_classifications: frozenset[str] = frozenset(),
    ignored_buff_ids: frozenset[str] = frozenset(),
    unmodeled_buff_ids: frozenset[str] = frozenset(),
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
) -> bool:
    """Only migrate child graphs whose complete modeled action set fits one local timeline."""
    return (
        getattr(hit, "inheritsSourceBlackboard", False)
        and not getattr(hit, "cycleTruncated", False)
        and bool(
            getattr(hit, "directDamageHits", ())
            or getattr(hit, "intervalDamageHits", ())
            or getattr(hit, "explicitFinishes", ())
            or getattr(hit, "inflictions", ())
            or getattr(hit, "conditionalActions", ())
            or getattr(hit, "auxiliaryActions", ())
            or getattr(hit, "auraActions", ())
        )
        and all(
            ability_entity_child_buff_can_compile(
                action,
                input_target=input_target,
                ignored_auxiliary_classifications=ignored_auxiliary_classifications,
                ignored_buff_ids=ignored_buff_ids,
                unmodeled_buff_ids=unmodeled_buff_ids,
                buff_definitions=buff_definitions,
            )
            for action in getattr(hit, "auxiliaryActions", ())
        )
        and all(
            finish.target.targetSource == "Owner" and target_reference_is_plain(finish.target)
            for finish in getattr(hit, "explicitFinishes", ())
        )
        and all(
            timeline_jump_can_compile(jump, hit, input_target=input_target)
            for jump in getattr(hit, "timelineJumps", ())
        )
        and ability_entity_child_finishes_are_terminal(hit)
        and not getattr(hit, "projectileLaunches", ())
        and all(
            projectile_children_are_immediate((projectile,))
            or projectile_children_are_inline_conditional((projectile,))
            for projectile in getattr(hit, "projectileTriggeredSkills", ())
        )
        and not getattr(hit, "nestedAbilityEntityHits", ())
        and not getattr(hit, "blackboardCalculations", ())
        and not getattr(hit, "buffBlackboardReads", ())
        and all(
            finish.targetSource in {"Source", "Owner", "Target"}
            and not finish.targetGroupKey
            and finish.buffCheckType in {"Id", "Tag"}
            for finish in getattr(hit, "buffFinishes", ())
        )
        and not getattr(hit, "keywordActions", ())
        and ability_entity_child_combat_actions_can_compile(hit)
    )


def load_ability_entity_template_evidence() -> dict[str, dict[str, Any]]:
    """读取与生成器版本配对的能力实体模板事实；格式异常时立即失败。"""
    raw = require_dict(
        json.loads(DEFAULT_ABILITY_ENTITY_TEMPLATE_EVIDENCE.read_text(encoding="utf-8")),
        str(DEFAULT_ABILITY_ENTITY_TEMPLATE_EVIDENCE),
    )
    templates = require_dict(
        raw.get("templates"), f"{DEFAULT_ABILITY_ENTITY_TEMPLATE_EVIDENCE}.templates"
    )
    native_values = require_dict(
        raw.get("lifeTypeNativeValues"),
        f"{DEFAULT_ABILITY_ENTITY_TEMPLATE_EVIDENCE}.lifeTypeNativeValues",
    )
    limited = native_values.get("limited")
    infinite = native_values.get("infinite")
    if not isinstance(limited, int) or not isinstance(infinite, int) or limited == infinite:
        raise ValueError("AbilityEntity lifetime native values are invalid")
    result: dict[str, dict[str, Any]] = {}
    for template_id, raw_value in templates.items():
        value = dict(require_dict(raw_value, f"abilityEntityTemplates.{template_id}"))
        native_value = value.get("lifeTypeNativeValue")
        if native_value == limited:
            value["_endaxisLifetimeKind"] = "limited"
        elif native_value == infinite:
            value["_endaxisLifetimeKind"] = "infinite"
        else:
            raise ValueError(
                f"abilityEntityTemplates.{template_id}.lifeTypeNativeValue is unsupported"
            )
        result[template_id] = value
    return result


def ability_entity_time_dilation_targets_are_closed(
    action: TimedTimeDilationSource,
    skill: SkillSource,
    reachable_entities: tuple[AbilityEntityHitSource, ...],
    migrated_entities: tuple[AbilityEntityHitSource, ...],
    templates: dict[str, dict[str, Any]],
) -> bool:
    """证明查询可由逻辑实体目录执行；带标签查询另校验当前技能闭包。"""
    if not action.effectAbilityEntityTargets:
        return True
    reachable_source_files = {skill.sourceFile} | {
        entity.sourceFile for entity in reachable_entities
    }
    for query in action.effectAbilityEntityTargets:
        try:
            compile_ability_entity_time_dilation_query(query, "effectTargets", templates)
        except ValueError:
            return False
        # 无标签的 OwnerSpawnedEntityFinder 查询的是运行时目录中的全部逻辑实例。
        # 目录不会包含未建模的原生表现实体，因此无需把跨技能实例误限为当前技能子图。
        if not query.tagQueries:
            continue
        if (
            len(query.tagQueries) != 1
            or query.tagQueries[0][0] != "HasAny"
            or len(query.tagQueries[0][1]) != 1
        ):
            return False
        required_tag = query.tagQueries[0][1][0]
        matching_template_ids = {
            template_id
            for template_id, evidence in templates.items()
            if required_tag
            in require_list(
                evidence.get("bornTagIds"),
                f"abilityEntityTemplates.{template_id}.bornTagIds",
            )
        }
        if not matching_template_ids:
            return False
        for template_id in matching_template_ids:
            evidence = templates[template_id]
            references = set(
                str(value)
                for value in require_list(
                    evidence.get("referencedBySkillFiles"),
                    f"abilityEntityTemplates.{template_id}.referencedBySkillFiles",
                )
            )
            matching_entities = tuple(
                entity
                for entity in reachable_entities
                if entity.abilityEntityId == template_id
            )
            if (
                not references
                or not references <= reachable_source_files
                or not matching_entities
            ):
                return False
            if any(
                logical_ability_entity_spawn_payload_for_compile(entity, skill) is None
                or (entity.combatActions and entity not in migrated_entities)
                for entity in matching_entities
            ):
                return False
    return True


def _make_ability_entity_child_services() -> AbilityEntityChildServices:
    return AbilityEntityChildServices(
        compile_conditional_action_ir=_compile_conditional_action_ir,
        ability_entity_child_timeline_can_compile=ability_entity_child_timeline_can_compile,
        compile_aura_action=compile_aura_action,
        compile_blackboard_mutation=compile_blackboard_mutation,
        compile_buff_application=compile_buff_application,
        compile_buff_finish=compile_buff_finish,
        compile_combat_condition_group=compile_combat_condition_group,
        compile_infliction=compile_infliction,
        compile_resolved_damage_steps=compile_resolved_damage_steps,
        compile_resource_gain=compile_resource_gain,
        compile_skill_target_group_ability_entity_query=(
            compile_skill_target_group_ability_entity_query
        ),
        filter_once_resource_gains=filter_once_resource_gains,
        load_ability_entity_template_evidence=load_ability_entity_template_evidence,
        native_condition_sequence_order=native_condition_sequence_order,
        native_sequence_order=native_sequence_order,
        resolve_latest_target_group_write=resolve_latest_target_group_write,
        resource_gain_can_change_value=resource_gain_can_change_value,
        target_group_write_ability_entity_collection_identity=(
            target_group_write_ability_entity_collection_identity
        ),
        timeline_jump_outer_condition=timeline_jump_outer_condition,
    )


def compile_ability_entity_child_skill(
    hit: AbilityEntityHitSource,
    skill: SkillSource,
    config: dict[str, Any],
    all_damage_hits: tuple[ResolvedDamageHitSource, ...],
    runtime_blackboard_keys: frozenset[str],
    *,
    input_target: Literal["caster", "enemy"] = "enemy",
    ignored_auxiliary_classifications: frozenset[str] = frozenset(),
    ignored_buff_ids: frozenset[str] = frozenset(),
    unmodeled_buff_ids: frozenset[str] = frozenset(),
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    compiled_ability_entity_spawns: tuple[
        tuple[tuple[str, ...], str], ...
    ] = (),
    compiled_projectile_launches: tuple[tuple[tuple[str, ...], str], ...] = (),
) -> str:
    """兼容既有调用方的能力实体子技能编译入口。"""

    return compile_ability_entity_child_skill_backend(
        hit,
        skill,
        config,
        all_damage_hits,
        runtime_blackboard_keys,
        input_target=input_target,
        ignored_auxiliary_classifications=ignored_auxiliary_classifications,
        ignored_buff_ids=ignored_buff_ids,
        unmodeled_buff_ids=unmodeled_buff_ids,
        buff_definitions=buff_definitions,
        compiled_ability_entity_spawns=compiled_ability_entity_spawns,
        compiled_projectile_launches=compiled_projectile_launches,
        services=_make_ability_entity_child_services(),
    )


def evaluate_zero_distance_condition(
    condition: DistanceConditionSource,
    *,
    root_skill_context: bool,
    input_target: Literal["enemy"] | None = None,
    ability_entity_current_target: bool = False,
) -> bool | None:
    """在已证明两端实体存在的执行上下文中按统一零距离模型折叠比较。"""
    if condition.distance < 0:
        return None

    def reference_is_present(reference: TargetReferenceSource) -> bool:
        if not target_reference_has_plain_selector(reference):
            return False
        if (
            reference.targetSource == "Context"
            and reference.targetGroupKey == "smart_target"
            and reference.finderType is None
        ):
            return root_skill_context
        # 原生 Target 读取当前动作输入；序列化中的 targetGroupKey
        # 是无效残留，不能据此否定 ForEach 当前实体。
        if reference.targetSource == "Target":
            return (
                root_skill_context
                or input_target == "enemy"
                or ability_entity_current_target
            )
        if reference.targetGroupKey:
            return False
        if reference.targetSource in {"MainCharacter", "Source"}:
            return True
        if reference.targetSource == "Owner":
            return root_skill_context or ability_entity_current_target
        if reference.targetSource == "MainTarget":
            return root_skill_context
        return (
            root_skill_context
            and reference.targetSource == "InstantSearch"
            and reference.finderType == "MainTargetFinder"
        )

    if not reference_is_present(condition.source) or not reference_is_present(
        condition.target
    ):
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
        def reference_is_single_enemy(reference: TargetReferenceSource) -> bool:
            if target_identity_reference_guarantees_single_enemy(reference):
                return True
            if (
                action is None
                or reference.targetSource != "Context"
                or not reference.targetGroupKey
                or not target_reference_has_plain_selector(reference)
            ):
                return False
            write = resolve_latest_target_group_write(
                action, reference.targetGroupKey, target_group_writes
            )
            return write is not None and target_group_write_guarantees_single_enemy(write)

        return reference_is_single_enemy(identity.first) and reference_is_single_enemy(
            identity.second
        )

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
            if getattr(branch_action, "legacyBuffFinish", None) is not None:
                result.add("FinishBuffAction")
            if getattr(branch_action, "skillCooldownAdjustment", None) is not None:
                result.add("SetSkillCdAtOnce")
            if getattr(branch_action, "buffIgnite", None) is not None:
                result.add("IgniteAction")
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
            if getattr(branch_action, "storeCurrentTimelineFrame", None) is not None:
                result.add("StoreCurSkillExecuteFrame")
            if getattr(branch_action, "resourceGain", None) is not None:
                result.add("ObtainCostAction")
            if getattr(branch_action, "infliction", None) is not None:
                result.add("SpellInfliction")
            if getattr(branch_action, "damageUnits", None) is not None:
                result.add("DamageAction")
            if getattr(branch_action, "heal", None) is not None:
                result.add("HealAction")
            if getattr(branch_action, "keywordAction", None) is not None:
                result.add("SlowAction")
            if getattr(branch_action, "abilityEntitySpawn", None) in projected_spawns:
                result.add("SpawnAbilityEntity")
            if getattr(branch_action, "abilityEntityDurationAssignment", None) is not None:
                result.add("SetAbilityEntityDuration")
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
        elif isinstance(
            action,
            (
                UnconditionalActionSource,
                EveryFrameActionSource,
                SequenceGuardActionSource,
                ForEachContextActionSource,
            ),
        ):
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
                timeline_frame = getattr(action, "storeCurrentTimelineFrame", None)
                nested = getattr(action, "nestedCondition", None)
                if calculation is not None:
                    result.add(calculation.key)
                if mutation is not None:
                    result.add(mutation.key)
                if buff_read is not None:
                    result.add(buff_read.outputKey)
                if stack_read is not None:
                    result.add(stack_read.outputKey)
                if timeline_frame is not None:
                    result.add(timeline_frame.outputKey)
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
            timeline_frame = getattr(action, "storeCurrentTimelineFrame", None)
            if calculation is not None:
                result.add(calculation.key)
            if mutation is not None:
                result.add(mutation.key)
            if buff_read is not None:
                result.add(buff_read.outputKey)
            if stack_read is not None:
                result.add(stack_read.outputKey)
            if timeline_frame is not None:
                result.add(timeline_frame.outputKey)
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
    return compile_direct_damage_backend(
        skill,
        config,
        services=_make_damage_step_compiler_services(),
    )


def compile_projectile_damage(skill: SkillSource, config: dict[str, Any]) -> str:
    return compile_projectile_damage_backend(
        skill,
        config,
        services=_make_damage_step_compiler_services(),
    )


def validate_ignored_recursive_projectile_conditions(
    hit: ProjectileTriggeredSkillSource,
    path: str,
) -> None:
    validate_ignored_recursive_projectile_conditions_backend(hit, path)


def encode_step_key_parts(parts: tuple[int | str, ...]) -> str:
    return encode_step_key_parts_backend(parts)


def encode_damage_step_key(
    skill_key: str,
    source_kind: str,
    source_path: tuple[str, ...],
    action_order: tuple[int, ...],
) -> str:
    return encode_damage_step_key_backend(
        skill_key,
        source_kind,
        source_path,
        action_order,
    )


def compile_damage_units_step(
    damage_units: tuple[DamageUnitSource, ...],
    declared_tags: tuple[str, ...],
    path: str,
    runtime_blackboard_keys: frozenset[str] = frozenset(),
    step_key: str | None = None,
    validate_declared_tags: bool = True,
) -> list[str]:
    return compile_damage_units_step_backend(
        damage_units,
        declared_tags,
        path,
        runtime_blackboard_keys,
        step_key,
        validate_declared_tags,
        services=_make_damage_step_compiler_services(),
    )


def compile_resolved_damage_steps(
    skill: SkillSource,
    config: dict[str, Any],
    hit: ResolvedDamageHitSource,
    index: int,
    is_last_damage: bool,
    runtime_blackboard_keys: frozenset[str] = frozenset(),
) -> list[str]:
    return compile_resolved_damage_steps_backend(
        skill,
        config,
        hit,
        index,
        is_last_damage,
        runtime_blackboard_keys,
        services=_make_damage_step_compiler_services(),
    )


def event_listener_is_proven_noop(listener: SkillEventListenerSource) -> bool:
    """识别原生执行路径已经证明不会产生效果的临时监听器。"""
    if not listener.sequences:
        return False
    for response in listener.sequences:
        if not response.actions:
            return False
        for action in response.actions:
            finish = action.buffFinish
            if (
                action.actionType != "FinishBuffAdvanced"
                or finish is None
                or action.nestedCondition is not None
                or action.onceActions is not None
                or finish.buffCheckType != "Id"
                or finish.buffIds
                or finish.buffTagIds
            ):
                return False
    return True


def compile_skill_event_listener(
    listener: SkillEventListenerSource,
    path: str,
    *,
    runtime_blackboard_keys: frozenset[str],
    step_key_prefix: str,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    ignored_buff_ids: frozenset[str] = frozenset(),
) -> str | None:
    """把已闭环的原生技能临时监听器编译为通用事件监听步骤。"""
    if event_listener_is_proven_noop(listener):
        return None
    # Endaxis 的固定时间轴从不切换“脱离战斗”状态；该事件在本模型中不可达。
    # 原生响应仍保留在 audit，不得把其中的清理动作提升成无条件时间轴步骤。
    if listener.event == "OnTrulyExitFight":
        return None
    event = {
        "OnAddedBuff": {"kind": "buffApplied"},
        "OnBeforeOutputAirborne": {"kind": "airborneOutput"},
        "OnBeforeTakeDamage": {"kind": "operatorHit"},
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
        for action_index, action_type in enumerate(response.orderedActionTypes):
            if action_type != "ConvertToTargetContext":
                continue
            if response.orderedActionTypes[action_index:] != (
                "ConvertToTargetContext",
                "JumpToAction",
            ):
                raise ValueError(
                    f"{response_path}: target Context conversion has an unsupported consumer"
                )
        sequence_source = compile_conditional_branch(
            response.actions,
            f"{response_path}.actions",
            runtime_blackboard_keys=runtime_blackboard_keys,
            root_skill_context=True,
            step_key_prefix=step_key_prefix,
            buff_definitions=buff_definitions,
            ignored_buff_ids=ignored_buff_ids,
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


def _make_resolved_sequence_services() -> ResolvedSequenceServices:
    return ResolvedSequenceServices(
        analysis=ResolvedSequenceAnalysisServices(
            ability_entity_child_timeline_can_compile=ability_entity_child_timeline_can_compile,
            ability_entity_time_dilation_targets_are_closed=ability_entity_time_dilation_targets_are_closed,
            collect_compilable_conditional_action_types=collect_compilable_conditional_action_types,
            contains_equivalent_projectile_projection=contains_equivalent_projectile_projection,
            collect_resolved_damage_hits=collect_resolved_damage_hits,
            collect_resolved_schedule=collect_resolved_schedule,
            collect_runtime_blackboard_output_keys=collect_runtime_blackboard_output_keys,
            compact_level_values=compact_level_values,
            is_single_enemy_ability_entity_projection=is_single_enemy_ability_entity_projection,
            is_strictly_presentation_only_buff=is_strictly_presentation_only_buff,
            load_ability_entity_template_evidence=load_ability_entity_template_evidence,
            logical_ability_entity_spawn_payload_for_compile=logical_ability_entity_spawn_payload_for_compile,
            native_sequence_order=native_sequence_order,
            resolve_latest_target_group_write_at=resolve_latest_target_group_write_at,
            resolve_skill_cooldown_frames=resolve_skill_cooldown_frames,
            resolve_skill_cost_resource=resolve_skill_cost_resource,
            root_skill_has_output_damage_before=root_skill_has_output_damage_before,
            root_target_group_writes_for_condition=root_target_group_writes_for_condition,
            target_group_write_ability_entity_collection_identity=target_group_write_ability_entity_collection_identity,
            target_group_write_buff_application_target=target_group_write_buff_application_target,
            target_group_write_guarantees_single_enemy=target_group_write_guarantees_single_enemy,
            validate_unmodeled_buff_ids=validate_unmodeled_buff_ids,
        ),
        steps=ResolvedSequenceStepServices(
            compile_conditional_action_ir=_compile_conditional_action_ir,
            compile_ability_entity_child_skill=compile_ability_entity_child_skill,
            compile_aura_action=compile_aura_action,
            compile_blackboard_calculation=compile_blackboard_calculation,
            compile_blackboard_mutation=compile_blackboard_mutation,
            compile_buff_application=compile_buff_application,
            compile_buff_blackboard_read=compile_buff_blackboard_read,
            compile_buff_finish=compile_buff_finish,
            compile_buff_hold=compile_buff_hold,
            compile_infliction=compile_infliction,
            compile_keyword_action=compile_keyword_action,
            compile_logical_ability_entity_spawn=compile_logical_ability_entity_spawn,
            compile_resolved_damage_steps=compile_resolved_damage_steps,
            compile_resource_gain=compile_resource_gain,
            compile_skill_target_group_ability_entity_query=(
                compile_skill_target_group_ability_entity_query
            ),
            compile_skill_event_listener=compile_skill_event_listener,
            compile_time_dilation=compile_time_dilation,
        ),
    )


def compile_resolved_sequence(
    skill: SkillSource,
    config: dict[str, Any],
    *,
    require_damage: bool,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    skill_slot_replacement_relations: Iterable[dict[str, Any]] = (),
) -> str:
    """兼容既有调用方的根技能调度编译入口。"""

    return compile_resolved_sequence_backend(
        skill,
        config,
        require_damage=require_damage,
        buff_definitions=buff_definitions,
        skill_slot_replacement_relations=skill_slot_replacement_relations,
        services=_make_resolved_sequence_services(),
    )


def compile_resolved_damage_sequence(
    skill: SkillSource,
    config: dict[str, Any],
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    skill_slot_replacement_relations: Iterable[dict[str, Any]] = (),
) -> str:
    """兼容要求至少一个伤害命中的严格入口。"""
    return compile_resolved_sequence(
        skill,
        config,
        require_damage=True,
        buff_definitions=buff_definitions,
        skill_slot_replacement_relations=skill_slot_replacement_relations,
    )


def compile_skill_entries(
    operator: dict[str, Any],
    skills: list[SkillSource],
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    skill_slot_replacement_relations: Iterable[dict[str, Any]] = (),
) -> tuple[list[tuple[SkillSource, str]], set[str]]:
    entries = require_list(operator.get("skills"), f"{operator.get('slug')}.skills")
    replacement_relations = tuple(skill_slot_replacement_relations)
    compiled: list[tuple[SkillSource, str]] = []
    damage_type_factories: set[str] = set()
    for entry, skill in zip(entries, skills, strict=True):
        config = entry.get("compile")
        if config is None:
            continue
        config = require_dict(config, f"{skill.key}.compile")
        kind = config.get("kind")
        has_slot_relation = any(
            relation["baseSkillKey"] == skill.key
            or relation["replacementSkillKey"] == skill.key
            for relation in replacement_relations
        )
        if has_slot_relation and kind not in {
            "resolvedDamageSequence",
            "resolvedSequence",
        }:
            raise ValueError(
                f"{skill.key}: stable slot replacement requires a resolved sequence compiler"
            )
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
                (
                    skill,
                    compile_resolved_damage_sequence(
                        skill,
                        config,
                        buff_definitions,
                        replacement_relations,
                    ),
                )
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
                        skill_slot_replacement_relations=replacement_relations,
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


def collect_buff_application_blackboard_inputs(
    skill: SkillSource,
) -> dict[str, float | tuple[float, ...]]:
    """收集 CreateBuff 传值实际读取的根动作黑板，并保留其来源等级值。"""
    result: dict[str, float | tuple[float, ...]] = {}
    for action in skill.auxiliaryActions:
        for operand in action.blackboardAssignments.values():
            key = operand.blackboardKey
            if key is None:
                continue
            value: float | tuple[float, ...] = (
                operand.levelValues
                if operand.levelValues is not None
                else operand.value
            )
            previous = result.get(key)
            if previous is not None and previous != value:
                raise ValueError(
                    f"{skill.key}: Buff applications resolve blackboard key {key!r} "
                    "to inconsistent level values"
                )
            result[key] = value
    return result


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
        blackboard.update(collect_buff_application_blackboard_inputs(skill))
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
            timeline_frame = getattr(branch_action, "storeCurrentTimelineFrame", None)
            if timeline_frame is not None:
                result.add(timeline_frame.outputKey)
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
            timeline_frame = getattr(branch_action, "storeCurrentTimelineFrame", None)
            if timeline_frame is not None:
                result.add(timeline_frame.outputKey)
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
    if any("forEachContextTarget(" in source for _, source in compiled):
        helpers.add("forEachContextTarget")
    if any("repeatEachTick(" in source for _, source in compiled):
        helpers.add("repeatEachTick")
    return ", ".join(sorted(helpers))


def render_compiled_skills(
    operator: dict[str, Any],
    skills: list[SkillSource],
    buff_definitions: tuple[BuffDefinitionSource, ...] | None = None,
    entity_blackboard_initializers: list[dict[str, Any]] | None = None,
    skill_slot_replacement_relations: list[dict[str, Any]] | None = None,
) -> str:
    definitions_by_id = (
        None
        if buff_definitions is None
        else {definition.buffId: definition for definition in buff_definitions}
    )
    initializers = entity_blackboard_initializers or []
    derived_replacement_relations = skill_slot_replacement_relations
    if derived_replacement_relations is None:
        derived_replacement_relations = (
            []
            if buff_definitions is None
            else derive_skill_slot_replacement_relations(skills, buff_definitions)
        )
    replacement_relations = select_runtime_skill_slot_replacement_relations(
        operator,
        skills,
        derived_replacement_relations,
    )
    compiled, damage_type_factories = compile_skill_entries(
        operator,
        skills,
        definitions_by_id,
        replacement_relations,
    )
    helper_imports = collect_definition_helpers(compiled, damage_type_factories)
    type_imports = (
        "OperatorEntityBlackboardInitializerDefinition, SkillDefinition"
        if initializers
        else "SkillDefinition"
    )
    identifier = typescript_identifier(str(operator["slug"]))
    initializer_source = (
        "\n"
        f"export const {identifier}EntityBlackboardInitializers = "
        f"{ts_inline_literal(initializers)} as const satisfies readonly "
        "OperatorEntityBlackboardInitializerDefinition[];\n"
        if initializers
        else ""
    )
    replacement_source = (
        "\n"
        f"export const {identifier}SkillSlotReplacementRelations = "
        f"{ts_inline_literal(replacement_relations)} as const;\n"
        if replacement_relations
        else ""
    )
    return (
        "/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */\n"
        f"import type {{ {type_imports} }} from '../../../core/game-data/operatorDefinition';\n"
        f"import {{ {helper_imports} }} from '../definitionHelpers';\n\n"
        "// prettier-ignore\n"
        + "\n".join(render_named_skills(operator, compiled))
        + initializer_source
        + replacement_source
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
    skill_slot_replacement_relations: Iterable[dict[str, Any]] = (),
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
        group_relations = [
            relation
            for relation in skill_slot_replacement_relations
            if relation["baseSkillKey"] in skill_keys
            or relation["replacementSkillKey"] in skill_keys
        ]
        for relation in group_relations:
            if not {
                relation["baseSkillKey"],
                relation["replacementSkillKey"],
            }.issubset(skill_keys):
                raise ValueError(
                    f"skillGroups.{key}: stable slot relation must remain in one skill group"
                )
        replacement_keys = {
            relation["replacementSkillKey"] for relation in group_relations
        }
        base_skills = [
            skill for skill in referenced_skills if skill.key not in replacement_keys
        ]
        if not base_skills:
            raise ValueError(f"skillGroups.{key}: expected at least one placeable skill")
        references = [generated_skill_name(operator, skill.key) for skill in base_skills]
        skills_source = references[0] if len(references) == 1 else f"[{', '.join(references)}]"
        replacement_references = [
            generated_skill_name(operator, skill.key)
            for skill in referenced_skills
            if skill.key in replacement_keys
        ]
        result.append(
            "{ "
            f"key: {ts_inline_literal(key)}, skillType: {ts_inline_literal(skill_type)}, "
            f"levelSource: {ts_inline_literal(level_source)}, skills: {skills_source}"
            + (
                f", replacementSkills: [{', '.join(replacement_references)}]"
                if replacement_references
                else ""
            )
            + " "
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
    routing_only_ids = [
        str(value)
        for value in require_list(
            operator.get("routingOnlyNativeSkillIds", []),
            f"{operator['slug']}.routingOnlyNativeSkillIds",
        )
    ]
    if len(routing_only_ids) != len(set(routing_only_ids)):
        raise ValueError(f"{operator['slug']}.routingOnlyNativeSkillIds: duplicate skill id")
    generated_ids = {skill.skillId for skill in skills}
    overlap = sorted(generated_ids.intersection(routing_only_ids))
    if overlap:
        raise ValueError(
            f"{operator['slug']}.routingOnlyNativeSkillIds: generated skills cannot be routing-only: {overlap}"
        )
    actual_ids = {skill_id for skill_ids in actual_by_type.values() for skill_id in skill_ids}
    unknown_routing_ids = sorted(set(routing_only_ids).difference(actual_ids))
    if unknown_routing_ids:
        raise ValueError(
            f"{operator['slug']}.routingOnlyNativeSkillIds: ids are absent from native groups: "
            f"{unknown_routing_ids}"
        )
    routing_only = set(routing_only_ids)
    actual_by_type = {
        group_type: [skill_id for skill_id in skill_ids if skill_id not in routing_only]
        for group_type, skill_ids in actual_by_type.items()
    }
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


DECK_ATTRIBUTE_TYPE_MAP = {
    "Str": "strength",
    "Agi": "agility",
    "Wisd": "intellect",
    "Will": "will",
}


def derive_entity_blackboard_initializers(
    passive_skills: dict[str, PassiveSkillSource],
    buff_definitions: Iterable[BuffDefinitionSource],
) -> list[dict[str, Any]]:
    """从隐藏被动 OnBuffStart 的面板比较双分支赋值中归纳实体黑板初值。"""
    referenced_ids = {
        buff_id
        for passive in passive_skills.values()
        for buff_id in passive.referenced_buff_ids
    }
    definitions = {
        definition.buffId: definition
        for definition in buff_definitions
        if definition.buffId in referenced_ids
    }
    result: list[dict[str, Any]] = []
    seen_keys: set[str] = set()

    def direct_number(value: ScalarSource) -> float | int | None:
        if value.blackboardKey is not None or value.levelValues is not None:
            return None
        number = value.value
        if (
            not isinstance(number, (int, float))
            or isinstance(number, bool)
            or not math.isfinite(number)
        ):
            return None
        return number

    for buff_id in sorted(definitions):
        definition = definitions[buff_id]
        for event in definition.eventActions:
            if event.eventSource != "buff" or event.event != "OnBuffStart":
                continue
            for sequence_source in event.sequences:
                for action in sequence_source.actions:
                    branch = action.nestedCondition
                    if branch is None or len(branch.conditions) != 1:
                        continue
                    condition = branch.conditions[0].deckAttributeCompare
                    if condition is None:
                        continue
                    if condition.targetSource != "Owner" or condition.targetGroupKey:
                        continue
                    left = DECK_ATTRIBUTE_TYPE_MAP.get(condition.leftAttribute)
                    right = DECK_ATTRIBUTE_TYPE_MAP.get(condition.rightAttribute)
                    comparison = COMPARISON_OPERATOR_MAP.get(condition.comparison)
                    if left is None or right is None or comparison is None:
                        continue
                    if direct_number(condition.leftValue) != 0 or direct_number(condition.rightValue) != 0:
                        continue
                    if len(branch.succeedActions) != 1 or len(branch.failActions) != 1:
                        continue
                    succeed = branch.succeedActions[0].blackboardMutation
                    fail = branch.failActions[0].blackboardMutation
                    if succeed is None or fail is None:
                        continue
                    if (
                        succeed.key != fail.key
                        or not succeed.key.startswith("EntityBB_")
                        or succeed.key == "EntityBB_"
                        or succeed.operation != "Assign"
                        or fail.operation != "Assign"
                    ):
                        continue
                    true_value = direct_number(succeed.value)
                    false_value = direct_number(fail.value)
                    if true_value is None or false_value is None:
                        continue
                    if succeed.key in seen_keys:
                        raise ValueError(
                            f"duplicate derived entity blackboard initializer {succeed.key!r}"
                        )
                    seen_keys.add(succeed.key)
                    result.append(
                        {
                            "key": succeed.key,
                            "condition": {
                                "kind": "deckAttributeCompare",
                                "left": left,
                                "operator": comparison,
                                "right": right,
                            },
                            "trueValue": true_value,
                            "falseValue": false_value,
                        }
                    )
    return result


def derive_skill_slot_replacement_relations(
    skills: list[SkillSource],
    buff_definitions: Iterable[BuffDefinitionSource],
) -> list[dict[str, Any]]:
    """从首段直接 Buff 与替换技能第 0 帧还原动作证明稳定技能槽闭环。"""
    skill_by_id = {skill.skillId: skill for skill in skills}
    definitions = {definition.buffId: definition for definition in buff_definitions}
    result: list[dict[str, Any]] = []
    seen_base_ids: set[str] = set()
    for base in skills:
        for buff_id in base.referencedBuffIds:
            definition = definitions.get(buff_id)
            if definition is None:
                continue
            for replacement in definition.skillReplacements:
                replacement_skill = skill_by_id.get(replacement.targetSkillId)
                if replacement_skill is None:
                    continue
                if (
                    replacement.eventSource != "buff"
                    or replacement.event != "DuringBuffEnable"
                    or replacement.skillSource.targetSource != "Source"
                    or replacement.skillSource.targetGroupKey
                    or replacement.revertedSkillId != base.skillId
                    or not replacement.specificRevertedSkillId
                    or replacement.lifeTimeType != "FinishByAction"
                    or replacement_skill.skillType != base.skillType
                ):
                    continue
                reverts = [
                    action
                    for action in replacement_skill.skillReplacements
                    if (
                        action.startFrame == 0
                        and action.skillSource.targetSource == "Source"
                        and not action.skillSource.targetGroupKey
                        and action.skillSlot == replacement.skillSlot
                        and action.targetSkillId == base.skillId
                        and action.lifeTimeType == "Infinite"
                        and not action.specificRevertedSkillId
                        and not action.revertedSkillId
                    )
                ]
                if len(reverts) != 1:
                    continue
                if base.skillId in seen_base_ids:
                    raise ValueError(
                        f"skill {base.skillId!r} has multiple proven slot replacement relations"
                    )
                seen_base_ids.add(base.skillId)
                revert = reverts[0]
                result.append(
                    {
                        "skillSlot": replacement.skillSlot,
                        "baseSkillKey": base.key,
                        "replacementSkillKey": replacement_skill.key,
                        "activatedByBuffId": buff_id,
                        "activationEvent": replacement.event,
                        "activationActionIndex": replacement.actionIndex,
                        "revertOnReplacementCastFrame": revert.startFrame,
                        "revertActionIndex": revert.actionIndex,
                        "inheritOriginSkillCooldownProgress": (
                            replacement.inheritOriginSkillCooldownProgress
                        ),
                    }
                )
    return result


def select_runtime_skill_slot_replacement_relations(
    operator: dict[str, Any],
    skills: list[SkillSource],
    derived_relations: Iterable[dict[str, Any]],
) -> list[dict[str, Any]]:
    """只把 manifest 明确声明为不可直接放置的形态接入运行时换槽。"""
    raw_keys = operator.get("runtimeReplacementSkillKeys", [])
    keys = [
        str(value)
        for value in require_list(
            raw_keys,
            f"{operator['slug']}.runtimeReplacementSkillKeys",
        )
    ]
    if len(keys) != len(set(keys)):
        raise ValueError(
            f"{operator['slug']}.runtimeReplacementSkillKeys: duplicate skill key"
        )
    known_keys = {skill.key for skill in skills}
    unknown = sorted(set(keys).difference(known_keys))
    if unknown:
        raise ValueError(
            f"{operator['slug']}.runtimeReplacementSkillKeys: unknown skills {unknown}"
        )
    relations = [
        relation
        for relation in derived_relations
        if relation["replacementSkillKey"] in keys
    ]
    missing = sorted(set(keys).difference(relation["replacementSkillKey"] for relation in relations))
    if missing:
        raise ValueError(
            f"{operator['slug']}.runtimeReplacementSkillKeys: no proven slot relation for {missing}"
        )
    return relations


def render_operator_definition(
    operator: dict[str, Any],
    skills: list[SkillSource],
    character_table: dict[str, Any],
    growth_table: dict[str, Any],
    potential_table: dict[str, Any],
    effects: dict[str, Any],
    buff_definitions: tuple[BuffDefinitionSource, ...] = (),
    passive_skills: dict[str, PassiveSkillSource] | None = None,
    entity_blackboard_initializers: list[dict[str, Any]] | None = None,
) -> str:
    return render_operator_definition_backend(
        operator,
        skills,
        character_table,
        growth_table,
        potential_table,
        effects,
        buff_definitions,
        passive_skills,
        entity_blackboard_initializers,
        services=_make_operator_definition_renderer_services(),
    )
def render_report(
    operator: dict[str, Any],
    skills: list[SkillSource],
    buff_definitions: tuple[BuffDefinitionSource, ...],
    passive_skills: dict[str, PassiveSkillSource] | None = None,
    passive_generation_issues: dict[str, tuple[str, ...]] | None = None,
    buff_definition_resolution_issues: tuple[str, ...] = (),
    entity_blackboard_initializers: list[dict[str, Any]] | None = None,
) -> str:
    return render_report_backend(
        operator,
        skills,
        buff_definitions,
        passive_skills,
        passive_generation_issues,
        buff_definition_resolution_issues,
        entity_blackboard_initializers,
        services=_make_audit_report_renderer_services(),
    )


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
    run_generation_backend(services=_make_generation_pipeline_services())


if __name__ == "__main__":
    main()
