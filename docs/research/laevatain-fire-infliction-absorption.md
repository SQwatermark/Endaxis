# 莱万汀火焰附着吸收与减火抗天赋

## 结论

莱万汀天赋 1 是一条可由玩家正常攻击触发、并直接改变对敌火焰伤害的完整链路：主控干员的
重击或普攻末段命中后，队伍监听 Buff 查找唯一敌人身上的火焰附着，按实际层数结束附着 Buff，
并为当前干员累积 `buff_chr_0016_laevat_energy`。能量达到 4 层时创建可见满层 Buff，继而施加
20 秒减火抗效果。天赋 1/2/3 级分别向防御方 `FireResistance/BaseAddition` 写入
`-10/-15/-20`。

这不是泛用“火伤增加”近似。Endaxis 让敌人六种项目抗性进入同一套原生八槽属性容器，
`InstantModifyAttribute` 在 `BeforeCalculation` 注册临时修正并冻结本次伤害快照，随后仍按标准
抗性公式结算。

## 数据证据

- 基线：AKEDB `1.4.4@9433094-12` 与配对的 2026-08-15 公共 JSON。
- 根 Buff：`buff_chr_0016_laevat_passive`。
- 队伍监听：`buff_chr_0016_laevat_passive_teammate`，响应 `OnOutputDamage`，伤害标签掩码对应
  `powerAttack | normalAttackLastCombo`，并要求来源为当前主控。
- 火焰附着标签：`-1558844517`。结束动作按当前可吸收层数执行限层消费，结束原因为 `absorbed`。
- 能量 Buff：`buff_chr_0016_laevat_energy`，`Enhance`，最大 4 层；
  `OnBuffEnhanceChanged` 中的简单 `SaveBuffStackNum` 读取该 Buff 的增强层数到 `count`。
- 满层表现 Buff：`buff_chr_0016_laevat_energy_icon_5`；其启动动作施加
  `buff_chr_0016_laevat_ignore_fire_resist`。
- 减抗 Buff 的图标为 `icon_battle_laevat_potential_1`，`showInSquadIcon=true`、
  `iconStyleInSquad=LifeTime`。图标与显示位保留在正式 Buff 定义中，没有因其表现属性不参与公式而丢弃。
- 吸收投射物 `projectile_chr_0016_laevat_absorb` 的命中技能
  `chr_0016_laevat_absorb_projhit` 只含 EffectAction；在零距离模型中可严格省略其空间与表现子图，
  不能把同一规则扩大到含战斗动作的投射物。

## 复刻库先行结果

`combat-spec` 提交 `45508cd` 增加了简单 `SaveBuffStackNum` 的严格数据适配，并把
`OnBuffEnhanceChanged` 接到既有增强层变化运行时。简单载荷仅接受 `checkTarget`、单个直接
`buffId` 与输出 `key`，复用已由机器码闭环的 Advanced ID 计数路径；完整真实能量 Buff 已通过
`validate-buffs`。

随后提交 `a7af6d1` 固定即时属性的伤害包快照：每阶段仍按原生边界重采样并清理临时修正器，
但最终公式保留 BeforeCalculation 对被 Instant 修改一侧冻结的副本。复刻库回归确认防御方临时
减火抗只影响本次火焰命中，命中后实体实时火抗恢复。

当前台式机没有 1.4.4 完整运行时镜像，因此尚未为简单类的 `ExecuteInternal` 单独记录 RVA。
字段结构、唯一生产样本与后续 Switch 消费来自解包数据；首目标、增强层汇总和动态黑板覆盖来自
已确认的 Advanced ID 分支及 `AbilitySystem.GetBuffCountById`。这里不宣称两个 IL2CPP 类共享函数体。

## Endaxis 投影与运行时边界

- 距离、Aura 范围和目标列表按项目既定极简模型归约：敌人唯一且所有范围查找命中现有实例。
  目标身份、主控条件、伤害标签和附着标签仍完整保留。
- 纯 `ForEach + FindTargetAction` 只在本事件、唯一敌人且无额外筛选的已证明形状中保留有序动作树；
  其他目标集合仍失败关闭。
- `finishBuffsByTag.count` 是动态操作数。对 `Enhance` 系列 Buff 扣除增强层，对普通叠加实例按
  插入顺序结束，不能把“一层”错误实现为结束整个增强 Buff。
- 敌人项目抗性不再只存在于静态伤害 DTO；六种抗性同时安装进敌方 Buff 属性容器，伤害快照从
  该容器读取当前值。没有证据的上下限不在 Endaxis 额外猜造。
- `BeforeCalculation` 冻结的瞬时属性快照必须持续到最终公式。`AfterCalculation` 只处理最终值与
  倍率区，不能在瞬时修正清除后重新捕获并覆盖此前快照。

## 验证

默认仓库生产回归使用 50 火抗木桩，构造四次“施加 1 层火焰附着 + 普攻末段伤害”，再在第 125
帧执行同构火焰探测命中。四层附着均以 `absorbed` 结束；天赋 1 级和 3 级分别把本次防御火抗
冻结为 40 与 30，三级探测伤害严格高于一级。

莱万汀天赋 2 是自身生存相关效果，在当前无敌人主动行为、优先完成对敌伤害链的边界下继续显式
未建模。因而干员级 `conversionSupport` 仍为 `partial`，不能因天赋 1 闭环而宣称整名干员完整。
