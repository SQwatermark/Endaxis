"""把机器可读装备审计渲染为便于评审的中文 Markdown。"""

from __future__ import annotations

from typing import Any


def _table(title: str, values: dict[str, dict[str, Any]]) -> list[str]:
    lines = [
        f"## {title}",
        "",
        "| 类别 | 出现次数 | 涉及文件 | 来源分布 | 示例路径 |",
        "| --- | ---: | ---: | --- | --- |",
    ]
    if not values:
        lines.append("| 无 | 0 | 0 | - | - |")
    for key, entry in values.items():
        examples = "<br>".join(f"`{path}`" for path in entry["paths"][:3])
        source_labels = {"weapon": "武器", "gearPiece": "装备", "gearSet": "套装"}
        sources = "、".join(
            f"{source_labels[source]} {count}"
            for source, count in entry["sourceKindCounts"].items()
        )
        lines.append(
            f"| `{key}` | {entry['count']} | {entry['sourceCount']} | {sources} | {examples} |"
        )
    lines.append("")
    return lines


def render_markdown(report: dict[str, Any]) -> str:
    source_counts = report["sourceCounts"]
    lines = [
        "# Endaxis 旧武器、装备与套装全量生成审计",
        "",
        "本报告由 `scripts/generate_next_equipment` 从旧 TypeScript 数据模块的真实运行时导出结果生成。",
        "导出过程不解析 TypeScript 文本；审计遇到未知字段、类型、效果、修饰、触发器、条件或目标时会终止，因此只有 `status: complete` 的 JSON 才表示本次全量扫描闭环。",
        "",
        "## 数据范围",
        "",
        f"- 武器：{source_counts.get('weapon', 0)}",
        f"- 单件装备：{source_counts.get('gearPiece', 0)}",
        f"- 套装：{source_counts.get('gearSet', 0)}",
        f"- 总计：{sum(source_counts.values())}",
        "",
        "## 结构摘要",
        "",
        f"- 含形态的武器：{report['formCounts'].get('weaponDefinitions', 0)}",
        f"- 武器形态总数：{report['formCounts'].get('weaponVariants', 0)}",
        "- 效果位置：" + "、".join(
            f"`{key}` {value}" for key, value in report["effectLocationCounts"].items()
        ),
        "",
    ]
    lines.extend(_table("Effect kind", report["effectKinds"]))
    lines.extend([
        "> Modifier 统计包含效果实际施加的 `stat`，也包含触发器和条件中用于匹配状态的 stat descriptor；完整路径可以区分两种上下文。",
        "",
    ])
    lines.extend(_table("Modifier", report["modifiers"]))
    lines.extend(_table("Trigger", report["triggers"]))
    lines.extend(_table("Condition", report["conditions"]))
    lines.extend(_table("Target", report["targets"]))
    lines.extend([
        "## 使用限制",
        "",
        "- 本报告只证明旧数据结构已被完整识别，不证明每种行为已经能转换为 Next DSL。",
        "- 每个分类的完整出现路径保存在同名 JSON 报告中，Markdown 只展示前三个示例。",
        "- 在战斗语义和编译边界闭环前，不应据此批量生成不完整装备 DSL。",
        "",
    ])
    return "\n".join(lines)
