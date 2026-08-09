"""装备数据源适配边界；审计与迁移 IR 只依赖结构化快照，不依赖旧 TypeScript。"""

from __future__ import annotations

from pathlib import Path
import subprocess


SCRIPT_DIR = Path(__file__).resolve().parent
REPOSITORY_ROOT = SCRIPT_DIR.parent.parent


def export_legacy_snapshot(output: Path) -> None:
    """调用当前旧 TS Adapter；未来 CDN/AKEDB Adapter 只需产出同一快照契约。"""
    subprocess.run(
        ["node", str(SCRIPT_DIR / "export_legacy_equipment.mjs"), "--output", str(output)],
        cwd=REPOSITORY_ROOT,
        check=True,
    )
