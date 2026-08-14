# ChannelingAction 原生语义与生成器接入边界

## 结论

`ChannelingAction` 不是“把内部动作执行一次”的普通容器。它在时间轴节点存活期间反复扫描目标，
并同时维护全局扫描节奏和逐目标触发记录。生成器会在固定单敌人、30 Hz 逻辑帧模型下按原生
单精度计时规则展开全部有效触发帧，不再把多次伤害、Buff、黑板写入或投射物压缩到时间轴起点。

触发算法来自 1.4.4 完整运行时快照，并集中在纯函数 `project_channel_trigger_frames`。根时间轴中
满足严格目标约束的引导动作会先展开为共享的一次性动作节点，之后由伤害、条件、Buff、资源、
投射物和能力实体解析器共同消费。

## 运行时字段

`ChannelingAction` 实例包含：

| 偏移    | 字段                     | 作用                             |
| ------- | ------------------------ | -------------------------------- |
| `+0x38` | `m_sequenceAction`       | 每次命中目标时即时执行的子序列   |
| `+0x40` | `m_inputTarget`          | 执行时保存的输入目标句柄         |
| `+0x48` | `m_triggerIntervalTimer` | 本次动作累计计时                 |
| `+0x4C` | `m_actionTriggeredCount` | 已发生的全局扫描次数             |
| `+0x50` | 第一类目标记录表         | 保存目标的触发次数和上次触发时间 |
| `+0x58` | 第二类目标记录表         | 对另一种战斗目标保存相同记录     |
| `+0x60` | `m_checkFrame`           | 逐帧模式下上次扫描的逻辑帧       |

数据字段为 `targetSettings`、`executeEachFrame`、`triggerInterval`、
`maxCountPerTarget`、`targetTriggerInterval` 和 `actionOnTick`。

关键方法 RVA：

- `ExecuteInternal`：`0x06CE1800`
- `OnEnd`：`0x06CE18EC`
- `OnReAssign`：`0x06CE19BC`
- `OnTick`：`0x06CE1A28`
- `OnCreate`：`0x049CD0B0`
- `OnReset`：`0x049DD800`

## 每次执行的初始化

`ExecuteInternal` 会：

1. 保存输入目标；
2. 将累计计时和全局扫描次数清零；
3. 清空两类逐目标记录；
4. 将上次检查帧设为 `-1`；
5. 注册持续 Tick。

因此同一个动作实例再次执行时不会继承上次施放的扫描次数或目标冷却。

`OnEnd` 会结束子序列、释放输入目标并再次清零计时、扫描次数和目标记录。`OnReset` 递归重置子序列。

## OnTick 顺序

每次 `OnTick(deltaTime)` 按下列顺序运行：

1. 用单精度加法执行 `timer += deltaTime`；
2. 读取当前逻辑帧，并把它写入 `m_checkFrame`；
3. `executeEachFrame = true` 且当前帧不同于旧值时，立即进行一次全局扫描；
4. 否则仅当 `timer >= float32(globalCount * triggerInterval)` 时扫描；
5. 每次发生全局扫描都会递增 `globalCount`，即使某个目标随后被逐目标条件挡住；
6. `maxCountPerTarget < 0` 表示次数不限，否则要求目标次数严格小于上限；
7. 目标第一次触发无需等待；后续要求
   `float32(timer - lastTriggerTime) > targetTriggerInterval`，这里是严格大于；
8. 条件成立时通过 `SequenceAction.ExecuteInstant` 执行 `actionOnTick`，随后把目标记录更新为当前时间。

一次宿主更新即使跨过多个周期也只扫描一次，不会用循环补齐遗漏周期。

## 与时间轴帧的关系

已有时间轴生命周期证据确认：

- 时间轴节点在到达起点的更新中先 `Execute`，随后立刻 `Tick`；
- 起止帧相同也会执行 `Execute -> Tick -> End`；
- 到达终点的更新先 Tick，随后 End，因此终点帧包含在可触发区间内；
- 技能施放入口会立即执行 `OnTick(0, 0)`，所以第 0 帧的 `deltaTime` 为零；
- 后续固定逻辑帧的 `deltaTime` 为单精度 `1 / 30`。

这意味着第一次全局扫描总在节点起始帧发生。非零帧启动的节点在第一次扫描前已经累计一个
`1 / 30` 秒的增量，而第 0 帧启动的节点尚未累计时间。该差异会影响后续
`triggerInterval` 阈值，不能只用 `round(seconds * 30)` 生成等差帧列。

逐目标间隔同样必须保留单精度中间结果。例如间隔恰为 `float32(1 / 30)` 时，累计舍入可能使某一帧的
差值略大于该值，从而通过严格大于比较；使用 Python 双精度或整数帧比较会得到不同结果。

## 正式接入原则

正式生成使用统一的“带帧动作出现项”，以下解析器共同消费展开结果：

- 伤害与失衡；
- 条件分支；
- 黑板计算、读取和写入；
- Buff 创建、结束和层数读取；
- 技力与终结技能量变化；
- 元素附着；
- 投射物与能力实体生成。

`Context/Target` 在固定单敌人模型中投影为敌人。`Owner` 表示以动作所有者作为唯一计时目标；只有
tick 子序列完全不读取当前 `Target` 时才可直接展开。若子序列依赖该输入身份，或目标选择器带有查找、
校验和后处理逻辑，生成器仍会立即失败，直到中间层能够显式携带并重绑定输入目标。嵌套在其他语义动作
中的引导也不会被提升为根调度。
