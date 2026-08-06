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

`CombatVitalsRuntime` 在变化发生的现场发布这些事实，而不是等整个 Tick 完成后再遍历最终结果。因此即使恢复与破防标签结束发生在同一帧，`OnPoiseRecover` 监听器仍会先观察到尚未结束的破防标签，随后 receipt 才记录标签结束。

`executeHealthDamage` 承载公式完成后的生命伤害写入边界，顺序固定为 `OnBeforeTakeDamage -> OnBeforeOutputDamage -> 扣血 -> receipt -> OnTakeDamage -> OnOutputDamage`。这些事件仍由攻击方的事件环境触发，与原生 `DamageActionExecutor` 一致。

`executePoiseDamage` 先计算 `calculationValue * PoiseDamageOutputScalar * PoiseDamageTakenScalar`，再按 `OnBeforeOutputPoiseDamage -> OnBeforeTakePoiseDamage -> 失衡免疫 -> 失衡写入 -> OnTakePoiseDamage -> OnPoiseZero -> receipt` 执行。两个 Before 事件可修改 `finalDelta`；原生只在它们之前执行一次近零过滤，因此修改后的值不会被重复过滤。

`PlayerDamageContext` 承载每次生命伤害命中的可变 DamagePack 状态。它在创建时捕获初始属性，并严格按“攻击方 modifier -> 防御方 modifier -> 刷新属性快照 -> 清理双方临时属性”的顺序分别执行计算前、计算后两个阶段。计算前对伤害值的乘算先累积，基础攻击计算完成时才应用；计算后乘算直接作用于计算结果。即使 modifier 抛错，双方临时属性也会进入清理流程。

`CombatAttributeSet` 提供 DamagePack 快照之前的统一属性聚合边界。它按原生 `base -> armed -> final` 三阶段应用八个修正槽，保留装备、武器、天赋、卡牌技能、Buff、瞬时修正、转换属性和潜能的来源位掩码，并按修正器对象身份挂载和卸载。属性必须显式提供原生上下限后才能接受 modifier；尚未恢复的主副属性派生规则不会藏进通用容器。DamagePack 阶段结束时只清理 `Instant` 来源，长期 Buff 与配装修正继续保留。

`CombatBuffContainer` 已建立每个实体独立的 Buff 存储、StackingGroup 和 DamageModifier 注册表。每次施加都会创建带稳定实例编号的独立 Buff、DamageModifier 和属性 Modifier；启用阶段按“首次 Start -> 注册伤害修正 -> 挂载属性修正 -> Enable”执行，属性注册失败会回滚本次伤害与属性修正。Disable 在注销前执行动作，Finish 直接结束并卸载，不额外执行 Disable。有限时长使用 `1e-5` 容差结束，禁用实例仍会推进时长。

当前已按原生规则开放 `Unlimited` 和 `EnhanceAndRefresh`。后者在同一 stacking key 下复用尚未结束的实例，依次执行 BeforeEnhance、受上限约束的层数增长与 EnhanceChanged、持续时间刷新、AfterEnhance；达到层数上限时仍会执行前后动作并刷新持续时间。任一侧为无限时长时刷新结果为无限，仅当新时长比剩余时长至少多 `1e-5` 才覆盖。其余十种已登记叠层策略继续明确拒绝，直到各自的 StackingGroup 规则接入。

每个 Buff 实例持有独立 `ActionBlackboard`。构造时先装载 Buff 定义的默认值，再由本次 AddOptions 覆盖；读取明确区分数值和字符串，快照与恢复只作用于该实例。异类元素反应所需的 `consumed_type`、`consumed_layer` 和 `count` 因而可以按原生方式随施加请求进入状态 Buff，而不必改写静态定义。

`DamageModifier` 已实现侧别、所属实体和条件门控，处理器严格保持配置顺序。当前可执行处理器为计算前后伤害值乘算、计算后的七区增伤与计算前瞬时属性修正；它们都会拒绝生命汲取，且按目标生命类型过滤。瞬时属性处理器通过 DamagePack 端口向指定侧挂载标准 `Instant` 属性修正器，刷新快照后由同一阶段的 `finally` 清理，因此它只影响该阶段捕获的属性，不会泄漏到下一次命中。独立生命和伤害文本处理器尚未接线。

`PlayerDamageOperationExecutor` 已从半程适配器改为驱动完整的标准 `AtkScale` 生命伤害路径：依次触发 `OnBeforeDamageAction`、`OnBeforeCalculateDamage`，执行计算前 modifier，根据刷新后的攻击力计算基础值，注入固定属性对应的七区增伤，执行计算后 modifier，再使用第二次刷新后的攻防属性进入最终公式。生命伤害完成后，才执行同一命中的失衡单元。处决、按状态层数追加倍率、生命汲取仍由显式错误隔离，不会误入标准路径。

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

1. 让 Buff 容器实现元素附着查询与操作写入，接通层数、持续时间和附着触发动作；
2. 实现处决 `BreakingAttack`、生命汲取和特殊失衡计算分支；
3. 用真实面板快照和游戏内战斗样本校验整条数值链；
4. 将 receipt 投影到分析面板、合法性诊断和时间轴显示，并在正确性稳定后再做热点优化。

## 5. 证据来源

- `combat-spec/Runtime/PlayerActiveDamageCalculator.cs`
- `combat-spec/Runtime/PlayerActiveDamageAttributeResolver.cs`
- `combat-spec/Runtime/DamageFormula.cs`
- `combat-spec/Actions/AbilityActions.cs` 中的 `PlayerDamageAction`
- `combat-spec/Runtime/Poise.cs`
- `combat-spec/docs/damage-formula.md`
- `combat-spec/docs/buff-and-damage.md`
