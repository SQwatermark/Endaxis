"""把静态装备候选定义 IR 渲染为可评审的中文覆盖报告。"""

from __future__ import annotations

from collections import defaultdict
from typing import Any


GROUP_LABELS = {
    "weaponTrait.skill1": "武器词条 1",
    "weaponTrait.skill2": "武器词条 2",
    "weaponTrait.skill3": "武器词条 3",
    "gearTrait.skill1": "装备词条 1",
    "gearTrait.skill2": "装备词条 2",
    "gearTrait.skill3": "装备词条 3",
    "gearSet.setBonus": "套装效果",
}


def render_candidate_coverage(ir: dict[str, Any]) -> str:
    summary = ir["summary"]
    gaps: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for entry in ir["entries"]:
        if entry["status"] == "dslGap":
            gaps[entry["gap"]["code"]].append(entry)

    lines = [
        "# Endaxis Next 装备候选定义覆盖报告",
        "",
        "本报告回答两件事：构筑期可确定的旧装备效果能否无歧义写成当前 `EquipmentModifierDefinition`；33 条常驻战斗效果应进入静态构筑还是在开战时安装持久 Buff。迁移 IR 可识别、构筑期可求值、角色面板可见和当前 DSL 可表达是不同概念。",
        "",
        "## 结论",
        "",
        f"- 全量 effect：{summary['effectCount']}",
        f"- 构筑期静态贡献：{summary['buildStaticCount']}",
        f"- 可生成候选定义：{summary['definitionReadyCount']}",
        f"- 当前 DSL 缺口：{summary['dslGapCount']}",
        f"- 不属于静态定义适配范围：{summary['outsideStaticDefinitionScopeCount']}",
        f"- 可生成且显示在角色面板：{summary['characterPanelVisibleReadyCount']}",
        f"- 可生成但只作为战斗公式静态输入：{summary['buildOnlyReadyCount']}",
        "",
        "## 33 条常驻战斗效果",
        "",
        f"- 审计总数：{summary['battlePersistentAudit']['effectCount']}",
        f"- 语义上属于构筑静态修正：{summary['battlePersistentAudit']['buildStaticDestinationCount']}",
        f"- 其中可直接写成当前定义：{summary['battlePersistentAudit']['directBuildStaticDefinitionReadyCount']}",
        f"- 必须在开战时安装持久 Buff：{summary['battlePersistentAudit']['persistentBuffRequiredCount']}",
        f"- 当前 DSL 缺口：{summary['battlePersistentAudit']['dslGapCount']}",
        "",
        "| 旧 modifier | 可直接生成 | DSL 缺口 |",
        "| --- | ---: | ---: |",
    ]
    for modifier, counts in summary["battlePersistentAudit"]["modifierStatusCounts"].items():
        lines.append(
            f"| `{modifier}` | {counts.get('definitionReady', 0)} | {counts.get('dslGap', 0)} |"
        )

    lines.extend([
        "",
        "| 维度 | 取值 | 数量 |",
        "| --- | --- | ---: |",
    ])
    for name, counts in (
        ("target", summary["battlePersistentAudit"]["targetCounts"]),
        ("condition", summary["battlePersistentAudit"]["conditionKindCounts"]),
        ("lifecycle", summary["battlePersistentAudit"]["lifecycleCounts"]),
        ("旧运行时路径", summary["battlePersistentAudit"]["legacyRuntimeDispositionCounts"]),
    ):
        for value, count in counts.items():
            lines.append(f"| {name} | `{value}` | {count} |")

    lines.extend([
        "",
        "严格结论：只有 `gearSet:swordmancer:effects[0]` 的无范围 `staggerPercent` 能映射为 `panelStat.staggerDamagePercent`。4 条旧 `self + susceptibility` 并不是对自身施加脆弱；中英文装备目录均将其命名为 `DMG Bonus vs. Staggered`，必须按“攻击失衡目标时增伤”的实时条件处理。",
        "",
        "其余 20 条无条件常驻效果仍属于构筑静态战斗输入，但当前定义缺少治疗效率（9）、最终伤害减免（8）、按技能类型冷却缩减（2）和按技能类型失衡增益（1）。另外 12 条必须成为持久 Buff：显式条件属性/伤害修正 8 条，加上上述对失衡目标增伤 4 条。当前装备定义没有 Buff 蓝图和启动序列，可序列化 Buff 目录也没有条件伤害修正，因此这 12 条目前全部是 DSL 缺口。",
        "",
        "## 来源分组",
        "",
        "| 分组 | 可生成 | DSL 缺口 | 非静态范围 |",
        "| --- | ---: | ---: | ---: |",
    ])
    for group, label in GROUP_LABELS.items():
        counts = summary["groupStatusCounts"].get(group, {})
        lines.append(
            f"| {label} | {counts.get('definitionReady', 0)} | {counts.get('dslGap', 0)} | {counts.get('outsideStaticDefinitionScope', 0)} |"
        )

    lines.extend([
        "",
        "## Modifier 映射",
        "",
        "| 旧 modifier | 可生成 | DSL 缺口 | 非静态范围 |",
        "| --- | ---: | ---: | ---: |",
    ])
    for modifier, counts in summary["modifierStatusCounts"].items():
        lines.append(
            f"| `{modifier}` | {counts.get('definitionReady', 0)} | {counts.get('dslGap', 0)} | {counts.get('outsideStaticDefinitionScope', 0)} |"
        )

    lines.extend(["", "## 语义边界", ""])
    lines.extend([
        "- `attributeFlat` / `attributePercent` 映射到 `attribute`；旧 `sub` 明确转换为 Next 的 `secondary`。百分比由百分数除以 100。",
        "- 攻击、生命、防御、暴击、法术强度和终结技充能效率映射到 `panelStat`。其中百分比类同样转换为小数。",
        "- `dmgBonus` 是构筑期可确定的战斗公式输入，不等于角色面板字段。元素范围明确时按元素映射；仅按技能范围或完全无范围时，映射到除 `lifeDrain` 外的全部 DamageType。",
        "- 旧版完全无范围的“所有技能伤害”只覆盖战技、连携技和终结技；旧 `basicAttack` 范围还包含处决和下落攻击，适配时分别显式展开。",
        "- `ampBonus` 是独立增幅乘区，不能降级为 `damageBonus`。`attributeAtkPercent` 修改四维到攻击力的换算系数，不能降级为 `attackPercent`。",
        "- 候选 IR 不保存 raw fallback。无法闭环的记录只有明确缺口，不会生成看似可用但语义变化的定义。",
        "- 常驻不等于面板静态。带生命值、敌方状态、失衡状态或 Buff 层数条件的效果必须在战斗结算点重新判断，不能把当前真假提前固化进构筑。",
        "",
        "## 重点 modifier 核对",
        "",
    ])
    for modifier, counts in summary["specialModifierAudit"].items():
        lines.append(
            f"- `{modifier}`：effect {counts['effectCount']}，构筑期静态 {counts['buildStaticCount']}，"
            f"可生成 {counts['definitionReadyCount']}，DSL 缺口 {counts['dslGapCount']}，"
            f"持久 Buff {counts['persistentBuffRequiredCount']}，"
            f"作为 trigger 过滤条件 {counts['triggerFilterCount']}。"
        )

    lines.extend([
        "",
        "当前数据中 `ampBonus` 只用于监听已施加状态的 trigger 过滤条件，并不是装备直接提供的静态效果；`attributeAtkPercent` 在本批装备 effect 中未出现。二者仍由适配器显式拒绝近似映射，以防未来数据进入时被静默误转。无元素 `dmgBonus` 的闭环证据详见 `equipment-unscoped-dmgbonus-semantics.md`；常驻战斗效果的旧执行链与 Next 能力证据详见 `equipment-battle-persistent-modifier-audit.md`。",
        "",
        "## 当前 DSL 缺口",
        "",
    ])
    if not gaps:
        lines.append("- 当前真实静态样本没有 DSL 缺口。")
    else:
        for code, entries in sorted(gaps.items()):
            lines.append(f"### `{code}`（{len(entries)}）")
            lines.append("")
            lines.append(entries[0]["gap"]["detail"])
            lines.append("")
            for entry in entries[:5]:
                source = entry["source"]
                lines.append(f"- `{source['sourcePath']}#{source['effectPath']}`")
            lines.append("")

    lines.extend([
        "## 输出用途",
        "",
        "同名 JSON 中，`definitionReady` 记录携带严格构造的 `candidateDefinition`；`dslGap` 记录只携带结构化缺口。该文件用于评审和后续生成器输入，不会写入 `src/next` 正式目录。",
        "",
    ])
    return "\n".join(lines)
