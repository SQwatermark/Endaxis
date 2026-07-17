# 模拟引擎数据流

## 触发入口

当前版本中，模拟链路由 `src/stores/timeline/simulation.ts` 中的 computed 自动维护。时间轴、队伍配置、敌人配置、预备时间或主控干员段变化时，会触发以下流程：

```
1. compiledScenario = compileEndaxisScenario(...)
   ├── compileScenario(...)
   ├── compileTimeline(...)
   ├── TriggerRegistry 注册表
   └── 初始效果 / 敌人状态 / 主控干员段

2. simulation = simulate(...)
   ├── 输入 timeline + teamConfig + enemyConfig + actors
   └── 输出 state / simLog / operatorLog / enemyLog

3. optimizerProjection = projectOptimizerResult(...)
   ├── spSeries / staggerSeries / gaugeSeriesByTrackId
   ├── effect layouts / comboWindowLayouts
   └── requisiteWarnings
```

点击“分析”按钮并不会使用另一套模拟器。它主要消费同一条模拟链的结果，展示日志、伤害分解和贡献分析。

## 模拟主循环（simulate → engine.run）

### 第一阶段：事件入队

`simulate()` 遍历 `timeline.actions[]`，按动作实际字段创建初始事件并投入优先队列。常见事件包括：

```typescript
for (action of timeline.actions) {
  engine.enqueue(ACTION_START, action.realStartTime); // 动作开始
  engine.enqueue(ULT_ENERGY_CHANGE, action.realStartTime); // 若有 gaugeCost，消耗终结技能量
  engine.enqueue(DAMAGE_HIT, hit.realTime); // 每个命中段
  engine.enqueue(ACTION_END, action.realStartTime + duration); // 动作结束
  engine.enqueue(SP_CHANGE, actionEndTime); // 若有 spGain，动作结束时技力回复/返还
}
```

此外，命中中带 `applyTiming: 'beforeDamage'` 的敌人侧效果会在命中前极小时间点提前入队；非战技动作还可能按字段生成固定终结技能量回复或队友终结技能量回复事件。

所有事件按 `time` 排序进入 `PriorityQueue`，同时间的事件可指定优先级（数值越小越先执行）。

### 第二阶段：事件循环

```typescript
engine.run() {
  while (queue 非空) {
    event = queue.dequeue()
    if (event.time > endlineTime) break;
    state.advanceTime(event.time - state.currentTime)  // 推进游戏时钟
    handler = handlers.get(event.type)                 // 查找处理器
    handler.handle(event, ctx)                         // 执行
  }
}
```

### 第三阶段：输出

```typescript
return {
  state, // 最终 GameState（HP、技力、终结技能量等快照）
  simLog, // 战斗日志条目（按时间排序）
  enemyLog, // 敌人状态变化记录
  operatorLog, // 干员状态变化记录
  actionEndTimes, // 动作结束时间（用于条件命中处理）
};
```

---

## 事件处理器的级联效应

每个 handler 可以产生新的副作用事件：

```
ACTION_START
  ├── 消耗技力（ActorState.sp）
  ├── 消耗终结技能量（ActorState.ultimateEnergy）
  ├── 应用动作开始时的效果（TriggerRegistry.onActionStart）
  ├── 暂停技力自动回复（SP_REGEN_PAUSE）
  └── 应用动作持续期间效果（TriggerRegistry.onDuringAction）

DAMAGE_HIT
  ├── 1. beforeDamage 效果 → ENEMY_EFFECT_APPLY（priority -1）
  ├── 2. 计算伤害（ATK × multiplier × dmgBonus × ...）
  ├── 3. dispatchEnemyEffects(hit.effects) → 施加附着/异常
  ├── 4. dispatchActorEffects(hit.effects) → 施加 buff/debuff
  ├── 5. TriggerRegistry.onHit() → 触发条件效果
  ├── 6. 失衡计算 → STAGGER_CHANGE
  ├── 7. 技力回复 → SP_CHANGE
  └── 8. 伤害日志 → simLog.push(DAMAGE_HIT)

ENEMY_EFFECT_APPLY / OPERATOR_EFFECT_APPLY
  ├── 施加敌人侧附着、反应、异常或干员侧状态
  ├── 检查元素反应 / 物理异常联动，必要时调度 ARTS_BURST、DOT_TICK、CORROSION_TICK 等事件
  ├── 触发 onStatusApplied → TriggerRegistry.onStatusApplied()
  └── 调度过期事件 → OPERATOR_EFFECT_EXPIRE / ENEMY_EFFECT_EXPIRE

ACTION_END
  ├── 移除动作中的临时效果
  └── 恢复技力自动回复
```

---

## 状态机的变化传播

所有状态修改通过 `GameState` 统一管理：

```
GameState
├── TeamState
│   ├── ActorState[0..3]
│   │   ├── sp: number                 ← 技力（SP_CHANGE）
│   │   ├── ultimateEnergy: number     ← 终结技能量（ULT_ENERGY_CHANGE）
│   │   ├── effects: StatusEffect[]    ← 活跃状态效果（OPERATOR_EFFECT_APPLY/EXPIRE）
│   │   └── cooldowns: Map             ← 技能冷却
│   ├── EffectManager                  ← 汇总所有属性修改
│   └── OperatorEffectState            ← 效果激活窗口记录（用于投影）
│
├── EnemyState
│   ├── hp: number
│   ├── stagger: number               ← 失衡值（STAGGER_CHANGE）
│   ├── inflictionStacks: Map         ← 元素附着层数
│   ├── vulnerabilityStacks: number   ← 物理脆弱层数
│   ├── debuffs: Map                  ← 导电/腐蚀/碎甲等减益
│   └── effects: EffectState[]        ← 敌人身上的效果
│
└── currentTime: number               ← 当前模拟时间
```

---

## 输出到 UI 的数据流

```
simulate() 返回
    │
    ├── simLog: SimLogEntry[]
    │     → SimLogPanel（战斗日志面板）
    │     → 按类型筛选：伤害/效果/技力/充能/失衡
    │
    ├── enemyLog: EnemyStateEvent[]
    │     → projectEnemyEffects()
    │     → 环境效果 Segment
    │
    ├── operatorLog: OperatorStateEvent[]
    │     → projectOperatorEffects()
    │     → 干员效果 Segment
    │     → projectComboWindows()
    │     → 连携窗口 Segment（TimelineComboWindowBar）
    │
    └── state: GameState
          ├── computeDamage → DamageBreakdown[]
          │     → 时间轴上的伤害钻石标记
          │     → HitDamageDetailDialog（伤害分解弹窗）
          │
          └── LMDI 分解
                → DamageAnalysisDialog（圆饼图 + 干员贡献表）
```

`projectTriggeredEffects.ts` 当前只是 apply/expire 日志窗口构建工具；真正的 UI segment 来源是 `projectOperatorEffects`、`projectEnemyEffects`、`projectActionBuffs` 等投影函数。不要再从 `TriggerRegistry` 直接另算一套效果条。

---

## 关键时序

```
时间 -1s       ：simulate() 内部处理 initialEffects
                  （来自 collectEffects → buildInitialRuntimeEffectsFromCollected）
                  注入 ActorState 初始效果池（hide: true，不可见）
                  → 设置装备防御、常驻属性等初始值

时间 0s        ：模拟正式开始

时间 3.00s     ：ACTION_START — 洛茜战技
                  消耗 50 技力
                  暂停自动回复
                  执行 onActionStart / onDuringAction trigger

时间 3.15s     ：DAMAGE_HIT — 第 1 段命中
                  计算伤害 5234
                  施加灼热附着 → ENEMY_EFFECT_APPLY
                  onHit trigger 触发 → 狼血层数 +1
                  → SP_CHANGE（回复技力）
                  → STAGGER_CHANGE（积累失衡值）

时间 3.45s     ：DAMAGE_HIT — 第 2 段命中
                  计算伤害 6891
                  razorClawmark DOT 施加 → ENEMY_EFFECT_APPLY
                  physicalStatus: lift → 击飞

时间 4.00s     ：ACTION_END — 战技结束
                  恢复自动回复

时间 4.45s     ：DAMAGE_HIT — razorClawmark 第 1 跳 DOT
                  （Engine 在效果应用时调度 DOT_TICK，再由 DOT_TICK 产生伤害）

...
```

模拟引擎不区分"这段伤害是技能的还是 DOT 的"——所有 `DAMAGE_HIT` 事件走同一个 `HitHandler`，统一计算、统一日志。

---

## 编辑时预览 vs 点击"分析"

时间轴上显示的伤害数字和效果 segment 在编辑时就能看到，原因不是有另一套轻量预览系统，而是**完整模拟引擎自动在后台运行**：

```
用户拖拽 / 更换配置
    ↓ recomputeAllTrackOperatorStatuses()
    ↓
compiledScenario（computed）→ collect + compile
    ↓
simulation（computed，依赖 compiledScenario）→ simulate() 完整运行
    ↓
projectOptimizerResult(simulation) → 拆解为 spSeries / staggerSeries / effects / simLog
    ↓
TimelineGrid 渲染伤害钻石（hit._expectedDamage）和效果覆盖层
```

`simulation` 是一个 `computed(() => simulate(...))`，任何导致 `compiledScenario` 变化的行为都会自动触发完整模拟链。`HitHandler` 在运行时将伤害写入 `hit._expectedDamage`，渲染层直接从 hit 读取。

点击"分析"按钮会额外输出 LMDI 贡献分解和图表，但其核心模拟引擎是同一个。
