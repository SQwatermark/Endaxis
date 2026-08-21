# GameplayTag 与数字引用编辑面审计

## 范围与结论

本轮只审计 Next 的正式定义、生成数据和编辑器，不修改旧版。审计标准不是“看起来像
整数”，而是字段的原生类型或解包配置能否证明它是 `GameplayTag.tagId`，或证明它由
GameplayTag 配置映射而来。

当前 `GameplayTagConfig` 的 `_keyData` 包含 652 条唯一完整路径。Next 现在从固定哈希的
TypeTree dump 生成全量路径目录，并用已有的 CRC-32/ISO-HDLC 实现计算有符号 int32 身份。
编辑器显示和搜索路径，项目与运行时继续保存原生整数，因此没有项目格式迁移。
同一目录还构造版本化 `GameplayTagRegistry`，由标准模拟环境注入敌人、干员和能力实体
Buff 容器；非精确查询现在能按配置中的真实父路径匹配，而不是因空目录退化成仅精确 ID。

## 已统一的编辑入口

| 编辑语义                  | DSL 字段                        | 处理方式                                     |
| ------------------------- | ------------------------------- | -------------------------------------------- |
| Buff 标签查询、读取和结束 | `buffTagIds`                    | 可搜索路径列表；显示并保留原生 ID            |
| 实体标签条件              | `tagIds`                        | 可搜索路径列表                               |
| Buff 事件标签条件         | `eventBuffTagsMatch.buffTagIds` | 补齐此前缺失的 Inspector，并复用统一选择器   |
| 治疗标签                  | `heal.tagIds`                   | 可为空的路径列表                             |
| 终结技能量恢复分类        | `ultimateRecoveryTagId`         | 最多一项的路径选择器                         |
| Buff 持有、延长标签       | `applyTagIds`、`extendTagIds`   | 在内联 Buff 蓝图 Inspector 中显式编辑        |
| 时间膨胀槽位              | `startTimeDilation.slot`        | 限定为 `TimeDilation/Layer/*` 的证据槽位下拉 |

`tagId = 0` 仍按原生无效标签显示。配置中不存在但项目已经携带的有符号 int32 也不会
被删除或改写，而是显示为“当前版本未登记”，允许用户随后选成已登记路径。

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
- 生成产物和项目文档仍携带原生 int32 tagId。把持久格式改成路径会偏离游戏数据形状，
  因此只在版本目录和编辑投影层建立名称关联。

## 证据与复现

- GameplayTag TypeTree dump SHA-256：
  `3758BB1F10764CE9D1BDA9EF5200D77B3FE93EA59DBD0E09F196C18221019CF8`；
- 生成器：`scripts/generate_next_gameplay_tags/generate_gameplay_tag_catalog.py`；
- 生成目录：`src/next/data/combat/gameplayTagCatalog.generated.ts`；
- 时间膨胀配置与 Bundle 哈希见
  [`time-dilation-slot-and-curve-config.md`](./time-dilation-slot-and-curve-config.md)。
