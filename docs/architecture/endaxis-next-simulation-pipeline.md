# Endaxis Next 模拟流水线、活动机制与性能设计

## 1. 目标与事实来源

Endaxis Next 的模拟主线以本地 `combat-spec` 复刻库及其反编译证据为事实来源，不以旧版 Endaxis 的实现细节为标准。旧版只用于枚举用户功能、迁移存档和建立对照样本。

设计目标是：同一份用户输入能够稳定编译、完整模拟并生成多种视图，同时让每一层的数据所有权明确，支持替换 UI、增加活动机制和独立优化性能。

```text
Project intent
  -> catalog resolution
  -> mechanic resolution
  -> combat program compilation
  -> combat kernel
  -> trace / receipts
  -> independent projections
  -> view models
  -> Vue rendering + i18n + theme
```

## 2. 各层数据所有权

### 2.1 Project document

项目文档只保存用户意图和用户拥有的可编辑值：配装、敌人输入、技能放置、机制选择、连接和编辑器布局。它不保存面板结果、运行时 Buff、曲线、警告、日志或翻译后的文本。

活动机制使用 `ScenarioMechanicsDocument` 表达。每条选择只包含用户实体 ID、目录机制 ID、启用状态和原始参数。机制的规则、描述和来源版本属于目录，不复制进存档。

`GlobalConfigDocument` 只保存用户直接编辑的全局数值修正，不再兼任活动预设容器。

### 2.2 Catalog

目录是按游戏数据版本发布的只读事实集合，包括干员、武器、装备、敌人和机制定义。目录对象不可被运行时修改，并携带显式 revision。

`GameDataRepository` 是 core 唯一允许读取目录的端口。旧版数据结构只能由 adapter 读取，不能渗入 resolver、compiler 或 simulator。

### 2.3 Resolved scenario

Resolver 把目录默认值、build、用户编辑值、继承来源和机制选择解析成完整场景。该产物不再包含 `edited` 等编辑器归属信息，也不包含可执行运行时状态。

### 2.4 Combat program

Compiler 把完整场景转换成离散帧、确定顺序的战斗程序。程序使用 Endaxis 自己的领域名称，但执行层级和行为必须有 `combat-spec` 或反编译证据。

活动机制不能注入任意 JavaScript 回调。adapter 只能把已知游戏数据编译成内核支持的通用原语。
当前第一版可执行协议只开放证据和执行上下文均已明确的两类贡献：

- 语义战斗事件触发的有优先级 action sequence；
- 已恢复 GameLevelEvent 触发的同步 action sequence。

初始化 Buff、全局 Buff 和场景数据覆盖尚未开放。它们需要先恢复执行主体、来源、目标和跨机制合并顺序，不能用任意对象 patch 代替。原语会逐项随证据加入。

`MechanicAdapterRegistry` 按机制 family 注册数据源 adapter；编译器先验证目录身份和参数，再补齐目录默认参数并生成带 selection provenance 的贡献。每个启用 selection 同时记录机制定义 revision 与 adapter revision，供 CombatProgram revision 覆盖完整事实来源。运行时还会拒绝函数、非有限数、循环对象和其他非数据输出。

AbilityEvent 数据动作按已确认规则使用优先级降序；机制协议使用无筛选的语义事件身份，标签、来源等筛选必须编译为 sequence 条件，不能把干员 DSL 的 `CombatEventTrigger` 当作事件总线键。同事件同优先级的原生仲裁尚未恢复，因此编译器直接拒绝冲突，要求 adapter 按原始数据顺序合并成一个 sequence。GameLevelEvent 的跨机制注册顺序同样尚未恢复，同一事件暂时只允许一个贡献。

### 2.5 Combat kernel

内核负责离散帧推进、同帧 action 顺序、资源、状态、事件和伤害计算。它不认识“危机合约”“影拓丰碑”等产品名称，只执行编译后的通用战斗程序。

运行时可变状态只存在于一次模拟任务内部。不得反向修改项目文档、目录定义或编译产物。

技能运行时只在数据已可靠恢复时，以编译后的 `naturalEndFrame` 驱动自然结束；编辑器使用的
`durationFrames` 可能来自输入衔接边界或人工校准，不能混用。自然结束末帧必须先完成该帧的
成本检查和 TimelineAction，再写入技能结束事实；可打断边界同样属于另一项技能配置。
该顺序对应原生 `m_durationTimer -> Ability.OnTick -> CastEnd` 主干。

玩家输入替换当前技能时，运行时先检查新技能自身资源，再按下落攻击旁路、技能优先级和
`interruptibleAfterFrame` 短路。允许后先登记新技能，再以 `castNextSkill` 中断旧技能，最后
开始新技能。原生允许接续技能包尚无 Next 数据入口，不得用技能块相邻关系静默代替。

资源操作按职责组合 executor。当前 `SkillResourceOperationExecutor` 只处理已闭环的普通战技全队回能：费用点记录非返还技力消耗，命中序列再读取显式队伍、全局本人/队友系数、目标回能倍率、上限、解锁和恢复许可。伤害、附着和条件必须交给其他显式 executor，未知 step 不会被当作成功的空操作。

玩家主动伤害公式使用独立纯函数。其输入是属性快照、伤害 modifier 和运行时扩展都已解析后的显式数值，输出保留暴击、防御、抗性、弱点/庇护及特殊伤害因子，并严格维持原生浮点乘算顺序。该函数不读取项目、目录、Buff 容器或随机数；这些状态的解析和随机样本生成属于上游 runtime adapter。生命值写入、承伤前后事件和失衡结算尚未接入时，不得把纯公式包装成“完整伤害执行器”。

### 2.6 Trace、receipt 与 projection

内核输出结构化事实记录。曲线、警告、战斗日志、伤害分析和时间轴状态条分别从同一事实记录投影，不维护第二套技力、冷却或状态账本。

每种 projection 独立、按需计算并独立缓存。语言和主题只影响最终 view model 或渲染，不触发 resolver、compiler 或 simulator。

## 3. 特殊活动扩展

### 3.1 影拓丰碑

本地 AKEDB 数据显示影拓丰碑由 Season Tower 相关表、关卡脚本、BuffData 和参数列表共同构成。`SeasonTowerDungeonTable.paramList` 中的值不能直接猜成战斗公式，必须继续追踪脚本或 Buff 对参数的消费方式。

因此适配流程应为：

```text
Season Tower tables + LevelScript + BuffData
  -> SeasonTower mechanic adapter
  -> validated mechanic definitions
  -> generic combat contributions
```

### 3.2 危机合约

现有研究显示危机合约效果可能来自全局 Buff、普通 BuffData、LevelScript action 或关卡信号。它与影拓丰碑共享机制目录和编译入口，但使用独立 adapter；内核不增加危机合约专用分支。

### 3.3 扩展约束

新增活动时必须满足：

1. 项目文档只增加机制选择，不复制整份活动数据；
2. adapter 对未知参数、未知 action 或无法解释的 Buff 明确报错；
3. 机制编译结果可单独生成摘要和 evidence receipt；
4. 同一机制 revision 与相同输入必须产生相同程序；
5. 活动 UI 只编辑参数，不直接操作模拟器状态。

## 4. 可缓存流水线

`SimulationPipeline` 使用 `VersionedArtifact<T>` 连接各阶段。缓存键由 stage ID、stage revision 和输入 artifact revision 组成，不对大对象执行 `JSON.stringify`，也不依赖对象引用偶然稳定。

当前基础能力包括：

- resolver、compiler、simulator 严格单向传递；
- 异步 stage 接口和 `AbortSignal`，便于迁移至 Worker；
- 仅缓存完整执行的结果，被取消或抛错的执行不入缓存；
- 有界 LRU，避免编辑过程中缓存无限增长；
- projection 延迟执行，且与模拟阶段分别缓存；
- stage revision 变化时只失效该阶段及其下游。

revision 是内容契约。stage 输出 revision 必须覆盖所有会影响输出的输入与规则版本；不能用时间戳，也不能漏掉目录或机制 revision。

## 5. 性能要求

性能不是 UI 完成后的补救工作，而是模块接口的验收条件。

### 5.1 结构性措施

- 目录定义和编译产物不可变，重复方案共享只读对象；
- 用户编辑只更新受影响场景的 revision；
- 面板、机制、技能和战斗程序分阶段增量失效；
- 内核使用整数帧和事件队列，不逐帧扫描全部技能与状态；
- TimelineAction 使用待启动游标和活跃集合，每帧只访问新启动与正在运行的动作；
- trace 支持按用途选择明细等级，普通时间轴不强制生成调试级记录；
- projection 只在对应面板可见或导出需要时计算；
- Vue/Pinia 不持有或深度监听内核运行时大对象；
- Worker 传递紧凑输入和结果，不往返传输目录全集；
- 所有缓存有容量上限，并可按项目关闭或清空。

### 5.2 基准验收

在入口切换前建立固定的短轴、长轴、多状态和多方案 fixture，在同一设备与同一构建模式下比较旧版。至少验证：

- 首次编译与模拟的中位数和高分位耗时均低于旧版；
- 单个技能移动后的增量重算明显快于全量重算；
- 仅切换分析视图、语言或主题不重新模拟；
- 连续编辑后内存保持有界，不随 revision 数量单调增长；
- 主线程长任务可被取消，编辑交互不等待后台旧任务完成。

在获得基线数据前不写虚假的毫秒承诺；基准脚本和输入 fixture 本身必须进入版本管理。

当前可执行 `npm run bench:next` 批量测量技能编译和 60 秒、1800 个稀疏动作的 TimelineAction 处理。短操作使用批量循环且显式消费输出，以降低计时器开销和 JavaScript 引擎消除无用工作的影响；结果用于同机回归，不作为跨设备性能承诺。旧版对比 fixture 尚未建立，因此目前只能说明 Next 自身趋势，不能宣称相对旧版的倍数。

## 6. 主题边界

Next 主题由语义 token 构成，例如 canvas、surface、text、border、accent、focus 和反馈色。`ThemeRegistry` 允许注册任意完整主题，并把 token 写成 CSS custom properties。

元素伤害色、技能类别色、轨道语义色属于战斗领域色板，不属于通用 UI 主题。渲染层负责将领域色与当前主题组合，避免换主题时改变数据、模拟或分析结果。

主题 ID 是设备或用户偏好，不进入项目存档，不进入任何模拟缓存键。

## 7. 禁止依赖

- core 不导入 Vue、Pinia、Element Plus、i18n 或浏览器状态；
- simulator 不读取项目编辑标记或 UI 选中状态；
- projection 不重算战斗规则；
- UI 不直接修改 runtime state；
- adapter 不把未经解释的原始资源 ID 当作可执行行为；
- 主题和翻译不进入项目、目录或战斗程序。

## 8. 下一步

1. 建立后置 modifier 完成后的伤害属性快照解析器；
2. 接入承伤事件、生命写入和生命伤害后的失衡结算；
3. 在正式 Buff 容器上实现元素附着三分支状态机；
4. 建立旧版与 Next 的性能基准 fixture；
5. 再实现 Season Tower 的第一个有证据机制 adapter。
