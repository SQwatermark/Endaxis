# 连携窗口架构

## 数据模型

`CombatSkillEntry.comboWindow` 定义在干员数据中：

```typescript
comboWindow?: {
  trigger?: TriggerEvent;       // 单 trigger（onStatusApplied / onFinalStrike / onHit 等）
  triggers?: TriggerEvent[];    // 多 trigger 数组
  condition?: EffectCondition;  // 可选额外条件
  duration: number;             // 窗口持续秒数
  icon?: string;                // 图标（默认干员头像）
}
```

## 收集阶段

`collect.ts` 在 `collectTriggerEffects` 中遍历每个 `comboSkill.comboWindow`，将其展开为两个合成 trigger：

1. **窗口激活**：`triggers[]` → `TriggerEffect { trigger, effects: [comboWindow status] }`
2. **自动消费**：`onActionStart(skillTypes: 'comboSkill') → consume comboWindow`

窗口 effect 的结构：

```typescript
{
  id: `${slug}-combo-window`,
  name: 'comboWindow',
  kind: 'status',
  target: 'triggerOwner',
  duration: cw.duration,
  condition: [cw.condition, { kind: 'comboNotOnCooldown' }],
}
```

- `target: 'triggerOwner'` 确保窗口始终施加到 trigger 注册者（连携技拥有者），不受事件来源影响
- `comboNotOnCooldown` 是新增的 condition，运行时查询冷却状态

## 冷却判断

`comboNotOnCooldown` 在 `evaluateEffectCondition` 中实现：

```
1. 从 ctx.getAllActions() 找最后一条属于当前 track 的 comboSkill action（realStartTime ≤ time）
2. cooldownEnd = action.realStartTime + action.cooldown - actor.getCdReduction(actionId)
3. 当前 time ≥ cooldownEnd → 冷却结束 → 条件通过
```

`ActorState` 维护 `cdReductions` map：`TriggerRegistry.applyCooldownReduction` 在每次缩减时调用 `actor.recordCdReduction(actionId, amount)`。

## 投影层

`projectComboWindows.ts` 独立于 buff 效果投影：

```
operatorLog 中 OPERATOR_EFFECT_APPLY / OPERATOR_EFFECT_EXPIRE 事件
  过滤：id 以 'combo-window' 结尾
  ↓
状态机：apply 开窗，expire 关窗，同 tick 内 expire 优先
  ↓
ComboWindowSegment[] { start, end, duration, color: '#fdd900' }
```

## 渲染层

`TimelineComboWindowBar.vue` — 轨道底部的金色虚线 bar：

- 左右端点标记（1px 竖线）
- 中间虚线（`border-bottom: dashed`）
- 右上角显示时长文字

不走 `TimelineBuffLayer`——独立的 z-index 层，与 buff/debuff segment 视觉分离。

## 与 Buff 系统的区别

|          | Buff segment             | Combo window                   |
| -------- | ------------------------ | ------------------------------ |
| **投影** | `projectOperatorEffects` | `projectComboWindows`          |
| **渲染** | `TimelineBuffLayer`      | `TimelineComboWindowBar`       |
| **视觉** | 彩色实心条 + 图标        | 金色虚线 bar + 端点标记 + 时长 |
| **位置** | 轨道行内部               | 轨道行底部条                   |
| **语义** | 属性修改效果             | 技能可用性窗口                 |
|          | **消费**                 | 自然过期或消耗                 | 连携释放时自动 consume |

## 精准衔接（Perfect Timing）内嵌

对于洛茜等二段连携干员，精准衔接窗口不再是独立 bar，而是以子段形式嵌入连携窗口：

**投影合并** (`mergeWithPerfectTiming`)：

```
1. 收集 comboWindow 和 perfect-timing 的所有边界时间点
2. 排序去重，相邻点组成区间
3. 每个区间标记属于哪种（普通 / 精准衔接）
4. 精准衔接仅在连携窗口内才出现
5. 使用 timeToFrame 整数帧比较替代浮点 epsilon
```

**渲染** (`perfect-timing-bar` class)：

- 流动虚线：`repeating-linear-gradient` + `dash-flow` 0.5s 动画（`background-position-x` 循环）
- 滑动圆点：`::after` 4px 金色圆点，`move-along-path` cubic-bezier 缓动滑行
- tooltip："精准衔接"（`effects.name.perfectTiming`）
