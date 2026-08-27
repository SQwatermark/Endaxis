import { compileEventTargetSimpleDamageOperationSource } from './simpleDamageOperation.ts';
import type { CompiledActionValueOperandSource } from './combatActionProjectionTypes.ts';
import type { BuffApplicationActionSource } from '../source/buffActions.ts';
import type { NativeActionNodeSource } from '../source/controlFlow.ts';
import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import type { TargetReferenceSource } from '../source/target.ts';
import type { CompiledBuffStepSource } from './combatActionProjectionTypes.ts';
import type { BlackboardAssignmentSource } from '../source/assignments.ts';
import { projectElementalInflictionAction } from './elementalInflictionProjection.ts';
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
      'buffApplication',
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
      'environment',
      'elementalInfliction',
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
    if (
      (action.owner.targetSource !== 'Owner' && action.owner.targetSource !== 'Source') ||
      action.owner.targetGroupKey !== '' ||
      action.limitSource ||
      action.buffSource.targetSource !== 'Source' ||
      action.buffSource.targetGroupKey !== '' ||
      action.finishSource.targetSource !== 'Source' ||
      action.finishSource.targetGroupKey !== ''
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff finish target/source`);
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
          target:
            action.owner.targetSource === 'Owner'
              ? requireActionOwnerProjection(context, node.sourcePath)
              : 'caster',
          buffIds,
          reason: action.isFinishedEarly ? 'early' : 'other',
          ...(action.finishAll ? {} : { count: actionValueOperand(action.finishLayerCount) }),
        },
      },
    ];
  }
  if (node.body.value.family === 'damage') {
    if (
      context.actionSourceTarget !== 'caster' ||
      context.actionOwnerTarget === 'currentAbilityEntity' ||
      !['enemy', 'eventTarget'].includes(context.actionTargetTarget)
    )
      throw new Error(`${node.sourcePath}: unsupported Buff damage source`);
    return [
      compileEventTargetSimpleDamageOperationSource(node.body.value.action, node.sourcePath, {
        ...context,
        actionOwnerTarget: context.actionOwnerTarget,
        actionSourceTarget: context.actionSourceTarget,
      }),
    ];
  }
  if (node.body.value.family === 'elementalInfliction') {
    return [projectElementalInflictionAction(node.body.value.action, node.sourcePath, context)];
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
      action.contextKey !== '' ||
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
    return [
      {
        kind: 'heal',
        parameters: {
          target,
          ...(action.alwaysNext ? { alwaysNext: true } : {}),
          tagIds: action.useHealTags ? action.healTagIds : [],
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
      action.checkType === 'Id' && action.buffIds.length > 0 && action.buffTagIds.length === 0
        ? { kind: 'id' as const, buffIds: action.buffIds }
        : action.checkType === 'Tag' && action.buffIds.length === 0
          ? {
              kind: 'tag' as const,
              tagQueryType: action.tagQueryType,
              buffTagIds: action.buffTagIds,
            }
          : null;
    if (query === null) throw new Error(`${node.sourcePath}: unsupported BuffCount query`);
    return [
      {
        kind: 'readBuffStackCount',
        parameters: {
          target:
            action.target.targetSource === 'Owner'
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
    const target =
      action.target.targetSource === 'Owner'
        ? requireActionOwnerProjection(context, node.sourcePath)
        : action.target.targetSource === 'Source'
          ? context.actionSourceTarget
          : null;
    if (
      target !== 'caster' ||
      (action.primaryAttributeType !== 'Sub' &&
        (action.primaryAttributeType !== 'Specific' || action.attributeType !== 'MaxHp'))
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
              : { kind: 'specific', key: 'maxHealth' },
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
          ? { ultimateRecoveryTagId: action.ultimateRecoveryTagId }
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
        ? requireActionOwnerProjection(context, node.sourcePath)
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
  // 技能内施法限制由现实时间轴的技能占用区间覆盖；原生载荷仍在来源层严格解析。
  if (node.body.value.family === 'castingControl') return [];
  throw new Error(`${node.sourcePath}: unsupported Buff runtime action`);
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
  const target =
    action.target.targetSource === 'Owner'
      ? requireActionOwnerProjection(context, sourcePath)
      : action.target.targetSource === 'Source'
        ? context.actionSourceTarget === 'buffSource'
          ? 'buffSource'
          : context.actionTargetTarget === 'enemy' ||
              context.actionTargetTarget === 'buffOwner' ||
              context.actionTargetTarget === 'currentAbilityEntity'
            ? 'caster'
            : 'eventSource'
        : action.target.targetSource === 'Target'
          ? context.actionTargetTarget
          : action.target.targetSource === 'Context' &&
              partyTargetGroups.has(action.target.targetGroupKey ?? '') &&
              partyTargetGroups.get(action.target.targetGroupKey ?? '') !== 'spatialPoint'
            ? (partyTargetGroups.get(action.target.targetGroupKey ?? '')! as Exclude<
                ProjectedTargetGroup,
                'spatialPoint'
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
  const source =
    action.buffSource === 'ActionOwner'
      ? context.actionOwnerTarget === 'unavailable' ||
        context.actionOwnerTarget === 'currentAbilityEntity'
        ? null
        : context.actionSourceTarget === 'buffSource' || context.actionTargetTarget === 'buffOwner'
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
        : null;
  if (target === null || target === 'abilityEntity' || source === null)
    throw new Error(`${sourcePath}: unsupported Buff target/source`);
  return action.buffs.flatMap((entry, index) => {
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
}

const ACTION_VALUE_OPERATIONS: Readonly<Record<string, 'assign' | 'add' | 'multiply' | 'divide'>> =
  {
    Assign: 'assign',
    Add: 'add',
    Multiply: 'multiply',
    Divide: 'divide',
  };
