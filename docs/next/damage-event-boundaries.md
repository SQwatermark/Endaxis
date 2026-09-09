# 标准伤害环境的额外通知边界

2026-09-09。事件统一的类型清理记录，不新增事件能力或游戏行为。

`StandardPlayerDamagePayloadMap` 的公共键沿用 `AbilityEventPayloadMap`；其余键现在
引用生产模块的载荷类型，不再用 `Record<..., unknown>` 兜底。这里的分类是代码归属，
不是按名称判定游戏原生类型。**未进入公共可配置契约，不等于非原生或无模拟影响。**

## Buff 释放的表现通知（2026-09-10 取证）

Buff.Release的owner回调已核实为onBuffIconChange及UI总线0x1C4，参数为Buff、
applied=false、Other。它不是AbilityEvent的Buff结束/减层通知。未来独立释放接口
需要让表现层移除状态，但不能复用战斗结束发布器来达到该效果。
证据见combat-spec/docs/ability-entity-event-origin.md末节：owner+3F0字段、
带符号OnBuffIconChange与调用版本的共同参数/订阅器/总线编号。

后续已接：实体Buff容器释放使用独立BuffReleased回执，所有Buff状态投影接受其
终止语义；普通结束仍记录BuffFinished。两者都能结束显示，不意味着都发布
finishedBuff或209减层。#recordBuffRemoval与#emitBuffFinished已分离。

## 标准环境已有额外通知

| 标准环境额外键                                                    | 当前生产端与载荷                                                  | 证据/尚存边界                                                                           |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| beforeKillEntity                                                  | healthDamage：HealthDamageEventPayload                            | 保留现有伤害流程；本轮不新增原生枚举映射                                                |
| beforeOutputPoiseDamage / beforeTakePoiseDamage / takePoiseDamage | poiseDamage：同一可变 PoiseDamageModifier                         | combat-spec/damage-formula 已记录原生失衡通知顺序；不得复制修正器而破坏同步修改         |
| beforeTakeSpellBurst                                              | 标准环境的爆发发布入口，与来源通知复用同一对象                    | combat-spec/buff-data-adapter 记录 OnEnemyBeforeTakeSpellBurst(128)；未开放额外订阅配置 |
| elementalInflictionStarted                                        | elementalInflictionBuffAdapter：ElementalInflictionStartedPayload | 关卡通知投影；不能将关卡脚本系统等同于实体 AbilityEvent，亦不能整体认定无效             |
| poiseRecovered                                                    | CombatVitalsRuntime：无额外载荷，标准环境发布空对象               | 恢复计时适配；本轮不推定原生事件枚举或引入新的消费者                                    |
| KnockDownAbilityEvent 中非公共键                                  | KnockDownOperationExecutor：KnockDownEventPayload                 | 普通倒地调用及组件通知；原生依据/限制见 combat-spec/knockdown-action                    |

`game-level-event-consumers` 的反编译证据表明关卡事件可以执行脚本，不能仅因当前
Endaxis 没有消费者就宣布整类事件无实际效果。具体版本、IFix 和资产覆盖边界仍以
combat-spec 专题为准，本轮未重新穷举或验证包体。

新增类型回归要求广播键集合与载荷表键集合完全一致、总载荷联合不含 unknown，且
关键通知直接复用生产类型。现有 `#emit` 仍在一个构造边界恢复事件名/载荷关联；
该断言不是运行时验证，本轮没有通过包装或复制对象来隐藏它。

仍未完成的工作：依据证据决定哪些原生通知应纳入统一可配置契约、收束各消费者
的重复 guard，以及 Buff/护盾上下文的独立语义缺口。类型齐全不等于这些机制已完成。
