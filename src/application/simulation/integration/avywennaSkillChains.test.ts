import { describe, expect, it } from 'vitest';
import { avywenna } from '../../../data/operators/avywenna.generated';
import { createEditorSimulationService } from '../testSupport/editorSimulationService';
import { createEmptyScenario } from '../../../core/project/createProject';
import { placeSkillGroup } from '../../../ui/timeline/interaction/placeSkillGroup';

describe('艾维文娜技能召回与实体回收', () => {
  it('真实连携→战技能生成枪、召回并造成伤害', async () => {
    const result = await simulate([
      ['comboSkill', 1],
      ['battleSkill', 200],
    ]);
    const spawned = result.receiptEntries.filter(entry => entry.event === 'AbilityEntitySpawned');
    const finished = result.receiptEntries.filter(entry => entry.event === 'AbilityEntityFinished');
    expect(spawned.length).toBeGreaterThan(0);
    expect(finished).toHaveLength(spawned.length);
    expect(finished.every(entry => entry.frame < 600)).toBe(true);
    expect(
      result.receiptEntries.some(entry => entry.event === 'DamageApplied' && entry.frame > 200),
    ).toBe(true);
  });

  it('真实终结技→战技走完整实体/Buff/回收链', async () => {
    const result = await simulate([
      ['ultimate', 1],
      ['battleSkill', 200],
    ]);
    expect(
      result.receiptEntries.filter(entry => entry.event === 'AbilityEntitySpawned'),
    ).toHaveLength(1);
    expect(
      result.receiptEntries.filter(entry => entry.event === 'AbilityEntityFinished'),
    ).toHaveLength(1);
    expect(result.receiptEntries.some(entry => entry.event === 'DamageApplied')).toBe(true);
  });
});

async function simulate(casts: readonly (readonly [string, number])[]) {
  const operator = avywenna;
  let scenario = createEmptyScenario('full-operator', '艾维文娜技能链');
  scenario.battle.durationFrames = 600;
  scenario.enemy.editable.hp = 1e9;
  scenario.tracks[0] = {
    id: 'track:full',
    operator: {
      operatorSlug: operator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: { '0': 2, '1': 2 },
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 1000, maxUltimateEnergyOverride: 1000 },
    skillCasts: [],
  };
  let serial = 0;
  for (const [skillGroupKey, startFrame] of casts)
    scenario = placeSkillGroup({
      scenario,
      operator,
      trackIndex: 0,
      skillGroupKey,
      startFrame,
      ids: { allocate: kind => `${kind}:full:${serial++}` },
    }).scenario;
  return createEditorSimulationService().simulate(scenario, 600);
}
