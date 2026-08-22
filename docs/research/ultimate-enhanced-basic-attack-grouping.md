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

技能库把具名形态以“强化普攻”普通卡片平齐显示，不用缩进表达数据层父子关系。拖放强化普攻形态会
按原生顺序展开，并在编译时使用终结技等级；项目存档仍保存稳定的
`basicAttack + 具体形态技能 key`，没有把它改写成终结技身份。

原生角色输入层如何在状态期间自动选择整条、且长度不同的普攻链，不存在于当前 SkillData
`ChangeSkillAction` 证据中。当前不伪造逐段换槽关系；后续若接入角色命令映射证据，应只改变运行时
实际形态选择，不改写时间轴放置身份。
