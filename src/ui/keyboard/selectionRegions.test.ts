import { describe, expect, it } from 'vitest';
import operator from '../timeline/library/OperatorSelectionDialog.vue?raw';
import gear from '../timeline/library/GearSelectionDialog.vue?raw';
import weapon from '../timeline/library/WeaponSelectionDialog.vue?raw';
import timeline from '../timeline/TimelineEditor.vue?raw';

describe('selection dialog region wiring', () => {
  it.each([operator, gear])('contains the entire dialog in a modal region', source => {
    const template = source.slice(source.indexOf('<template>'));
    expect(template.indexOf('<EaDialog')).toBeGreaterThanOrEqual(0);
    expect(template.indexOf('<InputRegionBoundary')).toBeLessThan(template.indexOf('<EaDialog'));
    expect(template.indexOf('</InputRegionBoundary>')).toBeGreaterThan(
      template.indexOf('</EaDialog>'),
    );
    expect(template).toMatch(/:active="visible" modal/);
  });
  it('assigns the weapon held preview to its own region without a global priority', () => {
    expect(weapon).toContain('const region = useKeyboardInputRegion(');
    expect(weapon).toContain('modal: true');
    expect(weapon).toMatch(/id: 'weapon-selection',\s+region,\s+priority: 0/);
    expect(weapon).toContain('observeKeyboardState:');
  });
  it('uses the name-only weapon search label', () => {
    expect(timeline).toContain(
      "searchPlaceholder: t('timelineGrid.weaponDialog.searchPlaceholder')",
    );
  });
});
