# 官网公开轴扩样：2026-09-08

## 2026-09-09续查：别礼终结技首击差額已分解到增益来源，腐蚀/赛希时钟不照抄旧版

以0帧别礼主控的诊断对照继续查，而非修改原轴。固定后的报告
`tmp/public-last-rite-damage-fixed.json`：别礼终结技1461/1480/1509帧三笔仍为
118699.75911084884 / 118699.75911084884 / 237399.51822169768；攻击5742，倍率400/400/800。
旧首击217937。第一笔的伤害差額可由下表分区解释，无须改攻击或倍率：

| 分区                    | 旧版               | 新版               | 差异来源与结论                                           |
| ----------------------- | ------------------ | ------------------ | -------------------------------------------------------- |
| 增伤加成                | 2.10716666667      | 1.9471666666666667 | 缺赫拉芬格战技附着分支0.16，来源身份仍待查；不是长息缺失 |
| 增幅加成                | 0.74153            | 0.7415300160646439 | 浮点精度差异                                             |
| 脆弱加成（已乘别礼1.5） | 0.852              | 0.431999994635582  | 艾尔黛拉0.28脆弱未施加                                   |
| 受伤增加加成            | 0.632              | 0.372              | 沧溟星梦0.16未触发，赛希天赋0.10已结束                   |
| 抗性乘区                | 1.1320289667353547 | 1                  | 腐蚀已结束                                               |

只在诊断算式中用旧分区替换新版分区，得到217937.13388980168，与旧整数217937吻合。
这仅证明第一笔的差額账目已拆清，不表示所有旧分区均正确，也不表示整条轴已经归因完成。
未向运行时注入旧增益，未改变原输入/构筑。

### 时钟证据及真实回归

旧 `simulation/events/EnemyEffectHandler.ts` 的 applyCorrosion 用
`ctx.getShiftedTime(time, duration)`，经 SimulationEngine 委托给时间上下文统一顺延。
旧 ENEMY 日志已经是实际时间（含5秒准备期），不是 HITS 的逻辑time：

| 效果                  | 旧实际开始→结束（含准备期）     | 新版帧（不含准备期）   |
| --------------------- | ------------------------------- | ---------------------- |
| 第一次7秒腐蚀         | 12.017→19.517，19.020被战技消费 | 204→413；战技415才命中 |
| 第二次7秒腐蚀         | 38.216→54.633                   | 990→1199               |
| 第二次赛希5秒晶伤提高 | 42.750→56.667                   | 1133→1283              |

所以旧第一次腐蚀被消费后施加28%脆弱，并触发沧溟星梦；新版先到期，消费链不发生。
第二次腐蚀在旧版被延长至16.417秒，赛希天赋被延长至13.917秒；旧首击实际53.687时仍在，
新版首击1461帧已经没有这两项。不能将这种旧版统一冻结的效果复制到新版。

当前快照 BuffData 中两项 `useTimeDilationDt=false`、`onlyUseSelfTimeDilation=false`：

- `buff_common_natural_natural_corrupt_do.json` SHA256 `DABC04F72C7567EFC60D92EA4E5F72D6A06EC81FD822D9EBDF0B7FBB9791719F`。
- `buff_chr_0011_seraph_talent_1_crystup.json` SHA256 `05E6C2536EC21F06977A50FDA75CE18EF4305E92705EF7F5DB33E581C106A947`。

原生依据为 combat-spec/docs/time-dilation.md“Buff时钟选择”：默认时钟在TimeDilation原因下
不随全局缩放，并非所有情形均等同绝对实时时钟。现有生成和运行时符合这两项配置。
新增 realAxisInterruptionRegression.test.ts 两例生产数据对照：先实际施加Buff，然后让
汤汤终结技在其存续中启动，断言开始和结束帧均不变，寿命7/5秒（容许创建帧tick的一帧边界）。
赛希先用一发连携建立寒冷附着，再用第二发触发天赋，不跳过原生既有附着条件。
此文件11项测试通过；本轮未修改生产逻辑、生成数据或combat-spec。

### 下一项：赫拉芬格的战技附着来源

新版 `wpn_claym_0013` 第一分支使用 originSkillTypeIn(battleSkill) + eventInflictionElementIn(cryo)。
主控对照中125/439/780帧别礼幻影的附着回执均归 basicAttack4；整轴没有
buff_wpn_claym_0013_normal_skill，但 combo_skill Buff 在1322/1372施加，1822结束。
需追原始 Buff/技能及原生事件中 SkillCastInfo 的生产/继承，判断是转换/运行时传递缺陷还是
原生行为；不能仅凭武器需要战技就强制把幻影来源改为战技。长息的0.16已经在伤害处理器中，
不要再把总增伤缺0.16误归到长息。

## 2026-09-09：确认独立弹体回调被错误合并，导致艾尔黛拉终结技漏伤害

原始 `SkillData/chr_0025_ardelia_ultimate_skill_sheep_projhit.json` 的第0帧包含多个
独立 TimelineAction：目标搜索、10%概率生成持续治疗羊、对未持有 ArdeliaUltMark 的
敌人造成165%伤害并施加0.3秒标记，分别属于不同节点。来源快照
`tmp/game-data-sources-hybrid-20260905`，文件 SHA256
`A3C8498BB71A29FD8A6AF99493CACD255228EC0D7C7E19E754A4B0C5D4DCFE5D`。

公共弹体转换器原先 flatMap 所有第0帧节点，把它们变成一条失败短路链。正式编辑器的
概率样本固定为1，10%分支返回false，错误地连后面独立的确定伤害一起阻止。
这是已确认的新版转换缺陷，不是旧新主控差异，也不能靠让随机分支恒成功掩盖。
现有 combat-spec/docs/timeline-lifecycle.md 已明确 false 只阻止当前 Sequence 后续项；
每个 TimelineAction 有独立 Execute/Tick/End 生命周期，因此无需新造机制或修改复刻库。

修复复用 Buff 回调已有的“共享黑板、隔离失败”作用域组合，提取公共 helper；没有
强制同一 Sequence 内部跳过失败。延迟且读取声明黑板的安全投影路径也不再按相同起点
拼接步骤、取最大结束帧，而是保留每个节点的调度和结束帧。该路径仍拒绝实体板赋值、
EntityBB声明与延迟序列中的持久黑板写入。
全31名干员重新生成，6名产物变化：ardelia、avywenna、camille、rossi、typhoeus、xaihi。
生成器命令的时间膨胀目录示例修正为 timeDilationCatalog.generated.ts（实际序列化目录）。

证据边界：原生同帧独立节点是否存在额外排序仍是 spec 的未闭环项，本次不宣称解决；
当前概率样本1不是期望值模拟。未来概率方案应考虑可复现种子与状态链，不可对施加Buff、
资源恢复、附着、窗口等分支直接乘概率。此次只修独立节点被吞，未引入随机模式。
此外，fresh-scope延迟投影的既有写入检查只遍历延迟序列，不覆盖0帧序列写入后再被
延迟读取的通用依赖；不能把本次独立节点修复描述成所有跨帧黑板传递均已证明。
后续碰到该形状需补生产者/消费者证据与回归，不应继续扩宽fresh-scope投影范围。

重跑结果（不移动输入、不改构筑）：

| 输入                        | 修复前伤害/笔数          | 修复后伤害/笔数         | 可用性/连携/执行诊断 |
| --------------------------- | ------------------------ | ----------------------- | -------------------- |
| 别赛羊诀原轴                | 730405.2291327439 / 68   | 825921.87309623 / 80    | 14 / 8 / 0           |
| 仅内存加入0帧别礼主控的对照 | 1715151.7144854984 / 85  | 1825092.0127387715 / 97 | 32 / 0 / 0           |
| 用户轴1                     | 693530.8131581588 / 210  | 不变                    | 3 / 1 / 0            |
| 用户轴2                     | 337938.8820469209 / 194  | 不变                    | 1 / 0 / 0            |
| 用户轴3完整时长             | 1996820.2804914764 / 265 | 不变                    | 27 / 5 / 0           |

原轴新增12笔全部归属艾尔黛拉终结技、倍率165%，实际帧
1328/1340/1352/1364/1374/1465/1477/1489/1501/1513/1525/1537。
报告为 tmp/public-last-rite-callback-fixed.json、
tmp/public-last-rite-controlled-callback-fixed.json、tmp/private-three-callback-fixed.json。
旧版总伤害仍为2777215，剩余差额不可直接认定为缺陷。

后续先追增益寿命和别礼伤害分区。此前对照中，艾尔黛拉战技第415帧命中，而腐蚀
第413帧结束，差两帧未触发脆弱；第二轮腐蚀1199结束、赛希天赋晶伤提高1283结束，
别礼终结技首击1461已晚于它们。旧版伤害详情却包含这些来源，需按对象独立时钟核对。
别礼终结技基础400/400/800%、攻击5742已对齐，不应为了总伤害差額修改基础倍率。
旧日志 time 是逻辑时间，应使用 realTime 减5秒准备期对齐实际时刻；不能直接用 time 对比。

全量检查发现艾维文娜两项原有测试把第1帧输入后的相对帧当绝对帧：
未修改HEAD源码的内存基线替换也失败，故只修测试预期31/11/311帧，不改模拟时序。
新的回调回归、既有艾维文娜回归、艾尔黛拉生产模拟共84项通过；应用vue-tsc、
转换器完整tsc和旧轴工具tsc通过。最终全量报告见本轮交接快照。

## 续查：主控身份解释开场旁路与全部八项窗口告警

原样本 switchEvents=[]，旧 controlledOperator.ts 和新版 resolveControlTimeline 都默认
第一轨诀为主控。别礼虽在第四轨执行普攻，放普攻本身不会自动切换主控。
开场回执：A1第15帧命中；第16帧战技的 casterControlled=false，因此未走
SwitchToAddBuff，正常中断A1并跳至非主控时间线300；第24帧A2明确强制执行，
但原生路由期望A1，战技局部307仍不能中断。没有丢掉用户输入。

原始 SkillData/chr_0026_lastrite_normal_skill.json 的 switchToBuffConfig 条件是
CheckSkillType(Attack, mustBeforeExclusiveTime=true) + CheckMainCharacterCondition，
asSkillCast=true，施加 normal_skill_inattack；现有生成定义和运行时符合该旁路。
SHA256 589BC5B01E126474B48E75EDB82B0C96A92BC3E1EAB3A7FEF1F935496BE88DCE。
调用顺序依据 combat-spec/docs/skill-cast-start.md 的 SwitchToAddBuff 章节，未新增机制猜测。

旧 last-rite.ts 战技 triggers 用全局 onFinalStrike + 团队 perfusion 消费，未检查主控。
原始 BuffData/buff_chr_0026_lastrite_normal_skill.json 的 beforeOutputDamage 链有
CheckMainCharacterCondition；当前生成 Buff 的 normalAttackLastCombo + casterControlled
门控追加幻影。SHA256 1D307834484673E5F62F6B72DBAED7F0DBBEDE4D60317F9A02DE8059E5EF98A7。
原轴第一轮普攻倍率68/62/62与旧一致（仅整数展示取整）；A3旧153拆成76.5+76.5，
新每段77，属于待核对的新旧数据精度差异，不能据此倒改生成数据。
第一重击旧12826，新非主控11632.048976624996；切主控对照12826.815644428407。
旧随后单笔320%追加29687；新原轴未触发，主控对照第125帧两笔160%各13939.807706339203。

仅在内存复制方案加入0帧切到第四轨，原存档/转换项目均未修改：
tmp/public-last-rite-controlled-receipts.json 对照85笔、1715151.7144854984，窗口告警8→0、
可用性14→32、执行异常0。主控停帧会改变局部衔接，不能把这个对照称为修好的原轴。
lastRiteControlRoute.test.ts用当前生成定义验证非主控/主控两路径，不修改时刻，不隐式切控，
不中止强制A2输入。原轴仍68笔730405.2291327439；主控差异不能解释剩余全部差额。
旧各来源总账：诀98675、艾尔黛拉123201、别礼2487777、赛希67562。

## 本轮修复与边界

转换器原先只读 switchEvent.trackIndex，而旧 SwitchEvent 实际保存 characterId（轨道id）。
现在在干员slug重映射之前按原轨道唯一匹配，保留事件时刻；无目标、重复/冲突目标明确阻塞，
不静默丢弃。原样本没有标记，所以这项修复不改变其总伤害。
准备期切入目前不属于有效项目输入（校验与编辑命令均要求非负）；转换遇到负帧仍阻塞，
不夹到0帧。这轮没有扩展准备期标记，也没有保留诊断时尝试过的负帧运行时改动。

下一步分解别礼终结技与后续幻影的倍率/增益寿命，并检查诀主控或非主控导致的实际差异。
不要继续把本轴八项连携窗口告警当作八个尚未定位的事件系统缺陷。

来源 https://www.end-axis.com/shares 。公开详情 GET `/api/shares/:id?countView=0`，
shareCode 按旧版 gzipUtils 的 base64url + gzip 解码。原始响应、存档、报告均在忽略的 tmp。
旧版基准是只读 Endaxis-upstream-main 的 4dadc55f，不宣称与在线站点部署版本相同。
通过旧 store.importShareString 加载，读取实际 requisiteWarnings，而非按伤害成功推断无告警。

## 筛选

| 分享 ID / 标题                                            | 旧版当前方案总伤害 | 旧版告警 | 选择边界                                                                 |
| --------------------------------------------------------- | -----------------: | -------: | ------------------------------------------------------------------------ |
| 6960d9afaf72c0e43d122dfb 开荒低星碎冰队                   |             470176 |        0 | 35 块；含 CHENQIANYU_attack damageTicks 覆盖，当前转换器不支持，不可丢掉 |
| 6a91c4241854aefb13172209 庄佩梨杰冷启动                   |            1647822 |       11 | 3 方案，仅检查当前方案                                                   |
| 6a8db84395147370855b45f0 伊赛羊诀                         |            2994298 |        1 | 能量不足；未转换                                                         |
| 6a8db78895147370855b45ed 别赛羊诀                         |            2777215 |        0 | 单方案，无覆盖/连接，选作本轮样本                                        |
| 6a8bfd281ffdf1c2f76700d0 庄莱决梨 双大招流 Maa 材料危境本 |             127018 |        5 | 2 方案，仅检查当前方案                                                   |

## 别赛羊诀身份转换

扩展 mappings.2026-08-31.json（沿用原文件，不改变已有三轴映射）。
艾尔黛拉 battleSkill/comboSkill/ultimate 对应原生 chr_0025_ardelia 的
normal_skill/combo_skill/ultimate_skill；别礼对应 chr_0026_lastrite。
别礼旧 basicAttack 的四个 segments 对应当前 basicAttack1..4 / attack1..4。
核对旧 src/data/operators/{ardelia,last-rite}.ts 和当前 generated-definitions，
不根据告警隐式改技能，不将普通普攻转换为强化技能。

武器通过旧定义的明确 asset ID、当前 assetSlug→原生 ID 和名称核对：
detonation-unit = wpn_artsunit_0010 → wpn_funnel_0008（注意尾号不同）；
dreams-of-the-starry-beach = wpn_artsunit_0013 → wpn_funnel_0013；
khravengger = wpn_greatsword_0013 → wpn_claym_0013。新增测试锁定资产身份。
装备核对旧 gearpieces 单件文件的 asset、部位、名称/词条与当前单件定义，
不是通过套装或图片相似度推断：

| 旧单件                       | 当前 ID                                 |
| ---------------------------- | --------------------------------------- |
| eternal-xiranite-light-armor | item_equip_t4_suit_usp02_body_03        |
| eternal-xiranite-wraps       | item_equip_t4_suit_usp02_hand_03        |
| rift-trekker-gloves          | item_equip_t4_parts_wuling02_hand_01    |
| thertech-plating             | item_equip_t4_suit_poise01_body_01      |
| tide-surge-gauntlets         | item_equip_t4_suit_burst01_hand_01      |
| hanging-river-o2-tube        | item_equip_t4_suit_burst01_edc_01       |
| frontiers-extra-o2-tube-t1   | item_equip_t4_suit_atb01_edc_06         |
| pulser-labs-calibrator       | item_equip_t4_suit_pulse_cryst01_edc_02 |

## 当前重算结果：差异尚未归因

输入 tmp/public-6a8db78895147370855b45ed-project.json；转换输出
tmp/public-last-rite-final/project.json；SHA256
810ab399f2f36f3f357d2570987f3ee65125cf4004596785236a2ec3a1679f30。
报告 tmp/public-last-rite-audit.json。47 块，转换 issues=[]。
配置截止和完整时长均 3600 帧（30fps）；68 条伤害回执，730405.2291327439，
最后伤害帧 1509。来源：别礼 613288.783620056；诀 30344.836643681192；
艾尔黛拉 40050.106301311345；赛希 46721.50256769533。

可用性告警 14，连携窗口告警 8，执行异常 0。窗口帧：艾尔黛拉123/862、
诀135/871、赛希286/1109、别礼454/1309。不能因为没有执行异常就宣称样本通过。
旧总伤害与新总伤害尚未完成口径/逐来源/逐命中对照，差额不是已确认的新版 bug 数量。

下一步先查别礼开场 A1→战技→A2 的实际执行/中断/附着回执：旧源帧305/332/347，
60fps、准备300帧；当前24帧A2有中断/路由告警。检查战技插入是否应取消普攻链，
原生命中与后续效果是否正确保留，再顺着附着检查四人的连携开窗。
这只是调查入口，不是已确认根因；不移动技能、不放宽门禁、不直接按旧总伤害补倍率。
