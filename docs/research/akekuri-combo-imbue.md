# Akekuri 连击增伤：GlobalBuff / SkillAffix 证据与 Next 投影

## 结论

`chr_0019_karin` 的第二天赋不是普通单体 Buff。终结技创建
`global_buff_combo_trigger`；其子 Buff 可由队伍任意成员下一次战技或终结技消费，随后为该次
施法建立 SkillAffix。SkillAffix 的攻击子 Buff 在伤害计算前按同一施法的层数读取
`SkillSetting[连击增伤]`，并写入 Combo 乘区。

Endaxis 的战斗队伍固定、敌人唯一且不处理战中换人，因此不复制完整 GlobalBuff 容器。每个
GlobalBuff 层被同步投影成全队每名成员各一个相同普通 Buff 层；任意成员消费时，全队同步结束一层。
这保留了影响对敌伤害的层数、期限、跨队员消费和审计身份，同时明确省略动态队伍成员同步。

## 数据证据

- VFS manifest：`manifestId=451359`。
- `global_buff_combo_trigger.asset`：Limited；动态 `duration`；Stack；最大 4 层；子 Buff 为
  `buff_common_affixes_combo_trigger`；传递 `imbue_scale`。
- `buff_common_affixes_combo_trigger.json`：`OnBeforeCastSkill` 只接受 `NormalSkill` 与
  `UltimateSkill`；创建 `buff_common_affixes_skillimbue`，随后 `FinishGlobalBuffAction(finishParent=true)`。
- `buff_common_affixes_skillimbue.json`：启用时创建
  `buff_common_affixes_skillimbue_atk`，并在 SkillEnd 结束。
- `buff_common_affixes_skillimbue_atk.json`：攻击侧 `DamageScale / ComboCalcZone`；伤害标签掩码
  `768 = 256 | 512`，对应战技与终结技；同施法层数上限 4。
- `skillsetting.asset`：`连击增伤 = [0.2, 0.15, 0.1333, 0.125]`。战技额外乘 1.5。
- 第二天赋来源补丁严格为终结技 `combo=1`、`imbue_scale=0.2`。
- 潜能 5 严格包含 `buff_chr_0019_karin_potential_5` 标记和终结技
  `potential_5_duration=5`；Next 将该 5 秒加到投影控制器的 10 秒期限。

因此 N 层的总 Combo 加成是：终结技 20% / 30% / 约 40% / 50%，战技 30% / 45% /
约 60% / 75%。

## 运行时边界

- `eventTarget` 表示触发 Ability 事件的施法者；`buffOwner` 表示当前 Buff 生命周期实例的所有者。
  两者不可退化为定义来源 `caster`，否则跨队员消费会把 SkillAffix 错施加回 Akekuri。
- `beforeCalculateDamage` 在伤害修饰器求值前更新 SkillAffix 黑板。
- 同层投影响应使用显式 `samePriorityKey`。这里只允许已证明可交换的同定义层并列，未证明的同优先级
  仍由调度器失败关闭。
- 当前模型同一干员只能有一个活动技能，SkillAffix 在 SkillEnd 同步清理；因此层数读取无需伪造原生
  SkillCastId。若未来允许同一干员并行施法，必须先把施法 ID 提前到 BeforeCast 事件。
- 原始两个技能内 Buff 由 `projectedBuffIds` 标记为“行为已在天赋投影中承接”，不是忽略、无效果或
  未建模；终结技免伤 Buff 单独归入 `simulationNoEffectBuffIds`，因为它不影响对敌伤害。

## 回归门禁

- 严格验证天赋两个黑板补丁和潜能 5 两条来源记录；形状变化立即报错。
- 标准双人场景验证其他队员战技首击为基线的 1.3 倍、全队镜像层同步消费、10 秒后失效，以及
  潜能 5 下 12 秒仍有效。
- `SkillSetting` 版本目录保存四列原值，不能在生成器外丢失数据来源。
