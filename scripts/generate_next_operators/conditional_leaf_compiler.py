"""条件分支叶子动作到 Next DSL 步骤的语义编译。"""

from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Any, Callable, Literal

from source_models import (
    AbilityEntitySpawnPayload,
    AuraActionSource,
    BuffDefinitionSource,
    ConditionalActionSource,
    ConditionalBranchActionSource,
    ConditionalProjectileProjection,
    SkillSource,
    TargetGroupWriteSource,
    TargetReferenceSource,
)
from source_utils import indent_source, ts_inline_literal
from single_enemy_projectile import recursive_projectile_launch_has_no_single_enemy_target


@dataclass(frozen=True)
class ConditionalLeafServices:
    """由生成入口注入的动作载荷编译与目标证明服务。"""

    compile_blackboard_calculation: Callable[..., Any]
    compile_blackboard_mutation: Callable[..., Any]
    compile_aura_action: Callable[..., Any]
    compile_buff_blackboard_read: Callable[..., Any]
    compile_buff_finish: Callable[..., Any]
    compile_buff_stack_read: Callable[..., Any]
    compile_condition_operand: Callable[..., Any]
    compile_conditional_action: Callable[..., Any]
    compile_conditional_branch: Callable[..., Any]
    compile_conditional_buff_application: Callable[..., Any]
    compile_damage_units_step: Callable[..., Any]
    compile_global_cooldown_application: Callable[..., Any]
    compile_immediate_projectile_children: Callable[..., Any]
    compile_keyword_action: Callable[..., Any]
    compile_logical_ability_entity_spawn: Callable[..., Any]
    compile_knock_down_output: Callable[..., Any]
    compile_physical_infliction: Callable[..., Any]
    compile_resource_gain: Callable[..., Any]
    compile_skill_target_group_ability_entity_query: Callable[..., Any]
    compile_time_dilation: Callable[..., Any]
    compile_timed_marker_application: Callable[..., Any]
    contains_equivalent_projectile_projection: Callable[..., Any]
    encode_damage_step_key: Callable[..., Any]
    resolve_fixed_combat_target: Callable[..., Any]
    resolve_latest_target_group_write_at: Callable[..., Any]
    target_group_write_ability_entity_collection_identity: Callable[..., Any]
    target_group_write_buff_application_target: Callable[..., Any]
    target_group_write_guarantees_single_enemy: Callable[..., Any]


def target_reference_party_target(
    target: TargetReferenceSource,
) -> Literal["party", "partyExceptCaster"] | None:
    """识别直接 CharacterTeamFinder 引用的固定队伍集合。"""
    if (
        target.targetSource not in {"InstantSearch", "Source"}
        or target.finderType != "CharacterTeamFinder"
        or target.postProcessorTypes
    ):
        return None
    if not target.validatorTypes:
        return "party"
    if target.validatorTypes == ("ExcludeOwnerValidator",):
        return "partyExceptCaster"
    return None


def guarded_context_group_is_unique_enemy(
    action: ConditionalBranchActionSource,
    context_action: ConditionalActionSource | None,
    target_group_key: str,
    write: TargetGroupWriteSource | None,
) -> bool:
    """在唯一敌人模型中，SmartTarget 结果若已被同一条件的非空守卫证明，
    则其成功分支内的单体只能是该敌人。失败分支和其他 finder 不做此归约。"""
    if (
        context_action is None
        or write is None
        or write.finderType != "SmartTargetFinder"
        or write.producerType != "FindTargetAction"
    ):
        return False
    suffix = action.actionPath[len(context_action.actionPath) :]
    if "succeedActions" not in suffix:
        return False
    return any(
        condition.entityCount is not None
        and condition.entityCount.targetSource == "Context"
        and condition.entityCount.targetGroupKey == target_group_key
        and condition.entityCount.minimumCount >= 1
        and condition.entityCount.comparison in {"GE", "GT", "EQ"}
        for condition in context_action.conditions
    )


def compile_pick_target_group_write(write: TargetGroupWriteSource, path: str) -> str:
    """把已解析的 PickTarget 写入编译为单体 Context 选择。"""
    if write.producerType != "PickTargetAction" or len(write.inputTargets) != 1:
        raise ValueError(f"{path}: PickTargetAction has no unique input group")
    source = write.inputTargets[0]
    if (
        source.targetSource != "Context"
        or not source.targetGroupKey
        or source.finderType is not None
        or source.validatorTypes
        or source.postProcessorTypes
    ):
        raise ValueError(f"{path}: unsupported PickTargetAction input")
    index = (
        "{ kind: 'blackboard', key: "
        f"{ts_inline_literal(write.pickIndexBlackboardKey)} }}"
        if write.pickIndexBlackboardKey is not None
        else "{ kind: 'constant', value: "
        f"{write.pickIndexValue} }}"
    )
    return (
        "step('pickContextTarget', { sourceContextKey: "
        f"{ts_inline_literal(source.targetGroupKey)}, saveToContextKey: "
        f"{ts_inline_literal(write.targetGroupKey)}, index: {index} }})"
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
    prefer_compiled_ability_entity_spawns: bool = False,
    current_ability_entity_id: str | None = None,
    *,
    services: ConditionalLeafServices,
) -> str:
    """编译一个条件分支叶子；未闭环动作必须在这里显式拒绝。"""
    compile_blackboard_calculation = services.compile_blackboard_calculation
    compile_blackboard_mutation = services.compile_blackboard_mutation
    compile_aura_action = services.compile_aura_action
    compile_buff_blackboard_read = services.compile_buff_blackboard_read
    compile_buff_finish = services.compile_buff_finish
    compile_buff_stack_read = services.compile_buff_stack_read
    compile_condition_operand = services.compile_condition_operand
    compile_conditional_action = services.compile_conditional_action
    compile_conditional_branch = services.compile_conditional_branch
    compile_conditional_buff_application = services.compile_conditional_buff_application
    compile_damage_units_step = services.compile_damage_units_step
    compile_global_cooldown_application = services.compile_global_cooldown_application
    compile_immediate_projectile_children = services.compile_immediate_projectile_children
    compile_keyword_action = services.compile_keyword_action
    compile_logical_ability_entity_spawn = services.compile_logical_ability_entity_spawn
    compile_knock_down_output = services.compile_knock_down_output
    compile_physical_infliction = services.compile_physical_infliction
    compile_resource_gain = services.compile_resource_gain
    compile_skill_target_group_ability_entity_query = (
        services.compile_skill_target_group_ability_entity_query
    )
    compile_time_dilation = services.compile_time_dilation
    compile_timed_marker_application = services.compile_timed_marker_application
    contains_equivalent_projectile_projection = services.contains_equivalent_projectile_projection
    encode_damage_step_key = services.encode_damage_step_key
    resolve_fixed_combat_target = services.resolve_fixed_combat_target
    resolve_latest_target_group_write_at = services.resolve_latest_target_group_write_at
    target_group_write_ability_entity_collection_identity = services.target_group_write_ability_entity_collection_identity
    target_group_write_buff_application_target = services.target_group_write_buff_application_target
    target_group_write_guarantees_single_enemy = services.target_group_write_guarantees_single_enemy
    if action.actionType in unmodeled_action_types:
        # 只允许 manifest 逐技能显式声明、且已由 unresolvedCombatActions
        # 反向验证存在的缺口。它仍会保留在 audit 中，不能被误报为已建模。
        return "sequence()"
    if action.actionType == "AuraAction":
        matches = tuple(
            aura
            for aura in aura_actions
            if aura.actionPath == action.actionPath
            or (
                current_buff_environment
                and aura.actionIndex == action.serverActionIndex
            )
        )
        if len(matches) != 1:
            raise ValueError(
                f"{path}: conditional AuraAction requires one exact parsed payload"
            )
        return compile_aura_action(
            matches[0],
            path,
            buff_definitions=buff_definitions,
            invoked_child_context=invoked_child_context,
            current_ability_entity_id=current_ability_entity_id,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
        )
    if action.actionType == "PickTargetAction":
        matches = tuple(
            write
            for write in target_group_writes
            if write.producerType == "PickTargetAction"
            and (
                write.actionPath == action.actionPath
                or (
                    current_buff_environment
                    and write.actionIndex == action.serverActionIndex
                )
            )
        )
        if len(matches) != 1:
            raise ValueError(f"{path}: PickTargetAction requires one exact target-group write")
        write = matches[0]
        return compile_pick_target_group_write(write, path)
    if action.actionType in {
        "ContinuousFindTargetAction",
        "FindTargetAction",
        "MergeTargetAction",
    }:
        if current_buff_environment and action.actionType in {
            "ContinuousFindTargetAction",
            "FindTargetAction",
        }:
            matches = tuple(
                write
                for write in target_group_writes
                if write.producerType == action.actionType
                and write.actionPath == action.actionPath
            )
            if not matches:
                matches = tuple(
                    write
                    for write in target_group_writes
                    if write.producerType == action.actionType
                    and write.actionIndex == action.serverActionIndex
                )
                original_matches = tuple(write for write in matches if write.actionPath)
                if original_matches:
                    matches = original_matches
            if (
                len(matches) == 1
                and target_group_write_ability_entity_collection_identity(
                    matches[0], target_group_writes
                )
                is not None
            ):
                return compile_skill_target_group_ability_entity_query(
                    matches[0],
                    path,
                    save_count_to_blackboard_key=matches[0].saveCountToBlackboardKey,
                    allow_action_source_owner=True,
                )
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
            ability_entity_current_target=ability_entity_current_target,
            singleton_ability_entity_context_keys=singleton_ability_entity_context_keys,
            buff_ability_damage_event=buff_ability_damage_event,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            invoked_child_context=invoked_child_context,
            unmodeled_action_types=unmodeled_action_types,
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
            ability_entity_current_target=ability_entity_current_target,
            singleton_ability_entity_context_keys=singleton_ability_entity_context_keys,
            buff_ability_damage_event=buff_ability_damage_event,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            invoked_child_context=invoked_child_context,
            unmodeled_action_types=unmodeled_action_types,
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
        matches = tuple(
            source
            for action_path, source in compiled_ability_entity_spawns
            if action_path == action.actionPath
        )
        if prefer_compiled_ability_entity_spawns and len(matches) == 1:
            return matches[0]
        if ability_entity_spawn in projected_ability_entity_spawns:
            return "sequence()"
        if len(matches) == 1:
            return matches[0]
        # Buff/Ability 事件内的纯逻辑实例不在根技能调用图中；
        # 仍复用同一零空间形状校验和模板生命周期，不按 ID 特判。
        try:
            return compile_logical_ability_entity_spawn(
                ability_entity_spawn,
                path,
            )
        except ValueError:
            pass
        raise ValueError(f"{path}: unsupported conditional leaf {action.actionType!r}")
    duration_assignment = getattr(action, "abilityEntityDurationAssignment", None)
    if duration_assignment is not None:
        if duration_assignment.operation != "Assign" or duration_assignment.setMultipleTarget:
            raise ValueError(f"{path}: unsupported ability entity duration assignment")
        compiled_assignment = (
            "step('setAbilityEntityRemainingDuration', { value: "
            f"{compile_condition_operand(duration_assignment.value, f'{path}.value')} }})"
        )
        if duration_assignment.actionTargetType == "InputTarget":
            if not ability_entity_current_target:
                raise ValueError(f"{path}: ability entity current target is unavailable")
            return compiled_assignment
        if (
            duration_assignment.targetContextKey
            not in singleton_ability_entity_context_keys
        ):
            raise ValueError(
                f"{path}: ContextTarget duration assignment requires singleton provenance"
            )
        return "\n".join(
            [
                "forEachContextTarget(",
                f"  {ts_inline_literal(duration_assignment.targetContextKey)},",
                "  sequence(",
                f"    {compiled_assignment},",
                "  ),",
                ")",
            ]
        )
    projectile_launch = getattr(action, "projectileLaunch", None)
    if projectile_launch is not None:
        if recursive_projectile_launch_has_no_single_enemy_target(
            action, target_group_writes
        ):
            return "sequence()"
        compiled_matches = tuple(
            source
            for action_path, source in compiled_projectile_launches
            if action_path == action.actionPath
        )
        if len(compiled_matches) == 1:
            return compiled_matches[0]
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
            ignored_buff_ids=ignored_buff_ids,
            buff_definitions=buff_definitions,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            invoked_child_context=invoked_child_context,
            projectile_launch=projection.launch,
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
    interrupt = getattr(action, "interrupt", None)
    if interrupt is not None:
        # 当前模拟器没有敌方主动技能、红圈可打断状态或行动时间线。
        # 原生 InterruptAction 自身恒返回成功，因此在这里是可安全归约的零效果动作；
        # 完整目标、霸体上限与定身参数仍保留在 audit source model 中。
        return "sequence()"
    if getattr(action, "keywordAction", None) is not None:
        return compile_keyword_action(
            action.keywordAction,
            path,
            root_skill_context=root_skill_context,
            input_target=input_target,
            context_action=context_action,
            target_group_writes=target_group_writes,
        )
    if getattr(action, "timeDilation", None) is not None:
        return compile_time_dilation(action.timeDilation, path)
    if getattr(action, "buffBlackboardRead", None) is not None:
        buff_read = action.buffBlackboardRead
        context_target_is_enemy = False
        if (
            buff_read.targetSource == "Context"
            and buff_read.targetGroupKey != "smart_target"
            and context_action is not None
        ):
            write = resolve_latest_target_group_write_at(
                read_frame=getattr(context_action, "startFrame", 0),
                read_action_index=(
                    getattr(action, "serverActionIndex", None)
                    if getattr(action, "serverActionIndex", None) is not None
                    else getattr(context_action, "actionIndex", 0)
                ),
                read_action_path=(
                    getattr(action, "actionPath", ())
                    or getattr(context_action, "actionPath", ())
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
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            current_event_target=buff_ability_damage_event,
        )
    if getattr(action, "buffFinish", None) is not None:
        finish = action.buffFinish
        context_finish_target = None
        if finish.targetSource == "Context" and finish.targetGroupKey:
            write = resolve_latest_target_group_write_at(
                read_frame=getattr(context_action, "startFrame", 0),
                read_action_index=(
                    getattr(action, "serverActionIndex", None)
                    if getattr(action, "serverActionIndex", None) is not None
                    else getattr(
                        context_action,
                        "actionIndex",
                        getattr(action, "actionIndex", 0),
                    )
                ),
                read_action_path=(
                    getattr(action, "actionPath", ())
                    or getattr(context_action, "actionPath", ())
                ),
                target_group_key=finish.targetGroupKey,
                writes=target_group_writes,
            )
            if write is not None and target_group_write_guarantees_single_enemy(write):
                context_finish_target = "enemy"
        return compile_buff_finish(
            finish,
            path,
            action=context_action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            current_event_target=buff_ability_damage_event,
            context_finish_target=context_finish_target,
        )
    if getattr(action, "buffStackRead", None) is not None:
        return compile_buff_stack_read(
            action.buffStackRead,
            path,
            action=context_action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            current_event_target=buff_ability_damage_event,
        )
    cooldown_adjustment = getattr(action, "skillCooldownAdjustment", None)
    if cooldown_adjustment is not None:
        if (
            cooldown_adjustment.target.targetSource
            not in (
                {"Owner", "Source"}
                if root_skill_context or current_buff_environment
                else {"Owner"}
            )
            or cooldown_adjustment.target.targetGroupKey
            or cooldown_adjustment.target.validatorTypes
            or cooldown_adjustment.target.postProcessorTypes
        ):
            raise ValueError(f"{path}: unsupported skill cooldown adjustment shape")
        operation = {"Reduce": "reduce", "Set": "set"}.get(
            cooldown_adjustment.functionType
        )
        if operation is None:
            raise ValueError(f"{path}: unsupported skill cooldown operation")
        basis = (
            "baseDurationRatio"
            if cooldown_adjustment.isPercentage
            else "absoluteSeconds"
        )
        native_skill_type = {
            "ComboSkill": "comboSkill",
            "UltimateSkill": "ultimate",
        }.get(cooldown_adjustment.skillTypeMask)
        if cooldown_adjustment.useSkillType and native_skill_type is not None:
            # 原生 useSkillType 分支只读取类型掩码并遍历全部匹配技能；配置里即使
            # 同时保存 skillId（莱万汀样本），该字段也不会参与筛选。
            skill_selector = (
                "{ kind: 'type', skillType: "
                f"{ts_inline_literal(native_skill_type)} }}"
            )
        elif (
            not cooldown_adjustment.useSkillType
            and cooldown_adjustment.skillTypeMask == "None"
            and cooldown_adjustment.skillId
        ):
            skill_selector = (
                "{ kind: 'id', skillId: "
                f"{ts_inline_literal(cooldown_adjustment.skillId)} }}"
            )
        else:
            raise ValueError(f"{path}: unsupported skill cooldown selector")
        target = (
            "caster"
            if cooldown_adjustment.target.targetSource == "Source"
            else buff_owner_target
            if current_buff_environment and buff_owner_target in {"caster", "enemy"}
            else "caster"
        )
        return "\n".join(
            [
                "step('adjustSkillCooldown', {",
                f"  target: {ts_inline_literal(target)},",
                f"  skill: {skill_selector},",
                f"  operation: '{operation}',",
                f"  basis: '{basis}',",
                f"  value: {compile_condition_operand(cooldown_adjustment.value, f'{path}.value')},",
                "})",
            ]
        )
    timeline_jump_destination_frame = getattr(
        action, "timelineJumpDestinationFrame", None
    )
    if timeline_jump_destination_frame is not None:
        return (
            "step('jumpTimeline', { destinationFrame: "
            f"{timeline_jump_destination_frame} }})"
        )
    buff_ignite = getattr(action, "buffIgnite", None)
    if buff_ignite is not None:
        if buff_ignite.successTargetContextKey:
            raise ValueError(f"{path}: IgniteAction success target context is unsupported")
        if (
            buff_ignite.source.validatorTypes
            or buff_ignite.source.postProcessorTypes
            or buff_ignite.target.validatorTypes
            or buff_ignite.target.postProcessorTypes
        ):
            raise ValueError(f"{path}: IgniteAction selectors are unsupported")
        source_target = (
            "currentBuffSource"
            if current_buff_environment and buff_ignite.source.targetSource == "Target"
            and not buff_ignite.source.targetGroupKey
            else resolve_fixed_combat_target(
                buff_ignite.source.targetSource,
                buff_ignite.source.targetGroupKey,
                action=context_action,
                target_group_writes=target_group_writes,
                root_skill_context=root_skill_context,
                input_target=input_target,
            )
        )
        ignite_target = (
            "buffOwner"
            if current_buff_environment and buff_owner_target is not None
            and buff_ignite.target.targetSource == "Owner"
            else resolve_fixed_combat_target(
                buff_ignite.target.targetSource,
                buff_ignite.target.targetGroupKey,
                action=context_action,
                target_group_writes=target_group_writes,
                root_skill_context=root_skill_context,
                input_target=input_target,
            )
        )
        if source_target is None or ignite_target is None:
            raise ValueError(f"{path}: IgniteAction target identity is unresolved")
        return "\n".join(
            [
                "step('igniteBuffs', {",
                f"  target: {ts_inline_literal(ignite_target)},",
                f"  source: {ts_inline_literal(source_target)},",
                f"  igniteType: {ts_inline_literal(buff_ignite.igniteType)},",
                "})",
            ]
        )
    heal = getattr(action, "heal", None)
    if heal is not None:
        target_role: str | None = None
        if (
            current_buff_environment
            and buff_owner_target is not None
            and heal.target.targetSource == "Owner"
            and heal.target.finderType is None
            and not heal.target.validatorTypes
            and not heal.target.postProcessorTypes
        ):
            # TargetResolution.GetTargetsView 的 Owner 分支直接取 ActionOwner，
            # 不读取 TargetGroupKey；Buff Owner 是每个实例的实际宿主。
            target_role = "buffOwner"
        elif (
            current_buff_environment
            and heal.target.targetSource == "Source"
            and not heal.target.targetGroupKey
            and heal.target.finderType is None
            and not heal.target.validatorTypes
            and not heal.target.postProcessorTypes
        ):
            # Buff 生命周期 Context 会携带实例真实 sourceId；不能把 Source
            # 静态折叠成宿主或根技能施法者。
            target_role = "buffSource"
        elif (
            heal.target.targetSource == "MainCharacter"
            and not heal.target.targetGroupKey
            and heal.target.finderType is None
            and not heal.target.validatorTypes
            and not heal.target.postProcessorTypes
        ):
            target_role = "controlledOperator"
        elif (
            heal.target.targetSource in {"InstantSearch", "Source"}
            and heal.target.finderType == "CharacterTeamFinder"
            and heal.target.validatorTypes == ("MainCharacterValidator",)
            and not heal.target.postProcessorTypes
        ):
            target_role = "controlledOperator"
        elif heal.target.targetSource == "Context" and heal.target.targetGroupKey:
            write = resolve_latest_target_group_write_at(
                read_frame=getattr(context_action, "startFrame", 0),
                read_action_index=(
                    getattr(action, "serverActionIndex", None)
                    if getattr(action, "serverActionIndex", None) is not None
                    else getattr(
                        context_action,
                        "actionIndex",
                        getattr(action, "actionIndex", 0),
                    )
                ),
                read_action_path=(
                    getattr(action, "actionPath", ())
                    or getattr(context_action, "actionPath", ())
                ),
                target_group_key=heal.target.targetGroupKey,
                writes=target_group_writes,
            )
            target_role = None if write is None else write.characterTeamSelectionRole
        elif (
            heal.target.targetSource == "Target"
            and not heal.target.targetGroupKey
            and heal.target.finderType is None
            and not heal.target.validatorTypes
            and not heal.target.postProcessorTypes
            and input_target == "caster"
        ):
            target_role = "caster"
        if target_role is None:
            raise ValueError(f"{path}: HealAction target identity is unresolved")
        if heal.attribute is None:
            calculation_lines = [
                f"  amount: {compile_condition_operand(heal.addition, f'{path}.amount')},"
            ]
        else:
            attribute = {
                "Str": "strength",
                "Agi": "agility",
                "Wisd": "intellect",
                "Will": "will",
                "MaxHp": "maxHealth",
            }[heal.attribute]
            calculation_lines = [
                f"  attribute: {ts_inline_literal(attribute)},",
                f"  multiplier: {compile_condition_operand(heal.multiplier, f'{path}.multiplier')},",
                f"  addition: {compile_condition_operand(heal.addition, f'{path}.addition')},",
            ]
        return "\n".join(
            [
                "step('heal', {",
                f"  target: {ts_inline_literal(target_role)},",
                f"  alwaysNext: {ts_inline_literal(heal.alwaysNext)},",
                *calculation_lines,
                f"  tagIds: {ts_inline_literal(heal.tagIds)},",
                "})",
            ]
        )
    legacy_finish = getattr(action, "legacyBuffFinish", None)
    if legacy_finish is not None:
        finish_target = None
        if (
            current_buff_environment
            and legacy_finish.target.targetSource == "Owner"
            and not legacy_finish.target.targetGroupKey
        ):
            finish_target = "buffOwner"
        elif (
            current_buff_environment
            and legacy_finish.target.targetSource == "Source"
            and not legacy_finish.target.targetGroupKey
        ):
            finish_target = "buffSource"
        elif (
            current_buff_environment
            and legacy_finish.target.targetSource == "Target"
            and not legacy_finish.target.targetGroupKey
        ):
            finish_target = (
                "eventTarget"
                if buff_ability_damage_event
                else "buffSource"
                if input_target == "caster"
                else "buffOwner"
            )
        elif (
            legacy_finish.target.targetSource == "Context"
        ):
            finish_target = target_group_write_buff_application_target(
                resolve_latest_target_group_write_at(
                    read_frame=0,
                    read_action_index=action.actionIndex,
                    read_action_path=action.actionPath,
                    target_group_key=legacy_finish.target.targetGroupKey,
                    writes=target_group_writes,
                )
            )
        else:
            finish_target = target_reference_party_target(legacy_finish.target)
            if finish_target is None:
                finish_target = resolve_fixed_combat_target(
                    legacy_finish.target.targetSource,
                    legacy_finish.target.targetGroupKey,
                    action=context_action,
                    target_group_writes=target_group_writes,
                    root_skill_context=root_skill_context,
                    input_target=input_target,
                )
        if (
            finish_target is None
            or (
                finish_target not in {"party", "partyExceptCaster"}
                and (
                    legacy_finish.target.validatorTypes
                    or legacy_finish.target.postProcessorTypes
                )
            )
            or legacy_finish.limitSource
            or legacy_finish.buffSource.targetSource != "Source"
            or legacy_finish.buffSource.targetGroupKey
            or legacy_finish.finishSource.targetSource != "Source"
            or legacy_finish.finishSource.targetGroupKey
            or not legacy_finish.buffIds
        ):
            raise ValueError(f"{path}: unsupported legacy Buff finish shape")
        reason = "early" if legacy_finish.isFinishedEarly else "other"
        count_line = (
            []
            if legacy_finish.finishAll
            else [
                f"  count: {compile_condition_operand(legacy_finish.finishLayerCount, f'{path}.finishLayerCnt')},"
            ]
        )
        return "\n".join(
            [
                "step('finishBuffsById', {",
                f"  target: {ts_inline_literal(finish_target)},",
                f"  buffIds: {ts_inline_literal(legacy_finish.buffIds)},",
                f"  reason: {ts_inline_literal(reason)},",
                *count_line,
                "})",
            ]
        )
    if getattr(action, "buffApplication", None) is not None:
        buff_application = action.buffApplication
        if all(
            buff.buffId in ignored_buff_ids
            for buff in buff_application.buffs
        ):
            return "sequence()"
        context_application_target = None
        ability_entity_collection_key = None
        ability_entity_collection_prelude = None
        if buff_application.targetSource == "Context":
            write = resolve_latest_target_group_write_at(
                read_frame=getattr(context_action, "startFrame", 0),
                read_action_index=(
                    getattr(action, "serverActionIndex", None)
                    if getattr(action, "serverActionIndex", None) is not None
                    else getattr(
                        context_action,
                        "actionIndex",
                        getattr(action, "actionIndex", 0),
                    )
                ),
                read_action_path=(
                    getattr(action, "actionPath", ())
                    or getattr(context_action, "actionPath", ())
                ),
                target_group_key=buff_application.targetGroupKey,
                writes=target_group_writes,
            )
            context_application_target = target_group_write_buff_application_target(
                write, target_group_writes
            )
            if (
                context_application_target is None
                and guarded_context_group_is_unique_enemy(
                    action,
                    context_action,
                    buff_application.targetGroupKey,
                    write,
                )
            ):
                context_application_target = "enemy"
            if (
                context_application_target is None
                and (
                    buff_application.targetGroupKey
                    in singleton_ability_entity_context_keys
                    or (
                        write is not None
                        and target_group_write_ability_entity_collection_identity(
                            write, target_group_writes
                        )
                        is not None
                    )
                )
            ):
                context_application_target = "currentAbilityEntity"
                ability_entity_collection_key = buff_application.targetGroupKey
                if write is not None and write.producerType == "PickTargetAction":
                    ability_entity_collection_prelude = compile_pick_target_group_write(
                        write, f"{path}.targetGroupWrite"
                    )
        compiled_buff = compile_conditional_buff_application(
            buff_application,
            path,
            ignored_buff_ids,
            root_skill_context=root_skill_context,
            context_application_target=context_application_target,
            input_target=input_target,
            buff_definitions=buff_definitions,
            invoked_child_context=invoked_child_context,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            current_ability_entity_target=ability_entity_current_target,
            current_ability_entity_owner=ability_entity_current_target,
            current_ability_entity_id=current_ability_entity_id,
            current_event_target=buff_ability_damage_event,
            damage_tags=damage_tags,
        )
        if ability_entity_collection_key is None or compiled_buff == "sequence()":
            return compiled_buff
        buff_lines = indent_source(compiled_buff, 4)
        buff_lines[-1] += ","
        for_each_lines = [
            "forEachContextTarget(",
            f"  {ts_inline_literal(ability_entity_collection_key)},",
            "  sequence(",
            *buff_lines,
            "  ),",
            ")",
        ]
        if ability_entity_collection_prelude is None:
            return "\n".join(for_each_lines)
        return "\n".join(
            [
                "sequence(",
                f"  {ability_entity_collection_prelude},",
                *[f"  {line}" for line in for_each_lines[:-1]],
                f"  {for_each_lines[-1]},",
                ")",
            ]
        )
    if getattr(action, "timedMarkerApplication", None) is not None:
        marker = action.timedMarkerApplication
        context_key = (
            marker.targetGroupKey
            if marker.targetSource == "Context"
            and marker.targetGroupKey in singleton_ability_entity_context_keys
            else None
        )
        compiled_marker = compile_timed_marker_application(
            (
                replace(marker, targetSource="Owner", targetGroupKey="")
                if context_key is not None
                else marker
            ),
            path,
            root_skill_context=root_skill_context,
            input_target=input_target,
            ability_entity_current_target=(
                ability_entity_current_target or context_key is not None
            ),
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
        )
        if context_key is None:
            return compiled_marker
        marker_lines = indent_source(compiled_marker, 4)
        marker_lines[-1] += ","
        return "\n".join(
            [
                "forEachContextTarget(",
                f"  {ts_inline_literal(context_key)},",
                "  sequence(",
                *marker_lines,
                "  ),",
                ")",
            ]
        )
    if getattr(action, "globalCooldownApplication", None) is not None:
        return compile_global_cooldown_application(
            action.globalCooldownApplication,
            path,
            root_skill_context=root_skill_context,
            current_buff_environment=current_buff_environment,
            buff_owner_target=buff_owner_target,
        )
    if getattr(action, "storeCurrentTimelineFrame", None) is not None:
        return (
            "step('storeCurrentTimelineFrame', { outputKey: "
            f"{ts_inline_literal(action.storeCurrentTimelineFrame.outputKey)} }})"
        )
    if getattr(action, "blackboardMutation", None) is not None:
        return compile_blackboard_mutation(action.blackboardMutation, path)
    if getattr(action, "blackboardCalculation", None) is not None:
        return compile_blackboard_calculation(action.blackboardCalculation, path)
    store_attribute_value = getattr(action, "storeAttributeValue", None)
    if store_attribute_value is not None:
        if (
            store_attribute_value.targetSource not in {"Source", "Owner"}
            or store_attribute_value.targetGroupKey
            or store_attribute_value.attributeKind != "specific"
            or store_attribute_value.attributeKey is None
        ):
            raise ValueError(f"{path}: unsupported StoreAttributeValue target or selector")
        return "\n".join(
            [
                "step('storeSourceAttributeValue', {",
                f"  attribute: {{ kind: 'specific', key: {ts_inline_literal(store_attribute_value.attributeKey)} }},",
                f"  stage: {ts_inline_literal(store_attribute_value.stage)},",
                f"  useFloor: {ts_inline_literal(store_attribute_value.useFloor)},",
                f"  divisor: {compile_condition_operand(store_attribute_value.divisor, f'{path}.divisor')},",
                f"  multiplier: {compile_condition_operand(store_attribute_value.multiplier, f'{path}.multiplier')},",
                f"  base: {compile_condition_operand(store_attribute_value.base, f'{path}.base')},",
                f"  targetKey: {ts_inline_literal(store_attribute_value.outputKey)},",
                "})",
            ]
        )
    if getattr(action, "resourceGain", None) is not None:
        return compile_resource_gain(action.resourceGain, path)
    infliction = getattr(action, "infliction", None)
    if infliction is not None:
        return (
            "step('applyElementalInfliction', { element: "
            f"{ts_inline_literal(infliction.element)}, isExtra: "
            f"{ts_inline_literal(infliction.isExtra)} }})"
        )
    physical_infliction = getattr(action, "physicalInfliction", None)
    if physical_infliction is not None:
        return compile_physical_infliction(
            physical_infliction,
            path,
            root_skill_context=root_skill_context,
            input_target=input_target,
            buff_definitions=buff_definitions,
            context_action=context_action,
            target_group_writes=target_group_writes,
        )
    knock_down_output = getattr(action, "knockDownOutput", None)
    if knock_down_output is not None:
        context_target_is_enemy = (
            root_skill_context
            and input_target == "enemy"
            and knock_down_output.target.targetSource == "Context"
            and knock_down_output.target.targetGroupKey == "smart_target"
        )
        if knock_down_output.target.targetSource == "Context":
            write = resolve_latest_target_group_write_at(
                read_frame=getattr(context_action, "startFrame", 0),
                read_action_index=(
                    getattr(action, "serverActionIndex", None)
                    if getattr(action, "serverActionIndex", None) is not None
                    else getattr(
                        context_action,
                        "actionIndex",
                        getattr(action, "actionIndex", 0),
                    )
                ),
                read_action_path=(
                    getattr(action, "actionPath", ())
                    or getattr(context_action, "actionPath", ())
                ),
                target_group_key=knock_down_output.target.targetGroupKey,
                writes=target_group_writes,
            )
            context_target_is_enemy = context_target_is_enemy or (
                write is not None
                and target_group_write_guarantees_single_enemy(
                    write, target_group_writes
                )
            ) or guarded_context_group_is_unique_enemy(
                action,
                context_action,
                knock_down_output.target.targetGroupKey,
                write,
            )
        return compile_knock_down_output(
            knock_down_output,
            path,
            context_target_is_enemy=context_target_is_enemy,
            root_skill_context=root_skill_context,
        )
    raise ValueError(f"{path}: unsupported conditional leaf {action.actionType!r}")
