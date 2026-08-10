# Endaxis Next 战斗运行时

## 1. 目标

战斗核心的目标是：给定已经编译的干员、构筑、敌人和用户操作序列，以确定性帧循环重放玩家主动行为，输出可审计事实。当前重点是排轴器需要的玩家行为；多敌人目标选择和敌人主动 AI 暂不进入主线。

## 2. 装配根

`src/next/core/combat/runtime/combatRuntimeAssembly.ts` 是一次战斗的装配根。它拥有时钟、资源、实体能力系统、输入和回执，并把职责执行器按顺序连接起来。

环境负责提供具体能力，例如：

- 敌人和干员的 Buff runtime；
- 生命账本解析；
- 当前主控身份；
- 伤害、附着和尚未闭环操作的后继执行器。

编译器提供静态程序，环境提供单场状态，装配根负责连接与推进。三者不能相互替代。

## 3. 帧循环

`CombatSimulation` 按注册顺序推进 `FrameRuntime`。注册顺序是战斗语义的一部分，不能依赖对象遍历偶然顺序。

当前主要阶段包括：

1. 资源自然恢复和暂停计时；
2. 敌人 Buff 生命周期；
3. 状态到期；
4. 时间轴用户输入；
5. 各干员 AbilitySystem 和技能动作。

未来接入 `CombatVitalsRuntime` 和活动运行时时，必须依据反编译证据确定相对顺序，而不是按方便插入。

## 4. 技能运行时

`SkillRuntime` 每个技能一份，负责：

- ready/casting/ended 生命周期；
- 冷却与费用帧；
- 当前施法身份；
- 动作黑板；
- timeline action 调度；
- `conditional`、`once` 和同步 sequence；
- 下一技能开始时的已确认中断行为。

项目中的技能块宽度是编辑器时间，不等同于游戏对象自然销毁时间。编译后的 `timelineBlockFrames` 只用于排轴展示和输入，不参与原生生命周期猜测。

## 5. 执行器责任链

单个普通步骤沿责任链传递，由认识该 `kind` 的节点消费：

```text
SkillResourceOperationExecutor
  -> ActionBlackboardOperationExecutor
  -> OperatorControlConditionExecutor
  -> CombatVitalsConditionExecutor
  -> TimedMarkerOperationExecutor
  -> StatusOperationExecutor
  -> BuffOperationExecutor
  -> 环境提供的伤害/附着/其他执行器
  -> strict terminal
```

节点只能消费自己明确支持的步骤或条件，其余必须委托。责任链末端严格报错，禁止把未知步骤当作成功。

## 6. 资源系统

`CombatResources` 维护：

- 全队共享技力；
- 可返还技力；
- 技力自然恢复和暂停；
- 每位干员终结技能量；
- 技力费用转化为全队终结技能量；
- 回能标签与效率。

费用检查、实际扣费和技能步骤产生的资源变化分别记录 receipt。Projection 从相同初始快照和回执生成资源曲线，不另建一套 SP 账本。

## 7. Buff、Status 与 Marker

三者不能因为都表现为“持续效果”而合并：

- **Buff**：原生实例、叠层、黑板、属性/伤害修正和生命周期行为。
- **Status**：Endaxis 语义化战斗状态，用于层数、持续时间和条件查询。
- **Timed marker**：能力系统中的轻量定时标记，不携带完整 Buff 行为。

它们可以共享实体身份和事件，但必须各自拥有明确生命周期。

`CombatBuffContainer` 当前已覆盖部分原生叠层策略、周期触发、DamageModifier 和属性修正；未知叠层方式仍严格拒绝。

## 8. 伤害流水线

玩家主动伤害主要经过：

```text
beforeDamageAction
-> beforeCalculateDamage
-> 计算前 modifier
-> 基础值（攻击倍率/固定值/处决）
-> DamageScale 属性注入
-> 计算后 modifier
-> 暴击、防御、抗性和承伤公式
-> beforeTakeDamage / beforeOutputDamage
-> 生命写入
-> takeDamage / outputDamage
-> receipt
```

同一 Hit 携带的失衡在生命伤害之后进入独立 Poise 分支。完整公式、反编译依据和当前缺口见[玩家主动伤害流水线](../architecture/endaxis-next-damage-pipeline.md)。

## 9. 元素附着与反应

当前已有：

- 四系附着的无附着、同类增强、异类替换三分支；
- 附着 Buff 适配器；
- 复合状态工厂结构；
- SkillSetting 严格 schema 和求值器；
- 部分回执投影。

尚未完整接入当前标准场景环境的内容包括真实复合状态目录、全部反应运行时和终局端到端验证。因此不能把元素模块的单测等同于完整反应模拟已完成。

## 10. 能力预检

`standardPlayerDamageCompatibility.ts` 描述当前标准生命伤害环境的能力边界。它：

- 只扫描结束帧前实际可达的技能动作；
- 递归扫描条件分支和 once body；
- 检查资源组合、伤害分支和装备事件监听器；
- 返回所有结构化问题；
- 在模拟开始前失败。

以后增加能力时，应先扩展环境和测试，再开放预检规则。不能只让预检放行一个尚无执行器的步骤。

## 11. 活动机制

`core/mechanics` 允许关卡、危机合约、影拓丰碑和自定义规则通过 `MechanicAdapter` 编译为纯数据 Contribution。Adapter 可以解释数据源差异，但不能向核心注入任意回调或对象补丁。

这使活动规则能够监听稳定事件并执行有序 sequence，同时保持基础战斗核心可单独测试。

## 12. 确定性与性能

- 全部时间使用整数帧；公式需要时显式使用 float32。
- 随机性通过有状态样本端口注入，不读取全局随机数。
- 同帧事件保持注册顺序，未知顺序必须继续研究。
- 运行时不创建 UI 对象，不进行翻译，不写存档。
- 优化优先放在编译阶段、稳定索引和 projection 缓存，不以复杂隐式状态换取未经测量的性能。
