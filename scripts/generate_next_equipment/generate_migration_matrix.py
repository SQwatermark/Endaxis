"""命令行入口：从任意兼容快照生成装备迁移 IR 与 Markdown 矩阵。"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import subprocess
import tempfile

from .migration_ir import build_migration_ir
from .render_migration_matrix import render_migration_matrix
from .source_snapshot import REPOSITORY_ROOT, export_legacy_snapshot


DEFAULT_JSON = REPOSITORY_ROOT / "docs/research/equipment-generation-migration-matrix.json"
DEFAULT_MARKDOWN = REPOSITORY_ROOT / "docs/research/equipment-generation-migration-matrix.md"
PRETTIER = REPOSITORY_ROOT / "node_modules/prettier/bin/prettier.cjs"


def _write_atomic(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(f"{path.suffix}.tmp")
    temporary.write_text(content, encoding="utf-8", newline="\n")
    temporary.replace(path)


def _format_outputs(paths: list[Path]) -> None:
    if not PRETTIER.is_file():
        raise FileNotFoundError(f"缺少项目 Prettier：{PRETTIER}")
    subprocess.run(
        ["node", str(PRETTIER), "--write", *(str(path) for path in paths)],
        cwd=REPOSITORY_ROOT,
        check=True,
        stdout=subprocess.DEVNULL,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="生成旧装备 effect 的严格迁移 IR 与矩阵")
    parser.add_argument("--input", type=Path, help="兼容 schemaVersion 1 的结构化装备快照")
    parser.add_argument("--json-output", type=Path, default=DEFAULT_JSON)
    parser.add_argument("--markdown-output", type=Path, default=DEFAULT_MARKDOWN)
    args = parser.parse_args()

    with tempfile.TemporaryDirectory(prefix="endaxis-equipment-migration-") as directory:
        snapshot_path = args.input or Path(directory) / "equipment-source.json"
        if args.input is None:
            export_legacy_snapshot(snapshot_path)
        snapshot = json.loads(snapshot_path.read_text(encoding="utf-8"))
        migration_ir = build_migration_ir(snapshot)

    json_output = args.json_output.resolve()
    markdown_output = args.markdown_output.resolve()
    _write_atomic(
        json_output, json.dumps(migration_ir, ensure_ascii=False, indent=2) + "\n"
    )
    _write_atomic(markdown_output, render_migration_matrix(migration_ir))
    _format_outputs([json_output, markdown_output])
    print(f"迁移矩阵完成：{migration_ir['summary']['effectCount']} 个 effect")


if __name__ == "__main__":
    main()
