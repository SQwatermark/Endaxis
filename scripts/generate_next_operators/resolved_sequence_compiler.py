"""已解析技能调度到 Next scheduledSequences 的编排编译器。"""

from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Any, Callable, Iterable, Iterator, cast

from compiler_ir import (
    EMPTY_SEQUENCE as COMPILED_EMPTY_SEQUENCE,
    render_sequence_children as render_compiled_sequence_children,
)
from source_models import (
    AbilityEntityHitSource,
    AuraActionSource,
    AuxiliaryActionSource,
    BlackboardCalculationSource,
    BlackboardMutationSource,
    BuffBlackboardReadSource,
    BuffDefinitionSource,
    BuffFinishSource,
    BuffHoldSource,
    ConditionalActionSource,
    ConditionalBranchActionSource,
    ConditionalProjectileProjection,
    EveryFrameActionSource,
    ProjectileTriggeredSkillSource,
    ResolvedDamageHitSource,
    ResolvedScheduleItemSource,
    SkillEventListenerSource,
    SkillSource,
    TimedInflictionSource,
    TimedTimelineFinishSource,
    TimedTimelineJumpSource,
    TimedKeywordActionSource,
    TimedResourceGainSource,
    TimedTimeDilationSource,
)
from source_utils import indent_source, require_list, ts_inline_literal


def projectile_ability_entities_are_condition_projections(
    trigger: ProjectileTriggeredSkillSource,
) -> bool:
    """证明 trigger 的实体集合完全来自已标记的条件无关投影。"""
    expected: list[tuple[int, Any]] = []
    for condition in trigger.conditionalActions:
        expected.extend(
            (trigger.launchFrame + condition.startFrame, payload)
            for payload in condition.projectedAbilityEntitySpawns
        )
    hits = trigger.abilityEntityHits
    return bool(hits) and len(hits) == len(expected) and all(
        hit.spawnFrame == frame
        and hit.spawnPayload == payload
        and hit.abilityEntityId == payload.abilityEntityId
        and hit.skillId == payload.skillId
        for hit, (frame, payload) in zip(hits, expected, strict=True)
    )


def ability_entity_child_is_inert(hit: AbilityEntityHitSource) -> bool:
    """识别只保留逻辑实体身份、没有任何待执行子战斗行为的 SkillData。"""
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
        and not hit.localTargetGroupWrites
    )


def iter_nested_conditional_actions(
    actions: tuple[ConditionalActionSource, ...],
) -> Iterator[ConditionalActionSource]:
    """遍历投射物触发子树中的条件节点，供 Context 查询前置编译复用。"""
    def visit_branches(
        branches: tuple[ConditionalBranchActionSource, ...],
    ) -> Iterator[ConditionalActionSource]:
        for branch in branches:
            if branch.nestedCondition is not None:
                yield from iter_nested_conditional_actions((branch.nestedCondition,))
            if branch.onceActions is not None:
                yield from visit_branches(branch.onceActions)

    for action in actions:
        yield action
        yield from visit_branches((*action.succeedActions, *action.failActions))


@dataclass(frozen=True)
class ResolvedSequenceAnalysisServices:
    """来源证明、调度收集和配置解析服务。"""

    ability_entity_child_timeline_can_compile: Callable[..., Any]
    ability_entity_time_dilation_targets_are_closed: Callable[..., Any]
    collect_compilable_conditional_action_types: Callable[..., Any]
    contains_equivalent_projectile_projection: Callable[..., Any]
    collect_resolved_damage_hits: Callable[..., Any]
    collect_resolved_schedule: Callable[..., Any]
    collect_runtime_blackboard_output_keys: Callable[..., Any]
    compact_level_values: Callable[..., Any]
    is_single_enemy_ability_entity_projection: Callable[..., Any]
    is_strictly_presentation_only_buff: Callable[..., Any]
    load_ability_entity_template_evidence: Callable[..., Any]
    logical_ability_entity_spawn_payload_for_compile: Callable[..., Any]
    native_sequence_order: Callable[..., Any]
    resolve_latest_target_group_write_at: Callable[..., Any]
    resolve_skill_cooldown_frames: Callable[..., Any]
    resolve_skill_cost_resource: Callable[..., Any]
    root_skill_has_output_damage_before: Callable[..., Any]
    root_target_group_writes_for_condition: Callable[..., Any]
    target_group_write_ability_entity_collection_identity: Callable[..., Any]
    target_group_write_buff_application_target: Callable[..., Any]
    target_group_write_guarantees_single_enemy: Callable[..., Any]
    validate_unmodeled_buff_ids: Callable[..., Any]


@dataclass(frozen=True)
class ResolvedSequenceStepServices:
    """具体 DSL 步骤编译服务。"""

    compile_conditional_action_ir: Callable[..., Any]
    compile_combat_condition_group: Callable[..., Any]
    compile_ability_entity_child_skill: Callable[..., Any]
    compile_aura_action: Callable[..., Any]
    compile_blackboard_calculation: Callable[..., Any]
    compile_blackboard_mutation: Callable[..., Any]
    compile_buff_application: Callable[..., Any]
    compile_buff_blackboard_read: Callable[..., Any]
    compile_buff_finish: Callable[..., Any]
    compile_buff_hold: Callable[..., Any]
    compile_infliction: Callable[..., Any]
    compile_keyword_action: Callable[..., Any]
    compile_logical_ability_entity_spawn: Callable[..., Any]
    compile_resolved_damage_steps: Callable[..., Any]
    compile_resource_gain: Callable[..., Any]
    compile_skill_target_group_ability_entity_query: Callable[..., Any]
    compile_skill_event_listener: Callable[..., Any]
    compile_time_dilation: Callable[..., Any]


@dataclass(frozen=True)
class ResolvedSequenceServices:
    analysis: ResolvedSequenceAnalysisServices
    steps: ResolvedSequenceStepServices


def conditional_action_contains_aura(
    action: ConditionalActionSource,
    aura_actions: Iterable[AuraActionSource],
) -> bool:
    """判断条件根下是否存在需随原生 sequence 结束的 Aura。"""
    return any(
        aura.actionPath[: len(action.actionPath)] == action.actionPath
        and len(aura.actionPath) > len(action.actionPath)
        for aura in aura_actions
    )


def compile_resolved_sequence(
    skill: SkillSource,
    config: dict[str, Any],
    *,
    require_damage: bool,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    skill_slot_replacement_relations: Iterable[dict[str, Any]] = (),
    services: ResolvedSequenceServices,
) -> str:
    """将已闭环根动作统一编译为按原生顺序调度的序列。"""
    analysis = services.analysis
    steps = services.steps
    ability_entity_child_timeline_can_compile = analysis.ability_entity_child_timeline_can_compile
    ability_entity_time_dilation_targets_are_closed = analysis.ability_entity_time_dilation_targets_are_closed
    collect_compilable_conditional_action_types = analysis.collect_compilable_conditional_action_types
    contains_equivalent_projectile_projection = (
        analysis.contains_equivalent_projectile_projection
    )
    collect_resolved_damage_hits = analysis.collect_resolved_damage_hits
    collect_resolved_schedule = analysis.collect_resolved_schedule
    collect_runtime_blackboard_output_keys = analysis.collect_runtime_blackboard_output_keys
    compact_level_values = analysis.compact_level_values
    is_single_enemy_ability_entity_projection = analysis.is_single_enemy_ability_entity_projection
    is_strictly_presentation_only_buff = analysis.is_strictly_presentation_only_buff
    load_ability_entity_template_evidence = analysis.load_ability_entity_template_evidence
    logical_ability_entity_spawn_payload_for_compile = analysis.logical_ability_entity_spawn_payload_for_compile
    native_sequence_order = analysis.native_sequence_order
    resolve_latest_target_group_write_at = analysis.resolve_latest_target_group_write_at
    resolve_skill_cooldown_frames = analysis.resolve_skill_cooldown_frames
    resolve_skill_cost_resource = analysis.resolve_skill_cost_resource
    root_skill_has_output_damage_before = analysis.root_skill_has_output_damage_before
    root_target_group_writes_for_condition = analysis.root_target_group_writes_for_condition
    target_group_write_ability_entity_collection_identity = analysis.target_group_write_ability_entity_collection_identity
    target_group_write_buff_application_target = analysis.target_group_write_buff_application_target
    target_group_write_guarantees_single_enemy = analysis.target_group_write_guarantees_single_enemy
    validate_unmodeled_buff_ids = analysis.validate_unmodeled_buff_ids
    _compile_conditional_action_ir = steps.compile_conditional_action_ir
    compile_combat_condition_group = steps.compile_combat_condition_group
    compile_ability_entity_child_skill = steps.compile_ability_entity_child_skill
    compile_aura_action = steps.compile_aura_action
    compile_blackboard_calculation = steps.compile_blackboard_calculation
    compile_blackboard_mutation = steps.compile_blackboard_mutation
    compile_buff_application = steps.compile_buff_application
    compile_buff_blackboard_read = steps.compile_buff_blackboard_read
    compile_buff_finish = steps.compile_buff_finish
    compile_buff_hold = steps.compile_buff_hold
    compile_infliction = steps.compile_infliction
    compile_keyword_action = steps.compile_keyword_action
    compile_logical_ability_entity_spawn = steps.compile_logical_ability_entity_spawn
    compile_resolved_damage_steps = steps.compile_resolved_damage_steps
    compile_resource_gain = steps.compile_resource_gain
    compile_skill_target_group_ability_entity_query = (
        steps.compile_skill_target_group_ability_entity_query
    )
    compile_skill_event_listener = steps.compile_skill_event_listener
    compile_time_dilation = steps.compile_time_dilation
    ignored_auxiliary_classifications = set(
        require_list(
            config.get("ignoreAuxiliaryClassifications", []),
            f"{skill.key}.compile.ignoreAuxiliaryClassifications",
        )
    )
    configured_ignored_buff_ids = frozenset(
        require_list(config.get("ignoreBuffIds", []), f"{skill.key}.compile.ignoreBuffIds")
    )
    simulation_no_effect_buff_ids = frozenset(
        require_list(
            config.get("simulationNoEffectBuffIds", []),
            f"{skill.key}.compile.simulationNoEffectBuffIds",
        )
    )
    presentation_only_buff_ids = frozenset(
        buff_id
        for buff_id, definition in (buff_definitions or {}).items()
        if is_strictly_presentation_only_buff(definition)
    )
    ignored_buff_ids = configured_ignored_buff_ids | presentation_only_buff_ids
    unmodeled_buff_ids = frozenset(
        require_list(
            config.get("unmodeledBuffIds", []),
            f"{skill.key}.compile.unmodeledBuffIds",
        )
    )
    unmodeled_action_types = frozenset(
        str(value)
        for value in require_list(
            config.get("unmodeledActionTypes", []),
            f"{skill.key}.compile.unmodeledActionTypes",
        )
    )
    unknown_unmodeled_actions = sorted(
        unmodeled_action_types.difference(skill.unresolvedCombatActions)
    )
    if unknown_unmodeled_actions:
        raise ValueError(
            f"{skill.key}.compile.unmodeledActionTypes: actions are not present in the "
            f"skill audit: {unknown_unmodeled_actions}"
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
        allowed_actions.update(finish.sourceActionType for finish in skill.buffFinishes)
    if skill.inflictions:
        allowed_actions.add("SpellInfliction")
    if combat_auxiliary_actions:
        allowed_actions.add("CreateBuffAction")
    if skill.resourceGains:
        allowed_actions.add("ObtainCostAction")
    if getattr(skill, "keywordActions", ()):
        allowed_actions.add("SlowAction")
    if getattr(skill, "auraActions", ()):
        allowed_actions.add("AuraAction")
    allowed_actions.update(unmodeled_action_types)
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
    replacement_relations = tuple(skill_slot_replacement_relations)
    activation_relations = tuple(
        relation
        for relation in replacement_relations
        if relation["baseSkillKey"] == skill.key
    )
    revert_relations = tuple(
        relation
        for relation in replacement_relations
        if relation["replacementSkillKey"] == skill.key
    )
    if len({relation["activatedByBuffId"] for relation in activation_relations}) != len(
        activation_relations
    ):
        raise ValueError(f"{skill.key}: duplicate slot replacement activation Buff")
    activation_actions = {
        relation["activatedByBuffId"]: [
            action
            for action in skill.auxiliaryActions
            if action.actionType == "CreateBuffAction"
            and action.sourceId == relation["activatedByBuffId"]
        ]
        for relation in activation_relations
    }
    for buff_id, actions in activation_actions.items():
        if len(actions) != 1:
            raise ValueError(
                f"{skill.key}: proven slot replacement Buff {buff_id!r} must have one "
                f"direct application, got {len(actions)}"
            )
        if (
            buff_id in ignored_buff_ids
            or buff_id in unmodeled_buff_ids
            or actions[0].classification in ignored_auxiliary_classifications
        ):
            raise ValueError(
                f"{skill.key}: proven slot replacement Buff {buff_id!r} cannot be ignored"
            )

    matched_revert_actions: set[tuple[int, int]] = set()
    replacement_schedule_items: list[ResolvedScheduleItemSource] = []
    for relation in revert_relations:
        matches = [
            action
            for action in getattr(skill, "skillReplacements", ())
            if action.startFrame == relation["revertOnReplacementCastFrame"]
            and action.actionIndex == relation["revertActionIndex"]
        ]
        if len(matches) != 1:
            raise ValueError(
                f"{skill.key}: proven slot replacement revert must match one native action, "
                f"got {len(matches)}"
            )
        action = matches[0]
        matched_revert_actions.add((action.startFrame, action.actionIndex))
        replacement_schedule_items.append(
            ResolvedScheduleItemSource(
                frame=action.startFrame,
                actionOrder=(action.actionIndex,),
                itemType="skillSlotReplacement",
                sourcePath=(skill.skillId,),
                payload=action,
                sequenceOrder=native_sequence_order(action, (), skill.skillId),
            )
        )
    unmatched_reverts = [
        action
        for action in getattr(skill, "skillReplacements", ())
        if (action.startFrame, action.actionIndex) not in matched_revert_actions
    ]
    if revert_relations and unmatched_reverts:
        raise ValueError(
            f"{skill.key}: ChangeSkillAction is not covered by a proven stable slot relation"
        )
    resolved_schedule = tuple(
        sorted(
            (*resolved_schedule, *replacement_schedule_items),
            key=lambda item: (item.frame, item.sequenceOrder, item.actionOrder),
        )
    )

    def collect_reachable_ability_entities() -> tuple[AbilityEntityHitSource, ...]:
        result: list[AbilityEntityHitSource] = []

        def visit_entities(entities: Iterable[AbilityEntityHitSource]) -> None:
            for entity in entities:
                result.append(entity)
                visit_entities(entity.nestedAbilityEntityHits)
                visit_projectiles(entity.projectileTriggeredSkills)

        def visit_projectiles(projectiles: Iterable[ProjectileTriggeredSkillSource]) -> None:
            for projectile in projectiles:
                visit_entities(projectile.abilityEntityHits)
                visit_projectiles(projectile.nestedProjectileTriggeredSkills)

        visit_entities(skill.abilityEntityHits)
        visit_projectiles(skill.projectileTriggeredSkills)
        return tuple(result)

    reachable_ability_entities = collect_reachable_ability_entities()
    migrated_ability_entities = tuple(
        entity
        for entity in reachable_ability_entities
        if logical_ability_entity_spawn_payload_for_compile(entity, skill) is not None
        if ability_entity_child_timeline_can_compile(
            entity,
            ignored_auxiliary_classifications=frozenset(
                ignored_auxiliary_classifications
            ),
            ignored_buff_ids=ignored_buff_ids,
            unmodeled_buff_ids=unmodeled_buff_ids,
            buff_definitions=buff_definitions,
        )
    )
    ability_entity_templates = load_ability_entity_template_evidence()

    def compile_attached_ability_entity(entity: AbilityEntityHitSource) -> str | None:
        payload = logical_ability_entity_spawn_payload_for_compile(entity, skill)
        if payload is None:
            return None
        child_can_compile = ability_entity_child_timeline_can_compile(
            entity,
            ignored_auxiliary_classifications=frozenset(
                ignored_auxiliary_classifications
            ),
            ignored_buff_ids=ignored_buff_ids,
            unmodeled_buff_ids=unmodeled_buff_ids,
            buff_definitions=buff_definitions,
        )
        if not child_can_compile and not ability_entity_child_is_inert(entity):
            return None
        if not child_can_compile:
            return compile_logical_ability_entity_spawn(
                payload,
                f"{skill.key}.conditionalAbilityEntitySpawn",
                ability_entity_templates,
            )
        nested_spawns = collect_compiled_conditional_spawns(entity.conditionalActions)
        nested_projectiles = collect_compiled_conditional_projectiles(
            entity.conditionalActions
        )
        child_damage_hits = collect_resolved_damage_hits(
            replace(
                skill,
                directDamageHits=(),
                projectileTriggeredSkills=(),
                abilityEntityHits=(entity,),
                conditionalActions=(),
            )
        )
        child_skill = compile_ability_entity_child_skill(
            entity,
            skill,
            config,
            child_damage_hits,
            runtime_blackboard_keys,
            ignored_auxiliary_classifications=frozenset(
                ignored_auxiliary_classifications
            ),
            ignored_buff_ids=ignored_buff_ids | simulation_no_effect_buff_ids,
            unmodeled_buff_ids=unmodeled_buff_ids,
            buff_definitions=buff_definitions,
            compiled_ability_entity_spawns=tuple(nested_spawns),
            compiled_projectile_launches=tuple(nested_projectiles),
        )
        return compile_logical_ability_entity_spawn(
            payload,
            f"{skill.key}.conditionalAbilityEntitySpawn",
            ability_entity_templates,
            child_skill,
        )

    def collect_compiled_conditional_spawns(
        conditions: tuple[ConditionalActionSource, ...],
    ) -> list[tuple[tuple[str, ...], str]]:
        result: list[tuple[tuple[str, ...], str]] = []

        def visit_actions(actions: tuple[ConditionalBranchActionSource, ...]) -> None:
            for action in actions:
                attached_hits = getattr(action, "conditionalAbilityEntityHits", None) or ()
                if getattr(action, "abilityEntitySpawn", None) is not None and attached_hits:
                    if len(attached_hits) != 1:
                        raise ValueError(
                            f"{skill.key}: conditional AbilityEntity spawn has ambiguous child graph"
                        )
                    source = compile_attached_ability_entity(attached_hits[0])
                    if source is not None:
                        result.append((action.actionPath, source))
                elif (
                    getattr(action, "abilityEntitySpawn", None) is not None
                    and not attached_hits
                    and action.abilityEntitySpawn.skillId is None
                ):
                    # 没有子 SkillData 的模板实体仍需进入逻辑实体目录，供同一技能后续
                    # Context 查询消费；它不携带也不需要伪造 childSkill。
                    result.append(
                        (
                            action.actionPath,
                            compile_logical_ability_entity_spawn(
                                action.abilityEntitySpawn,
                                f"{skill.key}.conditionalAbilityEntitySpawn",
                                ability_entity_templates,
                            ),
                        )
                    )
                if getattr(action, "nestedCondition", None) is not None:
                    visit_conditions((action.nestedCondition,))
                if getattr(action, "onceActions", None) is not None:
                    visit_actions(action.onceActions)

        def visit_conditions(items: tuple[ConditionalActionSource, ...]) -> None:
            for item in items:
                visit_actions(item.succeedActions)
                visit_actions(item.failActions)

        visit_conditions(conditions)
        return result

    def compile_branch_local_projectile(
        action: ConditionalBranchActionSource,
    ) -> str | None:
        triggers = getattr(action, "projectileTriggeredSkills", None) or ()
        active_triggers = tuple(
            trigger
            for trigger in triggers
            if not getattr(trigger, "excludedByPrimaryTargetMarker", False)
        )
        if not active_triggers:
            return None
        compiled_sources: list[str] = []
        for trigger in active_triggers:
            if (
                trigger.assumedTravelFrames != 0
                or trigger.cycleTruncated
                or trigger.damageUnits
                or trigger.directDamageHits
                or trigger.auxiliaryActions
                or trigger.resourceGains
                or trigger.inflictions
                or trigger.nestedProjectileTriggeredSkills
                or (
                    trigger.abilityEntityHits
                    and not projectile_ability_entities_are_condition_projections(trigger)
                )
                or trigger.auraActions
                or trigger.keywordActions
                or any(
                    condition.startFrame != 0
                    or any(frame != 0 for frame in condition.executionFrames)
                    for condition in trigger.conditionalActions
                )
            ):
                return None
            compiled_spawns = tuple(
                collect_compiled_conditional_spawns(trigger.conditionalActions)
            )
            compiled_projectiles = tuple(
                collect_compiled_conditional_projectiles(trigger.conditionalActions)
            )
            covered_actions = set(
                collect_compilable_conditional_action_types(
                    trigger.conditionalActions
                )
            )
            if compiled_spawns:
                covered_actions.add("SpawnAbilityEntity")
            if any(action_type not in covered_actions for action_type in trigger.combatActions):
                return None
            query_sources: list[str] = []
            queried_keys: set[str] = set()
            templates: dict[str, dict[str, Any]] | None = None
            for conditional in iter_nested_conditional_actions(
                trigger.conditionalActions
            ):
                for condition in conditional.conditions:
                    context_key = None
                    timed_marker = getattr(condition, "timedMarker", None)
                    if (
                        condition.sourceType == "CheckTimedMarkerCondition"
                        and timed_marker is not None
                        and timed_marker.targetSource == "Context"
                    ):
                        context_key = timed_marker.targetGroupKey
                    if not context_key or context_key in queried_keys:
                        continue
                    write = resolve_latest_target_group_write_at(
                        read_frame=conditional.startFrame,
                        read_action_index=conditional.actionIndex,
                        read_action_path=conditional.actionPath,
                        target_group_key=context_key,
                        writes=trigger.localTargetGroupWrites,
                    )
                    if (
                        write is None
                        or target_group_write_ability_entity_collection_identity(write)
                        is None
                    ):
                        continue
                    if templates is None:
                        templates = load_ability_entity_template_evidence()
                    query_sources.append(
                        compile_skill_target_group_ability_entity_query(
                            write,
                            templates,
                            f"{skill.key}.{trigger.triggerSkillId}.targetGroupWrite",
                            allow_action_source_owner=True,
                        )
                    )
                    queried_keys.add(context_key)
            compiled_sources.extend(query_sources)
            for condition in trigger.conditionalActions:
                node = _compile_conditional_action_ir(
                    condition,
                    f"{skill.key}.{trigger.triggerSkillId}.conditionalAction",
                    ignored_buff_ids | unmodeled_buff_ids | simulation_no_effect_buff_ids,
                    damage_tags,
                    runtime_blackboard_keys,
                    target_group_writes=trigger.localTargetGroupWrites,
                    root_skill_context=False,
                    input_target="enemy",
                    step_key_prefix=skill.key,
                    buff_definitions=buff_definitions,
                    invoked_child_context=(skill, config),
                    compiled_ability_entity_spawns=compiled_spawns,
                    prefer_compiled_ability_entity_spawns=True,
                    compiled_projectile_launches=compiled_projectiles,
                )
                compiled_sources.extend(render_compiled_sequence_children(node))
        if not compiled_sources:
            return None
        lines = ["sequence("]
        for source in compiled_sources:
            nested = indent_source(source, 2)
            nested[-1] += ","
            lines.extend(nested)
        lines.append(")")
        return "\n".join(lines)

    def collect_compiled_conditional_projectiles(
        conditions: tuple[ConditionalActionSource, ...],
    ) -> list[tuple[tuple[str, ...], str]]:
        result: list[tuple[tuple[str, ...], str]] = []

        def visit_actions(
            actions: tuple[ConditionalBranchActionSource, ...],
            projected: tuple[ConditionalProjectileProjection, ...],
        ) -> None:
            for action in actions:
                launch = getattr(action, "projectileLaunch", None)
                triggers = getattr(action, "projectileTriggeredSkills", None) or ()
                if launch is not None and triggers:
                    projection = ConditionalProjectileProjection(launch, triggers)
                    already_projected = contains_equivalent_projectile_projection(
                        projected, projection
                    )
                    if not already_projected:
                        source = compile_branch_local_projectile(action)
                        if source is not None:
                            result.append((action.actionPath, source))
                nested = getattr(action, "nestedCondition", None)
                if nested is not None:
                    visit_conditions((nested,))
                once_actions = getattr(action, "onceActions", None)
                if once_actions is not None:
                    visit_actions(once_actions, projected)

        def visit_conditions(items: tuple[ConditionalActionSource, ...]) -> None:
            for condition in items:
                projected = getattr(condition, "projectedProjectileLaunches", ())
                visit_actions(condition.succeedActions, projected)
                visit_actions(condition.failActions, projected)

        visit_conditions(conditions)
        return result

    compiled_conditional_projectile_launches = tuple(
        collect_compiled_conditional_projectiles(skill.conditionalActions)
    )
    compiled_conditional_ability_entity_spawns = tuple(
        collect_compiled_conditional_spawns(skill.conditionalActions)
    )
    scheduled_entity_ids = {
        id(item.payload)
        for item in resolved_schedule
        if item.itemType == "abilityEntitySpawn"
    }
    resolved_schedule = tuple(
        sorted(
            (
                *resolved_schedule,
                *(
                    ResolvedScheduleItemSource(
                        frame=entity.spawnFrame,
                        actionOrder=entity.actionOrder,
                        itemType="abilityEntitySpawn",
                        sourcePath=(skill.skillId,),
                        payload=entity,
                        inputTarget="enemy",
                        sequenceOrder=entity.actionOrder[:-1],
                    )
                    for entity in migrated_ability_entities
                    if id(entity) not in scheduled_entity_ids
                ),
            ),
            key=lambda item: (item.frame, item.sequenceOrder, item.actionOrder),
        )
    )

    def is_migrated_child_item(item: ResolvedScheduleItemSource) -> bool:
        if item.itemType == "abilityEntitySpawn":
            return False
        return any(
            len(item.actionOrder) > len(entity.actionOrder)
            and item.actionOrder[: len(entity.actionOrder)] == entity.actionOrder
            and entity.skillId in item.sourcePath
            for entity in migrated_ability_entities
        )
    overlaps = sorted(
        (ignored_buff_ids & unmodeled_buff_ids)
        | (ignored_buff_ids & simulation_no_effect_buff_ids)
        | (unmodeled_buff_ids & simulation_no_effect_buff_ids)
    )
    if overlaps:
        raise ValueError(
            f"{skill.key}.compile: Buff ids cannot use multiple omission categories: {overlaps}"
        )
    validate_unmodeled_buff_ids(
        resolved_schedule,
        unmodeled_buff_ids,
        f"{skill.key}.compile.unmodeledBuffIds",
        buff_definitions,
        skill,
    )
    validate_unmodeled_buff_ids(
        resolved_schedule,
        simulation_no_effect_buff_ids,
        f"{skill.key}.compile.simulationNoEffectBuffIds",
        buff_definitions,
        skill,
    )
    schedule = tuple(
        item
        for item in resolved_schedule
        if not is_migrated_child_item(item)
        if not (
            item.itemType == "buffApplication"
            and (
                cast(AuxiliaryActionSource, item.payload).classification
                in ignored_auxiliary_classifications
                or cast(AuxiliaryActionSource, item.payload).sourceId in ignored_buff_ids
                or cast(AuxiliaryActionSource, item.payload).sourceId in unmodeled_buff_ids
                or cast(AuxiliaryActionSource, item.payload).sourceId
                in simulation_no_effect_buff_ids
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
    singleton_ability_entity_context_keys: set[str] = set()
    target_group_context_keys = {
        write.targetGroupKey for write in getattr(skill, "targetGroupWrites", ())
    }
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
        elif item.itemType == "abilityEntitySpawn":
            entity = cast(AbilityEntityHitSource, item.payload)
            payload = logical_ability_entity_spawn_payload_for_compile(entity, skill)
            if payload is None:
                raise ValueError(
                    f"{skill.key}.schedule[{schedule_index}].abilityEntitySpawn: "
                    "spawn target is outside the zero-space model"
                )
            child_skill = (
                compile_ability_entity_child_skill(
                    entity,
                    skill,
                    config,
                    hits,
                    runtime_blackboard_keys,
                    ignored_auxiliary_classifications=frozenset(
                        ignored_auxiliary_classifications
                    ),
                    ignored_buff_ids=ignored_buff_ids | simulation_no_effect_buff_ids,
                    unmodeled_buff_ids=unmodeled_buff_ids,
                    buff_definitions=buff_definitions,
                )
                if entity in migrated_ability_entities
                else None
            )
            step_lines = compile_logical_ability_entity_spawn(
                payload,
                f"{skill.key}.schedule[{schedule_index}].abilityEntitySpawn",
                ability_entity_templates,
                child_skill,
            ).splitlines()
            if (
                payload.saveToContextKey is not None
                and payload.saveToContextKey not in target_group_context_keys
            ):
                singleton_ability_entity_context_keys.add(payload.saveToContextKey)
        elif item.itemType == "condition":
            payload = cast(ConditionalActionSource, item.payload)
            target_group_writes = (
                item.targetGroupWrites
                or root_target_group_writes_for_condition(skill, item, payload)
            )
            ability_entity_query_steps: list[str] = []
            queried_context_keys: set[str] = set()
            for condition_index, condition in enumerate(payload.conditions):
                entity_count = getattr(condition, "entityCount", None)
                if (
                    condition.sourceType != "CheckEntityNum"
                    or entity_count is None
                    or entity_count.targetSource != "Context"
                    or not entity_count.targetGroupKey
                ):
                    continue
                write = resolve_latest_target_group_write_at(
                    read_frame=payload.startFrame,
                    read_action_index=payload.actionIndex,
                    read_action_path=payload.actionPath,
                    target_group_key=entity_count.targetGroupKey,
                    writes=target_group_writes,
                )
                if (
                    write is None
                    or target_group_write_ability_entity_collection_identity(write)
                    is None
                ):
                    continue
                ability_entity_query_steps.append(
                    compile_skill_target_group_ability_entity_query(
                        write,
                        ability_entity_templates,
                        f"{skill.key}.schedule[{schedule_index}].conditionalAction."
                        f"conditions[{condition_index}].targetGroupWrite",
                        save_count_to_blackboard_key=(entity_count.storeKey or None),
                    )
                )
                queried_context_keys.add(entity_count.targetGroupKey)
            for_each_context_key = getattr(payload, "contextKey", None)
            if (
                isinstance(for_each_context_key, str)
                and for_each_context_key
                and for_each_context_key not in queried_context_keys
            ):
                write = resolve_latest_target_group_write_at(
                    read_frame=payload.startFrame,
                    read_action_index=payload.actionIndex,
                    read_action_path=payload.actionPath,
                    target_group_key=for_each_context_key,
                    writes=target_group_writes,
                )
                if (
                    write is not None
                    and target_group_write_ability_entity_collection_identity(write)
                    is not None
                ):
                    ability_entity_query_steps.append(
                        compile_skill_target_group_ability_entity_query(
                            write,
                            ability_entity_templates,
                            f"{skill.key}.schedule[{schedule_index}].conditionalAction."
                            "forEachTargetGroupWrite",
                        )
                    )
            compiled_condition = _compile_conditional_action_ir(
                payload,
                f"{skill.key}.schedule[{schedule_index}].conditionalAction",
                ignored_buff_ids | unmodeled_buff_ids | simulation_no_effect_buff_ids,
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
                singleton_ability_entity_context_keys=frozenset(
                    singleton_ability_entity_context_keys
                ),
                unmodeled_action_types=unmodeled_action_types,
                aura_actions=getattr(skill, "auraActions", ()),
                invoked_child_context=(skill, config),
                compiled_ability_entity_spawns=tuple(
                    compiled_conditional_ability_entity_spawns
                ),
                compiled_projectile_launches=(
                    compiled_conditional_projectile_launches
                ),
            )
            singleton_ability_entity_context_keys.update(
                projected.saveToContextKey
                for projected in getattr(payload, "projectedAbilityEntitySpawns", ())
                if projected.saveToContextKey is not None
                and projected.saveToContextKey not in target_group_context_keys
            )
            if compiled_condition == COMPILED_EMPTY_SEQUENCE:
                continue
            step_lines = [
                line
                for source in (
                    *ability_entity_query_steps,
                    *render_compiled_sequence_children(compiled_condition),
                )
                for line in source.splitlines()
            ]
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
            context_finish_target = None
            if payload.targetSource == "Context":
                write = resolve_latest_target_group_write_at(
                    read_frame=payload.startFrame,
                    read_action_index=payload.actionIndex,
                    read_action_path=(),
                    target_group_key=payload.targetGroupKey,
                    writes=getattr(skill, "targetGroupWrites", ()),
                    control_flow_actions=getattr(skill, "targetGroupControlFlowActions", ()),
                    root_skill_context=True,
                )
                context_finish_target = target_group_write_buff_application_target(write)
            step_lines = compile_buff_finish(
                payload,
                f"{skill.key}.schedule[{schedule_index}].buffFinish",
                root_skill_context=item.sourcePath == (skill.skillId,),
                input_target=item.inputTarget,
                context_finish_target=context_finish_target,
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
            ability_entity_collection_key = None
            if (
                payload.targetSource == "Context"
                and payload.targetGroupKey != "smart_target"
            ):
                write = (
                    resolve_latest_target_group_write_at(
                        read_frame=payload.startFrame,
                        read_action_index=payload.actionIndex,
                        read_action_path=(),
                        target_group_key=payload.targetGroupKey,
                        writes=skill.targetGroupWrites,
                        control_flow_actions=skill.targetGroupControlFlowActions,
                        root_skill_context=True,
                    )
                    if item.sourcePath == (skill.skillId,)
                    else None
                )
                context_application_target = target_group_write_buff_application_target(write)
                if (
                    context_application_target is None
                    and (
                        payload.targetGroupKey
                        in singleton_ability_entity_context_keys
                        or (
                            write is not None
                            and target_group_write_ability_entity_collection_identity(write)
                            is not None
                        )
                    )
                ):
                    context_application_target = "currentAbilityEntity"
                    ability_entity_collection_key = payload.targetGroupKey
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
                    invoked_child_context=(skill, config),
                    ignored_buff_ids=ignored_buff_ids,
                ).splitlines()
                if ability_entity_collection_key is not None:
                    nested_lines = [f"    {line}" for line in step_lines]
                    nested_lines[-1] += ","
                    step_lines = [
                        "forEachContextTarget(",
                        f"  {ts_inline_literal(ability_entity_collection_key)},",
                        "  sequence(",
                        *nested_lines,
                        "  ),",
                        ")",
                    ]
                relation = next(
                    (
                        candidate
                        for candidate in activation_relations
                        if candidate["activatedByBuffId"] == payload.sourceId
                    ),
                    None,
                )
                if relation is not None:
                    step_lines.extend(
                        [
                            "step('changeSkillSlot', {",
                            f"  skillGroupKey: {ts_inline_literal(relation['baseSkillKey'])},",
                            f"  targetSkillKey: {ts_inline_literal(relation['replacementSkillKey'])},",
                            "})",
                        ]
                    )
        elif item.itemType == "skillSlotReplacement":
            relation = next(
                (
                    candidate
                    for candidate in revert_relations
                    if candidate["revertOnReplacementCastFrame"] == item.frame
                    and candidate["revertActionIndex"] == item.actionOrder[0]
                ),
                None,
            )
            if relation is None:
                raise AssertionError(f"{skill.key}: missing proven slot replacement relation")
            step_lines = [
                "step('changeSkillSlot', {",
                f"  skillGroupKey: {ts_inline_literal(relation['baseSkillKey'])},",
                f"  targetSkillKey: {ts_inline_literal(relation['baseSkillKey'])},",
                "})",
            ]
        elif item.itemType == "eventListener":
            payload = cast(SkillEventListenerSource, item.payload)
            compiled_listener = compile_skill_event_listener(
                payload,
                f"{skill.key}.schedule[{schedule_index}].eventListener",
                runtime_blackboard_keys=runtime_blackboard_keys,
                step_key_prefix=skill.key,
                buff_definitions=buff_definitions,
                ignored_buff_ids=ignored_buff_ids,
            )
            if compiled_listener is None:
                continue
            step_lines = compiled_listener.splitlines()
        elif item.itemType == "timeDilation":
            payload = cast(TimedTimeDilationSource, item.payload)
            step_lines = compile_time_dilation(
                payload,
                f"{skill.key}.schedule[{schedule_index}].timeDilation",
                effect_ability_entity_targets_proven=(
                    ability_entity_time_dilation_targets_are_closed(
                        payload,
                        skill,
                        reachable_ability_entities,
                        migrated_ability_entities,
                        ability_entity_templates,
                    )
                ),
                ability_entity_templates=ability_entity_templates,
            ).splitlines()
        elif item.itemType == "keywordAction":
            payload = cast(TimedKeywordActionSource, item.payload)
            step_lines = compile_keyword_action(
                payload,
                f"{skill.key}.schedule[{schedule_index}].keywordAction",
                root_skill_context=item.sourcePath == (skill.skillId,),
                input_target=item.inputTarget,
            ).splitlines()
        elif item.itemType == "timelineJump":
            payload = cast(TimedTimelineJumpSource, item.payload)
            condition_lines: list[str] = []
            if payload.directConditions or payload.directAnyConditions:
                condition = compile_combat_condition_group(
                    payload.directConditions,
                    f"{skill.key}.schedule[{schedule_index}].timelineJump.condition",
                    root_skill_context=True,
                    input_target="enemy",
                    negated=payload.directConditionNegated,
                    any_groups=payload.directAnyConditions,
                    any_group_negated=payload.directAnyConditionNegated,
                )
                condition_lines = condition.splitlines()
                condition_lines[0] = f"  condition: {condition_lines[0]}"
                condition_lines[1:] = [f"  {line}" for line in condition_lines[1:]]
                condition_lines[-1] += ","
            step_lines = [
                "step('jumpTimeline', {",
                f"  destinationFrame: {payload.destFrame},",
                *condition_lines,
                "})",
            ]
        elif item.itemType == "timelineFinish":
            cast(TimedTimelineFinishSource, item.payload)
            step_lines = ["step('finishTimeline', {})"]
        elif item.itemType == "auraAction":
            payload = cast(AuraActionSource, item.payload)
            step_lines = compile_aura_action(
                payload,
                f"{skill.key}.schedule[{schedule_index}].auraAction",
                buff_definitions=buff_definitions,
                invoked_child_context=(skill, config),
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
        end_frames: set[int] = set()
        for item, _ in entries:
            if item.itemType == "buffApplication":
                application = cast(AuxiliaryActionSource, item.payload)
                if application.autoFinishByAction is True:
                    end_frames.add(
                        item.frame + application.endFrame - application.startFrame
                    )
                continue
            if (
                item.itemType in {"buffHold", "eventListener", "timeDilation", "timelineJump"}
                or (
                    item.itemType == "condition"
                    and (
                        isinstance(item.payload, EveryFrameActionSource)
                        or conditional_action_contains_aura(
                            cast(ConditionalActionSource, item.payload),
                            getattr(skill, "auraActions", ()),
                        )
                    )
                )
                or item.itemType == "auraAction"
            ):
                end_frames.add(
                    cast(
                        BuffHoldSource
                        | SkillEventListenerSource
                        | TimedTimeDilationSource
                        | TimedTimelineJumpSource
                        | EveryFrameActionSource
                        | AuraActionSource,
                        item.payload,
                    ).endFrame
                )
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
            f"    sourceSkillId: {ts_inline_literal(skill.skillId)},",
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
