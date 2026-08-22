from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from passive_skill_parser import parse_passive_skill


class PassiveSkillParserTests(unittest.TestCase):
    def test_parses_add_buff_blackboard_mapping(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "passive.json").write_text(
                json.dumps(
                    {
                        "skillId": "passive",
                        "castType": "Passive",
                        "passiveSkillType": "AddBuff",
                        "blackboard": [{"key": "rate"}],
                        "buffs": [
                            {
                                "buffId": "buff-passive",
                                "assignBlackboard": True,
                                "assignItems": [
                                    {
                                        "targetKey": "amount",
                                        "inputValueKey": "rate",
                                        "useDirectValue": False,
                                    }
                                ],
                            }
                        ],
                        "toggleBuffs": [],
                    }
                ),
                encoding="utf-8",
            )

            source = parse_passive_skill("passive", root)

        self.assertTrue(source.can_generate_add_buff)
        self.assertEqual(source.referenced_buff_ids, ("buff-passive",))
        self.assertEqual(source.buffs[0].assignments[0].target_key, "amount")

    def test_keeps_toggle_buff_runtime_as_an_explicit_generation_gap(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "passive.json").write_text(
                json.dumps(
                    {
                        "skillId": "passive",
                        "castType": "Passive",
                        "passiveSkillType": "ToggleBuff",
                        "blackboard": [],
                        "buffs": [],
                        "toggleBuffs": [{}],
                    }
                ),
                encoding="utf-8",
            )

            source = parse_passive_skill("passive", root)

        self.assertFalse(source.can_generate_add_buff)
        self.assertIn("toggle Buffs are not supported", source.unsupported_reasons)

    def test_add_buff_runtime_ignores_inactive_toggle_payload(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "passive.json").write_text(
                json.dumps(
                    {
                        "skillId": "passive",
                        "castType": "Passive",
                        "passiveSkillType": "AddBuff",
                        "blackboard": [],
                        "buffs": [{
                            "buffId": "buff.startup",
                            "assignBlackboard": False,
                            "assignItems": [],
                        }],
                        "toggleBuffs": [{}],
                    }
                ),
                encoding="utf-8",
            )

            source = parse_passive_skill("passive", root)

        self.assertTrue(source.can_generate_add_buff)
        self.assertNotIn("toggle Buffs are not supported", source.unsupported_reasons)


if __name__ == "__main__":
    unittest.main()
