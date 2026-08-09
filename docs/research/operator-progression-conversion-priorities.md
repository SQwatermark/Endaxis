# 干员养成通用转换优先级

## 结论

本轮重新审计 29 名干员的 259 个天赋与潜能效果，没有发现同时满足以下条件的新增候选：

1. 原生数据结构、运算顺序和目标身份均有本地反编译或复刻证据；
2. 可以映射为通用规则，而不是根据字段名猜测单个干员语义；
3. Endaxis Next 已经存在实际参与模拟的等价消费链。

因此本轮不新增养成 DSL 转换。结构化结果位于
`all-operator-progression-audit.json` 的 `summary.conversionCandidatePriorities`；它记录候选覆盖量、
原生参数、预期 Next 定义、运行时阻塞项和本轮决策。

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

Next 虽然声明了 `multiplySkillCost`，现有生成产物也已经出现该结构，但当前编译和运行时只消费
面板属性与静态增伤类养成 modifier。没有代码把选中的 `multiplySkillCost` 应用到编译后的技能费用，
双形态技能也尚未经过统一的养成 Patch 阶段。此时继续批量生成只会产生不会生效的死配置，因此决策为
`report-only`。

重新开放转换前需要先在 Next 主线完成：

1. 在技能定义编译前建立统一的养成 Patch 阶段；
2. 把选中潜能的费用乘算按顺序应用到技能组的所有对应分支；
3. 用普通终结技和双形态终结技分别验证最终扣费值；
4. 再由本审计中的严格识别规则生成 `multiplySkillCost`。

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
