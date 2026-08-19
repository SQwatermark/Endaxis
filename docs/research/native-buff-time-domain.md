# 原生 Buff 时间域

## 结论

`BuffData.useTimeDilationDt` 与 `BuffData.onlyUseSelfTimeDilation` 共同决定 `Buff.OnTick` 消费哪一路时间增量：

| `useTimeDilationDt` | `onlyUseSelfTimeDilation` | 原生输入              | Next `timeClock`        |
| ------------------- | ------------------------- | --------------------- | ----------------------- |
| `false`             | 任意值                    | `deltaTime`           | `default`（定义中省略） |
| `true`              | `false`                   | `allScaledDeltaTime`  | `global`                |
| `true`              | `true`                    | `selfScaledDeltaTime` | `self`                  |

第二个字段只在第一个字段为真时参与分支，不能把 `false/true` 解释为自身时间。AKEDB 中缺省的 `onlyUseSelfTimeDilation` 按序列化默认值 `false` 处理。

## 版本与静态证据

桌面游戏模块：

- `D:\Hypergryph Launcher\games\Endfield Game\GameAssembly.dll`
- SHA-256：`0C5573679BC6DEC2D068A14335466DB7CCF20AF9BAE2B983FB9D45677D80FFCE`

匹配的 1.4.4 IL2CPP 元数据显示：

- `BuffData.useTimeDilationDt` 位于 `0x22`；
- `BuffData.onlyUseSelfTimeDilation` 位于 `0x23`；
- `Buff.OnTick(float deltaTime, float allScaledDeltaTime, float selfScaledDeltaTime)` 的 RVA 为 `0x0158CD90`。

`Buff.OnTick` 在 `0x0158D853` 检查 `BuffData+0x22`。为假时保留第一路 `deltaTime`；为真时继续在 `0x0158D859` 检查 `BuffData+0x23`，并分别在 `0x0158D85F`、`0x0158D865` 选择 `selfScaledDeltaTime` 或 `allScaledDeltaTime`。选出的增量随后在 `0x0158D875` 累加到 Buff 本地时间。

这条分支同时支配 Buff 寿命、周期触发和本地事件/时间线游标，因此不能只给周期伤害单独乘倍率。

## 数据分布

当前 AKEDB `public/Json/BuffData` 中可解析的 2637 份 BuffData 分布为：

- 2619 份 `false/false`；
- 18 份 `true/false`；
- 没有观察到 `true/true`。

目录另有 41 份当前不是有效 JSON 的文件，不计入上述分布，也没有为凑齐统计而修复或猜测。虽然现有样本没有 `self`，运行时仍按原生分支完整保留该域。

洛茜的 `normal_bleed`、`normal_bleed_effect`、`normal_defup` 和 `normal_smarttarget` 都是 `true/false`，应使用 `global`；`ult_stopenemy` 与 `ult_stopenemy_elite` 自身是 `false/false`，应使用 `default`。这意味着停止敌人的 Buff 本身会按默认时间正常到期，而敌人身上选择 `self` 的其他 Buff 才会随敌人实体倍率变慢。

## Next 接入与剩余边界

生成器把两个原始字段保留到 `BuffDefinitionSource`，严格校验布尔值，并在内联 Buff 定义中只为非默认域输出 `timeClock`。标准战斗装配已经向干员、敌人和能力实体 Buff 容器提供 `default/global/self` 三路增量。

装配层回归在同一敌人容器中同时安装三种有限周期 Buff，并叠加 0.5 全局倍率与 0.5 敌人实体倍率，验证：

- `default` 每帧前进 `1/30` 秒；
- `global` 每帧前进 `1/60` 秒；
- `self` 每帧前进 `1/120` 秒；
- 生命周期结束与周期触发使用同一个被选择的增量。

该映射不会消除 `buff_chr_0028_wulfa_ult_stopenemy_elite` 的独立缺口。它的 `DuringBuffEnable` 确实包含敌方 Entity `TimeDilationAction`，但 AKEDB 投影为 `useCurveKey=false` 且内联 `timeScaleCurve.keys=[]`。缺少倍率曲线证据时仍必须保持未建模，不能从技能名称或表现推断冻结倍率。
