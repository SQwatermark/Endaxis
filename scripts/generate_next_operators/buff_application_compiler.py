"""编译单个 Buff 应用及可严格归约的 Aura 步骤。"""

from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Any, Callable, Literal, cast

from buff_definition_compiler import compile_inline_buff_definition
from source_models import (
    AuraActionSource,
    AuxiliaryActionSource,
    BuffDefinitionSource,
    ScalarSource,
    SkillSource,
)
from source_utils import indent_source, ts_inline_literal


@dataclass(frozen=True)
class BuffApplicationCompilerServices:
    """由入口注入目标证明、动态操作数与内联 Buff 行为编译。"""

    compile_condition_operand: Callable[..., Any]
    compile_inline_buff_behaviors: Callable[..., Any]
    compile_inline_buff_scheduled_sequences: Callable[..., Any]
    compile_buff_finish: Callable[..., Any]
    resolve_fixed_combat_target: Callable[..., Any]


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
        "enemy",
        "party",
        "partyExceptCaster",
        "casterAndControlledOperator",
        "casterAndLowestHealthRatioOperatorExceptCaster",
        "currentAbilityEntity",
        "eventTarget",
    ] | None = None,
    input_target: Literal["caster", "enemy"] | None = None,
    allow_dynamic_count: bool = False,
    current_ability_entity_owner: bool = False,
    current_ability_entity_target: bool = False,
    current_ability_entity_id: str | None = None,
    target_finder_type: str | None = None,
    target_validator_types: tuple[str, ...] = (),
    target_post_processor_types: tuple[str, ...] = (),
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    ignored_buff_ids: frozenset[str] = frozenset(),
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
    current_event_target: bool = False,
    finish_by_action: bool = False,
    services: BuffApplicationCompilerServices,
    damage_tags: tuple[str, ...] = (),
) -> str:
    """编译已闭环的单个 Buff 施加；动作级公共字段由根动作和条件分支共同提供。"""
    compile_condition_operand = services.compile_condition_operand
    compile_inline_buff_behaviors = services.compile_inline_buff_behaviors
    compile_inline_buff_scheduled_sequences = services.compile_inline_buff_scheduled_sequences
    resolve_fixed_combat_target = services.resolve_fixed_combat_target
    if (count.blackboardKey is not None or count.value != 1) and not allow_dynamic_count:
        raise ValueError(f"{path}: only a literal application count of 1 is supported")
    # 根 SkillData 中 ActionSource 与 ActionOwner 都是施法干员；嵌套动作尚不能做相同假设。
    supported_sources = (
        {"ActionSource", "ActionOwner"}
        if root_skill_context or current_buff_environment
        else {"ActionSource"}
    )
    source = None
    if buff_source == "InputTarget" and (root_skill_context or input_target == "enemy"):
        source = "enemy"
    elif buff_source == "ContextTarget" and buff_source_context_key == "smart_target":
        source = "enemy"
    elif buff_source == "ActionOwner" and current_ability_entity_owner:
        source = "currentAbilityEntity"
    elif buff_source not in supported_sources:
        raise ValueError(f"{path}: unsupported Buff source {buff_source!r}")
    target: Literal[
        "caster",
        "enemy",
        "party",
        "partyExceptCaster",
        "casterAndControlledOperator",
        "casterAndLowestHealthRatioOperatorExceptCaster",
        "currentAbilityEntity",
    ] | None
    if target_source == "Context" and context_application_target is not None:
        target = context_application_target
    elif (
        target_source == "InstantSearch"
        and target_finder_type == "CharacterTeamFinder"
        and not target_validator_types
        and not target_post_processor_types
    ):
        target = "party"
    elif (
        target_source == "InstantSearch"
        and target_finder_type == "CharacterTeamFinder"
        and target_validator_types == ("ExcludeOwnerValidator",)
        and not target_post_processor_types
    ):
        target = "partyExceptCaster"
    elif (
        target_source == "InstantSearch"
        and target_finder_type in {"HitBoxFinder", "MainTargetFinder"}
        and not target_validator_types
        and not target_post_processor_types
    ):
        # 固定单敌人模型中，无额外筛选的即时命中盒或当前伤害主目标只可能返回该敌人。
        target = "enemy"
    elif (
        current_buff_environment
        and buff_owner_target is not None
        and target_source == "Owner"
        and not target_group_key
    ):
        target = buff_owner_target
    elif (
        current_buff_environment
        and current_event_target
        and target_source == "Target"
        and not target_group_key
    ):
        target = "eventTarget"
    elif (
        current_buff_environment
        and not current_event_target
        and buff_owner_target is not None
        and target_source == "Target"
        and not target_group_key
    ):
        # Buff 生命周期动作以宿主作为 InputTarget；TargetSource.Target 解析该输入句柄。
        target = buff_owner_target
    elif target_source == "Owner" and current_ability_entity_owner:
        target = "currentAbilityEntity"
    elif (
        target_source == "Target"
        and not target_group_key
        and current_ability_entity_target
    ):
        target = "currentAbilityEntity"
    else:
        target = resolve_fixed_combat_target(
            target_source,
            target_group_key,
            root_skill_context=root_skill_context,
            input_target="enemy" if root_skill_context else input_target,
        )
    if target is None:
        raise ValueError(
            f"{path}: unsupported Buff target "
            f"{target_source!r}/{target_group_key!r}"
        )
    lines = [
        "step('applyBuff', {",
        f"  buffId: {ts_inline_literal(buff_id)},",
    ]
    # 值 None 是编译期递归回边哨兵：完整定义已在外层，
    # 此处只保留 ID，避免自引用 Buff 无限内联。
    if buff_definitions is not None and buff_definitions.get(buff_id, False) is None:
        buff_definitions = None
    if buff_definitions is not None:
        definition = buff_definitions.get(buff_id)
        if definition is None:
            raise ValueError(f"{path}: Buff definition {buff_id!r} was not resolved")
        has_event_sequences = (
            bool(getattr(definition, "comboQteActions", ()))
            or bool(definition.eventActions)
            or any(
                sequence.actions
                for event in definition.eventActions
                for sequence in event.sequences
            )
            or any(
                loop.skillCasts
                for event in definition.eventActions
                for loop in event.forEachActions
            )
        )
        has_scheduled_sequences = any(
            getattr(definition, field, ())
            for field in (
                "directDamageHits",
                "intervalDamageHits",
                "conditionalActions",
                "blackboardCalculations",
                "blackboardMutations",
                "buffBlackboardReads",
                "buffFinishes",
                "resourceGains",
                "auxiliaryActions",
                "combatActions",
            )
        )
        nested_buff_definitions = {**buff_definitions, definition.buffId: None}
        def compile_event_behaviors(
            event_source: BuffDefinitionSource, event_path: str
        ) -> str:
            # 集合施加只决定创建多少个实例；每个实例进入生命周期后，
            # Owner 都由运行时切换为该 Buff 的实际宿主。
            lifecycle_owner_target = "caster" if target in {
                "party",
                "partyExceptCaster",
                "casterAndControlledOperator",
                "casterAndLowestHealthRatioOperatorExceptCaster",
            } else target
            return compile_inline_buff_behaviors(
                event_source,
                event_path,
                buff_owner_target=cast(
                    Literal["caster", "enemy", "currentAbilityEntity"],
                    lifecycle_owner_target,
                ),
                buff_definitions=nested_buff_definitions,
                invoked_child_context=invoked_child_context,
                current_ability_entity_id=current_ability_entity_id,
                ignored_buff_ids=ignored_buff_ids,
                damage_tags=damage_tags,
            )

        definition_lines = compile_inline_buff_definition(
            definition,
            path,
            (
                compile_event_behaviors
                if has_event_sequences
                else None
            ),
            (
                lambda scheduled_source, scheduled_path: compile_inline_buff_scheduled_sequences(
                    scheduled_source,
                    scheduled_path,
                    buff_owner_target=cast(
                        Literal["caster", "enemy", "currentAbilityEntity"],
                        "caster"
                        if target
                        in {
                            "party",
                            "partyExceptCaster",
                            "casterAndControlledOperator",
                            "casterAndLowestHealthRatioOperatorExceptCaster",
                        }
                        else target,
                    ),
                    buff_definitions=nested_buff_definitions,
                    invoked_child_context=invoked_child_context,
                    current_ability_entity_id=current_ability_entity_id,
                    damage_tags=damage_tags,
                )
                if has_scheduled_sequences
                else None
            ),
        ).splitlines()
        lines.append("  definition: {")
        lines.extend(f"    {line}" for line in definition_lines)
        lines.append("  },")
    lines.extend([
        f"  target: {ts_inline_literal(target)},",
        "  inheritSourceSkillCastInfo: "
        f"{ts_inline_literal(inherit_source_skill_cast_info)},",
    ])
    if finish_by_action:
        lines.append("  finishByAction: true,")
    if source is not None:
        lines.append(f"  source: {ts_inline_literal(source)},")
    if count.blackboardKey is not None or count.value != 1:
        lines.append(f"  count: {compile_condition_operand(count, f'{path}.count')},")
    if blackboard_assignments:
        lines.append("  blackboardAssignments: {")
        for key, value in blackboard_assignments.items():
            lines.append(
                f"    {ts_inline_literal(key)}: "
                f"{compile_condition_operand(value, f'{path}.blackboardAssignments.{key}')},"
            )
        lines.append("  },")
    lines.append("})")
    return "\n".join(lines)

def compile_buff_application(
    action: AuxiliaryActionSource,
    path: str,
    *,
    root_skill_context: bool = True,
    context_application_target: Literal[
        "enemy",
        "party",
        "partyExceptCaster",
        "casterAndControlledOperator",
        "casterAndLowestHealthRatioOperatorExceptCaster",
        "currentAbilityEntity",
    ] | None = None,
    input_target: Literal["caster", "enemy"] | None = None,
    current_ability_entity_owner: bool = False,
    current_ability_entity_id: str | None = None,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    ignored_buff_ids: frozenset[str] = frozenset(),
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
    services: BuffApplicationCompilerServices,
    damage_tags: tuple[str, ...] = (),
) -> str:
    """编译根时间轴上已拆分为单 Buff 的 CreateBuffAction。"""
    if action.actionType != "CreateBuffAction" or action.count is None:
        raise ValueError(f"{path}: expected parsed CreateBuffAction")
    if action.buffSource is None or action.inheritSourceSkillCastInfo is None:
        raise ValueError(f"{path}: incomplete CreateBuffAction source facts")
    return compile_buff_application_values(
        buff_id=action.sourceId,
        blackboard_assignments=action.blackboardAssignments,
        target_source=action.targetSource,
        target_group_key=action.targetGroupKey,
        count=action.count,
        buff_source=action.buffSource,
        buff_source_context_key=action.buffSourceContextKey,
        inherit_source_skill_cast_info=action.inheritSourceSkillCastInfo,
        root_skill_context=root_skill_context,
        context_application_target=context_application_target,
        input_target=input_target,
        current_ability_entity_owner=current_ability_entity_owner,
        current_ability_entity_id=current_ability_entity_id,
        target_finder_type=action.targetFinderType,
        target_validator_types=action.targetValidatorTypes,
        target_post_processor_types=action.targetPostProcessorTypes,
        buff_definitions=buff_definitions,
        invoked_child_context=invoked_child_context,
        ignored_buff_ids=ignored_buff_ids,
        buff_owner_target=buff_owner_target,
        current_buff_environment=current_buff_environment,
        # 当前只在根技能时间轴保存动作区间；嵌套能力实体/事件序列还没有
        # 同一原生动作的结束帧边界，不能把 autoFinishByAction 提前投影进去。
        finish_by_action=root_skill_context and action.autoFinishByAction is True,
        path=path,
        services=services,
        damage_tags=damage_tags,
    )


def compile_aura_action(
    aura: AuraActionSource,
    path: str,
    *,
    buff_definitions: dict[str, BuffDefinitionSource] | None,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    current_ability_entity_id: str | None = None,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    current_buff_environment: bool = False,
    services: BuffApplicationCompilerServices,
) -> str:
    """在零空间模型中，把无筛选敌方或友方 Aura 归约为动作区间 Buff。"""
    object_type_values = {
        "All": -1,
        "Invalid": 1,
        "Character": 8,
        "Enemy": 16,
        "Interactive": 32,
        "Projectile": 64,
        "FactoryRegion": 128,
        "Npc": 256,
        "AbilityEntity": 512,
        "CinematicEntity": 1024,
        "RemoteFactoryEntity": 2048,
        "Creature": 4096,
        "GodEntity": 8192,
        "EnemyPart": 16384,
        "EnemyAll": 16400,
        "SocialBuilding": 32768,
    }

    def target_filter_allows_object_type(mask: str | int, target_mask: int) -> bool:
        numeric_mask = object_type_values.get(mask) if isinstance(mask, str) else mask
        if numeric_mask is None:
            raise ValueError(f"{path}: unknown Aura ObjectType {mask!r}")
        return (numeric_mask & target_mask) != 0

    target_filter = aura.targetFilter
    timeline_aura = (
        aura.activationSource == "timeline"
        and aura.startFrame is not None
        and aura.endFrame is not None
    )
    buff_enable_aura = (
        current_buff_environment
        and aura.activationSource == "buffEvent"
        and aura.activationEvent == "DuringBuffEnable"
        and aura.startFrame is None
        and aura.endFrame is None
    )
    if not (timeline_aura or buff_enable_aura):
        raise ValueError(f"{path}: unsupported Aura activation boundary")
    common_fixed_area = (
        aura.auraType in {"GlobalAura", "RangedAura"}
        and aura.root.targetSource == "Owner"
        and not aura.root.targetGroupKey
        and not aura.root.validatorTypes
        and not aura.root.postProcessorTypes
        and aura.excludeColliderOptions == 0
        and not target_filter.filterSlot
        and not target_filter.filterGameplayTag
        and not target_filter.tagIds
        and not aura.includeUnmarkable
        and (
            aura.buffSource == "ActionSource"
            or (buff_enable_aura and aura.buffSource == "ActionOwner")
        )
        and not aura.overrideBuffIconDuration
        and not aura.actionInAuraOnlyMainOperator
        and not aura.actionInAuraOnlyGuard
        and not aura.actionWhenExitAuraOnlyMainOperator
        and not aura.actionWhenExitAuraOnlyGuard
    )
    enemy_faction = (
        target_filter.autoSetTargetFaction
        and target_filter.factionTarget == "Anti"
    ) or (
        not target_filter.autoSetTargetFaction
        and target_filter.factionTarget == "Anti"
        and target_filter.factionTargetType == "Bad"
    )
    ally_faction = (
        target_filter.autoSetTargetFaction
        and target_filter.factionTarget == "Ally"
    ) or (
        not target_filter.autoSetTargetFaction
        and target_filter.factionTarget == "Anti"
        and target_filter.factionTargetType == "Good"
    )
    if (
        common_fixed_area
        and target_filter.autoSetTargetFaction
        and enemy_faction
        and not aura.actionWhenExitAuraTypes
        and aura.excludeOwner
        and aura.targetObjectType == 0
        and aura.limitInfluenceCountPerTarget
        and aura.maxInfluenceCountPerTarget == 1
        and not aura.buffs
        and aura.actionInAuraTypes == ("AirborneAction", "DamageAction")
        and aura.nestedCombatActions == ("DamageAction",)
        and len(aura.airborneOutputs) == 1
    ):
        airborne = aura.airborneOutputs[0]
        if not (
            airborne.source.targetSource == "Owner"
            and not airborne.source.targetGroupKey
            and not airborne.source.validatorTypes
            and not airborne.source.postProcessorTypes
            and airborne.target.targetSource == "Target"
            and airborne.target.targetGroupKey == "tar"
            and not airborne.target.validatorTypes
            and not airborne.target.postProcessorTypes
            and not airborne.forceAirborne
            and airborne.floatingDuration.value == 0
            and airborne.floatingDuration.blackboardKey is None
            and airborne.floatingHeight.value == 0
            and airborne.floatingHeight.blackboardKey is None
            and airborne.speedFactorMultiplier == 1
            and airborne.faceDirectionType == "TargetToSource"
            and airborne.immobilizedTime == 1
            and not airborne.isExtra
            and airborne.deadOption == "AllValid"
            and airborne.returnTrueWhen == "Always"
        ):
            raise ValueError(f"{path}: unsupported AirborneAction payload")
        # DamageAction is independently projected by the recursive hit parser at the same frame.
        return "step('outputAirborne', { target: 'enemy' })"
    application_target: Literal["enemy", "party", "partyExceptCaster"] | None = None
    if (
        common_fixed_area
        and enemy_faction
        and aura.targetObjectType in {0, "Enemy", "EnemyAll"}
        and (
            not target_filter.filterObjectType
            or target_filter_allows_object_type(
                target_filter.objectType, object_type_values["EnemyAll"]
            )
        )
    ):
        application_target = "enemy"
    elif (
        common_fixed_area
        and ally_faction
        and aura.targetObjectType in {0, "Character"}
        and (
            not target_filter.filterObjectType
            or target_filter_allows_object_type(
                target_filter.objectType, object_type_values["Character"]
            )
        )
    ):
        application_target = "partyExceptCaster" if aura.excludeOwner else "party"
    if not (
        application_target is not None
        and (
            not aura.limitInfluenceCountPerTarget
            or aura.maxInfluenceCountPerTarget == 1
        )
        and (
            not aura.actionInAuraTypes
            or (
                aura.actionInAuraTypes == ("FinishBuffAdvanced",)
                and len(aura.actionInAuraBuffFinishes) == 1
            )
        )
        and (
            not aura.actionWhenExitAuraTypes
            or (
                aura.actionWhenExitAuraTypes == ("CreateBuffAction",)
                and len(aura.actionWhenExitAuraBuffApplications) == 1
            )
            or (
                set(aura.actionWhenExitAuraTypes) == {"FinishBuffAdvanced"}
                and len(aura.actionWhenExitAuraBuffFinishes)
                == len(aura.actionWhenExitAuraTypes)
            )
        )
        and set(aura.nestedCombatActions).issubset(
            set(aura.actionInAuraTypes) | set(aura.actionWhenExitAuraTypes)
        )
        and not aura.airborneOutputs
    ):
        raise ValueError(
            f"{path}: Aura target or lifecycle shape is not closed "
            f"(autoFaction={target_filter.autoSetTargetFaction!r}, "
            f"faction={target_filter.factionTarget!r}/"
            f"{target_filter.factionTargetType!r}, target={application_target!r}, "
            f"in={aura.actionInAuraTypes!r}/"
            f"{len(aura.actionInAuraBuffFinishes)}, "
            f"exit={aura.actionWhenExitAuraTypes!r}/"
            f"{len(aura.actionWhenExitAuraBuffApplications)}, "
            f"nested={aura.nestedCombatActions!r})"
        )
    if not aura.buffs:
        raise ValueError(f"{path}: Aura has no Buff inputs")
    if aura.actionWhenExitAuraBuffFinishes:
        expected_buff_ids = {buff.buffId for buff in aura.buffs}
        finished_buff_ids: set[str] = set()
        for index, finish in enumerate(aura.actionWhenExitAuraBuffFinishes):
            if not (
                finish.targetSource == "Target"
                and not finish.targetGroupKey
                and finish.buffCheckType == "Id"
                and finish.buffIds
                and not finish.buffTagIds
                and finish.finishAll
                and not finish.limitSource
                and not finish.isFinishedEarly
                and not finish.isAbsorbed
            ):
                raise ValueError(
                    f"{path}.actionWhenExitAura.buffFinishes[{index}]: "
                    "unsupported Aura exit cleanup"
                )
            finished_buff_ids.update(finish.buffIds)
        if finished_buff_ids != expected_buff_ids:
            raise ValueError(
                f"{path}.actionWhenExitAura.buffFinishes: cleaned Buff IDs "
                f"{sorted(finished_buff_ids)!r} do not match Aura Buff IDs "
                f"{sorted(expected_buff_ids)!r}"
            )
    compiled: list[str] = []
    if aura.actionInAuraBuffFinishes:
        compiled.append(
            services.compile_buff_finish(
                replace(
                    aura.actionInAuraBuffFinishes[0],
                    targetSource="Context",
                    targetGroupKey="",
                ),
                f"{path}.actionInAura.buffFinishes[0]",
                context_finish_target=application_target,
            )
        )
    compiled.extend(
        compile_buff_application_values(
            buff_id=buff.buffId,
            blackboard_assignments=buff.blackboardAssignments,
            target_source="Context",
            target_group_key="",
            count=ScalarSource(1, None, None),
            buff_source=aura.buffSource,
            inherit_source_skill_cast_info=aura.inheritSourceSkillCastId,
            root_skill_context=True,
            path=f"{path}.buffs[{index}]",
            context_application_target=application_target,
            input_target=("enemy" if application_target == "enemy" else None),
            buff_definitions=buff_definitions,
            invoked_child_context=invoked_child_context,
            current_ability_entity_id=current_ability_entity_id,
            buff_owner_target=buff_owner_target,
            current_buff_environment=current_buff_environment,
            finish_by_action=True,
            services=services,
        )
        for index, buff in enumerate(aura.buffs)
    )
    if len(compiled) == 1:
        return compiled[0]
    lines = ["sequence("]
    for item in compiled:
        item_lines = indent_source(item, 2)
        item_lines[-1] += ","
        lines.extend(item_lines)
    lines.append(")")
    return "\n".join(lines)


def compile_aura_exit_action(
    aura: AuraActionSource,
    path: str,
    *,
    buff_definitions: dict[str, BuffDefinitionSource] | None,
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None,
    ignored_buff_ids: frozenset[str] = frozenset(),
    services: BuffApplicationCompilerServices,
) -> str | None:
    """编译零空间 Aura 在结束帧必然执行的离开区域 Buff 动作。"""
    if not aura.actionWhenExitAuraBuffApplications:
        return None
    target_filter = aura.targetFilter
    if (
        not target_filter.autoSetTargetFaction
        and target_filter.factionTarget == "Anti"
        and target_filter.factionTargetType == "Bad"
    ):
        application_target: Literal["enemy", "partyExceptCaster"] = "enemy"
    elif (
        not target_filter.autoSetTargetFaction
        and target_filter.factionTarget == "Anti"
        and target_filter.factionTargetType == "Good"
        and aura.excludeOwner
    ):
        application_target = "partyExceptCaster"
    else:
        raise ValueError(f"{path}: Aura exit target is not closed")
    sources: list[str] = []
    for application_index, application in enumerate(
        aura.actionWhenExitAuraBuffApplications
    ):
        for buff_index, buff in enumerate(application.buffs):
            if buff.buffId in ignored_buff_ids:
                continue
            sources.append(
                compile_buff_application_values(
                    buff_id=buff.buffId,
                    blackboard_assignments=buff.blackboardAssignments,
                    target_source=("Target" if application_target == "enemy" else "Context"),
                    target_group_key="",
                    count=application.count,
                    buff_source=application.buffSource,
                    buff_source_context_key=application.buffSourceContextKey,
                    inherit_source_skill_cast_info=application.inheritSourceSkillCastInfo,
                    root_skill_context=True,
                    path=(
                        f"{path}.actionWhenExitAura.buffApplications[{application_index}]"
                        f".buffs[{buff_index}]"
                    ),
                    context_application_target=(
                        application_target if application_target == "partyExceptCaster" else None
                    ),
                    input_target=("enemy" if application_target == "enemy" else None),
                    buff_definitions=buff_definitions,
                    invoked_child_context=invoked_child_context,
                    services=services,
                )
            )
    if not sources:
        return None
    if len(sources) == 1:
        return sources[0]
    lines = ["sequence("]
    for source in sources:
        source_lines = indent_source(source, 2)
        source_lines[-1] += ","
        lines.extend(source_lines)
    lines.append(")")
    return "\n".join(lines)
