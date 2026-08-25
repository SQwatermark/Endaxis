"""严格加载 ProjectileTemplateData 的实体黑板证据。"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path


DEFAULT_EVIDENCE_PATH = (
    Path(__file__).resolve().parents[2]
    / "src"
    / "next"
    / "data"
    / "projectiles"
    / "projectile-entity-blackboards-1.4.4.json"
)


@lru_cache(maxsize=None)
def load_projectile_entity_blackboards(
    evidence_path: Path = DEFAULT_EVIDENCE_PATH,
) -> dict[str, tuple[tuple[str, float], ...]]:
    root = json.loads(evidence_path.read_text(encoding="utf-8"))
    if not isinstance(root, dict) or set(root) != {"version", "projectiles"}:
        raise ValueError(f"{evidence_path}: expected version/projectiles root")
    if root["version"] != "1.4.4":
        raise ValueError(f"{evidence_path}.version: expected '1.4.4'")
    entries = root["projectiles"]
    if not isinstance(entries, list):
        raise ValueError(f"{evidence_path}.projectiles: expected array")

    result: dict[str, tuple[tuple[str, float], ...]] = {}
    for index, raw_entry in enumerate(entries):
        path = f"{evidence_path}.projectiles[{index}]"
        if not isinstance(raw_entry, dict) or set(raw_entry) != {
            "projectileId",
            "entityBlackboard",
            "rawAssetSha256",
            "evidence",
        }:
            raise ValueError(f"{path}: unexpected fields")
        projectile_id = raw_entry["projectileId"]
        if not isinstance(projectile_id, str) or not projectile_id:
            raise ValueError(f"{path}.projectileId: expected non-empty string")
        if projectile_id in result:
            raise ValueError(f"{path}.projectileId: duplicate {projectile_id!r}")
        digest = raw_entry["rawAssetSha256"]
        if not isinstance(digest, str) or len(digest) != 64:
            raise ValueError(f"{path}.rawAssetSha256: expected SHA-256")
        if not isinstance(raw_entry["evidence"], str) or not raw_entry["evidence"]:
            raise ValueError(f"{path}.evidence: expected non-empty string")
        pairs = raw_entry["entityBlackboard"]
        if not isinstance(pairs, list) or not pairs:
            raise ValueError(f"{path}.entityBlackboard: expected non-empty array")
        parsed: list[tuple[str, float]] = []
        seen: set[str] = set()
        for pair_index, pair in enumerate(pairs):
            pair_path = f"{path}.entityBlackboard[{pair_index}]"
            if not isinstance(pair, dict) or set(pair) != {"key", "value", "isDynamic"}:
                raise ValueError(f"{pair_path}: unexpected fields")
            key = pair["key"]
            value = pair["value"]
            if not isinstance(key, str) or not key.startswith("EntityBB_") or key in seen:
                raise ValueError(f"{pair_path}.key: expected unique EntityBB_ key")
            if not isinstance(value, (int, float)) or isinstance(value, bool):
                raise ValueError(f"{pair_path}.value: expected number")
            if pair["isDynamic"] is not True:
                raise ValueError(f"{pair_path}.isDynamic: expected true")
            seen.add(key)
            parsed.append((key, float(value)))
        result[projectile_id] = tuple(parsed)
    return result


def resolve_projectile_entity_blackboard(
    projectile_id: str,
    evidence_path: Path = DEFAULT_EVIDENCE_PATH,
) -> tuple[tuple[str, float], ...]:
    return load_projectile_entity_blackboards(evidence_path).get(projectile_id, ())
