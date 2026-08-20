"""验证技能内联 Buff 提升为干员级附属对象。"""

import unittest

from operator_buff_linker import (
    link_operator_buff_definitions,
    render_operator_buff_definitions,
    render_shared_buff_definitions_module,
)


class OperatorBuffLinkerTests(unittest.TestCase):
    def test_deduplicates_definitions_independent_of_call_site_indentation(self) -> None:
        source = """sequence(
  step('applyBuff', {
    buffId: 'buff_chr_fixture_example',
    definition: {
      stackingType: 'refresh',
      priority: 0,
    },
    target: 'caster',
  }),
  sequence(
    step('applyBuff', {
      buffId: 'buff_chr_fixture_example',
      definition: {
        stackingType: 'refresh',
        priority: 0,
      },
      target: 'caster',
    }),
  ),
)"""

        transformed, definitions, shared = link_operator_buff_definitions([source])

        self.assertEqual(transformed[0].count("definition:"), 0)
        self.assertEqual(tuple(definitions), ("buff_chr_fixture_example",))
        self.assertEqual(tuple(shared), ())
        self.assertEqual(
            render_operator_buff_definitions(definitions),
            [
                "  buffDefinitions: {",
                "    'buff_chr_fixture_example': {",
                "      stackingType: 'refresh',",
                "      priority: 0,",
                "    },",
                "  },",
            ],
        )

    def test_promotes_nested_dependencies_and_leaves_parent_reference_by_id(self) -> None:
        source = """step('applyBuff', {
  buffId: 'buff.parent',
  definition: {
    stackingType: 'refresh',
    lifecycleSequences: {
      start: sequence(
        step('applyBuff', {
          buffId: 'buff.child',
          definition: {
            stackingType: 'unlimited',
          },
          target: 'caster',
        }),
      ),
    },
  },
  target: 'caster',
})"""

        transformed, definitions, shared = link_operator_buff_definitions([source])

        self.assertNotIn("definition:", transformed[0])
        self.assertEqual(tuple(definitions), ())
        self.assertEqual(tuple(shared), ("buff.child", "buff.parent"))
        self.assertNotIn("definition:", shared["buff.parent"])
        self.assertIn("buffId: 'buff.child'", shared["buff.parent"])
        module = render_shared_buff_definitions_module(shared)
        self.assertIn("generatedCommonBuffDefinitions", module)
        self.assertIn("'buff.parent'", module)
        self.assertNotIn("'buff.parent': {\n    definition:", module)

    def test_rejects_semantically_different_definitions_for_the_same_id(self) -> None:
        sources = [
            "step('applyBuff', {\n  buffId: 'buff.example',\n  definition: {\n    stackingType: 'refresh',\n  },\n  target: 'caster',\n})",
            "step('applyBuff', {\n  buffId: 'buff.example',\n  definition: {\n    stackingType: 'unlimited',\n  },\n  target: 'caster',\n})",
        ]

        with self.assertRaisesRegex(ValueError, "multiple operator-level definitions"):
            link_operator_buff_definitions(sources)


if __name__ == "__main__":
    unittest.main()
