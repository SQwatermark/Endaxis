"""内联 Buff 事件、生命周期和实例本地时间线编译。"""

from __future__ import annotations

from dataclasses import dataclass, replace
from types import SimpleNamespace
from typing import Any, Callable, Literal

from compiler_ir import (
    atom,
    branch,
    CompiledNode,
    EMPTY_SEQUENCE as COMPILED_EMPTY_SEQUENCE,
    render as render_compiled_node,
    render_sequence_children as render_compiled_sequence_children,
    once,
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
    compile_logical_ability_entity_spawn: Callable[..., Any]
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
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    current_ability_entity_id: str | None = None,
    damage_tags: tuple[str, ...] = (),
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
            event_damage_tags: list[str] = []
            for damage_index, damage in enumerate(event.damageUnits):
                tags, _ = decode_damage_decorate_mask(
                    damage.damageDecorateMask,
                    f"{event_path}.damageUnits[{damage_index}].damageDecorateMask",
                )
                for tag in tags:
                    if tag not in event_damage_tags:
                        event_damage_tags.append(tag)
            compiled_sequences: list[CompiledNode] = []
            for sequence_index, event_sequence in enumerate(event.sequences):
                sequence_path = f"{event_path}.sequences[{sequence_index}]"
                if event_sequence.onlyMainOperator or event_sequence.onlyGuard:
                    raise ValueError(f"{sequence_path}: restricted Buff ignite sequence is unsupported")
                compiled = _compile_conditional_branch_ir(
                    event_sequence.actions,
                    f"{sequence_path}.actions",
                    ignored_buff_ids=ignored_buff_ids,
                    damage_tags=tuple(dict.fromkeys((*damage_tags, *event_damage_tags))),
                    target_group_writes=tuple(
                        dict.fromkeys(
                            (
                                *getattr(event, "runtimeTargetGroupWrites", ()),
                                *getattr(source, "targetGroupWrites", ()),
                            )
                        )
                    ),
                    # Buff.OnIgnite passes igniteSource.selfTargetHandle to the action sequence.
                    # Buff owner remains independently available through buff_owner_target.
                    input_target="caster",
                    runtime_blackboard_keys=runtime_blackboard_keys,
                    step_key_prefix=f"{source.buffId}:ignite:{event.event}:{sequence_index}",
                    buff_definitions=buff_definitions,
                    buff_owner_target=buff_owner_target,
                    current_buff_environment=True,
                    current_ability_entity_id=current_ability_entity_id,
                    invoked_child_context=invoked_child_context,
                    aura_actions=tuple(
                        aura
                        for aura in source.auraActions
                        if aura.activationSource == "buffEvent"
                        and aura.activationEvent == event.event
                    ),
                )
                if compiled != COMPILED_EMPTY_SEQUENCE:
                    # Native ignite mappings execute every actions wrapper independently;
                    # one wrapper's false result does not suppress later wrappers.
                    compiled_sequences.append(
                        branch(
                            "{ kind: 'combatActive' }",
                            compiled,
                            always_next=True,
                        )
                    )
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
    enable_once_sequences: list[CompiledNode] = []
    during_enable_sequences: list[CompiledNode] = []
    disable_sequences: list[CompiledNode] = []
    finish_sequences: list[CompiledNode] = []
    trigger_sequences: list[CompiledNode] = []
    enhance_changed_sequences: list[CompiledNode] = []
    after_enhance_sequences: list[CompiledNode] = []
    ability_response_lines: list[str] = []
    ability_response_count = 0
    for animation_index, animation in enumerate(
        getattr(source, "animationEndBuffApplications", ())
    ):
        if animation.executeOnNormalEndOnly:
            continue
        application_source = services.compile_buff_application(
            animation.application,
            f"{path}.animationEndBuffApplications[{animation_index}].application",
            root_skill_context=False,
            input_target="enemy",
            buff_definitions=buff_definitions,
            buff_owner_target=buff_owner_target,
            current_buff_environment=True,
        )
        finish_sequences.append(
            once(
                ts_inline_literal(
                    f"animation-end:{source.buffId}:{animation.sequenceIndex}:{animation.animationActionIndex}"
                ),
                atom(application_source),
            )
        )
    for qte_index, qte in enumerate(getattr(source, "comboQteActions", ())):
        mutation = services.compile_blackboard_mutation(
            qte.triggerMutation,
            f"{path}.comboQteActions[{qte_index}].triggerMutation",
        )
        mutation_lines = indent_source(mutation, 10)
        mutation_lines[-1] += ","
        ability_response_lines.extend(
            [
                "  {",
                "    event: 'beforeCastSkill',",
                "    priority: 0,",
                "    sequence: sequence(",
                "      branch(",
                "      {",
                "        kind: 'all',",
                "        conditions: [",
                "          { kind: 'eventSkillTypeIn', skillTypes: ['comboSkill'] },",
                "          {",
                "            kind: 'buffIdStackCompare',",
                "            target: 'caster',",
                f"            buffIds: [{ts_inline_literal(qte.activeTimerBuffId)}],",
                "            operator: 'greaterOrEqual',",
                "            value: 1,",
                "          },",
                "        ],",
                "      },",
                "      sequence(",
                *mutation_lines,
                "      ),",
                "      ),",
                "    ),",
                "  },",
            ]
        )
        ability_response_count += 1
    for pause_index, pause in enumerate(getattr(source, "pauseTimeActions", ())):
        if pause.event == "OnBeforeCastSkill" and pause.skillIds and not pause.buffIds:
            event_name = "beforeCastSkill"
            condition = (
                "{ kind: 'eventSkillIdIn', skillIds: "
                + ts_inline_literal(pause.skillIds)
                + " }"
            )
        elif pause.event == "OnFinishedBuff" and pause.buffIds and not pause.skillIds:
            event_name = "finishedBuff"
            condition = (
                "{ kind: 'eventBuffIdMatch', buffIds: "
                + ts_inline_literal(pause.buffIds)
                + " }"
            )
        else:
            raise ValueError(f"{path}.pauseTimeActions[{pause_index}]: invalid event identity")
        ability_response_lines.extend(
            [
                "  {",
                f"    event: {ts_inline_literal(event_name)},",
                f"    priority: {pause.priority},",
                "    sequence: sequence(",
                "      branch(",
                f"        {condition},",
                "        sequence(",
                "          step('setCurrentBuffTimePaused', {",
                f"            paused: {ts_inline_literal(pause.paused)},",
                "          }),",
                "        ),",
                "      ),",
                "    ),",
                "  },",
            ]
        )
        ability_response_count += 1
    # Buff StartActions and later event responses share the same native action
    # environment Context. Model start writes as lifecycle-preceding writes so
    # trigger conditions can prove the identity of a saved target group.
    persistent_start_writes = tuple(
        replace(write, startFrame=-1, actionPath=())
        for start_event in source.eventActions
        if start_event.eventSource == "buff" and start_event.event == "OnBuffStart"
        for write in getattr(start_event, "runtimeTargetGroupWrites", ())
    )
    for event_index, event in enumerate(source.eventActions):
        if not event.sequences:
            continue
        if (
            event.eventSource == "ability"
            and (
                (
                    event.event == "OnTrulyExitFight"
                    and bool(event.orderedActionTypes)
                    and set(event.orderedActionTypes)
                    <= {"ModifyDynamicBlackboard", "FinishBuffAdvanced"}
                )
                or (
                    event.event == "OnRemoveAllPendingComboSkill"
                    and event.orderedActionTypes == ("FinishBuffAdvanced",)
                )
                or (
                    event.eventSource == "ability"
                    and event.event == "OnSquadRepatriate"
                    and event.orderedActionTypes == ("FinishOwnerAction",)
                    and all(not sequence.actions for sequence in event.sequences)
                )
            )
        ):
            # 标准木桩模拟没有离战、队伍遣返或清空候选连携事件；保留审计事实但不伪造触发点。
            continue
        if (
            event.eventSource == "ability"
            and event.event == "OnOwnerDead"
            and (
                buff_owner_target in {"caster", "enemy"}
                or (
                    buff_owner_target == "buffSource"
                    and source.buffId == "buff_chr_0023_antal_tageffect"
                )
            )
        ):
            # 1.4.4 的 BaseController.OnDie 在实体已经死亡后向该实体 AbilitySystem 派发
            # OnOwnerDead。标准木桩不主动伤害干员，故 caster 死亡不可达；唯一木桩死亡又是模拟
            # 终点。保留解析与审计事实，但不虚构玩家死亡、第二目标或死后战斗阶段。能力实体死亡
            # 可由正常技能链产生，currentAbilityEntity 仍必须走严格编译，不能在这里一并省略。
            # 安塔尔 tageffect 的 buffSource 由外层 normal_skill 的 InputTarget 明确固定为唯一敌人；
            # 这里只承认该条完整来源链，不把一般 buffSource 猜成敌人。
            continue
        event_path = f"{path}[{event_index}]"
        event_damage_tags: list[str] = []
        for damage_index, damage in enumerate(event.damageUnits):
            tags, _ = decode_damage_decorate_mask(
                damage.damageDecorateMask,
                f"{event_path}.damageUnits[{damage_index}].damageDecorateMask",
            )
            for tag in tags:
                if tag not in event_damage_tags:
                    event_damage_tags.append(tag)
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
            is_enable_once = (
                event.eventSource == "buff" and event.event == "OnBuffEnable"
            )
            is_during_enable = (
                event.eventSource == "buff" and event.event == "DuringBuffEnable"
            )
            is_disable = (
                event.eventSource == "buff" and event.event == "OnBuffDisable"
            )
            is_finish = event.eventSource == "buff" and event.event == "OnBuffFinish"
            is_trigger = event.eventSource == "buff" and event.event == "OnBuffTrigger"
            is_after_enhance = (
                event.eventSource == "buff" and event.event == "OnBuffAfterTryEnhanced"
            )
            is_enhance_changed = (
                event.eventSource == "buff" and event.event == "OnBuffEnhanceChanged"
            )
            is_before_take_damage = (
                event.eventSource == "ability" and event.event == "OnBeforeTakeDamage"
            )
            is_before_take_physical_infliction = (
                event.eventSource == "ability"
                and event.event == "OnBeforeTakePhysicalInfliction"
            )
            is_before_take_spell_infliction = (
                event.eventSource == "ability"
                and event.event == "OnCharBeforeTakeSpellInfliction"
            )
            is_enemy_before_take_spell_infliction = (
                event.eventSource == "ability"
                and event.event == "OnEnemyBeforeTakeSpellInfliction"
            )
            is_enter_fight = (
                event.eventSource == "ability" and event.event == "OnEnterFight"
            )
            is_owner_hp_zero = (
                event.eventSource == "ability" and event.event == "OnOwnerHpZero"
            )
            is_take_damage = (
                event.eventSource == "ability" and event.event == "OnTakeDamage"
            )
            is_output_damage = (
                event.eventSource == "ability" and event.event == "OnOutputDamage"
            )
            is_output_knock_down = (
                event.eventSource == "ability"
                and event.event == "OnBeforeOutputKnockDown"
            )
            is_output_heal = (
                event.eventSource == "ability" and event.event == "OnOutputHeal"
            )
            is_receive_heal = (
                event.eventSource == "ability" and event.event == "OnReceiveHeal"
            )
            is_poise_zero = (
                event.eventSource == "ability" and event.event == "OnPoiseZero"
            )
            is_after_output_weakness_triggered = (
                event.eventSource == "ability"
                and event.event == "OnAfterOutputWeaknessTriggered"
            )
            is_take_critical_damage = (
                event.eventSource == "ability" and event.event == "OnTakeCriticalDamage"
            )
            is_before_cast_skill = (
                event.eventSource == "ability" and event.event == "OnBeforeCastSkill"
            )
            is_skill_end = (
                event.eventSource == "ability" and event.event == "OnSkillEnd"
            )
            is_added_buff = (
                event.eventSource == "ability" and event.event == "OnAddedBuff"
            )
            is_before_output_buff = (
                event.eventSource == "ability" and event.event == "OnBeforeOutputBuff"
            )
            is_output_buff = (
                event.eventSource == "ability" and event.event == "OnOutputBuff"
            )
            is_after_kill_entity = (
                event.eventSource == "ability" and event.event == "OnAfterKillEntity"
            )
            is_finished_buff = (
                event.eventSource == "ability" and event.event == "OnFinishedBuff"
            )
            step_key_event = (
                "enable"
                if is_enable_once
                else "duringEnable"
                if is_during_enable
                else "disable"
                if is_disable
                else "start"
                if is_start
                else "finish"
                if is_finish
                else "trigger"
                if is_trigger
                else "afterEnhance"
                if is_after_enhance
                else "enhanceChanged"
                if is_enhance_changed
                else "enterFight"
                if is_enter_fight
                else "ownerHpZero"
                if is_owner_hp_zero
                else "beforeTakeDamage"
                if is_before_take_damage
                else "beforeTakeSpellInfliction"
                if is_before_take_spell_infliction
                else "beforeTakeInfliction"
                if is_enemy_before_take_spell_infliction
                else "takeDamage"
                if is_take_damage
                else "takeCriticalDamage"
                if is_take_critical_damage
                else "outputDamage"
                if is_output_damage
                else "outputKnockDown"
                if is_output_knock_down
                else "outputHeal"
                if is_output_heal
                else "receiveHeal"
                if is_receive_heal
                else "poiseZero"
                if is_poise_zero
                else "afterOutputWeaknessTriggered"
                if is_after_output_weakness_triggered
                else "beforeCastSkill"
                if is_before_cast_skill
                else "outputBuff"
                if is_output_buff
                else "skillEnd"
            )
            compiled = _compile_conditional_branch_ir(
                event_sequence.actions,
                f"{sequence_path}.actions",
                ignored_buff_ids=ignored_buff_ids,
                damage_tags=tuple(dict.fromkeys((*damage_tags, *event_damage_tags))),
                runtime_blackboard_keys=runtime_blackboard_keys,
                target_group_writes=tuple(
                    dict.fromkeys(
                        (
                                *getattr(event, "runtimeTargetGroupWrites", ()),
                                *persistent_start_writes,
                                *getattr(source, "targetGroupWrites", ()),
                        )
                    )
                ),
                input_target=(
                    "enemy"
                    if (event.eventSource == "buff" and buff_owner_target == "enemy")
                    or is_output_damage
                    or is_enemy_before_take_spell_infliction
                    else None
                ),
                step_key_prefix=f"{source.buffId}:{step_key_event}:{sequence_index}",
                buff_definitions=buff_definitions,
                buff_ability_damage_event=(
                    is_before_take_damage
                    or is_before_take_physical_infliction
                    or is_before_take_spell_infliction
                    or is_enemy_before_take_spell_infliction
                    or is_take_damage
                    or is_take_critical_damage
                    or is_output_damage
                    or is_output_heal
                    or is_receive_heal
                    or is_poise_zero
                    or is_before_cast_skill
                    or is_added_buff
                    or is_before_output_buff
                    or is_output_buff
                ),
                buff_owner_target=buff_owner_target,
                current_buff_environment=True,
                current_ability_entity_id=current_ability_entity_id,
                invoked_child_context=invoked_child_context,
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
            if is_enable_once:
                enable_once_sequences.append(compiled)
                continue
            if is_during_enable:
                during_enable_sequences.append(compiled)
                continue
            if is_disable:
                disable_sequences.append(compiled)
                continue
            if is_start:
                start_sequences.append(compiled)
                continue
            if is_finish:
                finish_sequences.append(compiled)
                continue
            if is_trigger:
                trigger_sequences.append(compiled)
                continue
            if is_after_enhance:
                after_enhance_sequences.append(compiled)
                continue
            if is_enhance_changed:
                enhance_changed_sequences.append(compiled)
                continue
            if not (
                is_enter_fight
                or is_owner_hp_zero
                or is_before_take_damage
                or is_before_take_physical_infliction
                or is_before_take_spell_infliction
                or is_enemy_before_take_spell_infliction
                or is_take_damage
                or is_take_critical_damage
                or is_output_damage
                or is_output_knock_down
                or is_output_heal
                or is_receive_heal
                or is_poise_zero
                or is_after_output_weakness_triggered
                or is_before_cast_skill
                or is_skill_end
                or is_added_buff
                or is_before_output_buff
                or is_output_buff
                or is_after_kill_entity
                or is_finished_buff
            ):
                raise ValueError(
                    f"{event_path}: unsupported Buff event "
                    f"{event.eventSource!r}/{event.event!r}"
                )
            event_name = (
                "enterFight"
                if is_enter_fight
                else "ownerHpZero"
                if is_owner_hp_zero
                else "beforeTakeDamage"
                if is_before_take_damage
                else "beforeTakePhysicalInfliction"
                if is_before_take_physical_infliction
                else "beforeTakeSpellInfliction"
                if is_before_take_spell_infliction
                else "beforeTakeInfliction"
                if is_enemy_before_take_spell_infliction
                else "takeDamage"
                if is_take_damage
                else "takeCriticalDamage"
                if is_take_critical_damage
                else "outputDamage"
                if is_output_damage
                else "outputKnockDown"
                if is_output_knock_down
                else "outputHeal"
                if is_output_heal
                else "receiveHeal"
                if is_receive_heal
                else "poiseZero"
                if is_poise_zero
                else "afterOutputWeaknessTriggered"
                if is_after_output_weakness_triggered
                else "beforeCastSkill"
                if is_before_cast_skill
                else "skillEnd"
                if is_skill_end
                else "addedBuff"
                if is_added_buff
                else "beforeOutputBuff"
                if is_before_output_buff
                else "outputBuff"
                if is_output_buff
                else "afterKillEntity"
                if is_after_kill_entity
                else "finishedBuff"
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
        enable_once_sequences
        or during_enable_sequences
        or disable_sequences
        or start_sequences
        or finish_sequences
        or trigger_sequences
        or enhance_changed_sequences
        or after_enhance_sequences
    )
    if lifecycle_sequences and getattr(source, "sourceDeathFinish", None) is not None:
        raise ValueError(f"{path}: unsupported mixed Buff lifecycle and source-death events")
    if not lifecycle_sequences and ability_response_count == 0:
        return ""
    lines: list[str] = []
    if lifecycle_sequences:
        lines.append("lifecycleSequences: {")
        for lifecycle_name, sequences in (
            # 原生 OnEnable 先瞬时执行 OnBuffEnable，再启动 DuringBuffEnable；两组
            # 共用 Endaxis 的 enable 动作树可保持这个固定顺序，并由 disable 结束持续节点。
            ("enable", [*enable_once_sequences, *during_enable_sequences]),
            ("disable", disable_sequences),
            ("start", start_sequences),
            ("finish", finish_sequences),
            ("trigger", trigger_sequences),
            ("enhanceChanged", enhance_changed_sequences),
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
    current_ability_entity_id: str | None = None,
    ignored_buff_ids: frozenset[str] = frozenset(),
    damage_tags: tuple[str, ...] = (),
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
    invoked_child_trigger_events = tuple(
        event
        for event in source.eventActions
        if (
            (event.eventSource == "buff" and event.event == "OnBuffTrigger")
            or (event.eventSource == "ability" and event.event == "OnBuffEndsEarly")
        )
        and any(loop.skillCasts for loop in event.forEachActions)
    )
    enhance_has_other_events = any(
        event not in enhance_events and any(sequence.actions for sequence in event.sequences)
        for event in source.eventActions
    )
    if enhance_events and not enhance_has_other_events:
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
                current_ability_entity_id=current_ability_entity_id,
                invoked_child_context=invoked_child_context,
                damage_tags=damage_tags,
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
    if not invoked_child_trigger_events:
        return compile_inline_buff_event_responses(
            source,
            path,
            buff_owner_target=buff_owner_target,
            buff_definitions=buff_definitions,
            ignored_buff_ids=ignored_buff_ids,
            invoked_child_context=invoked_child_context,
            current_ability_entity_id=current_ability_entity_id,
            damage_tags=damage_tags,
            services=services,
        )
    if invoked_child_context is None:
        raise ValueError(f"{path}: invoked AbilityEntity child context is unavailable")
    if buff_owner_target == "currentAbilityEntity":
        raise ValueError(
            f"{path}: invoked AbilityEntity child target cannot be the host AbilityEntity"
        )
    if len(invoked_child_trigger_events) != 1:
        raise ValueError(f"{path}: expected one AbilityEntity trigger event")
    event = invoked_child_trigger_events[0]
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
    if event.eventSource == "ability":
        if (
            event.event != "OnBuffEndsEarly"
            or len(event.sequences) != 1
            or event.contextBuffTagQueries
            or len(event.contextBuffIdQueries) != 1
            or not event.contextBuffIdQueries[0]
            or len(event.createdBuffIds) != 1
        ):
            raise ValueError(f"{path}: unsupported AbilityEntity early-end invocation")
        presentation = buff_definitions.get(event.createdBuffIds[0])
        presentation_actions_are_cleanup = presentation is not None and all(
            not sequence.actions
            or (
                item.eventSource == "ability"
                and item.event == "OnOwnerDead"
                and all(
                    action.buffFinish is not None
                    and action.buffFinish.targetSource == "Owner"
                    and action.buffFinish.buffCheckType == "Environment"
                    and not action.buffFinish.isFinishedEarly
                    for action in sequence.actions
                )
            )
            for item in presentation.eventActions
            for sequence in item.sequences
        )
        if (
            presentation is None
            or presentation.attributeModifiers
            or presentation.damageModifiers
            or presentation.directDamageHits
            or presentation.inflictions
            or presentation.conditionalActions
            or presentation.resourceGains
            or not presentation_actions_are_cleanup
            or any(
                action_type not in {"IfElseAction", "EffectAction", "PlaySoundAction", "FinishBuffAdvanced"}
                for item in presentation.eventActions
                for action_type in item.orderedActionTypes
            )
        ):
            raise ValueError(f"{path}: early-end companion Buff is not presentation-only")
        sequence_priority = event.sequences[0].priority
        response_lines = [
            "abilityEventResponses: [",
            "  {",
            "    event: 'finishedBuff',",
            f"    priority: {sequence_priority},",
            "    sequence: sequence(",
            "      branch(",
            "        {",
            "          kind: 'all',",
            "          conditions: [",
            f"            {{ kind: 'eventBuffIdMatch', buffIds: {ts_inline_literal(event.contextBuffIdQueries[0])} }},",
            "            { kind: 'eventBuffEndedEarly' },",
            "          ],",
            "        },",
            "        sequence(",
            f"          {find_source},",
            "          forEachContextTarget(",
            f"            {ts_inline_literal(write.targetGroupKey)},",
            "            sequence(",
            *indent_source(
                "step('startCurrentAbilityEntityChildSkill', { childSkill: " + child_source + " })",
                14,
            ),
            "            ),",
            "          ),",
            "          step('finishCurrentBuff', { reason: 'other' }),",
            "        ),",
            "      ),",
            "    ),",
            "  },",
            "],",
        ]
        return "\n".join(response_lines)
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
                current_ability_entity_id=current_ability_entity_id,
                invoked_child_context=invoked_child_context,
                damage_tags=damage_tags,
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
    current_ability_entity_id: str | None = None,
    damage_tags: tuple[str, ...] = (),
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
    collect_resolved_damage_hits = services.collect_resolved_damage_hits
    compile_ability_entity_child_skill = services.compile_ability_entity_child_skill
    compile_logical_ability_entity_spawn = services.compile_logical_ability_entity_spawn
    load_ability_entity_template_evidence = services.load_ability_entity_template_evidence
    runtime_blackboard_keys = frozenset(item.key for item in source.blackboard)
    damage_tags = tuple(
        dict.fromkeys(
            (
                *damage_tags,
                *(
                    tuple(
                        require_list(
                            invoked_child_context[1].get("tags", []),
                            f"{path}.invokedChildContext.tags",
                        )
                    )
                    if invoked_child_context is not None
                    else ()
                ),
            )
        )
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

    for animation_index, animation in enumerate(
        getattr(source, "animationEndBuffApplications", ())
    ):
        application_source = compile_buff_application(
            animation.application,
            f"{path}.animationEndBuffApplications[{animation_index}].application",
            root_skill_context=False,
            input_target="enemy",
            buff_definitions=buff_definitions,
            buff_owner_target=buff_owner_target,
            current_buff_environment=True,
        )
        callback = once(
            ts_inline_literal(
                f"animation-end:{source.buffId}:{animation.sequenceIndex}:{animation.animationActionIndex}"
            ),
            atom(application_source),
        )
        compiled.append(
            (
                animation.naturalEndFrame,
                animation.sequenceIndex,
                animation.animationActionIndex,
                render_compiled_node(callback).splitlines(),
            )
        )

    for index, action in enumerate(source.auxiliaryActions):
        if (
            action.actionType == "SpawnAbilityEntity"
            and action.classification == "nonCombatAbilityEntity"
            and not action.nestedCombatActions
        ):
            continue
        if action.actionType == "SpawnAbilityEntity":
            if invoked_child_context is None:
                raise ValueError(
                    f"{path}.auxiliaryActions[{index}]: root skill context is unavailable"
                )
            matches = tuple(
                hit
                for hit in source.abilityEntityHits
                if hit.spawnFrame == action.startFrame
                and hit.abilityEntityId == action.sourceId.split(":", 1)[0]
                and hit.actionOrder
                and hit.actionOrder[-1] == action.actionIndex
            )
            if len(matches) != 1:
                raise ValueError(
                    f"{path}.auxiliaryActions[{index}]: AbilityEntity child was not resolved uniquely"
                )
            hit = matches[0]
            root_skill, config = invoked_child_context
            child_damage_hits = collect_resolved_damage_hits(
                SimpleNamespace(
                    skillId=f"{source.buffId}:scheduled:{index}",
                    directDamageHits=(),
                    projectileTriggeredSkills=(),
                    abilityEntityHits=(hit,),
                )
            )
            child_source = compile_ability_entity_child_skill(
                hit,
                root_skill,
                config,
                child_damage_hits,
                frozenset(item.key for item in hit.declaredBlackboard),
                input_target="enemy",
                buff_definitions=buff_definitions,
            )
            payload = hit.spawnPayload
            target_role = None
            if (
                buff_owner_target == "currentAbilityEntity"
                and payload.target is not None
                and payload.target.targetSource == "Owner"
                and services.target_reference_is_plain(payload.target)
            ):
                payload = replace(payload, target=None)
                target_role = "currentAbilityEntity"
            step_lines = compile_logical_ability_entity_spawn(
                payload,
                f"{path}.auxiliaryActions[{index}]",
                load_ability_entity_template_evidence(),
                child_source,
                target_role=target_role,
            ).splitlines()
            compiled.append(
                (action.startFrame, action.sequenceIndex, action.actionIndex, step_lines)
            )
            continue
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
    projected_interval_frames = {
        interval.tickFrames for interval in getattr(source, "intervalDamageHits", ())
    }
    for index, condition in enumerate(source.conditionalActions):
        if getattr(condition, "executionFrames", ()) in projected_interval_frames:
            continue
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
            current_ability_entity_id=current_ability_entity_id,
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
    for index, repeated in enumerate(getattr(source, "intervalDamageHits", ())):
        for tick_index, tick_frame in enumerate(repeated.tickFrames):
            compiled.append(
                (
                    tick_frame,
                    repeated.sequenceIndex,
                    repeated.damageActionIndex,
                    compile_damage_units_step(
                        repeated.damageUnits,
                        damage_tags,
                        f"{path}.intervalDamageHits[{index}]",
                        runtime_blackboard_keys,
                        encode_damage_step_key(
                            source.buffId,
                            "buffInterval",
                            (source.buffId,),
                            (
                                repeated.actionIndex,
                                tick_index,
                                repeated.damageActionIndex,
                            ),
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
    if getattr(source, "presentationOnlySwitchActionIndexes", ()):
        covered_actions.add("SwitchAction")
    if source.auxiliaryActions:
        covered_actions.add("CreateBuffAction")
    if getattr(source, "abilityEntityHits", ()) or any(
        action.actionType == "SpawnAbilityEntity"
        and action.classification == "nonCombatAbilityEntity"
        and not action.nestedCombatActions
        for action in source.auxiliaryActions
    ):
        covered_actions.add("SpawnAbilityEntity")
    if source.directDamageHits:
        covered_actions.add("DamageAction")
    if getattr(source, "intervalDamageHits", ()):
        covered_actions.update({"TickIntervalAction", "DamageAction"})
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
    if getattr(source, "animationEndBuffApplications", ()):
        covered_actions.update({"PlayAnimationAction", "CreateBuffAction"})
    projectile_launches = getattr(source, "projectileLaunches", ())
    if projectile_launches:
        unsupported_projectile_triggers = sorted(
            {
                trigger.event
                for launch in projectile_launches
                for trigger in launch.skillTriggers
                if trigger.event != "block"
            }
        )
        if unsupported_projectile_triggers:
            raise ValueError(
                f"{path}: Buff projectile triggers require combat projection: "
                f"{unsupported_projectile_triggers}"
            )
        # 固定木桩模型中的必定命中不会走原生 block 回调；投射物本体无其他战斗投影。
        covered_actions.add("LaunchProjectile")
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
