"""单敌人投影下可证明为空的递归投射物分支。"""

from __future__ import annotations

from source_models import (
    ConditionalBranchActionSource,
    ProjectileSkillTriggerSource,
    TargetGroupWriteSource,
)


def recursive_projectile_launch_has_no_single_enemy_target(
    action: ConditionalBranchActionSource,
    target_group_writes: tuple[TargetGroupWriteSource, ...],
) -> bool:
    """证明分支再次发射前已从敌方查找结果排除当前唯一敌人。"""
    launch = action.projectileLaunch
    if launch is None or launch.target is None:
        return False
    target = launch.target
    if (
        target.targetSource != "Context"
        or not target.targetGroupKey
        or target.finderType is not None
        or target.validatorTypes
        or target.postProcessorTypes
    ):
        return False

    triggered = action.projectileTriggeredSkills or ()
    if len(triggered) != 1:
        return False
    child = triggered[0]
    if (
        not child.cycleTruncated
        or child.projectileId != launch.projectileId
        or ProjectileSkillTriggerSource(child.triggerEvent, child.triggerSkillId)
        not in launch.skillTriggers
    ):
        return False

    candidates = tuple(
        write
        for write in target_group_writes
        if write.targetGroupKey == target.targetGroupKey
        and write.actionIndex < (action.serverActionIndex or action.actionIndex)
        and write.actionPath[:-1] == action.actionPath[:-1]
    )
    if len(candidates) != 1:
        return False
    write = candidates[0]
    return (
        write.producerType == "FindTargetAction"
        and write.finderType == "HitBoxFinder"
        and write.finderFactionTarget == "Anti"
        and write.finderTargetObjectType == "Normal"
        and write.finderCheckAlive is True
        and not write.validatorTypes
        and write.excludesCurrentTarget
    )
