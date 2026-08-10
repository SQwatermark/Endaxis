import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { perlica } from '../../data/operators';
import { placeSkillGroup, type TimelineDocumentIdAllocator } from './placeSkillGroup';

function createIds(): TimelineDocumentIdAllocator {
  let next = 0;
  return { allocate: kind => `${kind}:${++next}` };
}

function createPerlicaScenario() {
  const scenario = createEmptyScenario('scenario:1', '佩丽卡样板');
  scenario.builds.operators.perlica = {
    id: 'perlica',
    operatorSlug: 'perlica',
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
    talentStates: {},
  };
  scenario.tracks[0] = {
    operatorBuildId: 'perlica',
    weaponBuildId: null,
    gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return scenario;
}

describe('placeSkillGroup', () => {
  it('places the generated basic-attack chain with definition defaults', () => {
    const original = createPerlicaScenario();
    const result = placeSkillGroup({
      scenario: original,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'basicAttack',
      startFrame: 30,
      ids: createIds(),
    });
    const casts = result.scenario.tracks[0]!.skillCasts;

    expect(original.tracks[0]!.skillCasts).toEqual([]);
    expect(casts).toHaveLength(4);
    expect(casts.map(cast => cast.placement.startFrame)).toEqual([
      30,
      30 + casts[0]!.editable.durationFrames,
      30 + casts[0]!.editable.durationFrames + casts[1]!.editable.durationFrames,
      30 +
        casts[0]!.editable.durationFrames +
        casts[1]!.editable.durationFrames +
        casts[2]!.editable.durationFrames,
    ]);
    expect(new Set(casts.map(cast => cast.placementGroup?.id)).size).toBe(1);
    expect(casts.map(cast => cast.placementGroup?.index)).toEqual([0, 1, 2, 3]);
    expect(casts.every(cast => cast.edited.length === 0)).toBe(true);
    expect(casts[0]?.source).toEqual({
      kind: 'operatorSkill',
      skillGroupKey: 'basicAttack',
      skillKey: 'basicAttack1',
    });
  });

  it('keeps a single skill outside a placement group and resolves its cost', () => {
    const result = placeSkillGroup({
      scenario: createPerlicaScenario(),
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 60,
      ids: createIds(),
    });
    const cast = result.scenario.tracks[0]!.skillCasts[0]!;

    expect(cast.placementGroup).toBeUndefined();
    expect(cast.editable.spCost).toBeGreaterThan(0);
    expect(cast.editable.scheduledSequences.length).toBeGreaterThan(0);
    expect(cast.edited).toEqual([]);
  });

  it('places one selected segment without creating a placement group', () => {
    const result = placeSkillGroup({
      scenario: createPerlicaScenario(),
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'basicAttack',
      skillKey: 'basicAttack3',
      startFrame: 45,
      ids: createIds(),
    });
    const casts = result.scenario.tracks[0]!.skillCasts;

    expect(casts).toHaveLength(1);
    expect(casts[0]!.source).toEqual({
      kind: 'operatorSkill',
      skillGroupKey: 'basicAttack',
      skillKey: 'basicAttack3',
    });
    expect(casts[0]!.placement.startFrame).toBe(45);
    expect(casts[0]!.placementGroup).toBeUndefined();
  });

  it('rejects a definition that does not match the track build', () => {
    const scenario = createPerlicaScenario();
    scenario.builds.operators.perlica!.operatorSlug = 'another';

    expect(() =>
      placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: perlica,
        skillGroupKey: 'battleSkill',
        startFrame: 0,
        ids: createIds(),
      }),
    ).toThrow("references 'another', not 'perlica'");
  });
});
