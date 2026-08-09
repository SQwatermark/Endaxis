# 原生 Buff 的 ContextTarget 目标解析

## 研究范围

本文只研究 1.4.4 原生 `CreateBuffAction` 中与目标解析有关的两个字段：

- `targetSettings.targetSource`：决定哪些实体接收 Buff；
- `buffSource`：决定新 Buff 记录的来源实体。

重点是 `buffSource = ContextTarget`，并对照接收者侧的 `targetSource = Context`、
`targetSource = Target`。结论来自本地静态元数据、运行时机器码、combat-spec 已闭环的目标组
语义，以及全量 SkillData/BuffData 统计。无法由这些证据确认的身份映射会明确保留为未知。

## 首要结论：ContextTarget 不是 TargetSource

数据中不存在 `targetSettings.targetSource = ContextTarget`。`CreateBuffAction.Data` 同时保存两套
相互独立的配置：

```text
CreateBuffAction.Data
├─ targetSettings: TargetSettings
│  └─ targetSource: Target | Source | Context | InstantSearch
│                   | Owner | MainCharacter | MainTarget
├─ buffSource: ActionSource | ActionOwner | InputTarget
│              | CurrentTarget | ContextTarget
└─ contextKey: string
```

静态字段布局见 `Gameplay.Beyond.dll.cs` 中的 `CreateBuffAction.Data`：`targetSettings` 位于
`+0x30`，`buffSource` 位于 `+0x38`，`contextKey` 位于 `+0x40`。因此本文所说的
`ContextTarget` 是 **Buff 来源解析方式**，不是 Buff 接收者的 `TargetSource`。

这一区分直接影响模拟结果。例如一条配置可以同时表示：

```text
把 Buff 施加给 Context("tar") 中的所有实体，
但把 Buff 的 source 记为 Context("src") 中的第一个实体。
```

## 证据来源

### 静态元数据

- `../combat-runtime-dumps/1.4.4/static/Gameplay.Beyond.dll.cs`
  - `CreateBuffAction.Data`：约第 47949 行；
  - `TargetSource`：约第 90446 行；
  - `ActionTargetType`：约第 90931 行；
  - `AbilityActionUtils.GetActionTarget`、`GetTargetsView`、`GetTargets_Dispose`：约第
    203496 行。
- `CreateBuffAction.ExecuteInternal`
  - token：`0x600DA91`；
  - RVA：`0x035F1D60`。
- `AbilityActionUtils.GetActionTarget`
  - 带位置输出的重载：RVA `0x02F4E900`；
  - 仅返回实体的重载：RVA `0x035F1160`。
- `AbilityActionUtils.GetTargetsView`：RVA `0x033C19D0`。
- `AbilityActionUtils.GetTargets_Dispose`：RVA `0x0354D020`。

### 运行时机器码

- `../combat-runtime-dumps/1.4.4/runtime-1/IL2CPP_MethodProbes.runtime-1.json`
- `../combat-runtime-dumps/1.4.4/runtime-1/runtime-1-full.analysis.json`
- `../combat-runtime-dumps/1.4.4/runtime-1/IL2CPP_GameAssembly.runtime.runtime-1.bin`

机器码中与本结论直接相关的分支为：

- `0x035F1E44`：调用 `GetTargets_Dispose` 取得 Buff 接收者；
- `0x035F2880..0x035F288F`：按索引遍历接收者；数量为 0 时直接走完成分支；
- `0x035F29C5..0x035F2C08`：按 `buffSource` 枚举选择 Buff 来源；
- `0x035F2A2C..0x035F2A91`：`ContextTarget` 分支，用 `contextKey` 查询上下文目标组并
  取首个可解析的 `AbilitySystem`；
- `0x035F2A69`、`0x035F2C52`：目标组查询失败或结果不能解析为实体时，跳到当前接收者的
  循环尾部；
- `0x035F2F12`：调用 `AbilitySystem.AddBuffByAbilityAction`；
- `0x035F3759..0x035F37F3`：正常结束时返回 `true`。

### 已闭环的公共语义

combat-spec 中以下文档和实现用于交叉核对机器码，不把当前适配器的支持范围反推为原生限制：

- `../vfs-index-browser/combat-spec/docs/target-resolution.md`
- `../vfs-index-browser/combat-spec/docs/create-buff-action-data.md`
- `../vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Actions/DataDrivenCreateBuffAction.cs`

其中已确认 `IActionEnvironment.Context` 持有
`Dictionary<string, TargetHandle>`；`FindTargetAction` 等动作通过 `UpdateTargetGroup` 写入目标
组，子环境也可能通过目标组复制取得独立快照。这里的 `Context` 是动作执行上下文，不是
Blackboard，也不是一个全局目标表。

## 原生调用路径

```text
CreateBuffAction.ExecuteInternal(inputTarget)
│
├─ GetTargets_Dispose(action, data.targetSettings, inputTarget)
│  └─ 解析 Buff 接收者集合
│
└─ 按集合顺序遍历每个 currentTarget
   │
   ├─ 按 data.buffSource 解析单个 Buff source
   │  └─ ContextTarget:
   │     ├─ action environment -> Context
   │     ├─ Context.TryGetTarget(data.contextKey)
   │     └─ 目标组中的 firstTarget -> AbilitySystem
   │
   ├─ source 为空：跳过当前 currentTarget
   │
   └─ 按 count、buffs 的既定顺序调用 AddBuffByAbilityAction
```

接收者解析与来源解析不会互相替代：`currentTarget` 是本轮要接收 Buff 的实体，而
`ContextTarget` 得到的是传给 Buff 的来源实体。

## ContextTarget 的精确语义

`buffSource = ContextTarget` 使用 `data.contextKey` 在当前动作环境的 `Context` 中查找目标
组，然后只取该组的 `firstTarget`：

- 目标组可包含多个实体，但只使用第一个实体作为 Buff source；
- 目标组中的其余实体不会产生额外 Buff，也不会依次成为来源；
- 目标组可以保存位置或其他 target wrapper，但实体重载只接受可解析为
  `AbilitySystem` 的首个实体目标；
- `contextKey` 为空、key 不存在、组为空，或组中没有可解析实体时，结果为 null；
- 对每个接收者都会执行同一来源解析逻辑；通常得到同一来源实体。

机器码还确认了 null 的可观察行为：来源解析失败时跳过 **当前接收者**，不调用
`AddBuffByAbilityAction`；随后继续下一个接收者，最终动作仍返回 `true`。因此不能把“来源
不存在”建模成整个 SequenceAction 失败或短路。

## 与 Context、Target 的差异

| 配置位置                      | 值              | 读取来源                     | 数量语义                        | 在 CreateBuffAction 中的用途 |
| ----------------------------- | --------------- | ---------------------------- | ------------------------------- | ---------------------------- |
| `targetSettings.targetSource` | `Target`        | 当前动作收到的 `inputTarget` | 保留整个输入 view，可含多个实体 | 所有有效实体分别接收 Buff    |
| `targetSettings.targetSource` | `Context`       | `Context[targetGroupKey]`    | 保留整个目标组，可含多个实体    | 所有有效实体分别接收 Buff    |
| `buffSource`                  | `ContextTarget` | `Context[contextKey]`        | 只取 `firstTarget`              | 作为每个新 Buff 的单一来源   |

`Target` 与 `Context` 都是“接收者集合”的来源，差异仅在集合从动作输入还是命名上下文组
读取。`ContextTarget` 则是“来源实体”的读取方式，不能因为名字相似而与
`targetSource = Context` 合并。

### 无目标行为

- 接收者集合为空或没有有效实体：不创建 Buff，动作返回 `true`；
- `ContextTarget` 来源为空：跳过对应接收者，不创建 Buff，动作最终仍返回 `true`；
- 接收者有多个实体、来源只有一个：按接收者原顺序逐个创建 Buff，来源始终是
  `Context[contextKey].firstTarget`；
- 输入/上下文中只有位置而没有实体：位置不会被当作 Buff 接收者或实体来源。

## 全量真实配置分布

统计对象为本地 1.4.4 全量目录：

- SkillData：612 个 JSON；
- BuffData：529 个 JSON。

### CreateBuffAction 总量

| 数据集    | 实例数 | 涉及文件数 |
| --------- | -----: | ---------: |
| SkillData |    617 |        186 |
| BuffData  |    227 |        129 |

### 接收者 targetSource

| `targetSettings.targetSource` | SkillData | BuffData |
| ----------------------------- | --------: | -------: |
| `Source`                      |       235 |       79 |
| `Owner`                       |       206 |       89 |
| `Target`                      |       122 |       21 |
| `Context`                     |        50 |       30 |
| `InstantSearch`               |         4 |        6 |
| `MainCharacter`               |         0 |        2 |

本批数据没有 `MainTarget` 的 CreateBuffAction 实例。

### Buff 来源 buffSource

| `buffSource`    | SkillData | BuffData |
| --------------- | --------: | -------: |
| `ActionSource`  |       510 |      187 |
| `ActionOwner`   |       102 |       38 |
| `ContextTarget` |         3 |        1 |
| `InputTarget`   |         2 |        1 |
| `CurrentTarget` |         0 |        0 |

### targetSource = Context 的组名分布

SkillData 的 50 条实例使用 21 个组名：

| 组名          | 数量 | 组名           | 数量 |
| ------------- | ---: | -------------- | ---: |
| `tar`         |   12 | `smart_target` |    7 |
| `targets`     |    5 | `robots`       |    3 |
| `Camille_Bat` |    3 | `ball`         |    2 |
| `shieldTar`   |    2 | `team`         |    2 |
| `Sheep`       |    2 | 其余 12 个组名 | 各 1 |

其余组名为 `Target`、`mainchar`、`Teammate`、`maincharslot`、`water`、
`normalskill_watermove`、`normalskill_watermove_1`、`tar_battleshape`、`thunder`、
`ult_postmodel_mirror`、`trigger`、`death`。

BuffData 的 30 条实例使用 14 个组名：`trigger` 6 条，`ball` 4 条，`tar` 与
`robots` 各 3 条，`ultskill_watermove`、`laser_target1/2/3` 各 2 条，其余
`ultwater_move`、`swordInst`、`nextTar`、`death`、`ult_death`、`ult_aura` 各 1 条。

组名只是局部 key，不携带 caster/enemy 类型语义；同名组也不能脱离其生产动作推导身份。

## ContextTarget 的四条真实配置

### 莱万汀地牢能力实体

文件：`SkillData/chr_0016_laevat_dung_abilityentity.json`

```text
接收者：Context("tar")
来源：ContextTarget("main_char")
Buff：buff_common_energy_shard_attached_fire
```

- `main_char` 由 `CharacterTeamFinder + MainCharacterValidator` 写入，因此可确认来源是当前
  主控角色；
- `tar` 由 `HitBoxFinder` 写入，因此可确认接收者是该碰撞盒命中的实体集合；
- 仅凭此配置不能证明“当前主控角色必然等于动作 caster”。

### 伊冯普通战技

文件：`SkillData/chr_0017_yvonne_normal_skill.json`

```text
接收者：Source
来源优先级：
1. ContextTarget("smart_target")
2. 若该组无实体，则 InputTarget
3. 若输入目标也无实体，则 ActionSource
Buff：buff_chr_0017_yvonne_normal_skill_projectile
```

这里的优先级由显式 `IfElseAction` 分支给出，不是 `ContextTarget` 自带回退。当前文件只消费
`smart_target`，没有创建该组；全量伊冯 SkillData 中也没有找到写入该组的
`FindTargetAction`。因此可以确认它来自技能启动前已经存在的上下文/目标组传递，但现有证据
不足以断言它一定是敌人。该 key 在连携技里也作为位置中心和方向目标使用，仍不能单凭名字
完成身份证明。

### 卡缪普通战技能力实体

文件：`SkillData/chr_0033_camille_passive_normal_skill_ability_entity.json`

```text
接收者：Context("tar")
来源：ContextTarget("src")
Buff：buff_chr_0033_camille_normal_skill_delay_damage
```

- `tar` 由 `InFightEnemyFinder + TagValidator` 写入，可确认是通过标签校验的战斗中敌人；
- `src` 由 `SourceFinder` 写入，可确认等价于该动作上下文可见的 source；
- 在能力实体链路中，`source` 是否就是最初施法干员，仍取决于实体创建时的来源传递；不能仅凭
  本文件跳过该链路。

### 艾尔黛拉普通战技治疗 Buff

文件：`BuffData/buff_chr_0011_seraph_normal_skill_heal.json`

```text
接收者：Owner
来源：ContextTarget("seraph")
Buff：buff_chr_0011_seraph_mainchr_heal
```

`seraph` 由 `SourceFinder` 在同一事件 Sequence 中先写入，因而可确认它等价于该 Buff 动作的
source。接收者则是当前 Buff owner。将 source 进一步映射为“施法干员”需要保证上游创建该
Buff 时传入的 source 确为艾尔黛拉，不能由组名本身证明。

## Endaxis 单敌人模型中的可映射边界

Endaxis 可以忽略空间选择和多敌人分配，但不能把所有 `Context`/`Target` 无条件折叠成
`enemy`，也不能把所有 `Source` 无条件折叠成 `caster`。

| 原生形状                  | 可有证据映射为 `caster` 的条件             | 可有证据映射为 `enemy` 的条件                               |
| ------------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| 接收者 `Source`           | 当前动作 source 已追溯为施法干员           | 通常不可；除非上游明确把敌人作为 source                     |
| 接收者 `Owner`            | owner 已追溯为施法干员或其自身 Buff holder | owner 已追溯为敌人                                          |
| 接收者 `Target`           | 输入目标明确是己方/自身                    | 输入目标来自该技能的单敌人命中/锁定目标                     |
| 接收者 `Context(key)`     | key 的生产器明确选择施法者/己方            | key 的生产器明确选择敌人；如卡缪样本的 `InFightEnemyFinder` |
| 来源 `ActionSource`       | action source 身份已追溯为施法干员         | action source 已追溯为敌人                                  |
| 来源 `ActionOwner`        | action owner 身份已追溯为施法干员          | action owner 已追溯为敌人                                   |
| 来源 `InputTarget`        | 输入首实体明确是己方/自身                  | 输入首实体明确是技能敌方目标                                |
| 来源 `ContextTarget(key)` | key 的生产器/传递链明确写入施法者          | key 的生产器/传递链明确写入敌人                             |

对四条真实 `ContextTarget` 配置，目前可安全写成：

- 莱万汀 `main_char`：`mainCharacter`，只有当前主控就是施法者时才折叠为 `caster`；
- 伊冯 `smart_target`：身份未知，暂不能静态折叠；
- 卡缪 `src`：`actionSource`，完成能力实体来源链追溯后才能折叠为 `caster`；
- 艾尔黛拉 `seraph`：`actionSource`，完成父 Buff 来源追溯后才能折叠为 `caster`。

接收者方面，卡缪的 `tar` 已有 finder 证据可折叠为单一 `enemy`；莱万汀的 `tar` 是碰撞
命中集合，在 Endaxis“技能命中唯一敌人”的前提下可折叠为 `enemy`。其余配置仍应按各自
上游身份处理。

## 未确认边界

以下内容不能由当前证据闭环，本文不作推测：

1. 伊冯 `smart_target` 在技能启动前由哪一个原生系统写入，以及该组是否在所有释放路径上都
   只包含敌人；
2. 卡缪能力实体的 `ActionSource` 是否在全部生成路径中都保持为卡缪本人；
3. 艾尔黛拉治疗 Buff 的 source 在全部创建路径中是否始终为艾尔黛拉；
4. 多目标组中“第一个”的上游排序规则。已确认 `ContextTarget` 消费当前顺序的首实体，但
   排序可能由 finder、validator 或 post-processor 决定，不能统一解释；
5. 目标实体在解析后、`AddBuffByAbilityAction` 前同帧失效时的对象指针竞态。当前机器码足以
   说明解析时 null 会跳过，但没有运行时样本覆盖解析后失效。

后续若要把这些形状转为 Endaxis DSL，应保存并解析“目标组的生产/传递来源”，而不是只按
`contextKey` 字符串建立命名约定。

## 生成器落地进度

Next 生成器现在把目标组事实拆成两层：

- `targetGroupWrites` 保存 `FindTargetAction`、`ContinuousFindTargetAction` 和
  `MergeTargetAction` 的写入位置、分支路径、选择器摘要与合并输入；
- `targetGroupControlFlowActions` 额外保存仅用于来源证明的条件树。它不进入正式技能调度，
  因而不会把查找目标动作伪装成战斗步骤。

读取 `Context(key)` 时，只有以下两类写入会支配该读取：

1. 写入与读取处在同一条分支路径中，且原生服务器动作序号早于读取；
2. 写入虽然位于更早的条件分支内，但该分支能在 Endaxis 的固定单敌人、零距离模型下严格
   折叠为唯一执行路径。

当前已由这套规则闭环的真实样本包括：

- 诀连携技：`smart_target` 经必经成功分支合并为 `trigger`，后续 Buff 接收者可证明为唯一
  敌人；
- 乌尔夫加德普通战技：同分支中先写入未过滤的 `CharacterTeamFinder` 目标组，再向该组
  施加 Buff，可证明为队伍；
- 深潜者连携技：同分支中先写入未过滤的 `CharacterTeamFinder("team")`，再向该组施加
  Buff，可证明为队伍。

梅尔的 `shieldTar` 刻意没有折叠为 `party`：两条分支分别合并“筛选出的一名队友与自己”或
“主控与自己”，都不是全队集合。召唤物、位置点和带过滤器的实体集合也继续保留为未知，避免
为了提高覆盖率改变实际作用对象。
