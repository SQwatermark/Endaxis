"""命令行入口：导出旧装备结构，严格审计后原子写入 JSON 与 Markdown。"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import subprocess
import tempfile

from .equipment_audit import audit_snapshot
from .render_audit import render_markdown
from .source_snapshot import export_legacy_snapshot


SCRIPT_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = SCRIPT_DIR.parent.parent
DEFAULT_JSON = REPOSITORY_ROOT / "tmp/equipment-generation-audit.json"
DEFAULT_MARKDOWN = REPOSITORY_ROOT / "docs/research/equipment-generation-audit.md"
PRETTIER = REPOSITORY_ROOT / "node_modules/prettier/bin/prettier.cjs"


def _write_atomic(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(f"{path.suffix}.tmp")
    temporary.write_text(content, encoding="utf-8", newline="\n")
    temporary.replace(path)


def _format_outputs(paths: list[Path]) -> None:
    """生成物必须可重复通过仓库格式检查，避免报告更新夹带排版噪声。"""
    if not PRETTIER.is_file():
        raise FileNotFoundError(f"缺少项目 Prettier：{PRETTIER}")
    subprocess.run(
        ["node", str(PRETTIER), "--write", *(str(path) for path in paths)],
        cwd=REPOSITORY_ROOT,
        check=True,
        stdout=subprocess.DEVNULL,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="严格审计旧武器、装备和套装数据")
    parser.add_argument("--input", type=Path, help="复用已有结构化快照，主要用于调试")
    parser.add_argument("--json-output", type=Path, default=DEFAULT_JSON)
    parser.add_argument("--markdown-output", type=Path, default=DEFAULT_MARKDOWN)
    args = parser.parse_args()

    with tempfile.TemporaryDirectory(prefix="endaxis-equipment-audit-") as directory:
        snapshot_path = args.input or Path(directory) / "legacy-equipment.json"
        if args.input is None:
            export_legacy_snapshot(snapshot_path)
        snapshot = json.loads(snapshot_path.read_text(encoding="utf-8"))
        report = audit_snapshot(snapshot)

    json_text = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    markdown_text = render_markdown(report)
    json_output = args.json_output.resolve()
    markdown_output = args.markdown_output.resolve()
    _write_atomic(json_output, json_text)
    _write_atomic(markdown_output, markdown_text)
    _format_outputs([json_output, markdown_output])
    print(
        f"审计完成：{sum(report['sourceCounts'].values())} 个定义，"
        f"{sum(item['count'] for item in report['effectKinds'].values())} 个效果"
    )


if __name__ == "__main__":
    main()
