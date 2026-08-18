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

## 达坂第一天赋准备层数

`buff_chr_0018_dapan_talent_1_preparation` 的 `maxStackCnt` 使用 Buff 黑板键
`max_stack`。终结技第 80 帧创建它时，从技能动作黑板的 `talent_1_stack` 赋给该键。因此最大层数
不能在生成阶段冻结为常量。

Next Buff 实例本来就会先合并本次 `blackboardAssignments`，再解析
`maxStackCount: { blackboardKey }`。本轮补齐技能 DSL、严格校验、内联定义适配器和生成器，使该值
保持动态直到实例创建。

## 达坂第一天赋冷却与 Buff 消耗闭环

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

上述动作现与 `OnOutputDamage`、Buff 实例来源身份和事件中自结束共同进入统一运行时。达坂 9 个
技能入口已完整生成并注册；这只证明当前达坂来源图闭环，不把相同动作名的未知载荷泛化为已支持。
