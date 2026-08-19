# 当前任务快照

> 更新时间：2026-08-19（Asia/Shanghai）
> 本文是变化最快、优先级最高的交接入口。完全不了解背景时，先读 [交接文档首页](./README.md)，再读本文和 [Next 文档入口](../next/README.md)。

## 1. 当前目标与边界

当前工作位于 `feature/next`，目标是在不修改旧版实现的前提下建设 Endaxis Next：以干员、武器、装备、敌人和用户操作序列为输入，准确模拟战斗过程，并由统一结果生成资源曲线、状态、伤害、诊断和日志。新版 UI 尽可能保持旧版布局与交互。

固定优先级：准确与功能完备 > 清晰易维护 > 性能。游戏规则必须有解包、反编译、C# Combat Spec 或已验证游戏样本依据，不用猜测填空。

当前继续推进干员 SkillData 到 Next DSL 的完整转换与模拟贯通。每轮只处理能够形成解析、DSL、运行时和测试闭环的机制，避免为了提高统计数字而静默省略动作。

## 2. Git 基线

- 当前台式机仓库：`D:\Projects\Endaxis`（本文其他位置所称“远程”即当前环境）
- 分支：`feature/next`
- 本轮开发前的 HEAD：`298ebf65 feat(next): compile operator progression effects`；实际 HEAD 始终以 `git log` 为准。
- `tmp/` 是未跟踪临时目录，绝对不要提交。
- 工作树可能含用户改动；始终先运行 `git status --short`，不要重置或回退不属于当前任务的内容。

能力实体定义内联重构已经落到当前工作树；新会话仍应以 Git 实际 HEAD 与 `git status --short` 为准。

## 3. 能力实体最新架构

2026-08-18 已完成 DSL、严格校验、等级编译、生成器、运行时、标准场景装配、生成产物和测试的内联迁移。Next 不再保留 `templateId` DSL 或运行时模板注册表。

### Buff 与能力实体彻底分离

- 不把能力实体降级成 Buff，也不设计“部分能力实体可折叠成 Buff”的生产模型；既然 Buff 无法完整表达独立实体身份、Context 句柄、实体查询、局部时间、独立子时间轴和作为 Buff 宿主等语义，就不做半合并。
- Buff 继续是附着于既有宿主的效果实例，保留 Buff ID/Tag 查询、叠层/刷新、属性修正和 Buff 生命周期语义。
- 能力实体继续是场景中的独立逻辑目标，保留稳定句柄、owner/source/target、独立寿命、实体局部时间、实体黑板、Context 查询、子技能时间轴和自己的 Buff 容器。
- 两者可以复用没有领域含义的底层设施，例如动作序列解释器、黑板数值、时钟与帧调度工具；不得为复用代码而引入模糊两者语义的“通用效果实体”领域类型。

### 能力实体定义内联进技能组件树

- 目标结构与 Buff 的“身份 + 内联 definition”形式相似，但只是数据组织方式相似，不代表运行时语义合并。
- `spawnAbilityEntity` 使用 `abilityEntityId + definition`。`abilityEntityId` 保留原生身份，供审计、日志和查询；`definition` 只携带可执行蓝图，包括默认生命周期和可选子技能组件树。
- 本次生成才决定的字段仍留在 spawn 层，例如 target、动态覆盖时长、动作黑板继承、实体黑板赋值、Context 输出和 `dieWhenSourceDies`；不要混入公共证据定义。
- VFS 提取文件 `src/next/data/ability-entities/ability-entity-templates-1.4.4.json` 继续作为版本化生成证据和审计来源；前端、项目存档、编译器与运行时不通过它进行共享模板查找。
- 当前机器是台式机，原始游戏文件、VFS 工具、运行时 IL2CPP dump 与 `combat-probe` 均可用。54 个模板的版本化证据已经进入仓库；普通生成和 UI 工作仍不应依赖 `tmp/`，只有重新提取资源或补充反编译证据时才使用这些台式机工具。
- 生成器在每个使用点把 VFS 模板证据和已证明的子 SkillData 原子展开为完整 `AbilityEntityDefinition`。原生 born tags 只留在证据层；能力实体标签查询会在生成期严格求值并降为明确的 `abilityEntityIds`，生产 DSL、存档、编辑器和运行时不再携带无语义裸 ID。
- `assetPath`、`assetIndex`、`rawSha256`、组件计数等只属于证据；没有执行规则的字段也不能伪装成可编辑、可执行定义。`maxStackingCount` 只有来源事实，达到上限时如何处理尚无规则证据，因此没有进入 `AbilityEntityDefinition`，继续只留在证据投影中。

目标形状示意：

```ts
step('spawnAbilityEntity', {
  abilityEntityId: 'abilityentity_xxx',
  definition: {
    lifetime: { kind: 'limited', durationSeconds: 10 },
    childSkill: {
      skillId: 'xxx_child',
      blackboard: {},
      scheduledSequences: [...],
    },
  },
  target: 'enemy',
  dieWhenSourceDies: false,
  inheritActionBlackboard: true,
  overrideDurationSeconds: { kind: 'blackboard', key: 'duration' },
  blackboardAssignments: {},
  saveToContextKey: 'entity',
});
```

### 前端编辑边界

- Next 技能编辑器已经把 `spawnAbilityEntity` 纳入可新增步骤，并提供专用内联表单；默认步骤本身能通过严格 `SkillDefinition` 校验，不再只能加载、排序、复制或删除。
- 表单直接编辑当前技能组件树中的 `abilityEntityId + definition`，覆盖目标、Context 输出、来源死亡联动、动作黑板继承、动态寿命覆盖、实体黑板赋值和有限/无限默认生命周期；没有恢复 `templateId`、共享模板选择器或 `bornTagIds` 裸 ID 字段。
- 可选子技能复用现有初始黑板、调度序列和战斗步骤编辑器，并通过异步递归组件支持子时间线中的嵌套能力实体。子技能仍只有实体局部时间，不提供独立费用、冷却或施法身份。
- VFS 原始模板证据保持只读，不允许用户修改公共模板。当前表单修改的是单个技能使用点的内联定义，不会影响其他技能。时间膨胀表单现已覆盖普通全局、普通实体和终结技三种能力实体查询：可编辑生成期已经证明的 owner-spawned 明确实体 ID 集合，或运行时已有的 Context 实体组；不会重新暴露 born-tag。普通实体目标可以只包含能力实体查询而不强制附加施法者/敌人，删除最后一个实体查询时若没有普通目标则安全恢复施法者目标。
- `type-check:next`、默认定义严格校验、三语言资源与组件接线测试已覆盖。默认 Next 项目第二轨放置并选中 Arclight 终结技，直接引用当前生成定义；其 5 秒能力实体包含局部第 7、63 帧两段真实子时间线，可直接进入“编辑逻辑”验收。此前零倍率终结技造成的时间线停滞已经修复；当前真实阻塞改为 `Pulse` 法术爆发缺少原生 `SkillSetting` / `spellInflictionSettings` 数据，现有本地 AKEDB 与版本化证据均没有可注入内容，不能猜造。

## 4. 本轮已经完成

### 生成器结构化编译后端

- 2026-08-19 新增 `scripts/generate_next_operators/compiler_ir.py`，用不可变控制流节点保存 `sequence/branch/once/repeatEachTick/forEachContextTarget`；规范化严格自叶子向根执行，递归展平 Sequence、删除空序列，并在两侧规范化执行签名一致时折叠 Branch。
- 新增 `conditional_compiler.py`，把条件树递归、分支作用域传播及 `DoOnce/EveryFrame/ForEach/Unconditional` 控制流从 1.3 万行主入口移出。它通过服务接口调用原有条件证明和叶子动作编译，不读取游戏数据、不另建规则副本；`generate_next_operators.py` 暂时保留兼容入口和语义服务适配层。
- 条件语义进一步拆为 `combat_condition_compiler.py`（约 544 行）和 `conditional_leaf_compiler.py`（约 636 行）。前者统一编译 `CombatCondition`，后者按载荷聚合条件分支叶子动作；目标身份、距离归约、伤害位和复用动作编译均由显式服务接口注入。按 Python 物理行统计，主入口由约 14,270 行降到约 13,362 行，没有建立循环导入。
- 最大的 `compile_resolved_sequence` 已整体迁入 `resolved_sequence_compiler.py`（约 853 行）。该模块内部仍保留一个完整的顺序编排流程，但把来源证明/调度分析与具体步骤编译拆成两组服务；主入口只保留兼容函数和装配，不持有单次编译状态。主入口进一步降至约 12,710 行，当前最大函数已从 722 行降为 385 行。
- 内联生命周期编译已经按调用关系拆为 `inline_buff_compiler.py`（约 743 行）和 `ability_entity_child_compiler.py`（约 340 行）。前者包含 Buff 事件响应、生命周期与实例本地定时序列，后者包含能力实体子技能调度；两者不互相导入，能力实体编译通过入口服务注入。主入口进一步降至约 11,898 行，最大函数仍为 385 行。
- 来源解析侧新增 `buff_event_parser.py`（约 732 行），集中 Sequence 优先级、Buff/Ability 事件、点燃响应、技能替换和技能事件监听器。`UNPARSED_BUFF_PAYLOAD_FIELDS` 仍留在 Buff 定义缺口审计边界，没有因为代码相邻而误归入事件模块。主入口进一步降至约 11,297 行。
- 新增 `buff_definition_parser.py`（约 846 行），集中 Buff 标签、属性/伤害修正、易伤投影、生命周期、来源死亡结束、未解析载荷和中央递归定义解析。目标身份与伤害位仍由服务注入；干员阶段选择和 Aura 动作解析没有混入。主入口进一步降至约 10,663 行。
- 新增 `projectile_graph_parser.py`（约 567 行），集中投射物载荷、命中子 SkillData、条件分支投影和递归投射物调用图。能力实体子图、来源读取和动作遍历继续由入口服务注入，测试替换入口也保留在兼容层，没有形成反向导入。主入口进一步降至约 10,306 行，当前最大函数仍为 385 行。
- 新增 `ability_entity_graph_parser.py`（约 623 行），集中能力实体生成、子 SkillData 黑板继承、递归调用图、条件分支 Aura 子图和确定性生成投影。它与投射物图只通过入口服务互调，主入口仍保留测试与审计工具使用的兼容函数，不持有单次解析状态。主入口进一步降至约 9,919 行，当前最大函数仍为 385 行。
- 新增 `resolved_schedule_collector.py`（约 574 行），集中根技能、投射物和能力实体子图的绝对帧投影、原生 Sequence/动作顺序、定时标记伤害去重、一次性回能过滤及非伤害调度事实。实体可编译性、动态数值和关键词证明由入口服务注入，收集器不渲染 DSL。主入口进一步降至约 9,468 行，当前最大函数仍为 385 行。
- 新增 `aura_action_parser.py`（约 493 行）与 `target_group_parser.py`（约 238 行）。前者集中技能/Buff 事件 Aura、形状、过滤和内部动作，后者集中 Finder/Merge 与选择器身份；两者都只保留来源事实，不做单敌人近似。主入口进一步降至约 8,840 行，最大函数由 385 行降至 187 行；`TargetGroupInputSource` 仍由主入口再导出以兼容既有测试和审计工具。
- 新增 `skill_action_fact_parser.py`（约 441 行），集中辅助 Buff/能力实体事实、运行时黑板读写与 Buff 结束，以及保留精确容器路径和直接条件的 `JumpToAction`。来源加载、动作遍历和目标引用证明继续由入口注入。主入口进一步降至约 8,520 行，当前最大函数仍为 187 行。
- 新增 `damage_step_compiler.py`（约 612 行），集中旧式直伤/单投射物编译、通用 `DamageUnit` 顺序、动态黑板倍率、固定伤害、失衡、稳定步骤 key 和递归投射物省略校验。技能资源、Buff 和数值辅助编译仍由入口注入。主入口进一步降至约 8,095 行，当前最大函数仍为 187 行。
- 新增 `buff_application_compiler.py`（约 377 行），集中单 Buff 应用、集合目标生命周期、内联事件/定时序列和固定单敌人 Aura 归约；浮空 Aura 特例仍保留原严格载荷校验。目标证明、动态操作数和内联行为由入口注入。主入口进一步降至约 7,875 行，当前最大函数仍为 187 行。
- 新增 `skill_source_builder.py`（约 245 行）与 `audit_report_renderer.py`（约 166 行）。前者只按固定顺序装配 SkillData、SkillPatch 和各来源解析器，后者只投影递归审计事实、统一调度和完整性问题；两者均不新增语义规则。主入口进一步降至约 7,673 行，当前最大函数仍为 187 行。
- 新增 `operator_definition_renderer.py`（约 177 行）与 `generation_pipeline.py`（约 235 行）。前者渲染正式干员定义，后者承载逐干员阶段分流、Buff 依赖闭包和文件输出；兼容入口的 `main` 只剩服务装配调用。主入口进一步降至约 7,441 行，当前最大函数为 131 行，已不存在巨型函数。
- 伤害步骤来源 key 与执行签名分离：折叠后保留成功侧稳定 key，audit 仍保留原始双分支；不同参数、步骤或顺序的分支不会合并。
- 全量重新生成后，正式/审计技能 TS 中直接 `sequence(sequence(...))` 从 99 处降为 0。Rossi 运行定义由上一轮 160.2 KB / 4,135 行 / 78 分支继续降到约 130.4 KiB / 3,534 行 / 58 分支。
- 当前结构重构已达到 checkpoint：45 个 Python 模块之间共有 163 条内部依赖边，静态审计未发现循环；已提取后端均不反向导入兼容入口。仅 `audit_all_operators.py`、`audit_recursive_mechanisms.py` 两个命令行工具和 3 个兼容测试继续消费主入口再导出。`OperatorDefinitionRendererServices` 与 `GenerationPipelineServices` 合计 33 个回调均有实际调用，没有无意义接口。当前不再为行数机械拆分，下一步应形成重构 checkpoint 提交，再回到首个可闭环的真实动作缺口。

### 条件减速动作

- `keyword_action_parser.py` 暴露可复用的 `parse_keyword_action`。
- 条件分支可保存和编译 `SlowAction`。
- 能力实体的条件调度保留编译器内部目标组证据，使子 SkillData 中的 `Context/tar` 能正确解析。
- 条件减速编译为内联高优先级 `buff_common_affixes_slow`。
- 编译器内部的 `localTargetGroupWrites` 不进入生成产物和审计文件，避免无意义膨胀。
- Fluorite 的减速已恢复为 3 次：根动作第 10 帧，以及潜能 3 以上时根时间第 99、159 帧；顺序保持原生伤害后施加。

对应提交：`1237b4d4 feat(next): compile conditional slow actions`。

### 时间膨胀目标

- 根技能 Action 中的 `Source` 和 `Owner` 映射为施法者，符合来源语义。
- 全量审计从 299/268 个已解析/已编译技能提升到 301/270。
- 技能主体零特殊缺口干员从 8 名提升到 9 名，大潘 9/9 技能闭环。
- 诀的连携继续停在“能力实体时间膨胀目标”缺口。不能静默忽略，因为它可能改变子实体命中帧。

对应提交：`f75ee096 feat(next): resolve source time dilation targets`。

### 大潘正式接入

- 在 `scripts/generate_next_operators/operators.json` 中增加 `chr_0018_dapan` 配置。
- 生成 9 个技能：四段普攻、处决、下落攻击、战技、终结技、连携技。
- 战技费用、终结技能量与冷却、连携冷却、处决条件和处决回能进入生成结果。
- 明确保留未建模项：两个天赋、部分潜能、处决免疫 Buff、终结技免伤 Buff。技能主体可完整转换不等于养成和保护效果全部闭环。
- 新增稳定入口 `src/next/data/operators/da-pan.ts`，并注册到 `nextGameDataRepository`。
- 生成与注册测试已覆盖大潘。

### 事件空操作与嵌套时间膨胀

- 洛茜终结技的 `OnSkillEnd -> FinishBuffAdvanced` 已确认使用空 ID 列表；原生实现不会调用 Buff 容器，因此只省略这一种可证明的空监听器。非空列表和其他事件仍严格阻塞。
- 根时间轴与条件分支共用时间膨胀动作解析器。条件分支中的动作留在原成功/失败序列中，不会被提升成无条件调度。
- 洛茜第三段连携和卡缪重击已越过嵌套时间膨胀阻塞。定时标记的 `Target` 也会在已证明输入为唯一敌人时复用统一目标归约，艾尔黛拉终结技已越过该阻塞。技能根时间轴的直接序列守卫按“用户已排入的技能必然执行”视为已通过；内部 `ForEach`、分支、引导和事件序列仍保留动作帧短路。Mifu 连携因此越过根距离守卫阻塞。`ForEach` 局部短路只会在容器直接遍历技能输入 `Target` 时取得所有权；此前 308 个技能审计中的 4 个真实直接守卫样本全部遍历 `Context` 能力实体组（Avywenna 3 个、Tangtang 1 个），不能把循环当前目标近似成敌人，因此继续严格阻塞。Avywenna 投射物子技能中的 `CharacterTeamFinder + MainCharacterValidator` 时间膨胀排除结构已支持独立 `controlled` 身份，并会在动作执行帧通过场景控制时间线解析，但父技能仍先停在长枪能力实体距离守卫。当前配对快照的全量审计为 312 个可解析、280 个可编译技能，完整干员 10 名。
- `CheckEnemyRank` 已在当前工作树闭环：桌面 VFS manifest 451359 已提取当前 82 个敌人的 `EnemyTemplateData.rank`，反编译确认枚举值与 `EnemyRankSet` 位掩码，并接入敌人定义、项目实例、编译、运行时条件和生成器。完整依据见 `docs/research/enemy-rank-evidence.md`；不得改用五档展示 `tier`。
- 能力实体已按“距离恒为 0、范围查找覆盖全部实例、敌人唯一”的项目约束建立极简模型：桌面 VFS manifest 451359 中解析出 54 个模板，另有 Liino 的 `abilityentity_chr_0035_liino_ult_skill_projhit` 明确缺失，不会补造。场景持有统一逻辑目录，实例保留模板、owner/source/target、GameplayTag、时长、子技能身份和黑板，并参与帧推进、来源死亡和结束回执。
- 1.4.4 `GameAssembly.dll` 的 `SetAbilityEntityDuration.ExecuteInternal` 已直接证明：`setMultipleTarget=false` 经 `GetActionTarget` 只应用一次，`true` 才经 `GetTargets_Dispose` 枚举整组。生成器据此只对有此前确定逻辑生成证明的命名 Context 建立 0/1 单例来源，并复用 `forEachContextTarget`；未知或多实例键继续失败关闭。递归能力实体迁移曾把 Li Zhiyan 战技此前漏检的子技能 `Owner -> Target` 距离条件暴露出来，使严格审计短暂从 280 降至 279；当前实体与唯一输入敌人均有执行身份，因此该条件现按统一零距离模型折叠，战技恢复完整严格编译，而不是重新隐藏子图。连携技的 `trigger` 在第 0 帧由完整 `if / else if / else` 三路写入：两路分别合并 `smart_target` 与 `MainTarget`，末路先用 `CharacterTeamFinder + MainCharacterValidator` 找到主控，再以禁用导航采样、无校验/后处理的 `FixedPointFinder` 产生位置。生成器会穷尽二元分支并验证每条路径的最后写入非空，因此直接保留后续 `Context/trigger >= 1` 的成功分支；位置目标仍不满足“唯一敌人”谓词，也不会生成 `singleEnemyPresent`。诀（`arcane`）现已达到 11/11 严格技能入口可编译。
- 能力实体 `TimeDilationAction.effectTargets` 已从源解析阻塞改为类型化审计：保留 owner-spawned 与可选 GameplayTag 查询。生成器现在可用 54 个模板的 born-tag 与引用文件证据证明单标签查询闭包，并要求全部匹配生成点都有逻辑实体、带战斗动作的子图均使用动态时钟。Li Zhiyan 连携的 `-1480463572` 只匹配本技能封印模板，四个生成点均闭合，已生成正式 `abilityEntityTargets`；Tangtang、Yvonne、Liino 的查询仍在各自证据边界失败关闭。
- `spawnAbilityEntity` 已贯通 DSL、严格校验、编译、标准模拟和生成器。正式生成产物目前覆盖 Arclight 终结技、Gilberta 战技/终结技、Lifeng 终结技；庄方宜审计产物也保存了对应步骤。DSL/编译器/运行时可在生成步骤内携带已解析子时间轴；每个实例独占游标，复用统一序列解释器，以实体黑板为回退，并消费与寿命相同的实体局部时间。生成器已把 Arclight、Gilberta 的严格子图，以及庄方宜普攻二/四的固定周期子图和普攻五的伤害/回能/黑板修改，原子迁入局部时间轴并删除父时间轴投影；原生 `assignBlackboard` 会先复制生成动作黑板，再应用显式实体赋值。Lifeng 终结技仍生成逻辑实体，但其子时间轴因新发现的条件跳转已退出内嵌，暂留父投影；该回退不代表跳过语义已经模拟。
- 子时间线直接 `FinishOwnerAction(Owner)` 已经按原生 RVA `0x06CF5E28` 的目标解析证据接入统一实体目录。运行时允许子技能结束自己的宿主并对称收尾；生成器只接受字段精确的 plain Owner 形状，保留但不解释 `skipDieDisplay`，同帧等价结束去重。庄方宜普攻二、四、五的审计输出新增局部帧 897 结束。条件结束仍未闭环；Buff 生命周期结束只开放下述 Gilberta 严格组合。
- 能力实体 Buff 的运行时所有权桥已接入：`currentAbilityEntity` 目标只允许出现在已有实体作用域内；首次施加时惰性创建标准 Buff 容器，与子技能共享实体黑板并消费该实体的四路时钟，宿主结束时统一清理。Buff 生命周期上下文保留同一实体句柄。Gilberta 战技的 `buff_chr_0013_aglina_normal_skill_monitor` 已作为首个真实 Owner-Buff 严格迁移：只接受字段精确的 `OnBuffTrigger -> CheckHp(Source ratio <= 0) -> FinishOwnerAction(Owner)`，每 0.15 秒查询已登记的来源死亡事实并结束宿主。标准装配回归直接编译真实生成技能、使用正式实体模板，并验证 cast identity、Buff 周期、来源死亡通知、宿主清理和 `sourceDied` 回执的完整链路。标准玩家伤害环境现为已解析面板的干员建立初始满血账本，供治疗与生命条件读取，但不会猜测或自行制造受击/死亡；Yvonne 与 Li Zhiyan 的复杂 Owner-Buff 仍因未建模动作/Aura 失败关闭。
- 桌面 `GameAssembly.dll`（SHA-256 `0C5573679BC6DEC2D068A14335466DB7CCF20AF9BAE2B983FB9D45677D80FFCE`）的静态反汇编进一步确认：`FinishOwnerAction.ExecuteInternal` 解析目标后按 Entity `ObjectType` 分派；`AbilityEntityInfo.type` 原生返回 `0x200`，走通用完成路径，而不是 `0x20` 的 Release 或 `0x40` 的投射物路径。Fluorite 表面上的 90 帧结束后仍有 149 帧伤害并非反证：子技能在 0–89 帧还有两条 `JumpToAction`，分别以目标死亡跳到 89、目标持有终结技 Buff 跳到 149，两个结束属于替代路径。Lifeng 终结技也在局部 67 帧以 `isCombo == 0` 跳到 150，跳过后续 121 帧动作。`JumpToAction` 在首次执行时立即检查直接条件，此后在动作存续期间每 Tick 重试，首次成功后置位并只调用一次宿主 `Skill.JumpTo`；空条件立即成功。原生 `TimelineActionProcessor.JumpTo` 对起始时间严格早于目的帧的待执行序列调用 `SequenceAction.JumpToEnd`，后者逐个把尚未执行的子 Action 标为结束；已开始且结束时间不晚于目的帧的序列会 End（动画序列另有下一帧完成队列），跨越目的帧的活动序列保留，起始时间恰等于目的帧的序列不被跳过。原生 `TimelineActionProcessor.OnTick` 还确认 `m_jumpedInThisFrame` 会立即终止本帧内部处理，目的帧动作在下一 Tick 进入。Next 现有统一 `jumpTimeline` 控制步骤：首次执行检查可选条件，失败后在区间内每 Tick 重试，成功只请求一次；普通技能和能力实体子技能均通过宿主端口改写各自局部帧，并由支持执行中重入的 `TimelineActionProcessor.jumpTo` 迁移调度游标。当前 1.4.4 公共 SkillData 共找到 436 条跳转、其中 413 条启用；297 条没有直接条件，其余条件和外层容器形状很多，不能用两个干员样本概括。生成审计现保留精确 `actionPath`、结构化直接条件、解析支持状态以及根/分支唯一动作证明。生成器对直接根跳转只放行“唯一根动作 + 精确根路径 + 前向目的地 + 全部直接条件可编译 + 每个目的区段显式结束”的子集，Fluorite 两条跳转满足该证明。外层 `IfElse` 成功分支跳转则要求根容器和成功分支各自唯一、跳转直接条件为空、外层条件可编译且路径精确关联；它被生成成同帧一次性 `conditional -> jumpTimeline`，先求值跳转，失败时才执行原失败分支，不能扩展成逐 Tick 重试。Lifeng 已命中该证明：第 58 帧生成实体，局部保留 6/66/121 帧伤害和 67 帧失败写入，父时间轴 64/124/179 帧固定投影已删除。线性子图的首结束守卫继续保留，跳转子图则逐目的区段验证终止性；Lifeng `ultimate` 的其他显式行为缺口仍保留。
- `OwnerSpawnedEntityFinder + TagValidator` 的 Context 来源证据仍完整保留。统一 `findOwnerSpawnedAbilityEntities` 步骤已经能够按当前干员和原生标签查询逻辑目录，把完整组写入本次施法 Context，并可把数量写入动作黑板复用现有比较条件。Avywenna 三组长枪与 Tangtang 水体四个守卫仍需实体目标 Buff、投射物来源和生成器转换，不能提前宣称闭环。完整盘点见 `docs/research/ability-entity-context-target-audit.md`。
- Context 组现在可按稳定句柄同步迭代；body 通过显式 `currentTarget` 读取、比较或 `Assign` 有限剩余时长。若 body 返回 false，运行时会因原生跨实例短路规则尚未证明而显式失败，不能猜测继续/终止。原始语料共有 10 个时长设置、2 个当前时长检查和 1 个目标设置；当前只接入全部已观察时长动作共有的 `Assign` 子集，目标设置仍阻塞。
- 同一桌面 `GameAssembly.dll` 的进一步反汇编已确认 `TimeDilationAction` 的 Entity 分支逐个解析 `effectTargets` 并调用 `StartEntityTimeDilation`，实体实例逐帧把曲线倍率安装到目标 Entity。Next 时间膨胀运行时已将局部目标泛化为稳定实体 ID，能力实体有限寿命和已内嵌的子技能时间轴都会消费 `ability-entity:<instanceId>` 对应的实体倍率，并有标准装配回归覆盖。两个正式生成子图已迁移，但 owner/tag 目标可跨技能选中尚未迁移的实体；在建立干员级全生成点证明前，Entity 目标阻塞保持不变。
- 全局/终结技时间动作原本还会在 `ignoreTargets` 排除 owner-spawned 或命名 Context 中的能力实体；过去丢弃这些目标没有运行时影响，但能力实体开始消费时间后会造成错误减速。生成中间层保留原始查询，生成期再由模板 born-tag 证据解析为明确实体 ID；正式 DSL/执行器只解析 owner/实体 ID 或 Context 稳定句柄并加入全局排除集合。Entity 作用目标复用同一查询协议并有装配测试，未获闭包证明的目标仍拒绝输出。

### 模拟快照、性能审计与冻屏拖动

- 单次模拟的场景输入和完整运行结果现在组合成一个 `PublishedScenarioSimulation`。新模拟在局部数据中构建，成功后一次性替换已发布快照；等待和失败期间继续展示上一份完整结果，不再分别更新效果条、命中与诊断，也不在模块级全局变量中保存某次模拟的中间信息。
- 模拟服务记录编译、预检、运行和投影等阶段的墙钟耗时；时间轴底部新增实时性能审计，可查看最近样本、阶段占比、预算超限和最慢阶段。该审计衡量的是编辑交互路径的实际耗时，不改变战斗规则。
- 技能块拖动期间持续节流模拟，但视觉位置不等待模拟回执。此前实时投影硬限制为每 100ms 一次（约 10Hz），导致技能块逐指针事件移动而其他模拟投影明显跳动；当前已提升为约 30Hz，并在每次新拖动的第一次有效位移立即触发，不继承上一轮节流窗口。主块实际起点直接跟随鼠标；由该技能产生的时间膨胀投影按同一实际位移即时平移，松手后保留预览，直到对应场景的新模拟快照原子发布，避免旧回执导致回弹。视觉语义已与旧版对齐：常态只在来源技能块内显示从左侧开始、按持续量裁剪的流动动画；悬停来源块或选中一个/多个来源块时，才在全部轨道纵向展开对应真实起止区间的黑色阴影，并在中央显示持续秒数。
- 技能放置、拖动、外部事件、控制切换和模拟范围统一使用实际战斗帧。时间膨胀只改变各对象每帧消费的 `default/global/self/cooldown` 等局部增量，不存在可供整场编辑使用的统一“逻辑时间”。拖动直接把鼠标实际帧写回 `placement.startFrame`，前置或自身时间膨胀都不能移动后续技能块。
- 当前自动测试覆盖实际帧拖放、旧投影保留、原子发布，以及全局时间膨胀期间后续输入仍在声明的实际帧触发；仍需在 `/next/timeline` 手工复验 Arclight 终结技阴影跟手、松手不回弹及后续技能块位置不变。

## 5. 最新验证基线

当前验证结果：

- Python 生成器规则测试最近基线：327 项通过；敌人 rank 提取器测试：2 项通过；能力实体提取器测试：2 项通过；
- 桌面已从 AKEDB 下载当前 `1.4.4@9433094-12` 五张 TableCfg，以及 2026-08-15 `sharedRevision` 公开清单中的 2459 个 SkillData、2678 个 BuffData；两者与 manifest `latest` 配对。当前严格全量审计基线为 30 名、320 个入口、317 个可解析、281 个可编译，零专用声明直转 11 名。诀（`arcane`）已作为 `outputStage: audit` 的 11 技能样本生成三份审计产物，但尚未生成或注册正式 `OperatorDefinition`。`seal_total -> seal/listener -> 隐藏结束技能` 的 Buff 所有权、事件响应和本地时间线已经闭环；当前无敌方主动行为模型中 `InterruptAction` 归约为不阻断后续动作的零效果。`EntityBB_wisd_greater_will` 面板桥也已由基础被动自动生成并接入共享实体黑板。两个原生终结技入口的稳定身份也已有严格证据：首段 Buff 把 `UltimateSkill` 换成二段，二段第 0 帧换回首段；诀在 manifest 明确声明 `arcana` 为运行时替换形态后，生成器才把闭环关系渲染为双向 `changeSkillSlot` 并在正式技能组使用 `replacementSkills`。普通/强化技能默认仍是可直接拖放的独立稳定技能组，不能从原生换技动作自动推断为不可放置形态。当前诀的干员级阻塞转为形态展示、形态感知连携注册与天赋潜能对照。
- `npm.cmd run type-check:next`：通过；
- 能力实体模板、目录、操作执行器和场景装配聚焦测试通过；新增步骤引起的庄方宜契约与三语言帮助文本回归已覆盖。
- 本文更新前 `npm run type-check:next` 通过；Next 全量 Vitest 为 178 个文件、1126 项全部通过。新增回归覆盖对象局部时间推导的技能实际宽度与命中点、块外延迟命中、命中详情稳定身份与旧版式结构、未决宽度判定、零宽展示技能边界、时间膨胀实际区间裁剪，以及既有 Buff、资源、状态、能力实体和干员转换链。
- 全仓 `npm test -- --run`：249 个文件中 244 个、1536 项中 1528 项通过。8 项失败均位于旧版：`TimelineEditor.structure` 3 项、`SimLogPanel.structure` 1 项、`statusOptions` 1 项、`patchSkillLeveledCap` 2 项、`simulator` 1 项；本轮没有为通过这些断言而修改旧版代码。Next 全量通过不能替代这条全仓结论。

测试数量只代表既有断言通过，不代表所有游戏机制已经得到证明。

## 6. 当前生成器状态

目录：`scripts/generate_next_operators`。

生成目录中，除首个佩丽卡样本外，已有九名输出正式定义并注册的干员：Arclight、Gilberta、Lifeng、Estella、大潘、Akekuri、Fluorite、Endministrator、Last Rite。正式输出不等于该干员 `conversionSupport.complete`；Endministrator 与 Last Rite 仍明确携带技能行为、天赋或潜能缺口。

当前生成器已经能够处理：

- 根 Action 与递归 Skill/Buff；
- 原生 Sequence 的分组和顺序；
- 常见伤害、失衡、附着、资源、状态和条件步骤；
- 技能费用、冷却、部分潜能/天赋与静态属性；
- 条件 Buff 伤害修正和条件 SlowAction；
- 根技能 `Source/Owner` 时间膨胀目标；
- 可严格归约的根 `SpawnAbilityEntity`，包括模板、子技能、目标、动态覆盖时长、Context 输出与数值实体黑板；
- 严格审计、显式缺口与生成产物校验。

仍不得伪装为已支持的关键内容：

- 其余能力实体子图的动态所有权迁移、干员级匹配生成点证明，以及证明完成后的实体时间膨胀目标正式输出；
- FractureAction 的完整运行时链，包括层数、消耗、前后物理附着事件、破甲 Buff 和伤害；
- 尚会被旧根解析器展开的内部 SequenceAction 守卫尾部，需要显式消费身份后才能迁入局部短路；
- 隐藏技能、复杂 Buff、混合养成载荷及无法从数据稳定推导的例外。

## 7. 下一步建议

下一会话应先重新确认工作树和提交。能力实体内联重构已经完成，后续不再扩展或恢复 `templateId` 前端、编译或运行时接口：

1. Last Rite 普通战技已经完整穿过生成、场景编译和生产模拟；下一项不再扩展这条已闭环链，而是逐项审计庄方宜与诀仍处于 `outputStage: audit` 的干员级缺口。诀优先核对形态展示、形态感知连携注册、天赋和潜能；庄方宜继续以首个未闭环来源动作为准。任一层未闭环都不能把审计产物提升为正式定义；
2. 后续若出现新的集合 Buff，必须复用已建立的来源施法、当前创建来源和实际宿主三重身份：施法快照定位原程序，干员宿主优先成为执行主体，敌方/能力实体上的后代 Buff 则由当前创建来源干员归因；不得重新把三者压成单一 caster；
3. 扩大能力实体子图动态迁移的严格覆盖，并为原生 owner/tag 查询建立干员级匹配生成点闭包；查询只在生成期使用标签证据，只有闭包内所有生成点都已迁移时才输出实体 ID 形式的 `effectAbilityEntityTargets`；
4. Endaxis 的敌人永久按木桩处理，不建立敌方技能、攻击或动画时钟，也不自动产生玩家受击。外部事件只用于正常技能/Buff/资源/治疗等操作链客观无法产生的事实；硬依赖敌方主动行为的原生监听器可由用户在时间轴上显式放置最小“干员受击”事实。没有标记时监听器保持注册但永不触发，不能仅因标准场景没有事件生产者就把干员判为转换不完整。若真实消费者要求伤害标签、特征或数值，必须先取得载荷证据再扩展标记，不能猜测；无法表达且不影响主动输出链的敌方行为允许明确放弃；
5. 在 `/next/timeline` 手工验收实际时间编辑和能力实体递归编辑：新增或移动 Arclight 终结技不得改变后续技能块的位置，阴影同步移动且松手不回弹；`Pulse` 的 `SkillSetting` 必须等原生导出证据，不做默认值；
6. FractureAction 必须等完整操作链和运行时语义齐备后再接，不做只解析名称的半成品；
7. 以后公共 JSON 的 `sharedRevision` 改变时必须重新确认 manifest `latest`，不得与旧表混用。

治疗正常链已经接入：`heal` 步骤由施法者四维属性、倍率和加值计算，按执行帧解析主控或最低生命比例目标，写入场景级干员生命账本，并在满血时仍记录原始治疗量、实际治疗量和溢出治疗。Ember 连携与 Gilberta 战技/连携已从 `unmodeledActionTypes` 退出；Gilberta 外层 `explo >= 2` 在唯一敌人模型下严格折叠为假，因此对应分支虽完整保留在生成定义中，标准单敌人场景不会触发。外部受击事实不是治疗动作、快照或回执成立的前置，也不应为展示治疗而扩展。

根技能条件树中的旧式 `FinishBuffAction` 已复用正式 `finishBuffsById` 链：只接受非空 ID、关闭来源限制、plain Source 来源/结束来源，以及可严格归约为施法者或唯一敌人的 Owner/Target。Pogranichnik 连携、Xaihi 战技和 Mifu 二段战技由此转为可编译；Mifu 三段继续停在 `CheckTwoDirectionAngle`，不能借零距离模型猜测方向。Mifu 连携的 `StoreAttributeValue(MaxHp/FinalNonConverted)` 现由场景把 resolved panel 的 `maxHealth` 写入共享实体黑板，并在动作帧复用 `calculateActionValue` 写入本次释放黑板；它不把具体构筑生命值固化进生成产物。最新严格全量审计为 317/320 可解析、281/320 可编译、11 名零专用声明直转；Liino 非乘属性治疗公式被新严格 parser 暴露为解析缺口，解释了统计相对旧快照的下降。

本轮已从 AKEDB `latest=1.4.4@9433094-12`、`sharedRevision=2026-08-15T09:56:33.735394+00:00` 拉取五张版本化 TableCfg、2459 个 SkillData 和 2678 个 BuffData。当前验证为 manifest 全量生成与 `--check` 通过、Python 规则测试 305/305、Next 类型检查通过、Next 全量 Vitest 177 个文件 1058/1058。普通/强化技能仍是可直接拖放的独立技能，只有 manifest 明确声明的 `arcana` 走运行时换槽。

Arclight 战技的 `OnBuffEnhanceChanged` 已闭环：静态面板四维进入共享实体黑板，严格的 `StoreAttributeValue(FinalNonConverted)` 生成黑板计算，叠层达到阈值后按智识计算 `pulse_up`，给全队施加限时 `electricDamageIncrease`。原生 `isConvertedAttribute=true` 不再作为未知载荷丢失，而是保留 `converted` 修正来源；运行时伤害快照会叠加 Buff 产生的动态伤害属性。`buff_common_vfx_char_atk_up` 仍保留在 audit；生成器现保存 stack effect 动作类别，并且只有定义完整证明“唯一行为是非空 `EffectAction` stack effect”时才自动从战斗序列剔除，不能按 ID 或命名泛化。条件分支中的 `buff_common_obtain_ultimate_sp` 复用现有“按技能消耗为全队回终结技能量”步骤，不内联成空 Buff。

`SetSkillCdAtOnce` 已从仅支持条件分支中的比例减少，扩展为根时间轴与条件树共用的严格动作：`Reduce + percentage` 继续按基础周期比例扣减，`Set + percentage` 直接设置为基础周期比例，`Set + absolute` 按秒设置；没有证据的绝对值减少仍拒绝。运行时可把目标技能冷却设为 0 或完整基础周期，技能编辑器也能创建和编辑技能类型/技能 ID、操作、基准和动态值。Rossi 连携技 2 的条件清零与连携技 3 对二段连携的完整周期重置因此均进入通用 DSL，使 Rossi 从 9/11 提升为 11/11，并成为第 12 名零专用声明完整直转干员。最新严格全量审计为 317/320 可解析、283/320 可编译。`FractureAction` 仍按既有证据边界阻塞，没有用空间简化替代破防层、事件、碎甲 Buff 和伤害链。本批验证为生成器 307/307、manifest 全量 `--check`、Next 类型检查，以及 Next Vitest 178 文件 1061/1061 全部通过。

能力实体 Context 的下一批横向消费已闭环：`ForEach Context` 与 `CreateBuffAction target=Context` 不再仅凭键名假设对象身份，而是要求读取点之前存在支配性的 `OwnerSpawnedEntityFinder + AbilityEntity + TagValidator` 写入；`PriorityFilter` 可缩小集合但不改变对象种类，因此仍可逐稳定句柄进入 `currentAbilityEntity` 作用域。根调度和条件分支共用该证明。固定 `Target/MainTarget` 上的残留 `targetGroupKey` 按原生读取规则忽略，`Context/smart_target` 保持唯一敌人身份；`CharacterTeamFinder + MainCharacterValidator` 即使挂在 `Source` 引用上也按 finder 语义解析为主控干员治疗目标。能力实体局部动作的 `buffSource=ActionOwner` 现保留为 `source: currentAbilityEntity`，运行时从当前稳定句柄解析来源 ID；Camille 战技投射物命中后的蝙蝠生成、实体 Owner/Target Buff、伤害与附着因此整体迁入局部时间轴。Ardelia 下落攻击、Yvonne 终结技收尾及 Camille 三个技能新增严格编译，Camille 达到 12/12；全量审计提升为 317/320 可解析、288/320 可编译，完整干员增至 13 名。Avywenna 三组长枪及 Tangtang 水体的 Owner→当前实体距离守卫已在已证明的遍历作用域中按零距离折叠；Avywenna 下一阻塞是命中/到达双事件且含条件伤害、Buff、回能和时间膨胀的复合投射物子图，Tangtang 下一阻塞是条件 `SpawnAbilityEntity`，两者均未被近似丢弃。Laevatain 的 `tar >= 1` 来自带 GameplayTag 过滤的敌方 HitBox 查找，标签可能让唯一敌人落空，仍保持阻塞。

下一批横向覆盖把 Buff 来源 `ContextTarget/smart_target` 复用到统一单敌人身份归约，Yvonne 战技由此严格编译。治疗 DSL 新增原生 `DefiniteValueCalculation` 的直接治疗量分支：编译、校验、运行时和编辑器均不读取虚构属性，Liino 连携的 `final_heal_value` 可以从动作黑板进入主控治疗。该技能仍被无标签 owner-spawned AbilityEntity 时间膨胀阻塞，因为查询可能命中此前技能留下的任意实体，不能偷换成当前技能生成物。严格审计现为 318/320 可解析、289/320 可编译、13 名完整直转。`FractureAction` 也再次核对并保持阻塞：它不只是空间击退，还包含破防层、前后事件、碎甲 Buff 与伤害链，零距离模型不能把整项当作无效果。

Liino 强化战技的补丁表重复键已核对：全表仅该技能的 12 个等级出现重复，且每级都是两条完全相同的 `music_trigger=3`。生成器现只去重同键同值，异值重复仍失败。去重后，普通战技与强化战技都停在同一真实阻塞：长区间 `TickIntervalAction.executeEachFrame=true` 每帧执行 `StoreCurSkillExecuteFrame -> music_loop`，再除以 `frame_radio` 写入 `normalskill_frame`，普通战技随后把该值传给额外攻击 Buff 的 `music_frame`。因此它不是可忽略的纯表现循环；下一步应增加读取当前技能/能力实体局部帧的通用动作和逐帧执行容器，不能把 1646/1801 帧静态展开或冻结成生成时常量。

上述 Liino 共用缺口现已闭环。1.4.4 `GameAssembly.dll` 中 `StoreCurSkillExecuteFrame.ExecuteInternal`（RVA `0x06D38C10`）证明原生读取 `durationTimer.passedTime`、乘 30、经 Unity 整数舍入后同时写入 float/double 黑板，而不是保存连续小数秒。Next 新增宿主局部整数帧读取与 `repeatEachTick` 区间容器，普通技能和能力实体子技能共用同一运行时协议；区间不再静态展开。全量严格审计因此达到 320/320 可解析、289/320 可编译、13 名完整直转。Liino 普通战技的新首阻塞是 `AuraAction`，强化战技的新首阻塞是技能事件 `OnAddedBuff`，二者均不得为提高编译数而省略。

Liino 普通战技的直接敌方 Aura 已按项目零距离、唯一敌人模型闭环：生成器只接受根时间轴上的 `GlobalAura/RangedAura`、plain Owner、自动敌对阵营且没有对象/槽位/标签过滤、没有进出区域动作的严格形状；开始帧向唯一敌人施加内联 Buff，结束帧通过动作持有的精确实例句柄结束它，不会按 Buff ID 误删其他来源实例。递归或条件 Aura、BuffData Aura 与带额外生命周期载荷的形状继续失败关闭。严格审计保持 320/320 可解析、289/320 可编译，但若干技能的首阻塞已从 `AuraAction` 推进到真实事件监听器；Liino 普通战技当前是 `OnTrulyExitFight`，强化战技仍是 `OnAddedBuff`。

技能 `OnAddedBuff` 正常事件链现已闭环。Buff 目标只在实例实际创建成功后发布 `buffApplied(targetId, buffId, sourceId)`；全场语义总线按实际宿主把事件路由到技能区间监听器，原生 `CheckBuffIdInContext(Id + HasAny)` 编译为 `eventBuffIdMatch`，后续 Buff 创建、结束、冷却设置和跳转仍保留在原响应树中同步执行。编辑器可直接选择该事件并维护 Buff ID 条件。Endaxis 固定时间轴没有进入/脱离战斗状态，故 `OnTrulyExitFight` 响应只留在 audit，既不注册也不被提升为无条件清理。Liino 普通和强化战技由此均严格编译，最新全量审计为 320/320 可解析、291/320 可编译、13 名完整直转。

达坂第一天赋的剩余阻塞已经关闭：原生反编译证明百分比冷却减少使用技能配置的基础周期；旧式 `FinishBuffAction` 按已证明的 Id、目标和来源限制进入统一 Buff 结束操作。`OnOutputDamage -> 减少连携技冷却 -> 消耗准备层 -> 结束自身` 已完整参与模拟，达坂 9/9 生成。Endministrator 的三类 `igniteEventAction` 已形成内联 Buff 响应，`IgniteAction` 从技能生成 `igniteBuffs` 并携带实际点燃来源；生产场景已验证连携创建冻结、终结技直接/条件/点燃伤害和冻结结束处于同一次运行。Last Rite 普通战技也已关闭原子阻塞：`main_start -> self -> party main Buff` 完整内联，队伍实例以实际宿主执行主控/标签/黑板条件，同事件同优先级响应在一个注册回调内保持独立短路，敌方分身 Buff 以当前创建来源干员执行伤害并保留原始施法快照。manifest 已移除 `main_start/self` 的 `unmodeledBuffIds`，双轨生产回归验证队友末段普攻触发的分身伤害和元素附着均归因到队友。当前 manifest 全量生成通过：佩丽卡及另外九名干员生成正式定义，庄方宜与诀保持审计阶段；`tmp/` 未纳入修改或提交。

选择原则：优先能够从数据到生成 DSL、编译、运行时和测试形成闭环的机制，而不是单纯增加解析计数。

### 2026-08-19：主动浮空事实与陈千语连携闭环

- 陈千语连携的 `OnBeforeOutputAirborne` 已核对为技能自身 Aura 内部 `AirborneAction` 的同步前置事件，不是伤害装饰位，也不是敌人主动行为或外部事件。Aura 随后执行的 `DamageAction` 仍由既有递归命中解析器独立投影。
- Next 新增极小 `outputAirborne(target)` 步骤与 `airborneOutput` 语义事件。它记录来源、目标和 `AirborneOutput` 回执，并在同一动作序列继续前同步派发监听器；木桩模型不保存位移、高度、朝向、动画或控制状态。
- 生成器只接受当前已证明的严格形状：根时间轴 `RangedAura`、plain Owner、唯一敌对目标、每目标最多一次、直接 `AirborneAction -> DamageAction`，以及陈千语原始浮空载荷。监听响应继续复用正式 `adjustSkillCooldown`，`Source` 在根技能事件上下文中严格归约为施法者。
- 编辑器可创建和编辑浮空输出目标，也可选择浮空输出监听事件。全量审计提升为 320/320 可解析、292/320 可编译、14 名完整直转；陈千语达到 10/10。
- 本轮门禁使用 `type-check:next`。全仓 `type-check` 当前被笔记本带回的旧版既有类型错误阻塞，未修改旧版代码来消除它们。

### 2026-08-19：事件响应内跳帧

- Catcher 普通战技此前报告“事件响应动作树为空”是 parser 缺口，不是原生空监听。两条响应分别由 `OnBeforeTakeDamage` 与 `OnAddedBuff` 进入，守卫通过后执行 `JumpToAction(destFrame=60)`；中间的 `ConvertToTargetContext(Attacker)` 在当前响应中没有后续 Context 消费者。
- `JumpToAction` 现只在事件有序序列入口作为 `jumpTimeline` 叶子解析，普通技能时间轴继续使用已有专用跳帧投影，避免重复调度。运行时回归证明事件同步回调能够改写宿主技能局部帧。
- Catcher 普通战技的新首阻塞是主动技能分支里的 `CheckTargetAngle`。方向角不由零距离假设决定，继续失败关闭；全量统计保持 320/320 可解析、292/320 可编译。

条件 Aura 已接入与根 Aura 相同的精确实例生命周期。生成器按条件叶子的完整 `actionPath` 绑定独立解析的 Aura 载荷，保留分支身份，并把外层原生 Sequence 的结束帧交给 `finishByAction`；未走中的分支不会创建实例，结束时也不会误删其他来源的同名 Buff。固定零空间范围现在同时支持无筛选敌对目标（唯一敌人）和无筛选友方角色（全队）。Snowshine 普通战技的减伤 Aura 与潜能监听 Aura 已穿过该层，首阻塞推进到后续 `CheckTargetAngle`；方向仍不由零距离假设决定。严格审计保持 320/320 可解析、292/320 可编译、14 名完整直转。

- 本地 AKEDB SkillData 一度出现多份截断 JSON，已重新下载并验证 2459 份文件全部可解析后才重跑审计。

### 2026-08-19：陈千语、洛茜、卡缪正式样本接入与时间域边界

- 生成 manifest 新增陈千语、洛茜、卡缪，分别生成 10、11、11 个技能并注册到默认 Next 数据仓库；正式生成定义现为 13 名，仓库显式干员入口共 15 名。三个样本都保留 `conversionSupport`，不能因“生成成功”写成整名干员完整转换。卡缪 `normal_skill_2` 原始时间轴只有语音，战斗职责是通过 `switchToBuffConfig` 路由到强化连携；它不作为空技能块注册，用户直接拖放真实的 `combo_skill_2`。
- 陈千语技能主体 10/10 已闭环；当前缺口只有两个 `attachBuff` 天赋及潜能中的未闭环养成载荷，`skillBehavior` 不应因为玩家侧伤害免疫被误报。
- 洛茜正式样本保留真实缺口：战技/两段连携共用的 `normal_defup` 同时含玩家侧防御修正和周期输出，不能整体按免伤无效果省略；战技条件流血、二段连携持续伤害的裸 `Target` 来源、QTE 计时监听、换槽计时、终结技流血暴伤/追加战斗形态仍未闭环。终结技 `stopenemy_elite` 的敌方实体时间膨胀也保持未建模；当前已排除 Buff 时间域歧义，真实阻塞是数据中的内联倍率曲线为空，不能猜造冻结倍率。
- 卡缪正式样本保留战技能力实体的弱化/目标死亡监听链，以及终结技效果与变身换槽状态缺口；强化连携形态继续作为可人工拖出的独立技能块，原生零冷却数据不再被强行套用基础连携冷却。
- 新增 `simulationNoEffectBuffIds`，专门记录标准玩家输出模型中已证明不可观察的行为。当前只用于施加给干员或其能力实体的公共伤害免疫 Buff：敌人无主动攻击，免疫不会改变模拟输出，因此不计入技能转换缺口。它不同于表现型 `ignoreBuffIds`，也不同于会使 `conversionSupport` 变为部分支持的 `unmodeledBuffIds`。
- Buff 时间域已经按原生 `Buff.OnTick(deltaTime, allScaledDeltaTime, selfScaledDeltaTime)` 分支闭环：`useTimeDilationDt=false -> default`、`true/false -> global`、`true/true -> self`，第二个字段在第一个为假时不参与选择。生成器保留并校验两个原始字段，内联定义只显式输出非默认时钟；敌方装配回归同时验证了三种时钟下的持续时间和周期触发。当前 2637 份可解析 BuffData 为 2619 个默认域、18 个全局域、0 个自身域；运行时仍完整支持尚未出现的自身域。证据见 `docs/research/native-buff-time-domain.md`。

### 2026-08-19：养成转换与可模拟数量纳入审计

- `audit_operator_progression.py` 现在同时读取 1.4.4 TableCfg 与正式 `operators.json`，按养成槽位而不是原始等级效果统计两层完成度：`definitionConverted` 表示严格来源效果已写入非占位 `OperatorDefinition`，`standardSimulationCompileReady` 进一步要求面板、技能补丁或常驻被动程序已有标准场景编译消费链。
- 当前原始盘点为 30 名干员、268 个天赋/潜能等级效果；正式 manifest 为 13 名干员、26 个天赋槽、65 个潜能槽。天赋 9/26 已转换且 9/26 均可进入模拟编译；潜能 55/65 已转换且 55/65 均可进入模拟编译；尚无一名正式生成干员达到“技能主体、全部天赋、全部潜能同时完整”的整干员口径。秋栗（稳定 slug `akekuri`）潜能 1 已按原生 `OnObtainAtb + CheckObtainAtbType(Skill, Gain)` 接入：只在该干员实际通过技能增加共享技力时叠加 10 秒、每层 +10% Atk、最多 5 层并刷新的 Buff；自然回复、普攻/处决、返还技力和满技力时的零实际增量不触发。
- 卡缪潜能 3 已作为首个“结构化冷却 + 多技能黑板”的组合潜能接入：原生 `CoolDown/Add -2s` 严格换算为 `comboSkill1` 的 `-60` 帧，两个连携形态的伤害与技力倍率按具体 `skillKey` 分流，不传播到兄弟形态。运行时只支持无条件整数帧冷却补丁；带条件冷却仍失败关闭。
- 同一组合编译能力也已覆盖陈千语潜能 5（连携技 `-90` 帧并开启终结技 `potential5` 分支）与吉尔伯塔潜能 5（连携技 `-60` 帧并乘算 `atk_scale ×1.3`）；三项都有正式生成物集成测试。
- 管理员潜能 1/2 已建立直接 `AddBuff` 的独立养成初始化入口：战斗 Buff 生命周期装配后分别给施放者安装 `buff_chr_0003_endminf_potential1/2`，供既有技能读取 `atb_return=50` 与 `ratio=0.5`。该入口与 `passiveSkills` 分离；带条件、事件、光环或未解析行为的 Buff 仍失败关闭。
- 陈千语潜能 1 已复用该入口，并补齐伤害 Buff 的严格目标生命条件：每次伤害结算读取敌人实时生命比例，只有 `<0.5` 时才把攻击方 `normal` 区间增加 `0.2`；阈值与加值来自 Buff 黑板，不在初始化时烘焙判断结果。
- 佩丽卡的 `multiplyReactionDuration` 与 `setReactionEffectiveness` 已通过稳定 step key 接入标准技能补丁编译，只接受唯一根 `applyElementalReaction`，并有真实生成定义回归。`addUltimateCriticalRate` 作为技能程序局部 `criticalRate` 修正进入标准伤害快照；`targetStaggeredDamage` 只在命中时敌人真实处于失衡状态时生效。`attackAfterReaction` 已接入独立的干员养成事件程序：反应状态与回执写入后同步报告 `reactionApplied`，监听器在数据动作阶段向同一干员 Buff runtime 施加原始 `EnhanceAndRefresh` 攻击 Buff。该 Buff 保留 5 秒、两层上限和 `Atk/BaseMultiplier +20%`，强化层会重复注册属性修正，实测两层得到 +40%。当前已经完整转换的养成槽位均有标准模拟消费链。
- 纯 `skillBbModifier` 的养成效果继续走统一 `patchSkillBlackboard`：达坂潜能 1/2/5 已分别接入终结技增伤/持续时间、天赋层数/持续时间和战技间隔，卡缪潜能 1 已接入战技能力实体的虚弱、易伤与持续时间输入。生成器严格要求条目不混入其他载荷，目标原生技能必须唯一映射到稳定技能组。
- 黎风潜能 3 的目标是天赋隐藏被动而非可释放技能，现由独立 `patchPassiveBlackboard` 在常驻被动编译后修改 `atk_up`。天赋启用时二级值从 0.0015 增至 0.002；天赋关闭时不会凭潜能伪造被动实例。吉尔伯塔、萤石、卡缪的类似来源因目标被动尚未生成，继续保持未转换。
- 黎风天赋 1 与萤石天赋 1 的 `attachSkill` 已严格归类为 `attachedPassive`：只有隐藏被动、启动 Buff、黑板赋值及引用 Buff 定义全部成功解析时才计入完整转换。它们进入既有常驻被动启用链，不生成时间轴技能块；其余目标被动未形成完整程序的 attachSkill 天赋继续失败关闭。
- 审计中的“可模拟”只表示定义能够进入标准场景编译，不保证某个触发条件一定会在具体时间轴发生；技能主体、Buff 闭包和敌人木桩行为边界仍须独立满足。
- 本批最终门禁：生成器 Python 规则测试 333/333、manifest 全量生成及 `--check`、`type-check:next`、Next Vitest 179 文件 1119/1119、`git diff --check` 均通过。`tmp/` 仍为未跟踪目录，未进入生成、测试或提交范围。
- 弧光潜能 5 已按完整槽位闭环：`skillBlackboardPatchAndAttachedBuff` 严格要求至少一项技能黑板补丁与恰好一个无条件 AddBuff，战技 `count` 覆盖为 `2`，并在养成初始化阶段安装 `buff_chr_0007_ikut_finish_count_p5`。该 Buff 的 `OnBuffStart` 通过统一内联生命周期编译为 `finishBuffsById`，只结束施法者已有的 `buff_chr_0007_ikut_normal_skill_extra_count`；来源出现额外载荷、多个附着 Buff 或未知事件时继续失败关闭。弧光现为 5/5 潜能已转换且可进入标准模拟，正式 manifest 潜能总计提升为 55/65。
- Buff 时间域公共机制已闭环并进入洛茜正式生成物：`normal_smarttarget` 的内联定义现显式使用 `global`，敌方 Buff 的持续时间与周期触发已通过标准装配回归。洛茜 `stopenemy_elite` 仍保持未建模，但阻塞已收窄为其 Entity `TimeDilationAction` 的内联曲线没有关键帧；下一步回到洛茜 `normal_defup` 周期输出、裸 `Target` Buff 事件归因和流血相关修正，不能用时间域完成度掩盖这些独立缺口。
- 时间轴时间语义已纠正：项目不再存储或调度统一逻辑帧，`placement.startFrame`、外部标记和模拟终点均为实际战斗帧；每个技能、Buff、能力实体、冷却与失衡运行时独立消费自己的时间增量。原先用于输入推迟和双标尺的 `CombatTimelineClock` / `TimelineTimeMapping` 已删除，编辑器只显示实际时间标尺。装配回归证明 0.5 全局倍率期间声明在实际第 1 帧的后续技能仍于第 1 帧处理。
- 本次时间语义修复门禁：`type-check:next`、Next Vitest 177 文件 1114/1114、`git diff --check` 均通过；本地 `/next/timeline` 验收只出现单一 `TIME` 标尺且无控制台告警。测试文件数减少来自删除两组建立在伪全局逻辑时钟上的测试，不是覆盖失败。
- 技能块实际宽度已接入实例级局部边界事实：场景块成功启动后，所属干员的 AbilitySystem 独立按 `selfScaledDelta` 累计定义中的 `timelineBlockFrames`，到达时发布 `SkillOperableBoundaryReached` 实际帧回执；动作序列自然结束、被下一技能中断或技能槽切形态都不改变这项 UI 边界累计。投影层用同一 `castId` 的 `SkillStarted` 与边界回执相减得到实际宽度，技能块和普通连线端点共同消费；未在模拟范围内到达边界时不猜测未来倍率，暂用定义宽度保底。离散帧边界已明确：第 N 帧启动不能在同一帧立即消费一整帧局部增量。0.5 倍速集成回归验证 2 个局部帧投影为 4 个实际帧；本轮门禁为 `type-check:next`、Next Vitest 177 文件 1116/1116、`git diff --check`，本地时间轴渲染无控制台告警。
- 块内命中点已经迁移到实例实际帧。场景编译此前只有 `ResolvedCombatStep.hitId` 声明而没有赋值，现按 `deriveHitId(castId, stepKey)` 递归绑定根动作、条件/once/逐帧/Context 容器、技能事件响应与能力实体子技能；无稳定 key 的伤害继续不伪造命中身份。`DamageApplied` 投影保留 `castId/hitId`，每个标记采用首次实际伤害帧；附着与反应按相同 `castId` 和实际帧归组。技能块内标记、详情标题和命中连线端点共同消费该事实，未执行或被拒绝的技能才回退定义局部偏移。生产弧光终结技回归确认能力实体两次伤害带同一放置 `castId` 与独立 `hitId`，实际发生在第 63、119 帧。本轮门禁为 `type-check:next`、Next Vitest 177 文件 1119/1119、`git diff --check`；本地时间轴可渲染该终结技的两个子技能命中标记且无控制台告警。
- 时间轴实际时间投影的宽度边界又收紧了一层：只有“定义宽度为正、该次施法已经实际启动、当前已发布快照仍没有 `SkillOperableBoundaryReached`”三项同时成立时，技能块才标记为宽度未决，并在定义宽度保底块右侧显示虚线边界与渐隐斜纹尾部。禁用、被拒绝、尚未进入模拟的技能块继续只是定义预览，不会被误标；`timelineBlockFrames = 0` 的展示技能不会进入正时长边界累计器。台式机 `/next/timeline` 实际交互已确认：启用并正常完成的 Arclight 终结技不出现未决尾部，浏览器控制台无警告或错误。本轮门禁为 `type-check:next`、Next Vitest 177 文件 1121/1121、`git diff --check`。下一项应沿同一证据边界审计块内剩余局部投影，缺少实例回执的持续区间、状态条或连线端点必须明确保持预览/未决，不能把定义局部帧当成实际战斗帧。
- 技能块内现有局部投影审计已经完成：普通连线端点消费实例实际宽度，命中点消费 `DamageApplied` 实际帧；块内时间膨胀流光现按每个 `TimeDilationStarted/Ended` 生命周期实例相对技能实际起点投影，保留多段区间并裁剪到技能实际宽度，不再强制从块左端开始或合并成最大宽度。台式机真实弧光样本确认两个实例分别渲染，选中时纵向阴影与同一实际区间一致且控制台无告警；延迟开始和前后越界由纯投影测试覆盖。本轮门禁为 `type-check:next`、Next Vitest 177 文件 1122/1122。当前时间轴没有渲染其他定义局部持续条；新增此类展示必须先有实例回执及预览/未决语义。主线下一步回到横向贯通正常模拟与干员转换。
- 底部曲线时间错位的现场核对证明曲线数据本身正确：真实弧光样本的 `DamageApplied`、敌人生命和失衡曲线都位于实际第 92、148 帧；错觉来自第二次能力实体命中晚于主技能块第 107 帧结束，却被块内标记的上界裁剪夹在右边界。命中标记现只阻止负偏移，不再按技能宽度截断，因此可显示在块外实际位置，并与本来就使用实际帧的底部曲线及命中连线一致。浏览器测得两组中心横坐标分别约为 `914.6/913px` 与 `1026.6/1025px`，仅剩图形自身边框差；控制台无告警。
- 拖动技能时命中标记的“弹性抖动”来自展示层 `transition: all`：它把 30Hz 实际投影更新产生的 `left` 变化也套入带过冲的悬停缓动。命中相对偏移在拖动预览期间本来保持稳定，问题不在模拟时间。现在只对颜色、边框、阴影和悬停缩放做过渡，位置即时更新；浏览器计算样式确认 `transition-property` 不再包含 `left` 或 `all`，控制台无告警。
- 命中点击面板已参照旧版重做：420px 弹窗按“上下文、结果、倍率、元素/反应”分节，结果使用大号伤害值，表格密度、次级文本和倍率强调色与旧版对齐，支持遮罩点击、关闭按钮和 Esc。入口同时修复两处身份错误：子组件发出的是 `hitId`，父级不再错存为 `stepKey`；详情回执按 `castId + hitId` 选择首次实际帧，并收集同施法同帧附着/反应，不再要求能力实体伤害的 `sourceId` 等于干员轨道。真实弧光能力实体命中显示第 92 帧、1,214.5 电磁伤害、防御倍率与电磁附着，420px 面板无溢出，新页面控制台无告警。旧版攻击构成、期望暴击和强制暴击缺少 Next 回执事实，暂不伪造。

## 8. 恢复工作清单

1. `git status --short`，确认没有把 `tmp/` 或用户文件带入提交；
2. `git log -10 --oneline`，以实际 HEAD 为准；
3. 阅读本文、`docs/next/09-status-and-roadmap.md` 和 `scripts/generate_next_operators/README.md`；
4. 查看最近生成审计，区分“技能主体完整”和“天赋/潜能/保护效果完整”；
5. 修改前先找到数据或反编译依据；
6. 新增行为同时更新生成器测试、Next 类型检查、Next 测试和文档；
7. 不修改旧版代码，不提交 `tmp/`，不为尚未发布的 Next 中间存档保留兼容脚手架。

## 9. 跨项目背景

本项目不是只依赖 Endaxis 自身：

- AKEDB/CDN 提供表格、文本和部分技能/Buff 数据；
- 本地 VFS 工具与远程 `vfs-index-browser` 用于读取客户端资源；
- IL2CPP dump 与运行时探针用于确认执行顺序和硬编码逻辑；
- 独立 C# Combat Spec 仓库用于按证据 1:1 复刻战斗语义；
- Endaxis Next 只要求行为一致和工程可维护，但新证据应同步回 Combat Spec 与研究文档。

项目位置、连接方式、证据等级和操作命令详见：

- [项目与工具总览](./02-projects-and-tools.md)
- [证据与研究方法](./03-evidence-and-research-method.md)
- [战斗系统研究结论](./04-combat-system-findings.md)
- [操作手册](./07-operations-playbook.md)
