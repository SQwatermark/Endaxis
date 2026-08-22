"""Strict, versioned projection of recovered native SkillSetting values."""

from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Any


_CATALOG_PATH = Path(__file__).with_name("skill-setting.combat-1.4.4.json")
_CATALOG = json.loads(_CATALOG_PATH.read_text(encoding="utf-8"))


def resolve_linear_skill_setting_read(
    data_key: str,
    column: float,
    path: str,
) -> tuple[float, float]:
    """Return ``(base, attribute multiplier)`` for a proven literal-column read."""
    if not math.isfinite(column):
        raise ValueError(f"{path}.column: expected finite literal")
    column_index = round(column) - 1
    entry: dict[str, Any] | None = _CATALOG["data"].get(data_key)
    if entry is None:
        raise ValueError(f"{path}.dataKey: SkillSetting entry {data_key!r} is not recovered")
    values = entry["values"]
    if column_index < 0 or column_index >= len(values):
        raise ValueError(f"{path}.column: resolved index {column_index} is out of range")
    base = float(values[column_index])
    formula_key = entry["enhanceFormulaKey"]
    if not formula_key:
        return base, 0.0
    formula = _CATALOG["formulas"].get(formula_key)
    if formula is None or formula.get("formulaType") != 1:
        raise ValueError(f"{path}: unsupported SkillSetting formula {formula_key!r}")
    return base, base * float(formula["paramA"])


def has_recovered_skill_setting_data(data_key: str) -> bool:
    return data_key in _CATALOG["data"]
