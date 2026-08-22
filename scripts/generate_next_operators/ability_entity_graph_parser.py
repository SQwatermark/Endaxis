"""能力实体生成、条件投影与递归 SkillData 调用图解析。"""

from __future__ import annotations

from dataclasses import dataclass, fields, is_dataclass, replace
from pathlib import Path
from typing import Any, Callable

from action_kinds import AUDITED_COMBAT_ACTION_NAMES
from action_payload_parser import parse_ability_entity_spawn_payload
from conditional_parser import parse_conditional_actions
from keyword_action_parser import parse_timed_keyword_actions
from projectile_graph_parser import (
    collect_projected_conditional_projectile_skills,
    projectile_projections_are_equivalent,
)
from source_models import (
    AbilityEntityHitSource,
    AbilityEntitySpawnPayload,
    AuraActionSource,
    ConditionalActionSource,
    ConditionalBranchActionSource,
    ConditionalProjectileProjection,
)
from source_utils import (
    action_name,
    require_dict,
    require_list,
    require_non_negative_int,
    require_server_action_index,
)


@dataclass(frozen=True)
class AbilityEntityGraphParserServices:
    """由入口注入其他动作族解析器、来源加载及兼容递归入口。"""

    load_projected_skill_data: Callable[..., Any]
    numeric_declared_blackboard: Callable[..., Any]
    parse_ability_entity_finishes: Callable[..., Any]
    parse_aura_actions: Callable[..., Any]
    parse_auxiliary_actions: Callable[..., Any]
    parse_blackboard_calculations: Callable[..., Any]
    parse_blackboard_runtime_actions: Callable[..., Any]
    parse_declared_blackboard: Callable[..., Any]
    parse_direct_damage_hits: Callable[..., Any]
    parse_inflictions: Callable[..., Any]
    parse_interval_damage_hits: Callable[..., Any]
    parse_knock_down_outputs: Callable[..., Any]
    parse_projectile_launches: Callable[..., Any]
    parse_resource_gains: Callable[..., Any]
    parse_target_group_writes: Callable[..., Any]
    parse_timeline_jumps: Callable[..., Any]
    resolve_ability_entity_payload: Callable[..., Any]
    resolve_conditional_projectile_triggers: Callable[..., Any]
    resolve_projectile_triggered_skills: Callable[..., Any]
    walk_actions: Callable[..., Any]
    walk_unconditional_actions: Callable[..., Any]


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
    *,
    services: AbilityEntityGraphParserServices,
) -> tuple[ConditionalActionSource, ...]:
    """解析条件分支专属能力实体子技能，但不把它提升为必然根调度。"""

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
                services=services,
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

        hits = action.conditionalAbilityEntityHits
        payload = action.abilityEntitySpawn
        if payload is not None and payload.skillId is not None:
            child_name = f"{payload.skillId}.json"
            child_path = source_dir / child_name
            if not child_path.is_file():
                raise FileNotFoundError(
                    f"{source_name}: missing conditional ability entity skill {child_path}"
                )
            child = services.load_projected_skill_data(child_path, child_name)
            resolved_hit = services.resolve_ability_entity_payload(
                    payload,
                    child,
                    child_name,
                    source_dir,
                    base_frame + condition.startFrame,
                    stack,
                    inherited_blackboard,
                    action_order,
                )
            hits = (resolved_hit,)
        return replace(
            action,
            nestedCondition=nested,
            onceActions=once_actions,
            conditionalAbilityEntityHits=hits,
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


def resolve_ability_entity_hits(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    base_frame: int = 0,
    stack: tuple[str, ...] = (),
    inherited_blackboard: dict[str, tuple[float, ...]] | None = None,
    parent_action_order: tuple[int, ...] | None = None,
    *,
    services: AbilityEntityGraphParserServices,
) -> tuple[AbilityEntityHitSource, ...]:
    """解析 SpawnAbilityEntity 引用的子技能，并保留父技能中的生成时刻。"""
    walk_unconditional_actions = services.walk_unconditional_actions
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
            child = services.load_projected_skill_data(child_path, child_name)
            current_action_order = (
                *(parent_action_order or ()),
                require_server_action_index(action, f"{source_name}.SpawnAbilityEntity"),
            )
            result.append(
                services.resolve_ability_entity_payload(
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
    *,
    services: AbilityEntityGraphParserServices,
) -> AbilityEntityHitSource:
    """解析一项已确定会发生的能力实体生成，不关心它来自根动作还是条件叶子。"""
    parse_declared_blackboard = services.parse_declared_blackboard
    numeric_declared_blackboard = services.numeric_declared_blackboard
    parse_blackboard_calculations = services.parse_blackboard_calculations
    parse_blackboard_runtime_actions = services.parse_blackboard_runtime_actions
    parse_direct_damage_hits = services.parse_direct_damage_hits
    parse_interval_damage_hits = services.parse_interval_damage_hits
    parse_ability_entity_finishes = services.parse_ability_entity_finishes
    parse_timeline_jumps = services.parse_timeline_jumps
    parse_inflictions = services.parse_inflictions
    parse_auxiliary_actions = services.parse_auxiliary_actions
    parse_resource_gains = services.parse_resource_gains
    parse_projectile_launches = services.parse_projectile_launches
    resolve_conditional_projectile_triggers = (
        services.resolve_conditional_projectile_triggers
    )
    resolve_projectile_triggered_skills = services.resolve_projectile_triggered_skills
    parse_aura_actions = services.parse_aura_actions
    parse_target_group_writes = services.parse_target_group_writes
    walk_actions = services.walk_actions
    skill_id = payload.skillId
    if skill_id is None:
        raise AssertionError("combat ability entity payload must expose skillId")
    declared_blackboard = parse_declared_blackboard(child, child_name)
    # 子 SkillData 的 dynamic 声明仍是该技能实例的真实初值。它不能进入根技能的
    # 静态等级黑板，但在递归局部图中，若没有继承值/补丁/动作写入，必须作为
    # 精确来源参与解析；assignBlackboard 和显式 assignPairs 随后按原生顺序覆盖它。
    child_blackboard = numeric_declared_blackboard(
        declared_blackboard,
        include_dynamic_defaults=True,
    )
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
    child_conditions = parse_conditional_actions(
        child,
        child_name,
        child_blackboard,
        include_for_each_sequence_guards=True,
    )
    child_calculations = parse_blackboard_calculations(child, child_name, child_blackboard)
    child_mutations, child_reads, child_finishes = parse_blackboard_runtime_actions(
        child, child_name, child_blackboard
    )
    nested = ()
    if not cycle_truncated:
        child_stack = (*stack, skill_id)
        child_conditions = resolve_conditional_projectile_triggers(
            child_conditions,
            child,
            child_name,
            source_dir,
            spawn_frame,
            child_stack,
            child_blackboard,
            action_order,
        )
        child_conditions = mark_projected_conditional_children(
            resolve_conditional_aura_ability_entity_children(
                child_conditions,
                child_name,
                source_dir,
                spawn_frame,
                child_stack,
                child_blackboard,
                action_order,
                services=services,
            )
        )
        nested = (
            *resolve_ability_entity_hits(
                child,
                child_name,
                source_dir,
                spawn_frame,
                child_stack,
                child_blackboard,
                parent_action_order=action_order,
                services=services,
            ),
            *resolve_guaranteed_conditional_ability_entity_hits(
                child_conditions,
                child_name,
                source_dir,
                spawn_frame,
                child_stack,
                child_blackboard,
                action_order,
                services=services,
            ),
        )
    child_actions = tuple(walk_actions(child.get("actionGroupData")))
    switch_actions = tuple(
        item for item in child_actions if action_name(item["$type"]) == "SwitchAction"
    )
    presentation_only_switches = tuple(
        item
        for item in switch_actions
        if not any(
            action_name(descendant["$type"])
            in AUDITED_COMBAT_ACTION_NAMES - {"SwitchAction"}
            for descendant in walk_actions(item)
        )
    )
    combat_action_names = {
        action_name(item["$type"])
        for item in child_actions
        if action_name(item["$type"]) in AUDITED_COMBAT_ACTION_NAMES
    }
    if switch_actions and len(presentation_only_switches) == len(switch_actions):
        combat_action_names.discard("SwitchAction")
    combat_actions = tuple(sorted(combat_action_names))
    return AbilityEntityHitSource(
        spawnFrame=spawn_frame,
        actionOrder=action_order,
        abilityEntityId=payload.abilityEntityId,
        skillId=skill_id,
        sourceFile=child_name,
        entityBlackboardAssignments=payload.entityBlackboardAssignments,
        spawnPayload=payload,
        directDamageHits=parse_direct_damage_hits(child, child_name, child_blackboard),
        intervalDamageHits=parse_interval_damage_hits(child, child_name, child_blackboard),
        explicitFinishes=parse_ability_entity_finishes(child, child_name),
        timelineJumps=parse_timeline_jumps(child, child_name, child_blackboard),
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
        knockDownOutputs=services.parse_knock_down_outputs(
            child, child_name, child_blackboard
        ),
        localTargetGroupWrites=parse_target_group_writes(child, child_name),
        presentationOnlySwitchActionIndexes=tuple(
            require_server_action_index(item, f"{child_name}.SwitchAction")
            for item in presentation_only_switches
        ),
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
    *,
    services: AbilityEntityGraphParserServices,
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
            child = services.load_projected_skill_data(child_path, child_name)
            result.append(
                services.resolve_ability_entity_payload(
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
