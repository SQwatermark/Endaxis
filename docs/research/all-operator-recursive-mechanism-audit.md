# 全干员 Skill/Buff 递归机制普查

## 口径

本报告由 `CharacterTable`、`CharGrowthTable.skillGroupMap`、`skill-data-cdn` 与 `buff-data-cdn` 自动生成。
`chr_0002_endminm`、`chr_0003_endminf` 作为废案过滤，`chr_9000_endmin` 管理员单列。
根统计只看入口 SkillData；递归统计继续展开子技能、干员前缀 Buff 以及 Skill/Buff 的实际引用。
Action 同时统计配置数量和 `isEnable != false` 的启用数量；正文展示完整配置分布，JSON 同时保留启用分布。
严格解析与 Next DSL 结果复用同目录入口生成审计，不能把数据源缺失、parser 不支持和运行时未支持混为一类。

## 总览

- 干员：29 名，其中有可递归数据者 29 名。
- 入口技能：308 个；SkillData 文件 635 个；BuffData 文件 2678 个。
- 进入严格中间层：299 个。
- 当前可直接编译为通用 Next DSL：268 个。

## 分干员覆盖

| 干员           | ID                  | 入口 | 有源入口 | 严格解析 | DSL | 递归技能 | 递归 Buff | 缺失引用 |
| -------------- | ------------------- | ---: | -------: | -------: | --: | -------: | --------: | -------: |
| Tangtang       | `chr_0027_tangtang` |   11 |       11 |       10 |   9 |       25 |        41 |        0 |
| Perlica        | `chr_0004_pelica`   |    9 |        9 |        9 |   8 |       16 |        17 |        0 |
| Chen Qianyu    | `chr_0005_chen`     |   10 |       10 |       10 |   9 |       10 |        11 |        0 |
| Wulfgard       | `chr_0006_wolfgd`   |    9 |        9 |        9 |   8 |       20 |        23 |        0 |
| Arclight       | `chr_0007_ikut`     |   10 |       10 |       10 |  10 |       11 |        15 |        0 |
| Ember          | `chr_0009_azrila`   |    9 |        9 |        9 |   8 |        9 |        22 |        1 |
| Xaihi          | `chr_0011_seraph`   |   10 |       10 |       10 |   9 |       16 |        37 |        0 |
| Avywenna       | `chr_0012_avywen`   |   10 |       10 |       10 |   9 |       17 |        16 |        1 |
| Gilberta       | `chr_0013_aglina`   |    9 |        9 |        9 |   9 |       16 |        23 |        0 |
| Snowshine      | `chr_0014_aurora`   |    8 |        8 |        7 |   6 |       12 |        24 |        0 |
| Lifeng         | `chr_0015_lifeng`   |    9 |        9 |        9 |   9 |       10 |        17 |        0 |
| Antal          | `chr_0023_antal`    |    9 |        9 |        9 |   8 |       15 |        26 |        0 |
| Laevatain      | `chr_0016_laevat`   |   15 |       15 |       15 |  14 |       22 |        81 |        0 |
| Estella        | `chr_0021_whiten`   |    9 |        9 |        9 |   9 |       10 |        10 |        0 |
| Alesh          | `chr_0024_deepfin`  |   10 |       10 |       10 |   9 |       10 |        29 |        0 |
| Arcane         | `chr_0032_lizhiyan` |   11 |       11 |       10 |  10 |       15 |        52 |        0 |
| Yvonne         | `chr_0017_yvonne`   |   16 |       16 |       15 |  12 |       27 |        64 |        0 |
| Da Pan         | `chr_0018_dapan`    |    9 |        9 |        8 |   8 |        9 |        15 |        0 |
| Rossi          | `chr_0028_wulfa`    |   11 |       11 |       10 |   9 |       20 |        51 |        1 |
| Akekuri        | `chr_0019_karin`    |    9 |        9 |        9 |   9 |        9 |        13 |        0 |
| Catcher        | `chr_0020_meurs`    |    9 |        9 |        8 |   7 |       10 |        19 |        0 |
| Fluorite       | `chr_0022_bounda`   |   10 |       10 |       10 |  10 |       20 |        13 |        0 |
| Endministrator | `chr_9000_endmin`   |   20 |       20 |       20 |  20 |       20 |        14 |        0 |
| Ardelia        | `chr_0025_ardelia`  |    9 |        9 |        9 |   5 |       21 |        24 |        0 |
| Last Rite      | `chr_0026_lastrite` |    9 |        9 |        9 |   9 |       10 |        17 |        0 |
| Pogranichnik   | `chr_0029_pograni`  |   10 |       10 |       10 |   9 |       13 |        19 |        0 |
| Zhuang Fangyi  | `chr_0030_zhuangfy` |   15 |       15 |       15 |  11 |       29 |        47 |       12 |
| Mifu           | `chr_0031_mifu`     |   11 |       11 |       11 |   8 |       11 |        31 |        0 |
| Camille        | `chr_0033_camille`  |   12 |       12 |       10 |   7 |       18 |        33 |        0 |

## 分层缺口

| 入口审计类别               | 技能数 | 干员覆盖 | 层级                  |
| -------------------------- | -----: | -------: | --------------------- |
| `other`                    |     12 |       10 | Next DSL/运行时未覆盖 |
| `buff-source-or-target`    |      9 |        5 | Next DSL/运行时未覆盖 |
| `condition-other`          |      5 |        4 | Next DSL/运行时未覆盖 |
| `conditional-leaf`         |      3 |        2 | Next DSL/运行时未覆盖 |
| `root-action-coverage`     |      3 |        3 | Next DSL/运行时未覆盖 |
| `condition-distance`       |      2 |        2 | Next DSL/运行时未覆盖 |
| `condition-entity-count`   |      2 |        2 | Next DSL/运行时未覆盖 |
| `projectile-child-actions` |      2 |        2 | Next DSL/运行时未覆盖 |
| `projectile-data`          |      2 |        2 | Next DSL/运行时未覆盖 |

### 缺失引用

- 管理员：0 个入口技能均缺少 SkillData；这些入口仍指向已过滤的 `chr_0002/0003`。
- 诀：缺少的递归技能为 无。
- 下表中的公共 Buff 同样属于当前 `buff-data-cdn` 不自包含，不应记为 parser 或 Next 运行时缺口。

共发现 15 处引用，聚合为 4 个缺失 ID。完整路径保存在 JSON。

| 引用类型 | 缺失 ID                                | 出现次数 | 干员覆盖 | 来源数 |
| -------- | -------------------------------------- | -------: | -------: | -----: |
| buff     | `buff_chr_0030_zhuangfy_have_sword`    |       12 |        1 |      3 |
| buff     | `buff_chr_0009_azrila_talent_0`        |        1 |        1 |      1 |
| buff     | `buff_chr_0012_avywen_talent_0_debuff` |        1 |        1 |      1 |
| skill    | `chr_0028_wulfa_absorb_entity_effect`  |        1 |        1 |      1 |

## 入口技能根 Action 分布

| 类型                          | 次数 | 干员覆盖 |
| ----------------------------- | ---: | -------: |
| `EffectAction`                | 1750 |       29 |
| `IfElseAction`                | 1188 |       29 |
| `CharWeaponVisibleAction`     |  862 |       29 |
| `PlaySoundAction`             |  765 |       29 |
| `FindTargetAction`            |  743 |       29 |
| `PlayAnimationAction`         |  328 |       29 |
| `SelfRotateAction`            |  321 |       29 |
| `DamageAction`                |  309 |       29 |
| `CustomRootMotionAction`      |  308 |       29 |
| `AllowNextSkillAction`        |  304 |       29 |
| `SetSuperArmorAction`         |  293 |       29 |
| `VoiceTriggerAction`          |  286 |       29 |
| `EnemyHurtAnimAction`         |  263 |       28 |
| `ComboCacheAction`            |  253 |       29 |
| `CheckEntityNum`              |  244 |       29 |
| `CreateBuffAction`            |  235 |       29 |
| `CameraImpulseAction`         |  201 |       29 |
| `AddDynamicCcsAction`         |  157 |       27 |
| `LaunchProjectile`            |  151 |       15 |
| `SnapToTargetWithRangeAction` |  107 |       25 |

## 递归 Skill/Buff Action 分布

| 类型                          | 次数 | 干员覆盖 |
| ----------------------------- | ---: | -------: |
| `EffectAction`                | 2532 |       29 |
| `IfElseAction`                | 2410 |       29 |
| `FindTargetAction`            | 1305 |       29 |
| `CheckMainCharacterCondition` | 1026 |       29 |
| `PlaySoundAction`             |  989 |       29 |
| `CreateBuffAction`            |  935 |       29 |
| `CompareFloat`                |  891 |       29 |
| `CharWeaponVisibleAction`     |  875 |       29 |
| `DamageAction`                |  848 |       29 |
| `EnemyHurtAnimAction`         |  848 |       29 |
| `CameraImpulseAction`         |  841 |       29 |
| `CheckEntityNum`              |  770 |       29 |
| `ModifyDynamicBlackboard`     |  535 |       27 |
| `SelfRotateAction`            |  522 |       29 |
| `HitStopAction`               |  426 |       28 |
| `ObtainCostAction`            |  379 |       29 |
| `SetSuperArmorAction`         |  358 |       29 |
| `CustomRootMotionAction`      |  345 |       29 |
| `PlayAnimationAction`         |  330 |       29 |
| `InterruptAction`             |  311 |       27 |
| `AllowNextSkillAction`        |  309 |       29 |
| `VoiceTriggerAction`          |  291 |       29 |
| `AddDynamicCcsAction`         |  273 |       27 |
| `CheckBuffStackNumAdvanced`   |  267 |       25 |
| `ComboCacheAction`            |  259 |       29 |
| `LaunchProjectile`            |  229 |       17 |
| `CheckDistanceCondition`      |  201 |       29 |
| `AddCameraControlStateAction` |  200 |       19 |
| `RandomAction`                |  173 |        5 |
| `OverrideCameraFollowAction`  |  172 |       29 |

## 递归条件类型

| 类型                                | 次数 | 干员覆盖 |
| ----------------------------------- | ---: | -------: |
| `CheckMainCharacterCondition`       | 1026 |       29 |
| `CompareFloat`                      |  891 |       29 |
| `CheckEntityNum`                    |  770 |       29 |
| `CheckBuffStackNumAdvanced`         |  267 |       25 |
| `CheckDistanceCondition`            |  201 |       29 |
| `CheckBuffStackNum`                 |   71 |       10 |
| `CheckTimedMarkerCondition`         |   59 |       15 |
| `CheckTwoDirectionAngle`            |   59 |       27 |
| `CheckTagMatch`                     |   46 |       18 |
| `CheckDamageDecorateMask`           |   40 |       20 |
| `CheckComboSkillCameraAlphaSetting` |   39 |       29 |
| `NotNextCheckAction`                |   35 |       25 |
| `CheckDamageType`                   |   34 |       11 |
| `CheckTargetsEqual`                 |   28 |        7 |
| `Probablity`                        |   28 |        9 |
| `CheckHp`                           |   27 |       11 |
| `CheckBuffIdInContextAdvanced`      |   25 |       11 |
| `CheckBuffIdInContext`              |   24 |       12 |
| `CheckSuperArmor`                   |   21 |       11 |
| `CheckSquadInFight`                 |   20 |       10 |
| `CheckBuffStackNumByTag`            |   18 |        4 |
| `CheckEnemyRank`                    |   15 |        7 |
| `CheckHasMoveInput`                 |   13 |        2 |
| `CheckSkillId`                      |   12 |        7 |
| `CheckTargetContains`               |   12 |        3 |
| `CheckSkillType`                    |   11 |        7 |
| `CheckAllowNormalSkillHighlight`    |    9 |        9 |
| `CheckSkillCameraMotionFree`        |    7 |        4 |
| `CheckObjectTypeMatch`              |    6 |        4 |
| `CheckOriginSkillType`              |    6 |        4 |

## Buff 生命周期

| 类型       | 次数 | 干员覆盖 |
| ---------- | ---: | -------: |
| `Limited`  |  540 |       29 |
| `Infinity` |  264 |       29 |

## Buff 事件

| 类型                                                  | 次数 | 干员覆盖 |
| ----------------------------------------------------- | ---: | -------: |
| `buffEventAction:OnBuffStart`                         |  253 |       29 |
| `buffEventAction:DuringBuffEnable`                    |  240 |       29 |
| `buffEventAction:OnBuffFinish`                        |   93 |       24 |
| `buffEventAction:OnBuffTrigger`                       |   62 |       20 |
| `abilityEventAction:OnAddedBuff`                      |   17 |        9 |
| `abilityEventAction:OnBeforeCastSkill`                |   16 |       10 |
| `abilityEventAction:OnOutputDamage`                   |   15 |       13 |
| `buffEventAction:OnBuffEnable`                        |   12 |        2 |
| `abilityEventAction:OnOutputBuff`                     |   11 |        8 |
| `abilityEventAction:OnBeforeTakeDamage`               |   10 |        7 |
| `abilityEventAction:OnOwnerHpZero`                    |    9 |        7 |
| `abilityEventAction:OnFinishedBuff`                   |    8 |        3 |
| `abilityEventAction:OnSkillEnd`                       |    8 |        8 |
| `buffEventAction:OnBuffAfterTryEnhanced`              |    7 |        7 |
| `buffEventAction:OnBuffEnhanceChanged`                |    6 |        6 |
| `abilityEventAction:OnOwnerDead`                      |    5 |        2 |
| `abilityEventAction:OnBuffEndsEarly`                  |    4 |        3 |
| `abilityEventAction:OnEnemyBeforeTakeSpellInfliction` |    3 |        3 |
| `abilityEventAction:OnEnterFight`                     |    3 |        3 |
| `abilityEventAction:OnTakeDamage`                     |    3 |        3 |
| `abilityEventAction:OnTrulyExitFight`                 |    3 |        3 |
| `abilityEventAction:OnAfterKillEntity`                |    2 |        2 |
| `abilityEventAction:OnBeforeHitByProjectile`          |    2 |        2 |
| `abilityEventAction:OnBeforePartDisable`              |    2 |        1 |
| `abilityEventAction:OnCharBeforeTakeSpellInfliction`  |    2 |        2 |
| `abilityEventAction:OnConsumeBuff`                    |    2 |        2 |
| `abilityEventAction:OnCustomAbilityEvent`             |    2 |        1 |
| `abilityEventAction:OnOwnerSwitchToGuard`             |    2 |        2 |
| `abilityEventAction:OnAbilityEntityFinished`          |    1 |        1 |
| `abilityEventAction:OnAbilityEntitySpawned`           |    1 |        1 |

## Buff 事件内 Action

| 类型                          | 次数 | 干员覆盖 |
| ----------------------------- | ---: | -------: |
| `CreateBuffAction`            |  319 |       29 |
| `EffectAction`                |  266 |       25 |
| `Selector`                    |  220 |       18 |
| `ModifyDynamicBlackboard`     |  101 |       19 |
| `CheckBuffStackNumAdvanced`   |   88 |       18 |
| `FinishBuffAdvanced`          |   87 |       19 |
| `CompareFloat`                |   86 |       22 |
| `IfElseAction`                |   82 |       19 |
| `FindTargetAction`            |   79 |       12 |
| `PlaySoundAction`             |   76 |       18 |
| `DefiniteValueCalculation`    |   66 |       18 |
| `SetSuperArmorAction`         |   62 |       29 |
| `FAnimationCurve`             |   58 |       11 |
| `GetTargetBuffBBAdvanced`     |   55 |       12 |
| `DamageAction`                |   54 |       17 |
| `CameraImpulseAction`         |   46 |       13 |
| `OnSpellAbnormalStartFinish`  |   44 |        9 |
| `FinishBuffAction`            |   43 |       13 |
| `TimeDilationAction`          |   37 |       13 |
| `ObtainCostAction`            |   34 |       10 |
| `ShowHideActorAction`         |   30 |       15 |
| `CreateTimedMarker`           |   29 |       13 |
| `ReadSkillSettingData`        |   29 |       14 |
| `CheckDamageDecorateMask`     |   28 |       16 |
| `EnemyHurtAnimAction`         |   28 |       10 |
| `ObtainUspInNormalSkill`      |   28 |       28 |
| `AtkScaleCalculation`         |   27 |       10 |
| `CheckTimedMarkerCondition`   |   27 |       13 |
| `RaiseTrainLevelEvent`        |   27 |        7 |
| `CheckMainCharacterCondition` |   26 |       10 |

## 共通机制簇

| 机制簇          | 干员覆盖 |
| --------------- | -------: |
| `buffLifecycle` |       29 |
| `conditions`    |       29 |
| `damage`        |       29 |
| `resource`      |       29 |
| `blackboard`    |       27 |
| `abilityEntity` |       19 |
| `projectile`    |       17 |

## 使用方式

```powershell
python scripts/generate_next_operators/audit_recursive_mechanisms.py
```

JSON 保留完整分布、逐干员明细和所有缺失引用；Markdown 只截取高频 Action，便于人工阅读。
相同输入必须生成逐字节一致的两个文件。
