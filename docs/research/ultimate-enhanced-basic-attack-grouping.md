# 终结技强化普攻的技能组分层

## 结论

`CharGrowthTable.skillGroupMap` 是养成等级来源，不等同于编辑器的一次释放链。莱万汀与伊冯把开大
SkillData 和强化普攻 SkillData 同时列在 `UltimateSkill` 原生组中，表示强化普攻读取终结技等级；不能
因此把它们顺序拼进一次终结技释放。

Next 的正式投影为：

- `ultimate.skills` 只包含真正的开大 SkillData；
- `basicAttack.skills` 保留普通普攻链；
- `basicAttack.variants.enhancedBasicAttack` 保存强化普攻链，`levelSource=ultimate`；
- 形态链仍属于 `basicAttack`，伤害标签和技能类型不再误报为终结技。

## 来源证据

- 莱万汀原生终结技等级组依次列出 `ultimate_skill` 与 `ult_attack1..4`。技能文本明确说明开大后普通
  攻击得到强化，第三段强化普攻施加灼热附着；四个攻击文件是强化普攻链，不是四段终结技。
- 伊冯原生终结技等级组依次列出 `ultimate_skill`、五个常规强化攻击文件和
  `ult_attack_end`。技能文本明确说明终结技临时强化普通攻击，持续时间结束前的最后攻击变为强化
  重击。
- `buff_chr_0017_yvonne_ultimate_skill_end` 的 `ComboCacheAction` 将 Attack 命令指向
  `chr_0017_yvonne_ult_attack_end`，进一步证明该文件属于强化普攻收尾，而不是开大时间轴的第七段。
- 莱万汀 `normal_skill_during_ult` 仍由已有 `ChangeSkillAction` 关系作为战技槽替换形态；没有独立
  SkillData 的连携强化行为继续保留在连携本身的条件/Buff 程序中，不编造额外技能文件。

## 当前编辑与模拟边界

### 2026-09-11：伊冯整组放置策略

策略由 `tools/game-data-compiler/config/operators.json` 的技能组变体 `placementPolicy`
声明，经转换器进入公共技能组契约和生成定义。编辑器不按干员或技能名称判断。
`firstSkillKey`、`terminalSkillKey`、`maxSegments` 与 `fallback: sequence` 控制起止、
预算及按声明顺序回退；基础组和具名变体均可使用。伊冯的预算配置为24段。

技能库仍显示五段强化普攻与重击。交互式整组放置从A1开始，在每段实际块尾后的输入帧
使用正式模拟路由推断下一段，重复至重击；不按静态六段列表一次铺开。
最多推测24段。未知路由、同轨后续技能、场景边界或模拟错误导致未能到达重击时，
丢弃临时前缀，从原放置点按A1～A5与重击六段默认间隔放置。
这是编辑放置元数据，不改变技能执行程序、Buff计时、伤害或手动单段放置。

### 2026-09-11：伊冯收尾普攻输入映射修复

当前 hybrid-20260905（AKEDB 1.5.3@9913107-5）的
BuffData/buff_chr_0017_yvonne_ultimate_skill_end.json，SHA256
`534b91f2176d4fc0071e808e861840680fe184ec0eb24f0c881220583853cb18`，
DuringBuffEnable 首个动作明确注册 Attack → chr_0017_yvonne_ult_attack_end，
cacheEndByAction=true。此前公共叶投影直接丢弃 inputControl，导致结束 Buff
虽然已生效，校验仍读当前3B的循环映射。

现通过公共动作 overrideBasicAttackMapping 在 AbilitySystemRuntime 注册 Buff 映射；
Buff 高于 Skill/Mode 的优先级依据 combat-spec 的 docs/combo-input.md。
句柄随动作结束精确撤销，冲突目标保持 unknown，不猜同优先级仲裁。
来源投影仅接纳已确认的干员 Buff、明确目标、随动作结束的配置；
不引入客户端输入缓存、移动输入或敌人主动行为。
条件分支和 DoOnce 的省略判定也不得吞掉这些普攻映射。

首次直接补生成文件的做法已纠正：完整校验当前来源后，正式整名渲染、写入并通过check。
实际生成除结束Buff映射外，还保留两个回调各自的黑板作用域，并恢复天赋Buff到
chr_0017_yvonne_attack5的输入映射；不修改技能块文本、时长或伤害。
真实终结技测试覆盖连续3B后的合法重击、提前/过期重击仍不合法、
重击结束和 Buff 自然到期后的普通普攻恢复。

技能库把具名形态以“强化普攻”普通卡片平齐显示，不用缩进表达数据层父子关系。拖放强化普攻形态会
按原生顺序展开，并在编译时使用终结技等级；项目存档仍保存稳定的
`basicAttack + 具体形态技能 key`，没有把它改写成终结技身份。

以下为技能组分层初期的边界记录；当前已导入技能窗口、角色模式及上述 Buff 映射。
原生角色输入层如何在状态期间自动选择整条、且长度不同的普攻链，不存在于当前 SkillData
`ChangeSkillAction` 证据中。当前不伪造逐段换槽关系；后续若接入角色命令映射证据，应只改变运行时
实际形态选择，不改写时间轴放置身份。
