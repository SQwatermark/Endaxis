# 诀新版配置证据记录

本文审计 `src/next/data/operators/arcane.ts` 的来源与当前边界。正式配置只保存 Endaxis 可执行的
业务语义；原始 SkillData、Buff ID、Blackboard 键和实现事件名只记录在本文。

## 版本与来源

- 解包版本：VFS 与 AKEDB `1.4.4@8764515-7`。
- SkillData：`chr_0032_lizhiyan_*`。
- BuffData：`buff_chr_0032_lizhiyan_*`。
- 表数据：`CharGrowthTable`、`SkillPatchTable`、`PotentialTalentEffectTable`、
  `SkillConditionTable`。
- 反编译研究：`vfs-index-browser/combat-spec/docs/arcane-form-selection.md`。
- 旧版 `src/data/operators/arcane.ts` 只用于结果差异审计，不作为证据来源。

可信度沿用佩丽卡文档中的 `exact`、`derived`、`curated` 定义。

## 双形态

| 正式语义                 | 可信度  | 原始依据                                   |
| ------------------------ | ------- | ------------------------------------------ |
| 智识 `>=` 意志时为智形态 | exact   | 被动的 `CompareDeckAttr(Wisd GE Will)`     |
| 智识 `<` 意志时为意形态  | exact   | 同一 `IfElseAction` 的失败分支             |
| 构筑属性变化后刷新形态   | exact   | `OnCharDeckAttrChanged`                    |
| 形态不进入存档           | derived | 原始状态由 Deck 属性快照派生，不是独立输入 |

正式配置使用 `deckAttributesChanged`、`deckAttributeCompare` 和 `arcaneForm` 上下文标志表达这条
链路。战技、连携技和终结技仍各自只有一个稳定技能身份，形态分支位于其行为序列内部；
`presentationVariants` 只选择名称、描述和图标。

## 普攻、处决与下落攻击

- 五段普攻逐 hit 倍率来自 `SkillPatchTable` 的 `atk_scale`，命中数量与执行帧来自各段
  `DamageAction` 行为图。第四段为八次命中，第五段同一命中内包含生命伤害、`17` 失衡和
  `17` 团队技力恢复。
- `durationFrames` 当前采用各 SkillData 的 `exclusiveFrame`。它是当前最明确的动作互斥边界，
  但仍需用完整输入衔接测试确认它是否等同于编辑器块时长，因此这一组时长为 `curated`。
- 处决伤害倍率来自 `chr_0032_lizhiyan_power_attack` 的最终 Patch；伤害后紧跟
  `GainBreakingAttackAtb(factor = 1)`，实际恢复量读取敌人 `breakingAttackedAtbObtain`。
- 下落攻击只记录落地技能 `chr_0032_lizhiyan_plunging_attack_end`；空中移动不属于技能块。

## 战技与连携技

战技先施加自然附着，再按形态选择伤害倍率，最后执行按技力消耗获得终结技能量的行为。智形态
倍率为 `atk_scale_wisd`，意形态为 `atk_scale_will`，两者均造成 `10` 失衡。

连携窗口来自原始条件图：

1. 智形态施加自然附着时直接开启；
2. 智形态施加其他法术附着时，要求对应附着已有至少两层；
3. 意形态施加任意法术附着时开启。

连携命中先施加封印和自然/寒冷易伤，再造成伤害并回复 `10` 终结技能量。智形态封印持续
`4` 秒；意形态持续 `6` 秒，易伤额外按意志缩放并受等级上限约束。封印自然到期和被主动消耗
是两个不同事件，都会执行结束伤害。智形态战技命中封印目标还会提前引爆、返还技力并触发五段
追加攻击；正式配置将这些行为保留为连携技能自己的事件处理器。

## 终结技循环

| 行为                       | 可信度        | 正式配置                                 |
| -------------------------- | ------------- | ---------------------------------------- |
| 首次命中在第 `47` 帧       | exact         | 第 47 帧、仅在未就绪时执行的序列         |
| 强化持续 `20` 秒           | exact         | `gloompurgerArray`，600 帧               |
| 强化期间禁止终结技能量恢复 | exact         | 状态的 `blockResourceGain` 修正          |
| 初始拥有两层追击计数       | exact         | `clusterStrikeCounter` 两层              |
| 普攻末段或处决各消耗一层   | exact         | 两个团队范围 `damageTagHit` 监听器       |
| 每次消耗触发四段追击       | exact/derived | 四条延迟伤害序列；倍率为总倍率的 `1/8`   |
| 两层耗尽后允许免费二次释放 | exact         | `gloompurgeArcanaReady` 的费用与冷却修正 |
| 二次命中在第 `58` 帧       | exact         | 第 58 帧、仅在就绪时执行的序列           |

智形态首次释放施加腐蚀；意形态重新施加目标当前已有的四类法术附着。二次释放按形态选择
`atk_scale` 或 `atk_scale_will`，随后消耗就绪状态与强化状态。强化自然结束时清理剩余计数和
二次释放资格。

## 天赋与潜能

- 天赋 1：智形态连携冷却缩短 `6` 秒，并在强化期间获得伤害加成；意形态终结技命中后按意志施加自然/寒冷易伤。
- 天赋 2：增加腐蚀持续时间与效果倍率。
- 潜能 1：连携相关伤害乘 `1.3`。此外还存在智形态引爆返还技力 `+10`、意形态易伤基础值和
  上限各 `+6%`；后两项尚未写入正式配置，等待确定通用的“升级修改状态步骤参数”结构。
- 潜能 2：智识和意志各 `+15`，法术强度 `+16`。
- 潜能 3：天赋 2 的腐蚀持续时间再加 `5` 秒、效果倍率再加 `0.2`。
- 潜能 4：两阶段终结技能量消耗乘 `0.85`。
- 潜能 5：补强形态天赋；二次终结技伤害乘 `1.3`，冷却缩短 `30%`。

## 尚未闭环

1. 潜能 1 两条分形态参数修改的通用升级结构。
2. 普攻投射物发射到命中的动态飞行时间；当前帧来自动作图中的伤害/发射节点。
3. 连携封印对象在多敌人场景中的选择、弹射和目标组传播；Endaxis 当前为单敌人模型。
4. `exclusiveFrame` 与用户实际可衔接输入边界的全角色通用关系。
5. 编译器与模拟器尚未实现新增的状态、复合条件、事件处理器和升级修正；本轮完成的是有证据的
   配置与类型模型，不代表现有 `/timeline` 已能执行它。
