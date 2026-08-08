# 原生 `CheckTagMatch` 证据盘点

## 研究范围

本文只研究 1.4.4 原生 `Beyond.Gameplay.Core.Conditions.CheckTagMatch`，回答以下问题：

- 动作从哪里取得目标；
- 被检查的标签来自哪里；
- 标签查询有哪些匹配模式；
- 没有目标、目标失效或没有标签时如何返回；
- 返回值如何影响外层动作；
- 当前本地全量 `SkillData` 中存在哪些真实配置形状。

本文不修改 Endaxis Next 运行时、干员生成器或全干员审计，也不把尚未恢复名称的 `tagId` 猜成具体游戏概念。

## 证据来源

### 静态与机器码

- `../combat-runtime-dumps/1.4.4/static/Gameplay.Beyond.dll.cs`
  - `CheckTagMatch.ExecuteInternal(TargetHandleView)`：token `0x6015879`，静态 RVA `0x03551D30`；
  - `CheckTagMatch.executeReturnType`：静态 RVA `0x041EB140`；
  - `TargetSettings` 字段布局；
  - `BaseComponent.entity` 位于 `0x50`，`Entity.m_tagContainer` 位于 `0x68`；
  - `GameplayTagContainer.MatchesQuery` 的四种查询入口。
- `../combat-runtime-dumps/1.4.4/runtime-1/check-tag-match.analysis.json`
  - `ExecuteInternal` 的 188 条可达指令；
  - `AbilityActionUtils.GetTargetsView` 与 `BattleTargetWrapper.Lock` 的直接调用；
  - 目标逆序遍历、短路和返回分支。
- `../combat-runtime-dumps/1.4.4/runtime-1/IL2CPP_MethodProbes.runtime-1.json`
  - 未热更的 `executeReturnType` getter 直接返回 `0`，对应 `CustomReturnType`。

### 已有规格实现

- `../vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Runtime/DamageConditions.cs`
- `../vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Runtime/TargetResolution.cs`
- `../vfs-index-browser/combat-spec/src/EndfieldCombatSpec.Core/Runtime/GameplayTags.cs`
- `../vfs-index-browser/combat-spec/docs/gameplay-tags.md`

这些文件用于交叉核对已恢复的目标解析与标签容器语义；结论仍以原生静态布局和机器码为边界。

### 真实数据盘点

对 combat-spec 本地资源进行了递归扫描：

| 数据集                           | 扫描文件数 | `CheckTagMatch` 实例数 | 涉及文件数 |
| -------------------------------- | ---------: | ---------------------: | ---------: |
| `artifacts/SkillData`            |        612 |                     26 |         18 |
| `artifacts/BuffData`（交叉验证） |        529 |                     20 |         12 |

BuffData 不计入“全量 SkillData”的 26 项结果，仅用于确认 SkillData 未覆盖的查询模式和禁用配置形状。

## 数据结构

全部 46 个真实实例都只有以下字段，未发现额外变体：

```json
{
  "$type": "Beyond.Gameplay.Core.Conditions.CheckTagMatch+Data, Gameplay.Beyond",
  "isEnable": true,
  "priorityLevel": "Default",
  "priorityOffset": 0,
  "serverActionIndex": 0,
  "checkTarget": { "...": "TargetSettings" },
  "query": {
    "queryType": "HasAny",
    "tags": [{ "tagId": 969179177 }]
  }
}
```

其中：

- `checkTarget` 是完整 `TargetSettings`，不是单个目标枚举；
- `query` 是 `GameplayTagQuery`，只含 `queryType` 与有序 `tags`；
- 动作本身没有数值比较符、比较值、黑板写入键或“精确匹配”开关；
- 全部 SkillData 实例均为 `isEnable=true`；BuffData 中有 1 个 `isEnable=false` 实例。

## 目标读取语义

`ExecuteInternal` 的已确认流程如下：

1. 从动作数据读取 `checkTarget`。
2. 调用 `AbilityActionUtils.GetTargetsView(curAction, checkTarget, inputTarget)`，因此目标来源完全服从公共 `TargetSettings` 解析。
3. 若返回视图为空，立即返回 `false`。
4. 从 `Count - 1` 到 `0` 逆序遍历视图中的 `BattleTargetWrapper`。
5. 对每项调用 `BattleTargetWrapper.Lock()`；无法锁定为 `AbilitySystem` 的失效项被跳过。
6. 从该 `AbilitySystem` 的基类字段 `BaseComponent.entity` 取得目标实体，再对实体标签执行 `query`。
7. 任一有效目标匹配便立即返回 `true`；否则继续前一项，遍历结束返回 `false`。

可以写成等价伪代码：

```text
targets = GetTargetsView(action, data.checkTarget, inputTarget)
for index = targets.count - 1 downTo 0:
    abilitySystem = targets[index].Lock()
    if abilitySystem is valid and abilitySystem.entity.MatchesQuery(data.query):
        return true
return false
```

### SkillData 中的目标来源

| `targetSource` | 实例数 | 读取含义                                     |
| -------------- | -----: | -------------------------------------------- |
| `Target`       |     13 | 当前动作收到的输入目标视图。                 |
| `Context`      |     10 | 从动作上下文按 `targetGroupKey` 读取目标组。 |
| `Source`       |      2 | 动作来源实体。                               |
| `Owner`        |      1 | 动作所有者实体。                             |

SkillData 中出现的 `targetGroupKey` 为：空字符串 11 项、`smart_target` 6 项、`highlight_smart_target` 5 项、`tar` 4 项。公共目标解析只在 `targetSource=Context` 时使用上下文组键；真实数据也会在 `Target` 配置中保留非空组键，但当前机器码没有证据表明该键会改变 `Target` 的输入视图语义。

### 无目标与失效目标

- 目标视图为空：返回 `false`。
- 视图内只有无法 `Lock()` 的失效项：全部跳过，最终返回 `false`。
- 部分失效、部分有效：只检查有效目标。
- 多目标：逆序检查，任一匹配即成功；因此返回布尔值不依赖目标顺序，但短路时实际首先访问的是最后一个目标。

“无目标”不能等价为“拿一个空标签容器执行查询”。例如 `ExceptAny` 对一个有效但不带所列标签的实体可返回 `true`，而完全没有有效目标时仍返回 `false`。

## 标签来源

机器码先把 wrapper 锁定为 `AbilitySystem`，再读取其 `BaseComponent.entity`（基类偏移 `0x50`），并把配置中的 `GameplayTagQuery` 传给实体标签查询。因此 `CheckTagMatch` 检查的是**目标实体当前持有的 GameplayTag 容器**。

这不是以下数据的直接查询：

- Buff 实例数量或层数；
- `BuffData.id`；
- `BuffData.applyTags` 列表本身；
- 技能、伤害包或动作上的普通字符串标签。

Buff 生命周期可以把 `applyTags` 或扩展标签注册到所属实体，因此 Buff 可能**间接**改变实体标签查询结果；但 `CheckTagMatch` 本身不枚举 Buff，也不聚合 Buff 层数。

## 匹配模式

原生 `GameplayTagContainer.MatchesQuery` 已恢复四种 `queryType`：

| 模式        | 语义                                 | 空 `tags` |
| ----------- | ------------------------------------ | --------- |
| `HasAny`    | 至少一个查询标签被目标容器非精确匹配 | `false`   |
| `HasAll`    | 所有查询标签都被目标容器非精确匹配   | `true`    |
| `ExceptAny` | `!HasAny`                            | `true`    |
| `ExceptAll` | `!HasAll`                            | `false`   |

这里的“非精确匹配”会使用标签树父级：实体持有一个子标签时，可以匹配已注册的有效祖先标签。`CheckTagMatch` 没有配置精确匹配的字段，也没有调用 `HasTagExact` 的证据。

真实数据分布如下：

| 数据集    | `HasAny` | `HasAll` | `ExceptAny` | `ExceptAll` |
| --------- | -------: | -------: | ----------: | ----------: |
| SkillData |       25 |        0 |           1 |           0 |
| BuffData  |       12 |        1 |           7 |           0 |

SkillData 的标签数量为：单标签 18 项、双标签 7 项、三标签 1 项；没有空标签查询。BuffData 还出现了一个八标签 `ExceptAny`，同样没有空标签查询。

## 返回值与外层控制流

`executeReturnType` getter 的未热更路径返回枚举值 `0`，即 `CustomReturnType`。因此动作对外返回的就是 `ExecuteInternal` 的匹配结果，而不是固定真或固定假。

可确认的影响是：

- 放在 `SequenceAction` 中时，`false` 会按公共序列策略使后续条件链短路；
- 放在 `IfElse` 或带 `succeedActions` / `failActions` 的动作中时，匹配结果决定所走分支；
- 放在 DamageModifier 条件中时，只有返回 `true` 才执行对应处理器；
- 动作本身只检查并返回，不修改标签、目标组或黑板。

`isEnable=false` 属于公共 AbilityAction 的禁用语义，不是 `CheckTagMatch.ExecuteInternal` 内部的一种匹配模式。BuffData 的唯一禁用实例位于 `buff_chr_0017_yvonne_combo_skill_finish.json`；执行器应在进入本方法前跳过它，不能把其查询结果解释为真或假。

## 全量 SkillData 实例形状

### 所在上下文

| 上下文                    | 实例数 |
| ------------------------- | -----: |
| `timelineActions`         |     19 |
| `skillHighlightCondition` |      5 |
| `passiveEventActions`     |      2 |

### 目标与查询组合

| `targetSource` | `targetGroupKey`         | `queryType` | 标签数 | 实例数 |
| -------------- | ------------------------ | ----------- | -----: | -----: |
| `Target`       | 空                       | `HasAny`    |      1 |      7 |
| `Target`       | `tar`                    | `HasAny`    |      1 |      4 |
| `Context`      | `smart_target`           | `HasAny`    |      2 |      3 |
| `Context`      | `highlight_smart_target` | `HasAny`    |      1 |      3 |
| `Context`      | `highlight_smart_target` | `HasAny`    |      2 |      2 |
| `Context`      | `smart_target`           | `HasAny`    |      1 |      2 |
| `Target`       | `smart_target`           | `HasAny`    |      2 |      1 |
| `Target`       | 空                       | `HasAny`    |      2 |      1 |
| `Source`       | 空                       | `HasAny`    |      1 |      1 |
| `Owner`        | 空                       | `HasAny`    |      1 |      1 |
| `Source`       | 空                       | `ExceptAny` |      3 |      1 |

### 涉及文件

| 文件                                                | 实例数 |
| --------------------------------------------------- | -----: |
| `chr_0004_pelica_combo_skill_projhit.json`          |      1 |
| `chr_0006_wolfgd_normal_skill.json`                 |      2 |
| `chr_0006_wolfgd_normal_skill_plus_projhit.json`    |      3 |
| `chr_0007_ikut_normal_skill.json`                   |      3 |
| `chr_0007_ikut_ultimate_skill_abentity.json`        |      1 |
| `chr_0011_seraph_combo_skill_projhit.json`          |      1 |
| `chr_0011_seraph_extra_attack_projhit.json`         |      1 |
| `chr_0017_yvonne_normal_skill.json`                 |      1 |
| `chr_0021_whiten_combo_skill.json`                  |      1 |
| `chr_0021_whiten_ultimate_skill.json`               |      1 |
| `chr_0024_deepfin_normal_skill.json`                |      1 |
| `chr_0025_ardelia_normal_skill.json`                |      1 |
| `chr_0028_wulfa_normal_skill.json`                  |      1 |
| `chr_0028_wulfa_ultimate_skill.json`                |      2 |
| `chr_0030_zhuangfy_talent2.json`                    |      1 |
| `chr_0033_camille_combo_skill.json`                 |      3 |
| `chr_0033_camille_combo_skill_2.json`               |      1 |
| `chr_0033_camille_passive_listen_normal_skill.json` |      1 |

唯一的 SkillData `ExceptAny` 实例位于庄方宜天赋二，目标为 `Source`，查询 3 个标签。它证明 `CheckTagMatch` 不只用于检查敌方目标状态，也可检查动作来源自身的实体标签。

## 已确认结论

1. `CheckTagMatch` 是“目标实体 GameplayTag 查询”，不是 Buff 计数查询。
2. 目标由公共 `TargetSettings` 解析，可得到一个或多个 wrapper。
3. 原生从目标视图末项向前遍历，失效 wrapper 被跳过，任一有效目标命中即返回 `true`。
4. 没有有效目标时恒为 `false`，即使查询类型本身是取反模式。
5. 匹配使用 `GameplayTagContainer` 的非精确父级匹配和四种查询模式。
6. 返回类型是 `CustomReturnType`，匹配布尔值直接参与外层序列、分支或 Modifier 条件控制。
7. 动作没有副作用，不写黑板、不改目标组，也不消费标签。

## 未闭环边界

- 当前本地数据尚未恢复全部 `tagId -> 完整标签路径` 映射。本文只记录整数 ID 和结构，不给未知 ID 命名。
- `GetTargetsView` 的所有 `InstantSearch`、`MainCharacter`、`MainTarget` 分支属于公共目标系统；本次全量 SkillData 的真实 `CheckTagMatch` 未使用这些来源，因此本文不声称它们已由本动作样本验证。
- 真实实例没有空 `tags`、`ExceptAll`，SkillData 也没有 `HasAll`；这些模式的语义来自已单独恢复的原生标签容器，而不是本批实例的动态观察。
- 多目标逆序遍历已经由机器码确认，但由于结果只返回布尔值且动作无副作用，当前没有真实样本能观察“首先命中了哪一个目标”。
- IFix 热更入口存在；本文描述的是 1.4.4 dump 中未命中热更补丁时的原生路径，没有证据证明线上补丁改写了该方法。
