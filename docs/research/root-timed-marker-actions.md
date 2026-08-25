# 根级 TimedMarker 动作盘点

## 任务边界

本文是生成器主线之外的副线研究，只盘点条件分支之外的 `CreateTimedMarker`，不修改生成器、Next 运行时或干员配置。

这里的“根级/非 conditional branch”是指动作不位于 `IfElseAction.succeedActions` 或 `failActions` 中。它仍可能位于技能时间轴、`ForEachAction.action`、Buff 事件序列或其他动作容器中。

数据依据：

- `vfs-index-browser/combat-spec/artifacts/SkillData`
- `vfs-index-browser/combat-spec/artifacts/BuffData`
- `tmp/all-operator-recursive-mechanism-audit.json`（本地可重建审计，不进入 Git）
- `scripts/generate_next_operators/generate_next_operators.py`
- `combat-runtime-dumps/1.4.4` 与现有 `native-timed-marker-runtime.md`

共找到 **36 个 occurrence**：SkillData 13 个、BuffData 23 个。其中 35 个启用，1 个原生 `isEnable=false`。另有武器技能 `sk_wpn_funnel_0015` 1 个，单列但不计入干员覆盖。

## 结论

1. 根级 TimedMarker 不是语音专用设施。当前范围内没有根级语音冷却标记；伊冯的 `chr_0017_yvonne_voice_cd` 位于条件分支内，不属于本次清单。
2. 35 个启用 occurrence 中：
   - 5 个已被生成器的窄模式专门消费，不属于静默丢失；
   - 3 个可由字段和消费者闭环为 UI/特效计时，可在战斗模拟中显式忽略；
   - 其余 27 个会绕过当前 unresolved 检查，且多数直接影响伤害、回能、Buff、技能冷却或事件去重，应当失败关闭。
3. Next 已有 `TimedMarkerContainer` 和 `createTimedMarker` 执行器，主要缺口不在运行时容器，而在根技能时间轴、Buff 事件和被动事件的解析、调度与完备性审计。

提交 `bff521e` 已完成第一步安全整改：`CreateTimedMarker` 作为独立的有状态战斗动作进入根时间轴、子技能和 Buff 事件的完备性事实；庄方宜强化连携中已由主目标投射物去重投影消费的标记显式排除重复计数。全干员严格编译数由 212 降为 209，新增阻断为诀第四/第五段普攻和阿黛拉战技，表示此前覆盖率包含了尚未消费的标记行为。其余条目仍需按本文建议逐类贯通，不能仅为恢复数字而放行。

## 当前生成器行为

`COMBAT_ACTION_NAMES` 不包含 `CreateTimedMarker`，因此：

- `collect_unresolved_combat_actions` 不会把根时间轴上的标记报告为未覆盖；
- Buff/被动事件的 `combatActions` 同样不会因标记而阻止编译；
- `CONDITIONAL_AUDIT_ACTION_NAMES` 虽包含标记，但只保护条件树内动作，不能覆盖本文清单。

目前只有两个专用旁路消费根级标记语义：

- `collect_timed_marker_damage_gates`：识别 `CheckTimedMarkerCondition -> DamageAction -> CreateTimedMarker` 的动态 ID 单目标去重；
- `is_projectile_trigger_excluded_for_single_enemy`：识别先给主目标加标记，再排除投射物对主目标的重复处理。

因此，不能仅以“原始动作仍出现在审计中”判断已经建模；必须确认它进入正式调度，或被以上专用投影折叠为等价行为。

## SkillData 清单

| 干员/来源                           | 技能文件与路径                                                                                                                                                     | 标记                                                                            | 用途判断                                                                                              | 当前处理                                                               | 建议                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Ardelia (`chr_0025_ardelia`)        | `chr_0025_ardelia_ultimate_skill_sheep_projhit`：`timelineActions[2]._sequenceActionData.actionData[0].action.actionData[3]`                                       | `ArdeliaUltMark`，目标，`interval` 秒                                           | 同一 `ForEach` 中为 `Check -> Damage -> EnemyHurtAnim -> Create`，是终结技羊投射物的目标命中去重      | **静默过滤**；因中间隔着 `EnemyHurtAnimAction`，不匹配现有三动作窄模式 | 高优先级纳入通用命中门控；在此之前 fail-closed                         |
| Tangtang (`chr_0027_tangtang`)      | `chr_0027_tangtang_ultimate_skill_1`：`timelineActions[6]._sequenceActionData.actionData[0]`                                                                       | `tangtang_ult`，自身，4 秒，`autoFinishByAction=true`，`useTimeDilationDt=true` | 后续两个 `AuraAction.buffIconDurationSource` 明确使用 `TimedMarker` 覆盖 Buff 图标时长                | 静默过滤，但没有发现 `CheckTimedMarkerCondition` 战斗消费者            | 可作为 UI 计时显式 allowlist；无需为后端伤害模拟实现，不能无说明地忽略 |
| Zhuang Fangyi (`chr_0030_zhuangfy`) | `chr_0030_zhuangfy_attack1_ult_{1..4}_abilityrange`：各自 `timelineActions[2]._sequenceActionData.actionData[0].action.actionData[2]`                              | 动态 ID `EntityBB_hitedMark`，目标，0.4 秒                                      | 四段强化普攻能力范围的 `Check -> Damage -> Create` 命中去重                                           | **已消费**为 `timedMarkerGate`                                         | 保持专用投影；后续可并入通用根序列解析                                 |
| Zhuang Fangyi                       | `chr_0030_zhuangfy_combo_skill_ult`：`timelineActions[14]._sequenceActionData.actionData[6]`                                                                       | `zhuangfy_combo_ult_tar`，`Context:smart_target`，0.5 秒                        | 先标记主目标，环形投射物命中技能再检查该标记，避免主目标被重复处理                                    | **已消费**为 `excludedByPrimaryTargetMarker=true`                      | 保持现有单敌人等价投影                                                 |
| Zhuang Fangyi                       | `chr_0030_zhuangfy_normal_skill_ult_abilityrange`：`timelineActions[13]._sequenceActionData.actionData[0]`                                                         | `skillEnd`，来源，0.1 秒                                                        | 与两个剑气触发 Buff 创建的同名标记共同供普通/强化战技中的 `JumpToAction` 条件读取，属于技能时间轴控制 | **静默过滤**                                                           | 需先确认 `JumpToAction` 对有效伤害调度的影响；当前应 fail-closed       |
| Arcane (`chr_0032_lizhiyan`)        | `chr_0032_lizhiyan_attack4`：`timelineActions[25]._sequenceActionData.actionData[0].action.actionData[2]`                                                          | `lizhiyan_attack4`，自身，0.1 秒                                                | 同序列只在检查后执行 `CheckBuffStackNumAdvanced` 与 `EffectAction`，未发现战斗数值消费者              | 静默过滤                                                               | 可作为特效节流显式 allowlist                                           |
| Arcane                              | `chr_0032_lizhiyan_combo_skill_abilityentity_end`：`timelineActions[7]._sequenceActionData.actionData[3]`；`timelineActions[10]._sequenceActionData.actionData[0]` | `lizhiyan_combo_end_not_finish` 0.1 秒；`lizhiyan_bunshin_end` 1 秒             | 前者门控结束阶段的 Buff 创建；后者被分身封印 Buff 的事件检查，用于结束/清理同步                       | **静默过滤**                                                           | 值得纳入能力实体与 Buff 事件模型；当前 fail-closed                     |
| Arcane                              | `chr_0032_lizhiyan_power_attack`：`timelineActions[21]._sequenceActionData.actionData[0]`                                                                          | `lizhiyan_power_attack_effect`，来源，1 秒                                      | 终结技激光末级条件只据此选择 `EffectAction`，未发现伤害/Buff 分支                                     | 静默过滤                                                               | 可作为特效节流显式 allowlist                                           |
| 武器技能                            | `sk_wpn_funnel_0015`：`passiveEventActions[0].actions[0].actionData[4]`                                                                                            | `sk_wpn_funnel_0015`，自身，黑板 `cd` 秒                                        | `Check -> 技能类型/上下文检查 -> CreateBuff -> Create`，是武器被动内置冷却                            | **静默过滤**                                                           | 后续武器被动事件必须建模；当前 fail-closed                             |

## BuffData 清单

| 干员                              | Buff 文件与路径                                                                                                                                                                                      | 标记                                                                                     | 用途判断                                                                                    | 当前处理与建议                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Xaihi (`chr_0011_seraph`)         | `buff_chr_0011_seraph_normal_skill_heal`：`abilityEventAction[0].actions[0].actionData[9]`                                                                                                           | 同名标记，自身，0.3 秒                                                                   | 检查标记后执行目标查找、治疗相关 Buff/特效，再创建标记；是事件内置冷却                      | 静默过滤；应 fail-closed，待 Buff 事件调度纳入模型             |
| Yvonne (`chr_0017_yvonne`)        | `buff_chr_0017_yvonne_passive_0`：`abilityEventAction[0].actions[0].actionData[4]`；`buff_chr_0017_yvonne_talent_1`：同路径 `[3]`                                                                    | `chr_0017_yvonne_passive_combo_skill`（黑板 `cd`）；`chr_0017_yvonne_talent_1`（0.1 秒） | 分别门控资源获取和天赋 Buff 创建                                                            | 两项均静默过滤；应 fail-closed                                 |
| Estella (`chr_0021_whiten`)       | `buff_chr_0021_whiten_potential_5_inaura`：`abilityEventAction[0].actions[0].actionData[2]`                                                                                                          | `buff_chr_0021_whiten_potential_5_cd`，来源，黑板 `cd`                                   | 潜能效果的回能内置冷却                                                                      | 静默过滤；应 fail-closed                                       |
| Fluorite (`chr_0022_bounda`)      | `buff_chr_0022_bounda_potential_5_cd`：`abilityEventAction[0].actions[0].actionData[3]`                                                                                                              | `potential`，来源，黑板 `CD`                                                             | 门控 `SetSkillCdAtOnce`，直接影响技能冷却                                                   | 静默过滤；高优先级 fail-closed                                 |
| Alesh (`chr_0024_deepfin`)        | `buff_chr_0024_deepfin_talent_1`：`abilityEventAction[0].actions[0/1].actionData[3]`；`buff_chr_0024_deepfin_talent_1_auro`：`abilityEventAction[0].actions[0].actionData[4]`                        | `talent`，来源，黑板 `CD`                                                                | 三条事件路径都在标记不存在时获得资源，再创建标记                                            | 三项均静默过滤；应 fail-closed                                 |
| Last Rite (`chr_0026_lastrite`)   | `buff_chr_0026_lastrite_normal_skill`：`abilityEventAction[0].actions[1].actionData[5]`                                                                                                              | `buff_chr_0026_lastrite_normal_skill_marker`，自身，0.1 秒                               | 与生命值、伤害类型和主控条件共同门控一个 `IfElseAction`，属于战斗事件去重                   | 静默过滤；应 fail-closed                                       |
| Pogranichnik (`chr_0029_pograni`) | `buff_chr_0029_pograni_ultimate_skill_abilityentity_inaura`：`abilityEventAction[0].actions[0/1].actionData[4]`、`abilityEventAction[1].actions[0/1].actionData[6]`                                  | `chr_0029_pograni_soldier_attacked`，来源，黑板 `interval`                               | 四条士兵攻击事件均先检查，再处理 Buff/能力实体/黑板，随后创建标记；是攻击间隔与重复触发门控 | 四项均静默过滤；高优先级 fail-closed                           |
| Zhuang Fangyi                     | `buff_chr_0030_zhuangfy_sword_triggerd` 与 `_ult`：各自 `timelineActions[1]._sequenceActionData.actionData[1]`                                                                                       | `skillEnd`，来源，0.1 秒                                                                 | 与前述能力范围标记共同驱动战技 `JumpToAction` 时间轴条件                                    | 两项均静默过滤；应与根技能时间轴控制一起研究，当前 fail-closed |
| Mifu (`chr_0031_mifu`)            | `buff_chr_0031_mifu_passive_detect`：`abilityEventAction[0].actions[0].actionData[4]`                                                                                                                | 同名标记，自身，5 秒                                                                     | 门控被动 Buff 创建，标准事件冷却                                                            | 静默过滤；应 fail-closed                                       |
| Arcane                            | `buff_chr_0032_lizhiyan_combo_skill_seal_finisher`：`timelineActions[1]._sequenceActionData.actionData[4]`                                                                                           | `lizhiyan_combo_hit`，来源，0.1 秒                                                       | 处决伤害/打断/处决动作后的命中标记，随后在能力实体结束技能中门控另一段伤害                  | 静默过滤；应 fail-closed                                       |
| Arcane                            | `buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd`：`buffEventAction[1].actions[0].actionData[0]`；`timelineActions[20]._sequenceActionData.actionData[4]`                                      | `lizhiyan_combo_wisd_has_finish` 1 秒；`lizhiyan_combo_hit` 0.1 秒                       | 前者控制后续易伤 Buff，后者控制连携收尾重复伤害                                             | 两项均静默过滤；应 fail-closed                                 |
| Arcane                            | `buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable`：`abilityEventAction[0].actions[0].actionData[1]`                                                                                              | `lizhiyan_combo_finisher`，自身，0.1 秒                                                  | **原生禁用**；同序列的对应检查也禁用                                                        | 不进入运行时；保留审计即可，不应作为 blocker                   |
| Arcane                            | `buff_chr_0032_lizhiyan_ultimate_skill_inaura`：`abilityEventAction[0].actions[1].actionData[5]`；`buff_chr_0032_lizhiyan_ultimate_skill_target_mark`：`buffEventAction[0].actions[0].actionData[2]` | `chr_0032_lizhiyan_ultimate_count`，来源，0.4 秒                                         | 两条事件都以标记限制黑板、目标查找和 Buff 创建频率                                          | 两项均静默过滤；应 fail-closed                                 |
| Camille (`chr_0033_camille`)      | `buff_chr_0033_camille_ult_delay_damage`：`buffEventAction[0].actions[0].actionData[5]`                                                                                                              | `buff_chr_0033_camille_ult_self_layer`，来源，0.1 秒                                     | 伤害后检查标记并创建 Buff，再创建标记；影响终结技延迟伤害附带效果                           | 静默过滤；应 fail-closed                                       |

## 建议的处理顺序

1. **先修完备性审计**：将根级 `CreateTimedMarker` 视为有状态战斗动作；只有“专用投影已消费”“原生禁用”或有证据的表现 allowlist 可以放行。这样可先消除静默错误，不要求立即编译全部事件。
2. **泛化命中门控**：现有 `Check -> Damage -> Create` 识别不应被无语义的 `EnemyHurtAnimAction` 打断。应基于同一 Sequence 内的有效战斗动作顺序匹配，同时保留原生短路语义。
3. **贯通 Buff/被动事件**：27 个静默项的大头在 `abilityEventAction`、`buffEventAction` 和 Buff 自身时间轴。只给根技能增加一个步骤类型无法解决事件何时触发的问题。
4. **再处理时间轴控制**：庄方宜 `skillEnd -> JumpToAction` 需要先明确原生跳转如何改变后续有效动作，不能只创建标记而忽略消费者。
5. **显式维护表现 allowlist**：`tangtang_ult`、`lizhiyan_attack4`、`lizhiyan_power_attack_effect` 可在确认没有数值消费者后按“UI/特效计时”忽略，并添加回归测试，避免未来数据变化后继续静默。

## 尚未闭环的边界

- 本文判断基于 1.4.4 本地 SkillData/BuffData 闭包；若后续版本新增通过代码硬编码读取 marker ID 的消费者，需要重新审计。
- `tangtang_ult` 的标记明确服务于 `AuraAction.buffIconDurationSource`，但 Next 尚未整体建模 Aura；本文只判断该标记本身不改变后端伤害，不等于整个 Aura 可以忽略。
- 庄方宜 `skillEnd` 的完整 `JumpToAction` 控制流、诀的能力实体结束链和 Buff 事件调度都属于后续主线问题，本文不代替对应机制研究。
