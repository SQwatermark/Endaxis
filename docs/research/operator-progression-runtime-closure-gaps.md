# 干员养成属性运行时闭环缺口

## 目的

本文记录养成审计中语义已经确认、但当前 Endaxis Next 仍不能无损转换的属性。这里的“不能转换”并非不知道枚举含义，而是 Next 尚未具备与原生方向、公式和生命周期一致的消费链。

结构化结果位于 `all-operator-progression-audit.json`：

- 单条属性事实：`staticAttributeConversion.attributeFacts[].runtimeClosure`；
- 全量汇总：`summary.runtimeClosureGaps`。

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

两项在正式闭环前继续使用 `unsupported-next-attribute`，严格生成模式必须报错，宽松审计模式保留同一潜能中已经可以转换的其他 modifier。

## 证据位置

- `vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Runtime/CombatAttributes.cs`：八槽读取与意志派生治疗属性；
- `vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Runtime/PlayerActiveDamageAttributeResolver.cs`：以太伤害读取防御方承伤倍率；
- `vfs-index-browser/combat-spec/docs/derived-attributes.md`：四维派生公式与版本常量；
- `vfs-index-browser/docs/research/combat/damage-formula.md`：以太抗性因子；
- `src/next/core/combat/runtime/staticPlayerDamageSnapshots.ts`：Next 当前只组装敌方防御快照；
- `docs/architecture/endaxis-next-equipment-persistent-effects-extension-plan.md`：治疗执行器仍属于未来能力。
