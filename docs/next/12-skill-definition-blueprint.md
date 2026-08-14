# SkillDefinition 数据结构蓝图

本文定义 Endaxis Next 技能声明结构的目标契约，可直接指导核心类型、严格校验、技能编辑器、编译器和运行时实现。文中的“必须”是设计约束；“当前状态”用于区分已有代码与尚待贯通的能力。

## 1. 结构总览

```text
SkillGroupDefinition
  -> SkillDefinition | SkillDefinition[]
       -> blackboard
       -> availability
       -> costs / cooldown / costFrame
       -> scheduledSequences[]
            -> ActionSequenceDefinition
                 -> CombatStepDefinition[]
                      -> 普通步骤
                      -> conditional 分支
                      -> once 包装
       -> scheduledSequences[] 中的 listenForCombatEvents 步骤
```

首段连携入口不属于单次技能释放，配置在 `OperatorDefinition.comboSkillRegistrations`；多段连携的后续窗口由技能序列中的 `openComboWindow` 步骤开启。

游戏数据中的技能模板和项目中的完整自定义技能使用同一个结构。项目版本可以使用可变数组和 JSON 友好的接口，数据 TS 可以使用 `readonly`；字段语义必须完全一致。

## 2. 顶层 SkillDefinition

```ts
interface SkillDefinition {
  key: string;
  blackboard?: Readonly<Record<string, LevelValues>>;
  timelineBlockFrames: number;
  availability?: CombatCondition;
  cooldownFrames?: LevelValues;
  costs?: readonly SkillCostDefinition[];
  costFrame?: number;
  scheduledSequences: readonly ScheduledSequenceDefinition[];
  eventHandlers?: readonly CombatEventHandlerDefinition[]; // 旧近似数据，待迁移后删除
}
```

| 字段                  | 语义与约束                                                                           |
| --------------------- | ------------------------------------------------------------------------------------ |
| `key`                 | 技能在技能组内的稳定战斗身份；自定义技能保留原值，普通编辑器不得修改。               |
| `blackboard`          | 每次释放开始时恢复的动作黑板初值；值按当前技能等级解析，只在本次释放生命周期内有效。 |
| `timelineBlockFrames` | 时间轴技能块宽度，由可操作边界推导；非原生自然结束时间，不参与执行结束判断。         |
| `availability`        | 合法性诊断条件；不成立时仍执行用户已排入时间轴的技能。                               |
| `cooldownFrames`      | 单次充能冷却周期；当前必须解析为正整数。                                             |
| `costs`               | 技能固有费用；当前原生证据只允许一项费用。                                           |
| `costFrame`           | 相对释放帧的实际扣费点；存在费用时必须提供。                                         |
| `scheduledSequences`  | 技能主体逻辑，按相对帧调度。                                                         |
| `eventHandlers`       | 旧手写近似数据。缺少原生监听区间，编译器继续拒绝；迁移完成后删除。                   |

名称、描述、图标和形态文本不属于此结构；它们通过技能身份进入 i18n 和展示目录。

## 3. 公共值类型

### 3.1 等级值

```ts
type LevelValues = number | readonly number[];
```

单值表示所有等级相同；数组第 `level - 1` 项表示该等级。数组越界、非有限值和不符合目标字段整数约束的结果必须在编译阶段报错。存档不得只保存当前等级展开值。

### 3.2 动作值操作数

```ts
type ActionValueOperand = { kind: 'blackboard'; key: string } | { kind: 'constant'; value: number };
```

`blackboard` 从当前释放的动作黑板读取；缺失数值键的具体处理必须由唯一黑板实现定义，组件不得自行提供另一套默认规则。`constant` 是运行时常量，不等同于 `LevelValues`。

### 3.3 目标与资源

- `CombatTarget`：`caster | enemy`。
- `BuffApplicationTarget`：`caster | enemy | party`。
- `CombatResource`：`sp | ultimateEnergy`。
- `ResourceRecipient`：`caster | team`。

如果某步骤只能作用于敌人，应由其类型固定为 `enemy` 或省略目标字段，而不是提供隐藏默认值。

## 4. 调度与有序序列

```ts
interface ScheduledSequenceDefinition {
  startFrame: number;
  endFrame?: number;
  sequence: ActionSequenceDefinition;
}

interface ActionSequenceDefinition {
  steps: readonly CombatStepDefinition[];
}
```

调度项不保存显式 `key`。它只负责“某个相对帧执行一组有序步骤”，编译器可以按技能身份和定义内路径机械派生调试身份。需要被连线或构筑修正直接引用的是具体步骤，应在对应步骤上配置稳定 `key`；不能为了内部实现方便要求数据维护者给每个调度项填写无意义 ID。

执行规则：

- `startFrame`、`endFrame` 使用相对释放帧的非负整数。
- `endFrame` 只用于具有结束生命周期的区间步骤，且不得小于 `startFrame`。
- 调度项按开始帧升序；同帧按定义中的原始顺序。
- 第 0 帧在技能启动调用内立即执行。
- 无 `endFrame` 的点序列执行后立即调用结束。
- 有 `endFrame` 的序列在活动期间逐帧 tick，并在到达边界时结束。
- `steps` 严格按数组顺序同步执行，普通步骤返回 `false` 时停止后续步骤。
- 未知步骤不得当作成功空操作。

## 5. CombatStep 公共结构

```ts
type CombatStepForKind<K extends CombatStepKind> = {
  key?: string;
  kind: K;
  parameters: CombatStepParameters[K];
} & NestedBodyFor<K>;
```

`key` 的作用域是单个技能定义。只有可编辑、可连线、可被构筑修正引用或需要跨版本稳定匹配的步骤必须有键；目录生成器应机械生成，不能要求维护者手写无意义 ID。项目新增步骤使用 `custom:<uuid>`。

## 6. 伤害与失衡组件

### `dealDamage`

字段：`damageType`、可选 `calculation`、`attackScale`、可选 `calculationMultiplier`、`tags`、可选 `stagger`、可选 `attackScalePerStatusStack`。

执行时先求基础伤害倍率；若配置按状态层数增加倍率，则读取目标状态层数并累加。随后进入指定伤害公式、来源增伤、目标承伤、防御和抗性链。`stagger` 属于同一次命中，在生命伤害之后结算。该步骤产生可投影和连线的命中回执。

### `dealFixedDamage`

字段：`damageType`、`value`、`tags`、可选 `stagger`。固定值替代“攻击力乘倍率”的基础阶段，后续增伤、防御、抗性与普通伤害一致；不是无视防御的真实伤害。失衡仍在生命伤害后结算。

### `dealStagger`

字段：`value`。不产生生命伤害，只向敌人失衡账本写入失衡值，并经过已确认的来源和目标失衡倍率。

## 7. 元素组件

### `applyElementalInfliction`

字段：`element`、`isExtra`。把附着请求交给版本化元素附着状态机，由状态机按当前附着决定普通附着、额外附着、爆发或复合状态；步骤本身不得手写反应分支。

### `applyElementalReaction`

字段：`reaction`、`target`、`durationSeconds`、`effectiveness`。直接建立指定复合反应状态，用于已知原生动作明确创建反应的场景。

### `consumeElementalReaction`

字段：`reaction`，目标固定为敌人。消费对应反应状态并触发其结束/消费事件；不存在时的返回语义必须由反应运行时统一定义。

## 8. Buff 组件

### `applyBuff`

字段：`buffId`、`definition`、`target`、可选 `count`、`source`、`blackboardAssignments`、`inheritSourceSkillCastInfo`、`durationSeconds`、`effectiveness`。

`definition` 是当前步骤内联携带的完整 Buff 蓝图，`buffId` 用于叠层、查询和结束，不作为全局定义引用。按目标解析接收者，并按 `count` 重复创建；正小数沿用原生 `int < float` 循环语义。黑板赋值在创建时求值并覆盖定义默认值。`source` 与接收目标独立。继承释放信息时，新 Buff 能追溯本次技能身份和未返还技力消耗。

`definition.presentation.iconPath` 保存 Endaxis 内部图标路径。`presentation` 只服务编辑器和时间轴投影，编译时会从战斗定义中剥离，不能参与 Buff 身份、叠层或数值逻辑。

Buff 生命周期行为通过 `definition.lifecycleSequences` 表达，序列内容与技能主体共用 `ActionSequenceDefinition` 和 `CombatStepDefinition`：

| 边界             | 执行时机                                     |
| ---------------- | -------------------------------------------- |
| `start`          | 实例第一次启用时，注册属性和伤害修正之前。   |
| `enable`         | 每次启用时，注册修正之后。                   |
| `disable`        | 暂停生效、注销修正之前。                     |
| `beforeEnhance`  | 同组实例准备增加强化层数之前。               |
| `enhanceChanged` | 强化层数已经增加之后。                       |
| `afterEnhance`   | 本次强化流程完成之后。                       |
| `trigger`        | 启用期间按 `triggerIntervalSeconds` 到点时。 |
| `finish`         | 正式标记结束并注销修正之前。                 |

这些边界只接受同步有序序列，不接受带帧偏移的 `ScheduledSequenceDefinition`。只要定义了任一生命周期序列，`inheritSourceSkillCastInfo` 就必须为 `true`。每个 Buff 实例独占动作黑板、继承的施法信息和 `once` 作用域；不同实例不能共享执行状态。`CombatActionSequenceRuntime` 提供技能与 Buff 共用的顺序、条件和 `once` 语义，`attachBuffLifecycleSequences` 负责实例绑定。操作执行器必须根据具体实例的 `sourceId` 和继承施法信息解析，不能在共享 Buff 定义编译时固化来源，也不能借用某个技能实例的黑板或归因信息。

旧外部 Buff 目录暂时保留低层 `actions` 供元素系统迁移使用，但技能内联定义禁止配置该字段，也禁止与 `lifecycleSequences` 混用。生成器只内联能够完整表达的定义；发现尚未支持的生命周期行为时，正式生成必须失败，宽松审计产物保留身份并记录完整事实。

首次创建运行时实例时固定该步骤的蓝图。后续同 ID 或同 `stackingKey` 的增强、刷新、延长等操作只修改已有实例状态，不替换实例保存的定义；需要新建实例的叠层策略则让每个实例保留各自创建时的定义。不同技能块可以为同一 `buffId` 内联不同蓝图，不做全局一致性校验。

### `readBuffBlackboard`

按 Buff ID 或标签查询目标首个有效匹配实例，读取 `desiredKey` 数值并写入当前动作黑板 `outputKey`。未匹配或键缺失必须具有唯一、可测试的失败返回语义。

### `readBuffStackCount`

按 ID 或标签累计匹配 Buff 的强化层数，写入 `outputKey`。它读取 Buff 层数，不读取实体 GameplayTag。

### `finishBuffsByTag`

按标签查询结束目标全部匹配 Buff，并传递 `early | absorbed | other` 结束原因。

### `finishBuffsById`

按定义 ID 结束目标全部匹配 Buff，并传递结束原因。

### `holdBuffsById`

在所属调度区间存续期间阻止施法者身上匹配 Buff 结束。步骤开始时建立 hold，调度项 `endFrame`、技能结束或中断时释放；因此该组件必须处于区间调度项中。

## 9. 定时标记组件

### `createTimedMarker`

字段：`target`、`markerId`、`durationSeconds`、`autoFinishByAction`。在目标能力系统创建独立定时标记；同 ID 不覆盖已有实例。`autoFinishByAction` 为真时，调度项结束或技能中断必须提前结束由本动作创建的标记。

## 10. 动作黑板组件

### `modifyActionValue`

读取目标键旧值和一个操作数，执行 `assign | add | multiply | divide | floor | ceil | roundToInt` 后写回动态黑板。数值运算使用单精度语义；除零、取整和越界规则必须集中在执行器中。

### `calculateActionValue`

读取左右两个操作数，以 `add | multiply | divide` 计算结果写入目标键，不读取目标键旧值。

### `setContextFlag`

字段：`flag`、`value`，目标为施法者。它设置战斗上下文中的语义标志，供后续条件、模式和技能分支读取；不能用动作黑板冒充跨技能持久状态。

### `openComboWindow`

字段：`nextSkillKey`。执行到该步骤时，把指定下一段技能加入全场连携窗口队列。窗口固定持续 5 秒，不能由技能定义覆盖。多段连携通过每一段技能在自身序列中开启下一段窗口表达，因此同帧伤害、Buff 与开窗的先后关系直接由步骤数组顺序决定。

## 11. 资源组件

### `changeResource`

字段：`resource`、`amount`、可选 `coefficient`、`recipient`、技力来源信息，以及终结技能量专用比例、许可标签和忽略效率选项。

技力正向变化进入共享技力效率和返还账本；终结技能量变化进入个人上限、回复许可和效率链。负值、上限截断和实际变化均由统一资源账本处理并生成回执。

### `changeResourceByActionValue`

与 `changeResource` 相同，但 `amount` 在执行时从动作黑板求值，然后委托给同一资源账本；不得复制一套资源规则。

### `gainSquadUltimateEnergyFromSkillCost`

读取本次释放已实际扣除且不属于返还部分的技力消耗，乘 `coefficient` 后按已确认规则为小队分配终结技能量。扣费失败或尚未扣费时必须使用账本记录的实际值，而不是定义费用。

### `gainFinisherSp`

字段：`factor`，接收者固定为团队。根据处决规则和敌人失衡数据计算技力获取；具体公式由处决资源服务负责，步骤只表达触发事实。

## 12. 语义状态组件

### `applyStatus`

字段：`statusKey`、`target`、可选 `durationFrames`、`stacks`、`maxStacks`、`modifiers`。按统一状态容器创建或叠加；持续时间、刷新、层数上限和到期事件必须由状态运行时统一处理。

### `consumeStatus`

字段：`statusKey`、`target`、可选消费层数。减少层数或结束状态，并产生状态消费事件。

支持的状态修正为：

| kind                      | 执行语义                                           |
| ------------------------- | -------------------------------------------------- |
| `attackPercent`           | 每层提供攻击百分比。                               |
| `susceptibility`          | 每层对指定伤害类型提供易伤，可按四维缩放并设上限。 |
| `slowed`                  | 提供减速语义标签。                                 |
| `blockResourceGain`       | 阻止指定资源正向获取。                             |
| `resourceCostMultiplier`  | 修改指定资源的技能费用。                           |
| `skillCooldownMultiplier` | 修改指定技能组冷却。                               |

## 13. 控制流组件

### `conditional`

字段为 `condition`，并拥有 `whenTrue` 和可选 `whenFalse` 序列。执行时只选择一个分支并立即按顺序执行。

若条件为假且没有 `whenFalse`，该步骤返回失败并截断外层序列后续步骤。若希望“条件不成立时什么也不做但继续后续步骤”，必须显式提供空的 `whenFalse` 序列，不能依赖隐藏特例。

### `once`

字段为释放内稳定 `scopeKey`，并拥有 `body`。同一次释放中第一次到达时执行完整 body，随后记为已执行；后续到达直接成功。下一次释放会清空 once 作用域。body 的返回值不改变“已经执行”的事实。

## 14. CombatCondition 完整枚举

| kind                         | 判断语义                                     |
| ---------------------------- | -------------------------------------------- |
| `combatActive`               | 当前处于战斗阶段；Endaxis 时间轴模拟中恒真。 |
| `singleEnemyPresent`         | 单敌人模型已保证目标存在；当前恒真。         |
| `casterControlled`           | 当前帧主控干员是否为施法者。                 |
| `skillBranchEnabled`         | 构筑解析是否启用了指定技能分支。             |
| `targetStaggered`            | 指定目标当前是否失衡。                       |
| `healthCompare`              | 比较目标当前生命或生命比例与动作值。         |
| `contextFlagEquals`          | 比较跨步骤语义上下文标志。                   |
| `actionValueCompare`         | 比较两个动作黑板操作数。                     |
| `statusActive`               | 指定语义状态是否达到最小层数。               |
| `buffStackCompare`           | 按 Buff 标签查询累计层数并比较。             |
| `entityTagMatch`             | 查询目标实体 GameplayTag，不查询 Buff 层数。 |
| `buffIdStackCompare`         | 按 Buff 定义 ID 查询累计层数并比较。         |
| `timedMarkerPresent`         | 目标能力系统是否存在有效定时标记。           |
| `elementalInflictionPresent` | 敌人是否具有指定元素附着及最低层数。         |
| `elementalReactionActive`    | 指定复合反应是否存在及达到最低等级。         |
| `not`                        | 对单个子条件取反。                           |
| `all`                        | 子条件短路与。空数组的语义必须固定并测试。   |
| `any`                        | 子条件短路或。空数组的语义必须固定并测试。   |
| `deckAttributeCompare`       | 比较构筑派生的两项四维属性。                 |

所有数值比较使用统一 `ComparisonOperator`：`equal | notEqual | greater | greaterOrEqual | less | lessOrEqual`。原生浮点容差必须集中在比较器中。

## 15. 连携窗口与事件组件

```ts
interface ComboSkillTriggerRule {
  trigger: DamageTagHitTrigger | ElementalInflictionAppliedTrigger;
  condition?: CombatCondition;
  castImmediately?: boolean;
}

interface ComboSkillRegistrationDefinition {
  skillKey: string;
  priority: 'default' | 'firstBlackboard' | 'enemyRank';
  blackboard?: Readonly<Record<string, LevelValues>>;
  rules: readonly ComboSkillTriggerRule[];
}

interface CombatEventHandlerDefinition {
  key: string;
  event: CombatEventTrigger;
  condition?: CombatCondition;
  scheduledSequences: readonly ScheduledSequenceDefinition[];
}
```

事件触发器完整集合：

- `damageTagHit`：指定伤害标签命中，范围为自身或全队。
- `elementalInflictionApplied`：指定元素附着成功，范围为自身或全队。
- `skillHit`：指定技能组命中，范围为自身或全队。
- `statusExpired`：指定目标状态到期。
- `statusConsumed`：指定目标状态被消费。

`comboSkillRegistrations` 是干员级常驻注册：外部事件与附加条件满足后，创建首段连携候选或立即释放。它不能进入 `SkillDefinition`，否则每个放到轴上的技能块都会看起来拥有一份常驻监听器。

`openComboWindow` 是一次技能释放中的步骤，用于创建多段连携的下一段候选。两种入口最终都交给同一个场景级运行时，但原生运行时先按干员保存候选，再按触发时间、轨道顺序和配置优先级选择当前可操作项。候选保存可暂停的剩余时间，不使用不可暂停的绝对过期帧。

技能临时监听器使用调度序列中的 `listenForCombatEvents` 状态步骤。外层 `ScheduledSequenceDefinition.startFrame/endFrame` 对应原生 `EventListenerAction` 的注册区间；步骤参数中的每个响应包含事件、可选条件和一条同步有序序列。调度项开始时注册，结束或技能中断时注销。没有 `endFrame` 的监听调度项不能通过严格校验。

旧顶层 `eventHandlers` 把监听生命周期和事件后的延迟行为混在一起，无法无损对应原生数据。它暂时只用于标记尚未迁移的手写配置，场景编译仍会明确失败，编辑器也不再提供入口。

## 16. 技能费用、冷却与生命周期顺序

一次技能启动的规范顺序：

1. 检查当前技能实例是否正在释放。
2. 尝试预占冷却；失败只产生合法性事实，不阻止排轴模拟。
3. 检查起始资源并记录诊断，不提前锁定资源。
4. 重置调度器、动作黑板、once 作用域和释放内计数。
5. 分配运行时释放身份，进入 `casting`。
6. 立即执行第 0 帧 tick。
7. 每帧先推进冷却，再推进正在释放的技能。
8. 到达 `costFrame` 时先尝试扣费，再执行该帧调度项。
9. 扣费失败记录拒绝，但不删除时间轴动作。
10. 所有调度项完成后自然结束；区间操作统一收到结束通知。

中断必须结束活动区间操作，并按冷却确认帧决定是否返还本次预占。`timelineBlockFrames` 不参与以上生命周期。

## 17. 严格校验规则

至少必须校验：

- 所有帧为非负整数，区间结束帧不早于开始帧。
- `LevelValues` 能覆盖允许的所有技能等级，解析结果有限。
- 费用非负，存在费用时必须有 `costFrame`，当前费用项最多一个。
- 冷却为正整数。
- 技能、调度项、可寻址步骤和事件处理器稳定键在各自作用域唯一。
- `conditional`、`once` 的嵌套结构与 kind 一致。
- Buff、状态、技能分支和构筑修正引用可以解析。
- `holdBuffsById` 等生命周期步骤位于区间调度项。
- 伤害计算类型与专用参数组合合法。
- 自定义定义缺少当前构筑修正目标时严格失败。
- 未接入执行器的已知步骤也必须报告“不支持”，不能静默成功。

## 18. 编辑器投影

编辑器直接编辑规范化 `SkillDefinitionDocument` 的草稿，并可以建立组件树 ViewModel，但 ViewModel 不得持久化。属性面板由 `kind` 决定专用控件；不能把所有参数降级为任意键值表。

Diff 以稳定键匹配当前技能模板与自定义技能定义。逐字段“采用模板值”、插入模板新增组件或删除自定义组件，都是对完整自定义技能定义的普通编辑，不会把存档重新变成字段级 patch。

天赋、潜能、武器和装备贡献在独立只读区域展示。它们不进入自定义定义，也不参与基础模板 Diff。

## 19. 编译器输出边界

编译器把上述定义解析为 `CompiledSkillProgram`：单等级黑板、费用、冷却、费用帧和已解析调度序列。运行时只读取编译程序，不访问干员 TS、项目文档或等级数组。

编译器必须保持步骤顺序和稳定键。伤害步骤的时间轴命中身份由 `castId + stepKey` 派生或映射，不应靠持久化整份编译步骤维持。

## 20. 当前实现与目标差异

| 能力                      | 当前状态                                                 | 目标                               |
| ------------------------- | -------------------------------------------------------- | ---------------------------------- |
| 25 种步骤和 20 种条件类型 | 已定义，多数已有执行器                                   | 全部通过统一严格注册表闭环         |
| 等级值编译                | 已接入                                                   | 保持纯派生，不持久化               |
| 主体调度序列              | 已接入                                                   | 保持路径派生身份并完善编辑投影     |
| `availability`            | 已用于部分诊断链                                         | 统一场景合法性投影                 |
| 干员级首段连携注册        | 数据结构与样本已迁移，运行时尚未接入                     | 接入条件注册、候选优先级和立即释放 |
| `openComboWindow`         | 已有占位运行时                                           | 接入按干员候选、暂停计时和激活顺序 |
| 技能临时事件监听          | 状态步骤、编译、注册、注销和编辑器已闭环                 | 转换 8 个原生样本并扩展事件负载    |
| 旧顶层 `eventHandlers`    | 保留尚未迁移的手写近似配置，场景编译明确拒绝             | 逐项归类迁移后删除字段             |
| 天赋潜能修改              | 部分以编译后 patch 实现                                  | 作为基础定义之后的独立构筑层       |
| 技能块存档                | 已改为模板引用或完整自定义定义二选一                     | 接入组件编辑器                     |
| 模板 Diff                 | 已实现纯函数差异模型，稳定键与位置匹配会明确区分         | 接入编辑器星号、差异列表和逐项恢复 |
| 技能组件编辑器            | 基础设置、调度序列、条件分支和 Buff 生命周期已可视化编辑 | 补齐剩余步骤的专用控件与可用性打磨 |

实现过程中若需要新增组件，必须同时更新本文件、核心判别联合、规范化器、校验器、编译器、运行时执行器、编辑器 schema 和针对性测试。
