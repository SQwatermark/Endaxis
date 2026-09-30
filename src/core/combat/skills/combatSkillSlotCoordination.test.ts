import { describe, expect, it } from 'vitest';
import { AbilitySystemRuntime } from '../abilities/abilitySystemRuntime';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from '../time/combatClock';
import { changeCombatSkillSlot } from './combatSkillSlotCoordination';
import { SkillCooldown } from './skillCooldown';

function fixture() {
  return {
    operatorId: 'operator',
    abilitySystem: new AbilitySystemRuntime({
      skills: [],
      skillSlotGroups: [
        { skillSlotKey: 'battle', baseSkillKey: 'base', replacementSkillKeys: ['enhanced'] },
      ],
    }),
    cooldowns: new Map<string, { cooldown: SkillCooldown }>(),
    clock: new CombatClock(),
    receipt: new CombatReceiptCollector(),
  };
}

describe('技能槽切换协调', () => {
  it('只继承同干员的归一化进度，槽位和目标账本更新后才发布成功回执', () => {
    const host = fixture();
    const source = new SkillCooldown(10, 0);
    const target = new SkillCooldown(40, 0);
    const otherOperator = new SkillCooldown(40, 0);
    source.setProgress(0.25);
    host.cooldowns.set('operator\u0000base', { cooldown: source });
    host.cooldowns.set('operator\u0000enhanced', { cooldown: target });
    host.cooldowns.set('other\u0000enhanced', { cooldown: otherOperator });
    host.clock.advanceFrame();
    changeCombatSkillSlot(
      {
        ...host,
        receipt: {
          record: entry => {
            expect(host.abilitySystem.currentSkillKeyForSlot('battle')).toBe('enhanced');
            expect(target.snapshot.remainingFrames).toBe(30);
            host.receipt.record(entry);
          },
        },
      },
      'battle',
      'enhanced',
      true,
    );
    expect(source.snapshot.remainingFrames).toBe(7.5);
    expect(otherOperator.snapshot.progress).toBe(1);
    expect(host.receipt.entries).toEqual([
      {
        sequence: 0,
        frame: 1,
        time: 1 / 30,
        event: 'SkillSlotChanged',
        sourceId: 'operator',
        data: {
          skillSlotKey: 'battle',
          targetSkillKey: 'enhanced',
          previousSkillKey: 'base',
          inheritOriginSkillCooldownProgress: true,
          inheritedCooldownProgress: 0.25,
        },
      },
    ]);
  });

  it.each(['base', 'enhanced'])('只有 %s 账本时还原槽位，不改账本或发布成功回执', present => {
    const host = fixture();
    const cooldown = new SkillCooldown(10, 0);
    cooldown.setProgress(0.4);
    host.cooldowns.set(`operator\u0000${present}`, { cooldown });
    const before = structuredClone(cooldown.runtimeState);
    expect(() => changeCombatSkillSlot(host, 'battle', 'enhanced', true)).toThrow(
      "cannot inherit cooldown from 'base' to 'enhanced' before both skills are assembled",
    );
    expect(host.abilitySystem.currentSkillKeyForSlot('battle')).toBe('base');
    expect(cooldown.runtimeState).toEqual(before);
    expect(host.receipt.entries).toEqual([]);
  });

  it('未装配的两侧不补账本，不继承或同槽原地切换也不要求账本配对', () => {
    const host = fixture();
    changeCombatSkillSlot(host, 'battle', 'enhanced', true);
    expect(host.cooldowns.size).toBe(0);
    const cooldown = new SkillCooldown(20, 0);
    cooldown.setProgress(0.4);
    host.cooldowns.set('operator\u0000enhanced', { cooldown });
    changeCombatSkillSlot(host, 'battle', 'enhanced', true);
    changeCombatSkillSlot(host, 'battle', 'base', false);
    expect(cooldown.snapshot.progress).toBeCloseTo(0.4);
    expect(host.cooldowns.size).toBe(1);
    expect(host.receipt.entries.map(entry => entry.data)).toEqual([
      expect.objectContaining({ previousSkillKey: 'base', targetSkillKey: 'enhanced' }),
      expect.objectContaining({ previousSkillKey: 'enhanced', targetSkillKey: 'enhanced' }),
      expect.objectContaining({ previousSkillKey: 'enhanced', targetSkillKey: 'base' }),
    ]);
    for (const entry of host.receipt.entries)
      expect(entry.data).not.toHaveProperty('inheritedCooldownProgress');
  });
});
