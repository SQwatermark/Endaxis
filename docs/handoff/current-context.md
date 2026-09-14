# 当前交接

更新日期：2026-09-15。当前分支为 `refactor/common-game-data`。本文件只记录当前状态和下一步；设计
见架构文档，调查过程和原生证据见 research，已经结束的阶段记录见 archive。

## 当前任务

战斗运行时切面的 T6 收尾已经完成。当前进入用户确认的两个后续方向：

1. 把本次拆出的切面数据结构整理成少数基础模块，按层次组织，减少零碎文件；
2. 分析约 585 MiB 的进程峰值由哪些部分组成，再按证据降低总内存。

先推进切面数据基础模块，再做总内存组成分析。任务顺序和验收标准统一维护在
[切面任务清单](runtime-checkpoint-plan.md)。

## 已完成的切面能力

- `CombatStateGraph` 保存完整帧边界的战斗数据，固定动作程序和回调不进入数据图。
- `CombatRuntimeSession` 支持保存、恢复、分支、回退、逐帧输入和显式丢弃保存点。
- 恢复先预检并建立完整候选装配，成功后才替换当前分支；失败不污染原分支。
- 新战斗与恢复战斗共用同一帧阶段管线，主控、技能、Buff、实体、投射物和回调保持原顺序。
- 固定技能程序与每次 `castId` 的施放登记分开；局部自定义技能只在对应输入提交时登记。
- 单块随机种子只随技能输入提交。随机源不再接收整轴 `castSeeds` 表。
- 回执历史移出状态图复制路径，保存点共享不可变前缀；增量 reader 只读取新增事实。
- `CombatInputSchedule` 同时管理外部输入边界和战斗保存点，可以替换边界后的技能、连续组、切人和标记。
- 旧轴转换按候选最早影响帧保存，只提交已确认但尚未执行的输入和当前候选，不预先生成后续旧轴技能。

详细结构见[战斗运行时切面](../architecture/runtime-checkpoints.md)和
[回执历史](../architecture/combat-receipt-history.md)。

## 已修复的问题

切面验收过程中已经修复以下会改变结果或破坏恢复的问题：

- 恢复漏发或重复切人通知，导致主控条件读取错误；
- 候选技能登记污染父分支，或恢复后重新编号固定程序；
- 能力实体子技能逐实例克隆固定程序，动作账本却发生交叉；
- 连携窗口活动 Buff 事件、SkillAffix、投射物和回调宿主没有完整恢复；
- Buff 动作宿主回收后仍被旧引用使用；
- Buff 乱序时间线按错误下标恢复；
- 群体 GlobalBuff 恢复后的目标顺序与新战斗相反；
- 候选试算完成后仍由外壳、排程器或回执游标持有重型分支；
- 旧测试把带 `castId` 的实例程序放进固定技能目录，或省略投射物回调的定义干员归属；
- 随机源保留整轴 `castSeeds` 过渡入口，使未来输入可能提前进入状态。

生产代码仍严格拒绝重复技能身份、同技能不一致的冷却、缺失程序和缺失回调归属。没有为旧测试放宽
这些校验。

## 正确性验收

### 真实轴保存与恢复

第一批覆盖 4 个项目中的 6 条真实轴，期望和固定种子随机模式分别在第 1200、1800、2400 帧保存，
共 36 次恢复续跑。父分支、恢复分支和正式整轴的完整状态与应用结果一致。

随后对两条带主控切换的真实转换轴按实际回执选择事件前后帧：

- “简单自用电队钱本（副本）”：终结技膨胀开始/结束、能力实体子技能、Buff 周期伤害；
- “弭洛卡骏”：能力实体子技能、Buff 生命周期结束、终结技膨胀开始/结束。

每条轴、每种随机模式各检查 8 个保存点，共 32 次续跑。父分支和恢复分支的完整状态、应用结果与
全部有序回执相同；逐帧输入和正式整轴的结果与有序回执也相同。

两条轴当前期望模式结果：

| 轴                       | 回执数 | 命中数 | 期望伤害           |
| ------------------------ | ------ | ------ | ------------------ |
| 简单自用电队钱本（副本） | 10129  | 147    | 2370658.0089585194 |
| 弭洛卡骏                 | 8853   | 449    | 4658307.6932699755 |

### 广域回归

2026-09-15 串行、单 worker 运行 `src/core/combat`、正式场景服务和公开轴应用入口：

- 180 个测试文件全部通过；
- 1835 项测试全部通过。

最近删除整轴 `castSeeds` 后已再次运行同一组测试，结果仍为 1835/1835。

## 性能与内存

三条真实旧轴共有 102 个技能块、127 次候选试算。串行预热后：

- 旧整场重跑中位数：21.47 秒；
- 切面路径中位数：6.00 秒；
- 按事实停止候选观察后：约 4.16 秒；
- 回执前缀移出状态图复制路径后：约 3.06 秒。

这些数字来自同机同输入的阶段测量，不能跨机器直接比较。

内存审计分两组：

1. “弭洛卡骏”66 个输入、3600 帧，在第 1800 帧保存；预热 96 次后再分叉、推进并释放 96 次。
   可观察堆峰值约 216.3 MiB，进程 RSS 峰值约 574.3 MiB。丢弃保存点后堆比基线低约 2.17 MiB。
2. 下载目录中的 3 条旧轴、102 个技能块；预热 3 次后完整转换 12 次。结果哈希相同，释放后堆在
   约 133.6–134.5 MiB 间波动，最终比基线低约 0.61 MiB。可观察堆峰值约 289.3 MiB，进程 RSS
   峰值约 584.5 MiB。

当前没有观察到随分支或转换次数持续增长的堆泄漏。总峰值仍偏高，下一阶段必须拆分测量模块加载、
固定程序、状态图、回执、结果投影和转换中间数据，不能把 RSS 全部归因于切面。

详细方法和原始字节数见
[切面耗时与内存分析](../research/combat/checkpoint-retiming-cost-analysis-2026-09-14.md)。

## 尚未完成

1. **真实组合样本**：当前 `tmp` 和 Downloads 中没有同时包含 `afterCastId` 与 `customDefinition` 的
   用户实际存档。派生组合场景已经通过，但不能冒充真实编辑数据。
2. **切面数据文件整理**：状态类型分散在各运行模块旁，需要设计少数基础模块并迁移导入；不能把
   业务运行逻辑也塞进一个大文件。
3. **总内存组成分析**：已有泄漏和峰值数字，尚未得到各层的保留大小与瞬时峰值占比。
4. **其余业务工作**：切面主线以外的游戏机制、生成器和 UI 待办继续以各自架构与研究文档为准。

## 本机复现入口

真实转换轴和审计脚本位于忽略目录，只用于本机验收：

- `tmp/public-6aa244e7-control-inferred-final-20260913/project.json`
- `tmp/public-6aa007f2-control-inferred-final-20260913/project.json`
- `tmp/verify-checkpoint-real-axes.mjs`
- `tmp/audit-checkpoint-long-axis-memory.mjs`
- `tmp/audit-legacy-conversion-memory.mjs`
- 下载目录中的 `Endaxis_Timeline_2026-08-31.json`
- `tmp/mappings.2026-08-31.formatted.json`

常用检查命令：

```powershell
npx vitest run src/core/combat src/application/publicShareRegression.test.ts src/application/scenarioSimulationService.test.ts src/application/runScenarioSimulation.test.ts --maxWorkers=1 --silent
npx vitest run tools/legacy-timeline --maxWorkers=1 --silent
npm run type-check
```

重型检查顺序运行。当前机器内存使用应保持克制，不并发执行完整类型检查、全量测试和内存审计。

## 文档入口

- [架构总览](../architecture/README.md)
- [战斗运行时](../architecture/runtime.md)
- [战斗运行时切面](../architecture/runtime-checkpoints.md)
- [回执历史](../architecture/combat-receipt-history.md)
- [时间与显示](../architecture/time-and-display.md)
- [代码规范](../development/code-style.md)
- [本地开发环境](../development/local-environment.md)
- [验证指南](../development/validation.md)
- [旧轴转换工具](../../tools/legacy-timeline/README.md)
