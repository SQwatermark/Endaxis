# 洛茜 `normal_bleed` 治疗链边界

## 结论

`buff_chr_0028_wulfa_normal_bleed` 的基础流血、暴击追加伤害和自疗属于同一递归 Buff 链，不能只抽取基础 DoT 后把战技标为完整。该链现已闭环：嵌套 Buff 中的 plain `Source` 由实例保存的创建来源 ID 动态解析，治疗动作也显式保留 `alwaysNext`，不再把实际治疗量冒充动作成功状态。

## 数据事实

`buff_chr_0028_wulfa_normal_bleed_crit_extra_damage.json` 的每条伤害分支均按以下顺序执行：

1. 对流血宿主造成追加物理伤害；
2. 对 plain `Source` 执行 `HealAction(Normal, healer=ActionSource, Wisd * heal_scale)`；
3. 治疗动作的 `alwaysNext=false`；
4. 只有动作继续后，才检查 `Source` 不持有 `buff_chr_0028_wulfa_talent2_heal_effect` 且生命比例小于 1；
5. 条件成立时给 `Source` 创建该天赋效果 Buff。

燃烧标签分支先把 `atk_scale` 和 `heal_scale` 乘以 `burning_damage_scale=1.5`，另一分支直接使用传入倍率。两个分支的治疗和后置条件结构相同。

因此，满血时 `actualHealing=0` 只会令后置 `CheckHp(LT 1)` 为假；它本身不能被解释为 `HealAction` 执行失败。

## 1.4.4 运行时代码证据

- `HealAction.AlwaysReturnTrue`：RVA `0x06CFAA08`。未热更路径直接读取动作 Data 偏移 `0x20` 的布尔字段，即序列化的 `alwaysNext`。
- `HealAction.ExecuteInternal`：RVA `0x06CFAA60`。它对解析出的目标创建治疗 `Modifier`，调用 `Modifier.Apply()`（RVA `0x039382D0`），并把“返回值等于枚举零值 `ApplyResult.Succeed`”汇总为动作返回值。
- `ApplyResult` 的声明顺序为 `Succeed / Failed / Cancelled`，所以比较零值是在检查 `Succeed`，不是检查实际治疗量是否大于零。

这证明 `alwaysNext=false` 的语义是保留真实应用失败的短路，不是“没有恢复生命就短路”。当前 Next 标准环境没有治疗取消/免疫输入，`HealOperationExecutor` 也始终返回成功；未来若引入取消结果，默认序列短路应继续生效。

## 已实现的闭环与剩余边界

- Buff 应用、嵌套生命周期与 Ability 事件上下文均携带精确 `buffSourceId`；plain `Source` 治疗和 `CheckHp` 编译为 `buffSource`，运行时据此解析对应干员生命账本。来源缺失或目标没有面板生命账本时失败关闭。
- `HealAction.alwaysNext` 已进入来源模型、DSL、校验、编译和执行链。标准木桩没有治疗取消/免疫输入，因此当前应用恒成功；满血只会令 `actualHealing=0`，随后 `HP < 100%` 为假。
- 原生 `OnTakeCriticalDamage` 已映射为 `takeCriticalDamage`，只在同一伤害结果确认为暴击时派发。根 Buff 的物理/火焰 `CheckDamageType` 修正和 `0x80000000 TalentDamage` 装饰位也已保留。
- manifest 已移除 `normal_bleed` 的未建模与跳过声明，洛茜完整生成和标准生产场景均通过。独立的 `buff_chr_0028_wulfa_tut_normalskill_success` 也已另行核对并接通：尽管名称含 `tut`，其原始时间轴包含四次周期伤害与固定失衡，因此不能按表现忽略。它不是本递归 Buff 链的一部分。

未来若标准模拟加入治疗取消、免疫或不可选中，必须让治疗执行器返回真实应用结果，并让 `alwaysNext=false` 对失败执行短路；仍不得以 `actualHealing` 判断成功。生产回归当前锁定完整场景可执行以及动态来源解析，后续可再增加非满血输入，直接断言自疗数值和治疗特效 Buff 的创建边界。
