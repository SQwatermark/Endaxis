import { expect, it } from 'vitest';
import { gameDataRepository as repository } from '../../data/gameDataRepository';
import { createEmptyProject } from '../../core/project/createProject';
import { validateProjectWithGameData } from '../../core/project/definitionValidation';
import type { GameDataRepository } from '../../core/game-data/gameDataRepository';
import { ScenarioSimulationService } from './scenarioSimulationService';
import { skillSettings, skillSettingResources } from '../../data/combat/skillSettings';

it('黎风第二天赋直伤与无关技能定义顺序无关，也不借用击倒战技的身份', async () => {
  const project = createEmptyProject({
    projectId: 'reactive-lifeng',
    scenarioName: '黎风天赋直伤',
    createdWith: 'regression',
    createdAt: '2026-09-30T00:00:00.000Z',
  });
  const scenario = project.scenarios[0]!;
  scenario.battle.durationFrames = 300;
  scenario.enemy.editable.hp = 1_000_000_000;
  scenario.tracks[0] = {
    id: 'lifeng',
    operator: {
      operatorSlug: 'lifeng',
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: { '0': 0, '1': 2 },
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [1, 120].map((frame, index) => ({
      id: `battle-cast-${index + 1}`,
      source: {
        kind: 'operatorSkill',
        skillGroupKey: 'battleSkill',
        skillKey: 'chr_0015_lifeng_normal_skill',
      },
      placement: { startFrame: frame },
    })),
  };
  expect(validateProjectWithGameData(project, repository).ok).toBe(true);
  const original = repository.getOperator('lifeng')!;
  // 诊断干预只调整定义目录，保留技能、养成、配装和实际排轴。
  const reordered = {
    ...original,
    skillGroups: [
      ...original.skillGroups.filter(group => group.key === 'battleSkill'),
      ...original.skillGroups.filter(group => group.key !== 'battleSkill'),
    ],
  };
  const reorderedRepository: GameDataRepository = {
    ...repository,
    getOperator: slug => (slug === 'lifeng' ? reordered : repository.getOperator(slug)),
  };
  const before = structuredClone(project);
  const results = [];
  for (const index of [repository, reorderedRepository]) {
    const result = await new ScenarioSimulationService({
      index,
      spellInflictionSettings: skillSettings,
      resources: {
        sharedSpGain: { baseGainEfficiency: skillSettingResources.atbGainEfficiency },
        spRecoveryPauseDuration: skillSettingResources.atbRecoverInterval,
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: {
          selfGainPerSp: skillSettingResources.atbConsumedDefaultUspGainSelf,
          otherGainPerSp: skillSettingResources.atbConsumedDefaultUspGainOther,
        },
      },
    }).simulate(scenario, 300);
    expect(result.executionDiagnostics).toEqual([]);
    const hits = result.receiptEntries.filter(
      entry =>
        entry.event === 'DamageApplied' &&
        String(entry.data?.stepKey).includes('buff_chr_0015_lifeng_talent_2'),
    );
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({
      frame: 180,
      sourceId: 'lifeng',
      producedBy: { kind: 'buff', ownerId: 'lifeng' },
      data: { value: 394.912, sourceActionId: 'upgrade-initialization:talent:1' },
    });
    expect(hits[0]!.data).not.toHaveProperty('skillType');
    expect(hits[0]!.data).not.toHaveProperty('castId');
    results.push(result);
  }
  expect(results[1]!.receiptEntries).toEqual(results[0]!.receiptEntries);
  expect(project).toEqual(before);
});
