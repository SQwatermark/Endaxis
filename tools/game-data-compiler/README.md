# Endaxis 游戏数据编译器

## 干员文件输出

完整干员直接生成到 `src/data/operators/<slug>.generated.ts`，不再由手写文件转引嵌套生成文件。
文件提供驼峰名称的具名导出及默认导出，技能的具名导出也保留。
整批候选使用同样的相对路径，审计仍按干员单独保存。
完整重建使用 `combat-definitions` 阶段联合生成武器、单件装备、套装、机制、干员与公共 Buff。
每轮先依次处理四个装备与机制领域：各编译一次，立即收集未优化定义的读取用途，
再用同一结果渲染文件。该领域处理完只留下用途摘要、文件文本和报告，释放完整领域对象。
随后逐人组装干员，保留最终定义、审计字符串和去重的公共定义，不保留整批原始动作图与完整计划。
公共定义在优化前严格检查同 ID 冲突，并补齐没有干员直接引用的系统根；
全部读取用途收齐后，逐人优化、渲染并释放已处理的定义。

所有领域的文件都渲染成功后才写目录。第二轮从来源重新编译，使用新的用途收集器与读取上下文，
共同检查装备、机制、干员、审计、公共定义及名称文件，不能用首轮编译结果代替独立检查。
联合阶段失败会阻止依赖它的本地化、图标、类型和模拟检查，也会阻止正式发布。
`--tables-only`、没有 Unity worker 或缺少非装备来源时，单件装备仍使用独立 `gears` 流程；
这只能验证已有的局部来源，不能当成完整重建通过。
正式发布只替换清单中的干员文件，保留同目录的index、helper和测试；单干员输出目录为 `src/data/operators`。
正式单干员生成和 `--check` 也使用同一批次的全部消费者，只输出或检查目标干员，避免与整批产物不同。

本文维护当前转换流程和命令；验证范围与待办以[交接](../../docs/handoff/current-context.md)为准。
总体开发方法见 [开发指南](../../docs/development/README.md)，游戏依据见 [研究分类](../../docs/research/README.md)。

## 生成后优化

优化实现集中在 `src/compiler/optimization/`，对应测试位于 `test/optimization/`。
真实模拟对照通过回执历史的公开读取接口取得事实，不比较历史存储对象本身。

优化发生在领域组装和步骤身份分配后，裁剪无效程序与无人使用的技能黑板值。
公共 Buff、武器和套装生成入口使用同一套分支规则。内部参数 `optimization` 支持
`off`、`report`、`apply`；默认 `apply`，正常生成直接输出优化后的定义。
`report` 只报告候选、返回原定义；`off` 关闭新增优化。这些参数不放入 `operators.json`。
干员与武器既有审计中的 `optimization` 保存候选及保留原因；公共 Buff 和套装在生成函数返回值中提供报告。

目前可简化字面量分支，删除技能中无人读取的算术写入和黑板初值。已明确的子作用域按读取键
保守汇总：父值会覆盖子初值，同名子作用域还可能跨入口复用，因此不能凭子板已有默认值删除父值。
实体继承所需的用途来自同批全部干员、公共 Buff、共享实体定义、武器、装备、套装及机制 Buff 和初始化程序。
装备与机制直接调用各自现有的源数据编译入口，不读取正式生成的旧 TS。当前默认仓库没有共享实体定义。
分析覆盖实体寿命、子技能、被动、Buff 动态参数和回调；投射物结束回调的读取会传回父技能，
不能因回调已有同名初值就删除父值。缺少接收方、循环依赖或未知访问时仍保留可能传出的值。
底层 `planOperatorDefinition` 未取得完整批次用途时保持保守，不自行假定其他定义没有读取。
Buff 和实体自身的黑板，以及所有定义身份暂不删除。
报告分别记录当前板读写和其他实体/Buff 的读取目标，不把不同对象的同名键混作一个值。
实体继承分析目前保守汇总全库外部读取键，没有进一步按目标实体或 Buff 宿主缩小范围。

武器词条与套装如果没有启用、初始化和事件入口，运行时不会创建它们的动作黑板，
因此直接删除这块黑板。静态属性的完整等级数值已经写入 `modifiers`，不再读取原黑板。
该规则按实际入口判断，不按“武器前两个词条”判断；词条保存的共享 Buff 蓝图及 Buff 自身黑板不受影响。
有运行入口的贡献则先简化分支，再汇总启用、初始化以及全部事件条件和程序的读写键，
逐键删除无人使用的初值。写入目的键也保留，因为运行时会用旧值作 epsilon 比较；
整板复制或未知访问仍保留整板。只裁剪初值，不删除装备宿主、事件注册、写入动作或入口。
`equipmentValues` 记录删除的键，以及实际读写、未知访问或关闭优化的保留原因。
空的初始化序列仍算入口；删除无用初值不改变这项贡献的宿主创建行为。

### 来源复用与内存

每轮干员规划建立独立的 `OperatorPlanningSources`。固定表共用 32 MiB 的原文缓存，技能、Buff 等
逐人资源使用 16 MiB 的原文缓存；两者按 UTF-8 文本字节计费，不是 JavaScript 堆内存上限。
解析对象、用途摘要、已组装定义和渲染文本还会占用内存，实际峰值需要单独测量。
超过缓存容量的单个文件照常读取和校验，但不留在缓存中；近期未使用的原文按容量淘汰。

JSON 按需解析并冻结，禁止修改共用的原始数据。需要同时使用原文和 JSON 时通过配对读取取得，
保证来源哈希和解析内容来自同一次文件读取。每名干员规划后清理逐人缓存，固定目录的解析结果在本轮复用。
全部干员规划、系统根补齐和公共 Buff 渲染完成后，清理剩余原文与已解析目录，再开始干员优化和渲染。
独立检查必须新建上下文并重新读取来源，不能使用首轮缓存证明第二轮产物一致；没有全局来源缓存。

武器和套装目前仍会把整个 SkillData、BuffData 目录解析后交给编译器，`operator-refresh` 审计也会
整目录读取 SkillData。它们尚未改成按引用读取，这些大对象不受干员原文缓存预算限制。
本轮减少的是重复编译和不同阶段同时保留的对象，没有消除单个领域内部的全目录解析峰值。

### 候选验证

候选模拟对照由以下入口执行。两套目录必须来自同一批冻结来源，只改变本次待验证的优化。
默认检查干员、公共 Buff、武器和套装；`--operators-only` 仅用于分阶段验证。

```powershell
node --max-old-space-size=2048 --experimental-strip-types tools/game-data-compiler/scripts/auditDefinitionOptimizationCandidates.ts --before-root tmp/game-data-optimization/second-pass/off/candidate --after-root tmp/game-data-optimization/second-pass/apply/candidate
```

两路串行加载，逐场只保存完整模拟事实的摘要，不把整批回执留在内存。对照包含等级/潜能、技能形态、
混合队伍、全部武器的各词条等级和套装，并使用相同的变化随机样本、比较抽样次数。只排除编译树遍历记录，伤害、
资源、状态、归属、诊断、曲线与回执引用仍参与比较。候选缺文件时失败，不允许回退正式旧文件冒充通过。
这些场景是优化前后的差分检查，不证明全部游戏机制正确；实际执行数量与覆盖范围由报告说明。
覆盖边界与后续工作见
[当前交接](../../docs/handoff/current-context.md#尚未完成)，规则见
[生成器优化设计](../../docs/architecture/data-and-state.md#生成器的编译优化设计)。

## 技能组递归放置配置

### 技能编译器选择

普通主动技能不需要配置 `compile`。正式整名生成器根据原始SkillData动作图选择公共动作、
条件、Buff和投射物转换路径；未知行为仍明确报错，不尝试其他编译器来绕过错误。
旧的 `basicAttack`、`directDamage`、`projectileDamage`、`resolvedSequence` 等选择项不再用于正式编译。

跨技能路由仍保留必要关联，例如：

```json
"compile": { "kind": "routedSkill", "targetSkillKey": "comboSkill2" }
```

路由目标的技能类型、等级来源和唯一技能组自动读取目标定义；激活Buff、路由Buff及费用冷却
从包装器的SwitchToAddBuff和CastData读取。包装形状、目标技能组、资源类型不符合已支持规则时失败，
不根据文件名猜目标。旧显式字段仍可提供，但必须与源数据一致。`routedSkillKeys` 仍用于技能组引用校验。

本次移除327个普通技能的旧选择项，保留一个路由关联；技能身份、技能组、养成和其他配置未改。

天赋和潜能也不需要 `compile`：天赋通过 `index` 绑定原生养成节点，潜能按数组顺序绑定原生等级，
实际效果与被动技能由公共养成编译流程解析。配置已移除60个天赋和133个潜能的旧选择项；
天赋索引、潜能槽位及其他配置保留，不用编译器名称代替原生行为证据。

### 放置策略

`config/operators.json` 的技能组及其 `variants` 可声明 `placementPolicy`：
`kind: recursiveInput`、`firstSkillKey`、`terminalSkillKey`、`maxSegments`、
`fallback: sequence`。起止技能必须属于该组 `skillKeys`，预算必须容纳回退序列。
转换器将策略写入公共技能组定义，编辑器按正式输入路由递归推测到终止段；
失败则按该组声明顺序放置。省略策略沿用普通整组放置，手动单段不递归。
伊冯强化普攻在配置中指定从 A1 到重击、最多24段；编辑器不按干员名称分支。

## 重建与发布

### 游戏版本更新时怎么做

本节用于游戏更新后，把**本项目使用的**新增和修改内容更新到正式数据。不要把“下载了新版文件”
等同于“已经支持新版全部内容”：新干员、技能组和人工限定的范围仍需审阅，新的原生行为也可能需要先在
combat-spec 查证，再扩展转换器。原始来源、隔离候选、正式产物是三个不同位置；不要直接修改
`src/data/**/generated`、`*.generated.ts`、`src/i18n/game-locales` 或导出的图片。

1. **确认版本和来源。** 检查工作树，保存已有修改；核对 AKEDB 快照版本、客户端/VFS 的游戏版本，
   并确认 Unity worker 可访问同一套游戏资源。本机路径和服务地址看
   [本地环境](../../docs/development/local-environment.md)，不要从旧交接记录复制。`--version` 可以锁定
   AKEDB 版本；VFS 补件的哈希只能证明取到了哪些文件，不能证明它们与 AKEDB 同版本。
   版本未对齐时先记录并查证受影响文件，不把混合来源称作纯同版本数据。
2. **先跑完整候选，不发布。** 在仓库根目录执行下方命令。`--workers 2` 用于控制本机并发，
   如机器容量允许再调整。完整候选需要 `--unity-worker`；`--tables-only` 只检查表格和单件装备，
   不能用来完成版本更新。

   ```powershell
   npm run rebuild:game-data -- --version '<AKEDB版本>' --unity-worker '<Unity-worker路径>' --workers 2
   ```

   命令会在 `tmp/game-data-rebuild/run-*` 中保存来源、候选、审计和 `report.json`。未发布的完整候选
   即使各阶段通过也返回退出码 `2`；`1` 表示有阶段失败。若网络来源不稳定，可用已经由下载器生成、
   带 `source-provenance.json` 的冻结目录重试，仍会重新核对每个来源文件：

   ```powershell
   npm run rebuild:game-data -- --source-root '<冻结来源目录>' --version '<AKEDB版本>' --unity-worker '<Unity-worker路径>' --workers 2
   ```

3. **审阅新增、删除和变化。** 打开本轮 `report.json`，检查 `sources`、`source-coverage`、
   `content-inventory`、`operator-refresh-review` 以及每个领域的 `comparison`。
   `content-inventory` 列出来源与已配置的干员、套装身份差异；它包括非玩家记录和表现变体，
   不能把所有新 ID 直接加入配置。`audit/operator-refresh.json` 指出角色模板新增/固定引用变化、
   技能库及技能组的阻塞项。候选差异中的 `added`、`changed`、`removed` 都要追到同版本来源，
   尤其要检查新技能是否在正确的技能组、旧技能是否真的被移除。被报告为 `blocked` 的审阅项
   不能被其他阶段的 `passed` 掩盖。
4. **只为确实需要人工判断的内容改配置。** 以下文件是版本更新时的检查点，不要求每次全部修改：

   - `game-data-sources.json`：本项目需要新的表、集合或单文件，而下载清单尚未包含它时。
   - `config/operators.json`：新可玩干员、原生技能组/变体、养成节点、确有依据的产品展示元数据
     变化时。普通技能编译器由源动作推断，不逐技能填 `compile`。
   - `config/gearSetIdentities.json`、`config/gearSetIcons.json`：新套装确属产品范围时登记身份，
     并选择该套装中一件装备的 ID 作为图标来源。
   - `config/equipmentAssets.json`：武器、装备或套装的来源图片有歧义，需要按对象指定资源别名时；
     普通装备由表格自动转换。
   - `config/systemBuffRoots.json`、`config/globalBuffIdentities.json`：新的公共/全局 Buff 确实被
     已支持机制引用，而自动引用闭包未覆盖时。
   - `config/commonBuffPresentationNames.json`：公共 Buff 缺少可用的展示名称，且项目需要明确的
     本地化术语映射时。
   - `config/contingencyContractSimulationScope.json`：新危机合约效果需要按本项目单敌人模拟范围
     明确纳入、排除或说明原因时。
   - `config/enemies/runtime-defaults.json`：敌人的项目运行时默认值有新证据时；新增敌人的表格与
     rank 由生成器读取。
   - `src/i18n/locales/zh-CN.json`、`en.json` 的 `enumTerms`：游戏表格没有提供的项目术语；
     其余游戏文本优先从本轮表格生成。

   配置中的 ID 和资源必须能在**本轮来源**中找到。若失败原因是未识别的动作、字段、引用或
   时间语义，应补原生证据和转换规则，不靠填零、复制旧生成文件或跳过该对象放行。
   来源未提供的新游戏机制也不能仅靠增加配置宣布支持。

5. **重跑同一版本候选，直到关口闭合。** 修改配置或转换器后，从冻结来源重跑完整候选。
   重点检查 `combat-definitions`、`enemies`、`consumables`、`locales`、`icons`、
   `generated-format`、`candidate-type-check`、`candidate-assets`、`candidate-operator-skills`、
   `candidate-equipment` 和 `sources-after-generation` 均为 `passed`。候选会独立重编译、检查
   确定性、类型、资源引用以及技能和配装模拟；它不会读取旧正式产物补缺。仍需用受影响干员、
   武器、套装和真实轴做定向数值/时序回归，检查可见名称、图标和富文本；自动候选门禁不保证
   原生机制已完全复刻。
6. **发布并复核。** 候选没有未解释差异后，用相同版本与来源执行：

   ```powershell
   npm run rebuild:game-data -- --source-root '<冻结来源目录>' --version '<AKEDB版本>' --publish --unity-worker '<Unity-worker路径>' --workers 2
   ```

   发布命令**会重新生成并检查**，不是复制上一次候选。成功应返回 `0`，且本轮 `report.json` 中
   `fullRebuild`、`published` 为 `true`，`remaining` 为空。随后检查 `git diff --stat`、
   逐项审阅生成产物和手写配置的差异；删除的文件确认确已不再引用。按改动范围运行相关测试、
   `npm run type-check` 和 `git diff --check`。重型检查串行执行，Vitest 用 `--maxWorkers=1`。
   记录来源版本/哈希、VFS 混合来源、候选报告、定向验收和未支持范围；`tmp/` 来源与审计文件不提交。

完整重建目前只覆盖本转换器登记的发布领域；例如未支持的物品效果、敌人主动行为或
新的 HUD prefab 不会因为版本更新而自动获得模拟支持。发现这类内容，应明确列出范围和证据，
决定是否扩展转换器与运行时，再用正式流程重建。

### 主动使用物品

下载清单包含 `UseItemTable`、`ItemTable`、中英文文本表和完整 `BuffData`。完整重建会在隔离候选目录中生成
`consumableDefinitions.generated.ts`、`consumableBuffDefinitions.generated.ts`、中英文
`consumables.json` 和引用到的 `/public/consumables/*.webp`，确定性复跑、类型、资源检查通过后才发布。
当前产品范围只接受原生持久 300 秒、目标为单个干员的增益物品；治疗、复活、驱散、战术效果和投掷物
仍留在来源表中，但不会生成可编辑定义。

单独复现定义时使用：

```powershell
npm run generate:game-data:consumables -- --table-root <source>/TableCfg-current --buff-data-root <source>/BuffData --definition-output <candidate>/src/data/consumables/generated/consumableDefinitions.generated.ts --buff-output <candidate>/src/data/buffs/generated/consumableBuffDefinitions.generated.ts
```

该命令的两个输出都是最终候选；下载文件、审计和其他中间内容只放在 `tmp/`。

来源使用 AKEDB 优先、VFS 补缺。每轮创建 tmp/game-data-rebuild/run-*，先生成隔离候选，
复验来源、独立重编译、类型、图标、技能与装备模拟均通过后才允许发布。
正式生成目录不能反过来填补候选缺失；VFS 补件的哈希不证明它与 AKEDB 同版本。

```powershell
# 只验证表与单件装备，不是完整重建
npm run rebuild:game-data -- --tables-only
# 离线来源必须包含下载器的 hybrid provenance
npm run rebuild:game-data -- --source-root <来源目录> --tables-only
# 完整候选；需要 VFS Unity worker
npm run rebuild:game-data -- --unity-worker <worker路径>
# 完整重建、检查后事务发布
npm run rebuild:game-data -- --publish --unity-worker <worker路径>
```

未发布的有效候选返回 2，失败返回 1，完整发布成功返回 0。
tables-only 不允许 publish；报告中的 fullRebuild/published 和 remaining 决定本次结果。
发布只修改登记的派生文件/目录，混合目录保留手写成员；安装失败回滚，回滚不完整保留备份。
这是可恢复的文件事务，不代表所有目录在同一瞬间切换。

生成和复核敌人定义期间使用 enemy-ranks.tmp.json，成功或失败均清理，不发布此中间目录。
敌人选择分类从 `config/enemies/selection-categories.json` 随正式敌人定义一起生成到最终 TS；
该配置按旧版公开目录整理，所有当前敌人都必须明确分类、列为未分类或隐藏，新增身份遗漏会阻断生成。
分类显示名由应用的中英文 i18n 提供，隐藏的无图标测试敌人仍保留战斗定义身份。
GlobalBuff 模板目录同样只在每轮 `tmp/game-data-rebuild/run-*/intermediate` 中存在；
联合战斗定义编译完成后立即清理。运行时使用已经编译进最终 TS 定义的结果，不读取模板 JSON。
生成器的 staging、backup 和原子文件统一放在 `tmp/game-data-writes`，正式目录只接收最终产物。
审计 JSON/Markdown 默认写 tmp/game-data-audit，不提交历史快照。

候选定位检查：

```powershell
npm run audit:game-data:candidate-operator-skills -- --candidate-root <候选目录> --potential 0 --end-frame 3600
npm run audit:game-data:candidate-equipment -- --candidate-root <候选目录> --end-frame 300
npm run type-check:game-data
npx vitest run tools/game-data-compiler --maxWorkers=1
```

候选技能检查包括单技能、技能库整链与组合轴；装备检查包括兼容持有者、精炼边界与套装差分。
这些检查证明所列输入能执行，不证明全部游戏数值或任意操作顺序。真实消费者与旧轴差异另作定向验证。
大型检查串行执行；当前机器的成功与环境失败只记录在近期交接。

## 公共边界

危机合约的选择字段与行为定义统一生成到 `contingencyContractDefinitions.generated.ts`；
名称与说明另用 `npm run generate:game-data:contingency-contract -- <table root> <locale output root> [--check]`
生成 `zh/en/contingency-contracts.json`。完整重建包含两条链路，图标直接扫描 TS 中的显式路径。
不再生成独立合约目录 JSON，也不在行为定义中内嵌多语言文本。

公共字段与可读名称由 [game-data-contract](../../packages/game-data-contract/README.md) 维护。
转换器不依赖本体运行时，领域入口复用公共解析、编译与优化；生成身份/来源证据不得混成运行时数值。
源动作未知、版本不明或引用缺失时显式报告，不能填零、套旧定义或试其他编译器绕过失败。
默认只输出正式消费者需要的数据；少量人工规则放配置并说明来源，不藏在输出函数中。
生成文件必须通过入口更新，不能手改后用 check 冒充正式生成。

原生研究见 [combat-spec](../../../combat-spec-operator-completion/docs/research/README.md)，
Endaxis 的单敌人取舍见[架构](../../docs/architecture/README.md)。
具体可调用脚本以根 package.json 为准，参数由 scripts 中对应入口校验，不再保留历史批次命令。
