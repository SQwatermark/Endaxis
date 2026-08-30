# 嵌套条件投射物的投影所有权

## 研究范围与结论

本文只核实干员生成器中“嵌套条件投射物已标记为投影、却没有进入任何调度”的风险，不修改生成器、运行时或审计。结论基于当前生成器、1.4.4 SkillData、本地庄方宜生成样本与最小合成样本。

风险已经复现，且本质不是“收集器少递归了一层”，而是**投影所有权被拆成了两个彼此独立的操作**：

- `mark_projected_conditional_children` 在任意深度的条件节点上标记 `projectedProjectileLaunches`；
- `collect_projected_conditional_projectile_skills` 只从传入的顶层条件节点收集投影；
- DSL 编译器却会在任意深度依据局部标记抑制原始 `LaunchProjectile` 叶子。

因此，一个嵌套节点可以成为“已消费”的投影所有者，却没有任何调度层实际发出它的子技能。当前庄方宜强化战技还会被另一个条件投射物 blocker 提前中止，所以尚未生成错误的最终 DSL；一旦只修掉该 blocker，已经标记的飞剑投射物就会静默消失。

提交 `0834bc6` 已实现本文提出的最小安全修复：内层条件只能消费由根节点唯一拥有的投射物投影；未进入根调度的内层投影会被清除，让原始 `LaunchProjectile` 继续触发严格编译错误。该修复防止静默丢失，但尚未实现携带祖先 guard 的条件绑定投影。

## 准确调用链

真实技能从原始文件到最终 DSL 的相关调用链如下：

```text
parse_skill
  -> parse_conditional_actions
     -> parse_if_else
        -> parse_branch
           -> parse_projectile_launch_payload
  -> resolve_conditional_projectile_triggers
     -> 递归进入 nestedCondition
     -> resolve_projectile_payload_triggers
        -> 读取 projectileSkillId / skillIdOnReach 等引用的 SkillData
        -> 构造 ProjectileTriggeredSkillSource
  -> mark_projected_conditional_children
     -> 先递归标记 nestedCondition
     -> guaranteed_projectile_projections
     -> 将各叶路径完全相等的结果写入当前条件的 projectedProjectileLaunches
  -> collect_projected_conditional_projectile_skills(顶层 conditionalActions)
     -> 只读取每个顶层条件自己的 projectedProjectileLaunches
  -> SkillSource.projectileTriggeredSkills
  -> collect_resolved_schedule
     -> 只调度 SkillSource.projectileTriggeredSkills 中的投射物子技能
  -> compile_resolved_sequence
     -> compile_conditional_action
        -> compile_conditional_branch_action
           -> 递归编译 nestedCondition
           -> 若叶子投影属于当前条件的 projectedProjectileLaunches，则返回 sequence()
```

关键不对称发生在最后三段：解析层的标记是递归的，根技能投射物收集不是递归的，而条件编译器的抑制又是递归的。

## 触发条件

静默丢失需要同时满足以下条件：

1. `LaunchProjectile` 位于至少两层 `IfElseAction` 中，因而不是顶层条件的直接叶子；
2. 某个内层条件的所有可达叶路径产生完全相等的 `ConditionalProjectileProjection`；
3. 外层条件并不保证进入该内层条件，或者外层其他路径没有相同投影，因此该投影不能安全提升为根级无条件调度；
4. `mark_projected_conditional_children` 给内层条件写入非空 `projectedProjectileLaunches`；
5. 顶层 `collect_projected_conditional_projectile_skills` 没有收集该内层投影；
6. 编译器之后能够走到内层条件，依据局部标记把原始投射物叶子抑制为空。

“内层两侧投射物相同”只证明它与**内层条件**无关，不能证明它与全部祖先条件无关。若外层只在成功分支进入内层，该投射物仍必须携带外层成功 guard。

## 真实庄方宜样本

### 来源与条件路径

样本为 `chr_0030_zhuangfy_normal_skill_ult.json`，在 Endaxis 清单中对应 `enhancedBattleSkill`。相关路径从第 5 帧的顶层条件开始：

```text
timelineActions[9]._sequenceActionData.actionData[0]
  CheckEntityNum(Context/smart_target >= 1), serverActionIndex=30
  succeedActions.actionData[1]
    CheckBuffStackNumAdvanced(buff_chr_0030_zhuangfy_ult_skill_free >= 1), index=33
    succeedActions.actionData[0]
      CheckBuffStackNumAdvanced(
        buff_chr_0030_zhuangfy_potential1_more_sword >= 1
      ), index=35
      succeedActions.actionData[1] -> LaunchProjectile
      failActions.actionData[1]    -> LaunchProjectile
```

内层两侧的发射载荷和已解析子技能完全相同：

| 字段               | 值                                                     |
| ------------------ | ------------------------------------------------------ |
| `projectileId`     | `projectile_chr_0030_zhuangfy_normal_skill_gene_sword` |
| 事件               | `reach`                                                |
| 子 SkillData       | `chr_0030_zhuangfy_normal_skill_gene_sword_projhit`    |
| `assignBlackboard` | `true`                                                 |
| 投影帧             | `5`（当前项目约定飞行偏移为 0）                        |
| 成功侧动作顺序     | 发射 index 1，随后 `FinishBuffAdvanced` index 3        |
| 失败侧动作顺序     | 发射 index 1，随后 `FinishBuffAdvanced` index 3        |

该子 SkillData 不是纯表现动作。它继续按条件生成 `abilityentity_chr_0030_zhuangfy_normal_skill_sword`，引用 `chr_0030_zhuangfy_normal_skill_sword`，也就是庄方宜的飞剑能力实体。丢失投射物调度会连带丢失飞剑生成链。

### 预期中间层

内层条件确实可以判定“投射物与潜能 1 Buff 条件无关”，但投影仍受祖先条件约束。正确的中间层必须表达以下二者之一：

- 投影由内层条件拥有，同时携带从根到该节点的完整 guard：`CheckEntityNum` 成功、`ult_skill_free` Buff 条件成功；
- 或者不消费原始叶子，把两个发射动作继续留在各自完整条件分支中。

无论采用哪一种，发射出现都必须进入且仅进入一个实际调度出口。

### 修复前的实际中间层

修复前的解析结果为：

```text
inner.projectedProjectileLaunches.length = 1
collect_projected_conditional_projectile_skills((inner,)).length = 1

root.projectedProjectileLaunches.length = 0
skill.projectileTriggeredSkills.length = 0
collect_projected_conditional_projectile_skills((root,)).length = 0
```

内层投影中已经存在完整子技能，动作顺序为：

```text
(30, 1, 33, 0, 35, 1)
```

但它没有进入根技能的 `projectileTriggeredSkills`，所以 `collect_resolved_schedule` 不会产生对应投射物子技能的调度项。

### 修复前的实际 DSL 结果

当前完整 `enhancedBattleSkill` 仍会在另一条分支失败：

```text
root.succeedActions[1].nestedCondition.failActions[0]
  .nestedCondition.succeedActions[7]
  : unsupported conditional leaf 'LaunchProjectile'
```

因此，当前状态是 fail-closed，尚无错误的最终技能 DSL。这个错误恰好遮住了所有权漏洞。

单独编译已标记的脆弱内层时，两个投射物叶子都会返回空 `sequence()`；结果只剩两侧相同的 Buff 结束动作：

```ts
branch(
  {
    kind: 'buffIdStackCompare',
    target: 'caster',
    buffIds: ['buff_chr_0030_zhuangfy_potential1_more_sword'],
    operator: 'greaterOrEqual',
    value: { kind: 'constant', value: 1 },
  },
  sequence(step('finishBuffsById' /* ... */)),
  sequence(step('finishBuffsById' /* ... */)),
);
```

生成结果中没有 `chr_0030_zhuangfy_normal_skill_gene_sword_projhit`，也没有飞剑能力实体链。若前述 sibling blocker 被单独修掉，这就是会进入最终 DSL 的错误局部结果。

## 最小合成样本

合成树只保留复现所需结构：

```text
outer IfElse
  succeed:
    inner IfElse
      succeed: LaunchProjectile(projectile.test -> skill.hit)
      fail:    LaunchProjectile(projectile.test -> skill.hit)
  fail: empty
```

内层的两个投射物值完全相等，但外层失败时不应发射，因此只能得到受 `outer.succeed` 约束的投影，不能提升为根级无条件投影。

修复前的实际结果：

```text
marked.outer.projectedProjectileLaunches.length = 0
marked.inner.projectedProjectileLaunches.length = 1
collect_projected_conditional_projectile_skills((marked.outer,)).length = 0
compile_conditional_action(marked.inner) = sequence()
compile_conditional_action(marked.outer) = sequence()
```

这证明风险不依赖庄方宜的其他复杂动作：只要“内层完成标记、外层没有完成提升”，原始叶子就会被抑制，而根调度没有对应子技能。

## 最小回归测试设计

### 1. 必须先加的安全回归

旧 Python 迁移测试曾构造上述最小树；该实现已退役，当前应在 TS 编译器投射物测试中断言一个投射物出现不能同时满足：

- 被任意深度条件标记为 `projectedProjectileLaunches`；
- 未进入任何带 guard 或根级的发出集合；
- 编译时又被替换为 `sequence()`。

在完整的条件绑定投影尚未实现前，最小安全行为应为 fail-closed：外层编译必须抛出 `unsupported conditional leaf 'LaunchProjectile'`，不得返回 `sequence()`。这个测试能阻止静默错误进入生成产物。

### 2. 完整功能回归

条件绑定调度实现后，同一个合成样本应断言：

- `skill.hit` 只出现一次；
- 它只位于 `outer.succeed` 路径；
- `outer.fail` 不包含该子技能；
- 两个互斥内层叶子不会导致重复调度；
- 编译器只有在确认该出现已经由相同所有者发出后，才抑制两个原始叶子。

### 3. 庄方宜集成回归

解析真实 `enhancedBattleSkill` 后，定位 action path 以 index 35 结尾的条件，并断言飞剑投射物出现满足所有权不变量：

```text
每个 LaunchProjectile 出现 = 恰好一个 owner
每个 consumed 出现       = owner 已发出等价调度
每个发出调度             = 保留完整祖先 guard 与原动作顺序
```

至少应检查最终调度或 DSL 中仍可追踪到：

```text
projectile_chr_0030_zhuangfy_normal_skill_gene_sword
  -> reach
  -> chr_0030_zhuangfy_normal_skill_gene_sword_projhit
```

仅断言 `projectedProjectileLaunches.length == 1` 不足以防回归，因为本次缺陷正是“标记存在但没有发出”。

## 修复边界

### 可以做的最小安全修复

将“标记为已投影”和“实际注册调度”绑定为一个不可分割的所有权操作。在当前根级调度结构不支持 guard 前，不应标记任何无法提升到根级的嵌套投影；让原始叶子继续 fail-closed，比静默省略正确。

### 完整修复需要新增的能力

完整方案应返回带以下信息的投影出现，而不是裸 `ProjectileTriggeredSkillSource`：

- 稳定的来源身份：条件路径、分支方向、动作位置；
- 累积祖先 guard；
- 投射物事件类型与子技能身份；
- 根技能坐标系中的帧和原生动作顺序；
- owner/consumed 状态，确保一次出现只发出一次。

条件编译器或统一调度器需要能在分支内部执行已解析的子技能序列。只有该序列已经由对应 owner 发出，叶子编译器才可以抑制原始 `LaunchProjectile`。

### 明确不能采用的修法

- **不能只让收集器递归。** 这会把内层结果无条件塞到根调度，庄方宜会在外层条件失败时仍生成飞剑。
- **不能只按投射物或子技能值去重。** 两次相同发射仍是两个动作出现；相等只用于证明互斥路径等价。
- **不能忽略祖先 guard。** 内层条件无关不等于根技能无条件。
- **不能在标记后依赖后续编译碰巧报错。** sibling blocker 的增删不应决定另一个动作是否静默丢失。
- **不能把空事件引用当作可投影空操作。** 没有可解析子技能的发射仍需独立分类或 fail-closed。

## 建议实施顺序

1. 已添加最小合成安全回归，使当前漏洞稳定 fail-closed；
2. 为投射物出现引入稳定身份和单一 owner/consumed 不变量；
3. 让投影分析返回“根级无条件”或“条件绑定”两类结果；
4. 为 DSL/统一调度增加带 guard 的子技能执行能力；
5. 添加庄方宜真实集成回归；
6. 最后再处理当前遮挡该风险的其他 `LaunchProjectile` blocker。

这个顺序能避免为了让审计数字上升，先把嵌套结果递归提升成语义错误的无条件技能。
