# DoOnceAction 原生运行时语义

## 研究目的

部分普通攻击会在引导或周期动作中重复检查条件，但技力只应在第一次满足条件时回复。
生成器此前看到了外层 `DoOnceAction`，却没有读取其 `sequenceActionData`，因此既丢失内部战斗动作，也无法表达跨执行帧共享的一次性状态。

## 静态结构

1.4.4 的 `Beyond.Gameplay.Core.DoOnceAction` 持有两个关键字段：

- `m_executed`：偏移 `0x38`，记录当前动作实例是否已经执行。
- `m_action`：偏移 `0x40`，由 `sequenceActionData` 创建的内部 `SequenceAction`。

相关原生方法 RVA：

| 方法              | RVA          |
| ----------------- | ------------ |
| `ExecuteInternal` | `0x06CF1668` |
| `_TryExecute`     | `0x06CF1888` |
| `OnCreate`        | `0x06CF16D0` |
| `OnEnd`           | `0x06CF1750` |
| `OnReAssign`      | `0x06CF17AC` |
| `OnReset`         | `0x06CF1818` |

证据来自 `combat-runtime-dumps/1.4.4/static/Gameplay.Beyond.dll.cs` 与
`combat-runtime-dumps/1.4.4/runtime-1/IL2CPP_GameAssembly.runtime.runtime-1.bin`。

## 执行语义

`_TryExecute` 首先读取 `m_executed`。值为假时调用内部 `SequenceAction.ExecuteInstant`，随后无条件把
`m_executed` 写为真；值为真时直接跳过内部序列。`ExecuteInternal` 在调用 `_TryExecute` 后固定返回成功，
因此内部序列返回失败不会截断外层序列。

`OnCreate` 将标记初始化为假并创建内部序列。`OnReset` 在重置原因为 `ResetAfterExecute` 时保留标记，
其他重置原因会清除标记；`OnReAssign` 会把内部序列重新分配给新环境。因此一次性状态属于动作实例生命周期，
不是实体级或永久技能级状态。

## Endaxis Next 映射

Next 使用 `once(scopeKey, body)` 表达该控制流：

- 生成器按原始动作路径机械生成 `scopeKey`，不要求人工维护。
- 同一次技能释放中，相同 `scopeKey` 的多个调度副本共享已执行状态。
- 下一次技能释放开始时统一清空状态。
- 内部 `body` 执行后无论返回真假，外层步骤都视为成功。
- 状态不写入动作黑板、项目存档或实体黑板。

这使周期条件中的首次回能可以保留原始触发时机，也避免把 `DoOnceAction` 错误扁平化为每帧都执行的普通序列。

## 当前验证结果

全干员审计中，规则使 `chr_0009_azrila_attack4` 和 `chr_0020_meurs_attack4` 从
`root-action-coverage` 阻塞进入通用 DSL 编译；`chr_0014_aurora_attack3` 也越过动作覆盖检查，并进一步暴露出 `ChannelingAction` 内黑板计算未被顶层解析器展开的问题。后续统一该遍历规则后，该技能已可直接编译。
