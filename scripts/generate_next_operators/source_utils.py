"""生成器共享的严格数据读取与 TypeScript 字面量工具。

这里只提供无状态基础操作；不得依赖技能解析、DSL 编译或干员养成模块。
"""

from __future__ import annotations

import json
from typing import Any

from source_models import Vector3Source

__all__ = [
    "action_name",
    "parse_vector3",
    "require_bool",
    "require_dict",
    "require_list",
    "require_non_negative_int",
    "require_number",
    "require_server_action_index",
    "table_row",
    "ts_inline_literal",
    "ts_literal",
]

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


def require_bool(value: Any, path: str) -> bool:
    if not isinstance(value, bool):
        raise ValueError(f"{path}: expected boolean")
    return value


def require_number(value: Any, path: str) -> float:
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        raise ValueError(f"{path}: expected number")
    return float(value)


def parse_vector3(value: Any, path: str) -> Vector3Source:
    vector = require_dict(value, path)
    if set(vector) != {"x", "y", "z"}:
        raise ValueError(f"{path}: unexpected fields {sorted(vector)}")
    return Vector3Source(
        x=require_number(vector.get("x"), f"{path}.x"),
        y=require_number(vector.get("y"), f"{path}.y"),
        z=require_number(vector.get("z"), f"{path}.z"),
    )


def require_server_action_index(action: dict[str, Any], path: str) -> int:
    """读取原生动作顺序；该值用于归并同帧动作，不能用遍历序号代替。"""
    return require_non_negative_int(action.get("serverActionIndex"), f"{path}.serverActionIndex")


def action_name(type_name: str) -> str:
    qualified = type_name.split(",", 1)[0]
    return qualified.rsplit(".", 1)[-1].split("+", 1)[0]


def ts_literal(value: Any, indent: int = 0) -> str:
    # JSON 是 TypeScript 对当前中间层最稳定的字面量子集。
    return json.dumps(value, ensure_ascii=False, indent=2).replace("\n", "\n" + " " * indent)


def ts_inline_literal(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, str):
        return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return str(int(value)) if isinstance(value, float) and value.is_integer() else str(value)
    if isinstance(value, (list, tuple)):
        return "[" + ", ".join(ts_inline_literal(item) for item in value) + "]"
    if isinstance(value, dict):
        if not value:
            return "{}"
        return "{ " + ", ".join(f"{key}: {ts_inline_literal(item)}" for key, item in value.items()) + " }"
    raise TypeError(f"unsupported TypeScript literal: {type(value).__name__}")

def table_row(table: dict[str, Any], key: str, path: str) -> dict[str, Any]:
    if key not in table:
        raise ValueError(f"{path}: missing {key}")
    return require_dict(table[key], f"{path}.{key}")
