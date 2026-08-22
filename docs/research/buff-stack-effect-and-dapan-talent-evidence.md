# Buff stack effect 与达坂第一天赋证据

## 证据来源

- 客户端版本：`1.4.4@9433094-12`
- `BuffData/buff_common_vfx_char_atk_up.json`
- `BuffData/buff_chr_0018_dapan_talent_1_preparation.json`
- `BuffData/buff_chr_0018_dapan_talent_1_cd_reduce.json`
- 本机 `GameAssembly.dll` SHA-256：`0C5573679BC6DEC2D068A14335466DB7CCF20AF9BAE2B983FB9D45677D80FFCE`
- IL2CPP dump：`Gameplay.Beyond.dll.cs`

## `buff_common_vfx_char_atk_up`

该定义没有属性修正、伤害修正、标签、Buff/Ability 事件或时间线动作。它唯一的非空行为是
`stackingSettings.stackEffects[].effectActions`，动作配置创建
`P_fxgp_char_buff_powerup`，即角色攻击提升特效。

生成器不再只保存 `isNeedStackEffect` 布尔值，而会保存 stack effect 的动作类别。只有同时满足以下
条件时，引用该 Buff 的动作才可从战斗模拟序列中剔除：

1. stack effect 非空且全部是 `EffectAction`；
2. 定义不含黑板、标签、属性/伤害修正、事件、时间线、Aura、能力实体、技能替换或未解析载荷；
3. 来源定义存在且生命周期可解析。

任何新的 stack effect 动作类别或玩法载荷都会使该判定失败。此规则依据结构，不依据 `vfx` 命名。

## 大潘第二天赋的终结技准备层数

`buff_chr_0018_dapan_talent_1_preparation` 的 `maxStackCnt` 使用 Buff 黑板键
`max_stack`。终结技第 80 帧创建它时，从技能动作黑板的 `talent_1_stack` 赋给该键。因此最大层数
不能在生成阶段冻结为常量。

Next Buff 实例本来就会先合并本次 `blackboardAssignments`，再解析
`maxStackCount: { blackboardKey }`。本轮补齐技能 DSL、严格校验、内联定义适配器和生成器，使该值
保持动态直到实例创建。

## 大潘第二天赋的冷却与 Buff 消耗闭环

准备 Buff 会创建 `buff_chr_0018_dapan_talent_1_cd_reduce`。后者在宿主
`OnOutputDamage` 时按顺序执行：

1. `SetSkillCdAtOnce`，目标 Owner，筛选 `ComboSkill`，`Reduce`，百分比值读取 `cd_reduce`；
2. 结束一层 `buff_chr_0018_dapan_talent_1_preparation`；
3. 结束全部 `buff_chr_0018_dapan_talent_1_cd_reduce`。

这不是表现事件。桌面原生反编译已经确认 `SetSkillCdAtOnce(isPercentage=true, Reduce)` 从当前剩余
冷却中扣除“技能配置的基础冷却周期 × 比例”，而不是按当前剩余冷却乘算。Next 因此以
`SkillCooldown.baseDurationSeconds` 为基数实现 `adjustSkillCooldown`，并按动作中的精确技能类型筛选
连携技；没有把比例解释成剩余时间倍率。

旧式 `FinishBuffAction.ExecuteInternal`（RVA `0x0411FC60`）会把匹配条件交给
`BuffContainer.FinishBuff(...)`（RVA `0x035511E0`）。当前已证明的 Id 查询按容器插入顺序处理：
`finishCount = 1` 只结束第一个匹配实例，关闭来源限制时不额外按创建者过滤。生成器只对这些已证明
形状映射到统一 `finishBuffsById`，其他目标、查询或来源限制组合继续失败关闭。

上述动作现与 `OnOutputDamage`、Buff 实例来源身份和事件中自结束共同进入统一运行时。大潘 9 个
技能入口已完整生成并注册；这只证明当前大潘来源图闭环，不把相同动作名的未知载荷泛化为已支持。

## 大潘第一天赋与 Crush 消费破防

第一天赋附着 `buff_chr_0018_dapan_talent_0`。它监听 `OnConsumeBuff`，严格要求事件中的 Buff ID
为 `buff_physical_no_guard`，读取本次消费层数 `consumedLayer >= 1`，再按该层数给事件来源本人叠加
`buff_chr_0018_dapan_talent_0_dmg_up`。一级/二级每层分别提供 10 秒 `PhysicalDamageIncrease +4%/+6%`，
最多 4 层；物理增伤图标 `icon_battle_physical_dmg_up` 与小队显示位完整保留。

大潘连携技第 23 帧的原生 Sequence 顺序为 `CrushAction(20) -> DamageAction(21)`。复刻库
`66e1409` 已先补齐 Crush 严格适配与运行时：首次命中只施加破防，已有破防时进入
`buff_physical_crushed`，并按已恢复的 `_FillAssignItems` 规则传递 `dmg_multiplier` 与
`ignore_hit_effect`。Next 随后把 Crush 纳入统一物理异常步骤，并在状态 Buff 同步消费破防后发布带
来源与层数的 `buffConsumed` 战斗事实。该事实不从普通 Buff 到期/驱散泛化，只由当前已闭环的物理
异常消费路径产生。

生产回归连续释放两次连携技：第一次建立破防，第二次先消费破防并安装天赋增伤，再结算同帧直伤；
二级天赋的该次直伤精确为无天赋基线的 `1.06` 倍。这同时锁定了跨动作类型归并时必须使用原生
timeline sequence 身份，不能让物理异常因缺少 `sequenceIndex` 被排到伤害之后。
