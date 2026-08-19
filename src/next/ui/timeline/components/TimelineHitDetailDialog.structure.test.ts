import { describe, expect, it } from 'vitest';
import source from './TimelineHitDetailDialog.vue?raw';

describe('TimelineHitDetailDialog structure', () => {
  it('follows the legacy context-result-multiplier hierarchy using receipt facts', () => {
    expect(source).toContain('labels.dialogTitle');
    expect(source).toContain('labels.context');
    expect(source).toContain('labels.result');
    expect(source).toContain('labels.multipliers');
    expect(source).toContain('class="headline-damage"');
    expect(source).toContain("entry.event !== 'DamageApplied'");
    expect(source).toContain('data.actualDamage');
    expect(source).toContain('data.remainingHealth');
    expect(source).toContain('data.defenseMultiplier');
    expect(source).toContain('data.resistanceMultiplier');
  });

  it('keeps the legacy-sized modal and standard close interactions', () => {
    expect(source).toContain('role="dialog"');
    expect(source).toContain('@click.self="emit(\'close\')"');
    expect(source).toContain("event.key !== 'Escape'");
    expect(source).toContain('width: 420px');
  });
});
