import { describe, expect, it } from 'vitest';
import source from './NextTimelineEditor.vue?raw';
import buffBandsSource from './components/TimelineBuffBands.vue?raw';
import enemyEffectsSource from './components/TimelineEnemyEffects.vue?raw';

describe('Next timeline Buff visualization retention', () => {
  it('projects one receipt stream onto operator tracks and the enemy status row', () => {
    expect(source).toContain('projectBuffTimelineViz(current.receiptEntries, current.frame)');
    expect(source).toContain(
      ':segments="buffSegmentsForTarget(track.operatorInstanceId, \'upper\')"',
    );
    expect(source).toContain(
      ':segments="buffSegmentsForTarget(track.operatorInstanceId, \'lower\')"',
    );
    expect(source).toContain('timelineViewLayers.upperEffects');
    expect(source).toContain('timelineViewLayers.lowerBuffs');
    expect(source).toContain(':buffs="buffSegmentsForTarget(\'enemy\')"');
    expect(source).toContain('projectTimelineTrackEffectLayout');
    expect(source).toMatch(
      /:action-top="\s*trackEffectLayout\(track\.trackIndex, track\.operatorInstanceId\)\.actionTop\s*"/,
    );
    expect(source).toContain("'--timeline-action-top'");
  });

  it('keeps the legacy icon, stack badge, and striped duration-bar layout', () => {
    expect(buffBandsSource).toContain('timeline-buff-stacks');
    expect(enemyEffectsSource).toContain('anomaly-stacks');
    expect(buffBandsSource).toContain('repeating-linear-gradient');
    expect(enemyEffectsSource).toContain('repeating-linear-gradient');
    expect(buffBandsSource).toContain('const ICON_SIZE = 18');
    expect(enemyEffectsSource).toContain('const ICON_SIZE = 20');
  });
});
