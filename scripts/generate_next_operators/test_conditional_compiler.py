import unittest

from compiler_ir import render
from conditional_compiler import (
    ConditionalCompileContext,
    ConditionalCompiler,
    ConditionalCompilerServices,
)
from source_models import (
    ConditionalActionSource,
    ConditionalBranchActionSource,
    ForEachContextActionSource,
    UnconditionalActionSource,
)


def leaf(name: str, index: int = 0) -> ConditionalBranchActionSource:
    return ConditionalBranchActionSource(actionType=name, actionIndex=index)


def action(
    succeed: tuple[ConditionalBranchActionSource, ...],
    fail: tuple[ConditionalBranchActionSource, ...] = (),
    *,
    always_next: bool = False,
) -> ConditionalActionSource:
    return ConditionalActionSource(
        startFrame=0,
        endFrame=0,
        actionIndex=0,
        actionPath=(),
        conditions=(),
        succeedActions=succeed,
        failActions=fail,
        alwaysNext=always_next,
    )


class ConditionalCompilerTest(unittest.TestCase):
    def make_compiler(
        self,
        *,
        semantic_source=lambda source: source,
        compiled_conditions: list[str] | None = None,
        validated_contexts: list[str] | None = None,
    ) -> ConditionalCompiler:
        def compile_condition(
            _action: ConditionalActionSource,
            path: str,
            _context: ConditionalCompileContext,
        ) -> str:
            if compiled_conditions is not None:
                compiled_conditions.append(path)
            return "condition()"

        def validate_for_each(
            current: ForEachContextActionSource,
            _path: str,
            _context: ConditionalCompileContext,
        ) -> None:
            if validated_contexts is not None:
                validated_contexts.append(current.contextKey)

        return ConditionalCompiler(
            ConditionalCompilerServices(
                compile_leaf=lambda current, _path, _context: (
                    f"{current.actionType}()"
                ),
                compile_condition=compile_condition,
                is_guaranteed_success=lambda _action, _context: False,
                is_presentation_only=lambda _action, _context: False,
                validate_for_each=validate_for_each,
                logical_spawn_can_compile=lambda _payload: False,
                leaf_semantic_source=semantic_source,
            )
        )

    def test_equal_filtered_branches_fold_before_condition_compilation(self) -> None:
        compiled_conditions: list[str] = []
        compiler = self.make_compiler(
            semantic_source=lambda _source: "same-effect",
            compiled_conditions=compiled_conditions,
        )

        compiled = compiler.compile_action(
            action((leaf("success"),), (leaf("failure"),)),
            "root",
            ConditionalCompileContext(),
        )

        self.assertEqual(render(compiled), "sequence(\n  success(),\n)")
        self.assertEqual(compiled_conditions, [])

    def test_distinct_branches_keep_condition(self) -> None:
        compiled_conditions: list[str] = []
        compiler = self.make_compiler(compiled_conditions=compiled_conditions)

        compiled = compiler.compile_action(
            action((leaf("success"),), (leaf("failure"),)),
            "root",
            ConditionalCompileContext(),
        )

        self.assertEqual(
            render(compiled),
            "branch(\n"
            "  condition(),\n"
            "  sequence(\n"
            "    success(),\n"
            "  ),\n"
            "  sequence(\n"
            "    failure(),\n"
            "  ),\n"
            ")",
        )
        self.assertEqual(compiled_conditions, ["root"])

    def test_always_next_is_preserved_even_for_equal_branches(self) -> None:
        compiler = self.make_compiler(semantic_source=lambda _source: "same-effect")

        compiled = compiler.compile_action(
            action((leaf("success"),), (leaf("failure"),), always_next=True),
            "root",
            ConditionalCompileContext(),
        )

        self.assertIn("branch(", render(compiled))
        self.assertIn("{ alwaysNext: true }", render(compiled))

    def test_control_wrappers_do_not_create_nested_sequences(self) -> None:
        validated_contexts: list[str] = []
        compiler = self.make_compiler(validated_contexts=validated_contexts)
        unconditional = UnconditionalActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=0,
            actionPath=(),
            conditions=(),
            succeedActions=(leaf("first"), leaf("second", 1)),
            failActions=(),
        )
        for_each = ForEachContextActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=0,
            actionPath=(),
            conditions=(),
            succeedActions=(
                ConditionalBranchActionSource(
                    actionType="nested",
                    actionIndex=0,
                    nestedCondition=unconditional,
                ),
            ),
            failActions=(),
            contextKey="targets",
        )

        compiled = compiler.compile_action(
            for_each,
            "root",
            ConditionalCompileContext(),
        )

        self.assertEqual(
            render(compiled),
            "forEachContextTarget(\n"
            "  'targets',\n"
            "  sequence(\n"
            "    first(),\n"
            "    second(),\n"
            "  ),\n"
            ")",
        )
        self.assertEqual(validated_contexts, ["targets"])


if __name__ == "__main__":
    unittest.main()
