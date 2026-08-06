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

`injectDamageScaleAttributes` 已接入玩家主动攻击所需的固定属性映射：伤害类型增伤、普攻/战技/连携/终结技增伤、对失衡目标增伤、对应类型强化和对应类型易伤。爆发与异常伤害使用独立语义分类承载，不要求干员配置保存原生整数 mask。原生 mask 到这些分类的转换属于目录适配阶段。

`resolvePlayerActiveDamageInput` 当前接通标准 `AtkScale` 路径：它将编译后的每击倍率、攻击属性和 DamageScale 最终值合成为 `finalAttackValue`，并按伤害类型选择对应抗性。处决和按状态层数增加倍率仍显式拒绝，直到其运行时输入闭环。

`CombatVitals` 承载一次模拟中的生命值和失衡状态。生命伤害按原生规则先将负伤害钳制为 0，再将生命值钳制到 0；失衡变化使用 `1e-5` 容差、失衡免疫和 `[0, MaxPoise]` 钳制，并返回请求变化量与实际变化量。

失衡恢复由两个 `PeriodicTimer` 顺序驱动，而不是保存额外的“失衡中”布尔值。第一个计时器按 `PoiseRecTime * PoiseRecTimeScalar` 恢复失衡；第二个计时器控制恢复后的破防标签延长时间。恢复完成的同一 Tick 会继续推进第二个计时器，与原生执行顺序一致。状态对象只返回 `poiseRecovered` 和 `poiseBrokenTagEnded` 变化事实，事件层负责将其转换为 AbilityEvent 和 receipt。

`executeHealthDamage` 承载公式完成后的生命伤害写入边界，顺序固定为 `OnBeforeTakeDamage -> OnBeforeOutputDamage -> 扣血 -> receipt -> OnTakeDamage -> OnOutputDamage`。这些事件仍由攻击方的事件环境触发，与原生 `DamageActionExecutor` 一致。

`executePoiseDamage` 先计算 `calculationValue * PoiseDamageOutputScalar * PoiseDamageTakenScalar`，再按 `OnBeforeOutputPoiseDamage -> OnBeforeTakePoiseDamage -> 失衡免疫 -> 失衡写入 -> OnTakePoiseDamage -> OnPoiseZero -> receipt` 执行。两个 Before 事件可修改 `finalDelta`；原生只在它们之前执行一次近零过滤，因此修改后的值不会被重复过滤。

`PlayerDamageOperationExecutor` 将标准 `dealDamage` 步骤接入上述两个写入边界：先根据已完成事件与 modifier 处理的快照解析公式输入，再写入生命值，最后执行同一命中的失衡单元。当前快照由显式依赖提供，表示原生 DamagePack 前置阶段尚未被悄悄省略或替换成默认值。

元素附着只接受灼热、电磁、寒冷和自然四种类型。`resolveElementalInfliction` 已复刻无附着、同类附着和异类附着三条分支；`ElementalInflictionOperationExecutor` 按“攻击方 Before -> 目标方 Before -> 查询当前附着 -> 顺序应用操作 -> 攻击方 After -> 目标方 After”执行。核心输出语义操作，不保存原生 Buff ID；查询和写入端口后续由通用 Buff 容器实现。

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

1. 建立 DamagePack，接入 `OnBeforeDamageAction`、`OnBeforeCalculateDamage` 与计算前后 modifier；
2. 实现处决 `BreakingAttack` 的输入解析；
3. 让通用 Buff 容器实现附着查询与操作写入端口，接通层数、持续时间和附着触发动作；
4. 将失衡恢复产生的状态变化接入 AbilityEvent 与 receipt；
5. 用真实面板快照和游戏内战斗样本校验整条数值链。

## 5. 证据来源

- `combat-spec/Runtime/PlayerActiveDamageCalculator.cs`
- `combat-spec/Runtime/PlayerActiveDamageAttributeResolver.cs`
- `combat-spec/Runtime/DamageFormula.cs`
- `combat-spec/Actions/AbilityActions.cs` 中的 `PlayerDamageAction`
- `combat-spec/Runtime/Poise.cs`
- `combat-spec/docs/damage-formula.md`
- `combat-spec/docs/buff-and-damage.md`
