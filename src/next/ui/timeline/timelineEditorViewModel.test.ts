import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { perlica } from '../../data/operators';
import { placeSkillGroup } from './placeSkillGroup';
import { projectTimelineEditor } from './timelineEditorViewModel';

describe('projectTimelineEditor', () => {
  it('keeps a cast in place and reports a local issue after its template skill key is edited', () => {
    const scenario = createEmptyScenario('scenario:template-edit', 'Template edit');
    scenario.tracks[0] = {
      id: 'track:template-edit',
      operator: {
        operatorSlug: 'edited-operator',
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 100,
        skillLevels: { battleSkill: 1 },
        talentStates: {},
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [
        {
          id: 'cast:kept',
          source: { kind: 'operatorSkill', skillGroupKey: 'battleSkill', skillKey: 'old-key' },
          placement: { startFrame: 45 },
        },
      ],
    };
    const edited = {
      ...perlica,
      slug: 'edited-operator',
      skillGroups: [
        {
          ...perlica.skillGroups.find(group => group.key === 'battleSkill')!,
          skills: { key: 'new-key', timelineBlockFrames: 30, scheduledSequences: [] },
        },
      ],
    };

    const result = projectTimelineEditor(scenario, {
      getOperator: slug => (slug === edited.slug ? edited : null),
    });

    expect(result.tracks[0]!.skillCasts).toHaveLength(1);
    expect(result.tracks[0]!.skillCasts[0]).toMatchObject({
      id: 'cast:kept',
      startFrame: 45,
      durationFrames: 0,
      resolutionIssue: "skill group 'edited-operator/battleSkill' has no skill 'old-key'",
    });
    expect(result.tracks[0]!.issues[0]).toContain("cast 'cast:kept'");
  });
  it('projects a definition-backed operator track without leaking mutable definitions', () => {
    const scenario = createEmptyScenario('scenario:1', '佩丽卡样板');

    scenario.tracks[0] = {
      id: 'track:0',
      operator: {
        operatorSlug: 'perlica',
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: {
          basicAttack: 12,
          battleSkill: 11,
          comboSkill: 10,
          ultimate: 9,
        },
        talentStates: {},
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 30,
      ids: { allocate: kind => `${kind}:1` },
    });

    const viewModel = projectTimelineEditor(placed.scenario, {
      getOperator: slug => (slug === perlica.slug ? perlica : null),
    });

    expect(viewModel.tracks).toHaveLength(4);
    expect(viewModel.tracks[0]?.operatorSlug).toBe('perlica');
    expect(viewModel.tracks[0]?.operatorAssetSlug).toBe('perlica');
    expect(viewModel.tracks[0]?.operatorSupport).toEqual({
      completeness: 'partial',
      missingCapabilities: [{ capability: 'talentEffects' }],
    });
    expect(viewModel.tracks[0]?.initialUltimateEnergy).toBe(0);
    expect(viewModel.tracks[0]?.maxUltimateEnergy).toBe(80);
    expect(viewModel.tracks[0]?.skillLibrary.map(entry => entry.skillGroupKey)).toEqual([
      'basicAttack',
      'finisher',
      'plungingAttack',
      'battleSkill',
      'comboSkill',
      'ultimate',
    ]);
    expect(viewModel.tracks[0]?.skillLibrary[0]?.level).toBe(12);
    expect(viewModel.tracks[0]?.skillLibrary[0]?.skills).toHaveLength(4);
    expect(viewModel.tracks[0]?.skillCasts[0]?.skillType).toBe('battleSkill');
    expect(viewModel.tracks[1]).toMatchObject({
      operatorSlug: null,
      operatorAssetSlug: null,
      operatorSupport: null,
      initialUltimateEnergy: 0,
      maxUltimateEnergy: null,
      skillLibrary: [],
    });
  });

  it('keeps project template identity separate from inherited operator assets', () => {
    const scenario = createEmptyScenario('scenario:custom-assets', '自定义资源');
    scenario.tracks[0] = {
      id: 'track:custom-assets',
      operator: {
        operatorSlug: 'project:operator:1',
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 100,
        skillLevels: {},
        talentStates: {},
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    const customOperator = {
      ...perlica,
      slug: 'project:operator:1',
      assetSlug: 'perlica',
    };

    const viewModel = projectTimelineEditor(scenario, {
      getOperator: slug => (slug === customOperator.slug ? customOperator : null),
    });

    expect(viewModel.tracks[0]).toMatchObject({
      operatorSlug: 'project:operator:1',
      operatorAssetSlug: 'perlica',
    });
  });

  it('reports missing operator definitions instead of inventing definition defaults', () => {
    const scenario = createEmptyScenario('scenario:1', '损坏引用');
    scenario.tracks[0] = {
      id: 'track:0',
      operator: {
        operatorSlug: 'missing',
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: {},
        talentStates: {},
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };

    const viewModel = projectTimelineEditor(scenario, { getOperator: () => null });

    expect(viewModel.tracks[0]?.issues).toEqual(["missing operator definition 'missing'"]);
    expect(viewModel.tracks[0]?.skillLibrary).toEqual([]);
  });
});
