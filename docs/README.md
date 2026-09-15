# Endaxis 开发文档

只保留当前架构、开发操作和近期交接。按任务阅读，不要求通读全部文档。

| 需要           | 入口                                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| 接续开发       | [当前交接](handoff/current-context.md)                                                |
| 理解系统       | [架构总览](architecture/README.md)                                                    |
| 修改与验证     | [开发指南](development/README.md)                                                     |
| 查询原生规则   | [combat-spec 研究入口](../../combat-spec-operator-completion/docs/research/README.md) |
| 切面与旧轴转换 | [任务与验收](handoff/runtime-checkpoint-plan.md)                                      |
| 公共字段       | [游戏数据契约](../packages/game-data-contract/README.md)                              |
| 生成数据       | [转换器](../tools/game-data-compiler/README.md)                                       |

架构写稳定职责，交接写待办与最近验证；原生研究归 combat-spec，本机信息归被忽略的 .local。
完成的迁移计划、流水账、旧审计快照直接删除，追溯用 Git。具体约定见[文档维护](development/documentation.md)。
