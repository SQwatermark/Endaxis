# 干员潜能四维属性转换审计

## 结论

当前 TableCfg 样本包含 29 名有效干员、259 个天赋或潜能效果。潜能中共有 56 条
`attrModifier`，分布在 26 个潜能效果中：

- 9 个潜能效果只包含已确认的四维永久加点，可以无损转换；
- 17 个潜能效果同时包含四维加点与未知属性类型或不同修正模式，只能部分识别，不能宣称已完整转换；
- 天赋效果中没有 `attrModifier`，因此本切片只扩展潜能转换。

机器可查询的逐干员结果见 `all-operator-progression-audit.json` 的
`buildAttributeConversion`，汇总见 `summary.buildAttributePotentialCounts`。

## 数据依据

四维属性枚举与 Next 字段的对应关系为：

| 原生 `attrType` | Next 属性   |
| --------------- | ----------- |
| 39              | `strength`  |
| 40              | `agility`   |
| 41              | `intellect` |
| 42              | `will`      |

能够转换的条目还必须同时满足：

- `modifierType = 5`；
- `modifyAttributeType = 0`；
- 效果条目的 `modifyType = 4`；
- 效果条目只有 `attrModifier` 有实际载荷；
- `attrValue` 是整数点数；
- 不存在未知字段或重复属性。

以上限制用于表达本次数据中可以闭环确认的“永久增加养成四维”形状，不能推广为所有
`attrModifier` 的通用解释。

## 转换行为

`progression_renderer.parse_build_attribute_progression` 提供两种模式：

- 严格模式用于正式 DSL 生成。任何未知字段、混合载荷、未知属性或未知修正模式都会报错；
- 宽松模式用于全量审计。它保留已识别的四维加点，并输出结构化 `issues`，同时将
  `potentialEffects` 标为缺失能力。

正式生成仍需在干员清单中显式声明 `compile: "buildAttributes"`。转换器不会根据载荷外形
自动把未审核潜能写入正式定义；清单只声明转换语义，具体属性和值仍完全读取 TableCfg。

## 剩余缺口

下一步应优先为混合潜能中的非四维 `attrType` 建立面板字段语义和运行时消费证据。除此之外，
潜能中更常见的 `skillBbModifier`、`skillParamModifier` 与 `attachBuff` 仍需分别建立通用转换，
不能借用四维属性转换器或仅凭字段名称猜测行为。
