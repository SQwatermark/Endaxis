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

活动机制不能注入任意 JavaScript 回调。adapter 只能把已知游戏数据编译成内核支持的通用原语，例如：

- 初始或全局 Buff；
- 事件触发的有序 action sequence；
- 有证据的数据补丁；
- 关卡信号。

这些原语会逐项随证据加入。当前 `MechanicDefinitionRef` 只建立目录身份和参数边界，不假装已经实现具体活动效果。

### 2.5 Combat kernel

内核负责离散帧推进、同帧 action 顺序、资源、状态、事件和伤害计算。它不认识“危机合约”“影拓丰碑”等产品名称，只执行编译后的通用战斗程序。

运行时可变状态只存在于一次模拟任务内部。不得反向修改项目文档、目录定义或编译产物。

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

1. 根据 `combat-spec` 定义 resolved scenario、combat program 和 receipt 的首个真实类型；
2. 先贯通佩丽卡的一条主动攻击闭环；
3. 建立旧版与 Next 的性能基准 fixture；
4. 再实现 Season Tower 的第一个有证据机制 adapter。
