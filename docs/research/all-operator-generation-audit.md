# 全干员 Next 生成可行性普查

## 口径

本报告从 `CharacterTable` 与 `CharGrowthTable.skillGroupMap` 自动发现当前干员及技能入口。
`chr_0002_endminm`、`chr_0003_endminf` 作为废案角色过滤；管理员以 `chr_9000_endmin` 单列。
统计分为源数据/严格解析和通用 DSL 编译两层；编译成功尚不代表依赖 Buff 已完整进入运行时。

## 总览

- 干员：29 名。
- 技能入口：308 个。
- 进入严格中间层：269 个。
- 无角色专用声明即可进入通用 DSL：206 个。
- 当前整名干员完整直转：1 名。

这里的“完整直转”采用保守口径：不添加逐技能忽略项、固定单敌人折叠声明或角色专用配置。
佩丽卡等已有正式样本能够在显式声明后完整生成，不与该统计矛盾。

## 分干员结果

| 干员           | 角色 ID             | 入口 | 已解析 | 已编译 | 完整直转 |
| -------------- | ------------------- | ---: | -----: | -----: | -------- |
| Tangtang       | `chr_0027_tangtang` |   11 |      6 |      6 | 否       |
| Perlica        | `chr_0004_pelica`   |    9 |      9 |      8 | 否       |
| Chen Qianyu    | `chr_0005_chen`     |   10 |     10 |     10 | 是       |
| Wulfgard       | `chr_0006_wolfgd`   |    9 |      9 |      7 | 否       |
| Arclight       | `chr_0007_ikut`     |   10 |      9 |      7 | 否       |
| Ember          | `chr_0009_azrila`   |    9 |      9 |      8 | 否       |
| Xaihi          | `chr_0011_seraph`   |   10 |     10 |      7 | 否       |
| Avywenna       | `chr_0012_avywen`   |   10 |     10 |      7 | 否       |
| Gilberta       | `chr_0013_aglina`   |    9 |      7 |      7 | 否       |
| Snowshine      | `chr_0014_aurora`   |    8 |      8 |      5 | 否       |
| Lifeng         | `chr_0015_lifeng`   |    9 |      9 |      6 | 否       |
| Antal          | `chr_0023_antal`    |    9 |      9 |      5 | 否       |
| Laevatain      | `chr_0016_laevat`   |   15 |     14 |     11 | 否       |
| Estella        | `chr_0021_whiten`   |    9 |      9 |      7 | 否       |
| Alesh          | `chr_0024_deepfin`  |   10 |     10 |      7 | 否       |
| Arcane         | `chr_0032_lizhiyan` |   11 |      7 |      7 | 否       |
| Yvonne         | `chr_0017_yvonne`   |   16 |     16 |      7 | 否       |
| Da Pan         | `chr_0018_dapan`    |    9 |      8 |      7 | 否       |
| Rossi          | `chr_0028_wulfa`    |   11 |     10 |      8 | 否       |
| Akekuri        | `chr_0019_karin`    |    9 |      9 |      8 | 否       |
| Catcher        | `chr_0020_meurs`    |    9 |      9 |      6 | 否       |
| Fluorite       | `chr_0022_bounda`   |   10 |     10 |      9 | 否       |
| Endministrator | `chr_9000_endmin`   |   20 |      0 |      0 | 否       |
| Ardelia        | `chr_0025_ardelia`  |    9 |      7 |      4 | 否       |
| Last Rite      | `chr_0026_lastrite` |    9 |      9 |      7 | 否       |
| Pogranichnik   | `chr_0029_pograni`  |   10 |     10 |      9 | 否       |
| Zhuang Fangyi  | `chr_0030_zhuangfy` |   15 |     15 |     11 | 否       |
| Mifu           | `chr_0031_mifu`     |   11 |     11 |      8 | 否       |
| Camille        | `chr_0033_camille`  |   12 |     10 |      7 | 否       |

## 共通阻塞簇

下表按被阻塞技能入口数排序。一个技能只记录首次令严格转换停止的原因，因此数字用于排优先级，
不等于该机制在原始数据中的完整出现次数。

| 阻塞类别                    | 技能数 |
| --------------------------- | -----: |
| `source-data-missing`       |     21 |
| `buff-source-or-target`     |     18 |
| `parser-channeling`         |     13 |
| `condition-buff-stack`      |      9 |
| `root-action-coverage`      |      8 |
| `condition-other`           |      7 |
| `condition-tag`             |      6 |
| `conditional-leaf`          |      5 |
| `parser-damage-calculation` |      3 |
| `condition-distance`        |      2 |
| `condition-entity-count`    |      2 |
| `other`                     |      2 |
| `projectile-child-actions`  |      2 |
| `condition-main-operator`   |      1 |
| `parser-assignment-shape`   |      1 |
| `parser-tick-interval`      |      1 |
| `projectile-data`           |      1 |

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
已确认指向唯一敌人的 `Context/smart_target`。投射物命中子技能中的空组 `Target` 同样由
其父级命中上下文确定为唯一敌人，但根技能和命名目标组不会沿用这一归约。
能力实体计数是庄方宜闭环所需能力，却不是全量覆盖率最高的第一批工作。
管理员的 20 个入口源文件当前全部缺失；另外还有一项诀的子能力实体文件名不一致，二者应作为
数据导出问题处理，而不是在生成器中添加回退。

## 实体数量条件形状

现有原始技能文件中共有 570 次启用的实体数量检查，
按完整参数区分为 40 种形状。
该统计直接递归读取 SkillData，不受当前 parser 是否能走到相应条件的影响。
这些条件既包括命中目标是否存在，也包括能力实体、可命中目标和多目标数量；不能仅凭动作名统一折叠。

| 来源            | 上下文键           | 比较       | 可命中目标 | 排除死亡 | 写入键                     | 次数 | 技能数 | 示例                                                                                                                |
| --------------- | ------------------ | ---------- | ---------- | -------- | -------------------------- | ---: | -----: | ------------------------------------------------------------------------------------------------------------------- |
| `Target`        | `(空)`             | `GE 1`     | 否         | 否       | `(空)`                     |  155 |     75 | `chr_0027_tangtang_power_attack`<br>`chr_0027_tangtang_normal_skill`<br>`chr_0004_pelica_normal_skill`              |
| `Context`       | `tar`              | `GE 1`     | 否         | 否       | `(空)`                     |  106 |     67 | `chr_0027_tangtang_combo_skill`<br>`chr_0027_tangtang_plunging_attack_end`<br>`chr_0006_wolfgd_plunging_attack_end` |
| `Target`        | `(空)`             | `GE 1`     | 是         | 否       | `(空)`                     |   89 |     73 | `chr_0027_tangtang_attack1`<br>`chr_0027_tangtang_attack3`<br>`chr_0027_tangtang_attack4`                           |
| `Context`       | `smart_target`     | `GE 1`     | 否         | 否       | `(空)`                     |   79 |     28 | `chr_0027_tangtang_combo_skill`<br>`chr_0006_wolfgd_normal_skill`<br>`chr_0007_ikut_normal_skill`                   |
| `Target`        | `tar`              | `GE 1`     | 否         | 否       | `(空)`                     |   21 |     17 | `chr_0027_tangtang_power_attack`<br>`chr_0004_pelica_power_attack`<br>`chr_0007_ikut_attack4`                       |
| `Context`       | `targets`          | `GE 1`     | 否         | 否       | `(空)`                     |   18 |      9 | `chr_0009_azrila_combo_skill`<br>`chr_0009_azrila_normal_skill`<br>`chr_0012_avywen_normal_skill`                   |
| `Context`       | `maintar`          | `GE 1`     | 否         | 否       | `(空)`                     |   16 |      7 | `chr_0021_whiten_normal_skill`<br>`chr_0024_deepfin_normal_skill`<br>`chr_0017_yvonne_ult_attack2_1`                |
| `InstantSearch` | `(空)`             | `GE 1`     | 否         | 否       | `(空)`                     |   11 |     11 | `chr_0027_tangtang_ultimate_skill`<br>`chr_0004_pelica_combo_skill`<br>`chr_0013_aglina_combo_skill`                |
| `Target`        | `smart_target`     | `GE 1`     | 否         | 否       | `(空)`                     |   11 |      4 | `chr_0016_laevat_normal_skill_during_ult`<br>`chr_0017_yvonne_normal_skill`<br>`chr_0029_pograni_combo_skill`       |
| `Context`       | `smart_target`     | `GE 1`     | 是         | 否       | `(空)`                     |    9 |      5 | `chr_0007_ikut_normal_skill`<br>`chr_0028_wulfa_combo_2_skill`<br>`chr_0028_wulfa_normal_skill`                     |
| `Context`       | `MainTar`          | `GE 1`     | 否         | 否       | `(空)`                     |    6 |      5 | `chr_0009_azrila_normal_skill`<br>`chr_0012_avywen_ultimate_skill`<br>`chr_0014_aurora_normal_skill`                |
| `Context`       | `mainTar`          | `GE 1`     | 否         | 否       | `(空)`                     |    6 |      3 | `chr_0021_whiten_normal_skill`<br>`chr_0019_karin_normal_skill`<br>`chr_0029_pograni_normal_skill`                  |
| `Context`       | `tar1`             | `GE 1`     | 否         | 否       | `(空)`                     |    5 |      4 | `chr_0007_ikut_ultimate_skill`<br>`chr_0015_lifeng_ultimate_skill`<br>`chr_0024_deepfin_ultimate_skill`             |
| `Target`        | `smart_target`     | `GE 1`     | 是         | 否       | `(空)`                     |    3 |      1 | `chr_0033_camille_combo_skill_2`                                                                                    |
| `Context`       | `water`            | `GE 1`     | 否         | 否       | `(空)`                     |    2 |      1 | `chr_0027_tangtang_normal_skill`                                                                                    |
| `InstantSearch` | `(空)`             | `GE 1`     | 是         | 否       | `(空)`                     |    2 |      1 | `chr_0009_azrila_normal_skill`                                                                                      |
| `Context`       | `lances`           | `GE 1`     | 否         | 否       | `(空)`                     |    2 |      1 | `chr_0012_avywen_normal_skill`                                                                                      |
| `MainCharacter` | `(空)`             | `GE 1`     | 否         | 是       | `(空)`                     |    2 |      2 | `chr_0013_aglina_normal_skill`<br>`chr_0013_aglina_ultimate_skill`                                                  |
| `Context`       | `tar`              | `LT 1`     | 否         | 否       | `(空)`                     |    2 |      2 | `chr_0021_whiten_attack2`<br>`chr_0021_whiten_attack3`                                                              |
| `Context`       | `combo_tar`        | `GE 1`     | 否         | 否       | `(空)`                     |    2 |      1 | `chr_0024_deepfin_combo_skill`                                                                                      |
| `Context`       | `trigger`          | `GE 1`     | 否         | 是       | `(空)`                     |    2 |      1 | `chr_0032_lizhiyan_combo_skill`                                                                                     |
| `Target`        | `MainTar`          | `GE 1`     | 否         | 否       | `(空)`                     |    2 |      1 | `chr_0028_wulfa_normal_skill`                                                                                       |
| `Context`       | `smart_target`     | `GE 1`     | 否         | 是       | `(空)`                     |    2 |      2 | `chr_0030_zhuangfy_normal_skill`<br>`chr_0030_zhuangfy_normal_skill_ult`                                            |
| `Context`       | `normalwater_move` | `GE 1`     | 否         | 否       | `normalskillwatermove_cnt` |    1 |      1 | `chr_0027_tangtang_normal_skill`                                                                                    |
| `Context`       | `ball`             | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0011_seraph_combo_skill`                                                                                       |
| `Context`       | `ComboLances`      | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0012_avywen_normal_skill`                                                                                      |
| `Context`       | `UltiLances`       | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0012_avywen_normal_skill`                                                                                      |
| `Context`       | `Lances`           | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0012_avywen_normal_skill`                                                                                      |
| `Context`       | `tar`              | `GE 2`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0013_aglina_combo_skill`                                                                                       |
| `Context`       | `explo`            | `GE 2`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0013_aglina_normal_skill`                                                                                      |
| `Context`       | `abepos`           | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0015_lifeng_ultimate_skill`                                                                                    |
| `Context`       | `smart_target`     | `Equals 0` | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0016_laevat_combo_skill`                                                                                       |
| `MainTarget`    | `(空)`             | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0032_lizhiyan_combo_skill`                                                                                     |
| `Context`       | `trigger`          | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0032_lizhiyan_combo_skill`                                                                                     |
| `Context`       | `tar`              | `Equals 1` | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0018_dapan_normal_skill`                                                                                       |
| `Context`       | `tar2`             | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0028_wulfa_normal_skill`                                                                                       |
| `Context`       | `smart_target`     | `LT 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0022_bounda_combo_skill`                                                                                       |
| `Context`       | `other_cor_tar`    | `GE 1`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0025_ardelia_normal_skill`                                                                                     |
| `Context`       | `total_tar`        | `GE 2`     | 否         | 否       | `(空)`                     |    1 |      1 | `chr_0029_pograni_normal_skill`                                                                                     |
| `Target`        | `(空)`             | `GE 1`     | 否         | 是       | `(空)`                     |    1 |      1 | `chr_0031_mifu_normalskill_1`                                                                                       |

## 根动作覆盖面

| 动作                          | 涉及技能数 |
| ----------------------------- | ---------: |
| `DamageAction`                |        194 |
| `ObtainCostAction`            |        141 |
| `IfElseAction`                |        140 |
| `CreateBuffAction`            |        105 |
| `LaunchProjectile`            |         69 |
| `SpawnAbilityEntity`          |         22 |
| `SpellInfliction`             |          7 |
| `CheckDistanceCondition`      |          1 |
| `CheckMainCharacterCondition` |          1 |

## 使用方式

```powershell
python scripts/generate_next_operators/audit_all_operators.py
```

逐技能明细及原始错误保存在相邻 JSON 文件中。每次扩展 parser、DSL 或运行时后应重新生成，
以确认覆盖率确实提升，并避免只针对当前验收干员优化。
