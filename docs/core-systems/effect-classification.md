# Effect 四分类

所有 effect 按来源和运行时行为分为四类：

## 1. 段命中固定效果

**来源**：技能原始定义 `combatSkills.xxx.segments[].hits[].effects[]`

**管道**：`patchCombatSkills`（JSON 深拷贝固化值）→ `compileTimeline` → `ResolvedHit.effects[]` → `HitHandler` 同步派发

**运行时**：命中时立即执行。伤害计算之后、日志记录之前。不经过事件总线。

**示例**：洛茜连携技第 2 段命中自带的 `physicalStatus: lift`（击飞）

**数据特征**：值已是标量（深拷贝固化），类型标签仍是 `Effect`。无 `id` 问题（原始定义自带 id 或 `stampTriggerEffect` 打 id）。不产生 `CollectedEffect`。

---

## 2. 有条件触发效果

**来源**：技能/武器/天赋/潜能/套装的 `triggers[]`

**管道**：`collectTriggerEffects` → `stampTriggerEffect` → `resolveTriggerEffectLevel` → `TriggerRegistry` 注册 → 模拟运行时事件驱动派发

**运行时**：满足条件时触发。走事件总线（`onHit`、`onActionStart`、`onStatusApplied` 等）。

**示例**：狼之绯的"暴击命中时叠加狼血层数"、莱万汀的"消耗灼热附着时获取熔火层数"

**数据特征**：`ResolvedEffect`。id 由 `stampTriggerEffect` → `makeEffectId` 确定性生成。

---

## 3. 全局属性加成

**来源**：天赋/潜能/武器/装备/套装的常驻被动 `effects[]`

**管道**：`collectEffects` → `resolveEffect` → `CollectedEffect[]` → `computeStats` 汇入属性加法池

**运行时**：不出现在时间轴上。变成面板数字（攻击力 +2347、暴击率 +29.5%）。

**示例**：狼之绯常驻 +16% 攻击力、碾骨套装常驻 +15% 攻击力、装备词条敏捷 +65

**数据特征**：`ResolvedEffect`。id 由 `ensureEffectId` → `makeEffectId` 确定性生成。只影响属性计算，不产生 simulation 事件，不在时间轴上显示 segment。

装备隐式防御效果也属此类——`collect.ts` 凭空生成 `flatDef +42` 的 status effect，与武器/天赋被动一起汇入 `computeStats`。模拟启动前通过 `buildInitialRuntimeEffectsFromCollected` 注入 `ActorState` 初始效果池（`hide: true`），仅用于内部计算，不可见。

---

## 4. 命中注入效果（patchHit）

**来源**：天赋/潜能的 `patches[].kind: 'patchHit'`

**管道**：`patchCombatSkills` Pass 1/1b → `resolveEffect(e, idx)` → 注入 `hit.effects[]` → 之后与第 1 类完全相同的路径

**运行时**：与段命中固定效果完全一致——命中时同步派发，不经过事件总线。

**示例**：洛茜天赋 `razorClawmark`（DOT 注入连携技命中）、赛希天赋寒冷增伤效果

**数据特征**：值已是标量，类型标签仍是 `Effect`。**id 问题**：此路径的 `resolveEffect(e, idx)` 中 `e.id` 可能为 undefined → 落到 `uid()` 随机 id。已通过 `ensurePatchEffectIds` 修复。

---

## 运行时统一

四类效果在模拟引擎中最终收束为两种事件：

```
第 1/4 类（段命中/patchHit）
        │  HitHandler
        ├── dispatchEnemyEffects(hit.effects)
        └── dispatchActorEffects(hit.effects)
                  │
                  ▼ ENEMY_EFFECT_APPLY / OPERATOR_EFFECT_APPLY

第 2 类（触发效果）
        │  TriggerRegistry.onHit/onActionStart/onStatusApplied/...
        └── dispatchSingleActorEffect
                  │
                  ▼ ENEMY_EFFECT_APPLY / OPERATOR_EFFECT_APPLY

第 3 类（属性加成）
        │  computeStats
        └── OperatorStatus { attack, critRate, dmgBonus, ... }
        （不产生日志事件，除非注入为初始效果）
```

所有可见的 segment 从 `EFFECT_APPLY` 日志事件重建。第 3 类不产生 segment，只影响面板数字。
