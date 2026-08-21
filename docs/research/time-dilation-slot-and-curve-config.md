# 时间膨胀槽位与公共曲线配置证据

## 结论

`TimeDilationAction.slot` 不是数组下标、显示顺序或任意用户编号，而是
`GameplayTag.tagId`。该整数是完整标签路径 UTF-8 字节的标准 CRC-32/ISO-HDLC
结果按 `Int32` 解释后的位模式。

槽位的运行时职责是划分竞争域：同一作用层、同一槽位（实体层还要求同一目标）的
实例按优先级竞争；不同槽位可以并存。标签名称描述配置用途，但不改变既有竞争算法。

当前 `GameplayTagConfig` 恢复出以下叶子槽位：

|         tagId | 完整标签路径                             |
| ------------: | ---------------------------------------- |
| `-1660475044` | `TimeDilation/Layer/Global/UltiSkill`    |
|  `-693453437` | `TimeDilation/Layer/Global/GamePlay`     |
|  `1464849466` | `TimeDilation/Layer/Entity/HitStop`      |
| `-1855252810` | `TimeDilation/Layer/Entity/Frozen`       |
| `-1451582143` | `TimeDilation/Layer/Entity/DashSucceed`  |
|   `257664179` | `TimeDilation/Layer/Entity/VisualAdjust` |
| `-1767339671` | `TimeDilation/Layer/Entity/UltTangtang`  |
|   `197328068` | `TimeDilation/Layer/Entity/Seal`         |

源 SkillData 中还存在 `tagId = 0`。原生 `GameplayTag` 已证明以 `0` 表示无效标签，
因此编辑器必须把它显示为“无效 GameplayTag（源数据值）”，不能自行命名为默认槽位。
运行时仍按原始整数比较，确保这类现存动作的竞争行为不被改写。

## 槽位联动配置

`TimeDilationConfig.slotSpecialConfig` 有四项，是两个全局槽位与两个实体槽位的
笛卡尔组合：

- 全局：`UltiSkill`、`GamePlay`；
- 实体：`Frozen`、`Seal`；
- 四项 `isInfluenceDuration` 均为 `true`。

这表示使用 `Frozen` 或 `Seal` 实体槽位的实例以全局缩放后的增量累计自身寿命。
它不表示全局槽位会自动创建或选择某个实体槽位。

## 公共命名曲线

同一配置资产的 `curveMap` 实际包含七条曲线：

1. `forge_iron_hitstop`
2. `indie_dg002_travel_guide`
3. `interactive_behit_plant`
4. `interactive_behit_mine`
5. `RESETto1`
6. `interrupt_weakness`
7. `ComboSkill`

此前只登记 `RESETto1` 和 `ComboSkill` 是数据恢复不完整，不是原生公共配置只有两项。
本次 TypeTree 导出已经恢复 `interrupt_weakness` 的全部三帧及其余五条曲线的完整关键帧。
Next 的运行时装配、下拉列表和只读曲线查看器现在共用同一份版本化定义。

## 优先级映射

原生动作中的 `timeDilationPriority` 同样是 GameplayTag，但正式 DSL 的 `priority` 是
`TimeDilationConfig.priorityMap` 转换后的比较值，不再是 tagId。十条来源标签形成七个
比较值；`HitStop`、`DashSucceed`、`GlobalSlowMotion` 共享 10，`Frozen` 与
`VisualAdjust` 共享 50，其余为 `Interrupt=15`、`BreakPoise=20`、
`GlobalSlowMotionPro=21`、`ComboSkill=30`、`UltiSkill=100`。

因此编辑器按数值分组显示来源标签，而没有把比较值伪装成可逆的 GameplayTag ID。

## 提取与校验

台式机当前 VFS manifest：

- `manifestId = 451359`；
- `timedilationconfig.asset`：当前 `assetIndex = 290156`，Bundle
  `main/2931852841209d8aa7100f81.ab`；
- `gameplaytagconfig.asset`：当前 `assetIndex = 123136`，Bundle
  `main/9038c08b2d7b3c5313c14bd8.ab`。

使用 SQwatermark AnimeStudio 当前远程默认分支的 CLI，以
`ArknightsEndfield + MonoBehaviour + Dump` 对 container 做精确 TypeTree 导出。
提取时的 SHA-256：

| 对象                       | SHA-256                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| TimeDilation Bundle slice  | `C8CD9ABF9326D20C4B6099F9ABEEC9BB7AA660875AD29ABA03C801E71D4C2688` |
| GameplayTag Bundle slice   | `843C8118517A324DFF2C501C4CF372283C5B40F526C38DD4B26774A94F9E0F82` |
| TimeDilation TypeTree dump | `95FFF45690C2B08E04B036AF2652BE6BDEE690BBAB04017A82BC1CDEE5CF9C6A` |
| GameplayTag TypeTree dump  | `3758BB1F10764CE9D1BDA9EF5200D77B3FE93EA59DBD0E09F196C18221019CF8` |

每个表中标签名称均重新计算 CRC-32，并与配置和 SkillData 中的 `tagId` 交叉匹配；
没有通过使用场景反推名称。manifest 的 assetIndex 会随版本变化，因此复现时应先按完整
逻辑路径查找，不能继续硬编码旧索引。
