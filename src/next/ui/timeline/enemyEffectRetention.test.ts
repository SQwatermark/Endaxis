import { describe, expect, it } from 'vitest';
import enemyEffectsSource from './components/TimelineEnemyEffects.vue?raw';
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

  it('uses native visible Buff instances as the sole duration-segment identity', () => {
    expect(enemyEffectsSource).toContain('props.buffs.map');
    expect(enemyEffectsSource).toContain('SPECIAL_BUFF_COLORS[buff.buffId]');
    expect(enemyEffectsSource).toContain('buff.instanceId');
    expect(enemyEffectsSource).not.toContain('props.viz.segments');
    expect(enemyEffectsSource).not.toContain("marker.kind !== 'reactionApplied'");
  });
});
