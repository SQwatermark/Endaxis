"""解析普通与终结技时间膨胀动作，供根时间轴和条件分支共用。"""

from __future__ import annotations

from typing import Any, Literal, cast

from action_payload_parser import parse_scalar
from source_models import TimedTimeDilationSource, TimeScaleCurveKeySource
from source_utils import (
    action_name,
    require_bool,
    require_dict,
    require_list,
    require_non_negative_int,
    require_number,
    require_server_action_index,
)


def parse_time_dilation_target(
    value: Any,
    path: str,
) -> Literal["caster", "enemy", "abilityEntity"]:
    """把时间膨胀目标收窄到 Endaxis 当前实际模拟的实体身份。"""
    target = require_dict(value, path)
    source = target.get("targetSource")
    if source in {"Source", "Owner"}:
        return "caster"
    if source == "Target":
        return "enemy"
    if source == "InstantSearch":
        selector = require_dict(target.get("selectorData"), f"{path}.selectorData")
        finder = require_dict(
            selector.get("finderData"),
            f"{path}.selectorData.finderData",
        )
        finder_type = str(finder.get("$type", ""))
        if (
            "+OwnerSpawnedEntityFinder+" in finder_type
            and finder.get("spawnedObjectType") == "AbilityEntity"
        ):
            return "abilityEntity"
    if source == "Context":
        return "abilityEntity"
    raise ValueError(f"{path}: unsupported time-dilation target source {source!r}")


def parse_time_scale_curve(value: Any, path: str) -> tuple[TimeScaleCurveKeySource, ...]:
    curve = require_dict(value, path)
    if (
        curve.get("preWrapMode") != "ClampForever"
        or curve.get("postWrapMode") != "ClampForever"
    ):
        raise ValueError(f"{path}: only ClampForever curves are supported")
    result: list[TimeScaleCurveKeySource] = []
    for index, raw in enumerate(require_list(curve.get("keys"), f"{path}.keys")):
        key_path = f"{path}.keys[{index}]"
        key = require_dict(raw, key_path)
        if set(key) != {
            "time",
            "value",
            "inTangent",
            "outTangent",
            "tangentMode",
            "weightedMode",
            "inWeight",
            "outWeight",
        }:
            raise ValueError(f"{key_path}: unexpected curve-key fields {sorted(key)}")
        weighted_mode = key.get("weightedMode")
        if not isinstance(weighted_mode, int) or isinstance(weighted_mode, bool):
            raise ValueError(f"{key_path}.weightedMode: expected integer")
        result.append(
            TimeScaleCurveKeySource(
                time=require_number(key.get("time"), f"{key_path}.time"),
                value=require_number(key.get("value"), f"{key_path}.value"),
                inTangent=require_number(key.get("inTangent"), f"{key_path}.inTangent"),
                outTangent=require_number(key.get("outTangent"), f"{key_path}.outTangent"),
                weightedMode=weighted_mode,
                inWeight=require_number(key.get("inWeight"), f"{key_path}.inWeight"),
                outWeight=require_number(key.get("outWeight"), f"{key_path}.outWeight"),
            )
        )
    return tuple(result)


def parse_time_dilation_action(
    action: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
    *,
    start_frame: int,
    end_frame: int,
    sequence_index: int = -1,
) -> TimedTimeDilationSource:
    """解析一个已启用的原生时间膨胀动作，不改变它所在的控制流位置。"""
    name = action_name(str(action.get("$type", "")))
    if name not in {"TimeDilationAction", "UltimateTimeAction"}:
        raise ValueError(f"{path}: expected time-dilation action, got {name!r}")
    common = {
        "$type",
        "isEnable",
        "priorityLevel",
        "priorityOffset",
        "serverActionIndex",
    }
    server_index = require_server_action_index(action, path)
    priority = require_dict(
        action.get("timeDilationPriority"),
        f"{path}.timeDilationPriority",
    ).get("tagId")
    if not isinstance(priority, int) or isinstance(priority, bool):
        raise ValueError(f"{path}.timeDilationPriority.tagId: expected integer")
    ignored = tuple(
        parse_time_dilation_target(target, f"{path}.ignoreTargets[{index}]")
        for index, target in enumerate(
            require_list(action.get("ignoreTargets"), f"{path}.ignoreTargets")
        )
    )
    omitted = sum(target == "abilityEntity" for target in ignored)
    fixed_ignored = tuple(
        cast(Literal["caster", "enemy"], target)
        for target in ignored
        if target != "abilityEntity"
    )
    if name == "UltimateTimeAction":
        expected = common | {"timeScale", "timeDilationPriority", "ignoreTargets"}
        if set(action) != expected:
            raise ValueError(
                f"{path}: unexpected UltimateTimeAction fields "
                f"{sorted(set(action) - expected)}"
            )
        return TimedTimeDilationSource(
            startFrame=start_frame,
            endFrame=end_frame,
            actionIndex=server_index,
            kind="ultimate",
            priority=priority,
            scope=None,
            slot=None,
            duration=None,
            namedCurve=None,
            inlineCurve=(),
            finishByAction=True,
            ignoredTargets=fixed_ignored,
            targets=(),
            omittedAbilityEntityTargets=omitted,
            influenceSkillCooldown=None,
            targetScale=require_number(action.get("timeScale"), f"{path}.timeScale"),
            sequenceIndex=sequence_index,
        )

    expected = common | {
        "layer",
        "slot",
        "timeDilationPriority",
        "duration",
        "useCurveKey",
        "curveKey",
        "timeScaleCurve",
        "finishByAction",
        "ignoreTargets",
        "effectTargets",
        "useTimeScaleForSkillCdTick",
        "influenceSkillCdTime",
    }
    if set(action) != expected:
        raise ValueError(
            f"{path}: unexpected TimeDilationAction fields "
            f"{sorted(set(action) - expected)}"
        )
    layer = action.get("layer")
    if layer not in {"Global", "Entity"}:
        raise ValueError(f"{path}.layer: unsupported value {layer!r}")
    slot = require_dict(action.get("slot"), f"{path}.slot").get("tagId")
    if not isinstance(slot, int) or isinstance(slot, bool):
        raise ValueError(f"{path}.slot.tagId: expected integer")
    effect_targets = tuple(
        parse_time_dilation_target(target, f"{path}.effectTargets[{index}]")
        for index, target in enumerate(
            require_list(action.get("effectTargets"), f"{path}.effectTargets")
        )
    )
    if "abilityEntity" in effect_targets:
        raise ValueError(f"{path}.effectTargets: ability entities need an explicit runtime model")
    use_curve_key = require_bool(action.get("useCurveKey"), f"{path}.useCurveKey")
    curve_key = action.get("curveKey")
    if not isinstance(curve_key, str):
        raise ValueError(f"{path}.curveKey: expected string")
    inline_curve = parse_time_scale_curve(action.get("timeScaleCurve"), f"{path}.timeScaleCurve")
    if use_curve_key == bool(inline_curve):
        raise ValueError(f"{path}: expected exactly one named or inline curve")
    influence = None
    if require_bool(
        action.get("useTimeScaleForSkillCdTick"),
        f"{path}.useTimeScaleForSkillCdTick",
    ):
        influence = parse_scalar(
            action.get("influenceSkillCdTime"),
            f"{path}.influenceSkillCdTime",
            inherited_blackboard,
        )
    return TimedTimeDilationSource(
        startFrame=start_frame,
        endFrame=end_frame,
        actionIndex=server_index,
        kind="normal",
        priority=priority,
        scope="global" if layer == "Global" else "entity",
        slot=slot,
        duration=parse_scalar(
            action.get("duration"),
            f"{path}.duration",
            inherited_blackboard,
        ),
        namedCurve=curve_key if use_curve_key else None,
        inlineCurve=inline_curve,
        finishByAction=require_bool(
            action.get("finishByAction"),
            f"{path}.finishByAction",
        ),
        ignoredTargets=fixed_ignored,
        targets=tuple(
            cast(Literal["caster", "enemy"], target)
            for target in effect_targets
        ),
        omittedAbilityEntityTargets=omitted,
        influenceSkillCooldown=influence,
        targetScale=None,
        sequenceIndex=sequence_index,
    )
