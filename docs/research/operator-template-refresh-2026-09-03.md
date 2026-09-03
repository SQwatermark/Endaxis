# 当前全部干员模板刷新检查点

## 范围与来源

本轮遵循 AKEDB 优先、VFS 补缺，不发布资源、不改正式模板 pin、不恢复已回退的 VFS-only 批次。
复验输入为 `tmp/game-data-rebuild/run-dYAF19/sources`，AKEDB 版本 `1.5.3@9885010-4`，
6230 文件，整批 SHA256 `3c85bb1596f73d384403bdfe35f576b1ffb00beafcb13fe502fdc8154fd3331c`。
标签使用此前完整导出的 `run-KjA4Lw` 候选，并重新用其 source-set 做严格生成 `check`；
输入复验前后快照一致。报告 `tmp/operator-refresh-20260903/refresh-verified.json`。
这证明本地字节与来源记录一致，不证明 AKEDB 与 VFS 来自同一客户端/热修版本。

## 实际发现与处理

- 当前全部 32 份 CharacterData 的已解码前缀、黑板和连携条件可编译；它们仍是 partial 模板，
  没有声称完整原生模板解析成功。已有 30 名的 pin 全部变化，但不代表 30 名效果都变了。
- `chr_0034_typhoea` 的两个原生条件事件为 `addedBuff` 与 `beforeOutputDamage`。
  第二条依次取反检查 Pending、比较 trigger 与主控、检查箭能量 Buff 数量、比较 EntityBB。
  原先首先卡在 `CheckComboSkillPending`，补齐后暴露 Context/主控搜索比较，现均由公共链处理。
- `casterComboPending` 是参数为空的公共条件；来源严格限定已证明为 caster 的普通 Owner/Source，
  未证明目标和带筛选目标继续拒绝。模拟读取该角色候选数，不检查队首、技能阶段、CD 或 canCast，
  暂停计时不影响存在性，消费/过期后变 false。条件编辑器和三语名称同步接入。
- Context 比较复用 `contextTargetIdentityMatch`；只接已经绑定的单目标事件 `trigger` 与
  `CharacterTeamFinder + MainCharacterValidator`。未绑定 Context 继续拒绝：原生相等检查对
  任意列表执行全组合比较，空列表返回 true，不能随意降成首目标比较。
- 未配置的另一份模板是 `chr_0002_endminm`；管理员仍以女版生成唯一一套技能，不因此新增男版干员。
- 30 名现有干员技能库共 310 个配置技能，29 名通过。庄方宜唯一阻塞为
  `chr_0030_zhuangfy_ultimate_skill_end` 不在新版 CharGrowthTable 等级组。角色模板仍将它登记
  为主动技能，原 SkillData 也存在；尚未改配置，应核查内部结束技能/运行替换路由。

## 证据与实现边界

复刻库已具备两项语义，不需要复制研究或新增虚构规则：

- `combat-spec/docs/combo-skill-lifecycle.md`：CheckComboSkillPending RVA `0x060382C8` →
  HasPendingComboSkill RVA `0x060601F0`，只看该角色候选列表 Count > 0；空目标 false。
- `combat-spec/docs/check-targets-equal.md` 与 `selector-pipeline.md`：比较解析后的目标，
  CharacterTeamFinder 后由 MainCharacterValidator 保留当前主控 Entity。

这是既有 1.4.4 原生回退路径证据与当前 1.5.3 资源的适配，没有重新核验本版本机器码或 IFix。
复刻库 ComboSkill 定向 60/60 已通过，本轮不修改复刻库。
Endaxis 回归覆盖 JSON/RID 共用解析、错误目标拒绝、Pending 生命周期与实际装配条件短路。
编译器 139 文件 / 1575 项、Next 304 文件 / 4079 项及四套类型检查通过。

统一重建命令新增干员刷新阶段，不再只列角色身份；每名失败单独收集，并将 pin 变化、未配置身份
保留为需要审阅的阻塞。单独刷新检查已实际通过来源复验；完整命令本轮重跑 `run-8PfnvM`
在标签重新获取时 `fetch failed`，后续阶段正确标为 blocked，未借旧标签冒充本次网络导出。
因此不能声称本次完整命令贯通，`fullRebuild=false`、`published=false` 保持不变。

## 后续优先级

1. 核对庄方宜内部结束技能的等级/运行路由；技能库审计的 `parseValidationOptions` 尚未传递
   生成器已支持的 `runtimeReplacementSkillKeys`，修复时需做一致性回归，不靠配置绕过未知规则。
2. 推进同批能力实体、投射物黑板与全局配置输入，隔离更新候选 pin，完整编译新旧干员。
   不能从旧聚合生成物复制依赖来声称“全部删除后重建”。
3. 旧干员效果差异以 [已有字段差异审计](operator-refresh-differences-2026-09-03.md) 为线索：
   洛茜 Buff 时钟、赛希/别礼/莱万汀事件先后、诀同次施法过滤与时长、梨诺回调闭包、重击资源变化。
   需要同轴比较，不以源哈希或格式变化代替效果结论。
4. 新干员尚未正式配置或完整模拟；按四类技能原生路由安排技能库，不能仅按 ID 后缀猜技能连段。
   全武器仍有 `wpn_funnel_0020` 的 `OnBuffEnhanceChanged` 阻塞，不能漏记但也不能盖过干员刷新。

## 同日后续：30 名技能库通过，28 名候选逐技能试算通过

前述庄方宜阻塞已定位为**审计误报**：现有 manifest 本来就声明了
`runtimeReplacementSkillKeys: [enhancedBattleSkill, enhancedComboSkill, ultimateEnd]`，并将
ultimateEnd 标为 internal。当前 `buff_chr_0030_zhuangfy_ult_base` 的结束回调仍先执行
ChangeSkillType(AttachSkill) 再 CastSkill；见复刻库 `docs/change-skill-type-action.md`。
不改 manifest，不增删玩家技能。领域新增共用的 `parseOperatorSkillGroupValidationOptions`，
生成器和技能库/闭包/Unity 引用审计全部使用它，覆盖例外、未知键和重复键回归；重新检查 **30/30**。

主动技能规划现在直接接受 AbilityEntityData 目录。当前 **215/215** 份前缀严格解析成功；
保留文件名与 gameId 对应、未知字段拒绝，不对当前原始文件套用旧容器的字段裁剪。
旧聚合证据仍可显式传入供已有基线回归，但缺件不回退。艾维文娜完整定义与公共 Buff 回归确认
两条来源路径生成相同对象。统一命令本轮无 worker 的本地复验为 `run-gDilAd`：
来源、装备、能力实体前缀和生成后来源复验通过；标签缺显式 worker 仍阻塞，未发布。

### 全干员定位性规划

本机 `tmp/operator-refresh-20260903/plan-current.ts` 先复验 6230 项来源，再核对角色身份、只在
临时 manifest 更新 30 个模板 pin，调用正式 `planOperatorDefinition`，最后复验输入不变。
没有修改正式 pin。结果 `tmp/operator-refresh-20260903/current-plans/report.json`：

- 28 名完整规划成功，包括庄方宜、洛茜、赛希、别礼、莱万汀和梨诺；
- 诀：`buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener` 的两个同次施法过滤。
  复刻库 `save-buff-stack-num-advanced.md` 已明确普通 SkillCastInfo 不等于 Buff affix 环境的有效
  施法编号，因此不能直接给 Buff 设置 `actionEnvironmentSkillCastInfoIsSourceCast=true` 绕过；
- 秋栗：`buff_common_affixes_skillimbue_atk.damageModifier[0].condition` 在两个检查后执行 IfElse，
  根据伤害 mask 256 将 `real_imbue_scale` 写为 `imbue_scale * 1.5` 或 `imbue_scale`，随后
  DamageScaleProcessor 读取该键。条件树不是纯谓词，不能丢掉写入或只保留最终布尔值。

仍显式使用旧投射物 EntityBB、TimeDilation、GlobalBuff 和 SkillSetting；标签是此前复验候选。
报告明确 `diagnostic-mixed-dependencies`、published=false，不能称同版本全重建成功。

### 独立上轴门禁

本机 `current-smoke.test.ts` 直接重新调用规划器取得内存对象，以技能库公共放置枚举器列出全部
可放置技能（不把 internal 技能变成玩家操作）。28 名共 289 项，每项潜能 0/5、技能等级 12、
天赋点满、无武器装备、初始终结技能量 0、唯一高血量木桩，独立放置并运行 1050 帧。
使用产品 ScenarioSimulationService，资源不足/形态不匹配仍沿产品强制施放与告警规则执行。
**578 次模拟 + 28 份定义检查 = 606/606**，结果 `current-smoke-result.json`。

注意：不得把普通 JSON 序列化后的 candidate.json 当作可模拟候选；Unity 阶梯曲线的 Infinity
切线会被 JSON.stringify 写成 null。初次诊断因此出现骏卫曲线字段校验失败，直接消费规划对象后
通过，无须修改游戏数据。正式 TS 生成通路不经过此有损中转。

本轮没有执行数值差分、强化状态组合轴、所有随机分支、装备或新干员 Typhoeus 的完整模拟。
旧干员的时钟/事件顺序等差异仍需专题断言，不能由单放成功推导为数值完全正确。

2026-09-04 收尾：编译器全量 140 文件 / 1580 项、compiler/production 类型检查通过。
本轮未改本体运行逻辑、正式生成资源、combat-spec 或 VFS；临时输入、候选与模拟报告均不入 Git。

## 2026-09-04：伤害修正条件公共化检查点

`buffRuntimeProjection.compileDamageModifierCondition` 已不再独立解析原生条件叶子和掩码，
改用 `compileCombatConditionSequenceSource`，保留整个序列返回值。同步伤害修正上下文显式
标记为 `damageModifierContext`；它只证明当前伤害包可供条件读取，不是事件广播。
`damageModifierConditionProjection.ts` 仅把已编译纯程序无损降低为现有运行协议，不包含
任何原生字段/枚举转换。长期接通统一运行后可去掉这层适配，不应再向它扩展一套黑板动作语言。

已修两个不安全假设：空处理器不代表条件无副作用；防御方 Target 不代表敌人。
目前纯 Tag/Feature/编号/黑板比较/布尔树可降低，有写入和未接入的上下文语义则严格阻塞。
秋栗实际诊断现在指向 `calculateActionValue` 需要动作序列运行，不再是 IfElse 无法解析。
没有新增秋栗专用倍率或配置，没有宣称其转换完成。

复刻库现有 DamageModifier.Apply 已先执行 SequenceAction.ExecuteInstant，再按处理器时机
执行。其既有 IfElse / SimpleCalc / ModifyDynamic 直接可用，本轮新增 8 项结构性回归；
连同 DamageProcessorTests 和 ParsedSkillCastIdCondition 共 64 项通过。证据仍是旧版本原生
控制流与当前来源配置的组合，没有新版本机器码复验；普通 SkillCastInfo 对 affix 的代用边界
已明确补进复刻库，不能据测试通过放开诀的同次施法过滤。

### 下一切片的具体实现位置

1. 条件程序直接使用公共 ActionSequenceDefinition，不再添加 Modifier 专用 IfElse/写值 DSL。
   `packages/game-data-contract/src/modifiers.ts` 与 `buffs.ts` 当前只有纯 condition；协议的
   扩展必须同步覆盖所有 Buff 入口，不以绕过校验的临时回调代替可保存的数据。
2. 对齐 `compileSkill.ts` / ResolvedSkillBuffDefinition 与 `combatBuffDefinitions.ts`：前者
   处理内联 Buff 的养成解析，后者处理公共 Buff。不要只接前者导致全局/装备 Buff 失效。
3. 复用 `buffLifecycleSequenceRuntime.ts` 已有的每实例 CombatActionSequenceRuntime、
   Buff 黑板和受控操作链；`DamageModifier.apply` 需要消费布尔返回值。临时伤害包 Context
   要与普通 AbilitySystem event 区分，不发布虚构事件，也不能覆盖 Buff 自身来源施法信息。
4. 每次 Modifier 调用都先按 side/owner 门控，再执行条件（含 Before/After 两阶段），最后运行
   processors；保留短路、End/Reset、实例隔离、写入可见性与空处理器行为。动态倍率不能缓存。
5. CheckSkillCastId 原生预期值是 affixSkillCastId；现有 Next 和 C# 的普通来源编号并不构成
   全路径等价证据。接线前核实此 Buff 来源，或先补明确 affix 身份端口/来源传播再开放正式生成。
6. 严格解析、编辑器与公共导图入口一起接，最后用秋栗两分支的实际伤害断言验收；606 次
   “不报错”仍不能替代此数值测试。诀之后再处理同批剩余全局依赖、新干员与新武器回调。

本轮编译器 141 文件 / 1594 项、compiler/production 类型检查通过；28 名候选的 578 次
模拟 + 28 份定义检查共 606 项重跑通过。报告仍在上述 tmp 路径；正式 pin/生成物未变，
AKEDB 主源策略不变，完整重建及发布仍未完成。

## 2026-09-04 后续：同步执行宿主与真实伤害处理器回归

前节第 3/4 项的核心运行宿主已实现：

- `DamageModifierConditionProgram` 是装配后的执行端口，不是可保存协议中的 JS 回调；
  `CombatBuffDefinition.damageModifiers[].createConditionProgram` 按 Buff 实例创建它。
  `DamageModifier.apply` 只向它传入只读伤害视图，不能任意修改 DamageContext。
- `createDamageModifierConditionProgram` 接收已经解析好的公共 ResolvedActionSequence 和
  所属 Buff 的 CombatActionSequenceRuntime；当前只开放条件分支及两类黑板运算。持续动作
  在安装时明确拒绝，不把首帧执行当作完整语义。每次伤害调用独立建立动作状态并 End/Reset。
- BeforeApplyDamageModifier 单独放在 CombatOperationContext，不伪装成 outputDamage 等
  AbilitySystem 广播；保留 Buff 自身来源身份，但清掉此次判断不应继承的外部事件/InputTarget。
  伤害类型/标签/特征仍复用 EventContextConditionExecutor 的公共匹配逻辑。
- CheckSkillCastId 对此上下文强制读取显式 affix getter。测试将普通来源编号设为 999、affix
  设为 42，确认包 42 生效、包 999 失败；未知端口抛错，0/null 为 false，非法 UInt32 拒绝。
  这只提供正确的消费边界，**没有证明/实现真实 affix 写入及引用传播**。

新 `damageModifierSequenceRuntime.test.ts` 从合成原生字段序列进入正式解析/转换/编译，
通过真实 CombatBuffContainer 注册 DamageModifier，再调用 PlayerDamageContext。受控
基础值 100 和灌注 0.5 得到 175/150；两阶段重算、多个 Buff 的独立黑板、空处理器写入、
结束注销和副作用前短路均有断言。不是把测试中的 0.5 当作当前秋栗所有等级的真实数值。

当前真实文件另经 `npx tsx tmp/operator-refresh-20260903/modifier-sequence-current.ts`
复验，5 项条件结果与写回值通过。来源文件 SHA-256
`236b56504ba7811b529448751f8e16ef95e2c1d8896835751ab632cdd8500353`；完整来源快照前后均为
`3c85bb1596f73d384403bdfe35f576b1ffb00beafcb13fe502fdc8154fd3331c`。
报告 `modifier-sequence-current-result.json` 标记
`current-source-condition-program-with-controlled-affix-and-blackboard-inputs`、published=false。

全量 Next 305 文件 / 4100 项、编译器 141 文件 / 1594 项及 Next/compiler/production 类型
检查通过。公共持久化协议和编辑器尚未增加条件序列入口，生成器的纯程序门禁未放开，正式资源
未改。本轮不修改 combat-spec/VFS，不重复声明上一轮 606 项上轴检查已在本轮重跑。

下一步应从复刻库 `skill-affix-action.md` 列出的原生 ExecuteInternal/OnOutputBuff 及 Buff
affix 字段读写核实来源；当前 C# SkillAffixAction 也只是 FillSkillCastInfo + OnSkillEnd 的
直接技能寿命子集，不能用它自行证明所有 affix 身份等价。来源闭环后接公共数据字段、严格校验、
公共/内联 Buff 编译及编辑器，再开放秋栗整名生成与实际组合轴验证。
