"""审计全部当前干员入口技能经过 Next 生成器时的分层完成度。"""

from __future__ import annotations

import argparse
from collections import Counter
from dataclasses import asdict, dataclass, fields, is_dataclass
import json
from pathlib import Path
from typing import Any

import generate_next_operators as generator


OBSOLETE_CHARACTER_IDS = {"chr_0002_endminm", "chr_0003_endminf"}
SKILL_TYPE_BY_GROUP = {
    0: "basicAttack",
    1: "battleSkill",
    2: "ultimate",
    3: "comboSkill",
}
TAGS_BY_GROUP = {
    0: ["normalAttack"],
    1: ["normalSkill"],
    2: ["ultimateSkill"],
    3: ["comboSkill"],
}


@dataclass(frozen=True)
class SkillAudit:
    characterId: str
    operatorName: str
    skillId: str
    skillType: str
    stage: str
    blockerKind: str | None
    blocker: str | None
    unresolvedActions: tuple[str, ...] = ()
    conditionCount: int = 0
    referencedBuffCount: int = 0
    projectileChildCount: int = 0
    abilityEntityCount: int = 0
    auraActionCount: int = 0
    physicalInflictionCount: int = 0
    eventListenerCount: int = 0
    eventListenerEvents: tuple[str, ...] = ()
    eventListenerActionTypes: tuple[str, ...] = ()
    entityCountConditions: tuple[generator.EntityCountConditionSource, ...] = ()


def collect_entity_count_conditions(
    root: Any,
) -> tuple[generator.EntityCountConditionSource, ...]:
    """直接从原始 SkillData 递归收集启用的实体数量检查，不受 parser 覆盖率影响。"""

    result: list[generator.EntityCountConditionSource] = []

    def visit(value: Any, path: str) -> None:
        if isinstance(value, list):
            for index, item in enumerate(value):
                visit(item, f"{path}[{index}]")
            return
        if not isinstance(value, dict):
            return
        if generator.action_name(str(value.get("$type", ""))) == "CheckEntityNum":
            if value.get("isEnable") is not False:
                target = generator.require_dict(value.get("checkTarget"), f"{path}.checkTarget")
                result.append(
                    generator.EntityCountConditionSource(
                        targetSource=str(target.get("targetSource", "")),
                        targetGroupKey=str(target.get("targetGroupKey", "")),
                        minimumCount=int(value.get("minNum")),
                        comparison=str(value.get("compareType", "")),
                        containsHittableTarget=generator.require_bool(
                            value.get("containsHittableTarget"),
                            f"{path}.containsHittableTarget",
                        ),
                        excludeDeadEntity=generator.require_bool(
                            value.get("excludeDeadEntity"), f"{path}.excludeDeadEntity"
                        ),
                        storeKey=str(value.get("storeKey", "")),
                    )
                )
        for key, child in value.items():
            visit(child, f"{path}.{key}")

    visit(root, "$")
    return tuple(result)


def count_condition_physical_inflictions(
    actions: tuple[generator.ConditionalActionSource, ...],
) -> int:
    """统计条件树中的物理异常叶子，不把嵌套节点提升为根动作。"""
    count = 0

    def visit_branches(branches: tuple[generator.ConditionalBranchActionSource, ...]) -> None:
        nonlocal count
        for branch in branches:
            if branch.physicalInfliction is not None:
                count += 1
            if branch.nestedCondition is not None:
                visit_conditions((branch.nestedCondition,))
            if branch.onceActions is not None:
                visit_branches(branch.onceActions)

    def visit_conditions(conditions: tuple[generator.ConditionalActionSource, ...]) -> None:
        for condition in conditions:
            visit_branches(condition.succeedActions)
            visit_branches(condition.failActions)

    visit_conditions(actions)
    return count


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=generator.DEFAULT_SOURCE)
    parser.add_argument("--tables", type=Path, default=generator.DEFAULT_TABLES)
    parser.add_argument(
        "--json-output",
        type=Path,
        default=generator.REPOSITORY_ROOT / "docs/research/all-operator-generation-audit.json",
    )
    parser.add_argument(
        "--markdown-output",
        type=Path,
        default=generator.REPOSITORY_ROOT / "docs/research/all-operator-generation-audit.md",
    )
    return parser.parse_args()


def load_table(directory: Path, name: str) -> dict[str, Any]:
    path = directory / name
    return generator.require_dict(json.loads(path.read_text(encoding="utf-8")), str(path))


def classify_skill(group_type: int, skill_id: str) -> tuple[str, list[str]]:
    if "power_attack" in skill_id:
        return "finisher", ["normalAttack", "powerAttack"]
    if "plunging_attack_end" in skill_id:
        return "plungingAttack", ["normalAttack", "plungingAttack"]
    return SKILL_TYPE_BY_GROUP[group_type], TAGS_BY_GROUP[group_type]


def collect_native_damage_tags(skill: generator.SkillSource) -> list[str]:
    """从完整解析结果收集原生伤害标签，包含条件分支和子技能中的伤害。"""

    result: list[str] = []

    def visit(value: Any, path: str) -> None:
        if isinstance(value, generator.DamageUnitSource):
            tags, _ = generator.decode_damage_decorate_mask(value.damageDecorateMask, path)
            for tag in tags:
                if tag not in result:
                    result.append(tag)
            return
        if isinstance(value, (tuple, list)):
            for index, item in enumerate(value):
                visit(item, f"{path}[{index}]")
            return
        if is_dataclass(value):
            for field in fields(value):
                visit(getattr(value, field.name), f"{path}.{field.name}")

    visit(skill, skill.key)
    return result


def classify_parsed_skill(
    fallback_skill_type: str,
    fallback_tags: list[str],
    skill: generator.SkillSource,
) -> tuple[str, list[str]]:
    """以技能组为兜底，并用原生伤害标签纠正强化普攻等跨组变体。"""

    native_tags = collect_native_damage_tags(skill)
    tags = list(dict.fromkeys([*fallback_tags, *native_tags]))
    if fallback_skill_type in {"finisher", "plungingAttack"}:
        return fallback_skill_type, tags
    skill_type_by_tag = (
        ("normalAttack", "basicAttack"),
        ("normalSkill", "battleSkill"),
        ("ultimateSkill", "ultimate"),
        ("comboSkill", "comboSkill"),
    )
    for tag, skill_type in skill_type_by_tag:
        if tag in native_tags:
            return skill_type, tags
    return fallback_skill_type, tags


def classify_blocker(message: str) -> str:
    checks = (
        ("source-data-missing", ("FileNotFoundError", "missing ability entity skill")),
        ("parser-channeling", ("ChannelingAction: only one trigger",)),
        ("parser-damage-calculation", ("unsupported calculation",)),
        ("parser-tick-interval", ("tickInterval: does not align",)),
        ("parser-assignment-shape", ("assignPairs: expected empty",)),
        ("condition-main-operator", ("CheckMainCharacterCondition",)),
        ("condition-entity-count", ("CheckEntityNum",)),
        (
            "condition-buff-stack",
            ("CheckBuffStackNum", "CheckBuffStackNumByTag"),
        ),
        ("condition-distance", ("CheckDistanceCondition",)),
        ("condition-target-identity", ("CheckTargetsEqual",)),
        ("condition-tag", ("CheckTagMatch",)),
        ("projectile-child-actions", ("projectile child combat actions",)),
        ("buff-source-or-target", ("unsupported Buff source", "unsupported Buff target")),
        ("damage-type-alias", ("unsupported damage type",)),
        ("dynamic-scalar", ("scalar has no resolved level values",)),
        ("projectile-data", ("projectile without triggered SkillData",)),
        ("event-listener", ("skill event listeners are not compiled",)),
        ("root-action-coverage", ("unresolved combat actions are not covered",)),
        ("conditional-leaf", ("unsupported conditional leaf",)),
        ("condition-other", ("unsupported condition type",)),
    )
    for kind, fragments in checks:
        if any(fragment in message for fragment in fragments):
            return kind
    return "other"


def sanitize_error(message: str, source: Path) -> str:
    """移除机器相关的源目录，同时保留可定位到逻辑文件的错误内容。"""

    return message.replace(str(source), "<skill-data>")


AuraActionIdentity = tuple[str, tuple[str, ...], int]


def aura_action_identities(
    actions: tuple[generator.AuraActionSource, ...],
) -> set[AuraActionIdentity]:
    return {(item.sourceFile, item.actionPath, item.actionIndex) for item in actions}


def collect_projectile_aura_actions(
    source: generator.ProjectileTriggeredSkillSource,
) -> set[AuraActionIdentity]:
    result = aura_action_identities(source.auraActions)
    result.update(collect_conditional_aura_actions(source.conditionalActions))
    for item in source.nestedProjectileTriggeredSkills:
        result.update(collect_projectile_aura_actions(item))
    for item in source.abilityEntityHits:
        result.update(collect_ability_entity_aura_actions(item))
    return result


def collect_ability_entity_aura_actions(
    source: generator.AbilityEntityHitSource,
) -> set[AuraActionIdentity]:
    result = aura_action_identities(source.auraActions)
    result.update(collect_conditional_aura_actions(source.conditionalActions))
    for item in source.projectileTriggeredSkills:
        result.update(collect_projectile_aura_actions(item))
    for item in source.nestedAbilityEntityHits:
        result.update(collect_ability_entity_aura_actions(item))
    return result


def collect_conditional_aura_actions(
    conditions: tuple[generator.ConditionalActionSource, ...],
) -> set[AuraActionIdentity]:
    """统计条件分支内保留身份的投射物和能力实体子调用。"""

    def collect_branch(
        actions: tuple[generator.ConditionalBranchActionSource, ...],
    ) -> set[AuraActionIdentity]:
        result: set[AuraActionIdentity] = set()
        for action in actions:
            for item in action.projectileTriggeredSkills or ():
                result.update(collect_projectile_aura_actions(item))
            for item in action.conditionalAbilityEntityHits or ():
                result.update(collect_ability_entity_aura_actions(item))
            if action.nestedCondition is not None:
                result.update(collect_conditional_aura_actions((action.nestedCondition,)))
            if action.onceActions is not None:
                result.update(collect_branch(action.onceActions))
        return result

    result: set[AuraActionIdentity] = set()
    for condition in conditions:
        result.update(collect_branch(condition.succeedActions))
        result.update(collect_branch(condition.failActions))
    return result


def count_skill_aura_actions(source: generator.SkillSource) -> int:
    """统计根技能及递归投射物、能力实体调用图中的区域动作。"""
    result = aura_action_identities(source.auraActions)
    result.update(collect_conditional_aura_actions(source.conditionalActions))
    for item in source.projectileTriggeredSkills:
        result.update(collect_projectile_aura_actions(item))
    for item in source.abilityEntityHits:
        result.update(collect_ability_entity_aura_actions(item))
    return len(result)


def audit_skill(
    character_id: str,
    operator_name: str,
    group_type: int,
    skill_id: str,
    source: Path,
    patch_table: dict[str, Any],
) -> SkillAudit:
    skill_type, tags = classify_skill(group_type, skill_id)
    entry = {
        "key": skill_id.removeprefix(f"{character_id}_"),
        "skillType": skill_type,
        "source": f"{skill_id}.json",
    }
    source_path = source / entry["source"]
    raw_entity_count_conditions: tuple[generator.EntityCountConditionSource, ...] = ()
    if source_path.exists():
        raw_root = generator.require_dict(
            json.loads(source_path.read_text(encoding="utf-8")), str(source_path)
        )
        raw_entity_count_conditions = collect_entity_count_conditions(raw_root)
    try:
        skill = generator.parse_skill(entry, source, patch_table)
    except Exception as error:
        message = sanitize_error(f"{type(error).__name__}: {error}", source)
        return SkillAudit(
            character_id,
            operator_name,
            skill_id,
            skill_type,
            "source-or-parser-blocked",
            classify_blocker(message),
            message,
            entityCountConditions=raw_entity_count_conditions,
        )

    skill_type, tags = classify_parsed_skill(skill_type, tags, skill)
    config = {"kind": "resolvedSequence", "tags": tags}
    operator = {
        "slug": "all-operator-audit",
        "skills": [{**entry, "compile": config}],
    }
    try:
        generator.compile_skill_entries(operator, [skill])
        stage = "dsl-compiled"
        blocker_kind = None
        blocker = None
    except Exception as first_error:
        # 横向技能动作审计不要求所有引用 Buff 已完整进入运行时；但严格证明为
        # 纯表现的 Buff 应与正式生成走同一自动投影，而不依赖逐角色 ignore 清单。
        # 仅在首次阻塞后解析当前技能的 Buff，避免改变既有技能动作覆盖口径。
        definitions, _ = generator.resolve_operator_buff_definitions_for_stage(
            (skill,),
            source.parent / "BuffData",
            "audit",
            source,
        )
        presentation_only_buff_ids = sorted(
            definition.buffId
            for definition in definitions
            if generator.is_strictly_presentation_only_buff(definition)
        )
        if presentation_only_buff_ids:
            config["ignoreBuffIds"] = presentation_only_buff_ids
        try:
            if not presentation_only_buff_ids:
                raise first_error
            generator.compile_skill_entries(operator, [skill])
            stage = "dsl-compiled"
            blocker_kind = None
            blocker = None
        except Exception as error:
            stage = "dsl-blocked"
            blocker = sanitize_error(str(error), source)
            blocker_kind = classify_blocker(blocker)

    return SkillAudit(
        character_id,
        operator_name,
        skill_id,
        skill_type,
        stage,
        blocker_kind,
        blocker,
        skill.unresolvedCombatActions,
        len(skill.conditionalActions),
        len(skill.referencedBuffIds),
        len(skill.projectileTriggeredSkills),
        len(skill.abilityEntityHits),
        count_skill_aura_actions(skill),
        len(skill.physicalInflictions)
        + count_condition_physical_inflictions(skill.conditionalActions),
        len(skill.eventListeners),
        tuple(listener.event for listener in skill.eventListeners),
        tuple(
            action_type
            for listener in skill.eventListeners
            for sequence in listener.sequences
            for action_type in sequence.orderedActionTypes
        ),
        raw_entity_count_conditions,
    )


def enumerate_skill_entries(
    characters: dict[str, Any],
    growth_table: dict[str, Any],
) -> list[tuple[str, str, int, str]]:
    result: list[tuple[str, str, int, str]] = []
    for character_id, character in characters.items():
        if character_id in OBSOLETE_CHARACTER_IDS:
            continue
        growth = generator.require_dict(
            growth_table.get(character_id), f"CharGrowthTable.{character_id}"
        )
        groups = generator.require_dict(
            growth.get("skillGroupMap"), f"CharGrowthTable.{character_id}.skillGroupMap"
        )
        operator_name = str(character.get("engName", character_id))
        for group in groups.values():
            group = generator.require_dict(group, f"{character_id}.skillGroupMap[]")
            group_type = int(group["skillGroupType"])
            for skill_id in generator.require_list(
                group.get("skillIdList"), f"{character_id}.skillIdList"
            ):
                if not isinstance(skill_id, str) or not skill_id:
                    raise ValueError(f"{character_id}: invalid skill id")
                result.append((character_id, operator_name, group_type, skill_id))
    return result


def audit_aura_source_reachability(
    source: Path,
    entry_skill_ids: set[str],
) -> dict[str, Any]:
    """区分 Aura 原始库存与从当前干员技能入口静态可达的部分。

    这里只沿 SkillData 中能够解析为另一份 SkillData ID 的字符串引用建图。
    不可达文件可能是旧版本或孤立数据，因此只作为候选记录，不能据此注入回退。
    """

    roots = {
        path.stem: generator.require_dict(
            json.loads(path.read_text(encoding="utf-8")), str(path)
        )
        for path in source.glob("*.json")
    }
    known_skill_ids = set(roots)

    def collect_references(value: Any) -> set[str]:
        if isinstance(value, str):
            return {value} if value in known_skill_ids else set()
        if isinstance(value, list):
            return set().union(*(collect_references(item) for item in value))
        if isinstance(value, dict):
            return set().union(*(collect_references(item) for item in value.values()))
        return set()

    references = {
        skill_id: collect_references(root) - {skill_id}
        for skill_id, root in roots.items()
    }
    reachable: set[str] = set()
    pending = [skill_id for skill_id in entry_skill_ids if skill_id in roots]
    while pending:
        skill_id = pending.pop()
        if skill_id in reachable:
            continue
        reachable.add(skill_id)
        pending.extend(references[skill_id] - reachable)

    aura_counts = {
        skill_id: sum(
            generator.action_name(str(action.get("$type", ""))) == "AuraAction"
            for action in generator.walk_actions(root)
        )
        for skill_id, root in roots.items()
    }
    inbound_sources: dict[str, list[str]] = {skill_id: [] for skill_id in roots}
    for source_id, targets in references.items():
        for target_id in targets:
            inbound_sources[target_id].append(f"{source_id}.json")

    return {
        "rawActionCount": sum(aura_counts.values()),
        "reachableActionCount": sum(
            aura_counts[skill_id] for skill_id in reachable
        ),
        "unreachableSources": [
            {
                "sourceFile": f"{skill_id}.json",
                "auraActionCount": aura_count,
                "directInboundSources": sorted(inbound_sources[skill_id]),
            }
            for skill_id, aura_count in sorted(aura_counts.items())
            if aura_count and skill_id not in reachable
        ],
    }


def build_document(
    audits: list[SkillAudit],
    aura_reachability: dict[str, Any] | None = None,
) -> dict[str, Any]:
    per_operator = []
    for character_id in dict.fromkeys(item.characterId for item in audits):
        skills = [item for item in audits if item.characterId == character_id]
        per_operator.append(
            {
                "characterId": character_id,
                "operatorName": skills[0].operatorName,
                "skillCount": len(skills),
                "parsedCount": sum(item.stage != "source-or-parser-blocked" for item in skills),
                "compiledCount": sum(item.stage == "dsl-compiled" for item in skills),
                "complete": all(item.stage == "dsl-compiled" for item in skills),
                "blockerKinds": dict(
                    Counter(item.blockerKind for item in skills if item.blockerKind is not None)
                ),
            }
        )
    entity_count_occurrences: Counter[generator.EntityCountConditionSource] = Counter(
        condition for item in audits for condition in item.entityCountConditions
    )
    entity_count_skills: dict[generator.EntityCountConditionSource, list[SkillAudit]] = {
        condition: [item for item in audits if condition in item.entityCountConditions]
        for condition in entity_count_occurrences
    }
    entity_count_shapes = []
    for condition, occurrence_count in entity_count_occurrences.most_common():
        skills = entity_count_skills[condition]
        entity_count_shapes.append(
            {
                **asdict(condition),
                "occurrenceCount": occurrence_count,
                "skillCount": len(skills),
                "examples": [
                    {
                        "characterId": item.characterId,
                        "skillId": item.skillId,
                    }
                    for item in skills[:3]
                ],
            }
        )

    summary = {
        "parsedCount": sum(item.stage != "source-or-parser-blocked" for item in audits),
        "compiledCount": sum(item.stage == "dsl-compiled" for item in audits),
        "completeOperatorCount": sum(item["complete"] for item in per_operator),
        "blockerKinds": dict(
            Counter(item.blockerKind for item in audits if item.blockerKind is not None)
        ),
        "unresolvedActionPresence": dict(
            Counter(action for item in audits for action in item.unresolvedActions)
        ),
        "entityCountConditionOccurrenceCount": sum(entity_count_occurrences.values()),
        "entityCountConditionShapeCount": len(entity_count_occurrences),
        "auraActionReferenceCount": sum(item.auraActionCount for item in audits),
        "physicalInflictionActionCount": sum(
            item.physicalInflictionCount for item in audits
        ),
        "skillEventListenerCount": sum(item.eventListenerCount for item in audits),
        "skillEventNames": dict(
            Counter(event for item in audits for event in item.eventListenerEvents)
        ),
        "skillEventActionTypes": dict(
            Counter(
                action_type
                for item in audits
                for action_type in item.eventListenerActionTypes
            )
        ),
    }
    if aura_reachability is not None:
        summary.update(
            {
                "rawAuraActionCount": aura_reachability["rawActionCount"],
                "reachableAuraActionCount": aura_reachability["reachableActionCount"],
            }
        )

    document = {
        "schemaVersion": 1,
        "scope": {
            "operatorCount": len(per_operator),
            "excludedCharacterIds": sorted(OBSOLETE_CHARACTER_IDS),
            "skillCount": len(audits),
        },
        "summary": summary,
        "entityCountConditionShapes": entity_count_shapes,
        "operators": per_operator,
        "skills": [
            {
                key: value
                for key, value in asdict(item).items()
                if key != "entityCountConditions"
            }
            for item in audits
        ],
    }
    if aura_reachability is not None:
        document["auraReachability"] = aura_reachability
    return document


def render_markdown(document: dict[str, Any]) -> str:
    scope = document["scope"]
    summary = document["summary"]
    lines = [
        "# 全干员 Next 生成可行性普查",
        "",
        "## 口径",
        "",
        "本报告从 `CharacterTable` 与 `CharGrowthTable.skillGroupMap` 自动发现当前干员及技能入口。",
        "`chr_0002_endminm`、`chr_0003_endminf` 作为废案角色过滤；管理员以 `chr_9000_endmin` 单列。",
        "统计分为源数据/严格解析和通用 DSL 编译两层；编译成功尚不代表依赖 Buff 已完整进入运行时。",
        "",
        "## 总览",
        "",
        f"- 干员：{scope['operatorCount']} 名。",
        f"- 技能入口：{scope['skillCount']} 个。",
        f"- 进入严格中间层：{summary['parsedCount']} 个。",
        f"- 无角色专用声明即可进入通用 DSL：{summary['compiledCount']} 个。",
        f"- 当前整名干员完整直转：{summary['completeOperatorCount']} 名。",
        f"- 当前技能入口调用图中已结构化的区域持续动作引用：{summary['auraActionReferenceCount']} 个。",
        f"- 当前技能入口中已结构化的事件监听器：{summary['skillEventListenerCount']} 个。",
        "",
        "这里的“完整直转”采用保守口径：不添加逐技能忽略项、固定单敌人折叠声明或角色专用配置。",
        "佩丽卡等已有正式样本能够在显式声明后完整生成，不与该统计矛盾。",
        "",
        "## 分干员结果",
        "",
        "| 干员 | 角色 ID | 入口 | 已解析 | 已编译 | 完整直转 |",
        "| --- | --- | ---: | ---: | ---: | --- |",
    ]
    for operator in document["operators"]:
        lines.append(
            f"| {operator['operatorName']} | `{operator['characterId']}` | "
            f"{operator['skillCount']} | {operator['parsedCount']} | "
            f"{operator['compiledCount']} | {'是' if operator['complete'] else '否'} |"
        )
    lines.extend(
        [
            "",
            "## 共通阻塞簇",
            "",
            "下表按被阻塞技能入口数排序。一个技能只记录首次令严格转换停止的原因，因此数字用于排优先级，",
            "不等于该机制在原始数据中的完整出现次数。",
            "",
            "| 阻塞类别 | 技能数 |",
            "| --- | ---: |",
        ]
    )
    for kind, count in sorted(
        summary["blockerKinds"].items(), key=lambda item: (-item[1], item[0])
    ):
        lines.append(f"| `{kind}` | {count} |")
    lines.extend(
        [
            "",
            "## 技能事件监听器",
            "",
            "监听器只统计已进入严格中间层的技能入口。事件内动作保留原生顺序，",
            "在事件分发和条件链闭环前不会被提升为无条件时间轴步骤。",
            "",
            "| 事件 | 监听器数 |",
            "| --- | ---: |",
        ]
    )
    for event, count in sorted(
        summary["skillEventNames"].items(), key=lambda item: (-item[1], item[0])
    ):
        lines.append(f"| `{event}` | {count} |")
    lines.extend(["", "监听器动作类型："])
    for action_type, count in sorted(
        summary["skillEventActionTypes"].items(),
        key=lambda item: (-item[1], item[0]),
    ):
        lines.append(f"- `{action_type}`：{count} 次。")
    if "auraReachability" in document:
        unreachable = document["auraReachability"]["unreachableSources"]
        lines.extend(
            [
                "",
                "## Aura 原始库存与入口可达性",
                "",
                f"- SkillData 原始 Aura 动作：{summary['rawAuraActionCount']} 个。",
                f"- 从当前干员技能入口静态可达：{summary['reachableAuraActionCount']} 个。",
                f"- 当前入口调用图中的结构化引用：{summary['auraActionReferenceCount']} 个。",
                "",
                "可达性只沿 SkillData 中指向另一份 SkillData 的字符串引用计算。",
                "静态不可达文件可能是旧变体或孤立数据，不计为 parser 缺口，也不能据此注入回退。",
                "引用数统计调用图身份；若同一原始动作被多个入口引用，它不必等于唯一动作库存。",
                "",
                "| 静态不可达源文件 | Aura 动作 | 直接入边来源 |",
                "| --- | ---: | --- |",
            ]
        )
        for item in unreachable:
            inbound = "<br>".join(
                f"`{source}`" for source in item["directInboundSources"]
            ) or "无"
            lines.append(
                f"| `{item['sourceFile']}` | {item['auraActionCount']} | {inbound} |"
            )
    lines.extend(
        [
            "",
            "首轮已补齐原生 `Fire / Cryst / Natural` 伤害枚举映射，零声明编译入口由 24 个增至 33 个。",
            "第二轮只在根技能上下文折叠 `ActionOwner/Owner`，入口进一步增至 60 个；嵌套分支仍严格拒绝。",
            "第三轮把投射物命中子技能的条件与回能投影回根时间轴，入口增至 61 个，并将 34 个原投射物",
            "阻塞细化为实际条件缺口。",
            "第四轮把原生 Owner/Source 主控检查编译为运行时 `casterControlled` 条件，入口增至 106 个；",
            "条件在动作帧查询主控身份，不能在导入 SkillData 时统一常量折叠。直接位于 SequenceAction",
            "中的条件仍需保留序列短路边界。第五轮依据 TargetSource.Target 直接读取技能输入目标的原生语义，",
            "将其在固定单敌人、技能必有输入目标的模型下归约，入口增至 126 个；Context 命名目标组仍需先完成",
            "生产者数据流分析。剩余实体数量、Buff 上下文目标和复杂投射物子行为继续严格阻塞。",
            "近期补齐的 `CheckHp` 会在动作帧读取当前生命账本，不能在生成时读取面板快照；目前只编译",
            "可归约为施法者或唯一敌人的目标引用。原生 `TargetSource.Target` 直接读取动作输入目标并忽略",
            "命名目标组；`Context` 则沿动作顺序查找最近且支配读取点的目标组写入，只有主目标或无额外",
            "校验/后处理的敌方存活 HitBox 查找才归约为唯一敌人。队友、召唤实体和合并目标继续阻塞。",
            "Buff 层数与黑板读取的 ID/Tag 查询类型和目标身份彼此独立，统一在目标解析后查询对应容器。",
            "引导动作已按原生 float32 计时、全局扫描和逐目标冷却语义投影到统一时间轴，相关 parser",
            "阻塞已经清零；根技能中目标身份可证明的引导动作拆成同帧一次性动作供所有解析器复用。",
            "能力实体计数是庄方宜闭环所需能力，却不是全量覆盖率最高的第一批工作。",
            "管理员的 20 个入口源文件当前全部缺失；另外还有一项诀的子能力实体文件名不一致，二者应作为",
            "数据导出问题处理，而不是在生成器中添加回退。",
            "",
            "## 实体数量条件形状",
            "",
            f"现有原始技能文件中共有 {summary['entityCountConditionOccurrenceCount']} 次启用的实体数量检查，",
            f"按完整参数区分为 {summary['entityCountConditionShapeCount']} 种形状。",
            "该统计直接递归读取 SkillData，不受当前 parser 是否能走到相应条件的影响。",
            "这些条件既包括命中目标是否存在，也包括能力实体、可命中目标和多目标数量；不能仅凭动作名统一折叠。",
            "",
            "| 来源 | 上下文键 | 比较 | 可命中目标 | 排除死亡 | 写入键 | 次数 | 技能数 | 示例 |",
            "| --- | --- | --- | --- | --- | --- | ---: | ---: | --- |",
        ]
    )
    for shape in document["entityCountConditionShapes"]:
        examples = "<br>".join(f"`{item['skillId']}`" for item in shape["examples"])
        lines.append(
            f"| `{shape['targetSource']}` | `{shape['targetGroupKey'] or '(空)'}` | "
            f"`{shape['comparison']} {shape['minimumCount']}` | "
            f"{'是' if shape['containsHittableTarget'] else '否'} | "
            f"{'是' if shape['excludeDeadEntity'] else '否'} | "
            f"`{shape['storeKey'] or '(空)'}` | {shape['occurrenceCount']} | "
            f"{shape['skillCount']} | {examples} |"
        )
    lines.extend(
        [
            "",
            "## 根动作覆盖面",
            "",
            "| 动作 | 涉及技能数 |",
            "| --- | ---: |",
        ]
    )
    for action, count in sorted(
        summary["unresolvedActionPresence"].items(), key=lambda item: (-item[1], item[0])
    ):
        lines.append(f"| `{action}` | {count} |")
    lines.extend(
        [
            "",
            "## 使用方式",
            "",
            "```powershell",
            "python scripts/generate_next_operators/audit_all_operators.py",
            "```",
            "",
            "逐技能明细及原始错误保存在相邻 JSON 文件中。每次扩展 parser、DSL 或运行时后应重新生成，",
            "以确认覆盖率确实提升，并避免只针对当前验收干员优化。",
            "",
        ]
    )
    return "\n".join(lines)


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")


def main() -> None:
    args = parse_args()
    characters = load_table(args.tables, "CharacterTable.json")
    growth_table = load_table(args.tables, "CharGrowthTable.json")
    patch_table = load_table(args.tables, "SkillPatchTable.json")
    entries = enumerate_skill_entries(characters, growth_table)
    audits = [
        audit_skill(character_id, name, group_type, skill_id, args.source, patch_table)
        for character_id, name, group_type, skill_id in entries
    ]
    aura_reachability = audit_aura_source_reachability(
        args.source,
        {skill_id for _, _, _, skill_id in entries},
    )
    document = build_document(audits, aura_reachability)
    write(args.json_output, json.dumps(document, ensure_ascii=False, indent=2) + "\n")
    write(args.markdown_output, render_markdown(document))
    print(
        f"audited {document['scope']['operatorCount']} operators / "
        f"{document['scope']['skillCount']} skills: "
        f"parsed={document['summary']['parsedCount']}, "
        f"compiled={document['summary']['compiledCount']}"
    )


if __name__ == "__main__":
    main()
