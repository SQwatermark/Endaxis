import { describe, expect, it } from 'vitest';
import editorSource from '../NextTimelineEditor.vue?raw';
import connectionSource from './TimelineConnectionLayer.vue?raw';
import headerSource from './TimelineHeaderToolbar.vue?raw';

describe('legacy per-operator effect visibility', () => {
  it('exposes occupied operators in the header view menu', () => {
    expect(headerSource).toContain('v-for="operator in operatorEffects"');
    expect(headerSource).toContain("$emit('toggleOperatorEffects', operator.trackIndex)");
    expect(editorSource).toContain(':operator-effects="operatorEffectsOptions"');
  });

  it('hides projected effect layers without hiding action blocks', () => {
    expect(editorSource).toMatch(
      /timelineViewLayers\.upperEffects\s*&&\s*isOperatorEffectsVisible\(track\.trackIndex\)/,
    );
    expect(editorSource).toContain(
      'timelineViewLayers.lowerBuffs && isOperatorEffectsVisible(track.trackIndex)',
    );
    expect(editorSource).toMatch(
      /timelineViewLayers\.skillDecorations\s*&&\s*isOperatorEffectsVisible\(track\.trackIndex\)/,
    );
    expect(editorSource).not.toContain(
      'v-if="isOperatorEffectsVisible(track.trackIndex)"\n              <TimelineActionBlock',
    );
  });

  it('removes links whose source or target track is hidden', () => {
    expect(editorSource).toContain(':visible-track-indices="visibleEffectTrackIndices"');
    expect(connectionSource).toContain(
      'if (!props.visibleTrackIndices.includes(trackIndex)) continue;',
    );
  });
});
