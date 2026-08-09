"""把已严格校验的旧装备效果转换为无损、可穷举的装备迁移 IR。"""

from __future__ import annotations

from collections import Counter
from copy import deepcopy
from typing import Any, Iterator

from .audit_schema import AuditFailure
from .equipment_audit import audit_snapshot


MIGRATION_CLASSES = {
    "buildStaticContribution",
    "battlePersistentModifier",
    "eventTriggeredBehavior",
    "oneTimeBehavior",
    "currentlyUnsupported",
}

# 这些修饰可以由构筑解析器在开战前确定，并应成为面板/静态战斗输入的唯一数值来源。
# 这些 modifier 在不带运行时条件时可于构筑期求值，但不保证当前
# EquipmentModifierDefinition 已经能够无损表达，也不保证会显示在角色面板。
BUILD_STATIC_MODIFIERS = {
    "attributeFlat",
    "attributePercent",
    "atkFlat",
    "atkPercent",
    "attributeAtkPercent",
    "flatHp",
    "hpPercent",
    "flatDef",
    "defPercent",
    "artsIntensity",
    "ultimateGainEfficiency",
    "critRate",
    "critDmg",
    "dmgBonus",
    "ampBonus",
}

DYNAMIC_STATUS_FIELDS = {
    "duration",
    "durationExtension",
    "stacks",
    "maxStacks",
    "stackStrategy",
    "condition",
    "icd",
    "icdGroup",
    "scaling",
}

ENEMY_MODIFIERS = {
    "susceptibility",
    "increasedDmgTaken",
    "resistanceShred",
    "slowed",
    "weaken",
    "inflictionBarrier",
}

IMPLICIT_ENEMY_EFFECTS = {
    "infliction",
    "burst",
    "reaction",
    "physicalStatus",
    "damageHit",
    "damageOverTime",
}

LIFECYCLE_FIELDS = {
    "duration",
    "durationExtension",
    "stacks",
    "maxStacks",
    "stackStrategy",
    "icd",
    "icdGroup",
    "applyTiming",
    "ignoreTimeShift",
}


def _normalize_target(effect: dict[str, Any]) -> dict[str, Any]:
    value = effect.get("target")
    if isinstance(value, str):
        return {"scope": value, "explicit": True}
    if isinstance(value, dict):
        return {**deepcopy(value), "explicit": True}
    kind = effect["kind"]
    modifier = effect.get("stat", {}).get("modifier")
    scope = "enemy" if kind in IMPLICIT_ENEMY_EFFECTS or modifier in ENEMY_MODIFIERS else "self"
    return {"scope": scope, "explicit": False}


def _condition_kinds(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [kind for entry in value for kind in _condition_kinds(entry)]
    kind = value["kind"]
    nested = []
    if kind == "not":
        nested = _condition_kinds(value["condition"])
    elif kind == "or":
        nested = _condition_kinds(value["conditions"])
    return [kind, *nested]


def _classify(
    effect: dict[str, Any], location: str, target: dict[str, Any]
) -> tuple[str, list[str]]:
    kind = effect["kind"]
    if kind == "oneTime":
        return "oneTimeBehavior", []
    if location in {"trigger", "nestedHit"}:
        return "eventTriggeredBehavior", []
    if kind != "status":
        return "currentlyUnsupported", [f"passive-effect-kind:{kind}"]

    modifier = effect.get("stat", {}).get("modifier")
    is_static_panel = (
        modifier in BUILD_STATIC_MODIFIERS
        and target["scope"] == "self"
        and not (DYNAMIC_STATUS_FIELDS & set(effect))
    )
    if is_static_panel:
        return "buildStaticContribution", []
    return "battlePersistentModifier", []


def _requirements(
    effect: dict[str, Any], migration_class: str, target: dict[str, Any], trigger: dict[str, Any] | None
) -> list[str]:
    requirements = {f"effect.{effect['kind']}", f"target.{target['scope']}"}
    modifier = effect.get("stat", {}).get("modifier")
    if modifier is not None:
        stage = "build" if migration_class == "buildStaticContribution" else "combat"
        requirements.add(f"{stage}.modifier.{modifier}")
    if trigger is not None:
        requirements.add(f"event.{trigger['kind']}")
        if "target" in trigger:
            requirements.add(f"event-target.{trigger['target']}")
    for kind in _condition_kinds(effect.get("condition")):
        requirements.add(f"condition.{kind}")
    for field in LIFECYCLE_FIELDS & set(effect):
        requirements.add(f"lifecycle.{field}")
    if "scaling" in effect:
        requirements.add("scaling.status")
    if "multiplierScaling" in effect:
        requirements.add("scaling.damageMultiplier")
    if "staggerScaling" in effect:
        requirements.add("scaling.stagger")
    if target.get("classes"):
        requirements.add("target.classFilter")
    return sorted(requirements)


def _entry(
    record: dict[str, Any],
    effect: dict[str, Any],
    effect_path: str,
    location: str,
    slot: str | None,
    form_key: str | None,
    trigger: dict[str, Any] | None,
) -> dict[str, Any]:
    target = _normalize_target(effect)
    migration_class, blockers = _classify(effect, location, target)
    modifier = effect.get("stat", {}).get("modifier")
    lifecycle = {key: deepcopy(effect[key]) for key in sorted(LIFECYCLE_FIELDS & set(effect))}
    requirements = _requirements(effect, migration_class, target, trigger)
    if migration_class == "buildStaticContribution":
        downstream_status = "requiresDefinitionAudit"
        pending_capabilities: list[str] = ["definition.equipmentModifier"]
    elif migration_class == "currentlyUnsupported":
        downstream_status = "blocked"
        pending_capabilities = []
    else:
        downstream_status = "requiresCoreCapabilities"
        pending_capabilities = requirements
    return {
        "id": f"{record['kind']}:{record['slug']}:{effect_path}",
        "source": {
            "kind": record["kind"],
            "slug": record["slug"],
            "sourcePath": record["sourcePath"],
            "slot": slot,
            "formKey": form_key,
            "effectPath": effect_path,
            "location": location,
        },
        "classification": {
            "kind": migration_class,
            "irStatus": "blocked" if blockers else "convertible",
            "buildResolver": migration_class == "buildStaticContribution",
            "combatInitialization": migration_class == "battlePersistentModifier",
            "eventDriven": migration_class in {"eventTriggeredBehavior", "oneTimeBehavior"},
            "oneTime": migration_class == "oneTimeBehavior",
            "blockers": blockers,
            "downstreamStatus": downstream_status,
            "pendingCapabilities": pending_capabilities,
        },
        "semantics": {
            "effectKind": effect["kind"],
            "modifier": modifier,
            "target": target,
            "trigger": deepcopy(trigger),
            "condition": deepcopy(effect.get("condition")),
            "lifecycle": lifecycle,
            "requirements": requirements,
        },
        # 原始结构是迁移期的证据载荷；正式 DSL 生成器不得直接透传它。
        "sourceEffect": deepcopy(effect),
    }


def _walk_effect(
    record: dict[str, Any],
    effect: dict[str, Any],
    effect_path: str,
    location: str,
    slot: str | None,
    form_key: str | None,
    trigger: dict[str, Any] | None,
) -> Iterator[dict[str, Any]]:
    yield _entry(record, effect, effect_path, location, slot, form_key, trigger)
    hit = effect.get("hit")
    if isinstance(hit, dict):
        for index, nested in enumerate(hit.get("effects", [])):
            yield from _walk_effect(
                record,
                nested,
                f"{effect_path}.hit.effects[{index}]",
                "nestedHit",
                slot,
                form_key,
                trigger,
            )


def _walk_slot(
    record: dict[str, Any],
    slot_value: dict[str, Any],
    slot_path: str,
    slot: str,
    form_key: str | None,
) -> Iterator[dict[str, Any]]:
    prefix = f"{slot_path}." if slot_path else ""
    for index, effect in enumerate(slot_value.get("effects", [])):
        yield from _walk_effect(
            record, effect, f"{prefix}effects[{index}]", "passive", slot, form_key, None
        )
    for trigger_index, wrapper in enumerate(slot_value.get("triggers", [])):
        trigger = wrapper["trigger"]
        for effect_index, effect in enumerate(wrapper["effects"]):
            yield from _walk_effect(
                record,
                effect,
                f"{prefix}triggers[{trigger_index}].effects[{effect_index}]",
                "trigger",
                slot,
                form_key,
                trigger,
            )


def _walk_record(record: dict[str, Any]) -> Iterator[dict[str, Any]]:
    definition = record["definition"]
    if record["kind"] == "weapon":
        for slot in ("skill1", "skill2", "skill3"):
            yield from _walk_slot(record, definition[slot], slot, slot, None)
        forms = definition.get("forms", {}).get("forms", [])
        for form_index, form in enumerate(forms):
            for slot in ("skill1", "skill2", "skill3"):
                if slot in form:
                    yield from _walk_slot(
                        record,
                        form[slot],
                        f"forms.forms[{form_index}].{slot}",
                        slot,
                        form["key"],
                    )
        return
    if record["kind"] == "gearPiece":
        for slot in ("skill1", "skill2", "skill3"):
            if slot in definition:
                yield from _walk_slot(record, definition[slot], slot, slot, None)
        return

    pseudo_slot = {"effects": definition["effects"], "triggers": definition.get("triggers", [])}
    yield from _walk_slot(record, pseudo_slot, "", "setBonus", None)


def build_migration_ir(snapshot: Any) -> dict[str, Any]:
    """先复用全量严格审计，再构建不依赖旧 TS 的迁移 IR。"""
    audit_report = audit_snapshot(snapshot)
    entries = [entry for record in snapshot["records"] for entry in _walk_record(record)]
    expected = sum(item["count"] for item in audit_report["effectKinds"].values())
    if len(entries) != expected:
        raise AuditFailure("$", f"迁移 IR 效果数 {len(entries)} 与审计效果数 {expected} 不一致")
    ids = [entry["id"] for entry in entries]
    if len(ids) != len(set(ids)):
        raise AuditFailure("$", "迁移 IR 出现重复效果身份")

    class_counts = Counter(entry["classification"]["kind"] for entry in entries)
    readiness_counts = Counter(entry["classification"]["irStatus"] for entry in entries)
    downstream_counts = Counter(
        entry["classification"]["downstreamStatus"] for entry in entries
    )
    classification_sources: dict[str, Counter[str]] = {}
    classification_effect_kinds: dict[str, Counter[str]] = {}
    for entry in entries:
        class_name = entry["classification"]["kind"]
        classification_sources.setdefault(class_name, Counter())[entry["source"]["kind"]] += 1
        classification_effect_kinds.setdefault(class_name, Counter())[
            entry["semantics"]["effectKind"]
        ] += 1
    requirement_counts = Counter(
        requirement
        for entry in entries
        for requirement in entry["semantics"]["requirements"]
    )
    blocker_counts = Counter(
        blocker for entry in entries for blocker in entry["classification"]["blockers"]
    )
    return {
        "schemaVersion": 1,
        "status": "complete",
        "sourceSnapshotVersion": snapshot["schemaVersion"],
        "summary": {
            "effectCount": len(entries),
            "classificationCounts": dict(sorted(class_counts.items())),
            "classificationSourceCounts": {
                key: dict(sorted(value.items()))
                for key, value in sorted(classification_sources.items())
            },
            "classificationEffectKindCounts": {
                key: dict(sorted(value.items()))
                for key, value in sorted(classification_effect_kinds.items())
            },
            "irReadinessCounts": dict(sorted(readiness_counts.items())),
            "downstreamReadinessCounts": dict(sorted(downstream_counts.items())),
            "requirementCounts": dict(sorted(requirement_counts.items())),
            "blockerCounts": dict(sorted(blocker_counts.items())),
        },
        "entries": entries,
    }
