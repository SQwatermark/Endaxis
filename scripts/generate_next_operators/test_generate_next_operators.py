"""验证干员生成器最关键的派生规则和严格校验。"""

import unittest

from generate_next_operators import (
    collect_blackboard_keys,
    derive_timeline_block,
    parse_scalar,
    parse_skill_patch,
    ts_inline_literal,
)


class GenerateNextOperatorsTests(unittest.TestCase):
    def test_allow_next_can_open_before_generic_interrupt_boundary(self) -> None:
        frame, source = derive_timeline_block(
            22,
            ({"startFrame": 18, "endFrame": 28, "skillIds": ["next"]},),
        )

        self.assertEqual((frame, source), (18, "AllowNextSkillAction.startFrame"))

    def test_generic_interrupt_boundary_uses_the_first_following_frame(self) -> None:
        self.assertEqual(derive_timeline_block(43, ()), (44, "exclusiveFrame+1"))

    def test_blackboard_dependencies_are_sorted_and_deduplicated(self) -> None:
        source = {
            "first": {"useBlackboardKey": True, "blackboardKey": "atk_scale"},
            "second": [
                {"useBlackboardKey": True, "blackboardKey": "damage_ratio"},
                {"useBlackboardKey": True, "blackboardKey": "atk_scale"},
            ],
        }

        self.assertEqual(collect_blackboard_keys(source), ("atk_scale", "damage_ratio"))

    def test_empty_template_blackboard_key_is_not_a_dependency(self) -> None:
        self.assertEqual(collect_blackboard_keys({"useBlackboardKey": True, "blackboardKey": ""}), ())

    def test_scalar_resolves_level_values_from_inherited_blackboard(self) -> None:
        scalar = parse_scalar(
            {"useBlackboardKey": True, "blackboardKey": "atk_scale", "value": 0},
            "damage.atkScale",
            {"atk_scale": (0.25, 0.5)},
        )

        self.assertEqual(scalar.blackboardKey, "atk_scale")
        self.assertEqual(scalar.levelValues, (0.25, 0.5))

    def test_skill_patch_requires_every_level_to_have_the_same_keys(self) -> None:
        with self.assertRaisesRegex(ValueError, "missing at some levels"):
            parse_skill_patch(
                {
                    "SkillPatchDataBundle": [
                        {"level": 1, "blackboard": [{"key": "atk", "value": 1}]},
                        {"level": 2, "blackboard": []},
                    ]
                },
                "skill",
            )

    def test_inline_typescript_literal_keeps_short_values_compact(self) -> None:
        self.assertEqual(
            ts_inline_literal({"final": True, "values": (0.25, 15.0)}),
            "{ final: true, values: [0.25, 15] }",
        )


if __name__ == "__main__":
    unittest.main()
