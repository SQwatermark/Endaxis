import type { SkillType } from '../../game-data/operatorDefinition';
import type { AbilitySystemRuntime } from '../abilities/abilitySystemRuntime';
import type { BuffOperationTarget } from '../buffs/buffOperationExecutor';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { ComboWindowRuntime } from '../skills/comboWindowRuntime';
import type { OperatorCenterStateRuntime } from '../skills/operatorCenterStateRuntime';
import type { OperatorControlRuntime } from '../skills/operatorControlRuntime';
import { sameSkillSimulationInputs } from '../skills/skillSimulationInputs';
import type { UltimatePresentationRuntime } from '../skills/ultimatePresentationRuntime';
import type { OperatorCenterState } from '../state/abilityState';
import type { CombatSkillInput } from '../state/environmentState';
import type { SkillSimulationInputs } from '../state/foundationState';
import type { GameplayTagPredefine } from '../tags/gameplayTagPredefine';
import type { CombatClock } from '../time/combatClock';

type PlayerInputSkillResolution = ReturnType<AbilitySystemRuntime['resolvePlayerInputSkill']>;

/** 只连接本次输入所需的现有状态与执行入口，不持有排程或另一份能力状态。 */
export interface PlayerSkillInputHost {
  readonly clock: Pick<CombatClock, 'frame' | 'time'>;
  readonly receipt: CombatReceiptSink;
  readonly castParameters: Map<string, SkillSimulationInputs>;
  readonly operatorControl: Pick<OperatorControlRuntime, 'beforeSkillInput'>;
  readonly ultimatePresentation: Pick<UltimatePresentationRuntime, 'inUltimateCasting'>;
  readonly skillAvailabilityTags?: GameplayTagPredefine;
  readonly submitCastRandomSeed?: (castId: string, seed: number | undefined) => void;
  requireAbilitySystem(operatorId: string): AbilitySystemRuntime;
  ensureCastInstance(operatorId: string, skillId: string, castId?: string): void;
  skillTypeForCast(operatorId: string, skillId: string, castId?: string): SkillType | undefined;
  centerForOperator(
    operatorId: string,
  ):
    | { readonly runtime: OperatorCenterStateRuntime; readonly state: OperatorCenterState }
    | undefined;
  casterBuffTarget(operatorId: string): BuffOperationTarget;
  resolvePlayerInputSkill(input: CombatSkillInput): PlayerInputSkillResolution;
  prepareTimelineSkillStart(
    operatorId: string,
    skillId: string,
    castId: string | undefined,
    consumeComboWindow: boolean,
  ): void;
}

/**
 * 登记玩家输入，依次诊断原生请求，再执行时间轴显式技能。
 * 返回值仅表示执行成功（含 SwitchToBuffCast），不表示原生合法性或保证有 SkillStarted。
 * 诊断不拒绝已放置操作；未查明的检查仍单独记录 unknown，不从告警缺失推导合法。
 */
export function tryStartPlayerSkillInput(
  input: CombatSkillInput,
  host: PlayerSkillInputHost,
): boolean {
  const { operatorId, skillId: expectedSkillId, castId, action, simulationInputs = {} } = input;
  const ability = host.requireAbilitySystem(operatorId);
  const parameterKey = `${operatorId}\u0000${castId ?? expectedSkillId}`;
  const existingParameters = host.castParameters.get(parameterKey);
  if (
    existingParameters !== undefined &&
    !sameSkillSimulationInputs(existingParameters, simulationInputs)
  ) {
    throw new Error(`cannot change submitted skill parameters '${parameterKey}'`);
  }
  if (existingParameters === undefined)
    host.castParameters.set(parameterKey, structuredClone(simulationInputs));
  if (castId !== undefined) host.submitCastRandomSeed?.(castId, simulationInputs.randomSeed);
  else if (simulationInputs.randomSeed !== undefined)
    throw new Error('a cast seed requires a cast id');
  host.ensureCastInstance(operatorId, expectedSkillId, castId);
  const skillType = host.skillTypeForCast(operatorId, expectedSkillId, castId);
  host.operatorControl.beforeSkillInput(operatorId, action, skillType, castId);
  const center = host.centerForOperator(operatorId);
  if (ability.nativeSkillTypeForSkill(expectedSkillId) === 'attack' && center !== undefined) {
    const window = center.runtime.inspect(center.state);
    if (window.canConsumeAttack === false || window.canLeaveForAttack === false) {
      host.receipt.record({
        frame: host.clock.frame,
        time: host.clock.time,
        event: 'SkillInputBlockedByDashWindow',
        sourceId: operatorId,
        data: {
          skillId: expectedSkillId,
          ...(castId === undefined ? {} : { castId }),
          dodgeId: center.state.dashId,
          attackInputBlocked: window.canConsumeAttack === false,
          attackTransitionBlocked: window.canLeaveForAttack === false,
        },
      });
    }
  }
  const tagRules = host.skillAvailabilityTags;
  if (tagRules !== undefined) {
    const blocker = tagRules.getCommonSkillCastBlocker(host.casterBuffTarget(operatorId));
    if (blocker !== undefined) {
      host.receipt.record({
        frame: host.clock.frame,
        time: host.clock.time,
        event: 'SkillInputBlockedByCommonTag',
        sourceId: operatorId,
        data: { skillId: expectedSkillId, blocker, ...(castId === undefined ? {} : { castId }) },
      });
    }
  }
  // 原生 OnPressUltimateSkillStart 在请求前检查演出标志；这里只诊断该输入，
  // 不把演出扩展为全部技能的生命周期或中断门禁。
  if (action === 'ultimate' && host.ultimatePresentation.inUltimateCasting) {
    host.receipt.record({
      frame: host.clock.frame,
      time: host.clock.time,
      event: 'UltimateInputBlockedByPresentation',
      sourceId: operatorId,
      data: { skillId: expectedSkillId, ...(castId === undefined ? {} : { castId }) },
    });
  }
  const resolution = host.resolvePlayerInputSkill({
    operatorId,
    skillId: expectedSkillId,
    action,
  });
  if (resolution.status === 'mismatched') {
    host.receipt.record({
      frame: host.clock.frame,
      time: host.clock.time,
      event: 'SkillInputResolvedToDifferentSkill',
      sourceId: operatorId,
      data: {
        skillId: expectedSkillId,
        actualSkillId: resolution.actualSkillKey,
        ...(castId === undefined ? {} : { castId }),
      },
    });
  } else if (resolution.status === 'unknown') {
    host.receipt.record({
      frame: host.clock.frame,
      time: host.clock.time,
      event: 'SkillInputResolutionUnknown',
      sourceId: operatorId,
      data: {
        skillId: expectedSkillId,
        reason: resolution.reason,
        ...(castId === undefined ? {} : { castId }),
      },
    });
  }
  // 原生先解析操作实际指向的技能，再对该技能执行中断门禁。时间轴块即使不一致
  // 仍会被强制执行，但诊断不能拿块中期望技能冒充原生请求。
  const interruptionSkillId =
    resolution.status === 'matched' || resolution.status === 'mismatched'
      ? resolution.actualSkillKey
      : expectedSkillId;
  if (tagRules !== undefined) {
    const target = host.casterBuffTarget(operatorId);
    // 公共门禁已经诊断；原生 CheckTag 在此短路，不再叠加类型专用原因。
    if (tagRules.getCommonSkillCastBlocker(target) === undefined) {
      const nativeSkillType = ability.nativeSkillTypeForSkill(interruptionSkillId);
      const currentNormalSkillId = ability.currentNormalSkillId;
      const blocker = tagRules.getSkillTypeCastBlocker(
        target,
        nativeSkillType,
        currentNormalSkillId === undefined
          ? undefined
          : interruptionSkillId === currentNormalSkillId,
      );
      if (blocker !== undefined) {
        host.receipt.record({
          frame: host.clock.frame,
          time: host.clock.time,
          event: 'SkillInputBlockedByTypeTag',
          sourceId: operatorId,
          data: {
            skillId: expectedSkillId,
            assessedSkillId: interruptionSkillId,
            nativeSkillType,
            blocker,
            ...(castId === undefined ? {} : { castId }),
          },
        });
      }
    }
  }
  const interruption = ability.evaluatePlayerInputInterruption(
    interruptionSkillId,
    interruptionSkillId === expectedSkillId ? castId : undefined,
  );
  if (interruption.status === 'blocked') {
    host.receipt.record({
      frame: host.clock.frame,
      time: host.clock.time,
      event: 'SkillInputCannotInterruptCurrentSkill',
      sourceId: operatorId,
      data: {
        skillId: expectedSkillId,
        assessedSkillId: interruptionSkillId,
        currentSkillId: interruption.currentSkillKey,
        ...(ability.currentSkillCastId === undefined
          ? {}
          : { currentCastId: ability.currentSkillCastId }),
        // 保存输入阶段实际读到的局部帧，不用两个全局输入时刻相减推测。
        // 膨胀与同帧推进顺序都会使这两个量不同。
        ...(ability.currentSkillTimelineFrame === undefined
          ? {}
          : { currentSkillTimelineFrame: ability.currentSkillTimelineFrame }),
        ...(castId === undefined ? {} : { castId }),
      },
    });
  } else if (interruption.status === 'unknown') {
    host.receipt.record({
      frame: host.clock.frame,
      time: host.clock.time,
      event: 'SkillInputInterruptionUnknown',
      sourceId: operatorId,
      data: {
        skillId: expectedSkillId,
        assessedSkillId: interruptionSkillId,
        reason: interruption.reason,
        ...(castId === undefined ? {} : { castId }),
      },
    });
  }
  if (!ability.canStartSkill(expectedSkillId, castId, false)) return false;
  host.prepareTimelineSkillStart(operatorId, expectedSkillId, castId, action === 'comboSkill');
  return ability.tryStartTimelineSkill(expectedSkillId, castId);
}

/** 固定排程提交与逐帧输入查询共用同一 HUD 候选和能力系统路由。 */
export function resolvePlayerSkillInput(
  input: CombatSkillInput,
  comboWindows: Pick<ComboWindowRuntime, 'first'>,
  requireAbilitySystem: PlayerSkillInputHost['requireAbilitySystem'],
): PlayerInputSkillResolution {
  // 原生连携输入优先使用 HUD 当前候选，而非无候选时的静态技能槽。
  const pendingCombo = input.action === 'comboSkill' ? comboWindows.first : undefined;
  if (
    pendingCombo !== undefined &&
    pendingCombo.operatorId === input.operatorId &&
    pendingCombo.nativeCondition === undefined
  ) {
    return pendingCombo.nextSkillKey === input.skillId
      ? ({ status: 'matched', actualSkillKey: pendingCombo.nextSkillKey } as const)
      : ({ status: 'mismatched', actualSkillKey: pendingCombo.nextSkillKey } as const);
  }
  return requireAbilitySystem(input.operatorId).resolvePlayerInputSkill(
    input.skillId,
    input.action,
  );
}
