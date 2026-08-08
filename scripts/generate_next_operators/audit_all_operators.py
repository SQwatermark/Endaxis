"""审计全部当前干员入口技能经过 Next 生成器时的分层完成度。"""

from __future__ import annotations

import argparse
from collections import Counter
from dataclasses import asdict, dataclass
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
        ("condition-target-identity", ("CheckTargetsEqual", "CheckDistanceCondition")),
        ("condition-tag", ("CheckTagMatch",)),
        ("projectile-child-actions", ("projectile child combat actions",)),
        ("buff-source-or-target", ("unsupported Buff source", "unsupported Buff target")),
        ("damage-type-alias", ("unsupported damage type",)),
        ("dynamic-scalar", ("scalar has no resolved level values",)),
        ("projectile-data", ("projectile without triggered SkillData",)),
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
        )

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


def build_document(audits: list[SkillAudit]) -> dict[str, Any]:
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
    return {
        "schemaVersion": 1,
        "scope": {
            "operatorCount": len(per_operator),
            "excludedCharacterIds": sorted(OBSOLETE_CHARACTER_IDS),
            "skillCount": len(audits),
        },
        "summary": {
            "parsedCount": sum(item.stage != "source-or-parser-blocked" for item in audits),
            "compiledCount": sum(item.stage == "dsl-compiled" for item in audits),
            "completeOperatorCount": sum(item["complete"] for item in per_operator),
            "blockerKinds": dict(
                Counter(item.blockerKind for item in audits if item.blockerKind is not None)
            ),
            "unresolvedActionPresence": dict(
                Counter(action for item in audits for action in item.unresolvedActions)
            ),
        },
        "operators": per_operator,
        "skills": [asdict(item) for item in audits],
    }


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
            "首轮已补齐原生 `Fire / Cryst / Natural` 伤害枚举映射，零声明编译入口由 24 个增至 33 个。",
            "第二轮只在根技能上下文折叠 `ActionOwner/Owner`，入口进一步增至 60 个；嵌套分支仍严格拒绝。",
            "第三轮把投射物命中子技能的条件与回能投影回根时间轴，入口增至 61 个，并将 34 个原投射物",
            "阻塞细化为实际条件缺口。",
            "主控身份条件已成为覆盖面最大的后续缺口；它必须根据排轴时的主控状态选择完整分支，不能在",
            "导入 SkillData 时统一常量折叠。剩余 Buff 上下文目标和复杂投射物子行为继续严格阻塞。",
            "能力实体计数是庄方宜闭环所需能力，却不是全量覆盖率最高的第一批工作。",
            "管理员的 20 个入口源文件当前全部缺失；另外还有一项诀的子能力实体文件名不一致，二者应作为",
            "数据导出问题处理，而不是在生成器中添加回退。",
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
    document = build_document(audits)
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
