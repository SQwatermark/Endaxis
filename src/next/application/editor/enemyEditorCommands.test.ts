import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { nextGameDataRepository } from '../../data/gameDataCatalog';
import {
  createCatalogEnemyDocument,
  setScenarioEnemy,
  updateEnemyBasicField,
  updateEnemyResistance,
  updateEnemyStaggerField,
} from './enemyEditorCommands';

describe('enemyEditorCommands', () => {
  it('把目录敌人的完整默认值捕获为项目实例', () => {
    const definition = nextGameDataRepository.getEnemy('eny-0125-fdcentur')!;

    const enemy = createCatalogEnemyDocument(definition, 90, 30);

    expect(enemy.source).toEqual({ kind: 'catalog', enemyId: definition.id, level: 90 });
    expect(enemy.editable).toMatchObject({
      hp: 2476341,
      defense: 100,
      superArmor: 30,
      finisherMultiplier: 1.75,
      stagger: {
        maximum: definition.stagger.maximum,
        nodeCount: definition.stagger.nodeCount,
        nodeDurationFrames: Math.round(definition.stagger.nodeDurationSeconds * 30),
        brokenDurationFrames: Math.round(definition.stagger.brokenDurationSeconds * 30),
      },
    });
    expect(enemy.edited).toEqual([]);
  });

  it('拒绝目录未提供的敌人等级，而不自行插值', () => {
    const definition = nextGameDataRepository.getEnemy('eny-0125-fdcentur')!;

    expect(() => createCatalogEnemyDocument(definition, 89, 30)).toThrow(
      `enemy '${definition.id}' has no HP value at level 89`,
    );
  });

  it('每类用户覆盖都记录明确的接管字段', () => {
    const definition = nextGameDataRepository.getEnemy('eny-0125-fdcentur')!;
    const initial = setScenarioEnemy(
      createEmptyScenario('scenario:enemy', '敌人场景'),
      createCatalogEnemyDocument(definition, 90, 30),
    );

    const updatedHp = updateEnemyBasicField(initial, 'hp', 1000);
    const updatedResistance = updateEnemyResistance(updatedHp, 'heat', 0.2);
    const updatedStagger = updateEnemyStaggerField(updatedResistance, 'maximum', 500);

    expect(updatedStagger.enemy.edited).toEqual(['hp', 'resistances', 'stagger.maximum']);
    expect(updatedStagger.enemy.editable.hp).toBe(1000);
    expect(updatedStagger.enemy.editable.resistances.heat).toBe(0.2);
    expect(updatedStagger.enemy.editable.stagger.maximum).toBe(500);
    expect(initial.enemy.edited).toEqual([]);
  });
});
