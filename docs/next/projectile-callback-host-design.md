# 投射物回调宿主：事件收束设计

核对日期：2026-09-10。此文是未完成实现的约束，不是完成声明。

最新进度：完整回调定义已携带 `SkillCastResourceDefinition`，包括扣费帧、原生冷却秒值、
尚未解释的 maxChargeTime、可读资源费用和独立可用门槛；生成器与编译器均已贯通。
这一步没有让临时动作宿主自行解释负冷却，也没有把来源技能类型写成回调自身类型。
当前已拆出公共 SkillRuntime 的显式宿主身份，并允许 native-only 执行程序省略玩家分类。
删除适配层仍须接通实体资源策略：SkillRuntime 现已消费绑定宿主的 SkillResourceAccount，
普通干员通过 CombatResources.bindSkillAccount 转接原账本，不复制支付算法。
资源依赖以互斥类型要求选择现有战斗账本或显式账户；实体路径不需要 resourceOperatorId。
实体真实账户、非零费用回执和释放准入仍待接入，测试账户不代表实体账本实现完成。
已核对复刻库 Skill.CheckCost：atbValueThreshold 始终检查共享 ATB，UltimateSp 费用
读取实际 owner；不得将阈值误解为终结技能量门槛或默认读取发射干员。
公共 AbilitySkillPayload 的玩家 skillType 已改为可选；实体技能复用原事件通道，
不为发布生命周期事件虚构玩家分类，也不复制继承来源的分类。
依据复刻库 Runtime/Skill.cs 的 CastEnd 与 ApplyCost，以及 docs/skill-end.md：
这些公共事件不以玩家技能库分类为发布前提。eventSkillTypeIn 实际消费缺失分类时
仍明确报错，不能用来源分类补值，也不能静默当作不匹配。

同日继续收束了第一层宿主边界：`SkillRuntimeHostIdentity` 已把资源账本干员、动作
Owner/Source、回执/生命周期事件发布主体，以及只适用于干员的语义事件注册主体拆开。
普通干员装配显式传入五者相同的身份；能力实体路径可以不提供语义事件干员，不能再靠
静态程序的 `operatorId` 暗中冒充。投射物与普通能力实体现在共用一场战斗唯一的实例编号
分配器，投射物内部持有稳定 `RuntimeTargetRef`；公开 `projectileLaunched` 仍只暴露原生
reset 端口，没有向公共事件载荷添加虚构 ID。旧动作适配器已使用该投射物身份填充回调
动作 Owner/Source 和 `actionOwnerAbilityEntity`，不再把发射干员当成回调动作宿主。

复查补齐了上一轮遗漏的来源解析：实例编号唯一并不意味着普通能力实体目录包含投射物。
ProjectileLifecycleRuntime 现在保存投射物的一层 source，装配根的 SourceFinder 和递归
属性归因共同查询这条关系；SourceFinder(ActionOwner) 优先读取动作 Owner，之后才回退
Buff Owner。嵌套发射携带当前动作 Source，第二颗投射物指向第一颗，不能直接压成干员。
来源关系在 beforeReset 与全部 reset 通知期间保留，随后释放；依据复刻库
launch-projectile-skill-routing 的 OnProjectileRecycle → reset 委托 → ClearSource 顺序。
这只闭合当前生命周期目录的来源读取，不表示投射物 Buff 容器和所有事件监听已装配。

这仍不是完整宿主迁移：回调尚未由独立 `AbilitySystemRuntime + SkillRuntime` 执行，资源门槛、
当前技能中断和生命周期事件仍未进入正式生产路径。公共执行程序和 AbilitySystem 技能端口
现已允许 native-only 技能不提供玩家 `skillType`；只有玩家槽位、玩家切换分支、来源缺失的
SkillCastInfo 和玩家分类条件会明确要求它。下一步可在不把原生 NormalSkill 伪造成玩家
`battleSkill` 的前提下创建投射物独立 SkillRuntime，并接入既有回调施放入口。

公共施放入口已合流：tryStartProjectileCallbackSkill 在当前宿主先Default中断，
再查明确ID/可用性，以 prepareCastInput 准备继承来源，复用普通同步启动的processing
上下文与前置钩子。不经过槽位解析或post request，不创建另一套事件/动作解释器。
真实SkillRuntime回归已覆盖跨区间共享direct板、自然结束、来源快照及同回调重启。
正式生产端仍未调用该入口；独立owner和完整程序装配尚未完成，不能将这些用例当作
完整ProjectileComponent/目标选择已验收。此处仍不要求建立空间路径模型。

正式消费者边界见 [投射物事件消费者审计](../research/projectile-event-consumers-2026-09-10.md)：
8种 SkillAffix Buff 分布在干员、公共附魔、武器和套装；原始3种延后区间不能当作
3种延后伤害。旧即时适配层已补“即时写入→延后读取”的有损转换门禁，完整程序仍
可表示此形状。这不是持久回调宿主的实现，不能以门禁代替最终接入。

两阶段调度接入口已落位：ProjectileLifecycleRuntime 的组件更新仍在 Default；
beginAbilityFrame 在 Battle 入口捕获准入实例，advanceAbilityFrame 只推进其实际
abilityRuntime（FrameRuntime）。组件的 delta/暂停不冒充技能的 delta/暂停。
Default 中的新建可准入本帧 Battle，Battle 内新建不准入本轮；marked 尚未 reset
时仍可推进，实际 reset 后不能再调用。零增量施放当帧保护由真实技能宿主负责。
正式 scheduleProjectileFinishCallback 尚未提供 abilityRuntime，仍为即时 body；
这个接入口是迁移基础，不是完整回调已接通。动态实体与投射物全部宿主的统一
注册排序仍需在消费完整回调程序时复核，不能把固定分区本身称作原生注册顺序。

时钟阶段新证据：ProjectileComponent 使用 PreLateTick Default(0)，AbilitySystem
使用 Battle(1)，TickRoot 按排序后的枚举顺序执行。正式 duration-finish 队列已移到
敌方 Buff 更新之前。完整宿主须把组件寿命与技能更新分阶段，不能在每个投射物内
就地连续跑两者；启动当帧的技能更新为零增量而不是省略，实际 reset 后不得再 Tick。
详见复刻库 launch-projectile-skill-routing 最新节。原同组 pending 结论不能直接
泛化到 Default 中创建、随后进入 Battle 的对象。

公共时间轴现已补上 CastEnd 终态门禁：同步结束后不启动后续 timeline，
待执行项取消，Reset 才重用。证据见复刻库 skill-time-fields 最新节。
同日续证已补上同序列同步 End，见复刻库 sequence-execute-policy；这不等于完整
回调程序已落位，也不宣称任意生命周期重入组合完全一致。

可执行对照已增加：combat-spec/Runtime/ProjectileCallbackSkillHost，依据当前
ProjectileComponent._CastSkill(032508D0)。它先对投射物自身当前技能执行
Interrupt(Default,空上下文)，然后TryCast回调；不是CastNextSkill，也不是先检查
后结束。三个选项为ignoreDistance/ignoreAngle/allowMultiInputTarget=true。
来源使用投射物保存的完整SkillCastInfo；实际动作宿主、direct黑板和附属Buff仍归
回调Skill。详见复刻库launch-projectile-skill-routing最新节与五项回归。
迁移时应按此入口重用公共Skill执行职责，不能直接复用绑定干员费用/放置身份的外壳。

当前实施进度：完整来源程序已经保留自然时长和逐条区间；普通技能/能力实体子技能已经
共用createTimeline构造入口。正式投射物仍经旧即时适配层，公共定义及回调宿主迁移未完成。

2026-09-10 补充：duration-finish 的实体初始化 scope 已移到调度动作外，保证原生
assignPairs 在发射时求值；回调技能 direct scope 仍在启动回调时建立。这只纠正
初始化时间，不代表完整回调技能宿主已实现。不得通过深拷贝所有 ActionBlackboard
来替代宿主边界；普通干员的 EntityBB 仍须在同一实体内共享。

## 为什么不能继续补一个延迟字段

### 实体账户接入前的明确边界（2026-09-10）

- 装配门禁：有 actionOwnerAbilityEntity 的 SkillRuntime 必须提供显式 resourceAccount，
  不能填写发射者 resourceOperatorId 后接 CombatResources。回归验证拒绝这种误接。
- 原生零终结技能量费用并非不调用支付：combat-spec Runtime/AbilitySystem.cs 的
  CostUltimateSp 始终调用 SetUltimateSp；后者先检查系统解锁，再读取 MaxUltimateSp，
  最后钳制并比较 epsilon。依据 docs/normal-skill-ultimate-sp.md，不能假定属性默认零。
- 仍需查清投射物实例属性容器中 MaxUltimateSp 的初始化/来源及初始 UltimateSp。
  后续历史快照取证已确认 attributePatch 为空时走 CreateDefault，并由属性元数据提供
  默认值；本地两份 AttributeMetaTable 的 MaxUltimateSp 默认值是10，不是0。
  证据版本与地址以 combat-spec/launch-projectile-skill-routing 对应节为唯一依据。
  尚不能证明当前水弹无补丁，也不能据此确认当前能量初值。
  显式测试账户不提供这部分游戏证据，不允许据此删除临时适配器。
- SkillPaymentChange 的终结技能量变化现已携带实际账户 target，不再要求 operatorId；
  resourceChangePoints 保留 operator/abilityEntity 接收者，干员曲线仅消费前者。
  非零实体支付及 Setter 未应用的回执已用显式账户验证，不写入发射者轨道。
  这只闭合回执消费边界，不提供实体初始值、真实支付实现或正式回调准入。
- 接入次序：确认实体属性初始化 → 复用已确认的支付数值规则 → 区分资源事实消费者 →
  接实际准入与独立 AbilitySystem。不得建立一套“投射物专用免费支付”来绕过上述边界。

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

## 2026-09-10：动作程序层已接入正式 duration-finish 路径

正式 scheduleProjectileFinishCallback 已使用必填 callback 完整程序，替代即时 body。
编译器保留技能 ID、原生自然时长、初始黑板与所有区间；汤汤已重新生成。
ProjectileCallbackActionRuntime 复用公共序列解释器和 TimelineActionProcessor，
由现有组件 Default / 技能 Battle 两阶段推进，区间共享 direct 黑板，自然结束与对象
reset 独立。父动作结束不取消回调，回调结束清理自身附属 Buff。

该类当前只是动作程序适配层，不是完整独立 AbilitySystem：尚未消费已存在的
tryStartProjectileCallbackSkill，也未闭合 callback owner 的 beforeCast/SkillEnd 等
事件。不能把继承的 SkillCastInfo 当成宿主身份，不能向发射者伪造这些事件。
后续应复用公共技能宿主收掉这层生命周期适配，避免长期保留平行技能实现。
自然时长上界跳转、所有发射对象的引用、其余即时投影与完整 Disable 顺序仍是待办。

## 实体账户初始化的证据边界

权威取证记录位于 combat-spec 的 `docs/launch-projectile-skill-routing.md`，本处只记消费约束，
不复制地址和原生编码。当前确认的历史公共属性路径中，投射物不走普通能力实体的专属属性表；
复制属性初始化中的终结技能量写入只属于角色路径。不能从这两条事实推导投射物初始能量为零，
更不能继承发射者账户。首次创建、池化复用以及当前包实际属性补丁仍需闭合。

剩余实施顺序：先证明宿主资源初值及上限来源，再接公共账本及明确主体的支付回执，最后替换
`ProjectileCallbackActionRuntime`。已有显式账户接口不等于真实实体账户已完成；不得用临时
零费用账户越过`CostUltimateSp`的Setter语义。取证不扩大到空间运动或敌方主动行为。

## 必须覆盖的验收用例

- 同起点不同终点的动作分别 End，direct/entity 黑板不分裂。
- 零增量启动、自然时长到期与动作区间边界；技能先结束时清理剩余区间。
- 父技能结束不截断投射物；回调技能结束不冒充对象 reset。
- 回调施加的附属 Buff 绑定实际回调技能；来源施法信息仍保持原值。
- 多实例和重复回调不共享运行时序列、黑板或事件注册。
- 原生发射、对象 reset 与 SkillAffix 引用次数相互对应，解绑不释放对象。
- 正式干员重生成、实际轴逐 hit 差分；变化必须能追溯到上述游戏规则。

本设计不授权新增空间飞行、碰撞模拟、敌方主动行为或未知事件类型。

## 2026-09-10：从正式产物反查回调范围

对候选 mz38x5 的 31 份生成定义逐文件比较当前正式文件（仅归一换行，全部相同），
再从其未排版 operator.json 中按 withActionBlackboardScope.scopeKey 对应原生回调 ID：
找到 109 个回调技能，涉及 19 名干员。这是静态产物出现范围，不是实际战斗可达证明，
也不是所有投射物引用路径的穷举；不能拿这份统计关闭无回调对象的引用债务。
可复现脚本/完整报告位于忽略目录 tmp/audit-reachable-projectile-callbacks.mjs、
tmp/reachable-projectile-callbacks.json；源为 hybrid-20260905，来源结构统计见前文。

重要的生命周期边界：

- 洛茜 normal_skill_projhit2/3/4/5 产物含 repeatEachTick，均设置
  nativeChanneling.maxCountPerTarget=1。不能仅凭动作名称推断会持续重复伤害。
- projhit3 子序列施加 buff_chr_0028_wulfa_tut_normalskill_success，finishByAction=true。
  不能按名称中的 tut 推断它无效：原始 BuffData 及正式定义包含延后伤害动作。
  但它位于 Channeling 的 actionOnTick 内；combat-spec/docs/channeling-action.md
  已证明该子序列走 ExecuteInstant，进入态动作本次即 End/Reset。
  因而新回调宿主不能为了保留技能寿命，把该 Buff 延长到回调技能结束。
- 本次所见 startTimeDilation 均 finishByAction=false，不能一概在回调 End 时结束。
- 当前匹配范围未见 listenForCombatEvents，不代表游戏其他回调无监听；不能为未来
  假想监听去扩展资源准入，也不能因此删除公共区间宿主的清理能力。

新增公共运行时回归验证 Channeling 即时清理与更长外层区间独立，唯一目标次数上限
阻止重复触发，外层 End 不重复结束子动作。它验证现有语义，未修复即时投射物适配层，
更不构成完整回调技能宿主的验收。剩余改造须同时保留这条嵌套生命周期规则。
