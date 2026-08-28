import { projectGameplayTags } from './combatProjectionCommon.ts';
import {
  compileEventTargetSimpleDamageOperationSource,
  compileEventTargetSimplePoiseOperationSource,
} from './simpleDamageOperation.ts';
import type { CompiledActionValueOperandSource } from './combatActionProjectionTypes.ts';
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
  BUFF_ACTION_CONTEXT,
  requireActionOwnerProjection,
  isPartyExceptOwnerInstantSearch,
  isControlledOperatorInstantSearch,
  isPartyInstantSearch,
  actionValueOperand,
} from './combatProjectionCommon.ts';
import { gameplayTagIdFromPath } from '../source/nativeGameplayTags.ts';
import type {
  BuffApplicationSource,
  BuffApplicationTarget,
} from '../../../../packages/game-data-contract/src/primitives.ts';
import { projectCombatRuntimeAttributeKey } from './attributeModifier.ts';

/** 不改变命名目标组状态的普通动作叶子投影。
 * 保留各动作的来源/目标和场景约束；不递归调用序列编排器。 */

/** 动作赋值当前只输出契约支持的数值操作数；字符串保留在来源层，不冒充数值常量。 */
export function projectBuffAssignments(
  assignments: readonly BlackboardAssignmentSource[],
  sourcePath: string,
): Readonly<Record<string, CompiledActionValueOperandSource>> {
  return Object.fromEntries(
    assignments.map((item, index) => {
      if (!item.useDirectValue) {
        return [item.targetKey, { kind: 'blackboard', key: item.inputValueKey }];
      }
      if (item.valueType !== 'Numeric') {
        throw new Error(
          `${sourcePath}.assignItems[${index}]: unsupported direct Buff assignment type ${item.valueType}`,
        );
      }
      return [item.targetKey, { kind: 'constant', value: item.numericValue }];
    }),
  );
}

export function compileActionNode(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
  partyTargetGroups: ReadonlyMap<string, ProjectedTargetGroup> = new Map(),
  context: CombatActionProjectionContextSource = BUFF_ACTION_CONTEXT,
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
    !['buffApplication', 'blackboardMutation', 'blackboardCalculation'].includes(
      node.body.value.family,
    )
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
      'dispel',
      'normalSkillUltimateEnergy',
      'blackboardMutation',
      'blackboardCalculation',
      'attributeSnapshot',
      'resource',
      'finisherSpGain',
      'presentation',
      'presentationCalculation',
      'spatial',
      'spatialMeasurement',
      'selfDefense',
      'inputControl',
      'castingControl',
      'timeDilation',
      'timedMarker',
      'modeAndResourcePolicy',
      'skillCooldownMutation',
      'eventListener',
      'environment',
      'elementalInfliction',
      'buffIgnite',
      'forcedElementalStatus',
      'spellBurstEvent',
      'levelEvent',
      'aura',
    ].includes(node.body.value.family)
  )
    throw new Error(`${node.sourcePath}: unaudited single-enemy action ${node.body.value.family}`);
  if (
    context.actionTargetTarget === 'eventSource' &&
    ![
      'buffApplication',
      'blackboardCalculation',
      'blackboardMutation',
      'presentation',
      'timedMarker',
      'modeAndResourcePolicy',
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
  if (node.body.value.family === 'buffInheritance') {
    const action = node.body.value.action;
    if (visualOnlyIds.has(action.targetBuffId)) return [];
    throw new Error(
      `${node.sourcePath}: combat-visible inherited Buff ${JSON.stringify(action.targetBuffId)} ` +
        'requires the skill-transition runtime contract',
    );
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
      // Endaxis 时间轴输入已经绑定玩家实际选择的具体形态；模式只负责原生输入槽路由。
      return [];
    }
    if (
      action.target.targetSource !== 'Source' ||
      action.target.targetGroupKey !== '' ||
      context.actionSourceTarget !== 'caster'
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
    if (
      action.target.targetSource !== 'Owner' ||
      action.target.targetGroupKey !== '' ||
      !['caster', 'buffOwner'].includes(requireActionOwnerProjection(context, node.sourcePath))
    ) {
      throw new Error(`${node.sourcePath}: unsupported skill cooldown target`);
    }
    if (action.operation === 'reduce' && action.basis === 'absoluteSeconds') {
      throw new Error(`${node.sourcePath}: absolute cooldown reduction is not representable`);
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
    return aura.buffs.flatMap((entry, index) => {
      if (visualOnlyIds.has(entry.buffId)) return [];
      const assignments = entry.assignBlackboard
        ? projectBuffAssignments(entry.assignments, `${node.sourcePath}.buffInput[${index}]`)
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
            finishByAction: true,
            ...(aura.inheritSourceSkillCastInfo ? { inheritSourceSkillCastInfo: true } : {}),
            ...(Object.keys(assignments).length === 0
              ? {}
              : { blackboardAssignments: assignments }),
          },
        },
      ];
    });
  }
  if (node.body.value.family === 'buffFinish') {
    const action = node.body.value.action;
    const ownerIsPartyInstantSearch = isPartyInstantSearch(action.owner);
    const ownerContextTarget =
      action.owner.targetSource === 'Context' &&
      action.owner.targetGroupKey !== '' &&
      partyTargetGroups.get(action.owner.targetGroupKey);
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
      action.finishSource.targetSource !== 'Source' ||
      action.finishSource.targetGroupKey !== ''
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff finish target/source`);
    }
    const target = ownerIsPartyInstantSearch
      ? ('party' as const)
      : ownerContextTarget === 'buffSource'
        ? ('buffSource' as const)
        : action.owner.targetSource === 'Owner'
          ? requireActionOwnerProjection(context, node.sourcePath)
          : action.owner.targetSource === 'Source'
            ? 'caster'
            : context.actionTargetTarget === 'enemy'
              ? 'enemy'
              : (() => {
                  throw new Error(
                    `${node.sourcePath}: Buff finish Target projection is unavailable`,
                  );
                })();
    if (
      action.kind === 'buffFinishByQuery' &&
      action.settings.checkType === 'Tag' &&
      action.settings.buffIds.length === 0 &&
      action.settings.tagQuery.tagIds.length > 0 &&
      !action.isAbsorbed
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
            reason: action.isFinishedEarly ? 'early' : 'other',
            ...(action.finishAll ? {} : { count: actionValueOperand(action.finishLayerCount) }),
          },
        },
      ];
    }
    const buffIds =
      action.kind === 'buffFinishById'
        ? action.buffIds
        : action.settings.checkType === 'Id' &&
            action.settings.buffIds.length > 0 &&
            action.settings.tagQuery.tagIds.length === 0 &&
            !action.isAbsorbed
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
          reason: action.isFinishedEarly ? 'early' : 'other',
          ...(action.finishAll ? {} : { count: actionValueOperand(action.finishLayerCount) }),
        },
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
    if (
      action.source.targetSource !== 'Source' ||
      action.source.targetGroupKey !== '' ||
      typeof action.coefficient.levelValues !== 'number'
    )
      throw new Error(`${node.sourcePath}: unsupported ObtainUspInNormalSkill projection`);
    return [
      {
        kind: 'gainSquadUltimateEnergyFromSkillCost',
        parameters: { coefficient: action.coefficient.levelValues },
      },
    ];
  }
  if (node.body.value.family === 'damage') {
    if (
      context.actionSourceTarget !== 'caster' ||
      (context.actionOwnerTarget === 'currentAbilityEntity' &&
        node.body.value.action.attacker === 'ActionOwner') ||
      (!['enemy', 'eventTarget'].includes(context.actionTargetTarget) &&
        !(context.actionTargetTarget === 'buffOwner' && context.fixedBuffOwnerTarget === 'enemy'))
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
      actionSourceTarget: context.actionSourceTarget,
    } as const;
    return [
      node.body.value.action.units.length === 1 &&
      node.body.value.action.units[0]?.attributeType === 'Poise'
        ? compileEventTargetSimplePoiseOperationSource(
            node.body.value.action,
            node.sourcePath,
            damageContext,
          )
        : compileEventTargetSimpleDamageOperationSource(
            node.body.value.action,
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
    if (
      action.source.targetSource !== 'Source' ||
      action.source.targetGroupKey !== '' ||
      context.actionSourceTarget !== 'caster' ||
      action.target.targetSource !== 'Target' ||
      action.target.targetGroupKey !== '' ||
      context.actionTargetTarget !== 'enemy'
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
    return [projectKeywordBuffAction(node.body.value.action, node.sourcePath, context)];
  }
  if (node.body.value.family === 'heal') {
    const action = node.body.value.action;
    const target =
      action.target.targetSource === 'Owner'
        ? ('caster' as const)
        : isControlledOperatorInstantSearch(action.target)
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
    if (
      (action.target.targetSource !== 'Target' &&
        action.target.targetSource !== 'Owner' &&
        action.target.targetSource !== 'Source') ||
      action.target.targetGroupKey !== '' ||
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
  if (node.body.value.family === 'blackboardMutation') {
    const action = node.body.value.action;
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
      'FireAbnormalDamageIncrease',
      'PulseAbnormalDamageIncrease',
      'CrystAbnormalDamageIncrease',
      'NaturalAbnormalDamageIncrease',
    ]);
    const target =
      action.target.targetSource === 'Owner'
        ? requireActionOwnerProjection(context, node.sourcePath)
        : action.target.targetSource === 'Source'
          ? context.actionSourceTarget
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
      context.actionSourceTarget === 'caster';
    const usesOwner =
      action.source.targetSource === 'Owner' &&
      action.target.targetSource === 'Owner' &&
      context.actionOwnerTarget !== 'unavailable' &&
      context.actionOwnerTarget !== 'currentAbilityEntity';
    if (
      (!usesOwner && !usesCasterSource) ||
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
    if (
      action.source.targetSource !== 'Source' ||
      action.target.targetSource !== 'Target' ||
      action.source.targetGroupKey !== '' ||
      action.target.targetGroupKey !== '' ||
      context.actionSourceTarget !== 'caster' ||
      context.actionTargetTarget !== 'enemy'
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
    const target =
      action.target.targetSource === 'Target'
        ? ('eventTarget' as const)
        : action.target.targetSource === 'Owner'
          ? requireActionOwnerProjection(context, node.sourcePath)
          : action.target.targetSource === 'Source'
            ? context.actionSourceTarget
            : null;
    if (
      (target !== 'caster' &&
        target !== 'eventTarget' &&
        target !== 'buffOwner' &&
        target !== 'buffSource') ||
      action.marker.blackboardKey !== null ||
      action.marker.value.length === 0 ||
      action.useTimeDilationDeltaTime
    ) {
      throw new Error(`${node.sourcePath}: unsupported timed marker application`);
    }
    return [
      {
        kind: 'createTimedMarker',
        parameters: {
          target,
          markerId: action.marker.value,
          durationSeconds: actionValueOperand(action.duration),
          autoFinishByAction: action.autoFinishByAction,
        },
      },
    ];
  }
  if (node.body.value.family === 'presentation') return [];
  if (node.body.value.family === 'presentationCalculation') return [];
  if (node.body.value.family === 'environment') return [];
  // Endaxis 的固定木桩空间模型中朝向不改变目标集合或数值；来源层仍完整保留动作载荷。
  if (node.body.value.family === 'spatial') return [];
  // 木桩不会主动攻击玩家；霸体只影响受击控制，暂不进入可见伤害/资源账本。
  if (node.body.value.family === 'selfDefense') return [];
  // 现实时间轴直接给出施法操作，不经过客户端输入缓存窗口。
  if (node.body.value.family === 'inputControl') return [];
  if (node.body.value.family === 'comboPending') {
    const action = node.body.value.action;
    if (
      action.needTrigger ||
      action.assignmentCount !== 0 ||
      !isPlainTargetReference(action.owner, 'Context', 'seraph') ||
      !isMainEnemySearch(action.target) ||
      !isPlainTargetReference(action.trigger, 'Target', '')
    ) {
      throw new Error(`${node.sourcePath}: unsupported combo Pending projection`);
    }
    // combat-spec：该动作仅向 BattleManager 提交连携候选；现实时间轴由玩家显式放置连携。
    return [];
  }
  // 技能内施法限制由现实时间轴的技能占用区间覆盖；原生载荷仍在来源层严格解析。
  if (node.body.value.family === 'castingControl') return [];
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
  return (
    target.targetSource === 'InstantSearch' &&
    target.targetGroupKey === '' &&
    target.selectorOwner === 'ActionOwner' &&
    target.ownerContextKey === '' &&
    target.centerType === 'ActionSource' &&
    target.centerContextKey === '' &&
    !target.centerToGround &&
    target.target === 'ActionSource' &&
    target.targetContextKey === '' &&
    !target.enableAdvancedDirection &&
    target.selectorDirection === 'SourceForward' &&
    target.finderType === 'MainTargetFinder' &&
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

function isProvenSpatialMeasurementEndpoint(
  target: TargetReferenceSource,
  targetGroups: ReadonlyMap<string, ProjectedTargetGroup>,
  context: CombatActionProjectionContextSource,
): boolean {
  if (target.targetSource === 'Owner' && target.targetGroupKey === '')
    return context.actionOwnerTarget !== 'unavailable';
  if (target.targetSource === 'Source' && target.targetGroupKey === '') return true;
  if (target.targetSource === 'Target' && target.targetGroupKey === '') return true;
  if (target.targetSource === 'Context' && target.targetGroupKey !== '')
    return (
      targetGroups.has(target.targetGroupKey) &&
      targetGroups.get(target.targetGroupKey) !== 'spatialPoint'
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
    action.target.targetSource === 'Source' &&
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
    return [{ kind: 'gainSquadUltimateEnergyFromSkillCost', parameters: { coefficient: 1 } }];
  }
  if (
    context.actionTargetTarget === 'eventSource' &&
    !['Source', 'Owner', 'Target'].includes(action.target.targetSource)
  )
    throw new Error(`${sourcePath}: unaudited receiving Buff event target`);
  if (
    action.inheritSkillIds.length > 0 ||
    action.isExtra ||
    action.passTargetGroupsToBuff ||
    action.overrideBuffIconDuration
  ) {
    throw new Error(`${sourcePath}: unsupported CreateBuff lifecycle options`);
  }
  // combat-spec/create-buff-action-data.md：inheritSourceSkillCastId 不被原生 ExecuteInternal 读取；
  // 实际施放信息继承只由 inheritSourceSkillCastInfo 控制。
  const target: BuffApplicationTarget | null =
    action.target.targetSource === 'Owner'
      ? requireActionOwnerProjection(context, sourcePath)
      : action.target.targetSource === 'Source'
        ? (context.fixedBuffSourceTarget ??
          (context.actionSourceTarget === 'buffSource'
            ? 'buffSource'
            : context.actionTargetTarget === 'enemy' ||
                context.actionTargetTarget === 'buffOwner' ||
                context.actionTargetTarget === 'currentAbilityEntity'
              ? 'caster'
              : 'eventSource'))
        : action.target.targetSource === 'Target'
          ? context.actionTargetTarget
          : action.target.targetSource === 'Context' &&
              partyTargetGroups.has(action.target.targetGroupKey ?? '') &&
              partyTargetGroups.get(action.target.targetGroupKey ?? '') !== 'spatialPoint' &&
              partyTargetGroups.get(action.target.targetGroupKey ?? '') !== 'contextOperator' &&
              partyTargetGroups.get(action.target.targetGroupKey ?? '') !== 'empty'
            ? targetsAbilityEntityGroup
              ? ('currentAbilityEntity' as const)
              : (partyTargetGroups.get(action.target.targetGroupKey ?? '')! as Exclude<
                  ProjectedTargetGroup,
                  | 'spatialPoint'
                  | 'abilityEntity'
                  | 'contextOperator'
                  | 'empty'
                  | 'casterAndControlledOperator'
                  | 'casterAndLowestHealthRatioOperatorExceptCaster'
                >)
            : action.target.targetSource === 'Context' &&
                context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey ?? '') === true
              ? ('enemy' as const)
              : isControlledOperatorInstantSearch(action.target)
                ? ('controlledOperator' as const)
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
          : context.actionSourceTarget === 'buffSource' ||
              context.actionTargetTarget === 'buffOwner'
            ? 'buffOwner'
            : undefined
      : action.buffSource === 'ActionSource'
        ? context.actionSourceTarget === 'buffSource'
          ? 'buffSource'
          : context.actionTargetTarget === 'enemy' ||
              context.actionTargetTarget === 'buffOwner' ||
              context.actionTargetTarget === 'currentAbilityEntity'
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
    return [
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
          ...(action.asChildBuff ? { asChildBuff: true } : {}),
          ...(action.lifetimeOwner === 'currentCastSkill'
            ? { lifetimeOwner: action.lifetimeOwner }
            : {}),
          ...(Object.keys(assignments).length === 0 ? {} : { blackboardAssignments: assignments }),
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
