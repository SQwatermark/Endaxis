# 干员养成属性运行时闭环缺口

## 目的

本文记录养成审计中需要运行时消费链才能无损转换的属性，并同步标明已经闭环的项目。这里的“缺口”并非不知道枚举含义，而是 Next 尚未具备与原生方向、公式和生命周期一致的消费链。

结构化结果由养成审计脚本生成到
`tmp/all-operator-progression-audit.json`；它是可重建的本地中间产物，不进入 Git：

- 单条属性事实：`staticAttributeConversion.attributeFacts[].runtimeClosure`；
- 全量汇总：`summary.runtimeClosureGaps`。

## AtkIncreaseFactorFromWisd / AtkIncreaseFactorFromWill（attrType 78/79）

当前样本来自黎风第一天赋的隐藏被动 `chr_0015_lifeng_talent_1`。它安装的 Buff 将同一个
`atk_up` 黑板值分别以 `BaseAddition`、`Addition` 写入智识、意志攻击派生系数；两个天赋等级
分别为 `0.001` 和 `0.0015`。

这不是普通攻击力百分比。原生属性容器先根据干员主、副属性为四种派生系数提供基础值，再允许
Buff 通过八槽公式修正系数，最后在读取攻击力时动态计算：

```text
Atk.OtherFinalScalar = 1
  + floor(Str)  * AtkIncreaseFactorFromStr
  + floor(Agi)  * AtkIncreaseFactorFromAgi
  + floor(Wisd) * AtkIncreaseFactorFromWisd
  + floor(Will) * AtkIncreaseFactorFromWill
```

该路径现已闭环：

- `resolveOperatorPanel` 同时保留可见整数攻击、派生前攻击值、四维及主副属性身份；
- 战斗装配为每名有面板的干员创建独占属性集，并与该干员唯一的 Buff 容器共用；
- 四维按原生边界初始化，四个攻击派生系数使用当前版本的 float32 主副属性常量；
- 普通伤害和法术爆发都在产生快照时读取同一运行时属性集，Buff 对系数的修正不会污染静态面板；
- 生成器只对白名单中的四个已接通系数开放转换，其他未知原生属性仍严格阻塞。

可见面板和运行时属性共享同一份构筑来源、但承担不同职责：面板继续显示战斗开始前的静态整数
结果；运行时保留派生前攻击，并在每次伤害快照中重新计算。实现没有用 `panel.attack` 反除旧倍率
恢复基础值，因为面板已经向下取整，那样会永久丢失精度。

Lifeng 第一天赋现已由生成器输出为隐藏 `passiveSkills` 和内联 Buff。应用层回归测试使用正式场景
编译、常驻被动启用、Buff 属性槽和标准伤害执行路径，确认静态面板不变而命中伤害随天赋提高。

## HealOutputIncrease（attrType 29）

当前样本来自 `chr_0011_seraph` 第四潜能，配置为 `BaseAddition +0.1`。

原生八槽属性容器会把该值加入 `HealOutputIncrease` 的基础加算槽。意志派生值也从同一属性读取路径进入该槽；1.4.4 的 `healerEfficiencyOfWILL` 虽为零，但属性和派生入口仍然存在。

当前证据只能确认属性聚合，尚未在复刻库中闭环一次治疗的完整消费公式。Endaxis Next 同样没有：

- 治疗动作执行器；
- 治疗来源与目标快照；
- 治疗公式；
- 治疗前后事件生命周期。

因此不能把它写入面板字段，也不能借用伤害增益。这样做会把治疗专用属性变成错误的用户可见面板或攻击属性。

## EtherDamageTakenScalar（attrType 60）

当前样本来自管理员第四潜能，配置为 `BaseAddition -0.1`。

原生伤害公式在以太伤害分支读取防御方的汇总属性：

```text
(1 - EtherResistance / 100) * EtherDamageTakenScalar
```

`BaseAddition -0.1` 会在八槽聚合后把默认承伤倍率从 `1` 调整为 `0.9`。该属性属于管理员作为受击者时的防御属性，不是管理员造成的以太伤害增益。

Next 已有 `PlayerDamageDefenderSnapshot.resistances.ether.damageTakenMultiplier`，但它表示当前单敌人作为玩家攻击目标时的承伤倍率。把管理员潜能写入该字段会错误地降低敌人的承伤，方向完全相反。

当前 Next 尚未模拟敌人攻击干员，也没有干员受击快照和对应执行路径，因此暂不增加 Upgrade modifier。

## 重新开放转换的条件

`HealOutputIncrease` 只有在治疗公式、快照和事件生命周期均有反编译依据并接入 Next 后才能转换。

`EtherDamageTakenScalar` 在当前标准木桩中通过清单的
`simulationNoEffectAttributeTypes: [60]` 明确隔离，只允许管理员潜能 4 已证明的原生形状；这表示
“当前没有玩家承伤消费者”，不表示效果被删除或已经近似实现。只有在 Next 存在干员作为防御方的
伤害路径后才能恢复运行转换；届时应写入干员防御快照，而不能复用现有敌人快照。

`AtkIncreaseFactorFromWisd/Will` 已满足转换条件，并继续保留隐藏被动和内联 Buff，没有改写成静态
面板 modifier。

其余两项在正式闭环前继续使用 `unsupported-next-attribute`，严格生成模式必须报错，宽松审计模式保留同一潜能中已经可以转换的其他 modifier。

## 证据位置

- `vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Runtime/CombatAttributes.cs`：八槽读取与意志派生治疗属性；
- `vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Runtime/PlayerActiveDamageAttributeResolver.cs`：以太伤害读取防御方承伤倍率；
- `vfs-index-browser/combat-spec/docs/derived-attributes.md`：四维派生公式与版本常量；
- `vfs-index-browser/docs/research/combat/damage-formula.md`：以太抗性因子；
- `src/next/core/combat/attributes/operatorAttackAttributes.ts`：四维派生系数属性集和动态攻击读取；
- `src/next/core/combat/runtime/staticPlayerDamageSnapshots.ts`：普通伤害读取动态攻击；
- `src/next/core/combat/runtime/standardPlayerDamageEnvironment.ts`：Buff 属性集共享及法术爆发读取；
- `docs/architecture/endaxis-next-equipment-persistent-effects-extension-plan.md`：治疗执行器仍属于未来能力。
