"""验证养成转换器会严格暴露未知潜能载荷，并在宽松审计中保留结构化缺口。"""

from __future__ import annotations

from types import SimpleNamespace
import unittest
from unittest.mock import patch

from audit_operator_progression import (
    audit_configured_operator_progression,
    audit_effect,
    audit_skill_parameter_candidates,
    collect_skill_group_types,
    progression_conversion_item,
    render_json,
)
from progression_renderer import (
    parse_static_attribute_progression,
    parse_ultimate_cost_multiplier,
    render_potentials,
    render_talents,
)
from passive_skill_parser import (
    PassiveBuffApplicationSource,
    PassiveBuffAssignmentSource,
    PassiveSkillSource,
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


def skill_cooldown_add_entry(*, skill_id: str, seconds: float) -> dict[str, object]:
    entry = effect_entry(attr_type=0, value=0)
    entry["modifyType"] = 2
    entry["skillParamModifier"] = {
        "modifyType": 1,
        "paramType": 2,
        "paramValue": seconds,
        "skillId": skill_id,
    }
    return entry


def skill_blackboard_entry(
    *, skill_id: str, blackboard_key: str, value: float
) -> dict[str, object]:
    """构造只修改一个技能黑板值的原生养成效果。"""
    entry = effect_entry(attr_type=0, value=0)
    entry["modifyType"] = 3
    entry["skillBbModifier"] = {
        "bbKey": blackboard_key,
        "floatValue": value,
        "modifyType": 1,
        "skillId": skill_id,
        "stringValue": "",
    }
    return entry


class ProgressionRendererTests(unittest.TestCase):
    def test_progression_audit_separates_definition_conversion_from_simulation(self) -> None:
        reaction_event = progression_conversion_item(
            source="potential",
            key="reaction-event",
            compiler="attackAfterReaction",
            effect_ids=("potential.event",),
        )
        connected = progression_conversion_item(
            source="potential",
            key="attributes",
            compiler="staticAttributes",
            effect_ids=("potential.effect",),
        )
        unmodeled = progression_conversion_item(
            source="talent",
            key="unknown",
            compiler="unmodeledTalent",
            effect_ids=("talent.unknown",),
        )

        self.assertTrue(reaction_event["definitionConverted"])
        self.assertTrue(reaction_event["standardSimulationCompileReady"])
        self.assertTrue(connected["definitionConverted"])
        self.assertTrue(connected["standardSimulationCompileReady"])
        self.assertFalse(unmodeled["definitionConverted"])
        self.assertEqual(unmodeled["blocker"], "unmodeled-source-effect")

    def test_configured_progression_audit_infers_ultimate_cost_consumer(self) -> None:
        growth = {
            "talentNodeMap": {
                "node": {
                    "passiveSkillNodeInfo": {
                        "index": 0,
                        "level": 1,
                        "talentEffectId": "talent.effect",
                    }
                }
            },
            "skillGroupMap": {
                "ultimate": {
                    "skillGroupType": 2,
                    "skillIdList": ["skill.ultimate"],
                }
            },
        }
        audited = audit_configured_operator_progression(
            {
                "slug": "operator",
                "charId": "char",
                "talents": [
                    {"index": 0, "key": "talent", "compile": "skillBlackboardPatch"}
                ],
                "potentials": [{"key": "cost"}],
            },
            growth,
            {
                "potentialUnlockBundle": [
                    {"level": 1, "potentialEffectId": "potential.effect"}
                ]
            },
            {
                "talent.effect": {"dataList": []},
                "potential.effect": {
                    "dataList": [
                        skill_parameter_entry(skill_id="skill.ultimate", value=0.85)
                    ]
                },
            },
        )

        self.assertEqual(audited["talent"]["definitionConvertedCount"], 1)
        self.assertEqual(audited["talent"]["standardSimulationCompileReadyCount"], 1)
        self.assertEqual(audited["potential"]["definitionConvertedCount"], 1)
        self.assertEqual(
            audited["potential"]["standardSimulationCompileReadyCount"], 1
        )
        self.assertEqual(audited["potentials"][0]["compiler"], "multiplyUltimateCost")
        self.assertTrue(audited["standardSimulationCompileReady"])

    def test_unmodeled_talent_can_still_render_a_proven_attached_passive(self) -> None:
        growth = {
            "talentNodeMap": {
                "node.a": {
                    "passiveSkillNodeInfo": {
                        "index": 0,
                        "level": 1,
                        "talentEffectId": "effect.talent1",
                    }
                },
                "node.b": {
                    "passiveSkillNodeInfo": {
                        "index": 0,
                        "level": 2,
                        "talentEffectId": "effect.talent2",
                    }
                },
            }
        }
        effects = {
            effect_id: {
                "dataList": [
                    effect_entry(
                        attr_type=0,
                        value=0,
                        attachSkill={
                            "blackboard": [
                                {"key": "amount", "value": amount, "valueStr": ""}
                            ],
                            "skillId": "hidden.passive",
                            "skillPath": "",
                        },
                    )
                ]
            }
            for effect_id, amount in (("effect.talent1", 1), ("effect.talent2", 2))
        }
        passive = PassiveSkillSource(
            skill_id="hidden.passive",
            source_file="hidden.passive.json",
            passive_type="AddBuff",
            declared_blackboard_keys=("amount",),
            buffs=(
                PassiveBuffApplicationSource(
                    "buff.hidden",
                    (PassiveBuffAssignmentSource("value", "amount"),),
                ),
            ),
            unsupported_reasons=(),
        )
        with patch(
            "progression_renderer.compile_inline_buff_definition",
            return_value="stackingType: 'unique',\npriority: 0,",
        ):
            rendered = render_talents(
                {
                    "slug": "operator",
                    "charId": "char",
                    "talents": [
                        {"index": 0, "key": "talent1", "compile": "unmodeledTalent"}
                    ],
                },
                [],
                growth,
                effects,
                {passive.skill_id: passive},
                {"buff.hidden": SimpleNamespace(buffId="buff.hidden")},
            )

        self.assertEqual(len(rendered), 1)
        self.assertIn("passiveSkills: [", rendered[0])
        self.assertIn("'amount': [1, 2]", rendered[0])
        self.assertIn("buffId: 'buff.hidden'", rendered[0])
        self.assertIn("'value': { kind: 'blackboard', key: 'amount' }", rendered[0])

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

    def test_unmodeled_potential_renders_stable_empty_modifier_shell(self) -> None:
        rendered = render_potentials(
            {
                "slug": "operator",
                "charId": "char",
                "potentials": [{"key": "potential1", "compile": "unmodeledPotential"}],
            },
            [
                SimpleNamespace(key="comboSkill", skillId="combo"),
                SimpleNamespace(key="ultimate", skillId="ultimate"),
            ],
            {
                "char": {
                    "potentialUnlockBundle": [
                        {"level": 1, "potentialEffectId": "effect.potential"}
                    ]
                }
            },
            {"effect.potential": {"dataList": [effect_entry(attr_type=0, value=0)]}},
        )

        self.assertEqual(len(rendered), 1)
        self.assertIn("key: 'potential1'", rendered[0])
        self.assertIn("levels: 1", rendered[0])
        self.assertIn("modifiers: []", rendered[0])

    def test_unmodeled_talent_renders_source_level_count(self) -> None:
        growth = {
            "talentNodeMap": {
                "node.a": {
                    "passiveSkillNodeInfo": {
                        "index": 0,
                        "level": 1,
                        "talentEffectId": "effect.talent1",
                    }
                },
                "node.b": {
                    "passiveSkillNodeInfo": {
                        "index": 0,
                        "level": 2,
                        "talentEffectId": "effect.talent2",
                    }
                },
            }
        }
        rendered = render_talents(
            {
                "slug": "operator",
                "charId": "char",
                "talents": [{"index": 0, "key": "talent1", "compile": "unmodeledTalent"}],
            },
            [SimpleNamespace(key="ultimate", skillId="ultimate")],
            growth,
            {
                "effect.talent1": {"dataList": []},
                "effect.talent2": {"dataList": []},
            },
        )

        self.assertEqual(len(rendered), 1)
        self.assertIn("key: 'talent1'", rendered[0])
        self.assertIn("levels: 2", rendered[0])
        self.assertIn("modifiers: []", rendered[0])

    def test_skill_blackboard_patch_renders_add_multiply_and_assign_modifiers(self) -> None:
        growth = {
            "talentNodeMap": {
                "node.a": {
                    "passiveSkillNodeInfo": {
                        "index": 0,
                        "level": 1,
                        "talentEffectId": "effect.talent1",
                    }
                },
                "node.b": {
                    "passiveSkillNodeInfo": {
                        "index": 0,
                        "level": 2,
                        "talentEffectId": "effect.talent2",
                    }
                },
            }
        }
        skills = [SimpleNamespace(key="battleSkill", skillId="skill.battle")]
        effects = {
            "effect.talent1": {
                "dataList": [
                    {
                        "activeCondition": [],
                        "attachBuff": {"blackboard": [], "buffId": ""},
                        "attachSkill": {"blackboard": [], "skillId": "", "skillPath": ""},
                        "attrModifier": {"attrType": 0, "attrValue": 0, "modifierType": 0, "modifyAttributeType": 0},
                        "modifyType": 3,
                        "skillBbModifier": {"bbKey": "talent_1", "floatValue": 1, "modifyType": 3, "skillId": "skill.battle", "stringValue": ""},
                        "skillParamModifier": {"modifyType": 0, "paramType": 0, "paramValue": 0, "skillId": ""},
                    },
                    {
                        "activeCondition": [],
                        "attachBuff": {"blackboard": [], "buffId": ""},
                        "attachSkill": {"blackboard": [], "skillId": "", "skillPath": ""},
                        "attrModifier": {"attrType": 0, "attrValue": 0, "modifierType": 0, "modifyAttributeType": 0},
                        "modifyType": 3,
                        "skillBbModifier": {"bbKey": "pulse_up", "floatValue": 0.0005, "modifyType": 1, "skillId": "skill.battle", "stringValue": ""},
                        "skillParamModifier": {"modifyType": 0, "paramType": 0, "paramValue": 0, "skillId": ""},
                    },
                ]
            },
            "effect.talent2": {
                "dataList": [
                    {
                        "activeCondition": [],
                        "attachBuff": {"blackboard": [], "buffId": ""},
                        "attachSkill": {"blackboard": [], "skillId": "", "skillPath": ""},
                        "attrModifier": {"attrType": 0, "attrValue": 0, "modifierType": 0, "modifyAttributeType": 0},
                        "modifyType": 3,
                        "skillBbModifier": {"bbKey": "talent_1", "floatValue": 1, "modifyType": 3, "skillId": "skill.battle", "stringValue": ""},
                        "skillParamModifier": {"modifyType": 0, "paramType": 0, "paramValue": 0, "skillId": ""},
                    },
                    {
                        "activeCondition": [],
                        "attachBuff": {"blackboard": [], "buffId": ""},
                        "attachSkill": {"blackboard": [], "skillId": "", "skillPath": ""},
                        "attrModifier": {"attrType": 0, "attrValue": 0, "modifierType": 0, "modifyAttributeType": 0},
                        "modifyType": 3,
                        "skillBbModifier": {"bbKey": "pulse_up", "floatValue": 0.0008, "modifyType": 1, "skillId": "skill.battle", "stringValue": ""},
                        "skillParamModifier": {"modifyType": 0, "paramType": 0, "paramValue": 0, "skillId": ""},
                    },
                ]
            },
        }
        rendered = render_talents(
            {
                "slug": "operator",
                "charId": "char",
                "talents": [{"index": 0, "key": "electricDamageBonus", "compile": "skillBlackboardPatch"}],
            },
            skills,
            growth,
            effects,
        )

        self.assertEqual(len(rendered), 1)
        self.assertIn("key: 'electricDamageBonus'", rendered[0])
        self.assertIn("levels: 2", rendered[0])
        self.assertIn("kind: 'patchSkillBlackboard'", rendered[0])
        self.assertIn("blackboardKey: 'talent_1'", rendered[0])
        self.assertIn("value: [1, 1]", rendered[0])
        self.assertIn("blackboardKey: 'pulse_up'", rendered[0])
        self.assertIn("value: [0.0005, 0.0008]", rendered[0])

    def test_potential_can_patch_multiple_blackboard_values(self) -> None:
        rendered = render_potentials(
            {
                "slug": "operator",
                "charId": "char",
                "potentials": [
                    {"key": "potential1", "compile": "skillBlackboardPatch"}
                ],
                "skillGroups": [
                    {"key": "battleSkill", "skillKeys": ["battleSkill"]},
                    {"key": "ultimate", "skillKeys": ["ultimate"]}
                ],
            },
            [
                SimpleNamespace(key="comboSkill", skillId="skill.combo"),
                SimpleNamespace(key="battleSkill", skillId="skill.battle"),
                SimpleNamespace(key="ultimate", skillId="skill.ultimate"),
            ],
            {
                "char": {
                    "potentialUnlockBundle": [
                        {"level": 1, "potentialEffectId": "effect.potential"}
                    ]
                }
            },
            {
                "effect.potential": {
                    "dataList": [
                        skill_blackboard_entry(
                            skill_id="skill.battle",
                            blackboard_key="damage",
                            value=0.1,
                        ),
                        skill_blackboard_entry(
                            skill_id="skill.battle",
                            blackboard_key="stagger",
                            value=0.2,
                        ),
                    ]
                }
            },
        )

        self.assertEqual(rendered[0].count("kind: 'patchSkillBlackboard'"), 2)
        self.assertIn("blackboardKey: 'damage'", rendered[0])
        self.assertIn("blackboardKey: 'stagger'", rendered[0])

    def test_potential_can_patch_multiple_passive_blackboard_values(self) -> None:
        passive = PassiveSkillSource(
            skill_id="skill.passive",
            source_file="skill.passive.json",
            passive_type="AddBuff",
            declared_blackboard_keys=("first", "second"),
            buffs=(PassiveBuffApplicationSource("buff.passive", ()),),
            unsupported_reasons=(),
        )
        rendered = render_potentials(
            {
                "slug": "operator",
                "charId": "char",
                "potentials": [
                    {"key": "potential1", "compile": "passiveBlackboardPatch"}
                ],
                "skillGroups": [
                    {"key": "comboSkill", "skillKeys": ["comboSkill"]},
                    {"key": "ultimate", "skillKeys": ["ultimate"]},
                ],
            },
            [
                SimpleNamespace(key="comboSkill", skillId="skill.combo"),
                SimpleNamespace(key="ultimate", skillId="skill.ultimate"),
            ],
            {
                "char": {
                    "potentialUnlockBundle": [
                        {"level": 1, "potentialEffectId": "effect.potential"}
                    ]
                }
            },
            {
                "effect.potential": {
                    "dataList": [
                        skill_blackboard_entry(
                            skill_id="skill.passive", blackboard_key="first", value=0.1
                        ),
                        skill_blackboard_entry(
                            skill_id="skill.passive", blackboard_key="second", value=0.2
                        ),
                    ]
                }
            },
            {passive.skill_id: passive},
        )

        self.assertEqual(rendered[0].count("kind: 'patchPassiveBlackboard'"), 2)
        self.assertIn("blackboardKey: 'first'", rendered[0])
        self.assertIn("blackboardKey: 'second'", rendered[0])

    def test_potential_can_combine_variant_cooldown_and_blackboard_patches(self) -> None:
        rendered = render_potentials(
            {
                "slug": "operator",
                "charId": "char",
                "potentials": [
                    {"key": "potential3", "compile": "skillCooldownAndBlackboardPatch"}
                ],
                "skillGroups": [
                    {"key": "comboSkill", "skillKeys": ["comboSkill1", "comboSkill2"]},
                    {"key": "ultimate", "skillKeys": ["ultimate"]},
                ],
            },
            [
                SimpleNamespace(key="comboSkill1", skillId="skill.combo.1"),
                SimpleNamespace(key="comboSkill2", skillId="skill.combo.2"),
                SimpleNamespace(key="ultimate", skillId="skill.ultimate"),
            ],
            {
                "char": {
                    "potentialUnlockBundle": [
                        {"level": 3, "potentialEffectId": "effect.potential3"}
                    ]
                }
            },
            {
                "effect.potential3": {
                    "dataList": [
                        skill_cooldown_add_entry(skill_id="skill.combo.1", seconds=-2),
                        skill_blackboard_entry(
                            skill_id="skill.combo.1", blackboard_key="atk_scale", value=1.3
                        ),
                        skill_blackboard_entry(
                            skill_id="skill.combo.2", blackboard_key="atb", value=1.15
                        ),
                    ]
                }
            },
        )

        self.assertIn("kind: 'addSkillCooldownFrames'", rendered[0])
        self.assertIn("skillGroupKey: 'comboSkill'", rendered[0])
        self.assertIn("skillKey: 'comboSkill1'", rendered[0])
        self.assertIn("frames: -60", rendered[0])
        self.assertEqual(rendered[0].count("kind: 'patchSkillBlackboard'"), 2)
        self.assertIn("skillKey: 'comboSkill2'", rendered[0])

    def test_potential_attached_buff_renders_as_upgrade_initialization(self) -> None:
        entry = effect_entry(attr_type=0, value=0)
        entry["modifyType"] = 5
        entry["attachBuff"] = {
            "buffId": "buff.potential",
            "blackboard": [{"key": "ratio", "value": 0.5, "valueStr": ""}],
        }
        definition = SimpleNamespace(
            buffId="buff.potential",
            blackboard=(SimpleNamespace(key="ratio"),),
        )
        with patch(
            "progression_renderer.compile_inline_buff_definition",
            return_value="stackingType: 'unique',\npriority: 0,\nblackboard: { 'ratio': 0.5 },",
        ):
            rendered = render_potentials(
                {
                    "slug": "operator",
                    "charId": "char",
                    "potentials": [{"key": "potential1", "compile": "attachedBuff"}],
                    "skillGroups": [{"key": "ultimate", "skillKeys": ["ultimate"]}],
                },
                [SimpleNamespace(key="ultimate", skillId="skill.ultimate")],
                {
                    "char": {
                        "potentialUnlockBundle": [
                            {"level": 1, "potentialEffectId": "effect.potential1"}
                        ]
                    }
                },
                {"effect.potential1": {"dataList": [entry]}},
                buff_definitions={"buff.potential": definition},
            )

        self.assertIn("initializationSequence: sequence(", rendered[0])
        self.assertIn("buffId: 'buff.potential'", rendered[0])
        self.assertIn("target: 'caster'", rendered[0])
        self.assertIn("'ratio': { kind: 'constant', value: 0.5 }", rendered[0])

    def test_potential_can_combine_skill_blackboard_patch_and_attached_buff(self) -> None:
        attached_entry = effect_entry(attr_type=0, value=0)
        attached_entry["modifyType"] = 5
        attached_entry["attachBuff"] = {
            "buffId": "buff.reset-counter",
            "blackboard": [],
        }
        blackboard_entry = skill_blackboard_entry(
            skill_id="skill.battle",
            blackboard_key="count",
            value=2,
        )
        blackboard_entry["skillBbModifier"]["modifyType"] = 3
        definition = SimpleNamespace(buffId="buff.reset-counter", blackboard=())
        with patch(
            "progression_renderer.compile_inline_buff_definition",
            return_value=(
                "stackingType: 'unique',\n"
                "lifecycleSequences: { start: sequence("
                "step('finishBuffsById', { buffIds: ['buff.counter'], target: 'caster' })"
                ") },"
            ),
        ):
            rendered = render_potentials(
                {
                    "slug": "operator",
                    "charId": "char",
                    "potentials": [
                        {
                            "key": "potential5",
                            "compile": "skillBlackboardPatchAndAttachedBuff",
                        }
                    ],
                    "skillGroups": [
                        {"key": "battleSkill", "skillKeys": ["battleSkill"]},
                        {"key": "ultimate", "skillKeys": ["ultimate"]},
                    ],
                },
                [
                    SimpleNamespace(key="battleSkill", skillId="skill.battle"),
                    SimpleNamespace(key="ultimate", skillId="skill.ultimate"),
                ],
                {
                    "char": {
                        "potentialUnlockBundle": [
                            {"level": 5, "potentialEffectId": "effect.potential5"}
                        ]
                    }
                },
                {
                    "effect.potential5": {
                        "dataList": [
                            blackboard_entry,
                            attached_entry,
                        ]
                    }
                },
                buff_definitions={"buff.reset-counter": definition},
            )

        self.assertIn("kind: 'patchSkillBlackboard'", rendered[0])
        self.assertIn("blackboardKey: 'count'", rendered[0])
        self.assertIn("value: 2", rendered[0])
        self.assertIn("initializationSequence: sequence(", rendered[0])
        self.assertIn("buffId: 'buff.reset-counter'", rendered[0])
        self.assertIn("finishBuffsById", rendered[0])

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
