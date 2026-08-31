import { describe, expect, it } from 'vitest';
import { nextGameDataRepository } from '../../data/gameDataRepository';
import { openProject } from '../openProject';
import { createLegacyProjectImporter } from './legacyProjectImporter';

function operator(id: string, operatorSlug: string) {
  return {
    id,
    operatorSlug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
    talentStates: { 0: 2, 1: 2 },
  };
}

function action(type: string, startTime: number, segmentIndex?: number) {
  return {
    id: `${type}-${startTime}`,
    type,
    sourceSkillKey: type,
    startTime,
    ...(segmentIndex === undefined ? {} : { segmentIndex }),
  };
}

describe('legacyProjectImporter', () => {
  it('保留旧版每次输入，但不把运行时换槽形态写进项目', () => {
    const legacy = {
      version: '1.0.0',
      scenarioList: [
        {
          id: 'legacy-scenario',
          name: '真实排轴迁移样本',
          data: {
            operators: [operator('rossi-instance', 'rossi'), operator('mifu-instance', 'mifu')],
            weapons: [],
            gears: [],
            tracks: [
              {
                id: 'rossi',
                operatorInstanceId: 'rossi-instance',
                initialGauge: 0,
                actions: [action('comboSkill', 100, 1), action('comboSkill', 160, 2)],
              },
              {
                id: 'mifu',
                operatorInstanceId: 'mifu-instance',
                initialGauge: 0,
                actions: [
                  action('battleSkill', 200, 1),
                  action('battleSkill', 240, 2),
                  action('battleSkill', 300, 3),
                ],
              },
            ],
            prepDuration: 300,
            prepExpanded: true,
            battleDuration: 3600,
            trackRowHeightWeights: [1, 1, 1, 1],
            initialGaugeMode: 'empty',
            customInitialGauges: {},
            systemConstants: {
              maxSp: 300,
              initialSp: 300,
              spRegenRate: 8,
              skillSpCostDefault: 100,
              maxStagger: 280,
              staggerNodeCount: 1,
              staggerNodeDuration: 120,
              staggerBreakDuration: 600,
              executionRecovery: 100,
              enemyHp: 100000,
              superArmor: 30,
              resistance: { physical: 0, heat: 0, cryo: 0, electric: 0, nature: 0 },
              finisherMultiplier: 1,
              def: 100,
            },
            activeEnemyLevel: 90,
            cycleBoundaries: [],
            switchEvents: [],
            connections: [],
          },
        },
      ],
    };

    const result = openProject(legacy, {
      gameDataRepository: nextGameDataRepository,
      legacyImporter: createLegacyProjectImporter(nextGameDataRepository),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const [rossi, mifu] = result.project.scenarios[0]!.tracks;
    expect(rossi?.skillCasts.map(cast => [cast.placement.startFrame, cast.source])).toEqual([
      [100, { kind: 'operatorSkill', skillGroupKey: 'comboSkill', skillKey: 'comboSkill2' }],
      [160, { kind: 'operatorSkill', skillGroupKey: 'comboSkill', skillKey: 'comboSkill2' }],
    ]);
    expect(mifu?.skillCasts.map(cast => [cast.placement.startFrame, cast.source])).toEqual([
      [200, { kind: 'operatorSkill', skillGroupKey: 'battleSkill', skillKey: 'battleSkill1' }],
      [240, { kind: 'operatorSkill', skillGroupKey: 'battleSkill', skillKey: 'battleSkill1' }],
      [300, { kind: 'operatorSkill', skillGroupKey: 'battleSkill', skillKey: 'battleSkill1' }],
    ]);
    expect(result.project.scenarios[0]!.enemy.editable.stagger.knotThresholds).toEqual([0.5]);
  });

  it('按旧动作段号选择基础技能链成员', () => {
    const importer = createLegacyProjectImporter(nextGameDataRepository);
    const migrated = importer.migrate({
      version: '1.0.0',
      scenarioList: [
        {
          id: 'basic-chain',
          data: {
            operators: [operator('arcane-instance', 'arcane')],
            tracks: [{
              id: 'arcane',
              operatorInstanceId: 'arcane-instance',
              actions: [action('basicAttack', 30, 1), action('basicAttack', 50, 5)],
            }],
          },
        },
      ],
    });

    expect(migrated.ok).toBe(true);
    if (!migrated.ok) return;
    expect(migrated.value.scenarios[0]!.tracks[0]?.skillCasts.map(cast => cast.source)).toEqual([
      { kind: 'operatorSkill', skillGroupKey: 'basicAttack', skillKey: 'basicAttack1' },
      { kind: 'operatorSkill', skillGroupKey: 'basicAttack', skillKey: 'basicAttack5' },
    ]);
  });
});
