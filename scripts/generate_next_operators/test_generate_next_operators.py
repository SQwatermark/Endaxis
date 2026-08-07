"""验证干员生成器最关键的派生规则和严格校验。"""

import unittest

from generate_next_operators import (
    collect_blackboard_keys,
    classify_buff,
    derive_timeline_block,
    parse_scalar,
    parse_direct_damage_hits,
    parse_damage_units,
    parse_inflictions,
    parse_panel_attributes,
    parse_resource_gains,
    parse_skill_patch,
    percentage_values,
    ts_inline_literal,
    typescript_identifier,
)


class GenerateNextOperatorsTests(unittest.TestCase):
    def test_operator_slug_becomes_a_valid_camel_case_identifier(self) -> None:
        self.assertEqual(typescript_identifier("zhuang-fangyi"), "zhuangFangyi")

    def test_panel_attributes_select_milestone_levels_and_truncate_display_values(self) -> None:
        attributes = []
        for level in (1, 20, 40, 60, 80, 90):
            attributes.append(
                {
                    "Attribute": {
                        "attrs": [
                            {"attrType": 0, "attrValue": level},
                            *(
                                {"attrType": attr_type, "attrValue": level + 0.9}
                                for attr_type in (39, 40, 41, 42, 2, 1)
                            ),
                        ]
                    }
                }
            )

        result = parse_panel_attributes({"attributes": attributes}, "character")

        self.assertEqual(result["strength"], (1, 20, 40, 60, 80, 90))
        self.assertEqual(result["baseHealth"], (1, 20, 40, 60, 80, 90))

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

    def test_percentage_values_restore_readable_percentages(self) -> None:
        self.assertEqual(percentage_values((0.25, 1.02, 0.125)), (25, 102, 12.5))

    def test_only_buffs_with_confirmed_semantics_are_classified(self) -> None:
        self.assertEqual(classify_buff("buff_common_damage_immune_ult_skill"), "incomingDamageProtection")
        self.assertEqual(classify_buff("buff_common_power_attack_disable_cast_skill"), "inputLock")
        self.assertEqual(
            classify_buff("buff_common_obtain_ultimate_sp"),
            "skillCostUltimateEnergyGain",
        )
        self.assertEqual(
            classify_buff("buff_chr_0004_pelica_combo_skill_tutorial_marker"),
            "tutorialMarker",
        )
        self.assertEqual(
            classify_buff("buff_chr_9999_example_skill_tutorial_marker"),
            "tutorialMarker",
        )
        self.assertEqual(
            classify_buff("buff_common_pulse_pulse_conduct_triggered"),
            "electrificationReaction",
        )
        self.assertIsNone(classify_buff("buff_operator_damage_bonus"))

    def test_resource_gain_resolves_level_values_and_ignores_disabled_actions(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 24,
                        "_endFrame": 27,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.ObtainCostAction+Data, Example",
                                    "isEnable": False,
                                    "costType": "Atb",
                                },
                                {
                                    "$type": "Example.ObtainCostAction+Data, Example",
                                    "isEnable": True,
                                    "costType": "UltimateSp",
                                    "isPercentValue": False,
                                    "costValue": {
                                        "useBlackboardKey": True,
                                        "blackboardKey": "usp",
                                        "value": 0,
                                    },
                                    "coefficient": {
                                        "useBlackboardKey": False,
                                        "blackboardKey": "",
                                        "value": 1,
                                    },
                                },
                            ]
                        },
                    }
                ]
            }
        }

        gains = parse_resource_gains(root, "skill.json", {"usp": (8.0, 10.0)})

        self.assertEqual(len(gains), 1)
        self.assertEqual((gains[0].startFrame, gains[0].actionIndex), (24, 0))
        self.assertEqual(gains[0].resource, "ultimateEnergy")
        self.assertEqual(gains[0].amount.levelValues, (8.0, 10.0))

    def test_spell_infliction_keeps_frame_action_order_and_element(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 13,
                        "_endFrame": 13,
                        "_sequenceActionData": {
                            "actionData": [
                                {"$type": "Example.FindTarget, Example"},
                                {
                                    "$type": "Example.SpellInfliction+Data, Example",
                                    "inflictionType": "Pulse",
                                    "isExtra": False,
                                },
                                {"$type": "Example.DamageAction, Example"},
                            ]
                        },
                    }
                ]
            }
        }

        inflictions = parse_inflictions(root, "skill.json")

        self.assertEqual(len(inflictions), 1)
        self.assertEqual(
            (
                inflictions[0].startFrame,
                inflictions[0].endFrame,
                inflictions[0].actionIndex,
                inflictions[0].element,
                inflictions[0].isExtra,
            ),
            (13, 13, 1, "electric", False),
        )

    def test_direct_damage_keeps_timeline_and_action_order(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 13,
                        "_endFrame": 15,
                        "_sequenceActionData": {
                            "actionData": [
                                {"$type": "Example.CreateBuffAction, Example"},
                                {
                                    "$type": "Example.DamageAction, Example",
                                    "damageUnits": [
                                        {
                                            "damageType": "Pulse",
                                            "damageAttributeType": "Hp",
                                            "simpleCalculation": True,
                                            "atkScale": {
                                                "useBlackboardKey": True,
                                                "blackboardKey": "atk",
                                                "value": 0,
                                            },
                                        }
                                    ],
                                },
                            ]
                        },
                    }
                ]
            }
        }

        hits = parse_direct_damage_hits(root, "skill.json", {"atk": (1.0, 2.0)})

        self.assertEqual((hits[0].startFrame, hits[0].endFrame, hits[0].actionIndex), (13, 15, 1))
        self.assertEqual(hits[0].damageUnits[0].attackScale.levelValues, (1.0, 2.0))

    def test_breaking_attack_reads_its_nested_scale(self) -> None:
        root = {
            "actionGroupData": {
                "action": {
                    "$type": "Example.DamageAction, Example",
                    "damageUnits": [
                        {
                            "damageType": "Pulse",
                            "damageAttributeType": "Hp",
                            "simpleCalculation": False,
                            "atkScale": {
                                "useBlackboardKey": False,
                                "blackboardKey": "",
                                "value": 4,
                            },
                            "atkCalculation": {
                                "$type": "Example.BreakingAttackCalculation, Example",
                                "atkScale": {
                                    "useBlackboardKey": True,
                                    "blackboardKey": "atk_scale",
                                    "value": 5,
                                },
                            },
                        }
                    ],
                }
            }
        }

        unit = parse_damage_units(root, "finisher.json", {"atk_scale": (4.0, 9.0)})[0]

        self.assertEqual(unit.calculation, "breakingAttack")
        self.assertEqual(unit.attackScale.levelValues, (4.0, 9.0))


if __name__ == "__main__":
    unittest.main()
