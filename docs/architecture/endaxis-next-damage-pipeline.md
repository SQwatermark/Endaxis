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

有限持续时间既可配置固定数值，也可引用 Buff Blackboard。首次施加在默认值与 AddOptions 合并后解析；`EnhanceAndRefresh` 重复施加时用本次输入单独解析新时长并刷新旧实例，但不覆盖旧实例持有的 Blackboard。引用缺失、类型错误、负值和非有限数都会显式失败。

Buff 周期触发已恢复固定值或 Blackboard 输入的间隔与最大次数。`waitFirstTriggerInterval=false` 时首次 Start 会立即触发，单次 Tick 跨过多个周期会按原生公式逐次补发；次数为零时禁用，负数则作为无限次数继续递减。禁用期间暂停周期计时，但 Buff 生命周期仍正常推进。

`DamageModifier` 已实现侧别、所属实体和条件门控，处理器严格保持配置顺序。当前可执行处理器为计算前后伤害值乘算、计算后的七区增伤与计算前瞬时属性修正；它们都会拒绝生命汲取，且按目标生命类型过滤。瞬时属性处理器通过 DamagePack 端口向指定侧挂载标准 `Instant` 属性修正器，刷新快照后由同一阶段的 `finally` 清理，因此它只影响该阶段捕获的属性，不会泄漏到下一次命中。独立生命和伤害文本处理器尚未接线。

`PlayerDamageOperationExecutor` 已从半程适配器改为驱动完整的标准 `AtkScale` 生命伤害路径：依次触发 `OnBeforeDamageAction`、`OnBeforeCalculateDamage`，执行计算前 modifier，根据刷新后的攻击力计算基础值，注入固定属性对应的七区增伤，执行计算后 modifier，再使用第二次刷新后的攻防属性进入最终公式。生命伤害完成后，才执行同一命中的失衡单元。处决、按状态层数追加倍率、生命汲取仍由显式错误隔离，不会误入标准路径。

元素附着只接受灼热、电磁、寒冷和自然四种类型。`resolveElementalInfliction` 已复刻无附着、同类附着和异类附着三条分支；`ElementalInflictionOperationExecutor` 按“攻击方 Before -> 目标方 Before -> 查询当前附着 -> 顺序应用操作 -> 攻击方 After -> 目标方 After”执行。核心输出语义操作，不保存原生 Buff ID。

`ElementalInflictionBuffAdapter` 已把查询与写入端口接到通用 Buff 容器：它按容器顺序找到首个未结束的附着实例，同类分支先创建爆发 Buff 再增强附着，异类分支核对投影实例后以 `ignite` 结束旧附着，并将原生元素枚举值与消耗层数写入状态 Buff 黑板。具体 Buff ID 和定义解析留在可替换目录接口中，不泄漏到战斗核心。

附着 Buff 的 `OnBuffAfterTryEnhanced -> OnSpellInflictionStart` 已投影为类型化生命周期构造器。它仅在既有实例尝试增强后发布元素类型与当前层数，首次分配不额外发布；达到增强上限时，因原生 AfterEnhance 仍执行，事件也照常发布。

`CombatBuffCatalogDocument` 建立了解包数据与可执行 Buff 定义之间的版本化语义边界。目录只包含 ID、叠层、时长、周期、Blackboard、语义角色和已恢复的生命周期动作，不允许原生表结构或函数回调进入；`compileCombatBuffCatalog` 负责将其编译为 `CombatBuffDefinition`，并为元素附着运行时建立附着、同类爆发和异类状态索引。重复 ID、重复语义角色、缺失运行时角色，以及动作与角色不匹配都会显式失败。目前只开放已有反编译证据的 `AfterEnhance -> ElementalInflictionStarted`，未知动作不作推测。

四系元素附着目录已经由 `combat-spec` 从 1.4.4 BuffData 生成并接入。Endaxis 在加载 JSON 时执行严格结构校验，再将火热、电磁、寒冷和自然四种附着编译为运行时定义；集成测试覆盖四种语义索引、四层上限、20 秒持续时间和第二层附着事件。生成器或数据格式发生未约定变化时会在加载边界直接失败，不会静默丢字段。当前尚未导入同类爆发和异类复合状态目录。

异类附着的 12 个 `try_*` 包装 Buff 已投影为独立的复合状态工厂目录。每条配方保存元素顺序、按消耗层数执行的 SkillSetting 查表、Blackboard 传递和紧接着创建的 Buff ID，不把工厂误写成最终状态。九条配方直接创建最终状态；新附着为自然元素的三条配方先创建额外 wrapper，再按自然异常层数继续分派。

`executeCompoundStatusFactory` 已复刻工厂内部的 `ReadSkillSettingData -> CreateBuffAction` 求值：以一基列号、中点取偶和 float32 边界读取参数，按来源的物理与法术附着增强应用线性或饱和公式，再依据配置复制下一 Buff 的 Blackboard。设置项或列不存在时保留原 Blackboard 值，与原生 `continue` 行为一致。求值器只返回下一 Buff 创建请求；真实 SkillSetting 数据目录和自然 wrapper 尚未接入，因此运行时仍不能把异类反应宣称为完整闭环。

`calculateBreakingAttackValue` 已独立复刻处决基础计算：先将 `Atk * BreakingAttackDamageTakenScalar` 转为 float32，再按原生顺序乘每个 hit 的 `multiplier` 与技能 `atkScale`，每次 float 乘法均保留舍入。当前尚未接入技能执行器，因为现有 `dealDamage` 只保存了技能总倍率，没有保存原生每个 hit 独立的 `multiplier`；执行器继续显式拒绝该分支，直到处决动作树完整导入，避免把多段处决错误归并为单次伤害。

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

1. 导出真实 SkillSetting 数据与增强公式，并投影三种自然 wrapper 与 12 种最终状态；
2. 从 BuffData 投影四种同类爆发，严格补齐事件、伤害与生命周期动作；
3. 将处决逐 hit 的 `multiplier` 导入技能 DSL 后接通 `BreakingAttack`，再实现生命汲取和特殊失衡计算分支；
4. 用真实面板快照和游戏内战斗样本校验整条数值链；
5. 将 receipt 投影到分析面板、合法性诊断和时间轴显示，并在正确性稳定后再做热点优化。

## 5. 证据来源

- `combat-spec/Runtime/PlayerActiveDamageCalculator.cs`
- `combat-spec/Runtime/PlayerActiveDamageAttributeResolver.cs`
- `combat-spec/Runtime/DamageFormula.cs`
- `combat-spec/Actions/AbilityActions.cs` 中的 `PlayerDamageAction`
- `combat-spec/Runtime/Poise.cs`
- `combat-spec/docs/damage-formula.md`
- `combat-spec/docs/buff-and-damage.md`
