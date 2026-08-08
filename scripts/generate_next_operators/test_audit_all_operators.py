"""验证全干员生成普查的发现范围与阻塞归类不会随实现重构漂移。"""

from __future__ import annotations

import json
from pathlib import Path
import tempfile
import unittest

from audit_all_operators import (
    SkillAudit,
    audit_aura_source_reachability,
    build_document,
    classify_blocker,
    classify_skill,
    collect_entity_count_conditions,
    enumerate_skill_entries,
)
from generate_next_operators import EntityCountConditionSource


class AuditAllOperatorsTests(unittest.TestCase):
    def test_distinguishes_reachable_and_orphan_aura_sources(self) -> None:
        aura_action = {
            "$type": "Example.AuraAction+Data, Example",
            "isEnable": True,
        }

        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory)
            documents = {
                "entry": {"childSkillId": "active_child"},
                "active_child": {"actionData": [aura_action]},
                "orphan_parent": {"childSkillId": "orphan_child"},
                "orphan_child": {"actionData": [aura_action]},
                "old_variant": {"actionData": [aura_action]},
            }
            for skill_id, document in documents.items():
                (source / f"{skill_id}.json").write_text(
                    json.dumps(document), encoding="utf-8"
                )

            result = audit_aura_source_reachability(source, {"entry"})

        self.assertEqual(result["rawActionCount"], 3)
        self.assertEqual(result["reachableActionCount"], 1)
        self.assertEqual(
            result["unreachableSources"],
            [
                {
                    "sourceFile": "old_variant.json",
                    "auraActionCount": 1,
                    "directInboundSources": [],
                },
                {
                    "sourceFile": "orphan_child.json",
                    "auraActionCount": 1,
                    "directInboundSources": ["orphan_parent.json"],
                },
            ],
        )

    def test_collects_entity_count_conditions_before_skill_parsing(self) -> None:
        root = {
            "actionData": [
                {
                    "$type": "Beyond.Gameplay.Core.Conditions.CheckEntityNum+Data, Gameplay.Beyond",
                    "isEnable": True,
                    "checkTarget": {"targetSource": "Context", "targetGroupKey": "targets"},
                    "minNum": 1,
                    "compareType": "GE",
                    "containsHittableTarget": False,
                    "excludeDeadEntity": False,
                    "storeKey": "",
                },
                {
                    "$type": "Beyond.Gameplay.Core.Conditions.CheckEntityNum+Data, Gameplay.Beyond",
                    "isEnable": False,
                    "checkTarget": {"targetSource": "Target", "targetGroupKey": ""},
                    "minNum": 1,
                    "compareType": "GE",
                    "containsHittableTarget": False,
                    "excludeDeadEntity": False,
                    "storeKey": "",
                },
            ]
        }

        self.assertEqual(
            collect_entity_count_conditions(root),
            (
                EntityCountConditionSource(
                    targetSource="Context",
                    targetGroupKey="targets",
                    minimumCount=1,
                    comparison="GE",
                    containsHittableTarget=False,
                    excludeDeadEntity=False,
                    storeKey="",
                ),
            ),
        )

    def test_classifies_normal_group_special_entries(self) -> None:
        self.assertEqual(
            classify_skill(0, "chr_test_power_attack"),
            ("finisher", ["normalAttack", "powerAttack"]),
        )
        self.assertEqual(
            classify_skill(0, "chr_test_plunging_attack_end"),
            ("plungingAttack", ["normalAttack", "plungingAttack"]),
        )
        self.assertEqual(
            classify_skill(1, "chr_test_normal_skill"),
            ("battleSkill", ["normalSkill"]),
        )

    def test_groups_known_failures_by_missing_capability(self) -> None:
        self.assertEqual(
            classify_blocker("skill.schedule[1]: unsupported CheckMainCharacterCondition"),
            "condition-main-operator",
        )
        self.assertEqual(
            classify_blocker("CheckDistanceCondition targets are not covered"),
            "condition-distance",
        )
        self.assertEqual(
            classify_blocker("projectile child combat actions are not projected"),
            "projectile-child-actions",
        )
        self.assertEqual(
            classify_blocker("unsupported damage type Fire"),
            "damage-type-alias",
        )
        self.assertEqual(
            classify_blocker("FileNotFoundError: missing.json"),
            "source-data-missing",
        )

    def test_discovers_current_character_groups_and_filters_obsolete_rows(self) -> None:
        characters = {
            "chr_current": {"engName": "Current"},
            "chr_0002_endminm": {"engName": "Obsolete"},
        }
        growth = {
            "chr_current": {
                "skillGroupMap": {
                    "normal": {
                        "skillGroupType": 0,
                        "skillIdList": ["chr_current_attack1"],
                    }
                }
            },
            "chr_0002_endminm": {
                "skillGroupMap": {
                    "normal": {
                        "skillGroupType": 0,
                        "skillIdList": ["chr_0002_endminm_attack1"],
                    }
                }
            },
        }

        self.assertEqual(
            enumerate_skill_entries(characters, growth),
            [("chr_current", "Current", 0, "chr_current_attack1")],
        )

    def test_builds_operator_and_blocker_summaries_from_skill_results(self) -> None:
        entity_count = EntityCountConditionSource(
            targetSource="Context",
            targetGroupKey="targets",
            minimumCount=1,
            comparison="GE",
            containsHittableTarget=False,
            excludeDeadEntity=False,
            storeKey="",
        )
        document = build_document(
            [
                SkillAudit(
                    "chr_a",
                    "A",
                    "a_attack1",
                    "basicAttack",
                    "dsl-compiled",
                    None,
                    None,
                    ("DamageAction",),
                    entityCountConditions=(entity_count, entity_count),
                ),
                SkillAudit(
                    "chr_a",
                    "A",
                    "a_skill",
                    "battleSkill",
                    "dsl-blocked",
                    "projectile-child-actions",
                    "blocked",
                    ("LaunchProjectile",),
                    entityCountConditions=(entity_count,),
                ),
                SkillAudit(
                    "chr_b",
                    "B",
                    "b_skill",
                    "battleSkill",
                    "source-or-parser-blocked",
                    "source-data-missing",
                    "missing",
                ),
            ]
        )

        self.assertEqual(document["scope"]["operatorCount"], 2)
        self.assertEqual(document["summary"]["parsedCount"], 2)
        self.assertEqual(document["summary"]["compiledCount"], 1)
        self.assertEqual(document["summary"]["completeOperatorCount"], 0)
        self.assertEqual(
            document["summary"]["blockerKinds"],
            {"projectile-child-actions": 1, "source-data-missing": 1},
        )
        self.assertEqual(document["summary"]["entityCountConditionOccurrenceCount"], 3)
        self.assertEqual(document["summary"]["entityCountConditionShapeCount"], 1)
        self.assertEqual(
            document["entityCountConditionShapes"],
            [
                {
                    "targetSource": "Context",
                    "targetGroupKey": "targets",
                    "minimumCount": 1,
                    "comparison": "GE",
                    "containsHittableTarget": False,
                    "excludeDeadEntity": False,
                    "storeKey": "",
                    "occurrenceCount": 3,
                    "skillCount": 2,
                    "examples": [
                        {"characterId": "chr_a", "skillId": "a_attack1"},
                        {"characterId": "chr_a", "skillId": "a_skill"},
                    ],
                }
            ],
        )

    def test_includes_aura_reachability_when_provided(self) -> None:
        reachability = {
            "rawActionCount": 3,
            "reachableActionCount": 1,
            "unreachableSources": [],
        }
        document = build_document([], reachability)

        self.assertEqual(document["summary"]["rawAuraActionCount"], 3)
        self.assertEqual(document["summary"]["reachableAuraActionCount"], 1)
        self.assertIs(document["auraReachability"], reachability)


if __name__ == "__main__":
    unittest.main()
