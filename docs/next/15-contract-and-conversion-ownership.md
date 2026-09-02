# 公共协议、转换链路与解释职责审计

> 状态：进行中。本文记录 2026-09-01 起的系统性审计结论；它描述所有权和迁移顺序，
> 不表示表中每一项都已经完成合并。

## 1. 为什么需要这次审计

Next 已经形成了公共数据协议、游戏数据编译器、项目校验、场景编译、战斗运行时和编辑器，但同一语义
在不同阶段逐步增长时，容易出现三类问题：

1. 同一词表在多个文件重新写数组、联合类型或映射；增加成员时只改了一处。
2. 原生值在不同转换分支分别翻译；同一个原生枚举可能得到不同公共值。
3. 校验器、编译器、运行时、兼容性预检和 UI 分别用 switch 解释同一个公共判别联合，却没有所有权清单
   或穷尽性门禁。

目标不是把所有相似代码塞进一个大模块，而是保证每项语义只有一个事实所有者。合法的能力子集、显示
子集和原生证据形状仍可独立存在，但必须显式派生并说明为什么是子集。

## 2. 唯一端到端链路

```text
游戏资产 / IL2CPP 证据
  -> vfs-index-browser 严格解码（原始序列化身份）
  -> tmp/game-data-sources（可再生、禁止提交）
  -> tools/game-data-compiler/src/source（Source IR）
  -> tools/game-data-compiler/src/compiler（语义投影）
  -> packages/game-data-contract（公共定义）
  -> src/next/data（版本化目录与生成产物）
  -> src/next/core/project + core/game-data（不可信输入校验）
  -> src/next/core/compiler（单场不可变程序）
  -> src/next/core/combat（唯一战斗解释）
  -> receipt -> projection -> UI
```

每一条箭头只允许完成本边界负责的变化，不能跨层补猜：

- VFS 解码器恢复字段、枚举数值、RID 和对象边界，不命名 Endaxis 战斗语义。
- Source IR 保存原生身份并严格拒绝未知形状；它可以把同一原生序列化形式规整为唯一 source 表示。
- compiler 是原生语义到公共协议的唯一投影边界。原生名称、数值 ID 与公共名称的映射只能在这里或其
  直接调用的 source 投影帮助器中存在一次。
- `packages/game-data-contract` 只保存可交换、可编辑、可持久化的纯数据结构和值词表，不包含执行器、
  回调、Vue 或转换实现。
- Endaxis 校验公共结构，编译等级和引用，运行时执行；它们不得再次解释原生名称或数字。
- UI 可以声明“当前编辑器支持的子集”，但必须从公共类型派生，不能冒充完整协议。

## 3. 相同、子集和相似的判定规则

### 3.1 必须合并

满足任一项即视为同一事实：

- 值、含义和变更节奏都相同；
- 下游只是为了运行时校验而复制公共联合类型；
- 多条原生转换分支在做同一名称/数值到公共值的映射；
- 多个执行入口对同一公共 step 或 condition 执行相同副作用；
- UI 下拉列表声称展示完整协议，却自行重写完整数组。

### 3.2 保留为显式能力子集

以下集合可以保留，但名称必须说明消费者和能力边界，并用 `satisfies readonly PublicType[]` 或
`Extract<PublicUnion, ...>` 约束：

- Buff、装备、机制系统当前能够监听的 AbilityEvent；
- 当前编译器有证据能够投影的原生叶子；
- 某执行器负责的 step/condition 集合；
- 编辑器已经有明确字段语义和控件的可编辑节点；
- 木桩模型下可观察、可执行的机制集合。

子集缺项不等于协议不支持，也不能在别处静默回退。

### 3.3 禁止因“长得一样”而合并

- `DamageElement` 与 `DamageType`：前者是元素轴，后者还包含 true、ether、lifeDrain 等伤害结算类型。
- `DamageTag` 与 `SkillType`：标签描述一次伤害，技能类型描述技能身份。
- 不同上下文中的 target：`CombatTarget`、Buff 施加目标、治疗目标和原生 TargetReference 可有重合值，
  但可解析对象和生命周期不同。
- Buff 与能力实体：二者可以共享 Action/Condition 组件，但实例身份、生命周期、子技能和查找语义不同。
- 生成产物中的数据数组与枚举定义：产物重复的是游戏数据，不是协议声明。

## 4. 当前审计矩阵

| 主题                                | 唯一所有者                               | 已发现的重复或风险                                                                         | 当前结论                                                                                              |
| ----------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| AbilityEvent                        | `abilityEvents.ts`                       | Buff、装备、连携和 mechanics 曾各自维护同义事件或原生映射                                  | 已建立公共全集；消费者保留命名子集，原生名称/数字统一由 `abilityEventProjection.ts` 投影              |
| GameplayTag 查询                    | `gameplayTags.ts` + `source/tagQuery.ts` | AbilityEntity、投射物、目标组、条件投影、校验器和 UI 各自写 HasAny 映射                    | 公共词表与原生投影已收口；继续用边界测试禁止重新复制                                                  |
| 数值比较                            | `primitives.ts`                          | `source/skillConditions.ts` 重写相同公共顺序；原生动作还有 EQ/Equals 两套名称              | 公共结果复用同一数组；原生别名映射保留为明确 projection，不与结果词表混为一谈                         |
| 四类操作、NativeSkillType、触发范围 | `skills.ts`                              | 过去只有联合类型，项目/技能校验器只能重写数组                                              | 已补运行时词表；路由、等级来源和技能库分组仍保持互不推导                                              |
| 技能等级来源、连携优先级            | `primitives.ts` / `skills.ts`            | 项目校验器曾重写完整数组                                                                   | 项目校验直接复用协议值；生成器只负责原生证据投影                                                      |
| SP 来源                             | `primitives.ts`                          | 资源运行时曾维护完全相同列表                                                               | 已改为公共词表；运行时只实现数值行为                                                                  |
| 属性/伤害修正槽位和阶段             | `modifiers.ts`                           | 校验器和 damage/heal/poise 类型存在重复                                                    | 公共阶段和伤害方位已共享；后续让所有校验集合直接派生                                                  |
| 干员职业、武器类型、稀有度          | `primitives.ts` / `equipment.ts`         | 旧装备适配器和严格校验器曾重写集合                                                         | 适配器必须复用公共值；原生值到公共值的映射仍留在转换边界                                              |
| CombatStep                          | `actions.ts`                             | `validateSkillDefinition`、`compileSkill`、兼容性预检、责任链、UI ViewModel 都按 kind 分派 | 结构校验、编译、执行、显示是不同职责，不能合成一个 switch；必须增加“每个 kind 的职责覆盖表”和穷尽门禁 |
| CombatCondition                     | `conditions.ts`                          | 严格校验、编译器 source 投影、多个运行时 condition executor、UI factory 各自分派           | 原生投影与公共执行必须分离；运行时每个 kind 只能有一个所有者，组合执行器负责路由和缺失报错            |
| Buff 定义                           | `buffs.ts`                               | 技能内联 Buff、公共 Buff 文档、运行时 Buff 类字段部分重合                                  | 保持协议变体和实例分离，共享 `BuffDefinitionProperties`；禁止把运行时实例字段反写协议                 |
| 能力实体                            | `skills.ts`                              | 模板目录、技能内联生成参数、运行时实例容易形成钻石引用                                     | 模板定义应内联到所属干员/技能定义树；运行时仍是独立实体，不与 Buff 合并                               |
| 装备/升级贡献                       | `equipment.ts` / `operators.ts`          | 二者存在相似 modifier 和 event handler 结构                                                | 先共享底层 condition/action/modifier 组件，不强并业务容器；待字段逐项等价后再抽公共 contribution      |
| Mechanics                           | `mechanicContribution.ts`                | 曾使用 damageOutput 等平行事件名，且生产模拟未普遍消费                                     | 已改用 AbilityEvent 子集；未进入生产装配的机制不得宣称已支持                                          |
| 运行时 operation chain              | `combatRuntimeAssembly.ts`               | 技能与 Buff/反应装配有两套相似责任链构造，易漏挂执行器                                     | 先建立 step 所有权清单；再抽“公共链骨架 + 上下文扩展”，不先做大工厂                                   |
| 严格校验                            | `validateSkillDefinition.ts` 等入口      | 为运行时检查复制协议枚举；部分结构由手写 switch 再描述一次                                 | 纯数据 contract 不放函数；Endaxis 保留唯一不可信输入校验器，但所有值集合必须从 contract 导入          |
| 编辑器                              | ViewModel / inspector catalog            | 可编辑子集、默认值和 label 可能重新解释协议                                                | 子集必须显式；默认对象只负责编辑体验，保存时仍走同一严格校验，不参与模拟语义                          |
| 兼容性预检                          | `standardPlayerDamageCompatibility.ts`   | 与真实执行器重复罗列 step/condition                                                        | 它只能读取运行时公开的能力目录，最终不应维护第二套支持表                                              |

本次静态盘点还发现了不能被“类型检查通过”覆盖的具体缺口：

- `setContextFlag` 已进入公共协议、编译器和编辑器，但生产责任链没有执行所有者；标准兼容性预检会把它
  报为 unsupported。它与 `contextFlagEquals` 应作为同一机制取证和接入，不能只给写或读的一边补猜测实现。
- `skillBranchEnabled`、`contextFlagEquals`、`elementalInflictionPresent` 有公共条件和严格校验，却没有生产
  condition executor。它们在确认真实状态所有者前必须保持明确阻塞，不能按直觉返回常量。
- 上述已知缺口的唯一机器可读清单位于 `combatProtocolCapabilities.ts`；边界测试会反向扫描生产责任链，
  要求“实际没有所有者的节点”与清单精确相等，既不允许新增静默缺口，也不允许实现后忘记删登记。
- `standardPlayerDamageCompatibility.ts` 当前几乎复制了整套 step/condition 分类，所以“预检放行”与“责任链
  实际有人处理”仍可能漂移。上述缺口正是需要能力目录而不是第二个 switch 的直接证据。

## 5. 公共协议内部仍需处理的事项

1. 给仍只有联合类型、却需要运行时校验的字段补唯一常量；不得要求消费者反向解析 TypeScript 类型。
2. 对完全相同且语义相同的别名使用类型/值别名，例如 damage scale 与 damage modifier 的 attacker/
   defender、damage/heal/poise 的 calculation timing。
3. `actions.ts` 和 `conditions.ts` 的大判别联合仍是正确的交换结构；不能为了减少文件长度拆出同名局部协议。
4. `BUFF_ABILITY_EVENTS`、`EQUIPMENT_ABILITY_EVENTS` 等不是新协议，它们是带运行能力含义的子集；新增
   AbilityEvent 时不会自动表示这些消费者已经支持。
5. 公共包保持纯数据。默认值工厂、解析器、标签翻译、执行函数和 UI 元数据均不进入该包。

## 6. 转换全过程的职责

### 6.1 VFS / 反编译层

- 输出类名、字段、枚举 value/name、RID 引用和原始列表顺序。
- 未解码字段必须显式 partial/unsupported，不能省略后被当作空值。
- 相同 IL2CPP 条件叶子只应有一个 decoder；连携、Buff 和技能动作共享解码基础设施。

### 6.2 Source IR

- 同一种原生结构只能有一个 parser，例如 GameplayTag query、TargetReference、Scalar、Action/Condition。
- Unity RID 适配器只能把二进制导出形状转成这个 parser 接受的原生 JSON 形状，不能另写语义编译器。
- Source 类型允许保留公共协议不需要的原生身份；不能直接伪装成公共输出。

### 6.3 Compiler projection

- 数值枚举、原生名称和 GameplayTag ID 在这里投影为公共值。
- 相同原生结构无论来自技能、Buff、装备还是连携，必须调用同一 projection。
- 不可观察的木桩模型简化必须是有证据的 policy，并留下遗漏原因；不能散落在叶子 switch 中。
- 编译输出类型优先 `Pick`/`Extract` 公共协议，禁止复制同名字段接口。

### 6.4 生成和目录装配

- renderer 只决定稳定排版与 helper 引用，不创造战斗语义。
- `--check` 比较正式产物和同源重生成结果；`tmp`、audit JSON 和 source closure 不进入 Git。
- 正式定义必须通过公共协议类型和 Endaxis 严格校验，不能靠 `as unknown as` 越界。

## 7. Endaxis 中公共协议的解释规则

公共协议不是“每层都自由解释一次”的共享类型文件：

- validation：只回答数据形状和值是否合法。
- compiler：只展开等级、解析引用并生成单场程序。
- runtime executor：唯一回答一个 step/condition 有什么战斗效果。
- compatibility：只查询当前环境是否装配了该能力，不复制效果判断。
- projection：只读 receipt，不重演 step。
- UI：只编辑和展示，不决定能否释放、伤害或事件顺序。

因此 `compileSkill`、condition executor 和 editor factory 都可以有针对同一 `kind` 的分派，但它们不是可
互换的重复实现。真正的问题是缺少机器可检查的职责覆盖关系。

## 8. 迁移顺序

### 阶段 A：词表与原生投影收口

- 完成 AbilityEvent、GameplayTag query、comparison、技能身份、修正器字段和基础枚举收口。
- 扩展 `dataContractBoundaries.test.ts`，禁止完整协议枚举在 compiler/product 中重新声明。
- 能力子集统一命名并以 public type 约束。

### 阶段 B：Action/Condition 所有权目录

- 为每个 `CombatStepKind` 记录 validator、compiler、runtime executor、compatibility 和 editor 状态。
- 为每个 `CombatConditionKind` 记录唯一 runtime owner。
- 门禁检查：协议新增 kind 时必须明确进入“已支持、仅可编辑、明确不适用、阻塞”之一。
- 责任链装配重复在所有权稳定后再抽取，避免把当前差异藏进通用工厂。

### 阶段 C：转换器公共路径

- 将连携新叶子接回通用 Action/Condition decoder 和 projection，不建立 Combo 专用语义结构。
- 对 Buff、技能、装备、连携的 source parser 调用图做自动边界检查。
- 删除只剩转发且没有证据价值的旧适配函数。

### 阶段 D：校验、兼容性和 UI 派生

- 校验器的所有枚举集合导入 contract。
- compatibility 从运行时 capability catalog 读取，不再维护第二套 switch。
- editor catalog 明确 full protocol 与 editable subset；缺少 inspector 的公共节点原地报错，不静默降级。

## 9. 完成标准

- 一个公共值只在 contract 出现一次；原生到公共映射只在转换边界出现一次。
- 一个公共 step/condition 只有一个战斗执行所有者。
- 新增协议 kind 时，边界测试能同时指出缺少校验、编译、执行、兼容性或编辑器登记的具体层。
- Source IR、正式生成产物和项目 JSON 都能在各自边界严格失败，错误包含来源路径。
- 任何木桩简化都能追溯到 policy/证据，不由 UI、生成排版或偶然测试样例决定。

## 10. AbilityEvent 动作上下文竖切结果

- `abilityEvents.ts` 是事件名和 InputTarget/Trigger 方向的唯一协议来源；转换器与运行时共同消费，
  Buff、连携和技能监听不得按宿主另写方向表。
- 能力实体出生/结束事件同样走该表：InputTarget 是实际实体，Trigger 是发布事件的 owner；运行时 ID
  必须使用统一的 `ability-entity:<instanceId>`，不能另造驼峰身份。
- `TargetSource.Target` 投影为 Action InputTarget；原生连携保留的 `Context("trigger")` 仍走公共命名
  目标组。两者不是 event source/target 的固定别名，具体方向由事件绑定决定。
- 公共条件现覆盖 InputTarget 对象类型/身份、Context 首目标身份/实体标签，以及既有 Context Buff
  层数/对象类型。它们分别由 EventContext、TargetContext、Buff 查询执行器唯一负责。
- 配装被动 Ability 与 Buff、连携使用同一运行时动作环境恢复入口；不再只传事件 payload。正式武器与
  套装当前实际读取 InputTarget 的 `beforeOutputBuff`、`beforeOutputPhysicalInfliction`、`outputHeal`
  已按输出方发布链登记方向，动作 owner/source 仍是配装被动所属干员，不能误换成事件来源。
- 正式数据门禁会遍历公共 Buff/能力实体、干员、武器、装备和套装；事件序列一旦出现
  `actionInputTarget` 或通过 `contextKey/targetGroupKey` 读取 `trigger`，事件就必须属于
  `ACTION_CONTEXT_BOUND_ABILITY_EVENTS`，协议缺口在生产数据层直接失败，不再等到某个模拟场景触发。
- 2026-09-01 强制运行时模板审计结果为 21/30 已绑定、1/30 可解析但未绑定、8/30 明确阻塞；审计写入
  被忽略的 `tmp/game-data-audit`，不提交生成报告。

## 11. 技能定义枚举与技能库放置规则

- `operatorSkillDefinitions.ts` 统一枚举基础技能、具名形态、同组换槽与跨组换槽执行体；编译器和养成
  默认值不再各自遗漏一种分支。
- 战斗类型与等级来源以单个 `SkillDefinition` 为准。组级字段及 routed replacement 上的重复字段只
  保留迁移兼容，不能覆盖技能自身语义。
- `skillGroupPlacement.ts` 是技能库展示、拖放和预览宽度的唯一放置规则；它不参与运行时技能路由。
- 正式数据门禁覆盖 30 名干员、309 个可主动放置技能：每个技能在技能库恰好出现一次，每张卡片拖放
  后生成与投影一致的单技能或有序链，`internal` 执行体不得暴露。
- 连携条件绑定、项目引用校验和定义编辑器校验同样消费公共枚举器；项目引用不再只认识基础技能与
  variant。完整自定义技能的 `levelSource` 属于自定义定义本身，不能被模板或分组字段覆盖。

## 12. CombatEventTrigger 横向覆盖

- 公共协议新增唯一 `COMBAT_EVENT_TRIGGER_KINDS` 词表；严格校验、语义运行时和编辑器均以该词表做
  全量门禁，不能各自维护“当前认识的事件”列表。
- 编辑器现覆盖全部 15 类公共触发器，包括命中/治疗、Buff 输出与消耗、技力获得、元素与物理附着、
  技能命中、状态结束等。可选筛选字段保持可选：空 Buff 身份、技力来源或获得类型表示不额外筛选。
- 校验器补齐此前漏掉的 `buffOutput`、`buffConsumed`、`physicalInflictionApplied`，并纠正把
  `spGained.source/gainKind` 错当必填字段的问题。
- 治疗事件省略 `role` 的既有运行时语义是“治疗目标”；编辑器明确标为默认目标，不把省略值解释成
  来源与目标任一匹配。

## 13. CombatStep 编辑覆盖第一批

- 编辑器新增目录不再只等于早期高频步骤：`applyPhysicalInfliction`、`repeatEachTick`、三类原生技能
  路由、原生能力事件/延迟施放、Buff 点燃/跨技能继承/终结技回能限制，以及角色专属 HUD 数值均已
  进入统一类型选择器。每种可新增步骤的默认草稿必须通过同一个严格定义校验器。
- 技能路由 Inspector 明确区分稳定技能组、目标技能、替换寿命、还原技能、操作模式和可变
  `NativeSkillType`；这些字段只影响后续原生操作路由，不修改技能库分组或技能等级来源。
- `repeatEachTick` 明确展示宿主 Tick、原生 Channeling 扫描和原生 TickInterval 三种模式，两个原生
  参数块保持互斥；不能把不同驱动语义压成一个笼统“循环间隔”。
- 严格校验同步修正两处协议漂移：`castSkillDuringAction.target` 按公共协议和运行时测试允许 caster 与
  enemy；`inheritToNextSkillIds` 按正式生成数据允许空白名单。`triggerCustomAbilityEvent` 此前没有
  参数校验分支，现已补齐事件名、数值、目标与可选来源。
- 本阶段不是“全 80 种步骤已具备完整表单”。下一批继续按正式引用和木桩可见性处理，优先补齐仍会
  改变伤害、Buff、资源、技能派生或 HUD 状态的步骤；空间查找、主动敌人行为和纯表现步骤必须保留
  明确简化/只读边界，不为追求表面全覆盖而建模。
- `combatStepEditorCoverage.ts` 是 UI 覆盖的机器可读账本：公共 kind 必须恰好进入可编辑目录，或进入
  visible-result、runtime-structure、stump-low 三档待办之一。它不声明运行时能力，也不复制协议语义；
  新增协议 kind 未登记时测试立即失败。
- 第二批把可编辑覆盖推进到 **60/80**。Buff 当前实例/事件快照、剩余时长读取与修改、暂停、结束及
  属性刷新均使用明确的生命周期环境；缺少环境时仍由模拟严格失败，不让编辑器猜任意 Buff。
- 正式数据中各有 24 处引用的 `readSkillSettingData` 与 `storeSourceAttributeValue` 已优先接入。前者
  保留固定四列、运行时列操作数及 linear/saturating 强化公式；后者明确展示属性选择、转化前阶段、
  除数/乘数/基值与取整顺序，避免把直接影响伤害的计算链隐藏成原始 JSON。
- 能力实体定时标记可分别编辑动态身份、持续时间及 global/self 时钟；忽略全局时间倍率直接复用
  公共能力实体查询编辑器。普通倒地虽然在木桩上没有主动敌人动画，仍会影响事件和连携条件，因此
  保留持续时间、过滤与原生返回条件，未降为纯表现节点。
- 第三批把可编辑覆盖推进到 **62/80**，visible-result 队列清零。`createGlobalBuff` 的父实例定义按
  固定字段端口投影到技能导图，`children` 按有序成员展开；步骤、父定义、单个子 Buff 分别使用纯
  本层 Inspector，子项增删、排序和复制粘贴统一复用导图结构命令。父黑板、创建赋值和父到子赋值
  继续保持三套不同语义，不能拍平成普通 Buff 黑板。
- `finishParentGlobalBuff` 只编辑精确父实例的结束原因。GlobalBuff 至少保留一个子 Buff 的协议约束
  同时落实到默认草稿、严格校验和导图删除边界，不允许编辑器制造空父实例定义。
- 第四批继续推进到 **73/80**。目标上下文的合并、队伍快照、Owner 实体查询、索引选择和逐目标执行，
  以及能力实体剩余时长、精确结束和模板子技能启动，均已使用专用 Inspector；`forEachContextTarget`
  的 Body 仍是导图结构端口，依赖 currentTarget 的步骤默认草稿只在该结构内接受严格校验。
- 编辑器没有把零距离模型误写成“没有目标身份”。Context 仍保存稳定实例快照，实体查询仍保留 owner、
  同次施法、数量截断和环形顺序语义；只消去空间坐标和距离排序。严格校验同步修正 `allOperators`
  被错误拒绝及 `excludeCurrentTarget` 漏检，重新与公共协议对齐。
- 第五批完成公共 Step **80/80** 专用编辑覆盖。跳转/结束时间轴、动作黑板作用域、按运行值重复、
  投射物结束回调和内联实体子技能全部把 Body、条件、定义与调度序列作为导图端口；右侧只编辑当前
  层参数。投射物回调的 delay 和 Body 此前漏过严格校验，现已补齐。
- `createSpatialPointTargets` 也可编辑，但明确只保存 Context 键、运行时数量和稳定临时身份。这里的
  80/80 表示所有公共 kind 都有语义表单及合法默认草稿，不表示 Endaxis 建模了空间坐标、距离、敌人
  主动行为或纯表现细节；这些简化边界仍由公共协议、运行时和审计说明分别约束。

## 14. 能力实体定义编辑边界

- `AbilityEntityDefinition` 只由 contract 定义；编辑器同时消费单体 `childSkill` 和具名
  `childSkills`，但绝不在保存时互相猜测或拍平。具名记录键必须始终等于成员 `skillId`。
- 多子技能在导图中是独立成员，黑板和调度序列属于各自成员。生命周期、出生标签、回收延迟和最大
  同模板实例数仍属于实体根；编辑子技能不得重建或丢失这些根字段。
- 任意字符串 ID 通过带 JSON 引号的记录键路径寻址，数组才使用数值下标。结构路径解析必须完整消费
  输入；不能用忽略未知字符的宽松正则制造“看似改对、实际写入别处”的结果。
- 正式复杂定义必须有单层编辑往返回归：断言目标字段改变、非目标兄弟深度不变、记录顺序不变，并在
  修改后再次运行公共严格校验。Arcane 多子技能能力实体是当前基准样本。

## 15. Buff 定义编辑覆盖规则

- `SkillBuffDefinition` 是唯一权威的数据契约。编辑器不得另建一个裁剪版 Buff schema，也不得因为当前没有控件而在保存时重建并丢弃未知字段。
- 顶层覆盖由 `buffDefinitionEditorCoverage.ts` 穷尽声明：
  - `editable`：Inspector 能无损查看和修改该字段的全部契约形态；
  - `structureEditable`：由左侧结构图及节点 Inspector 编辑；
  - `partiallyEditable`：只覆盖已明确列出的子字段，未覆盖部分必须原样保留；
  - `preservedOnly`：当前不可编辑，但复制、修改其他字段和保存时必须保持不变。
- `number | { blackboardKey: string }` 不是两个互不相关的字段。所有此类 Buff 数值必须由同一个控件在常量和黑板来源间切换，不能把动态值显示成空白常量输入框。
- presentation 是原生 HUD 显示身份和规则，不参与战斗计算但同样属于稳定数据。编辑单个显示字段时只做字段级不可变更新，禁止重建整个 presentation。
- `nameKey`、本地化文本和最终标题属于应用展示层，不是 Buff 游戏数据契约。公共转换只保留稳定 Buff
  身份、原生 presentation、来源身份与可计算修正；应用层再按配置名、来源具体名称和修正摘要组合文案。
- 战斗语义容器与原生可见 Buff 同时存在时，持续状态展示以原生 HUD 路由为准。以法术异常为例，
  `ElementalReactionApplied` 只是一条语义事实，带 `SpellAbnormal` presentation 的 Buff 实例才是唯一
  segment 身份；禁止按同帧、同名或近似持续时间合并两个独立投影。
- presentation 子字段必须由独立的 `keyof CombatBuffPresentation` 覆盖账本穷尽；根 `presentation` 与 `childPresentations[*].presentation` 共用同一个字段编辑器。子展示项的 `buffId` 是稳定关联键，不能由图标或父 Buff ID 推导。
- Buff 初始黑板只接受公共 `ActionBlackboardValue`（字符串、数字或 `null`）。它不是按技能等级展开的 `LevelValues`，不得复用技能黑板编辑器或进行数字化转换。
- Buff 属性修正继续使用公共八槽公式；伤害修正的条件树使用 `DamageModifierCondition`。二者都不得复制成 Buff 私有近似类型，也不能把伤害条件转换成技能分支条件。
- `instantAttribute.values` 的稀疏单槽和完整八槽是公共协议中的两种真实形态，编辑器分别提供对应控件；禁止为了复用单槽控件而在两种形态间自动拍平。
- 治疗、失衡和伤害修正各自拥有不同的条件与处理器联合类型，编辑器必须分别消费公共契约。护盾直接值与属性公式、分类型吸收也属于互斥真实形态，不能为了表单统一而折算成一个最终数值。
- 关键词强化、持续保护、元素语义角色和法术爆发参数均是公共 Buff 契约的根字段，不能藏在原始 JSON
  或转换成运行时回调。韧性修正只允许公共契约声明的三类递归条件和 `modifyPoiseScalar` 处理器，
  不得因结构相近而复用伤害修正器的更宽联合类型。
- 当前账本已收束为普通字段全部 `editable`、四个行为结构字段 `structureEditable`，不存在
  `partiallyEditable` 或 `preservedOnly`。这里的“全部可编辑”指公共契约形态可无损查看和修改，不代表
  编辑器可以推断缺失的游戏规则或扩展协议。
- 每批新增编辑能力至少用一个真实生成 Buff 验证“只改变目标字段，其余数据深度相等或保持原引用”；复杂 Buff 优先于人为最小样例。

## 16. 配装定义与实例编辑覆盖规则

- 武器定义、装备定义、套装定义、贡献集合、词条和用户实例是六个不同层级。每层分别以公共契约的
  `keyof` 建立穷尽账本；字段名称相同不构成合并类型或复用存储结构的依据。
- `EquipmentContributionDefinition` 是武器词条、装备词条和套装共用的唯一贡献协议。属性修正、事件
  响应、附属 Buff、初始化黑板和帧 0 初始化序列均由同一贡献导图编辑，不得在三个宿主编辑器各写
  一套近似实现。
- `EquipmentModifierDefinition` 的六类联合成员必须逐类编辑：attribute、panelStat、damageBonus、
  damageScale、staticHealingIncrease、skillCooldownMultiplier。任何新增 kind 未进入穷尽账本和类型选单
  时必须编译失败，不能落入一个宽泛的默认表单。
- 配装事件响应同时支持 `CombatEventTrigger` 和原生 AbilitySystem 事件。稳定 key、原生优先级、逐级
  动作黑板、条件和动作序列都属于同一响应定义；条件与序列由导图编辑，其余字段由当前层 Inspector
  编辑。
- `LevelValues` 的单值和数组是同一个逐级值协议。编辑器可以用逗号列表呈现，但不能先按等级展开成
  多份行为再聚合回来。武器等级/突破/潜能/词条等级和装备精锻档位属于用户实例，不得写回只读定义。
- 武器 `skill1/2/3` 的解锁上限属于既有实例编辑兼容规则，仅对这三个明确身份生效；自定义词条不得
  被套用“最多 9 级”的旧三槽假设，其最大等级直接取定义 `levelCount`。装备精锻实例是 0 基档位，
  每条词条的最大值严格为自身 `levelCount - 1`，不得在 UI、默认工厂或“拉满”命令中硬编码为 3。
- 保存项目级定义必须由一个项目命令同时替换物化定义并归一化所有场景中的引用实例；订阅者不能看到
  “新定义 + 旧越界实例”的中间项目。定义库变更后先清理模拟缓存，再等场景 watcher 标脏/排队，最后
  由一次 `simulateNow` 清掉待执行定时器并发布新快照，禁止 watcher 与显式刷新各跑一份模拟。
- UI 校验用于即时反馈，但不是领域不变量的所有者。项目级配装模板的派生和替换入口必须再次执行公共
  严格定义校验，并在失败时于创建新项目或历史项之前抛错；调用者不能绕过某个对话框，把非法定义
  写入项目后再依赖序列化或模拟发现。校验、定义替换和引用归一化的顺序固定为“校验 → 构造完整新
  项目 → 单次 commit”。
- 干员定义替换遵守同一顺序，并额外检查所有引用该项目模板的轨道：轴上 `operatorSkill` 身份必须仍
  能由新定义的 base、variant、replacement、routed replacement 或显式 alias 解析。删除仍被排轴引用
  的技能必须失败关闭，不能静默删除技能块，也不能把悬空引用留给下一次模拟。
- 工作区应接收项目层计算出的只读引用集合并把悬空引用加入自身问题列表；编辑器只负责提前反馈和禁用
  保存，不取代项目命令的同一检查。这样 UI 与领域入口共享结果边界，同时不会让纯定义编辑组件反向
  依赖整个项目存档。
