import unittest

from skill_setting_catalog import (
    has_recovered_skill_setting_data,
    resolve_linear_skill_setting_read,
)


class SkillSettingCatalogTests(unittest.TestCase):
    def test_resolves_recovered_mifu_special_smash_multiplier(self) -> None:
        self.assertTrue(has_recovered_skill_setting_data("弭弗特殊猛击"))
        self.assertEqual(
            resolve_linear_skill_setting_read("弭弗特殊猛击", 1, "fixture"),
            (1.0, 0.01),
        )

    def test_unknown_entry_fails_closed(self) -> None:
        self.assertFalse(has_recovered_skill_setting_data("未恢复"))
        with self.assertRaisesRegex(ValueError, "is not recovered"):
            resolve_linear_skill_setting_read("未恢复", 1, "fixture")


if __name__ == "__main__":
    unittest.main()
