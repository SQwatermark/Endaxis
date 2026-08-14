"""验证审计 Buff 定义进入正式内联 DSL 时的严格边界。"""

import unittest
from types import SimpleNamespace

from buff_definition_compiler import compile_inline_buff_definition
from generate_next_operators import compile_buff_application_values
from source_models import ScalarSource


def scalar(value: float, key: str | None = None) -> ScalarSource:
    return ScalarSource(value, key, None)


def definition(**overrides):
    values = {
        "buffId": "buff.example",
        "sourceAvailable": True,
        "lifecycle": SimpleNamespace(
            lifeType="Limited",
            duration=scalar(10),
            triggerInterval=scalar(-1),
            waitFirstTriggerInterval=False,
            maxTriggerCount=scalar(99),
            stackingIdentifierType="Id",
            stackingType="Refresh",
            stackingKey="",
            priority=scalar(1),
            negatePriority=False,
            maxStackCount=scalar(1),
            hasStackEffects=False,
        ),
        "blackboard": (),
        "applyTagIds": (),
        "extendTagIds": (),
        "attributeModifiers": (),
        "directDamageHits": (),
        "conditionalActions": (),
        "blackboardCalculations": (),
        "blackboardMutations": (),
        "buffBlackboardReads": (),
        "buffFinishes": (),
        "eventActions": (),
        "resourceGains": (),
        "combatActions": (),
        "auraActions": (),
        "unparsedPayloads": (),
    }
    values.update(overrides)
    return SimpleNamespace(**values)


class BuffDefinitionCompilerTests(unittest.TestCase):
    def test_compiles_a_complete_simple_definition_without_id(self) -> None:
        result = compile_inline_buff_definition(definition(), "fixture")

        self.assertIn("stackingType: 'refresh'", result)
        self.assertIn("durationSeconds: 10", result)
        self.assertNotIn("buff.example", result)

    def test_rejects_lifecycle_behavior_that_would_be_lost(self) -> None:
        source = definition(eventActions=(SimpleNamespace(event="OnBuffStart"),))

        with self.assertRaisesRegex(ValueError, "eventActions"):
            compile_inline_buff_definition(source, "fixture")

    def test_apply_step_inlines_the_resolved_definition(self) -> None:
        source = definition()
        result = compile_buff_application_values(
            buff_id=source.buffId,
            blackboard_assignments={},
            target_source="Owner",
            target_group_key="",
            count=scalar(1),
            buff_source="ActionOwner",
            inherit_source_skill_cast_info=True,
            root_skill_context=True,
            path="fixture",
            buff_definitions={source.buffId: source},
        )

        self.assertIn("buffId: 'buff.example'", result)
        self.assertIn("definition: {", result)
        self.assertIn("stackingType: 'refresh'", result)


if __name__ == "__main__":
    unittest.main()
