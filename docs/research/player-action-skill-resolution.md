# 四种玩家操作的技能解析与校验

## 目标与边界

Endaxis 时间轴表达的是“玩家在现实时间的这一刻尝试输入某个操作”。编辑器允许
显式放置普攻、战技、连携和终结技操作可能派生的所有技能，但模拟前必须回答：

1. 此刻的输入会不会生成技能请求；
2. 生成的请求具体指向哪个技能；
3. 它能否提前中断当前技能；
4. 它是否通过冷却、费用、标签、状态和目标门禁。

校验失败只在技能块右上角产生可解释的警告。按用户已确认的旧版行为，时间轴仍执行块中
明示的技能：不隐式替换，不因资源不足或无法中断而删掉伤害；技力可扣到负数，终结技能量最低扣到零。

## 证据来源

本文依据 1.4.4 IL2CPP 元数据与反编译结果，对应的复刻库研究为：

- `D:/Projects/combat-spec/docs/player-command-refresh.md`；
- `D:/Projects/combat-spec/docs/combo-input.md`；
- `D:/Projects/combat-spec/docs/skill-interruption.md`；
- `D:/Projects/combat-spec/docs/skill-tag-checks.md`；
- `D:/Projects/combat-spec/docs/combo-cast-preparation.md`。

原生的 `PlayerCommandConfig.CmdType` 与 `ComboController.BattleCommandType` 是两套枚举，不能合并。Endaxis 只在
项目存档中保留玩家能直接表达的四种身份：

| Endaxis 操作  | 原生入口         | 技能来源                                                             |
| ------------- | ---------------- | -------------------------------------------------------------------- |
| `basicAttack` | `CmdType.Attack` | `BattleCommandType.Attack` 当前有效映射                              |
| `battleSkill` | `CmdType.Skill`  | 输入 ID 必须等于 `curNormalSkill`，实际技能仍是当前 `curNormalSkill` |
| `comboSkill`  | `CmdType.Skill`  | 输入 ID 必须等于 `curComboSkill`，实际技能仍是当前 `curComboSkill`   |
| `ultimate`    | `CmdType.Skill`  | 输入 ID 必须等于 `curUltimateSkill`，直接以该 ID 创建请求            |

这意味着 `ComboCacheAction` 中的 `NormalSkill` / `ComboSkill` 映射不能被解释为“把战技/连携替换成
配置里的 skillId”。`RefreshNextSkillRequest` 会先取该映射的缓存配置，然后把副本的 skillId
覆盖为当前槽位 ID。终结技连该映射都不读。只有 `Attack` 映射的目标 ID 是选择 A1/A2/强化普攻
等普攻派生技能的直接证据。

## 正确的判定流程

```text
时间轴技能块
  -> 读取技能块保存的四类语义动作（不看技能名称和技能库分组）
  -> 按当前槽位与 Attack 命令映射求实际技能
  -> 与块中明示 skillKey 对比
  -> CheckCanInterruptCurSkill
  -> IsAvailable（owner / 冷却 / 费用 / 标签 / 状态）
  -> 距离检查
  -> 玩家路径跳过角度检查
```

Endaxis 的固定木桩模型把有效距离归约为零，因此距离门禁恒通过；这不是“原生没有距离
检查”。玩家生产路径本来就以 `skipAngle: true` 调用 `CanCastSkill`，所以角度跳过有直接证据。

### 技能选择

- 普攻：基础入口来自原生 `SkillDataBundle.defaultCmdMapping`，当前连段来自
  `normalAttackList`/offset 状态，模式还可通过 `ModeData.overrideNormalAttackList` 与
  `overrideCmdMapping` 同时覆盖；随后再叠加当前有效的运行时 `Attack` 映射。多个同优先级映射的
  原生仲裁未闭环，必须返回 `unknown`。
- 战技、连携、终结技：取当前槽位。弥弗 C2/C3 已由 Buff 的 `ChangeSkillAction` 依次把战技槽位
  换成二段/三段，不需要把三个技能隐式打包成一次释放。
- 处决和下落攻击都属于普通攻击操作的派生结果，但依赖敌人失衡/空中状态。它们不是无条件默认映射；
  当前无敌人主动行为的模型无法证明选择状态时，返回 `unknown` 而不猜。

### 中断与提前接续

`CheckCanInterruptCurSkill(next)` 按以下顺序短路：

1. 没有当前技能：允许；
2. `next` 在当前生效的 `AllowedNextSkillPack` 内：允许；
3. `next` 是原生下落攻击开始/结束技能：允许；
4. `next.interruptPriority > current.interruptPriority`：允许；
5. `current.canInterrupt`：允许；
6. 其他：拒绝。

优先级为普攻 1，处决/战技 2，连携 5，终结技 7。只有严格大于才能越过保护时间。
`current.canInterrupt` 在当前全量数据中等价于：

```text
passedTime > exclusiveFrame / 30 + 0.00001
```

`AllowNextSkillAction` 是第 2 步的白名单，不参与技能选择，也不代替后续 `IsAvailable`。

## Next 实现

- `SkillDefinition.skillType/levelSource` 保存单技能战斗分类初值和原生养成等级来源；生成器不再要求
  模拟从技能库分组取这两项。`skillType` 目前仍是 Endaxis 已支持分类，不冒充尚未完整恢复的原生
  可变 `SkillType` 初始化过程；
- `OperatorDefinition.skillSlots` 独立保存可被 `ChangeSkillAction` 改写的槽位，
  `playerActionRoutes` 保存四类语义动作到槽位/普攻候选的边；二者在转换配置中独立登记，生成器
  严禁从 `skillGroups` 推导；
- 新放置的 `SkillCastDocument.source.action` 保存玩家尝试执行的语义动作。旧项目只在正式路由能唯一
  反推出动作时补齐本次编译输入，不写回存档，也不从技能库分组恢复；
- 游戏数据契约保留技能局部的 `commandMappings` 和 `allowedNextSkills`；
- 编译器只把顶层直连的输入 Action 当作确定证据，条件/嵌套路径标记为未闭环；
- `AbilitySystemRuntime.resolvePlayerInputSkill` 求当前实际技能，返回 `matched / mismatched / unknown`；
- `evaluatePlayerInputInterruption` 独立执行提前接续判定，不与选择合并；
- 装配层把不一致、未知和无法中断分别写入回执，投影到具体 `castId` 的感叹号 title；
- 无论校验结果如何，`tryStartPlayerInput` 最后都以 `resolveSkillSlot: false` 执行时间轴块明示的技能。

## 尚未闭环

- 正式干员产物尚未用一致的完整来源重生成 `inputWindows`。本地 `tmp/game-data-sources` 在安塔尔
  Buff 闭包处已与仓库正式产物不一致，强行全量生成会带入大量无关漂移。在来源修复前，旧产物对稳定
  入口启用兼容门，不会制造虚假警告；
- `IsAvailable.CheckTag` 的控制流已在 combat-spec 闭环，但 `GameplayTagPredefineTable` 到战斗状态的
  生产数据仍未进入 Endaxis；不能把沉默、缴械等门禁猜成恒真或恒假；
- 同优先级多个运行时命令映射的最终仲裁、`m_alwaysAllowSkills` 的两个硬编码 ID，仍必须继续取证。
- `SkillDataBundle.defaultCmdMapping/normalAttackList` 与 `ModeData` 尚未进入 Endaxis 正式契约。在此之前
  不允许用 `SkillGroup.skillType`、`levelSource` 或 `libraryPresentation` 猜普通攻击的基础入口；缺失基础映射时
  应报告未知。
- 正式生成产物正分批迁移。Avywenna 已包含单技能身份、独立槽位和动作路由；未重生成的产物仍由
  编译层兼容旧组字段，兼容分支必须随全量重生成删除，不能成为长期规则。

## 分组不是运行时规则

原生本身把三类结构分开：`CharGrowthTable.skillGroupMap` 管养成/面板分组，`SkillDataBundle` 与
`ModeData` 管命令和普攻序列，技能数据管具体执行。庄方宜的 `attack1_ult..3_ult` 位于原生
`UltimateSkill` 养成组，但 `buff_chr_0030_zhuangfy_ult_base` 通过 `SwitchModeAction("UltMode")`
切换模式后仍由普通攻击操作触发。因此 Endaxis 的技能库分组只能决定展示和一串放置，不能参与
技能解析、等级选择或模拟。等级来源可由原生养成组成员关系编译为单技能字段；操作身份属于独立的
“操作到技能”路由，不能变成技能固有属性。原生运行时 `SkillType` 也不是不变的技能标签：初始值由
`SkillDataBundle` 注册及 `activeSkillTypeOverrides` 决定，之后还可被 `ChangeSkillType` 修改。它必须
作为技能运行时状态参与中断判断，不能从编辑器分组推导。

当前契约中的 `SkillDefinition.skillType` 只是运行时实例的静态初值和既有事件分类。它不等同于“这个
技能属于哪类玩家操作”，也不保证与原生对象此刻的 `Skill.skillType` 永远相同；后者必须在恢复注册
初始化和 `activeSkillTypeOverrides/ChangeSkillType` 后成为独立的可变状态。
