"""验证递归机制普查的引用闭包、缺源报告和稳定序列化。"""

from __future__ import annotations

import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from audit_all_operators import SkillAudit
from audit_recursive_mechanisms import (
    build_document,
    build_operator_closure,
    load_source_index,
    render_markdown,
    serialize_json,
)


class RecursiveMechanismAuditTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = TemporaryDirectory()
        root = Path(self.temporary.name)
        self.skill_dir = root / "skills"
        self.buff_dir = root / "buffs"
        self.skill_dir.mkdir()
        self.buff_dir.mkdir()

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def write_json(self, directory: Path, name: str, value: object) -> None:
        (directory / name).write_text(json.dumps(value), encoding="utf-8")

    def create_fixture(self) -> tuple[dict[str, object], dict[str, object]]:
        self.write_json(
            self.skill_dir,
            "chr_test_attack.json",
            {
                "skillId": "chr_test_attack",
                "childSkillId": "chr_test_hit",
                "allowedSkillIdList": ["chr_test_unrelated"],
                "actionGroupData": {
                    "timelineActions": [
                        {
                            "_sequenceActionData": {
                                "actionData": [
                                    {
                                        "$type": "Game.DamageAction+Data, Game",
                                        "isEnable": True,
                                        "serverActionIndex": 0,
                                    },
                                    {
                                        "$type": "Game.LaunchProjectile+Data, Game",
                                        "isEnable": False,
                                        "serverActionIndex": 1,
                                        "projectileSkillId": "chr_test_hit",
                                    },
                                    {
                                        "$type": "Game.CreateBuffAction+Data, Game",
                                        "serverActionIndex": 2,
                                        "buffs": [{"buffId": "buff_chr_test_loop"}],
                                    },
                                ]
                            }
                        }
                    ]
                },
            },
        )
        self.write_json(
            self.skill_dir,
            "chr_test_hit.json",
            {
                "skillId": "chr_test_hit",
                "actions": [
                    {
                        "$type": "Game.IfElseAction+Data, Game",
                        "condition": {
                            "$type": "Game.CheckEntityNum+Data, Game",
                        },
                    }
                ],
            },
        )
        self.write_json(
            self.skill_dir,
            "chr_test_unrelated.json",
            {"skillId": "chr_test_unrelated", "actions": []},
        )
        self.write_json(
            self.buff_dir,
            "buff_chr_test_loop.json",
            {
                "id": "buff_chr_test_loop",
                "lifeType": "Limited",
                "buffEventAction": [
                    {
                        "buffEvent": "OnBuffStart",
                        "actions": {
                            "actionData": [
                                {
                                    "$type": "Game.CreateBuffAction+Data, Game",
                                    "serverActionIndex": 0,
                                    "buffs": [{"buffId": "buff_chr_test_loop"}],
                                }
                            ]
                        },
                    }
                ],
            },
        )
        characters = {"chr_test": {"engName": "Test"}}
        growth = {
            "chr_test": {
                "skillGroupMap": {
                    "attack": {
                        "skillGroupType": 0,
                        "skillIdList": ["chr_test_attack"],
                    }
                }
            }
        }
        return characters, growth

    def test_follows_skill_and_buff_cycles_once(self) -> None:
        self.create_fixture()
        skills = load_source_index(self.skill_dir, "skillId")
        buffs = load_source_index(self.buff_dir, "id")

        closure_skills, closure_buffs, missing = build_operator_closure(
            "chr_test", ["chr_test_attack"], skills, buffs
        )

        self.assertEqual(closure_skills, {"chr_test_attack", "chr_test_hit"})
        self.assertEqual(closure_buffs, {"buff_chr_test_loop"})
        self.assertEqual(missing, [])

    def test_reports_missing_entry_and_nested_ability_skill(self) -> None:
        self.write_json(
            self.skill_dir,
            "chr_test_attack.json",
            {
                "skillId": "chr_test_attack",
                "abilityEntitySkillId": "chr_test_missing_entity",
            },
        )
        skills = load_source_index(self.skill_dir, "skillId")
        buffs = load_source_index(self.buff_dir, "id")

        _skills, _buffs, missing = build_operator_closure(
            "chr_test", ["chr_test_attack", "chr_test_missing_entry"], skills, buffs
        )

        self.assertEqual(
            {(item.referenceKind, item.referenceId) for item in missing},
            {
                ("skill", "chr_test_missing_entity"),
                ("skill", "chr_test_missing_entry"),
            },
        )

    def test_document_and_reports_are_byte_stable(self) -> None:
        characters, growth = self.create_fixture()
        skills = load_source_index(self.skill_dir, "skillId")
        buffs = load_source_index(self.buff_dir, "id")
        audits = [
            SkillAudit(
                "chr_test",
                "Test",
                "chr_test_attack",
                "basicAttack",
                "dsl-blocked",
                "projectile-child-actions",
                "blocked",
            )
        ]

        first = build_document(characters, growth, skills, buffs, audits)
        second = build_document(characters, growth, skills, buffs, audits)

        self.assertEqual(serialize_json(first), serialize_json(second))
        self.assertEqual(render_markdown(first), render_markdown(second))
        operator = first["operators"][0]
        self.assertEqual(operator["recursiveSkillCount"], 2)
        self.assertEqual(operator["recursiveBuffCount"], 1)
        self.assertEqual(operator["rootEnabledActionCounts"]["DamageAction"], 1)
        self.assertNotIn("LaunchProjectile", operator["rootEnabledActionCounts"])
        self.assertEqual(operator["conditionCounts"], {"CheckEntityNum": 1})
        self.assertEqual(
            first["distributions"]["buffEvents"][0],
            {
                "type": "buffEventAction:OnBuffStart",
                "count": 1,
                "operatorCoverage": 1,
            },
        )


if __name__ == "__main__":
    unittest.main()
