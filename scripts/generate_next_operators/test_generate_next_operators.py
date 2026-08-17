"""验证干员生成器最关键的派生规则和严格校验。"""

import unittest
import json
import struct
import tempfile
from dataclasses import replace
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from time_dilation_parser import parse_time_dilation_action, parse_time_scale_curve

from generate_next_operators import (
    ELEMENT_TYPE_MAP,
    collect_blackboard_keys,
    collect_conditional_blackboard_keys,
    collect_unresolved_combat_actions,
    collect_referenced_buff_ids,
    collect_resolved_damage_hits,
    collect_resolved_schedule,
    validate_unmodeled_buff_ids,
    root_skill_has_output_damage_before,
    is_presentation_only_camera_condition,
    root_target_group_writes_for_condition,
    resolve_latest_target_group_write_at,
    target_group_write_guarantees_single_enemy,
    target_group_write_ability_entity_collection_identity,
    collect_timed_marker_damage_gates,
    collect_consumed_root_timed_marker_action_ids,
    collect_once_resource_gain_gates,
    collect_runtime_blackboard_output_keys,
    build_blackboard_provenance,
    compile_skill_entries,
    compile_buff_application_values,
    parse_skill_event_listeners,
    compile_buff_stack_read,
    compile_resolved_damage_sequence,
    compile_resolved_sequence,
    compile_skill_event_listener,
    compile_time_dilation,
    event_listener_is_proven_noop,
    compile_resource_gain,
    compile_combat_condition,
    compile_combat_condition_group,
    compile_conditional_action,
    compile_immediate_projectile_children,
    compile_logical_ability_entity_spawn,
    ability_entity_child_buff_can_compile,
    ability_entity_child_finishes_are_terminal,
    ability_entity_child_timeline_can_compile,
    timeline_jump_can_compile,
    parse_timeline_jumps,
    compile_ability_entity_child_skill,
    compile_damage_units_step,
    encode_damage_step_key,
    encode_step_key_parts,
    collect_compilable_conditional_action_types,
    AuxiliaryActionSource,
    BlackboardCalculationPayload,
    BlackboardMutationPayload,
    BlackboardMutationSource,
    AbilityEntitySpawnPayload,
    AbilityEntityDurationAssignmentPayload,
    BuffBlackboardReadSource,
    BuffFinishSource,
    BuffHoldSource,
    BuffStackReadPayload,
    DamageUnitSource,
    ResolvedScheduleItemSource,
    EntityBlackboardAssignmentSource,
    ProjectileLaunchPayload,
    ProjectileSkillTriggerSource,
    ResourceGainPayload,
    ScalarSource,
    SkillPatchSource,
    TimedDamageSource,
    TimedInflictionSource,
    TimedMarkerGateSource,
    TimedResourceGainSource,
    TimedTimelineJumpSource,
    TargetGroupWriteSource,
    TargetGroupInputSource,
    ConditionalActionSource,
    ConditionalBranchActionSource,
    BuffFinishPayload,
    SkillEventActionSequenceSource,
    SkillEventListenerSource,
    SequenceGuardActionSource,
    UnconditionalActionSource,
    ConditionSource,
    EntityCountConditionSource,
    MainOperatorConditionSource,
    SkillHasHitConditionSource,
    InflictionPayload,
    classify_buff,
    derive_timeline_block,
    parse_scalar,
    parse_timeline,
    parse_time_dilations,
    parse_target_group_writes,
    parse_target_reference,
    parse_direct_damage_hits,
    parse_entity_blackboard_assignments,
    parse_interval_damage_hits,
    project_tick_interval_frames,
    parse_damage_units,
    parse_inflictions,
    parse_panel_attributes,
    parse_trust_attribute_bonus,
    parse_conversion_support,
    parse_declared_blackboard,
    parse_aura_actions,
    parse_auxiliary_actions,
    parse_buff_attribute_modifiers,
    parse_buff_application_payload,
    parse_buff_find_settings,
    parse_buff_lifecycle,
    parse_buff_source_death_finish,
    parse_blackboard_calculations,
    parse_blackboard_runtime_actions,
    parse_buff_hold_actions,
    parse_conditional_actions,
    parse_projectile_launch_payload,
    parse_projectile_launches,
    parse_resource_gains,
    project_channel_trigger_frames,
    project_single_enemy_channeling_timeline,
    require_level_values,
    resolve_skill_blackboard,
    resource_gain_can_change_value,
    filter_once_resource_gains,
    resolve_projectile_triggered_skills,
    select_projectile_triggers_for_single_enemy,
    resolve_conditional_projectile_triggers,
    resolve_conditional_aura_ability_entity_children,
    resolve_ability_entity_hits,
    guaranteed_ability_entity_spawns,
    mark_projected_conditional_children,
    guaranteed_projectile_projections,
    collect_projected_conditional_projectile_skills,
    is_single_enemy_ability_entity_projection,
    is_guaranteed_single_enemy_condition,
    is_projectile_trigger_excluded_for_single_enemy,
    resolve_buff_definitions,
    resolve_operator_buff_definitions,
    parse_skill_patch,
    parse_physical_inflictions,
    compile_buff_blackboard_read,
    compile_buff_finish,
    compile_buff_hold,
    compile_buff_application,
    percentage_values,
    ts_inline_literal,
    typescript_identifier,
    validate_skill_groups,
    parse_combo_skill_registrations,
    serialize_audit_value,
    walk_actions,
    walk_single_enemy_actions,
    walk_unconditional_actions,
)
from keyword_action_parser import parse_keyword_action, parse_timed_keyword_actions
from time_dilation_parser import parse_time_dilation_target


def target_settings_fixture(
    target_source: str,
    *,
    target_group_key: str = "",
    finder_type: str | None = None,
    validator_types: tuple[str, ...] = (),
) -> dict:
    selector = {
        "validatorData": [
            {"$type": f"Example.Selector+{validator_type}+Data, Example"}
            for validator_type in validator_types
        ],
        "postProcessorData": [],
    }
    if finder_type is not None:
        selector["finderData"] = {
            "$type": f"Example.Selector+{finder_type}+Data, Example"
        }
    return {
        "targetSource": target_source,
        "targetGroupKey": target_group_key,
        "selectorOwner": "ActionOwner",
        "ownerContextKey": "",
        "centerType": "ActionSource",
        "centerContextKey": "",
        "centerToGround": False,
        "selectorData": selector,
        "enableAdvancedDirection": False,
        "advancedDirection": {},
        "selectorDirection": "SourceForward",
        "target": "ActionSource",
        "targetContextKey": "",
    }


def slow_action_fixture(
    *,
    target: dict | None = None,
    duration: dict | None = None,
    rate: dict | None = None,
) -> dict:
    return {
        "$type": "Example.SlowAction+Data, Example",
        "isEnable": True,
        "priorityLevel": "Default",
        "priorityOffset": 0,
        "serverActionIndex": 7,
        "source": target_settings_fixture("Source"),
        "target": target or target_settings_fixture("Target"),
        "duration": duration
        or {
            "useBlackboardKey": False,
            "value": 3.1,
            "blackboardKey": "duration",
        },
        "rate": rate
        or {
            "useBlackboardKey": True,
            "value": 0,
            "blackboardKey": "move_speed_scalar",
        },
        "overrideChildBuffId": False,
        "childBuffId": {
            "useBlackboardKey": False,
            "value": "",
            "blackboardKey": "",
        },
        "asChildBuff": False,
        "enhancingList": [],
        "autoFinishByAction": False,
    }


def fracture_action_fixture() -> dict:
    target = target_settings_fixture("Context")
    target["targetGroupKey"] = "smart_target"
    return {
        "$type": "Example.FractureAction+Data, Example",
        "isEnable": True,
        "priorityLevel": "Default",
        "priorityOffset": 0,
        "serverActionIndex": 12,
        "attackerTargetSettings": target_settings_fixture("Owner"),
        "targetSettings": target,
        "blowOffDistance": {
            "useBlackboardKey": False,
            "value": 3,
            "blackboardKey": "",
        },
        "distanceRandomRange": {
            "useBlackboardKey": False,
            "value": 0,
            "blackboardKey": "",
        },
        "overwriteHeight": False,
        "blowOffHeight": {
            "useBlackboardKey": False,
            "value": 0,
            "blackboardKey": "",
        },
        "directionSettings": {
            "directionType": "SourceToTarget",
            "sourceMountPoint": "None",
            "targetMountPoint": "None",
            "customSourceAndTarget": False,
            "clampToXZ": True,
            "invertDirection": False,
        },
        "totalTime": {
            "useBlackboardKey": False,
            "value": 3,
            "blackboardKey": "",
        },
        "isExtra": False,
        "deadOption": "AllValid",
        "immobilizedTime": 0,
    }


def aura_action_fixture() -> dict:
    return {
        "$type": "Example.AuraAction+Data, Example",
        "isEnable": True,
        "priorityLevel": "Default",
        "priorityOffset": 0,
        "serverActionIndex": 7,
        "auraDebugName": "fixture",
        "auraType": "RangedAura",
        "auraRoot": target_settings_fixture("Owner"),
        "fixedWhenStart": False,
        "shapeData": {
            "_shape": "Sphere",
            "_rotationOffset": {"x": 0, "y": 0, "z": 0},
            "_useExtentKey": False,
            "_extent": {"x": 0, "y": 0, "z": 0},
            "_extentXKey": "",
            "_extentYKey": "",
            "_extentZKey": "",
            "_useCenterKey": False,
            "_center": {"x": 0, "y": 0, "z": 0},
            "_centerXKey": "",
            "_centerYKey": "",
            "_centerZKey": "",
            "_heightKey": "",
            "_height": 0,
            "_radiusKey": "",
            "_radius": 3,
        },
        "excludeColliderOptions": 0,
        "targetObjectType": 0,
        "targetFilter": {
            "checkAlive": True,
            "autoSetTargetFaction": True,
            "factionTarget": "Anti",
            "targetFactionType": 0,
            "filterObjectType": False,
            "objectType": "All",
            "filterSlot": False,
            "slotIndex": 0,
            "filterGameplayTag": False,
            "tagQuery": {"queryType": "HasAny", "tags": []},
        },
        "excludeOwner": True,
        "includeUnmarkable": False,
        "limitInfluenceCountPerTarget": False,
        "maxInfluenceCountPerTarget": 1,
        "buffSource": "ActionSource",
        "buffInput": [
            {
                "buffId": "buff.fixture",
                "assignBlackboard": False,
                "assignItems": [],
            }
        ],
        "overrideBuffIconDuration": False,
        "buffIconDurationSource": {
            "durationSourceType": "AbilityEntity",
            "timedMarkerId": "",
        },
        "inheritSourceSkillCastId": True,
        "actionInAura": {
            "actionData": [
                {
                    "$type": "Example.DamageAction+Data, Example",
                    "isEnable": True,
                }
            ],
            "onlyExecuteWhenSourceIsMainChar": False,
            "onlyExecuteWhenSourceIsGuard": False,
        },
        "actionWhenExitAura": {
            "actionData": [],
            "onlyExecuteWhenSourceIsMainChar": False,
            "onlyExecuteWhenSourceIsGuard": False,
        },
    }


def extract_step_key(source: str) -> str | None:
    """从编译产物中提取首个 dealDamage 步骤的 key 参数，供稳定性断言使用。"""
    marker = "step('dealDamage',"
    start = source.find(marker)
    if start < 0:
        return None
    opening = source.index("{", start)
    depth = 0
    for position in range(opening, len(source)):
        if source[position] == "{":
            depth += 1
        elif source[position] == "}":
            depth -= 1
            if depth == 0:
                closing = position
                break
    tail = source[closing + 1 :]
    key_start = tail.find("'")
    if key_start < 0:
        return None
    key_end = tail.find("'", key_start + 1)
    return tail[key_start + 1 : key_end]


class GenerateNextOperatorsTests(unittest.TestCase):
    def test_current_akedb_time_scale_curve_projection_is_preserved(self) -> None:
        curve = parse_time_scale_curve(
            [
                {
                    "time": 0,
                    "value": 0.25,
                    "inTangent": 0,
                    "outTangent": 0,
                    "inWeight": 0,
                    "outWeight": 0.333333343,
                    "weightedMode": 0,
                }
            ],
            "fixture.timeScaleCurve",
        )

        self.assertEqual(len(curve), 1)
        self.assertEqual((curve[0].time, curve[0].value), (0, 0.25))

        malformed = [
            {
                "time": 0,
                "value": 0.25,
                "inTangent": 0,
                "outTangent": 0,
                "inWeight": 0,
                "outWeight": 0.333333343,
                "weightedMode": 0,
                "tangentMode": 0,
            }
        ]
        with self.assertRaisesRegex(ValueError, "unexpected curve-key fields"):
            parse_time_scale_curve(malformed, "fixture.timeScaleCurve")

    def test_time_dilation_main_character_search_resolves_to_controlled(self) -> None:
        target = target_settings_fixture(
            "InstantSearch",
            finder_type="CharacterTeamFinder",
            validator_types=("MainCharacterValidator",),
        )

        self.assertEqual(
            parse_time_dilation_target(target, "fixture.ignoreTargets[0]"),
            "controlled",
        )

        target["selectorData"]["postProcessorData"] = [
            {"$type": "Example.Selector+ExcludeTarget+Data, Example"}
        ]
        with self.assertRaisesRegex(ValueError, "unsupported time-dilation target"):
            parse_time_dilation_target(target, "fixture.ignoreTargets[0]")

    def test_time_dilation_source_target_resolves_to_caster(self) -> None:
        source_target = target_settings_fixture("Source")
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 4,
                        "_endFrame": 14,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.TimeDilationAction+Data, Example",
                                    "isEnable": True,
                                    "priorityLevel": "Default",
                                    "priorityOffset": 0,
                                    "serverActionIndex": 3,
                                    "layer": "Entity",
                                    "slot": {"tagId": 11},
                                    "timeDilationPriority": {"tagId": 22},
                                    "duration": {
                                        "useBlackboardKey": False,
                                        "value": 1,
                                        "blackboardKey": "",
                                    },
                                    "useCurveKey": True,
                                    "curveKey": "ComboSkill",
                                    # 当前 AKEDB 投影会把未使用的内联曲线写成空数组。
                                    "timeScaleCurve": [],
                                    "finishByAction": True,
                                    "ignoreTargets": [source_target],
                                    "effectTargets": [source_target],
                                    "useTimeScaleForSkillCdTick": False,
                                    "influenceSkillCdTime": {
                                        "useBlackboardKey": False,
                                        "value": 0,
                                        "blackboardKey": "",
                                    },
                                }
                            ]
                        },
                    }
                ]
            }
        }

        action = parse_time_dilations(root, "fixture.json", {})[0]

        self.assertEqual(action.targets, ("caster",))
        self.assertEqual(action.ignoredTargets, ("caster",))

    def test_ability_entity_time_dilation_target_is_typed_but_not_compiled(self) -> None:
        entity_target = target_settings_fixture(
            "InstantSearch",
            finder_type="OwnerSpawnedEntityFinder",
            validator_types=("TagValidator",),
        )
        entity_target["selectorData"]["finderData"][
            "spawnedObjectType"
        ] = "AbilityEntity"
        entity_target["selectorData"]["validatorData"][0]["query"] = {
            "queryType": "HasAny",
            "tags": [{"tagId": -1480463572}],
        }
        action = {
            "$type": "Example.TimeDilationAction+Data, Example",
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 77,
            "layer": "Entity",
            "slot": {"tagId": 11},
            "timeDilationPriority": {"tagId": 22},
            "duration": {
                "useBlackboardKey": False,
                "value": 0.25,
                "blackboardKey": "",
            },
            "useCurveKey": True,
            "curveKey": "ComboSkill",
            "timeScaleCurve": [],
            "finishByAction": False,
            "ignoreTargets": [],
            "effectTargets": [target_settings_fixture("Source"), entity_target],
            "useTimeScaleForSkillCdTick": False,
            "influenceSkillCdTime": {
                "useBlackboardKey": False,
                "value": 0,
                "blackboardKey": "",
            },
        }

        parsed = parse_time_dilation_action(
            action,
            "fixture.timeDilation",
            {},
            start_frame=0,
            end_frame=1,
        )

        self.assertEqual(parsed.targets, ("caster",))
        self.assertEqual(len(parsed.effectAbilityEntityTargets), 1)
        self.assertEqual(
            parsed.effectAbilityEntityTargets[0].tagQueries,
            (("HasAny", (-1480463572,)),),
        )
        with self.assertRaisesRegex(ValueError, "require runtime support"):
            compile_time_dilation(parsed, "fixture.timeDilation")

    def test_global_time_dilation_preserves_owner_spawned_entity_exclusions(self) -> None:
        entity_target = target_settings_fixture(
            "InstantSearch",
            finder_type="OwnerSpawnedEntityFinder",
        )
        entity_target["selectorData"]["finderData"][
            "spawnedObjectType"
        ] = "AbilityEntity"
        action = {
            "$type": "Example.TimeDilationAction+Data, Example",
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 1,
            "layer": "Global",
            "slot": {"tagId": 0},
            "timeDilationPriority": {"tagId": 22},
            "duration": {
                "useBlackboardKey": False,
                "value": 1,
                "blackboardKey": "",
            },
            "useCurveKey": True,
            "curveKey": "ComboSkill",
            "timeScaleCurve": [],
            "finishByAction": False,
            "ignoreTargets": [entity_target],
            "effectTargets": [],
            "useTimeScaleForSkillCdTick": False,
            "influenceSkillCdTime": {
                "useBlackboardKey": False,
                "value": 0,
                "blackboardKey": "",
            },
        }

        parsed = parse_time_dilation_action(
            action,
            "fixture.timeDilation",
            {},
            start_frame=0,
            end_frame=1,
        )
        compiled = compile_time_dilation(parsed, "fixture.timeDilation")

        self.assertEqual(len(parsed.ignoredAbilityEntityTargets), 1)
        self.assertIn("ignoredAbilityEntityTargets", compiled)
        self.assertIn("kind: 'ownerSpawned'", compiled)

    def test_nested_time_dilation_stays_inside_conditional_branch(self) -> None:
        target = target_settings_fixture("Target")
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 30,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "isEnable": True,
                                    "serverActionIndex": 1,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckSquadInFight+Data, Example",
                                                "isEnable": True,
                                            }
                                        ]
                                    },
                                    "succeedActions": {
                                        "actionData": [{
                                            "$type": "Example.TimeDilationAction+Data, Example",
                                            "isEnable": True,
                                            "priorityLevel": "Default",
                                            "priorityOffset": 0,
                                            "serverActionIndex": 2,
                                            "layer": "Entity",
                                            "slot": {"tagId": 11},
                                            "timeDilationPriority": {"tagId": 22},
                                            "duration": {
                                                "useBlackboardKey": False,
                                                "value": 0.3,
                                                "blackboardKey": "",
                                            },
                                            "useCurveKey": False,
                                            "curveKey": "",
                                            "timeScaleCurve": {
                                                "preWrapMode": "ClampForever",
                                                "postWrapMode": "ClampForever",
                                                "keys": [
                                                    {
                                                        "time": 0,
                                                        "value": 1.5,
                                                        "inTangent": 0,
                                                        "outTangent": 0,
                                                        "tangentMode": 0,
                                                        "weightedMode": 0,
                                                        "inWeight": 0,
                                                        "outWeight": 0,
                                                    }
                                                ],
                                            },
                                            "finishByAction": False,
                                            "ignoreTargets": [],
                                            "effectTargets": [target],
                                            "useTimeScaleForSkillCdTick": False,
                                            "influenceSkillCdTime": {
                                                "useBlackboardKey": False,
                                                "value": 0,
                                                "blackboardKey": "",
                                            },
                                        }]
                                    },
                                    "failActions": {"actionData": []},
                                }
                            ]
                        },
                    }
                ]
            }
        }

        conditional = parse_conditional_actions(root, "fixture.json", {})[0]
        branch = conditional.succeedActions[0]

        self.assertEqual(parse_time_dilations(root, "fixture.json", {}), ())
        self.assertEqual(branch.actionType, "TimeDilationAction")
        self.assertEqual(branch.timeDilation.targets, ("enemy",))
        self.assertIn(
            "step('startTimeDilation'",
            compile_conditional_action(
                conditional,
                "fixture",
                root_skill_context=True,
                input_target="enemy",
            ),
        )

    def test_conversion_support_uses_stable_capability_summary(self) -> None:
        self.assertEqual(
            parse_conversion_support({"slug": "complete"}),
            {"completeness": "complete", "missingCapabilities": []},
        )
        self.assertEqual(
            parse_conversion_support(
                {
                    "slug": "partial",
                    "conversionSupport": {
                        "completeness": "partial",
                        "missingCapabilities": [
                            {
                                "capability": "skillBehavior",
                                "skillGroupKeys": ["battleSkill"],
                            }
                        ],
                    },
                }
            ),
            {
                "completeness": "partial",
                "missingCapabilities": [
                    {
                        "capability": "skillBehavior",
                        "skillGroupKeys": ["battleSkill"],
                    }
                ],
            },
        )

    def test_conversion_support_infers_explicitly_unmodeled_progression(self) -> None:
        self.assertEqual(
            parse_conversion_support(
                {
                    "slug": "partial-talent",
                    "talents": [
                        {
                            "key": "multiTarget",
                            "compile": "unmodeledMultiTarget",
                        }
                    ],
                    "potentials": [
                        {
                            "key": "unknownPotential",
                            "compile": "unmodeledRuntimeDependency",
                        }
                    ],
                }
            ),
            {
                "completeness": "partial",
                "missingCapabilities": [
                    {"capability": "talentEffects"},
                    {"capability": "potentialEffects"},
                ],
            },
        )

    def test_conversion_support_rejects_omitted_unmodeled_progression(self) -> None:
        with self.assertRaisesRegex(ValueError, "missing inferred capabilities.*talentEffects"):
            parse_conversion_support(
                {
                    "slug": "missing-talent-status",
                    "talents": [
                        {
                            "key": "multiTarget",
                            "compile": "unmodeledMultiTarget",
                        }
                    ],
                    "conversionSupport": {
                        "completeness": "partial",
                        "missingCapabilities": [{"capability": "skillBehavior"}],
                    },
                }
            )

    def test_conversion_support_rejects_raw_or_inconsistent_status(self) -> None:
        with self.assertRaisesRegex(ValueError, "unsupported capability"):
            parse_conversion_support(
                {
                    "slug": "invalid",
                    "conversionSupport": {
                        "completeness": "partial",
                        "missingCapabilities": [{"capability": "raw parser exception"}],
                    },
                }
            )
        with self.assertRaisesRegex(ValueError, "disagree"):
            parse_conversion_support(
                {
                    "slug": "invalid",
                    "conversionSupport": {
                        "completeness": "complete",
                        "missingCapabilities": [{"capability": "talentEffects"}],
                    },
                }
            )

    def test_buff_find_settings_ignores_empty_id_placeholders(self) -> None:
        check_type, buff_ids, query_type, tag_ids = parse_buff_find_settings(
            {
                "checkType": "Tag",
                "buffIdList": [""],
                "tagQuery": {
                    "queryType": "HasAny",
                    "tags": [{"tagId": -1411846745}],
                },
            },
            "fixture.buffSettings",
        )

        self.assertEqual(check_type, "Tag")
        self.assertEqual(buff_ids, ())
        self.assertEqual(query_type, "hasAny")
        self.assertEqual(tag_ids, (-1411846745,))

    def test_skill_blackboard_uses_static_defaults_and_patch_overrides(self) -> None:
        root = {
            "blackboard": [
                {"key": "static", "valueDouble": 3, "valueStr": "", "isDynamic": False},
                {"key": "dynamic", "valueDouble": 4, "valueStr": "", "isDynamic": True},
                {"key": "patched", "valueDouble": 5, "valueStr": "", "isDynamic": False},
                {
                    "key": "nextCombo",
                    "valueDouble": 0,
                    "valueStr": "next_skill",
                    "isDynamic": False,
                },
            ]
        }
        patch = SkillPatchSource(
            levels=(1, 2),
            blackboard={"patched": (7, 8), "dynamic": (9, 10)},
            cooldownSeconds=(0, 0),
            costTypes=(0, 0),
            costValues=(0, 0),
        )

        self.assertEqual(
            resolve_skill_blackboard(root, "fixture", patch),
            {"static": (3, 3), "patched": (7, 8), "dynamic": (9, 10)},
        )

    def test_dynamic_resource_gain_reaches_runtime_compiler(self) -> None:
        dynamic = SimpleNamespace(amount=ScalarSource(0, "calculated_atb", None))
        zero = SimpleNamespace(amount=ScalarSource(0, None, None))

        self.assertTrue(resource_gain_can_change_value(dynamic, "fixture"))
        self.assertFalse(resource_gain_can_change_value(zero, "fixture"))

    def test_literal_scalar_is_already_a_resolved_level_value(self) -> None:
        self.assertEqual(
            require_level_values(ScalarSource(50, None, None), "fixture"),
            (50,),
        )
        with self.assertRaisesRegex(ValueError, "no resolved level values"):
            require_level_values(ScalarSource(0, "runtime_key", None), "fixture")

    def test_child_condition_does_not_read_root_target_group_writes(self) -> None:
        writes = (SimpleNamespace(targetGroupKey="tar"),)
        skill = SimpleNamespace(targetGroupWrites=writes)
        condition = SimpleNamespace(actionPath=("timelineActions[0]",))
        root_item = SimpleNamespace(sourcePath=condition.actionPath)
        child_item = SimpleNamespace(
            sourcePath=("child.skill", *condition.actionPath)
        )

        self.assertIs(
            root_target_group_writes_for_condition(skill, root_item, condition),
            writes,
        )
        self.assertEqual(
            root_target_group_writes_for_condition(skill, child_item, condition),
            (),
        )

    def test_root_target_group_read_uses_only_prior_unconditional_write(self) -> None:
        root_write = SimpleNamespace(
            startFrame=8,
            actionIndex=3,
            actionPath=("timelineActions[1]", "_sequenceActionData", "actionData", "[0]"),
            targetGroupKey="targets",
        )
        branch_write = SimpleNamespace(
            startFrame=8,
            actionIndex=4,
            actionPath=(
                "timelineActions[1]",
                "_sequenceActionData",
                "actionData",
                "[1]",
                "succeedActions",
                "actionData",
                "[0]",
            ),
            targetGroupKey="targets",
        )

        resolved = resolve_latest_target_group_write_at(
            read_frame=9,
            read_action_index=5,
            read_action_path=(),
            target_group_key="targets",
            writes=(root_write, branch_write),
        )

        self.assertIs(resolved, root_write)

    def test_root_target_group_read_accepts_guaranteed_fixed_model_branch(self) -> None:
        condition_path = (
            "timelineActions[0]",
            "_sequenceActionData",
            "actionData",
            "[0]",
        )
        smart_target_count = ConditionSource(
            sourceType="CheckEntityNum",
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
            entityCount=EntityCountConditionSource(
                targetSource="Context",
                targetGroupKey="smart_target",
                minimumCount=1,
                comparison="GE",
                containsHittableTarget=False,
                excludeDeadEntity=False,
                storeKey="",
            ),
        )
        distance = ConditionSource(
            sourceType="CheckDistanceCondition",
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
            distance=SimpleNamespace(
                source=SimpleNamespace(
                    targetSource="MainCharacter",
                    targetGroupKey="",
                    selectorOwner="ActionOwner",
                    ownerContextKey="",
                    centerType="ActionSource",
                    centerContextKey="",
                    centerToGround=False,
                    target="ActionSource",
                    targetContextKey="",
                    enableAdvancedDirection=False,
                    selectorDirection="SourceForward",
                    finderType=None,
                    validatorTypes=(),
                    postProcessorTypes=(),
                ),
                target=SimpleNamespace(
                    targetSource="Context",
                    targetGroupKey="smart_target",
                    selectorOwner="ActionOwner",
                    ownerContextKey="",
                    centerType="ActionSource",
                    centerContextKey="",
                    centerToGround=False,
                    target="ActionSource",
                    targetContextKey="",
                    enableAdvancedDirection=False,
                    selectorDirection="SourceForward",
                    finderType=None,
                    validatorTypes=(),
                    postProcessorTypes=(),
                ),
                distance=15,
                lessThan=True,
            ),
        )
        control_flow = ConditionalActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=1,
            actionPath=condition_path,
            conditions=(smart_target_count, distance),
            succeedActions=(),
            failActions=(),
        )
        write = TargetGroupWriteSource(
            startFrame=0,
            endFrame=0,
            actionIndex=2,
            actionPath=(*condition_path, "succeedActions", "actionData", "[0]"),
            targetGroupKey="trigger",
            producerType="MergeTargetAction",
            finderType=None,
            finderFactionTarget=None,
            finderTargetObjectType=None,
            finderCheckAlive=None,
            validatorTypes=(),
            postProcessorTypes=(),
            inputTargets=(
                TargetGroupInputSource(
                    targetSource="Context",
                    targetGroupKey="smart_target",
                    finderType=None,
                    finderFactionTarget=None,
                    finderTargetObjectType=None,
                    finderCheckAlive=None,
                    validatorTypes=(),
                    postProcessorTypes=(),
                ),
            ),
            intervalSeconds=None,
        )

        self.assertIsNone(
            resolve_latest_target_group_write_at(
                read_frame=1,
                read_action_index=3,
                read_action_path=(),
                target_group_key="trigger",
                writes=(write,),
            )
        )
        self.assertIs(
            resolve_latest_target_group_write_at(
                read_frame=1,
                read_action_index=3,
                read_action_path=(),
                target_group_key="trigger",
                writes=(write,),
                control_flow_actions=(control_flow,),
                root_skill_context=True,
            ),
            write,
        )
        self.assertTrue(target_group_write_guarantees_single_enemy(write))

    def test_target_group_writes_preserve_finder_merge_and_branch_path(self) -> None:
        find_action = {
            "$type": "Beyond.Gameplay.Core.FindTargetAction+FindTargetActionData, Gameplay.Beyond",
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 4,
            "targetGroupKey": "tar",
            "center": "ActionSource",
            "centerContextKey": "",
            "useCenterEntityMountPoint": False,
            "centerMountPoint": "None",
            "centerToGround": False,
            "selectorOwner": "ActionOwner",
            "selectorOwnerContextKey": "",
            "selectorData": {
                "finderData": {
                    "$type": "Beyond.Gameplay.Core.Selector+HitBoxFinder+Data, Gameplay.Beyond",
                    "factionTarget": "Anti",
                    "targetObjectType": "Normal",
                    "checkAlive": True,
                },
                "validatorData": [],
                "postProcessorData": [
                    {
                        "$type": "Beyond.Gameplay.Core.Selector+PriorityFilter+Data, Gameplay.Beyond"
                    }
                ],
            },
            "selectorDirection": "SourceForward",
            "target": "ActionSource",
            "contextKey": "",
            "useAdvancedDirectionSetting": False,
            "advancedSelectorDirection": {},
        }
        merge_action = {
            "$type": "Beyond.Gameplay.Core.MergeTargetAction+Data, Gameplay.Beyond",
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 7,
            "targetGroupKey": "total_tar",
            "targets": [
                {
                    "targetSource": "Context",
                    "targetGroupKey": "tar",
                    "selectorOwner": "ActionOwner",
                    "ownerContextKey": "",
                    "centerType": "ActionSource",
                    "centerContextKey": "",
                    "centerToGround": False,
                    "selectorData": {"validatorData": [], "postProcessorData": []},
                    "enableAdvancedDirection": False,
                    "advancedDirection": {},
                    "selectorDirection": "SourceForward",
                    "target": "ActionSource",
                    "targetContextKey": "",
                }
            ],
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 3,
                        "_endFrame": 8,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "isEnable": True,
                                    "serverActionIndex": 1,
                                    "succeedActions": {"actionData": [find_action, merge_action]},
                                }
                            ]
                        },
                    }
                ]
            }
        }

        writes = parse_target_group_writes(root, "fixture.json")

        self.assertEqual([write.targetGroupKey for write in writes], ["tar", "total_tar"])
        self.assertEqual(writes[0].finderType, "HitBoxFinder")
        self.assertEqual(writes[0].validatorTypes, ())
        self.assertEqual(writes[0].postProcessorTypes, ("PriorityFilter",))
        self.assertIn("succeedActions", writes[0].actionPath)
        self.assertEqual(writes[1].inputTargets[0].targetGroupKey, "tar")

        condition = ConditionSource(
            sourceType="CheckEntityNum",
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
            entityCount=EntityCountConditionSource(
                targetSource="Context",
                targetGroupKey="tar",
                minimumCount=1,
                comparison="GE",
                containsHittableTarget=False,
                excludeDeadEntity=False,
                storeKey="",
            ),
        )
        nested_reader = ConditionalActionSource(
            startFrame=3,
            endFrame=8,
            actionIndex=8,
            actionPath=(
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[0]",
                "succeedActions",
                "actionData",
                "[2]",
            ),
            conditions=(condition,),
            succeedActions=(),
            failActions=(),
        )
        outside_reader = ConditionalActionSource(
            startFrame=3,
            endFrame=8,
            actionIndex=8,
            actionPath=(
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[1]",
            ),
            conditions=(condition,),
            succeedActions=(),
            failActions=(),
        )

        self.assertTrue(
            is_guaranteed_single_enemy_condition(
                condition,
                action=nested_reader,
                target_group_writes=writes,
            )
        )
        self.assertFalse(
            is_guaranteed_single_enemy_condition(
                condition,
                action=outside_reader,
                target_group_writes=writes,
            )
        )

    def test_target_group_writes_reject_unknown_selector_type(self) -> None:
        action = {
            "$type": "Beyond.Gameplay.Core.FindTargetAction+FindTargetActionData, Gameplay.Beyond",
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 1,
            "targetGroupKey": "tar",
            "center": "ActionSource",
            "centerContextKey": "",
            "useCenterEntityMountPoint": False,
            "centerMountPoint": "None",
            "centerToGround": False,
            "selectorOwner": "ActionOwner",
            "selectorOwnerContextKey": "",
            "selectorData": {
                "finderData": {
                    "$type": "Beyond.Gameplay.Core.Selector+UnknownFinder+Data, Gameplay.Beyond"
                },
                "validatorData": [],
                "postProcessorData": [],
            },
            "selectorDirection": "SourceForward",
            "target": "ActionSource",
            "contextKey": "",
            "useAdvancedDirectionSetting": False,
            "advancedSelectorDirection": {},
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 0,
                        "_sequenceActionData": {"actionData": [action]},
                    }
                ]
            }
        }

        with self.assertRaisesRegex(ValueError, "unsupported finder 'UnknownFinder'"):
            parse_target_group_writes(root, "fixture.json")

    def test_target_group_writes_preserve_owner_spawned_entity_tag_identity(self) -> None:
        action = {
            "$type": "Beyond.Gameplay.Core.FindTargetAction+FindTargetActionData, Gameplay.Beyond",
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 4,
            "targetGroupKey": "lances",
            "center": "ActionSource",
            "centerContextKey": "",
            "useCenterEntityMountPoint": False,
            "centerMountPoint": "None",
            "centerToGround": False,
            "selectorOwner": "ActionOwner",
            "selectorOwnerContextKey": "",
            "selectorData": {
                "finderData": {
                    "$type": (
                        "Beyond.Gameplay.Core.Selector+OwnerSpawnedEntityFinder+Data, "
                        "Gameplay.Beyond"
                    ),
                    "spawnedObjectType": "AbilityEntity",
                },
                "validatorData": [
                    {
                        "$type": (
                            "Beyond.Gameplay.Core.Selector+TagValidator+Data, "
                            "Gameplay.Beyond"
                        ),
                        "query": {
                            "queryType": "HasAny",
                            "tags": [{"tagId": -549424863}],
                        },
                    }
                ],
                "postProcessorData": [],
            },
            "selectorDirection": "SourceForward",
            "target": "ActionSource",
            "contextKey": "",
            "useAdvancedDirectionSetting": False,
            "advancedSelectorDirection": {},
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 3,
                        "_endFrame": 8,
                        "_sequenceActionData": {"actionData": [action]},
                    }
                ]
            }
        }

        write = parse_target_group_writes(root, "fixture.json")[0]

        self.assertEqual(write.finderType, "OwnerSpawnedEntityFinder")
        self.assertEqual(write.finderSpawnedObjectType, "AbilityEntity")
        self.assertEqual(
            write.validatorTagQueries,
            (("HasAny", (-549424863,)),),
        )

        self.assertFalse(target_group_write_guarantees_single_enemy(write))
        self.assertEqual(
            target_group_write_ability_entity_collection_identity(write),
            (("HasAny", (-549424863,)),),
        )

        action["selectorData"]["finderData"]["unexpected"] = True
        with self.assertRaisesRegex(ValueError, "owner-spawned finder fields"):
            parse_target_group_writes(root, "fixture.json")

    def test_conversion_support_marks_ability_entity_timeline_jumps(self) -> None:
        skill = SimpleNamespace(
            key="battleSkill",
            abilityEntityHits=(),
            projectileTriggeredSkills=(
                SimpleNamespace(
                    abilityEntityHits=(
                        SimpleNamespace(
                            timelineJumps=(SimpleNamespace(destFrame=149),),
                            nestedAbilityEntityHits=(),
                            projectileTriggeredSkills=(),
                        ),
                    ),
                    nestedProjectileTriggeredSkills=(),
                ),
            ),
        )

        self.assertEqual(
            parse_conversion_support({"slug": "jumping"}, (skill,)),
            {
                "completeness": "partial",
                "missingCapabilities": [
                    {
                        "capability": "skillBehavior",
                        "skillGroupKeys": ["battleSkill"],
                    }
                ],
            },
        )

    def test_projectile_child_conditions_and_resource_gains_use_hit_frame(self) -> None:
        condition = SimpleNamespace(
            startFrame=2,
            executionFrames=(),
            actionIndex=7,
            actionPath=("timelineActions[7]",),
        )
        gain = TimedResourceGainSource(
            startFrame=3,
            endFrame=3,
            actionIndex=8,
            resource="sp",
            amount=ScalarSource(1, None, (1,)),
            coefficient=ScalarSource(1, None, (1,)),
            spGainKind="direct",
            spGainSource="skill",
            onlyMainOperator=False,
            isPercentValue=False,
            useUltimateRecoveryTag=False,
            ultimateRecoveryTagId=0,
            ignoreUltimateGainScalar=False,
        )
        projectile = SimpleNamespace(
            launchFrame=10,
            assumedTravelFrames=5,
            actionOrder=(4,),
            triggerSkillId="projectile_hit",
            excludedByPrimaryTargetMarker=False,
            directDamageHits=(),
            conditionalActions=(condition,),
            auxiliaryActions=(
                SimpleNamespace(
                    actionType="CreateBuffAction",
                    startFrame=1,
                    actionIndex=5,
                ),
            ),
            resourceGains=(gain,),
            inflictions=(TimedInflictionSource(4, 4, 9, "heat", False),),
            nestedProjectileTriggeredSkills=(),
            abilityEntityHits=(),
        )
        skill = SimpleNamespace(
            skillId="root",
            directDamageHits=(),
            projectileTriggeredSkills=(projectile,),
            abilityEntityHits=(),
            auxiliaryActions=(),
            conditionalActions=(),
            blackboardCalculations=(),
            blackboardMutations=(),
            buffBlackboardReads=(),
            buffFinishes=(),
            buffHolds=(),
            resourceGains=(),
            inflictions=(),
        )

        schedule = collect_resolved_schedule(skill)

        self.assertEqual(
            [(item.itemType, item.frame, item.actionOrder) for item in schedule],
            [
                ("buffApplication", 16, (4, 5)),
                ("condition", 17, (4, 7)),
                ("resourceGain", 18, (4, 8)),
                ("infliction", 19, (4, 9)),
            ],
        )

    def test_damage_compiler_maps_native_element_names(self) -> None:
        self.assertEqual(
            ELEMENT_TYPE_MAP,
            {
                "Physical": "physical",
                "Fire": "heat",
                "Pulse": "electric",
                "Cryst": "cryo",
                "Natural": "nature",
            },
        )
        cases = {
            "Fire": "heat",
            "Pulse": "electric",
            "Cryst": "cryo",
            "Natural": "nature",
        }
        for native_type, damage_type in cases.items():
            with self.subTest(native_type=native_type):
                unit = DamageUnitSource(
                    damageType=native_type,
                    attributeType="Hp",
                    calculation="standard",
                    attackScale=ScalarSource(1, None, (1,)),
                    calculationMultiplier=None,
                    poiseValue=None,
                )

                source = compile_damage_units_step(
                    (unit,), ("normalAttack",), "fixture.damage"
                )

                self.assertIn(f"  damageType: '{damage_type}',", source)

    def test_damage_compiler_uses_native_tags_and_features(self) -> None:
        unit = DamageUnitSource(
            damageType="Pulse",
            attributeType="Hp",
            calculation="standard",
            attackScale=ScalarSource(1, None, (1,)),
            calculationMultiplier=None,
            poiseValue=None,
            damageDecorateMask=4352,
        )

        source = compile_damage_units_step(
            (unit,),
            ("normalSkill",),
            "fixture.damage",
        )

        self.assertIn("  tags: ['normalSkill'],", source)
        self.assertIn("  features: ['canBreakWeakness'],", source)

    def test_damage_compiler_preserves_an_empty_native_classification(self) -> None:
        unit = DamageUnitSource(
            damageType="Pulse",
            attributeType="Hp",
            calculation="standard",
            attackScale=ScalarSource(1, None, (1,)),
            calculationMultiplier=None,
            poiseValue=None,
            damageDecorateMask=0,
        )

        source = compile_damage_units_step(
            (unit,),
            ("normalSkill",),
            "fixture.damage",
        )

        self.assertIn("  tags: [],", source)

    def test_damage_compiler_allows_native_final_hit_as_a_basic_attack_specialization(self) -> None:
        unit = DamageUnitSource(
            damageType="Physical",
            attributeType="Hp",
            calculation="standard",
            attackScale=ScalarSource(1, None, (1,)),
            calculationMultiplier=None,
            poiseValue=None,
            damageDecorateMask=2097280,
        )

        source = compile_damage_units_step(
            (unit,),
            ("normalAttack",),
            "fixture.final-hit",
        )

        self.assertIn("  tags: ['normalAttack', 'normalAttackLastCombo'],", source)

    def test_damage_compiler_preserves_a_pure_poise_unit_without_health_damage(self) -> None:
        unit = DamageUnitSource(
            damageType="Cryst",
            attributeType="Poise",
            calculation="standard",
            attackScale=ScalarSource(0, None, (0,)),
            calculationMultiplier=None,
            poiseValue=ScalarSource(20, "poise", (20, 30)),
        )

        source = compile_damage_units_step((unit,), ("normalAttack",), "fixture.poise")

        self.assertEqual(
            source,
            ["step('dealStagger', {", "  value: [20, 30],", "})"],
        )

    def test_damage_compiler_preserves_runtime_blackboard_stagger(self) -> None:
        health = DamageUnitSource(
            damageType="Physical",
            attributeType="Hp",
            calculation="standard",
            attackScale=ScalarSource(1, None, (1,)),
            calculationMultiplier=None,
            poiseValue=None,
        )
        poise = DamageUnitSource(
            damageType="Physical",
            attributeType="Poise",
            calculation="standard",
            attackScale=ScalarSource(0, None, (0,)),
            calculationMultiplier=None,
            poiseValue=ScalarSource(0, "poise_once", None),
        )

        source = compile_damage_units_step(
            (health, poise),
            ("comboSkill",),
            "fixture.dynamic-poise",
            frozenset({"poise_once"}),
        )

        self.assertIn("  stagger: { kind: 'blackboard', key: 'poise_once' },", source)

    def test_damage_compiler_rejects_poise_before_health(self) -> None:
        poise = DamageUnitSource(
            damageType="Cryst",
            attributeType="Poise",
            calculation="standard",
            attackScale=ScalarSource(0, None, (0,)),
            calculationMultiplier=None,
            poiseValue=ScalarSource(20, None, (20,)),
        )
        health = DamageUnitSource(
            damageType="Pulse",
            attributeType="Hp",
            calculation="standard",
            attackScale=ScalarSource(1, None, (1,)),
            calculationMultiplier=None,
            poiseValue=None,
        )

        with self.assertRaisesRegex(ValueError, "unsupported DamageUnit execution order"):
            compile_damage_units_step((poise, health), ("normalAttack",), "fixture.order")

    def test_conditional_projectile_resolution_stays_attached_to_its_branch(self) -> None:
        launch = ProjectileLaunchPayload(
            "projectile_fixture",
            (ProjectileSkillTriggerSource("reach", "fixture_child"),),
        )
        branch = ConditionalBranchActionSource(
            "LaunchProjectile",
            7,
            projectileLaunch=launch,
        )
        condition = ConditionalActionSource(
            5,
            6,
            3,
            ("condition",),
            (),
            (branch,),
            (),
        )
        resolved_hit = SimpleNamespace(triggerSkillId="fixture_child")

        with patch(
            "generate_next_operators.resolve_projectile_payload_triggers",
            return_value=(resolved_hit,),
        ) as resolver:
            result = resolve_conditional_projectile_triggers(
                (condition,),
                {},
                "fixture.json",
                Path("."),
                10,
                ("fixture_root",),
                {},
                (1,),
            )

        resolved_branch = result[0].succeedActions[0]
        self.assertEqual(resolved_branch.projectileTriggeredSkills, (resolved_hit,))
        resolver.assert_called_once_with(
            launch,
            {},
            "fixture.json",
            Path("."),
            15,
            (1, 3, 7),
            ("fixture_root",),
            {},
        )

    def test_conditional_aura_ability_entity_resolution_stays_attached_to_its_branch(self) -> None:
        spawn = AbilityEntitySpawnPayload("ability_fixture", "fixture_child")
        branch = ConditionalBranchActionSource(
            "SpawnAbilityEntity",
            7,
            abilityEntitySpawn=spawn,
        )
        condition = ConditionalActionSource(
            5,
            6,
            3,
            ("condition",),
            (),
            (branch,),
            (),
        )
        resolved_hit = SimpleNamespace(skillId="fixture_child")

        with tempfile.TemporaryDirectory() as directory:
            source_dir = Path(directory)
            child_path = source_dir / "fixture_child.json"
            child_path.write_text("{}", encoding="utf-8")
            with (
                patch(
                    "generate_next_operators.load_projected_skill_data",
                    return_value={},
                ),
                patch(
                    "generate_next_operators.resolve_ability_entity_payload",
                    return_value=resolved_hit,
                ) as resolver,
                patch("generate_next_operators.contains_structured_aura", return_value=True),
            ):
                result = resolve_conditional_aura_ability_entity_children(
                    (condition,),
                    "fixture.json",
                    source_dir,
                    10,
                    ("fixture_root",),
                    {},
                    (1,),
                )

        resolved_branch = result[0].succeedActions[0]
        self.assertEqual(resolved_branch.auraAbilityEntityHits, (resolved_hit,))
        resolver.assert_called_once_with(
            spawn,
            {},
            "fixture_child.json",
            source_dir,
            15,
            ("fixture_root",),
            {},
            (1, 3, 7),
        )

    def test_single_enemy_smart_target_count_is_guaranteed(self) -> None:
        condition = ConditionSource(
            sourceType="CheckEntityNum",
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
            entityCount=EntityCountConditionSource(
                targetSource="Context",
                targetGroupKey="smart_target",
                minimumCount=1,
                comparison="GE",
                containsHittableTarget=False,
                excludeDeadEntity=False,
                storeKey="",
            ),
        )

        self.assertTrue(is_guaranteed_single_enemy_condition(condition))

    def test_single_enemy_input_target_count_ignores_context_key_and_hit_reactions(self) -> None:
        condition = ConditionSource(
            sourceType="CheckEntityNum",
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
            entityCount=EntityCountConditionSource(
                targetSource="Target",
                targetGroupKey="unused_by_target_source",
                minimumCount=1,
                comparison="GE",
                containsHittableTarget=True,
                excludeDeadEntity=False,
                storeKey="",
            ),
        )

        self.assertTrue(is_guaranteed_single_enemy_condition(condition))

    def test_context_entity_group_is_not_folded_without_provenance(self) -> None:
        condition = ConditionSource(
            sourceType="CheckEntityNum",
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
            entityCount=EntityCountConditionSource(
                targetSource="Context",
                targetGroupKey="ball",
                minimumCount=1,
                comparison="GE",
                containsHittableTarget=False,
                excludeDeadEntity=False,
                storeKey="",
            ),
        )

        self.assertFalse(is_guaranteed_single_enemy_condition(condition))

    def test_conditional_action_coverage_only_includes_compilable_leaf_payloads(self) -> None:
        condition = ConditionalActionSource(
            0,
            0,
            1,
            ("condition",),
            (),
            (
                ConditionalBranchActionSource(
                    "ObtainCostAction",
                    0,
                    resourceGain=ResourceGainPayload(
                        "sp",
                        ScalarSource(1, None, (1,)),
                        ScalarSource(1, None, (1,)),
                        "gain",
                        "skill",
                        False,
                        False,
                        False,
                        0,
                        False,
                    ),
                ),
                ConditionalBranchActionSource(
                    "LaunchProjectile",
                    1,
                    projectileLaunch=ProjectileLaunchPayload("projectile", ()),
                ),
                ConditionalBranchActionSource(
                    "SaveBuffStackNumAdvanced",
                    2,
                    buffStackRead=BuffStackReadPayload(
                        "count",
                        "Context",
                        "smart_target",
                        "Tag",
                        (),
                        "hasAny",
                        (123,),
                        "BuffCount",
                        False,
                    ),
                ),
            ),
            (),
        )

        self.assertEqual(
            collect_compilable_conditional_action_types((condition,)),
            {"IfElseAction", "ObtainCostAction", "SaveBuffStackNumAdvanced"},
        )

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

    def test_conditional_compiler_skips_only_ability_entities_lifted_by_parser(self) -> None:
        spawn = AbilityEntitySpawnPayload("entity.test", "skill.test")
        condition = ConditionSource(
            "CompareFloat",
            True,
            "Equals",
            ScalarSource(1, None, None),
            ScalarSource(1, None, None),
            (),
        )
        source = ConditionalActionSource(
            3,
            3,
            11,
            ("root",),
            (condition,),
            (
                ConditionalBranchActionSource(
                    "SpawnAbilityEntity", 0, abilityEntitySpawn=spawn
                ),
                ConditionalBranchActionSource(
                    "ModifyDynamicBlackboard",
                    1,
                    blackboardMutation=BlackboardMutationPayload(
                        "combat_value", "Add", ScalarSource(1, None, None)
                    ),
                ),
            ),
            (ConditionalBranchActionSource("SpawnAbilityEntity", 0, abilityEntitySpawn=spawn),),
        )

        marked = mark_projected_conditional_children((source,))[0]
        result = compile_conditional_action(marked, "fixture.condition")

        self.assertEqual(marked.projectedAbilityEntitySpawns, (spawn,))
        self.assertIn("modifyActionValue", result)
        self.assertNotIn("SpawnAbilityEntity", result)

    def test_conditional_compiler_rejects_divergent_ability_entity_spawns(self) -> None:
        first = AbilityEntitySpawnPayload("entity.first", "skill.first")
        second = AbilityEntitySpawnPayload("entity.second", "skill.second")
        source = ConditionalActionSource(
            3,
            3,
            11,
            ("root",),
            (
                ConditionSource(
                    "CompareFloat",
                    True,
                    "Equals",
                    ScalarSource(1, None, None),
                    ScalarSource(1, None, None),
                    (),
                ),
            ),
            (ConditionalBranchActionSource("SpawnAbilityEntity", 0, abilityEntitySpawn=first),),
            (ConditionalBranchActionSource("SpawnAbilityEntity", 0, abilityEntitySpawn=second),),
        )

        marked = mark_projected_conditional_children((source,))[0]

        self.assertEqual(marked.projectedAbilityEntitySpawns, ())
        with self.assertRaisesRegex(ValueError, "unsupported conditional leaf 'SpawnAbilityEntity'"):
            compile_conditional_action(marked, "fixture.condition")

    def test_conditional_compiler_lifts_identical_projectile_children(self) -> None:
        launch = ProjectileLaunchPayload(
            "projectile.test",
            (ProjectileSkillTriggerSource("hit", "skill.hit"),),
        )
        triggered = (SimpleNamespace(triggerSkillId="skill.hit"),)
        source = ConditionalActionSource(
            3,
            3,
            11,
            ("root",),
            (
                ConditionSource(
                    "CompareFloat",
                    True,
                    "Equals",
                    ScalarSource(1, None, None),
                    ScalarSource(1, None, None),
                    (),
                ),
            ),
            (
                ConditionalBranchActionSource(
                    "LaunchProjectile",
                    0,
                    projectileLaunch=launch,
                    projectileTriggeredSkills=triggered,
                ),
            ),
            (
                ConditionalBranchActionSource(
                    "LaunchProjectile",
                    0,
                    projectileLaunch=launch,
                    projectileTriggeredSkills=triggered,
                ),
            ),
        )

        marked = mark_projected_conditional_children((source,))[0]

        self.assertEqual(guaranteed_projectile_projections(marked), marked.projectedProjectileLaunches)
        self.assertEqual(
            collect_projected_conditional_projectile_skills((marked,)),
            triggered,
        )
        self.assertEqual(compile_conditional_action(marked, "fixture.condition"), "sequence()")

    def test_conditional_compiler_ignores_branch_local_projectile_order(self) -> None:
        launch = ProjectileLaunchPayload(
            "projectile.test",
            (ProjectileSkillTriggerSource("hit", "skill.hit"),),
        )
        source = ConditionalActionSource(
            3,
            3,
            11,
            ("root",),
            (
                ConditionSource(
                    "CompareFloat",
                    True,
                    "Equals",
                    ScalarSource(1, None, None),
                    ScalarSource(1, None, None),
                    (),
                ),
            ),
            (
                ConditionalBranchActionSource(
                    "LaunchProjectile",
                    1,
                    projectileLaunch=launch,
                    projectileTriggeredSkills=(
                        SimpleNamespace(triggerSkillId="skill.hit", actionOrder=(11, 1)),
                    ),
                ),
            ),
            (
                ConditionalBranchActionSource(
                    "LaunchProjectile",
                    2,
                    projectileLaunch=launch,
                    projectileTriggeredSkills=(
                        SimpleNamespace(triggerSkillId="skill.hit", actionOrder=(11, 2)),
                    ),
                ),
            ),
        )

        marked = mark_projected_conditional_children((source,))[0]

        self.assertEqual(len(marked.projectedProjectileLaunches), 1)
        self.assertEqual(compile_conditional_action(marked, "fixture.condition"), "sequence()")

    def test_immediate_projectile_child_preserves_infliction_before_damage(self) -> None:
        damage = TimedDamageSource(
            0,
            0,
            1,
            (
                DamageUnitSource(
                    "Fire",
                    "Hp",
                    "standard",
                    ScalarSource(1.5, None, None),
                    None,
                    None,
                ),
            ),
        )
        hit = SimpleNamespace(
            assumedTravelFrames=0,
            cycleTruncated=False,
            conditionalActions=(),
            auxiliaryActions=(),
            resourceGains=(),
            nestedProjectileTriggeredSkills=(),
            abilityEntityHits=(),
            directDamageHits=(damage,),
            inflictions=(TimedInflictionSource(0, 0, 0, "heat", False),),
            combatActions=("DamageAction", "SpellInfliction"),
        )

        compiled = compile_immediate_projectile_children(
            (hit,), ("normalSkill",), frozenset(), "fixture.projectile"
        )

        self.assertIsNotNone(compiled)
        self.assertLess(compiled.index("applyElementalInfliction"), compiled.index("dealDamage"))
        self.assertIn("percentage(150)", compiled)

    def test_conditional_compiler_rejects_divergent_projectile_children(self) -> None:
        launch = ProjectileLaunchPayload(
            "projectile.test",
            (ProjectileSkillTriggerSource("hit", "skill.hit"),),
        )
        source = ConditionalActionSource(
            3,
            3,
            11,
            ("root",),
            (
                ConditionSource(
                    "CompareFloat",
                    True,
                    "Equals",
                    ScalarSource(1, None, None),
                    ScalarSource(1, None, None),
                    (),
                ),
            ),
            (
                ConditionalBranchActionSource(
                    "LaunchProjectile",
                    0,
                    projectileLaunch=launch,
                    projectileTriggeredSkills=(SimpleNamespace(triggerSkillId="first"),),
                ),
            ),
            (
                ConditionalBranchActionSource(
                    "LaunchProjectile",
                    0,
                    projectileLaunch=launch,
                    projectileTriggeredSkills=(SimpleNamespace(triggerSkillId="second"),),
                ),
            ),
        )

        marked = mark_projected_conditional_children((source,))[0]

        self.assertEqual(marked.projectedProjectileLaunches, ())
        with self.assertRaisesRegex(ValueError, "unsupported conditional leaf 'LaunchProjectile'"):
            compile_conditional_action(marked, "fixture.condition")

    def test_nested_projectile_is_not_consumed_without_root_projection(self) -> None:
        launch = ProjectileLaunchPayload(
            "projectile.test",
            (ProjectileSkillTriggerSource("hit", "skill.hit"),),
        )
        triggered = (SimpleNamespace(triggerSkillId="skill.hit"),)
        condition = ConditionSource(
            "CompareFloat",
            True,
            "Equals",
            ScalarSource(1, None, None),
            ScalarSource(1, None, None),
            (),
        )
        projectile_action = ConditionalBranchActionSource(
            "LaunchProjectile",
            0,
            projectileLaunch=launch,
            projectileTriggeredSkills=triggered,
        )
        inner = ConditionalActionSource(
            3,
            3,
            12,
            ("root", "succeedActions", "nested"),
            (condition,),
            (projectile_action,),
            (projectile_action,),
        )
        outer = ConditionalActionSource(
            3,
            3,
            11,
            ("root",),
            (condition,),
            (ConditionalBranchActionSource("IfElse", 0, nestedCondition=inner),),
            (),
        )

        marked = mark_projected_conditional_children((outer,))[0]
        marked_inner = marked.succeedActions[0].nestedCondition

        self.assertEqual(marked.projectedProjectileLaunches, ())
        self.assertIsNotNone(marked_inner)
        self.assertEqual(marked_inner.projectedProjectileLaunches, ())
        with self.assertRaisesRegex(ValueError, "unsupported conditional leaf 'LaunchProjectile'"):
            compile_conditional_action(marked, "fixture.condition")

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

    def test_channel_projection_ticks_on_both_interval_boundaries(self) -> None:
        self.assertEqual(
            project_channel_trigger_frames(
                7,
                7,
                execute_each_frame=True,
                trigger_interval=0.033,
                max_count_per_target=-1,
                target_trigger_interval=-1,
            ),
            (7,),
        )
        self.assertEqual(
            project_channel_trigger_frames(
                7,
                9,
                execute_each_frame=True,
                trigger_interval=0.033,
                max_count_per_target=-1,
                target_trigger_interval=-1,
            ),
            (7, 8, 9),
        )

    def test_channel_projection_uses_immediate_first_scan_and_global_interval(self) -> None:
        self.assertEqual(
            project_channel_trigger_frames(
                0,
                6,
                execute_each_frame=False,
                trigger_interval=0.06,
                max_count_per_target=-1,
                target_trigger_interval=-1,
            ),
            (0, 2, 4, 6),
        )
        # 非零帧启动时，起始更新本身已经携带一个 1/30 秒的 deltaTime。
        self.assertEqual(
            project_channel_trigger_frames(
                5,
                9,
                execute_each_frame=False,
                trigger_interval=0.06,
                max_count_per_target=-1,
                target_trigger_interval=-1,
            ),
            (5, 6, 8),
        )

    def test_channel_projection_applies_strict_per_target_interval_and_count(self) -> None:
        self.assertEqual(
            project_channel_trigger_frames(
                0,
                8,
                execute_each_frame=True,
                trigger_interval=0.033,
                max_count_per_target=3,
                target_trigger_interval=1 / 30,
            ),
            # 单精度累加在第 3 帧产生略大于 1/30 的差值，原生严格大于比较会放行。
            (0, 2, 3),
        )

    def test_channel_timeline_projection_expands_shared_one_shot_nodes(self) -> None:
        damage = {
            "$type": "Example.DamageAction, Example",
            "isEnable": True,
            "serverActionIndex": 9,
        }
        target = target_settings_fixture("Context")
        target["targetGroupKey"] = "enemy"
        channel = {
            "$type": "Example.ChannelingAction, Example",
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 2,
            "targetSettings": target,
            "executeEachFrame": True,
            "triggerInterval": 0.033,
            "maxCountPerTarget": 2,
            "targetTriggerInterval": -1,
            "actionOnTick": {
                "actionData": [damage],
                "onlyExecuteWhenSourceIsMainChar": False,
                "onlyExecuteWhenSourceIsGuard": False,
            },
        }
        retained = {"$type": "Example.EffectAction, Example", "isEnable": True}
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 4,
                        "_endFrame": 7,
                        "_sequenceActionData": {
                            "actionData": [retained, channel],
                            "onlyExecuteWhenSourceIsMainChar": False,
                            "onlyExecuteWhenSourceIsGuard": False,
                        },
                        "forceSyncAnimData": True,
                    }
                ]
            }
        }

        projected = project_single_enemy_channeling_timeline(root, "fixture")
        timelines = projected["actionGroupData"]["timelineActions"]

        self.assertEqual(
            [(item["_startFrame"], item["_endFrame"]) for item in timelines],
            [(4, 7), (4, 4), (5, 5)],
        )
        self.assertEqual(timelines[0]["_sequenceActionData"]["actionData"], [retained])
        self.assertIs(timelines[1]["_sequenceActionData"]["actionData"][0], damage)
        self.assertIs(timelines[2]["_sequenceActionData"]["actionData"][0], damage)

    def test_channel_timeline_projection_accepts_owner_without_target_dependency(self) -> None:
        target = target_settings_fixture("Owner")
        channel = {
            "$type": "Example.ChannelingAction, Example",
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 2,
            "targetSettings": target,
            "executeEachFrame": False,
            "triggerInterval": 0.1,
            "maxCountPerTarget": -1,
            "targetTriggerInterval": 0,
            "actionOnTick": {"actionData": []},
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {"actionData": [channel]},
                    }
                ]
            }
        }

        projected = project_single_enemy_channeling_timeline(root, "fixture")

        self.assertEqual(
            [item["_startFrame"] for item in projected["actionGroupData"]["timelineActions"]],
            [0],
        )

    def test_channel_timeline_projection_rejects_owner_with_target_dependency(self) -> None:
        target = target_settings_fixture("Owner")
        channel = {
            "$type": "Example.ChannelingAction, Example",
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 2,
            "targetSettings": target,
            "executeEachFrame": False,
            "triggerInterval": 0.1,
            "maxCountPerTarget": -1,
            "targetTriggerInterval": 0,
            "actionOnTick": {
                "actionData": [
                    {
                        "$type": "Example.CreateBuffAction, Example",
                        "targetSettings": target_settings_fixture("Target"),
                    }
                ]
            },
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {"actionData": [channel]},
                    }
                ]
            }
        }

        with self.assertRaisesRegex(ValueError, "requires explicit input target projection"):
            project_single_enemy_channeling_timeline(root, "fixture")

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
                projectileTriggeredSkills=(),
                nestedAbilityEntityHits=(),
            )

        skill = SimpleNamespace(
            skillId="root",
            directDamageHits=(),
            projectileTriggeredSkills=(),
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

    def test_consumed_root_timed_marker_is_removed_from_timeline_audit(self) -> None:
        marker = {
            "$type": "Example.CreateTimedMarker+Data, Example",
            "isEnable": True,
            "markerId": {
                "useBlackboardKey": False,
                "value": "zhuangfy_combo_ult_tar",
                "blackboardKey": "",
            },
        }
        root = {
            "skillId": "chr_0030_zhuangfy_combo_skill_ult",
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {"actionData": [marker]},
                    }
                ]
            },
        }

        consumed = collect_consumed_root_timed_marker_action_ids(root, "skill")
        timeline = parse_timeline(root, "skill", consumed)

        self.assertEqual(consumed, frozenset({id(marker)}))
        self.assertEqual(timeline[0].actionTypes, ())

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
                    sequenceIndex=0,
                ),
            ),
        )
        self.assertIn("holdBuffsById", compile_buff_hold(holds[0], "fixture.hold"))

    def test_buff_application_preserves_context_source_key(self) -> None:
        payload = parse_buff_application_payload(
            {
                "buffs": [{"buffId": "buff.fixture", "assignItems": []}],
                "targetSettings": {"targetSource": "Source", "targetGroupKey": ""},
                "count": {
                    "useBlackboardKey": False,
                    "value": 1,
                    "blackboardKey": "",
                },
                "buffSource": "ContextTarget",
                "contextKey": "smart_target",
                "inheritSourceSkillCastInfo": False,
            },
            "fixture.CreateBuffAction",
            {},
        )

        self.assertEqual(payload.buffSource, "ContextTarget")
        self.assertEqual(payload.buffSourceContextKey, "smart_target")

    def test_buff_application_parses_instant_search_selector(self) -> None:
        payload = parse_buff_application_payload(
            {
                "buffs": [{"buffId": "buff.fixture", "assignItems": []}],
                "targetSettings": target_settings_fixture(
                    "InstantSearch",
                    finder_type="CharacterTeamFinder",
                ),
                "count": {
                    "useBlackboardKey": False,
                    "value": 1,
                    "blackboardKey": "",
                },
                "buffSource": "ActionSource",
                "contextKey": "",
                "inheritSourceSkillCastInfo": False,
            },
            "fixture.CreateBuffAction",
            {},
        )

        self.assertEqual(payload.targetFinderType, "CharacterTeamFinder")
        self.assertEqual(payload.targetValidatorTypes, ())
        self.assertEqual(payload.targetPostProcessorTypes, ())

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

    def test_root_skill_buff_application_folds_owner_to_caster(self) -> None:
        action = AuxiliaryActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=0,
            actionType="CreateBuffAction",
            sourceId="buff_fixture",
            classification=None,
            targetSource="Owner",
            targetGroupKey="",
            count=ScalarSource(1, None, None),
            buffSource="ActionOwner",
            inheritSourceSkillCastInfo=False,
            targetFinderType=None,
            targetValidatorTypes=(),
            targetPostProcessorTypes=(),
            blackboardAssignments={},
            nestedCombatActions=(),
        )

        source = compile_buff_application(action, "fixture")

        self.assertIn("target: 'caster'", source)

    def test_fixed_buff_target_ignores_unused_group_key(self) -> None:
        action = AuxiliaryActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=0,
            actionType="CreateBuffAction",
            sourceId="buff_fixture",
            classification=None,
            targetSource="Source",
            targetGroupKey="unused_team_group",
            count=ScalarSource(1, None, None),
            buffSource="ActionSource",
            inheritSourceSkillCastInfo=False,
            blackboardAssignments={},
            nestedCombatActions=(),
        )

        source = compile_buff_application(action, "fixture")

        self.assertIn("target: 'caster'", source)

    def test_root_skill_buff_application_resolves_input_target_source_as_enemy(self) -> None:
        action = AuxiliaryActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=0,
            actionType="CreateBuffAction",
            sourceId="buff_fixture",
            classification=None,
            targetSource="Owner",
            targetGroupKey="",
            count=ScalarSource(1, None, None),
            buffSource="InputTarget",
            inheritSourceSkillCastInfo=False,
            blackboardAssignments={},
            nestedCombatActions=(),
        )

        source = compile_buff_application(action, "fixture")

        self.assertIn("target: 'caster'", source)
        self.assertIn("source: 'enemy'", source)

    def test_buff_application_compiles_unfiltered_instant_team_search_as_party(self) -> None:
        action = AuxiliaryActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=0,
            actionType="CreateBuffAction",
            sourceId="buff_fixture",
            classification=None,
            targetSource="InstantSearch",
            targetGroupKey="",
            count=ScalarSource(1, None, None),
            buffSource="ActionSource",
            inheritSourceSkillCastInfo=False,
            blackboardAssignments={},
            nestedCombatActions=(),
            targetFinderType="CharacterTeamFinder",
        )

        source = compile_buff_application(action, "fixture")

        self.assertIn("target: 'party'", source)

        with self.assertRaisesRegex(ValueError, "unsupported Buff target"):
            compile_buff_application(
                replace(action, targetValidatorTypes=("MainCharacterValidator",)),
                "fixture",
            )

    def test_root_skill_buff_application_accepts_proven_enemy_context(self) -> None:
        action = AuxiliaryActionSource(
            startFrame=9,
            endFrame=10,
            actionIndex=5,
            actionType="CreateBuffAction",
            sourceId="buff_fixture",
            classification=None,
            targetSource="Context",
            targetGroupKey="targets",
            count=ScalarSource(1, None, None),
            buffSource="ActionOwner",
            inheritSourceSkillCastInfo=False,
            blackboardAssignments={},
            nestedCombatActions=(),
        )

        with self.assertRaisesRegex(ValueError, "unsupported Buff target"):
            compile_buff_application(action, "fixture")
        source = compile_buff_application(
            action,
            "fixture",
            context_application_target="enemy",
        )

        self.assertIn("target: 'enemy'", source)

    def test_conditional_buff_application_does_not_assume_action_owner_is_caster(self) -> None:
        condition = SimpleNamespace(
            sourceType="CompareFloat",
            comparison="GE",
            left=ScalarSource(1, None, None),
            right=ScalarSource(1, None, None),
            buffStack=None,
        )
        application = SimpleNamespace(
            buffs=(SimpleNamespace(buffId="buff.fixture", blackboardAssignments={}),),
            targetSource="Source",
            targetGroupKey="",
            count=ScalarSource(1, None, None),
            buffSource="ActionOwner",
            inheritSourceSkillCastInfo=False,
            targetFinderType=None,
            targetValidatorTypes=(),
            targetPostProcessorTypes=(),
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

        with self.assertRaisesRegex(ValueError, "unsupported Buff source 'ActionOwner'"):
            compile_conditional_action(action, "fixture.condition")

        source = compile_conditional_action(
            action,
            "fixture.condition",
            root_skill_context=True,
        )
        self.assertIn("target: 'caster'", source)

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
            "buffEventAction": [
                {
                    "buffEvent": "DuringBuffEnable",
                    "actions": [
                        {
                            "actionData": [aura_action_fixture()],
                        }
                    ],
                }
            ],
        }
        buff["buffEventAction"][0]["actions"][0]["actionData"][0]["buffInput"][0][
            "buffId"
        ] = "buff.missing"
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
        self.assertEqual(len(definitions[1].auraActions), 1)
        aura = definitions[1].auraActions[0]
        self.assertEqual(aura.sourceFile, "buff.test.json")
        self.assertIsNone(aura.startFrame)
        self.assertIsNone(aura.endFrame)
        self.assertEqual(aura.activationSource, "buffEvent")
        self.assertEqual(aura.activationEvent, "DuringBuffEnable")

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
                        "serverActionIndex": 0,
                        "buffs": [{"buffId": child_id, "assignItems": []}],
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

    def test_buff_definitions_fall_back_to_full_export_directory(self) -> None:
        buff = {
            "lifeType": "Limited",
            "duration": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
            "triggerInterval": {"useBlackboardKey": False, "value": -1, "blackboardKey": ""},
            "waitFirstTriggerInterval": True,
            "maxTriggerCnt": {"useBlackboardKey": False, "value": 0, "blackboardKey": ""},
            "stackingSettings": {
                "identifierType": "Id",
                "stackingType": "Unlimited",
                "stackingKey": "",
                "usePriorityKey": False,
                "priorityKey": "",
                "priority": 0,
                "useMaxStackCntKey": False,
                "maxStackCntKey": "",
                "maxStackCnt": 0,
                "isNeedStackEffect": False,
                "negatePriority": False,
                "stackEffects": [],
            },
            "blackboard": [],
            "applyTags": [],
            "tagsAfterTriggerExtendBuffAction": [],
            "timelineActions": [],
            "buffEventAction": [],
            "abilityEventAction": [],
            "igniteEventAction": [],
            "attributeModifier": {"isConvertedAttribute": False, "attributeModifiers": []},
            "damageModifier": [],
            "healModifier": [],
            "poiseModifier": [],
            "globalModifier": [],
            "shieldConfigs": [],
        }
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            primary = root / "BuffData"
            fallback = root / "buff-data-current"
            primary.mkdir()
            fallback.mkdir()
            (fallback / "buff.common.json").write_text(json.dumps(buff), encoding="utf-8")

            definitions = resolve_buff_definitions(
                ("buff.common",),
                (primary, fallback),
            )

        self.assertTrue(definitions[0].sourceAvailable)
        self.assertIsNotNone(definitions[0].lifecycle)

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

    def test_declared_blackboard_preserves_string_identity(self) -> None:
        root = {
            "blackboard": [
                {
                    "key": "nextCombo",
                    "valueDouble": 0,
                    "valueStr": "chr_0003_endminf_attack2",
                    "isDynamic": False,
                }
            ]
        }

        values = parse_declared_blackboard(root, "skill.json")

        self.assertEqual(values[0].value, "chr_0003_endminf_attack2")

    def test_declared_blackboard_rejects_ambiguous_value(self) -> None:
        root = {
            "blackboard": [
                {
                    "key": "ambiguous",
                    "valueDouble": 1,
                    "valueStr": "value",
                    "isDynamic": False,
                }
            ]
        }

        with self.assertRaisesRegex(ValueError, "numeric and string values are both set"):
            parse_declared_blackboard(root, "skill.json")

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
                    "  query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1466867135] },",
                    "  desiredKey: 'count',",
                    "  outputKey: 'conductCnt',",
                    "})",
                ]
            ),
        )

        id_read = BuffBlackboardReadSource(
            startFrame=11,
            endFrame=12,
            actionIndex=1,
            outputKey="attackScale",
            desiredKey="attackScale",
            targetSource="Owner",
            targetGroupKey="",
            buffCheckType="Id",
            buffIds=("buff.example.owner",),
            tagQueryType="hasAny",
            buffTagIds=(),
        )
        compiled_id = compile_buff_blackboard_read(
            id_read,
            "fixture.idRead",
            root_skill_context=True,
        )
        self.assertIn("target: 'caster'", compiled_id)
        self.assertIn("query: { kind: 'id', buffIds: ['buff.example.owner'] }", compiled_id)

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

    def test_root_skill_owner_buff_finish_targets_the_caster(self) -> None:
        finish = BuffFinishSource(
            startFrame=11,
            endFrame=12,
            actionIndex=1,
            targetSource="Owner",
            targetGroupKey="",
            buffCheckType="Id",
            buffIds=("buff.example",),
            tagQueryType="hasAny",
            buffTagIds=(),
            finishAll=True,
            limitSource=False,
            isFinishedEarly=False,
            isAbsorbed=False,
        )

        result = compile_buff_finish(
            finish,
            "fixture.finish",
            root_skill_context=True,
        )

        self.assertIn("target: 'caster'", result)
        with self.assertRaisesRegex(ValueError, "unsupported buff finish target"):
            compile_buff_finish(finish, "fixture.finish")

    def test_input_target_buff_finish_targets_the_enemy(self) -> None:
        finish = BuffFinishSource(
            startFrame=11,
            endFrame=12,
            actionIndex=1,
            targetSource="Target",
            targetGroupKey="ignored_by_target_source",
            buffCheckType="Tag",
            # Tag 是判别字段；该模式下原生数据可能仍携带不参与查询的 ID 列表。
            buffIds=("inactive.id",),
            tagQueryType="hasAny",
            buffTagIds=(1466867135,),
            finishAll=True,
            limitSource=False,
            isFinishedEarly=True,
            isAbsorbed=False,
        )

        result = compile_buff_finish(
            finish,
            "fixture.finish",
            input_target="enemy",
        )

        self.assertIn("target: 'enemy'", result)
        with self.assertRaisesRegex(ValueError, "unsupported buff finish target"):
            compile_buff_finish(finish, "fixture.finish")

    def test_input_target_buff_stack_read_targets_the_enemy(self) -> None:
        read = BuffStackReadPayload(
            "count",
            "Target",
            "ignored_by_target_source",
            "Tag",
            ("",),
            "hasAny",
            (1466867135,),
            "BuffCount",
            False,
        )

        result = compile_buff_stack_read(
            read,
            "fixture.read",
            input_target="enemy",
        )

        self.assertIn("target: 'enemy'", result)
        self.assertIn("kind: 'tag'", result)
        with self.assertRaisesRegex(ValueError, "unsupported Buff target"):
            compile_buff_stack_read(read, "fixture.read")

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

    def test_blackboard_calculation_flattens_single_enemy_channel(self) -> None:
        calculation = {
            "$type": "Example.SimpleCalcBBAction+Data, Example",
            "serverActionIndex": 4,
            "key": "split_scale",
            "operation": "Multiply",
            "value1": {
                "useBlackboardKey": True,
                "value": 0,
                "blackboardKey": "attack_scale",
            },
            "value2": {
                "useBlackboardKey": False,
                "value": 0.4,
                "blackboardKey": "",
            },
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 21,
                        "_endFrame": 27,
                        "_sequenceActionData": {
                            "$type": "Example.ChannelingAction+Data, Example",
                            "isEnable": True,
                            "priorityLevel": "Default",
                            "priorityOffset": 0,
                            "serverActionIndex": 3,
                            "targetSettings": {},
                            "executeEachFrame": True,
                            "triggerInterval": 0.033,
                            "maxCountPerTarget": 1,
                            "targetTriggerInterval": 0,
                            "actionOnTick": {"actionData": [calculation]},
                        },
                    }
                ]
            }
        }

        calculations = parse_blackboard_calculations(
            root,
            "skill.json",
            {"attack_scale": (0.42, 0.84)},
        )

        self.assertEqual(len(calculations), 1)
        self.assertEqual(calculations[0].startFrame, 21)
        self.assertEqual(calculations[0].actionIndex, 4)
        self.assertEqual(calculations[0].key, "split_scale")
        self.assertEqual(calculations[0].left.levelValues, (0.42, 0.84))
        self.assertEqual(calculations[0].right.value, 0.4)

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

    def test_conditional_audit_expands_switch_in_first_match_order(self) -> None:
        def scalar(value: int, key: str = "") -> dict[str, object]:
            return {
                "useBlackboardKey": bool(key),
                "value": value,
                "blackboardKey": key,
            }

        def infliction(element: str) -> dict[str, object]:
            return {
                "$type": "Example.SpellInfliction+Data, Example",
                "inflictionType": element,
                "isExtra": False,
            }

        switch = {
            "$type": "Example.SwitchAction+Data, Example",
            "serverActionIndex": 4,
            "alwaysNext": True,
            "choice": scalar(0, "mode"),
            "options": [
                {"value": scalar(0), "actionData": {"actionData": []}},
                {
                    "value": scalar(1),
                    "actionData": {"actionData": [infliction("Pulse")]},
                },
                {
                    "value": scalar(1),
                    "actionData": {"actionData": [infliction("Natural")]},
                },
            ],
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 3,
                        "_sequenceActionData": {"actionData": [switch]},
                    }
                ]
            }
        }

        action = parse_conditional_actions(root, "switch.json", {})[0]

        self.assertEqual(action.conditions[0].left.blackboardKey, "mode")
        self.assertEqual(action.conditions[0].right.value, 0)
        self.assertEqual(action.succeedActions, ())
        second = action.failActions[0].nestedCondition
        self.assertEqual(second.conditions[0].right.value, 1)
        self.assertEqual(second.succeedActions[0].infliction.element, "electric")
        third = second.failActions[0].nestedCondition
        self.assertEqual(third.succeedActions[0].infliction.element, "nature")
        self.assertEqual(
            collect_compilable_conditional_action_types((action,)),
            {"SwitchAction", "CompareFloat", "SpellInfliction"},
        )
        compiled = compile_conditional_action(action, "switch.condition")
        self.assertIn("kind: 'actionValueCompare'", compiled)
        self.assertLess(
            compiled.index("element: 'electric'"),
            compiled.index("element: 'nature'"),
        )

    def test_conditional_audit_rejects_unsupported_switch_shapes(self) -> None:
        scalar = {"useBlackboardKey": False, "value": 0, "blackboardKey": ""}
        base_switch = {
            "$type": "Example.SwitchAction+Data, Example",
            "serverActionIndex": 1,
            "alwaysNext": True,
            "choice": {"useBlackboardKey": True, "value": 0, "blackboardKey": "mode"},
            "options": [{"value": scalar, "actionData": {"actionData": []}}],
        }

        for field, value, message in (
            ("alwaysNext", False, "only true is supported"),
            ("choice", scalar, "expected Blackboard value"),
            (
                "options",
                [
                    {
                        "value": {
                            "useBlackboardKey": False,
                            "value": 0.5,
                            "blackboardKey": "",
                        },
                        "actionData": {"actionData": []},
                    }
                ],
                "expected literal integer",
            ),
        ):
            switch = dict(base_switch)
            switch[field] = value
            root = {
                "actionGroupData": {
                    "timelineActions": [
                        {
                            "_startFrame": 0,
                            "_endFrame": 1,
                            "_sequenceActionData": {"actionData": [switch]},
                        }
                    ]
                }
            }
            with self.subTest(field=field), self.assertRaisesRegex(ValueError, message):
                parse_conditional_actions(root, "switch.json", {})

    def test_conditional_audit_does_not_silently_drop_fracture_action(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CompareFloat+Data, Example",
                                                "valueA": {
                                                    "useBlackboardKey": False,
                                                    "value": 1,
                                                    "blackboardKey": "",
                                                },
                                                "compare": "Equals",
                                                "valueB": {
                                                    "useBlackboardKey": False,
                                                    "value": 1,
                                                    "blackboardKey": "",
                                                },
                                            }
                                        ]
                                    },
                                    "succeedActions": {
                                        "actionData": [fracture_action_fixture()]
                                    },
                                    "failActions": {"actionData": []},
                                }
                            ]
                        },
                    }
                ]
            }
        }

        action = parse_conditional_actions(root, "fracture.json", {})[0]
        self.assertEqual(action.succeedActions[0].actionType, "FractureAction")
        payload = action.succeedActions[0].physicalInfliction
        self.assertIsNotNone(payload)
        self.assertEqual(payload.physicalType, "fracture")
        self.assertEqual(payload.target.targetGroupKey, "smart_target")
        self.assertEqual(payload.blowOffDistance.value, 3)
        with self.assertRaisesRegex(ValueError, "unsupported conditional leaf 'FractureAction'"):
            compile_conditional_action(action, "fracture.condition")

    def test_root_fracture_action_preserves_timing_and_spatial_evidence(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 17,
                        "_endFrame": 19,
                        "_sequenceActionData": {"actionData": [fracture_action_fixture()]},
                    }
                ]
            }
        }

        parsed = parse_physical_inflictions(root, "fracture.json", {})

        self.assertEqual(len(parsed), 1)
        self.assertEqual((parsed[0].startFrame, parsed[0].endFrame), (17, 19))
        self.assertEqual(parsed[0].actionIndex, 12)
        self.assertEqual(parsed[0].payload.directionType, "SourceToTarget")
        self.assertTrue(parsed[0].payload.clampToXZ)

    def test_conditional_audit_preserves_do_once_resource_gain(self) -> None:
        compare = {
            "$type": "Example.CompareFloat+Data, Example",
            "valueA": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
            "compare": "Equals",
            "valueB": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
        }
        gain = {
            "$type": "Example.ObtainCostAction+Data, Example",
            "serverActionIndex": 3,
            "costType": "Atb",
            "isPercentValue": False,
            "useUspRecoverTag": False,
            "uspRecoverTag": {"tagId": 0},
            "ignoreUspGainScalar": False,
            "atbSourceType": "NormalAttack",
            "atbGainMethod": "Gain",
            "costValue": {"useBlackboardKey": False, "value": 10, "blackboardKey": ""},
            "coefficient": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
            "atbOnlyMainChar": False,
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 8,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {"actionData": [compare]},
                                    "succeedActions": {
                                        "actionData": [
                                            {
                                                "$type": "Example.DoOnceAction+Data, Example",
                                                "serverActionIndex": 2,
                                                "sequenceActionData": {"actionData": [gain]},
                                            }
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

        condition = parse_conditional_actions(root, "once.json", {})[0]
        once_action = condition.succeedActions[0]

        self.assertEqual(once_action.actionType, "DoOnceAction")
        self.assertTrue(once_action.onceScopeKey.startswith("do-once:"))
        self.assertEqual(once_action.onceActions[0].actionType, "ObtainCostAction")
        self.assertEqual(
            collect_compilable_conditional_action_types((condition,)),
            {"IfElseAction", "CompareFloat", "DoOnceAction", "ObtainCostAction"},
        )
        compiled = compile_conditional_action(condition, "once.condition")
        self.assertIn("once(\n", compiled)
        self.assertIn("'do-once:", compiled)
        self.assertIn("step('changeResource'", compiled)

    def test_root_do_once_reuses_scope_across_projected_frames(self) -> None:
        gain = {
            "$type": "Example.ObtainCostAction+Data, Example",
            "serverActionIndex": 4,
            "costType": "Atb",
            "isPercentValue": False,
            "useUspRecoverTag": False,
            "uspRecoverTag": {"tagId": 0},
            "ignoreUspGainScalar": False,
            "atbSourceType": "Skill",
            "atbGainMethod": "Gain",
            "costValue": {"useBlackboardKey": False, "value": 8, "blackboardKey": ""},
            "coefficient": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
            "atbOnlyMainChar": False,
        }
        shared_once = {
            "$type": "Example.DoOnceAction+Data, Example",
            "serverActionIndex": 3,
            "sequenceActionData": {"actionData": [gain]},
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": frame,
                        "_endFrame": frame,
                        "_sequenceActionData": {"actionData": [shared_once]},
                    }
                    for frame in (2, 5)
                ]
            }
        }

        actions = parse_conditional_actions(root, "root-once.json", {})

        self.assertEqual([action.startFrame for action in actions], [2, 5])
        self.assertEqual(actions[0].onceScopeKey, actions[1].onceScopeKey)
        self.assertEqual(
            collect_compilable_conditional_action_types(actions),
            {"DoOnceAction", "ObtainCostAction"},
        )
        self.assertTrue(
            compile_conditional_action(actions[0], "root-once.action").startswith("once(\n")
        )

    def test_single_enemy_foreach_exposes_root_and_conditional_timed_markers(self) -> None:
        def marker(index: int) -> dict[str, object]:
            return {
                "$type": "Example.CreateTimedMarker+Data, Example",
                "serverActionIndex": index,
                "targetSettings": {"targetSource": "Owner", "targetGroupKey": ""},
                "markerId": {
                    "useBlackboardKey": False,
                    "value": f"marker-{index}",
                    "blackboardKey": "",
                },
                "duration": {
                    "useBlackboardKey": False,
                    "value": 1,
                    "blackboardKey": "",
                },
                "autoFinishByAction": False,
                "useTimeDilationDt": False,
            }

        def for_each(child: dict[str, object], index: int) -> dict[str, object]:
            return {
                "$type": "Example.ForEachAction+Data, Example",
                "isEnable": True,
                "priorityLevel": "Default",
                "priorityOffset": 0,
                "serverActionIndex": index,
                "target": {"targetSource": "Target", "targetGroupKey": ""},
                "action": {"actionData": [child]},
            }

        compare = {
            "$type": "Example.CompareFloat+Data, Example",
            "valueA": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
            "compare": "Equals",
            "valueB": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 2,
                        "_sequenceActionData": {"actionData": [for_each(marker(3), 2)]},
                    },
                    {
                        "_startFrame": 5,
                        "_endFrame": 5,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 4,
                                    "conditionAction": {"actionData": [compare]},
                                    "succeedActions": {
                                        "actionData": [for_each(marker(6), 5)]
                                    },
                                    "failActions": {"actionData": []},
                                }
                            ]
                        },
                    },
                ]
            }
        }

        actions = parse_conditional_actions(root, "foreach-marker.json", {})

        self.assertEqual([action.startFrame for action in actions], [2, 5])
        self.assertEqual(
            collect_compilable_conditional_action_types(actions),
            {"CreateTimedMarker", "IfElseAction", "CompareFloat"},
        )
        for index, action in enumerate(actions):
            compiled = compile_conditional_action(
                action,
                f"foreach-marker.action[{index}]",
                root_skill_context=True,
            )
            self.assertIn("step('createTimedMarker'", compiled)

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
                                                "assignBlackboard": True,
                                                "assignEntityBlackboard": False,
                                                "assignPairs": [],
                                                "castSkillOnHit": True,
                                                "projectileSkillId": "skill.projectile.hit",
                                            },
                                            {
                                                "$type": "Example.SpawnAbilityEntity+Data, Example",
                                                "abilityEntityId": "entity.test",
                                                "abilityEntitySkillId": "skill.entity.hit",
                                                "assignBlackboard": False,
                                                "assignEntityBlackboard": False,
                                                "assignPairs": [],
                                                "setAbilityEntitySource": True,
                                                "abilityEntitySource": "ActionSource",
                                                "abilityEntitySourceContextKey": "",
                                                "setAbilityEntityTarget": False,
                                                "overrideDuration": False,
                                                "saveToContext": False,
                                                "contextKey": "",
                                                "dieWhenSourceDie": False,
                                                "dieOnEnd": False,
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
        self.assertEqual(
            actions[2].projectileLaunch.skillTriggers,
            (ProjectileSkillTriggerSource("hit", "skill.projectile.hit"),),
        )
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

    def test_health_condition_parser_and_compiler_preserve_native_semantics(self) -> None:
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
                                                "$type": "Example.CheckHp+Data, Example",
                                                "hpOwner": {
                                                    "targetSource": "Context",
                                                    "targetGroupKey": "smart_target",
                                                },
                                                "compare": "GT",
                                                "isRatio": True,
                                                "value": {
                                                    "useBlackboardKey": True,
                                                    "value": 0,
                                                    "blackboardKey": "healthThreshold",
                                                },
                                            }
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

        condition = parse_conditional_actions(
            root,
            "skill.json",
            {"healthThreshold": (0.25,) * 12},
        )[0].conditions[0]

        self.assertTrue(condition.supported)
        self.assertEqual(condition.health.targetSource, "Context")
        self.assertEqual(condition.health.targetGroupKey, "smart_target")
        self.assertEqual(condition.health.comparison, "GT")
        self.assertTrue(condition.health.isRatio)
        self.assertEqual(condition.health.value.blackboardKey, "healthThreshold")
        compiled = compile_combat_condition_group((condition,), "fixture.conditions")
        self.assertIn("kind: 'healthCompare'", compiled)
        self.assertIn("target: 'enemy'", compiled)
        self.assertIn("valueType: 'ratio'", compiled)
        self.assertIn("operator: 'greater'", compiled)
        self.assertIn("key: 'healthThreshold'", compiled)

    def test_skill_has_hit_requires_prior_root_skill_damage(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 31,
                        "_endFrame": 31,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 72,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckSkillHasHit+Data, Example",
                                                "serverActionIndex": 73,
                                            }
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
        condition = parse_conditional_actions(root, "skill.json", {})[0].conditions[0]

        self.assertTrue(condition.supported)
        self.assertIsInstance(condition.skillHasHit, SkillHasHitConditionSource)
        with self.assertRaisesRegex(ValueError, "no prior guaranteed damage"):
            compile_combat_condition_group(
                (condition,), "fixture.conditions", root_skill_context=True
            )
        self.assertEqual(
            compile_combat_condition_group(
                (condition,),
                "fixture.conditions",
                root_skill_context=True,
                skill_has_output_damage=True,
            ),
            "{ kind: 'singleEnemyPresent' }",
        )

        schedule = (
            ResolvedScheduleItemSource(
                frame=31,
                actionOrder=(71,),
                itemType="damage",
                sourcePath=("root_skill",),
                payload=SimpleNamespace(),
            ),
            ResolvedScheduleItemSource(
                frame=31,
                actionOrder=(72,),
                itemType="condition",
                sourcePath=("timeline",),
                payload=SimpleNamespace(),
            ),
            ResolvedScheduleItemSource(
                frame=31,
                actionOrder=(74,),
                itemType="damage",
                sourcePath=("root_skill",),
                payload=SimpleNamespace(),
            ),
        )
        self.assertTrue(root_skill_has_output_damage_before(schedule, 1, "root_skill"))
        self.assertFalse(root_skill_has_output_damage_before(schedule, 0, "root_skill"))
        self.assertFalse(root_skill_has_output_damage_before(schedule, 1, "child_skill"))

    def test_health_condition_compiler_rejects_unmodeled_target_groups(self) -> None:
        condition = SimpleNamespace(
            sourceType="CheckHp",
            health=SimpleNamespace(
                targetSource="InstantSearch",
                targetGroupKey="CureTarget",
                comparison="LT",
                isRatio=True,
                value=ScalarSource(0.99, None, None),
            ),
        )

        with self.assertRaisesRegex(ValueError, "unsupported health target"):
            compile_combat_condition_group((condition,), "fixture.conditions")

    def test_health_condition_resolves_a_prior_enemy_target_group(self) -> None:
        condition = SimpleNamespace(
            sourceType="CheckHp",
            health=SimpleNamespace(
                targetSource="Context",
                targetGroupKey="maintar",
                comparison="LT",
                isRatio=True,
                value=ScalarSource(0.5, None, None),
            ),
        )
        action = SimpleNamespace(
            startFrame=5,
            actionIndex=2,
            actionPath=("timelineActions", "0", "actionData", "1"),
        )
        write = TargetGroupWriteSource(
            startFrame=5,
            endFrame=5,
            actionIndex=1,
            actionPath=("timelineActions", "0", "actionData", "0"),
            targetGroupKey="maintar",
            producerType="FindTargetAction",
            finderType="HitBoxFinder",
            finderFactionTarget="Anti",
            finderTargetObjectType="Normal",
            finderCheckAlive=True,
            validatorTypes=(),
            postProcessorTypes=(),
            inputTargets=(),
            intervalSeconds=None,
        )

        compiled = compile_combat_condition_group(
            (condition,),
            "fixture.conditions",
            action=action,
            target_group_writes=(write,),
        )

        self.assertIn("kind: 'healthCompare'", compiled)
        self.assertIn("target: 'enemy'", compiled)

    def test_buff_stack_by_tag_preserves_target_and_dynamic_threshold(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckBuffStackNumByTag+Data, Example",
                                                "checkTarget": {
                                                    "targetSource": "Target",
                                                    "targetGroupKey": "ignored_by_native_action",
                                                },
                                                "tagQuery": {
                                                    "queryType": "HasAny",
                                                    "tags": [{"tagId": 1}, {"tagId": 2}],
                                                },
                                                "buffStackNumType": "BuffCount",
                                                "compareType": "LE",
                                                "value": {
                                                    "useBlackboardKey": True,
                                                    "value": 0,
                                                    "blackboardKey": "num",
                                                },
                                            }
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

        condition = parse_conditional_actions(root, "skill.json", {})[0].conditions[0]
        compiled = compile_combat_condition_group(
            (condition,),
            "fixture.conditions",
            input_target="enemy",
        )

        self.assertTrue(condition.supported)
        self.assertEqual(condition.buffStack.targetSource, "Target")
        self.assertEqual(condition.buffStack.targetGroupKey, "ignored_by_native_action")
        self.assertEqual(condition.buffStack.buffTagIds, (1, 2))
        self.assertIn("kind: 'buffStackCompare'", compiled)
        self.assertIn("key: 'num'", compiled)

        with self.assertRaisesRegex(ValueError, "unsupported Buff stack query target"):
            compile_combat_condition_group((condition,), "fixture.conditions")

    def test_buff_target_uses_the_input_enemy_and_ignores_root_group_key(self) -> None:
        arguments = {
            "buff_id": "buff.example",
            "blackboard_assignments": {},
            "target_source": "Target",
            "target_group_key": "",
            "count": ScalarSource(1, None, None),
            "buff_source": "ActionSource",
            "inherit_source_skill_cast_info": True,
            "path": "fixture.buff",
        }

        compiled = compile_buff_application_values(
            **arguments,
            root_skill_context=False,
            input_target="enemy",
        )

        self.assertIn("target: 'enemy'", compiled)
        root_arguments = {**arguments, "target_group_key": "ignored_by_native_action"}
        root_compiled = compile_buff_application_values(
            **root_arguments,
            root_skill_context=True,
        )
        self.assertIn("target: 'enemy'", root_compiled)

    def test_single_buff_application_can_use_a_runtime_count(self) -> None:
        arguments = {
            "buff_id": "buff.example",
            "blackboard_assignments": {},
            "target_source": "Target",
            "target_group_key": "",
            "count": ScalarSource(1, "buff_stack", None),
            "buff_source": "ActionSource",
            "inherit_source_skill_cast_info": True,
            "root_skill_context": False,
            "input_target": "enemy",
            "path": "fixture.buff",
        }

        compiled = compile_buff_application_values(
            **arguments,
            allow_dynamic_count=True,
        )

        self.assertIn("count: { kind: 'blackboard', key: 'buff_stack' }", compiled)
        with self.assertRaisesRegex(ValueError, "literal application count"):
            compile_buff_application_values(**arguments)

    def test_entity_tag_condition_preserves_query_and_requires_target_provenance(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckTagMatch+Data, Example",
                                                "checkTarget": {
                                                    "targetSource": "Target",
                                                    "targetGroupKey": "ignored_by_native_action",
                                                },
                                                "query": {
                                                    "queryType": "ExceptAny",
                                                    "tags": [{"tagId": 11}, {"tagId": 22}],
                                                },
                                            }
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

        condition = parse_conditional_actions(root, "skill.json", {})[0].conditions[0]
        compiled = compile_combat_condition_group(
            (condition,),
            "fixture.conditions",
            input_target="enemy",
        )

        self.assertTrue(condition.supported)
        self.assertEqual(condition.entityTag.targetSource, "Target")
        self.assertEqual(condition.entityTag.tagQueryType, "exceptAny")
        self.assertEqual(condition.entityTag.tagIds, (11, 22))
        self.assertIn("kind: 'entityTagMatch'", compiled)
        self.assertIn("target: 'enemy'", compiled)
        with self.assertRaisesRegex(ValueError, "unsupported entity tag target"):
            compile_combat_condition_group((condition,), "fixture.conditions")

    def test_projectile_child_buff_condition_reads_the_hit_enemy(self) -> None:
        condition = SimpleNamespace(
            sourceType="CheckBuffStackNumAdvanced",
            buffStack=SimpleNamespace(
                targetSource="Target",
                targetGroupKey="",
                buffCheckType="Tag",
                buffIds=(),
                buffTagIds=(-1411846745,),
                countType="BuffCount",
                comparison="GE",
                value=ScalarSource(2, None, None),
                limitSkillCastId=False,
                tagQueryType="hasAny",
            ),
        )

        compiled = compile_combat_condition_group(
            (condition,),
            "fixture.conditions",
            input_target="enemy",
        )

        self.assertIn("kind: 'buffStackCompare'", compiled)
        self.assertIn("target: 'enemy'", compiled)
        with self.assertRaisesRegex(ValueError, "unsupported Buff stack query"):
            compile_combat_condition_group(
                (condition,),
                "fixture.conditions",
            )

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

    def test_buff_query_kind_is_independent_from_the_resolved_target(self) -> None:
        caster_tag = SimpleNamespace(
            sourceType="CheckBuffStackNumAdvanced",
            buffStack=SimpleNamespace(
                targetSource="Source",
                targetGroupKey="",
                buffCheckType="Tag",
                buffIds=(),
                buffTagIds=(101,),
                countType="BuffCount",
                comparison="GE",
                value=ScalarSource(1, None, None),
                limitSkillCastId=False,
                tagQueryType="hasAny",
            ),
        )
        enemy_id = SimpleNamespace(
            sourceType="CheckBuffStackNumAdvanced",
            buffStack=SimpleNamespace(
                targetSource="Target",
                targetGroupKey="ignored_by_native_action",
                buffCheckType="Id",
                buffIds=("buff.example.enemy",),
                buffTagIds=(),
                countType="BuffCount",
                comparison="GE",
                value=ScalarSource(1, None, None),
                limitSkillCastId=False,
                tagQueryType="hasAny",
            ),
        )

        caster_compiled = compile_combat_condition_group(
            (caster_tag,), "fixture.caster"
        )
        enemy_compiled = compile_combat_condition_group(
            (enemy_id,),
            "fixture.enemy",
            input_target="enemy",
        )

        self.assertIn("kind: 'buffStackCompare'", caster_compiled)
        self.assertIn("target: 'caster'", caster_compiled)
        self.assertIn("kind: 'buffIdStackCompare'", enemy_compiled)
        self.assertIn("target: 'enemy'", enemy_compiled)

    def test_simple_buff_stack_condition_normalizes_to_an_id_query(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckBuffStackNum+Data, Example",
                                                "checkTarget": {
                                                    "targetSource": "Owner",
                                                    "targetGroupKey": "",
                                                },
                                                "buffId": {"buffId": "buff.example.energy"},
                                                "compareType": "GE",
                                                "value": {
                                                    "useBlackboardKey": True,
                                                    "value": 0,
                                                    "blackboardKey": "requiredStacks",
                                                },
                                            }
                                        ]
                                    },
                                    "succeedActions": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CreateBuffAction+Data, Example",
                                                "serverActionIndex": 2,
                                                "buffs": [
                                                    {
                                                        "buffId": "buff.example.result",
                                                        "assignItems": [],
                                                    }
                                                ],
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
                                                "inheritSourceSkillCastInfo": False,
                                            }
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

        condition = parse_conditional_actions(
            root,
            "fixture.json",
            {"requiredStacks": (1, 2)},
        )[0].conditions[0]
        compiled = compile_combat_condition_group(
            (condition,),
            "fixture.conditions",
            root_skill_context=True,
        )

        self.assertEqual(condition.buffStack.buffIds, ("buff.example.energy",))
        self.assertIn("kind: 'buffIdStackCompare'", compiled)
        self.assertIn("key: 'requiredStacks'", compiled)

    def test_timed_marker_condition_and_creation_preserve_native_polarity(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckTimedMarkerCondition+Data, Example",
                                                "checkTarget": {
                                                    "targetSource": "Owner",
                                                    "targetGroupKey": "",
                                                },
                                                "id": "voice-cooldown",
                                                "blackboardKey": "",
                                                "useBlackboardKey": False,
                                                "returnTrueIfNotExists": True,
                                            }
                                        ]
                                    },
                                    "succeedActions": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CreateTimedMarker+Data, Example",
                                                "serverActionIndex": 2,
                                                "targetSettings": {
                                                    "targetSource": "Owner",
                                                    "targetGroupKey": "",
                                                },
                                                "markerId": {
                                                    "useBlackboardKey": False,
                                                    "value": "voice-cooldown",
                                                    "blackboardKey": "",
                                                },
                                                "duration": {
                                                    "useBlackboardKey": False,
                                                    "value": 5,
                                                    "blackboardKey": "",
                                                },
                                                "autoFinishByAction": False,
                                                "useTimeDilationDt": False,
                                            }
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

        action = parse_conditional_actions(root, "fixture.json", {})[0]
        compiled = compile_conditional_action(
            action,
            "fixture.condition",
            root_skill_context=True,
        )

        self.assertIn("kind: 'not'", compiled)
        self.assertIn("kind: 'timedMarkerPresent'", compiled)
        self.assertIn("step('createTimedMarker'", compiled)
        self.assertEqual(compiled.count("target: 'caster'"), 2)
        self.assertIn("durationSeconds: { kind: 'constant', value: 5 }", compiled)
        self.assertIn("autoFinishByAction: false", compiled)

        condition_target = root["actionGroupData"]["timelineActions"][0][
            "_sequenceActionData"
        ]["actionData"][0]
        condition_target["conditionAction"]["actionData"][0]["checkTarget"][
            "targetSource"
        ] = "Target"
        condition_target["succeedActions"]["actionData"][0]["targetSettings"][
            "targetSource"
        ] = "Target"
        enemy_action = parse_conditional_actions(root, "fixture.json", {})[0]
        enemy_compiled = compile_conditional_action(
            enemy_action,
            "fixture.condition",
            root_skill_context=True,
            input_target="enemy",
        )

        self.assertEqual(enemy_compiled.count("target: 'enemy'"), 2)

    def test_global_cooldown_condition_and_write_use_caster_timed_marker(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckGlobalCDTimerAction+Data, Example",
                                                "target": {
                                                    "targetSource": "Owner",
                                                    "targetGroupKey": "",
                                                },
                                                "buffId": "buff.example.cooldown",
                                            }
                                        ]
                                    },
                                    "succeedActions": {
                                        "actionData": [
                                            {
                                                "$type": "Example.AddGlobalCDTimer+Data, Example",
                                                "serverActionIndex": 2,
                                                "target": {
                                                    "targetSource": "Owner",
                                                    "targetGroupKey": "",
                                                },
                                                "buffId": "buff.example.cooldown",
                                                "cdTime": {
                                                    "useBlackboardKey": True,
                                                    "value": 0,
                                                    "blackboardKey": "cooldown",
                                                },
                                            }
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

        action = parse_conditional_actions(
            root,
            "fixture.json",
            {"cooldown": (8,)},
        )[0]
        compiled = compile_conditional_action(
            action,
            "fixture.condition",
            root_skill_context=True,
        )

        self.assertEqual(
            action.conditions[0].globalCooldown.buffId,
            "buff.example.cooldown",
        )
        self.assertIn("kind: 'not'", compiled)
        self.assertIn("kind: 'timedMarkerPresent'", compiled)
        self.assertIn("markerId: 'buff.example.cooldown'", compiled)
        self.assertIn("step('createTimedMarker'", compiled)
        self.assertIn("key: 'cooldown'", compiled)
        self.assertIn("autoFinishByAction: false", compiled)

    def test_camera_condition_with_audited_presentation_write_is_omitted(self) -> None:
        condition = ConditionSource(
            sourceType="CheckSkillCameraMotionFree",
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
        )
        mutation = BlackboardMutationPayload(
            key="isWall",
            operation="Assign",
            value=ScalarSource(1, None, None),
        )
        action = ConditionalActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=20,
            actionPath=("timelineActions", "[3]"),
            conditions=(condition,),
            succeedActions=(),
            failActions=(
                ConditionalBranchActionSource(
                    actionType="ModifyDynamicBlackboard",
                    actionIndex=0,
                    blackboardMutation=mutation,
                ),
            ),
        )

        self.assertTrue(is_presentation_only_camera_condition(action))
        self.assertEqual(compile_conditional_action(action, "fixture.condition"), "sequence()")

    def test_camera_condition_with_unexpected_blackboard_key_is_not_omitted(self) -> None:
        condition = ConditionSource(
            sourceType="CheckSkillCameraMotionFree",
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
        )
        action = ConditionalActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=20,
            actionPath=("timelineActions", "[3]"),
            conditions=(condition,),
            succeedActions=(
                ConditionalBranchActionSource(
                    actionType="ModifyDynamicBlackboard",
                    actionIndex=0,
                    blackboardMutation=BlackboardMutationPayload(
                        key="damageScale",
                        operation="Assign",
                        value=ScalarSource(1, None, None),
                    ),
                ),
            ),
            failActions=(),
        )

        self.assertFalse(is_presentation_only_camera_condition(action))
        with self.assertRaisesRegex(ValueError, "CheckSkillCameraMotionFree"):
            compile_conditional_action(action, "fixture.condition")

    def test_camera_condition_with_combat_leaf_is_not_omitted(self) -> None:
        condition = ConditionSource(
            sourceType="CheckSkillCameraMotionFree",
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
        )
        action = ConditionalActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=20,
            actionPath=("timelineActions", "[3]"),
            conditions=(condition,),
            succeedActions=(
                ConditionalBranchActionSource(
                    actionType="DamageAction",
                    actionIndex=0,
                    damageUnits=(),
                ),
            ),
            failActions=(),
        )

        self.assertFalse(is_presentation_only_camera_condition(action))

    def test_blackboard_write_without_camera_condition_is_not_omitted(self) -> None:
        condition = ConditionSource(
            sourceType="CompareFloat",
            supported=True,
            comparison="Equals",
            left=ScalarSource(1, None, None),
            right=ScalarSource(1, None, None),
            skillTypes=(),
        )
        action = ConditionalActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=20,
            actionPath=("timelineActions", "[3]"),
            conditions=(condition,),
            succeedActions=(
                ConditionalBranchActionSource(
                    actionType="ModifyDynamicBlackboard",
                    actionIndex=0,
                    blackboardMutation=BlackboardMutationPayload(
                        key="isWall",
                        operation="Assign",
                        value=ScalarSource(1, None, None),
                    ),
                ),
            ),
            failActions=(),
        )

        self.assertFalse(is_presentation_only_camera_condition(action))

    def test_root_skill_owner_buff_condition_targets_the_caster(self) -> None:
        condition = SimpleNamespace(
            sourceType="CheckBuffStackNumAdvanced",
            comparison=None,
            left=None,
            right=None,
            buffStack=SimpleNamespace(
                targetSource="Owner",
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

        result = compile_combat_condition_group(
            (condition,),
            "fixture.conditions",
            root_skill_context=True,
        )

        self.assertIn("target: 'caster'", result)
        with self.assertRaisesRegex(ValueError, "unsupported Buff stack query target"):
            compile_combat_condition_group((condition,), "fixture.conditions")

    def test_condition_parser_and_compiler_preserve_main_operator_semantics(self) -> None:
        condition = {
            "$type": "Example.CheckMainCharacterCondition+Data, Example",
            "checkTarget": {
                "targetSource": "Source",
                "targetGroupKey": "tar",
            },
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 2,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {"actionData": [condition]},
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

        parsed = parse_conditional_actions(root, "fixture.json", {})[0].conditions[0]

        self.assertTrue(parsed.supported)
        self.assertEqual(
            parsed.mainOperator,
            MainOperatorConditionSource(targetSource="Source", targetGroupKey="tar"),
        )
        self.assertEqual(
            compile_combat_condition_group((parsed,), "fixture.conditions"),
            "{ kind: 'casterControlled' }",
        )

    def test_enemy_rank_condition_preserves_native_rank_mask(self) -> None:
        condition = {
            "$type": "Example.CheckEnemyRank+Data, Example",
            "target": target_settings_fixture("Context", target_group_key="smart_target"),
            "enemyRankSet": "Elite, Boss",
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 2,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {"actionData": [condition]},
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

        parsed = parse_conditional_actions(root, "fixture.json", {})[0].conditions[0]

        self.assertEqual(parsed.enemyRank.rankMask, 6)
        self.assertEqual(
            compile_combat_condition_group((parsed,), "fixture.conditions"),
            "{ kind: 'enemyRankIn', ranks: ['elite', 'boss'] }",
        )

        condition["enemyRankSet"] = 0
        parsed = parse_conditional_actions(root, "fixture.json", {})[0].conditions[0]
        self.assertEqual(parsed.enemyRank.rankMask, 0)
        self.assertEqual(
            compile_combat_condition_group((parsed,), "fixture.conditions"),
            "{ kind: 'enemyRankIn', ranks: [] }",
        )

        condition["enemyRankSet"] = 8
        with self.assertRaisesRegex(ValueError, "EnemyRankSet bits"):
            parse_conditional_actions(root, "fixture.json", {})

    def test_target_equality_between_input_and_main_target_is_guaranteed(self) -> None:
        condition = {
            "$type": "Example.CheckTargetsEqual+Data, Example",
            "firstTargetSettings": target_settings_fixture("Target"),
            "secondTargetSettings": target_settings_fixture(
                "InstantSearch", finder_type="MainTargetFinder"
            ),
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 2,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {"actionData": [condition]},
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

        parsed = parse_conditional_actions(root, "fixture.json", {})[0].conditions[0]

        self.assertEqual(parsed.sourceType, "CheckTargetsEqual")
        self.assertTrue(is_guaranteed_single_enemy_condition(parsed))
        self.assertEqual(
            compile_combat_condition_group((parsed,), "fixture.conditions"),
            "{ kind: 'singleEnemyPresent' }",
        )

        condition["secondTargetSettings"]["selectorData"]["validatorData"] = [
            {"$type": "Example.Selector+TagValidator+Data, Example"}
        ]
        filtered = parse_conditional_actions(root, "fixture.json", {})[0].conditions[0]
        self.assertFalse(is_guaranteed_single_enemy_condition(filtered))
        with self.assertRaisesRegex(ValueError, "unsupported condition type"):
            compile_combat_condition_group((filtered,), "fixture.conditions")

    def test_root_operator_enemy_distance_uses_zero_distance_model(self) -> None:
        condition = {
            "$type": "Example.CheckDistanceCondition+Data, Example",
            "source": target_settings_fixture("Owner"),
            "target": target_settings_fixture("Target"),
            "distance": 10.0,
            "lessThan": True,
            "includeTargetRadius": True,
            "containsHittableObj": False,
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 2,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {"actionData": [condition]},
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

        parsed = parse_conditional_actions(root, "fixture.json", {})[0].conditions[0]

        with self.assertRaisesRegex(ValueError, "zero-distance model"):
            compile_combat_condition_group((parsed,), "fixture.conditions")
        self.assertEqual(
            compile_combat_condition_group(
                (parsed,), "fixture.conditions", root_skill_context=True
            ),
            "{ kind: 'singleEnemyPresent' }",
        )

        condition["target"]["targetSource"] = "Context"
        condition["target"]["targetGroupKey"] = "smart_target"
        smart_target = parse_conditional_actions(root, "fixture.json", {})[0].conditions[0]
        self.assertEqual(
            compile_combat_condition_group(
                (smart_target,), "fixture.conditions", root_skill_context=True
            ),
            "{ kind: 'singleEnemyPresent' }",
        )

        condition["lessThan"] = False
        farther_than = parse_conditional_actions(root, "fixture.json", {})[0].conditions[0]
        self.assertEqual(
            compile_combat_condition_group(
                (farther_than,), "fixture.conditions", root_skill_context=True
            ),
            "{ kind: 'not', condition: { kind: 'singleEnemyPresent' } }",
        )

    def test_ability_entity_owner_to_input_distance_uses_zero_distance_model(self) -> None:
        condition = {
            "$type": "Example.CheckDistanceCondition+Data, Example",
            "source": target_settings_fixture("Owner"),
            "target": target_settings_fixture("Target"),
            "distance": 4.0,
            "lessThan": True,
            "includeTargetRadius": False,
            "containsHittableObj": False,
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 0,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {"actionData": [condition]},
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
        parsed = parse_conditional_actions(root, "fixture.json", {})[0].conditions[0]

        with self.assertRaisesRegex(ValueError, "zero-distance model"):
            compile_combat_condition_group(
                (parsed,),
                "fixture.conditions",
                input_target="enemy",
            )
        self.assertEqual(
            compile_combat_condition_group(
                (parsed,),
                "fixture.conditions",
                input_target="enemy",
                ability_entity_current_target=True,
            ),
            "{ kind: 'singleEnemyPresent' }",
        )

    def test_direct_main_operator_guard_is_assumed_to_pass_for_a_placed_skill(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 2,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.CheckMainCharacterCondition+Data, Example",
                                    "isEnable": True,
                                    "serverActionIndex": 1,
                                    "checkTarget": {
                                        "targetSource": "Source",
                                        "targetGroupKey": "",
                                    },
                                },
                                {
                                    "$type": "Example.ObtainCostAction+Data, Example",
                                    "isEnable": True,
                                    "serverActionIndex": 2,
                                },
                            ]
                        },
                    }
                ]
            }
        }

        unresolved = collect_unresolved_combat_actions(parse_timeline(root, "fixture.json"))
        self.assertNotIn("CheckMainCharacterCondition", unresolved)
        self.assertIn("ObtainCostAction", unresolved)

    def test_direct_distance_guard_is_assumed_to_pass_for_a_placed_skill(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 2,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.CheckDistanceCondition+Data, Example",
                                    "isEnable": True,
                                    "serverActionIndex": 1,
                                },
                                {
                                    "$type": "Example.DamageAction+Data, Example",
                                    "isEnable": True,
                                    "serverActionIndex": 2,
                                },
                            ]
                        },
                    }
                ]
            }
        }

        unresolved = collect_unresolved_combat_actions(parse_timeline(root, "fixture.json"))
        self.assertNotIn("CheckDistanceCondition", unresolved)
        self.assertIn("DamageAction", unresolved)

        root["actionGroupData"]["timelineActions"][0]["_sequenceActionData"][
            "actionData"
        ].reverse()
        self.assertNotIn(
            "CheckDistanceCondition",
            collect_unresolved_combat_actions(parse_timeline(root, "fixture.json")),
        )

    def test_nested_distance_guard_remains_an_unresolved_sequence_action(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 2,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.ForEachAction+Data, Example",
                                    "isEnable": True,
                                    "priorityLevel": "Default",
                                    "priorityOffset": 0,
                                    "serverActionIndex": 1,
                                    "target": {
                                        "targetSource": "Target",
                                        "targetGroupKey": "",
                                    },
                                    "action": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckDistanceCondition+Data, Example",
                                                "isEnable": True,
                                                "serverActionIndex": 2,
                                            },
                                            {
                                                "$type": "Example.DamageAction+Data, Example",
                                                "isEnable": True,
                                                "serverActionIndex": 3,
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

        unresolved = collect_unresolved_combat_actions(parse_timeline(root, "fixture.json"))
        self.assertIn("CheckDistanceCondition", unresolved)
        self.assertIn("DamageAction", unresolved)
        self.assertEqual(
            parse_conditional_actions(
                root,
                "fixture.json",
                {},
                include_for_each_sequence_guards=True,
            ),
            (),
        )

    def test_for_each_sequence_guard_owns_its_tail_actions(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 7,
                        "_endFrame": 7,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.ForEachAction+Data, Example",
                                    "isEnable": True,
                                    "priorityLevel": "Default",
                                    "priorityOffset": 0,
                                    "serverActionIndex": 1,
                                    "target": {
                                        "targetSource": "Target",
                                        "targetGroupKey": "",
                                    },
                                    "action": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckDistanceCondition+Data, Example",
                                                "isEnable": True,
                                                "serverActionIndex": 2,
                                                "source": target_settings_fixture("Owner"),
                                                "target": target_settings_fixture("Target"),
                                                "distance": 50,
                                                "lessThan": True,
                                                "includeTargetRadius": False,
                                                "containsHittableObj": False,
                                            },
                                            {
                                                "$type": "Example.SpellInfliction+Data, Example",
                                                "isEnable": True,
                                                "serverActionIndex": 3,
                                                "inflictionType": "Fire",
                                                "isExtra": False,
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

        parsed = parse_conditional_actions(
            root,
            "fixture.json",
            {},
            include_for_each_sequence_guards=True,
        )
        self.assertEqual(len(parsed), 1)
        self.assertIsInstance(parsed[0], UnconditionalActionSource)
        self.assertEqual(len(parsed[0].succeedActions), 1)
        guarded = parsed[0].succeedActions[0].nestedCondition
        self.assertIsInstance(guarded, SequenceGuardActionSource)
        assert guarded is not None
        self.assertEqual(
            tuple(action.actionType for action in guarded.succeedActions),
            ("SpellInfliction",),
        )
        compiled = compile_conditional_action(
            parsed[0],
            "fixture.forEach",
            root_skill_context=True,
            input_target="enemy",
        )
        self.assertIn("applyElementalInfliction", compiled)

    def test_for_each_context_group_guard_is_not_assumed_to_target_enemy(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 7,
                        "_endFrame": 7,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.ForEachAction+Data, Example",
                                    "isEnable": True,
                                    "priorityLevel": "Default",
                                    "priorityOffset": 0,
                                    "serverActionIndex": 1,
                                    "target": {
                                        "targetSource": "Context",
                                        "targetGroupKey": "spawned_entities",
                                    },
                                    "action": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckDistanceCondition+Data, Example",
                                                "isEnable": True,
                                                "serverActionIndex": 2,
                                                "source": target_settings_fixture("Owner"),
                                                "target": target_settings_fixture("Target"),
                                                "distance": 50,
                                                "lessThan": True,
                                                "includeTargetRadius": False,
                                                "containsHittableObj": False,
                                            },
                                            {
                                                "$type": "Example.SpellInfliction+Data, Example",
                                                "isEnable": True,
                                                "serverActionIndex": 3,
                                                "inflictionType": "Fire",
                                                "isExtra": False,
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

        self.assertEqual(
            parse_conditional_actions(
                root,
                "fixture.json",
                {},
                include_for_each_sequence_guards=True,
            ),
            (),
        )
        unresolved = collect_unresolved_combat_actions(parse_timeline(root, "fixture.json"))
        self.assertIn("CheckDistanceCondition", unresolved)
        self.assertIn("SpellInfliction", unresolved)

    def test_for_each_guard_claims_blackboard_tail_not_seen_by_root_parser(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 7,
                        "_endFrame": 7,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.ForEachAction+Data, Example",
                                    "isEnable": True,
                                    "priorityLevel": "Default",
                                    "priorityOffset": 0,
                                    "serverActionIndex": 1,
                                    "target": {
                                        "targetSource": "Target",
                                        "targetGroupKey": "",
                                    },
                                    "action": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckDistanceCondition+Data, Example",
                                                "isEnable": True,
                                                "serverActionIndex": 2,
                                                "source": target_settings_fixture("Owner"),
                                                "target": target_settings_fixture("Target"),
                                                "distance": 50,
                                                "lessThan": True,
                                                "includeTargetRadius": False,
                                                "containsHittableObj": False,
                                            },
                                            {
                                                "$type": "Example.ModifyDynamicBlackboard+Data, Example",
                                                "isEnable": True,
                                                "serverActionIndex": 3,
                                                "key": "guarded_flag",
                                                "operation": "Assign",
                                                "directValue": True,
                                                "value": {
                                                    "useBlackboardKey": False,
                                                    "blackboardKey": "",
                                                    "value": 1,
                                                },
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

        parsed = parse_conditional_actions(
                root,
                "fixture.json",
                {},
                include_for_each_sequence_guards=True,
            )
        self.assertEqual(len(parsed), 1)
        guarded = parsed[0].succeedActions[0].nestedCondition
        self.assertIsInstance(guarded, SequenceGuardActionSource)
        assert guarded is not None
        self.assertEqual(
            tuple(action.actionType for action in guarded.succeedActions),
            ("ModifyDynamicBlackboard",),
        )
        mutations, _, _ = parse_blackboard_runtime_actions(root, "fixture.json", {})
        self.assertEqual(mutations, ())

    def test_direct_main_operator_guard_before_presentation_only_tail_is_ignored(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 2,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.CheckMainCharacterCondition+Data, Example",
                                    "isEnable": True,
                                    "serverActionIndex": 1,
                                },
                                {
                                    "$type": "Example.CameraImpulseAction+Data, Example",
                                    "isEnable": True,
                                    "serverActionIndex": 2,
                                },
                            ]
                        },
                    }
                ]
            }
        }

        self.assertNotIn(
            "CheckMainCharacterCondition",
            collect_unresolved_combat_actions(parse_timeline(root, "fixture.json")),
        )

    def test_branch_sequence_guard_short_circuits_remaining_actions(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 2,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.IfElseAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CompareFloat+Data, Example",
                                                "valueA": {
                                                    "useBlackboardKey": False,
                                                    "blackboardKey": "",
                                                    "value": 1,
                                                },
                                                "valueB": {
                                                    "useBlackboardKey": False,
                                                    "blackboardKey": "",
                                                    "value": 1,
                                                },
                                                "compare": "Equals",
                                            }
                                        ]
                                    },
                                    "succeedActions": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckMainCharacterCondition+Data, Example",
                                                "serverActionIndex": 2,
                                                "checkTarget": {
                                                    "targetSource": "Source",
                                                    "targetGroupKey": "",
                                                },
                                            },
                                            {
                                                "$type": "Example.SpellInfliction+Data, Example",
                                                "serverActionIndex": 3,
                                                "inflictionType": "Fire",
                                                "isExtra": False,
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

        parsed = parse_conditional_actions(root, "fixture.json", {})[0]

        self.assertEqual(len(parsed.succeedActions), 1)
        guarded = parsed.succeedActions[0].nestedCondition
        self.assertIsInstance(guarded, SequenceGuardActionSource)
        self.assertEqual(guarded.actionIndex, 2)
        self.assertEqual(
            tuple(action.actionType for action in guarded.succeedActions),
            ("SpellInfliction",),
        )
        compiled = compile_conditional_action(parsed, "fixture.condition")
        self.assertEqual(compiled.count("applyElementalInfliction"), 1)
        self.assertIn("kind: 'casterControlled'", compiled)
        self.assertEqual(
            collect_compilable_conditional_action_types((parsed,)),
            {
                "IfElseAction",
                "CompareFloat",
                "CheckMainCharacterCondition",
                "SpellInfliction",
            },
        )

    def test_presentation_only_switch_is_not_a_combat_coverage_gap(self) -> None:
        switch = {
            "$type": "Example.SwitchAction+Data, Example",
            "isEnable": True,
            "serverActionIndex": 1,
            "options": [
                {
                    "actionData": {
                        "actionData": [
                            {
                                "$type": "Example.HitStopAction+Data, Example",
                                "isEnable": True,
                            },
                            {
                                "$type": "Example.CameraImpulseAction+Data, Example",
                                "isEnable": True,
                            },
                        ]
                    }
                }
            ],
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 2,
                        "_endFrame": 2,
                        "_sequenceActionData": {"actionData": [switch]},
                    }
                ]
            }
        }

        unresolved = collect_unresolved_combat_actions(parse_timeline(root, "fixture.json"))
        self.assertNotIn("SwitchAction", unresolved)

        switch["options"][0]["actionData"]["actionData"].append(
            {"$type": "Example.DamageAction+Data, Example", "isEnable": True}
        )
        unresolved = collect_unresolved_combat_actions(parse_timeline(root, "fixture.json"))
        self.assertIn("SwitchAction", unresolved)
        self.assertIn("DamageAction", unresolved)

    def test_aura_action_is_a_combat_coverage_requirement(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 30,
                        "_sequenceActionData": {
                            "$type": "Example.AuraAction+Data, Example",
                            "isEnable": True,
                        },
                    }
                ]
            }
        }

        self.assertIn(
            "AuraAction",
            collect_unresolved_combat_actions(parse_timeline(root, "fixture.json")),
        )

    def test_aura_action_preserves_region_buff_and_nested_combat_facts(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 4,
                        "_endFrame": 40,
                        "_sequenceActionData": {
                            "actionData": [aura_action_fixture()],
                        },
                    }
                ]
            }
        }

        actions = parse_aura_actions(root, "fixture.json", {})

        self.assertEqual(len(actions), 1)
        aura = actions[0]
        self.assertEqual((aura.startFrame, aura.endFrame, aura.actionIndex), (4, 40, 7))
        self.assertEqual(aura.sourceFile, "fixture.json")
        self.assertEqual(aura.shape.shapeType, "Sphere")
        self.assertEqual(aura.shape.radius, 3)
        self.assertEqual(aura.targetFilter.factionTarget, "Anti")
        self.assertEqual([buff.buffId for buff in aura.buffs], ["buff.fixture"])
        self.assertEqual(aura.actionInAuraTypes, ("DamageAction",))
        self.assertEqual(aura.nestedCombatActions, ("DamageAction",))

    def test_aura_action_rejects_unknown_fields(self) -> None:
        action = aura_action_fixture()
        action["unexpected"] = True
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {"actionData": [action]},
                    }
                ]
            }
        }

        with self.assertRaisesRegex(ValueError, "unexpected fields"):
            parse_aura_actions(root, "fixture.json", {})

    def test_aura_action_accepts_only_the_known_editor_warning(self) -> None:
        action = aura_action_fixture()
        action["m_auraTypeWarning"] = (
            "光环范围过大，每帧检测物理碰撞开销较大，建议使用全局光环"
        )
        action["buffIconDurationSource"].update(
            {
                "m_abilityEntityTypeInfo": (
                    "当ActionOwner是AbilityEntity时，Buff图标倒计时显示Owner的剩余时间"
                ),
                "m_timedMarkerInfo": (
                    "选择ActionOwner身上的一个TimedMarker作为Buff图标倒计时显示的来源"
                ),
            }
        )
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {"actionData": [action]},
                    }
                ]
            }
        }

        self.assertEqual(len(parse_aura_actions(root, "fixture.json", {})), 1)

        action["m_auraTypeWarning"] = "changed"
        with self.assertRaisesRegex(ValueError, "unexpected editor warning"):
            parse_aura_actions(root, "fixture.json", {})

        action["m_auraTypeWarning"] = (
            "光环范围过大，每帧检测物理碰撞开销较大，建议使用全局光环"
        )
        action["buffIconDurationSource"]["m_timedMarkerInfo"] = "changed"
        with self.assertRaisesRegex(ValueError, "unexpected editor info"):
            parse_aura_actions(root, "fixture.json", {})

    def test_condition_compiler_rejects_enemy_main_operator_checks(self) -> None:
        condition = ConditionSource(
            sourceType="CheckMainCharacterCondition",
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
            mainOperator=MainOperatorConditionSource(
                targetSource="Target",
                targetGroupKey="",
            ),
        )

        with self.assertRaisesRegex(ValueError, "unsupported main operator target"):
            compile_combat_condition_group((condition,), "fixture.conditions")

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
            targetFinderType=None,
            targetValidatorTypes=(),
            targetPostProcessorTypes=(),
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

    def test_conditional_buff_context_resolves_prior_enemy_target_group(self) -> None:
        condition = SimpleNamespace(
            startFrame=3,
            actionIndex=2,
            actionPath=("timelineActions", "0", "actionData", "1"),
            conditions=(
                SimpleNamespace(
                    sourceType="CompareFloat",
                    supported=True,
                    comparison="Equals",
                    left=ScalarSource(1, None, None),
                    right=ScalarSource(1, None, None),
                ),
            ),
            succeedActions=(
                SimpleNamespace(
                    actionType="CreateBuffAction",
                    nestedCondition=None,
                    buffApplication=SimpleNamespace(
                        buffs=(
                            SimpleNamespace(
                                buffId="buff.example.enemy",
                                blackboardAssignments={},
                            ),
                        ),
                        targetSource="Context",
                        targetGroupKey="tar",
                        count=ScalarSource(1, None, None),
                        buffSource="ActionSource",
                        inheritSourceSkillCastInfo=True,
                        targetFinderType=None,
                        targetValidatorTypes=(),
                        targetPostProcessorTypes=(),
                    ),
                ),
            ),
            failActions=(),
        )
        enemy_write = TargetGroupWriteSource(
            startFrame=3,
            endFrame=3,
            actionIndex=1,
            actionPath=("timelineActions", "0", "actionData", "0"),
            targetGroupKey="tar",
            producerType="FindTargetAction",
            finderType="HitBoxFinder",
            finderFactionTarget="Anti",
            finderTargetObjectType="Normal",
            finderCheckAlive=True,
            validatorTypes=(),
            postProcessorTypes=(),
            inputTargets=(),
            intervalSeconds=None,
        )

        result = compile_conditional_action(
            condition,
            "fixture.condition",
            target_group_writes=(enemy_write,),
            root_skill_context=True,
            input_target="enemy",
        )

        self.assertIn("step('applyBuff'", result)
        self.assertIn("target: 'enemy'", result)

    def test_conditional_buff_context_compiles_unfiltered_team_target_as_party(self) -> None:
        condition = SimpleNamespace(
            startFrame=3,
            actionIndex=2,
            actionPath=("timelineActions", "0", "actionData", "1"),
            conditions=(
                SimpleNamespace(
                    sourceType="CompareFloat",
                    supported=True,
                    comparison="Equals",
                    left=ScalarSource(1, None, None),
                    right=ScalarSource(1, None, None),
                ),
            ),
            succeedActions=(
                SimpleNamespace(
                    actionType="CreateBuffAction",
                    nestedCondition=None,
                    buffApplication=SimpleNamespace(
                        buffs=(
                            SimpleNamespace(
                                buffId="buff.example.teammate",
                                blackboardAssignments={},
                            ),
                        ),
                        targetSource="Context",
                        targetGroupKey="team",
                        count=ScalarSource(1, None, None),
                        buffSource="ActionSource",
                        inheritSourceSkillCastInfo=True,
                        targetFinderType=None,
                        targetValidatorTypes=(),
                        targetPostProcessorTypes=(),
                    ),
                ),
            ),
            failActions=(),
        )
        teammate_write = TargetGroupWriteSource(
            startFrame=3,
            endFrame=3,
            actionIndex=1,
            actionPath=("timelineActions", "0", "actionData", "0"),
            targetGroupKey="team",
            producerType="FindTargetAction",
            finderType="CharacterTeamFinder",
            finderFactionTarget=None,
            finderTargetObjectType=None,
            finderCheckAlive=None,
            validatorTypes=(),
            postProcessorTypes=(),
            inputTargets=(),
            intervalSeconds=None,
        )

        compiled = compile_conditional_action(
            condition,
            "fixture.condition",
            target_group_writes=(teammate_write,),
            root_skill_context=True,
            input_target="enemy",
        )

        self.assertIn("target: 'party'", compiled)

        with self.assertRaisesRegex(ValueError, "unsupported Buff target"):
            compile_conditional_action(
                condition,
                "fixture.condition",
                target_group_writes=(
                    replace(teammate_write, validatorTypes=("MainCharacterValidator",)),
                ),
                root_skill_context=True,
                input_target="enemy",
            )

    def test_conditional_buff_reads_prior_target_write_in_the_same_branch(self) -> None:
        condition_path = ("timelineActions[0]", "_sequenceActionData", "actionData", "[0]")
        branch_path = (*condition_path, "succeedActions", "actionData")
        application = SimpleNamespace(
            buffs=(
                SimpleNamespace(
                    buffId="buff.example.team",
                    blackboardAssignments={},
                ),
            ),
            targetSource="Context",
            targetGroupKey="team",
            count=ScalarSource(1, None, None),
            buffSource="ActionSource",
            inheritSourceSkillCastInfo=True,
            targetFinderType=None,
            targetValidatorTypes=(),
            targetPostProcessorTypes=(),
        )
        action = ConditionalActionSource(
            startFrame=3,
            endFrame=3,
            actionIndex=1,
            actionPath=condition_path,
            conditions=(
                SimpleNamespace(
                    sourceType="CompareFloat",
                    supported=True,
                    comparison="Equals",
                    left=ScalarSource(1, None, None),
                    right=ScalarSource(1, None, None),
                ),
            ),
            succeedActions=(
                ConditionalBranchActionSource(
                    actionType="CreateBuffAction",
                    actionIndex=1,
                    actionPath=(*branch_path, "[1]"),
                    serverActionIndex=3,
                    buffApplication=application,
                ),
            ),
            failActions=(),
        )
        team_write = TargetGroupWriteSource(
            startFrame=3,
            endFrame=3,
            actionIndex=2,
            actionPath=(*branch_path, "[0]"),
            targetGroupKey="team",
            producerType="FindTargetAction",
            finderType="CharacterTeamFinder",
            finderFactionTarget=None,
            finderTargetObjectType=None,
            finderCheckAlive=None,
            validatorTypes=(),
            postProcessorTypes=(),
            inputTargets=(),
            intervalSeconds=None,
        )

        compiled = compile_conditional_action(
            action,
            "fixture.condition",
            target_group_writes=(team_write,),
            root_skill_context=True,
            input_target="enemy",
        )

        self.assertIn("target: 'party'", compiled)

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

    def test_conditional_action_compiler_emits_elemental_infliction(self) -> None:
        action = SimpleNamespace(
            conditions=(
                SimpleNamespace(
                    sourceType="CompareFloat",
                    supported=True,
                    comparison="Equals",
                    left=ScalarSource(1, None, None),
                    right=ScalarSource(1, None, None),
                ),
            ),
            succeedActions=(
                SimpleNamespace(
                    actionType="SpellInfliction",
                    nestedCondition=None,
                    infliction=InflictionPayload("electric", True),
                ),
            ),
            failActions=(),
        )

        result = compile_conditional_action(action, "fixture.condition")

        self.assertIn("applyElementalInfliction", result)
        self.assertIn("element: 'electric'", result)
        self.assertIn("isExtra: true", result)

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
                        coefficient=ScalarSource(0.5, None, None),
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
        self.assertIn("coefficient: 0.5", result)
        self.assertIn("spGainKind: 'refund'", result)
        self.assertIn("spGainSource: 'skill'", result)

    def test_conditional_action_compiler_preserves_ultimate_recovery_options(self) -> None:
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
                        resource="ultimateEnergy",
                        amount=ScalarSource(None, "usp", None),
                        coefficient=ScalarSource(0.5, None, None),
                        spGainKind=None,
                        spGainSource=None,
                        onlyMainOperator=False,
                        isPercentValue=True,
                        useUltimateRecoveryTag=True,
                        ultimateRecoveryTagId=264623624,
                        ignoreUltimateGainScalar=True,
                    ),
                ),
            ),
            failActions=(),
        )

        result = compile_conditional_action(action, "fixture.condition")

        self.assertIn("changeResourceByActionValue", result)
        self.assertIn("isPercentValue: true", result)
        self.assertIn("ultimateRecoveryTagId: 264623624", result)
        self.assertIn("ignoreUltimateEnergyGainMultiplier: true", result)

    def test_conditional_action_compiler_preserves_dynamic_resource_coefficient(self) -> None:
        gain = ResourceGainPayload(
            resource="ultimateEnergy",
            amount=ScalarSource(None, "usp", None),
            coefficient=ScalarSource(None, "infliction_num", None),
            spGainKind=None,
            spGainSource=None,
            onlyMainOperator=False,
            isPercentValue=False,
            useUltimateRecoveryTag=False,
            ultimateRecoveryTagId=0,
            ignoreUltimateGainScalar=False,
        )

        result = compile_resource_gain(gain, "fixture.resourceGain")

        self.assertIn("changeResourceByActionValue", result)
        self.assertIn("amount: { kind: 'blackboard', key: 'usp' }", result)
        self.assertIn("coefficient: { kind: 'blackboard', key: 'infliction_num' }", result)

    def test_conditional_action_compiler_preserves_runtime_damage_scale(self) -> None:
        condition = SimpleNamespace(
            sourceType="CompareFloat",
            comparison="GE",
            left=ScalarSource(1, None, None),
            right=ScalarSource(1, None, None),
            buffStack=None,
        )
        damage = DamageUnitSource(
            damageType="Pulse",
            attributeType="Hp",
            calculation="standard",
            attackScale=ScalarSource(None, "atk_scale_final", (1.0,)),
            calculationMultiplier=None,
            poiseValue=None,
            damageDecorateMask=256,
        )
        action = SimpleNamespace(
            conditions=(condition,),
            succeedActions=(
                SimpleNamespace(
                    actionType="DamageAction",
                    nestedCondition=None,
                    damageUnits=(damage,),
                ),
            ),
            failActions=(),
        )

        result = compile_conditional_action(
            action,
            "fixture.condition",
            damage_tags=("normalSkill",),
            runtime_blackboard_keys=frozenset({"atk_scale_final"}),
        )

        self.assertIn("step('dealDamage'", result)
        self.assertIn("attackScale: { kind: 'blackboard', key: 'atk_scale_final' }", result)
        self.assertIn("tags: ['normalSkill']", result)

    def test_runtime_blackboard_keys_include_projectile_child_writes(self) -> None:
        mutation = SimpleNamespace(
            blackboardCalculation=None,
            blackboardMutation=SimpleNamespace(key="projectile_scale"),
            buffBlackboardRead=None,
            buffStackRead=None,
            nestedCondition=None,
            onceActions=None,
        )
        condition = SimpleNamespace(succeedActions=(mutation,), failActions=())
        projectile = SimpleNamespace(
            conditionalActions=(condition,),
            abilityEntityHits=(),
            nestedProjectileTriggeredSkills=(),
        )
        skill = SimpleNamespace(
            blackboardCalculations=(),
            blackboardMutations=(),
            buffBlackboardReads=(),
            conditionalActions=(),
            projectileTriggeredSkills=(projectile,),
            abilityEntityHits=(),
        )

        self.assertEqual(
            collect_runtime_blackboard_output_keys(skill),
            frozenset({"projectile_scale"}),
        )

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
            projectileTriggeredSkills=(),
            abilityEntityHits=(
                SimpleNamespace(
                    spawnFrame=10,
                    actionOrder=(0,),
                    skillId="entity_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=2, actionIndex=0, damageUnits=(unit,)),
                    ),
                    projectileTriggeredSkills=(),
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
            skillType="ultimate",
            timelineBlockFrames=20,
            patch=SimpleNamespace(
                cooldownSeconds=(15,) * 12,
                costTypes=(0,) * 12,
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
            projectileTriggeredSkills=(),
            abilityEntityHits=(),
        )

        source = compile_resolved_sequence(
            skill,
            {},
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
            projectileTriggeredSkills=(),
            abilityEntityHits=(
                SimpleNamespace(
                    spawnFrame=12,
                    actionOrder=(6,),
                    skillId="entity_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=0, actionIndex=0, damageUnits=(unit,)),
                    ),
                    projectileTriggeredSkills=(),
                    nestedAbilityEntityHits=(),
                ),
            ),
        )

        source = compile_resolved_damage_sequence(skill, {"tags": ["normalAttack"]})

        self.assertLess(source.index("branch("), source.index("step('dealDamage'"))

    def test_resolved_sequence_preserves_native_sequence_groups_on_the_same_frame(self) -> None:
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
            skillId="root",
            timelineBlockFrames=10,
            directDamageHits=(
                SimpleNamespace(startFrame=5, actionIndex=20, sequenceIndex=4, damageUnits=(unit,)),
                SimpleNamespace(startFrame=5, actionIndex=30, sequenceIndex=4, damageUnits=(unit,)),
                SimpleNamespace(startFrame=5, actionIndex=1, sequenceIndex=7, damageUnits=(unit,)),
            ),
            auxiliaryActions=(),
            resourceGains=(),
            inflictions=(),
            projectileLaunches=(),
            projectileTriggeredSkills=(),
            abilityEntityHits=(),
            conditionalActions=(),
            blackboardCalculations=(),
            blackboardMutations=(),
            buffBlackboardReads=(),
            buffFinishes=(),
            unresolvedCombatActions=("DamageAction",),
        )

        source = compile_resolved_damage_sequence(skill, {"tags": ["normalAttack"]})

        self.assertEqual(source.count("scheduled(\n        5,"), 2)
        first_group, second_group = source.split("      scheduled(\n        5,")[1:]
        self.assertEqual(first_group.count("step('dealDamage'"), 2)
        self.assertEqual(second_group.count("step('dealDamage'"), 1)

    def test_unmodeled_buff_ids_must_match_a_scheduled_application(self) -> None:
        application = AuxiliaryActionSource(
            startFrame=3,
            endFrame=3,
            actionIndex=2,
            actionType="CreateBuffAction",
            sourceId="buff.fixture",
            classification=None,
            targetSource="Source",
            targetGroupKey="",
            count=ScalarSource(1, None, None),
            buffSource="ActionSource",
            inheritSourceSkillCastInfo=True,
            blackboardAssignments={},
            nestedCombatActions=(),
        )
        schedule = (
            ResolvedScheduleItemSource(
                frame=3,
                actionOrder=(2,),
                itemType="buffApplication",
                sourcePath=("root",),
                payload=application,
                sequenceOrder=(0,),
            ),
        )

        validate_unmodeled_buff_ids(schedule, frozenset({"buff.fixture"}), "fixture")
        with self.assertRaisesRegex(ValueError, "buff.stale"):
            validate_unmodeled_buff_ids(schedule, frozenset({"buff.stale"}), "fixture")

    def test_encode_step_key_parts_uses_length_prefixed_segments(self) -> None:
        self.assertEqual(encode_step_key_parts(("abc", 12)), "3:abc2:12")
        self.assertEqual(encode_step_key_parts(()), "")
        self.assertEqual(encode_step_key_parts((1, 2, 30)), "1:11:22:30")

    def test_encode_step_key_is_stable(self) -> None:
        first = encode_damage_step_key(
            "battleSkill", "direct", ("chr_0004_attack",), (7,)
        )
        second = encode_damage_step_key(
            "battleSkill", "direct", ("chr_0004_attack",), (7,)
        )
        self.assertEqual(first, second)
        self.assertTrue(first.startswith("11:battleSkill6:direct"))
        self.assertNotIn("[", first)

    def test_encode_step_key_never_collides_across_source_identities(self) -> None:
        keys = {
            encode_damage_step_key("s", "direct", ("root",), (1,)),
            encode_damage_step_key("s", "projectile", ("root", "child"), (1, 2)),
            encode_damage_step_key("s", "abilityEntity", ("root", "entity"), (3, 0)),
            encode_damage_step_key("s", "abilityEntityInterval", ("root", "entity"), (3, 0)),
            encode_damage_step_key("s2", "direct", ("root",), (1,)),
            encode_damage_step_key("s", "direct", ("root",), (2,)),
        }
        self.assertEqual(len(keys), 6)

    def test_encode_step_key_distinguishes_path_segment_boundaries(self) -> None:
        # 路径片段边界不同，生成的 key 也必须不同。
        a = encode_damage_step_key("s", "conditional", ("hit", "hit"), (1, 2))
        b = encode_damage_step_key("s", "conditional", ("hith", "it"), (1, 2))
        self.assertNotEqual(a, b)

    def test_resolved_damage_compiler_uses_native_identity_for_step_keys(self) -> None:
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
            auxiliaryActions=(),
            resourceGains=(),
            inflictions=(),
            projectileLaunches=(),
            conditionalActions=(),
            blackboardCalculations=(),
            blackboardMutations=(),
            buffBlackboardReads=(),
            buffFinishes=(),
            unresolvedCombatActions=("DamageAction",),
            skillId="root",
            directDamageHits=(
                TimedDamageSource(
                    startFrame=10,
                    endFrame=10,
                    actionIndex=7,
                    damageUnits=(unit,),
                ),
            ),
            projectileTriggeredSkills=(),
            abilityEntityHits=(),
            eventListeners=(),
        )
        first = compile_resolved_damage_sequence(skill, {"tags": ["normalAttack"]})
        self.assertIn("step('dealDamage'", first)
        # 插入无关调度项不得改变基于原生 actionOrder 的 key。
        skill2 = SimpleNamespace(
            key=skill.key,
            timelineBlockFrames=skill.timelineBlockFrames,
            auxiliaryActions=(
                AuxiliaryActionSource(
                    startFrame=10,
                    endFrame=10,
                    actionIndex=4,
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
            unresolvedCombatActions=("DamageAction", "CreateBuffAction"),
            skillId=skill.skillId,
            directDamageHits=skill.directDamageHits,
            projectileTriggeredSkills=(),
            abilityEntityHits=(),
            eventListeners=(),
        )
        second = compile_resolved_damage_sequence(skill2, {"tags": ["normalAttack"]})
        self.assertIn("step('dealDamage'", second)
        self.assertEqual(extract_step_key(first), extract_step_key(second))

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
            projectileTriggeredSkills=(),
            abilityEntityHits=(
                SimpleNamespace(
                    spawnFrame=12,
                    actionOrder=(7,),
                    skillId="entity_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=0, actionIndex=0, damageUnits=(unit,)),
                    ),
                    projectileTriggeredSkills=(),
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
                                },
                                {
                                    "$type": "Example.CreateTimedMarker+Data, Example",
                                    "serverActionIndex": 1,
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
        self.assertEqual(
            event.orderedActionTypes,
            ("CreateBuffAction", "CreateTimedMarker"),
        )
        self.assertEqual(
            event.combatActions,
            ("CreateBuffAction", "CreateTimedMarker"),
        )
        self.assertEqual(event.createdBuffIds, ("child_buff",))
        self.assertEqual(len(event.buffApplications), 1)
        application = event.buffApplications[0]
        self.assertEqual(application.actionIndex, 0)
        self.assertEqual(application.payload.targetSource, "Source")
        self.assertEqual(application.payload.count.value, 1)
        self.assertTrue(application.payload.inheritSourceSkillCastInfo)

    def test_buff_source_death_finish_requires_exact_monitor_shape(self) -> None:
        common = {
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
            "serverActionIndex": 0,
        }
        buff = {
            "buffEventAction": [
                {
                    "buffEvent": "OnBuffTrigger",
                    "actions": [
                        {
                            "actionData": [
                                {
                                    **common,
                                    "$type": "Example.CheckHp+Data, Example",
                                    "hpOwner": target_settings_fixture("Source"),
                                    "compare": "LE",
                                    "isRatio": True,
                                    "value": {
                                        "useBlackboardKey": False,
                                        "value": 0,
                                        "blackboardKey": "",
                                    },
                                },
                                {
                                    **common,
                                    "$type": "Example.FinishOwnerAction+Data, Example",
                                    "serverActionIndex": 1,
                                    "owner": target_settings_fixture("Owner"),
                                    "skipDieDisplay": False,
                                },
                            ],
                            "onlyExecuteWhenSourceIsMainChar": False,
                            "onlyExecuteWhenSourceIsGuard": False,
                        }
                    ],
                }
            ]
        }

        parsed = parse_buff_source_death_finish(buff, "fixture", {})
        self.assertIsNotNone(parsed)
        assert parsed is not None
        self.assertFalse(parsed.skipDieDisplay)

        buff["buffEventAction"][0]["actions"][0]["actionData"][0]["compare"] = "LT"
        self.assertIsNone(parse_buff_source_death_finish(buff, "fixture", {}))

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

    def test_projectile_without_triggered_skill_is_preserved_as_a_launch(self) -> None:
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
                            "assignBlackboard": True,
                            "assignEntityBlackboard": False,
                            "assignPairs": [],
                            "setAbilityEntitySource": True,
                            "abilityEntitySource": "ActionSource",
                            "abilityEntitySourceContextKey": "",
                            "setAbilityEntityTarget": False,
                            "overrideDuration": False,
                            "saveToContext": False,
                            "contextKey": "",
                            "dieWhenSourceDie": False,
                            "dieOnEnd": False,
                            "setAbilityEntitySource": True,
                            "abilityEntitySource": "ActionSource",
                            "abilityEntitySourceContextKey": "",
                            "setAbilityEntityTarget": False,
                            "overrideDuration": False,
                            "saveToContext": False,
                            "contextKey": "",
                            "dieWhenSourceDie": False,
                            "dieOnEnd": False,
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
        self.assertEqual(launches[0].skillTriggers, ())

    def test_projectile_events_follow_switches_and_ignore_disabled_residual_ids(self) -> None:
        payload = parse_projectile_launch_payload(
            {
                "projectileId": "projectile.test",
                "assignBlackboard": True,
                "assignEntityBlackboard": False,
                "assignPairs": [],
                "castSkillOnHit": False,
                "projectileSkillId": "stale.hit.skill",
                "castSkillOnBlock": True,
                "skillIdOnBlock": "skill.block",
                "castSkillOnReach": True,
                "skillIdOnReach": "skill.reach",
                "castSkillOnFinish": False,
                "skillIdOnFinish": "stale.finish.skill",
            },
            "projectile",
        )

        self.assertEqual(
            payload.skillTriggers,
            (
                ProjectileSkillTriggerSource("block", "skill.block"),
                ProjectileSkillTriggerSource("reach", "skill.reach"),
            ),
        )

    def test_guaranteed_hit_drops_the_same_child_skills_block_fallback(self) -> None:
        triggers = (
            ProjectileSkillTriggerSource("hit", "skill.hit"),
            ProjectileSkillTriggerSource("block", "skill.hit"),
            ProjectileSkillTriggerSource("block", "skill.block-only"),
        )

        self.assertEqual(
            select_projectile_triggers_for_single_enemy(triggers),
            (
                ProjectileSkillTriggerSource("hit", "skill.hit"),
                ProjectileSkillTriggerSource("block", "skill.block-only"),
            ),
        )

    def test_slow_action_preserves_duration_rate_and_native_order(self) -> None:
        action = slow_action_fixture()
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 12,
                        "_endFrame": 15,
                        "_sequenceActionData": {"actionData": [action]},
                    }
                ]
            }
        }

        parsed = parse_timed_keyword_actions(
            root, "slow.json", {"move_speed_scalar": (0.3, 0.4)}
        )

        self.assertEqual(len(parsed), 1)
        self.assertEqual((parsed[0].startFrame, parsed[0].actionIndex), (12, 7))
        self.assertEqual(parsed[0].duration.value, 3.1)
        self.assertEqual(parsed[0].rate.levelValues, (0.3, 0.4))

    def test_conditional_parser_preserves_slow_action_payload(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 89,
                        "_endFrame": 90,
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
                                                    "blackboardKey": "potential_lv",
                                                },
                                                "compare": "GE",
                                                "valueB": {
                                                    "useBlackboardKey": False,
                                                    "value": 3,
                                                    "blackboardKey": "",
                                                },
                                            }
                                        ]
                                    },
                                    "succeedActions": {
                                        "actionData": [slow_action_fixture()]
                                    },
                                    "failActions": {"actionData": []},
                                }
                            ]
                        },
                    }
                ]
            }
        }

        condition = parse_conditional_actions(
            root,
            "fixture.json",
            {"potential_lv": (3,), "move_speed_scalar": (0.3,)},
        )[0]

        self.assertEqual(condition.succeedActions[0].actionType, "SlowAction")
        self.assertEqual(condition.succeedActions[0].keywordAction.duration.value, 3.1)
        self.assertEqual(
            condition.succeedActions[0].keywordAction.rate.levelValues,
            (0.3,),
        )

    def test_conditional_slow_action_uses_local_enemy_target_evidence(self) -> None:
        keyword_action = parse_keyword_action(
            slow_action_fixture(
                target=target_settings_fixture("Context", target_group_key="tar"),
                duration={
                    "useBlackboardKey": True,
                    "value": 0,
                    "blackboardKey": "duration_potential",
                },
            ),
            "fixture.slow",
            {
                "duration_potential": (6,),
                "move_speed_scalar": (0.3,),
            },
            start_frame=89,
            end_frame=90,
        )
        condition_path = (
            "timelineActions[0]",
            "_sequenceActionData",
            "actionData",
            "[1]",
        )
        condition = ConditionalActionSource(
            startFrame=89,
            endFrame=90,
            actionIndex=8,
            actionPath=condition_path,
            conditions=(
                ConditionSource(
                    sourceType="CompareFloat",
                    supported=True,
                    comparison="GE",
                    left=ScalarSource(0, "potential_lv", (3,)),
                    right=ScalarSource(3, None, None),
                    skillTypes=(),
                ),
            ),
            succeedActions=(
                ConditionalBranchActionSource(
                    actionType="SlowAction",
                    actionIndex=1,
                    actionPath=(
                        *condition_path,
                        "succeedActions",
                        "actionData",
                        "[0]",
                    ),
                    serverActionIndex=7,
                    keywordAction=keyword_action,
                ),
            ),
            failActions=(),
        )
        enemy_write = TargetGroupWriteSource(
            startFrame=0,
            endFrame=1,
            actionIndex=0,
            actionPath=(
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[0]",
            ),
            targetGroupKey="tar",
            producerType="FindTargetAction",
            finderType="HitBoxFinder",
            finderFactionTarget="Anti",
            finderTargetObjectType="Normal",
            finderCheckAlive=True,
            validatorTypes=(),
            postProcessorTypes=(),
            inputTargets=(),
            intervalSeconds=None,
        )

        compiled = compile_conditional_action(
            condition,
            "fixture.condition",
            target_group_writes=(enemy_write,),
            input_target="enemy",
        )

        self.assertIn("buff_common_affixes_slow", compiled)
        self.assertIn("duration_potential", compiled)
        self.assertIn("target: 'enemy'", compiled)

    def test_local_target_group_writes_are_not_serialized(self) -> None:
        source = {
            "keywordActions": (),
            "localTargetGroupWrites": ({"targetGroupKey": "tar"},),
        }

        self.assertEqual(serialize_audit_value(source), {})

    def test_primary_target_marker_excludes_projectile_child_combat_in_single_enemy_model(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 24,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.CreateTimedMarker+Data, Example",
                                    "isEnable": True,
                                    "serverActionIndex": 56,
                                    "targetSettings": {
                                        "targetSource": "Context",
                                        "targetGroupKey": "smart_target",
                                    },
                                    "markerId": {"useBlackboardKey": False, "value": "primary"},
                                    "duration": {"useBlackboardKey": False, "value": 0.5},
                                }
                            ]
                        },
                    }
                ]
            }
        }
        trigger = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.ForEachAction+Data, Example",
                                    "target": {"targetSource": "Target", "targetGroupKey": ""},
                                    "action": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckTimedMarkerCondition+Data, Example",
                                                "checkTarget": {
                                                    "targetSource": "Target",
                                                    "targetGroupKey": "",
                                                },
                                                "id": "primary",
                                                "useBlackboardKey": False,
                                                "returnTrueIfNotExists": True,
                                            },
                                            {"$type": "Example.CreateBuffAction+Data, Example"},
                                        ]
                                    },
                                }
                            ]
                        },
                    }
                ]
            }
        }

        self.assertTrue(
            is_projectile_trigger_excluded_for_single_enemy(
                root, 24, 57, trigger, "trigger.json"
            )
        )
        trigger["actionGroupData"]["timelineActions"][0]["_sequenceActionData"][
            "actionData"
        ][0]["action"]["actionData"][0]["id"] = "other"
        self.assertFalse(
            is_projectile_trigger_excluded_for_single_enemy(
                root, 24, 57, trigger, "trigger.json"
            )
        )

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
                            "assignBlackboard": False,
                            "assignEntityBlackboard": False,
                            "assignPairs": [],
                            "setAbilityEntitySource": True,
                            "abilityEntitySource": "ActionSource",
                            "abilityEntitySourceContextKey": "",
                            "setAbilityEntityTarget": False,
                            "overrideDuration": False,
                            "saveToContext": False,
                            "contextKey": "",
                            "dieWhenSourceDie": False,
                            "dieOnEnd": False,
                        },
                    }
                ]
            }
        }

        actions = parse_auxiliary_actions(root, "skill.json", Path("."), {})

        self.assertEqual(len(actions), 1)
        self.assertEqual(actions[0].sourceId, "fake_target")
        self.assertEqual(actions[0].classification, "nonCombatAbilityEntity")

    def test_logical_ability_entity_spawn_compiles_runtime_identity_fields(self) -> None:
        payload = AbilityEntitySpawnPayload(
            "ability_entity",
            "child_skill",
            (
                EntityBlackboardAssignmentSource(
                    targetKey="EntityBB_power",
                    valueType="Numeric",
                    numericValue=3,
                    stringValue="",
                    useDirectValue=True,
                    inputValueKey="",
                ),
            ),
            assignBlackboard=True,
            sourceType="ActionSource",
            overrideDuration=ScalarSource(40, None, None),
            saveToContextKey="spawned",
            dieWhenSourceDies=True,
        )

        compiled = compile_logical_ability_entity_spawn(
            payload,
            "fixture",
            "{ skillId: 'child_skill', scheduledSequences: [] }",
        )

        self.assertIn("step('spawnAbilityEntity'", compiled)
        self.assertIn("childSkillId: 'child_skill'", compiled)
        self.assertIn("inheritActionBlackboard: true", compiled)
        self.assertIn("childSkill: { skillId: 'child_skill', scheduledSequences: [] }", compiled)
        self.assertIn("overrideDurationSeconds: { kind: 'constant', value: 40 }", compiled)
        self.assertIn("saveToContextKey: 'spawned'", compiled)
        self.assertIn("'EntityBB_power': { kind: 'constant', value: 3 }", compiled)

    def test_ability_entity_child_buff_source_resolves_to_caster(self) -> None:
        application = AuxiliaryActionSource(
            startFrame=3,
            endFrame=3,
            actionIndex=4,
            actionType="CreateBuffAction",
            sourceId="buff.fixture",
            classification=None,
            targetSource="Source",
            targetGroupKey="ignored_for_source",
            count=ScalarSource(1, None, None),
            buffSource="ActionSource",
            inheritSourceSkillCastInfo=True,
            blackboardAssignments={},
            nestedCombatActions=(),
        )
        ultimate_energy_gain = replace(
            application,
            actionIndex=5,
            sourceId="buff_common_obtain_ultimate_sp",
            classification="skillCostUltimateEnergyGain",
        )
        hit = SimpleNamespace(
            inheritsSourceBlackboard=True,
            cycleTruncated=False,
            spawnFrame=10,
            actionOrder=(2,),
            skillId="child_skill",
            directDamageHits=(),
            intervalDamageHits=(),
            explicitFinishes=(
                SimpleNamespace(
                    startFrame=8,
                    actionIndex=6,
                    sequenceIndex=6,
                    target=parse_target_reference(target_settings_fixture("Owner"), "fixture"),
                ),
                SimpleNamespace(
                    startFrame=8,
                    actionIndex=7,
                    sequenceIndex=7,
                    target=parse_target_reference(target_settings_fixture("Owner"), "fixture"),
                ),
            ),
            inflictions=(TimedInflictionSource(1, 1, 1, "heat", False),),
            conditionalActions=(),
            auxiliaryActions=(application, ultimate_energy_gain),
            projectileLaunches=(),
            projectileTriggeredSkills=(),
            nestedAbilityEntityHits=(),
            blackboardCalculations=(),
            blackboardMutations=(),
            resourceGains=(),
            buffBlackboardReads=(),
            buffFinishes=(),
            auraActions=(),
            keywordActions=(),
            combatActions=("SpellInfliction", "CreateBuffAction"),
            localTargetGroupWrites=(),
        )

        source = compile_ability_entity_child_skill(
            hit,
            SimpleNamespace(key="battleSkill"),
            {},
            (),
            frozenset(),
        )

        self.assertIn("scheduled(\n      3,", source)
        self.assertIn("step('applyBuff'", source)
        self.assertIn("target: 'caster'", source)
        self.assertIn("step('gainSquadUltimateEnergyFromSkillCost'", source)
        self.assertEqual(source.count("step('finishCurrentAbilityEntity'"), 1)
        self.assertNotIn("ignored_for_source", source)

    def test_ability_entity_child_owner_buff_uses_current_entity_target(self) -> None:
        application = AuxiliaryActionSource(
            startFrame=0,
            endFrame=0,
            actionIndex=0,
            actionType="CreateBuffAction",
            sourceId="buff.fixture",
            classification=None,
            targetSource="Owner",
            targetGroupKey="",
            count=ScalarSource(1, None, None),
            buffSource="ActionSource",
            inheritSourceSkillCastInfo=True,
            blackboardAssignments={},
            nestedCombatActions=(),
        )

        self.assertFalse(ability_entity_child_buff_can_compile(application))
        self.assertTrue(
            ability_entity_child_buff_can_compile(
                application,
                buff_definitions={
                    "buff.fixture": SimpleNamespace(
                        sourceDeathFinish=SimpleNamespace(skipDieDisplay=False)
                    )
                },
            )
        )
        source = compile_buff_application(
            application,
            "fixture",
            root_skill_context=False,
            current_ability_entity_owner=True,
        )
        self.assertIn("target: 'currentAbilityEntity'", source)

    def test_ability_entity_child_finish_must_be_terminal(self) -> None:
        terminal = SimpleNamespace(
            explicitFinishes=(SimpleNamespace(startFrame=90),),
            directDamageHits=(SimpleNamespace(startFrame=89),),
            intervalDamageHits=(),
            inflictions=(),
            conditionalActions=(),
            auxiliaryActions=(),
            resourceGains=(),
            blackboardCalculations=(),
            blackboardMutations=(),
            buffBlackboardReads=(),
            buffFinishes=(),
            keywordActions=(),
        )
        nonterminal = SimpleNamespace(
            **{
                **terminal.__dict__,
                "explicitFinishes": (
                    SimpleNamespace(startFrame=90),
                    SimpleNamespace(startFrame=150),
                ),
                "directDamageHits": (
                    SimpleNamespace(startFrame=89),
                    SimpleNamespace(startFrame=149),
                ),
            }
        )

        self.assertTrue(ability_entity_child_finishes_are_terminal(terminal))
        self.assertFalse(ability_entity_child_finishes_are_terminal(nonterminal))

    def test_ability_entity_child_with_timeline_jump_is_not_linearized(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 89,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.JumpToAction+Data, Example",
                                    "serverActionIndex": 29,
                                    "isEnable": True,
                                    "destFrame": 149,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.UnsupportedJumpCondition+Data, Example",
                                                "serverActionIndex": 30,
                                                "isEnable": True,
                                            }
                                        ]
                                    },
                                }
                            ]
                        },
                    }
                ]
            }
        }

        jumps = parse_timeline_jumps(root, "fixture.json")

        self.assertEqual(len(jumps), 1)
        self.assertEqual(jumps[0].destFrame, 149)
        self.assertEqual(
            jumps[0].actionPath,
            (
                "timelineActions[0]",
                "_sequenceActionData",
                "actionData",
                "[0]",
            ),
        )
        self.assertEqual(jumps[0].conditionActionTypes, ("UnsupportedJumpCondition",))
        self.assertFalse(
            ability_entity_child_timeline_can_compile(
                SimpleNamespace(
                    inheritsSourceBlackboard=True,
                    cycleTruncated=False,
                    directDamageHits=(SimpleNamespace(startFrame=149),),
                    intervalDamageHits=(),
                    explicitFinishes=(),
                    timelineJumps=jumps,
                    inflictions=(),
                    conditionalActions=(),
                    auxiliaryActions=(),
                    resourceGains=(),
                    projectileLaunches=(),
                    projectileTriggeredSkills=(),
                    nestedAbilityEntityHits=(),
                    blackboardCalculations=(),
                    blackboardMutations=(),
                    buffBlackboardReads=(),
                    buffFinishes=(),
                    auraActions=(),
                    keywordActions=(),
                    combatActions=("DamageAction",),
                )
            )
        )

    def test_root_timeline_jumps_compile_only_with_direct_supported_conditions(self) -> None:
        def scalar(value: float) -> dict[str, object]:
            return {"useBlackboardKey": False, "value": value, "blackboardKey": ""}

        target = {"targetSource": "Target", "targetGroupKey": "follow_tar"}
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 89,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.JumpToAction+Data, Example",
                                    "serverActionIndex": 29,
                                    "isEnable": True,
                                    "destFrame": 89,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckHp+Data, Example",
                                                "serverActionIndex": 30,
                                                "isEnable": True,
                                                "hpOwner": target,
                                                "compare": "LE",
                                                "isRatio": True,
                                                "value": scalar(0),
                                            }
                                        ]
                                    },
                                }
                            ]
                        },
                    },
                    {
                        "_startFrame": 0,
                        "_endFrame": 89,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.JumpToAction+Data, Example",
                                    "serverActionIndex": 36,
                                    "isEnable": True,
                                    "destFrame": 149,
                                    "conditionAction": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckBuffStackNum+Data, Example",
                                                "serverActionIndex": 37,
                                                "isEnable": True,
                                                "checkTarget": target,
                                                "buffId": {"buffId": "buff.example"},
                                                "compareType": "GE",
                                                "value": scalar(1),
                                            }
                                        ]
                                    },
                                }
                            ]
                        },
                    },
                ]
            }
        }

        jumps = parse_timeline_jumps(root, "fixture.json")

        self.assertEqual([jump.directConditionsSupported for jump in jumps], [True, True])
        self.assertEqual([jump.isOnlySequenceAction for jump in jumps], [True, True])
        self.assertTrue(all(timeline_jump_can_compile(jump) for jump in jumps))
        control_flow = SimpleNamespace(
            explicitFinishes=(
                SimpleNamespace(startFrame=90),
                SimpleNamespace(startFrame=150),
            ),
            timelineJumps=jumps,
            directDamageHits=(
                SimpleNamespace(startFrame=89),
                SimpleNamespace(startFrame=149),
            ),
            intervalDamageHits=(),
            inflictions=(),
            conditionalActions=(),
            auxiliaryActions=(),
            resourceGains=(),
            blackboardCalculations=(),
            blackboardMutations=(),
            buffBlackboardReads=(),
            buffFinishes=(),
            keywordActions=(),
        )
        self.assertTrue(ability_entity_child_finishes_are_terminal(control_flow))

    def test_outer_if_else_jump_is_one_shot_only_for_the_exact_success_path(self) -> None:
        condition_path = (
            "timelineActions[8]",
            "_sequenceActionData",
            "actionData",
            "[0]",
        )
        condition = ConditionalActionSource(
            startFrame=67,
            endFrame=68,
            actionIndex=20,
            actionPath=condition_path,
            conditions=(
                ConditionSource(
                    sourceType="CompareFloat",
                    supported=True,
                    comparison="Equals",
                    left=ScalarSource(0, "isCombo", None),
                    right=ScalarSource(0, None, None),
                    skillTypes=(),
                ),
            ),
            succeedActions=(),
            failActions=(),
        )
        jump = TimedTimelineJumpSource(
            startFrame=67,
            endFrame=68,
            destFrame=150,
            actionIndex=22,
            actionPath=(*condition_path, "succeedActions", "actionData", "[0]"),
            conditionActionTypes=(),
            isOnlyBranchAction=True,
            isRootContainerOnlySequenceAction=True,
            sequenceIndex=8,
        )
        hit = SimpleNamespace(conditionalActions=(condition,), localTargetGroupWrites=())

        self.assertTrue(timeline_jump_can_compile(jump, hit))
        self.assertFalse(timeline_jump_can_compile(replace(jump, isOnlyBranchAction=False), hit))
        self.assertFalse(
            timeline_jump_can_compile(
                replace(jump, actionPath=(*condition_path, "failActions", "actionData", "[0]")),
                hit,
            )
        )

    def test_disabled_entity_blackboard_accepts_only_the_empty_editor_placeholder(self) -> None:
        placeholder = {
            "targetKey": "",
            "inputValueKey": "",
            "useDirectValue": False,
            "directValueType": "Numeric",
            "numericValue": 0.0,
            "stringValue": "",
        }
        action = {
            "assignEntityBlackboard": False,
            "assignPairs": [placeholder],
        }

        self.assertEqual(parse_entity_blackboard_assignments(action, "fixture"), ())

        action["assignPairs"] = [{**placeholder, "targetKey": "meaningful"}]
        with self.assertRaisesRegex(ValueError, "expected empty when assignment is disabled"):
            parse_entity_blackboard_assignments(action, "fixture")

    def test_ability_entity_child_skill_keeps_spawn_offset_and_combat_details(self) -> None:
        spawn = {
            "$type": "Example.SpawnAbilityEntity+Data, Example",
            "serverActionIndex": 5,
            "isEnable": True,
            "abilityEntityId": "ability_entity",
            "abilityEntitySkillId": "child_skill",
            "assignBlackboard": False,
            "assignEntityBlackboard": False,
            "assignPairs": [],
            "setAbilityEntitySource": True,
            "abilityEntitySource": "ActionSource",
            "abilityEntitySourceContextKey": "",
            "setAbilityEntityTarget": False,
            "overrideDuration": False,
            "saveToContext": False,
            "contextKey": "",
            "dieWhenSourceDie": False,
            "dieOnEnd": False,
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {"_startFrame": 12, "_endFrame": 12, "_sequenceActionData": spawn}
                ]
            }
        }
        child = {
            "blackboard": [],
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
                    },
                    {
                        "_startFrame": 9,
                        "_endFrame": 9,
                        "_sequenceActionData": {
                            "$type": "Example.FinishOwnerAction+Data, Example",
                            "serverActionIndex": 1,
                            "isEnable": True,
                            "priorityLevel": "Default",
                            "priorityOffset": 0,
                            "owner": target_settings_fixture("Owner"),
                            "skipDieDisplay": False,
                        },
                    },
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
        self.assertEqual(hits[0].explicitFinishes[0].startFrame, 9)
        self.assertEqual(hits[0].explicitFinishes[0].target.targetSource, "Owner")
        self.assertFalse(hits[0].explicitFinishes[0].skipDieDisplay)

    def test_ability_entity_inherits_parent_blackboard_before_parsing_child_actions(self) -> None:
        spawn = {
            "$type": "Example.SpawnAbilityEntity+Data, Example",
            "serverActionIndex": 5,
            "isEnable": True,
            "abilityEntityId": "ability_entity",
            "abilityEntitySkillId": "child_skill",
            "assignEntityBlackboard": True,
            "setAbilityEntitySource": True,
            "abilityEntitySource": "ActionSource",
            "abilityEntitySourceContextKey": "",
            "setAbilityEntityTarget": False,
            "overrideDuration": False,
            "saveToContext": False,
            "contextKey": "",
            "dieWhenSourceDie": False,
            "dieOnEnd": False,
            "assignPairs": [
                {
                    "targetKey": "count",
                    "inputValueKey": "source_count",
                    "useDirectValue": False,
                    "directValueType": "Numeric",
                    "numericValue": 0,
                    "stringValue": "",
                }
            ],
            "assignBlackboard": True,
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {"_startFrame": 4, "_endFrame": 5, "_sequenceActionData": spawn}
                ]
            }
        }
        child = {
            "blackboard": [
                {"key": "attack", "valueDouble": 0, "valueStr": "", "isDynamic": False},
                {"key": "count", "valueDouble": 1, "valueStr": "", "isDynamic": True},
            ],
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {
                            "$type": "Example.SimpleCalcBBAction+Data, Example",
                            "serverActionIndex": 0,
                            "isEnable": True,
                            "key": "result",
                            "operation": "Add",
                            "value1": {
                                "useBlackboardKey": True,
                                "value": 0,
                                "blackboardKey": "attack",
                            },
                            "value2": {
                                "useBlackboardKey": True,
                                "value": 0,
                                "blackboardKey": "count",
                            },
                        },
                    }
                ]
            },
        }
        with tempfile.TemporaryDirectory() as directory:
            source_dir = Path(directory)
            (source_dir / "child_skill.json").write_text(json.dumps(child), encoding="utf-8")

            hits = resolve_ability_entity_hits(
                root,
                "parent.json",
                source_dir,
                inherited_blackboard={"attack": (2.0, 3.0), "source_count": (4.0, 5.0)},
            )

        hit = hits[0]
        self.assertTrue(hit.inheritsSourceBlackboard)
        self.assertEqual([item.key for item in hit.declaredBlackboard], ["attack", "count"])
        self.assertEqual(hit.blackboardCalculations[0].left.levelValues, (2.0, 3.0))
        self.assertEqual(hit.blackboardCalculations[0].right.levelValues, (4.0, 5.0))

    def test_damage_projection_uses_absolute_frames_across_child_skills(self) -> None:
        damage_units = (SimpleNamespace(attributeType="Hp"),)
        skill = SimpleNamespace(
            skillId="root",
            directDamageHits=(
                SimpleNamespace(startFrame=2, actionIndex=3, damageUnits=damage_units),
            ),
            projectileTriggeredSkills=(
                SimpleNamespace(
                    launchFrame=5,
                    actionOrder=(1,),
                    assumedTravelFrames=0,
                    triggerSkillId="projectile_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=3, actionIndex=0, damageUnits=damage_units),
                    ),
                    nestedProjectileTriggeredSkills=(),
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
                    projectileTriggeredSkills=(),
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
            projectileTriggeredSkills=(
                SimpleNamespace(
                    launchFrame=5,
                    actionOrder=(2,),
                    assumedTravelFrames=0,
                    triggerSkillId="projectile_hit",
                    directDamageHits=(
                        SimpleNamespace(startFrame=0, actionIndex=0, damageUnits=damage_units),
                    ),
                    nestedProjectileTriggeredSkills=(),
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
                    projectileTriggeredSkills=(),
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
                            "assignBlackboard": True,
                            "assignEntityBlackboard": False,
                            "assignPairs": [],
                            "castSkillOnHit": True,
                            "projectileSkillId": "child_hit",
                        },
                    }
                ]
            }
        }
        child = {
            "blackboard": [],
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
                            "assignBlackboard": True,
                            "assignEntityBlackboard": False,
                            "assignPairs": [],
                            "castSkillOnHit": True,
                            "projectileSkillId": "nested_hit",
                        },
                    }
                ]
            }
        }
        nested = {"blackboard": [], "actionGroupData": {"timelineActions": []}}
        with tempfile.TemporaryDirectory() as directory:
            source_dir = Path(directory)
            (source_dir / "child_hit.json").write_text(json.dumps(child), encoding="utf-8")
            (source_dir / "nested_hit.json").write_text(json.dumps(nested), encoding="utf-8")

            hits = resolve_projectile_triggered_skills(parent, "parent.json", source_dir)

        self.assertEqual(hits[0].actionOrder, (7,))
        self.assertEqual(hits[0].nestedProjectileTriggeredSkills[0].actionOrder, (7, 2))

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

    def test_trust_attribute_bonus_omits_source_confirmed_default(self) -> None:
        growth = {
            "talentNodeMap": {
                f"node-{stage}": {
                    "nodeType": 3,
                    "attributeNodeInfo": {
                        "breakStage": stage,
                        "attributeModifiers": [
                            {
                                "attrType": 41,
                                "attrValue": value,
                                "modifierType": 5,
                                "modifyAttributeType": 0,
                            }
                        ],
                    },
                }
                for stage, value in enumerate((10, 15, 15, 20), start=1)
            }
        }

        self.assertIsNone(parse_trust_attribute_bonus(growth, "intellect", "growth"))

    def test_trust_attribute_bonus_preserves_dual_attribute_exception(self) -> None:
        growth = {
            "talentNodeMap": {
                f"node-{stage}": {
                    "nodeType": 3,
                    "attributeNodeInfo": {
                        "breakStage": stage,
                        "attributeModifiers": [
                            {
                                "attrType": attr_type,
                                "attrValue": value,
                                "modifierType": 5,
                                "modifyAttributeType": 0,
                            }
                            for attr_type in (41, 42)
                        ],
                    },
                }
                for stage, value in enumerate((8, 10, 10, 15), start=1)
            }
        }

        self.assertEqual(
            parse_trust_attribute_bonus(growth, "intellect", "growth"),
            {
                "values": (8, 10, 10, 15),
                "attributes": ("intellect", "will"),
            },
        )

    def test_trust_attribute_bonus_rejects_incomplete_source_nodes(self) -> None:
        growth = {
            "talentNodeMap": {
                "node-1": {
                    "nodeType": 3,
                    "attributeNodeInfo": {
                        "breakStage": 1,
                        "attributeModifiers": [
                            {
                                "attrType": 41,
                                "attrValue": 10,
                                "modifierType": 5,
                                "modifyAttributeType": 0,
                            }
                        ],
                    },
                }
            }
        }

        with self.assertRaisesRegex(ValueError, "expected trust break stages"):
            parse_trust_attribute_bonus(growth, "intellect", "growth")

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

    def test_combo_skill_registration_accepts_a_known_skill_and_trigger(self) -> None:
        operator = {
            "slug": "operator",
            "comboSkillRegistrations": [
                {
                    "skillKey": "comboSkill",
                    "priority": "default",
                    "rules": [
                        {
                            "trigger": {
                                "kind": "damageTagHit",
                                "tag": "normalAttackLastCombo",
                                "scope": "team",
                            }
                        }
                    ],
                }
            ],
        }

        self.assertEqual(
            parse_combo_skill_registrations(
                operator,
                [SimpleNamespace(key="comboSkill")],
            ),
            operator["comboSkillRegistrations"],
        )

    def test_combo_skill_registration_rejects_unknown_fields(self) -> None:
        operator = {
            "slug": "operator",
            "comboSkillRegistrations": [
                {
                    "skillKey": "comboSkill",
                    "priority": "default",
                    "durationFrames": 150,
                    "rules": [],
                }
            ],
        }

        with self.assertRaisesRegex(ValueError, "unexpected fields"):
            parse_combo_skill_registrations(
                operator,
                [SimpleNamespace(key="comboSkill")],
            )

    def test_if_else_with_identical_combat_branches_is_folded_once(self) -> None:
        spawn = lambda server_index: {
            "$type": "Example.SpawnAbilityEntity+Data, Example",
            "isEnable": True,
            "serverActionIndex": server_index,
            "abilityEntityId": "entity",
            "abilityEntitySkillId": "hit_skill",
            "assignBlackboard": False,
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

    def test_resource_gain_flattens_for_each_in_single_enemy_model(self) -> None:
        gain = {
            "$type": "Example.ObtainCostAction+Data, Example",
            "isEnable": True,
            "serverActionIndex": 2,
            "costType": "UltimateSp",
            "atbSourceType": "Default",
            "atbGainMethod": "Gain",
            "atbOnlyMainChar": False,
            "isPercentValue": False,
            "useUspRecoverTag": False,
            "uspRecoverTag": {"tagId": 0},
            "ignoreUspGainScalar": False,
            "costValue": {
                "useBlackboardKey": False,
                "blackboardKey": "",
                "value": 8,
            },
            "coefficient": {
                "useBlackboardKey": False,
                "blackboardKey": "",
                "value": 1,
            },
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 12,
                        "_endFrame": 13,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.ForEachAction+Data, Example",
                                    "isEnable": True,
                                    "priorityLevel": "Default",
                                    "priorityOffset": 0,
                                    "serverActionIndex": 1,
                                    "target": {
                                        "targetSource": "Context",
                                        "targetGroupKey": "targets",
                                    },
                                    "action": {"actionData": [gain]},
                                }
                            ]
                        },
                    }
                ]
            }
        }

        gains = parse_resource_gains(root, "skill.json", {})

        self.assertEqual(len(gains), 1)
        self.assertEqual((gains[0].startFrame, gains[0].actionIndex), (12, 2))
        self.assertEqual(gains[0].resource, "ultimateEnergy")
        self.assertEqual(gains[0].amount.value, 8)

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
                                            "damageDecorateMask": 0,
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
                        "damageDecorateMask": 0,
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
        self.assertEqual(hits[0].tickFrames, (9, 11, 14))
        self.assertEqual(hits[0].intervalSeconds, 0.1)
        self.assertEqual(hits[0].damageUnits[0].attackScale.levelValues, (0.11, 0.25))

    def test_interval_damage_keeps_non_integral_frame_periods(self) -> None:
        self.assertEqual(
            project_tick_interval_frames(4, 12, 0.07),
            (4, 6, 8, 10, 12),
        )

    def test_conditional_inside_fixed_interval_preserves_every_execution_frame(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 12,
                        "_endFrame": 31,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.TickIntervalAction+Data, Example",
                                    "executeEachFrame": False,
                                    "tickInterval": 0.2,
                                    "tickIntervalBlackboardKey": "",
                                    "useTickIntervalBlackboardKey": False,
                                    "actionOnTick": {
                                        "actionData": [
                                            {
                                                "$type": "Example.IfElseAction+Data, Example",
                                                "serverActionIndex": 7,
                                                "conditionAction": {
                                                    "actionData": [
                                                        {
                                                            "$type": "Example.CompareFloat+Data, Example",
                                                            "valueA": {
                                                                "useBlackboardKey": True,
                                                                "value": 0,
                                                                "blackboardKey": "index",
                                                            },
                                                            "compare": "LT",
                                                            "valueB": {
                                                                "useBlackboardKey": False,
                                                                "value": 3,
                                                                "blackboardKey": "",
                                                            },
                                                        }
                                                    ]
                                                },
                                                "succeedActions": {
                                                    "actionData": [
                                                        {
                                                            "$type": "Example.DamageAction+Data, Example",
                                                            "serverActionIndex": 8,
                                                        }
                                                    ]
                                                },
                                                "failActions": {"actionData": []},
                                            }
                                        ]
                                    },
                                }
                            ]
                        },
                    }
                ]
            }
        }

        conditions = parse_conditional_actions(root, "skill.json", {})

        self.assertEqual(len(conditions), 1)
        self.assertEqual(conditions[0].executionFrames, (12, 17, 23, 29))

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
                            "damageDecorateMask": 0,
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

    def test_poise_unit_uses_its_own_definite_value_calculation(self) -> None:
        root = {
            "actionGroupData": {
                "action": {
                    "$type": "Example.DamageAction, Example",
                    "damageUnits": [
                        {
                            "damageType": "Natural",
                            "damageAttributeType": "Poise",
                            "damageDecorateMask": 0,
                            "simpleCalculation": False,
                            "atkScale": {
                                "useBlackboardKey": False,
                                "blackboardKey": "",
                                "value": 1,
                            },
                            # Poise 分支不读取生命伤害公式；真实数据仍可能携带该占位对象。
                            "atkCalculation": {
                                "$type": "Example.DefiniteValueCalculation, Example",
                                "value": {
                                    "useBlackboardKey": False,
                                    "blackboardKey": "",
                                    "value": 1,
                                },
                            },
                            "poiseCalculation": {
                                "$type": "Example.DefiniteValueCalculation, Example",
                                "value": {
                                    "useBlackboardKey": True,
                                    "blackboardKey": "poise",
                                    "value": 20,
                                },
                                "applyScale": False,
                            },
                        }
                    ],
                }
            }
        }

        unit = parse_damage_units(root, "ultimate.json", {"poise": (20.0, 30.0)})[0]

        self.assertEqual(unit.attributeType, "Poise")
        self.assertEqual(unit.poiseValue.levelValues, (20.0, 30.0))
        self.assertEqual(unit.calculation, "standard")

        root["actionGroupData"]["action"]["damageUnits"][0]["poiseCalculation"][
            "applyScale"
        ] = True
        root["actionGroupData"]["action"]["damageUnits"][0]["poiseCalculation"][
            "valueScale"
        ] = {
            "useBlackboardKey": False,
            "blackboardKey": "",
            "value": 0.3333333,
        }
        scaled = parse_damage_units(
            root,
            "ultimate.json",
            {"poise": (20.0, 30.0)},
        )[0]

        scale = struct.unpack("<f", struct.pack("<f", 0.3333333))[0]
        self.assertIsNone(scaled.poiseValue.blackboardKey)
        self.assertEqual(scaled.poiseValue.levelValues, (20.0 * scale, 30.0 * scale))

        root["actionGroupData"]["action"]["damageUnits"][0]["poiseCalculation"][
            "valueScale"
        ] = {
            "useBlackboardKey": True,
            "blackboardKey": "scale",
            "value": 1,
        }
        with self.assertRaisesRegex(ValueError, "dynamic scale is not supported"):
            parse_damage_units(root, "ultimate.json", {"poise": (20.0, 30.0)})

    def test_hp_definite_value_compiles_as_fixed_damage(self) -> None:
        root = {
            "actionGroupData": {
                "action": {
                    "$type": "Example.DamageAction, Example",
                    "damageUnits": [
                        {
                            "damageType": "Physical",
                            "damageAttributeType": "Hp",
                            "damageDecorateMask": 512,
                            "simpleCalculation": False,
                            "atkScale": {
                                "useBlackboardKey": False,
                                "blackboardKey": "",
                                "value": 1,
                            },
                            "atkCalculation": {
                                "$type": "Example.DefiniteValueCalculation, Example",
                                "value": {
                                    "useBlackboardKey": False,
                                    "blackboardKey": "",
                                    "value": 0.01,
                                },
                                "applyScale": False,
                            },
                        }
                    ],
                }
            }
        }

        unit = parse_damage_units(root, "ultimate.json", {})[0]

        self.assertEqual(unit.calculation, "definiteValue")
        self.assertEqual(unit.definiteValue.value, 0.01)
        self.assertEqual(
            compile_damage_units_step((unit,), ("ultimateSkill",), "ultimate.hit"),
            [
                "step('dealFixedDamage', {",
                "  damageType: 'physical',",
                "  value: 0.01,",
                "  tags: ['ultimateSkill'],",
                "})",
            ],
        )

        root["actionGroupData"]["action"]["damageUnits"][0]["atkCalculation"][
            "applyScale"
        ] = True
        with self.assertRaisesRegex(ValueError, "scaled definite values"):
            parse_damage_units(root, "ultimate.json", {})

    def test_damage_unit_requires_native_decorate_mask(self) -> None:
        root = {
            "actionGroupData": {
                "action": {
                    "$type": "Example.DamageAction, Example",
                    "damageUnits": [
                        {
                            "damageType": "Physical",
                            "damageAttributeType": "Hp",
                            "simpleCalculation": True,
                            "atkScale": {
                                "useBlackboardKey": False,
                                "blackboardKey": "",
                                "value": 1,
                            },
                        }
                    ],
                }
            }
        }

        with self.assertRaisesRegex(ValueError, "damageDecorateMask"):
            parse_damage_units(root, "skill.json", {})

    def test_skill_event_listener_preserves_registration_interval_and_action_order(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 3,
                        "_endFrame": 20,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.EventListenerAction+Data, Example",
                                    "isEnable": True,
                                    "priorityLevel": "Default",
                                    "priorityOffset": 0,
                                    "serverActionIndex": 7,
                                    "abilityActionMap": [
                                        {
                                            "abilityEvent": "OnAfterKillEntity",
                                            "actions": [
                                                {
                                                    "actionData": [
                                                        {
                                                            "$type": "Example.CheckDamageDecorateMask+Data, Example",
                                                            "isEnable": True,
                                                            "serverActionIndex": 8,
                                                        },
                                                        {
                                                            "$type": "Example.CompareFloat+Data, Example",
                                                            "isEnable": True,
                                                            "serverActionIndex": 9,
                                                        },
                                                    ],
                                                    "onlyExecuteWhenSourceIsMainChar": False,
                                                    "onlyExecuteWhenSourceIsGuard": False,
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ]
                        },
                    }
                ]
            }
        }

        listener = parse_skill_event_listeners(root, "fixture.json", {})[0]

        self.assertEqual((listener.startFrame, listener.endFrame), (3, 20))
        self.assertEqual(listener.actionIndex, 7)
        self.assertEqual((listener.priorityLevel, listener.priorityOffset), ("Default", 0))
        self.assertEqual(listener.event, "OnAfterKillEntity")
        self.assertEqual(
            listener.sequences[0].orderedActionTypes,
            ("CheckDamageDecorateMask", "CompareFloat"),
        )
        self.assertEqual(listener.sequences[0].combatActions, ())
        self.assertEqual(listener.sequences[0].actions, ())

    def test_skill_event_listener_actions_do_not_count_as_root_timeline_actions(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 3,
                        "_endFrame": 20,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.EventListenerAction+Data, Example",
                                    "isEnable": True,
                                    "abilityActionMap": [
                                        {
                                            "abilityEvent": "OnAfterKillEntity",
                                            "actions": [
                                                {
                                                    "actionData": [
                                                        {
                                                            "$type": "Example.CreateBuffAction+Data, Example",
                                                            "isEnable": True,
                                                        }
                                                    ]
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ]
                        },
                    },
                    {
                        "_startFrame": 21,
                        "_endFrame": 21,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.CreateBuffAction+Data, Example",
                                    "isEnable": True,
                                }
                            ]
                        },
                    },
                ]
            }
        }

        timeline = parse_timeline(root, "fixture.json")

        self.assertEqual(timeline[0].actionTypes, ("EventListenerAction",))
        self.assertEqual(timeline[1].actionTypes, ("CreateBuffAction",))
        self.assertEqual(
            collect_unresolved_combat_actions(timeline),
            ("CreateBuffAction",),
        )

    def test_skill_event_listener_preserves_guarded_blackboard_mutation(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 3,
                        "_endFrame": 20,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.EventListenerAction+Data, Example",
                                    "isEnable": True,
                                    "priorityLevel": "Default",
                                    "priorityOffset": 0,
                                    "serverActionIndex": 7,
                                    "abilityActionMap": [
                                        {
                                            "abilityEvent": "OnAfterKillEntity",
                                            "actions": [
                                                {
                                                    "actionData": [
                                                        {
                                                            "$type": "Example.CompareFloat+Data, Example",
                                                            "isEnable": True,
                                                            "serverActionIndex": 8,
                                                            "valueA": {
                                                                "useBlackboardKey": True,
                                                                "blackboardKey": "enabled",
                                                                "value": 0,
                                                            },
                                                            "compare": "GT",
                                                            "valueB": {
                                                                "useBlackboardKey": False,
                                                                "blackboardKey": "",
                                                                "value": 0,
                                                            },
                                                        },
                                                        {
                                                            "$type": "Example.ModifyDynamicBlackboard+Data, Example",
                                                            "isEnable": True,
                                                            "serverActionIndex": 9,
                                                            "key": "kill_num",
                                                            "operation": "Add",
                                                            "directValue": True,
                                                            "value": {
                                                                "useBlackboardKey": False,
                                                                "blackboardKey": "",
                                                                "value": 1,
                                                            },
                                                            "calculationTarget": {
                                                                "targetSource": "Owner",
                                                                "targetGroupKey": "",
                                                            },
                                                            "calculateType": "HpRatio",
                                                        },
                                                    ],
                                                    "onlyExecuteWhenSourceIsMainChar": False,
                                                    "onlyExecuteWhenSourceIsGuard": False,
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ]
                        },
                    }
                ]
            }
        }

        sequence = parse_skill_event_listeners(root, "fixture.json", {"enabled": (1,)})[
            0
        ].sequences[0]

        self.assertEqual(len(sequence.actions), 1)
        guard = sequence.actions[0].nestedCondition
        self.assertIsNotNone(guard)
        assert guard is not None
        self.assertEqual(guard.conditions[0].sourceType, "CompareFloat")
        mutation = guard.succeedActions[0].blackboardMutation
        self.assertIsNotNone(mutation)
        assert mutation is not None
        self.assertEqual(mutation.key, "kill_num")
        compiled = compile_skill_event_listener(
            parse_skill_event_listeners(root, "fixture.json", {"enabled": (1,)})[0],
            "fixture.eventListener",
            runtime_blackboard_keys=frozenset({"enabled", "kill_num"}),
            step_key_prefix="fixture",
        )
        self.assertIn("step('listenForCombatEvents'", compiled)
        self.assertIn("kind: 'enemyDefeated'", compiled)
        self.assertIn("sequence: sequence(", compiled)
        self.assertIn("key: 'kill_num'", compiled)
        self.assertIn("operation: 'add'", compiled)

    def test_skill_event_listener_preserves_event_context_condition_payloads(self) -> None:
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 10,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.EventListenerAction+Data, Example",
                                    "isEnable": True,
                                    "priorityLevel": "Default",
                                    "priorityOffset": 0,
                                    "serverActionIndex": 1,
                                    "abilityActionMap": [
                                        {
                                            "abilityEvent": "OnAddedBuff",
                                            "actions": [
                                                {
                                                    "actionData": [
                                                        {
                                                            "$type": "Example.CheckBuffIdInContext+Data, Example",
                                                            "isEnable": True,
                                                            "serverActionIndex": 2,
                                                            "checkType": "Id",
                                                            "buffIdList": [{"buffId": "buff_a"}],
                                                            "query": {"queryType": "HasAny"},
                                                        },
                                                        {
                                                            "$type": "Example.CheckDamageDecorateMask+Data, Example",
                                                            "isEnable": True,
                                                            "serverActionIndex": 3,
                                                            "checkType": "HasAll",
                                                            "mask": 8192,
                                                        },
                                                        {
                                                            "$type": "Example.ModifyDynamicBlackboard+Data, Example",
                                                            "isEnable": True,
                                                            "serverActionIndex": 4,
                                                            "key": "count",
                                                            "operation": "Add",
                                                            "directValue": True,
                                                            "value": {
                                                                "useBlackboardKey": False,
                                                                "blackboardKey": "",
                                                                "value": 1,
                                                            },
                                                            "calculationTarget": {
                                                                "targetSource": "Owner",
                                                                "targetGroupKey": "",
                                                            },
                                                            "calculateType": "HpRatio",
                                                        },
                                                    ],
                                                    "onlyExecuteWhenSourceIsMainChar": False,
                                                    "onlyExecuteWhenSourceIsGuard": False,
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ]
                        },
                    }
                ]
            }
        }

        actions = parse_skill_event_listeners(root, "fixture.json", {})[0].sequences[0].actions
        buff_guard = actions[0].nestedCondition
        self.assertIsNotNone(buff_guard)
        assert buff_guard is not None
        context_buff = buff_guard.conditions[0].contextBuffId
        self.assertIsNotNone(context_buff)
        assert context_buff is not None
        self.assertEqual(context_buff.buffIds, ("buff_a",))
        damage_guard = buff_guard.succeedActions[0].nestedCondition
        self.assertIsNotNone(damage_guard)
        assert damage_guard is not None
        damage_mask = damage_guard.conditions[0].damageDecorateMask
        self.assertIsNotNone(damage_mask)
        assert damage_mask is not None
        self.assertEqual(damage_mask.mask, 8192)
        compiled = compile_combat_condition(
            damage_guard.conditions[0],
            "fixture.damageMask",
        )
        self.assertIn("kind: 'eventDamageTagsMatch'", compiled)
        self.assertIn("match: 'hasAll'", compiled)
        self.assertIn("tags: ['comboSkill']", compiled)

    def test_empty_id_buff_finish_makes_native_listener_a_proven_noop(self) -> None:
        finish = BuffFinishPayload(
            targetSource="Owner",
            targetGroupKey="",
            buffCheckType="Id",
            buffIds=(),
            tagQueryType="hasAny",
            buffTagIds=(),
            finishAll=True,
            limitSource=False,
            isFinishedEarly=False,
            isAbsorbed=False,
        )
        response = SkillEventActionSequenceSource(
            onlyMainOperator=False,
            onlyGuard=False,
            orderedActionTypes=("FinishBuffAdvanced",),
            combatActions=(),
            buffApplications=(),
            actions=(
                ConditionalBranchActionSource(
                    actionType="FinishBuffAdvanced",
                    actionIndex=0,
                    buffFinish=finish,
                ),
            ),
        )
        listener = SkillEventListenerSource(
            startFrame=44,
            endFrame=111,
            actionIndex=1498,
            priorityLevel="Default",
            priorityOffset=0,
            event="OnSkillEnd",
            sequences=(response,),
        )

        self.assertTrue(event_listener_is_proven_noop(listener))
        self.assertIsNone(
            compile_skill_event_listener(
                listener,
                "rossi.ultimate.eventListener",
                runtime_blackboard_keys=frozenset(),
                step_key_prefix="ultimate",
            )
        )

        nonempty_listener = replace(
            listener,
            sequences=(
                replace(
                    response,
                    actions=(
                        replace(
                            response.actions[0],
                            buffFinish=replace(finish, buffIds=("buff_rossi",)),
                        ),
                    ),
                ),
            ),
        )
        self.assertFalse(event_listener_is_proven_noop(nonempty_listener))
        with self.assertRaisesRegex(ValueError, "unsupported native skill event 'OnSkillEnd'"):
            compile_skill_event_listener(
                nonempty_listener,
                "fixture.eventListener",
                runtime_blackboard_keys=frozenset(),
                step_key_prefix="fixture",
            )

    def test_damage_mask_condition_splits_mixed_native_properties(self) -> None:
        condition = SimpleNamespace(
            sourceType="CheckDamageDecorateMask",
            damageDecorateMask=SimpleNamespace(checkType="HasAny", mask=33280),
        )

        compiled = compile_combat_condition(condition, "fixture.damageMask")

        self.assertIn("kind: 'any'", compiled)
        self.assertIn("kind: 'eventDamageTagsMatch'", compiled)
        self.assertIn("tags: ['ultimateSkill']", compiled)
        self.assertIn("kind: 'eventDamageFeaturesMatch'", compiled)
        self.assertIn("features: ['airborne']", compiled)

    def test_damage_mask_condition_preserves_dot_area_exclusion(self) -> None:
        condition = SimpleNamespace(
            sourceType="CheckDamageDecorateMask",
            damageDecorateMask=SimpleNamespace(checkType="ExceptAny", mask=805306368),
        )

        compiled = compile_combat_condition(condition, "fixture.damageMask")

        self.assertIn("kind: 'eventDamageFeaturesMatch'", compiled)
        self.assertIn("match: 'exceptAny'", compiled)
        self.assertIn("features: ['dot', 'remainArea']", compiled)

    def test_context_ability_entity_duration_guard_and_assignment_compile(self) -> None:
        target = target_settings_fixture("Context", target_group_key="swordsForExtend")
        input_target = target_settings_fixture("Target")
        duration = {"useBlackboardKey": False, "value": 3.0, "blackboardKey": ""}
        metadata = {
            "isEnable": True,
            "priorityLevel": "Default",
            "priorityOffset": 0,
        }
        root = {
            "actionGroupData": {
                "timelineActions": [
                    {
                        "_startFrame": 0,
                        "_endFrame": 1,
                        "_sequenceActionData": {
                            "actionData": [
                                {
                                    "$type": "Example.ForEachAction+Data, Example",
                                    **metadata,
                                    "serverActionIndex": 1,
                                    "target": target,
                                    "action": {
                                        "actionData": [
                                            {
                                                "$type": "Example.CheckAbilityEntityCurDuration+Data, Example",
                                                **metadata,
                                                "serverActionIndex": 2,
                                                "abilityEntity": input_target,
                                                "compareType": "LT",
                                                "value": duration,
                                                "saveCurDuration": False,
                                                "bbKey": "",
                                            },
                                            {
                                                "$type": "Example.SetAbilityEntityDuration+Data, Example",
                                                **metadata,
                                                "serverActionIndex": 3,
                                                "setMultipleTarget": False,
                                                "targetSettings": input_target,
                                                "actionTargetType": "InputTarget",
                                                "targetContextKey": "",
                                                "operation": "Assign",
                                                "value": duration,
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

        parsed = parse_conditional_actions(
            root,
            "duration.json",
            {},
            include_for_each_sequence_guards=True,
        )
        self.assertEqual(len(parsed), 1)
        self.assertEqual(parsed[0].contextKey, "swordsForExtend")
        guard = parsed[0].succeedActions[0].nestedCondition
        self.assertIsNotNone(guard)
        self.assertEqual(
            guard.conditions[0].abilityEntityDuration.comparison,
            "LT",
        )

        compiled = compile_conditional_action(parsed[0], "fixture.duration")
        self.assertIn("forEachContextTarget(", compiled)
        self.assertIn("'swordsForExtend'", compiled)
        self.assertIn("kind: 'abilityEntityRemainingDurationCompare'", compiled)
        self.assertIn("operator: 'less'", compiled)
        self.assertIn("step('setAbilityEntityRemainingDuration'", compiled)
        self.assertIn("{ kind: 'constant', value: 3 }", compiled)

        invalid = json.loads(json.dumps(root))
        invalid["actionGroupData"]["timelineActions"][0]["_sequenceActionData"][
            "actionData"
        ][0]["action"]["actionData"][1]["operation"] = "Add"
        with self.assertRaisesRegex(ValueError, "operation: unsupported value 'Add'"):
            parse_conditional_actions(
                invalid,
                "duration.json",
                {},
                include_for_each_sequence_guards=True,
            )

    def test_named_context_duration_assignment_requires_singleton_spawn_provenance(self) -> None:
        spawn = AbilityEntitySpawnPayload(
            abilityEntityId="abilityentity_fixture",
            skillId="fixture_child",
            sourceType="ActionSource",
            saveToContextKey="bunshin1",
        )
        assignment = AbilityEntityDurationAssignmentPayload(
            setMultipleTarget=False,
            actionTargetType="ContextTarget",
            targetContextKey="bunshin1",
            operation="Assign",
            value=ScalarSource(0.5, None, None),
        )
        action = UnconditionalActionSource(
            startFrame=0,
            endFrame=1,
            actionIndex=0,
            actionPath=("timelineActions[0]",),
            conditions=(),
            succeedActions=(
                ConditionalBranchActionSource(
                    actionType="SpawnAbilityEntity",
                    actionIndex=0,
                    abilityEntitySpawn=spawn,
                ),
                ConditionalBranchActionSource(
                    actionType="SetAbilityEntityDuration",
                    actionIndex=1,
                    abilityEntityDurationAssignment=assignment,
                ),
            ),
            failActions=(),
            projectedAbilityEntitySpawns=(spawn,),
        )

        compiled = compile_conditional_action(action, "fixture.namedDuration")

        self.assertIn("forEachContextTarget(", compiled)
        self.assertIn("'bunshin1'", compiled)
        self.assertIn("setAbilityEntityRemainingDuration", compiled)

        without_spawn = replace(
            action,
            succeedActions=action.succeedActions[1:],
            projectedAbilityEntitySpawns=(),
        )
        with self.assertRaisesRegex(ValueError, "requires singleton provenance"):
            compile_conditional_action(without_spawn, "fixture.namedDuration")


if __name__ == "__main__":
    unittest.main()
