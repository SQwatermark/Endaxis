#!/usr/bin/env python3
"""Generate Next's versioned GameplayTag path catalog from an AnimeStudio TypeTree dump."""

from __future__ import annotations

import argparse
import hashlib
import re
from pathlib import Path


EXPECTED_DUMP_SHA256 = "3758bb1f10764ce9d1bda9ef5200d77b3fe93ea59dbd0e09f196c18221019cf8"


def extract_paths(dump: bytes) -> list[str]:
    text = dump.decode("utf-8")
    match = re.search(r"vector _keyData\s+Array Array\s+int size = (\d+)", text)
    if match is None:
        raise ValueError("GameplayTagConfig _keyData vector was not found")
    expected_count = int(match.group(1))
    paths = re.findall(r'string data = "([^"]+)"', text[match.end() :])[:expected_count]
    if len(paths) != expected_count:
        raise ValueError(f"expected {expected_count} tag paths, found {len(paths)}")
    if len(set(paths)) != len(paths):
        raise ValueError("GameplayTagConfig contains duplicate paths")
    return paths


def render(paths: list[str], source_hash: str) -> str:
    def ts_string(value: str) -> str:
        return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"

    rendered_paths = "\n".join(f"  {ts_string(path)}," for path in paths)
    return f"""/**
 * Generated from the 1.4.4 GameplayTagConfig TypeTree dump.
 * Source SHA-256: {source_hash.upper()}
 * Do not edit by hand; rerun scripts/generate_next_gameplay_tags.
 */
import {{ gameplayTagIdFromPath }} from '../../core/combat/tags/gameplayTags';

export const GAMEPLAY_TAG_PATHS = Object.freeze([
{rendered_paths}
] as const);

export const GAMEPLAY_TAG_DEFINITIONS = Object.freeze(
  GAMEPLAY_TAG_PATHS.map(path => Object.freeze({{ id: gameplayTagIdFromPath(path), path }})),
);
"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("dump", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--allow-new-source", action="store_true")
    args = parser.parse_args()

    dump = args.dump.read_bytes()
    source_hash = hashlib.sha256(dump).hexdigest()
    if source_hash != EXPECTED_DUMP_SHA256 and not args.allow_new_source:
        raise ValueError(
            f"unexpected GameplayTagConfig dump SHA-256 {source_hash}; "
            "audit the new source before passing --allow-new-source"
        )
    paths = extract_paths(dump)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(render(paths, source_hash), encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
