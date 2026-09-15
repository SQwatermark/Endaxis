import { describe, expect, it } from 'vitest';
import source from '../TimelineEditor.vue?raw';
import buffBandsSource from './TimelineBuffBands.vue?raw';
import enemyEffectsSource from './TimelineEnemyEffects.vue?raw';
import statusSegmentSource from './TimelineStatusSegment.vue?raw';

describe('Next timeline Buff visualization retention', () => {
  it('projects one receipt stream onto operator tracks and the enemy status row', () => {
    expect(source).toContain(
      'projectBuffTimelineViz(publishedReceiptEntries.value, current.frame)',
    );
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

  it('uses the shared status segment for icon, stack badge, hover, and duration stripes', () => {
    expect(buffBandsSource).toContain('TimelineStatusSegment');
    expect(buffBandsSource).toContain('interactive');
    expect(buffBandsSource).toContain(':count="item.layers"');
    expect(statusSegmentSource).toContain('timeline-status-segment__count');
    expect(statusSegmentSource).toContain(':role="interactive ? \'button\' : undefined"');
    expect(statusSegmentSource).toContain(
      '.timeline-status-segment.is-interactive .timeline-status-segment__icon',
    );
    expect(statusSegmentSource).toContain(
      '.timeline-status-segment.is-interactive .timeline-status-segment__duration',
    );
    expect(statusSegmentSource).toContain('transform: scale(1.18)');
    expect(enemyEffectsSource).toContain('anomaly-stacks');
    expect(statusSegmentSource).toContain('repeating-linear-gradient');
    expect(enemyEffectsSource).toContain('repeating-linear-gradient');
    expect(buffBandsSource).toContain('const ICON_SIZE = 18');
    expect(enemyEffectsSource).toContain('const ICON_SIZE = 20');
    expect(buffBandsSource).toMatch(/\.timeline-buff-bands\s*\{[^}]*z-index: 8;/s);
    expect(buffBandsSource).toContain('timelineUpperBuffTop(segment.lane)');
    expect(buffBandsSource).toContain('.timeline-buff-bands.is-upper');
    expect(buffBandsSource).toContain('.timeline-buff-bands.is-lower');
    expect(buffBandsSource).toContain('clip-path: inset');
  });

  it('lets published equipment sources replace Buff icons on every status axis', () => {
    expect(source.match(/:icon="buffIcon"/g)).toHaveLength(3);
    expect(buffBandsSource).toContain('props.icon?.(segment) ?? segment.iconPath');
    expect(buffBandsSource).toContain('props.icon?.(member) ?? member.iconPath');
    expect(enemyEffectsSource).toContain('props.icon?.(buff) ?? buff.iconPath');
    expect(enemyEffectsSource).toContain('props.icon?.(member) ?? member.iconPath');
  });
});
