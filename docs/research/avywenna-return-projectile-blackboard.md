# 艾维文娜回收枪：黑板宿主与回调切片

2026-08-27。最新批将伤害、潜能倍率及回能切片接入真实场景模拟；上一批闭合模板初值证据、
公共回调作用域及写入/资源守卫。**尚未替换正式艾维文娜技能定义，连续排轴的原始报错仍存在**。
不得把切片测试计入整技能成功率。

## 最新：动态伤害与真实资源总线验收

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
