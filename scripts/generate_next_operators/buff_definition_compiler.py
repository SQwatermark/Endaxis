"""把已审计的 BuffData 中间表示转换为技能步骤可内联的 Buff 定义。"""

from __future__ import annotations

from collections.abc import Callable

from source_models import BuffDefinitionSource, ScalarSource
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

BEHAVIOR_FIELDS = (
    "directDamageHits",
    "conditionalActions",
    "blackboardCalculations",
    "blackboardMutations",
    "buffBlackboardReads",
    "buffFinishes",
    "eventActions",
    "resourceGains",
    "combatActions",
    "auraActions",
    "auxiliaryActions",
    "skillReplacements",
)

SCHEDULE_BEHAVIOR_FIELDS = frozenset(
    {
        "directDamageHits",
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

PRESENTATION_EVENT_ACTION_TYPES = frozenset({"EffectAction"})


def _event_actions_are_presentation_only(source: BuffDefinitionSource) -> bool:
    if not source.eventActions:
        return True
    return all(
        hasattr(event, "orderedActionTypes")
        and set(event.orderedActionTypes) <= PRESENTATION_EVENT_ACTION_TYPES
        and not getattr(event, "combatActions", ())
        and not getattr(event, "damageUnits", ())
        and not getattr(event, "buffApplications", ())
        and not getattr(event, "createdBuffIds", ())
        and not getattr(event, "forEachActions", ())
        and not getattr(event, "targetGroupWrites", ())
        for event in source.eventActions
    )


def _event_actions_are_projected(source: BuffDefinitionSource) -> bool:
    vulnerable_events = tuple(
        event
        for event in source.eventActions
        if getattr(event, "eventSource", None) == "buff"
        and getattr(event, "event", None) in {"OnBuffStart", "DuringBuffEnable"}
        and getattr(event, "orderedActionTypes", ()) == ("VulnerableAction",)
    )
    return bool(vulnerable_events) and len(vulnerable_events) == len(source.eventActions) and any(
        not modifier.tagIds
        and any(processor.zone == "VulnerableDmgIncreace" for processor in modifier.processors)
        for modifier in source.damageModifiers
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
                field == "eventActions"
                and (
                    source_death_finish is not None
                    or _event_actions_are_presentation_only(source)
                    or _event_actions_are_projected(source)
                    or compile_event_responses is not None
                )
            )
            or (field in SCHEDULE_BEHAVIOR_FIELDS and compile_scheduled_sequences is not None)
        )
    )
    if unsupported:
        raise ValueError(
            f"{path}: Buff {source.buffId!r} contains unsupported behavior: "
            + ", ".join(unsupported)
        )
    lifecycle = source.lifecycle
    if lifecycle.hasStackEffects:
        raise ValueError(f"{path}: Buff {source.buffId!r} uses unsupported stack effects")

    fields = [f"stackingType: {ts_inline_literal(STACKING_TYPES[lifecycle.stackingType])},"]
    if lifecycle.stackingIdentifierType == "StackingKey":
        fields.append(f"stackingKey: {ts_inline_literal(lifecycle.stackingKey)},")
    fields.extend(
        [
            f"priority: {_compile_scalar(lifecycle.priority, negate=lifecycle.negatePriority)},",
            f"maxStackCount: {_require_fixed_integer(lifecycle.maxStackCount, 'maxStackCount')},",
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
                f"maxTriggerCount: {_require_fixed_integer(lifecycle.maxTriggerCount, 'maxTriggerCount')},",
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
            fields.extend([
                "  {",
                f"    enabledSide: {ts_inline_literal(DAMAGE_SIDES[modifier.enabledSide])},",
            ])
            if modifier.tagIds:
                fields.extend([
                    "    condition: {",
                    "      kind: 'entityTagMatch',",
                    "      target: 'enemy',",
                    f"      tagQueryType: {ts_inline_literal(modifier.tagQueryType)},",
                    f"      tagIds: {ts_inline_literal(modifier.tagIds)},",
                    "    },",
                ])
            fields.append("    processors: [")
            for processor in modifier.processors:
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
