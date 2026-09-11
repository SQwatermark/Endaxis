# 无战斗回调的投射物生命周期

2026-09-11接入。本文区分原生证据与Endaxis固定木桩模型的简化规则。

## 为什么不能直接删掉发射

回调只做表现，或者没有启用的回调，并不表示发射没有战斗影响。
原生SkillAffix可以接收发射通知并保留投射物引用，直到对象reset才释放。
因此生成器保留 `launchProjectileLifetime`，复用独立的投射物生命周期运行器。
来源技能结束不会提前销毁这个对象。

## 来源与样本

输入快照使用AKEDB `1.5.3@10024360-6`，VFS补齐ProjectileData。
VFS没有可验证的版本声明，不能称两者已验证同版。下列SHA-256标识本轮实际读取的JSON：

| ProjectileData                                     | SHA-256                                                            |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| `projectile_chr_0004_pelica_plunging_attack`       | `2149ef4c79da2dd187f88836a685040f6e672f18b67534a6abdb355bcc8329b6` |
| `projectile_chr_0027_tangtang_waterwake01`         | `82ce8c20b025c49079c20dc7f488d77db03ae9189a4394f97da4d9c19ef80c2c` |
| `projectile_chr_0016_laevat_combo_skill_indicator` | `ac93b0bc5cf8bf4a5e4393d4155574d3c8fd787c113be818b76d3d7a42d487e5` |

原生依据沿用combat-spec的 `docs/launch-projectile-skill-routing.md`：
首Tick碰撞与到达顺序、分段reach转移、命中次数结束、回调时长决定回收延迟、Tick与reset顺序。
这次没有重新反编译这些函数，也没有证明任意原生空间场景的飞行时刻。

## 支持的形状

- 佩丽卡：直线同点到达，只有表现hit回调。即使先发生碰撞结束，也在同一个首Tick内；
  未启用block和finish回调，因此不引入不同的战斗动作顺序。
- 汤汤：无回调的两段直线，每个移动Tick推进一段。保留原始持续时间上限2秒；
  无阻挡层，命中次数没有正上限，避免其他条件提前结束。目标来自能力实体查询，按实际结果逐个发射。
- 莱万汀：`finishOnReach=false`，但 `hitOnReach=true` 且 `maxHitCount=1`。
  已证明目标为敌人时，到达引发的一次命中就会结束投射物。动态筛选可能得到空组，必须保留运行时迭代。

Endaxis已把挂点、偏移和实体位置归入统一零空间。挂点非空或偏移非零，本身不是拒绝依据。
但目标身份、目标数量、移动类型、结束条件和回收延迟仍要单独核对。

## 时序与边界

启用回调参与回收延迟计算：取各回调的 `max(durationFrame, 1) / 30` 最大值，保留原生float精度。
它与动作区间长度不同。没有启用回调时才使用零延迟。

运行器先结束，后续Tick标记回收，再后续Tick执行reset。没有Tick就不能跳过这些阶段。
分段到达按实际获准的移动Tick计数，不把两段写成固定的两帧秒数；持续时间上限仍使用组件时钟。

本次不放宽同步来源时间缩放、未知移动模式、动态距离上限、额外可命中物体等边界。
表现回调路径不会伪造伤害或回调技能执行事件。含战斗动作的回调继续走原有技能编译路径。

实现见 [投射物编译](../../../tools/game-data-compiler/src/compiler/projectileRuntimeProjection.ts)、
[目标组处理](../../../tools/game-data-compiler/src/compiler/combatEntityAndTimeProjection.ts)、
[生命周期运行器](../../../src/core/combat/runtime/projectileLifecycleRuntime.ts)。
测试覆盖首Tick、分段到达、零delta、暂停、持续时间上限、延迟回收、目标组迭代和不支持形状的拒绝。

组合回归还检查了引用消费者：来源技能、输出Buff和普通能力实体都已结束后，SkillAffix仍等待
投射物reset；飞行、结束后等待回收、已标记回收三个阶段暂停，都不能提前释放引用。
装配层验证半速会延长回收所需的现实时间；目标组在首次发射中被覆盖时，本批仍使用已取得的快照，
下一次执行则读取新组。上述检查4文件178项通过，未发现需要改动运行规则的问题。
