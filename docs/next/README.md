# Endaxis Next 文档库

本目录是 Endaxis Next 的长期架构文档入口，面向已经接触过旧版 Endaxis、但尚未系统了解新版实现的开发者。

Next 不是对旧模拟器的局部重构，而是在 `src/next` 中并行建设的新项目模型、游戏数据层、编译器、战斗运行时、投影系统、应用层和编辑器。旧版 `/timeline` 仍是当前稳定入口；新版页面位于 `/next/timeline`，在功能和验证达到切换条件前不会直接替换旧入口。

## 推荐阅读顺序

1. [为什么要建设 Next](./01-introduction.md)：新版是什么、解决哪些旧问题、优势和边界是什么。
2. [分层架构](./02-layered-architecture.md)：各层职责、依赖方向和代码目录。
3. [端到端数据流](./03-end-to-end-data-flow.md)：一个项目如何从加载、编辑一路走到模拟和 UI。
4. [核心数据模型](./04-core-models.md)：存档、技能模板、编译产物、运行时状态和回执的区别。
5. [战斗运行时](./05-combat-runtime.md)：帧循环、技能、资源、Buff、状态、伤害、附着和能力预检。
6. [应用层与 UI](./06-application-and-ui.md)：命令、历史、ViewModel、i18n、主题和旧 UI 兼容策略。
7. [数据生成与证据](./07-data-generation-and-evidence.md)：解包/反编译证据如何进入严格 DSL。
8. [开发与维护规范](./08-development-and-maintenance.md)：新增功能时应放在哪里、如何测试和更新文档。
9. [当前状态与路线图](./09-status-and-roadmap.md)：已经完成什么、尚未闭环什么、建设顺序。
10. [专题文档索引](./10-topic-index.md)：伤害、装备、活动机制、双形态干员等深入材料。
11. [技能全生命周期与编辑语义](./11-skill-lifecycle.md)：技能模板、技能块、自定义、构筑修正、编译和运行如何衔接。
12. [SkillDefinition 数据结构蓝图](./12-skill-definition-blueprint.md)：完整组件、条件、执行顺序、校验和编辑器契约。
13. [时间冻结与时间投影](./13-time-freeze-and-projection.md)：原生时间语义、旧版表现参考及 Next 各层职责。
14. [武器与装备定义结构蓝图](./14-equipment-definition-blueprint.md)：武器、装备、套装的定义、实例、编译贡献和运行时安装契约。
15. [公共协议、转换链路与解释职责审计](./15-contract-and-conversion-ownership.md)：统一词表、原始数据投影、Action/Condition 所有权和迁移门禁。

只想快速定位代码时，可先看[分层架构](./02-layered-architecture.md)和[端到端数据流](./03-end-to-end-data-flow.md)。准备修改战斗规则时，必须继续阅读[战斗运行时](./05-combat-runtime.md)和对应专题证据。

## 文档状态约定

本文档库使用以下状态：

- **已接入**：存在生产调用链和针对性测试，可以被当前 Next 入口实际使用。
- **部分接入**：模型或模块已存在，但数据覆盖、环境装配或用户流程尚未完整闭环。
- **设计中**：已有明确边界或研究结论，尚未形成可依赖的生产实现。
- **旧版**：只描述现有 `/timeline` 行为，用于兼容和迁移参考，不是 Next 的事实来源。

“存在文件”不等于“功能已接入”。判断功能状态应同时核对定义、编译、执行和 UI 四个环节。

## 维护规则

- 修改跨层职责、项目格式、核心数据流或正式入口时，同一提交必须更新本目录对应文档。
- 新增战斗机制时，先更新专题证据；行为闭环后再更新主干文档和状态表。
- 阶段性覆盖率、原始 ID 和反编译细节放在 `docs/research`，不堆进主干架构说明。
- 具体迁移任务和短期计划可以变化；稳定职责、依赖方向和数据所有权不得在代码中悄悄变化。
- 每次整理应检查本目录中的文件链接、关键入口和“已接入/部分接入”状态是否仍与代码一致。

## 相关入口

- Next 代码：`src/next`
- Next 页面：`/next/timeline`
- 游戏数据编译器：`tools/game-data-compiler`
- 研究证据：`docs/research`
- 旧版与专项架构材料：`docs/architecture`
