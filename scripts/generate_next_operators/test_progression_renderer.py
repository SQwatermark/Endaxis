"""验证养成转换器会严格暴露未知潜能载荷，并在宽松审计中保留结构化缺口。"""

from __future__ import annotations

from types import SimpleNamespace
import unittest

from audit_operator_progression import (
    audit_effect,
    audit_skill_parameter_candidates,
    collect_skill_group_types,
    render_json,
)
from progression_renderer import (
    parse_static_attribute_progression,
    parse_ultimate_cost_multiplier,
    render_potentials,
)


def effect_entry(
    *,
    attr_type: int,
    value: float,
    modifier_type: int = 5,
    **extra: object,
) -> dict[str, object]:
    return {
        "activeCondition": [],
        "attachBuff": {"blackboard": [], "buffId": ""},
        "attachSkill": {"blackboard": [], "skillId": "", "skillPath": ""},
        "attrModifier": {
            "attrType": attr_type,
            "attrValue": value,
            "modifierType": modifier_type,
            "modifyAttributeType": 0,
        },
        "modifyType": 4,
        "skillBbModifier": {
            "bbKey": "",
            "floatValue": 0,
            "modifyType": 0,
            "skillId": "",
            "stringValue": "",
        },
        "skillParamModifier": {
            "modifyType": 0,
            "paramType": 0,
            "paramValue": 0,
            "skillId": "",
        },
        **extra,
    }


def skill_parameter_entry(*, skill_id: str, value: float) -> dict[str, object]:
    """构造与 TableCfg 相同的技能参数效果形状，避免测试跳过空占位字段。"""
    entry = effect_entry(attr_type=0, value=0)
    entry["modifyType"] = 2
    entry["skillParamModifier"] = {
        "modifyType": 2,
        "paramType": 1,
        "paramValue": value,
        "skillId": skill_id,
    }
    return entry


class ProgressionRendererTests(unittest.TestCase):
    def test_audit_json_keeps_scalar_arrays_compact(self) -> None:
        self.assertEqual(
            render_json({"items": ["a", "b"], "rows": [{"value": 1}]}),
            '{\n  "items": ["a", "b"],\n  "rows": [\n    {\n      "value": 1\n    }\n  ]\n}',
        )

    def test_parses_source_confirmed_build_attributes(self) -> None:
        result = parse_static_attribute_progression(
            [
                effect_entry(attr_type=39, value=15),
                effect_entry(attr_type=41, value=15),
            ],
            "effect.dataList",
        )

        self.assertEqual(
            result.build_attribute_modifiers,
            (("strength", 15), ("intellect", 15)),
        )
        self.assertEqual(result.base_panel_stat_modifiers, ())
        self.assertEqual(result.static_damage_increase_modifiers, ())
        self.assertEqual(result.issues, ())
        self.assertEqual(result.missing_capabilities, ())

    def test_strict_mode_rejects_unknown_attribute_data(self) -> None:
        with self.assertRaisesRegex(ValueError, "HealOutputIncrease.*no exact Next"):
            parse_static_attribute_progression(
                [effect_entry(attr_type=29, value=0.08)],
                "effect.dataList",
            )
        with self.assertRaisesRegex(ValueError, "unknown fields"):
            parse_static_attribute_progression(
                [effect_entry(attr_type=39, value=10, unexpected=True)],
                "effect.dataList",
            )
        with self.assertRaisesRegex(ValueError, "expected modifyType=4"):
            parse_static_attribute_progression(
                [effect_entry(attr_type=39, value=10, modifyType=8)],
                "effect.dataList",
            )
        with self.assertRaisesRegex(ValueError, "expected integer static attribute value"):
            parse_static_attribute_progression(
                [effect_entry(attr_type=39, value=10.5)],
                "effect.dataList",
            )
        with self.assertRaisesRegex(ValueError, "expected modifierType=6"):
            parse_static_attribute_progression(
                [effect_entry(attr_type=1, value=0.1)],
                "effect.dataList",
            )

    def test_lenient_mode_keeps_supported_part_and_marks_missing_capability(self) -> None:
        result = parse_static_attribute_progression(
            [
                effect_entry(attr_type=42, value=20),
                effect_entry(attr_type=29, value=0.15),
            ],
            "effect.dataList",
            mode="lenient",
        )

        self.assertEqual(result.build_attribute_modifiers, (("will", 20),))
        self.assertEqual(result.base_panel_stat_modifiers, ())
        self.assertEqual(result.static_damage_increase_modifiers, ())
        self.assertEqual(result.missing_capabilities, ("potentialEffects",))
        self.assertEqual([issue.code for issue in result.issues], ["unsupported-next-attribute"])

    def test_unknown_attribute_type_is_never_silently_discarded(self) -> None:
        with self.assertRaisesRegex(ValueError, "unknown AttributeType 999"):
            parse_static_attribute_progression(
                [effect_entry(attr_type=999, value=10)],
                "effect.dataList",
            )

        result = parse_static_attribute_progression(
            [effect_entry(attr_type=999, value=10)],
            "effect.dataList",
            mode="lenient",
        )

        self.assertEqual(result.build_attribute_modifiers, ())
        self.assertEqual(result.base_panel_stat_modifiers, ())
        self.assertEqual(result.static_damage_increase_modifiers, ())
        self.assertEqual(result.missing_capabilities, ("potentialEffects",))
        self.assertEqual([issue.code for issue in result.issues], ["unknown-attribute-type"])

    def test_converts_source_confirmed_base_panel_attributes(self) -> None:
        result = parse_static_attribute_progression(
            [
                effect_entry(attr_type=1, value=0.1, modifier_type=6),
                effect_entry(attr_type=3, value=20),
                effect_entry(attr_type=9, value=0.07),
                effect_entry(attr_type=87, value=16),
            ],
            "effect.dataList",
        )

        self.assertEqual(result.build_attribute_modifiers, ())
        self.assertEqual(
            result.base_panel_stat_modifiers,
            (
                ("health", "percent", 0.1),
                ("defense", "flat", 20),
                ("criticalRate", "flat", 0.07),
                ("artsIntensity", "flat", 16),
            ),
        )
        self.assertEqual(result.issues, ())

    def test_converts_source_confirmed_static_damage_increases(self) -> None:
        result = parse_static_attribute_progression(
            [
                effect_entry(attr_type=17, value=0.15),
                effect_entry(attr_type=32, value=0.16),
                effect_entry(attr_type=50, value=0.08),
                effect_entry(attr_type=52, value=0.09),
                effect_entry(attr_type=53, value=0.1),
            ],
            "effect.dataList",
        )

        self.assertEqual(result.build_attribute_modifiers, ())
        self.assertEqual(result.base_panel_stat_modifiers, ())
        self.assertEqual(
            result.static_damage_increase_modifiers,
            (
                ("normalAttack", 0.15),
                ("battleSkill", 0.16),
                ("physical", 0.08),
                ("electric", 0.09),
                ("cryo", 0.1),
            ),
        )
        self.assertEqual(result.issues, ())

    def test_renders_equal_attribute_values_as_one_upgrade_modifier(self) -> None:
        source = {
            "char": {
                "potentialUnlockBundle": [
                    {"level": 1, "potentialEffectId": "effect.attributes"}
                ]
            }
        }
        effects = {
            "effect.attributes": {
                "dataList": [
                    effect_entry(attr_type=39, value=15),
                    effect_entry(attr_type=40, value=15),
                    effect_entry(attr_type=1, value=0.1, modifier_type=6),
                    effect_entry(attr_type=3, value=20),
                    effect_entry(attr_type=9, value=0.07),
                    effect_entry(attr_type=87, value=16),
                    effect_entry(attr_type=17, value=0.15),
                    effect_entry(attr_type=52, value=0.09),
                ]
            }
        }
        rendered = render_potentials(
            {
                "slug": "operator",
                "charId": "char",
                "potentials": [{"key": "attributes", "compile": "staticAttributes"}],
            },
            [
                SimpleNamespace(key="comboSkill", skillId="combo"),
                SimpleNamespace(key="ultimate", skillId="ultimate"),
            ],
            source,
            effects,
        )

        self.assertEqual(len(rendered), 1)
        self.assertIn("kind: 'addBuildAttribute'", rendered[0])
        self.assertIn("attributes: ['strength', 'agility']", rendered[0])
        self.assertIn("value: 15", rendered[0])
        self.assertIn(
            "kind: 'modifyBasePanelStat', stat: 'health', operation: 'percent', value: 0.1",
            rendered[0],
        )
        self.assertIn(
            "kind: 'modifyBasePanelStat', stat: 'defense', operation: 'flat', value: 20",
            rendered[0],
        )
        self.assertIn(
            "kind: 'modifyBasePanelStat', stat: 'criticalRate', operation: 'flat', value: 0.07",
            rendered[0],
        )
        self.assertIn(
            "kind: 'modifyBasePanelStat', stat: 'artsIntensity', operation: 'flat', value: 16",
            rendered[0],
        )
        self.assertIn(
            "kind: 'addStaticDamageIncrease', target: 'normalAttack', value: 0.15",
            rendered[0],
        )
        self.assertIn(
            "kind: 'addStaticDamageIncrease', target: 'electric', value: 0.09",
            rendered[0],
        )

    def test_audit_marks_mixed_attribute_effect_as_partial(self) -> None:
        effect = audit_effect(
            "effect.mixed",
            {
                "effect.mixed": {
                    "dataList": [
                        effect_entry(attr_type=42, value=20),
                        effect_entry(attr_type=29, value=0.15),
                    ]
                }
            },
            source="potential",
        )

        conversion = effect["staticAttributeConversion"]
        self.assertEqual(conversion["status"], "partial")
        self.assertEqual(
            conversion["modifiers"],
            [{"kind": "addBuildAttribute", "attribute": "will", "value": 20}],
        )
        self.assertEqual(
            conversion["attributeFacts"][1],
            {
                "entryIndex": 1,
                "attrType": 29,
                "nativeName": "HealOutputIncrease",
                "semantic": "combat.healOutputIncrease",
                "modifierType": 5,
                "modifierName": "BaseAddition",
                "modifyAttributeType": 0,
                "value": 0.15,
                "nextTarget": None,
                "runtimeClosure": {
                    "nativeFormulaSlot": "BaseAddition",
                    "nativeConsumer": "healing output calculation",
                    "nextStatus": "missing-runtime-consumer",
                    "blockers": [
                        "healing operation executor",
                        "healing formula and source/target snapshots",
                        "healing event lifecycle",
                    ],
                    "forbiddenApproximation": "panel stat or damage modifier",
                },
            },
        )
        self.assertEqual(conversion["missingCapabilities"], ["potentialEffects"])

    def test_audit_distinguishes_operator_damage_taken_from_enemy_snapshot(self) -> None:
        effect = audit_effect(
            "effect.ether-taken",
            {"effect.ether-taken": {"dataList": [effect_entry(attr_type=60, value=-0.1)]}},
            source="potential",
        )

        fact = effect["staticAttributeConversion"]["attributeFacts"][0]
        self.assertIsNone(fact["nextTarget"])
        self.assertEqual(
            fact["runtimeClosure"],
            {
                "nativeFormulaSlot": "BaseAddition",
                "nativeConsumer": "ether damage defender resistance factor",
                "nextStatus": "missing-operator-defender-runtime",
                "blockers": [
                    "operator incoming-damage snapshot",
                    "operator incoming-damage execution path",
                ],
                "forbiddenApproximation": "enemy defender resistance snapshot",
            },
        )

    def test_audit_identifies_source_closed_ultimate_cost_multiplier(self) -> None:
        entries = [skill_parameter_entry(skill_id="skill.ultimate", value=0.85)]
        facts = audit_skill_parameter_candidates(
            entries,
            {"skill.ultimate": 2},
            "effect.dataList",
        )

        self.assertEqual(facts[0]["candidate"], "ultimateCostMultiplier")
        self.assertEqual(facts[0]["runtimeClosure"]["nextStatus"], "implemented")
        self.assertEqual(facts[0]["runtimeClosure"]["implementationDecision"], "generate")
        audited = audit_effect(
            "effect.cost",
            {"effect.cost": {"dataList": entries}},
            source="potential",
            skill_group_types={"skill.ultimate": 2},
        )
        self.assertEqual(
            audited["dslConversion"],
            {
                "status": "complete",
                "modifiers": [
                    {
                        "kind": "multiplySkillCost",
                        "skillGroupKey": "ultimate",
                        "resource": "ultimateEnergy",
                        "multiplier": 0.85,
                    }
                ],
                "sourceTargetSkillIds": ["skill.ultimate"],
                "missingCapabilities": [],
            },
        )

    def test_parses_two_form_ultimate_cost_as_one_group_modifier(self) -> None:
        result = parse_ultimate_cost_multiplier(
            [
                {
                    "modifyType": 2,
                    "skillParamModifier": {
                        "modifyType": 2,
                        "paramType": 1,
                        "paramValue": 0.85,
                        "skillId": "skill.arcane.intellect.ultimate",
                    },
                },
                {
                    "modifyType": 2,
                    "skillParamModifier": {
                        "modifyType": 2,
                        "paramType": 1,
                        "paramValue": 0.85,
                        "skillId": "skill.arcane.will.ultimate",
                    },
                },
            ],
            {"skill.arcane.intellect.ultimate", "skill.arcane.will.ultimate"},
            "effect.dataList",
        )

        self.assertIsNotNone(result)
        assert result is not None
        self.assertEqual(result.multiplier, 0.85)
        self.assertEqual(
            result.target_skill_ids,
            ("skill.arcane.intellect.ultimate", "skill.arcane.will.ultimate"),
        )

    def test_ultimate_cost_conversion_rejects_mixed_or_inconsistent_data(self) -> None:
        with self.assertRaisesRegex(ValueError, "mixed ultimate-cost and unrelated"):
            parse_ultimate_cost_multiplier(
                [
                    {
                        "modifyType": 2,
                        "skillParamModifier": {
                            "modifyType": 2,
                            "paramType": 1,
                            "paramValue": 0.85,
                            "skillId": "skill.ultimate",
                        },
                    },
                    {"modifyType": 4, "skillParamModifier": {"skillId": ""}},
                ],
                {"skill.ultimate"},
                "effect.dataList",
            )
        with self.assertRaisesRegex(ValueError, "different cost multipliers"):
            parse_ultimate_cost_multiplier(
                [
                    {
                        "modifyType": 2,
                        "skillParamModifier": {
                            "modifyType": 2,
                            "paramType": 1,
                            "paramValue": value,
                            "skillId": skill_id,
                        },
                    }
                    for skill_id, value in (("skill.a", 0.85), ("skill.b", 0.8))
                ],
                {"skill.a", "skill.b"},
                "effect.dataList",
            )

    def test_render_potentials_infers_ultimate_cost_without_manifest_compile_hint(self) -> None:
        rendered = render_potentials(
            {
                "slug": "operator",
                "charId": "char",
                "potentials": [{"key": "reducedUltimateCost"}],
                "skillGroups": [
                    {"key": "ultimate", "skillKeys": ["ultimateInt", "ultimateWill"]}
                ],
            },
            [
                SimpleNamespace(key="comboSkill", skillId="combo"),
                SimpleNamespace(key="ultimateInt", skillId="ultimate.int"),
                SimpleNamespace(key="ultimateWill", skillId="ultimate.will"),
            ],
            {
                "char": {
                    "potentialUnlockBundle": [
                        {"level": 1, "potentialEffectId": "effect.cost"}
                    ]
                }
            },
            {
                "effect.cost": {
                    "dataList": [
                        {
                            "modifyType": 2,
                            "skillParamModifier": {
                                "modifyType": 2,
                                "paramType": 1,
                                "paramValue": 0.85,
                                "skillId": skill_id,
                            },
                        }
                        for skill_id in ("ultimate.int", "ultimate.will")
                    ]
                }
            },
        )

        self.assertEqual(len(rendered), 1)
        self.assertEqual(rendered[0].count("kind: 'multiplySkillCost'"), 1)
        self.assertIn("skillGroupKey: 'ultimate'", rendered[0])
        self.assertIn("multiplier: 0.85", rendered[0])

    def test_audit_does_not_treat_non_ultimate_cost_as_ultimate_reduction(self) -> None:
        facts = audit_skill_parameter_candidates(
            [
                {
                    "modifyType": 2,
                    "skillParamModifier": {
                        "modifyType": 2,
                        "paramType": 1,
                        "paramValue": 0.85,
                        "skillId": "skill.normal",
                    },
                }
            ],
            {"skill.normal": 1},
            "effect.dataList",
        )

        self.assertNotIn("candidate", facts[0])

    def test_skill_group_index_rejects_conflicting_group_types(self) -> None:
        growth = {
            "skillGroupMap": {
                "group.a": {"skillGroupType": 1, "skillIdList": ["skill.shared"]},
                "group.b": {"skillGroupType": 2, "skillIdList": ["skill.shared"]},
            }
        }

        with self.assertRaisesRegex(ValueError, "conflicting group types"):
            collect_skill_group_types(growth, "growth")


if __name__ == "__main__":
    unittest.main()
