from __future__ import annotations

import unittest
import json
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace

from generation_pipeline import (
    filter_presentation_only_passive_buffs,
    mark_explicit_unmodeled_passive_skills,
    retain_reachable_buff_definitions,
    validate_routed_skills,
)
from passive_skill_parser import PassiveBuffApplicationSource, PassiveSkillSource


class GenerationPipelineTests(unittest.TestCase):
    def test_validates_strict_switch_to_buff_skill_routing(self) -> None:
        owner = {"targetSource": "Owner"}
        main_target = {"targetSource": "MainTarget"}
        switch = {
            "condition": {
                "actionData": [{
                    "$type": "Beyond.CheckBuffStackNumAdvanced+Data",
                    "buffSettings": {"checkType": "Id", "buffIdList": ["buff.form"]},
                    "compareType": "GE",
                    "value": {"useBlackboardKey": False, "value": 1.0},
                }]
            },
            "buffs": [{"buffId": "buff.route"}],
            "buffSource": owner,
            "targets": owner,
            "asSkillCast": False,
        }
        routed_buff = {
            "buffEventAction": [{
                "buffEvent": "OnBuffEnable",
                "actions": [{
                    "actionData": [{
                        "$type": "Beyond.CastSkill+Data",
                        "caster": owner,
                        "target": main_target,
                        "skillId": {"useBlackboardKey": False, "value": "skill.combo"},
                        "skipApplyCost": False,
                        "inheritSourceSkillCastId": False,
                    }]
                }],
            }]
        }
        empty_fields = {
            field: ()
            for field in (
                "directDamageHits", "conditionalActions", "inflictions", "auxiliaryActions",
                "resourceGains", "projectileLaunches", "projectileTriggeredSkills",
                "abilityEntityHits", "eventListeners", "timeDilations", "skillReplacements",
                "blackboardCalculations", "blackboardMutations", "buffBlackboardReads",
                "buffFinishes", "buffHolds", "targetGroupControlFlowActions", "auraActions",
                "physicalInflictions", "keywordActions", "intervalDamageHits",
                "timelineJumps", "timelineJumpControlFlowActions", "timelineFinishes",
            )
        }
        operator = {
            "slug": "fixture",
            "routedSkillKeys": ["routed"],
            "skillGroups": [
                {
                    "key": "battleSkill",
                    "skillKeys": ["routed"],
                    "levelSource": "battleSkill",
                },
                {
                    "key": "comboSkill",
                    "skillKeys": ["combo"],
                    "levelSource": "comboSkill",
                },
            ],
            "skills": [{
                "key": "routed",
                "compile": {
                    "kind": "routedSkill",
                    "targetSkillKey": "combo",
                    "executionSkillType": "comboSkill",
                    "executionLevelSource": "comboSkill",
                    "activationBuffId": "buff.form",
                    "routingBuffId": "buff.route",
                },
            }],
        }
        skills = [
            SimpleNamespace(
                key="routed", skillId="skill.router", skillType="battleSkill",
                sourceFile="skill.router.json", **empty_fields,
            ),
            SimpleNamespace(
                key="combo", skillId="skill.combo", skillType="comboSkill",
                sourceFile="skill.combo.json", **empty_fields,
            ),
        ]

        with TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / "skill-data-cdn"
            buffs = root / "BuffData"
            source.mkdir()
            buffs.mkdir()
            (source / "skill.router.json").write_text(
                json.dumps({"switchToBuffConfig": switch}), encoding="utf-8"
            )
            (buffs / "buff.route.json").write_text(
                json.dumps(routed_buff), encoding="utf-8"
            )

            validate_routed_skills(operator, skills, source)

            routed_buff["buffEventAction"][0]["actions"][0]["actionData"][0][
                "skipApplyCost"
            ] = True
            (buffs / "buff.route.json").write_text(
                json.dumps(routed_buff), encoding="utf-8"
            )
            with self.assertRaisesRegex(ValueError, "unsupported routed CastSkill flags"):
                validate_routed_skills(operator, skills, source)

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
