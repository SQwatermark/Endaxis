# 架构设计

## 整体架构

Endaxis 采用前端单页应用（SPA）架构，所有计算均在浏览器端完成。系统分为四个核心层：

```
┌─────────────────────────────────────────────────────┐
│                   视图层（Views）                      │
│  TimelineEntry → TimelineEditor → MobileTimelineViewer │
│  DataEditor                                         │
├─────────────────────────────────────────────────────┤
│                   状态管理层（Stores / Pinia）         │
│  timelineStore  operatorStore  weaponStore  gearStore │
├─────────────────────────────────────────────────────┤
│                   计算引擎层（Simulation）             │
│  编译器 → 时间轴解析 → 效果生命周期 → 事件引擎 → 伤害计算 │
├─────────────────────────────────────────────────────┤
│                   数据层（Data）                       │
│  干员 ×29  武器 ×81  装备件 ×146  套装 ×23  敌人 ×60  │
│  i18n 翻译层（zh-CN / en / ru）                      │
└─────────────────────────────────────────────────────┘
```

## 数据流

```
用户操作（拖拽技能到时间轴）
    │
    ▼
timelineStore 存储 ActionNode[]
    │
    ▼
compileTimeline() ──── 游戏时间 → 现实时间转换
    │                  连携/终结技 时停（Freeze）补偿
    │                  轨道内互斥中断检测
    ▼
ResolvedTimeline（已解析时间轴）
    │
    ▼
compileScenario() ──── 合并装备/武器/干员数据
    │                  计算属性值、增伤修饰
    ▼
SimulationEngine.run()
    │
    ├── 事件队列（PriorityQueue）逐事件处理
    ├── 10 种事件处理器（Hit / SP / Stagger / Effect / etc.）
    ├── GameState 维护实时状态快照
    │
    ▼
战斗日志 + 伤害分析（LMDI 分解 / ECharts 可视化）
```

## 目录结构

```
Endaxis/
├── src/
│   ├── main.js                 # 应用入口
│   ├── App.vue                 # 根组件
│   ├── router/index.js         # 路由（/timeline, /editor）
│   ├── types.ts                # 全局类型定义
│   │
│   ├── views/                  # 视图组件
│   │   ├── TimelineEntry.vue       # 排轴器入口
│   │   ├── TimelineEditor.vue      # 排轴编辑器主界面
│   │   ├── MobileTimelineViewer.vue # 移动端只读视图
│   │   └── DataEditor.vue          # 数据编辑器
│   │
│   ├── stores/                 # Pinia 状态管理
│   │   ├── timelineStore.js        # 时间轴核心状态
│   │   ├── operatorStore.ts        # 干员实例状态
│   │   ├── weaponStore.ts          # 武器实例状态
│   │   ├── gearStore.ts            # 装备实例状态
│   │   └── timeline/               # 时间轴子模块
│   │       ├── controlledOperator.ts   # 主控干员切换
│   │       ├── instanceLookup.ts       # 实例查询
│   │       └── resolveHits.js          # 命中解析
│   │
│   ├── simulation/             # 战斗模拟引擎
│   │   ├── compiler/               # 时间轴编译
│   │   ├── engine/                 # 模拟引擎核心
│   │   ├── events/                 # 事件处理器
│   │   ├── state/                  # 游戏状态机
│   │   ├── mechanics/              # 反应/机制计算
│   │   ├── projection/             # 数值投影（属性预估）
│   │   ├── calculation/            # 计算管道
│   │   ├── effects/                # 效果定义
│   │   └── adapters/               # 场景适配器
│   │
│   ├── data/                   # 游戏数据
│   │   ├── operators/              # 29 名干员
│   │   ├── weapons/                # 5 类武器 × 多个稀有度
│   │   ├── gearpieces/             # 146 件装备件
│   │   ├── gearsets/               # 23 个套装
│   │   ├── enemies/                # 60 个敌人
│   │   ├── stats/                  # 属性计算
│   │   └── index.ts                # 统一数据访问
│   │
│   ├── utils/                  # 工具函数
│   ├── styles/                 # CSS 样式
│   └── i18n/                   # 国际化
│       ├── locales/                # UI 翻译（zh-CN, en, ru）
│       └── game-locales/           # 游戏内容翻译（zh, en）
│
├── public/                    # 静态资源
│   ├── Icon_Enemy/            # 敌人图标
│   ├── equipment/             # 装备图标
│   └── contingency_contract/  # 危机合约图标
│
└── scripts/                   # 构建脚本
```

## 关键技术决策

### 游戏时间 vs 现实时间

游戏中的连携技和终结技会产生"时停"效果——游戏时间暂停但现实时间继续。Endaxis 通过 `TimeContext` 类管理游戏时间与现实时间的双向映射，在时间轴编译阶段将游戏时间转换为现实时间。

### 数据驱动 vs 配置驱动

游戏数据以 TypeScript 源文件形式存在而非 JSON，利用类型系统保证数据完整性和编译时检查。Vite 的 `import.meta.glob` 在构建时静态分析并打包所有数据文件。

### 离散事件模拟

模拟引擎采用离散事件队列（PriorityQueue）而非固定时间步长循环，仅在事件发生时刻推进时间，减少计算量。事件处理器按类型注册（如 HitHandler、SpChangeHandler），通过依赖注入方式获取模拟上下文。
