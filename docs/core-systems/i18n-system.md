# 文本显示与国际化（i18n）系统

## 概述

Endaxis 的文本系统分为两层：

| 层             | 技术                           | 数据源                            | 用途                               |
| -------------- | ------------------------------ | --------------------------------- | ---------------------------------- |
| **UI 层**      | vue-i18n + Element Plus 语言包 | `src/i18n/locales/{locale}.json`  | 界面按钮、提示、菜单等             |
| **游戏内容层** | 自定义 `gameText.ts`           | `src/i18n/game-locales/{locale}/` | 干员名、武器名、装备名、天赋描述等 |

两层使用不同的语言解析逻辑：UI 层用 `vue-i18n` 的 `locale`（`zh-CN`/`en`/`ru`），游戏内容层简化为 `zh`/`en` 二值。

---

## UI 层 i18n

### 入口：`src/i18n/index.ts`

```typescript
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false, // Composition API 模式
  globalInjection: true, // 所有组件可访问 $t()
  locale: detectLocale(), // 语言检测
  fallbackLocale: 'zh-CN', // 回退语言
  messages: { en, ru, 'zh-CN': zhCN },
});
```

### 语言检测逻辑

```
1. localStorage.getItem('endaxis_locale')  → 上次保存的语言
2. navigator.languages                     → 浏览器偏好列表
3. navigator.language                      → 浏览器首选语言
4. 默认 'zh-CN'
```

### 语言规范化：`elementPlusLocale.ts`

```typescript
const SUPPORTED_LOCALES = ['zh-CN', 'en', 'ru']

function normalizeLocale(raw) {
  lower === 'zh' | 'zh-cn' | 'zh-hans'  → 'zh-CN'
  lower === 'en' | 'en-*'               → 'en'
  lower === 'ru' | 'ru-*'               → 'ru'
  其他                                   → 'zh-CN' (默认)
}
```

### 持久化

语言切换时写入 `localStorage.setItem('endaxis_locale', ...)` 并同步 `document.documentElement.lang`。

### 在组件中使用

```vue
<template>
  {{ $t('common.cancel') }}
  {{ $t('timeline.analysis.button') }}
</template>
```

### UI 翻译文件结构

```
src/i18n/locales/
├── zh-CN.json     # 简体中文（主开发语言）
├── en.json        # 英文
└── ru.json        # 俄文
```

翻译文件按功能域组织：

```json
{
  "common": { "cancel": "取消" },          // 通用词汇
  "battleLog": { "title": "战斗日志" },     // 战斗日志面板
  "timeline": { "analysis": {...} },        // 时间轴主界面
  "timelineGrid": { "track": {...} },       // 时间轴网格
  "actionLibrary": { "section": {...} },    // 技能库面板
  "armory": { "common": {...} },            // 军械库（属性/装备）
  "skillType": { "skill": "战技" },         // 技能类型名称
  "enemyTier": { "normal": "普通" },        // 敌人阶级
  "contextMenu": { "lockPosition": "锁定位置" },  // 右键菜单
  "connection": { "connect": "连线" },      // 连线系统
  "effects": { "group": {...} }            // 效果显示
}
```

### Element Plus 组件翻译

Element Plus 自带语言包，通过 `getElementPlusLocale()` 桥接：

```javascript
import en from 'element-plus/es/locale/lang/en';
import ru from 'element-plus/es/locale/lang/ru';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
```

---

## 游戏内容层 i18n

### 数据文件

```
src/i18n/game-locales/
├── zh/                        # 中文游戏内容
│   ├── operators.json         # 干员名、天赋名/描述、潜能名/描述、技能名
│   ├── weapons.json           # 武器名、武器技名/描述/前缀
│   ├── gearpieces.json        # 装备件名、槽位类型、套装名、属性名
│   ├── gearsets.json          # 套装名、被动/条件描述
│   └── enemies.json           # 敌人名
│
└── en/                        # 英文游戏内容（结构相同）
```

### 核心访问层：`src/data/gameText.ts`

提供约 30 个纯函数，统一所有游戏文本的查询入口：

#### 干员文本

| 函数                                                        | 返回                                |
| ----------------------------------------------------------- | ----------------------------------- |
| `getOperatorGameName(slug)`                                 | 干员名（如"汤汤"）                  |
| `getOperatorTalentName(slug, flatIndex, levelIndex)`        | 天赋名（如"肝胆相照"）              |
| `getOperatorTalentDescription(slug, flatIndex, levelIndex)` | 天赋描述                            |
| `getOperatorPotentialName(slug, index)`                     | 潜能名                              |
| `getOperatorPotentialDescription(slug, index)`              | 潜能描述                            |
| `getOperatorCombatSkillName(slug, skillKey)`                | 战斗技能名（重击/战技/连携/终结技） |
| `getOperatorSubSkillName(slug, subSkillKey)`                | 子技能名（如"强化战技"）            |

#### 武器文本

| 函数                                        | 返回                   |
| ------------------------------------------- | ---------------------- |
| `getWeaponGameName(slug)`                   | 武器名（如"狼之绯"）   |
| `getWeaponSkillName(slug, skillKey)`        | 武器技名               |
| `getWeaponSkillDescription(slug, skillKey)` | 武器技描述             |
| `getWeaponSkillPrefix(slug, skillKey)`      | 武器技前缀（如"切骨"） |

#### 装备/套装文本

| 函数                              | 返回                                     |
| --------------------------------- | ---------------------------------------- |
| `getGearPieceGameName(slug)`      | 装备件名                                 |
| `getGearSetGameName(slug)`        | 套装名                                   |
| `getGearSetPassiveText(slug)`     | 套装被动                                 |
| `getGearSetConditionalText(slug)` | 套装条件文本                             |
| `getGearSetZhName(slug)`          | 中文套装名（指定 zh，不依赖当前 locale） |

#### 枚举文本（硬编码对照表）

`gameText.ts` 内部维护一份 `gameEnumTerms` 对照表，绕过 JSON 文件直接提供翻译：

| 分类     | 函数                         | 示例 zh→en                   |
| -------- | ---------------------------- | ---------------------------- |
| 元素     | `getGameElementName(key)`    | `heat`→"灼热"/"Heat"         |
| 职业     | `getGameClassName(key)`      | `striker`→"突击"/"Striker"   |
| 武器类型 | `getGameWeaponTypeName(key)` | `sword`→"单手剑"/"Sword"     |
| 装备槽位 | `getGameSlotTypeName(key)`   | `armor`→"护甲"/"Armor"       |
| 品质     | `getGameQualityName(key)`    | `gold`→"金色"/"Gold"         |
| 属性     | `getGameAttributeName(key)`  | `strength`→"力量"/"Strength" |

#### 语言解析

游戏内容层使用**简化二值**模型：

```
locale.startsWith('zh') → 'zh'
其他                   → 'en'
```

意味着：俄语 UI 界面下，游戏内容显示为英文（因为俄文游戏内容翻译文件虽存在，但文本量远少于中英文）。

---

## 效果显示系统

### `utils/effectDisplay.ts`

效果在时间轴上以图标+标签形式展示。显示键的解析逻辑：

```
resolveEffectDisplayKey(effect):
  effect.displayType  → 直接使用
  effect.physicalType → 物理异常（vulnerability / lift / knockdown / crush / breach）
  effect.element      → 元素附着/爆发（heat_infliction / cryo_burst）
  effect.reactionType → 反应类型（combustion / electrification / solidification / corrosion）
  effect.id           → 状态效果的 id
  fallback            → 'default'
```

候选键列表通过 `getDisplayKeyCandidates()` 生成，UI 层按优先级查找对应的图标和标签文本。

---

## 数据流总结

```
                    ┌─────────────────────┐
                    │     用户切换语言      │
                    └────────┬────────────┘
                             │
                    setLocale(newLocale)
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     i18n.global.locale   localStorage    document.lang
              │
     ┌────────┴────────┐
     ▼                 ▼
  UI 层              游戏内容层
  $t('key')         getXxxGameName(slug)
  从 locales/       从 game-locales/{zh|en}/
  {locale}.json     或 gameEnumTerms
  读取               读取
```

## 翻译覆盖率

| 数据类别         | zh-CN             | en                 | ru                |
| ---------------- | ----------------- | ------------------ | ----------------- |
| UI 界面          | 完整（约 834 条） | 完整（约 832 条）  | 完整（约 715 条） |
| 干员名/技能/天赋 | 完整 (28 名)      | 完整               | 缺失              |
| 武器名/技能      | 完整 (72 把)      | 完整               | 缺失              |
| 装备件名         | 完整 (218 件)     | 完整               | 缺失              |
| 套装名/描述      | 完整 (23 套)      | 部分（仅 setName） | 缺失              |
| 敌人名           | 完整 (13 个)      | 部分（仅内部 ID）  | 缺失              |
| 枚举对照         | 完整 (hardcoded)  | 完整 (hardcoded)   | 缺失（回退到 en） |

游戏内容层以中文为最完整，英文次之，俄文缺失的游戏内容会回退到 `humanizeIdentifier()`（将 camelCase/snake_case 转为人读格式）。

---

## 关键设计决策

1. **两层分离**：UI 文本和游戏数据文本使用独立系统，因为更新频率不同
2. **枚举硬编码**：元素、职业、属性等高频小集合不放在 JSON 中，直接在 `gameText.ts` 硬编码
3. **回退链**：游戏内容 → 英文翻译 → `humanizeIdentifier(slug)`；UI → `zh-CN`（fallbackLocale）
4. **简化 zh/en 二值**：游戏内容翻译仅维护中英双语，俄语界面下游戏内容显示英文

## 维护风险：`gameEnumTerms` 与 JSON 翻译可能漂移

`gameText.ts` 中的 `gameEnumTerms` 目前已与 `game-locales/zh/weapons.json`、`game-locales/zh/gearpieces.json` 中的武器类型和装备槽位中文名对齐，例如：

| 标识                | 当前显示 |
| ------------------- | -------- |
| `greatsword`        | 双手剑   |
| `polearm`           | 长柄武器 |
| `handcannon`        | 手铳     |
| `kit` / `accessory` | 配件     |

但这里仍有维护风险：`getGameWeaponTypeName()` 和 `getGameSlotTypeName()` 使用 `gameEnumTerms` 硬编码值，而不是直接从同目录下的 `weapons.json` / `gearpieces.json` 的 `type` / `slotType` 字段读取。只要两边分别维护，就可能再次出现漂移。

**后续方向**：优先让枚举显示从单一数据源派生；如果继续保留 `gameEnumTerms`，应把枚举对齐纳入测试。

---

## 架构缺陷：本地化文本侵入核心计算层

当前架构中，本地化文本被解析后直接写入效果对象（Effect）的 `name` 字段，导致本地化数据渗透到模拟引擎和伤害计算的输入中。这违反了**本地化键与计算分离**的原则。

### 侵入点分析

#### 1. `data/collect.ts` — 效果收集层（最严重）

| 位置             | 代码/模式                                           | 问题                                                        |
| ---------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| 天赋收集         | `talentName = getOperatorTalentName(slug, ...)`     | 将本地化天赋名注入效果 `name`                               |
| 天赋效果 hydrate | `hydrateEffect(nested, 'operator', talentName)`     | 效果携带 "肝胆相照" 而非 `talent_0`                         |
| 潜能收集         | `potentialName = getOperatorPotentialName(slug, i)` | 将本地化潜能名注入效果 `name`                               |
| 套装收集         | `setDisplayName = getGearSetGameName(setSlug)`      | 将 "碾骨" 注入套装效果                                      |
| 装备防御效果     | `i18n.global.t('game.slotType.${...}')`             | **直接调用 vue-i18n**，将 "护甲 Defense" 写入装备防御效果名 |
| 装备防御效果     | `i18n.global.t('game.stat.defense', ...)`           | 同上，i18n 侵入 `data/` 目录                                |

这意味着：

- 切换语言后，`collectEffects()` 必须重新执行，因为效果对象中的 `name` 已经是当前语言的文本
- 模拟引擎输出的战斗日志中，效果名是已翻译的字符串而非键
- 导出/导入的时间轴数据如果包含效果名，会因语言不同而无法匹配

#### 2. `data/index.ts` — 数据查询层

| 位置             | 代码                           | 问题                                        |
| ---------------- | ------------------------------ | ------------------------------------------- |
| `getEnemyList()` | `name: getEnemyGameName(slug)` | `getEnemyList()` 返回的敌人名已是本地化文本 |

#### 3. `data/timeline.ts` — 时间轴数据

| 位置         | 代码                              | 问题                               |
| ------------ | --------------------------------- | ---------------------------------- |
| 角色列表生成 | `name: getOperatorGameName(slug)` | 角色列表返回的干员名已是本地化文本 |

#### 4. `stores/timelineStore.ts` 与 `stores/timeline/*` — 状态管理层

| 位置                       | 代码/现象                                                                 | 问题                                                                                  |
| -------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `timelineStore.ts`         | `getOperatorGameName` / `getGearSetGameName` / `getEnemyGameName` 等      | Store 内会直接解析游戏内容文本，导致状态层带有 UI 展示语义                            |
| `timeline/skillLibrary.ts` | `i18n.global.locale.value`、`getI18nSkillType`、`getOperatorSubSkillName` | 技能库是 UI 临时模型，短期可接受；但如果其结果被直接持久化，会把本地化文本写入 action |
| `timeline/persistence.ts`  | 默认方案名使用 `i18n.global.t(...)`                                       | 默认名称是可编辑 UI 文本，风险较低，但仍说明持久化边界知道 i18n                       |
| 多个 computed              | 通过读取 locale 强制重算                                                  | 语言切换会推动 store 派生数据更新，说明展示文本仍未完全收敛在渲染层                   |

### 数据流污染路径

```
EffectSheet (locale-agnostic: { id: "laevatain-melting-flame", name: "meltingFlame" })
    │
    ▼  collect.ts: hydrateEffect()  ← 注入 getOperatorTalentName() 的本地化结果
    │
CollectedEffect { name: "熔火" }    ← name 字段已被替换为中文本地化字符串
    │
    ▼  compileScenario() → SimulationEngine.run()
    │
战斗日志 { effectName: "熔火" }      ← 模拟引擎输出的日志中 name 已是已翻译文本
    │
    ▼  渲染层 $t(...)
    │
UI 显示 "熔火"                      ← 渲染层只能直接展示，无法再通过 i18n 键查表
```

### 影响

1. **语言切换成本高**：每次切换语言需要重新执行 `collectEffects()`，重新编译场景，重新运行模拟
2. **导出/共享不可靠**：导出数据中的效果名绑定到特定语言
3. **测试不稳定**：单元测试中需要 mock i18n 才能运行 `collect.ts` 的逻辑
4. **模拟引擎污染**：`SimulationEngine` 的输入（effect.name）是已本地化的字符串，引擎不应该是 locale-aware 的

### 正确模式

```
EffectSheet                    CollectedEffect              渲染层
{ id: "talent_0_1",            { id: "talent_0_1",          $t(getTalentName(
  nameKey: "talent_0"  }  →    nameKey: "talent_0"  }  →    opSlug, flatIndex, idx))
                                                              → "肝胆相照"
```

效果对象应始终存储**键**（slug/id），渲染时通过 gameText 函数查表转为显示文本。计算层不应感知当前语言。
