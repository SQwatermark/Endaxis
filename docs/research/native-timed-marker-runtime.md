# 原生 TimedMarker 运行时映射

## 原生语义

1.4.4 客户端中的定时标记属于目标 `AbilitySystem`，同 ID 创建不会覆盖或刷新旧实例：

1. `CreateTimedMarker` 解析目标、字符串 ID 与持续时间，为每个目标追加独立标记；
2. `CheckTimedMarkerCondition` 读取首目标，检查是否存在同 ID 且仍有效的标记；
3. `returnTrueIfNotExists=true` 对存在结果取反；没有目标时返回失败；
4. 标记剩余时间允许到 `-1e-5`，低于该值才失效；
5. `autoFinishByAction=true` 时，动作结束会移除该动作创建的句柄；否则等待自然到期；
6. `useTimeDilationDt` 决定使用普通或全局缩放后的时间增量。

详细 RVA、字段偏移与生命周期证据记录在 C# 规格库的 `docs/timed-marker-lifecycle.md`。

## Next 映射

Next 新增独立的 `TimedMarkerContainer`，没有把标记伪装成 Buff 或语义状态。DSL 使用：

```ts
{ kind: 'timedMarkerPresent', target: 'caster', markerId: 'voice-cooldown' }

step('createTimedMarker', {
  target: 'caster',
  markerId: 'voice-cooldown',
  durationSeconds: { kind: 'constant', value: 5 },
  autoFinishByAction: false,
})
```

容器由战斗装配层按实体创建，所有技能共享；持续时间读取共享 `CombatClock`，不会另建可漂移的计时器。
同 ID 多实例分别保存，查询只要求至少一个实例有效。动作级清理由执行器保存创建句柄并在 `end` 阶段移除。

## 生成器边界

当前只编译已在根技能条件树中证明为施法者的固定字符串 ID，并支持字面量或数值动作黑板持续时间。
`returnTrueIfNotExists` 映射为条件树的 `not`，不会颠倒成功与失败分支。

以下形状继续失败关闭：

- 从字符串黑板动态解析标记 ID；
- `useTimeDilationDt=true`；
- 尚未证明为施法者或固定单敌人的目标来源；
- 条件树之外尚未结构化消费的标记动作。

本轮全干员审计由 `269/209` 提升为 `269/212`，解除安塔尔第四段普攻与伊冯两段强化普攻的
TimedMarker 条件 blocker。
