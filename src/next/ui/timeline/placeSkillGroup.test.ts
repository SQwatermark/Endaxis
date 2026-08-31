import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { laevatain, mifu, perlica, zhuangFangyi } from '../../data/operators';
import { placeSkillGroup, type TimelineDocumentIdAllocator } from './placeSkillGroup';

function createIds(): TimelineDocumentIdAllocator {
  let next = 0;
  return { allocate: kind => `${kind}:${++next}` };
}

function createPerlicaScenario() {
  const scenario = createEmptyScenario('scenario:1', '佩丽卡样板');

  scenario.tracks[0] = {
    id: 'track:0',
    operator: {
      operatorSlug: 'perlica',
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
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
    const basicAttack = perlica.skillGroups.find(group => group.key === 'basicAttack')!;
    const skills = Array.isArray(basicAttack.skills) ? basicAttack.skills : [basicAttack.skills];
    expect(casts.map(cast => cast.placement.startFrame)).toEqual([
      30,
      30 + skills[0]!.timelineBlockFrames,
      30 + skills[0]!.timelineBlockFrames + skills[1]!.timelineBlockFrames,
      30 +
        skills[0]!.timelineBlockFrames +
        skills[1]!.timelineBlockFrames +
        skills[2]!.timelineBlockFrames,
    ]);
    expect(casts[0]?.source).toEqual({
      kind: 'operatorSkill',
      skillGroupKey: 'basicAttack',
      skillKey: 'basicAttack1',
    });
  });

  it('keeps a single skill as one cast and resolves its cost', () => {
    const result = placeSkillGroup({
      scenario: createPerlicaScenario(),
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 60,
      ids: createIds(),
    });
    const cast = result.scenario.tracks[0]!.skillCasts[0]!;

    const battleSkill = perlica.skillGroups.find(group => group.key === 'battleSkill')!;
    const skill = Array.isArray(battleSkill.skills) ? battleSkill.skills[0] : battleSkill.skills;
    expect(skill?.costs?.length ?? 0).toBeGreaterThan(0);
    expect(skill?.scheduledSequences.length ?? 0).toBeGreaterThan(0);
    expect(cast.source).toEqual({
      kind: 'operatorSkill',
      skillGroupKey: 'battleSkill',
      skillKey: 'battleSkill',
    });
  });

  it('places one selected segment of a skill chain', () => {
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
  });

  it('places an enhanced basic-attack variant without changing its stable parent group', () => {
    const scenario = createPerlicaScenario();
    scenario.tracks[0]!.operator!.operatorSlug = laevatain.slug;
    const result = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: laevatain,
      skillGroupKey: 'basicAttack',
      variantKey: 'enhancedBasicAttack',
      startFrame: 90,
      ids: createIds(),
    });

    expect(result.scenario.tracks[0]!.skillCasts).toHaveLength(4);
    expect(result.scenario.tracks[0]!.skillCasts.map(cast => cast.source)).toEqual([
      expect.objectContaining({ skillGroupKey: 'basicAttack', skillKey: 'ultimateAttack1' }),
      expect.objectContaining({ skillGroupKey: 'basicAttack', skillKey: 'ultimateAttack2' }),
      expect.objectContaining({ skillGroupKey: 'basicAttack', skillKey: 'ultimateAttack3' }),
      expect.objectContaining({ skillGroupKey: 'basicAttack', skillKey: 'ultimateAttack4' }),
    ]);
  });

  it('places a runtime replacement only when that concrete skill is selected', () => {
    const scenario = createPerlicaScenario();
    scenario.tracks[0]!.operator!.operatorSlug = laevatain.slug;
    const result = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: laevatain,
      skillGroupKey: 'battleSkill',
      skillKey: 'battleSkillDuringUltimate',
      startFrame: 120,
      ids: createIds(),
    });

    expect(result.scenario.tracks[0]!.skillCasts).toEqual([
      expect.objectContaining({
        source: {
          kind: 'operatorSkill',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkillDuringUltimate',
        },
      }),
    ]);
  });

  it('places explicitly configured replacement stages as one ordered Mifu chain', () => {
    const scenario = createPerlicaScenario();
    scenario.tracks[0]!.operator!.operatorSlug = mifu.slug;
    const result = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: mifu,
      skillGroupKey: 'battleSkill',
      startFrame: 10,
      ids: createIds(),
    });

    expect(
      result.scenario.tracks[0]!.skillCasts.map(cast =>
        cast.source.kind === 'operatorSkill' ? cast.source.skillKey : null,
      ),
    ).toEqual(['battleSkill1', 'battleSkill2', 'battleSkill3']);
    expect(result.scenario.tracks[0]!.skillCasts.map(cast => cast.placement.startFrame)).toEqual([
      10, 21, 49,
    ]);
  });

  it('does not allow an internal runtime skill to be placed explicitly', () => {
    const scenario = createPerlicaScenario();
    scenario.tracks[0]!.operator!.operatorSlug = zhuangFangyi.slug;

    expect(() =>
      placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: zhuangFangyi,
        skillGroupKey: 'ultimate',
        skillKey: 'ultimateEnd',
        startFrame: 10,
        ids: createIds(),
      }),
    ).toThrow("skill group 'ultimate' has no skill 'ultimateEnd'");
  });

  it('rejects a definition that does not match the track build', () => {
    const scenario = createPerlicaScenario();
    scenario.tracks[0]!.operator!.operatorSlug = 'another';

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
