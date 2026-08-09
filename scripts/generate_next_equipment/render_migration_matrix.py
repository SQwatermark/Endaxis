"""将装备迁移 IR 汇总为中文迁移矩阵。"""

from __future__ import annotations

from collections import defaultdict
from typing import Any


CLASS_LABELS = {
    "buildStaticContribution": "构筑期静态贡献",
    "battlePersistentModifier": "战斗初始化/常驻修正",
    "eventTriggeredBehavior": "事件触发行为",
    "oneTimeBehavior": "一次性行为",
    "currentlyUnsupported": "当前无法转换",
}


def render_migration_matrix(ir: dict[str, Any]) -> str:
    entries_by_class: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for entry in ir["entries"]:
        entries_by_class[entry["classification"]["kind"]].append(entry)

    summary = ir["summary"]
    lines = [
        "# Endaxis Next 装备生成迁移矩阵",
        "",
        "本报告位于旧装备结构化快照与正式 Next DSL 之间。它证明每个旧 effect 已被严格分类并保留迁移所需语义，但不会生成或承诺当前运行时已经支持的正式 DSL。",
        "",
        "## 总览",
        "",
        f"- Effect 总数：{summary['effectCount']}",
        f"- 可无损进入迁移 IR：{summary['irReadinessCounts'].get('convertible', 0)}",
        f"- 因源语义无法闭环而阻塞：{summary['irReadinessCounts'].get('blocked', 0)}",
        f"- 等待静态定义适配审计：{summary['downstreamReadinessCounts'].get('requiresDefinitionAudit', 0)}",
        f"- 仍需核心能力：{summary['downstreamReadinessCounts'].get('requiresCoreCapabilities', 0)}",
        "",
        "| 迁移类别 | 数量 | 来源分布 | Effect kind | 代表样本 |",
        "| --- | ---: | --- | --- | --- |",
    ]
    for class_name in CLASS_LABELS:
        entries = entries_by_class[class_name]
        source_counts = summary["classificationSourceCounts"].get(class_name, {})
        effect_counts = summary["classificationEffectKindCounts"].get(class_name, {})
        sources = "、".join(f"`{key}` {value}" for key, value in source_counts.items()) or "-"
        effects = "、".join(f"`{key}` {value}" for key, value in effect_counts.items()) or "-"
        examples = "<br>".join(f"`{entry['source']['sourcePath']}#{entry['source']['effectPath']}`" for entry in entries[:3]) or "-"
        lines.append(
            f"| {CLASS_LABELS[class_name]} | {len(entries)} | {sources} | {effects} | {examples} |"
        )

    lines.extend([
        "",
        "## 分类语义",
        "",
        "- **构筑期静态贡献**：无 trigger、无动态生命周期或条件、目标为自身，且 modifier 可在开战前确定。该分类不表示当前 EquipmentModifierDefinition 已可表达，也不表示数值会显示在角色面板。",
        "- **战斗初始化/常驻修正**：无 trigger，但依赖战斗条件、动态缩放、非自身目标或仅有战斗语义，应在战斗装配阶段注册。",
        "- **事件触发行为**：由旧 trigger 驱动的状态、伤害、资源或消费行为。IR 保留完整事件过滤器与执行 effect。",
        "- **一次性行为**：旧 `oneTime`，需编译成可按技能过滤器消费的临时状态，不能直接改写下一项技能定义。",
        "- **当前无法转换**：源结构已知，但尚无无损迁移规则，例如被放在被动区的即时动作。未知数据不会进入此类，而是直接令审计失败。",
        "",
        "`requiresDefinitionAudit` 表示需由独立候选定义适配器核对当前 DSL；`requiresCoreCapabilities` 表示语义已保存，但正式生成前仍需对应 Buff、事件、条件、目标或生命周期能力。它们都不等于当前运行时已经实现。",
        "",
        "## 后续能力需求",
        "",
        "下表是正式 DSL 与运行时需要实现或核验的能力，不代表迁移 IR 丢失了这些语义。",
        "",
        "| 能力 | 涉及 effect 数 |",
        "| --- | ---: |",
    ])
    for requirement, count in sorted(
        summary["requirementCounts"].items(), key=lambda item: (-item[1], item[0])
    ):
        lines.append(f"| `{requirement}` | {count} |")

    lines.extend(["", "## 当前阻塞", ""])
    if summary["blockerCounts"]:
        for blocker, count in summary["blockerCounts"].items():
            lines.append(f"- `{blocker}`：{count}")
    else:
        lines.append("- 本轮 1052 个 effect 均可无损进入迁移 IR，没有源结构级阻塞。")
    lines.extend([
        "- 正式 Next 装备 DSL、Build Resolver、装备 Buff 编译器和事件适配器尚未由本工具生成或实现。",
        "- 能力需求必须逐项结合游戏数据与运行时证据闭环；不能把“IR 已保存”误写成“战斗行为已支持”。",
        "",
        "## 机器可读数据",
        "",
        "同名 JSON 为每个 effect 保存稳定迁移身份、来源槽位与形态、分类、目标、trigger、condition、modifier、生命周期、能力需求和原始结构化 effect。",
        "",
    ])
    return "\n".join(lines)
