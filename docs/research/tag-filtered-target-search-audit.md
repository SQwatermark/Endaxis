# 标签过滤目标搜索与实体数量条件：莱万汀连携阻塞分析

## 结论摘要

`chr_0016_laevat_combo_skill` 的 `CheckEntityNum(Context tar, GE 1)` 阻塞**不是解析遗漏，也不是控制流投影遗漏**，而是确实缺少一种目标选择语义：带 `TagValidator` 的空间搜索的结果无法在固定单敌人模型下证明恒真。当前生成器拒绝折叠是正确的 fail-closed 行为，本次不修改正式代码、不提高审计数字。

## 案例数据：`tar` 的写入、覆盖与消费顺序

以下均来自 `chr_0016_laevat_combo_skill.json`，括号内为 `serverActionIndex` 与时间轴帧区间。

### 写入者（按执行顺序）

| 序号 | 动作                     | 帧      | 路径                     | 目标选择器                                                                                                                                                                                                                                                   |
| ---- | ------------------------ | ------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | `[36] FindTargetAction`  | [5,8]   | 根时间轴                 | `HitBoxFinder`：`checkAlive=true`、`factionTarget=Anti`、`targetObjectType=Normal`、球半径 15、`positionRef=OwnerMountPoint`、`castDirection=ZForward`；`TagValidator HasAny[-1110095722, -421286163]`；`PriorityFilter DistanceFromCenterDes`（无数量上限） |
| 2    | `[43] MergeTargetAction` | [5,8]   | `IfElse[37].failActions` | 输入 `Context/smart_target`，无 finder、无校验器                                                                                                                                                                                                             |
| 3    | `[5] MergeTargetAction`  | [20,56] | `IfElse[3].failActions`  | 输入 `InstantSearch/smart_target + MainTargetFinder`                                                                                                                                                                                                         |

### 消费点（按执行顺序）

| 序号 | 动作                                                               | 帧      | 说明                                                         |
| ---- | ------------------------------------------------------------------ | ------- | ------------------------------------------------------------ |
| 1    | `[38] CheckEntityNum` Context/tar GE 1                             | [5,8]   | `IfElse[37]` 条件，**当前阻塞点**                            |
| 2    | `[39] ForEachAction` Context/tar                                   | [5,8]   | `[37]` 成功分支：每目标对 `count/limit` 黑板计数并钳制       |
| 3    | `[4] CheckEntityNum` Context/tar GE 1                              | [20,56] | `IfElse[3]` 条件；分支内无可编译战斗叶子，只保留为控制流事实 |
| 4    | `[6] LaunchProjectile` / `[9] EffectAction` / `[10] ForEachAction` | [20,56] | 最终消费者：投射物目标、特效和逐目标 Buff 施加都读取 `tar`   |
| 5    | `[7] CreateBuffAction`（禁用）/ `[8] CreateBuffAction hit_self`    | [20,56] | `[7]` 禁用；`[8]` 为 `Owner` 来源，按原生分派忽略组键        |

### 覆盖关系

在读取点 `[38]`（帧 5、序号 37）之前，唯一先于读取且可达的写入是 `[36]`。
`[43]` 与读取点同属 `IfElse[37]` 但位于失败分支，不支配条件读取；
`[5]` 在帧 20 之后。`resolve_latest_target_group_write_at` 按“时间序 + 分支支配”
正确解析为 `[36]`，并正确排除 `[43]`/`[5]`；随后
`target_group_write_guarantees_single_enemy` 因 `validatorTypes=('TagValidator',)` 拒绝归约。

## 判定：缺少的语义是标签过滤，不是解析或投影

- **解析路径已覆盖该选择器**：`parse_selector_summary` 已记录 finder 的阵营、对象类型、存活过滤、
  校验器与后处理器类型；`TagValidator` 的查询载荷仍保留在审计层原始 JSON 中，但尚未进入结构化语义归约。
- **控制流投影无遗漏**：最近支配写入解析器对 `[43]`（不支配）与 `[5]`（晚于读取）
  的排除都正确；失败分支内的写入没有泄漏给分支外读取。
- **确实缺少目标选择语义**：`[36]` 的球形搜索中心是施法者挂点（该 shape 的
  `positionRef=OwnerMountPoint` 使 `right_pos` 中心输入不被使用），半径 15，
  零距离模型下空间部分可以覆盖唯一敌人；但 `TagValidator HasAny` 是两个跨干员复用的
  标签（同样出现在狼卫、Ardelia 的技能与多个 Buff 条件中），现有本地材料尚未恢复其名称，
  且没有任何证据表明“任意敌人都至少携带其中一个标签”。

## 为什么不能安全折叠

1. `HasAny(tagA, tagB)` 是场景依赖的实体过滤：敌人没有这两个标签时，搜索合法地返回空。
2. 技能自身结构证明“搜索为空”是设计内的可达状态：`[43]` 与 `[5]` 两个回退合并分支
   都只在 `tar` 为空时把 `smart_target` 合入。若把 `GE 1` 折叠为恒真，会把可达的
   失败分支变成死代码，并改变成功分支中 `count/limit` 黑板的执行条件。
3. 因此该检查的运行时值不能由固定单敌人模型导出；Endaxis 也没有“搜索是否命中”的
   运行时条件语义可以承接它。看到“唯一敌人存在”就折叠，等于把标签过滤、空间约束和
   回退分支的语义一起抹掉。

## 证据缺口

- 本地研究数据中没有 GameplayTag 名称表；标签 ID 是 CRC32 哈希，字符串转储与常见
  名称枚举均未命中。无法判断 `-1110095722`/`-421286163` 是否为全体敌人恒有标签。
- Endaxis 不建模 `castDirection`、重叠解析与挂点空间位置；若未来要放电空间部分
  （球心、半径、方向），还需要对应的复刻证据。

## 最小后续方案

1. 恢复 GameplayTag 名称表，解码两个标签，并确认是否存在“全体敌人恒有”的标签族。
2. 若存在，才可实现一条通用规则：`TagValidator` 查询按查询类型逐项放电——
   `HasAny` 只要有一个查询标签被证明全体敌人恒有即可视为无过滤，`HasAll` 需要全部，
   `ExceptAny`/`ExceptAll` 取对称形式；规则只接受标签族证据，不接受技能 ID、角色名
   或目标组名特判。
3. 若标签语义无法证明恒真，则保持阻塞；完整闭环该技能需要接入“目标搜索命中与否”
   的运行时条件（当前 Next 无此语义），优先级由路线图决定。
4. 在此之前任何提高该技能审计数字的近似都不可接受。
