"""投射物触发、嵌套 SkillData 与条件投影调用图解析。"""

from __future__ import annotations

from dataclasses import asdict, dataclass, replace
from pathlib import Path
from typing import Any, Callable

from action_kinds import AUDITED_COMBAT_ACTION_NAMES, COMBAT_ACTION_NAMES
from action_payload_parser import parse_damage_units, parse_projectile_launch_payload
from conditional_parser import parse_conditional_actions
from keyword_action_parser import parse_timed_keyword_actions
from source_models import (
    ActionBlackboardScopeSource,
    ConditionalActionSource,
    ConditionalBranchActionSource,
    ConditionalProjectileProjection,
    ProjectileLaunchPayload,
    ProjectileLaunchSource,
    ProjectileSkillTriggerSource,
    ProjectileTriggeredSkillSource,
)
from source_utils import (
    action_name,
    require_dict,
    require_list,
    require_non_negative_int,
    require_server_action_index,
)


ASSUMED_PROJECTILE_TRAVEL_FRAMES = 0


def filter_condition_owned_auxiliary_actions(
    auxiliary_actions: tuple[Any, ...],
    conditions: tuple[ConditionalActionSource, ...],
) -> tuple[Any, ...]:
    """去掉已由条件树拥有的 CreateBuffAction，避免根调度重复执行。"""

    owned_buff_actions: set[tuple[int, str]] = set()

    def visit_actions(actions: tuple[ConditionalBranchActionSource, ...]) -> None:
        for action in actions:
            application = action.buffApplication
            if application is not None:
                action_index = (
                    action.serverActionIndex
                    if action.serverActionIndex is not None
                    else action.actionIndex
                )
                owned_buff_actions.update(
                    (action_index, buff.buffId) for buff in application.buffs
                )
            if action.nestedCondition is not None:
                visit_condition(action.nestedCondition)
            if action.onceActions is not None:
                visit_actions(action.onceActions)

    def visit_condition(condition: ConditionalActionSource) -> None:
        visit_actions(condition.succeedActions)
        visit_actions(condition.failActions)

    for condition in conditions:
        visit_condition(condition)
    return tuple(
        action
        for action in auxiliary_actions
        if not (
            action.actionType == "CreateBuffAction"
            and (action.actionIndex, action.sourceId) in owned_buff_actions
        )
    )


@dataclass(frozen=True)
class ProjectileGraphParserServices:
    """由入口注入的能力实体侧解析、来源加载与递归动作遍历服务。"""

    load_projected_skill_data: Callable[..., Any]
    numeric_declared_blackboard: Callable[..., Any]
    parse_aura_actions: Callable[..., Any]
    parse_auxiliary_actions: Callable[..., Any]
    parse_declared_blackboard: Callable[..., Any]
    parse_direct_damage_hits: Callable[..., Any]
    parse_inflictions: Callable[..., Any]
    parse_resource_gains: Callable[..., Any]
    parse_target_group_writes: Callable[..., Any]
    resolve_ability_entity_hits: Callable[..., Any]
    resolve_conditional_aura_ability_entity_children: Callable[..., Any]
    resolve_guaranteed_conditional_ability_entity_hits: Callable[..., Any]
    resolve_projectile_payload_triggers: Callable[..., Any]
    resolve_projectile_single_enemy_input_target: Callable[..., Any]
    resolve_projectile_entity_blackboard: Callable[..., Any]
    mark_projected_conditional_children: Callable[..., Any]
    walk_actions: Callable[..., Any]
    walk_unconditional_actions: Callable[..., Any]


def is_projectile_trigger_excluded_for_single_enemy(
    root: dict[str, Any],
    launch_frame: int,
    launch_action_index: int,
    trigger_root: dict[str, Any],
    trigger_source_name: str,
    *,
    services: ProjectileGraphParserServices,
) -> bool:
    """识别先标记主目标、再仅处理未标记命中目标的额外目标投射物。"""
    walk_actions = services.walk_actions
    walk_unconditional_actions = services.walk_unconditional_actions

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

def resolve_projectile_payload_triggers(
    payload: ProjectileLaunchPayload,
    source_root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    launch_frame: int,
    action_order: tuple[int, ...],
    stack: tuple[str, ...],
    inherited_blackboard: dict[str, tuple[float, ...]],
    *,
    services: ProjectileGraphParserServices,
) -> tuple[ProjectileTriggeredSkillSource, ...]:
    """解析一次已定位的投射物发射；调用方负责提供其真实帧与动作顺序。"""
    load_projected_skill_data = services.load_projected_skill_data
    numeric_declared_blackboard = services.numeric_declared_blackboard
    parse_aura_actions = services.parse_aura_actions
    parse_auxiliary_actions = services.parse_auxiliary_actions
    parse_declared_blackboard = services.parse_declared_blackboard
    parse_direct_damage_hits = services.parse_direct_damage_hits
    parse_inflictions = services.parse_inflictions
    parse_resource_gains = services.parse_resource_gains
    parse_target_group_writes = services.parse_target_group_writes
    resolve_ability_entity_hits = services.resolve_ability_entity_hits
    resolve_conditional_aura_ability_entity_children = services.resolve_conditional_aura_ability_entity_children
    resolve_guaranteed_conditional_ability_entity_hits = services.resolve_guaranteed_conditional_ability_entity_hits
    mark_projected_conditional_children = services.mark_projected_conditional_children
    walk_actions = services.walk_actions
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
        declared_blackboard = parse_declared_blackboard(trigger_root, trigger_source_name)
        trigger_blackboard = numeric_declared_blackboard(
            declared_blackboard,
            include_dynamic_defaults=True,
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
                services=services,
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
                    services=services,
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
                    services=services,
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
                auxiliaryActions=filter_condition_owned_auxiliary_actions(
                    parse_auxiliary_actions(
                        trigger_root,
                        trigger_source_name,
                        source_dir,
                        trigger_blackboard,
                    ),
                    trigger_conditions,
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
                localTargetGroupWrites=parse_target_group_writes(
                    trigger_root, trigger_source_name
                ),
                actionBlackboardScope=ActionBlackboardScopeSource(
                    scopeKey=(
                        f"projectile:{trigger.skillId}:"
                        + ".".join(str(index) for index in action_order)
                    ),
                    initialValues=tuple(
                        (item.key, item.value)
                        for item in declared_blackboard
                        if isinstance(item.value, float)
                    ),
                    inheritParent=payload.assignBlackboard,
                    entityInitialValues=services.resolve_projectile_entity_blackboard(
                        payload.projectileId
                    ),
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
    *,
    services: ProjectileGraphParserServices,
) -> tuple[ProjectileTriggeredSkillSource, ...]:
    walk_unconditional_actions = services.walk_unconditional_actions
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
                    services=services,
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
    *,
    services: ProjectileGraphParserServices,
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
        launch = action.projectileLaunch
        triggered = action.projectileTriggeredSkills
        if launch is not None:
            launch = replace(
                launch,
                singleEnemyInputTarget=(
                    services.resolve_projectile_single_enemy_input_target(
                        launch.projectileId
                    )
                ),
            )
            triggered = services.resolve_projectile_payload_triggers(
                launch,
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
            projectileLaunch=launch,
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

def parse_projectile_launches(
    root: dict[str, Any],
    source_name: str,
    base_frame: int = 0,
    *,
    services: ProjectileGraphParserServices,
) -> tuple[ProjectileLaunchSource, ...]:
    walk_unconditional_actions = services.walk_unconditional_actions
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
                if key not in {"actionOrder", "actionBlackboardScope"}
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
