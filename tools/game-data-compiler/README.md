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
