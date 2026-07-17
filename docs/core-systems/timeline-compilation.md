# 时间轴编译

## 输入和输出

编译器接收用户在时间轴上拖拽的技能块和连线，输出模拟引擎可执行的时间轴。

```
输入                              输出
─────────────────────────────────────────────────────
ActionNode[]                      ResolvedTimeline
  ├── trackId: 'rossi'            ├── actions: ResolvedAction[]
  ├── node.type: 'battleSkill'    │     ├── realStartTime（现实时间）
  ├── node.startTime: 3.0（游戏时间）  │     ├── realDuration
  ├── node.duration: 2.0          │     ├── resolvedHits[]
  ├── node.hits[]                 │     │     ├── realTime
  │     ├── offset: 0.3           │     │     ├── multiplier
  │     ├── multiplier: 155       │     │     └── effects[]
  │     └── effects[]             │     └── effects[]
  └── ...                         ├── timeContext: TimeContext
                                  └── timeExtensions: TimeExtension[]

Connection[]（连线关系）           effectMap: Map<id, ResolvedEffect>
```

核心转换：**游戏时间 → 现实时间**。游戏中连携技和终结技播放动画时"时停"——游戏逻辑暂停，但现实时间继续流逝。编译器计算每次时停的偏移量，将游戏时间映射为现实时间。

---

## 编译五步

### 第一步：排序

```typescript
const sortedActions = actions.toSorted((a, b) => a.node.startTime - b.node.startTime);
```

所有技能块按游戏开始时间升序排列。

### 第二步：计算时停偏移

```typescript
const { stopSources, sourceShiftMap, timeExtensions } = calculateTimeShifts(sortedActions);
```

识别所有会引起时停的动作——连携技（`triggerWindow >= 0`）和终结技——计算每个时停源产生的现实时间偏移。

**时停时长规则**：

- 终结技：`animationTime`（默认 1.5s）
- 连携技：与下一个时停源的时间间隔，最小 0.1s，最大 0.5s

示例：三个动作，游戏时间排列为 0s / 1.2s / 3.0s

```
游戏时间:  [战技0s]──[连携1.2s]──[战技3.0s]
               │          │
时停:        无       0.3s (连携)
               │          │
现实时间:  [战技0s]──[连携1.2+0=1.2s]──[战技3.0+0.3=3.3s]
                                │
                        时停窗口: 1.2s ~ 1.5s
```

每个时停源产生一个 `TimeExtension`：`{ time, gameTime, amount, cumulativeFreezeTime }`。

### 第三步：解析动作

```typescript
const { resolvedActions, actionMap } = resolveActions(
  sortedActions,
  stopSources,
  sourceShiftMap,
  timeCtx,
);
```

为每个动作计算现实时间起始：

```
如果动作是时停源自身：
  realStartTime = 时停窗口的 realStart
否则：
  找到最近的前一个时停源
  realStartTime = max(startTime + 前源偏移, 前源的 realEnd)
```

**时停对技能持续时间的影响**：连携技/终结技的 "动画时间" 在游戏逻辑中不消耗 duration，但在现实时间中占据时间窗口。所以实际时长 = 原 duration - 冻结时长 + 实际时停窗口。

```
战技 duration: 2.0s
被连携技时停覆盖 0.3s
effectiveDuration = 2.0 - 0 + 0.3 = 2.3s（延长了）
```

**命中时间也受时停影响**：每个命中的 `offset` 在原 timeline 中是相对于动作开始的游戏时间，编译时需要映射到现实时间。如果命中时刻落在时停窗口内，它会被推迟。

### 第四步：轨道中断检测

```typescript
applyActionInterruptions(resolvedActions);
```

同一轨道上，如果后一个动作在前一个动作结束前开始，前一个动作被截断：

```
动作A: ████████████ (1.0s - 3.0s)
动作B:       ████████████ (2.0s - 4.0s)
结果A: ████████           (截断到 2.0s)
```

被中断的动作——截断 hits（`realTime < 中断时间`）、截断 effects（`realStartTime < 中断时间`）、标记 `isInterrupted = true`。

### 第五步：效果消耗连线

```typescript
resolveConsumption(resolvedActions, connections);
```

用户可以在两个技能块之间画"消耗连线"——技能 A 产生的效果被技能 B 提前消耗。连线关系存储在 `Connection[]` 中，`isConsumption = true` 表示这是一条消耗连线。

编译器遍历所有连线，找到被消耗的效果，将 `displayDuration` 截断到消耗时刻：

```
效果原本持续 10s（1.0s → 11.0s）
被技能 B 在 4.0s 消耗
结果：displayDuration = 3.0s（1.0s → 4.0s），isConsumed = true
```

---

## TimeContext：游戏时间 ↔ 现实时间双向映射

```typescript
toGameTime(realTime); // 现实 → 游戏
toRealTime(gameTime); // 游戏 → 现实
getShiftedEndTime(start, duration, excludeActionId); // 计算含时停的结束时间
```

`getShiftedEndTime` 的核心逻辑：从起始时间开始，累计所有落在区间内的时停扩展，迭代直到不再有新的时停源被包含进来。`excludeActionId` 排除自身的时停（自己的动画不延长自己）。

---

## 编译结果的消费

```typescript
ResolvedTimeline
    │
    ├── actions: ResolvedAction[]
    │     → simulate() 遍历，创建 ACTION_START / DAMAGE_HIT / ACTION_END 事件
    │     → 每个 hit 携带 realTime（现实时间），控制模拟引擎何时触发
    │
    ├── timeContext: TimeContext
    │     → simulate() 用于计算 SP_REGEN_PAUSE / 效果过期等依赖时停的事件
    │
    └── effectMap: Map<id, ResolvedEffect>
          → 编译期效果索引，供连接/查找等逻辑使用；可见效果条以模拟日志投影为准
```
