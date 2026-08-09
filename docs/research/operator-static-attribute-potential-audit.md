# 干员潜能静态属性转换审计

## 结论

当前 TableCfg 样本包含 29 名有效干员、259 个天赋或潜能效果。潜能中共有 56 条
`attrModifier`，分布在 26 个潜能效果中：

- 16 个潜能效果只包含当前 Next 可无损表达的四维或静态面板基础层修正；
- 10 个潜能效果还包含 Next 尚无等价升级修正的已知战斗属性，只能部分转换；
- 天赋效果中没有 `attrModifier`，因此本切片只扩展潜能转换。

机器可查询的逐干员结果见 `all-operator-progression-audit.json` 的
`staticAttributeConversion`，汇总见 `summary.staticAttributePotentialCounts`。

## 数据依据

四维属性枚举与 Next 字段的对应关系为：

| 原生 `attrType` | Next 属性   |
| --------------: | ----------- |
|              39 | `strength`  |
|              40 | `agility`   |
|              41 | `intellect` |
|              42 | `will`      |

本轮进一步恢复的非四维映射如下。原生名称来自 C# 复刻库由 1.4.4 元数据生成的
`DamageEnums.g.cs`，语义由实际属性消费点交叉确认：

| `attrType` | 原生名称                            | 面板/战斗语义    | 当前转换                                   |
| ---------: | ----------------------------------- | ---------------- | ------------------------------------------ |
|          1 | `MaxHp`                             | 最大生命         | `modifyBasePanelStat(health, percent)`     |
|          3 | `Def`                               | 防御力           | `modifyBasePanelStat(defense, flat)`       |
|          9 | `CriticalRate`                      | 全局暴击率       | `modifyBasePanelStat(criticalRate, flat)`  |
|         17 | `NormalAttackDamageIncrease`        | 普攻伤害加成     | 暂不支持标签级伤害属性修正                 |
|         29 | `HealOutputIncrease`                | 治疗效率         | 暂不支持治疗属性修正                       |
|         32 | `NormalSkillDamageIncrease`         | 战技伤害加成     | 暂不支持标签级伤害属性修正                 |
|         50 | `PhysicalDamageIncrease`            | 物理伤害加成     | 暂不支持伤害类型属性修正                   |
|         52 | `PulseDamageIncrease`               | 电磁伤害加成     | 暂不支持伤害类型属性修正                   |
|         53 | `CrystDamageIncrease`               | 寒冷伤害加成     | 暂不支持伤害类型属性修正                   |
|         60 | `EtherDamageTakenScalar`            | 以太伤害承受倍率 | 暂不支持受伤倍率属性修正                   |
|         87 | `PhysicalAndSpellInflictionEnhance` | 源石技艺强度     | `modifyBasePanelStat(artsIntensity, flat)` |

当前样本中的 `attrType` 均已识别，没有遗留未知枚举值。未转换项是 Next 表达能力缺口，
而不是数据含义未知；审计使用 `unsupported-next-attribute` 与真正的
`unknown-attribute-type` 区分二者。

能够转换的条目还必须同时满足：

- 效果条目的 `modifyType = 4`；
- `modifyAttributeType = 0`，即 `Specific`；
- 效果条目只有 `attrModifier` 有实际载荷；
- 四维、防御与源石技艺强度使用 `modifierType = 5`，即基础加算；
- 暴击率使用基础加算，但允许小数；
- 最大生命使用 `modifierType = 6`，即基础倍率增量，`0.1` 表示 `+10%`；
- 四维属性的 `attrValue` 是整数点数；
- 不存在未知字段或重复目标。

## Next 表达边界

`modifyBasePanelStat` 是构筑编译期能力，不是运行时 Buff：

- `flat` 在静态面板原始值及四维派生值之后、基础倍率之前加算；
- `percent` 以小数累加到基础倍率，倍率下限按原生公式钳制为零；
- 编译结果进入 `ResolvedOperatorPanel`，现有玩家主动伤害快照会读取暴击率；Next 当前不模拟
  玩家承伤，因此最大生命与干员防御暂时只形成准确面板值，尚无对应运行时消费者；
- 伤害类型增伤、技能类型增伤、治疗效率和受伤倍率不属于面板基础层，不能借用此 modifier。

目前生成器只开放数据中已经闭环的四种组合。类型和编译器保留统一的 `flat/percent` 基础层
求值结构，是因为原生八槽公式对所有属性使用同一聚合规则；这不表示生成器可以任意把其他
`attrType` 映射到面板。

## 转换行为

`progression_renderer.parse_static_attribute_progression` 提供两种模式：

- 严格模式用于正式 DSL 生成。任何未知字段、混合载荷、未知属性或修正模式都会报错；
- 宽松模式用于全量审计。它保留已识别的静态属性，并输出结构化 `issues`，同时将
  `potentialEffects` 标为缺失能力。

正式生成仍需在干员清单中显式声明 `compile: "staticAttributes"`。转换器不会根据载荷外形
自动把未审核潜能写入正式定义；清单只声明转换语义，具体属性和值仍完全读取 TableCfg。

## 证据

- `vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Runtime/DamageEnums.g.cs`：
  1.4.4 `AttributeType` 数值与原生名称；
- `AttributeModifiers.cs` 与 `docs/attribute-modifiers.md`：`BaseAddition = 5`、
  `BaseMultiplier = 6` 以及八槽属性公式；
- `CombatAttributes.cs` 与 `docs/derived-attributes.md`：力量派生生命与 `BaseAddition` 一同在
  基础倍率之前进入最大生命计算；
- `TalentAndPotentialModifiers.cs`、`NativeAttributeModifiers.cs` 与
  `docs/character-deck-attributes.md`：潜能修正属于 `Potential` 来源的 Deck 静态 Modifier，
  按已解锁档位累计并进入统一八槽聚合；
- `PlayerActiveDamageAttributeResolver.cs`、`DamageScaleAttributeInjector.cs`、
  `CombatAttributes.cs`：防御、暴击、治疗、技能类别及伤害类型属性的实际消费点；
- `ReadSkillSettingAction.cs`：原生逻辑读取
  `PhysicalAndSpellInflictionEnhance` 作为附着增强输入；
- `docs/research/arcane-next-evidence.md` 与现有装备生成映射：`attrType 87` 在用户面板中对应
  “源石技艺强度”，Next 稳定字段为 `artsIntensity`。

## 剩余缺口

语义已知但尚不可转换的类型为 `17, 29, 32, 50, 52, 53, 60`。在 Next 新增
对应战斗属性容器及明确消费规则前，生成器会继续保留这些项并标记 `potentialEffects` 缺失，
不会用技能组枚举或倍率近似替代。潜能中更常见的 `skillBbModifier`、
`skillParamModifier` 与 `attachBuff` 也仍需分别建立通用转换。

管理员第四潜能同时包含可转换的最大生命 `+10%` 和未支持的以太承伤倍率 `-10%`，因此审计
会保留生命 modifier，但整个潜能仍标为 `partial`；局部成功不能掩盖同一效果中的剩余能力。
