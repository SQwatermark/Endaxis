"""Next DSL 编译后端的结构化控制流 IR、规范化与 TypeScript 渲染。

本模块不知道任何游戏规则，也不读取来源数据。语义编译器只把已经证明可执行的
叶子表达式交给这里组合；所有结构优化都必须保持子节点顺序，且从叶子向根执行。
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import TypeAlias


@dataclass(frozen=True)
class CompiledAtom:
    """一个已经完成语义编译的不可再分 TypeScript 表达式。"""

    source: str
    semantic_source: str


@dataclass(frozen=True)
class CompiledSequence:
    children: tuple["CompiledNode", ...]


@dataclass(frozen=True)
class CompiledBranch:
    condition_source: str
    when_true: "CompiledNode"
    when_false: "CompiledNode | None" = None


@dataclass(frozen=True)
class CompiledOnce:
    scope_key_source: str
    body: "CompiledNode"


@dataclass(frozen=True)
class CompiledRepeatEachTick:
    body: "CompiledNode"


@dataclass(frozen=True)
class CompiledForEachContextTarget:
    context_key_source: str
    body: "CompiledNode"


CompiledNode: TypeAlias = (
    CompiledAtom
    | CompiledSequence
    | CompiledBranch
    | CompiledOnce
    | CompiledRepeatEachTick
    | CompiledForEachContextTarget
)


EMPTY_SEQUENCE = CompiledSequence(())


def atom(source: str, *, semantic_source: str | None = None) -> CompiledAtom:
    if not source:
        raise ValueError("compiled atom source cannot be empty")
    return CompiledAtom(source, source if semantic_source is None else semantic_source)


def sequence(*children: CompiledNode) -> CompiledSequence:
    """递归规范化子节点，并把任意层级的同步 Sequence 展平成一个有序列表。"""

    flattened: list[CompiledNode] = []
    for child in children:
        normalized = normalize(child)
        if isinstance(normalized, CompiledSequence):
            flattened.extend(normalized.children)
        else:
            flattened.append(normalized)
    return CompiledSequence(tuple(flattened))


def branch(
    condition_source: str,
    when_true: CompiledNode,
    when_false: CompiledNode | None = None,
) -> CompiledNode:
    """在两侧均完成规范化后折叠空分支或执行语义相同的分支。"""

    normalized_true = normalize(when_true)
    normalized_false = None if when_false is None else normalize(when_false)
    if normalized_true == EMPTY_SEQUENCE and (
        normalized_false is None or normalized_false == EMPTY_SEQUENCE
    ):
        return EMPTY_SEQUENCE
    if (
        normalized_false is not None
        and semantic_signature(normalized_true) == semantic_signature(normalized_false)
    ):
        return normalized_true
    return CompiledBranch(condition_source, normalized_true, normalized_false)


def once(scope_key_source: str, body: CompiledNode) -> CompiledNode:
    normalized = normalize(body)
    return EMPTY_SEQUENCE if normalized == EMPTY_SEQUENCE else CompiledOnce(scope_key_source, normalized)


def repeat_each_tick(body: CompiledNode) -> CompiledNode:
    normalized = normalize(body)
    return EMPTY_SEQUENCE if normalized == EMPTY_SEQUENCE else CompiledRepeatEachTick(normalized)


def for_each_context_target(context_key_source: str, body: CompiledNode) -> CompiledNode:
    normalized = normalize(body)
    return (
        EMPTY_SEQUENCE
        if normalized == EMPTY_SEQUENCE
        else CompiledForEachContextTarget(context_key_source, normalized)
    )


def normalize(node: CompiledNode) -> CompiledNode:
    """对任意节点执行一次幂等的叶到根规范化。"""

    if isinstance(node, CompiledAtom):
        return node
    if isinstance(node, CompiledSequence):
        return sequence(*node.children)
    if isinstance(node, CompiledBranch):
        return branch(node.condition_source, node.when_true, node.when_false)
    if isinstance(node, CompiledOnce):
        return once(node.scope_key_source, node.body)
    if isinstance(node, CompiledRepeatEachTick):
        return repeat_each_tick(node.body)
    if isinstance(node, CompiledForEachContextTarget):
        return for_each_context_target(node.context_key_source, node.body)
    raise TypeError(f"unsupported compiled node {type(node)!r}")


def semantic_signature(node: CompiledNode) -> tuple[object, ...]:
    """生成不含来源身份、但严格保留执行结构、参数与顺序的比较签名。"""

    normalized = normalize(node)
    if isinstance(normalized, CompiledAtom):
        return ("atom", normalized.semantic_source)
    if isinstance(normalized, CompiledSequence):
        return (
            "sequence",
            *(semantic_signature(child) for child in normalized.children),
        )
    if isinstance(normalized, CompiledBranch):
        return (
            "branch",
            normalized.condition_source,
            semantic_signature(normalized.when_true),
            None
            if normalized.when_false is None
            else semantic_signature(normalized.when_false),
        )
    if isinstance(normalized, CompiledOnce):
        return ("once", normalized.scope_key_source, semantic_signature(normalized.body))
    if isinstance(normalized, CompiledRepeatEachTick):
        return ("repeatEachTick", semantic_signature(normalized.body))
    if isinstance(normalized, CompiledForEachContextTarget):
        return (
            "forEachContextTarget",
            normalized.context_key_source,
            semantic_signature(normalized.body),
        )
    raise TypeError(f"unsupported compiled node {type(normalized)!r}")


def _indent(source: str, spaces: int) -> list[str]:
    prefix = " " * spaces
    return [prefix + line for line in source.splitlines()]


def render(node: CompiledNode) -> str:
    """只在编译边界末端把规范化 IR 渲染成声明式 TypeScript。"""

    normalized = normalize(node)
    if isinstance(normalized, CompiledAtom):
        return normalized.source
    if isinstance(normalized, CompiledSequence):
        if not normalized.children:
            return "sequence()"
        lines = ["sequence("]
        for child in normalized.children:
            child_lines = _indent(render(child), 2)
            child_lines[-1] += ","
            lines.extend(child_lines)
        lines.append(")")
        return "\n".join(lines)
    if isinstance(normalized, CompiledBranch):
        lines = ["branch("]
        condition_lines = _indent(normalized.condition_source, 2)
        condition_lines[-1] += ","
        lines.extend(condition_lines)
        true_lines = _indent(render(normalized.when_true), 2)
        true_lines[-1] += ","
        lines.extend(true_lines)
        if normalized.when_false is not None:
            false_lines = _indent(render(normalized.when_false), 2)
            false_lines[-1] += ","
            lines.extend(false_lines)
        lines.append(")")
        return "\n".join(lines)
    if isinstance(normalized, CompiledOnce):
        body_lines = _indent(render(normalized.body), 2)
        body_lines[-1] += ","
        return "\n".join(
            ["once(", f"  {normalized.scope_key_source},", *body_lines, ")"]
        )
    if isinstance(normalized, CompiledRepeatEachTick):
        body_lines = _indent(render(normalized.body), 2)
        body_lines[-1] += ","
        return "\n".join(["repeatEachTick(", *body_lines, ")"])
    if isinstance(normalized, CompiledForEachContextTarget):
        body_lines = _indent(render(normalized.body), 2)
        body_lines[-1] += ","
        return "\n".join(
            [
                "forEachContextTarget(",
                f"  {normalized.context_key_source},",
                *body_lines,
                ")",
            ]
        )
    raise TypeError(f"unsupported compiled node {type(normalized)!r}")


def render_sequence_children(node: CompiledNode) -> tuple[str, ...]:
    """在已有 Sequence 容器边界内渲染子表达式，避免重新包裹一层 Sequence。"""

    normalized = normalize(node)
    if isinstance(normalized, CompiledSequence):
        return tuple(render(child) for child in normalized.children)
    return (render(normalized),)
