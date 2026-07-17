# 前端界面

## 视图结构

Endaxis 当前只有一个正式页面路由：

| 路由        | 组件                 | 用途             |
| ----------- | -------------------- | ---------------- |
| `/`         | 重定向到 `/timeline` | —                |
| `/timeline` | TimelineEntry.vue    | 排轴器主界面入口 |

### TimelineEntry.vue（排轴器入口）

负责：

- 方案（Scenario）管理：新建/复制/重命名/删除
- 导入导出：JSON 文件、数据码（Base64+Gzip）、PNG 图片隐写
- 语言切换
- 移动端适配判断 → 切换 MobileTimelineViewer

### TimelineEditor.vue（排轴器主界面）

最复杂的视图组件，包含：

```
┌──────────────────────────────────────────────┐
│ 工具栏（Toolbar）                             │
│ [框选] [连线] [辅助线] [吸附精度] [分析] [导出] │
├──────────────────────────┬───────────────────┤
│                          │  动作库（左侧面板）   │
│  时间轴网格（主区域）      │  - 干员属性面板      │
│  - 标尺（游戏/现实时间）   │  - 技能库（可拖拽）  │
│  - 4 条干员轨道          │  - 武器面板          │
│  - 动作块（可拖拽）       │  - 装备面板          │
│  - SVG 连携曲线          │  - 精锻面板          │
│  - 效果覆盖层            │                     │
├──────────────────────────┴───────────────────┤
│  战斗日志面板（底部）                           │
└──────────────────────────────────────────────┘
```

#### 时间轴网格

- CSS Grid 实现，水平轴为时间，垂直轴为 4 条轨道
- 1 格 = 0.1s（可切换为 1 帧 1/60s）
- 支持框选多个动作块
- 吸附精度可切换：0.1s / 1 帧
- 辅佐线（Cursor Guide）对齐

#### 连携可视化

- SVG `<path>` 绘制贝塞尔曲线
- 8 个出/入点（四角 + 四边 + 中心）
- 支持拖拽连线创建连携关系
- 效果消耗连线（蓝色虚线）vs 动作连线（实线）

#### 技能块

- `Vue.Draggable` 实现从技能库拖入轨道
- 轨道内可水平拖拽调整时间
- 右键菜单：锁定、禁用计算、换色、连线设置、添加循环分界线
- 颜色分类：重击/战技/连携/终结技/武器/套装

## 状态管理（Pinia Stores）

### timelineStore（核心 Store 入口）

`src/stores/timelineStore.ts` 是 Pinia 对外入口，管理时间轴核心状态，并组合 `src/stores/timeline/` 下的子模块：

```
timelineStore
├── scenarioList: ScenarioListEntry[] # 方案列表
├── activeScenarioId: string          # 当前方案 ID
├── tracks: Track[]                   # 4 条干员轨道和动作块
├── connections: Connection[]   # 连线关系
├── switchEvents[]              # 主控干员切换事件原始点
├── controlledOperatorSegments  # 主控干员时间段派生结果
├── timeline/persistence.ts     # 自动保存、导入导出、分享码
├── timeline/skillLibrary.ts    # 当前干员技能库
├── timeline/simulation.ts      # compile → simulate → project
├── timeline/layouts.ts         # 节点矩形、效果布局、坐标转换
├── timeline/shifts.ts          # 时停、偏移、终结技强化
└── timeline/normalizers.ts     # 导入数据规范化和默认轨道
```

时间轴上的多数展示数据不是组件局部计算出来的，而是由 `timeline/simulation.ts` 暴露的 computed 投影结果驱动，例如 `spSeries`、`staggerSeries`、`comboWindowLayouts`、`operatorEffectLayouts` 和 `requisiteWarnings`。

### operatorStore

管理干员实例（等级、潜能、技能等级、天赋状态等）。

### weaponStore

管理武器实例（等级、精调、技能等级）。

### gearStore

管理装备实例（精锻等级）。

## 移动端适配

`MobileTimelineViewer.vue` 提供只读的排轴查看界面：

- 简化的时间线条目展示
- 干员配装查看（武器 + 4 件装备）
- 技能信息弹窗
- 支持导入分享码
