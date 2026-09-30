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
| M01  | 共享契约、定义查询协议与校验：`packages/game-data-contract/src`、`src/core/game-data`                               | 17 + 25 个 TS 文件                | [游戏数据](../architecture/game-data.md)                                                                        | 待查         |
| M02  | 离线来源读取、缓存、版本与来源追踪：`tools/game-data-compiler/src/source`                                           | 107 个 TS 文件                    | [游戏数据](../architecture/game-data.md)、工具 README                                                           | 待查         |
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
- 下一组：M01–M05 数据供应链。先确认契约与查询接口，再追踪来源、投影、发布及运行时加载；不会把离线编译器与场景编译器混成一个模块。
- 新发现只给出证据、风险和最小整改建议；此次后续模块检查不自动修改生产逻辑。
