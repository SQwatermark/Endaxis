"""验证干员生成器最关键的派生规则和严格校验。"""

import unittest
import json
import tempfile
from pathlib import Path
from types import SimpleNamespace

from generate_next_operators import (
    collect_blackboard_keys,
    collect_conditional_blackboard_keys,
    collect_resolved_damage_hits,
    build_blackboard_provenance,
    compile_skill_entries,
    compile_resolved_damage_sequence,
    compile_combat_condition_group,
    compile_conditional_action,
    BlackboardCalculationPayload,
    BuffBlackboardReadSource,
    BuffFinishSource,
    DamageUnitSource,
    ScalarSource,
    classify_buff,
    derive_timeline_block,
    parse_scalar,
    parse_direct_damage_hits,
    parse_damage_units,
    parse_inflictions,
    parse_panel_attributes,
    parse_declared_blackboard,
    parse_auxiliary_actions,
    parse_blackboard_calculations,
    parse_blackboard_runtime_actions,
    parse_conditional_actions,
    parse_projectile_launches,
    parse_resource_gains,
    resolve_projectile_hits,
    resolve_ability_entity_hits,
    resolve_buff_behaviors,
    parse_skill_patch,
    compile_buff_blackboard_read,
    compile_buff_finish,
    percentage_values,
    ts_inline_literal,
    typescript_identifier,
    validate_skill_groups,
    walk_actions,
    walk_unconditional_actions,
)


class GenerateNextOperatorsTests(unittest.TestCase):
    def test_unconditional_action_walk_does_not_enter_condition_branches(self) -> None:
        sequence = {
            "actionData": [
                {"$type": "Example.DamageAction+Data, Example", "serverActionIndex": 0},
                {
                    "$type": "Example.IfElseAction+Data, Example",
                    "serverActionIndex": 1,
                    "conditionAction": {"actionData": []},
                    "succeedActions": {
                        "actionData": [
                            {
                                "$type": "Example.SpawnAbilityEntity+Data, Example",
                                "serverActionIndex": 2,
                            }
                        ]
                    },
                    "failActions": {"actionData": []},
                },
            ]
        }

        action_types = [
            action["$type"].split(".")[-1].split("+")[0]
            for action in walk_unconditional_actions(sequence)
        ]

        self.assertEqual(action_types, ["DamageAction", "IfElseAction"])

    def test_declared_blackboard_preserves_default_value_and_dynamic_flag(self) -> None:
        root = {
            "blackboard": [
                {
                    "key": "sword_dist",
                    "valueDouble": 0,
                    "valueStr": "",
                    "isDynamic": True,
                }
            ]
        }

        values = parse_declared_blackboard(root, "skill.json")

        self.assertEqual(values[0].key, "sword_dist")
        self.assertEqual(values[0].value, 0)
        self.assertTrue(values[0].isDynamic)

    def test_condition_blackboard_collection_excludes_unrelated_declared_values(self) -> None:
        action = SimpleNamespace(
            conditions=(
                SimpleNamespace(
                    left=ScalarSource(0, "sword_dist", None),
                    right=ScalarSource(10, None, None),
                    buffStack=None,
                ),
            ),
            succeedActions=(
                SimpleNamespace(
                    nestedCondition=None,
                    blackboardMutation=SimpleNamespace(
                        key="sword_dist",
                        value=ScalarSource(3, None, None),
                    ),
                    buffBlackboardRead=None,
                ),
            ),
            failActions=(),
        )

        keys = collect_conditional_blackboard_keys((action,))

        self.assertEqual(keys, {"sword_dist"})

    def test_compile_buff_blackboard_read_emits_strict_runtime_step(self) -> None:
        read = BuffBlackboardReadSource(
            startFrame=11,
            endFrame=12,
            actionIndex=0,
            outputKey="conductCnt",
            desiredKey="count",
            targetSource="Context",
            targetGroupKey="smart_target",
            buffCheckType="Tag",
            buffIds=(),
            tagQueryType="hasAny",
            buffTagIds=(1466867135,),
        )

        self.assertEqual(
            compile_buff_blackboard_read(read, "fixture.read"),
            "\n".join(
                [
                    "step('readBuffBlackboard', {",
                    "  target: 'enemy',",
                    "  tagQueryType: 'hasAny',",
                    "  buffTagIds: [1466867135],",
                    "  desiredKey: 'count',",
                    "  outputKey: 'conductCnt',",
                    "})",
                ]
            ),
        )

    def test_blackboard_provenance_distinguishes_external_runtime_input(self) -> None:
        root = {
            "blackboard": [
                {
                    "key": "conductCnt",
                    "valueDouble": 0,
                    "valueStr": "",
                    "isDynamic": True,
                }
            ],
            "actionGroupData": {
                "value": {
                    "useBlackboardKey": True,
                    "value": 0,
                    "blackboardKey": "EntityBB_SwordNum",
                }
            },
        }
        patch = SimpleNamespace(blackboard={"atk": (1, 2)})
        calculations = (
            SimpleNamespace(key="interval"),
        )
        mutations = (SimpleNamespace(key="swordCount"),)
        reads = (SimpleNamespace(outputKey="conductCnt"),)

        provenance = build_blackboard_provenance(
            root, "skill.json", patch, calculations, mutations, reads
        )
        by_key = {item.key: item for item in provenance}

        self.assertTrue(by_key["EntityBB_SwordNum"].externalRuntimeInput)
        self.assertTrue(by_key["conductCnt"].declaredInSkill)
        self.assertTrue(by_key["conductCnt"].readFromBuff)
        self.assertTrue(by_key["atk"].suppliedByPatch)
        self.assertFalse(by_key["interval"].externalRuntimeInput)

    def test_blackboard_runtime_actions_preserve_mutation_and_buff_read(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 11,
                        "_endFrame": 12,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.GetTargetBuffBBAdvanced+Data, Example",
                                    "serverActionIndex": 0,
                                    "blackboardKey": "conductCnt",
                                    "desiredKey": "count",
                                    "targetSettings": {
                                        "targetSource": "Context",
                                        "targetGroupKey": "smart_target",
                                    },
                                    "buffSettings": {
                                        "checkType": "Tag",
                                        "buffIdList": [],
                                        "tagQuery": {
                                            "queryType": "HasAny",
                                            "tags": [{"tagId": 1466867135}],
                                        },
                                    },
                                },
                                {
                                    "$type": "Example.ModifyDynamicBlackboard+Data, Example",
                                    "serverActionIndex": 1,
                                    "key": "conductCnt",
                                    "operation": "Add",
                                    "directValue": True,
                                    "value": {
                                        "useBlackboardKey": False,
                                        "value": 1,
                                        "blackboardKey": "",
                                    },
                                },
                                {
                                    "$type": "Example.FinishBuffAdvanced+Data, Example",
                                    "serverActionIndex": 2,
                                    "buffOwner": {
                                        "targetSource": "Context",
                                        "targetGroupKey": "smart_target",
                                    },
                                    "buffSettings": {
                                        "checkType": "Tag",
                                        "buffIdList": [],
                                        "tagQuery": {
                                            "queryType": "HasAny",
                                            "tags": [{"tagId": 1466867135}],
                                        },
                                    },
                                    "finishAll": True,
                                    "limitSource": False,
                                    "isFinishedEarly": True,
                                    "isAbsorbed": False,
                                },
                            ]
                        },
                    }
                ]
            }
        }

        mutations, reads, finishes = parse_blackboard_runtime_actions(root, "skill.json", {})

        self.assertEqual(len(mutations), 1)
        self.assertEqual(mutations[0].key, "conductCnt")
        self.assertEqual(mutations[0].operation, "Add")
        self.assertEqual(mutations[0].value.value, 1)
        self.assertEqual(len(reads), 1)
        self.assertEqual(reads[0].outputKey, "conductCnt")
        self.assertEqual(reads[0].desiredKey, "count")
        self.assertEqual(reads[0].targetGroupKey, "smart_target")
        self.assertEqual(reads[0].tagQueryType, "hasAny")
        self.assertEqual(reads[0].buffTagIds, (1466867135,))
        self.assertEqual(len(finishes), 1)
        self.assertEqual(finishes[0].actionIndex, 2)
        self.assertEqual(finishes[0].buffTagIds, (1466867135,))
        self.assertTrue(finishes[0].finishAll)
        self.assertTrue(finishes[0].isFinishedEarly)

    def test_finish_buff_advanced_emits_strict_tag_finish_step(self) -> None:
        finish = BuffFinishSource(
            startFrame=11,
            endFrame=12,
            actionIndex=1,
            targetSource="Context",
            targetGroupKey="smart_target",
            buffCheckType="Tag",
            buffIds=(),
            tagQueryType="hasAny",
            buffTagIds=(1466867135,),
            finishAll=True,
            limitSource=False,
            isFinishedEarly=True,
            isAbsorbed=False,
        )

        self.assertEqual(
            compile_buff_finish(finish, "fixture.finish"),
            "\n".join(
                [
                    "step('finishBuffsByTag', {",
                    "  target: 'enemy',",
                    "  tagQueryType: 'hasAny',",
                    "  buffTagIds: [1466867135],",
                    "  reason: 'early',",
                    "})",
                ]
            ),
        )

    def test_blackboard_calculation_keeps_dynamic_operands(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 6,
                        "_endFrame": 9,
                        "_sequenceActionData": {
                            "$type": "Example.SimpleCalcBBAction+Data, Example",
                            "serverActionIndex": 4,
                            "key": "atk_scale_final",
                            "operation": "Multiply",
                            "value1": {
                                "useBlackboardKey": True,
                                "value": 0,
                                "blackboardKey": "atk_scale",
                            },
                            "value2": {
                                "useBlackboardKey": True,
                                "value": 3,
                                "blackboardKey": "final_rate",
                            },
                        },
                    }
                ]
            }
        }

        calculations = parse_blackboard_calculations(
            root,
            "buff.json",
            {"atk_scale": (0.2, 0.3), "final_rate": (6, 6)},
        )

        self.assertEqual(len(calculations), 1)
        self.assertEqual(calculations[0].key, "atk_scale_final")
        self.assertEqual(calculations[0].operation, "Multiply")
        self.assertEqual(calculations[0].left.levelValues, (0.2, 0.3))
        self.assertEqual(calculations[0].right.levelValues, (6, 6))

    def test_conditional_audit_preserves_blackboard_comparison_and_branches(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 3,
                        "_endFrame": 6,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 6,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CompareFloat+Data, Example",
                                                "valueA": {
                                                    "useBlackboardKey": True,
                                                    "value": 0,
                                                    "blackboardKey": "swordIndex",
                                                },
                                                "compare": "Equals",
                                                "valueB": {
                                                    "useBlackboardKey": False,
                                                    "value": 0,
                                                    "blackboardKey": "",
                                                },
                                            }
                                        ]
                                    },
                                    "succeedActions": {
                                        "actionData": [
                                            {"$type": "Example.DamageAction+Data, Example"},
                                            {"$type": "Example.DamageAction+Data, Example"},
                                            {
                                                "$type": "Example.SimpleCalcBBAction+Data, Example",
                                                "key": "result",
                                                "operation": "Add",
                                                "value1": {
                                                    "useBlackboardKey": False,
                                                    "value": 1,
                                                    "blackboardKey": "",
                                                },
                                                "value2": {
                                                    "useBlackboardKey": True,
                                                    "value": 0,
                                                    "blackboardKey": "swordIndex",
                                                },
                                            },
                                            {"$type": "Example.DamageAction+Data, Example"},
                                        ]
                                    },
                                    "failActions": {
                                        "actionData": [
                                            {"$type": "Example.DamageAction+Data, Example"}
                                        ]
                                    },
                                }
                            ]
                        },
                    }
                ]
            }
        }

        actions = parse_conditional_actions(root, "buff.json", {"swordIndex": (0,)})

        self.assertEqual(len(actions), 1)
        self.assertEqual(actions[0].startFrame, 3)
        self.assertEqual(actions[0].conditions[0].sourceType, "CompareFloat")
        self.assertEqual(actions[0].conditions[0].left.blackboardKey, "swordIndex")
        self.assertEqual(
            tuple(action.actionType for action in actions[0].succeedActions),
            (
                "DamageAction",
                "DamageAction",
                "SimpleCalcBBAction",
                "DamageAction",
            ),
        )
        self.assertEqual(
            tuple(action.actionType for action in actions[0].failActions),
            ("DamageAction",),
        )
        self.assertEqual(actions[0].succeedActions[2].actionIndex, 2)
        calculation = actions[0].succeedActions[2].blackboardCalculation
        self.assertEqual(calculation.key, "result")
        self.assertEqual(calculation.right.blackboardKey, "swordIndex")

    def test_conditional_audit_preserves_nested_branch_structure(self) -> None:
        compare = {
            "$type": "Example.CompareFloat+Data, Example",
            "valueA": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
            "compare": "Equals",
            "valueB": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
        }
        nested = {
            "$type": "Example.IfElseAction+Data, Example",
            "serverActionIndex": 1,
            "conditionAction": {"actionData": [compare]},
            "succeedActions": {
                "actionData": [{"$type": "Example.DamageAction+Data, Example"}]
            },
            "failActions": {
                "actionData": [{"$type": "Example.DamageAction+Data, Example"}]
            },
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 4,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 4,
                                    "conditionAction": {"actionData": [compare]},
                                    "succeedActions": {
                                        "actionData": [
                                            {"$type": "Example.DamageAction+Data, Example"},
                                            nested,
                                            {"$type": "Example.DamageAction+Data, Example"},
                                        ]
                                    },
                                    "failActions": {"actionData": []},
                                }
                            ]
                        },
                    }
                ]
            }
        }

        actions = parse_conditional_actions(root, "nested.json", {})

        self.assertEqual(len(actions), 1)
        self.assertEqual(
            tuple(action.actionType for action in actions[0].succeedActions),
            ("DamageAction", "IfElseAction", "DamageAction"),
        )
        nested_condition = actions[0].succeedActions[1].nestedCondition
        self.assertIsNotNone(nested_condition)
        self.assertEqual(
            tuple(action.actionType for action in nested_condition.succeedActions),
            ("DamageAction",),
        )
        self.assertEqual(
            tuple(action.actionType for action in nested_condition.failActions),
            ("DamageAction",),
        )

    def test_conditional_audit_parses_effect_leaf_payloads(self) -> None:
        scalar = {"useBlackboardKey": False, "value": 2, "blackboardKey": ""}
        condition = {
            "$type": "Example.CompareFloat+Data, Example",
            "valueA": scalar,
            "compare": "Equals",
            "valueB": scalar,
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 1,
                        "_endFrame": 2,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 3,
                                    "conditionAction": {"actionData": [condition]},
                                    "succeedActions": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CreateBuffAction+Data, Example",
                                                "buffs": [
                                                    {
                                                        "buffId": "buff.test",
                                                        "assignItems": [],
                                                    }
                                                ],
                                            },
                                            {
                                                "$type": "Example.ObtainCostAction+Data, Example",
                                                "costType": "Atb",
                                                "isPercentValue": False,
                                                "costValue": scalar,
                                                "coefficient": scalar,
                                            },
                                            {
                                                "$type": "Example.LaunchProjectile+Data, Example",
                                                "projectileId": "projectile.test",
                                                "castSkillOnHit": True,
                                                "projectileSkillId": "skill.projectile.hit",
                                            },
                                            {
                                                "$type": "Example.SpawnAbilityEntity+Data, Example",
                                                "abilityEntityId": "entity.test",
                                                "abilityEntitySkillId": "skill.entity.hit",
                                            },
                                        ]
                                    },
                                    "failActions": {"actionData": []},
                                }
                            ]
                        },
                    }
                ]
            }
        }

        actions = parse_conditional_actions(root, "effects.json", {})[0].succeedActions

        self.assertEqual(actions[0].buffApplication.buffs[0].buffId, "buff.test")
        self.assertEqual(actions[1].resourceGain.resource, "sp")
        self.assertEqual(actions[1].resourceGain.amount.value, 2)
        self.assertEqual(actions[2].projectileLaunch.hitSkillId, "skill.projectile.hit")
        self.assertEqual(actions[3].abilityEntitySpawn.skillId, "skill.entity.hit")

    def test_conditional_audit_preserves_entity_and_buff_stack_conditions(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 6,
                        "_endFrame": 7,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 8,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckEntityNum+Data, Example",
                                                "checkTarget": {
                                                    "targetSource": "Context",
                                                    "targetGroupKey": "smart_target",
                                                },
                                                "minNum": 1,
                                                "containsHittableTarget": False,
                                                "compareType": "GE",
                                                "excludeDeadEntity": True,
                                                "storeKey": "",
                                            },
                                            {
                                                "$type": "Example.CheckBuffStackNumAdvanced+Data, Example",
                                                "checkTarget": {
                                                    "targetSource": "Context",
                                                    "targetGroupKey": "smart_target",
                                                },
                                                "buffSettings": {
                                                    "checkType": "Tag",
                                                    "buffIdList": [],
                                                    "tagQuery": {
                                                        "queryType": "HasAny",
                                                        "tags": [{"tagId": 1466867135}],
                                                    },
                                                },
                                                "buffStackNumType": "BuffCount",
                                                "compareType": "GE",
                                                "value": {
                                                    "useBlackboardKey": False,
                                                    "value": 1,
                                                    "blackboardKey": "",
                                                },
                                                "limitSkillCastId": False,
                                            },
                                        ]
                                    },
                                    "succeedActions": {
                                        "actionData": [
                                            {"$type": "Example.DamageAction+Data, Example"}
                                        ]
                                    },
                                    "failActions": {"actionData": []},
                                }
                            ]
                        },
                    }
                ]
            }
        }

        action = parse_conditional_actions(root, "skill.json", {})[0]

        entity = action.conditions[0]
        self.assertFalse(entity.supported)
        self.assertEqual(entity.entityCount.targetGroupKey, "smart_target")
        self.assertEqual(entity.entityCount.minimumCount, 1)
        buff = action.conditions[1]
        self.assertTrue(buff.supported)
        self.assertEqual(buff.buffStack.buffTagIds, (1466867135,))
        self.assertEqual(buff.buffStack.countType, "BuffCount")
        self.assertEqual(buff.buffStack.value.value, 1)

    def test_condition_compiler_emits_action_blackboard_and_enemy_buff_conditions(self) -> None:
        compare = SimpleNamespace(
            sourceType="CompareFloat",
            comparison="LE",
            left=ScalarSource(0, "swordCount", None),
            right=ScalarSource(3, None, None),
            buffStack=None,
        )
        buff = SimpleNamespace(
            sourceType="CheckBuffStackNumAdvanced",
            comparison=None,
            left=None,
            right=None,
            buffStack=SimpleNamespace(
                targetSource="Context",
                targetGroupKey="smart_target",
                buffCheckType="Tag",
                buffIds=(),
                buffTagIds=(1466867135,),
                countType="BuffCount",
                comparison="GE",
                value=ScalarSource(1, None, None),
                limitSkillCastId=False,
                tagQueryType="hasAny",
            ),
        )

        result = compile_combat_condition_group((compare, buff), "fixture.conditions")

        self.assertIn("kind: 'all'", result)
        self.assertIn("kind: 'actionValueCompare'", result)
        self.assertIn("key: 'swordCount'", result)
        self.assertIn("kind: 'buffStackCompare'", result)
        self.assertIn("buffTagIds: [1466867135]", result)

    def test_condition_compiler_emits_caster_buff_identity_queries(self) -> None:
        condition = SimpleNamespace(
            sourceType="CheckBuffStackNumAdvanced",
            comparison=None,
            left=None,
            right=None,
            buffStack=SimpleNamespace(
                targetSource="Source",
                targetGroupKey="",
                buffCheckType="Id",
                buffIds=("buff.example.sword",),
                buffTagIds=(),
                countType="BuffCount",
                comparison="GE",
                value=ScalarSource(1, None, None),
                limitSkillCastId=False,
                tagQueryType="hasAny",
            ),
        )

        result = compile_combat_condition_group((condition,), "fixture.conditions")

        self.assertIn("kind: 'buffIdStackCompare'", result)
        self.assertIn("target: 'caster'", result)
        self.assertIn("buffIds: ['buff.example.sword']", result)

    def test_conditional_action_compiler_preserves_nested_branch_order(self) -> None:
        compare = SimpleNamespace(
            sourceType="CompareFloat",
            comparison="GE",
            left=ScalarSource(0, "conductCount", None),
            right=ScalarSource(1, None, None),
            buffStack=None,
        )
        read = SimpleNamespace(
            targetSource="Context",
            targetGroupKey="smart_target",
            buffCheckType="Tag",
            buffIds=(),
            buffTagIds=(1466867135,),
            tagQueryType="hasAny",
            desiredKey="count",
            outputKey="conductCount",
        )
        finish = SimpleNamespace(
            targetSource="Context",
            targetGroupKey="smart_target",
            buffCheckType="Tag",
            buffIds=(),
            buffTagIds=(1466867135,),
            tagQueryType="hasAny",
            finishAll=True,
            limitSource=False,
            isFinishedEarly=True,
            isAbsorbed=False,
        )
        nested = SimpleNamespace(
            conditions=(compare,),
            succeedActions=(
                SimpleNamespace(
                    actionType="FinishBuffAdvanced",
                    nestedCondition=None,
                    buffBlackboardRead=None,
                    buffFinish=finish,
                ),
            ),
            failActions=(),
        )
        action = SimpleNamespace(
            conditions=(compare,),
            succeedActions=(
                SimpleNamespace(
                    actionType="GetTargetBuffBBAdvanced",
                    nestedCondition=None,
                    buffBlackboardRead=read,
                    buffFinish=None,
                ),
                SimpleNamespace(
                    actionType="IfElseAction",
                    nestedCondition=nested,
                    buffBlackboardRead=None,
                    buffFinish=None,
                ),
            ),
            failActions=(),
        )

        result = compile_conditional_action(action, "fixture.condition")

        self.assertEqual(result.count("branch("), 2)
        self.assertLess(result.index("readBuffBlackboard"), result.index("finishBuffsByTag"))
        self.assertIn("key: 'conductCount'", result)

    def test_conditional_action_compiler_emits_caster_buff_identity_finish(self) -> None:
        condition = SimpleNamespace(
            sourceType="CompareFloat",
            comparison="GE",
            left=ScalarSource(1, None, None),
            right=ScalarSource(1, None, None),
            buffStack=None,
        )
        finish = SimpleNamespace(
            targetSource="Source",
            targetGroupKey="",
            buffCheckType="Id",
            buffIds=("buff.example.sword",),
            buffTagIds=(),
            tagQueryType="hasAny",
            finishAll=True,
            limitSource=False,
            isFinishedEarly=False,
            isAbsorbed=False,
        )
        action = SimpleNamespace(
            conditions=(condition,),
            succeedActions=(
                SimpleNamespace(
                    actionType="FinishBuffAdvanced",
                    nestedCondition=None,
                    buffBlackboardRead=None,
                    buffFinish=finish,
                ),
            ),
            failActions=(),
        )

        result = compile_conditional_action(action, "fixture.condition")

        self.assertIn("finishBuffsById", result)
        self.assertIn("target: 'caster'", result)
        self.assertIn("buffIds: ['buff.example.sword']", result)

    def test_conditional_action_compiler_emits_action_blackboard_mutation(self) -> None:
        condition = SimpleNamespace(
            sourceType="CompareFloat",
            comparison="GE",
            left=ScalarSource(1, None, None),
            right=ScalarSource(1, None, None),
            buffStack=None,
        )
        action = SimpleNamespace(
            conditions=(condition,),
            succeedActions=(
                SimpleNamespace(
                    actionType="ModifyDynamicBlackboard",
                    nestedCondition=None,
                    blackboardMutation=SimpleNamespace(
                        key="swordCount",
                        operation="Add",
                        value=ScalarSource(1, None, None),
                    ),
                    buffBlackboardRead=None,
                    buffFinish=None,
                ),
            ),
            failActions=(),
        )

        result = compile_conditional_action(action, "fixture.condition")

        self.assertIn("modifyActionValue", result)
        self.assertIn("key: 'swordCount'", result)
        self.assertIn("operation: 'add'", result)

    def test_conditional_action_compiler_emits_two_operand_blackboard_calculation(self) -> None:
        condition = SimpleNamespace(
            sourceType="CompareFloat",
            comparison="GE",
            left=ScalarSource(1, None, None),
            right=ScalarSource(1, None, None),
            buffStack=None,
        )
        action = SimpleNamespace(
            conditions=(condition,),
            succeedActions=(
                SimpleNamespace(
                    actionType="SimpleCalcBBAction",
                    nestedCondition=None,
                    blackboardCalculation=BlackboardCalculationPayload(
                        key="attackScale",
                        operation="Multiply",
                        left=ScalarSource(None, "baseScale", None),
                        right=ScalarSource(1.5, None, None),
                    ),
                    blackboardMutation=None,
                    buffBlackboardRead=None,
                    buffFinish=None,
                ),
            ),
            failActions=(),
        )

        result = compile_conditional_action(action, "fixture.condition")

        self.assertIn("calculateActionValue", result)
        self.assertIn("key: 'attackScale'", result)
        self.assertIn("operation: 'multiply'", result)
        self.assertIn("left: { kind: 'blackboard', key: 'baseScale' }", result)
        self.assertIn("right: { kind: 'constant', value: 1.5 }", result)

    def test_conditional_action_compiler_rejects_unresolved_leaf_with_path(self) -> None:
        condition = SimpleNamespace(
            sourceType="CompareFloat",
            comparison="GE",
            left=ScalarSource(1, None, None),
            right=ScalarSource(1, None, None),
            buffStack=None,
        )
        action = SimpleNamespace(
            conditions=(condition,),
            succeedActions=(
                SimpleNamespace(
                    actionType="DamageAction",
                    nestedCondition=None,
                    blackboardCalculation=None,
                    blackboardMutation=None,
                    buffBlackboardRead=None,
                    buffFinish=None,
                ),
            ),
            failActions=(),
        )

        with self.assertRaisesRegex(
            ValueError,
            r"fixture\.condition\.succeedActions\[0\].*DamageAction",
        ):
            compile_conditional_action(action, "fixture.condition")

    def test_resolved_damage_compiler_is_independent_of_the_hit_carrier(self) -> None:
        unit = DamageUnitSource(
            damageType="Pulse",
            attributeType="Hp",
            calculation="standard",
            attackScale=ScalarSource(0, "atk", (0.5, 0.6)),
            calculationMultiplier=None,
            poiseValue=None,
        )
        skill = SimpleNamespace(
            key="attack",
            timelineBlockFrames=20,
            buffBehaviors=(SimpleNamespace(buffId="input_lock"),),
            auxiliaryActions=(
                SimpleNamespace(
                    actionType="CreateBuffAction",
                    sourceId="input_lock",
                    classification="inputLock",
                ),
            ),
            resourceGains=(SimpleNamespace(amount=ScalarSource(0, "unused", (0, 0))),),
            inflictions=(),
            projectileLaunches=(),
            conditionalActions=(),
            blackboardCalculations=(),
            unresolvedCombatActions=("SpawnAbilityEntity", "CreateBuffAction"),
            skillId="root",
            directDamageHits=(),
            projectileHits=(),
            abilityEntityHits=(
                SimpleNamespace(
                    spawnFrame=10,
                    actionOrder=(0,),
                    skillId="entity_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=2, actionIndex=0, damageUnits=(unit,)),
                    ),
                    projectileHits=(),
                    nestedAbilityEntityHits=(),
                ),
            ),
        )

        source = compile_resolved_damage_sequence(
            skill,
            {
                "tags": ["normalAttack"],
                "availability": "targetStaggered",
                "afterDamage": "gainFinisherSp",
                "ignoreAuxiliaryClassifications": ["inputLock"],
            },
        )

        self.assertIn("scheduled(\n        12,", source)
        self.assertIn("attackScale: percentages([50, 60])", source)
        self.assertIn("damageType: 'electric'", source)
        self.assertIn("availability: { kind: 'targetStaggered', target: 'enemy' }", source)
        self.assertIn("step('gainFinisherSp', { factor: 1, recipient: 'team' })", source)

    def test_resolved_damage_compiler_interleaves_condition_roots_by_native_order(self) -> None:
        unit = DamageUnitSource(
            damageType="Pulse",
            attributeType="Hp",
            calculation="standard",
            attackScale=ScalarSource(1, None, (1,)),
            calculationMultiplier=None,
            poiseValue=None,
        )
        condition = SimpleNamespace(
            startFrame=12,
            actionIndex=5,
            actionPath=("root", "condition"),
            conditions=(
                SimpleNamespace(
                    sourceType="CompareFloat",
                    comparison="Equals",
                    left=ScalarSource(1, None, None),
                    right=ScalarSource(1, None, None),
                ),
            ),
            succeedActions=(
                SimpleNamespace(
                    actionType="ModifyDynamicBlackboard",
                    nestedCondition=None,
                    buffBlackboardRead=None,
                    buffFinish=None,
                    blackboardMutation=SimpleNamespace(
                        key="swordCount",
                        operation="Add",
                        value=ScalarSource(1, None, None),
                    ),
                ),
            ),
            failActions=(),
        )
        skill = SimpleNamespace(
            key="attack",
            timelineBlockFrames=20,
            buffBehaviors=(),
            auxiliaryActions=(),
            resourceGains=(),
            inflictions=(),
            projectileLaunches=(),
            conditionalActions=(condition,),
            blackboardCalculations=(),
            unresolvedCombatActions=("IfElseAction", "SpawnAbilityEntity"),
            skillId="root",
            directDamageHits=(),
            projectileHits=(),
            abilityEntityHits=(
                SimpleNamespace(
                    spawnFrame=12,
                    actionOrder=(6,),
                    skillId="entity_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=0, actionIndex=0, damageUnits=(unit,)),
                    ),
                    projectileHits=(),
                    nestedAbilityEntityHits=(),
                ),
            ),
        )

        source = compile_resolved_damage_sequence(skill, {"tags": ["normalAttack"]})

        self.assertLess(source.index("branch("), source.index("step('dealDamage'"))

    def test_resolved_damage_compiler_interleaves_root_blackboard_calculation(self) -> None:
        unit = DamageUnitSource(
            damageType="Pulse",
            attributeType="Hp",
            calculation="standard",
            attackScale=ScalarSource(1, None, (1,)),
            calculationMultiplier=None,
            poiseValue=None,
        )
        skill = SimpleNamespace(
            key="attack",
            timelineBlockFrames=20,
            buffBehaviors=(),
            auxiliaryActions=(),
            resourceGains=(),
            inflictions=(),
            projectileLaunches=(),
            conditionalActions=(),
            blackboardCalculations=(
                SimpleNamespace(
                    startFrame=12,
                    actionIndex=5,
                    key="attackScale",
                    operation="Multiply",
                    left=ScalarSource(None, "baseScale", None),
                    right=ScalarSource(1.5, None, None),
                ),
            ),
            unresolvedCombatActions=("SimpleCalcBBAction", "SpawnAbilityEntity"),
            skillId="root",
            directDamageHits=(),
            projectileHits=(),
            abilityEntityHits=(
                SimpleNamespace(
                    spawnFrame=12,
                    actionOrder=(6,),
                    skillId="entity_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=0, actionIndex=0, damageUnits=(unit,)),
                    ),
                    projectileHits=(),
                    nestedAbilityEntityHits=(),
                ),
            ),
        )

        source = compile_resolved_damage_sequence(skill, {"tags": ["normalAttack"]})

        self.assertLess(source.index("calculateActionValue"), source.index("step('dealDamage'"))

    def test_skill_compiler_rejects_unconsumed_conditional_actions(self) -> None:
        skill = SimpleNamespace(
            key="attack",
            conditionalActions=(
                SimpleNamespace(
                    conditions=(SimpleNamespace(entityCount=None),),
                    succeedActions=(SimpleNamespace(actionType="left"),),
                    failActions=(SimpleNamespace(actionType="right"),),
                ),
            ),
        )
        operator = {
            "slug": "fixture",
            "skills": [
                {
                    "key": "attack",
                    "compile": {"kind": "directDamage", "tags": ["normalAttack"]},
                }
            ],
        }

        with self.assertRaisesRegex(ValueError, "must consume conditional actions"):
            compile_skill_entries(operator, [skill])

    def test_missing_buff_source_is_explicit_in_the_audit_layer(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 6,
                        "_endFrame": 6,
                        "_sequenceActionData": {
                            "$type": "Example.CreateBuffAction+Data, Example",
                            "serverActionIndex": 0,
                            "isEnable": True,
                            "buffs": [
                                {
                                    "buffId": "missing_buff",
                                    "assignItems": [],
                                }
                            ],
                        },
                    }
                ]
            }
        }
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            behaviors = resolve_buff_behaviors(root, "skill.json", path, path, {})

        self.assertEqual(len(behaviors), 1)
        self.assertEqual(behaviors[0].buffId, "missing_buff")
        self.assertFalse(behaviors[0].sourceAvailable)

    def test_buff_event_slots_keep_their_trigger_and_created_buff_references(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 6,
                        "_endFrame": 6,
                        "_sequenceActionData": {
                            "$type": "Example.CreateBuffAction+Data, Example",
                            "serverActionIndex": 0,
                            "isEnable": True,
                            "buffs": [{"buffId": "parent_buff", "assignItems": []}],
                        },
                    }
                ]
            }
        }
        buff = {
            "lifeType": "Limited",
            "timelineActions": [],
            "buffEventAction": [
                {
                    "buffEvent": "OnBuffTrigger",
                    "actions": [
                        {
                            "actionData": [
                                {
                                    "$type": "Example.CreateBuffAction+Data, Example",
                                    "serverActionIndex": 0,
                                    "isEnable": True,
                                    "buffs": [{"buffId": "child_buff", "assignItems": []}],
                                }
                            ]
                        }
                    ],
                }
            ],
        }
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            (path / "parent_buff.json").write_text(json.dumps(buff), encoding="utf-8")
            behaviors = resolve_buff_behaviors(root, "skill.json", path, path, {})

        event = behaviors[0].eventActions[0]
        self.assertEqual(event.event, "OnBuffTrigger")
        self.assertEqual(event.combatActions, ("CreateBuffAction",))
        self.assertEqual(event.createdBuffIds, ("child_buff",))
        self.assertEqual(len(event.createdBuffBehaviors), 1)
        self.assertEqual(event.createdBuffBehaviors[0].applicationEvent, "OnBuffTrigger")
        self.assertIsNone(event.createdBuffBehaviors[0].applicationFrame)
        self.assertFalse(event.createdBuffBehaviors[0].sourceAvailable)

    def test_projectile_without_hit_skill_is_preserved_as_a_launch(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 9,
                        "_endFrame": 9,
                        "_sequenceActionData": {
                            "$type": "Example.LaunchProjectile+Data, Example",
                            "isEnable": True,
                            "projectileId": "visual_or_native_projectile",
                            "castSkillOnHit": False,
                            "projectileSkillId": "",
                        },
                    }
                ]
            }
        }

        launches = parse_projectile_launches(root, "skill.json")

        self.assertEqual(len(launches), 1)
        self.assertEqual(launches[0].launchFrame, 9)
        self.assertFalse(launches[0].castSkillOnHit)
        self.assertIsNone(launches[0].hitSkillId)

    def test_ability_entity_without_child_skill_is_kept_as_non_combat_auxiliary_action(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 4,
                        "_endFrame": 5,
                        "_sequenceActionData": {
                            "$type": "Example.SpawnAbilityEntity+Data, Example",
                            "serverActionIndex": 0,
                            "isEnable": True,
                            "abilityEntityId": "fake_target",
                            "abilityEntitySkillId": "",
                        },
                    }
                ]
            }
        }

        actions = parse_auxiliary_actions(root, "skill.json", Path("."), {})

        self.assertEqual(len(actions), 1)
        self.assertEqual(actions[0].sourceId, "fake_target")
        self.assertEqual(actions[0].classification, "nonCombatAbilityEntity")

    def test_ability_entity_child_skill_keeps_spawn_offset_and_combat_details(self) -> None:
        spawn = {
            "$type": "Example.SpawnAbilityEntity+Data, Example",
            "serverActionIndex": 5,
            "isEnable": True,
            "abilityEntityId": "ability_entity",
            "abilityEntitySkillId": "child_skill",
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {"_startFrame": 12, "_endFrame": 12, "_sequenceActionData": spawn}
                ]
            }
        }
        child = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 3,
                        "_endFrame": 3,
                        "_sequenceActionData": {
                            "$type": "Example.ObtainCostAction+Data, Example",
                            "serverActionIndex": 0,
                            "isEnable": True,
                            "costType": "Atb",
                            "isPercentValue": False,
                            "costValue": {"useBlackboardKey": False, "value": 5, "blackboardKey": ""},
                            "coefficient": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
                        },
                    }
                ]
            }
        }
        with tempfile.TemporaryDirectory() as directory:
            source_dir = Path(directory)
            (source_dir / "child_skill.json").write_text(json.dumps(child), encoding="utf-8")

            hits = resolve_ability_entity_hits(root, "parent.json", source_dir, base_frame=7)

        self.assertEqual(len(hits), 1)
        self.assertEqual(hits[0].spawnFrame, 19)
        self.assertEqual(hits[0].actionOrder, (5,))
        self.assertEqual(hits[0].skillId, "child_skill")
        self.assertEqual(hits[0].combatActions, ("ObtainCostAction",))
        self.assertEqual(hits[0].resourceGains[0].startFrame, 3)

    def test_damage_projection_uses_absolute_frames_across_child_skills(self) -> None:
        damage_units = (SimpleNamespace(attributeType="Hp"),)
        skill = SimpleNamespace(
            skillId="root",
            directDamageHits=(
                SimpleNamespace(startFrame=2, actionIndex=3, damageUnits=damage_units),
            ),
            projectileHits=(
                SimpleNamespace(
                    launchFrame=5,
                    actionOrder=(1,),
                    assumedTravelFrames=0,
                    hitSkillId="projectile_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=3, actionIndex=0, damageUnits=damage_units),
                    ),
                    nestedProjectileHits=(),
                ),
            ),
            abilityEntityHits=(
                SimpleNamespace(
                    spawnFrame=10,
                    actionOrder=(2,),
                    skillId="entity_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=4, actionIndex=0, damageUnits=damage_units),
                    ),
                    projectileHits=(),
                    nestedAbilityEntityHits=(),
                ),
            ),
        )

        hits = collect_resolved_damage_hits(skill)

        self.assertEqual([hit.frame for hit in hits], [2, 8, 14])
        self.assertEqual([hit.sourceKind for hit in hits], ["direct", "projectile", "abilityEntity"])
        self.assertEqual(hits[-1].sourcePath, ("root", "entity_hit"))

    def test_damage_projection_orders_same_frame_hits_by_root_server_action_index(self) -> None:
        damage_units = (SimpleNamespace(attributeType="Hp"),)
        skill = SimpleNamespace(
            skillId="root",
            directDamageHits=(
                SimpleNamespace(startFrame=5, actionIndex=8, damageUnits=damage_units),
            ),
            projectileHits=(
                SimpleNamespace(
                    launchFrame=5,
                    actionOrder=(2,),
                    assumedTravelFrames=0,
                    hitSkillId="projectile_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=0, actionIndex=0, damageUnits=damage_units),
                    ),
                    nestedProjectileHits=(),
                ),
            ),
            abilityEntityHits=(
                SimpleNamespace(
                    spawnFrame=5,
                    actionOrder=(5,),
                    skillId="entity_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=0, actionIndex=0, damageUnits=damage_units),
                    ),
                    projectileHits=(),
                    nestedAbilityEntityHits=(),
                ),
            ),
        )

        hits = collect_resolved_damage_hits(skill)

        self.assertEqual([hit.frame for hit in hits], [5, 5, 5])
        self.assertEqual([hit.actionOrder for hit in hits], [(2, 0), (5, 0), (8,)])
        self.assertEqual(
            [hit.sourceKind for hit in hits],
            ["projectile", "abilityEntity", "direct"],
        )

    def test_nested_projectile_keeps_the_root_launch_action_index(self) -> None:
        parent = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 4,
                        "_endFrame": 4,
                        "_sequenceActionData": {
                            "$type": "Example.LaunchProjectile+Data, Example",
                            "serverActionIndex": 7,
                            "isEnable": True,
                            "projectileId": "parent_projectile",
                            "castSkillOnHit": True,
                            "projectileSkillId": "child_hit",
                        },
                    }
                ]
            }
        }
        child = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 1,
                        "_endFrame": 1,
                        "_sequenceActionData": {
                            "$type": "Example.LaunchProjectile+Data, Example",
                            "serverActionIndex": 2,
                            "isEnable": True,
                            "projectileId": "nested_projectile",
                            "castSkillOnHit": True,
                            "projectileSkillId": "nested_hit",
                        },
                    }
                ]
            }
        }
        nested = {"actionGroupData": {"timelineActions": []}}
        with tempfile.TemporaryDirectory() as directory:
            source_dir = Path(directory)
            (source_dir / "child_hit.json").write_text(json.dumps(child), encoding="utf-8")
            (source_dir / "nested_hit.json").write_text(json.dumps(nested), encoding="utf-8")

            hits = resolve_projectile_hits(parent, "parent.json", source_dir)

        self.assertEqual(hits[0].actionOrder, (7,))
        self.assertEqual(hits[0].nestedProjectileHits[0].actionOrder, (7, 2))

    def test_operator_slug_becomes_a_valid_camel_case_identifier(self) -> None:
        self.assertEqual(typescript_identifier("zhuang-fangyi"), "zhuangFangyi")

    def test_panel_attributes_select_milestone_levels_and_truncate_display_values(self) -> None:
        attributes = []
        for level in (1, 20, 40, 60, 80, 90):
            attributes.append(
                {
                    "Attribute": {
                        "attrs": [
                            {"attrType": 0, "attrValue": level},
                            *(
                                {"attrType": attr_type, "attrValue": level + 0.9}
                                for attr_type in (39, 40, 41, 42, 2, 1)
                            ),
                        ]
                    }
                }
            )

        result = parse_panel_attributes({"attributes": attributes}, "character")

        self.assertEqual(result["strength"], (1, 20, 40, 60, 80, 90))
        self.assertEqual(result["baseHealth"], (1, 20, 40, 60, 80, 90))

    def test_multiple_ui_groups_can_reconstruct_one_native_skill_group(self) -> None:
        operator = {
            "slug": "operator",
            "skillGroups": [
                {"nativeGroupType": 2, "skillKeys": ["ultimate"]},
                {"nativeGroupType": 2, "skillKeys": ["enhancedAttack1", "enhancedAttack2"]},
            ],
        }
        skills = [
            SimpleNamespace(key="ultimate", skillId="skill_ultimate"),
            SimpleNamespace(key="enhancedAttack1", skillId="skill_attack_1"),
            SimpleNamespace(key="enhancedAttack2", skillId="skill_attack_2"),
        ]
        growth = {
            "skillGroupMap": {
                "ultimate": {
                    "skillGroupType": 2,
                    "skillIdList": ["skill_ultimate", "skill_attack_1", "skill_attack_2"],
                }
            }
        }

        validate_skill_groups(operator, skills, growth, "growth")

    def test_if_else_with_identical_combat_branches_is_folded_once(self) -> None:
        spawn = lambda server_index: {
            "$type": "Example.SpawnAbilityEntity+Data, Example",
            "isEnable": True,
            "serverActionIndex": server_index,
            "abilityEntityId": "entity",
            "abilityEntitySkillId": "hit_skill",
        }
        root = {
            "$type": "Example.IfElseAction+Data, Example",
            "isEnable": True,
            "succeedActions": {"actionData": [spawn(1)]},
            "failActions": {"actionData": [spawn(2)]},
        }

        actions = list(walk_actions(root))

        self.assertEqual(len(actions), 1)
        self.assertIn("SpawnAbilityEntity", actions[0]["$type"])

    def test_if_else_with_different_combat_branches_remains_unresolved(self) -> None:
        root = {
            "$type": "Example.IfElseAction+Data, Example",
            "isEnable": True,
            "succeedActions": {
                "actionData": [
                    {
                        "$type": "Example.ObtainCostAction+Data, Example",
                        "costType": "Atb",
                        "costValue": {"value": 10},
                    }
                ]
            },
            "failActions": {"actionData": []},
        }

        actions = list(walk_actions(root))

        self.assertEqual(len(actions), 2)
        self.assertIn("IfElseAction", actions[0]["$type"])
        self.assertIn("ObtainCostAction", actions[1]["$type"])

    def test_allow_next_can_open_before_generic_interrupt_boundary(self) -> None:
        frame, source = derive_timeline_block(
            22,
            ({"startFrame": 18, "endFrame": 28, "skillIds": ["next"]},),
        )

        self.assertEqual((frame, source), (18, "AllowNextSkillAction.startFrame"))

    def test_generic_interrupt_boundary_uses_the_first_following_frame(self) -> None:
        self.assertEqual(derive_timeline_block(43, ()), (44, "exclusiveFrame+1"))

    def test_blackboard_dependencies_are_sorted_and_deduplicated(self) -> None:
        source = {
            "first": {"useBlackboardKey": True, "blackboardKey": "atk_scale"},
            "second": [
                {"useBlackboardKey": True, "blackboardKey": "damage_ratio"},
                {"useBlackboardKey": True, "blackboardKey": "atk_scale"},
            ],
        }

        self.assertEqual(collect_blackboard_keys(source), ("atk_scale", "damage_ratio"))

    def test_empty_template_blackboard_key_is_not_a_dependency(self) -> None:
        self.assertEqual(collect_blackboard_keys({"useBlackboardKey": True, "blackboardKey": ""}), ())

    def test_scalar_resolves_level_values_from_inherited_blackboard(self) -> None:
        scalar = parse_scalar(
            {"useBlackboardKey": True, "blackboardKey": "atk_scale", "value": 0},
            "damage.atkScale",
            {"atk_scale": (0.25, 0.5)},
        )

        self.assertEqual(scalar.blackboardKey, "atk_scale")
        self.assertEqual(scalar.levelValues, (0.25, 0.5))

    def test_skill_patch_requires_every_level_to_have_the_same_keys(self) -> None:
        with self.assertRaisesRegex(ValueError, "missing at some levels"):
            parse_skill_patch(
                {
                    "SkillPatchDataBundle": [
                        {"level": 1, "blackboard": [{"key": "atk", "value": 1}]},
                        {"level": 2, "blackboard": []},
                    ]
                },
                "skill",
            )

    def test_inline_typescript_literal_keeps_short_values_compact(self) -> None:
        self.assertEqual(
            ts_inline_literal({"final": True, "values": (0.25, 15.0)}),
            "{ final: true, values: [0.25, 15] }",
        )

    def test_percentage_values_restore_readable_percentages(self) -> None:
        self.assertEqual(percentage_values((0.25, 1.02, 0.125)), (25, 102, 12.5))

    def test_only_buffs_with_confirmed_semantics_are_classified(self) -> None:
        self.assertEqual(classify_buff("buff_common_damage_immune_ult_skill"), "incomingDamageProtection")
        self.assertEqual(classify_buff("buff_common_power_attack_disable_cast_skill"), "inputLock")
        self.assertEqual(
            classify_buff("buff_common_obtain_ultimate_sp"),
            "skillCostUltimateEnergyGain",
        )
        self.assertEqual(
            classify_buff("buff_chr_0004_pelica_combo_skill_tutorial_marker"),
            "tutorialMarker",
        )
        self.assertEqual(
            classify_buff("buff_chr_9999_example_skill_tutorial_marker"),
            "tutorialMarker",
        )
        self.assertEqual(
            classify_buff("buff_common_pulse_pulse_conduct_triggered"),
            "electrificationReaction",
        )
        self.assertIsNone(classify_buff("buff_operator_damage_bonus"))

    def test_resource_gain_resolves_level_values_and_ignores_disabled_actions(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 24,
                        "_endFrame": 27,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.ObtainCostAction+Data, Example",
                                    "isEnable": False,
                                    "costType": "Atb",
                                },
                                {
                                    "$type": "Example.ObtainCostAction+Data, Example",
                                    "isEnable": True,
                                    "serverActionIndex": 1,
                                    "costType": "UltimateSp",
                                    "isPercentValue": False,
                                    "costValue": {
                                        "useBlackboardKey": True,
                                        "blackboardKey": "usp",
                                        "value": 0,
                                    },
                                    "coefficient": {
                                        "useBlackboardKey": False,
                                        "blackboardKey": "",
                                        "value": 1,
                                    },
                                },
                            ]
                        },
                    }
                ]
            }
        }

        gains = parse_resource_gains(root, "skill.json", {"usp": (8.0, 10.0)})

        self.assertEqual(len(gains), 1)
        self.assertEqual((gains[0].startFrame, gains[0].actionIndex), (24, 1))
        self.assertEqual(gains[0].resource, "ultimateEnergy")
        self.assertEqual(gains[0].amount.levelValues, (8.0, 10.0))

    def test_spell_infliction_keeps_frame_action_order_and_element(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 13,
                        "_endFrame": 13,
                        "_sequenceActionData": {
                            "actionData": [
                                {"$type": "Example.FindTarget, Example"},
                                {
                                    "$type": "Example.SpellInfliction+Data, Example",
                                    "serverActionIndex": 1,
                                    "inflictionType": "Pulse",
                                    "isExtra": False,
                                },
                                {"$type": "Example.DamageAction, Example"},
                            ]
                        },
                    }
                ]
            }
        }

        inflictions = parse_inflictions(root, "skill.json")

        self.assertEqual(len(inflictions), 1)
        self.assertEqual(
            (
                inflictions[0].startFrame,
                inflictions[0].endFrame,
                inflictions[0].actionIndex,
                inflictions[0].element,
                inflictions[0].isExtra,
            ),
            (13, 13, 1, "electric", False),
        )

    def test_direct_damage_keeps_timeline_and_action_order(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 13,
                        "_endFrame": 15,
                        "_sequenceActionData": {
                            "actionData": [
                                {"$type": "Example.CreateBuffAction, Example"},
                                {
                                    "$type": "Example.DamageAction, Example",
                                    "serverActionIndex": 1,
                                    "damageUnits": [
                                        {
                                            "damageType": "Pulse",
                                            "damageAttributeType": "Hp",
                                            "simpleCalculation": True,
                                            "atkScale": {
                                                "useBlackboardKey": True,
                                                "blackboardKey": "atk",
                                                "value": 0,
                                            },
                                        }
                                    ],
                                },
                            ]
                        },
                    }
                ]
            }
        }

        hits = parse_direct_damage_hits(root, "skill.json", {"atk": (1.0, 2.0)})

        self.assertEqual((hits[0].startFrame, hits[0].endFrame, hits[0].actionIndex), (13, 15, 1))
        self.assertEqual(hits[0].damageUnits[0].attackScale.levelValues, (1.0, 2.0))

    def test_direct_damage_does_not_project_conditional_branch_hits(self) -> None:
        damage = {
            "$type": "Example.DamageAction+Data, Example",
            "serverActionIndex": 2,
            "damageUnits": [],
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 3,
                        "_endFrame": 3,
                        "_sequenceActionData": {
                            "actionData": [
                                damage,
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 4,
                                    "conditionAction": {"actionData": []},
                                    "succeedActions": {"actionData": [damage]},
                                    "failActions": {"actionData": [damage]},
                                },
                            ]
                        },
                    }
                ]
            }
        }

        hits = parse_direct_damage_hits(root, "skill.json", {})

        self.assertEqual(len(hits), 1)
        self.assertEqual(hits[0].actionIndex, 2)

    def test_breaking_attack_reads_its_nested_scale(self) -> None:
        root = {
            "actionGroupData": {
                "action": {
                    "$type": "Example.DamageAction, Example",
                    "damageUnits": [
                        {
                            "damageType": "Pulse",
                            "damageAttributeType": "Hp",
                            "simpleCalculation": False,
                            "atkScale": {
                                "useBlackboardKey": False,
                                "blackboardKey": "",
                                "value": 4,
                            },
                            "atkCalculation": {
                                "$type": "Example.BreakingAttackCalculation, Example",
                                "multiplier": {
                                    "useBlackboardKey": False,
                                    "blackboardKey": "",
                                    "value": 0.1,
                                },
                                "atkScale": {
                                    "useBlackboardKey": True,
                                    "blackboardKey": "atk_scale",
                                    "value": 5,
                                },
                            },
                        }
                    ],
                }
            }
        }

        unit = parse_damage_units(root, "finisher.json", {"atk_scale": (4.0, 9.0)})[0]

        self.assertEqual(unit.calculation, "breakingAttack")
        self.assertEqual(unit.attackScale.levelValues, (4.0, 9.0))
        self.assertEqual(unit.calculationMultiplier.value, 0.1)


if __name__ == "__main__":
    unittest.main()
