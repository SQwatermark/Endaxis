"""内联 Buff 事件、生命周期和实例本地时间线编译。"""

from __future__ import annotations

from dataclasses import dataclass
from types import SimpleNamespace
from typing import Any, Callable, Literal

from compiler_ir import (
    CompiledNode,
    EMPTY_SEQUENCE as COMPILED_EMPTY_SEQUENCE,
    render as render_compiled_node,
    render_sequence_children as render_compiled_sequence_children,
)
from source_models import BuffDefinitionSource, SkillSource, TargetGroupWriteSource
from source_utils import indent_source, require_list, ts_inline_literal


@dataclass(frozen=True)
class InlineBuffServices:
    """由入口注入的条件、动作、目标证明和能力实体子技能服务。"""

    compile_conditional_branch_ir: Callable[..., Any]
    compile_conditional_action_ir: Callable[..., Any]
    decode_damage_decorate_mask: Callable[..., Any]
    collect_resolved_damage_hits: Callable[..., Any]
    compile_ability_entity_child_skill: Callable[..., Any]
    compile_buff_event_target_group_write: Callable[..., Any]
    load_ability_entity_template_evidence: Callable[..., Any]
    target_reference_has_plain_selector: Callable[..., Any]
    target_reference_is_plain: Callable[..., Any]
    collect_compilable_conditional_action_types: Callable[..., Any]
    compile_blackboard_calculation: Callable[..., Any]
    compile_blackboard_mutation: Callable[..., Any]
    compile_buff_application: Callable[..., Any]
    compile_buff_blackboard_read: Callable[..., Any]
    compile_buff_finish: Callable[..., Any]
    compile_damage_units_step: Callable[..., Any]
    compile_infliction: Callable[..., Any]
    compile_resource_gain: Callable[..., Any]
    encode_damage_step_key: Callable[..., Any]
    resolve_latest_target_group_write_at: Callable[..., Any]
    resource_gain_can_change_value: Callable[..., Any]
    target_group_write_buff_application_target: Callable[..., Any]


def compile_inline_buff_event_responses(
    source: BuffDefinitionSource,
    path: str,
    *,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"],
    buff_definitions: dict[str, BuffDefinitionSource],
    ignored_buff_ids: frozenset[str] = frozenset(),
    services: InlineBuffServices,
) -> str:
    """编译证据已闭环的 Buff 启动序列与 Ability 承伤事件响应。"""
    _compile_conditional_branch_ir = services.compile_conditional_branch_ir
    decode_damage_decorate_mask = services.decode_damage_decorate_mask
    runtime_blackboard_keys = frozenset(item.key for item in source.blackboard)
    if path.endswith(".igniteEventActions"):
        response_lines: list[str] = ["igniteEventResponses: ["]
        response_count = 0
        for event_index, event in enumerate(source.igniteEventActions):
            event_path = f"{path}[{event_index}]"
            damage_tags: list[str] = []
            for damage_index, damage in enumerate(event.damageUnits):
                tags, _ = decode_damage_decorate_mask(
                    damage.damageDecorateMask,
                    f"{event_path}.damageUnits[{damage_index}].damageDecorateMask",
                )
                for tag in tags:
                    if tag not in damage_tags:
                        damage_tags.append(tag)
            compiled_sequences: list[CompiledNode] = []
            for sequence_index, event_sequence in enumerate(event.sequences):
                sequence_path = f"{event_path}.sequences[{sequence_index}]"
                if event_sequence.onlyMainOperator or event_sequence.onlyGuard:
                    raise ValueError(f"{sequence_path}: restricted Buff ignite sequence is unsupported")
                compiled = _compile_conditional_branch_ir(
                    event_sequence.actions,
                    f"{sequence_path}.actions",
                    ignored_buff_ids=ignored_buff_ids,
                    damage_tags=tuple(damage_tags),
                    target_group_writes=getattr(event, "runtimeTargetGroupWrites", ()),
                    input_target="enemy",
                    runtime_blackboard_keys=runtime_blackboard_keys,
                    step_key_prefix=f"{source.buffId}:ignite:{event.event}:{sequence_index}",
                    buff_definitions=buff_definitions,
                    buff_owner_target=buff_owner_target,
                    current_buff_environment=True,
                    aura_actions=tuple(
                        aura
                        for aura in source.auraActions
                        if aura.activationSource == "buffEvent"
                        and aura.activationEvent == event.event
                    ),
                )
                if compiled != COMPILED_EMPTY_SEQUENCE:
                    compiled_sequences.append(compiled)
            if not compiled_sequences:
                continue
            response_lines.extend(
                [
                    "  {",
                    f"    igniteType: {ts_inline_literal(event.event)},",
                    f"    finishAfterIgnited: {ts_inline_literal(event.finishAfterIgnited)},",
                    "    sequence: sequence(",
                ]
            )
            for compiled in compiled_sequences:
                for compiled_source in render_compiled_sequence_children(compiled):
                    compiled_lines = indent_source(compiled_source, 6)
                    compiled_lines[-1] += ","
                    response_lines.extend(compiled_lines)
            response_lines.extend(["    ),", "  },"])
            response_count += 1
        if response_count == 0:
            return ""
        response_lines.append("],")
        return "\n".join(response_lines)
    start_sequences: list[CompiledNode] = []
    enable_sequences: list[CompiledNode] = []
    finish_sequences: list[CompiledNode] = []
    after_enhance_sequences: list[CompiledNode] = []
    ability_response_lines: list[str] = []
    ability_response_count = 0
    for event_index, event in enumerate(source.eventActions):
        if not event.sequences:
            continue
        event_path = f"{path}[{event_index}]"
        damage_tags: list[str] = []
        for damage_index, damage in enumerate(event.damageUnits):
            tags, _ = decode_damage_decorate_mask(
                damage.damageDecorateMask,
                f"{event_path}.damageUnits[{damage_index}].damageDecorateMask",
            )
            for tag in tags:
                if tag not in damage_tags:
                    damage_tags.append(tag)
        for sequence_index, event_sequence in enumerate(event.sequences):
            sequence_path = f"{event_path}.sequences[{sequence_index}]"
            if event_sequence.onlyMainOperator or event_sequence.onlyGuard:
                raise ValueError(f"{sequence_path}: restricted Buff event sequence is unsupported")
            if not event_sequence.actions:
                # 清理、表现或敌方部件事件没有投影成当前模拟器中的战斗动作。
                continue
            # 当前标准场景没有敌方技能/动画时钟；冻结 Buff 的这组动作只冻结宿主敌人并
            # 写入控制标签，不改变玩家伤害、Buff 查询或玩家资源。精确限制来源和动作集，
            # 避免把其他 DuringBuffEnable 行为借此静默丢弃。
            if (
                source.buffId
                in {
                    "buff_common_originum_frozen",
                    "buff_chr_0026_lastrite_combo_skill_hitstop",
                }
                and buff_owner_target == "enemy"
                and event.eventSource == "buff"
                and event.event == "DuringBuffEnable"
                and set(event_sequence.orderedActionTypes)
                <= {
                    "EffectAction",
                    "CheckSuperArmor",
                    "TimeDilationAction",
                    "AddTagAction",
                    "PlaySoundAction",
                }
            ):
                continue
            is_start = event.eventSource == "buff" and event.event == "OnBuffStart"
            is_enable = (
                event.eventSource == "buff" and event.event == "DuringBuffEnable"
            )
            is_finish = event.eventSource == "buff" and event.event == "OnBuffFinish"
            is_after_enhance = (
                event.eventSource == "buff" and event.event == "OnBuffAfterTryEnhanced"
            )
            is_before_take_damage = (
                event.eventSource == "ability" and event.event == "OnBeforeTakeDamage"
            )
            is_output_damage = (
                event.eventSource == "ability" and event.event == "OnOutputDamage"
            )
            is_before_cast_skill = (
                event.eventSource == "ability" and event.event == "OnBeforeCastSkill"
            )
            is_added_buff = (
                event.eventSource == "ability" and event.event == "OnAddedBuff"
            )
            compiled = _compile_conditional_branch_ir(
                event_sequence.actions,
                f"{sequence_path}.actions",
                ignored_buff_ids=ignored_buff_ids,
                damage_tags=tuple(damage_tags),
                runtime_blackboard_keys=runtime_blackboard_keys,
                target_group_writes=getattr(event, "runtimeTargetGroupWrites", ()),
                input_target=(
                    "enemy"
                    if is_enable and buff_owner_target == "enemy"
                    else None
                ),
                step_key_prefix=(
                    f"{source.buffId}:enable:{sequence_index}"
                    if is_enable
                    else (
                        f"{source.buffId}:start:{sequence_index}"
                        if is_start
                        else (
                            f"{source.buffId}:finish:{sequence_index}"
                            if is_finish
                            else (
                                f"{source.buffId}:afterEnhance:{sequence_index}"
                                if is_after_enhance
                                else (
                                    f"{source.buffId}:beforeTakeDamage:{sequence_index}"
                                    if is_before_take_damage
                                    else (
                                        f"{source.buffId}:outputDamage:{sequence_index}"
                                        if is_output_damage
                                        else f"{source.buffId}:beforeCastSkill:{sequence_index}"
                                    )
                                )
                            )
                        )
                    )
                ),
                buff_definitions=buff_definitions,
                buff_ability_damage_event=(
                    is_before_take_damage or is_output_damage or is_before_cast_skill
                ),
                buff_owner_target=buff_owner_target,
                current_buff_environment=True,
                aura_actions=tuple(
                    aura
                    for aura in getattr(source, "auraActions", ())
                    if aura.activationSource
                    == ("buffEvent" if event.eventSource == "buff" else "abilityEvent")
                    and aura.activationEvent == event.event
                ),
            )
            if compiled == COMPILED_EMPTY_SEQUENCE:
                continue
            if is_enable:
                enable_sequences.append(compiled)
                continue
            if is_start:
                start_sequences.append(compiled)
                continue
            if is_finish:
                finish_sequences.append(compiled)
                continue
            if is_after_enhance:
                after_enhance_sequences.append(compiled)
                continue
            if not (
                is_before_take_damage
                or is_output_damage
                or is_before_cast_skill
                or is_added_buff
            ):
                raise ValueError(
                    f"{event_path}: unsupported Buff event "
                    f"{event.eventSource!r}/{event.event!r}"
                )
            event_name = (
                "beforeTakeDamage"
                if is_before_take_damage
                else "outputDamage"
                if is_output_damage
                else "beforeCastSkill"
                if is_before_cast_skill
                else "addedBuff"
            )
            compiled_lines = indent_source(render_compiled_node(compiled), 6)
            compiled_lines[-1] += ","
            ability_response_lines.extend(
                [
                    "  {",
                    f"    event: {ts_inline_literal(event_name)},",
                    f"    priority: {event_sequence.priority},",
                    "    sequence:",
                    *compiled_lines,
                    "  },",
                ]
            )
            ability_response_count += 1
    lifecycle_sequences = (
        enable_sequences or start_sequences or finish_sequences or after_enhance_sequences
    )
    if lifecycle_sequences and getattr(source, "sourceDeathFinish", None) is not None:
        raise ValueError(f"{path}: unsupported mixed Buff lifecycle and source-death events")
    if not lifecycle_sequences and ability_response_count == 0:
        return ""
    lines: list[str] = []
    if lifecycle_sequences:
        lines.append("lifecycleSequences: {")
        for lifecycle_name, sequences in (
            ("enable", enable_sequences),
            ("start", start_sequences),
            ("finish", finish_sequences),
            ("afterEnhance", after_enhance_sequences),
        ):
            if not sequences:
                continue
            lines.append(f"  {lifecycle_name}: sequence(")
            for compiled in sequences:
                for compiled_source in render_compiled_sequence_children(compiled):
                    compiled_lines = indent_source(compiled_source, 4)
                    compiled_lines[-1] += ","
                    lines.extend(compiled_lines)
            lines.append("  ),")
        lines.append("},")
    if ability_response_count:
        lines.extend(["abilityEventResponses: [", *ability_response_lines, "],"])
    return "\n".join(lines)


def compile_inline_buff_behaviors(
    source: BuffDefinitionSource,
    path: str,
    *,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"],
    buff_definitions: dict[str, BuffDefinitionSource],
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    ignored_buff_ids: frozenset[str] = frozenset(),
    services: InlineBuffServices,
) -> str:
    """编译 Buff 的已闭环事件行为；隐藏实体技能只允许由周期触发同步启动。"""
    _compile_conditional_branch_ir = services.compile_conditional_branch_ir
    collect_resolved_damage_hits = services.collect_resolved_damage_hits
    compile_ability_entity_child_skill = services.compile_ability_entity_child_skill
    compile_buff_event_target_group_write = services.compile_buff_event_target_group_write
    load_ability_entity_template_evidence = services.load_ability_entity_template_evidence
    target_reference_has_plain_selector = services.target_reference_has_plain_selector
    target_reference_is_plain = services.target_reference_is_plain
    enhance_events = tuple(
        event
        for event in source.eventActions
        if event.eventSource == "buff" and event.event == "OnBuffEnhanceChanged"
    )
    trigger_events = tuple(
        event
        for event in source.eventActions
        if event.eventSource == "buff"
        and event.event == "OnBuffTrigger"
        and event.forEachActions
    )
    if enhance_events:
        other_events = tuple(
            event
            for event in source.eventActions
            if event not in enhance_events
            and any(sequence.actions for sequence in event.sequences)
        )
        if len(enhance_events) != 1 or other_events:
            raise ValueError(f"{path}: unsupported mixed Buff enhance events")
        runtime_blackboard_keys = frozenset(
            (*[item.key for item in source.blackboard], "strength", "agility", "intellect", "will")
        )
        compiled_sequences: list[CompiledNode] = []
        for sequence_index, event_sequence in enumerate(enhance_events[0].sequences):
            if event_sequence.onlyMainOperator or event_sequence.onlyGuard:
                raise ValueError(f"{path}: restricted Buff enhance event is unsupported")
            compiled = _compile_conditional_branch_ir(
                event_sequence.actions,
                f"{path}.enhanceChanged.sequences[{sequence_index}].actions",
                ignored_buff_ids=ignored_buff_ids,
                runtime_blackboard_keys=runtime_blackboard_keys,
                step_key_prefix=f"{source.buffId}:enhanceChanged:{sequence_index}",
                buff_definitions=buff_definitions,
                buff_owner_target=buff_owner_target,
                current_buff_environment=True,
                invoked_child_context=invoked_child_context,
            )
            if compiled != COMPILED_EMPTY_SEQUENCE:
                compiled_sequences.append(compiled)
        if not compiled_sequences:
            return ""
        lines = ["lifecycleSequences: {", "  enhanceChanged: sequence("]
        for compiled in compiled_sequences:
            for compiled_source in render_compiled_sequence_children(compiled):
                compiled_lines = indent_source(compiled_source, 4)
                compiled_lines[-1] += ","
                lines.extend(compiled_lines)
        lines.extend(["  ),", "},"])
        return "\n".join(lines)
    if not trigger_events:
        return compile_inline_buff_event_responses(
            source,
            path,
            buff_owner_target=buff_owner_target,
            buff_definitions=buff_definitions,
            ignored_buff_ids=ignored_buff_ids,
            services=services,
        )
    if invoked_child_context is None:
        raise ValueError(f"{path}: invoked AbilityEntity child context is unavailable")
    if buff_owner_target == "currentAbilityEntity":
        raise ValueError(
            f"{path}: invoked AbilityEntity child target cannot be the host AbilityEntity"
        )
    if len(trigger_events) != 1:
        raise ValueError(f"{path}: expected one AbilityEntity trigger event")
    event = trigger_events[0]
    if len(event.targetGroupWrites) != 1 or len(event.forEachActions) != 1:
        raise ValueError(f"{path}: expected one target-group producer and one foreach loop")
    write = event.targetGroupWrites[0]
    loop = event.forEachActions[0]
    if (
        loop.target.targetSource != "Context"
        or loop.target.targetGroupKey != write.targetGroupKey
        or not target_reference_has_plain_selector(loop.target)
        or loop.orderedActionTypes != ("CastSkill",)
        or loop.buffApplications
        or len(loop.skillCasts) != 1
    ):
        raise ValueError(f"{path}: unsupported AbilityEntity foreach invocation")
    skill_cast = loop.skillCasts[0]
    if not (
        skill_cast.caster.targetSource == "Target"
        and target_reference_is_plain(skill_cast.caster)
        and skill_cast.target.targetSource == "Owner"
        and target_reference_is_plain(skill_cast.target)
        and not skill_cast.skipApplyCost
        and skill_cast.inheritSourceSkillCastId
    ):
        raise ValueError(f"{path}: unsupported AbilityEntity CastSkill identity")
    children = tuple(
        child
        for child in source.invokedAbilityEntitySkills
        if child.skillId == skill_cast.skillId
    )
    if len(children) != 1:
        raise ValueError(f"{path}: invoked AbilityEntity child was not resolved uniquely")
    child = children[0]
    root_skill, config = invoked_child_context
    child_damage_hits = collect_resolved_damage_hits(
        SimpleNamespace(
            skillId=f"{source.buffId}:trigger",
            directDamageHits=(),
            projectileTriggeredSkills=(),
            abilityEntityHits=(child,),
        )
    )
    child_source = compile_ability_entity_child_skill(
        child,
        root_skill,
        config,
        child_damage_hits,
        frozenset(item.key for item in child.declaredBlackboard),
        input_target=buff_owner_target,
        buff_definitions=buff_definitions,
    )
    find_source = compile_buff_event_target_group_write(
        write,
        load_ability_entity_template_evidence(),
        f"{path}.targetGroupWrites[0]",
    )
    child_lines = indent_source(
        "step('startCurrentAbilityEntityChildSkill', { childSkill: " + child_source + " })",
        8,
    )
    lifecycle_fields: list[str] = []
    enable_sequences: list[CompiledNode] = []
    runtime_blackboard_keys = frozenset(item.key for item in source.blackboard)
    for event_index, enable_event in enumerate(source.eventActions):
        if enable_event.eventSource != "buff" or enable_event.event != "DuringBuffEnable":
            continue
        for sequence_index, event_sequence in enumerate(enable_event.sequences):
            if not event_sequence.actions:
                continue
            compiled_enable = _compile_conditional_branch_ir(
                event_sequence.actions,
                f"{path}[{event_index}].sequences[{sequence_index}].actions",
                runtime_blackboard_keys=runtime_blackboard_keys,
                root_skill_context=False,
                input_target="enemy",
                step_key_prefix=f"{source.buffId}:enable:{sequence_index}",
                buff_definitions=buff_definitions,
                buff_owner_target=buff_owner_target,
                current_buff_environment=True,
                invoked_child_context=invoked_child_context,
            )
            if compiled_enable != COMPILED_EMPTY_SEQUENCE:
                enable_sequences.append(compiled_enable)
    if enable_sequences:
        lifecycle_fields.append("  enable: sequence(")
        for enable_sequence in enable_sequences:
            for enable_source in render_compiled_sequence_children(enable_sequence):
                enable_lines = indent_source(enable_source, 4)
                enable_lines[-1] += ","
                lifecycle_fields.extend(enable_lines)
        lifecycle_fields.append("  ),")
    lifecycle_fields.extend(
        [
            "  trigger: sequence(",
            f"    {find_source},",
            "    forEachContextTarget(",
            f"      {ts_inline_literal(write.targetGroupKey)},",
            "      sequence(",
            *child_lines,
            "      ),",
            "    ),",
            "  ),",
        ]
    )
    return "\n".join(["lifecycleSequences: {", *lifecycle_fields, "},"])

def compile_inline_buff_scheduled_sequences(
    source: BuffDefinitionSource,
    path: str,
    *,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"],
    buff_definitions: dict[str, BuffDefinitionSource],
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    services: InlineBuffServices,
) -> str:
    """编译 Buff 实例本地帧时间线；Context/trigger 只由调用目标证据注入。"""
    _compile_conditional_action_ir = services.compile_conditional_action_ir
    collect_compilable_conditional_action_types = services.collect_compilable_conditional_action_types
    compile_blackboard_calculation = services.compile_blackboard_calculation
    compile_blackboard_mutation = services.compile_blackboard_mutation
    compile_buff_application = services.compile_buff_application
    compile_buff_blackboard_read = services.compile_buff_blackboard_read
    compile_buff_finish = services.compile_buff_finish
    compile_damage_units_step = services.compile_damage_units_step
    compile_infliction = services.compile_infliction
    compile_resource_gain = services.compile_resource_gain
    encode_damage_step_key = services.encode_damage_step_key
    resolve_latest_target_group_write_at = services.resolve_latest_target_group_write_at
    resource_gain_can_change_value = services.resource_gain_can_change_value
    target_group_write_buff_application_target = services.target_group_write_buff_application_target
    runtime_blackboard_keys = frozenset(item.key for item in source.blackboard)
    damage_tags = (
        tuple(
            require_list(
                invoked_child_context[1].get("tags", []),
                f"{path}.invokedChildContext.tags",
            )
        )
        if invoked_child_context is not None
        else ()
    )
    trigger_write = TargetGroupWriteSource(
        startFrame=-1,
        endFrame=-1,
        actionIndex=-1,
        actionPath=(),
        targetGroupKey="trigger",
        producerType="FindTargetAction",
        finderType="MainTargetFinder",
        finderFactionTarget=None,
        finderTargetObjectType=None,
        finderCheckAlive=None,
        validatorTypes=(),
        postProcessorTypes=(),
        inputTargets=(),
        intervalSeconds=None,
    )
    target_group_writes = (trigger_write, *source.targetGroupWrites)
    compiled: list[tuple[int, int, int, list[str]]] = []

    for index, action in enumerate(source.auxiliaryActions):
        if action.actionType != "CreateBuffAction":
            raise ValueError(f"{path}.auxiliaryActions[{index}]: unsupported {action.actionType}")
        if action.classification == "skillCostUltimateEnergyGain":
            compiled.append(
                (
                    action.startFrame,
                    action.sequenceIndex,
                    action.actionIndex,
                    ["step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })"],
                )
            )
            continue
        context_target = (
            "enemy"
            if action.targetSource == "Context" and action.targetGroupKey == "trigger"
            else None
        )
        step_lines = compile_buff_application(
            action,
            f"{path}.auxiliaryActions[{index}]",
            root_skill_context=False,
            context_application_target=context_target,
            input_target="enemy",
            buff_definitions=buff_definitions,
            invoked_child_context=invoked_child_context,
            buff_owner_target=buff_owner_target,
            current_buff_environment=True,
        ).splitlines()
        compiled.append(
            (action.startFrame, action.sequenceIndex, action.actionIndex, step_lines)
        )

    for index, calculation in enumerate(source.blackboardCalculations):
        compiled.append(
            (
                calculation.startFrame,
                calculation.sequenceIndex,
                calculation.actionIndex,
                compile_blackboard_calculation(
                    calculation, f"{path}.blackboardCalculations[{index}]"
                ).splitlines(),
            )
        )
    for index, mutation in enumerate(source.blackboardMutations):
        compiled.append(
            (
                mutation.startFrame,
                mutation.sequenceIndex,
                mutation.actionIndex,
                compile_blackboard_mutation(
                    mutation, f"{path}.blackboardMutations[{index}]"
                ).splitlines(),
            )
        )
    for index, read in enumerate(source.buffBlackboardReads):
        compiled.append(
            (
                read.startFrame,
                read.sequenceIndex,
                read.actionIndex,
                compile_buff_blackboard_read(
                    read,
                    f"{path}.buffBlackboardReads[{index}]",
                    root_skill_context=False,
                    input_target="enemy",
                    context_target_is_enemy=(
                        read.targetSource == "Context"
                        and read.targetGroupKey == "trigger"
                    ),
                    buff_owner_target=buff_owner_target,
                    current_buff_environment=True,
                ).splitlines(),
            )
        )
    for index, finish in enumerate(source.buffFinishes):
        context_finish_target = None
        if finish.targetSource == "Context":
            write = resolve_latest_target_group_write_at(
                read_frame=finish.startFrame,
                read_action_index=finish.actionIndex,
                read_action_path=(),
                target_group_key=finish.targetGroupKey,
                writes=source.targetGroupWrites,
            )
            context_finish_target = target_group_write_buff_application_target(write)
        compiled.append(
            (
                finish.startFrame,
                finish.sequenceIndex,
                finish.actionIndex,
                compile_buff_finish(
                    finish,
                    f"{path}.buffFinishes[{index}]",
                    root_skill_context=False,
                    input_target="enemy",
                    buff_owner_target=buff_owner_target,
                    current_buff_environment=True,
                    context_finish_target=context_finish_target,
                ).splitlines(),
            )
        )
    for index, gain in enumerate(source.resourceGains):
        if not resource_gain_can_change_value(gain, f"{path}.resourceGains[{index}]"):
            continue
        compiled.append(
            (
                gain.startFrame,
                gain.sequenceIndex,
                gain.actionIndex,
                compile_resource_gain(
                    gain, f"{path}.resourceGains[{index}]"
                ).splitlines(),
            )
        )
    for index, condition in enumerate(source.conditionalActions):
        compiled_condition = _compile_conditional_action_ir(
            condition,
            f"{path}.conditionalActions[{index}]",
            damage_tags=damage_tags,
            runtime_blackboard_keys=runtime_blackboard_keys,
            target_group_writes=target_group_writes,
            root_skill_context=False,
            input_target="enemy",
            step_key_prefix=source.buffId,
            buff_definitions=buff_definitions,
            buff_owner_target=buff_owner_target,
            current_buff_environment=True,
            invoked_child_context=invoked_child_context,
        )
        if compiled_condition != COMPILED_EMPTY_SEQUENCE:
            compiled.append(
                (
                    condition.startFrame,
                    int(condition.actionPath[0][len("timelineActions[") : -1]),
                    condition.actionIndex,
                    [
                        line
                        for compiled_source in render_compiled_sequence_children(
                            compiled_condition
                        )
                        for line in compiled_source.splitlines()
                    ],
                )
            )
    for index, damage in enumerate(source.directDamageHits):
        compiled.append(
            (
                damage.startFrame,
                damage.sequenceIndex,
                damage.actionIndex,
                compile_damage_units_step(
                    damage.damageUnits,
                    damage_tags,
                    f"{path}.directDamageHits[{index}]",
                    runtime_blackboard_keys,
                    encode_damage_step_key(
                        source.buffId, "buff", (source.buffId,), (damage.actionIndex,)
                    ),
                    validate_declared_tags=False,
                ),
            )
        )
    for infliction in getattr(source, "inflictions", ()):
        compiled.append(
            (
                infliction.startFrame,
                infliction.sequenceIndex,
                infliction.actionIndex,
                compile_infliction(infliction).splitlines(),
            )
        )

    covered_actions = collect_compilable_conditional_action_types(
        source.conditionalActions
    )
    if source.auxiliaryActions:
        covered_actions.add("CreateBuffAction")
    if source.directDamageHits:
        covered_actions.add("DamageAction")
    if getattr(source, "inflictions", ()):
        covered_actions.add("SpellInfliction")
    if source.blackboardCalculations:
        covered_actions.add("SimpleCalcBBAction")
    if source.blackboardMutations:
        covered_actions.add("ModifyDynamicBlackboard")
    if source.buffBlackboardReads:
        covered_actions.add("GetTargetBuffBBAdvanced")
    if source.buffFinishes:
        covered_actions.update(finish.sourceActionType for finish in source.buffFinishes)
    if source.resourceGains:
        covered_actions.add("ObtainCostAction")
    uncovered_actions = sorted(set(source.combatActions) - covered_actions)
    if uncovered_actions:
        raise ValueError(
            f"{path}: Buff timeline combat actions are not covered: {uncovered_actions}"
        )

    if not compiled:
        return ""
    grouped: dict[tuple[int, int], list[tuple[int, list[str]]]] = {}
    for frame, sequence_index, action_index, lines in compiled:
        grouped.setdefault((frame, sequence_index), []).append((action_index, lines))
    result = ["scheduledSequences: ["]
    for frame, sequence_index in sorted(grouped):
        result.extend(["  scheduled(", f"    {frame},", "    sequence("])
        for _, lines in sorted(grouped[(frame, sequence_index)], key=lambda item: item[0]):
            result.extend(
                f"      {line}," if line.endswith(")") else f"      {line}"
                for line in lines
            )
        result.extend(["    ),", "  ),"])
    result.append("],")
    return "\n".join(result)
