# Extract / Exclude 全量位置清单（2026-09-09）

配套 [整改计划](extract-exclude-remediation-plan.md)。这是当前工作树快照（基于 80824edc，包含本机未提交事件整改），不是缺陷数量。

扫描 1974 个 Git 已跟踪及非忽略未跟踪的 TS/TSX/MTS/CTS/Vue 文件；Vue 只解析 script 块。
TypeScript AST 中识别 281 个 TypeReference：Extract 255、Exclude 26，分布于 114 文件。
嵌套引用分别计数；不把注释、字符串、生成器测试文本算作类型使用。忽略的 tmp、依赖、构建输出不纳入。

每项拥有独立编号、原始位置、完整类型表达式及归属工作包。A/B/C/D 为优先语义审查；E/F/G/T 是已完成位置初筛、实施前仍须逐项确认的候选，不宣称每处都读完所有调用链或都必须删除。
位置行号随修改会变化，复核时同时按文件、拥有者和表达式定位。

## A：事件协议与宿主能力范围（15 处）

P0：随统一事件协议审查；区分原生方向/阶段与实现白名单，禁止各宿主独立裁剪。

| 编号 | 位置 | 拥有者 | 当前表达式 |
| --- | --- | --- | --- |
| XE-008 | [packages/game-data-contract/src/operators.ts:217](../../packages/game-data-contract/src/operators.ts#L217) | `UpgradeEvent` | `Extract<CombatEventTrigger, { kind: 'spGained' }>` |
| XE-009 | [packages/game-data-contract/src/operators.ts:221](../../packages/game-data-contract/src/operators.ts#L221) | `UpgradeEvent` | `Extract<CombatEventTrigger, { kind: 'skillHit' }>` |
| XE-010 | [packages/game-data-contract/src/operators.ts:244](../../packages/game-data-contract/src/operators.ts#L244) | `abilityEventResponses` | `Extract<AbilityEvent, 'abilityEntitySpawned' \| 'abilityEntityFinished'>` |
| XE-024 | [src/core/combat/damage/healthDamage.ts:24](../../src/core/combat/damage/healthDamage.ts#L24) | `HealthDamageSourceEvent` | `Extract< HealthDamageEvent, 'beforeOutputDamage' \| 'beforeKillEntity' \| 'afterKillEntity' \| 'outputDamage' >` |
| XE-025 | [src/core/combat/damage/healthDamage.ts:29](../../src/core/combat/damage/healthDamage.ts#L29) | `HealthDamageTargetEvent` | `Extract<HealthDamageEvent, 'beforeTakeDamage' \| 'takeDamage'>` |
| XE-031 | [src/core/combat/runtime/buffLifecycleSequenceRuntime.ts:40](../../src/core/combat/runtime/buffLifecycleSequenceRuntime.ts#L40) | `RegisterBuffAbilityEventAction` | `Exclude< ResolvedSkillBuffAbilityEventResponse['event'], \| 'afterKillEntity' \| 'outputKnockDown' \| 'afterOutputPhysicalInfliction' \| 'skillSpGained' \| 'buffConsumed' >` |
| XE-032 | [src/core/combat/runtime/buffLifecycleSequenceRuntime.ts:54](../../src/core/combat/runtime/buffLifecycleSequenceRuntime.ts#L54) | `RegisterBuffSemanticEventAction` | `Extract< ResolvedSkillBuffAbilityEventResponse['event'], \| 'afterKillEntity' \| 'outputKnockDown' \| 'afterOutputPhysicalInfliction' \| 'skillSpGained' \| 'buffConsumed' >` |
| XE-033 | [src/core/combat/runtime/buffLifecycleSequenceRuntime.ts:64](../../src/core/combat/runtime/buffLifecycleSequenceRuntime.ts#L64) | `RegisterBuffSemanticEventAction` | `Extract< CombatSemanticEvent, { readonly kind: \| 'enemyDefeated' \| 'knockDownOutput' \| 'physicalInflictionApplied' \| 'spGained' \| 'buffConsumed'; } >` |
| XE-051 | [src/core/combat/runtime/combatRuntimeAssembly.ts:1018](../../src/core/combat/runtime/combatRuntimeAssembly.ts#L1018) | `configureBuffLifecycle` | `Extract< CombatSemanticEvent, { readonly kind: \| 'enemyDefeated' \| 'knockDownOutput' \| 'physicalInflictionApplied' \| 'spGained' \| 'buffConsumed'; } >` |
| XE-052 | [src/core/combat/runtime/combatRuntimeAssembly.ts:3140](../../src/core/combat/runtime/combatRuntimeAssembly.ts#L3140) | `#resolveAbilityEntityBuffTarget` | `Extract< CombatSemanticEvent, { readonly kind: \| 'enemyDefeated' \| 'knockDownOutput' \| 'physicalInflictionApplied' \| 'spGained' \| 'buffConsumed'; } >` |
| XE-054 | [src/core/combat/runtime/combatSemanticEventRuntime.ts:178](../../src/core/combat/runtime/combatSemanticEventRuntime.ts#L178) | `phase` | `Exclude<CombatEventPhase, 'dataAction'>` |
| XE-233 | [tools/game-data-compiler/src/compiler/buffProjectionTypes.ts:126](../../tools/game-data-compiler/src/compiler/buffProjectionTypes.ts#L126) | `event` | `Extract< SkillBuffAbilityEventResponse['event'], \| 'beforeCastSkill' \| 'afterSkillApplyCost' \| 'skillEnd' \| 'beforeCalculateDamage' \| 'beforeDamageAction' \| 'beforeTakeDamage' \| 'beforeTakePhysicalInfliction' \| 'takeDamage' \| 'takeCriticalDamage' \| 'beforeTakeInfliction' \| 'outputBuff' \| 'beforeOutputBuff' \| 'beforeAddedBuff' \| 'addedBuff' \| 'beforeOutputPhysicalInfliction' \| 'beforeOutputKnockDown' \| 'afterOutputKnockDown' \| 'afterOutputPhysicalInfliction' \| 'afterOutputWeaknessTriggered' \| 'customAbilityEvent' \| 'outputDamage' \| 'beforeOutputInfliction' \| 'beforeOutputSpellBurst' \| 'outputCriticalDamage' \| 'outputHeal' \| 'receiveHeal' \| 'poiseZero' \| 'skillEnd' \| 'finishedBuff' \| 'buffEndsEarly' \| 'afterKillEntity' \| 'buffConsumed' \| 'enterFight' \| 'ownerSwitchToCenter' \| 'ownerSwitchToGuard' \| 'abilityEntitySpawned' \| 'abilityEntityFinished' \| 'skillSpGained' >` |
| XE-260 | [tools/game-data-compiler/src/domains/weapon/runtimeDefinition.ts:52](../../tools/game-data-compiler/src/domains/weapon/runtimeDefinition.ts#L52) | `CompiledWeaponSemanticEventSource` | `Extract<CombatEventTrigger, { kind: 'buffConsumed' \| 'spGained' }>` |
| XE-261 | [tools/game-data-compiler/src/domains/weapon/runtimeDefinition.ts:53](../../tools/game-data-compiler/src/domains/weapon/runtimeDefinition.ts#L53) | `CompiledWeaponSemanticEventSource` | `Extract<CombatEventTrigger, { kind: 'physicalInflictionApplied' }>` |
| XE-281 | [src/core/combat/runtime/abilityEventPayload.ts:25](../../src/core/combat/runtime/abilityEventPayload.ts#L25) | `NormalizedAbilityEventName` | `Exclude< AbilityEvent, 'afterKillEntity' \| 'outputKnockDown' \| 'afterOutputPhysicalInfliction' \| 'skillSpGained' >` |

## B：反向定义动作类别与装配所有权（3 处）

P0/P1：先定义类别或字段归属的正向权威集合，新增成员必须穷尽审查。

| 编号 | 位置 | 拥有者 | 当前表达式 |
| --- | --- | --- | --- |
| XE-099 | [src/core/compiler/combatProgram.ts:368](../../src/core/compiler/combatProgram.ts#L368) | `ResolvedCombatOperationStep` | `Exclude< ResolvedCombatStep, { kind: \| 'conditional' \| 'switch' \| 'once' \| 'withActionBlackboardScope' \| 'repeatEachTick' \| 'repeatByActionValue' \| 'scheduleProjectileFinishCallback' \| 'forEachContextTarget' \| 'jumpTimeline' \| 'finishTimeline'; } >` |
| XE-109 | [src/core/compiler/compileScenarioRuntimeAssembly.ts:56](../../src/core/compiler/compileScenarioRuntimeAssembly.ts#L56) | `EnvironmentOptionKey` | `Exclude< keyof CombatRuntimeAssemblyOptions, 'resources' \| 'enemy' \| 'operators' \| 'inputs' \| 'externalEvents' \| 'isOperatorControlled' >` |
| XE-123 | [src/data/operators/definitionHelpers.ts:21](../../src/data/operators/definitionHelpers.ts#L21) | `ImmediateStepKind` | `Exclude< CombatStepKind, \| 'conditional' \| 'switch' \| 'once' \| 'repeatEachTick' \| 'repeatByActionValue' \| 'forEachContextTarget' \| 'withActionBlackboardScope' >` |

## C：转换器子集与 IR 边界（20 处）

P1：证明是否真实 IR 不变量；普通输出直接依赖契约，能力限制移到诊断/能力检查。

| 编号 | 位置 | 拥有者 | 当前表达式 |
| --- | --- | --- | --- |
| XE-225 | [tools/game-data-compiler/src/compiler/buffProjectionTypes.ts:43](../../tools/game-data-compiler/src/compiler/buffProjectionTypes.ts#L43) | `processors` | `Extract< CombatBuffDefinitionDamageProcessor, { readonly kind: 'damageScale' \| 'instantAttribute' } >` |
| XE-226 | [tools/game-data-compiler/src/compiler/buffProjectionTypes.ts:54](../../tools/game-data-compiler/src/compiler/buffProjectionTypes.ts#L54) | `processors` | `Extract< HealModifierDefinition['processors'][number], { readonly kind: 'modifyHealingIncrease' \| 'modifyCalculationResult' } >` |
| XE-227 | [tools/game-data-compiler/src/compiler/buffProjectionTypes.ts:61](../../tools/game-data-compiler/src/compiler/buffProjectionTypes.ts#L61) | `CompiledBuffPoiseConditionLeaf` | `Extract<PoiseModifierCondition, { readonly kind: 'casterControlled' }>` |
| XE-228 | [tools/game-data-compiler/src/compiler/buffProjectionTypes.ts:62](../../tools/game-data-compiler/src/compiler/buffProjectionTypes.ts#L62) | `CompiledBuffPoiseConditionLeaf` | `Extract<PoiseModifierCondition, { readonly kind: 'eventDamageTagsMatch' }>` |
| XE-229 | [tools/game-data-compiler/src/compiler/buffProjectionTypes.ts:72](../../tools/game-data-compiler/src/compiler/buffProjectionTypes.ts#L72) | `condition` | `Extract<PoiseModifierCondition, { readonly kind: 'all' }>` |
| XE-230 | [tools/game-data-compiler/src/compiler/buffProjectionTypes.ts:91](../../tools/game-data-compiler/src/compiler/buffProjectionTypes.ts#L91) | `priority` | `Extract<BuffPriority, { readonly blackboardKey: string }>` |
| XE-231 | [tools/game-data-compiler/src/compiler/buffProjectionTypes.ts:92](../../tools/game-data-compiler/src/compiler/buffProjectionTypes.ts#L92) | `timeClock` | `Extract<SkillBuffDefinition['timeClock'], 'global' \| 'self'>` |
| XE-232 | [tools/game-data-compiler/src/compiler/buffProjectionTypes.ts:117](../../tools/game-data-compiler/src/compiler/buffProjectionTypes.ts#L117) | `lifecycleSequences` | `Extract< keyof SkillBuffLifecycleSequences, 'start' \| 'enable' \| 'trigger' \| 'enhanceChanged' \| 'afterEnhance' \| 'finish' >` |
| XE-240 | [tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts:22](../../tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts#L22) | `Condition` | `Extract<CombatCondition, { kind: K }>` |
| XE-241 | [tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts:27](../../tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts#L27) | `Step` | `Extract<CombatStepDefinition, { kind: K }>` |
| XE-242 | [tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts:139](../../tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts#L139) | `GlobalTimeDilation` | `Extract<Parameters<'startTimeDilation'>, { scope: 'global' }>` |
| XE-243 | [tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts:142](../../tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts#L142) | `curve` | `Extract<TimeScaleCurveDefinition, { kind: 'inline' \| 'named' }>` |
| XE-244 | [tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts:147](../../tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts#L147) | `EntityTimeDilation` | `Extract<Parameters<'startTimeDilation'>, { scope: 'entity' }>` |
| XE-245 | [tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts:150](../../tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts#L150) | `curve` | `Extract<TimeScaleCurveDefinition, { kind: 'inline' \| 'named' }>` |
| XE-246 | [tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts:196](../../tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts#L196) | `damageType` | `Extract< Parameters<'dealDamage'>['damageType'], 'physical' \| 'heat' \| 'electric' \| 'cryo' \| 'nature' >` |
| XE-247 | [tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts:410](../../tools/game-data-compiler/src/compiler/combatActionProjectionTypes.ts#L410) | `attribute` | `Extract<Parameters<'storeSourceAttributeValue'>['attribute'], { kind: 'specific' }>` |
| XE-249 | [tools/game-data-compiler/src/compiler/formalBuildDefinition.ts:18](../../tools/game-data-compiler/src/compiler/formalBuildDefinition.ts#L18) | `BuildModifierContract` | `Extract<EquipmentModifierDefinition, { kind: 'attribute' \| 'panelStat' }>` |
| XE-250 | [tools/game-data-compiler/src/compiler/formalBuildDefinition.ts:19](../../tools/game-data-compiler/src/compiler/formalBuildDefinition.ts#L19) | `BuildModifierContract` | `Extract<EquipmentModifierDefinition, { kind: 'damageScale' }>` |
| XE-251 | [tools/game-data-compiler/src/compiler/formalBuildDefinition.ts:20](../../tools/game-data-compiler/src/compiler/formalBuildDefinition.ts#L20) | `BuildModifierContract` | `Extract<EquipmentModifierDefinition, { kind: 'staticHealingIncrease' }>` |
| XE-252 | [tools/game-data-compiler/src/compiler/formalBuildDefinition.ts:23](../../tools/game-data-compiler/src/compiler/formalBuildDefinition.ts#L23) | `BuildModifierContract` | `Extract<EquipmentModifierDefinition, { kind: 'skillCooldownMultiplier' }>` |

## D：目标、伤害及操作范围的排除（10 处）

P1：逐项证明排除语义及运行时守卫；改为明确目标/操作成员或有证据分类。

| 编号 | 位置 | 拥有者 | 当前表达式 |
| --- | --- | --- | --- |
| XE-001 | [packages/game-data-contract/src/actions.ts:370](../../packages/game-data-contract/src/actions.ts#L370) | `target` | `Exclude<HealTarget, 'contextTarget'>` |
| XE-002 | [packages/game-data-contract/src/actions.ts:553](../../packages/game-data-contract/src/actions.ts#L553) | `target` | `Exclude< BuffApplicationTarget, \| 'controlledOperator' \| 'party' \| 'partyExceptCaster' \| 'partyExceptCasterAndSameCharacterType' \| 'casterAndControlledOperator' \| 'casterAndLowestHealthRatioOperatorExceptCaster' >` |
| XE-027 | [src/core/combat/damage/playerActiveDamageInput.ts:10](../../src/core/combat/damage/playerActiveDamageInput.ts#L10) | `ResistibleDamageType` | `Exclude<DamageType, 'true' \| 'lifeDrain'>` |
| XE-034 | [src/core/combat/runtime/buffOperationExecutor.ts:174](../../src/core/combat/runtime/buffOperationExecutor.ts#L174) | `resolveApplicationTargets` | `Exclude<BuffApplicationTarget, 'currentAbilityEntity'>` |
| XE-053 | [src/core/combat/runtime/combatRuntimeAssembly.ts:3174](../../src/core/combat/runtime/combatRuntimeAssembly.ts#L3174) | `#resolveBuffApplicationTargets` | `Exclude<BuffApplicationTarget, 'currentAbilityEntity'>` |
| XE-239 | [tools/game-data-compiler/src/compiler/combatActionLeafProjection.ts:2223](../../tools/game-data-compiler/src/compiler/combatActionLeafProjection.ts#L2223) | `target` | `Exclude< ProjectedTargetGroup, \| 'spatialPoint' \| 'sourceFinderResult' \| 'abilityEntity' \| 'contextOperator' \| 'lowestHealthRatioOperatorExceptCaster' \| 'empty' >` |
| XE-256 | [tools/game-data-compiler/src/domains/operator/progressionDefinition.ts:253](../../tools/game-data-compiler/src/domains/operator/progressionDefinition.ts#L253) | `compileModifier` | `Exclude<CompiledOperatorProgressionEntrySource, { kind: 'buff' }>` |
| XE-257 | [tools/game-data-compiler/src/domains/operator/progressionEffects.ts:38](../../tools/game-data-compiler/src/domains/operator/progressionEffects.ts#L38) | `operation` | `Exclude<SkillValueModifyTypeSource, 'none'>` |
| XE-258 | [tools/game-data-compiler/src/domains/operator/progressionEffects.ts:45](../../tools/game-data-compiler/src/domains/operator/progressionEffects.ts#L45) | `operation` | `Exclude<SkillValueModifyTypeSource, 'none'>` |
| XE-259 | [tools/game-data-compiler/src/domains/operator/progressionEffects.ts:143](../../tools/game-data-compiler/src/domains/operator/progressionEffects.ts#L143) | `requireOperation` | `Exclude<SkillValueModifyTypeSource, 'none'>` |

## E：成员类型的重复筛选与结构探测（145 处）

P2：优先引用已有命名成员/参数表；重复选择归并到定义层，局部必要收窄可说明后保留。

| 编号 | 位置 | 拥有者 | 当前表达式 |
| --- | --- | --- | --- |
| XE-003 | [packages/game-data-contract/src/buffs.ts:395](../../packages/game-data-contract/src/buffs.ts#L395) | `side` | `Extract<DamageProcessorDefinition, { readonly kind: 'damageScale' }>` |
| XE-004 | [packages/game-data-contract/src/buffs.ts:396](../../packages/game-data-contract/src/buffs.ts#L396) | `zone` | `Extract<DamageProcessorDefinition, { readonly kind: 'damageScale' }>` |
| XE-005 | [packages/game-data-contract/src/buffs.ts:401](../../packages/game-data-contract/src/buffs.ts#L401) | `targetSide` | `Extract< DamageProcessorDefinition, { readonly kind: 'instantAttribute' } >` |
| XE-006 | [packages/game-data-contract/src/buffs.ts:406](../../packages/game-data-contract/src/buffs.ts#L406) | `values` | `Extract< DamageProcessorDefinition, { readonly kind: 'instantAttribute' } >` |
| XE-007 | [packages/game-data-contract/src/conditions.ts:539](../../packages/game-data-contract/src/conditions.ts#L539) | `BuildCondition` | `Extract<CombatCondition, { kind: 'deckAttributeCompare' }>` |
| XE-018 | [src/application/runStandardPlayerDamageScenarioSimulation.ts:41](../../src/application/runStandardPlayerDamageScenarioSimulation.ts#L41) | `DamageStep` | `Extract<ResolvedCombatStep, { kind: 'dealDamage' \| 'dealFixedDamage' }>` |
| XE-019 | [src/application/scenarioSimulationService.ts:43](../../src/application/scenarioSimulationService.ts#L43) | `DamageStep` | `Extract<ResolvedCombatStep, { kind: 'dealDamage' \| 'dealFixedDamage' }>` |
| XE-020 | [src/core/combat/buffs/combatBuffDefinitions.ts:1722](../../src/core/combat/buffs/combatBuffDefinitions.ts#L1722) | `storeBuffAttributeValue` | `Extract<CombatBuffDefinitionAction, { kind: 'storeAttributeValue' }>` |
| XE-021 | [src/core/combat/buffs/combatBuffDefinitions.ts:1743](../../src/core/combat/buffs/combatBuffDefinitions.ts#L1743) | `modifyBuffBlackboard` | `Extract<CombatBuffDefinitionAction, { kind: 'modifyBlackboard' }>` |
| XE-022 | [src/core/combat/buffs/combatBuffDefinitions.ts:1762](../../src/core/combat/buffs/combatBuffDefinitions.ts#L1762) | `clampBuffBlackboard` | `Extract<CombatBuffDefinitionAction, { kind: 'clampBlackboard' }>` |
| XE-023 | [src/core/combat/buffs/combatBuffs.ts:1475](../../src/core/combat/buffs/combatBuffs.ts#L1475) | `resolveShieldAttributeValue` | `Extract<BuffShieldDefinition['value'], { readonly attribute: string }>` |
| XE-028 | [src/core/combat/damage/playerActiveDamageInput.ts:55](../../src/core/combat/damage/playerActiveDamageInput.ts#L55) | `step` | `Extract<ResolvedCombatStep, { kind: 'dealDamage' \| 'dealFixedDamage' }>` |
| XE-029 | [src/core/combat/runtime/abilityEntityChildSkillRuntime.ts:34](../../src/core/combat/runtime/abilityEntityChildSkillRuntime.ts#L34) | `entity` | `Extract<RuntimeTargetRef, { readonly kind: 'abilityEntity' }>` |
| XE-030 | [src/core/combat/runtime/actionBlackboardOperationExecutor.ts:29](../../src/core/combat/runtime/actionBlackboardOperationExecutor.ts#L29) | `read` | `Extract< Parameters<CombatOperationExecutor['execute']>[0], { kind: 'storeSourceAttributeValue' } >` |
| XE-035 | [src/core/combat/runtime/buffOperationExecutor.ts:917](../../src/core/combat/runtime/buffOperationExecutor.ts#L917) | `#resolveApplicationSource` | `Extract<RuntimeOperation, { kind: 'applyBuff' }>` |
| XE-036 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:24](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L24) | `conditionEvaluated` | `Extract<ResolvedCombatStep, { kind: 'conditional' }>` |
| XE-037 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:58](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L58) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'once' }>` |
| XE-038 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:83](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L83) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'withActionBlackboardScope' }>` |
| XE-039 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:143](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L143) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'repeatEachTick' }>` |
| XE-040 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:248](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L248) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'forEachContextTarget' }>` |
| XE-041 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:314](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L314) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'repeatByActionValue' }>` |
| XE-042 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:345](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L345) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'scheduleProjectileFinishCallback' }>` |
| XE-043 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:399](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L399) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'switch' }>` |
| XE-044 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:445](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L445) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'conditional' }>` |
| XE-045 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:469](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L469) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'conditional' }>` |
| XE-046 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:516](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L516) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'jumpTimeline' }>` |
| XE-047 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:559](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L559) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'finishTimeline' }>` |
| XE-048 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:578](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L578) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'listenForCombatEvents' }>` |
| XE-049 | [src/core/combat/runtime/combatActionSequenceRuntime.ts:721](../../src/core/combat/runtime/combatActionSequenceRuntime.ts#L721) | `getActionBlackboardScope` | `Extract<ResolvedCombatStep, { kind: 'withActionBlackboardScope' }>` |
| XE-050 | [src/core/combat/runtime/combatRuntimeAssembly.ts:317](../../src/core/combat/runtime/combatRuntimeAssembly.ts#L317) | `resolveVitals` | `Extract< import('../../game-data/operatorDefinition').CombatCondition, { kind: 'healthCompare' } >` |
| XE-055 | [src/core/combat/runtime/combatVitalsConditionExecutor.ts:13](../../src/core/combat/runtime/combatVitalsConditionExecutor.ts#L13) | `resolveTarget` | `Extract< CombatCondition, { kind: 'healthCompare' \| 'poiseCompare' \| 'targetStaggered' } >` |
| XE-058 | [src/core/combat/runtime/customAbilityEventOperationExecutor.ts:5](../../src/core/combat/runtime/customAbilityEventOperationExecutor.ts#L5) | `TriggerStep` | `Extract<ResolvedCombatOperationStep, { kind: 'triggerCustomAbilityEvent' }>` |
| XE-060 | [src/core/combat/runtime/elementalInflictionOperationExecutor.ts:19](../../src/core/combat/runtime/elementalInflictionOperationExecutor.ts#L19) | `InflictionStep` | `Extract<RuntimeOperation, { kind: 'applyElementalInfliction' }>` |
| XE-066 | [src/core/combat/runtime/elementalReactionOperationExecutor.ts:18](../../src/core/combat/runtime/elementalReactionOperationExecutor.ts#L18) | `ReactionStep` | `Extract< RuntimeOperation, { kind: 'applyElementalReaction' \| 'consumeElementalReaction' } >` |
| XE-067 | [src/core/combat/runtime/elementalReactionOperationExecutor.ts:82](../../src/core/combat/runtime/elementalReactionOperationExecutor.ts#L82) | `#apply` | `Extract<ReactionStep, { kind: 'applyElementalReaction' }>` |
| XE-068 | [src/core/combat/runtime/elementalReactionOperationExecutor.ts:118](../../src/core/combat/runtime/elementalReactionOperationExecutor.ts#L118) | `#consume` | `Extract<ReactionStep, { kind: 'consumeElementalReaction' }>` |
| XE-069 | [src/core/combat/runtime/eventContextConditionExecutor.ts:15](../../src/core/combat/runtime/eventContextConditionExecutor.ts#L15) | `EventDamageTagsCondition` | `Extract<CombatCondition, { kind: 'eventDamageTagsMatch' }>` |
| XE-070 | [src/core/combat/runtime/eventContextConditionExecutor.ts:16](../../src/core/combat/runtime/eventContextConditionExecutor.ts#L16) | `EventDamageFeaturesCondition` | `Extract<CombatCondition, { kind: 'eventDamageFeaturesMatch' }>` |
| XE-071 | [src/core/combat/runtime/eventContextConditionExecutor.ts:418](../../src/core/combat/runtime/eventContextConditionExecutor.ts#L418) | `matchDamageCondition` | `Extract< CombatCondition, { kind: \| 'eventDamageTypeIn' \| 'eventDamageTagsMatch' \| 'eventDamageGameplayTagsMatch' \| 'eventDamageFeaturesMatch'; } >` |
| XE-072 | [src/core/combat/runtime/globalBuffRuntime.ts:18](../../src/core/combat/runtime/globalBuffRuntime.ts#L18) | `CreateStep` | `Extract<ResolvedCombatOperationStep, { kind: 'createGlobalBuff' }>` |
| XE-073 | [src/core/combat/runtime/healOperationExecutor.ts:16](../../src/core/combat/runtime/healOperationExecutor.ts#L16) | `HealStep` | `Extract<ResolvedCombatOperationStep, { kind: 'heal' }>` |
| XE-076 | [src/core/combat/runtime/playerDamageOperationExecutor.ts:47](../../src/core/combat/runtime/playerDamageOperationExecutor.ts#L47) | `DamageStep` | `Extract<RuntimeOperation, { kind: 'dealDamage' \| 'dealFixedDamage' }>` |
| XE-077 | [src/core/combat/runtime/playerDamageOperationExecutor.ts:48](../../src/core/combat/runtime/playerDamageOperationExecutor.ts#L48) | `StaggerStep` | `Extract<RuntimeOperation, { kind: 'dealStagger' }>` |
| XE-078 | [src/core/combat/runtime/skillCastOperationExecutor.ts:5](../../src/core/combat/runtime/skillCastOperationExecutor.ts#L5) | `CastStep` | `Extract<ResolvedCombatOperationStep, { kind: 'castSkillDuringAction' }>` |
| XE-079 | [src/core/combat/runtime/skillRuntime.ts:230](../../src/core/combat/runtime/skillRuntime.ts#L230) | `actionOwnerAbilityEntity` | `Extract<RuntimeTargetRef, { kind: 'abilityEntity' }>` |
| XE-080 | [src/core/combat/runtime/skillRuntime.ts:306](../../src/core/combat/runtime/skillRuntime.ts#L306) | `SourceFile` | `Extract<ResolvedCombatStep, { kind: 'conditional' }>` |
| XE-082 | [src/core/combat/runtime/standardPlayerDamageEnvironment.ts:101](../../src/core/combat/runtime/standardPlayerDamageEnvironment.ts#L101) | `DamageStep` | `Extract<ResolvedCombatStep, { kind: 'dealDamage' \| 'dealFixedDamage' }>` |
| XE-084 | [src/core/combat/runtime/staticPlayerDamageSnapshots.ts:23](../../src/core/combat/runtime/staticPlayerDamageSnapshots.ts#L23) | `DamageStep` | `Extract<ResolvedCombatStep, { kind: 'dealDamage' \| 'dealFixedDamage' }>` |
| XE-085 | [src/core/combat/runtime/statusOperationExecutor.ts:16](../../src/core/combat/runtime/statusOperationExecutor.ts#L16) | `parameters` | `Extract<RuntimeOperation, { kind: K }>` |
| XE-087 | [src/core/combat/runtime/targetContextOperationExecutor.ts:88](../../src/core/combat/runtime/targetContextOperationExecutor.ts#L88) | `#findCharacterTeamTargets` | `Extract<ResolvedCombatOperationStep, { kind: 'findCharacterTeamTargets' }>` |
| XE-088 | [src/core/combat/runtime/targetContextOperationExecutor.ts:120](../../src/core/combat/runtime/targetContextOperationExecutor.ts#L120) | `excludedIds` | `Extract<RuntimeTargetRef, { kind: 'operator' }>` |
| XE-095 | [src/core/compiler/combatProgram.ts:131](../../src/core/compiler/combatProgram.ts#L131) | `applyPhysicalInfliction` | `Extract<CombatStepParameters['applyPhysicalInfliction'], { type: 'fracture' }>` |
| XE-096 | [src/core/compiler/combatProgram.ts:138](../../src/core/compiler/combatProgram.ts#L138) | `applyPhysicalInfliction` | `Extract<CombatStepParameters['applyPhysicalInfliction'], { type: 'crush' }>` |
| XE-097 | [src/core/compiler/combatProgram.ts:145](../../src/core/compiler/combatProgram.ts#L145) | `applyPhysicalInfliction` | `Extract<CombatStepParameters['applyPhysicalInfliction'], { type: 'airborne' }>` |
| XE-098 | [src/core/compiler/combatProgram.ts:197](../../src/core/compiler/combatProgram.ts#L197) | `target` | `Exclude<CombatStepParameters['heal']['target'], 'contextTarget'>` |
| XE-100 | [src/core/compiler/compileOperatorUpgrades.ts:142](../../src/core/compiler/compileOperatorUpgrades.ts#L142) | `matchesBuildCondition` | `Extract<UpgradeModifierDefinition, { kind: 'patchSkillBlackboard' }>` |
| XE-101 | [src/core/compiler/compileOperatorUpgrades.ts:305](../../src/core/compiler/compileOperatorUpgrades.ts#L305) | `patchSkillBlackboard` | `Extract<UpgradeModifierDefinition, { kind: 'patchSkillBlackboard' }>` |
| XE-102 | [src/core/compiler/compileOperatorUpgrades.ts:341](../../src/core/compiler/compileOperatorUpgrades.ts#L341) | `multiplySkillCost` | `Extract<UpgradeModifierDefinition, { kind: 'multiplySkillCost' }>` |
| XE-103 | [src/core/compiler/compileOperatorUpgrades.ts:379](../../src/core/compiler/compileOperatorUpgrades.ts#L379) | `addSkillCooldownFrames` | `Extract<UpgradeModifierDefinition, { kind: 'addSkillCooldownFrames' }>` |
| XE-104 | [src/core/compiler/compileOperatorUpgrades.ts:409](../../src/core/compiler/compileOperatorUpgrades.ts#L409) | `CompiledReactionStep` | `Extract<ResolvedCombatStep, { kind: 'applyElementalReaction' }>` |
| XE-105 | [src/core/compiler/compileOperatorUpgrades.ts:462](../../src/core/compiler/compileOperatorUpgrades.ts#L462) | `multiplyEffectDuration` | `Extract<UpgradeModifierDefinition, { kind: 'multiplyEffectDuration' }>` |
| XE-106 | [src/core/compiler/compileOperatorUpgrades.ts:477](../../src/core/compiler/compileOperatorUpgrades.ts#L477) | `setEffectiveness` | `Extract<UpgradeModifierDefinition, { kind: 'setEffectiveness' }>` |
| XE-107 | [src/core/compiler/compileOperatorUpgrades.ts:489](../../src/core/compiler/compileOperatorUpgrades.ts#L489) | `addSkillStat` | `Extract<UpgradeModifierDefinition, { kind: 'addSkillStat' }>` |
| XE-108 | [src/core/compiler/compileOperatorUpgrades.ts:515](../../src/core/compiler/compileOperatorUpgrades.ts#L515) | `addConditionalDamage` | `Extract<UpgradeModifierDefinition, { kind: 'addConditionalDamage' }>` |
| XE-110 | [src/core/compiler/compileScenarioTimeline.ts:309](../../src/core/compiler/compileScenarioTimeline.ts#L309) | `routes` | `Extract< import('../game-data/operatorDefinition').PlayerActionRouteDefinition, { readonly kind: 'skillSlot' } >` |
| XE-111 | [src/core/projection/combatHudSnapshot.ts:53](../../src/core/projection/combatHudSnapshot.ts#L53) | `appearance` | `Extract<OperatorPassiveUiDefinition, { kind: 'numeric' }>` |
| XE-112 | [src/core/projection/combatHudSnapshot.ts:60](../../src/core/projection/combatHudSnapshot.ts#L60) | `appearance` | `Extract< OperatorPassiveUiDefinition, { kind: 'buffProgress' } >` |
| XE-113 | [src/core/projection/combatHudSnapshot.ts:71](../../src/core/projection/combatHudSnapshot.ts#L71) | `appearance` | `Extract< OperatorPassiveUiDefinition, { kind: 'buffCounters' } >` |
| XE-114 | [src/core/projection/operatorPassiveUiTimelineViz.ts:18](../../src/core/projection/operatorPassiveUiTimelineViz.ts#L18) | `appearance` | `Extract<OperatorPassiveUiDefinition, { kind: 'numeric' }>` |
| XE-115 | [src/core/projection/operatorPassiveUiTimelineViz.ts:28](../../src/core/projection/operatorPassiveUiTimelineViz.ts#L28) | `appearance` | `Extract< OperatorPassiveUiDefinition, { kind: 'buffProgress' } >` |
| XE-116 | [src/core/projection/operatorPassiveUiTimelineViz.ts:41](../../src/core/projection/operatorPassiveUiTimelineViz.ts#L41) | `appearance` | `Extract< OperatorPassiveUiDefinition, { kind: 'buffCounters' } >` |
| XE-117 | [src/core/projection/operatorPassiveUiTimelineViz.ts:83](../../src/core/projection/operatorPassiveUiTimelineViz.ts#L83) | `definition` | `Extract<OperatorPassiveUiDefinition, { readonly kind: 'numeric' }>` |
| XE-118 | [src/core/projection/operatorPassiveUiTimelineViz.ts:128](../../src/core/projection/operatorPassiveUiTimelineViz.ts#L128) | `definition` | `Extract<OperatorPassiveUiDefinition, { readonly kind: 'buffProgress' }>` |
| XE-119 | [src/core/projection/operatorPassiveUiTimelineViz.ts:131](../../src/core/projection/operatorPassiveUiTimelineViz.ts#L131) | `OpenSegment` | `Extract<OperatorPassiveUiTimelineSegment, { readonly kind: 'buffProgress' }>` |
| XE-120 | [src/core/projection/operatorPassiveUiTimelineViz.ts:192](../../src/core/projection/operatorPassiveUiTimelineViz.ts#L192) | `definition` | `Extract<OperatorPassiveUiDefinition, { readonly kind: 'buffCounters' }>` |
| XE-124 | [src/data/operators/definitionHelpers.ts:37](../../src/data/operators/definitionHelpers.ts#L37) | `step` | `Extract<CombatStepDefinition, { kind: K }>` |
| XE-125 | [src/data/operators/definitionHelpers.ts:38](../../src/data/operators/definitionHelpers.ts#L38) | `step` | `Extract< CombatStepDefinition, { kind: K } >` |
| XE-126 | [src/data/operators/definitionHelpers.ts:131](../../src/data/operators/definitionHelpers.ts#L131) | `branch` | `Extract<CombatStepDefinition, { kind: 'conditional' }>` |
| XE-127 | [src/data/operators/definitionHelpers.ts:147](../../src/data/operators/definitionHelpers.ts#L147) | `once` | `Extract<CombatStepDefinition, { kind: 'once' }>` |
| XE-128 | [src/data/operators/definitionHelpers.ts:163](../../src/data/operators/definitionHelpers.ts#L163) | `withActionBlackboardScope` | `Extract<CombatStepDefinition, { kind: 'withActionBlackboardScope' }>` |
| XE-129 | [src/data/operators/definitionHelpers.ts:186](../../src/data/operators/definitionHelpers.ts#L186) | `repeatEachTick` | `Extract<CombatStepDefinition, { kind: 'repeatEachTick' }>` |
| XE-130 | [src/data/operators/definitionHelpers.ts:187](../../src/data/operators/definitionHelpers.ts#L187) | `repeatEachTick` | `Extract<CombatStepDefinition, { kind: 'repeatEachTick' }>` |
| XE-131 | [src/data/operators/definitionHelpers.ts:195](../../src/data/operators/definitionHelpers.ts#L195) | `repeatByActionValue` | `Extract<CombatStepDefinition, { kind: 'repeatByActionValue' }>` |
| XE-132 | [src/data/operators/definitionHelpers.ts:203](../../src/data/operators/definitionHelpers.ts#L203) | `forEachContextTarget` | `Extract<CombatStepDefinition, { kind: 'forEachContextTarget' }>` |
| XE-133 | [src/data/operators/definitionHelpers.ts:211](../../src/data/operators/definitionHelpers.ts#L211) | `forEachTarget` | `Extract<CombatStepDefinition, { kind: 'forEachContextTarget' }>` |
| XE-134 | [src/ui/timeline/combatInspectorFields.ts:13](../../src/ui/timeline/combatInspectorFields.ts#L13) | `ApplyBuffParameters` | `Extract< CombatStepDefinition, { kind: 'applyBuff' } >` |
| XE-135 | [src/ui/timeline/combatInspectorFields.ts:17](../../src/ui/timeline/combatInspectorFields.ts#L17) | `ActionValueComparison` | `Extract<CombatCondition, { kind: 'actionValueCompare' }>` |
| XE-136 | [src/ui/timeline/components/AbilityEntityDefinitionGraphEditor.vue:123](../../src/ui/timeline/components/AbilityEntityDefinitionGraphEditor.vue#L123) | `inlineBuff` | `Extract<CombatStepDefinition, { kind: 'applyBuff' }>` |
| XE-137 | [src/ui/timeline/components/AbilityEntityDefinitionsDialog.vue:25](../../src/ui/timeline/components/AbilityEntityDefinitionsDialog.vue#L25) | `SpawnAbilityEntityStep` | `Extract< CombatStepDefinition, { readonly kind: 'spawnAbilityEntity' } >` |
| XE-138 | [src/ui/timeline/components/AbilityEntityStepEditor.vue:31](../../src/ui/timeline/components/AbilityEntityStepEditor.vue#L31) | `AbilityEntityStep` | `Extract<CombatStepDefinition, { kind: 'spawnAbilityEntity' }>` |
| XE-139 | [src/ui/timeline/components/ActionDispatchStepEditor.vue:5](../../src/ui/timeline/components/ActionDispatchStepEditor.vue#L5) | `ActionDispatchStep` | `Extract< CombatStepDefinition, { kind: 'triggerCustomAbilityEvent' \| 'castSkillDuringAction' } >` |
| XE-140 | [src/ui/timeline/components/ActionSequenceGraphEditor.vue:126](../../src/ui/timeline/components/ActionSequenceGraphEditor.vue#L126) | `inlineBuff` | `Extract<CombatStepDefinition, { kind: 'applyBuff' }>` |
| XE-141 | [src/ui/timeline/components/ActionValueStepEditor.vue:18](../../src/ui/timeline/components/ActionValueStepEditor.vue#L18) | `ActionValueStep` | `Extract< CombatStepDefinition, { kind: 'modifyActionValue' \| 'calculateActionValue' } >` |
| XE-142 | [src/ui/timeline/components/BranchStepEditor.vue:21](../../src/ui/timeline/components/BranchStepEditor.vue#L21) | `BranchStep` | `Extract< CombatStepDefinition, { kind: 'conditional' \| 'once' \| 'repeatEachTick' } >` |
| XE-143 | [src/ui/timeline/components/BuffDefinitionGraphEditor.vue:181](../../src/ui/timeline/components/BuffDefinitionGraphEditor.vue#L181) | `editingStep` | `Extract<CombatStepDefinition, { kind: 'applyBuff' }>` |
| XE-144 | [src/ui/timeline/components/BuffLifecycleOperationStepEditor.vue:9](../../src/ui/timeline/components/BuffLifecycleOperationStepEditor.vue#L9) | `BuffLifecycleOperationStep` | `Extract< CombatStepDefinition, { kind: 'igniteBuffs' \| 'inheritBuffById' \| 'restrictUltimateEnergyRecovery' } >` |
| XE-145 | [src/ui/timeline/components/BuffManagementStepEditor.vue:21](../../src/ui/timeline/components/BuffManagementStepEditor.vue#L21) | `BuffManagementStep` | `Extract< CombatStepDefinition, { kind: \| 'readBuffBlackboard' \| 'readBuffStackCount' \| 'finishBuffsByTag' \| 'finishBuffsById' \| 'holdBuffsById'; } >` |
| XE-146 | [src/ui/timeline/components/BuffManagementStepEditor.vue:34](../../src/ui/timeline/components/BuffManagementStepEditor.vue#L34) | `ReadStep` | `Extract<BuffManagementStep, { kind: 'readBuffBlackboard' \| 'readBuffStackCount' }>` |
| XE-147 | [src/ui/timeline/components/BuffShieldEditor.vue:62](../../src/ui/timeline/components/BuffShieldEditor.vue#L62) | `updateAttributeValue` | `Extract<BuffShieldDefinition['value'], { readonly attribute: string }>` |
| XE-148 | [src/ui/timeline/components/BuffStepEditor.vue:78](../../src/ui/timeline/components/BuffStepEditor.vue#L78) | `BuffStep` | `Extract<CombatStepDefinition, { kind: 'applyBuff' }>` |
| XE-149 | [src/ui/timeline/components/DamageStepEditor.vue:32](../../src/ui/timeline/components/DamageStepEditor.vue#L32) | `DamageStep` | `Extract< CombatStepDefinition, { kind: 'dealDamage' \| 'dealFixedDamage' \| 'dealStagger' \| 'applyElementalInfliction' } >` |
| XE-150 | [src/ui/timeline/components/ElementalReactionStepEditor.vue:17](../../src/ui/timeline/components/ElementalReactionStepEditor.vue#L17) | `ReactionStep` | `Extract< CombatStepDefinition, { kind: 'applyElementalReaction' \| 'consumeElementalReaction' } >` |
| XE-151 | [src/ui/timeline/components/EquipmentBuffDefinitionsDialog.vue:18](../../src/ui/timeline/components/EquipmentBuffDefinitionsDialog.vue#L18) | `BuffStep` | `Extract<CombatStepDefinition, { kind: 'applyBuff' }>` |
| XE-153 | [src/ui/timeline/components/EventListenerStepEditor.vue:24](../../src/ui/timeline/components/EventListenerStepEditor.vue#L24) | `ListenerStep` | `Extract<CombatStepDefinition, { kind: 'listenForCombatEvents' }>` |
| XE-154 | [src/ui/timeline/components/ForEachContextTargetStepEditor.vue:3](../../src/ui/timeline/components/ForEachContextTargetStepEditor.vue#L3) | `Step` | `Extract<CombatStepDefinition, { kind: 'forEachContextTarget' }>` |
| XE-155 | [src/ui/timeline/components/GlobalBuffStepEditor.vue:11](../../src/ui/timeline/components/GlobalBuffStepEditor.vue#L11) | `CreateStep` | `Extract<CombatStepDefinition, { kind: 'createGlobalBuff' }>` |
| XE-156 | [src/ui/timeline/components/GlobalBuffStepEditor.vue:12](../../src/ui/timeline/components/GlobalBuffStepEditor.vue#L12) | `FinishStep` | `Extract<CombatStepDefinition, { kind: 'finishParentGlobalBuff' }>` |
| XE-157 | [src/ui/timeline/components/GlobalBuffStepEditor.vue:13](../../src/ui/timeline/components/GlobalBuffStepEditor.vue#L13) | `FinishByIdStep` | `Extract<CombatStepDefinition, { kind: 'finishGlobalBuffsById' }>` |
| XE-158 | [src/ui/timeline/components/HealStepEditor.vue:22](../../src/ui/timeline/components/HealStepEditor.vue#L22) | `HealStep` | `Extract<CombatStepDefinition, { kind: 'heal' }>` |
| XE-159 | [src/ui/timeline/components/HealStepEditor.vue:36](../../src/ui/timeline/components/HealStepEditor.vue#L36) | `isDefinite` | `Extract<HealParameters, { amount: unknown }>` |
| XE-160 | [src/ui/timeline/components/KnockDownStepEditor.vue:8](../../src/ui/timeline/components/KnockDownStepEditor.vue#L8) | `KnockDownStep` | `Extract<CombatStepDefinition, { kind: 'applyKnockDown' }>` |
| XE-161 | [src/ui/timeline/components/MechanicStepEditor.vue:24](../../src/ui/timeline/components/MechanicStepEditor.vue#L24) | `MechanicStep` | `Extract< CombatStepDefinition, { kind: \| 'createTimedMarker' \| 'setGlobalCooldown' \| 'outputAirborne' \| 'outputKnockDown' \| 'gainSquadUltimateEnergyFromSkillCost' \| 'gainFinisherSp' \| 'setContextFlag' \| 'setCharacterPassiveUiValue' \| 'openComboWindow'; } >` |
| XE-162 | [src/ui/timeline/components/OperatorDefinitionWorkspaceDialog.vue:92](../../src/ui/timeline/components/OperatorDefinitionWorkspaceDialog.vue#L92) | `BuffStep` | `Extract<CombatStepDefinition, { kind: 'applyBuff' }>` |
| XE-163 | [src/ui/timeline/components/PhysicalInflictionStepEditor.vue:5](../../src/ui/timeline/components/PhysicalInflictionStepEditor.vue#L5) | `PhysicalInflictionStep` | `Extract<CombatStepDefinition, { kind: 'applyPhysicalInfliction' }>` |
| XE-164 | [src/ui/timeline/components/ResourceStepEditor.vue:32](../../src/ui/timeline/components/ResourceStepEditor.vue#L32) | `ResourceStep` | `Extract< CombatStepDefinition, { kind: 'changeResource' \| 'changeResourceByActionValue' } >` |
| XE-165 | [src/ui/timeline/components/SkillDefinitionEditor.vue:266](../../src/ui/timeline/components/SkillDefinitionEditor.vue#L266) | `selectedInlineBuff` | `Extract<CombatStepDefinition, { kind: 'applyBuff' }>` |
| XE-166 | [src/ui/timeline/components/SkillRoutingStepEditor.vue:8](../../src/ui/timeline/components/SkillRoutingStepEditor.vue#L8) | `SkillRoutingStep` | `Extract< CombatStepDefinition, { kind: 'changeSkillSlot' \| 'changePlayerActionMode' \| 'changeNativeSkillType' } >` |
| XE-167 | [src/ui/timeline/components/SkillSettingStepEditor.vue:9](../../src/ui/timeline/components/SkillSettingStepEditor.vue#L9) | `SettingStep` | `Extract<CombatStepDefinition, { kind: 'readSkillSettingData' }>` |
| XE-168 | [src/ui/timeline/components/SpellBurstStepEditor.vue:7](../../src/ui/timeline/components/SpellBurstStepEditor.vue#L7) | `SpellBurstStep` | `Extract<CombatStepDefinition, { kind: 'triggerSpellBurst' }>` |
| XE-169 | [src/ui/timeline/components/StatusModifierEditor.vue:82](../../src/ui/timeline/components/StatusModifierEditor.vue#L82) | `setLevelValue` | `Extract<StatusModifierDefinition, { kind: 'attackPercent' \| 'susceptibility' }>` |
| XE-170 | [src/ui/timeline/components/StatusModifierEditor.vue:95](../../src/ui/timeline/components/StatusModifierEditor.vue#L95) | `setCap` | `Extract<StatusModifierDefinition, { kind: 'susceptibility' }>` |
| XE-171 | [src/ui/timeline/components/StatusModifierEditor.vue:108](../../src/ui/timeline/components/StatusModifierEditor.vue#L108) | `setResource` | `Extract< StatusModifierDefinition, { kind: 'blockResourceGain' \| 'resourceCostMultiplier' } >` |
| XE-172 | [src/ui/timeline/components/StatusModifierEditor.vue:121](../../src/ui/timeline/components/StatusModifierEditor.vue#L121) | `setMultiplier` | `Extract< StatusModifierDefinition, { kind: 'resourceCostMultiplier' \| 'skillCooldownMultiplier' } >` |
| XE-173 | [src/ui/timeline/components/StatusModifierEditor.vue:134](../../src/ui/timeline/components/StatusModifierEditor.vue#L134) | `setSkillGroupKey` | `Extract<StatusModifierDefinition, { kind: 'skillCooldownMultiplier' }>` |
| XE-174 | [src/ui/timeline/components/StatusModifierEditor.vue:142](../../src/ui/timeline/components/StatusModifierEditor.vue#L142) | `toggleDamageType` | `Extract<StatusModifierDefinition, { kind: 'susceptibility' }>` |
| XE-175 | [src/ui/timeline/components/StatusModifierEditor.vue:154](../../src/ui/timeline/components/StatusModifierEditor.vue#L154) | `toggleAttributeScaling` | `Extract<StatusModifierDefinition, { kind: 'susceptibility' }>` |
| XE-176 | [src/ui/timeline/components/StatusModifierEditor.vue:165](../../src/ui/timeline/components/StatusModifierEditor.vue#L165) | `setScalingAttribute` | `Extract<StatusModifierDefinition, { kind: 'susceptibility' }>` |
| XE-177 | [src/ui/timeline/components/StatusModifierEditor.vue:179](../../src/ui/timeline/components/StatusModifierEditor.vue#L179) | `setScalingCoefficient` | `Extract<StatusModifierDefinition, { kind: 'susceptibility' }>` |
| XE-178 | [src/ui/timeline/components/StatusModifierEditor.vue:200](../../src/ui/timeline/components/StatusModifierEditor.vue#L200) | `toggleCap` | `Extract<StatusModifierDefinition, { kind: 'susceptibility' }>` |
| XE-179 | [src/ui/timeline/components/StatusStepEditor.vue:21](../../src/ui/timeline/components/StatusStepEditor.vue#L21) | `StatusStep` | `Extract<CombatStepDefinition, { kind: 'applyStatus' \| 'consumeStatus' }>` |
| XE-180 | [src/ui/timeline/components/StatusStepEditor.vue:94](../../src/ui/timeline/components/StatusStepEditor.vue#L94) | `setModifiers` | `Extract<StatusStep, { kind: 'applyStatus' }>` |
| XE-181 | [src/ui/timeline/components/StructuredControlStepEditor.vue:11](../../src/ui/timeline/components/StructuredControlStepEditor.vue#L11) | `Step` | `Extract< CombatStepDefinition, { kind: \| 'createSpatialPointTargets' \| 'jumpTimeline' \| 'finishTimeline' \| 'withActionBlackboardScope' \| 'repeatByActionValue' \| 'scheduleProjectileFinishCallback'; } >` |
| XE-182 | [src/ui/timeline/components/StructuredControlStepEditor.vue:33](../../src/ui/timeline/components/StructuredControlStepEditor.vue#L33) | `setScopeParameters` | `Extract<Step, { kind: 'withActionBlackboardScope' }>` |
| XE-183 | [src/ui/timeline/components/SwitchStepEditor.vue:15](../../src/ui/timeline/components/SwitchStepEditor.vue#L15) | `SwitchStep` | `Extract<CombatStepDefinition, { kind: 'switch' }>` |
| XE-184 | [src/ui/timeline/components/TargetContextStepEditor.vue:5](../../src/ui/timeline/components/TargetContextStepEditor.vue#L5) | `TargetContextStep` | `Extract< CombatStepDefinition, { kind: \| 'mergeContextTargets' \| 'findCharacterTeamTargets' \| 'findOwnerSpawnedAbilityEntities' \| 'pickContextTarget'; } >` |
| XE-185 | [src/ui/timeline/components/TargetContextStepEditor.vue:16](../../src/ui/timeline/components/TargetContextStepEditor.vue#L16) | `MergeSourceKind` | `Extract< TargetContextStep, { kind: 'mergeContextTargets' } >` |
| XE-186 | [src/ui/timeline/components/TimeDilationStepEditor.vue:33](../../src/ui/timeline/components/TimeDilationStepEditor.vue#L33) | `TimeDilationStep` | `Extract< CombatStepDefinition, { kind: 'startTimeDilation' \| 'startUltimateTimeDilation' } >` |
| XE-187 | [src/ui/timeline/components/TimeDilationStepEditor.vue:37](../../src/ui/timeline/components/TimeDilationStepEditor.vue#L37) | `OrdinaryStep` | `Extract<TimeDilationStep, { kind: 'startTimeDilation' }>` |
| XE-189 | [src/ui/timeline/components/TimelineExternalEventInspector.vue:39](../../src/ui/timeline/components/TimelineExternalEventInspector.vue#L39) | `updateHit` | `Extract<ExternalCombatEventDocument, { kind: 'operatorHit' }>` |
| XE-190 | [src/ui/timeline/conditionInspectorSchema.ts:14](../../src/ui/timeline/conditionInspectorSchema.ts#L14) | `conditionInspectorFields` | `Extract<CombatCondition, { kind: K }>` |
| XE-191 | [src/ui/timeline/conditionInspectorSchema.ts:31](../../src/ui/timeline/conditionInspectorSchema.ts#L31) | `result` | `Extract<CombatCondition, { kind: K }>` |
| XE-197 | [src/ui/timeline/timelineEditorViewModel.ts:45](../../src/ui/timeline/timelineEditorViewModel.ts#L45) | `source` | `Extract<DefinitionActionSource, { kind: 'operatorSkill' }>` |
| XE-238 | [tools/game-data-compiler/src/compiler/buildAttributeProjection.ts:191](../../tools/game-data-compiler/src/compiler/buildAttributeProjection.ts#L191) | `projectPanelStat` | `Extract<ProjectedBuildModifierSource<Value>, { kind: 'panelStat' }>` |
| XE-253 | [tools/game-data-compiler/src/compiler/physicalInflictionProjection.ts:31](../../tools/game-data-compiler/src/compiler/physicalInflictionProjection.ts#L31) | `projectPhysicalInflictionAction` | `Extract<CompiledBuffStepSource, { readonly kind: 'applyPhysicalInfliction' }>` |
| XE-255 | [tools/game-data-compiler/src/domains/equipment/formalDefinition.ts:270](../../tools/game-data-compiler/src/domains/equipment/formalDefinition.ts#L270) | `DISPLAY_COMPOSITE_BY_NATIVE` | `Extract<EquipmentTraitDisplayDefinition, { kind: 'composite' }>` |

## F：原始动作图/条件的局部收窄（36 处）

P2：引用原生已命名结构或公共节点映射；不为局部收窄新增平行 IR。

| 编号 | 位置 | 拥有者 | 当前表达式 |
| --- | --- | --- | --- |
| XE-198 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:18](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L18) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'actionWithCallback' }>` |
| XE-199 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:56](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L56) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'ifElse' }>` |
| XE-200 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:64](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L64) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'forEach' }>` |
| XE-201 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:71](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L71) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'physicsCast' }>` |
| XE-202 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:78](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L78) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'channeling' }>` |
| XE-203 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:85](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L85) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'once' }>` |
| XE-204 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:92](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L92) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'tickInterval' }>` |
| XE-205 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:99](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L99) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'switch' }>` |
| XE-206 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:106](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L106) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'ifElse' }>` |
| XE-207 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:112](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L112) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'ifElse' }>` |
| XE-208 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:124](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L124) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'togglable' }>` |
| XE-209 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:258](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L258) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'ifElse' }>` |
| XE-210 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:368](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L368) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'forEach' }>` |
| XE-211 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:379](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L379) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'physicsCast' }>` |
| XE-212 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:390](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L390) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'channeling' }>` |
| XE-213 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:401](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L401) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'once' }>` |
| XE-214 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:412](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L412) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'tickInterval' }>` |
| XE-215 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:423](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L423) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'switch' }>` |
| XE-216 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:433](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L433) | `body` | `Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'togglable' }>` |
| XE-217 | [tools/game-data-compiler/src/compiler/actionSequenceProgram.ts:442](../../tools/game-data-compiler/src/compiler/actionSequenceProgram.ts#L442) | `body` | `Extract< NativeActionNodeSource<TLeaf>['body'], { kind: 'actionWithCallback' } >` |
| XE-218 | [tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts:356](../../tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts#L356) | `collectReachableTargetGroupActions` | `Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>` |
| XE-219 | [tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts:357](../../tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts#L357) | `result` | `Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>` |
| XE-220 | [tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts:410](../../tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts#L410) | `isPlainStaticEnemyMerge` | `Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>` |
| XE-221 | [tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts:456](../../tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts#L456) | `isAtMostSingleEnemyMerge` | `Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>` |
| XE-222 | [tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts:492](../../tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts#L492) | `isAtMostSingleEnemyConversion` | `Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>` |
| XE-223 | [tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts:515](../../tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts#L515) | `isAtMostSingleEnemyFilteredFind` | `Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>` |
| XE-224 | [tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts:658](../../tools/game-data-compiler/src/compiler/activeSkillRuntimeProjection.ts#L658) | `isStaticSingleEnemyTargetPostProcessor` | `Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>` |
| XE-234 | [tools/game-data-compiler/src/compiler/buffRuntimeProjection.ts:2362](../../tools/game-data-compiler/src/compiler/buffRuntimeProjection.ts#L2362) | `body` | `Extract< NativeActionNodeSource<KnownNativeActionLeafSource>['body'], { kind: 'ifElse' } >` |
| XE-235 | [tools/game-data-compiler/src/compiler/buffRuntimeProjection.ts:2620](../../tools/game-data-compiler/src/compiler/buffRuntimeProjection.ts#L2620) | `body` | `Extract< NativeActionNodeSource<KnownNativeActionLeafSource>['body'], { kind: 'ifElse' } >` |
| XE-236 | [tools/game-data-compiler/src/compiler/buffRuntimeProjection.ts:2726](../../tools/game-data-compiler/src/compiler/buffRuntimeProjection.ts#L2726) | `body` | `Extract< NativeActionNodeSource<KnownNativeActionLeafSource>['body'], { kind: 'togglable' } >` |
| XE-237 | [tools/game-data-compiler/src/compiler/buffRuntimeProjection.ts:2779](../../tools/game-data-compiler/src/compiler/buffRuntimeProjection.ts#L2779) | `body` | `Extract< NativeActionNodeSource<KnownNativeActionLeafSource>['body'], { kind: 'ifElse'; } >` |
| XE-248 | [tools/game-data-compiler/src/compiler/combatConditionProjection.ts:94](../../tools/game-data-compiler/src/compiler/combatConditionProjection.ts#L94) | `compileConditionLeaf` | `Extract<KnownNativeActionLeafSource, { family: 'condition' }>` |
| XE-254 | [tools/game-data-compiler/src/compiler/targetGroupCardinalityAnalysis.ts:4](../../tools/game-data-compiler/src/compiler/targetGroupCardinalityAnalysis.ts#L4) | `TargetGroupAction` | `Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>` |
| XE-262 | [tools/game-data-compiler/src/source/actionLeaf.ts:584](../../tools/game-data-compiler/src/source/actionLeaf.ts#L584) | `action` | `Extract<CameraPresentationActionSource, { kind: 'hideUi' }>` |
| XE-263 | [tools/game-data-compiler/src/source/condition.ts:1323](../../tools/game-data-compiler/src/source/condition.ts#L1323) | `matcher` | `Extract<NativeConditionSource, { readonly kind: 'contextBuff' }>` |
| XE-264 | [tools/game-data-compiler/src/source/condition.ts:1397](../../tools/game-data-compiler/src/source/condition.ts#L1397) | `matcher` | `Extract<NativeConditionSource, { readonly kind: 'contextBuff' }>` |

## G：UI、键类型与结果类型（12 处）

P1/P3：UI 外观/字段分类先验语义；键约束及成功失败收窄可保留，禁止机械替换。

| 编号 | 位置 | 拥有者 | 当前表达式 |
| --- | --- | --- | --- |
| XE-011 | [packages/game-data-contract/src/operators.ts:298](../../packages/game-data-contract/src/operators.ts#L298) | `appearance` | `Exclude<OperatorPassiveUiAppearance, 'liinoMusic'>` |
| XE-012 | [packages/game-data-contract/src/operators.ts:305](../../packages/game-data-contract/src/operators.ts#L305) | `appearance` | `Extract<OperatorPassiveUiAppearance, 'liinoMusic'>` |
| XE-013 | [packages/game-data-contract/src/operators.ts:312](../../packages/game-data-contract/src/operators.ts#L312) | `appearance` | `Extract<OperatorPassiveUiAppearance, 'typhoeaArrows'>` |
| XE-014 | [src/application/editor/enemyEditorCommands.ts:14](../../src/application/editor/enemyEditorCommands.ts#L14) | `EnemyBasicEditableField` | `Exclude<keyof EnemyEditableValues, 'resistances' \| 'stagger'>` |
| XE-017 | [src/application/openProject.ts:11](../../src/application/openProject.ts#L11) | `ParseProjectFailure` | `Exclude<ParseProjectResult, { ok: true }>` |
| XE-121 | [src/data/gameText.ts:30](../../src/data/gameText.ts#L30) | `getFamilySource` | `Exclude<GameTextFamily, 'gears' \| 'terms'>` |
| XE-122 | [src/data/gameText.ts:40](../../src/data/gameText.ts#L40) | `getEntry` | `Exclude<GameTextFamily, 'gears' \| 'terms'>` |
| XE-188 | [src/ui/timeline/components/TimeDilationStepEditor.vue:317](../../src/ui/timeline/components/TimeDilationStepEditor.vue#L317) | `setCurveKeyNumber` | `Exclude<keyof TimeScaleCurveKeyDefinition, 'weightedMode'>` |
| XE-193 | [src/ui/timeline/contributionInspectorSchema.ts:11](../../src/ui/timeline/contributionInspectorSchema.ts#L11) | `blackboardField` | `Extract<keyof T, string>` |
| XE-194 | [src/ui/timeline/durationBarColor.ts:62](../../src/ui/timeline/durationBarColor.ts#L62) | `durationColorSource` | `Exclude<DurationColorSource, 'anomaly'>` |
| XE-195 | [src/ui/timeline/inspectorFields.ts:208](../../src/ui/timeline/inspectorFields.ts#L208) | `inspectorField` | `Extract<keyof T, string>` |
| XE-196 | [src/ui/timeline/projectOpenFailureMessage.ts:5](../../src/ui/timeline/projectOpenFailureMessage.ts#L5) | `projectOpenFailureMessage` | `Exclude<OpenProjectResult, { ok: true }>` |

## T：测试与类型断言（40 处）

随对应生产批次：使用权威成员类型，并检查 never 空集、断言绕过与独立性。

| 编号 | 位置 | 拥有者 | 当前表达式 |
| --- | --- | --- | --- |
| XE-015 | [src/application/generatedWeaponStateBranches.test.ts:129](../../src/application/generatedWeaponStateBranches.test.ts#L129) | `findPhysicalInfliction` | `Extract<CombatStepDefinition, { kind: 'applyPhysicalInfliction' }>` |
| XE-016 | [src/application/generatedWeaponStateBranches.test.ts:132](../../src/application/generatedWeaponStateBranches.test.ts#L132) | `findPhysicalInfliction` | `Extract<CombatStepDefinition, { kind: 'applyPhysicalInfliction' }>` |
| XE-026 | [src/core/combat/damage/playerActiveDamageInput.test.ts:34](../../src/core/combat/damage/playerActiveDamageInput.test.ts#L34) | `findDamageStep` | `Extract<ResolvedCombatStep, { kind: 'dealDamage' }>` |
| XE-056 | [src/core/combat/runtime/comboWindowOperationExecutor.test.ts:76](../../src/core/combat/runtime/comboWindowOperationExecutor.test.ts#L76) | `step` | `Extract<ResolvedCombatStep, { kind: 'openComboWindow' }>` |
| XE-057 | [src/core/combat/runtime/comboWindowOperationExecutor.test.ts:102](../../src/core/combat/runtime/comboWindowOperationExecutor.test.ts#L102) | `step` | `Extract<ResolvedCombatStep, { kind: 'openComboWindow' }>` |
| XE-059 | [src/core/combat/runtime/elementalInflictionOperationExecutor.test.ts:12](../../src/core/combat/runtime/elementalInflictionOperationExecutor.test.ts#L12) | `STEP` | `Extract<ResolvedCombatStep, { kind: 'applyElementalInfliction' }>` |
| XE-061 | [src/core/combat/runtime/elementalReactionOperationExecutor.test.ts:42](../../src/core/combat/runtime/elementalReactionOperationExecutor.test.ts#L42) | `step` | `Extract<ResolvedCombatStep, { kind: 'applyElementalReaction' }>` |
| XE-062 | [src/core/combat/runtime/elementalReactionOperationExecutor.test.ts:65](../../src/core/combat/runtime/elementalReactionOperationExecutor.test.ts#L65) | `step` | `Extract<ResolvedCombatStep, { kind: 'applyElementalReaction' }>` |
| XE-063 | [src/core/combat/runtime/elementalReactionOperationExecutor.test.ts:94](../../src/core/combat/runtime/elementalReactionOperationExecutor.test.ts#L94) | `apply` | `Extract<ResolvedCombatStep, { kind: 'applyElementalReaction' }>` |
| XE-064 | [src/core/combat/runtime/elementalReactionOperationExecutor.test.ts:103](../../src/core/combat/runtime/elementalReactionOperationExecutor.test.ts#L103) | `consume` | `Extract<ResolvedCombatStep, { kind: 'consumeElementalReaction' }>` |
| XE-065 | [src/core/combat/runtime/elementalReactionOperationExecutor.test.ts:121](../../src/core/combat/runtime/elementalReactionOperationExecutor.test.ts#L121) | `consume` | `Extract<ResolvedCombatStep, { kind: 'consumeElementalReaction' }>` |
| XE-074 | [src/core/combat/runtime/playerDamageOperationExecutor.test.ts:16](../../src/core/combat/runtime/playerDamageOperationExecutor.test.ts#L16) | `DAMAGE_STEP` | `Extract<ResolvedCombatStep, { kind: 'dealDamage' }>` |
| XE-075 | [src/core/combat/runtime/playerDamageOperationExecutor.test.ts:856](../../src/core/combat/runtime/playerDamageOperationExecutor.test.ts#L856) | `step` | `Exclude<ResolvedCombatStep, { kind: 'conditional' }>` |
| XE-081 | [src/core/combat/runtime/standardPlayerDamageEnvironment.test.ts:47](../../src/core/combat/runtime/standardPlayerDamageEnvironment.test.ts#L47) | `damageStep` | `Extract<ResolvedCombatStep, { kind: 'dealDamage' }>` |
| XE-083 | [src/core/combat/runtime/staticPlayerDamageSnapshots.test.ts:112](../../src/core/combat/runtime/staticPlayerDamageSnapshots.test.ts#L112) | `electricDamage` | `Extract<ResolvedCombatStep, { kind: 'dealDamage' }>` |
| XE-086 | [src/core/combat/runtime/switchActionRuntime.test.ts:18](../../src/core/combat/runtime/switchActionRuntime.test.ts#L18) | `select` | `Extract<ResolvedCombatStep, { kind: 'switch' }>` |
| XE-089 | [src/core/combat/runtime/timeDilationOperationExecutor.test.ts:32](../../src/core/combat/runtime/timeDilationOperationExecutor.test.ts#L32) | `step` | `Extract<ResolvedCombatStep, { kind: 'startTimeDilation' }>` |
| XE-090 | [src/core/combat/runtime/timeDilationOperationExecutor.test.ts:66](../../src/core/combat/runtime/timeDilationOperationExecutor.test.ts#L66) | `step` | `Extract<ResolvedCombatStep, { kind: 'startTimeDilation' }>` |
| XE-091 | [src/core/combat/runtime/timeDilationOperationExecutor.test.ts:95](../../src/core/combat/runtime/timeDilationOperationExecutor.test.ts#L95) | `step` | `Extract<ResolvedCombatStep, { kind: 'startTimeDilation' }>` |
| XE-092 | [src/core/combat/runtime/timeDilationOperationExecutor.test.ts:140](../../src/core/combat/runtime/timeDilationOperationExecutor.test.ts#L140) | `step` | `Extract<ResolvedCombatStep, { kind: 'startTimeDilation' }>` |
| XE-093 | [src/core/combat/runtime/timeDilationOperationExecutor.test.ts:267](../../src/core/combat/runtime/timeDilationOperationExecutor.test.ts#L267) | `step` | `Extract<ResolvedCombatStep, { kind: 'setIgnoreGlobalTimeScale' }>` |
| XE-094 | [src/core/combat/runtime/timeDilationOperationExecutor.test.ts:322](../../src/core/combat/runtime/timeDilationOperationExecutor.test.ts#L322) | `step` | `Extract<ResolvedCombatStep, { kind: 'startUltimateTimeDilation' }>` |
| XE-152 | [src/ui/timeline/components/EventListenerStepEditor.history.test.ts:10](../../src/ui/timeline/components/EventListenerStepEditor.history.test.ts#L10) | `Listener` | `Extract<CombatStepDefinition, { kind: 'listenForCombatEvents' }>` |
| XE-192 | [src/ui/timeline/conditionQueryInspector.test.ts:14](../../src/ui/timeline/conditionQueryInspector.test.ts#L14) | `QueryCondition` | `Extract<CombatCondition, { kind: 'buffBlackboardValueCompare' }>` |
| XE-265 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:79](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L79) | `IncompatibleParameters` | `Extract< CompiledBuffStepSource, { kind: K } >` |
| XE-266 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:101](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L101) | `BlackboardPatch` | `Extract< CompiledOperatorProgressionEntrySource, { kind: 'skillBlackboardModifier' } >` |
| XE-267 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:146](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L146) | `SourceFile` | `Extract<keyof Runtime, 'eventHandlers' \| 'displayName'>` |
| XE-268 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:158](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L158) | `SourceFile` | `Extract<keyof Active, 'eventHandlers' \| 'availability'>` |
| XE-269 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:177](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L177) | `ProjectedParameters` | `Extract< CompiledBuffStepSource, { kind: K } >` |
| XE-270 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:193](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L193) | `SourceFile` | `Extract<keyof CompiledWeaponStaticDefinitionSource, 'displayName'>` |
| XE-271 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:197](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L197) | `SemanticEvent` | `Extract<CompiledWeaponEventHandlerSource, { event: unknown }>` |
| XE-272 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:198](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L198) | `AbilityEvent` | `Extract< CompiledWeaponEventHandlerSource, { abilityEvent: unknown } >` |
| XE-273 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:208](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L208) | `SourceFile` | `Extract<SemanticEvent, { kind: 'physicalInflictionApplied' }>` |
| XE-274 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:216](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L216) | `SourceFile` | `Extract< keyof Extract<SemanticEvent, { kind: 'buffConsumed' \| 'spGained' }>, 'buffIds' \| 'source' \| 'gainKind' >` |
| XE-275 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:217](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L217) | `SourceFile` | `Extract<SemanticEvent, { kind: 'buffConsumed' \| 'spGained' }>` |
| XE-276 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:244](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L244) | `SourceFile` | `Extract<CompiledBuffConditionSource, { kind: 'healthCompare' }>` |
| XE-277 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:249](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L249) | `SourceFile` | `Extract<CompiledBuffConditionSource, { kind: 'buffStackCompare' }>` |
| XE-278 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:252](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L252) | `SourceFile` | `Extract<CompiledBuffConditionSource, { kind: 'buffIdStackCompare' }>` |
| XE-279 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:258](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L258) | `SourceFile` | `Extract<ProjectedParameters<'startTimeDilation'>, { scope: 'entity' }>` |
| XE-280 | [tools/game-data-compiler/test/compiledCombatContract.test.ts:267](../../tools/game-data-compiler/test/compiledCombatContract.test.ts#L267) | `SourceFile` | `Extract<keyof ProjectedParameters<'applyBuff'>, 'definition' \| 'durationSeconds'>` |
