# 时间轴编译

## 概述

用户在 UI 中拖拽编排的时间轴使用**游戏时间**（Game Time），但实际执行时存在时停（Freeze）效果——连携技和终结技播放动画时游戏逻辑暂停而现实时间继续流逝。编译器负责将游戏时间轴转换为**现实时间轴**（Real Time），并处理轨道内互斥中断。

## 编译流程

```
ActionNode[] (游戏时间)
    │
    ▼
1. 按 startTime 排序
    │
    ▼
2. calculateTimeShifts() — 计算时停补偿
    │  识别连携技/终结技为 "stopSource"
    │  计算每次时停的累积偏移量
    │
    ▼
3. resolveAction() — 逐动作解析
    │  游戏时间 → 现实时间映射
    │  解析每个 Hit 及其附带 Effect
    │  计算效果的实际开始/结束时间
    │
    ▼
4. applyActionInterruptions() — 轨道中断检测
    │  同一轨道上前一动作被后一动作中断
    │  截断被中断动作的 hits 和 effects
    │
    ▼
5. resolveConsumption() — 效果消耗连线
    │  按连线关系计算效果被提前消耗的时间
    │
    ▼
ResolvedTimeline (现实时间)
```

## 时停补偿（Time Shift）

连携技和终结技在游戏内会暂停其他所有逻辑。编译器通过以下方式处理：

1. **识别时停源**：`triggerWindow >= 0` 的连携技和终结技
2. **计算偏移**：每个时停源产生一个 `TimeExtension`，包含开始时间和持续时长
3. **建立映射**：`TimeContext` 维护游戏时间 ↔ 现实时间的双向转换函数

连携技时停时长：min(0.5s, 与下一时停源的间隔)
终结技时停时长：animationTime（默认 1.5s）

### 游戏时间到现实时间

```typescript
// 动作在游戏时间 10.0s 开始，持续 2.0s
// 假设此前已有 1.5s 的时停累积
realStart = gameStart + cumulativeShift = 10.0 + 1.5 = 11.5s
realEnd   = realStart + duration = 13.5s
```

### 现实时间到游戏时间

```typescript
gameTime = realTime - cumulativeShift
```

## 轨道中断（Interruption）

同一轨道上，如果后一个动作在前一个动作结束前开始：

```
动作A: ████████████ (0s - 3s)
动作B:       ████████████ (2s - 5s)
结果A: ████           (截断到 2s)
```

被中断的动作：
- 保留部分 hits（realTime < 中断时间）
- 保留部分 effects（realStartTime < 中断时间）
- 标记 `isInterrupted = true`

## 编译结果

```typescript
interface ResolvedTimeline {
  actions: ResolvedAction[];           // 已解析的动作列表
  actionMap: Map<string, ResolvedAction>;  // 按 ID 索引
  effectMap: Map<string, ResolvedEffect>;  // 按 ID 索引
  timeExtensions: TimeExtension[];     // 所有时停扩展
  timeContext: TimeContext;            // 时间上下文（含双向转换函数）
  meta: { totalDuration: number };     // 总时长
}
```

每个 `ResolvedAction` 包含已解析的 `realStartTime`、`realDuration`、`resolvedHits`（含现实时间戳）和 `effects`（含效果起止时间）。
