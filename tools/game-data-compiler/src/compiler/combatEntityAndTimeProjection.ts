import type { NativeActionNodeSource } from '../source/controlFlow.ts';
import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import type { TimeScaleCurveKeyDefinition } from '../../../../packages/game-data-contract/src/conditions.ts';
import type { CompiledBuffStepSource } from './combatActionProjectionTypes.ts';
import type { TimeDilationCurveKeySource } from '../source/timeDilationActions.ts';
import { projectFinishOwner } from './timelineControlProjection.ts';
import { compileTargetGroupAbilityEntityQuerySource } from './abilityEntityQuery.ts';
import { gameplayTagIdFromPath } from '../../../../src/shared/gameplayTags.ts';
import {
  type ProjectedTargetGroup,
  type CombatActionProjectionContextSource,
  type CombatActionProjectionExtensionsSource,
  isControlledOperatorInstantSearch,
  isOwnerSpawnedAbilityEntityInstantSearch,
  actionValueOperand,
} from './combatProjectionCommon.ts';
import { compileActionNode } from './combatActionLeafProjection.ts';

/** 实体、时间膨胀、目标组和显式投射物扩展的叶子分派。
 * 本层按原顺序处理特殊分支，剩余动作委托普通叶子投影；目标组状态只沿调用返回。 */

/** 原生层保留整数；在输出边界检查契约可表达的权重模式，不断言、不截位或补默认值。 */
function projectTimeDilationCurveKeys(
  keys: readonly TimeDilationCurveKeySource[],
  sourcePath: string,
): readonly TimeScaleCurveKeyDefinition[] {
  return keys.map((key, index) => {
    const { weightedMode } = key;
    // combat-spec AnimationCurveEvaluator：WeightedIn=1、WeightedOut=2，仅支持 0..3。
    if (weightedMode !== 0 && weightedMode !== 1 && weightedMode !== 2 && weightedMode !== 3) {
      throw new Error(
        `${sourcePath}.timeScaleCurve[${index}].weightedMode: unsupported value ${weightedMode}`,
      );
    }
    return { ...key, weightedMode };
  });
}

export function compileBuffLeafNode(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
  partyTargetGroups: ReadonlyMap<string, ProjectedTargetGroup>,
  context: CombatActionProjectionContextSource,
  extensions: CombatActionProjectionExtensionsSource = {},
): {
  readonly steps: readonly CompiledBuffStepSource[];
  readonly state: ReadonlyMap<string, ProjectedTargetGroup>;
} {
  if (node.body.kind !== 'leaf') {
    throw new Error(`${node.sourcePath}: expected an action leaf`);
  }
  if (node.body.value.family === 'lifecycle') {
    return {
      steps: [projectFinishOwner(node.body.value.action, context, node.sourcePath)],
      state: partyTargetGroups,
    };
  }
  if (node.body.value.family === 'projectile') {
    const compile = extensions.compileProjectileLaunch;
    if (compile === undefined)
      throw new Error(`${node.sourcePath}: projectile launch projection is unavailable`);
    return {
      steps: compile(node.body.value.action, node.sourcePath, context),
      state: partyTargetGroups,
    };
  }
  if (node.body.value.family === 'abilityEntity') {
    const action = node.body.value.action;
    const bornAtBlockPoint =
      action.bornAt.targetSource === 'Target' &&
      action.bornAt.targetGroupKey === '' &&
      action.bornAt.finderType === null &&
      action.bornAt.validatorTypes.length === 0 &&
      action.bornAt.postProcessorTypes.length === 0;
    if (
      !action.setSource ||
      action.sourceType !== 'ActionSource' ||
      action.sourceContextKey !== '' ||
      action.setTarget ||
      !bornAtBlockPoint ||
      action.bornMountPoint !== 'None' ||
      action.bornPositionOffset.some(value => value !== 0) ||
      action.checkNavmeshAreaName ||
      action.forbiddenAreaNames.length !== 0 ||
      action.attachToClosestMeshPoint ||
      action.rotateYFromBoneToCurrentPosition ||
      action.bornRotation !== 'SourceForward' ||
      action.bornRotationContextTarget !== '' ||
      action.useAdvancedDirection ||
      action.clampToXZPlane ||
      action.applyBornRotationOffset ||
      action.bornRotationOffset.some((value, index) => value !== (index === 3 ? 1 : 0)) ||
      action.assignEntityBlackboard ||
      action.assignments.length !== 0 ||
      !action.assignBlackboard ||
      action.overrideDuration ||
      action.duration.blackboardKey !== null ||
      action.duration.value !== 0 ||
      action.saveToContext ||
      action.contextKey !== '' ||
      action.pauseEffectOnEnd ||
      !action.inheritSourceSkillCastId ||
      action.dieWhenSourceDies ||
      action.forceSyncInit ||
      action.dieOnEnd
    )
      throw new Error(`${node.sourcePath}: unsupported AbilityEntity spawn projection`);
    // bornAt=Target 在 block 回调中是命中点；零空间模型只保留实体身份与黑板继承。
    return {
      steps: [
        {
          kind: 'spawnAbilityEntity',
          parameters: {
            abilityEntityId: action.abilityEntityId,
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          },
        },
      ],
      state: partyTargetGroups,
    };
  }
  if (node.body.value.family === 'interrupt') {
    const action = node.body.value.action;
    const defenderIsEnemy =
      action.defender.targetSource === 'Target' ||
      (action.defender.targetSource === 'Context' &&
        context.staticEnemyTargetGroupKeys?.has(action.defender.targetGroupKey) === true);
    if (
      context.actionTargetTarget !== 'enemy' ||
      context.actionSourceTarget !== 'caster' ||
      action.attacker.targetSource !== 'Source' ||
      !defenderIsEnemy
    )
      throw new Error(`${node.sourcePath}: unsupported InterruptAction stump projection`);
    // 静态木桩没有正在执行的技能或主动行为；控制结果对可见伤害/资源账本无影响。
    return { steps: [], state: partyTargetGroups };
  }
  if (node.body.value.family === 'stumpControl') {
    const action = node.body.value.action;
    if (action.kind === 'targetHitStop' && action.affectType === 'Both') {
      const targetIsEnemy =
        action.target.targetSource === 'Target' ||
        (action.target.targetSource === 'Context' &&
          context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey) === true);
      const priority = extensions.resolveTimeDilationPriority?.(
        action.priorityTagId,
        node.sourcePath,
      );
      if (
        context.actionTargetTarget !== 'enemy' ||
        context.actionSourceTarget !== 'caster' ||
        action.source.targetSource !== 'Source' ||
        !targetIsEnemy ||
        priority === undefined ||
        !Number.isFinite(priority)
      )
        throw new Error(`${node.sourcePath}: unsupported attacker-and-target hit-stop projection`);
      return {
        steps: [
          {
            kind: 'startTimeDilation',
            parameters: {
              scope: 'entity',
              durationSeconds: { kind: 'constant', value: action.durationSeconds },
              slot: gameplayTagIdFromPath('TimeDilation/Layer/Entity/HitStop'),
              priority,
              curve: { kind: 'named', key: action.curveKey },
              finishByAction: false,
              targets: ['enemy', 'caster'],
            },
          },
        ],
        state: partyTargetGroups,
      };
    }
    const targetIsEnemy =
      action.target.targetSource === 'Target' ||
      (action.target.targetSource === 'Context' &&
        context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey) === true);
    const sourceIsCaster =
      (action.source.targetSource === 'Source' && context.actionSourceTarget === 'caster') ||
      (action.source.targetSource === 'Owner' && context.actionOwnerTarget === 'caster');
    if (context.actionTargetTarget !== 'enemy' || !sourceIsCaster || !targetIsEnemy)
      throw new Error(`${node.sourcePath}: unsupported static-enemy control projection`);
    if (action.kind === 'blowOffEnemy' && action.deadOption !== 'OnlyDead')
      throw new Error(
        `${node.sourcePath}: live-target BlowOffEnemy physical infliction is not projected`,
      );
    // 木桩无主动行为，且 Endaxis 距离恒为零；受击动画、拉拽和 OnlyTarget hit-stop
    // 均不改变玩家动作、伤害或资源账本。OnlyDead 的吹飞只在敌人已经死亡后进入 Process；
    // 标准木桩的死亡是数值终止边界，不继续执行可能产生的新伤害链。
    return { steps: [], state: partyTargetGroups };
  }
  if (node.body.value.family === 'castingControl') {
    if (context.actionSourceTarget !== 'caster')
      throw new Error(`${node.sourcePath}: unsupported ChannelingCastingAction owner`);
    // 原生动作只在自身区间持有禁止切人/回中/再次施法的句柄及同寿命标记 Buff。
    // Endaxis 直接安排现实时间操作，当前技能自身的占用区间已覆盖该限制；没有黑板或战斗输出。
    return { steps: [], state: partyTargetGroups };
  }
  if (node.body.value.family === 'timeDilation') {
    const action = node.body.value.action;
    if (action.kind === 'ultimateTimeDilation') {
      const priority = extensions.resolveTimeDilationPriority?.(
        action.priorityTagId,
        node.sourcePath,
      );
      if (
        priority === undefined ||
        !Number.isFinite(priority) ||
        !Number.isFinite(action.timeScale) ||
        action.timeScale < 0 ||
        action.ignoreTargets.length !== 0
      )
        throw new Error(`${node.sourcePath}: unsupported ultimate time-dilation projection`);
      return {
        steps: [
          {
            kind: 'startUltimateTimeDilation',
            parameters: {
              priority,
              targetScale: { kind: 'constant', value: action.timeScale },
              ignoredTargets: [],
            },
          },
        ],
        state: partyTargetGroups,
      };
    }
    const priority = extensions.resolveTimeDilationPriority?.(
      action.priorityTagId,
      node.sourcePath,
    );
    if (
      action.useTimeScaleForSkillCooldownTick ||
      action.influenceSkillCooldownTime.blackboardKey !== null ||
      action.influenceSkillCooldownTime.value !== 0 ||
      priority === undefined ||
      !Number.isFinite(priority)
    )
      throw new Error(`${node.sourcePath}: unsupported time-dilation cooldown/priority projection`);
    if (action.layer === 'Entity') {
      const target = action.effectTargets[0];
      const source = action.effectTargets[1];
      const targets =
        action.effectTargets.length === 1 &&
        target?.targetSource === 'Owner' &&
        target.targetGroupKey === ''
          ? (['caster'] as const)
          : action.effectTargets.length === 2 &&
              target?.targetSource === 'Target' &&
              target.targetGroupKey === '' &&
              source?.targetSource === 'Source' &&
              source.targetGroupKey === ''
            ? (['enemy', 'caster'] as const)
            : null;
      if (
        !action.useCurveKey ||
        action.curveKey.length === 0 ||
        action.inlineCurveKeys.length !== 0 ||
        action.ignoreTargets.length !== 0 ||
        targets === null
      )
        throw new Error(`${node.sourcePath}: unsupported entity time-dilation projection`);
      return {
        steps: [
          {
            kind: 'startTimeDilation',
            parameters: {
              scope: 'entity',
              durationSeconds: actionValueOperand(action.duration),
              slot: action.slotTagId,
              priority,
              curve: { kind: 'named', key: action.curveKey },
              finishByAction: action.finishByAction,
              targets,
            },
          },
        ],
        state: partyTargetGroups,
      };
    }
    const ignored = action.ignoreTargets[0];
    const affected = action.effectTargets[0];
    const namedComboGlobal =
      action.useCurveKey &&
      action.curveKey.length > 0 &&
      action.inlineCurveKeys.length === 0 &&
      action.ignoreTargets.length === 2 &&
      ignored?.targetSource === 'Owner' &&
      ignored.targetGroupKey === '' &&
      isOwnerSpawnedAbilityEntityInstantSearch(action.ignoreTargets[1]!) &&
      action.effectTargets.length === 0 &&
      context.actionOwnerTarget === 'caster';
    if (namedComboGlobal) {
      return {
        steps: [
          {
            kind: 'startTimeDilation',
            parameters: {
              scope: 'global',
              durationSeconds: actionValueOperand(action.duration),
              slot: action.slotTagId,
              priority,
              curve: { kind: 'named', key: action.curveKey },
              finishByAction: action.finishByAction,
              ignoredTargets: ['caster'],
              ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
            },
          },
        ],
        state: partyTargetGroups,
      };
    }
    if (
      action.useCurveKey ||
      action.curveKey !== '' ||
      action.inlineCurveKeys.length === 0 ||
      action.ignoreTargets.length !== 1 ||
      ignored === undefined ||
      !isControlledOperatorInstantSearch(ignored) ||
      action.effectTargets.length !== 1 ||
      affected === undefined ||
      affected.targetSource !== 'Source' ||
      affected.targetGroupKey !== ''
    )
      throw new Error(`${node.sourcePath}: unsupported global time-dilation projection`);
    return {
      steps: [
        {
          kind: 'startTimeDilation',
          parameters: {
            scope: 'global',
            durationSeconds: actionValueOperand(action.duration),
            slot: action.slotTagId,
            priority,
            curve: {
              kind: 'inline',
              keys: projectTimeDilationCurveKeys(action.inlineCurveKeys, node.sourcePath),
            },
            finishByAction: action.finishByAction,
            ignoredTargets: ['controlled'],
          },
        },
      ],
      state: partyTargetGroups,
    };
  }
  if (node.body.value.family === 'targetGroup') {
    const queryInputs = context.abilityEntityQueries;
    const write = node.body.value.action;
    if (context.presentationOnlyTargetGroupKeys?.has(write.targetGroupKey))
      return { steps: [], state: partyTargetGroups };
    if (context.staticEnemyTargetGroupKeys?.has(write.targetGroupKey)) {
      const nextGroups = new Map(partyTargetGroups);
      nextGroups.set(write.targetGroupKey, 'enemy');
      return { steps: [], state: nextGroups };
    }
    if (queryInputs !== undefined && write.finderType === 'OwnerSpawnedEntityFinder') {
      if (
        write.producerType !== 'FindTargetAction' ||
        context.actionOwnerTarget !== 'caster' ||
        context.actionSourceTarget !== 'caster' ||
        !['enemy', 'currentAbilityEntity'].includes(context.actionTargetTarget)
      )
        throw new Error(`${node.sourcePath}: unsupported AbilityEntity query environment`);
      const query = compileTargetGroupAbilityEntityQuerySource(
        write,
        queryInputs.catalog,
        queryInputs.gameplayTagRegistry,
        node.sourcePath,
      );
      if (
        !['actionOwner', 'actionSource'].includes(query.owner.kind) ||
        !['actionOwner', 'actionSource'].includes(query.center.kind) ||
        query.validators.some(validator => validator.kind === 'distance') ||
        query.postProcessors.length > 0
      )
        throw new Error(`${node.sourcePath}: unsupported AbilityEntity runtime query filter`);
      const nextGroups = new Map(partyTargetGroups);
      nextGroups.set(write.targetGroupKey, 'abilityEntity');
      return {
        steps: [
          {
            kind: 'findOwnerSpawnedAbilityEntities',
            parameters: {
              saveToContextKey: write.targetGroupKey,
              abilityEntityIds: query.candidateTemplateIds,
              ...(query.validators.some(validator => validator.kind === 'sameSkillCast')
                ? { sameSourceSkillCast: true }
                : {}),
            },
          },
        ],
        state: nextGroups,
      };
    }
    if (
      context.actionTargetTarget === 'enemy' &&
      write.producerType === 'FindTargetAction' &&
      write.finderType === 'CharacterTeamFinder' &&
      write.characterTeamSelectionRole === 'controlledOperator' &&
      write.postProcessorTypes.length === 0
    ) {
      const nextGroups = new Map(partyTargetGroups);
      nextGroups.set(write.targetGroupKey, 'controlledOperator');
      return { steps: [], state: nextGroups };
    }
    if (
      ['enemy', 'currentAbilityEntity'].includes(context.actionTargetTarget) &&
      write.producerType === 'FindTargetAction' &&
      write.finderType === 'FixedPointFinder' &&
      write.postProcessorTypes.length === 0
    ) {
      const nextGroups = new Map(partyTargetGroups);
      nextGroups.set(write.targetGroupKey, 'spatialPoint');
      return { steps: [], state: nextGroups };
    }
    if (
      write.producerType === 'MergeTargetAction' &&
      write.inputTargets.length > 0 &&
      write.inputTargets.every(
        target =>
          target.targetSource === 'Context' &&
          target.targetGroupKey !== '' &&
          partyTargetGroups.get(target.targetGroupKey) === 'spatialPoint',
      )
    ) {
      const nextGroups = new Map(partyTargetGroups);
      nextGroups.set(write.targetGroupKey, 'spatialPoint');
      return { steps: [], state: nextGroups };
    }
    if (context.actionTargetTarget === 'currentAbilityEntity')
      throw new Error(`${node.sourcePath}: unaudited AbilityEntity target group`);
    if (context.actionTargetTarget === 'enemy')
      throw new Error(`${node.sourcePath}: unaudited single-enemy action target group`);
    if (context.actionTargetTarget === 'eventSource')
      throw new Error(`${node.sourcePath}: unaudited receiving Buff event target group`);
    const action = node.body.value.action;
    if (action.producerType === 'MergeTargetAction') {
      const sources = action.inputTargets.map((target, index) => {
        if (target.targetSource === 'Target' && target.targetGroupKey === '') {
          return { kind: 'target' as const, target: 'eventTarget' as const };
        }
        if (target.targetSource === 'Context' && target.targetGroupKey !== '') {
          return { kind: 'context' as const, contextKey: target.targetGroupKey };
        }
        throw new Error(
          `${node.sourcePath}.targets[${index}]: unsupported Buff merge target source`,
        );
      });
      return {
        steps: [
          {
            kind: 'mergeContextTargets',
            parameters: { saveToContextKey: action.targetGroupKey, sources },
          },
        ],
        state: partyTargetGroups,
      };
    }
    const partyKind =
      action.postProcessorTypes.length === 0 && !action.excludesOwner
        ? ('party' as const)
        : action.postProcessorTypes.length === 1 &&
            action.postProcessorTypes[0] === 'ExcludeTarget' &&
            action.excludesOwner
          ? ('partyExceptCaster' as const)
          : null;
    const centerMatchesCaster =
      action.center === 'ActionOwner' ||
      (action.center === 'ActionSource' &&
        context.actionSourceTarget === 'caster' &&
        context.actionOwnerTarget === 'caster');
    if (
      action.producerType !== 'FindTargetAction' ||
      action.finderType !== 'CharacterTeamFinder' ||
      action.validatorTypes.length !== 0 ||
      partyKind === null ||
      !centerMatchesCaster ||
      action.centerContextKey !== '' ||
      action.selectorOwner !== 'ActionOwner' ||
      action.selectorOwnerContextKey !== ''
    ) {
      throw new Error(`${node.sourcePath}: unsupported Buff target group query`);
    }
    const nextGroups = new Map(partyTargetGroups);
    nextGroups.set(action.targetGroupKey, partyKind);
    return { steps: [], state: nextGroups };
  }
  return {
    steps: compileActionNode(node, visualOnlyIds, partyTargetGroups, context),
    state: partyTargetGroups,
  };
}
