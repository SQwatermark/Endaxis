# 投射物组件证据缺口

## 范围

当前全干员严格审计有 5 个入口停在 `projectile-data`：

- Wulfgard `chr_0006_wolfgd_ultimate_skill`；
- Liino `attack3`、`attack4`、`plunging_attack_end`；
- Ardelia `power_attack`。

这些入口共引用 9 个唯一 `projectileId`。它们的 `LaunchProjectile` 没有启用
hit/block/reach/finish 子 SkillData，因此 SkillData 调用图本身不能回答投射物是否还通过碰撞、
命中次数、结束条件或组件内逻辑产生战斗效果。`castSkillOnHit=false` 只证明对应回调关闭；即使
JSON 仍序列化了 `projectileSkillId`，也不能据此把整个投射物判定为表现对象。

## 2026-08-20 台式机本地取证

本机 `D:\Projects\vfs-index-browser` 的精确链路按
`Assets/Beyond/DynamicAssets/GameData/Projectile/data_<projectileId>.asset` 查询当前本地
manifest，并从对应 VFS bundle 导出 MonoBehaviour：

| projectileId                                     | 结果                       | 本地缓存身份                     |
| ------------------------------------------------ | -------------------------- | -------------------------------- |
| `projectile_chr_0006_wolfgd_UltimateWolf`        | 资源唯一命中，但组件未解码 | record `108325` / asset `69680`  |
| `projectile_chr_0025_ardelia_power_attack_start` | 资源唯一命中，但组件未解码 | record `108445` / asset `201442` |
| `projectile_chr_0025_ardelia_power_attack`       | 资源唯一命中，但组件未解码 | record `108561` / asset `68442`  |
| Liino 的 6 个 projectileId                       | 当前 manifest 无精确资产   | HTTP 404                         |

前三份导出 JSON 只包含 `m_Script`、`m_Name`、`m_Enabled`、`m_GameObject` 和 `Name`，没有
managed-reference registry，也没有
`layout == Beyond.Gameplay.Core.ProjectileComponentData`。接口因此返回 422。这个结果表示当前
AnimeStudio 导出/类型树链退化，**不表示原始资源没有 ProjectileComponentData**。

仓库保留的庄方宜旧调试导出证明聚焦解码器曾能进入 managed reference，并识别
`Beyond.Gameplay.Core.ProjectileComponentData`；该样本仍因版本布局差异在
`allowHitSameTarget` 处报告 `invalid bool32 -1`。当前目标导出连 managed-reference 层都未进入，
不能借用旧样本字段偏移解释新资源。

## Endaxis 决策边界

- 继续保留这 5 个 `projectile-data` 阻断；
- 不按 projectileId、关闭的 SkillData 回调或空调用图推断“纯表现”；
- 不把旧版本/其他 projectile 的组件字段移植到目标资源；
- 只有同版本 `ProjectileComponentData` 至少恢复碰撞、目标过滤、命中限制、结束条件和组件动作
  后，才能判断固定单敌人、零距离模型下它是可省略、一次命中还是需要新的运行时操作。

恢复顺序应先修正 VFS 工具的 managed-reference 导出并重新索引包含 Liino 的同版本 manifest，
再重新运行 9 个精确 ID；这属于证据工具链任务，不应通过放宽 Endaxis 编译器绕过。

## 相邻但独立的养成缺口

本轮也复核了两个看似可直接套用现有编译器的候选：

- Camille 潜能 5 修改隐藏被动 `chr_0033_camille_passive_talent1.atk_up += 0.06`；该被动尚未生成，
  不能把它映射到任一可释放技能组。原始被动监听治疗事件并区分自身/队友目标，需先闭合被动程序。
- Last Rite 天赋 1 不是静态 Buff。它监听 `OnConsumeBuff`，读取被消费层数，计算
  `crystal_vul = infliction_num * crystal_up`，再给目标施加 15 秒晶体易伤。当前元素附着适配器在
  消费时已经持有元素与层数，但尚未发布这一语义事件；同时仍需证明原生 Tag `-193971080`
  与 Next 的元素附着集合严格对应，不能按字段名猜测。

两项都继续保留为未转换，不用 `skillBlackboardPatch` 或 `attachedPassive` 做半套接入。
