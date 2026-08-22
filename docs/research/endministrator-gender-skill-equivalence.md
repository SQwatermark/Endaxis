# 管理员男女技能等价投影

## 结论

Endaxis 只把管理员建模为一名干员和一套技能。正式定义使用女管理员
`chr_0003_endminf_*` SkillData，并暴露通用稳定键：`basicAttack1..5`、`finisher`、
`plungingAttack`、`battleSkill`、`ultimate`、`comboSkill`。

男管理员 `chr_0002_endminm_*` 不再生成另一套可选技能。其原生 ID 通过
`simulationEquivalentNativeSkillIds` 留在严格技能组审计中，表示它们是当前模型不单独暴露的表现
变体，而不是缺失文件或未建模玩法。

## 对照证据

1. 男女五段普攻逐段具有相同技能块边界、伤害段数、命中帧、攻击倍率等级数组、条件动作数和资源
   行为。
2. 处决分别具有相同的 27 帧边界和第 9/27 帧两段伤害；下落攻击均为 21 帧边界和第 1 帧命中。
3. 战技均为 24 帧，终结技均为 56 帧且第 50 帧命中；对应条件、Buff 和资源动作数量一致。
4. 连携的战斗动作结构、条件链和倍率一致。男版展示边界为 24 帧，女版为 23 帧，这是两套中唯一的
   块边界差异；正式定义采用女版 23 帧，不为表现差异建立第二技能实例。

本结论只合并管理员男女外观对应的技能来源，不允许据此合并其他干员的形态替换或具有不同战斗动作
的技能变体。

## 旧项目身份

早期 Next 项目可能保存 `basicAttackMale/basicAttackMale1`、
`basicAttackFemale/basicAttackFemale1`、`ultimateFemale` 等身份。正式定义提供只读 `skillAliases`，解析
时映射到通用技能组和女版模板；别名不出现在技能库中，也不会重新制造两套可拖放入口。新建技能块只
写入规范身份。
