/** 换槽、冷却继承与成功回执的共同执行入口；不保存分支对象或替换登记。 */
import type { AbilitySystemRuntime } from '../abilities/abilitySystemRuntime';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from '../time/combatClock';
import type { SkillCooldown } from './skillCooldown';

interface CombatSkillSlotChangeHost {
  readonly operatorId: string;
  readonly abilitySystem: Pick<AbilitySystemRuntime, 'changeSkillSlot'>;
  readonly cooldowns: ReadonlyMap<string, { readonly cooldown: SkillCooldown }>;
  readonly clock: Pick<CombatClock, 'frame' | 'time'>;
  readonly receipt: CombatReceiptSink;
}

/** 只继承归一化进度；账本单侧缺失时还原槽位，两侧均缺失时不创建账本。 */
export function changeCombatSkillSlot(
  { operatorId, abilitySystem, cooldowns, clock, receipt }: CombatSkillSlotChangeHost,
  skillSlotKey: string,
  targetSkillKey: string,
  inheritOriginSkillCooldownProgress: boolean,
): void {
  const previousSkillKey = abilitySystem.changeSkillSlot(skillSlotKey, targetSkillKey);
  let inheritedCooldownProgress: number | undefined;
  try {
    if (inheritOriginSkillCooldownProgress && previousSkillKey !== targetSkillKey) {
      const source = cooldowns.get(`${operatorId}\u0000${previousSkillKey}`);
      const target = cooldowns.get(`${operatorId}\u0000${targetSkillKey}`);
      if ((source === undefined) !== (target === undefined)) {
        throw new Error(
          `ability skill slot '${skillSlotKey}' cannot inherit cooldown from ` +
            `'${previousSkillKey}' to '${targetSkillKey}' before both skills are assembled`,
        );
      }
      if (source !== undefined && target !== undefined) {
        inheritedCooldownProgress = source.cooldown.snapshot.progress;
        target.cooldown.setProgress(inheritedCooldownProgress);
      }
    }
  } catch (error) {
    abilitySystem.changeSkillSlot(skillSlotKey, previousSkillKey);
    throw error;
  }
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
