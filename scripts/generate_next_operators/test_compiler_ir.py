"""验证编译控制流 IR 的叶到根规范化与渲染边界。"""

import unittest

from compiler_ir import (
    CompiledBranch,
    atom,
    branch,
    normalize,
    render,
    semantic_signature,
    sequence,
)


class CompilerIrTests(unittest.TestCase):
    def test_sequence_normalization_recursively_flattens_and_preserves_order(self) -> None:
        source = sequence(
            atom("step('first', {})"),
            sequence(
                sequence(atom("step('second', {})")),
                atom("step('third', {})"),
            ),
        )

        rendered = render(source)

        self.assertNotIn("sequence(\n  sequence(", rendered)
        self.assertLess(rendered.index("'first'"), rendered.index("'second'"))
        self.assertLess(rendered.index("'second'"), rendered.index("'third'"))

    def test_branch_folding_runs_after_children_are_normalized(self) -> None:
        succeed = sequence(
            sequence(
                atom(
                    "step('dealDamage', {}, 'succeed-key')",
                    semantic_source="step('dealDamage', {})",
                )
            )
        )
        fail = sequence(
            atom(
                "step('dealDamage', {}, 'fail-key')",
                semantic_source="step('dealDamage', {})",
            )
        )

        folded = branch("{ kind: 'condition' }", succeed, fail)

        self.assertNotIsInstance(folded, CompiledBranch)
        self.assertIn("succeed-key", render(folded))
        self.assertNotIn("fail-key", render(folded))

    def test_distinct_branch_execution_is_not_folded(self) -> None:
        compiled = branch(
            "{ kind: 'condition' }",
            sequence(atom("step('first', {})")),
            sequence(atom("step('second', {})")),
        )

        self.assertIsInstance(compiled, CompiledBranch)
        self.assertIn("branch(", render(compiled))

    def test_always_next_branch_keeps_control_flow_and_renders_options(self) -> None:
        succeed = sequence(atom("step('same', {})"))
        fail = sequence(atom("step('same', {})"))

        compiled = branch(
            "{ kind: 'condition' }",
            succeed,
            fail,
            always_next=True,
        )

        self.assertIsInstance(compiled, CompiledBranch)
        self.assertIn("{ alwaysNext: true }", render(compiled))

    def test_normalization_is_idempotent(self) -> None:
        source = sequence(sequence(atom("step('only', {})")))

        once = normalize(source)
        twice = normalize(once)

        self.assertEqual(once, twice)
        self.assertEqual(semantic_signature(once), semantic_signature(twice))


if __name__ == "__main__":
    unittest.main()
