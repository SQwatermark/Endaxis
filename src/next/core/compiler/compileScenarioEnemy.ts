/**
 * 将项目持久化的敌人实例编译为战斗运行时使用的稳定输入。
 *
 * 这里只规整已有字段，不重新查询定义默认值，也不把多节点失衡规则近似成现有单节点生命账本。
 * 操作执行器应从该结果读取防御、抗性和处决倍率，后续失衡运行时也必须消费同一份原始规则。
 */
import type { PlayerDamageDefenderSnapshot } from '../combat/damage/playerActiveDamageInput';
import type { CombatEnemyProgram } from '../combat/runtime/combatRuntimeAssembly';
import type { EnemyDocument } from '../project/schema';

const RESISTIBLE_DAMAGE_TYPES = [
  'physical',
  'heat',
  'electric',
  'cryo',
  'nature',
  'ether',
] as const;

function requireFinite(value: number, path: string): number {
  if (!Number.isFinite(value)) throw new TypeError(`${path} must be a finite number`);
  return value;
}

function requireNonNegative(value: number, path: string): number {
  requireFinite(value, path);
  if (value < 0) throw new RangeError(`${path} must be non-negative`);
  return value;
}

function requireNonNegativeInteger(value: number, path: string): number {
  requireNonNegative(value, path);
  if (!Number.isInteger(value)) throw new RangeError(`${path} must be an integer`);
  return value;
}

function compileDefenderAttributes(enemy: EnemyDocument): PlayerDamageDefenderSnapshot {
  const knownTypes = new Set<string>(RESISTIBLE_DAMAGE_TYPES);
  for (const type of Object.keys(enemy.editable.resistances)) {
    if (!knownTypes.has(type)) throw new Error(`enemy resistance '${type}' is not supported`);
  }

  return {
    defense: requireNonNegative(enemy.editable.defense, 'enemy.editable.defense'),
    shelterDamageMultiplier: 0,
    breakingAttackDamageTakenMultiplier: requireNonNegative(
      enemy.editable.finisherMultiplier,
      'enemy.editable.finisherMultiplier',
    ),
    resistances: Object.fromEntries(
      RESISTIBLE_DAMAGE_TYPES.map(type => [
        type,
        {
          percent: requireFinite(
            enemy.editable.resistances[type] ?? 0,
            `enemy.editable.resistances.${type}`,
          ),
          damageTakenMultiplier: 1,
        },
      ]),
    ) as PlayerDamageDefenderSnapshot['resistances'],
  };
}

/** 编译单敌人场景中的完整静态敌人程序。 */
export function compileScenarioEnemy(enemy: EnemyDocument): CombatEnemyProgram {
  const source =
    enemy.source.kind === 'prefab'
      ? {
          kind: 'prefab' as const,
          enemyId: enemy.source.enemyId,
          level: requireNonNegativeInteger(enemy.source.level, 'enemy.source.level'),
        }
      : {
          kind: 'custom' as const,
          level: requireNonNegativeInteger(enemy.source.level, 'enemy.source.level'),
        };
  if (source.level === 0) throw new RangeError('enemy.source.level must be positive');

  return {
    source,
    health: requireNonNegative(enemy.editable.hp, 'enemy.editable.hp'),
    superArmor: requireNonNegative(enemy.editable.superArmor, 'enemy.editable.superArmor'),
    defenderAttributes: compileDefenderAttributes(enemy),
    stagger: {
      maximum: requireNonNegative(enemy.editable.stagger.maximum, 'enemy.editable.stagger.maximum'),
      nodeCount: requireNonNegativeInteger(
        enemy.editable.stagger.nodeCount,
        'enemy.editable.stagger.nodeCount',
      ),
      nodeDurationFrames: requireNonNegativeInteger(
        enemy.editable.stagger.nodeDurationFrames,
        'enemy.editable.stagger.nodeDurationFrames',
      ),
      brokenDurationFrames: requireNonNegativeInteger(
        enemy.editable.stagger.brokenDurationFrames,
        'enemy.editable.stagger.brokenDurationFrames',
      ),
      finisherRecovery: requireNonNegative(
        enemy.editable.stagger.finisherRecovery,
        'enemy.editable.stagger.finisherRecovery',
      ),
    },
  };
}
