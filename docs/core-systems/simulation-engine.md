# 战斗模拟引擎

## 概述

模拟引擎是 Endaxis 的计算核心，采用**离散事件模拟**（Discrete Event Simulation）架构。它接收编译后的时间轴，逐事件推进游戏状态，计算每一次伤害、每一个效果的施加与消耗，最终输出完整的战斗日志和伤害分析。

## 核心架构

```
SimulationEngine
├── PriorityQueue<SimEvent>     # 事件优先队列
├── Map<SimEventType, EventHandler>  # 事件处理器注册表
├── GameState                   # 全局游戏状态
└── SimulationContext           # 依赖注入上下文
```

## 事件类型（SimEventType）

| 事件类型                 | 处理器                | 说明                                                                            |
| ------------------------ | --------------------- | ------------------------------------------------------------------------------- |
| `ACTION_START`           | ActionStartHandler    | 动作开始：记录日志、消耗技力、暂停技力回复、触发 onActionStart / onDuringAction |
| `ACTION_END`             | ActionEndHandler      | 动作结束                                                                        |
| `DAMAGE_HIT`             | HitHandler            | 造成伤害：计算最终伤害数值，应用暴击                                            |
| `SP_CHANGE`              | SpChangeHandler       | 技力变化（回复/返还）                                                           |
| `SP_REGEN_PAUSE`         | SpRegenPauseHandler   | 技力暂停自动回复                                                                |
| `ULT_ENERGY_CHANGE`      | UltEnergyHandler      | 终结技能量变化                                                                  |
| `STAGGER_CHANGE`         | StaggerChangeHandler  | 失衡值变化                                                                      |
| `OPERATOR_EFFECT_APPLY`  | OperatorEffectHandler | 干员侧状态效果应用                                                              |
| `OPERATOR_EFFECT_EXPIRE` | OperatorEffectHandler | 干员侧状态效果过期                                                              |
| `ENEMY_EFFECT_APPLY`     | EnemyEffectHandler    | 敌人侧附着、异常、反应、减益等效果应用                                          |
| `ENEMY_EFFECT_EXPIRE`    | EnemyEffectHandler    | 敌人侧效果过期                                                                  |
| `ARTS_BURST`             | EnemyEffectHandler    | 元素爆发事件                                                                    |
| `CORROSION_TICK`         | EnemyEffectHandler    | 腐蚀逐秒结算                                                                    |
| `DOT_TICK`               | EnemyEffectHandler    | 持续伤害逐跳结算                                                                |

## 模拟循环

```
run() {
    while (队列非空) {
        取出下一个事件
        推进 GameState 时间至事件时刻
        查找对应 EventHandler
        执行 handler.handle(event, ctx)
    }
    推进至 endlineTime（如有）
    返回 { state, simLog, enemyLog, operatorLog, actionEndTimes }
}
```

### 关键特性

1. **事件驱动而非步进**：只在事件发生时刻计算，跳过空闲间隙
2. **依赖注入**：所有处理器通过 `SimulationContext` 获取状态读写、事件入队、日志记录能力
3. **终结技能量阻塞窗口**：终结技的强化时间（enhancementTime）期间，终结技能量获取被阻止

## 游戏状态（GameState）

`GameState` 维护模拟的实时状态快照：

```
GameState
├── TeamState          # 队伍状态
│   ├── 各轨 ActorState   # 每个干员的实时状态
│   │   ├── SP 技力
│   │   ├── Ultimate Energy 终结技能量
│   │   ├── Status Effects 活跃状态效果
│   │   └── Cooldowns 冷却时间
│   └── EffectManager   # 效果管理器（属性修改汇总）
├── EnemyState         # 敌人状态
│   ├── HP / DEF / Resistance
│   ├── Stagger 失衡值
│   ├── Infliction Stacks 元素附着层数
│   └── Active Effects 活跃效果（脆弱/减抗/减速等）
└── currentTime        # 当前模拟时间
```

## 事件处理器

### HitHandler（伤害处理）

伤害计算的最核心处理器：

```
1. 获取攻击方属性快照（攻击力、增伤、暴击率等）
2. 获取目标方属性快照（防御、减伤、抗性、易伤等）
3. 计算基础伤害 = ATK × multiplier × 防御公式
4. 应用增伤修饰（dmgBonus、元素增伤等）
5. 应用目标修饰（易伤、减伤、抗性削减等）
6. 暴击判定 → 应用暴击伤害
7. 应用敌人伤害上限（Damage Cap Window）
8. 记录伤害分解（DamageBreakdown）
9. 触发 onHit 效果
```

### SpChangeHandler（技力处理）

处理技力回复（SP Recovery）和技力返还（SP Return）：

- **技力回复**：触发 `onSpRecovery` 效果，可获取终结技能量
- **技力返还**：不触发 `onSpRecovery`，不获取终结技能量（消耗返还的技力不算消耗）

### StaggerChangeHandler（失衡处理）

管理敌人的失衡状态：

- 累积失衡值达到 `maxStagger` → 进入失衡节点
- 连续消耗 `staggerNodeCount` 个节点 → 触发失衡破防
- 失衡破防期间：伤害 × 1.3（失衡乘区）

## 日志系统

模拟引擎输出三种日志：

| 日志类型               | 内容                                 |
| ---------------------- | ------------------------------------ |
| `SimLogEntry[]`        | 通用事件日志（含时间、类型、上下文） |
| `EnemyStateEvent[]`    | 敌人状态变化日志                     |
| `OperatorStateEvent[]` | 干员状态变化日志                     |

所有日志在 UI 的"战斗日志"面板中可筛选、搜索查看。
