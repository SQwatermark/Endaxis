"""解析条件动作及其有序成功、失败分支。

这里保留原生控制流与分支内动作身份，只负责生成可审计的条件中间层；
是否能在单敌人模型中归约、以及如何编译为 Next DSL，属于后续编译阶段。
"""

from __future__ import annotations

from dataclasses import replace
from typing import Any

from action_kinds import (
    AUDITED_COMBAT_EFFECT_ACTION_NAMES,
    CONDITIONAL_AUDIT_ACTION_NAMES,
    SEQUENCE_GUARD_ACTION_NAMES,
)
from action_payload_parser import (
    parse_ability_entity_duration_assignment_payload,
    parse_ability_entity_spawn_payload,
    parse_blackboard_calculation_payload,
    parse_blackboard_mutation_payload,
    parse_buff_application_payload,
    parse_buff_blackboard_read_payload,
    parse_buff_find_settings,
    parse_buff_finish_payload,
    parse_buff_stack_read_payload,
    parse_simple_buff_stack_read_payload,
    parse_damage_units,
    parse_global_cooldown_application_payload,
    parse_heal_payload,
    parse_infliction_payload,
    parse_interrupt_payload,
    parse_knock_down_output_payload,
    parse_physical_infliction_payload,
    parse_projectile_launch_payload,
    parse_resource_gain_payload,
    parse_scalar,
    parse_skill_cooldown_adjustment_payload,
    parse_tag_query,
    parse_timed_marker_application_payload,
    walk_single_enemy_actions,
)
from source_models import (
    AbilityEntityDurationConditionSource,
    BlackboardCalculationPayload,
    BuffIdInContextConditionSource,
    BuffIgnitePayload,
    BuffStackConditionSource,
    ConditionSource,
    ConditionalActionSource,
    ConditionalBranchActionSource,
    ConditionalTimeDilationActionSource,
    DamageDecorateMaskConditionSource,
    DeckAttributeCompareConditionSource,
    DistanceConditionSource,
    DoOnceActionSource,
    EntityCountConditionSource,
    EnemyRankConditionSource,
    EntityTagConditionSource,
    EveryFrameActionSource,
    ForEachContextActionSource,
    GlobalCooldownConditionSource,
    HealthConditionSource,
    HealTagConditionSource,
    OverHealConditionSource,
    PoiseConditionSource,
    LegacyBuffFinishPayload,
    MainOperatorConditionSource,
    ObjectTypeMatchConditionSource,
    SequenceGuardActionSource,
    ScalarSource,
    SkillHasHitConditionSource,
    StoreCurrentTimelineFramePayload,
    StoreCurrentTimelineFrameActionSource,
    StoreAttributeValuePayload,
    SuperArmorConditionSource,
    SwitchActionSource,
    TargetIdentityConditionSource,
    TargetAngleConditionSource,
    TimedMarkerConditionSource,
    TwoDirectionAngleConditionSource,
    TimelineJumpBranchActionSource,
    UnconditionalActionSource,
)
from source_utils import (
    action_name,
    project_tick_interval_frames,
    require_bool,
    require_dict,
    require_list,
    require_non_negative_int,
    require_server_action_index,
)
from target_parser import parse_character_team_selection_role, parse_target_reference
from keyword_action_parser import parse_keyword_action
from time_dilation_parser import parse_time_dilation_action
from skill_setting_catalog import (
    has_recovered_skill_setting_data,
    resolve_linear_skill_setting_read,
)

__all__ = [
    "contains_combat_effect",
    "parse_conditional_actions",
    "parse_ordered_action_sequence",
    "parse_timeline_jump_condition",
    "parse_legacy_buff_finish_payload",
]


def parse_legacy_buff_finish_payload(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> LegacyBuffFinishPayload:
    expected_fields = {
        "$type", "isEnable", "priorityLevel", "priorityOffset", "serverActionIndex",
        "buffOwner", "buffIds", "finishAll", "finishLayerCnt", "limitSource",
        "buffSource", "isFinishedEarly", "finishSource",
    }
    if set(action) != expected_fields:
        raise ValueError(f"{path}: unexpected FinishBuffAction fields {sorted(action)}")
    raw_ids = require_list(action.get("buffIds"), f"{path}.buffIds")
    buff_ids: list[str] = []
    for buff_index, raw_buff in enumerate(raw_ids):
        buff_path = f"{path}.buffIds[{buff_index}]"
        buff = require_dict(raw_buff, buff_path)
        if set(buff) != {"buffId"} or not isinstance(buff.get("buffId"), str):
            raise ValueError(f"{buff_path}: expected literal buffId")
        buff_ids.append(buff["buffId"])
    return LegacyBuffFinishPayload(
        target=parse_target_reference(action.get("buffOwner"), f"{path}.buffOwner"),
        buffIds=tuple(buff_ids),
        finishAll=require_bool(action.get("finishAll"), f"{path}.finishAll"),
        finishLayerCount=parse_scalar(
            action.get("finishLayerCnt"), f"{path}.finishLayerCnt", inherited_blackboard
        ),
        limitSource=require_bool(action.get("limitSource"), f"{path}.limitSource"),
        buffSource=parse_target_reference(action.get("buffSource"), f"{path}.buffSource"),
        isFinishedEarly=require_bool(
            action.get("isFinishedEarly"), f"{path}.isFinishedEarly"
        ),
        finishSource=parse_target_reference(action.get("finishSource"), f"{path}.finishSource"),
    )

# 这些动作本身不会进入 Next 执行序列，但它们决定后续 Context 目标组的身份。
# 条件树必须保留它们，编译阶段才能证明分支外读取来自哪个目标。
TARGET_GROUP_PROVENANCE_ACTION_NAMES = {
    "ContinuousFindTargetAction",
    "FindTargetAction",
    "MergeTargetAction",
}

# 这些检查直接位于事件回调序列中，失败时会截断后续动作；它们不是战斗效果本身。
EVENT_SEQUENCE_GUARD_ACTION_NAMES = {
    "CheckBuffIdInContext",
    "CheckDamageDecorateMask",
    "CheckTimedMarkerCondition",
    "CompareFloat",
    "CheckHealTag",
    "CheckOverHeal",
    "CheckTagMatch",
    "CheckDamageType",
    "CheckSpellInflictionType",
    "Probablity",
}

# 这些叶子只改变运行时状态，仍应让前置顺序守卫把它们纳入控制流。
ORDERED_STATE_EFFECT_ACTION_NAMES = {
    "FinishBuffAction",
    "FinishBuffAdvanced",
    "ModifyDynamicBlackboard",
    "TimeDilationAction",
    "UltimateTimeAction",
    "SetSkillCdAtOnce",
    "IgniteAction",
}

# 这些 ForEach 守卫尾部仍会被现有根级解析器递归展开。在建立显式消费身份前
# 不能迁入条件树，否则会产生条件与无条件双份调度。其他动作的根解析器遇到
# ForEach 会停止，因而可由条件树独占；尚未支持的叶子仍会留在覆盖检查中。
FOR_EACH_GUARD_NON_OWNABLE_EFFECT_ACTION_NAMES = {
    "DamageAction",
    "ObtainCostAction",
    "SimpleCalcBBAction",
}


def optional_server_action_index(action: dict[str, Any], path: str) -> int | None:
    """读取真实数据中的服务器动作序号；精简测试夹具可以省略该元数据。"""
    if "serverActionIndex" not in action:
        return None
    return require_server_action_index(action, path)


def contains_combat_effect(value: Any) -> bool:
    """判断动作子树是否包含会改变单敌人战斗模拟结果的已知效果。"""
    if isinstance(value, dict):
        if value.get("isEnable") is False:
            return False
        type_name = value.get("$type")
        if (
            isinstance(type_name, str)
            and action_name(type_name)
            in AUDITED_COMBAT_EFFECT_ACTION_NAMES | ORDERED_STATE_EFFECT_ACTION_NAMES
        ):
            return True
        return any(contains_combat_effect(child) for child in value.values())
    if isinstance(value, list):
        return any(contains_combat_effect(child) for child in value)
    return False


def _parse_buff_stack_num_condition(
    condition: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> ConditionSource:
    target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
    buff_id_value = require_dict(condition.get("buffId"), f"{path}.buffId")
    buff_id = buff_id_value.get("buffId")
    if not isinstance(buff_id, str) or not buff_id:
        raise ValueError(f"{path}.buffId.buffId: expected non-empty string")
    return ConditionSource(
        sourceType="CheckBuffStackNum",
        supported=True,
        comparison=None,
        left=None,
        right=None,
        skillTypes=(),
        buffStack=BuffStackConditionSource(
            targetSource=str(target.get("targetSource", "")),
            targetGroupKey=str(target.get("targetGroupKey", "")),
            buffCheckType="Id",
            buffIds=(buff_id,),
            tagQueryType="hasAny",
            buffTagIds=(),
            countType="BuffCount",
            comparison=str(condition.get("compareType", "")),
            value=parse_scalar(
                condition.get("value"), f"{path}.value", inherited_blackboard
            ),
            limitSkillCastId=False,
        ),
    )


def _parse_buff_stack_num_advanced_condition(
    condition: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> ConditionSource:
    target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
    check_type, buff_ids, query_type, tag_ids = parse_buff_find_settings(
        condition.get("buffSettings"), f"{path}.buffSettings"
    )
    count_type = condition.get("buffStackNumType")
    limit_skill_cast_id = condition.get("limitSkillCastId")
    if not isinstance(count_type, str) or not count_type:
        raise ValueError(f"{path}.buffStackNumType: expected string")
    if not isinstance(limit_skill_cast_id, bool):
        raise ValueError(f"{path}.limitSkillCastId: expected boolean")
    return ConditionSource(
        sourceType="CheckBuffStackNumAdvanced",
        supported=(
            count_type == "BuffCount"
            and not limit_skill_cast_id
            and check_type in {"Id", "Tag"}
        ),
        comparison=None,
        left=None,
        right=None,
        skillTypes=(),
        buffStack=BuffStackConditionSource(
            targetSource=str(target.get("targetSource", "")),
            targetGroupKey=str(target.get("targetGroupKey", "")),
            buffCheckType=check_type,
            buffIds=buff_ids,
            tagQueryType=query_type,
            buffTagIds=tag_ids,
            countType=count_type,
            comparison=str(condition.get("compareType", "")),
            value=parse_scalar(
                condition.get("value"), f"{path}.value", inherited_blackboard
            ),
            limitSkillCastId=limit_skill_cast_id,
        ),
    )


def _parse_hp_condition(
    condition: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> ConditionSource:
    target = require_dict(condition.get("hpOwner"), f"{path}.hpOwner")
    comparison = condition.get("compare")
    is_ratio = condition.get("isRatio")
    if not isinstance(comparison, str) or not comparison:
        raise ValueError(f"{path}.compare: expected string")
    if not isinstance(is_ratio, bool):
        raise ValueError(f"{path}.isRatio: expected boolean")
    target_source = str(target.get("targetSource", ""))
    target_group_key = str(target.get("targetGroupKey", ""))
    return ConditionSource(
        sourceType="CheckHp",
        supported=(target_source == "Context" and target_group_key == "smart_target"),
        comparison=None,
        left=None,
        right=None,
        skillTypes=(),
        health=HealthConditionSource(
            targetSource=target_source,
            targetGroupKey=target_group_key,
            comparison=comparison,
            isRatio=is_ratio,
            value=parse_scalar(
                condition.get("value"), f"{path}.value", inherited_blackboard
            ),
            characterTeamSelectionRole=(
                parse_character_team_selection_role(
                    target.get("selectorData"), f"{path}.hpOwner.selectorData"
                )
                if target_source == "InstantSearch"
                else None
            ),
        ),
    )


def parse_timeline_jump_condition(
    raw_condition: Any,
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> ConditionSource:
    """解析当前有直接原生样本、且 Next 条件编译器已闭环的跳转条件。"""
    condition = require_dict(raw_condition, path)
    condition_type = action_name(str(condition.get("$type", "")))
    if condition_type == "CheckBuffStackNum":
        return _parse_buff_stack_num_condition(condition, path, inherited_blackboard)
    if condition_type == "CheckBuffStackNumAdvanced":
        return _parse_buff_stack_num_advanced_condition(
            condition, path, inherited_blackboard
        )
    if condition_type == "CheckHp":
        return _parse_hp_condition(condition, path, inherited_blackboard)
    if condition_type == "CompareFloat":
        return ConditionSource(
            sourceType=condition_type,
            supported=True,
            comparison=str(condition.get("compare", "")),
            left=parse_scalar(
                condition.get("valueA"), f"{path}.valueA", inherited_blackboard
            ),
            right=parse_scalar(
                condition.get("valueB"), f"{path}.valueB", inherited_blackboard
            ),
            skillTypes=(),
        )
    if condition_type == "CheckMainCharacterCondition":
        target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
        target_source = str(target.get("targetSource", ""))
        target_group_key = str(target.get("targetGroupKey", ""))
        return ConditionSource(
            sourceType=condition_type,
            supported=target_source in {"Owner", "Source"} and not target_group_key,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
            mainOperator=MainOperatorConditionSource(
                targetSource=target_source,
                targetGroupKey=target_group_key,
            ),
        )
    if condition_type == "CheckTimedMarkerCondition":
        target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
        marker_id = condition.get("id")
        blackboard_key = condition.get("blackboardKey")
        if not isinstance(marker_id, str):
            raise ValueError(f"{path}.id: expected string")
        if not isinstance(blackboard_key, str):
            raise ValueError(f"{path}.blackboardKey: expected string")
        use_blackboard_key = require_bool(
            condition.get("useBlackboardKey"), f"{path}.useBlackboardKey"
        )
        return_true_if_missing = require_bool(
            condition.get("returnTrueIfNotExists"),
            f"{path}.returnTrueIfNotExists",
        )
        target_source = str(target.get("targetSource", ""))
        target_group_key = str(target.get("targetGroupKey", ""))
        return ConditionSource(
            sourceType=condition_type,
            supported=(
                not use_blackboard_key
                and bool(marker_id)
                and target_source in {"Owner", "Source"}
                and not target_group_key
            ),
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
            timedMarker=TimedMarkerConditionSource(
                targetSource=target_source,
                targetGroupKey=target_group_key,
                markerId=marker_id,
                blackboardKey=blackboard_key,
                useBlackboardKey=use_blackboard_key,
                returnTrueIfNotExists=return_true_if_missing,
            ),
        )
    raise ValueError(f"{path}: unsupported timeline jump condition {condition_type!r}")


def parse_conditional_actions(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
    consumed_action_ids: frozenset[int] = frozenset(),
    *,
    include_target_group_provenance: bool = False,
    include_for_each_sequence_guards: bool = False,
    include_ordered_timeline_jumps: bool = False,
) -> tuple[ConditionalActionSource, ...]:
    """按原始顺序保留会改变战斗行为的 IfElse 树；展示动作不进入审计层。"""
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[ConditionalActionSource] = []
    once_scope_keys: dict[int, str] = {}

    def parse_condition(raw_condition: Any, path: str) -> ConditionSource:
        condition = require_dict(raw_condition, path)
        condition_type = action_name(str(condition.get("$type", "")))
        if condition_type == "OrConditionAction":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "conditionList",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            raw_groups = require_list(condition.get("conditionList"), f"{path}.conditionList")
            groups: list[tuple[ConditionSource, ...]] = []
            group_negations: list[tuple[bool, ...]] = []
            for group_index, raw_group in enumerate(raw_groups):
                group_path = f"{path}.conditionList[{group_index}]"
                group = require_dict(raw_group, group_path)
                expected_group_fields = {
                    "actionData", "onlyExecuteWhenSourceIsMainChar",
                    "onlyExecuteWhenSourceIsGuard",
                }
                if set(group) != expected_group_fields:
                    raise ValueError(f"{group_path}: unexpected fields {sorted(group)}")
                if group.get("onlyExecuteWhenSourceIsMainChar") is not False:
                    raise ValueError(f"{group_path}: main-character-only OR groups are unsupported")
                if group.get("onlyExecuteWhenSourceIsGuard") is not False:
                    raise ValueError(f"{group_path}: guard-only OR groups are unsupported")

                parsed: list[ConditionSource] = []
                negated: list[bool] = []
                negate_next = False
                for item_index, item in enumerate(
                    require_list(group.get("actionData"), f"{group_path}.actionData")
                ):
                    item_path = f"{group_path}.actionData[{item_index}]"
                    raw_item = require_dict(item, item_path)
                    if raw_item.get("isEnable") is False:
                        continue
                    item_type = action_name(str(raw_item.get("$type", "")))
                    if item_type == "NotNextCheckAction":
                        if negate_next:
                            raise ValueError(f"{item_path}: consecutive NotNextCheckAction is unsupported")
                        negate_next = True
                        continue
                    parsed.append(parse_condition(raw_item, item_path))
                    negated.append(negate_next)
                    negate_next = False
                if negate_next:
                    raise ValueError(f"{group_path}: dangling NotNextCheckAction")
                # OnCreate 会忽略空 SequenceAction；在生成器中同样不把空组当作 true。
                if parsed:
                    groups.append(tuple(parsed))
                    group_negations.append(tuple(negated))
            if not groups:
                raise ValueError(f"{path}: OrConditionAction has no non-empty condition groups")
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                anyConditionGroups=tuple(groups),
                anyConditionNegated=tuple(group_negations),
            )
        if condition_type == "Probablity":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "prob",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                probability=parse_scalar(
                    condition.get("prob"), f"{path}.prob", inherited_blackboard
                ),
            )
        if condition_type == "CheckDamageType":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "damageType",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            native_damage_type = condition.get("damageType")
            damage_type_map = {
                "Physical": "physical",
                "Fire": "heat",
                "Heat": "heat",
                "Cryst": "cryo",
                "Cold": "cryo",
                "Pulse": "electric",
                "Natural": "nature",
                "Nature": "nature",
            }
            damage_type = damage_type_map.get(str(native_damage_type))
            if damage_type is None:
                raise ValueError(f"{path}.damageType: unsupported value {native_damage_type!r}")
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                damageType=damage_type,
            )
        if condition_type == "CheckSpellInflictionType":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "mask", "savedKey",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            if condition.get("savedKey") != "":
                raise ValueError(f"{path}.savedKey: event value capture is not supported")
            native_elements = tuple(
                item.strip() for item in str(condition.get("mask", "")).split(",")
                if item.strip()
            )
            element_map = {
                "Fire": "heat",
                "Heat": "heat",
                "Pulse": "electric",
                "Cryst": "cryo",
                "Cold": "cryo",
                "Natural": "nature",
                "Nature": "nature",
            }
            elements = tuple(dict.fromkeys(element_map.get(item, "") for item in native_elements))
            if not elements or any(not item for item in elements):
                raise ValueError(f"{path}.mask: unsupported value {condition.get('mask')!r}")
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                inflictionElements=elements,
            )
        if condition_type == "CompareDeckAttr":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "target", "lhsType", "lhsValue",
                "compare", "rhsType", "rhsValue",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            target = parse_target_reference(condition.get("target"), f"{path}.target")
            left_attribute = condition.get("lhsType")
            right_attribute = condition.get("rhsType")
            comparison = condition.get("compare")
            if not isinstance(left_attribute, str) or not left_attribute:
                raise ValueError(f"{path}.lhsType: expected non-empty string")
            if not isinstance(right_attribute, str) or not right_attribute:
                raise ValueError(f"{path}.rhsType: expected non-empty string")
            if not isinstance(comparison, str) or not comparison:
                raise ValueError(f"{path}.compare: expected non-empty string")
            return ConditionSource(
                sourceType=condition_type,
                # 能否归约为构筑初值还需要由消费方严格检查目标、属性枚举和偏移量。
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                deckAttributeCompare=DeckAttributeCompareConditionSource(
                    targetSource=target.targetSource,
                    targetGroupKey=target.targetGroupKey,
                    leftAttribute=left_attribute,
                    leftValue=parse_scalar(
                        condition.get("lhsValue"), f"{path}.lhsValue", inherited_blackboard
                    ),
                    comparison=comparison,
                    rightAttribute=right_attribute,
                    rightValue=parse_scalar(
                        condition.get("rhsValue"), f"{path}.rhsValue", inherited_blackboard
                    ),
                ),
            )
        if condition_type == "CheckAbilityEntityCurDuration":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "abilityEntity", "compareType", "value",
                "saveCurDuration", "bbKey",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            comparison = condition.get("compareType")
            if comparison != "LT":
                raise ValueError(f"{path}.compareType: unsupported value {comparison!r}")
            save_duration = require_bool(
                condition.get("saveCurDuration"), f"{path}.saveCurDuration"
            )
            output_key = condition.get("bbKey")
            if not isinstance(output_key, str):
                raise ValueError(f"{path}.bbKey: expected string")
            if save_duration or output_key:
                raise ValueError(f"{path}: saving current duration is unsupported")
            target = parse_target_reference(
                condition.get("abilityEntity"), f"{path}.abilityEntity"
            )
            if target.targetSource != "Target" or target.targetGroupKey:
                raise ValueError(f"{path}.abilityEntity: unsupported target identity")
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                abilityEntityDuration=AbilityEntityDurationConditionSource(
                    target=target,
                    comparison=comparison,
                    value=parse_scalar(
                        condition.get("value"), f"{path}.value", inherited_blackboard
                    ),
                    saveCurrentDuration=save_duration,
                    outputKey=output_key,
                ),
            )
        if condition_type == "CheckDamageDecorateMask":
            mask = condition.get("mask")
            if not isinstance(mask, int) or isinstance(mask, bool) or mask < 0:
                raise ValueError(f"{path}.mask: expected non-negative integer")
            check_type = condition.get("checkType")
            if not isinstance(check_type, str) or not check_type:
                raise ValueError(f"{path}.checkType: expected non-empty string")
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                damageDecorateMask=DamageDecorateMaskConditionSource(
                    checkType=check_type,
                    mask=mask,
                ),
            )
        if condition_type == "CheckHealTag":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "query",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            query_type, tag_ids = parse_tag_query(condition.get("query"), f"{path}.query")
            if not tag_ids:
                raise ValueError(f"{path}.query.tags: expected non-empty tags")
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                healTag=HealTagConditionSource(queryType=query_type, tagIds=tag_ids),
            )
        if condition_type == "CheckOverHeal":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "overHealKey", "finalHealKey", "realHealKey",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            keys = tuple(condition.get(key) for key in ("overHealKey", "finalHealKey", "realHealKey"))
            if not all(isinstance(key, str) for key in keys):
                raise ValueError(f"{path}: heal output keys must be strings")
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                overHeal=OverHealConditionSource(*keys),
            )
        if condition_type == "CheckBuffIdInContext":
            check_type = condition.get("checkType")
            if not isinstance(check_type, str) or not check_type:
                raise ValueError(f"{path}.checkType: expected non-empty string")
            query = require_dict(condition.get("query"), f"{path}.query")
            query_type = query.get("queryType")
            if not isinstance(query_type, str) or not query_type:
                raise ValueError(f"{path}.query.queryType: expected non-empty string")
            buff_ids: list[str] = []
            for index, raw_buff in enumerate(
                require_list(condition.get("buffIdList"), f"{path}.buffIdList")
            ):
                buff = require_dict(raw_buff, f"{path}.buffIdList[{index}]")
                buff_id = buff.get("buffId")
                if not isinstance(buff_id, str) or not buff_id:
                    raise ValueError(f"{path}.buffIdList[{index}].buffId: expected string")
                buff_ids.append(buff_id)
            buff_tag_ids: list[int] = []
            for index, raw_tag in enumerate(
                require_list(query.get("tags", []), f"{path}.query.tags")
            ):
                tag = require_dict(raw_tag, f"{path}.query.tags[{index}]")
                if set(tag) != {"tagId"}:
                    raise ValueError(f"{path}.query.tags[{index}]: unexpected fields")
                tag_id = tag.get("tagId")
                if not isinstance(tag_id, int) or isinstance(tag_id, bool):
                    raise ValueError(f"{path}.query.tags[{index}].tagId: expected integer")
                buff_tag_ids.append(tag_id)
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                contextBuffId=BuffIdInContextConditionSource(
                    checkType=check_type,
                    buffIds=tuple(buff_ids),
                    queryType=query_type,
                    buffTagIds=tuple(buff_tag_ids),
                ),
            )
        if condition_type == "CompareFloat":
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=str(condition.get("compare", "")),
                left=parse_scalar(condition.get("valueA"), f"{path}.valueA", inherited_blackboard),
                right=parse_scalar(condition.get("valueB"), f"{path}.valueB", inherited_blackboard),
                skillTypes=(),
            )
        if condition_type == "CheckSkillType":
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=tuple(
                    str(item)
                    for item in require_list(condition.get("skillTypeList"), f"{path}.skillTypeList")
                ),
            )
        if condition_type == "CheckEntityNum":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            minimum_count = condition.get("minNum")
            if not isinstance(minimum_count, int) or isinstance(minimum_count, bool):
                raise ValueError(f"{path}.minNum: expected integer")
            contains_hittable = condition.get("containsHittableTarget")
            exclude_dead = condition.get("excludeDeadEntity")
            store_key = condition.get("storeKey")
            if not isinstance(contains_hittable, bool):
                raise ValueError(f"{path}.containsHittableTarget: expected boolean")
            if not isinstance(exclude_dead, bool):
                raise ValueError(f"{path}.excludeDeadEntity: expected boolean")
            if not isinstance(store_key, str):
                raise ValueError(f"{path}.storeKey: expected string")
            return ConditionSource(
                sourceType=condition_type,
                # 原生目标集合尚未进入单敌人模拟；这里只保真审计参数。
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                entityCount=EntityCountConditionSource(
                    targetSource=str(target.get("targetSource", "")),
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    minimumCount=minimum_count,
                    comparison=str(condition.get("compareType", "")),
                    containsHittableTarget=contains_hittable,
                    excludeDeadEntity=exclude_dead,
                    storeKey=store_key,
                ),
            )
        if condition_type == "CheckBuffStackNum":
            return _parse_buff_stack_num_condition(condition, path, inherited_blackboard)
        if condition_type == "CheckBuffStackNumAdvanced":
            return _parse_buff_stack_num_advanced_condition(
                condition, path, inherited_blackboard
            )
        if condition_type == "CheckBuffStackNumByTag":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            query_type, tag_ids = parse_tag_query(
                condition.get("tagQuery"),
                f"{path}.tagQuery",
            )
            count_type = condition.get("buffStackNumType")
            if not isinstance(count_type, str) or not count_type:
                raise ValueError(f"{path}.buffStackNumType: expected string")
            target_source = str(target.get("targetSource", ""))
            return ConditionSource(
                sourceType=condition_type,
                supported=(
                    target_source == "Target"
                    and count_type == "BuffCount"
                    and bool(tag_ids)
                ),
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                buffStack=BuffStackConditionSource(
                    targetSource=target_source,
                    # 原生动作仅在 Context 来源时读取该键；Target 来源会直接读取传入目标。
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    buffCheckType="Tag",
                    buffIds=(),
                    tagQueryType=query_type,
                    buffTagIds=tag_ids,
                    countType=count_type,
                    comparison=str(condition.get("compareType", "")),
                    value=parse_scalar(
                        condition.get("value"),
                        f"{path}.value",
                        inherited_blackboard,
                    ),
                    limitSkillCastId=False,
                ),
            )
        if condition_type == "CheckTagMatch":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            query_type, tag_ids = parse_tag_query(
                condition.get("query"),
                f"{path}.query",
            )
            return ConditionSource(
                sourceType=condition_type,
                supported=bool(tag_ids),
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                entityTag=EntityTagConditionSource(
                    targetSource=str(target.get("targetSource", "")),
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    tagQueryType=query_type,
                    tagIds=tag_ids,
                ),
            )
        if condition_type == "CheckTimedMarkerCondition":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            marker_id = condition.get("id")
            blackboard_key = condition.get("blackboardKey")
            if not isinstance(marker_id, str):
                raise ValueError(f"{path}.id: expected string")
            if not isinstance(blackboard_key, str):
                raise ValueError(f"{path}.blackboardKey: expected string")
            use_blackboard_key = require_bool(
                condition.get("useBlackboardKey"), f"{path}.useBlackboardKey"
            )
            return_true_if_missing = require_bool(
                condition.get("returnTrueIfNotExists"),
                f"{path}.returnTrueIfNotExists",
            )
            return ConditionSource(
                sourceType=condition_type,
                supported=(
                    not use_blackboard_key
                    and bool(marker_id)
                    and str(target.get("targetSource", "")) in {"Owner", "Source"}
                    and not str(target.get("targetGroupKey", ""))
                ),
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                timedMarker=TimedMarkerConditionSource(
                    targetSource=str(target.get("targetSource", "")),
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                    markerId=marker_id,
                    blackboardKey=blackboard_key,
                    useBlackboardKey=use_blackboard_key,
                    returnTrueIfNotExists=return_true_if_missing,
                ),
            )
        if condition_type == "CheckGlobalCDTimerAction":
            target = require_dict(condition.get("target"), f"{path}.target")
            buff_id = condition.get("buffId")
            if not isinstance(buff_id, str) or not buff_id:
                raise ValueError(f"{path}.buffId: expected non-empty string")
            target_source = str(target.get("targetSource", ""))
            target_group_key = str(target.get("targetGroupKey", ""))
            return ConditionSource(
                sourceType=condition_type,
                supported=(target_source in {"Owner", "Source"} and not target_group_key),
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                globalCooldown=GlobalCooldownConditionSource(
                    targetSource=target_source,
                    targetGroupKey=target_group_key,
                    buffId=buff_id,
                ),
            )
        if condition_type == "CheckSkillHasHit":
            return ConditionSource(
                sourceType=condition_type,
                supported=True,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                skillHasHit=SkillHasHitConditionSource(),
            )
        if condition_type == "CheckHp":
            return _parse_hp_condition(condition, path, inherited_blackboard)
        if condition_type == "CheckMainCharacterCondition":
            target = require_dict(condition.get("checkTarget"), f"{path}.checkTarget")
            target_source = str(target.get("targetSource", ""))
            return ConditionSource(
                sourceType=condition_type,
                supported=target_source in {"Owner", "Source"},
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                mainOperator=MainOperatorConditionSource(
                    targetSource=target_source,
                    targetGroupKey=str(target.get("targetGroupKey", "")),
                ),
            )
        if condition_type == "CheckEnemyRank":
            raw_rank_mask = condition.get("enemyRankSet")
            if isinstance(raw_rank_mask, bool):
                raise ValueError(f"{path}.enemyRankSet: expected EnemyRankSet flags")
            if isinstance(raw_rank_mask, int):
                rank_mask = raw_rank_mask
            elif isinstance(raw_rank_mask, str):
                names = tuple(part.strip() for part in raw_rank_mask.split(","))
                if not names or any(not name for name in names) or len(set(names)) != len(names):
                    raise ValueError(f"{path}.enemyRankSet: invalid EnemyRankSet names")
                bits = {"Mob": 1, "Elite": 2, "Boss": 4}
                if any(name not in bits for name in names):
                    raise ValueError(f"{path}.enemyRankSet: unknown EnemyRankSet name")
                rank_mask = sum(bits[name] for name in names)
            else:
                raise ValueError(f"{path}.enemyRankSet: expected EnemyRankSet flags")
            if rank_mask < 0 or rank_mask & ~0b111:
                raise ValueError(f"{path}.enemyRankSet: unknown EnemyRankSet bits")
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                enemyRank=EnemyRankConditionSource(
                    target=parse_target_reference(condition.get("target"), f"{path}.target"),
                    rankMask=rank_mask,
                ),
            )
        if condition_type == "CheckSuperArmor":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "checkTarget", "compareType", "value",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            comparison = condition.get("compareType")
            if not isinstance(comparison, str) or not comparison:
                raise ValueError(f"{path}.compareType: expected non-empty string")
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                superArmor=SuperArmorConditionSource(
                    target=parse_target_reference(
                        condition.get("checkTarget"), f"{path}.checkTarget"
                    ),
                    comparison=comparison,
                    value=parse_scalar(
                        condition.get("value"), f"{path}.value", inherited_blackboard
                    ),
                ),
            )
        if condition_type == "CheckTwoDirectionAngle":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "dir1Source", "dir1Target",
                "dir1DirectionType", "dir2Source", "dir2Target",
                "dir2DirectionType", "compareType", "value",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            direction1 = condition.get("dir1DirectionType")
            direction2 = condition.get("dir2DirectionType")
            comparison = condition.get("compareType")
            for field, value in (
                ("dir1DirectionType", direction1),
                ("dir2DirectionType", direction2),
                ("compareType", comparison),
            ):
                if not isinstance(value, str) or not value:
                    raise ValueError(f"{path}.{field}: expected non-empty string")
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                twoDirectionAngle=TwoDirectionAngleConditionSource(
                    dir1Source=parse_target_reference(
                        condition.get("dir1Source"), f"{path}.dir1Source"
                    ),
                    dir1Target=parse_target_reference(
                        condition.get("dir1Target"), f"{path}.dir1Target"
                    ),
                    dir1DirectionType=direction1,
                    dir2Source=parse_target_reference(
                        condition.get("dir2Source"), f"{path}.dir2Source"
                    ),
                    dir2Target=parse_target_reference(
                        condition.get("dir2Target"), f"{path}.dir2Target"
                    ),
                    dir2DirectionType=direction2,
                    comparison=comparison,
                    value=parse_scalar(
                        condition.get("value"), f"{path}.value", inherited_blackboard
                    ),
                ),
            )
        if condition_type == "CheckTargetAngle":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "origin", "target", "angleType", "angle",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            angle_type = condition.get("angleType")
            if angle_type not in {"TargetForward", "TargetBackward"}:
                raise ValueError(f"{path}.angleType: unsupported value {angle_type!r}")
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                targetAngle=TargetAngleConditionSource(
                    origin=parse_target_reference(
                        condition.get("origin"), f"{path}.origin"
                    ),
                    target=parse_target_reference(
                        condition.get("target"), f"{path}.target"
                    ),
                    angleType=angle_type,
                    angle=parse_scalar(
                        condition.get("angle"), f"{path}.angle", inherited_blackboard
                    ),
                ),
            )
        if condition_type == "CheckPoiseValue":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "poiseOwner", "returnValueIfDontHavePoise",
                "compare", "value",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            comparison = condition.get("compare")
            if not isinstance(comparison, str) or not comparison:
                raise ValueError(f"{path}.compare: expected non-empty string")
            return_if_missing = condition.get("returnValueIfDontHavePoise")
            if not isinstance(return_if_missing, bool):
                raise ValueError(f"{path}.returnValueIfDontHavePoise: expected boolean")
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                poise=PoiseConditionSource(
                    target=parse_target_reference(
                        condition.get("poiseOwner"), f"{path}.poiseOwner"
                    ),
                    returnValueIfMissing=return_if_missing,
                    comparison=comparison,
                    value=parse_scalar(
                        condition.get("value"), f"{path}.value", inherited_blackboard
                    ),
                ),
            )
        if condition_type == "CheckTargetsEqual":
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                targetIdentity=TargetIdentityConditionSource(
                    first=parse_target_reference(
                        condition.get("firstTargetSettings"),
                        f"{path}.firstTargetSettings",
                    ),
                    second=parse_target_reference(
                        condition.get("secondTargetSettings"),
                        f"{path}.secondTargetSettings",
                    ),
                ),
            )
        if condition_type == "CheckDistanceCondition":
            raw_distance = condition.get("distance")
            if not isinstance(raw_distance, (int, float)) or isinstance(raw_distance, bool):
                raise ValueError(f"{path}.distance: expected number")
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                distance=DistanceConditionSource(
                    source=parse_target_reference(condition.get("source"), f"{path}.source"),
                    target=parse_target_reference(condition.get("target"), f"{path}.target"),
                    distance=float(raw_distance),
                    lessThan=require_bool(condition.get("lessThan"), f"{path}.lessThan"),
                    includeTargetRadius=require_bool(
                        condition.get("includeTargetRadius"),
                        f"{path}.includeTargetRadius",
                    ),
                    containsHittableObject=require_bool(
                        condition.get("containsHittableObj"),
                        f"{path}.containsHittableObj",
                    ),
                ),
            )
        if condition_type == "CheckObjectTypeMatch":
            expected_fields = {
                "$type", "isEnable", "priorityLevel", "priorityOffset",
                "serverActionIndex", "target", "objectTypeMask",
            }
            if set(condition) != expected_fields:
                raise ValueError(f"{path}: unexpected fields {sorted(condition)}")
            mask = condition.get("objectTypeMask")
            if not isinstance(mask, (str, int)) or isinstance(mask, bool):
                raise ValueError(f"{path}.objectTypeMask: expected flags")
            return ConditionSource(
                sourceType=condition_type,
                supported=False,
                comparison=None,
                left=None,
                right=None,
                skillTypes=(),
                objectTypeMatch=ObjectTypeMatchConditionSource(
                    target=parse_target_reference(condition.get("target"), f"{path}.target"),
                    objectTypeMask=mask,
                ),
            )
        return ConditionSource(
            sourceType=condition_type,
            supported=False,
            comparison=None,
            left=None,
            right=None,
            skillTypes=(),
        )

    def parse_if_else(
        value: dict[str, Any],
        start_frame: int,
        end_frame: int,
        path: tuple[str, ...],
        execution_frames: tuple[int, ...],
    ) -> ConditionalActionSource | None:
        source_path = f"{source_name}.{'.'.join(path)}"
        condition_group = require_dict(
            value.get("conditionAction"), f"{source_path}.conditionAction"
        )
        conditions_list: list[ConditionSource] = []
        condition_negated: list[bool] = []
        negate_next = False
        for index, raw_condition in enumerate(
            require_list(
                condition_group.get("actionData"),
                f"{source_path}.conditionAction.actionData",
            )
        ):
            condition_path = f"{source_path}.conditionAction.actionData[{index}]"
            condition_data = require_dict(raw_condition, condition_path)
            if condition_data.get("isEnable") is False:
                continue
            if action_name(str(condition_data.get("$type", ""))) == "NotNextCheckAction":
                if negate_next:
                    raise ValueError(f"{condition_path}: consecutive NotNextCheckAction is unsupported")
                negate_next = True
                continue
            conditions_list.append(parse_condition(condition_data, condition_path))
            condition_negated.append(negate_next)
            negate_next = False
        if negate_next:
            raise ValueError(f"{source_path}.conditionAction: dangling NotNextCheckAction")
        conditions = tuple(conditions_list)
        succeed = parse_branch(
            value.get("succeedActions"),
            start_frame,
            end_frame,
            (*path, "succeedActions"),
            execution_frames,
        )
        fail = parse_branch(
            value.get("failActions"),
            start_frame,
            end_frame,
            (*path, "failActions"),
            execution_frames,
        )
        if not succeed and not fail:
            return None
        return ConditionalActionSource(
            startFrame=start_frame,
            endFrame=end_frame,
            actionIndex=require_non_negative_int(
                value.get("serverActionIndex"), f"{source_path}.serverActionIndex"
            ),
            actionPath=path,
            conditions=conditions,
            conditionNegated=tuple(condition_negated),
            succeedActions=succeed,
            failActions=fail,
            alwaysNext=require_bool(
                value.get("alwaysNext"), f"{source_path}.alwaysNext"
            ),
            executionFrames=execution_frames,
        )

    def parse_switch(
        value: dict[str, Any],
        start_frame: int,
        end_frame: int,
        path: tuple[str, ...],
        execution_frames: tuple[int, ...],
    ) -> ConditionalActionSource | None:
        """把原生 BlackboardDouble Switch 展开为首个匹配的条件链。"""
        source_path = f"{source_name}.{'.'.join(path)}"
        if value.get("alwaysNext") is not True:
            raise ValueError(f"{source_path}.alwaysNext: only true is supported")
        choice = parse_scalar(
            value.get("choice"), f"{source_path}.choice", inherited_blackboard
        )
        if choice.blackboardKey is None:
            raise ValueError(f"{source_path}.choice: expected Blackboard value")
        options = require_list(value.get("options"), f"{source_path}.options")
        nested: ConditionalActionSource | None = None
        has_combat_actions = False
        for option_index in range(len(options) - 1, -1, -1):
            option = require_dict(
                options[option_index], f"{source_path}.options[{option_index}]"
            )
            option_value = parse_scalar(
                option.get("value"),
                f"{source_path}.options[{option_index}].value",
                inherited_blackboard,
            )
            actions = parse_branch(
                option.get("actionData"),
                start_frame,
                end_frame,
                (*path, "options", f"[{option_index}]", "actionData"),
                execution_frames,
            )
            has_combat_actions = has_combat_actions or bool(actions)
            fail_actions = (
                ()
                if nested is None
                else (
                    ConditionalBranchActionSource(
                        actionType="SwitchAction",
                        actionIndex=option_index,
                        actionPath=nested.actionPath,
                        serverActionIndex=nested.actionIndex,
                        nestedCondition=nested,
                    ),
                )
            )
            nested = SwitchActionSource(
                startFrame=start_frame,
                endFrame=end_frame,
                actionIndex=require_non_negative_int(
                    value.get("serverActionIndex"),
                    f"{source_path}.serverActionIndex",
                ),
                actionPath=(*path, "options", f"[{option_index}]"),
                conditions=(
                    ConditionSource(
                        sourceType="CompareFloat",
                        supported=True,
                        comparison="Equals",
                        left=choice,
                        right=option_value,
                        skillTypes=(),
                    ),
                ),
                succeedActions=actions,
                failActions=fail_actions,
                executionFrames=execution_frames,
            )
        if nested is not None:
            nested = replace(nested, alwaysNext=True)
        return nested if has_combat_actions else None

    def parse_branch(
        value: Any,
        start_frame: int,
        end_frame: int,
        path: tuple[str, ...],
        execution_frames: tuple[int, ...],
        first_action_index: int = 0,
    ) -> tuple[ConditionalBranchActionSource, ...]:
        branch = require_dict(value, f"{source_name}.{'.'.join(path)}")
        actions: list[ConditionalBranchActionSource] = []
        raw_actions = require_list(
            branch.get("actionData"), f"{source_name}.{'.'.join(path)}.actionData"
        )
        for index in range(first_action_index, len(raw_actions)):
            raw_action = raw_actions[index]
            action = require_dict(raw_action, f"{source_name}.{'.'.join(path)}.actionData[{index}]")
            if action.get("isEnable") is False:
                continue
            action_type = action_name(str(action.get("$type", "")))
            action_path = (*path, "actionData", f"[{index}]")
            if action_type in SEQUENCE_GUARD_ACTION_NAMES | EVENT_SEQUENCE_GUARD_ACTION_NAMES:
                if not any(
                    contains_combat_effect(item)
                    or (
                        include_ordered_timeline_jumps
                        and isinstance(item, dict)
                        and action_name(str(item.get("$type", ""))) == "JumpToAction"
                    )
                    for item in raw_actions[index + 1 :]
                ):
                    continue
                guarded_actions = parse_branch(
                    value,
                    start_frame,
                    end_frame,
                    path,
                    execution_frames,
                    index + 1,
                )
                if guarded_actions:
                    actions.append(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=index,
                            actionPath=action_path,
                            serverActionIndex=require_server_action_index(
                                action, f"{source_name}.{'.'.join(action_path)}"
                            ),
                            nestedCondition=SequenceGuardActionSource(
                                startFrame=start_frame,
                                endFrame=end_frame,
                                actionIndex=require_non_negative_int(
                                    action.get("serverActionIndex"),
                                    f"{source_name}.{'.'.join(action_path)}.serverActionIndex",
                                ),
                                actionPath=action_path,
                                conditions=(
                                    parse_condition(
                                        action,
                                        f"{source_name}.{'.'.join(action_path)}",
                                    ),
                                ),
                                succeedActions=guarded_actions,
                                failActions=(),
                                executionFrames=execution_frames,
                            ),
                        )
                    )
                # 守卫已经接管全部后续兄弟动作，外层不能再次追加同一批动作。
                break
            if action_type == "IfElseAction":
                nested = parse_if_else(
                    action,
                    start_frame,
                    end_frame,
                    action_path,
                    execution_frames,
                )
                if nested is not None:
                    actions.append(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=index,
                            actionPath=action_path,
                            serverActionIndex=require_server_action_index(
                                action, f"{source_name}.{'.'.join(action_path)}"
                            ),
                            nestedCondition=nested,
                        )
                    )
            elif action_type == "ForEachAction":
                target = require_dict(
                    action.get("target"),
                    f"{source_name}.{'.'.join(action_path)}.target",
                )
                nested_actions = parse_branch(
                    action.get("action"),
                    start_frame,
                    end_frame,
                    (*action_path, "action"),
                    execution_frames,
                )
                target_source = target.get("targetSource")
                target_group_key = target.get("targetGroupKey")
                nested_container = require_dict(
                    action.get("action"),
                    f"{source_name}.{'.'.join(action_path)}.action",
                )
                nested_items = require_list(
                    nested_container.get("actionData"),
                    f"{source_name}.{'.'.join(action_path)}.action.actionData",
                )
                has_direct_guard = any(
                    isinstance(item, dict)
                    and item.get("isEnable") is not False
                    and action_name(str(item.get("$type", "")))
                    in SEQUENCE_GUARD_ACTION_NAMES
                    for item in nested_items
                )
                def contains_distance_condition(current: Any) -> bool:
                    if isinstance(current, list):
                        return any(contains_distance_condition(item) for item in current)
                    if not isinstance(current, dict) or current.get("isEnable") is False:
                        return False
                    if action_name(str(current.get("$type", ""))) == "CheckDistanceCondition":
                        return True
                    return any(
                        contains_distance_condition(item) for item in current.values()
                    )

                if (
                    target_source == "Context"
                    and isinstance(target_group_key, str)
                    and target_group_key
                    and (
                        has_direct_guard
                        or contains_distance_condition(action.get("action"))
                    )
                ):
                    if nested_actions:
                        action_index = require_server_action_index(
                            action, f"{source_name}.{'.'.join(action_path)}"
                        )
                        actions.append(
                            ConditionalBranchActionSource(
                                actionType=action_type,
                                actionIndex=index,
                                actionPath=action_path,
                                serverActionIndex=action_index,
                                nestedCondition=ForEachContextActionSource(
                                    startFrame=start_frame,
                                    endFrame=end_frame,
                                    actionIndex=action_index,
                                    actionPath=action_path,
                                    conditions=(),
                                    succeedActions=nested_actions,
                                    failActions=(),
                                    executionFrames=execution_frames,
                                    contextKey=target_group_key,
                                ),
                            )
                        )
                else:
                    parsed_loop_target = (
                        parse_target_reference(
                            target, f"{source_name}.{'.'.join(action_path)}.target"
                        )
                        if target_source == "InstantSearch"
                        else None
                    )
                    if (
                        parsed_loop_target is not None
                        and parsed_loop_target.targetSource == "InstantSearch"
                        and parsed_loop_target.finderType == "CharacterTeamFinder"
                        and parsed_loop_target.validatorTypes
                        in {(), ("ExcludeOwnerValidator",)}
                        and not parsed_loop_target.postProcessorTypes
                    ):
                        projected_actions: list[ConditionalBranchActionSource] = []
                        for nested_action in nested_actions:
                            payload = nested_action.buffApplication
                            if (
                                payload is None
                                or payload.targetSource != "Target"
                                or payload.targetGroupKey
                            ):
                                raise ValueError(
                                    f"{source_name}.{'.'.join(action_path)}: "
                                    "party ForEach only supports direct Target Buff applications"
                                )
                            projected_actions.append(
                                replace(
                                    nested_action,
                                    buffApplication=replace(
                                        payload,
                                        targetSource="InstantSearch",
                                        targetFinderType="CharacterTeamFinder",
                                        targetValidatorTypes=parsed_loop_target.validatorTypes,
                                        targetPostProcessorTypes=(),
                                    ),
                                )
                            )
                        actions.extend(projected_actions)
                        continue
                    # 固定单敌人模型下，直接 Target 容器只执行一次。
                    tuple(
                        walk_single_enemy_actions(
                            action, f"{source_name}.{'.'.join(action_path)}"
                        )
                    )
                    actions.extend(nested_actions)
            elif action_type == "SwitchAction":
                nested = parse_switch(
                    action,
                    start_frame,
                    end_frame,
                    action_path,
                    execution_frames,
                )
                if nested is not None:
                    actions.append(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=index,
                            actionPath=action_path,
                            serverActionIndex=require_server_action_index(
                                action, f"{source_name}.{'.'.join(action_path)}"
                            ),
                            nestedCondition=nested,
                        )
                    )
            elif action_type == "DoOnceAction":
                once_actions = parse_branch(
                    action.get("sequenceActionData"),
                    start_frame,
                    end_frame,
                    (*action_path, "sequenceActionData"),
                    execution_frames,
                )
                if once_actions:
                    actions.append(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=index,
                            actionPath=action_path,
                            serverActionIndex=require_server_action_index(
                                action, f"{source_name}.{'.'.join(action_path)}"
                            ),
                            onceScopeKey="do-once:" + ".".join(action_path),
                            onceActions=once_actions,
                        )
                    )
            elif action_type in CONDITIONAL_AUDIT_ACTION_NAMES or (
                include_target_group_provenance
                and action_type in TARGET_GROUP_PROVENANCE_ACTION_NAMES
            ) or (
                include_ordered_timeline_jumps and action_type == "JumpToAction"
            ):
                source_path = f"{source_name}.{'.'.join(action_path)}"
                calculation = None
                store_attribute_value = None
                mutation = None
                buff_read = None
                buff_finish = None
                legacy_buff_finish = None
                skill_cooldown_adjustment = None
                buff_ignite = None
                buff_stack_read = None
                buff_application = None
                timed_marker_application = None
                global_cooldown_application = None
                resource_gain = None
                infliction = None
                physical_infliction = None
                interrupt = None
                projectile_launch = None
                ability_entity_spawn = None
                ability_entity_duration_assignment = None
                store_current_timeline_frame = None
                damage_units = None
                keyword_action = None
                time_dilation = None
                heal = None
                knock_down_output = None
                timeline_jump_destination_frame = None
                if action_type == "SimpleCalcBBAction":
                    calculation = parse_blackboard_calculation_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "ModifyDynamicBlackboard":
                    mutation = parse_blackboard_mutation_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "StoreAttributeValue":
                    expected_fields = {
                        "$type", "isEnable", "priorityLevel", "priorityOffset",
                        "serverActionIndex", "targetSettings", "primaryAttributeType",
                        "attributeType", "storeAttributeType", "useFloor", "divisorValue",
                        "multiplierValue", "baseValue", "key",
                    }
                    if set(action) != expected_fields:
                        raise ValueError(
                            f"{source_path}: unexpected StoreAttributeValue fields {sorted(action)}"
                        )
                    target = parse_target_reference(action.get("targetSettings"), source_path)
                    raw_attribute = action.get("attributeType")
                    attribute_key = {
                        "Str": "strength", "Agi": "agility", "Wisd": "intellect",
                        "Will": "will", "Level": "level", "MaxHp": "maxHealth",
                        "MaxUltimateSp": "maxUltimateEnergy",
                        "CrystAbnormalDamageIncrease": "cryoAbnormalDamageIncrease",
                        "PulseAbnormalDamageIncrease": "electricAbnormalDamageIncrease",
                    }.get(raw_attribute)
                    divisor = parse_scalar(action.get("divisorValue"), source_path, inherited_blackboard)
                    base = parse_scalar(action.get("baseValue"), source_path, inherited_blackboard)
                    output_key = action.get("key")
                    supported_store_shape = (
                        target.targetSource in {"Source", "Owner"}
                        and not target.targetGroupKey
                        and not target.validatorTypes
                        and not target.postProcessorTypes
                        and action.get("primaryAttributeType")
                        == ("Sub" if action.get("attributeType") == "Level" else "Specific")
                        and attribute_key is not None
                        # Next 当前只把构筑期已解析面板放入共享动作黑板；没有
                        # 运行时四维 converted 修正。因此 BaseNonConverted 与
                        # FinalNonConverted 在这个边界都投影为同一静态面板值。
                        and action.get("storeAttributeType")
                        in {"BaseNonConverted", "FinalNonConverted"}
                        and action.get("useFloor") is False
                        and divisor.blackboardKey is None
                        and divisor.value == 1
                        and isinstance(output_key, str)
                        and output_key
                    )
                    if supported_store_shape:
                        store_attribute_value = StoreAttributeValuePayload(
                            targetSource=target.targetSource,
                            targetGroupKey=target.targetGroupKey,
                            attributeKind="specific",
                            attributeKey=attribute_key,
                            stage={
                                "BaseNonConverted": "armedNonConverted",
                                "FinalNonConverted": "finalNonConverted",
                            }[action.get("storeAttributeType")],
                            useFloor=action.get("useFloor"),
                            divisor=divisor,
                            multiplier=parse_scalar(
                                action.get("multiplierValue"), source_path, inherited_blackboard
                            ),
                            base=base,
                            outputKey=output_key,
                        )
                elif action_type == "ReadSkillSettingData":
                    expected_fields = {
                        "$type", "isEnable", "priorityLevel", "priorityOffset",
                        "serverActionIndex", "dataList",
                    }
                    if set(action) != expected_fields:
                        raise ValueError(
                            f"{source_path}: unexpected ReadSkillSettingData fields {sorted(action)}"
                        )
                    data_list = require_list(action.get("dataList"), f"{source_path}.dataList")
                    if len(data_list) != 1:
                        continue
                    item = require_dict(data_list[0], f"{source_path}.dataList[0]")
                    if set(item) != {"dataKey", "column", "enhanceAttributeSource", "storeKey"}:
                        raise ValueError(
                            f"{source_path}.dataList[0]: unexpected fields {sorted(item)}"
                        )
                    data_key = item.get("dataKey")
                    output_key = item.get("storeKey")
                    if not isinstance(data_key, str) or not data_key:
                        raise ValueError(f"{source_path}.dataList[0].dataKey: expected non-empty string")
                    if not has_recovered_skill_setting_data(data_key):
                        continue
                    if not isinstance(output_key, str) or not output_key:
                        raise ValueError(f"{source_path}.dataList[0].storeKey: expected non-empty string")
                    column = parse_scalar(
                        item.get("column"), f"{source_path}.dataList[0].column", inherited_blackboard
                    )
                    if column.blackboardKey is not None:
                        continue
                    target = parse_target_reference(
                        item.get("enhanceAttributeSource"),
                        f"{source_path}.dataList[0].enhanceAttributeSource",
                    )
                    if (
                        target.targetSource not in {"Source", "Owner"}
                        or target.targetGroupKey
                        or target.validatorTypes
                        or target.postProcessorTypes
                    ):
                        raise ValueError(f"{source_path}.dataList[0]: unsupported enhance target")
                    base, multiplier = resolve_linear_skill_setting_read(
                        data_key, column.value, f"{source_path}.dataList[0]"
                    )
                    store_attribute_value = StoreAttributeValuePayload(
                        targetSource=target.targetSource,
                        targetGroupKey="",
                        attributeKind="specific",
                        attributeKey="PhysicalAndSpellInflictionEnhance",
                        stage="finalNonConverted",
                        useFloor=False,
                        divisor=ScalarSource(value=1, blackboardKey=None, levelValues=None),
                        multiplier=ScalarSource(
                            value=multiplier, blackboardKey=None, levelValues=None
                        ),
                        base=ScalarSource(value=base, blackboardKey=None, levelValues=None),
                        outputKey=output_key,
                    )
                elif action_type == "GetTargetBuffBBAdvanced":
                    buff_read = parse_buff_blackboard_read_payload(action, source_path)
                elif action_type == "FinishBuffAdvanced":
                    buff_finish = parse_buff_finish_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "FinishBuffAction":
                    legacy_buff_finish = parse_legacy_buff_finish_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "SetSkillCdAtOnce":
                    skill_cooldown_adjustment = parse_skill_cooldown_adjustment_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "IgniteAction":
                    expected_fields = {
                        "$type", "isEnable", "priorityLevel", "priorityOffset",
                        "serverActionIndex", "igniteSource", "targetSettings",
                        "igniteType", "successTargetContextKey",
                    }
                    if set(action) != expected_fields:
                        raise ValueError(
                            f"{source_path}: unexpected IgniteAction fields {sorted(action)}"
                        )
                    ignite_type = action.get("igniteType")
                    success_key = action.get("successTargetContextKey")
                    if not isinstance(ignite_type, str) or not ignite_type:
                        raise ValueError(f"{source_path}.igniteType: expected non-empty string")
                    if not isinstance(success_key, str):
                        raise ValueError(
                            f"{source_path}.successTargetContextKey: expected string"
                        )
                    buff_ignite = BuffIgnitePayload(
                        source=parse_target_reference(
                            action.get("igniteSource"), f"{source_path}.igniteSource"
                        ),
                        target=parse_target_reference(
                            action.get("targetSettings"), f"{source_path}.targetSettings"
                        ),
                        igniteType=ignite_type,
                        successTargetContextKey=success_key,
                    )
                elif action_type == "SaveBuffStackNumAdvanced":
                    buff_stack_read = parse_buff_stack_read_payload(action, source_path)
                elif action_type == "SaveBuffStackNum":
                    buff_stack_read = parse_simple_buff_stack_read_payload(
                        action, source_path
                    )
                elif action_type == "CreateBuffAction":
                    buff_application = parse_buff_application_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "CreateTimedMarker":
                    timed_marker_application = parse_timed_marker_application_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "AddGlobalCDTimer":
                    global_cooldown_application = parse_global_cooldown_application_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "ObtainCostAction":
                    resource_gain = parse_resource_gain_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "SpellInfliction":
                    infliction = parse_infliction_payload(action, source_path)
                elif action_type in {"FractureAction", "CrushAction"}:
                    physical_infliction = parse_physical_infliction_payload(
                        action, source_path, inherited_blackboard
                    )
                elif action_type == "InterruptAction":
                    interrupt = parse_interrupt_payload(action, source_path)
                elif action_type == "LaunchProjectile":
                    projectile_launch = parse_projectile_launch_payload(action, source_path)
                elif action_type == "SpawnAbilityEntity":
                    ability_entity_spawn = parse_ability_entity_spawn_payload(
                        action, source_path
                    )
                elif action_type == "SetAbilityEntityDuration":
                    ability_entity_duration_assignment = (
                        parse_ability_entity_duration_assignment_payload(
                            action, source_path, inherited_blackboard
                        )
                    )
                elif action_type == "DamageAction":
                    if "damageUnits" in action:
                        damage_units = parse_damage_units(
                            {"actionGroupData": {"action": action}},
                            source_path,
                            inherited_blackboard,
                        )
                elif action_type == "HealAction":
                    heal = parse_heal_payload(action, source_path, inherited_blackboard)
                elif action_type == "KnockDownAction":
                    knock_down_output = parse_knock_down_output_payload(
                        action,
                        source_path,
                        inherited_blackboard,
                        start_frame=start_frame,
                        end_frame=end_frame,
                        action_path=action_path,
                    )
                elif action_type == "StoreCurSkillExecuteFrame":
                    expected_fields = {
                        "$type", "isEnable", "priorityLevel", "priorityOffset",
                        "serverActionIndex", "target", "blackboardKey",
                    }
                    if set(action) != expected_fields:
                        raise ValueError(
                            f"{source_path}: unexpected StoreCurSkillExecuteFrame fields "
                            f"{sorted(action)}"
                        )
                    target = parse_target_reference(action.get("target"), f"{source_path}.target")
                    output_key = action.get("blackboardKey")
                    if (
                        target.targetSource != "Owner"
                        or target.targetGroupKey
                        or target.validatorTypes
                        or target.postProcessorTypes
                    ):
                        raise ValueError(f"{source_path}.target: unsupported timeline frame owner")
                    if not isinstance(output_key, str) or not output_key:
                        raise ValueError(f"{source_path}.blackboardKey: expected non-empty string")
                    store_current_timeline_frame = StoreCurrentTimelineFramePayload(output_key)
                elif action_type == "JumpToAction":
                    expected_fields = {
                        "$type", "isEnable", "priorityLevel", "priorityOffset",
                        "serverActionIndex", "conditionAction", "destFrame",
                    }
                    if set(action) != expected_fields:
                        raise ValueError(
                            f"{source_path}: unexpected JumpToAction fields {sorted(action)}"
                        )
                    condition = require_dict(
                        action.get("conditionAction"), f"{source_path}.conditionAction"
                    )
                    if set(condition) != {
                        "actionData", "onlyExecuteWhenSourceIsMainChar",
                        "onlyExecuteWhenSourceIsGuard",
                    }:
                        raise ValueError(
                            f"{source_path}.conditionAction: unexpected fields {sorted(condition)}"
                        )
                    if (
                        require_list(condition.get("actionData"), f"{source_path}.conditionAction.actionData")
                        or require_bool(
                            condition.get("onlyExecuteWhenSourceIsMainChar"),
                            f"{source_path}.conditionAction.onlyExecuteWhenSourceIsMainChar",
                        )
                        or require_bool(
                            condition.get("onlyExecuteWhenSourceIsGuard"),
                            f"{source_path}.conditionAction.onlyExecuteWhenSourceIsGuard",
                        )
                    ):
                        raise ValueError(f"{source_path}: conditional timeline jump is unsupported")
                    timeline_jump_destination_frame = require_non_negative_int(
                        action.get("destFrame"), f"{source_path}.destFrame"
                    )
                elif action_type == "SlowAction":
                    keyword_action = parse_keyword_action(
                        action,
                        source_path,
                        inherited_blackboard,
                        start_frame=start_frame,
                        end_frame=end_frame,
                    )
                elif action_type in {"TimeDilationAction", "UltimateTimeAction"}:
                    time_dilation = parse_time_dilation_action(
                        action,
                        source_path,
                        inherited_blackboard,
                        start_frame=start_frame,
                        end_frame=end_frame,
                    )
                branch_type = (
                    ConditionalTimeDilationActionSource
                    if time_dilation is not None
                    else TimelineJumpBranchActionSource
                    if timeline_jump_destination_frame is not None
                    else StoreCurrentTimelineFrameActionSource
                    if store_current_timeline_frame is not None
                    else ConditionalBranchActionSource
                )
                branch_arguments = {
                    "actionType": action_type,
                    "actionIndex": index,
                    "actionPath": action_path,
                    "serverActionIndex": optional_server_action_index(
                        action, source_path
                    ),
                    "blackboardCalculation": calculation,
                    "storeAttributeValue": store_attribute_value,
                    "blackboardMutation": mutation,
                    "buffBlackboardRead": buff_read,
                    "buffFinish": buff_finish,
                    "legacyBuffFinish": legacy_buff_finish,
                    "skillCooldownAdjustment": skill_cooldown_adjustment,
                    "buffIgnite": buff_ignite,
                    "buffStackRead": buff_stack_read,
                    "buffApplication": buff_application,
                    "timedMarkerApplication": timed_marker_application,
                    "globalCooldownApplication": global_cooldown_application,
                    "resourceGain": resource_gain,
                    "infliction": infliction,
                    "physicalInfliction": physical_infliction,
                    "interrupt": interrupt,
                    "projectileLaunch": projectile_launch,
                    "abilityEntitySpawn": ability_entity_spawn,
                    "abilityEntityDurationAssignment": ability_entity_duration_assignment,
                    "damageUnits": damage_units,
                    "heal": heal,
                    "keywordAction": keyword_action,
                    "knockDownOutput": knock_down_output,
                }
                if time_dilation is not None:
                    branch_arguments["timeDilation"] = time_dilation
                if store_current_timeline_frame is not None:
                    branch_arguments["storeCurrentTimelineFrame"] = store_current_timeline_frame
                if timeline_jump_destination_frame is not None:
                    branch_arguments["timelineJumpDestinationFrame"] = (
                        timeline_jump_destination_frame
                    )
                actions.append(branch_type(**branch_arguments))
        return tuple(actions)

    def visit(
        value: Any,
        start_frame: int,
        end_frame: int,
        path: tuple[str, ...],
        execution_frames: tuple[int, ...],
    ) -> None:
        if isinstance(value, list):
            for index, child in enumerate(value):
                visit(child, start_frame, end_frame, (*path, f"[{index}]"), execution_frames)
            return
        if not isinstance(value, dict):
            return
        action_type = action_name(str(value.get("$type", "")))
        if action_type == "TickIntervalAction":
            action_path = f"{source_name}.{'.'.join(path)}"
            if value.get("executeEachFrame") is True:
                expected_fields = {
                    "$type", "isEnable", "priorityLevel", "priorityOffset",
                    "serverActionIndex", "executeEachFrame", "tickInterval",
                    "tickIntervalBlackboardKey", "useTickIntervalBlackboardKey",
                    "actionOnTick",
                }
                if set(value) != expected_fields:
                    raise ValueError(
                        f"{action_path}: unexpected executeEachFrame fields {sorted(value)}"
                    )
                if (
                    value.get("useTickIntervalBlackboardKey") is not False
                    or value.get("tickIntervalBlackboardKey") != ""
                ):
                    raise ValueError(
                        f"{action_path}: executeEachFrame cannot use an interval blackboard key"
                    )
                action_on_tick = require_dict(
                    value.get("actionOnTick"), f"{action_path}.actionOnTick"
                )
                if set(action_on_tick) != {
                    "actionData",
                    "onlyExecuteWhenSourceIsMainChar",
                    "onlyExecuteWhenSourceIsGuard",
                }:
                    raise ValueError(
                        f"{action_path}.actionOnTick: unexpected fields {sorted(action_on_tick)}"
                    )
                if (
                    action_on_tick.get("onlyExecuteWhenSourceIsMainChar") is not False
                    or action_on_tick.get("onlyExecuteWhenSourceIsGuard") is not False
                ):
                    raise ValueError(f"{action_path}.actionOnTick: unsupported source restriction")
                actions = parse_branch(
                    action_on_tick,
                    start_frame,
                    end_frame,
                    (*path, "actionOnTick"),
                    (),
                )
                if actions:
                    result.append(
                        EveryFrameActionSource(
                            startFrame=start_frame,
                            endFrame=end_frame,
                            actionIndex=require_server_action_index(value, action_path),
                            actionPath=path,
                            conditions=(),
                            succeedActions=actions,
                            failActions=(),
                        )
                    )
                return
            if (
                value.get("executeEachFrame") is not False
                or value.get("useTickIntervalBlackboardKey") is not False
                or value.get("tickIntervalBlackboardKey") != ""
            ):
                raise ValueError(f"{action_path}: only a fixed literal interval is supported")
            interval_seconds = value.get("tickInterval")
            if (
                not isinstance(interval_seconds, (int, float))
                or isinstance(interval_seconds, bool)
                or interval_seconds <= 0
            ):
                raise ValueError(f"{action_path}.tickInterval: expected positive number")
            tick_frames = project_tick_interval_frames(
                start_frame, end_frame, float(interval_seconds)
            )
            if not tick_frames:
                raise ValueError(f"{action_path}: interval produces no ticks")
            visit(
                value.get("actionOnTick"),
                start_frame,
                end_frame,
                (*path, "actionOnTick"),
                tick_frames,
            )
            return
        if action_type == "ForEachAction" and include_for_each_sequence_guards:
            # 直接遍历技能输入目标时，固定单敌人模型可以把容器退化为
            # 一次顺序执行。Context 组不能做同样的身份假设；但可以保留
            # 显式的遍历节点，稍后由编译器核对它的生产者是 AbilityEntity。
            target = require_dict(
                value.get("target"), f"{source_name}.{'.'.join(path)}.target"
            )
            target_source = target.get("targetSource")
            target_group_key = target.get("targetGroupKey")
            if target_source == "Context" and isinstance(target_group_key, str) and target_group_key:
                def contains_recovered_skill_setting_read(current: Any) -> bool:
                    if isinstance(current, list):
                        return any(contains_recovered_skill_setting_read(item) for item in current)
                    if not isinstance(current, dict) or current.get("isEnable") is False:
                        return False
                    if action_name(str(current.get("$type", ""))) == "ReadSkillSettingData":
                        raw_data = current.get("dataList")
                        return (
                            isinstance(raw_data, list)
                            and any(
                                isinstance(item, dict)
                                and isinstance(item.get("dataKey"), str)
                                and has_recovered_skill_setting_data(item["dataKey"])
                                for item in raw_data
                            )
                        )
                    return any(
                        contains_recovered_skill_setting_read(item)
                        for item in current.values()
                    )

                def contains_duration_assignment(current: Any) -> bool:
                    if isinstance(current, list):
                        return any(contains_duration_assignment(item) for item in current)
                    if not isinstance(current, dict) or current.get("isEnable") is False:
                        return False
                    if action_name(str(current.get("$type", ""))) == "SetAbilityEntityDuration":
                        return True
                    return any(contains_duration_assignment(item) for item in current.values())

                action_container = require_dict(
                    value.get("action"), f"{source_name}.{'.'.join(path)}.action"
                )
                action_items = require_list(
                    action_container.get("actionData"),
                    f"{source_name}.{'.'.join(path)}.action.actionData",
                )
                has_direct_guard = any(
                    isinstance(action, dict)
                    and action.get("isEnable") is not False
                    and action_name(str(action.get("$type", "")))
                    in SEQUENCE_GUARD_ACTION_NAMES
                    for action in action_items
                )
                has_duration_assignment = contains_duration_assignment(
                    value.get("action")
                )
                has_recovered_setting_read = contains_recovered_skill_setting_read(
                    value.get("action")
                )
                if not (has_duration_assignment or has_direct_guard):
                    if has_recovered_setting_read:
                        actions = parse_branch(
                            value.get("action"),
                            start_frame,
                            end_frame,
                            (*path, "action"),
                            execution_frames,
                        )
                        # 根级伤害、Buff、回能与嵌套条件仍由既有解析器拥有；这里只
                        # 接管 ReadSkillSettingData 周围必须保持顺序的黑板计算。
                        ordered_actions = tuple(
                            action
                            for action in actions
                            if action.blackboardMutation is not None
                            or action.storeAttributeValue is not None
                        )
                        if ordered_actions:
                            result.append(
                                UnconditionalActionSource(
                                    startFrame=start_frame,
                                    endFrame=end_frame,
                                    actionIndex=require_server_action_index(
                                        value, f"{source_name}.{'.'.join(path)}"
                                    ),
                                    actionPath=path,
                                    conditions=(),
                                    succeedActions=ordered_actions,
                                    failActions=(),
                                )
                            )
                    for key, child in value.items():
                        visit(child, start_frame, end_frame, (*path, key), execution_frames)
                    return
                if has_duration_assignment:
                    parse_target_reference(
                        target, f"{source_name}.{'.'.join(path)}.target"
                    )
                actions = parse_branch(
                    value.get("action"),
                    start_frame,
                    end_frame,
                    (*path, "action"),
                    execution_frames,
                )
                if actions:
                    result.append(
                        ForEachContextActionSource(
                            startFrame=start_frame,
                            endFrame=end_frame,
                            actionIndex=require_server_action_index(
                                value, f"{source_name}.{'.'.join(path)}"
                            ),
                            actionPath=path,
                            conditions=(),
                            succeedActions=actions,
                            failActions=(),
                            executionFrames=execution_frames,
                            contextKey=target_group_key,
                        )
                    )
                return
            if not (target_source == "Target" and target_group_key == ""):
                for key, child in value.items():
                    visit(child, start_frame, end_frame, (*path, key), execution_frames)
                return

            # 含序列守卫的单敌人子树由这里独占，避免根伤害/黑板解析器把
            # 守卫尾部提升成无条件动作。
            tuple(
                walk_single_enemy_actions(
                    value, f"{source_name}.{'.'.join(path)}"
                )
            )
            sequence = value.get("action")
            sequence_data = require_dict(
                sequence, f"{source_name}.{'.'.join(path)}.action"
            )
            sequence_actions = require_list(
                sequence_data.get("actionData"),
                f"{source_name}.{'.'.join(path)}.action.actionData",
            )
            has_direct_guard = any(
                isinstance(action, dict)
                and action.get("isEnable") is not False
                and action_name(str(action.get("$type", "")))
                in SEQUENCE_GUARD_ACTION_NAMES
                for action in sequence_actions
            )
            if not has_direct_guard:
                for key, child in value.items():
                    visit(child, start_frame, end_frame, (*path, key), execution_frames)
                return

            def collect_effect_types(current: Any) -> set[str]:
                if isinstance(current, list):
                    return set().union(*(collect_effect_types(item) for item in current))
                if not isinstance(current, dict) or current.get("isEnable") is False:
                    return set()
                current_type = action_name(str(current.get("$type", "")))
                result_types = (
                    {current_type}
                    if current_type
                    in AUDITED_COMBAT_EFFECT_ACTION_NAMES
                    | ORDERED_STATE_EFFECT_ACTION_NAMES
                    else set()
                )
                return result_types | set().union(
                    *(collect_effect_types(child) for child in current.values())
                )

            effect_types = collect_effect_types(sequence)
            if effect_types & FOR_EACH_GUARD_NON_OWNABLE_EFFECT_ACTION_NAMES:
                # 保持旧遍历，让未取得独占所有权的守卫继续进入严格覆盖检查。
                for key, child in value.items():
                    visit(child, start_frame, end_frame, (*path, key), execution_frames)
                return
            actions = parse_branch(
                sequence,
                start_frame,
                end_frame,
                (*path, "action"),
                execution_frames,
            )
            if actions:
                result.append(
                    UnconditionalActionSource(
                        startFrame=start_frame,
                        endFrame=end_frame,
                        actionIndex=require_server_action_index(
                            value, f"{source_name}.{'.'.join(path)}"
                        ),
                        actionPath=path,
                        conditions=(),
                        succeedActions=actions,
                        failActions=(),
                        executionFrames=execution_frames,
                    )
                )
            return
        if action_type == "IfElseAction":
            conditional = parse_if_else(
                value,
                start_frame,
                end_frame,
                path,
                execution_frames,
            )
            if conditional is not None:
                result.append(conditional)
            # 嵌套 IfElse 已由分支节点递归保存，不能再提升为并列的顶层条件。
            return
        if action_type == "SwitchAction":
            conditional = parse_switch(
                value,
                start_frame,
                end_frame,
                path,
                execution_frames,
            )
            if conditional is not None:
                result.append(conditional)
            # Switch 选项已被保存为嵌套条件链，不能再把内部动作提升到根调度。
            return
        if action_type == "DoOnceAction":
            action_path = f"{source_name}.{'.'.join(path)}"
            once_actions = parse_branch(
                value.get("sequenceActionData"),
                start_frame,
                end_frame,
                (*path, "sequenceActionData"),
                execution_frames,
            )
            if once_actions:
                # ChannelingAction 投影会让多个时间点共享同一个 actionOnTick 对象；
                # 首次遇到时生成稳定作用域，后续投影必须沿用它。
                scope_key = once_scope_keys.setdefault(
                    id(value), "do-once:" + ".".join(path)
                )
                result.append(
                    DoOnceActionSource(
                        startFrame=start_frame,
                        endFrame=end_frame,
                        actionIndex=require_non_negative_int(
                            value.get("serverActionIndex"),
                            f"{action_path}.serverActionIndex",
                        ),
                        actionPath=path,
                        conditions=(),
                        succeedActions=once_actions,
                        failActions=(),
                        executionFrames=execution_frames,
                        onceScopeKey=scope_key,
                    )
                )
            # 内部动作已保存在一次性节点中，不能再提升到根调度。
            return
        if action_type == "HealAction":
            action_path = f"{source_name}.{'.'.join(path)}"
            action_index = require_server_action_index(value, action_path)
            result.append(
                UnconditionalActionSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=action_index,
                    actionPath=path,
                    conditions=(),
                    succeedActions=(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=action_index,
                            actionPath=path,
                            serverActionIndex=action_index,
                            heal=parse_heal_payload(value, action_path, inherited_blackboard),
                        ),
                    ),
                    failActions=(),
                    executionFrames=execution_frames,
                )
            )
            return
        if action_type == "SetSkillCdAtOnce":
            action_path = f"{source_name}.{'.'.join(path)}"
            action_index = require_server_action_index(value, action_path)
            result.append(
                UnconditionalActionSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=action_index,
                    actionPath=path,
                    conditions=(),
                    succeedActions=(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=action_index,
                            actionPath=path,
                            serverActionIndex=action_index,
                            skillCooldownAdjustment=parse_skill_cooldown_adjustment_payload(
                                value, action_path, inherited_blackboard
                            ),
                        ),
                    ),
                    failActions=(),
                    executionFrames=execution_frames,
                )
            )
            return
        if action_type == "CreateTimedMarker":
            if id(value) in consumed_action_ids:
                return
            marker = require_dict(value.get("markerId"), f"{source_name}.{'.'.join(path)}.markerId")
            # 动态标记当前仅在命中去重等专用投影中闭环；不能伪装成固定身份标记。
            if marker.get("useBlackboardKey") is not False:
                return
            action_path = f"{source_name}.{'.'.join(path)}"
            action_index = require_server_action_index(value, action_path)
            result.append(
                UnconditionalActionSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=action_index,
                    actionPath=path,
                    conditions=(),
                    succeedActions=(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=action_index,
                            actionPath=path,
                            serverActionIndex=action_index,
                            timedMarkerApplication=parse_timed_marker_application_payload(
                                value, action_path, inherited_blackboard
                            ),
                        ),
                    ),
                    failActions=(),
                    executionFrames=execution_frames,
                )
            )
            return
        if action_type == "SetAbilityEntityDuration" and len(path) == 4:
            action_path = f"{source_name}.{'.'.join(path)}"
            action_index = require_server_action_index(value, action_path)
            result.append(
                UnconditionalActionSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=action_index,
                    actionPath=path,
                    conditions=(),
                    succeedActions=(
                        ConditionalBranchActionSource(
                            actionType=action_type,
                            actionIndex=action_index,
                            actionPath=path,
                            serverActionIndex=action_index,
                            abilityEntityDurationAssignment=(
                                parse_ability_entity_duration_assignment_payload(
                                    value, action_path, inherited_blackboard
                                )
                            ),
                        ),
                    ),
                    failActions=(),
                    executionFrames=execution_frames,
                )
            )
            return
        for key, child in value.items():
            visit(child, start_frame, end_frame, (*path, key), execution_frames)

    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        start_frame = require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        end_frame = require_non_negative_int(
            timeline.get("_endFrame"), f"{source_name}.timelineActions[{timeline_index}]._endFrame"
        )
        visit(
            timeline.get("_sequenceActionData"),
            start_frame,
            end_frame,
            (f"timelineActions[{timeline_index}]", "_sequenceActionData"),
            (),
        )
    return tuple(result)


def parse_ordered_action_sequence(
    action_data: Any,
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
    *,
    include_target_group_provenance: bool = False,
) -> tuple[ConditionalBranchActionSource, ...]:
    """解析事件回调等没有时间轴外壳的同步动作序列。

    通用解析器以时间轴中的条件节点为入口。这里仅补一个临时入口外壳，返回时剥掉外壳；
    动作顺序、守卫短路和服务端序号仍由同一套规则解析。
    """
    wrapper = {
        "actionGroupData": {
            "timelineActions": [
                {
                    "_startFrame": 0,
                    "_endFrame": 0,
                    "_sequenceActionData": {
                        "actionData": [
                            {
                                "$type": "Endaxis.Parser.IfElseAction",
                                "isEnable": True,
                                "serverActionIndex": 0,
                                "alwaysNext": False,
                                "conditionAction": {"actionData": []},
                                "succeedActions": {"actionData": action_data},
                                "failActions": {"actionData": []},
                            }
                        ]
                    },
                }
            ]
        }
    }
    parsed = parse_conditional_actions(
        wrapper,
        source_name,
        inherited_blackboard,
        include_target_group_provenance=include_target_group_provenance,
        include_ordered_timeline_jumps=True,
    )
    if not parsed:
        return ()
    if len(parsed) != 1 or parsed[0].conditions:
        raise ValueError(f"{source_name}: failed to parse ordered action sequence")
    return parsed[0].succeedActions
