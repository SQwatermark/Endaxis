import { expect, it } from 'vitest';
import { convertLegacyTimeline } from './convert';
import { gameDataRepository } from '../../src/data/gameDataRepository';
import { parseProjectDocument } from '../../src/core/project/serialization';
import realAxisMappings from './mappings.2026-08-31.json';
import type { ConversionMappings } from './sourcePreparation';

it('真实轴的末次诀终结技明确映射为秘仪，不自动替换其他终结技', () => {
  const input = fixture();
  const scenario = input.scenarioList[0]!;
  scenario.id = 'sc_zpm5ozw';
  scenario.data.operators[0]!.operatorSlug = 'arcane';
  scenario.data.tracks[0]!.id = 'arcane';
  scenario.data.tracks[0]!.actions = Array.from({ length: 48 }, (_, index) => ({
    skillId: 'ultimate',
    sourceSkillKey: 'ultimate',
    type: 'ultimate',
    startTime: 300 + index * 180,
    logicalStartTime: 300 + index * 180,
  }));
  const result = convertLegacyTimeline(
    input,
    gameDataRepository,
    realAxisMappings as ConversionMappings,
  );
  expect(result.report.issues).toEqual([]);
  const casts = result.project!.scenarios[0]!.tracks[0]!.skillCasts;
  expect(casts[39]!.source).toMatchObject({ skillGroupKey: 'ultimate', skillKey: 'ultimate' });
  expect(casts[47]!.source).toMatchObject({ skillGroupKey: 'ultimate', skillKey: 'arcana' });
});

function fixture() {
  return {
    version: '1.0.0',
    timeUnit: 'frame',
    fps: 60,
    scenarioList: [
      {
        id: 'test-axis',
        name: '转换测试',
        data: {
          operators: [
            {
              id: 'op',
              operatorSlug: 'old-perlica',
              level: 90,
              promoted: true,
              potential: 0,
              trustLevel: 4,
              skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
              talentStates: { 0: 2, 1: 1 },
            },
          ],
          weapons: [],
          gears: [],
          initialGaugeMode: 'empty',
          prepDuration: 300,
          battleDuration: 7200,
          systemConstants: {
            maxSp: 300,
            initialSp: 300,
            spRegenRate: 8,
            skillSpCostDefault: 100,
            enemyHp: 100000,
            def: 100,
            superArmor: 0,
            finisherMultiplier: 1,
            maxStagger: 300,
            staggerNodeCount: 1,
            staggerNodeDuration: 120,
            staggerBreakDuration: 600,
            executionRecovery: 100,
            resistance: {},
          },
          tracks: [
            {
              id: 'old-perlica',
              operatorInstanceId: 'op',
              initialGauge: 0,
              actions: [
                {
                  skillId: 'battleSkill',
                  sourceSkillKey: 'battleSkill',
                  type: 'battleSkill',
                  startTime: 623,
                  logicalStartTime: 623,
                },
              ],
            },
          ],
        },
      },
    ],
  };
}
it('produces a current reloadable document only after explicit skill mapping and validation', () => {
  const result = convertLegacyTimeline(fixture(), gameDataRepository, {
    operators: { 'old-perlica': 'perlica' },
    skills: {
      'old-perlica': [
        {
          source: { skillId: 'battleSkill', sourceSkillKey: 'battleSkill', type: 'battleSkill' },
          target: { kind: 'operatorSkill', skillGroupKey: 'battleSkill', skillKey: 'battleSkill' },
        },
      ],
    },
  });
  expect(result.report.issues).toEqual([]);
  expect(result.status).toBe('converted');
  expect(result.project?.scenarios[0]?.tracks[0]?.skillCasts[0]?.placement.startFrame).toBe(162);
  expect(parseProjectDocument(JSON.stringify(result.project), { gameDataRepository }).ok).toBe(
    true,
  );
});
it('does not publish a project after missing mapping', () => {
  const result = convertLegacyTimeline(fixture(), gameDataRepository);
  expect(result.status).toBe('blocked');
  expect(result.project).toBeNull();
  expect(result.report.unresolvedSkills).toHaveLength(1);
});

it('preserves the active scenario and falls back only for an invalid reference', () => {
  const first = fixture();
  const second = structuredClone(first.scenarioList[0]!);
  second.id = 'second-axis';
  const input = {
    ...first,
    scenarioList: [...first.scenarioList, second],
    activeScenarioId: second.id,
  };
  const mappings = {
    operators: { 'old-perlica': 'perlica' },
    skills: {
      'old-perlica': [
        {
          source: { skillId: 'battleSkill', sourceSkillKey: 'battleSkill', type: 'battleSkill' },
          target: {
            kind: 'operatorSkill' as const,
            skillGroupKey: 'battleSkill',
            skillKey: 'battleSkill',
          },
        },
      ],
    },
  };
  const converted = convertLegacyTimeline(input, gameDataRepository, mappings);
  expect(converted.report.issues).toEqual([]);
  expect(converted.project?.activeScenarioId).toBe(second.id);
  input.activeScenarioId = 'missing';
  expect(convertLegacyTimeline(input, gameDataRepository, mappings).project?.activeScenarioId).toBe(
    first.scenarioList[0]!.id,
  );
});

it('preserves enemy identity, rank and saved combat overrides, and rejects unresolved identities', () => {
  const input = fixture();
  const data = input.scenarioList[0]!.data;
  data.tracks = [];
  Object.assign(data, { activeEnemyId: 'eny_0071_sandb', activeEnemyLevel: 90 });
  const blocked = convertLegacyTimeline(input, gameDataRepository);
  expect(blocked.project).toBeNull();
  expect(blocked.report.issues.some(issue => issue.message.includes('enemy'))).toBe(true);
  const mapped = convertLegacyTimeline(input, gameDataRepository, {
    enemies: { eny_0071_sandb: 'eny-0071-sandb' },
  });
  expect(mapped.report.issues).toEqual([]);
  expect(mapped.project?.scenarios[0]?.enemy).toMatchObject({
    source: { kind: 'prefab', enemyId: 'eny-0071-sandb', level: 90 },
    rank: 'elite',
    editable: { hp: 100000, defense: 100, superArmor: 0, finisherMultiplier: 1 },
  });
});
