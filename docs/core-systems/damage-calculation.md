# 伤害计算

## 完整公式

以下公式提取自实际源码 `computeDamage.ts`，与代码逐行对应。

### 普通伤害

```
实际伤害 = floor( shared × 暴击期望乘区 )

shared = 基础值
  × 增伤加算乘区        (1 + Σ dmgBonus)
  × 增伤外部独立乘区    Π(1 + external_dmgBonus_i)    ← 每个 external dmgBonus 独立相乘
  × 增幅乘区            (1 + Σ ampBonus)
  × 直伤倍率乘区        Π directMultiplier_i             ← 每个 directMultiplier 独立相乘
  × 易伤乘区            (1 + susceptibility)
  × 受伤增加加算乘区    (1 + Σ increasedDmgTaken)
  × 受伤增加外部独立乘区 Π(1 + external_increasedDmgTaken_i)
  × 连携层数乘区        linkMult
  × 防御乘区            100 / (max(def, 100) + 100)
  × 抗性乘区            1 - effectiveResistance
  × 失衡乘区            1.3（失衡时） / 1.0（正常）
  × 处决乘区            finisherMult

其中：
  基础值 = ATK × (技能倍率 / 100)
  暴击期望乘区 = 1 + min(critRate, 1.0) × critDmg
```

### 元素反应伤害

```
反应伤害 = 普通伤害 × 反应乘区

反应乘区 = 等级系数 × 源石技艺强度乘区 × 效果倍率

  等级系数（法术反应） = 1 + (干员等级 - 1) / 196
  等级系数（物理反应） = 1 + (干员等级 - 1) / 392
  源石技艺强度乘区     = 1 + artsIntensity / 100
  效果倍率             = reaction.effectiveness
```

---

## 逐乘区详解

以下按源码中 `computeExpectedDamageWithBreakdown` 的计算顺序逐一说明。

### 1. ATK（攻击力）

```typescript
ATK = floor(
  ((operatorBaseAtk + weaponAtk) × (1 + atkPercent) + flatAtk) × attributeBonus
)
```

`attributeBonus` 由四维属性加权求和：

```
attributeBonus = 1
  + 力量系数 × 力量
  + 敏捷系数 × 敏捷
  + 智识系数 × 智识
  + 意志系数 × 意志
```

默认系数：主属性 0.005，副属性 0.002，其余 0（可通过 `attributeAtkPercent` 效果增加）。

### 2. 技能倍率

```
multiplier / 100
```

技能面板上的倍率值（如 155 表示 155%），除以 100 转为小数。

### 3. 增伤加算乘区 dmgBonus

```
1 + Σ dmgBonus
```

所有非 `external` 标记的 dmgBonus 在此**加算**。每个 dmgBonus 可按三维度筛选：

- **元素**（elements）：物理/灼热/寒冷/电磁/自然
- **技能类型**（skillTypes）：重击/战技/连携/终结技 或 `nonSkill`（非技能伤害如反应/燃烧 DOT）
- **技能 ID**（skillId）：特定技能专属

### 4. 增伤外部独立乘区 dmgBonusExternalMult

```
Π (1 + external_dmgBonus_i)
```

标记为 `external: true` 的 dmgBonus **不参与加算**，每个都作为独立的 `(1 + value)` 因子乘入。这是一个伪独立乘区——不和其他 dmgBonus 共享加法池。

### 5. 增幅乘区 ampBonus

```
1 + Σ ampBonus
```

`ampBonus` 独立于 `dmgBonus` 的另一个加法池。两者语义类似但互不干扰。可通过 `ampBonus` 修饰词添加。

### 6. 直伤倍率乘区 directMultiplier

```
Π directMultiplier_i
```

每个 `directMultiplier` 效果独立相乘，不同于百分比加算池。通常用于"伤害倍率变为原本的 1.15 倍"这类效果。

### 7. 暴击期望乘区

```
1 + min(critRate, 1.0) × critDmg
```

用**期望值**而非实际暴击判定：`暴击率 × 暴击伤害 + (1-暴击率) × 1`。

- 基础暴击率：5%（0.05）
- 基础暴击伤害：50%（0.5）
- critRate 上限 1.0（100%）

### 8. 易伤乘区 susceptibility

```
1 + totalSusceptibility

totalSusceptibility = (通用易伤 + 元素易伤) × susceptibilityAmplify
```

`susceptibility` 来自敌人身上的易伤效果，分为：

- **通用易伤**（susceptibility）：所有伤害类型共用
- **元素易伤**（elementalSusceptibility）：针对特定元素

`susceptibilityAmplify` 将易伤值放大：`susceptibilityAmplify = Π (1 + amplify_i)` — 每个 amplify 效果独立相乘。

### 9. 受伤增加加算乘区 increasedDmgTaken

```
1 + 通用increasedDmgTaken + 元素increasedDmgTaken
```

`increasedDmgTaken` 与 `susceptibility` 是两个独立的加法池，分别在公式中作为独立因子。

### 10. 受伤增加外部独立乘区 dmgTakenExternalMult

```
Π (1 + external_increasedDmgTaken_i) × Π (1 + elemental_external_increasedDmgTaken_i)
```

标记为 `external` 的 increasedDmgTaken 效果不参与加算，独立乘入。如 Wrap 等效果使用此机制。

### 11. 连携层数乘区 linkMult

```
linkMult(stacks, skillType):
  战技：1 + [0, 0.30, 0.45, 0.60, 0.75]  ← 层数 0~4
  终结技：1 + [0, 0.20, 0.30, 0.40, 0.50]
  其他：1
```

连携层数由已消耗的连携标记（link stacks）决定。层数上限 4。

### 12. 防御乘区 defMult

```
100 / (max(def, 100) + 100)
```

敌人 DEF 最低为 100。无防御削减时：`100 / (100 + 100) = 0.5`。

DEF 削减（defReduction）来自减防效果，直接降低 `def` 值。此处的 `def` 已扣除削减。

### 13. 抗性乘区 resMult

```
effectiveResistance = enemyResistance - resistanceIgnore - resistanceShred
resMult = 1 - effectiveResistance
```

- `enemyResistance`：敌人的基础抗性（如 0.2 表示 20 抗性 = 80% 伤害）
- `resistanceIgnore`：攻击方穿透抗性（如干员天赋"无视 15 点电磁抗性"）
- `resistanceShred`：目标方减少抗性（如敌人身上的减抗 debuff）

注意：这里使用的是**减法模型**而非除法模型。抗性 20 + 穿透 15 = 有效抗性 5。

### 14. 失衡乘区 staggerMult

```
敌人处于失衡破防状态 ? 1.3 : 1.0
```

### 15. 处决乘区 finisherMult

```
finisherMult = {
  normal: 1.0,
  advanced: 1.25,
  elite: 1.25,
  boss: 1.5,
  leader: 1.75,
}
```

仅对处决（finisher）类动作生效，按敌人阶级（tier）取不同倍率。

---

## 反应伤害专项

反应伤害在普通伤害公式基础上，额外乘入反应乘区。

### 反应基础倍率

| 反应类型            | 倍率公式                   |
| ------------------- | -------------------------- |
| 导电/腐蚀/燃烧/冻结 | 80 × (1 + 反应等级)        |
| 燃烧 DOT            | 12 × (1 + 反应等级) / 每跳 |
| 碎冰                | 120 × (1 + 反应等级)       |
| 元素爆发            | 160                        |
| 倒地/击飞           | 120                        |
| 破防（碎甲）        | 50 × (1 + 反应等级)        |
| 猛击                | 150 × (1 + 反应等级)       |

### 反应等级

反应等级 = 消耗的元素附着层数（1–4）。反应伤害倍率随消耗层数线性增长。

### 等级系数

```
法术反应（导电/腐蚀/燃烧/冻结/爆发）：1 + (等级 - 1) / 196
物理反应（倒地/击飞/破防/猛击）：    1 + (等级 - 1) / 392
```

### 源石技艺强度对反应的加成

```
反应伤害乘区     = 1 + artsIntensity / 100
失衡倍率加成     = 1 + artsIntensity / 200
减益效果增强     = (2 × artsIntensity) / (artsIntensity + 300)
```

减益效果增强应用于：

- 碎甲（Breach）的物理受伤增加
- 导电（Electrification）的法术受伤增加
- 腐蚀（Corrosion）的减抗值

---

## ATK 属性计算详解

### 四维属性分辨率

属性计算分三阶段：

```
Phase 1: 属性基础值 + 属性固定加成
  ↓
Phase 2: × (1 + 属性%加算)   ← 所有非 external 的 attributePercent
  ↓
Phase 3: × Π(1 + external属性%)  ← 所有 external 的 attributePercent，每项独立相乘
  ↓
floor() → 最终属性值
```

### ATK 最终公式

```typescript
ATK = floor(
  ((operatorBaseAtk + weaponAtk) × (1 + atkPercent) + flatAtk) × attributeBonus
)
```

其中 `atkPercent` 来自装备、天赋、效果等所有非 external 的攻击力百分比加成之和。`attributeAtkPercent` 效果不进入 `atkPercent`，而是转化为属性系数（attrAtkCoeff），在 `attributeBonus` 中间接影响 ATK。

---

## 伤害上限

部分敌人有单窗口伤害上限：

```
单窗口 = ceil(time / windowSeconds)
窗口上限 = 敌人最大HP × damageCapRatio
该窗口内累计伤害 ≤ 窗口上限
超出部分被截断 → capped = true
```

---

## LMDI 贡献分解

LMDI 将每次伤害按 10 个因子维度分解，每个维度追踪外部贡献：

| LMDI 因子                 | 追踪的贡献来源                                |
| ------------------------- | --------------------------------------------- |
| (a) base（ATK × 倍率）    | 外部 atkPercent / atkFlat                     |
| (b) dmgBonusMult          | 外部 dmgBonus                                 |
| (b2) dmgBonusExternalMult | 外部 external dmgBonus                        |
| (c) critMult              | 外部 critRate / critDmg                       |
| (d) ampMult               | 外部 ampBonus                                 |
| (e) directMultiplier      | 外部 directMultiplier                         |
| (f) susceptMult           | 外部 susceptibility / elementalSusceptibility |
| (g) dmgTakenMult          | 外部 increasedDmgTaken                        |
| (g2) dmgTakenExternalMult | 外部 external increasedDmgTaken               |
| (h) resMult               | 外部 resistanceIgnore / resistanceShred       |
| (i) linkMult              | 外部连携层数提供者                            |
| (j) staggerMult           | 外部失衡值提供者                              |

每个因子的贡献 δ = L × ln(因子_actual / 因子_self)，其中 L = (D_actual - D_self) / ln(D_actual / D_self) 为对数均值。

分解是**精确的**：Σ 各干员贡献 = 总伤害，不留残差。
