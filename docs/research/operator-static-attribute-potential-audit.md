# 干员潜能静态属性转换审计

## 结论

当前 TableCfg 样本包含 29 名有效干员、259 个天赋或潜能效果。潜能中共有 56 条
`attrModifier`，分布在 26 个潜能效果中：

- 11 个潜能效果只包含当前 Next 可无损表达的四维或源石技艺强度加点；
- 15 个潜能效果还包含 Next 尚无等价升级修正的已知属性，只能部分转换；
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

| `attrType` | 原生名称                            | 面板/战斗语义    | 当前转换                      |
| ---------: | ----------------------------------- | ---------------- | ----------------------------- |
|          1 | `MaxHp`                             | 最大生命         | 暂不支持百分比生命升级修正    |
|          3 | `Def`                               | 防御力           | 暂不支持防御面板升级修正      |
|          9 | `CriticalRate`                      | 全局暴击率       | 暂不支持全局暴击率升级修正    |
|         17 | `NormalAttackDamageIncrease`        | 普攻伤害加成     | 暂不支持标签级伤害属性修正    |
|         29 | `HealOutputIncrease`                | 治疗效率         | 暂不支持治疗属性修正          |
|         32 | `NormalSkillDamageIncrease`         | 战技伤害加成     | 暂不支持标签级伤害属性修正    |
|         50 | `PhysicalDamageIncrease`            | 物理伤害加成     | 暂不支持伤害类型属性修正      |
|         52 | `PulseDamageIncrease`               | 电磁伤害加成     | 暂不支持伤害类型属性修正      |
|         53 | `CrystDamageIncrease`               | 寒冷伤害加成     | 暂不支持伤害类型属性修正      |
|         60 | `EtherDamageTakenScalar`            | 以太伤害承受倍率 | 暂不支持受伤倍率属性修正      |
|         87 | `PhysicalAndSpellInflictionEnhance` | 源石技艺强度     | `addPanelStat(artsIntensity)` |

当前样本中的 `attrType` 均已识别，没有遗留未知枚举值。未转换项是 Next 表达能力缺口，
而不是数据含义未知；审计使用 `unsupported-next-attribute` 与真正的
`unknown-attribute-type` 区分二者。

能够转换的条目还必须同时满足：

- 效果条目的 `modifyType = 4`；
- `modifierType = 5`，即 `BaseAddition`；
- `modifyAttributeType = 0`，即 `Specific`；
- 效果条目只有 `attrModifier` 有实际载荷；
- 四维和源石技艺强度的 `attrValue` 是整数点数；
- 不存在未知字段或重复目标。

管理员和安塔尔的 `MaxHp` 使用 `BaseMultiplier = 6`，数值为 `0.1`，语义是百分比生命；
它不是整数面板加点，不能借用 `addPanelStat`。

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
- `PlayerActiveDamageAttributeResolver.cs`、`DamageScaleAttributeInjector.cs`、
  `CombatAttributes.cs`：防御、暴击、治疗、技能类别及伤害类型属性的实际消费点；
- `ReadSkillSettingAction.cs`：原生逻辑读取
  `PhysicalAndSpellInflictionEnhance` 作为附着增强输入；
- `docs/research/arcane-next-evidence.md` 与现有装备生成映射：`attrType 87` 在用户面板中对应
  “源石技艺强度”，Next 稳定字段为 `artsIntensity`。

## 剩余缺口

语义已知但尚不可转换的类型为 `1, 3, 9, 17, 29, 32, 50, 52, 53, 60`。在 Next 新增
通用属性升级修正及明确合并规则前，生成器会继续保留这些项并标记 `potentialEffects` 缺失，
不会用技能组枚举或倍率近似替代。潜能中更常见的 `skillBbModifier`、
`skillParamModifier` 与 `attachBuff` 也仍需分别建立通用转换。
