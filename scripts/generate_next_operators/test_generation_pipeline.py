from __future__ import annotations

import unittest
from types import SimpleNamespace

from generation_pipeline import (
    filter_presentation_only_passive_buffs,
    mark_explicit_unmodeled_passive_skills,
    retain_reachable_buff_definitions,
)
from passive_skill_parser import PassiveBuffApplicationSource, PassiveSkillSource


class GenerationPipelineTests(unittest.TestCase):
    def test_filters_only_explicit_passive_startup_buffs(self) -> None:
        passive = PassiveSkillSource(
            skill_id="passive",
            source_file="passive.json",
            passive_type="AddBuff",
            declared_blackboard_keys=(),
            buffs=(
                PassiveBuffApplicationSource("buff.gameplay", ()),
                PassiveBuffApplicationSource("buff.presentation", ()),
            ),
            unsupported_reasons=(),
        )

        filtered = filter_presentation_only_passive_buffs(
            {
                "slug": "fixture",
                "presentationOnlyPassiveBuffIds": ["buff.presentation"],
            },
            {"passive": passive},
        )

        self.assertEqual(
            tuple(buff.buff_id for buff in filtered["passive"].buffs),
            ("buff.gameplay",),
        )

    def test_rejects_unknown_presentation_passive_buff(self) -> None:
        with self.assertRaisesRegex(ValueError, "not passive startup Buffs"):
            filter_presentation_only_passive_buffs(
                {
                    "slug": "fixture",
                    "presentationOnlyPassiveBuffIds": ["buff.unknown"],
                },
                {
                    "passive": PassiveSkillSource(
                        skill_id="passive",
                        source_file="passive.json",
                        passive_type="AddBuff",
                        declared_blackboard_keys=(),
                        buffs=(),
                        unsupported_reasons=(),
                    )
                },
            )

    def test_marks_explicit_unmodeled_passive_without_losing_existing_issues(self) -> None:
        issues = mark_explicit_unmodeled_passive_skills(
            {
                "slug": "fixture",
                "unmodeledPassiveSkillIds": ["passive.two"],
            },
            {"passive.one": object(), "passive.two": object()},
            {"passive.two": ("existing issue",)},
        )

        self.assertEqual(
            issues["passive.two"],
            (
                "existing issue",
                "manifest explicitly keeps this passive skill unmodeled",
            ),
        )

    def test_rejects_unknown_explicit_unmodeled_passive(self) -> None:
        with self.assertRaisesRegex(ValueError, "unknown passive skill ids"):
            mark_explicit_unmodeled_passive_skills(
                {
                    "slug": "fixture",
                    "unmodeledPassiveSkillIds": ["passive.unknown"],
                },
                {"passive.known": object()},
                {},
            )

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
