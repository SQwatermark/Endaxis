"""旧装备结构的严格白名单；类型发生变化时要求审计代码显式适配。"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class AuditFailure(ValueError):
    """携带精确数据路径的审计失败。"""

    path: str
    message: str

    def __str__(self) -> str:
        return f"{self.path}: {self.message}"


EFFECT_COMMON_FIELDS = {
    "kind", "name", "displayType", "icon", "duration", "durationExtension",
    "stacks", "maxStacks", "stackStrategy", "condition", "icd", "icdGroup",
    "id", "sourceGroup", "hide", "ignoreTimeShift", "applyTiming",
}

EFFECT_FIELDS = {
    "status": {"target", "stat", "value", "scaling", "silent", "external"},
    "infliction": {"element"},
    "burst": {"element"},
    "reaction": {"reactionType", "requiresInfliction", "effectiveness", "defaultLevel"},
    "physicalStatus": {"physicalType", "forced", "effectiveness"},
    "damageHit": {
        "element", "multiplier", "multiplierScaling", "staggerScaling", "offset",
        "hit", "readConsumedStacks", "scaleByCrit",
    },
    "damageOverTime": {
        "element", "skillType", "multiplier", "multiplierMode", "multiplierScaling",
        "offset", "interval", "snapshot", "canCrit", "skipFirstTick", "cancelOnRefresh",
        "consumedStatEffects",
    },
    "spRecovery": {"value", "scaling"},
    "spReturn": {"value", "scaling"},
    "ultEnergyGain": {"target", "value", "scaling", "ignoreEfficiency"},
    "cooldownReductionFlat": {"value", "target", "skillTypes", "skillId"},
    "cooldownReductionPercent": {"value", "target", "skillTypes", "skillId"},
    "derived": {"sourceEffect", "effect"},
    "oneTime": {"stat", "value", "target", "skillTypes", "skillId"},
    "consume": {
        "operatorStatus", "enemyStatus", "consumeStacks", "consumeScope", "consumeTarget",
    },
}

EFFECT_REQUIRED_FIELDS = {
    "status": set(),
    "infliction": {"element"},
    "burst": {"element"},
    "reaction": {"reactionType"},
    "physicalStatus": {"physicalType"},
    "damageHit": {"element", "multiplier"},
    "damageOverTime": {"element", "multiplier", "interval"},
    "spRecovery": {"value"},
    "spReturn": {"value"},
    "ultEnergyGain": {"value"},
    "cooldownReductionFlat": {"value"},
    "cooldownReductionPercent": {"value"},
    "derived": {"sourceEffect"},
    "oneTime": {"stat", "value"},
    "consume": set(),
}

MODIFIERS = {
    "susceptibility", "increasedDmgTaken", "resistanceShred", "slowed", "weaken",
    "inflictionBarrier", "atkPercent", "attributeAtkPercent", "atkFlat", "hpPercent",
    "flatHp", "defPercent", "flatDef", "artsIntensity", "ultimateGainEfficiency",
    "ultimateEnergyCostReduction", "shield", "protection", "link", "heal",
    "reactionDurationBonus", "reactionEffectivenessBonus", "critRate", "critDmg",
    "directMultiplier", "spRecoveryFlat", "spRecoveryPercent", "battleSkillSPCostReduction",
    "staggerFlat", "staggerPercent", "cooldownReductionFlat", "cooldownReductionPercent",
    "ampBonus", "resistanceIgnore", "dmgBonus", "susceptibilityAmplify", "attributeFlat",
    "attributePercent",
}

STAT_FIELDS = {"modifier", "elements", "reactionType", "skillTypes", "skillId", "attribute"}

TRIGGER_FIELDS = {
    "onHit": {"kind", "skillTypes", "skillId", "triggerScope"},
    "onFinalStrike": {"kind", "triggerScope"},
    "onFinisher": {"kind", "triggerScope"},
    "onDive": {"kind", "triggerScope"},
    "onSpRecovery": {"kind", "skillTypes", "skillId"},
    "onStatusApplied": {
        "kind", "skillTypes", "skillId", "status", "target", "triggerScope",
    },
    "onStatusExpire": {
        "kind", "skillTypes", "skillId", "status", "target", "triggerScope",
    },
    "onStatusConsumed": {
        "kind", "skillTypes", "skillId", "status", "target", "triggerScope",
    },
    "onActionStart": {"kind", "skillTypes", "skillId", "triggerScope", "element"},
    "duringAction": {"kind", "skillTypes", "skillId"},
    "onBattleStart": {"kind"},
}

CONDITION_FIELDS = {
    "enemyStatus": {"kind", "status", "stacks", "consume"},
    "enemyHp": {"kind", "compare", "percent"},
    "enemyStaggered": {"kind"},
    "operatorStatus": {
        "kind", "status", "stacks", "consume", "consumeScope", "consumeTarget", "target",
    },
    "operatorHp": {"kind", "compare", "percent"},
    "comboNotOnCooldown": {"kind"},
    "ultimateEnhancement": {"kind"},
    "actionLinkConsumed": {"kind"},
    "not": {"kind", "condition"},
    "or": {"kind", "conditions"},
}

TARGET_SCOPES = {
    "self", "team", "teamExcludeSelf", "teamExcludeSameElement", "enemy", "owner", "controlled",
}

WEAPON_TYPES = {"sword", "greatsword", "polearm", "handcannon", "arts-unit"}
GEAR_SLOT_TYPES = {"armor", "gloves", "kit"}
WEAPON_RARITIES = {3, 4, 5, 6}
ATTRIBUTES = {"strength", "agility", "intellect", "will", "main", "sub"}
OPERATOR_CLASSES = {"guard", "caster", "defender", "vanguard", "supporter", "striker"}
COMBAT_SKILL_TYPES = {"basicAttack", "battleSkill", "comboSkill", "ultimate"}
SKILL_TYPES = COMBAT_SKILL_TYPES | {"finalStrike", "dive"}
SKILL_TYPE_SCOPES = SKILL_TYPES | {"finisher", "nonSkill"}
ARTS_ELEMENTS = {"heat", "cryo", "electric", "nature"}
DAMAGE_ELEMENTS = ARTS_ELEMENTS | {"physical"}
REACTION_TYPES = {"combustion", "electrification", "solidification", "corrosion"}
PHYSICAL_STATUS_TYPES = {"vulnerability", "breach", "crush", "lift", "knockdown"}
TREAT_AS_REACTION_TYPES = REACTION_TYPES | {"shatter", "breach", "crush"}
STACK_STRATEGIES = {"REFRESH_DURATION", "INDEPENDENT", "REPLACE"}
APPLY_TIMINGS = {"afterDamage", "beforeDamage"}
MULTIPLIER_MODES = {"each", "split"}
TRIGGER_SCOPES = {"self", "global"}
SOURCE_GROUPS = {"operator", "weapon", "gearSet"}
STACK_COMPARES = {"exact", "atLeast", "atMost"}
HP_COMPARES = {"above", "below"}


def require_object(value: Any, path: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise AuditFailure(path, f"应为对象，实际为 {type(value).__name__}")
    return value


def require_list(value: Any, path: str) -> list[Any]:
    if not isinstance(value, list):
        raise AuditFailure(path, f"应为数组，实际为 {type(value).__name__}")
    return value


def reject_unknown_fields(value: dict[str, Any], allowed: set[str], path: str) -> None:
    unknown = sorted(set(value) - allowed)
    if unknown:
        raise AuditFailure(path, f"出现未预期字段：{', '.join(unknown)}")


def require_fields(value: dict[str, Any], required: set[str], path: str) -> None:
    missing = sorted(required - set(value))
    if missing:
        raise AuditFailure(path, f"缺少必填字段：{', '.join(missing)}")


def require_string(value: Any, path: str) -> str:
    if not isinstance(value, str) or not value:
        raise AuditFailure(path, "应为非空字符串")
    return value


def require_number(value: Any, path: str) -> float | int:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise AuditFailure(path, f"应为数值，实际为 {type(value).__name__}")
    return value


def require_level_values(value: Any, path: str) -> None:
    if isinstance(value, list):
        if not value:
            raise AuditFailure(path, "等级数组不能为空")
        for index, entry in enumerate(value):
            require_number(entry, f"{path}[{index}]")
        return
    require_number(value, path)


def require_enum(value: Any, allowed: set[Any], path: str) -> Any:
    if value not in allowed:
        raise AuditFailure(path, f"未知枚举值：{value!r}")
    return value


def require_enum_values(value: Any, allowed: set[Any], path: str) -> None:
    if isinstance(value, list):
        if not value:
            raise AuditFailure(path, "枚举数组不能为空")
        for index, entry in enumerate(value):
            require_enum(entry, allowed, f"{path}[{index}]")
        return
    require_enum(value, allowed, path)
