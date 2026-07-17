# 触发器系统：事件总线架构

## 概述

有条件触发的效果（"暴击命中时叠加狼血"、"施加灼热附着后..."）通过事件总线模式实现。这是一个标准的**订阅-发布**架构。

## 架构

```
                    模拟引擎（事件生产者）
                    ┌──────────────────┐
                    │ HitHandler       │── registry.onHit(e, ctx)
                    │ ActionStartHandler│── registry.onActionStart(e, ctx)
                    │ OperatorEffectHandler│── registry.onStatusApplied(...)
                    │ StaggerChangeHandler│── registry.onStatusApplied(...)
                    │ ActionEndHandler  │── registry.onActionEnd(...)
                    └──────────────────┘
                              │ 发布事件
                              ▼
                    ┌──────────────────┐
                    │ TriggerRegistry   │  ← 事件总线
                    │                  │
                    │ entries[] = [    │  ← 订阅者列表
                    │   { trigger:     │     （来自 collectTriggerEffects）
                    │     { kind:'onHit', ... },
                    │     effects: [...],
                    │     sourceTrackId: 'rossi' },
                    │   { trigger:     │
                    │     { kind:'onStatusApplied', ... },
                    │     effects: [...],
                    │     sourceTrackId: 'laevatain' },
                    │   ...
                    │ ]
                    └──────────────────┘
                              │ 匹配事件类型 → 检查条件 → 派发效果
                              ▼
                    dispatchSingleActorEffect()
                    dispatchEnemyEffects()
```

## 注册阶段

`collectTriggerEffects()` 从干员/武器/装备中收集所有带触发条件的效果，产出 `TriggerRegistryEntry[]`，注入 `TriggerRegistry` 构造函数：

```typescript
class TriggerRegistry {
  private entries: TriggerRegistryEntry[];

  constructor(entries: TriggerRegistryEntry[]) {
    this.entries = entries; // 直接注入，不作预处理
  }
}
```

每个 entry 包含：

- `triggerEffect` — 触发条件（event kind + 筛选参数）+ 触发后执行的效果列表
- `sourceTrackId` — 效果来源干员（LMDI 归因用）
- `sourceSkillType` — 来源技能类型（伤害计算用）

## 触发阶段

模拟引擎中的各个 Handler 在合适的时机调用 TriggerRegistry 的对应方法：

### 攻击事件

```typescript
this.registry?.onHit(event, ctx);
```

```typescript
// TriggerRegistry.onHit()
onHit(event, ctx) {
  for (const entry of this.entries) {
    if (entry.trigger.kind !== 'onHit') continue;          // 1. 事件类型匹配
    if (!passesTriggerScope(entry, event)) continue;       // 2. scope 筛选（self/global）
    if (!passesSkillFilter(entry, event)) continue;        // 3. skillTypes/skillId 筛选
    if (!checkCondition(entry, ctx)) continue;             // 4. 条件检查（enemyStatus 等）
    if (!checkICD(entry, event.time)) continue;            // 5. ICD 冷却检查
    dispatchSingleActorEffect(entry.triggerEffect, ...);   // 6. 派发效果
  }
}
```

### 其他事件入口

| 方法                                                  | 触发时机                   | 调用者                                                |
| ----------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| `onActionStart(e, ctx)`                               | 技能开始时                 | ActionStartHandler                                    |
| `onDuringAction(e, ctx)`                              | 技能持续期间               | ActionStartHandler                                    |
| `onStatusApplied(id, stat, scope, source, time, ctx)` | 状态效果施加时             | OperatorEffectHandler, EnemyEffectHandler, HitHandler |
| `onStatusConsumed(...)`                               | 状态被消耗时               | conditionHasConsume 路径                              |
| `onStatusExpire(...)`                                 | 状态过期时                 | EffectManager                                         |
| `onFinalStrike(e, ctx)`                               | 普攻序列最后一击（重击）时 | HitHandler                                            |
| `onFinisher(e, ctx)`                                  | 处决时                     | HitHandler                                            |
| `onDive(e, ctx)`                                      | 下落攻击时                 | HitHandler                                            |
| `onSpRecovery(e, ctx)`                                | 技力回复时                 | SpChangeHandler                                       |

## 事件类型与触发条件

```typescript
type TriggerEvent =
  | { kind: 'onHit' } // 命中时
  | { kind: 'onFinalStrike' } // 普攻序列最后一击（重击）时
  | { kind: 'onFinisher' } // 处决时
  | { kind: 'onDive' } // 下落攻击时
  | { kind: 'onSpRecovery' } // 技力回复时
  | { kind: 'onStatusApplied' } // 状态施加时
  | { kind: 'onStatusExpire' } // 状态过期时
  | { kind: 'onStatusConsumed' } // 状态被消耗时
  | { kind: 'onActionStart' } // 动作开始时
  | { kind: 'duringAction' }; // 动作持续期间
```

每种事件类型可附加筛选参数：

- `skillTypes` / `skillId` — 限制特定技能
- `element` — 限制特定元素
- `triggerScope: 'self' | 'global'` — 仅自身触发还是全局触发
- `status` + `target` — 状态事件限定特定状态（如 `status: 'heatInfliction', target: 'enemy'`）

## patchHit 效果 vs trigger 效果的区别

|                  | patchHit（嵌入命中）                                    | trigger（事件总线）                          |
| ---------------- | ------------------------------------------------------- | -------------------------------------------- |
| **到达方式**     | 编译时固化在 `hit.effects[]` 中                         | 注册在 TriggerRegistry.entries[] 中          |
| **触发者**       | HitHandler 直接调用 `dispatchEnemyEffects(hit.effects)` | TriggerRegistry 被 HitHandler 调用后遍历匹配 |
| **是否可被监听** | 否（razorClawmark 只是命中数据）                        | 是（`onStatusApplied` 可监听"狼血层数变化"） |
| **语义**         | 这是命中自带的、永久改写技能内容                        | 条件满足时发生、可独立存在                   |

## 架构优化方向

`patchHit` 和 trigger 效果分走两条管道的根本原因是 trigger 系统缺少**命中级筛选**。如果给 `TriggerEvent.onHit` 增加 `hitId` 字段：

```typescript
type TriggerEvent =
  | { kind: 'onHit'; hitId?: string; skillId?: string; ... }
```

则所有 `patchHit` 可改写为 trigger，统一到 `collectTriggerEffects` → `TriggerRegistry` 单管道。`patchCombatSkills` 安全删除。

## `patchCombatSkills` 与 `collectTriggerEffects` 的分工

两者都读取 `combatSkills`，但操作不同的部分：

```
combatSkills.battleSkill
  ├── segments[]         → patchCombatSkills（编译段命中结构）
  ├── triggers[]         → collectTriggerEffects（注册到事件总线）
  └── effects[]          → collectEffects（空，当前未使用）
```

`patchCombatSkills` 的 Pass 1b 访问 trigger，但只修改 trigger 内部的 `damageHit.hit` 内容（"触发时打出的那段伤害长什么样"），不参与触发机制本身。触发条件（`onHit`、`onStatusApplied` 等）的注册由 `collectTriggerEffects` 完成。两者修改同一个 trigger 对象的不同层面，互不干扰。
