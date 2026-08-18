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

## 生成审计现状（1.4.4@9433094-12）

当前生成清单以 `outputStage: audit` 收录 Arcane 的连携、五段普攻、处决、下落攻击、战技和
两个原生终结技入口，共 11 个技能。严格技能序列均可编译，并生成
`arcane.generated.ts`、`arcane.audit.json` 与 `arcane.skills.audit.generated.ts`；这些文件只用于
逐项对照，不是正式 `OperatorDefinition`，也没有替换本文件审计的手写定义。

正式生成仍有四条相互独立的证据/实现缺口：

1. 连携封印 Buff 的 `DuringBuffEnable` 含 `ForEachAction`：它以 Buff 的 `ActionSource` 为 owner，
   用 `OwnerSpawnedEntityFinder(AbilityEntity)`、标签 `-1480463572` 与
   `SkillCastIdValidator` 找到同次施法的封印实体，再逐个向当前 `Target` 施加
   `buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect` 和
   `..._effect_line`。同 Buff 的 `OnBuffTrigger` 则先把同类实体写入 `bunshin`，再逐个以实体为
   caster 释放 `chr_0032_lizhiyan_combo_skill_abilityentity_end`。审计模型已新增“集合身份 + 循环体”
   事实，并进一步确认
   `OnOwnerDead`、`OnBeforePartDisable` 也执行同一实体结束技能；22 个关联 Buff 定义均已解析，
   `buffDefinitionResolutionIssues` 已消失。生成期现能把标签降为明确封印实体 ID，运行时实体
   保存来源施法序号，Buff 生命周期也有独立目标 Context；两个子 Buff 只有表现事件，可严格
   省略。结束子技能仍包含定时标记门、伤害、监听 Buff、Buff 结束和实体结束。监听 Buff 的
   `OnBeforeTakeDamage` 同步树现完整保留为：`isWisd >= 1`、`DamageDecorateMask HasAll 256`
   （既有枚举证据为 `normalSkill`）、`Target == Source`，随后依次返还 ATB、把 HitBox 目标写入
   `tar`、以 `Source` 为攻击者中断 `Context/tar`（`overrideSuperArmorLimit=-1`、
   `immobilizedTime=1`）、造成伤害并结束 Buff。生成器不再丢失目标查找与中断叶。1.4.4 原生
   `SequenceAction.Init` 与元数据现已证明事件序列优先级取首个启用动作的
   `priorityLevel + priorityOffset`，枚举为 `Low=-100 / Default=0 / High=100`；本监听精确为 `0`。
   `TriggerEvent` 又证明 `OnBeforeTakeDamage` 的动作 `Target` 是事件上下文中的
   `Modifier.source`（本次伤害攻击者），而 Buff 动作 `Source` 是 Buff 来源，因此这里的等价检查
   精确表示“伤害来源等于创建 Buff 的能力实体”。Next 已有按 Buff 实例启停的承伤订阅、事件
   tags/features 与来源身份条件。当前模拟器没有敌方主动技能、红圈可打断状态或行动时间线，
   因此 `InterruptAction` 在模型内没有可观察效果；原生又证明该动作恒返回成功，生成器现保留
   完整审计载荷并将其归约为空序列。剩余硬阻塞是把事件响应正式接入 Buff 生成编译链，以及
   严格闭环两个 `FinishBuffAdvanced` 的 Owner/Environment 查询语义。
2. 四个形态相关技能直接读取实体动作黑板 `EntityBB_wisd_greater_will`。当前场景装配没有从
   已解析面板属性向技能实例写入该键的通用桥；旧手写定义中的 `deckAttributesChanged`
   事件处理器也尚未被编译/运行时装配消费，不能把它当作已经存在的桥。
3. 原始数据把首次终结技和二次终结技保存为两个技能资源，而手写定义对外保持一个稳定技能
   身份并根据强化/就绪状态选择阶段。生成目录尚无证据完备的状态选择与注册策略，不能把两个
   原生入口都作为可自由排入的独立终结技。
4. `presentationVariants`、形态感知连携注册、天赋和潜能的行为仍需逐项与手写定义及原始数据
   对照；11/11 只证明技能主体通过严格编译，不证明干员级形态、养成和展示语义完整。
