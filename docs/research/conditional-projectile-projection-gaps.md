# 条件分支中的投射物投影缺口

## 研究范围

本文只研究干员生成器如何处理条件分支中的 `LaunchProjectile`，不修改生成器、Next
运行时或全干员审计。结论来自当前本地 SkillData、生成器解析结果、1.4.4 静态元数据、
combat-spec 已记录的条件动作执行语义，以及当前全干员生成审计。

这里的“确定命中子技能”是 Endaxis 单敌人、技能释放必然成功、暂按投射物第 0 帧命中的
抽象：生成器把投射物事件引用的 SkillData 解析成可模拟的子技能。它不表示原生游戏没有
飞行时间，也不证明 `OnBlock`、`OnReach`、`OnFinish` 在所有场景中必然发生。

## 原生数据与当前解析链

原生 `LaunchProjectile.Data` 至少包含以下两组彼此独立的信息：

- 发射信息：`projectileId`、发射源、发射点、目标设置、实体黑板赋值等；
- 事件子技能：`castSkillOnHit/projectileSkillId`、`castSkillOnBlock/skillIdOnBlock`、
  `castSkillOnReach/skillIdOnReach`、`castSkillOnFinish/skillIdOnFinish`。

1.4.4 静态元数据同时给出了 `LaunchProjectile.ExecuteInternal` 与内部 `_Launch`，说明
“执行发射动作”和“投射物事件发生后施放子 SkillData”是两个阶段。当前生成器遵循这一
结构：先用 `parse_projectile_launch_payload` 读取发射及已启用的事件引用，再由
`resolve_projectile_payload_triggers` 加载对应 SkillData、合并黑板并解析其战斗行为。

条件树中的处理顺序为：

1. `parse_conditional_actions` 保留 `IfElseAction` 的条件和两侧动作；
2. `resolve_conditional_projectile_triggers` 递归解析每个分支叶子的投射物子技能；
3. `guaranteed_projectile_projections` 枚举该条件所有可达叶路径；
4. 只有每条路径产生的投射物投影序列**完全相等**时，才标记为确定投影；
5. `collect_projected_conditional_projectile_skills` 将已标记子技能加入根技能调度；
6. DSL 编译器遇到已投影叶子时输出空 `sequence()`，否则 fail-closed，报
   `unsupported conditional leaf 'LaunchProjectile'`。

原生及 combat-spec 的 `IfElseAction` 证据表明：先即时执行条件，再只执行成功或失败
分支；分支内动作仍按原顺序执行，分支返回值还可能影响外层序列。因此，只要两侧子技能
不同，就不能把其中任意一侧提升为无条件根调度。

## Wulfgard 为何仍然阻塞

真实文件 `chr_0006_wolfgd_normal_skill.json` 在第 23 帧的 `IfElseAction`
（`serverActionIndex=11`）检查 `SpellInflict >= 1`：

| 分支    | 投射物                                    | 命中子技能                                                | 已解析行为                   |
| ------- | ----------------------------------------- | --------------------------------------------------------- | ---------------------------- |
| succeed | `projectile_chr_0006_wolfgd_normal_skill` | `chr_0006_wolfgd_normal_skill_projhit_1`                  | 火焰生命伤害、物理失衡       |
| fail    | 同上                                      | `chr_0006_wolfgd_normal_skill_projhit_FireSpellInfiction` | 同类伤害与失衡，另施加热附着 |

两侧虽然发射同一个投射物，但 `projectileSkillId` 和子技能行为不同。当前
`ConditionalProjectileProjection` 同时比较发射载荷及完整的已解析子技能，所以两个结果
不相等，`guaranteed_projectile_projections` 正确返回空。编译器随后在
`normal_skill.schedule[3].conditionalAction.succeedActions[0]` fail-closed。

这里不能通过放宽相等判断来“修复”：无条件提升成功分支会永久丢失热附着；无条件提升
失败分支则会让热附着在成功分支也发生。正确闭环必须保留 `SpellInflict` 条件，并让所选
分支在执行时调用各自的已解析子技能。

Wulfgard 根级另有第 6、16、141 帧的无条件投射物子技能；第 23 帧条件发射当前未进入根级
集合，因此现状没有重复投影，只是拒绝生成。

## 全量阻塞盘点

当前全干员生成审计中，共有 5 个技能直接阻塞于条件叶 `LaunchProjectile`：

| 干员          | SkillData                            | 条件                              | 两侧形状                      | 阻塞原因                                    |
| ------------- | ------------------------------------ | --------------------------------- | ----------------------------- | ------------------------------------------- |
| Wulfgard      | `chr_0006_wolfgd_normal_skill`       | `CompareFloat(SpellInflict >= 1)` | 同投射物、不同命中子技能      | 真实行为不同，必须保留条件                  |
| Snowshine     | `chr_0014_aurora_combo_skill`        | `CheckMainCharacterCondition`     | 同投射物、同 reach 子技能     | 分支内动作索引不同，完整 `actionOrder` 不同 |
| Ardelia       | `chr_0025_ardelia_combo_skill`       | `CheckEntityNum`                  | 同投射物、同 hit 子技能       | 分支内动作索引不同，完整 `actionOrder` 不同 |
| Zhuang Fangyi | `chr_0030_zhuangfy_normal_skill`     | 嵌套 `CheckBuffStackNumAdvanced`  | 同飞剑投射物、同 reach 子技能 | 嵌套路径及动作索引不同                      |
| Zhuang Fangyi | `chr_0030_zhuangfy_normal_skill_ult` | 嵌套 `CheckBuffStackNumAdvanced`  | 同飞剑投射物、同 reach 子技能 | 嵌套路径及动作索引不同                      |

Snowshine、Ardelia 和庄方宜说明当前判定既比较“产生什么行为”，也比较“行为来自条件树的
哪个动作位置”。贸然忽略 `actionOrder` 虽可消除部分 blocker，却尚无证据证明同帧动作顺序
不影响其他黑板、资源或实体操作，因而不能作为精确规则。

全量审计中的 `LaunchProjectile` 未解析出现次数远多于这 5 项；其中包括被更早 blocker
遮挡、无条件发射、已可确定投影和没有可解析事件子技能等不同形状。以上表格限定为当前
实际错误文本为 `unsupported conditional leaf 'LaunchProjectile'` 的完整集合，不能把宽泛
出现次数等同于同一种缺口。

## 已发现的嵌套静默丢失风险

`mark_projected_conditional_children` 会递归标记嵌套条件，但
`collect_projected_conditional_projectile_skills` 只读取顶层条件自身的
`projectedProjectileLaunches`，不会递归收集嵌套条件。

庄方宜终结技数据中已经存在这种形状：更深一层条件的两侧在相同动作索引发射同一飞剑，
该内层条件会被标记为已投影；然而根技能收集到的条件投射物子技能仍为 0。编译到该叶时，
现有逻辑又会因为“已投影”而输出空 `sequence()`。当前它被更早的另一个
`LaunchProjectile` blocker 遮住，尚未形成错误 DSL；若只修复表面 blocker，就会暴露
“原叶被抑制、子技能未调度”的静默丢失。

因此，“标记已投影”和“实际发出投影”必须成为同一个不可分割的所有权操作。

## 精确闭环规则

### 1. 为每个发射叶建立稳定出现身份

身份应来自 SkillData 内的条件路径、分支方向和动作索引，而不是由投射物载荷或子技能值
推导。两个配置完全相同但先后发射两次的叶子仍是两个出现，不能因值相等而去重。

### 2. 每个出现只能有一个所有者

每个 `LaunchProjectile` 出现必须且只能处于以下状态之一：

- 根级确定投影：所有可达条件结果产生同一有序行为，且顺序等价已有证据；
- 条件绑定投影：保留完整条件路径，只在对应分支执行已解析子技能；
- 明确不支持：没有足够信息安全投影，继续 fail-closed。

只有所有者已经实际发出等价行为后，DSL 编译器才可抑制原叶。应以出现身份维护
`emitted/consumed` 集合，并断言每个出现最多消费一次，不能继续依赖值对象的成员判断。

### 3. 分支不同则生成条件绑定子调度

Wulfgard 应保留原条件：成功分支调度普通命中子技能，失败分支调度带热附着的命中子技能。
嵌套条件应组合完整 guard，例如“外层成功且内层失败”，不可扁平化成根级无条件事件。
子技能帧由发射帧、已确认的飞行偏移及子技能相对帧组成；当前项目约定飞行偏移为 0，需
明确记录为项目假设而非原生事实。

### 4. 根级提升必须比较有序结果

只有每条可达路径产生的**有序发射出现序列**等价时，才能发出一次根级确定投影。事件类型
和子技能 ID 必须参与比较，`hit/reach/block/finish` 不能互相合并。

当前在没有动作顺序等价证据前，应继续保留 `actionOrder` 差异：Snowshine、Ardelia 和
庄方宜可先通过条件绑定投影精确闭环，而不是把分支动作索引正规化掉。未来若证明某段
`actionOrder` 只用于来源定位、不参与同帧顺序，才可在专门的语义比较器中忽略该部分；
原始顺序仍须保留用于诊断和执行。

### 5. 嵌套收集必须携带 guard

收集器可以递归，但不能把嵌套结果直接塞进根级无条件 `projectileTriggeredSkills`。递归结果
必须携带累计条件路径。任何内层叶只有在以下二者之一完成时才可标记为 consumed：

- 外层证明所有路径等价并发出根级投影；
- 发出携带完整 guard 的条件绑定投影。

### 6. 空事件引用不得被当作空操作

没有启用事件子技能的 `LaunchProjectile` 不能被转换成“确定命中子技能”，也不能因为各路径
都得到空序列就自动删除。它可能只承担表现、实体、碰撞或尚未建模的原生副作用；缺乏证据
时应显式保留为 unsupported 或已知非战斗动作。

## 建议回归用例

- Wulfgard：两侧子技能不同，条件和热附着差异均保留；
- 相同载荷但分支动作索引不同：生成两个受 guard 约束的出现，原 `actionOrder` 不丢失；
- 嵌套条件仅一侧存在投射物：不得进入根级投影，也不得被静默抑制；
- 嵌套条件两侧相同、外层不保证发生：内层投影必须携带外层 guard；
- 所有路径完全相同：只发出一个根级子调度，并消费所有互斥路径对应的来源出现；
- 同一分支连续两次相同发射：必须保留两次，不能按值去重；
- 无事件子技能：保持明确 unsupported；
- 同一子技能同时出现在无条件和条件发射中：分别按各自出现执行，不交叉消费。

## 证据边界

当前可以确认条件分支只执行一侧、分支内顺序有语义，以及投射物事件对子 SkillData 的引用
结构。以下内容仍不能从现有证据闭环：

- 原生飞行时间、碰撞失败、阻挡、到达和结束事件在全部投射物类型上的发生保证；
- `actionOrder` 各段在原生同帧调度中的精确比较规则，尤其分支本地索引能否安全正规化；
- 同一投射物同时启用多个事件时，各事件是否都发生及其先后关系；
- 纯表现投射物或没有事件子技能的发射是否还承载战斗副作用。

在这些边界补齐前，精确方案应优先采用条件绑定投影并保持 fail-closed，不应通过忽略条件、
子技能 ID、事件类型或动作顺序来扩大“确定投影”范围。
