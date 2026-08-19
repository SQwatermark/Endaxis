"""条件分支叶子动作到 Next DSL 步骤的语义编译。"""

from __future__ import annotations

from dataclasses import dataclass
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
)
from source_utils import indent_source, ts_inline_literal


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
    compile_resource_gain: Callable[..., Any]
    compile_time_dilation: Callable[..., Any]
    compile_timed_marker_application: Callable[..., Any]
    contains_equivalent_projectile_projection: Callable[..., Any]
    encode_damage_step_key: Callable[..., Any]
    resolve_fixed_combat_target: Callable[..., Any]
    resolve_latest_target_group_write_at: Callable[..., Any]
    target_group_write_ability_entity_collection_identity: Callable[..., Any]
    target_group_write_buff_application_target: Callable[..., Any]
    target_group_write_guarantees_single_enemy: Callable[..., Any]


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
    compile_resource_gain = services.compile_resource_gain
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
            aura for aura in aura_actions if aura.actionPath == action.actionPath
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
        )
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
        if ability_entity_spawn in projected_ability_entity_spawns:
            return "sequence()"
        matches = tuple(
            source
            for action_path, source in compiled_ability_entity_spawns
            if action_path == action.actionPath
        )
        if len(matches) == 1:
            return matches[0]
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
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
        )
    if getattr(action, "buffFinish", None) is not None:
        return compile_buff_finish(
            action.buffFinish,
            path,
            action=context_action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
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
        )
    cooldown_adjustment = getattr(action, "skillCooldownAdjustment", None)
    if cooldown_adjustment is not None:
        if (
            cooldown_adjustment.target.targetSource
            not in ({"Owner", "Source"} if root_skill_context else {"Owner"})
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
        if operation == "reduce" and not cooldown_adjustment.isPercentage:
            raise ValueError(f"{path}: absolute cooldown reduction is unsupported")
        basis = (
            "baseDurationRatio"
            if cooldown_adjustment.isPercentage
            else "absoluteSeconds"
        )
        if (
            cooldown_adjustment.useSkillType
            and cooldown_adjustment.skillTypeMask == "ComboSkill"
            and not cooldown_adjustment.skillId
        ):
            skill_selector = "{ kind: 'type', skillType: 'comboSkill' }"
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
        return "\n".join(
            [
                "step('adjustSkillCooldown', {",
                "  target: 'caster',",
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
            buff_owner_target
            if current_buff_environment and buff_owner_target is not None
            and buff_ignite.target.targetSource == "Owner"
            and not buff_ignite.target.targetGroupKey
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
                read_frame=context_action.startFrame if context_action is not None else 0,
                read_action_index=(
                    getattr(action, "serverActionIndex", None)
                    if getattr(action, "serverActionIndex", None) is not None
                    else context_action.actionIndex if context_action is not None else action.actionIndex
                ),
                read_action_path=(
                    getattr(action, "actionPath", ())
                    or (context_action.actionPath if context_action is not None else ())
                ),
                target_group_key=heal.target.targetGroupKey,
                writes=target_group_writes,
            )
            target_role = None if write is None else write.characterTeamSelectionRole
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
            and buff_owner_target is not None
            and legacy_finish.target.targetSource in {"Source", "Owner"}
            and not legacy_finish.target.targetGroupKey
        ):
            finish_target = buff_owner_target
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
            or legacy_finish.target.validatorTypes
            or legacy_finish.target.postProcessorTypes
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
        context_application_target = None
        ability_entity_collection_key = None
        if buff_application.targetSource == "Context":
            write = resolve_latest_target_group_write_at(
                read_frame=context_action.startFrame if context_action is not None else 0,
                read_action_index=(
                    getattr(action, "serverActionIndex", None)
                    if getattr(action, "serverActionIndex", None) is not None
                    else context_action.actionIndex if context_action is not None else action.actionIndex
                ),
                read_action_path=(
                    getattr(action, "actionPath", ())
                    or (context_action.actionPath if context_action is not None else ())
                ),
                target_group_key=buff_application.targetGroupKey,
                writes=target_group_writes,
            )
            context_application_target = target_group_write_buff_application_target(write)
            if (
                context_application_target is None
                and (
                    buff_application.targetGroupKey
                    in singleton_ability_entity_context_keys
                    or (
                        write is not None
                        and target_group_write_ability_entity_collection_identity(write)
                        is not None
                    )
                )
            ):
                context_application_target = "currentAbilityEntity"
                ability_entity_collection_key = buff_application.targetGroupKey
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
        )
        if ability_entity_collection_key is None or compiled_buff == "sequence()":
            return compiled_buff
        buff_lines = indent_source(compiled_buff, 4)
        buff_lines[-1] += ","
        return "\n".join(
            [
                "forEachContextTarget(",
                f"  {ts_inline_literal(ability_entity_collection_key)},",
                "  sequence(",
                *buff_lines,
                "  ),",
                ")",
            ]
        )
    if getattr(action, "timedMarkerApplication", None) is not None:
        return compile_timed_marker_application(
            action.timedMarkerApplication,
            path,
            root_skill_context=root_skill_context,
            input_target=input_target,
            ability_entity_current_target=ability_entity_current_target,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
        )
    if getattr(action, "globalCooldownApplication", None) is not None:
        return compile_global_cooldown_application(
            action.globalCooldownApplication,
            path,
            root_skill_context=root_skill_context,
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
