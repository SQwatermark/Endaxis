import { describe, expect, it } from 'vitest';
import dialogSource from './TimelineExportDialog.vue?raw';
import smallSource from './TimelineSmallImageExportDialog.vue?raw';
import cardSource from './TimelineShareCard.vue?raw';
import exportSource from '../timelineExport.ts?raw';

describe('timeline export dialogs', () => {
  it('matches the V2 export sections, scope choice and action order', () => {
    expect(dialogSource).toContain('width="680px"');
    expect(dialogSource).toContain('Endaxis_Timeline_');
    expect(dialogSource).toContain('export-section--data');
    expect(dialogSource).toContain('export-section--image');
    expect(dialogSource).toContain('role="radiogroup"');
    expect(dialogSource).toContain("scope = 'current'");
    expect(dialogSource).toContain("scope = 'all'");
    const actions = ['exportJson', 'copyCode', 'exportSmallImage', 'exportImage'];
    for (let index = 1; index < actions.length; index += 1) {
      expect(dialogSource.indexOf(actions[index - 1]!)).toBeLessThan(
        dialogSource.indexOf(actions[index]!),
      );
    }
    expect(dialogSource).not.toContain('EaDialogActions');
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
    expect(cardSource).toContain(
      'grid-template-columns: 36px repeat(4, minmax(0, 1fr)) var(--share-operation-width)',
    );
    expect(cardSource).toContain('height: `${52 + timelineHeight}px`');
    expect(cardSource).toContain('top: `${top(action.startFrame)}px`');
    expect(smallSource).toContain('small-export__preview-inner');
  });

  it('exports both image paths as PNG and restores long-image layout', () => {
    expect(smallSource).toContain("type: 'png'");
    expect(exportSource).toContain("type: 'png'");
    expect(exportSource).not.toContain("type: 'webp'");
    expect(exportSource).toContain('finally');
    expect(exportSource).toContain('element.style.cssText = cssText');
  });
});
