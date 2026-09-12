import { describe, expect, it } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
import source from './TimelineActionInspector.vue?raw';

describe('TimelineActionInspector current-layer editing', () => {
  it('edits instance placement and presentation instead of showing read-only duplicates', () => {
    expect(source).toContain("emit('setStartFrame', frame)");
    expect(source).toContain("$emit('setLocked'");
    expect(source).toContain("$emit('setDisabled'");
    expect(source).toContain("$emit('setColor'");
    expect(source).toContain('type="color"');
  });

  it('routes every edit through the timeline command boundary', () => {
    expect(editorSource).toContain("commitScenario('moveSkillCast'");
    expect(editorSource).toContain("commitScenario('setSkillCastLocked'");
    expect(editorSource).toContain("commitScenario('setSkillCastDisabled'");
    expect(editorSource).toContain("commitScenario('setSkillCastColor'");
    expect(editorSource).toContain("commitScenario('setSkillCastCustomBars'");
    expect(editorSource).toContain("commitScenario('updateTimelineConnection'");
  });

  it('restores instance custom bars and connection management without duplicating skill logic', () => {
    expect(source).toContain("t('propertiesPanel.bars.title')");
    expect(source).toContain("'setCustomBars',");
    expect(source).toContain("t('propertiesPanel.connections.title')");
    expect(source).toContain('timeline.inspector.labels.customBarOffsetFrames');
    expect(source).toContain('timeline.inspector.labels.customBarDurationFrames');
    expect(source).not.toContain("t('propertiesPanel.bars.offsetS')");
    expect(source).not.toContain("t('propertiesPanel.bars.durationS')");
    expect(source).toContain("$emit('removeConnection'");
    expect(source).toContain("$emit('updateConnection'");
    expect(source).not.toContain('timelineBlockFrames');
    expect(source).not.toContain('scheduledSequences');
  });

  it('keeps immutable source identities read-only and definition editing separate', () => {
    expect(source).toContain('{{ cast.id }}');
    expect(source).toContain('sourceKindLabel(cast.source.kind)');
    expect(source).toContain('skillTypeLabel(skillType)');
    expect(source).toContain('connectionPortLabel(port)');
    expect(source).toContain("$emit('editDefinition')");
  });

  it('uses an existing localized clear label instead of leaking an untranslated key', () => {
    expect(source).toContain("t('battleLog.ui.clear')");
    expect(source).not.toContain("t('common.clear')");
  });

  it('keeps the cast seed input, reroll button, and clear button on one row', () => {
    const seedRow = source.slice(
      source.indexOf('<div class="random-seed-row">'),
      source.indexOf('<small class="field-help">{{ t(\'timeline.random.castSeedHelp\') }}'),
    );
    expect(seedRow).toContain('<EaNumberInput');
    expect(seedRow).toContain('<EaDiceIcon />');
    expect(seedRow).toContain("$emit('setRandomSeed', null)");
    expect(source).toMatch(
      /\.random-seed-row\s*\{[^}]*display:\s*flex;[^}]*align-items:\s*center;/s,
    );
  });
});
