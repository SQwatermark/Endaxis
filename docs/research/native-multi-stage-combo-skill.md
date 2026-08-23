# 原生多段连携机制：洛茜样本

本文核实原生游戏如何处理多段连携，并据此约束 Endaxis Next 的连携窗口与技能定义模型。结论来自 1.4.4 的 `CharGrowthTable`、洛茜 SkillData/BuffData，以及 `Gameplay.Beyond.dll` 静态类型信息。

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

## 跨干员调度仍需核实的边界

`ReactiveAllPendingComboSkill` 会读取各干员记录的 `lastTriggerTime` 并排序。其比较器已经确认：时间差明显时按时间先后排序；时间近似相同时使用干员序号稳定排序。这个行为与实测的“先触发者优先，同帧时低轨道优先”一致。

但目前尚未证明 `CastPendingComboSkill(charIndex)` 自身会拒绝非队首干员。静态接口允许按指定 `charIndex` 查询和尝试释放，更可能是输入/UI 层只激活排序后的当前候选，释放或过期后再调用 `ReactiveAllPendingComboSkill` 激活下一项。

因此 Next 最终应区分：

- 每名干员各自保存的 pending 候选；
- 场景级的当前可交互连携项；
- 候选存在但因排队或施法门禁暂时不可释放的状态。

在输入激活链尚未完成还原前，不能把“全局数组队首才能消费”写成原生数据结构，也不能删除这项产品行为约束。

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

干员级首段注册已经随参战干员安装一次。伤害标签命中和元素附着会同步发布语义事件，匹配规则在条件成立后开启窗口；窗口开启、消费、过期和释放失败都进入统一战斗回执。无窗口、非当前队首和阶段不匹配会投影为技能块诊断，但不会阻止用户排入时间轴的连携技执行。双干员样本已覆盖“队友末段普攻命中 -> 佩丽卡窗口 -> 连携消费 -> 伤害与反应”的完整链路。

首段外部事件规则位于 `OperatorDefinition.comboSkillRegistrations`，不属于 `SkillDefinition` 或技能块编辑器，并按当前连携技能等级展开黑板值进入 `CombatOperatorProgram`。注册运行时只负责订阅和生命周期；实时条件由战斗环境的统一条件端口求值，不另建连携专用解释器。

安塔尔样本进一步证明，同一个连携技能的不同触发事件可以携带不同的候选黑板。原始
`chr_0023_antal_combo_skill` 使用 `EntityBB_combo_type/index` 选择“重复本次物理异常或
元素附着”的分支：元素映射为热/电/寒冷/自然 `0..3`，物理映射为浮空/击倒/破防/碎甲
`0..3`。Next 因此在规则层保存候选黑板，而不是给技能模板猜一个全局默认值；合法窗口
消费时才把命中规则的值注入本次释放。物理异常输出也统一发布携带具体类型的语义事件。

时间轴仍允许强制放置没有窗口的连携块。对安塔尔这类必须读取触发载荷的技能，定义可以
声明 `invalidCastBlackboard` 哨兵，使依赖载荷的附加异常分支不执行、基础伤害仍可审计；
运行时同时保留 `ComboWindowUnavailableAtStart`，该哨兵不是原生默认值，也不能把非法释放
伪装成合法触发。

单敌人模型下仍未实现原生三种多目标候选选择策略的实际差异。`castImmediately` 也尚未闭环：它要求能力系统持有未放到时间轴上的基础技能程序，不能借用某个放置实例。UI 激活间隔、完整条件覆盖和“窗口存在/当前可释放”的更多门禁仍待接入。洛茜正式 Next 数据也尚未加入；进入生成器时，第一段应在原生第 37 帧插入开启第二段窗口的步骤。
