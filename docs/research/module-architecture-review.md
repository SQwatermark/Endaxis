# 逐模块架构审查

本文记录核心架构首轮梳理之后的逐模块检查，帮助区分“已经能说清楚的职责”和“仍需验证的实现”。稳定的模块说明写入对应架构主题页；本页只保留范围、进度、证据和问题，不用测试数量替代架构判断。

基线：`8bcc46b97e03dedd7fb84480dbee7c0fcda43d93`。H1/H2 已在该基线修复，两个修复提交的 Linux/Windows CI 均通过。背景见[首轮审查](core-architecture-audit.md)。

当前整改状态见[修复计划与进度](architecture-remediation.md)。以下问题描述保留审查基线证据，是否已修复以该进度为准。

## 完成标准与边界

本次是一次有明确结束条件的模块检查，不是无限研究，也不是逐行证明全部游戏逻辑。每个模块需要完成：

1. 找到实际公共入口及生产调用者，说明输入、输出、职责和不负责的事。
2. 追踪主要数据的所有者、共享关系、可变性、创建、复用和释放。
3. 从正常路径追踪到失败路径；有恢复/取消/分支能力的模块还要检查相应路径。
4. 核对与上下游的协议及变更影响，记录无法清楚解释的耦合，而不是用文档补上实现中不存在的保证。
5. 对照原生测试，运行有辨别力的相关检查，明确未检查的分支和外部证据限制。
6. 更新面向开发者的主题文档，并记录可核验的代码入口和发现。

库存覆盖全部核心责任模块；同一装配文件可能参与多个模块，不把目录拆分等同于责任划分。生成定义只作为消费者输入抽查，不逐个证明全部角色、装备或原生行为。原始资源、真实浏览器异常和长期内存实验需要单独证据；缺少这些条件时明确标注，不默认通过。

清楚的架构说明是理解设计的必要检查，但不是设计合理性的充分证明。若文档必须反复列出例外或跨模块写入，应把它们当作待调查线索。

## 模块清单与顺序

| 编号 | 责任模块与主要目录                                                                                                  | 首轮库存                          | 对应稳定文档                                                                                                                   | 深入检查状态 |
| ---- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| M01  | 共享契约、定义查询协议与校验：`packages/game-data-contract/src`、`src/core/game-data`                               | 17 + 25 个 TS 文件                | [游戏数据](../architecture/game-data.md)                                                                                       | 关键路径已查 |
| M02  | 离线来源读取、缓存、版本与来源追踪：`tools/game-data-compiler/src/source`                                           | 107 个 TS 文件                    | [离线生产](../architecture/game-data-production.md)、工具 README                                                               | 关键路径已查 |
| M03  | 离线动作投影、引用、领域组装与优化：`tools/game-data-compiler/src/compiler`、`tools/game-data-compiler/src/domains` | 89 + 39 个 TS 文件（含 M04）      | [离线生产](../architecture/game-data-production.md)、[动作图](../architecture/action-graphs.md)                                | 关键路径已查 |
| M04  | 候选构建、验证、发布和回滚：编译器 `build/publication` 与脚本                                                       | 脚本 52 个 TS 文件                | [离线生产](../architecture/game-data-production.md)、工具 README                                                               | 关键路径已查 |
| M05  | 正式数据登记、按需加载和项目覆盖：`src/data`                                                                        | 435 个 TS 文件，主要为生成定义    | [游戏数据](../architecture/game-data.md)                                                                                       | 关键路径已查 |
| M06  | 项目格式、编辑事务、草稿与存储：`core/project`、`application/editor`、`application/openProject`、存储适配           | 11 + 16 个 TS 文件及存储适配      | [编辑器](../architecture/editor.md)                                                                                            | 关键路径已查 |
| M07  | 图校验、场景编译、构筑和机制：`core/action-graph`、`compiler`、`mechanics`                                          | 3 + 25 + 4 个 TS 文件             | [场景编译](../architecture/scenario-compilation.md)、[动作图](../architecture/action-graphs.md)                                | 关键路径已查 |
| M08  | 战斗数据图、装配及恢复：`combat/state`、`combat/runtime`                                                            | 6 + 34 个 TS 文件（含恢复与输入） | [战斗](../architecture/combat.md)、[切面](../architecture/checkpoints.md)                                                      | 关键路径已查 |
| M09  | 时钟、变速、随机：`combat/time`、`combat/random`                                                                    | 5 + 3 个 TS 文件                  | [战斗](../architecture/combat.md)、[随机](../architecture/randomness.md)                                                       | 关键路径已查 |
| M10  | 资源和属性账本：`combat/resources`、`combat/attributes`                                                             | 11 + 4 个 TS 文件                 | [战斗](../architecture/combat.md)                                                                                              | 关键路径已查 |
| M11  | 动作解释与时间线：`combat/actions`、`combat/timeline`                                                               | 13 + 3 个 TS 文件                 | [技能操作](../architecture/skill-operations.md)、[动作图](../architecture/action-graphs.md)                                    | 关键路径已查 |
| M12  | 技能、能力、冷却和输入：`combat/skills`、`combat/abilities`、输入协调                                               | 33 + 21 个 TS 文件（含 M15）      | [战斗](../architecture/combat.md)、[技能操作](../architecture/skill-operations.md)                                             | 关键路径已查 |
| M13  | 事件分发、身份和宿主订阅：`combat/events` 与宿主生命周期                                                            | 12 个 TS 文件及能力宿主           | [事件与 Buff](../architecture/events-and-buffs.md)、[切面](../architecture/checkpoints.md)                                     | 关键路径已查 |
| M14  | Buff、全局 Buff 与标签：`combat/buffs`、`combat/tags`                                                               | 17 + 2 个 TS 文件                 | [事件与 Buff](../architecture/events-and-buffs.md)                                                                             | 关键路径已查 |
| M15  | 能力实体、投射物及延迟后果：abilities 中对应目录与装配 hooks                                                        | 库存计入 M08/M12                  | [实体与效果](../architecture/combat-effects.md)、[切面](../architecture/checkpoints.md)                                        | 关键路径已查 |
| M16  | 伤害、治疗、附着与状态：`combat/damage/heal/infliction/status`                                                      | 21 + 3 + 9 + 7 个 TS 文件         | [实体与效果](../architecture/combat-effects.md)、[结果](../architecture/results.md)                                            | 关键路径已查 |
| M17  | 回执、投影与来源：`combat/receipt`、`core/projection`                                                               | 4 + 30 个 TS 文件                 | [结果](../architecture/results.md)                                                                                             | 关键路径已查 |
| M18  | 场景服务、输入排程、增量/继承、线程与发布：`application/simulation`、`core/pipeline`                                | 17 + 1 个 TS 文件                 | [模拟服务](../architecture/simulation-services.md)、[切面](../architecture/checkpoints.md)、[结果](../architecture/results.md) | 关键路径已查 |
| M19  | 旧方案格式转换与重排：`application/legacyTimeline`、`tools/legacy-timeline`                                         | 9 + 3 个 TS 文件                  | [编辑器](../architecture/editor.md)、工具 README                                                                               | 关键路径已查 |

库存统计来自基线目录，排除常规测试、类型断言、性能测试和明确测试支持目录；数字仅帮助理解范围，不表示已经阅读相同数量文件。UI 手势、样式、设计系统、图表安装/纯展示辅助和发布托管不属于本次核心模块的独立审查项，只在输入/输出边界需要时读取。

## 当前进度

- 库存和检查顺序已记录。
- M01–M19 关键路径已核查。待整改的重要项为 D07 当前方案导出缺失定义、D06 页面项目效果查询遗漏、D04 测试守卫盲区；均未自动修代码。有限模块清单本轮已走完；完整性只指清单关键路径覆盖，不是全部分支、生成定义或浏览器异常穷举。
- 新发现只给出证据、风险和最小整改建议；此次后续模块检查不自动修改生产逻辑。

## M01：共享契约、查询协议与校验

已追踪 `GameDataRepository`/`GameDataBrowser` 的输入约定、查询空值与目录枚举，公共契约导出和禁止运行逻辑边界，未知项目输入与已成形定义校验的区别，以及仓库登记到 `ActionGraphDefinitionRepository` 的首次发布/冻结和缓存生命期。稳定说明已补入[游戏数据：查询协议与校验边界](../architecture/game-data.md#查询协议与校验边界)。

关键证据（基线代码）：`gameDataRepository.ts:49–86`、`definitionGuards.ts:16–58`、`validateOperatorDefinition.ts:80–95`、`createGameDataRepository.ts:149–203`、`actionGraphDefinitionRepository.ts:22–158`。实际调用由仓库创建和场景编译持有，不存在契约包主动加载定义或执行战斗的入口。

- **D01，设计约束，非已证实缺陷：** 查询仓库同时拥有图编译缓存；第一次编译会冻结输入图，缓存按对象身份/等级/导入目录，而非仅靠 revision。误把它当成无副作用的数据字典，会错误设计草稿编辑或缓存失效。最小处理是明确所有权和现有测试约束，暂无依据拆出新框架。
- **对 R1 的收窄：** 图定义已经有发布时深冻结，不能把“仓库仍持有定义引用”概括成所有定义都毫无保护。项目整体和非图字段的保护仍需 M05/M06 继续核查。
- **已查失败路径：** 重复身份与冲突别名在登记时拒绝；图缺节点会在准备/编译时报错；不同等级、实体目录或导入目录不能复用错误编译。无效图可能已被冻结，不能假设编译失败意味着草稿仍可原地编辑。
- **未查范围：** 未逐字段证明 17 个契约文件的游戏单位/原生语义，未穷举 25 个领域文件中的全部非法组合；下一模块继续检查外部来源如何进入这些类型。没有把类型检查通过当作原生正确性证明。

- M01 验证：契约独立类型检查通过；图编译仓库、技能/干员/构筑校验、数据仓库及契约边界共 6 个原生文件、89 项通过。命令范围：`npm run type-check:game-data-contract` 与上述对应 `*.test.ts` 的 `npx vitest run ... --maxWorkers=1`。这是列明路径的验证，不代表所有定义语义已审计。

## M02：离线来源、缓存与准入

已追踪 provider 请求/响应体重试及身份验证 → 下载器的隔离目录与来源账本 → verifyGameDataSnapshot → rebuild 的 source-coverage gate；另追踪 SourceFileCache 配对读取、嵌套冻结、LRU 淘汰及读盘/解析失败。稳定说明见[离线游戏数据生产](../architecture/game-data-production.md)。

证据：`scripts/gameDataProviders.ts:95–130`、`downloadGameDataSources.ts:78–232`、`verifyGameDataSnapshot.ts:8–138`、`rebuildGameData.ts:215–268`、`src/source/sourceFileCache.ts:37–145`。

- **D02，准入约束，非已证实缺陷：** 下载工具能产出 vfs-only 或定向文件，不代表正式构建接受它。正式准入要求 hybrid 账本、完整文件集合和 AKEDB BuffData；定向补文件不能凭“下载成功”跳过整批来源校验。
- **D03，缓存约束，非已证实缺陷：** SourceFileCache 故意在命中时保留第一次读取，不按文件 mtime 自动失效；独立验收必须重新读取。原文字节容量不等于堆占用，暂无实测泄漏依据。
- **已查失败路径：** 损坏来源身份或资产哈希不当作可补缺 404；非 BuffData 的坏集合清单不能降格为空；失败解析移除缓存；缺少来源通过 missingInputs 阻断完整发布。总体来源版本是否真正一致仍是外部证据问题。
- **验证：** provider、下载、hybrid 补缺、来源缓存 4 个原生测试文件、34 项通过。使用 `npx vitest run tools/game-data-compiler/test/{gameDataProviders,downloadGameDataSources,hybridSourceDownload,sourceFileCache}.test.ts --maxWorkers=1`。
- **未查范围：** 未访问实际 CDN/VFS 或重建原始 Unity 资源；未逐个遍历全部来源解析器的每种原生字段组合。测试使用原生工具的替身来源，不能证明真实版本覆盖完整。

## M03：离线投影、引用与优化

已沿来源控制流 → 条件/叶子/实体时间投影 → 通用序列编排 → Buff/领域定义 → 资源图优化追踪正常和拒绝路径。稳定说明已补入[公共动作投影与领域组装](../architecture/game-data-production.md#公共动作投影与领域组装)。

证据：`src/compiler/actions/actionSequenceProgram.ts:16–96,148–174,180–456`、`conditions/combatConditionProjection.ts:22–88`、`references/referenceClosure.ts:25–82`、`domains/operator/sourceClosure.ts:78–100`、`optimization/definitionProgramOptimization.ts:29–60`、`resourceGraphOptimization.ts:178–184`、`definitionUsageAnalysis.ts:45–87`。

### D04：投影分层守卫的四个入口已失效

类型：已确认的测试盲区；尚未发现对应的生产分层违规。`tools/game-data-compiler/test/dataContractBoundaries.test.ts:75–111` 的第一项测试仍把下列文件放在 compiler 根目录，但实际实现已经进入子目录：

| 守卫中的旧入口（相对 compiler）    | 当前实现                                   |
| ---------------------------------- | ------------------------------------------ |
| `combatConditionProjection.ts`     | `conditions/combatConditionProjection.ts`  |
| `combatActionLeafProjection.ts`    | `actions/combatActionLeafProjection.ts`    |
| `combatEntityAndTimeProjection.ts` | `actions/combatEntityAndTimeProjection.ts` |
| `buffRuntimeProjection.ts`         | `buffs/buffRuntimeProjection.ts`           |

`combatProjectionCommon.ts` 仍存在。其他四个起点不在 graph 中，`graph.get(path) ?? []` 使遍历直接结束；测试没有先断言起点存在。因此这项测试通过不能证明这些层仍受保护。

在仓库根目录可直接复核路径，无需改代码：

```sh
node --input-type=module <<'NODE'
import { existsSync } from 'node:fs';
const root = 'tools/game-data-compiler/src/compiler/';
const moved = [
  ['combatConditionProjection.ts', 'conditions/combatConditionProjection.ts'],
  ['combatActionLeafProjection.ts', 'actions/combatActionLeafProjection.ts'],
  ['combatEntityAndTimeProjection.ts', 'actions/combatEntityAndTimeProjection.ts'],
  ['buffRuntimeProjection.ts', 'buffs/buffRuntimeProjection.ts'],
];
for (const [oldPath, currentPath] of moved)
  console.log({ oldPath, oldExists: existsSync(root + oldPath), currentPath, currentExists: existsSync(root + currentPath) });
NODE
npx vitest run tools/game-data-compiler/test/dataContractBoundaries.test.ts --maxWorkers=1
```

基线结果：四项均为 `oldExists: false, currentExists: true`，而现有 7 项测试全部通过。另用 TypeScript AST 对当前五个真实起点进行独立传递遍历（包括类型导入），并先断言每个起点在图中：没有发现原规则禁止的同级/向上回流。这个独立结果只能说明当前依赖，不能修复未来 CI 的盲区。

最小建议：纠正四个入口；在遍历前断言所有登记起点存在，并用受控违规样例证明守卫确实能失败，避免以后移动文件又静默退化。本次文档检查未修改测试或生产代码。

### 其他结论与限制

- 引用解析能返回缺失列表供审计，但完整领域编译会拒绝缺失启用依赖；不能把报告 API 与发布 API 混为一谈。
- 优化已有外部读取、未知访问、可能抛错和可观察行为维度；暂无依据为缩小产物删除概率/事件步骤，或把分散资源合成全局动作图。
- 尚未逐个证明所有原生动作和场景策略分支，未做完整冻结来源的优化前后全量重建。已检查的是控制流与所有权规则、代表性拒绝路径和原生测试，不是全部角色语义验收。

- M03 验证：序列编排、Buff 投影、静态引用闭包、角色闭包、用途分析和资源图优化共 6 文件、136 项通过；另 1 个真实来源优化对照文件的 3 项因缺少 `ENDAXIS_HIDE_UI_SOURCE_ROOT` / `ENDAXIS_HIDE_UI_GLOBAL_BUFF_CATALOG` 跳过。未宣称优化的全部真实资源双路等价已通过。

## M04：候选验证、发布与回滚

已追踪 rebuild 的阶段报告、第二轮独立生成失败、候选类型/运行覆盖、来源复核、完整发布 gate，以及 publisher 的预备、安装、逆序回滚。稳定说明见[候选验证与正式发布](../architecture/game-data-production.md#候选验证与正式发布)。

证据：`scripts/rebuildGameData.ts:74–106,817–861,928–991`；`src/compiler/publication/candidateTypeCheck.ts:17–64`、`candidateRuntimeOverlay.ts:18–85`、`candidateRuntimeServer.ts:23–59`、`gameDataCandidatePublisher.ts:148–242`。

- **D05（发布责任约束），非已证实缺陷：** 文件发布器信任调用方已完成语义/模拟/来源校验，它本身只验证文件事务条件。运行覆盖器也不是候选完整性校验器。新增入口不能绕过 rebuild 的前提；目前读取的正式 rebuild 在全部阶段 passed 且显式 publish 时才调用它。
- **原子性限制：** 现有实现有意逐文件安装并保留目录根，不提供并发读者看不到中间状态的保证，也不提供进程崩溃后的自动恢复日志。本次没有把 catch 回滚测试外推成断电安全。
- **验证：** candidate publisher、runtime overlay、type check、asset check、rebuild、combat rebuild 6 文件、50 项通过；包括先验证全部目标、安装中途失败恢复、文件/目录类型变化、候选缺失不读旧生成成员以及第二轮生成失败阻断发布。
- **未查范围：** 未实际发布整套原始资源，没有进行真实 Windows 文件锁、磁盘满、进程中断或回滚再次失败的系统实验；测试使用仓库自身隔离文件夹和故障替身。没有发现需要自动修改代码的新发布缺陷。

## M05：正式加载、项目覆盖与缓存换代

已追踪路由准备内置模块 → 稳定查询外壳 → 项目定义视图 → 页面实时查询 → Worker 数据包；检查了类别并发合并、失败任务移除、项目 origin 与真实套装依赖的区别，以及项目定义保存/撤销后的 clearCache 调用。稳定说明见[内置装载与项目定义视图](../architecture/game-data.md#内置装载与项目定义视图)。

证据：`src/data/projectGameDataRepository.ts:51–95,124–263`、`src/core/project/projectDefinitionLibrary.ts:578–663`、`src/application/simulation/scenarioSimulationGameData.ts:53–70,125–180`、`TimelineEditor.vue:1234–1262,1553–1564,1717–1720,5358–5365`。

### D06：页面联合查询遗漏项目全局效果

类型：在真实保存/打开/查询与数据捕获边界已复现的功能缺口；未做浏览器端到端。页面手写联合查询覆盖角色、武器、装备、套装，却遗漏项目 getGlobalEffect/getGlobalEffects；共享核心组合器包含它们。资产工作区确实可以保存项目全局效果，全局配置选项确实包含这些项目条目，路由传入的仍是内置基础仓库。

使用真实内置效果，经 WorkspaceAssetSession 和 saveProjectTemplateDefinition 创建项目，openProject 返回 true；执行从 SFC 提取的实际查询初始化表达式后，页面查询返回 null，Worker 数据捕获抛出缺失定义错误。换成共享核心组合器则解析和捕获成功。完整路径、无源码改动的命令及输出见[项目全局效果复现](project-global-effect-reproduction.md)。

影响是合法项目全局效果在页面模拟输入准备阶段被当作缺失定义，不是静默算出错误伤害。捕获会包含保存的禁用引用，所以只禁用该引用也不能自动消除查询缺口。最小方向是消除重复的项目查询规则，并测试真实页面所用视图；不能在捕获处用内置效果兜底冒充项目定义。此次未修改生产代码。

### 其他结论与限制

- 初始按需装载、类别扩充与 Worker 子仓库是三层寿命；clearCache 不等于从浏览器卸载所有已 import 的生成模块。
- 图缓存靠新图对象区分修订，Worker 包靠主动 revision 换代区分同 ID 定义变化；实际保存和历史恢复入口已有显式刷新，但新入口必须继续承担该责任。
- 未逐一核对全部生成定义数值；未模拟浏览器模块下载失败后的缓存策略、真实断网和内存驻留曲线。D06 的源代码链和边界实验不能替代后续浏览器验收。

- M05 验证：按需仓库、项目模板库、模拟数据包、openProject 和工作区资产会话 5 个原生文件、36 项通过；D06 文档中的命令已逐字提取重跑，输出与记录一致。通过的下层测试没有覆盖页面手写组合器，因此不抵消 D06 证据。

## M06：项目、编辑事务、草稿与存储

已追踪 parse/openProject 的结构与定义校验、项目/场景统一历史、编辑约束与替换边界、草稿复制/冻结/保存、文件读取代次与 revision、IndexedDB 自动保存与离页保护，以及 current/all 导出裁剪。稳定说明见[项目进入编辑与持久化](../architecture/editor.md#项目进入编辑与持久化)。

证据：`src/core/project/serialization.ts:55–129`、`definitionValidation.ts:22–52`、`src/application/editor/projectEditorSession.ts:59–83,108–219`、`scenarioEditorSession.ts:74–149`、`definitionDraftSession.ts:12–87`、`src/ui/timeline/projectFileSession.ts:12–160`、`src/data/browserProjectStorage.ts:10–66`。nativeBridge 只提供返回键/就绪通知，不是项目存储后端。

### D07：当前方案导出保留引用却丢弃全局效果定义

类型：已复现的导出载荷缺失。`selectProjectExportScope(project, 'current')` 返回的新 definitionLibrary 只包含角色/武器/装备/套装；合法场景中的项目全局 effectId 仍在，但对应定义没有被带入。完整 all 导出和原项目仍有该定义。

实际导出对话框支持 current/all，当前方案分享码和 PNG 内嵌项目码复用 current 路径。原生工作区创建 → 保存 → current 裁剪 → serialize 成功，保存内容可直接看见缺失的 globalEffects；重新 openProject 仍返回 true，因为当前定义引用校验覆盖构筑/敌人/机制，未检查全局效果引用。随后使用正确的共享项目查询组合器捕获数据也失败，排除了仅由 D06 页面查询器造成的可能。

完整命令、全量/当前对照及保留原项目的证据已补到[全局效果复现](project-global-effect-reproduction.md#d07当前方案导出丢失定义)。需要补当前方案依赖闭包及全局效果引用校验，优先于一般防回归整理；不能仅阻止页面查询报错而继续导出不完整的文件。本次未修生产代码，未做浏览器下载/PNG 重开端到端。

### 所有权与其他边界

- R1 是不均匀的保护：页面接入初始项目时先复制，图草稿/图发布有深冻结，但通用项目命令依然靠不可变约定。没有发现现有正常命令原地污染历史的具体路径。
- 项目/场景通知发生在 snapshot 更新之后，当前实现不隔离所有订阅者异常。这是已查明的失败语义，不把它等同于已经复现用户操作丢失；后续若要求观察层异常隔离，需要独立验收提交结果与历史一致性。
- 未检查真实浏览器配额、跨标签页数据库版本切换或机器中断时的持久性；自动保存单元路径不能作为用户已拥有外部备份的证明。

- M06 验证：项目结构/引用、项目/场景会话、编辑约束、草稿/不可变图、文件会话和 nativeBridge 9 个原生文件、56 项通过。D07 文档代码逐字提取重跑；current/all 载荷、重新打开和正确共享查询的对照输出与记录一致。

## M07：图与场景编译、构筑和机制

已追踪构筑解析、静态面板、共同图缓存、时间轴锚点/连续组、自定义施放与逐帧初始化、资源规则和机制贡献进入完整装配参数的路径。稳定文档为[场景编译](../architecture/scenario-compilation.md)，图资源详细规则仍由原动作图页维护。

证据：`src/core/compiler/resolveScenarioBuilds.ts:140–191`、`compileScenarioRuntimeAssembly.ts:317–570`、`compileScenarioTimeline.ts:494–577`、`compileActionGraph.ts:150–198,331–348`、`src/core/mechanics/mechanicCompiler.ts:158–237`、`mechanicRuntime.ts:55–90`。

- **D08，能力边界，非已证实缺陷：** 机制贡献类型和通用安装工具支持事件形式，但正式场景编译明确拒绝它。检索当前生产调用链只见核心公共出口导出通用工具，没有页面/应用调用者；不能凭单元测试或 export 认定产品已支持事件型机制。
- **所有权核对：** 运行环境只补实体端口，编译身份与技能程序优先；未来输入计划与已装配状态分离。连续组只有锚点/成员，不是预先执行的技能序列。图编译目录可延迟补节点，但不保存动作运行进度。
- **验证：** 图校验/编译、构筑/面板、时间轴/完整编译、全局效果与机制编译/工具 9 个原生文件、101 项通过。未引入外部验证运行器。
- **未查范围：** 未逐项证明所有养成、装备/动作参数组合及原生机制数值；任意自定义 Adapter 的行为不视作可信。后续 M08–M16 检查装配后状态、执行与恢复，不把编译阶段通过等同于这些路径通过。

## M08–M09：战斗装配、恢复、时间与随机

已沿应用调用的 Assembly → Session → 保存/候选恢复路径核对数据图、程序目录、历史、共享引用与帧管线；继续追踪时间域仲裁、曲线目录和随机配置/取样状态。稳定说明补入[切面](../architecture/checkpoints.md#装配根与受控会话的边界)、[时间](../architecture/combat.md#时间模块的状态与程序)、[随机](../architecture/randomness.md#模块所有权与扩展边界)。

证据：`combatRuntimeSession.ts:75–216`、`combatRuntimeAssembly.ts:810–851,1034–1391,2457–2510`、`restoration/combatRuntimeRestorePreparation.ts:44–152,292–390`、`combatRuntimeRestoreFoundation.ts:97–175`、`combatFramePipeline.ts:42–103`、`time/timeDilationRuntime.ts:21–42,293–397`、`random/simulationRandom.ts:35–98,104–174`。

- **D09，接口约束，非新缺陷：** Assembly 公布的是活动状态，Session 才提供复制读口；步进失败进入 faulted，不提供自动账本回滚。候选恢复不触碰旧分支，成功才换代。不能把恢复的提交保障宣传成所有游戏动作的事务保障。
- **D10，适配风险，未发现产品错误：** 内置随机配置/状态随图恢复，但直接注入的有限样本源游标不在图里。正式应用使用内置可恢复模式；任意自定义回调的外部状态不能由 Session 自动回退。曲线目录同样是共享程序，数据切面仅保存编号。
- **验证：** 数据层导入守卫、会话/装配/帧驱动、基础/引用/Buff 预检，以及时间和随机目录共 17 个原生文件、226 项通过。覆盖分支 A/B/A、拒绝候选保留原图/历史、首帧、动态施放、冷却别名、程序身份和时间/随机状态；这不等于遍历全部恢复组合。
- **未查范围：** 此组未逐一审完每个宿主恢复器，Buff、实体、投射物与订阅关系继续在 M12–M15 核查。未注入任意外部端口副作用、长时间整数极限或真实内存压力；未声称对第三方回调实现了隔离沙箱。

## M10：资源、生命与属性账本

已核查资源初始化/恢复别名、支付与返还/自然恢复、动态回能许可及限制句柄、资源动作结束、生命/失衡更新后通知、八槽属性/来源过滤和对象身份修正。稳定说明见[资源、生命和属性账本](../architecture/combat.md#资源生命和属性账本)。

证据：`resources/combatResources.ts:132–190`、`combatResourceExecution.ts:24–204,211–284`、`skillResourceOperationExecutor.ts:51–75,180–220`、`combatVitalsExecution.ts:23–129`、`attributes/combatAttributeExecution.ts:50–157`、`combatAttributeEntities.ts:24–60`。正式场景编译单费用槽保障见 `compiler/compileSkillProgram.ts:64–82`。

- 没有新确认的产品缺陷。资源 snapshot 与可恢复账本不等价；属性、SP 修正和宿主之间靠对象身份解除关系，扩展时若独立复制修正数组会破坏结束清理。
- 特别检查了低层 pay 接收多条费用但不聚合相同资源的疑点：正式技能编译已经拒绝多费用槽，已有专门拒绝测试，因此不能直接报告为现有技能支付 bug。低层接口不构成对任意手工参数的产品承诺。
- 验证：资源与属性 12 个原生文件、94 项通过。后续 Buff/技能模块继续核对句柄宿主与结束/恢复接线。
- 未查范围：没有逐项对照所有原生属性上限/舍入规则，也未证明任意外部动态 resolver 无异常。此组不重复把同步通知失败语义报成新缺陷。

## M11–M12：动作图、时间轴、技能与输入

已追踪输入协调 → 能力系统 → 技能 → 时间轴 → 图控制流 → 领域操作；核对同步 End/Jump、分支/重复/目标作用域、黑板共享、执行结果与诊断、动态登记、延迟请求、共享冷却与换槽预检。稳定文档见[执行模块如何分工](../architecture/skill-operations.md#执行模块如何分工)。

证据：`actions/actionSequenceExecution.ts:29–101`、`actionGraphExecution.ts:112–145,609–650,689–730`、`combatActionEventListener.ts:42–113`、`timeline/timelineActionExecution.ts:61–225`、`skills/skillExecution.ts:13–119`、`skillRuntime.ts:679–803`、`abilities/abilitySystemRuntime.ts:1091–1277`、`abilitySystemExecution.ts:54–91`、`runtime/playerSkillInputCoordination.ts:55–78,214–218`。

- 没有新确认的产品缺陷。先前修好的 executed/rejected、换槽双侧预检、冷却共同工厂仍在实际路径；未重复列为待整改。
- **D11，维护约束：** 动作状态先写后通知、同帧按源配置顺序、CurrentSkill 先切换再结束旧技能、延迟请求先清再执行，分别服务同步重入和原生生命周期。抽出统一调度/事务模板可能破坏时序，不能只因类较大建议拆分。
- 验证：actions/timeline/skills、输入运行时及技能/能力恢复 41 个原生文件、425 项通过；另单独运行实际 `abilitySystemRuntime.test.ts`，57 项通过。合计 42 文件、482 项。
- 未查范围：未枚举所有动作组合及全部相互递归生命周期；目标群体仍受零空间模型约束。领域后果继续在 M13–M16 检查，不能用控制流测试替代伤害/Buff 语义验收。

## M13–M14：事件、宿主、Buff 与标签

已核查四阶段事件快照/注销/嵌套上下文、原生与手工事件适配、被动/装备/养成宿主清理，以及普通/全局 Buff 的叠层、修正、周期、结束/回收、父子关系和标签计数。稳定说明见[事件、Buff 与宿主生命周期](../architecture/events-and-buffs.md)。

证据：`events/abilityEventExecution.ts:7–71`、`abilityEventDispatcher.ts:146–192`、`abilityEventResponseContext.ts:54–86`、`abilities/abilityEventHostLifecycle.ts:12–29,89–110,167–207`、`buffs/buffLifecycleExecution.ts:28–105,124–175`、`combatBuffs.ts:656–674,1945–1981`、`globalBuffRuntime.ts:239–319`、`restoration/combatBuffRestoration.ts:157–201`、`tags/gameplayTags.ts:15–46`。

- 无新确认的产品缺陷；既有事件写入范围与嵌套 finally 恢复仍有效。事件目录只是登记数据，宿主重建函数，二者不能互相代替。
- **D12，维护约束：** Buff 结束、释放、回收和 Enable/Disable 具有不同回调时机与引用有效性；全局父实例也不能退化成同名组。文档保留这些区别，没有为追求统一生命周期而掩盖耦合。
- 验证：事件/Buff/标签、四类 Ability 宿主及对应恢复共 41 个原生文件、574 项通过，包含嵌套黑板、订阅阶段、失败清理与回收引用。
- 未查范围：未证明所有游戏版本事件均投影完整，未穷举任意回调在每个清理点连续抛错的组合；当前游戏异常仍采用会话失败封闭，不声称所有清理都是事务。

## M15–M16：实体、投射物与数值/状态后果

已追踪共享编号、实体死亡/延迟释放、子技能/Buff/被动清理、投射物四阶段与回调惰性宿主、恢复关系，以及实际标准环境接入的伤害/治疗/失衡、附着、反应、通用状态和标记。稳定文档见[实体、伤害与状态后果](../architecture/combat-effects.md)。

证据：`abilities/logicalAbilityEntityRuntime.ts:437–568`、`projectileLifecycleExecution.ts:103–216`、`projectileCallbackRuntime.ts:45–139`、`runtime/combatRuntimeAssembly.ts:3124–3155`、`damage/playerDamageOperationExecutor.ts:250–334,531–689`、`healthDamage.ts:185–239`、`heal/healOperationExecutor.ts:110–150`、`infliction/elementalInflictionBuffAdapter.ts:87–141`、`status/timedMarkers.ts:91–145`。

- 未发现新确认产品缺陷。既有来源判别联合仍正确区分执行宿主和继承施法；没有重新列出此前已修的身份/事件字段问题。
- **D13，接口约束：** 部分运行时查询会惰性移除过期反应或 sweep 标记并通知；这些不是任意 UI 可以调用的纯查询口。当前发布/复制边界保留隔离，未证明现有 UI 违规推进战斗。
- M15 验证：逻辑实体、子技能、回调宿主、投射物/编号及恢复 11 个原生文件、127 项通过。M16 验证：damage/heal/infliction/status 与标准环境/兼容/技能集成 36 个原生文件、361 项通过。
- 未查范围：未逐个数值对照所有生成技能、免伤链及原生反汇编；未扩展空间/多敌人能力，也未把内置单目标通过当作真实碰撞验收。异常回调的任意组合和长期对象增长需专项实验。

## M17：回执、投影与来源分析

已核查追加时复制/冻结、段共享、固定视图、分支游标、传输序号恢复；沿变化点 → 曲线/诊断、来源索引 → 直接贡献追踪只读消费者。稳定说明见[回执写端、历史视图与投影入口](../architecture/results.md#回执写端历史视图与投影入口)。

证据：`receipt/combatReceiptHistory.ts:29–96,107–173,182–232`、`projection/resourceCurves.ts:42–138`、`skillDiagnosticReducer.ts:27–85`、`combatObjectOrigins.ts` 的出生/历史截止查询、`damageContribution.ts:17–80` 的吸收/非正基线退回规则。

- 无新确认缺陷。H2 明确发布对象保护和 Worker 重建仍生效，不扩大为所有 readonly 字段深冻结；历史冻结依赖现有标量协议，不能宣称任意用户 JSON 都经过完备验证。
- 来源索引与贡献不是同一目的：前者追事实关系，后者只分配已支持直接修正。未归因和退回自身保留诊断，不能从缺少贡献推断该 Buff 不影响战斗。
- 验证：receipt 与 projection 31 个原生文件、143 项通过，覆盖固定历史/游标、同帧顺序、曲线连续性、历史截止、同名实例和贡献金额守恒。
- 未查范围：未做来源图真实浏览器布局/主题/交互验收，未证明所有当前生成效果都能拆分贡献；投影测试不是原生公式验证。

## M18：应用模拟、输入排程、线程与发布

已追踪真实工厂/页面调用、全量/增量/继承选择、排程前缀保存、缓存清理、Worker single-active/latest-pending、取消/revision/dispose、结果重建、性能观察隔离和页面 epoch 发布。稳定文档见[模拟服务](../architecture/simulation-services.md)。

证据：`scenarioSimulationService.ts:321–355,447–550`、`incrementalScenarioSimulation.ts:28–56,91–165,192–219`、`inheritedScenarioSimulation.ts:27–135`、`workerScenarioSimulationService.ts:66–86,118–197`、`scenarioSimulation.worker.ts:17–65`、`src/ui/timeline/useScenarioSimulation.ts:96–175`。

- H1/H2 原生回归仍通过。没有将性能观察隔离推广成游戏事件异常隔离，也未声称整个结果对象深冻结。
- UI 确实允许同方案旧落点完整结果先发布并标 stale；已检查 epoch、方案身份与发布序号拒绝跨项目/倒序覆盖。不能把旧落点发布本身误报成版本 bug。
- 验证：application/simulation 全目录 49 个原生文件、389 项通过；页面发布 1 文件、24 项通过。包含真实生成定义集成、全量/增量/继承、协议及替身 Worker；未运行真实浏览器 E2E。

### D14：Worker 启动失败的响应边界

类型：入口错误响应的结构风险；非法包实验已验证，合法用户输入可达性未证实。数据仓库恢复/服务创建在 handler 的 try/catch 外；下列重复公共来源包使真实入口返回 rejected Promise、发送 0 个响应。客户端监听 message/error/messageerror，未证明浏览器对 async handler 未处理拒绝会给客户端哪个事件，因此**不声称用户页面永久挂起**。

在历史审查基线 `8bcc46b9` 的仓库根目录执行，仅打包原模块到内存，不修改源码。当前修复版本会发送带请求 ID 的错误响应（`responses: 1`），不再输出 handlerRejected；修复与恢复回归见[整改进度](architecture-remediation.md)：

```sh
node --input-type=module <<'NODE'
import { build } from 'esbuild';
import vm from 'node:vm';
const compiled = await build({
  entryPoints: ['src/application/simulation/scenarioSimulation.worker.ts'],
  bundle: true, platform: 'node', format: 'cjs', write: false, logLevel: 'silent',
});
const sent = [];
const self = { postMessage: message => sent.push(message) };
vm.runInNewContext(compiled.outputFiles[0].text, {
  self, console, performance, setTimeout, clearTimeout, structuredClone,
  Map, Set, WeakMap, DOMException,
});
try {
  await self.onmessage({ data: {
    id: 1, revision: 0, scenario: {}, endFrame: 0,
    gameData: {
      revision: 'repro', selectionKey: 'repro',
      commonDefinitionSources: [{ id: 'duplicate' }, { id: 'duplicate' }],
      operators: [], weapons: [], gears: [], gearSets: [], enemies: [],
      mechanics: [], consumables: [], globalEffects: [],
    },
  } });
} catch (error) { console.log('handlerRejected:', error.message); }
console.log('responses:', sent.length);
NODE
```

实际输出：`handlerRejected: duplicate common definition source 'duplicate'`；`responses: 0`。这是直接调用真实 handler 的隔离实验，不是实际 Worker 浏览器调度。正式 capture 从已装配仓库取数据，尚未找到它产生此重复来源包的路径。

最小建议：将服务初始化也纳入请求错误响应边界，增加真实入口初始化失败和后续请求测试；再用浏览器 Worker 验证错误传播。审查时优先级低于 D06/D07 已证实功能缺口；后续已按[整改进度](architecture-remediation.md)处理。

## M19：旧格式转换、重排与审计工具

已追踪来源复制/身份与单位归一化、逐方案尽力保留、迁移/资源/结构校验、递归展开、preserve/repair、候选切面与释放，以及 CLI 新目录独占写入、只读最终模拟摘要。稳定说明补入[工具模块边界](../../tools/legacy-timeline/README.md#模块边界与所有权)，编辑器和切面文档已连接。

证据：`legacyTimeline/convert.ts:91–156,195–320`、`projectConversion.ts:549–579`、`checkpointRetiming.ts:24–108`、`heuristicRetiming.ts:680–798` 及结束段、`preservedInputs.ts:6–58`、`tools/legacy-timeline/cli.ts:29–45`、`auditSimulation.ts:22–66`。

- **D15，验证缺口而非已确认错误：** 转换器最后进行结构解析，没有独立最终整轴模拟门禁；候选试算后还调整切人/闪避。报告为 converted/converted-with-issues 不等于最终整轴无诊断。稳定文档已将“最终完整重跑”明确为额外验收，避免误读为当前自动保证。
- CLI 用新目录和独占文件保留源/已有输出，文件逐个写入并非目录级原子发布；写盘失败可能留下 report 或部分新目录。没有发现覆盖原存档路径。
- 验证：8 个原生文件、75 项通过，默认跳过 1 项需显式 GC 的候选释放实验；工具独立类型检查通过。GC 补跑结果见下方最终验证记录。
- 未查范围：未转换用户私人旧轴、未访问整批线上旧存档，映射样本不能证明所有历史变体；智能重排可能改变 Buff 覆盖，不承诺保持旧版总伤。

## 本轮结论与整改顺序

本轮已为 M01–M19 的实际关键路径补齐/扩展稳定架构文档，并将检查范围和未查边界逐项记录。本审查阶段的代码证据以顶部基线为准，当时的模块提交只改文档；后续实现变更见整改进度。阶段内重复运行的测试可能重叠，不能将各段数量相加作为唯一用例总数。

| 顺序 | 项目                         | 证据等级与影响                                                         | 最小整改与验收                                                                                             |
| ---- | ---------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1    | D07 当前方案导出缺定义       | 原生边界已复现；保存的新载荷保留 effectId 却缺项目定义，重新打开仍放行 | 补导出全局效果依赖与打开引用校验；current/all/分享码/PNG载荷对照，重开后用正式仓库成功模拟；不得修改原项目 |
| 2    | D06 页面联合查询遗漏全局效果 | 真实保存/路由链与实际 SFC 表达式已复现；模拟输入捕获失败               | 用唯一共享组合规则覆盖页面；项目新 ID、同 ID 覆盖、禁用引用、保存/撤销后数据换代；补页面集成测试           |
| 3    | D04 投影分层守卫失效         | 四个旧入口不存在而测试仍通过；独立遍历未发现当前生产违规               | 更新路径并断言入口存在、增加故意违规负例；测试必须对错误进口失败                                           |
| 4    | D14 Worker 初始化错误响应    | 非法包 handler 实验；未证明合法输入可达或浏览器传播                    | 统一请求错误边界并测试初始化拒绝/后续请求；再验证真实 Worker 行为                                          |
| 5    | D15 转换后的最终验收         | 源码确认缺独立整轴门禁；没有已复现错误输出                             | 明确报告契约；按产品选择自动完整复跑或显式审计步骤，覆盖最终切人/闪避调整                                  |

D01–D03、D05、D08–D13 是已查明的所有权/能力/维护约束或适配风险，不是一串待修 bug。保留文档和针对性回归即可，没有证据支持仅按类大小拆分装配根、统一所有生命周期或引入第二套状态框架。H1/H2 已完成修复并分别通过当时完整 Linux/Windows CI，不重复列为待办。

下一轮若进入实现，优先一起处理 D07/D06 的全局效果端到端闭合，再补 D04 守卫；本轮未自动修改这些代码。剩余专项验证包括真实浏览器 Worker/存储故障、原始资源同版本一致性、任意嵌套异常与长期内存、全部原生数值/空间语义。这些不会因文档清楚或测试通过自动变成已验证。

### 最终验证记录

- GC 专项补跑：`npx vitest run src/application/legacyTimeline/checkpointRetiming.test.ts --pool=forks --execArgv=--expose-gc --maxWorkers=1`，4 项通过，原先跳过项实际执行。本次持有候选相对基线增加约 10.18 MB，dispose 后约 0.26 MB；这是该固定样本的引用释放证据，不代表所有浏览器长期内存形态。
- 本轮生产代码保持 H2 基线不变；每组文档执行格式化和 diff 检查，复现代码只读取原模块。模块测试范围和未覆盖环境见各组记录。
- 最终文档提交对应的完整 CI 另在该提交的 GitHub Actions 记录核对；不能拿前一文档提交或被新提交取消的运行替代最终 SHA 结果。
