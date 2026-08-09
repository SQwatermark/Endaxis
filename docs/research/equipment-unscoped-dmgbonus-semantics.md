# 无元素装备 `dmgBonus` 语义核对

## 结论

70 条缺少 `elements` 的构筑期静态 `dmgBonus` 可以无歧义转换，不再需要保留 DSL 缺口：

- 68 条已经显式携带 `skillTypes`，按该技能范围生效；
- 2 条完全无范围，对应游戏文本“所有技能伤害加成”，旧 Endaxis 明确将其限定为战技、连携技和终结技；
- 伤害类型覆盖 `physical`、`true`、`heat`、`electric`、`cryo`、`nature`、`ether`；
- 不包含 `lifeDrain`；
- 旧 `basicAttack` 范围还包含处决和下落攻击，因此转换为 `basicAttack`、`finisher`、`plungingAttack`。

## 样本分布

| 旧 `skillTypes`                       | 数量 |
| ------------------------------------- | ---: |
| `battleSkill`                         |   21 |
| `comboSkill`                          |   20 |
| `ultimate`                            |   12 |
| `battleSkill + comboSkill + ultimate` |   10 |
| `basicAttack`                         |    5 |
| 未填写                                |    2 |

两条未填写样本是 `qingbo-gauntlets` 与 `hot-work-insulation-slab` 的第三词条；游戏本地化均标为“所有技能伤害加成”。其余样本的旧 `skillTypes` 与 `src/i18n/game-locales/zh/gearpieces.json` 中的普通攻击、战技、连携技、终结技或所有技能伤害名称一致。

## 旧 Endaxis 证据

`src/data/types.ts` 的 `DamageElement` 只有物理、灼热、寒冷、电磁和自然五种。`src/data/stats/computeDamage.ts` 的元素匹配规则为：

1. 有 `elements` 时只匹配指定元素；
2. 没有 `elements` 时不进行元素排除；
3. 有 `skillTypes` 时按技能类型匹配；
4. 完全无范围时只匹配 `battleSkill`、`comboSkill`、`ultimate`；
5. `basicAttack` 同时匹配旧 `finalStrike` 和 `dive`。

`src/data/contingencyContracts/criteria.test.ts` 对第 4、5 项有直接断言。它还证明无技能类型的反应伤害不会获得“所有技能伤害”加成。旧代码因此足以确定技能范围，但因为旧伤害类型只有五种，单靠旧代码无法回答 `true/lifeDrain/ether`。

## 原生战斗链证据

特殊伤害类型由本地 C# 复刻库的反编译证据补齐：

- `DamageType` 原生枚举包含 `Physical/Real/Fire/Pulse/Cryst/LifeDrain/Natural/Ether`；
- `DamageScaleAttributeInjector` 先按 DamageType 注入元素增伤，再独立按 `DamageDecorateMask` 注入普通攻击、战技、连携技、终结技增伤；
- `Real` 不读取元素增伤，但仍读取技能类型增伤；复刻库已有 `RealDamageSkipsDamageTypedIncreasesButKeepsSkillTypeIncrease` 测试；
- `Ether` 有独立元素属性，同时走同一套技能类型注入；
- `LifeDrain` 在 `DamagePackData.ResolveFinalAttackValue` 中直接返回原值，绕过 `DamageScales.GetFinalValue()`，公共 DamageModifier 处理器也明确跳过它。

因此，技能类型增伤是否生效由装饰位决定，而不是由五种旧元素限制。`true` 和 `ether` 应包含，`lifeDrain` 必须排除。这不是从 UI 文案猜测，而是旧过滤语义与原生伤害倍率区执行链的交集。

## 适配规则

候选定义适配器采用以下严格规则：

```text
有 elements:
  damageTypes = 对应元素

无 elements:
  damageTypes = physical + true + heat + electric + cryo + nature + ether
  不包含 lifeDrain

无 skillTypes 且无 elements:
  skillTypes = battleSkill + comboSkill + ultimate

skillTypes = basicAttack:
  skillTypes = basicAttack + finisher + plungingAttack
```

该规则只用于静态装备候选定义，不涉及主线事件监听或运行时 Buff 编译。
