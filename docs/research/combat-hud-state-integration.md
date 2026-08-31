# 战斗 HUD 状态与 Endaxis 状态栏整合

## 证据

字段与类身份来自 1.4.4：

`D:/Projects/IL2CPP-Dumper/Arknights Endfield 1.4.4/IL2CPP_Dump_AI/UI.Gameplay.Beyond.dll.cs`

主要类为 `UIHeadBar`、`UIPoiseBar`、`MainCharHpBar`、`SquadIcon`、`SkillButton`、`ComboSkillPanel`、
`GPUIBuffNode` 和各类 `BuffCell`。这些类的字段证明 HUD 消费哪些状态，但不单独证明所有显示优先级
和细节动画；未取证的规则不从字段名猜测。

## 原生 HUD 的关键信息

### 敌人

`UIHeadBar` 同时绑定敌人 `AbilitySystem`，包含：

- 当前/最大生命、快慢两层生命填充和破坏状态；
- `UIPoiseBar`：当前/最大失衡、恢复状态、节点与破防动画；
- `UIWeaknessNode`：弱点/多重弱点计数；
- 独立的 `attachedBuffNode` 与 `normalBuffNode`；
- 等级、危险等级与当前主目标高亮。

`HeadBarCtrl` 还区分普通怪、精英和敌人部位头顶栏。Endaxis 的唯一静态木桩不需要复刻多目标管理、
屏外箭头或敌人施法预警。

### 干员

`MainCharHpBar` 包含：

- 当前操控干员生命文本、高/低血量填充和受击视效；
- 普通 Buff 节点、角色元素附着节点和单独 Buff 图标；
- 干员专属被动 UI 预制体；
- 由 Buff 驱动的终结技状态进度条和激活中终结技 Buff 列表。

`SquadIcon` 为每个队员显示头像、生命、死亡/可切换状态、等级、连携冷却/就绪、Buff 节点、
被动 UI 以及战术物品状态。

### 技能

`SkillButton` 并不只是一张图标：

- 普通技能按钮：当前槽位图标、冷却遮罩/数字、是否可放、不推荐状态；
- 长按终结技：当前图标、能量环/条、冷却和长按进度；
- 两类按钮都可由 Buff 驱动倒计时/进度；
- `_OnCharSkillChange` 和 `_OnCharUltimateSkillChange` 说明按钮展示跟随当前槽位，不是固定模板图标。

`ComboSkillPanel` 另外维护已就绪的干员列表、连携提示和释放按钮。它对应 Endaxis 中“当前有哪些
连携候选窗口”，不是把连携技当作一个永久可按的普通槽位。

### Buff 显示规则

`GPUIBuffNode` 按 `BuffIconStyle` 分组，按 stacking identity 合并层数，按 `orderPriority` 排序，并有节点最大
数量。`GPUIBuffCell` / `GPUILifeTimeBuffCell` / attached cell 分别支持层数、时长、警告背景与附着环。

Buff 数据本身提供可用于自动分流的原生字段：

- `showInHeadBarCommon` / `showInHeadBarAttached`；
- `showInSquadIcon` / `onlyShowForMainCharacter`；
- `showProgressInHpBar`；
- `showProgressInNormalSkillButton` / `useWeakProgressInNormalSkillButton`；
- `showProgressInUltimateSkillButton`；
- `iconStyleInSquad`、`abnormalColorType`、`orderPriority`、`showWarningBackground`。

这些字段应该是 Endaxis 显示分流的第一证据，不应通过 Buff ID、图标名或干员名猜测。编译器原本已
严格读取但丢弃了其中的进度/警告字段；现在已将它们纳入游戏数据契约、Buff 定义和显示回执。

### Buff 节点执行规则（运行时反编译）

1.4.4 运行时已经进一步确认节点的真实判断，而不再只是从字段名推断：

- `GPUIBuffNode._IsBuffIconInThisNode`（RVA `0x03AA2E90`）：头顶普通取
  `showInHeadBarCommon`，头顶附着取 `showInHeadBarAttached`；队伍头像取
  `showInSquadIcon && !onlyShowForMainCharacter`；主控干员血条取全部 `showInSquadIcon`。
- `UIBuffNode._GetIconStyle`（RVA `0x031D5E40`）：头顶附着固定为 `Attached`；头顶普通仅保留
  `SpellAbnormal` 特例，其余使用 `LifeTime`；队伍头像和主控干员栏使用非 Default 的
  `iconStyleInSquad`，Default 再按有限/无限生命周期回退到 `LifeTime` / `NoLifeTime`。
- `GPUIBuffNode._SetBuffCellSiblingInOrder`（RVA `0x0B1216B0`）：按已解析的
  `orderPriority` 降序，同优先级按 Buff 实例 UID 升序。
- `UIBuffNode._DealWithBuffCellVisible`（RVA `0x031D5520`）：节点最大数量大于零时，排序后的前 N 个
  显示，其余隐藏；非正数不限制。

完整反编译记录位于 combat-spec 的 `docs/combat-hud-buff-routing.md`。最后一条只属于游戏的瞬时 HUD；
Endaxis 时间轴 Buff 段必须保留全部生命周期，并通过增加画布高度容纳，不能裁切或压缩。

### 生命、失衡与技能按钮执行规则（运行时反编译）

进一步反编译确认：`UIHeadBar` 与 `UIPoiseBar` 只消费绑定 `AbilitySystem` 的生命/失衡状态，快慢填充、
受击效果和缓动目标属于表现，不是第二套数值账本。`UIPoiseBar.realPoise`（RVA `0x03CEED80`）读取
owner 的失衡属性；恢复计时和恢复后仍短暂保留的 `PoiseBroken` 标签是两个生命周期，因此状态栏不能
仅凭 `poise === 0` 猜测是否处于破防。

`SkillButton` 分别保存当前普通技能与终结技的 `SkillData` / `Skill`，技能槽变化、冷却变化、终结技能量
变化和 Buff 进度分别由独立回调刷新。这再次排除了“用编辑器技能库分组推导战斗 HUD 槽位”的做法。
完整证据与 RVA 记录位于 combat-spec 的 `docs/combat-hud-vitals-and-skill-state.md`。

## Endaxis 的整合原则

Endaxis 不应把屏幕空间 HUD 原样复制到时间轴。它需要将同一组战斗事实投影成两种互补视图：

1. **时段视图**：现有 Buff/附着/反应/冷却/连携持续段，用于回答“什么时候开始和结束”；
2. **光标快照**：在时间光标所在帧对曲线和生命周期取样，用于回答“这一刻的 HUD 是什么状态”。

状态栏不得反过来驱动模拟。数据流固定为：

```text
原生数据 -> 编译后定义 -> 运行时账本/回执 -> 曲线与生命周期投影 -> 光标快照 -> UI
```

## 建议的状态栏结构

### 敌人状态栏

- 固定信息：敌人名称、等级/危险等级（来自场景配置，不进回执）；
- 光标快照：生命/最大生命、失衡/最大失衡和失衡恢复状态；
- 效果区：`showInHeadBarAttached` 附着与 `showInHeadBarCommon` 普通 Buff，另加已有元素附着/爆发/反应；
- 时间区：保留现有持续段，不把图标只收缩成光标瞬时状态。

### 干员状态栏

- 固定信息：头像、名称、武器/装备和构筑入口，继续由轨道头部承载；
- 光标快照：终结技能量、当前执行技能、当前战技/连携/终结技槽位、冷却和连携候选；
- Buff 区：队伍快照显示 `showInSquadIcon && !onlyShowForMainCharacter`，主控快照显示全部
  `showInSquadIcon`，并按 `orderPriority` 降序、实例 UID 升序排列；
- 技能状态：当前槽位图标与可用性、普通/终结技按钮进度 Buff；
- 生命：当前木桩模型没有敌人主动伤害，干员会保持满血且治疗仍可发生。在干员生命曲线真正
  成为可观察模拟结果前，状态栏不伪造受击波动。

## 不纳入当前模型的 HUD 信息

- 敌人主动攻击预警、屏外敌人箭头、受击闪烁和队员血量波动；
- 空间朝向、敌人距离、多目标头顶栏避让；
- 战术物品、切人冷却等尚未进入 Endaxis 玩家操作模型的状态。

这些内容对当前伤害模拟没有可观察影响，不应挤占模拟管线贯通的优先级。

## 实施顺序

1. 贯通 Buff 的全部原生显示标志到回执，并建立一个 UI 无关的状态指示器投影；
2. 从既有生命/失衡/资源曲线按 `cursorFrame` 采样，不二次计算数值；
3. 从 `SkillSlotChanged`、`SkillStarted/Ended/Interrupted`、冷却和连携窗口回执投影当前技能状态；
4. 敌人快照放入现有敌人底部面板左侧状态栏，干员快照放入对应轨道头部；时段条保持在轴上；
5. 根据已反编译的规则落实节点分流、图标样式和排序；最大图标数只在确实复刻游戏快照 HUD 的组件中
   使用，时间轴持续段继续通过扩高画布完整展示。

## 当前落地

- `projectCombatHudSnapshot` 已成为 UI 无关的单一快照入口；生命、失衡、SP、终结技能量从现有曲线
  采样，当前施放、冷却、连携窗口和失衡阶段从回执/生命周期段投影。
- 敌人底部状态区已显示光标帧的名称、等级、生命与失衡；破防恢复和破防标签结束窗口分开标记。
- 干员轨道头已显示光标帧的终结技能量、当前施放名称以及冷却/连携候选数量；已有 Buff 节点分流
  继续复用同一光标帧。
- 当前技能槽身份与技能按钮 Buff 进度尚未进入统一快照；下一阶段需要基于 `SkillSlotChanged` 和已贯通
  的原生进度显示字段补齐，不能从技能库分组反推。
