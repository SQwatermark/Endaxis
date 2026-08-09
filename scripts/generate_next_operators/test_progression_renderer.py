"""验证养成转换器会严格暴露未知潜能载荷，并在宽松审计中保留结构化缺口。"""

from __future__ import annotations

from types import SimpleNamespace
import unittest

from audit_operator_progression import audit_effect
from progression_renderer import parse_static_attribute_progression, render_potentials


def effect_entry(*, attr_type: int, value: float, **extra: object) -> dict[str, object]:
    return {
        "activeCondition": [],
        "attachBuff": {"blackboard": [], "buffId": ""},
        "attachSkill": {"blackboard": [], "skillId": "", "skillPath": ""},
        "attrModifier": {
            "attrType": attr_type,
            "attrValue": value,
            "modifierType": 5,
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


class ProgressionRendererTests(unittest.TestCase):
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
        self.assertEqual(result.panel_stat_modifiers, ())
        self.assertEqual(result.issues, ())
        self.assertEqual(result.missing_capabilities, ())

    def test_strict_mode_rejects_unknown_attribute_data(self) -> None:
        with self.assertRaisesRegex(ValueError, "PhysicalDamageIncrease.*no exact Next"):
            parse_static_attribute_progression(
                [effect_entry(attr_type=50, value=0.08)],
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

    def test_lenient_mode_keeps_supported_part_and_marks_missing_capability(self) -> None:
        result = parse_static_attribute_progression(
            [
                effect_entry(attr_type=42, value=20),
                effect_entry(attr_type=32, value=0.15),
            ],
            "effect.dataList",
            mode="lenient",
        )

        self.assertEqual(result.build_attribute_modifiers, (("will", 20),))
        self.assertEqual(result.panel_stat_modifiers, ())
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
        self.assertEqual(result.panel_stat_modifiers, ())
        self.assertEqual(result.missing_capabilities, ("potentialEffects",))
        self.assertEqual([issue.code for issue in result.issues], ["unknown-attribute-type"])

    def test_converts_source_confirmed_arts_intensity(self) -> None:
        result = parse_static_attribute_progression(
            [effect_entry(attr_type=87, value=16)],
            "effect.dataList",
        )

        self.assertEqual(result.build_attribute_modifiers, ())
        self.assertEqual(result.panel_stat_modifiers, (("artsIntensity", 16),))
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
                    effect_entry(attr_type=87, value=16),
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
        self.assertIn("kind: 'addPanelStat', stat: 'artsIntensity', value: 16", rendered[0])

    def test_audit_marks_mixed_attribute_effect_as_partial(self) -> None:
        effect = audit_effect(
            "effect.mixed",
            {
                "effect.mixed": {
                    "dataList": [
                        effect_entry(attr_type=42, value=20),
                        effect_entry(attr_type=32, value=0.15),
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
                "attrType": 32,
                "nativeName": "NormalSkillDamageIncrease",
                "semantic": "combat.battleSkillDamageIncrease",
                "modifierType": 5,
                "modifierName": "BaseAddition",
                "modifyAttributeType": 0,
                "value": 0.15,
                "nextTarget": None,
            },
        )
        self.assertEqual(conversion["missingCapabilities"], ["potentialEffects"])


if __name__ == "__main__":
    unittest.main()
