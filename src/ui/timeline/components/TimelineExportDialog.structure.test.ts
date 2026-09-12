import { describe, expect, it } from 'vitest';
import dialogSource from './TimelineExportDialog.vue?raw';
import smallSource from './TimelineSmallImageExportDialog.vue?raw';
import cardSource from './TimelineShareCard.vue?raw';
import exportSource from '../timelineExport.ts?raw';

describe('timeline export dialogs', () => {
  it('keeps the legacy export entry fields and action order', () => {
    expect(dialogSource).toContain('width="640px"');
    expect(dialogSource).toContain('Endaxis_Timeline_');
    const actions = ['exportJson', 'copyCode', 'exportSmallImage', 'exportImage'];
    for (let index = 1; index < actions.length; index += 1) {
      expect(dialogSource.indexOf(actions[index - 1]!)).toBeLessThan(
        dialogSource.indexOf(actions[index]!),
      );
    }
  });

  it('renders small-image preview and all legacy visual controls', () => {
    expect(smallSource).toContain('<TimelineShareCard');
    for (const field of [
      'showCombatIcons',
      'showDurationBars',
      'showKeycaps',
      'showPrep',
      'showTimeTicks',
    ]) {
      expect(smallSource).toContain(field);
    }
    expect(cardSource).toContain('timeline-share-card');
    expect(cardSource).toContain('grid-template-columns: 36px repeat(4, minmax(0, 1fr)) 76px');
    expect(cardSource).toContain('height: `${52 + timelineHeight}px`');
    expect(cardSource).toContain('top: `${top(action.startFrame)}px`');
    expect(smallSource).toContain('small-export__preview-inner');
  });

  it('exports both image paths as WebP and restores long-image layout', () => {
    expect(smallSource).toContain("type: 'webp'");
    expect(exportSource).toContain("type: 'webp'");
    expect(exportSource).not.toContain("type: 'png'");
    expect(exportSource).toContain('finally');
    expect(exportSource).toContain('element.style.cssText = cssText');
  });
});
