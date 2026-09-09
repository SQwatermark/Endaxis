# 事件响应：公共机制与宿主边界

当前工作进度见 [独立已办/待办清单](../handoff/2026-09-09-event-unification-checklist.md)。
干员被动准入现由契约 OPERATOR_PASSIVE_ABILITY_EVENTS 统一维护三种事件：
abilityEntitySpawned、abilityEntityFinished、addedBuff。OnAddedBuff 仅在没有
启动 Buff 时迁移到原生响应；有启动 Buff 时保留旧注册位置，避免未经原生 Enable
时序核查就改变初始化响应。下文早期“两种生命周期事件”描述是迁移历史。

## 当前状态（2026-09-09：移除载荷包装）

标准环境的 #emit 发布调用已接入 StandardPlayerDamagePayloadMap：公共键直接继承
AbilityEventPayloadMap，不再接受任意 unknown。仅公共契约之外、尚待分类的过程通知
暂留 unknown；差集 Exclude 用于隔离这两个明确范围，不能覆盖已有公共键。
环境的分发器、eventsFor 及 #publish 现已接同一映射，公共订阅直接得到对应载荷。
#emit 的重载实现仍在构造事件时用单一断言恢复两个参数的键关联，不复制载荷；这是
构造边界，不是逐监听者重新解释未知事件。额外未分类通知仍为 unknown，不能因此
声称整个实体事件总线已完成分类，也不能将它们开放给可配置监听器。连携准入门禁不变。

来源读取已进一步删除当前技能字段回退：未提供 skillCastInfo 就保持 undefined，
不从 skillId/skillType/skillCastId 构造 origin，更不补 nonReturnedSpCost=0。
显式 null 保留，显式损坏来源报错。当前技能 ID/类型条件仍读取技能事件自身字段，
不依赖来源快照。依据 origin-skill-event-context.md，不把当前技能、监听宿主和
事件来源混为一谈；这也不扩展原生 CheckOriginSkillType 接受的事件类型。

施法来源读取入口明确为 readSkillCastInfoFromPayload：调用方先选择原始载荷，再读取
来源。不再同时接受完整事件并维护拆包白名单；误传事件封装明确报错。所有正式调用
已直接传 payload，删除的只是无人使用的兼容分支，不改变来源字段、引用、null/缺省
语义。原有技能身份回退已在上述后续整改删除。下文历史的“完整事件来源读取”迁移记录不再代表当前 API。

weaknessSet 的无目标占位已清理：公共绑定按配置实际读取 source/target，并仅校验
用到的端点。该事件的运行时载荷只保留发布者 sourceId，Input=发布者、Trigger=空，
不再写入 targetId=enemy。依据 combat-spec/weakness-trigger-output.md 的事件 151。
有目标事件缺字段仍明确失败，不退回固定木桩。正常玩家操作不新增弱点设置通知，
仍仅允许显式外部事实发布；此修改不代表引入敌方弱点窗口或敌人主动行为。

旧定义的触发器筛选现也传递装配层解析的原生 Input/Trigger。条件求值、技能临时监听、
养成响应及装备响应统一进入 abilityEventResponseContext 的临时作用域，保留原事件，
切换来源及目标并在正常退出、嵌套或异常时恢复。监听序列仍复用原实例及黑板，不改
once/重入和订阅生命周期。手工标记同样遮蔽外层事件来源/目标，但不补造原生目标绑定。
本次消除的是响应上下文重复，不是删除旧定义触发器、合并两种不同事件或开放新能力。

Buff 的 outputKnockDown 兼容响应也已接入同一作用域：装配层转交现有原生目标绑定，
生命周期执行明确设置 Buff 所有者和施加来源，不再单独拼接 eventSkillCastInfo。
原生 afterOutputKnockDown 保留 fromAirborne、来源和目标；手工标记不补造这些信息。
两种响应均在退出后恢复上下文，注册仍随 Buff 结束释放。该兼容订阅端口尚未删除。

兼容端口的类型边界明确为 KnockDownOutputEvent（仅 afterOutputKnockDown 或手工
ManualKnockDownOutputEvent），不再使用涵盖前置通知的 KnockDownAbilityEvent。
装配层用身份守卫直接收窄，不通过 Extract 和 as 拼接期望类型。击飞/倒地手工标记
分别具名，字段仍按原定义保留；这不是新增一种运行时事件或二次发布。
原始响应事件名类型现称 AbilityResponseEventName，删除误导性的 Normalized 命名；
排除 outputKnockDown 的 Exclude 保留并注明兼容门禁意图，不将有意边界当成重复定义。

中文术语以 src/i18n/game-locales/zh/terms.json 为权威名称入口：物理异常为击飞、
倒地、猛击、碎甲；四种法术属性为灼热、电磁、寒冷、自然。“浮空”亦用于干员自身
状态，不能与物理异常击飞混称。术语表用于名称和说明，执行细节仍须以 combat-spec
证据为依据。下文历史记录中的旧中文称呼不应沿用，也不据此批量改内部标识。

法术爆发 beforeOutputSpellBurst、角色承术 beforeTakeSpellInfliction 已直接消费原始
事件，删除最后两种平铺类型及 normalizeAbilityEventPayload。resolveAbilityEventContext
只识别并返回原始对象，不复制载荷、不补造缺省元素；来源的 undefined/null 区别保留。
元素条件继续遵守原有匹配及 float32 黑板写回规则，不改变事件发布时机。

下文分批整改记录保留迁移过程，其中关于 normalize 尚存的描述仅代表当时状态。
目前仍不能称整个事件系统统一完成：手工 airborneOutput/knockDownOutput 语义端口、
旧定义的 semantic 订阅入口及无目标绑定仍待收束。不能把手工标记伪装成携带原生
组件上下文的事件；Buff 来源上下文与护盾 CurValue 的独立差异仍按下文待办处理。

## 原生复核后的目标：同一事件贯穿发布与消费

用户明确拒绝“发布结构 → normalize → 消费结构”。下方第一批抽取只是依赖整理，
不是最终架构。不得把 normalize 移到发布端、增加缓存或换名当作统一完成。

已复核的权威来源（combat-spec 专题，不在此另写原生结论）：

- `combo-event-gates-and-pending.md`：TriggerEvent RVA 0x030B5150，从 EventContext.target
  绑定 Input，有目标时发布者绑定 Trigger，无目标时 Trigger 为 null。这是执行目标绑定，
  不是把一个事件翻译成另一个事件。
- `origin-skill-event-context.md`：CheckOriginSkillType RVA 0x04665600 读取栈顶
  currentEventContext，按 BuffContext、PhysicalInflictionContext、SpellInflictionContext、
  OutputDamageContext 等实际类型取得来源。不回退宿主或外层事件；承伤上下文与输出上下文
  并非同类型，不能给承伤通知补一个输出来源。
- `buff-ability-event-actions.md`：AbilityActionMap 注册的是 Event + SequenceActionData，
  Buff 条件读取当前事件中的 Buff/BuffData；宿主绑定只负责 owner/source/黑板等。
- `ability-event-action-ordering.md`：同一公共阶段顺序及整数优先级、同级注册顺序。

据此，最终协议应明确区分事件身份、该事件的载荷类型、监听宿主环境三件事：
发布者构造一次有类型的事件，上述各消费阶段接收同一对象及载荷引用。
条件通过真实事件/载荷类型读取字段，不创建 buffApplied 等第二份 Ability 事件。
同步可修改的处理器/操作端口必须保持引用；普通记录对象只读不等于把可修改端口序列化。
输入校验与事件读取分开；内部有类型发布链不应逐监听者重复校验未知对象。

迁移前必须盘点 StandardPlayerDamageEvent 比公共 AbilityEvent 多出的 beforeKillEntity、
伤害处理过程、elementalInflictionStarted 等入口，区分原生广播、内部过程钩子与事实记录；
不能把后两者为了类型统一伪造成原生广播，也不能未经核查删除 semantic 通道。
迁移按发布者与全部订阅者成组修改，不保留运行时自动 normalize 的兼容主路径。
验收增加引用相等、同阶段身份保留、同步修改可见、嵌套遮蔽及恢复测试。

本轮已纠正临时上下文中来源回退：栈顶事件缺少来源保持 undefined，明确空来源保持 null，
两者均遮蔽外层来源，事件退出后才恢复。normalize 已移除；剩余协议边界见顶部当前状态。

## 原生依据与职责

原生语义沿用 combat-spec 的 ability-event-action-ordering、ability-source-children-lifecycle
等专题；这里仅说明 Endaxis 消费架构，不另立游戏规则。
公共事件响应不是全局无归属总线。发布者实体、监听所有者、施加来源必须各自保留。

| 链路 | 现有入口 | 整改边界 |
| --- | --- | --- |
| 事件身份与 Input/Trigger 绑定 | 契约 abilityEvents.ts、abilityEventActionContext | 已有公共定义，继续复用 |
| 原始事件名称投影 | abilityEventProjection.ts | 已公共；宿主转换仍有独立白名单和特殊分支 |
| 响应结构 | AbilityEventResponse | Buff 与被动引用同一结构，不内联重定义 |
| 同步发布/注册 | AbilityEventDispatcher | 已共享；不重造总线 |
| 载荷与施法身份解释 | abilityEventPayload.ts | 从 Buff 生命周期模块移出，Buff/被动/装备/连携直接依赖 |
| 临时动作环境 | abilityEventResponseContext.ts | Buff 与被动共用，嵌套/异常恢复事件、Input 和 Trigger |
| 条件与动作 | CombatActionSequenceRuntime 与公共执行器 | 已共享，保留序列 once/重入状态 |
| 注册与实例生命 | Buff、PassiveAbilityEventRuntime 等宿主 | 保留必要差异，不将 Buff 结束等价于技能卸载 |

## 2026-09-09 第一批整改

公共载荷模块不再根据 Buff/装备类型反推事件身份，直接使用公共 AbilityEvent 范围。
旧 Buff 模块不再重导出公共解析函数，各消费者改用公共入口，避免保留旧依赖路径。
同步响应上下文只临时替换事件字段与 Trigger，恢复时不清空宿主其他目标组和黑板；
没有 Trigger 的通知不得读取上一通知遗留的 Trigger。Buff 先前直接修改目标组而不恢复，
本轮改为共用对称恢复边界。宿主仍负责创建及保留序列，未改变其 once 状态策略。

## 仍需收束，不能称作全链路完成

### 2026-09-09 公共发布协议迁移进展

- `combatAbilityEvent.ts` 用事件名索引载荷；伤害准备阶段直接使用 `PlayerDamageContext`，
  伤害结算直接使用 `HealthDamageEventPayload`，元素附着直接使用生产端的
  `ElementalInflictionEventPayload`。不得再把这些类型裁成仅供条件读取的字段集合。
- 既有 `AbilityEventDispatcher` 已改为载荷映射驱动，同一映射约束发布、注册回调、
  数据动作、技能监听与连携。没有新增第二个总线，也没有复制事件对象。
  内部异构注册表只在按事件键存储时擦除键关联；引用和调用阶段顺序不变。
- 连携不再维护十多份本地事件类型，标准环境到连携直接转交分发器当前对象。
  `CombatRuntimeAssemblyOptions.emitAbilityEvent` 改用公共载荷索引，不再重复维护名称白名单和载荷联合。
- 当前迁移**未完成**：标准环境分发器仍未绑定完整载荷映射，外部受击标记与真实伤害包
  的差异需要明确处理；不能伪造伤害结果填齐类型。`normalizeAbilityEventPayload` 仍在消费端，
  `CombatOperationContext.event` 尚未直接采用公共事件，不能把上述类型改造当成全链路统一。
- 原生来源规则保持不变：承伤不能借用输出来源，未提供身份不能回退宿主或外层事件。

后续继续按生产者到全部消费者迁移，最终移除 normalize 与第二套 kind 协议；不要停在映射共用。

### 2026-09-09 派发机制去重进展

`CombatSemanticEventRuntime` 已删除自己的注册顺序计数、阶段循环和优先级排序，
改由既有 `AbilityEventDispatcher` 注册 callback/dataAction/skill/combo。
公共分发器新增可释放的持续 skill/combo 监听，沿用逐阶段快照，前一阶段注册的后续
阶段监听可以在本次事件执行；当前阶段的快照不因注销改变。

这只完成了**派发实现去重**，不是一次发布的证明：语义通道仍持有独立分发器，
语义 kind 和原生 event 仍并存。后续必须删除语义发布入口，把订阅安装到原生发布者的
同一个分发器上，而不是将原生事件转发给另一轮阶段循环。

已核实的迁移入口：

- 标准伤害环境的 afterKillEntity 当前转为 enemyDefeated 后提前返回，原生广播被截断。
- BuffDefinitionOperationTarget 的施加完成顺序为原生 Added 回调、语义观察者、原生 Output。
  语义观察者又同时发布 buffApplied 和 buffOutput，不能简单替换名字后保留这个额外时点。
- 治疗先发布 outputHeal/receiveHeal，再由 receiveHeal 构造 operatorHealed。
  原语义 source/target role 应迁为对应原生阶段的订阅筛选，不继续制作第三份治疗通知。

103 项定向测试通过（公共分发器、语义订阅、配装、养成、Buff 生命周期、真实轴中断回归）。
随后 `vue-tsc --noEmit --project tsconfig.app.json` 全量类型检查通过。
未据此宣称完整协议统一或全部真实轴数值验收完成。

### 击杀链路的原子迁移范围

继续检查确认：普通伤害截断 `afterKillEntity`，而另一条公共伤害执行路径直接发布
`afterKillEntity`。因此当前不仅存在两套结构，还存在不同生产路径的通知差异。
该问题已按下述击杀迁移进展处理；不能把两边都补发一次当作统一。

这一批应一起迁移以下内容，不拆成长期共存的兼容通道：

1. 发布端保留健康伤害执行器给出的完整 `HealthDamageEventPayload` 和本次事件对象。
2. `enemyDefeated` 作为定义中的筛选描述，订阅原生 `afterKillEntity`；
   operator/team 范围决定订阅对象，仍进入该对象同一次 callback/dataAction/skill/combo 分发。
3. 普通干员、敌人和能力实体的 Buff 装配均移除击杀语义回接；不能只改一处装配代码。
4. 条件、事件来源/目标、技能来源读取改为消费同一原始事件，不构造精简的 enemyDefeated 数据包。
5. 回归同时覆盖两条伤害路径、原生与定义侧监听恰好各执行一次、对象引用一致、
   混合监听的优先级/阶段、队伍筛选以及 Buff 注销。现有独立语义事件测试也须迁移。

### 2026-09-09 击杀事件迁移结果

- 删除运行时 `enemyDefeated` 数据包和普通伤害截断/改发行为；两条健康伤害发布路径
  都保留 `afterKillEntity`。定义中的 `enemyDefeated` 只是订阅筛选，不再是另一份通知。
- 订阅安装到发布实体既有分发器，保留 operator/team 范围和四阶段、动作优先级、注销。
  Buff 普通目标和能力实体目标装配都收到同一个原生事件，而非新造的精简对象。
- 事件目标/来源、伤害属性条件和 Buff 目标查询已读取原始 payload。
  `originSkillTypeIn` 的原生事件类型门禁不因载荷现在完整而放宽；字段存在不等于原生条件支持。
- `NativeKillEvent` 的 `kind?: never` 只是迁移期间与旧联合共存的静态约束，运行对象没有
  kind 字段。完成其他事件迁移后应删除这一过渡约束和语义分发器，不能固化成两套协议。
- 原始事件引用、混合优先级/四阶段、筛选和启停注销已加入回归；83 文件 1012 项
  战斗运行时/事件及真实轴中断测试通过；最终全量 `vue-tsc --noEmit --project tsconfig.app.json`
  通过。不是全部真实轴伤害验收，也不代表所有事件统一完成。
- 扩大回归发现一项旧测试在同步上下文恢复之后读取 spy 保存的可变引用，已改为在
  执行期间观察事件；不取消上下文恢复来迎合测试。

下一批迁移 Buff 施加/结束/消耗及治疗，复用已有分发器，不能给每个事件再建独立总线。
击杀专用端口已在下一批替换为下述公共实体事件注册端口。

### 2026-09-09 Buff 输出订阅迁移

- 原生依据：combat-spec `before-output-buff.md` 的共享成功尾部，接收者
  `OnAddedBuff(9)` 先于来源 `OnOutputBuff(102)`，之后才执行关键词增强；
  `buff-ability-event-actions.md` 确认 OutputBuff 的 ID/Tag 条件及命中后的黑板写回。
- `RegisterCombatAbilityEvent` 以公共事件名索引载荷，替代击杀专用注册口。
  击杀与 Buff 输出复用同一个实体分发器的注册/优先级/阶段/注销实现，不增加事件族专用总线。
- 删除普通目标及能力实体 Buff 施加观察者中的 `buffOutput` 发布；定义中的同名筛选
  直接订阅原生 `outputBuff`，不再提前在 Added 后的语义观察者阶段执行。
- 删除运行时 `buffOutput` 数据包；定义监听与原生监听收到同一对象。
  Buff ID/标签条件及来源检查直接读取其原始 Buff 数据，输出黑板键仍在原动作黑板上写入。
- 已增加原始对象身份、来源所有者筛选、callback → dataAction → skill 顺序和
  Buff ID 条件输出的回归。治疗、Buff Added/结束/消耗仍待迁移；原生 Buff/装备监听
  的旧 normalize 消费路径也仍存在，不能将本次定义订阅迁移称为整族消费端统一。
- 最终验证：83 文件 1013 项战斗运行时/事件与真实轴中断回归通过，全量应用类型检查通过。

### 2026-09-09 起按事件族批量迁移

用户明确要求停止逐个事件推进。之后按共同原生载荷及执行链分组，一组内一起改发布、
订阅、上下文和条件读取，再跑一次整组回归，不给每个名字重复造适配代码。

1. **Buff 施加四阶段**：beforeOutputBuff / beforeAddedBuff / addedBuff / outputBuff。
   已加入共同 `BuffApplicationAbilityEvent` 和不复制对象的事件选择器。
   标准环境的 Buff/装备响应以及连携检查直接沿用本次发布对象，保留阶段与完整载荷。
   定义侧 buffApplied 现订阅 addedBuff，旧施加观察者接口及普通/能力实体装配均删除。
   未提供原始发布对象的旧自定义注册端口仍走兼容规范化；该兼容入口和旧 buffApplied
   上下文类型还需删除，不能据此宣称所有接入方式都已统一。旧语义 emit 已拒绝 buffApplied。
2. **Buff 结束族**：finishedBuff / buffEndsEarly，以及消耗/吸收通知一起审查。
   结束原因与消耗层数、黑板数据不是同一概念，保留字段差异，共用注册/条件机制。
3. **治疗族**：outputHeal / receiveHeal 与 operatorHealed 的 source/target 筛选一起迁移；
   前置修改器是同步可写端口，不能和已完成治疗通知揉成同一载荷。
4. **伤害族**：结算后通知一起收束，再处理伤害准备/可写修正端口；承伤与输出来源身份
   按 combat-spec 保留差异，不因共同数值字段而强制等同。

新测试夹具使用真实公共分发器；技能监听重入和区间结束注销从原生 addedBuff 入口验证。
不得通过保留旧 emit 的测试替身掩盖发布路径尚未迁移。
本批最终验证：83 文件 1017 项回归及全量应用类型检查通过。

### 2026-09-09 Buff 施加兼容口清理

上一批保留的可选原始事件参数已删除。Buff、装备、被动注册回调现在只接收
`AbilityEventContext` 和动作目标上下文，不再接收一份独立 payload 及可选的第三份 published。
共享响应上下文与连携读取同一入口：已迁移的四个 Buff 施加事件原样使用发布对象，
其他事件暂保留旧规范化逻辑。施加事件不存在缺失 published 时生成 buffApplied 的回退。

运行时 `buffApplied` 数据包及条件分支已删除，定义侧同名筛选继续订阅 addedBuff。
旧 normalize 函数若被直接用于施加事件会明确报错；不能重新添加兼容包装。
测试自定义端口也传递完整事件，覆盖技能附着编号、Buff 来源身份、配装目标与被动重入。
后续按结束/消耗和治疗族迁移剩余规范化，而非重新引入逐宿主的特殊字段。
通用施法来源读取也已识别原始 Buff 施加事件，不借用监听者身份。
验证：83 文件 1017 项回归、全量类型检查、diff 检查通过。

### Buff 结束、消耗与吸收事件族迁移（2026-09-09）

finishedBuff、buffEndsEarly、buffConsumed、buffAbsorbed 的响应保留原始通知对象。
不再压平为 buffFinished/buffConsumed 数据包；结束原因、消费层数和黑板快照直接从
原始 payload 读取。定义中的 buffConsumed 筛选直接订阅公共发布总线，删除装配层
第二次语义发布和 Buff 消费事件专用回接。吸收通知不会触发消费订阅。

依据 combat-spec 的 consume-buff-single.md、check-consume-buff-layer.md：
原生结束、提前结束、增强变化、消费通知有先后顺序与不同发布者，不能合并事件；
层数检查读取事件数据，不重新查询目标身上的 Buff。本次不调整原有发布顺序。
必须区分原生 owner 侧 OnBuffAbsorbed 与吸收者侧 OnAbsorbBuff，本批没有补齐两者
全部载荷；消费发布者目前提供的字段也不等于原生完整 reason/cast info，仍需另行核查。
统一消费路径不代表全部原生载荷已经完整建模。

回归补充四种通知对象身份保留，以及消费/吸收隔离、单次响应与注销验证。
后续继续整组迁移治疗，再处理伤害族及剩余旧规范化。

### 治疗事件族迁移（2026-09-09）

治疗事件族已接入原始 outputHeal / receiveHeal：删除 operatorHealed 运行时数据包和
abilityHeal 规范化数据包。operatorHealed 仅保留为定义筛选，source 角色订阅治疗者的
outputHeal，默认角色订阅受疗者的 receiveHeal，不再等受疗通知后另发一次语义事件。
生产者直接构造公共事件，环境原样发布；标签、过量治疗、黑板读值和事件目标共用载荷。
依据 combat-spec/heal-action.md，成功但实际增量为零仍通知；完整输出通知返回后再发布
受疗通知。sourceId/targetId 继续表示 healer/receiver，不把它们误当作原生两侧不同的
HealContext.eventSource。本批不扩展连携事件门禁，也不改变治疗修正和数值计算。

### 伤害原始事件消费迁移（2026-09-09）

伤害原始事件消费已批量迁移：beforeDamageAction、beforeCalculateDamage、beforeTakeDamage、
beforeOutputDamage、takeDamage、takeCriticalDamage、outputDamage、outputCriticalDamage。
删除 CombatAbilityDamageEvent 与 abilityDamage 规范化副本。准备阶段沿用 PlayerDamageContext，
结算阶段沿用 HealthDamageEventPayload；条件直接读取原对象，保留修改端口和结果引用。
依据 combat-spec/critical-damage-events.md 与 origin-skill-event-context.md，输出和承伤
不具有相同来源技能语义，不能因共同字段而扩大来源判断范围。原生暴击通知次序未改变。

伤害发布不能通过技能 ID 推断组键，也不能给外部命中伪造伤害结果。
执行组归属与外部输入的后续收束见下文。

### 伤害标签订阅移除二次发布（2026-09-09）

damageTagHit 只保留定义筛选，直接在 outputDamage 上检查来源范围与标签。
标准伤害执行器不再另发标签命中包。原生数据动作与定义数据动作共享同一发布总线和
优先级顺序，技能与装备条件读取完整原始载荷；outputCriticalDamage 不额外触发标签订阅。
原先在所有 outputDamage 监听之后另发标签通知的顺序不再保留。
注册端以 eventSubscription 统一描述已迁移筛选的事件与范围，不复制各宿主注册逻辑。
技能命中归属在下方单独说明，不混同继承来源。

### 外部受击输入统一订阅（2026-09-09）

operatorHit 只保留存档输入名称和定义筛选，不再作为第二种运行时通知。
定义筛选直接订阅目标实体 takeDamage；外部调度器只调用原始发布入口，
移除其 semanticEvents 依赖和第二次 emit。没有发布入口时明确失败，不静默丢弃。
ExternalOperatorHitPayload 明确 external=true，禁止提供 result/skillCastInfo；
只有 beforeTakeDamage/takeDamage 接受这种场景输入，暴击及输出伤害仍要求真实结算载荷。
标准环境保留原有 beforeTakeDamage → takeDamage 通知，不执行敌方动作、伤害公式或生命写入。
这是 Endaxis 用户注入边界，不宣称原生存在 external 字段。

### 技能命中移除末端通知（2026-09-09）

skillHit 仅保留定义筛选，直接订阅 outputDamage，删除旧运行时包和 emitSemanticHit 钩子。
执行组来自创建伤害执行器时的 CompiledSkillProgram.skillGroupKey，通过
executingSkillGroupKey 传到输出载荷；承伤方不携带。它是 Endaxis 执行归属，不是原生
SkillCastInfo 字段，也不等于 originSkillId。独立装备伤害没有执行程序，即使携带继承来源
也不触发技能组监听；未知/空组键不猜测。保留此前程序绑定语义，不扩大为所有继承该技能的伤害。
与标签监听一样，技能组监听进入 outputDamage 原生优先级与阶段，不再等输出及暴击通知
全部完成后另发一次。现有执行器的 has-hit 黑板仍在生命伤害函数返回后更新，
本次未从事件迁移反推或修改该黑板的原生写入时机；依赖同次通知读取此状态的规则需独立核查。

### 物理异常与击倒原始消费迁移（2026-09-09）

删除 abilityPhysicalInfliction / abilityKnockDown 字段副本。前置双方及承受后置物理通知、
两个击倒专属通知直接进入统一响应上下文；保留事件对象、skillCastInfo、技能挂载端口和
fromAirborne 校验。通用物理异常类型不代替击倒组件专属语义，不调整控制成功、破防门或计时。
依据 combat-spec/physical-infliction-actions.md 的通用通知序列，以及 knockdown-action.md
的控制组件边界；本批不从命名反推控制行为。
afterOutputPhysicalInfliction 已移除 Buff 专用语义回接。普通异常动作、击倒控制链及显式
输出动作统一发布原始后置通知，physicalInflictionApplied 仅保留定义筛选，直接订阅来源
实体总线；不再构造第二份运行时事件。前后置回调共享公共物理载荷定义。
Buff 响应与定义监听读取原始对象，启用、禁用、结束控制同一注册的生命周期。
airborneOutput、knockDownOutput 仍待按生产者整合；不能将组件专属输出与通用异常后置
仅凭名字合并，也不能算整族迁移完成。本批没有扩大动作上下文绑定或被动事件门禁。

### 尚未迁移的宿主与契约

元素附着四阶段已保留原始对象：beforeOutputInfliction、beforeTakeInfliction、
afterOutputInfliction、afterTakeInfliction 不再规范化为 abilitySpellInfliction。
原始 isExtra、SkillCastInfo 与输入/trigger 绑定保持独立；元素判断和来源读取使用公共载荷。
elementalInflictionApplied 仅保留定义筛选，直接订阅来源 afterOutputInfliction，
保留原有元素列表及 operator/team 范围。删除执行器末端的二次通知；定义数据动作进入
原生阶段与优先级，发生在目标后置通知之前，而不是回执记录之后。
依据 combat-spec/spell-infliction.md 的 126→121→状态变更→129→130 顺序；
不因此变更附着/爆发/复合状态分支，也不能认为每次通知都新增了附着层。
reactionApplied 自定义通知已删除；不能按时间相邻合并到施加后置事件。
角色 beforeTakeSpellInfliction 仍保留独立旧上下文，未伪装为这四条敌人附着通知。

附着消费现已接入公共 buffConsumed。此前适配器直接 finish('ignite')，绕过公共消费
观察者，再从动作末端补发 elementalAttachmentConsumed。现改为容器按既定实例结束，
由本次消费来源发布；Ignite 与 Early 共用消费通知，吸收仍保持独立。
依据 combat-spec/consume-buff-single.md，finishSource 是消费者而非原施加者，通知在
结束动作和状态卸载之后。不得改为按 ID 重新查找而消费另一个同名实例。
elementalAttachmentConsumed 仅作定义筛选，读取 buffConsumed 的原始标签与层数；
标签按 spell-infliction.md 的 INFLICTION_TAG_QUERY 父路径匹配，不依赖显示名或 Buff ID。
旧养成定义的 infliction_num 仍由同一层数初始化，不生成第二份消费事件。
未声称完成消费保护/伪消费分支或补齐 reason、cast info 等全部原生载荷；这些既有边界
不能靠事件统一自动填补。反应状态的 applyElementalReaction 则仍写独立状态容器，
没有证据可将它直接等同 addedBuff/消费/附着后置通知，因此删除自定义通知，见下文。

已删除 simulationReactionApplied 自定义通知、reactionApplied 养成定义及编辑入口。
同时删除 statusExpired/statusConsumed：全仓检查未发现正式发布端或生成数据使用者，
仅有类型、编辑词表和测试。移除契约、匹配逻辑、编辑默认值与翻译；存量定义通过
unknown event trigger 校验拒绝，不按 statusKey 猜测映射为 Buff 生命周期或消费事件。
这不删除状态本身的到期/消费计算，只清除没有实际发布链的订阅承诺。
不保留模拟专用事件名扩展，不提供到原生事件的猜测性迁移。实际被动效果必须按原始
监听配置使用附着、Buff 等原生事件和条件。natural-abnormal-wrapper.md 记录的
OnSpellAbnormalStartFinish 发布 GameLevelEvent 29/30，不能用状态写入后的通知冒充。
保留 applyElementalReaction 的状态计算和回执，不修订既有导电投影策略。

技力事件现已统一：资源执行器、定义筛选、Buff 响应、条件与黑板读值共享
skillSpGained 原始载荷，删除 spGained 运行时包及 Buff 技力专用回接。
skillSpGained 是 OnObtainAtb 的历史契约名，不意味着仅发布 Skill/Gain；不在本轮
做全量存档改名。依据 combat-spec/atb-gain.md 与 save-atb-obtain-value.md，
来源与 Gain/Return 由条件显式检查，移除旧 Buff 回接擅自施加的 Skill/Gain 门禁。
requestedAmount 对应效率后的 Value，amount 对应裁剪后的 RealDelta；满槽实增为零
仍保留通知。不改变本轮之前的请求量准入阈值、效率计算或资源入账顺序。
定义筛选直接进入实体分发阶段与优先级，不能在末端再补发 spGained。
技力事件只有来源而无目标；公共 abilityEventSourceId/abilityEventTargetId 读取真实字段，
不向载荷补造 targetId。无目标的相等/不等比较均不通过，需要目标的动作明确拒绝。

击倒旧别名的边界已核查：`knockdown-action.md` 确认组件来源通知为
`41 / OnAfterOutputKnockDown`，带 `fromAirborne`，与通用物理异常后置是不同事件。
Endaxis 的 `knockDownOutput` 当前同时接组件通知和手工 `outputKnockDown` 动作；
后者只有 target 参数。`airborneOutput` 同样存在手工输出动作入口。
因此不可直接把旧别名全局替换为组件通知，也不可给手工动作补造 fromAirborne=false。
现已删除组件到旧别名的二次发布。旧 knockDownOutput 定义筛选直接订阅来源实体的
afterOutputKnockDown，同时兼容手工标记；两份订阅由同一个释放句柄管理。
收到组件通知时保留完整原始对象及 fromAirborne，收到手工标记时仍保留原始标记，
不构造组件载荷。定义动作进入原生阶段与优先级，不再等原生分发结束另跑一遍。
这只是旧定义的兼容筛选，不是原生事件别名；手工输出的旧发布端仍待单独清理。

Buff 的 afterKillEntity 专用语义回接已删除：与其他已迁移事件共用原始注册端口和
withAbilityEventResponseContext，装配层不再为普通实体/能力实体重复写击杀适配分支。
击杀类型归公共事件定义，消费方直接引用该定义；响应保留同一发布对象。
当前 Buff 专用语义路径仅余 outputKnockDown 的手工标记兼容订阅。
技能来源公共读取现覆盖 before/afterOutputKnockDown 完整事件。此前装备旧触发器路径
传入完整对象，而读取函数只识别部分已迁移事件，遗漏击倒导致来源返回 undefined。
保留 payload.skillCastInfo 原始引用、null 和缺省的区别；不向手工标记补造来源。
装备 abilityEvent 响应现通过 withAbilityEventResponseContext 执行动作，不单独构造
Input/Trigger 和施法来源。装备保留每次响应黑板与被动 Ability 子 Buff 所有权；临时
事件上下文在响应结束后恢复。旧语义触发器入口仍独立处理，不能宣称全部路径已统一。

poiseZero/poiseKnotBreak/afterAddedShield 已删除 abilityPoise/abilityShield 副本，条件与
黑板动作直接读取原始载荷。失衡仍由目标侧发布，Input 为来源、Trigger 为失衡目标
（combo-event-gates-and-pending.md）；本轮不改发布顺序。护盾 gained/current 不合并。
独立待办：save-shield-value-to-blackboard.md 指出 CurValue 应查询显式目标当前有限
护盾总值，Endaxis 现有 storeShieldValue 仍读取事件 currentValue 快照；事件统一未
修复这个行为边界，后续需连同目标配置/转换及执行一起核查。

weaknessSet/afterOutputWeaknessTriggered/customAbilityEvent 直接消费原始事件，删除
三个平铺上下文；自定义名称精确匹配、成功才写参数，依据 custom-ability-event.md。
弱点设置/触发/失衡不合并；原生含义见 weakness-trigger-output.md。weaknessSet 的
targetId 占位已随公共端点按需读取一起删除，仍保留 Input=发布者、Trigger=空。

enterFight/ownerSwitchToCenter/ownerSwitchToGuard/ownerHpZero/abilityEntitySpawned/
abilityEntityFinished 已删除 abilityLifecycle 平铺包装，公共响应读取同一发布对象。
本轮不改发布点：能力实体来源和 Target 关系依据 spawn-ability-entity.md，HP-zero 不与
死亡/释放混同（owner-death-event.md）。保留当前入战和切主控调度；没有因迁移新增事件。

beforeCastSkill/afterSkillApplyCost/skillEnd 已删除 abilitySkill 平铺副本；SkillRuntime
只生成 AbilitySkillPayload，不把 kind/event 再嵌进发布载荷。当前技能 ID/类型条件、
SkillAffix 结束清理及 currentCastSkill Buff 挂载读取原始对象和回调。继承来源只读
skillCastInfo，不替代当前施法的 skillId/skillType/skillCastId；扣费后事件不补造挂载
回调。原有自然完成、中断、挂载 Buff 清理顺序不变。

buffEnhanceChanged 直接消费实体总线原始事件，删除 abilityBuffEnhanceChanged 副本。
事件在 Buff owner 上发布且无动作目标，不再写入 targetId=owner；不改变 layerCount
变化量、reason 或发布时点。依据 consume-buff-single.md、finish-buff-advanced.md，
该通知与 Buff 的 after-try-enhance、附着通知不是一回事。当前载荷仍未补齐原生 Buff
实例与由其读取的来源信息，本轮不能据此声称完全复刻所有条件上下文。
普通实体与能力实体的 Buff 生命周期接线统一由 CombatRuntimeAssembly.#configureBuffLifecycle
维护：生命周期操作、消费/吸收发布和击倒兼容订阅不再各复制一份。能力实体仍在首次
创建 Buff 运行时后接线并缓存，普通实体仍在开局动作前接线；不改变注册时点或事件身份。

- 被动转换器将实体出生/结束投为 abilityEventResponses，获得技力/添加 Buff/治疗投为
  listenForCombatEvents；需按原生发布时机、payload 与同步修改能力逐项比较后统一。
- Buff 仍区分 Ability 与 semantic 注册路径；后者不能因名称相近就替换为通知日志，
  特别是伤害前事件对当前处理器的同步修改不能延迟。
- 被动转换、校验、编译及注册仍只开放两个 Ability 事件。公共响应结构暂保留这个窄门禁，
  且不开放其注册链尚未消费的 samePriorityKey；这是实现边界，不是游戏领域约束。
- Buff 同事件/优先级分组和可交换响应证明，尚未抽为宿主中立的订阅机制。
- 装备旧触发器与原生响应现已共用临时上下文；连携条件每次检查的动作状态
  与持续监听序列的状态不同，不能通过统一类名抹掉此差异。
- listenForCombatEvents 是序列拥有的订阅动作，开始/结束控制注册期；根级响应则由
  宿主安装/卸载控制注册期。两者应共享事件解释与执行机制，但不强改成相同生命期。

下一批先审查转换/消费通道与能力门禁，再实现公共订阅宿主接口。不能只删 Extract 或
吞掉不支持事件，也不能在各宿主里继续复制新的事件适配分支。
