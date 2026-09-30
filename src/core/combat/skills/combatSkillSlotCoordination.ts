/** 换槽、替换登记、冷却继承与成功回执的共同入口；执行计划只在本次调用内使用。 */
import type { AbilitySystemRuntime } from '../abilities/abilitySystemRuntime';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from '../time/combatClock';
import type { SkillCooldown } from './skillCooldown';

export interface CombatSkillSlotChangeHost {
  readonly operatorId: string;
  readonly abilitySystem: Pick<
    AbilitySystemRuntime,
    'runtimeState' | 'currentSkillKeyForSlot' | 'validateSkillSlotChange' | 'changeSkillSlot'
  >;
  readonly cooldowns: ReadonlyMap<string, { readonly cooldown: SkillCooldown }>;
  readonly clock: Pick<CombatClock, 'frame' | 'time'>;
  readonly receipt: CombatReceiptSink;
}

interface SkillSlotChangePlan {
  readonly skillSlotKey: string;
  readonly targetSkillKey: string;
  readonly previousSkillKey: string;
  readonly inheritOriginSkillCooldownProgress: boolean;
  readonly cooldownTransfer?: { readonly source: SkillCooldown; readonly target: SkillCooldown };
}

/** 先检查身份与账本配对；两侧均缺失时不补造账本。这里只验证，不快照冷却进度。 */
function prepareSkillSlotChange(
  { operatorId, abilitySystem, cooldowns }: CombatSkillSlotChangeHost,
  skillSlotKey: string,
  targetSkillKey: string,
  inheritOriginSkillCooldownProgress: boolean,
  previousSkillKey = abilitySystem.currentSkillKeyForSlot(skillSlotKey),
): SkillSlotChangePlan {
  abilitySystem.validateSkillSlotChange(skillSlotKey, targetSkillKey);
  let cooldownTransfer: SkillSlotChangePlan['cooldownTransfer'];
  if (inheritOriginSkillCooldownProgress && previousSkillKey !== targetSkillKey) {
    const source = cooldowns.get(`${operatorId}\u0000${previousSkillKey}`);
    const target = cooldowns.get(`${operatorId}\u0000${targetSkillKey}`);
    if ((source === undefined) !== (target === undefined)) {
      throw new Error(
        `ability skill slot '${skillSlotKey}' cannot inherit cooldown from ` +
          `'${previousSkillKey}' to '${targetSkillKey}' before both skills are assembled`,
      );
    }
    if (source !== undefined && target !== undefined)
      cooldownTransfer = { source: source.cooldown, target: target.cooldown };
  }
  return {
    skillSlotKey,
    targetSkillKey,
    previousSkillKey,
    inheritOriginSkillCooldownProgress,
    ...(cooldownTransfer === undefined ? {} : { cooldownTransfer }),
  };
}

/** 依次执行已验证的切换；冷却在实际换入前读取，保留旧撤销到新换入的进度传递。 */
function applySkillSlotChange(
  { operatorId, abilitySystem, clock, receipt }: CombatSkillSlotChangeHost,
  plan: SkillSlotChangePlan,
): void {
  const { skillSlotKey, targetSkillKey, previousSkillKey, inheritOriginSkillCooldownProgress } =
    plan;
  const inheritedCooldownProgress = plan.cooldownTransfer?.source.snapshot.progress;
  abilitySystem.changeSkillSlot(skillSlotKey, targetSkillKey);
  if (inheritedCooldownProgress !== undefined)
    plan.cooldownTransfer!.target.setProgress(inheritedCooldownProgress);
  receipt.record({
    frame: clock.frame,
    time: clock.time,
    event: 'SkillSlotChanged',
    sourceId: operatorId,
    data: {
      skillSlotKey,
      targetSkillKey,
      previousSkillKey,
      inheritOriginSkillCooldownProgress,
      ...(inheritedCooldownProgress === undefined ? {} : { inheritedCooldownProgress }),
    },
  });
}

export function changeCombatSkillSlot(
  host: CombatSkillSlotChangeHost,
  skillSlotKey: string,
  targetSkillKey: string,
  inheritOriginSkillCooldownProgress: boolean,
): void {
  applySkillSlotChange(
    host,
    prepareSkillSlotChange(host, skillSlotKey, targetSkillKey, inheritOriginSkillCooldownProgress),
  );
}

/** 按 combat-spec ChangeSkillAction 的顺序，先快照默认还原身份，再撤销同槽旧登记。 */
export function replaceCombatSkillSlot(
  host: CombatSkillSlotChangeHost,
  parameters: {
    readonly skillSlotKey: string;
    readonly targetSkillKey: string;
    readonly revertedSkillKey?: string;
    readonly inheritOriginSkillCooldownProgress: boolean;
  },
): number {
  const { abilitySystem } = host;
  const state = abilitySystem.runtimeState;
  const { skillSlotKey, targetSkillKey, inheritOriginSkillCooldownProgress } = parameters;
  const revertedSkillKey =
    parameters.revertedSkillKey ?? abilitySystem.currentSkillKeyForSlot(skillSlotKey);
  abilitySystem.validateSkillSlotChange(skillSlotKey, revertedSkillKey);
  const previous = state.skillSlotReplacements.get(skillSlotKey);
  const revertPlan =
    previous === undefined
      ? undefined
      : prepareSkillSlotChange(
          host,
          skillSlotKey,
          previous.revertedSkillKey,
          previous.inheritOriginSkillCooldownProgress,
        );
  const replacementPlan = prepareSkillSlotChange(
    host,
    skillSlotKey,
    targetSkillKey,
    inheritOriginSkillCooldownProgress,
    previous?.revertedSkillKey,
  );
  // 装配不变量全部通过后才执行；不承诺外部回执异常等情况的整体回滚。
  if (revertPlan !== undefined) {
    applySkillSlotChange(host, revertPlan);
    state.skillSlotReplacements.delete(skillSlotKey);
  }
  applySkillSlotChange(host, replacementPlan);
  const registrationId = state.nextSkillSlotReplacementId++;
  state.skillSlotReplacements.set(skillSlotKey, {
    registrationId,
    revertedSkillKey,
    inheritOriginSkillCooldownProgress,
  });
  return registrationId;
}

/** 旧编号与重复结束无效；验证和还原成功后才解除当前登记。 */
export function finishCombatSkillSlotReplacement(
  host: CombatSkillSlotChangeHost,
  skillSlotKey: string,
  registrationId: number,
): void {
  const state = host.abilitySystem.runtimeState;
  const replacement = state.skillSlotReplacements.get(skillSlotKey);
  if (replacement?.registrationId !== registrationId) return;
  const plan = prepareSkillSlotChange(
    host,
    skillSlotKey,
    replacement.revertedSkillKey,
    replacement.inheritOriginSkillCooldownProgress,
  );
  applySkillSlotChange(host, plan);
  state.skillSlotReplacements.delete(skillSlotKey);
}
