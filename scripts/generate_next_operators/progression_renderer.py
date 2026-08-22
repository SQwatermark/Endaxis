"""将干员天赋与潜能的解包事实渲染为 Next DSL 片段。

该模块只负责养成效果转换；调用方必须先完成技能来源解析，并提供严格校验过的 TableCfg 表。
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Any, Callable, Literal

from buff_definition_compiler import compile_inline_buff_definition
from passive_skill_parser import PassiveSkillSource
from source_models import BuffDefinitionSource, SkillSource
from source_utils import (
    require_dict,
    require_list,
    require_non_negative_int,
    require_number,
    table_row,
    ts_inline_literal,
)

__all__ = [
    "ATTRIBUTE_TYPE_SEMANTICS",
    "BASE_PANEL_ATTRIBUTE_TYPES",
    "BUILD_ATTRIBUTE_TYPES",
    "MODIFIER_TYPE_NAMES",
    "STATIC_DAMAGE_INCREASE_ATTRIBUTE_TYPES",
    "ProgressionConversionIssue",
    "StaticAttributeProgressionResult",
    "UltimateCostMultiplierResult",
    "parse_ultimate_cost_multiplier",
    "parse_static_attribute_progression",
    "render_potentials",
    "render_talents",
    "skill_id_by_key",
]


BuildAttributeName = Literal["strength", "agility", "intellect", "will"]
BasePanelStatName = Literal["health", "defense", "criticalRate", "artsIntensity"]
BasePanelOperation = Literal["flat", "percent"]
StaticDamageIncreaseTarget = Literal[
    "normalAttack",
    "battleSkill",
    "physical",
    "electric",
    "cryo",
]
BUILD_ATTRIBUTE_TYPES: dict[int, BuildAttributeName] = {
    39: "strength",
    40: "agility",
    41: "intellect",
    42: "will",
}
# value 的含义由原生公式槽决定：5 是基础加算，6 是基础倍率增量。
BASE_PANEL_ATTRIBUTE_TYPES: dict[
    int,
    tuple[BasePanelStatName, BasePanelOperation, int],
] = {
    1: ("health", "percent", 6),
    3: ("defense", "flat", 5),
    9: ("criticalRate", "flat", 5),
    87: ("artsIntensity", "flat", 5),
}
STATIC_DAMAGE_INCREASE_ATTRIBUTE_TYPES: dict[int, StaticDamageIncreaseTarget] = {
    17: "normalAttack",
    32: "battleSkill",
    50: "physical",
    52: "electric",
    53: "cryo",
}

# 1.4.4 GameplayTagConfig: Skill/Character/Common/SpellStatus/Corrupt.
COLLECTED_BUFF_REACTION_TAGS = {-421286163: "corrosion"}


def collected_buff_reaction_projection(
    source: PassiveSkillSource,
    buff_definitions: dict[str, BuffDefinitionSource],
) -> tuple[str, str, str] | None:
    """证明常驻被动只把两个输入黑板值投影为反应持续时间/效能强化。"""
    if source.passive_type != "AddBuff" or len(source.buffs) != 1:
        return None
    application = source.buffs[0]
    definition = buff_definitions.get(application.buff_id)
    lifecycle = None if definition is None else getattr(definition, "lifecycle", None)
    if lifecycle is None or lifecycle.lifeType != "Infinity":
        return None
    if (
        definition.attributeModifiers
        or definition.damageModifiers
        or definition.directDamageHits
        or definition.inflictions
        or definition.conditionalActions
        or definition.blackboardCalculations
        or definition.blackboardMutations
        or definition.buffFinishes
        or definition.resourceGains
        or definition.auraActions
        or definition.invokedAbilityEntitySkills
        or len(definition.eventActions) != 1
    ):
        return None
    event = definition.eventActions[0]
    modifier = event.collectedBuffReactionModifier
    if modifier is None:
        return None
    reaction = COLLECTED_BUFF_REACTION_TAGS.get(modifier.buffTagId)
    if reaction is None:
        return None
    assignments = {item.target_key: item.input_key for item in application.assignments}
    if len(assignments) != len(application.assignments):
        return None
    duration_input = assignments.get(modifier.durationAdditionKey)
    effectiveness_input = assignments.get(modifier.effectivenessAdditionKey)
    if duration_input is None or effectiveness_input is None:
        return None
    return reaction, duration_input, effectiveness_input

# 名称来自 1.4.4 元数据生成的 AttributeType；semantic 描述该值实际进入的面板或战斗维度。
ATTRIBUTE_TYPE_SEMANTICS: dict[int, tuple[str, str]] = {
    1: ("MaxHp", "panel.maxHealth"),
    3: ("Def", "panel.defense"),
    9: ("CriticalRate", "combat.criticalRate"),
    17: ("NormalAttackDamageIncrease", "combat.normalAttackDamageIncrease"),
    29: ("HealOutputIncrease", "combat.healOutputIncrease"),
    32: ("NormalSkillDamageIncrease", "combat.battleSkillDamageIncrease"),
    39: ("Str", "panel.strength"),
    40: ("Agi", "panel.agility"),
    41: ("Wisd", "panel.intellect"),
    42: ("Will", "panel.will"),
    50: ("PhysicalDamageIncrease", "combat.physicalDamageIncrease"),
    52: ("PulseDamageIncrease", "combat.electricDamageIncrease"),
    53: ("CrystDamageIncrease", "combat.cryoDamageIncrease"),
    60: ("EtherDamageTakenScalar", "combat.etherDamageTakenScalar"),
    87: ("PhysicalAndSpellInflictionEnhance", "panel.artsIntensity"),
}
SKILL_BB_MODIFIER_OPERATIONS = {
    1: "add",
    2: "multiply",
    3: "assign",
}

MODIFIER_TYPE_NAMES = {
    0: "Addition",
    1: "Multiplier",
    3: "FinalAddition",
    4: "FinalMultiplier",
    5: "BaseAddition",
    6: "BaseMultiplier",
    7: "BaseFinalAddition",
    8: "BaseFinalMultiplier",
    9: "None",
    10: "Enum",
}
EFFECT_ENTRY_FIELDS = {
    "activeCondition",
    "attachBuff",
    "attachSkill",
    "attrModifier",
    "modifyType",
    "skillBbModifier",
    "skillParamModifier",
}
ATTRIBUTE_MODIFIER_FIELDS = {
    "attrType",
    "attrValue",
    "modifierType",
    "modifyAttributeType",
}


@dataclass(frozen=True)
class ProgressionConversionIssue:
    """宽松转换保留的稳定缺口；详细来源路径只进入审计产物。"""

    code: str
    path: str
    detail: str


@dataclass(frozen=True)
class StaticAttributeProgressionResult:
    """潜能静态属性的可转换部分及未转换能力。"""

    build_attribute_modifiers: tuple[tuple[BuildAttributeName, int], ...]
    base_panel_stat_modifiers: tuple[
        tuple[BasePanelStatName, BasePanelOperation, int | float], ...
    ]
    static_damage_increase_modifiers: tuple[
        tuple[StaticDamageIncreaseTarget, int | float], ...
    ]
    issues: tuple[ProgressionConversionIssue, ...]
    missing_capabilities: tuple[Literal["potentialEffects"], ...]


@dataclass(frozen=True)
class UltimateCostMultiplierResult:
    """由完整原生效果证明的终结技能量费用乘算。"""

    multiplier: int | float
    target_skill_ids: tuple[str, ...]


def _compile_plain_buff_definition(
    source: BuffDefinitionSource,
    path: str,
    _definitions: dict[str, BuffDefinitionSource],
) -> str:
    return compile_inline_buff_definition(source, path)


def _effect_payload_kinds(entry: dict[str, Any], path: str) -> tuple[str, ...]:
    kinds: list[str] = []
    if require_list(entry.get("activeCondition"), f"{path}.activeCondition"):
        kinds.append("activeCondition")
    if require_dict(entry.get("attachBuff"), f"{path}.attachBuff").get("buffId"):
        kinds.append("attachBuff")
    if require_dict(entry.get("attachSkill"), f"{path}.attachSkill").get("skillId"):
        kinds.append("attachSkill")
    if require_dict(entry.get("attrModifier"), f"{path}.attrModifier").get("attrType"):
        kinds.append("attrModifier")
    if require_dict(entry.get("skillBbModifier"), f"{path}.skillBbModifier").get("skillId"):
        kinds.append("skillBbModifier")
    if require_dict(entry.get("skillParamModifier"), f"{path}.skillParamModifier").get(
        "skillId"
    ):
        kinds.append("skillParamModifier")
    return tuple(kinds)


def _render_passive_skill_entry(
    skill_id: str,
    source: PassiveSkillSource,
    values_by_key: dict[str, int | float | list[int | float]],
    buff_definitions: dict[str, BuffDefinitionSource],
    compile_buff_definition: Callable[
        [BuffDefinitionSource, str, dict[str, BuffDefinitionSource]], str
    ],
    compile_event_listener: Callable[
        [object, str, frozenset[str], str, dict[str, BuffDefinitionSource]], str | None
    ] | None,
) -> list[str]:
    lines = ["    {", f"      key: {ts_inline_literal(skill_id)},"]
    if values_by_key:
        lines.append("      blackboard: {")
        for key, value in values_by_key.items():
            lines.append(f"        {ts_inline_literal(key)}: {ts_inline_literal(value)},")
        lines.append("      },")
    lines.append("      enableSequence: sequence(")
    for application in source.buffs:
        definition = buff_definitions.get(application.buff_id)
        if definition is None:
            raise ValueError(
                f"passive {skill_id!r}: missing resolved Buff {application.buff_id!r}"
            )
        lines.extend(
            [
                "        step('applyBuff', {",
                f"          buffId: {ts_inline_literal(application.buff_id)},",
                "          definition: {",
                *(
                    "            " + line
                    for line in compile_buff_definition(
                        definition,
                        f"passive {skill_id!r}",
                        buff_definitions,
                    ).splitlines()
                ),
                "          },",
                "          target: 'caster',",
                "          inheritSourceSkillCastInfo: false,",
            ]
        )
        if application.assignments:
            lines.append("          blackboardAssignments: {")
            for assignment in application.assignments:
                lines.append(
                    "            "
                    f"{ts_inline_literal(assignment.target_key)}: "
                    f"{{ kind: 'blackboard', key: {ts_inline_literal(assignment.input_key)} }},"
                )
            lines.append("          },")
        lines.append("        }),")
    if source.event_listeners:
        if compile_event_listener is None:
            raise ValueError(f"passive {skill_id!r}: event listener compiler is unavailable")
        for index, listener in enumerate(source.event_listeners):
            compiled_listener = compile_event_listener(
                listener,
                f"passive {skill_id!r}.eventListeners[{index}]",
                frozenset(source.declared_blackboard_keys),
                skill_id,
                buff_definitions,
            )
            if compiled_listener is None:
                continue
            listener_lines = compiled_listener.splitlines()
            listener_lines[-1] += ","
            lines.extend(f"        {line}" for line in listener_lines)
    lines.append("      ),")
    lines.append("    },")
    return lines


def render_base_passive_skills(
    passive_skills: dict[str, PassiveSkillSource],
    buff_definitions: dict[str, BuffDefinitionSource],
    compile_buff_definition: Callable[
        [BuffDefinitionSource, str, dict[str, BuffDefinitionSource]], str
    ] = _compile_plain_buff_definition,
    compile_event_listener: Callable[
        [object, str, frozenset[str], str, dict[str, BuffDefinitionSource]], str | None
    ] | None = None,
) -> str | None:
    if not passive_skills:
        return None
    lines = ["  passiveSkills: ["]
    for skill_id, source in passive_skills.items():
        lines.extend(
            _render_passive_skill_entry(
                skill_id,
                source,
                dict(source.blackboard_values),
                buff_definitions,
                compile_buff_definition,
                compile_event_listener,
            )
        )
    lines.append("  ],")
    return "\n".join(lines)


def _render_attached_passive_skills(
    effect_entries: list[tuple[str, list[dict[str, Any]]]],
    passive_skills: dict[str, PassiveSkillSource],
    buff_definitions: dict[str, BuffDefinitionSource],
    compile_buff_definition: Callable[
        [BuffDefinitionSource, str, dict[str, BuffDefinitionSource]], str
    ] = _compile_plain_buff_definition,
    compile_event_listener: Callable[
        [object, str, frozenset[str], str, dict[str, BuffDefinitionSource]], str | None
    ] | None = None,
) -> str | None:
    """将各等级同一 attachSkill 合并为一个按等级取值的常驻被动。"""
    if not effect_entries:
        return None
    skill_id: str | None = None
    value_keys: tuple[str, ...] | None = None
    values_by_key: dict[str, list[int | float]] = {}
    for effect_id, data_list in effect_entries:
        if len(data_list) != 1:
            return None
        entry_path = f"{effect_id}.dataList[0]"
        entry = data_list[0]
        if _effect_payload_kinds(entry, entry_path) != ("attachSkill",):
            return None
        attach = require_dict(entry.get("attachSkill"), f"{entry_path}.attachSkill")
        current_skill_id = attach.get("skillId")
        if not isinstance(current_skill_id, str) or not current_skill_id:
            raise ValueError(f"{entry_path}.attachSkill.skillId: expected non-empty skill id")
        if skill_id is None:
            skill_id = current_skill_id
        elif skill_id != current_skill_id:
            raise ValueError(f"{effect_id}: talent levels attach different passive skills")

        level_values: dict[str, int | float] = {}
        for index, raw_value in enumerate(
            require_list(attach.get("blackboard"), f"{entry_path}.attachSkill.blackboard")
        ):
            value_path = f"{entry_path}.attachSkill.blackboard[{index}]"
            item = require_dict(raw_value, value_path)
            key = item.get("key")
            if not isinstance(key, str) or not key:
                raise ValueError(f"{value_path}.key: expected non-empty string")
            if key in level_values:
                raise ValueError(f"{value_path}.key: duplicate {key!r}")
            level_values[key] = require_number(item.get("value"), f"{value_path}.value")
        current_keys = tuple(sorted(level_values))
        if value_keys is None:
            value_keys = current_keys
            values_by_key = {key: [] for key in current_keys}
        elif value_keys != current_keys:
            raise ValueError(f"{effect_id}: talent levels attach different blackboard keys")
        for key in current_keys:
            values_by_key[key].append(level_values[key])

    assert skill_id is not None
    source = passive_skills.get(skill_id)
    if source is None:
        return None
    event_only = (
        not source.buffs
        and bool(source.event_listeners)
        and source.unsupported_reasons == ("passive has no startup Buff",)
        and compile_event_listener is not None
    )
    if not source.can_generate_add_buff and not event_only:
        return None
    unknown_keys = set(values_by_key).difference(source.declared_blackboard_keys)
    if unknown_keys:
        raise ValueError(
            f"passive {skill_id!r}: effect supplies undeclared blackboard keys {sorted(unknown_keys)}"
        )

    rendered_values: dict[str, int | float | list[int | float]] = {}
    for key, values in values_by_key.items():
        rendered_values[key] = values[0] if len(set(values)) == 1 else values
    reaction_projection = collected_buff_reaction_projection(source, buff_definitions)
    if reaction_projection is not None:
        reaction, duration_key, effectiveness_key = reaction_projection
        if duration_key not in rendered_values or effectiveness_key not in rendered_values:
            raise ValueError(
                f"passive {skill_id!r}: reaction projection inputs are absent from attachSkill"
            )
        return "\n".join(
            [
                "  modifiers: [",
                "    {",
                "      kind: 'addReactionDuration',",
                f"      reaction: {ts_inline_literal(reaction)},",
                f"      seconds: {ts_inline_literal(rendered_values[duration_key])},",
                "    },",
                "    {",
                "      kind: 'addReactionEffectiveness',",
                f"      reaction: {ts_inline_literal(reaction)},",
                f"      value: {ts_inline_literal(rendered_values[effectiveness_key])},",
                "    },",
                "  ],",
            ]
        )
    lines = ["  passiveSkills: ["]
    lines.extend(
        _render_passive_skill_entry(
            skill_id,
            source,
            rendered_values,
            buff_definitions,
            compile_buff_definition,
            compile_event_listener,
        )
    )
    lines.append("  ],")
    return "\n".join(lines)


def _parse_skill_blackboard_patch_entry(
    entry: dict[str, Any],
    entry_path: str,
    operator: dict[str, Any],
    skills: list[SkillSource],
) -> tuple[str, str | None, str, str, float, str | None, dict[str, Any] | None]:
    """解析只包含 skillBbModifier 的养成条目；目标技能必须能对应到稳定技能组。"""
    payload_kinds = _effect_payload_kinds(entry, entry_path)
    if payload_kinds not in (("skillBbModifier",), ("activeCondition", "skillBbModifier")):
        raise ValueError(
            f"{entry_path}: expected only skillBbModifier, got {list(payload_kinds)!r}"
        )
    active_conditions = require_list(entry.get("activeCondition"), f"{entry_path}.activeCondition")
    condition_id: str | None = None
    condition: dict[str, Any] | None = None
    if active_conditions:
        if len(active_conditions) != 1 or not isinstance(active_conditions[0], str):
            raise ValueError(f"{entry_path}.activeCondition: expected exactly one condition id")
        condition_id = active_conditions[0]
        configured = require_dict(
            operator.get("progressionActiveConditions", {}),
            "operator.progressionActiveConditions",
        ).get(condition_id)
        if configured is None:
            raise ValueError(
                f"{entry_path}.activeCondition: missing declared projection for {condition_id!r}"
            )
        condition = require_dict(
            configured,
            f"operator.progressionActiveConditions.{condition_id}",
        )
    modifier = require_dict(entry.get("skillBbModifier"), f"{entry_path}.skillBbModifier")
    skill_id = modifier.get("skillId")
    if not isinstance(skill_id, str) or not skill_id:
        raise ValueError(f"{entry_path}.skillBbModifier.skillId: expected non-empty skill id")
    group_key, skill_key = skill_patch_target_by_id(operator, skills, skill_id)
    blackboard_key = modifier.get("bbKey")
    if not isinstance(blackboard_key, str) or not blackboard_key:
        raise ValueError(f"{entry_path}.skillBbModifier.bbKey: expected non-empty blackboard key")
    operation = SKILL_BB_MODIFIER_OPERATIONS.get(modifier.get("modifyType"))
    if operation is None:
        raise ValueError(
            f"{entry_path}.skillBbModifier.modifyType: unsupported {modifier.get('modifyType')!r}"
        )
    value = float(require_number(modifier.get("floatValue"), f"{entry_path}.skillBbModifier.floatValue"))
    if not math.isfinite(value):
        raise ValueError(f"{entry_path}.skillBbModifier.floatValue: expected finite value")
    return group_key, skill_key, blackboard_key, operation, value, condition_id, condition


def _render_skill_blackboard_patch_modifiers(
    entries: list[dict[str, Any]],
    path: str,
    operator: dict[str, Any],
    skills: list[SkillSource],
    *,
    multi_level: bool,
) -> str:
    """渲染 patchSkillBlackboard modifiers；multi_level 为 true 时 value 按等级数组展开。"""
    if not entries:
        raise ValueError(f"{path}: expected at least one skillBbModifier entry")
    order: list[tuple[str, str | None, str, str, str | None]] = []
    values_by_key: dict[tuple[str, str | None, str, str, str | None], list[float]] = {}
    conditions_by_id: dict[str, dict[str, Any]] = {}
    for entry_index, entry in enumerate(entries):
        entry_path = f"{path}[{entry_index}]"
        (
            group_key,
            skill_key,
            blackboard_key,
            operation,
            value,
            condition_id,
            condition,
        ) = _parse_skill_blackboard_patch_entry(entry, entry_path, operator, skills)
        if condition_id is not None:
            assert condition is not None
            previous = conditions_by_id.setdefault(condition_id, condition)
            if previous != condition:
                raise ValueError(f"{entry_path}.activeCondition: inconsistent projection")
        key = (group_key, skill_key, blackboard_key, operation, condition_id)
        if key not in values_by_key:
            values_by_key[key] = []
            order.append(key)
        values_by_key[key].append(value)
    lines = ["  modifiers: ["]
    for key in order:
        group_key, skill_key, blackboard_key, operation, condition_id = key
        values = values_by_key[key]
        rendered_value = values if multi_level else values[0]
        lines.extend(
            [
                "    {",
                "      kind: 'patchSkillBlackboard',",
                f"      skillGroupKey: {ts_inline_literal(group_key)},",
                *([] if skill_key is None else [f"      skillKey: {ts_inline_literal(skill_key)},"]),
                f"      blackboardKey: {ts_inline_literal(blackboard_key)},",
                f"      operation: {ts_inline_literal(operation)},",
                f"      value: {ts_inline_literal(rendered_value)},",
                *(
                    []
                    if condition_id is None
                    else [f"      condition: {ts_inline_literal(conditions_by_id[condition_id])},"]
                ),
                "    },",
            ]
        )
    lines.append("  ],")
    return "\n".join(lines)


def _render_consumed_infliction_vulnerability(
    effect_entries: list[tuple[str, list[dict[str, Any]]]],
    buff_definitions: dict[str, BuffDefinitionSource],
) -> str:
    """严格转换 OnConsumeBuff -> 按被消费法术附着层数施加晶体易伤。"""
    listener_id: str | None = None
    crystal_values: list[int | float] = []
    duration_values: list[int | float] = []
    for effect_id, data_list in effect_entries:
        if len(data_list) != 1:
            raise ValueError(f"{effect_id}: expected one consumed-infliction talent entry")
        entry = data_list[0]
        entry_path = f"{effect_id}.dataList[0]"
        if _effect_payload_kinds(entry, entry_path) != ("attachBuff",):
            raise ValueError(f"{entry_path}: expected only attachBuff")
        if entry.get("modifyType") != 5:
            raise ValueError(f"{entry_path}.modifyType: expected AddBuff(5)")
        if require_list(entry.get("activeCondition"), f"{entry_path}.activeCondition"):
            raise ValueError(f"{entry_path}: conditional listener attachment is unsupported")
        attach = require_dict(entry.get("attachBuff"), f"{entry_path}.attachBuff")
        current_id = attach.get("buffId")
        if not isinstance(current_id, str) or not current_id:
            raise ValueError(f"{entry_path}.attachBuff.buffId: expected non-empty id")
        if listener_id is None:
            listener_id = current_id
        elif listener_id != current_id:
            raise ValueError(f"{effect_id}: talent levels attach different listener Buffs")
        values: dict[str, int | float] = {}
        for index, raw in enumerate(
            require_list(attach.get("blackboard"), f"{entry_path}.attachBuff.blackboard")
        ):
            item = require_dict(raw, f"{entry_path}.attachBuff.blackboard[{index}]")
            key = item.get("key")
            if not isinstance(key, str) or not key:
                raise ValueError(f"{entry_path}.attachBuff.blackboard[{index}].key: expected string")
            if key in values:
                raise ValueError(f"{entry_path}.attachBuff.blackboard: duplicate key {key!r}")
            values[key] = require_number(
                item.get("value"), f"{entry_path}.attachBuff.blackboard[{index}].value"
            )
        if set(values) != {"crystal_up", "duration"}:
            raise ValueError(f"{entry_path}: unexpected listener blackboard keys {sorted(values)}")
        crystal_values.append(values["crystal_up"])
        duration_values.append(values["duration"])

    assert listener_id is not None
    listener = buff_definitions.get(listener_id)
    if listener is None or listener.lifecycle is None:
        raise ValueError(f"talent listener: missing resolved Buff {listener_id!r}")
    event = listener.eventActions[0] if len(listener.eventActions) == 1 else None
    if (
        listener.lifecycle.lifeType != "Infinity"
        or listener.lifecycle.stackingType != "Unique"
        or event is None
        or event.eventSource != "ability"
        or event.event != "OnConsumeBuff"
        or event.orderedActionTypes
        != (
            "CheckBuffIdInContextAdvanced",
            "CheckConsumeBuffLayer",
            "SimpleCalcBBAction",
            "CreateBuffAction",
        )
        or len(event.sequences) != 1
        or len(event.buffApplications) != 1
        or event.contextBuffTagQueries != (("HasAny", (-193971080,)),)
        or event.consumeBuffLayerChecks != (("GE", 1.0, "infliction_num"),)
    ):
        raise ValueError("talent listener: unsupported consumed-infliction event shape")
    application = event.buffApplications[0].payload
    if (
        application.targetSource != "Target"
        or application.targetGroupKey
        or application.buffSource != "ActionSource"
        or len(application.buffs) != 1
    ):
        raise ValueError("talent listener: unsupported vulnerability Buff application")
    child_application = application.buffs[0]
    if set(child_application.blackboardAssignments) != {"crystal_vul", "duration"}:
        raise ValueError("talent listener: vulnerability assignments are incomplete")
    child = buff_definitions.get(child_application.buffId)
    if child is None:
        raise ValueError(f"talent listener: missing child Buff {child_application.buffId!r}")
    child_definition = compile_inline_buff_definition(child, "consumed-infliction vulnerability")
    crystal_value: int | float | list[int | float] = (
        crystal_values[0] if len(set(crystal_values)) == 1 else crystal_values
    )
    duration_value: int | float | list[int | float] = (
        duration_values[0] if len(set(duration_values)) == 1 else duration_values
    )
    return "\n".join(
        [
            "  eventHandlers: [",
            "    {",
            "      event: { kind: 'elementalAttachmentConsumed' },",
            "      blackboard: {",
            f"        'crystal_up': {ts_inline_literal(crystal_value)},",
            f"        'duration': {ts_inline_literal(duration_value)},",
            "      },",
            "      sequence: sequence(",
            "        step('calculateActionValue', {",
            "          key: 'crystal_vul',",
            "          operation: 'multiply',",
            "          left: { kind: 'blackboard', key: 'infliction_num' },",
            "          right: { kind: 'blackboard', key: 'crystal_up' },",
            "        }),",
            "        step('applyBuff', {",
            f"          buffId: {ts_inline_literal(child_application.buffId)},",
            "          definition: {",
            *("            " + line for line in child_definition.splitlines()),
            "          },",
            "          target: 'enemy',",
            "          inheritSourceSkillCastInfo: true,",
            "          blackboardAssignments: {",
            "            'crystal_vul': { kind: 'blackboard', key: 'crystal_vul' },",
            "            'duration': { kind: 'blackboard', key: 'duration' },",
            "          },",
            "        }),",
            "      ),",
            "    },",
            "  ],",
        ]
    )


def _parse_skill_cooldown_add_entry(
    entry: dict[str, Any],
    entry_path: str,
    operator: dict[str, Any],
    skills: list[SkillSource],
) -> tuple[str, str | None, int]:
    """解析 ChangeSkillParam/CoolDown/Add，并把原生秒数严格换算成 30fps 帧差。"""
    if _effect_payload_kinds(entry, entry_path) != ("skillParamModifier",):
        raise ValueError(f"{entry_path}: expected only skillParamModifier")
    modifier = require_dict(entry.get("skillParamModifier"), f"{entry_path}.skillParamModifier")
    if entry.get("modifyType") != 2 or modifier.get("paramType") != 2 or modifier.get("modifyType") != 1:
        raise ValueError(f"{entry_path}: expected ChangeSkillParam/CoolDown/Add")
    skill_id = modifier.get("skillId")
    if not isinstance(skill_id, str) or not skill_id:
        raise ValueError(f"{entry_path}.skillParamModifier.skillId: expected non-empty skill id")
    seconds = float(
        require_number(modifier.get("paramValue"), f"{entry_path}.skillParamModifier.paramValue")
    )
    frames_float = seconds * 30
    frames = round(frames_float)
    if not math.isfinite(frames_float) or not math.isclose(frames_float, frames, abs_tol=1e-6):
        raise ValueError(f"{entry_path}.skillParamModifier.paramValue: not representable at 30fps")
    group_key, skill_key = skill_patch_target_by_id(operator, skills, skill_id)
    return group_key, skill_key, frames


def _render_attached_passive_with_conditional_cooldown(
    effect_entries: list[tuple[str, list[dict[str, Any]]]],
    operator: dict[str, Any],
    skills: list[SkillSource],
    passive_skills: dict[str, PassiveSkillSource],
    buff_definitions: dict[str, BuffDefinitionSource],
    compile_buff_definition: Callable[
        [BuffDefinitionSource, str, dict[str, BuffDefinitionSource]], str
    ],
    compile_event_listener: Callable[
        [object, str, frozenset[str], str, dict[str, BuffDefinitionSource]], str | None
    ] | None,
) -> tuple[str, str]:
    """严格转换附加被动 + 条件冷却；CoolDownDisplay 只作为同值展示镜像验证。"""
    attached_levels: list[tuple[str, list[dict[str, Any]]]] = []
    cooldown_target: tuple[str, str | None] | None = None
    cooldown_frames: int | None = None
    condition_id: str | None = None
    for effect_id, entries in effect_entries:
        attached = [
            entry
            for index, entry in enumerate(entries)
            if _effect_payload_kinds(entry, f"{effect_id}.dataList[{index}]") == ("attachSkill",)
        ]
        parameter_entries = [
            (index, entry)
            for index, entry in enumerate(entries)
            if _effect_payload_kinds(entry, f"{effect_id}.dataList[{index}]")
            == ("activeCondition", "skillParamModifier")
        ]
        if len(attached) != 1 or len(parameter_entries) != 2:
            raise ValueError(f"{effect_id}: expected one passive and cooldown/runtime-display pair")
        attached_levels.append((effect_id, attached))
        parsed: dict[int, tuple[str, str | None, int, str]] = {}
        for index, entry in parameter_entries:
            entry_path = f"{effect_id}.dataList[{index}]"
            active = require_list(entry.get("activeCondition"), f"{entry_path}.activeCondition")
            if len(active) != 1 or not isinstance(active[0], str):
                raise ValueError(f"{entry_path}.activeCondition: expected one condition id")
            modifier = require_dict(entry.get("skillParamModifier"), f"{entry_path}.skillParamModifier")
            if entry.get("modifyType") != 2 or modifier.get("modifyType") != 1:
                raise ValueError(f"{entry_path}: expected ChangeSkillParam/Add")
            param_type = require_non_negative_int(
                modifier.get("paramType"), f"{entry_path}.skillParamModifier.paramType"
            )
            if param_type not in (2, 4):
                raise ValueError(f"{entry_path}: expected CoolDown or CoolDownDisplay")
            skill_id = modifier.get("skillId")
            if not isinstance(skill_id, str) or not skill_id:
                raise ValueError(f"{entry_path}.skillParamModifier.skillId: expected skill id")
            group_key, skill_key = skill_patch_target_by_id(operator, skills, skill_id)
            seconds = float(require_number(modifier.get("paramValue"), f"{entry_path}.paramValue"))
            frames = round(seconds * 30)
            if not math.isclose(seconds * 30, frames, abs_tol=1e-6):
                raise ValueError(f"{entry_path}: cooldown is not representable at 30fps")
            parsed[param_type] = (group_key, skill_key, frames, active[0])
        if set(parsed) != {2, 4} or parsed[2] != parsed[4]:
            raise ValueError(f"{effect_id}: CoolDownDisplay must exactly mirror CoolDown")
        group_key, skill_key, frames, current_condition_id = parsed[2]
        current_target = (group_key, skill_key)
        if cooldown_target is None:
            cooldown_target = current_target
            cooldown_frames = frames
            condition_id = current_condition_id
        elif (
            cooldown_target != current_target
            or cooldown_frames != frames
            or condition_id != current_condition_id
        ):
            raise ValueError(f"{effect_id}: talent levels change conditional cooldown identity")
    passive_body = _render_attached_passive_skills(
        attached_levels,
        passive_skills,
        buff_definitions,
        compile_buff_definition,
        compile_event_listener,
    )
    if passive_body is None or cooldown_target is None or cooldown_frames is None or condition_id is None:
        raise ValueError("conditional cooldown talent did not produce a complete passive")
    configured = require_dict(
        require_dict(
            operator.get("progressionActiveConditions", {}),
            "operator.progressionActiveConditions",
        ).get(condition_id),
        f"operator.progressionActiveConditions.{condition_id}",
    )
    group_key, skill_key = cooldown_target
    modifier_body = "\n".join(
        [
            "  modifiers: [",
            "    {",
            "      kind: 'addSkillCooldownFrames',",
            f"      skillGroupKey: {ts_inline_literal(group_key)},",
            *([] if skill_key is None else [f"      skillKey: {ts_inline_literal(skill_key)},"]),
            f"      frames: {cooldown_frames},",
            f"      condition: {ts_inline_literal(configured)},",
            "    },",
            "  ],",
        ]
    )
    return modifier_body, passive_body


def _render_skill_cooldown_and_blackboard_patch_modifiers(
    entries: list[dict[str, Any]],
    path: str,
    operator: dict[str, Any],
    skills: list[SkillSource],
) -> str:
    cooldown_entries: list[tuple[int, dict[str, Any]]] = []
    blackboard_entries: list[dict[str, Any]] = []
    for index, entry in enumerate(entries):
        payload_kinds = _effect_payload_kinds(entry, f"{path}[{index}]")
        if payload_kinds == ("skillParamModifier",):
            cooldown_entries.append((index, entry))
        elif payload_kinds == ("skillBbModifier",):
            blackboard_entries.append(entry)
        else:
            raise ValueError(f"{path}[{index}]: unsupported mixed progression payload {list(payload_kinds)!r}")
    if len(cooldown_entries) != 1 or not blackboard_entries:
        raise ValueError(f"{path}: expected one cooldown patch and at least one blackboard patch")
    index, cooldown_entry = cooldown_entries[0]
    group_key, skill_key, frames = _parse_skill_cooldown_add_entry(
        cooldown_entry, f"{path}[{index}]", operator, skills
    )
    blackboard_body = _render_skill_blackboard_patch_modifiers(
        blackboard_entries, path, operator, skills, multi_level=False
    ).splitlines()
    lines = [
        "  modifiers: [",
        "    {",
        "      kind: 'addSkillCooldownFrames',",
        f"      skillGroupKey: {ts_inline_literal(group_key)},",
        *([] if skill_key is None else [f"      skillKey: {ts_inline_literal(skill_key)},"]),
        f"      frames: {frames},",
        "    },",
        *blackboard_body[1:-1],
        "  ],",
    ]
    return "\n".join(lines)


def _render_skill_blackboard_patch_and_attached_buff(
    entries: list[dict[str, Any]],
    path: str,
    operator: dict[str, Any],
    skills: list[SkillSource],
    buff_definitions: dict[str, BuffDefinitionSource],
    compile_buff_definition: Callable[
        [BuffDefinitionSource, str, dict[str, BuffDefinitionSource]], str
    ],
) -> str:
    """严格组合同一潜能中的技能黑板补丁与一次性附着 Buff。"""
    blackboard_entries: list[dict[str, Any]] = []
    attached_entries: list[tuple[int, dict[str, Any]]] = []
    for index, entry in enumerate(entries):
        payload_kinds = _effect_payload_kinds(entry, f"{path}[{index}]")
        if payload_kinds == ("skillBbModifier",):
            blackboard_entries.append(entry)
        elif payload_kinds == ("attachBuff",):
            attached_entries.append((index, entry))
        else:
            raise ValueError(
                f"{path}[{index}]: unsupported mixed progression payload {list(payload_kinds)!r}"
            )
    if not blackboard_entries or len(attached_entries) != 1:
        raise ValueError(
            f"{path}: expected at least one blackboard patch and exactly one attached Buff"
        )
    attached_index, attached_entry = attached_entries[0]
    return "\n".join(
        [
            _render_skill_blackboard_patch_modifiers(
                blackboard_entries,
                path,
                operator,
                skills,
                multi_level=False,
            ),
            _render_attached_buff_initialization(
                attached_entry,
                f"{path}[{attached_index}]",
                buff_definitions,
                compile_buff_definition,
            ),
        ]
    )


def _render_attached_buff_initialization(
    entry: dict[str, Any],
    path: str,
    buff_definitions: dict[str, BuffDefinitionSource],
    compile_buff_definition: Callable[
        [BuffDefinitionSource, str, dict[str, BuffDefinitionSource]], str
    ] = _compile_plain_buff_definition,
) -> str:
    """将原生 PotentialModifyType.AddBuff 渲染为独立养成初始化序列。"""
    if _effect_payload_kinds(entry, path) != ("attachBuff",):
        raise ValueError(f"{path}: expected only attachBuff")
    if entry.get("modifyType") != 5:
        raise ValueError(f"{path}.modifyType: expected AddBuff(5)")
    if require_list(entry.get("activeCondition"), f"{path}.activeCondition"):
        raise ValueError(f"{path}.activeCondition: conditional attached Buff is not supported")
    attach = require_dict(entry.get("attachBuff"), f"{path}.attachBuff")
    buff_id = attach.get("buffId")
    if not isinstance(buff_id, str) or not buff_id:
        raise ValueError(f"{path}.attachBuff.buffId: expected non-empty id")
    definition = buff_definitions.get(buff_id)
    if definition is None:
        raise ValueError(f"{path}: missing resolved Buff {buff_id!r}")
    declared_keys = {item.key for item in definition.blackboard}
    assignments: list[tuple[str, int | float]] = []
    for index, raw_item in enumerate(
        require_list(attach.get("blackboard"), f"{path}.attachBuff.blackboard")
    ):
        item_path = f"{path}.attachBuff.blackboard[{index}]"
        item = require_dict(raw_item, item_path)
        key = item.get("key")
        if not isinstance(key, str) or not key:
            raise ValueError(f"{item_path}.key: expected non-empty string")
        if key not in declared_keys:
            raise ValueError(f"{item_path}.key: Buff {buff_id!r} has no blackboard {key!r}")
        if any(existing_key == key for existing_key, _ in assignments):
            raise ValueError(f"{item_path}.key: duplicate {key!r}")
        assignments.append((key, require_number(item.get("value"), f"{item_path}.value")))
    lines = [
        "  initializationSequence: sequence(",
        "    step('applyBuff', {",
        f"      buffId: {ts_inline_literal(buff_id)},",
        "      definition: {",
        *(
            "        " + line
            for line in compile_buff_definition(definition, path, buff_definitions).splitlines()
        ),
        "      },",
        "      target: 'caster',",
        "      inheritSourceSkillCastInfo: false,",
    ]
    if assignments:
        lines.append("      blackboardAssignments: {")
        for key, value in assignments:
            lines.append(
                f"        {ts_inline_literal(key)}: {{ kind: 'constant', value: {ts_inline_literal(value)} }},"
            )
        lines.append("      },")
    lines.extend(["    }),", "  ),"])
    return "\n".join(lines)


def _render_skill_and_passive_blackboard_patch_modifiers(
    entries: list[dict[str, Any]],
    path: str,
    operator: dict[str, Any],
    skills: list[SkillSource],
    passive_skills: dict[str, PassiveSkillSource],
) -> str:
    """严格拆分同一养成项内对可释放技能与隐藏被动的 Blackboard 修改。"""
    skill_entries: list[dict[str, Any]] = []
    passive_entries: list[tuple[int, dict[str, Any], PassiveSkillSource]] = []
    for index, entry in enumerate(entries):
        entry_path = f"{path}[{index}]"
        if _effect_payload_kinds(entry, entry_path) != ("skillBbModifier",):
            raise ValueError(f"{entry_path}: expected only skillBbModifier")
        modifier = require_dict(entry.get("skillBbModifier"), f"{entry_path}.skillBbModifier")
        skill_id = modifier.get("skillId")
        passive = passive_skills.get(skill_id) if isinstance(skill_id, str) else None
        if passive is None:
            skill_entries.append(entry)
        else:
            passive_entries.append((index, modifier, passive))
    if not skill_entries or not passive_entries:
        raise ValueError(f"{path}: expected both skill and passive Blackboard patches")
    skill_lines = _render_skill_blackboard_patch_modifiers(
        skill_entries, path, operator, skills, multi_level=False
    ).splitlines()
    lines = skill_lines[:-1]
    for index, modifier, passive in passive_entries:
        entry_path = f"{path}[{index}]"
        if not passive.can_generate_add_buff:
            raise ValueError(f"{entry_path}: target passive {passive.skill_id!r} is not generated")
        blackboard_key = modifier.get("bbKey")
        if blackboard_key not in passive.declared_blackboard_keys:
            raise ValueError(
                f"{entry_path}: passive {passive.skill_id!r} has no blackboard {blackboard_key!r}"
            )
        operation = SKILL_BB_MODIFIER_OPERATIONS.get(modifier.get("modifyType"))
        if operation is None:
            raise ValueError(f"{entry_path}: unsupported passive Blackboard operation")
        value = float(require_number(modifier.get("floatValue"), f"{entry_path}.floatValue"))
        lines.extend(
            [
                "    {",
                "      kind: 'patchPassiveBlackboard',",
                f"      passiveSkillKey: {ts_inline_literal(passive.skill_id)},",
                f"      blackboardKey: {ts_inline_literal(blackboard_key)},",
                f"      operation: {ts_inline_literal(operation)},",
                f"      value: {ts_inline_literal(value)},",
                "    },",
            ]
        )
    lines.append("  ],")
    return "\n".join(lines)


def _render_skill_sp_gain_attack_stack(
    entry: dict[str, Any],
    path: str,
    buff_definitions: dict[str, BuffDefinitionSource],
) -> str:
    """转换秋栗“技能回复技力”监听器；任何来源、方法或 Buff 形状漂移都失败。"""
    if _effect_payload_kinds(entry, path) != ("attachBuff",) or entry.get("modifyType") != 5:
        raise ValueError(f"{path}: expected one AddBuff payload")
    if require_list(entry.get("activeCondition"), f"{path}.activeCondition"):
        raise ValueError(f"{path}.activeCondition: expected no build condition")
    attach = require_dict(entry.get("attachBuff"), f"{path}.attachBuff")
    root_id = attach.get("buffId")
    root = buff_definitions.get(root_id) if isinstance(root_id, str) else None
    if root is None or root.lifecycle is None:
        raise ValueError(f"{path}: missing listener Buff {root_id!r}")
    values: dict[str, float] = {}
    for index, raw_item in enumerate(
        require_list(attach.get("blackboard"), f"{path}.attachBuff.blackboard")
    ):
        item_path = f"{path}.attachBuff.blackboard[{index}]"
        item = require_dict(raw_item, item_path)
        key = item.get("key")
        if not isinstance(key, str) or not key or key in values:
            raise ValueError(f"{item_path}.key: expected unique non-empty string")
        values[key] = float(require_number(item.get("value"), f"{item_path}.value"))
    if set(values) != {"atk_up", "duration", "max_stack"}:
        raise ValueError(f"{path}: unexpected listener blackboard {sorted(values)}")

    empty_root_fields = (
        root.applyTagIds, root.extendTagIds, root.attributeModifiers, root.damageModifiers,
        root.directDamageHits, root.inflictions, root.conditionalActions,
        root.blackboardCalculations, root.blackboardMutations, root.buffBlackboardReads,
        root.buffFinishes, root.igniteEventActions, root.resourceGains, root.combatActions,
        root.unparsedPayloads, root.auraActions, root.invokedAbilityEntitySkills,
        root.auxiliaryActions, root.targetGroupWrites, root.skillReplacements,
    )
    if (
        root.lifecycle.lifeType != "Infinity"
        or root.lifecycle.stackingType != "Unique"
        or any(empty_root_fields)
        or len(root.eventActions) != 1
    ):
        raise ValueError(f"{path}: listener Buff contains unsupported behavior")
    event = root.eventActions[0]
    if (
        event.eventSource != "ability"
        or event.event != "OnObtainAtb"
        or event.orderedActionTypes != ("CheckObtainAtbType", "CreateBuffAction")
        or len(event.obtainAtbFilters) != 1
        or event.obtainAtbFilters[0].checkObtainType is not True
        or event.obtainAtbFilters[0].obtainTypes != ("Skill",)
        or event.obtainAtbFilters[0].checkObtainMethod is not True
        or event.obtainAtbFilters[0].obtainMethods != ("Gain",)
        or len(event.sequences) != 1
        or len(event.buffApplications) != 1
    ):
        raise ValueError(f"{path}: unsupported OnObtainAtb listener shape")
    sequence_source = event.sequences[0]
    application = event.buffApplications[0].payload
    if (
        sequence_source.onlyMainOperator
        or sequence_source.onlyGuard
        or sequence_source.priority != 0
        or len(sequence_source.actions) != 1
        or application.targetSource != "Owner"
        or application.targetGroupKey
        or application.buffSource != "ActionOwner"
        or application.buffSourceContextKey
        or application.inheritSourceSkillCastInfo is not True
        or application.count.blackboardKey is not None
        or application.count.value != 1
        or len(application.buffs) != 1
    ):
        raise ValueError(f"{path}: unsupported listener Buff application")
    child_application = application.buffs[0]
    child = buff_definitions.get(child_application.buffId)
    if child is None or child.lifecycle is None:
        raise ValueError(f"{path}: missing child Buff {child_application.buffId!r}")
    assignments = child_application.blackboardAssignments
    if set(assignments) != {"atk_up", "duration"} or any(
        scalar.blackboardKey != key for key, scalar in assignments.items()
    ):
        raise ValueError(f"{path}: child Buff assignments do not forward listener values")
    if (
        child.lifecycle.lifeType != "Limited"
        or child.lifecycle.stackingType != "EnhanceAndRefresh"
        or child.lifecycle.maxStackCount.blackboardKey is not None
        or child.lifecycle.maxStackCount.value != values["max_stack"]
    ):
        raise ValueError(f"{path}: child Buff stack lifecycle does not match potential values")
    definition = compile_inline_buff_definition(child, path)
    return "\n".join(
        [
            "  eventHandlers: [",
            "    {",
            "      event: { kind: 'spGained', source: 'skill', gainKind: 'gain' },",
            "      sequence: sequence(",
            "        step('applyBuff', {",
            f"          buffId: {ts_inline_literal(child.buffId)},",
            "          definition: {",
            *("            " + line for line in definition.splitlines()),
            "          },",
            "          target: 'caster',",
            "          inheritSourceSkillCastInfo: true,",
            "          blackboardAssignments: {",
            f"            'atk_up': {{ kind: 'constant', value: {ts_inline_literal(values['atk_up'])} }},",
            f"            'duration': {{ kind: 'constant', value: {ts_inline_literal(values['duration'])} }},",
            "          },",
            "        }),",
            "      ),",
            "    },",
            "  ],",
        ]
    )


def parse_static_attribute_progression(
    raw_entries: Any,
    path: str,
    *,
    mode: Literal["strict", "lenient"] = "strict",
) -> StaticAttributeProgressionResult:
    """解析潜能中的永久静态属性；宽松模式绝不把未识别载荷伪装成已转换。"""
    if mode not in {"strict", "lenient"}:
        raise ValueError(f"{path}: unsupported progression conversion mode {mode!r}")
    build_attribute_modifiers: list[tuple[BuildAttributeName, int]] = []
    base_panel_stat_modifiers: list[
        tuple[BasePanelStatName, BasePanelOperation, int | float]
    ] = []
    static_damage_increase_modifiers: list[
        tuple[StaticDamageIncreaseTarget, int | float]
    ] = []
    issues: list[ProgressionConversionIssue] = []

    def reject(code: str, issue_path: str, detail: str) -> None:
        if mode == "strict":
            raise ValueError(f"{issue_path}: {detail}")
        issues.append(ProgressionConversionIssue(code, issue_path, detail))

    for index, raw_entry in enumerate(require_list(raw_entries, path)):
        entry_path = f"{path}[{index}]"
        entry = require_dict(raw_entry, entry_path)
        unknown_fields = sorted(set(entry).difference(EFFECT_ENTRY_FIELDS))
        if unknown_fields:
            reject("unknown-effect-fields", entry_path, f"unknown fields {unknown_fields!r}")
            continue
        payload_kinds = _effect_payload_kinds(entry, entry_path)
        if payload_kinds != ("attrModifier",):
            reject(
                "unsupported-payload-combination",
                entry_path,
                f"expected only attrModifier, got {list(payload_kinds)!r}",
            )
            continue
        if entry.get("modifyType") != 4:
            reject(
                "unsupported-effect-modify-type",
                f"{entry_path}.modifyType",
                "expected modifyType=4",
            )
            continue
        modifier_path = f"{entry_path}.attrModifier"
        modifier = require_dict(entry.get("attrModifier"), modifier_path)
        unknown_modifier_fields = sorted(set(modifier).difference(ATTRIBUTE_MODIFIER_FIELDS))
        if unknown_modifier_fields:
            reject(
                "unknown-attribute-modifier-fields",
                modifier_path,
                f"unknown fields {unknown_modifier_fields!r}",
            )
            continue
        attr_type = modifier.get("attrType")
        attribute = BUILD_ATTRIBUTE_TYPES.get(attr_type)
        base_panel_target = BASE_PANEL_ATTRIBUTE_TYPES.get(attr_type)
        static_damage_target = STATIC_DAMAGE_INCREASE_ATTRIBUTE_TYPES.get(attr_type)
        semantic = ATTRIBUTE_TYPE_SEMANTICS.get(attr_type)
        if attribute is None and base_panel_target is None and static_damage_target is None:
            if semantic is None:
                reject(
                    "unknown-attribute-type",
                    f"{modifier_path}.attrType",
                    f"unknown AttributeType {attr_type!r}",
                )
            else:
                native_name, semantic_name = semantic
                reject(
                    "unsupported-next-attribute",
                    f"{modifier_path}.attrType",
                    f"{native_name} ({attr_type}) maps to {semantic_name}, which has no exact Next upgrade modifier",
                )
            continue
        expected_modifier_type = (
            5
            if attribute is not None or static_damage_target is not None
            else base_panel_target[2]
        )
        if (
            modifier.get("modifierType") != expected_modifier_type
            or modifier.get("modifyAttributeType") != 0
        ):
            reject(
                "unsupported-attribute-modifier-mode",
                modifier_path,
                f"expected modifierType={expected_modifier_type} and modifyAttributeType=0",
            )
            continue
        value = require_number(modifier.get("attrValue"), f"{modifier_path}.attrValue")
        if attribute is not None and not value.is_integer():
            reject(
                "non-integer-static-attribute",
                f"{modifier_path}.attrValue",
                f"expected integer static attribute value, got {value!r}",
            )
            continue
        if attribute is not None:
            if any(existing == attribute for existing, _ in build_attribute_modifiers):
                reject(
                    "duplicate-build-attribute",
                    modifier_path,
                    f"duplicate build attribute {attribute!r}",
                )
                continue
            build_attribute_modifiers.append((attribute, int(value)))
        elif base_panel_target is not None:
            panel_stat, operation, _ = base_panel_target
            if any(
                existing_stat == panel_stat and existing_operation == operation
                for existing_stat, existing_operation, _ in base_panel_stat_modifiers
            ):
                reject(
                    "duplicate-base-panel-stat",
                    modifier_path,
                    f"duplicate base panel stat {panel_stat!r} operation {operation!r}",
                )
                continue
            normalized_value: int | float = int(value) if value.is_integer() else value
            base_panel_stat_modifiers.append((panel_stat, operation, normalized_value))
        elif static_damage_target is not None:
            if any(
                existing_target == static_damage_target
                for existing_target, _ in static_damage_increase_modifiers
            ):
                reject(
                    "duplicate-static-damage-increase",
                    modifier_path,
                    f"duplicate static damage increase {static_damage_target!r}",
                )
                continue
            normalized_value = int(value) if value.is_integer() else value
            static_damage_increase_modifiers.append(
                (static_damage_target, normalized_value)
            )

    return StaticAttributeProgressionResult(
        build_attribute_modifiers=tuple(build_attribute_modifiers),
        base_panel_stat_modifiers=tuple(base_panel_stat_modifiers),
        static_damage_increase_modifiers=tuple(static_damage_increase_modifiers),
        issues=tuple(issues),
        missing_capabilities=("potentialEffects",) if issues else (),
    )


def parse_ultimate_cost_multiplier(
    raw_entries: Any,
    ultimate_skill_ids: set[str],
    path: str,
) -> UltimateCostMultiplierResult | None:
    """只转换完整匹配 ChangeSkillParam/CostValue/Multiply 的终结技效果。

    返回 ``None`` 表示该效果属于其他已知养成语义；一旦形状看似费用补丁但证据不完整，
    就直接报错，避免把混合载荷或错误目标悄悄转换成降费。
    """
    entries = require_list(raw_entries, path)
    modifiers = [
        require_dict(
            require_dict(entry, f"{path}[{index}]").get("skillParamModifier"),
            f"{path}[{index}].skillParamModifier",
        )
        for index, entry in enumerate(entries)
    ]
    if not any(modifier.get("paramType") == 1 for modifier in modifiers):
        return None
    parsed: list[tuple[str, float]] = []
    for index, (raw_entry, modifier) in enumerate(zip(entries, modifiers, strict=True)):
        entry_path = f"{path}[{index}]"
        entry = require_dict(raw_entry, entry_path)
        skill_id = modifier.get("skillId")
        if not isinstance(skill_id, str) or not skill_id:
            raise ValueError(f"{entry_path}: mixed ultimate-cost and unrelated payloads")
        parameter_type = modifier.get("paramType")
        if parameter_type != 1:
            raise ValueError(f"{entry_path}: mixed ultimate-cost parameter types")
        if (
            entry.get("modifyType") != 2
            or modifier.get("modifyType") != 2
            or skill_id not in ultimate_skill_ids
        ):
            raise ValueError(
                f"{entry_path}: expected ChangeSkillParam/CostValue/Multiply targeting an ultimate skill"
            )
        value = require_number(modifier.get("paramValue"), f"{entry_path}.skillParamModifier.paramValue")
        if value < 0:
            raise ValueError(f"{entry_path}.skillParamModifier.paramValue: expected non-negative multiplier")
        parsed.append((skill_id, value))
    if not parsed:
        return None
    target_ids = tuple(skill_id for skill_id, _ in parsed)
    if len(set(target_ids)) != len(target_ids):
        raise ValueError(f"{path}: duplicate ultimate skill targets")
    multipliers = {value for _, value in parsed}
    if len(multipliers) != 1:
        raise ValueError(f"{path}: ultimate variants use different cost multipliers")
    multiplier = next(iter(multipliers))
    return UltimateCostMultiplierResult(
        multiplier=int(multiplier) if multiplier.is_integer() else multiplier,
        target_skill_ids=target_ids,
    )


def _render_static_attribute_modifiers(result: StaticAttributeProgressionResult) -> str:
    if (
        not result.build_attribute_modifiers
        and not result.base_panel_stat_modifiers
        and not result.static_damage_increase_modifiers
    ):
        raise ValueError("static attribute potential: expected at least one converted modifier")
    grouped: list[tuple[int, list[BuildAttributeName]]] = []
    for attribute, value in result.build_attribute_modifiers:
        group = next((item for item in grouped if item[0] == value), None)
        if group is None:
            grouped.append((value, [attribute]))
        else:
            group[1].append(attribute)
    lines = ["  modifiers: ["]
    for value, attributes in grouped:
        lines.extend(
            [
                "    {",
                "      kind: 'addBuildAttribute',",
                f"      attributes: {ts_inline_literal(attributes)},",
                f"      value: {ts_inline_literal(value)},",
                "    },",
            ]
        )
    for stat, operation, value in result.base_panel_stat_modifiers:
        lines.append(
            "    "
            f"{{ kind: 'modifyBasePanelStat', stat: {ts_inline_literal(stat)}, "
            f"operation: {ts_inline_literal(operation)}, value: {ts_inline_literal(value)} }},"
        )
    for target, value in result.static_damage_increase_modifiers:
        lines.append(
            "    "
            f"{{ kind: 'addStaticDamageIncrease', target: {ts_inline_literal(target)}, "
            f"value: {ts_inline_literal(value)} }},"
        )
    lines.append("  ],")
    return "\n".join(lines)


def skill_id_by_key(skills: list[SkillSource], key: str) -> str:
    matches = [skill.skillId for skill in skills if skill.key == key]
    if len(matches) != 1:
        raise ValueError(f"operator skills: expected exactly one skill with key {key!r}")
    return matches[0]


def skill_key_by_id(skills: list[SkillSource], skill_id: str) -> str:
    matches = [skill.key for skill in skills if skill.skillId == skill_id]
    if len(matches) != 1:
        raise ValueError(f"operator skills: expected exactly one skill with id {skill_id!r}")
    return matches[0]


def skill_patch_target_by_id(
    operator: dict[str, Any], skills: list[SkillSource], skill_id: str
) -> tuple[str, str | None]:
    """把原生技能 ID 映射到稳定技能组；多形态组同时保留具体生成技能 key。"""
    skill_key = skill_key_by_id(skills, skill_id)
    raw_groups = require_list(operator.get("skillGroups", []), f"{operator['slug']}.skillGroups")
    if not raw_groups:
        return skill_key, None
    matches: list[tuple[str, list[Any]]] = []
    for index, raw_group in enumerate(raw_groups):
        group = require_dict(raw_group, f"{operator['slug']}.skillGroups[{index}]")
        skill_keys = require_list(group.get("skillKeys"), f"{operator['slug']}.skillGroups[{index}].skillKeys")
        if skill_key in skill_keys:
            matches.append((str(group["key"]), skill_keys))
    if len(matches) != 1:
        raise ValueError(f"operator skills: expected one group containing {skill_key!r}")
    group_key, group_skill_keys = matches[0]
    return group_key, skill_key if len(group_skill_keys) > 1 else None


def skill_ids_by_group_key(
    operator: dict[str, Any],
    skills: list[SkillSource],
    group_key: str,
) -> set[str]:
    """从稳定技能组声明取得全部原生技能 ID，双形态变体也归入同一组。"""
    raw_groups = require_list(
        operator.get("skillGroups", []),
        f"{operator['slug']}.skillGroups",
    )
    if not raw_groups:
        return {skill_id_by_key(skills, group_key)}
    groups = [
        require_dict(item, f"{operator['slug']}.skillGroups[]")
        for item in raw_groups
        if require_dict(item, f"{operator['slug']}.skillGroups[]").get("key") == group_key
    ]
    if len(groups) != 1:
        raise ValueError(f"{operator['slug']}.skillGroups: expected one {group_key!r} group")
    skill_keys = require_list(groups[0].get("skillKeys"), f"{operator['slug']}.{group_key}.skillKeys")
    ids = {skill_id_by_key(skills, str(key)) for key in skill_keys}
    if not ids:
        raise ValueError(f"{operator['slug']}.{group_key}: expected at least one skill")
    return ids


def render_talents(
    operator: dict[str, Any],
    skills: list[SkillSource],
    growth: dict[str, Any],
    effects: dict[str, Any],
    passive_skills: dict[str, PassiveSkillSource] | None = None,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    compile_buff_definition: Callable[
        [BuffDefinitionSource, str, dict[str, BuffDefinitionSource]], str
    ] = _compile_plain_buff_definition,
    compile_event_listener: Callable[
        [object, str, frozenset[str], str, dict[str, BuffDefinitionSource]], str | None
    ] | None = None,
) -> list[str]:
    passive_skills = passive_skills or {}
    buff_definitions = buff_definitions or {}
    nodes = require_dict(growth.get("talentNodeMap"), "CharGrowthTable.talentNodeMap")
    by_index: dict[int, list[tuple[int, str]]] = {}
    for raw_node in nodes.values():
        node = require_dict(raw_node, "CharGrowthTable.talentNodeMap[]")
        passive = require_dict(node.get("passiveSkillNodeInfo"), "passiveSkillNodeInfo")
        effect_id = passive.get("talentEffectId")
        if not effect_id:
            continue
        index = require_non_negative_int(passive.get("index"), "passiveSkillNodeInfo.index")
        level = require_non_negative_int(passive.get("level"), "passiveSkillNodeInfo.level")
        by_index.setdefault(index, []).append((level, str(effect_id)))
    result: list[str] = []
    for raw_config in require_list(operator.get("talents"), f"{operator['slug']}.talents"):
        config = require_dict(raw_config, f"{operator['slug']}.talents[]")
        index = require_non_negative_int(config.get("index"), "talent.index")
        entries = sorted(by_index.get(index, []))
        if not entries:
            raise ValueError(f"talent index {index}: no source effects")
        kind = config.get("compile")
        key = str(config["key"])
        attach_entries = [
            (
                effect_id,
                [
                    require_dict(item, f"{effect_id}.dataList[{item_index}]")
                    for item_index, item in enumerate(
                        require_list(
                            table_row(effects, effect_id, "PotentialTalentEffectTable").get("dataList"),
                            f"{effect_id}.dataList",
                        )
                    )
                ],
            )
            for _, effect_id in entries
        ]
        passive_body = _render_attached_passive_skills(
            attach_entries,
            passive_skills,
            buff_definitions,
            compile_buff_definition,
            compile_event_listener,
        )
        if isinstance(kind, str) and kind.startswith("unmodeled") and kind != "unmodeledMultiTarget":
            # 显式未建模天赋：保留稳定身份和等级数，不生成无证据的 modifiers；
            # conversionSupport 会依据 unmodeled 前缀自动标记 talentEffects 缺口。
            result.append(
                "\n".join(
                    [
                        "{",
                        f"  key: {ts_inline_literal(key)},",
                        f"  levels: {len(entries)},",
                        "  modifiers: [],",
                        *([passive_body] if passive_body is not None else []),
                        "}",
                    ]
                )
            )
            continue
        if kind == "attachedPassive":
            if passive_body is None:
                attached_ids = sorted(
                    {
                        str(require_dict(entry.get("attachSkill"), "attachSkill").get("skillId"))
                        for _, entries_for_level in attach_entries
                        for entry in entries_for_level
                    }
                )
                facts = {
                    passive_id: (
                        passive_skills[passive_id].unsupported_reasons,
                        bool(passive_skills[passive_id].event_listeners),
                    )
                    for passive_id in attached_ids
                    if passive_id in passive_skills
                }
                raise ValueError(
                    f"talent {key}: attached passive did not produce a complete program; "
                    f"facts={facts!r}"
                )
            has_modifier_projection = passive_body.lstrip().startswith("modifiers:")
            result.append(
                "\n".join(
                    [
                        "{",
                        f"  key: {ts_inline_literal(key)},",
                        f"  levels: {len(entries)},",
                        *([] if has_modifier_projection else ["  modifiers: [],"]),
                        passive_body,
                        "}",
                    ]
                )
            )
        elif kind == "consumedInflictionVulnerability":
            result.append(
                "\n".join(
                    [
                        "{",
                        f"  key: {ts_inline_literal(key)},",
                        f"  levels: {len(entries)},",
                        "  modifiers: [],",
                        _render_consumed_infliction_vulnerability(
                            attach_entries,
                            buff_definitions,
                        ),
                        "}",
                    ]
                )
            )
        elif kind == "attachedPassiveWithConditionalCooldown":
            modifier_body, conditional_passive_body = (
                _render_attached_passive_with_conditional_cooldown(
                    attach_entries,
                    operator,
                    skills,
                    passive_skills,
                    buff_definitions,
                    compile_buff_definition,
                    compile_event_listener,
                )
            )
            result.append(
                "\n".join(
                    [
                        "{",
                        f"  key: {ts_inline_literal(key)},",
                        f"  levels: {len(entries)},",
                        modifier_body,
                        conditional_passive_body,
                        "}",
                    ]
                )
            )
        elif kind == "targetStaggeredDamage":
            values: list[float] = []
            for _, effect_id in entries:
                effect = table_row(effects, effect_id, "PotentialTalentEffectTable")
                data = require_list(effect.get("dataList"), f"{effect_id}.dataList")
                if len(data) != 1:
                    raise ValueError(f"{effect_id}: expected one talent effect")
                attach = require_dict(require_dict(data[0], f"{effect_id}.dataList[0]").get("attachBuff"), "attachBuff")
                buff_id = attach.get("buffId")
                if not isinstance(buff_id, str) or not buff_id:
                    raise ValueError(f"{effect_id}: missing stagger damage buff")
                blackboard = require_list(attach.get("blackboard"), f"{effect_id}.attachBuff.blackboard")
                item = next((item for item in blackboard if item.get("key") == "dmg"), None)
                if item is None:
                    raise ValueError(f"{effect_id}: missing dmg blackboard")
                values.append(float(item["value"]))
            result.append(
                "\n".join(
                    [
                        "{",
                        f"  key: {ts_inline_literal(key)},",
                        f"  levels: {len(entries)},",
                        "  modifiers: [",
                        "    {",
                        "      kind: 'addConditionalDamage',",
                        "      condition: { kind: 'targetStaggered', target: 'enemy' },",
                        f"      values: {ts_inline_literal(values)},",
                        "    },",
                        "  ],",
                        "}",
                    ]
                )
            )
        elif kind == "skillBlackboardPatch":
            patch_entries: list[dict[str, Any]] = []
            expected_keys: set[tuple[str, str | None, str, str, str | None]] | None = None
            for level, effect_id in entries:
                effect = table_row(effects, effect_id, "PotentialTalentEffectTable")
                data_list = require_list(effect.get("dataList"), f"{effect_id}.dataList")
                level_keys: set[tuple[str, str | None, str, str, str | None]] = set()
                level_entries: list[dict[str, Any]] = []
                for index, raw_entry in enumerate(data_list):
                    entry_path = f"{effect_id}.dataList[{index}]"
                    entry = require_dict(raw_entry, entry_path)
                    (
                        group_key,
                        skill_key,
                        blackboard_key,
                        operation,
                        _,
                        condition_id,
                        _,
                    ) = _parse_skill_blackboard_patch_entry(entry, entry_path, operator, skills)
                    patch_key = (group_key, skill_key, blackboard_key, operation, condition_id)
                    if patch_key in level_keys:
                        raise ValueError(f"{entry_path}: duplicate blackboard patch {patch_key!r}")
                    level_keys.add(patch_key)
                    level_entries.append(entry)
                if expected_keys is None:
                    expected_keys = level_keys
                elif expected_keys != level_keys:
                    raise ValueError(f"{effect_id}: talent levels patch different blackboard keys")
                patch_entries.extend(level_entries)
            body = _render_skill_blackboard_patch_modifiers(
                patch_entries,
                f"CharGrowthTable.talentNodeMap",
                operator,
                skills,
                multi_level=True,
            )
            result.append(
                "\n".join(
                    [
                        "{",
                        f"  key: {ts_inline_literal(key)},",
                        f"  levels: {len(entries)},",
                        body,
                        "}",
                    ]
                )
            )
        elif kind == "unmodeledMultiTarget":
            if len(entries) != 1:
                raise ValueError(f"talent {key}: expected one source level")
            effect = table_row(effects, entries[0][1], "PotentialTalentEffectTable")
            data = require_list(effect.get("dataList"), f"{entries[0][1]}.dataList")
            modifier = require_dict(require_dict(data[0], "dataList[0]").get("skillBbModifier"), "skillBbModifier")
            if (
                modifier.get("skillId") != skill_id_by_key(skills, "comboSkill")
                or modifier.get("bbKey") != "talent2"
                or float(modifier.get("floatValue", 0)) != 1
            ):
                raise ValueError(f"talent {key}: unexpected multi-target modifier source")
            result.append(
                "\n".join(
                    [
                        "{",
                        f"  key: {ts_inline_literal(key)},",
                        "  levels: 1,",
                        "  modifiers: [],",
                        "}",
                    ]
                )
            )
        else:
            raise ValueError(f"talent {key}: unsupported compiler {kind!r}")
    return result


def render_potentials(
    operator: dict[str, Any],
    skills: list[SkillSource],
    potential_table: dict[str, Any],
    effects: dict[str, Any],
    passive_skills: dict[str, PassiveSkillSource] | None = None,
    buff_definitions: dict[str, BuffDefinitionSource] | None = None,
    compile_buff_definition: Callable[
        [BuffDefinitionSource, str, dict[str, BuffDefinitionSource]], str
    ] = _compile_plain_buff_definition,
) -> list[str]:
    passive_skills = passive_skills or {}
    buff_definitions = buff_definitions or {}
    char_id = str(operator["charId"])
    source = table_row(potential_table, char_id, "CharacterPotentialTable")
    unlocks = require_list(source.get("potentialUnlockBundle"), f"CharacterPotentialTable.{char_id}")
    configs = require_list(operator.get("potentials"), f"{operator['slug']}.potentials")
    if len(unlocks) != len(configs):
        raise ValueError(f"{char_id}: potential config count does not match source")
    result: list[str] = []
    ultimate_skill_ids = skill_ids_by_group_key(operator, skills, "ultimate")
    ultimate_skill_id = next(iter(ultimate_skill_ids)) if len(ultimate_skill_ids) == 1 else None
    for raw_unlock, raw_config in zip(unlocks, configs, strict=True):
        unlock = require_dict(raw_unlock, f"{char_id}.potentialUnlockBundle[]")
        config = require_dict(raw_config, f"{operator['slug']}.potentials[]")
        effect_id = str(unlock["potentialEffectId"])
        effect = table_row(effects, effect_id, "PotentialTalentEffectTable")
        data_list = require_list(effect.get("dataList"), f"{effect_id}.dataList")
        key = str(config["key"])
        kind = config.get("compile")
        passive_body = _render_attached_passive_skills(
            [
                (
                    effect_id,
                    [
                        require_dict(entry, f"{effect_id}.dataList[{index}]")
                        for index, entry in enumerate(data_list)
                    ],
                )
            ],
            passive_skills,
            buff_definitions,
            compile_buff_definition,
        )
        if isinstance(kind, str) and kind.startswith("unmodeled"):
            # 显式未建模潜能：保留稳定身份，不生成无证据的 modifiers；
            # conversionSupport 会依据 unmodeled 前缀自动标记 potentialEffects 缺口。
            result.append(
                "\n".join(
                    [
                        "{",
                        f"  key: {ts_inline_literal(key)},",
                        "  levels: 1,",
                        "  modifiers: [],",
                        *([passive_body] if passive_body is not None else []),
                        "}",
                    ]
                )
            )
            continue
        inferred_ultimate_cost = parse_ultimate_cost_multiplier(
            data_list,
            ultimate_skill_ids,
            f"PotentialTalentEffectTable.{effect_id}.dataList",
        )
        if inferred_ultimate_cost is not None:
            if kind not in {None, "multiplyUltimateCost"}:
                raise ValueError(
                    f"potential {key}: source is an ultimate cost multiplier, not {kind!r}"
                )
            kind = "multiplyUltimateCost"
        data: dict[str, Any] | None = None
        if kind not in {
            "staticAttributes",
            "skillBlackboardPatch",
            "skillAndPassiveBlackboardPatch",
            "skillBlackboardPatchAndAttachedBuff",
            "skillCooldownAndBlackboardPatch",
            "multiplyUltimateCost",
            "passiveBlackboardPatch",
        }:
            if len(data_list) != 1:
                raise ValueError(f"{effect_id}: expected one effect entry")
            data = require_dict(data_list[0], f"{effect_id}.dataList[0]")
        if kind == "staticAttributes":
            body = _render_static_attribute_modifiers(
                parse_static_attribute_progression(
                    data_list,
                    f"PotentialTalentEffectTable.{effect_id}.dataList",
                    mode="strict",
                )
            )
        elif kind == "skillBlackboardPatch":
            body = _render_skill_blackboard_patch_modifiers(
                [require_dict(entry, f"{effect_id}.dataList[{index}]") for index, entry in enumerate(data_list)],
                f"PotentialTalentEffectTable.{effect_id}.dataList",
                operator,
                skills,
                multi_level=False,
            )
        elif kind == "skillAndPassiveBlackboardPatch":
            body = _render_skill_and_passive_blackboard_patch_modifiers(
                [
                    require_dict(entry, f"{effect_id}.dataList[{index}]")
                    for index, entry in enumerate(data_list)
                ],
                f"PotentialTalentEffectTable.{effect_id}.dataList",
                operator,
                skills,
                passive_skills,
            )
        elif kind == "skillBlackboardPatchAndAttachedBuff":
            body = _render_skill_blackboard_patch_and_attached_buff(
                [
                    require_dict(entry, f"{effect_id}.dataList[{index}]")
                    for index, entry in enumerate(data_list)
                ],
                f"PotentialTalentEffectTable.{effect_id}.dataList",
                operator,
                skills,
                buff_definitions,
                compile_buff_definition,
            )
        elif kind == "skillCooldownAndBlackboardPatch":
            body = _render_skill_cooldown_and_blackboard_patch_modifiers(
                [require_dict(entry, f"{effect_id}.dataList[{index}]") for index, entry in enumerate(data_list)],
                f"PotentialTalentEffectTable.{effect_id}.dataList",
                operator,
                skills,
            )
        elif kind == "attachedBuff":
            assert data is not None
            body = _render_attached_buff_initialization(
                data,
                f"PotentialTalentEffectTable.{effect_id}.dataList[0]",
                buff_definitions,
                compile_buff_definition,
            )
        elif kind == "skillSpGainAttackStack":
            assert data is not None
            body = _render_skill_sp_gain_attack_stack(
                data,
                f"PotentialTalentEffectTable.{effect_id}.dataList[0]",
                buff_definitions,
            )
        elif kind == "passiveBlackboardPatch":
            lines = ["  modifiers: ["]
            for entry_index, raw_entry in enumerate(data_list):
                entry_path = (
                    f"PotentialTalentEffectTable.{effect_id}.dataList[{entry_index}]"
                )
                entry = require_dict(raw_entry, entry_path)
                if _effect_payload_kinds(entry, entry_path) != ("skillBbModifier",):
                    raise ValueError(f"{entry_path}: expected only skillBbModifier")
                modifier = require_dict(
                    entry.get("skillBbModifier"), f"{entry_path}.skillBbModifier"
                )
                passive_skill_id = modifier.get("skillId")
                if not isinstance(passive_skill_id, str) or not passive_skill_id:
                    raise ValueError(
                        f"{entry_path}.skillBbModifier.skillId: expected passive skill id"
                    )
                passive = passive_skills.get(passive_skill_id)
                if passive is None or not passive.can_generate_add_buff:
                    raise ValueError(
                        f"{entry_path}: target passive {passive_skill_id!r} is not generated"
                    )
                blackboard_key = modifier.get("bbKey")
                if blackboard_key not in passive.declared_blackboard_keys:
                    raise ValueError(
                        f"{entry_path}: passive {passive_skill_id!r} has no blackboard "
                        f"{blackboard_key!r}"
                    )
                operation = SKILL_BB_MODIFIER_OPERATIONS.get(modifier.get("modifyType"))
                if operation is None:
                    raise ValueError(
                        f"{entry_path}.skillBbModifier.modifyType: unsupported "
                        f"{modifier.get('modifyType')!r}"
                    )
                value = float(
                    require_number(
                        modifier.get("floatValue"),
                        f"{entry_path}.skillBbModifier.floatValue",
                    )
                )
                reaction_projection = collected_buff_reaction_projection(
                    passive, buff_definitions
                )
                if reaction_projection is not None:
                    reaction, duration_key, effectiveness_key = reaction_projection
                    if operation != "add":
                        raise ValueError(
                            f"{entry_path}: reaction projection only supports additive patches"
                        )
                    if blackboard_key == duration_key:
                        kind = "addReactionDuration"
                        value_field = "seconds"
                    elif blackboard_key == effectiveness_key:
                        kind = "addReactionEffectiveness"
                        value_field = "value"
                    else:
                        raise ValueError(
                            f"{entry_path}: blackboard {blackboard_key!r} is not a projected "
                            "reaction input"
                        )
                    lines.extend(
                        [
                            "    {",
                            f"      kind: {ts_inline_literal(kind)},",
                            f"      reaction: {ts_inline_literal(reaction)},",
                            f"      {value_field}: {ts_inline_literal(value)},",
                            "    },",
                        ]
                    )
                    continue
                lines.extend(
                    [
                        "    {",
                        "      kind: 'patchPassiveBlackboard',",
                        f"      passiveSkillKey: {ts_inline_literal(passive_skill_id)},",
                        f"      blackboardKey: {ts_inline_literal(blackboard_key)},",
                        f"      operation: {ts_inline_literal(operation)},",
                        f"      value: {ts_inline_literal(value)},",
                        "    },",
                    ]
                )
            lines.append("  ],")
            body = "\n".join(lines)
        elif kind in {"multiplyReactionDuration", "setReactionEffectiveness", "addUltimateCriticalRate"}:
            assert data is not None
            modifier = require_dict(data.get("skillBbModifier"), f"{effect_id}.skillBbModifier")
            value = float(modifier["floatValue"])
            if kind == "multiplyReactionDuration":
                combo_skill_id = skill_id_by_key(skills, "comboSkill")
                if modifier.get("skillId") != combo_skill_id or modifier.get("bbKey") != "duration":
                    raise ValueError(f"{effect_id}: unexpected reaction duration modifier target")
                body = "\n".join(
                    [
                        "  modifiers: [",
                        "    {",
                        "      kind: 'multiplyEffectDuration',",
                        "      skillGroupKey: 'comboSkill',",
                        "      stepKey: 'comboSkill.electrification',",
                        f"      multiplier: {ts_inline_literal(value)},",
                        "    },",
                        "  ],",
                    ]
                )
            elif kind == "setReactionEffectiveness":
                combo_skill_id = skill_id_by_key(skills, "comboSkill")
                if modifier.get("skillId") != combo_skill_id or modifier.get("bbKey") != "extra_scaling":
                    raise ValueError(f"{effect_id}: unexpected reaction effectiveness modifier target")
                body = "\n".join(
                    [
                        "  modifiers: [",
                        "    {",
                        "      kind: 'setEffectiveness',",
                        "      skillGroupKey: 'comboSkill',",
                        "      stepKey: 'comboSkill.electrification',",
                        f"      value: {ts_inline_literal(value)},",
                        "    },",
                        "  ],",
                    ]
                )
            else:
                if modifier.get("skillId") != ultimate_skill_id or modifier.get("bbKey") != "crit":
                    raise ValueError(f"{effect_id}: unexpected ultimate critical-rate modifier target")
                body = "\n".join(
                    [
                        "  modifiers: [",
                        "    {",
                        "      kind: 'addSkillStat',",
                        "      skillGroupKey: 'ultimate',",
                        "      stat: 'criticalRate',",
                        f"      value: {ts_inline_literal(value)},",
                        "    },",
                        "  ],",
                    ]
                )
        elif kind == "multiplyUltimateCost":
            assert inferred_ultimate_cost is not None
            body = "\n".join(
                [
                    "  modifiers: [",
                    "    {",
                    "      kind: 'multiplySkillCost',",
                    "      skillGroupKey: 'ultimate',",
                    "      resource: 'ultimateEnergy',",
                    f"      multiplier: {ts_inline_literal(inferred_ultimate_cost.multiplier)},",
                    "    },",
                    "  ],",
                ]
            )
        elif kind == "attackAfterReaction":
            assert data is not None
            attach = require_dict(data.get("attachBuff"), f"{effect_id}.attachBuff")
            values = {str(item["key"]): float(item["value"]) for item in require_list(attach.get("blackboard"), "attachBuff.blackboard")}
            buff_id = attach.get("buffId")
            if not isinstance(buff_id, str) or not buff_id or set(values) != {"atk_up", "atk_duration", "max_stack"}:
                raise ValueError(f"{effect_id}: unexpected reaction attack buff shape")
            body = "\n".join(
                [
                    "  eventHandlers: [",
                    "    {",
                    "      event: { kind: 'reactionApplied', reaction: 'electrification' },",
                    "      sequence: sequence(",
                    "        step('applyBuff', {",
                    "          buffId: 'buff_chr_0004_pelica_potential_3_atkup',",
                    "          definition: {",
                    "            stackingType: 'enhanceAndRefresh',",
                    f"            maxStackCount: {ts_inline_literal(values['max_stack'])},",
                    f"            durationSeconds: {ts_inline_literal(values['atk_duration'])},",
                    "            attributeModifiers: [",
                    "              {",
                    "                attribute: 'Atk',",
                    "                slot: 'baseMultiplier',",
                    f"                value: {ts_inline_literal(values['atk_up'])},",
                    "              },",
                    "            ],",
                    "          },",
                    "          target: 'caster',",
                    "        }),",
                    "      ),",
                    "    },",
                    "  ],",
                ]
            )
        else:
            raise ValueError(f"potential {key}: unsupported compiler {kind!r}")
        result.append(
            "\n".join(
                [
                    "{",
                    f"  key: {ts_inline_literal(key)},",
                    "  levels: 1,",
                    body,
                    "}",
                ]
            )
        )
    return result
