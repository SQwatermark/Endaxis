"""将干员天赋与潜能的解包事实渲染为 Next DSL 片段。

该模块只负责养成效果转换；调用方必须先完成技能来源解析，并提供严格校验过的 TableCfg 表。
"""

from __future__ import annotations

from typing import Any

from source_models import SkillSource
from source_utils import require_dict, require_list, require_non_negative_int, table_row, ts_inline_literal

__all__ = ["render_potentials", "render_talents", "skill_id_by_key"]

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
        if len(data_list) != 1:
            raise ValueError(f"{effect_id}: expected one effect entry")
        data = require_dict(data_list[0], f"{effect_id}.dataList[0]")
        key = str(config["key"])
        kind = config.get("compile")
        if kind in {"multiplyReactionDuration", "setReactionEffectiveness", "addUltimateCriticalRate"}:
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


