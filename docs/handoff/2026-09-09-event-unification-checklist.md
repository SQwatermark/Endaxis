# 事件统一：当前验收清单

更新：2026-09-10，以 Endaxis `a4f14c24`、combat-spec `ac17d2a` 工作树复核。
本表替代原来的按轮次追加清单；旧检查点保留在 Git 历史和 current-context，
不能把历史“已办/待办”当成当前状态。**总体未验收完成。**

## 范围与完成标准

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
   两仓均已修正，完整宿主退出顺序仍待核实。仍需核实能力实体子Buff、容器finishAll、
   SkillAffix绑定技能结束等入口。护盾耗尽移除已核实Other+空来源，TS数值/次数耗尽
   均验证；这不等于完整ShieldBlockDamage事件已验收。
   现有未知来源不能一律改成null，也不能一律继承宿主施法。
   代码入口：skillRuntime、logicalAbilityEntityRuntime、equipmentEventRuntime、
   globalBuffRuntime、combatBuffs、buffLifecycleSequenceRuntime。
   当前容器finishAll唯一正式调用来自combatRuntimeAssembly的能力实体finished回调，
   经buffDefinitionOperationTarget转发；应与能力实体销毁一起核实，不另造一套事件规则。
2. **额外通知的最终分类。** [现有分类表](../next/damage-event-boundaries.md)
   已记录生产类型，但尚未完整证明每项的原生身份与消费者边界。
   只解决当前模型已有路径；不得为清单打钩扩展敌人主动行为或关卡脚本能力。
3. **优先级证据。** compileAuditedDefaultPriority 当前严格拒绝非Default/非零偏移；
   队列排序已有实现，不等于原生优先级映射已经全部核实。审计实际源数据是否触及限制，
   核对 samePriorityKey；不能通过放宽校验“完成”转换。
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

- 最近运行时/Buff/事件回归：85文件1212项通过；应用类型检查通过。
  这不是全仓测试或所有资产的穷举。
- 最近四条真实轴相对旧基线差异为0/0/7/3个回执位置：后两条仅有已解释的同帧结束顺序变化。
  完整回执集合（除序号）、数值及诊断一致；不能写成“顺序完全一致”。详情见current-context。
- 31干员、79武器、24套装的重生成/落位属于此前检查点记录；
  本轮只检查正式事件引用，并未重新执行全量生成，不借旧数量证明当前源快照全量通过。
- 临时产物/审计/下载数据继续放被忽略的tmp，不提交。
- 当前余项没有全部闭合，所以不能标记事件统一目标完成。
