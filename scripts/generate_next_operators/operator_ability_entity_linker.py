"""把技能中重复内联的能力实体蓝图提升为干员级定义表。"""

from __future__ import annotations

from collections import OrderedDict
import textwrap

from operator_buff_linker import (
    _find_matching_brace,
    _read_single_quoted_literal,
)
from source_utils import ts_inline_literal


SPAWN_PREFIX = "step('spawnAbilityEntity', "


def _find_top_level_property(
    source: str, object_start: int, object_end: int, name: str
) -> tuple[int, int] | None:
    """查找格式化或单行对象的一级属性，返回属性名起点和 value 起点。"""
    depth = 0
    quote: str | None = None
    escaped = False
    token = f"{name}:"
    index = object_start
    while index <= object_end:
        char = source[index]
        if quote is not None:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            index += 1
            continue
        if char in {"'", '"', "`"}:
            quote = char
            index += 1
            continue
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
        elif depth == 1 and source.startswith(token, index):
            previous = index - 1
            while previous >= object_start and source[previous].isspace():
                previous -= 1
            if previous >= object_start and source[previous] not in {"{", ","}:
                index += 1
                continue
            value_start = index + len(token)
            while value_start <= object_end and source[value_start].isspace():
                value_start += 1
            return index, value_start
        index += 1
    return None


def _definition_table(
    ability_entity_id: str,
    operator_definitions: OrderedDict[str, str],
    shared_definitions: OrderedDict[str, str],
) -> OrderedDict[str, str]:
    return (
        operator_definitions
        if ability_entity_id.startswith("abilityentity_chr_")
        else shared_definitions
    )


def _transform_source(
    source: str,
    operator_definitions: OrderedDict[str, str],
    shared_definitions: OrderedDict[str, str],
) -> str:
    result: list[str] = []
    cursor = 0
    while True:
        marker = source.find(SPAWN_PREFIX, cursor)
        if marker < 0:
            result.append(source[cursor:])
            break
        object_start = marker + len(SPAWN_PREFIX)
        if object_start >= len(source) or source[object_start] != "{":
            raise ValueError("generated spawnAbilityEntity parameters must be an object literal")
        object_end = _find_matching_brace(source, object_start)
        object_source = source[object_start : object_end + 1]
        definition_property = _find_top_level_property(
            object_source, 0, len(object_source) - 1, "definition"
        )
        if definition_property is None:
            result.append(source[cursor : object_end + 1])
            cursor = object_end + 1
            continue
        id_property = _find_top_level_property(
            object_source, 0, len(object_source) - 1, "abilityEntityId"
        )
        if id_property is None:
            raise ValueError("generated AbilityEntity definition has no abilityEntityId")
        ability_entity_id = _read_single_quoted_literal(object_source, id_property[1])
        property_start, definition_start = definition_property
        if object_source[definition_start] != "{":
            raise ValueError(
                f"generated AbilityEntity definition {ability_entity_id!r} must be an object"
            )
        definition_end = _find_matching_brace(object_source, definition_start)
        transformed_definition = _transform_source(
            object_source[definition_start : definition_end + 1],
            operator_definitions,
            shared_definitions,
        )
        definition_lines = transformed_definition.strip().splitlines()
        canonical = (
            definition_lines[0]
            if len(definition_lines) == 1
            else definition_lines[0]
            + "\n"
            + textwrap.dedent("\n".join(definition_lines[1:]))
        )
        definitions = _definition_table(
            ability_entity_id, operator_definitions, shared_definitions
        )
        previous = definitions.get(ability_entity_id)
        if previous is not None and previous != canonical:
            # 原生模板 ID 只标识公共 AbilityEntityData；不同生成点仍可挂载不同的
            # 子技能蓝图。首个定义继续作为干员级默认值，变体保留在生成步骤本地。
            transformed_object = (
                object_source[:definition_start]
                + transformed_definition
                + object_source[definition_end + 1 :]
            )
            result.append(source[cursor:object_start])
            result.append(transformed_object)
            cursor = object_end + 1
            continue
        definitions.setdefault(ability_entity_id, canonical)

        removal_end = definition_end + 1
        if removal_end < len(object_source) and object_source[removal_end] == ",":
            removal_end += 1
        if removal_end < len(object_source) and object_source[removal_end] == "\r":
            removal_end += 1
        if removal_end < len(object_source) and object_source[removal_end] == "\n":
            removal_end += 1
        removal_start = property_start
        line_start = object_source.rfind("\n", 0, property_start) + 1
        if line_start > 0 and not object_source[line_start:property_start].strip():
            removal_start = line_start
        result.append(source[cursor:object_start])
        result.append(object_source[:removal_start] + object_source[removal_end:])
        cursor = object_end + 1
    return "".join(result)


def link_operator_ability_entity_definitions(
    sources: list[str],
    shared_definitions: OrderedDict[str, str] | None = None,
) -> tuple[list[str], OrderedDict[str, str], OrderedDict[str, str]]:
    operator_definitions: OrderedDict[str, str] = OrderedDict()
    shared = shared_definitions if shared_definitions is not None else OrderedDict()
    linked = [
        _transform_source(source, operator_definitions, shared) for source in sources
    ]
    return linked, operator_definitions, shared


def render_operator_ability_entity_definitions(
    definitions: OrderedDict[str, str],
) -> list[str]:
    if not definitions:
        return []
    lines = ["  abilityEntityDefinitions: {"]
    for ability_entity_id, definition in definitions.items():
        definition_lines = definition.splitlines()
        if len(definition_lines) == 1:
            lines.append(
                f"    {ts_inline_literal(ability_entity_id)}: {definition_lines[0]},"
            )
            continue
        lines.append(f"    {ts_inline_literal(ability_entity_id)}: {definition_lines[0]}")
        lines.extend(f"      {line}" for line in definition_lines[1:-1])
        lines.append(f"    {definition_lines[-1]},")
    lines.append("  },")
    return lines


def render_shared_ability_entity_definitions_module(
    definitions: OrderedDict[str, str],
) -> str:
    body = render_operator_ability_entity_definitions(definitions)
    if not body:
        definition_lines = [
            "export const generatedCommonAbilityEntityDefinitions = {} satisfies OperatorAbilityEntityDefinitions;"
        ]
    else:
        definition_lines = [
            "export const generatedCommonAbilityEntityDefinitions = {",
            *[f"  {line[4:]}" for line in body[1:-1]],
            "} satisfies OperatorAbilityEntityDefinitions;",
        ]
    source = "\n".join(definitions.values())
    helpers: set[str] = set()
    for helper in (
        "all", "branch", "firstMatching", "forEachContextTarget", "not", "once",
        "percentage", "percentages", "repeatEachTick", "scheduled", "statusActive",
        "statusStacksExactly",
    ):
        if f"{helper}(" in source:
            helpers.add(helper)
    helper_import = (
        [f"import {{ {', '.join(sorted(helpers))} }} from '../definitionHelpers';"]
        if helpers
        else []
    )
    return "\n".join(
        [
            "/** 由 scripts/generate_next_operators 汇总 AbilityEntityData 生成；不要手工编辑。 */",
            "import type { OperatorAbilityEntityDefinitions } from '../../../core/game-data/operatorDefinition';",
            *helper_import,
            "",
            "// prettier-ignore",
            *definition_lines,
            "",
        ]
    )
