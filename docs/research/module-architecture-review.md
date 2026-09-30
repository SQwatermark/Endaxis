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
| M03  | 离线动作投影、引用、领域组装与优化：`tools/game-data-compiler/src/compiler`、`tools/game-data-compiler/src/domains` | 89 + 39 个 TS 文件（含 M04）      | [游戏数据](../architecture/game-data.md)、[动作图](../architecture/action-graphs.md)                            | 待查         |
| M04  | 候选构建、验证、发布和回滚：编译器 `build/publication` 与脚本                                                       | 脚本 52 个 TS 文件                | 工具 README、[游戏数据](../architecture/game-data.md)                                                           | 待查         |
| M05  | 正式数据登记、按需加载和项目覆盖：`src/data`                                                                        | 435 个 TS 文件，主要为生成定义    | [游戏数据](../architecture/game-data.md)                                                                        | 待查         |
| M06  | 项目格式、编辑事务、草稿与存储：`core/project`、`application/editor`、存储适配                                      | 11 + 16 个 TS 文件及存储适配      | [编辑器](../architecture/editor.md)                                                                             | 待查         |
| M07  | 图校验、场景编译、构筑和机制：`core/action-graph`、`compiler`、`mechanics`                                          | 3 + 25 + 4 个 TS 文件             | [动作图](../architecture/action-graphs.md)、[游戏数据](../architecture/game-data.md)                            | 待查         |
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
- M01/M02 的关键入口、所有权和失败边界已核查并补充架构说明；接下来检查 M03 的动作投影、引用闭包和优化，再到候选发布与运行时装载。
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
