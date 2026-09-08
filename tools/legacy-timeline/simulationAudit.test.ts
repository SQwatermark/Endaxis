import { expect, it, vi } from 'vitest';
import { createEmptyScenario } from '../../src/core/project/createProject';
import type { CombatReceiptEntry } from '../../src/core/combat/receipt/combatReceipt';
import { auditScenarioSimulation } from './simulationAudit';

function hit(frame: number, damage: number): CombatReceiptEntry {
  return {
    sequence: frame,
    frame,
    time: frame / 30,
    event: 'DamageApplied',
    data: { expectedDamage: damage },
  };
}

it('分别计算存档结束线与完整时长，保留尾部无 castId 的伤害', async () => {
  const scenario = createEmptyScenario('audit', '审计');
  scenario.battle.durationFrames = 3600;
  scenario.battle.simulationRange = { endFrame: 2231 };
  const snapshot = structuredClone(scenario);
  const simulate = vi.fn(async (_scenario, endFrame) => ({
    receiptEntries: [hit(2218, 100), hit(2231, 20), hit(2237, 30)].filter(e => e.frame <= endFrame),
  }));
  const report = await auditScenarioSimulation({ simulate }, scenario);
  expect(simulate.mock.calls.map(call => call[1])).toEqual([2231, 3600]);
  expect(report.configured).toMatchObject({
    endFrame: 2231,
    damageRecordCount: 2,
    expectedDamage: 120,
  });
  expect(report.fullDuration).toMatchObject({
    endFrame: 3600,
    damageRecordCount: 3,
    expectedDamage: 150,
  });
  expect(report.damageAfterConfiguredEnd).toEqual([
    expect.objectContaining({ frame: 2237, expectedDamage: 30 }),
  ]);
  expect(scenario).toEqual(snapshot);
});

it('未设结束线时只执行一次，空轴伤害为零', async () => {
  const scenario = createEmptyScenario('empty', '空轴');
  delete scenario.battle.simulationRange;
  const simulate = vi.fn(async () => ({ receiptEntries: [] }));
  const report = await auditScenarioSimulation({ simulate }, scenario);
  expect(simulate).toHaveBeenCalledTimes(1);
  expect(report.configured).toEqual(report.fullDuration);
  expect(report.configured).toMatchObject({
    damageRecordCount: 0,
    expectedDamage: 0,
    lastDamageFrame: null,
  });
});

it('不把缺失期望伤害或非有限值静默计为零', async () => {
  const invalidData: CombatReceiptEntry['data'][] = [
    {},
    { expectedDamage: NaN },
    { expectedDamage: Infinity },
  ];
  for (const data of invalidData) {
    const scenario = createEmptyScenario('invalid', '无效回执');
    const simulate = async () => ({ receiptEntries: [{ ...hit(0, 1), data }] });
    await expect(auditScenarioSimulation({ simulate }, scenario)).rejects.toThrow(
      'finite expectedDamage',
    );
  }
});
