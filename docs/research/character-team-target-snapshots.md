# 队友目标查询与快照边界（2026-08-28）

## 当前结论

余烬连携的 `CureTarget` 不能投影成“治疗时寻找最低血量队友”。它是先执行查询，
把结果身份保存进动作 Context，后续治疗读取该结果。敌人不攻击不意味着治疗可删：
满血治疗仍有事件及其他数值读者。

原生证据和可执行规格见 combat-spec `docs/selector-pipeline.md` 的 CurHpRatioAsc、ExcludeTarget 节。
本轮已闭合原生选择链并修正 Endaxis 来源事实；**尚未接通 Next 的查询快照执行，不计新增完整干员**。

## 时间与数据关系

| 时刻 | 行为 | 保存／读取内容 |
| --- | --- | --- |
| 查询 A | 活队友 → 主控验证 | 将当时的主控身份存入 `Main` |
| 查询 B | 活队友 → 排除 Context `Main` → 最低生命比例筛选 | 将查询时选中的身份存入 `CureTarget` |
| 中间行为 | 主控、HP、目标组可能变化 | 不自动重新运行查询 A/B |
| 治疗 | 读取 Context `CureTarget` | 对已保存对象治疗，不重新选人 |
| 再次查询 B | 再次取当前 HP 并筛选 | 用新结果覆盖 `CureTarget`；空结果也覆盖旧值 |

同版本原始片段保存在编译器测试 `fixtures/ember-combo-target-queries.json`，与 combat-spec
夹具一致。源文件及 SHA-256 记录在规格文档；这些测试不依赖 tmp 下载缓存。

## 来源层已修正

- `CharacterTeamSelectionSource` 替代字符串 role，保留最低生命比例查询的实际 `excludedTarget`。
- 不再把 Context key `Main` 直接解释为主控；任意 key 都按引用保留。
- `Owner` 在 source 层不等于 caster。只有编译阶段有宿主身份依据时才能进一步投影。
- 只识别已审计的后处理器顺序和 PriorityFilter 单目标组合；先筛一个再排除与先排除再筛不同。
- 没有将受支持的来源形状直接当作可运行定义：未知运行时查询仍阻断，不偷偷降级为旧的治疗目标枚举。

## 接下来如何接入

1. 在公共契约定义查询快照操作，明确保存 key、主控验证／优先级筛选、排除引用；
   复用现有 RuntimeTargetContext 与 TargetContextOperationExecutor，而不是为余烬写执行器。
2. 查询结果在动作执行时写入 Context。编译期目标组状态只能证明类型和来源，不能替代实际实例集合。
   现有主控 FindTarget 的“只记录别名、不输出动作”快捷路径，接入该链时必须一起处理。
3. 治疗从 Context 取得目标并复用公共治疗结算，覆盖空组、查询后 HP 变化、切主控、再次查询；
   不能接到现有 `lowestHealthRatioOperator*` 的治疗时重选路径。
4. 明确并列选择的宿主边界。原生用 double `hp/maxHp`，公共 0.001 权重归一化后按对象包装哈希决胜，
   不能擅自等价成“精确最低值、队伍第一人”。Next 的确定性身份／并列策略须单独记录为产品投影，
   不冒充能重现游戏进程哈希；不能依据“敌人不攻击，所以大家满血”跳过这一步。
5. 用真实余烬连携及完整依赖闭包回归，再重跑主动矩阵、原始天赋／潜能装配与整名生成验收。

## 不扩张的范围

不恢复敌人攻击、红圈、受击或空间模型；本轮不做通用黑板 DCE。
combat-spec 已有 EnemyPart 的排除独立开关，但 Next 不因此新增敌人部位系统。
血量排序中的部位虚 HP getter、SlotController 依赖尚未复刻，规格明确拒绝，不以默认值放行。
