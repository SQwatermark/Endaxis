"""原生条件事实到 Next CombatCondition DSL 的语义编译。"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable, Literal, Mapping

from source_models import (
    ConditionSource,
    ConditionalActionSource,
    TargetGroupWriteSource,
)
from source_utils import indent_source, ts_inline_literal


@dataclass(frozen=True)
class CombatConditionServices:
    """由生成入口注入的目标身份证明和项目规则服务。"""

    comparison_operator_map: Mapping[str, str]
    compile_condition_operand: Callable[..., str]
    decode_damage_decorate_mask: Callable[..., tuple[tuple[str, ...], tuple[str, ...]]]
    evaluate_zero_distance_condition: Callable[..., bool | None]
    is_guaranteed_single_enemy_condition: Callable[..., bool]
    resolve_fixed_combat_target: Callable[..., Literal["caster", "enemy"] | None]
    resolve_latest_target_group_write: Callable[..., Any]
    resolve_latest_target_group_write_at: Callable[..., Any]
    target_group_write_ability_entity_collection_identity: Callable[[Any], Any]
    target_group_write_guarantees_single_enemy: Callable[[Any], bool]
    target_reference_has_plain_selector: Callable[[Any], bool]


def compile_event_damage_property_condition(
    property_name: Literal["tags", "features"],
    match: str,
    values: tuple[str, ...],
) -> str:
    kind = "eventDamageTagsMatch" if property_name == "tags" else "eventDamageFeaturesMatch"
    return "\n".join(
        [
            "{",
            f"  kind: {ts_inline_literal(kind)},",
            f"  match: {ts_inline_literal(match)},",
            f"  {property_name}: {ts_inline_literal(values)},",
            "}",
        ]
    )


def compile_condition_collection(kind: Literal["all", "any", "not"], value: list[str] | str) -> str:
    if kind == "not":
        assert isinstance(value, str)
        lines = ["{", "  kind: 'not',", "  condition:"]
        nested = indent_source(value, 4)
        nested[-1] += ","
        lines.extend(nested)
        lines.append("}")
        return "\n".join(lines)
    assert isinstance(value, list) and value
    lines = ["{", f"  kind: {ts_inline_literal(kind)},", "  conditions: ["]
    for condition in value:
        nested = indent_source(condition, 4)
        nested[-1] += ","
        lines.extend(nested)
    lines.extend(["  ],", "}"])
    return "\n".join(lines)


def compile_combat_condition(
    source: ConditionSource,
    path: str,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    skill_has_output_damage: bool = False,
    ability_entity_current_target: bool = False,
    buff_ability_damage_event: bool = False,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    *,
    current_buff_environment: bool = False,
    current_ability_entity_id: str | None = None,
    services: CombatConditionServices,
) -> str:
    """只编译已由 Next 运行时闭环的原生条件，其他条件必须显式失败。"""
    if source.sourceType == "OrConditionAction":
        if not source.anyConditionGroups:
            raise ValueError(f"{path}: missing OR condition groups")
        return compile_combat_condition_group(
            (),
            path,
            action,
            target_group_writes,
            root_skill_context,
            input_target,
            skill_has_output_damage,
            ability_entity_current_target,
            buff_ability_damage_event,
            buff_owner_target,
            any_groups=source.anyConditionGroups,
            any_group_negated=source.anyConditionNegated,
            current_buff_environment=current_buff_environment,
            current_ability_entity_id=current_ability_entity_id,
            services=services,
        )
    comparison_operator_map = services.comparison_operator_map
    compile_condition_operand = services.compile_condition_operand
    decode_damage_decorate_mask = services.decode_damage_decorate_mask
    evaluate_zero_distance_condition = services.evaluate_zero_distance_condition
    is_guaranteed_single_enemy_condition = (
        services.is_guaranteed_single_enemy_condition
    )
    resolve_fixed_combat_target = services.resolve_fixed_combat_target
    resolve_latest_target_group_write = services.resolve_latest_target_group_write
    resolve_latest_target_group_write_at = (
        services.resolve_latest_target_group_write_at
    )
    target_group_write_ability_entity_collection_identity = (
        services.target_group_write_ability_entity_collection_identity
    )
    target_group_write_guarantees_single_enemy = (
        services.target_group_write_guarantees_single_enemy
    )
    target_reference_has_plain_selector = (
        services.target_reference_has_plain_selector
    )
    if source.sourceType == "CheckBuffIdInContext":
        context_buff = source.contextBuffId
        if context_buff is None:
            raise ValueError(f"{path}: missing event Buff identity payload")
        if (
            context_buff.checkType == "Id"
            and context_buff.queryType == "HasAny"
            and context_buff.buffIds
            and not context_buff.buffTagIds
        ):
            return "\n".join(
                [
                    "{",
                    "  kind: 'eventBuffIdMatch',",
                    f"  buffIds: {ts_inline_literal(context_buff.buffIds)},",
                    "}",
                ]
            )
        if (
            context_buff.checkType == "Tag"
            and context_buff.queryType in {"HasAny", "HasAll", "ExceptAny", "ExceptAll"}
            and context_buff.buffTagIds
            and not context_buff.buffIds
        ):
            return "\n".join(
                [
                    "{",
                    "  kind: 'eventBuffTagsMatch',",
                    f"  match: {ts_inline_literal(context_buff.queryType[0].lower() + context_buff.queryType[1:])},",
                    f"  buffTagIds: {ts_inline_literal(context_buff.buffTagIds)},",
                    "}",
                ]
            )
        raise ValueError(f"{path}: unsupported event Buff identity query")
    if source.sourceType == "CheckHealTag":
        heal_tag = source.healTag
        if heal_tag is None:
            raise ValueError(f"{path}: missing heal-tag query")
        return "\n".join(
            [
                "{",
                "  kind: 'eventHealTagsMatch',",
                f"  match: {ts_inline_literal(heal_tag.queryType)},",
                f"  tagIds: {ts_inline_literal(heal_tag.tagIds)},",
                "}",
            ]
        )
    if source.sourceType == "CheckOverHeal":
        over_heal = source.overHeal
        if over_heal is None:
            raise ValueError(f"{path}: missing overheal payload")
        fields = ["{", "  kind: 'eventOverheal',"]
        for field, value in (
            ("overHealKey", over_heal.overHealKey),
            ("finalHealKey", over_heal.finalHealKey),
            ("realHealKey", over_heal.realHealKey),
        ):
            if value:
                fields.append(f"  {field}: {ts_inline_literal(value)},")
        fields.append("}")
        return "\n".join(fields)
    if source.sourceType == "CheckTargetsEqual":
        identity = source.targetIdentity
        if identity is None:
            raise ValueError(f"{path}: missing target identity payload")
        first, second = identity.first, identity.second
        references = (first, second)
        source_finder = next(
            (
                reference
                for reference in references
                if reference.targetSource == "InstantSearch"
                and reference.selectorOwner == "ActionSource"
                and reference.finderType == "SourceFinder"
            ),
            None,
        )
        event_target = next(
            (
                reference
                for reference in references
                if reference.targetSource == "Target" and not reference.targetGroupKey
            ),
            None,
        )
        if (
            buff_ability_damage_event
            and source_finder is not None
            and event_target is not None
            and not source_finder.targetGroupKey
            and not source_finder.ownerContextKey
            and source_finder.centerType == "ActionSource"
            and not source_finder.centerContextKey
            and not source_finder.centerToGround
            and source_finder.target == "ActionSource"
            and not source_finder.targetContextKey
            and not source_finder.enableAdvancedDirection
            and source_finder.selectorDirection == "SourceForward"
            and not source_finder.validatorTypes
            and not source_finder.postProcessorTypes
            and target_reference_has_plain_selector(event_target)
        ):
            return "{ kind: 'eventSourceMatchesBuffSourceEntitySource' }"
        if not target_reference_has_plain_selector(first) or not target_reference_has_plain_selector(
            second
        ):
            raise ValueError(f"{path}: event target identity uses a selector")
        pair = {(first.targetSource, first.targetGroupKey), (second.targetSource, second.targetGroupKey)}
        if buff_ability_damage_event and pair == {("Target", ""), ("Source", "")}:
            return "{ kind: 'eventSourceMatchesBuffSource' }"
        if buff_ability_damage_event and pair == {("Target", ""), ("MainCharacter", "")}:
            return "{ kind: 'eventSourceControlled' }"
        if current_buff_environment and pair == {("Source", ""), ("Owner", "")}:
            return "{ kind: 'buffSourceMatchesOwner' }"
    if source.sourceType == "CheckSkillType" and buff_ability_damage_event:
        skill_types = tuple(
            {
                "ComboSkill": "comboSkill",
            }.get(value, "")
            for value in source.skillTypes
        )
        if not skill_types or any(not value for value in skill_types):
            raise ValueError(f"{path}: unsupported ability-event skill type list")
        return f"{{ kind: 'eventSkillTypeIn', skillTypes: {ts_inline_literal(skill_types)} }}"
    if source.sourceType == "CheckDamageType" and buff_ability_damage_event:
        if source.damageType is None:
            raise ValueError(f"{path}: missing damage-type payload")
        return (
            "{ kind: 'eventDamageTypeIn', damageTypes: "
            f"{ts_inline_literal((source.damageType,))} }}"
        )
    if source.sourceType == "CheckSpellInflictionType" and buff_ability_damage_event:
        if not source.inflictionElements:
            raise ValueError(f"{path}: missing spell-infliction element payload")
        return (
            "{ kind: 'eventInflictionElementIn', elements: "
            f"{ts_inline_literal(source.inflictionElements)} }}"
        )
    if source.sourceType == "CompareDeckAttr":
        deck = source.deckAttributeCompare
        if deck is None:
            raise ValueError(f"{path}: missing deck-attribute comparison payload")

        def direct_zero(value: Any) -> bool:
            return (
                value.blackboardKey is None
                and value.levelValues is None
                and value.value == 0
            )

        if (
            deck.targetSource != "Owner"
            or deck.targetGroupKey
            or deck.leftAttribute not in {"Str", "Agi", "Wisd", "Will"}
            or deck.rightAttribute not in {"Str", "Agi", "Wisd", "Will"}
            or deck.comparison not in comparison_operator_map
            or not direct_zero(deck.leftValue)
            or not direct_zero(deck.rightValue)
            or action is None
            or len(action.succeedActions) != 1
            or len(action.failActions) != 1
        ):
            raise ValueError(f"{path}: unsupported dynamic deck-attribute comparison")
        succeed = action.succeedActions[0].blackboardMutation
        fail = action.failActions[0].blackboardMutation
        if succeed is None or fail is None:
            raise ValueError(f"{path}: deck-attribute branch does not write a projected flag")
        if (
            succeed.key != fail.key
            or not succeed.key.startswith("EntityBB_")
            or succeed.operation != "Assign"
            or fail.operation != "Assign"
            or succeed.value.blackboardKey is not None
            or succeed.value.levelValues is not None
            or fail.value.blackboardKey is not None
            or fail.value.levelValues is not None
            or succeed.value.value == fail.value.value
        ):
            raise ValueError(f"{path}: deck-attribute branch is not an initializer projection")
        return "\n".join(
            [
                "{",
                "  kind: 'actionValueCompare',",
                f"  left: {{ kind: 'blackboard', key: {ts_inline_literal(succeed.key)} }},",
                "  operator: 'equal',",
                f"  right: {{ kind: 'constant', value: {ts_inline_literal(succeed.value.value)} }},",
                "}",
            ]
        )
    if is_guaranteed_single_enemy_condition(
        source, action=action, target_group_writes=target_group_writes
    ):
        return "{ kind: 'singleEnemyPresent' }"
    if source.sourceType == "CheckTargetsEqual":
        raise ValueError(
            f"{path}: unsupported target identity pair {sorted(pair)!r} "
            f"(current_buff_environment={current_buff_environment})"
        )
    entity_count = getattr(source, "entityCount", None)
    if (
        source.sourceType == "CheckEntityNum"
        and entity_count is not None
        and entity_count.targetSource == "Context"
        and entity_count.targetGroupKey
        and not entity_count.containsHittableTarget
        and not entity_count.storeKey
        and (
            entity_write := resolve_latest_target_group_write(
                action, entity_count.targetGroupKey, target_group_writes
            )
        )
        is not None
        and target_group_write_guarantees_single_enemy(entity_write, target_group_writes)
    ):
        result = {
            "LT": 1 < entity_count.minimumCount,
            "LE": 1 <= entity_count.minimumCount,
            "GT": 1 > entity_count.minimumCount,
            "GE": 1 >= entity_count.minimumCount,
            "Equals": 1 == entity_count.minimumCount,
            "NotEquals": 1 != entity_count.minimumCount,
        }.get(entity_count.comparison)
        if result is None:
            raise ValueError(f"{path}: unsupported entity-count comparison")
        return (
            "{ kind: 'singleEnemyPresent' }"
            if result
            else "{ kind: 'not', condition: { kind: 'singleEnemyPresent' } }"
        )
    if (
        source.sourceType == "CheckEntityNum"
        and entity_count is not None
        and entity_count.targetSource == "Context"
        and entity_count.targetGroupKey
        and not entity_count.containsHittableTarget
        and not entity_count.storeKey
        and (
            entity_write := resolve_latest_target_group_write(
                action, entity_count.targetGroupKey, target_group_writes
            )
        )
        is not None
        and entity_write.producerType in {"FindTargetAction", "ContinuousFindTargetAction"}
        and entity_write.finderType == "HitBoxFinder"
        and entity_write.finderFactionTarget == "Anti"
        and entity_write.finderTargetObjectType == "Normal"
        and entity_write.finderCheckAlive is True
        and entity_write.validatorTypes == ("TagValidator",)
        and len(entity_write.validatorTagQueries) == 1
        and all(
            processor == "PriorityFilter" for processor in entity_write.postProcessorTypes
        )
    ):
        # 固定单敌人、零距离模型下，空间搜索结果只剩“唯一敌人是否通过标签校验”。
        # 因此目标数严格为 0 或 1，而不是把带标签过滤的搜索误判为恒命中。
        query_type, tag_ids = entity_write.validatorTagQueries[0]
        compiled_query_type = {
            "HasAny": "hasAny",
            "HasAll": "hasAll",
            "ExceptAny": "exceptAny",
            "ExceptAll": "exceptAll",
        }.get(query_type)
        if compiled_query_type is None:
            raise ValueError(f"{path}: unsupported target-search tag query {query_type!r}")

        def compare_count(count: int) -> bool:
            result = {
                "LT": count < entity_count.minimumCount,
                "LE": count <= entity_count.minimumCount,
                "GT": count > entity_count.minimumCount,
                "GE": count >= entity_count.minimumCount,
                "Equals": count == entity_count.minimumCount,
                "NotEquals": count != entity_count.minimumCount,
            }.get(entity_count.comparison)
            if result is None:
                raise ValueError(f"{path}: unsupported entity-count comparison")
            return result

        when_missing = compare_count(0)
        when_matched = compare_count(1)
        if when_missing == when_matched:
            return (
                "{ kind: 'combatActive' }"
                if when_matched
                else "{ kind: 'not', condition: { kind: 'combatActive' } }"
            )
        tag_condition = "\n".join(
            [
                "{",
                "  kind: 'entityTagMatch',",
                "  target: 'enemy',",
                f"  tagQueryType: {ts_inline_literal(compiled_query_type)},",
                f"  tagIds: {ts_inline_literal(tag_ids)},",
                "}",
            ]
        )
        if when_matched:
            return tag_condition
        lines = tag_condition.splitlines()
        return "\n".join(["{", "  kind: 'not',", "  condition: " + lines[0], *["  " + line for line in lines[1:]], "}"])
    if (
        source.sourceType == "CheckEntityNum"
        and entity_count is not None
        and entity_count.targetSource == "Context"
        and entity_count.targetGroupKey
        and not entity_count.containsHittableTarget
        and (
            entity_write := resolve_latest_target_group_write(
                action, entity_count.targetGroupKey, target_group_writes
            )
        )
        is not None
        and target_group_write_ability_entity_collection_identity(entity_write)
        is not None
    ):
        operator = comparison_operator_map.get(entity_count.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported entity-count comparison")
        if not entity_count.storeKey:
            return "\n".join(
                [
                    "{",
                    "  kind: 'contextTargetCountCompare',",
                    f"  contextKey: {ts_inline_literal(entity_count.targetGroupKey)},",
                    f"  operator: {ts_inline_literal(operator)},",
                    f"  value: {entity_count.minimumCount},",
                    "}",
                ]
            )
        return "\n".join(
            [
                "{",
                "  kind: 'actionValueCompare',",
                "  left: { kind: 'blackboard', key: "
                f"{ts_inline_literal(entity_count.storeKey)} }},",
                f"  operator: {ts_inline_literal(operator)},",
                "  right: { kind: 'constant', value: "
                f"{entity_count.minimumCount} }},",
                "}",
            ]
        )
    if source.sourceType == "CheckSquadInFight":
        return "{ kind: 'combatActive' }"
    if source.sourceType == "CheckAbilityEntityCurDuration":
        duration = source.abilityEntityDuration
        if duration is None:
            raise ValueError(f"{path}: missing ability entity duration payload")
        if not ability_entity_current_target:
            raise ValueError(f"{path}: ability entity current target is unavailable")
        operator = comparison_operator_map.get(duration.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {duration.comparison!r}")
        return "\n".join(
            [
                "{",
                "  kind: 'abilityEntityRemainingDurationCompare',",
                f"  operator: {ts_inline_literal(operator)},",
                f"  value: {compile_condition_operand(duration.value, f'{path}.value')},",
                "}",
            ]
        )
    if source.sourceType == "CheckDamageDecorateMask":
        damage_mask = source.damageDecorateMask
        if damage_mask is None:
            raise ValueError(f"{path}: missing damage decorate mask payload")
        match = {
            "HasAny": "hasAny",
            "HasAll": "hasAll",
            "ExceptAny": "exceptAny",
            "ExceptAll": "exceptAll",
        }.get(damage_mask.checkType)
        if match is None:
            raise ValueError(
                f"{path}: unsupported damage decorate check type {damage_mask.checkType!r}"
            )
        tags, features = decode_damage_decorate_mask(damage_mask.mask, path)
        conditions: list[str] = []
        if match == "exceptAll" and tags and features:
            positive = [
                compile_event_damage_property_condition("tags", "hasAll", tags),
                compile_event_damage_property_condition("features", "hasAll", features),
            ]
            return compile_condition_collection("not", compile_condition_collection("all", positive))
        child_match = "hasAll" if match == "hasAll" else match
        if tags:
            conditions.append(compile_event_damage_property_condition("tags", child_match, tags))
        if features:
            conditions.append(
                compile_event_damage_property_condition("features", child_match, features)
            )
        if len(conditions) == 1:
            return conditions[0]
        collection = "any" if match == "hasAny" else "all"
        return compile_condition_collection(collection, conditions)
    if source.sourceType == "CheckDistanceCondition":
        distance = source.distance
        if distance is None:
            raise ValueError(f"{path}: missing distance condition payload")
        present_context_keys: set[str] = set()
        if action is not None:
            for sibling in action.conditions:
                entity_count = getattr(sibling, "entityCount", None)
                if (
                    sibling.sourceType != "CheckEntityNum"
                    or entity_count is None
                    or entity_count.targetSource != "Context"
                    or entity_count.comparison != "GE"
                    or entity_count.minimumCount < 1
                ):
                    continue
                write = resolve_latest_target_group_write(
                    action,
                    entity_count.targetGroupKey,
                    target_group_writes,
                )
                if (
                    write is not None
                    and target_group_write_ability_entity_collection_identity(write)
                    is not None
                ):
                    present_context_keys.add(entity_count.targetGroupKey)
        result = evaluate_zero_distance_condition(
            distance,
            root_skill_context=root_skill_context,
            input_target=input_target,
            ability_entity_current_target=ability_entity_current_target,
            current_ability_entity_id=current_ability_entity_id,
            current_buff_environment=current_buff_environment,
            buff_owner_target=buff_owner_target,
            present_context_keys=frozenset(present_context_keys),
        )
        if result is True:
            return "{ kind: 'singleEnemyPresent' }"
        if result is False:
            return "{ kind: 'not', condition: { kind: 'singleEnemyPresent' } }"
        raise ValueError(
            f"{path}: CheckDistanceCondition targets are not covered by the zero-distance model"
        )
    if source.sourceType == "CheckMainCharacterCondition":
        main_operator = source.mainOperator
        if main_operator is None:
            raise ValueError(f"{path}: missing main operator condition payload")
        if main_operator.targetSource in {"Owner", "Source"}:
            return "{ kind: 'casterControlled' }"
        raise ValueError(
            f"{path}: unsupported main operator target "
            f"{main_operator.targetSource!r}/{main_operator.targetGroupKey!r}"
        )
    if source.sourceType == "CheckEnemyRank":
        enemy_rank = source.enemyRank
        if enemy_rank is None:
            raise ValueError(f"{path}: missing enemy rank condition payload")
        if not target_reference_has_plain_selector(enemy_rank.target):
            raise ValueError(f"{path}: CheckEnemyRank target selector changes identity")
        target = resolve_fixed_combat_target(
            enemy_rank.target.targetSource,
            enemy_rank.target.targetGroupKey,
            action=action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
        if target != "enemy":
            raise ValueError(f"{path}: CheckEnemyRank target does not resolve to the enemy")
        ranks = tuple(
            rank
            for bit, rank in ((1, "mob"), (2, "elite"), (4, "boss"))
            if enemy_rank.rankMask & bit
        )
        return f"{{ kind: 'enemyRankIn', ranks: {ts_inline_literal(ranks)} }}"
    if source.sourceType == "CheckSuperArmor":
        super_armor = source.superArmor
        if super_armor is None:
            raise ValueError(f"{path}: missing super armor condition payload")
        if not target_reference_has_plain_selector(super_armor.target):
            raise ValueError(f"{path}: CheckSuperArmor target selector changes identity")
        target = resolve_fixed_combat_target(
            super_armor.target.targetSource,
            super_armor.target.targetGroupKey,
            action=action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
        if target != "enemy":
            raise ValueError(f"{path}: CheckSuperArmor target does not resolve to the enemy")
        operator = comparison_operator_map.get(super_armor.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {super_armor.comparison!r}")
        return "\n".join(
            [
                "{",
                "  kind: 'enemySuperArmorCompare',",
                f"  operator: {ts_inline_literal(operator)},",
                f"  value: {compile_condition_operand(super_armor.value, f'{path}.value')},",
                "}",
            ]
        )
    if source.sourceType == "CheckTwoDirectionAngle":
        angle = source.twoDirectionAngle
        if angle is None:
            raise ValueError(f"{path}: missing two-direction angle payload")
        references = (
            angle.dir1Source,
            angle.dir1Target,
            angle.dir2Source,
            angle.dir2Target,
        )
        if any(not target_reference_has_plain_selector(reference) for reference in references):
            raise ValueError(f"{path}: direction target selector changes identity")

        def resolve_direction_target(reference: Any) -> str | None:
            return resolve_fixed_combat_target(
                reference.targetSource,
                reference.targetGroupKey,
                action=action,
                target_group_writes=target_group_writes,
                root_skill_context=root_skill_context,
                input_target=input_target,
            )

        identities = tuple(resolve_direction_target(reference) for reference in references)
        if identities != ("caster", "enemy", "caster", "enemy"):
            raise ValueError(f"{path}: unsupported two-direction target identities {identities}")
        if (
            angle.dir1DirectionType != "CameraForward"
            or angle.dir2DirectionType != "SourceToTarget"
        ):
            raise ValueError(
                f"{path}: unsupported direction pair "
                f"{angle.dir1DirectionType!r}/{angle.dir2DirectionType!r}"
            )
        operator = comparison_operator_map.get(angle.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {angle.comparison!r}")
        return "\n".join(
            [
                "{",
                "  kind: 'cameraToTargetAngleCompare',",
                f"  operator: {ts_inline_literal(operator)},",
                f"  value: {compile_condition_operand(angle.value, f'{path}.value')},",
                "}",
            ]
        )
    if source.sourceType == "CheckPoiseValue":
        poise = source.poise
        if poise is None:
            raise ValueError(f"{path}: missing poise condition payload")
        if not target_reference_has_plain_selector(poise.target):
            raise ValueError(f"{path}: CheckPoiseValue target selector changes identity")
        target = resolve_fixed_combat_target(
            poise.target.targetSource,
            poise.target.targetGroupKey,
            action=action,
            target_group_writes=target_group_writes,
            root_skill_context=root_skill_context,
            input_target=input_target,
        )
        if target not in {"caster", "enemy"}:
            raise ValueError(f"{path}: unsupported poise target {target!r}")
        operator = comparison_operator_map.get(poise.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {poise.comparison!r}")
        return "\n".join(
            [
                "{",
                "  kind: 'poiseCompare',",
                f"  target: {ts_inline_literal(target)},",
                f"  returnValueIfMissing: {ts_inline_literal(poise.returnValueIfMissing)},",
                f"  operator: {ts_inline_literal(operator)},",
                f"  value: {compile_condition_operand(poise.value, f'{path}.value')},",
                "}",
            ]
        )
    if source.sourceType == "CompareFloat":
        if source.left is None or source.right is None or source.comparison is None:
            raise ValueError(f"{path}: incomplete CompareFloat condition")
        operator = comparison_operator_map.get(source.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {source.comparison!r}")
        return "\n".join(
            [
                "{",
                "  kind: 'actionValueCompare',",
                f"  left: {compile_condition_operand(source.left, f'{path}.left')},",
                f"  operator: {ts_inline_literal(operator)},",
                f"  right: {compile_condition_operand(source.right, f'{path}.right')},",
                "}",
            ]
        )
    if source.sourceType == "Probablity":
        if source.probability is None:
            raise ValueError(f"{path}: missing probability payload")
        return "\n".join(
            [
                "{",
                "  kind: 'probability',",
                f"  probability: {compile_condition_operand(source.probability, f'{path}.probability')},",
                "}",
            ]
        )
    if source.sourceType == "CheckHp":
        health = source.health
        if health is None:
            raise ValueError(f"{path}: missing health condition payload")
        operator = comparison_operator_map.get(health.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {health.comparison!r}")
        target = getattr(health, "characterTeamSelectionRole", None)
        if (
            target is None
            and buff_owner_target is not None
            and health.targetSource == "Source"
            and not health.targetGroupKey
        ):
            target = "buffSource"
        if (
            target is None
            and action is not None
            and health.targetSource == "Context"
            and health.targetGroupKey
        ):
            write = resolve_latest_target_group_write_at(
                read_frame=action.startFrame,
                read_action_index=action.actionIndex,
                read_action_path=action.actionPath,
                target_group_key=health.targetGroupKey,
                writes=target_group_writes,
            )
            target = None if write is None else write.characterTeamSelectionRole
        if target is None:
            target = resolve_fixed_combat_target(
                health.targetSource,
                health.targetGroupKey,
                action=action,
                target_group_writes=target_group_writes,
                root_skill_context=root_skill_context,
                input_target=input_target,
            )
        if target is None:
            raise ValueError(
                f"{path}: unsupported health target "
                f"{health.targetSource!r}/{health.targetGroupKey!r}"
            )
        return "\n".join(
            [
                "{",
                "  kind: 'healthCompare',",
                f"  target: {ts_inline_literal(target)},",
                f"  valueType: {ts_inline_literal('ratio' if health.isRatio else 'current')},",
                f"  operator: {ts_inline_literal(operator)},",
                f"  value: {compile_condition_operand(health.value, f'{path}.value')},",
                "}",
            ]
        )
    if source.sourceType == "CheckTagMatch":
        entity_tag = source.entityTag
        if entity_tag is None:
            raise ValueError(f"{path}: missing entity tag condition payload")
        target = (
            buff_owner_target
            if entity_tag.targetSource == "Owner"
            and not entity_tag.targetGroupKey
            and buff_owner_target in {"caster", "enemy"}
            else resolve_fixed_combat_target(
                entity_tag.targetSource,
                entity_tag.targetGroupKey,
                action=action,
                target_group_writes=target_group_writes,
                root_skill_context=root_skill_context,
                input_target=input_target,
            )
        )
        if target is None:
            raise ValueError(
                f"{path}: unsupported entity tag target "
                f"{entity_tag.targetSource!r}/{entity_tag.targetGroupKey!r}"
            )
        return "\n".join(
            [
                "{",
                "  kind: 'entityTagMatch',",
                f"  target: {ts_inline_literal(target)},",
                f"  tagQueryType: {ts_inline_literal(entity_tag.tagQueryType)},",
                f"  tagIds: {ts_inline_literal(entity_tag.tagIds)},",
                "}",
            ]
        )
    if source.sourceType == "CheckTimedMarkerCondition":
        marker = source.timedMarker
        if marker is None:
            raise ValueError(f"{path}: missing timed marker condition payload")
        if marker.useBlackboardKey:
            raise ValueError(f"{path}: dynamic timed marker IDs are not supported")
        if not marker.markerId:
            raise ValueError(f"{path}: timed marker ID is empty")
        if (
            ability_entity_current_target
            and marker.targetSource in {"Owner", "Target"}
            and not marker.targetGroupKey
        ):
            condition = (
                "{ kind: 'abilityEntityTimedMarkerPresent', markerId: "
                f"{ts_inline_literal(marker.markerId)} }}"
            )
            if marker.returnTrueIfNotExists:
                return f"{{ kind: 'not', condition: {condition} }}"
            return condition
        if (
            marker.targetSource == "Owner"
            and not marker.targetGroupKey
            and buff_owner_target == "currentAbilityEntity"
        ):
            condition = (
                "{ kind: 'abilityEntityTimedMarkerPresent', markerId: "
                f"{ts_inline_literal(marker.markerId)} }}"
            )
            if marker.returnTrueIfNotExists:
                return f"{{ kind: 'not', condition: {condition} }}"
            return condition
        if (
            marker.targetSource == "Context"
            and marker.targetGroupKey
            and (
                write := resolve_latest_target_group_write(
                    action,
                    marker.targetGroupKey,
                    target_group_writes,
                )
            )
            is not None
            and target_group_write_ability_entity_collection_identity(write)
            is not None
        ):
            condition = (
                "{ kind: 'abilityEntityTimedMarkerPresent', markerId: "
                f"{ts_inline_literal(marker.markerId)}, contextKey: "
                f"{ts_inline_literal(marker.targetGroupKey)} }}"
            )
            if marker.returnTrueIfNotExists:
                return f"{{ kind: 'not', condition: {condition} }}"
            return condition
        target = (
            buff_owner_target
            if marker.targetSource == "Owner"
            and not marker.targetGroupKey
            and buff_owner_target in {"caster", "enemy"}
            else resolve_fixed_combat_target(
                marker.targetSource,
                marker.targetGroupKey,
                action=action,
                target_group_writes=target_group_writes,
                root_skill_context=root_skill_context,
                input_target=input_target,
            )
        )
        if target is None:
            matching_writes = tuple(
                (write.actionIndex, write.actionPath)
                for write in target_group_writes
                if write.targetGroupKey == marker.targetGroupKey
            )
            raise ValueError(
                f"{path}: unsupported timed marker target "
                f"{marker.targetSource!r}/{marker.targetGroupKey!r} "
                f"(matchingWrites={matching_writes!r})"
            )
        condition = (
            f"{{ kind: 'timedMarkerPresent', target: {ts_inline_literal(target)}, markerId: "
            f"{ts_inline_literal(marker.markerId)} }}"
        )
        if marker.returnTrueIfNotExists:
            return f"{{ kind: 'not', condition: {condition} }}"
        return condition
    if source.sourceType == "CheckGlobalCDTimerAction":
        cooldown = source.globalCooldown
        if cooldown is None:
            raise ValueError(f"{path}: missing global cooldown condition payload")
        if not (
            cooldown.targetSource == "Source"
            or (root_skill_context and cooldown.targetSource == "Owner")
        ) or cooldown.targetGroupKey:
            raise ValueError(
                f"{path}: unsupported global cooldown target "
                f"{cooldown.targetSource!r}/{cooldown.targetGroupKey!r}"
            )
        # 原生检查在对应全局定时项不存在时成功，和普通标记检查的反向极性一致。
        present = (
            "{ kind: 'timedMarkerPresent', target: 'caster', markerId: "
            f"{ts_inline_literal(cooldown.buffId)} }}"
        )
        return f"{{ kind: 'not', condition: {present} }}"
    if source.sourceType == "CheckSkillHasHit":
        if source.skillHasHit is None:
            raise ValueError(f"{path}: missing skill hit condition payload")
        if not root_skill_context:
            raise ValueError(f"{path}: child skill hit state is not projected")
        if not skill_has_output_damage:
            raise ValueError(f"{path}: no prior guaranteed damage from the current skill")
        # Next 固定单敌人且伤害必然命中；调度器已证明当前技能此前输出过伤害。
        return "{ kind: 'singleEnemyPresent' }"
    if source.sourceType in {
        "CheckBuffStackNum",
        "CheckBuffStackNumAdvanced",
        "CheckBuffStackNumByTag",
    }:
        buff = source.buffStack
        if buff is None:
            raise ValueError(f"{path}: missing Buff stack condition payload")
        if buff.countType != "BuffCount":
            raise ValueError(f"{path}: unsupported Buff stack count semantics")
        operator = comparison_operator_map.get(buff.comparison)
        if operator is None:
            raise ValueError(f"{path}: unsupported comparison {buff.comparison!r}")
        value_source = compile_condition_operand(buff.value, f"{path}.value")
        target = (
            "currentAbilityEntity"
            if (
                ability_entity_current_target
                and buff.targetSource == "Owner"
                and not buff.targetGroupKey
            )
            else buff_owner_target
            if (
                buff.targetSource == "Owner"
                and not buff.targetGroupKey
                and buff_owner_target is not None
            )
            else resolve_fixed_combat_target(
                buff.targetSource,
                buff.targetGroupKey,
                action=action,
                target_group_writes=target_group_writes,
                root_skill_context=root_skill_context,
                input_target=input_target,
            )
        )
        if (
            target is not None
            and buff.buffCheckType == "Tag"
            and buff.buffTagIds
            and not buff.buffIds
        ):
            return "\n".join(
                [
                    "{",
                    "  kind: 'buffStackCompare',",
                    f"  target: {ts_inline_literal(target)},",
                    f"  tagQueryType: {ts_inline_literal(buff.tagQueryType)},",
                    f"  buffTagIds: {ts_inline_literal(buff.buffTagIds)},",
                    *(
                        ["  sameSourceSkillCast: true,"]
                        if buff.limitSkillCastId
                        else []
                    ),
                    f"  operator: {ts_inline_literal(operator)},",
                    f"  value: {value_source},",
                    "}",
                ]
            )
        if (
            target is not None
            and buff.buffCheckType == "Id"
            and buff.buffIds
            and not buff.buffTagIds
        ):
            return "\n".join(
                [
                    "{",
                    "  kind: 'buffIdStackCompare',",
                    f"  target: {ts_inline_literal(target)},",
                    f"  buffIds: {ts_inline_literal(buff.buffIds)},",
                    *(
                        ["  sameSourceSkillCast: true,"]
                        if buff.limitSkillCastId
                        else []
                    ),
                    f"  operator: {ts_inline_literal(operator)},",
                    f"  value: {value_source},",
                    "}",
                ]
            )
        raise ValueError(f"{path}: unsupported Buff stack query target or identity")
    raise ValueError(f"{path}: unsupported condition type {source.sourceType!r}")


def compile_combat_condition_group(
    conditions: tuple[ConditionSource, ...],
    path: str,
    action: ConditionalActionSource | None = None,
    target_group_writes: tuple[TargetGroupWriteSource, ...] = (),
    root_skill_context: bool = False,
    input_target: Literal["enemy"] | None = None,
    skill_has_output_damage: bool = False,
    ability_entity_current_target: bool = False,
    buff_ability_damage_event: bool = False,
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None,
    negated: tuple[bool, ...] = (),
    any_groups: tuple[tuple[ConditionSource, ...], ...] = (),
    any_group_negated: tuple[tuple[bool, ...], ...] = (),
    *,
    current_buff_environment: bool = False,
    current_ability_entity_id: str | None = None,
    services: CombatConditionServices,
) -> str:
    """保持原生条件组的全满足语义，并生成可直接嵌入 DSL 的条件树。"""
    if any_groups:
        if conditions:
            raise ValueError(f"{path}: cannot combine direct conditions with any groups")
        if any_group_negated and len(any_group_negated) != len(any_groups):
            raise ValueError(f"{path}: any-group negation flags do not match group count")
        compiled_groups = [
            compile_combat_condition_group(
                group,
                f"{path}.any[{index}]",
                action,
                target_group_writes,
                root_skill_context,
                input_target,
                skill_has_output_damage,
                ability_entity_current_target,
                buff_ability_damage_event,
                buff_owner_target,
                (
                    any_group_negated[index]
                    if any_group_negated
                    else ()
                ),
                current_buff_environment=current_buff_environment,
                current_ability_entity_id=current_ability_entity_id,
                services=services,
            )
            for index, group in enumerate(any_groups)
        ]
        lines = ["{", "  kind: 'any',", "  conditions: ["]
        for condition in compiled_groups:
            condition_lines = condition.splitlines()
            lines.extend(f"    {line}" for line in condition_lines[:-1])
            lines.append(f"    {condition_lines[-1]},")
        lines.extend(["  ],", "}"])
        return "\n".join(lines)
    if not conditions:
        raise ValueError(f"{path}: empty condition group")
    if negated and len(negated) != len(conditions):
        raise ValueError(f"{path}: negation flags do not match condition count")
    compiled = [
        compile_combat_condition(
            condition,
            f"{path}[{index}]",
            action,
            target_group_writes,
            root_skill_context,
            input_target,
            skill_has_output_damage,
            ability_entity_current_target,
            buff_ability_damage_event,
            buff_owner_target,
            current_buff_environment=current_buff_environment,
            current_ability_entity_id=current_ability_entity_id,
            services=services,
        )
        for index, condition in enumerate(conditions)
    ]
    if negated:
        compiled = [
            (
                "\n".join(
                    [
                        "{",
                        "  kind: 'not',",
                        f"  condition: {condition.splitlines()[0]}",
                        *[f"  {line}" for line in condition.splitlines()[1:]],
                        "}",
                    ]
                )
                if is_negated
                else condition
            )
            for condition, is_negated in zip(compiled, negated, strict=True)
        ]
    if len(compiled) == 1:
        return compiled[0]
    lines = ["{", "  kind: 'all',", "  conditions: ["]
    for condition in compiled:
        condition_lines = [f"    {line}" for line in condition.splitlines()]
        condition_lines[-1] += ","
        lines.extend(condition_lines)
    lines.extend(["  ],", "}"])
    return "\n".join(lines)
