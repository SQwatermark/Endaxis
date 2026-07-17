# 开发指南

## 环境要求

- Node.js `^20.19.0 || >=22.12.0`
- npm

## 本地开发

```bash
cd Endaxis
npm install
npm run dev          # 启动开发服务器 → http://localhost:5173
npm run build        # 生产构建
npm run preview      # 预览生产构建
npm run test         # 运行测试
npm run type-check   # TypeScript 类型检查
npm run format       # Prettier 格式化
npm run format:check # 检查格式
npm run convert:images  # PNG → WebP 转换
```

## 如何添加新数据

### 添加新干员

1. 创建 `src/data/operators/<slug>.ts`
2. 遵循 `OperatorSheet` 接口定义，参考现有文件（如 `laevatain.ts` 或 `rossi.ts`）
3. 在 `src/data/index.ts` 中 import 并注册
4. 在 `src/i18n/game-locales/zh/operators.json` 和 `en/operators.json` 中添加翻译

```typescript
// 示例结构
export default {
  gameId: 'char_001',
  rarity: 6,
  class: 'guard',
  element: 'physical',
  mainAttribute: 'agility',
  subAttribute: 'strength',
  attributes: {/* ... */},
  talents: [/* 天赋效果 */],
  potentials: [/* 潜能效果 */],
  combatSkills: {
    basicAttack: {/* 普攻序列，最后一段可作为重击 */},
    battleSkill: {/* 战技 */},
    comboSkill: {/* 连携技 */},
    ultimate: {/* 终结技 */},
  },
  finisherElement: 'physical',
  diveElement: 'physical',
} satisfies OperatorSheet;
```

`dive` 和 `finisher` 不写入原始 `combatSkills`，而是通过 `finisherElement` / `diveElement` 在技能库展开阶段合成。

### 添加新武器

1. 创建 `src/data/weapons/<type>/<rarity>/<slug>.ts`
2. 注册在 `weaponModules` 的 glob 已自动覆盖，无需手动 import
3. 添加翻译

### 添加新装备件

1. 创建 `src/data/gearpieces/<set>/<slug>.ts`
2. glob 自动覆盖
3. 添加翻译

### 添加新套装

1. 创建 `src/data/gearsets/<slug>.ts`
2. 在 `src/data/index.ts` 中手动 import 并注册到 `gearSetSheets`
3. 添加翻译

### 添加新敌人

1. 创建 `src/data/enemies/<slug>.ts`
2. glob 自动覆盖
3. 在 `src/i18n/game-locales/zh/enemies.json` 中添加名称

## 项目工具函数

| 文件                              | 用途                      |
| --------------------------------- | ------------------------- |
| `utils/assert.ts`                 | 断言工具                  |
| `utils/echartsSetup.ts`           | ECharts 初始化            |
| `utils/effectDisplay.ts`          | 效果显示名称解析          |
| `utils/effectDisplayOptions.ts`   | 效果显示选项              |
| `utils/equipmentEffectDisplay.ts` | 装备效果显示              |
| `utils/gzipUtils.ts`              | gzip 压缩（数据码导出）   |
| `utils/hitModel.ts`               | Hit 数据模型构建          |
| `utils/layoutUtils.ts`            | 布局辅助                  |
| `utils/operatorBounds.ts`         | 干员轨道边界检测          |
| `utils/pngUtils.ts`               | PNG 隐写（图片导出/导入） |
| `utils/precision.ts`              | 浮点精度控制              |
| `utils/theme.ts`                  | 主题管理                  |
| `utils/time.ts`                   | 时间格式化、帧对齐        |
| `utils/timeSerialization.ts`      | 时间序列化（导出/导入）   |
| `utils/uid.ts`                    | 生成唯一 ID               |
| `utils/weaponBounds.ts`           | 武器适用边界              |

## 编译管道

### 场景编译（compileScenario）

在模拟运行之前，需要将用户配置的场景编译为模拟引擎可执行的格式：

```
compileEndaxisScenario(...)
    │
    ├── 补齐 Endaxis UI 状态
    │   敌人防御/抗性、主控干员段、初始效果、终结技能量上限等
    │
    ▼
compileScenario(...)
    │
    ├── 编译每轨 Actor（compileOperator）
    │   计算最终属性值
    │   解析武器/装备/套装效果
    │   构建 TriggerEffect 触发链
    │
    ├── 编译敌人配置
    │
    ├── 编译时间轴（compileTimeline）
    │
    └── 输出 CompiledScenario → SimulationEngine
```

### 数值投影（Projection）

当前版本中，编辑时预览也会走完整模拟链。模拟完成后，`projectOptimizerResult()` 会把日志和状态投影为 UI 可直接渲染的数据：

```
projectSpSeries()          # SP 技力变化投影
projectStaggerSeries()     # 失衡变化投影
projectUltimateSeries()    # 终结技能量变化投影
projectOperatorEffects()   # 干员效果投影
projectEnemyEffects()      # 敌人效果投影
projectActionBuffs()       # 动作增益投影
projectAllComboWindows()   # 连携窗口投影
projectRequisiteWarnings() # 技能前置条件警告
```

这些投影用于时间轴效果条、底部曲线、技能警告、战斗日志和伤害分析。

## 国际化（i18n）

```typescript
// 使用 vue-i18n
$t('common.cancel'); // 通用文本
$t('timeline.analysis.button'); // 时间轴相关
$t('skillType.skill'); // 技能类型名
```

- UI 翻译：`src/i18n/locales/{zh-CN,en,ru}.json`
- 游戏内容翻译：`src/i18n/game-locales/{zh,en}/`
- 语言持久化：localStorage key `endaxis_locale`
- Element Plus 组件翻译：`src/i18n/elementPlusLocale.ts`

## 测试

```bash
npm run test          # 运行 vitest
```

现有测试文件：

- `simulator.test.ts` — 模拟器端到端测试
- `TeamState.test.ts` — 队伍状态测试
- `EffectManager.test.ts` — 效果管理器测试
- `compileTimeline.test.ts` — 时间轴编译测试
- `compileScenario.test.ts` — 场景编译测试
- `controlledOperator.test.ts` — 主控干员测试
- `damageGolden.test.ts` — 伤害计算黄金数据测试
- `reactions.test.ts` — 反应机制测试
- `timeline.test.ts` — 时间轴数据访问测试
- `runtimeCoverage.test.ts` — 运行时覆盖测试
- `runtimeSweep.test.ts` — 运行时扫描测试
