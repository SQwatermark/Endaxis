# 管理员冻结交互天赋审计

## 天赋 1：冻结引爆后的攻击 Buff

`chr_9000_endmin_talent_1_1/2` 分别附着
`buff_chr_0003_endminf_talent_1`，原始黑板为：

- 一级：`atk_up = 0.15`、`duration = 15`；
- 二级：`atk_up = 0.30`、`duration = 15`。

这个根 Buff 本身只是管理员身上的常驻标记。公共冻结 Buff
`buff_common_originum_frozen` 在对应引爆响应中检查引爆来源是否持有该标记，读取它的
`atk_up/duration`，再创建 `buff_chr_0003_endminf_talent_1_tirgger`。触发 Buff 使用
`Atk/BaseMultiplier`，图标为 `icon_battle_buff_atk_up`，并按原生显示位进入小队图标。

Next 不另写管理员专用触发器：公共冻结定义已经严格生成检查、黑板读取和本人/队友 Buff 应用，
天赋槽只负责通过统一 `attachedBuff` 常驻装配标记。生产场景以管理员连携施加冻结、终结技引爆，
再执行普攻；一级与二级使用同一面板和时间轴，二级后续普攻伤害严格更高。

## 天赋 2：冻结目标物理增伤

`chr_9000_endmin_talent_2_1/2` 附着隐藏被动
`chr_0003_endminf_talent_0`，黑板 `dmg` 随等级变化。被动创建
`buff_chr_0003_endminf_talent_0_aura`，以全局友方 Aura 向队伍应用
`buff_chr_0003_endminf_talent_0`；后者只在目标持有
`buff_common_originum_frozen` 且本次伤害类型为 `Physical` 时进入 `NormalCalcZone` 增伤。

最初的严格门禁把这棵被动判为不完整，原因不是共享角色 ID 或 Aura 丢失，而是 Buff 伤害修正
解析器只分别支持 `CheckBuffStackNumAdvanced` 与 `CheckDamageType`，没有接受两者按原生顺序
组成的合取。公共解析器现把该精确形状转换为：

- `buffIdCountCompare(enemy, buff_common_originum_frozen, >= 1)`；
- `eventDamageTypesMatch(['physical'])`；
- 两者放在同一个 `all` 条件中；
- `DamageScaleProcessor(Defender, NormalCalcZone, dmg)` 原样保留。

隐藏被动由统一 `attachedPassive` 装配，一级/二级 `dmg` 分别为 `0.1/0.2`。生产场景在同一连携
冻结与终结技时间轴上比较两个等级，二级对冻结目标的首个物理伤害严格高于一级。没有把效果
近似成管理员个人常驻物理增伤，也没有删除冻结或物理伤害任一条件。

## 来源

- `PotentialTalentEffectTable.json`：四个天赋等级效果及黑板值；
- `chr_0003_endminf_talent_0.json`：隐藏被动和 Aura 根 Buff；
- `buff_chr_0003_endminf_talent_0_aura.json`：全局友方 Aura；
- `buff_chr_0003_endminf_talent_0.json`：冻结目标与物理伤害双条件增伤；
- `buff_common_originum_frozen.json`：天赋 1 标记读取与触发 Buff 创建；
- `buff_chr_0003_endminf_talent_1_tirgger.json`：攻击倍率、持续时间和图标配置。
