from __future__ import annotations

import unittest

from .akedb_source_audit import build_akedb_source_audit
from .audit_schema import AuditFailure


def snapshot() -> dict[str, object]:
    return {
        "schemaVersion": 1,
        "records": [
            {
                "kind": "weapon",
                "slug": "test-lance",
                "definition": {"icon": "/weapons/polearm/wpn_polearm_0001.webp"},
            },
            {
                "kind": "gearPiece",
                "slug": "test-armor",
                "definition": {
                    "icon": "/equipment/test/item_equip_test_body.webp",
                    "setSlug": "test-set",
                },
            },
            {"kind": "gearSet", "slug": "test-set", "definition": {}},
            {"kind": "gearSet", "slug": "no-set-bonuses", "definition": {}},
        ],
    }


class AkedbSourceAuditTests(unittest.TestCase):
    def test_maps_aliases_and_excludes_the_local_sentinel(self) -> None:
        report = build_akedb_source_audit(
            snapshot(),
            {
                "wpn_lance_0001": {
                    "weaponSkillList": ["attr", "skill"],
                }
            },
            {
                "wpn_lance_0001": {"iconId": "wpn_lance_0001"},
                "item_equip_test_body": {},
            },
            {
                "suit_test": {
                    "equipList": ["item_equip_test_body"],
                    "list": [{"equipCnt": 3, "skillID": "set-skill"}],
                }
            },
            {"attr": {}, "skill": {}, "set-skill": {}},
            version_id="test-version",
        )

        self.assertEqual(report["coverageStatus"], "complete")
        self.assertEqual(report["sourceCounts"]["legacySentinels"], 1)
        self.assertEqual(
            report["weaponCoverage"]["matches"],
            [{"gameId": "wpn_lance_0001", "slug": "test-lance"}],
        )
        self.assertEqual(
            report["gearSetCoverage"]["matches"],
            [{"gameId": "suit_test", "slug": "test-set"}],
        )

    def test_retains_expected_coverage_gaps_without_hiding_them(self) -> None:
        value = snapshot()
        value["records"] = value["records"][1:]
        report = build_akedb_source_audit(
            value,
            {"wpn_lance_0001": {"weaponSkillList": ["attr", "skill"]}},
            {
                "wpn_lance_0001": {"iconId": "wpn_lance_0001"},
                "item_equip_test_body": {},
            },
            {
                "suit_test": {
                    "equipList": ["item_equip_test_body"],
                    "list": [{"equipCnt": 3, "skillID": "set-skill"}],
                }
            },
            {"attr": {}, "skill": {}, "set-skill": {}},
            version_id="test-version",
        )
        self.assertEqual(report["auditStatus"], "complete")
        self.assertEqual(report["coverageStatus"], "partial")
        self.assertEqual(report["weaponCoverage"]["missingGameIds"], ["wpn_lance_0001"])

    def test_fails_when_an_akedb_skill_reference_is_missing(self) -> None:
        with self.assertRaisesRegex(AuditFailure, "SkillPatchTable"):
            build_akedb_source_audit(
                snapshot(),
                {"wpn_lance_0001": {"weaponSkillList": ["missing", "skill"]}},
                {
                    "wpn_lance_0001": {"iconId": "wpn_lance_0001"},
                    "item_equip_test_body": {},
                },
                {
                    "suit_test": {
                        "equipList": ["item_equip_test_body"],
                        "list": [{"equipCnt": 3, "skillID": "set-skill"}],
                    }
                },
                {"skill": {}, "set-skill": {}},
                version_id="test-version",
            )


if __name__ == "__main__":
    unittest.main()
