# Endaxis Next 静态装备候选定义覆盖报告

本报告只回答构筑期可确定的旧装备效果能否无歧义写成当前 `EquipmentModifierDefinition`。迁移 IR 可识别、构筑期可求值、角色面板可见和当前 DSL 可表达是四个不同概念。

## 结论

- 全量 effect：1052
- 构筑期静态贡献：901
- 可生成候选定义：901
- 当前 DSL 缺口：0
- 不属于静态定义适配范围：151
- 可生成且显示在角色面板：735
- 可生成但只作为战斗公式静态输入：166

## 来源分组

| 分组       | 可生成 | DSL 缺口 | 非静态范围 |
| ---------- | -----: | -------: | ---------: |
| 武器词条 1 |     77 |        0 |          0 |
| 武器词条 2 |     68 |        0 |          0 |
| 武器词条 3 |     63 |        0 |        101 |
| 装备词条 1 |    242 |        0 |          0 |
| 装备词条 2 |    233 |        0 |          7 |
| 装备词条 3 |    198 |        0 |         14 |
| 套装效果   |     20 |        0 |         29 |

## Modifier 映射

| 旧 modifier                | 可生成 | DSL 缺口 | 非静态范围 |
| -------------------------- | -----: | -------: | ---------: |
| `artsIntensity`            |     34 |        0 |          3 |
| `atkFlat`                  |      9 |        0 |          0 |
| `atkPercent`               |     54 |        0 |         33 |
| `attributeFlat`            |    516 |        0 |          0 |
| `attributePercent`         |     21 |        0 |          2 |
| `consume`                  |      0 |        0 |          1 |
| `cooldownReductionPercent` |      0 |        0 |          2 |
| `critRate`                 |     23 |        0 |          3 |
| `damageHit`                |      0 |        0 |          2 |
| `defPercent`               |      0 |        0 |          2 |
| `dmgBonus`                 |    166 |        0 |         63 |
| `flatHp`                   |      9 |        0 |          0 |
| `heal`                     |      0 |        0 |          9 |
| `hpPercent`                |     25 |        0 |          0 |
| `increasedDmgTaken`        |      0 |        0 |         10 |
| `protection`               |      0 |        0 |          8 |
| `shield`                   |      0 |        0 |          1 |
| `spRecovery`               |      0 |        0 |          1 |
| `staggerPercent`           |      0 |        0 |          2 |
| `status`                   |      0 |        0 |          5 |
| `susceptibility`           |      0 |        0 |          4 |
| `ultimateGainEfficiency`   |     44 |        0 |          0 |

## 语义边界

- `attributeFlat` / `attributePercent` 映射到 `attribute`；旧 `sub` 明确转换为 Next 的 `secondary`。百分比由百分数除以 100。
- 攻击、生命、防御、暴击、法术强度和终结技充能效率映射到 `panelStat`。其中百分比类同样转换为小数。
- `dmgBonus` 是构筑期可确定的战斗公式输入，不等于角色面板字段。元素范围明确时按元素映射；仅按技能范围或完全无范围时，映射到除 `lifeDrain` 外的全部 DamageType。
- 旧版完全无范围的“所有技能伤害”只覆盖战技、连携技和终结技；旧 `basicAttack` 范围还包含处决和下落攻击，适配时分别显式展开。
- `ampBonus` 是独立增幅乘区，不能降级为 `damageBonus`。`attributeAtkPercent` 修改四维到攻击力的换算系数，不能降级为 `attackPercent`。
- 候选 IR 不保存 raw fallback。无法闭环的记录只有明确缺口，不会生成看似可用但语义变化的定义。

## 重点 modifier 核对

- `dmgBonus`：effect 229，构筑期静态 166，可生成 166，DSL 缺口 0，作为 trigger 过滤条件 0。
- `ampBonus`：effect 0，构筑期静态 0，可生成 0，DSL 缺口 0，作为 trigger 过滤条件 2。
- `attributeAtkPercent`：effect 0，构筑期静态 0，可生成 0，DSL 缺口 0，作为 trigger 过滤条件 0。

当前数据中 `ampBonus` 只用于监听已施加状态的 trigger 过滤条件，并不是装备直接提供的静态效果；`attributeAtkPercent` 在本批装备 effect 中未出现。二者仍由适配器显式拒绝近似映射，以防未来数据进入时被静默误转。无元素 `dmgBonus` 的闭环证据详见 `equipment-unscoped-dmgbonus-semantics.md`。

## 当前 DSL 缺口

- 当前真实静态样本没有 DSL 缺口。

## 输出用途

同名 JSON 中，`definitionReady` 记录携带严格构造的 `candidateDefinition`；`dslGap` 记录只携带结构化缺口。该文件用于评审和后续生成器输入，不会写入 `src/next` 正式目录。
