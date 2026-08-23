"""Strict identity coverage audit between AKEDB TableCfg and the migration snapshot."""

from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import PurePosixPath
from typing import Any

from .audit_schema import AuditFailure


SCHEMA_VERSION = 1
WEAPON_PREFIX_ALIASES = (
    ("wpn_claym_", "wpn_greatsword_"),
    ("wpn_lance_", "wpn_polearm_"),
    ("wpn_pistol_", "wpn_handcannon_"),
    ("wpn_funnel_", "wpn_artsunit_"),
)


def _object(value: Any, path: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise AuditFailure(path, "应为对象")
    return value


def _non_empty_string(value: Any, path: str) -> str:
    if not isinstance(value, str) or not value:
        raise AuditFailure(path, "应为非空字符串")
    return value


def _aliases(value: str) -> set[str]:
    raw = value.strip().lower()
    result = {raw}
    for left, right in WEAPON_PREFIX_ALIASES:
        if raw.startswith(left):
            result.add(raw.replace(left, right, 1))
        if raw.startswith(right):
            result.add(raw.replace(right, left, 1))
    return result


def _icon_stem(definition: dict[str, Any], path: str) -> str:
    icon = _non_empty_string(definition.get("icon"), f"{path}.icon")
    stem = PurePosixPath(icon).stem
    if not stem:
        raise AuditFailure(f"{path}.icon", "无法取得资源身份")
    return stem


def _records(snapshot: object) -> list[dict[str, Any]]:
    root = _object(snapshot, "$")
    if root.get("schemaVersion") != 1:
        raise AuditFailure("$.schemaVersion", "只支持旧装备快照 schemaVersion 1")
    values = root.get("records")
    if not isinstance(values, list):
        raise AuditFailure("$.records", "应为数组")
    records = [_object(value, f"$.records[{index}]") for index, value in enumerate(values)]
    for index, record in enumerate(records):
        if record.get("kind") not in {"weapon", "gearPiece", "gearSet"}:
            raise AuditFailure(f"$.records[{index}].kind", "未知装备来源类型")
        _non_empty_string(record.get("slug"), f"$.records[{index}].slug")
        _object(record.get("definition"), f"$.records[{index}].definition")
    return records


def _validate_skill_patch_reference(
    skill_patch: dict[str, Any], skill_id: Any, path: str
) -> str:
    value = _non_empty_string(skill_id, path)
    if value not in skill_patch:
        raise AuditFailure(path, f"SkillPatchTable 缺少 {value!r}")
    return value


def build_akedb_source_audit(
    snapshot: object,
    weapon_table_input: object,
    item_table_input: object,
    suit_table_input: object,
    skill_patch_input: object,
    *,
    version_id: str,
) -> dict[str, Any]:
    """Build a fail-fast audit while retaining expected migration coverage gaps."""

    records = _records(snapshot)
    weapon_table = _object(weapon_table_input, "WeaponBasicTable")
    item_table = _object(item_table_input, "ItemTable")
    suit_table = _object(suit_table_input, "EquipSuitTable")
    skill_patch = _object(skill_patch_input, "SkillPatchTable")

    local_weapons = [record for record in records if record["kind"] == "weapon"]
    local_gears = [record for record in records if record["kind"] == "gearPiece"]
    local_sets = [
        record
        for record in records
        if record["kind"] == "gearSet" and record["slug"] != "no-set-bonuses"
    ]

    icon_to_weapon_slugs: dict[str, set[str]] = defaultdict(set)
    for index, record in enumerate(local_weapons):
        definition = _object(record["definition"], f"weapon[{index}].definition")
        for alias in _aliases(_icon_stem(definition, f"weapon[{index}].definition")):
            icon_to_weapon_slugs[alias].add(record["slug"])

    weapon_matches: dict[str, str] = {}
    ambiguous_weapons: list[dict[str, Any]] = []
    for weapon_id, raw_weapon in sorted(weapon_table.items()):
        weapon = _object(raw_weapon, f"WeaponBasicTable.{weapon_id}")
        item = _object(item_table.get(weapon_id), f"ItemTable.{weapon_id}")
        icon_id = _non_empty_string(item.get("iconId"), f"ItemTable.{weapon_id}.iconId")
        slugs = sorted(
            {slug for alias in _aliases(icon_id) for slug in icon_to_weapon_slugs.get(alias, set())}
        )
        if len(slugs) == 1:
            weapon_matches[weapon_id] = slugs[0]
        elif len(slugs) > 1:
            ambiguous_weapons.append({"gameId": weapon_id, "slugs": slugs})

        skill_ids = weapon.get("weaponSkillList")
        if not isinstance(skill_ids, list) or len(skill_ids) not in {2, 3}:
            raise AuditFailure(
                f"WeaponBasicTable.{weapon_id}.weaponSkillList",
                "武器词条引用必须包含 2 或 3 项",
            )
        for index, skill_id in enumerate(skill_ids):
            _validate_skill_patch_reference(
                skill_patch, skill_id, f"WeaponBasicTable.{weapon_id}.weaponSkillList[{index}]"
            )

    matched_local_weapon_slugs = set(weapon_matches.values())
    missing_weapon_ids = sorted(set(weapon_table) - set(weapon_matches))
    unmapped_local_weapon_slugs = sorted(
        {record["slug"] for record in local_weapons} - matched_local_weapon_slugs
    )

    gear_item_to_slugs: dict[str, list[str]] = defaultdict(list)
    gear_item_to_set_slugs: dict[str, set[str]] = defaultdict(set)
    folder_to_set_slug: dict[str, str] = {}
    for index, record in enumerate(local_gears):
        definition = _object(record["definition"], f"gearPiece[{index}].definition")
        icon = _non_empty_string(definition.get("icon"), f"gearPiece[{index}].definition.icon")
        path = PurePosixPath(icon)
        item_id = path.stem
        if item_id not in item_table:
            raise AuditFailure(
                f"gearPiece[{index}].definition.icon", f"ItemTable 缺少 {item_id!r}"
            )
        gear_item_to_slugs[item_id].append(record["slug"])
        set_slug = definition.get("setSlug")
        if set_slug is None:
            continue
        set_slug = _non_empty_string(set_slug, f"gearPiece[{index}].definition.setSlug")
        gear_item_to_set_slugs[item_id].add(set_slug)
        parts = path.parts
        if len(parts) < 3 or parts[-3] != "equipment":
            raise AuditFailure(f"gearPiece[{index}].definition.icon", "无法取得套装资源目录")
        folder = parts[-2]
        previous = folder_to_set_slug.setdefault(folder, set_slug)
        if previous != set_slug:
            raise AuditFailure(
                f"gearPiece[{index}].definition.setSlug",
                f"资源目录 {folder!r} 同时映射到 {previous!r} 与 {set_slug!r}",
            )

    suit_matches: dict[str, str] = {}
    for suit_id, raw_suit in sorted(suit_table.items()):
        suit = _object(raw_suit, f"EquipSuitTable.{suit_id}")
        entries = suit.get("list")
        if not isinstance(entries, list) or len(entries) != 1:
            raise AuditFailure(f"EquipSuitTable.{suit_id}.list", "套装必须恰有一条激活规则")
        entry = _object(entries[0], f"EquipSuitTable.{suit_id}.list[0]")
        if entry.get("equipCnt") != 3:
            raise AuditFailure(f"EquipSuitTable.{suit_id}.list[0].equipCnt", "当前规则要求三件激活")
        _validate_skill_patch_reference(
            skill_patch, entry.get("skillID"), f"EquipSuitTable.{suit_id}.list[0].skillID"
        )
        equip_list = suit.get("equipList")
        if not isinstance(equip_list, list) or not equip_list:
            raise AuditFailure(f"EquipSuitTable.{suit_id}.equipList", "套装成员必须为非空数组")
        member_set_slugs = {
            slug
            for member_index, item_id in enumerate(equip_list)
            for slug in gear_item_to_set_slugs.get(
                _non_empty_string(item_id, f"EquipSuitTable.{suit_id}.equipList[{member_index}]"),
                set(),
            )
        }
        if len(member_set_slugs) > 1:
            raise AuditFailure(
                f"EquipSuitTable.{suit_id}.equipList",
                f"套装成员映射到多个旧 slug：{sorted(member_set_slugs)!r}",
            )
        if len(member_set_slugs) == 1:
            suit_matches[suit_id] = next(iter(member_set_slugs))
        else:
            # 旧目录还包含未列入当前最高阶 equipList 的低阶同套装部件。
            folder = suit_id.removeprefix("suit_")
            if folder in folder_to_set_slug:
                suit_matches[suit_id] = folder_to_set_slug[folder]

    local_set_slugs = {record["slug"] for record in local_sets}
    matched_local_set_slugs = set(suit_matches.values())
    missing_suit_ids = sorted(set(suit_table) - set(suit_matches))
    unmapped_local_set_slugs = sorted(local_set_slugs - matched_local_set_slugs)
    duplicate_gear_items = [
        {"gameId": item_id, "slugs": sorted(slugs)}
        for item_id, slugs in sorted(gear_item_to_slugs.items())
        if len(slugs) > 1
    ]

    gap_count = (
        len(missing_weapon_ids)
        + len(unmapped_local_weapon_slugs)
        + len(ambiguous_weapons)
        + len(missing_suit_ids)
        + len(unmapped_local_set_slugs)
        + len(duplicate_gear_items)
    )
    return {
        "schemaVersion": SCHEMA_VERSION,
        "auditStatus": "complete",
        "coverageStatus": "complete" if gap_count == 0 else "partial",
        "sourceVersion": version_id,
        "sourceCounts": {
            "akedbWeapons": len(weapon_table),
            "akedbGearSets": len(suit_table),
            "legacyWeapons": len(local_weapons),
            "legacyGearPieces": len(local_gears),
            "legacyGearSets": len(local_sets),
            "legacySentinels": Counter(record["slug"] == "no-set-bonuses" for record in records)[
                True
            ],
        },
        "weaponCoverage": {
            "mapped": len(weapon_matches),
            "missingGameIds": missing_weapon_ids,
            "unmappedLegacySlugs": unmapped_local_weapon_slugs,
            "ambiguous": ambiguous_weapons,
            "matches": [
                {"gameId": game_id, "slug": slug}
                for game_id, slug in sorted(weapon_matches.items())
            ],
        },
        "gearCoverage": {
            "mappedItemIds": len(gear_item_to_slugs),
            "definitionCount": len(local_gears),
            "duplicateItemMappings": duplicate_gear_items,
        },
        "gearSetCoverage": {
            "mapped": len(suit_matches),
            "missingGameIds": missing_suit_ids,
            "unmappedLegacySlugs": unmapped_local_set_slugs,
            "matches": [
                {"gameId": game_id, "slug": slug}
                for game_id, slug in sorted(suit_matches.items())
            ],
        },
    }
