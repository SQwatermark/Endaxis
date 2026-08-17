# Next 干员 DSL 生成器

该工具从解包 `SkillData`、`BuffData` 和 `TableCfg` 生成 Endaxis Next 干员定义。它不读取现有干员 TS；无法确认语义的战斗行为会阻止正式 DSL 生成，而不是被静默丢弃。

## 输入

- `skill-data-cdn`：技能时间线、动作顺序、伤害、失衡、资源变化和投射物命中子技能。
- `TableCfg`：技能逐等级补丁、干员基础信息、属性成长、技能组、天赋节点和潜能效果。
- `operators.json`：游戏数据无法自行决定的 Endaxis 身份映射与语义声明。

`operators.json` 不保存可从数据源取得的倍率、冷却、持续时间、属性成长或潜能数值。它只声明稳定 DSL key、原生技能到 Endaxis 技能的映射，以及单敌人模型取舍等无法由原始字段唯一推导的语义。首段连携入口写在干员级 `comboSkillRegistrations`，不能放进单个技能的 `compile` 配置；多段连携的后续窗口由对应技能序列生成 `openComboWindow` 步骤。

时间膨胀按原生动作直接转换：命名曲线保留公共键，内联曲线保留完整 Unity 关键帧。普通动作生成 `startTimeDilation`，终结技专用动作生成 `startUltimateTimeDilation`。根技能中的 `Source` 与 `Owner` 都归约为施法者；能力实体目标只有在固定单敌人模型下可安全省略时才记入审计。嵌套时间动作、未知字段和无法归约的实体目标会立即报错。

## 输出

每名干员最多生成三个文件：

- `<slug>.generated.ts`：完整、可审计的技能中间表示。
- `<slug>.audit.json`：便于人工检查的来源、动作和未解析依赖报告。
- `<slug>.operator.generated.ts`：编译后的技能、面板基线、技能组、天赋和潜能组成的完整 `OperatorDefinition`；正式数据不拆成多个文件。

完整定义包含基础信息、六个里程碑等级的面板基线、技能组、天赋和潜能。生成器会反向核对 `CharGrowthTable.skillGroupMap`，并验证天赋、潜能修改的技能 ID、黑板键和数据形状。

技能费用与冷却由稳定技能类型和 `SkillPatchTable` 自动恢复。非零战技费用必须使用原生技力类型，非零终结技费用必须使用原生终结技能量类型；冷却只接受非零补丁值。`operators.json` 中已有的 `costResource` 与 `usePatchCooldown` 只作为旧配置的断言，不能覆盖或补造数据源结果。

逐等级数值只有在等级间确实不同时才生成数组；单值或所有等级相同的数值会压成标量。百分比标量使用 `percentage`，逐等级百分比使用 `percentages`，避免把固定值误解释为“仅第 1 级有值”。

天赋阵列的四次属性加点来自 `CharGrowthTable.talentNodeMap` 中 `nodeType = 3` 的节点，而不是面板成长表。生成器按 `attributeNodeInfo.breakStage` 排序并严格校验四个阶段、属性修正模式和目标属性；与全局 `[10, 15, 15, 20]` 主属性规则一致时省略 `trustAttributeBonus`，存在例外时才把源数据写入定义。全量核对记录见 [trust-attribute-bonus-audit.md](trust-attribute-bonus-audit.md)。

### 宽松转换支持状态

宽松转换得到的 `OperatorDefinition` 必须携带 `conversionSupport`。该字段只允许保存：

- `completeness`：`complete` 或 `partial`；
- `missingCapabilities`：受限的能力代码，以及可选的稳定技能组 key。

能力代码用于让目录和 UI 明确提示“该干员数据未完全转换”，不能保存解析异常、源文件路径或本地化文本。详细原因仍写入 `<slug>.audit.json`，不会进入项目存档。完整定义未显式配置时，生成器会写入 `complete` 与空缺失清单；清单中的天赋或潜能若明确使用 `unmodeled...` 编译器，则会自动推导为 `partial` 并加入对应能力缺口。显式配置支持状态时不得漏报这些已知缺口，生成器会校验状态与清单一致。

## 代码结构

- `generate_next_operators.py`：当前兼容入口及生成流水线编排；既有测试和审计工具仍可从这里导入公共名称。
- `source_models.py`：解析层与审计层共享的不可变中间数据模型；只定义数据形状，不读取文件、不解释游戏语义，也不反向依赖主生成脚本。
- `source_schema.py`：解包动作结构的字段白名单和已知类型集合；用于在数据版本变化时严格暴露未知结构。
- `source_utils.py`：严格数据读取、基础值解析与 TypeScript 字面量渲染等无状态工具。
- `action_kinds.py`：战斗动作分类的唯一来源，供解析器与完备性审计共同使用。
- `target_parser.py`：严格解析目标选择器和目标引用，但不负责将其归约为单敌人语义。
- `action_payload_parser.py`：解析标量、伤害、Buff、资源、投射物和能力实体等可复用动作载荷。
- `conditional_parser.py`：保留条件动作及其有序成功、失败分支，生成可审计控制流中间层。
- `keyword_action_parser.py`：严格解析减速等关键词动作；当前只转换战斗模型能够精确表达的减速子集。
- `progression_renderer.py`：将已解析的天赋、潜能来源事实转换为 `OperatorDefinition` 养成片段；后续全干员养成转换统一从这里扩展。
- `audit_operator_progression.py`：盘点全干员天赋/潜能载荷，并单独审计潜能中的四维属性加点是否能够完整转换。
- `audit_all_operators.py`：对全部干员入口执行严格解析与试编译，记录覆盖率和首个阻塞原因，不保存试编译产生的最终 DSL。
- `operators.json`：只保存稳定身份映射与无法由原始数据唯一决定的项目语义，不充当数值数据库。

后续拆分以依赖方向为准：严格数据读取和通用字面量工具先独立，技能解析与 DSL 编译分别依赖数据模型，面板、天赋和潜能转换再作为独立的干员养成模块接入。禁止为了缩短文件而在模块间建立循环导入，或复制一套解析规则。

## 使用

默认读取相邻研究工具仓库中的缓存：

```powershell
python scripts/generate_next_operators/generate_next_operators.py
```

指定数据目录或只生成一名干员：

```powershell
python scripts/generate_next_operators/generate_next_operators.py `
  --source C:\path\to\skill-data-cdn `
  --tables C:\path\to\TableCfg `
  --operator perlica
```

检查已提交生成物是否过期：

```powershell
python scripts/generate_next_operators/generate_next_operators.py --check
```

运行 Python 规则测试：

```powershell
python -m unittest discover scripts/generate_next_operators -p "test_*.py"
```

桌面环境缺少默认输入时，可从 AKEDB 下载生成器所需数据：

```powershell
python scripts/download_akedb_next_sources.py
```

下载器当前把五张 TableCfg 固定到 `1.4.4@9433094-12`，并按公开清单同步完整
SkillData/BuffData。2026-08-15 的公共 JSON `sharedRevision` 与该 manifest 的 `latest` 配对，
是当前正式生成基线。AKEDB 只对 TableCfg 提供历史版本路径；`public/Json` 会随热更新覆盖，
因此以后更新前仍须先确认 `latest` 与所选 TableCfg 一致，不能把新的公共 JSON 与旧表混合后
直接覆盖正式生成物。只需补齐表文件时可追加 `--tables-only`。

审计全干员天赋/潜能载荷：

```powershell
python scripts/generate_next_operators/audit_operator_progression.py `
  --json-output docs/research/all-operator-progression-audit.json
```

潜能中的 `attrModifier` 只有在每条数据均为已确认的永久静态属性
（条目 `modifyType = 4`、`modifyAttributeType = 0`，且属性与公式槽组合受支持）时，
才允许由清单中的 `compile: "staticAttributes"` 生成。目前可无损生成四维
`addBuildAttribute`，生命、防御、暴击率和源石技艺强度的 `modifyBasePanelStat`，以及普攻、
战技、物理、电磁和寒冷增伤的 `addStaticDamageIncrease`。其中生命百分比必须来自基础倍率槽，
其他已支持属性当前只接受基础加算槽。
严格模式遇到混合载荷、未知字段、未知属性或修正模式会立即失败；全量审计使用宽松模式，
会保留可识别的四维部分，同时把整个潜能标记为未完整转换，不会静默吞掉其他属性。
语义已确认但尚无等价运行时消费链的属性会在
`staticAttributeConversion.attributeFacts[].runtimeClosure` 中记录原生公式槽、消费点、Next 阻塞项和
禁止的近似方案，并汇总到 `summary.runtimeClosureGaps`。当前详细结论见
`docs/research/operator-progression-runtime-closure-gaps.md`。

潜能中的终结技能量消耗乘算不需要在 `operators.json` 逐人声明编译器。生成器只在一个
效果的全部条目均为 `ChangeSkillParam / CostValue / Multiply`、且目标技能全部属于原生
`UltimateSkill` 技能组时，自动生成 `multiplySkillCost`。双形态干员的多个原生终结技目标
会归并为同一个 `ultimate` 技能组补丁；各目标倍率不一致、混入其他载荷或指向其他技能组时
立即报错。全量宽松审计会把同一结果写入效果的 `dslConversion`，其他尚未闭环的潜能仍保留
`potentialEffects` 支持度缺口，不因其中一个可转换条目而被误报为完整。

纯 `skillBbModifier` 养成效果可使用 `compile: "skillBlackboardPatch"` 转换为技能初始黑板补丁。转换器逐条验证目标原生技能能唯一对应到稳定技能组、黑板键非空、操作类型受支持，并保持天赋等级顺序。指向隐藏天赋技能、混入 Buff/附加技能或同时修改其他参数的效果不能借用该编译器，仍应显式保留为未建模。

天赋和潜能中的 `attachSkill` 会沿隐藏 SkillData 继续解析，不需要把隐藏技能列入可放置技能清单。
当前只允许 `PassiveSkillType.AddBuff`、启动 Buff 和黑板传值均可无损表达的子集生成
`passiveSkills`。切换 Buff、事件/光环行为、未知 Buff 载荷，以及尚无运行时消费端的原生属性修正
都会写入 `*.audit.json` 的 `passiveSkills[].generationIssues`，不会阻断其他技能生成，也不会降级为
空效果。正式定义只包含完整通过检查的隐藏被动 Buff；审计失败的依赖不会进入运行时 Buff 目录。

## 当前边界

- Endaxis 假定干员与唯一敌人的距离为零且攻击必然命中，不计算投射物轨迹、范围和碰撞；投射物暂按 `0` 帧命中，并在中间层以 `assumedTravelFrames: 0` 明示。若同一子技能同时绑定 `hit` 与 `block`，后者是碰撞结果的兜底路径，必命中投影只执行 `hit`，但审计层仍保留完整触发配置。若后续发现原生事件队列在零距离下仍会延后一帧，再统一修正该假设。
- 能力实体也使用同一空间约束：不建立坐标、碰撞、旋转或导航对象，所有距离为零，范围查询覆盖场景中全部存活逻辑实例。模板证据由 `scripts/extract_next_ability_entities` 从 VFS 原始 Unity 资产提取；当前 manifest 451359 可解析 54 个模板，Liino 的一个引用明确缺失。正式 DSL 只转换来源为 `ActionSource/ActionOwner`、目标可归约为施法者/唯一敌人、生命周期字段已表达且黑板赋值为数值的 `SpawnAbilityEntity`。运行时保留实体身份、owner/source/target、born tags、时长和黑板，并发出生成、子技能请求及结束回执；统一 owner/tag 查询会把完整实体组写入施法 Context，并可把数量写入动作黑板复用既有比较条件。DSL 与运行时允许生成步骤携带实体独占的子时间轴并消费实体局部时钟。生成器只对“继承来源动作黑板、无递归/Aura 等未迁移动作、剩余伤害/已投影固定周期伤害/附着/动作黑板修改/资源获得/严格可编译 Buff/条件均可由共享编译器完整消费”的子图执行原子迁移，并同步删除父时间轴投影。子 `Source` Buff 归约为施法者；子 `Owner` 只能归约为 `currentAbilityEntity`，且引用的 BuffData 必须完整通过内联定义编译。当前正式产物命中 Arclight、Gilberta 和 Lifeng，庄方宜审计产物另覆盖普攻二、四、五，其余形状仍保留原边界。
- 当前 SkillData 另有 10 个 `SetAbilityEntityDuration`、2 个 `CheckAbilityEntityCurDuration` 和 1 个 `SetAbilityEntityTarget`。Next 运行时已经支持 Context 稳定句柄迭代、有限剩余时长读取/比较，以及所有已观察设置样本共有的 `Assign` 操作。1.4.4 原生实现已证明 `setMultipleTarget=false` 只调用一次单目标解析，而 `true` 才枚举整组；生成器会严格转换庄方宜的 `Context ForEach -> Target/LT -> InputTarget/Assign` 形状，也允许由此前确定逻辑生成证明为单例的命名 `ContextTarget` 复用 0/1 Context 迭代。来源不明、被普通目标组复用或可能为多实例的键仍拒绝；Li Zhiyan 的完整连携技还受能力实体时间膨胀与位置目标投影阻塞。跨实例短路、目标变更和其他未出现的时长运算不得从名称推断。
- `TimeDilationAction` 中的能力实体查询会严格保留 owner-spawned 身份、可选 GameplayTag 查询或命名 Context 身份。全局/终结技 `ignoreTargets` 已生成正式 DSL，并在执行时把查询到的稳定实体加入排除集合；这在能力实体寿命开始消费时间倍率后是必要语义。Entity `effectTargets` 的 DSL/运行时查询、寿命效果和内嵌子时间轴倍率都已存在，但生成器仍明确拒绝输出：owner/tag 查询可能跨技能选中实体，必须先建立干员范围内“所有匹配生成点均已动态迁移”的证明。Tangtang、Yvonne、Li Zhiyan、Liino 的连携技因此继续暴露同一生成链缺口，不能把该字段误认成纯表现 `EffectAction` 后忽略。
- Buff 施加单独支持 `party` 集合目标：只有未附带筛选器或后处理器的 `CharacterTeamFinder` 目标组才能归约为当前全部存活干员。Buff 查询、结束和条件仍要求 `caster/enemy` 单一实体；主控筛选、召唤物和父级上下文目标不得借用 `party` 近似。
- `InstantSearch` Buff 目标会在中间层保留 finder、validator 与 post-processor 类型；目前也只有无过滤、无后处理的 `CharacterTeamFinder` 能直接归约为 `party`，其他即时搜索继续显式阻塞。
- `TargetSource.Source/Owner` 按原生分派忽略不会被读取的 `targetGroupKey`；根技能的 `CreateBuffAction.buffSource=InputTarget` 则归约为唯一敌人来源。两者都来自目标解析证据，不把命名组猜成实际目标。
- 技能释放条件只用于合法性诊断。即使条件、费用或冷却不满足，用户排入时间轴的技能仍会进入模拟并产生结果。
- 当前战斗模型只有一个敌人。佩丽卡连携的多目标递归弹射必须在清单中显式声明忽略，并由生成器校验它确实是同一投射物和命中技能形成的递归分支。
- `AuraAction` 是战斗动作，不是表现占位。当前公共 SkillData 中有 117 个原始光环动作；从 320 个干员入口静态可达 20 个。生成器会把根技能及已解析能力实体/投射物调用图中的光环结构化为 `auraActions`，保留来源文件、时间区间、范围、目标过滤、Buff 输入和内部动作清单；条件分支专属的能力实体仍保留分支身份，只在子调用确实包含光环时挂入审计树，不提升为必然执行的根调度。BuffData 光环会记录为帧位为空、带激活来源和事件名的 Buff 定义动作，不能伪装成技能第 0 帧动作。在目标筛选、持续时间和子动作生命周期完整闭环前，所有光环都只参与覆盖审计并阻止对应技能被误报为完整，不生成近似 DSL。精确分布以当前递归审计为准。
- `FractureAction` 会被解析为明确的 `fracture` 物理异常载荷。根时间轴和条件分支都保留目标、原生顺序、`isExtra`、中断时长以及全部击退参数；空间参数只作为证据保存，不在固定单敌人模型中执行。原生行为还包含破防层创建/消费、物理异常前后事件、碎甲 Buff 链和伤害，因此在这条运行时链完整接入前，解析成功不等于 DSL 完整，相关技能继续严格阻塞。
- 技能时间轴中的 `EventListenerAction` 会作为独立的事件订阅事实保存，包含注册区间、事件名、原生动作顺序、主控/守卫限制及可解析的 Buff 创建载荷。监听器内部动作不会被提升为技能第 0 帧或注册帧上的无条件动作；在对应战斗事件及条件链接入运行时前，相关技能继续严格阻塞。
- 根时间轴与条件分支中的 `TimeDilationAction` 共用同一套严格解析。根动作按原生帧进入调度；分支动作保留在成功或失败序列的原始位置，只有分支实际成立时才创建时间膨胀实例，不能提升成无条件时间动作。`CharacterTeamFinder + MainCharacterValidator` 的即时搜索会保留为独立的 `controlled` 排除目标，并在动作执行帧通过场景控制时间线解析，不能静态近似为 caster；Avywenna 投射物子技能中的该目标结构已可解析，但其父技能仍先被能力实体距离守卫阻塞。当前洛茜第三段连携与卡缪重击中的嵌套样本已经闭环。
- `FinishBuffAdvanced(checkType=Id)` 的空 `buffIdList` 按原生 Id 遍历语义不会调用 Buff 容器。只有事件监听器的全部响应都完全由这种无条件空操作组成时，生成器才省略整个监听器；非空 Id、Tag 查询、条件、`once` 或其他动作不会借用这条规则。当前洛茜终结技的 `OnSkillEnd` 监听是唯一命中该规则的入口样本。
- 没有战斗效果的表现投射物、教程标记和全等级为零的资源动作会保留在审计层，但不生成无效果 DSL 步骤。非零根资源获得会按原生帧和动作顺序进入统一调度；`costValue` 在原生数据中引用动作黑板时生成 `changeResourceByActionValue`，不得冻结成生成时等级常量。固定 `coefficient` 会作为独立字段进入 DSL；动态黑板系数也保留为动作黑板操作数，在步骤执行时与动态数量相乘。`Atb` 映射为全队共享技力，`UltimateSp` 映射为施法者终结技能量，生成器不得把两者统一写成同一资源所有者。SP 的普通/返还类别与来源倍率会进入共享技力步骤；终结技能量严格按“目标回能效率、可选最大能量百分比、固定系数、回复许可标签”顺序结算，`ignoreUspGainScalar` 只跳过第一段，`useUspRecoverTag` 只携带许可身份，两者不能互相替代。仅主控限制仍保留在中间层并阻止未闭环动作进入正式 DSL。
- `IfElseAction` 会作为结构化条件审计保留。当前已完整记录浮点比较、技能类型、实体数量、目标身份与 Buff 层数条件；其中 `CheckBuffStackNumAdvanced` 的 `Id/Tag + BuffCount + limitSkillCastId=false` 与 `CheckBuffStackNumByTag` 的 `Tag + BuffCount` 已有反编译闭环。层数阈值既可来自字面量，也可在执行时读取动作黑板；`Target` 只有在调度投影已经明确其输入为唯一敌人时才会编译为敌方查询，这条身份规则同时用于定时标记的检查与创建。`CheckEntityNum` 仅在直接读取技能输入目标，或读取点之前最后一次可达写入已证明为无过滤的敌方存活普通实体 HitBox / 主目标查找时，才会按固定单敌人模型归约。`CheckTargetsEqual` 只有在两侧都能严格证明为无过滤、无重定向的技能目标或主目标时才归约为恒真；选择器带有校验器、后处理器或上下文重定向时仍会拒绝编译。根时间轴上的双操作数计算、原地黑板修改、Buff 黑板读取、Buff 结束和元素附着与条件分支内的同类动作共用编译器，并按其原生帧和 `serverActionIndex` 进入统一调度。单伤害快捷编译器仍要求附着与伤害同帧；统一调度不作该假设，可表达独立帧上的根附着动作。
- `CheckBuffStackNum` 是固定单个 Buff ID 的简化条件：按通用目标解析取得首目标、将不可直接附加 Buff 的部位归并到主体、累计同 ID Buff 的增强层数，并允许比较阈值在执行时从动作黑板求值。它与高级版本共用 `buffIdStackCompare`，但仍要求目标身份能够闭环。
- 条件分支中的 `CheckTimedMarkerCondition` 与 `CreateTimedMarker` 会保留固定标记 ID、目标、持续时间、检查极性和动作结束清理语义。Next 允许同一实体持有多个同 ID 标记，并按共享战斗时钟判断有效性；动态字符串 ID 与 `useTimeDilationDt=true` 在对应运行时能力闭环前继续报错。
- `CheckGlobalCDTimerAction` 与 `AddGlobalCDTimer` 在审计层保留为独立的原生全局冷却事实；根技能中目标为当前干员、ID 固定且时长可解析时，按 `(buffId, 当前干员)` 映射为施法者定时标记。Buff 事件中的同类动作和 `ModifyGlobalCDTimer` 尚未闭环，仍会阻止完整生成。
- `CheckSkillHasHit` 读取当前技能实例的 `hasOutputDamageBattle`，不是静态检查 SkillData 是否包含伤害。生成器只会在统一调度中证明同一根技能已有严格早于条件的必然命中伤害时，将它按固定单敌人模型折叠；同帧使用 `serverActionIndex` 区分先后，晚于条件或来自子技能的伤害都不能作为证明。
- `CheckSkillCameraMotionFree` 不会被编译成战斗条件。只有条件分支在过滤镜头、特效等表现动作后为空，或仅把字面量 `1` 写入已逐消费者审计的 `isWall` / `camera_blocked` 时，生成器才会省略整棵纯表现条件树；出现新的黑板键、运算、动态值或战斗叶子时仍会 fail-closed。
- `CheckEnemyRank` 按原生 `EnemyRankSet` 位掩码编译为 `enemyRankIn`：`Mob=1`、`Elite=2`、`Boss=4`。AKEDB 可能把非零 flags 投影成枚举名称字符串；整数和名称都会归一到同一位集。原生 `0` 保留为空 rank 集合并永不匹配，未知名称或位仍会失败。目标必须能严格归约为当前唯一敌人；筛选器或未证明的上下文目标不会放行。敌人实例的 rank 来自 1.4.4 模板资产证据，不能用五档展示 `tier` 代替；证据链见 [Enemy rank evidence](../../docs/research/enemy-rank-evidence.md)。
- 命名目标组不会按 `tar`、`smart_target` 等字符串猜测语义。生成中间层会严格记录 `FindTargetAction`、`ContinuousFindTargetAction` 和 `MergeTargetAction` 的帧区间、原生动作顺序、分支路径、选择器类型及合并输入；新增查找器、校验器、后处理器或字段形状会立即报错。只有能够证明写入动作在读取前发生、控制流支配读取点且选择器在固定单敌人模型下必然得到敌人时，才允许把 `Context` 实体数量条件或根级 Buff 目标归约为唯一敌人；分支内写入不会泄漏给根动作。
- 带 `TagValidator` 的敌方 `HitBoxFinder` 查找即使在零距离模型下空间上覆盖唯一敌人，其标签查询仍可能过滤掉当前敌人，不能归约为唯一敌人；技能自身在搜索为空时的回退合并分支证明空结果是设计内可达状态，相关实体数量条件继续严格阻塞。分析与后续方案见 [标签过滤目标搜索审计](../../docs/research/tag-filtered-target-search-audit.md)。
- 条件分支中的 Buff 读取、层数读取、结束、黑板计算和黑板修改只属于对应成功/失败分支。生成器报告存在尚未编译的条件时，`complete` 必须为 `false`，不得把这些子动作提升为无条件步骤。
- 根时间轴解析只展开动作列表容器，遇到具体 Action 后停止；`IfElseAction` 两侧的伤害、投射物和能力实体只归条件树所有，不再被通用递归遍历重复投影。佩丽卡连携的自递归投射物会保留为投射物子技能条件，并仅在清单显式声明单敌人省略且分支形状严格匹配时忽略。
- 条件分支以递归 ordered tree 保存。每个条件节点保留原始路径，成功/失败分支中的直接子动作保留原始下标；嵌套 `IfElseAction` 留在父分支中的实际位置，不会被提升为并列条件。重复动作不会排序或去重。
- 顶层时间轴同时保留 `timelineActions` 中的原生 Sequence 序号和动作的 `serverActionIndex`。递归子技能使用各层触发动作与子 Sequence 组成 `sequenceOrder`，并用 `actionOrder` 保存 Sequence 内的动作顺序。统一调度先按 `(frame, sequenceOrder)` 恢复原生 Sequence 边界，再在组内按 `actionOrder` 排序；不能先把动作铺平后仅凭同帧重新合并，否则原本分属不同 Sequence 的动作会被错误合并。
- SkillData 声明的动作黑板默认值会保留在审计层。正式 DSL 只注入已编译条件树实际读写的声明值，随后由 SkillPatch 的逐等级同名值覆盖；相机、输入方向等表现变量不会因为存在于原生黑板就进入战斗运行时。
- 运行时黑板写入键沿根技能、投射物触发子技能和能力实体调用图递归收集。伤害或资源步骤引用这些键时保留为运行时操作数；只有没有任何动作写入的键才允许回到 SkillPatch 等级值解析，不能因载体位于子技能中而错误静态化。
- 该条件树仍是审计中间层。当前九类战斗叶子均复用全局严格 parser 并携带 typed payload：黑板计算/修改、Buff 黑板读取、Buff 层数读取、Buff 结束、Buff 创建、资源变化、投射物发射和能力实体生成。投射物与能力实体叶子只保存直接资源身份，子技能内容继续由独立 resolver 解析，避免在条件树中复制整棵子图。
- 正式条件编译已支持动作黑板浮点比较、固定单敌人目标上的 `Tag + BuffCount` 查询、施法者自身的 `Id + BuffCount` 查询、实体 GameplayTag 查询、单敌人目标身份等价，以及按动作所属干员动态判断主控身份；比较统一使用原生容差。实体标签条件直接查询目标当前持有的标签容器，并沿用父标签匹配，不会近似为 Buff 身份或层数查询；`Source`、根动作 `Owner`、已确认的动作输入目标及已有证据的敌方目标组会分别归约为施法者或唯一敌人。根干员技能中无筛选、无重定向的 `Owner/Source -> Target/MainTarget` 距离条件，会按项目既定的施法者与唯一敌人共点模型计算：原生 `lessThan=true` 使用 `<=`，反向分支使用 `>`，目标半径只会进一步减小有效距离。能力实体、上下文位置、队友查找和场景碰撞体距离仍会明确拒绝。主控条件只保存为 `casterControlled` 语义，实际值必须由场景运行时依据当前帧查询，不能在导入 SkillData 时常量折叠；其他未证明来源的条件同样不能因为审计层保存了参数就视为可执行。
- `IfElseAction.conditionAction` 已能生成完整成功/失败分支。主控身份、距离和目标身份条件直接位于分支 `SequenceAction` 时，会被解析为“守卫 + 剩余兄弟动作”的嵌套节点；守卫失败会跳过整个序列尾部，后续动作不会再被外层重复追加。直接位于技能根时间轴 `_sequenceActionData.actionData` 的同类守卫则属于技能入口：Endaxis 对用户已排入的技能始终执行，因此将这一级视为已通过，不转换成第 0 帧释放条件，也不阻断尾部战斗动作。`ForEachAction` 中的守卫仅在容器直接遍历技能输入 `Target`、且尾部不会被旧根解析器重复展开时交给条件树独占，并按动作帧保留局部短路；`Context` 组可能是能力实体或队伍成员，不能把循环中的当前 `Target` 近似为敌人。当前 320 个技能中的 4 个真实 `ForEach` 直接守卫样本全部遍历带标签的 owner-spawned AbilityEntity 集合（Avywenna 3 个、Tangtang 1 个）。生成器已保留对象种类和原生标签查询，但在持久实体生命周期与位置模型闭环前仍严格阻塞；证据见 [能力实体 Context 目标审计](../../docs/research/ability-entity-context-target-audit.md)。尾部含伤害、资源或黑板计算时，在建立显式消费身份前同样 fail-closed，避免生成条件/无条件双份调度。其他分支、引导和事件序列也不得借用根入口规则放行。
- 递归条件编译骨架能够保持成功/失败分支与嵌套顺序，并生成正式 `branch`/`sequence` DSL；当前接入敌方 Tag Buff 黑板读取/结束、施法者 ID Buff 的检查/结束、`ModifyDynamicBlackboard` 的七种原地运算，以及 `SimpleCalcBBAction` 的双操作数加法、乘法和除法。两类黑板动作使用独立步骤：后者不读取目标键旧值，按单精度计算，除零保留原生 IEEE 结果。任何未接入的叶子都会报告完整分支路径，整棵条件树不产生输出。
- 庄方宜目前已有三棵顶层条件树能够独立完整编译：普攻二、普攻三的飞剑距离黑板更新，以及普通战技结束上一轮飞剑 Buff。`resolvedSchedule` 保留 `sequenceOrder` 与 `actionOrder`，编译时按原生 Sequence 分组伤害、条件根和其他已闭环动作；`resolvedDamageSequence` 要求至少一个伤害命中，`resolvedSequence` 则用于终结技这类没有直接伤害、但会在指定帧施加战斗 Buff 的技能。普通普攻二至五段和三段强化普攻已进入审计阶段 DSL。普攻二被拆成第 2 帧两次投射物命中，以及第 15、24、26、29 帧四次飞剑命中；逐 hit 的实际倍率之和与独立的 `display_atk_scale` 在部分等级相差 1–3 个百分点，生成器以实际 `DamageAction` 为准，不能沿用旧手写定义的显示总倍率。其动作黑板比较分支与可折叠空间分支分别正常编译。普攻四先在第 11 帧命中，再由固定周期动作在第 20、22、25 帧追加三次命中；这些帧来自原生单精度秒计时器，不是把 `0.1s` 固定舍入成 3 帧。旧手写定义虽然保留了四次倍率，却把四次都压在第 11 帧。普攻五在第 20 帧造成伤害与 18 失衡，并只回复一次 18 技力。普通战技仍被其他未解析根动作阻塞；终结技已生成第 78 帧核心 Buff 施加及费用、冷却。五个强化技能的 `ExtendBuffAction` 已结构化为带结束帧的 Buff 固定实例保护区间；三段强化普攻的能力实体链分别生成第 15、13、33 帧命中，第三段同时生成 18 失衡和 20 技力回复。终结技核心 Buff 的事件动作与强化战技、强化连携仍未全部闭环，因此暂不替换正式庄方宜定义。
- 含 `conditionalActions` 的技能只能交给能够消费完整条件树的统一序列编译器。即使成功/失败分支当前看起来相同，也不能在条件类型及其副作用尚未完整解析时提前消去；只有清单明确列出且已人工确认不影响战斗的表现 Buff，才允许从对应分支过滤。若过滤后分支完全为空，则连同无副作用条件节点一起省略。审计阶段始终保留完整来源树，不得生成遗漏条件分支的“部分技能”。
- 佩丽卡已经完整生成并作为正式数据入口；新增干员前应优先把所需通用语义编译器补齐，避免在清单中复制手写 TS。
- `CreateBuffAction` 引用的 BuffData 已在审计层保留持续时间、周期、首轮等待、触发次数、叠加身份、叠加策略、优先级和最大层数；这些字段会解析动作传入值及 Buff 自身黑板引用。事件顶层直接创建 Buff 时，还会保留 `actionIndex`、目标、次数、来源、施法身份继承及完整黑板传值；条件分支内的创建动作仍由条件树保存。事件动作尚未完整编译前，它们仍是中间层事实，不能只凭 Buff ID 生成一个无行为的 `applyBuff`。
- BuffData 中已确认的 `CheckTagMatch(Target) -> DamageScaleProcessor` 会转换为内联 `damageModifiers`：标签查询保持原始有符号 CRC-32 ID，增伤值可从当前 Buff 实例黑板动态读取，并在标准伤害环境的原生增伤区间中结算。`SlowAction` 当前会按原生 `buff_common_affixes_slow` 投影为高优先级 Buff，保留时长、倍率优先级和减速 GameplayTag；移动速度修正与图标子 Buff 不属于固定单敌人战斗模型，不进入模拟。随动作结束、子 Buff 覆盖和增强链尚未闭环，出现这些形状会明确报错。萤石战技的基础减速、潜能条件分支中的延长减速，以及第一天赋“目标带减速标签时增伤”的消费链已经贯通。
- 每个技能的 `referencedBuffIds` 会遍历完整动作树并列出直接 Buff 依赖，包含条件分支中的创建动作；它只是构建定义目录的入口，不会把条件分支中的应用提升为无条件步骤。原动作树继续保存应用时机和参数。
- 干员级 `buffDefinitions` 汇总所有技能的直接依赖，递归扫描 Buff 时间轴与事件动作创建的间接依赖，并按 Buff ID 去重；循环引用不会造成重复或无限递归，缺失数据源会被明确记录。定义只使用 Buff 自身黑板默认值，并保留原生 GameplayTag ID、原生八槽属性修正、时间轴伤害/条件/黑板/资源动作及事件动作；事件通过 `eventSource` 区分 Buff 生命周期事件和宿主实体事件，通过 `orderedActionTypes` 保留启用动作的原生顺序，并只保存创建依赖边，不嵌套复制子定义。技能应用时传入的覆盖值仍留在 `CreateBuffAction` 载荷中，生成结果不再保存一份合并应用覆盖值的 `buffBehaviors` 派生快照。当前属性修正仍是可审计事实，尚未映射到运行时目录；伤害修正器也尚未解析。Buff 根级别存在但尚未结构化解析的非空载荷会进入 `unparsedPayloads`，记录字段名和条目数；该列表非空时不得把对应定义视为完整运行时行为。
- `adaptGeneratedBuffDefinition` 是审计事实进入通用 Buff 目录的严格边界。它只接受数据源存在、没有未解析根载荷、没有尚未表达的生命周期动作且属性目标为 `Specific` 的定义；属性名称与八槽值保持原生语义，不转换成旧版状态快捷项。任一条件不满足都会抛错，不能生成无行为 Buff 或部分定义。
- 正式干员 DSL 会把可完整转换的 Buff 定义直接写入对应 `applyBuff.definition`，不依赖干员级 Buff 旁表。`*.audit.json` 仍保留按 ID 去重的原始事实，便于审计和统计；`*.skills.audit.generated.ts` 属于宽松审计产物，复杂 Buff 尚未闭环时可以只保留身份，但不得被当作完整运行时配置。
- Buff 生命周期转换位于 `buff_definition_compiler.py`。转换器会拒绝事件动作、光环、栈效果和未解析载荷，避免把复杂 Buff 静默降级成只有持续时间的空壳。后续应让 Buff 生命周期复用通用动作序列，再逐类缩小拒绝清单。
- 技能施加 Buff 时，`blackboardAssignments` 先在当前技能实例的动作黑板中求值，再由 `CatalogBuffOperationTarget` 按稳定 `buffId` 解析只读定义并创建实例。定义黑板不会被修改；覆盖值只属于本次实例，未知 Buff 身份会立即失败。目录目标同时按统一战斗帧间隔推进 Buff 生命周期；仍携带旧式 `durationSeconds` 或 `effectiveness` 的手写动作在迁移前继续由既有执行器负责。
- `CreateBuffAction` 的接收目标与 Buff 来源是两套独立语义。生成事实会保留 `buffSource` 以及 `ContextTarget` 使用的 `buffSourceContextKey`；只有上下文目标组的生产链能够证明实体身份时，才允许把来源编译为 Next 的 `caster` 或 `enemy`，不能凭 `smart_target` 等局部组名猜测。
- `CreateBuffAction` 审计层现已保留原生目标来源、目标组、创建次数、Buff 来源和是否继承施法信息。正式 DSL 支持单 Buff 动作从动作黑板读取创建次数，并按原生 `int counter < float count` 规则执行；动态次数的多 Buff 动作在引入保持整组循环顺序的结构前仍会拒绝。目标只接受已闭环的单敌人/施法者身份，来源只接受当前已证明的 `ActionSource` 分支。技能运行时会为每次实际启动分配单场唯一施法序号，并在步骤执行时连同来源技能和当时已产生的未返还技力消耗复制给 Buff；该身份不进入项目存档。
- `ExtendBuffAction` 会在区间开始时固定当时匹配到的 Buff 实例，并调用不可结束状态；区间结束或技能中断时只释放这些固定实例，不会包含区间内后来创建的同 ID Buff。有限时长仍持续递减，结束请求被阻止后才把 `tagsAfterTriggerExtendBuffAction` 临时挂到所属实体；恢复可结束时仅在剩余时长严格小于零时立即补结束。生成器当前只编译证据已闭环的施法者 `Id` 查询，其他目标或标签查询继续报错。
- `ignoreBuffIds` 是逐技能的显式审计豁免，只用于已确认的表现 Buff，不是按命名或分类自动猜测。被忽略的依赖仍保留在生成审计数据中，只有正式技能序列不执行它；出现新的未识别 Buff 时生成器仍会失败。
- 单敌人投影会把根时间轴中直接出现、目标可确定为敌人的 `ChannelingAction` 按原生单精度计时规则展开为共享的一次性节点；伤害、条件、Buff、资源和投射物解析器因此读取同一组触发帧。以 `Owner` 为扫描目标的引导只有在 tick 子序列完全不读取当前 `Target` 时才可展开；一旦依赖该输入身份仍立即报错。嵌套在其他语义动作中的引导也不会被猜测性提升。若条件树的每条叶子都按相同顺序生成同一批能力实体，且其他叶子动作只把 `target_in_range` 赋值为 `1`，清单可用 `collapseSingleEnemyAbilityEntityBranches` 显式声明按固定单敌人模型折叠；完整条件树仍保留在审计输出中。
- `SpawnAbilityEntity.assignEntityBlackboard=false` 时，生成器接受空赋值数组，以及客户端编辑器留下的唯一已知空占位项：目标键、输入键和字符串值为空、直写关闭、数值类型且值为零。关闭状态下出现任何其他赋值形状仍会立即报错；该兼容只消除无语义序列化噪声，不会吞掉真实实体黑板写入。
- 能力实体伤害若使用 `CheckTimedMarkerCondition -> DamageAction -> CreateTimedMarker`，生成器会解析父实体传入的标记身份和持续时间，并按原生 Sequence 返回值短路语义去重。同一目标在标记存续期间只保留首次有效命中；庄方宜前两段强化普攻的四个剑气共享 0.4 秒命中标记，因此各自只造成一次总倍率伤害，不能简单展开成四次伤害。
- 回能序列若使用动态动作黑板的 `0` 初值、回能后赋值为 `1`，生成器会保留原始三次配置供审计，但正式调度只执行同一动作实例中的首次回能。该规则要求实体数量检查、比较、回能和赋值四个动作连续且字段完全匹配；声明缺失、初值非零或非动态黑板都会立即报错。
- `TickIntervalAction` 当前只投影字面量固定间隔且成功/失败分支各有一个等价直接伤害的形状。生成器按原生 `float32` 秒计时器逐帧累计：动作在区间起始帧立即执行，每次宿主更新至多追赶一次，结束帧仍会执行一次更新。因此 `0.07s` 等非整帧周期无需舍入。动态间隔、显式逐帧执行以及不对称伤害分支仍会拒绝；两侧都没有直接伤害的周期动作继续保留在审计层，不会误报为周期伤害。
