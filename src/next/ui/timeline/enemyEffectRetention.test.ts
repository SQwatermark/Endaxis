import { describe, expect, it } from 'vitest';
import source from './NextTimelineEditor.vue?raw';

describe('Next timeline enemy effect retention', () => {
  it('keeps the last successful enemy effect visualization while simulation is stale', () => {
    const start = source.indexOf('const enemyEffectViz = computed');
    const end = source.indexOf('\nfunction damageElementLabel', start);
    const projection = source.slice(start, end);

    expect(projection).toContain('if (current === null)');
    expect(projection).not.toContain('simulationStale.value');
    expect(projection).toContain('projectEnemyEffectViz(current.receiptEntries, current.frame)');
  });
});
