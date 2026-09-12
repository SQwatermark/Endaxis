# Context 数量读取必须保留对应写入

2026-09-12，在关闭新增优化的候选上运行混合队伍模拟，发现缇丰浮空战技起手读取了未创建的
`tar2`。这不是优化器差异，也不是需要为缺失目标组补默认值；原生查询写入被既有生成器省略了。

## 来源与执行顺序

来源文件为 `SkillData/chr_0034_typhoea_normal_skill_floating_start.json`，SHA-256：
`F93D28713C4438D6D43A52E1D87D52DEC4756D74971633254C9212EB681E3BD8`。
文件来自本次冻结资源目录，具体位置见本地环境记录；不能仅凭目录日期证明客户端版本。

| 时间线               | 帧区间 | 非主控分支中的动作                                                                                                                                 |
| -------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `timelineActions[6]` | 1–10   | `CheckEntityNum[26]` 检查输入 Target；成功后 `FindTarget[27]` 用 AllEnemyFinder 写入 tar2，失败后 `FindTarget[28]` 用 FixedPointFinder 写入 tar2。 |
| `timelineActions[7]` | 2–5    | `CheckEntityNum[42]` 读取 Context/tar2；成功后 `ForEach[43]` 遍历该组发射投射物。                                                                  |
| `timelineActions[8]` | 7–10   | `CheckEntityNum[64]` 再次读取 Context/tar2；成功后 `ForEach[65]` 遍历该组。                                                                        |

三条时间线分别以 `CheckMainCharacterCondition[23/30/52]` 区分主控和非主控。
固定木桩模型的技能输入为唯一敌人，所以动作 `[26]` 成功、`[27]` 写入敌人；`[28]` 的空间点分支
在这项模型假设下不可达。单人场景默认走主控分支，混合队伍才暴露另一分支的缺失写入。

## 生成器为何出错

生成器将“查询可归约为一个固定目标”保存为编译期事实，并省略实际 Context 写入。
另一层分支裁剪又把只有查询和条件的 IfElse 当作无战斗作用。两层都没有考虑后续时间段仍读取该组。

此例的 tar2 只在非主控分支写入。跨时间段分析没有得到无条件成立的数量事实，因此后续仍输出
`contextTargetCountCompare`；与此同时，实际 writer 和它的外层分支已经消失。保留 reader 而删除
writer 才是异常原因，不能通过将缺失组视为空来掩盖。

修复从已支持的 Context 数量条件收集仍需运行时读取的组。对应静态敌人或空间点查询保留实际写入，
外层分支也不能再按“只有查询”省略。无需添加干员或目标组名称配置。

回归使用同构但不同组名的数据，经过来源解析、完整主动技能投影、正式 Context 执行器和动作序列运行时，
分别验证主控与非主控。非主控路径先写入敌人再读取；主控路径不写该组，也不会执行非主控 reader。

## 本次没有顺带改写的语义

`combat-spec/docs/buff-and-damage.md` 的 1.4.4 反编译记录指出：CheckEntityNum 只统计可解析为
AbilitySystem 的包装项，空间点不计数；有 storeKey 时只在条件成功后写黑板。当前 Endaxis 的
`contextTargetCountCompare` 对这两点还需单独审查。本次实际可达分支只写入敌人、storeKey 为空，
所以该证据缺口不改变这里的 writer 修复结论。不能据本次通过宣称所有 Context 数量条件都已复刻正确。

标签过滤集合的另一处既有回归见[莱万汀火焰附着吸收记录](../operators/laevatain-fire-infliction-absorption.md)。
