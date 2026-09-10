# 事件统一：当前验收清单

更新：2026-09-10，以 Endaxis `a4f14c24`、combat-spec `ac17d2a` 工作树复核。
本表替代原来的按轮次追加清单；旧检查点保留在 Git 历史和 current-context，
不能把历史“已办/待办”当成当前状态。**总体未验收完成。**

2026-09-10 接续：被动/配装与 Buff 已共用逐动作执行许可；技能 CastEnd 已修正
清理前附属 Buff 快照及仅移除快照成员。最近战斗回归为 117 文件 1412 项通过，
四真实轴完整结果一致。下方旧测试计数是历史检查点，最新结果见 current-context。
这些修正不关闭完整回调宿主、所有投射物引用及完整 Disable 顺序的余项。

## 范围与完成标准

最新请求宿主进展：C# 已有保存/消费单槽及真实 SkillAffix 转交回归（新增8项，
全库1839/1845，六项既有资源失败）。固定宿主调度投影不等同完整玩家指令分支；
详见 current-context 与复刻库 cast-skill-action 最新节，不关闭完整回调宿主余项。

同一原生事件在发布、订阅、条件及动作中使用同一身份、载荷与上下文规则；
宿主只负责自己需要的所有者、黑板、注册/启用/销毁生命期。
依据复刻库原生证据收技术债，不新增敌人主动行为、未知关卡机制或编辑功能。
不以统一为由合并不同原生事件，不以测试通过代替证据，不以删除全部兼容代码为目标。

当前工作目录为 D:/Projects/Endaxis 与 D:/Projects/combat-spec；
分支分别为 refactor/common-game-data、refactor/operator-completion。不是旧工作树路径。

## 已复核的实现与仍需保留的边界

| 项目               | 当前状态与代码依据                                                                                                                             | 验收边界                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 统一身份/载荷      | `combatAbilityEvent.ts` 的 AbilityEventPayloadMap；dispatcher 从完整映射按键取子集                                                             | 内部过程通知不是自动可配置原生事件                   |
| 响应上下文         | `abilityEventResponseContext.ts`；被动、配装与临时监听复用作用域                                                                               | finally 恢复，不把监听者当发布者                     |
| 内部分类           | 16个分类函数只按事件名收窄，原对象传递；旧 abilityEventPayload.ts、normalizeAbilityEventPayload、readSkillCastInfoFromPayload 已无正式代码引用 | 外部输入仍需校验；不是删掉所有运行时错误检查         |
| 动作目标绑定       | `abilityEventActionContext.ts` 接完整事件；战斗装配与连携共用端点表                                                                            | weaknessSet 不造目标；未绑定事件不猜测               |
| 连携转交           | `standardPlayerDamageEnvironment.ts` 回调按完整事件收窄，两处断言已删除                                                                        | 发布准入和端点表不是同一概念；范围没有扩展           |
| 生成公共事件程序   | `abilityEventProgram.ts` 被 Buff、临时监听、武器投影使用                                                                                       | 原序列各自保留，来源下标不因过滤变化                 |
| 宿主启用           | `passiveAbilityEventRuntime.ts` 与 `equipmentEventRuntime.ts` 有启用门禁，响应复用公共上下文                                                   | 不把注册在先等同初始化时已可响应                     |
| 被动准入           | 契约 operators.ts 当前为5项：261/262对应事件、addedBuff、skillSpGained、receiveHeal                                                            | 是已支持范围，不是原生只有5种事件                    |
| 临时监听产物       | 正式干员仍使用 listenForCombatEvents；8处为统一 abilityEvent 的 addedBuff/outputBuff，另3处为 operatorHit                                      | 方法名不等于旧重复事件模型；兼容事实与原生事件须分开 |
| Buff 当前实例/来源 | 当前实例结束、ID/Tag结束和减层、点燃收尾已保留实际实例及来源；事件黑板读实时实例                                                               | 不把原始施加技能当成结束来源                         |
| 增强               | 正向是后置动作后的尝试通知+1，满层也发布；实际增层内部动作先于属性刷新                                                                         | 定时增长不是同一种对外尝试事件                       |
| 护盾读取           | 新增量读147；当前量读动作Owner实时有限护盾；缺目标/所需事件成功不写                                                                            | 不开放未审计目标，不读取事件快照冒充当前量           |
| 自动/父子结束      | 到期、解除保护补到期、满层替换明确空来源；父结束动作→退出作用域→标记结束→清子实例                                                              | 不能泛化到所有宿主清理                               |
| 单一构造断言       | #emit 的重载约束名称/载荷后构造完整联合                                                                                                        | 不是输入校验；不为“零断言”复制协议                   |

上述主要证据在 combat-spec 的 ability-enable-event-order、origin-skill-event-context、
buff-enhance-event-context、ability-entity-event-origin、save-shield-value-to-blackboard、
buff-automatic-finish-source、consume-buff-single 等专题。具体 RVA、哈希和 IFix 限制以专题为准。
概念阅读先看 [事件系统说明](../next/event-system-guide.md)。

## 尚未完成：下一阶段应按此顺序执行

1. **直接结束调用者的来源/顺序。** 技能附属Buff已通过当前_FinishBuffs调用核实空来源；
   Ability本体清子Buff也已核实空来源，配装dispose已接；配装宿主退出/注销的相对顺序
   未由这一调用推断。GlobalBuff子清理已核实固定Other+空来源，父Early不传给子；
   两仓均已修正，完整宿主退出顺序仍待核实。仍需核实能力实体的Ability所有权子Buff、
   SkillAffix完整引用保留等入口。其引用耗尽结束已核实Other+空来源，直接技能回调
   已修正；不能由此宣称子实体/投射物/输出Buff引用计数已实现。
   输出Buff引用已接实际实例及独立回收通知；两仓普通宿主tick已接回收阶段，
   位于技能更新后、宿主动作容器更新前，不以finishedBuff替代。动态能力实体正在
   对齐Buff→子技能→回收顺序；真实轴梨子诺连携收尾10个hit后移一帧，数值不变，
   已依据同组pending准入证据接受，去除了新实体Buff额外推进。宿主销毁回收、
   实体reset已接入实际对象端口；duration-finish投射物已接163发布并复用同一reset引用。
   其他投射物投影、无回调发射、回调技能内部动作区间和pending request引用仍未完成。
   护盾耗尽移除已核实Other+空来源，TS数值/次数耗尽均验证；这不等于完整ShieldBlockDamage事件已验收。
   现有未知来源不能一律改成null，也不能一律继承宿主施法。
   代码入口：skillRuntime、logicalAbilityEntityRuntime、equipmentEventRuntime、
   globalBuffRuntime、combatBuffs、buffLifecycleSequenceRuntime。
   Buff分发快照已补结束有效性：前序响应结束宿主后后续响应跳过；原生isActionValid
   仅检查!isFinished，canExecuteAction另加isEnabled。现已沿AbilityAction.Execute
   证实逐动作还有canExecuteAction门禁；两仓公共序列执行器已接Buff实时许可，
   C#注册谓词保留。完整启用/禁用相对顺序仍须核对，不能将两个原生属性混为一谈。
   实体自身Buff容器已改releaseAll，旧finishAll已删；BuffReleased仅作为表现回执，
   不发布普通结束/减层事件。C#也接自身Buff释放。完整组件顺序与子技能清理仍未验收。
   本地资产目录链接恢复后，C#生命周期/实体生成/剑替换93项通过；旧41成功+16拒绝
   的过期断言改为同一总数57项全部解析，不捕获吞掉解析失败。
   后续完整核实Skill.CastEnd主干：只清本次施法附属列表，不无条件清Ability子Buff；
   C#已移除错误清理，相关回归118项通过。全库1808/1814通过，6项资源/适配器失败
   详见current-context；不能记为全库通过。此结论不代替实体完整Disable/销毁顺序。
2. **额外通知的最终分类。** [现有分类表](../next/damage-event-boundaries.md)
   已记录生产类型，但尚未完整证明每项的原生身份与消费者边界。
   只解决当前模型已有路径；不得为清单打钩扩展敌人主动行为或关卡脚本能力。
3. **优先级证据。** compileAuditedDefaultPriority 当前严格拒绝非Default/非零偏移；
   队列排序已有实现，不等于原生优先级映射已经全部核实。审计实际源数据是否触及限制，
   samePriorityKey已从协议到消费移除：分发器从未使用该字段，原生同级按注册顺序；
   可交换性推导也已删除。不能通过放宽校验“完成”非Default优先级转换。
   当前hybrid源已全量查优先级：11个非零项均在技能时间轴，不在事件程序，Buff启用项
   全为Default+0。当前事件数据未触及门禁；完整枚举/时间轴排序不由此宣称完成或扩展。
4. **事件Buff黑板的泛型上下文边界。** 已完成 Target+Context 的现有切片与目标门禁；
   未确认的上下文子类仍不应自动开放。已有无法解析的外部泛型方法地址见证据文档，
   不重复无依据地猜测同一地址。判断其是否影响正式产物后再确定剩余实现范围。
5. **兼容入口的明确归属。** operatorHit 在源转换中有明确木桩外部事实说明；
   手工击飞/倒地仍是编辑器能力。逐项确认没有重复原生发布或错误来源投影，
   而不是因“正式数据里少见”删除。Extract/Exclude 的全仓281项是初始盘点，
   本轮只处理事件相关问题，其余工作不混入事件收束。
6. **最终综合验收与文档一致性。** 重新检查正式产物、源数据准入、编译器/协议/
   运行时贯通测试和真实轴差异；最终必须把每项与证据对应后才能宣布完成。
   旧轴与伤害归因工作在此之后恢复。

## 测试与产物证据分级

- 最近运行时/Buff/事件及投影回归：108文件1333项通过；应用类型检查通过。
  这不是全仓测试或所有资产的穷举。
- 最近四条真实轴额外出现BuffReleased替换/追加，不能再沿用0/0/7/3回执差异计数。
  除Finished/Released外的回执集合去序号一致；诊断引用解析回实际回执后内容一致。
  数量及额外释放原因见current-context的实体容器接入章节，旧基线没有覆盖更新。
- 31干员、79武器、24套装的重生成/落位属于此前检查点记录；
  本轮只检查正式事件引用，并未重新执行全量生成，不借旧数量证明当前源快照全量通过。
- 临时产物/审计/下载数据继续放被忽略的tmp，不提交。
- 当前余项没有全部闭合，所以不能标记事件统一目标完成。
