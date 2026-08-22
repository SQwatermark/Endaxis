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

该语义明确会影响对敌伤害，但当前通用 `attachedPassive` 收集结果尚不能生成完整程序，门禁返回
空事实。现阶段继续保留 `unmodeledTalent`，下一步应查清 Aura 隐藏被动为何未进入收集结果，并在
公共被动/Aura 编译层修复；不得把它近似成管理员个人常驻物理增伤，也不得忽略冻结条件。

## 来源

- `PotentialTalentEffectTable.json`：四个天赋等级效果及黑板值；
- `chr_0003_endminf_talent_0.json`：隐藏被动和 Aura 根 Buff；
- `buff_chr_0003_endminf_talent_0_aura.json`：全局友方 Aura；
- `buff_chr_0003_endminf_talent_0.json`：冻结目标与物理伤害双条件增伤；
- `buff_common_originum_frozen.json`：天赋 1 标记读取与触发 Buff 创建；
- `buff_chr_0003_endminf_talent_1_tirgger.json`：攻击倍率、持续时间和图标配置。
