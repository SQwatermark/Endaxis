# 武器反应光环：目标侧前置事件与监听器来源

更新：2026-08-27；来源版本 `1.4.4@9433094-12`。

## 已闭环的错误

`wpn_pistol_0005` 与 `wpn_sword_0010` 在入战初始化时，把监听光环装到敌人身上。
此前全技能和 966 场交叉模拟都能成功，但没有验证这些光环的正反触发及伤害差分。

1. 元素适配器添加附着、爆发和复合状态 Buff 时发布来源侧 `OnBeforeOutputBuff`，却漏掉接收侧
   `OnBeforeAddedBuff`。因此敌人身上的反应监听器不能被正常反应触发。
2. 公共 Buff 编译器把 `Source/Target` 比较成物理事件的 `sourceId/targetId`，并把新 Buff 的
   `ActionSource` 当成事件施加者。仅补事件后，持有者自己触发仍走普通分支，队友触发则把增益
   错加给队友。

这两项都直接影响输出伤害，不需要敌人主动行为、玩家受击、距离或镜头模型。

## 证据边界

复刻库基线 `d45aa1b` 已包含以下规则，本批不新增或猜测原生行为：

- `combat-spec/docs/before-output-buff.md` 与 `Actions/AbilityActions.cs::TriggerBeforeAddedBuff`：
  目标侧事件值 205，在来源前置事件之后、Buff 创建之前执行；其输入目标是实际施加者。
- `Runtime/Buffs.cs::BindAbilityEventEnvironment`：监听 Buff 的动作环境重新绑定
  `SourceAbilitySystem=Source`、`OwnerAbilitySystem=Owner`，保留事件的目标。
- `docs/check-targets-equal.md`：比较解析后的实体身份，不能比较枚举名；本批是已有唯一实体子集，
  不扩展任意目标集合或空列表规则。
- `BuffData.buff_wpn_pistol_0005_inaura`：两条独立 205 响应先检查冻结/腐蚀标签，再比较
  `Target/Source`；相等时把 `dmg_up` 与 `crit_up2` 乘 `multi=2`，否则保持基础值。
  两侧 `CreateBuffAction` 的接收者与来源都为 `Source/ActionSource`，即光环创建者。
- `BuffData.buff_wpn_sword_0010_inaura`：灼热/腐蚀标签、Source 定时标记门禁与 Source 增益；
  本批同步修正定时标记和加 Buff 的来源归属。

原始文件在忽略的 `tmp/game-data-sources/BuffData`，SHA-256：

| 文件                               | SHA-256                                                            |
| ---------------------------------- | ------------------------------------------------------------------ |
| `buff_wpn_pistol_0005_inaura.json` | `cc9d15d060217f52f2c293e7b4d263b16dc94bd9c3a57190dcbbdf5ec88fe135` |
| `buff_wpn_sword_0010_inaura.json`  | `e499283e95f37633e3eb46ce07086d98b0e21bde4c89f1e33c622c0a5261d63a` |

## 实现和生产验证

- 元素适配器的所有加 Buff 路径补齐两侧前置回调；添加失败仍有前置尝试，但没有成功事件。
- 公共编译器按事件和宿主投影 205：`Source→buffSource`、`Owner→buffOwner`、`Target→eventSource`；
  比较使用已有 `eventSourceMatchesBuffSource`，物理事件的来源/目标不被重命名。
- 加 Buff 来源增加显式 `buffSource/buffOwner`，缺相应实例上下文报错，不回退到当前事件施加者。
- 205 下尚未审计的条件、动作继续拒绝；未批量重解释其他事件的 Target/Tag/BuffCount。
- 真实汤汤战技触发冻结，与佩丽卡预先附着配合；另一分支由汤汤先附着、诀战技触发腐蚀。
  持有者及队友两侧 × 词条 1/9 级均对比仅关闭武器初始化的同构筑：
  增伤分别为 `0.07/0.196` 与 `0.035/0.098`，暴击率增量分别为 `0.04/0.112` 与 `0.02/0.056`。
  这些增量进入真实 hit 的倍率、暴击率和非暴击伤害；图标保留，15 秒后后续 hit 回到基线。
- 仅有寒冷附着不触发上述光环。冻结/腐蚀不是附着标签的别名。
- 真实佩丽卡→诀反应使持剑者莱万汀获得增益，后续战技火伤在词条 1/9 级增加
  `0.08/0.224`，Buff 20 秒后结束。未把这项回归夸大为灼热分支、连续叠层或所有冷却边界已验收。

正式生成差异恰为上述两把武器；默认 revision 升为 `endaxis-next-definitions-v2-weapons-1.4.4-r2`。
v1/r1 项目继续走确认、原定义备份及打开副本；r1 不需要新增等级，其他内容保持不变。
原定义以差量兼容快照保留，r1/r2 整库哈希分别锁定，不能直接改旧发布哈希。

本机生成器原子目录 rename 两次遇到 EPERM（含 tmp 目标），未降低 writer 安全要求，也未重启服务。
本次调用同一公共编译/渲染入口得到完整文件计划，经 apply_patch 安装唯一两项差异；随后正式命令
`generate:game-data:weapons --check` 验证 77 把/78 文件与原始来源完全一致。临时脚本和报告不提交。

后续优先验证相同接收方向的其他伤害被动，以及这两条光环的连续叠层/定时标记边界；
完整干员编译迁移仍未完成。不能以本批无报错宣称所有被动分支已验证。

最终 Next+统一编译器 298 文件、3385 项测试通过（净增 95），两侧类型检查通过；
301 技能逐项上轴、966 场武器交叉模拟均无豁免。报告 tmp/weapon-reaction-branches.audit.json 不提交。
本批没有重新执行 C# 或 VFS 测试，也未重新做浏览器下载落盘验收。
