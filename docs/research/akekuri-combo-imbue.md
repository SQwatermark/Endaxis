# Akekuri 连击增伤：GlobalBuff / SkillAffix 证据与 Next 投影

## 结论

`chr_0019_karin` 的第二天赋不是普通单体 Buff。终结技创建
`global_buff_combo_trigger`；其子 Buff 可由队伍任意成员下一次战技或终结技消费，随后为该次
施法建立 SkillAffix。SkillAffix 的攻击子 Buff 在伤害计算前按同一施法的层数读取
`SkillSetting[连击增伤]`，并写入 Combo 乘区。

Endaxis 保留独立的战斗级 GlobalBuff 父实例，不把它展平成普通 Buff。父实例按原生 Stack 规则
逐层分配，并给固定队伍的每名成员创建 child Buff 镜像；任意 child 消费时沿精确父指针结束同一层，
再清理该层的全部镜像。固定队伍模型只省略战中成员增删同步，不省略父实例身份和寿命。

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
  `potential_5_duration=5`。终结技动作约 5 秒结束时，天赋载体创建一个 5 秒桥接 Buff；桥接结束才
  清理组合 Buff。它把实际窗口从约 5 秒延续到约 10 秒，但不会把 GlobalBuff 的独立 10 秒寿命改成
  15 秒。

因此 N 层的总 Combo 加成是：终结技 20% / 30% / 约 40% / 50%，战技 30% / 45% /
约 60% / 75%。

## 运行时边界

- `eventTarget` 表示触发 Ability 事件的施法者；`buffOwner` 表示当前 Buff 生命周期实例的所有者。
  两者不可退化为定义来源 `caster`，否则跨队员消费会把 SkillAffix 错施加回 Akekuri。
- `beforeCalculateDamage` 在伤害修饰器求值前更新 SkillAffix 黑板。
- 同层投影响应使用显式 `samePriorityKey`。这里只允许已证明可交换的同定义层并列，未证明的同优先级
  仍由调度器失败关闭。
- `beforeCastSkill` 事件携带当前实际施法的完整 cast identity；SkillAffix 及其攻击子 Buff 继承该
  identity，并在 SkillEnd 精确清理，不能退回监听 Buff 保存的旧施法信息。
- `CreateGlobalBuffAction.autoFinishByAction` 绑定创建动作的实际生命周期。位于 Buff enable 序列时，
  该动作保持到外层 Buff disable/finish，不能用即时执行器在创建同帧结束。
- 终结技免伤 Buff 单独归入 `simulationNoEffectBuffIds`，因为它不影响对敌伤害；其余原始载体 Buff
  已进入完整定义与生命周期编译，不再依赖角色专用展平特例。

## 回归门禁

- 严格验证天赋两个黑板补丁和潜能 5 两条来源记录；形状变化立即报错。
- 标准双人场景验证其他队员战技首击为基线的 1.3 倍、全队镜像层同步消费；无潜能在终结技动作
  结束后失效，潜能 5 在约 8 秒仍有效，并在 12 秒前已受 GlobalBuff 的 10 秒寿命约束而失效。
- `SkillSetting` 版本目录保存四列原值，不能在生成器外丢失数据来源。
