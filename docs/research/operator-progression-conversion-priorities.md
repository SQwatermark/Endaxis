# 干员养成通用转换优先级

## 结论

本轮重新审计 29 名干员的 259 个天赋与潜能效果，并完成第一优先级候选的生成闭环：

1. 原生数据结构、运算顺序和目标身份均有本地反编译或复刻证据；
2. 可以映射为通用规则，而不是根据字段名猜测单个干员语义；
3. Endaxis Next 已经存在实际参与模拟的等价消费链。

终结技能量消耗乘算现在同时满足以上条件，已开放自动转换。结构化结果位于
`all-operator-progression-audit.json` 的 `summary.conversionCandidatePriorities`；它记录候选覆盖量、
原生参数、Next 定义、运行时状态和生成数量。

## 第一优先级：终结技能量消耗乘算

| 指标             | 数量 |
| ---------------- | ---: |
| 原生参数修改条目 |   27 |
| 潜能效果         |   26 |
| 干员             |   26 |

所有命中样本都同时满足：

- 效果类型为 `ChangeSkillParam`；
- 参数为 `CostValue`；
- 运算为 `Multiply`；
- 目标技能属于原生 `UltimateSkill` 技能组。

其中 25 个效果修改一个终结技，诀的同一效果修改两个形态的终结技，所以共有 27 条修改。
原生 `_CalculatePotentialTalentEffect` 会按潜能解锁顺序把乘数应用到技能数据的
`CostValue`，这一侧已经闭环。

Next 已建立统一养成 Patch 阶段，`multiplySkillCost` 会修改目标技能组所有分支的编译后费用。
生成器因此不再要求 `operators.json` 为每名干员手写 `compile` 提示，而是直接验证完整原生形状后输出。
全量结果为 26 名干员、26 个潜能效果、27 个原生技能目标全部转换；诀的双形态目标归并为一个
`ultimate` 技能组 modifier。20 个效果保留源倍率 `0.85`，6 个保留源倍率 `0.9`。

任何混合载荷、非终结技目标、非乘算操作或双形态倍率不一致都会立即报错。其他尚未闭环的潜能效果
仍通过 `conversionSupport`/审计缺口标记为不完整，不会因为降费已转换而被近似或静默丢失。

## 后续优先级

下表的“条目数”来自 `summary.entryCounts`，表示原生效果条目，不等于独立天赋或潜能数量。

| 优先级 | 原生载荷             | 条目数 | 当前阻塞                                                                                                        |
| ------ | -------------------- | -----: | --------------------------------------------------------------------------------------------------------------- |
| 1      | `skillParamModifier` |     38 | 终结技降费已完成源侧识别；费用和冷却类 Upgrade 尚无通用消费阶段                                                 |
| 2      | `skillBbModifier`    |    371 | 原生 Add/Multiply/Overwrite 已知，但 Next 没有把养成 Patch 合并到各技能初始黑板；具体键仍需由技能消费者证明语义 |
| 3      | `attachSkill`        |     28 | Next 有技能运行时，但缺少由天赋创建被动技能实例及其生命周期的完整入口                                           |
| 4      | `attachBuff`         |     57 | Next 有 Buff 运行时，但不同 Buff 的注册、触发、目标与事件生命周期不能仅靠引用 ID 推断                           |
| 5      | `activeCondition`    |      6 | 它是上述效果的启用门槛，必须与被修饰载荷一起转换，不能独立省略                                                  |
| 6      | 未闭环静态属性       |      2 | 治疗增益缺少治疗链；干员以太承伤缺少干员受击链                                                                  |

`skillBbModifier` 数量最多，但它不是一个可以按键名批量翻译的通用战斗效果。正确做法是先复刻原生
技能 Patch 合并机制，再由已经解析的技能程序读取被修改后的黑板；不能把 `atk_scale`、`duration`
之类的名字直接猜成某种固定 Upgrade modifier。

## 证据

- `vfs-index-browser/docs/research/combat/skill-patch-merge.md`：天赋、潜能 Patch 顺序，
  `ChangeSkillParam` 与 Add/Multiply/Overwrite 的原生语义；
- `vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Runtime/TalentAndPotentialModifiers.cs`：
  `CostValue`、`CoolDown` 等枚举和结构化复刻；
- `src/next/core/game-data/operatorDefinition.ts`：Next Upgrade modifier 定义；
- `src/next/core/compiler/resolveOperatorPanel.ts`：当前实际消费的养成 modifier 范围；
- `operator-progression-runtime-closure-gaps.md`：两个静态属性缺口的方向和生命周期说明。

## 运行时闭环进展

`multiplySkillCost` 已接入统一养成编译阶段：

1. `resolveActiveOperatorUpgrades` 统一解析当前构筑启用的天赋和潜能，并保持天赋声明顺序、潜能解锁顺序；
2. `applyOperatorUpgradeSkillPatches` 在技能等级值展开后、运行时装配前，按上述顺序不可变地修正同一技能组的全部技能分支；
3. `multiplySkillCost` 会按资源类型修改 `CompiledSkillProgram.costs`，运行时扣费无需再次解释养成 DSL；
4. 目标技能组、目标资源或倍率非法时直接报错，尚未接入的技能类 modifier 也继续严格失败，不会静默产生近似结果。

生成审计现已把该候选标记为 `implemented/generate`，并为全部 26 个效果写入完整
`dslConversion`。尚未完整生成的干员仍保持原有支持度提示；本次转换只增加证据闭环的费用补丁，
不会顺带启用同一干员其他未接入的天赋或潜能行为。
