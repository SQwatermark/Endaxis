# 队友目标查询与快照边界（2026-08-28）

## 当前结论

余烬连携的 `CureTarget` 不能投影成“治疗时寻找最低血量队友”。它是先执行查询，
把结果身份保存进动作 Context，后续治疗读取该结果。敌人不攻击不意味着治疗可删：
满血治疗仍有事件及其他数值读者。

原生证据和可执行规格见 combat-spec `docs/selector-pipeline.md` 的 CurHpRatioAsc、ExcludeTarget 节。
本轮已闭合原生选择链、Endaxis 来源事实和 Next 查询快照执行；余烬已作为第六名完整干员注册。

## 时间与数据关系

| 时刻       | 行为                                            | 保存／读取内容                              |
| ---------- | ----------------------------------------------- | ------------------------------------------- |
| 查询 A     | 活队友 → 主控验证                               | 将当时的主控身份存入 `Main`                 |
| 查询 B     | 活队友 → 排除 Context `Main` → 最低生命比例筛选 | 将查询时选中的身份存入 `CureTarget`         |
| 中间行为   | 主控、HP、目标组可能变化                        | 不自动重新运行查询 A/B                      |
| 治疗       | 读取 Context `CureTarget`                       | 对已保存对象治疗，不重新选人                |
| 再次查询 B | 再次取当前 HP 并筛选                            | 用新结果覆盖 `CureTarget`；空结果也覆盖旧值 |

同版本原始片段保存在编译器测试 `fixtures/ember-combo-target-queries.json`，与 combat-spec
夹具一致。源文件及 SHA-256 记录在规格文档；这些测试不依赖 tmp 下载缓存。

## 来源层已修正

- `CharacterTeamSelectionSource` 替代字符串 role，保留最低生命比例查询的实际 `excludedTarget`。
- 不再把 Context key `Main` 直接解释为主控；任意 key 都按引用保留。
- `Owner` 在 source 层不等于 caster。只有编译阶段有宿主身份依据时才能进一步投影。
- 只识别已审计的后处理器顺序和 PriorityFilter 单目标组合；先筛一个再排除与先排除再筛不同。
- 没有将受支持的来源形状直接当作可运行定义：未知运行时查询仍阻断，不偷偷降级为旧的治疗目标枚举。

## Endaxis 实现边界

1. 公共契约 `findCharacterTeamTargets` 明确保存 key、主控／最低生命比例筛选和排除 Context；
   `TargetContextOperationExecutor` 在执行帧保存实例身份，编译期状态只用于证明引用类型。
2. `heal` 的 `contextTarget` 必须带 `contextKey`，其他治疗目标禁止携带。运行时只按已保存 ID 取得
   生命账本，不调用 `lowestHealthRatioOperator*` 的治疗时重选路径；空组按 `alwaysNext` 返回。
3. 原生用 double `hp/maxHp`，0.001 内归为同优先级，最后按对象包装哈希决胜。Next 保留 0.001
   容差，但对象哈希无法跨数据导出稳定复现，因此在候选中按稳定实例 ID 选择。这是明确的产品投影，
   不声称与某次游戏进程的哈希结果一致，也不退化为队伍首项。
4. 回归覆盖查询后切主控、HP 变化、排除已存身份、近似并列、空结果覆盖和 Context 治疗；真实余烬
   连携、完整依赖闭包、天赋／潜能装配及 9 技能逐项排轴均已通过。

## 不扩张的范围

不恢复敌人攻击、红圈、受击或空间模型；本轮不做通用黑板 DCE。
combat-spec 已有 EnemyPart 的排除独立开关，但 Next 不因此新增敌人部位系统。
血量排序中的部位虚 HP getter、SlotController 依赖尚未复刻，规格明确拒绝，不以默认值放行。
