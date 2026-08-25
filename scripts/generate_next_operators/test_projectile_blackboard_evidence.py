"""验证投射物实体黑板必须来自完整模板证据。"""

import json
import tempfile
import unittest
from pathlib import Path

from projectile_blackboard_evidence import (
    load_projectile_entity_blackboards,
    resolve_projectile_entity_blackboard,
)


class ProjectileBlackboardEvidenceTests(unittest.TestCase):
    def tearDown(self) -> None:
        load_projectile_entity_blackboards.cache_clear()

    def test_formal_projectiles_resolve_template_entity_values(self) -> None:
        self.assertEqual(
            resolve_projectile_entity_blackboard(
                "projectile_chr_0021_whiten_normal_skill"
            ),
            (("EntityBB_first_hit", 0.0),),
        )
        self.assertEqual(
            resolve_projectile_entity_blackboard("projectile_without_evidence"),
            (),
        )

    def test_rejects_non_dynamic_or_non_entity_keys(self) -> None:
        for key, is_dynamic in (("count", True), ("EntityBB_count", False)):
            with self.subTest(key=key, is_dynamic=is_dynamic):
                with tempfile.TemporaryDirectory() as directory:
                    path = Path(directory) / "evidence.json"
                    path.write_text(
                        json.dumps(
                            {
                                "version": "1.4.4",
                                "projectiles": [
                                    {
                                        "projectileId": "fixture",
                                        "entityBlackboard": [
                                            {
                                                "key": key,
                                                "value": 0,
                                                "isDynamic": is_dynamic,
                                            }
                                        ],
                                        "rawAssetSha256": "0" * 64,
                                        "evidence": "fixture",
                                    }
                                ],
                            }
                        ),
                        encoding="utf-8",
                    )
                    with self.assertRaises(ValueError):
                        load_projectile_entity_blackboards(path)


if __name__ == "__main__":
    unittest.main()
