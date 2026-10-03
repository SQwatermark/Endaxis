# 字段查看与编辑组件推进计划

> 状态：推进中。P0 覆盖门禁与 P1 生成语义基础已验收，共享 UI 分派及后续控件尚未交付。本文区分计划与阶段记录，不是整体能力已完成的声明。完成一阶段后更新验收状态；稳定职责归入[编辑器架构](../architecture/editor.md)，已完成的迁移记录由 Git 保存。

## 目标与推进顺序

以 Unreal Engine 的 Blueprint + Details/Property Editor 为主要交互与架构参照：同一个有类型的值，既能在属性面板查看/编辑，也能在运行时契约允许时通过数据引脚输入。让相同语义的字段在资产定义、动作节点、数据节点、创建表单中保持一致，同时保持普通常量编辑简洁。

先修复“契约语义在生成和分派中丢失”，再补共享控件与引用解析，随后扩展运行时能力。不要按文本框数量逐个替换，也不要为了复用控件给所有字段接线。

建议的交付顺序：

1. P0：固定分类与可验收基线
2. P1：生成器保留语义，共享查看/编辑分派
3. P2：引用解析及选择器贯通两套表单
4. P3：复用数值/条件引脚，完成字符串操作数与黑板读写表单
5. P4：结构化复合字段、深层字段与条件入口
6. P5：按真实复用需求扩展字符串数据引脚

P2、P3 均依赖 P1；P4 中不涉及字符串数据流的工作可与 P3 并行；P5 依赖 P3 的字段能力和完整运行时设计，不阻塞前四阶段交付。各阶段单独形成可审查、可撤销的修改，不虚设工期。

## Unreal 参照与本项目的取舍

以下 UE 能力依据 Epic 官方文档；“Endaxis 落点”是本计划的设计判断，不代表项目已经实现，也不照搬引擎对象系统。

| UE 参照                                                                                                                                                                                                                                                                                                                                                     | Endaxis 落点与边界                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blueprint 区分执行引脚和带类型的数据引脚，连接需要兼容类型；从引脚拉出可筛选兼容节点。[Nodes](https://dev.epicgames.com/documentation/en-us/unreal-engine/nodes-in-unreal-engine)                                                                                                                                                                           | 控制流继续用 ActionGraphReference，数值/条件用现有数据图。新输入不能因为外形像引用便跨类型连接；本计划不自动引入 UE 的自动类型转换                                                                                                                 |
| K2 schema 单独提供引脚默认值编辑、验证以及 asset picker 判断。[K2 schema](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Editor/BlueprintGraph/UEdGraphSchema_K2)                                                                                                                                                                          | 对支持常量的未连接输入，提供内联 literal/picker；连接后展示来源，停止把内联值当活动输入。属性面板与引脚共享值控件和校验，不复制两份业务状态；没有合法缺省值时保持未完成，不凭空补零                                                                |
| Blueprint 有多种值与引用类型，包括 Object、Actor、Class，且可创建数组。[Blueprint Variables](https://dev.epicgames.com/documentation/unreal-engine/blueprint-variables-in-unreal-engine?lang=en-US)；asset/class picker 有类别过滤元数据。[Metadata Specifiers](https://dev.epicgames.com/documentation/unreal-engine/metadata-specifiers-in-unreal-engine) | 对象实例引用、资源资产身份、类型/类身份不能统称任意字符串。Endaxis 的 Skill/Buff 定义 ID 对应其自己的资源域，不冒充 UObject；只借鉴类型受限 picker、来源展示和跳转。静态 ID 本期默认用字段控件，是当前契约的范围选择，不是声称 UE 的引用不能走引脚 |
| Blueprint struct 可整体传值，也可 Split/Recombine，或用 Make/Break 操作。[Struct Variables](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-struct-variables-in-unreal-engine)                                                                                                                                                        | 先保留 struct/tuple/array/record 的真实结构，Details 中递归编辑并允许收展；可连接叶子可按需暴露，不能把“展开表单”误当“拆分运行时 struct pin”。容器整体数据流与 Make/Break 需新的运行时支持，不纳入本次默认范围                                     |
| Details 区分类型级 customization 与对象/类级布局 customization，并允许未定制部分继续用默认编辑器。[Details Panel Customizations](https://dev.epicgames.com/documentation/en-us/unreal-engine/details-panel-customizations-in-unreal-engine)                                                                                                                 | 可复用的引用、LevelValues、TagQuery、曲线属于语义类型控件；资源面板只负责布局/分组/上下文。默认递归编辑器承担其余字段，不每个动作节点复制一套定制表单。复用既有 path、草稿、校验和命令作为属性访问边界，不照搬 Slate/PropertyHandle 类体系         |
| UE 的编辑器 metadata 不应成为游戏逻辑的数据来源。[Metadata Specifiers](https://dev.epicgames.com/documentation/unreal-engine/metadata-specifiers-in-unreal-engine)                                                                                                                                                                                          | 真正的值类型、引用目标与求值规则来自契约和运行时；标签、帮助、单位呈现、picker 过滤和面板布局属于编辑描述/上下文。metadata 可解释类型，不能把 plain string 变成可运行的动态表达式                                                                  |
| BlueprintReadOnly 与属性窗口的 Visible/Edit 系列规则分别约束不同访问途径。[Property Specifiers API](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/CoreUObject/UP)；局部变量具有自己的可见范围。[Blueprint Best Practices](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-best-practices-in-unreal-engine)        | 分别建模可查看、可修改、可读取、可写入及作用域，而非一个 readonly 布尔包办。内置资产不能修改但应能跳转查看；黑板可读不等于可写。保持 Endaxis 的调用点/局部作用域分析，不套用 UE 的类实例或函数生命周期                                             |

由此确定三条验收原则：

1. 属性面板和图是同一类型系统的两种入口；类型控件负责值，宿主面板负责布局，应用层负责上下文和事务。
2. “允许连接”与“当前使用连线”分开。内联常量是常态，只有表达依赖或共享读取才需要拉线；复杂结构先有结构化属性编辑，不强迫生成一片线。
3. UE 的字符串、对象、struct 和容器引脚不能被当作 Endaxis 的现有能力。本项目现在仅有 number/boolean 数据节点；P3 复用现有能力，P5 才补字符串运行时全链路。未通过契约/编译/运行时验收的类型不开放引脚。

## 已知基线与限制

代码核对基线为 `9d838ee166949b3080acc74fa19cf751fa1fb4dc`。下列计数来自此前 `6da5a59f24ca9dadcd3b75f09db9d7ed648f0928` 的完整审计，作为排序依据；实施 P0 时重新确认差异，不将历史计数当作当前实时覆盖率。

- 429 个字符串编辑位置，来自 231 个去重源声明：定义 240、动作 160、数据 29。355 直接分派文本，74 按是否有候选选择引用控件；其中有合理的人类文字、身份声明及本地化键，并非全部待替换。
- 当前内置数据经过引脚、资源和图引用过滤后，57 个有值位置实际落入 JSON 编辑：18 个复合查询/联合、13 个资源列表、11 个标签集合、6 个动态操作数、5 个黑板映射、3 个时间结构、1 个曲线。频繁出现的 `applyBuff.buffId`、黑板映射和曲线优先，但实例次数不等于组件数量。
- 定义侧 233 个 opaque 分别为 139 个深度截止、50 个资源边界、34 个图边界、10 个无可取值字段；另有 11 个 condition 只读。不能把这些都变成 JSON 输入。
- 当前 `ActionGraphDataNode` 仅有 number/boolean；`valueNode`、`conditionNode` 已是正式图引用。`ActionStringOperand` 只有字符串字面量或 `{ blackboardKey }`，并无现成字符串数据节点。宏实参是 `ActionValueOperand`，不是任意类型的参数系统。
- 现有 object/array/record/union 递归表单、等级值组件、变量清单、图数据连接、命令和历史均应复用。`ReferenceResolver` 与共享语义分派是本计划拟增加的职责，不是已经存在的完整系统。

## 一、先分清字段语义与引脚资格

是否可连接由契约和运行时决定，是否显示为引脚由编辑上下文决定。不能通过字段名后缀、当前值的外形或控件偏好扩大领域模型。

| 类别                             | 查看态                                                    | 编辑态与引脚策略                                                                                                                         |
| -------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 普通文字、显示配置、原生开放编码 | 原值、必要的说明/预览；未知编码保留                       | 默认字段控件。没有封闭值域证据，不发明枚举；普通 string 不自动成为字符串引脚                                                             |
| 数字、布尔、等级值等静态常量     | 值、单位、等级/范围语义                                   | 默认内联。只有契约允许 `ActionValueOperand` / `CombatCondition` 的槽才显示相应连接能力，纯 number 不自动升格                             |
| 数值运行时输入                   | 常量，或读取来源/作用域与数据节点跳转                     | 使用现有 `ActionValueOperand` / `valueNode`；内联常量和连线是同一个输入的两种表达，不重复存两份活动值                                    |
| 条件运行时输入                   | 条件摘要、来源节点及图入口                                | 复用 `CombatCondition` / `conditionNode`；保留短路、顺序及副作用限制。`BuildCondition` 不能直接当作战斗条件引脚                          |
| 字符串运行时输入                 | 字面引用/文字，或“从动作黑板读取”的键与作用域             | P3 使用 `ActionStringOperand` 的现有两分支编辑；P5 才评估可持久化字符串数据连接。不能把 `{ blackboardKey }` 伪装成 number 的 `valueNode` |
| 编译/资源身份引用                | 名称 + 原始 ID + 资源族/拥有者/来源 + 跳转 + 失效状态     | 资源选择器/列表。静态 Skill/Buff/Entity 等身份不因可复用就升格成运行时值；允许动态 ID 的动作仅在已声明的 operand 槽中提供动态分支        |
| 身份声明                         | 唯一身份及只读/归属标识                                   | 创建时校验唯一性；已有受保护身份保持只读。声明与引用不共用“改名”的写入语义，不作为输入引脚                                               |
| 黑板数值读取                     | key、number、调用上下文/局部作用域、fallback 是否明确存在 | 复用 `kind: 'blackboard'` 和已有数值读取节点；显示作用域和遮蔽，支持在兼容数值输入创建读取并接线                                         |
| 黑板字符串读取                   | key、string、作用域；无法静态确定时提示                   | P3 使用 `ActionStringOperand.blackboardKey`；与数值读取共用目录和状态展示，不合并两种契约形状                                            |
| 黑板写目标、输出键、变量声明     | 写入/声明标识、键、类型、目标作用域                       | 语义选择器或创建变量流程；写目标不是读取所得的值，不能把读取节点接到 outputKey 等位置。动态寻址需单独需求与契约支持，本计划不引入        |
| 宏参数                           | 参数声明/读取/调用实参三者分清，定位宏接口                | 声明和 `macroId` 用字段控件；数值实参/读取复用现有参数及数值输入规则。调用点实参仍不得包含 parameter 操作数，不扩展字符串/布尔宏参数     |
| 执行图引用、独立资源边界         | 图入口、所属资源、空分支语义                              | `ActionGraphReference` 走控制流及导航，保持 `$sequence: null` 与缺省区别；不能接到普通数据输入，不能跨资源平铺节点命名空间               |
| 容器、查询、曲线、映射           | 结构摘要 + 可展开的类型化内容                             | 默认结构化容器，叶子按语义分派。只有契约声明的叶子可接线；不增加“任意对象/数组”万能引脚                                                  |

重要例子：`applyBuff.buffId` 的字面量用 Buff 选择器，动态分支选择字符串黑板键；黑板映射左侧是写目标，右侧按各自契约分别为字面量、读取源或数值操作数，不能共享一个无模式的 KeyPicker。

## 二、共享结构与边界

### 契约 → 生成描述 → 上下文 → 展示/编辑

- 领域身份和值约束归 `packages/game-data-contract`。优先复用已有 `GameplayTag`、操作数、条件与图引用；仅在确有跨边界语义时引入领域身份类型，不另造 GenericRef、另一套 ValueOperand 或图引用模型。
- 两个生成器保留同一份字段语义：引用族、值类型、读/写/声明用途、容器子槽与联合分支、可选性、说明、单位等已被证据支持的信息。先检查现有别名/符号/声明信息能否可靠保留；普通 `type X = string` 可能被 TypeChecker 展开，必须用代表性测试证明识别有效。
- 类型不足的旧 string 位置可保留明确的编辑配置，但以契约声明/精确路径及用途为依据，收束 `REFERENCE_FIELD_KIND` 的字段名猜测。UI 展示配置不复制运行时模型；资源候选、当前语言、只读权限归上下文，不写死在生成产物。
- 在现有 `DefinitionFieldSchema`、`NodeFieldSchema` 上共享必要的语义片段与分派逻辑；不强行把两套不同结构的 schema 全部合并。`resolveFieldEditor(schema, context)` 是拟议纯函数入口，同时给出查看呈现、编辑能力和明确的后备原因。
- 定义表单、节点检查器、`DefinitionValueCreator` 以及 optional/union/array/record 新建入口使用同一分派。保留现有递归容器，提取或复用叶子与复合控件；不在两个面板各写一份条件链。
- 查看态也消费语义：内置只读资产仍应有名称、原始值、来源与跳转。组件不能因不可编辑便只显示原始 JSON，也不能假装未求值的黑板读取已有当前运行值。

### ReferenceResolver 的应用层职责

输入至少包含资源族、owner、当前资源图/宏、调用点/黑板作用域、期望值类型、读写模式、项目及内置目录。图上下文缺失时明确报告，而不是按全项目候选猜测。

输出应区分：候选与稳定身份、显示名称/原始键、来源资产/owner、匹配状态（有效、失效、歧义、不可见、上下文未知），以及可用导航目标。候选状态与当前值状态分开，不能用 `choices.length` 判断字段是否仍为引用。

- 空目录：保持引用控件，说明暂无候选；只有契约允许声明/外部开放值时才提供明确的新建/外部输入路径。
- 失效旧值：原样显示并允许修复，不自动置空、不自动选择第一项；保存仍遵守领域校验，不能为了兼容静默接受非法值。
- 局部与公共同名：显示来源，使用真实查找优先级；无法证明唯一性时标注歧义。
- 动态黑板：复用 `graphBlackboard.ts` 的分析，区分已知越界与可能由外部调用提供的未知上下文；共享节点不假定唯一作用域。
- UI 不直接遍历全库，不自行复制解析规则。应用层使用现有资源目录和导航能力；编译/运行时保持自己的严格身份解析，共享可复用规则而非依赖 Vue。

### 编辑事务

控件产出类型化草稿/修改意图，由 `definitionDraftSession`、`skillGraphCommands`、`immutableGraphDocument` 等已有入口整体校验、应用与撤销。取消、失焦、切换节点或卸载不得留下半次修改。

连线替换与切回常量形成单次事务；拖线失败保留旧线。断线不凭空填零，也不缓存运行时读取结果为常量：可恢复明确保留的编辑草稿，或要求选择合法内联表达式。删除共享来源不能误删其他消费者；自动清理孤立节点应另有明确规则。

## 三、分阶段交付与验收

### P0：覆盖基线与分类决策（已验收，见首阶段记录）

**交付**：可维护的字段能力清单和小型代表性夹具。键按入口 + 路径 + 联合分支区分，记录源声明、语义类别、查看/编辑/连接能力、后备原因和负责阶段。源声明去重统计与展开位置统计分开。

**落点**：`tools/editor/` 生成器检查；现有审计结果作为输入，必要的稳定分类结论进入测试/能力清单，原始一次性报告不搬入仓库。核对最近提交相对审计基线的变化后再刷新分母。

**验收**：可说明每个 JSON/opaque/readonly 属于缺口还是刻意边界；57 个已观察 JSON 位置有去向，355 个文本位置无需一概处理。当前无值但可能暴露的 operand/optional 分支也有代表样本。

**不做**：重新全库“统计文本框”后直接认领全部为缺陷；仅根据字段名推断封闭枚举。

### P1：保留类型语义和统一分派（生成基础已验收；共享分派待接入，依赖 P0）

**交付**：按 Details 的类型级控件/宿主布局分工，提供生成描述的公共语义部分、共享查看/编辑分派、两套表单适配层；首次接入保留原控件行为。

**落点**：`tools/editor/generateDefinitionSchemas.ts`、`generateActionNodeSchema.ts`；`src/ui/definition-editor/fieldSchema.ts`、`definitionFieldRuntime.ts`；`src/ui/action-graph/nodeSchema.ts`、`NodeInspectorFields.vue`。生成产物仅由正式命令生成。

**重点**：数组与 record 值槽保留语义；union 分支切换不丢 referenceKind；tuple 保留每槽类型与固定长度，不能继续取第一槽当同质数组；LevelValues 在定义侧也可被识别；description 进入既有帮助入口，不堆叠冗余文案。

**验收**：用少量包含 alias、union、tuple、optional、array/record 的契约夹具检验语义不丢失；相同语义在两套适配器分派一致；两个 schema 一致性检查通过，生成可重复且无手改产物。

**不做**：一口气添加所有领域控件；新建与既有契约平行的描述语言；为每个实例生成快照测试。

### P2：引用查看、选择与候选上下文（待实施，依赖 P1）

**交付**：应用层 ReferenceResolver，资源/身份/属性等引用控件及列表；资产定义和动作/数据检查器使用一致的来源展示与跳转。

**落点**：`src/ui/asset-workspace/AssetWorkspace.vue` 的候选组装，`fieldInputConfig.ts`、`DefinitionField.vue`、`DefinitionValueCreator.vue`、`ActionNodeInspector.vue`、`DataNodeInspector.vue` 与相关图面板的上下文供应。

**优先修复**：动作面板未传 choices；skillGroup 候选供应缺失；skillKeys 等静态引用分类遗漏；record 新建值未走引用控件；union 分支丢语义；空候选退文本。skillGroup 供应链问题不额外伪计为已观察到的编辑位置。

**验收**：局部/公共同名、空目录、失效旧值、删除后的悬空引用、跨 owner 候选、只读跳转；创建/optional 恢复/union 切换/数组与 record 增删均保持同一语义。候选更新不覆盖未提交草稿；非法引用提交失败并保留用户输入。

**不做**：把静态资源 ID 变成运行时引脚；自动修复歧义；新增非用户请求的资源改名级联操作。

### P3：操作数、黑板与已有引脚（待实施，依赖 P1；引用分支依赖 P2）

**交付**：按 Blueprint typed pin + default literal 交互，提供数值/条件输入的统一查看与内联/连线编辑；`ActionStringOperand` 两分支控件；黑板读键、写目标、初值/复制映射组件；宏参数的类型化入口。

**落点**：`src/core/action-graph/actionGraphDataNodes.ts` 的输入投影、`graphBlackboard.ts`、`useGraphVariables.ts`、`BlackboardPanel.vue`、`graphCanvasView.ts`、两种节点检查器与既有图编辑命令。映射组件复用容器与叶子，不重新实现 JSON 编辑器。

**重点**：输入能力按 schema 与运行时支持明确暴露，不能只在已有实际值碰巧符合 expressionType 时才出现。可选输入未赋值时先选择合法表达式，再创建/接线，不创建虚构变量。`initialValues`、`entityInitialValues`、`copiedBlackboardAssignments`、`stringBlackboardAssignments` 按各自契约区分左右两侧。

**验收**：数值常量 ↔ 黑板读取/连线；布尔条件内联/连线；共享读取在不同上下文分别求值；明确 fallback 与缺省严格错误区分；宏参数只在合法位置出现。黑板读值与写目标不得接错，string 不能接 number/boolean。连接、断开、取消、撤销重做、保存重开都保留语义。

**不做**：字符串数据节点、任意类型宏参数、动态黑板写地址；变更执行时机、短路或求值缓存策略。

### P4：结构化复合字段与深层入口（待实施，依赖 P1；引用叶子依赖 P2）

**交付**：将已分类 JSON 后备分批替换，按语义族验收后关闭条目。

1. 资源引用列表、GameplayTag 集合：复用 P2 与标签层级/搜索，保留空值、顺序和允许的重复语义，不盲目去重。
2. 时间曲线和周期参数：复用 `NodeLevelValues.vue` 能力并适配定义侧；曲线用 named/inline 分支、关键点表与预览，保留切线、权重、单位及排序约束，不把曲线简化成线性插值。
3. 判别联合/查询：如 Buff 查询、目标选择、相对/绝对属性、投射物 hit/finish。字段按分支结构组合；嵌套图入口导航到所属图，不能整体 JSON 写入绕过图规则。
4. 深层字段：对 139 个 depth 截止位置按真实类型递归/延迟展开，并设置防递归与性能边界；50 个资源边界、34 个图边界保留导航；10 个不可取值位置不创建编辑器。
5. 条件：区分 BuildCondition 与 CombatCondition。前者保持定义期条件树语义，后者按合法图上下文提供条件编辑/图入口，不能为了复用把两者转换成同一运行时模型。

**落点**：递归 DefinitionField/ValueCreator、共享复合控件、`NodeInspectorFields.vue`、生成器的深度/边界处理和相关领域校验。

**验收**：57 个历史位置逐项记录替代或保留理由，新增字段不得无说明退 JSON；复合值导入 → 修改一个叶子 → 保存重开不丢未知但被契约允许的其他内容；只读资产能查看结构而不误写。大型容器和递归类型不会无限展开。

**不做**：跨资源内嵌编辑、通用对象引脚、所有资产的自定义持久化支持。尚无保存通道的资产仍受现有只读边界约束，此类持久化工作单独推进。

### P5：字符串黑板读取的可复用数据引脚（待设计后实施，依赖 P3）

**首个验证场景**：同图中两个明确接受 `ActionStringOperand` 的动作共享一次“字符串黑板读取”的表达式定义，但在各自使用点读取各自当前上下文；常量 Buff/Skill 仍以内联选择为默认。

**设计关口**：在现有 `ActionStringOperand` 和 `ActionGraphDataNode` 上选择最小的类型化扩展，并明确字符串节点引用判别。不得把 string 挤入 `ActionValueOperand`，不得用现有 number `valueNode` 欺骗类型，也不得建立第二套独立的数据图存储。具体判别命名随契约设计确定，UI 原型不先写入无法执行的存档。

**必须同批覆盖**：

- 契约表达、生成器、编辑输入与数据节点类型
- `actionGraphData.ts` 绑定/循环/类型校验，`actionGraphDataNodes.ts` 提取、输入发现、复制及连接规则
- `src/core/game-data/validation/definitionValues.ts`、`actionPrograms.ts`、`combatConditions.ts` 等操作数验证，以及编译/动态字符串读取消费路径
- 资源隔离、主图/宏可见性、黑板来源分析、撤销命令、节点删除与保存/加载
- 源数据生成流程与现有定义序列化；新格式若需要重生成，走正式生成流程，不手补生成文件

**兼容策略**：先列明当前项目存档、内置生成定义和明确支持的旧版导入范围。尽量让已有 string / `{ blackboardKey }` 原样可读，未编辑值不批量改写；没有跨发布兼容要求的开发中格式不增加永久兼容层。确需升级时使用现有项目版本/导入边界显式迁移，提供失败诊断并确保迁移幂等。不能让新格式被旧读取器静默当成普通对象忽略。

**验收**：旧内联数据 round-trip、混合新旧输入、缺失节点、跨图引用、循环、类型不匹配、当前作用域变化、运行中动态 ID 解析；内联与图引用求值等价，共享的是表达式而不是先算出的字符串。校验、编译与运行时未全部通过前，UI 不开放此连接类型。

**不做**：动态执行图身份、资源目录对象引脚、任意对象/容器引脚、字符串宏参数和动态写目标。未来只有具体需求和运行时契约证明必要时再扩展。

## 四、门禁与完成定义

### 覆盖门禁

采用“能力覆盖”，不以文本框降至零或测试行覆盖率为目标：

- 每个生成字段必须有查看结果、编辑能力或明确只读/导航/不适用原因；有语义的引用不能静默退成普通文本。
- 每个新出现的 JSON/opaque 后备都要求原因与负责阶段。基线允许项可以逐步减少，不能通过改统计过滤器掩盖退化。
- 分开报告 schema 位置、去重声明及运行实例；当前数据未出现的分支也须由代表夹具覆盖。全量枚举用作生成覆盖检查，不在常规单测重复导出全部原始资源。
- 不依赖 `combat-spec`、私有数据、原始资源服务或联网才能运行核心回归。契约/编辑器使用最小自包含夹具；需真实数据语义的检查使用仓库已提交定义及正式导出验收。

### 每阶段检查

按变更选择现有命令，不宣称仅有类型检查便完成交互：

- 元数据变更：`check:editor-nodes`、`check:definition-fields`、`test:editor-schema` 与针对性生成器回归
- 类型边界：`type-check`、`type-check:game-data-contract`、`type-check:tools`；触及生产转换器再加对应 production 检查
- 行为：已有 definitionFieldRuntime、nodeFieldValues、graphBlackboard、actionGraphDataNodes、图编辑命令与历史测试，补充能暴露上述故障的少量场景
- 图/运行时变更：绑定与校验、编译和执行回归，验证短路、副作用限制与调用点求值不变
- 界面：`test:browser` 中适用的用例和实际浏览器验收，覆盖两套表单、只读/可写、空候选、失效引用、创建与取消、连线、撤销重做和保存重开；涉及浏览器测试源码时运行 `type-check:browser`
- 交付前：格式、`git diff --check`、适用的测试/类型检查及 `build`；具体记录通过、失败、未运行和剩余边界

### 阶段验收记录模板

每阶段保留：范围与依赖、修改入口、已关闭的能力缺口、仍有理由保留的后备、验证命令及浏览器场景结果、序列化影响、未解决问题和下一阶段入口。没有运行时支持的 UI、只有控件没有候选上下文、只能编辑不能保存/撤销，都不能标记完整能力已交付。

当前建议按上述 Unreal 参照从 P0/P1 开始，第一条端到端竖切选“定义侧和动作侧的静态 Buff 引用 + `applyBuff.buffId` 字符串黑板分支”。它能同时验证生成语义、上下文、只读查看、动态/静态区别以及创建/编辑复用；字符串输入引脚留到 P5 关口后开放。

## 首阶段记录：覆盖门禁与生成语义基础

范围为 P0 与 P1 的生成基础，不包含 P1 全部共享控件接入。新增 `tools/editor/fieldCapabilities.ts`、显式后备清单及 `check:field-capabilities`；两套 schema 从同一个提取器保留既有类型别名、声明来源、容器/联合和 tuple 槽信息。完整原因、分类、责任阶段可用 `npm run check:field-capabilities -- --report` 复查。

- 与旧审计相比，`9d838ee` 只更新字段说明，控件结构未变。此次动作/数据控件种类保持不变；只有定义侧三个 tuple 不再伪装同质数组：`operator.skillAliases[].from/to` 与 `enemy.levelHp`。槽类型和长度已保留，在逐槽控件接入前明确只读；这不是三个编辑缺口已完成
- 同口径计数：定义非根位置 2,116 → 2,113，减少的是上述 tuple 原先错误生成的三个同质元素槽；定义 opaque 233 → 236，仍含原有边界而不是新增三种组件。原先 139 个深度截止进一步准确区分为 131 个深度截止 + 8 个递归边界；其余 50 个资源、34 个图引用、10 个无可取值位置及 11 个条件保持不变
- 原审计“文本或旧引用分派”口径 429 → 427 个字符串位置、231 → 229 个去重声明，减少仅来自别名 tuple 的两个错误同质槽。全部 string schema 另含两个已接作用域选择的数值黑板/宏参数字段，因此当前原始 string schema 是 429 个位置 / 231 个声明；两种口径不混算。动作 452、数据 152 字段槽和 85 个 JSON control 位置保持不变
- 历史有值 JSON 的 57 个位置全部保留排期：复合结构 18、引用列表 13、标签集合 11、字符串操作数 6、黑板映射 5、时间结构 3、曲线 1。尚未关闭这些控件缺口；未赋值及混合 `LevelValues | ActionValueOperand` 的输入能力也纳入门禁
- 后备清单区分结构缺口与图/资源/无可取值边界。普通开放字符串仍用基础控件，已有身份保护由表单、命令和能力清单共用；不会把每个文本位置都认领成错误
- 代表夹具覆盖别名展开、导入、泛型包装、optional、联合、array/record、tuple、递归与未知类型，并包含同名非契约类型和普通字符串负例。生成一致性与能力检查加入 CI，不依赖原始资源或联网
- 序列化：未修改领域契约、已提交游戏定义、项目存档或运行时求值。仅生成编辑元数据；未开放 string 数据引脚
- 下一阶段：完成 P1 的共享查看/编辑分派、帮助与上下文适配，保持 union/optional/array/record/创建入口的引用语义；再按 P2 接 Buff 引用与候选解析、P3 接动态字符串黑板分支。元数据存在不代表这些 UI 已接入

验收：独立审查无剩余阻塞。`check:editor-nodes`、`check:definition-fields`、`check:field-capabilities`、`test:editor-schema`（13 项）、`type-check:game-data-contract`、`type-check:tools`、应用 `type-check`、`npm test -- --maxWorkers=1`（455 文件、3,832 通过、1 跳过）、`build`、修改文件 Prettier 与 `git diff --check` 通过。应用类型检查在默认约 2 GB 堆上遇到环境既有的 OOM，使用 `NODE_OPTIONS=--max-old-space-size=4096` 复跑通过；跳过项是未开启 `globalThis.gc` 的堆释放审计。构建仍有大 chunk 提示，本阶段未做加载性能基准。

本阶段未运行浏览器交互验收、生产转换器导出或联网原始数据验收，不以静态/单元检查声称共享 UI 已交付。下一阶段共享分派与控件接入必须补浏览器验证。新增声明来源和语义使两个生成文件合计从约 384 KB 增至 792 KB；已限制原子类型展开并复用生成对象，仍需在后续 UI 接入时关注加载体积。
