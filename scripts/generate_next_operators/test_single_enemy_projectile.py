from __future__ import annotations

import unittest
from dataclasses import replace

from single_enemy_projectile import recursive_projectile_launch_has_no_single_enemy_target
from source_models import (
    ConditionalBranchActionSource,
    ProjectileLaunchPayload,
    ProjectileSkillTriggerSource,
    ProjectileTriggeredSkillSource,
    TargetGroupWriteSource,
    TargetReferenceSource,
)


class SingleEnemyProjectileTests(unittest.TestCase):
    def make_action(self) -> ConditionalBranchActionSource:
        target = TargetReferenceSource(
            targetSource="Context",
            targetGroupKey="extra_target",
            selectorOwner="ActionOwner",
            ownerContextKey="",
            centerType="ActionSource",
            centerContextKey="",
            centerToGround=False,
            target="ActionSource",
            targetContextKey="",
            enableAdvancedDirection=False,
            selectorDirection="SourceForward",
            finderType=None,
            validatorTypes=(),
            postProcessorTypes=(),
        )
        child = ProjectileTriggeredSkillSource(
            launchFrame=24,
            actionOrder=(1,),
            assumedTravelFrames=0,
            projectileId="projectile_test",
            triggerEvent="hit",
            triggerSkillId="skill_hit",
            excludedByPrimaryTargetMarker=False,
            sourceFile="skill_hit.json",
            damageUnits=(),
            directDamageHits=(),
            conditionalActions=(),
            auxiliaryActions=(),
            resourceGains=(),
            inflictions=(),
            combatActions=(),
            cycleTruncated=True,
            nestedProjectileTriggeredSkills=(),
        )
        return ConditionalBranchActionSource(
            actionType="LaunchProjectile",
            actionIndex=2,
            actionPath=("condition", "succeedActions", "actionData", "[2]"),
            serverActionIndex=6,
            projectileLaunch=ProjectileLaunchPayload(
                projectileId="projectile_test",
                skillTriggers=(ProjectileSkillTriggerSource("hit", "skill_hit"),),
                target=target,
            ),
            projectileTriggeredSkills=(child,),
        )

    def make_write(self) -> TargetGroupWriteSource:
        return TargetGroupWriteSource(
            startFrame=0,
            endFrame=3,
            actionIndex=5,
            actionPath=("condition", "succeedActions", "actionData", "[1]"),
            targetGroupKey="extra_target",
            producerType="FindTargetAction",
            finderType="HitBoxFinder",
            finderFactionTarget="Anti",
            finderTargetObjectType="Normal",
            finderCheckAlive=True,
            validatorTypes=(),
            postProcessorTypes=("ExcludeTarget", "PriorityFilter"),
            inputTargets=(),
            intervalSeconds=None,
            excludesCurrentTarget=True,
        )

    def test_excluding_current_target_makes_recursive_launch_empty(self) -> None:
        self.assertTrue(
            recursive_projectile_launch_has_no_single_enemy_target(
                self.make_action(), (self.make_write(),)
            )
        )

    def test_does_not_assume_exclusion_from_processor_name_alone(self) -> None:
        write = replace(self.make_write(), excludesCurrentTarget=False)
        self.assertFalse(
            recursive_projectile_launch_has_no_single_enemy_target(
                self.make_action(), (write,)
            )
        )


if __name__ == "__main__":
    unittest.main()
