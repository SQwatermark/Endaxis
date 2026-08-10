import { describe, expect, it } from 'vitest';
import type { CombatBuffSpellBurstDefinition } from '../buffs/combatBuffCatalog';
import type { PlayerDamageDefenderSnapshot } from '../damage/playerActiveDamageInput';
import {
  createSkillSettingSource,
  type SkillSettingCatalogDocument,
} from '../infliction/skillSettingCatalog';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { CombatVitals } from './combatVitals';
import { executeSpellBurst, resolveSpellBurstEnhanceFactor } from './spellBurstRuntime';

const definition: CombatBuffSpellBurstDefinition = {
  burstType: 'Pulse',
  damageType: 'electric',
  skillSettingDataKey: '法术爆发伤害倍率',
  skillSettingColumn: 1,
  atkScaleBase: 50,
};

function settings(): SkillSettingCatalogDocument {
  return {
    schemaVersion: 1,
    revision: 'test',
    data: [
      { key: '法术爆发伤害倍率', values: [1.5, 2, 2.5, 3], enhanceFormulaKey: 'linear' },
      { key: '无增强倍率', values: [2, 3], enhanceFormulaKey: '' },
    ],
    enhanceFormulas: [{ key: 'linear', kind: 'linear', paramA: 0.5 }],
  };
}

function defender(): PlayerDamageDefenderSnapshot {
  return {
    defense: 0,
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
  };
}

function createVitals() {
  return new CombatVitals({
    health: 10000,
    maxHealth: 10000,
    maxPoise: 0,
    poise: 0,
    poiseRecoveryTime: 0,
    poiseRecoveryTimeMultiplier: 1,
    poiseBrokenEndTime: 0,
    poiseImmune: false,
  });
}

describe('resolveSpellBurstEnhanceFactor', () => {
  it('按线性与饱和公式计算增强倍率，无公式退化为 1', () => {
    const source = createSkillSettingSource(settings());
    expect(resolveSpellBurstEnhanceFactor(source, 'linear', 0)).toBe(1);
    expect(resolveSpellBurstEnhanceFactor(source, 'linear', 2)).toBe(2);
    expect(resolveSpellBurstEnhanceFactor(source, 'missing', 3)).toBe(1);
    expect(resolveSpellBurstEnhanceFactor(source, '', 3)).toBe(1);
  });
});

describe('executeSpellBurst', () => {
  it('按 SkillSetting 倍率与增强公式造成标准伤害', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const target = createVitals();

    const result = executeSpellBurst({
      definition,
      sourceId: 'perlica',
      attack: 1000,
      enhance: 0,
      criticalRate: 0,
      criticalDamageIncrease: 0,
      criticalSample: 1,
      settings: createSkillSettingSource(settings()),
      defender: defender(),
      target,
      clock,
      receipt,
      emitSourceEvent: () => undefined,
      emitTargetEvent: () => undefined,
    });

    // 倍率 1.5 × 增强 1 = 1.5，伤害 = 1000 × 1.5。
    expect(result).toMatchObject({
      burstType: 'Pulse',
      skillScale: 1.5,
      enhanceFactor: 1,
      value: 1500,
    });
    expect(target.health).toBe(8500);
    expect(receipt.entries.at(-1)).toMatchObject({
      event: 'SpellBurstApplied',
      data: { burstType: 'Pulse', value: 1500, remainingHealth: 8500 },
    });
    expect(receipt.entries.some(entry => entry.event === 'DamageApplied')).toBe(true);
  });

  it('来源附着增强属性按公式放大倍率', () => {
    const target = createVitals();
    const result = executeSpellBurst({
      definition,
      sourceId: 'perlica',
      attack: 1000,
      enhance: 2,
      criticalRate: 0,
      criticalDamageIncrease: 0,
      criticalSample: 1,
      settings: createSkillSettingSource(settings()),
      defender: defender(),
      target,
      clock: new CombatClock(),
      receipt: new CombatReceiptCollector(),
      emitSourceEvent: () => undefined,
      emitTargetEvent: () => undefined,
    });
    // 线性公式：0.5 × 2 + 1 = 2，倍率 1.5 × 2 = 3。
    expect(result).toMatchObject({ enhanceFactor: 2, value: 3000 });
  });

  it('SkillSetting 缺少倍率数据时严格失败', () => {
    const missing: SkillSettingCatalogDocument = {
      schemaVersion: 1,
      revision: 'test',
      data: [],
      enhanceFormulas: [],
    };
    expect(() =>
      executeSpellBurst({
        definition,
        sourceId: 'perlica',
        attack: 1000,
        enhance: 0,
        criticalRate: 0,
        criticalDamageIncrease: 0,
        criticalSample: 1,
        settings: createSkillSettingSource(missing),
        defender: defender(),
        target: createVitals(),
        clock: new CombatClock(),
        receipt: new CombatReceiptCollector(),
        emitSourceEvent: () => undefined,
        emitTargetEvent: () => undefined,
      }),
    ).toThrow("requires SkillSetting '法术爆发伤害倍率'");
  });
});
