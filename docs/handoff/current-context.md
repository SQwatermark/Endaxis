# 当前任务快照

> 更新时间：2026-08-17（Asia/Shanghai）
> 本文是变化最快、优先级最高的交接入口。完全不了解背景时，先读 [交接文档首页](./README.md)，再读本文和 [Next 文档入口](../next/README.md)。

## 1. 当前目标与边界

当前工作位于 `feature/next`，目标是在不修改旧版实现的前提下建设 Endaxis Next：以干员、武器、装备、敌人和用户操作序列为输入，准确模拟战斗过程，并由统一结果生成资源曲线、状态、伤害、诊断和日志。新版 UI 尽可能保持旧版布局与交互。

固定优先级：准确与功能完备 > 清晰易维护 > 性能。游戏规则必须有解包、反编译、C# Combat Spec 或已验证游戏样本依据，不用猜测填空。

当前继续推进干员 SkillData 到 Next DSL 的完整转换与模拟贯通。每轮只处理能够形成解析、DSL、运行时和测试闭环的机制，避免为了提高统计数字而静默省略动作。

## 2. Git 基线

- 仓库：`C:\Users\sqwat\Projects\zmd\Endaxis`
- 分支：`feature/next`
- 当前代码基线以 `git HEAD` 为准；最近已提交 `80843cb5 fix(next): omit proven empty skill listeners`。
- 紧邻提交：`f75ee096 feat(next): resolve source time dilation targets`
- 再前提交：`1237b4d4 feat(next): compile conditional slow actions`
- `tmp/` 是未跟踪临时目录，绝对不要提交。
- 工作树可能含用户改动；始终先运行 `git status --short`，不要重置或回退不属于当前任务的内容。

大潘代码与生成产物已提交。本文的交接更新会作为独立文档提交；新会话仍应以 Git 实际 HEAD 为准。

## 3. 本轮已经完成

### 条件减速动作

- `keyword_action_parser.py` 暴露可复用的 `parse_keyword_action`。
- 条件分支可保存和编译 `SlowAction`。
- 能力实体的条件调度保留编译器内部目标组证据，使子 SkillData 中的 `Context/tar` 能正确解析。
- 条件减速编译为内联高优先级 `buff_common_affixes_slow`。
- 编译器内部的 `localTargetGroupWrites` 不进入生成产物和审计文件，避免无意义膨胀。
- Fluorite 的减速已恢复为 3 次：根动作第 10 帧，以及潜能 3 以上时根时间第 99、159 帧；顺序保持原生伤害后施加。

对应提交：`1237b4d4 feat(next): compile conditional slow actions`。

### 时间膨胀目标

- 根技能 Action 中的 `Source` 和 `Owner` 映射为施法者，符合来源语义。
- 全量审计从 299/268 个已解析/已编译技能提升到 301/270。
- 技能主体零特殊缺口干员从 8 名提升到 9 名，大潘 9/9 技能闭环。
- 诀的连携继续停在“能力实体时间膨胀目标”缺口。不能静默忽略，因为它可能改变子实体命中帧。

对应提交：`f75ee096 feat(next): resolve source time dilation targets`。

### 大潘正式接入

- 在 `scripts/generate_next_operators/operators.json` 中增加 `chr_0018_dapan` 配置。
- 生成 9 个技能：四段普攻、处决、下落攻击、战技、终结技、连携技。
- 战技费用、终结技能量与冷却、连携冷却、处决条件和处决回能进入生成结果。
- 明确保留未建模项：两个天赋、部分潜能、处决免疫 Buff、终结技免伤 Buff。技能主体可完整转换不等于养成和保护效果全部闭环。
- 新增稳定入口 `src/next/data/operators/da-pan.ts`，并注册到 `nextGameDataRepository`。
- 生成与注册测试已覆盖大潘。

### 事件空操作与嵌套时间膨胀

- 洛茜终结技的 `OnSkillEnd -> FinishBuffAdvanced` 已确认使用空 ID 列表；原生实现不会调用 Buff 容器，因此只省略这一种可证明的空监听器。非空列表和其他事件仍严格阻塞。
- 根时间轴与条件分支共用时间膨胀动作解析器。条件分支中的动作留在原成功/失败序列中，不会被提升成无条件调度。
- 洛茜第三段连携和卡缪重击已越过嵌套时间膨胀阻塞。全量审计现为 303 个可解析、272 个可编译技能，完整干员仍为 9 名。
- `CheckEnemyRank` 已确认读取 `EnemyTemplateData.rank`（`Mob/Elite/Boss`），不是五档展示 `tier`。实际值来自敌人实体模板资产，VFS 数据可用前不得猜测映射。

## 4. 最新验证基线

当前验证结果：

- Python 生成器测试：245 项通过；
- 生成器 `--check`：通过；
- `npm.cmd run type-check:next`：通过；
- `npm.cmd exec vitest run src/next`：165 个测试文件、938 项测试通过。

测试数量只代表既有断言通过，不代表所有游戏机制已经得到证明。

## 5. 当前生成器状态

目录：`scripts/generate_next_operators`。

生成目录中，除首个佩丽卡样本外，已有九名技能主体可完整转换并注册的干员：Arclight、Gilberta、Lifeng、Estella、大潘、Akekuri、Fluorite、Endministrator、Last Rite。

当前生成器已经能够处理：

- 根 Action 与递归 Skill/Buff；
- 原生 Sequence 的分组和顺序；
- 常见伤害、失衡、附着、资源、状态和条件步骤；
- 技能费用、冷却、部分潜能/天赋与静态属性；
- 条件 Buff 伤害修正和条件 SlowAction；
- 根技能 `Source/Owner` 时间膨胀目标；
- 严格审计、显式缺口与生成产物校验。

仍不得伪装为已支持的关键内容：

- 能力实体自身的时间膨胀目标及其对子 SkillData 时间的影响；
- FractureAction 的完整运行时链，包括层数、消耗、前后物理附着事件、破甲 Buff 和伤害；
- 根 SequenceAction 守卫的统一短路语义；
- `CheckEnemyRank` 需要把 `EnemyTemplateData.rank` 接入敌人定义、项目实例和运行时条件求值；
- 隐藏技能、复杂 Buff、混合养成载荷及无法从数据稳定推导的例外。

## 6. 下一步建议

下一会话应先重新确认工作树和提交，再从下列候选中只选一个推进：

1. 远程 VFS 恢复后提取敌人 `EnemyTemplateData.rank`，接入 `CheckEnemyRank` 完整链路；
2. 设计根 `SequenceAction` 守卫的统一短路入口，再处理 Avywenna/Mifu 的距离条件；
3. 继续研究能力实体时间膨胀，不允许通过忽略目标来让诀“转换成功”；
4. FractureAction 必须等完整操作链和运行时语义齐备后再接，不做只解析名称的半成品。

选择原则：优先能够从数据到生成 DSL、编译、运行时和测试形成闭环的机制，而不是单纯增加解析计数。

## 7. 恢复工作清单

1. `git status --short`，确认没有把 `tmp/` 或用户文件带入提交；
2. `git log -10 --oneline`，以实际 HEAD 为准；
3. 阅读本文、`docs/next/09-status-and-roadmap.md` 和 `scripts/generate_next_operators/README.md`；
4. 查看最近生成审计，区分“技能主体完整”和“天赋/潜能/保护效果完整”；
5. 修改前先找到数据或反编译依据；
6. 新增行为同时更新生成器测试、Next 类型检查、Next 测试和文档；
7. 不修改旧版代码，不提交 `tmp/`，不为尚未发布的 Next 中间存档保留兼容脚手架。

## 8. 跨项目背景

本项目不是只依赖 Endaxis 自身：

- AKEDB/CDN 提供表格、文本和部分技能/Buff 数据；
- 本地 VFS 工具与远程 `vfs-index-browser` 用于读取客户端资源；
- IL2CPP dump 与运行时探针用于确认执行顺序和硬编码逻辑；
- 独立 C# Combat Spec 仓库用于按证据 1:1 复刻战斗语义；
- Endaxis Next 只要求行为一致和工程可维护，但新证据应同步回 Combat Spec 与研究文档。

项目位置、连接方式、证据等级和操作命令详见：

- [项目与工具总览](./02-projects-and-tools.md)
- [证据与研究方法](./03-evidence-and-research-method.md)
- [战斗系统研究结论](./04-combat-system-findings.md)
- [操作手册](./07-operations-playbook.md)
