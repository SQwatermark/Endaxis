"""解析 attachSkill 指向的隐藏被动技能，不解释主动技能时间线。"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from source_utils import require_bool, require_dict, require_list, require_number
from source_models import SkillEventListenerSource


@dataclass(frozen=True)
class PassiveBuffAssignmentSource:
    target_key: str
    input_key: str


@dataclass(frozen=True)
class PassiveBuffApplicationSource:
    buff_id: str
    assignments: tuple[PassiveBuffAssignmentSource, ...]


@dataclass(frozen=True)
class PassiveSkillSource:
    skill_id: str
    source_file: str
    passive_type: str
    declared_blackboard_keys: tuple[str, ...]
    buffs: tuple[PassiveBuffApplicationSource, ...]
    unsupported_reasons: tuple[str, ...]
    blackboard_values: tuple[tuple[str, float], ...] = ()
    event_listeners: tuple[SkillEventListenerSource, ...] = ()
    event_buff_ids: tuple[str, ...] = ()

    @property
    def referenced_buff_ids(self) -> tuple[str, ...]:
        return tuple(
            sorted(
                {
                    *(item.buff_id for item in self.buffs),
                    *self.event_buff_ids,
                    *(
                        buff.buffId
                        for listener in self.event_listeners
                        for sequence in listener.sequences
                        for application in sequence.buffApplications
                        for buff in application.payload.buffs
                    ),
                }
            )
        )

    @property
    def can_generate_add_buff(self) -> bool:
        return (
            self.passive_type == "AddBuff"
            and bool(self.buffs)
            and not self.unsupported_reasons
        )


def parse_passive_skill(skill_id: str, source_dir: Path) -> PassiveSkillSource:
    """严格读取隐藏被动的启动载荷；不支持的行为保留为审计原因。"""
    source_file = f"{skill_id}.json"
    source_path = source_dir / source_file
    if not source_path.is_file():
        raise FileNotFoundError(source_path)
    root = require_dict(json.loads(source_path.read_text(encoding="utf-8")), source_file)
    if root.get("skillId") != skill_id:
        raise ValueError(f"{source_file}.skillId: expected {skill_id!r}")
    if root.get("castType") != "Passive":
        raise ValueError(f"{source_file}.castType: expected 'Passive'")
    passive_type = root.get("passiveSkillType")
    if not isinstance(passive_type, str) or not passive_type:
        raise ValueError(f"{source_file}.passiveSkillType: expected non-empty string")

    declared_keys: list[str] = []
    blackboard_values: list[tuple[str, float]] = []
    for index, raw_item in enumerate(require_list(root.get("blackboard"), f"{source_file}.blackboard")):
        item = require_dict(raw_item, f"{source_file}.blackboard[{index}]")
        key = item.get("key")
        if not isinstance(key, str) or not key:
            raise ValueError(f"{source_file}.blackboard[{index}].key: expected non-empty string")
        declared_keys.append(key)
        blackboard_values.append(
            (
                key,
                require_number(
                    item.get("valueDouble", 0),
                    f"{source_file}.blackboard[{index}].valueDouble",
                ),
            )
        )
    if len(set(declared_keys)) != len(declared_keys):
        raise ValueError(f"{source_file}.blackboard: duplicate key")

    buffs = tuple(
        _parse_passive_buff(raw_item, f"{source_file}.buffs[{index}]")
        for index, raw_item in enumerate(require_list(root.get("buffs"), f"{source_file}.buffs"))
    )
    reasons: list[str] = []
    if passive_type != "AddBuff":
        reasons.append(f"passive type {passive_type!r} is not supported")
    if require_list(root.get("toggleBuffs"), f"{source_file}.toggleBuffs"):
        reasons.append("toggle Buffs are not supported")
    if not buffs:
        reasons.append("passive has no startup Buff")

    declared = set(declared_keys)
    for buff in buffs:
        for assignment in buff.assignments:
            if assignment.input_key not in declared:
                reasons.append(
                    f"Buff {buff.buff_id!r} reads undeclared blackboard key {assignment.input_key!r}"
                )
    return PassiveSkillSource(
        skill_id=skill_id,
        source_file=source_file,
        passive_type=passive_type,
        declared_blackboard_keys=tuple(sorted(declared_keys)),
        buffs=buffs,
        unsupported_reasons=tuple(dict.fromkeys(reasons)),
        blackboard_values=tuple(sorted(blackboard_values)),
    )


def _parse_passive_buff(value: Any, path: str) -> PassiveBuffApplicationSource:
    item = require_dict(value, path)
    buff_id = item.get("buffId")
    if not isinstance(buff_id, str) or not buff_id:
        raise ValueError(f"{path}.buffId: expected non-empty string")
    assign_blackboard = require_bool(item.get("assignBlackboard"), f"{path}.assignBlackboard")
    assignments = require_list(item.get("assignItems"), f"{path}.assignItems")
    if not assign_blackboard and assignments:
        raise ValueError(f"{path}: assignItems require assignBlackboard")
    parsed: list[PassiveBuffAssignmentSource] = []
    for index, raw_assignment in enumerate(assignments):
        assignment_path = f"{path}.assignItems[{index}]"
        assignment = require_dict(raw_assignment, assignment_path)
        if assignment.get("useDirectValue") is not False:
            raise ValueError(f"{assignment_path}.useDirectValue: only input blackboard values are supported")
        target_key = assignment.get("targetKey")
        input_key = assignment.get("inputValueKey")
        if not isinstance(target_key, str) or not target_key:
            raise ValueError(f"{assignment_path}.targetKey: expected non-empty string")
        if not isinstance(input_key, str) or not input_key:
            raise ValueError(f"{assignment_path}.inputValueKey: expected non-empty string")
        parsed.append(PassiveBuffAssignmentSource(target_key, input_key))
    if len({item.target_key for item in parsed}) != len(parsed):
        raise ValueError(f"{path}.assignItems: duplicate target key")
    return PassiveBuffApplicationSource(buff_id, tuple(parsed))
