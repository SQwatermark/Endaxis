"""静态装备候选定义适配器的映射与 fail-closed 测试。"""

from __future__ import annotations

import unittest

from .audit_schema import AuditFailure
from .candidate_definition_ir import build_candidate_definition_ir


def migration_entry(effect: dict, *, entry_id: str = "weapon:sample:skill1.effects[0]") -> dict:
    return {
        "id": entry_id,
        "source": {
            "kind": "weapon",
            "slug": "sample",
            "sourcePath": "src/data/weapons/sample.ts",
            "slot": "skill1",
            "formKey": None,
            "effectPath": "skill1.effects[0]",
            "location": "passive",
        },
        "classification": {"kind": "buildStaticContribution"},
        "semantics": {"effectKind": "status", "modifier": effect["stat"]["modifier"]},
        "sourceEffect": effect,
    }


def migration_ir(*entries: dict) -> dict:
    return {"schemaVersion": 1, "entries": list(entries)}


class CandidateDefinitionIrTest(unittest.TestCase):
    def test_maps_attributes_panel_stats_and_percentage_units(self) -> None:
        report = build_candidate_definition_ir(migration_ir(
            migration_entry({
                "kind": "status",
                "target": "self",
                "stat": {"modifier": "attributePercent", "attribute": "sub"},
                "value": [10, 25],
            }),
            migration_entry({
                "kind": "status",
                "target": "self",
                "stat": {"modifier": "atkFlat"},
                "value": 34,
            }, entry_id="weapon:sample:skill2.effects[0]"),
        ))
        self.assertEqual(report["entries"][0]["candidateDefinition"], {
            "kind": "attribute",
            "attribute": "secondary",
            "operation": "percent",
            "value": [0.1, 0.25],
        })
        self.assertTrue(report["entries"][0]["characterPanelVisible"])
        self.assertEqual(report["entries"][1]["candidateDefinition"], {
            "kind": "panelStat",
            "stat": "attackFlat",
            "value": 34,
        })

    def test_maps_scoped_damage_bonus_but_not_to_character_panel(self) -> None:
        report = build_candidate_definition_ir(migration_ir(migration_entry({
            "kind": "status",
            "target": "self",
            "stat": {
                "modifier": "dmgBonus",
                "elements": ["electric", "nature"],
                "skillTypes": "battleSkill",
            },
            "value": 25.6,
        })))
        entry = report["entries"][0]
        self.assertEqual(entry["candidateDefinition"], {
            "kind": "damageBonus",
            "damageTypes": ["electric", "nature"],
            "skillTypes": "battleSkill",
            "value": 0.256,
        })
        self.assertFalse(entry["characterPanelVisible"])

    def test_reports_ambiguous_and_unsupported_static_semantics(self) -> None:
        effects = [
            {"kind": "status", "stat": {"modifier": "dmgBonus", "skillTypes": "ultimate"}, "value": 20},
            {"kind": "status", "stat": {"modifier": "ampBonus", "elements": "heat"}, "value": 10},
            {"kind": "status", "stat": {"modifier": "attributeAtkPercent"}, "value": 5},
        ]
        report = build_candidate_definition_ir(migration_ir(*[
            migration_entry(effect, entry_id=f"weapon:sample:skill3.effects[{index}]")
            for index, effect in enumerate(effects)
        ]))
        self.assertEqual(
            [entry["gap"]["code"] for entry in report["entries"]],
            [
                "damage-types-required",
                "amplification-channel-unsupported",
                "attribute-attack-coefficient-unsupported",
            ],
        )
        self.assertEqual(report["summary"]["definitionReadyCount"], 0)

    def test_unknown_modifier_and_fields_fail_closed(self) -> None:
        with self.assertRaisesRegex(AuditFailure, "未知静态 modifier"):
            build_candidate_definition_ir(migration_ir(migration_entry({
                "kind": "status", "stat": {"modifier": "futureModifier"}, "value": 1,
            })))
        with self.assertRaisesRegex(AuditFailure, "未预期字段"):
            build_candidate_definition_ir(migration_ir(migration_entry({
                "kind": "status",
                "stat": {"modifier": "atkPercent", "elements": "heat"},
                "value": 10,
            })))

    def test_counts_trigger_filter_modifiers_without_treating_them_as_effects(self) -> None:
        entry = migration_entry({
            "kind": "status", "stat": {"modifier": "atkPercent"}, "value": 10,
        })
        entry["classification"]["kind"] = "eventTriggeredBehavior"
        entry["semantics"]["trigger"] = {
            "kind": "onStatusApplied",
            "status": {"modifier": "ampBonus", "elements": "electric"},
        }
        report = build_candidate_definition_ir(migration_ir(entry))
        audit = report["summary"]["specialModifierAudit"]["ampBonus"]
        self.assertEqual(audit["effectCount"], 0)
        self.assertEqual(audit["triggerFilterCount"], 1)


if __name__ == "__main__":
    unittest.main()
