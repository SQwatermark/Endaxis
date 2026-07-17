# 技能前置条件警告

## 概述

在时间轴技能块上显示红色三角警告标记，提示该技能在当前时间点无法释放。覆盖三类技能，当前包含四项检查，与禁用标记位置重叠互斥。

## 四项检查

| 类型        | 条件             | 判断逻辑                                                                                |
| ----------- | ---------------- | --------------------------------------------------------------------------------------- |
| comboSkill  | 是否在连携窗口内 | `snapTimeToFrame(start)` 是否落入自身任一 `comboWindowLayout` segment                   |
| comboSkill  | 连携释放顺序     | 全队当前已打开的连携窗口按“开窗时间 → track 序号”排队；只能释放队首窗口对应干员的连携技 |
| battleSkill | SP 是否足够      | 二分查找 `spSeries`，取扣除前值（`actionId` 匹配避过同帧扣除点），与 `spCost` 比较      |
| ultimate    | gauge 是否足够   | 同上逻辑，gaugeCost 乘以 `(1 - reduction)` 得到 effectiveCost                           |

## 像素对齐

- 所有时间比较统一经过 `snapTimeToFrame`，消除存储/传输路径间的浮点漂移
- `Event.comboWindow` 和 `event.endPoint` 也在比较前帧对齐

## 无窗口干员过滤

通过 `getOperator(id).combatSkills.comboSkill.comboWindow` 判断干员是否定义了连携窗口。未定义的干员（如卡契尔、余烬、昼雪）跳过连携窗口检查。

## 数据流

```
projectRequisiteWarnings(
    tracks,
    comboWindowLayouts,
    spSeries,
    gaugeSeriesByTrackId,
) → Map<instanceId, RequisiteWarning>
    ↓
ActionItem.vue → 红色三角 + tooltip
```

## Gauge 缩减对齐

当前检查逻辑位于 `src/simulation/projection/projectRequisiteWarnings.ts`。终结技检查会读取当前轨道的 `operatorStatus.ultimateEnergyCostReduction`，用 `rawCost * (1 - reduction)` 得到实际需求，再与 `projectUltimateSeries` 得到的终结技能量曲线对照。

这意味着终结技能量不足提示应该与底部终结技能量曲线使用同一套模拟日志来源，避免 UI 另起一套账本。

## i18n

`actionItem.requisiteTitle.comboWindow` / `comboOrder` / `spInsufficient` / `gaugeInsufficient`
