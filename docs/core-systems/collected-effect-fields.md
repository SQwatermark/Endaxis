# CollectedEffect 字段详解

## 为什么需要 CollectedEffect：原始数据 vs 已解析数据

原始数据（OperatorSheet / WeaponSheet / GearSetSheet 等）是**参数化的声明式定义**，模拟引擎无法直接消费。CollectedEffect 承担了编译器的工作，将声明式 DSL 编译为可执行的指令流。

### 原始数据不能直接用的 7 个原因

| 问题           | 原始数据                                           | CollectedEffect                                                 |
| -------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| **值未解析**   | `value: [12, 21, 31, 40, 50]` 数组，取决于技能等级 | `value: 50` 标量（已按等级索引展开）                            |
| **ID 缺失**    | 很多 effect 没有 `id` 字段                         | 每个 effect 都有 `makeEffectId()` 生成的唯一 id                 |
| **属性占位符** | `attribute: 'main'` / `'sub'`                      | `attribute: 'intellect'`（已替换为实际属性名）                  |
| **嵌套层级深** | talents→triggers→effects→nested... 多层嵌套        | 扁平 `CollectedEffect[]` 列表                                   |
| **来源不明**   | 不知道 effect 来自天赋/武器/装备/套装              | `sourceGroup` + `sourceSlotIndex` + `sourceOperatorSlug` 已标注 |
| **补丁未应用** | Patch 系统独立存在（appendEffect / patchEffect）   | `resolvePatches()` 已合并                                       |
| **默认值缺失** | 部分可选字段省略（duration / stacks / maxStacks）  | `resolveEffectDefaults()` 已补全                                |

### 具体示例

**原始数据（莱万汀天赋效果）**：

```typescript
// OperatorSheet — 嵌套在 talents[0].triggers[1].effects[0]
{
  ...GAIN_MELTING_FLAME_EFFECT,  // 引用外部常量
  stacks: 'fromConsume',          // 动态值，运行时才知道
  duration: 999,                  // 还是原始值
  // id 未定义 — 依赖外部常量中的定义
}
```

**CollectedEffect（同一效果编译后）**：

```typescript
{
  effect: {
    kind: 'status',
    id: 'laevatain-talent0-effect1',     // ← makeEffectId / ensureEffectId 生成
    name: '熔火',                          // ← hydrateEffect 填充（有问题，见 collect-analysis.md）
    stacks: 'fromConsume',                // ← 保留动态语义
    duration: 999,                        // ← resolveEffect 已解析
    maxStacks: 4,
    sourceGroup: 'operator',              // ← hydrateEffect 标注
    icon: ['magma_1', 'magma_2', ...],   // ← 保留
    target: 'self',
    // ...其他默认值已补全
  },
  sourceSlotIndex: 0,                     // ← 槽位 0
  sourceOperatorSlug: 'laevatain',        // ← 来源干员
}
```

### 5 种原始数据源 → 1 种统一输出

```
OperatorSheet     ─┐
  talents           │
  potentials        │
  combatSkills      │
                    ├── collect.ts ──→ CollectedEffect[] ──→ compileScenario
WeaponSheet       ─┤                                        → computeStats
  skill1/2/3        │                                        → SimulationEngine
                    │
GearSetSheet      ─┤
  effects           │
                    │
GearPieceSheet    ─┤
  effects + defense │
                    │
隐式效果           ─┘
  (装备防御力)
```

本质上是一个**编译步骤** — 和编译器把源码转成 IR（中间表示）是同样的角色。

## 顶层：CollectedEffect

```typescript
interface CollectedEffect {
  effect: ResolvedEffect; // 已解析的效果对象
  sourceSlotIndex: number; // 来源槽位 0-3
  sourceOperatorSlug: string; // 来源干员 slug
}
```

### sourceSlotIndex

**值**：0 | 1 | 2 | 3

**含义**：效果来自队伍 4 个槽位中的哪一个。LMDI 贡献分解依赖此字段将增伤/减益归因到具体干员。例如槽位 0 的干员施加了 `dmgBonus +10%`，这个效果就打上 `sourceSlotIndex: 0`，LMDI 计算时据此将伤害增量归属给槽位 0 的干员。

**赋值**：`collectEffects()` 的 `for (let slotIndex = 0; ...)` 循环中，所有该槽位下收集的效果共享同一个 `slotIndex`。

### sourceOperatorSlug

**值**：字符串，如 `"laevatain"`、`"rossi"`

**含义**：直接标注效果来自哪个干员。注意这不是实例 ID（同一干员可能有多个实例），而是干员数据表的 key。用于 LMDI 归因和调试。

---

## 核心：ResolvedEffect

`ResolvedEffect` 是 `Effect` 的已解析版本，所有 `Leveled<T>`（数组值）已按技能/天赋等级展开为标量。

### 共有字段（EffectBase）

#### kind

**值**：`'status'` | `'infliction'` | `'burst'` | `'reaction'` | `'physicalStatus'` | `'damageHit'` | `'damageOverTime'` | `'spRecovery'` | `'spReturn'` | `'ultEnergyGain'` | `'consume'` | `'derived'` | `'oneTime'` | `'cooldownReductionFlat'` | `'cooldownReductionPercent'`

**含义**：效果的**类型标签**。模拟引擎根据 `kind` 决定如何处理这个效果：

- `status` → 进入 `OperatorEffectState` 或 `EnemyState`，作为 Buff/Debuff 持续存在
- `infliction` / `burst` → 施加元素附着/爆发层数
- `reaction` → 触发元素反应
- `physicalStatus` → 施加物理异常
- `damageHit` → 立即造成一次伤害
- `damageOverTime` → 创建 DOT 计时器
- `spRecovery` / `spReturn` → 技力回复/返还
- `ultEnergyGain` → 终结技能量获取
- `consume` → 直接消耗敌对/自身状态
- `oneTime` → 一次性消耗效果（下次技能时消费）
- `cooldownReduction*` → 冷却缩减

#### id

**值**：字符串，如 `"laevatain-melting-flame"`、`"laevatain-talent0-effect0"`；如果落到 `resolveEffect()` 最后兜底，也可能出现随机短 id（应视为待治理风险，而不是理想路径）。

**含义**：效果的**全局唯一标识符**。作用：

1. **去重**：同一 id 的效果不会重复添加（堆叠策略控制）
2. **查找**：`EffectManager` 通过 id 查找活跃效果进行修改/移除
3. **Patch 目标**：`AppendEffect` 通过 `targetEffect` 匹配 id 来追加效果
4. **调试**：战斗日志中引用

**三级来源**（`ensureEffectId` → `makeEffectId` → `uid()`）：

| 优先级 | 格式                               | 示例                        | 确定性 | 何时触发                                                                     |
| ------ | ---------------------------------- | --------------------------- | ------ | ---------------------------------------------------------------------------- |
| 1      | sheet 定义的语义 id                | `laevatain-melting-flame`   | ✓      | 效果自带 `id`，跨效果引用依赖此 id                                           |
| 2      | `makeEffectId(slug, section, idx)` | `laevatain-talent0-effect0` | ✓      | 效果无 id，`ensureEffectId` 兜底                                             |
| 3      | `uid()` 随机字符串                 | `k3x8m2p`                   | ✗      | effect 未经过 `ensureEffectId` / `stampTriggerEffect` 就进入 `resolveEffect` |

sheet 定义的 id（如 `laevatain-melting-flame`）有业务含义 — `AppendEffect.targetEffect`、`DerivedEffect.sourceEffect`、`PatchEffect.targetEffect` 都用这些 id 做跨效果引用。`makeEffectId` 生成的是位置性标识，通常用于让无 id 效果在当前数据结构中稳定可追踪。`uid()` 是非确定性的，同一配置两次 collect 会产出不同 id，应继续收敛。（详见 `collect-analysis.md` 不一致 8、9）

#### name

**值**：字符串，如 `"razorClawmark"`、`"碾骨"`、`"护甲 Defense"`

**含义**：效果的**显示名称**。渲染层通过 `getEffectName()` 解析：

```
if i18n 有 `effects.name.{name}` → 用翻译
else if i18n 有 `{name}`          → 用翻译
else                               → 直接显示 name
```

**已知问题**：name 有三种不同来源的语义，不统一（见 `collect-analysis.md`）。

#### icon

**值**：`string | string[]`，如 `"/operators/laevatain/magma_1.webp"` 或 `["magma_1", "magma_2", "magma_3"]`

**含义**：效果的**图标路径**。数组形式按层数索引不同图标（stack 1 → `[0]`，stack 2 → `[1]`），用于时间轴效果覆盖层渲染。

#### duration

**值**：`number`（秒）

**含义**：效果的**持续时间**。`InflictionEffect`、`BurstEffect` 默认走 `afflictionEffectMap` 的配置时长。`status` 效果过期时从 `EffectManager` 移除，触发 `onStatusExpire`。

#### durationExtension

**值**：`number`（秒）

**含义**：**额外持续时间**。最终持续 = `duration + durationExtension`。用于某些需要比基础时长多持续一段的效果。

#### stacks

**值**：`number | 'fromConsume'`

**含义**：效果的**初始层数**。

- `number` → 固定层数（如 `3`）
- `'fromConsume'` → 层数 = 触发时消耗的状态层数（如消耗了 3 层灼热附着，初始就是 3 层）

#### maxStacks

**值**：`number`

**含义**：最大堆叠层数。超过此值后，叠加策略（stackStrategy）决定如何处理新施加的同 id 效果。

#### stackStrategy

**值**：`'REFRESH_DURATION'` | `'INDEPENDENT'` | `'REPLACE'`

**含义**：**堆叠行为**：

- `REFRESH_DURATION`（默认）：同 id 效果再次施加时，刷新持续时间，不增加层数
- `INDEPENDENT`：每层独立计时，可叠加到 maxStacks
- `REPLACE`：新效果完全替换旧效果

#### condition

**值**：`EffectCondition | EffectCondition[]`

**含义**：效果**生效的条件**。数组为 AND 逻辑（所有条件满足才生效）。条件类型包括：

- `enemyStatus` — 敌人有某状态（可选 `consume` 消耗）
- `enemyHp` — 敌人血量阈值
- `enemyStaggered` — 敌人是否失衡
- `operatorStatus` — 干员有某状态（可选 `consume`）
- `operatorHp` — 干员血量阈值
- `comboNotOnCooldown` — 连携窗口开窗时检查连携冷却
- `actionLinkConsumed` — 连携被消耗
- `not` — 条件取反
- `or` — 条件或

消耗型条件（`consume: true`）会在条件检查通过后自动移除被检查的状态。

#### icd

**值**：`number`（秒）

**含义**：**内部冷却时间**。同一触发源在 icd 秒内不会再次触发此效果。防止高频触发导致效果泛滥。

#### icdGroup

**值**：`string`

**含义**：共享 ICD 桶。同 `icdGroup` 的多个效果共享一个冷却计时器，任何一个触发后都会进入冷却。

#### sourceGroup

**值**：`'operator'` | `'weapon'` | `'gearSet'`

**含义**：效果的**来源分类**。用于 UI 分组显示（动作增益面板按来源分色）。

#### hide

**值**：`boolean`

**含义**：是否在时间轴上**隐藏**此效果。某些内部状态（如莱万汀的熔火层数计数器）设为 `hide: true`，不在效果覆盖层渲染。

#### ignoreTimeShift

**值**：`boolean`

**含义**：是否**忽略时停影响**。连携/终结技的时停会延长效果持续时间；设为 `true` 的效果不受此影响，按现实时间计算。

#### applyTiming

**值**：`'beforeDamage'` | `'afterDamage'`

**含义**：效果在**伤害计算前还是后**施加。默认是 `afterDamage`（伤害不受本次施加的效果影响）。`beforeDamage` 让效果先生效再算伤害。

---

### kind 专属字段

#### status（状态效果）

| 字段       | 类型                 | 含义                                                  |
| ---------- | -------------------- | ----------------------------------------------------- |
| `stat`     | `EffectStat`         | 属性修改器（`atkPercent`、`dmgBonus`、`critRate` 等） |
| `value`    | `number`             | 修改数值（如 15 表示 +15%）                           |
| `scaling`  | `ResolvedScalingDef` | 数值缩放公式（属性缩放、层数缩放）                    |
| `target`   | `EffectTarget`       | 作用目标（`self`/`team`/`enemy`/`controlled` 等）     |
| `silent`   | `boolean`            | 静默施加（不触发 `onStatusApplied` 事件）             |
| `external` | `boolean`            | 独立乘区标记（不参与加法池，单独相乘）                |

**这是最常见的效果类型**。所有 Buff/Debuff 都通过 status 实现。`stat` 决定改什么属性，`value` 决定改多少，`target` 决定作用在谁身上。

#### infliction（元素附着）

| 字段      | 类型                                   | 含义           |
| --------- | -------------------------------------- | -------------- |
| `element` | `'heat'\|'cryo'\|'electric'\|'nature'` | 附着的元素类型 |

施加到敌人后，增加元素附着层数。同元素重复施加触发 `burst`，异元素组合触发 `reaction`。

#### burst（元素爆发）

| 字段      | 类型        | 含义           |
| --------- | ----------- | -------------- |
| `element` | ArtsElement | 爆发的元素类型 |

同元素重复附着时触发。仅产生日志/显示效果，不增加层数。

#### reaction（元素反应）

| 字段                 | 类型                                                             | 含义                  |
| -------------------- | ---------------------------------------------------------------- | --------------------- |
| `reactionType`       | `'solidification'\|'electrification'\|'corrosion'\|'combustion'` | 反应类型              |
| `requiresInfliction` | `ArtsElement[]`                                                  | 需要消耗哪些附着      |
| `effectiveness`      | `number`                                                         | 效果倍率系数          |
| `defaultLevel`       | `number`                                                         | 默认反应等级（1-MAX） |

#### physicalStatus（物理异常）

| 字段            | 类型                                                      | 含义                     |
| --------------- | --------------------------------------------------------- | ------------------------ |
| `physicalType`  | `'vulnerability'\|'lift'\|'knockdown'\|'crush'\|'breach'` | 物理异常类型             |
| `forced`        | `boolean`                                                 | 是否强制施加（无视霸体） |
| `effectiveness` | `Leveled<number>`                                         | 效果强度                 |

#### damageHit（单次伤害）

| 字段                 | 类型                  | 含义                                 |
| -------------------- | --------------------- | ------------------------------------ |
| `element`            | `DamageElement`       | 伤害元素类型                         |
| `multiplier`         | `number`              | 伤害倍率（如 155 = 155%）            |
| `multiplierScaling`  | `ResolvedScalingDef`  | 倍率缩放公式                         |
| `staggerScaling`     | `ResolvedScalingDef`  | 失衡值缩放公式                       |
| `offset`             | `number`              | 延迟触发时间（秒）                   |
| `hit`                | `Hit`                 | 命中数据（sp/stagger/effects）的覆盖 |
| `readConsumedStacks` | `{statusKey, target}` | 读取被消耗状态的层数，标注到伤害日志 |
| `scaleByCrit`        | `boolean`             | 倍率是否受暴击率缩放                 |

#### damageOverTime（持续伤害）

| 字段                  | 类型              | 含义                                |
| --------------------- | ----------------- | ----------------------------------- |
| `element`             | `DamageElement`   | 伤害元素                            |
| `multiplier`          | `number`          | 每跳倍率                            |
| `multiplierMode`      | `'each'\|'split'` | each=每跳独立倍率，split=总倍率均分 |
| `interval`            | `number`          | 每跳间隔（秒）                      |
| `offset`              | `number`          | 首次伤害延迟                        |
| `snapshot`            | `boolean`         | 是否快照施加时的属性                |
| `canCrit`             | `boolean`         | 是否能暴击                          |
| `skipFirstTick`       | `boolean`         | 是否跳过 t=0 的第一跳               |
| `cancelOnRefresh`     | `boolean`         | 重新施加时取消未完成的跳            |
| `consumedStatEffects` | `{stat, value}[]` | 每跳附带的状态效果                  |

#### spRecovery / spReturn（技力）

| 字段      | 类型                 | 含义     |
| --------- | -------------------- | -------- |
| `value`   | `number`             | 技力数值 |
| `scaling` | `ResolvedScalingDef` | 缩放公式 |

`spRecovery` 会触发 `onSpRecovery` 事件并获得终结技能量；`spReturn` 不会。

#### ultEnergyGain（终结技能量）

| 字段      | 类型                 | 含义              |
| --------- | -------------------- | ----------------- |
| `value`   | `number`             | 能量数值          |
| `scaling` | `ResolvedScalingDef` | 缩放公式          |
| `target`  | `EffectTarget`       | 目标（默认 self） |

#### cooldownReduction（冷却缩减）

| 字段         | 类型                     | 含义             |
| ------------ | ------------------------ | ---------------- |
| `value`      | `number`                 | 缩减值（秒或 %） |
| `target`     | `EffectTarget`           | 作用目标         |
| `skillTypes` | `SkillType\|SkillType[]` | 限制技能类型     |
| `skillId`    | `string\|string[]`       | 限制特定技能     |

#### oneTime（一次性消耗）

| 字段         | 类型                     | 含义                 |
| ------------ | ------------------------ | -------------------- |
| `stat`       | `OperatorStat`           | 提供的属性修改       |
| `value`      | `number`                 | 修改数值             |
| `target`     | `EffectTarget`           | 作用目标             |
| `skillTypes` | `SkillType\|SkillType[]` | 哪些技能会消耗此效果 |
| `skillId`    | `string\|string[]`       | 特定技能消耗         |

在匹配的技能开始时自动消耗，将属性注入该次技能的命中。

#### consume（消耗）

| 字段             | 类型                          | 含义                      |
| ---------------- | ----------------------------- | ------------------------- |
| `operatorStatus` | `string\|EffectStat\|(...)[]` | 消耗的干员状态            |
| `enemyStatus`    | `string\|EnemyStat\|(...)[]`  | 消耗的敌人状态            |
| `consumeStacks`  | `number`                      | 消耗层数（不指定 = 全部） |
| `consumeScope`   | `'team'`                      | 从全队消耗                |

---

## 外层：CollectedEffect 与后续管道

`CollectedEffect[]` 进入 `compileScenario` 后：

1. **分区**：按 `sourceSlotIndex` 分区，同一个槽位的效果归给同一个干员
2. **属性计算**：`computeStats()` 遍历所有 status 效果，累积 `atkPercent`、`dmgBonus` 等，输出 `OperatorStatus`
3. **触发器注册**：`TriggerEffect` 被注册到 `TriggerRegistry`，模拟引擎运行时按触发条件激活
4. **初始效果注入**：status 效果直接注入 `ActorState` 的初始效果池
