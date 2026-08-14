"""把已审计的 BuffData 中间表示转换为技能步骤可内联的 Buff 定义。"""

from __future__ import annotations

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
)


def compile_inline_buff_definition(source: BuffDefinitionSource, path: str) -> str:
    """生成不含 Buff ID 的完整定义；无法无损表达时明确拒绝。"""
    if not source.sourceAvailable or source.lifecycle is None:
        raise ValueError(f"{path}: Buff {source.buffId!r} has no available source definition")
    unsupported = [payload.field for payload in source.unparsedPayloads]
    unsupported.extend(field for field in BEHAVIOR_FIELDS if getattr(source, field))
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
                    f"    attribute: {ts_inline_literal(modifier.attributeType)},",
                    f"    slot: {ts_inline_literal(ATTRIBUTE_SLOTS[modifier.slot])},",
                    f"    value: {_compile_scalar(modifier.value)},",
                    "  },",
                ]
            )
        fields.append("],")
    return "\n".join(fields)


def _compile_scalar(source: ScalarSource, *, negate: bool = False) -> str:
    if source.levelValues is not None:
        raise ValueError("generated Buff scalar still contains unresolved level values")
    if source.blackboardKey is None:
        return ts_inline_literal(-source.value if negate else source.value)
    fields = [f"blackboardKey: {ts_inline_literal(source.blackboardKey)}"]
    if negate:
        fields.append("negate: true")
    return "{ " + ", ".join(fields) + " }"


def _require_fixed_integer(source: ScalarSource, field: str) -> int:
    if source.blackboardKey is not None or not float(source.value).is_integer():
        raise ValueError(f"{field} requires an unresolved dynamic or non-integer value")
    return int(source.value)
