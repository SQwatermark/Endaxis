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

## Endaxis Next 接入状态

`AbilityEventDispatcher` 已支持返回幂等的注册句柄，并允许在所属作用域结束时注销回调或数据动作。分发使用快照，因此本轮事件处理中发生的注销只影响后续事件。

尚未完成的部分：

- 将生成器的 `SkillEventListenerSource` 编译为正式技能程序；
- 让技能时间线在监听区间开始时注册、结束或中断时释放；
- 建立具有明确类型的事件负载；
- 将伤害标签、来源、目标等事件上下文交给条件执行器；
- 验证并实现同优先级仲裁规则。

在这些环节闭环前，含事件监听器的技能必须继续报告为未完整编译。
