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
DEFAULT_OUTPUT = REPOSITORY_ROOT / "src" / "next" / "data" / "operators" / "generated"


@dataclass(frozen=True)
class TimelineActionSource:
    startFrame: int
    endFrame: int
    actionTypes: tuple[str, ...]


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
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
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


def parse_skill(entry: dict[str, Any], source_dir: Path) -> SkillSource:
    source_name = entry.get("source")
    if not isinstance(source_name, str):
        raise ValueError("skill.source: expected string")
    source_path = source_dir / source_name
    if not source_path.is_file():
        raise FileNotFoundError(source_path)
    root = require_dict(json.loads(source_path.read_text(encoding="utf-8")), source_name)
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
        blackboardKeys=collect_blackboard_keys(root),
        unresolvedCombatActions=unresolved,
    )


def ts_literal(value: Any, indent: int = 0) -> str:
    # JSON 是 TypeScript 对当前中间层最稳定的字面量子集。
    return json.dumps(value, ensure_ascii=False, indent=2).replace("\n", "\n" + " " * indent)


def render_typescript(export_name: str, slug: str, skills: list[SkillSource]) -> str:
    payload = {"slug": slug, "skills": [asdict(skill) for skill in skills]}
    return (
        "/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */\n"
        "import type { GeneratedOperatorSource } from './generatedOperatorSource';\n\n"
        "// prettier-ignore\n"
        f"export const {export_name} = {ts_literal(payload)} as const satisfies GeneratedOperatorSource;\n"
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
    selected = set(args.operators or [])
    generated = 0
    for raw_operator in require_list(manifest.get("operators"), "operators"):
        operator = require_dict(raw_operator, "operators[]")
        slug = str(operator["slug"])
        if selected and slug not in selected:
            continue
        skills = [parse_skill(require_dict(entry, f"{slug}.skills[]"), args.source) for entry in require_list(operator["skills"], f"{slug}.skills")]
        write_or_check(args.output / f"{slug}.generated.ts", render_typescript(str(operator["exportName"]), slug, skills), args.check)
        write_or_check(args.output / f"{slug}.audit.json", render_report(slug, skills), args.check)
        print(f"[{slug}] generated {len(skills)} skills -> {args.output}")
        generated += 1
    if selected and generated != len(selected):
        missing = selected.difference(
            str(item.get("slug")) for item in require_list(manifest.get("operators"), "operators") if isinstance(item, dict)
        )
        raise ValueError(f"unknown operators: {', '.join(sorted(missing))}")


if __name__ == "__main__":
    main()
