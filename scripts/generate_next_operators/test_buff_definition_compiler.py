"""验证审计 Buff 定义进入正式内联 DSL 时的严格边界。"""

import unittest
from types import SimpleNamespace

from buff_definition_compiler import (
    compile_inline_buff_definition,
    is_strictly_presentation_only_buff,
)
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
        "damageModifiers": (),
        "healModifiers": (),
        "directDamageHits": (),
        "inflictions": (),
        "conditionalActions": (),
        "blackboardCalculations": (),
        "blackboardMutations": (),
        "buffBlackboardReads": (),
        "buffFinishes": (),
        "eventActions": (),
        "sourceDeathFinish": None,
        "resourceGains": (),
        "combatActions": (),
        "auraActions": (),
        "invokedAbilityEntitySkills": (),
        "auxiliaryActions": (),
        "targetGroupWrites": (),
        "skillReplacements": (),
        "shields": (),
        "sustainedProtections": (),
        "unparsedPayloads": (),
        "useTimeDilationDt": False,
        "onlyUseSelfTimeDilation": False,
        "presentation": None,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


class BuffDefinitionCompilerTests(unittest.TestCase):
    def test_preserves_native_buff_icon_identity_and_rendering_metadata(self) -> None:
        source = definition(
            presentation=SimpleNamespace(
                hasIcon=True,
                spritePath="icon_battle_affix_combo",
                showInHeadBarCommon=True,
                showInHeadBarAttached=False,
                showInSquadIcon=True,
                onlyShowForMainCharacter=False,
                iconStyleInSquad="Default",
                abnormalColorType="Physical",
                orderUseDirectoryValue=False,
                orderPriorityValue=7,
                orderPriorityEnum="CommonCharBuff",
            )
        )

        compiled = compile_inline_buff_definition(source, "skill.buff")

        self.assertIn("iconId: 'icon_battle_affix_combo'", compiled)
        self.assertIn("iconPath: '/icons/icon_battle_affix_combo.webp'", compiled)
        self.assertIn("visible: true", compiled)
        self.assertIn("showInSquadIcon: true", compiled)
        self.assertIn("value: 7", compiled)

    def test_compiles_conditional_healer_result_multiplier(self) -> None:
        source = definition(
            healModifiers=(
                SimpleNamespace(
                    enabledSide="Healer",
                    targetHealthComparison=SimpleNamespace(
                        targetSource="Target",
                        targetGroupKey="",
                        comparison="LE",
                        isRatio=True,
                        value=scalar(0.5, "rate"),
                    ),
                    baseMultiplier=scalar(0.1, "heal_up"),
                    multiplierCount=scalar(1),
                ),
            ),
        )

        compiled = compile_inline_buff_definition(source, "skill.buff")

        self.assertIn("healModifiers: [", compiled)
        self.assertIn("enabledSide: 'healer'", compiled)
        self.assertIn("kind: 'targetHealthCompare'", compiled)
        self.assertIn("operator: 'lessOrEqual'", compiled)
        self.assertIn("blackboardKey: 'heal_up'", compiled)

    def test_ignores_strictly_presentation_only_stack_effects(self) -> None:
        lifecycle = vars(definition().lifecycle) | {
            "hasStackEffects": True,
            "stackEffectActionTypes": ("EffectAction",),
        }
        source = definition(lifecycle=SimpleNamespace(**lifecycle))

        compiled = compile_inline_buff_definition(source, "skill.buff")

        self.assertIn("stackingType:", compiled)
        self.assertTrue(is_strictly_presentation_only_buff(source))

    def test_ignores_strictly_presentation_only_events_without_stack_effects(self) -> None:
        lifecycle = vars(definition().lifecycle) | {"stackEffectActionTypes": ()}
        source = definition(
            lifecycle=SimpleNamespace(**lifecycle),
            eventActions=(
                SimpleNamespace(
                    orderedActionTypes=("TogglableAction",),
                    sequences=(SimpleNamespace(actions=()),),
                    combatActions=(),
                    damageUnits=(),
                    buffApplications=(),
                    createdBuffIds=(),
                    forEachActions=(),
                    targetGroupWrites=(),
                    runtimeTargetGroupWrites=(),
                    obtainAtbFilters=(),
                    contextBuffTagQueries=(),
                    consumeBuffLayerChecks=(),
                ),
            ),
        )

        self.assertTrue(is_strictly_presentation_only_buff(source))

    def test_rejects_non_presentation_stack_effects(self) -> None:
        lifecycle = vars(definition().lifecycle) | {
            "hasStackEffects": True,
            "stackEffectActionTypes": ("DamageAction",),
        }
        source = definition(lifecycle=SimpleNamespace(**lifecycle))

        with self.assertRaisesRegex(ValueError, "unsupported stack effects"):
            compile_inline_buff_definition(source, "skill.buff")
        self.assertFalse(is_strictly_presentation_only_buff(source))

    def test_gameplay_payload_prevents_presentation_only_classification(self) -> None:
        lifecycle = vars(definition().lifecycle) | {
            "hasStackEffects": True,
            "stackEffectActionTypes": ("EffectAction",),
        }
        source = definition(
            lifecycle=SimpleNamespace(**lifecycle),
            applyTagIds=(123,),
        )

        self.assertFalse(is_strictly_presentation_only_buff(source))

    def test_compiles_dynamic_max_stack_count_from_buff_blackboard(self) -> None:
        lifecycle = vars(definition().lifecycle) | {
            "maxStackCount": scalar(0, "max_stack"),
        }
        source = definition(lifecycle=SimpleNamespace(**lifecycle))

        compiled = compile_inline_buff_definition(source, "skill.buff")

        self.assertIn("maxStackCount: { blackboardKey: 'max_stack' }", compiled)

    def test_compiles_dynamic_max_trigger_count_from_buff_blackboard(self) -> None:
        lifecycle = vars(definition().lifecycle) | {
            "triggerInterval": scalar(0, "interval"),
            "maxTriggerCount": scalar(0, "trigger_times"),
        }
        source = definition(lifecycle=SimpleNamespace(**lifecycle))

        compiled = compile_inline_buff_definition(source, "skill.buff")

        self.assertIn("maxTriggerCount: { blackboardKey: 'trigger_times' }", compiled)

    def test_compiles_a_complete_simple_definition_without_id(self) -> None:
        result = compile_inline_buff_definition(definition(), "fixture")

        self.assertIn("stackingType: 'refresh'", result)
        self.assertIn("durationSeconds: 10", result)
        self.assertNotIn("buff.example", result)

    def test_maps_native_buff_tick_flags_to_time_clock(self) -> None:
        self.assertNotIn(
            "timeClock",
            compile_inline_buff_definition(
                definition(useTimeDilationDt=False, onlyUseSelfTimeDilation=True),
                "fixture.default",
            ),
        )
        self.assertIn(
            "timeClock: 'global'",
            compile_inline_buff_definition(
                definition(useTimeDilationDt=True, onlyUseSelfTimeDilation=False),
                "fixture.global",
            ),
        )
        self.assertIn(
            "timeClock: 'self'",
            compile_inline_buff_definition(
                definition(useTimeDilationDt=True, onlyUseSelfTimeDilation=True),
                "fixture.self",
            ),
        )

    def test_maps_converted_pulse_modifier_to_runtime_damage_attribute(self) -> None:
        source = definition(
            attributeModifiers=(
                SimpleNamespace(
                    targetType="Specific",
                    attributeType="PulseDamageIncrease",
                    slot="BaseAddition",
                    value=scalar(0, "pulse_up"),
                ),
            ),
            attributeModifiersConverted=True,
        )

        result = compile_inline_buff_definition(source, "fixture")

        self.assertIn("attribute: 'electricDamageIncrease'", result)
        self.assertIn("source: 'converted'", result)

    def test_maps_native_critical_modifiers_to_runtime_snapshot_attributes(self) -> None:
        source = definition(
            attributeModifiers=(
                SimpleNamespace(
                    targetType="Specific",
                    attributeType="CriticalRate",
                    slot="Addition",
                    value=scalar(0.25),
                ),
                SimpleNamespace(
                    targetType="Specific",
                    attributeType="CriticalDamageIncrease",
                    slot="Addition",
                    value=scalar(0.5),
                ),
            ),
        )

        result = compile_inline_buff_definition(source, "fixture")

        self.assertIn("attribute: 'criticalRate'", result)
        self.assertIn("attribute: 'criticalDamageIncrease'", result)

    def test_rejects_lifecycle_behavior_that_would_be_lost(self) -> None:
        source = definition(eventActions=(SimpleNamespace(event="OnBuffStart"),))

        with self.assertRaisesRegex(ValueError, "eventActions"):
            compile_inline_buff_definition(source, "fixture")

    def test_ignores_strictly_presentation_only_buff_events(self) -> None:
        source = definition(
            eventActions=(
                SimpleNamespace(
                    event="DuringBuffEnable",
                    orderedActionTypes=("EffectAction",),
                    combatActions=(),
                    damageUnits=(),
                    buffApplications=(),
                    createdBuffIds=(),
                    forEachActions=(),
                ),
            )
        )

        result = compile_inline_buff_definition(source, "fixture")

        self.assertIn("stackingType: 'refresh'", result)
        self.assertNotIn("lifecycleSequences", result)

    def test_ignores_guarded_presentation_only_buff_events(self) -> None:
        source = definition(
            eventActions=(
                SimpleNamespace(
                    event="DuringBuffEnable",
                    orderedActionTypes=("CheckBuffStackNumAdvanced", "EffectAction"),
                    combatActions=(),
                    damageUnits=(),
                    buffApplications=(),
                    createdBuffIds=(),
                    forEachActions=(),
                    targetGroupWrites=(),
                    sequences=(SimpleNamespace(actions=()),),
                ),
            )
        )

        result = compile_inline_buff_definition(source, "fixture")

        self.assertIn("stackingType: 'refresh'", result)
        self.assertNotIn("lifecycleSequences", result)

    def test_compiles_shield_and_sustained_protection(self) -> None:
        source = definition(
            shields=(
                SimpleNamespace(
                    infinityValue=False,
                    value=scalar(0, "FinalShield"),
                    absorbCount=scalar(-1),
                    absorbAllDamageWhenConsumed=False,
                    removeBuffWhenConsumed=True,
                    priority="PrioritizeConsume",
                    replaceHitEffect=True,
                    damageAbsorptions=(
                        SimpleNamespace(
                            damageType="heat",
                            ratio=scalar(0.5),
                            scale=scalar(2),
                        ),
                    ),
                ),
            ),
            sustainedProtections=(
                SimpleNamespace(
                    target=SimpleNamespace(
                        targetSource="Source",
                        targetGroupKey="",
                        validatorTypes=(),
                        postProcessorTypes=(),
                    ),
                    superArmor=scalar(35),
                    impactResistance=scalar(100),
                ),
            ),
        )

        compiled = compile_inline_buff_definition(source, "fixture")

        self.assertIn("shields: [", compiled)
        self.assertIn("value: { blackboardKey: 'FinalShield' }", compiled)
        self.assertIn("priority: 'prioritizeConsume'", compiled)
        self.assertIn("target: 'buffSource'", compiled)
        self.assertIn("superArmor: 35", compiled)

    def test_rejects_guarded_event_when_it_has_a_projected_action(self) -> None:
        source = definition(
            eventActions=(
                SimpleNamespace(
                    event="DuringBuffEnable",
                    orderedActionTypes=("CheckBuffStackNumAdvanced", "EffectAction"),
                    combatActions=(),
                    damageUnits=(),
                    buffApplications=(),
                    createdBuffIds=(),
                    forEachActions=(),
                    targetGroupWrites=(),
                    sequences=(SimpleNamespace(actions=(object(),)),),
                ),
            )
        )

        with self.assertRaisesRegex(ValueError, "eventActions"):
            compile_inline_buff_definition(source, "fixture")

    def test_compiles_the_strict_source_death_owner_finish_monitor(self) -> None:
        source = definition(
            eventActions=(SimpleNamespace(event="OnBuffTrigger"),),
            sourceDeathFinish=SimpleNamespace(skipDieDisplay=False),
        )

        result = compile_inline_buff_definition(source, "fixture")

        self.assertIn("lifecycleSequences", result)
        self.assertIn("step('finishCurrentAbilityEntityWhenSourceDies', {})", result)

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

    def test_compiles_fluorite_style_conditional_damage_modifier(self) -> None:
        source = definition(
            blackboard=(SimpleNamespace(key="dmg_up", value=0.2),),
            damageModifiers=(
                SimpleNamespace(
                    enabledSide="Attacker",
                    targetSource="Target",
                    targetGroupKey="",
                    tagQueryType="hasAny",
                    tagIds=(1925762097,),
                    processors=(
                        SimpleNamespace(
                            side="Attacker",
                            zone="NormalCalcZone",
                            addition=scalar(0.2, "dmg_up"),
                        ),
                    ),
                ),
            ),
        )

        result = compile_inline_buff_definition(source, "fixture")

        self.assertIn("kind: 'entityTagMatch'", result)
        self.assertIn("target: 'enemy'", result)
        self.assertIn("tagQueryType: 'hasAny'", result)
        self.assertIn("tagIds: [1925762097]", result)
        self.assertIn("zone: 'normal'", result)
        self.assertIn("addition: { blackboardKey: 'dmg_up' }", result)

    def test_compiles_lastrite_style_composite_damage_modifier(self) -> None:
        source = definition(
            blackboard=(
                SimpleNamespace(key="potential_1", value=1),
                SimpleNamespace(key="atk_up", value=0.2),
            ),
            damageModifiers=(
                SimpleNamespace(
                    enabledSide="Attacker",
                    targetSource="",
                    targetGroupKey="",
                    tagQueryType="hasAny",
                    tagIds=(),
                    ownerControlled=True,
                    damageTagMatch="hasAny",
                    damageTags=("normalAttackLastCombo",),
                    damageFeatureMatch=None,
                    damageFeatures=(),
                    numberComparisons=(
                        SimpleNamespace(
                            left=scalar(0, "potential_1"),
                            comparison="Equals",
                            right=scalar(1),
                        ),
                    ),
                    processors=(
                        SimpleNamespace(
                            side="Attacker",
                            zone="NormalCalcZone",
                            addition=scalar(0.2, "atk_up"),
                        ),
                    ),
                ),
            ),
        )

        result = compile_inline_buff_definition(source, "fixture")

        self.assertIn("kind: 'all'", result)
        self.assertIn("kind: 'casterControlled'", result)
        self.assertIn("kind: 'eventDamageTagsMatch'", result)
        self.assertIn("tags: ['normalAttackLastCombo']", result)
        self.assertIn("kind: 'buffBlackboardCompare'", result)
        self.assertIn("left: { blackboardKey: 'potential_1' }", result)


if __name__ == "__main__":
    unittest.main()
