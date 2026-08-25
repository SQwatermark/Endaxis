"""ProjectileData 在 Endaxis 固定单敌人模型下的严格目标投影。"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Literal


DEFAULT_EVIDENCE_PATH = (
    Path(__file__).resolve().parents[2]
    / "src"
    / "next"
    / "data"
    / "projectiles"
    / "projectile-target-filters-1.4.4.json"
)

OBJECT_TYPE_CHARACTER = 8
OBJECT_TYPE_ENEMY = 16
FACTION_TARGET_ANTI = 1
FACTION_TYPE_GOOD = 4


def _require_bool(value: object, path: str) -> bool:
    if not isinstance(value, bool):
        raise ValueError(f"{path}: expected boolean")
    return value


def _require_int(value: object, path: str) -> int:
    if not isinstance(value, int) or isinstance(value, bool):
        raise ValueError(f"{path}: expected integer")
    return value


@lru_cache(maxsize=None)
def load_projectile_target_evidence(
    evidence_path: Path = DEFAULT_EVIDENCE_PATH,
) -> dict[str, dict[str, object]]:
    root = json.loads(evidence_path.read_text(encoding="utf-8"))
    if not isinstance(root, dict) or set(root) != {"version", "projectiles"}:
        raise ValueError(f"{evidence_path}: expected version/projectiles root")
    if root["version"] != "1.4.4":
        raise ValueError(f"{evidence_path}.version: expected '1.4.4'")
    entries = root["projectiles"]
    if not isinstance(entries, list):
        raise ValueError(f"{evidence_path}.projectiles: expected array")
    result: dict[str, dict[str, object]] = {}
    for index, raw_entry in enumerate(entries):
        path = f"{evidence_path}.projectiles[{index}]"
        if not isinstance(raw_entry, dict):
            raise ValueError(f"{path}: expected object")
        expected = {
            "projectileId",
            "autoSetTargetFaction",
            "factionTarget",
            "targetFactionType",
            "filterObjectType",
            "objectTypeMask",
            "decodedSourceSha256",
            "evidence",
        }
        if set(raw_entry) != expected:
            raise ValueError(f"{path}: unexpected fields {sorted(raw_entry)}")
        projectile_id = raw_entry["projectileId"]
        if not isinstance(projectile_id, str) or not projectile_id:
            raise ValueError(f"{path}.projectileId: expected non-empty string")
        if projectile_id in result:
            raise ValueError(f"{path}.projectileId: duplicate {projectile_id!r}")
        _require_bool(raw_entry["autoSetTargetFaction"], f"{path}.autoSetTargetFaction")
        _require_int(raw_entry["factionTarget"], f"{path}.factionTarget")
        _require_int(raw_entry["targetFactionType"], f"{path}.targetFactionType")
        _require_bool(raw_entry["filterObjectType"], f"{path}.filterObjectType")
        _require_int(raw_entry["objectTypeMask"], f"{path}.objectTypeMask")
        digest = raw_entry["decodedSourceSha256"]
        if not isinstance(digest, str) or len(digest) != 64:
            raise ValueError(f"{path}.decodedSourceSha256: expected SHA-256")
        if not isinstance(raw_entry["evidence"], str) or not raw_entry["evidence"]:
            raise ValueError(f"{path}.evidence: expected non-empty string")
        result[projectile_id] = raw_entry
    return result


def resolve_projectile_single_enemy_input_target(
    projectile_id: str,
    evidence_path: Path = DEFAULT_EVIDENCE_PATH,
) -> Literal["enemy", "caster"] | None:
    """只在 TargetFilter 对固定战斗模型给出唯一结论时返回目标。"""

    entry = load_projectile_target_evidence(evidence_path).get(projectile_id)
    if entry is None:
        return None
    auto_faction = bool(entry["autoSetTargetFaction"])
    faction_target = int(entry["factionTarget"])
    faction_type = int(entry["targetFactionType"])
    filter_object_type = bool(entry["filterObjectType"])
    object_type = int(entry["objectTypeMask"])

    # 玩家阵营来源、Anti 自动阵营和允许 Enemy 的对象掩码唯一落到木桩敌人。
    if (
        auto_faction
        and faction_target == FACTION_TARGET_ANTI
        and (not filter_object_type or object_type & OBJECT_TYPE_ENEMY)
        and not (filter_object_type and object_type & OBJECT_TYPE_CHARACTER)
    ):
        return "enemy"
    # 显式 Good + Character 且排除 Enemy，在简化模型中投影为施法者侧角色。
    if (
        not auto_faction
        and faction_type == FACTION_TYPE_GOOD
        and filter_object_type
        and object_type & OBJECT_TYPE_CHARACTER
        and not object_type & OBJECT_TYPE_ENEMY
    ):
        return "caster"
    return None
