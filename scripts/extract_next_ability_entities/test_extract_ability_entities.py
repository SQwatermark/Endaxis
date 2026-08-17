import importlib.util
import struct
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("extract_ability_entities.py")
SPEC = importlib.util.spec_from_file_location("extract_ability_entities", MODULE_PATH)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def string(value: str, offset: int) -> bytes:
    encoded = value.encode()
    raw = struct.pack("<i", len(encoded)) + encoded
    return raw + bytes(MODULE.align4(offset + len(raw)) - offset - len(raw))


def fixture() -> bytes:
    data = bytearray(bytes(12) + b"\x01" + bytes(3) + bytes(12))
    data += string("fixture", len(data))
    root_rid = 0x123456789
    data += struct.pack("<qii", root_rid, 2, 3)
    data += struct.pack("<q", 8) + string("", len(data) + 8) * 3
    data += struct.pack("<q", root_rid)
    for value in MODULE.ROOT_TYPE:
        data += string(value, len(data))
    data += string("abilityentity_fixture", len(data))
    data += string("abilityentity_fixture", len(data))
    data += struct.pack("<ii", 2, 2)
    data += struct.pack("<ii", 10, -20)
    data += struct.pack("<ffB", 0.25, 0.5, 1)
    data += bytes(MODULE.align4(len(data)) - len(data))
    data += b"\x00"
    data += bytes(MODULE.align4(len(data)) - len(data))
    data += struct.pack("<fiqq", 1.0, 2, 11, 12)
    data += struct.pack("<i", 3)
    data += b"\x01" + bytes(3) + struct.pack("<i", 7)
    data += string("stack", len(data))
    data += struct.pack("<if", 0, 12.5)
    data += b"\x00" + bytes(3) + struct.pack("<f", 9.5)
    data += string("", len(data))
    data += struct.pack("<f", 30.0)
    return bytes(data)


class AbilityEntityTemplateParserTests(unittest.TestCase):
    def test_parses_proven_prefix_when_root_is_not_first_record(self):
        value = MODULE.parse_ability_entity_template(
            fixture(), "abilityentity_fixture"
        )
        self.assertEqual(value["bornTagIds"], [10, -20])
        self.assertEqual(value["lifeTypeNativeValue"], 0)
        self.assertEqual(value["durationSeconds"], 12.5)
        self.assertEqual(value["maxStackingCount"], 3)
        self.assertEqual(
            value["maxStackingCountBlackboard"],
            {"useBlackboardKey": True, "value": 7, "blackboardKey": "stack"},
        )
        self.assertEqual(value["componentCount"], 2)

    def test_rejects_identity_mismatch(self):
        with self.assertRaisesRegex(ValueError, "template identity mismatch"):
            MODULE.parse_ability_entity_template(fixture(), "other")


if __name__ == "__main__":
    unittest.main()
