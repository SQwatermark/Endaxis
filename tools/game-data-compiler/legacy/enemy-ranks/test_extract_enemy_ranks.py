import struct
import unittest

from extract_enemy_ranks import parse_enemy_rank


def unity_string(value: str) -> bytes:
    encoded = value.encode("utf-8")
    payload = struct.pack("<i", len(encoded)) + encoded
    return payload + b"\0" * ((-len(payload)) % 4)


def enemy_payload(game_id: str, rank: int) -> bytes:
    root_rid = 0x123400000001
    component_rid = 0x123400000099
    payload = bytearray(12)
    payload.extend(b"\x01\0\0\0")
    payload.extend(bytes(12))
    payload.extend(unity_string("fixture"))
    payload.extend(struct.pack("<qiiq", root_rid, 2, 2, root_rid))
    payload.extend(unity_string("EnemyTemplateData"))
    payload.extend(unity_string("Beyond.Gameplay"))
    payload.extend(unity_string("Gameplay.Beyond"))
    payload.extend(struct.pack("<iq", 1, component_rid))
    payload.extend(unity_string(f"{game_id}_postmodel"))
    payload.extend(struct.pack("<i", rank))
    return bytes(payload)


class ParseEnemyRankTests(unittest.TestCase):
    def test_reads_rank_after_validated_enemy_template_prefix(self) -> None:
        self.assertEqual(
            parse_enemy_rank(enemy_payload("eny_fixture", 2), "eny_fixture"),
            (2, "eny_fixture_postmodel", 1),
        )

    def test_rejects_unknown_native_rank(self) -> None:
        with self.assertRaisesRegex(ValueError, "unknown EnemyRank value 3"):
            parse_enemy_rank(enemy_payload("eny_fixture", 3), "eny_fixture")


if __name__ == "__main__":
    unittest.main()
