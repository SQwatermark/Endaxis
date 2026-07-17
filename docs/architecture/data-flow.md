# 数据流转全景图

## 总览

Endaxis 当前的数据流可以分成四条相互连接的链路：

```text
干员/武器/装备数据
  ↓
技能库派生 activeSkillLibrary
  ↓
用户把 action 放到 tracks[].actions
  ↓
compileEndaxisScenario → compileScenario / compileTimeline
  ↓
simulate
  ↓
projectOptimizerResult
  ↓
时间轴、曲线、效果条、日志、伤害面板
```

其中 `timelineStore.ts` 是 Pinia 对外入口，但实际编译与投影编排已经拆到 `src/stores/timeline/simulation.ts`；技能库生成拆到 `src/stores/timeline/skillLibrary.ts`；持久化拆到 `src/stores/timeline/persistence.ts`。

## 阶段 1：技能库派生

**触发时机**：当前选中轨道或干员配置变化时，由 `activeSkillLibrary` computed 自动重算。

**入口**：`src/stores/timeline/skillLibrary.ts`

**输入**：

- 当前轨道干员 `track.id`
- 干员实例等级、潜能、技能等级、天赋状态
- `src/data/operators/*` 中的 `combatSkills`
- 用户 override 和系统常量

**核心过程**：

```text
getOperator(activeChar.id)
  ↓
patchCombatSkills(operator, displayInstance, buildOperatorEffectById(...))
  ↓
buildResolvedSegmentPayload(...)
  ↓
activeSkillLibrary = 标准技能 + 变体技能 + 隐藏子技能
```

技能库是 UI 临时模型。它描述“当前干员有哪些可拖拽动作”，并不直接等于时间轴上的 action。用户拖拽之后，才会在 `tracks[].actions` 中产生具体实例。

## 阶段 2：配置收集与面板属性

**触发时机**：干员、武器、装备、精锻、技能等级、天赋状态等配置变化时。

**主要入口**：

- `timelineStore.ts` 中的 `recomputeAllTrackOperatorStatuses`
- `src/data/collect.ts`
- `src/data/stats/computeStats.ts`

**输入**：

- 4 条轨道的干员实例
- 武器实例和 3 个武器词条等级
- 4 件装备和精锻等级
- 套装效果
- 危机合约/敌人/系统常量修正

**输出**：

```text
collectEffects(...)
  ↓
CollectedEffect[]
  ↓
computeStats(...)
  ↓
track.operatorStatus / track.enemyStatus / track.stats
```

这些结果供属性面板、伤害计算和终结技能量上限/消耗修正使用。需要注意的是，`collect.ts` 同时也是 patch 和 trigger 的主要汇合点，后续如果继续治理 i18n 或存档字段语义，这里仍是重点区域。

## 阶段 3：场景编译与模拟

**触发时机**：`src/stores/timeline/simulation.ts` 中的 computed 依赖变化时自动执行。

```text
compiledScenario = compileEndaxisScenario(...)
  ├── buildCompiledTracks(...)
  ├── compileScenario(...)
  ├── buildTriggerRegistryEntries(...)
  └── collectConsumedStacksWriteKeys(...)

simulation = simulate(
  timeline,
  teamConfig,
  enemyConfig,
  actors,
  triggerRegistry,
  consumedStacksWriteKeys,
  options,
)
```

`compileEndaxisScenario.ts` 是 UI 状态到模拟器输入的适配层，负责把敌人防御/抗性、主控干员段、初始效果、终结技能量上限、trigger registry 等组装成模拟器可消费的结构。

`simulate()` 内部使用离散事件队列推进。动作开始、命中、技力变化、终结技能量变化、失衡变化、效果应用和过期都会进入同一个事件系统。

## 阶段 4：投影与渲染

**入口**：`src/simulation/projection/projectOptimizerResult.ts`

```text
simulation.simLog / operatorLog / enemyLog / state
  ↓
projectSpSeries()
projectStaggerSeries()
projectUltimateSeries()
projectActionBuffs()
projectEnemyEffects()
projectOperatorEffects()
projectAllComboWindows()
projectRequisiteWarnings()
  ↓
optimizerProjection
```

`src/stores/timeline/simulation.ts` 会把这些投影继续暴露为：

- `spSeries`
- `staggerSeries`
- `gaugeSeriesByTrackId`
- `trackBuffLayouts`
- `enemyEffectLayout`
- `enemyAfflictionViz`
- `operatorEffectLayouts`
- `comboWindowLayouts`
- `requisiteWarnings`
- `simLog`

渲染层应优先消费这些投影结果。比如技能合法性警告使用 `projectRequisiteWarnings`，而不是在组件里重新计算 SP、终结技能量或连携窗口。

## 效果如何成为时间轴 segment

```text
技能原始 effects
  + patchHit / patchTick 注入
  + trigger 运行时产生
  ↓
HitHandler / OperatorEffectHandler / EnemyEffectHandler
  ↓
operatorLog / enemyLog / simLog
  ↓
projectOperatorEffects / projectEnemyEffects / projectActionBuffs
  ↓
TimelineBuffLayer / 敌人效果层 / 轨道状态条
```

当前投影层的核心原则是：**模拟日志是 segment 的事实来源**。只要一个效果在模拟过程中产生了 apply/expire 日志，就可以被 projection 重建为 UI 上的时间段；projection 不应该关心这个效果最初来自技能原始定义、patch，还是 trigger。

## 技力、失衡、终结技能量曲线

这三类曲线也来自模拟结果：

| 曲线       | 投影函数                | 主要输入                           |
| ---------- | ----------------------- | ---------------------------------- |
| 技力       | `projectSpSeries`       | `simLog` + 初始快照                |
| 失衡       | `projectStaggerSeries`  | `simLog` + 敌人配置 + 初始快照     |
| 终结技能量 | `projectUltimateSeries` | `simLog` + 指定 trackId + 初始快照 |

因此，任何合法性检查或 UI 提示都应该尽量复用这些曲线，避免出现“底部曲线显示不足，但技能块没有警告”这类双账本不一致问题。

## 持久化边界

`src/stores/timeline/persistence.ts` 负责：

- `localStorage` 自动保存，key 为 `endaxis_autosave`
- 项目 JSON 导入导出
- gzip 分享码
- 方案列表 `scenarioList` 的 gather/scatter
- 导入旧数据时的 normalize 和 legacy 字段清理

当前持久化仍会保存一部分 UI 派生字段或历史字段，因此“哪些字段是稳定身份，哪些字段是派生缓存”仍需要继续梳理。相关设计整理见 `docs/design/action-identity-and-display.md`。
