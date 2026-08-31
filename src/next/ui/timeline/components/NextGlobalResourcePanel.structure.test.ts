import { describe, expect, it } from 'vitest';
import editorSource from '../NextTimelineEditor.vue?raw';
import source from './NextGlobalResourcePanel.vue?raw';

describe('Next global configuration editor', () => {
  it('restores the six legacy global stat choices with explicit percentage conversion', () => {
    for (const modifier of [
      'skillCooldownReduction',
      'ultimateEnergyGainEfficiency',
      'artsIntensity',
      'attackPercent',
      'criticalRate',
      'criticalDamage',
    ]) {
      expect(source).toContain(`modifier: '${modifier}'`);
    }
    expect(source).toContain('displayValue / 100');
    expect(source).toContain("skillType: 'comboSkill'");
  });

  it('routes complete modifier lists through one undoable scenario command', () => {
    expect(source).toContain("emit('setModifiers'");
    expect(editorSource).toContain("commitScenario('setGlobalOperatorStatModifiers'");
    expect(editorSource).toContain('setGlobalOperatorStatModifiers(current, modifiers)');
  });
});
