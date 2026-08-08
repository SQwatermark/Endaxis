"""验证干员生成器最关键的派生规则和严格校验。"""

import unittest
import json
import tempfile
from pathlib import Path
from types import SimpleNamespace

from generate_next_operators import (
    collect_blackboard_keys,
    collect_conditional_blackboard_keys,
    collect_referenced_buff_ids,
    collect_resolved_damage_hits,
    collect_timed_marker_damage_gates,
    collect_once_resource_gain_gates,
    build_blackboard_provenance,
    compile_skill_entries,
    compile_resolved_damage_sequence,
    compile_resolved_sequence,
    compile_combat_condition_group,
    compile_conditional_action,
    AuxiliaryActionSource,
    BlackboardCalculationPayload,
    BlackboardMutationPayload,
    BlackboardMutationSource,
    AbilityEntitySpawnPayload,
    BuffBlackboardReadSource,
    BuffFinishSource,
    BuffHoldSource,
    DamageUnitSource,
    EntityBlackboardAssignmentSource,
    ResourceGainPayload,
    ScalarSource,
    TimedDamageSource,
    TimedMarkerGateSource,
    TimedResourceGainSource,
    ConditionalActionSource,
    ConditionalBranchActionSource,
    classify_buff,
    derive_timeline_block,
    parse_scalar,
    parse_direct_damage_hits,
    parse_interval_damage_hits,
    parse_damage_units,
    parse_inflictions,
    parse_panel_attributes,
    parse_declared_blackboard,
    parse_auxiliary_actions,
    parse_buff_attribute_modifiers,
    parse_buff_lifecycle,
    parse_blackboard_calculations,
    parse_blackboard_runtime_actions,
    parse_buff_hold_actions,
    parse_conditional_actions,
    parse_projectile_launches,
    parse_resource_gains,
    filter_once_resource_gains,
    resolve_projectile_hits,
    resolve_ability_entity_hits,
    guaranteed_ability_entity_spawns,
    is_single_enemy_ability_entity_projection,
    resolve_buff_definitions,
    resolve_operator_buff_definitions,
    parse_skill_patch,
    compile_buff_blackboard_read,
    compile_buff_finish,
    compile_buff_hold,
    compile_buff_application,
    percentage_values,
    ts_inline_literal,
    typescript_identifier,
    validate_skill_groups,
    walk_actions,
    walk_single_enemy_actions,
    walk_unconditional_actions,
)


class GenerateNextOperatorsTests(unittest.TestCase):
    def test_guaranteed_ability_entity_projection_accepts_target_routing_only(self) -> None:
        spawn = AbilityEntitySpawnPayload("entity.test", "skill.test")
        mutation = BlackboardMutationPayload(
            "target_in_range", "Assign", ScalarSource(1, None, None)
        )
        condition = ConditionalActionSource(
            startFrame=3,
            endFrame=3,
            actionIndex=11,
            actionPath=("timelineActions[0]",),
            conditions=(),
            succeedActions=(
                ConditionalBranchActionSource("SpawnAbilityEntity", 0, abilityEntitySpawn=spawn),
                ConditionalBranchActionSource(
                    "ModifyDynamicBlackboard", 1, blackboardMutation=mutation
                ),
            ),
            failActions=(
                ConditionalBranchActionSource("SpawnAbilityEntity", 0, abilityEntitySpawn=spawn),
            ),
        )

        self.assertEqual(guaranteed_ability_entity_spawns(condition), (spawn,))
        self.assertTrue(is_single_enemy_ability_entity_projection(condition))

    def test_guaranteed_ability_entity_projection_rejects_divergent_or_combat_side_effects(self) -> None:
        first = AbilityEntitySpawnPayload("entity.first", "skill.first")
        second = AbilityEntitySpawnPayload("entity.second", "skill.second")
        divergent = ConditionalActionSource(
            3,
            3,
            11,
            ("divergent",),
            (),
            (ConditionalBranchActionSource("SpawnAbilityEntity", 0, abilityEntitySpawn=first),),
            (ConditionalBranchActionSource("SpawnAbilityEntity", 0, abilityEntitySpawn=second),),
        )
        extra_mutation = ConditionalActionSource(
            3,
            3,
            12,
            ("extra",),
            (),
            (
                ConditionalBranchActionSource("SpawnAbilityEntity", 0, abilityEntitySpawn=first),
                ConditionalBranchActionSource(
                    "ModifyDynamicBlackboard",
                    1,
                    blackboardMutation=BlackboardMutationPayload(
                        "combat_value", "Assign", ScalarSource(1, None, None)
                    ),
                ),
            ),
            (ConditionalBranchActionSource("SpawnAbilityEntity", 0, abilityEntitySpawn=first),),
        )

        self.assertEqual(guaranteed_ability_entity_spawns(divergent), ())
        self.assertFalse(is_single_enemy_ability_entity_projection(divergent))
        self.assertEqual(guaranteed_ability_entity_spawns(extra_mutation), (first,))
        self.assertFalse(is_single_enemy_ability_entity_projection(extra_mutation))

    def test_single_enemy_walker_flattens_supported_foreach_and_single_tick_channel(self) -> None:
        damage = {"$type": "Example.DamageAction, Example"}
        channel = {
            "$type": "Example.ChannelingAction, Example",
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 2,
            "targetSettings": {},
            "executeEachFrame": True,
            "triggerInterval": 0.033,
            "maxCountPerTarget": 1,
            "targetTriggerInterval": 0,
            "actionOnTick": damage,
        }
        foreach = {
            "$type": "Example.ForEachAction, Example",
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 1,
            "target": {"targetSource": "Context", "targetGroupKey": "targets"},
            "action": channel,
        }

        self.assertEqual(list(walk_single_enemy_actions(foreach, "skill")), [damage])

        invalid = dict(channel, maxCountPerTarget=2)
        with self.assertRaisesRegex(ValueError, "only one trigger per target"):
            list(walk_single_enemy_actions(invalid, "skill"))

    def test_timed_marker_gate_keeps_only_the_first_ability_entity_hit(self) -> None:
        gate = TimedMarkerGateSource("marker_key", True, 0.4)
        damage = TimedDamageSource(3, 4, 4, (SimpleNamespace(),), gate)

        def entity(spawn_frame: int, order: int) -> SimpleNamespace:
            return SimpleNamespace(
                spawnFrame=spawn_frame,
                actionOrder=(order,),
                skillId=f"child{order}",
                directDamageHits=(damage,),
                entityBlackboardAssignments=(
                    EntityBlackboardAssignmentSource(
                        "marker_key", "String", 0, "shared-hit-marker"
                    ),
                ),
                projectileHits=(),
                nestedAbilityEntityHits=(),
            )

        skill = SimpleNamespace(
            skillId="root",
            directDamageHits=(),
            projectileHits=(),
            abilityEntityHits=(entity(12, 11), entity(13, 23)),
        )

        hits = collect_resolved_damage_hits(skill)

        self.assertEqual([(hit.frame, hit.actionOrder) for hit in hits], [(15, (11, 4))])

    def test_timed_marker_gate_parser_requires_matching_blackboard_keys(self) -> None:
        condition = {
            "$type": "Example.CheckTimedMarkerCondition+Data, Example",
            "isEnable": True,
            "checkTarget": {"targetSource": "Target"},
            "useBlackboardKey": True,
            "blackboardKey": "marker_key",
            "returnTrueIfNotExists": True,
        }
        damage = {"$type": "Example.DamageAction+Data, Example", "isEnable": True}
        create = {
            "$type": "Example.CreateTimedMarker+Data, Example",
            "isEnable": True,
            "markerId": {"useBlackboardKey": True, "blackboardKey": "marker_key"},
            "duration": {"useBlackboardKey": False, "value": 0.4},
        }
        root = {
            "$type": "Example.ForEachAction+Data, Example",
            "action": {"actionData": [condition, damage, create]},
        }

        gates = collect_timed_marker_damage_gates(root, "skill")

        self.assertEqual(gates[id(damage)], TimedMarkerGateSource("marker_key", True, 0.4))

        create["markerId"]["blackboardKey"] = "other_key"
        with self.assertRaisesRegex(ValueError, "unsupported timed marker damage gate"):
            collect_timed_marker_damage_gates(root, "skill")

    def test_extend_buff_action_preserves_exact_native_interval_and_identity(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 22,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.ExtendBuffAction+Data, Example",
                                    "isEnable": True,
                                    "priorityLevel": "Default",
                                    "priorityOffset": 0,
                                    "serverActionIndex": 10,
                                    "buffOwner": {
                                        "targetSource": "Source",
                                        "targetGroupKey": "",
                                    },
                                    "buffSettings": {
                                        "checkType": "Id",
                                        "buffIdList": ["buff.ultimate.base"],
                                        "tagQuery": {"queryType": "HasAny", "tags": []},
                                    },
                                }
                            ]
                        },
                    }
                ]
            }
        }

        holds = parse_buff_hold_actions(root, "fixture.json")

        self.assertEqual(
            holds,
            (
                BuffHoldSource(
                    startFrame=0,
                    endFrame=22,
                    actionIndex=10,
                    targetSource="Source",
                    targetGroupKey="",
                    buffCheckType="Id",
                    buffIds=("buff.ultimate.base",),
                    tagQueryType="hasAny",
                    buffTagIds=(),
                ),
            ),
        )
        self.assertIn("holdBuffsById", compile_buff_hold(holds[0], "fixture.hold"))

    def test_buff_application_compiler_preserves_inherited_cast_identity(self) -> None:
        action = AuxiliaryActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=0,
            actionType="CreateBuffAction",
            sourceId="buff_fixture",
            classification=None,
            targetSource="Source",
            targetGroupKey="",
            count=ScalarSource(1, None, None),
            buffSource="ActionSource",
            inheritSourceSkillCastInfo=True,
            blackboardAssignments={},
            nestedCombatActions=(),
        )

        source = compile_buff_application(action, "fixture")

        self.assertIn("inheritSourceSkillCastInfo: true", source)

    def test_buff_reference_inventory_includes_conditional_branches(self) -> None:
        root = {
            "actionGroupData": {
                "actions": [
                    {
                        "$type": "Example.IfElseAction+Data, Example",
                        "conditionAction": {"actionData": []},
                        "succeedActions": {
                            "actionData": [
                                {
                                    "$type": "Example.CreateBuffAction+Data, Example",
                                    "buffs": [{"buffId": "buff.branch", "assignItems": []}],
                                }
                            ]
                        },
                        "failActions": {"actionData": []},
                    },
                    {
                        "$type": "Example.CreateBuffAction+Data, Example",
                        "buffs": [{"buffId": "buff.root", "assignItems": []}],
                    },
                ]
            }
        }

        self.assertEqual(
            collect_referenced_buff_ids(root, "skill.json"),
            ("buff.branch", "buff.root"),
        )

    def test_buff_definitions_do_not_use_application_overrides(self) -> None:
        buff = {
            "lifeType": "Limited",
            "duration": {
                "useBlackboardKey": True,
                "value": 1,
                "blackboardKey": "duration",
            },
            "triggerInterval": {
                "useBlackboardKey": False,
                "value": -1,
                "blackboardKey": "",
            },
            "waitFirstTriggerInterval": False,
            "maxTriggerCnt": {
                "useBlackboardKey": False,
                "value": 1,
                "blackboardKey": "",
            },
            "stackingSettings": {
                "identifierType": "Id",
                "stackingType": "Unique",
                "stackingKey": "",
                "usePriorityKey": False,
                "priorityKey": "",
                "negatePriority": False,
                "priority": 0,
                "useMaxStackCntKey": False,
                "maxStackCntKey": "",
                "maxStackCnt": 1,
                "isNeedStackEffect": False,
            },
            "blackboard": [
                {
                    "key": "duration",
                    "valueDouble": 3,
                    "valueStr": "",
                    "isDynamic": True,
                }
            ],
            "attributeModifier": {
                "isConvertedAttribute": False,
                "attributeModifiers": [
                    {
                        "modifyAttributeType": "Specific",
                        "attributeType": "ComboSkillCooldownRecoveryScalar",
                        "formulaItem": "BaseMultiplier",
                        "param": {
                            "useBlackboardKey": False,
                            "value": 0.5,
                            "blackboardKey": "",
                        },
                    }
                ],
            },
            "applyTags": [{"tagId": -1486085048}],
            "timelineActions": [],
            "buffEventAction": [],
        }
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            (path / "buff.test.json").write_text(json.dumps(buff), encoding="utf-8")
            definitions = resolve_buff_definitions(("buff.missing", "buff.test"), path)

        self.assertFalse(definitions[0].sourceAvailable)
        self.assertIsNone(definitions[0].lifecycle)
        self.assertTrue(definitions[1].sourceAvailable)
        assert definitions[1].lifecycle is not None
        self.assertEqual(definitions[1].lifecycle.duration.levelValues, (3.0,))
        self.assertEqual(definitions[1].blackboard[0].key, "duration")
        self.assertEqual(definitions[1].applyTagIds, (-1486085048,))
        self.assertEqual(
            definitions[1].attributeModifiers[0].attributeType,
            "ComboSkillCooldownRecoveryScalar",
        )
        self.assertEqual(definitions[1].attributeModifiers[0].slot, "BaseMultiplier")
        self.assertEqual(definitions[1].attributeModifiers[0].value.value, 0.5)
        self.assertEqual(definitions[1].combatActions, ())
        self.assertEqual(definitions[1].unparsedPayloads, ())

    def test_buff_definitions_parse_ability_events_and_report_other_root_payloads(self) -> None:
        buff = {
            "lifeType": "Infinity",
            "duration": {
                "useBlackboardKey": False,
                "value": 0,
                "blackboardKey": "",
            },
            "triggerInterval": {
                "useBlackboardKey": False,
                "value": -1,
                "blackboardKey": "",
            },
            "waitFirstTriggerInterval": False,
            "maxTriggerCnt": {
                "useBlackboardKey": False,
                "value": 1,
                "blackboardKey": "",
            },
            "stackingSettings": {
                "identifierType": "Id",
                "stackingType": "Unlimited",
                "stackingKey": "",
                "usePriorityKey": False,
                "priorityKey": "",
                "negatePriority": False,
                "priority": 0,
                "useMaxStackCntKey": False,
                "maxStackCntKey": "",
                "maxStackCnt": 1,
                "isNeedStackEffect": False,
            },
            "blackboard": [],
            "attributeModifier": {
                "isConvertedAttribute": False,
                "attributeModifiers": [],
            },
            "applyTags": [],
            "timelineActions": [],
            "buffEventAction": [],
            "abilityEventAction": [
                {"abilityEvent": "OnAddedBuff", "actions": []},
                {"abilityEvent": "OnOwnerHpZero", "actions": []},
            ],
            "damageModifier": [],
            "tagsAfterTriggerExtendBuffAction": [{"tagId": 123}],
        }
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            (path / "buff.test.json").write_text(json.dumps(buff), encoding="utf-8")
            definition = resolve_buff_definitions(("buff.test",), path)[0]

        self.assertEqual(
            tuple((item.field, item.entryCount) for item in definition.unparsedPayloads),
            (),
        )
        self.assertEqual(
            tuple((item.eventSource, item.event) for item in definition.eventActions),
            (("ability", "OnAddedBuff"), ("ability", "OnOwnerHpZero")),
        )
        self.assertEqual(definition.extendTagIds, (123,))

    def test_buff_definitions_follow_event_dependencies_once(self) -> None:
        def buff(buff_id: str, child_id: str | None) -> dict[str, object]:
            actions = []
            if child_id is not None:
                actions.append(
                    {
                        "$type": "Example.CreateBuffAction+Data, Example",
                        "buffs": [{"buffId": child_id, "assignItems": []}],
                    }
                )
            return {
                "id": buff_id,
                "lifeType": "Infinity",
                "duration": {
                    "useBlackboardKey": False,
                    "value": 0,
                    "blackboardKey": "",
                },
                "triggerInterval": {
                    "useBlackboardKey": False,
                    "value": -1,
                    "blackboardKey": "",
                },
                "waitFirstTriggerInterval": False,
                "maxTriggerCnt": {
                    "useBlackboardKey": False,
                    "value": 1,
                    "blackboardKey": "",
                },
                "stackingSettings": {
                    "identifierType": "Id",
                    "stackingType": "Unlimited",
                    "stackingKey": "",
                    "usePriorityKey": False,
                    "priorityKey": "",
                    "negatePriority": False,
                    "priority": 0,
                    "useMaxStackCntKey": False,
                    "maxStackCntKey": "",
                    "maxStackCnt": 1,
                    "isNeedStackEffect": False,
                },
                "blackboard": [],
                "attributeModifier": {
                    "isConvertedAttribute": False,
                    "attributeModifiers": [],
                },
                "applyTags": [],
                "timelineActions": [],
                "buffEventAction": [{"buffEvent": "OnBuffStart", "actions": actions}],
            }

        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            (path / "buff.parent.json").write_text(
                json.dumps(buff("buff.parent", "buff.child")), encoding="utf-8"
            )
            (path / "buff.child.json").write_text(
                json.dumps(buff("buff.child", "buff.parent")), encoding="utf-8"
            )
            definitions = resolve_buff_definitions(("buff.parent",), path)

        self.assertEqual(
            tuple(definition.buffId for definition in definitions),
            ("buff.child", "buff.parent"),
        )
        parent = next(
            definition for definition in definitions if definition.buffId == "buff.parent"
        )
        child = next(
            definition for definition in definitions if definition.buffId == "buff.child"
        )
        self.assertEqual(parent.eventActions[0].createdBuffIds, ("buff.child",))
        self.assertEqual(child.eventActions[0].createdBuffIds, ("buff.parent",))

    def test_operator_buff_definitions_merge_skill_references_once(self) -> None:
        skills = (
            SimpleNamespace(referencedBuffIds=("buff.second", "buff.first")),
            SimpleNamespace(referencedBuffIds=("buff.first",)),
        )
        with tempfile.TemporaryDirectory() as directory:
            definitions = resolve_operator_buff_definitions(skills, Path(directory))

        self.assertEqual(
            tuple(definition.buffId for definition in definitions),
            ("buff.first", "buff.second"),
        )
        self.assertTrue(all(not definition.sourceAvailable for definition in definitions))

    def test_buff_attribute_modifiers_reject_unknown_formula_slot(self) -> None:
        buff = {
            "attributeModifier": {
                "isConvertedAttribute": False,
                "attributeModifiers": [
                    {
                        "modifyAttributeType": "Specific",
                        "attributeType": "Atk",
                        "formulaItem": "FutureSlot",
                        "param": {
                            "useBlackboardKey": False,
                            "value": 1,
                            "blackboardKey": "",
                        },
                    }
                ],
            }
        }

        with self.assertRaisesRegex(ValueError, "formulaItem: unsupported value"):
            parse_buff_attribute_modifiers(buff, "buff.test.json", {})

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
                                                "targetSettings": {
                                                    "targetSource": "Source",
                                                    "targetGroupKey": "",
                                                },
                                                "count": {
                                                    "useBlackboardKey": False,
                                                    "value": 1,
                                                    "blackboardKey": "",
                                                },
                                                "buffSource": "ActionSource",
                                                "inheritSourceSkillCastInfo": True,
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
                                                "atbSourceType": "Skill",
                                                "atbGainMethod": "Return",
                                                "atbOnlyMainChar": False,
                                                "isPercentValue": False,
                                                "useUspRecoverTag": False,
                                                "uspRecoverTag": {"tagId": 0},
                                                "ignoreUspGainScalar": False,
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
        self.assertEqual(actions[0].buffApplication.targetSource, "Source")
        self.assertEqual(actions[0].buffApplication.count.value, 1)
        self.assertTrue(actions[0].buffApplication.inheritSourceSkillCastInfo)
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

    def test_conditional_action_compiler_omits_fully_ignored_buff_branch(self) -> None:
        condition = SimpleNamespace(
            sourceType="CompareFloat",
            comparison="GE",
            left=ScalarSource(1, None, None),
            right=ScalarSource(1, None, None),
            buffStack=None,
        )
        buff = SimpleNamespace(buffId="buff.visual", blackboardAssignments={})
        application = SimpleNamespace(
            buffs=(buff,),
            targetSource="Source",
            targetGroupKey="",
            count=ScalarSource(1, None, None),
            buffSource="ActionSource",
            inheritSourceSkillCastInfo=True,
        )
        action = SimpleNamespace(
            conditions=(condition,),
            succeedActions=(
                SimpleNamespace(
                    actionType="CreateBuffAction",
                    nestedCondition=None,
                    buffApplication=application,
                ),
            ),
            failActions=(),
        )

        result = compile_conditional_action(
            action,
            "fixture.condition",
            frozenset({"buff.visual"}),
        )

        self.assertEqual(result, "sequence()")

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
                    resourceGain=None,
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

    def test_conditional_action_compiler_emits_dynamic_resource_gain(self) -> None:
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
                    actionType="ObtainCostAction",
                    nestedCondition=None,
                    blackboardCalculation=None,
                    blackboardMutation=None,
                    buffBlackboardRead=None,
                    buffFinish=None,
                    resourceGain=ResourceGainPayload(
                        resource="sp",
                        amount=ScalarSource(None, "atbReturn", None),
                        coefficient=ScalarSource(1, None, None),
                        spGainKind="refund",
                        spGainSource="skill",
                        onlyMainOperator=False,
                        isPercentValue=False,
                        useUltimateRecoveryTag=False,
                        ultimateRecoveryTagId=0,
                        ignoreUltimateGainScalar=False,
                    ),
                ),
            ),
            failActions=(),
        )

        result = compile_conditional_action(action, "fixture.condition")

        self.assertIn("changeResourceByActionValue", result)
        self.assertIn("amount: { kind: 'blackboard', key: 'atbReturn' }", result)
        self.assertIn("spGainKind: 'refund'", result)
        self.assertIn("spGainSource: 'skill'", result)

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
                    resourceGain=None,
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
            auxiliaryActions=(
                SimpleNamespace(
                    startFrame=0,
                    actionIndex=1,
                    actionType="CreateBuffAction",
                    sourceId="input_lock",
                    classification="inputLock",
                    targetSource="Owner",
                    targetGroupKey="",
                    count=ScalarSource(1, None, None),
                    buffSource="ActionSource",
                    inheritSourceSkillCastInfo=True,
                    blackboardAssignments={},
                ),
            ),
            resourceGains=(SimpleNamespace(amount=ScalarSource(0, "unused", (0, 0))),),
            inflictions=(),
            projectileLaunches=(),
            conditionalActions=(),
            blackboardCalculations=(),
            blackboardMutations=(),
            buffBlackboardReads=(),
            buffFinishes=(),
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

    def test_resolved_sequence_compiles_non_damage_skill_cost_and_cooldown(self) -> None:
        skill = SimpleNamespace(
            key="ultimate",
            timelineBlockFrames=20,
            patch=SimpleNamespace(
                cooldownSeconds=(15,) * 12,
                costValues=(240,) * 12,
            ),
            costFrame=2,
            auxiliaryActions=(
                AuxiliaryActionSource(
                    startFrame=3,
                    endFrame=3,
                    actionIndex=0,
                    actionType="CreateBuffAction",
                    sourceId="buff.fixture.ultimate",
                    classification=None,
                    targetSource="Source",
                    targetGroupKey="",
                    count=ScalarSource(1, None, None),
                    buffSource="ActionSource",
                    inheritSourceSkillCastInfo=True,
                    blackboardAssignments={},
                    nestedCombatActions=(),
                ),
            ),
            resourceGains=(),
            inflictions=(),
            projectileLaunches=(),
            conditionalActions=(),
            blackboardCalculations=(),
            blackboardMutations=(),
            buffBlackboardReads=(),
            buffFinishes=(),
            buffHolds=(
                BuffHoldSource(
                    startFrame=0,
                    endFrame=18,
                    actionIndex=1,
                    targetSource="Source",
                    targetGroupKey="",
                    buffCheckType="Id",
                    buffIds=("buff.fixture.ultimate",),
                    tagQueryType="hasAny",
                    buffTagIds=(),
                ),
            ),
            unresolvedCombatActions=("CreateBuffAction",),
            skillId="fixture.ultimate",
            directDamageHits=(),
            projectileHits=(),
            abilityEntityHits=(),
        )

        source = compile_resolved_sequence(
            skill,
            {
                "usePatchCooldown": True,
                "costResource": "ultimateEnergy",
            },
            require_damage=False,
        )

        self.assertIn("cooldownFrames: 450", source)
        self.assertIn("costs: [{ resource: 'ultimateEnergy', value: 240 }]", source)
        self.assertIn("costFrame: 2", source)
        self.assertIn("scheduled(\n        3,", source)
        self.assertIn("buffId: 'buff.fixture.ultimate'", source)
        self.assertIn("step('holdBuffsById'", source)
        self.assertIn("        18,\n      ),", source)

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
            auxiliaryActions=(),
            resourceGains=(),
            inflictions=(),
            projectileLaunches=(),
            conditionalActions=(condition,),
            blackboardCalculations=(),
            blackboardMutations=(),
            buffBlackboardReads=(),
            buffFinishes=(),
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

    def test_resolved_damage_compiler_interleaves_supported_root_actions(self) -> None:
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
            auxiliaryActions=(
                AuxiliaryActionSource(
                    startFrame=12,
                    endFrame=12,
                    actionIndex=5,
                    actionType="CreateBuffAction",
                    sourceId="buff_fixture",
                    classification=None,
                    targetSource="Source",
                    targetGroupKey="",
                    count=ScalarSource(1, None, None),
                    buffSource="ActionSource",
                    inheritSourceSkillCastInfo=True,
                    blackboardAssignments={
                        "duration": ScalarSource(0, "duration", (25, 25)),
                    },
                    nestedCombatActions=(),
                ),
            ),
            resourceGains=(
                SimpleNamespace(
                    startFrame=12,
                    endFrame=12,
                    actionIndex=1,
                    resource="sp",
                    amount=ScalarSource(5, None, (5,)),
                    coefficient=ScalarSource(1, None, None),
                    spGainKind="gain",
                    spGainSource="normalAttack",
                    onlyMainOperator=True,
                    isPercentValue=False,
                    useUltimateRecoveryTag=False,
                    ultimateRecoveryTagId=0,
                    ignoreUltimateGainScalar=False,
                ),
            ),
            inflictions=(
                SimpleNamespace(
                    startFrame=12,
                    endFrame=12,
                    actionIndex=0,
                    element="heat",
                    isExtra=False,
                ),
            ),
            projectileLaunches=(),
            conditionalActions=(),
            blackboardCalculations=(
                SimpleNamespace(
                    startFrame=12,
                    actionIndex=6,
                    key="attackScale",
                    operation="Multiply",
                    left=ScalarSource(None, "baseScale", None),
                    right=ScalarSource(1.5, None, None),
                ),
            ),
            blackboardMutations=(
                BlackboardMutationSource(
                    startFrame=12,
                    endFrame=12,
                    actionIndex=2,
                    key="count",
                    operation="Add",
                    value=ScalarSource(1, None, None),
                ),
            ),
            buffBlackboardReads=(
                BuffBlackboardReadSource(
                    startFrame=12,
                    endFrame=12,
                    actionIndex=3,
                    outputKey="buffScale",
                    desiredKey="scale",
                    targetSource="Context",
                    targetGroupKey="smart_target",
                    buffCheckType="Tag",
                    buffIds=(),
                    tagQueryType="hasAny",
                    buffTagIds=(100,),
                ),
            ),
            buffFinishes=(
                BuffFinishSource(
                    startFrame=12,
                    endFrame=12,
                    actionIndex=4,
                    targetSource="Context",
                    targetGroupKey="smart_target",
                    buffCheckType="Tag",
                    buffIds=(),
                    tagQueryType="hasAny",
                    buffTagIds=(100,),
                    finishAll=True,
                    limitSource=False,
                    isFinishedEarly=True,
                    isAbsorbed=False,
                ),
            ),
            unresolvedCombatActions=(
                "FinishBuffAdvanced",
                "GetTargetBuffBBAdvanced",
                "CreateBuffAction",
                "ModifyDynamicBlackboard",
                "ObtainCostAction",
                "SimpleCalcBBAction",
                "SpellInfliction",
                "SpawnAbilityEntity",
            ),
            skillId="root",
            directDamageHits=(),
            projectileHits=(),
            abilityEntityHits=(
                SimpleNamespace(
                    spawnFrame=12,
                    actionOrder=(7,),
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

        self.assertIn("resource: 'sp', amount: 5, recipient: 'team'", source)
        ordered_markers = [
            "applyElementalInfliction",
            "changeResource",
            "modifyActionValue",
            "readBuffBlackboard",
            "finishBuffsByTag",
            "step('applyBuff'",
            "calculateActionValue",
            "step('dealDamage'",
        ]
        self.assertEqual(
            [source.index(marker) for marker in ordered_markers],
            sorted(source.index(marker) for marker in ordered_markers),
        )
        self.assertIn("buffId: 'buff_fixture'", source)
        self.assertIn("target: 'caster'", source)
        self.assertIn("'duration': { kind: 'blackboard', key: 'duration' }", source)

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

    def test_buff_event_slots_keep_their_trigger_and_created_buff_references(self) -> None:
        buff = {
            "lifeType": "Limited",
            "duration": {
                "useBlackboardKey": False,
                "value": 3,
                "blackboardKey": "duration",
            },
            "triggerInterval": {
                "useBlackboardKey": True,
                "value": 0.2,
                "blackboardKey": "interval",
            },
            "waitFirstTriggerInterval": True,
            "maxTriggerCnt": {
                "useBlackboardKey": False,
                "value": 5,
                "blackboardKey": "",
            },
            "stackingSettings": {
                "identifierType": "Id",
                "stackingType": "Stack",
                "stackingKey": "",
                "usePriorityKey": False,
                "priorityKey": "",
                "negatePriority": False,
                "priority": 0,
                "useMaxStackCntKey": True,
                "maxStackCntKey": "max_stack",
                "maxStackCnt": 1,
                "isNeedStackEffect": False,
            },
            "blackboard": [
                {
                    "key": "interval",
                    "valueDouble": 0.3,
                    "valueStr": "",
                    "isDynamic": False,
                },
                {
                    "key": "max_stack",
                    "valueDouble": 4,
                    "valueStr": "",
                    "isDynamic": False,
                },
            ],
            "attributeModifier": {
                "isConvertedAttribute": False,
                "attributeModifiers": [],
            },
            "applyTags": [],
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
            definitions = resolve_buff_definitions(("parent_buff",), path)

        parent = next(
            definition for definition in definitions if definition.buffId == "parent_buff"
        )
        event = parent.eventActions[0]
        lifecycle = parent.lifecycle
        self.assertIsNotNone(lifecycle)
        assert lifecycle is not None
        self.assertEqual(lifecycle.lifeType, "Limited")
        self.assertEqual(lifecycle.duration.value, 3)
        self.assertEqual(lifecycle.triggerInterval.blackboardKey, "interval")
        self.assertEqual(lifecycle.triggerInterval.levelValues, (0.3,))
        self.assertTrue(lifecycle.waitFirstTriggerInterval)
        self.assertEqual(lifecycle.maxTriggerCount.value, 5)
        self.assertEqual(lifecycle.stackingType, "Stack")
        self.assertEqual(lifecycle.maxStackCount.blackboardKey, "max_stack")
        self.assertEqual(lifecycle.maxStackCount.levelValues, (4.0,))
        self.assertEqual(event.eventSource, "buff")
        self.assertEqual(event.event, "OnBuffTrigger")
        self.assertEqual(event.orderedActionTypes, ("CreateBuffAction",))
        self.assertEqual(event.combatActions, ("CreateBuffAction",))
        self.assertEqual(event.createdBuffIds, ("child_buff",))

    def test_buff_ability_event_actions_preserve_source_and_order(self) -> None:
        buff = {
            "lifeType": "Infinity",
            "duration": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
            "triggerInterval": {
                "useBlackboardKey": False,
                "value": -1,
                "blackboardKey": "",
            },
            "waitFirstTriggerInterval": False,
            "maxTriggerCnt": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
            "stackingSettings": {
                "identifierType": "Id",
                "stackingType": "Stack",
                "stackingKey": "",
                "usePriorityKey": False,
                "priorityKey": "",
                "negatePriority": False,
                "priority": 0,
                "useMaxStackCntKey": False,
                "maxStackCntKey": "",
                "maxStackCnt": 1,
                "isNeedStackEffect": False,
            },
            "blackboard": [],
            "attributeModifier": {
                "isConvertedAttribute": False,
                "attributeModifiers": [],
            },
            "applyTags": [],
            "timelineActions": [],
            "buffEventAction": [],
            "abilityEventAction": [
                {
                    "abilityEvent": "OnOwnerHpZero",
                    "actions": [
                        {
                            "actionData": [
                                {
                                    "$type": "Example.CompareFloat+Data, Example",
                                    "serverActionIndex": 0,
                                    "isEnable": True,
                                },
                                {
                                    "$type": "Example.CreateBuffAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "isEnable": False,
                                    "buffs": [],
                                },
                                {
                                    "$type": "Example.SpawnAbilityEntity+Data, Example",
                                    "serverActionIndex": 2,
                                    "isEnable": True,
                                },
                            ]
                        }
                    ],
                }
            ],
        }
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            (path / "ability_event_buff.json").write_text(json.dumps(buff), encoding="utf-8")
            definition = resolve_buff_definitions(("ability_event_buff",), path)[0]

        self.assertEqual(definition.unparsedPayloads, ())
        self.assertEqual(len(definition.eventActions), 1)
        event = definition.eventActions[0]
        self.assertEqual(event.eventSource, "ability")
        self.assertEqual(event.event, "OnOwnerHpZero")
        self.assertEqual(event.orderedActionTypes, ("CompareFloat", "SpawnAbilityEntity"))

    def test_buff_lifecycle_rejects_unknown_stacking_type(self) -> None:
        buff = {
            "lifeType": "Infinity",
            "duration": {"useBlackboardKey": False, "value": 0, "blackboardKey": ""},
            "triggerInterval": {
                "useBlackboardKey": False,
                "value": -1,
                "blackboardKey": "",
            },
            "waitFirstTriggerInterval": False,
            "maxTriggerCnt": {
                "useBlackboardKey": False,
                "value": 1,
                "blackboardKey": "",
            },
            "stackingSettings": {
                "identifierType": "Id",
                "stackingType": "FutureUnknownType",
                "stackingKey": "",
                "usePriorityKey": False,
                "priorityKey": "",
                "negatePriority": False,
                "priority": 0,
                "useMaxStackCntKey": False,
                "maxStackCntKey": "",
                "maxStackCnt": 1,
                "isNeedStackEffect": False,
            },
        }

        with self.assertRaisesRegex(ValueError, "unsupported value 'FutureUnknownType'"):
            parse_buff_lifecycle(buff, "unknown_buff.json", {})

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
                            "atbSourceType": "NormalAttack",
                            "atbGainMethod": "Gain",
                            "atbOnlyMainChar": True,
                            "isPercentValue": False,
                            "useUspRecoverTag": False,
                            "uspRecoverTag": {"tagId": 0},
                            "ignoreUspGainScalar": False,
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
        self.assertEqual(hits[0].resourceGains[0].spGainKind, "gain")
        self.assertEqual(hits[0].resourceGains[0].spGainSource, "normalAttack")
        self.assertTrue(hits[0].resourceGains[0].onlyMainOperator)

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
                                    "atbSourceType": "Default",
                                    "atbGainMethod": "Gain",
                                    "atbOnlyMainChar": False,
                                    "isPercentValue": False,
                                    "useUspRecoverTag": False,
                                    "uspRecoverTag": {"tagId": 0},
                                    "ignoreUspGainScalar": False,
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
        self.assertIsNone(gains[0].spGainKind)
        self.assertIsNone(gains[0].spGainSource)
        self.assertFalse(gains[0].useUltimateRecoveryTag)

    def test_once_resource_gain_gate_matches_action_blackboard_sequence(self) -> None:
        gain = {"$type": "Example.ObtainCostAction+Data, Example"}
        actions = [
            {
                "$type": "Example.CheckEntityNum+Data, Example",
                "checkTarget": {"targetSource": "Context", "targetGroupKey": "tar"},
                "minNum": 1,
                "compareType": "GE",
            },
            {
                "$type": "Example.CompareFloat+Data, Example",
                "valueA": {"useBlackboardKey": True, "blackboardKey": "hasGainAtb"},
                "valueB": {"useBlackboardKey": False, "value": 0},
                "compare": "Equals",
            },
            gain,
            {
                "$type": "Example.ModifyDynamicBlackboard+Data, Example",
                "key": "hasGainAtb",
                "operation": "Assign",
                "directValue": True,
                "value": {"useBlackboardKey": False, "value": 1},
            },
        ]

        gates = collect_once_resource_gain_gates({"actionData": actions}, "sequence")

        self.assertEqual(gates, {id(gain): "hasGainAtb"})

    def test_once_resource_gain_filter_keeps_first_gated_gain(self) -> None:
        def gain(frame: int, key: str | None) -> TimedResourceGainSource:
            return TimedResourceGainSource(
                startFrame=frame,
                endFrame=frame,
                actionIndex=frame,
                resource="sp",
                amount=ScalarSource(18, None, None),
                coefficient=ScalarSource(1, None, None),
                spGainKind="NormalAttack",
                spGainSource="Default",
                onlyMainOperator=False,
                isPercentValue=False,
                useUltimateRecoveryTag=False,
                ultimateRecoveryTagId=0,
                ignoreUltimateGainScalar=False,
                onceActionValueKey=key,
            )

        filtered = filter_once_resource_gains(
            (gain(0, "hasGainAtb"), gain(4, "hasGainAtb"), gain(8, "hasGainAtb"), gain(9, None))
        )

        self.assertEqual([item.startFrame for item in filtered], [0, 9])

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

    def test_interval_damage_projects_immediate_and_fixed_interval_ticks(self) -> None:
        def damage(action_index: int) -> dict[str, object]:
            return {
                "$type": "Example.DamageAction+Data, Example",
                "serverActionIndex": action_index,
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
            }

        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 9,
                        "_endFrame": 16,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.TickIntervalAction+Data, Example",
                                    "serverActionIndex": 8,
                                    "executeEachFrame": False,
                                    "tickInterval": 0.1,
                                    "tickIntervalBlackboardKey": "",
                                    "useTickIntervalBlackboardKey": False,
                                    "actionOnTick": {
                                        "actionData": [
                                            {"$type": "Example.PickTargetAction+Data, Example"},
                                            {
                                                "$type": "Example.IfElseAction+Data, Example",
                                                "succeedActions": {"actionData": [damage(14)]},
                                                "failActions": {"actionData": [damage(23)]},
                                            },
                                        ]
                                    },
                                }
                            ]
                        },
                    }
                ]
            }
        }

        hits = parse_interval_damage_hits(root, "skill.json", {"atk": (0.11, 0.25)})

        self.assertEqual(len(hits), 1)
        self.assertEqual(hits[0].tickFrames, (9, 12, 15))
        self.assertEqual(hits[0].intervalFrames, 3)
        self.assertEqual(hits[0].damageUnits[0].attackScale.levelValues, (0.11, 0.25))

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
