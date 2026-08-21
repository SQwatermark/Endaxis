from __future__ import annotations

import unittest
from types import SimpleNamespace

from generation_pipeline import retain_reachable_buff_definitions


class GenerationPipelineTests(unittest.TestCase):
    def test_passive_buff_retention_follows_recursive_event_dependencies(self) -> None:
        leaf = SimpleNamespace(
            buffId="buff.leaf", eventActions=(), igniteEventActions=()
        )
        child = SimpleNamespace(
            buffId="buff.child",
            eventActions=(SimpleNamespace(createdBuffIds=("buff.leaf",)),),
            igniteEventActions=(),
        )
        root = SimpleNamespace(
            buffId="buff.root",
            eventActions=(SimpleNamespace(createdBuffIds=("buff.child",)),),
            igniteEventActions=(),
        )
        unrelated = SimpleNamespace(
            buffId="buff.unrelated", eventActions=(), igniteEventActions=()
        )

        retained = retain_reachable_buff_definitions(
            {"buff.root"}, (unrelated, child, root, leaf)
        )

        self.assertEqual(
            tuple(definition.buffId for definition in retained),
            ("buff.child", "buff.leaf", "buff.root"),
        )

    def test_passive_buff_retention_handles_dependency_cycles(self) -> None:
        first = SimpleNamespace(
            buffId="buff.first",
            eventActions=(SimpleNamespace(createdBuffIds=("buff.second",)),),
            igniteEventActions=(),
        )
        second = SimpleNamespace(
            buffId="buff.second",
            eventActions=(SimpleNamespace(createdBuffIds=("buff.first",)),),
            igniteEventActions=(),
        )

        retained = retain_reachable_buff_definitions(
            {"buff.first"}, (first, second)
        )

        self.assertEqual(
            tuple(definition.buffId for definition in retained),
            ("buff.first", "buff.second"),
        )


if __name__ == "__main__":
    unittest.main()
