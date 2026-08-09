# 装备常驻战斗修正严格审计

本文审计迁移矩阵中的 33 条 `battlePersistentModifier`。目标不是延续旧 `Effect` 联合的字段，而是确认每条效果的真实语义目的地和 Endaxis Next 当前能力边界。

## 结论

| 结论                               | 数量 | 说明                                                                  |
| ---------------------------------- | ---: | --------------------------------------------------------------------- |
| 可直接转为当前构筑静态定义         |    1 | `swordmancer` 无范围失衡增益可映射为 `panelStat.staggerDamagePercent` |
| 语义上属于构筑静态修正、但缺 DSL   |   20 | 治疗效率 9、最终伤害减免 8、连携冷却缩减 2、处决限定失衡增益 1        |
| 必须由开战安装的持久 Buff 实时判定 |   12 | 8 条显式条件修正，以及 4 条“对失衡目标伤害加成”                       |
| 当前 DSL 缺口总数                  |   32 | 20 条静态通道缺口 + 12 条持久 Buff 缺口                               |

33 条全部显式 `target=self`，全部没有 duration、叠层、ICD 或其他生命周期字段。源数据条件分布为：无条件 25、`operatorHp` 4、`enemyStatus` 2、`enemyStaggered` 1、`operatorStatus` 1。

## Modifier 分类

| 旧 modifier                | 数量 | 正确语义目的地                           | 当前结果                                       |
| -------------------------- | ---: | ---------------------------------------- | ---------------------------------------------- |
| `heal`                     |    9 | 构筑期可确定的常驻治疗效率               | 缺治疗效率静态通道                             |
| `protection`               |    8 | 构筑期可确定的最终伤害减免               | 缺最终减伤静态通道                             |
| `dmgBonus`                 |    5 | 带实时战斗条件的持久伤害 Buff            | 缺装备 Buff 蓝图、启动序列和声明式条件伤害修正 |
| `susceptibility`           |    4 | 对失衡目标伤害加成的持久伤害 Buff        | 旧字段语义错误；当前条件伤害 Buff 缺失         |
| `atkPercent`               |    2 | 生命值高于 80% 时生效的持久属性 Buff     | 缺条件属性 Buff 执行链                         |
| `staggerPercent`           |    2 | 1 条全局静态；1 条仅处决生效             | 全局条目可生成；技能范围条目缺 DSL             |
| `cooldownReductionPercent` |    2 | 仅连携技生效的常驻冷却修正               | 当前装备静态定义不能携带技能范围               |
| `critRate`                 |    1 | 指定 Buff 恰好 5 层时生效的持久属性 Buff | 缺条件属性 Buff 执行链                         |

## 旧 Endaxis 的实际执行语义

### 收集与初始化

`src/data/collect.ts` 会把武器词条、装备词条和三件套的被动 `status` 全部收集。`src/stores/timelineStore.ts` 随后分成两条旧运行路径：

1. 无 condition、不是敌方 modifier 的 self 状态，经 `buildInitialRuntimeEffectsFromCollected` 作为无限期初始状态装入模拟器；
2. 有 condition 的状态，经 `buildConditionalPassiveTriggerEffectsFromCollected` 尝试转换为状态施加/到期监听。

33 条在旧代码中的实际分布为：

| 旧运行路径                 | 数量 | 结果                                                                       |
| -------------------------- | ---: | -------------------------------------------------------------------------- |
| `initialInfiniteStatus`    |   21 | 无条件状态在 0 时刻装入 `OperatorEffectState`                              |
| `conditionalTriggerBridge` |    4 | `enemyStatus` 2、`enemyStaggered` 1、`operatorStatus` 1 被转换为启停触发器 |
| `conditionNotBridged`      |    4 | `operatorHp` 不在转换白名单内，既不初始化也不生成触发器                    |
| `excludedAsEnemyModifier`  |    4 | self `susceptibility` 被敌方 modifier 过滤器排除                           |

“进入初始状态”不等于“产生正确效果”。旧 `computeStats` 明确跳过 self 上的 `susceptibility`、`increasedDmgTaken` 和 `resistanceShred`；治疗效率与最终减伤也没有进入 `computeStats` 的聚合 switch，模拟器中未找到对应消费点。失衡增益由 `StaggerChangeHandler` 按 `skillTypes` 消费，冷却缩减由 `computeStats` 保留技能范围并计算连携/终结技冷却因子。

因此不能用旧运行结果反推这些条目都已正确实现。迁移时应以目录语义和已经闭环的消费点为准，并把旧实现偏差显式留档。

### 四条 `susceptibility` 的纠正

以下旧条目都写成 `{ modifier: 'susceptibility', target: 'self' }`：

- `aburrey-auditory-chip`；
- `aburrey-gauntlets`；
- `bonekrusha-mask`；
- `thertech-plating`。

`src/i18n/game-locales/zh/gearpieces.json` 将其命名为“对失衡目标伤害加成”，英文目录为 `DMG Bonus vs. Staggered`。这不是对装备者施加脆弱，也不是无条件增伤。正确表达应是：战斗开始时安装永久伤害修正，每次伤害结算时检查目标是否处于失衡状态。

候选适配器只对这四个已闭环身份执行纠正。未来出现新的 self `susceptibility` 会 fail closed，不会按名称相似自动套用。

## Endaxis Next 当前能力边界

### 可直接使用的静态定义

`EquipmentModifierDefinition` 当前支持四维、普通面板属性和带伤害/技能范围的 `damageBonus`。无范围 `staggerPercent` 可无损映射到 `panelStat.staggerDamagePercent`。

以下内容不能直接映射：

- `skillCooldownReduction` 没有技能范围字段，而真实两条只作用于连携技；
- `staggerDamagePercent` 没有技能范围字段，不能表达只作用于处决；
- 没有治疗效率和最终伤害减免字段。

扩大作用范围会改变结果，因此适配器只报告缺口。

### 为什么 12 条必须是持久 Buff

这些效果依赖生命值、敌方状态、失衡状态或 Buff 层数。条件会在战斗过程中反复变化，不能在 Build Resolver 中提前求一次真假。正确边界是：

1. 构筑编译时生成不可变 Buff 蓝图；
2. 开战序列把无限期 Buff 安装到装备者；
3. 属性或伤害消费点在每次结算时重新判断声明式条件。

低层 `CombatBuffDefinition` 虽有属性/伤害修正能力，但当前可序列化 `CombatBuffCatalogEntry` 只有属性八槽修正，没有伤害修正和声明式条件；`EquipmentContributionDefinition` 也没有 `buffDefinitions` 或 `startup`。另外，技能 `applyStatus.modifiers` 虽有类型，`CombatStatusRuntime` 目前会明确拒绝带 modifier 的状态，不能当作可用替代路径。

因此本次没有生成任何持久 Buff 候选定义。12 条全部保留结构化缺口，而不是注入回调或把条件静态化。

## 机器可读输出

`equipment-static-candidate-coverage.json` 的相关条目新增：

- `semanticDestination`：`buildStaticModifier` 或 `battleStartPersistentBuff`；
- `battlePersistentAudit.target/condition/lifecycle`：保留审计维度；
- `battlePersistentAudit.legacyRuntimeDisposition`：记录旧版实际执行路径；
- `battlePersistentAudit.evidence`：记录作出判断所依据的代码或目录语义；
- `candidateDefinition` 或结构化 `gap`：二者互斥，不存在 raw fallback。

后续 DSL 扩展应先补通用能力，再重新运行本审计。报告数量发生变化时必须由测试和人工评审共同确认。
