# 全干员 Skill/Buff 递归机制普查

## 口径

本报告由 `CharacterTable`、`CharGrowthTable.skillGroupMap`、`skill-data-cdn` 与 `buff-data-cdn` 自动生成。
`chr_0002_endminm`、`chr_0003_endminf` 作为废案过滤，`chr_9000_endmin` 管理员单列。
根统计只看入口 SkillData；递归统计继续展开子技能、干员前缀 Buff 以及 Skill/Buff 的实际引用。
Action 同时统计配置数量和 `isEnable != false` 的启用数量；正文展示完整配置分布，JSON 同时保留启用分布。
严格解析与 Next DSL 结果复用同目录入口生成审计，不能把数据源缺失、parser 不支持和运行时未支持混为一类。

## 总览

- 干员：29 名，其中有可递归数据者 28 名。
- 入口技能：308 个；SkillData 文件 605 个；BuffData 文件 529 个。
- 进入严格中间层：269 个。
- 当前可直接编译为通用 Next DSL：106 个。

## 分干员覆盖

| 干员           | ID                  | 入口 | 有源入口 | 严格解析 | DSL | 递归技能 | 递归 Buff | 缺失引用 |
| -------------- | ------------------- | ---: | -------: | -------: | --: | -------: | --------: | -------: |
| Tangtang       | `chr_0027_tangtang` |   11 |       11 |        6 |   4 |       25 |        37 |        4 |
| Perlica        | `chr_0004_pelica`   |    9 |        9 |        9 |   4 |       16 |         9 |        5 |
| Chen Qianyu    | `chr_0005_chen`     |   10 |       10 |       10 |   6 |       10 |         7 |        4 |
| Wulfgard       | `chr_0006_wolfgd`   |    9 |        9 |        9 |   3 |       20 |        14 |       10 |
| Arclight       | `chr_0007_ikut`     |   10 |       10 |        9 |   6 |       11 |        10 |        8 |
| Ember          | `chr_0009_azrila`   |    9 |        9 |        9 |   5 |        9 |        17 |        6 |
| Xaihi          | `chr_0011_seraph`   |   10 |       10 |       10 |   2 |       16 |        31 |        6 |
| Avywenna       | `chr_0012_avywen`   |   10 |       10 |       10 |   5 |       17 |        12 |        5 |
| Gilberta       | `chr_0013_aglina`   |    9 |        9 |        7 |   4 |       16 |        19 |        4 |
| Snowshine      | `chr_0014_aurora`   |    8 |        8 |        8 |   2 |       12 |        13 |        7 |
| Lifeng         | `chr_0015_lifeng`   |    9 |        9 |        9 |   4 |       10 |        12 |        4 |
| Antal          | `chr_0023_antal`    |    9 |        9 |        9 |   1 |       15 |        14 |        6 |
| Laevatain      | `chr_0016_laevat`   |   15 |       15 |       14 |   5 |       22 |        51 |       24 |
| Estella        | `chr_0021_whiten`   |    9 |        9 |        9 |   7 |       10 |         6 |        4 |
| Alesh          | `chr_0024_deepfin`  |   10 |       10 |       10 |   4 |       10 |         4 |        8 |
| Arcane         | `chr_0032_lizhiyan` |   11 |       11 |        7 |   3 |       14 |        42 |       11 |
| Yvonne         | `chr_0017_yvonne`   |   16 |       16 |       16 |   0 |       27 |        38 |       12 |
| Da Pan         | `chr_0018_dapan`    |    9 |        9 |        8 |   3 |        9 |         6 |        6 |
| Rossi          | `chr_0028_wulfa`    |   11 |       11 |       10 |   3 |       20 |        39 |       24 |
| Akekuri        | `chr_0019_karin`    |    9 |        9 |        9 |   6 |        9 |         9 |        4 |
| Catcher        | `chr_0020_meurs`    |    9 |        9 |        9 |   3 |       10 |        10 |        7 |
| Fluorite       | `chr_0022_bounda`   |   10 |       10 |       10 |   3 |       20 |         8 |        9 |
| Endministrator | `chr_9000_endmin`   |   20 |        0 |        0 |   0 |        0 |         0 |       20 |
| Ardelia        | `chr_0025_ardelia`  |    9 |        9 |        7 |   0 |       21 |        17 |        8 |
| Last Rite      | `chr_0026_lastrite` |    9 |        9 |        9 |   3 |       10 |        13 |        6 |
| Pogranichnik   | `chr_0029_pograni`  |   10 |       10 |       10 |   5 |       13 |        15 |        4 |
| Zhuang Fangyi  | `chr_0030_zhuangfy` |   15 |       15 |       15 |   6 |       29 |        29 |       29 |
| Mifu           | `chr_0031_mifu`     |   11 |       11 |       11 |   5 |       11 |        22 |        8 |
| Camille        | `chr_0033_camille`  |   12 |       12 |       10 |   4 |       18 |        28 |        5 |

## 分层缺口

| 入口审计类别                | 技能数 | 干员覆盖 | 层级                  |
| --------------------------- | -----: | -------: | --------------------- |
| `condition-entity-count`    |     58 |       21 | Next DSL/运行时未覆盖 |
| `other`                     |     21 |       11 | Next DSL/运行时未覆盖 |
| `source-data-missing`       |     21 |        2 | 数据源缺失            |
| `buff-source-or-target`     |     15 |       11 | Next DSL/运行时未覆盖 |
| `dynamic-scalar`            |     14 |        8 | Next DSL/运行时未覆盖 |
| `parser-channeling`         |     11 |        8 | 严格 parser 不支持    |
| `condition-buff-stack`      |     10 |        4 | Next DSL/运行时未覆盖 |
| `projectile-child-actions`  |     10 |        7 | Next DSL/运行时未覆盖 |
| `root-action-coverage`      |     10 |        7 | Next DSL/运行时未覆盖 |
| `condition-target-identity` |      9 |        5 | Next DSL/运行时未覆盖 |
| `condition-other`           |      5 |        3 | Next DSL/运行时未覆盖 |
| `condition-tag`             |      5 |        4 | Next DSL/运行时未覆盖 |
| `conditional-leaf`          |      5 |        4 | Next DSL/运行时未覆盖 |
| `parser-damage-calculation` |      4 |        3 | 严格 parser 不支持    |
| `parser-tick-interval`      |      2 |        2 | 严格 parser 不支持    |
| `parser-assignment-shape`   |      1 |        1 | 严格 parser 不支持    |
| `projectile-data`           |      1 |        1 | Next DSL/运行时未覆盖 |

### 缺失引用

- 管理员：20 个入口技能均缺少 SkillData；这些入口仍指向已过滤的 `chr_0002/0003`。
- 诀：缺少的递归技能为 `chr_032_lizhiyan_combo_skill_abilityentity_seal`。
- 下表中的公共 Buff 同样属于当前 `buff-data-cdn` 不自包含，不应记为 parser 或 Next 运行时缺口。

共发现 258 处引用，聚合为 56 个缺失 ID。完整路径保存在 JSON。

| 引用类型 | 缺失 ID                                           | 出现次数 | 干员覆盖 | 来源数 |
| -------- | ------------------------------------------------- | -------: | -------: | -----: |
| buff     | `buff_common_obtain_ultimate_sp`                  |       54 |       27 |     33 |
| buff     | `buff_common_damage_immune_ult_skill`             |       29 |       28 |     29 |
| buff     | `buff_common_power_attack_disable_cast_skill`     |       28 |       28 |     28 |
| buff     | `buff_common_damage_immune_medium`                |       16 |       15 |     16 |
| buff     | `buff_common_full_immune_medium`                  |       13 |       13 |     13 |
| buff     | `buff_chr_0030_zhuangfy_have_sword`               |       12 |        1 |      3 |
| buff     | `buff_physical_no_guard`                          |       10 |        4 |      5 |
| buff     | `buff_common_pulse_pulse_conduct_triggered`       |        9 |        3 |      5 |
| buff     | `buff_common_cryst_cryst_frozen_triggered`        |        5 |        2 |      4 |
| buff     | `buff_common_damage_immune_talent`                |        5 |        2 |      2 |
| buff     | `buff_common_energy_shard_attached_cryst`         |        4 |        2 |      3 |
| buff     | `buff_common_fire_fire_burning_triggered`         |        4 |        2 |      4 |
| buff     | `buff_common_vfx_char_atk_up`                     |        4 |        4 |      4 |
| skill    | `chr_032_lizhiyan_combo_skill_abilityentity_seal` |        4 |        1 |      1 |
| buff     | `buff_common_natural_natural_corrupt_triggered`   |        3 |        2 |      3 |
| buff     | `buff_common_originum_frozen`                     |        3 |        1 |      2 |
| buff     | `buff_common_spell_infliction_cryst`              |        3 |        1 |      2 |
| buff     | `buff_common_spell_infliction_fire`               |        3 |        1 |      2 |
| buff     | `buff_common_spell_infliction_natural`            |        3 |        1 |      2 |
| buff     | `buff_common_spell_infliction_pulse`              |        3 |        1 |      2 |
| buff     | `buff_common_burning_status`                      |        2 |        1 |      2 |
| buff     | `buff_common_energy_shard_attached_fire`          |        2 |        1 |      1 |
| buff     | `buff_common_fire_triggered_fx`                   |        2 |        1 |      2 |
| buff     | `buff_common_full_immune`                         |        2 |        2 |      2 |
| buff     | `buff_common_vfx_eny_def_down`                    |        2 |        2 |      2 |
| buff     | `buff_eny_0018_lbtough_pre_catch`                 |        2 |        2 |      2 |
| buff     | `buff_indie_phantom_effect_laevat`                |        2 |        1 |      2 |
| buff     | `buff_chr_0009_azrila_talent_0`                   |        1 |        1 |      1 |
| buff     | `buff_chr_0012_avywen_talent_0_debuff`            |        1 |        1 |      1 |
| buff     | `buff_common_dash`                                |        1 |        1 |      1 |
| buff     | `buff_common_dash_immune`                         |        1 |        1 |      1 |
| buff     | `buff_common_dash_immune_teammate`                |        1 |        1 |      1 |
| buff     | `buff_common_fire_pulse_triggered`                |        1 |        1 |      1 |
| buff     | `buff_common_interrupt_henshin_no_exit_effect`    |        1 |        1 |      1 |
| buff     | `buff_train_output_succbuff_or_failbuff_by_id`    |        1 |        1 |      1 |
| skill    | `chr_0002_endminm_attack1`                        |        1 |        1 |      1 |
| skill    | `chr_0002_endminm_attack2`                        |        1 |        1 |      1 |
| skill    | `chr_0002_endminm_attack3`                        |        1 |        1 |      1 |
| skill    | `chr_0002_endminm_attack4`                        |        1 |        1 |      1 |
| skill    | `chr_0002_endminm_attack5`                        |        1 |        1 |      1 |
| skill    | `chr_0002_endminm_combo_skill`                    |        1 |        1 |      1 |
| skill    | `chr_0002_endminm_normal_skill`                   |        1 |        1 |      1 |
| skill    | `chr_0002_endminm_plunging_attack_end`            |        1 |        1 |      1 |
| skill    | `chr_0002_endminm_power_attack`                   |        1 |        1 |      1 |
| skill    | `chr_0002_endminm_ultimate_skill`                 |        1 |        1 |      1 |
| skill    | `chr_0003_endminf_attack1`                        |        1 |        1 |      1 |
| skill    | `chr_0003_endminf_attack2`                        |        1 |        1 |      1 |
| skill    | `chr_0003_endminf_attack3`                        |        1 |        1 |      1 |
| skill    | `chr_0003_endminf_attack4`                        |        1 |        1 |      1 |
| skill    | `chr_0003_endminf_attack5`                        |        1 |        1 |      1 |
| skill    | `chr_0003_endminf_combo_skill`                    |        1 |        1 |      1 |
| skill    | `chr_0003_endminf_normal_skill`                   |        1 |        1 |      1 |
| skill    | `chr_0003_endminf_plunging_attack_end`            |        1 |        1 |      1 |
| skill    | `chr_0003_endminf_power_attack2`                  |        1 |        1 |      1 |
| skill    | `chr_0003_endminf_ultimate_skill`                 |        1 |        1 |      1 |
| skill    | `chr_0028_wulfa_absorb_entity_effect`             |        1 |        1 |      1 |

## 入口技能根 Action 分布

| 类型                          | 次数 | 干员覆盖 |
| ----------------------------- | ---: | -------: |
| `EffectAction`                | 1681 |       28 |
| `IfElseAction`                | 1099 |       28 |
| `CharWeaponVisibleAction`     |  840 |       28 |
| `PlaySoundAction`             |  712 |       28 |
| `FindTargetAction`            |  701 |       28 |
| `PlayAnimationAction`         |  312 |       28 |
| `SelfRotateAction`            |  300 |       28 |
| `CustomRootMotionAction`      |  296 |       28 |
| `AllowNextSkillAction`        |  288 |       28 |
| `DamageAction`                |  283 |       28 |
| `SetSuperArmorAction`         |  275 |       28 |
| `VoiceTriggerAction`          |  268 |       28 |
| `EnemyHurtAnimAction`         |  243 |       27 |
| `ComboCacheAction`            |  237 |       28 |
| `CreateBuffAction`            |  225 |       28 |
| `CheckEntityNum`              |  214 |       28 |
| `CameraImpulseAction`         |  193 |       28 |
| `LaunchProjectile`            |  151 |       15 |
| `AddDynamicCcsAction`         |  149 |       26 |
| `SnapToTargetWithRangeAction` |   95 |       24 |

## 递归 Skill/Buff Action 分布

| 类型                          | 次数 | 干员覆盖 |
| ----------------------------- | ---: | -------: |
| `EffectAction`                | 2360 |       28 |
| `IfElseAction`                | 2252 |       28 |
| `FindTargetAction`            | 1239 |       28 |
| `CheckMainCharacterCondition` |  948 |       28 |
| `PlaySoundAction`             |  867 |       28 |
| `CharWeaponVisibleAction`     |  853 |       28 |
| `CompareFloat`                |  849 |       28 |
| `EnemyHurtAnimAction`         |  798 |       28 |
| `CreateBuffAction`            |  791 |       28 |
| `DamageAction`                |  785 |       28 |
| `CameraImpulseAction`         |  769 |       28 |
| `CheckEntityNum`              |  700 |       28 |
| `SelfRotateAction`            |  483 |       28 |
| `ModifyDynamicBlackboard`     |  476 |       26 |
| `HitStopAction`               |  367 |       27 |
| `ObtainCostAction`            |  347 |       28 |
| `CustomRootMotionAction`      |  319 |       28 |
| `PlayAnimationAction`         |  313 |       28 |
| `InterruptAction`             |  307 |       26 |
| `AllowNextSkillAction`        |  293 |       28 |
| `SetSuperArmorAction`         |  287 |       28 |
| `VoiceTriggerAction`          |  273 |       28 |
| `AddDynamicCcsAction`         |  259 |       26 |
| `ComboCacheAction`            |  243 |       28 |
| `CheckBuffStackNumAdvanced`   |  230 |       22 |
| `LaunchProjectile`            |  229 |       17 |
| `CheckDistanceCondition`      |  183 |       28 |
| `AddCameraControlStateAction` |  178 |       18 |
| `RandomAction`                |  173 |        5 |
| `SpawnAbilityEntity`          |  171 |       19 |

## 递归条件类型

| 类型                                | 次数 | 干员覆盖 |
| ----------------------------------- | ---: | -------: |
| `CheckMainCharacterCondition`       |  948 |       28 |
| `CompareFloat`                      |  849 |       28 |
| `CheckEntityNum`                    |  700 |       28 |
| `CheckBuffStackNumAdvanced`         |  230 |       22 |
| `CheckDistanceCondition`            |  183 |       28 |
| `CheckBuffStackNum`                 |   69 |        9 |
| `CheckTwoDirectionAngle`            |   57 |       26 |
| `CheckTimedMarkerCondition`         |   55 |       15 |
| `CheckTagMatch`                     |   44 |       18 |
| `CheckComboSkillCameraAlphaSetting` |   37 |       28 |
| `CheckDamageDecorateMask`           |   36 |       19 |
| `NotNextCheckAction`                |   33 |       24 |
| `CheckTargetsEqual`                 |   28 |        7 |
| `Probablity`                        |   28 |        9 |
| `CheckHp`                           |   27 |       11 |
| `CheckBuffIdInContext`              |   23 |       11 |
| `CheckBuffIdInContextAdvanced`      |   23 |       11 |
| `CheckSquadInFight`                 |   20 |       10 |
| `CheckBuffStackNumByTag`            |   18 |        4 |
| `CheckHasMoveInput`                 |   13 |        2 |
| `CheckTargetContains`               |   12 |        3 |
| `CheckEnemyRank`                    |   11 |        3 |
| `CheckSkillId`                      |   11 |        7 |
| `CheckDamageType`                   |   10 |        6 |
| `CheckSkillType`                    |   10 |        6 |
| `CheckAllowNormalSkillHighlight`    |    9 |        9 |
| `CheckSkillCameraMotionFree`        |    7 |        4 |
| `CheckSuperArmor`                   |    7 |        5 |
| `CheckObjectTypeMatch`              |    6 |        4 |
| `CheckOriginSkillType`              |    6 |        4 |

## Buff 生命周期

| 类型       | 次数 | 干员覆盖 |
| ---------- | ---: | -------: |
| `Limited`  |  325 |       28 |
| `Infinity` |  207 |       28 |

## Buff 事件

| 类型                                                  | 次数 | 干员覆盖 |
| ----------------------------------------------------- | ---: | -------: |
| `buffEventAction:DuringBuffEnable`                    |  150 |       26 |
| `buffEventAction:OnBuffStart`                         |   91 |       20 |
| `buffEventAction:OnBuffFinish`                        |   65 |       20 |
| `buffEventAction:OnBuffTrigger`                       |   49 |       17 |
| `abilityEventAction:OnAddedBuff`                      |   16 |        8 |
| `abilityEventAction:OnOutputDamage`                   |   15 |       13 |
| `abilityEventAction:OnBeforeCastSkill`                |   14 |       10 |
| `buffEventAction:OnBuffEnable`                        |   12 |        2 |
| `abilityEventAction:OnOutputBuff`                     |   10 |        7 |
| `abilityEventAction:OnOwnerHpZero`                    |    9 |        7 |
| `abilityEventAction:OnBeforeTakeDamage`               |    8 |        6 |
| `abilityEventAction:OnFinishedBuff`                   |    8 |        3 |
| `abilityEventAction:OnSkillEnd`                       |    7 |        7 |
| `buffEventAction:OnBuffEnhanceChanged`                |    6 |        6 |
| `abilityEventAction:OnOwnerDead`                      |    5 |        2 |
| `abilityEventAction:OnBuffEndsEarly`                  |    4 |        3 |
| `abilityEventAction:OnEnemyBeforeTakeSpellInfliction` |    3 |        3 |
| `abilityEventAction:OnEnterFight`                     |    3 |        3 |
| `abilityEventAction:OnTakeDamage`                     |    3 |        3 |
| `abilityEventAction:OnTrulyExitFight`                 |    3 |        3 |
| `abilityEventAction:OnAfterKillEntity`                |    2 |        2 |
| `abilityEventAction:OnBeforePartDisable`              |    2 |        1 |
| `abilityEventAction:OnCharBeforeTakeSpellInfliction`  |    2 |        2 |
| `abilityEventAction:OnConsumeBuff`                    |    2 |        2 |
| `abilityEventAction:OnCustomAbilityEvent`             |    2 |        1 |
| `abilityEventAction:OnOwnerSwitchToGuard`             |    2 |        2 |
| `abilityEventAction:OnAbilityEntityFinished`          |    1 |        1 |
| `abilityEventAction:OnAbilityEntitySpawned`           |    1 |        1 |
| `abilityEventAction:OnAfterOutputKnockDown`           |    1 |        1 |
| `abilityEventAction:OnAfterOutputWeaknessTriggered`   |    1 |        1 |

## Buff 事件内 Action

| 类型                           | 次数 | 干员覆盖 |
| ------------------------------ | ---: | -------: |
| `Selector`                     |  204 |       15 |
| `CreateBuffAction`             |  193 |       27 |
| `EffectAction`                 |  175 |       21 |
| `FinishBuffAdvanced`           |   79 |       16 |
| `FindTargetAction`             |   73 |       10 |
| `CheckBuffStackNumAdvanced`    |   65 |       11 |
| `IfElseAction`                 |   59 |       14 |
| `FAnimationCurve`              |   58 |       11 |
| `CompareFloat`                 |   56 |       17 |
| `ModifyDynamicBlackboard`      |   50 |       14 |
| `FinishBuffAction`             |   39 |       12 |
| `DefiniteValueCalculation`     |   36 |       14 |
| `ShowHideActorAction`          |   30 |       15 |
| `ObtainCostAction`             |   28 |        8 |
| `DamageAction`                 |   27 |       13 |
| `GetTargetBuffBBAdvanced`      |   26 |        4 |
| `VulnerableAction`             |   26 |       11 |
| `CheckDamageDecorateMask`      |   25 |       15 |
| `CreateTimedMarker`            |   25 |       11 |
| `CheckBuffIdInContextAdvanced` |   23 |       11 |
| `CheckTimedMarkerCondition`    |   23 |       11 |
| `FinishOwnerAction`            |   22 |        9 |
| `RaiseTrainLevelEvent`         |   22 |        6 |
| `SpawnAbilityEntity`           |   22 |        5 |
| `CheckBuffIdInContext`         |   21 |        9 |
| `PlaySoundAction`              |   18 |        8 |
| `CheckMainCharacterCondition`  |   17 |        9 |
| `NotifyCharPassiveUIAction`    |   16 |        5 |
| `CheckEntityNum`               |   15 |        4 |
| `CheckTargetsEqual`            |   15 |        6 |

## 共通机制簇

| 机制簇          | 干员覆盖 |
| --------------- | -------: |
| `buffLifecycle` |       28 |
| `conditions`    |       28 |
| `damage`        |       28 |
| `resource`      |       28 |
| `blackboard`    |       26 |
| `abilityEntity` |       19 |
| `projectile`    |       17 |

## 使用方式

```powershell
python scripts/generate_next_operators/audit_recursive_mechanisms.py
```

JSON 保留完整分布、逐干员明细和所有缺失引用；Markdown 只截取高频 Action，便于人工阅读。
相同输入必须生成逐字节一致的两个文件。
