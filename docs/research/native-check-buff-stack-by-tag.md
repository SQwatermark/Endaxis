# 原生 CheckBuffStackNumByTag 语义审计

## 1. 范围与结论

本文只研究 1.4.4 客户端中的
`Beyond.Gameplay.Core.Conditions.CheckBuffStackNumByTag`，不把结论直接接入 Endaxis Next
运行时或干员生成器。

该条件的已确认执行流程是：

1. 按 `checkTarget` 从本次动作输入的 `TargetHandleView` 中取得首个 `AbilitySystem`；
2. 若目标是不能直接附加 Buff 的敌人部位，则将它替换为可承载 Buff 的主体；
3. `BuffCount` 按标签查询匹配 Buff，并累加每个未结束实例的增强层数；
4. `BuffIdCount` 按同一标签查询统计不同 Buff ID 的数量；
5. 将有符号 32 位整数计数转换为单精度浮点数，与执行时解析出的 `BlackboardDouble value`
   按 `compareType` 和 `1e-5f` 容差比较；比较结果就是动作返回值。

找不到首个目标时直接返回 `false`，不会把计数视为 `0` 后继续比较。条件返回类型是
`CustomReturnType`，所以 `false` 可作为所在条件序列的可观察失败结果，并由外层
`IfElseAction` 或 `SequenceAction` 决定分支或截断。

## 2. 证据

### 2.1 静态元数据与运行时机器码

静态元数据：

- 类型：`Beyond.Gameplay.Core.Conditions.CheckBuffStackNumByTag`；
- `ExecuteInternal(TargetHandleView)`：token `0x60157BF`，RVA `0x0718EB58`；
- `get_executeReturnType`：token `0x60157BE`，RVA `0x0718ED0C`。

来源：

- `combat-runtime-dumps/1.4.4/static/Gameplay.Beyond.dll.cs`；
- `combat-runtime-dumps/1.4.4/runtime-1/IL2CPP_MethodProbes.runtime-1.json`；
- `combat-runtime-dumps/1.4.4/runtime-1/runtime-1-full.analysis.json`。

`ExecuteInternal` 的未打补丁路径给出以下字段和调用顺序：

| Data 偏移 | 字段               | 机器码用途                                              |
| --------- | ------------------ | ------------------------------------------------------- |
| `+0x20`   | `checkTarget`      | 传入 `AbilityActionUtils.GetFirstTarget`                |
| `+0x28`   | `tagQuery`         | 复制后传入标签计数方法                                  |
| `+0x38`   | `buffStackNumType` | 在 `0` 与 `1` 两条计数分支之间选择                      |
| `+0x3C`   | `compareType`      | 传入最终浮点比较函数                                    |
| `+0x40`   | `value`            | 通过 `ActionBlackboardExtensions.GetValue` 在执行时求值 |

关键调用为：

```text
AbilityActionUtils.GetFirstTarget
AbilitySystemUtils.ResolvePartBuffSource
AbilitySystem.GetBuffCountByTag
AbilitySystem.GetBuffIdCountByTag
ActionBlackboardExtensions.GetValue
MathUtils 浮点比较入口
```

机器码将 `buffStackNumType` 与 `0`、`1` 逐一比较。未知枚举值会令局部计数保持 `0`，
随后仍进入正常比较；它不会在这个方法内抛出“不支持枚举”错误。两种计数调用的
`limitSkillCastId` 参数均为空，因此该条件统计目标上所有来源施法实例的匹配 Buff。

`get_executeReturnType` 的未打补丁路径返回枚举值 `0`，对应
`AbilityAction.ExecuteReturnType.CustomReturnType`。

### 2.2 与容器方法的交叉证据

本地 `combat-spec` 已根据相同版本的容器机器码恢复：

- `GetBuffCountByTag` 遍历尚未结束且 `BuffData.applyTags` 满足查询的 Buff 实例，累加
  `m_enhanceCnt`；使用 32 位整数累加，溢出按补码回绕；
- `GetBuffIdCountByTag` 对同样的匹配集合按 Buff ID 去重，同一 ID 的多个实例或多个增强层
  只计一次；
- 两种方法都把 `GameplayTagQuery` 当作每个 Buff 的布尔筛选器，而不是按查询标签逐项累加。

来源：

- `combat-spec/docs/save-buff-stack-num-advanced.md`；
- `combat-spec/docs/gameplay-tags.md`；
- `combat-spec/src/EndfieldCombatSpec.Core/Runtime/AbilitySystem.cs`；
- `combat-spec/src/EndfieldCombatSpec.Core/Runtime/GameplayTags.cs`；
- `combat-runtime-dumps/1.4.4/runtime-1/get-buff-count-by-tag.analysis.json`。

## 3. HasAny 多标签如何计数

`HasAny([A, B])` 的含义是：对每个 Buff 的 `applyTags` 判断“是否含有 A 或 B 中任一标签”。
只要命中一个标签，该 Buff 就进入匹配集合；之后按所选 `buffStackNumType` 对这个 Buff
计数一次。由此可得：

- 同一个 Buff 同时具有 A 和 B，不会被计两次；
- 两个 Buff 分别命中 A 和 B，会作为两个匹配 Buff 参与聚合；
- `BuffCount` 加的是各匹配实例的增强层数，不是命中的查询标签数量；
- `BuffIdCount` 加的是匹配集合中的不同 Buff ID 数量。

这由调用结构直接限定：`CheckBuffStackNumByTag` 只调用一次容器计数方法；容器对每个 Buff
只调用一次 `MatchesQuery`，而 `HasAny` 在第一个匹配标签处短路并返回布尔值。

## 4. 真实 SkillData 盘点

对 `combat-spec/artifacts/SkillData` 中 612 个 JSON 进行递归扫描，共发现 18 个条件实例，
分布在 5 个文件中。`artifacts/skill-data-cdn` 的现有 605 个文件得到相同的 18 个实例。

| 文件                                        | 数量 |
| ------------------------------------------- | ---: |
| `chr_0015_lifeng_normal_skill.json`         |    1 |
| `chr_0017_yvonne_normal_skill_projhit.json` |    4 |
| `chr_0024_deepfin_normal_skill.json`        |    1 |
| `chr_0028_wulfa_combo_1_skill.json`         |    4 |
| `chr_0028_wulfa_combo_3_skill.json`         |    8 |

字段分布：

| 字段                         | 真实取值                                |
| ---------------------------- | --------------------------------------- |
| `isEnable`                   | 18 个均为 `true`                        |
| `tagQuery.queryType`         | 18 个均为 `HasAny`                      |
| 标签数                       | 16 个单标签，2 个双标签                 |
| `buffStackNumType`           | 18 个均为 `BuffCount`                   |
| `compareType`                | 17 个 `GE`，1 个 `LE`                   |
| `value`                      | 17 个字面量 `1.0`；1 个读取黑板键 `num` |
| `checkTarget.targetSource`   | 18 个均为 `Target`                      |
| `checkTarget.targetGroupKey` | 17 个空字符串；1 个为 `tar`             |

两份双标签样本都来自伊冯的投射物命中技能，查询标签为
`[1570888476, -1411846745]`。这两个样本应按“任一标签命中后计该 Buff 一次”解释，
不能把两个标签分别计数后相加。

虽然当前 18 个 `CheckBuffStackNumByTag` 样本没有使用 `BuffIdCount`，该方法的机器码确实
包含 `buffStackNumType == 1` 分支并调用 `GetBuffIdCountByTag`。此外真实
`CheckBuffStackNumAdvanced` 数据中存在 `Tag + BuffIdCount` 样本，因此它不是废弃枚举。

## 5. Target 与 targetGroupKey 的身份

18 个实例的 `targetSource` 均为 `Target`。根据 `AbilityActionUtils.GetFirstTarget` 与已有
`TargetSettings` 机器码审计，这表示：

- 读取本次条件动作收到的 `TargetHandleView`；
- 只取其中第一个能够解析为 `AbilitySystem` 的目标；
- 不遍历或聚合目标组中的其他实体；
- 不读取 `hitReactionInfos`；
- 找不到首目标时直接返回 `false`。

`targetGroupKey` 只有在 `targetSource=Context` 时才用于从动作环境读取命名目标组。因此
Deepfin 样本中虽配置了 `targetGroupKey="tar"`，本条件仍读取当前输入 `Target`，`tar` 不参与
目标解析。18 个配置里的 `target="ActionSource"`、selector 和方向字段同样只服务于
`InstantSearch`，在 `targetSource=Target` 分支不参与执行。

这些实例位于投射物命中、周期命中或技能命中产生的条件链中；从形式语义上只能将目标认定为
“外层动作传入的首个目标”。它在当前样本里通常是受击敌人，但不能仅凭
`CheckBuffStackNumByTag` 自身把 `Target` 永久定义成“敌人”。

## 6. 比较与返回值

计数完成后执行：

```text
countFloat = float32(signedInt32Count)
expected = value.Resolve(actionBlackboard)
return Compare(countFloat, expected, compareType, 1e-5f)
```

因此：

- 黑板值在条件实际执行时读取，不是适配或创建动作时冻结的快照；
- 大整数转换为 `float32` 时可能损失精度；
- 未知 `buffStackNumType` 会以计数 `0` 进入比较；
- 有目标但没有匹配 Buff 时同样以 `0` 进入比较；
- 无目标则提前返回 `false`，即使 `0` 与配置值本可比较成功也不会执行比较；
- 返回 `false` 时，外层条件序列能够据此选择失败分支或停止后续动作。

## 7. 尚未闭环的边界

以下内容不能由当前真实样本完整证明：

1. 当前 SkillData 没有 `CheckBuffStackNumByTag + BuffIdCount` 实例；该分支语义来自本方法机器码、
   容器方法和其他原生 Tag 计数动作的交叉证据。
2. 当前样本只使用 `HasAny`，不能据此声称生产数据会采用 `HasAll`、`ExceptAny` 或
   `ExceptAll`；这些 queryType 的通用行为由独立 `GameplayTagQuery` 证据确认。
3. 标签整数对应的完整名称树尚未全部恢复；本文只研究匹配和计数，不为这些整数猜测术语名。
4. IFix 热补丁存在时会转入补丁包装器；当前结论针对 1.4.4 快照中
   `IsPatched(0xF26C) == false` 的原生路径，尚无证据证明线上补丁改变或未改变了该方法。
5. `Target` 在每个外层命中动作中的具体游戏实体身份需继续沿各调用点向上追踪；本条件本身只保证
   “传入目标句柄的首个 AbilitySystem”。
