"""装备审计器的最小契约测试。"""

from __future__ import annotations

import unittest

from .audit_schema import AuditFailure
from .equipment_audit import audit_snapshot


def snapshot(definition: dict, kind: str = "weapon") -> dict:
    directories = {"weapon": "weapons", "gearPiece": "gearpieces", "gearSet": "gearsets"}
    return {
        "schemaVersion": 1,
        "records": [
            {
                "kind": kind,
                "slug": "sample",
                "sourcePath": f"src/data/{directories[kind]}/sample.ts",
                "definition": definition,
            }
        ],
    }


class EquipmentAuditTest(unittest.TestCase):
    def test_collects_effect_modifier_trigger_condition_and_target(self) -> None:
        definition = {
            "rarity": 6,
            "type": "sword",
            "icon": "/sample.webp",
            "baseAtk": [1],
            "skill1": {
                "effects": [
                    {
                        "kind": "status",
                        "stat": {"modifier": "artsIntensity"},
                        "target": "self",
                        "value": 10,
                        "condition": {"kind": "enemyStaggered"},
                    }
                ]
            },
            "skill2": {},
            "skill3": {
                "triggers": [
                    {
                        "trigger": {
                            "kind": "onStatusApplied",
                            "status": "combustion",
                            "target": "enemy",
                        },
                        "effects": [{"kind": "spRecovery", "value": 10}],
                    }
                ]
            },
        }
        report = audit_snapshot(snapshot(definition))
        self.assertEqual(report["effectKinds"]["status"]["count"], 1)
        self.assertEqual(report["effectKinds"]["spRecovery"]["count"], 1)
        self.assertEqual(report["modifiers"]["artsIntensity"]["count"], 1)
        self.assertEqual(report["triggers"]["onStatusApplied"]["count"], 1)
        self.assertEqual(report["conditions"]["enemyStaggered"]["count"], 1)
        self.assertEqual(report["targets"]["effect:self"]["count"], 1)
        self.assertEqual(report["targets"]["trigger:enemy"]["count"], 1)

    def test_rejects_unknown_effect_kind_with_path(self) -> None:
        definition = {
            "rarity": 6,
            "type": "sword",
            "icon": "/sample.webp",
            "baseAtk": [1],
            "skill1": {"effects": [{"kind": "mystery"}]},
            "skill2": {},
            "skill3": {},
        }
        with self.assertRaisesRegex(AuditFailure, r"skill1\.effects\[0\]\.kind"):
            audit_snapshot(snapshot(definition))

    def test_rejects_unknown_field_instead_of_silently_dropping_it(self) -> None:
        definition = {
            "effects": [{"kind": "status", "stat": {"modifier": "artsIntensity"}, "value": 1, "surprise": True}],
        }
        with self.assertRaisesRegex(AuditFailure, "未预期字段"):
            audit_snapshot(snapshot(definition, "gearSet"))

    def test_rejects_unknown_semantic_categories(self) -> None:
        cases = {
            "modifier": {
                "kind": "status",
                "stat": {"modifier": "mysteryModifier"},
                "value": 1,
            },
            "condition": {
                "kind": "status",
                "condition": {"kind": "mysteryCondition"},
            },
            "target": {"kind": "status", "target": "mysteryTarget"},
        }
        for name, effect in cases.items():
            with self.subTest(name=name), self.assertRaises(AuditFailure):
                audit_snapshot(snapshot({
                    "rarity": 6,
                    "type": "sword",
                    "icon": "/sample.webp",
                    "baseAtk": [1],
                    "skill1": {"effects": [effect]},
                    "skill2": {},
                    "skill3": {},
                }))

        with self.assertRaisesRegex(AuditFailure, "未知 trigger kind"):
            audit_snapshot(snapshot({
                "rarity": 6,
                "type": "sword",
                "icon": "/sample.webp",
                "baseAtk": [1],
                "skill1": {},
                "skill2": {},
                "skill3": {
                    "triggers": [{"trigger": {"kind": "mysteryTrigger"}, "effects": []}]
                },
            }))

    def test_rejects_unknown_nested_enum_value(self) -> None:
        definition = {
            "rarity": 6,
            "type": "sword",
            "icon": "/sample.webp",
            "baseAtk": [1],
            "skill1": {
                "effects": [
                    {
                        "kind": "status",
                        "stat": {"modifier": "dmgBonus", "elements": "futureElement"},
                        "value": 1,
                    }
                ]
            },
            "skill2": {},
            "skill3": {},
        }
        with self.assertRaisesRegex(AuditFailure, "未知枚举值"):
            audit_snapshot(snapshot(definition))


if __name__ == "__main__":
    unittest.main()
