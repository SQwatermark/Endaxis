# 佩丽卡新版配置证据记录

本文审计 `src/next/data/operators/perlica.ts` 的数据来源。证据不进入正式干员配置，也不参与编译和模拟。

## 版本边界

- 本地解包技能数据：VFS `1.4.4`。
- 数值与成长修正表：AKEDB `1.4.4@8764515-7`。
- 本地战斗规格：`vfs-index-browser/combat-spec` 的 `PlayerDamageActionDataAdapter`、
  `PlayerDamageAction` 与伤害公式测试。
- 本地数据缓存：`vfs-index-browser/combat-spec/artifacts/SkillData` 和
  `artifacts/TableCfg-1.4.4-8764515-7`。
- 结构研究：`vfs-index-browser/docs/research/combat-pelica-skill-structure.md`。
- 旧配置对照：`vfs-index-browser/docs/research/combat-pelica-endaxis-comparison.md`。

可信度定义：

- `exact`：同版本数据中直接存在的字段、数组或动作顺序。
- `derived`：通过已说明且确定的换算得到，例如秒数乘以 30 FPS。
- `curated`：当前取值与录像或既有结果相符，但通用提取规则尚未闭环。

## 身份与面板成长

| 配置路径                                   | 可信度 | 来源与说明                           |
| ------------------------------------------ | ------ | ------------------------------------ |
| `gameId`、星级、武器、职业、元素、主副属性 | exact  | `CharGrowthTable` 及其枚举映射       |
| `attributes.*`                             | exact  | 角色成长与面板表；本轮沿用已核验数组 |

## 普通攻击

| 配置路径                         | 可信度  | 来源与说明                                                           |
| -------------------------------- | ------- | -------------------------------------------------------------------- |
| 各 health unit 的 `damageType`   | exact   | 命中 `DamageUnit.damageType = Pulse`，正式配置映射为 `electric`      |
| 各 health unit 的 `attackScale`  | exact   | 直接读取各等级 `SkillPatchTable.blackboard.atk_scale`                |
| `basicAttack1` 发射帧 `8`        | exact   | `chr_0004_pelica_attack1` 时间轴                                     |
| `basicAttack2` 发射帧 `9/12`     | exact   | `chr_0004_pelica_attack2` 时间轴                                     |
| `basicAttack3` 发射帧 `16/19/22` | exact   | `chr_0004_pelica_attack3` 时间轴                                     |
| `basicAttack4` 发射帧 `27`       | exact   | `chr_0004_pelica_attack4` 时间轴                                     |
| 第四段失衡 `15`、技力恢复 `15`   | exact   | 等级 Patch 的 `poise`、`atb` 与命中序列                              |
| `durationFrames = 16/19/27/44`   | curated | 与约 3.53 秒录像及较早可衔接边界相符；端点计数和通用选择规则尚未闭环 |

普通攻击数据只恢复出了投射物发射帧，尚未闭环飞行时间。正式配置暂时在这些帧直接执行伤害，属于明确标注的近似值；原始投射物 ID 不进入执行树，避免让未实现的投射物节点看起来已经可解析。

本地 C# 战斗规格确认游戏的一条 `DamageAction` 包含 `damageUnits[]`，并按数组顺序逐项结算。
普通生命伤害 unit 使用 `damageType`、`damageDecorateMask` 和 `atkScale`；第四段还在同一动作中
包含一条 `damageAttributeType = Poise` 的 unit。Endaxis 将二者归一化为同一个 `dealDamage` step：
生命伤害使用主字段表达，失衡值使用可选 `stagger` 字段表达，并固定在生命伤害之后结算。这样保留
一次命中的身份而不暴露原生通用容器。二、三段分别发射两枚和三枚投射物，每次命中复用同一逐 hit `atk_scale`。不再使用
`display_atk_scale / 命中数` 反推，因为三段一级的展示值 `37%` 并不等于实际值
`12% × 3`，展示字段存在独立舍入。

原生 Hp/Poise 共用同一种 `DamageUnit` 结构，因此 Poise unit 也带有 `damageType` 字段；但已恢复的
失衡公式不读取该字段。正式配置会将其归一化掉，避免引入“物理失衡”“电磁失衡”等游戏中不存在的
业务概念。

## 战技

| 配置路径                         | 可信度  | 来源与说明                                                                       |
| -------------------------------- | ------- | -------------------------------------------------------------------------------- |
| `durationFrames = 28`            | derived | `AllowNextSkillAction` 从第 28 帧开始                                            |
| `costs.sp = 100`                 | exact   | 最终 SkillPatch 的 `costValue`，不是基础 SkillData 中的旧值                      |
| 第 13 帧命中序列                 | exact   | 本地 `chr_0004_pelica_normal_skill` 时间轴                                       |
| 附着 → 伤害 → 按技力消耗全队回能 | exact   | 同一命中序列中的原始数组顺序；原始 Buff 经反编译语义还原后不再作为通用 Buff 执行 |
| 倍率与失衡 `10`                  | exact   | 等级 Patch 的 `atk_scale` 与 `poise`                                             |

战技费用在 `startCdFrame = 0` 扣除。`BattleManager.CostAtb` 同时从返还技力池扣除可抵消部分，得到
`nonReturnedAtbCost`；命中后的 `buff_common_obtain_ultimate_sp` 再按以下顺序处理队伍：

```text
baseGain = coefficient × nonReturnedAtbCost
         × (本人 ? selfGainPerAtb : otherGainPerAtb)
requestedGain = baseGain × 目标自身的 UltimateSpGainScalar
```

当前真实公共 Buff 的 `coefficient` 为 `1`，因此正式配置显式写入 `coefficient: 1`。本人/队友系数属于
全局 `SkillSetting`，终结技能量上限和回能倍率属于各成员解析后的属性，均不写入佩丽卡配置。正回能还要经过
当前恢复标签限制，最后由终结技能量 setter 检查系统解锁、钳制到上限并应用 `1e-5` 变化容差。

Next 资源账本已按上述输入建立可执行闭环并生成逐成员 receipt；全局系数、队伍顺序、上限、回能倍率、
系统解锁和当前无标签回能许可缺失时不会从旧版 Endaxis 猜默认值。

## 处决与下落攻击

| 配置路径                                       | 可信度 | 来源与说明                                                      |
| ---------------------------------------------- | ------ | --------------------------------------------------------------- |
| 处决 `durationFrames = 59`                     | exact  | `chr_0004_pelica_power_attack` 时间轴边界                       |
| 第 `35..44` 帧处决伤害                         | exact  | 同一时间段内的 `DamageAction`                                   |
| 处决使用破防攻击计算                           | exact  | 伤害数据及本地 `PlayerDamageAction` 反编译规格                  |
| 伤害后恢复团队技力，`factor = 1`               | exact  | 同一原始序列中紧随伤害的 `GainBreakingAttackAtb`                |
| 实际恢复量读取敌人 `breakingAttackedAtbObtain` | exact  | 敌人属性表；Endaxis 数据层归一化为 `enemy.finisherRecovery`     |
| 下落攻击落地后第 `3..8` 帧伤害                 | exact  | `chr_0004_pelica_fall_attack`；空中移动时间不属于技能时间轴定义 |

处决技力恢复不是佩丽卡自身的固定数值。正式配置中的 `gainFinisherSp` 只记录技能侧倍率 `1`，模拟时应读取
当前敌人的 `finisherRecovery` 并相乘。原始序列先执行伤害，再执行回技力，因此新版配置把这两步放在同一个
`ActionSequence` 中并保持相同顺序，而不是像旧模拟器那样统一挂到动作结束事件。

## 连携技

| 配置路径                             | 可信度  | 来源与说明                                                                                            |
| ------------------------------------ | ------- | ----------------------------------------------------------------------------------------------------- |
| 第 24 帧发射投射物                   | exact   | `chr_0004_pelica_combo_skill` 时间轴                                                                  |
| `durationFrames = 25`                | derived | 第 24 帧发射，第 25 帧进入后续输入区间                                                                |
| 投射物与命中技能 ID                  | exact   | `projectile_chr_0004_pelica_combo_skill` → `chr_0004_pelica_combo_skill_projhit`；仅作证据追溯        |
| 施加导电 → 伤害 → 回能               | exact   | 当前目标的 `combo_skill_projhit` 命中序列；正式配置使用元素反应语义，多敌人弹射、教程和表现动作被省略 |
| 倍率、失衡 `10`、回能 `10`、冷却数组 | exact   | 最终等级 Patch                                                                                        |
| 连携窗口 `150` 帧                    | derived | 五秒窗口乘以 30 FPS                                                                                   |
| `finalBasicAttackHit`、团队范围      | derived | 当前配置与技能描述一致，仍需从同版本 SkillDataBundle 完整复核入口                                     |

额外弹射明确排除当前目标。在 Endaxis 单敌人场景中，它不会增加当前目标伤害，因此只记录证据，不进入可执行定义。

## 终结技

| 配置路径                                      | 可信度        | 来源与说明                               |
| --------------------------------------------- | ------------- | ---------------------------------------- |
| `durationFrames = 63`                         | exact         | 本体时间轴边界                           |
| 第 58 帧伤害                                  | exact         | 本地终结技时间轴；选敌与打断超出模拟范围 |
| 倍率、失衡 `20`、能量消耗 `80`、冷却 `300` 帧 | exact/derived | 最终等级 Patch；冷却由 10 秒换算为帧     |

终结技本体在第 `55..58` 帧生成 `abilityentity_chr_0004_pelica_ultimate_skill`，并令该实体运行
`chr_0004_pelica_ultimate_skill_abilityrange`。后者只有两条特效动作、循环音效和定时结束实体的动作，
没有伤害、Buff、附着或资源操作，因此只记录在证据中，不进入面向战斗后端的正式配置。

## 天赋与潜能

| 配置路径                                       | 可信度 | 来源与说明                                  |
| ---------------------------------------------- | ------ | ------------------------------------------- |
| 失衡目标增伤 `20%/30%`                         | exact  | `buff_chr_0004_pelica_talent_0`             |
| 连携额外弹射分支                               | exact  | `combo_skill` 黑板 `talent2` 与命中条件分支 |
| 潜能 1：导电持续时间 × `1.75`                  | exact  | `PotentialTalentEffectTable`                |
| 潜能 2：终结技能量消耗 × `0.85`                | exact  | `PotentialTalentEffectTable`                |
| 潜能 3：施加导电后攻击 +`20%`，5 秒，最多 2 层 | exact  | 监听 Buff 与攻击 Buff 数据                  |
| 潜能 4：导电效果倍率 `1.33`                    | exact  | `PotentialTalentEffectTable`                |
| 潜能 5：终结技暴击率 +`30%`                    | exact  | `PotentialTalentEffectTable`                |

潜能 3 的原始载体 `buff_chr_0004_pelica_potential_3` 监听 `OnOutputBuff`，随后通过
`CheckBuffIdInContext(checkType = Tag, tagId = 1466867135)` 筛选目标 Buff，并对动作来源创建
`buff_chr_0004_pelica_potential_3_atkup`。后者以 `Atk/BaseMultiplier` 增加攻击，持续时间读取
`atk_duration`，叠层方式为 `EnhanceAndRefresh`，上限为 `2`。潜能表传入 `atk_up = 0.2`、
`atk_duration = 5`。

正式配置不暴露 `OnOutputBuff`、标签整数和原始 Buff ID，而将这条已知链路归一化为
`reactionApplied(electrification)` 事件处理器，并执行带攻击修正的 `applyStatus`。这是原始实现事件到
Endaxis 业务事件的适配；原始事件名与标签仍保留在本文，便于版本更新时复核映射。

## 尚未闭环

1. 四段普攻 `durationFrames` 的通用端点计数规则。
2. 连携窗口触发入口在同版本完整 SkillDataBundle 中的最终复核。
3. 普攻与连携投射物从发射到命中的动态时间。
4. 终结技旧配置中的 `animationTime` 没有单一可靠字段来源，因此新版定义没有写入。
