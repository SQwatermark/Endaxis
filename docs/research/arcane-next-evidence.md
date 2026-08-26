# 诀新版配置证据记录

## 2026-08-27 正式运行定义生成与默认角色接入（最新）

新增 parseOperatorRuntimeTemplateSource / compileOperatorRuntimeDefinitionSource，直接读取此前
已导出的 character-template-prefix-v1 与连携 SkillData 策略头。复用公共来源/编译，不增加原生规则。
四个实体字面初值、五条条件与连携 startCdFrame=0 / trigger 智能目标生成独立正式运行定义；
原组件仍 partial，审计保留该状态，不把 14 条叶子完整解码外推到整个模板。

默认 arcane 包装器通过严格身份绑定安装该定义，原有动作/Buff/天赋与 Deck 构筑初始化保留。
正式文件在 src/next/data/operators/generated-runtime/arcane/，原始来源和审计在 tmp/。
generate:game-data:operator-runtime 支持原子生成与只读 --check；确切命令见编译器 README。

此前 8 场正式阻塞全部解除，77 把候选武器 × 兼容干员 × 两端词条构筑 **966/966 成功**，
没有失败豁免。真实诀单连携走模板火元素；战技→连携走条件记录的自然元素。相同构筑禁用条件后
恢复火元素且最终伤害不同，动态写回与真实模拟已关联。四元素/两构筑的隔离测试仍保留。
全干员 301 个技能逐项上轴通过；全量 **294 文件/3097 项**及两侧类型检查通过。
报告 tmp/arcane-formal-runtime.audit.json；C#/VFS 未重跑，无新增原生规则。

边界：此次只迁移模板常驻运行数据，不是完整干员生成器替换。默认武器库/迁移 UI 尚未切换；
旧诀处决重复 step key 的整模板存档问题仍待后续稳定身份处理，不改旧产物或放宽校验。

## 2026-08-27 木桩下 Pending 到实际连携（上一批，8 场阻塞已闭合）

用户明确以对敌伤害和必要时间轴表现为目标，不追求客户端完整状态机。依据既有
combo-cast-preparation / skill-smart-target-outer 规格执行场景投影：标准环境角色恒存活、无沉默；
零距离、普通选敌设置且主目标为有效唯一木桩。不建死亡、镜头、锁定菜单、dummy 坐标系统。
这不是声称原生查询恒真；未来支持对应外部状态时须替换资格端口。

Pending 进入既有 ComboWindowRuntime：复制 direct 字面值/null 和独立 input/trigger；沿用当前
窗口生命周期与木桩末候选规则，不宣称复刻多目标 GetBestCastInfo 评分。原生候选绑定技能组，
施法时跟随当前槽位，避免候选期间换槽后被误判阶段不匹配。旧语义多段窗口仍按技能 key 消费。
SkillRuntime 的一次性 afterCastStart 在初值/目标组恢复之后、第零帧前执行：绑定 trigger、
可选 smart_target，再普通 Assign 到 direct（即使键有 EntityBB_ 前缀也不写共享板）。
缺窗口时仍按用户排轴施法，记录诊断但不套用旧快照；下一次释放恢复初值并清理目标。

comboSmartTarget 元字段由公共已解码策略头投影：仅 SelectSmartObject 的连携 input/trigger
两策略；非智能策略不执行 StoreSmartTarget。候选为木桩时不算距离；缺候选走固定主目标。
非敌人智能候选尚需可选中语义投影，保持拒绝；Buff/Tag 评分也未以“单敌人”之名假装支持。

真实五条件与现有诀连携/Buff/能力实体定义的隔离测试通过四元素 × 两守卫分支。受控战技先
附着两次，连携在现实帧 4 上轴；完整时间膨胀和 600 帧推进保留。意志分支追加相应元素，
智识分支不追加，两者触碰/后续连携伤害均为正。原生 startCdFrame=0 和策略头来自已核对的
tmp/arcane-combo-native-unions.json（既有 C4395DB3... 二进制）；没有手改正式生成数据。
测试覆盖快照隔离、字符串/null、实体遮蔽、过期、重复施放、候选后换槽和第零帧时序。
全量 **291 文件/3072 项通过**，两侧类型检查通过，报告 tmp/native-combo-cast-pipeline.audit.json。

**8 场正式阻塞保留**，因为正式角色来源组装/注册未切换；下一步直接处理生产转换和交叉回归，
不重复上述接线研究。图形编辑元字段、非敌人智能选择均不属于本批已完成范围。
额外记录：旧诀完整模板在项目保存时，处决 chr_0032_lizhiyan_power_attack/actionOrder32 存在
重复伤害 key；本次隔离夹具只保留战技/连携，未放松校验。正式迁移必须修复该稳定身份。
C#/VFS 未重跑，复刻库仅同步投影状态，无新原生规则。

## 2026-08-27 正式定义、项目存档与场景编译（上一批）

公共 compileComboSkillConditionDefinitionSource 显式接收条件 key 与连携组绑定，输出正式定义和
独立来源记录；初值只取该条条件 direct 板，不混入共享实体初值，也不把字面数字当逐级值。
OperatorDefinition.comboSkillConditions 只接受四类已审计事件及公共 sequence。
项目保存阶段校验结构但允许悬空组引用；compileOperatorComboSkillConditions 在实际编译时要求
恰好一个 comboSkill 组，按该组 levelSource 解析正整数等级，再复用 compileActionSequence。
程序无须技能块，沿用既有 assembly 自动注册与冷却账本。

五条真实 RID 切片现经公共来源投影、项目模板序列化往返、正式编译与标准环境两次实际附着验证。
四元素 × 构筑守卫 0/1 全部通过，Pending 仍只含局部副本。测试使用佩丽卡作为最小载体并显式
注入 alive/InSilence；不能宣称正式诀的完整生成、生产资格来源或实际连携施法已完成。
新增 39 项，全量 **289 文件/3042 项通过**，两侧类型检查通过；报告
tmp/native-combo-definition-pipeline.audit.json 不提交，C#/VFS 未重跑。

**8 场正式阻塞不撤销**。下一步接资格来源、Pending 候选生命周期、afterCastStart 覆盖和目标传递、
SmartTarget，再切正式诀并验证真实伤害。旧窗口数值板及提前覆盖不能直接复用；正式条件的图形编辑
入口亦未提供。无新原生规则，默认武器库与迁移 UI 未切换。

## 2026-08-27 未放置连携的冷却目录（上一批）

正式 compileScenarioRuntimeAssembly 复用一次 compileOperatorDefinitionSkills 的等级/养成结果，
分别供资源规则和静态 skillCooldownPrograms 使用。后者只带身份、类型、来源 ID、冷却和确认帧，
不带动作/黑板/castId；完整定义中的基础和替换形态无需先放上轴，连携单形态也编译槽位。

参考本地复刻库 AbilitySystem.TickSkills：每个技能先 UpdateCooldown、再 Tick。
Next 的显式 skillTickPlan 对每个目录身份只推进一次冷却，再推进对应放置实例；空槽没有动作。
Buff、延迟施法、Action 的外围顺序不变，冷却增量仍来自既有时间膨胀接线。
目录沿用定义声明顺序；没有额外证明它等同全客户端技能列表的所有注册顺序。

冷却设置/减少按完整账本匹配类型或 ID，而非只遍历已放置程序。所有者/重复目录严格校验，
未配置冷却或 startCdFrame 不伪装可用。自定义放置定义可替代模板默认冷却，但同 ID 多次放置
必须一致；不同自定义来源 ID 汇集到同一账本，避免遗漏后一个块的来源选择器。
未放置变体可以继承归一化进度，旧场景和底层只传放置程序的入口仍兼容。

新增 14 项：空轴目录无施法、等级/潜能解析、未放置冷却设置和两种减少、变体继承、重复块
单次推进、自定义覆盖/来源别名，以及逐身份时序和缺漏/重复推进目录拒绝。五条真实条件的实际
双次附着测试扩展为四元素 × 构筑守卫 0/1 × 零/重复连携块。全量 **287 文件/3003 项通过**，
两侧类型检查通过，报告 tmp/static-skill-cooldown-assembly.audit.json 不入库，C#/VFS 不重跑。

**8 场正式阻塞仍保留**：本批已移除“必须放置连携才有计时器”的接入前提，但正式条件定义生成、
alive/InSilence 来源、Pending 候选/afterCastStart/SmartTarget 尚未闭合。下一步沿这条链推进，
不重复静态冷却拆分或 RID 叶子研究，也不提前修改正式诀数据/默认武器库。

## 2026-08-26 编译条件程序自动装配（上一批）

在既有 combo-condition-environment / combo-event-gates-and-pending / combo-cast-preparation
规格上接线，不新增原生规则。CombatOperatorProgram.comboConditionPrograms 是角色常驻程序，
每个 key 一次注册，不按时间轴技能块数安装；依赖 StandardPlayerDamageEnvironment 的真实附着
事件注册端口和 assembly 既有 reactive 操作链。实体板与技能/Buff 共用，无 Buff runtime 时也共用。

assembly 先校验全批槽位/变体/计时器，再于初始化/被动/入战前注册。资格查询必须显式提供
alive/InSilence；SkillCooldown 的单充能事实直接读取，costFrame 已在正式定义注明来源为
CastData.startCdFrame。每次检查从 AbilitySystem 当前槽位取账本，经过配置帧换秒后交既有
float32 门禁比较。时间膨胀沿用技能冷却时钟；不按现实时间重算，也不假装已支持多充能。

Pending 输出仍是带原始事件、input/trigger 和 direct 快照的必需回调；null/{} 与字符串保持。
不会用旧连携窗口的数值板/提前覆盖绕过 afterCastStart 时序。目标 ID 只解析已装配角色、
木桩和活动能力实体，失效/未知引用明确报错。构造中途注册、入战或第 0 帧输入失败时注销本批
监听；显式清理幂等，不动其他场景的注册。只保证新增注册清理，不声称已有所有事件系统均有卸载协议。

新增 30 项回归：真实五条件 × 四元素 × 构筑守卫 0/1 的两次技能附着，确认帧边界、实际槽位替换、
冷却时间膨胀、跨技能共享板、null/空板/字符串、异常清理和活动实体身份。全量 **287 文件/2989 项通过**，
两侧类型检查通过；tmp/combo-condition-assembly.audit.json 不提交，C#/VFS 本批未重跑。

**8 场正式阻塞仍在**。尚无正式 OperatorDefinition 到场景程序的常驻条件生成，也没有自动提供
alive/InSilence 或接 Pending 选择/施法。新增关键接入前提：当前 assembly 仅为已放置技能建冷却，
必须先把连携槽位静态冷却配置从技能块分离，覆盖未放置连携和变体，不能用始终 ready 假过门禁。
本批对此严格拒绝；后续接公共角色源 → 定义/场景 → 常驻条件 → Pending/afterCastStart/SmartTarget，
再做四元素与连续施法差分撤销错误断言。无需重复研究已闭合的 RID/条件叶子。

## 2026-08-26 五条真实条件的公共来源/查询执行（上一批）

新增 parseUnityComboSkillConditionsSource，输入为 VFS character-template-prefix-v1 中的
comboSkillConditions 与 conditionReferences。RID 必须为字符串、精确指向 complete 的同程序集
已审计叶子；仅按五种原生类型的字段签名规范化，不按 ID/显示名猜行为。优先级只接已证实的 0，
Scalar useKey/key 转成公共包装，Target/Compare/StackNum/TagQuery 枚举按复刻库定义映射；
标签 signed value、hex 及查询 name/value 相互校验。非空 finder/方向 RID 仍拒绝。
DebugPrint 的 logType 原整数保留，不为 no-op 猜日志语义；所有动作仍走既有严格读取/编译入口。

本机 tmp/arcane-character-conditions-complete.json 的 sourceSha256 为
33934515ea8b90efdf35f3fae4901124ed54fc16c087a9755574d8db58dca0bc。
14 条实际 data 与 test/unityComboConditionFixture.ts 手写最小切片逐项 deepEqual，公共 source
结构也相同，5/5 条件编译成功。整个角色仍 partial（908 字节后缀未消费），不能据此升级完整解码。

公共条件新增 contextTargetObjectTypeMatch 与 contextTargetBuffStackCompare：
前者复用 ObjectType signed-mask 语义，对 Context 中任一目标做完整包含检查，Enemy 扩展 EnemyPart；
Next 可表示目标仍只有角色/木桩/能力实体，不伪造部位实例。后者只接原生 ByTag/BuffCount 分支，
读取首目标容器的增强层数；缺组或空组 false，不先读取阈值。非空目标缺黑板/解析端口严格报错。
BuffIdCount 的不同 ID 去重语义没有投影，不用实例数替代；Advanced 的无目标语义也不借用此分支。
新条件已进入公共编译、正式校验、原有运行执行链及基础字段编辑，UI 未进行浏览器交互验收。

顺带修复上一批过宽的 InputTarget 拦截：关闭动作与原生不读取目标的 DebugPrint 不应被残留
Target 字段阻塞。真正使用 InputTarget 的条件继续报错，不能偷偷指向物理 eventTarget。

真实五条最小切片经过 RID → 公共 source → 公共编译 → 正式条件校验 → Next sequence → 标准环境
连续两次附着执行。四元素各测试构筑守卫 0/1；火/电/冰首轮无旧层数、次轮有旧层数，自然直接
匹配，第五条按守卫写 EntityBB_consumed_type。没有手动调用条件替代实际附着事件，Pending 回调
仅用于观察成功事实，不代表候选选择或施法已接通。单测另固定任一/首目标差异、空组、强化三层
只有一个实例、结束 Buff 排除、非法掩码、缺引用、未知枚举和未支持 ID 计数。

**8 场正式阻塞仍在**；下一步安装角色常驻注册和资格端口，再接 Pending 的选择/施法覆盖。
已有公共 Target/Tag/BuffCount 投影为 eventTargetBuffCountCompare，但后者实际为实例计数；
Owner/Source 也共用该输出，这是需单独审计的旧分支差异。本批不修改旧正式生成数据以掩盖问题。
新增 42 项，全量 286 文件/2959 项通过，两侧类型检查通过；C#/VFS 不重跑。
报告 tmp/combo-condition-target-queries.audit.json 不入 Git。

## 2026-08-26 原生附着事件的连携条件注册（上一批）

复用 combat-spec 的 combo-condition-environment.md、combo-event-gates-and-pending.md、
combo-cast-preparation.md，Next 新增 ComboSkillConditionRuntime。标准环境真实附着动作的四个
事件分别进入 dispatcher 的 combo 阶段，早于/晚于附着写入的位置由真实操作保持；不是从回执补事件。
标准环境原本传入的 skillListeners 仍为空，本批只接 combo，不宣称四阶段监听器全部安装。

每条注册只创建一次 direct 板和目标环境，共享角色 entity 板；后续检查重建动作状态但不清黑板。
临时 trigger 在 finally 移除，其他已保存组保留；成功时 direct 值复制为不可变 Pending 快照，
禁用板为 null、启用空板为 {}。事件 payload 仍保留物理 source/target，另提供 actionInputTarget：
126/129 输入为承受者、trigger 为施加者，121/130 输入为施加者、trigger 为承受者。
身份由显式 resolver 提供，不按 ID 拼写猜测实体种类；action owner/source 同样分别提供。

门禁接受显式 alive、InSilence 查询及当前 ComboSkill 槽位计时器，按原生顺序跳过不合格检查；
计时器缺失严格失败，边界相等不通过，oneReady 可通过。当前尚未由 CombatRuntimeAssembly 自动提供
这些端口，不能说完整生产资格通路已闭合。Pending 由注册回调输出，没有选候选/开旧连携窗口/施法。

公共来源层读取规范化后的 comboSkillConditions，保留每条来源/事件/立即施法字段；事件编译只接受
已审计 126/121/129/130 的 Pending 模式，其他事件、立即施法和未实现根过滤拒绝。条件编译复用
原有 Action/Condition/Sequence 入口，但布尔结果会被消费，因此纯尾条件也不能省略。
Unity 原始 RID 和整数 priority 等仍需来源适配，不把未展开 RID 当作空序列。Target 来源在连携中
指 InputTarget，而普通 Buff 的 eventTarget 是物理事件目标；当前公共连携投影显式阻止前者进入
后者的错误语义，待补专用目标绑定后再放行。trigger 的上下文组可用于已支持的 Context 查询。

新增 44 项：含公共来源到真实序列执行、独立局部板/共享实体板、门禁/异常清理/快照/注销，以及
四元素经 StandardPlayerDamageEnvironment 的实际附着集成；全量 284 文件/2917 项通过，两侧类型
检查通过。报告 tmp/combo-condition-registration-regression.audit.json；C#/VFS 本批未重跑。
**8 场已知阻塞仍保留**，没有安装正式诀五条条件，没有变更默认武器库或迁移 UI。
下一步：完整五条 RID 规范化 → InputTarget/trigger 查询投影 → assembly 注册门禁 → Pending 施法覆盖。

## 2026-08-26 模板初值与条件写回进入 Next（上一批）

公共 `compileAbilitySystemBlackboardsSource` 保留 source 路径/动态标记，并分别投影实体字面值及
条件局部值；后者禁用返回 null，启用空板返回空对象。动态项属于安装初值，不能套用仅取静态值的
SkillPatch 常量解析。Next 新增 `OperatorDefinition.entityBlackboard`，装配时安装到共享实体板；
现有 Deck 派生 initializers 在模板之后覆盖，重复派生键仍拒绝，保留面板键冲突/非有限值诊断。
普通施法可跨次读到实体写入，新场次恢复模板；字符串及 double 字面值无损保留。

`CheckSpellInflictionType.savedKey` 经唯一公共条件编译入口转成 `eventInflictionElementIn.outputKey`。
原生数值 mask、命名 All、0 均可读；0 保持不匹配。运行时先匹配事件，再严格读取现值，按 float32
epsilon 决定是否 AssignDynamic；没有补缺键，没有抹前缀。编号与复合状态载荷共用同一个映射。
直接板遮蔽读取、实体写入归属、缺键/错类型、连续事件、非匹配不读黑板均有回归。
另新增无条件动态赋值入口：原生 AssignDynamic 本身不做 epsilon 比较，条件已按 direct 优先值
比较后，不能再按写入目标 entity 的另一个值去重。既有融合比较入口不改，避免无关行为变化。

发现并修复公共序列编译的尾条件问题：有 savedKey 等写入副作用的条件即使后继为空也必须保留，
其前置守卫不能删；NotNext、嵌套 AND/OR 继续短路，纯尾条件才可省略。公共泛型接口缺省不假定纯。
真实附着执行器回调的测试证明已选中条件在 beforeTakeInfliction 时写入，早于目标附着查询/修改；
没有把后置 `elementalInflictionApplied` 语义事件冒充这个原生前置事件。

本机 `tmp/arcane-character-conditions-complete.json` 再次实读：sourceSha256
`33934515ea8b90efdf35f3fae4901124ed54fc16c087a9755574d8db58dca0bc`，四实体键为 0/0/0/1、
两局部短键为 0/0；RID `2708501211437859835` 的 mask=15 / savedKey=EntityBB_consumed_type
进入 TS 条件来源层。该调用依据 registry 的 namespace/class/assembly 组装类型身份，并非扫描名字。
角色总体仍 partial，剩余 908 字节未读；测试中的 CompareFloat 使用已归一的字段切片，不是直接消费
整个原生 CharacterTemplate。第五条 DebugPrint 的 no-op 已有规格，但本测试只取后两项数值切片。

**8 场 Next 阻塞仍在**。本批没有把新初值单独填入正式诀定义，没有自动注册五条条件，没有宣称
条件局部板的生产安装、冷却/资格门禁、Pending 选择及施法覆盖已完成。
下一步按这条顺序接公共注册程序及实际事件 combo 阶段；复用既有叶子/规格，不另建逐干员监听器。
测试报告在 `tmp/entity-initialization-saved-element-regression.audit.json`；C#/VFS 本批未重跑。
新增 **45** 项，Next+统一编译器 **282 文件/2873 项全部通过**，两侧类型检查通过。

## 2026-08-26 施法目标设置与后备路径（上一批）

复刻库补 StoreSmartTarget 外层设置覆盖及 GetDefaultTarget 实体路径；真实附着至第 0 帧
测试现走外层子集。上一批“输入设备类型 2/3”不准确，已由 Common metadata 更正为
controllerCachedSkillCastTarget：OnlyForceLock / MarkTargetWhenNoForceLock，不能按设备分流。
default null 与空组、锁定失败不回退 trigger、后备主目标范围及主控坐标来源分别有回归。

AssignData 保存组件 data，InitSelf 前的待查调用已识别为技能与特效预加载；未证明所有
上游组装或 IFix 都无覆盖。dummy 几何保留显式端口，不能将虚拟位置替换为敌人或零。

公共 TS 主动技能 source IR 已保留目标策略头。真实 combo 二进制四字段实读得到
SelectSmartObject / SelectComboSkillTrigger / true / [0,0,6]；研究导出无关曲线包含 Infinity，
仅以 Python 读取后投影四字段，再经标准 JSON 交 TS parser；不是修改曲线来通过完整 JSON 解析。
Buff/Tag/层数策略只保留身份，不声称已实现评分或 Next 执行。

新增 C# 20、TS 20；C# 1376 pass/17 既有资产缺失失败名不变，Next+编译器 280 文件/2828 pass，
统一 TS 类型检查通过；真实偏移核对后两组 TS 24/24 再次通过，VFS 未重跑。
原生地址/哈希/复现见 combat-spec docs/skill-smart-target-outer.md；报告均在两库 tmp/。
**Next 8 场阻塞保留**，下一步公共角色初值/条件运行安装，验证四元素写入及连续施法，
不再重复已完成的叶子/门禁/目标路径。默认武器库和迁移 UI 未切换。

## 2026-08-26 连携智能目标与模板黑板（上一批）

复刻库已补 FindSmartTarget 的两条连携句柄分支，真实事件至第 0 帧测试改用具体选择器；
当时尚未覆盖外层施法目标设置分支与后备主目标/dummy。_DoInit 的 source/entity 清空及模板赋值
已提取为共用初始化入口，能力实体复用。实体值不会随普通技能 Start 重置。

统一 TS source 开始分别读取实体初值、条件局部初值及启用开关，复用已有 DataPair 解析并保留路径。
实际读取 tmp/arcane-character-conditions-complete.json 得到 4/2 键；这只是已解码字段子集，
不把角色组件 908 字节未知后缀变成完整支持，也没有提前安装条件或补零。

新增 C# 22、TS 10 项；C# 1356 pass/17 既有失败不变，Next+编译器 2808 pass。
**8 场阻塞保留**。下一步为角色初始化覆盖/IFix、SmartTarget 外层投影及公共运行安装。
精确 RVA/哈希/复现边界见 combat-spec docs/combo-smart-target-and-template-init.md。

## 2026-08-26 注册到施法第 0 帧（上一批）

剩余虚调用的 metadata slot 78 已确认为 AbilitySystem.alive，fallback 读取 markDie 而非 HP。
复刻库新增有限的四附着事件注册/注销与全局禁用、存活、沉默、冷却门禁。Pending 数据经
afterCastStartCallback 写入技能 direct，发生在本次动态值恢复后、第 0 帧前；原生 null trigger
分支不应用 assignItems，不能把 null 和非 null 空句柄合并。目标句柄按原生复制。

新增 15 项测试，全量 1334 pass/17 既有失败、失败名不变。真实附着动作至注册、条件、Pending、
普通施法第 0 帧已串起；SmartTarget 仍要求显式端口，不宣称完整队列/玩家指令或智能目标选择。
原生 RVA、metadata 行号和准确边界见 combat-spec `docs/combo-cast-preparation.md`。
**Next 8 场保留**，本批仅复刻库实现与交接，未重跑 TS/Next/VFS。下一步初始化覆盖/SmartTarget/
IFix，再接统一编译器；不再重复查已确认的门禁及 Pending 覆盖时序。

## 2026-08-26 附着事件通路、冷却门禁与 Pending 快照（上一批）

combat-spec 已修复 DataDrivenSpellInflictionAction 的四事件目标绑定与 OnEnemy 缺失的连携
发布阶段。原生 121/130 由被附着方发布，EventContext.target 为施加方，trigger 为被附着方；
126/129 方向相反。不是用当前时间轴技能的目标反推，也不改变附着 Buff 更新前后的时序。

TriggerComboSkillEvent 冷却阈值闭合为 CastData.startCdFrame / 30（常量原值 30.0），不是
额外的“预测窗口”。环境新增显式上游资格之后的入口，按当前连携槽位复用 CheckCooldown，
缺失技能/计时器拒绝。Pending 条件成功后复制直接 DataPair，不合并 EntityBB，不共享活板；
空启用板与禁用/null 保持区别。剩余虚调用门禁、队列选择和 cast 覆盖未冒充完成。

新增 23 项 C# 测试；相关 84/84，全量 1319 pass/17 既有资产缺失、失败名不变。真实附着动作
可在 Buff 变更前进入选中的独立队友条件，冷却拒绝则不写入。完整原生 RVA/边界见
combat-spec `docs/combo-event-gates-and-pending.md`。**Next 8 场阻塞仍在**；本批仅更本文档与
复刻库，未重跑 TS/Next/VFS。下一步查剩余门禁、初始化覆盖、Pending 到 cast 和 IFix，再接
公共 source IR/Next，不能把有限 C# 切片通过称作正式干员转换完成。

## 2026-08-26 直接条件叶子完成，待门禁与正式接入

VFS 新导出已完整消费全部 14 个直接条件载荷（角色组件后缀仍 partial）。前四条分别检查
trigger 为敌人 + Natural/Fire/Pulse/Cryst，其中后三条另要求对应附着标签增强层数 >= 1；
第五条 DebugPrint 的原生 fallback 直接 true，之后才判断属性分支并保存元素。
ByTag 的无目标路径直接 false，不能重用 Advanced 的零值比较；原生依据和 24 项新增 C# 测试
见 combat-spec `docs/combo-condition-leaves.md`。trigger 字符串由调用点 metadata literal 60333
核实，参数来自独立 triggerTargetHandle，不能用技能 inputTarget 冒充。

VFS 新增 3 项测试，全组 32 pass/4 skip；C# 全量 1296 pass/17 原有资产缺失且失败名未变；
统一 TS 类型检查通过。Next 仍保留 8 场阻塞，生产行为未变，未重跑 Next 全组。
下一步聚焦条件执行前的冷却/可用性门禁、事件发布参数、Pending 黑板传递和初始化覆盖；
本轮已确认 NeedTriggerComboSkill 有全局禁用标志与事件注册检查，后续 oneReady/maxPassedTime
判断仍有阈值来源未闭环，不足以安装无条件元素监听器。

## 2026-08-26 顺序导出与独立连携环境（最新）

本轮工具代码进入 VFS，原生运行语义先进入 combat-spec；Endaxis 只更新交接，未改生产数据。

- `CharacterTemplateDecoder` 从 MonoBehaviour 根核对角色 ID/26 个组件，唯一定位所属
  AbilitySystemData；`AbilitySystemDataPrefixDecoder` 按字段消费 `[4092,6460)`，不再搜索
  EntityBB_ 键。`[6460,7368)` 的 908 字节保留，导出 `decodeStatus=partial`。
- SkillDataBundle 有 5 条 comboSkillConditions，event=121；独立 comboSkillBlackboard
  为 consumed_layer/type=0，与角色的 EntityBB_ 声明、技能 direct 声明不是同一个容器。
- 按配置的每条动作 RID 保留关联，14 个直接引用中 6 个完整、8 个 raw。第五条的中间
  CompareFloat 读 EntityBB_wisd_greater_will，与 1 作 LT 比较，之后才是保存元素类型的动作。
  原生注册使用集合，暂不推断不同条件的稳定遍历顺序，也不跳过未知 DebugPrint 认定全链闭合。
- 复刻库新增有限的 ComboSkillConditionEnvironment，验证每注册独立 local/shared owner
  entity、前置条件短路、重复事件重算和 Context 恢复；不自动触发技能或连携窗口。
  原生 ctor/Register/Trigger RVA 与未知门禁见 `combat-spec/docs/combo-condition-environment.md`。
- 新增 C# 6 项、VFS 9 项测试；C# 全量 1272 pass/17 既有失败且失败名无变化，UnityWorker
  29 pass/4 外部资产测试 skip；真实 raw 另行严格导出复核。没有重跑 Next，也未撤销 8 场失败。

剩余顺序：补目标类型/标签层数/DebugPrint 等条件；追踪 trigger 命名目标绑定、连携门禁、
热修复与模板初始化覆盖；先补规格，再送公共 TS source IR/编译器与 Next 运行层；最后以
四元素、智识/意志两侧及 966 场武器交叉构筑验收，不以默认值消除异常代替完整转换。
VFS 复现命令见 `docs/research/character-template-prefix.md`，中间产物仅在忽略的 tmp/。

## 2026-08-26 角色模板初值与 savedKey 写入（上一批）

本批 VFS 已按原生证据补齐 BuffData.applyTags，关联资源由 64/66 到 **66/66 完整解码**。
Skill/Buff 内仍只有读取，但当前 manifest 的 CharacterTemplateData 中找到了缺失来源：

- 原生路径 `assets/beyond/dynamicassets/gamedata/characterdata/data_chr_0032_lizhiyan.asset`，
  raw 13724 字节，SHA256 `33934515EA8B90EFDF35F3FAE4901124ED54FC16C087A9755574D8DB58DCA0BC`。
- 根载荷 `[168,544)` 已完整读取、验证 id 与全部 26 个组件引用。AbilitySystemData
  `[4092,7368)` 内有四项 EntityBB_ DataPair（`[6284,6460)`）：consumed_type/layer/ult_hit=0，
  wisd_greater_will=1，全部 dynamic=true。AbilitySystemData 前缀仍需逐字段解码，不直接把
  局部扫描候选喂给生成器。模板默认值与后续 Deck 属性初始化器也不能混淆。
- 条件 RID `2708501211437859835` 的 CheckSpellInflictionType.Data 完整载荷为
  `[12164,12212)`，mask=15、savedKey=`EntityBB_consumed_type`、serverActionIndex=1013；
  该 RID 确实被角色 AbilitySystemData 引用。完整 ComboSkillCondition 路径、前置守卫、
  事件注册及执行环境仍待核实，不先假定任何元素事件都写这个值。
- combat-spec 已先实现原生未补丁动作：上下文类型/mask 匹配才读写，非空 savedKey 必须已存在；
  按单精度 epsilon 更新 EntityBB_，不发布虚构的 AbilityEvent。29 项新测试通过，
  全量 1266 通过、17 项既有资产缺失失败。IFix ID 0xF2D2 的实际槽状态未核实。

**Next 的 8 场阻塞仍保留**；本批未修改其代码、默认库或生成定义。下一步是角色数据严格导出，
再接公共 TS 编译器的初始化和带写入条件，最后用不同元素/不同属性分支重跑实际场景。
详细原生 RVA、数据偏移与工具复现见 combat-spec `docs/check-spell-infliction-type.md`、
`docs/arcane-consumed-type-gap.md` 和 VFS `docs/research/memorypack-arcane-2026-08-26.md`。

## 2026-08-26 本地二进制复核（上一批）

已解除先前的 VFS tag 173 解码工具阻塞，但**没有解除 8 项模拟阻塞**：

- VFS `extract_memorypack_unions.py --metadata` 结合已初始化 runtime 锚点和同版本元数据，
  恢复 386 个动作 union；`extract_memorypack_schema.py --union-map` 显式补齐派生类型根。
  `ObtainCostAction.uspRecoverTag` 已按原生证据改为 inline int32，修复其后续三字节错位。
- 控制 Buff seal_total 和连携 SkillData 分别完整消费 **15710、24320 字节**，不依赖 reference
  JSON 推断。控制 Buff 仍两次读取 `EntityBB_consumed_type`，技能只声明无前缀
  `consumed_type=0`。没有得到新的写入证据，不应删前缀或补默认值。
- 诀的 66 份本地 SkillData/BuffData 中 **64 份完整解码**；seal2 与 train_showhp 在
  `BuffData.applyTags` 格式处拒绝。不能宣称完整覆盖所有实体初始化或客户端没有写入。
- 原始载荷哈希、命令与偏移见 combat-spec `docs/arcane-consumed-type-gap.md` 和
  VFS `docs/research/memorypack-arcane-2026-08-26.md`。临时结果为 `tmp/arcane-vfs-audit/`、
  `tmp/arcane-tool-*`，不提交，不覆盖生产输入或生成定义。

下一步从角色实体模板初始化、IFix/运行时 Patch 及剩余两份资源继续查来源；默认武器库
仍未切换。以下交叉构筑审计口径保持有效。

## 2026-08-26 交叉构筑审计纠偏

后续核对 `tmp/akedb-next-latest/BuffData` 的同名 seal_total 与当前输入：两者 SHA256 均为
`A2FF30B1E9BCC2749F262111CDBC730054F12A98E99D85603552C8E33B8517E5`。
该副本没有提供新增证据，以下阻塞仍未解除。

“11 个技能入口已转换”与固定构筑的逐技能通过，不等于所有属性分支已闭合。
新增 77 武器 × 30 名兼容干员 × 最低/最高词条档位矩阵，共 966 个四技能场景；
其中诀在下列 8 把武器的最高词条档位仍严格报错：
`wpn_funnel_0003/0006/0007/0010/0011/0012/0015/0017`。

- 同一原因：`seal_total` 第 6 帧意志分支读取 `EntityBB_consumed_type`，该值缺失。
- 原始 Buff 的该 Switch 会选择元素附着，会影响伤害，不属于木桩可忽略项。
- 当前导出语料只有读取，没有找到写入；连携技能的 `consumed_type=0` 不等于带前缀的实体键。
- 关闭 `wpn_funnel_0003` 全部事件、保留静态属性、仅放诀连携仍重现。
- combat-spec `docs/arcane-consumed-type-gap.md` 已记录数据路径与原生缺键抛异常证据；
  不给零、不删除前缀、不硬编码元素、不改原始生成产物，也不伪称读分支不可达。
- 初次从本机 VFS 核对时缺 tag 173，严格解码失败；后续已完成解码，见上方最新复核。
  初次失败的临时输出不能作为版本差异证据。

矩阵测试精确断言这 8 个诊断，其他 958 个必须成功；新失败和既有阻塞消失都会触发审计更新。
这不是全矩阵通过，也不是默认库发布许可。后续先补齐同版本解码与实体初始化/运行时 Patch
证据，再修公共转换或运行逻辑，删除这份明确的阻塞清单。

本文审计 `src/next/data/operators/arcane.ts` 的来源与当前边界。正式配置只保存 Endaxis 可执行的
业务语义；原始 SkillData、Buff ID、Blackboard 键和实现事件名只记录在本文。

## 版本与来源

- 解包版本：VFS 与 AKEDB `1.4.4@8764515-7`。
- SkillData：`chr_0032_lizhiyan_*`。
- BuffData：`buff_chr_0032_lizhiyan_*`。
- 表数据：`CharGrowthTable`、`SkillPatchTable`、`PotentialTalentEffectTable`、
  `SkillConditionTable`。
- 反编译研究：`vfs-index-browser/combat-spec/docs/arcane-form-selection.md`。
- 旧版 `src/data/operators/arcane.ts` 只用于结果差异审计，不作为证据来源。

可信度沿用佩丽卡文档中的 `exact`、`derived`、`curated` 定义。

## 双形态

| 正式语义                 | 可信度  | 原始依据                                   |
| ------------------------ | ------- | ------------------------------------------ |
| 智识 `>=` 意志时为智形态 | exact   | 被动的 `CompareDeckAttr(Wisd GE Will)`     |
| 智识 `<` 意志时为意形态  | exact   | 同一 `IfElseAction` 的失败分支             |
| 构筑属性变化后刷新形态   | exact   | `OnCharDeckAttrChanged`                    |
| 形态不进入存档           | derived | 原始状态由 Deck 属性快照派生，不是独立输入 |

正式配置使用 `deckAttributesChanged`、`deckAttributeCompare` 和 `arcaneForm` 上下文标志表达这条
链路。战技、连携技和终结技仍各自只有一个稳定技能身份，形态分支位于其行为序列内部；
`presentationVariants` 只选择名称、描述和图标。

## 普攻、处决与下落攻击

- 五段普攻逐 hit 倍率来自 `SkillPatchTable` 的 `atk_scale`，命中数量与执行帧来自各段
  `DamageAction` 行为图。第四段为八次命中，第五段同一命中内包含生命伤害、`17` 失衡和
  `17` 团队技力恢复。
- `durationFrames` 当前采用各 SkillData 的 `exclusiveFrame`。它是当前最明确的动作互斥边界，
  但仍需用完整输入衔接测试确认它是否等同于编辑器块时长，因此这一组时长为 `curated`。
- 处决伤害倍率来自 `chr_0032_lizhiyan_power_attack` 的最终 Patch；伤害后紧跟
  `GainBreakingAttackAtb(factor = 1)`，实际恢复量读取敌人 `breakingAttackedAtbObtain`。
- 下落攻击只记录落地技能 `chr_0032_lizhiyan_plunging_attack_end`；空中移动不属于技能块。

## 战技与连携技

战技先施加自然附着，再按形态选择伤害倍率，最后执行按技力消耗获得终结技能量的行为。智形态
倍率为 `atk_scale_wisd`，意形态为 `atk_scale_will`，两者均造成 `10` 失衡。

连携窗口来自原始条件图：

1. 智形态施加自然附着时直接开启；
2. 智形态施加其他法术附着时，要求对应附着已有至少两层；
3. 意形态施加任意法术附着时开启。

连携命中先施加封印和自然/寒冷易伤，再造成伤害并回复 `10` 终结技能量。智形态封印持续
`4` 秒；意形态持续 `6` 秒，易伤额外按意志缩放并受等级上限约束。封印自然到期和被主动消耗
是两个不同事件，都会执行结束伤害。智形态战技命中封印目标还会提前引爆、返还技力并触发五段
追加攻击；正式配置将这些行为保留为连携技能自己的事件处理器。

## 终结技循环

| 行为                       | 可信度        | 正式配置                                 |
| -------------------------- | ------------- | ---------------------------------------- |
| 首次命中在第 `47` 帧       | exact         | 第 47 帧、仅在未就绪时执行的序列         |
| 强化持续 `20` 秒           | exact         | `gloompurgerArray`，600 帧               |
| 强化期间禁止终结技能量恢复 | exact         | 状态的 `blockResourceGain` 修正          |
| 初始拥有两层追击计数       | exact         | `clusterStrikeCounter` 两层              |
| 普攻末段或处决各消耗一层   | exact         | 两个团队范围 `damageTagHit` 监听器       |
| 每次消耗触发四段追击       | exact/derived | 四条延迟伤害序列；倍率为总倍率的 `1/8`   |
| 两层耗尽后允许免费二次释放 | exact         | `gloompurgeArcanaReady` 的费用与冷却修正 |
| 二次命中在第 `58` 帧       | exact         | 第 58 帧、仅在就绪时执行的序列           |

智形态首次释放施加腐蚀；意形态重新施加目标当前已有的四类法术附着。二次释放按形态选择
`atk_scale` 或 `atk_scale_will`，随后消耗就绪状态与强化状态。强化自然结束时清理剩余计数和
二次释放资格。

## 天赋与潜能

- 天赋 1：智形态连携冷却缩短 `6` 秒，并在强化期间获得伤害加成；意形态终结技命中后按意志施加自然/寒冷易伤。
- 天赋 2：增加腐蚀持续时间与效果倍率。
- 潜能 1：连携相关伤害乘 `1.3`。此外还存在智形态引爆返还技力 `+10`、意形态易伤基础值和
  上限各 `+6%`；后两项尚未写入正式配置，等待确定通用的“升级修改状态步骤参数”结构。
- 潜能 2：智识和意志各 `+15`，法术强度 `+16`。
- 潜能 3：天赋 2 的腐蚀持续时间再加 `5` 秒、效果倍率再加 `0.2`。
- 潜能 4：两阶段终结技能量消耗乘 `0.85`。
- 潜能 5：补强形态天赋；二次终结技伤害乘 `1.3`，冷却缩短 `30%`。

## 尚未闭环

1. 潜能 1 两条分形态参数修改的通用升级结构。
2. 普攻投射物发射到命中的动态飞行时间；当前帧来自动作图中的伤害/发射节点。
3. 连携封印对象在多敌人场景中的选择、弹射和目标组传播；Endaxis 当前为单敌人模型。
4. `exclusiveFrame` 与用户实际可衔接输入边界的全角色通用关系。
5. 编译器与模拟器尚未实现新增的状态、复合条件、事件处理器和升级修正；本轮完成的是有证据的
   配置与类型模型，不代表现有 `/timeline` 已能执行它。

## 生成审计现状（1.4.4@9433094-12）

当前生成清单以 `outputStage: complete` 收录诀（`arcane`）的连携、五段普攻、处决、下落攻击、战技和
两个原生终结技入口，共 11 个技能。严格技能序列、养成与干员装配均可编译，正式生成
`arcane.operator.generated.ts`；正式目录直接消费该 `OperatorDefinition`。原始来源树不再生成到
源码目录，详细审计位于本地 `tmp/generated-next-operators/arcane.audit.json`，不进入 Git。

以下四条曾是正式生成的主要证据/实现缺口，现均已闭环；保留详细过程作为规则边界：

1. 连携封印 Buff 的 `DuringBuffEnable` 含 `ForEachAction`：它以 Buff 的 `ActionSource` 为 owner，
   用 `OwnerSpawnedEntityFinder(AbilityEntity)`、标签 `-1480463572` 与
   `SkillCastIdValidator` 找到同次施法的封印实体，再逐个向当前 `Target` 施加
   `buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect` 和
   `..._effect_line`。同 Buff 的 `OnBuffTrigger` 则先把同类实体写入 `bunshin`，再逐个以实体为
   caster 释放 `chr_0032_lizhiyan_combo_skill_abilityentity_end`。审计模型已新增“集合身份 + 循环体”
   事实，并进一步确认
   `OnOwnerDead`、`OnBeforePartDisable` 也执行同一实体结束技能；22 个关联 Buff 定义均已解析，
   `buffDefinitionResolutionIssues` 已消失。生成期现能把标签降为明确封印实体 ID，运行时实体
   保存来源施法序号，Buff 生命周期也有独立目标 Context；两个子 Buff 只有表现事件，可严格
   省略。结束子技能仍包含定时标记门、伤害、监听 Buff、Buff 结束和实体结束。监听 Buff 的
   `OnBeforeTakeDamage` 同步树现完整保留为：`isWisd >= 1`、`DamageDecorateMask HasAll 256`
   （既有枚举证据为 `normalSkill`）、`Target == Source`，随后依次返还 ATB、把 HitBox 目标写入
   `tar`、以 `Source` 为攻击者中断 `Context/tar`（`overrideSuperArmorLimit=-1`、
   `immobilizedTime=1`）、造成伤害并结束 Buff。生成器不再丢失目标查找与中断叶。1.4.4 原生
   `SequenceAction.Init` 与元数据现已证明事件序列优先级取首个启用动作的
   `priorityLevel + priorityOffset`，枚举为 `Low=-100 / Default=0 / High=100`；本监听精确为 `0`。
   `TriggerEvent` 又证明 `OnBeforeTakeDamage` 的动作 `Target` 是事件上下文中的
   `Modifier.source`（本次伤害攻击者），而 Buff 动作 `Source` 是 Buff 来源，因此这里的等价检查
   精确表示“伤害来源等于创建 Buff 的能力实体”。Next 已有按 Buff 实例启停的承伤订阅、事件
   tags/features 与来源身份条件。当前模拟器没有敌方主动技能、红圈可打断状态或行动时间线，
   因此 `InterruptAction` 在模型内没有可观察效果；原生又证明该动作恒返回成功，生成器现保留
   完整审计载荷并将其归约为空序列。`FinishBuffAdvanced` 的 `Owner + Id` 已绑定为监听 Buff 的
   实际接收者，`Owner + Environment` 已由原生 `BuffFindSettings.CheckType` 分支证明为当前动作
   环境中的 Buff，并编译为结束正在执行响应的当前 Buff。真实 `seal2` 数据现可完整生成上述
   `OnBeforeTakeDamage` 响应；运行时测试也证明自结束会立即注销该实例的事件订阅。这里实际
   持有实体查找与 CastSkill 的定义是 `buff_chr_0032_lizhiyan_combo_skill_seal`，而
   `..._seal_total` 是施加在诀身上的定时控制 Buff：其本地第 2 帧通过
   `Context/trigger` 把 `seal` 与 `seal_listener` 施加给技能命中的敌人。`seal` 因而就是
   敌人持有的“囹圄”状态，不是能力实体出生 Buff；能力实体 prefab/组件不参与这条所有权链。
   `seal_total` 另有 `OnSquadRepatriate -> FinishOwnerAction` 清理事件。结束子技能中
   `CreateTimedMarker(Owner, useTimeDilationDt=true)` 现使用逻辑能力实体受时间膨胀影响的局部时钟，
   并已通过真实四段条件编译；实体自身两个表现 Buff 的结束也定向到 `currentAbilityEntity`。
   1.4.4 原生 `CastSkill.ExecuteInternal` 已证明它分别通过 `GetFirstTarget(caster)` 与
   `GetTargetsView(target)` 求值，再在所得 caster AbilitySystem 上调用
   `TryCastSkillDuringAction`；`target=Owner` 分支读取当前 `AbilityAction.owner` 的 self target。
   `Buff.OnTrigger` 调用 `_ExecuteBuffAction(OnBuffTrigger, null)`，而后者在无显式 target 时明确
   读取 `Buff + 0x170`；静态字段表确认该槽就是 `Buff.owner`。这里触发动作属于敌人持有的
   `seal`，所以隐藏子技能的输入 `Target` 与 `seal_bunshin_end_listener` 接收者均为敌人，而
   caster 是被查询到的同次施法分身实体。Next 现新增在既有实体上启动隐藏
   子时间线的内部步骤，同一实体可承载多个局部时间轴并在宿主结束时一并清理；真实结束技能
   已能完整编译为该步骤的内联载荷，且不会注册成玩家技能。生成器现为 Buff 实例生成独立
   `scheduledSequences`：`seal_total` 的 0/2/6 帧计算、创建与条件树使用 Buff 本地时钟，
   `Context/trigger` 的敌人身份只从创建该 Buff 的技能目标证据注入；第 2 帧递归内联 `seal`，
   `seal` 启用时的法术易伤与触发时的分身结束子技能均已进入同一定义。敌人拉拽、受击表现与
   `InterruptAction` 在当前无敌方主动行为、零空间模型中没有数值效果，审计事实保留但不伪造状态。
2. 四个形态相关技能直接读取实体动作黑板 `EntityBB_wisd_greater_will`。生成器现在把
   `chr_0032_lizhiyan_passive` 作为有证据的基础被动入口，沿其启动 Buff 自动解析
   `OnBuffStart -> CompareDeckAttr(owner.Wisd GE owner.Will)` 与成功/失败分支的实体黑板赋值，
   生成 `intellect >= will ? 1 : 0` 初始化器；比较条件、键和值均不在 manifest 中重复声明。
   场景编译器用最终静态构筑面板求值，运行时在创建技能实例前把结果安装到干员共享
   `ActionBlackboard`。这是一场战斗一次的构筑快照，不声称支持战斗中动态 Deck 属性刷新；
   旧手写 `deckAttributesChanged` 仍只负责现有展示/上下文分支，不能冒充运行时事件接线。
3. 原始数据把首次终结技和二次终结技保存为两个技能资源，但它们不是两个可自由排入的技能。
   生成器现已结构化三段闭环证据：首段第 47 帧施加
   `buff_chr_0032_lizhiyan_ultimate_skill_listener_owner`；该 Buff 的 `DuringBuffEnable`
   以 `ChangeSkillAction` 把 `UltimateSkill` 从首段 ID 替换成二段 ID，并指定 Buff 结束时还原；
   二段自身第 0 帧又把同一槽永久换回首段。audit 报告因此能够严格归纳
   `ultimate -> arcana -> ultimate` 稳定槽关系。运行时现已在每次释放开始时快照当前槽技能：
   listener 对应的换槽只影响下一次释放，二段第 0 帧还原也不会把已经开始的二段改跑首段。
   生成器现以这份闭环关系为严格输入：首段直接施加监听 Buff 后生成换到 `arcana` 的
   `changeSkillSlot`，二段只有在第 0 帧与原生动作索引均匹配时才生成换回 `ultimate` 的步骤；
   manifest 同时明确声明 `arcana` 是不可直接放置的运行时替换形态，正式技能组渲染才会把
   二段放入 `replacementSkills`；不能把这条规则泛化到可直接拖放的强化技能。诀仍保持 audit
   阶段的原因已经转为下列
   干员级展示、连携与养成语义，而不是换槽 DSL 缺失。
4. `presentationVariants`、形态感知连携注册、天赋和潜能已逐项与手写定义及原始数据对照并进入
   正式定义。奥义范围 Buff 的最后闭环额外保留了当前能力实体身份：标签查询必须命中正在执行的
   `abilityentity_chr_0032_lizhiyan_ultimate_skill` 才能证明距离两端存在；`Target == MainCharacter`
   读取承伤/失衡事件来源的实时主控状态；`OnPoiseZero` 由正常玩家失衡归零链触发。2026-08-22 的
   `--operator arcane --check` 已通过，`conversionSupport` 为 `complete`。
