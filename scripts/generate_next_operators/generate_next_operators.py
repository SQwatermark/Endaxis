"""从解包 SkillData 生成 Next 干员数据的可审计中间层。"""

from __future__ import annotations

import argparse
import json
from collections import Counter
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Iterable


SCRIPT_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = SCRIPT_DIR.parents[1]
DEFAULT_MANIFEST = SCRIPT_DIR / "operators.json"
DEFAULT_SOURCE = REPOSITORY_ROOT.parent / "vfs-index-browser" / "combat-spec" / "artifacts" / "skill-data-cdn"
DEFAULT_TABLES = (
    REPOSITORY_ROOT.parent
    / "vfs-index-browser"
    / "combat-spec"
    / "artifacts"
    / "TableCfg-1.4.4-8764515-7"
)
DEFAULT_OUTPUT = REPOSITORY_ROOT / "src" / "next" / "data" / "operators" / "generated"


@dataclass(frozen=True)
class TimelineActionSource:
    startFrame: int
    endFrame: int
    actionTypes: tuple[str, ...]


@dataclass(frozen=True)
class ScalarSource:
    value: float
    blackboardKey: str | None
    levelValues: tuple[float, ...] | None


@dataclass(frozen=True)
class SkillPatchSource:
    levels: tuple[int, ...]
    blackboard: dict[str, tuple[float, ...]]
    cooldownSeconds: tuple[float, ...]
    costTypes: tuple[int, ...]
    costValues: tuple[float, ...]


@dataclass(frozen=True)
class DamageUnitSource:
    damageType: str
    attributeType: str
    calculation: str
    attackScale: ScalarSource
    poiseValue: ScalarSource | None


@dataclass(frozen=True)
class TimedDamageSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    damageUnits: tuple[DamageUnitSource, ...]


@dataclass(frozen=True)
class AuxiliaryActionSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    actionType: str
    sourceId: str
    classification: str | None
    blackboardAssignments: dict[str, ScalarSource]
    nestedCombatActions: tuple[str, ...]


@dataclass(frozen=True)
class TimedInflictionSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    element: str
    isExtra: bool


@dataclass(frozen=True)
class TimedResourceGainSource:
    startFrame: int
    endFrame: int
    actionIndex: int
    resource: str
    amount: ScalarSource
    coefficient: ScalarSource


@dataclass(frozen=True)
class ProjectileHitSource:
    launchFrame: int
    assumedTravelFrames: int
    projectileId: str
    hitSkillId: str
    sourceFile: str
    damageUnits: tuple[DamageUnitSource, ...]
    directDamageHits: tuple[TimedDamageSource, ...]
    auxiliaryActions: tuple[AuxiliaryActionSource, ...]
    resourceGains: tuple[TimedResourceGainSource, ...]
    combatActions: tuple[str, ...]
    cycleTruncated: bool
    nestedProjectileHits: tuple["ProjectileHitSource", ...]


@dataclass(frozen=True)
class SkillSource:
    key: str
    skillType: str
    sourceFile: str
    timelineBlockFrames: int
    blockBoundarySource: str
    cooldownSeconds: float
    costFrame: int
    costType: str
    costValue: float
    offsetRecordFrame: int
    allowNextWindows: tuple[dict[str, Any], ...]
    inputCacheWindows: tuple[dict[str, Any], ...]
    timelineActions: tuple[TimelineActionSource, ...]
    directDamageHits: tuple[TimedDamageSource, ...]
    inflictions: tuple[TimedInflictionSource, ...]
    auxiliaryActions: tuple[AuxiliaryActionSource, ...]
    resourceGains: tuple[TimedResourceGainSource, ...]
    projectileHits: tuple[ProjectileHitSource, ...]
    patch: SkillPatchSource
    blackboardKeys: tuple[str, ...]
    unresolvedCombatActions: tuple[str, ...]


COMBAT_ACTION_NAMES = {
    "DamageAction",
    "CreateBuffAction",
    "DestroyBuffAction",
    "LaunchProjectile",
    "SpawnAbilityEntity",
    "AbilityEventAction",
    "BuffEventAction",
    "SpellInfliction",
    "ObtainCostAction",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--tables", type=Path, default=DEFAULT_TABLES)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--operator", action="append", dest="operators")
    parser.add_argument("--check", action="store_true", help="校验现有输出是否与重新生成结果一致")
    return parser.parse_args()


def require_dict(value: Any, path: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ValueError(f"{path}: expected object")
    return value


def require_list(value: Any, path: str) -> list[Any]:
    if not isinstance(value, list):
        raise ValueError(f"{path}: expected array")
    return value


def require_non_negative_int(value: Any, path: str) -> int:
    if not isinstance(value, int) or isinstance(value, bool) or value < 0:
        raise ValueError(f"{path}: expected non-negative integer")
    return value


def action_name(type_name: str) -> str:
    qualified = type_name.split(",", 1)[0]
    return qualified.rsplit(".", 1)[-1].split("+", 1)[0]


def walk_actions(value: Any) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        if value.get("isEnable") is False:
            return
        if isinstance(value.get("$type"), str):
            yield value
        for child in value.values():
            yield from walk_actions(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_actions(child)


def collect_blackboard_keys(value: Any) -> tuple[str, ...]:
    keys: set[str] = set()
    if isinstance(value, dict):
        if value.get("useBlackboardKey") is True:
            key = value.get("blackboardKey")
            if key:
                if not isinstance(key, str):
                    raise ValueError("non-empty blackboardKey must be a string")
                keys.add(key)
        for child in value.values():
            keys.update(collect_blackboard_keys(child))
    elif isinstance(value, list):
        for child in value:
            keys.update(collect_blackboard_keys(child))
    return tuple(sorted(keys))


def parse_scalar(
    value: Any,
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> ScalarSource:
    source = require_dict(value, path)
    raw_value = source.get("value")
    if not isinstance(raw_value, (int, float)) or isinstance(raw_value, bool):
        raise ValueError(f"{path}.value: expected number")
    use_blackboard = source.get("useBlackboardKey")
    if not isinstance(use_blackboard, bool):
        raise ValueError(f"{path}.useBlackboardKey: expected boolean")
    key = source.get("blackboardKey")
    if not isinstance(key, str):
        raise ValueError(f"{path}.blackboardKey: expected string")
    if use_blackboard and not key:
        raise ValueError(f"{path}: active scalar blackboard reference has no key")
    blackboard_key = key if use_blackboard else None
    level_values = inherited_blackboard.get(blackboard_key) if blackboard_key else None
    return ScalarSource(
        value=float(raw_value),
        blackboardKey=blackboard_key,
        levelValues=level_values,
    )


def parse_damage_units(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[DamageUnitSource, ...]:
    result: list[DamageUnitSource] = []
    for action in walk_actions(root.get("actionGroupData")):
        if action_name(action["$type"]) != "DamageAction":
            continue
        units = require_list(action.get("damageUnits"), f"{source_name}.DamageAction.damageUnits")
        for index, raw_unit in enumerate(units):
            unit = require_dict(raw_unit, f"{source_name}.DamageAction.damageUnits[{index}]")
            simple_calculation = unit.get("simpleCalculation")
            if not isinstance(simple_calculation, bool):
                raise ValueError(f"{source_name}.DamageAction.damageUnits[{index}].simpleCalculation: expected boolean")
            attack_scale_source = unit.get("atkScale")
            calculation = "standard"
            if not simple_calculation:
                raw_calculation = require_dict(
                    unit.get("atkCalculation"),
                    f"{source_name}.DamageAction.damageUnits[{index}].atkCalculation",
                )
                calculation_type = action_name(str(raw_calculation.get("$type", "")))
                calculation_types = {
                    "AtkScaleCalculation": "standard",
                    "BreakingAttackCalculation": "breakingAttack",
                }
                if calculation_type not in calculation_types:
                    raise ValueError(
                        f"{source_name}.DamageAction.damageUnits[{index}]: unsupported calculation {calculation_type}"
                    )
                calculation = calculation_types[calculation_type]
                attack_scale_source = raw_calculation.get("atkScale")
            poise_value = None
            if unit.get("damageAttributeType") == "Poise":
                poise_calculation = require_dict(
                    unit.get("poiseCalculation"),
                    f"{source_name}.DamageAction.damageUnits[{index}].poiseCalculation",
                )
                poise_value = parse_scalar(
                    poise_calculation.get("value"),
                    f"{source_name}.DamageAction.damageUnits[{index}].poiseCalculation.value",
                    inherited_blackboard,
                )
            result.append(
                DamageUnitSource(
                    damageType=str(unit.get("damageType", "")),
                    attributeType=str(unit.get("damageAttributeType", "")),
                    calculation=calculation,
                    attackScale=parse_scalar(
                        attack_scale_source,
                        f"{source_name}.DamageAction.damageUnits[{index}].atkScale",
                        inherited_blackboard,
                    ),
                    poiseValue=poise_value,
                )
            )
    return tuple(result)


def parse_direct_damage_hits(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[TimedDamageSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedDamageSource] = []
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
        actions = list(walk_actions(timeline.get("_sequenceActionData")))
        for action_index, action in enumerate(actions):
            if action_name(action["$type"]) != "DamageAction":
                continue
            action_root = {"actionGroupData": {"action": action}}
            result.append(
                TimedDamageSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=action_index,
                    damageUnits=parse_damage_units(action_root, source_name, inherited_blackboard),
                )
            )
    return tuple(result)


def classify_buff(buff_id: str) -> str | None:
    if buff_id.startswith("buff_common_damage_immune_"):
        return "incomingDamageProtection"
    if buff_id == "buff_common_power_attack_disable_cast_skill":
        return "inputLock"
    if buff_id == "buff_common_obtain_ultimate_sp":
        return "skillCostUltimateEnergyGain"
    if buff_id == "buff_chr_0004_pelica_combo_skill_tutorial_marker":
        return "tutorialMarker"
    if buff_id == "buff_common_pulse_pulse_conduct_triggered":
        return "electrificationReaction"
    return None


INFLICTION_TYPE_MAP = {
    "Fire": "heat",
    "Cryst": "cryo",
    "Pulse": "electric",
    "Natural": "nature",
}


def parse_inflictions(root: dict[str, Any], source_name: str) -> tuple[TimedInflictionSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedInflictionSource] = []
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
        for action_index, action in enumerate(walk_actions(timeline.get("_sequenceActionData"))):
            if action_name(action["$type"]) != "SpellInfliction":
                continue
            raw_type = action.get("inflictionType")
            element = INFLICTION_TYPE_MAP.get(raw_type)
            if element is None:
                raise ValueError(f"{source_name}.SpellInfliction: unsupported inflictionType {raw_type!r}")
            is_extra = action.get("isExtra")
            if not isinstance(is_extra, bool):
                raise ValueError(f"{source_name}.SpellInfliction.isExtra: expected boolean")
            result.append(
                TimedInflictionSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=action_index,
                    element=element,
                    isExtra=is_extra,
                )
            )
    return tuple(result)


def parse_buff_assignments(
    buff: dict[str, Any],
    path: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> dict[str, ScalarSource]:
    if buff.get("assignBlackboard") is not True:
        return {}
    result: dict[str, ScalarSource] = {}
    for index, raw_item in enumerate(require_list(buff.get("assignItems"), f"{path}.assignItems")):
        item = require_dict(raw_item, f"{path}.assignItems[{index}]")
        target_key = item.get("targetKey")
        if not isinstance(target_key, str) or not target_key:
            raise ValueError(f"{path}.assignItems[{index}].targetKey: expected non-empty string")
        if target_key in result:
            raise ValueError(f"{path}: duplicate assignment for {target_key}")
        direct = item.get("useDirectValue")
        if not isinstance(direct, bool):
            raise ValueError(f"{path}.assignItems[{index}].useDirectValue: expected boolean")
        numeric = item.get("numericValue")
        if not isinstance(numeric, (int, float)) or isinstance(numeric, bool):
            raise ValueError(f"{path}.assignItems[{index}].numericValue: expected number")
        if direct:
            result[target_key] = ScalarSource(float(numeric), None, None)
            continue
        input_key = item.get("inputValueKey")
        if not isinstance(input_key, str) or not input_key:
            raise ValueError(f"{path}.assignItems[{index}].inputValueKey: expected non-empty string")
        result[target_key] = ScalarSource(
            float(numeric),
            input_key,
            inherited_blackboard.get(input_key),
        )
    return result


def parse_auxiliary_actions(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[AuxiliaryActionSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[AuxiliaryActionSource] = []
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
        actions = list(walk_actions(timeline.get("_sequenceActionData")))
        for action_index, action in enumerate(actions):
            if action.get("isEnable") is False:
                continue
            name = action_name(action["$type"])
            if name == "CreateBuffAction":
                buffs = require_list(action.get("buffs"), f"{source_name}.CreateBuffAction.buffs")
                for raw_buff in buffs:
                    buff = require_dict(raw_buff, f"{source_name}.CreateBuffAction.buffs[]")
                    buff_id = buff.get("buffId")
                    if not isinstance(buff_id, str) or not buff_id:
                        raise ValueError(f"{source_name}.CreateBuffAction: expected non-empty buffId")
                    result.append(
                        AuxiliaryActionSource(
                            startFrame=start_frame,
                            endFrame=end_frame,
                            actionIndex=action_index,
                            actionType=name,
                            sourceId=buff_id,
                            classification=classify_buff(buff_id),
                            blackboardAssignments=parse_buff_assignments(
                                buff,
                                f"{source_name}.CreateBuffAction.buffs[]",
                                inherited_blackboard,
                            ),
                            nestedCombatActions=(),
                        )
                    )
            elif name == "SpawnAbilityEntity":
                ability_id = action.get("abilityEntityId")
                skill_id = action.get("abilityEntitySkillId")
                if not isinstance(ability_id, str) or not ability_id:
                    raise ValueError(f"{source_name}.SpawnAbilityEntity: expected non-empty abilityEntityId")
                if not isinstance(skill_id, str) or not skill_id:
                    raise ValueError(f"{source_name}.SpawnAbilityEntity: expected non-empty abilityEntitySkillId")
                child_name = f"{skill_id}.json"
                child_path = source_dir / child_name
                if not child_path.is_file():
                    raise FileNotFoundError(f"{source_name}: missing ability entity skill {child_path}")
                child = require_dict(json.loads(child_path.read_text(encoding="utf-8")), child_name)
                nested = tuple(
                    sorted(
                        {
                            action_name(item["$type"])
                            for item in walk_actions(child.get("actionGroupData"))
                            if action_name(item["$type"]) in COMBAT_ACTION_NAMES
                        }
                    )
                )
                result.append(
                    AuxiliaryActionSource(
                        startFrame=start_frame,
                        endFrame=end_frame,
                        actionIndex=action_index,
                        actionType=name,
                        sourceId=f"{ability_id}:{skill_id}",
                        classification="nonCombatAbilityEntity" if not nested else None,
                        blackboardAssignments={},
                        nestedCombatActions=nested,
                    )
                )
    return tuple(result)


RESOURCE_TYPE_MAP = {
    "UltimateSp": "ultimateEnergy",
    "Atb": "sp",
}


def parse_resource_gains(
    root: dict[str, Any],
    source_name: str,
    inherited_blackboard: dict[str, tuple[float, ...]],
) -> tuple[TimedResourceGainSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    result: list[TimedResourceGainSource] = []
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
        for action_index, action in enumerate(walk_actions(timeline.get("_sequenceActionData"))):
            if action_name(action["$type"]) != "ObtainCostAction" or action.get("isEnable") is False:
                continue
            raw_resource = action.get("costType")
            resource = RESOURCE_TYPE_MAP.get(raw_resource)
            if resource is None:
                raise ValueError(f"{source_name}.ObtainCostAction: unsupported costType {raw_resource!r}")
            if action.get("isPercentValue") is not False:
                raise ValueError(f"{source_name}.ObtainCostAction: percentage resource gain is not supported")
            result.append(
                TimedResourceGainSource(
                    startFrame=start_frame,
                    endFrame=end_frame,
                    actionIndex=action_index,
                    resource=resource,
                    amount=parse_scalar(
                        action.get("costValue"),
                        f"{source_name}.ObtainCostAction.costValue",
                        inherited_blackboard,
                    ),
                    coefficient=parse_scalar(
                        action.get("coefficient"),
                        f"{source_name}.ObtainCostAction.coefficient",
                        inherited_blackboard,
                    ),
                )
            )
    return tuple(result)


def resolve_projectile_hits(
    root: dict[str, Any],
    source_name: str,
    source_dir: Path,
    base_frame: int = 0,
    stack: tuple[str, ...] = (),
    inherited_blackboard: dict[str, tuple[float, ...]] | None = None,
) -> tuple[ProjectileHitSource, ...]:
    result: list[ProjectileHitSource] = []
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    for timeline_index, raw_timeline in enumerate(
        require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    ):
        timeline = require_dict(raw_timeline, f"{source_name}.timelineActions[{timeline_index}]")
        launch_frame = base_frame + require_non_negative_int(
            timeline.get("_startFrame"), f"{source_name}.timelineActions[{timeline_index}]._startFrame"
        )
        for action in walk_actions(timeline.get("_sequenceActionData")):
            if action_name(action["$type"]) != "LaunchProjectile":
                continue
            if action.get("castSkillOnHit") is not True:
                raise ValueError(f"{source_name}: projectile without castSkillOnHit is not supported")
            hit_skill_id = action.get("projectileSkillId")
            projectile_id = action.get("projectileId")
            if not isinstance(hit_skill_id, str) or not hit_skill_id:
                raise ValueError(f"{source_name}: projectileSkillId must be a non-empty string")
            if not isinstance(projectile_id, str) or not projectile_id:
                raise ValueError(f"{source_name}: projectileId must be a non-empty string")
            hit_source_name = f"{hit_skill_id}.json"
            hit_path = source_dir / hit_source_name
            if not hit_path.is_file():
                raise FileNotFoundError(f"{source_name}: missing projectile hit skill {hit_path}")
            hit_root = require_dict(json.loads(hit_path.read_text(encoding="utf-8")), hit_source_name)
            cycle_truncated = hit_skill_id in stack
            nested = (
                ()
                if cycle_truncated
                else resolve_projectile_hits(
                    hit_root,
                    hit_source_name,
                    source_dir,
                    launch_frame,
                    (*stack, hit_skill_id),
                    inherited_blackboard=inherited_blackboard,
                )
            )
            result.append(
                ProjectileHitSource(
                    launchFrame=launch_frame,
                    assumedTravelFrames=0,
                    projectileId=projectile_id,
                    hitSkillId=hit_skill_id,
                    sourceFile=hit_source_name,
                    damageUnits=parse_damage_units(
                        hit_root,
                        hit_source_name,
                        inherited_blackboard or {},
                    ),
                    directDamageHits=parse_direct_damage_hits(
                        hit_root,
                        hit_source_name,
                        inherited_blackboard or {},
                    ),
                    auxiliaryActions=parse_auxiliary_actions(
                        hit_root,
                        hit_source_name,
                        source_dir,
                        inherited_blackboard or {},
                    ),
                    resourceGains=parse_resource_gains(
                        hit_root,
                        hit_source_name,
                        inherited_blackboard or {},
                    ),
                    combatActions=tuple(
                        sorted(
                            {
                                action_name(item["$type"])
                                for item in walk_actions(hit_root.get("actionGroupData"))
                                if action_name(item["$type"]) in COMBAT_ACTION_NAMES
                            }
                        )
                    ),
                    cycleTruncated=cycle_truncated,
                    nestedProjectileHits=nested,
                )
            )
    return tuple(result)


def parse_timeline(root: dict[str, Any], source_name: str) -> tuple[TimelineActionSource, ...]:
    group = require_dict(root.get("actionGroupData"), f"{source_name}.actionGroupData")
    timeline = require_list(group.get("timelineActions"), f"{source_name}.actionGroupData.timelineActions")
    result: list[TimelineActionSource] = []
    for index, raw in enumerate(timeline):
        item = require_dict(raw, f"{source_name}.timelineActions[{index}]")
        sequence = require_dict(item.get("_sequenceActionData"), f"{source_name}.timelineActions[{index}]._sequenceActionData")
        types = tuple(action_name(action["$type"]) for action in walk_actions(sequence))
        result.append(
            TimelineActionSource(
                startFrame=require_non_negative_int(item.get("_startFrame"), f"{source_name}.timelineActions[{index}]._startFrame"),
                endFrame=require_non_negative_int(item.get("_endFrame"), f"{source_name}.timelineActions[{index}]._endFrame"),
                actionTypes=types,
            )
        )
    return tuple(result)


def collect_windows(root: dict[str, Any], source_name: str) -> tuple[tuple[dict[str, Any], ...], tuple[dict[str, Any], ...]]:
    group = require_dict(root["actionGroupData"], f"{source_name}.actionGroupData")
    allows: list[dict[str, Any]] = []
    caches: list[dict[str, Any]] = []
    for index, raw in enumerate(require_list(group["timelineActions"], f"{source_name}.timelineActions")):
        item = require_dict(raw, f"{source_name}.timelineActions[{index}]")
        start = require_non_negative_int(item["_startFrame"], f"{source_name}.timelineActions[{index}]._startFrame")
        end = require_non_negative_int(item["_endFrame"], f"{source_name}.timelineActions[{index}]._endFrame")
        for action in walk_actions(item.get("_sequenceActionData")):
            name = action_name(action["$type"])
            if name == "AllowNextSkillAction":
                allowed = require_list(action.get("allowedSkillIdList"), f"{source_name}.AllowNextSkillAction.allowedSkillIdList")
                if not all(isinstance(skill_id, str) for skill_id in allowed):
                    raise ValueError(f"{source_name}: AllowNextSkillAction contains non-string skill id")
                allows.append({"startFrame": start, "endFrame": end, "skillIds": allowed})
            elif name == "ComboCacheAction":
                mappings = require_list(action.get("mappingDataList"), f"{source_name}.ComboCacheAction.mappingDataList")
                caches.append({"startFrame": start, "endFrame": end, "mappings": mappings})
    return tuple(allows), tuple(caches)


def derive_timeline_block(exclusive_frame: int, allow_windows: tuple[dict[str, Any], ...]) -> tuple[int, str]:
    candidates = [(exclusive_frame + 1, "exclusiveFrame+1")]
    candidates.extend((window["startFrame"], "AllowNextSkillAction.startFrame") for window in allow_windows)
    frame, source = min(candidates, key=lambda candidate: candidate[0])
    return frame, source


def parse_skill_patch(raw: Any, skill_id: str) -> SkillPatchSource:
    entry = require_dict(raw, f"SkillPatchTable.{skill_id}")
    bundles = require_list(entry.get("SkillPatchDataBundle"), f"SkillPatchTable.{skill_id}.SkillPatchDataBundle")
    if not bundles:
        raise ValueError(f"SkillPatchTable.{skill_id}: expected at least one level")
    levels: list[int] = []
    blackboard_rows: list[dict[str, float]] = []
    cooldowns: list[float] = []
    cost_types: list[int] = []
    costs: list[float] = []
    for index, raw_bundle in enumerate(bundles):
        bundle = require_dict(raw_bundle, f"SkillPatchTable.{skill_id}[{index}]")
        levels.append(require_non_negative_int(bundle.get("level"), f"SkillPatchTable.{skill_id}[{index}].level"))
        row: dict[str, float] = {}
        for raw_item in require_list(bundle.get("blackboard"), f"SkillPatchTable.{skill_id}[{index}].blackboard"):
            item = require_dict(raw_item, f"SkillPatchTable.{skill_id}[{index}].blackboard[]")
            key = item.get("key")
            value = item.get("value")
            if not isinstance(key, str) or not key:
                raise ValueError(f"SkillPatchTable.{skill_id}[{index}]: invalid blackboard key")
            if not isinstance(value, (int, float)) or isinstance(value, bool):
                raise ValueError(f"SkillPatchTable.{skill_id}[{index}].blackboard.{key}: expected number")
            if key in row:
                raise ValueError(f"SkillPatchTable.{skill_id}[{index}]: duplicate blackboard key {key}")
            row[key] = float(value)
        blackboard_rows.append(row)
        cooldowns.append(float(bundle.get("coolDown", 0)))
        cost_types.append(int(bundle.get("costType", 0)))
        costs.append(float(bundle.get("costValue", 0)))
    if levels != sorted(levels) or len(set(levels)) != len(levels):
        raise ValueError(f"SkillPatchTable.{skill_id}: levels must be unique and ascending")
    all_keys = set().union(*(row.keys() for row in blackboard_rows))
    for key in all_keys:
        if any(key not in row for row in blackboard_rows):
            raise ValueError(f"SkillPatchTable.{skill_id}: blackboard key {key} is missing at some levels")
    return SkillPatchSource(
        levels=tuple(levels),
        blackboard={key: tuple(row[key] for row in blackboard_rows) for key in sorted(all_keys)},
        cooldownSeconds=tuple(cooldowns),
        costTypes=tuple(cost_types),
        costValues=tuple(costs),
    )


def parse_skill(entry: dict[str, Any], source_dir: Path, patch_table: dict[str, Any]) -> SkillSource:
    source_name = entry.get("source")
    if not isinstance(source_name, str):
        raise ValueError("skill.source: expected string")
    source_path = source_dir / source_name
    if not source_path.is_file():
        raise FileNotFoundError(source_path)
    root = require_dict(json.loads(source_path.read_text(encoding="utf-8")), source_name)
    skill_id = root.get("skillId")
    if not isinstance(skill_id, str) or not skill_id:
        raise ValueError(f"{source_name}.skillId: expected non-empty string")
    if skill_id not in patch_table:
        raise ValueError(f"SkillPatchTable: missing {skill_id}")
    patch = parse_skill_patch(patch_table[skill_id], skill_id)
    cast = require_dict(root.get("castData"), f"{source_name}.castData")
    cost = require_dict(cast.get("costData"), f"{source_name}.castData.costData")
    timeline = parse_timeline(root, source_name)
    allows, caches = collect_windows(root, source_name)
    exclusive = require_non_negative_int(root.get("exclusiveFrame"), f"{source_name}.exclusiveFrame")
    block_frame, block_source = derive_timeline_block(exclusive, allows)
    action_counts = Counter(action_type for item in timeline for action_type in item.actionTypes)
    unresolved = tuple(sorted(name for name in action_counts if name in COMBAT_ACTION_NAMES))
    return SkillSource(
        key=str(entry["key"]),
        skillType=str(entry["skillType"]),
        sourceFile=source_name,
        timelineBlockFrames=block_frame,
        blockBoundarySource=block_source,
        cooldownSeconds=float(cast.get("cooldownTime", 0)),
        costFrame=require_non_negative_int(cast.get("startCdFrame"), f"{source_name}.castData.startCdFrame"),
        costType=str(cost.get("costType", "")),
        costValue=float(cost.get("costValue", 0)),
        offsetRecordFrame=require_non_negative_int(root.get("offsetRecordFrame"), f"{source_name}.offsetRecordFrame"),
        allowNextWindows=allows,
        inputCacheWindows=caches,
        timelineActions=timeline,
        directDamageHits=parse_direct_damage_hits(root, source_name, patch.blackboard),
        inflictions=parse_inflictions(root, source_name),
        auxiliaryActions=parse_auxiliary_actions(root, source_name, source_dir, patch.blackboard),
        resourceGains=parse_resource_gains(root, source_name, patch.blackboard),
        projectileHits=resolve_projectile_hits(
            root,
            source_name,
            source_dir,
            stack=(skill_id,),
            inherited_blackboard=patch.blackboard,
        ),
        patch=patch,
        blackboardKeys=collect_blackboard_keys(root),
        unresolvedCombatActions=unresolved,
    )


def ts_literal(value: Any, indent: int = 0) -> str:
    # JSON 是 TypeScript 对当前中间层最稳定的字面量子集。
    return json.dumps(value, ensure_ascii=False, indent=2).replace("\n", "\n" + " " * indent)


def ts_inline_literal(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, str):
        return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return str(int(value)) if isinstance(value, float) and value.is_integer() else str(value)
    if isinstance(value, (list, tuple)):
        return "[" + ", ".join(ts_inline_literal(item) for item in value) + "]"
    if isinstance(value, dict):
        if not value:
            return "{}"
        return "{ " + ", ".join(f"{key}: {ts_inline_literal(item)}" for key, item in value.items()) + " }"
    raise TypeError(f"unsupported TypeScript literal: {type(value).__name__}")


def render_typescript(export_name: str, slug: str, skills: list[SkillSource]) -> str:
    payload = {"slug": slug, "skills": [asdict(skill) for skill in skills]}
    return (
        "/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */\n"
        "import type { GeneratedOperatorSource } from './generatedOperatorSource';\n\n"
        "// prettier-ignore\n"
        f"export const {export_name} = {ts_literal(payload)} as const satisfies GeneratedOperatorSource;\n"
    )


DAMAGE_TYPE_MAP = {
    "Physical": "physical",
    "Heat": "heat",
    "Cold": "cryo",
    "Pulse": "electric",
    "Nature": "nature",
}


def require_level_values(source: ScalarSource, path: str) -> tuple[float, ...]:
    if source.levelValues is None:
        raise ValueError(f"{path}: scalar has no resolved level values")
    return source.levelValues


def compact_level_values(values: tuple[float, ...]) -> float | tuple[float, ...]:
    return values[0] if all(value == values[0] for value in values) else values


def percentage_values(values: tuple[float, ...]) -> tuple[int | float, ...]:
    result: list[int | float] = []
    for value in values:
        percentage = round(value * 100, 8)
        result.append(int(percentage) if percentage.is_integer() else percentage)
    return tuple(result)


def compile_basic_attack(skill: SkillSource, config: dict[str, Any], factory_name: str) -> str:
    if skill.unresolvedCombatActions != ("LaunchProjectile",):
        raise ValueError(
            f"{skill.key}: basic attack compiler expected only LaunchProjectile, got {skill.unresolvedCombatActions}"
        )
    if not skill.projectileHits:
        raise ValueError(f"{skill.key}: basic attack has no projectile hits")
    hit_frames: list[int] = []
    attack_scale: tuple[float, ...] | None = None
    stagger: tuple[float, ...] | None = None
    damage_type: str | None = None
    for index, hit in enumerate(skill.projectileHits):
        if hit.cycleTruncated or hit.nestedProjectileHits:
            raise ValueError(f"{skill.key}.projectileHits[{index}]: recursive projectile is not supported")
        hp_units = [unit for unit in hit.damageUnits if unit.attributeType == "Hp"]
        poise_units = [unit for unit in hit.damageUnits if unit.attributeType == "Poise"]
        unknown_units = [unit for unit in hit.damageUnits if unit.attributeType not in {"Hp", "Poise"}]
        if len(hp_units) != 1 or len(poise_units) > 1 or unknown_units:
            raise ValueError(f"{skill.key}.projectileHits[{index}]: unsupported DamageUnit layout")
        hp = hp_units[0]
        mapped_type = DAMAGE_TYPE_MAP.get(hp.damageType)
        if mapped_type is None:
            raise ValueError(f"{skill.key}: unsupported damage type {hp.damageType}")
        current_scale = require_level_values(hp.attackScale, f"{skill.key}.projectileHits[{index}].attackScale")
        current_stagger = (
            require_level_values(poise_units[0].poiseValue, f"{skill.key}.projectileHits[{index}].poise")
            if poise_units and poise_units[0].poiseValue
            else None
        )
        if damage_type is not None and damage_type != mapped_type:
            raise ValueError(f"{skill.key}: projectile hits use different damage types")
        if attack_scale is not None and attack_scale != current_scale:
            raise ValueError(f"{skill.key}: projectile hits use different attack scales")
        if stagger is not None and stagger != current_stagger:
            raise ValueError(f"{skill.key}: projectile hits use different stagger values")
        damage_type = mapped_type
        attack_scale = current_scale
        stagger = current_stagger
        hit_frames.append(hit.launchFrame + hit.assumedTravelFrames)
    if damage_type is None or attack_scale is None:
        raise ValueError(f"{skill.key}: incomplete damage source")
    options: dict[str, Any] = {}
    if config.get("final") is True:
        options["final"] = True
    recovery_key = config.get("spRecoveryBlackboardKey")
    if recovery_key is not None:
        if not isinstance(recovery_key, str) or recovery_key not in skill.patch.blackboard:
            raise ValueError(f"{skill.key}: invalid spRecoveryBlackboardKey")
        options["spRecovery"] = compact_level_values(skill.patch.blackboard[recovery_key])
    if stagger is not None:
        options["stagger"] = compact_level_values(stagger)
    frames: int | list[int] = hit_frames[0] if len(hit_frames) == 1 else hit_frames
    arguments = [
        ts_inline_literal(skill.key),
        str(skill.timelineBlockFrames),
        ts_inline_literal(frames),
        f"percentages({ts_inline_literal(percentage_values(attack_scale))})",
    ]
    if options:
        arguments.append(ts_inline_literal(options))
    return "\n".join(
        [f"  {factory_name}(", *(f"    {argument}," for argument in arguments), "  ),"]
    )


def compile_direct_damage(skill: SkillSource, config: dict[str, Any]) -> str:
    if len(skill.directDamageHits) != 1:
        raise ValueError(f"{skill.key}: direct damage compiler requires exactly one non-projectile hit")
    non_presentation_projectiles = [
        hit
        for hit in skill.projectileHits
        if hit.cycleTruncated or hit.combatActions or hit.nestedProjectileHits
    ]
    if non_presentation_projectiles:
        raise ValueError(f"{skill.key}: projectile contains combat behavior and cannot be omitted")
    unclassified = [action.sourceId for action in skill.auxiliaryActions if action.classification is None]
    if unclassified:
        raise ValueError(f"{skill.key}: unclassified auxiliary actions: {unclassified}")
    expected_actions = {
        "DamageAction",
        *(action.actionType for action in skill.auxiliaryActions),
        *({"ObtainCostAction"} if skill.resourceGains else set()),
        *({"SpellInfliction"} if skill.inflictions else set()),
        *({"LaunchProjectile"} if skill.projectileHits else set()),
    }
    if set(skill.unresolvedCombatActions) != expected_actions:
        raise ValueError(f"{skill.key}: unresolved combat actions are not fully accounted for")
    hit = skill.directDamageHits[0]
    hp_units = [unit for unit in hit.damageUnits if unit.attributeType == "Hp"]
    poise_units = [unit for unit in hit.damageUnits if unit.attributeType == "Poise"]
    if len(hp_units) != 1 or len(poise_units) > 1 or len(hp_units) + len(poise_units) != len(hit.damageUnits):
        raise ValueError(f"{skill.key}: unsupported direct DamageUnit layout")
    hp = hp_units[0]
    damage_type = DAMAGE_TYPE_MAP.get(hp.damageType)
    if damage_type is None:
        raise ValueError(f"{skill.key}: unsupported damage type {hp.damageType}")
    scale = percentage_values(require_level_values(hp.attackScale, f"{skill.key}.attackScale"))
    damage_fields = [
        f"damageType: {ts_inline_literal(damage_type)}",
        f"attackScale: percentages({ts_inline_literal(scale)})",
        f"tags: {ts_inline_literal(require_list(config.get('tags'), f'{skill.key}.compile.tags'))}",
    ]
    if hp.calculation != "standard":
        damage_fields.append(f"calculation: {ts_inline_literal(hp.calculation)}")
    if poise_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{skill.key}: Poise unit has no value")
        stagger = compact_level_values(require_level_values(poise, f"{skill.key}.stagger"))
        damage_fields.append(f"stagger: {ts_inline_literal(stagger)}")
    damage_step = "\n".join(
        [
            "step('dealDamage', {",
            *(f"  {field}," for field in damage_fields),
            "})",
        ]
    )
    ordered_steps: list[tuple[float, str]] = [(hit.actionIndex, damage_step)]
    for infliction in skill.inflictions:
        if infliction.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: infliction and damage occur on different frames")
        ordered_steps.append(
            (
                infliction.actionIndex,
                "step('applyElementalInfliction', "
                f"{{ element: {ts_inline_literal(infliction.element)}, isExtra: {ts_inline_literal(infliction.isExtra)} }})",
            )
        )
    for action in skill.auxiliaryActions:
        if action.classification != "skillCostUltimateEnergyGain":
            continue
        if action.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: ultimate energy gain and damage occur on different frames")
        ordered_steps.append(
            (
                action.actionIndex,
                "step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })",
            )
        )
    for gain in skill.resourceGains:
        if gain.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: resource gain and damage occur on different frames")
        amount_values = require_level_values(gain.amount, f"{skill.key}.resourceGain.amount")
        # 原生数据中存在已启用但全等级数值均为 0 的资源动作；保留在审计层，但不生成无效果步骤。
        if all(value == 0 for value in amount_values):
            continue
        amount = compact_level_values(amount_values)
        coefficient = compact_level_values(
            gain.coefficient.levelValues
            if gain.coefficient.levelValues is not None
            else (gain.coefficient.value,)
        )
        if coefficient != 1:
            raise ValueError(f"{skill.key}: resource gain coefficient other than 1 is not supported")
        ordered_steps.append(
            (
                gain.actionIndex,
                "step('changeResource', "
                f"{{ resource: {ts_inline_literal(gain.resource)}, amount: {ts_inline_literal(amount)}, recipient: 'caster' }})",
            )
        )
    after_damage = config.get("afterDamage")
    if after_damage == "gainFinisherSp":
        ordered_steps.append(
            (hit.actionIndex + 0.5, "step('gainFinisherSp', { factor: 1, recipient: 'team' })")
        )
    elif after_damage is not None:
        raise ValueError(f"{skill.key}.compile.afterDamage: unsupported value")
    steps = [step_source for _, step_source in sorted(ordered_steps, key=lambda item: item[0])]
    rendered_steps = [
        f"          {line}{',' if index == len(lines) - 1 else ''}"
        for step_source in steps
        for lines in [step_source.splitlines()]
        for index, line in enumerate(lines)
    ]
    fields = [f"key: {ts_inline_literal(skill.key)},", f"timelineBlockFrames: {skill.timelineBlockFrames},"]
    availability = config.get("availability")
    if availability == "targetStaggered":
        fields.append("availability: { kind: 'targetStaggered', target: 'enemy' },")
    elif availability is not None:
        raise ValueError(f"{skill.key}.compile.availability: unsupported value")
    if config.get("usePatchCooldown") is True:
        frames = tuple(round(value * 30, 8) for value in skill.patch.cooldownSeconds)
        fields.append(f"cooldownFrames: {ts_inline_literal(compact_level_values(frames))},")
    cost_resource = config.get("costResource")
    if cost_resource is not None:
        cost = compact_level_values(skill.patch.costValues)
        fields.append(f"costs: [{{ resource: {ts_inline_literal(cost_resource)}, value: {ts_inline_literal(cost)} }}],")
        fields.append(f"costFrame: {skill.costFrame},")
    return "\n".join(
        [
            "  {",
            *(f"    {field}" for field in fields),
            "    scheduledSequences: [",
            "      scheduled(",
            f"        {hit.startFrame},",
            "        sequence(",
            *rendered_steps,
            "        ),",
            "      ),",
            "    ],",
            "  },",
        ]
    )


def compile_projectile_damage(skill: SkillSource, config: dict[str, Any]) -> str:
    if skill.unresolvedCombatActions != ("LaunchProjectile",):
        raise ValueError(
            f"{skill.key}: projectile damage compiler expected only root LaunchProjectile, "
            f"got {skill.unresolvedCombatActions}"
        )
    if len(skill.projectileHits) != 1:
        raise ValueError(f"{skill.key}: projectile damage compiler requires exactly one root projectile")
    hit = skill.projectileHits[0]
    if hit.cycleTruncated:
        raise ValueError(f"{skill.key}: root projectile unexpectedly truncates a cycle")
    if hit.assumedTravelFrames != 0:
        raise ValueError(f"{skill.key}: non-zero projectile travel is not supported yet")
    if len(hit.directDamageHits) != 1:
        raise ValueError(f"{skill.key}: projectile hit requires exactly one direct damage action")
    if hit.nestedProjectileHits:
        if config.get("ignoreRecursiveProjectileForSingleTarget") is not True:
            raise ValueError(
                f"{skill.key}: recursive projectile requires an explicit single-target omission declaration"
            )
        if any(
            nested.projectileId != hit.projectileId
            or nested.hitSkillId != hit.hitSkillId
            or not nested.cycleTruncated
            for nested in hit.nestedProjectileHits
        ):
            raise ValueError(f"{skill.key}: recursive projectile shape is not the expected self-cycle")

    expected_child_actions = {
        "DamageAction",
        *({"CreateBuffAction"} if hit.auxiliaryActions else set()),
        *({"ObtainCostAction"} if hit.resourceGains else set()),
        *({"LaunchProjectile"} if hit.nestedProjectileHits else set()),
    }
    if set(hit.combatActions) != expected_child_actions:
        raise ValueError(f"{skill.key}: projectile child actions are not fully accounted for")
    unclassified = [action.sourceId for action in hit.auxiliaryActions if action.classification is None]
    if unclassified:
        raise ValueError(f"{skill.key}: unclassified projectile child actions: {unclassified}")

    damage = hit.directDamageHits[0]
    hp_units = [unit for unit in damage.damageUnits if unit.attributeType == "Hp"]
    poise_units = [unit for unit in damage.damageUnits if unit.attributeType == "Poise"]
    if len(hp_units) != 1 or len(poise_units) > 1 or len(hp_units) + len(poise_units) != len(damage.damageUnits):
        raise ValueError(f"{skill.key}: unsupported projectile DamageUnit layout")
    hp = hp_units[0]
    damage_type = DAMAGE_TYPE_MAP.get(hp.damageType)
    if damage_type is None:
        raise ValueError(f"{skill.key}: unsupported damage type {hp.damageType}")
    damage_fields = [
        f"damageType: {ts_inline_literal(damage_type)}",
        f"attackScale: percentages({ts_inline_literal(percentage_values(require_level_values(hp.attackScale, f'{skill.key}.attackScale')))})",
        f"tags: {ts_inline_literal(require_list(config.get('tags'), f'{skill.key}.compile.tags'))}",
    ]
    if poise_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{skill.key}: Poise unit has no value")
        damage_fields.append(
            f"stagger: {ts_inline_literal(compact_level_values(require_level_values(poise, f'{skill.key}.stagger')))}"
        )
    damage_step = "\n".join(
        ["step('dealDamage', {", *(f"  {field}," for field in damage_fields), "})"]
    )
    ordered_steps: list[tuple[int, str]] = [(damage.actionIndex, damage_step)]
    for action in hit.auxiliaryActions:
        if action.classification == "tutorialMarker":
            continue
        if action.classification != "electrificationReaction":
            raise ValueError(f"{skill.key}: unsupported auxiliary classification {action.classification}")
        duration = action.blackboardAssignments.get("duration")
        if duration is None:
            raise ValueError(f"{skill.key}: electrification reaction has no duration assignment")
        duration_seconds = compact_level_values(
            require_level_values(duration, f"{skill.key}.electrification.duration")
        )
        ordered_steps.append(
            (
                action.actionIndex,
                "\n".join(
                    [
                        "step('applyElementalReaction', {",
                        "  reaction: 'electrification',",
                        "  target: 'enemy',",
                        f"  durationSeconds: {ts_inline_literal(duration_seconds)},",
                        "  effectiveness: 1,",
                        f"}}, {ts_inline_literal(f'{skill.key}.electrification')})",
                    ]
                ),
            )
        )
    for gain in hit.resourceGains:
        amount = compact_level_values(require_level_values(gain.amount, f"{skill.key}.resourceGain.amount"))
        if gain.coefficient.levelValues is not None or gain.coefficient.value != 1:
            raise ValueError(f"{skill.key}: non-constant resource gain coefficient is not supported")
        ordered_steps.append(
            (
                gain.actionIndex,
                "step('changeResource', "
                f"{{ resource: {ts_inline_literal(gain.resource)}, amount: {ts_inline_literal(amount)}, recipient: 'caster' }})",
            )
        )
    rendered_steps = [
        f"          {line}{',' if index == len(lines) - 1 else ''}"
        for _, step_source in sorted(ordered_steps, key=lambda item: item[0])
        for lines in [step_source.splitlines()]
        for index, line in enumerate(lines)
    ]
    cooldown_frames = tuple(round(value * 30, 8) for value in skill.patch.cooldownSeconds)
    activation = require_dict(config.get("activationWindow"), f"{skill.key}.compile.activationWindow")
    trigger_tag = activation.get("damageTag")
    duration_frames = activation.get("durationFrames")
    if not isinstance(trigger_tag, str) or not trigger_tag:
        raise ValueError(f"{skill.key}.compile.activationWindow.damageTag: expected non-empty string")
    duration_frames = require_non_negative_int(duration_frames, f"{skill.key}.compile.activationWindow.durationFrames")
    return "\n".join(
        [
            "  {",
            f"    key: {ts_inline_literal(skill.key)},",
            f"    timelineBlockFrames: {skill.timelineBlockFrames},",
            f"    cooldownFrames: {ts_inline_literal(compact_level_values(cooldown_frames))},",
            "    activationWindow: {",
            f"      durationFrames: {duration_frames},",
            "      rules: {",
            "        trigger: {",
            "          kind: 'damageTagHit',",
            f"          tag: {ts_inline_literal(trigger_tag)},",
            "          scope: 'team',",
            "        },",
            "      },",
            "    },",
            "    scheduledSequences: [",
            "      scheduled(",
            f"        {hit.launchFrame + hit.assumedTravelFrames + damage.startFrame},",
            "        sequence(",
            *rendered_steps,
            "        ),",
            "      ),",
            "    ],",
            "  },",
        ]
    )


def render_compiled_skills(operator: dict[str, Any], skills: list[SkillSource]) -> str:
    entries = require_list(operator.get("skills"), f"{operator.get('slug')}.skills")
    lines: list[str] = []
    damage_type_factories: set[str] = set()
    for entry, skill in zip(entries, skills, strict=True):
        config = entry.get("compile")
        if config is None:
            continue
        config = require_dict(config, f"{skill.key}.compile")
        kind = config.get("kind")
        if kind == "basicAttack":
            damage_types = {
                DAMAGE_TYPE_MAP[unit.damageType]
                for hit in skill.projectileHits
                for unit in hit.damageUnits
                if unit.attributeType == "Hp" and unit.damageType in DAMAGE_TYPE_MAP
            }
            if len(damage_types) != 1:
                raise ValueError(f"{skill.key}: expected exactly one supported health damage type")
            damage_type = next(iter(damage_types))
            factory_name = f"{damage_type}BasicAttack"
            damage_type_factories.add(factory_name)
            lines.append(compile_basic_attack(skill, config, factory_name))
        elif kind == "directDamage":
            lines.append(compile_direct_damage(skill, config))
        elif kind == "projectileDamage":
            lines.append(compile_projectile_damage(skill, config))
        else:
            raise ValueError(f"{skill.key}.compile.kind: unsupported compiler {kind!r}")
    export_name = f"{operator['slug']}GeneratedSkills"
    helper_imports = ", ".join(
        (*sorted(damage_type_factories), "percentages", "scheduled", "sequence", "step")
    )
    return (
        "/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */\n"
        "import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';\n"
        f"import {{ {helper_imports} }} from '../definitionHelpers';\n\n"
        "// prettier-ignore\n"
        f"export const {export_name} = [\n"
        + "\n".join(lines)
        + "\n] as const satisfies readonly SkillDefinition[];\n"
    )


def render_report(slug: str, skills: list[SkillSource]) -> str:
    report = {
        "operator": slug,
        "complete": all(not skill.unresolvedCombatActions and not skill.blackboardKeys for skill in skills),
        "skills": [
            {
                "key": skill.key,
                "sourceFile": skill.sourceFile,
                "timelineBlockFrames": skill.timelineBlockFrames,
                "blockBoundarySource": skill.blockBoundarySource,
                "directDamageHits": [asdict(hit) for hit in skill.directDamageHits],
                "auxiliaryActions": [asdict(action) for action in skill.auxiliaryActions],
                "resourceGains": [asdict(gain) for gain in skill.resourceGains],
                "projectileHits": [asdict(hit) for hit in skill.projectileHits],
                "blackboardKeys": skill.blackboardKeys,
                "unresolvedCombatActions": skill.unresolvedCombatActions,
            }
            for skill in skills
        ],
    }
    return json.dumps(report, ensure_ascii=False, indent=2) + "\n"


def write_or_check(path: Path, content: str, check: bool) -> None:
    if check:
        current = path.read_text(encoding="utf-8") if path.is_file() else None
        if current != content:
            raise RuntimeError(f"generated output is stale: {path}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")


def main() -> None:
    args = parse_args()
    manifest = require_dict(json.loads(args.manifest.read_text(encoding="utf-8")), str(args.manifest))
    patch_path = args.tables / "SkillPatchTable.json"
    patch_table = require_dict(json.loads(patch_path.read_text(encoding="utf-8")), str(patch_path))
    selected = set(args.operators or [])
    generated = 0
    for raw_operator in require_list(manifest.get("operators"), "operators"):
        operator = require_dict(raw_operator, "operators[]")
        slug = str(operator["slug"])
        if selected and slug not in selected:
            continue
        skills = [
            parse_skill(require_dict(entry, f"{slug}.skills[]"), args.source, patch_table)
            for entry in require_list(operator["skills"], f"{slug}.skills")
        ]
        write_or_check(args.output / f"{slug}.generated.ts", render_typescript(str(operator["exportName"]), slug, skills), args.check)
        write_or_check(args.output / f"{slug}.audit.json", render_report(slug, skills), args.check)
        write_or_check(args.output / f"{slug}.skills.generated.ts", render_compiled_skills(operator, skills), args.check)
        print(f"[{slug}] generated {len(skills)} skills -> {args.output}")
        generated += 1
    if selected and generated != len(selected):
        missing = selected.difference(
            str(item.get("slug")) for item in require_list(manifest.get("operators"), "operators") if isinstance(item, dict)
        )
        raise ValueError(f"unknown operators: {', '.join(sorted(missing))}")


if __name__ == "__main__":
    main()
