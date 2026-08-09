"""装备迁移 IR 的分类、语义保留和 fail-closed 测试。"""

from __future__ import annotations

import unittest

from .audit_schema import AuditFailure
from .migration_ir import build_migration_ir


def weapon_snapshot(skill3: dict) -> dict:
    return {
        "schemaVersion": 1,
        "records": [
            {
                "kind": "weapon",
                "slug": "sample",
                "sourcePath": "src/data/weapons/sample.ts",
                "definition": {
                    "rarity": 6,
                    "type": "sword",
                    "icon": "/sample.webp",
                    "baseAtk": [1],
                    "skill1": {},
                    "skill2": {},
                    "skill3": skill3,
                },
            }
        ],
    }


class MigrationIrTest(unittest.TestCase):
    def test_classifies_and_preserves_trigger_semantics(self) -> None:
        snapshot = weapon_snapshot({
            "effects": [
                {
                    "kind": "status",
                    "stat": {"modifier": "artsIntensity"},
                    "target": "self",
                    "value": 30,
                },
                {
                    "kind": "status",
                    "stat": {"modifier": "protection"},
                    "target": "self",
                    "value": 10,
                    "condition": {"kind": "operatorHp", "compare": "below", "percent": 50},
                },
            ],
            "triggers": [
                {
                    "trigger": {
                        "kind": "onStatusApplied",
                        "status": "combustion",
                        "target": "enemy",
                    },
                    "effects": [
                        {
                            "kind": "oneTime",
                            "stat": {"modifier": "dmgBonus", "skillTypes": "battleSkill"},
                            "value": 20,
                            "skillTypes": "battleSkill",
                        }
                    ],
                }
            ],
        })
        ir = build_migration_ir(snapshot)
        self.assertEqual(
            ir["summary"]["classificationCounts"],
            {
                "battlePersistentModifier": 1,
                "oneTimeBehavior": 1,
                "buildStaticContribution": 1,
            },
        )
        one_time = next(
            entry for entry in ir["entries"] if entry["classification"]["kind"] == "oneTimeBehavior"
        )
        self.assertEqual(one_time["semantics"]["trigger"]["kind"], "onStatusApplied")
        self.assertEqual(one_time["semantics"]["trigger"]["target"], "enemy")
        self.assertEqual(one_time["semantics"]["modifier"], "dmgBonus")
        self.assertEqual(one_time["semantics"]["target"], {"scope": "self", "explicit": False})
        self.assertEqual(one_time["sourceEffect"]["skillTypes"], "battleSkill")
        self.assertEqual(one_time["classification"]["downstreamStatus"], "requiresCoreCapabilities")
        self.assertIn("event.onStatusApplied", one_time["classification"]["pendingCapabilities"])
        static_entry = next(
            entry
            for entry in ir["entries"]
            if entry["classification"]["kind"] == "buildStaticContribution"
        )
        self.assertEqual(
            static_entry["classification"]["downstreamStatus"],
            "requiresDefinitionAudit",
        )
        self.assertEqual(
            static_entry["classification"]["pendingCapabilities"],
            ["definition.equipmentModifier"],
        )

    def test_marks_passive_instant_action_as_currently_unsupported(self) -> None:
        ir = build_migration_ir(weapon_snapshot({"effects": [{"kind": "spRecovery", "value": 10}]}))
        entry = ir["entries"][0]
        self.assertEqual(entry["classification"]["kind"], "currentlyUnsupported")
        self.assertEqual(entry["classification"]["irStatus"], "blocked")
        self.assertEqual(entry["classification"]["blockers"], ["passive-effect-kind:spRecovery"])

    def test_unknown_source_data_still_fails_closed(self) -> None:
        with self.assertRaisesRegex(AuditFailure, "未知 modifier"):
            build_migration_ir(weapon_snapshot({
                "effects": [
                    {"kind": "status", "stat": {"modifier": "futureModifier"}, "value": 1}
                ]
            }))


if __name__ == "__main__":
    unittest.main()
