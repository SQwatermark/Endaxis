# Endaxis Next 通用语义状态运行时

## 1. 模块定位

`applyStatus`、`consumeStatus` 和 `statusActive` 是 Endaxis 为单敌人排轴模型定义的语义化动作，
不是游戏原始 `BuffData` 的逐字段镜像。它们用于表达强化态、计数器、一次性就绪标记和敌方易伤等
跨技能状态，但最终仍应遵守已确认的 Buff 层数和生命周期边界。

本轮把状态路径分为三层：

1. `CombatStatusContainer` 是一次模拟中的唯一状态所有者；
2. `StatusOperationExecutor` 把编译后的动作交给所有者，并记录施加、消费事实；
3. `CombatStatusRuntime` 在每帧输入和技能执行前推进有限时长，并记录自然到期事实。

投影只消费 `StatusChanged`，不持有第二份状态账本。

## 2. 定义与编译审计

`CombatStepParameters` 允许 `applyStatus` 提供状态键、目标、持续帧、层数、上限和 modifier，
`consumeStatus` 提供状态键、目标和可选消费层数。`compileSkill` 只解析等级值并保持字段是否缺省，
不会补默认层数、上限或消费量。因此运行时不能根据字段可选性自行猜测默认值。

`CombatStatusDefinition` 要求每个状态显式声明：

- 缺省施加层数；
- 缺省层数上限；
- 有限持续帧或明确的无限时长；
- `refresh`、`extend`、`overwrite` 中的一种重复施加时长策略；
- 缺省消费层数或明确的 `all`。

动作上的显式字段可以覆盖定义。本轮没有自动扫描干员 DSL 生成这些定义；在可靠目录或配置接入前，
未知状态会直接报错。

## 3. 反编译证据边界

本地 `combat-spec/docs/buff-lifecycle.md` 已确认以下原生 Buff 行为：

- 增强型实例首次层数为 1，重复施加在上限内增加层数；
- `Refresh` 使用旧剩余时间与新时长的较大值；
- `Extend` 累加时长；
- `OverwriteDuration` 覆盖剩余时长；
- 无限时长单独表达；
- 有限时长随帧阶段推进，到期后结束；
- 保留旧实例的叠层策略不会把实例来源替换成新施加者。

Next 使用整数帧，因而不复制原生以秒为单位的 `1e-5` 浮点容差。持续时间在编译阶段已经转换成
整数帧，状态剩余 1 帧时由下一次 `advanceFrame` 到期。相同帧到期按状态首次插入顺序输出。

以下内容没有被本轮泛化：

- `applyStatus` 缺省字段的全局统一取值；
- 独立实例、优先级队列和十二种完整 Buff stacking type；
- modifier 的注册、刷新和移除；
- 状态定义从 BuffData 或干员 DSL 的自动生成；
- Buff 与语义状态在同一原生实体中的相对更新顺序。

因此带 modifier 的状态目前明确失败，不会只显示状态条却漏算战斗效果。

## 4. StoreAttributeValue 目录边界

`CombatBuffCatalog` 已支持可序列化的 `storeAttributeValue` 生命周期动作。该动作只保存已经确认的
原生语义：来源实体、属性选择方式、`armedNonConverted/finalNonConverted` 阶段、取整开关、
除数、乘数、基础值和目标黑板键。计算顺序固定为：

```text
useFloor = false: base + attribute * multiplier
useFloor = true:  base + floor(attribute / divisor) * multiplier
```

非取整分支不会读取 `divisor`。结果写入当前 Buff 动态黑板后，会立即重建该 Buff 已注册的属性修正。

Buff 实例只保存 `sourceId`，并不直接拥有来源实体。当前实现按以下边界完成读取：

- `CombatAttributeSet.getArmed()` 暴露基础四槽结算后的 Armed 值，`get()` 继续返回 Final 值；
- 两个阶段都接受原生来源掩码，`nonConverted` 明确排除 Converted 来源；
- `CombatAttributeEntityRegistry` 根据 `sourceId` 定位属性集和主副属性元数据；
- specific 读取指定属性，main/secondary 读取实体配置，all 固定求和力量、敏捷、智识、意志；
- `createCombatBuffCatalogAttributeReader()` 将注册表适配为 `readAttribute` port；
- 未知来源和缺失属性会直接报错，不会静默折算为 0。

只有目录实际包含 `storeAttributeValue` 时才要求该 port；缺失会在 catalog 编译阶段报错，而不是延迟到
战斗运行中。`createEnemyElementalBuffRuntime` 可以接收本场战斗的实体属性注册表，并把真实 reader 交给
目录编译器。

当前剩余阻塞位于更上游：场景编译尚未把干员等级、武器和装备结果编译为完整 `CombatAttributeSet`，
`CombatRuntimeAssembly` 的干员程序也没有携带主副属性上下文。因此应用装配层目前必须显式创建并填充
注册表；在面板编译闭环前，不能从 `ScenarioDocument` 自动构造它，更不能用资源运行时中的完整 final
快照冒充 non-converted 或 Armed 值。

## 5. 运行时装配顺序

`CombatRuntimeAssembly` 为敌人与每个干员分别接收可选的 `CombatStatusContainer`，并为本次模拟创建
`CombatStatusRuntime`。逐帧顺序为：

1. 推进战斗时钟与资源；
2. 推进敌方状态；
3. 按队伍顺序推进干员状态；
4. 消费本帧输入；
5. 推进各干员技能和其他能力系统。

这保证到期状态不会被本帧新技能继续读取。敌人与队伍内部顺序是 Endaxis 显式装配顺序；跨实体的
原生注册顺序尚未恢复，不应据此推导多敌人行为。

## 6. 项目持久化

项目 V2 保存用户编辑的技能动作及其显式覆盖，因此用户编辑过的 `applyStatus/consumeStatus` 参数
可以作为 `CombatStepDocument` 持久化。活动状态、剩余帧、当前层数、来源身份和 `StatusChanged`
回执均不属于项目文档，也不会由序列化器保存。

状态定义属于版本化游戏目录或场景编译输入，不应复制到每个技能块或运行时快照。跨周期继承若未来
需要保存，应建立独立的稳定继承输入格式，不能直接序列化 `CombatStatusContainer`。
