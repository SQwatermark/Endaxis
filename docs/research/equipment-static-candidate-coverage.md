# Endaxis Next 装备候选定义覆盖报告

本报告回答两件事：构筑期可确定的旧装备效果能否无歧义写成当前 `EquipmentModifierDefinition`；33 条常驻战斗效果应进入静态构筑还是在开战时安装持久 Buff。迁移 IR 可识别、构筑期可求值、角色面板可见和当前 DSL 可表达是不同概念。

## 结论

- 全量 effect：1049
- 构筑期静态贡献：920
- 可生成候选定义：909
- 当前 DSL 缺口：23
- 不属于静态定义适配范围：117
- 可生成且显示在角色面板：733
- 可生成但只作为战斗公式静态输入：176

## 33 条常驻战斗效果

- 审计总数：33
- 语义上属于构筑静态修正：21
- 其中可直接写成当前定义：10
- 必须在开战时安装持久 Buff：12
- 当前 DSL 缺口：23

| 旧 modifier                | 可直接生成 | DSL 缺口 |
| -------------------------- | ---------: | -------: |
| `atkPercent`               |          0 |        2 |
| `cooldownReductionPercent` |          0 |        2 |
| `critRate`                 |          0 |        1 |
| `dmgBonus`                 |          0 |        5 |
| `heal`                     |          9 |        0 |
| `protection`               |          0 |        8 |
| `staggerPercent`           |          1 |        1 |
| `susceptibility`           |          0 |        4 |

| 维度         | 取值                       | 数量 |
| ------------ | -------------------------- | ---: |
| target       | `self`                     |   33 |
| condition    | `enemyStaggered`           |    1 |
| condition    | `enemyStatus`              |    2 |
| condition    | `none`                     |   25 |
| condition    | `operatorHp`               |    4 |
| condition    | `operatorStatus`           |    1 |
| lifecycle    | `none`                     |   33 |
| 旧运行时路径 | `conditionNotBridged`      |    4 |
| 旧运行时路径 | `conditionalTriggerBridge` |    4 |
| 旧运行时路径 | `excludedAsEnemyModifier`  |    4 |
| 旧运行时路径 | `initialInfiniteStatus`    |   21 |

严格结论：9 条无条件治疗效率与 `gearSet:swordmancer:effects[0]` 的无范围 `staggerPercent` 已可分别映射为 `staticHealingIncrease.output` 与 `panelStat.staggerDamagePercent`。4 条旧 `self + susceptibility` 并不是对自身施加脆弱；中英文装备目录均将其命名为 `DMG Bonus vs. Staggered`，必须按“攻击失衡目标时增伤”的实时条件处理。

剩余 11 条无条件常驻效果仍属于构筑静态战斗输入，但当前定义缺少最终伤害减免（8）、按技能类型冷却缩减（2）和按技能类型失衡增益（1）。另外 12 条必须成为持久 Buff：显式条件属性/伤害修正 8 条，加上上述对失衡目标增伤 4 条。当前装备定义没有 Buff 蓝图和启动序列，可序列化 Buff 目录也没有条件伤害修正，因此这 12 条目前全部是 DSL 缺口。

## 来源分组

| 分组       | 可生成 | DSL 缺口 | 非静态范围 |
| ---------- | -----: | -------: | ---------: |
| 武器词条 1 |     76 |        0 |          0 |
| 武器词条 2 |     68 |        0 |          0 |
| 武器词条 3 |     62 |        6 |         94 |
| 装备词条 1 |    242 |        0 |          0 |
| 装备词条 2 |    236 |        4 |          0 |
| 装备词条 3 |    204 |        8 |          0 |
| 套装效果   |     21 |        5 |         23 |

## Modifier 映射

| 旧 modifier                | 可生成 | DSL 缺口 | 非静态范围 |
| -------------------------- | -----: | -------: | ---------: |
| `artsIntensity`            |     34 |        0 |          3 |
| `atkFlat`                  |      9 |        0 |          0 |
| `atkPercent`               |     54 |        2 |         30 |
| `attributeFlat`            |    515 |        0 |          0 |
| `attributePercent`         |     20 |        0 |          2 |
| `consume`                  |      0 |        0 |          1 |
| `cooldownReductionPercent` |      0 |        2 |          0 |
| `critRate`                 |     23 |        1 |          2 |
| `damageHit`                |      0 |        0 |          2 |
| `defPercent`               |      0 |        0 |          2 |
| `dmgBonus`                 |    166 |        5 |         58 |
| `flatHp`                   |      9 |        0 |          0 |
| `heal`                     |      9 |        0 |          0 |
| `hpPercent`                |     25 |        0 |          0 |
| `increasedDmgTaken`        |      0 |        0 |         10 |
| `protection`               |      0 |        8 |          0 |
| `shield`                   |      0 |        0 |          1 |
| `spRecovery`               |      0 |        0 |          1 |
| `staggerPercent`           |      1 |        1 |          0 |
| `status`                   |      0 |        0 |          5 |
| `susceptibility`           |      0 |        4 |          0 |
| `ultimateGainEfficiency`   |     44 |        0 |          0 |

## 语义边界

- `attributeFlat` / `attributePercent` 映射到 `attribute`；旧 `sub` 明确转换为 Next 的 `secondary`。百分比由百分数除以 100。
- 攻击、生命、防御、暴击、法术强度和终结技充能效率映射到 `panelStat`。其中百分比类同样转换为小数。
- 无条件 `heal` 是施术者输出治疗效率，映射到 `staticHealingIncrease.output`；它在治疗公式中生效，即使目标满血、实际治疗为零也不阻止治疗事件。
- `dmgBonus` 是构筑期可确定的战斗公式输入，不等于角色面板字段。元素范围明确时按元素映射；仅按技能范围或完全无范围时，映射到除 `lifeDrain` 外的全部 DamageType。
- 旧版完全无范围的“所有技能伤害”只覆盖战技、连携技和终结技；旧 `basicAttack` 范围还包含处决和下落攻击，适配时分别显式展开。
- `ampBonus` 是独立增幅乘区，不能降级为 `damageBonus`。`attributeAtkPercent` 修改四维到攻击力的换算系数，不能降级为 `attackPercent`。
- 候选 IR 不保存 raw fallback。无法闭环的记录只有明确缺口，不会生成看似可用但语义变化的定义。
- 常驻不等于面板静态。带生命值、敌方状态、失衡状态或 Buff 层数条件的效果必须在战斗结算点重新判断，不能把当前真假提前固化进构筑。

## 重点 modifier 核对

- `dmgBonus`：effect 229，构筑期静态 166，可生成 166，DSL 缺口 0，持久 Buff 5，作为 trigger 过滤条件 0。
- `ampBonus`：effect 0，构筑期静态 0，可生成 0，DSL 缺口 0，持久 Buff 0，作为 trigger 过滤条件 2。
- `attributeAtkPercent`：effect 0，构筑期静态 0，可生成 0，DSL 缺口 0，持久 Buff 0，作为 trigger 过滤条件 0。

当前数据中 `ampBonus` 只用于监听已施加状态的 trigger 过滤条件，并不是装备直接提供的静态效果；`attributeAtkPercent` 在本批装备 effect 中未出现。二者仍由适配器显式拒绝近似映射，以防未来数据进入时被静默误转。无元素 `dmgBonus` 的闭环证据详见 `equipment-unscoped-dmgbonus-semantics.md`；常驻战斗效果的旧执行链与 Next 能力证据详见 `equipment-battle-persistent-modifier-audit.md`。

## 当前 DSL 缺口

### `conditional-attribute-buff-unsupported`（3）

该属性必须随战斗条件实时启停；当前装备 DSL 无 Buff 蓝图/启动序列，状态修正运行时也尚未实现

- `src/data/weapons/arts-unit/4/hypernova-auto.ts#skill3.effects[0]`
- `src/data/weapons/polearm/4/pathfinders-beacon.ts#skill3.effects[0]`
- `src/data/gearsets/mi-security.ts#effects[1]`

### `conditional-damage-buff-unsupported`（5）

该伤害增益必须在每次伤害结算时判断战斗条件；当前可序列化 Buff 目录不支持伤害修正及声明式条件

- `src/data/weapons/polearm/5/obj-razorhorn.ts#skill3.effects[0]`
- `src/data/weapons/polearm/6/mountain-bearer.ts#skill3.effects[0]`
- `src/data/weapons/sword/6/rapid-ascent.ts#skill3.effects[1]`
- `src/data/gearsets/mordvolt-insulation.ts#effects[1]`
- `src/data/gearsets/roving-msgr.ts#effects[1]`

### `final-damage-reduction-modifier-unsupported`（8）

最终伤害减免是常驻战斗属性，但当前 EquipmentModifierDefinition 和 Buff 目录没有对应通道

- `src/data/gearpieces/aic-heavy/aic-alloy-plate.ts#skill2.effects[0]`
- `src/data/gearpieces/aic-heavy/aic-gauntlets.ts#skill3.effects[0]`
- `src/data/gearpieces/aic-heavy/aic-heavy-armor.ts#skill3.effects[0]`
- `src/data/gearpieces/aic-heavy/aic-heavy-plate.ts#skill2.effects[0]`
- `src/data/gearpieces/armored-msgr/armored-msgr-gloves.ts#skill3.effects[0]`

### `scoped-skill-cooldown-reduction-unsupported`（2）

现有 EquipmentModifierDefinition 的 skillCooldownReduction 缺少技能范围字段

- `src/data/gearsets/frontiers.ts#effects[0]`
- `src/data/gearsets/qingbo.ts#effects[0]`

### `scoped-stagger-modifier-unsupported`（1）

现有 staggerDamagePercent 不能保留 finalStrike 等技能范围，禁止扩大到全部失衡伤害

- `src/data/weapons/greatsword/6/sundered-prince.ts#skill3.effects[0]`

### `staggered-target-damage-buff-unsupported`（4）

目录文本证明该词条是对失衡目标伤害加成；需要持久伤害 Buff 在每次伤害时判断目标失衡

- `src/data/gearpieces/aburreys-legacy/aburrey-auditory-chip.ts#skill3.effects[0]`
- `src/data/gearpieces/aburreys-legacy/aburrey-gauntlets.ts#skill3.effects[0]`
- `src/data/gearpieces/bonekrusha/bonekrusha-mask.ts#skill3.effects[0]`
- `src/data/gearpieces/thertech/thertech-plating.ts#skill3.effects[0]`

## 输出用途

同名 JSON 中，`definitionReady` 记录携带严格构造的 `candidateDefinition`；`dslGap` 记录只携带结构化缺口。该文件用于评审和后续生成器输入，不会写入 `src/next` 正式目录。
