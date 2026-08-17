#!/usr/bin/env python3
"""Extract the proven logical AbilityEntity template prefix from local VFS assets.

The zero-space Next model needs only identity, born tags and lifetime defaults from
AbilityEntityTemplateData.  Spatial, model and physics fields intentionally remain
outside this evidence artifact.
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


ABILITY_ENTITY_ASSET_DIRECTORY = "assets/beyond/dynamicassets/gamedata/abilityentity"
MANIFEST_VIRTUAL_PATH = (
    "BundleManifest/Data/Bundles/Windows/__manifest_assets__/"
    + ABILITY_ENTITY_ASSET_DIRECTORY
)
ROOT_TYPE = ("AbilityEntityTemplateData", "Beyond.Gameplay", "Gameplay.Beyond")


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


def read_f32(data: bytes, offset: int) -> tuple[float, int]:
    if offset + 4 > len(data):
        raise ValueError(f"unexpected end of payload at 0x{offset:x}")
    return struct.unpack_from("<f", data, offset)[0], offset + 4


def read_bool(data: bytes, offset: int) -> tuple[bool, int]:
    if offset >= len(data) or data[offset] not in (0, 1):
        raise ValueError(f"invalid serialized boolean at 0x{offset:x}")
    return data[offset] == 1, offset + 1


def read_string(data: bytes, offset: int) -> tuple[str, int]:
    length, offset = read_i32(data, offset)
    if length < 0 or offset + length > len(data):
        raise ValueError(f"invalid string length {length} at 0x{offset - 4:x}")
    return data[offset : offset + length].decode("utf-8"), align4(offset + length)


def locate_root_data(data: bytes) -> tuple[int, int, int]:
    """Return root-data offset, registry count and MonoBehaviour root RID.

    Unity does not guarantee that the root object is the first registry record.
    We therefore validate the MonoBehaviour root RID, then locate the one record
    carrying the exact managed type triple and the same RID.
    """

    offset = 12
    _, offset = read_bool(data, offset)
    offset = align4(offset)
    offset += 12
    _, offset = read_string(data, offset)
    root_rid, offset = read_i64(data, offset)
    registry_version, offset = read_i32(data, offset)
    reference_count, _ = read_i32(data, offset)
    if registry_version != 2 or reference_count <= 0:
        raise ValueError(
            f"unexpected managed reference registry {registry_version}/{reference_count}"
        )

    class_bytes = ROOT_TYPE[0].encode("utf-8")
    search_at = 0
    matches: list[int] = []
    while True:
        occurrence = data.find(class_bytes, search_at)
        if occurrence < 0:
            break
        candidate = occurrence - 4
        try:
            rid = struct.unpack_from("<q", data, candidate - 8)[0]
            class_name, after_class = read_string(data, candidate)
            namespace, after_namespace = read_string(data, after_class)
            assembly, data_offset = read_string(data, after_namespace)
        except (UnicodeDecodeError, ValueError, struct.error):
            pass
        else:
            if rid == root_rid and (class_name, namespace, assembly) == ROOT_TYPE:
                matches.append(data_offset)
        search_at = occurrence + 1
    if len(matches) != 1:
        raise ValueError(f"expected one root AbilityEntityTemplateData record, got {matches}")
    return matches[0], reference_count, root_rid


def parse_blackboard_int(data: bytes, offset: int) -> tuple[dict[str, object], int]:
    use_key, offset = read_bool(data, offset)
    offset = align4(offset)
    value, offset = read_i32(data, offset)
    key, offset = read_string(data, offset)
    if use_key != bool(key):
        raise ValueError("BlackboardInt key flag does not match serialized key")
    return {"useBlackboardKey": use_key, "value": value, "blackboardKey": key}, offset


def parse_blackboard_double(data: bytes, offset: int) -> tuple[dict[str, object], int]:
    use_key, offset = read_bool(data, offset)
    offset = align4(offset)
    value, offset = read_f32(data, offset)
    key, offset = read_string(data, offset)
    if use_key != bool(key):
        raise ValueError("BlackboardDouble key flag does not match serialized key")
    return {"useBlackboardKey": use_key, "value": value, "blackboardKey": key}, offset


def parse_ability_entity_template(data: bytes, expected_id: str) -> dict[str, object]:
    offset, reference_count, root_rid = locate_root_data(data)
    game_id, offset = read_string(data, offset)
    name, offset = read_string(data, offset)
    faction, offset = read_i32(data, offset)
    tag_count, offset = read_i32(data, offset)
    if tag_count < 0 or tag_count > 256:
        raise ValueError(f"invalid bornTag count {tag_count}")
    born_tags = []
    for _ in range(tag_count):
        tag, offset = read_i32(data, offset)
        born_tags.append(tag)

    delay_to_recycle, offset = read_f32(data, offset)
    delay_recycle_perform, offset = read_f32(data, offset)
    send_die_event, offset = read_bool(data, offset)
    offset = align4(offset)
    enable_born_fade_in, offset = read_bool(data, offset)
    offset = align4(offset)
    fade_in_time, offset = read_f32(data, offset)
    component_count, offset = read_i32(data, offset)
    if component_count <= 0 or component_count >= reference_count:
        raise ValueError(
            f"invalid component count {component_count} for {reference_count} references"
        )
    component_rids = []
    for _ in range(component_count):
        rid, offset = read_i64(data, offset)
        component_rids.append(rid)
    if 0 in component_rids or len(set(component_rids)) != component_count:
        raise ValueError("componentList contains null or duplicate managed references")

    max_stacking_count, offset = read_i32(data, offset)
    max_stacking_count_bb, offset = parse_blackboard_int(data, offset)
    life_type, offset = read_i32(data, offset)
    duration, offset = read_f32(data, offset)
    duration_bb, offset = parse_blackboard_double(data, offset)
    max_duration_for_server, _ = read_f32(data, offset)

    if game_id != expected_id or name != expected_id:
        raise ValueError(
            f"template identity mismatch: expected {expected_id!r}, got {game_id!r}/{name!r}"
        )
    return {
        "gameId": game_id,
        "factionNativeValue": faction,
        "bornTagIds": born_tags,
        "lifeTypeNativeValue": life_type,
        "durationSeconds": duration,
        "durationBlackboard": duration_bb,
        "maxDurationForServerSeconds": max_duration_for_server,
        "maxStackingCount": max_stacking_count,
        "maxStackingCountBlackboard": max_stacking_count_bb,
        "delayToRecycleSeconds": delay_to_recycle,
        "delayRecyclePerformSeconds": delay_recycle_perform,
        "sendDieEvent": send_die_event,
        "enableBornFadeIn": enable_born_fade_in,
        "fadeInSeconds": fade_in_time,
        "componentCount": component_count,
        "managedReferenceCount": reference_count,
        "rootRid": root_rid,
    }


def read_json(url: str) -> dict:
    request = urllib.request.Request(url, headers={"User-Agent": "Endaxis-Next/1"})
    with urllib.request.urlopen(request, timeout=120) as response:
        return json.load(response)


def collect_referenced_ids(skill_directory: Path) -> dict[str, list[str]]:
    result: dict[str, set[str]] = {}

    def visit(value: object, source: str) -> None:
        if isinstance(value, dict):
            entity_id = value.get("abilityEntityId")
            if isinstance(entity_id, str) and entity_id:
                result.setdefault(entity_id, set()).add(source)
            for child in value.values():
                visit(child, source)
        elif isinstance(value, list):
            for child in value:
                visit(child, source)

    for path in sorted(skill_directory.glob("chr_*.json")):
        visit(json.loads(path.read_text(encoding="utf-8-sig")), path.name)
    return {key: sorted(value) for key, value in sorted(result.items())}


def run_raw_export(cli: Path, source_bundle: Path, asset_path: str, output: Path) -> Path:
    command = [
        str(cli),
        str(source_bundle),
        str(output),
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
    outputs = list(output.rglob("*.dat"))
    if len(outputs) != 1:
        raise RuntimeError(f"expected one raw MonoBehaviour for {asset_path}, got {outputs}")
    return outputs[0]


def main() -> None:
    project_root = Path(__file__).resolve().parents[2]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--vfs-url", default="http://127.0.0.1:8765")
    parser.add_argument(
        "--vfs-project", type=Path, default=project_root.parent / "vfs-index-browser"
    )
    parser.add_argument(
        "--skill-directory",
        type=Path,
        default=project_root.parent
        / "vfs-index-browser"
        / "combat-spec"
        / "artifacts"
        / "skill-data-cdn",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=project_root
        / "src"
        / "next"
        / "data"
        / "ability-entities"
        / "ability-entity-templates-1.4.4.json",
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
    references = collect_referenced_ids(args.skill_directory)
    results: dict[str, object] = {}
    unresolved_references: dict[str, object] = {}

    for index, (entity_id, sources) in enumerate(references.items(), 1):
        print(f"[{index}/{len(references)}] extracting {entity_id}")
        asset_name = f"data_{entity_id}.asset"
        asset = assets.get(asset_name)
        if asset is None:
            unresolved_references[entity_id] = {
                "reason": "manifestAssetMissing",
                "expectedAssetName": asset_name,
                "referencedBySkillFiles": sources,
            }
            print(f"[{index}/{len(references)}] unresolved {entity_id}: manifest asset missing")
            continue
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
        meta_path = (
            cache_root
            / "manifest-assets"
            / str(asset_index)
            / "monobehaviour"
            / "meta.json"
        )
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        cli = Path(meta["source"]["toolArtifacts"][0]["path"])
        with tempfile.TemporaryDirectory(prefix="endaxis-ability-entity-") as temporary:
            raw_path = run_raw_export(
                cli, cache_root / "source.ab", asset["path"], Path(temporary)
            )
            raw = raw_path.read_bytes()
        parsed = parse_ability_entity_template(raw, entity_id)
        results[entity_id] = {
            **parsed,
            "assetPath": asset["path"],
            "assetIndex": asset_index,
            "rawSha256": hashlib.sha256(raw).hexdigest(),
            "referencedBySkillFiles": sources,
        }
        print(f"[{index}/{len(references)}] extracted {entity_id}")

    document = {
        "format": "EndaxisLogicalAbilityEntityTemplateEvidence",
        "gameVersion": "1.4.4",
        "manifestId": manifest_id,
        "spatialModel": "zero-distance-all-instances-single-enemy",
        "lifeTypeNativeValues": {"limited": 0, "infinite": 1},
        "templates": results,
        "unresolvedReferences": unresolved_references,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(
        f"wrote {len(results)} AbilityEntity templates and "
        f"{len(unresolved_references)} unresolved references to {args.output}"
    )


if __name__ == "__main__":
    main()
