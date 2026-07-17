# Endaxis 文档库

本文档库以当前 `main` 分支代码为基准。主目录记录已经存在于当前版本的实现；尚未合入的设计整理放在 `design/`；历史分析和过期版本对比放在 `archive/`。

## 架构设计

| 文档                                      | 内容                                                       |
| ----------------------------------------- | ---------------------------------------------------------- |
| [架构总览](architecture/overview.md)      | 当前 Vue/Pinia/Simulation 四层架构、目录结构、关键技术决策 |
| [数据流转全景](architecture/data-flow.md) | 技能库派生、配置收集、场景编译、模拟投影、渲染链路         |

## 核心系统

| 文档                                                                | 内容                                                                             |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [数据层](core-systems/data-layer.md)                                | 5 类数据实体、效果类型系统、触发条件、数值缩放                                   |
| [时间轴编译](core-systems/timeline-compilation.md)                  | 游戏时间→现实时间转换、时停补偿、轨道中断检测                                    |
| [模拟引擎](core-systems/simulation-engine.md)                       | 离散事件模拟架构、事件类型、GameState 状态树、Handler 详解                       |
| [伤害计算](core-systems/damage-calculation.md)                      | 完整 15 乘区公式、ATK 属性计算、LMDI 贡献分解、反应伤害                          |
| [效果与反应系统](core-systems/effect-system.md)                     | 四元素附着/爆发/反应、五类物理异常、效果生命周期                                 |
| [Effect 四分类](core-systems/effect-classification.md)              | 段命中固定、条件触发、属性加成、patchHit 注入 — 四类效果的管道与运行时行为       |
| [连携窗口架构](core-systems/combo-window.md)                        | comboWindow 数据模型、收集、冷却判断、投影、渲染、精准衔接内嵌                   |
| [前置条件警告](core-systems/requisite-warning.md)                   | 技能不满足条件时的红色三角标记，三类技能四项检查                                 |
| [触发器系统](core-systems/trigger-registry.md)                      | 事件总线架构、10 种事件类型、patchHit vs trigger 对比、与 patchCombatSkills 分工 |
| [国际化系统](core-systems/i18n-system.md)                           | 双层 i18n 架构、语言检测、gameText 查询层、设计缺陷分析                          |
| [collect.ts 深度解析](core-systems/collect-analysis.md)             | 整体流程、8 个不一致点 + 1 个机制确认（name 语义分裂、id 三级来源等）            |
| [CollectedEffect 字段详解](core-systems/collected-effect-fields.md) | 原始数据 vs 已解析数据对比、18 个共有字段 + 15 种 kind 专属字段                  |

## 前端

| 文档                                   | 内容                                 |
| -------------------------------------- | ------------------------------------ |
| [UI 架构](frontend/ui-architecture.md) | 视图结构、Pinia 状态管理、移动端适配 |

## 开发指南

| 文档                             | 内容                                             |
| -------------------------------- | ------------------------------------------------ |
| [开发指南](development/guide.md) | 环境要求、添加数据步骤、工具函数、编译管道、测试 |
| [AKEDB 干员富文本与战斗术语转换](development/ake-rich-text-export.md) | 从 AKEDB 导出干员富文本、战斗术语、图标映射与验证流程 |

## 参考

| 文档                                     | 内容                                              |
| ---------------------------------------- | ------------------------------------------------- |
| [干员图鉴](reference/operators.md)       | 28 名干员完整列表、按职业分类、属性成长、技能系统 |
| [武器图鉴](reference/weapons.md)         | 72 把武器、★6 武器一览、武器技前缀体系            |
| [装备与套装图鉴](reference/equipment.md) | 218 件装备、23 个套装（官方中文名）、精锻系统     |
| [术语表](reference/glossary.md)          | 70+ 条中英对照、6 种职业、武器技前缀              |
| [使用手册](reference/user-manual.md)     | 界面指南、方案管理、导入导出、已知局限            |

## 设计提案

| 文档                                                                | 内容                                            |
| ------------------------------------------------------------------- | ----------------------------------------------- |
| [动作身份字段与显示名称整理](design/action-identity-and-display.md) | 尚未合入当前 main 的动作身份/显示名称规范化方案 |

## 历史归档

| 文档                                                                | 内容                                                 |
| ------------------------------------------------------------------- | ---------------------------------------------------- |
| [9b92b0d7 前后架构版本对比](archive/version-comparison-9b92b0d7.md) | 历史版本差异分析，保留作背景资料，不代表当前最新结构 |
