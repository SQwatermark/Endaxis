# Endaxis 全局交接文档

这套文档面向**完全没有参与过本项目、不了解此前对话，也不熟悉相关工具链的 AI 或开发者**。它不仅介绍 Endaxis，还说明项目如何从《明日方舟：终末地》的静态数据、游戏资源和运行时代码中取得证据，以及这些证据怎样进入 C# 行为规格、数据生成器和 Endaxis Next。

这里记录的是可复核的工作背景、项目边界、设计决策、当前状态和操作入口，不记录不可验证的思维过程。遇到文档和代码冲突时，应以同版本原始数据、运行时证据和当前代码测试为准，并及时修订文档。

## 推荐阅读顺序

1. [背景、目标与历史](./01-background-and-goals.md)：项目为何存在，旧版 Endaxis 有什么问题，Next 要交付什么。
2. [项目与工具总览](./02-projects-and-tools.md)：AKEDatabase、VFS 浏览器、AnimeStudio、IL2CPP Dumper、C# Combat Spec 等分别做什么。
3. [证据链与研究方法](./03-evidence-and-research-method.md)：一项游戏规则如何被发现、验证、复刻并进入生产代码。
4. [战斗系统研究结论](./04-combat-system-findings.md)：当前已经串起的原生战斗架构、执行顺序、资源、技能、Buff 与伤害模型。
5. [Endaxis Next 架构](./05-endaxis-next-architecture.md)：新版代码分层、领域模型、编译与模拟流水线、项目格式、UI 边界。
6. [当前状态与路线图](./06-current-state-and-roadmap.md)：当前分支、近期提交、已完成能力、AKEDB 数据情况和后续优先级。
7. [操作与恢复手册](./07-operations-playbook.md)：仓库路径、命令、服务、验证方式、远程环境和恢复任务时的检查清单。
8. [当前任务快照](./current-context.md)：变化最快的短期状态，只用于快速恢复当前会话。

若当前分支为 `refactor/common-game-data` 或 `refactor/operator-completion`，还必须阅读
[`tools/game-data-compiler/README.md`](../../tools/game-data-compiler/README.md)。它是统一 TypeScript
游戏数据编译器的实现契约，优先于后文保留的旧 Python 生成器历史描述。

## 一句话总览

Endaxis 是一个《明日方舟：终末地》战斗时间轴编辑器和模拟器。我们正在 `src/next` 中并行重写其领域模型、项目格式、数据编译、战斗运行时和 UI 接入；游戏事实来自 AKEDB、游戏本地 VFS、IL2CPP 反编译与运行时探针，先进入可审计的研究文档和 C# Combat Spec，再以行为一致、适合编辑器维护的形式进入 Endaxis Next。

## 项目关系图

```mermaid
flowchart LR
  Game["本地游戏文件与运行时"]
  AKEDB["AKEDB CDN / AKEDatabase"]
  VFS["vfs-index-browser"]
  Anime["AnimeStudio"]
  Dump["IL2CPP-Dumper 与 runtime probes"]
  Evidence["研究文档与版本化证据"]
  Spec["Endfield Combat Spec（C#）"]
  Generator["Endaxis 数据生成器"]
  Next["Endaxis Next"]
  UI["/next/timeline"]

  Game --> VFS
  Game --> Dump
  VFS --> Anime
  AKEDB --> Evidence
  VFS --> Evidence
  Dump --> Evidence
  Evidence --> Spec
  Evidence --> Generator
  Spec -. "行为参照" .-> Next
  Generator --> Next
  Next --> UI
```

## 文档职责边界

- `docs/handoff`：跨仓库总览、当前工作状态和接手操作说明。
- `docs/next`：Endaxis Next 长期架构说明，面向已经知道项目背景的开发者。
- `docs/architecture`：专题设计、历史决策和迁移方案。
- `docs/research`：具体干员、原生 Action、Buff、装备和生成覆盖率的证据记录。
- `vfs-index-browser/docs`：本地游戏资源、格式、模型、音频、Shader 和战斗逆向研究。
- `vfs-index-browser/combat-spec/docs`：C# 原生行为复刻的模块说明和证据边界。

## 重要警告

- 旧版 Endaxis 配置是回归样本和人工经验，不是最高等级的游戏事实。
- AKEDB 提供了大量结构化数据，但并不保证包含每个技能的根 `SkillData`、帧时序或运行时硬编码。
- C# Combat Spec 追求按证据 1:1 表达原生行为；Endaxis Next 追求在单敌人排轴场景下行为一致、结构清晰，不要求复制游戏内部类名和所有与排轴无关的系统。
- 未证实的信息必须保持 `unknown` 或生成失败，不能用看似合理的默认值掩盖缺口。
- 当前工作树以用户主动搁置后的状态为准。先前关于梨诺、新武器和部分导出脚本的修改是被搁置，不是丢失。
