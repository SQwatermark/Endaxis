import { describe, expect, it } from 'vitest';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import type { CombatEnemyProgram } from './combatRuntimeAssembly';
import { createEnemyCombatVitals } from './combatVitalsFactory';

function enemy(overrides: Partial<CombatEnemyProgram> = {}): CombatEnemyProgram {
  return {
    source: { kind: 'custom', level: 90 },
    health: 10000,
    superArmor: 0,
    defenderAttributes: {
      defense: 100,
      shelterDamageMultiplier: 0,
      breakingAttackDamageTakenMultiplier: 1,
      resistances: {
        physical: { percent: 0, damageTakenMultiplier: 1 },
        heat: { percent: 0, damageTakenMultiplier: 1 },
        electric: { percent: 0, damageTakenMultiplier: 1 },
        cryo: { percent: 0, damageTakenMultiplier: 1 },
        nature: { percent: 0, damageTakenMultiplier: 1 },
        ether: { percent: 0, damageTakenMultiplier: 1 },
      },
    },
    stagger: {
      maximum: 300,
      nodeCount: 1,
      nodeDurationFrames: 60,
      brokenDurationFrames: 300,
      finisherRecovery: 100,
    },
    ...overrides,
  };
}

describe('createEnemyCombatVitals', () => {
  it('maps single-node stagger into a full-poise ledger seeded from enemy health', () => {
    const vitals = createEnemyCombatVitals(enemy());

    expect(vitals.health).toBe(10000);
    expect(vitals.maxHealth).toBe(10000);
    expect(vitals.maxPoise).toBe(300);
    expect(vitals.poise).toBe(300);
    expect(vitals.hasPoise).toBe(true);
  });

  it('leaves multi-node stagger without a poise ledger rather than approximating it', () => {
    const vitals = createEnemyCombatVitals(
      enemy({ stagger: { ...enemy().stagger, nodeCount: 2 } }),
    );

    expect(vitals.maxPoise).toBe(0);
    expect(vitals.poise).toBe(0);
    expect(vitals.hasPoise).toBe(false);
  });

  it('converts the broken-duration frames into recovery time on the combat clock', () => {
    const vitals = createEnemyCombatVitals(enemy());
    vitals.applyPoiseDelta(-300);
    vitals.beginPoiseBreakIfZero();
    // brokenDurationFrames=300 帧换算为 10 秒；推进超过该时长后失衡恢复为满值。
    vitals.tick(300 * COMBAT_FRAME_INTERVAL);
    expect(vitals.poise).toBe(300);
  });
});
