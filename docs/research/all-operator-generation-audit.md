# 全干员 Next 生成可行性普查

## 口径

本报告从 `CharacterTable` 与 `CharGrowthTable.skillGroupMap` 自动发现当前干员及技能入口。
`chr_0002_endminm`、`chr_0003_endminf` 作为废案角色过滤；管理员以 `chr_9000_endmin` 单列。
统计分为源数据/严格解析和通用 DSL 编译两层；编译成功尚不代表依赖 Buff 已完整进入运行时。

## 总览

- 干员：30 名。
- 技能入口：320 个。
- 进入严格中间层：320 个。
- 无角色专用声明即可进入通用 DSL：292 个。
- 当前整名干员完整直转：14 名。
- 当前技能入口调用图中已结构化的区域持续动作引用：21 个。
- 当前技能入口中已结构化的事件监听器：17 个。

这里的“完整直转”采用保守口径：不添加逐技能忽略项、固定单敌人折叠声明或角色专用配置。
佩丽卡等已有正式样本能够在显式声明后完整生成，不与该统计矛盾。

## 分干员结果

| 干员           | 角色 ID             | 入口 | 已解析 | 已编译 | 完整直转 |
| -------------- | ------------------- | ---: | -----: | -----: | -------- |
| Perlica        | `chr_0004_pelica`   |    9 |      9 |      8 | 否       |
| Ember          | `chr_0009_azrila`   |    9 |      9 |      9 | 是       |
| Chen Qianyu    | `chr_0005_chen`     |   10 |     10 |     10 | 是       |
| Akekuri        | `chr_0019_karin`    |    9 |      9 |      9 | 是       |
| Wulfgard       | `chr_0006_wolfgd`   |    9 |      9 |      8 | 否       |
| Antal          | `chr_0023_antal`    |    9 |      9 |      8 | 否       |
| Tangtang       | `chr_0027_tangtang` |   11 |     11 |      9 | 否       |
| Pogranichnik   | `chr_0029_pograni`  |   10 |     10 |      9 | 否       |
| Arclight       | `chr_0007_ikut`     |   10 |     10 |     10 | 是       |
| Gilberta       | `chr_0013_aglina`   |    9 |      9 |      9 | 是       |
| Xaihi          | `chr_0011_seraph`   |   10 |     10 |      9 | 否       |
| Alesh          | `chr_0024_deepfin`  |   10 |     10 |      9 | 否       |
| Avywenna       | `chr_0012_avywen`   |   10 |     10 |      9 | 否       |
| Camille        | `chr_0033_camille`  |   12 |     12 |     12 | 是       |
| Snowshine      | `chr_0014_aurora`   |    8 |      8 |      6 | 否       |
| Lifeng         | `chr_0015_lifeng`   |    9 |      9 |      9 | 是       |
| Liino          | `chr_0035_liino`    |   12 |     12 |      7 | 否       |
| Laevatain      | `chr_0016_laevat`   |   15 |     15 |     14 | 否       |
| Yvonne         | `chr_0017_yvonne`   |   16 |     16 |     14 | 否       |
| Fluorite       | `chr_0022_bounda`   |   10 |     10 |     10 | 是       |
| Da Pan         | `chr_0018_dapan`    |    9 |      9 |      9 | 是       |
| Catcher        | `chr_0020_meurs`    |    9 |      9 |      7 | 否       |
| Estella        | `chr_0021_whiten`   |    9 |      9 |      9 | 是       |
| Ardelia        | `chr_0025_ardelia`  |    9 |      9 |      8 | 否       |
| Last Rite      | `chr_0026_lastrite` |    9 |      9 |      9 | 是       |
| Endministrator | `chr_9000_endmin`   |   20 |     20 |     20 | 是       |
| Rossi          | `chr_0028_wulfa`    |   11 |     11 |     11 | 是       |
| Zhuang Fangyi  | `chr_0030_zhuangfy` |   15 |     15 |     11 | 否       |
| Mifu           | `chr_0031_mifu`     |   11 |     11 |      9 | 否       |
| Arcane         | `chr_0032_lizhiyan` |   11 |     11 |     11 | 是       |

## 共通阻塞簇

下表按被阻塞技能入口数排序。一个技能只记录首次令严格转换停止的原因，因此数字用于排优先级，
不等于该机制在原始数据中的完整出现次数。

| 阻塞类别                   | 技能数 |
| -------------------------- | -----: |
| `conditional-leaf`         |      6 |
| `condition-other`          |      5 |
| `projectile-data`          |      5 |
| `other`                    |      4 |
| `buff-source-or-target`    |      3 |
| `projectile-child-actions` |      2 |
| `root-action-coverage`     |      2 |
| `condition-entity-count`   |      1 |

## 技能事件监听器

监听器只统计已进入严格中间层的技能入口。事件内动作保留原生顺序，
在事件分发和条件链闭环前不会被提升为无条件时间轴步骤。

| 事件                     | 监听器数 |
| ------------------------ | -------: |
| `OnAddedBuff`            |        7 |
| `OnAfterKillEntity`      |        3 |
| `OnBeforeTakeDamage`     |        3 |
| `OnTrulyExitFight`       |        2 |
| `OnBeforeOutputAirborne` |        1 |
| `OnSkillEnd`             |        1 |

监听器动作类型：

- `CreateBuffAction`：12 次。
- `JumpToAction`：11 次。
- `FinishBuffAdvanced`：8 次。
- `CheckDamageDecorateMask`：5 次。
- `CheckBuffIdInContextAdvanced`：4 次。
- `ConvertToTargetContext`：4 次。
- `SetSkillCdAtOnce`：3 次。
- `CheckBuffIdInContext`：2 次。
- `CheckDistanceCondition`：2 次。
- `CompareFloat`：2 次。
- `CheckBuffStackNumAdvanced`：1 次。
- `ModifyDynamicBlackboard`：1 次。

## Aura 原始库存与入口可达性

- SkillData 原始 Aura 动作：117 个。
- 从当前干员技能入口静态可达：20 个。
- 当前入口调用图中的结构化引用：21 个。

可达性只沿 SkillData 中指向另一份 SkillData 的字符串引用计算。
静态不可达文件可能是旧变体或孤立数据，不计为 parser 缺口，也不能据此注入回退。
引用数统计调用图身份；若同一原始动作被多个入口引用，它不必等于唯一动作库存。

| 静态不可达源文件                                          | Aura 动作 | 直接入边来源                                                                               |
| --------------------------------------------------------- | --------: | ------------------------------------------------------------------------------------------ |
| `abilityentity_0110_rytoken_boom_abilityrange.json`       |         1 | 无                                                                                         |
| `cc_enemy_death_ground_area_skill.json`                   |         1 | 无                                                                                         |
| `chr_0011_seraph_normal_skill_abentity_onfield.json`      |         1 | 无                                                                                         |
| `chr_0016_laevat_dung_abilityentity.json`                 |         1 | `chr_0016_laevat_dung_spawn_abilityentity.json`                                            |
| `chr_0032_lizhiyan_normal_skill_abilityrange.json`        |         1 | 无                                                                                         |
| `eny_0007_mimicw_activityspecial_death.json`              |         1 | 无                                                                                         |
| `eny_0007_mimicw_skill02_abilityrange.json`               |         1 | `eny_0007_mimicw_skill02_projhit.json`                                                     |
| `eny_0023_aghornb_normal_attack03.json`                   |         2 | 无                                                                                         |
| `eny_0023_aghornb_normal_attack03_endinggame.json`        |         2 | 无                                                                                         |
| `eny_0023_aghornb_normal_attack03_hard.json`              |         6 | 无                                                                                         |
| `eny_0023_aghornb_normal_attack03_turn.json`              |         6 | 无                                                                                         |
| `eny_0045_agtrinit_skill011.json`                         |         1 | 无                                                                                         |
| `eny_0045_agtrinit_skill131abilityrange.json`             |         1 | `eny_0045_agtrinit_skill111.json`                                                          |
| `eny_0045_agtrinit_skill13abilityrange.json`              |         2 | `eny_0045_agtrinit_jumpback13.json`                                                        |
| `eny_0045_agtrinit_skill232_tree.json`                    |         1 | `eny_0045_agtrinit_skill232.json`                                                          |
| `eny_0045_agtrinit_skill33.json`                          |         1 | 无                                                                                         |
| `eny_0045_agtrinit_skill331.json`                         |         2 | 无                                                                                         |
| `eny_0045_agtrinit_skill331_race.json`                    |         3 | 无                                                                                         |
| `eny_0045_agtrinit_skill353.json`                         |         1 | 无                                                                                         |
| `eny_0046_lbshamman_skill01_abilityrange.json`            |         1 | `eny_0046_lbshamman_skill01_endrpg.json`                                                   |
| `eny_0047_firebat_skill02_abilityrange.json`              |         1 | 无                                                                                         |
| `eny_0047_firebat_skill02_abilityrange_race.json`         |         1 | `eny_0047_firebat_skill02_hard.json`<br>`eny_0047_firebat_skill02_race.json`               |
| `eny_0048_hvybow_skill05_abilityrange.json`               |         1 | `eny_0048_hvybow_skill05.json`<br>`eny_0048_hvybow_skill05_follow.json`                    |
| `eny_0048_hvybow_skill05_race_abilityrange.json`          |         1 | `eny_0048_hvybow_skill05_race.json`                                                        |
| `eny_0051_rodin_skill03.json`                             |         2 | 无                                                                                         |
| `eny_0051_rodin_skill03_2.json`                           |         2 | 无                                                                                         |
| `eny_0051_rodin_skill08_abilityrange.json`                |         1 | 无                                                                                         |
| `eny_0051_rodin_skill09_abilityrange.json`                |         1 | `eny_0051_rodin_skill13_projhit.json`                                                      |
| `eny_0051_rodin_skill13_abilityrange.json`                |         2 | `eny_0051_rodin_skill13_dung_projhit.json`                                                 |
| `eny_0055_hscrane_settlement_abilityrange.json`           |         1 | `eny_0055_hscrane_settlement.json`<br>`eny_0055_hscrane_settlement_sp.json`                |
| `eny_0055_hscrane_settlement_sp.json`                     |         1 | 无                                                                                         |
| `eny_0055_hscrane_skill2.json`                            |         1 | 无                                                                                         |
| `eny_0055_hscrane_skill2_abilityrange_fog_hard.json`      |         1 | `eny_0055_hscrane_skill2_hard.json`<br>`eny_0085_hsrogue_skill02_hard02.json`              |
| `eny_0055_hscrane_skill2_abilityrange_white_fog.json`     |         1 | `eny_0055_hscrane_settlement_abilityrange.json`<br>`eny_0055_hscrane_skill2.json`          |
| `eny_0058_agdisk_dash_around.json`                        |         1 | 无                                                                                         |
| `eny_0058_agdisk_dash_around_withline.json`               |         1 | 无                                                                                         |
| `eny_0058_agdisk_skill07_abilityrange.json`               |         1 | `eny_0058_agdisk_skill07_projhit.json`                                                     |
| `eny_0058_agdisk_skill07_hdg015_abilityrange.json`        |         1 | `eny_0058_agdisk_skill07_hdg015_projhit.json`                                              |
| `eny_0062_paletent_skill02_abilityrange.json`             |         1 | `eny_0062_paletent_skill02_projhit.json`                                                   |
| `eny_0072_slimeml_activityspecial_death.json`             |         1 | 无                                                                                         |
| `eny_0072_slimeml_activityspecial_death_effectenemy.json` |         1 | 无                                                                                         |
| `eny_0072_slimeml_bomb.json`                              |         1 | 无                                                                                         |
| `eny_0075_lbroshan_mine_boom.json`                        |         1 | `eny_0075_lbroshan_mine_gene.json`                                                         |
| `eny_0075_lbroshan_mine_boom_coin.json`                   |         1 | `eny_0075_lbroshan_mine_gene_coin.json`                                                    |
| `eny_0075_lbroshan_mine_boom_settlement.json`             |         1 | `eny_0075_lbroshan_mine_gene_settlement.json`                                              |
| `eny_0076_agfly_skill02_abilityrange.json`                |         1 | `eny_0076_agfly_skill02.json`                                                              |
| `eny_0078_nefarp1_skill05.json`                           |         1 | 无                                                                                         |
| `eny_0079_nefarp2_skill06.json`                           |         1 | 无                                                                                         |
| `eny_0081_ruanyi_skill07ex_abilityrange.json`             |         1 | `eny_0081_ruanyi_skill_07_ex.json`                                                         |
| `eny_0081_ruanyi_skill_10.json`                           |         1 | 无                                                                                         |
| `eny_0081_ruanyi_skill_10_sp.json`                        |         1 | 无                                                                                         |
| `eny_0088_wgthorns_skill01.json`                          |         1 | 无                                                                                         |
| `eny_0089_wgreflec_skill05.json`                          |         1 | 无                                                                                         |
| `eny_0090_wgabyss_abilityrange_settlement.json`           |         1 | `eny_0090_wgabyss_settlement.json`                                                         |
| `eny_0090_wgabyss_skill03_child.json`                     |         1 | `eny_0090_wgabyss_skill03.json`                                                            |
| `eny_0090_wgabyss_skill03_child_hdg010.json`              |         1 | `eny_0090_wgabyss_skill03_hdg010.json`                                                     |
| `eny_0091_wgshoal_skill01_child_Test.json`                |         1 | 无                                                                                         |
| `eny_0093_hshog_hdg_abilityentity.json`                   |         1 | 无                                                                                         |
| `eny_0113_jzogre_bananatrap_child.json`                   |         3 | `abilityentity_interact_banana_trap.json`<br>`eny_0113_jzogre_skill03_projhit_hitenv.json` |
| `eny_0113_jzogre_bananatrap_child_hdg023.json`            |         3 | `eny_0113_jzogre_skill03_projhit_hitenv_hdg023.json`                                       |
| `eny_0113_jzogre_bananatrap_forlevel_child.json`          |         3 | 无                                                                                         |
| `eny_0113_jzogre_bananatrap_forlevel_mini_child.json`     |         1 | 无                                                                                         |
| `eny_0113_jzogre_settlement.json`                         |         1 | 无                                                                                         |
| `eny_0125_fdcentur_wuqiloop.json`                         |         1 | `eny_0125_fdcentur_wuqidaoju.json`                                                         |
| `int_fac_cannon_skill_abilityrange.json`                  |         1 | `int_fac_battle_cannon_2_skill_projhit.json`                                               |
| `int_fac_fog_skill_abilityrange.json`                     |         1 | `int_fac_battle_fog_1_skill_projhit.json`                                                  |
| `int_fac_frost_skill_abilityrange.json`                   |         1 | `int_fac_battle_frost_1_skill_projhit.json`                                                |
| `int_fac_lightning_skill_abilityrange.json`               |         1 | `int_fac_battle_lightning_2_skill.json`                                                    |
| `race_eny_dot_field.json`                                 |         1 | `race_eny_dot_field_skill.json`                                                            |
| `race_eny_dot_field_short.json`                           |         1 | 无                                                                                         |
| `race_eny_slow_field.json`                                |         1 | `race_eny_slow_field_skill.json`                                                           |
| `rpg_equip_fire_dragon_abilityentity_skill.json`          |         1 | 无                                                                                         |

首轮已补齐原生 `Fire / Cryst / Natural` 伤害枚举映射，零声明编译入口由 24 个增至 33 个。
第二轮只在根技能上下文折叠 `ActionOwner/Owner`，入口进一步增至 60 个；嵌套分支仍严格拒绝。
第三轮把投射物命中子技能的条件与回能投影回根时间轴，入口增至 61 个，并将 34 个原投射物
阻塞细化为实际条件缺口。
第四轮把原生 Owner/Source 主控检查编译为运行时 `casterControlled` 条件，入口增至 106 个；
条件在动作帧查询主控身份，不能在导入 SkillData 时统一常量折叠。直接位于 SequenceAction
中的条件仍需保留序列短路边界。第五轮依据 TargetSource.Target 直接读取技能输入目标的原生语义，
将其在固定单敌人、技能必有输入目标的模型下归约，入口增至 126 个；Context 命名目标组仍需先完成
生产者数据流分析。剩余实体数量、Buff 上下文目标和复杂投射物子行为继续严格阻塞。
近期补齐的 `CheckHp` 会在动作帧读取当前生命账本，不能在生成时读取面板快照；目前只编译
可归约为施法者或唯一敌人的目标引用。原生 `TargetSource.Target` 直接读取动作输入目标并忽略
命名目标组；`Context` 则沿动作顺序查找最近且支配读取点的目标组写入，只有主目标或无额外
校验/后处理的敌方存活 HitBox 查找才归约为唯一敌人。队友、召唤实体和合并目标继续阻塞。
Buff 层数与黑板读取的 ID/Tag 查询类型和目标身份彼此独立，统一在目标解析后查询对应容器。
引导动作已按原生 float32 计时、全局扫描和逐目标冷却语义投影到统一时间轴，相关 parser
阻塞已经清零；根技能中目标身份可证明的引导动作拆成同帧一次性动作供所有解析器复用。
能力实体计数是庄方宜闭环所需能力，却不是全量覆盖率最高的第一批工作。
管理员的 20 个入口源文件当前全部缺失；另外还有一项诀的子能力实体文件名不一致，二者应作为
数据导出问题处理，而不是在生成器中添加回退。

## 实体数量条件形状

现有原始技能文件中共有 656 次启用的实体数量检查，
按完整参数区分为 41 种形状。
该统计直接递归读取 SkillData，不受当前 parser 是否能走到相应条件的影响。
这些条件既包括命中目标是否存在，也包括能力实体、可命中目标和多目标数量；不能仅凭动作名统一折叠。

| 来源            | 上下文键           | 比较       | 可命中目标 | 排除死亡 | 写入键                     | 次数 | 技能数 | 示例                                                                                                            |
| --------------- | ------------------ | ---------- | ---------- | -------- | -------------------------- | ---: | -----: | --------------------------------------------------------------------------------------------------------------- |
| `Target`        | `(空)`             | `GE 1`     | 否         | 否       | `(空)`                     |  195 |     91 | `chr_0004_pelica_normal_skill`<br>`chr_0009_azrila_power_attack`<br>`chr_0009_azrila_normal_skill`              |
| `Context`       | `tar`              | `GE 1`     | 否         | 否       | `(空)`                     |  120 |     75 | `chr_0009_azrila_plunging_attack_end`<br>`chr_0019_karin_combo_skill`<br>`chr_0019_karin_plunging_attack_end`   |
| `Target`        | `(空)`             | `GE 1`     | 是         | 否       | `(空)`                     |   97 |     77 | `chr_0004_pelica_attack2`<br>`chr_0004_pelica_attack3`<br>`chr_0009_azrila_attack1`                             |
| `Context`       | `smart_target`     | `GE 1`     | 否         | 否       | `(空)`                     |   83 |     31 | `chr_0006_wolfgd_normal_skill`<br>`chr_0023_antal_combo_skill`<br>`chr_0027_tangtang_combo_skill`               |
| `Target`        | `tar`              | `GE 1`     | 否         | 否       | `(空)`                     |   21 |     17 | `chr_0004_pelica_power_attack`<br>`chr_0027_tangtang_power_attack`<br>`chr_0007_ikut_attack4`                   |
| `Context`       | `targets`          | `GE 1`     | 否         | 否       | `(空)`                     |   20 |     11 | `chr_0009_azrila_combo_skill`<br>`chr_0009_azrila_normal_skill`<br>`chr_0012_avywen_normal_skill`               |
| `Context`       | `maintar`          | `GE 1`     | 否         | 否       | `(空)`                     |   20 |     11 | `chr_0019_karin_normal_skill`<br>`chr_0029_pograni_normal_skill`<br>`chr_0024_deepfin_normal_skill`             |
| `InstantSearch` | `(空)`             | `GE 1`     | 否         | 否       | `(空)`                     |   18 |     14 | `chr_0004_pelica_combo_skill`<br>`chr_0027_tangtang_ultimate_skill`<br>`chr_0029_pograni_ultimate_skill`        |
| `Target`        | `smart_target`     | `GE 1`     | 否         | 否       | `(空)`                     |   11 |      4 | `chr_0029_pograni_combo_skill`<br>`chr_0033_camille_combo_skill_2`<br>`chr_0016_laevat_normal_skill_during_ult` |
| `Context`       | `mainTar`          | `GE 1`     | 否         | 否       | `(空)`                     |   10 |      5 | `chr_0019_karin_normal_skill`<br>`chr_0029_pograni_normal_skill`<br>`chr_0021_whiten_normal_skill`              |
| `Context`       | `smart_target`     | `GE 1`     | 是         | 否       | `(空)`                     |    9 |      5 | `chr_0007_ikut_normal_skill`<br>`chr_0033_camille_combo_skill`<br>`chr_0028_wulfa_combo_2_skill`                |
| `Context`       | `MainTar`          | `GE 1`     | 否         | 否       | `(空)`                     |    6 |      5 | `chr_0009_azrila_normal_skill`<br>`chr_0012_avywen_ultimate_skill`<br>`chr_0014_aurora_normal_skill`            |
| `Context`       | `tar1`             | `GE 1`     | 否         | 否       | `(空)`                     |    6 |      5 | `chr_0007_ikut_ultimate_skill`<br>`chr_0024_deepfin_ultimate_skill`<br>`chr_0015_lifeng_ultimate_skill`         |
| `Target`        | `smart_target`     | `GE 1`     | 是         | 否       | `(空)`                     |    3 |      1 | `chr_0033_camille_combo_skill_2`                                                                                |
| `InstantSearch` | `(空)`             | `GE 1`     | 是         | 否       | `(空)`                     |    2 |      1 | `chr_0009_azrila_normal_skill`                                                                                  |
| `Context`       | `water`            | `GE 1`     | 否         | 否       | `(空)`                     |    2 |      1 | `chr_0027_tangtang_normal_skill`                                                                                |
| `MainCharacter` | `(空)`             | `GE 1`     | 否         | 是       | `(空)`                     |    2 |      2 | `chr_0013_aglina_normal_skill`<br>`chr_0013_aglina_ultimate_skill`                                              |
| `Context`       | `combo_tar`        | `GE 1`     | 否         | 否       | `(空)`                     |    2 |      1 | `chr_0024_deepfin_combo_skill`                                                                                  |
| `Context`       | `lances`           | `GE 1`     | 否         | 否       | `(空)`                     |    2 |      1 | `chr_0012_avywen_normal_skill`                                                                                  |
| `Context`       | `tar`              | `LT 1`     | 否         | 否       | `(空)`                     |    2 |      2 | `chr_0021_whiten_attack2`<br>`chr_0021_whiten_attack3`                                                          |
| `InstantSearch` | `(空)`             | `LE 0`     | 否         | 否       | `(空)`                     |    2 |      2 | `chr_0002_endminm_ultimate_skill`<br>`chr_0003_endminf_ultimate_skill`                                          |
| `Target`        | `MainTar`          | `GE 1`     | 否         | 否       | `(空)`                     |    2 |      1 | `chr_0028_wulfa_normal_skill`                                                                                   |
| `Context`       | `smart_target`     | `GE 1`     | 否         | 是       | `(空)`                     |    2 |      2 | `chr_0030_zhuangfy_normal_skill`<br>`chr_0030_zhuangfy_normal_skill_ult`                                        |
| `Context`       | `trigger`          | `GE 1`     | 否         | 是       | `(空)`                     |    2 |      1 | `chr_0032_lizhiyan_combo_skill`                                                                                 |
| `Context`       | `normalwater_move` | `GE 1`     | 否         | 否       | `normalskillwatermove_cnt` |    1 |      1 | `chr_0027_tangtang_normal_skill`                                                                                |
| `Context`       | `total_tar`        | `GE 2`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0029_pograni_normal_skill`                                                                                 |
| `Context`       | `tar`              | `GE 2`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0013_aglina_combo_skill`                                                                                   |
| `Context`       | `explo`            | `GE 2`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0013_aglina_normal_skill`                                                                                  |
| `Context`       | `ball`             | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0011_seraph_combo_skill`                                                                                   |
| `Context`       | `ComboLances`      | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0012_avywen_normal_skill`                                                                                  |
| `Context`       | `UltiLances`       | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0012_avywen_normal_skill`                                                                                  |
| `Context`       | `Lances`           | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0012_avywen_normal_skill`                                                                                  |
| `Context`       | `abepos`           | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0015_lifeng_ultimate_skill`                                                                                |
| `Context`       | `smart_target`     | `Equals 0` | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0016_laevat_combo_skill`                                                                                   |
| `Context`       | `smart_target`     | `LT 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0022_bounda_combo_skill`                                                                                   |
| `Context`       | `tar`              | `Equals 1` | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0018_dapan_normal_skill`                                                                                   |
| `Context`       | `other_cor_tar`    | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0025_ardelia_normal_skill`                                                                                 |
| `Context`       | `tar2`             | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0028_wulfa_normal_skill`                                                                                   |
| `Target`        | `(空)`             | `GE 1`     | 否         | 是       | `(空)`                     |    1 |      1 | `chr_0031_mifu_normalskill_1`                                                                                   |
| `MainTarget`    | `(空)`             | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0032_lizhiyan_combo_skill`                                                                                 |
| `Context`       | `trigger`          | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0032_lizhiyan_combo_skill`                                                                                 |

## 根动作覆盖面

| 动作                            | 涉及技能数 |
| ------------------------------- | ---------: |
| `DamageAction`                  |        236 |
| `IfElseAction`                  |        187 |
| `ObtainCostAction`              |        167 |
| `CreateBuffAction`              |        137 |
| `LaunchProjectile`              |         79 |
| `SpawnAbilityEntity`            |         29 |
| `FinishBuffAction`              |         23 |
| `SpellInfliction`               |         12 |
| `CreateTimedMarker`             |          7 |
| `HealAction`                    |          6 |
| `SwitchAction`                  |          5 |
| `AuraAction`                    |          4 |
| `SetSkillCdAtOnce`              |          4 |
| `SetAbilityEntityDuration`      |          3 |
| `CheckAbilityEntityCurDuration` |          2 |
| `CheckDistanceCondition`        |          2 |
| `FractureAction`                |          2 |
| `IgniteAction`                  |          2 |
| `StoreCurSkillExecuteFrame`     |          2 |
| `AddGlobalCDTimer`              |          1 |
| `CheckMainCharacterCondition`   |          1 |

## 使用方式

```powershell
python scripts/generate_next_operators/audit_all_operators.py
```

逐技能明细及原始错误保存在相邻 JSON 文件中。每次扩展 parser、DSL 或运行时后应重新生成，
以确认覆盖率确实提升，并避免只针对当前验收干员优化。
