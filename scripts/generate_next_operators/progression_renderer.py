"""将干员天赋与潜能的解包事实渲染为 Next DSL 片段。

该模块只负责养成效果转换；调用方必须先完成技能来源解析，并提供严格校验过的 TableCfg 表。
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal

from source_models import SkillSource
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
) -> list[str]:
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
                        "}",
                    ]
                )
            )
            continue
        if kind == "targetStaggeredDamage":
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
) -> list[str]:
    char_id = str(operator["charId"])
    source = table_row(potential_table, char_id, "CharacterPotentialTable")
    unlocks = require_list(source.get("potentialUnlockBundle"), f"CharacterPotentialTable.{char_id}")
    configs = require_list(operator.get("potentials"), f"{operator['slug']}.potentials")
    if len(unlocks) != len(configs):
        raise ValueError(f"{char_id}: potential config count does not match source")
    result: list[str] = []
    combo_skill_id = skill_id_by_key(skills, "comboSkill")
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
        if kind not in {"staticAttributes", "multiplyUltimateCost"}:
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
        elif kind in {"multiplyReactionDuration", "setReactionEffectiveness", "addUltimateCriticalRate"}:
            assert data is not None
            modifier = require_dict(data.get("skillBbModifier"), f"{effect_id}.skillBbModifier")
            value = float(modifier["floatValue"])
            if kind == "multiplyReactionDuration":
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
                    "        step('applyStatus', {",
                    "          statusKey: 'attackAfterElectrification',",
                    "          target: 'caster',",
                    f"          durationFrames: {ts_inline_literal(values['atk_duration'] * 30)},",
                    f"          maxStacks: {ts_inline_literal(values['max_stack'])},",
                    "          modifiers: [",
                    f"            {{ kind: 'attackPercent', value: {ts_inline_literal(values['atk_up'])} }},",
                    "          ],",
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
