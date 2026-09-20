import { describe, expect, it } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
import source from './GlobalResourcePanel.vue?raw';

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

  it('separates numeric edits from multi-select buffs without duplicate resource controls', () => {
    expect(source).toContain("mode?: 'modifiers' | 'presets'");
    expect(editorSource).toContain('mode="modifiers"');
    expect(editorSource).toContain('mode="presets"');
    expect(source).toContain('togglePreset(preset.id)');
    expect(source).toContain('enabled: !buff.enabled');
    expect(source).not.toContain('maxSp');
    expect(source).not.toContain('spRecoveryPerSecond');
  });
});
