"""集中定义解包战斗动作的分类集合。

解析器与完备性审计必须共享同一分类，新增原生动作时只能在这里扩展，避免不同遍历器产生分歧。
"""

from __future__ import annotations

__all__ = [
    "AUDITED_COMBAT_ACTION_NAMES",
    "AUDITED_COMBAT_EFFECT_ACTION_NAMES",
    "COMBAT_ACTION_NAMES",
    "COMBAT_EFFECT_ACTION_NAMES",
    "CONDITIONAL_AUDIT_ACTION_NAMES",
    "CONSUMED_ROOT_TIMED_MARKERS",
    "SEQUENCE_GUARD_ACTION_NAMES",
    "STATEFUL_COMBAT_ACTION_NAMES",
]

# 这些条件作为 SequenceAction 子项时会用返回值截断同一 actionData 的剩余动作。
SEQUENCE_GUARD_ACTION_NAMES = {
    "CheckAbilityEntityCurDuration",
    "CheckDistanceCondition",
    "CheckMainCharacterCondition",
    "CheckTargetsEqual",
}

COMBAT_ACTION_NAMES = {
    "DamageAction",
    "CreateBuffAction",
    "DestroyBuffAction",
    "LaunchProjectile",
    "SpawnAbilityEntity",
    "AbilityEventAction",
    "BuffEventAction",
    "SpellInfliction",
    "ObtainCostAction",
    "IfElseAction",
    "SwitchAction",
    "SlowAction",
    "FractureAction",
    "AuraAction",
    # 条件直接位于 SequenceAction 时会以 false 截断后续动作；在保留序列边界前必须视为战斗动作。
    *SEQUENCE_GUARD_ACTION_NAMES,
}

# 标记本身不造成伤害，但会改变后续条件、事件冷却或时间轴控制，必须参与完备性审计。
STATEFUL_COMBAT_ACTION_NAMES = {
    "CreateTimedMarker",
    "AddGlobalCDTimer",
    "SetAbilityEntityDuration",
}
AUDITED_COMBAT_ACTION_NAMES = COMBAT_ACTION_NAMES | STATEFUL_COMBAT_ACTION_NAMES

# 这些根级标记已由专用单敌人投影等价消费；这里只阻止完备性审计重复计数。
CONSUMED_ROOT_TIMED_MARKERS = {
    (
        "chr_0030_zhuangfy_combo_skill_ult",
        "zhuangfy_combo_ult_tar",
    ),
}

# 分支动作与序列守卫本身只组织控制流；是否影响战斗取决于其子树中的实际效果动作。
COMBAT_EFFECT_ACTION_NAMES = COMBAT_ACTION_NAMES - {
    "IfElseAction",
    "SwitchAction",
    *SEQUENCE_GUARD_ACTION_NAMES,
}
AUDITED_COMBAT_EFFECT_ACTION_NAMES = (
    COMBAT_EFFECT_ACTION_NAMES | STATEFUL_COMBAT_ACTION_NAMES
)

# 这些运行时动作已单独解析，不进入 unresolvedCombatActions，但必须出现在条件分支审计中。
CONDITIONAL_AUDIT_ACTION_NAMES = COMBAT_ACTION_NAMES | {
    "AddGlobalCDTimer",
    "CreateTimedMarker",
    "FinishBuffAdvanced",
    "GetTargetBuffBBAdvanced",
    "ModifyDynamicBlackboard",
    "SaveBuffStackNumAdvanced",
    "SimpleCalcBBAction",
    "TimeDilationAction",
    "UltimateTimeAction",
    "SetAbilityEntityDuration",
}
