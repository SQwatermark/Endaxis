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

  it('reuses the same Next modifier editor in the narrow left-bottom summary', () => {
    expect(source).toContain("mode?: 'full' | 'modifiers'");
    expect(source).toContain("props.mode !== 'modifiers'");
    expect(source).toContain('global-resource-panel--modifiers');
    expect(editorSource).toContain('mode="modifiers"');
    expect(editorSource).toContain("title: t('globalConfig.customSection')");
    expect(editorSource).not.toContain('<div v-else class="empty-panel">{{ tool }}</div>');
  });
});
