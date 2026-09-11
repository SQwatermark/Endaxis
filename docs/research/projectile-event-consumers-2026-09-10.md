# 投射物回调：事件统一需要保留什么

本次只审计已有转换的消费者，不新增投射物路径、敌人行为或技能内容。
**完整回调宿主尚未接入；本报告不是其验收通过声明。**

## 资源回执切片的消费者复核（2026-09-10）

本节按实际调用端区分已闭合的回执改动与仍需正式宿主接入的部分。

| 消费者              | 复核结果与边界                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 普通技能            | SkillRuntime 共用 SkillResourceAccount；CombatResources.pay 以 operator target 返回原账本变化，数值算法未改。                                                                                          |
| 费用和回执          | SkillPaymentChange 以实际 target 表达接收者，SkillRuntime 不再强制 recipient=operator；资源变化点保留实体事实，干员曲线跳过实体账户。                                                                  |
| 费用事件            | afterSkillApplyCost 仍在支付及回执之后从 hostIdentity 发布；applied=false 不等于 paid=false，不依赖玩家 skillType。                                                                                    |
| Buff 监听           | buffLifecycleSequenceRuntime 继续通过公共事件注册和 withAbilityEventResponseContext 响应；SkillAffix 保留 beforeCastSkill、skillEnd、outputBuff、abilityEntitySpawned、projectileLaunched 的独立注册。 |
| 普通能力实体        | abilityEntityOperationExecutor 的 currentAbilityEntity 优先读动作实体；旧即时路径未物化实体时仍可能在 dieWhenSourceDies=false 下回退干员。这是尚存适配边界，不能据此声称全部嵌套 Source 已闭合。       |
| 投射物回调          | 正式路径仍使用 ProjectileCallbackActionRuntime；AbilitySystemRuntime.tryStartProjectileCallbackSkill 的公共入口尚未在这里接通。新回执用例不替代正式路径验收。                                          |
| reset/finish        | ProjectileLifecycleRuntime 先 beforeReset、再 resetCallbacks、后删除实例；来源读取在通知期间仍可用。回调技能自然结束与对象回收不合并。                                                                 |
| 伤害来源            | 本切片不改 PlayerDamageContext 或 SkillCastInfo；支付 target 不参与伤害最终干员归因，仍须在正式回调接入时验证实际 Owner/Source。                                                                       |
| Buff 施加及嵌套来源 | 本切片不改 Buff 来源、来源技能编号和投射物逐层来源目录；不得把回执接收者改动当作全链路归因验收。                                                                                                       |
| 条件与过滤          | 继续共用公共响应上下文和条件求值；未新增费用专用事件、条件分支或监听解释器。缺少玩家分类仍按原有严格边界处理。                                                                                         |

终结技能量回执的另外一个生产者 skillResourceOperationExecutor 只调用干员账本，仍明确
记录 operator 接收者；不因支付接口可表达实体而放开该动作的目标范围。日志摘要和过滤器
只消费通用事件名与数值，资源曲线是此次必须分离接收者的消费者。

新增显式非零账户用例覆盖 applied=true/false，验证支付后事件顺序、原 SkillCastInfo
保留、发射干员账本和曲线不变。该用例的初值是测试输入，不是投射物原生属性证据。
实际资源初值、池化复用状态和当前包属性补丁继续依 combat-spec 取证，未删除兼容层。

## 依据和边界

复刻库 `launch-projectile-skill-routing.md` 已核实当前静态镜像的
`ProjectileComponent._CastSkill(032508D0)`：在投射物自己的 AbilitySystem 上
调用普通 TryCastSkill，传入投射物保存的来源 SkillCastInfo。来源身份与实际技能
宿主不是同一件事；一个回调里的不同时间轴不是多次独立施法。
镜像 SHA256、RVA、非 IFix 限制以该文档和
`skill-affix-identity-2026-09-04.md` 为准。本轮没有新增反编译结论。

来源结构取本地 hybrid-20260905。31份候选干员定义逐文件归一换行后与正式 TS
相同，之后读取候选 operator.json；公共 Buff、武器、套装读取正式模块。
引用出现不等于实际战斗可达，也不意味着目前伤害必然错误。

## SkillAffix 消费者

按 Buff ID 去重共8种。索引模块重复导出的同一 Buff 不重复计数。

| 定义                                         | 现有消费者/影响                                                                           |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `buff_chr_0018_dapan_talent_1_cd_reduce`     | `outputDamage` 响应调整连携冷却、结束准备 Buff，监听存活时间可影响后续输出                |
| `buff_chr_0017_yvonne_normal_skill_listener` | `beforeOutputBuff` 检查冻结标签及施法身份，施加带倍率/暴击参数的 Buff                     |
| `buff_common_affixes_skillimbue`             | 启用时创建下面的附魔伤害 Buff，本体也有 SkillAffix                                        |
| `buff_common_affixes_skillimbue_atk`         | 伤害条件程序检查施法身份及战技/终结技标签，计算附魔倍率                                   |
| `buff_equipsuit_atk_02_addcombodamage_buff`  | 伤害修正检查 `sourceSkillCastMatch` 和连携标签                                            |
| `buff_equipsuit_attrisuitup_02`              | 伤害修正检查 `sourceSkillCastMatch` 和战技标签                                            |
| `buff_wpn_funnel_0006`                       | `beforeOutputInfliction` 检查来源施法和战技身份，维护目标集合/计数并施加增益              |
| `buff_wpn_funnel_0011`                       | `afterOutputPhysicalInfliction` 检查来源施法、击飞及连携身份，维护目标集合/计数并施加增益 |

不能只检查两名干员就宣称引用生命周期没有消费者。但本表也没有证明每一种组合
已经出现投射物导致的伤害差异；仍须构造具体施放、结束、回调与对象 reset 的顺序，
区分技能引用、输出 Buff 引用、实体引用和投射物引用。

## 延后区间不是延后伤害数量

正式定义中能对应109个原始回调 ID。原始回调的3种正起点区间具体是：

| 回调 ID                                 | 原始延后内容                                       | 本次正式产物检查                                          |
| --------------------------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| `chr_0023_antal_power_attack_projhit`   | 第1帧 HitStopAction                                | 不能当成漏掉一段延后伤害；匹配到的即时正文为伤害/处决技力 |
| `chr_0033_camille_attack4_projhit`      | 第2/4/6/8/10/12帧的找目标及伤害/表现动作           | 找到6个 `:delayed:` scope，正文保留 `dealDamage`          |
| `chr_0034_typhoea_power_attack_projhit` | 第1帧目标查询、主目标标记检查/结束、停帧及相机动作 | 不能当成额外伤害；本次未单独验证这些叶子被简化的全部依据  |

原始 enabled 不等于整个父分支可执行。正式正文检查只沿 body、分支、switch option
等执行序列边遍历，不把参数中嵌套的 Buff/实体定义当作当前回调执行的动作。
没有 `:delayed:` scope 也不等于没有调度：无需独立黑板的节点可能直接提升到父时间轴。
此表用于限定下一步用例，不作为全图可达性或全部省略规则的证明。

## 本轮修复：即时写入不能被后续默认值覆盖

过渡适配层允许部分延后节点各自重建默认 direct 黑板，但旧检查只扫描延后节点中的
写入。若第零帧把 `value=1` 改为2，第二帧读取它，独立恢复默认值就会错误读到1。

`compileImmediateProjectileCallbackSkillSource` 现在在需要重建延后黑板时检查
全部回调区间中的已识别写操作，包括即时区间。完整来源程序仍正常保留；只有
不能表示该共享状态的过渡适配层明确报错。原生禁用动作经公共投影剔除，不误报。
没有新增另一份事件解析器，也没有把不同回调的黑板合并。

这个检查沿用原有写操作范围，是保守的转换门禁，不是完整数据流证明。最终持久
回调宿主接通后应正常执行这类程序，而不是永久禁止其存在。

## 接续顺序

1. 以实际回调 Skill 为单位保留 direct 黑板、独立 timeline 区间和自然结束；复用公共
   动作/事件执行器，不能让继承来源冒充实际 owner。
2. 用上述真实消费者验证来源技能结束后回调和引用的存活，再接其他发射形状；
   不因首帧命中或没有伤害正文就自动省略 reset 引用。
3. 不增加路径积分、屏幕位置或碰撞几何。对瞬时优化逐项说明等价条件，不能把
   “距离为零”直接解释为“技能、动作、对象同时结束”。

临时脚本/报告为 `tmp/audit-event-callback-consumers.mjs`、
`tmp/event-callback-consumers.json`，不进入 Git。
本轮31干员重新生成 `--check` 通过，正式产物不变；没有重新宣称武器/套装全量生成通过。
