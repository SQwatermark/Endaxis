"""递归普查全干员 SkillData/BuffData 机制，并输出稳定的 JSON 与中文报告。"""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict, deque
from dataclasses import dataclass
import json
import os
from pathlib import Path
import subprocess
from typing import Any, Iterable

import audit_all_operators as generation_audit
import generate_next_operators as generator


DEFAULT_BUFF_SOURCE = generator.DEFAULT_SOURCE.parent / "buff-data-cdn"
DEFAULT_BUFF_FALLBACK = generator.DEFAULT_SOURCE.parent / "buff-data-current"
DEFAULT_JSON_OUTPUT = (
    generator.REPOSITORY_ROOT
    / "docs/research/all-operator-recursive-mechanism-audit.json"
)
DEFAULT_MARKDOWN_OUTPUT = (
    generator.REPOSITORY_ROOT
    / "docs/research/all-operator-recursive-mechanism-audit.md"
)

CONDITION_ACTIONS = {
    "CompareFloat",
    "NotNextCheckAction",
    "OrConditionAction",
    "Probablity",
    "Probability",
}
PROJECTILE_ACTIONS = {"LaunchProjectile"}
ABILITY_ENTITY_ACTIONS = {
    "OwnerSpawnedEntityFinder",
    "SetAbilityEntityDuration",
    "SpawnAbilityEntity",
}
BLACKBOARD_ACTIONS = {
    "ModifyDynamicBlackboard",
    "SimpleCalcBBAction",
}
RESOURCE_ACTIONS = {"ObtainCostAction"}
SKILL_REFERENCE_FIELDS = {
    "abilityEntitySkillId",
    "inheritSkillIdList",
    "inheritSkillIds",
    "projectileSkillId",
    "revertedSkillId",
    "skillIdOnBlock",
    "skillIdOnFinish",
    "skillIdOnReach",
    "targetSkillId",
}


@dataclass(frozen=True)
class SourceDocument:
    identity: str
    path: Path
    data: dict[str, Any]


@dataclass(frozen=True, order=True)
class MissingReference:
    operatorId: str
    sourceKind: str
    sourceId: str
    path: str
    referenceKind: str
    referenceId: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skill-source", type=Path, default=generator.DEFAULT_SOURCE)
    parser.add_argument("--buff-source", type=Path, default=DEFAULT_BUFF_SOURCE)
    parser.add_argument("--buff-fallback", type=Path, default=DEFAULT_BUFF_FALLBACK)
    parser.add_argument("--tables", type=Path, default=generator.DEFAULT_TABLES)
    parser.add_argument("--json-output", type=Path, default=DEFAULT_JSON_OUTPUT)
    parser.add_argument("--markdown-output", type=Path, default=DEFAULT_MARKDOWN_OUTPUT)
    return parser.parse_args()


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def load_table(directory: Path, name: str) -> dict[str, Any]:
    return generator.require_dict(load_json(directory / name), str(directory / name))


def load_source_index(directory: Path, identity_field: str) -> dict[str, SourceDocument]:
    result: dict[str, SourceDocument] = {}
    for path in sorted(directory.glob("*.json"), key=lambda item: item.name):
        data = generator.require_dict(load_json(path), str(path))
        identity = data.get(identity_field, path.stem)
        if not isinstance(identity, str) or not identity:
            raise ValueError(f"{path}: {identity_field} must be a non-empty string")
        if identity in result:
            raise ValueError(f"duplicate {identity_field} {identity!r}: {path}")
        result[identity] = SourceDocument(identity, path, data)
    return result


def load_source_index_with_fallback(
    primary: Path,
    fallback: Path,
    identity_field: str,
) -> dict[str, SourceDocument]:
    """主索引优先，缺文件的身份回退到完整导出；重复身份在主索引中仍报错。"""
    result = load_source_index(primary, identity_field)
    for path in sorted(fallback.glob("*.json"), key=lambda item: item.name):
        data = generator.require_dict(load_json(path), str(path))
        identity = data.get(identity_field, path.stem)
        if not isinstance(identity, str) or not identity:
            raise ValueError(f"{path}: {identity_field} must be a non-empty string")
        if identity in result:
            continue
        result[identity] = SourceDocument(identity, path, data)
    return result


def action_type(value: dict[str, Any]) -> str | None:
    type_name = value.get("$type")
    if not isinstance(type_name, str):
        return None
    return generator.action_name(type_name)


def walk_values(
    value: Any, path: str = "$", parent_field: str = ""
) -> Iterable[tuple[str, str, Any]]:
    """按源文件顺序遍历叶子；返回路径、所属字段和叶子值。"""

    if isinstance(value, dict):
        for key, child in value.items():
            child_path = f"{path}.{key}"
            if isinstance(child, (dict, list)):
                yield from walk_values(child, child_path, key)
            else:
                yield child_path, key, child
    elif isinstance(value, list):
        for index, child in enumerate(value):
            child_path = f"{path}[{index}]"
            if isinstance(child, (dict, list)):
                yield from walk_values(child, child_path, parent_field)
            else:
                yield child_path, parent_field, child


def walk_typed_objects(value: Any) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        if action_type(value) is not None:
            yield value
        for child in value.values():
            yield from walk_typed_objects(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_typed_objects(child)


def is_condition_action(name: str) -> bool:
    return name.startswith("Check") or name in CONDITION_ACTIONS


def semantic_reference_kind(field: str, value: str) -> str | None:
    lowered = field.lower()
    if value.startswith("chr_") and field in SKILL_REFERENCE_FIELDS:
        return "skill"
    if value.startswith("buff_") and ("buffid" in lowered or "buffids" in lowered):
        return "buff"
    return None


def collect_references(
    data: dict[str, Any],
    skill_index: dict[str, SourceDocument],
    buff_index: dict[str, SourceDocument],
) -> tuple[set[str], set[str], list[tuple[str, str, str]]]:
    skills: set[str] = set()
    buffs: set[str] = set()
    missing: list[tuple[str, str, str]] = []
    for path, field, value in walk_values(data):
        if not isinstance(value, str) or not value:
            continue
        # allowedSkillIdList 等字段只用于比较或输入限制，并不会执行目标技能。
        # 这里只展开具备调用、生成、替换或继承语义的明确字段。
        if value in skill_index and field in SKILL_REFERENCE_FIELDS:
            skills.add(value)
            continue
        if value in buff_index:
            buffs.add(value)
            continue
        kind = semantic_reference_kind(field, value)
        if kind is not None:
            missing.append((path, kind, value))
    return skills, buffs, missing


def count_actions(documents: Iterable[SourceDocument]) -> tuple[Counter[str], Counter[str]]:
    configured: Counter[str] = Counter()
    enabled: Counter[str] = Counter()
    for document in documents:
        for value in walk_typed_objects(document.data):
            name = action_type(value)
            # 原生 Action 由 serverActionIndex 参与同帧排序；曲线、计算器和选择器
            # 也携带 $type，但不属于 Sequence 中可独立执行的动作。
            if name is None or not isinstance(value.get("serverActionIndex"), int):
                continue
            configured[name] += 1
            if value.get("isEnable") is not False:
                enabled[name] += 1
    return configured, enabled


def count_root_actions(documents: Iterable[SourceDocument]) -> tuple[Counter[str], Counter[str]]:
    """只统计入口技能根时间线的直接动作，不把条件分支子动作提升到根层。"""

    configured: Counter[str] = Counter()
    enabled: Counter[str] = Counter()
    for document in documents:
        group = document.data.get("actionGroupData", {})
        if not isinstance(group, dict):
            continue
        timelines = group.get("timelineActions", [])
        if not isinstance(timelines, list):
            continue
        for timeline in timelines:
            if not isinstance(timeline, dict):
                continue
            sequence = timeline.get("_sequenceActionData", {})
            if not isinstance(sequence, dict):
                continue
            actions = sequence.get("actionData", [])
            if not isinstance(actions, list):
                continue
            for action in actions:
                if not isinstance(action, dict):
                    continue
                name = action_type(action)
                if name is None or not isinstance(action.get("serverActionIndex"), int):
                    continue
                configured[name] += 1
                if action.get("isEnable") is not False:
                    enabled[name] += 1
    return configured, enabled


def count_conditions(
    documents: Iterable[SourceDocument],
) -> tuple[Counter[str], Counter[str]]:
    configured: Counter[str] = Counter()
    enabled: Counter[str] = Counter()
    for document in documents:
        for value in walk_typed_objects(document.data):
            name = action_type(value)
            if name is None or not is_condition_action(name):
                continue
            configured[name] += 1
            if value.get("isEnable") is not False:
                enabled[name] += 1
    return configured, enabled


def sorted_counter(counter: Counter[str]) -> dict[str, int]:
    return {key: counter[key] for key in sorted(counter)}


def distribution(
    per_operator: dict[str, Counter[str]],
) -> list[dict[str, Any]]:
    counts: Counter[str] = Counter()
    coverage: Counter[str] = Counter()
    for counter in per_operator.values():
        counts.update(counter)
        coverage.update(counter.keys())
    return [
        {
            "type": key,
            "count": counts[key],
            "operatorCoverage": coverage[key],
        }
        for key in sorted(counts, key=lambda item: (-counts[item], item))
    ]


def counter_distribution(
    counts: Counter[str], coverage: Counter[str]
) -> list[dict[str, Any]]:
    return [
        {"type": key, "count": counts[key], "operatorCoverage": coverage[key]}
        for key in sorted(counts, key=lambda item: (-counts[item], item))
    ]


def owned_buff_ids(character_id: str, buff_index: dict[str, SourceDocument]) -> set[str]:
    prefix = f"buff_{character_id}_"
    return {buff_id for buff_id in buff_index if buff_id.startswith(prefix)}


def build_operator_closure(
    character_id: str,
    entry_skill_ids: list[str],
    skill_index: dict[str, SourceDocument],
    buff_index: dict[str, SourceDocument],
) -> tuple[set[str], set[str], list[MissingReference]]:
    skills: set[str] = set()
    buffs: set[str] = set()
    missing: set[MissingReference] = set()
    pending: deque[tuple[str, str, str]] = deque(
        ("skill", skill_id, "entry") for skill_id in entry_skill_ids
    )
    pending.extend(("buff", buff_id, "owned") for buff_id in sorted(owned_buff_ids(character_id, buff_index)))

    while pending:
        kind, identity, source = pending.popleft()
        index = skill_index if kind == "skill" else buff_index
        visited = skills if kind == "skill" else buffs
        if identity in visited:
            continue
        document = index.get(identity)
        if document is None:
            missing.add(
                MissingReference(
                    character_id,
                    source,
                    source,
                    "$",
                    kind,
                    identity,
                )
            )
            continue
        visited.add(identity)
        skill_refs, buff_refs, unresolved = collect_references(
            document.data, skill_index, buff_index
        )
        pending.extend(("skill", child, identity) for child in sorted(skill_refs - skills))
        pending.extend(("buff", child, identity) for child in sorted(buff_refs - buffs))
        for path, reference_kind, reference_id in unresolved:
            missing.add(
                MissingReference(
                    character_id,
                    kind,
                    identity,
                    path,
                    reference_kind,
                    reference_id,
                )
            )
    return skills, buffs, sorted(missing)


def buff_mechanisms(documents: Iterable[SourceDocument]) -> dict[str, Counter[str]]:
    lifecycle: Counter[str] = Counter()
    events: Counter[str] = Counter()
    event_actions: Counter[str] = Counter()
    for document in documents:
        life_type = document.data.get("lifeType")
        if isinstance(life_type, str) and life_type:
            lifecycle[life_type] += 1
        for field, event_key in (
            ("buffEventAction", "buffEvent"),
            ("abilityEventAction", "abilityEvent"),
            ("igniteEventAction", "igniteEvent"),
        ):
            raw_events = document.data.get(field, [])
            if not isinstance(raw_events, list):
                continue
            for event in raw_events:
                if not isinstance(event, dict):
                    continue
                event_name = event.get(event_key)
                if isinstance(event_name, str) and event_name:
                    events[f"{field}:{event_name}"] += 1
                for action in walk_typed_objects(event.get("actions")):
                    name = action_type(action)
                    if name is not None:
                        event_actions[name] += 1
    return {"lifecycle": lifecycle, "events": events, "eventActions": event_actions}


def build_document(
    characters: dict[str, Any],
    growth_table: dict[str, Any],
    skill_index: dict[str, SourceDocument],
    buff_index: dict[str, SourceDocument],
    entry_audits: list[generation_audit.SkillAudit],
) -> dict[str, Any]:
    entries = generation_audit.enumerate_skill_entries(characters, growth_table)
    entries_by_operator: dict[str, list[str]] = defaultdict(list)
    names: dict[str, str] = {}
    for character_id, operator_name, _group_type, skill_id in entries:
        entries_by_operator[character_id].append(skill_id)
        names[character_id] = operator_name

    audits_by_operator: dict[str, list[generation_audit.SkillAudit]] = defaultdict(list)
    for audit in entry_audits:
        audits_by_operator[audit.characterId].append(audit)

    root_configured_by_operator: dict[str, Counter[str]] = {}
    root_enabled_by_operator: dict[str, Counter[str]] = {}
    recursive_configured_by_operator: dict[str, Counter[str]] = {}
    recursive_enabled_by_operator: dict[str, Counter[str]] = {}
    recursive_configured_conditions_by_operator: dict[str, Counter[str]] = {}
    recursive_enabled_conditions_by_operator: dict[str, Counter[str]] = {}
    lifecycle_counts: Counter[str] = Counter()
    lifecycle_coverage: Counter[str] = Counter()
    event_counts: Counter[str] = Counter()
    event_coverage: Counter[str] = Counter()
    event_action_counts: Counter[str] = Counter()
    event_action_coverage: Counter[str] = Counter()
    missing_references: list[MissingReference] = []
    operators: list[dict[str, Any]] = []

    for character_id in entries_by_operator:
        entry_ids = entries_by_operator[character_id]
        closure_skills, closure_buffs, missing = build_operator_closure(
            character_id, entry_ids, skill_index, buff_index
        )
        missing_references.extend(missing)
        root_documents = [skill_index[item] for item in entry_ids if item in skill_index]
        recursive_documents = [skill_index[item] for item in sorted(closure_skills)] + [
            buff_index[item] for item in sorted(closure_buffs)
        ]
        root_configured, root_enabled = count_root_actions(root_documents)
        recursive_configured, recursive_enabled = count_actions(recursive_documents)
        root_configured_by_operator[character_id] = root_configured
        root_enabled_by_operator[character_id] = root_enabled
        recursive_configured_by_operator[character_id] = recursive_configured
        recursive_enabled_by_operator[character_id] = recursive_enabled
        recursive_configured_conditions, recursive_enabled_conditions = count_conditions(
            recursive_documents
        )
        recursive_configured_conditions_by_operator[
            character_id
        ] = recursive_configured_conditions
        recursive_enabled_conditions_by_operator[
            character_id
        ] = recursive_enabled_conditions

        mechanisms = buff_mechanisms(buff_index[item] for item in sorted(closure_buffs))
        for aggregate, coverage, counter in (
            (lifecycle_counts, lifecycle_coverage, mechanisms["lifecycle"]),
            (event_counts, event_coverage, mechanisms["events"]),
            (event_action_counts, event_action_coverage, mechanisms["eventActions"]),
        ):
            aggregate.update(counter)
            coverage.update(counter.keys())

        audits = audits_by_operator[character_id]
        operators.append(
            {
                "characterId": character_id,
                "operatorName": names[character_id],
                "administrator": character_id == "chr_9000_endmin",
                "entrySkillCount": len(entry_ids),
                "availableEntrySkillCount": sum(item in skill_index for item in entry_ids),
                "strictParsedEntryCount": sum(
                    item.stage != "source-or-parser-blocked" for item in audits
                ),
                "nextDslCompiledEntryCount": sum(
                    item.stage == "dsl-compiled" for item in audits
                ),
                "recursiveSkillCount": len(closure_skills),
                "recursiveBuffCount": len(closure_buffs),
                "missingReferenceCount": len(missing),
                "rootEnabledActionCounts": sorted_counter(root_enabled),
                "recursiveEnabledActionCounts": sorted_counter(recursive_enabled),
                "conditionCounts": sorted_counter(recursive_configured_conditions),
                "clusters": {
                    "conditions": bool(recursive_configured_conditions),
                    "buffLifecycle": bool(closure_buffs),
                    "projectile": any(recursive_enabled[name] for name in PROJECTILE_ACTIONS),
                    "abilityEntity": any(recursive_enabled[name] for name in ABILITY_ENTITY_ACTIONS),
                    "blackboard": any(recursive_enabled[name] for name in BLACKBOARD_ACTIONS),
                    "resource": any(recursive_enabled[name] for name in RESOURCE_ACTIONS),
                    "damage": recursive_enabled["DamageAction"] > 0,
                },
            }
        )

    blocker_counts: Counter[str] = Counter()
    blocker_coverage: dict[str, set[str]] = defaultdict(set)
    for audit in entry_audits:
        if audit.blockerKind is None:
            continue
        blocker_counts[audit.blockerKind] += 1
        blocker_coverage[audit.blockerKind].add(audit.characterId)

    cluster_coverage: Counter[str] = Counter()
    for operator in operators:
        cluster_coverage.update(
            key for key, enabled in operator["clusters"].items() if enabled
        )

    missing_summary: dict[tuple[str, str], dict[str, Any]] = {}
    for reference in sorted(set(missing_references)):
        key = (reference.referenceKind, reference.referenceId)
        item = missing_summary.setdefault(
            key,
            {
                "referenceKind": reference.referenceKind,
                "referenceId": reference.referenceId,
                "occurrenceCount": 0,
                "operatorIds": set(),
                "sourceIds": set(),
            },
        )
        item["occurrenceCount"] += 1
        item["operatorIds"].add(reference.operatorId)
        item["sourceIds"].add(reference.sourceId)

    serialized_missing_summary = [
        {
            "referenceKind": item["referenceKind"],
            "referenceId": item["referenceId"],
            "occurrenceCount": item["occurrenceCount"],
            "operatorCoverage": len(item["operatorIds"]),
            "operatorIds": sorted(item["operatorIds"]),
            "sourceIds": sorted(item["sourceIds"]),
        }
        for item in sorted(
            missing_summary.values(),
            key=lambda item: (
                -item["occurrenceCount"],
                item["referenceKind"],
                item["referenceId"],
            ),
        )
    ]
    administrator_missing_entries = sorted(
        {
            reference.referenceId
            for reference in missing_references
            if reference.operatorId == "chr_9000_endmin" and reference.sourceKind == "entry"
        }
    )
    arcane_missing_nested_skills = sorted(
        {
            reference.referenceId
            for reference in missing_references
            if reference.operatorId == "chr_0032_lizhiyan"
            and reference.referenceKind == "skill"
        }
    )

    return {
        "schemaVersion": 1,
        "scope": {
            "operatorCount": len(operators),
            "dataBearingOperatorCount": sum(
                operator["recursiveSkillCount"] > 0 for operator in operators
            ),
            "excludedCharacterIds": sorted(generation_audit.OBSOLETE_CHARACTER_IDS),
            "entrySkillCount": len(entries),
            "indexedSkillFileCount": len(skill_index),
            "indexedBuffFileCount": len(buff_index),
            "countingRule": {
                "root": "入口 SkillData 中直接配置的 Action",
                "recursive": "入口技能、子技能、干员前缀 Buff 及递归 Skill/Buff 引用闭包",
                "operatorCoverage": "29 名范围内含该机制的干员数；管理员缺源时不推断机制",
            },
        },
        "layers": {
            "entryAudit": {
                "strictParsedCount": sum(
                    item.stage != "source-or-parser-blocked" for item in entry_audits
                ),
                "nextDslCompiledCount": sum(
                    item.stage == "dsl-compiled" for item in entry_audits
                ),
                "blockers": [
                    {
                        "kind": key,
                        "entrySkillCount": blocker_counts[key],
                        "operatorCoverage": len(blocker_coverage[key]),
                    }
                    for key in sorted(
                        blocker_counts, key=lambda item: (-blocker_counts[item], item)
                    )
                ],
            },
            "missingReferences": [reference.__dict__ for reference in sorted(set(missing_references))],
            "missingReferenceSummary": serialized_missing_summary,
            "specialSourceCases": {
                "administratorMissingEntrySkillIds": administrator_missing_entries,
                "arcaneMissingNestedSkillIds": arcane_missing_nested_skills,
            },
        },
        "distributions": {
            "rootConfiguredActions": distribution(root_configured_by_operator),
            "rootEnabledActions": distribution(root_enabled_by_operator),
            "recursiveConfiguredActions": distribution(recursive_configured_by_operator),
            "recursiveEnabledActions": distribution(recursive_enabled_by_operator),
            "recursiveConfiguredConditions": distribution(
                recursive_configured_conditions_by_operator
            ),
            "recursiveEnabledConditions": distribution(
                recursive_enabled_conditions_by_operator
            ),
            "buffLifecycle": counter_distribution(lifecycle_counts, lifecycle_coverage),
            "buffEvents": counter_distribution(event_counts, event_coverage),
            "buffEventActions": counter_distribution(event_action_counts, event_action_coverage),
            "clusterCoverage": [
                {"cluster": key, "operatorCoverage": cluster_coverage[key]}
                for key in sorted(
                    cluster_coverage, key=lambda item: (-cluster_coverage[item], item)
                )
            ],
        },
        "operators": operators,
    }


def render_distribution(
    lines: list[str], title: str, values: list[dict[str, Any]], limit: int = 20
) -> None:
    lines.extend(["", f"## {title}", "", "| 类型 | 次数 | 干员覆盖 |", "| --- | ---: | ---: |"])
    for item in values[:limit]:
        lines.append(f"| `{item['type']}` | {item['count']} | {item['operatorCoverage']} |")


def render_markdown(document: dict[str, Any]) -> str:
    scope = document["scope"]
    entry_audit = document["layers"]["entryAudit"]
    missing = document["layers"]["missingReferences"]
    missing_summary = document["layers"]["missingReferenceSummary"]
    special_cases = document["layers"]["specialSourceCases"]
    lines = [
        "# 全干员 Skill/Buff 递归机制普查",
        "",
        "## 口径",
        "",
        "本报告由 `CharacterTable`、`CharGrowthTable.skillGroupMap`、`skill-data-cdn` 与 `buff-data-cdn` 自动生成。",
        "`chr_0002_endminm`、`chr_0003_endminf` 作为废案过滤，`chr_9000_endmin` 管理员单列。",
        "根统计只看入口 SkillData；递归统计继续展开子技能、干员前缀 Buff 以及 Skill/Buff 的实际引用。",
        "Action 同时统计配置数量和 `isEnable != false` 的启用数量；正文展示完整配置分布，JSON 同时保留启用分布。",
        "严格解析与 Next DSL 结果复用同目录入口生成审计，不能把数据源缺失、parser 不支持和运行时未支持混为一类。",
        "",
        "## 总览",
        "",
        f"- 干员：{scope['operatorCount']} 名，其中有可递归数据者 {scope['dataBearingOperatorCount']} 名。",
        f"- 入口技能：{scope['entrySkillCount']} 个；SkillData 文件 {scope['indexedSkillFileCount']} 个；BuffData 文件 {scope['indexedBuffFileCount']} 个。",
        f"- 进入严格中间层：{entry_audit['strictParsedCount']} 个。",
        f"- 当前可直接编译为通用 Next DSL：{entry_audit['nextDslCompiledCount']} 个。",
        "",
        "## 分干员覆盖",
        "",
        "| 干员 | ID | 入口 | 有源入口 | 严格解析 | DSL | 递归技能 | 递归 Buff | 缺失引用 |",
        "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ]
    for operator in document["operators"]:
        lines.append(
            f"| {operator['operatorName']} | `{operator['characterId']}` | "
            f"{operator['entrySkillCount']} | {operator['availableEntrySkillCount']} | "
            f"{operator['strictParsedEntryCount']} | {operator['nextDslCompiledEntryCount']} | "
            f"{operator['recursiveSkillCount']} | {operator['recursiveBuffCount']} | "
            f"{operator['missingReferenceCount']} |"
        )

    lines.extend(
        [
            "",
            "## 分层缺口",
            "",
            "| 入口审计类别 | 技能数 | 干员覆盖 | 层级 |",
            "| --- | ---: | ---: | --- |",
        ]
    )
    for blocker in entry_audit["blockers"]:
        kind = blocker["kind"]
        if kind == "source-data-missing":
            layer = "数据源缺失"
        elif kind.startswith("parser-"):
            layer = "严格 parser 不支持"
        else:
            layer = "Next DSL/运行时未覆盖"
        lines.append(
            f"| `{kind}` | {blocker['entrySkillCount']} | {blocker['operatorCoverage']} | {layer} |"
        )

    lines.extend(["", "### 缺失引用", ""])
    administrator_missing = special_cases["administratorMissingEntrySkillIds"]
    arcane_missing = special_cases["arcaneMissingNestedSkillIds"]
    lines.extend(
        [
            f"- 管理员：{len(administrator_missing)} 个入口技能均缺少 SkillData；这些入口仍指向已过滤的 `chr_0002/0003`。",
            "- 诀：缺少的递归技能为 "
            + (
                "、".join(f"`{item}`" for item in arcane_missing)
                if arcane_missing
                else "无"
            )
            + "。",
            "- 下表中的公共 Buff 同样属于当前 `buff-data-cdn` 不自包含，不应记为 parser 或 Next 运行时缺口。",
            "",
        ]
    )
    if missing_summary:
        lines.extend(
            [
                f"共发现 {len(missing)} 处引用，聚合为 {len(missing_summary)} 个缺失 ID。完整路径保存在 JSON。",
                "",
                "| 引用类型 | 缺失 ID | 出现次数 | 干员覆盖 | 来源数 |",
                "| --- | --- | ---: | ---: | ---: |",
            ]
        )
        for item in missing_summary:
            lines.append(
                f"| {item['referenceKind']} | `{item['referenceId']}` | "
                f"{item['occurrenceCount']} | {item['operatorCoverage']} | "
                f"{len(item['sourceIds'])} |"
            )
    else:
        lines.append("没有发现语义字段指向缺失的 Skill/Buff 文件。")

    render_distribution(
        lines, "入口技能根 Action 分布", document["distributions"]["rootConfiguredActions"]
    )
    render_distribution(
        lines,
        "递归 Skill/Buff Action 分布",
        document["distributions"]["recursiveConfiguredActions"],
        30,
    )
    render_distribution(
        lines,
        "递归条件类型",
        document["distributions"]["recursiveConfiguredConditions"],
        30,
    )
    render_distribution(
        lines, "Buff 生命周期", document["distributions"]["buffLifecycle"], 10
    )
    render_distribution(lines, "Buff 事件", document["distributions"]["buffEvents"], 30)
    render_distribution(
        lines, "Buff 事件内 Action", document["distributions"]["buffEventActions"], 30
    )

    lines.extend(
        [
            "",
            "## 共通机制簇",
            "",
            "| 机制簇 | 干员覆盖 |",
            "| --- | ---: |",
        ]
    )
    for item in document["distributions"]["clusterCoverage"]:
        lines.append(f"| `{item['cluster']}` | {item['operatorCoverage']} |")
    lines.extend(
        [
            "",
            "## 使用方式",
            "",
            "```powershell",
            "python scripts/generate_next_operators/audit_recursive_mechanisms.py",
            "```",
            "",
            "JSON 保留完整分布、逐干员明细和所有缺失引用；Markdown 只截取高频 Action，便于人工阅读。",
            "相同输入必须生成逐字节一致的两个文件。",
            "",
        ]
    )
    return "\n".join(lines)


def serialize_json(document: dict[str, Any]) -> str:
    return json.dumps(document, ensure_ascii=False, indent=2) + "\n"


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")


def format_outputs(*paths: Path) -> None:
    """使用仓库固定的 Prettier 版本，保证脚本输出与提交钩子逐字节一致。"""

    executable = generator.REPOSITORY_ROOT / "node_modules/.bin" / (
        "prettier.cmd" if os.name == "nt" else "prettier"
    )
    if not executable.is_file():
        raise FileNotFoundError(
            f"missing local Prettier executable: {executable}; run npm install first"
        )
    subprocess.run(
        [str(executable), "--write", *(str(path) for path in paths)],
        cwd=generator.REPOSITORY_ROOT,
        check=True,
        stdout=subprocess.DEVNULL,
    )


def run_audit(args: argparse.Namespace) -> dict[str, Any]:
    characters = load_table(args.tables, "CharacterTable.json")
    growth_table = load_table(args.tables, "CharGrowthTable.json")
    patch_table = load_table(args.tables, "SkillPatchTable.json")
    skill_index = load_source_index(args.skill_source, "skillId")
    buff_index = load_source_index_with_fallback(args.buff_source, args.buff_fallback, "id")
    entries = generation_audit.enumerate_skill_entries(characters, growth_table)
    entry_audits = [
        generation_audit.audit_skill(
            character_id, operator_name, group_type, skill_id, args.skill_source, patch_table
        )
        for character_id, operator_name, group_type, skill_id in entries
    ]
    return build_document(
        characters, growth_table, skill_index, buff_index, entry_audits
    )


def main() -> None:
    args = parse_args()
    document = run_audit(args)
    write(args.json_output, serialize_json(document))
    write(args.markdown_output, render_markdown(document))
    format_outputs(args.json_output, args.markdown_output)
    print(
        f"audited {document['scope']['operatorCount']} operators / "
        f"{document['scope']['entrySkillCount']} entry skills / "
        f"{document['scope']['indexedBuffFileCount']} buffs"
    )


if __name__ == "__main__":
    main()
