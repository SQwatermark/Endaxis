import { projectGameplayTags } from './combatProjectionCommon.ts';
import {
  compileEventTargetSimpleDamageOperationSource,
  compileEventTargetSimplePoiseOperationSource,
} from './simpleDamageOperation.ts';
import { type CompiledActionValueOperandSource } from './combatActionProjectionTypes.ts';
import { COMPILED_BUFF_CAPTURED_TARGET_GROUPS } from './compiledBuffMetadata.ts';
import type { BuffApplicationActionSource } from '../source/buffActions.ts';
import type { NativeActionNodeSource } from '../source/controlFlow.ts';
import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import type { TargetReferenceSource } from '../source/target.ts';
import type { CompiledBuffStepSource } from './combatActionProjectionTypes.ts';
import type { BlackboardAssignmentSource } from '../source/assignments.ts';
import { projectElementalInflictionAction } from './elementalInflictionProjection.ts';
import { projectKnockDownAction } from './knockDownProjection.ts';
import { projectPhysicalInflictionAction } from './physicalInflictionProjection.ts';
import { projectBuffIgniteAction } from './buffIgniteProjection.ts';
import { projectKeywordBuffAction } from './keywordBuffProjection.ts';
import {
  type ProjectedTargetGroup,
  type CombatActionProjectionContextSource,
  type CombatActionProjectionExtensionsSource,
  BUFF_ACTION_CONTEXT,
  requireActionOwnerProjection,
  isPartyExceptOwnerInstantSearch,
  isControlledOperatorInstantSearch,
  isPartyInstantSearch,
  isUniqueEnemyMainTargetInstantSearch,
  isUniqueEnemyHitBoxInstantSearch,
  actionValueOperand,
} from './combatProjectionCommon.ts';
import { gameplayTagIdFromPath } from '../source/nativeGameplayTags.ts';
import type {
  BuffApplicationSource,
  BuffApplicationTarget,
} from '../../../../packages/game-data-contract/src/primitives.ts';
import { projectCombatRuntimeAttributeKey } from './attributeModifier.ts';
import { standardStumpBuffAbilityEventOmissionReason } from './standardStumpScenarioPolicy.ts';
import { isPresentationOnlyActionSequence } from './skillPresentationTargets.ts';

/** 不改变命名目标组状态的普通动作叶子投影。
 * 保留各动作的来源/目标和场景约束；不递归调用序列编排器。 */

/** 动作赋值的数值部分；直接字符串由 projectStringBuffAssignments 独立输出。 */
export function projectBuffAssignments(
  assignments: readonly BlackboardAssignmentSource[],
  sourcePath: string,
): Readonly<Record<string, CompiledActionValueOperandSource>> {
  const entries: Array<readonly [string, CompiledActionValueOperandSource]> = [];
  assignments.forEach((item, index) => {
    if (!item.useDirectValue) {
      entries.push([item.targetKey, { kind: 'blackboard', key: item.inputValueKey }]);
      return;
    }
    if (item.valueType === 'String') return;
    if (item.valueType !== 'Numeric') {
      throw new Error(
        `${sourcePath}.assignItems[${index}]: unsupported direct Buff assignment type ${item.valueType}`,
      );
    }
    entries.push([item.targetKey, { kind: 'constant', value: item.numericValue }]);
  });
  return Object.fromEntries(entries);
}

/** 原生直接字符串黑板赋值；不把字符串伪装成数值 ActionValueOperand。 */
export function projectStringBuffAssignments(
  assignments: readonly BlackboardAssignmentSource[],
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    assignments.flatMap(item =>
      item.useDirectValue && item.valueType === 'String'
        ? [[item.targetKey, item.stringValue] as const]
        : [],
    ),
  );
}

export function compileActionNode(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
  partyTargetGroups: ReadonlyMap<string, ProjectedTargetGroup> = new Map(),
  context: CombatActionProjectionContextSource = BUFF_ACTION_CONTEXT,
  extensions: CombatActionProjectionExtensionsSource = {},
): CompiledBuffStepSource[] {
  if (node.body.kind !== 'leaf') {
    throw new Error(`${node.sourcePath}: unsupported Buff runtime action`);
  }
  if (node.body.value.family === 'physicalInfliction') {
    return [
      node.body.value.action.kind === 'knockDown'
        ? projectKnockDownAction(node.body.value.action, node.sourcePath, context)
        : projectPhysicalInflictionAction(node.body.value.action, node.sourcePath, context),
    ];
  }
  if (
    context.actionTargetTarget === 'currentAbilityEntity' &&
    ![
      'buffApplication',
      'blackboardMutation',
      'blackboardCalculation',
      'eventPayload',
      'timedMarker',
      'skillCast',
    ].includes(node.body.value.family)
  )
    throw new Error(`${node.sourcePath}: unaudited AbilityEntity action ${node.body.value.family}`);
  if (
    context.actionTargetTarget === 'enemy' &&
    ![
      'damage',
      'heal',
      'buffApplication',
      'buffInheritance',
      'buffBlackboardRead',
      'buffQuery',
      'buffFinish',
      'buffHold',
      'dispel',
      'normalSkillUltimateEnergy',
      'blackboardMutation',
      'blackboardCalculation',
      'eventPayload',
      'timelineRead',
      'randomBlackboard',
      'attributeSnapshot',
      'resource',
      'finisherSpGain',
      'presentation',
      'presentationCalculation',
      'spatial',
      'spatialMeasurement',
      'selfDefense',
      'projectileControl',
      'animationTiming',
      'animationEventListener',
      'inputControl',
      'castingControl',
      'timeDilation',
      'timedMarker',
      // 动作自身仍严格要求 Owner/Source 解析为 caster；敌人 Target 只是技能命中上下文。
      'globalCooldown',
      'modeAndResourcePolicy',
      'skillCooldownMutation',
      'skillSlotReplacement',
      'eventListener',
      'environment',
      'elementalInfliction',
      'buffIgnite',
      'forcedElementalStatus',
      'spellBurstEvent',
      'customAbilityEvent',
      'skillCast',
      // Pending 自身仍在下方严格校验固定候选角色、敌人目标、trigger 与空赋值。
      'comboPending',
      'aiMarker',
      'levelEvent',
      'aura',
      'keywordBuff',
      'rayCastTargetGroup',
    ].includes(node.body.value.family)
  )
    throw new Error(`${node.sourcePath}: unaudited single-enemy action ${node.body.value.family}`);
  if (
    context.actionTargetTarget === 'eventSource' &&
    ![
      'buffApplication',
      'buffFinish',
      'buffBlackboardRead',
      'blackboardCalculation',
      'blackboardMutation',
      'eventPayload',
      'presentation',
      'timedMarker',
      'modeAndResourcePolicy',
      'skillCooldownMutation',
      // OnBeforeTakeDamage may refund the listening Buff source's resources.
      // The resource branch below still requires the source to be the proven fixed caster.
      'resource',
      // 受击侧 Buff 可以基于本次伤害再结算一段反击伤害；下方 damage 投影仍校验
      // 事件来源、固定 Buff owner 与 DamageAction 目标，不能把普通受击回调一概放行。
      'damage',
      // 受击侧 Buff 可以治疗自身；heal 分支仍严格校验 healer、目标和计算式。
      'heal',
    ].includes(node.body.value.family)
  )
    throw new Error(
      `${node.sourcePath}: unaudited receiving Buff event action ${node.body.value.family}`,
    );
  if (node.body.value.family === 'buffApplication') {
    return compileBuffApplication(
      node.body.value.action,
      visualOnlyIds,
      node.sourcePath,
      partyTargetGroups,
      context,
    );
  }
  if (node.body.value.family === 'timelineRead') {
    const action = node.body.value.action;
    const target = action.target;
    if (
      action.kind !== 'storeCurrentSkillExecuteFrame' ||
      target.targetSource !== 'Owner' ||
      target.targetGroupKey !== '' ||
      !(
        context.actionOwnerTarget === 'caster' ||
        (context.actionOwnerTarget === 'buffOwner' && context.fixedBuffOwnerTarget === 'caster')
      ) ||
      target.finderType !== null ||
      target.validatorTypes.length !== 0 ||
      target.postProcessorTypes.length !== 0 ||
      target.priorityFilters.length !== 0 ||
      target.shuffleTargets.length !== 0 ||
      target.distanceValidators.length !== 0 ||
      target.finderSpawnedObjectType !== null ||
      target.validatorTagQueries.length !== 0
    ) {
      throw new Error(`${node.sourcePath}: unsupported current skill timeline frame target`);
    }
    return [{ kind: 'storeCurrentTimelineFrame', parameters: { outputKey: action.outputKey } }];
  }
  if (node.body.value.family === 'eventPayload') {
    const action = node.body.value.action;
    if (action.valueKey.length === 0 && action.realDeltaKey.length === 0) {
      throw new Error(`${node.sourcePath}: SaveAtbObtainValue has no output key`);
    }
    return [
      {
        kind: 'storeEventSpGainAmount',
        parameters: {
          ...(action.valueKey.length === 0 ? {} : { outputKey: action.valueKey }),
          ...(action.realDeltaKey.length === 0 ? {} : { realDeltaOutputKey: action.realDeltaKey }),
        },
      },
    ];
  }
  if (node.body.value.family === 'levelEvent') {
    if (
      node.body.value.action.kind === 'physicalNoGuardStartedEvent' &&
      context.actionOwnerTarget !== 'buffOwner'
    ) {
      throw new Error(`${node.sourcePath}: OnPhysicalNoGuardStart requires a Buff environment`);
    }
    // combat-spec：该动作只发布 GameLevelEvent/BattleRecorder 事实；Next 木桩没有其消费者，
    // 状态本身由承载 Buff 生命周期表示，故不重复建立另一套状态。
    return [];
  }
  if (node.body.value.family === 'comboQte') {
    // ShowComboRingQte 的提示本身不执行战斗步骤；Buff 投影层会把已严格关联的有效
    // 计时窗口编译为 beforeCastSkill 响应。不能在这里把“显示提示”当成自动成功。
    return [];
  }
  if (node.body.value.family === 'buffIgnite') {
    return [projectBuffIgniteAction(node.body.value.action, node.sourcePath, context)];
  }
  if (node.body.value.family === 'spellBurstEvent') {
    return [
      {
        kind: 'triggerSpellBurst',
        parameters: { burstType: node.body.value.action.element },
      },
    ];
  }
  if (node.body.value.family === 'customAbilityEvent') {
    const action = node.body.value.action;
    const sourceIsCaster =
      action.eventSource.targetSource === 'Source' &&
      action.eventSource.targetGroupKey === '' &&
      context.actionSourceTarget === 'caster';
    const sourceIsActionOwnerAbilityEntity =
      action.eventSource.targetSource === 'Owner' &&
      action.eventSource.targetGroupKey === '' &&
      (context.actionOwnerTarget === 'currentAbilityEntity' ||
        (context.actionOwnerTarget === 'buffOwner' &&
          context.fixedBuffOwnerTarget === 'currentAbilityEntity'));
    const targetIsCaster =
      action.targets.targetSource === 'Source' &&
      action.targets.targetGroupKey === '' &&
      context.actionSourceTarget === 'caster';
    if (
      (!sourceIsCaster && !sourceIsActionOwnerAbilityEntity) ||
      !targetIsCaster ||
      action.eventName.blackboardKey !== null ||
      action.eventName.value.length === 0 ||
      action.eventParam.blackboardKey !== null
    ) {
      throw new Error(`${node.sourcePath}: unsupported custom ability event source/target/value`);
    }
    return [
      {
        kind: 'triggerCustomAbilityEvent',
        parameters: {
          eventName: action.eventName.value,
          eventParam: action.eventParam.value,
          target: 'caster',
          source: sourceIsActionOwnerAbilityEntity ? 'currentAbilityEntity' : 'caster',
        },
      },
    ];
  }
  if (node.body.value.family === 'skillCast') {
    const action = node.body.value.action;
    const abilityEntityCaster =
      action.caster.targetSource === 'Target' &&
      action.caster.targetGroupKey === '' &&
      context.actionTargetTarget === 'currentAbilityEntity';
    const abilityEntityTargetIsFixedEnemy =
      action.target.targetSource === 'Owner' &&
      action.target.targetGroupKey === '' &&
      context.actionOwnerTarget === 'buffOwner' &&
      context.fixedBuffOwnerTarget === 'enemy';
    if (
      abilityEntityCaster &&
      abilityEntityTargetIsFixedEnemy &&
      action.skillId.blackboardKey === null &&
      action.skillId.value.length > 0 &&
      !action.skipApplyCost &&
      action.inheritSourceSkillCastId
    ) {
      return [
        {
          kind: 'startCurrentAbilityEntityChildSkillById',
          parameters: { childSkillId: action.skillId.value },
        },
      ];
    }
    const casterIsFixedCaster =
      (action.caster.targetSource === 'Source' || action.caster.targetSource === 'Owner') &&
      action.caster.targetGroupKey === '' &&
      (action.caster.targetSource === 'Owner'
        ? context.fixedBuffOwnerTarget === 'caster' || context.actionOwnerTarget === 'caster'
        : context.actionSourceTarget === 'caster' || context.fixedBuffSourceTarget === 'caster');
    const targetIsStaticEnemy =
      (action.target.targetSource === 'Context' &&
        action.target.targetGroupKey !== '' &&
        context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey) === true) ||
      // AbilityActionUtils.GetTargetsView 的 MainTarget 分支直接读取 BattleManager 主目标，
      // 不消费 TargetSettings 中残留的命名组或 selector。固定唯一木桩模型下其身份就是 enemy。
      action.target.targetSource === 'MainTarget';
    const targetIsFixedCaster =
      action.target.targetSource === 'Owner' &&
      action.target.targetGroupKey === '' &&
      (context.fixedBuffOwnerTarget === 'caster' || context.actionOwnerTarget === 'caster');
    if (
      !casterIsFixedCaster ||
      (!targetIsStaticEnemy && !targetIsFixedCaster) ||
      action.skillId.blackboardKey !== null ||
      action.skillId.value.length === 0
    ) {
      throw new Error(`${node.sourcePath}: unsupported deferred skill cast source/target/id`);
    }
    return [
      {
        kind: 'castSkillDuringAction',
        parameters: {
          skillId: action.skillId.value,
          target: targetIsFixedCaster ? 'caster' : 'enemy',
          skipApplyCost: action.skipApplyCost,
          inheritSourceSkillCastInfo: action.inheritSourceSkillCastId,
        },
      },
    ];
  }
  if (node.body.value.family === 'aiMarker') {
    const action = node.body.value.action;
    if (
      action.owner.targetSource !== 'Source' ||
      action.owner.targetGroupKey !== '' ||
      context.actionSourceTarget !== 'caster'
    ) {
      throw new Error(`${node.sourcePath}: unsupported AI marker owner`);
    }
    // combat-spec/ai-marker-action.md：消费者位于敌方主动 AI 行为。Endaxis 的被动单木桩
    // 不执行该系统；来源字段仍被完整解析，不能伪装为 GameplayTag 或 TimedMarker。
    return [];
  }
  if (node.body.value.family === 'buffInheritance') {
    const action = node.body.value.action;
    if (visualOnlyIds.has(action.targetBuffId)) return [];
    const targetsCaster =
      action.owner.targetGroupKey === '' &&
      ((action.owner.targetSource === 'Source' && context.actionSourceTarget === 'caster') ||
        (action.owner.targetSource === 'Owner' && context.actionOwnerTarget === 'caster'));
    if (!targetsCaster) {
      throw new Error(`${node.sourcePath}: unsupported inherited Buff owner`);
    }
    return [
      {
        kind: 'inheritBuffById',
        parameters: {
          target: 'caster',
          buffId: action.targetBuffId,
          inheritToNextSkillIds: action.inheritSkillIds,
          finishByAction: action.finishByAction,
          finishWithNextSkillIfNotInherited: action.finishWithNextSkillIfNotInherited,
        },
      },
    ];
  }
  if (node.body.value.family === 'modeAndResourcePolicy') {
    const action = node.body.value.action;
    if (action.kind === 'switchMode') {
      if (
        !action.resetOnEnd ||
        action.interruptCurrentSkillWhenStart ||
        action.interruptCurrentSkillWhenEnd
      ) {
        throw new Error(`${node.sourcePath}: unsupported SwitchMode lifecycle options`);
      }
      return [
        {
          kind: 'changePlayerActionMode',
          parameters: { modeId: action.modeId, lifetime: 'finishByAction' },
        },
      ];
    }
    if (
      (action.target.targetSource !== 'Source' && action.target.targetSource !== 'Owner') ||
      action.target.targetGroupKey !== '' ||
      (action.target.targetSource === 'Source'
        ? context.actionSourceTarget !== 'caster' && context.fixedBuffSourceTarget !== 'caster'
        : context.actionOwnerTarget !== 'caster' && context.fixedBuffOwnerTarget !== 'caster')
    ) {
      throw new Error(`${node.sourcePath}: unsupported ultimate-energy restriction target`);
    }
    return [
      {
        kind: 'restrictUltimateEnergyRecovery',
        parameters: {
          target: 'caster',
          allowedRecoveryTags: projectGameplayTags(
            action.allowedRecoveryTagIds,
            context,
            node.sourcePath,
          ),
          clearUltimateEnergyOnEnd: action.clearUltimateEnergyOnEnd,
        },
      },
    ];
  }
  if (node.body.value.family === 'skillCooldownMutation') {
    const action = node.body.value.action;
    const targetsCaster =
      (action.target.targetSource === 'Owner' &&
        (context.actionOwnerTarget === 'caster' ||
          (context.actionOwnerTarget === 'buffOwner' &&
            context.fixedBuffOwnerTarget === 'caster'))) ||
      (action.target.targetSource === 'Source' &&
        (context.actionSourceTarget === 'caster' || context.fixedBuffSourceTarget === 'caster'));
    if (action.target.targetGroupKey !== '' || !targetsCaster) {
      throw new Error(`${node.sourcePath}: unsupported skill cooldown target`);
    }
    return [
      {
        kind: 'adjustSkillCooldown',
        parameters: {
          target: 'caster',
          skill: action.skill,
          operation: action.operation,
          basis: action.basis,
          value: actionValueOperand(action.value),
        },
      },
    ];
  }
  if (node.body.value.family === 'buffModifierRefresh') {
    return [{ kind: 'refreshCurrentBuffAttributeModifiers', parameters: {} }];
  }
  if (node.body.value.family === 'eventListener') {
    if (
      node.body.value.action.events.every(
        event => standardStumpBuffAbilityEventOmissionReason(event.abilityEvent) !== null,
      )
    ) {
      // 技能临时监听器与 Buff 监听器共享同一场景边界：固定时间轴不会在结束前离战。
      // 响应动作只保留在来源 IR，不能被提升为无条件清理或跳转。
      return [];
    }
    if (
      node.body.value.action.events.every(event => event.abilityEvent === 'OnBeforeOutputAirborne')
    ) {
      // combat-spec 的 1.4.4 AirborneAction 反编译路径只发布通用物理异常事件，
      // 明确不合成旧的 OnBeforeOutputAirborne/OnAfterOutputAirborne 事件。
      return [];
    }
    if (
      context.actionOwnerTarget === 'caster' &&
      node.body.value.action.events.every(event => event.abilityEvent === 'OnBeforeTakeDamage')
    ) {
      // EventListenerAction 在 ActionOwner 注册；木桩不攻击，干员不会收到伤害包。
      // 只省略干员受伤前监听，不能删除敌人受伤或干员输出伤害的监听。
      return [];
    }
    if (node.body.value.action.events.every(event => event.abilityEvent === 'OnAfterKillEntity')) {
      // 固定木桩死亡后不再继续累计有效伤害；击杀后的延迟资源返还不进入模拟可见结果。
      return [];
    }
    throw new Error(`${node.sourcePath}: unsupported combat-visible EventListenerAction`);
  }
  if (node.body.value.family === 'aura') {
    const aura = node.body.value.action;
    if (aura.kind !== 'globalPartyAura') {
      throw new Error(`${node.sourcePath}: Aura reference slice cannot enter runtime projection`);
    }
    const auraBuffSource =
      aura.buffSource === 'ActionOwner'
        ? context.actionOwnerTarget === 'currentAbilityEntity'
          ? ('currentAbilityEntity' as const)
          : context.actionOwnerTarget === 'buffOwner'
            ? ('buffOwner' as const)
            : context.actionOwnerTarget === 'caster'
              ? undefined
              : null
        : context.actionSourceTarget === 'buffSource'
          ? ('buffSource' as const)
          : undefined;
    if (auraBuffSource === null) {
      throw new Error(`${node.sourcePath}: Aura Buff source is unavailable`);
    }
    const exitBuffs = aura.exitBuffs.flatMap((entry, index) => {
      if (visualOnlyIds.has(entry.buffId)) return [];
      const assignments = entry.assignBlackboard
        ? projectBuffAssignments(
            entry.assignments,
            `${node.sourcePath}.actionWhenExitAura[${index}]`,
          )
        : {};
      const stringAssignments = entry.assignBlackboard
        ? projectStringBuffAssignments(entry.assignments)
        : {};
      if (!entry.assignBlackboard && entry.assignments.length > 0) {
        throw new Error(
          `${node.sourcePath}.actionWhenExitAura[${index}]: disabled assignment is nonempty`,
        );
      }
      return [
        {
          buffId: entry.buffId,
          target: aura.target,
          ...(auraBuffSource === undefined ? {} : { source: auraBuffSource }),
          inheritSourceSkillCastInfo: true,
          ...(Object.keys(assignments).length === 0 ? {} : { blackboardAssignments: assignments }),
          ...(Object.keys(stringAssignments).length === 0
            ? {}
            : { stringBlackboardAssignments: stringAssignments }),
        },
      ];
    });
    const activeBuffs = aura.buffs.filter(entry => !visualOnlyIds.has(entry.buffId));
    const enterCleanupSteps =
      (aura.enterCleanupBuffIds ?? []).length === 0
        ? []
        : [
            {
              kind: 'finishBuffsById' as const,
              parameters: {
                target: aura.target,
                buffIds: aura.enterCleanupBuffIds!,
                reason: 'other' as const,
              },
            },
          ];
    const applicationSteps = activeBuffs.flatMap((entry, index) => {
      const assignments = entry.assignBlackboard
        ? projectBuffAssignments(entry.assignments, `${node.sourcePath}.buffInput[${index}]`)
        : {};
      const stringAssignments = entry.assignBlackboard
        ? projectStringBuffAssignments(entry.assignments)
        : {};
      if (!entry.assignBlackboard && entry.assignments.length > 0) {
        throw new Error(
          `${node.sourcePath}.buffInput[${index}]: disabled Aura assignment is nonempty`,
        );
      }
      return [
        {
          kind: 'applyBuff' as const,
          parameters: {
            buffId: entry.buffId,
            target: aura.target,
            ...(auraBuffSource === undefined ? {} : { source: auraBuffSource }),
            finishByAction: true,
            ...(index === 0 && exitBuffs.length > 0 ? { onActionEndBuffs: exitBuffs } : {}),
            ...(aura.inheritSourceSkillCastInfo ? { inheritSourceSkillCastInfo: true } : {}),
            ...(Object.keys(assignments).length === 0
              ? {}
              : { blackboardAssignments: assignments }),
            ...(Object.keys(stringAssignments).length === 0
              ? {}
              : { stringBlackboardAssignments: stringAssignments }),
          },
        },
      ];
    });
    // fixedWhenStart 和 RangedAura 的空间黑板只决定 Aura 中心/覆盖范围；固定零空间中
    // 唯一敌人或既定友方集合从动作开始即在范围内。Good+All 额外覆盖的友方非角色
    // 没有可编辑轨道实例；其移动/表现状态不进入木桩账本，但来源事实已由 Aura IR 保留。
    // 图标倒计时覆盖只影响展示来源，不改变这里由动作寿命控制的 Buff 安装与离场清理。
    return [...enterCleanupSteps, ...applicationSteps];
  }
  if (node.body.value.family === 'buffFinish') {
    const action = node.body.value.action;
    const ownerIsPartyInstantSearch = isPartyInstantSearch(action.owner);
    const finishSourceIsCasterOwner =
      action.finishSource.targetSource === 'Owner' &&
      action.finishSource.targetGroupKey === '' &&
      (context.actionOwnerTarget === 'caster' ||
        (context.actionOwnerTarget === 'buffOwner' && context.fixedBuffOwnerTarget === 'caster'));
    const ownerContextTarget =
      action.owner.targetSource === 'Context' &&
      action.owner.targetGroupKey !== '' &&
      (partyTargetGroups.get(action.owner.targetGroupKey) ??
        (context.staticEnemyTargetGroupKeys?.has(action.owner.targetGroupKey) === true
          ? 'enemy'
          : undefined));
    if (
      (!ownerIsPartyInstantSearch &&
        ownerContextTarget === undefined &&
        ((action.owner.targetSource !== 'Owner' &&
          action.owner.targetSource !== 'Source' &&
          action.owner.targetSource !== 'Target') ||
          action.owner.targetGroupKey !== '')) ||
      action.limitSource ||
      action.buffSource.targetSource !== 'Source' ||
      action.buffSource.targetGroupKey !== '' ||
      ((action.finishSource.targetSource !== 'Source' ||
        action.finishSource.targetGroupKey !== '') &&
        !finishSourceIsCasterOwner)
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff finish target/source`);
    }
    const target = ownerIsPartyInstantSearch
      ? ('party' as const)
      : ownerContextTarget === 'party'
        ? ('party' as const)
        : ownerContextTarget === 'buffSource'
          ? ('buffSource' as const)
          : ownerContextTarget === 'enemy'
            ? ('enemy' as const)
            : action.owner.targetSource === 'Owner'
              ? requireActionOwnerProjection(context, node.sourcePath)
              : action.owner.targetSource === 'Source'
                ? 'caster'
                : context.actionTargetTarget === 'enemy' ||
                    context.actionTargetTarget === 'buffOwner' ||
                    context.actionTargetTarget === 'caster' ||
                    context.actionTargetTarget === 'currentAbilityEntity'
                  ? context.actionTargetTarget
                  : (() => {
                      throw new Error(
                        `${node.sourcePath}: Buff finish Target projection is unavailable`,
                      );
                    })();
    if (
      action.kind === 'buffFinishByQuery' &&
      action.settings.checkType === 'Tag' &&
      action.settings.tagQuery.tagIds.length > 0
    ) {
      if (target === 'party')
        throw new Error(`${node.sourcePath}: Buff finish-by-tag party target is unsupported`);
      return [
        {
          kind: 'finishBuffsByTag',
          parameters: {
            target,
            tagQueryType: action.settings.tagQuery.queryType,
            buffTags: projectGameplayTags(
              action.settings.tagQuery.tagIds,
              context,
              node.sourcePath,
            ),
            reason: action.isFinishedEarly ? 'early' : action.isAbsorbed ? 'absorbed' : 'other',
            ...(action.finishAll ? {} : { count: actionValueOperand(action.finishLayerCount) }),
          },
        },
      ];
    }
    if (
      action.kind === 'buffFinishByQuery' &&
      action.settings.checkType === 'Id' &&
      action.settings.buffIds.length === 0
    ) {
      // 原生 Id 分支逐项遍历 buffIdList；空列表不会调用 BuffContainer，且不会退化为“全部”。
      return [];
    }
    if (
      action.kind === 'buffFinishByQuery' &&
      action.settings.checkType === 'Environment' &&
      action.settings.buffIds.length === 0 &&
      action.settings.tagQuery.tagIds.length === 0 &&
      action.owner.targetSource === 'Owner' &&
      context.actionOwnerTarget === 'buffOwner' &&
      action.finishAll
    ) {
      // Environment 精确指向当前正在执行动作的 Buff 实例，不是“全部 Buff”查询。
      return [
        {
          kind: 'finishCurrentBuff',
          parameters: {
            reason: action.isFinishedEarly ? 'early' : action.isAbsorbed ? 'absorbed' : 'other',
          },
        },
      ];
    }
    const buffIds =
      action.kind === 'buffFinishById'
        ? action.buffIds
        : action.settings.checkType === 'Id' &&
            action.settings.buffIds.length > 0 &&
            action.settings.tagQuery.tagIds.length === 0
          ? action.settings.buffIds
          : null;
    if (buffIds === null || buffIds.length === 0 || buffIds.some(id => id.length === 0)) {
      throw new Error(`${node.sourcePath}: unsupported Buff finish query`);
    }
    return [
      {
        kind: 'finishBuffsById',
        parameters: {
          // combat-spec 的公共 TargetSettings 语义：Buff 环境 Owner 是 Buff 接收者，
          // Source 是 Buff 来源。这里保持二者身份，不因多数样本使用 Owner 而合并。
          target,
          buffIds,
          reason: action.isFinishedEarly
            ? 'early'
            : action.kind === 'buffFinishByQuery' && action.isAbsorbed
              ? 'absorbed'
              : 'other',
          ...(action.finishAll ? {} : { count: actionValueOperand(action.finishLayerCount) }),
        },
      },
    ];
  }
  if (node.body.value.family === 'buffHold') {
    const action = node.body.value.action;
    const targetsCaster =
      action.owner.targetGroupKey === '' &&
      ((action.owner.targetSource === 'Source' && context.actionSourceTarget === 'caster') ||
        (action.owner.targetSource === 'Owner' &&
          (context.actionOwnerTarget === 'caster' ||
            (context.actionOwnerTarget === 'buffOwner' &&
              context.fixedBuffOwnerTarget === 'caster'))));
    if (!targetsCaster) {
      throw new Error(`${node.sourcePath}: unsupported ExtendBuffAction owner`);
    }
    const buffIds =
      action.settings.checkType === 'Id' &&
      action.settings.buffIds.length > 0 &&
      action.settings.buffIds.every(id => id.length > 0) &&
      action.settings.tagQuery.tagIds.length === 0
        ? action.settings.buffIds
        : null;
    if (buffIds === null) {
      throw new Error(`${node.sourcePath}: unsupported ExtendBuffAction query`);
    }
    return [
      {
        kind: 'holdBuffsById',
        parameters: { target: 'caster', buffIds },
      },
    ];
  }
  if (node.body.value.family === 'dispel') {
    const action = node.body.value.action;
    const expectedTags = [
      gameplayTagIdFromPath('Skill/Enemy/Common/SpellInflictOnChar/CrystInflictOnChar'),
      gameplayTagIdFromPath('Skill/Enemy/Common/SpellStatusOnChar/FrozenOnChar'),
    ].sort((left, right) => left - right);
    const actualTags = [...action.tagQuery.tagIds].sort((left, right) => left - right);
    if (
      action.dispelSource.targetSource === 'Source' &&
      action.dispelSource.targetGroupKey === '' &&
      action.dispelTargets.targetSource === 'Context' &&
      action.dispelTargets.targetGroupKey !== '' &&
      partyTargetGroups.get(action.dispelTargets.targetGroupKey) === 'party' &&
      action.dispelLevel === 'Default' &&
      action.checkTag &&
      action.tagQuery.queryType === 'hasAny' &&
      actualTags.length === expectedTags.length &&
      actualTags.every((tag, index) => tag === expectedTags[index])
    ) {
      // 萤石天赋 2 只清除全队由敌方主动行为施加的寒冷附着/冻结；固定木桩模型不产生二者。
      return [];
    }
    throw new Error(`${node.sourcePath}: unsupported DispelAction projection`);
  }
  if (node.body.value.family === 'normalSkillUltimateEnergy') {
    const action = node.body.value.action;
    const coefficient =
      action.coefficient.blackboardKey === null
        ? action.coefficient.value
        : typeof action.coefficient.levelValues === 'number'
          ? action.coefficient.levelValues
          : null;
    if (
      action.source.targetSource !== 'Source' ||
      action.source.targetGroupKey !== '' ||
      coefficient === null
    )
      throw new Error(`${node.sourcePath}: unsupported ObtainUspInNormalSkill projection`);
    return [
      {
        kind: 'gainSquadUltimateEnergyFromSkillCost',
        parameters: { coefficient },
      },
    ];
  }
  if (node.body.value.family === 'damage') {
    const damageAction = node.body.value.action;
    if (damageAction.units.length === 0 && damageAction.hitEnvironment && damageAction.alwaysNext) {
      // 来源层已确认 hitEnvData 只描述环境命中特效。没有 DamageUnit 且始终继续的动作
      // 不会修改唯一木桩的数值或控制后续流程，Next 无场景交互后端时可安全省略。
      return [];
    }
    const targetsProjectedEnemyContext =
      damageAction.target.targetSource === 'Context' &&
      damageAction.target.targetGroupKey !== '' &&
      (partyTargetGroups.get(damageAction.target.targetGroupKey) === 'enemy' ||
        context.staticEnemyTargetGroupKeys?.has(damageAction.target.targetGroupKey) === true);
    const targetsUniqueEnemyFromCasterBuff =
      context.actionOwnerTarget === 'buffOwner' &&
      context.fixedBuffOwnerTarget === 'caster' &&
      context.fixedBuffSourceTarget === 'caster' &&
      damageAction.target.targetSource === 'Target' &&
      damageAction.target.finderType === 'MainTargetFinder' &&
      damageAction.target.validatorTypes.length === 0 &&
      damageAction.target.postProcessorTypes.length === 0;
    if (
      (context.actionSourceTarget !== 'caster' && context.fixedBuffSourceTarget !== 'caster') ||
      (context.actionOwnerTarget === 'currentAbilityEntity' &&
        damageAction.attacker === 'ActionOwner') ||
      (!['enemy', 'eventTarget'].includes(context.actionTargetTarget) &&
        !(context.actionTargetTarget === 'buffOwner' && context.fixedBuffOwnerTarget === 'enemy') &&
        !(
          damageAction.target.targetSource === 'Owner' &&
          damageAction.target.targetGroupKey === '' &&
          context.actionOwnerTarget === 'buffOwner' &&
          context.fixedBuffOwnerTarget === 'enemy'
        ) &&
        !targetsProjectedEnemyContext &&
        !targetsUniqueEnemyFromCasterBuff)
    )
      throw new Error(`${node.sourcePath}: unsupported Buff damage source`);
    const damageContext = {
      ...context,
      // AbilityEntity child skills can attribute damage to their proven caster through
      // ActionSource. Their entity Owner remains unavailable as an attacker; effectSource
      // is presentation-only and is validated independently by the simple damage compiler.
      actionOwnerTarget:
        context.actionOwnerTarget === 'currentAbilityEntity'
          ? ('unavailable' as const)
          : context.actionOwnerTarget,
      actionSourceTarget: 'caster' as const,
    } as const;
    return [
      damageAction.units.length === 1 && damageAction.units[0]?.attributeType === 'Poise'
        ? compileEventTargetSimplePoiseOperationSource(damageAction, node.sourcePath, damageContext)
        : compileEventTargetSimpleDamageOperationSource(
            damageAction,
            node.sourcePath,
            damageContext,
          ),
    ];
  }
  if (node.body.value.family === 'elementalInfliction') {
    return [projectElementalInflictionAction(node.body.value.action, node.sourcePath, context)];
  }
  if (node.body.value.family === 'forcedElementalStatus') {
    const action = node.body.value.action;
    const targetsEnemy =
      (action.target.targetSource === 'Target' &&
        action.target.targetGroupKey === '' &&
        context.actionTargetTarget === 'enemy') ||
      (action.target.targetSource === 'Context' &&
        action.target.targetGroupKey !== '' &&
        (partyTargetGroups.get(action.target.targetGroupKey) === 'enemy' ||
          context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey) === true));
    if (
      action.source.targetSource !== 'Source' ||
      action.source.targetGroupKey !== '' ||
      context.actionSourceTarget !== 'caster' ||
      !targetsEnemy
    ) {
      throw new Error(`${node.sourcePath}: unsupported forced elemental status targets`);
    }
    if (
      action.consumedElement.blackboardKey !== null ||
      action.consumedElement.levelValues !== null ||
      !Number.isInteger(action.consumedElement.value)
    ) {
      throw new Error(`${node.sourcePath}.consumedType: dynamic element is unsupported`);
    }
    const elements = ['Fire', 'Pulse', 'Cryst', 'Natural'] as const;
    const consumedElement = elements[action.consumedElement.value];
    if (consumedElement === undefined) {
      throw new Error(`${node.sourcePath}.consumedType: unknown element index`);
    }
    const tags = {
      Fire: 'Skill/Character/Common/SpellInflict/FireInflict',
      Pulse: 'Skill/Character/Common/SpellInflict/PulseInflict',
      Cryst: 'Skill/Character/Common/SpellInflict/CrystInflict',
      Natural: 'Skill/Character/Common/SpellInflict/NaturalInflict',
    } as const;
    const forcedBuffIds = {
      Fire: 'buff_common_fire_fire_burning_triggered',
      Pulse: 'buff_common_pulse_pulse_conduct_triggered',
      Cryst: 'buff_common_cryst_cryst_frozen_triggered',
      Natural: 'buff_common_natural_natural_corrupt_triggered',
    } as const;
    const consumedLayers = actionValueOperand(action.consumedLayers);
    const body: CompiledBuffStepSource[] = [
      {
        kind: 'finishBuffsByTag',
        parameters: {
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTags: [tags[consumedElement]],
          reason: 'early',
          count: consumedLayers,
        },
      },
      {
        kind: 'applyBuff',
        parameters: {
          buffId: forcedBuffIds[action.statusElement],
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: {
            consumed_type: { kind: 'constant', value: action.consumedElement.value },
            consumed_layer: consumedLayers,
            count: actionValueOperand(action.statusCount),
          },
        },
      },
    ];
    return [
      {
        kind: 'conditional',
        parameters: {
          condition: {
            kind: 'buffStackCompare',
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTags: [tags[consumedElement]],
            operator: 'greaterOrEqual',
            value: consumedLayers,
          },
        },
        whenTrue: { steps: body },
      },
    ];
  }
  if (node.body.value.family === 'keywordBuff') {
    return [
      projectKeywordBuffAction(node.body.value.action, node.sourcePath, context, partyTargetGroups),
    ];
  }
  if (node.body.value.family === 'heal') {
    const action = node.body.value.action;
    const target =
      action.target.targetSource === 'Source' &&
      action.target.targetGroupKey === '' &&
      context.actionSourceTarget === 'caster'
        ? ('caster' as const)
        : isControlledOperatorInstantSearch(action.target)
          ? ('controlledOperator' as const)
          : action.target.targetSource === 'Owner' &&
              (context.actionOwnerTarget === 'caster' || context.actionOwnerTarget === 'buffOwner')
            ? context.actionOwnerTarget
            : action.target.targetSource === 'Target' &&
                context.actionTargetTarget === 'currentOperator'
              ? ('currentTarget' as const)
              : action.target.targetSource === 'MainCharacter' &&
                  action.target.finderType === null &&
                  action.target.validatorTypes.length === 0 &&
                  action.target.postProcessorTypes.length === 0
                ? ('controlledOperator' as const)
                : action.target.targetSource === 'Context' &&
                    action.target.targetGroupKey !== '' &&
                    partyTargetGroups.get(action.target.targetGroupKey) === 'contextOperator'
                  ? ('contextTarget' as const)
                  : null;
    const attributeNames = {
      Str: 'strength',
      Agi: 'agility',
      Wisd: 'intellect',
      Will: 'will',
      MaxHp: 'maxHealth',
    } as const;
    const attribute =
      action.calculation.kind === 'attribute'
        ? attributeNames[action.calculation.attributeType as keyof typeof attributeNames]
        : undefined;
    if (
      action.healType !== 'Normal' ||
      action.healer !== 'ActionSource' ||
      (action.contextKey !== '' &&
        partyTargetGroups.get(action.contextKey) !== 'buffSource' &&
        !(
          action.contextKey === 'seraph' &&
          action.target.targetSource === 'Owner' &&
          context.fixedBuffOwnerTarget === 'caster'
        )) ||
      target === null ||
      (action.calculation.kind === 'definite' && action.calculation.applyScale) ||
      (action.calculation.kind !== 'definite' &&
        (action.calculation.kind !== 'attribute' ||
          action.calculation.valueSource !== 'AttackerOrHealer' ||
          attribute === undefined))
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff runtime heal`);
    }
    const calculation =
      action.calculation.kind === 'definite'
        ? { amount: actionValueOperand(action.calculation.value) }
        : {
            attribute: attribute!,
            multiplier: actionValueOperand(action.calculation.multiplier),
            addition: actionValueOperand(action.calculation.addition),
          };
    const targetParameters =
      target === 'contextTarget'
        ? { target, contextKey: action.target.targetGroupKey! }
        : { target };
    return [
      {
        kind: 'heal',
        parameters: {
          ...targetParameters,
          ...(action.alwaysNext ? { alwaysNext: true } : {}),
          tags: projectGameplayTags(
            action.useHealTags ? action.healTagIds : [],
            context,
            node.sourcePath,
          ),
          ...calculation,
        },
      },
    ];
  }
  if (node.body.value.family === 'buffQuery') {
    const action = node.body.value.action;
    const targetsStaticEnemy =
      (action.target.targetSource === 'Target' || action.target.targetSource === 'Context') &&
      action.target.targetGroupKey !== '' &&
      context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey) === true;
    const directTarget =
      action.target.targetSource === 'Target' &&
      (context.actionTargetTarget === 'enemy' ||
        context.actionTargetTarget === 'currentAbilityEntity' ||
        context.actionTargetTarget === 'eventTarget' ||
        context.actionTargetTarget === 'buffOwner')
        ? context.actionTargetTarget
        : null;
    if (
      (!targetsStaticEnemy &&
        directTarget === null &&
        action.target.targetSource !== 'Target' &&
        action.target.targetSource !== 'Owner' &&
        action.target.targetSource !== 'Source') ||
      (!targetsStaticEnemy && directTarget === null && action.target.targetGroupKey !== '') ||
      action.countType !== 'BuffCount' ||
      action.limitSkillCastId
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff stack read`);
    }
    const query =
      action.checkType === 'Environment' &&
      action.buffIds.length === 0 &&
      action.buffTagIds.length === 0
        ? { kind: 'environment' as const }
        : action.checkType === 'Id' && action.buffIds.length > 0 && action.buffTagIds.length === 0
          ? { kind: 'id' as const, buffIds: action.buffIds }
          : action.checkType === 'Tag' && action.buffIds.length === 0
            ? {
                kind: 'tag' as const,
                tagQueryType: action.tagQueryType,
                buffTags: projectGameplayTags(action.buffTagIds, context, node.sourcePath),
              }
            : null;
    if (query === null) throw new Error(`${node.sourcePath}: unsupported BuffCount query`);
    return [
      {
        kind: 'readBuffStackCount',
        parameters: {
          target:
            query.kind === 'environment'
              ? 'caster'
              : targetsStaticEnemy
                ? 'enemy'
                : directTarget !== null
                  ? directTarget
                  : action.target.targetSource === 'Owner'
                    ? requireActionOwnerProjection(context, node.sourcePath)
                    : action.target.targetSource === 'Source'
                      ? context.actionSourceTarget
                      : 'eventTarget',
          outputKey: action.outputKey,
          query,
        },
      },
    ];
  }
  if (node.body.value.family === 'buffBlackboardRead') {
    const action = node.body.value.action;
    const query =
      action.settings.checkType === 'Id' &&
      action.settings.buffIds.length > 0 &&
      action.settings.buffIds.every(id => id.length > 0) &&
      action.settings.tagQuery.tagIds.length === 0
        ? { kind: 'id' as const, buffIds: action.settings.buffIds }
        : action.settings.checkType === 'Tag' &&
            action.settings.buffIds.length === 0 &&
            action.settings.tagQuery.tagIds.length > 0
          ? {
              kind: 'tag' as const,
              tagQueryType: action.settings.tagQuery.queryType,
              buffTags: projectGameplayTags(
                action.settings.tagQuery.tagIds,
                context,
                node.sourcePath,
              ),
            }
          : null;
    if (
      (action.target.targetSource === 'Owner' || action.target.targetSource === 'Source') &&
      action.target.targetGroupKey === '' &&
      query !== null
    ) {
      return [
        {
          kind: 'readBuffBlackboard',
          parameters: {
            target:
              action.target.targetSource === 'Owner'
                ? requireActionOwnerProjection(context, node.sourcePath)
                : context.actionSourceTarget,
            query,
            desiredKey: action.desiredKey,
            outputKey: action.outputKey,
          },
        },
      ];
    }
    if (
      action.target.targetSource === 'Target' &&
      action.target.targetGroupKey === '' &&
      query !== null &&
      context.actionTargetTarget !== 'partyExceptCaster' &&
      context.actionTargetTarget !== 'partyExceptCasterAndSameCharacterType' &&
      context.actionTargetTarget !== 'currentOperator'
    ) {
      return [
        {
          kind: 'readBuffBlackboard',
          parameters: {
            target: context.actionTargetTarget,
            query,
            desiredKey: action.desiredKey,
            outputKey: action.outputKey,
          },
        },
      ];
    }
    if (
      action.target.targetSource === 'Context' &&
      action.target.targetGroupKey !== '' &&
      (partyTargetGroups.get(action.target.targetGroupKey) === 'enemy' ||
        context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey) === true) &&
      query !== null
    ) {
      return [
        {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'enemy',
            query,
            desiredKey: action.desiredKey,
            outputKey: action.outputKey,
          },
        },
      ];
    }
    if (
      action.target.targetSource !== 'Target' ||
      action.target.targetGroupKey !== '' ||
      action.settings.checkType !== 'Context' ||
      action.settings.buffIds.length !== 1 ||
      action.settings.buffIds[0] !== '' ||
      action.settings.tagQuery.tagIds.length !== 0
    ) {
      throw new Error(`${node.sourcePath}: unsupported event Buff blackboard read`);
    }
    return [
      {
        kind: 'readEventBuffBlackboard',
        parameters: { desiredKey: action.desiredKey, outputKey: action.outputKey },
      },
    ];
  }
  if (node.body.value.family === 'buffLifeTimeRead') {
    const action = node.body.value.action;
    if (
      action.owner.targetSource === 'Owner' &&
      action.owner.targetGroupKey === '' &&
      action.settings.checkType === 'Id' &&
      action.settings.buffIds.length > 0 &&
      action.settings.tagQuery.tagIds.length === 0
    ) {
      return [
        {
          kind: 'readBuffRemainingDuration',
          parameters: {
            target: requireActionOwnerProjection(context, node.sourcePath),
            buffIds: action.settings.buffIds,
            outputKey: action.outputKey,
          },
        },
      ];
    }
    if (
      action.owner.targetSource !== 'Owner' ||
      action.owner.targetGroupKey !== '' ||
      action.settings.checkType !== 'Environment' ||
      action.settings.buffIds.length !== 0 ||
      action.settings.tagQuery.queryType !== 'hasAny' ||
      action.settings.tagQuery.tagIds.length !== 0
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff lifetime query`);
    }
    return [
      {
        kind: 'readCurrentBuffRemainingDuration',
        parameters: { outputKey: action.outputKey },
      },
    ];
  }
  if (node.body.value.family === 'buffDurationMutation') {
    const action = node.body.value.action;
    const operation = ACTION_VALUE_OPERATIONS[action.operation];
    if (
      action.target.targetSource !== 'Owner' ||
      action.target.targetGroupKey !== '' ||
      action.settings.checkType !== 'Environment' ||
      action.settings.buffIds.length !== 0 ||
      action.settings.tagQuery.queryType !== 'hasAny' ||
      action.settings.tagQuery.tagIds.length !== 0 ||
      action.isFinishedEarly ||
      (operation !== 'assign' && operation !== 'add' && operation !== 'multiply')
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff duration mutation`);
    }
    return [
      {
        kind: 'setCurrentBuffRemainingDuration',
        parameters: { operation, value: actionValueOperand(action.value) },
      },
    ];
  }
  if (node.body.value.family === 'buffTimePause') {
    // PauseBuffTime.ExecuteInternal 读取当前 Buff 实例；主动技能或 AbilityEntity 动作图没有
    // 这个隐式宿主，不能仅因运行时契约存在同名步骤就放宽接受范围。
    if (context.actionOwnerTarget !== 'buffOwner') {
      throw new Error(`${node.sourcePath}: PauseBuffTime requires a current Buff action owner`);
    }
    return [
      {
        kind: 'setCurrentBuffTimePaused',
        parameters: { paused: node.body.value.action.paused },
      },
    ];
  }
  if (node.body.value.family === 'blackboardMutation') {
    const action = node.body.value.action;
    if (context.combatInvisiblePresentationBlackboardKeys?.has(action.key)) return [];
    if (!action.directValue)
      throw new Error(`${node.sourcePath}: indirect blackboard mutation is unsupported`);
    const operation = ACTION_VALUE_OPERATIONS[action.operation];
    if (operation === undefined)
      throw new Error(`${node.sourcePath}: unsupported blackboard operation ${action.operation}`);
    return [
      {
        kind: 'modifyActionValue',
        parameters: {
          key: action.key,
          operation,
          value: actionValueOperand(action.value),
        },
      },
    ];
  }
  if (node.body.value.family === 'spatialMeasurement') {
    const action = node.body.value.action;
    if (
      !isProvenSpatialMeasurementEndpoint(action.source, partyTargetGroups, context) ||
      !isProvenSpatialMeasurementEndpoint(action.target, partyTargetGroups, context)
    ) {
      throw new Error(`${node.sourcePath}: unresolved target-distance endpoint`);
    }
    return [
      {
        kind: 'modifyActionValue',
        parameters: {
          key: action.outputKey,
          operation: 'assign',
          value: { kind: 'constant', value: 0 },
        },
      },
    ];
  }
  if (node.body.value.family === 'attributeSnapshot') {
    const action = node.body.value.action;
    const supportedSpecificAttributes = new Set([
      'Str',
      'Agi',
      'Wisd',
      'Will',
      'MaxHp',
      'MaxUltimateSp',
      'FireAbnormalDamageIncrease',
      'PulseAbnormalDamageIncrease',
      'CrystAbnormalDamageIncrease',
      'NaturalAbnormalDamageIncrease',
    ]);
    const target =
      action.target.targetSource === 'Owner'
        ? requireActionOwnerProjection(context, node.sourcePath)
        : action.target.targetSource === 'Source'
          ? (context.fixedBuffSourceTarget ?? context.actionSourceTarget)
          : null;
    if (
      target !== 'caster' ||
      (action.primaryAttributeType !== 'Sub' &&
        (action.primaryAttributeType !== 'Specific' ||
          !supportedSpecificAttributes.has(action.attributeType)))
    ) {
      throw new Error(`${node.sourcePath}: unsupported attribute snapshot target or selector`);
    }
    return [
      {
        kind: 'storeSourceAttributeValue',
        parameters: {
          // combat-spec StoreAttributeValue：Sub 由目标副属性决定，attributeType 此时不参与选择。
          // 保留动态属性读取，不能把生成时面板或 SkillPatch 等级值固化为快照。
          attribute:
            action.primaryAttributeType === 'Sub'
              ? { kind: 'secondary' }
              : {
                  kind: 'specific',
                  key:
                    action.attributeType === 'MaxHp'
                      ? 'maxHealth'
                      : action.attributeType === 'MaxUltimateSp'
                        ? 'maxUltimateEnergy'
                        : projectCombatRuntimeAttributeKey(action.attributeType),
                },
          stage:
            action.storeAttributeType === 'BaseNonConverted'
              ? 'armedNonConverted'
              : 'finalNonConverted',
          useFloor: action.useFloor,
          divisor: actionValueOperand(action.divisor),
          multiplier: actionValueOperand(action.multiplier),
          base: actionValueOperand(action.baseValue),
          targetKey: action.outputKey,
        },
      },
    ];
  }
  if (node.body.value.family === 'blackboardCalculation') {
    const action = node.body.value.action;
    const operation = ACTION_VALUE_OPERATIONS[action.operation];
    if (
      (operation !== 'add' && operation !== 'multiply' && operation !== 'divide') ||
      action.addend !== null
    ) {
      throw new Error(`${node.sourcePath}: unsupported blackboard calculation`);
    }
    return [
      {
        kind: 'calculateActionValue',
        parameters: {
          key: action.key,
          operation,
          left: actionValueOperand(action.left),
          right: actionValueOperand(action.right),
        },
      },
    ];
  }
  if (node.body.value.family === 'resource') {
    const action = node.body.value.action;
    // ObtainCostAction 先解析 source，再逐 target 计算资源。投射物回调的 Source/Source
    // 可沿已证明的 ActionSource=caster 投影；不能把任意 Source（如接收侧 buffSource）放行。
    const usesCasterSource =
      action.source.targetSource === 'Source' &&
      action.target.targetSource === 'Source' &&
      (context.actionSourceTarget === 'caster' || context.fixedBuffSourceTarget === 'caster');
    const usesOwner =
      action.source.targetSource === 'Owner' &&
      action.target.targetSource === 'Owner' &&
      context.actionOwnerTarget !== 'unavailable' &&
      context.actionOwnerTarget !== 'currentAbilityEntity';
    const usesCasterSourceAndOwner =
      action.source.targetSource === 'Source' &&
      action.target.targetSource === 'Owner' &&
      context.actionSourceTarget === 'caster' &&
      (context.actionOwnerTarget === 'caster' || context.fixedBuffOwnerTarget === 'caster');
    if (
      (!usesOwner && !usesCasterSource && !usesCasterSourceAndOwner) ||
      action.source.targetGroupKey !== '' ||
      action.target.targetGroupKey !== ''
    ) {
      throw new Error(`${node.sourcePath}: unsupported resource gain source/target`);
    }
    const operation: CompiledBuffStepSource = {
      kind: 'changeResourceByActionValue',
      parameters: {
        resource: action.resource,
        amount: actionValueOperand(action.amount),
        coefficient: actionValueOperand(action.coefficient),
        recipient: action.resource === 'sp' ? 'team' : 'caster',
        ...(action.spGainKind === null ? {} : { spGainKind: action.spGainKind }),
        ...(action.spGainSource === null ? {} : { spGainSource: action.spGainSource }),
        ...(action.isPercentValue ? { isPercentValue: true } : {}),
        ...(action.useUltimateRecoveryTag
          ? {
              ultimateRecoveryTag: projectGameplayTags(
                [action.ultimateRecoveryTagId],
                context,
                node.sourcePath,
              )[0]!,
            }
          : {}),
        ...(action.ignoreUltimateGainScalar ? { ignoreUltimateEnergyGainMultiplier: true } : {}),
      },
    };
    return action.onlyMainOperator
      ? [
          {
            kind: 'conditional',
            parameters: { condition: { kind: 'casterControlled' } },
            whenTrue: { steps: [operation] },
          },
        ]
      : [operation];
  }
  if (node.body.value.family === 'finisherSpGain') {
    const action = node.body.value.action;
    const targetIsProvenEnemy =
      (action.target.targetGroupKey === '' && context.actionTargetTarget === 'enemy') ||
      (action.target.targetGroupKey.length > 0 &&
        context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey) === true);
    if (
      action.source.targetSource !== 'Source' ||
      action.target.targetSource !== 'Target' ||
      action.source.targetGroupKey !== '' ||
      context.actionSourceTarget !== 'caster' ||
      !targetIsProvenEnemy
    ) {
      throw new Error(`${node.sourcePath}: unsupported breaking-attack ATB source/target`);
    }
    if (action.factor.blackboardKey !== null || action.factor.levelValues !== null) {
      throw new Error(
        `${node.sourcePath}.factor: dynamic breaking-attack ATB factor is unsupported`,
      );
    }
    return [
      {
        kind: 'gainFinisherSp',
        parameters: { factor: action.factor.value, recipient: 'team' },
      },
    ];
  }
  if (node.body.value.family === 'globalCooldown') {
    const action = node.body.value.action;
    const target =
      action.target.targetSource === 'Owner'
        ? context.actionOwnerTarget === 'buffOwner'
          ? context.fixedBuffOwnerTarget
          : requireActionOwnerProjection(context, node.sourcePath)
        : action.target.targetSource === 'Source'
          ? context.actionSourceTarget
          : null;
    if (target !== 'caster' || action.buffId.length === 0) {
      throw new Error(`${node.sourcePath}: unsupported global cooldown application target`);
    }
    return [
      {
        kind: 'createTimedMarker',
        parameters: {
          target: 'caster',
          markerId: action.buffId,
          durationSeconds:
            action.duration.blackboardKey === null
              ? { kind: 'constant', value: action.duration.value }
              : { kind: 'blackboard', key: action.duration.blackboardKey },
          autoFinishByAction: false,
        },
      },
    ];
  }
  if (node.body.value.family === 'timedMarker') {
    const action = node.body.value.action;
    if (context.actionTargetTarget === 'eventSource' && action.target.targetSource === 'Target')
      throw new Error(`${node.sourcePath}: unaudited receiving Buff event marker target`);
    if (
      action.target.targetSource === 'Owner' &&
      action.target.targetGroupKey === '' &&
      context.actionOwnerTarget === 'currentAbilityEntity' &&
      (action.marker.blackboardKey !== null || action.marker.value.length > 0)
    ) {
      return [
        {
          kind: 'createAbilityEntityTimedMarker',
          parameters: {
            markerId:
              action.marker.blackboardKey === null
                ? action.marker.value
                : { blackboardKey: action.marker.blackboardKey },
            durationSeconds: actionValueOperand(action.duration),
            autoFinishByAction: action.autoFinishByAction,
            timeDomain: action.useTimeDilationDeltaTime ? 'self' : 'global',
          },
        },
      ];
    }
    if (
      action.target.targetSource === 'Context' &&
      action.target.targetGroupKey !== '' &&
      partyTargetGroups.get(action.target.targetGroupKey) === 'abilityEntity' &&
      (action.marker.blackboardKey !== null || action.marker.value.length > 0)
    ) {
      return [
        {
          kind: 'forEachContextTarget',
          parameters: { contextKey: action.target.targetGroupKey },
          body: {
            steps: [
              {
                kind: 'createAbilityEntityTimedMarker',
                parameters: {
                  markerId:
                    action.marker.blackboardKey === null
                      ? action.marker.value
                      : { blackboardKey: action.marker.blackboardKey },
                  durationSeconds: actionValueOperand(action.duration),
                  autoFinishByAction: action.autoFinishByAction,
                  // 原生 false 使用不受实体时间膨胀影响的共享战斗时钟。
                  timeDomain: action.useTimeDilationDeltaTime ? 'self' : 'global',
                },
              },
            ],
          },
        },
      ];
    }
    const target =
      action.target.targetSource === 'Target'
        ? context.actionTargetTarget === 'enemy'
          ? ('enemy' as const)
          : ('eventTarget' as const)
        : action.target.targetSource === 'Owner'
          ? requireActionOwnerProjection(context, node.sourcePath)
          : action.target.targetSource === 'Source'
            ? context.actionSourceTarget
            : action.target.targetSource === 'Context' &&
                action.target.targetGroupKey !== '' &&
                (partyTargetGroups.get(action.target.targetGroupKey) === 'enemy' ||
                  context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey) === true)
              ? ('enemy' as const)
              : null;
    if (
      (target !== 'caster' &&
        target !== 'enemy' &&
        target !== 'eventTarget' &&
        target !== 'buffOwner' &&
        target !== 'buffSource') ||
      (action.marker.blackboardKey === null && action.marker.value.length === 0)
    ) {
      throw new Error(
        `${node.sourcePath}: unsupported timed marker application ` +
          JSON.stringify({
            target,
            targetSource: action.target.targetSource,
            targetGroupKey: action.target.targetGroupKey,
            projectedTargetGroup: partyTargetGroups.get(action.target.targetGroupKey),
            staticEnemyTargetGroupKeys: [...(context.staticEnemyTargetGroupKeys ?? [])],
            markerBlackboardKey: action.marker.blackboardKey,
            markerValue: action.marker.value,
          }),
      );
    }
    return [
      {
        kind: 'createTimedMarker',
        parameters: {
          target,
          markerId:
            action.marker.blackboardKey === null
              ? action.marker.value
              : { blackboardKey: action.marker.blackboardKey },
          durationSeconds: actionValueOperand(action.duration),
          autoFinishByAction: action.autoFinishByAction,
          ...(action.useTimeDilationDeltaTime ? { timeDomain: 'globalScaled' as const } : {}),
        },
      },
    ];
  }
  if (node.body.value.family === 'presentation') {
    const action = node.body.value.action;
    if (action.kind === 'skillTypeMutation') {
      const compile = extensions.compileSkillTypeMutation;
      if (compile === undefined) throw new Error(`${node.sourcePath}: missing SkillType compiler`);
      return [
        ...compile(
          action as import('../source/presentationActions.ts').SkillTypeMutationActionSource,
          node.sourcePath,
          context,
        ),
      ];
    }
    if (action.kind === 'playAnimation' && action.onEnd !== undefined) {
      const conditionsArePureGuards = action.onEnd.conditions.every(
        condition => condition.kind === 'buffStack',
      );
      const createsOnlyInvisibleBuffs =
        action.onEnd.buffApplications.length > 0 &&
        action.onEnd.buffApplications.every(application =>
          application.buffs.every(
            entry => !entry.readIdFromBlackboard && visualOnlyIds.has(entry.buffId),
          ),
        );
      if (!conditionsArePureGuards || !createsOnlyInvisibleBuffs) {
        throw new Error(`${node.sourcePath}.onEndAction: combat-visible animation end actions`);
      }
    }
    return [];
  }
  if (node.body.value.family === 'presentationCalculation') return [];
  if (node.body.value.family === 'randomBlackboard') {
    if (context.combatInvisibleRandomBlackboardKeys?.has(node.body.value.action.targetKey))
      return [];
    throw new Error(`${node.sourcePath}: unsupported combat-visible RandomAction`);
  }
  if (node.body.value.family === 'environment') return [];
  if (
    node.body.value.family === 'spatial' &&
    node.body.value.action.kind === 'additionalBattleShape'
  ) {
    const action = node.body.value.action;
    if (
      !(
        (action.target.targetSource === 'Source' && context.actionSourceTarget === 'caster') ||
        (action.target.targetSource === 'Owner' &&
          context.actionOwnerTarget === 'buffOwner' &&
          (context.fixedBuffOwnerTarget === 'caster' || context.fixedBuffOwnerTarget === 'enemy'))
      ) ||
      action.target.targetGroupKey !== '' ||
      action.target.finderType !== null ||
      action.target.validatorTypes.length !== 0 ||
      action.target.postProcessorTypes.length !== 0 ||
      !action.releaseByAction ||
      action.durationSeconds !== 0 ||
      !action.followTargetPosition ||
      !action.followTargetRotation
    ) {
      throw new Error(`${node.sourcePath}: unsupported additional battle shape projection`);
    }
    // 原生只注册额外战斗碰撞形状；固定模型中范围恒覆盖、木桩唯一且敌人不主动攻击，
    // 因而该形状不改变伤害、资源、Buff 或技能时钟。动态形状键仍由来源层完整保留。
    return [];
  }
  if (node.body.value.family === 'spatial' && node.body.value.action.kind === 'boneAttach') {
    const action = node.body.value.action;
    const targetIsProvenEnemy =
      isPlainTargetReference(action.target, 'Target', action.target.targetGroupKey) &&
      ((action.target.targetGroupKey === '' && context.actionTargetTarget === 'enemy') ||
        (action.target.targetGroupKey !== '' &&
          context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey) === true));
    if (!targetIsProvenEnemy)
      throw new Error(`${node.sourcePath}: unsupported BoneAttach target projection`);
    // combat-spec：BoneAttach 只接管目标移动/旋转，临时添加 BeCaught、Undeadable
    // 与地图传送限制，并在结束时恢复。固定敌人是不会死亡或主动移动的唯一木桩，
    // 所有距离又归零；这些状态不会改变对敌伤害、Buff、资源或技能时间轴。
    return [];
  }
  // Endaxis 的固定木桩空间模型中朝向不改变目标集合或数值；来源层仍完整保留动作载荷。
  if (node.body.value.family === 'spatial') return [];
  // 木桩不会主动攻击玩家；霸体只影响受击控制，暂不进入可见伤害/资源账本。
  if (node.body.value.family === 'selfDefense') return [];
  if (node.body.value.family === 'projectileControl') {
    const action = node.body.value.action;
    if (
      !isPlainTargetReference(action.clearSource, 'Owner', '') ||
      action.playFinishEffect ||
      action.finishAction !== 'NotCastSkill'
    ) {
      throw new Error(`${node.sourcePath}: unsupported clear projectile projection`);
    }
    // 固定木桩投影只接受能同步完成回调的零距离投射物，不保留跨帧飞行实例；因此清理由
    // 当前施法者拥有、且不会在结束时施放技能的投射物，不会再改变伤害、Buff 或资源账本。
    // 范围和 ID 筛选仍由来源层完整保留；出现结束回调时必须显式建模，不能走此省略路径。
    return [];
  }
  if (node.body.value.family === 'animationTiming') {
    if (context.enabledAnimationEventListenerPresent !== false) {
      throw new Error(
        `${node.sourcePath}: animation time scale may affect enabled animation-event combat callbacks`,
      );
    }
    // ContinuousSetAnimTimeScale 只维护动画 TickComponent 的附加倍率。完整主动技能图已证明
    // 不存在启用中的 AnimEventReceiver 后，伤害/Buff/资源仍由 SkillData 时间轴调度，故可省略。
    return [];
  }
  if (node.body.value.family === 'animationEventListener') {
    if (!isPresentationOnlyActionSequence(node.body.value.action.actionOnEvent)) {
      throw new Error(`${node.sourcePath}: unsupported combat animation-event listener`);
    }
    // 动画事件只触发严格证明为纯表现的回调时，不进入木桩战斗时间线。
    return [];
  }
  // 现实时间轴直接给出施法操作，不经过客户端输入缓存窗口。
  if (node.body.value.family === 'inputControl') return [];
  if (node.body.value.family === 'comboPending') {
    const action = node.body.value.action;
    const ownerIsFixedCaster =
      isPlainTargetReference(action.owner, 'Owner', '') &&
      (context.actionOwnerTarget === 'caster' || context.fixedBuffOwnerTarget === 'caster');
    const targetIsFixedEnemy =
      isMainEnemySearch(action.target) ||
      (action.target.targetSource === 'Context' &&
        action.target.targetGroupKey !== '' &&
        context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey) === true);
    if (
      action.needTrigger ||
      action.assignmentCount !== 0 ||
      (!isPlainTargetReference(action.owner, 'Context', 'seraph') && !ownerIsFixedCaster) ||
      !targetIsFixedEnemy ||
      !isPlainTargetReference(action.trigger, 'Target', '')
    ) {
      throw new Error(`${node.sourcePath}: unsupported combo Pending projection`);
    }
    // combat-spec：该动作仅向 BattleManager 提交连携候选；现实时间轴由玩家显式放置连携。
    return [];
  }
  // 技能内施法限制由现实时间轴的技能占用区间覆盖；原生载荷仍在来源层严格解析。
  if (node.body.value.family === 'castingControl') return [];
  // 单技能编译不知道原生 skillId 对应哪个产品技能组；整名生成器必须提供稳定身份映射。
  // Buff 顶层换槽仍由 Buff 定义装配器单独处理，故无扩展时保持来源审计但不重复执行。
  if (node.body.value.family === 'skillSlotReplacement') return [];
  throw new Error(`${node.sourcePath}: unsupported Buff runtime action`);
}

function isPlainTargetReference(
  target: TargetReferenceSource,
  targetSource: string,
  targetGroupKey: string,
): boolean {
  return (
    target.targetSource === targetSource &&
    target.targetGroupKey === targetGroupKey &&
    target.selectorOwner === 'ActionOwner' &&
    target.ownerContextKey === '' &&
    target.centerType === 'ActionSource' &&
    target.centerContextKey === '' &&
    !target.centerToGround &&
    target.target === 'ActionSource' &&
    target.targetContextKey === '' &&
    !target.enableAdvancedDirection &&
    target.selectorDirection === 'SourceForward' &&
    target.finderType === null &&
    target.finderShape === null &&
    target.finderOwnerPartsQuery === null &&
    target.validatorTypes.length === 0 &&
    target.postProcessorTypes.length === 0 &&
    target.priorityFilters.length === 0 &&
    target.shuffleTargets.length === 0 &&
    target.distanceValidators.length === 0 &&
    target.finderSpawnedObjectType === null &&
    target.validatorTagQueries.length === 0
  );
}

function isMainEnemySearch(target: TargetReferenceSource): boolean {
  return isUniqueEnemyMainTargetInstantSearch(target);
}

function isProvenSpatialMeasurementEndpoint(
  target: TargetReferenceSource,
  targetGroups: ReadonlyMap<string, ProjectedTargetGroup>,
  context: CombatActionProjectionContextSource,
): boolean {
  if (target.targetSource === 'Owner' && target.targetGroupKey === '')
    return context.actionOwnerTarget !== 'unavailable';
  if (target.targetSource === 'Source' && target.targetGroupKey === '') return true;
  // GetTargetsView 的 Target 分支直接读取输入目标；序列化残留 group key 不参与寻址。
  if (target.targetSource === 'Target') return true;
  if (target.targetSource === 'InstantSearch' && target.finderType !== null) {
    // 项目模型把所有已解析范围查找视为能找到其场景实例，并把任意两端距离统一为 0。
    // 这里只承认载荷内联携带的真实 finder；命名 Context 仍必须由前序写入证明。
    return true;
  }
  if (target.targetSource === 'Context' && target.targetGroupKey !== '')
    // 零空间模型把实体间、实体到点及点到点距离统一投影为 0；但 Context 身份仍须
    // 由先前目标组写入证明，不能凭非空字符串臆造端点。
    return (
      targetGroups.has(target.targetGroupKey) ||
      context.staticEnemyTargetGroupKeys?.has(target.targetGroupKey) === true ||
      context.staticZeroSpaceTargetGroupKeys?.has(target.targetGroupKey) === true
    );
  return false;
}

function compileBuffApplication(
  action: BuffApplicationActionSource,
  visualOnlyIds: ReadonlySet<string>,
  sourcePath: string,
  partyTargetGroups: ReadonlyMap<string, ProjectedTargetGroup> = new Map(),
  context: CombatActionProjectionContextSource = BUFF_ACTION_CONTEXT,
): CompiledBuffStepSource[] {
  const contextTargetGroupKey = action.target.targetGroupKey ?? '';
  const targetsAbilityEntityGroup =
    action.target.targetSource === 'Context' &&
    partyTargetGroups.get(contextTargetGroupKey) === 'abilityEntity';
  for (const entry of action.buffs) {
    if (entry.readIdFromBlackboard ? entry.buffIdKey.length === 0 : entry.buffId.length === 0)
      throw new Error(`${sourcePath}: Buff identity or blackboard key is empty`);
  }
  // 纯表现子 Buff 的动作生命周期只持有并清理表现资源；来源已完整解析后可从无渲染后端省略。
  if (action.buffs.every(entry => !entry.readIdFromBlackboard && visualOnlyIds.has(entry.buffId)))
    return [];
  if (
    action.buffs.length === 1 &&
    !action.buffs[0]!.readIdFromBlackboard &&
    action.buffs[0]!.buffId === 'buff_common_obtain_ultimate_sp' &&
    !action.buffs[0]!.assignBlackboard &&
    action.buffs[0]!.assignments.length === 0 &&
    action.count.blackboardKey === null &&
    action.count.value === 1 &&
    (action.target.targetSource === 'Source' || action.target.targetSource === 'Owner') &&
    action.target.targetGroupKey === '' &&
    context.actionSourceTarget === 'caster' &&
    action.buffSource === 'ActionSource' &&
    action.contextKey === '' &&
    !action.autoFinishByAction &&
    action.inheritSkillIds.length === 0 &&
    action.finishWithNextSkillIfNotInherited &&
    !action.asChildBuff &&
    action.inheritSourceSkillCastId &&
    action.inheritSourceSkillCastInfo &&
    !action.isExtra &&
    !action.passTargetGroupsToBuff &&
    !action.overrideBuffIconDuration
  ) {
    // 1.4.4 公共 Buff 的 OnBuffStart 仅执行 ObtainUspInNormalSkill，ratio 初值为 1。
    // 投射物回调由投射物 AbilitySystem 持有，因此其中的 Owner 不是角色；但该 Buff
    // 的可见效果只读取 ActionSource 与继承的 SkillCastInfo，不读取 Buff owner。
    // 精确形状下可直接保留全队回能，不把通用投射物 Owner 冒充 caster。
    return [{ kind: 'gainSquadUltimateEnergyFromSkillCost', parameters: { coefficient: 1 } }];
  }
  if (
    context.actionTargetTarget === 'eventSource' &&
    !['Source', 'Owner', 'Target'].includes(action.target.targetSource) &&
    !(
      action.target.targetSource === 'Context' &&
      partyTargetGroups.get(action.target.targetGroupKey ?? '') === 'abilityEntity'
    )
  )
    throw new Error(`${sourcePath}: unaudited receiving Buff event target`);
  if (action.isExtra) {
    throw new Error(`${sourcePath}: unsupported CreateBuff lifecycle options`);
  }
  if (
    action.overrideBuffIconDuration &&
    !(
      context.actionOwnerTarget === 'currentAbilityEntity' &&
      action.buffIconDuration.durationSourceType === 'AbilityEntity' &&
      action.buffIconDuration.timedMarkerId === ''
    )
  ) {
    throw new Error(`${sourcePath}: unsupported CreateBuff icon duration source`);
  }
  // AbilityEntity 来源只覆盖 Buff 图标的倒计时显示，不改变 Buff 自身时钟或数值生命周期，
  // 因而战斗 DSL 仍保留真实 Buff。时间轴目前按实例寿命绘制，尚不能单独显示这层图标倒计时；
  // 其余来源继续拒绝，避免把 TimedMarker 或独立宿主的显示时长误当成无效果字段。
  if (
    action.inheritSkillIds.length > 0 &&
    (!action.autoFinishByAction || !action.finishWithNextSkillIfNotInherited)
  ) {
    throw new Error(`${sourcePath}: unsupported CreateBuff inheritance policy`);
  }
  // combat-spec/create-buff-action-data.md：inheritSourceSkillCastId 不被原生 ExecuteInternal 读取；
  // 实际施放信息继承只由 inheritSourceSkillCastInfo 控制。
  const target: BuffApplicationTarget | null = isControlledOperatorInstantSearch(action.target)
    ? 'controlledOperator'
    : action.target.targetSource === 'Owner'
      ? requireActionOwnerProjection(context, sourcePath)
      : action.target.targetSource === 'Source'
        ? context.fixedBuffSourceTarget !== undefined
          ? 'buffSource'
          : context.actionSourceTarget === 'buffSource'
            ? 'buffSource'
            : context.actionTargetTarget === 'enemy' ||
                context.actionTargetTarget === 'buffOwner' ||
                context.actionTargetTarget === 'currentAbilityEntity' ||
                context.actionTargetTarget === 'currentOperator'
              ? 'caster'
              : 'eventSource'
        : action.target.targetSource === 'Target'
          ? context.actionTargetTarget === 'currentOperator'
            ? ('currentTarget' as const)
            : context.actionTargetTarget
          : action.target.targetSource === 'Context' &&
              partyTargetGroups.has(action.target.targetGroupKey ?? '') &&
              partyTargetGroups.get(action.target.targetGroupKey ?? '') !== 'spatialPoint' &&
              partyTargetGroups.get(action.target.targetGroupKey ?? '') !== 'contextOperator' &&
              partyTargetGroups.get(action.target.targetGroupKey ?? '') !==
                'lowestHealthRatioOperatorExceptCaster' &&
              partyTargetGroups.get(action.target.targetGroupKey ?? '') !== 'empty'
            ? targetsAbilityEntityGroup
              ? ('currentAbilityEntity' as const)
              : (partyTargetGroups.get(action.target.targetGroupKey ?? '')! as Exclude<
                  ProjectedTargetGroup,
                  | 'spatialPoint'
                  | 'abilityEntity'
                  | 'contextOperator'
                  | 'lowestHealthRatioOperatorExceptCaster'
                  | 'empty'
                >)
            : action.target.targetSource === 'Context' &&
                context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey ?? '') === true
              ? ('enemy' as const)
              : action.target.targetSource === 'MainCharacter' &&
                  action.target.finderType === null &&
                  action.target.validatorTypes.length === 0 &&
                  action.target.postProcessorTypes.length === 0
                ? ('controlledOperator' as const)
                : isUniqueEnemyMainTargetInstantSearch(action.target)
                  ? ('enemy' as const)
                  : isUniqueEnemyHitBoxInstantSearch(action.target)
                    ? ('enemy' as const)
                    : isPartyExceptOwnerInstantSearch(action.target)
                      ? ('partyExceptCaster' as const)
                      : isPartyInstantSearch(action.target)
                        ? ('party' as const)
                        : null;
  const source: BuffApplicationSource | undefined | null =
    action.buffSource === 'ActionOwner'
      ? context.actionOwnerTarget === 'unavailable'
        ? null
        : context.actionOwnerTarget === 'currentAbilityEntity'
          ? 'currentAbilityEntity'
          : context.actionOwnerTarget === 'buffOwner' ||
              context.actionSourceTarget === 'buffSource' ||
              context.actionTargetTarget === 'buffOwner'
            ? 'buffOwner'
            : undefined
      : action.buffSource === 'ActionSource'
        ? context.fixedBuffSourceTarget !== undefined
          ? 'buffSource'
          : context.actionSourceTarget === 'buffSource'
            ? 'buffSource'
            : context.actionTargetTarget === 'enemy' ||
                context.actionTargetTarget === 'buffOwner' ||
                context.actionTargetTarget === 'currentAbilityEntity' ||
                context.actionTargetTarget === 'currentOperator'
              ? undefined
              : 'eventSource'
        : action.buffSource === 'ContextTarget' &&
            context.actionTargetTarget === 'enemy' &&
            action.contextKey === 'smart_target'
          ? 'enemy'
          : action.buffSource === 'ContextTarget' &&
              action.contextKey !== '' &&
              partyTargetGroups.get(action.contextKey) === 'buffSource'
            ? 'buffSource'
            : action.buffSource === 'InputTarget' && context.actionTargetTarget === 'enemy'
              ? 'enemy'
              : null;
  if (target === null || source === null)
    throw new Error(`${sourcePath}: unsupported Buff target/source`);
  const steps = action.buffs.flatMap((entry, index) => {
    if (!entry.readIdFromBlackboard && visualOnlyIds.has(entry.buffId)) return [];
    const assignments = entry.assignBlackboard
      ? projectBuffAssignments(entry.assignments, `${sourcePath}.buffs[${index}]`)
      : {};
    const stringAssignments = entry.assignBlackboard
      ? projectStringBuffAssignments(entry.assignments)
      : {};
    const reactionSteps: CompiledBuffStepSource[] = [];
    if (
      !entry.readIdFromBlackboard &&
      entry.buffId === 'buff_common_pulse_pulse_conduct_triggered_do'
    ) {
      const reactionTargetIsEnemy =
        target === 'enemy' || (target === 'buffOwner' && context.fixedBuffOwnerTarget === 'enemy');
      if (
        !reactionTargetIsEnemy ||
        action.count.blackboardKey !== null ||
        action.count.value !== 1 ||
        assignments.duration === undefined
      ) {
        throw new Error(`${sourcePath}: unsupported electrification trigger Buff shape`);
      }
      // 外层 trigger Buff 会先按直接 duration 或 count/SkillSetting 得出 real_duration，
      // 再创建这个真实导电状态 Buff。反应状态必须在此处使用最终时长，不能在外层
      // 只有 count 时猜测列值；同时保留完整 Buff 生命周期供图标和标签查询消费。
      reactionSteps.push({
        kind: 'applyElementalReaction',
        parameters: {
          reaction: 'electrification',
          target: 'enemy',
          durationSeconds: assignments.duration,
          effectiveness: 1,
        },
      });
    }
    return [
      ...reactionSteps,
      {
        kind: 'applyBuff' as const,
        parameters: {
          buffId: entry.readIdFromBlackboard ? { blackboardKey: entry.buffIdKey } : entry.buffId,
          target,
          ...(source === undefined ? {} : { source }),
          ...(action.count.blackboardKey === null && action.count.value === 1
            ? {}
            : { count: actionValueOperand(action.count) }),
          ...(action.inheritSourceSkillCastInfo ? { inheritSourceSkillCastInfo: true } : {}),
          ...(action.autoFinishByAction ? { finishByAction: true } : {}),
          ...(action.inheritSkillIds.length === 0
            ? {}
            : { inheritToNextSkillIds: action.inheritSkillIds }),
          ...(action.asChildBuff ? { asChildBuff: true } : {}),
          ...(action.passTargetGroupsToBuff
            ? {
                [COMPILED_BUFF_CAPTURED_TARGET_GROUPS]: {
                  enemyKeys: [...(context.staticEnemyTargetGroupKeys ?? [])].sort(),
                  zeroSpaceKeys: [...(context.staticZeroSpaceTargetGroupKeys ?? [])]
                    .filter(key => context.staticEnemyTargetGroupKeys?.has(key) !== true)
                    .sort(),
                },
              }
            : {}),
          ...(action.lifetimeOwner === 'currentCastSkill'
            ? { lifetimeOwner: action.lifetimeOwner }
            : {}),
          ...(Object.keys(assignments).length === 0 ? {} : { blackboardAssignments: assignments }),
          ...(Object.keys(stringAssignments).length === 0
            ? {}
            : { stringBlackboardAssignments: stringAssignments }),
        },
      },
    ];
  });
  if (!targetsAbilityEntityGroup) return steps;
  return [
    {
      kind: 'forEachContextTarget',
      parameters: { contextKey: contextTargetGroupKey },
      body: { steps },
    },
  ];
}

const ACTION_VALUE_OPERATIONS: Readonly<Record<string, 'assign' | 'add' | 'multiply' | 'divide'>> =
  {
    Assign: 'assign',
    Add: 'add',
    Multiply: 'multiply',
    Divide: 'divide',
  };
