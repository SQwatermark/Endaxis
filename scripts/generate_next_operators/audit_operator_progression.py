"""审计全干员天赋与潜能的原生效果形状。

该工具只盘点 TableCfg 事实，不生成近似 DSL。它用于确定养成转换器应优先支持的通用载荷，
并在数据更新后检查是否出现未知组合或缺失引用。
"""

from __future__ import annotations

import argparse
from collections import Counter
import json
from pathlib import Path
from typing import Any

from progression_renderer import (
    ATTRIBUTE_TYPE_SEMANTICS,
    BASE_PANEL_ATTRIBUTE_TYPES,
    BUILD_ATTRIBUTE_TYPES,
    MODIFIER_TYPE_NAMES,
    STATIC_DAMAGE_INCREASE_ATTRIBUTE_TYPES,
    parse_static_attribute_progression,
    parse_ultimate_cost_multiplier,
)
from source_utils import require_dict, require_list


SCRIPT_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = SCRIPT_DIR.parents[1]
DEFAULT_TABLES = (
    REPOSITORY_ROOT.parent
    / "vfs-index-browser"
    / "combat-spec"
    / "artifacts"
    / "TableCfg-1.4.4-8764515-7"
)
OBSOLETE_CHARACTER_IDS = {"chr_0002_endminm", "chr_0003_endminf"}

EFFECT_PAYLOAD_KINDS = (
    "activeCondition",
    "attachBuff",
    "attachSkill",
    "attrModifier",
    "skillBbModifier",
    "skillParamModifier",
)

# 这些属性的原生身份已经确认，但当前 Next 尚无方向与生命周期均等价的消费链。
# 审计保留结构化缺口，避免后续维护者把“已知但不可转换”误当成未知枚举。
NEXT_RUNTIME_CLOSURE_GAPS: dict[int, dict[str, Any]] = {
    29: {
        "nativeFormulaSlot": "BaseAddition",
        "nativeConsumer": "healing output calculation",
        "nextStatus": "missing-runtime-consumer",
        "blockers": [
            "healing operation executor",
            "healing formula and source/target snapshots",
            "healing event lifecycle",
        ],
        "forbiddenApproximation": "panel stat or damage modifier",
    },
    60: {
        "nativeFormulaSlot": "BaseAddition",
        "nativeConsumer": "ether damage defender resistance factor",
        "nextStatus": "missing-operator-defender-runtime",
        "blockers": [
            "operator incoming-damage snapshot",
            "operator incoming-damage execution path",
        ],
        "forbiddenApproximation": "enemy defender resistance snapshot",
    },
}

# 原生技能参数 Patch 的数据语义和 Next 消费链都闭环后，审计才允许把候选标为可转换。
SKILL_PARAMETER_CONVERSION_CANDIDATES: dict[str, dict[str, Any]] = {
    "ultimateCostMultiplier": {
        "priority": 1,
        "nativeParameter": "CostValue",
        "nativeOperation": "Multiply",
        "nextDefinitionKind": "multiplySkillCost",
        "nextStatus": "implemented",
        "blockers": [],
        "implementationDecision": "generate",
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tables", type=Path, default=DEFAULT_TABLES)
    parser.add_argument("--json-output", type=Path)
    return parser.parse_args()


def load_table(tables: Path, name: str) -> dict[str, Any]:
    path = tables / name
    return require_dict(json.loads(path.read_text(encoding="utf-8")), str(path))


def render_json(value: Any, indent: int = 0) -> str:
    """稳定输出审计 JSON；标量数组保持单行，避免重建报告产生无意义格式差异。"""
    prefix = " " * indent
    child_prefix = " " * (indent + 2)
    if isinstance(value, dict):
        if not value:
            return "{}"
        lines = ["{"]
        items = list(value.items())
        for index, (key, item) in enumerate(items):
            rendered = render_json(item, indent + 2)
            comma = "," if index + 1 < len(items) else ""
            lines.append(
                f"{child_prefix}{json.dumps(key, ensure_ascii=False)}: {rendered}{comma}"
            )
        lines.append(f"{prefix}}}")
        return "\n".join(lines)
    if isinstance(value, list):
        if not value:
            return "[]"
        if all(not isinstance(item, (dict, list)) for item in value):
            return json.dumps(value, ensure_ascii=False)
        lines = ["["]
        for index, item in enumerate(value):
            rendered = render_json(item, indent + 2)
            comma = "," if index + 1 < len(value) else ""
            lines.append(f"{child_prefix}{rendered}{comma}")
        lines.append(f"{prefix}]")
        return "\n".join(lines)
    return json.dumps(value, ensure_ascii=False)


def effect_payload_kinds(value: Any, path: str) -> tuple[str, ...]:
    """返回一个效果条目实际携带的载荷；多个载荷并存时保留原始组合。"""
    item = require_dict(value, path)
    kinds: list[str] = []
    if require_list(item.get("activeCondition"), f"{path}.activeCondition"):
        kinds.append("activeCondition")
    if require_dict(item.get("attachBuff"), f"{path}.attachBuff").get("buffId"):
        kinds.append("attachBuff")
    if require_dict(item.get("attachSkill"), f"{path}.attachSkill").get("skillId"):
        kinds.append("attachSkill")
    if require_dict(item.get("attrModifier"), f"{path}.attrModifier").get("attrType"):
        kinds.append("attrModifier")
    if require_dict(item.get("skillBbModifier"), f"{path}.skillBbModifier").get("skillId"):
        kinds.append("skillBbModifier")
    if require_dict(item.get("skillParamModifier"), f"{path}.skillParamModifier").get(
        "skillId"
    ):
        kinds.append("skillParamModifier")
    if not kinds:
        raise ValueError(f"{path}: effect entry has no recognized payload")
    return tuple(kinds)


def collect_skill_group_types(growth: dict[str, Any], path: str) -> dict[str, int]:
    """建立原生技能 ID 到技能组类型的严格索引；同一技能不得属于不同类型。"""
    result: dict[str, int] = {}
    groups = require_dict(growth.get("skillGroupMap"), f"{path}.skillGroupMap")
    for group_id, raw_group in groups.items():
        group_path = f"{path}.skillGroupMap.{group_id}"
        group = require_dict(raw_group, group_path)
        group_type = group.get("skillGroupType")
        if not isinstance(group_type, int):
            raise ValueError(f"{group_path}.skillGroupType: expected integer")
        for index, skill_id in enumerate(
            require_list(group.get("skillIdList"), f"{group_path}.skillIdList")
        ):
            if not isinstance(skill_id, str) or not skill_id:
                raise ValueError(f"{group_path}.skillIdList[{index}]: invalid skill id")
            existing = result.get(skill_id)
            if existing is not None and existing != group_type:
                raise ValueError(
                    f"{group_path}.skillIdList[{index}]: skill belongs to conflicting group types"
                )
            result[skill_id] = group_type
    return result


def audit_skill_parameter_candidates(
    raw_entries: Any,
    skill_group_types: dict[str, int],
    path: str,
) -> list[dict[str, Any]]:
    """记录技能参数 Patch 事实，并标出能够无损生成的通用候选。"""
    candidates: list[dict[str, Any]] = []
    for index, raw_entry in enumerate(require_list(raw_entries, path)):
        entry_path = f"{path}[{index}]"
        entry = require_dict(raw_entry, entry_path)
        modifier = require_dict(
            entry.get("skillParamModifier"),
            f"{entry_path}.skillParamModifier",
        )
        skill_id = modifier.get("skillId")
        if not isinstance(skill_id, str) or not skill_id:
            continue
        fact = {
            "entryIndex": index,
            "skillId": skill_id,
            "skillGroupType": skill_group_types.get(skill_id),
            "parameterType": modifier.get("paramType"),
            "parameterModifyType": modifier.get("modifyType"),
            "effectModifyType": entry.get("modifyType"),
            "value": modifier.get("paramValue"),
        }
        # CostValue(1) * Multiply(2) 且目标属于终结技能组(2)，才是严格的终结技降费。
        if (
            fact["effectModifyType"] == 2
            and fact["parameterType"] == 1
            and fact["parameterModifyType"] == 2
            and fact["skillGroupType"] == 2
        ):
            fact["candidate"] = "ultimateCostMultiplier"
            fact["runtimeClosure"] = SKILL_PARAMETER_CONVERSION_CANDIDATES[
                "ultimateCostMultiplier"
            ]
        candidates.append(fact)
    return candidates


def talent_effect_ids(growth: dict[str, Any], path: str) -> tuple[str, ...]:
    """按天赋索引和等级排序，提取真正的被动技能节点。"""
    entries: list[tuple[int, int, str]] = []
    nodes = require_dict(growth.get("talentNodeMap"), f"{path}.talentNodeMap")
    for node_id, raw_node in nodes.items():
        node = require_dict(raw_node, f"{path}.talentNodeMap.{node_id}")
        passive = require_dict(
            node.get("passiveSkillNodeInfo"),
            f"{path}.talentNodeMap.{node_id}.passiveSkillNodeInfo",
        )
        effect_id = passive.get("talentEffectId")
        if not effect_id:
            continue
        if not isinstance(effect_id, str):
            raise ValueError(f"{path}.talentNodeMap.{node_id}: invalid talent effect id")
        index = passive.get("index")
        level = passive.get("level")
        if not isinstance(index, int) or not isinstance(level, int):
            raise ValueError(f"{path}.talentNodeMap.{node_id}: invalid talent position")
        entries.append((index, level, effect_id))
    return tuple(effect_id for _, _, effect_id in sorted(entries))


def potential_effect_ids(potential: dict[str, Any], path: str) -> tuple[str, ...]:
    entries: list[tuple[int, str]] = []
    for index, raw_unlock in enumerate(
        require_list(potential.get("potentialUnlockBundle"), f"{path}.potentialUnlockBundle")
    ):
        unlock = require_dict(raw_unlock, f"{path}.potentialUnlockBundle[{index}]")
        level = unlock.get("level")
        effect_id = unlock.get("potentialEffectId")
        if not isinstance(level, int) or not isinstance(effect_id, str) or not effect_id:
            raise ValueError(f"{path}.potentialUnlockBundle[{index}]: invalid unlock")
        entries.append((level, effect_id))
    return tuple(effect_id for _, effect_id in sorted(entries))


def audit_effect(
    effect_id: str,
    effect_table: dict[str, Any],
    *,
    source: str,
    skill_group_types: dict[str, int] | None = None,
) -> dict[str, Any]:
    if effect_id not in effect_table:
        raise ValueError(f"PotentialTalentEffectTable: missing {effect_id}")
    effect = require_dict(effect_table[effect_id], f"PotentialTalentEffectTable.{effect_id}")
    entries = []
    attribute_facts = []
    for index, raw_entry in enumerate(
        require_list(effect.get("dataList"), f"PotentialTalentEffectTable.{effect_id}.dataList")
    ):
        kinds = effect_payload_kinds(
            raw_entry,
            f"PotentialTalentEffectTable.{effect_id}.dataList[{index}]",
        )
        entries.append({"index": index, "payloadKinds": list(kinds)})
        if "attrModifier" in kinds:
            entry = require_dict(
                raw_entry,
                f"PotentialTalentEffectTable.{effect_id}.dataList[{index}]",
            )
            modifier = require_dict(
                entry.get("attrModifier"),
                f"PotentialTalentEffectTable.{effect_id}.dataList[{index}].attrModifier",
            )
            attr_type = modifier.get("attrType")
            modifier_type = modifier.get("modifierType")
            semantic = ATTRIBUTE_TYPE_SEMANTICS.get(attr_type)
            attribute_facts.append(
                {
                    "entryIndex": index,
                    "attrType": attr_type,
                    "nativeName": semantic[0] if semantic is not None else None,
                    "semantic": semantic[1] if semantic is not None else None,
                    "modifierType": modifier_type,
                    "modifierName": MODIFIER_TYPE_NAMES.get(modifier_type),
                    "modifyAttributeType": modifier.get("modifyAttributeType"),
                    "value": modifier.get("attrValue"),
                    "nextTarget": (
                        {"kind": "buildAttribute", "attribute": BUILD_ATTRIBUTE_TYPES[attr_type]}
                        if attr_type in BUILD_ATTRIBUTE_TYPES
                        else {
                            "kind": "basePanelStat",
                            "stat": BASE_PANEL_ATTRIBUTE_TYPES[attr_type][0],
                            "operation": BASE_PANEL_ATTRIBUTE_TYPES[attr_type][1],
                        }
                        if attr_type in BASE_PANEL_ATTRIBUTE_TYPES
                        else {
                            "kind": "staticDamageIncrease",
                            "target": STATIC_DAMAGE_INCREASE_ATTRIBUTE_TYPES[attr_type],
                        }
                        if attr_type in STATIC_DAMAGE_INCREASE_ATTRIBUTE_TYPES
                        else None
                    ),
                }
            )
            if attr_type in NEXT_RUNTIME_CLOSURE_GAPS:
                attribute_facts[-1]["runtimeClosure"] = NEXT_RUNTIME_CLOSURE_GAPS[attr_type]
    result = {"effectId": effect_id, "source": source, "entries": entries}
    if skill_group_types is not None and any(
        "skillParamModifier" in entry["payloadKinds"] for entry in entries
    ):
        result["skillParameterFacts"] = audit_skill_parameter_candidates(
            effect.get("dataList"),
            skill_group_types,
            f"PotentialTalentEffectTable.{effect_id}.dataList",
        )
        conversion = parse_ultimate_cost_multiplier(
            effect.get("dataList"),
            {
                skill_id
                for skill_id, group_type in skill_group_types.items()
                if group_type == 2
            },
            f"PotentialTalentEffectTable.{effect_id}.dataList",
        )
        if conversion is not None:
            result["dslConversion"] = {
                "status": "complete",
                "modifiers": [
                    {
                        "kind": "multiplySkillCost",
                        "skillGroupKey": "ultimate",
                        "resource": "ultimateEnergy",
                        "multiplier": conversion.multiplier,
                    }
                ],
                "sourceTargetSkillIds": list(conversion.target_skill_ids),
                "missingCapabilities": [],
            }
    if source == "potential" and any(
        "attrModifier" in entry["payloadKinds"] for entry in entries
    ):
        conversion = parse_static_attribute_progression(
            effect.get("dataList"),
            f"PotentialTalentEffectTable.{effect_id}.dataList",
            mode="lenient",
        )
        converted_count = len(conversion.build_attribute_modifiers) + len(
            conversion.base_panel_stat_modifiers
        ) + len(conversion.static_damage_increase_modifiers)
        result["staticAttributeConversion"] = {
            "status": (
                "complete"
                if converted_count and not conversion.issues
                else "partial"
                if converted_count
                else "unsupported"
            ),
            "attributeFacts": attribute_facts,
            "modifiers": [
                *(
                    {"kind": "addBuildAttribute", "attribute": attribute, "value": value}
                    for attribute, value in conversion.build_attribute_modifiers
                ),
                *(
                    {
                        "kind": "modifyBasePanelStat",
                        "stat": stat,
                        "operation": operation,
                        "value": value,
                    }
                    for stat, operation, value in conversion.base_panel_stat_modifiers
                ),
                *(
                    {
                        "kind": "addStaticDamageIncrease",
                        "target": target,
                        "value": value,
                    }
                    for target, value in conversion.static_damage_increase_modifiers
                ),
            ],
            "missingCapabilities": list(conversion.missing_capabilities),
            "issues": [
                {"code": issue.code, "path": issue.path, "detail": issue.detail}
                for issue in conversion.issues
            ],
        }
    return result


def build_audit(tables: Path) -> dict[str, Any]:
    characters = load_table(tables, "CharacterTable.json")
    growth_table = load_table(tables, "CharGrowthTable.json")
    potential_table = load_table(tables, "CharacterPotentialTable.json")
    effect_table = load_table(tables, "PotentialTalentEffectTable.json")

    operators = []
    entry_counts: Counter[tuple[str, str]] = Counter()
    combination_counts: Counter[tuple[str, tuple[str, ...]]] = Counter()
    static_attribute_status_counts: Counter[str] = Counter()
    runtime_closure_gap_counts: Counter[int] = Counter()
    skill_parameter_candidate_entries: Counter[str] = Counter()
    skill_parameter_candidate_effects: Counter[str] = Counter()
    skill_parameter_candidate_operators: dict[str, set[str]] = {}
    generated_skill_parameter_effects: Counter[str] = Counter()
    for character_id in sorted(set(characters).difference(OBSOLETE_CHARACTER_IDS)):
        character = require_dict(characters[character_id], f"CharacterTable.{character_id}")
        growth = require_dict(growth_table.get(character_id), f"CharGrowthTable.{character_id}")
        potential = require_dict(
            potential_table.get(character_id),
            f"CharacterPotentialTable.{character_id}",
        )
        skill_group_types = collect_skill_group_types(
            growth,
            f"CharGrowthTable.{character_id}",
        )
        effects = [
            *(
                audit_effect(
                    effect_id,
                    effect_table,
                    source="talent",
                    skill_group_types=skill_group_types,
                )
                for effect_id in talent_effect_ids(growth, f"CharGrowthTable.{character_id}")
            ),
            *(
                audit_effect(
                    effect_id,
                    effect_table,
                    source="potential",
                    skill_group_types=skill_group_types,
                )
                for effect_id in potential_effect_ids(
                    potential,
                    f"CharacterPotentialTable.{character_id}",
                )
            ),
        ]
        for effect in effects:
            source = effect["source"]
            conversion = effect.get("staticAttributeConversion")
            if conversion is not None:
                static_attribute_status_counts[conversion["status"]] += 1
                for fact in conversion["attributeFacts"]:
                    if "runtimeClosure" in fact:
                        runtime_closure_gap_counts[fact["attrType"]] += 1
            effect_candidates = {
                fact["candidate"]
                for fact in effect.get("skillParameterFacts", [])
                if "candidate" in fact
            }
            for fact in effect.get("skillParameterFacts", []):
                candidate = fact.get("candidate")
                if candidate is None:
                    continue
                skill_parameter_candidate_entries[candidate] += 1
                skill_parameter_candidate_operators.setdefault(candidate, set()).add(
                    character_id
                )
            for candidate in effect_candidates:
                skill_parameter_candidate_effects[candidate] += 1
                if effect.get("dslConversion", {}).get("status") == "complete":
                    generated_skill_parameter_effects[candidate] += 1
            for entry in effect["entries"]:
                kinds = tuple(entry["payloadKinds"])
                combination_counts[(source, kinds)] += 1
                for kind in kinds:
                    entry_counts[(source, kind)] += 1
        operators.append(
            {
                "characterId": character_id,
                "name": character.get("engName", character_id),
                "talentEffectCount": sum(item["source"] == "talent" for item in effects),
                "potentialEffectCount": sum(item["source"] == "potential" for item in effects),
                "effects": effects,
            }
        )

    return {
        "schemaVersion": 6,
        "summary": {
            "operatorCount": len(operators),
            "effectCount": sum(len(operator["effects"]) for operator in operators),
            "entryCounts": [
                {"source": source, "payloadKind": kind, "count": count}
                for (source, kind), count in sorted(entry_counts.items())
            ],
            "combinationCounts": [
                {"source": source, "payloadKinds": list(kinds), "count": count}
                for (source, kinds), count in sorted(combination_counts.items())
            ],
            "staticAttributePotentialCounts": dict(
                sorted(static_attribute_status_counts.items())
            ),
            "runtimeClosureGaps": [
                {
                    "attrType": attr_type,
                    "occurrenceCount": count,
                    **NEXT_RUNTIME_CLOSURE_GAPS[attr_type],
                }
                for attr_type, count in sorted(runtime_closure_gap_counts.items())
            ],
            "conversionCandidatePriorities": [
                {
                    "candidate": candidate,
                    "sourceEntryCount": skill_parameter_candidate_entries[candidate],
                    "effectCount": skill_parameter_candidate_effects[candidate],
                    "operatorCount": len(
                        skill_parameter_candidate_operators.get(candidate, set())
                    ),
                    "generatedEffectCount": generated_skill_parameter_effects[candidate],
                    **definition,
                }
                for candidate, definition in sorted(
                    SKILL_PARAMETER_CONVERSION_CANDIDATES.items(),
                    key=lambda item: item[1]["priority"],
                )
                if skill_parameter_candidate_entries[candidate]
            ],
        },
        "operators": operators,
    }


def main() -> None:
    args = parse_args()
    document = build_audit(args.tables)
    summary = document["summary"]
    if args.json_output is not None:
        args.json_output.parent.mkdir(parents=True, exist_ok=True)
        args.json_output.write_text(
            render_json(document) + "\n",
            encoding="utf-8",
        )
    print(
        f"audited {summary['operatorCount']} operators / "
        f"{summary['effectCount']} talent and potential effects"
    )
    for item in summary["entryCounts"]:
        print(f"{item['source']}.{item['payloadKind']}: {item['count']}")


if __name__ == "__main__":
    main()
