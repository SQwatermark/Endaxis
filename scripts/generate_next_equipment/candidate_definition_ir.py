"""把构筑期静态装备效果严格适配为当前 Next 装备修正候选定义。"""

from __future__ import annotations

from collections import Counter
from copy import deepcopy
import math
from typing import Any

from .audit_schema import AuditFailure


BUILD_STATIC_CLASS = "buildStaticContribution"
BATTLE_PERSISTENT_CLASS = "battlePersistentModifier"
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

# 旧装备配置把这四条“对失衡目标伤害加成”误写成了作用于 self 的
# susceptibility。该语义由中英文装备目录共同闭环，不能按旧字段字面迁移为敌方脆弱。
STAGGERED_DAMAGE_BONUS_LEGACY_IDS = {
    "gearPiece:aburrey-auditory-chip:skill3.effects[0]",
    "gearPiece:aburrey-gauntlets:skill3.effects[0]",
    "gearPiece:bonekrusha-mask:skill3.effects[0]",
    "gearPiece:thertech-plating:skill3.effects[0]",
}

BATTLE_PERSISTENT_MODIFIERS = {
    "atkPercent",
    "cooldownReductionPercent",
    "critRate",
    "dmgBonus",
    "heal",
    "protection",
    "staggerPercent",
    "susceptibility",
}


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


def _validate_persistent_condition(condition: Any, path: str) -> None:
    if not isinstance(condition, dict):
        raise AuditFailure(path, "常驻效果 condition 应为对象")
    kind = condition.get("kind")
    allowed_fields = {
        "operatorHp": {"kind", "compare", "percent"},
        "enemyStatus": {"kind", "status"},
        "enemyStaggered": {"kind"},
        "operatorStatus": {"kind", "status", "stacks"},
    }
    if kind not in allowed_fields:
        raise AuditFailure(f"{path}.kind", f"未知常驻效果条件：{kind!r}")
    unknown = sorted(set(condition) - allowed_fields[kind])
    if unknown:
        raise AuditFailure(path, f"常驻效果条件出现未预期字段：{', '.join(unknown)}")
    if kind == "operatorHp":
        if condition.get("compare") not in {"above", "below"}:
            raise AuditFailure(f"{path}.compare", "未知生命值比较方式")
        percent = condition.get("percent")
        if isinstance(percent, bool) or not isinstance(percent, (int, float)):
            raise AuditFailure(f"{path}.percent", "生命值阈值应为数值")
    elif kind in {"enemyStatus", "operatorStatus"}:
        statuses = condition.get("status")
        values = statuses if isinstance(statuses, list) else [statuses]
        if not values or any(not isinstance(value, str) or not value for value in values):
            raise AuditFailure(f"{path}.status", "状态身份应为非空字符串或非空字符串数组")
        if kind == "operatorStatus" and "stacks" in condition:
            stacks = condition["stacks"]
            if not isinstance(stacks, dict) or set(stacks) != {"compare", "count"}:
                raise AuditFailure(f"{path}.stacks", "层数条件结构不完整")
            if stacks.get("compare") not in {"exact", "atLeast", "atMost"}:
                raise AuditFailure(f"{path}.stacks.compare", "未知层数比较方式")
            if not isinstance(stacks.get("count"), int) or stacks["count"] < 0:
                raise AuditFailure(f"{path}.stacks.count", "层数应为非负整数")


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


def _validate_persistent_effect(
    entry_id: str,
    effect: dict[str, Any],
    semantics: dict[str, Any],
    path: str,
) -> tuple[str, dict[str, Any] | None, bool, dict[str, str] | None, list[str]]:
    """审计旧常驻战斗效果，并返回目的地、候选定义、面板可见性、缺口和证据。"""
    if effect.get("kind") != "status":
        raise AuditFailure(path, "battlePersistentModifier 必须是 status")
    unknown_effect_fields = sorted(
        set(effect) - {"kind", "stat", "target", "value", "condition", "icon"}
    )
    if unknown_effect_fields:
        raise AuditFailure(path, f"常驻战斗效果出现未预期字段：{', '.join(unknown_effect_fields)}")
    if effect.get("target") != "self":
        raise AuditFailure(f"{path}.target", "当前真实常驻装备样本必须显式面向 self")
    lifecycle = semantics.get("lifecycle")
    if lifecycle != {}:
        raise AuditFailure(f"{path}.lifecycle", "当前 33 条样本不应携带生命周期字段")
    stat = effect.get("stat")
    if not isinstance(stat, dict):
        raise AuditFailure(f"{path}.stat", "常驻战斗效果必须携带 stat 对象")
    modifier = stat.get("modifier")
    if modifier not in BATTLE_PERSISTENT_MODIFIERS:
        raise AuditFailure(f"{path}.stat.modifier", f"未知常驻战斗 modifier：{modifier!r}")
    if "value" not in effect:
        raise AuditFailure(f"{path}.value", "常驻战斗效果缺少 value")
    _finite_level_values(effect["value"], f"{path}.value")

    condition = effect.get("condition")
    if condition is not None:
        _validate_persistent_condition(condition, f"{path}.condition")
    evidence = ["legacy.collectEffects.passiveStatus"]

    if modifier == "staggerPercent" and condition is None:
        _reject_stat_fields(stat, {"modifier", "skillTypes"}, f"{path}.stat")
        skill_types = stat.get("skillTypes")
        if skill_types is None:
            return (
                "buildStaticModifier",
                {
                    "kind": "panelStat",
                    "stat": "staggerDamagePercent",
                    "value": _scale_percent(effect["value"], f"{path}.value"),
                },
                False,
                None,
                [*evidence, "next.equipment.panelStat.staggerDamagePercent"],
            )
        _mapped_skill_types(skill_types, f"{path}.stat.skillTypes")
        return (
            "buildStaticModifier",
            None,
            False,
            _gap(
                "scoped-stagger-modifier-unsupported",
                "现有 staggerDamagePercent 不能保留 finalStrike 等技能范围，禁止扩大到全部失衡伤害",
            ),
            [*evidence, "legacy.StaggerChangeHandler.skillTypes", "next.equipment.panelStat.unscoped"],
        )

    if modifier == "cooldownReductionPercent" and condition is None:
        _reject_stat_fields(stat, {"modifier", "skillTypes"}, f"{path}.stat")
        if "skillTypes" not in stat:
            raise AuditFailure(f"{path}.stat.skillTypes", "当前冷却缩减样本必须声明技能范围")
        _mapped_skill_types(stat["skillTypes"], f"{path}.stat.skillTypes")
        return (
            "buildStaticModifier",
            None,
            False,
            _gap(
                "scoped-skill-cooldown-reduction-unsupported",
                "现有 EquipmentModifierDefinition 的 skillCooldownReduction 缺少技能范围字段",
            ),
            [*evidence, "legacy.computeStats.cooldownReductionPercent.skillTypes", "next.equipment.panelStat.unscoped"],
        )

    if modifier in {"heal", "protection"} and condition is None:
        _reject_stat_fields(stat, {"modifier"}, f"{path}.stat")
        code = (
            "healing-effect-modifier-unsupported"
            if modifier == "heal"
            else "final-damage-reduction-modifier-unsupported"
        )
        detail = (
            "治疗效率是常驻战斗属性，但当前 EquipmentModifierDefinition 和 Buff 目录没有对应通道"
            if modifier == "heal"
            else "最终伤害减免是常驻战斗属性，但当前 EquipmentModifierDefinition 和 Buff 目录没有对应通道"
        )
        return (
            "buildStaticModifier",
            None,
            False,
            _gap(code, detail),
            [*evidence, f"gameLocale.{modifier}", "next.equipment.modifier.missing"],
        )

    if modifier == "susceptibility" and condition is None:
        _reject_stat_fields(stat, {"modifier"}, f"{path}.stat")
        if entry_id not in STAGGERED_DAMAGE_BONUS_LEGACY_IDS:
            raise AuditFailure(path, "未知的 self susceptibility，不能按旧字段字面猜测语义")
        return (
            "battleStartPersistentBuff",
            None,
            False,
            _gap(
                "staggered-target-damage-buff-unsupported",
                "目录文本证明该词条是对失衡目标伤害加成；需要持久伤害 Buff 在每次伤害时判断目标失衡",
            ),
            [
                *evidence,
                "gameLocale.DMG Bonus vs. Staggered",
                "legacy.computeStats.selfSusceptibilitySkipped",
                "next.buff.declarativeDamageCondition.missing",
            ],
        )

    if condition is None:
        raise AuditFailure(path, f"未预期的无条件常驻 modifier：{modifier!r}")

    if modifier in {"atkPercent", "critRate"}:
        _reject_stat_fields(stat, {"modifier"}, f"{path}.stat")
        gap = _gap(
            "conditional-attribute-buff-unsupported",
            "该属性必须随战斗条件实时启停；当前装备 DSL 无 Buff 蓝图/启动序列，状态修正运行时也尚未实现",
        )
    elif modifier == "dmgBonus":
        _reject_stat_fields(stat, {"modifier", "elements", "skillTypes"}, f"{path}.stat")
        if "elements" in stat:
            _enum_values(stat["elements"], DAMAGE_TYPES, f"{path}.stat.elements")
        if "skillTypes" in stat:
            _mapped_skill_types(stat["skillTypes"], f"{path}.stat.skillTypes")
        gap = _gap(
            "conditional-damage-buff-unsupported",
            "该伤害增益必须在每次伤害结算时判断战斗条件；当前可序列化 Buff 目录不支持伤害修正及声明式条件",
        )
    else:
        raise AuditFailure(path, f"未预期的有条件常驻 modifier：{modifier!r}")

    return (
        "battleStartPersistentBuff",
        None,
        False,
        gap,
        [*evidence, "legacy.condition.runtime", "next.equipment.buffStartup.missing"],
    )


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
    destination_counts: Counter[str] = Counter()
    persistent_target_counts: Counter[str] = Counter()
    persistent_condition_counts: Counter[str] = Counter()
    persistent_lifecycle_counts: Counter[str] = Counter()
    legacy_runtime_counts: Counter[str] = Counter()
    persistent_modifier_counts: dict[str, Counter[str]] = {}
    modifier_counts: dict[str, Counter[str]] = {}
    build_static_modifier_counts: dict[str, Counter[str]] = {}
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
        if classification == BATTLE_PERSISTENT_CLASS:
            effect = entry.get("sourceEffect")
            semantics = entry.get("semantics")
            if not isinstance(effect, dict):
                raise AuditFailure(f"{path}.sourceEffect", "应为对象")
            if not isinstance(semantics, dict):
                raise AuditFailure(f"{path}.semantics", "应为对象")
            modifier = effect.get("stat", {}).get("modifier")
            destination, candidate, panel_visible, gap, evidence = _validate_persistent_effect(
                str(entry.get("id")), effect, semantics, f"{path}.sourceEffect"
            )
            condition = semantics.get("condition")
            condition_kind = condition.get("kind") if isinstance(condition, dict) else "none"
            target_scope = semantics.get("target", {}).get("scope", "unknown")
            lifecycle = semantics.get("lifecycle", {})
            lifecycle_kind = "none" if not lifecycle else "+".join(sorted(lifecycle))
            if modifier == "susceptibility":
                legacy_runtime_disposition = "excludedAsEnemyModifier"
            elif condition_kind in {"operatorStatus", "enemyStatus", "enemyStaggered"}:
                legacy_runtime_disposition = "conditionalTriggerBridge"
            elif condition_kind == "operatorHp":
                legacy_runtime_disposition = "conditionNotBridged"
            else:
                legacy_runtime_disposition = "initialInfiniteStatus"
            result.update({
                "buildTimeDeterminable": destination == "buildStaticModifier",
                "semanticDestination": destination,
                "characterPanelVisible": panel_visible,
                "sourceModifier": modifier,
                "battlePersistentAudit": {
                    "target": deepcopy(semantics.get("target")),
                    "condition": deepcopy(semantics.get("condition")),
                    "lifecycle": deepcopy(semantics.get("lifecycle")),
                    "legacyRuntimeDisposition": legacy_runtime_disposition,
                    "evidence": evidence,
                },
            })
            destination_counts[destination] += 1
            persistent_target_counts[str(target_scope)] += 1
            persistent_condition_counts[str(condition_kind)] += 1
            persistent_lifecycle_counts[lifecycle_kind] += 1
            legacy_runtime_counts[legacy_runtime_disposition] += 1
            if candidate is not None:
                status = "definitionReady"
                result.update({"status": status, "candidateDefinition": candidate})
            else:
                assert gap is not None
                status = "dslGap"
                result.update({"status": status, "gap": gap})
                gap_counts[gap["code"]] += 1
            persistent_modifier_counts.setdefault(str(modifier), Counter())[status] += 1
        elif classification != BUILD_STATIC_CLASS:
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
        if result["buildTimeDeterminable"]:
            build_static_modifier_counts.setdefault(str(modifier), Counter())[status] += 1
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
            "battlePersistentAudit": {
                "effectCount": sum(destination_counts.values()),
                "buildStaticDestinationCount": destination_counts["buildStaticModifier"],
                "persistentBuffRequiredCount": destination_counts["battleStartPersistentBuff"],
                "directBuildStaticDefinitionReadyCount": sum(
                    1 for entry in output_entries
                    if entry.get("semanticDestination") == "buildStaticModifier"
                    and entry["status"] == "definitionReady"
                ),
                "definitionReadyCount": sum(
                    1 for entry in output_entries
                    if entry.get("semanticDestination") is not None
                    and entry["status"] == "definitionReady"
                ),
                "dslGapCount": sum(
                    1 for entry in output_entries
                    if entry.get("semanticDestination") is not None
                    and entry["status"] == "dslGap"
                ),
                "destinationCounts": dict(sorted(destination_counts.items())),
                "targetCounts": dict(sorted(persistent_target_counts.items())),
                "conditionKindCounts": dict(sorted(persistent_condition_counts.items())),
                "lifecycleCounts": dict(sorted(persistent_lifecycle_counts.items())),
                "legacyRuntimeDispositionCounts": dict(sorted(legacy_runtime_counts.items())),
                "modifierStatusCounts": {
                    key: dict(sorted(value.items()))
                    for key, value in sorted(persistent_modifier_counts.items())
                },
            },
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
                    "buildStaticCount": sum(build_static_modifier_counts.get(modifier, {}).values()),
                    "definitionReadyCount": build_static_modifier_counts.get(modifier, {}).get("definitionReady", 0),
                    "dslGapCount": build_static_modifier_counts.get(modifier, {}).get("dslGap", 0),
                    "persistentBuffRequiredCount": sum(
                        1 for entry in output_entries
                        if entry.get("sourceModifier") == modifier
                        and entry.get("semanticDestination") == "battleStartPersistentBuff"
                    ),
                    "triggerFilterCount": len(trigger_filter_identities.get(modifier, set())),
                }
                for modifier in ("dmgBonus", "ampBonus", "attributeAtkPercent")
            },
        },
        "entries": output_entries,
    }
