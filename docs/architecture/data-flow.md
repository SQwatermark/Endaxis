# 数据流转全景图

## 一次用户操作的完整生命周期

```
用户操作："选择干员洛茜，给她装上狼之绯，穿碾骨套装，把战技拖到 3.0 秒位置"
                                                              │
                                        时间轴上的技能块 ←── 拖拽产生 ActionNode
                                        { type: 'battleSkill', startTime: 3.0, ... }
```

### 阶段 1：编译期 — 生成技能库

**触发时机**：用户选择/变更干员配置时立即执行

**入口**：`timelineStore.js L2316` → `patchCombatSkills(operator, operatorInstance, undefined, track.id)`

**输入**：干员原始数据（OperatorSheet）+ 天赋等级 + 潜能数

**做什么**：
```
OperatorSheet.talents[0].patches[0] = {
  kind: 'patchHit',
  targetHit: 'rossi-wolven-ambrage-first-hit',  ← 目标：连携技的第一段命中
  hit: { effects: [{ name: 'razorClawmark', kind: 'damageOverTime', ... }] }
}
                                    ↓ patchCombatSkills
技能库（flatSkills）:
  comboSkill.hits[0] = {
    id: 'rossi-wolven-ambrage-first-hit',
    offset: 0.3,
    stagger: 18,
    effects: [
      { id: 'rossi-talent0-patch0-p0', name: 'razorClawmark', kind: 'damageOverTime', interval: 1, ... }
      // ↑ patchHit 注入的效果，现在有确定性 id
    ]
  }
```

**产出的消费方**：技能库面板（左侧 ActionLibrary），展示"洛茜有哪些技能、每个技能几段伤害、附带什么效果"。

**注意**：这个阶段的输出**不直接出现在时间轴上**。它定义的是"技能本身的结构"，而非"谁在什么时间用了这个技能"。

---

### 阶段 2：收集期 — 计算属性面板

**触发时机**：`recomputeAllTrackOperatorStatuses()` — 干员/武器/装备变化、语言切换时执行

**入口**：`timelineStore.js L2260` → `collectEffects(team, ...)` → `resolvePatches()`

**输入**：4 个槽位的完整配置（干员 + 武器 + 4 件装备 + 套装 + 等级/潜能/精锻）

**做什么**：
```
4 名干员的被动效果（天赋常驻、潜能常驻、战斗技能被动、武器属性、装备词条、套装效果、装备防御）
                                    ↓ collectEffects
CollectedEffect[] = [
  { effect: { id: 'rossi-talent0-effect0', kind: 'status', stat: 'atkPercent', value: 15 }, sourceSlotIndex: 0 },
  { effect: { id: 'lupine-scarlet-skill1-effect0', stat: 'critRate', value: 19.5 }, sourceSlotIndex: 0 },
  { effect: { id: 'bonekrusha-effect0', stat: 'atkPercent', value: 15 }, sourceSlotIndex: 0 },
  ...约 50-100 个效果
]
                                    ↓ computeStats()
OperatorStatus = {
  attack: 2347,        // 最终攻击力
  critRate: 0.295,     // 最终暴击率
  dmgBonus: 0.45,      // 最终增伤
  damageModifiers: [...],  // 按元素/技能过滤的增伤修饰器
  ...
}
```

**产出的消费方**：属性面板（ActionLibrary → 干员数值面板），展示"洛茜当前攻击力 2347、暴击率 29.5%"。

---

### 阶段 3：模拟 — 运行战斗

**触发时机**：用户点击"分析"按钮

**入口**：`compileEndaxisScenario()` → `compileScenario()` → `SimulationEngine.run()`

**输入**：
- 时间轴（用户拖拽的技能块序列）：`ActionNode[]` → `compileTimeline()` → `ResolvedTimeline`
- 队伍配置：重新调用 `collectEffects()` → 效果列表 → `computeStats()` → 最终属性
- 敌人配置：用户选择的敌人（防御、抗性、失衡值、血量等）

**模拟过程**：
```
ResolvedTimeline.actions = [
  { trackId: 'rossi', startTime: 3.0, node.type: 'battleSkill', resolvedHits: [
    { realTime: 3.15, multiplier: 155, stagger: 12, effects: [...] },   // 第 1 段命中
    { realTime: 3.45, multiplier: 210, stagger: 18, effects: [          // 第 2 段 = 'rossi-wolven-ambrage-first-hit'
      { id: 'rossi-talent0-patch0-p0', kind: 'damageOverTime', ... }   // ← patchCombatSkills 注入的效果！
    ]},
  ]}
]
                                    ↓ SimulationEngine.run()
事件队列处理：
  3.00s  ACTION_START   — 洛茜消耗技力，开始战技
  3.15s  DAMAGE_HIT     — 第 1 段命中，造成 2347×1.55×(1+0.45)×... = 5234 伤害
  3.15s  EFFECT_START   — 第 1 段附带的灼热附着施加到敌人
  3.45s  DAMAGE_HIT     — 第 2 段命中（razorClawmark 的 DOT 在此施加）
  3.45s  EFFECT_START   — razorClawmark DOT 开始，持续 15s
  4.00s  ACTION_END     — 战技结束
  4.45s  DAMAGE_HIT     — razorClawmark 第一跳 DOT 伤害
  ...
```

---

### 阶段 4：渲染 — 时间轴上的 segment 和 hit

**来源**：模拟引擎输出的日志 + 投影数据

```
战斗日志                →  SimLogPanel（底部战斗日志面板）
                        →  HitDamageDetailDialog（点击伤害数字弹窗）

投影数据（projectTriggeredEffects / projectOperatorEffects / projectEnemyEffects）
  OperatorEffectSegment[] = [
    { typeKey: 'razorClawmark', start: 3.45, end: 18.45, stacks: 1, icon: '...' },
    { typeKey: 'wolvenBlood',   start: 0,    end: 999,  stacks: 16, icon: '...' },
    { typeKey: 'heatInfliction', start: 3.15, end: 18.15, stacks: 1, icon: '...' },
    ...
  ]
                        →  TimelineBuffLayer（时间轴上的效果覆盖层 — 彩色横条）
                        →  getEffectName() 查 i18n 显示 "狼血"、"灼热附着"

伤害分解（DamageBreakdown）
  { base: 2347×1.55, dmgBonus: 1.45, critMult: 1.1475, defMult: 0.5, ... }
                        →  时间轴上的钻石标记（hit diamonds）
                        →  LMDI 贡献分解 → DamageAnalysisDialog
```

---

## 效果如何最终成为时间轴上的 segment

三种来源的效果在 `hit.effects[]` 中合并后，都进入 HitHandler，统一派发：

```
技能原始定义的效果       patchHit 注入的效果        appendEffect 注入的效果
        │                       │                         │
        └───────────────────────┼─────────────────────────┘
                                │ patchCombatSkills 合并
                                ▼
                        hit.effects[]
                                │
                                ▼ HitHandler
              ┌─────────────────┴─────────────────┐
              │ dispatchEnemyEffects              │ dispatchActorEffects
              │ dispatchSingleActorEffect         │
              └─────────────────┬─────────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │ ENEMY_EFFECT_APPLY                │
              │ OPERATOR_EFFECT_APPLY             │
              │ （统一的日志事件，不分来源）       │
              └─────────────────┬─────────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │ projectTriggeredEffects            │
              │ projectOperatorEffects             │
              │ projectEnemyEffects                │
              │ （从日志重建 ActivationWindow[]）  │
              └─────────────────┬─────────────────┘
                                │
                                ▼
                      OperatorEffectSegment[]
                      { typeKey, start, end, stacks, icon }
                                │
                                ▼ getEffectName()
                      TimelineBuffLayer 彩色横条
```

关键设计：投影函数（projection）**只读模拟日志**，不区分效果来源。不管效果是从技能原始定义、patchHit 还是 appendEffect 来的，只要在模拟过程中产生了 `EFFECT_APPLY` 事件，就会被投影函数捕捉并渲染为时间轴上的 segment。`projectOperatorEffects` 的源码注释明确写道："the log is the single source of truth"。

---

## 两套 patch 系统的分工

```
                           patchHit / patchTick    patchEffect / appendEffect
                                │                        │
        patchCombatSkills ◄──────┘                        └──────► resolvePatches
              │                                                        │
              ▼                                                        ▼
        技能定义层                                                  属性收集层
     "技能本身是什么"                                            "被动效果有多少"
              │                                                        │
              ▼ compileTimeline                                        ▼ computeStats
        动作时间轴                                                  最终面板属性
              │                                                        │
              └────────────────────┬────────────────────────────────────┘
                                   ▼
                          SimulationEngine.run()
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              战斗日志       效果 segment      伤害分解
            (SimLogPanel)  (TimelineBuffLayer) (钻石/DamageAnalysisDialog)
```

**为什么需要分开**：`patchHit` 修改的是"技能内容"（第几段命中附带什么效果），需要在技能定义阶段就固化为技能库数据，影响时间轴编译。`patchEffect` 修改的是"属性数值"（+10% 变 +15%），需要在属性计算阶段汇入 `computeStats` 的加法池。两者修改的是不同层级的数据，注入到不同的下游管道。

**备选架构**：如果给 `TriggerEvent.onHit` 增加 `hitId` 筛选字段，则所有 `patchHit` 可改写为 trigger，统一到 `collectTriggerEffects` → `TriggerRegistry` 单管道，`patchCombatSkills` 可安全删除。详见 `core-systems/trigger-registry.md` 和 `core-systems/collect-analysis.md` 优化建议 6。
