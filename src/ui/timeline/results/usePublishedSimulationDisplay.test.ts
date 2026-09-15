import { effectScope, shallowRef } from 'vue';
import { expect, it, vi } from 'vitest';
import { createEmptyScenario } from '../../../core/project/createProject';
import { CombatReceiptCollector } from '../../../core/combat/receipt/combatReceipt';
import type { PublishedScenarioSimulation } from '../useScenarioSimulation';
import { usePublishedSimulationDisplay } from './usePublishedSimulationDisplay';

it('captures on publication, shares history and clears all display sources synchronously', () => {
  const published = shallowRef<PublishedScenarioSimulation | null>(null);
  const weapon = { slug: 'weapon', displayName: 'original' };
  const getWeapons = vi.fn(() => [weapon]);
  const scope = effectScope();
  const display = scope.run(() =>
    usePublishedSimulationDisplay(published, { getOperator: () => null }, getWeapons, {
      skill: () => '',
      operator: () => '',
    }),
  )!;
  try {
    const receiptHistory = new CombatReceiptCollector().history.snapshot();
    published.value = {
      scenario: createEmptyScenario('test', 'test'),
      run: { receiptHistory } as unknown as PublishedScenarioSimulation['run'],
    };
    expect(display.battleLogSnapshot.value?.history).toBe(receiptHistory);
    expect(display.publishedReceiptEntries.value).toBe(receiptHistory.toArray());
    weapon.displayName = 'edited';
    expect(display.publishedWeaponSources.value.get('weapon')).toMatchObject({ name: 'original' });
    expect(getWeapons).toHaveBeenCalledTimes(1);
    published.value = null;
    expect(display.battleLogSnapshot.value).toBeNull();
    expect(display.publishedOperators.value.size).toBe(0);
    expect(display.publishedWeaponSources.value.size).toBe(0);
    expect(display.publishedReceiptEntries.value).toEqual([]);
  } finally {
    scope.stop();
  }
});
