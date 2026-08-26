# 艾维文娜回收枪：黑板宿主与回调切片

## 2026-08-27：called Buff 后的 JumpTo 与实体退出

枪本体的退出路径已经闭环，不再属于下文“死亡时序未知”边界：

- 连携枪与终结技枪子技能都在第 0 帧创建 `JumpToAction`，用当前枪自身的 Owner Buff 检查
  `buff_chr_0012_avywen_lance_becalled`；不读取木桩或施法者 Buff。
- 条件未满足会随子技能局部时间 Tick 重试；首次满足后跳到 1500。目标帧动作在下一 Tick 开始并
  执行 `FinishOwnerAction`。
- 1.4.4 `BaseController.OnDie` 只启动回收计时，`_ElapsedReleaseTick` 才进入 Release。两类枪模板
  `delayToRecycleSeconds=0`，所以 Next 投影为死亡同帧仍在目录、下一次实体 advance 退出。
- 生成定义的真实连携枪 childSkill 已通过正式 ScenarioSimulationService：回收标记落到实体后触发
  跳转、死亡和唯一结束回执。单位测试同时锁定 dead 同帧仍可被 owner 查询到。

combat-spec 证据与方法 RVA 见 `docs/avywen-return-lance-lifecycle.md`，实现提交 `ba62cd6`。
这里仍未闭合的是**回收投射物**的 hit/reach 调度如何由原战技发射链装回正式定义，以及投射物局部
`EntityBB_talent0` 写入怎样进入 reach 回能。下文关于“正式连续排轴仍报错”的判断因此仍然有效；
只需把“枪实体回收未知”更新为已完成，不能据此提前宣布完整技能贯通。

2026-08-27。最新批贯通逐枪目标与回收标记；此前将伤害、潜能倍率及回能切片接入真实场景模拟，
并闭合模板初值证据、公共回调作用域及写入/资源守卫。**尚未替换正式艾维文娜技能定义，连续排轴的原始报错仍存在**。
不得把切片测试计入整技能成功率。

## 最新：查询实例、逐枪守卫与回收 Buff

combat-spec `f3bb824` 先补 `docs/foreach-target-and-distance.md` 和两个运行时原语。
`ForEachAction.ExecuteInternal` RVA 0x045826A0 先复制目标列表，每项以单目标句柄执行子序列，
不传播子序列 false，不改变 Owner/Source/黑板；不遍历独立 hittable 列表。
`CheckDistanceCondition.ExecuteInternal` 0x0456DF60 的无半径分支证明 lessThan 为 <=，
反向为 >，任一位置缺失则 false。空间归零仅在 Endaxis 投影，复刻库仍按真实位置计算。

源夹具 `tools/game-data-compiler/test/fixtures/avywenna-return-targets.json` 固定原战技
timelineActions[9]/[10] 的查询、数量、lance_count 写入，以及 ForEach 中的距离与 called Buff，
附源 SHA 和两个模板的原始 JSON/哈希。显式排除动作 66/67、74/75（发射点与投射物发射）。
不是生产中间产物，也不是完整战技定义。

公共 Action 投影复用 `compileTargetGroupAbilityEntityQuerySource`，只允许已绑定施法者的
Owner/Source 查询、模板 born-tag 筛选及同施法验证器；查询结果仍来自真实实例目录并保留
生成顺序。零对象掩码保留空数组，不能退化为所有实例。此标签降级要求调用方确认相关标签不会
运行时增删；动态实体标签不在这条投影内。连续查找、其他 owner、距离验证器/排序后处理及
excludeDeadEntity 等未接路径严格拒绝。条件/循环复用同一公共 Sequence 编译器，没有第二套
干员专用动作分派。

ForEach 将 Target 绑定为 currentAbilityEntity，固定 Target 下残留的 `targetGroupKey=lances`
不生效；CreateBuff 的 ActionSource 保持 caster，并继承当前回收施法信息。Next 运行层同步修复
了逐项 false 抛错，改为只停止当前项后继；异常仍抛出。快照、空集合、共享黑板、循环后继均回归。

验收分层：

- 14 项公共编译与拒绝测试；13 项实例/Buff 联合测试（其中 4 项真正经 placeSkillGroup →
  ScenarioSimulationService）。两类枪、0/1/3 数量、队友/模板/同施法隔离、唯一 Buff 和零距离
  边界都验证。正式场景中的 100 固定伤害是只在枪上读到标记才执行的测试探针，不是游戏伤害。
- 2 项运行层测试证明 false 只跳过本项、原组改写不改变本轮快照、空组成功且异常不被吞掉。
- 全量 Next+公共编译器 **305 文件/3643 项通过**，净增 29；两侧类型检查与武器 --check 77/78
  通过。C# 新增 9 项通过，全量 1388 通过、17 项既有本机资产缺失失败（未扩大失败集合）。
  报告 `tmp/ability-entity-return-targets.audit.json` 与复刻库
  `tmp/foreach-distance-tests/foreach-distance.trx` 均不提交。

**未完成**：标记不会自行销毁枪。原子技能每帧检测自身 called Buff，JumpTo(1500) 后执行
FinishOwner；静态方法链确认 TryJump 0x033D87A0 消费条件并请求 TimelineActionProcessor.JumpTo，
但完整动作装配仍待实现。复刻库既有 `zhuangfy-sword-replacement.md` 证明 FinishOwner 对普通
AbilitySystem 是 HP=0/Die，不是立即从 parent.children 移除；死亡到 Finish/Release 的具体时序
尚不清楚。当前 Next 活动实例目录没有这个中间态，因此不能把它当作重复回收规则的证据。

下一步优先核对并接入上述子技能结束路径及输出相关的退出边界，再接发射/回调时序、终结技枪
附着与时间膨胀。只处理会改变命中/能量/可见时刻的分支，不建立空间或敌人主动行为系统。
本批未替换正式技能和两条缺键门禁；wpn_lance_0006 三层 0.3/0.84 分支仍待解锁，revision r3 不变。

## 上一批：动态伤害与真实资源总线验收

公共 `compileEventTargetSimpleDamageOperationSource` 现在保留 Hp 的动态攻击倍率、后置 Poise，
并严格映射 `NormalSkill=256`、`CanBreakWeakness=4096`。其他位（包括 JS 32 位截断可能漏掉的
高位）拒绝。普通 `AtkScaleCalculation` 读嵌套倍率，简单计算读顶层倍率且不读失效的残留公式。
这里复用 combat-spec `damage-formula.md`、`skill-data-damage-adapter.md`、`DamageEnums.g.cs`
已有证据，不新增原生规则；同时修正此前未拒绝 `takeAtkSnapshot=true` 的边界，未实现施法快照时
必须失败，不能偷偷改成命中实时计算。

公共 Action/Condition 投影增加显式 `Target=enemy` 的有界入口。原来的 Buff 事件 Target 不变；
主动回调查询木桩 Buff 时不再要求虚构事件，Source/Source 的 Buff 和资源归已绑定施法者。
投射物 Owner 暂未接入的部分用 `actionOwnerTarget=unavailable` 标明，Owner 伤害、Buff 条件、
施加来源或资源动作继续拒绝，不能把投射物本身误认成角色。TargetGroup/ForEach、事件专用条件等
尚未验收的主动路径不会因此被放行。

两类回收命中的原始潜能分支固定在 `tools/game-data-compiler/test/fixtures/avywenna-return-damage.json`，
保留源 SHA、原始动作序号、分支条件、乘算及两侧伤害，并列出从切片排除的动作序号。
该有意选择的测试夹具不是生产定义/中间审计；完整源文件、抽取脚本和全量测试报告仍在 tmp/。

`projectileCallbackDamageSimulation.test.ts` 现在通过真实 `ScenarioSimulationService` 排入测试技能：

- 两种枪的生命/失衡/回能依次发生，非零伤害实际写入敌人生命；不是 mock 接收端。
- 标签与潜能条件同时满足时，真实最终伤害比无潜能对照提高到约 1.15 倍，失衡不跟着乘算。
  给施法者增加 40% 战技伤害的测试 Buff 后，真实最终伤害为 1.4 倍，证明分类进入公式。
- 0/2/3/4/5/6 回能输入 × 天赋 Buff 有/无 × 两种枪全部验证；非零回能只进施法者资源账本，
  不流向同队另一实例。此处只借正式角色面板和天赋存在 Buff，不安装旧技能或养成补丁。
- 同一静态发射节点连续三次、再施放一次得到六次相同倍率，回能 6×6=36，不累乘潜能、不串板。
  只给 reach 调用时，模板零值不产生伤害、失衡或回能。

**仍然只是切片**：测试显式输入 hit→reach 顺序，不证明游戏零距离时的事件次序；原生 Target 资格、
枪实体创建与回收、终结技枪的附着、中断/拉拽、时间膨胀不在此测试中。标签状态用无其他效果的
测试 Buff 提供，不宣称已经证明哪种完整游戏异常满足它。测试输入倍率/回能也不是完整养成转换
的证明。正式的两个连续排轴报错断言仍保留，`wpn_lance_0006` 三层增伤验证仍未解锁。

下一批不再重复补黑板默认值，直接围绕原战技 timelineActions[1]/[8]/[9]/[10] 统一投影
目标组和逐枪操作：回收标记应作用于当前能力实体，回调伤害 Target 才是木桩。随后闭合有效枪的
回收/退出生命周期，以及影响 hit 时刻的附着和时间膨胀；仅保留会影响模型输出的行为，
不建立移动/碰撞/敌人主动行为系统。正式重建完成后才替换旧生成定义及已知报错门禁。

最新验收：Next+统一编译器 **303 文件/3614 项通过**，净增 67（真实模拟 38、公共伤害/边界 26、
Buff 目标隔离 3）；两侧类型检查、武器重建 `--check` 77 把/78 文件通过。
报告 `tmp/projectile-return-damage.audit.json` 不提交。正式数据及武器 revision r3 不变；
combat-spec/VFS 本轮未改未重跑，沿用其既有证据和上批测试基线，不把旧 C# 结果写成本轮验收。

## 最新实现：首帧调度证据与完整回调动作图

combat-spec `ef1b068` 从 1.4.4 `ProjectileMovementSubComponent.OnTick`（RVA `0x03D7E690`）
恢复了非对称 tick 顺序：首次 tick 在 `0x03D7E6F7` 先 `_CheckCollision`，随后在
`0x03D7EF64` 移动/判定 Reach；普通 tick 到 `0x03D7F0B4` 才在移动后查碰撞。
`ProjectileComponent.Reach` 又会先同步施放 reach 技能，再读取 `hitOnReach`。两份回收枪均为
`finishOnReach=true`、`hitOnReach=false`，零距离唯一木桩模型使它们首帧重叠且同帧到达，故这里
可严格得到 hit → reach。一般飞行帧、`hitOnReach=true` 或非重叠起点不得复用该结论。

统一 TS 编译器新增：

- ProjectileComponentData partial 来源解析，保留并门禁目标筛选、命中次数/重复命中、碰撞时机、
  时间/距离延迟、到达结束、预设点和移动段；
- 宿主显式安装的 `LaunchProjectile` 公共叶子扩展；缺扩展继续带来源路径失败；
- 从完整 hit/reach SkillData 动作图编译回调的入口，只接受 startFrame=0 的同步回调；endFrame 是
  动作区间而非延迟触发时间，不要求为 0；
- 原生时间膨胀优先级由调用方版本目录解析；inline 全局曲线与命名 Entity 曲线进入现有 DSL；
- Interrupt、EnemyHurtAnim、Pull、OnlyTarget HitStop 只在敌方静态木桩目标下省略；Effect 与镜头
  动作严格校验根字段后在无渲染后端省略，其他目标/形状仍失败关闭。

本机直接读取两份完整 hit SkillData、公共 reach SkillData、两份 ProjectileData 和模板黑板证据，
两条整链均成功生成独立 hit/reach 作用域。完整源仍在 tmp/，Git 只保存固定哈希的有界来源夹具。
这已消除“切片可能漏掉控制/时间膨胀”的编译器风险，但**还没有正式重生成艾维文娜技能定义**；
旧展平定义和两条连续排轴失败诊断暂不改动。

本批最终门禁：Next+统一编译器 305 文件/3647 项通过，两套类型检查通过；武器定义
`--check` 为 77 把/78 文件。combat-spec 投射物路由聚焦测试 7/7 通过。

## 来源与结论

先沿既有 combat-spec `skill-blackboard.md`、`launch-projectile-skill-routing.md` 追踪所有权，
再读取本机 VFS 原始投射物。VFS 原未监听，使用现有无窗口启动脚本恢复 8765 服务；
只导出两份精确 container，没有启动 AnimeStudio GUI，没有修改 VFS 代码。

| 原生投射物                                             | 原始 SHA-256                                                       | 模板实体初值                  |
| ------------------------------------------------------ | ------------------------------------------------------------------ | ----------------------------- |
| `projectile_chr_0012_avywen_combo_skill_lance_back`    | `8391a88b037a8ce14aa5167f29c450b8ade6e0f47f888a0abbe838761d8301ae` | `EntityBB_talent0=0`，dynamic |
| `projectile_chr_0012_avywen_ultimate_skill_lance_back` | `82807ea31da6944c48874859360c2ad8e63ff93d4bb528e778006e30a891d228` | 同上                          |

不是搜索字符串后猜宿主：从 MonoBehaviour 根 RID 读取 ProjectileTemplateData 的基类字段和
componentList，确认其实际引用的唯一 AbilitySystemData，再用 VFS 已有前缀字段读取器核对。
两份 AbilitySystem 前缀结束于 1100/1112，各剩 548 字节未知后缀；根的组件列表之后分别
剩 200/204 字节。保持 partial，只对已读取字段作结论。

数据链：

1. 战技 `chr_0012_avywen_normal_skill` 的 timelineActions[9]/[10] 内，动作 67/75 发射回收枪。
   assignBlackboard=true，assignEntityBlackboard=false。
2. hit 路由到对应 `...combo_skill_lance_back` / `...ultimate_skill_lance_back`；动作 2/3
   从该回调 direct 的 `talent0_usp` 写到投射物实体 `EntityBB_talent0`。
3. 两条 reach 都路由到 `chr_0012_avywen_combo_skill_lance_back_reach`。timelineActions[2]
   依次检查实体值 >0、Source 的天赋 Buff 层数 >=1，才向 Source 返还该值的终结技能量。
   此处不是冷却 Buff；没有命中时也不能伪造写入。

旧正式产物在战技中展平了回调：保留回能读取，却丢失写入和上述两个守卫；还丢失投射物宿主边界。
因此给角色 entityBlackboard 补零既不能恢复非零回能，也会把不同发射的生命周期混在一起。

## 上一批实现：黑板与守卫

- 现有 `withActionBlackboardScope` 增加可选 `lifetime: execution`：每次执行创建新板，
  但同次执行的 tick/end 使用同一板。缺省仍复用，缓存由静态 scopeKey 改为父板身份 + scopeKey。
  解决多个宿主内同名回调及同一 ForEach 静态发射点可能串板的问题。
- 可选 `alwaysNext` 保留回调内部短路，但不把其失败结果传播成后续独立回调无法执行。
  两个新字段经过定义验证、等级编译；原有未声明这些字段的定义保持原有默认行为。
- 公共 `compileSynchronousProjectileCallbackScopesSource` 包装独立投射物宿主与各回调 direct 板。
  只消费原生路由、明确模板初值及外层给定的同步调用顺序；不根据 ID、距离或数组顺序臆造事件。
- 公共资源动作允许已证明 ActionSource=caster 时的 Source/Source；接收侧 buffSource 等未覆盖
  身份继续拒绝。没有复制一份干员专用 ObtainCostAction 编译器。
- 真实写入和到达守卫经同一 Action/Condition 编译入口进入 Next 动作运行时；覆盖 0/2/3/4/5/6
  值 × 天赋 Buff 正反例、重复发射、源继承关闭、无命中到达、缺模板/错路由/缺键严格失败。
  这里 Buff 存在与资源接收端是测试替身，验证的是条件、值和归属，不是完整伤害/资源总线验收。

原始 SkillData 最小切片固定在 `tools/game-data-compiler/test/fixtures/avywenna-return-blackboard.json`，
含源文件 SHA-256；这是测试夹具，不是生产中间产物。完整源数据、二进制和单次审计仍只在 tmp/。
同一模板初值也进入 combat-spec 证据文档，增加 3 个跨回调 direct/entity 隔离测试，无原生行为猜测。

## 尚未闭合及下一步

1. 先补统一主动动作投影，把战技的实体遍历、回收标记、发射及 hit/reach 调度整体重新生成。
   **不能只把本切片插到旧回能步骤旁边**：旧产物还混合了能力实体目标与木桩目标、子技能倍率和
   生命周期。需要对照原生节点逐项保留，不能把现有展平结构当作正确基线。
2. 本公共包装只支持外层已证明的同步回调、每个子技能首次调用和静态创建基线。
   独立 SkillPatch/extra、重复回调动态恢复、异步调度、实体赋值明确未接入；不为此建立移动/碰撞引擎。
3. 用新的完整投影替换正式战技后，再把 `[连携,连携,连携,战技,普攻]` 的两个报错断言改为
   实际 hit/能量正向断言；增加终结技枪、重复回收、天赋/潜能两端和多人隔离。
4. `wpn_lance_0006` 三层后 0.3/0.84 增伤分支仍被该排轴阻塞，尚未完成正式分支验证。

不处理敌人主动行为、盾/霸体等当前无可见输出的机制。不修改旧版或 Python 生成器。
本批正式干员/武器数据不变，武器 revision 保持 r3。

## 上一批复核

```powershell
pwsh -NoProfile -File D:/Projects/combat-spec/tools/Inspect-ProjectileBlackboard.ps1 `
  -InputPath tmp/avywen-return-projectile-raw/objects/0000-pFAE18822A32B45BF.dat `
  -ExpectedId projectile_chr_0012_avywen_combo_skill_lance_back `
  -VfsExtensionAssembly D:/Projects/vfs-index-browser/unity-worker/src/Endfield.Extensions/bin/Release/net9.0/Vfs.Endfield.Extensions.dll

npx vitest run src/next/application/projectileCallbackScopes.test.ts `
  src/next/core/combat/runtime/combatActionSequenceRuntime.test.ts --maxWorkers=2
```

原始资源可通过 VFS `/api/projectile?projectileId=<精确ID>` 获取 source.asset/container 与
source.bundle.recordId，再下载 `/api/raw?id=<该recordId>` 并用 UnityWorker 的
`export_monobehaviour_raw` 导出。不要在另一版 manifest 上复用本机 recordId。

本批 Next+统一编译器 **301 文件/3547 项通过**（净增 50），两侧类型检查通过，武器
`--check` 77 把/78 文件通过。新切片 38 项，运行层 6 项、定义验证 6 项；上批两项已知
整技能缺键诊断继续保留。C# 聚焦 6/6，全量 1379 通过、17 项既有 assets 缺失失败。
只读原始模板探针完成两份成功和错 ID 拒绝验证。
审计 `tmp/projectile-callback-scopes.audit.json`、C# `tmp/spec-projectile-callbacks/projectile-callbacks.trx`
不进入 Git。
