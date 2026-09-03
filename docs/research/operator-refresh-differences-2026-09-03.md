# 新旧干员来源差异：2026-09-03 交付检查点

## 对比口径

这里比较旧 1.4.4 来源基线与当前融合输入，不是比较旧 Endaxis 与 Next 的全部架构。
旧输入为本机 `tmp/game-data-sources`，provenance 标记 `1.4.4@9433094-12`；
新输入为 `tmp/game-data-hybrid-full-20260903`，AKEDB 标记 `1.5.3@9885010-4`，
快照 SHA-256 `3c85bb1596f73d384403bdfe35f576b1ffb00beafcb13fe502fdc8154fd3331c`。
融合包的 VFS 补缺件尚未证明与 AKEDB 同版本；因此本文称“来源差异”，不是官方更新公告。

本次扫描正式 30 名干员前缀下两边共有的 SkillData / 私有 BuffData，逐字段定位后核对具体动作；
数组插入引起的下标错位不能直接解释为原有动作替换。只比较共有文件，不是完整依赖闭包差分。
诊断时把重新编码为相同 binary32 的数字列为表示差异，不改源文件，也不据此归并未知类型整数身份。
一次性脚本/明细在本机 `tmp/compare-refresh-existing-fields.ts`、`tmp/refresh-existing-fields-diff.json`，
不提交解包资产。以下文件名均相对于各来源集合，而不是生成 TS。

## 已定位的实质变化

| 对象                                                                                                                                      | 旧 → 新原始字段                                                                                                   | 对模拟的意义 / 未闭环点                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 洛茜 `buff_chr_0028_wulfa_normal_bleed`                                                                                                   | `useTimeDilationDt: true → false`                                                                                 | 改变 Buff 使用的时间增量；不能只对比倍率。原生计时依据见 combat-spec `time-dilation.md`。需在同一含时间膨胀的轴上验证持续时间和周期伤害。 |
| 赛希 `buff_chr_0011_seraph_normal_skill_heal`、别礼 `buff_chr_0026_lastrite_normal_skill`、莱万汀 `buff_chr_0016_laevat_passive_teammate` | 首个监听事件 `OnOutputDamage → OnBeforeOutputDamage`                                                              | 执行由本次伤害结算后移到结算前，影响生命条件观察时机和嵌套行为顺序；不是仅改事件名字。公共目标投影已接入，仍需击杀边界回归。              |
| 诀 `buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener`                                                                         | 原有目标相等/伤害 mask 检查前，新增 Owner 上 `seal2`、`seal_atb` 两个 `BuffCount < 1`，均 `limitSkillCastId=true` | 新增有实际短路效果的印记条件。按有效施法身份查找，不能改成全局计数；这是目前诀的整名编译阻塞。                                            |
| 诀 `buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener`                                                                         | 时长从常量 30 改为黑板 `duration`；静态 `maxStackCnt: 1 → 3`                                                      | 生命周期与叠层参数变化；不能简化为“终结技可以冻屏三次”，仍要结合 Unique 叠层及事件消费解释。                                              |
| Antal、Pogranichnik、Snowshine、Laevatain、Estella 的部分技能/Buff（精确文件见下）                                                        | 对应动作 `inheritSourceSkillCastId: false → true`，所列 Buff 路径均为 AuraAction                                  | 光环派生效果的来源施法身份继承配置改变，需核对同次施法过滤；不是普通 ID 重命名，也不是一律“创建子实体”。                                  |
| 梨诺 normal_skill 与 projhit_start_vfx 系列                                                                                               | 到达回调改到 `normal_skill_projhit_start_vfx`；碰撞回调由 `normal_skill_projhit` 改到 `normal_skill_projhit_02`   | 实际回调依赖链改变，需沿子技能闭包比较伤害；不能凭新 ID 的 vfx 后缀删除。                                                                 |
| 多名干员的 power_attack                                                                                                                   | 部分 DamageUnit 的 `UltimateSp costValue: 1 → 0`                                                                  | 是真实资源字段变化；尚未核对完整资源路径，不能直接宣称重击整体少回复 1 点终结技能量。                                                     |

上述来源身份行的精确文件为 `buff_chr_0023_antal_talent_1`、
`buff_chr_0029_pograni_ultimate_skill`、`buff_chr_0029_pograni_ultimate_skill_abilityentity`、
`chr_0014_aurora_combo_skill_abilityrange`（两个动作）、`buff_chr_0016_laevat_passive`（两个 Aura 动作）、
`buff_chr_0021_whiten_potential_5`。

另有洛茜战技/卡缪终结技强制动画同步配置、狼卫战技选择目标路径、诀射线阵营过滤、
部分移动/免疫配置变化。它们不能全部算作伤害逻辑变化：Endaxis 单敌人、必命中、不受敌人主动攻击
的场景会裁剪一部分；须对比投影后的时间与有效行为，不能机械累计原始差异数。

角色模板方面，旧模板中仅 9 名可在当前解析器完整对比条件：8 名已建模字段一致；汤汤新增
normal_skill_abilityentitymove 主动登记，并少一条旧连携条件。其余 21 名旧条件引用未完整解码，
不具备判定条件是否改变的证据，不能说 30 名模板逻辑全部变化。

## 没有发现或不应误报的变化

- 两张 SkillPatchTable 的 **341 个共有 chr\_ 技能项**，除 binary32 等价表示外，仅诀连携
  12 个等级的 `subDescDataList[7].name.id` 不同，未发现战斗数值字段变化。
  这不证明 SkillData 内直接常量、Buff、全局配置或新增技能都未变。
- `0.05000000074505806 → 0.05` 在已验证 VFS 批次中是相同 binary32 的 JSON 表示修复，
  不是倍率调整；该实验的 87,749 处数值变化都已验证位模式等价。
- 新增默认字段、枚举整数/名称和嵌套类型拼写兼容，大多是来源适配问题，不是新增战斗机制。
- 目前的“26 名生成文件 stale + 2 名相同 = 28/30 编译通过”不能用于计算机制变更人数。

## 发布前必须做

1. 已闭环诀有效施法身份与秋栗有副作用伤害条件，30 名候选可编译；仍须随下列同批依赖和
   组合轴门禁一起验证，不能据此直接发布。
2. 同批重建剩余派生目录，完成来源版本/固定哈希校验，不把新旧混合预检作为正式输出。
3. 对比旧/新完整生成对象，保留事件顺序、来源身份、Buff 时钟、资源与伤害数值差异；
   忽略格式和证据路径噪声必须有明确字段规则，不能全局删除 key。
4. 用相同轴回归上述变化，尤其是时间膨胀、致死一击与重复印记；通过后才替换正式定义和发布图片。
