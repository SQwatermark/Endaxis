import type { CompiledProjectileCallbackSkillProgram } from '../../compiler/combatProgram';
import { AbilitySystemRuntime } from './abilitySystemRuntime';
import {
  SkillRuntime,
  type CombatOperationContext,
  type CombatOperationExecutor,
} from './skillRuntime';
import { COMBAT_FRAMES_PER_SECOND, type CombatClock } from './combatClock';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { AbilitySkillPayload } from '../events/combatAbilityEvent';
import { uniformAbilityTickDeltas } from './timeDilationRuntime';

export interface CallbackSkillHost {
  readonly skill: SkillRuntime;
  readonly ability: AbilitySystemRuntime;
  start(): void;
  end(): void;
  advance(deltaSeconds: number): void;
}
export type CallbackSkillHostFactory = (
  program: CompiledProjectileCallbackSkillProgram,
  context: CombatOperationContext,
  operations: CombatOperationExecutor,
) => CallbackSkillHost;

/** 仅装配公共技能/能力系统；时间轴、支付事件和Buff清理由SkillRuntime负责。 */
export function createCallbackSkillHostFactory(dependencies: {
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly definitionOperatorId: string;
  readonly allocateSkillCastId: () => number;
  readonly emitEvent?: (
    ownerId: string,
    event: 'beforeCastSkill' | 'skillEnd' | 'afterSkillApplyCost',
    payload: AbilitySkillPayload,
  ) => void;
}): CallbackSkillHostFactory {
  const create: CallbackSkillHostFactory = (program, context, operations) => {
    const target = context.actionOwnerAbilityEntity;
    const source = context.skillCastInfo;
    if (target === undefined || source === undefined)
      throw new Error('callback skill requires its entity identity and inherited cast information');
    if (program.castResource.cost.availabilityThreshold !== 0)
      throw new Error('callback skill has a nonzero SP availability threshold');
    const ownerId = `ability-entity:${target.instanceId}`;
    const skill = new SkillRuntime(
      {
        operatorId: dependencies.definitionOperatorId,
        skillId: program.skillId,
        nativeSkillType: program.nativeSkillType,
        naturalDurationFrames: program.naturalDurationFrames,
        initialBlackboard: program.initialBlackboard,
        timelineActions: program.timelineActions,
        costFrame: program.castResource.costFrame,
        ...(program.castResource.cooldownSeconds > 0
          ? { cooldownFrames: program.castResource.cooldownSeconds * COMBAT_FRAMES_PER_SECOND }
          : {}),
        costs: [program.castResource.cost],
      },
      {
        clock: dependencies.clock,
        receipt: dependencies.receipt,
        resources: null,
        allocateSkillCastId: dependencies.allocateSkillCastId,
        operations,
        actionBlackboard: context.blackboard.createLocalScope(program.initialBlackboard, true),
        scheduleProjectileFinishCallback: context.scheduleProjectileFinishCallback,
        createCallbackSkillHost: create,
        hostIdentity: {
          actionOwnerId: ownerId,
          actionSourceId: ownerId,
          eventSourceId: ownerId,
          actionOwnerAbilityEntity: target,
        },
        emitSkillEnd: payload => dependencies.emitEvent?.(ownerId, 'skillEnd', payload),
        emitAfterSkillApplyCost: payload =>
          dependencies.emitEvent?.(ownerId, 'afterSkillApplyCost', payload),
      },
    );
    let delta = 0;
    const ability = new AbilitySystemRuntime({
      skills: [skill],
      resolveTickDeltas: () => uniformAbilityTickDeltas(delta),
    });
    return {
      skill,
      ability,
      start: () => {
        ability.prepareBeforeSkillCastStart(program.skillId, undefined, () => {
          dependencies.emitEvent?.(ownerId, 'beforeCastSkill', {
            sourceId: ownerId,
            targetId: ownerId,
            skillId: program.skillId,
            skillCastId: source.skillCastId,
            skillCastInfo: source,
            attachBuffToCurrentSkill: buff => skill.attachBuffToCast(source.skillCastId, buff),
          });
        });
        ability.tryStartProjectileCallbackSkill(program.skillId, source);
      },
      end: () => skill.interrupt('default'),
      advance: deltaSeconds => {
        if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0)
          throw new RangeError('callback delta must be finite and non-negative');
        delta = deltaSeconds;
        ability.advanceFrame();
      },
    };
  };
  return create;
}
