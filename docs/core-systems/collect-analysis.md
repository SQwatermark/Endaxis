# collect.ts 深度解析

> 校准状态：已按当前 `main` 的 `src/data/collect.ts` 重新核对关键结论。文中的旧行号仅保留作历史阅读线索，不再作为精确定位依据；维护时请优先按函数名和代码片段定位。

## 整体定位

`collect.ts` 是连接**静态数据层**（干员/武器/装备 Sheet）与**模拟引擎**的桥梁。它的职责是：根据用户配置的队伍（哪 4 个干员、各自用什么武器、穿什么装备），从数据层提取所有相关的被动效果（常驻属性、触发效果），组装成 `CollectedEffect[]`，供 `compileScenario` 消费。

## 整体流程

```
collectEffects(team, operatorInstances, weaponInstances, gearInstances)
    │
    ├── for each of 4 team slots:
    │   │
    │   ├── 1. 预扫描 AppendEffect patches（天赋+潜能中 patch kind='appendEffect'）
    │   │      建立 map: targetEffectId → [{effect, idx}, ...]
    │   │
    │   ├── 2. 收集天赋效果（talents）
    │   │      hydrateEffect(nested, 'operator', getOperatorTalentName())  ← 本地化 name
    │   │      resolveEffect → 解析 leveled 值
    │   │      pushAppends → 注入 patch 的 appendEffect
    │   │
    │   ├── 3. 收集潜能效果（potentials）
    │   │      hydrateEffect(nested, 'operator', getOperatorPotentialName())  ← 本地化 name
    │   │
    │   ├── 4. 收集战斗技能被动效果（combatSkills）
    │   │      flatSkills → 展开子技能 + 合成处决/下落攻击
    │   │      hydrateEffect(nested, 'operator', '')  ← defaultName 为空！
    │   │
    │   ├── 5. 收集武器效果（addWeaponSheetEffects）
    │   │      展开 3 个 skill 槽
    │   │      { ...raw, sourceGroup: 'weapon', icon: raw.icon ?? sheet.icon }
    │   │      注意：没有调用 hydrateEffect！武器效果保持原有的 name
    │   │
    │   ├── 6. 收集套装效果（gear set）
    │   │      hydrateEffect(nested, 'gearSet', getGearSetGameName())  ← 本地化 name
    │   │
    │   └── 7. 收集装备隐式效果（gear implicit: defense + substats）
    │          defense: i18n.global.t() 直接构造 name  ← 最严重泄漏
    │          substats: { ...raw, sourceGroup: 'gearSet' }  ← 未调用 hydrateEffect
    │
    └── resolvePatches → resolveEffectDefaults → 返回 CollectedEffect[]
```

---

## 不一致点与机制点逐项分析

### 不一致 1：`hydrateEffect` 的 `defaultName` 语义分裂

`hydrateEffect` 的签名是 `(effect, sourceGroup, defaultName)`，其中 `defaultName` 在 5 个调用点传了**三种不同语义的值**：

| 调用位置          | defaultName 值                      | 语义           | 是否本地化 |
| ----------------- | ----------------------------------- | -------------- | ---------- |
| L195 天赋         | `getOperatorTalentName(slug, ...)`  | 已翻译的天赋名 | **是**     |
| L218 潜能         | `getOperatorPotentialName(slug, i)` | 已翻译的潜能名 | **是**     |
| L237 战斗技能     | `''`                                | 空字符串       | N/A        |
| L271 套装         | `getGearSetGameName(setSlug)`       | 已翻译的套装名 | **是**     |
| L172 appendEffect | `''`                                | 空字符串       | N/A        |

问题：

- 天赋/潜能/套装传入了**已本地化的显示文本**，而战斗技能传入空字符串
- `effect.name ?? defaultName` 的行为因此不可预测：如果 effect 自身有 `name`（如 `'razorClawmark'`），它保留原始的英文 key，不触发本地化覆盖；如果 effect 没有 `name`（如套装效果），就吃进一个已翻译的中文文本
- 这导致**同一批 CollectedEffect 中，有的 effect.name 是 i18n 键，有的已经是显示文本**

### 不一致 2：武器效果完全跳过 `hydrateEffect`

```typescript
// L403-407 武器效果
resolveEffect(
  ensureEffectId(
    { ...raw, sourceGroup: 'weapon', icon: raw.icon ?? sheet.icon },  // ← 直接展开
    makeEffectId(...)
  ),
  lvlIdx,
)
```

武器效果使用 `{ ...raw, sourceGroup, icon }` 直接展开，不调用 `hydrateEffect`。这意味着：

- 武器的 `effect.name` 保持原始值（sheet 定义的值，如 `'wolvenBlood'`）
- 武器的 `sourceGroup` 通过手动 `{ ...raw, sourceGroup: 'weapon' }` 注入
- 而其他所有效果源都通过 `hydrateEffect` 统一注入 `sourceGroup` + `name`

### 不一致 3：装备隐式效果分裂为两条路径

**防御效果（L290-311）**— 最严重的泄漏：

```typescript
const translatedSlot = i18n.global.t(`game.slotType.${gearSlotKey}`, gearSlotKey);
const translatedDef = i18n.global.t('game.stat.defense', 'Defense');
const defEffect = resolveEffect({
  kind: 'status',
  id: `implicit:gear:${gearSlotKey}:defense`,
  name: `${translatedSlot} ${translatedDef}`,  // "护甲 Defense" 直接写入
  ...
}, 0);
```

- 硬编码 `kind: 'status'`，但实际语义是 `flatDef`
- `name` 直接用 `i18n.global.t()` 拼接，**连 hydrateEffect 都没走**
- `sourceGroup` 设置为 `'gearSet'`，但实际来源是单个装备件

**装备词条效果（L313-338）**— 又是另一条路径：

```typescript
ensureEffectId(
  { ...raw, sourceGroup: 'gearSet' },  // ← 手动注入 sourceGroup
  makeEffectId(...)
)
```

- 不调用 `hydrateEffect`
- `sourceGroup` 手动设为 `'gearSet'`，但词条效果来自单个装备件，语义不准确

### 机制点 4：套装门槛为 3 件

```typescript
if (count < 3) continue; // L264
```

套装效果就是同一套装装备数达到 3 件及以上触发。当前 `collect.ts` 的门槛判断与游戏机制一致，不属于需要修复的不一致点。

### 不一致 5：`sourceGroup` 的语义混乱

`sourceGroup` 应该是效果的来源分类（operator / weapon / gearSet），但赋值不一致：

| 效果来源            | sourceGroup              | 实际来源                     |
| ------------------- | ------------------------ | ---------------------------- |
| 天赋                | `'operator'`             | ✓                            |
| 潜能                | `'operator'`             | ✓                            |
| 战斗技能            | `'operator'`             | ✓                            |
| 武器效果            | `'weapon'`               | ✓                            |
| 套装效果            | `'gearSet'`              | ✓                            |
| 装备防御            | `'gearSet'`              | ✗ 实际是单个装备件，不是套装 |
| 装备词条            | `'gearSet'`              | ✗ 同上                       |
| appendEffect 到天赋 | 继承调用者的 sourceGroup | 合理                         |

### 不一致 6：修补（Patch）系统与效果收集的耦合

`collectPatches` 数组在效果收集过程中累积（L190, L214），最后在 L342 通过 `resolvePatches()` 统一应用。但 patches 的收集和效果的收集交错进行，逻辑分散，且 `appendPassiveByTarget` 的预扫描（L138-160）需要提前遍历一次天赋和潜能——这与后面真正的收集逻辑（L180-224）形成了**双遍历**。

### 不一致 7：`resolveEffect` 在调用链中的位置不一致

| 位置              | 调用方式                                                        |
| ----------------- | --------------------------------------------------------------- |
| L193-198 天赋     | `resolveEffect(ensureEffectId(hydrateEffect(...)), idx)`        |
| L217-219 潜能     | `ensureEffectId(hydrateEffect(...))` ← **没有 resolveEffect！** |
| L235-239 战斗技能 | `resolveEffect(ensureEffectId(hydrateEffect(...)), lvlIdx)`     |
| L403-409 武器     | `resolveEffect(ensureEffectId({...}), lvlIdx)`                  |
| L293-303 装备防御 | `resolveEffect({...}, 0)`                                       |
| L321-326 装备词条 | `resolveEffect(ensureEffectId({...}), artificingLevel)`         |

潜能在 L217-219 没有调用 `resolveEffect`，这意味着潜能中的 `Leveled<T>` 值不会被解析为标量。这是一个潜在的 bug——如果潜能效果中有 `value: [10, 20, 30]` 这样的数组，它会保持数组形态进入后续管道。

---

## 数据流总结图

```
                       OperatorSheet.effects (name: "razorClawmark")
                       GearSetSheet.effects   (name: undefined)
                       WeaponSheet.effects    (name: "wolvenBlood")
                       GearPiece.effects      (name: undefined)
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         hydrateEffect    { ...raw }      i18n.global.t()
         name = 原文       name = 原文     name = "护甲 Defense"
       ?? getXxxName()       (保留)          (硬拼接)
              │               │               │
              ▼               ▼               ▼
         有 name 的保留原文   保留原文        已经是本地化文本
         无 name 的吃进翻译
              │
              ▼
         CollectedEffect[]
              │
              ▼
         compileScenario → computeStats → SimulationEngine
```

**结论**：`collect.ts` 中效果 `name` 的处理存在 3 条互不兼容的路径：

1. 通过 `hydrateEffect` + gameText 函数 → name 可能是原文也可能是翻译
2. 直接展开 `{ ...raw }` → name 保持 sheet 定义值
3. 硬编码 `i18n.global.t()` 拼接 → name 一定是翻译文本

这三条路径产出的 name 语义不统一，是后续渲染层 `getEffectName()` 行为不一致的根源。

### 不一致 8：`makeEffectId` 调用不统一，装备防御绕过

`makeEffectId(sourceSlug, section, effectIndex)` 就是 `parts.join('-')`，三个入参的含义：

| 参数          | 含义               | 示例                                       |
| ------------- | ------------------ | ------------------------------------------ |
| `sourceSlug`  | 效果来源的数据标识 | `"laevatain"`、`"bonekrusha"`              |
| `section`     | 效果所属的数据分区 | `"talent0"`、`"skill1"`、`"gear-implicit"` |
| `effectIndex` | 分区内序号         | `"effect0"`                                |

典型输出：`laevatain-talent0-effect0`、`lupine-scarlet-skill1-effect0`、`bonekrusha-effect0`

但装备防御效果（L290-311）**完全不经过 `makeEffectId`**：

```
makeEffectId 风格:  laevatain-talent0-effect0     (用 - 分隔，含 sourceSlug 前缀)
装备防御风格:        implicit:gear:armor:defense  (用 : 分隔，无 sourceSlug，语义不同)
```

两种 id 格式不兼容，如果后续有代码尝试解析 id 的段来溯源效果，会在装备防御效果上失败。

### 不一致 9：effect id 有三个来源，其中 uid() 是非确定性的

effect 的 `id` 实际上由三级兜底机制决定，不是只有 `makeEffectId`：

```typescript
// 原始数据
effect.id; // ← 第一级：sheet 定义的语义 id（如 "laevatain-melting-flame"）

// collect.ts L1062-1064: ensureEffectId — 第二级兜底
if (!effect.id) {
  id = makeEffectId(sourceSlug, section, effectIndex); // ← 确定性：laevatain-talent0-effect0
}

// collect.ts L463-467: resolveEffect — 第三级兜底
id: effect.id ?? uid(); // ← 非确定性：Math.random().toString(36)
```

正常流程下，`ensureEffectId` 已经保证 id 存在，所以 L467 的 `uid()` 不会触发。但 **嵌套 hit effects**（L496）不经过 `ensureEffectId`：

```typescript
// L496: damageHit 内部的嵌套效果，直接用 uid()
effects: h.effects.map(e => resolveEffect(e.id ? e : { ...e, id: uid() }, idx));
```

这导致 `CollectedEffect[]` 中同时存在三种格式的 id：

| 格式       | 示例                        | 确定性          | 来源                                                          |
| ---------- | --------------------------- | --------------- | ------------------------------------------------------------- |
| 语义命名   | `laevatain-melting-flame`   | ✓               | sheet 定义                                                    |
| 结构化     | `laevatain-talent0-effect0` | ✓               | `makeEffectId` / `ensureEffectId` / `stampTriggerEffect` 兜底 |
| 随机字符串 | `k3x8m2p`                   | ✗，应视为风险源 | `resolveEffect()` 的最后兜底                                  |

**当前状态**：

- `patchHit` 注入的 `hit.effects` 已通过 `ensurePatchEffectIds` 补确定性 id，`collectEffects` 和 `patchCombatSkills` 两条 patchHit 路径都覆盖到了。
- 触发器内的 `damageHit.hit.effects` 会经过 `stampTriggerEffect`，也会补确定性 id。
- `uid()` 兜底仍存在，且少数路径仍可能触发，例如 `appendEffect` 预扫描后直接 `resolveEffect(e, idx)`，以及 `patchCombatSkills` 中 appendEffect 把 raw effect 追加到 hit/trigger hit 后未统一补 id。如果这类 append effect 自身没有 id，仍可能生成随机 id。

因此，“patchHit 缺 id”已经修复，但“所有进入 `resolveEffect` 的 effect 都有确定性 id”还没有完全成立。

---

## 优化建议

### 1. `Effect` 类型身兼两职

`Effect` 类型同时承载两种语义：

| 功能                 | 实际数据                          | 所在位置                                  |
| -------------------- | --------------------------------- | ----------------------------------------- |
| 原始声明式效果       | 含 `Leveled<T>` 数组值            | operator sheet、weapon sheet 等定义文件   |
| 已解析但未改名的效果 | 已是标量，但类型标签仍是 `Effect` | `patchCombatSkills` 产出、`hit.effects[]` |

`dispatchEnemyEffects(effects: Effect | ResolvedEffect[])` 这个联合类型的存在本身就是在为这个混淆打补丁——"我接受两种东西，因为我不知道上游给我解析了没有"。

**建议**：引入中间类型 `CompiledEffect`，形成清晰的三层：

```
Effect           → 仅用于 sheet 定义，含 Leveled<T>
CompiledEffect   → patchCombatSkills 产出，标量但未经 collect 管道
ResolvedEffect   → collectEffects 产出，标量 + id + sourceGroup 等已完整标注
```

### 2. `collect.ts` 内部 8 个不一致点 + 1 个机制确认

详见上文各节。其中“套装门槛为 3 件”是已确认的游戏机制，不属于待修复问题。**已修复**：

- id 确定性（`ensurePatchEffectIds`）
- comboWindow 不再污染 `effect.name`（使用 locale-agnostic key `'comboWindow'`）
- `operatorStatuses` 参数替代重复的冷却缩减自算逻辑

**仍待修复**：

- `hydrateEffect` 调用统一化（所有效果源走同一入口）
- `effect.name` 语义统一（gear set / talent passive 仍存 locale-agnostic key，渲染时查表）
- 装备防御效果走 `makeEffectId` 而非硬编码 `implicit:gear:...` 格式

### 3. `gameEnumTerms` 翻译应与 JSON 对齐

当前 `gameText.ts` 硬编码翻译与 `game-locales/zh/weapons.json` 的 `type` 字段不一致（已修复 `gameText.ts` 侧），但根本修复应是让 `getGameWeaponTypeName()` 直接从 JSON 读取而非维护硬编码副本。

### 4. `sourceGroup` 语义修正

装备防御和装备词条效果目前标记为 `sourceGroup: 'gearSet'`，但实际来源是单个装备件，应修正为 `'gearPiece'` 或新增枚举值。

### 5. 装备防御 `name` 硬编码 i18n 拼接

`collect.ts` L291-292 处 `i18n.global.t()` 直接拼接效果名，应改为存储 `nameKey` 后在渲染层解析。

### 6. 统一 `patchHit` 与 `collectTriggerEffects`（备选方案）

当前 `patchHit` 和 trigger 效果分走两条管道，根源不是设计哲学差异，而是 trigger 系统缺少**命中级筛选**能力：

```
patchHit: 精确到 hit.id（"连携技的第 1 段命中"）
trigger:  只能到 skillId（"连携技"）或 skillTypes（"连携技能"）
```

如果给 `TriggerEvent.onHit` 增加 `hitId` 筛选字段：

```typescript
type TriggerEvent =
  | { kind: 'onHit'; hitId?: string; skillId?: string; ... }
```

则所有 `patchHit` 都可以改写为 trigger，完全统一到 `collectTriggerEffects` → `TriggerRegistry` 一条管道。`patchCombatSkills` 可安全删除，消除两条管道带来的所有不一致（id 三级来源、`uid()` 非确定性、annotatePatchEffects 补丁等）。同时，`combatSkills.xxx.effects` 字段（当前数据中未使用）也应移除——技能被动效果在游戏设计中不存在。
