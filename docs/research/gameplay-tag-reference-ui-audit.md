# GameplayTag 与引用编辑面审计

> 2026-08-28 更新：本页按最新可读路径契约修订，旧“项目保存整数、只改显示”的方案已废止。

## 范围与结论

本轮只审计 Next 的正式定义、生成数据和编辑器，不修改旧版。审计标准不是“看起来像
整数”，而是字段的原生类型或解包配置能否证明它是 `GameplayTag.tagId`，或证明它由
GameplayTag 配置映射而来。

完整 `GameplayTagConfigSet` 引用 26 份配置，生成 6806 条唯一非空完整路径。
原生 int32/CRC 和 ID 反查只留在转换器来源层；契约、生成数据、项目和运行时统一使用
`GameplayTag = string`，编辑器直接查看、搜索和保存路径，不做数字往返转换。
非精确匹配直接比较路径本身或祖先路径加斜杠的前缀；实体标签仍由原有 Buff 容器计数管理。
来源、空标签和跨配置重复处理见[完整配置集恢复](./gameplay-tag-config-set.md)。

## 已统一的编辑入口

| 编辑语义                  | DSL 字段                        | 处理方式                                     |
| ------------------------- | ------------------------------- | -------------------------------------------- |
| Buff 标签查询、读取和结束 | `buffTags`                    | 可搜索路径列表；直接保存可读路径            |
| 实体标签条件              | `tags`                        | 可搜索路径列表                               |
| Buff 事件标签条件         | `eventBuffTagsMatch.buffTags` | 补齐此前缺失的 Inspector，并复用统一选择器   |
| 治疗标签                  | `heal.tags`                   | 可为空的路径列表                             |
| 终结技能量恢复分类        | `ultimateRecoveryTag`         | 最多一项的路径选择器                         |
| Buff 持有、延长标签       | `applyTags`、`extendTags`   | 在内联 Buff 蓝图 Inspector 中显式编辑        |
| 时间膨胀槽位              | `startTimeDilation.slot`        | 限定为 `TimeDilation/Layer/*` 的证据槽位下拉 |

旧数字定义不再合法，不加运行时兼容转换，也不静默删除未知引用；自定义旧项目需要在数据
输入边界迁移。转换器遇到未知来源 ID 必须失败；原生空槽位明确投影为 `unassigned`。

## 时间膨胀优先级不是 ID 字段

原生 `timeDilationPriority` 是 GameplayTag，但生成器按同版本
`TimeDilationConfig.priorityMap` 将其严格转换为运行比较值。配置的十条来源标签形成七个
值：`10 / 15 / 20 / 21 / 30 / 50 / 100`。多个标签可以共享同一个值，因此正式 DSL
只保存比较值，不能把它重新解释成唯一标签 ID。

编辑器现按比较值分组选项，并在标签中列出所有对应的原生优先级路径。未知比较值仍可
原样保存。这样补足语义显示而不伪造已经在生成阶段丢失的一对一身份。

## 明确保留的其他数字与引用

- `buffId`、`abilityEntityId`、技能 ID 和定时标记 ID 本来就是稳定字符串身份，不属于
  GameplayTag；
- `skillCastId`、能力实体 `instanceId` 是一次模拟内部分配的运行时句柄，没有公共名称表；
- 帧、秒、倍率、层数、计数、优先级比较值与枚举序号是数值本身，不是哈希引用；
- 原生 int32 tagId 仅属于转换器来源模型和 combat-spec；正式契约有意使用可读路径，
  不是原生内存布局的逐字段复制。

## 证据与复现

- 完整配置集清单、各文件 SHA-256 和复现命令见[来源记录](./gameplay-tag-config-set.md)；
- 正式生成器：`tools/game-data-compiler/scripts/generateGameplayTagCatalog.ts`；
- 生成目录：`src/next/data/combat/gameplayTagCatalog.generated.ts`；
- 时间膨胀配置与 Bundle 哈希见
  [`time-dilation-slot-and-curve-config.md`](./time-dilation-slot-and-curve-config.md)。
