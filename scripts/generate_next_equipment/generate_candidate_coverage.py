"""命令行入口：生成当前 Next 装备修正候选定义及覆盖报告。"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import subprocess
import tempfile

from .candidate_definition_ir import build_candidate_definition_ir
from .generate_migration_matrix import _write_atomic
from .migration_ir import build_migration_ir
from .render_candidate_coverage import render_candidate_coverage
from .source_snapshot import REPOSITORY_ROOT, export_legacy_snapshot


DEFAULT_JSON = REPOSITORY_ROOT / "docs/research/equipment-static-candidate-coverage.json"
DEFAULT_MARKDOWN = REPOSITORY_ROOT / "docs/research/equipment-static-candidate-coverage.md"
PRETTIER = REPOSITORY_ROOT / "node_modules/prettier/bin/prettier.cjs"


def main() -> None:
    parser = argparse.ArgumentParser(description="生成静态装备效果到当前 Next DSL 的严格候选定义审计")
    parser.add_argument("--input", type=Path, help="兼容 schemaVersion 1 的结构化装备快照")
    parser.add_argument("--json-output", type=Path, default=DEFAULT_JSON)
    parser.add_argument("--markdown-output", type=Path, default=DEFAULT_MARKDOWN)
    args = parser.parse_args()

    with tempfile.TemporaryDirectory(prefix="endaxis-equipment-candidates-") as directory:
        snapshot_path = args.input or Path(directory) / "equipment-source.json"
        if args.input is None:
            export_legacy_snapshot(snapshot_path)
        snapshot = json.loads(snapshot_path.read_text(encoding="utf-8"))
        report = build_candidate_definition_ir(build_migration_ir(snapshot))

    json_output = args.json_output.resolve()
    markdown_output = args.markdown_output.resolve()
    _write_atomic(json_output, json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    _write_atomic(markdown_output, render_candidate_coverage(report))
    if not PRETTIER.is_file():
        raise FileNotFoundError(f"缺少项目 Prettier：{PRETTIER}")
    subprocess.run(
        ["node", str(PRETTIER), "--write", str(json_output), str(markdown_output)],
        cwd=REPOSITORY_ROOT,
        check=True,
        stdout=subprocess.DEVNULL,
    )
    print(
        f"候选定义审计完成：{report['summary']['definitionReadyCount']} 条可映射，"
        f"{report['summary']['dslGapCount']} 条 DSL 缺口"
    )


if __name__ == "__main__":
    main()
