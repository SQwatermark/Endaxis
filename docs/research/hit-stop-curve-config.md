# HitStop 命名曲线配置证据

## 结论

技能动作中的 `char_hard_stop` 等名称属于独立的 `Beyond.Gameplay.HitStopConfig`，不是
`TimeDilationConfig.curveMap` 的漏项。Endaxis 应让两类曲线共享底层求值器，但保留不同的数据目录
与编辑语义：普通时间膨胀选择器只列 TimeDilationConfig；HitStop 名称只在解析 HitStopAction 或
查看当前值时进入运行时注册表。

## 1.4.4 来源

- IL2CPP 类型：`Beyond.Gameplay.HitStopConfig`
- 字段：`hitSopSettings: Dictionary<string, HitSopSetting>`
- 单项曲线字段：`HitSopSetting.timeScaleCurve`
- VFS manifest：`451359`
- asset index：`844`
- 资源路径：`assets/beyond/dynamicassets/gamedata/gameplayconfig/hitstopconfig.asset`
- bundle：`main/8c99d999cfcb2174d3035d0e.ab`
- TypeTree 文本 SHA-256：`45b132032c043ac6f7d7703338d0b17cf513799f5a79697772d3f807c6ca17f8`

生成器 `generate:game-data:hit-stop-curves` 对 TypeTree 文本做严格解析，当前目录包含 24 条命名曲线。
产物是 `src/next/data/combat/hitStopCurveCatalog.generated.ts`；手工入口
`src/next/data/combat/hitStopCurveCatalog.ts` 只负责暴露生成目录，不能抄写或修补曲线。

## `char_hard_stop` 样本

|  time | value |
| ----: | ----: |
|     0 |   0.1 |
|  0.05 |  0.02 |
| 0.618 |  0.02 |
|     1 |     1 |

这些值由生成测试逐项固定。源中的 Unity AnimationCurve 还包含正无穷切线；TS 生成器必须输出
`Number.POSITIVE_INFINITY`，不能先经 JSON 把它变成 `null`。运行时把无穷切线段视为 Unity 的阶跃
插值：到下一关键帧之前保持左值，到关键帧再切换。有限曲线仍走既有加权 Hermite 求值。

## 边界

- 24 条名称和关键帧只证明当前 1.4.4 资产，不代表跨版本稳定。
- HitStop 的目标选择、槽位覆盖、优先级和动作生命周期仍由各 Action/运行时证据决定；本目录只解决
  名称到曲线的映射与求值，不能据此猜测完整冻帧语义。
- Endaxis 按现实时间摆放技能块。HitStop/TimeDilation 只改变其明确宿主的局部时间推进，不生成统一
  “模拟时间”，也不会移动用户已放置的后续技能块。
