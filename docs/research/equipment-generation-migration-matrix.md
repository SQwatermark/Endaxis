# Endaxis Next 装备生成迁移矩阵

本报告位于旧装备结构化快照与正式 Next DSL 之间。它证明每个旧 effect 已被严格分类并保留迁移所需语义，但不会生成或承诺当前运行时已经支持的正式 DSL。

## 总览

- Effect 总数：1049
- 可无损进入迁移 IR：1049
- 因源语义无法闭环而阻塞：0
- 等待静态定义适配审计：899
- 仍需核心能力：150

| 迁移类别            | 数量 | 来源分布                                    | Effect kind                                              | 代表样本                                                                                                                                                                                                                                                      |
| ------------------- | ---: | ------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 构筑期静态贡献      |  899 | `gearPiece` 673、`gearSet` 20、`weapon` 206 | `status` 899                                             | `src/data/weapons/arts-unit/3/jiminy-12.ts#skill1.effects[0]`<br>`src/data/weapons/arts-unit/3/jiminy-12.ts#skill3.effects[0]`<br>`src/data/weapons/arts-unit/4/fluorescent-roc.ts#skill1.effects[0]`                                                         |
| 战斗初始化/常驻修正 |   33 | `gearPiece` 21、`gearSet` 6、`weapon` 6     | `status` 33                                              | `src/data/weapons/arts-unit/4/hypernova-auto.ts#skill3.effects[0]`<br>`src/data/weapons/greatsword/6/sundered-prince.ts#skill3.effects[0]`<br>`src/data/weapons/polearm/4/pathfinders-beacon.ts#skill3.effects[0]`                                            |
| 事件触发行为        |  111 | `gearSet` 21、`weapon` 90                   | `consume` 1、`damageHit` 2、`spRecovery` 1、`status` 107 | `src/data/weapons/arts-unit/4/fluorescent-roc.ts#skill3.triggers[0].effects[0]`<br>`src/data/weapons/arts-unit/5/obj-arts-identifier.ts#skill3.triggers[0].effects[0]`<br>`src/data/weapons/arts-unit/5/stanza-of-memorials.ts#skill3.triggers[0].effects[0]` |
| 一次性行为          |    6 | `gearSet` 2、`weapon` 4                     | `oneTime` 6                                              | `src/data/weapons/polearm/5/cohesive-traction.ts#skill3.triggers[0].effects[0]`<br>`src/data/weapons/sword/5/aspirant.ts#skill3.triggers[0].effects[0]`<br>`src/data/weapons/sword/6/glorious-memory.ts#skill3.triggers[0].effects[0]`                        |
| 当前无法转换        |    0 | -                                           | -                                                        | -                                                                                                                                                                                                                                                             |

## 分类语义

- **构筑期静态贡献**：无 trigger、无动态生命周期或条件、目标为自身，且 modifier 可在开战前确定。该分类不表示当前 EquipmentModifierDefinition 已可表达，也不表示数值会显示在角色面板。
- **战斗初始化/常驻修正**：无 trigger，但依赖战斗条件、动态缩放、非自身目标或仅有战斗语义，应在战斗装配阶段注册。
- **事件触发行为**：由旧 trigger 驱动的状态、伤害、资源或消费行为。IR 保留完整事件过滤器与执行 effect。
- **一次性行为**：旧 `oneTime`，需编译成可按技能过滤器消费的临时状态，不能直接改写下一项技能定义。
- **当前无法转换**：源结构已知，但尚无无损迁移规则，例如被放在被动区的即时动作。未知数据不会进入此类，而是直接令审计失败。

`requiresDefinitionAudit` 表示需由独立候选定义适配器核对当前 DSL；`requiresCoreCapabilities` 表示语义已保存，但正式生成前仍需对应 Buff、事件、条件、目标或生命周期能力。它们都不等于当前运行时已经实现。

## 后续能力需求

下表是正式 DSL 与运行时需要实现或核验的能力，不代表迁移 IR 丢失了这些语义。

| 能力                                       | 涉及 effect 数 |
| ------------------------------------------ | -------------: |
| `effect.status`                            |           1039 |
| `target.self`                              |           1009 |
| `build.modifier.attributeFlat`             |            515 |
| `build.modifier.dmgBonus`                  |            166 |
| `lifecycle.duration`                       |            111 |
| `event-target.enemy`                       |             68 |
| `combat.modifier.dmgBonus`                 |             63 |
| `event.onStatusApplied`                    |             55 |
| `build.modifier.atkPercent`                |             54 |
| `build.modifier.ultimateGainEfficiency`    |             44 |
| `build.modifier.artsIntensity`             |             34 |
| `combat.modifier.atkPercent`               |             32 |
| `lifecycle.maxStacks`                      |             32 |
| `build.modifier.hpPercent`                 |             25 |
| `lifecycle.stackStrategy`                  |             25 |
| `build.modifier.critRate`                  |             23 |
| `build.modifier.attributePercent`          |             20 |
| `event.onActionStart`                      |             20 |
| `event.onStatusConsumed`                   |             20 |
| `target.team`                              |             15 |
| `lifecycle.icd`                            |             14 |
| `condition.operatorStatus`                 |             13 |
| `condition.not`                            |             11 |
| `target.enemy`                             |             11 |
| `combat.modifier.increasedDmgTaken`        |             10 |
| `event.onHit`                              |             10 |
| `build.modifier.atkFlat`                   |              9 |
| `build.modifier.flatHp`                    |              9 |
| `combat.modifier.heal`                     |              9 |
| `combat.modifier.protection`               |              8 |
| `event-target.self`                        |              8 |
| `target.owner`                             |              7 |
| `condition.enemyStatus`                    |              6 |
| `effect.oneTime`                           |              6 |
| `event.onSpRecovery`                       |              6 |
| `target.teamExcludeSelf`                   |              6 |
| `lifecycle.ignoreTimeShift`                |              5 |
| `scaling.status`                           |              5 |
| `combat.modifier.susceptibility`           |              4 |
| `condition.operatorHp`                     |              4 |
| `combat.modifier.artsIntensity`            |              3 |
| `combat.modifier.critRate`                 |              3 |
| `event.onBattleStart`                      |              3 |
| `lifecycle.stacks`                         |              3 |
| `combat.modifier.attributePercent`         |              2 |
| `combat.modifier.cooldownReductionPercent` |              2 |
| `combat.modifier.defPercent`               |              2 |
| `combat.modifier.staggerPercent`           |              2 |
| `condition.enemyStaggered`                 |              2 |
| `effect.damageHit`                         |              2 |
| `event.onFinalStrike`                      |              2 |
| `combat.modifier.shield`                   |              1 |
| `condition.or`                             |              1 |
| `effect.consume`                           |              1 |
| `effect.spRecovery`                        |              1 |
| `event.onStatusExpire`                     |              1 |
| `target.teamExcludeSameElement`            |              1 |

## 当前阻塞

- 本轮 1052 个 effect 均可无损进入迁移 IR，没有源结构级阻塞。
- 正式 Next 装备 DSL、Build Resolver、装备 Buff 编译器和事件适配器尚未由本工具生成或实现。
- 能力需求必须逐项结合游戏数据与运行时证据闭环；不能把“IR 已保存”误写成“战斗行为已支持”。

## 机器可读数据

同名 JSON 为每个 effect 保存稳定迁移身份、来源槽位与形态、分类、目标、trigger、condition、modifier、生命周期、能力需求和原始结构化 effect。
