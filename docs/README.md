# Endaxis 开发文档

Endaxis 是《明日方舟：终末地》的时间轴编辑器和战斗模拟器。文档按用途维护，当前说明与历史记录分开。

## 从这里开始

| 要做什么               | 入口                                                           |
| ---------------------- | -------------------------------------------------------------- |
| 第一次理解代码         | [架构总览](architecture/README.md)，再读数据、技能和运行时     |
| 修改代码或生成数据     | [开发指南](development/README.md)                              |
| 接续开发任务           | [当前交接](handoff/current-context.md)                         |
| 推进战斗切面与转换加速 | [任务安排与验收](handoff/runtime-checkpoint-plan.md)           |
| 查看切面状态覆盖与基线 | [状态覆盖清单](research/combat/runtime-checkpoint-coverage.md) |
| 找本机仓库、游戏或转储 | [本地环境](development/local-environment.md)                   |
| 查某条游戏规则的依据   | [研究资料](research/README.md)                                 |
| 追溯旧设计、迁移和验收 | [历史档案](archive/README.md)                                  |

## 新版文档目录

| 分类   | 内容                                                                                                                                         |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 数据   | [数据与状态](architecture/data-and-state.md)：存档、编译、资源与目标查询                                                                     |
| 技能   | [技能定义与执行](architecture/skills.md)：模板、覆盖、输入和结束                                                                             |
| 战斗   | [运行时](architecture/runtime.md)、[事件](architecture/events.md)、[伤害与状态](architecture/damage-and-state.md)                            |
| 配装   | [武器、装备与套装](architecture/equipment.md)：实例、静态修正和动态能力                                                                      |
| 时间   | [时间、变速与显示](architecture/time-and-display.md)                                                                                         |
| 编辑器 | [项目模板与交互](architecture/editor.md)                                                                                                     |
| 开发   | [工具](development/tools.md)、[证据方法](development/evidence.md)、[验证](development/validation.md)、[排障](development/troubleshooting.md) |

## 维护约定

手写代码与转换、导出工具统一遵守[代码规范](development/code-style.md)：正确性优先，禁止错误抽象、暗藏特例和手改生成产物。

架构说明写稳定职责和规则；交接写当前状态、待办和验证边界；本机路径、端口和进程记录只放被Git忽略的 `.local/`。
公共字段与命令以 [公共类型](../packages/game-data-contract/README.md)、[转换器README](../tools/game-data-compiler/README.md)
和根 `package.json` 为准，不在多篇文档复制接口和脚本清单。

研究材料保留来源、版本和未知部分；其中的旧缺口数量不是当前覆盖率。
历史区冻结保存旧方案和过程，文中的“当前”和“下一步”不再安排开发。
已经被新文档替代的教程和跳转页已删除，不再维护 `docs/next` 这套并行入口。

文档整理完成不代表所有游戏机制、生成结果和真实时间轴已经验收；未完成的开发工作统一见当前交接。
