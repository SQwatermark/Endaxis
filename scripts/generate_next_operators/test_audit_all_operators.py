"""验证全干员生成普查的发现范围与阻塞归类不会随实现重构漂移。"""

from __future__ import annotations

import unittest

from audit_all_operators import (
    SkillAudit,
    build_document,
    classify_blocker,
    classify_skill,
    enumerate_skill_entries,
)


class AuditAllOperatorsTests(unittest.TestCase):
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


if __name__ == "__main__":
    unittest.main()
