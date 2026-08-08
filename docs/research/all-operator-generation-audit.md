# 全干员 Next 生成可行性普查

## 口径

本报告从 `CharacterTable` 与 `CharGrowthTable.skillGroupMap` 自动发现当前干员及技能入口。
`chr_0002_endminm`、`chr_0003_endminf` 作为废案角色过滤；管理员以 `chr_9000_endmin` 单列。
统计分为源数据/严格解析和通用 DSL 编译两层；编译成功尚不代表依赖 Buff 已完整进入运行时。

## 总览

- 干员：29 名。
- 技能入口：308 个。
- 进入严格中间层：269 个。
- 无角色专用声明即可进入通用 DSL：33 个。
- 当前整名干员完整直转：0 名。

这里的“完整直转”采用保守口径：不添加逐技能忽略项、固定单敌人折叠声明或角色专用配置。
佩丽卡等已有正式样本能够在显式声明后完整生成，不与该统计矛盾。

## 分干员结果

| 干员           | 角色 ID             | 入口 | 已解析 | 已编译 | 完整直转 |
| -------------- | ------------------- | ---: | -----: | -----: | -------- |
| Tangtang       | `chr_0027_tangtang` |   11 |      6 |      3 | 否       |
| Perlica        | `chr_0004_pelica`   |    9 |      9 |      2 | 否       |
| Chen Qianyu    | `chr_0005_chen`     |   10 |     10 |      2 | 否       |
| Wulfgard       | `chr_0006_wolfgd`   |    9 |      9 |      1 | 否       |
| Arclight       | `chr_0007_ikut`     |   10 |      9 |      1 | 否       |
| Ember          | `chr_0009_azrila`   |    9 |      9 |      3 | 否       |
| Xaihi          | `chr_0011_seraph`   |   10 |     10 |      1 | 否       |
| Avywenna       | `chr_0012_avywen`   |   10 |     10 |      1 | 否       |
| Gilberta       | `chr_0013_aglina`   |    9 |      7 |      1 | 否       |
| Snowshine      | `chr_0014_aurora`   |    8 |      8 |      1 | 否       |
| Lifeng         | `chr_0015_lifeng`   |    9 |      9 |      0 | 否       |
| Antal          | `chr_0023_antal`    |    9 |      9 |      1 | 否       |
| Laevatain      | `chr_0016_laevat`   |   15 |     14 |      1 | 否       |
| Estella        | `chr_0021_whiten`   |    9 |      9 |      0 | 否       |
| Alesh          | `chr_0024_deepfin`  |   10 |     10 |      0 | 否       |
| Arcane         | `chr_0032_lizhiyan` |   11 |      7 |      1 | 否       |
| Yvonne         | `chr_0017_yvonne`   |   16 |     16 |      0 | 否       |
| Da Pan         | `chr_0018_dapan`    |    9 |      8 |      1 | 否       |
| Rossi          | `chr_0028_wulfa`    |   11 |     10 |      1 | 否       |
| Akekuri        | `chr_0019_karin`    |    9 |      9 |      1 | 否       |
| Catcher        | `chr_0020_meurs`    |    9 |      9 |      1 | 否       |
| Fluorite       | `chr_0022_bounda`   |   10 |     10 |      2 | 否       |
| Endministrator | `chr_9000_endmin`   |   20 |      0 |      0 | 否       |
| Ardelia        | `chr_0025_ardelia`  |    9 |      7 |      0 | 否       |
| Last Rite      | `chr_0026_lastrite` |    9 |      9 |      1 | 否       |
| Pogranichnik   | `chr_0029_pograni`  |   10 |     10 |      0 | 否       |
| Zhuang Fangyi  | `chr_0030_zhuangfy` |   15 |     15 |      5 | 否       |
| Mifu           | `chr_0031_mifu`     |   11 |     11 |      1 | 否       |
| Camille        | `chr_0033_camille`  |   12 |     10 |      1 | 否       |

## 共通阻塞簇

下表按被阻塞技能入口数排序。一个技能只记录首次令严格转换停止的原因，因此数字用于排优先级，
不等于该机制在原始数据中的完整出现次数。

| 阻塞类别                    | 技能数 |
| --------------------------- | -----: |
| `condition-main-operator`   |     80 |
| `buff-source-or-target`     |     52 |
| `projectile-child-actions`  |     44 |
| `source-data-missing`       |     21 |
| `condition-entity-count`    |     14 |
| `parser-channeling`         |     11 |
| `condition-buff-stack`      |      9 |
| `root-action-coverage`      |      9 |
| `dynamic-scalar`            |      8 |
| `condition-target-identity` |      7 |
| `condition-tag`             |      4 |
| `parser-damage-calculation` |      4 |
| `conditional-leaf`          |      3 |
| `other`                     |      3 |
| `condition-other`           |      2 |
| `parser-tick-interval`      |      2 |
| `parser-assignment-shape`   |      1 |
| `projectile-data`           |      1 |

首轮已补齐原生 `Fire / Cryst / Natural` 伤害枚举映射，零声明编译入口由 24 个增至 33 个。
Buff 来源/目标和投射物子技能副作用是后续覆盖面更大的通用编译问题。主控身份条件虽出现最多，
但必须先确认其分支副作用，不能统一常量折叠。
能力实体计数是庄方宜闭环所需能力，却不是全量覆盖率最高的第一批工作。
管理员的 20 个入口源文件当前全部缺失；另外还有一项诀的子能力实体文件名不一致，二者应作为
数据导出问题处理，而不是在生成器中添加回退。

## 根动作覆盖面

| 动作                 | 涉及技能数 |
| -------------------- | ---------: |
| `DamageAction`       |        194 |
| `ObtainCostAction`   |        141 |
| `IfElseAction`       |        140 |
| `CreateBuffAction`   |        105 |
| `LaunchProjectile`   |         69 |
| `SpawnAbilityEntity` |         22 |
| `SpellInfliction`    |          7 |

## 使用方式

```powershell
python scripts/generate_next_operators/audit_all_operators.py
```

逐技能明细及原始错误保存在相邻 JSON 文件中。每次扩展 parser、DSL 或运行时后应重新生成，
以确认覆盖率确实提升，并避免只针对当前验收干员优化。
