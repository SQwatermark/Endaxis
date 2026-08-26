# 当前任务快照

> 更新时间：2026-08-26（Asia/Shanghai）
> 本文是变化最快、优先级最高的交接入口。完全不了解背景时，先读 [交接文档首页](./README.md)，再读本文和 [Next 文档入口](../next/README.md)。

当前主线是在 `refactor/common-game-data` 分支重写统一 TypeScript 游戏数据编译器。唯一新入口为
`tools/game-data-compiler`；旧 Python 干员/装备生成器只保留为迁移 oracle，不再承载新架构。

### 2026-08-26：武器运行定义全量审计达到 77/77

- 正式武器运行批处理已不再停留在“安装根 Buff”：被动 AbilityEvent、动作黑板、公共条件/动作序列
  和递归 Buff 闭包会作为一个整体编译。当前真实 1.4.4 批次已达到 **77/77** 可完整生成，共写出
  79 个生成文件；生成器仍保持原子写盘，任何后续来源阻塞都不会留下半批正式目录。
- `OnAfterSkillApplyCost` 已依据 combat-spec 的 `_ApplyCost` 顺序接入公共技能 AbilityEvent：费用
  实际支付成功后、同帧时间轴动作前同步触发；费用失败不触发。它不是武器专用事件，也没有被近似成
  `beforeCastSkill`。
- `OnCharDeckAttrChanged` 的响应按构筑边界折叠为配装初始化程序。原生 Deck 快照只在非战斗构筑
  刷新链末尾通知，而 Next 场景在开战后不修改配装；因此保留 `CompareDeckAttr` 和动作顺序，只在
  面板/Deck 属性完成解析后执行一次，不新增战斗内伪事件。`wpn_funnel_0016` 已由此闭环。
- 公共控制流允许领域在严格证明语义等价时折叠 `ForEach`。当前只接受
  `CharacterTeamFinder + ExcludeOwnerValidator`，且循环体完全由对当前 Target 的 Buff 施加组成；
  该形状等价为 `partyExceptCaster` 集合施加，`wpn_sword_0016` 已闭环。含条件、身份读取或其他动作的
  循环继续失败关闭。
- `CheckObtainAtbType` 不再把未勾选维度错误收窄为固定值：外层监听广义 `spGained`，序列内的
  `eventSpGainMatch` 分别保留来源/获得方式筛选；未勾选轴是通配符。主控干员 Buff 目标、属性治疗、
  事件伤害/治疗标签、消费层数和 ActionOwner/Target 身份比较也已进入同一公共投影与运行时。
- `CheckBuffIdInContext` 已先由 1.4.4 RVA `0x03F34960/0x03F35F80` 在 combat-spec 闭环：`checkType`
  是 ID/Tag 判别字段，ID 列表任一匹配，Advanced ID 可从动作黑板读取，命中后可写回事件 Buff ID。
  Endaxis 来源 IR 改为判别联合，四把武器由公共 `eventBuffIdMatch` 闭环，没有武器特判。
- `wpn_funnel_0005` 的 `SaveCharTypeId -> ForEach teammate -> Not CompareString` 已整体投影为
  “排除施法者及同 CharacterTable.charTypeId 队友”的集合目标。Next `element` 是该原生字段的一一
  映射，场景装配显式把身份传入运行程序；不是从技能伤害元素反推角色身份。
- `wpn_sword_0017` 随后暴露的 Source 目标 Buff 实例计数也复用公共
  `SaveBuffStackNumAdvanced(Id + BuffCount)` 与统一 ActionSource 映射闭环。
- 本轮验证：`type-check:game-data`、`type-check:next` 通过；游戏数据测试 **62 文件、290 项**，
  Next 测试 **213 文件、2199 项**全部通过。聚焦覆盖费用事件时序、技力事件通配、主控 Buff 施加
  和两类 ForEach 折叠；全量生成命令已成功输出 77 把武器。真实输入和审计输出仍只在 `tmp/`，不得提交。

### 2026-08-26：公共 AbilityEvent 程序边界开始落地

- 新增领域无关的 `abilityEventProgram.ts`：按来源顺序逐事件、逐 `SequenceAction` 生成独立程序，
  不再允许按事件把多条序列拼成一条。Buff 运行投影已经切换到该入口；一个事件下的两条序列现会
  保留为两个同级注册项，而不是把第二条接到第一条条件短路之后。
- 公共层保留数值优先级和稳定注册顺序。combat-spec 已证明原生按优先级降序、同级先注册先执行；
  当前资产已审计的 `Default + 0` 映射为 0，其他 `priorityLevel/priorityOffset` 在完整映射有证据前
  直接失败关闭，不再静默归零。
- `EquipmentEventHandlerDefinition` 与运行时已贯通可选数值优先级，构筑编译后总会物化为整数，
  事件中心按同一公共排序规则执行。现有旧定义省略时继续严格等价为 0。
- 真实武器动作库存仍为 64 个带事件程序的唯一被动、17 种原生事件。下一步继续把
  `buffRuntimeProjection.ts` 中的 Action/Condition 序列投影迁到公共编译模块，再由武器使用同一
  投影生成事件处理器；在原生 AbilitySystem 事件和当前高层语义事件的注册端口统一前，正式目录
  仍保持 fail-closed。

本轮聚焦门禁：游戏数据编译器 61 文件、281 测试通过；`tmp/` 下仅有本地库存脚本与机器分析输出，
不得提交。

### 2026-08-26：武器完整来源图 77/77

- 上一节列出的三类来源阻塞已经全部按 combat-spec/1.4.4 机器码闭环：
  `CheckConsumeBuffLayer`、`SaveCharTypeId + CompareString`、`CreateBuffAttachingSkill`。武器完整
  来源图由 **67/77 提升为 77/77**，运行依赖为 226，直接引用 BuffData 为 96。
- `CreateBuffAttachingSkill` 不是武器专用创建协议。原生类继承 `CreateBuffAction`，只在成功创建
  钩子中从当前 `CastSkillContext` 取技能并调用 `Skill.AttachBuff`；技能结束时正序结束这些 Buff。
  combat-spec 与 TypeScript 来源 IR 都复用公共 Buff 创建结构，仅额外保留
  `lifetimeOwner = currentCastSkill`，禁止复制一套武器 Buff parser。
- 三份武器 Buff 的 `FinishBuffAdvanced.buffOwner = Source` 已按 combat-spec 的公共
  `TargetSettings` 语义投影为 Endaxis `caster`；不能把多数 Buff 使用的 `Owner -> buffOwner`
  错当成唯一合法组合。Buff 运行闭包现为 **108/112**，其余 4 项均为已登记木桩场景省略，
  未知动作/目标阻塞为 0。
- 游戏数据编译器门禁为 **60 文件、279 测试**，专用类型检查通过；combat-spec 新增聚焦测试通过。
  combat-spec 全套测试当前 1209/1223，通过之外的 14 项来自本机更大的外部资产扫描（缺少旧装备
  artifact 或扫描到新增敌方资源导致旧固定计数变化），与本轮新增聚焦测试无关，不能宣称全绿。

下一步不是直接接正式武器目录，而是把 `buffRuntimeProjection.ts` 中可复用的条件、序列与 AbilityEvent
投影抽到公共 Action 程序编译层。武器被动的 64 个事件程序要保留事件身份、每条 SequenceAction 的
优先级/注册顺序和逐级动作黑板，再生成 `EquipmentEventHandlerDefinition`；Buff、武器和装备只能在
公共投影之上处理各自的安装与生命周期特性。正式批处理在这一步完成前继续 fail-closed。

### 2026-08-26：武器完整动作程序审计纠偏

- 此前的 **77/77 静态定义** 和 **103 个 Buff 可编译 + 4 个场景省略**只覆盖静态词条、安装引用与
  Buff 递归闭包，不能代表被动 `SkillData.actionGroupData` 已经执行闭环。117 个唯一武器被动中有
  64 个携带事件程序，涉及 17 种原生 AbilitySystem 事件；现有武器运行投影尚未编译这些程序。
- 公共被动来源解析已改为读取完整 Action 叶子，不再沿用只为引用闭包服务的 `untracked` 叶子。
  全量 1.4.4 重新审计为 **67/77 可进入完整来源图**；另外 10 把被三种尚无 combat-spec 语义的
  Action 严格阻断：`CheckConsumeBuffLayer` 5 把、`SaveCharTypeId` 1 把、
  `CreateBuffAttachingSkill` 4 把。不得根据旧 Python 或名称猜实现。
- 武器运行依赖现在强制携带完整动作图；只要时间轴或被动事件非空且尚未投影，正式运行批处理就
  报 `weapon passive SkillData action program is not yet compiled`，不会再静默生成缺少被动的武器。
  曾暂时生成的 77 把候选已清除，生产仓库继续使用现有稳定武器定义；生成注册辅助层尚未接生产。
- 正式生成入口按武器独立收集来源错误，再与未编译动作程序诊断合并后一次性失败。当前真实批次
  同时报告 10 条来源 Action 阻断和 54 条其余武器的未编译程序，共 64 条诊断；任一阻断都发生在
  渲染和原子写盘之前，不会留下半批生成目录。
- 已修复真实生产试跑暴露出的三个公共问题：Buff 伤害条件的数值来源类型、治疗输出/承疗属性映射，
  以及无事件 Buff 生命周期中的 `ActionSource -> buffSourceId`。这些修复属于公共运行时，不是武器
  专用补丁。

下一步先依据 combat-spec/反编译证据补齐上述三种 Action 的来源语义，再从公共 Buff 投影中抽出
可配置执行上下文的 Action 程序投影，并为装备贡献增加公共 AbilityEvent 注册边界。武器只负责提供
被动安装和逐级黑板；事件顺序、来源/目标身份、优先级和序列执行必须复用公共机制。完成 64 个事件
程序的严格投影及生产模拟前，不接通正式生成目录和默认注册。

### 2026-08-26：武器 Buff 执行闭包 107/107 收口

- 77 把武器仍为 **77/77 静态定义、226 条运行依赖**；91 个直接引用 Buff 递归展开为 107 个
  运行时节点。当前 **103/107 可由公共 Buff 定义真实编译，4/107 为逐项登记的纯表现或固定木桩
  场景省略，剩余阻塞 0**。
- `beforeAddedBuff` 已按 combat-spec 的原生顺序接在来源方 `beforeOutputBuff/outputBuff` 之后、目标
  Buff 真正加入之前；目标条件、事件载荷和编辑器查看入口使用同一公共事件模型。
- `InstantModifyAttributeForHeal` 与 `CheckHealTag` 已进入公共治疗包，计算前只修改本次治疗的
  `HealOutputIncrease/HealTakenIncrease` 快照；不为武器另建治疗公式。
- `InstantModifyAttributeForPoise` 已按 combat-spec 的 `BeforeCalculation` 证据进入公共失衡包。
  `buff_wpn_claym_0008` 的“主控 + 普攻末段”条件和 `PoiseDamageOutputScalar.BaseAddition` 均由
  通用 Buff 修饰器表达。
- `shieldConfigs` 复用既有公共护盾运行时，严格读取 `DefiniteValueCalculation`、容量、吸收类型、
  次数、优先级和耗尽行为；空 `damageAbsorptions` 按 combat-spec 证据表示全类型 1:1 吸收。
- 固定木桩场景的不可达事件由 `standardStumpScenarioPolicy.ts` 统一分类。`OnTakeDamage` 仅因敌人
  无主动行为省略，`OnTrulyExitFight` 仅因固定时间轴结束前不会离战省略；公共来源层和投影层仍
  严格，审计会输出每一条省略原因。
- 当前回归门禁：游戏数据编译器 **60 文件、274 测试**，Next **211 文件、2178 测试**，两个
  TypeScript 类型检查通过。完整审计命令
  必须同时提供 `--buff-data`；只跑武器静态层不能宣称 Buff 执行闭包完成。

本节的“收口”仅指 Buff 引用闭包；完整被动动作程序边界以上方纠偏章节为准。

### 2026-08-26：武器静态定义 77/77 与全配装运行门禁

- 新增 `npm run audit:game-data:weapons`：逐把读取 1.4.4 `WeaponBasicTable`、精确基础攻击成长、
  SkillData 与 SkillPatch；某把遇到陌生语义时独立报告，不遮蔽其余武器。当前结果为 **77/77 个
  静态定义可闭合、226 条运行依赖被发现、0 阻塞**。
- 原生 `ModifyAttributeType.Main/Sub` 必须由装备者的主/副属性解析，声明 `AttributeType` 在该分支
  不参与目标选择。旧投影错误地先按 `Wisd/Atk/HealOutputIncrease` 分流，曾误挡 17 把武器，现已
  按 combat-spec 的 `AttributeModifierTargetResolver` 纠正。
- 伤害增幅中的 `Addition` 与 `BaseAddition` 不再压成同一静态加数。正式装备定义保留真实槽位，
  战斗装配时写入统一八槽属性集，因此可以与运行时 `BaseMultiplier` 按原生阶段交互。
- `ShieldOutputIncrease` 是当前唯一木桩模型省略项，明确记录为
  `shieldOutputDoesNotAffectStumpEnemyDamage`；没有伪装成已模拟护盾，也不阻塞对敌输出口径下的完整
  转换。
- 新增仓库级横向运行门禁：77 把武器分别寻找兼容武器类型的干员，248 件单件装备分别放入合法
  槽位，随后真实放置普攻并完成模拟。当前 **326/326 通过**。
- AKEDB 身份审计以 `ItemTable.iconId` 和旧定义图标资源身份精确连接，结果为武器 77/77、套装
  23/23、无缺失、无歧义；但当前正式 AKEDB 武器定义仍只有新增的 `wpn_lance_0014`，其余 76 把
  仍由旧展示定义承载。下一步应建立正式武器生成/注册层并逐词条接入 226 条 Buff、Toggle、动作
  依赖，不能把身份可连接等同于运行行为已完成 AKEDB 重建。

### 2026-08-26：全干员技能横向门禁 301/301

- 1.4.4 机器码确认 `AbilitySystem.ActionContainer` 使用
  `DoubleBufferedPriorityQueue<SequenceAction>`：整数优先级降序；`SequenceAction.CompareTo` 在
  同级时返回 0，而队列只在比较结果小于 0 时前插，因此同级动作保持注册顺序。
- combat-spec 已把同优先级事件动作从 Unknown 提升为 Confirmed，并记录
  `ActionContainer.RegisterAction/ExecuteInstant`、`SequenceAction.CompareTo` 与泛型队列 Add 的 RVA。
  Next dispatcher 同步删除错误的同级拒绝，显式按 priority 降序、registration order 升序执行。
- Arcane 连携的两条 `beforeTakeDamage` 监听现可同时注册。生产回归先释放连携建立封印，再释放
  战技触发提前引爆，确认真实 `combo_skill_seal` 伤害回执，而不只是“不报错”。
- 当前 30 名干员、301 个基础/变体技能均可在最小合法上下文中放轴并完成正式模拟，基线为
  **301/301 成功、0 项豁免**。
- 本轮门禁：Arcane 连携生产回归、`npm run type-check:next`、Next 207 个测试文件 1838/1838
  全部通过；combat-spec `EventDispatchTests` 4/4 通过。

### 2026-08-26：根技能能力实体查询恢复

- 根技能同帧的 `FindTargetAction(OwnerSpawnedEntityFinder)` + Context Buff 施加此前只生成后半段
  `forEachContextTarget`，导致 Context 从未创建。转换器现先按模板 GameplayTag 证据生成
  `findOwnerSpawnedAbilityEntities`，再遍历结果；空结果是合法空集合，不再误报缺 Context。
- 伊冯强化普攻末段的三次 `robots` 查询和阿黛拉下落攻击的 `Sheep` 查询均已恢复。伊冯门禁还会
  先真实释放终结技，在第 61 局部帧开启强化且技能块结束后再放末段，未凭空创建机器人。
- 当前基线为 **300/301 成功、1 项精确失败**。唯一剩项是 Arcane 连携同时注册两条
  `beforeTakeDamage` 监听；原始数据均为 `Default + priorityOffset 0`，combat-spec 尚未闭环同优先级
  稳定顺序，因此继续严格失败，下一步须查原生事件动作容器与排序实现，不能依赖 JS 注册顺序。
- 本轮门禁：生成器单测 380/380、全量生成 `--check`、`npm run type-check:next`、Next 207 个测试
  文件 1838/1838 全部通过。

### 2026-08-26：多稳定输入技能槽与梨诺战技闭环

- `SkillGroup.skills` 中的多个直接技能是各自稳定的时间轴输入，不等于“一条必须整体替换的技能
  链”。槽位编译结果现可登记多个 `stableInputSkillKeys`：默认状态执行输入自己保存的定义；只有
  `ChangeSkillAction` 激活覆盖后，同槽输入才统一解析到 replacement。梨诺的 `battleSkill` 与
  `battleSkillCombo` 因而能共享不可直接放置的 `battleSkillEnd`，轴上技能 key 不会被换槽改写。
- 槽位限制解除后，梨诺普通战技暴露了 Buff 生命周期中的 `StoreCurSkillExecuteFrame`。combat-spec
  已依据 1.4.4 `Gameplay.Beyond.dll` token `0x0600E1E7` / RVA `0x06D38C10` 固化语义：动作解析
  Owner 目标，从其 AbilitySystem 读取当前技能执行秒数，乘 30 并偶数舍入；没有当前技能时返回
  false。Next 的技能根时间线继续读取自身局部帧，Buff 则经 Owner AbilitySystem 读取，不用 Buff
  存活帧或场景帧替代。
- 梨诺两个战技入口均已从全技能失败清单删除，生产回归验证先释放普通战技、槽位被 Buff 换成结束
  形态后，再从另一个稳定输入块实际启动 `battleSkillEnd`。当前基线为 **298/301 成功、3 项精确
  失败**：Arcane 同优先级事件顺序、Yvonne `robots` 和 Ardelia `Sheep` 能力实体目标上下文。
- 本轮门禁：生成器单测 379/379、全量生成 `--check`、`npm run type-check:next`、Next 207 个测试
  文件 1838/1838 全部通过；combat-spec 的当前技能帧聚焦回归 4/4 通过。

### 2026-08-26：投射物实例实体黑板闭环

- 艾斯黛拉战技的 `EntityBB_first_hit` 与汤汤普攻 5 的 `EntityBB_atk05_cnt` 均不在角色模板、根或
  子 SkillData 的黑板中，不能依据缺键异常猜零。1.4.4 原始投射物资产明确在
  `ProjectileTemplateData -> AbilitySystemData.entityBlackboard` 将两键声明为 dynamic 0；原始资产
  SHA-256 和结构事实已固化到 `src/next/data/projectiles/projectile-entity-blackboards-1.4.4.json`。
- combat-spec 现将投射物回调建模为拥有独立实体黑板的执行上下文；VFS 索引器也会从
  `AbilitySystemData` 导出该字段。Next 生成器只消费严格版本证据：同一投射物实例的命中回调共享
  键值，不同投射物实例及下一次技能运行重新初始化，不会污染干员实体黑板。
- 艾斯黛拉战技与汤汤普攻 5 已从全技能预期失败清单删除；艾斯黛拉的
  `runtimeDependencies` partial 标记同步移除。投射物批次结束时基础构筑基线为 **295/301 成功、
  6 项精确失败**。
- 全技能门禁现允许由来源与既有生产回归证明的最小合法阶段前置，但仍要求目标技能真实放轴并
  执行。洛茜三段连携先放二段，再在其 0.5 秒 QTE 有效 Buff 内放三段；`beforeCastSkill` 正常写入
  `EntityBB_Combo_QTE_Trigger`，没有补默认值。当前基线为 **296/301 成功、5 项精确失败**。
  剩余项是 Arcane 同优先级事件顺序、Liino 两项技能替换冲突、Yvonne 与
  Ardelia 的能力实体目标上下文，必须分别按来源闭环。
- 本轮门禁：生成器 379 项、全量生成与 `--check`、`npm run type-check:next`、Next 207 个测试文件
  1834 项全部通过。combat-spec 聚焦回归 3/3、VFS 投射物回归 3 项通过且 1 项本地 fixture 跳过。

### 2026-08-26：投射物子技能动作黑板作用域闭环

- 安塔尔处决的命中子 `SkillData` 明确声明 `atb=0`，其条件回能读取的是子技能动作黑板；旧投影把
  子技能调度摊进根时间轴，却没有保留独立 direct blackboard，因而在正式模拟中报缺值。这里不能用
  安塔尔专用默认值修补，也不能把子值永久写入父技能实例。
- 新 `withActionBlackboardScope` 结构步骤按投射物子调用建立独立动作黑板。同一次调用的多个调度项
  共享实例，不同调用隔离；`assignBlackboard=true` 在实际命中时以父 direct blackboard 覆盖子声明
  初值，`EntityBB_` 仍共享干员实体黑板。生成器只包装编译后仍真实读写动作黑板的子步骤，已静态
  消解的伤害倍率不会为了还原无效结构而增加节点。
- 编译、场景 hit ID 绑定、兼容性预检、定义校验、伤害键扫描、命中投影和导图结构遍历均已识别该
  容器；导图显示为可展开的结构节点，内部伤害仍可正常投影和绑定稳定 hit ID。
- 全技能基线提升为 **288/301 成功、13 个精确已知失败**；安塔尔处决已产生 6 个伤害回执并跑满
  3600 帧。门禁：Python 480/480、Next 207 文件 1830/1830；全量生成与专用类型检查继续在提交前
  复核。下一项继续从剩余失败中选择能由来源证据闭合的通用机制，不给外部运行时黑板猜默认值。

### 2026-08-26：跨队员 Buff 的定义来源与执行宿主分离

- 梨诺终结技报 `buff_chr_0035_liino_atkup` 未知不是资源缺失：该 Buff 及其父定义已经完整生成。
  真正问题是父 Buff 施加给队友后，生命周期操作正确切换到了队友宿主，却错误地从队友干员的定义表
  查找后代 Buff。现在生命周期仍在实际宿主上执行和修改属性，但 Buff/AbilityEntity 后代资源继续
  从创建该定义的原始技能 AbilitySystem 解析。
- 梨诺终结技已独立跑满 3600 帧，产生伤害、满血治疗和跨队员强化 Buff 的完整生命周期。全技能
  基线进一步提升为 **289/301 成功、12 个精确已知失败**。

### 2026-08-26：武器静态定义 checkpoint

- 新统一编译器已能把严格 `WeaponBasicTable` 身份、六个精确基础攻击节点、原生稀有度/武器
  类型与 CardSkill 逐档属性物化为静态 `WeaponDefinition` 候选。Buff、Toggle 和动作闭包仍作为显式
  运行依赖保留，静态候选不等于武器动态行为已闭环。
- 武器初版曾直接导入装备领域的属性投影与定义类型，已被架构门禁拦截。该语义现已提升到
  `compiler/buildAttributeProjection.ts` 和 `compiler/formalBuildDefinition.ts`；武器、装备只消费公共结果，
  装备的旧公开名称仅保留薄兼容导出，领域之间没有横向依赖。
- 门禁：游戏数据编译器 59 文件 254/254，Next 207 文件 1828/1828，两套专用类型检查通过。
  下一步先回到全干员逐技能失败，再对 77 件武器跑全量静态候选审计与动态依赖分类。

### 2026-08-26：全干员技能逐项模拟门禁与中间产物清理

- 新增生产仓库级逐项审计：30 名干员的基础技能和变体共 **301 个**，每个都用
  `placeSkillGroup` 单独放入时间轴，再经过正式场景编译和 3600 帧模拟。基础构筑下
  **289/301** 可完整模拟；其余 **12** 个已按精确技能身份和错误文本锁定为已知失败。
  新失败不能静默加入清单，旧失败修复后也会反向使门禁失败，迫使删除过期豁免。
- 原 14 个失败中的安塔尔子技能动作黑板和梨诺跨队员递归 Buff 已按上方通用边界闭环；剩余失败按原因分为：5 个缺动作/实体黑板初值，2 个梨诺技能替换与已放置链冲突，
  2 个能力实体目标组，1 个能力实体 Buff 目标，
  1 个雪绒时间膨胀持续时间，1 个诀的同优先级多动作顺序。详细身份以
  `src/next/application/allRegisteredOperatorSkillsSimulation.test.ts` 为权威边界；不得由错误文本猜测原生规则。
- 首轮扫描同时修复了两个通用消费链：原生 `StoreAttributeValue` 读取施法者等级时从面板
  `level` 取值；火/自然/脉冲/晶体/源石五类元素伤害提升属性统一投影到 Next 伤害修正。
  养成补丁的“跳过未放置技能组”逻辑也已改为尊重具体 `skillKey`，避免同组其他技能的冷却
  补丁错误阻断当前放置。
- Alesh 连携的 `prob_max/prob_add` 又暴露了动态黑板默认值的粗糙数据流裁剪：
  原生 `SimpleCalcBBAction` 会先读取同名黑板的显式初值 0 再回写，但旧生成器因为看到“本地会计算”
  就删除了该初值。现在 `calculatedLocally` 不再被当成“首次读取前必然覆盖”的证明，全量重生成只补回
  7 名干员共 15 个原始声明值；Alesh 连携已独立模拟成功。
- 已确认 UI 中仍标记 partial 的只有 3 名：Camille 战技的 `WeakAction`/火属性易伤会影响
  对敌伤害，必须先在 combat-spec 闭环；Estella 战技的 `EntityBB_first_hit` 缺有证据的
  初始值/生命周期，且已被逐技能模拟复现；Tangtang 终结技剩余的敌方减速 Buff 在固定
  木桩下可按无数值影响闭环，但必须保留图标、持续时间和时间轴可视化，不得直接丢弃。
- 生成器不再往 `src/next/data/operators/generated` 写入原始 `*.generated.ts` 与
  `*.audit.json`；正式源码只保留 `*.operator.generated.ts`。干员审计与宽松技能审计改写
  `tmp/generated-next-operators`，全量干员/养成/递归机制/装备 JSON 审计也改写 `tmp/`。
  `/tmp/` 和 `*audit.json` 已忽略；旧的 30 份原始来源模块、32 份正式目录审计、4 份文档目录
  机器 JSON，以及仅服务旧中间模型的适配器/测试已从 Git 清理。`--check` 不依赖也不写中间产物。
- 下一顺序：先从有明确数值影响且可以取证的 14 个失败开始消除，同时关闭
  Camille/Estella/Tangtang 的 partial 标记；基础构筑 301/301 后再增加满天赋/满潜能的第二层
  逐技能门禁，以捕获养成才会触发的行为；随后回到 77 件武器静态定义和动态被动模拟。

### 2026-08-26：正式套装 23/23 全量闭环

- `suit_usp02` 已进入正式生成，套装覆盖达到 **23/23**。静态生命 +1000；穿戴者输出带四个已配置
  Tag 之一的 Buff 时，通过真实 `InstantSearch + CharacterTeamFinder + ExcludeOwnerValidator`
  目标链只给其他队员施加 15 秒普通乘区增伤。Buff 模板默认 `dmg_up=0.25`，但产品被动安装参数
  权威覆盖为 `0.16`，运行时复制的是覆盖后的 16%。
- 公共投影仅把完整匹配的上述即时搜索折叠为固定小队模型的 `partyExceptCaster`；finder、owner、
  center、方向、validator 或后处理器任一变化都会继续失败。子 Buff 的 DuringEnable 动作只创建
  `buff_common_vfx_char_atk_up`，该资源经完整来源解析确认是纯表现 stack effect 后从无渲染后端省略，
  主增伤 Buff 的图标、持续时间、层数上限与伤害修正均保留。
- 正式生成审计为 **23 套、50 个 Buff 定义**。门禁为游戏数据 58 文件 251/251、Next 208 文件
  1535/1535，两套专用类型检查通过。装备套装主线已可转入正式武器定义与模拟闭环，同时保留场景
  省略项审计。

### 2026-08-26：终结技能量套入战与首战技返还闭环

- `suit_usp01` 已进入正式生成，套装覆盖提升为 **22/23**。静态终结技能量回复效率 +20%；入战时
  把根 Buff 的动态 `has_gain_atb` 重置为 0，首个战技施放前改为 1 并按 `atb_recover=50` 返还技力，
  后续战技因同一 Buff 实例中的动态黑板已置位而不再触发。
- 公共 Buff 投影新增已有运行时语义的严格入口：`OnEnterFight -> enterFight`、
  `CompareFloat -> actionValueCompare`、Owner 到 Owner 的 `ObtainCostAction ->
changeResourceByActionValue`。资源类型、Gain/Return、来源、系数、百分比及终结技能量许可标签继续从
  原生载荷保留，不凭套装文案手写结果。
- 正式生成审计为 22 套、48 个 Buff 定义，当前只剩 **1/23**：`suit_usp02`。门禁为游戏数据
  58 文件 251/251、Next 208 文件 1534/1534，两套专用类型检查通过；生产回归验证两次战技只产生
  一次 50 点返还。

### 2026-08-26：法术异常消耗套事件 Buff 快照闭环

- `suit_expend_spell01` 已进入正式生成，套装覆盖提升为 **21/23**。静态攻击 +10%；穿戴者作为
  finish source 消费导电或腐蚀结果 Buff 后，读取消费事件携带的原实例 `count`，按该值重复施加
  25 秒、最多 3 层的电磁/自然伤害 +15% 可视 Buff。
- 实现依据 combat-spec `equipment-spell-expenditure.md`：Advanced Tag 条件只接受一个空直接 ID
  占位并把事件 Buff ID 写入动作黑板；`GetTargetBuffBBAdvanced(Context)` 读取事件实例快照，不去已经
  结束的目标容器反查。新增 `readEventBuffBlackboard` 保持这一边界。
- Buff `IgniteAction` 消费现在同步发布带 Buff ID、原生 Tag、层数和黑板快照的 `buffConsumed` 语义
  事件；监听按 finish source 隔离。目标配置虽携带未使用的 CharacterTeamFinder/ExcludeOwner 序列化
  残留，但 combat-spec 单 AbilitySystem 端到端测试证明 `targetSource=Owner` 仍施加给穿戴者，故未将
  其误投影为 `partyExceptCaster`。
- 当前剩余 **2/23**：`suit_usp01`、`suit_usp02`。门禁为游戏数据 58 文件 251/251、Next
  208 文件 1532/1532，两个专用类型检查通过；正式生成审计为 21 套、46 个 Buff 定义。下一步处理
  `suit_usp01` 的 OnEnterFight 后续资源链。

### 2026-08-26：连携叠层套复用同施放增伤闭环

- `suit_attri01` 已进入正式生成，套装覆盖提升为 **20/23**。静态攻击 +15%；每次连携施放前给自身
  叠一层可视 Buff，最多 2 层；下一次战技施放前读取实例数、按 `dmg_up * stack` 生成临时增伤并
  清空层数。
- 临时 Buff 复用上一批严格的 `CheckSkillCastId + SkillAffixAction` 生命周期，只影响同一施放。
  DamageDecorateMask `256` 依据 combat-spec 1.4.4 生成枚举的 `NormalSkill=256` 映射为公共
  `normalSkill` 伤害标签；编译器现在仅接受已证明的 256/8192 两个 HasAll 单位 mask。
- 当前剩余 **3/23**：`suit_expend_spell01`、`suit_usp01`、`suit_usp02`。门禁为游戏数据
  58 文件 251/251、Next 208 文件 1529/1529，两个专用类型检查通过；正式生成审计为 20 套、
  44 个 Buff 定义。下一步继续处理 `suit_expend_spell01` 的动态 Buff 上下文计数链。

### 2026-08-26：战技叠层套 Aura、同施放连携增伤闭环

- `suit_atk02` 已进入正式生成，套装覆盖提升为 **19/23**。静态部分为攻击 +15%；根 Buff 的
  `GlobalAura` 只在 combat-spec 已证明的 Owner 根、零尺寸 Box、存活友方 Character、无过滤形状下
  投影为固定小队，并由 Aura 动作句柄精确持有和结束各成员的侦测 Buff。
- 公共 Buff 目标/来源新增显式 `eventSource`，保留原生 `CreateBuffAction` 的 `Source/ActionSource`，
  不再把事件来源含糊映射成 caster、Target 或 Buff owner。每次战技施放前给实际施放者叠一层，连携
  施放前读取自身该 Buff 的实例数、计算 `dmg_up * stack`，施加临时增伤后清空层数。
- 技能 cast ID 现在由装配层在 `beforeCastSkill` 前分配，并贯穿 `beforeCastSkill`、伤害上下文和
  `skillEnd`。`CheckSkillCastId` 因而能严格限制临时 Buff 只修改同一次连携施放产生、且原生
  DamageDecorateMask 包含 8192（公共语义 `comboSkill`）的伤害；`SkillAffixAction` 在匹配的技能结束
  时结束该 Buff，不会泄漏到下一次技能。
- `SaveBuffStackNumAdvanced(Owner, Id, BuffCount)`、`FinishBuffAdvanced(Owner, Id)` 和
  `DebugPrintAction` 只开放本链需要且完整校验的窄形状。Debug 仅为日志表现 no-op；Buff 图标仍保留，
  没有借“表现省略”丢弃可视 Buff 数据。
- 当前剩余 **4/23**：`suit_attri01`、`suit_expend_spell01`、`suit_usp01`、`suit_usp02`。本轮门禁为
  游戏数据 58 文件 251/251、Next 208 文件 1528/1528，两个专用类型检查通过；正式生成审计为
  19 套、41 个 Buff 定义。下一步优先复用本轮 `SkillAffixAction` 证据收口 `suit_attri01`。

### 2026-08-25：爆发套事件 Buff Advanced Tag 闭环

- combat-spec 已有的 1.4.4 证据确认 `CheckBuffIdInContextAdvanced` 空黑板 key、空 ID 列表、
  `checkType=Tag` 分支只对事件 BuffData 的 `applyTags` 执行 GameplayTagQuery。公共来源解析器现在只
  开放这一精确形状；非空 key 的事件 Buff ID 写回、BlackboardBuffId 列表和 ID 分支继续失败关闭。
- `suit_burst01` 已进入正式白名单，套装覆盖由 16/23 提升到 **17/23**。它保留战技、连携、终结技
  各 +20% 的静态技能增伤；来源角色输出四种指定元素 Buff 之一，且真实事件目标上该 Tag 的 Buff
  实例数达到 2 时，获得 15 秒四系术法伤害 +35% Buff。
- 触发链继续区分“事件 Buff 的 Tag”“事件目标上的同 Tag Buff 实例数”和“Buff 强化层数”，没有因
  数字恰好相同而合并。可见增伤 Buff 保留 `icon_battle_spell_up`，纯粒子子 Buff 只在无渲染战斗
  后端省略。
- 当前剩余 **6/23** 套：`suit_atb01`、`suit_atk02`、`suit_attri01`、`suit_expend_spell01`、
  `suit_usp01`、`suit_usp02`。门禁为游戏数据 58 文件 248/248、Next 208 文件 1523/1523，两个专用
  类型检查通过；下一批继续以对敌输出影响优先。

### 2026-08-25：暴击输出事件与暴击套完整闭环

- `combat-spec` 先依据 1.4.4 `GameAssembly.dll` 闭合伤害完成事件：同一
  `OutputDamageContext.isCritical` 为真时，原生顺序是 `OnTakeDamage`、`OnTakeCriticalDamage`、
  `OnOutputDamage`、`OnOutputCriticalDamage`。复刻库把公式结果保存到 `DamagePackData.IsCritical`，
  增加事件顺序回归和反编译地址文档，提交为 `a4fd76a`；非暴击不会发布两项 Critical 事件。
- Next 的实体事件中心新增 `outputCriticalDamage`，由实际 `outputDamage` 载荷中的公式暴击结果派生，
  不重新随机，也不由伤害数字猜测。Buff 正式投影同步支持原生 `OnOutputCriticalDamage`、
  `OnBuffEnhanceChanged` 和 `OnBuffFinish`。
- `CheckBuffStackNum` 的单 ID 查询按 combat-spec 已闭环语义投影为累计增强层数，并能在 Buff 生命周期
  中精确查询 `buffOwner`。`FinishBuffAction` 当前只开放本批实际出现且已证明的 Owner/固定 ID/不限
  来源形状；攻击 Buff 结束时据此清理同一持有者的暴击率 Buff。
- 公共 Buff 动作中的原生 `Owner` 已纠正为 `buffOwner`，不再误投影为技能 `caster`。纯表现子 Buff
  在其 ID 已被严格识别为 visual-only 后允许省略数值执行，即使原生使用 `Source/ActionSource`；未知
  身份和混合数值动作仍失败关闭。可见的攻击、暴击率 Buff 本身没有被省略，图标继续进入正式定义。
- `suit_criti01` 已进入正式白名单，套装覆盖由 15/23 提升到 **16/23**：静态暴击率 +5%；每次真实
  输出暴击施加/刷新 5 秒攻击 Buff，每层基础攻击乘区 +5%，最多 5 层；满层施加暴击率 +5% Buff，
  攻击 Buff 到期时移除后者。两份可见 Buff 分别保留 `icon_battle_buff_atk_up` 和
  `icon_battle_crit_rate_up`。
- 当前门禁：游戏数据编译器 58 文件 247/247、Next 208 文件 1522/1522、
  `type-check:game-data`、`type-check:next` 与 `git diff --check` 通过。剩余 **7/23** 套继续按对敌伤害
  优先级推进。combat-spec 的 `PlayerDamageActionTests` 定向 11/11 通过；全量 1192 项中 1175 项通过，
  17 项失败均为本机缺少 `skill-data-cdn`、庄方宜实体/Buff 等既有测试工件，不能宣称全量通过。
  `tmp/` 仍不提交。

### 2026-08-25：统一编译器边界修复与 Operator 恢复 checkpoint

- AbilityEntity 模板已进入公共严格目录：本机同版本闭包现有 52 份可解析模板，保存原生身份、
  born tags、动态寿命/叠层来源和已证实的生命周期前缀。GameplayTag 路径由 TypeScript 工具从
  同版本 TypeTree dump 生成，CRC 与父子查询实现统一位于 `src/shared/gameplayTags.ts`；裸 ID
  没有路径证据时只允许精确匹配。
- 新增公共 `compiler/abilityEntityQuery.ts`，把
  `OwnerSpawnedEntityFinder + AbilityEntity + TagValidator/SkillCastIdValidator` 投影为明确的
  owner、center、按原顺序验证器和候选模板 ID。候选 ID 只是“目录中可能通过模板标签验证”的集合，
  运行时仍必须从 selector owner 的 children 正向筛选；`OwnerSpawnedEntityFinder` 本身绝不等同于
  “当前施法生成”，只有 `SkillCastIdValidator` 才保留同次施法约束。
- 对当前可完整收集目标组写入的 Operator SkillData 做了只读探针：58 个 owner-spawned 写入中，
  新公共投影严格接受 58 个；其中零 ObjectType 掩码按原生位运算显式编译为空集合，Owner 距离
  PriorityFilter 按原顺序保留为运行时实例排序，最后一个 `ShuffleTarget` 也保留完整限量值。该数字只衡量
  这一个公共查询切片，不代表技能行为已完成，也不包含被其他未恢复 TargetGroup 类型阻塞的文件。
- 公共主动 SkillData 编译结果现直接携带按动作路径收集的 `targetGroupWrites`，后续查询投影不再重扫
  原始 JSON。Operator 来源闭包已通过公共连接器生成逐技能 AbilityEntity 查询切片；能力实体目录和
  GameplayTag 注册表是显式、同版本输入，不允许导入 Next 的生成全局表。下载计划仍允许模板尚未到位，
  但正式闭包一旦出现 owner-spawned 查询而缺少该上下文会失败关闭。同一份 AbilityEntityData 只编译
  一次公共目录，定义闭包节点从该目录派生，不为引用审计和查询投影各解析一遍原始资产。
- `TargetGroupWriteSource` 现保存解析时的完整 SkillData `sourcePath`，查询连接器不再接受调用方自行
  拼接的路径前缀。公共控制流新增原生顺序递归遍历器；每个查询写入必须能按该路径在同一份已编译
  动作图中找到节点，否则按内部 IR 漂移失败。该门禁同时修复了旧收集器遗漏 `actionGroupData`、数组
  索引错误格式化为 `.actionData.[0]` 的证据路径问题；相对 `actionPath` 与计数关联语义保持不变。
- `source/selectorComponents.ts` 现作为 Selector 嵌套组件的公共严格入口；PriorityFilter 不再只留下
  类型名和 `maxNum`，而是完整保存排序枚举、两个数量开关、最大数量和 Buff ID/Tag/叠层筛选。
  combat-spec 的 1.4.4 机器码产物已闭环 Owner Asc/Des：升序权重为 owner 到候选的三维距离，降序
  权重为其负值，`priorWeight=0`；显式数量限制和未限量时的 128 硬上限走公共筛选器。Endaxis 因此
  投影为 `distanceFromOwner + order + maxTargets`，仍只对运行时 children 实例执行。随后从同版本
  `ShuffleTarget.PostProcess` 和泛型助手闭环了“先全量 Fisher-Yates 洗牌、限量值 > 0 才裁剪、负值
  不限量、hit-reaction 不参与”；公共 IR 保存 `shuffle + targetNumLimit`，Unity Random 状态仍留作
  运行时显式边界。该样本并列的 DistanceValidator 也完整保存阈值、比较符和 XZ 开关。
- 庄方宜该组 `swordsForSmallThunder` 的完整文件内引用已核对：后续只按 `sword_index` Pick 单个实例，
  然后三个 Switch 分支都只执行 EffectAction 并递增索引；没有伤害、Buff、资源或实体状态消费者。
  因此具体 Operator 场景可以在省略整段表现消费者后让随机顺序不可观察，但公共查询 IR 仍必须保留
  ShuffleTarget，不能把这个局部死用证明扩成全局规则。
- 此前 `domains/equipment/suitRuntimeDefinition.ts` 错误拥有一套以 Equipment 命名的公共 Buff
  条件、步骤、序列和定义编译器，现已纠正为公共 `compiler/buffRuntimeProjection.ts`。套装领域
  只负责门槛、固定木桩场景选择、批次装配和正式文件布局，不再按原生 Action 建第二个分派入口。
- 完整依赖审计还发现公共被动批处理反向导入领域发现类型，以及装备领域自行物化公共被动 Buff
  安装。请求类型已移到 `compiler/passiveSkillRequest.ts`，安装物化已统一进入
  `compiler/passiveSkillInstallation.ts`；Operator、Weapon、Equipment 只提供各自的发现入口。
- 新增 `architectureBoundaries.test.ts` 强制公共层不依赖 `domains/`、严格 `source/` 不依赖
  `compiler/`、领域不横向依赖，并禁止领域重声明公共战斗定义或建立第二个原生 Action 分派。
  正则门禁不能替代代码审查；改名后的语义重复仍必须在扩功能前清除。
- 引用闭包曾在 `referenceGraph.ts` 手写 Buff/Projectile/AbilityEntity/CastSkill 的第二套 Action
  分派，现已删除并复用 `actionLeaf.ts` 的公共唯一分派器。公共尝试入口只有在类型确实未知时返回
  `null`；引用相关已知类型若字段漂移仍严格报错。引用闭包的解析 scope 只启用会形成定义边的动作，
  不会因无关的 `MoveSpeedScalar` 快照或 Buff 私有 `AbilityEntityTargetFinder` 扩大闭包门禁；主动技能
  目标组仍由独立公共数据流收集阶段负责。
- 当前门禁：游戏数据编译器 58 个测试文件 / 244 项、`type-check:game-data`、`type-check:next` 和
  `git diff --check` 通过。combat-spec 的 PriorityFilter 定向测试 12/12 通过；其全量测试 1190 项中
  1176 项通过，14 项失败来自本机缺少装备 BuffData 夹具及现有全量样本计数/严格边界漂移，与本次
  PriorityFilter 修改无关，不能宣称 combat-spec 全绿。
- 架构推进顺序也是功能门禁：Operator 尚未达到旧 Python 正式输出等价前，不再扩大武器和装备
  的正式行为覆盖。纠偏前已闭合并通过生产模拟的第 13 套 `suit_crush_fracture` 及既有回归保留，
  但不继续第 14 套，也不能借装备样本反向定义公共战斗语义。
- Operator 已恢复两条严格数据链。`CharacterTable` 按 combat-spec 的
  `LoadoutTableAdapter.ParseCharacter` 读取角色 ID、原始元素字符串、原生职业枚举、整数稀有度、
  主副属性、默认武器和完整关键帧；职业精确成员来自 1.4.4 SparkBuffer schema 的
  `ProfessionCategory (0xABF873A2)`，不是由旧版输出或 AKEDB 展示映射反推。查找严格按
  `(level, breakStage)` 首项精确匹配，不插值。Next 六档面板是显式产品投影
  `(1,0)/(20,0)/(40,1)/(60,2)/(80,3)/(90,4)`，并与旧 Python 面板 oracle 对象级一致。
- CharacterTable、DamageAction 与条件数据的原生元素身份已收敛到公共 `source/damageElement.ts`；
  source 不反向依赖 compiler，三个消费者也不再各维护一份 `Fire/Pulse/Cryst/Natural` 映射。
  `compileOperatorDefinitionHeaderSource` 现从同一来源闭包产出正式定义可用的稀有度、武器、元素、
  职业、主副属性、六档面板和非默认好感属性。它故意不生成 `slug/gameId`，因为二者是产品身份，
  不能从显示字段猜测；技能和养成行为未装配前也不能把该头部注册成完整 OperatorDefinition。
- `CharGrowthTable.talentNodeMap` 按 combat-spec 的 `PotentialTalentTableAdapter.ParseTalentNodes`
  严格读取。好感属性只消费 `Attr(3)` 节点的 `Specific/BaseAddition`，默认主属性
  `[10,15,15,20]` 不重复写入定义，双属性例外保留；两种结果均通过 Python oracle 差分。
- 当前转换器门禁为 58 个测试文件、244 项全部通过，`type-check:game-data`、`type-check:next` 与
  `git diff --check` 通过。真实 30 名 Operator 的模板引用计划继续完整：120 个 Projectile、53 个
  AbilityEntity、0 个未解析 Skill/Buff。当前本机只有 52 个 AbilityEntity 且没有 ProjectileData 目录，
  台式机 fallback 暂时返回 502，因此正式闭包全量审计不能冒充通过。Operator 功能主线下一步先给
  manifest 增加显式产品身份，并选择一个既有正式干员把技能组、主动技能、养成和定义闭包装配为
  完整候选；资源侧并行阻塞仍是补齐下载闭包。领域层不得重新解析 finder/validator 或复制标签解析。
- combat-spec 本地证据基线为 `db2bcbad395411e3a6f104814ce3e2fc76ef5f02`。所有新语义必须先能
  指向其代码、文档或版本化研究工件；旧 Python 只能确认兼容结果，不能填补证据缺口。

### 2026-08-25：物理异常输出事件与套装查询 IR checkpoint

- `suit_crush_fracture` 的首层证据已按 `combat-spec` 现有反编译结论进入公共基础设施：
  `CheckPhysicalInflictionType` 将 `Airborne/KnockDown/Fracture/Crush` 解释为事件类型位集；当前只允许
  空 `savedKey` 的纯条件形状，非空写黑板路径仍保持未开放。
- Next 新增独立的 `beforeOutputPhysicalInfliction` 来源 AbilitySystem 事件。它在物理异常尝试输出前
  同步携带来源、目标和异常类型，不能与目标侧 `beforeTakePhysicalInfliction` 混用；公共条件
  `eventPhysicalInflictionTypeIn` 已贯通定义、校验、执行与编辑器默认值。
- 新 TypeScript 编译器的公共来源 IR 已接入 `SaveBuffStackNumAdvanced`，完整保留目标、ID/Tag 查询、
  `BuffCount` 类型、同施法限制和输出黑板 key。这里只完成严格来源读取；套装领域尚未把后续动态
  黑板乘法、OR 条件和 Buff 安装链投影成正式定义。
- 因此正式套装进度仍是 **12/23**，`suit_crush_fracture` 不得在本 checkpoint 冒充已转换。下一步从
  这份公共 IR 复用现有 `readBuffStackCount`、`modifyActionValue`、`poiseCompare` 和 Buff 应用运行时，
  完整闭合后才生成并注册第 13 套。
- 当前门禁：公共编译器 37 文件 / 179 项、Next 208 文件 / 1512 项及两套类型检查通过。
- `D:\Projects\combat-spec` 当前 `main` 工作树干净并与 `origin/main` 同步；所需原生证据已在
  `db2bcba` 及此前装备 Buff 规格提交中，无需为本次 Endaxis 接线制造空提交。

### 2026-08-25：物理异常套装伤害与全局冷却闭环

- 正式生成套装推进到 12/23。`suit_phy01` 保留全局失衡输出 +20%，并在来源角色输出任意
  `Skill/Character/Common/PhysicalStatus` 后，对事件目标造成攻击力 250% 的物理伤害和 10 点基础
  失衡；随后给来源角色写入 15 秒全局定时标记，同一标记存在时不重复触发。
- 公共 DamageAction 投影只开放这一条已有证据的简单形状：`ActionOwner -> event Target`、标准
  HP 攻击倍率单元和可选的 Poise 固定值单元。处理器、费用、特殊计算或目标查找一律继续失败关闭。
  原生 `CheckGlobalCDTimer -> Damage -> AddGlobalCDTimer` 已由 `combat-spec` 的全局标记规格证明；
  在“先判不存在、再写入”的确切链中复用全局时钟 `TimedMarkerContainer`，不把该等价扩展到任意
  GlobalCD 动作图。
- `eventBuffTagsMatch` 现由统一事件条件层使用版本化 GameplayTag 目录匹配父子层级。此前精确数字
  集合只能匹配标签本身，无法让骨折子标签 `FractureStatus` 命中物理状态父标签；该问题已用真实
  边境四次战技生产场景覆盖。两次骨折均输出，但 15 秒内套装仅追加一次 250% 物理伤害和一次
  10 点基础失衡，证明标签、伤害与冷却整链实际运行。
- 当前门禁：公共编译器 37 文件 / 177 项、Next 208 文件 / 1511 项及两套类型检查通过。
- `tmp/` 仍只作本机证据缓存，不提交。下一批继续处理 Aura 与暴击事件套装。

### 2026-08-25：套装服务端黑板读集与固定满血 Toggle 归约

- 装备被动的启动 Buff 赋值不能仅靠 SkillData/SkillPatch 全部物化：原生 `SERVER_SKILL.blackboard`
  还可携带服务端额外值。编译器现在把缺失值保留为 `unresolvedSkillBlackboard`，直到读取目标
  BuffData 后再判定；若可执行动作、生命周期或属性修正确实读取该 key，仍严格阻塞，绝不补 0。
  当前 `agi/wisd/will -> 根 Buff` 样本经结构化读集证明均未消费，故只省略该次无效覆盖并保留 Buff。
  复刻库先行证据记录为 `D:\Projects\combat-spec` 提交 `db2bcba`。
- `ToggleBuff` 的生命比例条件和 Buff 参数已在套装依赖中完成等级物化。按既定木桩模型，干员没有
  敌方主动伤害且保持满血，因此 `HP >= 80%` 可严格归约为帧 0 常驻，`HP <= 50%` 则明确记录为
  `scenario-omitted`；缺失阈值仍阻塞，不能凭同类套装猜测。
- 正式生成套装从 2/23 扩大到 11/23（物理套在后一 checkpoint 推进至 12/23）：新增 `suit_agi01`（敏捷 +50、满血物理增伤 20%）、
  `suit_wisd01`（智识 +50、满血四类术法增伤 20%）、`suit_will01`（意志 +50），以及木桩场景
  只剩生命 +500 的 `suit_stragi01`、`suit_wisdwill01`。`suit_str01` 的受击响应在无敌方主动行为
  边界中不可达，仅保留力量 +50；击杀后响应继续按唯一敌人死亡即模拟结束省略。
- `OnOutputBuff` 已复用干员公共事件协议，基础 Tag 查询严格投影为 `eventBuffTagsMatch`。
  `suit_fire_natr01` 与 `suit_pulse_cryst01` 因此完整进入正式仓库：均提供术法强度 +30，并在输出
  对应两种元素附着后安装 10 秒、50% 的对应元素增伤 Buff；四个原生图标均保留。
- `suit_poise01` 复用同一输出 Buff 事件链上线：攻击 +8%，输出指定失衡 Buff 后获得 15 秒、每层
  8% 且最多四层的物理增伤；事件目标上匹配标签的 Buff **实例数**达到四个时，另获得 10 秒、16%
  物理增伤。公共条件 `eventTargetBuffCountCompare` 由事件真实 `targetId` 查询容器实例数，明确不把
  Enhance 层数混作原生 `BuffCount`。
- 当前门禁：公共编译器 37 文件 / 176 项、Next 208 文件 / 1508 项及两套类型检查通过；下一批优先
  处理物理套的全局冷却伤害链，再处理 Aura 和暴击事件。
  `tmp/` 仍只作本机审计缓存，不提交。

### 2026-08-25：套装 Buff 进入装备贡献装配边界

- `EquipmentContributionDefinition` 不再局限于静态 modifier 和事件监听器；武器词条、单件词条与套装
  现在可携带自己的 `buffDefinitions` 和一次性 `initializationSequence`。三件套因此能够在帧 0 安装
  原生根 Buff，并直接复用干员已经贯通的 Buff 生命周期、事件响应、图标和时间轴回执，不另造套装
  专用状态机。
- 编译器会提前编译装备 Buff 蓝图和初始化序列，并明确拒绝其中尚未开放的 AbilityEntity 定义。
  场景装配把活动贡献的蓝图严格合入干员公共/角色 Buff 目录；任意重复 ID 都原地报错，不允许后加载
  的套装静默覆盖角色或公共规则。初始化程序保留精确来源 key（如 `gear-set:suit_atk01`），并在 Buff
  生命周期绑定完成后执行。
- 装备定义验证同步覆盖蓝图和初始化动作，不让新字段绕过只读目录门禁。回归贯通
  `GearSetDefinition → compileScenarioEquipment → compileScenarioRuntimeAssembly`，确认满足三件规则后
  蓝图和安装程序都到达正式干员运行时。
- 当前门禁：Next 206 文件 / 1497 项、公共编译器 34 文件 / 163 项及两套类型检查全部通过。
  下一项不再改装配架构，直接实现公共来源图到该契约的严格投影；先覆盖可由现有 Buff DSL 无损表达、
  且改变对敌输出的启动/事件套装，再逐类补 Toggle 条件。

### 2026-08-25：套装 Buff 复刻库闭包与公共治疗表现字段

- `D:\Projects\combat-spec` 已先按原生证据补齐套装闭包最后四项，提交为
  `035e35b feat(combat): close equipment buff simulation`。`HealAction` 现在执行 Normal 治疗计算、
  双方治疗修正、MaxHp 钳制和满血仍发布的 Output/Receive 事件；`CheckOverHeal` 使用最终治疗量与
  实际生命增量分流。真实 `buff_equipsuit_stragi_01` 与 `buff_equipsuit_healup_01` 已形成回归，
  后者严格区分过量治疗 -40% 与非过量治疗 -20% 承伤修正。
- 两个通用攻防 Buff 的非空 `stackEffects` 不再被当作未知载荷：复刻库按层数索引保留特效名、目标、
  来源与动作释放位。49 个版本化装备 BuffData 现有自动依赖闭包测试，严格解析达到 49/49；这只证明
  原生规格闭合，尚不等于 Endaxis 已把 23 套运行时行为全部注册。
- 公共 TypeScript `HealActionSource` 同步保留 `effectData.effectName`，与既有播放开关、标签和计算
  一起进入来源 IR。庞大粒子配置不进入数值公式，但渲染所需身份不能因“不参与模拟”被丢弃。
- 当前门禁：公共编译器 34 文件 / 163 项通过，两套类型检查通过。下一项以复刻库 49/49 作为行为
  参照，把套装启动 Buff、Toggle 条件和事件链投影到正式 `GearSetDefinition`；优先完成会改变对敌
  输出的链路，治疗/图标/stack effect 同时保留，纯玩家承伤只做木桩场景明确省略。

### 2026-08-24：套装静态定义与运行时乘区 checkpoint

- 23 个三件套 CardSkill 已由公共被动安装器选择确切等级并进入正式静态定义编译边界；结果为
  33 条支持修正、6 条木桩场景玩家承伤省略、0 条阻塞。审计见
  `docs/research/equipment-suit-static-definitions.json/.md`，候选仍单列启动 Buff、ToggleBuff 与动作图
  依赖；49 个 BuffData 行为闭合前不得把静态候选冒充完整套装注册。
- 补齐的原生语义包括以太增伤、全局失衡输出加算与连携冷却时长倍率。`0.85` 的
  `ComboSkillCooldownScalar/BaseFinalMultiplier` 保留为仅连携技的乘法修正，没有偷换成 15% 加算型
  “冷却缩减”；共享冷却账本允许小数有效周期，10 帧样本在 8.5 帧恢复。失衡输出则在每次失衡
  结算读取面板增量，20% 样本把 10 点失衡变为 12。
- 当前门禁：公共编译器 34 文件 / 163 项、Next 206 文件 / 1496 项全部通过；两套类型检查通过。
  `GeneratedBuffAttributeModifierSource` 也已恢复对来源枚举 `BuffSource` 的忠实承载，但运行时适配仍会
  对尚未支持的目标失败关闭，没有臆造其语义。
- 下一项按 49 个已闭合 BuffData 的真实行为做横向分类，优先接入会影响对敌伤害的启动/事件/条件
  Buff；纯玩家承伤继续按木桩模型显式省略。每套只有在静态修正和运行时依赖都闭合后才正式注册。

### 2026-08-24：全量单件装备正式接入 checkpoint

- 固定客户端版本 `1.4.4@9433094-12` 的 `EquipTable + ItemTable` 已生成 243 件正式
  `GearDefinition`，覆盖 73 件护甲、65 件手套、105 件配件；共 672 条可选词条、721 项正式修正。
  其中 448 项四维、108 项面板、155 项伤害倍率、10 项治疗增幅。48 条玩家承伤修正按唯一木桩模型
  明确记为 `scenario-omitted`，不是漏转或静默丢弃。
- `generate_formal_gear_definitions.ts` 现在可从配对表一条命令重建整个
  `src/next/data/equipment/generated`。写盘先在目标同级暂存完整批次，再原子替换目录；路径越界、重复
  文件、阻塞诊断都会失败关闭，旧生成物不会与新批次混杂。
- 正式注册层以原生物品 ID 为规范 slug，同时兼容旧项目保存的装备 slug。现有结果为 243 件现行
  原生定义、237 个旧 slug 别名、5 个退出现行表但继续保留的旧模板、23 个原生套装 ID 到旧套装
  定义的别名。别名查询返回保留请求 slug 的只读视图，浏览列表只枚举规范定义，不重复显示。
- `ItemTable.iconId` 已证明并非唯一，共有 6 组重复图标。注册器不能只按图标强配；它会在同图标
  候选中继续核对槽位、穿戴等级、防御和有序词条语义，并允许旧显示值的三位小数舍入误差。当前
  所有旧关联均唯一闭合，0 个歧义；仍有 6 件现行装备没有旧身份，其中共享图标者只复用表中明确
  相同的图标资源，不臆造名称或别名。
- checkpoint 门禁：`npm run type-check:game-data`、`npm run type-check:next` 通过；游戏数据编译器
  32 个测试文件 / 158 项、Next 205 个测试文件 / 1491 项全部通过。后续生产回归又逐件以最高精锻
  编译 243/243 件现行装备，并用“浑浊切割炬”验证精锻 0→3 会实际提高佩丽卡普攻伤害；旧 slug
  与原生 ID 的高精锻模拟结果完全相同。单件装备链已贯通，下一步转入套装正式定义，再推进武器。
- 套装源闭包也已建立：固定 `EquipSuitTable` 精确枚举 23 个三件套被动，23/23 SkillData 由公共
  被动编译器读取，并沿活动静态引用递归闭合到 49 个 BuffData，0 个外部技能、能力实体或投射物
  依赖。AKEDB 全集合 manifest 当前返回 404，但按上述明确 ID 的官方文件直链仍有效；逐项重新下载
  后，23 个 SkillData 和 49 个 BuffData 均与旧缓存语义一致。版本化审计保存格式无关的两类闭包
  SHA256，下一步从这份公共来源图投影正式 `GearSetDefinition`，不能回退到旧手写套装作为规则源。

### 2026-08-24：武器基础攻击成长 checkpoint

- `WeaponBasicTable` 现只有一个严格源行解析器，被动技能发现和基础攻击成长共同消费它；不再各自
  复制 13 字段表结构。武器 ID、技能顺序、成长/突破/潜能模板、最高等级和原生身份均由同一入口
  校验。
- 基础攻击严格沿 `WeaponBasicTable.levelTemplateId -> WeaponUpgradeTemplateTable.list` 读取。
  每条成长行保留导出 `baseAtk` 和原生 float 单精度运行值；解析器拒绝重复等级、负攻击和最高等级
  缺行。
- 只有精确命中的武器等级才产生公共属性修正 `Specific / Atk / BaseAddition`；缺行返回空，不插值、
  不夹取、不沿用最近等级。突破、潜能、基质和武器被动不混进基础攻击路径。
- 1.4.4 全量覆盖 77 把武器、9 条实际引用模板、6930 个武器等级行，6930/6930 修正成功；额外
  91 级探针 77/77 返回空。当前运行值范围 29–510 只是版本审计事实，不固化为规则。
- 代码 checkpoint 为 `3f506eb3 feat(data): parse weapon base attack growth`。门禁为
  `npm run type-check:game-data` 通过，27 个测试文件、119 项测试通过。
- 下一阶段不再继续堆表读取器，而是建立武器与装备的正式定义投影：先把公共属性修正映射到 Next
  构筑属性并保留无法投影项的审计，再组装单件装备、套装和武器定义，最后进入生产模拟验证。

### 2026-08-24：单件装备属性修正 checkpoint

- 交接中旧称的“`ItemTable` 单件装备属性修正”已经按真实表纠正边界：`ItemTable` 只提供物品 ID、
  图标、稀有度和物品类型等身份/展示事实；战斗属性来自 `EquipTable.equipAttrModifiers`。公共读取入口
  必须联合校验两表身份，不能从 `displayAttrModifiers` 或显示文本反推战斗值。
- `tools/game-data-compiler/src/source/attributeModifiers.ts` 现以同一套有类型枚举身份承载 Buff、
  CardSkill、武器和装备属性修正。`EquipTable` 的数字枚举会严格映射为公共身份，同时在装备 IR 中
  保留原始数字值和完整字段路径；未知枚举明确失败。
- 单件装备 IR 保留 `attrIndex`、目标属性模式、属性、八槽公式位置和完整 `attrValues`。档位解析复现
  combat-spec：按装备实例的 `attrIndex` 精确取精锻等级，缺少索引使用 0，越界直接失败，不插值、
  不夹取、不回退。
- AKEDB 固定版本 `1.4.4@9433094-12` 真实全表 243/243 件通过，合计 1012 条修正；`attrIndex` 为 0–3，当前值表均为四档，
  目标覆盖 `Specific`、`Main`、`Sub`，公式槽覆盖 `BaseAddition`、`BaseMultiplier`、
  `BaseFinalAddition`、`BaseFinalMultiplier`。这些是本版本审计事实，不固化成通用规则。
- 代码 checkpoint 为 `c01afc12 feat(data): parse equipment attribute modifiers`。门禁为
  `npm run type-check:game-data` 通过，26 个测试文件、116 项测试通过。
- 武器基础攻击成长已由后续 checkpoint 完成；当前下一项为装备与武器正式定义投影和同口径模拟审计。

### 2026-08-24：统一游戏数据编译器 checkpoint

- `tools/game-data-compiler/README.md` 是当前实现契约，记录证据优先级、分层边界、场景简化、审计、
  代码风格、原子输出和迁移门禁；继续开发前必须完整阅读。
- 公共来源层已覆盖 SkillData/BuffData 动作图、29 类条件、控制流、Target、Blackboard、SkillPatch、
  伤害、治疗、Buff、资源、引用动作、时间膨胀和定义引用图。2459/2459 SkillData、2678/2678
  BuffData 可进入公共来源图。AbilityEntity/Projectile 因本地缺模板资产，只报告缺失定义，不猜造。
- 295 个被动 SkillData 已进入统一入口，覆盖 282 个 `AddBuff`、13 个 `ToggleBuff` 和 180 项
  CardSkill 属性修正。干员养成、武器、装备套装只发现安装请求，不再各写一套 Action/Buff 编译器。
- `1.4.4@9433094-12` 联合结果为 285 条安装请求、155 个唯一被动 SkillData，公共批量编译
  155/155 成功。请求保留来源顺序和重复安装，定义按 SkillData ID 去重。
- 武器成长已严格复现突破、潜能、一级 SkillPatch `tagId` 与基质 `tagId` 匹配。全量覆盖 77 件
  武器、31 条基质、1925 组突破/潜能组合、5650 个技能槽，0 失败。
- 5 件三星武器只有两个技能而模板保留第三个 `(0,0)` 尾部占位。原生按技能列表长度索引，因此
  只要求边界足够并忽略尾项；该修正已随其他同轮证据以 combat-spec `8debc31` 提交并推送 `main`。
- SkillPatch 选级区分未指定等级、指定但缺补丁、精确命中三条原生路径；安装实例化最后应用额外
  黑板，保持调用方同名值覆盖。
- Endaxis checkpoint 为 `fd61a59e refactor(data): establish shared game data compiler`，已推送远端
  `refactor/common-game-data`。门禁为 `npm run type-check:game-data` 通过，25 个测试文件、113 项测试通过。
- combat-spec rebase 后相关适配器、装配和武器等级定向测试 33/33 通过。完整测试为 999/1003；4 项
  失败来自当前本地真实数据目录与既有库存断言不一致：Channeling 的 `ActionSource` 残留 context key、
  TimedMarker 59→87、GlobalCooldown 3→7、FinishBuffAdvanced 27→32。本轮没有为通过测试而改写这些
  无关库存数字，接手者应单独核对数据版本与断言。
- 单件装备属性修正已经由后续 checkpoint 完成；当前下一项为
  `WeaponUpgradeTemplateTable` 武器基础攻击成长。必须继续先核对 combat-spec 和真实表，不能猜规则。

## 1. 当前目标与边界

当前工作位于 `refactor/common-game-data`，目标是从干净主干建立统一游戏数据编译器，再让 Next 的
干员、武器和装备正式定义消费同一份公共语义。当前不修改旧版代码，也不继续扩展旧 Python 架构。

固定优先级：准确与功能完备 > 清晰易维护 > 性能。游戏规则必须有解包、反编译、C# Combat Spec 或已验证游戏样本依据，不用猜测填空。

每轮只处理能够形成“证据 → 严格来源 IR → 公共编译 → 领域安装 → 测试/全量审计”闭环的机制。
相同 SkillData、BuffData、Action、Condition、Blackboard 或属性修正结构必须复用同一实现。

### SkillSetting 与导电复合状态默认装配（2026-08-23）

- 台式机 VFS manifest `451359` / asset index `67099` 的
  `assets/beyond/dynamicassets/gamedata/gameplayconfig/skillsetting.asset` 已重新以 AnimeStudio
  TypeTree Dump 导出。完整 22 项法术配置和 3 条增强公式已形成版本化目录并进入 Next；编辑器默认
  模拟现在会注入它，不再在火焰爆发处报缺少 `spellInflictionSettings`。其中法术爆发倍率四列均为
  1.6，Damage 公式为线性 `1 + 0.01 * PhysicalAndSpellInflictionEnhance`。
- `combat-spec` 新增严格 Dump 适配器并提交 `e3f1ec6`。它校验列表声明数量、每项四列、字段、公式
  类型和键唯一性；当前 AnimeStudio 通用 JSON 只导出 MonoBehaviour 基类字段，不能再误当完整资源。
- 复合状态工厂从“只有目录和独立单测”接入标准模拟：异类附着会把真实消耗层数交给对应工厂，按
  SkillSetting 列和来源法术增强属性求值，再把工厂输出黑板交给最终状态。12 个有向异元素组合现由
  工厂目录直接驱动注册，并逐项核对注册 ID 与 `createdBuff.buffId`；不再按运行时报错逐个手接。
- 四族状态均保留原生图标、Tag、叠加身份和持续时间。Buff 生命周期新增攻击倍率伤害端口：12 种
  状态创建时均按工厂 `atk_scale` 结算对应元素异常伤害；燃烧按 `burning_atk_scale` 每秒结算且禁用
  暴击；导电继续修改全元素法术伤害；腐蚀按原始五类抗性修正键在启动和周期触发后刷新属性。
- 腐蚀的周期链已按原始 `CompareFloat -> Add -> IfElse -> Assign max -> Refresh` 证据投影为
  `Add -> clamp(min=max_def_decrease) -> Refresh`；测试覆盖恰好到达和一步越界，最终减抗不再超过
  原始下限。
- `ForceTriggerWeakness` 已在 combat-spec 恢复：它只在 defender 上派发携带 attacker 的
  `OnForceTriggerWeakness`。真实消费者是敌方主动技能时间线中的 `SetWeaknessAction` 弱点窗口；标准
  木桩不运行敌人主动技能，因此不存在监听器，当前严格归类为
  `enemyWeaknessWindowRequiresEnemyActiveBehavior` 无效果，而不是猜固定增伤。若以后以外部标记建立
  弱点窗口，必须先补该消费者状态机。

## 2. Git 基线

- 当前工作树：`D:\Projects\Endaxis`（台式机，即旧文档所称“远程”）
- 当前分支：`refactor/common-game-data`
- 当前已提交 checkpoint：`e6440b87 feat(data): preserve legacy gear identities`；本节所述全量生成与
  正式注册正在下一提交中，仍以实际 `git log` 为准。统一编译器基线为 `fd61a59e`。
- `tmp/` 永远不得提交；新编译器全部位于 `tools/game-data-compiler`。
- `vfs-index-browser/combat-spec` 有同步规格提交，且曾混有同轮其他证据改动；两个仓库必须分别提交、
  推送和验证，不能从 Endaxis 工作树代替管理 combat-spec。

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

### Buff 图标保真边界（2026-08-22）

- “优先实现影响对敌输出的行为”只约束模拟机制排期，不允许删除用户可观察的 Buff 身份。Buff 图标即使不参与数值计算，也必须随原生定义经过解析、生成、审计、严格校验、外部定义适配和运行时编译；原生 `hasIcon=false` 表示该 Buff 本来隐藏，不能把转换器缺图伪装成隐藏。
- 生成器现保留 `spritePath`、可见性、头顶/队伍显示位、样式、颜色与排序规则；能解析到仓库资源时同时输出 `iconPath`，暂时缺少图片文件时仍保留 `iconId`，不得静默清空。秋栗产物已重新生成作为首个完整样本。
- Buff Inspector 已实际渲染图标预览，资源加载失败时保留 ID 回退；编辑器清空路径只删除 `iconPath`，不会连带删除原生 `iconId`、可见性或排序信息。当前还没有独立的模拟中 Buff 状态栏；后续添加活动 Buff 投影时直接消费运行时定义上的同一 `presentation`，不再建立旁路图标表。
- 仍可延后粒子、音效、镜头和纯动画动作；图标不属于这类可丢弃表现。

### 管理员潜能 3 冻结引爆回能（2026-08-22）

- `chr_9000_endmin` 潜能 3 已从占位槽位转为常驻 `buff_chr_0003_endminf_potential3`，黑板 `usp=15`。男女管理员终结技引爆 `buff_common_originum_frozen` 时，公共 Buff 映射从引爆者身上读取该值，并向同一干员返还 15 点终结技能量；生产场景已走通连携冻结、终结技引爆、伤害和实际回能。
- 这项闭环先修复了 `D:\Projects\combat-spec`，提交 `1e99f4a`。1.4.4 `Buff.OnIgnite` 反汇编证明动作序列的输入 `TargetHandle` 是 `igniteSource.selfTargetHandle`，而 Buff owner 仍是被冻结敌人；复刻库此前把两者错误合并。`GetTargetBuffBBAdvanced` 的 ID 查询分支也已按容器首匹配语义补齐。
- Endaxis 的 Buff 引爆编译现把原生 `Target` 归约为引爆来源干员，把 `Owner` 继续归约为 Buff 宿主。`igniteEventAction.actions` 中每个包装器会独立执行：某个包装器内部条件/读取失败只截断该包装器，不再吞掉后续天赋或潜能包装器。
- 养成审计更新为天赋 27/44、潜能 107/110，均已进入标准模拟编译；定义完整及养成模拟就绪干员均为 9 名。剩余 3 个潜能是黎风 5、秋栗 5、管理员 4，仍须分别闭环其真实消费者，不能只提高统计数。

### 萤石潜能 5 元素附着减冷却（2026-08-22）

- `chr_0022_bounda_potential_5` 已从占位槽位转换为常驻 Aura Buff。Aura 给唯一敌人挂载监听 Buff；原生 `OnEnemyBeforeTakeSpellInfliction` 精确映射到元素附着管线发给目标方的 `beforeTakeInfliction`，不与角色侧 `OnCharBeforeTakeSpellInfliction` 合并。
- `CheckSpellInflictionType(Cryst, Natural)` 生成事件元素条件。寒冷/自然附着命中后，按原生 ID 将萤石连携技当前剩余冷却减少 1 秒，并在来源干员身上创建 1 秒 `potential` 标记限频；其他元素和限频期内的重复附着均不触发。
- 响应式 Buff 操作链现接入通用技能冷却执行器；按 ID 调整冷却同时匹配 Endaxis 技能 key 与原生 `sourceSkillId`。标准伤害兼容性预检也会递归检查 `listenForCombatEvents` 的条件与响应序列，不再把运行时已支持的监听步骤误报为未知。
- 生产场景以萤石二段连携的寒冷附着验证：潜能 4 时第二次连携仍处于冷却，潜能 5 时提前 30 帧就绪。养成审计更新为天赋 27/44、潜能 106/110，均已进入标准模拟编译。

### 萤石受击天赋与潜能 2（2026-08-22）

- 天赋 2 的 `chr_0022_bounda_talent_2` 已作为常驻被动完整生成。原生四条 `OnBeforeTakeDamage` 响应分别检查火、电、寒冷、自然伤害，先排除两个免疫标签，再以黑板 `probability=0.2` 判定；成功时给自身创建 0.01 秒伤害免疫和 10 秒攻击 Buff。二级天赋攻击增幅为 20%。
- 潜能 2 通过 `patchPassiveBlackboard` 将同一被动概率提高 0.1。生产场景使用固定样本 0.25：潜能 1 的 20% 判定失败，潜能 2 的 30% 判定成功，后续首段普攻伤害实际提高；未把概率或伤害类型静态折叠。
- Buff 事件的直接 `CheckTagMatch / CheckDamageType / Probablity` 现按复刻库已证明的 `SequenceAction` 返回值短路语义保留为嵌套顺序守卫，不再出现审计有条件而正式 DSL 丢条件的问题。新增 `eventDamageTypeIn` 只读取当前事件明确携带的伤害类型；旧外部标记未声明类型时不会误命中。
- 全量生成随同纠正了既有正式产物中的同类缺口：Snowshine 的受击标签门控、Yvonne Buff 结束链的标签分流，以及庄方宜受击治疗的标签/概率门控重新进入可执行定义；这批变化来自同一通用规则，不是角色特判。
- 外部 `operatorHit` 仍不模拟敌方技能、伤害公式或生命扣减，但同一次明确受击事实会依次发布 `beforeTakeDamage` 与 `takeDamage` 两个原生生命周期边界。Ember 的后置监听和萤石的前置监听各自保持原生事件身份。养成审计更新为天赋 27/44、潜能 105/110，均已进入标准模拟编译。
- 下一批优先继续处理能够与剩余 5 个潜能形成闭环的事件型天赋/常驻 Buff；任何依赖未建模敌方主动行为的触发仍只能由明确外部标记唤醒，不能自动发生。

### 吉尔伯塔团队回能天赋与潜能 3（2026-08-22）

- 天赋 1 的 `chr_0013_aglina_talent_0` 已从 `attachSkill` 转为常驻被动，通过全局友方 Aura 向全队施加 `UltimateSpGainScalar/BaseAddition`；两级分别为 +0.04/+0.07。潜能 3 再对同一被动黑板 `add += 0.05`。
- Aura 的 `checkAlive=false` 在当前固定木桩模型中不扩大目标集：敌人没有主动伤害，干员没有死亡流程，轨道实例即是全部有效队员。通用零空间 Aura 编译因此接受该过滤位的两种值，其他派系/对象/Tag/排除条件仍严格核对。
- 复刻库已有明确证据：每次正向终结技回能都读取目标当前 `UltimateSpGainScalar`。Next 资源账本不再只保留入场面板快照，而是在每次正向回能时读取 Buff 容器的动态属性；负值消耗仍不乘回能效率。
- 生产场景用同一战技 100 SP 消耗验证基准 6.5、二级天赋 6.955、二级天赋 + 潜能 3 的 7.28 实际回能。养成审计更新为天赋 26/44、潜能 104/110 定义完整且标准模拟可消费。
- 下一优先级是继续成对收敛“未建模天赋 + 只修改该天赋的潜能”，避免只把潜能写进定义却没有真实运行消费者。

### 汤汤潜能 3 与基础被动等级链（2026-08-22）

- 汤汤潜能 3 的 7 项原生修改已全部进入定义与标准模拟：战技/终结技法术易伤、战技伤害倍率，以及 `chr_0027_tangtang_passive_0` 的战技伤害倍率。
- 基础被动不再固定以 1 级黑板编译。生成器从 `skillGroupMap` 恢复所属等级源，有 `SkillPatchTable` 时生成完整等级数组；汤汤的隐藏被动因此随战技等级解析，然后再叠加潜能补丁。无独立补丁的基础被动和由养成效果传值的 `attachSkill` 保留原声明语义。
- 汤汤战技曾被 `buff_chr_0027_tangtang_skillappear` 的 `Limited + duration=-1` 拦截。复刻库和 1.4.4 反编译证据表明负时长应先创建，再在首次 Tick 的生命周期阶段结束并执行 `OnBuffFinish`。Next 已允许有限负时长并保留同一顺序，没有把 `-1` 误降格为无限。
- 定向生产场景已验证 12 级战技下的基础被动值、潜能 3 技能/被动黑板补丁，以及潜能 3 相对零潜能的实际伤害提升。养成审计同时补认了早已实现的诀潜能 5 同类混合补丁，当前潜能定义/模拟就绪为 103/110，天赋为 25/44。
- 下一横向任务优先从剩余 7 个潜能中选择数据闭合者，然后继续事件型天赋/`attachSkill` 簇；梨诺终结技缺失能力实体模板仍保持失败关闭。

### 雪绒治疗链与治疗修正闭环（2026-08-22）

- 雪绒 `chr_0014_aurora` 的 8 个 SkillData 已严格生成并注册为 `conversionSupport: complete`。正式双轨场景覆盖连携能力实体、Aura 向队友施加内联 Buff、Buff 宿主治疗和满血治疗回执。
- Buff 生命周期中的原生 `HealAction TargetSource.Owner` 现在明确编译为 `buffOwner`。Buff 在接受者容器内执行时，治疗来源、四维属性和治疗者侧修正仍取 Buff 的原始来源，不能误归因给接受者；接受者侧修正则读取真实治疗目标的 Buff 容器。
- 已从雪绒天赋 Buff 数据和本机 `GameAssembly.dll` 1.4.4 静态反汇编恢复 `ModifyHealCalcResult`：处理时点为 `AfterCalculation`，最终治疗值乘以 `1 + baseMultiplier * multiplierCount`。Next 已接入 healer/receiver 两侧注册生命周期、目标生命比例与 Buff 黑板条件、严格定义编译和回归测试。
- 复刻库 `D:\Projects\combat-spec` 已先行补齐同一机制并提交 `9b782df feat: model heal calculation modifiers`。定向测试通过；其全量测试仅因本地仓库缺少既有 artifacts 目录产生 17 个环境性失败，1092 项通过。
- 角色承受元素积蓄前事件已新增独立 `beforeTakeSpellInfliction` 语义。它不会由玩家攻击木桩的现有元素积蓄路径伪造触发；在永久木桩边界下保持休眠，直到外部受击事实或其他有证据的正常入口产生该角色侧事件。

### 卡缪变身战技的跨组路由替换闭环（2026-08-22）

- `chr_0033_camille_normal_skill_2` 已确认不是独立战斗执行体：原生 `SwitchToAddBuff` 在变身 Buff 存在时先提交包装器的 40 ATB 与 3 秒冷却，再添加 `buff_chr_0033_camille_cast_combo2`；该 Buff 启用时同步 `CastSkill(chr_0033_camille_combo_skill_2)`。这一顺序已由 `combat-spec` 的 `Skill.TrySwitchToAddBuff`、`SwitchToAddBuff` 和对应测试覆盖，Endaxis 没有猜造规则。
- `SkillGroupDefinition.routedReplacementSkills` 显式表达“占用当前稳定槽位、但按另一原生技能分类和等级源执行”的跨组形态；普通同组 `replacementSkills` 语义不变。场景放置仍只产生基础战技输入，运行时换槽选择隐藏路由形态；编译器按连携技等级/类型编译执行体，同时保留包装器的 40 SP、第 0 帧费用提交和 90 帧冷却。
- 生成器新增严格 `routedSkill` 入口，逐项验证变身 Buff 条件、唯一 routing Buff、Owner/MainTarget、`asSkillCast=false`、CastSkill 目标与费用标志，并拒绝包装器中出现额外战斗行为。卡缪终结技的 30 秒换槽 Buff 已生成启用/结束生命周期，结束时恢复基础战技；`ultimate` 已退出 `skillBehavior` 缺口，当前只剩基础战技能力实体弱化/死亡监听缺口。
- 全量生成与 `--check` 均通过；Python 生成器测试 352/352、Next 199 文件 1340/1340、`type-check:next` 均通过。`tmp/` 仍为未跟踪临时目录，不得提交。

### 诀奥义能力实体 Aura 闭环

- `TargetReferenceSource` 现保留 `OwnerSpawnedEntityFinder` 的对象类型与 GameplayTag 查询；当前能力实体模板 ID 从子技能条件上下文显式穿过 Aura、Buff 应用、事件响应和 Buff 本地定时序列。
- 距离条件仍统一按零距离计算，但 owner-spawned 查询只有在版本化模板证据的标签结果包含当前真实执行实体时才证明实例存在；缺失或不匹配身份继续严格失败。
- 承伤事件中的 `Target == MainCharacter` 新增 `eventSourceControlled` 条件，按当前现实帧查询伤害来源是否为主控干员。`OnPoiseZero` 已接入正常失衡归零事件并保留来源/目标身份，不使用外部事件标记。
- 诀 11 个技能现可严格生成完整 `OperatorDefinition`；`--operator arcane --check` 通过。生成产物包含奥义范围 Buff 的承伤、失衡归零与四段局部激光能力实体行为。
- Python 生成器测试为 420/420；相关 Next 事件、Buff 生命周期与场景装配定向测试为 75/75。全仓 `type-check` 仍被旧版目录中既有错误阻塞，本轮改动文件未出现在错误列表；应以 `type-check:next` 和完整 Next 测试继续验收。
- `type-check:next` 与完整 Next 198 文件、1332 条测试均通过。全清单 `--check` 仍会先报告其他干员审计产物尚未刷新；尝试统一刷新后在 Camille 天赋 `OnReceiveHeal` 正常事件缺口处严格停止，已回退该次失败生成的非诀机械输出。后续应先闭环正常治疗事件，再做全目录刷新，不能为通过 check 省略该事件。

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

- Python 生成器规则测试最近基线：434 项通过；敌人 rank 提取器测试：2 项通过；能力实体提取器测试：2 项通过；
- 桌面已从 AKEDB 下载当前 `1.4.4@9433094-12` 五张 TableCfg，以及 2026-08-15 `sharedRevision` 公开清单中的 2459 个 SkillData、2678 个 BuffData；两者与 manifest `latest` 配对。当前严格全量审计基线为 30 名、320 个入口、317 个可解析、281 个可编译，零专用声明直转 11 名。诀（`arcane`）已作为 `outputStage: audit` 的 11 技能样本生成三份审计产物，但尚未生成或注册正式 `OperatorDefinition`。`seal_total -> seal/listener -> 隐藏结束技能` 的 Buff 所有权、事件响应和本地时间线已经闭环；当前无敌方主动行为模型中 `InterruptAction` 归约为不阻断后续动作的零效果。`EntityBB_wisd_greater_will` 面板桥也已由基础被动自动生成并接入共享实体黑板。两个原生终结技入口的稳定身份也已有严格证据：首段 Buff 把 `UltimateSkill` 换成二段，二段第 0 帧换回首段；诀在 manifest 明确声明 `arcana` 为运行时替换形态后，生成器才把闭环关系渲染为双向 `changeSkillSlot` 并在正式技能组使用 `replacementSkills`。普通/强化技能默认仍是可直接拖放的独立稳定技能组，不能从原生换技动作自动推断为不可放置形态。当前诀的干员级阻塞转为形态展示、形态感知连携注册与天赋潜能对照。
- `npm.cmd run type-check:next`：通过；
- 能力实体模板、目录、操作执行器和场景装配聚焦测试通过；新增步骤引起的庄方宜契约与三语言帮助文本回归已覆盖。
- 本文更新前 `npm run type-check:next` 通过；Next 全量 Vitest 为 201 个文件、1361 项全部通过，生成器全目录 `--check` 通过。新增回归覆盖雪绒能力实体 Aura、Buff 来源/宿主分离、满血治疗回执、治疗修正注册生命周期，以及既有 Buff、资源、状态、能力实体和干员转换链。
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

- 条件能力实体现已统一递归内联：每个 `SpawnAbilityEntity` 叶子以完整 `actionPath` 绑定自己的子 SkillData，互斥分支保持互斥，嵌套实体、伤害、Buff 与局部 Aura 都留在对应 `childSkill`，不会提升为根技能无条件调度；固定点生成位置按项目零空间模型删除。Snowshine 终结技新增严格编译，全量基线为 320/320 可解析、293/320 可编译、14 名完整直转。Tangtang 普通战技已深入到水体实体的 `CheckBuffStackNumAdvanced(limitSkillCastId=true)`，这是下一项明确边界。
- 递归 Aura 使 Gilberta 终结技此前漏掉的能力实体范围 Buff 进入正式生成。Buff 定义闭包现在递归收集能力实体/投射物/条件分支 Aura，并在 audit 阶段逐根解析；`DuringBuffEnable` 进入标准可重启动 `lifecycleSequences.enable`，动作时长 Slow 使用 `finishByAction` 对称结束。公共 Buff 证据把 `VulnerableAction` 的 `Physical` 限定为物理，把 `Spell` 限定为 heat/electric/cryo/nature。生成器 338 项、全量生成/`--check`、类型检查和 Next 178 文件 1127 项测试通过。
- `CheckBuffStackNumAdvanced` / `SaveBuffStackNumAdvanced` 的 `limitSkillCastId=true` 已进入统一 DSL 与运行时：查询按当前 `skillCastInfo.skillCastId` 过滤 Buff 实例，缺少施法身份时失败关闭。条件分支内已成功编译的 `SpawnAbilityEntity(saveToContext)` 会把单例来源只传播给同分支后续兄弟动作，因此紧随其后的 Context Buff/时长操作可逐稳定句柄执行；同名 key 没有实际生成来源时仍拒绝。
- 技能和能力实体子技能中的 `OwnerSpawnedEntityFinder + AbilityEntity + TagValidator` 现在会生成实际 `findOwnerSpawnedAbilityEntities` 步骤；`SkillCastIdValidator` 保留为同次施法过滤，实体数量可写入动作黑板或直接由 `contextTargetCountCompare` 比较，后续 `ForEach` 仍遍历完整集合。Tangtang 普通战技由此严格编译。无标签 owner-spawned 时间膨胀查询直接作用于运行时逻辑实体目录，不再错误要求目标属于当前技能子图；Liino、Yvonne 连携新增严格编译。全量基线为 320/320 可解析、296/320 可编译、14 名完整直转；Tangtang 连携已推进到条件分支递归投射物子图（投射物子技能继续生成能力实体），不能按即时命中投射物近似。
- Tangtang 连携的递归投射物/能力实体结构已继续闭环：零飞行时间投射物只在触发子技能全部行为位于局部第 0 帧、无环且完整动作集可编译时，按精确 `actionPath` 留在原条件分支展开；其中生成的水体实体继续携带完整局部时间轴，实体内部条件投射物也走同一机制。水体 0–1500 帧的两个 `JumpToAction.conditionAction` 已按来源解析为 `CheckBuffStackNumAdvanced(Owner)`，局部 Owner 归约为 `currentAbilityEntity`；终止证明保留 900 帧正常结束及 1500/1515 两个唤醒区段。全量审计仍为 320/320 可解析、296/320 可编译、14 名完整直转，但 Tangtang 连携的阻塞已从递归结构推进到 `chr_0027_tangtang_normal_skill_water_projhit_damage` 的动态 `tornado_atk_scale01` 没有可解析等级值。该键只在普通战技/终结技入口有来源，当前连携链没有已证明赋值；在确认原生黑板缺键语义前不得把载荷中的 `0.9` 当作默认回退。
- Tangtang 动态倍率已完成原生取证：匹配 1.4.4 的 `BlackboardDouble.GetValue` 在查键失败时记录错误并返回 `0.0`，不会读取动作序列化 `value`，证据见 `docs/research/native-blackboard-double-missing-key.md`。递归投射物/能力实体子 SkillData 现在保留自身明确声明的 dynamic 数值初值，并按“声明初值 -> 继承黑板 -> 显式赋值”覆盖；未声明缺键仍失败关闭。由此 `tornado_atk_scale01` 使用命中子 SkillData 明确声明的 `0.0`，而不是动作里的 `0.9`。随后又补齐 `FinishBuffAdvanced.finishLayerCnt`，Tangtang 连携的新阻塞已推进到水体 0–1500 帧两组 Aura 的固定 `Bad/Good` 阵营及 `进入时结束 outaura Buff / 离开时创建 outaura Buff` 生命周期。全量仍为 320/320 可解析、296/320 可编译、14 名完整直转。
- 庄方宜条件投射物链已严格闭环：`abilityEntityHits` 必须与根条件的投影实体在数量、绝对帧、完整载荷和身份上逐项相等才按重复表示处理，实际生成仍留在精确条件分支；空子战斗 SkillData 作为惰性逻辑实体生成，`abilityEntitySkillId` 为空的假目标模板也生成但不附造 `childSkill`。普通战技及强化战技由此通过通用 DSL。条件节点的无条件实体投影现会把单例 Context 来源向后传给同一根时间线，强化三段普攻随后对 `Context/thunder` 施加取消 Buff 已闭环；条件叶也会先移除已明确忽略的 Buff，再要求剩余动作具备目标来源。全量提升到 320/320 可解析、299/320 可编译、14 名完整直转。庄方宜终结技在正式清单中已借由明确忽略的纯表现 `potential5_vfx` 编译；无清单豁免的全量横向审计仍将它报告为 `Context/ult_postmodel_mirror` 目标阻塞。Tangtang 仍停在 Aura 进出生命周期。
- 本轮门禁：生成器 346 项通过；全量生成与 `--check`、`npm run type-check:next` 通过；Next Vitest 178 文件、1128 项全部通过。`tmp/` 仍仅为未跟踪审计输出，不得提交。
- Tangtang 水体的固定阵营 Aura 现已按统一零空间规则闭环：`Anti/Bad` 指向唯一敌人，`Anti/Good + excludeOwner` 指向除施法者外友方；进入 Aura 的直接 `FinishBuffAdvanced` 先结束 outaura Buff，领域 Buff 使用动作区间句柄，能力实体局部结束帧再执行直接 `CreateBuffAction` 施加 outaura Buff。能力实体子图的 `OwnerSpawnedEntityFinder.selectorOwner=ActionSource` 只在该上下文归约为原施法者，根技能没有放宽；同组 `CheckEntityNum(Context, GE >= 1)` 已证明带标签实体存在时，相关 Context 距离才允许按零距离折叠。Tangtang 由 9/11 提升到 10/11，全量保持 320/320 可解析、299/320 可编译、14 名完整直转。
- Tangtang 唯一剩余入口的当前首阻塞为 `Context/water_abilityentity02` 上的 `CreateTimedMarker(useTimeDilationDt=false)`。该 Context 有同分支单例生成来源，但现有 `createAbilityEntityTimedMarker` 明确绑定实体局部 elapsed time；原动作要求非时间膨胀时钟，因此不能直接复用。下一步应在逻辑能力实体上提供可由共享战斗时钟驱动的标记容器或等价的显式时钟选择，并同时贯通创建、`CheckTimedMarkerCondition`、动作结束清理和测试，不能把局部时钟标记改名后放行。
- 本批门禁：生成器 Python 规则测试 349/349、全量生成和 `--check`、全干员审计、`npm run type-check:next`、Next Vitest 178 文件 1128/1128 均通过；`tmp/` 仍仅为未跟踪目录，不得提交。
- Tangtang 的最后一条能力实体标记链已闭环。`createAbilityEntityTimedMarker` 现在要求 `timeDomain: 'self' | 'global'`：前者读取实体局部 elapsed time，后者读取场景共享 `CombatClock`；`TimedMarkerContainer` 为每个实例保存创建时钟，所以两类标记可在同一实体上共存且独立到期。单例 Context 创建在 `forEachContextTarget` 中执行；`abilityEntityTimedMarkerPresent` 可在有明确 owner-spawned AbilityEntity 来源时检查 Context 集合任一实例。
- 取证过程中确认 Tangtang 的 `water_group` 并非能力实体子图本地写入，而属于递归条件投射物触发的 `chr_0027_tangtang_combo_skill_water_gene` 自身。此前 `ProjectileTriggeredSkillSource` 没有保留该 SkillData 的目标组写入，导致条件编译看不到原生第 4 号 `FindTargetAction`。现在调用图保存 `localTargetGroupWrites`，分支内联前按 born tag 生成实际 `findOwnerSpawnedAbilityEntities`，再执行水体阶段标记条件。Tangtang 已达到 11/11，严格全量基线更新为 320/320 可解析、300/320 可编译、15 名完整直转。下一步将其加入正式 manifest/注册链并做标准场景回执验证。

### 2026-08-20：Tangtang 正式生成、周期下落伤害与水体标准模拟闭环

- `tangtang` 已加入正式生成 manifest、默认数据仓库与全等级编译测试，注册 5 段普攻、终结技、下落攻击、战技、连携技和终结技共 10 个可放置技能。基础被动 `chr_0027_tangtang_passive_0` 只作为养成来源登记并从可放置原生技能组比较中单独排除；潜能 3 同时修改技能与尚未可执行的基础被动黑板，继续以单个 `unmodeledPotential` 暴露，未做半套转换。终结技空时间膨胀曲线仍显式未建模，没有猜倍率。
- 能力实体子技能现在把递归 SkillData 自身声明的数值黑板内联进 `childSkill.blackboard`，运行时按现有“子技能初值 + 实体继承/显式赋值”链解析。Tangtang 水体的 `ratio_speedreduction`、持续时间和跳转参数因此有本地证据来源；标准场景已实际跑通连携伤害、能力实体生成、水体 Aura/Buff、全局/局部定时标记及局部第 900 帧实体结束回执。
- 根技能新增严格的固定周期直接伤害投影。Tangtang 下落攻击原生 `TickIntervalAction` 在第 3–11 帧每 0.07 秒直接执行一个 DamageAction，按既有 30 Hz 单精度累计规则生成第 3/5/7/9/11 帧五段冰伤。只接受唯一直接伤害且不与条件伤害混合的形状；Liino 等复杂/逐帧 Tick 仍走原有独立解析链，不被本次规则吞掉或近似。
- 水体 Buff 中 `SlowAction(asChildBuff=true)` 仅在 plain Source→Owner、持续时间与宿主相同、空子 Buff ID、无 enhancing、`autoFinishByAction=true` 全部成立时折叠为宿主 `slowed` 标签；Aura 离场 Buff、递归条件 Buff 和能力实体条件中的 Buff ID 也纳入定义闭包及省略声明校验。Rossi 已明确跳过其本就未建模的 `normal_bleed` 定义递归，避免把流血暴击附加伤害的未支持治疗载荷误报成已转换。
- 当前严格横向审计保持 30 名、320/320 可解析、300/320 可编译、15 名无专用声明完整直转。正式生成定义增至 14 名，仓库显式入口增至 16 名；养成审计更新为天赋 13/28 已转换且 13/28 可进入标准模拟，潜能 61/70 已转换且 61/70 可进入标准模拟。验证基线：Python 352/352、manifest 全量生成与 `--check`、Next 类型检查、Next Vitest 178 文件 1144/1144。
- 后续对 5 个 `projectile-data` 阻断做了本机 VFS 精确取证。Wulfgard 终结技与 Ardelia 重击的三个组件资产均唯一命中，但当前 AnimeStudio JSON 只导出 Unity 基础字段，没有 managed-reference registry，接口 422 表示解码链退化而非组件为空；Liino 6 个相关 projectileId 在当前 manifest 中均不存在。关闭 hit/block/reach/finish SkillData 回调不能证明投射物没有独立碰撞或命中语义，因此 5 项继续失败关闭。精确 record/asset 身份、9 个 ID 的边界和恢复顺序见 `docs/research/projectile-component-evidence-gap.md`。
- Last Rite 天赋 1 已闭环。同版本 `OnConsumeBuff`、通用 `dispell_spellinf`、训练关 `check_any_inflict` 与连携智能选敌语料共同把 Tag `-193971080` 限定为法术附着集合；Next 不实现通用 Tag 父子查询，只在元素状态机实际移除旧附着后发布 `elementalAttachmentConsumed`。事件动态写入真实消费层数，养成监听器再用等级常量 `2%/4%` 计算并给唯一敌人施加 15 秒寒冷易伤。监听与子 Buff 均内联在天赋定义中；证据边界见 `docs/research/last-rite-consumed-infliction-talent.md`。Camille 潜能 5 对治疗监听隐藏被动的补丁已在该被动正式生成后闭环，不能映射到可释放技能组。
- Da Pan 天赋 2 已由现有严格技能黑板补丁链接入终结技：两级分别写入 1/2 层准备 Buff 上限，并共同写入 20 秒持续时间和 40% 连携技基础冷却缩减。终结技、嵌套 Buff、施法前监听、输出伤害监听和冷却执行器此前均已闭环，本次没有新增事件类型或近似规则。
- Endministrator 潜能 5 已按完整事件型附着 Buff 生成：战技/终结技施加 `buff_chr_0003_endminf_potential5_trigger` 后，常驻监听器用精确 Buff ID 条件命中，并分别对 `chr_0003_endminf_combo_skill` 与 `chr_0002_endminm_combo_skill` 的当前剩余冷却扣除 2 秒。运行时 `absoluteSeconds` 操作按 30fps 转成 60 帧并最低归零，不修改基础周期；该链不依赖敌方主动行为或外部事件。
- Estella 潜能 5 已从未建模槽位转为常驻 Buff：`DuringBuffEnable` 的 GlobalAura 在固定零空间模型中给唯一敌人挂载 `buff_chr_0021_whiten_potential_5_inaura`，并用 `finishByAction` 句柄随父 Buff 停用/结束精确释放。子 Buff 监听敌人成功收到 Buff 的事件，按原生标签 `1535684437` 和 1 秒标记限频，给潜能来源干员回复 5 点终结技能量。事件回调里的直接 `CheckTimedMarkerCondition` 已纳入顺序守卫，Arcane、Da Pan、Last Rite 的同形状产物也随全量生成纠正；Buff 内 `Owner` 标记严格映射到实际宿主。`addedBuff` 负载现统一包含 Buff ID、applyTags、来源和宿主，元素附着适配器直接写容器时也不再绕过事件。AKEDB 证明 `buff_common_cryst_cryst_frozen_triggered_do` 携带该标签，但当前版本化元素定义尚未纳入这条冻结状态创建链，所以不能凭空构造生产场景的最后一跳；现有回归覆盖严格生成、Aura 句柄生命周期、标签条件和资源响应结构。
- 本批门禁：生成器 Python 规则测试 352/352、manifest 全量生成与 `--check`、全干员审计、`npm run type-check:next`、Next Vitest 178 文件 1144/1144、`git diff --check` 均通过；`tmp/` 仍仅为未跟踪目录，不得提交。
- 后续横向复核补齐了 Buff 层数条件的宿主解析：生命周期中的 `CheckBuffStackNum*` 遇到 plain `Owner` 时，与标签条件、定时标记和动作目标一致解析为实际 Buff 宿主，而不是退回根技能目标；施法者与敌方宿主均有生成器回归。秋栗潜能 5 的严格试编译证明其槽位形状是“终结技黑板补丁 + 常驻标记 Buff”，但实际收益继续依赖天赋 2 创建的全局 `global_buff_combo_trigger`（连击 / Link）及后续消费机制，不能误作 `openComboWindow`；洁尔佩塔天赋 1 还缺职业过滤全队 Aura 和动态终结技回能倍率，达坂天赋 1 还缺公共破防 Buff 消费事件与真实消费层数。三项试接均已撤回，正式生成物与完成度统计不变。本轮门禁为 Python 353/353、manifest 全量生成与 `--check`、`npm run type-check:next`、Next Vitest 178 文件 1144/1144、`git diff --check`。

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

### 2026-08-20：洛茜爪印 Buff 的周期伤害闭环

- `buff_chr_0028_wulfa_normal_defup` 已按 BuffData 原始结构内联：挂在洛茜自身、持续时间使用全局时间域，根 `DamageScaleProcessor(Defender/ProdCalcZone, defup=-0.5)` 原样保留。敌人仍是不会主动攻击的木桩，所以该玩家侧减伤目前没有标准场景伤害输入可观察，但不能据此删除定义。
- Buff 局部 `TickIntervalAction(0.1s, frames 10..20)` 复用固定间隔单精度投影，生成本地第 10/12/15/18 帧四次物理伤害。生产模拟中，战技从现实帧 1 开始时，四次爪印伤害记录在 225/227/230/233 帧，来源均为洛茜；没有引入敌方主动行为。
- 生成器此前只扫描 Buff 直接伤害，导致周期容器内的 `DamageAction` 虽出现在 `combatActions` 审计中，却可能因没有开启 Buff 调度编译而静默遗漏。本轮把 `intervalDamageHits` 纳入 Buff 定义事实、严格拒绝边界和实例级 `scheduledSequences`，并让残余 `combatActions` 强制进入覆盖检查；同类遗漏以后会失败关闭。
- 无条件 `damageModifier` 现在作为合法的空条件形状解析；它不同于条件丢失，仍完整保留启用侧、处理侧、乘区和黑板加值。
- 最终调度表达式会再次收集实际动作黑板引用，只给来源中已声明、确实使用，且没有补丁/本地计算/变异/Buff 读取/外部输入生产者的纯数值键注入默认值。该修复补回洛茜零潜能时会读取的 `potential_upgrade=0`；唐堂 `tornado_atk_scale*` 等外部动态输入仍不会使用序列化零值兜底。
- manifest 已从战技、二段连携和三段连携的未建模清单移除 `normal_defup`；洛茜 `comboSkill3` 不再属于 `skillBehavior` 缺口，战技和二段连携仍有其他明确未建模 Buff，终结技缺口不变。
- 收尾门禁：Python 规则测试 355/355、manifest 全量生成与 `--check`、`npm run type-check:next`、Next Vitest 178 文件 1146/1146 均通过。本机旧 `__pycache__` 曾残留错误字段布局，验证改用 `tmp/python-cache` 独立缓存后全绿；`tmp/` 仍只作为未跟踪目录，不得提交。

### 2026-08-20：洛茜二段连携延迟伤害 Buff 闭环

- `buff_chr_0028_wulfa_combo_2_damagewait` 已从二段连携的未建模清单移除。它挂在唯一敌人身上，在动作传入的 `duration=0.3` 到期时执行 `OnBuffFinish`，再把 `atk_scale`、`trigger_times=3` 与 `damage_interval=0.125` 传给 `buff_chr_0028_wulfa_combo_2_damage`；不是把延迟伤害静态提升到根技能时间线。
- Buff 生命周期事件中的 plain `Target` 只在事件来源确为 Buff、且宿主已严格证明为唯一敌人时归约为该宿主；Ability 承伤/输出等事件仍保留自己的事件目标语义。动态 `maxTriggerCount` 现在与持续时间、触发间隔一样可从实例黑板读取，非整数固定值继续拒绝。
- 普通 `OnBuffTrigger` 已进入 `lifecycleSequences.trigger`。生产模拟明确只放置可手动拖出的 `comboSkill2`，延迟伤害 Buff 产生 3 次触发间隔伤害和第 10/12/15/18 实例局部帧的 4 次固定周期伤害，共 7 次，来源均为洛茜。测试没有自动放置 `comboSkill3`，也没有为其尚未接通的精准衔接状态 `EntityBB_Combo_QTE_Trigger` 伪造默认值。
- 标准伤害兼容预检补列了运行时已由 `SkillCooldownOperationExecutor` 支持的 `adjustSkillCooldown`，避免合法的洛茜连携冷却步骤在模拟启动前被误拒绝。
- 养成审计已重新生成并与 manifest 对齐为天赋 13/28、潜能 61/70。门禁为 Python 357/357、manifest 全量生成与 `--check`、`npm run type-check:next`、Next Vitest 178 文件 1148/1148。直接运行全仓库 Vitest 仍有 8 个旧版/UI 结构基线失败，与本批修改文件无重叠；Next 专用门禁全绿。`tmp/` 仍不得提交。
- 洛茜 `comboSkill2` 仍因 `combo_2_qte_timerlistening` 与 `combo_usetimer` 保持 `skillBehavior` 缺口；战技的 `normal_bleed` 递归进入天赋 2 暴击追加伤害与治疗链后，当前首阻塞是治疗失败短路语义，不能只抽取基础 DoT 后宣称整个 Buff 完整。

### 2026-08-20：洛茜精准衔接 QTE 生产/消费链闭环

- `ShowComboRingQte` 不再被当成纯提示丢弃。生成器严格关联它的 `earlyDuration=time_warning=0.5`、`activeDuration=time_succeed=0.5`、成功动作 `EntityBB_Combo_QTE_Trigger=1`，以及唯一从 `time_succeed` 读取持续时间的 Owner `qte_timer` Buff；监听 Buff 启动时原生清零动作仍保留。关联不唯一、成功写入不是 plain Owner 或计时来源不匹配都会失败关闭。
- Next 将用户独立拖放的连携技视为 QTE 输入：只有 `qte_timer` 仍存在时，`beforeCastSkill(comboSkill)` 才在技能根序列执行前写入共享实体黑板。没有自动放置或替换 `comboSkill3`，提示期也不会自动成功。生产回归中第二段起始帧 1、后续段起始帧 55 时进入优先级 50 的精准冻屏；后续段改到帧 75 时只保留普通连携的优先级 30 冻屏。
- 监听 Buff 的 `PauseBuffTime` 只会延长 6 秒监听器/表现寿命；精准判定由独立 0.5 秒 `qte_timer` 决定，标准排轴又不模拟教程提示和自动技能可用性，因此没有把暂停动作伪造成战斗状态。`comboSkill2` 已移除 QTE 监听缺口，但仍因 `buff_chr_0028_wulfa_combo_usetimer` 保持 `skillBehavior` 缺口。
- 精准分支施加的 `CriticalRate` 与 `CriticalDamageIncrease` Buff 已映射到运行时增量属性，并叠加进普通伤害与法术爆发的即时快照；面板基础值仍留在构筑层，没有编造原生上下限。
- 本轮门禁：Python 359/359，manifest 全量生成及 `--check`，`npm run type-check:next`，Next Vitest 178 文件 1151/1151 均通过。`tmp/` 仍为未跟踪目录，不得提交。下一项优先接入 `combo_usetimer` 的换段/冷却生命周期；其 `OnBuffFinish` 已能解析，当前真实阻塞是强击期间 `PauseBuffTime`/`powerattack_resumecombo` 对 6 秒窗口时钟的暂停与恢复，不能只抽取到期冷却后宣称完整。之后再回到 `normal_bleed` 的治疗失败短路边界。

### 2026-08-20：洛茜连携计时 Buff 的重击暂停/恢复闭环

- `PauseBuffTime` 已按当前 Buff 实例建模：暂停期间不推进剩余持续时间、周期触发、挂载时间轴或 `passedTime`，恢复后从原剩余时长继续；它不会暂停同实体其他 Buff，更不会复用全局时间膨胀。
- 技能启动事件新增原始 `sourceSkillId`，因此 `CheckSkillId(chr_0028_wulfa_power_attack)` 匹配原生重击身份，不拿编辑器稳定 key 或笼统 `finisher` 类型冒充。`OnFinishedBuff` 由 Buff 实例真实结束边界发出，并以 `buffId` 匹配 `powerattack_resumecombo`。
- 洛茜重击的 `powerattack_resumecombo` 来自第 0–65 帧 `CreateBuffAction(autoFinishByAction=true)`；根 Buff 应用现保留该动作区间和实例句柄，第 65 局部帧结束标记 Buff，随后恢复 `combo_usetimer` 与 QTE 监听 Buff。两个计时 Buff 的同优先级响应只在编译证明叶子为互斥技能身份写入或当前实例暂停赋值时共享事件优先级；其他未证明的同优先级动作仍拒绝注册。
- `combo_usetimer` 到期时结束 `combo_usecount` 并按原生 `need_set_cd >= 0.5` 将二段连携冷却设置为完整周期。`ChangeSkillAction` 只负责恢复 ComboSkill 槽位；根据“强化/后续技能由用户直接拖放”的既定编辑器方针保留审计事实，不驱动自动替换或自动摆放。`OnTrulyExitFight` 与 `OnRemoveAllPendingComboSkill` 没有标准木桩模拟事件入口，只记录为边界，不伪造触发。
- `comboSkill2` 已从 `conversionSupport.skillBehavior` 缺口移除；生产回归比较有无重击时 `combo_usetimer` 的自然到期帧，确认重击动作区间会推迟到期。下一项回到洛茜战技 `normal_bleed` 的治疗失败短路，或继续处理终结技剩余战斗形态缺口。
- `autoFinishByAction` 目前只在根技能时间轴投影，因为根调度项保存了同一原生动作的 `endFrame`；能力实体子技能和 Buff 事件序列尚未统一保存该结束边界，不能仅凭布尔字段创建动作区间句柄。全量生成时曾由此暴露 Gilberta 来源死亡监视 Buff 的回归，现已以根上下文限制和专门测试锁定。
- 本轮门禁：Python 361/361、manifest 全量生成与 `--check`、`npm run type-check:next`、Next Vitest 178 文件 1154/1154、`git diff --check` 均通过；`tmp/` 仍仅为未跟踪目录，不得提交。
- `normal_bleed` 的下一阻塞已进一步取证：追加伤害后的 `HealAction(alwaysNext=false)` 以原生 `Modifier.ApplyResult.Succeed` 决定序列是否继续，不能用 `actualHealing > 0` 代替；随后另有 `HP < 100%` 条件控制天赋治疗特效 Buff。当前真正缺口是把 Buff 创建来源身份传入嵌套生命周期，使 plain `Source` 可严格解析为洛茜而不是敌方宿主；完整证据与实现顺序见 `docs/research/rossi-normal-bleed-heal-boundary.md`。

### 2026-08-20：洛茜战技 `normal_bleed` 递归闭环

- `buff_chr_0028_wulfa_normal_bleed` 已从战技的未建模与跳过解析清单移除。根 Buff 的物理/火焰承伤修正按原生 `CheckDamageType` 保留，流血伤害保留 `Dot | TalentDamage` 两个原生装饰位；`TalentDamage=0x80000000` 的身份由运行时枚举声明和单独使用该位的洛茜天赋追加伤害 Buff 交叉确认，不从名称猜测。
- Buff Ability 事件新增 `takeCriticalDamage`。标准伤害环境仍先派发普遍的 `takeDamage`，且只在同一伤害结果 `isCritical=true` 时追加派发 `takeCriticalDamage`；非暴击不能触发洛茜天赋 2 的追加链。事件内 `eventSourceMatchesBuffSource`、技能标签条件和原生顺序保持不变。
- `HealAction` 现保留 `alwaysNext`，但标准木桩环境没有治疗取消/免疫输入，治疗应用成功与 `actualHealing > 0` 明确分离。plain `Source` 在 Buff 生命周期中编译为动态 `buffSource`，执行时通过当前 Buff 实例携带的精确来源 ID 解析治疗目标与后续生命比较；缺失来源或面板生命账本时失败关闭，不能退回静态 caster。
- 标准伤害兼容预检现在按每名干员是否装配面板生命账本判断 `caster`/`buffSource` 治疗与生命比较。洛茜生产场景因此通过完整预检和执行，不再因 96 个递归展开路径被误报为不兼容。
- 战技最后的 `buff_chr_0028_wulfa_tut_normalskill_success` 经原始 BuffData 核对并非纯教程表现：它在投射物第三次命中的局部子技能中施加给 Source，并于自身局部第 10/12/15/18 帧对主目标造成四次物理伤害和固定失衡。生成器现只把会提升到根调度的投射物子技能 Source Buff 加入定义依赖，不把未迁移能力实体子图一并展开；`autoFinishByAction` 的局部结束帧随提升后的绝对起点平移，避免第 230 帧开始却在局部第 0 帧结束的非法区间。生产回归观察到绝对第 240/242/245/248 帧四跳。
- 洛茜战技现已退出 `skillBehavior` 缺口，整名干员只剩 `talentEffects` 和终结技 `skillBehavior`。本轮最终门禁：Python 365/365、manifest 全量生成与 `--check`、`npm run type-check:next`、Next Vitest 178 文件 1158/1158、`git diff --check` 均通过。`tmp/` 仍仅为未跟踪目录，不得提交。下一项应继续终结技的三个已知 Buff，优先处理不依赖敌人主动行为的战斗形态或流血暴伤链。

### 2026-08-20：技能 Buff 蓝图提升为干员附属对象

- BuffData 与技能等级解耦。定义解析只读取 BuffData 自己声明的固定黑板默认值；SkillPatch 的逐级值留在技能 `applyBuff.blackboardAssignments`，随每次施加写入实例。场景编译因此只为每名干员生成一份 Buff 蓝图表，并显式拒绝蓝图内部出现技能等级数组。
- 正式生成器把技能、天赋和潜能中的 `applyBuff.definition` 自叶向根提升：只有 `buff_chr_*` 进入干员级 `buffDefinitions`，其他公共/系统身份汇总到单一只读 `commonBuffDefinitions.generated.ts`。嵌套 Buff 也只通过稳定 ID 链接，同一 ID 若在不同调用点产生不同定义会立即报错。
- 运行时从“版本化公共表 + 当前干员表”解析 ID-only `applyBuff`，再叠加本次 `blackboardAssignments`；两张蓝图表都不保存单次模拟状态。全量正式生成无定义冲突，公共文件当前汇总 8 个实际引用定义；所有正式干员表均只含 `buff_chr_*`。
- manifest 顶层、干员顶层和单技能 `compile` 均支持 `simulationNoEffectBuffIds`，三层取并集并在定义解析前排除。全局层拒绝 `buff_chr_*`，角色专属屏蔽必须写到对应干员；该字段只用于已有证据证明不影响木桩模拟的 Buff，不能掩盖未知行为。
- 编辑器待办：增加干员层级的附属对象工作区，支持自定义角色 Buff 的增删复制、结构化编辑、ID 唯一性校验和技能引用选择器；公共表只读且不可自定义。不能退回技能内联复制。当前实现只完成数据、生成和运行时边界，尚未实现该编辑器入口。

### 2026-08-20：能力实体蓝图提升为干员附属对象

- 正式生成器新增 `operator_ability_entity_linker.py`。所有 `spawnAbilityEntity.definition` 从技能、天赋和潜能源码递归提出；`abilityentity_chr_*` 写入当前干员 `abilityEntityDefinitions`，其他身份写入只读 `commonAbilityEntityDefinitions.generated.ts`。调用点只剩 ID、目标、时长覆盖、Context 输出和实体黑板赋值；单行/多行对象都受控解析，同 ID 不同蓝图失败关闭。当前公共表为空，不能因此把未知公共实体自动归为无效果。
- 能力实体不能复制 Buff 的 0 级编译规则。子技能的黑板、伤害和失衡存在真实技能等级数组；场景编译按每次引用技能的等级生成该技能自己的 `abilityEntityDefinitions` 闭包，根步骤和子技能中的递归生成仍只保留 ID。共享蓝图不会产生无限静态内联。
- `AbilityEntityOperationExecutor` 从当前已编译技能程序解析 ID-only 生成。每个实体实例会复制自己的子技能程序步骤，避免递归实体共享同一个步骤对象时，`finishByAction` Buff、时间动作等以步骤身份保存的运行态互相冲突；唐糖生产模拟已覆盖该边界。
- 时间轴命中预览现在可从干员级能力实体表收集子技能命中；技能校验允许 ID-only 生成步骤，场景编译会对缺失定义严格报错。
- 此处曾短暂实现实例级 `customAbilityEntityDefinitions`，现已删除。能力实体定义只属于完整 `OperatorDefinition`；自定义内容随项目级干员模板保存，不再经过实例合并兼容路径。
- 干员构筑弹窗现提供能力实体工作区：可创建、复制、删除项目对象，编辑生成蓝图时自动形成项目覆盖，也可恢复版本化定义；子技能继续复用结构化调度序列和步骤编辑器。能力实体本身没有等级，子技能逐级值按引用技能的当前等级解析，不再展示虚假的能力实体 1–12 级控件。公共能力实体只展示稳定 ID，不允许改写。技能生成步骤改用合并后的稳定 ID 选择器，只编辑目标、持续时间覆盖、Context 和黑板赋值；新步骤不再创建内联蓝图。旧的显式内联定义仍由模型保留兼容，但不是新增入口。
- 能力实体工作区的编辑草稿在组件边界统一转成纯项目 JSON；不能直接用 `structuredClone` 克隆 Vue 嵌套响应式代理，否则新增实体启用子技能或编辑序列时会抛出 `DataCloneError` 并中断更新。浏览器实际验收已覆盖新增实体、修改生命周期、启用并改名子技能、新增调度序列和步骤、保存及重新打开，数据完整保留且控制台无错误。本轮门禁为 `type-check:next`、Next Vitest 178 文件 1176/1176。
- 能力实体工作区不再把完整对象树一次性纵向展开：弹窗为固定高度双栏工作区，左栏支持 ID 搜索并截断显示长身份，右栏拥有固定对象工具栏和独立滚动区；初始黑板默认折叠并显示参数数目，子技能时间线以序列摘要列表选择单条序列编辑，窄视口自动改为摘要卡片网格，序列内部仍只展开当前步骤。实际以汤汤 9 个实体、首实体 15 项黑板和 9 条调度序列验收，搜索、第三条 4 步序列切换、复杂步骤表单及窄视口重排正常，没有横向溢出，控制台无告警或错误。本轮门禁为 `type-check:next`、Next Vitest 178 文件 1176/1176、`git diff --check`。
- 2026-08-20 层级纠正：能力实体不再作为干员实例的养成设置展示。构筑弹窗右上角改为“自定义干员”入口，新工作区以完整 `OperatorDefinition` 为对象，统一容纳基础成长面板、技能组/技能、干员级 Buff 与能力实体；基础面板可逐级编辑，技能进入完整技能编辑器，Buff 复用结构化生命周期编辑器，能力实体进入上述独立工作区。
- 项目级模板库已经进入 `EndaxisProjectDocument.definitionLibrary`，覆盖干员、武器、装备和套装四类完整物化定义。`origin` 只记录来源模板与游戏数据版本，不做运行时继承。内置与项目模板通过统一仓库进入选择、面板、编译、模拟和校验；schema-1 旧项目缺少该可选字段时按空库读取。
- “自定义干员”会立即创建 `project:operator:*` 模板并原子切换当前轨道，已有技能块保持原位置和稳定引用。项目模板和场景编辑共用 `ProjectEditorSession` 撤销历史；定义保存、重置与轨道切换都参与同一撤销/重做链。模板内部 key 可自由编辑，随后无法匹配的技能块不会被删除或迁移，而是在原帧显示严格解析错误。
- 项目模板 ID 与静态资源目录已经分离：自定义干员定义继承 `assetSlug`，头像、天赋和技能图标均从来源资源目录加载，不能把 `project:operator:*` 拼入 `/operators/` URL。浏览器已验证弧光自定义模板仍请求 `/operators/arclight/avatar.webp`。
- 当前证据边界：干员的派生、编辑、选择和模拟 UI 已接线；武器、装备和套装已具备项目存储、派生函数、校验、序列化与统一列表查询，但尚无创建/定义编辑 UI。Next 时间轴仍以内置样板项目初始化，尚未接入真实项目打开/保存外壳；项目模板 ID 也仍由页面内计数器分配。
- 本次收尾门禁：`npm run type-check:next`、Next Vitest 180 文件 1184/1184、`git diff --check` 通过。`tmp/` 仍不得提交。

### 2026-08-21：复刻库先行的护盾/霸体闭环与弭弗正式生成

- 新的机制缺口必须先核对解包、IL2CPP 静态转储与 `GameAssembly.dll`；若 `combat-spec` 尚未复刻，则先在复刻库补数据适配、原生运行时语义、证据文档与测试，再接 Endaxis。不得只为让某名干员通过而在生成器中近似实现。当前 `combat-spec` 已提交 `7ce4881 feat: reproduce buff shields` 与 `47f6c53 feat: reproduce sustained super armor actions`。
- Endaxis 已按上述证据接入 `BuffData.shieldConfigs`：每个 Buff 实例独立持有护盾容量和次数，按伤害类型执行 ratio/scale 换算，按优先级及 Buff 剩余时间排序消费，耗尽时可结束所属 Buff。护盾位于伤害前置事件之后、生命写入和后置事件之前；空吸收表采用原生默认全类型 `1:1`。护盾特效只保留选择位，不进入后端。
- `DuringBuffEnable` 的 `SetSuperArmorAction` 作为独立持续保护注册；多个实例按原生语义取最大霸体与冲击抗性，Buff 停用或结束时注销。当前 `buffSource` 目标只在来源与宿主身份一致时执行，跨实体来源仍严格失败。
- 弭弗 `buff_chr_0031_mifu_shield` 的 `FinalShield`、耗尽结束、35 霸体和 100 冲击抗性均已进入正式定义。她的二段/三段战技也通过已有 `ChangeSkillAction` 运行时换槽接入。此次暴露并修正了旧实现把“技能组键”和“基础技能稳定键”混为一谈的问题：弭弗组键是 `battleSkill`，技能键是 `battleSkill1/2/3`。
- 弭弗 manifest 已从 `outputStage: audit` 提升为 `complete`，11 个技能生成 `mifu.operator.generated.ts`；当前与莱万汀相同，属于完整正式产物但尚未注册到默认 Next 数据仓库。生成器 `--check` 通过。Python 新增护盾、霸体与异名换槽回归；全文件测试仍有 3 个此前已存在且与本轮无关的夹具/断言失败。`tsconfig.next` 的既有错误须以本轮最终门禁结果为准。
- 弭弗生产回归已贯通连携天赋护盾创建、大招切换 `battleSkill2`、二段战技切换 `battleSkill3`。该回归同时暴露并修正了原生 `IfElseAction/SwitchAction.alwaysNext` 在生成 IR 和运行时丢失的问题：字段现在从严格解析、IR 优化、DSL、校验到运行时完整保留，编辑器修改条件也不会清掉它。证据来自原始动作字段及 `combat-spec` 已有的返回值复刻，不是角色特判。
- 下一步决定弭弗与莱万汀是否一起注册默认仓库，然后继续伊冯的能力实体宿主目标身份、梨诺的剩余正式阻塞。任何新机制仍遵守复刻库先行规则。
- 本轮最终门禁：Next Vitest 197 文件、1276/1276 通过；弭弗生成与 `--check` 通过；新增 Python 定向测试 27/27 通过。Python 大夹具恢复为既有 325 项中的 3 个无关失败；`type-check:next` 只剩既有 3 个 `afterKillEntity` 回调联合类型错误；`git diff --check` 通过。尝试全量刷新生成物时在唐糖嵌套 Buff 的空 `spawnedObjectType` 严格校验处停止，未保留半生成的其他干员产物；该目标身份必须按复刻库先行规则取证，不能为全量生成猜默认值。`tmp/` 未纳入版本控制。
- 本轮新增命令层、Build 投影和场景编译回归，`npm run type-check:next` 通过。当前 Codex 文件沙箱会阻止 esbuild 读取用户目录，Vitest 在加载任意配置文件前即失败；该环境阻塞须在正常终端补跑完整 Next 测试，不能把类型检查写成测试通过。`tmp/` 中的临时 Vitest 配置不得提交。
- 门禁：Python 375/375、全量生成与 `--check`、`npm run type-check:next`、Next Vitest 178 文件 1174/1174 均通过。全仓 Vitest 仍有旧版/UI 结构基线失败，与本轮 Next 链路分开；`tmp/` 保持未跟踪且不得提交。

### 2026-08-22：伊冯、莱万汀、梨诺、弭弗横向收敛

- 伊冯、莱万汀和弭弗已经退出全量技能阻塞列表。横向补齐的都是通用机制：Buff 启用/持续/停用生命周期、Aura 离场清理、动态 `StoreAttributeValue`、投射物目标身份、已知角色自身的 `CheckObjectTypeMatch` 静态分支、施法者治疗、动画自然结束/提前结束回调、`OnSkillEnd` 的自然完成与中断派发，以及技能替换时的冷却继承。动画结束回调使用同一 once scope，避免自然结束和提前结束重复执行。
- 梨诺 12 个技能现有 11 个严格可编译；唯一阻塞为终结技第 76 帧引用 `abilityentity_chr_0035_liino_ult_skill_projhit`。AKEDB `1.4.4@9433094-12` 提供引用动作与 41 帧子 SkillData，但版本化 AbilityEntity 证据明确记录 `manifestAssetMissing`；本机 8 月 17 日热更新资源的两份 manifest 缓存各含 191 个 `data_abilityentity_*` 资产，均没有任何 `chr_0035`、`liino` 或该 `projhit` 模板。不能用子技能长度猜模板寿命，也不能借其他干员模板。
- 当前全量审计已经重生成：320/320 个技能可解析、310/320 可编译、21/30 名干员全部技能严格直转。伊冯、莱万汀、弭弗均计入完整集合；梨诺仅剩上述数据缺口。其余 9 个干员共 10 个首阻塞，分别落在递归投射物、`FractureAction`、缺失实体标签/模板证据、方向角条件和 Context Buff 目标来源。
- 单敌人模型下的递归弹射已改为来源结构证明，不再依赖 Perlica 的干员专用许可：命中子技能必须先以 `HitBoxFinder(Anti/Normal/alive)` 查找候选，选择器必须明确用 `ExcludeTarget` 排除本次当前 `Target`，结果写入同层 Context，后续分支只能对该组递归发射同一投射物/命中技能。此时唯一敌人已被排除，递归发射严格归约为空序列；处理器名称、循环截断或项目配置本身都不能构成证明。投射物条件调度现保留命中 SkillData 自己的 `localTargetGroupWrites`，专用 `projectileDamage` 与通用 resolved sequence 共用同一判定。Perlica 连携由此正式编译，`ignoreRecursiveProjectileForSingleTarget` 已从 manifest 删除；全量基线提升为 320/320 可解析、311/320 可编译、22/30 名完整直转。Xaihi 连携也穿过递归弹射，当时下一首阻塞收窄为 Context `ball` 的 owner-spawned AbilityEntity 查询中心与实例身份证明。定向 Python 测试 15/15、Perlica 生成与 `--check`、`npm run type-check:next`、`git diff --check` 均通过；完整旧 Python 聚合测试仍有已知陈旧 fixture，不能宣称全绿。`tmp/` 仍为未跟踪目录，不得提交。
- 本轮顺带暴露正式 manifest 全量重生成的既有阻塞：`buff_chr_0027_tangtang_ultskill_abilityentity_1.json` 的 `OwnerSpawnedEntityFinder.spawnedObjectType` 是数字 `0`，而常规 SkillData 同字段使用字符串 `AbilityEntity`；严格 parser 在 Tangtang 处拒绝继续。失败前产生的无关干员机械刷新已撤回，没有混入本提交。后续若处理该阻塞，必须先从序列化类型或反编译枚举证明 `0` 的真实含义，再决定 combat-spec/解析层兼容，不能直接按常见字符串猜测。当前可验证边界是 Perlica 单干员生成和检查通过，全量 manifest `--check` 尚不能宣称通过。
- Xaihi 连携的 `ball` 查询已继续闭环。原始第 24 帧 `OwnerSpawnedEntityFinder` 实际带 `HasAny(-380421959)`，不是无标签查询；版本化模板中 Xaihi 的 `abilityentity_chr_0011_seraph_normal_skill_buff` 明确携带该 born tag。Finder 使用 `selectorOwner=ActionOwner`，只有空间中心是 `ContextTarget/mainchr`；按项目固定零空间模型，中心位置不改变 owner、对象类型、标签过滤或所得实例集合，因此技能级能力实体查询不再强制中心必须是 `ActionSource`。随后成功分支的旧式 `FinishBuffAction` 以无过滤 `CharacterTeamFinder` 选择全队并结束 `buff_chr_0011_seraph_atk_buff_normal_skill`；`combat-spec` 已闭环队伍 Finder 及结束 Buff 的“目标外层、Id 内层”顺序，Next 的 `finishBuffsById(target: party)` 也已有运行时支持，本轮只补生成归约，没有新增或猜测机制。Xaihi 达到 10/10，全量基线提升为 320/320 可解析、312/320 可编译、23/30 名完整直转。
- 后续继续遵守复刻库先行：优先选择证据完整的通用缺口；若处理 `FractureAction`，必须先在 `combat-spec` 复刻其破防层、事件、碎甲 Buff 与伤害顺序，再接 Endaxis。梨诺缺失模板保持失败关闭，直到取得对应客户端资产或证明原生查表失败分支的精确语义。
- 艾维文娜普通战技已完成严格直转。此前 `HasAny(-549424863)` 报“无模板”并非资产缺失：版本化 GameplayTag 目录证明它是 `Skill/Character/chr_0012_avywen/Lance` 父标签，而连携枪、终结技枪模板分别持有 `.../ComboLance` 与 `.../UltiLance` 子标签。生成器不再把 GameplayTag ID 当扁平枚举，按同版本路径执行子标签满足祖先标签的非 exact 查询；未知 ID 不猜路径，仍只能精确匹配。下一层两个分支投射物均为零飞行时间，hit/reach 子 SkillData 的战斗动作全部位于局部第 0 帧；统一分支投射物编译现按子技能原生 Sequence/动作顺序合并条件、直接 Buff 与资源动作，保留连携枪/终结技枪的条件伤害、黑板修改、脉冲检查 Buff、到达回能和时间膨胀。横向审计更新为 320/320 可解析、313/320 可编译、24/30 名完整直转；剩余阻塞为 Antal/Pogranichnik 的 `FractureAction`、Snowshine/Catcher 的方向角、Catcher 的 `shieldTar`、梨诺缺失模板和庄方宜纯表现镜像目标。
- Catcher 连携的 `shieldTar` 已严格贯通。成功分支以 `CharacterTeamFinder` 排除 Owner，再按 `CurHpRatioAsc` 限一个目标并与 Owner 合并；失败分支以 `MainCharacterValidator` 选择当前主控并与 Owner 合并。解析层现在为任意命名队伍查找保留已验证 selection role；生成层只沿同分支、同帧且位于合并动作之前的唯一来源写入证明 Context 身份，分别输出 `casterAndLowestHealthRatioOperatorExceptCaster` 与 `casterAndControlledOperator`。运行时集合解析读取当前帧控制时间线和标准环境的真实干员生命账本，最低比例平局按原生 CharacterTeamFinder 逆序保持首项，最终按稳定宿主去重；没有控制时间线、生命账本或队友时严格报错。编辑器与三语标签已同步。横向审计提升为 320/320 可解析、314/320 可编译、24/30 名完整直转；剩余 6 个技能阻塞为两项 `FractureAction`、两项 `CheckTargetAngle`、梨诺缺失实体模板和庄方宜纯表现镜像 Context。
- 庄方宜终结技的最后一个横向阻塞已移除，且没有为 `Context/ult_postmodel_mirror` 编造战斗目标。`buff_chr_0030_zhuangfy_potential5_vfx` 的完整 BuffData 证明它只有 `TogglableAction -> EffectAction + ShowHideActorAction` 表现链，其他战斗字段均为空；解析后的事件序列也没有模拟动作。通用 `is_strictly_presentation_only_buff` 现在同时接受严格纯表现事件和既有表现 stack effect，并继续以任意玩法字段、未知载荷或非表现事件失败关闭。庄方宜清单中的专用 `ignoreBuffIds` 已删除；审计输出阶段会只把当前技能实际引用且自动证明纯表现的 ID 合入临时编译视图。正式生成与 `--check` 均需保持通过。全量横向审计为 320/320 可解析、315/320 可编译、25/30 名完整直转；剩余五项只包含两项 `FractureAction`、Snowshine/Catcher 两项方向角和梨诺缺失模板。
- Snowshine 与 Catcher 的 `CheckTargetAngle` 已闭环。`combat-spec` 先按 1.4.4 IL2CPP 转储和当前 `GameAssembly.dll` 机器码复刻：解析 target/origin，取 XZ 平面“目标到 origin”方向，与目标前向或后向做 `abs(SignedAngle)`，再比较 `configuredAngle / 2 + 1e-5`；缺失目标为 false。Endaxis parser 严格保留完整载荷，没有把零距离解释成统一朝向。当前四个实例的分支只写 `is_cam = 0/1`，全目录消费者仅为镜头动作，因此生成器只在分支副作用完整命中该审计形状时省略纯表现树。并列的主控守卫可以随整个无战斗副作用分支一起省略；任何新键、动态值或战斗叶仍失败关闭。全量审计现为 320/320 可解析、317/320 可编译、27/30 名完整直转；仅剩 Antal/Pogranichnik 的 `FractureAction` 与梨诺缺失能力实体模板。证据见 `docs/research/native-target-angle-condition.md`，复刻库提交为 `9de5518 feat: reproduce target angle condition`。
- 物理异常链已按“复刻库先行”完成。`combat-spec` 的 `051404e` 与 `69713ed` 先证明公共 `buff_physical_no_guard` / `buff_physical_fracture` 定义、破防层创建/消费、物理点燃前后事件和碎甲伤害顺序；Endaxis 随后引入固定 `applyPhysicalInfliction` DSL，并把两份公共 Buff 完整内联到使用技能。运行时在目标无破防层时创建破防层，已有层时触发物理点燃响应；原生 `DamageDecorateMask.Fracture` 位 `1073741824` 会开启物理异常伤害倍率。根时间轴和条件分支共用同一编译链，未知物理异常载荷继续失败关闭。Antal 已达到 9/9。
- Pogranichnik 的累计目标数没有按“所有范围都命中”粗暴计为两次。对 1.4.4 `MergeTargetAction.ExecuteInternal` 的机器码检查证明：追加目标前先查重，已有等价目标不会再次插入；该行为已在 `combat-spec` 提交 `ee941ae` 以普通目标顺序、去重和输出替换测试固定。生成器的唯一敌人证明现可递归穿过 Merge 输入和此前支配写入，所以两次 HitBox 结果合入 `total_tar` 后仍为一个敌人，`CheckEntityNum(total_tar >= 2)` 严格走失败分支。Pogranichnik 已达到 10/10。
- 当前全量审计已重生成到 320/320 可解析、319/320 可编译、29/30 名完整直转。唯一失败仍是梨诺终结技缺失 `abilityentity_chr_0035_liino_ult_skill_projhit` 模板；当前 AKEDB 与 VFS 证据边界没有变化，不用 41 帧子 SkillData 猜寿命或组件。下一阶段先补 `applyPhysicalInfliction` 在正式思维导图编辑器中的只读严格形状/两棵内联 Buff 子树展示与操作，再继续寻找真实模板资产。`tmp/` 始终不得提交。
- 物理异常编辑器接入已完成：`applyPhysicalInfliction` 在正式技能导图中保留一个系统步骤节点，并以两个端口子树完整展开 `noGuardDefinition` / `fractureDefinition`，树内生命周期、响应和步骤沿真实嵌套路径参与现有选择与编辑。右侧为纯本层 inspector；类型、目标和公共 Buff ID 按证据锁定，只允许修改原生 `isExtra`。该步骤没有加入普通类型选择器，因此不会把生成器的严格协议误扩张为可随意创建的玩法。下一项应盘点并推进 29 名审计完整干员的正式生成、默认仓库注册与生产场景回归，而不是继续以审计数字代替可用产物。
- 正式产物推进已开始：莱万汀和弭弗新增稳定导出模块并注册默认 Next 数据仓库，默认可用干员从 16 名增至 18 名。测试口径不把原生换槽形态伪装成可直接拖放技能：莱万汀为 14 个稳定入口加 1 个替换形态，弭弗为 9 个稳定入口加 2 个替换形态；全部技能等级仍通过同一编译门禁。新增莱万汀默认仓库生产场景，普通攻击可产生 `SkillStarted` 与 `DamageApplied` 回执；弭弗已有护盾、终结技换二段和二段换三段生产回归继续保留。下一项优先审计并尝试把伊冯从 `outputStage: audit` 提升为正式定义。
- 伊冯的正式提升尝试已失败关闭并恢复原 `outputStage: audit`，没有保留半生成产物。首个真实正式层阻塞位于连携能力实体宿主的 `buff_chr_0017_yvonne_combo_skill`：`OnBuffTrigger` 先用 `HitBoxFinder(Anti/Normal/alive)` 把敌人写入 `tar`，再 `ForEach(Context/tar)` 执行标签/能量碎片条件伤害、资源获得和动态黑板动作。现有 `inline_buff_compiler` 将任何含 ForEach 的触发事件都先解释为“查找能力实体并启动隐藏子技能”的既有专用形状，因而在检查循环体前错误落到 `invoked AbilityEntity child target cannot be the host AbilityEntity`。下一阶段应将普通目标 ForEach 触发事件纳入统一条件 IR，并严格限制在已证明的唯一敌人 Finder 与完整有序动作闭包；不得用专用分支或忽略项让伊冯通过。
- 伊冯已在后续通用链路补齐后正式提升为 `outputStage: complete` 并注册默认仓库，正式可选干员增至 19 名。16 个可放置技能、两个附着被动及全部潜能均进入 `yvonne.operator.generated.ts`；潜能 3 的两个原生 `SkillBBModifier` 明确指向隐藏被动 `chr_0017_yvonne_talent_0`，因此使用既有 `patchPassiveBlackboard`，没有伪装成主动技能补丁。
- 此次新增的 Buff 语义以 `combat-spec` 证据为边界：`OnBeforeOutputBuff` 在尝试添加前派发，`OnOutputBuff` 只在添加成功后由来源 AbilitySystem 派发，目标侧 `OnAddedBuff` 保持独立；目标相等条件按原生两组 TargetSettings 的笛卡尔积逐对比较。Endaxis 同步接入来源事件、Buff 宿主/来源身份、跨事件目标组保留和 `CheckTargetsEqual(Source, Owner)` 严格归约。伊冯冻结响应由真实 `outputBuff` 驱动，短时 valid 子 Buff 作为被动 Buff 的递归依赖保留。
- 伊冯天赋 1 的三条伤害修正保留多个 `CheckTagMatch` 的合取结构；不会把晶体附着与冻结/异常标签的 `HasAny`、`ExceptAny`、`HasAll` 分支摊平成单一标签查询。被动定义筛选现从已启用根 Buff 沿事件创建关系求传递闭包，循环依赖可终止且无关被动定义不会混入产物。阶段从 audit 升为 complete 时会删除旧 `*.skills.audit.generated.ts`，避免同一干员残留两套技能源码。
- 本轮门禁：伊冯生成和 `--check` 通过，`vue-tsc --noEmit` 通过，相关 Python 50/50、完整 Next Vitest 198 文件 1301/1301 通过。完整 Python 聚合仍有 15 个此前存在的陈旧夹具/断言失败，主要集中在投射物新增必填字段、旧目标证明报错文案和旧 StoreAttribute 夹具，不能宣称全量 Python 绿。`tmp/` 仍未跟踪且不得提交。下一项应为伊冯补默认仓库生产场景回归，验证冻结输出 Buff → valid 标记与天赋伤害修正的实际回执；梨诺缺失实体模板继续失败关闭。
- 伊冯默认仓库生产回归已补：满天赋、潜能 3 的构筑只放置一段普攻，标准场景能够正常产生 `SkillStarted` 与 `DamageApplied`。该回归同时修复场景增量编译边界：只对本次已编译技能组应用对应养成补丁，未放置技能组的补丁跳过；完整干员定义编译仍使用严格模式检查错误组键，因此不会掩盖悬空配置。下一步的伊冯专项回归应直接构造可证明的冻结 Buff 输出链，检查 talent1 valid Buff 与 damage modifier，而不是制造敌方行为。
- Ember 已由 `audit` 提升为正式生成干员并加入默认仓库：9 个技能、2 项天赋和 5 项潜能均由版本化来源完整转换，`conversionSupport` 为 `complete`。天赋 1 与潜能 1/3/5 是技能黑板补丁，天赋 2 是附着被动，潜能 2 是力量/意志静态属性，潜能 4 是终结技费用乘以 0.85；养成审计更新为天赋 21/38、潜能 85/95，全部已转换槽位均可进入标准模拟。
- Ember 终结技护盾 Buff 的 `OnBuffStart` 中 plain `Target` 已依据 Buff 原生执行上下文归约为当前 Buff 宿主；Ability 事件里的 plain `Target` 仍是事件目标，两者有专门测试隔离，不能泛化合并。
- 外部 `operatorHit` 标记现在除语义监听器外，还向目标干员的 Buff Ability 事件中心依次派发 `beforeTakeDamage` 与 `takeDamage` 事实。它只携带 `sourceId=enemy`、目标、可选伤害类型、标签和 damage features，不执行敌方技能、伤害计算或生命扣减。Ember 与萤石分别消费原生后置/前置边界，没有互相偷换。
- `inheritSourceSkillCastInfo` 已修正为可选继承：上下文存在施法信息时完整复制，不存在时保持为空。外部受击事实没有敌方技能实例，因此不得伪造技能 ID 或施法序号；这一行为已由 Buff 执行器测试和 Ember 默认仓库生产回归锁定。
- 庄方宜正式化试跑没有越过证据边界：15 个技能、潜能及终结技换槽可以进入统一链，但两项 `AddBuff` 天赋的 SkillData 实际没有 startup Buff，效果位于被动技能自身的时间轴条件程序；现有 `attachedPassive` 只覆盖启动 Buff 型被动。因此清单已恢复 `outputStage: audit`，没有生成或注册伪完整定义。下一真实能力是通用“被动技能时间轴程序”编译，而不是给庄方宜写特例。
- 试跑补齐了两个有独立复刻证据的通用事实：`PulseAbnormalDamageIncrease` 映射为电磁异常增伤动态属性，可由 `StoreAttributeValue(FinalNonConverted)` 写入 Buff 黑板；`ChangeSkillAction(specificRevertedSkillId=false)` 按原生快照替换前槽位，在同技能类型只有唯一基础候选时可严格派生 `revertMode: buffActionEnd`。候选不唯一仍拒绝。庄方宜审计现能明确列出战技与连携强化形态的两条槽位关系。

### 2026-08-22：庄方宜正式生成与能力实体控制流闭环

- 庄方宜两项无 startup Buff 的天赋已通过通用被动 SkillData 常驻程序进入正式定义；本轮继续补齐 `ownerHpZero` 能力事件、Context 目标稳定取项、能力实体黑板继承、Buff 来源事件语义和嵌套伤害标签传递。`SmartTargetFinder -> CheckEntityNum -> PickTargetAction` 的归约依赖完整 Finder/Validator/PostProcessor 结构与固定单敌人、零距离模型，不使用干员或 Context 名称特判。
- 强化战技能生成的能力实体不再把局部动作投影到父技能时间轴。子技能内两次黑板计算保留在实体局部时钟；位于外层 `IfElse.failActions` 的 `JumpToAction` 以分支极性证据编译为 `not(外层条件)` 后的一次性局部跳转。子图中的两个 `SwitchAction` 已证明后代只有表现动作，记录动作下标后从战斗缺口中剔除；任何含战斗后代的 Switch 仍失败关闭。
- `buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar` 的有限寿命宿主到期会在清理宿主 Buff 前发布 `ownerHpZero`，使真实事件链能够生成剑目标触发 Buff。`combat-spec` 已先以提交 `12ffc54` 固定“HP 归零后、实体死亡前”派发顺序；Endaxis 将有限寿命/显式结束映射到该宿主生命周期边界，但没有把所有任意 Finish 泛化为 HP 归零。
- 同一终结技 Buff 同时替换普通战技与连携技时，运行时换槽投影改为按目标技能幂等合并，不再由后一条覆盖前一条。`buff_chr_0030_zhuangfy_ult_base` 现同时包含 `battleSkill -> enhancedBattleSkill` 和 `comboSkill -> enhancedComboSkill`，分别保留冷却不继承/继承的原生差异。
- 庄方宜 manifest 已提升为 `outputStage: complete`，15 个来源技能全部生成；稳定入口已从旧手写定义切到 `zhuang-fangyi.operator.generated.ts`，旧 audit-only 技能文件删除。`conversionSupport` 为 `complete`，2 项天赋、5 项潜能与 12 个等级的全技能编译矩阵均通过；生成产物与 `--check`、`npm run type-check:next`、相关 Next Vitest 9 文件 204/204 通过。完整 Python 聚合仍有既有陈旧夹具，不能宣称全绿；`tmp/` 继续不得提交。
- 下一步先为庄方宜补默认仓库生产场景回归，至少覆盖终结技换槽和普通/强化战技能力实体伤害链；随后继续正式化其他 29 名横向审计完整干员。梨诺缺失能力实体模板继续失败关闭，不猜寿命和组件。

### 2026-08-22：庄方宜默认仓库生产链路贯通

- 默认仓库生产回归现以真实时间轴放置终结技和普通战技块；终结技在第 78 帧把战技槽切换为强化战技，原时间轴块仍按组键解析到当前槽位形态，不需要改写用户放置内容。强化战技生成剑与攻击能力实体，攻击实体子技能完成电磁附着、伤害和失衡输出。
- 庄方宜角色自带的 `chr_0030_zhuangfy_check_sword_passive` 已作为角色级基础被动接入。它与天赋/潜能启用的被动分开存储和编译：SkillData 自带 `swordRange=50` 默认黑板，开战时安装 `buff_chr_0030_zhuangfy_passive_check_sword`，周期查询 owner 生成且 born tag 匹配的剑实体、统计多实例集合并写入共享 `EntityBB_SwordNum`。没有用默认 0 掩盖缺失生产者。
- `basePassiveSkillIds` 只声明隐藏 Passive SkillData 身份；基础被动不要求出现在 `CharGrowthTable.skillGroupMap` 的可操作技能组中，但仍严格校验文件存在、ID 一致及 `castType=Passive`。生成产物新增角色级 `passiveSkills`，场景装配在所有构筑养成被动之外始终启用一次。
- Buff 单独引用能力实体时，编译器现在保留对应能力实体闭包并交给运行时装配；Buff 引用的实体子技能不会因没有根技能引用而丢失。仅用于表现镜像、且已被生成器明确标记忽略的能力实体时间膨胀 Context 可缺省为空集合，真实 effect target 仍严格要求 Context 存在。
- 原生属性 `AtbCostAddition` 已先在 `combat-spec` 提交 `2099d86` 复刻：`Skill._GetAtbCost = max(0, baseCost + owner.AtbCostAddition)`，检查与扣费读取同一最终值。Endaxis 接入运行时属性重求值；庄方宜一次性免费 Buff 使强化战技最终费用为 0。原生 `_ApplyCost` 对不大于 epsilon 的最终 ATB 费用不调用 `CostAtb`，因此 Next 不发 `SpChanged(0)`、不启动技力恢复暂停，但仍记录技能费用阶段成功。
- 换槽目标技能没有被放置时，源/目标两侧都不存在冷却账本属于合法状态；运行时只改变槽位，不伪造冷却。仅一侧账本缺失仍失败关闭，避免错误继承。
- 当前门禁：庄方宜单干员生成与 `--check`、`npm run type-check:next`、完整 Next Vitest 198 文件 1320/1320，以及基础被动渲染定向 Python 测试通过。完整 Python 聚合仍有既有 15 个错误和 3 个失败的陈旧夹具/断言，不能宣称全绿；`tmp/` 仍未跟踪且不得提交。
- 下一步继续从已经横向审计完整但尚未成为正式默认仓库产物的干员中选择资产闭合样本，增加“生成定义 → 默认仓库 → 真实时间轴 → 标准模拟回执”的生产回归。梨诺缺失模板保持失败关闭；同时可补庄方宜强化连携与免费 Buff 仅消费一次的第二条生产回归。

### 2026-08-22：Arcane（李芷烟）正式生成与构筑条件闭环

- Arcane 的 11 个技能已从横向审计产物提升为 `arcane.operator.generated.ts` 正式定义，原手写 `arcane.ts` 改为稳定转出生成定义，旧 `arcane.skills.audit.generated.ts` 删除。技能组、终结技/奥义换槽、四个连携能力实体、实体局部跳转、Buff 生命周期和提前结束分支均由同一生成管线提供；`conversionSupport` 为 `complete`。
- 智识/意志形态不再由角色特判。角色级 `entityBlackboardInitializers` 按最终构筑四维计算 `intellect >= will`，写入 `EntityBB_wisd_greater_will`，根技能、Buff 和能力实体通过动作黑板继承使用同一值。养成项的 `activeCondition + SkillBBModifier` 与条件冷却也使用统一 `BuildCondition`；完整场景从最终面板求值，缺少构筑属性的轻量编译路径遇到条件养成时严格报错。
- 天赋 1 的 `paramType=2` 与 `paramType=4` 已先在 `combat-spec` 核对。1.4.4 枚举和 IL2CPP 入口证明二者分别是实际 `CoolDown` 与展示用 `CoolDownDisplay`；复刻库提交 `fee864b` 固定该边界。Endaxis 要求两条同目标、同值、同条件后只应用一次实际冷却，避免重复减 6 秒。
- 腐蚀强化通过 `OnCollectOutputBuffBbValue` 的完整动作结构和 GameplayTag `Skill/Character/Common/SpellStatus/Corrupt`（`-421286163`）投影为通用 `addReactionDuration/addReactionEffectiveness`，潜能对同一隐藏被动黑板的追加也复用该投影。潜能 5 同时修改奥义主动技能与天赋被动，生成器新增严格的混合技能/被动黑板补丁，而不是丢弃其中一侧。
- `OnBuffEndsEarly` 现在依据结束原因区分主动/提前结束与自然耗尽；提前结束监听不会在正常到期时误触发。纯表现 Buff 仍必须由完整结构证明后才省略，木桩模型无可观察结果的玩家防守侧行为只按显式配置处理。
- 本轮门禁：Arcane 从 AKEDB 单干员重生成通过；生成器完整 Python 测试 417/417、`npm run type-check:next`、Next Vitest 198 文件 1324/1324、`git diff --check` 通过。此前记录的 15 个 Python 陈旧夹具错误与 3 个旧断言已经按新增可选字段和严格语义更新后清零。`tmp/` 仍未跟踪且不得提交。
- 下一步优先补 Arcane 默认仓库生产场景，覆盖两种四维关系下的条件冷却/形态黑板、终结技 Buff 换槽与提前结束还原、连携能力实体伤害及腐蚀持续时间/效能；随后继续选择已横向完整的干员正式化。梨诺缺失模板仍保持失败关闭。
- Arcane 默认仓库第一条生产回归已补：90 级智识构筑启用天赋 1 后，完整资源规则编译得到连携冷却 360 帧（基础 540、实际冷却修正 -180），实体初始黑板为智识形态；真实时间轴释放战技后生成 `abilityentity_chr_0032_lizhiyan_normal_skill` 并产生伤害回执。此次修复了完整运行时装配在“为资源上限重新编译全部技能”时漏传最终构筑属性的问题，条件养成现在与已放置技能使用同一面板。标准兼容预检也正式接纳已有运行时/面板读取端口的 `storeSourceAttributeValue`。
- 连携技能曾因同时激活多份优先级 0 的 `beforeTakeDamage` 事件动作而严格失败；该边界现已由 1.4.4 `DoubleBufferedPriorityQueue<SequenceAction>` 机器码闭环：同级保持注册顺序。Next 已接通连携后战技触发的提前引爆伤害生产回归。
- 奥义生产试跑也把形式生成与完整运行装配之间的下一层缺口定位清楚：玩家公共大招免伤在木桩输出模型中可按既有 `simulationNoEffectBuffIds` 证据省略，但奥义能力实体随后给敌人施加的 `ultimate_skill_inaura` 仍是 ID-only 引用，生成产物没有把能力实体条件分支及 Buff 调用隐藏子技能中的传递 Buff 闭包全部内联。继续严格展开后还会遇到已有 `combat-spec` 语义的 `StoreAttributeValue(MaxUltimateSp)`，以及 Buff 事件内生成能力实体。该链本轮没有以忽略项绕过；下一步应先补“Buff → 隐藏能力实体技能 → 条件/Aura Buff”的传递依赖收集，再接最大终结技能量属性读取和事件内实体生成。
- 能力实体模板证据提取器此前只扫描 `SkillData`，因此漏掉仅由 `BuffData` 事件生成的实体。默认引用闭包现扩为 `chr_*.json + buff_chr_*.json`，同一 1.4.4 manifest 的可解析模板由 54 增至 59；Arcane 奥义所需 `ultimate_skill_death`、`ultimate_skill_laser`、`ultimate_skill_laser_target`、`ultimate_skill_place` 均取得真实 MonoBehaviour 生命周期与 born tag。梨诺缺失模板仍是唯一 unresolved reference。
- `StoreAttributeValue(MaxUltimateSp, BaseNonConverted)` 已严格映射为 `maxUltimateEnergy`，运行时从本场 `CombatResources` 的干员账本读取构筑结算后的上限，不再误读静态面板。Arcane 真实数据已重新生成并通过专项规则/运行时测试。下一步重新开启传递 Buff 闭包时，应继续处理 Buff 本地时间线中携带子技能的 `SpawnAbilityEntity`；现已确认这类激光实体有真实模板，不能再当作模板缺失或纯表现动作跳过。

### 2026-08-22：治疗成功事件与 Camille 天赋 2

- 原生治疗事件链已先在 `combat-spec` 闭环（提交 `72ecd67`、`f72051d`）：成功治疗先向治疗者派发 `OnOutputHeal`，再向受治疗者派发 `OnReceiveHeal`；即使目标满血、实际回复量为 0 也照常派发。`CheckHealTag` 查询当前 `HealContext.healTags`；`CheckOverHeal` 比较 `finalHealValue > realHealValue + 1e-5`，并可把溢出量、请求量、实际量写入动作黑板。
- Next 使用统一 `abilityHeal` 事件载荷保存 source/target、请求/实际/溢出治疗量和 GameplayTag ID；Buff 可直接监听 output/receive heal，语义事件 `operatorHealed` 只路由给受治疗者。治疗执行顺序、满血治疗、标签条件、溢出条件和黑板写入均有运行时回归，不依赖敌人主动行为或人为扣血。
- Camille 天赋 2 已从 `unmodeledTalent` 提升为正式 `attachedPassive`：监听受治疗事件，严格匹配原始治疗标签，计算队友档位后分别给自身和其余队友施加不同倍率 Buff；发生溢出治疗时按原始嵌套分支再次施加。`CharacterTeamFinder + ExcludeOwnerValidator` 只在结构完全匹配时投影为 `partyExceptCaster`，普通或异构 `ForEach` 仍失败关闭。
- Camille 潜能 5 的真实载荷是对同一事件被动 `chr_0033_camille_passive_talent1` 执行 `atk_up += 0.06`。生成器现统一认可启动 Buff 型和纯事件监听型两种“可生成被动程序”，因此严格输出 `patchPassiveBlackboard`，不再把隐藏被动误判成可释放技能组。`conversionSupport` 现只剩战技/奥义 `skillBehavior`。
- 本阶段门禁：生成器完整 421/421、Camille 严格重生成、养成/生成定义定向 Vitest 59/59、`type-check:next` 通过；上一阶段完整 Next 仍为 198 文件 1335/1335。仓库级 `--check` 仍首先报告此前已过期的 `perlica.generated.ts`，本轮没有刷新无关干员产物；`tmp/` 保持未跟踪且不得提交。
- 下一步清理 Camille 战技的死亡监听/弱点 Buff 与奥义变身 Buff。`WeakAction`、`VulnerableAction` 或其它尚未进入复刻库的行为必须先完成原生取证；不能为了去掉 `skillBehavior` 缺口把这些 Buff 标成无效果。

### 2026-08-22：Camille 目标死亡链与 KeywordAction 边界

- 战技能力实体给唯一敌人安装的 `normal_skill_listen_target_dead` 只在该目标生命归零后向来源实体施加 `reset_target`；后者排除已死目标并从其余战斗敌人中选取新目标。Endaxis 的固定唯一敌人模型不存在第二实例，因此这条重选链已进入显式 `simulationNoEffectBuffIds`，不再占用战技的未建模行为；该判断不泛化为忽略任意 `OnOwnerHpZero` 响应。
- `buff_chr_0033_camille_ult_effect` 只有模型显隐、特效和声音，且全仓引用只来自本次奥义施加，现作为显式表现 Buff 忽略。奥义 `ult_henshin_state` 仍保留缺口：其有效载荷包括把 NormalSkill 槽换成路由技能，不能因为伤害侧无修正就标成模拟无效果；后续应由技能形态/轨道可用性校验承接。
- `WeakAction` 的公共 child Buff 只是 `AbilitySystem` 动态关键词实例载体，静态定义为空不能证明无效果。1.4.4 离线模块中的 `KeywordAction.ExecuteInternal` 与带子类型版本是 IFix 跳板；当前只能确认字段、目标、持续时间和倍率，不能确认 Weak 的计算区、符号及叠层。`combat-spec/docs/keyword-actions.md` 记录了 IFix `0xB601/0xB608` 及运行时探针边界；取得启动器认证进程证据前，Camille 战技继续只保留这一项明确缺口。

### 2026-08-22：Arcane 奥义 Buff 局部激光实体链

- `BuffDefinitionSource` 现在保存 Buff 时间线直接生成的能力实体子图，递归定义闭包同时遍历直接生成与事件调用的隐藏子技能，不再只收集其顶层 `CreateBuffAction`。能力实体条件编译也会收到完整 Buff 定义目录，因此 Aura/事件内的传递 Buff 可继续严格内联。
- Arcane 的 `ultimate_skill_inaura_laser1` 在 Buff 局部第 0/4/8/12 帧各生成一次 `ultimate_skill_laser`。原生 plain `Owner` 是承载该 Buff 的 `laser_target` 能力实体，不是干员；DSL 因此新增只在现有目标上下文中合法的 `spawnAbilityEntity.target='currentAbilityEntity'`，运行时保留该实例引用，缺少 current target 时严格报错。子 SkillData 的第 12 帧敌方 HitBox 在项目零距离、全范围、唯一敌人模型下进入实体局部伤害时间线。
- 严格 Arcane 生成已越过此前 `scheduledSequences.auxiliaryActions: unsupported SpawnAbilityEntity`，当前新首阻塞位于后续 `enhanceChanged` 事件中的空 Buff 查询（`compile_buff_stack_read: unsupported or empty Buff lookup`）。失败生成产生的半成品已撤回；不能把这一新查询猜成宿主或任意固定 Buff。
- 当前门禁：生成器 340/340、完整 Next Vitest 198 文件 1329/1329、`type-check:next` 通过。`tmp/` 保持未跟踪且不得提交。下一步应从对应 BuffData 的目标与查询载荷定位 `enhanceChanged` 空查询的真实身份，再完成 Arcane 奥义生成和生产时间轴激光回执。
- 上述“空查询”已查明不是 ID/Tag 缺失：`buff_chr_0032_lizhiyan_ultimate_skill_layer` 的 `OnBuffEnhanceChanged` 使用 `SaveBuffStackNumAdvanced(Environment + BuffCount)`，原生语义是把正在执行的当前 Buff `enhanceCnt` 写入动作黑板 `count`。`combat-spec` 已先以提交 `f23ec70` 开放适配器和运行时复刻；Endaxis 的 `readBuffStackCount` 新增 `environment` 查询，Buff 生命周期上下文直接提供当前实例层数，缺少 Buff 上下文时失败关闭。
- Arcane 严格生成继续前移到 `ultimate_skill_inaura` 的距离条件：敌方 Buff Owner 与 `OwnerSpawnedEntityFinder(AbilityEntity, HasAny 464088014)` 的距离小于等于 60；标签证据唯一指向奥义主实体模板。项目距离统一为 0，但生成器的 `TargetReferenceSource` 尚未保存该内联 Finder 的对象类型/标签查询，也没有把当前能力实体 ID 传到条件证明层，因此现阶段不能仅凭 `OwnerSpawnedEntityFinder` 名称判恒真。下一步应先保留该身份并证明查询命中当前奥义实体，再按统一零距离规则折叠。
- 本阶段追加门禁：`combat-spec` 定向 13/13；Endaxis 生成器 340/340、完整 Next Vitest 198 文件 1330/1330、`type-check:next` 通过。失败 Arcane 生成的半成品已撤回，`tmp/` 未提交。

### 2026-08-22：全量生成产物恢复一致

- 全仓生成已重新执行并通过 `--check`，不再保留“生成器已前进、正式产物仍陈旧”的双重基线。20 名 `complete` 干员输出正式定义；梨诺恢复为 `audit`，12 个技能事实全部保留、其中 11 个输出审计 DSL。其终结技仍因 1.4.4 VFS manifest 缺少 `abilityentity_chr_0035_liino_ult_skill_projhit` 模板而失败关闭，不能用子技能时长猜造实体寿命或组件行为。
- owner-spawned 选择器现在保留原生数值零掩码：`spawnedObjectType=0` 是合法的未命名默认枚举值，按 `combat-spec` 证据不命中任何非零对象类型；普通 HitBox 等非 owner-spawned Finder 的 `TagValidator` 查询也不再被提前返回误删。莱万汀的实体标签数量条件与唐糖的零掩码被动因此按原始身份生成。
- 唐糖被动启动的 `buff_chr_0027_tangtang_water_passiveui` 只统计水实体并通知角色被动 UI，现通过严格校验的 `presentationOnlyPassiveBuffIds` 从模拟定义移除；真实水实体被动仍保留。技能与养成 Buff 现在共用“递归纯表现子 Buff 可省略”的边界，Estella Aura 应用目标统一从已证明的 Context 目标传入，不再因 Buff 环境把敌方目标误解析成宿主。
- 萤石第二天赋的标签、伤害类型和概率三重守卫已经按顺序短路语义完整生成；潜能 2 的概率补丁与生产模拟也已闭环。此前整段省略的限制已经解除。
- 弭弗护盾的 `StoreAttributeValue(MaxHp, FinalNonConverted)` 现由标准环境读取同一干员生命账本的 `maxHealth`，不再把静态实体黑板当作通用属性来源。养成缺口门禁改为单向约束：完全没有可执行行为的天赋/潜能必须声明缺口，而安全的部分行为允许与明确缺口共存。
- 当前门禁：生成器 427/427、全量生成 `--check`、Next 198 文件 1336/1336、`type-check:next`、`git diff --check` 全部通过。`tmp/` 仍只作为未跟踪证据/临时目录，不得提交。

下一阶段建议先处理 Camille 奥义 `ult_henshin_state` 的严格技能槽路由和轨道可用性，再补 Arcane/伊冯/庄方宜等正式定义的专项生产模拟。`WeakAction` 继续等待 IFix 方法体证据，梨诺继续等待真实能力实体模板；两者均不为追求统计完整度绕过。

### 2026-08-22：波格兰尼奇正式生成与技力累计天赋闭环

- 波格兰尼奇从横向审计进入正式 `complete` 产物并注册默认 Next 仓库：10 个可放置技能、2 项天赋和 5 项潜能均由版本化来源生成，默认正式干员由 20 名增至 21 名。物理异常战技复用已有 `applyPhysicalInfliction`，没有为角色另写近似路径。
- 天赋 1 的 `OnObtainAtb` 严格保留 Skill/Gain 过滤和 `SaveAtbObtainValue` 实际获得量。运行时新增 `storeEventSpGainAmount`，把 `spGained.amount` 写入动作黑板，再按原生 `atb_gain=80` 累计、扣除同一阈值、施加天赋 Buff 的顺序执行；退出战斗清零在固定木桩流程没有自然入口，保持不可触发而不伪造事件。天赋 2 使用统一的多等级附着 Buff 生成，持续时间按等级保留为 5/10 秒。
- `OnBeforeTakePhysicalInfliction`、`CheckTargetsEqual` 与 `SourceFinder` 身份条件按 `combat-spec` 证据进入事件模型。能力实体来源可沿一次原生 `AbilitySystem.source` 解析回创建它的干员；标准模型不会生成敌人主动攻击，所以该承伤前响应只有在真实事件输入存在时才执行，不能据此宣称模拟了敌方行为。
- 同一原生 AbilityEntity 模板 ID 可以在不同生成点携带不同子技能蓝图。链接器现在提升首个公共定义，同时把冲突的生成点局部子程序内联保留；波格兰尼奇产物同时锁定终结技中的常规士兵子技能与干员级 `finish4` 变体。此次也修正了旧链接器移除定义后遗留的深层空白，其他正式产物只发生确定性的格式收敛与新增事实刷新。
- `Atk` 和 `PhysicalAndSpellInflictionEnhance` 已进入生成器“有运行时消费者”的属性白名单。后者以面板术法强度初始化、允许 Buff 动态叠加，并实际参与法术爆发增强公式；没有把它泛化成尚未复刻的全部异常公式。
- 当前门禁：生成器 430/430、全量生成与 `--check`、Next 200 文件 1347/1347、`type-check:next` 通过。全量审计仍为 320/320 可解析、319/320 可编译、29/30 名完整直转；梨诺唯一模板资产缺口没有变化。`tmp/` 仍只作未跟踪临时目录，不得提交。

下一阶段优先补波格兰尼奇默认仓库生产场景，覆盖战技物理异常、终结技士兵实体和 Skill/Gain 技力累计天赋的真实回执；随后继续 Camille 奥义槽位路由或下一名资产闭合干员的正式化。敌人主动攻击相关响应只保留可验证入口，不用外部标记冒充正常模拟链。

- 波格兰尼奇默认仓库生产场景已随后贯通：终结技先生成 4 个常规士兵，连携获得的实际 Skill/Gain 技力触发天赋增攻，后续普攻伤害高于未启用天赋的同构场景；终结技 Buff 再生成 4 个 `finish4` 子技能实体。战技的 `applyPhysicalInfliction` 也进入标准兼容预检，且两棵内联 Buff 定义会递归接受同一门禁扫描。
- 此回归发现并修复了常驻被动生命周期：装配层此前对 enableSequence 调用 `executeInstant`，导致 `listenForCombatEvents` 在同一调用末尾立即注销。现在常驻序列保持 started 状态并由装配持有，初始化程序仍是瞬时语义；装配级测试确认后续 Skill/Gain 能唤醒监听。最终门禁为 Next 200 文件 1349/1349、`type-check:next` 与 `git diff --check` 通过。

### 2026-08-22：Camille 变身战技生产闭环

- `buff_chr_0033_camille_ult_henshin_state` 已由正式生成定义承载战技槽替换：奥义第 118 局部帧施加变身，`battleSkill` 槽映射到复用连携二段程序的 `battleSkillDuringUltimate`；用户时间轴仍只保存稳定组键，不保存当时形态的技能键。
- 默认仓库生产场景现已贯通“奥义 → 换槽 → 现实帧上的战技块解析当前形态 → 支付 40 SP → 产生连携二段伤害 → 技能第 0 帧结束变身 → 槽恢复”。回执同时锁定两次 `SkillSlotChanged` 和实际 `SkillStarted` 身份，避免生成定义正确但运行时路由退化。
- Camille 的奥义行为缺口因此关闭；`conversionSupport` 只剩基础战技内 `WeakAction`。该关键词行为仍等待 IFix 方法体或等价运行时证据，不会用空 child Buff 或“木桩无主动行为”将其标成无效果。梨诺缺失能力实体模板的边界也没有变化。
- 定向生产测试为 7/7；下一项从横向审计已达 29/30、但尚无正式 manifest 的资产闭合干员中继续正式化，优先选择能覆盖公共机制而非仅有普攻冒烟的样本。

### 2026-08-22：弭弗三段战技命中投影修复

- 弭弗二、三段战技的生成定义和运行时伤害一直存在；缺口位于时间轴读模型：轨道块只从基础 `battleSkill1` 收集 hit 标记，而同槽位的 `replacementSkills` 虽参与模拟编译，却没有进入 UI 候选，因此二、三段 `DamageApplied` 的稳定 `hitId` 无法匹配可画标记。
- 时间轴现在同时收集基础定义、普通替换形态与路由替换形态的命中。基础形态保留无模拟时的定义预览；替换形态统一作为回执门控的条件候选，只有本次释放实际产生对应 `DamageApplied` 后才显示，不会在运行前把多套形态堆叠到同一块上。
- 真实弭弗定义锁定每个战技块的候选数量为一段 1、二段 3、三段 1；三次连续战技的生产模拟依次执行 `battleSkill1 → battleSkill2 → battleSkill3`，伤害回执同样为 1/3/1 且全部携带 `castId + hitId`。命中详情面板可继续复用现有按稳定身份归因逻辑。

### 2026-08-22：治疗属性与梨诺潜能 2 闭环

- 1.4.4 `BattleFormula.CalculateHeal(HealPackData)`（RVA `0x06D405FC`）已证明普通治疗在双方 `AfterCalculation` Modifier 之后，乘创建 HealPack 时快照的 `1 + healer.HealOutputIncrease + receiver.HealTakenIncrease`。`combat-spec` 提交 `500ff1a` 先完成该公式；Endaxis 随后新增独立的治疗输出/受治疗运行时属性和最终治疗倍率，不把它们近似为面板数值或伤害修正。
- `BattleConst` 证据对应的意志派生系数为治疗输出 `0`、受治疗 `0.001`。构筑层新增 `addStaticHealingIncrease(output|taken)`，并通过 resolved panel 的战斗修正进入每名干员的战斗属性集；Buff 治疗修正仍先按 healer/receiver 两侧执行，随后应用双方属性倍率。
- 梨诺潜能 2 的 `Will +20` 与 `HealOutputIncrease +0.1` 现由同一个 `staticAttributes` 养成槽严格生成；审计保存 `staticHealingIncrease/output` 的明确目标，不再把属性 29 标为缺少运行时消费者。她仍保持 `outputStage: audit`：终结技缺失的 `abilityentity_chr_0035_liino_ult_skill_projhit` 在 Endaxis、vfs-index-browser、IL2CPP-Dumper 与 AnimeStudio 的本地证据范围内均未找到，不能为得到正式产物而猜造模板。
- 当前门禁：生成器 435/435、全量生成 `--check`、Next 201 文件 1362/1362、`type-check:next` 与 `git diff --check` 通过。`tmp/` 仍未跟踪且不得提交。
- 雪绒默认仓库场景现按双方 resolved panel 锁定精确治疗量：初次连携治疗先计算施法者 `Will * 0.5 + 216`，再乘佩丽卡 `1 + Will * 0.001` 的受治疗增幅；目标满血时 `actualHealing=0`，但 `requestedHealing` 仍必须与公式一致并派发成功治疗事件。

### 2026-08-22：弭弗三段伤害与替换技能编辑边界

- 弭弗第三段第 26 帧的真实动作顺序为 `atk_scale_runtime = atk_scale`、读取
  `SkillSetting[弭弗特殊猛击]` 第一列到 `yuanshi_multi`、乘入运行倍率，再执行破韧天赋分支和伤害。
  旧生成结果漏掉前三步，只留下以初值 0 参与伤害，因而回执伤害为 0。
- 台式机 VFS manifest `451359`、asset index `67099` 已确认真实 `skillsetting.asset`：该项四列均为
  1，使用 `Damage` 线性公式 `1 + 0.01 * PhysicalAndSpellInflictionEnhance`。复刻库提交 `c348745`
  先固定数据与语义；
  Endaxis 转换器只对已恢复条目、字面列号和已支持线性公式生成公共属性读取步骤，其他读取不猜测。
- 替换技能 Inspector 显示第一段是编辑读模型仍只按稳定放置来源查基础模板。正式方案记录于
  `docs/next/11-skill-lifecycle.md`：轨道块继续保存稳定槽位输入，实际形态由
  `SkillStarted.skillId + castId` 投影，项目覆盖按每个 replacement skill key 独立保存。整体方案实施前
  不做弭弗专用 UI 修补。

### 2026-08-22：梨锋击倒响应与潜能 5

- `combat-spec` 已先补齐 `KnockDownAction` 的可观察事件链与 `AllValid / OnlyAlive / OnlyDead`
  存活过滤；对应提交为 `49f078a` 与 `08670f0`。Endaxis 新增同步 `outputKnockDown` 步骤、
  `knockDownOutput` 语义触发、运行收据和图编辑器本层支持。目标组必须由普通 Target、固定 `tar`
  或严格的唯一敌人 Finder 证明，不能按 Context 名称猜测。
- 梨锋天赋 2 现监听真实 `OnBeforeOutputKnockDown`，输出追加物理伤害；潜能 5 的 15 秒计时 Buff
  产生一次许可，触发时把追加倍率提高 2.5、增加 5 点失衡、消费许可并重新启动 15 秒计时。
  默认仓库生产回归验证了同帧击倒事件、追加伤害、失衡、许可消费和 450 帧后的第二次计时结束。
- 原始 `OnlyDead` 击倒只处理已经死亡的目标。Endaxis 的唯一木桩死亡是模拟终点，因此该动作仅保留
  在生成审计中，正式 DSL 投影为无效果，不发布 `KnockDownOutput`。佩丽卡终结技第 35 帧先结算
  伤害、再执行 `forceKnockDown + OnlyDead` 的尸体收尾；其正式定义继续使用原直伤模型，不显示为
  对存活敌人的击倒能力。
- 全量 22 名正式干员和梨诺审计产物已经重生成并通过 `--check`；生成器 442/442、Next Vitest
  201 文件 1374/1374、`type-check:next` 通过。养成审计现为天赋 27/44、潜能 108/110，剩余潜能
  仅秋栗潜能 5 与管理员潜能 4；`tmp/` 仍不得提交。
- 下一阶段继续处理秋栗潜能 5，优先与其依赖天赋一起闭环；随后处理管理员潜能 4。每项仍要求
  来源载荷、通用 DSL、标准运行消费与生产场景四层同时成立。

### 2026-08-22：Akekuri GlobalBuff / SkillAffix 固定队伍投影

- `combat-spec` 先行补齐并提交了 GlobalBuff 生命周期、Stack 上限淘汰、队伍子 Buff 同步，以及直接技能 SkillAffix 的施法结束清理；Endaxis 只在固定队伍边界做极简投影，没有复制战中换队系统。
- Akekuri 第二天赋现把每个 `global_buff_combo_trigger` 层镜像为全队普通 Buff。任意队员下一次战技或终结技通过 `eventTarget` 获得 SkillAffix，派生伤害 Buff 通过新增的 `buffOwner` 寻址保持在实际施法者；全队镜像层同步消费。伤害计算前按 1–4 层读取 `SkillSetting[连击增伤] = [0.2, 0.15, 0.1333, 0.125]`，战技再乘 1.5。
- 潜能 5 的 `potential_5_duration=5` 已严格验证并延长投影期限；终结技两个原生载体 Buff 使用新的 `projectedBuffIds` 审计分类，免伤 Buff 单独标为对敌伤害模拟无效果。Buff 图标展示字段仍由公共定义生成链保留，没有因行为投影被丢弃。
- 生产回归使用 Akekuri + 佩丽卡双人场景，锁定跨队员 30% 战技增伤、全队一层同步消费、10 秒失效和潜能 5 的 15 秒期限。完整证据与边界见 `docs/research/akekuri-combo-imbue.md`。
- 全量 22 名正式干员与梨诺审计产物已在隔离目录完整生成并同步，所有已解析 Buff 的图标身份和显示位进入 audit/正式定义；生成器 447/447、定向 Next 48/48、`type-check:next` 通过。养成审计提升为天赋 27/44、潜能 109/110，剩余潜能只剩管理员潜能 4。完整 Vitest 为 1882/1890，通过项覆盖全部 Next 回归；8 个失败均位于旧版结构/数据测试，本轮未修改对应旧版代码。
- 下一项优先闭环管理员潜能 4；之后回到剩余天赋横向覆盖。若机制不影响对敌伤害且无法证明会改变当前模拟结果，继续只记录证据，不抢占伤害链任务。

### 2026-08-22：管理员潜能 4 的伤害相关属性闭环

- `PotentialTalentEffectTable.chr_9000_endmin_potential_4` 的三条原生载荷已逐项确认：
  `MaxHp/BaseMultiplier +0.1`、`Agi/BaseAddition +25`、
  `EtherDamageTakenScalar/BaseAddition -0.1`。前两项进入正式潜能 modifier；敏捷实际提升管理员
  resolved panel 的攻击，最大生命也保留准确面板结果。
- 以太承伤只在管理员作为伤害防御方时消费；标准木桩没有敌人主动攻击，也没有玩家承伤执行链。
  清单新增 `simulationNoEffectAttributeTypes: [60]`，生成器严格核验它只能对应上述已知原生槽位，
  不把它近似成敌人承伤、以太增伤或其他面板字段。未来若增加玩家受击路径，必须重新开放真实
  防御快照消费者。
- 养成审计现为天赋 31/44、潜能 110/110 定义已转换且可进入标准模拟；管理员仍有天赋和终结技
  行为缺口，不因潜能清零而宣称整名干员完整。生成器 448/448、定向 Next 72/72 与
  `type-check:next` 通过。下一阶段回到剩余 13 个天赋，继续按“会改变对敌伤害优先”的横向审计。

### 2026-08-22：管理员天赋 1 冻结引爆增攻闭环

- 管理员天赋 1 的常驻根 Buff 不是空效果，而是公共冻结 Buff 查找天赋参数的标记。冻结引爆响应
  已在公共定义中严格保留：读取 `atk_up/duration` 后对本人及队友创建
  `buff_chr_0003_endminf_talent_1_tirgger`；一级/二级分别为 `Atk/BaseMultiplier +15%/+30%`，
  均持续 15 秒。触发 Buff 的攻击图标和原生显示位继续进入正式定义。
- 天赋槽改用统一 `attachedBuff` 装配标记。生产场景完成“连携冻结 → 终结技引爆 → 后续普攻”，
  并验证二级天赋的同构普攻伤害高于一级；不是只检查生成文本。
- 天赋 2 的全队 Aura 及“目标冻结 + 物理伤害”双条件增伤来源已经确认，但现有
  `attachedPassive` 收集门禁尚未产出完整程序，继续显式未建模。完整证据见
  `docs/research/endministrator-frozen-talents.md`；下一步先修公共被动/Aura 收集，不写管理员专用
  常驻增伤近似。
- 养成审计此前只把 `attachedBuff` 列为潜能编译器，漏计了使用同一正式编译/运行链的天赋。
  修正后雪绒、梨锋、波格兰尼奇三个既有完成项与本轮管理员天赋 1 一并计入，当前基线为天赋
  31/44、潜能 110/110；这是审计口径校正，不是一次虚增四项机制实现。

### 2026-08-22：管理员天赋 2 冻结目标物理增伤闭环

- 隐藏被动 `chr_0003_endminf_talent_0` 与全队 Aura 一直能被来源收集；真正阻塞是子 Buff 的
  `damageModifier` 同时包含 `CheckBuffStackNumAdvanced` 与 `CheckDamageType`。公共解析器现在只对
  该已证明的二条件顺序生成合取：敌人持有冻结 Buff 且当前伤害为物理；处理器仍为
  `Defender / NormalCalcZone`，没有扩大成泛用物理增伤。
- 天赋 2 改用统一 `attachedPassive`，一级/二级向全队传递 `dmg=0.1/0.2`。生产场景以同一连携
  冻结和终结技验证二级首个物理命中高于一级。管理员养成天赋/潜能已全部退出缺口，当前全量
  养成审计为天赋 32/44、潜能 110/110；干员仍保留男女终结技的 `skillBehavior` 缺口。
- 下一阶段继续剩余 12 个天赋。弧光天赋 2 已确认只响应角色承受术法附着并提供短暂免疫，按当前
  木桩边界延后；优先审计莱万汀天赋 1 的火焰抗性忽略与其他正常攻击可触发的对敌增伤。

### 2026-08-22：莱万汀天赋 1 吸收附着与减火抗闭环

- `combat-spec` 已先提交 `45508cd`：严格适配简单 `SaveBuffStackNum`，并把
  `OnBuffEnhanceChanged` 接入既有增强层变化运行时；真实
  `buff_chr_0016_laevat_energy` 已通过 CLI 严格解析。简单类独立 RVA 在当前台式机证据中缺失，
  复用 Advanced ID 计数语义的边界已明确写入复刻库文档。
- `combat-spec a7af6d1` 进一步保留 BeforeCalculation 被 Instant 修改一侧的伤害包快照，同时仍在
  每阶段后清理实体实时修正；防御方减火抗因此只影响本次命中且不会泄漏到下一次伤害。
- 莱万汀队伍监听现保留“主控重击/普攻末段 → 唯一敌人火焰附着层查询 → 按标签限层吸收 →
  自身能量增强”的原始顺序。达到 4 层后创建可见满层 Buff，并施加 20 秒
  `FireResistance/BaseAddition -10/-15/-20`；吸收投射物的纯 EffectAction 子技能只作为表现省略。
- `finishBuffsByTag.count` 已进入通用 DSL、校验和运行时；增强型 Buff 按增强层扣减，普通叠加按
  实例结束。敌人六种项目抗性也已进入可被 Buff 修改的八槽属性容器并参与伤害快照。
- 此回归同时修复了伤害上下文阶段错误：`BeforeCalculation` 冻结的瞬时属性快照不再被
  `AfterCalculation` 清除后的基础值覆盖。50 火抗生产场景验证四次吸收后，天赋 3 级的探测火伤
  高于 1 级。完整证据见 `docs/research/laevatain-fire-infliction-absorption.md`。
- 养成审计现为天赋 33/44、潜能 110/110。莱万汀天赋 2 为当前木桩边界下的自身生存效果，继续
  显式未建模，因此干员仍为 `partial`。下一阶段继续筛选剩余 11 个天赋中能由玩家正常行为触发、
  且会改变对敌伤害的机制；防守侧效果只记录，不抢占输出链任务。

### 2026-08-22：大潘 Crush 与第一天赋破防消费闭环

- `combat-spec 66e1409` 已先补齐 `CrushAction`：严格解析 `damageMultiplier`、
  `ignoreHitEffect` 与完整位移证据；运行时复用已恢复的物理异常准入和事件顺序，首次只添加
  `buff_physical_no_guard`，再次才创建 `buff_physical_crushed`。倍率仅在不近似等于 1 时写入
  `dmg_multiplier`，命中特效开关只在 true 时写入 `ignore_hit_effect=1`。
- Next 的 `applyPhysicalInfliction` 现为 Fracture/Crush 判别式统一入口。大潘连携第 23 帧保留
  原生 `CrushAction(20) -> DamageAction(21)`；根物理异常补存 timeline `sequenceIndex`，避免按
  动作类别归并后把 Crush 错排到同帧伤害之后。`buff_physical_crushed` 及其完整子 Buff 树内联于
  使用点，图标元数据不丢失。
- 第一天天赋监听 `buff_physical_no_guard` 的原生 `OnConsumeBuff`。运行时新增受限的
  `buffConsumed(sourceOperatorId,targetId,buffId,layers)` 事实，只在已闭环物理异常状态链确实移除
  破防层后发布；普通结束、到期和驱散不冒充消费。一级/二级按消费层数叠加 10 秒物理增伤
  4%/6%，最多 4 层，并保留 `icon_battle_physical_dmg_up`。
- 生产场景连续两次大潘连携，验证第二次 Crush 先触发天赋、随后同帧直伤精确提高 6%。养成审计
  更新为天赋 34/44、潜能 110/110；大潘两项天赋和全部潜能均进入标准模拟编译链。

### 2026-08-22：木桩模型内无效果也属于完整转换

- 原生行为已严格取证、但只能依赖模型明确不存在的事实时，现使用带稳定原因的
  `simulationNoEffect` 计为完整转换，不再伪装成未建模。佩里卡天赋 2 明确排除当前目标，唯一敌人
  下没有第二目标；莱万汀天赋 2 的根 Buff 只监听 `OnTakeDamage`，固定木桩不会主动攻击。
- 公共终结技伤害免疫和处决完全免疫统一进入 `simulationNoEffectBuffIds`。真正影响输出的 Camille
  战技弱化、Fluorite 终结技 Buff、汤汤终结技减益仍保持失败关闭，不能借此分类消除。
- 正式干员感叹号由 14 名降为 7 名，只保留真实天赋或输出行为缺口；养成审计现为天赋 37/44、
  潜能 110/110，18/22 名正式干员养成完整。Arcane 已执行的条件被动冷却编译器也补入审计白名单，
  不再被统计漏算。若未来扩展多敌人或敌方主动伤害，必须按保留原因重新
  打开对应审计。

### 2026-08-22：管理员统一为女版来源的单一技能集

- 管理员不再把 `chr_0002_endminm` / `chr_0003_endminf` 暴露为两套技能。对照审计确认对应技能的
  伤害段数、命中帧、倍率、条件和资源行为一致；唯一块边界差异是男连携 24 帧、女连携 23 帧。
  正式定义按决策采用女版来源，技能入口由 20 个降为 10 个，使用通用
  `basicAttack1..5/finisher/plungingAttack/battleSkill/ultimate/comboSkill` 身份。
- 男版原生 ID 通过 `simulationEquivalentNativeSkillIds` 留在严格原生技能组闭包中，不被误报为
  缺失入口。早期项目保存的男女技能键通过定义级 `skillAliases` 映射到规范模板；别名只用于解析，
  不回到技能选择列表。完整证据见 `docs/research/endministrator-gender-skill-equivalence.md`。

### 2026-08-22：莱万汀与伊冯强化普攻从终结技释放链分离

- 修正了把 `CharGrowthTable` 养成等级组误当编辑器有序释放链的问题。莱万汀终结技此前被错误生成
  为“开大 + 4 段强化普攻”，伊冯被错误生成成“开大 + 6 个强化攻击文件”。两人的正式
  `ultimate` 现在都只含真正开大。
- `SkillGroupDefinition.variants` 表达同一稳定组下、可使用不同等级来源的具名形态链。两人的
  `enhancedBasicAttack` 均挂在 `basicAttack` 下而使用 `levelSource=ultimate`；技能库以“强化普攻”
  普通卡片平齐展示，拖放、
  模板解析、项目兼容检查、定义引用、全等级编译和养成补丁均遍历形态链。
- 伊冯 `ultimateAttackEnd` 的原生结束 Buff `ComboCacheAction` 明确把 Attack 命令映射到该技能，故它
  是强化普攻收尾而不是终结技末段。自动命令映射仍等待角色输入层证据；当前不伪造不存在于
  SkillData 的逐段 `ChangeSkillAction`。详见
  `docs/research/ultimate-enhanced-basic-attack-grouping.md`。

### 镜头条件消去的证据边界（2026-08-23 晚间补充）

- 弭弗终结技/三段战技中的 `CheckTwoDirectionAngle` 当前按已审计样本处理：分支只写
  `ifrightside` 与 `cam_angle`，原始读点用于镜头水平基准及左右侧动作朝向；在 Next 的
  零距离、唯一木桩模型下不要求玩家提供镜头夹角模拟输入。
- 这仍是窄白名单，不是完整的黑板数据流证明。严谨顺序应当是：先收集相关黑板键的全部
  消费者，证明它们均不会改变伤害、Buff、资源、命中序列或时间，再反向证明生产这些键的
  镜头条件无模拟效果。当前生成器尚未自动完成这条消费者闭包分析；数据版本变化或出现新
  读点时存在误消去风险，后续应以数据流分析替换白名单。不得仅因条件类型带“Camera”就
  一概省略。

### 2026-08-23：元素状态闭包、弧光与萤石横向收口

- `combat-spec 8170f90` 已严格解析 12 个复合状态递归创建的完整 26 Buff 闭包。燃烧周期
  `DamageAction` 的 unit 级处理器明确把 `CriticalRate` 瞬时设为 0，证明燃烧每跳不可暴击；
  `EnemyHurtAnimAction` 与 `HitStopAction` 保留完整字段校验，在无敌人行为且按现实时间调度的木桩
  模型中不改变伤害总量。26 个真实 Buff 已整体通过 `validate-buffs`。
- 四类同元素法术爆发均新增真实 1.4.4 数据驱动的标准环境回归，分别验证 Fire/Pulse/Cryst/Natural
  使用 `SkillSetting[法术爆发伤害倍率]=1.6` 并实际扣减木桩生命；不再只用手造电爆发夹具代表全体。
- 弧光天赋 2 的旧 key `electricAdditionalHit` 与原生载荷名称不符。真实两级效果是 30%/50% 响应
  `OnCharBeforeTakeSpellInfliction`，给自身创建 0.067 秒附着免疫 Tag。生成器逐项校验养成输入、事件
  顺序、概率、子 Buff 和唯一 Tag；木桩不会对干员施加术法附着，因此以
  `enemyDoesNotInflictSpellStatusOnOperators` 明确计为完整，而不是删除来源事实。天赋进度为
  38/44，潜能仍为 110/110。
- 萤石终结技的 `buff_chr_0022_bounda_ultimate_skill` 是空载荷但有身份意义的 0.2 秒目标标记，不应
  列为未建模。现有通用 Buff 查询、刷新和跨技能清理已经可以严格承载它；移除陈旧清单后，终结技
  四枚投射物在第 59/63/67/72 帧的伤害、第四段附着分支和标记生命周期均进入正式定义及生产回归。
- 正式干员真实 `partial` 由 7 名降至 5 名：Camille 战技 Weak、陈千语天赋、艾斯黛拉天赋、洛茜
  天赋、汤汤终结技减益。梨诺仍是独立 audit 资产缺口。汤汤减益包含无命名、空关键帧字面曲线的
  敌方实体时间膨胀；`combat-spec` 当前严格拒绝该缺失 wrap mode 的形态，不能在确认 Unity 空曲线
  求值与原生用途前把它降为表现效果。

### 2026-08-23：洛茜两项天赋与 NoGuard 查询闭环

- 多等级 `skillBlackboardPatch` 现允许各等级拥有互斥的标志键，但仅限无条件 `assign`，且缺席等级
  必须能从目标 SkillData 取得静态数值初值；动态值、加乘运算或未声明键仍严格失败。洛茜四个
  `talent_1_1/1_2/2_1/2_2` 初值均由原生技能明确声明为 0，因此两项天赋不再依赖猜测补值。
- 1.4.4 `Skill/Character/Common/NoGuard`（ID `1075718177`）的精确“敌人、HasAny、层数 >= 1”
  查询统一投影到敌人失衡账本的 `targetStaggered`，不另造可能与失衡窗口漂移的镜像 Buff；运行时
  和标准兼容门禁均已接入该条件。
- 生产场景通过佩丽卡战技正常打入失衡，再让洛茜战技进入追击段并施加真实流血，验证天赋 2 级
  相比 1 级同时增加流血次数与单次伤害。养成审计更新为天赋 40/44、潜能 110/110；正式
  `partial` 余 Camille、陈千语、艾斯黛拉、汤汤 4 名，梨诺仍为独立缺失实体资产的 audit 项。

### 2026-08-23：陈千语一天赋与艾斯黛拉两天赋闭环

- 陈千语天赋 1 已从 `unmodeledTalent` 转为常驻 Buff：普通战技、终结技或连携技造成伤害后叠加
  最多 5 层的 10 秒攻击 Buff，两级每层分别为 4%/8%。养成表重复携带的 `max_stack=5` 仅在根
  Buff 不声明该键、事件闭包恰有一个子 Buff、且子 Buff 静态 `maxStackCount` 精确等于 5 时允许
  省略；其他未声明养成键仍失败关闭。生产场景验证首个战技叠层会提高后续普攻伤害。
- 艾斯黛拉天赋 1 的 `OnOutputBuff` 标签查询现正确忽略 Tag 模式序列化自带的空 ID 占位，但 ID
  模式仍拒绝空身份。真实碎冰标签 `-615023885` 会给自身添加一次性回技力 Buff，战技按 Buff
  黑板返还 7.5/15 技力并消费；标准回归保留原生事件来源归属，没有把队友输出事件改成全队广播。
  天赋 2 的自身寒冷承伤降低也完整保留；木桩不会主动攻击，因此它不改变当前伤害结果。
- 养成审计现为天赋 43/44、潜能 110/110；唯一未转换的养成槽是陈千语天赋 2。其
  `OnAfterOutputWeaknessTriggered` 发射点尚无证据，不能擅自等同于目标 `OnPoiseZero`。
- 本轮生产回归同时暴露艾斯黛拉战技读取共享 `EntityBB_first_hit`，但现有
  `CharacterTemplateData` MonoBehaviour 导出因 managed-reference TypeTree 损坏，尚不能证明初值。
  正式定义因此显式保留 `battleSkill` 的 `runtimeDependencies` 缺口，不用猜测的 0 掩盖；天赋回归
  只隔离该无关伤害分支。后续应先修复角色模板解码或取得等价原生初始化证据。

### 2026-08-23：弱点触发输出事件与陈千语二天赋闭环

- 1.4.4 IL2CPP 已关闭此前未知边界：`SetWeaknessAction._OnWeaknessTriggered`（RVA
  `0x06D304A0`）从输入事件解析攻击者，并在攻击者 AbilitySystem 上发射事件 141；目标仍是弱点
  所属敌人。它不是 `OnPoiseZero`。`combat-spec` 提交 `2955c03` 新增最小事件边界、身份载荷、测试
  与 `docs/weakness-trigger-output.md`，没有添加未证明的次数或倍率字段。
- Endaxis 新增无数值负载的 `operatorWeaknessTriggeredOutput` 外部事实，只唤醒指定干员的
  `afterOutputWeaknessTriggered` Buff 监听器，不创建敌方弱点窗口、技能、伤害或失衡过程。陈千语
  天赋 2 已从 `unmodeledTalent` 提升为严格 `attachedBuff`；2 级生产场景产生 10 点 `PoiseApplied`。
  养成审计达到天赋 44/44、潜能 110/110，全部 simulation-ready。
- 另确认一个独立装配缺口：技能轴完全为空时，常驻 Buff 反应动作没有可创建标准末端执行器的
  已编译技能程序载体；轴上存在任意技能时不受影响。不得猜造基础攻击类型的伪技能，后续应给
  常驻/外部事件程序提供不依赖时间轴放置项的正式执行上下文。

### 2026-08-23：条件分支击倒目标证明补齐

- 条件树叶节点此前调用 `compile_knock_down_output` 时丢失了根技能上下文与 Context 目标证明，
  导致相同的 `KnockDownAction` 在根调度可编译、嵌套分支却失败。现在 `Owner` 仅在已证明的根技能
  环境归约为施法者；`Context/tar` 继续使用现有固定输入目标，`Context/smart_target` 仅在根技能
  输入已证明为唯一敌人时归约，其他 Context 组必须由最近的目标组写入或同条件非空守卫证明。
- 该通用修复同时关闭安塔尔连携与铸铁终结技的严格 DSL 阻塞，并有 `tar`、`smart_target` 两种
  条件叶回归。全量无角色专用声明审计现为 320/320 可解析、318/320 可编译、28/30 名完整直转；
  剩余仅弭弗二段战技的替换 Buff 与梨诺终结技缺失能力实体模板。这里的“直转”不等于已加入
  正式 manifest/默认仓库，剩余 7 名尚未注册干员仍需逐名补齐养成、生成物与生产场景。

### 2026-08-23：狼卫正式生成与生产模拟接入

- 狼卫已从横向审计样本提升为 `outputStage: complete` 的正式 manifest 干员，并通过稳定导出加入
  默认 Next 数据仓库。9 个可放置技能、2 项天赋和 5 项潜能均来自版本化来源；天赋 1 的燃烧输出
  响应、10 秒火伤增益 Buff 及其原生图标，天赋 2 的战技资源补丁和全部潜能均进入生成定义。
- 默认仓库生产回归从真实时间轴放置狼卫战技，经正式仓库解析和标准玩家伤害环境对唯一木桩产生
  `DamageApplied`。连携技能本体与能力实体已保留，但当前来源没有给出可证明的连携自动注册条件，
  因此没有猜造 `comboSkillRegistrations`；这不阻止玩家显式放置技能，自动触发仍是独立证据边界。
- 正式 `complete` 产物现为 23 名，另保留梨诺 `audit` 产物；尚未正式注册的官方干员剩
  Antal、Xaihi、Alesh、Avywenna、Catcher、Ardelia 六名。配置清单养成审计更新为天赋
  46/46、潜能 115/115，全部 simulation-ready；该数字只覆盖已配置清单，不代表六名未注册干员
  已完成养成转换。
- 本轮门禁：生成器 Python 462/462、全量生成及 `--check`、`type-check:next`、Next Vitest
  202 文件 1415/1415 全部通过。`tmp/` 仍为未跟踪临时目录，未纳入提交。

### 2026-08-23：安塔尔关键词增强与 Buff 实例目标闭环

- 1.4.4 `AbilitySystem.TryEnhancingKeywordBuff` 已由实际安装包 `GameAssembly.dll` 的 RVA
  `0x037C2EC0` 反汇编闭环：普通 Buff 添加时按 `onAddedBuffId` 匹配当前关键词 Buff 的
  `KeywordEnhance.buffIds`，读取其黑板 `rate`，再按 Assign/Add/Multiply 原地修改；短时触发 Buff
  移除后不会回滚。`combat-spec a00ac5b` 先加入该运行时原语、真实字段适配、测试和证据记录。
- Next 的 Buff 定义新增严格 `keywordEnhancements`。安塔尔战技易伤同时包含电、热两项独立伤害
  修正，生成器为两者分配独立可变 rate 键，避免潜能 5 在共享键上重复累加。标准场景在战技施加
  易伤 20 秒后让佩丽卡普攻，验证潜能 5 的实际伤害高于潜能 4。安塔尔 9 个技能、2 项天赋、5 项
  潜能已加入正式 manifest、稳定导出和默认仓库，正式 `complete` 干员增至 24 名。
- Buff 定义不再因“从根技能还是嵌套 Buff 引用”而把实例身份固化为 caster/enemy。施加、结束、
  黑板读取、层数查询与点燃统一保留 `buffOwner`、`buffSource`、`eventTarget`；OnIgnite 的
  `Target` 依据已确认的 `igniteSource.selfTargetHandle` 走本次 `buffSource`。运行时单目标解析、DSL
  类型和结构校验同步接入。该修复使莱万汀深层 Buff 树可稳定提升为干员级定义，也避免能力实体
  持有 Buff 时错误操作角色或敌人容器。
- 全量 25 项配置生成及 `--check`、生成器 463/463、`type-check:next`、Next Vitest 202 文件
  1420/1420 已通过。尚未正式注册的官方干员剩 Xaihi、Alesh、Avywenna、Catcher、Ardelia 五名；
  梨诺继续因终结技真实能力实体模板缺失保持 audit。

### 2026-08-23：阿列什正式生成接入

- 阿列什横向审计的 10 个入口已全部提升为正式 manifest：五段普攻、重击、下落攻击、战技、连携
  和终结技均走统一 `resolvedSequence`，两项天赋与五项潜能复用 attached Buff、技能黑板补丁、
  静态属性和终结技费用编译器。稳定导出、默认仓库和真实时间轴基础攻击回归已接入。
- `CheckBuffIdInContext` 现严格以 `checkType` 选择 ID 或 Tag 查询。阿列什天赋的 ID 模式真实对象在
  `buffIdList` 有有效冻结 Buff 身份，同时仍携带序列化 Tag 残值；该 Tag 不构成额外合取条件。
  Tag 模式同理不因空或陈旧 ID 占位失败，未知 checkType 仍失败关闭。
- 正式 `complete` 干员增至 25 名，剩余 Xaihi、Avywenna、Catcher、Ardelia 四名；梨诺仍保持
  缺失能力实体模板的 audit。本轮门禁为生成器 463/463、全量生成与 `--check`、
  `type-check:next`、Next Vitest 202 文件 1424/1424。下一候选继续按“正常玩家行为可触发并影响
  输出、现有证据闭合”排序。

### 2026-08-23：熙海正式生成与 EnhancedAction 闭环

- 熙海 10 个技能入口、2 项天赋和 5 项潜能已加入正式 manifest、稳定导出与默认仓库，正式
  `complete` 干员增至 26 名；尚未正式注册的官方干员剩 Avywenna、Catcher、Ardelia 三名，梨诺
  仍因终结技能力实体模板缺失保持 audit。连携本体可显式放置，但未取得自动注册条件证据，因此
  没有猜造 `comboSkillRegistrations`。
- `combat-spec 6159868` 已从七份 1.4.4 公共增幅载体证明 `EnhancedAction` 的元素映射与独立伤害
  乘区。Next 生成器现把 Owner 目标、父 Buff 同寿命、无加入边沿增强的严格子集转换为
  `*EnhancedDamageIncrease/BaseAddition`；Spell 覆盖四种术法，单元素只进对应槽。Buff 生命周期中
  `StoreAttributeValue`、黑板修改和二元计算写入后都会刷新动态属性修正，熙海终结技的智识换算与
  固定增幅因此在同一次启动序列结束后生效。
- 熙海终结技的结晶、自然两个 `overrideChildBuffId` 没有因数值内联而丢失：正式 Buff 定义以
  `childPresentations` 保存两个子 Buff ID、图标路径、显示位置与排序元数据。标准生产场景先开大、
  再放结晶普攻，实际伤害严格高于未开大基线；不是只检查生成文本。相同通用链也补齐安塔尔终结技
  与诀天赋的既有增幅数据。
- 当前证据边界没有被放宽：Source 目标的庄方宜增幅、`autoFinishByAction` 的梨诺载体和非空
  `enhancingList` 仍需分别解决来源侧属性注册、动作句柄寿命与加入边沿 rate 改写，不能借 Owner
  子集误投影。`tmp/` 继续只作 AKEDB 临时证据目录，不纳入提交。本轮门禁为生成器 466/466、
  全量生成与 `--check`、`type-check:next`、Next Vitest 202 文件 1437/1437。

### 2026-08-23：庄方宜天地造化电磁增幅闭环

- 用户发现庄方宜天赋 1“天地造化”的电磁增幅没有进入战技 hit。AKEDB 原始
  `buff_chr_0030_zhuangfy_talent1_base` 证明它不是普通 Owner 属性 Buff，而是
  `DuringBuffEnable + Source -> Source + Pulse EnhancedAction`：基础 rate 来自 `base_rate`，
  `buff_chr_0030_zhuangfy_talent1_mark` 每次加入时再按 `Add(enhance_rate)` 改写载体。
- `combat-spec faad9f1` 在既有反编译证据上补齐动作对象转交 `enhancingList`，并以真实庄方宜形状
  固化 Source 目标、动态黑板值和加入边沿刷新。Endaxis 生成器现把 Source 身份保留为
  `buffSource`；当前只在来源实体等于载体 Owner 时注册属性，跨实体会原地报错，绝不默认为 Owner。
- Next Buff 运行时在关键词 rate 被加入边沿改写后立即重建动态属性修正；标记结束不回退，载体结束
  才撤销整项增幅。庄方宜正式生成物因此包含 `electricEnhancedDamageIncrease/baseAddition` 及对应
  mark 的 `keywordEnhancements`。标准生产回归用相同战技与暴击样本证明：天赋一级伤害高于关闭，
  二级又高于一级，增幅已实际进入 `DamageApplied`/hit，而非只存在于生成文本。

### 2026-08-23：Avywenna 正式生成与条件投射物 Buff 闭包

- Avywenna 10 个技能入口、2 项天赋和 5 项潜能已进入正式 manifest、稳定导出和默认仓库，定义
  自报 `complete`；正式完整干员现为 27 名，未正式注册的官方干员剩 Catcher、Ardelia，梨诺仍因
  终结技能力实体模板与动作句柄寿命缺口保持 audit。
- 条件分支中的投射物子技能以前只递归收集“子技能中的条件 Buff”，会漏掉子技能根部直接
  `CreateBuffAction`。Avywenna 的终结技长枪回收因此在编译时找不到
  `buff_chr_0012_avywen_lance_pulse_check`。闭包收集现统一走完整子战斗节点，保留这个 0.3 秒
  自检 Buff 的脉冲附着行为，并有最小回归防止再次漏依赖。
- 天赋 1 的每一级同时包含三项技能黑板补丁和一个常驻 Buff。养成转换器新增严格组合模式：逐级
  对齐技能补丁、每级恰好接受一个同 ID 附着 Buff，并分别生成 `modifiers` 与 `passiveSkills`；其他
  混合载荷失败关闭。正式结果同时保留战技/连携/终结技的失衡能量补丁和天赋监听 Buff。
- 数据边界：AKEDB 2026-08-23 公共 BuffData 清单缺少上述长枪脉冲自检 Buff；默认
  `vfs-index-browser/combat-spec/artifacts/BuffData` 中存在由 1.4.4 JsonData 解包得到的完整定义。
  正式生成与 `--check` 必须使用默认解包工件，不能用仅含 AKEDB 公共清单的 `tmp` 镜像替代。
  本轮门禁为生成器 468/468、默认解包源全量生成与 `--check`、`type-check:next`、Next Vitest
  202 文件 1442/1442。

### 2026-08-23：Catcher 正式生成与属性公式闭环

- Catcher 的 9 个技能入口、2 项天赋和 5 项潜能已加入正式 manifest、稳定导出与默认仓库，
  `conversionSupport` 为 `complete`。正式完整干员达到 28 名；未正式注册的官方干员只剩 Ardelia，
  梨诺继续因终结技能力实体模板与动作句柄寿命缺口保持 `audit`。
- 两个新公式不是 Catcher 特判。护盾容量现支持原生
  `MultiplyAttributeCalculation(AttackerOrHealer)`，Buff 创建时冻结宿主属性并执行
  `attribute * multiplier + addition`；Catcher 连携护盾因此保留 `Def * shield_def_rate + shield_base`。
  伤害公式的同类分支则在 `beforeCalculation` 后冻结来源属性，再进入完整玩家主动伤害生命周期；
  潜能 1 的 `Def * 5 + 300` 会响应每次带普通战技或终结技标签的输出伤害。
- `StoreAttributeValue` 的非 Converted 属性读取不再误限于“不取整、除数为 1”。Catcher 天赋 1
  按真实顺序计算 `floor(Will / 10) * rate`，写入 Buff 黑板后即时刷新 `Def/BaseAddition`；面板防御
  也以原生 `Def` 键进入战斗属性集，潜能 2 的面板防御加值会被上述护盾和伤害公式读取。
- 正式生产回归在真实时间轴释放 Catcher 终结技：本体与冲击波共 6 次终结技标签伤害，潜能 1
  对六次各追加一次防御倍率伤害，追加伤害不递归触发自身。普通战技仍是受击/指定敌方 Buff
  驱动的反击链；固定木桩不会自然制造该输入，现有外部事件边界不因此被扩大。
- 本轮门禁：生成器 471/471、默认来源全量生成及 `--check`、`type-check:next`、Next Vitest
  202 文件 1450/1450。`tmp/` 仍为未跟踪临时目录，不纳入提交。

### 2026-08-23：Ardelia 正式生成与战技易伤生产回归

- Ardelia 的 9 个技能入口、2 项天赋和 5 项潜能已加入正式 manifest、稳定导出与默认
  仓库，`conversionSupport` 为 `complete`。正式完整干员达到 29 名；除梨诺仍因终结技
  能力实体模板和动作句柄寿命缺口保持 `audit` 外，当前资产闭合的官方干员均已进入
  正式生成链。
- 战技在第 32 局部帧先向唯一敌人施加
  `buff_chr_0025_ardelia_normal_skill_vulnerable`，再结算自然伤害；潜能 1 依原始养成表将
  `rate_vul_base` 追加 0.08。标准生产回归通过真实时间轴分别释放潜能 0/1 战技，
  验证同一击在潜能 1 下实际伤害严格更高。这条链只复用通用技能黑板补丁、敌方 Buff
  容器和伤害易伤乘区，没有干员特判，也不依赖敌人主动行为。
- 养成审计已刷新为配置清单天赋 57/58、潜能 145/145，已转换槽位全部可进入标准模拟编译。
  本轮门禁为生成器 471/471、默认来源全量生成及 `--check`、`type-check:next`、Next Vitest
  202 文件 1455/1455；`tmp/` 保持未跟踪且不得提交。
  下一阶段不应继续简单扩大干员清单，而应先对梨诺的缺失资产与替换技能/动作句柄总体方案
  做一次证据复核；仍不可猜造模板寿命或技能槽路由。若资产仍不闭合，则按既定顺序转入全武器、
  装备和套装的转换与生产模拟。

### 2026-08-23：梨诺 EnhancedAction 句柄复核与缺资产门禁

- 梨诺 `buff_chr_0035_liino_spellenhance` 的两个 `EnhancedAction` 会直接改变对敌输出：
  分别把同一 `spellenhance_rate` 写入脉冲与自然独立增幅区。它们位于 `DuringBuffEnable`、
  目标为 Buff Owner、duration 与宿主使用同一黑板键，但 `autoFinishByAction=true`，之前因动作
  句柄寿命未取证而被严格拒绝。
- 1.4.4 `GameAssembly.dll` 的 `KeywordActionWithSubType.OnEnd`（RVA `0x04B2F3D0`）
  现已静态反汇编确认：动作先检查数据偏移 `0x60` 的 `autoFinishByAction`，为真时遍历实例私有
  `m_createdBuffs`、逐个结束并清空列表。`combat-spec` 提交 `593fd8c` 新增
  `EnhancedKeywordAction` 与宿主 Buff 禁用/结束回归；定向 5/5 通过。
- Next 生成器只新放行上述 `DuringBuffEnable + Owner + 同寿命 + 空 enhancingList`
  形状，`OnBuffStart + autoFinishByAction=true` 仍继续失败关闭。梨诺审计产物现保留
  `PulseEnhancedDmgIncrease` 和 `NaturalEnhancedDmgIncrease`，不再丢失这两个伤害乘区。
- 一次正式提升试跑还发现，梨诺终结技原清单漏写 `compile` 策略，导致渲染器可以引用未生成的
  `liinoUltimate`。正式 `complete` 阶段现强制每个技能都有结构化编译策略；将终结技试接入
  `resolvedSequence` 后，真实首阻塞仍精确回到第 76 帧缺失
  `abilityentity_chr_0035_liino_ult_skill_projhit` 模板。梨诺因此继续保持 `audit`，
  不用 41 帧子 SkillData 猜寿命、born tag 或组件。
- 本轮 Endaxis 门禁为生成器 472/472、默认来源全量生成及 `--check`、
  `type-check:next`、Next Vitest 202 文件 1455/1455。`tmp/` 仍未跟踪且不得提交。

### 2026-08-23：首件 AKEDB 正式武器与治疗触发装备链

- `wpn_lance_0014`（曜夜的首演）已从 1.4.4 的 `WeaponBasicTable`、`SkillPatchTable`、
  `SkillData/sk_wpn_lance_0014` 和 `BuffData/buff_wpn_lance_0014_damageup` 闭环并进入
  Next 正式仓库。三词条保留意志、输出治疗效率和主属性；治疗其他队员后按目标施加 20 秒攻击
  Buff，最多 4 层、各自持续时间独立，同一目标每 0.1 秒至多触发一次。公共攻击 Buff 图标与武器
  图标均保留，未把展示字段当作模拟无关数据删除。
- 通用装备事件现在可按治疗来源角色订阅 `operatorHealed`，可判断治疗 source/target 是否相同，
  并可对事件目标查询/创建定时标记或施加 Buff。装备处理器拥有按词条等级编译的独立动作黑板，
  因而攻击倍率、持续时间与最大层数不需要写成武器特例。无条件治疗效率进入
  `staticHealingIncrease.output`，旧目录的 9 条同类词条也不再是假缺口。
- 真实生产回归让卡米拉先释放连携、治疗帧前切入佩丽卡，再由佩丽卡普攻。佩丽卡满血导致
  `actualHealing=0`，但有效治疗事件仍触发曜夜 Buff，装备组后续实际伤害严格高于空武器组；这同时
  验证了来源路由、事件目标 Buff、目标级门控和战斗属性刷新，而非只检查生成文本。
- 装备静态候选审计从 900/32 推进为 909 条可生成、23 条 DSL 缺口；AKEDB 武器身份由 76/77
  推进为 77/77，真实套装仍为 23/23。正式新增身份单列在
  `formal_weapon_identities.json`，只在完成 Skill/Buff/运行时闭环后登记，不以旧目录猜效果。
  下一阶段按伤害相关性优先处理剩余 23 条：最终伤害减免 8 条、按技能范围冷却缩减 2 条、
  按技能范围失衡增益 1 条，以及需要开战持久 Buff 的条件效果 12 条；随后批量正式化武器、装备和套装。

### 2026-08-23：双仓库交接基线与 Next 武器数据位置

- Endaxis 当前开发分支为 `codex/time-dilation-curve-editor`，本轮功能基线提交是 `115ceabf`；
  `tmp/` 仍是未跟踪取证目录，不得提交。白天继续工作时应先拉取该分支，不要从仍停在
  `e85e88d7` 的旧本地 `feature/next` 开始重复实现。
- 复刻库是独立仓库 `D:/Projects/combat-spec`，不是
  `D:/Projects/vfs-index-browser/combat-spec` 工件目录。当前复刻基线为 `593fd8c`，包含
  `EnhancedAction autoFinishByAction` 的动作句柄清理证据；后者工件目录属于
  vfs-index-browser 工作树且有大量独立未提交内容，不得混作复刻库提交。
- Next 正式武器定义放在 `src/next/data/equipment/akedbWeaponDefinitions.ts`；
  `sharedEquipmentDefinitions.ts` 把正式定义与仍在过渡期的旧目录适配结果汇总，
  `gameDataRepository.ts` 再注册为编辑器和模拟的默认查询源。项目级自定义武器模板保存在
  `definitionLibrary.weapons`，轨道实例只保存 `weaponSlug`、等级、调校/潜能和词条等级；三者不是
  同一层数据。武器展示资源位于 `public/weapons/<type>/`。
- 下一阶段不要优先实现只影响己方承伤的 8 条 `protection`。先处理会改变对敌结果的 12 条条件
  属性/伤害效果，以及按技能范围的 2 条连携冷却缩减和 1 条处决失衡增益。任何正式装备仍需
  `WeaponBasic/EquipSuit + SkillPatch + SkillData/BuffData + 真实生产模拟` 闭环；候选审计的旧目录
  文本与结构只能用于定位，不能单独升级为正式游戏规则。

### 2026-08-23：Next 命中伤害详情按旧版规格重接

- `TimelineHitDetailDialog` 已以旧版 `HitDamageDetailDialog.vue` 为唯一 UI 规格，恢复 420px
  Element Plus 对话框、上下文/结果/基础/倍率四段结构、期望/暴击/非暴击结果、基础攻击与技能倍率、
  以及旧版同款表格、字号、颜色和强制暴击页脚。此前 Next 自行增加的技能副标题、随机实际伤害、
  剩余生命和元素效果区已移除。
- 运行时 `DamageApplied` 回执现冻结本次公式已经使用的攻击、基础值、技能倍率、伤害倍率、原始暴击率
  与暴伤、期望/暴击/非暴击伤害、防御、抗性及承伤相关倍率；UI 只投影这些事实，不从最终伤害反推规则。
  当前回执没有旧版的攻击来源明细和逐来源倍率列表，因此攻击展开箭头与来源 tooltip 暂不显示，不能猜造。
- 强制暴击不是弹窗本地假开关：`SkillCastDocument.simulationInputs.forcedCriticalStepKeys` 按稳定 damage
  step key 保存，编译后只覆盖该命中的实际暴击判定并重新模拟；原始暴击率仍用于期望伤害展示。真实页面
  验证弧光终结技首个命中由 `1215 电磁` 变为 `1822! 电磁`，弹窗同步显示旧版强制暴击标题。
- 门禁：`type-check:next` 通过，Next Vitest 202 文件 1463/1463；`tmp/` 保持未跟踪且不纳入提交。

### 2026-08-23：Next 普通 Buff 生命周期进入时间轴

- 标准战斗环境现为敌人和干员的普通 Buff 记录 `BuffApplied` / `BuffFinished` 回执，稳定携带
  `targetId + buffId + instanceId`、层数以及原生 `iconId/iconPath/visible`。同 ID 多实例和叠层刷新
  不再靠名称猜配结束点；`childPresentations` 以独立的展示开始/结束事实保留，不会丢掉关键词
  Buff 的多个原生图标。
- 新投影 `buffTimelineViz` 只从回执生成生命周期段，并按不重叠区间做旧版紧凑分行。无原生展示
  身份的内部机制 Buff 和显式 `visible: false` 条目不污染界面；这只是展示过滤，不改变模拟状态。
- 干员 Buff 已按旧版 `TimelineBuffLayer` 的 18px 图标、层数角标、2px 间隔和 45 度条纹持续条接到
  各自技能轨下方；敌人普通 Buff 接入底部敌人状态行，与已有元素附着、爆发和反应标记共用时间轴
  坐标，并在冲突时纵向分行。
- 下一步应在包含多个可见 Buff 的正式干员/装备生产场景中继续做视觉回归，并补齐旧版宽松排布模式
  与超出两行时的轨道动态高度；不得为了填满 UI 显示没有原生 presentation 的内部 Buff。

### 2026-08-23：元素反应持续时间进入敌人状态轴

- `ElementalReactionApplied` 不再只投影为瞬时图标。敌人状态轴现在依据回执中的
  `durationSeconds` 生成反应持续段；重复施加会在施加帧关闭旧段并刷新持续时间，成功消费则在消费帧
  提前结束。这里只做固定 30 FPS 回执时间换算，不增补或猜测元素反应规则。
- 佩丽卡连携的正式生产回归确认导电回执持续 5 秒，时间轴段因此覆盖精确 150 帧。反应段与元素附着段
  共用紧凑分行，持续图标取正式反应资源，施加点不再重复绘制第二枚图标；消费与元素爆发仍保留瞬时标记。
- 定向回归覆盖自然到期、刷新和提前消费，并由佩丽卡正式技能定义贯通生成、模拟回执和投影。`tmp/`
  继续保持未跟踪且不得提交。

### 2026-08-23：帧 0 Buff 初始化与战斗环境绑定顺序

- 标准战斗环境此前只在首个技能执行器创建时绑定时钟与回执；没有放置技能块的干员轨不会经过该路径，
  庄方宜的常驻被动或潜能初始化因此会在帧 0 施加 Buff 时错误报告“environment was bound to a battle”。
- 装配根现在于任何养成初始化和常驻被动之前显式绑定唯一敌人、时钟、资源与回执，并接回绑定后才可创建的
  敌人生命推进器。干员 Buff runtime 创建时也同步登记静态面板和满血账本，避免开局事件依赖首个技能。
- 生产回归使用满潜庄方宜、零技能块、`endFrame=0`，确认开局被动检查剑 Buff、潜能 1 与潜能 5 Buff
  全部在帧 0 进入正式回执；修复是通用装配阶段顺序，不含庄方宜运行时特判。

### 2026-08-23：Buff 后代伤害回归技能块命中点

- 庄方宜普通战技原本已经通过 `trigger_sword -> sword_triggerd` Buff 链造成两次伤害，但技能块命中投影
  只遍历技能与能力实体子技能定义，没有遍历可达 Buff 行为；对应 `DamageApplied` 虽有 `castId` 和
  `stepKey`，却没有 `hitId`，因此 UI 在有模拟结果时按事实过滤掉了全部 hit。
- 玩家伤害执行器现在对“有来源 castId 且有稳定 step key、但编译期未内联绑定 hitId”的伤害统一派生
  同一稳定命中身份。时间轴定义投影递归遍历技能施加的 Buff、Buff 后代、定时序列、生命周期及事件响应；
  Buff 命中在无模拟时保持条件候选，只有真实回执发生后才显示，并用访问集合关闭循环引用。
- 生产回归不再只断言庄方宜战技“有伤害”，还贯通默认仓库、正式模拟、编辑器视图模型、实际命中帧和
  hit 详情投影，确认两个可见命中分别位于第 25、28 帧。实现是通用 Buff 因果链，不含角色特判。

### 2026-08-24：单件装备正式定义投影闭合

- 当前开发分支为 `refactor/common-game-data`。公共 Attribute Modifier 编译器与单件装备场景投影已经
  接入 Next 正式装备契约：基础防御从同一原生属性程序提升为 `GearDefinition.baseDefense`，其余修正
  按原生 `attrIndex` 分组并保留逐精锻档数组；基础防御若随精锻变化会明确阻塞，不能静默取首档。
- `Beyond.GEnums.PartType` 已从当前客户端 `global-metadata.dat`（SHA-256
  `90c58e26e87c7227a85dda3fedf6ce5ed0b06dc1f76e0abbe75ab20750adf97e`）字段默认值表恢复：
  `Body=0`、`Hand=1`、`EDC=2`、`EndNum=3`、`Head=4`、`Ring=5`。combat-spec 提交 `4953178`
  固定了原生枚举、TableCfg 严格适配和测试；Endaxis 只把前三者映射为 `armor/gloves/accessory`，
  其余原生成员保留身份但不擅自扩展产品槽位。
- 装备 DSL 新增 `damageScale`，直接保存已确认的原生伤害倍率属性身份。技能分类、元素和
  `DamageToBrokenUnitIncrease` 因此统一进入伤害快照与现有七区间映射；不再把“对失衡敌人增伤”
  硬塞成元素/技能筛选的 `damageBonus`。
- 1.4.4 全量正式组装为 243/243 成功、0 blocked：73 件护甲、65 件手套、105 件配件，共 672 条
  可见词条、721 个正式修正，其中 448 个四维属性、108 个面板属性、155 个伤害倍率、10 个治疗输出修正。
  48 条只影响玩家承伤的原生修正按既定木桩场景记录为 `scenario-omitted`，不混作来源缺失或已删除。
- 固定版本比桌面旧 AKEDatabase 工作树多 23 件五陵装备；其中 `Main/Sub + Level + BaseAddition`
  已由公共目标解析器和公式槽语义确认为主/副属性平值，不能沿用此前只覆盖 `BaseMultiplier` 百分比的窄投影。
- 当前门禁：`type-check:game-data`、`type-check:next` 通过；游戏数据编译器 30 文件 151/151，Next
  204 文件 1484/1484。下一步应把这 243 份结构化定义接入确定性渲染、正式仓库注册和生产模拟扫表，
  然后以同一公共被动编译链组装 23 个套装定义；`tmp/` 继续只作证据缓存且不得提交。
- 单件装备确定性渲染的纯文件计划已经建立：按原生 `suitID` 分目录、每件装备单独生成 TypeScript，
  无套装项进入 `_standalone`，并生成唯一索引与结构化审计。固定版本实跑得到 243 个定义文件、1 个
  索引和 1 个审计文件，共 366670 字节；反转输入顺序输出不变，重复身份、危险路径和任意 blocked
  都会失败关闭。尚未接实际写盘和默认仓库注册，因为旧项目 slug 到原生装备 ID 的关联迁移必须先
  设计为稳定别名，不能为了批量上线让轴上已有装备实例断链。

### 2026-08-25：首个真实套装进入正式模拟链

- `suit_atk01` 已从 SkillPatch、SkillData 与 BuffData 生成并替换旧套装定义。公共 Buff 来源 IR 新增
  严格生命周期、叠层、图标、标签、属性修正与完整已知动作入口；引用闭包仍保留宽松未跟踪叶子，
  两种用途不再混用。
- SkillPatch 物化的 `dmg_up=0.24`、`atk_up=0.05`、`duration=15` 通过帧 0 根安装动作传入，不能使用
  BuffData 的零默认值。CardSkill 三类技能 24% 增伤、`OnBeforeCastSkill` 三分支和动态
  `Atk/BaseMultiplier` 均进入正式贡献，攻击 Buff 的 `icon_battle_buff_atk_up` 完整保留。
- `buff_common_vfx_char_atk_up` 的非空 stack effect 已结构化证明为专用 `EffectAction` 表现槽；粒子
  在木桩数值模拟中记录为 `scenario-omitted`。残留 `OnAfterKillEntity` Toggle 链按“唯一敌人死亡即
  模拟结束”的既定边界显式省略，均不是按 Buff 名称猜测。
- 原生 `suit_atk01` 取代 `aburreys-legacy`，旧 slug 反向 alias 到新定义；其余未转换原生套装仍指向
  旧模板。横向投影随后确认 `suit_combo_cd01` 无需新增规则并一并上线：连携冷却时长乘数 0.85、
  连携施放前最多两层且每层提升战技/连携/终结技伤害的限时 Buff，以及图标均进入正式定义。
  该 checkpoint 当时已生成 2/23 套；后续服务端黑板读集与固定满血 Toggle 归约已把当前进度推进到
  10/23。基础 `OnOutputBuff` 标签分支已经闭合；剩余类别为事件 Buff 层数条件、暴击事件、Aura 和
  少量公共条件/伤害动作。`tmp/` 继续不提交。

### 2026-08-25：AKEDB 主源与本机 VFS fallback 协议

- Endaxis 的 TypeScript 下载器已取代旧 Python 脚本。所需 14 张 TableCfg 与 SkillData/BuffData
  集合只由 `tools/game-data-compiler/akedb-sources.json` 声明；默认输出改到 Endaxis 自己的
  `tmp/game-data-sources`。combat-spec 不再被当作下载目标或输入提供者，只保留反编译证据职责。
- 单资源优先级固定为 AKEDB CDN -> vfs-index-browser。fallback 可以是本地同构目录，也可以是
  `/api/akedb-compatible` HTTP 基址；表、集合 manifest 和集合文件使用同一逻辑路径。集合清单合并后，
  AKEDB 重名文件优先，只有本机新资源仍可进入闭包。AKEDB manifest 尚未登记请求版本时，该版本
  TableCfg 可直接按清单版本走 VFS，不要求 VFS 伪造总 manifest。输出 provenance 逐文件标注实际来源。
- vfs-index-browser 新增精确兼容接口：TableCfg 从 Effective
  `Table/Data/TableCfg/*.bytes` 经 SparkBuffer 解码；SkillData/BuffData 从 Effective JsonData 经
  MemoryPack schema 解码，只有消费全部字节才返回数据。接口不做模糊搜索，不从 combat-spec 或
  Endaxis 清单推导资源范围。
- 验证：真实 `1.4.4@9433094-12` 14/14 TableCfg 均由 AKEDB 下载；游戏数据编译器 52 文件
  220/220，vfs-index-browser 243/243，游戏数据编译器类型检查通过。真实下载产生的 `tmp/` 仍不得提交。

### 2026-08-25：Projectile / AbilityEntity 引用闭包资源接入

- 原先“23 项阻塞全部是模板缺失”的首阻塞统计已作废。新版闭包会递归懒加载投射物命中等子
  SkillData，不能用每名干员遇到的第一个错误代替完整依赖计划。当前 30 名 Operator 的精确计划是
  120 个 Projectile 模板、53 个 AbilityEntity 模板。
- 计划器曾把 Arcane/Camille 的 `buff_wpn_passive_spirit_01` 报为缺失。`combat-spec` 的
  `passive-skill-dispatch.md` 已证明这三处定义都是 `passiveSkillType=AddBuff`，原生工厂不会构造
  `ToggleBuffPassiveSkill`，残留 `toggleBuffs` 不参与运行时。公共被动解析和引用图现只在
  `Passive + ToggleBuff` 时跟随该表，精确计划由此达到 `unresolvedDefinitions=0`；不能通过补一个
  猜造 Buff 解决假缺口。
- vfs-index-browser 新增 `ProjectileData` 与 `AbilityEntityData` 的 AKEDB 兼容集合端点。
  Projectile 复用既有精确 manifest/bundle/`ProjectileComponentData` 解码链；AbilityEntity 将旧提取
  脚本中已验证的 raw MonoBehaviour 前缀解析迁入服务，按根 RID 和完整托管类型三元组定位，不依赖
  托管引用记录顺序。两类清单都只枚举 canonical Unity asset 目录的直接子项。
- Endaxis `akedb-sources.json` 新增 Operator 闭包集合声明。基础集合不会在 AKEDB 已有清单时合并
  VFS 的所有新文件；独立 `download:game-data:operator-closure` 命令递归补齐实际子 Skill/Buff，随后
  按精确 `projectileId` / `abilityEntityId` 批量下载最小模板闭包。资源需求与扫描字段由 Endaxis
  自己维护，不取决于 combat-spec。
- Operator 来源审计已接受 ProjectileData/AbilityEntityData 目录并把严格身份节点接入公共定义图。
  AbilityEntity 已从仅校验 `gameId` 改为严格读取当前逻辑前缀的全部字段，动态寿命与动态叠层黑板、
  born tags、原生生命周期值和解码边界均保留。台式机实际拉取的 52/53 个模板全部通过新 TS 来源
  解析；唯一未取得者仍是已有证据明确缺失的
  `abilityentity_chr_0035_liino_ult_skill_projhit`。这些事实不宣称未知组件行为已可模拟。
- AbilityEntity 单文件读取已提升为公共模板目录：按 `gameId` 确定性排序并索引，文件键与内部身份
  不一致立即失败；born tags 只建立精确倒排索引，父子标签匹配必须等待同版本 GameplayTag 路径，
  不从裸 CRC-32 ID 猜层级。当前 52 份真实模板形成 35 个精确 born tag；其中 2 份使用动态寿命键，
  1 份同时使用动态最大叠层键，均保留在源 IR 而未压扁成静态正式定义。
- GameplayTag 的 CRC-32 与父子路径查询已从 Next 运行时抽到 `src/shared/gameplayTags.ts`；运行时保留
  原导入路径转发，新游戏数据编译器直接复用同一个实现。AbilityEntity born-tag 查询因此可按同版本
  路径目录解析父标签；未知裸 ID 仍只能精确匹配，不存在 Python/TS 两套算法漂移。
- 旧 `generate_gameplay_tag_catalog.py` 已由统一 TS 工具替代。新 source 严格读取
  `GameplayTagConfig._keyData` 的声明数量、顺序和重复项，compiler 计算 CRC 并检查冲突，renderer
  固定来源 SHA-256 且支持 `--check`。从台式机取得的已知 dump 哈希仍为
  `3758bb1f...019cf8`，真实 652 条路径生成与现有正式模块除生成命令注释外逐字一致；随后正式模块
  已由新命令刷新并通过 check。dump 和临时对照产物只在 `tmp/`。
- 下载 provenance 现逐文件记录 provider、实际 URL/路径、字节数和 SHA-256。VFS fallback 尚不能声明
  对应哪个服务端构建，因此这里只保证同一输入可识别和复核，不把“当前 VFS”伪装成指定 TableCfg
  版本。当前 52 份与已提交 1.4.4 证据的同 ID 逻辑字段逐项一致；旧证据另有 7 份不属于当前精确
  Operator 计划，不能据此扩张下载闭包。
- 当前外部资产阻塞已精确量化：120/120 个 Operator Projectile 请求在台式机 VFS 返回 422，说明
  manifest 身份存在但 `ProjectileComponentData` 尚未成功解码；不能退回按 ID 或旧版技能行为伪造
  模板。该解码问题由 VFS 产品化分支处理，本工作树继续围绕取得后的严格转换接口推进。
- 回归：Endaxis 游戏数据 TypeScript 类型检查通过，全量游戏数据 Vitest `56` 个文件、`234/234`；
  52 份真实 AbilityEntity JSON 全部通过来源解析。台式机的正确连接仍是
  `Admin@100.64.0.64`；临时 VFS 服务已在审计后关闭。所有真实下载仍位于
  `tmp/game-data-sources`，不得提交。

### 2026-08-25：梨诺与全干员来源闭包收口

- 30 名干员现在都有显式产品 `gameId`，游戏数据编译器不再从 slug 或展示身份反推产品主键。完整
  Operator 来源闭包为 ProjectileData 120/120、AbilityEntityData 53/53，未解析定义为 0；30/30
  来源审计均为 supported。
- 台式机 VFS 已恢复此前缺失的
  `abilityentity_chr_0035_liino_ult_skill_projhit`，正式能力实体证据目录现有 60 个逻辑模板。
  梨诺由 audit 提升为正式生成产物并注册到默认仓库：12 个原生技能来源投影为 11 个可见技能组，
  技能替换关系继续使用稳定 skill key，不把替换态伪装成额外技能槽。
- 梨诺终结技的周期 Buff 会发射伤害与治疗两类投射物。新证据文件保存 ProjectileData 解码哈希及
  `TargetFilter`：伤害波为自动敌对阵营目标，治疗波为 Good Character。对象类型与阵营掩码语义来自
  combat-spec 已有的 `TargetFilter`/`TargetResolution` 复刻；生成器据此把同一子 SkillData 的
  `CheckObjectTypeMatch` 分支静态投影到唯一敌人或施法者。这里没有按 projectile ID 名称猜目标，
  也不声称已模拟轨迹、碰撞或未知尾部组件。
- Buff 事件投射物现在保留可编译的根辅助 Buff，并把技能伤害标签传入递归 Buff 编译。Buff 生命周期
  中 `Owner` 治疗按原生目标解析忽略无关 targetGroupKey；动画结束的一次性动作统一生成为 sequence，
  避免合法单步骤在正式 TS 类型中失配。
- 当前养成审计为天赋 59/60、潜能 150/150，已转换项全部 simulation-ready。剩余一项是 Avywenna
  天赋 1 的审计编译器分类缺口；这不阻止干员正式定义，但必须继续保留，不能用 30/30 正式生成掩盖。
- 梨诺正式终结技生产场景已贯通：同一真实时间轴产生对唯一敌人的 `DamageApplied`，并在干员满血时
  产生 `HealingApplied`。原生 `HealTakenIncrease` 现映射到已有 `healTakenIncrease` 属性快照；动态
  priority 只在确实参与排序的 Stack/HighPriority 类型保留，若资源既未声明默认键、调用点也未传值，
  则显式物化同一 StackingSettings 的字面 priority，不虚构外部黑板来源。
- “多段放置链 + 槽位替换”仍没有被半吊子合并：未放置该组时不再阻塞同一干员的终结技等无关技能；
  用户实际放置该组时仍原地报错，等待技能替换整体设计。庄方宜等单入口替换组保持原行为。
- 最终门禁通过：Python 478/478、游戏数据 58 文件 245/245、Next 208 文件 1519/1519、两套类型检查
  及全量生成 `--check`。`tmp/` 只保存下载证据，不得提交。
- 下一步按既定顺序推进剩余 13/23 套装与全武器转换；同时单独设计多段链的技能替换模型。遇到新机制
  仍先在 combat-spec 依据解包/反编译证据完善，再进入 Endaxis。

### 2026-08-26：技力套 Skill/Gain 事件与全队增伤闭环

- `suit_atb01` 已进入正式生成，套装覆盖提升为 18/23。静态部分保留连携冷却时间乘数 0.85；根
  Buff 监听原生 `OnObtainAtb`，且只接受首个严格条件
  `CheckObtainAtbType(Skill, Gain)`。编译后复用已有
  `spGained(source=skill, gainKind=gain)` 事实，不新增第二套 ATB/技力事件账本。
- 原生无过滤 `CharacterTeamFinder` 写入 `Context/teammate` 后再施加 Buff；投影只在 finder、空
  validator/post-processor、ActionOwner 中心与 owner 全部精确匹配时归约为 `target: party`。任一
  选择器字段漂移仍失败关闭，不能只按目标组名字猜“全队”。
- 子 Buff 保留 15 秒寿命、攻击提升图标和普通伤害乘区 +16%。公共 Buff 来源 IR 首次结构化无条件
  `damageModifier -> DamageScaleProcessor(Attacker, NormalCalcZone)`；非空条件、未知 side/zone 或
  其他 processor 仍阻塞，未把任意 damageModifier 粗略当成总增伤。
- Buff 生命周期新增编译后语义响应 `skillSpGained`，装配层实际注册为穿戴者自身的
  `spGained/skill/gain`。定向装配测试确认真实技能回能会同时触发养成事件和 Buff 响应；普通攻击、
  返还及其他来源不会通过该注册筛选。
- 当前剩余 5/23：`suit_atk02/AuraAction`、`suit_attri01/SkillAffixAction`、
  `suit_expend_spell01` 的动态 Buff 上下文计数链、`suit_usp01/OnEnterFight` 后续资源链、
  `suit_usp02` 的目标/来源及 damageModifier。下一步继续优先对敌输出确定且证据完整者。
- 门禁：游戏数据 58 文件 251/251、Next 208 文件 1525/1525，`type-check:game-data` 与
  `type-check:next` 均通过；正式生成审计为 18 套、37 个 Buff 定义。`tmp/` 仍仅作证据输入，不提交。

### 2026-08-26：能力实体 Buff 宿主身份进入事件目标解析

- Buff 生命周期上下文中的 `buffOwnerId` 可能是活动逻辑能力实体的运行时身份，而不只会是敌人或
  干员。装配层现严格识别 `ability-entity:<instanceId>`，校验实例仍活跃后复用该实例的共享黑板与
  惰性 Buff 容器；未知、已结束或格式不合法的身份仍原地失败。
- 伊冯连携由此完成实体 Buff 的周期、结束 Buff、冰冻与末段伤害链，基础审计观察到第 142 帧
  `DamageApplied=781`。全技能基线更新为 30 名干员、301 个技能逐项放置，290 项成功、11 项精确
  预期失败；修复项已从清单删除，避免预期失败掩盖回归。
- 聚焦装配回归额外验证能力实体 Buff 生命周期通过 `buffOwner` 再施加子 Buff，保证该身份解析不是
  伊冯专用分支。下一步继续处理有明确生命周期证据、会影响木桩伤害结果的剩余失败；跨阶段的
  Ardelia `Sheep` 与 Yvonne `robots` 仍等待统一多阶段技能模型，不按名字伪造上下文。

### 2026-08-26：零时长实体停滞按原生有效性窗口闭环

- 雪绒终结技的公共冻结链不是漏传持续时间：`buff_common_cryst_cryst_frozen_triggered` 只接收原生
  `extra_duration=0`，其后代 `buff_common_do_frozen` 因而以 `duration=0` 启动两端均为零倍率的实体
  时间膨胀。不能擅自把上层冰霜 Buff 的 5 秒寿命复制给它。
- combat-spec `docs/time-dilation.md` 已按 1.4.4 `EntityTimeDilationInst.isValid` 证据补充零时长样本：
  零值不是无限期，也不在入口拒绝；实例先注册并执行 `OnTick(0)`，更新越过 `0.00001` 容差后失效，
  再由下一次管理器 Tick 回收。复刻库聚焦测试 28/28 通过。
- Next 运行时现允许有限零时长，并对零时长曲线明确采样 `progress=0`；雪绒终结技完整模拟通过。
  全技能基线更新为 291/301 成功、10 项精确失败。

### 2026-08-26：李枫基础被动补齐连携状态来源

- `EntityBB_isCombo` 不是终结技的释放参数，也不应按原生缺键回退规则直接补零。原始
  `chr_0015_lifeng_passive` 在初始化时施加 `buff_chr_0015_lifeng_passive`；该 Buff 的
  `OnAddedBuff` 把实体黑板置 1，`OnSkillEnd` 再归零，恰好是终结技条件分支的完整写入来源。
- 正式 manifest 现将该技能登记为基础被动，复用统一被动初始化、Buff 事件和实体黑板运行链。
  李枫终结技独立放置可完整模拟，并产生三段能力实体伤害；没有为该干员或该键增加运行时特判。
- 全技能基线更新为 292/301 成功、9 项精确失败。其余首次命中计数和连携入口参数继续分别取证，
  不把所有缺失的 `EntityBB_*` 一律解释为零。

### 2026-08-26：萤石角色模板连携入口闭环

- 从本地 1.4.4 VFS 精确导出 `data_chr_0022_bounda.asset` 的原始 MonoBehaviour，并沿
  `CharacterTemplateData -> AbilitySystemData -> SkillDataBundle` 恢复两条事件值 121 的连携条件。
  两条规则分别检查敌人寒冷 Tag `1570888476` / 自然 Tag `-1411846745` 的 Buff 层数至少为 1，
  再由元素掩码 `0x04/0x08` 写入 `EntityBB_combo_index=2/3`。
- 同版本安塔尔模板的同事件、`0x0f` 元素掩码与既有 `0..3` 分支映射提供交叉证据；没有从萤石技能
  名称反推枚举。正式 manifest 已加入角色级注册和逐规则候选黑板。时间轴无合法窗口时继续产生
  `ComboWindowUnavailableAtStart`，同时以 `-1` 哨兵跳过两个元素附着分支，公共自然伤害仍执行。
- 萤石连携独立放置现可完整模拟，全技能基线提升为 293/301 成功、8 项精确失败。剩余缺键不能
  依此统一补零：Estella/Tangtang 是首次命中生命周期，Rossi 是多阶段 QTE 状态，证据边界不同。

### 2026-08-25：套装正式生成恢复至 15/23

- 新增可重复的正式套装生成入口：`scripts/generate_next_equipment/formal_suit_identities.json` 只登记
  已闭环身份，`generate_formal_suit_definitions.ts` 从固定 1.4.4 TableCfg、SkillData、BuffData 对每套
  单独严格编译，再原子替换 `generated-gear-sets`。本轮登记 `suit_generaltype` 与 `suit_heal01`，正式
  覆盖达到 15/23；未登记的 8 套继续保留真实阻塞，不会被同批忽略或自动生成。
- 治疗套完整保留 20% 输出治疗增幅，以及满血也会触发的 `OnOutputHeal`。原生
  `CheckOverHeal` 与 `NotNextCheckAction` 投影为过量/非过量互斥分支，Buff 施加目标是治疗事件的
  `eventTarget`；两支分别写入优先级 1/0，并保留 10 秒寿命、防御图标与 HighPriority 叠加。
- `PlaySoundAction` 依 combat-spec `docs/presentation-actions.md` 的反编译证据做全字段严格解析；无渲染
  后端只产生精确路径的 `scenario-omitted`。声音和粒子不参与数值，但 Buff 图标与时间轴寿命仍进入
  正式定义，不能以“表现”名义一并丢弃。
- 再生成暴露并修复 `BuffCount` 语义漂移：原生条件和保存动作都要求实例数，不能累计增强层数。
  `eventTargetBuffCountCompare` 与 `readBuffStackCount.countType='instance'` 现共用实例计数接口；碎甲套
  的 `phy_dmg_up_final` 因此按真实 Buff 实例数计算。
- 当前剩余首阻塞：`suit_atb01/CheckObtainAtbType`、`suit_atk02/AuraAction`、
  `suit_attri01/SkillAffixAction`、`suit_burst01` 与 `suit_expend_spell01/CheckBuffIdInContextAdvanced`、
  `suit_criti01/OnOutputCriticalDamage + OnBuffEnhanceChanged`、`suit_usp01/OnEnterFight`、
  `suit_usp02` 的目标/来源及 damageModifier。下一步优先处理会改变对敌输出者，再处理木桩场景中
  不可达的自身承伤收益。
- 回归通过：游戏数据 247/247、Next 1521/1521、`type-check:game-data` 与 `type-check:next`。根
  `type-check` 的失败均来自旧版 `src/` 既有错误，本轮未修改旧版。`tmp/` 仍不提交。

### 2026-08-26：武器 Buff 运行闭包开始横向收口

- 武器静态定义审计已达 77/77，77 把武器与 248 件装备的基础攻击生产模拟门禁合计 326/326。
  91 个实际可达 Buff 引用均有 1.4.4 定义；`buff_wpn_passive_spirit_01` 经
  `ToggleBuffPassiveSkill.DoEnable` 机器码确认属于不会被该被动读取的残留 `buffs` 字段，不伪造定义。
- 公共 Buff 编译器新增来源施法类型、通用 Context 目标组的空组/合并/去重/包含、伤害类型掩码，
  以及 `EnemyAll + Anti` 的 GlobalAura 投影。来源技能条件读取 Buff 保存的施法身份，不读取当前
  触发事件；当前 11 个真实样本的攻击细分掩码均为 `All`，未来出现无法区分的下落起跳/落地掩码时
  必须失败关闭。
- combat-spec 已先后提交目标集合包含、DamageType 位掩码与敌方 GlobalAura 的反编译规格和运行时。
  GlobalAura 的 Sphere 半径不进入零空间查找，但目标生命周期、Buff 来源、黑板传值和施法身份继承
  均保留。
- `SaveBuffLifeTime` 与配对的 `SetBuffDurationAction` 已按 1.4.4 机器码先在 combat-spec 恢复，再接入
  Next 公共来源 IR、正式步骤与 Buff 生命周期上下文。前者只读取 Environment 查询中有限时长 Buff
  的当前剩余秒数，无匹配或无限时长写 `0`；后者保留 Assign/Add/Multiply、负值钳零，并只开放真实
  武器样本使用的 `isFinishedEarly=false`。这使母 Buff 的剩余时间能传给可视图标 Buff，没有丢弃图标
  生命周期数据。
- 武器闭包审计现在能完整列账而不再首错中断：91 个引用 Buff 展开为 107 个运行时节点，当前
  首轮为 **75/107 可编译、4 个木桩模型明确省略**。随后伤害修正层复用公共条件接通
  `damageTypeMask / damageType / damageDecorateMask / buffStack / entityTag / poise`，最新达到
  **89/107 可编译、4 个木桩省略**。剩余阻塞集中在能力事件、生命周期选项、Deck 属性/定时标记和
  少量载荷族；护盾、韧性修正载荷和离战事件继续后置。

### 2026-08-26：武器输出事件与构筑分支继续收口

- `CompareDeckAttr(Wisd >= Will)` 已按构筑完成时的静态四维快照进入公共 Buff 条件，不读取战斗中
  Modifier 改写后的实时属性。`wpn_funnel_0016` 因而能在相等时选择智识分支、否则选择意志分支；
  没有把两种形态保存成项目状态。
- `CreateBuffAction.asChildBuff` 现保留父子寿命：子实例用精确句柄登记到当前 Buff，父 Buff 正式结束
  时在自身 Modifier 注销前结束全部子实例；`autoFinishByAction` 仍独立绑定动作域。四二式·肃阵的
  增伤子 Buff 和剩余时间图标因此都没有被当成纯表现数据丢弃。
- 元素附着已有的 before/after 输出事件、元素爆发触发点和物理异常语义事实已接入 Buff 响应。
  当前事件来源施法与监听 Buff 自己的来源施法分开保存，`CheckSkillCastId` 比较两者，
  `CheckOriginSkillType` 读取触发事件来源，避免恒真或误读母 Buff。物理异常 after 响应复用
  `physicalInflictionApplied`，统一覆盖浮空、击倒、破防和击溃。
- 公共投影同步补齐严格的元素类型条件、Context 实例计数并写回 `storeKey`、纯黑板二元计算，以及
  `CharacterTeamFinder` 的全队/排除 owner 两种固定小队折叠。`buff_wpn_funnel_0006` 与
  `buff_wpn_funnel_0011` 的“累计本次不同目标数并给队伍加成”链已完整通过审计。
- 最新武器闭包为 **96/107 可编译、4 个木桩省略**。剩余 7 项为：3 个后置的护盾/韧性/自疗载荷，
  `buff_wpn_sword_0022_layer` 的离战事件，`buff_wpn_sword_0026_celebration` 的定时标记治疗门槛，
  以及 `buff_wpn_pistol_0005_inaura`、`buff_wpn_sword_0010_inaura` 的 `OnBeforeAddedBuff` 响应。
  下一轮优先完成后二者和定时标记；防御、自疗与离战继续按木桩伤害相关性后置，不为凑数字扩模。
