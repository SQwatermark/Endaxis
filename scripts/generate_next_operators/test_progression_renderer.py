"""验证养成转换器会严格暴露未知潜能载荷，并在宽松审计中保留结构化缺口。"""

from __future__ import annotations

from types import SimpleNamespace
import unittest

from audit_operator_progression import audit_effect
from progression_renderer import parse_build_attribute_progression, render_potentials


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
        result = parse_build_attribute_progression(
            [
                effect_entry(attr_type=39, value=15),
                effect_entry(attr_type=41, value=15),
            ],
            "effect.dataList",
        )

        self.assertEqual(result.modifiers, (("strength", 15), ("intellect", 15)))
        self.assertEqual(result.issues, ())
        self.assertEqual(result.missing_capabilities, ())

    def test_strict_mode_rejects_unknown_attribute_data(self) -> None:
        with self.assertRaisesRegex(ValueError, "unsupported build attribute 50"):
            parse_build_attribute_progression(
                [effect_entry(attr_type=50, value=0.08)],
                "effect.dataList",
            )
        with self.assertRaisesRegex(ValueError, "unknown fields"):
            parse_build_attribute_progression(
                [effect_entry(attr_type=39, value=10, unexpected=True)],
                "effect.dataList",
            )
        with self.assertRaisesRegex(ValueError, "expected modifyType=4"):
            parse_build_attribute_progression(
                [effect_entry(attr_type=39, value=10, modifyType=8)],
                "effect.dataList",
            )
        with self.assertRaisesRegex(ValueError, "expected integer build attribute value"):
            parse_build_attribute_progression(
                [effect_entry(attr_type=39, value=10.5)],
                "effect.dataList",
            )

    def test_lenient_mode_keeps_supported_part_and_marks_missing_capability(self) -> None:
        result = parse_build_attribute_progression(
            [
                effect_entry(attr_type=42, value=20),
                effect_entry(attr_type=32, value=0.15),
            ],
            "effect.dataList",
            mode="lenient",
        )

        self.assertEqual(result.modifiers, (("will", 20),))
        self.assertEqual(result.missing_capabilities, ("potentialEffects",))
        self.assertEqual([issue.code for issue in result.issues], ["unsupported-attribute-type"])

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
                ]
            }
        }
        rendered = render_potentials(
            {
                "slug": "operator",
                "charId": "char",
                "potentials": [{"key": "attributes", "compile": "buildAttributes"}],
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

        conversion = effect["buildAttributeConversion"]
        self.assertEqual(conversion["status"], "partial")
        self.assertEqual(conversion["modifiers"], [{"attribute": "will", "value": 20}])
        self.assertEqual(conversion["missingCapabilities"], ["potentialEffects"])


if __name__ == "__main__":
    unittest.main()
