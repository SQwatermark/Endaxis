#!/usr/bin/env python3
"""Extract EnemyTemplateData.rank from the local Endfield VFS assets.

The VFS browser resolves each manifest asset to its exact AssetBundle. AnimeStudio
then exports the raw MonoBehaviour payload; this script reads only the proven
EnemyTemplateData prefix and fails if the managed-reference layout differs.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import struct
import subprocess
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path


ENEMY_ASSET_DIRECTORY = "assets/beyond/dynamicassets/gamedata/enemydata"
MANIFEST_VIRTUAL_PATH = (
    "BundleManifest/Data/Bundles/Windows/__manifest_assets__/" + ENEMY_ASSET_DIRECTORY
)
RANK_NAMES = {0: "mob", 1: "boss", 2: "elite"}
GAME_ID_PATTERN = re.compile(r"\bgameId:\s*'(?P<game_id>eny_[^']+)'")


def read_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=120) as response:
        return json.load(response)


def align4(offset: int) -> int:
    return (offset + 3) & ~3


def read_i32(data: bytes, offset: int) -> tuple[int, int]:
    if offset + 4 > len(data):
        raise ValueError(f"unexpected end of payload at 0x{offset:x}")
    return struct.unpack_from("<i", data, offset)[0], offset + 4


def read_i64(data: bytes, offset: int) -> tuple[int, int]:
    if offset + 8 > len(data):
        raise ValueError(f"unexpected end of payload at 0x{offset:x}")
    return struct.unpack_from("<q", data, offset)[0], offset + 8


def read_string(data: bytes, offset: int) -> tuple[str, int]:
    length, offset = read_i32(data, offset)
    if length < 0 or offset + length > len(data):
        raise ValueError(f"invalid string length {length} at 0x{offset - 4:x}")
    value = data[offset : offset + length].decode("utf-8")
    return value, align4(offset + length)


def parse_enemy_rank(data: bytes, expected_game_id: str) -> tuple[int, str, int]:
    # Unity MonoBehaviour base: GameObject PPtr, enabled byte, Script PPtr, name.
    offset = 12
    offset = align4(offset + 1)
    offset += 12
    _, offset = read_string(data, offset)

    root_rid, offset = read_i64(data, offset)
    registry_version, offset = read_i32(data, offset)
    reference_count, offset = read_i32(data, offset)
    if registry_version != 2 or reference_count <= 0:
        raise ValueError(
            f"unexpected managed reference registry {registry_version}/{reference_count}"
        )

    first_rid, offset = read_i64(data, offset)
    class_name, offset = read_string(data, offset)
    namespace, offset = read_string(data, offset)
    assembly, data_offset = read_string(data, offset)
    if root_rid != first_rid:
        raise ValueError(f"root rid {root_rid} does not match first record {first_rid}")
    if (class_name, namespace, assembly) != (
        "EnemyTemplateData",
        "Beyond.Gameplay",
        "Gameplay.Beyond",
    ):
        raise ValueError(
            f"unexpected managed type {namespace}.{class_name}, {assembly}"
        )

    # The derived EnemyTemplateData fields begin with modelKey. Its first value in
    # the root record contains the enemy id; later component records may repeat it.
    encoded_id = expected_game_id.encode("utf-8")
    model_key_offset = None
    model_key = ""
    search_at = data_offset
    while True:
        occurrence = data.find(encoded_id, search_at)
        if occurrence < 0:
            break
        prefix = occurrence - 4
        if prefix >= data_offset:
            try:
                candidate, candidate_end = read_string(data, prefix)
            except (UnicodeDecodeError, ValueError):
                candidate = ""
            else:
                if candidate.startswith(expected_game_id) and candidate != expected_game_id:
                    model_key_offset = prefix
                    model_key = candidate
                    offset = candidate_end
                    break
        search_at = occurrence + 1
    if model_key_offset is None:
        raise ValueError("could not locate EnemyTemplateData.modelKey")

    # componentList ends immediately before modelKey. RIDs are unique and share
    # the root record's generated high word, but Unity does not promise sequential
    # low words (some real assets cross to a new RID range).
    component_count = 0
    root_high_word = first_rid >> 32
    for count in range(1, reference_count):
        candidate = model_key_offset - 4 - count * 8
        if candidate < data_offset:
            break
        if struct.unpack_from("<i", data, candidate)[0] != count:
            continue
        references = struct.unpack_from(f"<{count}q", data, candidate + 4)
        if (
            len(set(references)) == count
            and all(reference != 0 and reference >> 32 == root_high_word for reference in references)
        ):
            component_count = count
            break
    if component_count == 0:
        raise ValueError("could not validate EnemyTemplateData.componentList")

    rank_value, offset = read_i32(data, offset)
    if rank_value not in RANK_NAMES:
        raise ValueError(f"unknown EnemyRank value {rank_value}")
    if expected_game_id not in model_key:
        raise ValueError(
            f"model key {model_key!r} does not contain expected id {expected_game_id!r}"
        )
    return rank_value, model_key, component_count


def load_expected_game_ids(enemy_directory: Path) -> list[str]:
    result = []
    for path in sorted(enemy_directory.glob("*.ts")):
        match = GAME_ID_PATTERN.search(path.read_text(encoding="utf-8"))
        if match is None:
            raise ValueError(f"{path}: missing literal gameId")
        result.append(match.group("game_id"))
    if len(result) != len(set(result)):
        raise ValueError("legacy enemy gameId values are not unique")
    return result


def run_raw_export(
    cli: Path,
    source_bundle: Path,
    asset_path: str,
    output_directory: Path,
) -> Path:
    command = [
        str(cli),
        str(source_bundle),
        str(output_directory),
        "--game",
        "ArknightsEndfield",
        "--types",
        "MonoBehaviour",
        "--containers",
        f"^{re.escape(asset_path)}$",
        "--export_type",
        "Raw",
        "--group_assets",
        "ByType",
        "--logger_flags",
        "Error",
        "Warning",
    ]
    completed = subprocess.run(command, check=False, capture_output=True, text=True)
    if completed.returncode != 0:
        raise RuntimeError(
            f"AnimeStudio failed for {asset_path}:\n{completed.stdout}\n{completed.stderr}"
        )
    outputs = list(output_directory.rglob("*.dat"))
    if len(outputs) != 1:
        raise RuntimeError(f"expected one raw MonoBehaviour for {asset_path}, got {outputs}")
    return outputs[0]


def main() -> None:
    project_root = Path(__file__).resolve().parents[2]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--vfs-url", default="http://127.0.0.1:8765")
    parser.add_argument(
        "--vfs-project",
        type=Path,
        default=project_root.parent / "vfs-index-browser",
    )
    parser.add_argument(
        "--enemy-directory",
        type=Path,
        default=project_root / "src" / "data" / "enemies",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=project_root
        / "src"
        / "next"
        / "data"
        / "enemies"
        / "enemy-ranks-1.4.4.json",
    )
    args = parser.parse_args()

    listing_url = (
        f"{args.vfs_url.rstrip('/')}/api/list?"
        + urllib.parse.urlencode(
            {
                "scope": "effective",
                "path": MANIFEST_VIRTUAL_PATH,
                "page": 1,
                "pageSize": 500,
            }
        )
    )
    listing = read_json(listing_url)
    manifest_id = int(listing["virtual"]["manifestId"])
    assets = {item["name"]: item for item in listing["files"]}
    expected_game_ids = load_expected_game_ids(args.enemy_directory)
    results = {}

    for index, game_id in enumerate(expected_game_ids, 1):
        asset_name = f"data_{game_id}.asset"
        asset = assets.get(asset_name)
        if asset is None:
            raise ValueError(f"manifest has no enemy asset for {game_id}")
        asset_index = int(
            urllib.parse.parse_qs(urllib.parse.urlparse(asset["previewUrl"]).query)[
                "assetIndex"
            ][0]
        )
        preview = read_json(
            f"{args.vfs_url.rstrip('/')}/api/manifest-asset/preview?"
            + urllib.parse.urlencode(
                {"manifestId": manifest_id, "assetIndex": asset_index}
            )
        )
        record_id = int(preview["resolvedFile"]["id"])
        cache_root = args.vfs_project / "data" / "internal-cache" / str(record_id)
        source_bundle = cache_root / "source.ab"
        meta_path = (
            cache_root
            / "manifest-assets"
            / str(asset_index)
            / "monobehaviour"
            / "meta.json"
        )
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        cli = Path(meta["source"]["toolArtifacts"][0]["path"])
        with tempfile.TemporaryDirectory(prefix="endaxis-enemy-rank-") as temporary:
            raw_path = run_raw_export(
                cli,
                source_bundle,
                asset["path"],
                Path(temporary),
            )
            raw = raw_path.read_bytes()
        rank_value, model_key, component_count = parse_enemy_rank(raw, game_id)
        results[game_id] = {
            "rank": RANK_NAMES[rank_value],
            "nativeValue": rank_value,
            "assetPath": asset["path"],
            "assetIndex": asset_index,
            "rawSha256": hashlib.sha256(raw).hexdigest(),
            "modelKey": model_key,
            "componentCount": component_count,
        }
        print(f"[{index}/{len(expected_game_ids)}] {game_id}: {RANK_NAMES[rank_value]}")

    document = {
        "format": "EndaxisEnemyRankEvidence",
        "gameVersion": "1.4.4",
        "manifestId": manifest_id,
        "nativeValues": RANK_NAMES,
        "enemies": results,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(document, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {len(results)} enemy ranks to {args.output}")


if __name__ == "__main__":
    main()
