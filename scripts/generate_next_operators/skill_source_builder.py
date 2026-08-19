"""把单个 manifest 技能入口装配为完整、可审计的 SkillSource。"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable

from conditional_parser import parse_conditional_actions
from keyword_action_parser import parse_timed_keyword_actions
from projectile_graph_parser import collect_projected_conditional_projectile_skills
from source_models import SkillSource
from source_utils import require_dict, require_non_negative_int


@dataclass(frozen=True)
class SkillSourceBuilderServices:
    """由入口注入各来源解析器和项目证明；构建器只负责有序装配。"""

    build_blackboard_provenance: Callable[..., Any]
    collect_blackboard_keys: Callable[..., Any]
    collect_consumed_root_timed_marker_action_ids: Callable[..., Any]
    collect_referenced_buff_ids: Callable[..., Any]
    collect_unresolved_combat_actions: Callable[..., Any]
    collect_windows: Callable[..., Any]
    derive_timeline_block: Callable[..., Any]
    load_projected_skill_data: Callable[..., Any]
    mark_projected_conditional_children: Callable[..., Any]
    parse_aura_actions: Callable[..., Any]
    parse_auxiliary_actions: Callable[..., Any]
    parse_blackboard_calculations: Callable[..., Any]
    parse_blackboard_runtime_actions: Callable[..., Any]
    parse_buff_hold_actions: Callable[..., Any]
    parse_declared_blackboard: Callable[..., Any]
    parse_direct_damage_hits: Callable[..., Any]
    parse_interval_damage_hits: Callable[..., Any]
    parse_inflictions: Callable[..., Any]
    parse_physical_inflictions: Callable[..., Any]
    parse_projectile_launches: Callable[..., Any]
    parse_resource_gains: Callable[..., Any]
    parse_skill_event_listeners: Callable[..., Any]
    parse_skill_patch: Callable[..., Any]
    parse_target_group_writes: Callable[..., Any]
    parse_time_dilations: Callable[..., Any]
    parse_timed_skill_replacements: Callable[..., Any]
    parse_timeline: Callable[..., Any]
    resolve_ability_entity_hits: Callable[..., Any]
    resolve_conditional_aura_ability_entity_children: Callable[..., Any]
    resolve_conditional_projectile_triggers: Callable[..., Any]
    resolve_guaranteed_conditional_ability_entity_hits: Callable[..., Any]
    resolve_projectile_triggered_skills: Callable[..., Any]
    resolve_skill_blackboard: Callable[..., Any]


def parse_skill(
    entry: dict[str, Any],
    source_dir: Path,
    patch_table: dict[str, Any],
    *,
    services: SkillSourceBuilderServices,
) -> SkillSource:
    build_blackboard_provenance = services.build_blackboard_provenance
    collect_blackboard_keys = services.collect_blackboard_keys
    collect_consumed_root_timed_marker_action_ids = services.collect_consumed_root_timed_marker_action_ids
    collect_referenced_buff_ids = services.collect_referenced_buff_ids
    collect_unresolved_combat_actions = services.collect_unresolved_combat_actions
    collect_windows = services.collect_windows
    derive_timeline_block = services.derive_timeline_block
    load_projected_skill_data = services.load_projected_skill_data
    mark_projected_conditional_children = services.mark_projected_conditional_children
    parse_aura_actions = services.parse_aura_actions
    parse_auxiliary_actions = services.parse_auxiliary_actions
    parse_blackboard_calculations = services.parse_blackboard_calculations
    parse_blackboard_runtime_actions = services.parse_blackboard_runtime_actions
    parse_buff_hold_actions = services.parse_buff_hold_actions
    parse_declared_blackboard = services.parse_declared_blackboard
    parse_direct_damage_hits = services.parse_direct_damage_hits
    parse_interval_damage_hits = services.parse_interval_damage_hits
    parse_inflictions = services.parse_inflictions
    parse_physical_inflictions = services.parse_physical_inflictions
    parse_projectile_launches = services.parse_projectile_launches
    parse_resource_gains = services.parse_resource_gains
    parse_skill_event_listeners = services.parse_skill_event_listeners
    parse_skill_patch = services.parse_skill_patch
    parse_target_group_writes = services.parse_target_group_writes
    parse_time_dilations = services.parse_time_dilations
    parse_timed_skill_replacements = services.parse_timed_skill_replacements
    parse_timeline = services.parse_timeline
    resolve_ability_entity_hits = services.resolve_ability_entity_hits
    resolve_conditional_aura_ability_entity_children = services.resolve_conditional_aura_ability_entity_children
    resolve_conditional_projectile_triggers = services.resolve_conditional_projectile_triggers
    resolve_guaranteed_conditional_ability_entity_hits = services.resolve_guaranteed_conditional_ability_entity_hits
    resolve_projectile_triggered_skills = services.resolve_projectile_triggered_skills
    resolve_skill_blackboard = services.resolve_skill_blackboard
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
            include_for_each_sequence_guards=True,
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
        intervalDamageHits=parse_interval_damage_hits(root, source_name, resolved_blackboard),
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
            include_for_each_sequence_guards=True,
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
        skillReplacements=parse_timed_skill_replacements(
            root, source_name, resolved_blackboard
        ),
    )
