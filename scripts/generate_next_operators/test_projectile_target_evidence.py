"""验证 ProjectileData 目标过滤事实不会退化为 ID 命名猜测。"""

import json
import tempfile
import unittest
from pathlib import Path

from projectile_target_evidence import (
    load_projectile_target_evidence,
    resolve_projectile_single_enemy_input_target,
)


class ProjectileTargetEvidenceTests(unittest.TestCase):
    def test_liino_soundwaves_resolve_to_distinct_collision_targets(self) -> None:
        self.assertEqual(
            resolve_projectile_single_enemy_input_target(
                "projectile_chr_0035_liino_ultskill_soundwave"
            ),
            "enemy",
        )
        self.assertEqual(
            resolve_projectile_single_enemy_input_target(
                "projectile_chr_0035_liino_ultskill_soundwave_heal"
            ),
            "caster",
        )
        self.assertIsNone(
            resolve_projectile_single_enemy_input_target("projectile_without_evidence")
        )

    def test_ambiguous_filter_remains_unresolved(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "evidence.json"
            path.write_text(
                json.dumps(
                    {
                        "version": "1.4.4",
                        "projectiles": [
                            {
                                "projectileId": "ambiguous",
                                "autoSetTargetFaction": False,
                                "factionTarget": 1,
                                "targetFactionType": 4,
                                "filterObjectType": True,
                                "objectTypeMask": 24,
                                "decodedSourceSha256": "0" * 64,
                                "evidence": "fixture",
                            }
                        ],
                    }
                ),
                encoding="utf-8",
            )
            load_projectile_target_evidence.cache_clear()
            self.assertIsNone(
                resolve_projectile_single_enemy_input_target("ambiguous", path)
            )
            load_projectile_target_evidence.cache_clear()


if __name__ == "__main__":
    unittest.main()
