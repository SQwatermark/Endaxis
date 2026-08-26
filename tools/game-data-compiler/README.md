# Endaxis 游戏数据编译器

这里是新版游戏数据转换器的唯一实现入口。它用 TypeScript 取代现有 Python
生成器，把反编译及游戏导出数据转换成 Endaxis Next 可加载、可编辑、可审计的正式定义。

这不是对旧生成器的逐行翻译。新版实现以原生数据结构为公共基础，只把干员、武器和
装备的特有入口从公共编译流程中剥离。旧 Python 生成器在迁移完成前仅作为可执行对照，
不能继续承载新功能。

## 1. 不可越过的证据边界

### 1.1 事实来源

证据优先级固定如下：

1. `combat-spec` 中由反编译代码确认的原生类型、字段和运行行为；
2. AKEDB、游戏解包文件及其他可追溯的原生导出数据；
3. 可重复的游戏内实验，仅用于补足静态证据无法回答的问题；
4. 旧版 Endaxis 只可帮助定位文件和提出待验证问题，不能证明游戏行为。

`combat-spec` 必须严格描述原生行为；Endaxis 必须以 `combat-spec` 为依据，再显式执行
适合当前模拟场景的简化。发现证据缺口时，应先更新或记录 `combat-spec` 侧的待办，不能在
转换器里猜测规则。

禁止从以下内容反推语义：

- 中文、英文或罗马音显示名称；
- ID 的拼写、前后缀或编号规律；
- 旧版 Endaxis 的实现结果；
- “这个效果按常理应该如此”的领域经验；
- 当前模拟器恰好观察不到某项行为这一事实本身。

无法确认的结构必须保留原始身份、字段路径和阻塞原因。不得静默丢弃，不得为了提高
“可转换率”而把未知结构标成已支持。

## 2. 总体架构

依赖方向固定为：

```text
原生导出数据
    ↓
严格数据读取层 source
    ↓
保留证据的公共源 IR
    ↓
公共控制流与行为编译器 compiler
    ↓
Endaxis 场景投影 projection
    ↓
领域适配器 domains/operator | weapon | equipment
    ↓
正式定义渲染、审计报告和黄金输出
```

各层只能依赖其上方的稳定抽象，不能反向依赖具体干员、武器、装备或 UI。

### 2.1 严格数据读取层

负责：

- 校验原生对象、数组、数字、布尔值、枚举和必需字段；
- 解析序列化类型名、黑板值、目标引用、Tag 查询、时间轴和动作载荷；
- 在错误中报告完整源文件、对象 ID 和字段路径；
- 保留原生直接值、黑板键、逐等级值及其来源；
- 严格复现原生单精度计算的截断边界。

GameplayTag ID 是原生有符号 CRC-32 位模式，负数是合法身份；不能把它当作非负数据库主键，
也不能脱离同版本 GameplayTag 目录为裸 ID 猜测语义。

这一层只陈述“数据是什么”，不判断该行为对 Endaxis 是否有价值。

### 2.2 公共源 IR

干员技能、天赋、潜能、武器效果和装备套装效果若使用相同的原生 `SkillData`、
`BuffData`、Action、Condition、Target、Blackboard 或 AbilityEntity 结构，就必须进入
同一套 IR，禁止复制成三套近似模型。

IR 必须能够追溯到原生证据，至少保留：

- 来源文件、原生对象 ID 和稳定字段路径；
- 原生动作类型、`serverActionIndex`、时间帧及嵌套顺序；
- 数值来源：直接值、黑板键、SkillPatch 逐等级值或运行时写入；
- Buff、能力实体、子技能、投射物之间的引用关系和所有权；
- 已确认的语义、尚未支持的结构和场景投影时省略的结构。

不得在读取阶段直接生成 TypeScript DSL 字符串。先形成结构化 IR，再做编译、优化和渲染。

### 2.3 公共编译器

公共编译器负责原生行为，与内容属于干员、武器还是装备无关，包括但不限于：

- Sequence、Branch、Switch、DoOnce、循环及跳转等控制流；
- 条件、目标选择、目标组写入和上下文传递；
- 伤害、治疗、失衡、资源、元素附着及关键词行为；
- Buff 的应用、结束、层数、黑板、生命周期、事件和属性修饰；
- AbilityEntity、子技能、投射物、Aura 和时间膨胀；
- SkillPatch、逐等级黑板及被动技能中的操作序列。

同一种原生结构只能有一个解析器和一个语义编译入口。领域差异通过配置或外层适配器表达，
不能复制公共编译逻辑后分别演化。

这里的“同一种”不能根据字段相似、输出相同或代码长相判断。原生归属必须从对应版本 schema
的类型引用图计算：以 Operator、Equipment、Weapon 等顶层 schema 为根，按原生类型身份递归遍历
字段引用；只被一个根引用的类型归该领域，被多个根引用的同一个类型节点归公共来源层。字段完全
相同但类型身份不同的节点仍是两个类型，不能合并。

在当前 SparkBuffer TableCfg 中，Bean/Enum 的 `type_hash` 和字段引用 hash 构成这张图的身份与边；
类型名称和字段签名只用于审计 hash 冲突，不能替代身份。MemoryPack/JsonData 应使用对应版本的
formatter/runtime schema 类型身份建立同样的引用图。字符串 ID 指向另一类数据文件时，必须记录为
跨 schema 引用边，不能因当前文件内没有嵌套对象而误判为领域私有。

公共化还必须满足：

1. schema 引用图与 `combat-spec` 证明来源是同一个原生类型、枚举或运行入口；
2. 公共 IR 保留的是同一个原生语义身份，而不是两个恰好同形的对象；
3. 投影目标也是同一个 Endaxis 运行时概念。若只满足前两项，公共解析可以复用，但不同投影仍应分开。

确认身份后，该语义的原生解释能力只由 `source/` 和对应的唯一 `compiler/` 入口持有。领域层不得
直接导入公共原生解释模块，只能消费其规范化 IR 或调用公开投影。这是依赖能力边界，不是靠搜索
相似常量或要求开发者记住已有实现。

类型引用图只决定“来源 schema 属于谁”，不直接决定“Endaxis 投影属于谁”。同一个公共来源 IR
若分别写入 OperatorDefinition、GearDefinition 和 WeaponDefinition，三个外层组装仍留在各自领域；
只有投影目标本身也是同一个 Next 运行时概念时，投影实现才进入公共 compiler。

当前 1.4.4 证据中的属性修正是这条规则的基准样例：Operator TableCfg
`AttributeModifierData` 与 Equipment `EquipAttributeModifierData` 是不同 type hash，分别读取；两者
引用的 `AttributeType`、`ModifierType`、`ModifyAttributeType` 是相同 hash，公共定义。MemoryPack
`SkillData.cardAttributeModifier` 与 `BuffData.attributeModifier` 则确实都引用同一个
`Beyond.Gameplay.AttributeModifierData`，必须共享来源解析器。三类来源经原生 loader 语义求值后
才能汇入公共 Attribute Modifier IR。

同一报告还证明 CharacterTable、CharGrowthTable 与 WeaponBasicTable 的 `weaponType` 都引用
type hash `0x8DD3BF94` 的 `Beyond.GEnums.WeaponType`。因此原生枚举只在 `source/weaponType.ts`
定义一次，干员与武器兼容性分类只通过 `compiler/weaponType.ts` 的同一投影进入 Next；原生已定义但
Next 尚无语义的成员必须失败关闭，不能由任一领域自行补映射。

### 2.4 场景投影层

场景投影把完整原生行为简化成 Endaxis 当前模拟器需要的行为。每一种简化都必须：

- 有明确的适用前提；
- 能与“尚未支持”区分；
- 在审计中留下分类和原始证据路径；
- 不改变仍可观察的战斗结果。

当前已经确认的场景边界：

- 敌人没有主动行为；
- 依赖敌人主动攻击而触发的干员受伤、伤害免疫和类似防御效果，在当前场景中没有实际输出；
- 只有敌人正在施放可打断的红圈技能时，打断才有结果；当前未建模敌人的该状态，因此
  `interrupt` 可以保留证据，但不应伪造模拟效果；
- 上述省略只说明“当前场景不可观察”，不说明原生行为不存在，也不能从公共 IR 删除证据。

时间膨胀是否影响敌方 Buff 流速等尚未确认的规则，必须保持为明确待证事项；在取得
`combat-spec` 或反编译证据前不得自行决定。

### 2.5 可执行的代码归属规则

判断代码归属时不能看“第一个使用者是谁”，必须看“它描述的概念属于哪一层”：

| 概念                                              | 唯一归属                      | 禁止出现的位置                                            |
| ------------------------------------------------- | ----------------------------- | --------------------------------------------------------- |
| 原生字段、枚举、Action/Condition/Target 载荷      | `source/`                     | 各领域自行解析同一原生类型                                |
| 公共控制流、战斗步骤、Buff/能力实体运行时定义投影 | `compiler/`                   | `domains/operator`、`domains/weapon`、`domains/equipment` |
| 当前固定木桩场景的省略与归约                      | 公共 projection/compiler 策略 | 按干员、武器或套装 ID 散落特判                            |
| 干员技能槽、面板、天赋和潜能组装                  | `domains/operator`            | 公共层或其他领域                                          |
| 武器入口、成长和词条安装                          | `domains/weapon`              | 公共行为编译器                                            |
| 单件装备、套装门槛和正式文件布局                  | `domains/equipment`           | 公共行为编译器                                            |
| TypeScript 文本、索引、审计文件                   | 各领域 renderer/writer        | 解析器和语义编译器                                        |

以下信号一旦出现，必须停止扩展功能并先修复边界：

- 领域文件声明不含领域字段的 `Step`、`Condition`、`Sequence`、`BuffDefinition` 联合类型；
- 领域文件开始按原生 Action 类型、`$type` 或 Condition 类型再次分派；
- 公共文件导入 `domains/`；
- 同一原生字段或运行语义在两个领域目录中各有一份映射表；
- 为了接通某个装备、武器或干员样本而给公共行为加入内容 ID 判断。

`architectureBoundaries.test.ts` 固定依赖能力和声明门禁，例如领域层不能直接取得公共原生
`AttributeType` 的解析入口。它不把“出现相似字符串”当作语义身份判据。新增公共语义时，提交说明
或交接文档必须指出对应的 `combat-spec` 文档、代码或工件；缺少证据时保持 `blocked`，不能引用
旧 Python 输出补足规则。

## 3. 领域适配器的职责

领域适配器只处理公共原生行为之外的差异：

- 原生入口表和对象发现方式；
- 定义 ID、归属和引用闭包；
- SkillPatch、技能等级、潜能或精炼等成长来源；
- 被动效果的安装、激活、卸载和持有者；
- 正式输出的文件布局和注册方式。

### 3.1 干员

干员适配器负责技能槽、天赋、潜能、基础面板和干员附属对象的组装。它不能拥有第二套
Action、Buff 或 AbilityEntity 编译器。

`CharacterPotentialTable`、`CharGrowthTable.talentNodeMap` 与
`PotentialTalentEffectTable` 是三个不同的 Operator 私有来源入口。前两者分别保留潜能解锁顺序和
天赋节点顺序，再通过有原生代码证据的效果 ID 边引用第三者。`PotentialTalentEffectData` 的
`None/AddPassiveSkill/ChangeSkillParam/ChangeSkillBlackboard/ModifyAttr/AddBuff` 联合载荷只能由
`source/operatorProgressionEffects.ts` 读取一次；天赋与潜能领域组装分别保持自身顺序和启用条件，
不能各自重复解析效果表，也不能虚构两条原生路径之间的统一先后顺序。

### 3.2 武器与装备

武器和装备必须复用干员已经使用的 SkillData、BuffData、条件、动作及被动编译能力，
只实现自身的入口、成长和激活特性。严禁手写套装效果代替转换。

正式文件继续按内容类型拆分：

- 武器按武器类型分目录、分文件；
- 装备按套装分目录、单件分文件；
- 套装效果与静态装备条目分离，但共享公共被动程序类型。

不得生成一个包含全部武器或装备行为的巨型文件。

## 4. Buff、能力实体与共享对象的归属

归属由原生引用和所有权证据决定，不由当前从哪个领域发现它决定。

- `buff_chr_*` 等有证据表明属于特定干员的 Buff，生成到干员定义层；
- `buff_common_*` 等公共 Buff 生成到只读的公共定义集合，不允许在单个干员编辑器中复制编辑；
- 干员生成配置可显式屏蔽在当前模拟场景中无输出的 Buff；屏蔽项必须进入审计，不能静默消失；
- 技能只通过 ID 引用所属 Buff，并传入本次施放的可变黑板值；
- Buff 定义本身不得偷偷依赖“当前技能等级”，除非原生证据明确表明这种耦合存在；
- AbilityEntity 使用同样的公共、领域所属和技能局部归属规则；
- 引用闭包必须自动收集，不能靠内容作者手工补齐隐式依赖。

编辑器中的“完整干员定义”可以统一编辑基础面板、技能、技能组、Buff 和能力实体，但这是
编辑体验的聚合，不代表这些对象在编译器中失去独立身份或被内联进每个技能。

## 5. 控制流与优化边界

优化必须在结构化 IR 上执行，并保持稳定、可解释、可关闭。所有树形优化都应自叶子向根，
先规范化子节点，再比较或折叠父节点。

当前允许的保守优化：

- 展开只起容器作用的单层 Sequence；
- 清除过滤后为空的容器；
- 若 Branch 两侧经过场景过滤和子树规范化后实际执行逻辑完全相同，删除 Branch，只保留一份；
- 仅在能证明顺序和时序不变时合并相邻结构；
- 根 SequenceAction 的释放条件不能作为运行时根守卫，使条件失败时整项技能消失；
- 非根守卫失败后若仍有剩余行为，应保留可执行部分，以符合“技能必然可以释放”的模拟方针。

根守卫如何转换成第 0 帧条件、哪些条件属于技能释放条件，必须依据已统计的原生结构和
既有证据逐类实现，不能笼统假设所有根条件都可忽略。

以下属于已记录但暂不实施的激进优化：

- 把只为给黑板写入不同常量而展开的完整分支，重写成条件值表达式；
- 进行黑板活性分析：若某个黑板值的所有读取行为都已被场景投影删除，再连带删除其写入、
  只服务于该写入的分支和中间计算；
- 跨 Buff、子技能或能力实体边界的常量传播。

实施激进优化前必须先建立读写图、控制流等价证明和优化前后差分测试，不能靠文本相似度。

## 6. 正式输出要求

- 定义中不写中文或其他显示名称，只保存稳定 ID；显示文本统一通过 i18n 查询；
- 输出必须确定性排序，相同输入重复运行不得产生差异；
- 所有生成先写入独立临时区域，全部成功后再整体原子替换正式数据；
- 单次生成或模拟的中间状态不得泄漏到全局变量；
- 支持 `--check`：发现输出过期时失败，但不修改文件；
- 生成器不得覆盖手工内容；生成文件必须有明确标记和固定边界；
- 不生成无语义的占位 ID、猜测名称或手写行为；
- 优先级、槽位等枚举只有在证据明确时才转换为正式数值，未知值保留原生身份并阻塞编译；
- 输出文件不能依赖运行时才存在的审计生成文件，避免 Vite 因缺失生成产物无法启动。

## 7. 审计与诊断

每个领域都使用同一套审计分类，至少区分：

- `supported`：已由公共编译器完整转换；
- `scenario-omitted`：原生行为存在，但在明确的当前场景前提下不可观察；
- `presentation-only`：只有表现层输出，当前战斗模拟不消费；
- `blocked`：发现了影响战斗的结构，但缺少证据或编译能力；
- `invalid-source`：原生数据形状与证据模型冲突或引用缺失。

诊断信息必须包含领域入口、对象 ID、源文件、完整字段路径、原生类型和阻塞原因。统计既要
覆盖技能，也要覆盖天赋、潜能、武器、装备、Buff、能力实体及它们的引用闭包。

“已生成文件”不等于“可完整模拟”。完整度应分别报告：发现、解析、编译、场景投影、正式
注册和运行验证，避免用一个模糊百分比掩盖阻塞。

## 8. 代码风格

- 代码注释、架构文档和非原生诊断说明使用中文；原生字段名和类型名保持原样；
- 注释解释证据、边界和“为什么”，不逐行复述代码；
- 类型和函数名称应描述原生概念或明确的编译阶段，避免 `helper`、`misc`、`data2` 等名称；
- 函数保持单一职责；解析、语义编译、场景投影、优化和渲染不得混在一个函数中；
- 优先使用不可变数据和显式返回值，不使用保存单次编译状态的模块级可变变量；
- 领域差异使用有类型的适配器接口，不使用散落的 ID 特判；
- 未支持结构使用带路径的显式错误或审计结果，不使用宽泛 `catch` 后继续；
- 不建立巨型文件，也不为了形式拆出大量只有一两个函数的碎文件；按稳定职责组织模块；
- 公共层不得导入 `domains/operator`、`domains/weapon` 或 `domains/equipment`；
- 渲染器不得重新解释游戏语义，只负责把已确认 IR 稳定地写成正式定义；
- 原生帧、秒、单精度数值和 Endaxis 时间单位之间的转换必须集中实现并写明依据。

## 9. 测试与迁移门禁

迁移期间保留 Python 干员生成器作为 oracle，但不再向其中增加新架构。每项迁移至少包含：

1. TypeScript 单元测试，覆盖正常输入、边界值和严格失败；
2. 通过 JSON 调用 Python 实现的对象级差分测试；
3. 来自真实导出数据的最小固定样本；
4. 正式定义的语义黄金测试，而非只比较格式化文本；
5. 确定性输出与 `--check` 测试。

迁移顺序也是功能推进门禁：前一阶段没有完成对象级差分和正式运行验证时，不得为了扩大后续
领域数量而在后续领域补建缺失的公共行为编译器。特别是 Operator 领域适配器尚未达到旧 Python
正式输出等价前，武器和装备只能维护已经取得的来源证据与回归样本，不继续扩展正式行为覆盖。

最终删除 Python 前必须满足：

- 现有 Python 干员生成器测试全部继续通过；
- 已有正式干员的生成结果通过对象级或运行语义等价检查；
- 已确认装备套装黄金样本通过等价检查；
- 全量干员、武器和装备源数据完成统一审计；
- Next 类型检查、核心模拟测试和正式数据仓库测试通过；
- 不再存在只供 Python 生成器消费、且没有归档价值的中间格式。

当前门禁命令：

```sh
npm run type-check:game-data
npm run test:game-data
```

固定版本输入统一由 `npm run download:game-data:sources` 获取，所需资源只在本目录的
`akedb-sources.json` 声明一次；下载器、审计和正式生成不得各自维护近似清单。装备与武器正式编译要求
`WeaponUpgradeTemplateTable`、`EquipTable` 与其余 TableCfg 来自同一个 manifest 版本，不能把本地
AKEDatabase 工作树中的当前文件混入版本化快照。默认输出位于 Endaxis 自己的
`tmp/game-data-sources`，不得提交；`combat-spec` 只提供反编译证据，不能充当资源清单、下载器配置或
生成输入的隐式提供者。

下载器按单个逻辑资源执行固定优先级：先请求 AKEDB CDN；资源不存在、内容不是合法 JSON 或请求失败时，
才请求可选的 vfs-index-browser fallback。`--vfs-fallback` 可以是本地兼容目录，也可以是
`http(s)://.../api/akedb-compatible` 基址。两种提供者使用同一逻辑路径：

```text
TableCfg-<version>/<TableName>.json
SkillData/manifest.json
SkillData/<file>.json
BuffData/manifest.json
BuffData/<file>.json
```

AKEDB 已提供集合清单时，基础下载只对其中明确列出的同名资源逐文件 fallback，不把 VFS 整个集合
合并进来；否则会把当前 Operator 根无关的敌人、关卡资源混进版本快照。只有 AKEDB 完全没有该集合
清单时，才使用 VFS manifest 建立基础集合。额外的子 Skill、Buff、Projectile 和 AbilityEntity 由
领域闭包命令按精确 ID 获取。输出目录的 `akedb-source-provenance.json` 逐文件记录实际提供者，避免把
混合来源误称为纯 AKEDB 快照。这里的
“同构”指逻辑路径和解码后的 JSON 数据结构可由同一 source 读取器消费，不要求空白、字段排列或曲线的
历史/当前序列化外形逐字节相同；读取器若支持多个已证实外形，仍必须投影为同一个源 IR。
如果 AKEDB manifest 尚未登记请求版本，下载器使用显式 `--version` 或清单默认版本构造 VFS 逻辑路径，
该版本的 TableCfg 全部由 fallback 提供；不会要求 vfs-index-browser 伪造 AKEDB manifest。

示例：

```sh
npm run download:game-data:sources -- --version 1.4.4@9433094-12
npm run download:game-data:sources -- --vfs-fallback http://desktop:8765/api/akedb-compatible
npm run download:game-data:operator-closure -- --vfs-fallback http://desktop:8765/api/akedb-compatible
```

## 10. 迁移顺序

1. 迁移严格读取原语、数值来源、类型名和原生单精度行为；
2. 迁移 Target、Tag、Blackboard、SkillPatch 等公共叶子结构；
3. 迁移 Condition、Action 和控制流，建立统一公共 IR；
4. 迁移 Buff、AbilityEntity、Projectile、Aura 等引用图；
5. 迁移被动 SkillData，使干员天赋/潜能、武器和装备共用同一入口；
6. 接入干员领域适配器，与 Python 正式干员输出逐个对照；
7. 接入武器和装备适配器，复用公共被动及引用闭包；
8. 切换正式生成命令，归档黄金证据，删除被替代的 Python 和装备专用编译器。

旧脏工作区中的装备身份映射、AKEDB 获取、静态条目生成、引用所有权、黄金导出和原子写入
能力可以按证据逐项迁移；装备专用的效果 IR、行为 IR、语义渲染器和旧版适配器不进入新主干。

## 11. 当前迁移状态

已完成：

- 正式场景编译从已解析等级/养成的完整定义提取静态冷却目录，空轴/未放置连携与变体也有账本，
  但不安装未放置动作。设置/减少与槽位继承操作使用完整目录，重复放置不重复推进。
  下一步接正式角色常驻条件定义、资格来源与 Pending 施法；缺确认帧/多充能等边界不变。
- Next 编译程序 comboConditionPrograms 已由 assembly 自动安装到标准环境真实事件阶段，
  复用角色共享板和当前槽单充能冷却。五条真实来源通过实际技能附着回归；正式角色定义/场景
  生成尚未接入，不能把此称为干员转换完成。未放置槽位的静态冷却账本已接通，下一步接资格来源及
  Pending 选择/afterCastStart 覆盖。alive/InSilence 和 Pending 接收仍是必需显式端口。
- VFS 已解码 Unity 连携 RID 的有界规范化适配，五种已审计叶子仍复用公共 Action/Condition 解析；
  真实 14 条来源核对一致，五条条件可编译。Context 对象类型及 ByTag 首目标增强层数进入 Next。
  DebugPrint/关闭动作不再被残留 Target 假阻塞；真正的 InputTarget、非空子 RID 和 BuffIdCount
  仍是显式边界。角色生产安装/资格端口/Pending 施法尚未自动贯通，不等同正式转换完成。
- 公共连携条件来源读取与四类已审计附着事件 Pending 编译，复用公共条件/序列而不另写叶子；
  布尔结果被消费时保留纯尾条件。原始 RID 未展开、immediate、主控/支援过滤、未审计事件仍拒绝；
  InputTarget 尚未投影时禁止把 Target 编成 Buff 的物理 eventTarget。证据见 combat-spec 的
  combo-condition-environment.md、combo-event-gates-and-pending.md；尚未接正式角色定义到场景生成。
- AbilitySystemData 两层黑板的公共安装投影：实体字面值与启用/禁用的条件局部板分离，动态声明
  不当作编译期常量；Next 实体初值可随场景装配进入共享运行板，正式角色常驻条件生成尚未切换。
- CheckSpellInflictionType 的原生数值/命名/零 mask 与 savedKey 写回投影；有写入副作用的尾条件
  保留执行及前置守卫，不能按“没有后继步骤”省略。证据见 combat-spec/docs/check-spell-infliction-type.md。
- 独立 TypeScript 工具链、类型检查和测试命令；
- 严格对象、数组、数值、字符串、布尔值和字段集合读取；
- 原生 Action 类型名与 Selector 嵌套类型名读取；
- 原生单精度 TickInterval 帧投影；
- ScalarSource、GameplayTag 查询和完整 TargetSettings 读取；
- SkillData 黑板声明、引用收集和 SkillPatch 逐等级读取；
- SimpleCalcBBAction 与 ModifyDynamicBlackboard 的完整来源读取；后者将合法的间接 HpRatio 路径
  与 Endaxis 当前只支持的直接值投影分开；
- RandomAction 的范围来源、随机类型与输出黑板键；来源层不猜测随机算法或上下界包含性；
- StoreAttributeValue 的目标属性身份、基础/最终未转换取值、除数、乘数、基值、取整开关与输出黑板键；
  来源层只建立属性到黑板的数据流，不提前求值角色面板；
- TargetGroup 的 Find、ContinuousFind、Merge、Pick 纯动作来源读取，以及单独附加时间轴位置和
  相邻数量写回关联的动作树收集器；
- CharacterTeam、ExcludeTarget、DistanceValidator、PriorityFilter、SmartTarget 和
  CircularOrderSort 等已取证选择器事实；
- 不携带场景 `supported` 结论的公共 Condition 叶子 IR；
- 浮点、主控、距离、目标数、Buff 层数、Tag、标记、生命、概率、技能类型、目标身份和
  对象类型等 14 类高频条件；
- 角度、霸体、失衡、敌人等级、构筑属性，以及伤害、治疗、Buff、技能命中、能力实体时长等
  事件上下文条件；
- `OrConditionAction` 的“组内全部满足、组间任一满足”结构，以及只反转下一项的
  `NotNextCheckAction`；
- `ObtainCostAction`、`CreateTimedMarker` 和 `AddGlobalCDTimer` 的公共来源载荷；资源动作
  保留完整来源/目标与表现开关，TimedMarker 保留动态 ID 和局部/共享计时基准；
- `CreateBuffAction`、`FinishBuffAction`、`FinishBuffAdvanced` 和 `HealAction` 的公共来源载荷；
  Buff 动作保留动态身份字段、黑板赋值、来源/目标和生命周期，治疗动作保留原生计算公式，
  不在来源层限制 healer、valueSource 或定值缩放形状；
- Heal 与 Damage 共用的四类原生 Calculation，以及 `DamageAction`/DamageUnit 的伤害公式、
  处理器、资源载荷、免疫/格挡与伤害数字合并事实；
- 投射物、能力实体和技能调用共用的子实体黑板赋值、空间参数与引用槽位来源 IR；投射物回调
  同时保留启用位和残留 ID，能力实体保留关闭状态下的编辑器空占位，不在来源层擅自打开引用；
- 公共定义引用图：动作节点保留完整来源路径，SkillData 根附属/条件切换/换技 Buff 与动作中的
  Buff、投射物、能力实体、子技能引用统一输出 `active/inactive/dynamic/empty` 边；纯闭包求解器只沿
  活动静态边遍历，并检测重复定义、循环和缺失目标；
- 公共递归控制流来源树：Sequence 保留主控/Guard 两类容器守卫和关闭动作，IfElse、Switch、
  ForEach、Channeling、JumpTo、TickInterval、TickIntervalV2 保留各自子序列；NotNext 作为只影响下一项的执行
  策略保存。解析阶段不选择分支、不展开循环、触发 Tick/跳转，也不执行根守卫优化；
- FinishOwnerAction 的完整目标与死亡表现开关；实体结束和普通 AbilitySystem 归零差异留给投影；
- TimeDilationAction 与 UltimateTimeAction 的层级、标签、持续时间、曲线关键帧、目标、冷却影响窗口
  和终结技恒定缩放来源；时间缩放仲裁、曲线求值与时钟投影仍以后续公共运行语义为准；
- 已迁移 Action 叶子的单一公共分派入口；控制流递归调用同一入口，领域适配器不得再按原生
  类型各自实现一套解析；未知 Action 携带完整字段路径明确阻塞；
- SkillData 动作图切片：严格校验根字段签名，读取声明黑板、39529 个时间轴区间及强制动画
  同步事实，并保留 112 个被动事件及其多 Sequence 结构；
- 领域无关的被动 SkillData 入口：严格区分 `castType=Passive`，复用公共黑板、根 Buff 赋值、
  Toggle 条件、CardSkill 属性修正、动作图和定义引用，不携带干员/武器/装备归属；
- 被动定义公共编译入口：先合并静态声明与 SkillPatch 逐等级值，再把同一份黑板来源注入条件、
  动作和 Buff 安装；动态声明不在导入时冻结，Patch 可提供原 SkillData 未声明的运行键；
- 公共 SkillPatch 选级：保留 SkillData 定义等级与静态默认黑板；只有请求等级精确命中补丁时才
  切换等级并合并该行，未指定等级或缺失补丁行均复现原生行为、继续使用定义默认值；
- 公共 SkillData 输入与批量编排：主动、被动及后续子技能入口共用声明黑板、SkillPatch 查找、
  缺失引用诊断、内嵌 skillId 校验和按定义 ID 去重；普通 Skill 与 Passive 只在原生运行形态分派后
  进入各自特有载荷，不能由 Operator 领域重新实现一套主动技能读取；
- 干员养成发现入口：按 `PotentialTalentEffectTable` 联合载荷中的 `AddPassiveSkill` 产生公共编译
  请求，保留效果包 ID、条目路径、运行时输入黑板和原生未指定的技能等级；
- 构筑属性条件：按 combat-spec 严格读取 `SkillConditionTable` 的 `CompareCharDeckAttr (14010)`
  与六种原生比较运算；养成条目按原生规则跳过空条件 ID，并把非空数组保留为有序短路 AND。
  当前 Next `BuildCondition` 只能容纳单个比较，因此多条件投影会明确阻塞，绝不截断；
- 干员 `CharacterTable` 入口：按 combat-spec 严格读取角色 ID、原始元素字符串、完整原生职业枚举、
  稀有度、主副属性、默认武器和属性关键帧；职业成员来自 SparkBuffer type hash `0xABF873A2`，
  稀有度在来源层只保留 schema 已证明的整数身份；
  原生查找保持 `(level, breakStage)` 精确首项匹配，Next 的六档整数面板由显式里程碑投影产生，
  不把产品展示档位伪装成原生插值规则；
- 公共元素身份投影：CharacterTable、DamageAction 和条件数据共用同一个原生元素归一入口，
  `Physical/Fire/Pulse/Cryst/Natural` 只维护一份到 Next 稳定身份的映射；来源层不得反向依赖
  compiler，也不得由三个消费者各复制一份字典；
- OperatorDefinition 静态头部：从同一个严格来源闭包组装稀有度、武器、元素、职业、主副属性、
  六档面板和非默认好感属性。`slug/gameId` 是 Endaxis 产品身份，不从 CharacterTable 的显示字段猜测；
  技能、天赋和潜能行为未装配前，该头部不能单独注册成完整干员定义；
- 干员天赋节点入口：按 combat-spec 严格读取 `CharGrowthTable.talentNodeMap` 的节点类型、属性
  Modifier 和被动效果 ID；好感属性只投影 `Attr(3)` 节点，默认主属性规则省略、双属性例外保留，
  不把 `PassiveSkill(4)` 的条件属性路径混入属性节点；
- 武器发现入口：按 `WeaponBasicTable.weaponSkillList` 的原生顺序产生相同的公共请求，等级来源只
  保存槽位及突破/潜能模板 ID，具体等级必须由 combat-spec 已确认的武器等级算法解析；
- 武器技能等级解析：严格按突破槽位边界、潜能额外边界、一级 SkillPatch `tagId` 与基质词条
  `tagId` 依次计算并限制上限；缺突破行返回空、缺潜能行保留突破结果，不按星级或槽位猜规则；
  原生按技能列表索引读取边界，因此边界不足明确失败，而三星模板中未被技能列表引用的尾部
  `(0, 0)` 占位允许保留并忽略；
- 武器基础攻击成长：被动发现和成长读取共用同一 `WeaponBasicTable` 严格源行；成长只沿声明的
  `levelTemplateId` 读取 `WeaponUpgradeTemplateTable`，保留导出值和原生 float 运行值，只有精确等级
  行产生 `Specific/Atk/BaseAddition`，缺行返回空且不插值；
- 武器静态正式定义：以原生 `weaponId` 作为尚未引入产品身份表时的稳定候选身份，
  只接受 1/20/40/60/80/90 级六个精确基础攻击节点和 Next 可表达的稀有度/武器类型；
  CardSkill 属性按 SkillPatch 的完整等级黑板物化为逐档词条，而 Buff、Toggle 和动作闭包作为
  显式运行依赖保留，不因静态定义已生成而冒充动态行为已闭环；
- 公共构筑属性投影：武器与装备共用 `compiler/buildAttributeProjection.ts` 中的原生属性语义，
  正式修正与诊断类型也归入公共编译层；两个领域不互相导入，装备旧公开名称只保留为薄兼容导出；
- 装备套装发现入口：按 `EquipSuitTable.list` 的原生顺序产生相同的公共请求，保留每个阈值的
  `equipCnt`、`skillID` 和 `skillLv`；当前数据碰巧都是三件套一级技能，但实现不固化这些值；
- 公共 Attribute Modifier 枚举身份：Buff/CardSkill 的字符串枚举和表格中的数字枚举进入同一套
  `ModifyAttributeType`、`AttributeType`、`ModifierType` 身份；表格 IR 仍保留原始数字与完整路径，
  未知枚举失败而不是降级成裸数字；
- 单件装备来源入口：联合 `ItemTable` 的物品身份与 `EquipTable` 的战斗属性，严格保留每条
  `attrIndex` 和逐精锻档 `attrValues`；实例缺少某索引时选择第 0 档，等级越界直接失败，不读取
  展示修正、不插值也不夹取；
- 原生装备槽位枚举：由当前客户端 metadata 精确恢复 `Body/Hand/EDC/EndNum/Head/Ring = 0..5`；
  来源 IR 同时保留名称与原始数值，产品层只将 `Body/Hand/EDC` 映射为已有三类正式槽位；
- 单件装备正式定义组装：基础防御从公共属性程序提升为独立字段，其余修正按 `attrIndex` 保持逐档
  能力；十类已确认伤害倍率使用统一 `damageScale` 身份进入伤害快照，木桩模型不可观察的玩家承伤
  修正只进入 `scenario-omitted` 诊断；
- 单件装备确定性文件计划：按套装身份分目录、每件装备单文件，并生成稳定索引与 JSON 审计；渲染器
  不重新解释语义，输入顺序不影响内容，重复 ID、不安全路径和 blocked 诊断均直接失败；
- 公共被动批量编排：保留领域请求的顺序和重复安装来源，同时按 SkillData ID 去重编译共享定义；
  等级来源与运行时黑板留在请求上，公共定义保留完整 SkillPatch，不替武器或套装提前选级；
- 被动安装实例化：套装使用表内 `skillLv`，天赋/潜能保持原生默认等级，武器要求调用方提供已由
  突破/潜能/基质算法解析的实例等级；选级后再应用请求额外黑板，复现同名值最终覆盖顺序；
- Python oracle JSON 差分通道及真实 SkillPatch 导出切片。

当前 30 名干员、301 个技能已达到逐项模拟 301/301。武器来源和候选生成达到 **77/77**、226 条
运行依赖；117 个唯一被动中的 64 个事件程序现已进入公共 Action/AbilityEvent 编译层。
`CheckConsumeBuffLayer`、`SaveCharTypeId` 和 `CreateBuffAttachingSkill` 已有 combat-spec 证据；
此前 67/77 的来源阻塞统计已过期。

正式生成必须包含 startup、Toggle 和动作图的全部活动 Buff 引用；不能只跟随安装根。修正闭包后
实际生成 108 个 Buff 定义。`CreateBuffAttachingSkill` 的 `lifetimeOwner=currentCastSkill` 必须
完整传入正式步骤；当前生产端尚未实现精确附着接口，因此明确阻断而不是静默丢弃寿命。
真实四技能生产门禁为 **65/77 成功、12 项精确已知阻塞**；候选尚未接默认注册，详见
`src/next/application/generatedWeaponsSimulation.test.ts`。全量运行和关键被动数值/寿命差分满足前，
不能把“生成成功”升级为“全武器模拟完成”。

公共事件程序投影必须遵守以下不可退化规则：

- 一个原生 AbilityEvent 下的每条 `SequenceAction` 都是独立注册项，禁止为了少生成对象而拼接成
  一条步骤序列；否则条件短路、优先级和同级注册顺序都会改变。
- 来源事件数组和 `actions` 数组的顺序就是注册顺序。禁止按事件名、武器 ID、Buff ID 或生成 key
  重排；空程序可以删除，其余程序不能合并。
- 原生队列按整数优先级降序，同级按注册顺序执行。当前来源只确认 `Default + priorityOffset 0`
  对应运行优先级 0；完整枚举映射进入 combat-spec 前，生成器遇到其他组合必须失败关闭。
- Buff、武器、装备只负责提供各自的安装与生命周期输入。AbilityEvent 编排、Action/Condition 投影
  和顺序规则属于公共编译层，不允许在三个领域内各复制一套 switch。

正式生成命令不会在第一把失败时中断审计：它逐把收集来源错误，再合并运行投影诊断，全部通过后
才渲染并原子替换目录。正式目录只保存 78 个 TypeScript 文件；机器审计写入被忽略的
`tmp/generated-next-weapons`，`--check` 不读取也不修改审计文件。生成目录只供候选门禁使用，
默认仓库接入是独立步骤。

```powershell
npm run generate:game-data:weapons -- --tables <TableCfg目录> --skill-data <SkillData目录> `
  --buff-data <BuffData目录>
# 同参数追加 --check 校验确定性输出；审计可通过 --audit-output 指定临时目录。
```

武器静态审计不写中间产物；某把武器失败时仍继续报告其余身份：

```powershell
npm run audit:game-data:weapons -- --tables <TableCfg目录> --skill-data <SkillData目录> `
  --buff-data <BuffData目录>
```

Operator 主动技能库可用以下命令批量审计；任何干员失败都会保留逐项诊断并使进程返回非零：

```powershell
npm run audit:game-data:operators -- --manifest scripts/generate_next_operators/operators.json `
  --skill-data <skill-data-cdn目录> --buff-data <BuffData目录> `
  --projectile-data <ProjectileData目录> --ability-entity-data <AbilityEntityData目录> `
  --gameplay-tag-dump <GameplayTagConfig TypeTree dump> `
  --tables <TableCfg目录>
```

资源下载器的正式资源目录由 `akedb-sources.json` 独立维护。TableCfg、SkillData 和 BuffData
优先来自 AKEDB；下载完 SkillData/BuffData 后，下载器会递归收集其中实际出现的
`projectileId`、`abilityEntityId`，再批量关闭 ProjectileData / AbilityEntityData 引用集合。
AKEDB 的 `asset-sync-index.json` 如果将来提供同名文件仍优先使用；当前 Unity 模板由
vfs-index-browser 的同构端点精确导出。不得把 combat-spec 工件目录重新接成下载来源，也不得
逐个在 Operator 配置中手写模板清单。

ProjectileData 目前提供已解码 `ProjectileComponentData`；AbilityEntityData 只提供已由
反编译和样本共同证实的 `AbilityEntityTemplateData` 逻辑前缀。引用闭包能据此证明模板身份存在，
但不代表未知组件行为已经完成投影；后续领域编译器必须继续显式处理或失败关闭。
AbilityEntity 公共目录会严格保存动态寿命/叠层黑板和 born tags，并只建立精确 tag 倒排索引；
父子匹配直接复用 `src/shared/gameplayTags.ts`，但没有同版本 GameplayTag 路径时不得自行展开关系。
`GameplayTagConfig` TypeTree dump 的路径读取、CRC 目录编译、确定性模块渲染和 `--check` 也已进入
本工具；旧 Python 脚本不再参与生成。下载 provenance 同时保存实际内容的字节数与
SHA-256；provider 名称或同一个 URL 不能代替内容版本身份。

`compiler/abilityEntityQuery.ts` 是 owner-spawned AbilityEntity 查询的公共唯一投影入口。它严格区分：

- finder 只从 selector owner 的原生 children 中按 ObjectType 掩码建立候选，不能推导施法身份；
- TagValidator 按同版本 GameplayTag 层级过滤模板 born tags；
- SkillCastIdValidator 单独保留“同一次施法”约束；
- 静态 `candidateTemplateIds` 只是模板目录候选，不能当成场上已经存在的实体实例。

Operator、Weapon、Equipment 若消费相同 selector 结构，必须复用该入口；领域适配器不得再次按
finder 名称、Tag ID 或验证器列表实现自己的查询编译。当前严格切片只接受已闭环的 owner 距离
PriorityFilter、AbilityEntity 掩码和上述 validator；唯一对象掩码例外是已由原生位运算证明恒不命中的
零掩码，它显式投影为空集合而不是 AbilityEntity。后续只能在 combat-spec 已闭环的公共行为基础上逐项扩大。

Selector 后处理器不能只保存类型名或 `maxNum`。公共来源层现通过
`source/selectorComponents.ts` 完整读取 PriorityFilter 的 `filterType`、最高优先级保留开关、显式数量
限制、最大数量，以及 Buff ID/Tag/叠层筛选载荷，并在 TargetSettings、目标组写入和 Merge 输入中
保留同一结构。完整读取不代表已经支持执行：combat-spec 已从原生函数体闭环
`DistanceFromOwnerAsc/Des` 的三维距离权重、降序负权重、显式数量限制和 128 硬上限；公共查询投影
因此按原 post-processor 顺序保存 `distanceFromOwner + order + maxTargets`。该排序只能作用于运行时
children 实例，不能拿静态模板 ID 预先排序。非空 Buff 筛选、最高优先级裁剪和其他排序枚举仍失败关闭。

`ShuffleTarget` 的完整 `BlackboardInt targetNumLimit` 也由公共来源层保存。combat-spec 已证明它先对
普通目标执行正向 Fisher-Yates 全量洗牌，再仅在限量值大于零时保留前 N 项；零和负数不裁剪，
hit-reaction 不参与。公共查询 IR 保留 `shuffle + targetNumLimit`，但不会在静态模板目录上执行随机化；
Unity Random 状态仍是后续运行时边界。

当前 2459 份真实 SkillData 中共收集到 58 个 owner-spawned 目标组写入，公共查询投影严格接受 58 个。
最后一个庄方宜样本还包含 DistanceValidator；来源层现保存完整阈值、比较符与 XZ 开关，不能只因
项目距离投影为零就在 parser 中删除。这个数字只衡量查询 IR 完整，不代表对应技能整体可编译。
主动 SkillData 的公共编译结果现直接保存这些 `targetGroupWrites`，
`compiler/activeSkillAbilityEntityQueries.ts` 只消费该 IR 并生成查询切片，不再扫描原始动作树。
Operator 下载计划允许模板目录为空以发现引用；正式来源闭包若遇到 owner-spawned 查询，则必须显式
提供由同一份 AbilityEntityData 编译的目录和同版本 GameplayTag 注册表，不能导入 Next 生成目录或
隐藏全局状态。定义图中的 AbilityEntity 节点也从这份已编译目录派生，正式审计不会为不同消费者
重复解析原始模板表。
目标组写入自身保存完整 SkillData `sourcePath`；连接器会用公共控制流遍历器验证该路径存在于同一份
已编译动作图，再生成查询切片。调用方不再提供路径前缀，避免把 manifest 项路径和原生动作路径混用。

引用闭包不再维护第二套原生 Action `switch`。`source/actionLeaf.ts` 提供唯一分派和带 scope 的尝试
入口：严格动作编译启用全部已迁移类型，引用闭包只启用会形成定义边的类型；后者对其他动作保留
`untracked` 身份，但引用相关已知动作的字段错误仍失败关闭。目标组不是定义引用，主动 SkillData
通过独立的公共数据流收集阶段保存其时序与动作路径。

当前 `1.4.4@9433094-12` 与现有 manifest 的结果为 30/30 名、309/309 份主动 SkillData 完成
`manifest key → sourceFile → 原生 skillId → 公共定义 → CharGrowthTable.skillGroupMap` 身份闭合；
这只证明主动定义和等级组来源完整，不等于时间轴行为已正式投影。

当前 2459 份 `skill-data-cdn` 真实导出扫描结果：MergeTargetAction 138/138、
PickTargetAction 20/20、SimpleCalcBBAction 159/159 解析成功；ModifyDynamicBlackboard
来源解析为 787/787，其中 785 项是当前可投影的直接写入，另有 2 项敌人技能使用
`directValue=false + calculateType=HpRatio`。后两项是合法来源事实，但执行语义尚未闭环，必须在
投影阶段标为 `blocked`，不能在来源阶段误报 `invalid-source`。
TargetGroup 整树收集的最新 TS 全量结果为 2455 个文件成功、4 个文件阻塞、6558 项写入；
剩余阻塞来自尚未完整闭环的 `InteractiveKeyValidator` 和 `TargetPriorityFilter`。
`ConvertToPosition` 已由静态类型和两个无载荷真实样本确认只需保留处理器身份。
`OwnerPartsFinder` 已根据 1.4.4 静态字段和 6 个同形真实样本保留
`partQuery` 的查询类型与原始 Tag ID；来源层仍不解释部件含义或场景目标。
Condition 的 29 种已取证原生类型均已建立公共 IR；其中 28 种出现在当前真实数据中。
2459 份 SkillData 的 6539 个条件节点全部严格解析成功，0 个字段或形状错误；7 个
`OrConditionAction` 也连同嵌套条件和局部取反闭合。源 IR 仍只保存原生事实，能否在 Endaxis
单敌人场景执行由后续投影层判定，不能把“已解析”误写成“已支持模拟”。未知条件类型继续
携带原生类型和字段路径明确阻塞，不能退化成恒真或恒假条件。
第一批基础 Action 的真实扫描结果为 457/457 成功：`ObtainCostAction` 377 项、
`CreateTimedMarker` 72 项、`AddGlobalCDTimer` 8 项，字段签名均只有一种且全部通过精确字段校验。
Buff 动作在干员 SkillData 中 871/871、武器 SkillData 中 106/106 全部解析成功；全库在补齐
`ShapeFinder` 与 `OwnerPartsFinder` 来源事实后为 2493/2493。`HealAction` 当前 41/41 全部解析成功。这里的闭合只说明来源事实
可读，不代表相关 Buff 或治疗已经能在 Endaxis 场景中执行。
DamageUnit 的 2940/2940 个真实实例已全部严格解析。汤汤水体的 3 个简单计算单元带有不会被
原生简单公式读取的旧 `atkCalculation`，来源 IR 会记录该字段存在，但不会错误读取其中“启用
黑板且 key 为空”的失效值。`ShapeFinderData` 的字段布局和 Sphere/Capsule/Box 参数已有
combat-spec 与反编译证据，因此来源 IR 会保留其 190 个真实实例；但碰撞查询尚未闭环，后续
场景投影仍不得宣称可执行。由此完整 DamageAction 也达到 2620/2620 来源解析成功。TargetGroup
整树收集当前为 2455/2459 文件成功；剩余类型是
`InteractiveKeyValidator` 和 `TargetPriorityFilter`，
与 ShapeFinder 无关。
引用闭包动作的全库来源扫描为：`LaunchProjectile` 2064/2064、`SpawnAbilityEntity` 981/981、
`CastSkill` 92/92。当前 92 个技能调用均使用直接 ID；动态字符串包装仍由公共类型完整表达。
投射物的 block/finish/reach 槽位存在“关闭但残留非空 ID”，引用闭包只允许跟随启用槽位；另有
29 个敌方护盾投射物是“hit 启用但 ID 为空”，来源层原样记录，后续投影必须审计，不能伪造
技能引用。能力实体中 1 个关闭的实体黑板赋值带编辑器空占位，也仅作为非活动序列化事实保留。
全库共有 63791 个 `SequenceActionData`，字段签名完全一致；其中 191 个启用
`onlyExecuteWhenSourceIsMainChar`，9 个启用 `onlyExecuteWhenSourceIsGuard`，没有两者同时启用的
样本。递归控制节点扫描为 `IfElseAction` 4578/4578、`SwitchAction` 48/48、`ForEachAction`
225/225、`ChannelingAction` 1239/1239。Channeling 保留目标、逐帧开关、全局间隔、每目标次数/
间隔及 Tick 子序列，具体触发帧仍由后续时间投影依据 combat-spec 证据计算。这里的成功只证明
来源树可无损读取；尤其根 Sequence 守卫仍必须在场景投影中与普通
子序列短路分开处理，不能让根守卫失败导致整个技能从时间轴消失。
`JumpToAction` 436/436、`TickIntervalAction` 44/44、`NotNextCheckAction` 35/35 也已进入公共
控制流来源树；`TickIntervalActionV2` 9/9 保留三态模式、动态间隔、固定次数、总次数、总时长和
递归 Tick 序列。当前真实 V2 样本只有 8 个 `Interval` 和 1 个 `EachFrame`，`FixedCount` 与动态
黑板路径依据 combat-spec 的机器码证据保留，不能伪称已有资源样本验证。RandomAction 293/293、
FinishOwnerAction 273/273 进入统一叶子入口。跳转方向、随机算法和 Tick 触发帧均未在来源解析阶段
擅自求值。`InterruptCurSkillAction` 虽有 147 个同形
样本，但 combat-spec 尚无对应严格证据入口，因此本轮没有照旧生成器猜写其语义。
统一 Action 叶子入口仍由单一公共分派驱动。此前 23700/23726 的快照包含已被
`OwnerPartsFinder` 取证消除的阻塞，因此不再作为当前门禁数字；剩余已知来源阻塞只落在
`InteractiveKeyValidator` 和 `TargetPriorityFilter`，不是公共分派产生的新差异。
该统计包含 6539 个条件、1259 个黑板/随机/属性快照动作、6688 个 TargetGroup、2620 个伤害、2493 个
Buff、41 个治疗、457 个资源/标记/CD、3137 个投射物/能力实体/技能调用，以及 273 个实体/
Owner 生命周期动作和 219 个时间膨胀动作。
当前导出中的 187 个普通时间膨胀动作把 `timeScaleCurve` 直接保存为关键帧数组，共 288 个关键帧；
反编译字段确认其运行时类型是 `UnityEngine.AnimationCurve`。combat-spec 已同步支持当前关键帧数组与
旧导出器的 `FAnimationCurve` 包装表示，并统一进入同一求值结构。来源 IR 已按当前字段签名
187/187 严格读取；Endaxis 的时间缩放仲裁、时钟与曲线执行投影仍需单独接入，不能把来源可读
误写成模拟执行已完成。
2459/2459 份 SkillData 均通过动作图根结构读取，共包含 39529 个时间轴项和 112 个被动事件。
其中 5 个敌方被动事件把 `abilityEvent` 序列化为未命名数值 0，来源层保留该数值而不猜测事件名；
该动作图统计只证明容器、时间和叶子身份可读，叶子进入正式公共 IR 仍以上述统一入口结果为准。
引用图切片当前 2459/2459 份 SkillData 完整成功，共生成 14970 条引用边：8998 条活动静态边、
5902 条关闭残留边、70 条启用但空 ID 的边。技能根引用也保留在同一节点中，活动边指向 1807 个
唯一的带类型定义身份。以 Skill 与 Buff 联合定义仓递归求解时，全部 2459 个 Skill 根可带入
1112 个 Buff；仍缺 3 个 Skill 与 6 个 Buff 定义，继续作为 `missing` 诊断，不能按 ID 拼写补定义。
AbilityEntity 与 Projectile 的定义索引尚未接入，因此本阶段只保存其引用身份，不宣称闭包完整。
BuffData 现已复用同一 Sequence、Action 叶子和引用边入口，而不是建立 Buff 专用动作编译器。
2678 份 `buff-data-current` 已全部完整读取，包含 624 个时间轴项和 3109 个 Buff/能力/点燃事件；
其中数值型能力事件继续保留原始整数，不猜测枚举名称。共收集 2338 条引用边：1909 条活动静态边、
383 条关闭残留边、24 条动态边和 22 条启用但空 ID 的边；按类型为 Buff 1588、Skill 539、
AbilityEntity 110、Projectile 101。
SkillData 与 BuffData 已可转换为同一种定义节点并交给纯闭包求解器，下一步接入 AbilityEntity 与
Projectile 定义容器，随后才能对选定干员、武器或装备根给出完整且可解释的递归闭包。
当前本地证据只有 `AbilityEntityTable`/`AbilityEntityTemplateData` 的静态字段与运行时查表链，尚无
模板资产；Projectile 定义资产同样未导出。联合闭包因此明确报告 144 个唯一 AbilityEntity 目标和
359 个唯一 Projectile 目标缺定义，而不会拿旧版模板、SkillData 文件名或 ID 命名规律伪造节点。
完整 SkillData 中的 295 个被动定义已全部通过同一公共入口：282 个 `AddBuff`、13 个
`ToggleBuff`，合计 176 个启动 Buff、92 个条件 Buff 组、96 个时间轴和 112 个被动事件。
其中 136 个定义携带 180 项 `cardAttributeModifier`；公共 IR 保留修正目标、属性、公式槽和
黑板数值来源，不把 CardSkill 静态面板路径与战斗被动 Buff 生命周期混为一谈。
`ToggleBuff` 使用的 25 个 `CheckCurHpRatio` 均保留比较枚举与 Scalar 来源；生命比例读取和比较执行
尚未在场景投影闭环，因此这里只能标记来源可读，不能标记模拟已支持。
当前 278 个 `PotentialTalentEffectTable` 效果包的 603 个联合载荷可由发现入口扫描，得到 36 条
`AddPassiveSkill` 请求、15 个唯一被动 SkillData；其中 28 条请求携带输入黑板。一个效果包可按表内
顺序产生多条请求，`levelSource=nativeDefault` 保留原生没有设置 CreateSkillOptions.level 的事实。
当前 77 个 `WeaponBasicTable` 武器产生 226 条请求、117 个唯一 SkillData，全部能在完整 SkillData
仓中找到定义。发现层不根据 ID 前缀区分属性词条或武器特效，也不提前解析其行为。
全量武器成长审计覆盖 31 条基质定义、1925 组真实突破与潜能组合、5650 个技能槽结果，当前
0 失败。5 件三星武器的两项技能合法消费三项模板边界中的前两项，尾部 `(0, 0)` 是未引用占位；
该边界已同步回 combat-spec 并由两边测试固定。
基础攻击成长另覆盖 77 把武器、9 条实际引用模板和 6930 个等级行，精确等级修正 6930/6930 成功；
77 个 91 级缺行探针全部返回空。当前基础攻击运行值范围 29–510 仅作为 1.4.4 审计事实记录。
当前 23 个 `EquipSuitTable` 套装产生 23 条阈值请求、23 个唯一 SkillData，全部能在完整 SkillData
仓中找到定义。发现层不使用显示名，不把当前样本中的 `equipCnt=3` 或 `skillLv=1` 当成固定规则。
当前固定版本的 243 个 `EquipTable` 单件装备与对应 `ItemTable` 身份全部严格读取，合计 1012 条属性修正；
`attrIndex` 为 0–3，当前值表均为四档，目标模式为 `Specific/Main/Sub`，公式槽为四类基础槽。
这些只作为 1.4.4 全量审计结果记录，解析器不把当前取值集合固化为规则。
正式定义组装同样达到 243/243、0 blocked：73 件护甲、65 件手套、105 件配件，共 672 条可见词条、
721 个正式修正；另有 48 条只影响玩家承伤的原生修正按当前木桩模型记录为 `scenario-omitted`。
三类入口联合后共有 285 条安装请求、155 个唯一被动 SkillData；公共批量入口已在真实 1.4.4 数据上
完成 155/155 编译。共享定义中 125 个携带 169 项 CardSkill 属性修正，另有 46 个启动 Buff 和
85 个 Toggle 组；这些是同一 SkillData 的不同原生消费路径，后续投影不能只保留其中一类。
