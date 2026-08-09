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
    "BuildAttributeProgressionResult",
    "BUILD_ATTRIBUTE_TYPES",
    "ProgressionConversionIssue",
    "parse_build_attribute_progression",
    "render_potentials",
    "render_talents",
    "skill_id_by_key",
]


BuildAttributeName = Literal["strength", "agility", "intellect", "will"]
BUILD_ATTRIBUTE_TYPES: dict[int, BuildAttributeName] = {
    39: "strength",
    40: "agility",
    41: "intellect",
    42: "will",
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
class BuildAttributeProgressionResult:
    """潜能永久四维加点的可转换部分及未转换能力。"""

    modifiers: tuple[tuple[BuildAttributeName, int], ...]
    issues: tuple[ProgressionConversionIssue, ...]
    missing_capabilities: tuple[Literal["potentialEffects"], ...]


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


def parse_build_attribute_progression(
    raw_entries: Any,
    path: str,
    *,
    mode: Literal["strict", "lenient"] = "strict",
) -> BuildAttributeProgressionResult:
    """解析潜能中的永久四维加点；宽松模式绝不把未识别载荷伪装成已转换。"""
    if mode not in {"strict", "lenient"}:
        raise ValueError(f"{path}: unsupported progression conversion mode {mode!r}")
    modifiers: list[tuple[BuildAttributeName, int]] = []
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
        if modifier.get("modifierType") != 5 or modifier.get("modifyAttributeType") != 0:
            reject(
                "unsupported-attribute-modifier-mode",
                modifier_path,
                "expected modifierType=5 and modifyAttributeType=0",
            )
            continue
        attribute = BUILD_ATTRIBUTE_TYPES.get(modifier.get("attrType"))
        if attribute is None:
            reject(
                "unsupported-attribute-type",
                f"{modifier_path}.attrType",
                f"unsupported build attribute {modifier.get('attrType')!r}",
            )
            continue
        if any(existing == attribute for existing, _ in modifiers):
            reject(
                "duplicate-build-attribute",
                modifier_path,
                f"duplicate build attribute {attribute!r}",
            )
            continue
        value = require_number(modifier.get("attrValue"), f"{modifier_path}.attrValue")
        if not value.is_integer():
            reject(
                "non-integer-build-attribute",
                f"{modifier_path}.attrValue",
                f"expected integer build attribute value, got {value!r}",
            )
            continue
        modifiers.append((attribute, int(value)))

    return BuildAttributeProgressionResult(
        modifiers=tuple(modifiers),
        issues=tuple(issues),
        missing_capabilities=("potentialEffects",) if issues else (),
    )


def _render_build_attribute_modifiers(result: BuildAttributeProgressionResult) -> str:
    if not result.modifiers:
        raise ValueError("build attribute potential: expected at least one converted modifier")
    grouped: list[tuple[int, list[BuildAttributeName]]] = []
    for attribute, value in result.modifiers:
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
    lines.append("  ],")
    return "\n".join(lines)


def skill_id_by_key(skills: list[SkillSource], key: str) -> str:
    matches = [skill.skillId for skill in skills if skill.key == key]
    if len(matches) != 1:
        raise ValueError(f"operator skills: expected exactly one skill with key {key!r}")
    return matches[0]


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
    ultimate_skill_id = skill_id_by_key(skills, "ultimate")
    for raw_unlock, raw_config in zip(unlocks, configs, strict=True):
        unlock = require_dict(raw_unlock, f"{char_id}.potentialUnlockBundle[]")
        config = require_dict(raw_config, f"{operator['slug']}.potentials[]")
        effect_id = str(unlock["potentialEffectId"])
        effect = table_row(effects, effect_id, "PotentialTalentEffectTable")
        data_list = require_list(effect.get("dataList"), f"{effect_id}.dataList")
        key = str(config["key"])
        kind = config.get("compile")
        data: dict[str, Any] | None = None
        if kind != "buildAttributes":
            if len(data_list) != 1:
                raise ValueError(f"{effect_id}: expected one effect entry")
            data = require_dict(data_list[0], f"{effect_id}.dataList[0]")
        if kind == "buildAttributes":
            body = _render_build_attribute_modifiers(
                parse_build_attribute_progression(
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
            assert data is not None
            modifier = require_dict(data.get("skillParamModifier"), f"{effect_id}.skillParamModifier")
            if modifier.get("skillId") != ultimate_skill_id or modifier.get("paramType") != 1:
                raise ValueError(f"{effect_id}: unexpected ultimate cost modifier target")
            value = float(modifier["paramValue"])
            body = "\n".join(
                [
                    "  modifiers: [",
                    "    {",
                    "      kind: 'multiplySkillCost',",
                    "      skillGroupKey: 'ultimate',",
                    "      resource: 'ultimateEnergy',",
                    f"      multiplier: {ts_inline_literal(value)},",
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
