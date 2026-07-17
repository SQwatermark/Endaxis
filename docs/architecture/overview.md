# 架构设计

## 当前状态

本文以当前 `main` 分支为基准。Endaxis 是一个纯前端 Vue 3 单页应用，核心职责是让用户编辑排轴、配置干员/武器/装备/敌人，并在浏览器内通过离散事件模拟器实时计算技力、终结技能量、失衡、效果覆盖和伤害结果。

当前版本已经完成一次 TypeScript 化和 store 拆分：`timelineStore.ts` 仍是 Pinia 的对外入口，但编译、投影、持久化、布局、技能库等职责已经拆到 `src/stores/timeline/` 下的子模块中。

## 整体分层

```text
┌────────────────────────────────────────────────────────────┐
│ 视图层 Views / Components                                  │
│ TimelineEntry → TimelineEditor → TimelineGrid / 面板组件     │
├────────────────────────────────────────────────────────────┤
│ 状态层 Pinia                                                │
│ timelineStore.ts + timeline/* composables                   │
│ operatorStore.ts / weaponStore.ts / gearStore.ts             │
├────────────────────────────────────────────────────────────┤
│ 模拟与投影层 Simulation                                     │
│ compileEndaxisScenario → compileScenario/compileTimeline     │
│ simulate → projectOptimizerResult → 各类 UI 投影              │
├────────────────────────────────────────────────────────────┤
│ 游戏数据层 Data                                             │
│ operators / weapons / gearpieces / gearsets / enemies        │
│ collect.ts / stats / gameText / i18n game-locales            │
└────────────────────────────────────────────────────────────┘
```

## 核心数据流

```text
用户编辑时间轴 / 配置队伍
  ↓
timelineStore.ts 维护当前方案、轨道、连接、敌人和配置实例
  ↓
src/stores/timeline/simulation.ts
  compiledScenario = compileEndaxisScenario(...)
  simulation       = simulate(...)
  optimizerProjection = projectOptimizerResult(...)
  ↓
TimelineEditor / TimelineGrid / 面板组件消费 computed 投影
```

编辑过程中的预览并不是另一套轻量系统。当前版本中，`compiledScenario`、`simulation`、`optimizerProjection` 都是 computed 派生值；只要时间轴、配装、敌人或系统常量发生变化，完整模拟链就会重新计算。点击“分析”按钮主要是展示和消费同一套模拟结果，例如 LMDI 分解和日志视图。

## 目录结构

```text
src/
├── main.ts
├── App.vue
├── router/index.ts              # 当前仅注册 /timeline
├── types.ts
│
├── views/
│   ├── TimelineEntry.vue        # 方案管理、导入导出、语言切换、移动端入口
│   ├── TimelineEditor.vue       # 排轴编辑器主界面
│   └── MobileTimelineViewer.vue # 移动端只读查看
│
├── components/                  # 时间轴、动作块、属性面板、弹窗、图表等组件
│
├── stores/
│   ├── timelineStore.ts         # Pinia 对外入口和跨模块编排
│   ├── operatorStore.ts
│   ├── weaponStore.ts
│   ├── gearStore.ts
│   └── timeline/
│       ├── controlledOperator.ts # 主控干员时间段
│       ├── instanceLookup.ts     # 干员/武器/装备实例查询
│       ├── layouts.ts            # 节点矩形、效果布局、坐标转换
│       ├── normalizers.ts        # 默认轨道、导入数据规范化
│       ├── persistence.ts        # localStorage、导入导出、分享码
│       ├── resolveHits.ts        # 技能 hit/segment 解析
│       ├── shifts.ts             # 时停、偏移、终结技强化延长
│       ├── simulation.ts         # compile → simulate → project computed
│       ├── skillLibrary.ts       # 当前干员可拖拽技能库
│       └── types.ts
│
├── simulation/
│   ├── compileEndaxisScenario.ts # Endaxis UI 状态到模拟场景的适配层
│   ├── compiler/                 # 时间轴与场景编译
│   ├── engine/                   # 事件队列、上下文、TriggerRegistry
│   ├── events/                   # ACTION/HIT/SP/ULT/STAGGER/EFFECT 处理器
│   ├── state/                    # GameState、TeamState、ActorState、EnemyState
│   ├── mechanics/                # 元素/异常反应
│   ├── projection/               # 从模拟日志投影 UI 曲线与 segment
│   ├── calculation/              # 伤害计算管道
│   └── simulator.ts              # 顶层 simulate()
│
├── data/
│   ├── operators/
│   ├── weapons/
│   ├── gearpieces/
│   ├── gearsets/
│   ├── enemies/
│   ├── stats/
│   ├── collect.ts                # 效果收集、patch、trigger 构建
│   ├── gameText.ts               # 游戏内容文本查询
│   └── index.ts
│
├── i18n/
│   ├── index.ts
│   ├── elementPlusLocale.ts
│   ├── locales/                  # UI 文本 zh-CN / en / ru
│   └── game-locales/             # 游戏内容文本 zh / en
│
├── utils/
└── styles/
```

## 关键模块边界

| 模块                                   | 当前职责                                                                            |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| `timelineStore.ts`                     | Pinia store 入口；保存响应式状态；串联子模块；保留尚未拆出的业务方法。              |
| `timeline/persistence.ts`              | 持久化边界：localStorage autosave、导入导出、gzip 分享码、方案列表装载。            |
| `timeline/skillLibrary.ts`             | 基于当前轨道干员实例生成可拖拽技能库；会调用 `patchCombatSkills` 和 hit 解析。      |
| `timeline/simulation.ts`               | 以 computed 形式组织 `compileEndaxisScenario → simulate → projectOptimizerResult`。 |
| `simulation/compileEndaxisScenario.ts` | 将 UI 状态、敌人配置、主控段、初始效果编译成模拟器入参。                            |
| `simulation/projection/*`              | 从模拟日志中重建 SP、终结技能量、失衡、效果 segment、连携窗口、前置条件警告。       |
| `data/collect.ts`                      | 从干员/武器/装备/套装收集效果，处理 patch 和 trigger，是数据层到模拟层的关键桥梁。  |

## 关键技术决策

### 游戏时间与现实时间

连携技和终结技会造成游戏时间暂停但现实时间继续。时间轴编译阶段通过 `TimeContext` 维护游戏时间与现实时间的映射，后续模拟和 UI 投影均以编译后的 real time 为准。

### 数据以 TypeScript 源文件维护

干员、武器、装备、敌人等游戏数据以 TypeScript sheet 形式存在，利用类型检查和构建期 glob 保证可维护性。游戏内容文本通过 `gameText.ts` 和 `i18n/game-locales` 查询。

### 离散事件模拟

模拟器不是逐帧循环，而是把动作开始、命中、技力变化、终结技能量变化、效果应用/过期、失衡变化等事件放入优先队列，只在事件点推进状态。这样可以把复杂战斗逻辑集中在事件处理器和 `GameState` 中。

### 模拟日志是投影来源

时间轴上的技力曲线、失衡曲线、效果条、连携窗口和前置条件警告，主要由 `projectOptimizerResult` 调用 `simulation/projection/*` 从模拟结果投影出来。渲染层应尽量消费这些派生结果，而不是重复实现一套战斗判断。
