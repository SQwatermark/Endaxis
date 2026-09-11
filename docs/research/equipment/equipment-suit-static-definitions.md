# 装备套装静态定义审计

> 研究记录：结论适用于正文所述来源与检查范围，历史缺口及测试数量不代表当前支持程度。变更游戏规则前请核对同版本证据与实际消费者。

- 客户端版本：`1.4.4-9433094-12`
- 三件套定义候选：23
- 静态修正：33
- 木桩场景明确省略：6
- 阻塞：0

- `attribute`：4
- `damageScale`：12
- `panelStat`：14
- `skillCooldownMultiplier`：2
- `staticHealingIncrease`：1

这些候选只包含 CardSkill 中构筑期可确定的静态修正。`runtimeDependencies` 单独保留启动 Buff、条件 Buff 与动作图引用；这些依赖闭合前，不得把候选当作完整套装注册。
