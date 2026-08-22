"""能力实体子技能到内联 SkillDefinition 的编译。"""

from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Any, Callable, Literal

from compiler_ir import (
    EMPTY_SEQUENCE as COMPILED_EMPTY_SEQUENCE,
    render_sequence_children as render_compiled_sequence_children,
)
from source_models import (
    AbilityEntityHitSource,
    BuffDefinitionSource,
    ResolvedDamageHitSource,
    SkillSource,
)
from source_utils import require_list, ts_inline_literal
from resolved_sequence_compiler import compile_knock_down_output


@dataclass(frozen=True)
class AbilityEntityChildServices:
    """由入口注入的调度证明与步骤编译服务。"""

    compile_conditional_action_ir: Callable[..., Any]
    ability_entity_child_timeline_can_compile: Callable[..., Any]
    compile_aura_action: Callable[..., Any]
    compile_aura_exit_action: Callable[..., Any]
    compile_blackboard_calculation: Callable[..., Any]
    compile_blackboard_mutation: Callable[..., Any]
    compile_buff_application: Callable[..., Any]
    compile_buff_finish: Callable[..., Any]
    compile_combat_condition_group: Callable[..., Any]
    compile_infliction: Callable[..., Any]
    compile_resolved_damage_steps: Callable[..., Any]
    compile_resource_gain: Callable[..., Any]
    compile_skill_target_group_ability_entity_query: Callable[..., Any]
    filter_once_resource_gains: Callable[..., Any]
    load_ability_entity_template_evidence: Callable[..., Any]
    native_condition_sequence_order: Callable[..., Any]
    native_sequence_order: Callable[..., Any]
    resolve_latest_target_group_write: Callable[..., Any]
    resource_gain_can_change_value: Callable[..., Any]
    target_group_write_ability_entity_collection_identity: Callable[..., Any]
    timeline_jump_outer_condition: Callable[..., Any]


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
    services: AbilityEntityChildServices,
) -> str:
    """Render a proven child graph in entity-local frames without a second action protocol."""
    _compile_conditional_action_ir = services.compile_conditional_action_ir
    ability_entity_child_timeline_can_compile = services.ability_entity_child_timeline_can_compile
    compile_aura_action = services.compile_aura_action
    compile_aura_exit_action = services.compile_aura_exit_action
    compile_blackboard_calculation = services.compile_blackboard_calculation
    compile_blackboard_mutation = services.compile_blackboard_mutation
    compile_buff_application = services.compile_buff_application
    compile_buff_finish = services.compile_buff_finish
    compile_combat_condition_group = services.compile_combat_condition_group
    compile_infliction = services.compile_infliction
    compile_resolved_damage_steps = services.compile_resolved_damage_steps
    compile_resource_gain = services.compile_resource_gain
    compile_skill_target_group_ability_entity_query = (
        services.compile_skill_target_group_ability_entity_query
    )
    filter_once_resource_gains = services.filter_once_resource_gains
    load_ability_entity_template_evidence = services.load_ability_entity_template_evidence
    native_condition_sequence_order = services.native_condition_sequence_order
    native_sequence_order = services.native_sequence_order
    resolve_latest_target_group_write = services.resolve_latest_target_group_write
    resource_gain_can_change_value = services.resource_gain_can_change_value
    target_group_write_ability_entity_collection_identity = (
        services.target_group_write_ability_entity_collection_identity
    )
    timeline_jump_outer_condition = services.timeline_jump_outer_condition
    child_step_key_prefix = (
        f"{getattr(hit, 'abilityEntityId', 'abilityEntity')}:{hit.skillId}"
    )
    if getattr(hit, "inheritsSourceBlackboard", False):
        runtime_blackboard_keys = frozenset(
            (*runtime_blackboard_keys, *(item.key for item in hit.declaredBlackboard))
        )
    if not ability_entity_child_timeline_can_compile(
        hit,
        input_target=input_target,
        ignored_auxiliary_classifications=ignored_auxiliary_classifications,
        ignored_buff_ids=ignored_buff_ids,
        unmodeled_buff_ids=unmodeled_buff_ids,
        buff_definitions=buff_definitions,
    ):
        raise ValueError(f"{skill.key}.{hit.skillId}: child timeline is outside the strict subset")

    prefix = hit.actionOrder
    child_damage_hits = tuple(
        damage
        for damage in all_damage_hits
        if len(damage.actionOrder) > len(prefix)
        and damage.actionOrder[: len(prefix)] == prefix
        and hit.skillId in damage.sourcePath
    )
    compiled: list[tuple[int, tuple[int, ...], tuple[int, ...], list[str]]] = []
    for damage in child_damage_hits:
        index = all_damage_hits.index(damage)
        local_frame = damage.frame - hit.spawnFrame
        if local_frame < 0:
            raise ValueError(f"{skill.key}.{hit.skillId}: child damage precedes its spawn")
        compiled.append(
            (
                local_frame,
                damage.sequenceOrder,
                damage.actionOrder,
                compile_resolved_damage_steps(
                    skill,
                    config,
                    replace(
                        damage,
                        frame=local_frame,
                        sourcePath=damage.sourcePath[damage.sourcePath.index(hit.skillId) :],
                        actionOrder=damage.actionOrder[len(hit.actionOrder) :],
                    ),
                    index,
                    index == len(all_damage_hits) - 1,
                    runtime_blackboard_keys,
                    step_key_prefix=child_step_key_prefix,
                ),
            )
        )

    for infliction in hit.inflictions:
        compiled.append(
            (
                infliction.startFrame,
                native_sequence_order(infliction, hit.actionOrder, hit.skillId),
                (*hit.actionOrder, infliction.actionIndex),
                compile_infliction(infliction).splitlines(),
            )
        )

    for action in getattr(hit, "knockDownOutputs", ()):
        compiled.append(
            (
                action.startFrame,
                native_sequence_order(action, hit.actionOrder, hit.skillId),
                (*hit.actionOrder, action.actionIndex),
                [
                    compile_knock_down_output(
                        action, f"{skill.key}.{hit.skillId}.knockDownOutput"
                    )
                ],
            )
        )

    for calculation in hit.blackboardCalculations:
        compiled.append(
            (
                calculation.startFrame,
                native_sequence_order(calculation, hit.actionOrder, hit.skillId),
                (*hit.actionOrder, calculation.actionIndex),
                compile_blackboard_calculation(
                    calculation,
                    f"{skill.key}.{hit.skillId}.blackboardCalculation",
                ).splitlines(),
            )
        )

    for mutation in hit.blackboardMutations:
        compiled.append(
            (
                mutation.startFrame,
                native_sequence_order(mutation, hit.actionOrder, hit.skillId),
                (*hit.actionOrder, mutation.actionIndex),
                compile_blackboard_mutation(
                    mutation,
                    f"{skill.key}.{hit.skillId}.blackboardMutation",
                ).splitlines(),
            )
        )

    for finish in hit.buffFinishes:
        compiled.append(
            (
                finish.startFrame,
                native_sequence_order(finish, hit.actionOrder, hit.skillId),
                (*hit.actionOrder, finish.actionIndex),
                compile_buff_finish(
                    finish,
                    f"{skill.key}.{hit.skillId}.buffFinish",
                    input_target=input_target,
                    buff_owner_target="currentAbilityEntity",
                ).splitlines(),
            )
        )

    resource_gains = sorted(
        hit.resourceGains, key=lambda item: (item.startFrame, item.actionIndex)
    )
    for gain in filter_once_resource_gains(resource_gains):
        if not resource_gain_can_change_value(gain, f"{hit.skillId}.resourceGain"):
            continue
        compiled.append(
            (
                gain.startFrame,
                native_sequence_order(gain, hit.actionOrder, hit.skillId),
                (*hit.actionOrder, gain.actionIndex),
                compile_resource_gain(
                    gain,
                    f"{skill.key}.{hit.skillId}.resourceGain",
                ).splitlines(),
            )
        )

    for index, action in enumerate(hit.auxiliaryActions):
        if (
            action.classification in ignored_auxiliary_classifications
            or action.sourceId in ignored_buff_ids
            or action.sourceId in unmodeled_buff_ids
        ):
            continue
        if action.classification == "skillCostUltimateEnergyGain":
            source = "step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })"
        else:
            source = compile_buff_application(
                action,
                f"{skill.key}.{hit.skillId}.auxiliaryActions[{index}]",
                root_skill_context=False,
                current_ability_entity_owner=True,
                input_target=input_target,
                buff_definitions=buff_definitions,
                invoked_child_context=(skill, config),
                ignored_buff_ids=ignored_buff_ids | unmodeled_buff_ids,
                damage_tags=tuple(
                    require_list(config.get("tags", []), f"{skill.key}.compile.tags")
                ),
            )
        compiled.append(
            (
                action.startFrame,
                native_sequence_order(action, hit.actionOrder, hit.skillId),
                (*hit.actionOrder, action.actionIndex),
                source.splitlines(),
            )
        )

    emitted_finish_frames: set[int] = set()
    for finish in sorted(
        getattr(hit, "explicitFinishes", ()),
        key=lambda item: (item.startFrame, item.sequenceIndex, item.actionIndex),
    ):
        # 结束宿主是终止性操作；同一局部帧的后续等价 Owner 结束在原生中已无活动实体可处理。
        if finish.startFrame in emitted_finish_frames:
            continue
        emitted_finish_frames.add(finish.startFrame)
        compiled.append(
            (
                finish.startFrame,
                native_sequence_order(finish, hit.actionOrder, hit.skillId),
                (*hit.actionOrder, finish.actionIndex),
                ["step('finishCurrentAbilityEntity', {})"],
            )
        )

    scoped_end_frames: dict[tuple[int, tuple[int, ...]], int] = {}
    for aura in hit.auraActions:
        if len(aura.actionPath) != 4:
            continue
        if aura.startFrame is None or aura.endFrame is None:
            raise ValueError(f"{skill.key}.{hit.skillId}: child Aura has no timeline interval")
        sequence_order = native_condition_sequence_order(
            aura.actionPath,
            hit.actionOrder,
            hit.skillId,
            aura.actionIndex,
        )
        group_key = (aura.startFrame, sequence_order)
        existing_end = scoped_end_frames.get(group_key)
        if existing_end is not None and existing_end != aura.endFrame:
            raise ValueError(
                f"{skill.key}.{hit.skillId}: child Aura sequence has conflicting end frames"
            )
        scoped_end_frames[group_key] = aura.endFrame
        compiled.append(
            (
                aura.startFrame,
                sequence_order,
                (*hit.actionOrder, aura.actionIndex),
                compile_aura_action(
                    aura,
                    f"{skill.key}.{hit.skillId}.auraAction",
                    buff_definitions=buff_definitions,
                    invoked_child_context=(skill, config),
                ).splitlines(),
            )
        )
        exit_source = compile_aura_exit_action(
            aura,
            f"{skill.key}.{hit.skillId}.auraAction",
            buff_definitions=buff_definitions,
            invoked_child_context=(skill, config),
            ignored_buff_ids=ignored_buff_ids | unmodeled_buff_ids,
        )
        if exit_source is not None:
            compiled.append(
                (
                    aura.endFrame,
                    sequence_order,
                    (*hit.actionOrder, aura.actionIndex),
                    exit_source.splitlines(),
                )
            )

    child_damage_frames = tuple(damage.frame - hit.spawnFrame for damage in child_damage_hits)
    projected_interval_frames = {
        interval.tickFrames for interval in getattr(hit, "intervalDamageHits", ())
    }
    ability_entity_templates: dict[str, dict[str, Any]] | None = None
    for condition in hit.conditionalActions:
        if getattr(condition, "executionFrames", ()) in projected_interval_frames:
            continue
        frames = getattr(condition, "executionFrames", ()) or (condition.startFrame,)
        for frame in frames:
            ability_entity_query_steps: list[str] = []
            queried_context_keys: set[str] = set()
            for condition_index, condition_source in enumerate(condition.conditions):
                entity_count = getattr(condition_source, "entityCount", None)
                if (
                    condition_source.sourceType != "CheckEntityNum"
                    or entity_count is None
                    or entity_count.targetSource != "Context"
                    or not entity_count.targetGroupKey
                ):
                    continue
                write = resolve_latest_target_group_write(
                    condition,
                    entity_count.targetGroupKey,
                    hit.localTargetGroupWrites,
                )
                if (
                    write is None
                    or target_group_write_ability_entity_collection_identity(write)
                    is None
                ):
                    continue
                if ability_entity_templates is None:
                    ability_entity_templates = load_ability_entity_template_evidence()
                ability_entity_query_steps.append(
                    compile_skill_target_group_ability_entity_query(
                        write,
                        ability_entity_templates,
                        f"{skill.key}.{hit.skillId}.conditionalAction."
                        f"conditions[{condition_index}].targetGroupWrite",
                        save_count_to_blackboard_key=(entity_count.storeKey or None),
                        allow_action_source_owner=True,
                    )
                )
                queried_context_keys.add(entity_count.targetGroupKey)
            for_each_context_key = getattr(condition, "contextKey", None)
            if (
                isinstance(for_each_context_key, str)
                and for_each_context_key
                and for_each_context_key not in queried_context_keys
            ):
                write = resolve_latest_target_group_write(
                    condition,
                    for_each_context_key,
                    hit.localTargetGroupWrites,
                )
                if (
                    write is not None
                    and target_group_write_ability_entity_collection_identity(write)
                    is not None
                ):
                    if ability_entity_templates is None:
                        ability_entity_templates = load_ability_entity_template_evidence()
                    ability_entity_query_steps.append(
                        compile_skill_target_group_ability_entity_query(
                            write,
                            ability_entity_templates,
                            f"{skill.key}.{hit.skillId}.conditionalAction."
                            "forEachTargetGroupWrite",
                        )
                    )
            source = _compile_conditional_action_ir(
                condition,
                f"{skill.key}.{hit.skillId}.conditionalAction",
                damage_tags=tuple(
                    require_list(config.get("tags", []), f"{skill.key}.compile.tags")
                ),
                runtime_blackboard_keys=runtime_blackboard_keys,
                target_group_writes=hit.localTargetGroupWrites,
                root_skill_context=False,
                input_target=input_target,
                ability_entity_current_target=True,
                current_ability_entity_id=hit.abilityEntityId,
                skill_has_output_damage=any(
                    damage_frame < frame for damage_frame in child_damage_frames
                ),
                step_key_prefix=child_step_key_prefix,
                compiled_ability_entity_spawns=compiled_ability_entity_spawns,
                compiled_projectile_launches=compiled_projectile_launches,
                aura_actions=hit.auraActions,
                invoked_child_context=(skill, config),
                ignored_buff_ids=ignored_buff_ids | unmodeled_buff_ids,
                buff_definitions=buff_definitions,
            )
            if source == COMPILED_EMPTY_SEQUENCE:
                continue
            sequence_order = native_condition_sequence_order(
                condition.actionPath,
                hit.actionOrder,
                hit.skillId,
                condition.actionIndex,
            )
            if any(
                aura.actionPath[: len(condition.actionPath)] == condition.actionPath
                and len(aura.actionPath) > len(condition.actionPath)
                for aura in hit.auraActions
            ):
                scoped_end_frames[(frame, sequence_order)] = condition.endFrame
            compiled.append(
                (
                    frame,
                    sequence_order,
                    (*hit.actionOrder, condition.actionIndex),
                    [
                        line
                        for compiled_source in (
                            *ability_entity_query_steps,
                            *render_compiled_sequence_children(source),
                        )
                        for line in compiled_source.splitlines()
                    ],
                )
            )

    grouped: dict[tuple[int, tuple[int, ...]], list[tuple[tuple[int, ...], list[str]]]] = {}
    for frame, sequence_order, action_order, step_lines in compiled:
        grouped.setdefault((frame, sequence_order), []).append((action_order, step_lines))

    ordinary_render_groups: list[
        tuple[int, tuple[int, ...], int | None, list[tuple[tuple[int, ...], list[str]]]]
    ] = [
        (
            frame,
            sequence_order,
            scoped_end_frames.get((frame, sequence_order)),
            actions,
        )
        for (frame, sequence_order), actions in grouped.items()
    ]
    render_groups: list[
        tuple[int, tuple[int, ...], int | None, list[tuple[tuple[int, ...], list[str]]]]
    ] = []
    for jump in getattr(hit, "timelineJumps", ()):
        outer_match = timeline_jump_outer_condition(hit, jump)
        if outer_match is None:
            condition = compile_combat_condition_group(
                jump.directConditions,
                f"{skill.key}.{hit.skillId}.timelineJump.condition",
                root_skill_context=False,
                input_target=input_target,
                ability_entity_current_target=True,
                negated=jump.directConditionNegated,
                any_groups=jump.directAnyConditions,
                any_group_negated=jump.directAnyConditionNegated,
            )
            condition_lines = condition.splitlines()
            condition_lines[0] = f"  condition: {condition_lines[0]}"
            condition_lines[1:] = [f"  {line}" for line in condition_lines[1:]]
            condition_lines[-1] += ","
            step_lines = [
                "step('jumpTimeline', {",
                f"  destinationFrame: {jump.destFrame},",
                *condition_lines,
                "})",
            ]
            end_frame: int | None = jump.endFrame
        else:
            path_conditions: list[str] = []
            for outer_condition, jump_when_true in outer_match:
                compiled_condition = compile_combat_condition_group(
                    outer_condition.conditions,
                    f"{skill.key}.{hit.skillId}.timelineJump.outerCondition",
                    target_group_writes=getattr(hit, "localTargetGroupWrites", ()),
                    root_skill_context=False,
                    input_target=input_target,
                    ability_entity_current_target=True,
                    negated=getattr(outer_condition, "conditionNegated", ()),
                )
                if not jump_when_true:
                    compiled_condition = "\n".join(
                        [
                            "{",
                            "  kind: 'not',",
                            "  condition:",
                            *[f"    {line}" for line in compiled_condition.splitlines()],
                            "}",
                        ]
                    )
                path_conditions.append(compiled_condition)
            if len(path_conditions) == 1:
                condition = path_conditions[0]
            else:
                condition_parts = ["{", "  kind: 'all',", "  conditions: ["]
                for path_condition in path_conditions:
                    nested_lines = [f"    {line}" for line in path_condition.splitlines()]
                    nested_lines[-1] += ","
                    condition_parts.extend(nested_lines)
                condition_parts.extend(["  ],", "}"])
                condition = "\n".join(condition_parts)
            condition_lines = [f"  {line}" for line in condition.splitlines()]
            condition_lines[-1] += ","
            step_lines = [
                "branch(",
                *condition_lines,
                "  sequence(",
                "    step('jumpTimeline', {",
                f"      destinationFrame: {jump.destFrame},",
                "    }),",
                "  ),",
                ")",
            ]
            # 外层 IfElse 只在起始帧求值；不能把条件错误扩展成区间重试。
            end_frame = None
        render_groups.append(
            (
                jump.startFrame,
                native_sequence_order(jump, hit.actionOrder, hit.skillId),
                end_frame,
                [((*hit.actionOrder, jump.actionIndex), step_lines)],
            )
        )
    # 同一原生 IfElse 的一次性跳转必须先求值：成功时游标会跳过随后待执行的
    # 条件调度，失败时才让原失败分支继续执行，避免失败分支写入影响重复求值。
    render_groups.extend(ordinary_render_groups)

    lines = ["{", f"  skillId: {ts_inline_literal(hit.skillId)},"]
    numeric_blackboard = tuple(
        item
        for item in getattr(hit, "declaredBlackboard", ())
        if isinstance(item.value, float)
    )
    if numeric_blackboard:
        lines.append("  blackboard: {")
        lines.extend(
            f"    {ts_inline_literal(item.key)}: {ts_inline_literal(item.value)},"
            for item in numeric_blackboard
        )
        lines.append("  },")
    lines.append("  scheduledSequences: [")
    for frame, sequence_order, end_frame, actions in sorted(
        render_groups,
        key=lambda item: (item[0], item[1], -1 if item[2] is None else item[2]),
    ):
        lines.extend(["    scheduled(", f"      {frame},", "      sequence("])
        for _, step_lines in sorted(actions, key=lambda entry: entry[0]):
            lines.extend(
                f"        {line}," if line.endswith(")") else f"        {line}"
                for line in step_lines
            )
        lines.append("      ),")
        if end_frame is not None:
            lines.append(f"      {end_frame},")
        lines.append("    ),")
    lines.extend(["  ],", "}"])
    return "\n".join(lines)
