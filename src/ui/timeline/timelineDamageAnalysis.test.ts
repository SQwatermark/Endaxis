import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import { createEmptyScenario } from '../../core/project/createProject';
import {
  projectTimelineDamageAnalysis,
  projectPublishedTimelineDamageAnalysis,
} from './timelineDamageAnalysis';
import { computed, shallowRef } from 'vue';
import type { PublishedScenarioSimulation } from './useScenarioSimulation';

describe('projectTimelineDamageAnalysis', () => {
  it('keeps owner and analysis range paired with the published receipt across edits and publication', () => {
    const original = createEmptyScenario('snapshot', 'snapshot');
    original.battle.simulationRange = { startFrame: 0, endFrame: 300 };
    original.tracks[0] = {
      id: 'track:1',
      operator: {
        operatorSlug: 'perlica',
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 0,
        skillLevels: { basicAttack: 1, battleSkill: 1, comboSkill: 1, ultimate: 1 },
        talentStates: {},
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    const receipt: CombatReceiptEntry = {
      sequence: 1,
      frame: 90,
      time: 3,
      event: 'DamageApplied',
      sourceId: 'track:1',
      targetId: 'enemy',
      data: { value: 300, damageType: 'electric' },
    };
    const published = shallowRef<PublishedScenarioSimulation | null>({
      scenario: original,
      // 本投影只读取回执，完整模拟发布单元由 useScenarioSimulation 的测试覆盖。
      run: { receiptEntries: [receipt] } as unknown as PublishedScenarioSimulation['run'],
    });
    const analysis = computed(() =>
      projectPublishedTimelineDamageAnalysis(published.value, String, String),
    );
    const edited = structuredClone(original);
    edited.tracks[0]!.operator!.operatorSlug = 'arclight';
    edited.battle.simulationRange!.startFrame = 60;
    // Waiting/failed runs retain this entire snapshot, not just its damage array.
    expect(analysis.value.byOperator[0]?.label).toBe('perlica');
    expect(analysis.value.dps).toBe(100);
    published.value = {
      scenario: edited,
      run: { receiptEntries: [receipt] } as unknown as PublishedScenarioSimulation['run'],
    };
    expect(analysis.value.byOperator[0]?.label).toBe('arclight');
    expect(analysis.value.dps).toBe(300);
    published.value = null;
    expect(analysis.value.totalDamage).toBe(0);
    expect(analysis.value.byOperator).toEqual([]);
  });

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
