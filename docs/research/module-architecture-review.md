# 逐模块架构审查

本文记录核心架构首轮梳理之后的逐模块检查，帮助区分“已经能说清楚的职责”和“仍需验证的实现”。稳定的模块说明写入对应架构主题页；本页只保留范围、进度、证据和问题，不用测试数量替代架构判断。

基线：`8bcc46b97e03dedd7fb84480dbee7c0fcda43d93`。H1/H2 已在该基线修复，两个修复提交的 Linux/Windows CI 均通过。背景见[首轮审查](core-architecture-audit.md)。

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

| 编号 | 责任模块与主要目录                                                                                                  | 首轮库存                          | 对应稳定文档                                                                                                    | 深入检查状态 |
| ---- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------ |
| M01  | 共享契约、定义查询协议与校验：`packages/game-data-contract/src`、`src/core/game-data`                               | 17 + 25 个 TS 文件                | [游戏数据](../architecture/game-data.md)                                                                        | 关键路径已查 |
| M02  | 离线来源读取、缓存、版本与来源追踪：`tools/game-data-compiler/src/source`                                           | 107 个 TS 文件                    | [游戏数据](../architecture/game-data.md)、工具 README                                                           | 关键路径已查 |
| M03  | 离线动作投影、引用、领域组装与优化：`tools/game-data-compiler/src/compiler`、`tools/game-data-compiler/src/domains` | 89 + 39 个 TS 文件（含 M04）      | [游戏数据](../architecture/game-data.md)、[动作图](../architecture/action-graphs.md)                            | 关键路径已查 |
| M04  | 候选构建、验证、发布和回滚：编译器 `build/publication` 与脚本                                                       | 脚本 52 个 TS 文件                | 工具 README、[游戏数据](../architecture/game-data.md)                                                           | 关键路径已查 |
| M05  | 正式数据登记、按需加载和项目覆盖：`src/data`                                                                        | 435 个 TS 文件，主要为生成定义    | [游戏数据](../architecture/game-data.md)                                                                        | 关键路径已查 |
| M06  | 项目格式、编辑事务、草稿与存储：`core/project`、`application/editor`、`application/openProject`、存储适配           | 11 + 16 个 TS 文件及存储适配      | [编辑器](../architecture/editor.md)                                                                             | 关键路径已查 |
| M07  | 图校验、场景编译、构筑和机制：`core/action-graph`、`compiler`、`mechanics`                                          | 3 + 25 + 4 个 TS 文件             | [动作图](../architecture/action-graphs.md)、[游戏数据](../architecture/game-data.md)                            | 关键路径已查 |
| M08  | 战斗数据图、装配及恢复：`combat/state`、`combat/runtime`                                                            | 6 + 34 个 TS 文件（含恢复与输入） | [战斗](../architecture/combat.md)、[切面](../architecture/checkpoints.md)                                       | 待查         |
| M09  | 时钟、变速、随机：`combat/time`、`combat/random`                                                                    | 5 + 3 个 TS 文件                  | [战斗](../architecture/combat.md)、[随机](../architecture/randomness.md)                                        | 待查         |
| M10  | 资源和属性账本：`combat/resources`、`combat/attributes`                                                             | 11 + 4 个 TS 文件                 | [战斗](../architecture/combat.md)                                                                               | 待查         |
| M11  | 动作解释与时间线：`combat/actions`、`combat/timeline`                                                               | 13 + 3 个 TS 文件                 | [技能操作](../architecture/skill-operations.md)、[动作图](../architecture/action-graphs.md)                     | 待查         |
| M12  | 技能、能力、冷却和输入：`combat/skills`、`combat/abilities`、输入协调                                               | 33 + 21 个 TS 文件（含 M15）      | [战斗](../architecture/combat.md)、[技能操作](../architecture/skill-operations.md)                              | 待查         |
| M13  | 事件分发、身份和宿主订阅：`combat/events` 与宿主生命周期                                                            | 12 个 TS 文件及能力宿主           | [技能操作](../architecture/skill-operations.md)、[切面](../architecture/checkpoints.md)                         | 待查         |
| M14  | Buff、全局 Buff 与标签：`combat/buffs`、`combat/tags`                                                               | 17 + 2 个 TS 文件                 | [战斗](../architecture/combat.md)、[技能操作](../architecture/skill-operations.md)                              | 待查         |
| M15  | 能力实体、投射物及延迟后果：abilities 中对应目录与装配 hooks                                                        | 库存计入 M08/M12                  | [战斗](../architecture/combat.md)、[切面](../architecture/checkpoints.md)                                       | 待查         |
| M16  | 伤害、治疗、附着与状态：`combat/damage/heal/infliction/status`                                                      | 21 + 3 + 9 + 7 个 TS 文件         | [战斗](../architecture/combat.md)、[结果](../architecture/results.md)                                           | 待查         |
| M17  | 回执、投影与来源：`combat/receipt`、`core/projection`                                                               | 4 + 30 个 TS 文件                 | [结果](../architecture/results.md)                                                                              | 待查         |
| M18  | 场景服务、输入排程、增量/继承、线程与发布：`application/simulation`、`core/pipeline`                                | 17 + 1 个 TS 文件                 | [编辑器](../architecture/editor.md)、[切面](../architecture/checkpoints.md)、[结果](../architecture/results.md) | 待查         |
| M19  | 旧方案格式转换与重排：`application/legacyTimeline`、`tools/legacy-timeline`                                         | 9 + 3 个 TS 文件                  | [编辑器](../architecture/editor.md)、工具 README                                                                | 待查         |

库存统计来自基线目录，排除常规测试、类型断言、性能测试和明确测试支持目录；数字仅帮助理解范围，不表示已经阅读相同数量文件。UI 手势、样式、设计系统、图表安装/纯展示辅助和发布托管不属于本次核心模块的独立审查项，只在输入/输出边界需要时读取。

## 当前进度

- 库存和检查顺序已记录。
- M01–M07 关键路径已核查。待整改的重要项为 D07 当前方案导出缺失定义、D06 页面项目效果查询遗漏、D04 测试守卫盲区；均未自动修代码。下一项 M08 战斗数据图、装配及恢复，随后按清单进入战斗内部。
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
