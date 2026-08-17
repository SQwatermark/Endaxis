# 当前任务快照

> 更新时间：2026-08-18（Asia/Shanghai）
> 本文是变化最快、优先级最高的交接入口。完全不了解背景时，先读 [交接文档首页](./README.md)，再读本文和 [Next 文档入口](../next/README.md)。

## 1. 当前目标与边界

当前工作位于 `feature/next`，目标是在不修改旧版实现的前提下建设 Endaxis Next：以干员、武器、装备、敌人和用户操作序列为输入，准确模拟战斗过程，并由统一结果生成资源曲线、状态、伤害、诊断和日志。新版 UI 尽可能保持旧版布局与交互。

固定优先级：准确与功能完备 > 清晰易维护 > 性能。游戏规则必须有解包、反编译、C# Combat Spec 或已验证游戏样本依据，不用猜测填空。

当前继续推进干员 SkillData 到 Next DSL 的完整转换与模拟贯通。每轮只处理能够形成解析、DSL、运行时和测试闭环的机制，避免为了提高统计数字而静默省略动作。

## 2. Git 基线

- 当前桌面端仓库：`D:\Projects\Endaxis`（本文其他位置所称“远程”即当前运行环境）
- 分支：`feature/next`
- 本文对应的最近实现提交：`29ad626c test(next): verify generated entity owner monitor`；实际 HEAD 始终以 `git log` 为准。
- 紧邻提交：`65e2526c feat(next): migrate ability entity owner monitor buffs`
- 再前提交：`0f43a500 feat(next): host buff lifecycles on ability entities`
- `tmp/` 是未跟踪临时目录，绝对不要提交。
- 工作树可能含用户改动；始终先运行 `git status --short`，不要重置或回退不属于当前任务的内容。

大潘代码与生成产物已提交。本文的交接更新会作为独立文档提交；新会话仍应以 Git 实际 HEAD 为准。

## 3. 本轮已经完成

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
- 1.4.4 `GameAssembly.dll` 的 `SetAbilityEntityDuration.ExecuteInternal` 已直接证明：`setMultipleTarget=false` 经 `GetActionTarget` 只应用一次，`true` 才经 `GetTargets_Dispose` 枚举整组。生成器据此只对有此前确定逻辑生成证明的命名 Context 建立 0/1 单例来源，并复用 `forEachContextTarget`；未知或多实例键继续失败关闭。Li Zhiyan 的 `bunshin1…4` 局部时长形状已有生产者证据，但正式单例来源仍等待其位置目标逻辑生成闭环。
- 能力实体 `TimeDilationAction.effectTargets` 已从源解析阻塞改为类型化审计：保留 owner-spawned 与可选 GameplayTag 查询，编译阶段明确报告实体时钟/子技能调度缺失。Tangtang、Yvonne、Li Zhiyan、Liino 的连携技现统一暴露该运行时边界；不得把它误认作纯表现 `EffectAction`。
- `spawnAbilityEntity` 已贯通 DSL、严格校验、编译、标准模拟和生成器。正式生成产物目前覆盖 Arclight 终结技、Gilberta 战技/终结技、Lifeng 终结技；庄方宜审计产物也保存了对应步骤。DSL/编译器/运行时可在生成步骤内携带已解析子时间轴；每个实例独占游标，复用统一序列解释器，以实体黑板为回退，并消费与寿命相同的实体局部时间。生成器已把 Arclight、Gilberta 的严格子图，以及庄方宜普攻二/四的固定周期子图和普攻五的伤害/回能/黑板修改，原子迁入局部时间轴并删除父时间轴投影；原生 `assignBlackboard` 会先复制生成动作黑板，再应用显式实体赋值。Lifeng 终结技仍生成逻辑实体，但其子时间轴因新发现的条件跳转已退出内嵌，暂留父投影；该回退不代表跳过语义已经模拟。
- 子时间线直接 `FinishOwnerAction(Owner)` 已经按原生 RVA `0x06CF5E28` 的目标解析证据接入统一实体目录。运行时允许子技能结束自己的宿主并对称收尾；生成器只接受字段精确的 plain Owner 形状，保留但不解释 `skipDieDisplay`，同帧等价结束去重。庄方宜普攻二、四、五的审计输出新增局部帧 897 结束。条件结束仍未闭环；Buff 生命周期结束只开放下述 Gilberta 严格组合。
- 能力实体 Buff 的运行时所有权桥已接入：`currentAbilityEntity` 目标只允许出现在已有实体作用域内；首次施加时惰性创建标准 Buff 容器，与子技能共享实体黑板并消费该实体的四路时钟，宿主结束时统一清理。Buff 生命周期上下文保留同一实体句柄。Gilberta 战技的 `buff_chr_0013_aglina_normal_skill_monitor` 已作为首个真实 Owner-Buff 严格迁移：只接受字段精确的 `OnBuffTrigger -> CheckHp(Source ratio <= 0) -> FinishOwnerAction(Owner)`，每 0.15 秒查询已登记的来源死亡事实并结束宿主。标准装配回归直接编译真实生成技能、使用正式实体模板，并验证 cast identity、Buff 周期、来源死亡通知、宿主清理和 `sourceDied` 回执的完整链路。标准玩家伤害环境没有干员生命账本，不会猜测死亡；Yvonne 与 Li Zhiyan 的复杂 Owner-Buff 仍因未建模动作/Aura 失败关闭。
- 桌面 `GameAssembly.dll`（SHA-256 `0C5573679BC6DEC2D068A14335466DB7CCF20AF9BAE2B983FB9D45677D80FFCE`）的静态反汇编进一步确认：`FinishOwnerAction.ExecuteInternal` 解析目标后按 Entity `ObjectType` 分派；`AbilityEntityInfo.type` 原生返回 `0x200`，走通用完成路径，而不是 `0x20` 的 Release 或 `0x40` 的投射物路径。Fluorite 表面上的 90 帧结束后仍有 149 帧伤害并非反证：子技能在 0–89 帧还有两条 `JumpToAction`，分别以目标死亡跳到 89、目标持有终结技 Buff 跳到 149，两个结束属于替代路径。Lifeng 终结技也在局部 67 帧以 `isCombo == 0` 跳到 150，跳过后续 121 帧动作。`JumpToAction` 在首次执行时立即检查直接条件，此后在动作存续期间每 Tick 重试，首次成功后置位并只调用一次宿主 `Skill.JumpTo`；空条件立即成功。原生 `TimelineActionProcessor.JumpTo` 对起始时间严格早于目的帧的待执行序列调用 `SequenceAction.JumpToEnd`，后者逐个把尚未执行的子 Action 标为结束；已开始且结束时间不晚于目的帧的序列会 End（动画序列另有下一帧完成队列），跨越目的帧的活动序列保留，起始时间恰等于目的帧的序列不被跳过。原生 `TimelineActionProcessor.OnTick` 还确认 `m_jumpedInThisFrame` 会立即终止本帧内部处理，目的帧动作在下一 Tick 进入。Next 现有统一 `jumpTimeline` 控制步骤：首次执行检查可选条件，失败后在区间内每 Tick 重试，成功只请求一次；普通技能和能力实体子技能均通过宿主端口改写各自局部帧，并由支持执行中重入的 `TimelineActionProcessor.jumpTo` 迁移调度游标。当前 1.4.4 公共 SkillData 共找到 436 条跳转、其中 413 条启用；297 条没有直接条件，其余条件和外层容器形状很多，不能用两个干员样本概括。生成审计现保留精确 `actionPath`、结构化直接条件、解析支持状态和唯一根动作证明。生成器只放行“所在 Sequence 唯一根动作 + 精确根路径 + 前向目的地 + 全部直接条件可编译 + 每个目的区段显式结束”的子集；Fluorite 两条跳转满足该证明，战技已在第 10 帧生成能力实体，局部执行 89/90 与 149/150 两条替代路径，父时间轴 99/159 帧固定投影已删除，`battleSkill` 跳转能力缺口也已移除。Lifeng 的路径明确位于 `IfElseAction.succeedActions`，继续退出子时间轴内嵌；其直接条件为空仍不会被误读成无条件。线性子图的首结束守卫继续保留，跳转子图则逐目的区段验证终止性。
- `OwnerSpawnedEntityFinder + TagValidator` 的 Context 来源证据仍完整保留。统一 `findOwnerSpawnedAbilityEntities` 步骤已经能够按当前干员和原生标签查询逻辑目录，把完整组写入本次施法 Context，并可把数量写入动作黑板复用现有比较条件。Avywenna 三组长枪与 Tangtang 水体四个守卫仍需实体目标 Buff、投射物来源和生成器转换，不能提前宣称闭环。完整盘点见 `docs/research/ability-entity-context-target-audit.md`。
- Context 组现在可按稳定句柄同步迭代；body 通过显式 `currentTarget` 读取、比较或 `Assign` 有限剩余时长。若 body 返回 false，运行时会因原生跨实例短路规则尚未证明而显式失败，不能猜测继续/终止。原始语料共有 10 个时长设置、2 个当前时长检查和 1 个目标设置；当前只接入全部已观察时长动作共有的 `Assign` 子集，目标设置仍阻塞。
- 同一桌面 `GameAssembly.dll` 的进一步反汇编已确认 `TimeDilationAction` 的 Entity 分支逐个解析 `effectTargets` 并调用 `StartEntityTimeDilation`，实体实例逐帧把曲线倍率安装到目标 Entity。Next 时间膨胀运行时已将局部目标泛化为稳定实体 ID，能力实体有限寿命和已内嵌的子技能时间轴都会消费 `ability-entity:<instanceId>` 对应的实体倍率，并有标准装配回归覆盖。两个正式生成子图已迁移，但 owner/tag 目标可跨技能选中尚未迁移的实体；在建立干员级全生成点证明前，Entity 目标阻塞保持不变。
- 全局/终结技时间动作原本还会在 `ignoreTargets` 排除 owner-spawned 或命名 Context 中的能力实体；过去丢弃这些目标没有运行时影响，但能力实体开始消费时间后会造成错误减速。生成中间层现已保留这些查询，正式 DSL/执行器会在动作执行时解析 owner/tag 或 Context 稳定句柄并加入全局排除集合；全部生成产物已重建。Entity 作用目标复用同一查询协议并有装配测试，但生成器仍因子 SkillData 调度缺口而拒绝输出。

## 4. 最新验证基线

当前验证结果：

- Python 生成器测试：267 项通过；敌人 rank 提取器测试：2 项通过；能力实体提取器测试：2 项通过；生成器 `--check` 通过；
- 桌面已从 AKEDB 下载当前 `1.4.4@9433094-12` 五张 TableCfg，以及 2026-08-15 `sharedRevision` 公开清单中的 2459 个 SkillData、2678 个 BuffData；两者与 manifest `latest` 配对。严格生成已越过全部 11 个登记对象，当前全量审计为 30 名、320 个入口、318 个可解析、280 个可编译；新增的六个可解析入口来自能力实体时间膨胀目标的类型化保留，不代表该运行时已实现。
- `npm.cmd run type-check:next`：通过；
- 能力实体模板、目录、操作执行器和场景装配聚焦测试通过；新增步骤引起的庄方宜契约与三语言帮助文本回归已覆盖。
- `npm run test:next`：169 个文件中 168 个、984 项中 982 项通过；仅余既有 `runStandardPlayerDamageScenarioSimulation.test.ts` 两项时间线停滞。
- 全仓 `npm test -- --run`：243 个文件中 235 个、1463 项中 1450 项通过。13 项失败里两项是既有 Next 时间线停滞；其余旧版/UI 工作树回归不属于能力实体链路，未在本任务中修改或掩盖。

测试数量只代表既有断言通过，不代表所有游戏机制已经得到证明。

## 5. 当前生成器状态

目录：`scripts/generate_next_operators`。

生成目录中，除首个佩丽卡样本外，已有九名技能主体可完整转换并注册的干员：Arclight、Gilberta、Lifeng、Estella、大潘、Akekuri、Fluorite、Endministrator、Last Rite。

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

## 6. 下一步建议

下一会话应先重新确认工作树和提交，再从下列候选中只选一个推进：

1. 扩大能力实体子图动态迁移的严格覆盖，并为 owner/tag 查询建立干员级匹配生成点闭包；只有闭包内所有生成点都已迁移时才开放 `effectAbilityEntityTargets`；
2. 若继续 Fluorite，先把 `JumpToAction` 的条件选择、目的帧进入规则和被跳过动作范围从原生行为闭环到运行时；不得再次把替代路径线性叠加。否则闭环 Li Zhiyan 的位置目标逻辑生成，使已有单例 Context 证明能够承载八个时长赋值；
3. Gilberta 的严格来源死亡监视器已经作为首个真实 Owner-Buff 闭环；下一步从 Yvonne 或 Li Zhiyan 中选择一个可独立证明的最小动作子集，但不得忽略其余条件、伤害、资源、Buff 结束、owner/tag 实体结束或 Aura。之后再处理 Camille 的设置目标和 Avywenna 的投射物来源；
4. FractureAction 必须等完整操作链和运行时语义齐备后再接，不做只解析名称的半成品；
5. 以后公共 JSON 的 `sharedRevision` 改变时必须重新确认 manifest `latest`，不得与旧表混用。

选择原则：优先能够从数据到生成 DSL、编译、运行时和测试形成闭环的机制，而不是单纯增加解析计数。

## 7. 恢复工作清单

1. `git status --short`，确认没有把 `tmp/` 或用户文件带入提交；
2. `git log -10 --oneline`，以实际 HEAD 为准；
3. 阅读本文、`docs/next/09-status-and-roadmap.md` 和 `scripts/generate_next_operators/README.md`；
4. 查看最近生成审计，区分“技能主体完整”和“天赋/潜能/保护效果完整”；
5. 修改前先找到数据或反编译依据；
6. 新增行为同时更新生成器测试、Next 类型检查、Next 测试和文档；
7. 不修改旧版代码，不提交 `tmp/`，不为尚未发布的 Next 中间存档保留兼容脚手架。

## 8. 跨项目背景

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
