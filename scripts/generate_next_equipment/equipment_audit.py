"""遍历旧武器、装备与套装定义，生成可追溯的全量分类审计。"""

from __future__ import annotations

from collections import Counter, defaultdict
from dataclasses import dataclass, field
from typing import Any

from .audit_schema import (
    APPLY_TIMINGS,
    ARTS_ELEMENTS,
    ATTRIBUTES,
    AuditFailure,
    COMBAT_SKILL_TYPES,
    CONDITION_FIELDS,
    EFFECT_COMMON_FIELDS,
    EFFECT_FIELDS,
    EFFECT_REQUIRED_FIELDS,
    DAMAGE_ELEMENTS,
    GEAR_SLOT_TYPES,
    HP_COMPARES,
    MULTIPLIER_MODES,
    MODIFIERS,
    OPERATOR_CLASSES,
    PHYSICAL_STATUS_TYPES,
    REACTION_TYPES,
    SKILL_TYPES,
    SKILL_TYPE_SCOPES,
    SOURCE_GROUPS,
    STACK_COMPARES,
    STACK_STRATEGIES,
    STAT_FIELDS,
    TARGET_SCOPES,
    TREAT_AS_REACTION_TYPES,
    TRIGGER_SCOPES,
    TRIGGER_FIELDS,
    WEAPON_RARITIES,
    WEAPON_TYPES,
    reject_unknown_fields,
    require_enum,
    require_enum_values,
    require_fields,
    require_level_values,
    require_list,
    require_number,
    require_object,
    require_string,
)


@dataclass
class OccurrenceIndex:
    """同时保存计数和所有出现路径，避免汇总报告掩盖孤例。"""

    paths: dict[str, list[str]] = field(default_factory=lambda: defaultdict(list))

    def add(self, key: str, path: str) -> None:
        self.paths[key].append(path)

    def to_json(self) -> dict[str, dict[str, Any]]:
        def source_kind(path: str) -> str:
            if path.startswith("src/data/weapons/"):
                return "weapon"
            if path.startswith("src/data/gearpieces/"):
                return "gearPiece"
            if path.startswith("src/data/gearsets/"):
                return "gearSet"
            raise AuditFailure(path, "出现未知数据来源目录")

        return {
            key: {
                "count": len(paths),
                "sourceCount": len({path.split("#", 1)[0] for path in paths}),
                "sourceKindCounts": dict(sorted(Counter(source_kind(path) for path in paths).items())),
                "paths": paths,
            }
            for key, paths in sorted(self.paths.items())
        }


@dataclass
class AuditCollector:
    effects: OccurrenceIndex = field(default_factory=OccurrenceIndex)
    modifiers: OccurrenceIndex = field(default_factory=OccurrenceIndex)
    triggers: OccurrenceIndex = field(default_factory=OccurrenceIndex)
    conditions: OccurrenceIndex = field(default_factory=OccurrenceIndex)
    targets: OccurrenceIndex = field(default_factory=OccurrenceIndex)
    source_counts: Counter[str] = field(default_factory=Counter)
    form_counts: Counter[str] = field(default_factory=Counter)
    effect_locations: Counter[str] = field(default_factory=Counter)


def _path(record: dict[str, Any], suffix: str = "") -> str:
    return f"{record['sourcePath']}#{suffix}" if suffix else record["sourcePath"]


def _audit_target(value: Any, path: str, collector: AuditCollector, context: str) -> None:
    if isinstance(value, str):
        require_enum(value, TARGET_SCOPES, path)
        collector.targets.add(f"{context}:{value}", path)
        return
    target = require_object(value, path)
    reject_unknown_fields(target, {"scope", "classes"}, path)
    scope = require_string(target.get("scope"), f"{path}.scope")
    require_enum(scope, TARGET_SCOPES, f"{path}.scope")
    if "classes" in target:
        classes = require_list(target["classes"], f"{path}.classes")
        if not all(isinstance(entry, str) and entry for entry in classes):
            raise AuditFailure(f"{path}.classes", "职业过滤必须是非空字符串数组")
        for index, entry in enumerate(classes):
            require_enum(entry, OPERATOR_CLASSES, f"{path}.classes[{index}]")
        category = f"{context}:scope={scope},classes"
    else:
        category = f"{context}:scope={scope}"
    collector.targets.add(category, path)


def _audit_stat(value: Any, path: str, collector: AuditCollector) -> None:
    stat = require_object(value, path)
    reject_unknown_fields(stat, STAT_FIELDS, path)
    modifier = require_string(stat.get("modifier"), f"{path}.modifier")
    if modifier not in MODIFIERS:
        raise AuditFailure(f"{path}.modifier", f"未知 modifier：{modifier}")
    if "elements" in stat:
        require_enum_values(stat["elements"], DAMAGE_ELEMENTS, f"{path}.elements")
    if "reactionType" in stat:
        require_enum(stat["reactionType"], REACTION_TYPES, f"{path}.reactionType")
    if "skillTypes" in stat:
        require_enum_values(stat["skillTypes"], SKILL_TYPE_SCOPES, f"{path}.skillTypes")
    if "skillId" in stat:
        skill_ids = stat["skillId"] if isinstance(stat["skillId"], list) else [stat["skillId"]]
        for index, skill_id in enumerate(skill_ids):
            require_string(skill_id, f"{path}.skillId[{index}]")
    if "attribute" in stat:
        require_enum_values(stat["attribute"], ATTRIBUTES, f"{path}.attribute")
    collector.modifiers.add(modifier, path)


def _audit_status_matcher(value: Any, path: str, collector: AuditCollector) -> None:
    if isinstance(value, list):
        for index, entry in enumerate(value):
            _audit_status_matcher(entry, f"{path}[{index}]", collector)
    elif isinstance(value, str):
        if not value:
            raise AuditFailure(path, "状态身份不能为空")
    else:
        _audit_stat(value, path, collector)


def _audit_condition(value: Any, path: str, collector: AuditCollector) -> None:
    if isinstance(value, list):
        for index, condition in enumerate(value):
            _audit_condition(condition, f"{path}[{index}]", collector)
        return
    condition = require_object(value, path)
    kind = require_string(condition.get("kind"), f"{path}.kind")
    allowed = CONDITION_FIELDS.get(kind)
    if allowed is None:
        raise AuditFailure(f"{path}.kind", f"未知 condition kind：{kind}")
    reject_unknown_fields(condition, allowed, path)
    collector.conditions.add(kind, path)
    if kind in {"enemyStatus", "operatorStatus"}:
        _audit_status_matcher(condition.get("status"), f"{path}.status", collector)
        if "consumeTarget" in condition:
            _audit_target(
                condition["consumeTarget"], f"{path}.consumeTarget", collector, "condition",
            )
        if "stacks" in condition:
            stacks = require_object(condition["stacks"], f"{path}.stacks")
            reject_unknown_fields(stacks, {"compare", "count"}, f"{path}.stacks")
            require_fields(stacks, {"compare", "count"}, f"{path}.stacks")
            require_enum(stacks["compare"], STACK_COMPARES, f"{path}.stacks.compare")
            require_number(stacks["count"], f"{path}.stacks.count")
        if "consumeScope" in condition:
            require_enum(condition["consumeScope"], {"team"}, f"{path}.consumeScope")
        if "target" in condition:
            require_enum(condition["target"], {"self", "controlled"}, f"{path}.target")
    elif kind in {"enemyHp", "operatorHp"}:
        require_fields(condition, {"compare", "percent"}, path)
        require_enum(condition["compare"], HP_COMPARES, f"{path}.compare")
        require_number(condition["percent"], f"{path}.percent")
    elif kind == "not":
        _audit_condition(condition.get("condition"), f"{path}.condition", collector)
    elif kind == "or":
        _audit_condition(condition.get("conditions"), f"{path}.conditions", collector)


def _audit_scaling(value: Any, path: str, collector: AuditCollector) -> None:
    scaling = require_object(value, path)
    reject_unknown_fields(scaling, {"additive", "multiplier", "cap", "conditionalScaling"}, path)
    for index, term in enumerate(scaling.get("additive", [])):
        if isinstance(term, dict):
            if "basis" in term:
                reject_unknown_fields(term, {"basis", "coefficient"}, f"{path}.additive[{index}]")
                require_fields(term, {"basis", "coefficient"}, f"{path}.additive[{index}]")
                require_enum_values(term["basis"], ATTRIBUTES, f"{path}.additive[{index}].basis")
                require_level_values(term["coefficient"], f"{path}.additive[{index}].coefficient")
            elif "key" in term:
                reject_unknown_fields(
                    term, {"key", "target", "coefficient"}, f"{path}.additive[{index}]",
                )
                if "target" in term:
                    _audit_target(
                        term["target"], f"{path}.additive[{index}].target", collector, "scaling",
                    )
                require_fields(term, {"key", "coefficient"}, f"{path}.additive[{index}]")
                require_string(term["key"], f"{path}.additive[{index}].key")
                require_level_values(term["coefficient"], f"{path}.additive[{index}].coefficient")
            else:
                raise AuditFailure(f"{path}.additive[{index}]", "未知 scaling additive 对象")
    if "conditionalScaling" in scaling:
        conditional = require_object(scaling["conditionalScaling"], f"{path}.conditionalScaling")
        reject_unknown_fields(conditional, {"condition", "scaling"}, f"{path}.conditionalScaling")
        _audit_condition(conditional.get("condition"), f"{path}.conditionalScaling.condition", collector)
        _audit_scaling(conditional.get("scaling"), f"{path}.conditionalScaling.scaling", collector)


def _audit_hit(value: Any, path: str, collector: AuditCollector) -> None:
    hit = require_object(value, path)
    reject_unknown_fields(
        hit,
        {
            "id", "weight", "spRecovery", "spReturn", "stagger", "durationExtension",
            "effects", "treatAsReaction",
        },
        path,
    )
    for index, effect in enumerate(hit.get("effects", [])):
        _audit_effect(effect, f"{path}.effects[{index}]", collector, "nestedHit")
    if "treatAsReaction" in hit:
        require_enum(hit["treatAsReaction"], TREAT_AS_REACTION_TYPES, f"{path}.treatAsReaction")


def _audit_effect(value: Any, path: str, collector: AuditCollector, location: str) -> None:
    effect = require_object(value, path)
    kind = require_string(effect.get("kind"), f"{path}.kind")
    specific_fields = EFFECT_FIELDS.get(kind)
    if specific_fields is None:
        raise AuditFailure(f"{path}.kind", f"未知 effect kind：{kind}")
    reject_unknown_fields(effect, EFFECT_COMMON_FIELDS | specific_fields, path)
    require_fields(effect, EFFECT_REQUIRED_FIELDS[kind], path)
    if kind == "consume" and not ({"operatorStatus", "enemyStatus"} & set(effect)):
        raise AuditFailure(path, "consume 至少需要 operatorStatus 或 enemyStatus")
    collector.effects.add(kind, path)
    collector.effect_locations[location] += 1

    if "target" in effect:
        _audit_target(effect["target"], f"{path}.target", collector, "effect")
    else:
        implicit = "enemy" if kind in {"infliction", "burst", "reaction", "physicalStatus", "damageHit", "damageOverTime"} else "self"
        if kind == "status" and isinstance(effect.get("stat"), dict):
            implicit = "enemy" if effect["stat"].get("modifier") in {
                "susceptibility", "increasedDmgTaken", "resistanceShred", "slowed", "weaken",
                "inflictionBarrier",
            } else "self"
        collector.targets.add(f"effect:implicit-{implicit}", path)

    if "stat" in effect:
        _audit_stat(effect["stat"], f"{path}.stat", collector)
    for field_name in (
        "value", "duration", "stacks", "maxStacks", "effectiveness", "multiplier",
    ):
        if field_name in effect and effect[field_name] != "fromConsume":
            require_level_values(effect[field_name], f"{path}.{field_name}")
    for field_name in ("durationExtension", "icd", "offset", "interval", "defaultLevel"):
        if field_name in effect:
            require_number(effect[field_name], f"{path}.{field_name}")
    if "stackStrategy" in effect:
        require_enum(effect["stackStrategy"], STACK_STRATEGIES, f"{path}.stackStrategy")
    if "applyTiming" in effect:
        require_enum(effect["applyTiming"], APPLY_TIMINGS, f"{path}.applyTiming")
    if "sourceGroup" in effect:
        require_enum(effect["sourceGroup"], SOURCE_GROUPS, f"{path}.sourceGroup")
    if "element" in effect:
        allowed_elements = ARTS_ELEMENTS if kind == "infliction" else DAMAGE_ELEMENTS
        require_enum(effect["element"], allowed_elements, f"{path}.element")
    if "reactionType" in effect:
        require_enum(effect["reactionType"], REACTION_TYPES, f"{path}.reactionType")
    if "requiresInfliction" in effect:
        require_enum_values(effect["requiresInfliction"], ARTS_ELEMENTS, f"{path}.requiresInfliction")
    if "physicalType" in effect:
        require_enum(effect["physicalType"], PHYSICAL_STATUS_TYPES, f"{path}.physicalType")
    if "skillType" in effect:
        require_enum(effect["skillType"], SKILL_TYPES, f"{path}.skillType")
    if "skillTypes" in effect:
        require_enum_values(effect["skillTypes"], SKILL_TYPE_SCOPES, f"{path}.skillTypes")
    if "multiplierMode" in effect:
        require_enum(effect["multiplierMode"], MULTIPLIER_MODES, f"{path}.multiplierMode")
    if "consumeScope" in effect:
        require_enum(effect["consumeScope"], {"team"}, f"{path}.consumeScope")
    if "readConsumedStacks" in effect:
        read = require_object(effect["readConsumedStacks"], f"{path}.readConsumedStacks")
        reject_unknown_fields(read, {"statusKey", "target"}, f"{path}.readConsumedStacks")
        require_fields(read, {"statusKey", "target"}, f"{path}.readConsumedStacks")
        require_string(read["statusKey"], f"{path}.readConsumedStacks.statusKey")
        require_enum(read["target"], {"enemy", "self"}, f"{path}.readConsumedStacks.target")
    if "condition" in effect:
        _audit_condition(effect["condition"], f"{path}.condition", collector)
    for field_name in ("scaling", "multiplierScaling", "staggerScaling"):
        if field_name in effect:
            _audit_scaling(effect[field_name], f"{path}.{field_name}", collector)
    if kind == "damageHit" and "hit" in effect:
        _audit_hit(effect["hit"], f"{path}.hit", collector)
    if kind == "damageOverTime":
        for index, consumed in enumerate(effect.get("consumedStatEffects", [])):
            item = require_object(consumed, f"{path}.consumedStatEffects[{index}]")
            reject_unknown_fields(item, {"stat", "value"}, f"{path}.consumedStatEffects[{index}]")
            _audit_stat(item.get("stat"), f"{path}.consumedStatEffects[{index}].stat", collector)
    if kind == "consume":
        for field_name in ("operatorStatus", "enemyStatus"):
            if field_name in effect:
                _audit_status_matcher(effect[field_name], f"{path}.{field_name}", collector)
        if "consumeTarget" in effect:
            _audit_target(effect["consumeTarget"], f"{path}.consumeTarget", collector, "consume")


def _audit_trigger(value: Any, path: str, collector: AuditCollector) -> None:
    wrapper = require_object(value, path)
    reject_unknown_fields(
        wrapper, {"trigger", "effects", "skillLevelKey", "damageEffectSkillType"}, path,
    )
    trigger = require_object(wrapper.get("trigger"), f"{path}.trigger")
    require_fields(wrapper, {"trigger", "effects"}, path)
    kind = require_string(trigger.get("kind"), f"{path}.trigger.kind")
    allowed = TRIGGER_FIELDS.get(kind)
    if allowed is None:
        raise AuditFailure(f"{path}.trigger.kind", f"未知 trigger kind：{kind}")
    reject_unknown_fields(trigger, allowed, f"{path}.trigger")
    collector.triggers.add(kind, f"{path}.trigger")
    if "skillTypes" in trigger:
        require_enum_values(trigger["skillTypes"], SKILL_TYPES, f"{path}.trigger.skillTypes")
    if "skillId" in trigger:
        skill_ids = trigger["skillId"] if isinstance(trigger["skillId"], list) else [trigger["skillId"]]
        for index, skill_id in enumerate(skill_ids):
            require_string(skill_id, f"{path}.trigger.skillId[{index}]")
    if "triggerScope" in trigger:
        require_enum(trigger["triggerScope"], TRIGGER_SCOPES, f"{path}.trigger.triggerScope")
    if "element" in trigger:
        require_enum_values(trigger["element"], DAMAGE_ELEMENTS, f"{path}.trigger.element")
    if "target" in trigger:
        require_enum(trigger["target"], {"enemy", "self"}, f"{path}.trigger.target")
        _audit_target(trigger["target"], f"{path}.trigger.target", collector, "trigger")
    if "status" in trigger:
        _audit_status_matcher(trigger["status"], f"{path}.trigger.status", collector)
    for index, effect in enumerate(require_list(wrapper.get("effects"), f"{path}.effects")):
        _audit_effect(effect, f"{path}.effects[{index}]", collector, "trigger")


def _audit_slot(value: Any, path: str, collector: AuditCollector, allow_triggers: bool) -> None:
    slot = require_object(value, path)
    allowed = {"effects", "triggers"} if allow_triggers else {"effects"}
    reject_unknown_fields(slot, allowed, path)
    effects = slot.get("effects", [])
    require_list(effects, f"{path}.effects")
    for index, effect in enumerate(effects):
        _audit_effect(effect, f"{path}.effects[{index}]", collector, "passive")
    triggers = slot.get("triggers", [])
    require_list(triggers, f"{path}.triggers")
    for index, trigger in enumerate(triggers):
        _audit_trigger(trigger, f"{path}.triggers[{index}]", collector)


def _audit_weapon(record: dict[str, Any], collector: AuditCollector) -> None:
    definition = require_object(record["definition"], _path(record))
    reject_unknown_fields(
        definition, {"rarity", "type", "icon", "baseAtk", "skill1", "skill2", "skill3", "forms"}, _path(record),
    )
    require_fields(
        definition, {"rarity", "type", "icon", "baseAtk", "skill1", "skill2", "skill3"}, _path(record),
    )
    require_number(definition["rarity"], _path(record, "rarity"))
    require_enum(definition["rarity"], WEAPON_RARITIES, _path(record, "rarity"))
    require_string(definition["type"], _path(record, "type"))
    require_enum(definition["type"], WEAPON_TYPES, _path(record, "type"))
    require_string(definition["icon"], _path(record, "icon"))
    base_attack = require_list(definition["baseAtk"], _path(record, "baseAtk"))
    if not base_attack:
        raise AuditFailure(_path(record, "baseAtk"), "基础攻击数组不能为空")
    for index, value in enumerate(base_attack):
        require_number(value, _path(record, f"baseAtk[{index}]"))
    for key in ("skill1", "skill2", "skill3"):
        _audit_slot(definition.get(key), _path(record, key), collector, True)
    if "forms" not in definition:
        return
    forms = require_object(definition["forms"], _path(record, "forms"))
    reject_unknown_fields(forms, {"selector", "forms"}, _path(record, "forms"))
    selector = require_object(forms.get("selector"), _path(record, "forms.selector"))
    reject_unknown_fields(selector, {"kind", "left", "right"}, _path(record, "forms.selector"))
    if selector.get("kind") != "attributeCompare":
        raise AuditFailure(_path(record, "forms.selector.kind"), "未知武器形态选择器")
    require_enum(selector.get("left"), ATTRIBUTES, _path(record, "forms.selector.left"))
    require_enum(selector.get("right"), ATTRIBUTES, _path(record, "forms.selector.right"))
    entries = require_list(forms.get("forms"), _path(record, "forms.forms"))
    collector.form_counts["weaponDefinitions"] += 1
    collector.form_counts["weaponVariants"] += len(entries)
    for index, form_value in enumerate(entries):
        form_path = _path(record, f"forms.forms[{index}]")
        form = require_object(form_value, form_path)
        reject_unknown_fields(form, {"key", "nameKey", "skill1", "skill2", "skill3"}, form_path)
        require_string(form.get("key"), f"{form_path}.key")
        for key in ("skill1", "skill2", "skill3"):
            if key in form:
                _audit_slot(form[key], f"{form_path}.{key}", collector, True)


def _audit_gear_piece(record: dict[str, Any], collector: AuditCollector) -> None:
    definition = require_object(record["definition"], _path(record))
    reject_unknown_fields(
        definition,
        {"name", "icon", "slotType", "levelRequirement", "defense", "skill1", "skill2", "skill3", "setSlug"},
        _path(record),
    )
    require_fields(
        definition, {"name", "icon", "slotType", "levelRequirement", "defense", "skill1"}, _path(record),
    )
    for field_name in ("name", "icon", "slotType"):
        require_string(definition[field_name], _path(record, field_name))
    require_enum(definition["slotType"], GEAR_SLOT_TYPES, _path(record, "slotType"))
    require_number(definition["levelRequirement"], _path(record, "levelRequirement"))
    require_number(definition["defense"], _path(record, "defense"))
    _audit_slot(definition.get("skill1"), _path(record, "skill1"), collector, False)
    for key in ("skill2", "skill3"):
        if key in definition:
            _audit_slot(definition[key], _path(record, key), collector, False)


def _audit_gear_set(record: dict[str, Any], collector: AuditCollector) -> None:
    definition = require_object(record["definition"], _path(record))
    reject_unknown_fields(definition, {"effects", "triggers"}, _path(record))
    require_fields(definition, {"effects"}, _path(record))
    for index, effect in enumerate(require_list(definition.get("effects"), _path(record, "effects"))):
        _audit_effect(effect, _path(record, f"effects[{index}]"), collector, "passive")
    for index, trigger in enumerate(definition.get("triggers", [])):
        _audit_trigger(trigger, _path(record, f"triggers[{index}]"), collector)


def audit_snapshot(snapshot: Any) -> dict[str, Any]:
    """校验快照并返回可稳定序列化的审计结果。"""
    root = require_object(snapshot, "$")
    reject_unknown_fields(root, {"schemaVersion", "records"}, "$")
    if root.get("schemaVersion") != 1:
        raise AuditFailure("$.schemaVersion", "只支持版本 1")
    records = require_list(root.get("records"), "$.records")
    collector = AuditCollector()
    seen: set[tuple[str, str]] = set()
    handlers = {"weapon": _audit_weapon, "gearPiece": _audit_gear_piece, "gearSet": _audit_gear_set}
    for index, raw_record in enumerate(records):
        record = require_object(raw_record, f"$.records[{index}]")
        reject_unknown_fields(record, {"kind", "slug", "sourcePath", "definition"}, f"$.records[{index}]")
        kind = require_string(record.get("kind"), f"$.records[{index}].kind")
        slug = require_string(record.get("slug"), f"$.records[{index}].slug")
        require_string(record.get("sourcePath"), f"$.records[{index}].sourcePath")
        if kind not in handlers:
            raise AuditFailure(f"$.records[{index}].kind", f"未知来源类型：{kind}")
        identity = (kind, slug)
        if identity in seen:
            raise AuditFailure(f"$.records[{index}]", f"重复身份：{kind}:{slug}")
        seen.add(identity)
        collector.source_counts[kind] += 1
        handlers[kind](record, collector)

    return {
        "schemaVersion": 1,
        "status": "complete",
        "sourceCounts": dict(sorted(collector.source_counts.items())),
        "formCounts": dict(sorted(collector.form_counts.items())),
        "effectLocationCounts": dict(sorted(collector.effect_locations.items())),
        "effectKinds": collector.effects.to_json(),
        "modifiers": collector.modifiers.to_json(),
        "triggers": collector.triggers.to_json(),
        "conditions": collector.conditions.to_json(),
        "targets": collector.targets.to_json(),
    }
