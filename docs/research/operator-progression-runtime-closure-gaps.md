# 干员养成属性运行时闭环缺口

## 目的

本文记录养成审计中语义已经确认、但当前 Endaxis Next 仍不能无损转换的属性。这里的“不能转换”并非不知道枚举含义，而是 Next 尚未具备与原生方向、公式和生命周期一致的消费链。

结构化结果位于 `all-operator-progression-audit.json`：

- 单条属性事实：`staticAttributeConversion.attributeFacts[].runtimeClosure`；
- 全量汇总：`summary.runtimeClosureGaps`。

## AtkIncreaseFactorFromWisd / AtkIncreaseFactorFromWill（attrType 78/79）

当前样本来自黎风第一天赋的隐藏被动 `chr_0015_lifeng_talent_1`。它安装的 Buff 将同一个
`atk_up` 黑板值以 `BaseAddition` 同时写入智识、意志攻击派生系数；两个天赋等级分别为
`0.001` 和 `0.0015`。

这不是普通攻击力百分比。原生属性容器先根据干员主、副属性为四种派生系数提供基础值，再允许
Buff 通过八槽公式修正系数，最后在读取攻击力时动态计算：

```text
Atk.OtherFinalScalar = 1
  + floor(Str)  * AtkIncreaseFactorFromStr
  + floor(Agi)  * AtkIncreaseFactorFromAgi
  + floor(Wisd) * AtkIncreaseFactorFromWisd
  + floor(Will) * AtkIncreaseFactorFromWill
```

Next 当前不能无损消费该 Buff，原因不是公式未知，而是运行时接线尚未完成：

- `resolveOperatorPanel` 已把主、副属性的 `0.005/0.002` 派生倍率提前乘入并向下取整为可见
  `panel.attack`，没有保留派生前的攻击值；
- `StandardPlayerDamageEnvironment` 给每名干员创建的 Buff 容器使用空 `CombatAttributeSet`，
  因而向派生系数注册属性修正会明确失败；
- `resolveStaticPlayerDamageSnapshots` 直接复制静态 `panel.attack`，命中时不会读取运行时属性；
- 法术爆发同样直接读取静态面板攻击，不能只修普通技能命中路径。

正确的闭环方式是让可见面板和运行时属性共享同一份构筑来源、但承担不同职责：面板继续显示战斗
开始前的静态整数结果；场景编译同时保留派生前攻击与四维，战斗装配用 `AttributeMetaTable` 的边界
初始化四维和四个攻击派生系数，并把这一属性集交给该干员唯一的 Buff 容器。每次创建伤害快照或
爆发快照时，再按原生顺序读取修正后的系数并计算攻击。不能用 `panel.attack` 反除旧倍率来恢复
基础值，因为面板已经向下取整，会永久丢失精度。

在上述路径完成前，生成器会把该隐藏被动记录为
`modifies native attributes whose runtime consumers are not connected`，不会生成一个启用后报错的
`passiveSkills` 定义。

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

`EtherDamageTakenScalar` 只有在 Next 存在干员作为防御方的伤害路径后才能转换；届时应写入干员防御快照，而不能复用现有敌人快照。

`AtkIncreaseFactorFromWisd/Will` 只有在干员运行时属性集、动态攻击快照和爆发攻击快照使用同一属性
来源后才能转换；届时仍应保留隐藏被动和内联 Buff，不应改写成静态面板 modifier。

两项在正式闭环前继续使用 `unsupported-next-attribute`，严格生成模式必须报错，宽松审计模式保留同一潜能中已经可以转换的其他 modifier。

## 证据位置

- `vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Runtime/CombatAttributes.cs`：八槽读取与意志派生治疗属性；
- `vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Runtime/PlayerActiveDamageAttributeResolver.cs`：以太伤害读取防御方承伤倍率；
- `vfs-index-browser/combat-spec/docs/derived-attributes.md`：四维派生公式与版本常量；
- `vfs-index-browser/docs/research/combat/damage-formula.md`：以太抗性因子；
- `src/next/core/combat/runtime/staticPlayerDamageSnapshots.ts`：Next 当前只组装敌方防御快照；
- `docs/architecture/endaxis-next-equipment-persistent-effects-extension-plan.md`：治疗执行器仍属于未来能力。
