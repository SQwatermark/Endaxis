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


def persistent_entry(effect: dict, *, entry_id: str) -> dict:
    source_kind, slug, effect_path = entry_id.split(":", 2)
    slot = effect_path.split(".", 1)[0] if source_kind != "gearSet" else None
    return {
        "id": entry_id,
        "source": {
            "kind": source_kind,
            "slug": slug,
            "sourcePath": f"src/data/{source_kind}/{slug}.ts",
            "slot": slot,
            "formKey": None,
            "effectPath": effect_path,
            "location": "passive",
        },
        "classification": {"kind": "battlePersistentModifier"},
        "semantics": {
            "effectKind": "status",
            "modifier": effect["stat"]["modifier"],
            "target": {"scope": "self", "explicit": True},
            "condition": effect.get("condition"),
            "lifecycle": {},
        },
        "sourceEffect": effect,
    }


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

    def test_maps_skill_scoped_damage_to_all_native_scaled_damage_types(self) -> None:
        report = build_candidate_definition_ir(migration_ir(migration_entry({
            "kind": "status",
            "stat": {"modifier": "dmgBonus", "skillTypes": "ultimate"},
            "value": 20,
        })))
        definition = report["entries"][0]["candidateDefinition"]
        self.assertEqual(definition["damageTypes"], [
            "physical", "true", "heat", "electric", "cryo", "nature", "ether",
        ])
        self.assertNotIn("lifeDrain", definition["damageTypes"])
        self.assertEqual(definition["skillTypes"], "ultimate")

    def test_maps_all_skill_and_legacy_basic_attack_scope_exactly(self) -> None:
        report = build_candidate_definition_ir(migration_ir(
            migration_entry({
                "kind": "status", "stat": {"modifier": "dmgBonus"}, "value": 20,
            }),
            migration_entry({
                "kind": "status",
                "stat": {"modifier": "dmgBonus", "skillTypes": "basicAttack"},
                "value": 10,
            }, entry_id="weapon:sample:skill2.effects[0]"),
        ))
        self.assertEqual(
            report["entries"][0]["candidateDefinition"]["skillTypes"],
            ["battleSkill", "comboSkill", "ultimate"],
        )
        self.assertEqual(
            report["entries"][1]["candidateDefinition"]["skillTypes"],
            ["basicAttack", "finisher", "plungingAttack"],
        )

    def test_reports_unsupported_static_semantics(self) -> None:
        effects = [
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

    def test_promotes_only_unscoped_stagger_percent_to_static_definition(self) -> None:
        report = build_candidate_definition_ir(migration_ir(
            persistent_entry({
                "kind": "status",
                "stat": {"modifier": "staggerPercent"},
                "target": "self",
                "value": 20,
            }, entry_id="gearSet:swordmancer:effects[0]"),
            persistent_entry({
                "kind": "status",
                "stat": {"modifier": "staggerPercent", "skillTypes": "finalStrike"},
                "target": "self",
                "value": [12, 14.4],
            }, entry_id="weapon:sundered-prince:skill3.effects[0]"),
        ))
        self.assertEqual(report["entries"][0]["candidateDefinition"], {
            "kind": "panelStat",
            "stat": "staggerDamagePercent",
            "value": 0.2,
        })
        self.assertEqual(report["entries"][0]["semanticDestination"], "buildStaticModifier")
        self.assertEqual(
            report["entries"][1]["gap"]["code"],
            "scoped-stagger-modifier-unsupported",
        )

    def test_routes_live_conditions_and_corrected_staggered_bonus_to_persistent_buffs(self) -> None:
        report = build_candidate_definition_ir(migration_ir(
            persistent_entry({
                "kind": "status",
                "stat": {"modifier": "atkPercent"},
                "target": "self",
                "value": [15, 18],
                "condition": {"kind": "operatorHp", "compare": "above", "percent": 80},
            }, entry_id="weapon:hypernova-auto:skill3.effects[0]"),
            persistent_entry({
                "kind": "status",
                "stat": {"modifier": "susceptibility"},
                "target": "self",
                "value": 29.4,
            }, entry_id="gearPiece:aburrey-auditory-chip:skill3.effects[0]"),
        ))
        self.assertEqual(
            [entry["semanticDestination"] for entry in report["entries"]],
            ["battleStartPersistentBuff", "battleStartPersistentBuff"],
        )
        self.assertEqual(
            [entry["gap"]["code"] for entry in report["entries"]],
            [
                "conditional-attribute-buff-unsupported",
                "staggered-target-damage-buff-unsupported",
            ],
        )

    def test_persistent_audit_counts_destination_and_current_readiness_separately(self) -> None:
        report = build_candidate_definition_ir(migration_ir(
            persistent_entry({
                "kind": "status",
                "stat": {"modifier": "staggerPercent"},
                "target": "self",
                "value": 20,
            }, entry_id="gearSet:swordmancer:effects[0]"),
            persistent_entry({
                "kind": "status",
                "stat": {"modifier": "heal"},
                "target": "self",
                "value": 15.6,
            }, entry_id="gearPiece:miner-comm-t1:skill2.effects[0]"),
            persistent_entry({
                "kind": "status",
                "stat": {"modifier": "dmgBonus", "elements": "physical"},
                "target": "self",
                "value": 20,
                "condition": {"kind": "operatorHp", "compare": "above", "percent": 80},
            }, entry_id="gearSet:roving-msgr:effects[1]"),
        ))
        audit = report["summary"]["battlePersistentAudit"]
        self.assertEqual(audit["effectCount"], 3)
        self.assertEqual(audit["buildStaticDestinationCount"], 2)
        self.assertEqual(audit["persistentBuffRequiredCount"], 1)
        self.assertEqual(audit["directBuildStaticDefinitionReadyCount"], 2)
        self.assertEqual(audit["dslGapCount"], 1)
        heal_entry = report["entries"][1]
        self.assertEqual(heal_entry["candidateDefinition"], {
            "kind": "staticHealingIncrease",
            "target": "output",
            "value": 0.156,
        })
        self.assertEqual(audit["targetCounts"], {"self": 3})
        self.assertEqual(audit["conditionKindCounts"], {"none": 2, "operatorHp": 1})
        self.assertEqual(audit["lifecycleCounts"], {"none": 3})
        self.assertEqual(audit["legacyRuntimeDispositionCounts"], {
            "conditionNotBridged": 1,
            "initialInfiniteStatus": 2,
        })

    def test_unknown_persistent_shapes_fail_closed(self) -> None:
        with self.assertRaisesRegex(AuditFailure, "未知的 self susceptibility"):
            build_candidate_definition_ir(migration_ir(persistent_entry({
                "kind": "status",
                "stat": {"modifier": "susceptibility"},
                "target": "self",
                "value": 1,
            }, entry_id="gearPiece:future:skill3.effects[0]")))
        with self.assertRaisesRegex(AuditFailure, "未知常驻效果条件"):
            build_candidate_definition_ir(migration_ir(persistent_entry({
                "kind": "status",
                "stat": {"modifier": "atkPercent"},
                "target": "self",
                "value": 1,
                "condition": {"kind": "futureCondition"},
            }, entry_id="weapon:future:skill3.effects[0]")))


if __name__ == "__main__":
    unittest.main()
