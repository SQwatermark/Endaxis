import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../project/createProject';
import { compileScenarioEnemy } from './compileScenarioEnemy';

describe('compileScenarioEnemy', () => {
  it('只从项目实例编译敌人运行时输入', () => {
    const scenario = createEmptyScenario('scenario:enemy', '敌人编译样本');
    scenario.enemy.source = { kind: 'catalog', enemyId: 'enemy:sample', level: 80 };
    scenario.enemy.editable = {
      hp: 123456,
      defense: 245,
      superArmor: 3,
      finisherMultiplier: 1.75,
      resistances: { physical: 10, heat: -5 },
      stagger: {
        maximum: 420,
        nodeCount: 2,
        nodeDurationFrames: 45,
        brokenDurationFrames: 270,
        finisherRecovery: 88,
      },
    };

    const result = compileScenarioEnemy(scenario.enemy);

    expect(result).toMatchObject({
      source: { kind: 'catalog', enemyId: 'enemy:sample', level: 80 },
      health: 123456,
      superArmor: 3,
      defenderAttributes: {
        defense: 245,
        shelterDamageMultiplier: 0,
        breakingAttackDamageTakenMultiplier: 1.75,
        resistances: {
          physical: { percent: 10, damageTakenMultiplier: 1 },
          heat: { percent: -5, damageTakenMultiplier: 1 },
          ether: { percent: 0, damageTakenMultiplier: 1 },
        },
      },
      stagger: {
        maximum: 420,
        nodeCount: 2,
        nodeDurationFrames: 45,
        brokenDurationFrames: 270,
        finisherRecovery: 88,
      },
    });
  });

  it('拒绝运行时无法解释的抗性身份', () => {
    const scenario = createEmptyScenario('scenario:enemy', '敌人编译样本');
    scenario.enemy.editable.resistances.unknown = 10;

    expect(() => compileScenarioEnemy(scenario.enemy)).toThrow(
      "enemy resistance 'unknown' is not supported",
    );
  });
});
