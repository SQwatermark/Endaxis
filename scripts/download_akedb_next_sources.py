#!/usr/bin/env python3
"""Download the version-locked AKEDB inputs used by the Next operator generator."""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
from pathlib import Path
import time
import urllib.parse
import urllib.request


DEFAULT_CDN = "https://data.akedata.wiki"
DEFAULT_VERSION = "1.4.4@9433094-12"
TABLE_NAMES = (
    "CharacterTable",
    "CharGrowthTable",
    "CharacterPotentialTable",
    "PotentialTalentEffectTable",
    "SkillPatchTable",
)
JSON_COLLECTIONS = {
    "SkillData": "skill-data-cdn",
    "BuffData": "BuffData",
}


def fetch_bytes(url: str, attempts: int = 3) -> bytes:
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "Endaxis-Next/1"})
            with urllib.request.urlopen(request, timeout=120) as response:
                return response.read()
        except Exception as error:  # urllib exposes several transport exception types.
            last_error = error
            if attempt + 1 < attempts:
                time.sleep(1 << attempt)
    assert last_error is not None
    raise last_error


def fetch_json(url: str) -> object:
    return json.loads(fetch_bytes(url).decode("utf-8-sig"))


def write_validated_json(path: Path, content: bytes) -> None:
    json.loads(content.decode("utf-8-sig"))
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".part")
    temporary.write_bytes(content)
    temporary.replace(path)


def download_file(url: str, path: Path) -> None:
    write_validated_json(path, fetch_bytes(url))


def select_version(manifest: object, version_id: str) -> dict[str, object]:
    if not isinstance(manifest, dict) or not isinstance(manifest.get("versions"), list):
        raise ValueError("AKEDB manifest has an unexpected shape")
    for value in manifest["versions"]:
        if isinstance(value, dict) and value.get("id") == version_id:
            return value
    raise ValueError(f"AKEDB manifest does not contain {version_id!r}")


def download_collection(cdn: str, name: str, output: Path, workers: int) -> int:
    manifest_url = f"{cdn}/public/Json/{name}/manifest.json"
    manifest = fetch_json(manifest_url)
    if not isinstance(manifest, list):
        raise ValueError(f"{name} manifest is not an array")
    jobs: list[tuple[str, Path]] = []
    seen: set[str] = set()
    for index, value in enumerate(manifest):
        if not isinstance(value, dict) or not isinstance(value.get("contentFile"), str):
            raise ValueError(f"{name} manifest entry {index} is invalid")
        relative_url = value["contentFile"]
        filename = Path(urllib.parse.urlparse(relative_url).path).name
        if not filename.endswith(".json") or filename in seen:
            raise ValueError(f"{name} manifest contains invalid filename {filename!r}")
        seen.add(filename)
        jobs.append((urllib.parse.urljoin(cdn + "/", relative_url.lstrip("/")), output / filename))

    output.mkdir(parents=True, exist_ok=True)
    unexpected = {path.name for path in output.glob("*.json")} - seen
    if unexpected:
        raise ValueError(
            f"{output} contains files outside the current {name} manifest: "
            f"{sorted(unexpected)}"
        )
    completed = 0
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(download_file, url, path): path for url, path in jobs}
        for future in as_completed(futures):
            future.result()
            completed += 1
            if completed % 100 == 0 or completed == len(jobs):
                print(f"{name}: {completed}/{len(jobs)}")
    return completed


def main() -> None:
    project_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cdn", default=DEFAULT_CDN)
    parser.add_argument("--version", default=DEFAULT_VERSION)
    parser.add_argument(
        "--output",
        type=Path,
        default=project_root.parent / "vfs-index-browser" / "combat-spec" / "artifacts",
    )
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument(
        "--tables-only",
        action="store_true",
        help="download only the versioned TableCfg files",
    )
    args = parser.parse_args()
    if args.workers <= 0:
        raise ValueError("workers must be positive")

    cdn = args.cdn.rstrip("/")
    manifest = fetch_json(f"{cdn}/manifest.json")
    version = select_version(manifest, args.version)
    assert isinstance(manifest, dict)
    print(
        "AKEDB public JSON snapshot: "
        f"latest={manifest.get('latest')}, sharedRevision={manifest.get('sharedRevision')}"
    )
    table_path = version.get("tableCfgPath")
    if not isinstance(table_path, str) or not table_path:
        raise ValueError("selected AKEDB version has no tableCfgPath")
    table_output = args.output / f"TableCfg-{args.version.replace('@', '-')}"
    table_base = f"{cdn}/{table_path.strip('/')}"
    for name in TABLE_NAMES:
        download_file(f"{table_base}/{name}.json", table_output / f"{name}.json")
        print(f"TableCfg: {name}")

    if args.tables_only:
        print(f"downloaded {args.version}: {len(TABLE_NAMES)} tables")
        return

    counts = {
        name: download_collection(cdn, name, args.output / directory, args.workers)
        for name, directory in JSON_COLLECTIONS.items()
    }
    print(
        f"downloaded {args.version}: {len(TABLE_NAMES)} tables, "
        + ", ".join(f"{name}={count}" for name, count in counts.items())
    )


if __name__ == "__main__":
    main()
