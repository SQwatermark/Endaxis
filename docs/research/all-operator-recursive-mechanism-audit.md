# 全干员 Skill/Buff 递归机制普查

## 口径

本报告由 `CharacterTable`、`CharGrowthTable.skillGroupMap`、`skill-data-cdn` 与 `BuffData` 自动生成。
`chr_0002_endminm`、`chr_0003_endminf` 作为废案过滤，`chr_9000_endmin` 管理员单列。
根统计只看入口 SkillData；递归统计继续展开子技能、干员前缀 Buff 以及 Skill/Buff 的实际引用。
Action 同时统计配置数量和 `isEnable != false` 的启用数量；正文展示完整配置分布，JSON 同时保留启用分布。
严格解析与 Next DSL 结果复用同目录入口生成审计，不能把数据源缺失、parser 不支持和运行时未支持混为一类。

## 总览

- 干员：30 名，其中有可递归数据者 30 名。
- 入口技能：320 个；SkillData 文件 2459 个；BuffData 文件 2678 个。
- 进入严格中间层：312 个。
- 当前可直接编译为通用 Next DSL：280 个。

## 分干员覆盖

| 干员           | ID                  | 入口 | 有源入口 | 严格解析 | DSL | 递归技能 | 递归 Buff | 缺失引用 |
| -------------- | ------------------- | ---: | -------: | -------: | --: | -------: | --------: | -------: |
| Perlica        | `chr_0004_pelica`   |    9 |        9 |        9 |   8 |       16 |        17 |        0 |
| Ember          | `chr_0009_azrila`   |    9 |        9 |        9 |   8 |        9 |        22 |        1 |
| Chen Qianyu    | `chr_0005_chen`     |   10 |       10 |       10 |   9 |       10 |        11 |        0 |
| Akekuri        | `chr_0019_karin`    |    9 |        9 |        9 |   9 |        9 |        13 |        0 |
| Wulfgard       | `chr_0006_wolfgd`   |    9 |        9 |        9 |   8 |       20 |        23 |        0 |
| Antal          | `chr_0023_antal`    |    9 |        9 |        9 |   8 |       15 |        26 |        0 |
| Tangtang       | `chr_0027_tangtang` |   11 |       11 |       10 |   9 |       25 |        41 |        0 |
| Pogranichnik   | `chr_0029_pograni`  |   10 |       10 |       10 |   9 |       13 |        19 |        0 |
| Arclight       | `chr_0007_ikut`     |   10 |       10 |       10 |  10 |       11 |        15 |        0 |
| Gilberta       | `chr_0013_aglina`   |    9 |        9 |        9 |   9 |       16 |        23 |        0 |
| Xaihi          | `chr_0011_seraph`   |   10 |       10 |       10 |   9 |       16 |        37 |        0 |
| Alesh          | `chr_0024_deepfin`  |   10 |       10 |       10 |   9 |       10 |        29 |        0 |
| Avywenna       | `chr_0012_avywen`   |   10 |       10 |       10 |   9 |       17 |        16 |        1 |
| Camille        | `chr_0033_camille`  |   12 |       12 |       12 |   9 |       18 |        33 |        0 |
| Snowshine      | `chr_0014_aurora`   |    8 |        8 |        7 |   6 |       12 |        24 |        0 |
| Lifeng         | `chr_0015_lifeng`   |    9 |        9 |        9 |   9 |       10 |        17 |        0 |
| Liino          | `chr_0035_liino`    |   12 |       12 |        9 |   5 |       30 |        88 |        0 |
| Laevatain      | `chr_0016_laevat`   |   15 |       15 |       15 |  14 |       22 |        81 |        0 |
| Yvonne         | `chr_0017_yvonne`   |   16 |       16 |       15 |  12 |       27 |        64 |        0 |
| Fluorite       | `chr_0022_bounda`   |   10 |       10 |       10 |  10 |       20 |        13 |        0 |
| Da Pan         | `chr_0018_dapan`    |    9 |        9 |        9 |   9 |        9 |        15 |        0 |
| Catcher        | `chr_0020_meurs`    |    9 |        9 |        8 |   7 |       10 |        19 |        0 |
| Estella        | `chr_0021_whiten`   |    9 |        9 |        9 |   9 |       10 |        10 |        0 |
| Ardelia        | `chr_0025_ardelia`  |    9 |        9 |        9 |   6 |       21 |        24 |        0 |
| Last Rite      | `chr_0026_lastrite` |    9 |        9 |        9 |   9 |       10 |        17 |        0 |
| Endministrator | `chr_9000_endmin`   |   20 |       20 |       20 |  20 |       20 |        14 |        0 |
| Rossi          | `chr_0028_wulfa`    |   11 |       11 |       11 |  11 |       20 |        51 |        1 |
| Zhuang Fangyi  | `chr_0030_zhuangfy` |   15 |       15 |       15 |  11 |       29 |        47 |       12 |
| Mifu           | `chr_0031_mifu`     |   11 |       11 |       11 |   9 |       11 |        31 |        0 |
| Arcane         | `chr_0032_lizhiyan` |   11 |       11 |       10 |  10 |       15 |        52 |        0 |

## 分层缺口

| 入口审计类别               | 技能数 | 干员覆盖 | 层级                  |
| -------------------------- | -----: | -------: | --------------------- |
| `other`                    |     10 |        7 | Next DSL/运行时未覆盖 |
| `buff-source-or-target`    |      9 |        5 | Next DSL/运行时未覆盖 |
| `condition-other`          |      5 |        4 | Next DSL/运行时未覆盖 |
| `projectile-data`          |      5 |        3 | Next DSL/运行时未覆盖 |
| `conditional-leaf`         |      3 |        2 | Next DSL/运行时未覆盖 |
| `root-action-coverage`     |      3 |        3 | Next DSL/运行时未覆盖 |
| `condition-entity-count`   |      2 |        2 | Next DSL/运行时未覆盖 |
| `projectile-child-actions` |      2 |        2 | Next DSL/运行时未覆盖 |
| `condition-distance`       |      1 |        1 | Next DSL/运行时未覆盖 |

### 缺失引用

- 管理员：0 个入口技能均缺少 SkillData；这些入口仍指向已过滤的 `chr_0002/0003`。
- 诀：缺少的递归技能为 无。
- 下表中的公共 Buff 同样属于当前 `BuffData` 不自包含，不应记为 parser 或 Next 运行时缺口。

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
| `EffectAction`                | 1811 |       30 |
| `IfElseAction`                | 1245 |       30 |
| `CharWeaponVisibleAction`     |  893 |       30 |
| `PlaySoundAction`             |  793 |       30 |
| `FindTargetAction`            |  750 |       30 |
| `PlayAnimationAction`         |  346 |       30 |
| `SelfRotateAction`            |  335 |       30 |
| `AllowNextSkillAction`        |  321 |       30 |
| `CustomRootMotionAction`      |  319 |       30 |
| `DamageAction`                |  317 |       30 |
| `SetSuperArmorAction`         |  306 |       30 |
| `VoiceTriggerAction`          |  298 |       30 |
| `CreateBuffAction`            |  272 |       30 |
| `EnemyHurtAnimAction`         |  270 |       29 |
| `ComboCacheAction`            |  263 |       30 |
| `CheckEntityNum`              |  257 |       30 |
| `CameraImpulseAction`         |  204 |       30 |
| `LaunchProjectile`            |  194 |       16 |
| `AddDynamicCcsAction`         |  164 |       28 |
| `SnapToTargetWithRangeAction` |  115 |       26 |

## 递归 Skill/Buff Action 分布

| 类型                          | 次数 | 干员覆盖 |
| ----------------------------- | ---: | -------: |
| `EffectAction`                | 2664 |       30 |
| `IfElseAction`                | 2528 |       30 |
| `FindTargetAction`            | 1351 |       30 |
| `CheckMainCharacterCondition` | 1067 |       30 |
| `CreateBuffAction`            | 1055 |       30 |
| `PlaySoundAction`             | 1032 |       30 |
| `CharWeaponVisibleAction`     |  911 |       30 |
| `CompareFloat`                |  903 |       30 |
| `DamageAction`                |  878 |       30 |
| `EnemyHurtAnimAction`         |  875 |       30 |
| `CameraImpulseAction`         |  872 |       30 |
| `CheckEntityNum`              |  820 |       30 |
| `SelfRotateAction`            |  547 |       30 |
| `ModifyDynamicBlackboard`     |  546 |       28 |
| `HitStopAction`               |  444 |       29 |
| `ObtainCostAction`            |  389 |       30 |
| `LaunchProjectile`            |  382 |       18 |
| `SetSuperArmorAction`         |  371 |       30 |
| `CustomRootMotionAction`      |  356 |       30 |
| `PlayAnimationAction`         |  353 |       30 |
| `AllowNextSkillAction`        |  326 |       30 |
| `InterruptAction`             |  319 |       28 |
| `CheckBuffStackNumAdvanced`   |  308 |       26 |
| `VoiceTriggerAction`          |  304 |       30 |
| `AddDynamicCcsAction`         |  287 |       28 |
| `ComboCacheAction`            |  269 |       30 |
| `AddCameraControlStateAction` |  205 |       20 |
| `CheckDistanceCondition`      |  203 |       30 |
| `FinishBuffAdvanced`          |  189 |       21 |
| `OverrideCameraFollowAction`  |  186 |       30 |

## 递归条件类型

| 类型                                | 次数 | 干员覆盖 |
| ----------------------------------- | ---: | -------: |
| `CheckMainCharacterCondition`       | 1067 |       30 |
| `CompareFloat`                      |  903 |       30 |
| `CheckEntityNum`                    |  820 |       30 |
| `CheckBuffStackNumAdvanced`         |  308 |       26 |
| `CheckDistanceCondition`            |  203 |       30 |
| `CheckBuffStackNum`                 |   71 |       10 |
| `CheckTwoDirectionAngle`            |   64 |       28 |
| `CheckTimedMarkerCondition`         |   60 |       16 |
| `CheckTagMatch`                     |   47 |       19 |
| `CheckComboSkillCameraAlphaSetting` |   41 |       30 |
| `CheckDamageDecorateMask`           |   40 |       20 |
| `NotNextCheckAction`                |   35 |       25 |
| `CheckDamageType`                   |   34 |       11 |
| `CheckBuffIdInContextAdvanced`      |   32 |       12 |
| `CheckTargetsEqual`                 |   28 |        7 |
| `Probablity`                        |   28 |        9 |
| `CheckHp`                           |   27 |       11 |
| `CheckBuffIdInContext`              |   26 |       13 |
| `CheckSquadInFight`                 |   24 |       11 |
| `CheckSuperArmor`                   |   22 |       12 |
| `CheckBuffStackNumByTag`            |   18 |        4 |
| `CheckSkillType`                    |   16 |        8 |
| `CheckEnemyRank`                    |   15 |        7 |
| `CheckHasMoveInput`                 |   13 |        2 |
| `CheckSkillId`                      |   12 |        7 |
| `CheckTargetContains`               |   12 |        3 |
| `CheckAllowNormalSkillHighlight`    |    9 |        9 |
| `CheckObjectTypeMatch`              |    9 |        5 |
| `CheckSkillCameraMotionFree`        |    7 |        4 |
| `CheckOriginSkillType`              |    6 |        4 |

## Buff 生命周期

| 类型       | 次数 | 干员覆盖 |
| ---------- | ---: | -------: |
| `Limited`  |  599 |       30 |
| `Infinity` |  293 |       30 |

## Buff 事件

| 类型                                                  | 次数 | 干员覆盖 |
| ----------------------------------------------------- | ---: | -------: |
| `buffEventAction:DuringBuffEnable`                    |  290 |       30 |
| `buffEventAction:OnBuffStart`                         |  266 |       30 |
| `buffEventAction:OnBuffFinish`                        |  103 |       25 |
| `buffEventAction:OnBuffTrigger`                       |   69 |       21 |
| `buffEventAction:OnBuffEnable`                        |   27 |        3 |
| `abilityEventAction:OnAddedBuff`                      |   19 |       10 |
| `abilityEventAction:OnBeforeCastSkill`                |   17 |       11 |
| `abilityEventAction:OnOutputDamage`                   |   15 |       13 |
| `abilityEventAction:OnOutputBuff`                     |   12 |        9 |
| `abilityEventAction:OnSkillEnd`                       |   11 |        9 |
| `abilityEventAction:OnBeforeTakeDamage`               |   10 |        7 |
| `abilityEventAction:OnFinishedBuff`                   |    9 |        4 |
| `abilityEventAction:OnOwnerHpZero`                    |    9 |        7 |
| `buffEventAction:OnBuffAfterTryEnhanced`              |    8 |        8 |
| `buffEventAction:OnBuffEnhanceChanged`                |    6 |        6 |
| `abilityEventAction:OnOwnerDead`                      |    5 |        2 |
| `abilityEventAction:OnBuffEndsEarly`                  |    4 |        3 |
| `abilityEventAction:OnEnterFight`                     |    4 |        4 |
| `abilityEventAction:OnTrulyExitFight`                 |    4 |        4 |
| `abilityEventAction:OnCustomAbilityEvent`             |    3 |        2 |
| `abilityEventAction:OnEnemyBeforeTakeSpellInfliction` |    3 |        3 |
| `abilityEventAction:OnOwnerSwitchToGuard`             |    3 |        3 |
| `abilityEventAction:OnTakeDamage`                     |    3 |        3 |
| `abilityEventAction:OnAfterKillEntity`                |    2 |        2 |
| `abilityEventAction:OnBeforeHitByProjectile`          |    2 |        2 |
| `abilityEventAction:OnBeforePartDisable`              |    2 |        1 |
| `abilityEventAction:OnCharBeforeTakeSpellInfliction`  |    2 |        2 |
| `abilityEventAction:OnConsumeBuff`                    |    2 |        2 |
| `abilityEventAction:OnAbilityEntityFinished`          |    1 |        1 |
| `abilityEventAction:OnAbilityEntitySpawned`           |    1 |        1 |

## Buff 事件内 Action

| 类型                           | 次数 | 干员覆盖 |
| ------------------------------ | ---: | -------: |
| `CreateBuffAction`             |  356 |       30 |
| `EffectAction`                 |  321 |       26 |
| `Selector`                     |  226 |       19 |
| `ModifyDynamicBlackboard`      |  110 |       20 |
| `FinishBuffAdvanced`           |   97 |       20 |
| `CompareFloat`                 |   95 |       23 |
| `CheckBuffStackNumAdvanced`    |   92 |       19 |
| `IfElseAction`                 |   92 |       20 |
| `FindTargetAction`             |   85 |       13 |
| `PlaySoundAction`              |   82 |       19 |
| `DefiniteValueCalculation`     |   79 |       19 |
| `SetSuperArmorAction`          |   62 |       29 |
| `DamageAction`                 |   61 |       18 |
| `GetTargetBuffBBAdvanced`      |   56 |       13 |
| `CameraImpulseAction`          |   52 |       14 |
| `ShowHideActorAction`          |   49 |       16 |
| `OnSpellAbnormalStartFinish`   |   44 |        9 |
| `FinishBuffAction`             |   43 |       13 |
| `TimeDilationAction`           |   43 |       14 |
| `ObtainCostAction`             |   40 |       11 |
| `CreateTimedMarker`            |   32 |       14 |
| `ReadSkillSettingData`         |   30 |       15 |
| `AtkScaleCalculation`          |   29 |       11 |
| `EnemyHurtAnimAction`          |   29 |       11 |
| `ObtainUspInNormalSkill`       |   29 |       29 |
| `CheckBuffIdInContextAdvanced` |   28 |       12 |
| `CheckDamageDecorateMask`      |   28 |       16 |
| `CheckMainCharacterCondition`  |   28 |       11 |
| `CheckTimedMarkerCondition`    |   28 |       14 |
| `RaiseTrainLevelEvent`         |   27 |        7 |

## 共通机制簇

| 机制簇          | 干员覆盖 |
| --------------- | -------: |
| `buffLifecycle` |       30 |
| `conditions`    |       30 |
| `damage`        |       30 |
| `resource`      |       30 |
| `blackboard`    |       28 |
| `abilityEntity` |       20 |
| `projectile`    |       18 |

## 使用方式

```powershell
# 历史命令：旧 Python 审计器已退役；当前使用 TS 游戏数据编译器审计
```

JSON 保留完整分布、逐干员明细和所有缺失引用；Markdown 只截取高频 Action，便于人工阅读。
相同输入必须生成逐字节一致的两个文件。
