# Inspector 元数据与属性编辑架构

## 目标与五层职责

采用游戏引擎属性编辑器架构。权威结构位于 packages/game-data-contract；不得向契约或战斗运行时引入 Vue、显示名称或编译器依赖。

1. 属性描述：从 TS 契约提取成员、枚举、容器和引用，不推测游戏规则。
2. 编辑注解：只补标签、帮助、分组、控件选择，不重复声明结构。
3. 属性句柄：持有相对保存范围根的完整路径，读取最新草稿，直接提交统一上下文。
4. 编辑器注册表：基础类型默认编辑，特殊语义局部覆盖，同类控件到处复用。
5. 视图：Inspector 编辑参数，节点图编辑递归条件与序列结构，共用一份草稿。

步骤显示差异集中在 stepInspectorSchema.ts 的 stepAnnotations 声明表，使用 satisfies StepAnnotations 约束契约步骤名与字段名。每项仅允许 labelKey / helpKey / optionLabelPrefix，不允许重列结构、默认值或写入逻辑；display 只缩写 i18n 前缀。共有文案复用同一注解对象。冷却等确有联动的行为仍显式保留为字段写入规则，不能伪装成显示注解，也不能新增专用组件代替公共字段。

## 统一草稿与历史：当前迁移契约

definitionEditContext.ts 接收宿主 read / commit；root 或 at(path) 返回句柄，child(key) 派生子句柄，update(change, focus) 修改最新根并一次提交。句柄不持有快照或历史；无变化不提交，缺失容器不重建。路径按字符串/数字段保存，含点字典键不拆分。

普通字段的定位来自句柄，不由中间组件逐层拼接转发。新增、删除、移动等结构命令应通过同一上下文提交，并明确恢复位置，不通过 diff 猜测编辑意图。历史继续复用 useDefinitionDraftHistory 的快照机制，不另建历史栈。

派生复合字段通过 projectDefinitionProperty 保留父字段 read/write；子句柄直接提交并不意味着绕过父字段的联动、省略或校验。例如删除最后一项 Buff 赋值必须经父规则省略 blackboardAssignments，而不是留下空对象。缺失父容器的失效句柄不重新创建数据。

DefinitionPropertyScope 仅指定视图绑定位置，不接收 update、不转发事务。InspectorFields 的 binding 模式直接读取句柄并提交；inspectorProperty 继续负责字段写入、禁用、可选启停与错误筛选。联动字段仍为一个事务。

已接入真实链路：ActionSequenceGraphEditor 与 SkillDefinitionEditor 的自动步骤参数和本层条件。步骤派生 parameters 句柄，条件使用当前句柄；自动字段不经 CombatStepEditor / CombatConditionEditor 的 update 转发。两者共用 locateStructureProperty，将完整路径映射为历史节点位置；恢复时选中节点并定位字段。条件节点的旧 update 监听已删除，技能宿主的 replaceSelectedCombatCondition 也已删除。技能宿主保留原有快照历史，直接句柄与已有结构命令共用该栈。

对象、数组、字典、联合的已绑定模式使用直接子句柄，透明 value 包装不增加真实路径。集合增删、移动、改名与联合切换直接提交属性；editPropertyValue 统一迁移期的新旧入口选择，读取最新句柄而不是旧 props。父属性的动态禁用约束随子句柄继承。数组 → 字典 → 联合 → 对象 → 字段的真实控件测试确认一次根事务，外层 update 不触发。

BuffDefinitionGraphEditor、AbilityEntityDefinitionGraphEditor 的自动步骤参数与条件也已接入。两者复用 useDefinitionGraphEditing 提供根上下文、选中属性和恢复定位，保持原保存范围与共享历史，不改写为独立序列根。两处 updateCombatCondition 及对应监听已删除。四个图宿主的历史测试包含直接句柄修改；旧专用参数与结构操作仍走原入口，共用同一历史。浏览器展开与焦点尚待验收。

尚未完成：其他图宿主、完整表单、结构命令仍有旧入口；未绑定宿主仍需复合控件的旧 update 兼容路径，因此本次未删除这些兼容模板。旧 propertyPath 逐层转发是迁移债务，不再作为最终架构扩展。未迁移专用编辑器隔离父句柄，避免内部字段误写父节点。

useInspectorPropertyReveal 仅改变视图：定位字段、展开 details、聚焦可用控件；异步挂载最多等一秒，无可用控件则定位容器。新请求或卸载取消旧等待。图宿主暂时兼容未迁移字段的相对路径，后续应删除兼容。

已有最新值读取、含点键、无变化、缺失容器，以及真实条件控件直接提交、一次事务、撤销重做测试。新上下文链路尚未做浏览器视觉验收，不能宣称全部宿主覆盖。

## 自动准备元数据

contractSchema.ts 使用 TS 编译器读取契约；sync.ts 一次提取条件和步骤后再写缓存，相同内容不重写。

- vitePlugin.ts 在开发、构建、Vitest 启动自动准备。
- 开发监听整个契约目录，包括仅类型引用的依赖，并使受影响模块失效。
- 构建通过 addWatchFile 注册契约。
- npm run type-check 的 pretype-check 自动准备；直接运行 vue-tsc 没有此生命周期。
- src/ui/timeline 下的 conditionStructure、stepStructure、modifierStructure、contributionStructure、eventStructure.generated.ts 是被 Git 忽略的本地缓存，不手改、不提交，无需手动生成命令。
- 语法错误报告契约位置，保留最后有效缓存；尚非所有不支持类型都有源码定位诊断。

数据流：TS 契约 → 自动元数据 → 显示注解 → 公共控件与属性句柄 → 保存宿主草稿/历史。

## 描述与控件能力

70 类条件中 67 类参数自动编辑，not/all/any 属于图结构。88 类步骤中 76 类参数对象（含 6 类空参数）和 1 类根联合可自动描述。这是描述覆盖，不是完整迁移率。

支持基础值、枚举、操作数、字符串引用、有限对象/联合、数组及纯字符串键字典。

- LevelValues 保留单值或完整逐级数组，普通数值数组不推断为等级。
- 联合切换整体替换，不残留旧字段；非法草稿交给领域校验。
- 数组不自动去重排序；字典拒绝空键与重名覆盖，特殊键按自有属性处理。
- 删除最后一项保留空集合；省略由可选字段启停表达。
- 可选字段初值是编辑草稿，不是游戏默认值。
- Record<string, never> 是空参数，不提供字典新增入口。
- 定义、序列、条件递归引用不能作为参数展开；未支持结构保留明确入口，不静默丢字段。

inspectorEditors.ts 提供默认注册表；工作区通过 inspectorEditorRegistryKey 局部覆盖，extendInspectorEditors 不修改全局表。当前按编辑类别注册，尚未建立稳定契约类型身份。控件不拥有草稿与历史。

## 收束顺序与验收

1. 验证统一上下文的真实通路、直接提交、联动修改和恢复定位。
2. 复合参数派生子句柄，再接其他宿主，同步删除逐层 update/path 转发。
3. 结构操作汇入同一提交入口，保留明确结构定位策略。
4. 替换旧专用表单并同步删除，进行浏览器交互与完整回归。

已删除 AbilityEntityTimedMarkerStepEditor.vue（117 行）和 BlackboardCaptureStepEditor.vue（125 行）；计时标记及局部帧/技力/治疗/护盾捕获的完整参数表单复用生成字段。本次上下文接入未删除其他专用面板，不改变模拟规则或技能块文本。

每轮报告实际替代/删除内容与验证边界，不以覆盖数字代替完成度。

Buff 的 damageModifiers[].conditionProgram 已投影为现有 sequenceNode，程序内部的监听、条件和动作复用普通图结构及编辑命令；内联 Buff 自动沿原投影逻辑补齐完整路径。BuffDamageModifierEditor 在主图可达时只提供返回主图入口，不再展开这条程序的递归表单。创建/删除程序仍属于伤害修正配置，图上负责编辑程序内部；不改变伤害处理规则。测试覆盖独立/内联路径与不可变追加步骤。

结构导航已扩展到 useDefinitionGraphEditing 的 Buff、能力实体、装备宿主；角色级行为与连携条件的序列入口改用 ActionSequenceWorkspace，继续传入原 sequenceHistory，不创建保存范围外的历史。导航提供只读 canNavigate 检查：仅当前主图中可唯一定位的对象才隐藏旧监听表单，嵌套结构未被图收录、过期或多重引用时保留原入口。旧递归表单仍未全量删除，不能仅凭存在导航 provider 就隐藏它。

技能编辑器与 ActionSequenceWorkspace 已提供共享结构导航。旧监听完整表单在这些宿主下仅显示“在主图中编辑事件响应”，不再展开第二套递归表单；导航按当前草稿对象身份查找唯一图路径，过期或多重引用不猜目标，不产生历史事务。独立序列在视图切换后保留同一历史，并让显式导航优先于旧撤销位置。无导航宿主暂保留旧表单，后续补齐这些入口后才可删除文件；不能宣称递归表单已全量移除。导航测试覆盖视图切换、目标选中、历史保留和过期对象拒绝，浏览器交互尚待验收。

EventListenerStepEditor 的 key/事件参数已复用 eventOwnerInspectorFields 与 CombatEventTriggerEditor 的句柄通路，删除手写 key 输入和 setEvent 转发。参数绑定由 CombatStepEditor 提供；未绑定的旧完整表单只有根 update 适配，不创建新历史。响应增删通过当前集合句柄执行并保留至少一项。旧完整表单的条件/序列结构入口仍保留：必须先接通返回主图并定位的导航，才能删除，不能用嵌套独立历史图替代。测试覆盖绑定与兼容入口的参数修改、撤销及增删限制。

图中的 CombatEventResponseInspector 与 SkillEventHandlerInspector 已合并为一个响应面板（删除后者）。两类 key 分别来自 actions.ts 自身契约的成员提取，响应条件、同步序列和调度序列仍由图拥有。技能、独立序列、Buff、能力实体四个图宿主传入选中对象句柄，删除四个专用响应更新函数及对应转发；事件字段沿 event 子句柄直达共享历史。技能/独立序列的撤销定位也使用完整事件字段路径。完整旧表单 EventListenerStepEditor 的递归编辑尚未迁移，不能将本轮图宿主接入宣称为所有事件入口完成。

共享历史快捷键覆盖 Inspector 输入框：Ctrl/Cmd+Z、Ctrl/Cmd+Shift+Z、Ctrl+Y 不再让给浏览器原生文本撤销。change/blur 型控件先失焦提交，等待 Vue 更新父草稿后再恢复历史；宿主已卸载或禁用时取消排队的恢复。激活范围为最近的编辑 dialog（无弹窗时为编辑根），包括标题、底栏与留白；不能以 Inspector 内容根判断整个保存范围是否失活。输入区域路由仍隔离嵌套弹窗与后台工作区。复制、粘贴、光标操作及输入法组合键保持原处理。测试覆盖输入焦点、弹窗留白下撤销/重做和待提交值顺序，不要求先切换节点；浏览器实际交互仍需验收。

装备属性修正字段已从 EquipmentModifierDefinition 自动提取，复用同一 TS 描述器与启动/构建/热更新链路；不手写枚举或分支结构。公共字段接管属性、运算、面板属性、修正目标、公式槽与等级值，删除六个专用 setter 和逗号等级值解析器。公式槽省略/启用保持 BaseAddition 兼容；等级值改用公共单值/逐级值控件。

伤害/技能类型筛选也已接入公共 enumSelection 控件，删除图宿主的三套选择/切换逻辑与按钮模板。该控件是显式展示注解，不把普通 enumList 隐式改成集合；候选值来自提取的联合类型。必选字段不能清空，可选筛选显示“全部”并在清空时省略字段；原单值/数组结构只在用户修改时按既有规则写回，打开面板不修改或去重数据。所有修改仍经字段句柄进入同一历史。测试覆盖这些边界及真实注册表 SSR 按钮状态，不能替代浏览器交互验收。

EquipmentEventHandlerDefinition 与 EquipmentContributionDefinition 按成员提取，递归图成员标为不可展开，不因其存在而放弃普通字段。事件 key、可选优先级、原生 abilityEvent 和事件/初始化黑板已使用公共字段及句柄；删除两套黑板增删改名、数值解析、优先级 setter 和专用黑板布局。黑板缺省时显示空字典，删除最后一项通过父字段写入规则省略属性；新增和逐级编辑使用公共字典/等级值控件。priority 改用公共可选开关，不再用清空文本表达省略。事件族互斥关系保持，条件/序列仍只在图中编辑。测试覆盖枚举、互斥字段、等级数组、最后一项删除以及字面键路径；尚未进行浏览器视觉验收。

CombatEventTriggerEditor 已收窄为公共字段宿主，事件结构直接从 actions.ts 的 CombatEventTrigger 提取，不从装备定义反推。原草稿工厂继续负责种类切换。元素/物理异常使用公共集合控件，修复旧表单仅显示数组第一项的问题；治疗 role 的 target 省略、空 Buff ID 列表省略仍保留。Buff ID 改为逐项输入，不再用逗号/换行文本框；技力可选筛选改用公共开关。装备图传入事件句柄，删除其 update 转发；其他未绑定宿主仍使用原 update 兼容入口。真实组件测试覆盖两条路径及一次完整字段提交，不代表所有事件宿主都已接入直接句柄。

五个已迁移图宿主（技能、独立序列、Buff、能力实体、装备贡献）的 applyBuff 施加参数与黑板赋值现已通过 CombatStepEditor 的参数句柄接入 BuffStepEditor；两组公共字段直接提交，不走面板 update。内联 Buff 定义的旧专用操作未纳入这个参数绑定，仍保持结构所有权边界。真实 CombatStepEditor 测试覆盖删除最后一项赋值触发父规则、根事务一次、原草稿不变及无 update 转发；未新增历史栈。

装备贡献图复用 useDefinitionGraphEditing，条件及自动步骤参数绑定选中节点的句柄；删除原有仅选择节点的恢复监听，统一恢复节点与字段。装备专有属性修正、事件元数据仍为旧表单，不宣称已全部迁移。宿主测试覆盖直接参数修改、撤销重选节点与字段路径、重做，以及结构操作和参数操作共用历史；名称改变不重置保存范围。

BuffAssignmentsEditor 的专用等级/表达式切换界面保留，但编号与改名已复用公共字典操作；删除原先使用 in 和普通对象逐键赋值的重复实现。注册表可传入直接句柄，集合操作读取最新根，条目更新携带完整键路径，不经过父 update。特殊键安全保留、重复键拒绝、缺失条目不重建；测试覆盖连续新增不会被旧 props 覆盖。尚未接入 binding 的宿主仍走唯一迁移适配，不能宣称所有 Buff 面板都已直接提交。

全量回归检查点：src/ui/timeline 的 179 个测试文件、1034 项测试全部通过，类型检查通过。修复无 DOM 环境挂载快捷键监听的异常；历史及条件结构测试改为当前公共接口。发现条件 GameplayTag 列表丢失候选目录后，通过 InspectorField.widget = gameplayTags 与注册表复用原 GameplayTagsEditor，结构类型仍为 textList，不恢复手写条件表单。widget 是展示控件选择，不是新的游戏字段类型；原解析与候选目录保留。测试报告仅在 tmp，不提交。此结果不代表浏览器视觉验收或全项目测试完成。

七类 Buff 运行状态步骤已迁移完整表单：readEventBuffBlackboard、readCurrentBuffRemainingDuration、readBuffRemainingDuration、setCurrentBuffRemainingDuration、refreshCurrentBuffAttributeModifiers、finishCurrentBuff、setCurrentBuffTimePaused。删除 BuffRuntimeStateStepEditor.vue 及分派分支，复用枚举、文本列表、布尔与操作数。旧上下文边界说明保留三语帮助；操作切换不重置操作数，读取输出键修改不改变 ID 顺序或重复项。未修改模拟上下文要求。

六类能力实体生命周期步骤已迁移完整表单：readAbilityEntityRemainingDuration、setAbilityEntityRemainingDuration、finishCurrentAbilityEntity、finishActionOwnerAbilityEntity、finishCurrentAbilityEntityWhenSourceDies、startCurrentAbilityEntityChildSkillById。删除 AbilityEntityLifecycleStepEditor.vue 及分派分支，空参数使用统一提示，非空字段复用文本/操作数与三语标签。内联子技能 startCurrentAbilityEntityChildSkill 的图结构入口保留，不随参数迁移删除；未改变目标、模拟规则或默认值。

storeSourceAttributeValue / storeEntityPropertyValue 已迁移完整表单；原 SourceValueStepEditor 收窄并改名 SkillSettingStepEditor，删除普通属性读取的手写函数与模板。SkillSetting 四列布局、公式切换保留 paramA 的行为尚无通用等价支持，因此保留。指定属性键分支采用通用空字符串草稿，不再预填 strength；已有值不变。三语注解保留原换算说明。联合对象匹配同时校验多值 kind 枚举，避免把非法 kind 接受为有效分支。

setIgnoreGlobalTimeScale 的完整表单已迁移，删除 IgnoreGlobalTimeScaleStepEditor.vue；能力实体查询使用公共数组与联合控件。查询种类文案通过数组传给联合，不重新定义查询结构。空查询、空 ID 列表与省略 ID 字段原样保留，布尔修改不重建查询。新增查询采用通用联合第一个分支 current，不再预填 ownerSpawned，三语帮助已说明；已有查询不变。未删除仍被其他面板引用的 AbilityEntityTargetQueryEditor。

adjustSkillCooldown 已迁移完整表单，删除 SkillCooldownStepEditor.vue。目标、技能选择联合、枚举和操作数复用契约字段；旧面板“切到 reduce 时同步设置 baseDurationRatio、禁用 basis”的联动保留为字段写入与禁用规则，一次进入宿主历史。技能类型与 ID 文案复用 i18n。联合切到 ID 形式时采用通用空字符串草稿，不再预填 custom-skill，交由用户填写及领域校验；不修改已有 ID。测试验证联动、禁用及撤销重做。

setHealthFloor 的完整表单也已复用契约字段，删除 HealthFloorStepEditor.vue（51 行）。模式与数值仅增加显示注解和三语文案；目标、枚举、操作数及写入来自公共字段机制。模式切换保留操作数与目标，生命周期说明沿用旧面板，不新增游戏规则。事件响应的筛选结构尚未完整自动描述，本轮未迁移。
