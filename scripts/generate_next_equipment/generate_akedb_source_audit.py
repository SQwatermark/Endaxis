"""Generate the versioned AKEDB equipment identity coverage report."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import subprocess
import tempfile

from .akedb_source_audit import build_akedb_source_audit
from .generate_migration_matrix import _write_atomic
from .source_snapshot import REPOSITORY_ROOT, export_legacy_snapshot


DEFAULT_VERSION = "1.4.4@9433094-12"
DEFAULT_TABLE_ROOT = (
    REPOSITORY_ROOT.parent
    / "vfs-index-browser"
    / "combat-spec"
    / "artifacts"
    / "TableCfg-1.4.4-9433094-12"
)
DEFAULT_JSON = REPOSITORY_ROOT / "docs/research/equipment-akedb-source-coverage.json"
DEFAULT_MARKDOWN = REPOSITORY_ROOT / "docs/research/equipment-akedb-source-coverage.md"
PRETTIER = REPOSITORY_ROOT / "node_modules/prettier/bin/prettier.cjs"


def _load(path: Path) -> object:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def _render(report: dict[str, object]) -> str:
    counts = report["sourceCounts"]
    weapons = report["weaponCoverage"]
    gears = report["gearCoverage"]
    sets = report["gearSetCoverage"]
    assert isinstance(counts, dict) and isinstance(weapons, dict)
    assert isinstance(gears, dict) and isinstance(sets, dict)

    lines = [
        "# Endaxis Next 装备 AKEDB 来源覆盖审计",
        "",
        f"数据版本：`{report['sourceVersion']}`。本报告只证明身份和 SkillPatch 引用覆盖；不把旧效果解释等同于正式战斗语义。",
        "",
        "## 结论",
        "",
        f"- 审计执行：`{report['auditStatus']}`",
        f"- 来源覆盖：`{report['coverageStatus']}`",
        f"- AKEDB 武器：{counts['akedbWeapons']}；旧迁移目录：{counts['legacyWeapons']}；已映射：{weapons['mapped']}",
        f"- AKEDB 套装：{counts['akedbGearSets']}；旧真实套装：{counts['legacyGearSets']}；已映射：{sets['mapped']}",
        f"- 旧单件装备定义：{gears['definitionCount']}；唯一 AKEDB Item 身份：{gears['mappedItemIds']}",
        f"- 非游戏套装哨兵：{counts['legacySentinels']}（不计入 AKEDB 套装总量）",
        "",
        "## 覆盖缺口",
        "",
    ]
    sections = [
        ("AKEDB 中尚无本地正式身份的武器", weapons["missingGameIds"]),
        ("无法回指 AKEDB 的旧武器 slug", weapons["unmappedLegacySlugs"]),
        ("AKEDB 中尚无本地套装映射的身份", sets["missingGameIds"]),
        ("无法回指 AKEDB 的旧套装 slug", sets["unmappedLegacySlugs"]),
    ]
    for title, values in sections:
        assert isinstance(values, list)
        lines.extend([f"### {title}", ""])
        lines.extend([f"- `{value}`" for value in values] or ["- 无"])
        lines.append("")

    duplicates = gears["duplicateItemMappings"]
    assert isinstance(duplicates, list)
    lines.extend(["### 多个旧定义共用同一 AKEDB Item 身份", ""])
    if duplicates:
        for item in duplicates:
            assert isinstance(item, dict)
            lines.append(
                f"- `{item['gameId']}`：" + "、".join(f"`{slug}`" for slug in item["slugs"])
            )
    else:
        lines.append("- 无")
    lines.extend(
        [
            "",
            "## 证据边界",
            "",
            "- `WeaponBasicTable` 证明武器身份、星级、类型和词条 SkillPatch 引用。",
            "- `ItemTable` 连接游戏 ID 与图标资源身份；少数武器的 Item ID 与图标 ID 不同，审计按显式别名和 Item 行匹配。",
            "- `EquipSuitTable` 证明真实套装身份、三件激活规则和套装 SkillPatch 引用。",
            "- 当前旧 TypeScript 快照仅用于 slug 与历史效果解释对照；正式生成仍需逐项核对 SkillPatch、SkillData、BuffData 和运行时语义。",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--table-root", type=Path, default=DEFAULT_TABLE_ROOT)
    parser.add_argument("--version", default=DEFAULT_VERSION)
    parser.add_argument("--json-output", type=Path, default=DEFAULT_JSON)
    parser.add_argument("--markdown-output", type=Path, default=DEFAULT_MARKDOWN)
    args = parser.parse_args()

    with tempfile.TemporaryDirectory(prefix="endaxis-equipment-akedb-") as directory:
        snapshot_path = Path(directory) / "legacy-equipment.json"
        export_legacy_snapshot(snapshot_path)
        report = build_akedb_source_audit(
            _load(snapshot_path),
            _load(args.table_root / "WeaponBasicTable.json"),
            _load(args.table_root / "ItemTable.json"),
            _load(args.table_root / "EquipSuitTable.json"),
            _load(args.table_root / "SkillPatchTable.json"),
            version_id=args.version,
        )

    _write_atomic(args.json_output.resolve(), json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    _write_atomic(args.markdown_output.resolve(), _render(report))
    if not PRETTIER.is_file():
        raise FileNotFoundError(f"缺少项目 Prettier：{PRETTIER}")
    subprocess.run(
        ["node", str(PRETTIER), "--write", str(args.json_output), str(args.markdown_output)],
        cwd=REPOSITORY_ROOT,
        check=True,
        stdout=subprocess.DEVNULL,
    )
    print(
        f"AKEDB 装备身份审计完成：武器 {report['weaponCoverage']['mapped']}/"
        f"{report['sourceCounts']['akedbWeapons']}，套装 {report['gearSetCoverage']['mapped']}/"
        f"{report['sourceCounts']['akedbGearSets']}"
    )


if __name__ == "__main__":
    main()
