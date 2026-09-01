# 原生多段连携机制：洛茜样本

本文核实原生游戏如何处理多段连携，并据此约束 Endaxis Next 的连携窗口与技能定义模型。结论来自 1.4.4 的 `CharGrowthTable`、洛茜 SkillData/BuffData，以及 `Gameplay.Beyond.dll` 静态类型信息。

> 游戏规则的唯一权威总规格位于 combat-spec `docs/combo-skill-lifecycle.md`。本文只记录洛茜样本及
> Endaxis 单敌人时间轴投影，不再独立定义注册、Pending、排序或输入规则。

## 结论

1. 通用连携窗口固定为 5 秒，即 Endaxis 的 30 FPS 时间基准下固定为 150 帧。它是场景级连携管理器创建的 pending 候选，不是每个技能自行配置的可变持续时间。
2. 洛茜展示给玩家的两段连携分别是独立 SkillData：
   - 第一段：`chr_0028_wulfa_combo_2_skill`
   - 第二段：`chr_0028_wulfa_combo_3_skill`
3. 第一段在自己的时间轴动作中执行 `TriggerComboSkillAction`，重新向全局连携管理器提交下一次 pending。它不是依靠常驻的技能级事件监听器等待第二次输入。
4. 第一段生效期间还通过 `ComboCacheAction` 将下一次 `ComboSkill` 输入映射到 `chr_0028_wulfa_combo_3_skill`。因此“再开窗口”和“下一次输入释放哪一段”是两项配合工作的原生机制。
5. 洛茜的精准衔接由独立 QTE Buff 负责。它的计时不能代替通用 5 秒连携窗口。

## 技能身份

`CharGrowthTable` 中洛茜的展示连携技能组只包含：

```text
chr_0028_wulfa_combo_2_skill
chr_0028_wulfa_combo_3_skill
```

本地数据还存在 `chr_0028_wulfa_combo_1_skill`，但它不属于当前展示技能组。不能根据编号把它误认为玩家看到的第一段连携。

## 第一段如何产生第二段

`chr_0028_wulfa_combo_2_skill` 包含以下关键动作：

```text
0-65 帧  ComboCacheAction
         ComboSkill -> chr_0028_wulfa_combo_3_skill

37-41 帧 检查 can_trigger_combo 和目标存活
          -> TriggerComboSkillAction
          -> 将 combo_2_skill 冷却设为 0
          -> 添加 combo_usetimer
```

这说明原生流程是：

```text
释放第一段
  -> 第一段运行到指定帧
  -> 第一段主动触发下一次连携候选
  -> BattleManager 创建新的 pending
  -> ComboCacheAction 将下一次连携输入映射到第二段 SkillData
  -> 玩家在 pending 窗口内释放第二段，或等待窗口过期
```

`TriggerComboSkillAction` 的 `needTrigger=false` 表明这里不再等待一次外部通用事件，而是由第一段技能直接提交连携候选。目标死亡时走另一条选目标分支；这属于目标选择细节，Endaxis 的单敌人模型只需保留“目标仍有效时开启第二段窗口”的结果。

## 全局 pending 的职责

`BattleManager` 使用以下结构管理连携候选：

- `m_pendingComboSkill`：按干员保存待释放连携记录；
- `ComboSkillTriggeredRecord.castInfoList`：保存同一干员的候选目标与剩余时间；
- `ComboSkillCastInfo.remainTime`：候选剩余时间；
- `_UpdatePendingComboSkill(dt)`：逐帧更新与过期；
- `CastPendingComboSkill(charIndex)`：释放指定干员当前候选；
- `m_triggeredComboSkillFromLastFrame`：处理同帧触发记录；
- pause 相关字段：暂停全体或指定干员的连携候选计时。

因此窗口排队、剩余时间、暂停、过期和释放顺序都属于场景级状态，不属于某个技能块内部的 Buff 或监听器。

## 首段连携的注册与触发

首段连携条件不属于具体 `SkillData`，而是角色级 `SkillDataBundle` 的组成部分：

```text
SkillDataBundle
  comboSkillPriorityType
  comboSkillConditions
  enableComboSkillBlackboard
  comboSkillBlackboard
  comboSkillId
```

其中每项 `ComboSkillCondition` 包含事件、条件序列和 `comboSkillConditionImmediately`。角色进入战斗系统时，`BattleManager.RegisterComboSkillEvent` 会把这些条件编译成 `SequenceAction`，再按事件类型登记到 `m_comboSkillEvents`。

事件到达时，`TriggerComboSkillEvent` 的主流程为：

```text
检查该事件是否存在连携监听
  -> 为条件序列写入目标和事件上下文
  -> 执行 conditionSequenceAction
  -> 条件不成立：结束
  -> 条件成立且 castImmediately=false：PendingComboSkill
  -> 条件成立且 castImmediately=true：TryCastComboSkill
```

因此“条件成立”并不必然产生可见窗口。原生数据可以要求立即尝试释放；只有非立即分支才进入 pending 管理器。Endaxis 的定义层必须保留这项区别，不能把所有触发条件都等价转换成 `openComboWindow`。

## 候选的创建与刷新

`PendingComboSkill` 以干员为键查找或创建 `ComboSkillTriggeredRecord`，并从该干员的 `SkillDataBundle.comboSkillPriorityType` 初始化候选选择策略。每次提交都会创建一项新的 `ComboSkillCastInfo`，保存：

- 实际施法目标；
- 触发该条件的目标；
- 剩余窗口时间；
- 从角色连携黑板复制的参数。

窗口寿命来自全局 `SkillSetting.comboSkillPendingInterval`，不是技能字段。`SkillSetting` 还包含 `comboSkillTriggerUIInterval`：同一干员短时间内再次提交候选时，可以刷新候选列表而不重复触发连携 UI、提示音和语音。只有超过该 UI 间隔时，运行时才更新 `ComboSkillTriggeredRecord.lastTriggerTime`，并把干员序号加入 `m_triggeredComboSkillFromLastFrame`。

这说明 `lastTriggerTime` 更接近“本轮连携提示被激活的时间”，不能简单等同于每个目标候选的创建时间。

## 查询、释放与消费

`GetRemainComboSkillPendingTime(charIndex, out remainTime, out canCast)` 会：

1. 查找指定干员的 pending 记录；
2. 读取 `castInfoList` 最后一项的 `remainTime`；
3. 使用该候选目标和角色的 `comboSkillId` 调用完整的 `CanCastSkill` 门禁；
4. 分别返回“存在窗口”和“当前能否释放”。

因此“窗口存在”和“当前可释放”是两个独立状态。UI 或合法性检查不能仅凭剩余时间判断连携技一定能释放。

`CastPendingComboSkill(charIndex)` 则先调用 `GetBestCastInfo()` 选择候选，再调用角色的 `TryCastComboSkill()`。从当前机器码可确认：该方法忽略 `TryCastComboSkill()` 的返回值，随后清空该干员的 `ComboSkillTriggeredRecord`，并触发全局 `OnCastComboSkill` 条件。正常入口依靠此前的 `canCast` 查询阻止无效输入；一旦进入该方法，候选会被消费。

`GetBestCastInfo()` 支持三种原生策略：

- `Default`：按默认候选规则选择；
- `FirstBB`：比较候选黑板中的优先值，并处理目标重复时的稳定选择；
- `EnemyRank`：按候选覆盖敌人的最高等级选择。

Endaxis 当前采用单敌人模型，可以化简目标选择，但仍应保留“一个干员记录下可以有多个候选，释放时才选择”的生命周期语义。

## 逐帧更新与暂停

`_UpdatePendingComboSkill(dt)` 的原生顺序已经确认：

1. 先整理 `m_triggeredComboSkillFromLastFrame`；
2. 若全局连携暂停，直接跳过全部 pending 更新；
3. 遍历每名有 pending 的干员；
4. 若该干员单独暂停，跳过该干员；
5. 对其每个 `ComboSkillCastInfo` 执行 `remainTime -= dt`；
6. `remainTime < 0` 的候选先加入 `m_toRemovePendingComboSkill`；
7. 遍历待删除列表，逐项 `Dispose` 并从原列表移除；
8. 某干员的候选列表清空后，再清理该干员的 pending 记录并触发相应退出通知。

所以窗口应建模为可暂停的剩余时间。使用固定绝对 `expiresFrame` 只有在永不暂停时才等价，不能作为最终实现。

## 跨干员调度与玩家输入

`ReactiveAllPendingComboSkill` 会读取各干员记录的 `lastTriggerTime` 并排序。其比较器已经确认：时间差明显时按时间先后排序；时间近似相同时使用干员序号稳定排序。这个行为与实测的“先触发者优先，同帧时低轨道优先”一致。

底层 `CastPendingComboSkill(charIndex)` 接受指定角色，不负责表达玩家可以选择哪一项；玩家输入由
`Beyond.UI.ComboSkillPanel.CastComboSkill` 约束。1.4.4 机器码确认该入口先从面板候选列表取索引
`0`，再查询存在性与 `canCast`，通过后才把这个角色序号传给 `CastPendingComboSkill`。
因此 E 键明确消费当前队首，不能用底层 API 可传任意角色反推玩家能够跳过队首。

因此 Next 最终应区分：

- 每名干员各自保存的 pending 候选；
- 场景级的当前可交互连携项；
- 候选存在但因排队或施法门禁暂时不可释放的状态。

Next 可以把这条输入约束实现为“只有场景当前队首可被正常连携输入消费”；它是 UI/输入行为，
不是 `m_pendingComboSkill` 容器必须只能访问队首的声明。

## 精准衔接不是连携窗口

第一段会创建 `buff_chr_0028_wulfa_combo_2_qte_timerlistening`。该 Buff 包含：

- `ShowComboRingQte`；
- `time_warning` 与 `time_succeed`；
- `PauseBuffTime`；
- QTE 成功和失败 Buff；
- QTE 提示特效与声音。

其黑板 `duration=6.0` 是 QTE 监听 Buff 的内部寿命，并不表示通用连携窗口持续 6 秒。第二段 SkillData 会读取并结束相关 QTE Buff，以决定是否获得精准衔接效果。

## 对 Next 数据模型的约束

### 1. 窗口时长不进入 SkillDefinition

通用 5 秒窗口应由场景级 `ComboWindowRuntime` 使用常量创建。技能定义只描述什么行为会开启窗口，以及窗口属于哪个阶段，不应允许用户逐技能编辑窗口时长。

### 2. 多段技能保持独立身份

第一段和第二段继续使用独立 `SkillDefinition`。技能组负责把它们组织成一个连携技能，时间轴动作仍引用实际释放的阶段定义。

### 3. 重新开启窗口是技能步骤

第一段内部需要一种可排序的战斗步骤，例如：

```ts
{
  kind: 'openComboWindow',
  parameters: { nextSkillKey: 'comboSkillStage2' },
}
```

它应位于第一段的调度序列中，并在对应帧执行。这样每次施放只产生一次属于本次施放的行为，不会因多个技能块共享顶层监听器而重复注册。

### 4. 当前候选携带阶段身份

场景级 pending 至少要保存：

- 所属干员；
- 下一段技能定义键；
- 开启顺序和可暂停的剩余时间；
- 触发目标或单敌人占位；
- 排队所需的触发顺序与轨道优先级；
- 暂停状态。

合法性检查必须验证当前动作消费的是队首 pending，且技能阶段与 pending 的 `nextSkill` 一致。这样第一段窗口不能被第二段之外的变体消费，两个阶段也不会串用窗口。

### 5. 精准衔接单独建模

精准衔接属于第一段产生、第二段消费的计时状态。它可以由 Buff/状态步骤和第二段条件表达，不应塞进通用 `ComboWindowRuntime`。

## 与事件监听器的边界

原生 `EventListenerAction` 是有起止帧的时间轴动作：开始时注册，结束或技能中断时注销。洛茜第二段窗口的主链路使用的是第一段中的 `TriggerComboSkillAction`，不是顶层常驻事件监听器。

这进一步说明 Next 不应把连携阶段推进或原生事件监听器放成无生命周期的 `SkillDefinition.eventHandlers`。两者都应进入可排序、可结束、从属于一次技能施放的调度结构。

## 尚待核实

- `BattleManager` 内固定 5 秒常量在当前机器码中的具体赋值位置；产品规则与既有行为已经明确，但仍可补充底层赋值证据。
- 洛茜目标死亡后重新选取目标的完整优先级。单敌人 Endaxis 暂不需要复刻该分支。
- `combo_1_skill` 在当前版本中的实际入口用途。它不是展示技能组的一部分，因此不阻塞两段连携建模。

## 当前实现状态

Next 已加入 `openComboWindow` 步骤和全场唯一的 `ComboWindowRuntime`。运行时按干员保存候选，使用可暂停的 150 帧剩余时间，并按开启帧、同帧轨道顺序选择当前激活记录；连携输入开始前，仅当干员与技能键同时匹配当前候选时才消费该干员的整条记录，并把候选黑板注入本次技能动作黑板。

角色模板生成的首段条件已经随参战干员安装一次。原生 AbilityEvent 到达后由公共条件动作序列执行，成功后开启窗口；窗口开启、消费、过期和释放失败都进入统一战斗回执。无窗口、非当前队首和阶段不匹配会投影为技能块诊断，但不会阻止用户排入时间轴的连携技执行。

旧 manifest `comboSkillRegistrations` 曾手写语义事件并与角色模板条件并行安装。它不是第二套原生
机制，会丢失原生事件时机、条件动作、input/trigger、独立黑板、角色位置过滤和立即施放语义；当前
manifest 已清空这类配置；对应数据契约、manifest 解析器、场景编译器、语义监听运行时和编辑入口也已删除，正式干员只由 `comboSkillConditions` 生成。

收束后的唯一入口必须来自 `SkillDataBundle` 整体转换：连携槽与优先级、条件列表、条件黑板开关
及初值共同形成一个干员级连携定义。转换器只能对已完整解码的事件和叶子生成运行时程序；未解码
来源进入审计阻塞，不得回退到 manifest 手写规则。

目前安塔尔、萤石、诀、狼卫、Last Rite、汤汤和佩丽卡已经改走角色模板条件，manifest 不再含手写
注册。佩丽卡重导模板包含 `CheckTargetsEqual.secondTargetSettings` 的完整 RID 闭包；其中
`CharacterTeamFinder` 和 `MainCharacterValidator` 是类型明确、零载荷的原生 selector 节点，只在 Unity
适配层还原为公共 TargetSettings 类型。事件 101 的机器码证明它是有目标的 OnBeforeTakeDamage：
承伤方发布、伤害来源为 input、承伤方为 trigger。因此完整条件是末段普攻伤害标签、input 为当前
主控且 trigger 为 Enemy，不再由旧 `normalAttackLastCombo` 监听器近似。

正式条件现在显式保留 `immediately`；原生值为 true 时 Endaxis 会因尚缺目标感知的直接
`TryCastComboSkill` 端口而阻塞，不会偷换成普通窗口。角色级 `comboSkillPriorityType` 也保留为
可读的 default/firstBlackboard/enemyRank；`GetBestCastInfo` 的机器码分支确认数值映射为 0/1/2。
单敌人运行时暂不执行三种多目标评分差异，但定义和编译程序不能丢失这一事实。

狼卫的一条事件 121 条件只检查 `trigger` 的对象类型掩码 16；Last Rite 的同类条件要求寒冷附着，
且 `trigger` 已具有至少两层 `Skill/Character/Common/SpellInflict/CrystInflict`。两者的来源 RID 均已
完整解码，因此现在直接随干员定义生成，不再需要产品配置重写。汤汤的三条入口也已由同一份
`SkillDataBundle` 原子生成：事件 12 `OnTakeDamage` 检查四种 Burst 伤害标签，事件 9
`OnAddedBuff` 检查 `Skill/Character/Common/SpellBurst` Buff 标签，事件 121
`OnBeforeTakeInfliction` 检查寒冷附着。桌面端 VFS 从实际 8896 字节角色资产重导后，4/4 条条件引用
均完整；根 `sourceSha256` 与旧快照相同，确认此前差异只是缺少
`CheckBuffIdInContextAdvanced` 解码，而不是替换了来源资产。三类入口与普通 Buff/伤害响应共用事件
分派、上下文规范化、公共条件执行器和动作序列；连携层只额外执行 owner/沉默/冷却门禁并产出
Pending。生成器仍坚持 Bundle 整体失败关闭，未绕过来源边界选择性安装子集。

Pending 更新已按原生严格使用 `remainTime < 0` 作为过期条件；恰好降到零的帧仍可消费。此前
`<= 0` 的实现会让窗口提前一帧消失，现已修正。

安塔尔样本进一步证明，同一个连携技能的不同触发事件可以携带不同的候选黑板。原始
`chr_0023_antal_combo_skill` 使用 `EntityBB_combo_type/index` 选择“重复本次物理异常或
元素附着”的分支：元素映射为热/电/寒冷/自然 `0..3`，物理映射为浮空/击倒/破防/碎甲
`0..3`。这些值应由原生条件动作执行并在 Pending 时复制，不能在配置中展开成八条手写规则；
合法窗口消费时才把实际命中条件产生的快照注入本次释放。

时间轴仍允许强制放置没有窗口的连携块。对安塔尔这类必须读取触发载荷的技能，定义可以
声明 `invalidCastBlackboard` 哨兵，使依赖载荷的附加异常分支不执行、基础伤害仍可审计；
运行时同时保留 `ComboWindowUnavailableAtStart`，该哨兵不是原生默认值，也不能把非法释放
伪装成合法触发。

萤石提供了另一组角色模板级实证。1.4.4 本地 VFS 中
`data_chr_0022_bounda.asset` 的 `SkillDataBundle` 有两条事件值均为 `121` 的条件：第一条先以
`CheckBuffStackNumByTag` 检查目标寒冷附着 Tag `1570888476` 的 `BuffCount >= 1`，再以
`CheckSpellInflictionType` 掩码 `0x04` 把 `EntityBB_combo_index` 写为寒冷枚举索引 `2`；第二条
对自然附着 Tag `-1411846745` 和掩码 `0x08` 执行同样流程并写入索引 `3`。安塔尔同版本角色模板
在同一事件值下使用掩码 `0x0f`，其既有元素 `0..3` 注册与技能分支构成交叉校验，因此这里不是按
名称猜枚举顺序。萤石正式注册保留目标 Buff Tag 条件和逐规则候选黑板；无窗口强制放置仅注入
`-1`，让两个元素附着分支都不执行，而共同的自然伤害继续接受全技能运行审计。

单敌人模型下仍未实现原生三种多目标候选选择策略的实际差异。`castImmediately` 也尚未闭环：它要求能力系统持有未放到时间轴上的基础技能程序，不能借用某个放置实例。UI 激活间隔、完整条件覆盖和“窗口存在/当前可释放”的更多门禁仍待接入。洛茜正式 Next 数据也尚未加入；进入生成器时，第一段应在原生第 37 帧插入开启第二段窗口的步骤。
