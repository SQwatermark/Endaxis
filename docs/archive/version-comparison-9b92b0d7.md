# 架构版本对比：9b92b0d7 前后

> 状态：历史归档。
>
> 本文用于说明 `9b92b0d7` 前后的架构变化，不代表当前 `main` 的最新结构。当前版本已经在此基础上继续完成 TypeScript 化、`timelineStore.ts` 拆分、`simulation/projection` 归位等工程整理。当前结构请以 `docs/architecture/overview.md` 和 `docs/architecture/data-flow.md` 为准。

## 概述

提交 `9b92b0d7`（"Feat : 合并"，+65151/-9505 行，1141 个文件）是一次大规模架构重构。本文档对比该提交前后的架构差异。

---

## 一、旧版架构（9b92b0d7 之前）

### 目录结构

```
src/
├── main.js
├── App.vue
├── router/index.js
│
├── api/                          # API 层
│   ├── fetchStrategy.js           # 加载方案
│   └── saveStrategy.js            # 保存方案
│
├── simulation/                   # 模拟引擎（轻量版）
│   ├── compiler/                  # 时间轴编译
│   │   ├── compileTimeline.ts     #   游戏时间→现实时间
│   │   ├── compileScenario.ts     #   场景编译（简单的 stats merge）
│   │   ├── timeContext.ts         #   时停上下文
│   │   └── fixture/               #   测试固件（硬编码的 JSON 场景）
│   │       ├── scenario-1.ts      #     示例：骏卫排轴
│   │       └── scenario-2.ts
│   │
│   ├── engine/                    # 事件引擎
│   │   ├── SimulationEngine.ts
│   │   ├── PriorityQueue.ts
│   │   ├── SimulationContext.ts
│   │   └── createEngine.ts
│   │
│   ├── events/                    # 事件处理器（9 个独立文件）
│   │   ├── ActionStartHandler.ts
│   │   ├── ActionEndHandler.ts
│   │   ├── DamageHandler.ts       #   TODO: 伤害计算（未实现！）
│   │   ├── EffectStartHandler.ts
│   │   ├── EffectEndHandler.ts
│   │   ├── UltimateChargeChangeHandler.ts
│   │   ├── SpChangeHandler.ts
│   │   ├── SpRegenPauseHandler.ts
│   │   └── StaggerChangeHandler.ts
│   │
│   ├── effects/                   # 效果系统
│   │   ├── types.ts               #   Effect 接口（简单版）
│   │   ├── scenarioAdapter.ts     #   效果类型映射（8 个枚举）
│   │   └── afflictionEffectMap.ts #   附着效果映射
│   │
│   ├── state/                     # 状态管理
│   │   ├── GameState.ts
│   │   ├── TeamState.ts
│   │   ├── ActorState.ts
│   │   ├── EnemyState.ts
│   │   ├── EffectManager.ts
│   │   └── BaseGameState.ts
│   │
│   ├── mechanics/reactions.ts     # 反应机制（ReactionRegistry）
│   └── simulator.ts               # 顶层 simulate() 函数
│
├── stores/
│   └── timelineStore.js           # 唯一 Store
│
├── components/                    # 13 个组件
│   ├── TimelineGrid.vue
│   ├── ActionItem.vue
│   ├── ActionLibrary.vue
│   ├── PropertiesPanel.vue
│   ├── SimLogPanel.vue
│   └── ...
│
├── utils/
│   ├── coreStats.js               # 属性定义（含硬编码中文标签）
│   ├── precision.js
│   └── ...
│
└── i18n/
    ├── index.js                   # vue-i18n 入口
    └── locales/                   # 仅 UI 文本（zh-CN/en/ru）
```

### 数据模型

**没有 `src/data/` 目录。** 游戏数据（干员属性、技能等）以 JSON 测试固件（fixture）形式存在，或通过 API 加载。

场景数据结构：

```typescript
interface ScenarioData {
  tracks: ScenarioTrack[]; // 4 条轨道的原始数据
}

interface ScenarioTrack {
  id: string; // 干员 slug
  actions: Action[]; // 技能列表
  stats: ActorStats; // 属性（平面 key-value，非计算得出）
  initialGauge: number; // 初始充能
}

interface Action {
  type: ActionType;
  name: string; // 技能名（硬编码中文字符串）
  damageTicks: DamageTick[]; // 命中序列
  allowedTypes: string[]; // 允许触发的效果类型
  // ... 其他字段
}
```

**关键特点**：

- 干员属性是用户手动填入的原始值，没有计算管道
- 技能名直接以中文字符串存储（如 "重击"、"惊霆诀"）
- 不存在天赋/潜能/武器/装备的数据抽象
- 伤害计算是 `// TODO`，未实现

### 效果系统

旧版效果是扁平的标签系统：

```typescript
// scenarioAdapter.ts — 仅 8 种效果映射
SCNEARIO_EFFECT_TYPE_MAP = {
  armor_break: 'PHYSICAL_BREACH',
  stagger: 'PHYSICAL_CRUSH',
  knockdown: 'PHYSICAL_KNOCK_DOWN',
  knockup: 'PHYSICAL_LIFT',
  blaze_attach: 'ELEMENT_HEAT',
  emag_attach: 'ELEMENT_ELECTRIC',
  cold_attach: 'ELEMENT_CRYO',
  nature_attach: 'ELEMENT_NATURE',
};
```

没有 `StatusEffect` vs `InflictionEffect` vs `ReactionEffect` vs `TriggerEffect` 的类型细分。效果不携带数值缩放（ScalingDef），没有触发条件（EffectCondition），没有 `maxStacks`/`stackStrategy`/`icd`。

### 事件类型

仅 7 种事件：`ACTION_START`、`ACTION_END`、`DAMAGE_TICK`、`SP_CHANGE`、`ULTIMATE_CHARGE_CHANGE`、`EFFECT_START`、`EFFECT_END`、`SP_REGEN_PAUSE`、`STAGGER_CHANGE`

缺少：`ULT_ENERGY_CHANGE`、`REACTION_OCCURRED`、`EFFECT_APPLIED`、`ENEMY_STATE_CHANGE`、`OPERATOR_STATE_CHANGE`

### 属性（stats）

由 `coreStats.js` 定义，是一个包含 `label` 和 `labelKey` 的平面列表。`label` 是硬编码中文（如 "主能力"、"灼热伤害"），`labelKey` 是 i18n 键。但只有 `labelKey` 是 locale-aware 的，`label` 不是。

---

## 二、新版架构（9b92b0d7 之后）

### 新增目录

```
src/data/                         # ← 全新：数据层
├── operators/                    # 29 名干员 TypeScript 定义
├── weapons/                      # 71 把武器 × 5 类
├── gearpieces/                   # 218 件装备 × 23 套装
├── gearsets/                     # 23 个套装效果
├── enemies/                      # 13 个敌人
├── stats/                        # 伤害/属性/LMDI 计算
├── types.ts                      # 效果类型系统（1038 行）
├── index.ts                      # 统一数据访问
├── collect.ts                    # 效果收集器（1483 行）★
├── gameText.ts                   # 游戏文本查询（358 行）★
├── timeline.ts                   # 时间轴数据访问
├── effectPresets.ts              # 效果预设
├── filter.ts                     # 效果过滤器
└── system.json                   # 系统常量
```

### 核心变化

| 维度       | 旧版                            | 新版                                                                                                          |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 游戏数据   | 外部 JSON/API，无类型           | TypeScript 源文件，编译时类型检查                                                                             |
| 效果系统   | 8 种扁平映射                    | 15 种效果 kind + TriggerEffect + 条件系统 + ScalingDef                                                        |
| 伤害计算   | `// TODO`                       | 完整 15 乘区公式 + LMDI 贡献分解                                                                              |
| 事件类型   | 9 种                            | 12 种（新增 ULT_ENERGY_CHANGE、REACTION_OCCURRED、EFFECT_APPLIED）                                            |
| 事件处理器 | 9 个独立文件                    | 合并为 HitHandler(514行) + EnemyEffectHandler(1631行) + OperatorEffectHandler(175行) + effectDispatch(1457行) |
| 效果收集   | 无                              | collect.ts 从干员/武器/装备组装效果 → 这是 i18n 泄漏的根源                                                    |
| 本地化     | UI 层 vue-i18n + 少数硬编码中文 | 双层（UI + 游戏内容 game-locales）+ gameText.ts 查询层                                                        |
| 属性计算   | 手动填入原始值                  | computeStats.ts 完整管道（4 阶段：属性→缩放→累积→推导）                                                       |
| 装备系统   | 无                              | 218 件装备 + 23 套装 + 精锻                                                                                   |
| 测试       | 少量 snapshot 测试              | 大量单元测试（damageGolden、runtimeCoverage、runtimeSweep、effectLifecycle、reactions）                       |
| 组件       | 13 个                           | 30+ 个（新增 armory/ 面板、DamageAnalysisDialog、StatDetailDialog、TimelineBuffLayer 等）                     |
| Store      | 1 个                            | 4 个（timelineStore + operatorStore + weaponStore + gearStore）                                               |

### 数据流变化

```
旧版：
  用户填属性 → compileScenario(merge stats) → compileTimeline → simulate() → 日志
  (无伤害计算，无效果收集)

新版：
  干员/武器/装备 Sheet
      ↓
  collect.ts (收集效果 + ★注入本地化name)
      ↓
  compileScenario (computeStats + 属性计算)
      ↓
  compileTimeline
      ↓
  SimulationEngine.run()
      ↓
  战斗日志 + LMDI 伤害分析
```

---

## 三、质量对比

### 旧版优势

1. **简单**：无复杂的效果类型系统，新开发者容易理解
2. **无 i18n 泄漏**：本地化仅在 UI 层（虽有少量硬编码中文 label）
3. **低耦合**：模拟引擎不依赖任何游戏数据源

### 旧版劣势

1. **伤害计算未实现**：`DamageHandler` 是 `// TODO`
2. **无属性计算管道**：属性是用户手动填入的 magic number
3. **效果系统过于简陋**：无法表达游戏中的天赋、潜能、武器技、套装等复杂效果
4. **数据不可维护**：测试固件是手写的 JSON，无法与游戏版本同步

### 新版优势

1. **完整伤害模型**：15 乘区公式 + LMDI 分解
2. **类型安全**：TypeScript 数据定义，编译时检查
3. **效果系统强大**：能表达游戏中的全部战斗机制
4. **装备系统**：218 件装备 + 精锻，完整的配装模拟

### 新版劣势（分析中识别的问题）

1. **i18n 泄漏**：`collect.ts` 在效果收集阶段将本地化文本注入效果对象，污染计算管道
2. **复杂度跳跃**：从 9 个事件处理器跳到合并的巨石处理器（EnemyEffectHandler 1631 行、effectDispatch 1457 行）
3. **gameEnumTerms 翻译错误**：硬编码值与 JSON 翻译不一致（大剑 vs 双手剑 等 4 处）
4. **语言切换成本**：需要重新执行 collectEffects → compileScenario → run 整条管线
5. **测试耦合**：`collect.ts` 依赖 i18n，单元测试需要 mock vue-i18n
