# 干员养成通用转换优先级

## 结论

本轮重新审计 30 名干员的 268 个天赋与潜能效果，并完成第一优先级候选的生成闭环：

1. 原生数据结构、运算顺序和目标身份均有本地反编译或复刻证据；
2. 可以映射为通用规则，而不是根据字段名猜测单个干员语义；
3. Endaxis Next 已经存在实际参与模拟的等价消费链。

终结技能量消耗乘算现在同时满足以上条件，已开放自动转换。结构化结果位于
`all-operator-progression-audit.json` 的 `summary.conversionCandidatePriorities`；它记录候选覆盖量、
原生参数、Next 定义、运行时状态和生成数量。

正式 manifest 另按“养成槽位”而不是原始等级效果计数。当前 13 名正式生成干员共有 26 个天赋槽、
65 个潜能槽：9/26、55/65 已完整写入 `OperatorDefinition`，且 9/26、55/65 已接入标准场景的
面板、技能补丁、常驻被动或养成事件编译链。完整生成定义不再自动等同于可模拟；逐干员事实与阻塞位于
`operators[].configuredProgression`，汇总位于 `summary.configuredProgression`。

弧光潜能 5 已证明组合槽位也必须原子转换：原生战技 `count=2` 黑板覆盖与无条件附着 Buff 同属一个
效果，后者在 `OnBuffStart` 结束已有的额外次数计数 Buff。Next 通过
`skillBlackboardPatchAndAttachedBuff` 同时生成技能补丁和养成初始化序列；任何一侧无法编译时，整个
潜能仍保持未转换。

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

| 优先级 | 原生载荷             | 条目数 | 当前阻塞                                                                                                       |
| ------ | -------------------- | -----: | -------------------------------------------------------------------------------------------------------------- |
| 1      | `skillParamModifier` |     40 | 终结技降费已完成源侧识别；其余费用和冷却类 Upgrade 仍须逐项闭环                                                |
| 2      | `skillBbModifier`    |    409 | 原生 Add/Multiply/Overwrite 已知，通用黑板 Patch 已接入；具体键仍需由技能消费者证明语义                        |
| 3      | `attachSkill`        |     28 | 隐藏被动 SkillData 与 Buff 已纳入解析和逐项审计；Lifeng 属性系数被动已闭环，其余仍受事件、光环或复杂 Buff 阻塞 |
| 4      | `attachBuff`         |     58 | Next 有 Buff 运行时，但不同 Buff 的注册、触发、目标与事件生命周期不能仅靠引用 ID 推断                          |
| 5      | `activeCondition`    |      6 | 它是上述效果的启用门槛，必须与被修饰载荷一起转换，不能独立省略                                                 |
| 6      | 未闭环静态属性       |      2 | 治疗增益缺少治疗链；干员以太承伤缺少干员受击链                                                                 |

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

## 定义转换与标准模拟编译

养成审计现将两个阶段分开：

1. `definitionConverted` 要求来源效果已由严格转换器写入非占位的养成定义；显式 `unmodeled*` 空定义不计入；
2. `standardSimulationCompileReady` 还要求对应 modifier 或被动程序已有标准场景消费链。

佩丽卡已有明确 keyed step 语义的 `multiplyEffectDuration` 与 `setEffectiveness` 已接入技能补丁编译：
编译器要求目标技能组存在、稳定 key 在根调度中只命中一个 `applyElementalReaction`，再分别修改来源
持续秒数和效果量；缺失、重复或步骤种类不符都会失败关闭。`addUltimateCriticalRate` 也已作为技能
程序局部属性修正进入伤害快照，只影响目标技能组及其派生操作链，不改写干员全局面板或其他技能。
`targetStaggeredDamage` 也已严格映射到既有 `damageToStaggeredEnemyIncrease` 伤害属性：天赋等级值
进入技能程序，但只在每次命中读取到敌人实时失衡状态时参与倍率，不预设敌人失衡。反应后攻击 Buff
也已通过养成事件程序进入标准模拟；当前已经完整转换的槽位均有标准模拟编译消费链。

直接 `AddBuff` 与 `attachSkill` 分属两个原生入口。前者现在由独立养成初始化程序在 Buff 生命周期
装配后执行一次，不创建可释放技能或虚构隐藏被动；管理员潜能 1/2 已用真实生成定义验证技能后续
可以按 Buff ID 读取其黑板。只有无条件且整棵 Buff 定义可表达的效果才生成，事件、光环和未知载荷
仍保持未建模。
陈千语潜能 1 进一步闭合了攻击方伤害 Buff 的 `CheckHp(Target)` 子集：运行时按每次命中的敌人
实时生命比例比较 Buff 黑板阈值，再决定是否应用同一 Buff 黑板中的 `DamageScaleProcessor` 加值。

## `attachSkill` 运行时闭环

反编译证据确认，`attachSkill` 不是时间轴上的主动释放，也不是面板数值的别名。原生
`AbilitySystem._InitSkills` 先创建这些隐藏被动技能，随后 `_EnablePassiveSkills` 统一调用
`Skill.Enable`。`PassiveSkillType.AddBuff` 会在这一阶段给实体安装 Buff；事件型和切换型被动则继续
注册监听器。Next 因此新增了独立的常驻被动程序，而没有伪造成一个零帧技能块：

1. 养成编译阶段按当前天赋、潜能等级解析被动黑板和启用序列；
2. 战斗装配完成实体、Buff 容器和生命周期解释链后，按声明顺序启用每项被动一次；
3. 被动施加的内联 Buff 通过 `sourceActionId` 返回原被动操作链，不再强制依赖时间轴施法身份；
4. Buff 的 `start`、`enable`、`trigger`、`finish` 等序列因此可复用统一步骤解释器。

这只表示运行时入口已经存在，不代表 28 个条目均可自动转换。生成器现已从干员的天赋、潜能效果
收集 `attachSkill`，严格读取隐藏 SkillData 的被动类型、声明黑板、启动 Buff 和传值关系，并逐个解析
其 Buff 依赖。天赋各等级引用同一隐藏技能且黑板键集合一致时，参数会合并为 `LevelValues`；只有
完整通过下游检查的 `Passive + AddBuff` 才会生成 `passiveSkills`。

隐藏被动采用隔离审计：单个 Buff 出现未知原生结构时，只把对应被动记录为 `generationIssues`，不会
阻断其他干员生成，也不会把失败定义写入正式运行时目录。Lifeng 第一天赋是当前首个完整通过检查
并接入正式模拟的真实样本：生成器输出隐藏被动、等级黑板和内联 Buff，运行时按四维派生公式读取
修正后的攻击系数。其他候选仍保持各自阻塞：

- `ToggleBuff`、事件动作和全局光环尚未形成完整运行时闭环；
- Buff 修改的原生战斗属性若未进入对应运行时消费链，不能仅凭“Buff 已安装”标记为完成；
- 隐藏被动引用的 Buff 存在未识别生命周期载荷时，生成器必须报错或保留未建模状态，不能降级为空效果。

对应事实与阻塞原因位于各干员 `*.audit.json` 的 `passiveSkills`。合成测试覆盖可表达子集的完整输出；
Lifeng 回归测试进一步覆盖真实生成定义到最终伤害的生产路径。
