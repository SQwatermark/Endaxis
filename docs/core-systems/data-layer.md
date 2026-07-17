# 数据层

## 概述

数据层是 Endaxis 的根基，包含游戏中所有干员、武器、装备、敌人和套装的定义。数据以 TypeScript 源文件形式存在，利用静态类型系统保证完整性。

## 数据实体

### 干员（Operator）

当前有 28 名干员，每名干员定义文件包含：

| 字段                             | 类型             | 说明                                                                                                                    |
| -------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `gameId`                         | string           | 游戏内 ID                                                                                                               |
| `rarity`                         | number           | 稀有度（星级）                                                                                                          |
| `class`                          | string           | 职业：`guard`（近卫）、`caster`（术师）、`defender`（重装）、`vanguard`（先锋）、`supporter`（辅助）、`striker`（突击） |
| `element`                        | string           | 伤害元素：`physical`、`heat`、`cryo`、`electric`、`nature`                                                              |
| `mainAttribute` / `subAttribute` | string           | 主属性 / 副属性                                                                                                         |
| `attributes`                     | object           | 四维属性成长表                                                                                                          |
| `talents`                        | TalentEntry[]    | 天赋定义                                                                                                                |
| `potentials`                     | PotentialEntry[] | 潜能定义                                                                                                                |
| `combatSkills`                   | object           | 技能定义（普攻/下落攻击/处决/战技/连携/终结技等）                                                                       |

### 武器（Weapon）

5 类武器 × 多个稀有度，当前总计 72 把：

| 武器类型 | 中文名     | 英文标识     |
| -------- | ---------- | ------------ |
| 单手剑   | Sword      | `sword`      |
| 双手剑   | Greatsword | `greatsword` |
| 长柄武器 | Polearm    | `polearm`    |
| 手铳     | Handcannon | `handcannon` |
| 施术单元 | Arts Unit  | `arts-unit`  |

每把武器定义包含 3 个技能槽（2 个通用属性 + 1 个专属武器技），每个槽有 9 个精炼等级（对应角色等级 1-90）。

### 装备（Gear Piece）

218 件装备件，分为 4 个槽位：

| 槽位        | 中文名 | 英文名     |
| ----------- | ------ | ---------- |
| Armor       | 护甲   | armor      |
| Gloves      | 护手   | gloves     |
| Accessory 1 | 配件 1 | accessory1 |
| Accessory 2 | 配件 2 | accessory2 |

每件装备有 4 个等级需求（Lv20/40/60/70），对应绿/蓝/紫/金品质。属性分为主词条（primary）和副词条（secondary），精锻（Artificing）0-3 级。

### 套装（Gear Set）

23 个套装。套装效果按“同一套装装备数达到 3 件及以上”触发，`collect.ts` 会在满足门槛时激活该套装的 `effects` 和 `triggers`。游戏机制本身不存在 2 件 / 4 件两档。

### 敌人（Enemy）

13 个敌人，定义包含：

| 字段                          | 说明                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `tier`                        | 阶级：normal（普通）、advanced（进阶）、elite（精英）、boss（头目）、leader（领袖） |
| `def`                         | 防御力                                                                              |
| `resistance`                  | 元素抗性（物理/灼热/寒冷/电磁/自然）                                                |
| `maxStagger`                  | 最大失衡值                                                                          |
| `staggerNodeCount`            | 失衡节点数                                                                          |
| `staggerBreakDuration`        | 失衡破防持续时间                                                                    |
| `levelHp`                     | 各等级生命值对照表                                                                  |
| `enemyDamageCapRatio`         | 单窗口伤害上限比例                                                                  |
| `enemyDamageCapWindowSeconds` | 伤害上限窗口（秒）                                                                  |

## 数据访问

`src/data/index.ts` 提供统一的数据查询接口：

```typescript
getOperator(slug); // 获取干员完整数据
getWeapon(slug); // 获取武器数据
getEnemy(slug); // 获取敌人数据
getGearPiece(slug); // 获取装备件数据
getGearSet(slug); // 获取套装数据
```

所有数据文件通过 Vite 的 `import.meta.glob` 在构建时静态打包，支持通过 slug、游戏 ID、图标文件名等多种别名解析。

## 效果（Effect）类型系统

效果系统是整个数据层最复杂的部分，定义了游戏中的所有增益、减益、触发和反应。核心类型：

| 效果种类（kind）           | 说明                  | 示例                         |
| -------------------------- | --------------------- | ---------------------------- |
| `status`                   | 状态效果（增益/减益） | 攻击力+10%，灼热脆弱+6%      |
| `infliction`               | 元素附着              | 灼热附着、寒冷附着           |
| `burst`                    | 元素爆发              | 灼热爆发（同元素重复附着）   |
| `reaction`                 | 元素反应              | 燃烧、导电、冻结、腐蚀       |
| `physicalStatus`           | 物理异常              | 破防、倒地、击飞、猛击、碎甲 |
| `damageHit`                | 单次伤害              | 触发一次伤害                 |
| `damageOverTime`           | 持续伤害              | 燃烧每秒伤害                 |
| `spRecovery`               | 技力回复              | 恢复 10 点技力               |
| `spReturn`                 | 技力返还              | 返还 5 点技力                |
| `ultEnergyGain`            | 终结技能量获取        | 获得 20 点终结技能量         |
| `cooldownReductionFlat`    | 冷却缩减（秒）        | 连携冷却-2秒                 |
| `cooldownReductionPercent` | 冷却缩减（%）         | 连携冷却-15%                 |
| `derived`                  | 派生效果              | 从已有效果继承并修改         |
| `oneTime`                  | 一次性消耗效果        | 下次战技伤害+20%             |
| `consume`                  | 消耗效果              | 直接消耗状态                 |

### 触发事件（TriggerEvent）

效果通过触发事件激活：

| 触发类型           | 触发时机                   |
| ------------------ | -------------------------- |
| `onHit`            | 命中时                     |
| `onActionStart`    | 动作开始时                 |
| `duringAction`     | 动作持续期间               |
| `onStatusApplied`  | 状态施加时                 |
| `onStatusConsumed` | 状态被消耗时               |
| `onStatusExpire`   | 状态过期时                 |
| `onFinalStrike`    | 普攻序列最后一击（重击）时 |
| `onFinisher`       | 处决时                     |
| `onDive`           | 下落攻击时                 |
| `onSpRecovery`     | 技力回复时                 |

### 条件系统（EffectCondition）

效果生效前可附加条件判断：

| 条件类型             | 说明                     |
| -------------------- | ------------------------ |
| `enemyStatus`        | 敌人状态检查（可含消耗） |
| `enemyHp`            | 敌人生命值阈值           |
| `enemyStaggered`     | 敌人是否失衡             |
| `operatorStatus`     | 干员状态检查（可含消耗） |
| `operatorHp`         | 干员生命值阈值           |
| `comboNotOnCooldown` | 连携窗口开窗时检查冷却   |
| `actionLinkConsumed` | 连携被消耗               |
| `not`                | 否定条件                 |
| `or`                 | 或条件                   |

### 数值缩放（ScalingDef）

效果数值可以通过属性缩放或堆叠层数缩放：

```typescript
{
  additive: [
    { basis: 'main', coefficient: [0.005, 0.01] },  // 主属性 × 系数
    { key: 'effect_id', coefficient: 5 }             // 效果层数 × 5
  ],
  multiplier: [0.1],                                   // × (1 + 0.1)
  cap: 1000
}
```
