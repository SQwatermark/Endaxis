# 游戏规则与研究资料

这里保存带来源与适用范围的研究记录。它们用于解释原生行为和追溯证据，不维护当前任务清单。
实现职责见 [架构](../architecture/README.md)，研究方法见 [开发指南](../development/evidence.md)。

每篇中的缺口、覆盖数量和“当前状态”只代表当时检查。修改规则前核对同版本数据、实际消费者与测试；
记录存在不等于功能已经接入。原始转储及私有文件位置见 [本地环境](../development/local-environment.md)。
机器可读JSON保留原始内容，与对应研究放在同一分类下，不手工修改统计结果。

## 怎么使用

先按问题找记录，再核对版本、来源和未知部分。新结论更新对应主题，不复制到多个路线图。
研究无法证明的部分保持未知，不能按旧版近似或零距离模型擅自补规则。

## 战斗规则、时钟与目标

- [无战斗回调的投射物生命周期](combat/projectile-lifetime-compilation.md)
- [Ability-entity Context target audit](combat/ability-entity-context-target-audit.md)
- [队友目标查询与快照边界（2026-08-28）](combat/character-team-target-snapshots.md)
- [CheckHp 条件的运行时语义](combat/check-hp-condition-runtime-semantics.md)
- [条件分支中的投射物投影缺口](combat/conditional-projectile-projection-gaps.md)
- [Shatter damage decorate mask evidence](combat/damage-decorate-mask-shatter-evidence.md)
- [DoOnceAction 原生运行时语义](combat/do-once-action-runtime-semantics.md)
- [Enemy rank evidence](combat/enemy-rank-evidence.md)
- [处决与下落攻击数据差异](combat/finisher-and-plunging-attacks.md)
- [HitStop 命名曲线配置证据](combat/hit-stop-curve-config.md)
- [`BlackboardDouble.GetValue` 缺键语义（1.4.4）](combat/native-blackboard-double-missing-key.md)
- [原生 Buff 的 ContextTarget 目标解析](combat/native-buff-context-target.md)
- [原生 Buff 时间域](combat/native-buff-time-domain.md)
- [ChannelingAction 原生语义与生成器接入边界](combat/native-channeling-action.md)
- [原生 CheckBuffStackNumByTag 语义审计](combat/native-check-buff-stack-by-tag.md)
- [原生 CheckBuffStackNum 语义审计](combat/native-check-buff-stack-num.md)
- [原生 `CheckTagMatch` 证据盘点](combat/native-check-tag-match.md)
- [原生 EventListenerAction 生命周期](combat/native-event-listener-action-lifecycle.md)
- [原生全局冷却计时器映射](combat/native-global-cooldown-timer.md)
- [原生多段连携机制：洛茜样本](combat/native-multi-stage-combo-skill.md)
- [原生技能事件监听样本](combat/native-skill-event-listener-samples.md)
- [原生技能已输出伤害条件](combat/native-skill-has-output-damage.md)
- [`CheckTargetAngle` 原生语义与 Next 投影边界](combat/native-target-angle-condition.md)
- [原生 TimedMarker 运行时映射](combat/native-timed-marker-runtime.md)
- [嵌套条件投射物的投影所有权](combat/nested-projectile-projection-ownership.md)
- [普通战技消耗对应的终结技能量默认系数](combat/normal-skill-ultimate-energy-defaults.md)
- [四种玩家操作的技能解析与校验](combat/player-action-skill-resolution.md)
- [失衡节点原生语义](combat/poise-knot-runtime-semantics.md)
- [投射物组件证据缺口](combat/projectile-component-evidence-gap.md)
- [投射物回调：事件统一需要保留什么](combat/projectile-event-consumers-2026-09-10.md)
- [根级 TimedMarker 动作盘点](combat/root-timed-marker-actions.md)
- [`CheckSkillCameraMotionFree` 条件盘点（1.4.4）](combat/skill-camera-motion-free-condition.md)
- [标签过滤目标搜索与实体数量条件：莱万汀连携阻塞分析](combat/tag-filtered-target-search-audit.md)
- [Time-dilation curve source evidence](combat/time-dilation-curve-source-evidence.md)
- [时间膨胀槽位与公共曲线配置证据](combat/time-dilation-slot-and-curve-config.md)

## 干员机制

- [Akekuri 连击增伤：GlobalBuff / SkillAffix 证据与 Next 投影](operators/akekuri-combo-imbue.md)
- [诀新版配置证据记录](operators/arcane-next-evidence.md)
- [艾维文娜回收枪：黑板宿主与回调切片](operators/avywenna-return-projectile-blackboard.md)
- [Buff stack effect 与达坂第一天赋证据](operators/buff-stack-effect-and-dapan-talent-evidence.md)
- [管理员冻结交互天赋审计](operators/endministrator-frozen-talents.md)
- [管理员男女技能等价投影](operators/endministrator-gender-skill-equivalence.md)
- [莱万汀火焰附着吸收与减火抗天赋](operators/laevatain-fire-infliction-absorption.md)
- [Last Rite 天赋 1：法术附着消费事件证据](operators/last-rite-consumed-infliction-talent.md)
- [Next 单敌人元素运行时装配缺口](operators/next-elemental-runtime-blockers.md)
- [佩丽卡新版配置证据记录](operators/perlica-next-evidence.md)
- [洛茜 `normal_bleed` 治疗链边界](operators/rossi-normal-bleed-heal-boundary.md)
- [终结技强化普攻的技能组分层](operators/ultimate-enhanced-basic-attack-grouping.md)
- [庄方宜新版配置证据记录](operators/zhuang-fangyi-next-evidence.md)

## 武器、装备与套装

- [Endaxis Next 装备 AKEDB 来源覆盖审计](equipment/equipment-akedb-source-coverage.md)
- [装备常驻战斗修正严格审计](equipment/equipment-battle-persistent-modifier-audit.md)
- [Endaxis 旧武器、装备与套装全量生成审计](equipment/equipment-generation-audit.md)
- [Endaxis Next 装备生成 IR 设计](equipment/equipment-generation-ir-design.md)
- [Endaxis Next 装备生成迁移矩阵](equipment/equipment-generation-migration-matrix.md)
- [Endaxis Next 装备候选定义覆盖报告](equipment/equipment-static-candidate-coverage.md)
- [装备套装来源闭包审计](equipment/equipment-suit-source-closure.md)
- [装备套装静态定义审计](equipment/equipment-suit-static-definitions.md)
- [无元素装备 `dmgBonus` 语义核对](equipment/equipment-unscoped-dmgbonus-semantics.md)
- [新套装与公共全局冷却、爆发 Context 补齐](equipment/spellburst-gear-set-2026-09-03.md)
- [武器目标层数投影与 r3 发布](equipment/weapon-buff-count-r3.md)
- [武器反应光环：目标侧前置事件与监听器来源](equipment/weapon-reaction-aura-branches.md)

## 数据生成与来源审计

- [全干员 Next 生成可行性普查](generation/all-operator-generation-audit.md)
- [全干员 Skill/Buff 递归机制普查](generation/all-operator-recursive-mechanism-audit.md)
- [GameplayTag 完整配置集恢复（2026-08-28）](generation/gameplay-tag-config-set.md)
- [新版完整标签与装备重建（2026-09-03）](generation/gameplay-tag-refresh-2026-09-03.md)
- [干员养成通用转换优先级](generation/operator-progression-conversion-priorities.md)
- [干员养成属性运行时闭环缺口](generation/operator-progression-runtime-closure-gaps.md)
- [新旧干员来源差异：2026-09-03 交付检查点](generation/operator-refresh-differences-2026-09-03.md)
- [干员潜能静态属性转换审计](generation/operator-static-attribute-potential-audit.md)
- [当前全部干员模板刷新检查点](generation/operator-template-refresh-2026-09-03.md)
- [天赋阵列属性节点审计](generation/trust-attribute-bonus-audit.md)
- [VFS-only 来源刷新实机验证（2026-09-03）](generation/vfs-only-refresh-2026-09-03.md)

## 界面显示与可观测性

- [非 Buff 状态与能力实体的状态栏展示边界](display/ability-entity-status-display.md)
- [战斗 HUD 状态与 Endaxis 状态栏整合](display/combat-hud-state-integration.md)
- [固定木桩的倒地／起身可观察边界（2026-08-28）](display/control-state-observability.md)
- [GameplayTag 与引用编辑面审计](display/gameplay-tag-reference-ui-audit.md)
