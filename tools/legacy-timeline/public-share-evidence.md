# 官网公开轴扩样：2026-09-08

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
