"""把技能中重复内联的 Buff 蓝图提升为干员级定义表。"""

from __future__ import annotations

import textwrap
from collections import OrderedDict
from difflib import unified_diff

from source_utils import ts_inline_literal


APPLY_BUFF_PREFIX = "step('applyBuff', "


def _find_matching_brace(source: str, start: int) -> int:
    if start >= len(source) or source[start] != "{":
        raise ValueError("expected object opening brace")
    depth = 0
    quote: str | None = None
    escaped = False
    for index in range(start, len(source)):
        char = source[index]
        if quote is not None:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue
        if char in {"'", '"', "`"}:
            quote = char
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index
    raise ValueError("unterminated generated TypeScript object")


def _find_top_level_property(
    source: str, object_start: int, object_end: int, name: str
) -> tuple[int, int] | None:
    depth = 0
    quote: str | None = None
    escaped = False
    line_start = object_start
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
        elif char == "\n":
            line_start = index + 1
        if depth == 1 and index == line_start:
            value_start = index
            while value_start <= object_end and source[value_start] in {" ", "\t"}:
                value_start += 1
            token = f"{name}:"
            if source.startswith(token, value_start):
                value_start += len(token)
                while value_start <= object_end and source[value_start].isspace():
                    value_start += 1
                return line_start, value_start
        index += 1
    return None


def _read_single_quoted_literal(source: str, start: int) -> str:
    if start >= len(source) or source[start] != "'":
        raise ValueError("generated applyBuff buffId must be a single-quoted literal")
    result: list[str] = []
    escaped = False
    for index in range(start + 1, len(source)):
        char = source[index]
        if escaped:
            result.append(char)
            escaped = False
        elif char == "\\":
            escaped = True
        elif char == "'":
            return "".join(result)
        else:
            result.append(char)
    raise ValueError("unterminated generated buffId literal")


def _canonical_definition(source: str) -> str:
    lines = source.strip().splitlines()
    if len(lines) <= 2:
        return "\n".join(lines)
    inner = textwrap.dedent("\n".join(lines[1:-1]))
    return "{\n" + inner + "\n}"


def _definition_table(
    buff_id: str,
    operator_definitions: OrderedDict[str, str],
    shared_definitions: OrderedDict[str, str],
) -> OrderedDict[str, str]:
    return operator_definitions if buff_id.startswith("buff_chr_") else shared_definitions


def _transform_source(
    source: str,
    operator_definitions: OrderedDict[str, str],
    shared_definitions: OrderedDict[str, str],
) -> str:
    result: list[str] = []
    cursor = 0
    while True:
        marker = source.find(APPLY_BUFF_PREFIX, cursor)
        if marker < 0:
            result.append(source[cursor:])
            break
        object_start = marker + len(APPLY_BUFF_PREFIX)
        if object_start >= len(source) or source[object_start] != "{":
            raise ValueError("generated applyBuff parameters must be an object literal")
        object_end = _find_matching_brace(source, object_start)
        object_source = source[object_start : object_end + 1]
        definition_property = _find_top_level_property(
            object_source, 0, len(object_source) - 1, "definition"
        )
        if definition_property is None:
            result.append(source[cursor : object_end + 1])
            cursor = object_end + 1
            continue
        buff_id_property = _find_top_level_property(
            object_source, 0, len(object_source) - 1, "buffId"
        )
        if buff_id_property is None:
            raise ValueError("generated applyBuff definition has no buffId")
        buff_id = _read_single_quoted_literal(object_source, buff_id_property[1])
        property_start, definition_start = definition_property
        if object_source[definition_start] != "{":
            raise ValueError(f"generated Buff definition {buff_id!r} must be an object")
        definition_end = _find_matching_brace(object_source, definition_start)
        transformed_definition = _transform_source(
            object_source[definition_start : definition_end + 1],
            operator_definitions,
            shared_definitions,
        )
        canonical = _canonical_definition(transformed_definition)
        definitions = _definition_table(
            buff_id, operator_definitions, shared_definitions
        )
        previous = definitions.get(buff_id)
        if previous is not None and previous != canonical:
            difference = "\n".join(
                unified_diff(
                    previous.splitlines(),
                    canonical.splitlines(),
                    fromfile="first definition",
                    tofile="conflicting definition",
                    lineterm="",
                    n=2,
                )
            )
            raise ValueError(
                f"Buff {buff_id!r} compiled to multiple operator-level definitions:\n"
                f"{difference}"
            )
        definitions.setdefault(buff_id, canonical)

        removal_end = definition_end + 1
        if removal_end < len(object_source) and object_source[removal_end] == ",":
            removal_end += 1
        if removal_end < len(object_source) and object_source[removal_end] == "\r":
            removal_end += 1
        if removal_end < len(object_source) and object_source[removal_end] == "\n":
            removal_end += 1
        transformed_object = (
            object_source[:property_start] + object_source[removal_end:]
        )
        result.append(source[cursor:object_start])
        result.append(transformed_object)
        cursor = object_end + 1
    return "".join(result)


def link_operator_buff_definitions(
    sources: list[str],
    shared_definitions: OrderedDict[str, str] | None = None,
) -> tuple[list[str], OrderedDict[str, str], OrderedDict[str, str]]:
    """移除定义，并按 buff_chr_ 与只读共享身份分流、去重。"""
    operator_definitions: OrderedDict[str, str] = OrderedDict()
    shared = shared_definitions if shared_definitions is not None else OrderedDict()
    return [
        _transform_source(source, operator_definitions, shared) for source in sources
    ], operator_definitions, shared


def render_operator_buff_definitions(definitions: OrderedDict[str, str]) -> list[str]:
    if not definitions:
        return []
    lines = ["  buffDefinitions: {"]
    for buff_id, definition in definitions.items():
        definition_lines = definition.splitlines()
        lines.append(f"    {ts_inline_literal(buff_id)}: {definition_lines[0]}")
        lines.extend(f"      {line}" for line in definition_lines[1:-1])
        lines.append(f"    {definition_lines[-1]},")
    lines.append("  },")
    return lines


def render_shared_buff_definitions_module(
    definitions: OrderedDict[str, str],
) -> str:
    body = render_operator_buff_definitions(definitions)
    if not body:
        definition_lines = ["export const generatedCommonBuffDefinitions = {} satisfies OperatorBuffDefinitions;"]
    else:
        definition_lines = [
            "export const generatedCommonBuffDefinitions = {",
            *[f"  {line[4:]}" for line in body[1:-1]],
            "} satisfies OperatorBuffDefinitions;",
        ]
    source = "\n".join(definitions.values())
    helpers = {"sequence", "step"}
    for helper in (
        "all",
        "branch",
        "firstMatching",
        "forEachContextTarget",
        "not",
        "once",
        "percentage",
        "percentages",
        "repeatEachTick",
        "scheduled",
        "statusActive",
        "statusStacksExactly",
    ):
        if f"{helper}(" in source:
            helpers.add(helper)
    return "\n".join(
        [
            "/** 由 scripts/generate_next_operators 汇总 BuffData 生成；不要手工编辑。 */",
            "import type { OperatorBuffDefinitions } from '../../../core/game-data/operatorDefinition';",
            f"import {{ {', '.join(sorted(helpers))} }} from '../definitionHelpers';",
            "",
            "// prettier-ignore",
            *definition_lines,
            "",
        ]
    )
