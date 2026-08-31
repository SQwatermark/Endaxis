import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import { createEmptyScenario } from '../../core/project/createProject';
import { projectTimelineDamageAnalysis } from './timelineDamageAnalysis';

describe('projectTimelineDamageAnalysis', () => {
  it('groups resolved damage by cast owner and type without capping to remaining health', () => {
    const scenario = createEmptyScenario('scenario:1', 'test');
    scenario.battle.prepFrames = 30;
    scenario.tracks[0] = {
      id: 'track:1',
      operator: null,
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [
        {
          id: 'cast:1',
          source: { kind: 'operatorSkill', skillGroupKey: 'g', skillKey: 's' },
          placement: { startFrame: 30 },
        },
      ],
    };
    const receipt = (frame: number, value: number, actualDamage: number): CombatReceiptEntry => ({
      frame,
      time: frame / 30,
      sequence: frame,
      event: 'DamageApplied',
      sourceId: 'ability-entity',
      targetId: 'enemy',
      data: {
        value,
        actualDamage,
        remainingHealth: 0,
        isCritical: false,
        damageType: 'heat',
        castId: 'cast:1',
      },
    });

    const result = projectTimelineDamageAnalysis(
      [receipt(60, 100, 10), receipt(90, 200, 0)],
      scenario,
      index => `干员 ${index + 1}`,
      type => type,
    );
    expect(result.totalDamage).toBe(300);
    expect(result.rotationSeconds).toBe(2);
    expect(result.dps).toBe(150);
    expect(result.byOperator[0]).toMatchObject({ label: '干员 1', value: 300, ratio: 1 });
    expect(result.byDamageType[0]).toMatchObject({ key: 'heat', value: 300 });
  });

  it('filters preparation damage and reports unattributed runtime sources explicitly', () => {
    const scenario = createEmptyScenario('scenario:1', 'test');
    scenario.battle.prepFrames = 30;
    const entries: CombatReceiptEntry[] = [
      {
        frame: 10,
        time: 1 / 3,
        sequence: 1,
        event: 'DamageApplied',
        sourceId: 'unknown',
        targetId: 'enemy',
        data: { value: 50, damageType: 'physical' },
      },
      {
        frame: 60,
        time: 2,
        sequence: 2,
        event: 'DamageApplied',
        sourceId: 'unknown',
        targetId: 'enemy',
        data: { value: 80, damageType: 'physical' },
      },
    ];
    const result = projectTimelineDamageAnalysis(entries, scenario, String, String);
    expect(result.totalDamage).toBe(80);
    expect(result.unattributedDamage).toBe(80);
  });
});
