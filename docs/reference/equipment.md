# 装备与套装图鉴

## 概览

Endaxis 收录了 218 件装备件和 23 个套装的数据。

## 装备槽位

每名干员可装备 4 件装备：

| 槽位 | 中文名 | 英文标识 | 主要提供 |
|---|---|---|---|
| 护甲 | Armor | `armor` | 防御力 + 属性 |
| 护手 | Gloves | `gloves` | 属性 + 增伤 |
| 配件 1 | Accessory 1 | `accessory1` | 属性 + 增伤/特殊效果 |
| 配件 2 | Accessory 2 | `accessory2` | 属性 + 增伤/特殊效果 |

## 品质等级

| 等级需求 | 品质 | 精锻上限 |
|---|---|---|
| Lv 1 | 绿（Green） | — |
| Lv 20 | 蓝（Blue） | — |
| Lv 40 | 紫（Purple） | — |
| Lv 70 | 金（Gold） | 3 级 |

## 精锻（Artificing）

Lv70 金色装备支持 0-3 级精锻，每级提升主词条和副词条数值。

## 装备属性结构

每件装备 3 个技能槽：

| 槽 | 说明 |
|---|---|
| skill1 | **主词条** — 固定属性（如意志+65、力量+120） |
| skill2 | **副词条** — 次要属性 |
| skill3 | **副词条** — 额外效果（元素增伤、技能增伤等） |

常见效果类型：
- `attributeFlat` — 四维属性固定值（力量/敏捷/智识/意志）
- `atkPercent` — 攻击力%
- `critRate / critDmg` — 暴击率/暴击伤害
- `dmgBonus` — 元素增伤（按元素筛选）+ 技能增伤（按技能类型筛选）
- `defPercent / hpPercent` — 防御/生命值%

---

## 套装

23 个套装提供 2 件/4 件组合效果。

### 套装完整列表

| 套装中文名 | 英文标识 | 散件数 |
|---|---|---|
| 阿伯莉遗声 | `aburreys-legacy` | 11 |
| 轻超域 | `aethertech` | — |
| 集成重型 | `aic-heavy` | 4 |
| 集成轻型 | `aic-light` | 4 |
| 重装信使 | `armored-msgr` | 9 |
| 碾骨 | `bonekrusha` | 14 |
| 天灾防护 | `catastrophe` | 6 |
| 长息 | `eternal-xiranite` | 6 |
| 拓荒 | `frontiers` | 14 |
| 旧锋 | `grizzled-edge` | 6 |
| 动火用 | `hot-work` | 8 |
| 生物辅助 | `lynx` | 9 |
| M.I.警用 | `mi-security` | 15 |
| 蚀电屏蔽 | `mordvolt-insulation` | 10 |
| 蚀电防护 | `mordvolt-resistant` | 8 |
| 无套装加成 | `no-set-bonuses` | 38 |
| 脉冲式 | `pulser-labs` | 5 |
| 清波 | `qingbo` | 7 |
| 巡行信使 | `roving-msgr` | 9 |
| 点剑 | `swordmancer` | 10 |
| 潮涌 | `tide-surge` | 4 |
| 50式应龙 | `type-50-yinglung` | 11 |
| 壤流 | `xiranflow` | 3 |

### 套装效果示例

**碾骨（Bonekrusha）**：
- 2 件：攻击力 +15%
- 4 件：施放连携技后，下次战技伤害 +30%（最多叠加 2 层）

**旧锋（Grizzled Edge）**：
- 常驻：攻击力 +8%
- 条件：造成猛击或破裂时，物理伤害 +[6%×消耗的最大破防层数]，持续 20 秒。若目标已带物理脆弱、失衡或附着源石晶体，增益翻倍

**蚀电屏蔽 / 蚀电防护**：
- 针对电磁元素伤害的屏蔽/防护型套装

---

## 装备选择策略

1. **属性匹配**：选择与干员主/副属性一致的词条
2. **元素增伤**：匹配干员伤害元素
3. **技能增伤**：根据排轴中使用的技能类型（战技/连携/终结技）选择
4. **套装协同**：4 件激活额外效果，或 2+2 混搭获取多元化增益
5. **精锻投入**：Lv70 金装可精锻 3 级

## 文件组织

```
src/data/gearpieces/
├── <set-name>/              # 按套装分组
│   ├── <name>-armor.ts      # 护甲
│   ├── <name>-gloves.ts     # 护手
│   └── <name>-accessory.ts  # 配件

src/data/gearsets/
├── <set-name>.ts            # 套装效果定义
```
