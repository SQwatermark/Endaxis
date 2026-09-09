# 投射物回调宿主：事件收束设计

核对日期：2026-09-10。此文是未完成实现的约束，不是完成声明。

当前实施进度：完整来源程序已经保留自然时长和逐条区间；普通技能/能力实体子技能已经
共用createTimeline构造入口。正式投射物仍经旧即时适配层，公共定义及回调宿主迁移未完成。

2026-09-10 补充：duration-finish 的实体初始化 scope 已移到调度动作外，保证原生
assignPairs 在发射时求值；回调技能 direct scope 仍在启动回调时建立。这只纠正
初始化时间，不代表完整回调技能宿主已实现。不得通过深拷贝所有 ActionBlackboard
来替代宿主边界；普通干员的 EntityBB 仍须在同一实体内共享。

## 为什么不能继续补一个延迟字段

### 零距离模型的范围约束

不实现空间位置、飞行路径或路径采样。零距离可以省略路程耗时，不能无证据地
抹掉固定延迟、周期触发、命中次数、回调或影响 SkillAffix 的引用释放。
以下宿主设计只服务于已有动作的黑板、事件与清理；保留某项生命周期须说明其
可观察消费者，不能为了复刻对象结构本身而扩展模拟。

原始角色 SkillData 中，发射动作引用的回调并不总是一条即时动作。
本地 hybrid 快照的结构审计读了 727 个 chr_ 技能文件，找到 123 个回调技能，全部有文件：
95 个含正长度动作区间、39 个含多条时间轴、3 个含延后开始的时间轴。
这只是原始结构统计：遍历不是正式编译器的可达性分析，未排除禁用父分支、表现动作和
木桩不可达路径，不能把这些数量解释成待实现机制数或受影响干员数。

可直接复核的例子：

- 汤汤 chr_0027_tangtang_combo_skill_water_gene：技能 durationFrame=900，动作区间 0～1。
- 狼卫 chr_0006_wolfgd_combo_skill_projhit：durationFrame=0，动作区间 0～0、0～3、0～10。
  durationFrame=0 还须按原生 SkillData.duration 的至少一帧处理，不能直接视为无限技能。

原始检查输出在忽略目录 tmp/projectile-callback-timelines.json，复现脚本同目录
audit-projectile-callback-timelines.mjs。源证据来自对应 SkillData；机器码证据见
combat-spec 的 launch-projectile-skill-routing 与 skill-affix-identity-2026-09-04。

## 三种独立的寿命

1. 投射物对象：发射、结束、等待回收、标记回收、实际 reset。
2. 该对象正在执行的回调技能：自身 SkillData 自然时长，以及原生允许的中断/结束。
3. 回调内部的动作：每条 timeline 的 startFrame/endFrame，及所属技能结束时的清理。

结束回调启动不表示技能已经结束；技能结束也不表示投射物已 reset。
SkillAffix 的投射物引用只由对象 reset 释放，不应绑定在任意动作 End 上。

## 实现方向

### 来源到协议

保留回调技能的原生 ID、技能默认黑板、自然结束帧和逐条 scheduledSequences。
不得继续在 compileImmediateProjectileCallbackSkillSource 中丢弃 endFrame，或把所有
startFrame=0 的序列直接合并作为完整技能。现有同步投影只能在动作清理不可观察的路径中
作为经过证明的优化，不是公共技能结构本身。

回收等待仍独立取四个启用回调 SkillData.duration 的最大值，不能改成实际执行的动作长度。
发射对象的实体黑板与回调技能的 direct 黑板各自只有一个所有者；不能为了拆开多个时间轴，
给每条时间轴另建一份 direct 或 EntityBB，也不能把发射者的黑板对象直接共享过去。

### 编译与运行

复用 TimelineActionProcessor 的区间执行、Tick、跳转与 End，不另造投射物序列解释器。
SkillRuntime 已有原生自然结束判断；AbilityEntityChildSkillRuntime 目前主要是区间宿主，
不能仅因它名叫 child skill 就直接认为它具备完整 Skill 的施法、结束与附属 Buff 语义。
应把共同的技能执行职责接清楚，而不是往该类塞一个“是否投射物”的分支。

新宿主必须区分实际回调技能身份与继承的来源 SkillCastInfo。动作读取来源不代表技能对象
本身就是发射者；发布 beforeCast/skillEnd 和附属 Buff 挂载不得凭相同 cast id 合并对象。
回调启动的零增量 Tick、后续 Tick 准入及自然结束帧使用已有原生证据，未闭合的顺序须补证。

跳转不是只改动作游标：当前镜像 Skill.JumpTo 先把 durationTimer 的剩余时间设为
period-target，再调用 Ability.JumpTo。自然结束与动作进度分别持有，但有效跳转共同更新。
越过自然时长走 CastEnd，向后越界则忽略；详见 combat-spec/skill-time-fields.md 的
2026-09-10 续证。普通技能与实体子技能已共用下界判断，反向越界忽略；
自然时长上界的结束顺序尚未对齐，迁移时不能沿用当前行为作为原生规则。

ProjectileLifecycleRuntime 只管投射物阶段与对象 reset；回收前结束当前技能。
其时钟输入由装配层提供，不为此开放尚未闭合的 syncTimeScale=true 路径。
无回调的发射仍可能保留 SkillAffix，不能因没有动作序列就删掉对象。

## 必须覆盖的验收用例

- 同起点不同终点的动作分别 End，direct/entity 黑板不分裂。
- 零增量启动、自然时长到期与动作区间边界；技能先结束时清理剩余区间。
- 父技能结束不截断投射物；回调技能结束不冒充对象 reset。
- 回调施加的附属 Buff 绑定实际回调技能；来源施法信息仍保持原值。
- 多实例和重复回调不共享运行时序列、黑板或事件注册。
- 原生发射、对象 reset 与 SkillAffix 引用次数相互对应，解绑不释放对象。
- 正式干员重生成、实际轴逐 hit 差分；变化必须能追溯到上述游戏规则。

本设计不授权新增空间飞行、碰撞模拟、敌方主动行为或未知事件类型。
