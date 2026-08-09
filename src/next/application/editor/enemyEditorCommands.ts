/**
 * 将敌人目录默认值转换为项目实例，并提供不可变的敌人覆盖命令。
 * 目录切换会重新捕获完整默认值；单项编辑只记录用户接管的字段，不修改目录定义。
 */
import { getEnemyHpAtLevel, type EnemyDefinition } from '../../core/game-data/enemyDefinition';
import type {
  EnemyDocument,
  EnemyEditableField,
  EnemyEditableValues,
  EnemyStaggerEditableValues,
  ScenarioDocument,
} from '../../core/project/schema';

export type EnemyBasicEditableField = Exclude<keyof EnemyEditableValues, 'resistances' | 'stagger'>;
export type EnemyStaggerEditableField = keyof EnemyStaggerEditableValues;

function addEditedField(
  edited: readonly EnemyEditableField[],
  field: EnemyEditableField,
): EnemyEditableField[] {
  return edited.includes(field) ? [...edited] : [...edited, field];
}

function secondsToFrames(seconds: number, fps: number): number {
  if (!Number.isInteger(fps) || fps <= 0) throw new Error('project FPS must be a positive integer');
  return Math.round(seconds * fps);
}

/** 从目录的明确等级节点创建一个没有用户覆盖的敌人实例。 */
export function createCatalogEnemyDocument(
  definition: EnemyDefinition,
  level: number,
  fps: number,
): EnemyDocument {
  const hp = getEnemyHpAtLevel(definition, level);
  if (hp === null) {
    throw new Error(`enemy '${definition.id}' has no HP value at level ${level}`);
  }
  return {
    source: { kind: 'catalog', enemyId: definition.id, level },
    editable: {
      hp,
      defense: definition.defense,
      superArmor: definition.superArmor,
      finisherMultiplier: definition.finisherMultiplier,
      resistances: { ...definition.resistances },
      stagger: {
        maximum: definition.stagger.maximum,
        nodeCount: definition.stagger.nodeCount,
        nodeDurationFrames: secondsToFrames(definition.stagger.nodeDurationSeconds, fps),
        brokenDurationFrames: secondsToFrames(definition.stagger.brokenDurationSeconds, fps),
        finisherRecovery: definition.stagger.finisherRecovery,
      },
    },
    edited: [],
  };
}

export function setScenarioEnemy(
  scenario: ScenarioDocument,
  enemy: EnemyDocument,
): ScenarioDocument {
  if (scenario.enemy === enemy) return scenario;
  return { ...scenario, enemy };
}

export function updateEnemyBasicField<K extends EnemyBasicEditableField>(
  scenario: ScenarioDocument,
  field: K,
  value: EnemyEditableValues[K],
): ScenarioDocument {
  if (scenario.enemy.editable[field] === value) return scenario;
  return {
    ...scenario,
    enemy: {
      ...scenario.enemy,
      editable: { ...scenario.enemy.editable, [field]: value },
      edited: addEditedField(scenario.enemy.edited, field),
    },
  };
}

export function updateEnemyResistance(
  scenario: ScenarioDocument,
  damageType: string,
  value: number,
): ScenarioDocument {
  if (scenario.enemy.editable.resistances[damageType] === value) return scenario;
  return {
    ...scenario,
    enemy: {
      ...scenario.enemy,
      editable: {
        ...scenario.enemy.editable,
        resistances: { ...scenario.enemy.editable.resistances, [damageType]: value },
      },
      edited: addEditedField(scenario.enemy.edited, 'resistances'),
    },
  };
}

export function updateEnemyStaggerField<K extends EnemyStaggerEditableField>(
  scenario: ScenarioDocument,
  field: K,
  value: EnemyStaggerEditableValues[K],
): ScenarioDocument {
  if (scenario.enemy.editable.stagger[field] === value) return scenario;
  const editedField = `stagger.${field}` as const;
  return {
    ...scenario,
    enemy: {
      ...scenario.enemy,
      editable: {
        ...scenario.enemy.editable,
        stagger: { ...scenario.enemy.editable.stagger, [field]: value },
      },
      edited: addEditedField(scenario.enemy.edited, editedField),
    },
  };
}
