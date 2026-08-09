"""把构筑期静态装备效果严格适配为当前 Next 装备修正候选定义。"""

from __future__ import annotations

from collections import Counter
from copy import deepcopy
import math
from typing import Any

from .audit_schema import AuditFailure


BUILD_STATIC_CLASS = "buildStaticContribution"
MIGRATION_CLASSES = {
    BUILD_STATIC_CLASS,
    "battlePersistentModifier",
    "eventTriggeredBehavior",
    "oneTimeBehavior",
    "currentlyUnsupported",
}

ATTRIBUTE_MAP = {
    "strength": "strength",
    "agility": "agility",
    "intellect": "intellect",
    "will": "will",
    "main": "main",
    "sub": "secondary",
}

PANEL_STAT_MAP: dict[str, tuple[str, bool]] = {
    "atkFlat": ("attackFlat", False),
    "atkPercent": ("attackPercent", True),
    "flatHp": ("healthFlat", False),
    "hpPercent": ("healthPercent", True),
    "flatDef": ("defenseFlat", False),
    "defPercent": ("defensePercent", True),
    "critRate": ("criticalRate", True),
    "critDmg": ("criticalDamage", True),
    "artsIntensity": ("artsIntensity", False),
    "ultimateGainEfficiency": ("ultimateEnergyGainEfficiency", True),
}

DAMAGE_TYPES = {"physical", "heat", "cryo", "electric", "nature"}
# 原生技能类型增伤由 DamageDecorateMask 选择，与 DamageType 独立；LifeDrain
# 最终值路径明确绕过 DamageScale，因此只排除该类型。
SKILL_SCOPED_DAMAGE_TYPES = [
    "physical", "true", "heat", "electric", "cryo", "nature", "ether",
]
DEFAULT_ALL_SKILL_TYPES = ["battleSkill", "comboSkill", "ultimate"]
SKILL_TYPE_MAP: dict[str, list[str]] = {
    "basicAttack": ["basicAttack", "finisher", "plungingAttack"],
    "battleSkill": ["battleSkill"],
    "comboSkill": ["comboSkill"],
    "ultimate": ["ultimate"],
    "finalStrike": ["finisher"],
    "dive": ["plungingAttack"],
}

KNOWN_STATIC_MODIFIERS = (
    set(PANEL_STAT_MAP)
    | {"attributeFlat", "attributePercent", "attributeAtkPercent", "dmgBonus", "ampBonus"}
)


def _finite_level_values(value: Any, path: str) -> int | float | list[int | float]:
    values = value if isinstance(value, list) else [value]
    if not values:
        raise AuditFailure(path, "等级值数组不能为空")
    for index, entry in enumerate(values):
        if isinstance(entry, bool) or not isinstance(entry, (int, float)) or not math.isfinite(entry):
            raise AuditFailure(f"{path}[{index}]", "应为有限数值")
    return deepcopy(value)


def _scale_percent(value: Any, path: str) -> float | list[float]:
    checked = _finite_level_values(value, path)
    if isinstance(checked, list):
        return [entry / 100 for entry in checked]
    return checked / 100


def _enum_values(value: Any, allowed: set[str], path: str) -> str | list[str]:
    values = value if isinstance(value, list) else [value]
    if not values:
        raise AuditFailure(path, "枚举数组不能为空")
    for index, entry in enumerate(values):
        if entry not in allowed:
            raise AuditFailure(f"{path}[{index}]", f"未知枚举值：{entry!r}")
    return deepcopy(value)


def _mapped_skill_types(value: Any, path: str) -> str | list[str]:
    checked = _enum_values(value, set(SKILL_TYPE_MAP), path)
    source_values = checked if isinstance(checked, list) else [checked]
    mapped = list(dict.fromkeys(
        target for source in source_values for target in SKILL_TYPE_MAP[source]
    ))
    return mapped[0] if len(mapped) == 1 else mapped


def _reject_stat_fields(stat: dict[str, Any], allowed: set[str], path: str) -> None:
    unknown = sorted(set(stat) - allowed)
    if unknown:
        raise AuditFailure(path, f"当前 modifier 出现未预期字段：{', '.join(unknown)}")


def _gap(code: str, detail: str) -> dict[str, str]:
    return {"code": code, "detail": detail}


def _adapt_static_effect(effect: dict[str, Any], path: str) -> tuple[dict[str, Any] | None, bool, dict[str, str] | None]:
    if effect.get("kind") != "status":
        raise AuditFailure(path, "构筑期静态贡献必须是 status")
    stat = effect.get("stat")
    if not isinstance(stat, dict):
        raise AuditFailure(f"{path}.stat", "构筑期静态贡献必须携带 stat 对象")
    modifier = stat.get("modifier")
    if modifier not in KNOWN_STATIC_MODIFIERS:
        raise AuditFailure(f"{path}.stat.modifier", f"未知静态 modifier：{modifier!r}")
    if effect.get("target", "self") != "self":
        raise AuditFailure(f"{path}.target", "构筑期静态贡献只能面向 self")
    if effect.get("external"):
        return None, False, _gap("external-stacking-unsupported", "当前 DSL 无法表达 external 独立乘区")
    value = effect.get("value")
    if value is None:
        raise AuditFailure(f"{path}.value", "静态修正缺少 value")

    if modifier in {"attributeFlat", "attributePercent"}:
        _reject_stat_fields(stat, {"modifier", "attribute"}, f"{path}.stat")
        attribute = stat.get("attribute")
        if isinstance(attribute, list):
            return None, True, _gap("multiple-attributes-unsupported", "当前 DSL 的单条 attribute 不能同时指向多个四维属性")
        if attribute not in ATTRIBUTE_MAP:
            raise AuditFailure(f"{path}.stat.attribute", f"未知属性：{attribute!r}")
        return {
            "kind": "attribute",
            "attribute": ATTRIBUTE_MAP[attribute],
            "operation": "flat" if modifier == "attributeFlat" else "percent",
            "value": _finite_level_values(value, f"{path}.value")
            if modifier == "attributeFlat"
            else _scale_percent(value, f"{path}.value"),
        }, True, None

    if modifier in PANEL_STAT_MAP:
        _reject_stat_fields(stat, {"modifier"}, f"{path}.stat")
        panel_stat, is_percent = PANEL_STAT_MAP[modifier]
        return {
            "kind": "panelStat",
            "stat": panel_stat,
            "value": _scale_percent(value, f"{path}.value")
            if is_percent
            else _finite_level_values(value, f"{path}.value"),
        }, True, None

    if modifier == "dmgBonus":
        _reject_stat_fields(stat, {"modifier", "elements", "skillTypes"}, f"{path}.stat")
        definition: dict[str, Any] = {
            "kind": "damageBonus",
            "damageTypes": _enum_values(stat["elements"], DAMAGE_TYPES, f"{path}.stat.elements")
            if "elements" in stat
            else list(SKILL_SCOPED_DAMAGE_TYPES),
            "value": _scale_percent(value, f"{path}.value"),
        }
        if "skillTypes" in stat:
            definition["skillTypes"] = _mapped_skill_types(stat["skillTypes"], f"{path}.stat.skillTypes")
        elif "elements" not in stat:
            # 旧版“所有技能伤害”明确只覆盖战技、连携技和终结技。
            definition["skillTypes"] = list(DEFAULT_ALL_SKILL_TYPES)
        return definition, False, None

    if modifier == "attributeAtkPercent":
        _reject_stat_fields(stat, {"modifier", "attribute"}, f"{path}.stat")
        return None, True, _gap(
            "attribute-attack-coefficient-unsupported",
            "该 modifier 修改四维到攻击力的换算系数，不能等价改写为 attackPercent",
        )
    if modifier == "ampBonus":
        _reject_stat_fields(stat, {"modifier", "elements", "skillTypes"}, f"{path}.stat")
        return None, False, _gap(
            "amplification-channel-unsupported",
            "ampBonus 属于独立伤害增幅乘区，当前 DSL 只有 damageBonus",
        )
    raise AssertionError(f"unhandled static modifier: {modifier}")


def _group_key(source: dict[str, Any]) -> str:
    if source["kind"] == "weapon":
        return f"weaponTrait.{source['slot']}"
    if source["kind"] == "gearPiece":
        return f"gearTrait.{source['slot']}"
    if source["kind"] == "gearSet":
        return "gearSet.setBonus"
    raise AuditFailure("$.entries[].source.kind", f"未知来源类型：{source['kind']!r}")


def _trigger_filter_modifiers(trigger: Any) -> set[str]:
    if not isinstance(trigger, dict):
        return set()
    status = trigger.get("status")
    statuses = status if isinstance(status, list) else [status]
    return {
        entry["modifier"]
        for entry in statuses
        if isinstance(entry, dict) and isinstance(entry.get("modifier"), str)
    }


def build_candidate_definition_ir(migration_ir: Any) -> dict[str, Any]:
    """生成候选定义；任何未映射语义都只报告缺口，不生成 raw 兜底。"""
    if not isinstance(migration_ir, dict) or migration_ir.get("schemaVersion") != 1:
        raise AuditFailure("$.schemaVersion", "只支持迁移 IR schemaVersion 1")
    entries = migration_ir.get("entries")
    if not isinstance(entries, list):
        raise AuditFailure("$.entries", "应为数组")

    output_entries: list[dict[str, Any]] = []
    status_counts: Counter[str] = Counter()
    gap_counts: Counter[str] = Counter()
    modifier_counts: dict[str, Counter[str]] = {}
    group_counts: dict[str, Counter[str]] = {}
    trigger_filter_identities: dict[str, set[tuple[str, str, str]]] = {}

    for index, entry in enumerate(entries):
        path = f"$.entries[{index}]"
        classification = entry.get("classification", {}).get("kind")
        if classification not in MIGRATION_CLASSES:
            raise AuditFailure(f"{path}.classification.kind", f"未知迁移类别：{classification!r}")
        source = entry.get("source")
        if not isinstance(source, dict):
            raise AuditFailure(f"{path}.source", "应为对象")
        group = _group_key(source)
        trigger_path = source.get("effectPath", "").split(".effects[", 1)[0]
        for trigger_modifier in _trigger_filter_modifiers(entry.get("semantics", {}).get("trigger")):
            trigger_filter_identities.setdefault(trigger_modifier, set()).add(
                (source["kind"], source["slug"], trigger_path)
            )
        result: dict[str, Any] = {
            "id": entry.get("id"),
            "source": deepcopy(source),
            "group": group,
            "buildTimeDeterminable": classification == BUILD_STATIC_CLASS,
        }
        if classification != BUILD_STATIC_CLASS:
            status = "outsideStaticDefinitionScope"
            result.update({"status": status, "characterPanelVisible": False})
            modifier = entry.get("semantics", {}).get("modifier") or entry.get("semantics", {}).get("effectKind")
        else:
            effect = entry.get("sourceEffect")
            if not isinstance(effect, dict):
                raise AuditFailure(f"{path}.sourceEffect", "应为对象")
            modifier = effect.get("stat", {}).get("modifier")
            candidate, panel_visible, gap = _adapt_static_effect(effect, f"{path}.sourceEffect")
            if candidate is not None:
                status = "definitionReady"
                result.update({
                    "status": status,
                    "characterPanelVisible": panel_visible,
                    "sourceModifier": modifier,
                    "candidateDefinition": candidate,
                })
            else:
                assert gap is not None
                status = "dslGap"
                result.update({
                    "status": status,
                    "characterPanelVisible": panel_visible,
                    "sourceModifier": modifier,
                    "gap": gap,
                })
                gap_counts[gap["code"]] += 1
        status_counts[status] += 1
        modifier_counts.setdefault(str(modifier), Counter())[status] += 1
        group_counts.setdefault(group, Counter())[status] += 1
        output_entries.append(result)

    return {
        "schemaVersion": 1,
        "status": "complete",
        "sourceMigrationSchemaVersion": migration_ir["schemaVersion"],
        "summary": {
            "effectCount": len(output_entries),
            "buildStaticCount": sum(1 for entry in output_entries if entry["buildTimeDeterminable"]),
            "definitionReadyCount": status_counts["definitionReady"],
            "dslGapCount": status_counts["dslGap"],
            "outsideStaticDefinitionScopeCount": status_counts["outsideStaticDefinitionScope"],
            "characterPanelVisibleReadyCount": sum(
                1 for entry in output_entries
                if entry["status"] == "definitionReady" and entry["characterPanelVisible"]
            ),
            "buildOnlyReadyCount": sum(
                1 for entry in output_entries
                if entry["status"] == "definitionReady" and not entry["characterPanelVisible"]
            ),
            "statusCounts": dict(sorted(status_counts.items())),
            "gapReasonCounts": dict(sorted(gap_counts.items())),
            "modifierStatusCounts": {
                key: dict(sorted(value.items())) for key, value in sorted(modifier_counts.items())
            },
            "groupStatusCounts": {
                key: dict(sorted(value.items())) for key, value in sorted(group_counts.items())
            },
            "specialModifierAudit": {
                modifier: {
                    "effectCount": sum(modifier_counts.get(modifier, {}).values()),
                    "buildStaticCount": modifier_counts.get(modifier, {}).get("definitionReady", 0)
                    + modifier_counts.get(modifier, {}).get("dslGap", 0),
                    "definitionReadyCount": modifier_counts.get(modifier, {}).get("definitionReady", 0),
                    "dslGapCount": modifier_counts.get(modifier, {}).get("dslGap", 0),
                    "triggerFilterCount": len(trigger_filter_identities.get(modifier, set())),
                }
                for modifier in ("dmgBonus", "ampBonus", "attributeAtkPercent")
            },
        },
        "entries": output_entries,
    }
