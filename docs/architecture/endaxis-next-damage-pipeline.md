# Endaxis Next 玩家主动伤害流水线

## 1. 当前目标

Next 伤害模块以本地 `combat-spec` 中已经由 1.4.4 反编译结果闭环的玩家主动伤害路径为依据。当前只移植确定的纯公式，不从旧版 Endaxis 倒推规则，也不把尚未实现的 Buff、事件或属性系统伪装成默认值。

原生主路径为：

```text
DamageAction
  -> OnBeforeDamageAction
  -> OnBeforeCalculateDamage
  -> BeforeCalculation modifiers
  -> attack calculation / snapshot
  -> damage-scale attribute injection
  -> resolved formula inputs
  -> CalculateDamage
  -> OnBeforeTakeDamage
  -> OnBeforeOutputDamage
  -> health mutation
  -> OnTakeDamage
  -> OnOutputDamage
```

一个 `DamageAction` 内的 `DamageUnit` 按数组顺序执行。对于 Endaxis 当前归一化的普通命中，生命伤害先执行；同一命中携带的失衡值随后进入独立的 Poise 分支。

## 2. 已实现边界

`calculatePlayerActiveDamage` 接收全部解析后的显式数值，输出最终伤害和各乘区结果。已覆盖：

- 暴击判定的 `1e-5` 容差；
- 真实伤害绕过防御和类型抗性；
- 正负防御的两段公式；
- 类型抗性与承伤倍率；
- 弱点、庇护和运行时扩展倍率；
- 已匹配原生 decorate-mask 集合后的燃烧与物理附着倍率；
- `LifeDrain` 独立分支的显式拒绝。

公式保持原生乘算顺序，不在中间步骤舍入。显示层所需的小数位处理只能发生在 projection 或 UI。

`DamageScaleAccumulator` 复刻原生七个乘区。每个乘区分别累计攻击方和防御方来源，再按该区定义合并；最终七区相乘。乘法区在同侧连续乘入 `1 + addition`，其他区在同侧累加 addition。乘区结果为负或 `NaN` 时按原生逻辑钳制为 0。

`resolvePlayerActiveDamageInput` 当前接通标准 `AtkScale` 路径：它将编译后的每击倍率、攻击属性和 DamageScale 最终值合成为 `finalAttackValue`，并按伤害类型选择对应抗性。处决和按状态层数增加倍率仍显式拒绝，直到其运行时输入闭环。

## 3. 输入所有权

纯公式不负责产生以下输入：

- 攻击力与 `attackScale` 计算结果；
- Buff 和活动机制修改后的属性快照；
- DamageScale 各乘区合并结果；
- 暴击随机样本；
- 运行时扩展倍率；
- decorate mask 到特殊伤害倍率开关的目录映射。

这些输入必须由伤害 runtime adapter 根据编译程序和当前战斗状态显式解析。缺少任意必要输入时应报错，不能取旧版 Endaxis 的隐式默认值。

## 4. 后续接线

下一阶段按以下顺序推进：

1. 将属性 modifier 和原生 decorate mask 映射接入 DamageScale 七区；
2. 实现处决 `BreakingAttack` 的输入解析；
3. 在事件分发器中接入计算前和承伤前后的 modifier 边界；
4. 写入生命值并生成结构化 receipt；
5. 在生命伤害之后执行失衡计算、免疫检查、钳制和破防事件；
6. 用佩丽卡战技 fixture 验证“附着 -> 生命伤害 -> 失衡 -> 全队回能”的完整顺序。

## 5. 证据来源

- `combat-spec/Runtime/PlayerActiveDamageCalculator.cs`
- `combat-spec/Runtime/PlayerActiveDamageAttributeResolver.cs`
- `combat-spec/Runtime/DamageFormula.cs`
- `combat-spec/Actions/AbilityActions.cs` 中的 `PlayerDamageAction`
- `combat-spec/Runtime/Poise.cs`
- `combat-spec/docs/damage-formula.md`
- `combat-spec/docs/buff-and-damage.md`
