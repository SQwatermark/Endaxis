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
- 本文更新前的 HEAD：`1f7ae2f2 feat(next): audit healing and add external hit facts`；实际 HEAD 始终以 `git log` 为准。
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

- 单次模拟的场景输入和完整运行结果现在组合成一个 `PublishedScenarioSimulation`。新模拟在局部数据中构建，成功后一次性替换已发布快照；等待和失败期间继续展示上一份完整结果，不再分别更新全局时间映射、效果条、命中与诊断，也不在模块级全局变量中保存某次模拟的中间信息。
- 模拟服务记录编译、预检、运行和投影等阶段的墙钟耗时；时间轴底部新增实时性能审计，可查看最近样本、阶段占比、预算超限和最慢阶段。该审计衡量的是编辑交互路径的实际耗时，不改变战斗规则。
- 技能块拖动期间持续节流模拟，但视觉位置不等待模拟回执。此前实时投影硬限制为每 100ms 一次（约 10Hz），导致技能块逐指针事件移动而其他模拟投影明显跳动；当前已提升为约 30Hz，并在每次新拖动的第一次有效位移立即触发，不继承上一轮节流窗口。主块实际起点直接跟随鼠标；由该技能产生的时间膨胀投影按同一实际位移即时平移，松手后保留预览，直到对应场景的新模拟快照原子发布，避免旧回执导致回弹。视觉语义已与旧版对齐：常态只在来源技能块内显示从左侧开始、按持续量裁剪的流动动画；悬停来源块或选中一个/多个来源块时，才在全部轨道纵向展开对应真实起止区间的黑色阴影，并在中央显示持续秒数。
- 冻屏拖动遵循旧版已经验证的因果边界：按下时保存技能的逻辑起点和已发布实际起点，拖动时用“按下逻辑起点 + 鼠标实际位移”写回逻辑帧。不得把包含被拖技能自身冻屏的整局 `actual -> logical` 逆映射用于该技能，否则技能块会被自身冻屏推到阴影右侧，松手再回到阴影左侧。冻屏源本身的开始位置由手势决定，它的冻屏只重排后续行为。
- 当前自动测试覆盖上述锚点计算、旧投影保留和原子发布；仍需在 `/next/timeline` 手工复验截图中的 Arclight 终结技路径，尤其是跨出阴影、阴影跟手、松手不回弹及位于冻屏后的其他技能块稳定性。

## 5. 最新验证基线

当前验证结果：

- Python 生成器规则测试最近基线：301 项通过；敌人 rank 提取器测试：2 项通过；能力实体提取器测试：2 项通过；
- 桌面已从 AKEDB 下载当前 `1.4.4@9433094-12` 五张 TableCfg，以及 2026-08-15 `sharedRevision` 公开清单中的 2459 个 SkillData、2678 个 BuffData；两者与 manifest `latest` 配对。当前全量审计基线仍为 30 名、320 个入口、318 个可解析、281 个可编译，完整干员 11 名。诀（`arcane`）已作为 `outputStage: audit` 的 11 技能样本生成三份审计产物，但尚未生成或注册正式 `OperatorDefinition`。`seal_total -> seal/listener -> 隐藏结束技能` 的 Buff 所有权、事件响应和本地时间线已经闭环；当前无敌方主动行为模型中 `InterruptAction` 归约为不阻断后续动作的零效果。`EntityBB_wisd_greater_will` 面板桥也已由基础被动自动生成并接入共享实体黑板。两个原生终结技入口的稳定身份也已有严格证据：首段 Buff 把 `UltimateSkill` 换成二段，二段第 0 帧换回首段；诀在 manifest 明确声明 `arcana` 为运行时替换形态后，生成器才把闭环关系渲染为双向 `changeSkillSlot` 并在正式技能组使用 `replacementSkills`。普通/强化技能默认仍是可直接拖放的独立稳定技能组，不能从原生换技动作自动推断为不可放置形态。当前诀的干员级阻塞转为形态展示、形态感知连携注册与天赋潜能对照。
- `npm.cmd run type-check:next`：通过；
- 能力实体模板、目录、操作执行器和场景装配聚焦测试通过；新增步骤引起的庄方宜契约与三语言帮助文本回归已覆盖。
- 本文更新前 `npm run type-check:next` 通过；Next 全量 Vitest 为 175 个文件、1046 项全部通过。新增回归覆盖 Buff 点燃、队伍排除来源目标、技能冷却调整、旧式 Buff 结束、延迟接续施放的 `beforeCastSkill` 顺序与装配接线、Endministrator 冻结点燃生产场景、伤害修正复合条件、Buff 成功加入事件边界，以及 Last Rite 队伍 Buff 的宿主相对生产模拟。
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
5. 在 `/next/timeline` 手工验收冻屏拖动和能力实体递归编辑：Arclight 终结技应位于鼠标落点，阴影同步移动，松手不回弹；`Pulse` 的 `SkillSetting` 必须等原生导出证据，不做默认值；
6. FractureAction 必须等完整操作链和运行时语义齐备后再接，不做只解析名称的半成品；
7. 以后公共 JSON 的 `sharedRevision` 改变时必须重新确认 manifest `latest`，不得与旧表混用。

治疗正常链已经接入：`heal` 步骤由施法者四维属性、倍率和加值计算，按执行帧解析主控或最低生命比例目标，写入场景级干员生命账本，并在满血时仍记录原始治疗量、实际治疗量和溢出治疗。Ember 连携与 Gilberta 战技/连携已从 `unmodeledActionTypes` 退出；Gilberta 外层 `explo >= 2` 在唯一敌人模型下严格折叠为假，因此对应分支虽完整保留在生成定义中，标准单敌人场景不会触发。外部受击事实不是治疗动作、快照或回执成立的前置，也不应为展示治疗而扩展。

本轮已从 AKEDB `latest=1.4.4@9433094-12`、`sharedRevision=2026-08-15T09:56:33.735394+00:00` 拉取五张版本化 TableCfg、2459 个 SkillData 和 2678 个 BuffData。当前治疗阶段验证为 manifest 全量生成与 `--check` 通过、Python 规则测试 303/303、Next 类型检查通过、Next 全量 Vitest 177 个文件 1058/1058。普通/强化技能仍是可直接拖放的独立技能，只有 manifest 明确声明的 `arcana` 走运行时换槽。

Arclight 战技的 `OnBuffEnhanceChanged` 已闭环：静态面板四维进入共享实体黑板，严格的 `StoreAttributeValue(FinalNonConverted)` 生成黑板计算，叠层达到阈值后按智识计算 `pulse_up`，给全队施加限时 `electricDamageIncrease`。原生 `isConvertedAttribute=true` 不再作为未知载荷丢失，而是保留 `converted` 修正来源；运行时伤害快照会叠加 Buff 产生的动态伤害属性。`buff_common_vfx_char_atk_up` 仍保留在 audit；生成器现保存 stack effect 动作类别，并且只有定义完整证明“唯一行为是非空 `EffectAction` stack effect”时才自动从战斗序列剔除，不能按 ID 或命名泛化。条件分支中的 `buff_common_obtain_ultimate_sp` 复用现有“按技能消耗为全队回终结技能量”步骤，不内联成空 Buff。

达坂第一天赋的剩余阻塞已经关闭：原生反编译证明百分比冷却减少使用技能配置的基础周期；旧式 `FinishBuffAction` 按已证明的 Id、目标和来源限制进入统一 Buff 结束操作。`OnOutputDamage -> 减少连携技冷却 -> 消耗准备层 -> 结束自身` 已完整参与模拟，达坂 9/9 生成。Endministrator 的三类 `igniteEventAction` 已形成内联 Buff 响应，`IgniteAction` 从技能生成 `igniteBuffs` 并携带实际点燃来源；生产场景已验证连携创建冻结、终结技直接/条件/点燃伤害和冻结结束处于同一次运行。Last Rite 普通战技也已关闭原子阻塞：`main_start -> self -> party main Buff` 完整内联，队伍实例以实际宿主执行主控/标签/黑板条件，同事件同优先级响应在一个注册回调内保持独立短路，敌方分身 Buff 以当前创建来源干员执行伤害并保留原始施法快照。manifest 已移除 `main_start/self` 的 `unmodeledBuffIds`，双轨生产回归验证队友末段普攻触发的分身伤害和元素附着均归因到队友。当前 manifest 全量生成通过：佩丽卡及另外九名干员生成正式定义，庄方宜与诀保持审计阶段；`tmp/` 未纳入修改或提交。

选择原则：优先能够从数据到生成 DSL、编译、运行时和测试形成闭环的机制，而不是单纯增加解析计数。

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
