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

  it('renders reaction applications as duration segments instead of duplicate point markers', () => {
    expect(enemyEffectsSource).toContain("segment.kind === 'attachment'");
    expect(enemyEffectsSource).toContain('REACTION_ICONS[identity]');
    expect(enemyEffectsSource).toContain("marker.kind !== 'reactionApplied'");
    expect(enemyEffectsSource).toContain('segment.barWidthPx');
  });
});
