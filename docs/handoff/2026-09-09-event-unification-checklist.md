# 实体能力系统事件统一：已办与待办

本文件是 2026-09-09 收束时的工作清单。接续时先读本文件，再读
[事件响应架构](../next/event-response-architecture.md)。架构规则由后者维护，
本文件只维护交付状态、遗留风险和执行顺序；current-context 中逐轮记录是历史快照。

## 目标与当前结论

**晚间当前状态：**干员被动五种准入事件、武器技力事件、配装共享黑板与响应序列复用
已贯通。配装普通启动安装已迁到 enableSequence，成功后才开放本贡献响应，再执行
Toggle/固定构筑初始化；条件也服从相同门禁。79武器/24套装已生成审阅落位，四条真实轴
完整回执及告警与基线一致，完整生成器1736项通过。详见 current-context 最新条目。
下方早期“三事件”“未再生成”“启用门禁待查”均为历史记录，不应重复执行。
剩余主线是消耗 Buff、物理异常、技能临时监听的兼容入口及优先级/上下文边界；
只收束已有技术债，不扩展新的游戏机制。

**最新验证（晚间候选闭环）：**31 位干员候选已完成，只有 Camille、Pogranichnik、
庄方宜三份监听安装结构变化，审阅后已落位正式目录。潜能 0/5 分别通过
325 技能、198 技能库放置、31 组合轴；四条既有真实轴完整回执和诊断在迁移前后产物间
一致。共享资源沿用正式基线，未声称完成其重新生成。落位后 3 文件 55 项通过。
下面关于“未重新生成”、三事件准入及启动 Buff 保护的段落为较早检查点，
当前被动准入为五事件；剩余工作从跨宿主路由、优先级及 P2/P3 边界继续，不能重复
执行已完成的被动迁移，也不能将技能临时监听一并视为已经删除。

最新续接：OnObtainAtb / OnReceiveHeal 也已迁移到公共被动响应，干员转换器不再
生成旧 listener；新增事件与技能等级编译/黑板写入已有定向回归。仍未通过全量再生成
退出正式数据中的旧监听，后文相关待办需按此区分“代码已迁移”与“产物待验证”。

晚间续接：被动宿主已分离注册/启用状态，enableSequence 成功后才启用响应；
有启动 Buff 的 OnAddedBuff 也已统一到 abilityEventResponses。下方原收束记录中的
启动 Buff 临时保护为历史状态。生产转储的 IFix/精确运行版本边界仍未消除，
当前实现依据已记录的未补丁主干；尚未重新生成正式干员。

目标不是把所有通知改成同一个名字，而是让同一个原生事件从发布到订阅使用同一份
事件身份、载荷和上下文规则，避免技能、Buff、天赋潜能、武器装备各自解释一次。
目前公共载荷、主要发布订阅链路和响应上下文已统一；旧兼容端口、生成器准入范围、
额外内部通知与少数语义缺口尚未收完。不能宣称所有 CombatSemanticEvent 路径已删除。

工作树：Endaxis-game-data-refactor，分支 refactor/common-game-data。
证据仓库：combat-spec-operator-completion，分支 refactor/operator-completion。
本次不重新生成全量干员，不覆盖下载资产，不扩展敌人主动行为，不改技能块文本。

## 已完成

### 事件契约与发布路径

- [x] 建立 `combatAbilityEvent.ts` 公共事件载荷映射，事件名与载荷关联；
      标准环境的发布、实体分发器、eventsFor、订阅共用映射。
- [x] 主要原生链路直接传递事件与 payload 原引用，不再通过
      normalizeAbilityEventPayload 构造第二套 kind/字段对象；该包装函数已删除。
- [x] 覆盖伤害前后阶段及可变计算端口、治疗、Buff 添加/结束/提前结束/消耗/吸收、
      物理异常与倒地组件事件、元素附着、技力获得、击杀、增强、护盾、失衡、
      弱点、能力实体生命周期及技能阶段等已接入路径。
- [x] 保留 dispatcher 的阶段与优先级顺序；不因为统一接口而合并宿主生命周期。
- [x] 删除 simulationReactionApplied、自造反应状态监听入口及无正式生产路径的
      statusExpired/statusConsumed；原生反应相关通知不由这些模拟器通知替代。

### 响应上下文与来源

- [x] `abilityEventResponseContext.ts` 统一进入/退出响应作用域：原事件、
      skillCastInfo、Input/Trigger 和目标上下文在执行期间设置，finally 恢复。
- [x] 技能临时监听、条件判断、干员升级被动、装备兼容监听、Buff 倒地兼容监听
      使用同一作用域机制；条件与动作共享对应执行上下文。
- [x] Buff 的 owner、source 和 target 分开处理，不把监听者当作发布者。
- [x] `readSkillCastInfoFromPayload` 只读载荷；误传完整事件或损坏来源明确报错。
      undefined 与 null 保留；不从当前技能字段补造 origin，也不补技力消耗 0。
- [x] weaknessSet 只要求真实使用的发布者端点，不再制造 target 占位；
      仍只支持显式外部事实，不模拟敌人的主动弱点窗口。
- [x] 手动倒地兼容输出与原生 afterOutputKnockDown 明确区分，不能用击飞或
      before 阶段冒充 after 阶段。兼容路径不伪造原生载荷。

### 生成器与准入

- [x] 干员被动的公共准入表由契约层维护，编译器与校验器不再重复列举。
      当前允许 abilityEntitySpawned、abilityEntityFinished、addedBuff 三种响应，
      这不是完整原生事件枚举，也不是全部生成器事件已迁移。
- [x] 无启动 Buff 的 OnAddedBuff 经公共被动编译后生成原生 addedBuff 响应，
      保留旧 Target 到 eventSource 的映射；测试覆盖生成结果与运行时编译。
- [x] 有启动 Buff 的 OnAddedBuff 保留旧 listenForCombatEvents 注册位置。
      原生响应当前先于 enableSequence 注册，旧路径先施加启动 Buff 再注册；
      在原生 Enable 精确时序未核实前不改变初始化可观测行为。
- [x] 测试覆盖原事件引用、空来源、目标绑定、作用域恢复、注销后不响应及类型约束。
- [x] 已整理 Extract/Exclude 全量初始清单与分类整改计划。
      初始 281 处是排查引用数，不是 281 个缺陷，也不代表整改全部完成。

## 待办与建议执行顺序

### P1：先收束定义和生成器事件路由

1. 核实原生 Ability.Enable 注册响应与安装启动 Buff 的准确顺序，包括补丁边界；
   证据写入 combat-spec 后，再决定移除上述 OnAddedBuff 保护。
   本机续查见 combat-spec `docs/ability-enable-event-order.md`：先注册、后添加启动 Buff、
   最后设置 enabled；序列另查有效性。仍待精确绑定环境类型快路径与 IFix 边界。
   不得仅凭注册在先就开放初始化期间的响应；应先设计宿主启用门禁再统一生成路径。
2. 审计 OnObtainAtb、OnReceiveHeal 的旧 listener 生成路径；尤其检查前者目前
   source=skill/gainKind=gain 的额外筛选与专用动作编译，不可只换事件名称。
   本机后续已移除三宿主共用链路中 Skill/Gain 专用编译器与干员隐式筛选；
   公共条件投影与编译子集的固定 Skill/Gain 元组也已移除，资源生产参数与条件
   共用 spGainEnums 映射。显式多选、空集合和关闭筛选均保留。旧 listener 安装位置暂不变，
   原生响应入口迁移、OnReceiveHeal 与宿主启用门禁仍待办。
3. 对照 Buff、武器、装备及干员被动的投影准入表，公共结构归公共层，宿主只保留
   安装/销毁、等级与黑板特性。不得为扩大支持而静默放行未知载荷。
4. 审计 passive 的 samePriorityKey 与非默认优先级；当前生成器仍拒绝未经支持的
   非 Default/非零偏移，不将此限制误写为原生限制。
5. 完成上述迁移后有针对性重新生成并审阅差异，再执行真实轴回归。
   本次没有通过全量再生成证明所有旧定义已退出兼容路径。

验收：同一原生事件只有一份载荷定义；生成器、契约、运行时有贯通测试；
启动 Buff、来源与优先级行为不因入口迁移改变。

### P2：额外通知分类与类型边界

- [ ] 分类 StandardPlayerDamageEvent 中公共映射外的通知，例如 beforeKillEntity、
      失衡伤害过程、beforeTakeSpellBurst、elementalInflictionStarted、poiseRecovered
      及倒地组件内部通知。区分原生能力事件、组件事件、模拟器内部流程通知。
- [ ] 已知内部事件不应在每个消费者处退回 unknown 再做完整 guard；继续收束
      resolveAbilityEventContext 的类型擦除，但保留真正外部输入的校验边界。
- [ ] #emit 当前有一次恢复事件名/载荷关联的构造断言，记录其边界；
      不把它误认为运行时校验，也不为了零断言重新复制 payload。
- [ ] 按 [Extract/Exclude 整改计划](../next/extract-exclude-remediation-plan.md)
      分类推进，不机械替换有明确差集含义的类型。

### P3：兼容端口与独立语义缺口

- [ ] outputAirborne/outputKnockDown 的手动动作仍可用于编辑器自定义定义，不能
      因正式生成样本无引用就删除；先明确兼容策略，再收缩旧 semantic dispatcher。
- [ ] BuffEnhanceChanged 的原生 Buff 实例/来源上下文尚不完整；不能借宿主补齐，
      更不能当作 afterTryEnhance。
- [ ] storeShieldValueCurValue 的事件快照与原生显式 Target 当前有限护盾读取
      不等价，需要生成器目标表达与运行时读取一起修正。
- [ ] 核实来源条件的缺失/显式空来源规则，不能用当前技能或监听者身份补造。
- [ ] 原生 GameLevelEvent 的消费者研究已单独记录在 combat-spec；当前只确认
      可调用关卡/实体脚本动作，不代表当前版本所有资产实例已穷举。
      不直接认定整类无效，也不因此引入敌人主动行为。

### 返回原主线

事件统一达到稳定边界后，回到真实旧轴复刻和伤害归因。旧版只作参考，
以同版本数据和原生证据解释差异；不为对齐人工测量的少量帧差改变正确生成结果。
编辑器扩展、旧代码清理和无关能力开发不插入本轮收束。

## 验证与证据边界

收束前综合回归：121 个测试文件、1532 项通过（combat、相关 compiler、
skill validator、真实轴中断回归及三个被动生成测试文件）。
启动 Buff 注册保护补充后，passiveSkillBatch 3 项通过；提交前再次检查契约、
生成器生产代码与应用类型。未声称全仓所有测试、所有真实轴或浏览器人工验证已完成。

复核命令：

```powershell
npx vitest run src/core/combat src/core/compiler/compileOperatorUpgrades.test.ts src/core/compiler/compileEquipment.test.ts src/core/compiler/spellInflictionSavedValue.test.ts src/core/game-data/validateSkillDefinition.test.ts src/application/realAxisInterruptionRegression.test.ts tools/game-data-compiler/test/passiveSkillBatch.test.ts tools/game-data-compiler/test/passiveSkillInstallation.test.ts tools/game-data-compiler/test/passiveSkill.test.ts --reporter=dot --maxWorkers=2
npm run type-check:game-data-contract
npm run type-check:game-data-production
npm run type-check
git diff --check
```

原生语义查 combat-spec 的对应专题（特别是 origin-skill-event-context、
passive-direct-damage、game-level-event-consumers），不由旧 Endaxis 推定。
证据版本、IFix 和未穷举资产范围以各专题记录为准。

提交内容不含 tmp、下载资产或本机转储。接续先核对两个仓库的分支与远端，
不要将 main 当成当前工作分支。推送结果以实际 Git 提交记录为准。
