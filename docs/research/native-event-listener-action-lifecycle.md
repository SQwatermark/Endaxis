# 原生 EventListenerAction 生命周期

## 结论

`EventListenerAction` 不是“技能释放时立即执行一次”的普通动作，也不是永久挂在角色身上的触发器。它会在自身时间区间开始时向 `AbilitySystem` 注册一组事件序列，保存注册句柄，并在动作结束或技能被打断时释放句柄。

因此，生成器和运行时必须同时保留：

- 监听动作相对技能的开始帧与结束帧；
- 监听的原生事件类型；
- 每个事件下按原始顺序排列的动作序列；
- 动作序列的主控/守卫限制；
- 注册优先级与尚未确认的同优先级仲裁边界；
- 事件上下文，例如伤害标签、来源、目标和击杀结果。

不能把监听器内部的 Buff 或伤害动作提升为技能第 0 帧的无条件动作，否则会改变触发时机和条件语义。

## 反编译调用链

静态元数据位于 `combat-runtime-dumps/1.4.4/static/Gameplay.Beyond.dll.cs`：

- `EventListenerAction.ExecuteInternal`：RVA `0x06CF4830`；
- `EventListenerAction.OnEnd`：RVA `0x06CF48D0`；
- `AbilitySystem.RegisterAction`：RVA `0x06CAEFD4`；
- `AbilitySystem._RegisterAction`：RVA `0x06CB5420`；
- `AbilitySystem.TriggerEvent`：RVA `0x030B5150`。

`combat-runtime-dumps/1.4.4/runtime-1/runtime-1-full.analysis.json` 显示：

1. `ExecuteInternal` 调用 `AbilitySystem.RegisterAction(actionMap, environment)`；
2. `RegisterAction` 为每个 `AbilityActionMap` 创建 `SequenceAction`，再交给 `_RegisterAction`；
3. 返回的 `EventActionHandle` 保存到 `EventListenerAction.m_handle`；
4. `OnEnd` 调用该句柄的 `Dispose()`。

这条调用链证明注册行为受 `EventListenerAction` 生命周期约束。当前证据尚不足以确定同一事件、同一优先级下多个动作的最终仲裁顺序，因此新版运行时继续拒绝这类歧义配置。

## 数据样本

全量 SkillData 当前识别到 8 个技能包含事件监听器，事件包括：

- `OnBeforeTakeDamage`；
- `OnAfterKillEntity`；
- `OnAddedBuff`；
- `OnBeforeOutputAirborne`；
- `OnOutputBuff`；
- `OnSkillEnd`；
- `OnBeforeAddedBuff`。

例如萤石连携技中的潜能 Buff 位于 `OnAfterKillEntity` 监听序列内，且先检查伤害装饰标签和黑板值。它不是连携技释放时无条件获得的 Buff。

完整技能、事件与动作类型清单由 `scripts/generate_next_operators/audit_all_operators.py` 生成到 `all-operator-generation-audit.md`。

当前 8 个技能、10 个监听器的逐项动作树和转换缺口见
[原生技能事件监听样本](native-skill-event-listener-samples.md)。解析层已经保留同步响应的完整有序控制流，
但正式 DSL 仍会在事件负载或叶子动作未闭环时严格拒绝生成。

## Endaxis Next 接入状态

`AbilityEventDispatcher` 已支持返回幂等的注册句柄，并允许在所属作用域结束时注销回调或数据动作。分发使用快照，因此本轮事件处理中发生的注销只影响后续事件。

`CombatSemanticEventRuntime` 已按当前反编译和 C# 复刻证据建立统一的语义事件入口。每次事件依次经过：

1. 普通回调；
2. 数据注册动作；
3. 技能实例监听器；
4. 连携系统桥接。

武器、装备、天赋、潜能和技能监听器不再各自解释触发器与条件。它们应向这套运行时注册事件、条件和响应；连携也接收同一事件，但固定处于最后的连携桥接阶段。数据动作按高优先级先执行。当前同优先级项暂按注册顺序稳定执行，这只是确定性边界，不代表原生同优先级仲裁已经得到证明。

统一入口不会抹平生命周期差异：配装和角色级首段连携随参战实例常驻，`EventListenerAction` 仍必须在技能时间区间开始时注册，并在区间结束或技能中断时注销。

尚未完成的部分：

- 建立具有明确类型的事件负载；
- 将伤害标签、来源、目标等事件上下文交给条件执行器；
- 验证并替换当前同优先级注册顺序占位规则。

当前已完成的数据与运行时骨架：

- `listenForCombatEvents` 作为有状态战斗步骤进入普通调度序列；
- 外层 `startFrame/endFrame` 保留原生监听动作区间；
- 编译器解析每条响应中的等级值和有序动作序列；
- 技能阶段注册复用本次释放的动作黑板和操作执行链；
- 调度区间结束、技能自然结束或中断都会幂等注销；
- 编辑器只在调度序列中提供监听步骤，不再引导用户创建缺少生命周期的顶层监听器。

生成器已经可以把无额外上下文限制的 `OnAfterKillEntity` 监听器机械转换为 `enemyDefeated` 与 `listenForCombatEvents`。阿列什终结技中的 `kill_num += 1` 已通过完整编译测试。其余样本仍会因事件负载、主控/守卫限制或叶子动作未闭环而严格失败；不得仅凭事件名把原始动作近似成现有语义步骤。
