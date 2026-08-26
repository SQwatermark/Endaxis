# 武器目标层数投影与 r3 发布

2026-08-27。只修复固定木桩下可观察的伤害/资源链，不新增敌方主动行为。

## 证据与错误

复刻库既有 `save-buff-stack-num-advanced.md`、`buff-and-damage.md` 和
`physical-infliction-actions.md` 确认：原生 `BuffCount` 累加未结束 Buff 的增强层数；
Save 的 ID 列表逐项求和，重复 ID 也重复计入。它不是实例数或不同 Buff ID 数。
Target、Source、Owner 必须分别投影，不能因为使用 Tag 查询就全部变成事件目标。

统一编译器的旧 Target/Tag 分支输出 `eventTargetBuffCountCompare`，执行的是实例计数；
Save 同时输出 `countType=instance`。因此 `wpn_claym_0017` 猛击前读取破防时，
增强三层的同一个 Buff 只读到 1。最低词条等级下，三层/四层均误给 12% 物伤增益，
应分别是 `9% + 3% × 3 = 18%`、`9% + 3% × 4 = 21%`；最高等级对应 50.4%/58.8%。

1.4.4 原始 SkillData（位于忽略的 `tmp/game-data-sources/skill-data-cdn`）：

| 文件                   | SHA-256                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| sk_wpn_claym_0013.json | b9461959602fbb0fb390ac6986374613bc3b30f878817543187813094d6fec2b |
| sk_wpn_claym_0017.json | 98265ed7c212459a16121b238e8f07b02411fe51bb50e5af844c4f3d2927c504 |

`0017` 的 Check/Save 均明确使用 Target + Tag(1075718177) + BuffCount；先检查猛击类型，
再读取尚未消费的破防，计算增伤并给来源施加 Buff。`0013` 使用伤害包 comboSkill 标签和
目标寒冷附着标签 1570888476。冻结标签不同，不能替代寒冷附着。

## 修复与验证

- 公共 Tag/BuffCount 输出现有 `buffStackCompare`，显式保留目标；Save 使用增强层数默认模式。
- Save 的 ID 模式逐 ID 累加，保留重复项；显式 DSL 实例数模式保留用于历史定义，不改变其语义。
- `generatedWeaponStateBranches.test.ts` 经过正式配装、公共 Buff/猛击、实际事件和伤害管线，
  以受控技能排程覆盖敌方 0/1/3/4 层、持有者有层而敌人无层、最低/最高词条和自然失效。
  猛击步骤及参数黑板来自正式大潘连携；排程本身是隔离夹具，不冒充大潘实战时序。
- 寒冷附着能触发 `0013`，冻结不能。原生 OnBeforeOutputDamage 位于公式计算之后：
  当前命中不能追溯加成，后续命中增加 20%/56%，15 秒后恢复基线。测试已固定这一顺序。
- `generatedWeaponReactionLifecycle.test.ts` 的 20 项测试补齐上批两条光环的六类附着/反应正反分支、
  持有者/队友、强弱项独立计时、同帧/0.1 秒 marker、满层替换及两名持有者隔离。
  这是受控时序下的生产链验证，不宣称恢复原生全部 PreLateTick 同帧顺序。

正式重生成只改变五把：`wpn_claym_0013`、`wpn_claym_0017`、`wpn_lance_0006`、
`wpn_sword_0015`、`wpn_sword_0017`。后三把读取的是单 ID 的普通 Stack Buff，每实例增强层数为 1；
修正投影不等于已经验证了它们所有触发和寿命分支。旧装备套装中的实例计数条件本批未改，
仍需结合真实阈值和事件归属在统一装备迁移中审计。

默认版本升至 `endaxis-next-definitions-v2-weapons-1.4.4-r3`，五项 r2 旧定义存为正式差量快照；
r1 先恢复 r2 再恢复自身差量，整库旧哈希不变。v1/r1/r2 均经确认、备份再打开。
r1/r2 的 77 把分别验证，既有等级及项目内容原样保留，只修改 revision。
r3 整库哈希为 `4f0283089cc10075ebf50bbab6cd972f8b6393f580b80d8e66ddf2107bd4080e`。

本机原子目录 rename 再次 EPERM；未改变 writer 安全规则。调用相同公共 renderer 生成文件计划，
通过 apply_patch 安装五项差异；随后正式 `generate:game-data:weapons --check` 77 把/78 文件通过。
计划与审计只在 tmp/，不得提交。

## 新发现：艾维文娜连续排轴仍有真实阻塞

在正式 `avywenna`、`wpn_lance_0006`、干员 90 级/潜能 0/天赋全关/技能 12 级下，
按现实帧 `[1,151,301,451,701]` 放置 `[连携,连携,连携,战技,普攻]`，
词条最低/最高等级均报 `action blackboard value 'EntityBB_talent0' is missing`。
`generatedWeaponsSimulation.test.ts` 保留两条**已知缺口诊断**，严格要求这一错误；
它们不是成功模拟样本，修复时必须改为实际伤害/资源断言。

已核对：

- 原始 `chr_0012_avywen_combo_skill_lance_back.json` 的 ModifyDynamicBlackboard
  将 `talent0_usp` 写入 `EntityBB_talent0`；终结技回收枪亦有同形写入。
- `chr_0012_avywen_combo_skill_lance_back_reach.json` 随后读取该键。
- 旧正式干员展平定义的战技留下两处读取，但没有对应写入。

这证明是回收枪子链的缺口，**不能据此认定为角色模板默认值缺失，更不能补零**。
下一步需核对投射物/子技能宿主、黑板传递和调用顺序，再由统一编译器迁移该分支。
已有 301 单技能上轴和 966 四技能交叉场景仍通过，不能外推到这种更长连续排轴。

## 后续优先级

1. 艾维文娜上述回收枪链：可复现阻塞，影响能量与连续排轴，优先于继续扩大边角武器测试。
2. 其余干员的完整统一迁移：按伤害、资源、替换技能、跨技能实体消费者排序。
3. 武器/套装剩余计数与附着寿命分支，尤其普通 Stack 的积累/消费，建立数值正反例。
4. 项目备份下载落盘验收；纯保护/镜头及无可见影响的原生调度继续后置。

本批沿用已有 C# 机制证据，combat-spec/VFS 未改，也未重新执行其测试。

最终 Next+统一编译器 **300 文件/3497 项通过**（净增 112），两侧类型检查通过。
其中包含上述两条“预期报出精确缺键错误”的诊断，不是 3497 场成功模拟；
原 301 单技能与 966 交叉场景门禁保持通过。报告 `tmp/weapon-buff-count-r3.audit.json` 不提交。
