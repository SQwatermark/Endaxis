# 官网公开轴扩样：2026-09-08

## 2026-09-09：别礼非主控战技返还时序已归因

旧版last-rite.ts的battleSkill首个hit固定offset=0.2、spReturn=30，因此原轴开场
0.533333秒施法、0.733333秒返还；没有按是否主控拆分返还时机。新版三次返还均30，
发生在16/331/673帧，与三次非主控施法同帧，合计仍90，没有多返还。

原始SkillData.chr_0026_lastrite_normal_skill的timelineActions中，0..2帧动作
NotNextCheckAction + CheckMainCharacterCondition(Source)控制JumpTo(destFrame=300)。
第300帧序列施加buff_chr_0026_lastrite_normal_skill_self；此Buff的OnBuffStart先施加
队伍normal_skill Buff，再执行ObtainCostAction，atbGainMethod=Return、数量读取atb。
正式生成定义对应jumpTimeline(not casterControlled)、300帧applyBuff及start生命周期
changeResourceByActionValue(refund)，atb初值30。跳转目标是序列位置，不是十秒等待。
因此当前原始数据支持非主控分支立即返还，不能为复刻旧显示人为补0.2秒延迟。

源文件位于tmp/game-data-sources-hybrid-20260905，SHA256：

- SkillData/chr_0026_lastrite_normal_skill.json：589bc5b01e126474b48e75edb82b0c96a92bc3e1eab3a7fef1f935496be88dce。
- BuffData/buff_chr_0026_lastrite_normal_skill_self.json：5b532c743f5c5022af7f9773796af25411ffdf95cfc57c6b56ec20876870e977。

新增正式editorSimulationService回归：诀为轨0、别礼非主控轨1于16帧战技，无输入修改、
无执行异常；16帧应用self Buff，100帧范围内唯一返还30。真实轴回归文件20项通过，无
跳过/预期失败。本轮不修改模拟/生成行为；旧版固定时点与当前游戏分支不同，历史游戏
版本是否曾采用旧时点未知。主控分支另走6帧main_start Buff及其子时间轴，不在该原轴
结论覆盖范围，不能把非主控的同帧返还推广到所有释放场景。

## 2026-09-09：公开原轴完整技力曲线与重叠暂停差异

只读旧版4dadc55f，原分享6a8db78895147370855b45ed重新经正式store导入，伤害2777215、
requisiteWarnings为空；提取store.spSeries全部65点，不再用最后一条SP_CHANGE猜最终资源。
报告tmp/public-old-full-sp.log及tmp/public-full-sp-comparison.json。旧时间减准备区5秒，
新时间使用原始frame/30，没有移动输入；新报告沿用同原轴public-native-resource-settings.json。

| 对照点                  |   旧版技力 |   新版技力 |
| ----------------------- | ---------: | ---------: |
| 0帧                     |        200 |        200 |
| 389帧（该时刻之后的值） |      0.536 | −47.733333 |
| 900帧                   |     34.536 | −93.466667 |
| 1500帧                  |    166.536 |  66.533333 |
| 2000帧                  | 299.869333 | 199.866667 |
| 2376帧                  |        300 |        300 |

旧连续曲线首次满值在战斗时间66.683秒，新逐帧事实首次满值79.2秒。旧曲线自然增长累计400，
新自然恢复实际累计610；结合已证旧重击多210、双方战技−600与返还90，双方最终300均自洽。
400是沿完整投影曲线的非瞬时增长累计，不伪称旧运行时逐帧恢复日志；同帧取最后事实，
旧非事实时刻按其原有折线插值，新按最后回执取值，不能把小数差都当作运行时误差。

发现旧版内部两种暂停语义不一致：TeamState.pauseSpRegen累加剩余暂停，projectSpSeries
却使用frozenUntil=max(frozenUntil, now+duration)。本轴0.083333与0.533333秒两次0.5秒暂停，
运行时应累积保持至1.083333秒，绘图却在1.033333秒添加恢复起点，再连到3.716667秒真实值，
将0.05秒保持差摊进后面的斜率。这个旧绘图缺陷不复制。更根本的原生语义已由combat-spec
docs/atb-gain.md证明：CostAtb覆盖暂停为SkillSetting.atbRecoverInterval，不累加；新版
combatResources保持此行为。新增重叠扣费回归确认剩余0.6时再次扣费重置为1而非1.6，
暂停满后下一帧才恢复，定向文件20项通过，无跳过/预期失败。

本次补齐完整曲线提取与暂停差异归因，不宣称每个逐时刻差值完全解释。开场旧返还在
0.733333秒、新返还在16帧已出现，属于另一个返还时序差异，仍须追踪来源而不能用暂停
解释。未修改模拟行为，未跑全套/类型检查，也未追加浏览器视觉检查。

## 2026-09-09：私有轴卡缪实体结束清理缺口已接入

复用已有OnAbilityEntityFinished来源/目标证据与公共能力事件dispatcher，新增被动响应字段，
按所属等级编译动作，不复制事件系统。宿主为一个响应保持一个SequenceAction实例，复用
被动黑板，逐次绑定实体InputTarget，事件来源施法与普通来源分离，支持显式注销及构造失败清理。
原被动局部黑板还缺角色EntityBB父板；本轮同时补齐，以使清零真正写回角色共享值。

卡缪由原生基础被动生成combo_2_type和abilityEntityFinished响应，无手写Buff内容或技能特判。
原始私有轴sc_0nz7ti7：图标16帧施加，蝠翼1435帧到期；sc_yh34je7：365帧施加，1752帧到期。
修复前均缺图标BuffFinished；接入后同一帧新增reason=other的结束回执，随后才记录实体结束。
原始轴输入和随机选择未变。报告tmp/private-three-camille-passive.json；初次伤害与命中仍为
693530.8131581588/210、337938.8820469209/194、1996820.2804914764/265，执行诊断全0。

回归覆盖实际生产技能创建实体并在结束时清图标、输入不变；被动写共享黑板被主动技能读取；
事件动作等级展开和优先级校验。未做视觉验收，也不把两条样本的修复推广成全干员状态完整。
最终五文件134项通过，无跳过/预期失败；应用及编译器完整类型检查通过，卡缪再生成--check通过。
共享板修正后的最终三私有轴报告tmp/private-three-camille-passive-final.json保持上列数值与诊断；
公开原始轴tmp/public-camille-passive-final.json仍821184.9467385851/79，14/8/0。
本轮未跑全量套件；新被动事件的编辑页面展示及同事件多种宿主竞争的原生精细顺序不属于
这两条清理样本已证明的范围，后续应分别验证，不以当前测试代替。

## 2026-09-09：基础被动差集不能统一当作漏伤修复

在b165331d之后继续检查同批SkillData/BuffData与正式生成文件，结果如下：

- 艾尔黛拉passive_combo_skill安装trigger_aura，再给队伍安装trigger_listener。
  listener监听OnBeforeCastSkill，排除来源本人；连携分支StoreSkillDamageType后创建
  trigger_count和trigger_timer，其他战技/终结技结束计时Buff。count读写
  EntityBB_skill_bg_type并创建trigger_succeed，timer在30秒结束时重置黑板；succeed
  结束时清timer。正式定义只有该黑板初值99，没有上述Buff。该链具有状态意义，不能以
  “非直接伤害”省略；具体连携窗口差异仍待验证。
- 卡缪passive_listen_normal_skill除安装combo_2_type外，还注册OnAbilityEntityFinished：
  CheckTagMatch(Target)通过后把Owner的EntityBB_bat_spawned设0，结束Source上的
  buff_chr_0033_camille_normal_skill_bat_duration_icon。combo_2_type的DuringBuffEnable
  则对chr_0033_camille_combo_skill_2执行ChangeSkillType=ComboSkill。当前正式定义无这些根。
- 实际给卡缪配置basePassiveSkillIds后运行完整生成，失败于
  passiveSkillDefinition.ts:341：unsupported operator passive event "OnAbilityEntityFinished"。
  未写出候选/正式定义；试验配置撤销，不提交一个不能生成的清单。
  公共映射abilityEventProjection.ts已有OnAbilityEntityFinished→abilityEntityFinished，
  combatRuntimeAssembly也发布事件；规格spawn-ability-entity.md确认来源角色为Source、
  被释放实体为Target、在ClearSource之前通知。因此应补干员被动对既有AbilityEvent链的
  消费入口，不能重复定义事件或伪装为现有三个语义事件之一。
- 卡缪default_ring根只有MeshGroup2隐藏/MeshGroup3显示；无Buff图标、标签、属性、伤害、
  治疗、失衡、全局修正、护盾或其他事件/时间轴。当前木桩与二维UI不需要角色模型显隐。
  Buff SHA256=24866feb04de5ce691f5e70b9023181cd94c2263183fd498b6d5f19d1698aa97。
- 洛茜passive_usp_detect按主控与能量阈值维护cape_stack_effect。该终端Buff同样没有上述
  战斗载荷，也没有动作，SHA256=a10c0bdb2fdd7e413d80082c0358eb364d753e29747828eef9c88bc8a2f30c6d。
  暂列表现候选；还未审计其他资产是否读取其存在/层数，不声称已证明无模拟影响。

本轮没有生产修复、没有新增或重跑测试；取得了真实生成阻塞与具体公共入口差异。优先处理
卡缪有可观察清理副作用的事件接入，再检查艾尔黛拉的状态生产者/窗口消费者；不要为模型
显隐先扩展OnSquadUspChange或其他无当前收益机制。

## 2026-09-09：修复别礼基础被动入口并验证正式原轴

沿上一节证据，把chr_0026_lastrite_passive登记到basePassiveSkillIds，经现有
generateOperatorActiveSkillRuntimeBatch完整干员路径生成，新增30行正式定义：基础被动
安装及DuringBuffEnable对应的许可限制。未手写Buff表现/模拟定义，未改运行时或旧版。
同源二次生成--check通过。原生基础被动不依赖天赋等级，生产回归使用P0、空天赋。

realAxisInterruptionRegression.test.ts新增无装备双人场景：主控赛希3帧战技、非主控别礼
16帧战技、100帧终结技。断言被动实际安装；两人的通用6.5回能对别礼applied=false且
actualValue=0；别礼专属16回能仍获准；不足能量的终结技仍实际扣16到0；输入不变、执行
诊断为空。该文件16项通过，不是全量测试或视觉验收。

正式原始公开轴（没有添加主控切换）重算为tmp/public-last-rite-passive-fixed-original.json：

| 指标                             | 修复前                 | 修复后 |
| -------------------------------- | ---------------------- | ------ |
| 总伤害 / 伤害回执                | 821184.9467385851 / 79 | 不变   |
| availability / combo / execution | 14 / 8 / 0             | 不变   |
| 别礼实际正回能合计               | 161.1500005722046      | 128    |
| 别礼回能拒绝记录数               | 2                      | 8      |

16帧专属回能后22.5→16，40帧队友回能后29→16；331/415帧的通用4.55同样被拒绝。
没有为了数值对齐改变随机结果或原轴输入。技能按用户输入强制释放，因此资源变化修正可以
不改变总伤害；资源曲线的视觉效果本轮尚未人工检查。

横向扫描30份已存在的runtime-template（缺模板者不计，不能宣称31名全覆盖），还有四个
enabledPassiveSkills未进入配置基础被动清单：艾尔黛拉连携光环、洛茜usp_detect、卡缪
combo_2_type和default_ring。其中卡缪listen_normal_skill还含1项passiveEventAction。
这只是入口差集，尚须检查是否被其他转换入口安装及各自有效行为，再决定修复，不能直接
批量添加后以无异常作为完整性证明。
应用vue-tsc通过。私有三轴重算保持693530.8131581588/210、337938.8820469209/194、
1996820.2804914764/265，执行诊断全0；报告tmp/private-three-passive-fixed.json。

## 2026-09-09：原始公开轴资源首差与别礼基础被动遗漏

正式基线仍为6a8db78895147370855b45ed原始输入，使用秘仪修订后的转换；不添加主控切换。
只读旧4dadc55f重新运行，TOTAL=2777215、WARNINGS=[]，临时完整资源日志
`tmp/public-resource-old.log`。新版为`tmp/public-last-rite-arcana-corrected-original.json`。
所有下列旧时间减去5秒准备期后比较。

1. 赛希首战技：旧0.0833333333秒扣100，之前200.6666666667；新版3帧0.1秒扣100，
   之前200.8。`sourcePreparation.ts`先减准备期再Math.round(seconds*PROJECT_FPS)，
   差额8×(0.1−0.0833333333)=0.1333333333。属于当前60→30帧输入量化，不是扣费倍率错误。
2. 别礼首战技：两边0.5333333333秒开始。旧`last-rite.ts`战技hit offset=0.2、spReturn=30，
   0.733333返还；旧ActionEndHandler在结束前0.01秒安排通用队伍回能，0.773333发生。
   新版非主控在本地0帧jumpTimeline到300，执行self Buff和通用/专属回能；16帧同帧返还30。
   当前生成分支与原生normal_skill对应，不能把旧固定offset作为延期修复依据；完整跳转调度
   的原生逐帧一致性不在本项中重新证明。
3. **确认漏接但尚未修复：别礼自身收到不该获准的通用回能。** 新16帧baseValue=6.5、
   actualValue=6.5、applied=true，随后专属usp=16，变为22.5；旧同次只获专属16。
   旧定义acceptTeamUltEnergy=false、acceptSelfSpCostUltEnergy=false只是参考现象，
   修复依据不是把这两个旧字段搬回来，而是下述原生被动/恢复标签链。

来源为`tmp/game-data-sources-hybrid-20260905/`：

| 文件                                                  | SHA-256                                                          |
| ----------------------------------------------------- | ---------------------------------------------------------------- |
| CharacterData/chr_0026_lastrite.runtime-template.json | 02bd5e0883c58735b81ddc02d24c12f2578e892475723517d8cc3cbabd597c72 |
| SkillData/chr_0026_lastrite_passive.json              | ad551f258f40254ec33c6eac83f8d0209c18a6d2e72d138418367dc830a672ad |
| BuffData/buff_chr_0026_lastrite_passive.json          | c9cbdda5fac9bd96d5ba05455f5c8f8552bdb0ad9ab47bca7dd9468619ae0703 |

runtime-template的allPassiveSkillId和enabledPassiveSkills均含chr_0026_lastrite_passive。
其passiveSkillType=AddBuff、buffs引用对应passive Buff；Buff包含RefrainObtainUsp，
许可标签264623624（Skill/Character/chr_0026_lastrite），clearUspOnEnd=false。
combat-spec/docs/ultimate-sp-recovery-restriction.md已证明许可句柄与Modifier首标签检查：
无标签的通用ObtainUspInNormalSkill被拒绝，专属带标签的ObtainCostAction可以恢复。

当前config/operators.json别礼没有basePassiveSkillIds；planOperatorDefinition.ts只从登记
列表构造基础被动请求。生成别礼仅含天赋初始化，无passive Buff/限制动作；公共转换器已有
RefrainObtainUsp→restrictUltimateEnergyRecovery，运行时也已有许可检查。
下一步应接入被遗漏的原生基础被动，检查此类入口的完整性，并用正式定义验证通用回能被拒绝、
专属回能保留、扣能不受限，再重算正式轴。不要手写别礼专用数值或全队回能豁免。

本轮资源运行时combatResources.test.ts共19项通过，无生产改动；未做全量、类型或视觉验证。
其他队员9.3925→9.397142等回能效率数值差额及整轴资源走势尚未归因，不宣称资源审计完成。

## 2026-09-09：两次赛希爆发的腐蚀减抗差异来自周期时钟

旧4dadc55f EnemyEffectHandler.ts：腐蚀初次记录tickIndex=0，首次增长通过
getShiftedTime(time,1)调度；handleCorrosionTick再用getShiftedTime(event.time,1)
自链下一次。故不仅持续时间，连每秒减抗增长也被旧统一时停顺延。
原始buff_common_natural_natural_corrupt_do.json则useTimeDilationDt=false、
triggerInterval=1、waitFirstTriggerInterval=true。SHA256：
DABC04F72C7567EFC60D92EA4E5F72D6A06EC81FD822D9EBDF0B7FBB9791719F。
spec/buff-lifecycle.md周期顺序及time-dilation.md默认时钟解释当前配置，不修改其周期。

旧第一段初值5.5012069473%，在战斗7.017秒施加；增长时刻8.017/9.017/10.517/
11.517秒。因此11.333秒爆发只到tick3，减抗9.3520518104%。新版204帧=6.8秒施加，
340帧=11.3333秒取到10.6356668472%，对应初值+4次增长。
旧第二段33.216秒施加，增长34.216/35.216/36.216/37.716/44.766秒；38.75秒爆发
只到tick4，减抗10.6356667648%。新版990帧=33秒施加，1163帧=38.7667秒取到
11.9192819595%，对应初值+5次增长。每次增长1.2836149544个百分点，两差额恰为一次。

新版计数由源周期配置、施加时刻和伤害回执减抗共同验证；当前回执没有逐次
BuffTriggered记录，不能伪称已逐项读到该事件。也不据此证明Unity每帧调度细节完全相同。
这两笔不在新版整数秒临界点上，旧明确的顺延tick日志足以解释此处差额；无需改变
伤害采样顺序或把新版周期强行延迟。临时摘录tmp/inspect-corrosion-ticks.mjs。
本轮仅证据文档，没有改代码或新跑测试/视觉验收。六笔爆发的主要乘区差异已分别有
来源与寿命/顺序解释；旧等级附加项的完整处理器边界仍保留，整轴其他输出尚未全部验证。

## 2026-09-09：低温症0.16在980帧已自然到期

原公开轴主控诊断的buff_chr_0026_lastrite_talent_1_vul首段517帧施加、967帧
因lifetime结束；次段1372→1822，同为450帧。旧ENEMY的
last-rite-talent0-trigger0-effect0为16%寒冷易伤，首段22.217→39.6秒，
次段50.717→68.584秒（含5秒准备期）；实际持续17.383/17.867秒。
980帧=32.6667秒晚于新版967，但早于旧到期战斗34.6秒。因此旧有0.16、新无。

旧4dadc55f last-rite.ts天赋按附着消费层数每层4%施加15秒易伤，沿用统一顺延。
当前原始Buff useTimeDilationDt=false、onlyUseSelfTimeDilation=false，SHA256：
3542F01EDF69C0A78D1CCB561353271D5E8B3D3BA8C9D0B1B6C1C0ED4A055CB4。
默认时钟机制证据沿用time-dilation.md与赫拉芬格项，不重复研究已证明规则。
本项为旧版统一顺延与新版对象时钟的差异，不延长新版寿命以补齐伤害。

新增realAxisInterruptionRegression.test.ts：真实赛希1/150/300/450帧连携附着，
别礼600帧连携消费并触发天赋，对照850帧有/无汤汤终结技，模拟1500帧。
不绕过事件手加天赋Buff；起止帧相同、450帧、850位于寿命内部，输入JSON不变，
0执行错误。窗口/资源不合法仍按即时输入执行，不能把此构造冒充游戏合法实战轴。
早期仅战技及电附着构造未触发目标Buff导致新测试失败，改用真正能触发的寒冷链后
文件15项通过，无跳过/预期失败；没有修改生产触发规则或削弱存在断言。
未跑全量/类型检查/视觉。临时摘录tmp/inspect-low-temperature.mjs。

## 2026-09-09：六笔寒冷爆发批量乘区对账

输入为秘仪修正后的别礼主控诊断，不是正式原轴。只读诊断通过现有damageScale写入
记录拆分乘区，不修改原公式。tmp/public-arcana-burst-factor-audit.json及
tmp/compare-burst-factors.mjs保留提取结果。六笔顺序及来源已匹配。

| 来源/新帧 | 旧伤害→新伤害    | 旧→新脆弱乘数 | 旧→新受伤增加乘数 | 其他差异与状态                                                           |
| --------- | ---------------- | ------------- | ----------------- | ------------------------------------------------------------------------ |
| 诀180     | 7024→5254.7174   | 1.12→1.12     | 1.096→1.192       | 肃阵前置增益已验证                                                       |
| 赛希340   | 13360→10592.7069 | 1.12→1.12     | 1.292→1.472       | 爆破单元前置0.18；抗性乘数1.093520518→1.106356668仍待时序核对            |
| 别礼468   | 50408→22768.8444 | 1.28→1        | 1.632→1.372       | 缺艾尔黛拉0.28、星梦0.16及赛希0.10；对应消费链未发生/寿命见先前记录      |
| 诀916     | 12070→6005.3913  | 1.56→1.28     | 1.352→1.192       | 缺艾尔黛拉0.28及星梦0.16                                                 |
| 诀980     | 13060→5855.2566  | 1.688→1.248   | 1.352→1.192       | 额外缺低温症0.16，其到期/刷新仍待逐项核查                                |
| 赛希1163  | 19098→10792.1454 | 1.408→1.128   | 1.452→1.472       | 受伤增加净变化=-星梦0.16+爆破0.18；抗性乘数1.106356668→1.119192820待核对 |

全部还包含旧版1.45408163265等级项与新版无该附加项的差异，证据边界沿用前文。
攻击、暴击期望、防御系数已一致；别礼普通增伤乘数2.93716667与增幅1.2也一致。
赛希旧1.6×术强1.78等价于新回执倍率2.848，不是新倍率偏高。新旧整数取整与浮点
保留策略不同，上表不要求最后小数或旧逐步取整完全一致。数值分解不等于所有状态
原因已验证，尤其两次腐蚀取值差及低温症0.16仍未关闭。

爆破单元wpn_funnel_0008生成监听也是beforeOutputSpellBurst，旧detonation-unit.ts
监听onStatusApplied Burst，受此前已证明的旧后置派发影响。原始Buff SHA256：
FB2FF9CB9998E223B475AC44B37FCF0D9CB9BDC1CD19C9765B62B3B21F157FB3。
扩展同次爆发回归为肃阵词条4/9、爆破词条6/9，覆盖公开轴9.6%/18%和满级
16.8%/25.2%。全部Buff先于同帧伤害，静态对照无该Buff且乘区1、攻击不变。
武器文件184项通过，无跳过/预期失败；未跑全量/类型检查/视觉。本轮无生产修改。

## 2026-09-09：武器禁用对照的问题是遗漏enterFight，不是生产缓存

四二式肃阵生成skill3另含abilityEvent=enterFight，key=skill3:event:1:sequence:0，
按智识/意志重新安装wisd/will Buff。删除initializationSequence没有移除这一入口，
所以前轮对照继续触发爆发增益。compileEquipment.ts同时编译两种入口，
equipmentEventRuntime.ts独立注册事件；当前没有证据支持getWeapon被绕过或缓存错用。
前轮回执attackPercent=0.448是静态词条，不应因关闭动态行为而消失，纠正先前疑点。

新增src/application/testSupport/staticEquipmentContribution.ts统一构造静态贡献：
移除初始化序列/初始化黑板/eventHandlers/Buff定义，保留身份、等级与modifiers。
generatedWeaponsSimulation、generatedWeaponReactionLifecycle及
allRegisteredEquipmentSimulation的相应对照使用同一helper，不修改生产协议/运行时。
四二式肃阵回归补真正静态对照：无任何该武器Buff、首爆乘区1、attack与启用组一致；
启用组首爆乘区1.168且Buff回执先于伤害。原生前置事件结论因此得到有效对照支持。
三个文件1338项全部通过，无跳过/预期失败。不是全量套件或视觉验收；不影响正式轴
报告数值。下一步继续剩余伤害/状态差异，不把测试辅助问题扩展为未经证明的生产修复。
应用vue-tsc通过。同文件其余7处只删除eventHandlers的禁用对照也统一使用helper，
不再分别假设某把武器只有初始化或只有事件入口；随后重新运行相关三文件。

## 2026-09-09：四二式肃阵爆发前监听与旧版后置派发不同

原始buff_common_cryst_cryst_triggered.json中同一序列先TriggerSpellBurstEventAction
（约472行），后ReadSkillSettingData（486），再DamageAction（529）。SHA256
D6D67B81F33151592BE2EFEB01DC04CA9B638ABCAD04C710869668020881E005。
原始buff_wpn_funnel_0016_will.json SHA256
C6D71D57D843F4C1BC708999FD7F622438CE54339468B4294F3BEDBC1CC84CF9。
生成武器will监听beforeOutputSpellBurst，originSkillTypeIn允许战技/连携/终结技，
随后给eventTarget施加will_atk。该Buff对四种法术伤害增加defender normal乘区。

combat-spec/docs/buff-data-adapter.md与origin-skill-event-context.md确认原生
TriggerSpellBurstEventAction RVA0x06D3D960先发布源侧127、目标侧128，携带原技能信息。
因此本例前置监听带来的9.6%在该次伤害前已生效，不应为了旧数值推迟。旧4dadc55f
EnemyEffectHandler.ts的ARTS_BURST分支先emitReactionDamageHit，后registry.onStatusApplied，
旧type-42-solemn-phalanx.ts监听该状态事件，首爆只享受此前易伤分支的一项9.6%。

新增generatedWeaponsSimulation.test.ts回归使用受控高意志属性选择武器分支，
赛希连携、武器/反应全部生产定义；不是公开轴原构筑。满级词条增益16.8%，BuffApplied
与首爆同帧且排在DamageApplied之前，首爆damageScaleMultiplier=1.168，0执行异常。
文件181项通过，无跳过或预期失败；未跑全量/类型检查/视觉。本轮不改生产代码。

测试过程中发现独立问题：同ID武器经helper的getWeapon替换后，删去或清空初始化的
对照仍产生0.448攻击与1.168爆发乘区，导致新比例断言失败。不能把这种对照当作
武器已禁用；最终回归直接核对原生数值/事件顺序，不依赖它。下一轮优先追词条
解析来源及既有对照有效性，181绿不证明这些对照本身都可靠。

## 2026-09-09：第一笔寒冷爆发的两项公式差异（顺序待核实）

当前修正秘仪的主控诊断，180帧诀Cryst爆发5254.717427415849；旧6.1秒为7024。
两边攻击4800、倍率1.6、暴击期望1.025、防御0.5、抗性1、脆弱1.12一致。
旧_damageBreakdown记录levelCoefficient=1.4540816326530612、dmgTakenMult=1.096。
旧4dadc55f src/data/stats/computeReactionDamage.ts约153行对法术反应/爆发使用
1+(level-1)/196，computeDamage.ts约753行将此项乘入；此轴等级90、术强0。
新回执baseDamage=7680、damageScaleMultiplier=1.335039996802807，即约1.12×1.192。

诊断算式（不修改运行时）：
4800×1.6×1.12×1.192×0.5×1.025=5254.71744。
仅移除等级项、仍保留旧1.096则为4831.51872，故不能把全部差额只归等级系数。
旧整数伤害还包含逐步取整，不能用7024直接相除要求完全相等。

当前SkillSetting发布版本1.5.3@9913107-5，法术爆发伤害倍率四列均1.6，Damage公式
为1+0.01×增强属性。combat-spec/docs/read-skill-setting-data.md的RVA0x06D1F5F8
流程读取列和PhysicalAndSpellInflictionEnhance，不读取角色等级；普通玩家伤害公式
见damage-formula.md。旧额外等级项没有在这两个阶段找到对应项，但不能据此声称
所有伤害特殊路径都已证明不存在等级影响；仍以完整爆发数据/处理器证据为最终边界。

首爆附近武器buff_wpn_funnel_0016_will_dmg在146帧施加，will_atk和will_icon在
180帧施加，来源均诀的四二式·肃阵skill3。需进一步核对原生爆发前置事件与伤害顺序，
判断第二项9.6%应该作用于本次还是后续命中。当前仅完成数值分解，不改顺序或扣增益。
临时摘录tmp/inspect-first-burst.mjs。现有spellBurstRuntime.test.ts及skillSettings.test.ts
12项通过，无跳过/预期失败；未新增测试、未跑全量/类型检查、未做视觉验收。

## 2026-09-09：秘仪修订后的命中差额及跨轨时间膨胀

使用tmp/public-last-rite-controlled-affix-fixed.json和
tmp/public-last-rite-arcana-corrected-controlled.json按castId+stepKey/spellBurstType
对齐：基础终结技1307命中替换为秘仪1334（一换一）；原1337寒冷爆发删除；
艾尔黛拉同一终结技伤害步骤12笔变11笔。其他步骤命中数量没有变化。
新艾尔黛拉命中1330/1342/1354/1366/1462/1473/1485/1497/1509/1521/1533；
旧修订前1328/1340/1352/1364/1374/1465/1477/1489/1501/1513/1525/1537。
这是同样放置时间下换用正确技能后的全局时序连锁结果，不是只删了一笔反应。

原始SkillData/chr_0032_lizhiyan_ultimate_skill2.json SHA256
418AA1E4F80F036B872CD0A48CB5D8E7357C74E4B0F255163504E093B65BE039。
直接伤害位于本地58帧，全屏UltimateTimeDilation为0–50帧。旧4dadc55f
arcane.ts秘仪360%分支仍使用offset=1.583，不能复制该值代替原生动作时间。

当前主控诊断：秘仪1260开始；别礼窗口1284到期；1309强制连携仍开始并告警，
产生0.6秒ComboSkill全局膨胀；秘仪全屏实例1310停止，连携实例1329自然结束，
秘仪1334命中。58帧动作并不意味着必定在绝对1318命中，因为施法者结束自身全屏
之后仍受队友全局时间膨胀影响。旧命中约1307与新1334的差距有动作表和跨轨时钟
两部分，不能统称固定步长误差。当前观察不能证明Unity精确同帧调度已完全复刻。

新增realAxisInterruptionRegression.test.ts生产数据对照：秘仪1帧开始，无队友
连携59帧命中；50帧加入别礼连携时，连携仍在50开始、保留窗口告警，秘仪命中延后。
双方输入JSON不变、0执行异常，文件14项全通过，无跳过/预期失败；未跑全量、类型
检查或视觉验收。本轮没有修改生产逻辑。临时摘录tmp/inspect-arcana-timing.mjs。

## 2026-09-09：公开轴秘仪映射修正后的独立基线

原始轨道0两次终结技：动作2 inst_olciqzb/startTime2105（旧60fps，含准备期），
旧命中180%；动作3 inst_e889ock/startTime2819，旧命中360%。只后者映射arcana。
因为方案ID=default_sc不是分享唯一ID，不能在共享actions配置直接覆盖default_sc/0/3。
新增guardedActions将坐标、旧operator=arcane、instanceId、完整旧技能身份共同匹配；
冲突显式失败，不匹配仍走普通身份映射。实例ID没有被单独用作全局身份。
新增回归确认目标实例只改第3动作、另一分享实例不变、输入不变。转换工具24项通过。

重新从原始JSON转换到新目录tmp/public-last-rite-arcana-corrected，0转换问题。
与tmp/public-last-rite-final/project.json递归比较只有一处变化：
/scenarios/0/tracks/0/skillCasts/3/source/skillKey，ultimate→arcana。
原输入的所有放置时间、构筑、控制标记、结束线原样保留；前述历史报告不覆盖。

| 输入           | 修订前伤害/笔数         | 修订后伤害/笔数         | 修订后可用性/窗口/执行 |
| -------------- | ----------------------- | ----------------------- | ---------------------- |
| 正式原输入     | 825921.87309623 / 80    | 821184.9467385851 / 79  | 14 / 8 / 0             |
| 仅别礼主控诊断 | 1870839.2218356298 / 97 | 1854979.1966419145 / 95 | 32 / 1 / 0             |

主控诊断寒冷爆发只有180/340/468/916/980/1163六笔，原额外1337不再出现。
秘仪新1334帧360%：正式11907.565056000003、主控13705.687296000002。
主控1309帧别礼连携windowMissing新增，不能隐藏；总计减少两笔不能全归到少一次爆发。
旧秘仪43.566秒约1307帧，与新1334有时序差异，仍需依据原生技能2调查，不搬旧偏移。
正式原输入仍只有一次Fire爆发（980帧），与主控寒冷路径不同，不能混为同一轴结果。
报告tmp/public-last-rite-arcana-corrected-original.json与-controlled.json；
比对脚本tmp/verify-arcana-correction.mjs。本轮只修导入映射，没有改游戏运行时。
工具独立tsc通过，未跑全量套件或视觉验收。

## 2026-09-09：额外寒冷爆发追到诀基础终结技/秘仪的转换语义缺口（待修）

旧HITS的_reactionMeta给出六次artsBurst/cryo：6.1、11.333、15.583、30.633、
32.666、38.75秒；来源依次诀、赛希、别礼、诀、诀、赛希。新版主控诊断对应
DamageApplied.spellBurstType=Cryst的帧180/340/468/916/980/1163，另有1337。
新回执保留skillType/castId，旧反应无skillType，因此不能用skillType缺省统计新版反应。
赛希新倍率284.8包含术强78的1.78倍；旧显示倍率160、另存artsIntensityMult=1.78，
这两字段不可直接比较。其他伤害乘区仍需独立核查，本轮未宣称六笔伤害已全部归因。

额外第七笔：1260帧诀cast legacy:default_sc:track:0:cast:3开始ultimate；1307帧
ElementalInflictionApplied显示previousElement=cryo、previousLayers=4、outcomeKind=burst；
1337帧爆发9390.101474103883（主控诊断）。旧相应43.566秒命中360%，effects仅消费
arcane-gloompurge-arcana-ready和arcane-gloompurger-array，没有附着。

只读旧4dadc55f src/data/operators/arcane.ts约959–1030行：基础终结技180%分支
按敌方现有元素施加附着，秘仪360%分支仅消费状态。当前生成arcaneUltimate与
arcaneArcana分别来自chr_0032_lizhiyan_ultimate_skill和ultimate_skill2，公开导入轴
却仍选择基础ultimate。这是转换技能身份缺口，不是应删去的反应运行时事件。

tools/legacy-timeline/convert.test.ts已有私人轴sc_zpm5ozw第47动作显式arcana映射测试，
但公开轴不在该动作覆盖内。下一轮核对公开轴全部旧实际执行分支后补显式映射；
禁止在新版模拟内部自动替换，禁止覆盖修订前报告冒称输入一直相同。当前已有整轴
总账均是该映射修订前版本，需要保留并在新报告中解释差异。此项仅定位，尚未修复。
临时摘录tmp/inspect-reaction-hits.mjs；本轮未跑测试或视觉验收，无生产代码修改。

## 2026-09-09：艾尔黛拉终结技6对12来自旧版固定命中表与木桩弹体限频

同一公开轴6a8db78895147370855b45ed：旧版伤害命中44.166/44.966/45.766/
49.433/50.233/51.033秒，共6笔，每笔165%。新版原轴和别礼主控诊断的命中帧均为
1328/1340/1352/1364/1374/1465/1477/1489/1501/1513/1525/1537，共12笔，
均来自同一个ultimate cast、每笔165%；两组输入的增益不同，不能混用伤害总数。

旧版4dadc55f的src/data/operators/ardelia.ts手写duration=4、hitCount=5，三潜
patchTick改为6；src/data/collect.ts的expandTickGroup按duration/(hitCount-1)
等分，即三潜每0.8秒一击，再经旧统一时停映射得到上述实际时刻。不是原生弹体计数。

当前SkillData/chr_0025_ardelia_ultimate_skill.json的timelineActions[7]和[8]
都是81至201本地帧、triggerInterval=0.1的独立Channeling动作。SHA256：
E765CBEEF51C484D4A921714963C71C0F4DBE152C63719A0522D19D93C3F1B8B。
弹体回调检查敌方ArdeliaUltMark不存在才伤害，随后建立interval=0.3的同名标记，
autoFinishByAction=false。回调来源及SHA见下面独立回调修复记录。
combat-spec/docs/timed-marker-lifecycle.md证明标记属于目标AbilitySystem，
HasMarker读取该目标有效项；不是各弹体私有标记，动作结束也不清除false配置的标记。

因此新版12笔不是两条发射流各自重复造成同帧伤害。新版本将随机空间点/范围命中按
既定木桩模型简化，弹体能命中唯一敌人，伤害次数由标记到期及发射节奏限制。不能将
当前12笔宣称为真实游戏任意敌人体型/位置下的固定命中次数，也不能为了旧版6笔裁掉
另一条原生发射流。精确逐帧限频和空间命中仍有模型边界，本轮不改生产模拟。

ardeliaUltimateCallbacks.test.ts扩为零潜/三潜：固定概率样本仍使治疗分支失败，
确定伤害继续；命中数分别大于旧手写5/6，全部165%，无同帧重复、相邻至少9帧，
可观察到not(markerPresent)失败；输入JSON不变、0执行错误。首次新增断言误读了
回执层级（记录根not而非内部markerPresent）导致2失败，修正观察方式后两个文件
15项全部通过，无跳过/预期失败。没有重跑全量/类型检查或视觉验收。
临时提取脚本tmp/inspect-ardelia-hits.mjs；下一步继续各技能反应伤害与增益来源归因。

## 2026-09-09：别礼第四轮普攻A2第二击被后续即时输入截断

对象仍是6a8db78895147370855b45ed；此项分析使用明确标注的别礼主控对照
tmp/public-last-rite-controlled-affix-fixed.json，不把它当原始输入结果。
旧版参考4dadc55f，tmp/public-6a8db78895147370855b45ed-old.log。
旧HITS先排除无有限_expectedDamage的效果标记，并将finalStrike并入basicAttack，
得到别礼普通攻击41笔对新版40笔。不能直接用原始HITS数组长度统计伤害次数。

第四轮旧A1/A2/A3伤害时刻（去掉5秒准备期）：17.767、18.397/18.867、19.367/19.967。
新版A1输入521、命中540；A2输入542、命中556；A3输入572并中断A2，之后581/605命中。
前置连携输入454，518帧命中的实体停帧至529；A1命中产生的实体停帧延续至548，
跨过A2输入542。A2第二个本地24帧动作未在A3输入前执行。

旧src/data/operators/last-rite.ts给A2 duration=1、命中offset=0.33/0.8。
当前原始SkillData/chr_0026_lastrite_attack2.json包含本地10/24帧动作，伤害后的
实体HitStop持续0.067秒；生成定义保持这些时刻及finishByAction=false。
原始文件SHA256：884F080E87B24FF125F20B1D0524154B90889D5C97E0BFC81003F93685DE3F14。
combat-spec/docs/time-dilation.md原生执行流程证明false时动作结束不停止实例；
不能因为换技能就清掉残留停帧来获得旧版命中数。

realAxisInterruptionRegression.test.ts新增生产数据最小对照：整体减453帧，
combo1/A1 68/A2 89/A3 119。无前置连携A2两击；有连携一击；仅诊断延后A3到130
恢复两击，第二击>=119。每次模拟前后输入JSON相同、0执行错误，A2在119帧被中断且
A3在119帧开始。文件13项全通过，无跳过或预期失败；未跑全量/类型检查/视觉验收。

结论：已解释缺击的当前运行时因果链，暂不修改生产逻辑；不是未转换第二击。
原生精确Tick组调度与30fps边界仍有证据边界，本回归不证明Unity同帧先后顺序完全一致。
整轴其余伤害与命中差异仍待核查。临时摘录脚本compare-public-hit-groups.mjs、
align-public-basic-hits.mjs均在tmp，不提交原始轴或报告。

## 2026-09-09：赫拉芬格15秒增益不复制旧版26.8秒顺延

只读旧版4dadc55f：src/data/weapons/greatsword/6/khravengger.ts将战技寒冷附着分支
定义为15秒冰伤，当前构筑值16%；没有ignoreTimeShift。src/simulation/events/
effectDispatch.ts的状态派发（OPERATOR_EFFECT_APPLY）因此用getShiftedTime求到期；
engine/SimulationEngine.ts转调timeline.timeContext.getShiftedEndTime。

旧OPERATORS记录战技分支刷新/到期：9.1166667→26、19.583→37.466、30.967→57.767。
均含5秒准备期，末段实际持续26.8秒。第三次刷新对应新780帧，约有一帧命中边界差。
旧终结技首击53.687（战斗48.687）在旧增益内；新版增益1229帧（40.9667秒）已结束，
1461帧（48.7秒）首击不再带0.16。来源修正增加前段伤害，不应再强行延长寿命提高首击。

原始buff_wpn_claym_0013_normal_skill.json SHA256
B28397A431AA97D7C2078A3BC36258794703B202E4C77F7B645F9409AF8DBBDF，
useTimeDilationDt=false且onlyUseSelfTimeDilation=false。现有spec/time-dilation.md
Buff时钟选择及2026-09-08的TimeManager原因修正，依据Buff.OnTick/PreLateTick分支
证明TimeDilation原因下此默认时钟不乘全局缩放；不是根据武器名称猜测。

新增realAxisInterruptionRegression.test.ts真实别礼战技幻影触发武器增益，对照有/无
汤汤全屏终结技，增益起止帧相同、持续449–450帧、输入不变、0执行错误；12项通过。
结论：本项归为旧版时间模型与原生机制的合理差异，不修改新版。未证明所有剩余整轴
差异均合理；仍需继续审计。临时摘录脚本tmp/inspect-khravengger-clock.mjs，不提交原轴。

## 2026-09-09：来源修正与SkillAffix直接动作联通后的真实轴验证

本轮恢复CreateBuff动作环境继承，移除三项已知缺陷测试的fails；新增skillAffix动作
绑定宿主processing编号，不把普通来源写成affix。执行位置保留在DuringBuffEnable
序列末尾，前序失败不绑定，无正在处理技能返回false，生命周期结束解除监听而不清
编号。只实现spec已经验证的直接skillEnd寿命，后代引用延寿仍不完整。
事件条件继续独立读取事件来源；没有给别礼/武器做ID特判。

同一hybrid-20260905来源重生成31干员/66公共Buff及全武器套装；只有da-pan/yvonne、
funnel_0006/0011、suit_atk02/attri01和公共Buff的SkillAffix声明变化。武器目录首次发布
遇Windows重命名锁，生成到tmp候选后核对仅4个装备文件不同再同步；没有从旧定义反推。

| 输入               | 伤害 / 笔数              | 可用性 / 窗口 / 执行诊断 | 结论                                   |
| ------------------ | ------------------------ | ------------------------ | -------------------------------------- |
| 原始别赛羊诀公开轴 | 825921.87309623 / 80     | 14 / 8 / 0               | 未变，未篡改主控输入                   |
| 仅切别礼主控诊断   | 1870839.2218356298 / 97  | 32 / 0 / 0               | 原1825092.0127387715，恢复缺失武器增益 |
| 用户轴一           | 693530.8131581588 / 210  | 3 / 1 / 0                | 未变                                   |
| 用户轴二           | 337938.8820469209 / 194  | 1 / 0 / 0                | 未变                                   |
| 用户轴三完整时长   | 1996820.2804914764 / 265 | 27 / 5 / 0               | 未变                                   |

报告tmp/public-last-rite-affix-fixed.json、public-last-rite-controlled-affix-fixed.json、
private-three-affix-fixed.json。原始输入仍是正式基线，诊断伤害不能替代原始伤害；旧版
2777215剩余差额仍需继续归因。下一步先移除已不再用于正式数据的旧构造affix身份入口，
再继续查未解释的差额，不在已证明合理的Buff时钟差异上重复调整。

验证：武器180项、装备与套装1163项通过。全量首次7143通过/3失败/2原有跳过，三项
均为已核对的生成结构与内容指纹断言，随后在上述1163项重跑中全部通过；首次报告
tmp/skill-affix-final-suite.json保留，不篡改为全绿。重型类型图11项从该套件排除。
之后单进程补跑该11项全部通过，应用vue-tsc和完整转换器tsc也通过。

逐笔复核纠正归因边界：战技增益125/439/780帧刷新，1229帧以lifetime原因结束；
1461/1480/1509帧终结技伤害仍118699.75911084884/118699.75911084884/237399.51822169768。
本次恢复的是前段伤害，不是终结技首击。首击与旧版缺0.16还要核对Buff寿命；原始
buff_wpn_claym_0013_normal_skill.json useTimeDilationDt=false，SHA256
B28397A431AA97D7C2078A3BC36258794703B202E4C77F7B645F9409AF8DBBDF。尚未比对旧版
此增益的完整时钟/刷新轨迹，不提前宣布为合理差异，也不为了首击数值强行延长Buff。

## 2026-09-09：为来源修复补上原生processing技能编号入口

SkillAffix所需编号现由AbilitySystemRuntime.currentProcessingSkillCastId提供：临时
处理技能优先，否则为仍在执行的当前技能。本次候选的预分配编号独立暴露，不读普通
来源或事件。正常beforeCast使用临时作用域；SkillRuntime的SwitchToBuff只有
asSkillCast=true才临时覆盖，范围包含before、费用、动作和skillEnd，false维持原当前
技能。作用域以finally恢复。依据现有spec身份文档及Runtime/Skill.cs旁路执行路径。

四项回归覆盖当前42/候选73的两类旁路，以及普通/旁路抛错后的身份恢复；相邻129项通过。
这是来源缺陷修复的前置接口，不是SkillAffix消费或赫拉芬格修复：Buff普通来源、affix
记录、结束匹配和生成定义尚未切换，正式轴伤害不应因此变化。下一步从动作层绑定该
编号，不能回到从事件或普通来源猜编号的方案。

## 2026-09-09：确认CreateBuff来源缺陷；先隔离被动Buff执行状态，来源修复尚未落地

上一节赫拉芬格分支已定位为新版公共运行时缺陷。原始
`BuffData/buff_chr_0026_lastrite_normal_skill.json` 创建幻影时
`inheritSourceSkillCastInfo=true`，SHA256
`1D307834484673E5F62F6B72DBAED7F0DBBEDE4D60317F9A02DE8059E5EF98A7`。
战技Buff由普攻末段的beforeOutputDamage唤起，但创建动作的环境仍是战技Buff。

现有 combat-spec/docs/create-buff-action-data.md 已依据 CreateBuffAction.ExecuteInternal
RVA 0x035F1D60 证明继承读取 actionEnvironment.FillSkillCastInfo；
buff-ability-event-actions.md 证明Buff事件动作仍使用该Buff环境；
origin-skill-event-context.md 又明确区分“条件读事件来源”和“创建Buff读自身环境”。
不需要新增机制猜测或改复刻库。

Endaxis BuffOperationExecutor 错误地优先选择 eventSkillCastInfo，甚至事件已知空来源时
会覆盖非空宿主来源。实验改为仅继承 context.skillCastInfo 后定向测试通过，但全量
7139项中7项失败、7130通过、2跳过：suit_atk02、wpn_funnel_0006/0011和阿克库里的
SkillAffix把普通来源误用作附着编号，真实无普通来源时构造抛错。故已撤回来源修改，
不能把下面的实验伤害当成正式结果。新增两项单元测试和一项别礼生产数据测试明确用
it.fails记录已知缺陷（不是修复通过），实现正确后必须去掉fails；未给干员加例外。

正确继承使装备被动所创建Buff保留原生无施法来源，进一步暴露装配层的问题：
#reactiveOperationBindings 原先直接复用整个有状态解释链，多个Buff实例的同一
finishByAction步骤会争用 WeakMap 状态。真实诀武器 wpn_funnel_0016 的多个 will_dmg
及子图标链因此抛出 action-duration applyBuff step is already active。现登记构造工厂，
每个Buff生命周期请求创建独立执行器外层，保持原有末端能力与来源上下文，不以事件施法ID
制造伪隔离。生产数据回归使用两次诀连携和原轴同类构筑，证明多个will_dmg实例能够共存。

仅在来源修复实验中，最小别礼回归证明：普攻末段触发的附着仍归战技cast，赫拉芬格normal_skill增益同帧施加，
原始用户输入未变化。全轴主控对照125/439/780帧附着现归对应battleSkill，0.16Buff恢复；
97笔伤害、1870839.2218356298，较此前1825092.0127387715增加45747.2090968583，
可用性32/窗口0/执行0。报告 tmp/public-last-rite-inheritance-fixed.json；这仍是仅切主控的
诊断对照，且来源修改已撤回，不能称作正式版本或原轴已达到该伤害。

### 下一步：解除SkillAffix与普通来源的混用，再落地来源修正

combat-spec/docs/skill-affix-identity-2026-09-04.md 已证明 SkillAffixAction
0x03C45E10 读取owner.curProcessingSkill；get_curProcessingSkill 0x0474AC30先取
临时processing值，再取currentSkill。Buff.affixSkillCastId与普通SkillCastInfo分别存储，
无正在处理的技能时动作返回false，不是伪造来源或构造抛错。
当前Endaxis定义affixSkillCastIdentity='sourceSkillCast'、Buff构造和自动skillEnd条件
仍依赖普通来源。必须同步改公共定义/转换/运行时消费，并覆盖beforeCast的临时技能、
当前技能回退、无技能、Buff普通来源不同、跨干员、结束匹配；不能从任意事件复制编号。
原生弹体/能力实体/输出Buff引用延长寿命仍有建模边界，不宣称完整SkillAffix已实现。

本轮正式保留的是执行器工厂隔离及回归：装备初始化的无来源Buff连续解析得到不同
执行链，诀真实装备的多个will_dmg正常创建。三份定向测试143项通过，其中3项是上述
已知缺陷的预期失败；不可把143项全部表述为功能已实现。

最终套件tmp/buff-instance-final-suite.json：7137通过（包含3项it.fails）、2项原有跳过、
0失败；排除architectureBoundaries.test.ts/candidateTypeCheck.test.ts的11项重型类型图
检查，本轮未重跑。正式逻辑没有保留导致7项回归失败的来源试改。

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

# 2026-09-09 补充：原生资源配置正式接入

已从既有TypeTree预览恢复atbRecoverInterval=0.5等四个根资源标量，新增公共纯数据契约及
严格校验，生成器必须导出resources。附着子集可独立查表，但产品与候选模拟必须提供资源段。
editorSimulationService不再注入1.5；候选干员、装备上轴审计同步读取候选资源，不借正式值。
原始预览哈希及其附着子集与正式版本一致性核对见current-context.md。

重算报告：`tmp/public-native-resource-settings.json`、`tmp/private-native-resource-settings.json`。
公开伤害821184.9467385851/79命中、诊断14/8/0不变；私有三条伤害/命中亦不变、执行均0。
sc_zpm5ozw的818/1602帧赛希战技resourceUnavailable告警消失（27→25），其他原因未改。
公开首段16帧战技后恢复从62帧提前至32帧，满技力2526→2376帧。输入未修改。
定向正式入口测试以3帧战技验证19帧恢复，覆盖页面/后台共同装配而非手工注入服务常量。
未做资源曲线视觉检查；当前完整重建候选审计未实跑，不能用入口改接声明全部候选通过。

# 2026-09-09 补充：公开原轴技力分类账与暂停来源边界

输入仍为`tmp/public-resource-old.log`和`tmp/public-resource-gate-fixed.json`，不修改
主控或技能时刻。按旧SP_CHANGE.actualChange、新SpChanged.actualValue分类：

| 项目                 |          旧 |   新 |
| -------------------- | ----------: | ---: |
| 六次战技实际扣费合计 |        -600 | -600 |
| 三次别礼战技返还合计 |          90 |   90 |
| 其他命中回技力合计   | 210（7×30） |    0 |

旧七笔分别在真实3.716667、9.15、14.183、21、25.567、32.483、36.517秒，均为别礼
重击。当前原轴别礼非主控，正式技能技力动作仍受主控守卫，不应与已修复的UltimateSp错误
守卫混淆：combat-spec ObtainCostAction.ObtainAtb确有此限制。整段差210并非战技多扣费。
返还时序仍有旧命中偏移与新版非主控跳转同帧执行的差别，见此前资源首差记录。

自然恢复尚不能直接宣称相符。旧ActionStartHandler.getSpFreezeDuration战技固定0.5秒，
终结技/连携使用freezeDuration（缺省1.5）；日志共19次SP_REGEN_PAUSE。新版
src/application/editorSimulationService.ts将spRecoveryPauseDuration固定为1.5，运行时
按扣费暂停。combat-spec docs/atb-gain.md已证明原生CostAtb使用SkillSetting.atbRecoverInterval，
但本次未找到当前导出配置的这个实际值，不能用页面装配常量证明当前游戏就是1.5。
后续需追该字段来源及统一SkillSetting导出范围，而不是为贴旧轴把暂停硬改0.5。

新版全部自然恢复实际合计约610，初始200−600+90+610=300；2526帧最后一笔恢复至300。
该恒等式只证明当前回执账本自洽，不证明暂停间隔/恢复时钟正确。旧日志不逐帧记录自然恢复，
尚未补齐同口径整条曲线，不从最后一笔旧SP_CHANGE反推旧最终技力。本轮无生产修改/新测试。

# 2026-09-09 补充：公开原轴终结技能量整账（请求与实际分开）

脚本`tmp/audit-ultimate-ledger.mjs`、报告`tmp/public-ultimate-ledger.json`，输入为原始
解码存档、旧完整资源日志和`tmp/public-resource-gate-fixed.json`。四人初始能量均0。
旧UltEnergyHandler的change是请求量，actual须按相邻gauge差计算；ActorState.modifyGauge
钳制到0..maxGauge，不能把旧日志中的-80/-90当作实际扣量。

| 干员     | 旧实际正回能合计 | 新实际正回能合计 | 旧实际扣除合计 | 新实际扣除合计 | 双方最终 |
| -------- | ---------------: | ---------------: | -------------: | -------------: | -------: |
| 诀       |              100 |              100 |            100 |            100 |        0 |
| 赛希     |               72 |               72 |             72 |             72 |        0 |
| 艾尔黛拉 |         76.80175 |             76.5 |       76.80175 |           76.5 |        0 |
| 别礼     |              240 |              128 |            240 |            128 |        0 |

- 旧存档赛希operatorStatus减费0.1、技能块gaugeCost80；旧请求-80但此前72，实际-72。
  新潜能修正80×0.9=72，请求/实际均-72。该轴没有少扣8点的问题。
- 艾尔黛拉旧减费0.15、技能块gaugeCost90。旧compileEndaxisScenario.ts的
  resolveDynamicMaxGauge使用Math.ceil(90×0.85)=77，因此此前76.80175未被截断。
  新版上限76.5，第二次连携已经裁剪，实际扣76.5。此处已定位旧向上取整与新版浮点值的
  差异；原生上限完整属性计算是否存在独立取整尚需对应证据，不仅凭新版实现宣称原生已证明。
- 诀第二终结技双方都请求100但实际0；新版1550帧还有结束清零请求999，实际也0。
  不得按事件数量或请求合计误报多扣能量。其生命周期清零时序仍与伤害/持续时间一起核查。
- 别礼正向实际128来自三个专属16与两次40；旧还有两次60并最终溢出8，上限裁剪后240。
  新版八笔applied=false记录中包含六笔通用来源被基础被动拒绝、两笔附着层数0的请求0。
  不能把全部八笔统称为回能许可拒绝。原始请求正值161.1500005722含被拒绝的33.15，
  不是实际获得161.15；附着输入差异见下节及主控旁路证据。

上述账本覆盖此原轴全部UltimateEnergyChanged/ULT_ENERGY_CHANGE记录，但不代表技力、
逐时刻资源曲线、全部技能合法性或视觉已完成。本轮无生产修改或新测试。

# 2026-09-09 补充：公开原轴连携资源漏项与零值区分

以`tmp/public-resource-gate-fixed.json`为修复后正式原轴：

- 艾尔黛拉原先没有两次连携回能，确认为公共ObtainCostAction投影缺陷。原始
  `chr_0025_ardelia_combo_skill_projhit.json`的UltimateSp载荷有atbOnlyMainChar=true，
  但combat-spec `Actions/ObtainCostAction.cs`仅在ObtainAtb中检查它；公共投影此前错误
  地对两种资源都加主控条件。4475e1bb修正并全31名重生成，只有艾尔黛拉、阿列什、萤石
  有内容差分。152/891帧现在请求14.45714282989502，第二笔受上限裁剪，终结技前76.5。
- 别礼517/1372帧则有回能动作，但baseValue=15、requestedValue=0，不能和上述漏项混淆。
  正式定义63本地帧先读CrystInflict层数并累计infliction_num_total，再按min(层数,4)回能。
  原轴全程只有5次ElementalInflictionApplied：150热1，310寒冷与热1反应清空；886热1，
  950热爆发后热2，1133寒冷与热2反应清空。两次连携结算均无寒冷层，因此15×0成立。
  旧额外回能两次60不能直接补入。此前“主控身份解释开场旁路”章节已证明旧全局重击
  触发器缺主控约束，而新版原生幻影链有该约束；此处仅补齐资源下游，不改变原始切控输入。

补充生产回归：非主控艾尔黛拉P0、无装备，仅10帧连携，150帧内唯一自身回能10，输入不变、
执行诊断0。realAxisInterruptionRegression.test.ts全部18项通过，无跳过/预期失败。
本节没有声称整个资源账本或所有状态展示已经验证完毕。

# 2026-09-09 补充：公开原轴回能效率快照差异

公开轴6a8db78895147370855b45ed，原始解码存档
`tmp/public-6a8db78895147370855b45ed-project.json`保存赛希/艾尔黛拉
`stats.ult_charge_eff=144.5`，诀为189.1。只读旧4dadc55f的
`src/stores/timeline/normalizers.ts:110`仅在没有传入stats时用gaugeEfficiency填充；
`src/simulation/events/UltEnergyHandler.ts:15`直接以快照效率计算回能。
原日志`tmp/public-resource-old.log`首笔赛希通用6.5回能为9.3925，等于6.5×1.445。

旧装备源码`src/data/gearpieces/no-set-bonuses/rift-trekker-gloves.ts`和
`redeemer-armor.ts`精锻3仍为27.857142857、16.714285714，并不是仅存一位小数。
新版正式生成定义对应`item_equip_t4_parts_wuling02_hand_01`和
`item_equip_t4_parts_wuling01_body_02`，精锻3修正分别
0.2785714285714286、0.16714285714285715。重构效率为1.4457142857142857，
6.5倍为9.397142857142857，float32乘法为9.39714241027832，精确对应
`tmp/public-camille-passive-final.json`第16帧赛希UltimateEnergyChanged。

结论：这笔小差额由旧存档面板快照和新版重新按装备构筑解释，不改回能运行时、不把新版
效率强行舍入到旧快照。旧存档144.5如何产生（当时数据/计算/编辑）尚无证据，不能进一步
宣称是旧版某个舍入函数的问题。诀的12.2915→12.294285774230957及完整资源走势仍需
独立核对，不由本条赛希算式自动判定。本轮只做源码/回执与算术核对，无生产修改或新测试。

# 2026-09-09 补充：洛茜披风链的直接引用边界

来源：`tmp/game-data-sources-hybrid-20260905`。逐值解析6239份JSON，扫描
`chr_0028_wulfa_passive_cape`、`buff_chr_0028_wulfa_passive_usp_detect`、
`buff_chr_0028_wulfa_passive_cape_stack_effect`。报告与脚本分别为
`tmp/cape-reference-audit.json`、`tmp/audit-cape-references.mjs`。

引用仅为角色被动登记、被动安装usp_detect、同一usp_detect内终端Buff的结束、层数判断和
创建，以及各文件自身ID。终端外部直接读取未发现；不能误写为没有层数读取，因为
usp_detect内确实有三处CheckBuffStackNumAdvanced，用来限制自身创建层数。
终端没有动作类型或图标；因此暂不以此项为理由扩展队伍能量事件，不修改正式数据。

SHA-256：

- SkillData：`e7bfddc501318ac7c77c82c5c4b7a576678fd0299ac9ef7ea8dca719b710c238`
- usp_detect：`fe012fc33c59c0921ee224c2c50e7e8a0d5daf3c54cfced7e04301f6db43825d`
- cape_stack_effect：`a10c0bdb2fdd7e413d80082c0358eb364d753e29747828eef9c88bc8a2f30c6d`

证据范围仅覆盖这批JSON内精确ID值引用，不证明通用Buff计数/事件消费者、动态引用或
运行时硬编码完全不存在。不据此删除通用机制或宣称全游戏完全无影响。本轮无生产修改，
未新增测试、未重跑真实轴或视觉验证；最新数值继续以前一轮卡缪最终报告为准。
