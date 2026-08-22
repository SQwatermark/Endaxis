"""把已审计的 BuffData 中间表示转换为技能步骤可内联的 Buff 定义。"""

from __future__ import annotations

from collections.abc import Callable

from source_models import (
    BuffDamageScaleProcessorSource,
    BuffDefinitionSource,
    BuffInstantAttributeProcessorSource,
    ScalarSource,
)
from source_utils import ts_inline_literal


STACKING_TYPES = {
    "Unlimited": "unlimited",
    "HighPriority": "highPriority",
    "Stack": "stack",
    "Enhance": "enhance",
    "Refresh": "refresh",
    "Extend": "extend",
    "Modify": "modify",
    "Unique": "unique",
    "EnhanceAndRefresh": "enhanceAndRefresh",
    "OverwriteDuration": "overwriteDuration",
    "EnhanceAndOverwriteDuration": "enhanceAndOverwriteDuration",
    "HighPriorityWithMaxStack": "highPriorityWithMaxStack",
}

ATTRIBUTE_SLOTS = {
    "Addition": "addition",
    "Multiplier": "multiplier",
    "FinalAddition": "finalAddition",
    "FinalMultiplier": "finalMultiplier",
    "BaseAddition": "baseAddition",
    "BaseMultiplier": "baseMultiplier",
    "BaseFinalAddition": "baseFinalAddition",
    "BaseFinalMultiplier": "baseFinalMultiplier",
}

# 原生 AttributeType 名称到 Next 伤害快照属性的已审计映射。
BUFF_ATTRIBUTE_RUNTIME_KEYS = {
    "CriticalRate": "criticalRate",
    "CriticalDamageIncrease": "criticalDamageIncrease",
    "NormalAttackDamageIncrease": "normalAttackDamageIncrease",
    "NormalSkillDamageIncrease": "normalSkillDamageIncrease",
    "PhysicalDamageIncrease": "physicalDamageIncrease",
    "PulseDamageIncrease": "electricDamageIncrease",
    "CrystDamageIncrease": "cryoDamageIncrease",
}

DAMAGE_SIDES = {"Attacker": "attacker", "Defender": "defender"}
DAMAGE_SCALE_ZONES = {
    "ProdCalcZone": "product",
    "NormalCalcZone": "normal",
    "AbnormalAndBurstIncrease": "abnormalAndBurst",
    "EnhancedDmgIncreace": "enhanced",
    "ComboCalcZone": "combo",
    "VulnerableDmgIncreace": "vulnerable",
    "RaceCalcZone": "race",
}
COMPARISON_OPERATORS = {
    "LT": "less",
    "LE": "lessOrEqual",
    "GT": "greater",
    "GE": "greaterOrEqual",
    "Equals": "equal",
    "NotEquals": "notEqual",
}

BEHAVIOR_FIELDS = (
    "directDamageHits",
    "intervalDamageHits",
    "inflictions",
    "conditionalActions",
    "blackboardCalculations",
    "blackboardMutations",
    "buffBlackboardReads",
    "buffFinishes",
    "eventActions",
    "comboQteActions",
    "pauseTimeActions",
    "igniteEventActions",
    "resourceGains",
    "combatActions",
    "auraActions",
    "auxiliaryActions",
    "skillReplacements",
)

SCHEDULE_BEHAVIOR_FIELDS = frozenset(
    {
        "directDamageHits",
        "intervalDamageHits",
        "inflictions",
        "conditionalActions",
        "blackboardCalculations",
        "blackboardMutations",
        "buffBlackboardReads",
        "buffFinishes",
        "resourceGains",
        "combatActions",
        "auxiliaryActions",
    }
)

PRESENTATION_EVENT_ACTION_TYPES = frozenset(
    {
        "EffectAction",
        "PlaySoundAction",
        "IfElseAction",
        "TogglableAction",
        "CheckBuffStackNumAdvanced",
    }
)
PRESENTATION_STACK_EFFECT_ACTION_TYPES = frozenset({"EffectAction"})


def _event_actions_are_presentation_only(source: BuffDefinitionSource) -> bool:
    if not source.eventActions:
        return True
    for event in source.eventActions:
        projected_empty = all(
            not sequence.actions for sequence in getattr(event, "sequences", ())
        )
        if not hasattr(event, "orderedActionTypes") or not (
            set(event.orderedActionTypes) <= PRESENTATION_EVENT_ACTION_TYPES
            and projected_empty
        ):
            return False
        if set(getattr(event, "combatActions", ())) - {"IfElseAction"}:
            return False
        if any(
            getattr(event, field, ())
            for field in (
                "damageUnits", "buffApplications", "createdBuffIds", "forEachActions",
                "targetGroupWrites", "runtimeTargetGroupWrites", "obtainAtbFilters",
                "contextBuffTagQueries", "contextBuffIdQueries", "consumeBuffLayerChecks",
            )
        ):
            return False
    return True


def _event_actions_are_projected(source: BuffDefinitionSource) -> bool:
    vulnerable_events = tuple(
        event
        for event in source.eventActions
        if getattr(event, "eventSource", None) == "buff"
        and getattr(event, "event", None) in {"OnBuffStart", "DuringBuffEnable"}
        and getattr(event, "orderedActionTypes", ())
        in {("VulnerableAction",), ("SaveBuffLifeTime", "VulnerableAction")}
    )
    return bool(vulnerable_events) and len(vulnerable_events) == len(source.eventActions) and any(
        not modifier.tagIds
        and any(processor.zone == "VulnerableDmgIncreace" for processor in modifier.processors)
        for modifier in source.damageModifiers
    )


def _skill_replacements_are_manual_slot_presentation(source: BuffDefinitionSource) -> bool:
    """手动放置连携形态时，结束 Buff 后恢复 ComboSkill 槽位不改变模拟行为。"""
    return bool(source.skillReplacements) and all(
        replacement.eventSource == "buff"
        and replacement.event == "OnBuffFinish"
        and replacement.skillSlot == "ComboSkill"
        and replacement.skillSource.targetSource == "Owner"
        and not replacement.skillSource.targetGroupKey
        and replacement.lifeTimeType == "Infinite"
        for replacement in source.skillReplacements
    )


def is_strictly_presentation_only_buff(source: BuffDefinitionSource) -> bool:
    """判断一个 Buff 是否只有已识别的表现动作，因而可从模拟中剔除。"""
    lifecycle = source.lifecycle
    if not source.sourceAvailable or lifecycle is None:
        return False
    stack_effects_are_presentation_only = (
        lifecycle.hasStackEffects
        and bool(lifecycle.stackEffectActionTypes)
        and set(lifecycle.stackEffectActionTypes)
        <= PRESENTATION_STACK_EFFECT_ACTION_TYPES
    )
    events_are_presentation_only = bool(source.eventActions) and _event_actions_are_presentation_only(
        source
    )
    if lifecycle.hasStackEffects and not stack_effects_are_presentation_only:
        return False
    if source.eventActions and not events_are_presentation_only:
        return False
    if not stack_effects_are_presentation_only and not events_are_presentation_only:
        return False
    return not any(
        (
            source.blackboard,
            source.applyTagIds,
            source.extendTagIds,
            source.attributeModifiers,
            source.damageModifiers,
            source.directDamageHits,
            source.inflictions,
            source.conditionalActions,
            source.blackboardCalculations,
            source.blackboardMutations,
            source.buffBlackboardReads,
            source.buffFinishes,
            getattr(source, "igniteEventActions", ()),
            source.sourceDeathFinish,
            source.resourceGains,
            source.combatActions,
            source.unparsedPayloads,
            source.auraActions,
            source.invokedAbilityEntitySkills,
            source.auxiliaryActions,
            source.targetGroupWrites,
            source.skillReplacements,
        )
    )
def compile_inline_buff_definition(
    source: BuffDefinitionSource,
    path: str,
    compile_event_responses: Callable[[BuffDefinitionSource, str], str] | None = None,
    compile_scheduled_sequences: Callable[[BuffDefinitionSource, str], str] | None = None,
) -> str:
    """生成不含 Buff ID 的完整定义；无法无损表达时明确拒绝。"""
    if not source.sourceAvailable or source.lifecycle is None:
        raise ValueError(f"{path}: Buff {source.buffId!r} has no available source definition")
    unsupported = [payload.field for payload in source.unparsedPayloads]
    source_death_finish = getattr(source, "sourceDeathFinish", None)
    unsupported.extend(
        field
        for field in BEHAVIOR_FIELDS
        if getattr(source, field, ())
        and not (
            (
                field in {"eventActions", "igniteEventActions"}
                and (
                    source_death_finish is not None
                    or _event_actions_are_presentation_only(source)
                    or _event_actions_are_projected(source)
                    or compile_event_responses is not None
                )
            )
            or (field == "comboQteActions" and compile_event_responses is not None)
            or (field == "pauseTimeActions" and compile_event_responses is not None)
            or (field in SCHEDULE_BEHAVIOR_FIELDS and compile_scheduled_sequences is not None)
            or (field == "auraActions" and compile_event_responses is not None)
            or (
                field == "skillReplacements"
                and _skill_replacements_are_manual_slot_presentation(source)
            )
        )
    )
    if unsupported:
        raise ValueError(
            f"{path}: Buff {source.buffId!r} contains unsupported behavior: "
            + ", ".join(unsupported)
        )
    lifecycle = source.lifecycle
    if (
        lifecycle.hasStackEffects
        and lifecycle.stackEffectActionTypes
        and not set(lifecycle.stackEffectActionTypes) <= PRESENTATION_STACK_EFFECT_ACTION_TYPES
    ):
        raise ValueError(f"{path}: Buff {source.buffId!r} uses unsupported stack effects")

    fields = [f"stackingType: {ts_inline_literal(STACKING_TYPES[lifecycle.stackingType])},"]
    if getattr(source, "useTimeDilationDt", False):
        fields.append(
            "timeClock: "
            f"{ts_inline_literal('self' if getattr(source, 'onlyUseSelfTimeDilation', False) else 'global')},"
        )
    if lifecycle.stackingIdentifierType == "StackingKey":
        fields.append(f"stackingKey: {ts_inline_literal(lifecycle.stackingKey)},")
    fields.extend(
        [
            f"priority: {_compile_scalar(lifecycle.priority, negate=lifecycle.negatePriority)},",
            f"maxStackCount: {_compile_non_negative_integer(lifecycle.maxStackCount, f'{path}.maxStackCount')},",
        ]
    )
    if lifecycle.lifeType == "Limited":
        fields.append(f"durationSeconds: {_compile_scalar(lifecycle.duration)},")
    if not (
        lifecycle.triggerInterval.value < 0
        and lifecycle.triggerInterval.blackboardKey is None
    ):
        fields.extend(
            [
                f"triggerIntervalSeconds: {_compile_scalar(lifecycle.triggerInterval)},",
                f"waitFirstTriggerInterval: {ts_inline_literal(lifecycle.waitFirstTriggerInterval)},",
                f"maxTriggerCount: {_compile_integer_operand(lifecycle.maxTriggerCount, f'{path}.maxTriggerCount')},",
            ]
        )
    if source.applyTagIds:
        fields.append(f"applyTagIds: {ts_inline_literal(source.applyTagIds)},")
    if source.extendTagIds:
        fields.append(f"extendTagIds: {ts_inline_literal(source.extendTagIds)},")
    if source.blackboard:
        fields.append("blackboard: {")
        fields.extend(
            f"  {ts_inline_literal(item.key)}: {ts_inline_literal(item.value)},"
            for item in source.blackboard
        )
        fields.append("},")
    if getattr(source, "shields", ()):
        fields.append("shields: [")
        for shield in source.shields:
            fields.extend([
                "  {",
                f"    infinityValue: {ts_inline_literal(shield.infinityValue)},",
                f"    value: {_compile_scalar(shield.value)},",
                f"    absorbCount: {_compile_scalar(shield.absorbCount)},",
                f"    absorbAllDamageWhenConsumed: {ts_inline_literal(shield.absorbAllDamageWhenConsumed)},",
                f"    removeBuffWhenConsumed: {ts_inline_literal(shield.removeBuffWhenConsumed)},",
                f"    priority: {ts_inline_literal('prioritizeConsume' if shield.priority == 'PrioritizeConsume' else 'normal')},",
                f"    replaceHitEffect: {ts_inline_literal(shield.replaceHitEffect)},",
                "    damageAbsorptions: [",
            ])
            for absorption in shield.damageAbsorptions:
                fields.extend([
                    "      {",
                    f"        damageType: {ts_inline_literal(absorption.damageType)},",
                    f"        ratio: {_compile_scalar(absorption.ratio)},",
                    f"        scale: {_compile_scalar(absorption.scale)},",
                    "      },",
                ])
            fields.extend(["    ],", "  },"])
        fields.append("],")
    if getattr(source, "sustainedProtections", ()):
        if len(source.sustainedProtections) != 1:
            raise ValueError(f"{path}: multiple sustained protection actions are unsupported")
        protection = source.sustainedProtections[0]
        if protection.target.targetSource not in {"Owner", "Source"} or not all((
            not protection.target.targetGroupKey,
            not protection.target.validatorTypes,
            not protection.target.postProcessorTypes,
        )):
            raise ValueError(f"{path}: unsupported sustained protection target")
        fields.extend([
            "sustainedProtection: {",
            f"  target: {ts_inline_literal('owner' if protection.target.targetSource == 'Owner' else 'buffSource')},",
            f"  superArmor: {_compile_scalar(protection.superArmor)},",
            f"  impactResistance: {_compile_scalar(protection.impactResistance)},",
            "},",
        ])
    if getattr(source, "runtimeSkillSlotReplacements", ()):
        fields.append("skillSlotReplacements: [")
        for replacement in source.runtimeSkillSlotReplacements:
            fields.extend(
                [
                    "  {",
                    f"    skillGroupKey: {ts_inline_literal(replacement['skillGroupKey'])},",
                    f"    targetSkillKey: {ts_inline_literal(replacement['targetSkillKey'])},",
                    f"    revertedSkillKey: {ts_inline_literal(replacement['revertedSkillKey'])},",
                    "    inheritOriginSkillCooldownProgress: "
                    f"{ts_inline_literal(replacement['inheritOriginSkillCooldownProgress'])},",
                    "  },",
                ]
            )
        fields.append("],")
    if source.attributeModifiers:
        fields.append("attributeModifiers: [")
        for modifier in source.attributeModifiers:
            if modifier.targetType != "Specific":
                raise ValueError(
                    f"{path}: Buff {source.buffId!r} uses unsupported attribute target "
                    f"{modifier.targetType!r}"
                )
            fields.extend(
                [
                    "  {",
                    "    attribute: "
                    f"{ts_inline_literal(BUFF_ATTRIBUTE_RUNTIME_KEYS.get(modifier.attributeType, modifier.attributeType))},",
                    f"    slot: {ts_inline_literal(ATTRIBUTE_SLOTS[modifier.slot])},",
                    f"    value: {_compile_scalar(modifier.value)},",
                    *(
                        ["    source: 'converted',"]
                        if getattr(source, "attributeModifiersConverted", False)
                        else []
                    ),
                    "  },",
                ]
            )
        fields.append("],")
    if source.damageModifiers:
        fields.append("damageModifiers: [")
        for modifier in source.damageModifiers:
            if modifier.tagIds and (
                modifier.targetSource != "Target" or modifier.targetGroupKey
            ):
                raise ValueError(
                    f"{path}: Buff {source.buffId!r} uses unsupported damage condition target "
                    f"{modifier.targetSource!r}/{modifier.targetGroupKey!r}"
                )
            if any(
                condition.targetSource != "Target" or condition.targetGroupKey
                for condition in getattr(modifier, "tagConditions", ())
            ):
                raise ValueError(
                    f"{path}: Buff {source.buffId!r} uses unsupported conjunctive tag target"
                )
            fields.extend([
                "  {",
                f"    enabledSide: {ts_inline_literal(DAMAGE_SIDES[modifier.enabledSide])},",
            ])
            conditions: list[list[str]] = []
            if modifier.tagIds:
                conditions.append([
                    "{",
                    "  kind: 'entityTagMatch',",
                    "  target: 'enemy',",
                    f"  tagQueryType: {ts_inline_literal(modifier.tagQueryType)},",
                    f"  tagIds: {ts_inline_literal(modifier.tagIds)},",
                    "}",
                ])
            for tag_condition in getattr(modifier, "tagConditions", ()):
                conditions.append([
                    "{",
                    "  kind: 'entityTagMatch',",
                    "  target: 'enemy',",
                    f"  tagQueryType: {ts_inline_literal(tag_condition.queryType)},",
                    f"  tagIds: {ts_inline_literal(tag_condition.tagIds)},",
                    "}",
                ])
            if getattr(modifier, "ownerControlled", False):
                conditions.append(["{", "  kind: 'casterControlled',", "}"])
            damage_tags = getattr(modifier, "damageTags", ())
            if damage_tags:
                conditions.append([
                    "{",
                    "  kind: 'eventDamageTagsMatch',",
                    f"  match: {ts_inline_literal(modifier.damageTagMatch)},",
                    f"  tags: {ts_inline_literal(damage_tags)},",
                    "}",
                ])
            damage_features = getattr(modifier, "damageFeatures", ())
            if damage_features:
                conditions.append([
                    "{",
                    "  kind: 'eventDamageFeaturesMatch',",
                    f"  match: {ts_inline_literal(modifier.damageFeatureMatch)},",
                    f"  features: {ts_inline_literal(damage_features)},",
                    "}",
                ])
            damage_types = getattr(modifier, "damageTypes", ())
            if damage_types:
                conditions.append([
                    "{",
                    "  kind: 'eventDamageTypesMatch',",
                    f"  damageTypes: {ts_inline_literal(damage_types)},",
                    "}",
                ])
            for comparison in getattr(modifier, "numberComparisons", ()):
                operator = COMPARISON_OPERATORS.get(comparison.comparison)
                if operator is None:
                    raise ValueError(
                        f"{path}: Buff {source.buffId!r} uses unsupported damage comparison "
                        f"{comparison.comparison!r}"
                    )
                conditions.append([
                    "{",
                    "  kind: 'buffBlackboardCompare',",
                    f"  left: {_compile_scalar(comparison.left)},",
                    f"  operator: {ts_inline_literal(operator)},",
                    f"  right: {_compile_scalar(comparison.right)},",
                    "}",
                ])
            for comparison in getattr(modifier, "healthComparisons", ()):
                operator = COMPARISON_OPERATORS.get(comparison.comparison)
                if operator is None:
                    raise ValueError(
                        f"{path}: Buff {source.buffId!r} uses unsupported health comparison "
                        f"{comparison.comparison!r}"
                    )
                if comparison.targetSource != "Target" or comparison.targetGroupKey:
                    raise ValueError(
                        f"{path}: Buff {source.buffId!r} uses unsupported health target"
                    )
                conditions.append([
                    "{",
                    "  kind: 'targetHealthCompare',",
                    "  target: 'enemy',",
                    f"  valueType: {ts_inline_literal('ratio' if comparison.isRatio else 'current')},",
                    f"  operator: {ts_inline_literal(operator)},",
                    f"  value: {_compile_scalar(comparison.value)},",
                    "}",
                ])
            for comparison in getattr(modifier, "buffCountComparisons", ()):
                operator = COMPARISON_OPERATORS.get(comparison.comparison)
                if operator is None:
                    raise ValueError(
                        f"{path}: Buff {source.buffId!r} uses unsupported Buff-count comparison "
                        f"{comparison.comparison!r}"
                    )
                target = {"Source": "caster", "Target": "enemy"}.get(
                    comparison.targetSource
                )
                if target is None or comparison.targetGroupKey:
                    raise ValueError(
                        f"{path}: Buff {source.buffId!r} uses unsupported Buff-count target"
                    )
                conditions.append([
                    "{",
                    "  kind: 'buffIdCountCompare',",
                    f"  target: {ts_inline_literal(target)},",
                    f"  buffIds: {ts_inline_literal(comparison.buffIds)},",
                    f"  operator: {ts_inline_literal(operator)},",
                    f"  value: {_compile_scalar(comparison.value)},",
                    "}",
                ])
            if len(conditions) == 1:
                condition = conditions[0]
                fields.append(f"    condition: {condition[0]}")
                fields.extend(f"    {line}" for line in condition[1:-1])
                fields.append(f"    {condition[-1]},")
            elif conditions:
                fields.extend(["    condition: {", "      kind: 'all',", "      conditions: ["])
                for condition in conditions:
                    fields.extend(f"        {line}" for line in condition[:-1])
                    fields.append(f"        {condition[-1]},")
                fields.extend(["      ],", "    },"])
            fields.append("    processors: [")
            for processor in modifier.processors:
                if isinstance(processor, BuffInstantAttributeProcessorSource) or hasattr(
                    processor, "targetSide"
                ):
                    attribute = BUFF_ATTRIBUTE_RUNTIME_KEYS.get(
                        processor.attributeType, processor.attributeType
                    )
                    fields.extend(
                        [
                            "      {",
                            "        kind: 'instantAttribute',",
                            f"        targetSide: {ts_inline_literal(DAMAGE_SIDES[processor.targetSide])},",
                            f"        attribute: {ts_inline_literal(attribute)},",
                            "        values: {",
                            f"          slot: {ts_inline_literal(ATTRIBUTE_SLOTS[processor.slot])},",
                            f"          value: {_compile_scalar(processor.value)},",
                            "        },",
                            "        attributeTiming: 'runtime',",
                            "      },",
                        ]
                    )
                    continue
                if not isinstance(processor, BuffDamageScaleProcessorSource) and not hasattr(
                    processor, "zone"
                ):
                    raise TypeError(f"{path}: unsupported damage processor source")
                zone = DAMAGE_SCALE_ZONES.get(processor.zone)
                if zone is None:
                    raise ValueError(
                        f"{path}: Buff {source.buffId!r} uses unknown damage scale zone "
                        f"{processor.zone!r}"
                    )
                fields.extend(
                    [
                        "      {",
                        "        kind: 'damageScale',",
                        f"        side: {ts_inline_literal(DAMAGE_SIDES[processor.side])},",
                        f"        zone: {ts_inline_literal(zone)},",
                        f"        addition: {_compile_scalar(processor.addition)},",
                        "      },",
                    ]
                )
            fields.extend(["    ],", "  },"])
        fields.append("],")
    if source_death_finish is not None:
        fields.extend(
            [
                "lifecycleSequences: {",
                "  trigger: {",
                "    steps: [",
                "      step('finishCurrentAbilityEntityWhenSourceDies', {}),",
                "    ],",
                "  },",
                "},",
            ]
        )
    if source.eventActions and compile_event_responses is not None:
        compiled_events = compile_event_responses(source, f"{path}.eventActions")
        if compiled_events:
            fields.extend(compiled_events.splitlines())
    if getattr(source, "igniteEventActions", ()) and compile_event_responses is not None:
        compiled_events = compile_event_responses(source, f"{path}.igniteEventActions")
        if compiled_events:
            fields.extend(compiled_events.splitlines())
    if compile_scheduled_sequences is not None:
        compiled_schedule = compile_scheduled_sequences(source, f"{path}.scheduledSequences")
        if compiled_schedule:
            fields.extend(compiled_schedule.splitlines())
    return "\n".join(fields)


def _compile_scalar(source: ScalarSource, *, negate: bool = False) -> str:
    if source.blackboardKey is None:
        if source.levelValues is not None:
            raise ValueError("generated Buff scalar still contains unresolved level values")
        return ts_inline_literal(-source.value if negate else source.value)
    # blackboardKey 引用的默认值已在定义 blackboard 中声明；levelValues 只保留审计事实，
    # 不进入内联定义，避免把等级数组冻结成单值或误报 unresolved。
    fields = [f"blackboardKey: {ts_inline_literal(source.blackboardKey)}"]
    if negate:
        fields.append("negate: true")
    return "{ " + ", ".join(fields) + " }"


def _require_fixed_integer(source: ScalarSource, field: str) -> int:
    if source.blackboardKey is not None or not float(source.value).is_integer():
        raise ValueError(f"{field} requires an unresolved dynamic or non-integer value")
    return int(source.value)


def _compile_non_negative_integer(source: ScalarSource, field: str) -> str:
    if source.blackboardKey is not None:
        return "{ blackboardKey: " + ts_inline_literal(source.blackboardKey) + " }"
    if not float(source.value).is_integer() or source.value < 0:
        raise ValueError(f"{field} requires a non-negative integer value")
    return str(int(source.value))


def _compile_integer_operand(source: ScalarSource, field: str) -> str:
    if source.blackboardKey is not None:
        return "{ blackboardKey: " + ts_inline_literal(source.blackboardKey) + " }"
    if not float(source.value).is_integer():
        raise ValueError(f"{field} requires an integer value")
    return str(int(source.value))
