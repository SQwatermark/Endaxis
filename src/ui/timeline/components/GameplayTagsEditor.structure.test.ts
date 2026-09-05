import { describe, expect, it } from 'vitest';
import buffEditorSource from './BuffStepEditor.vue?raw';
import buffManagementSource from './BuffManagementStepEditor.vue?raw';
import conditionSource from './CombatConditionEditor.vue?raw';
import tagEditorSource from './GameplayTagsEditor.vue?raw';
import healSource from './HealStepEditor.vue?raw';
import resourceSource from './ResourceStepEditor.vue?raw';

describe('GameplayTagsEditor structure', () => {
  it('offers the versioned path catalog without numeric identities', () => {
    expect(tagEditorSource).toContain('GAMEPLAY_TAG_PATHS');
    expect(tagEditorSource).toContain('parseGameplayTagReference');
    expect(tagEditorSource).toContain('<datalist :id="datalistId">');
    expect(tagEditorSource).not.toContain('<code>');
    expect(tagEditorSource).toContain('tags: readonly string[]');
  });

  it('replaces every editable raw GameplayTag number list', () => {
    for (const source of [buffManagementSource, conditionSource, healSource, resourceSource]) {
      expect(source).toContain('GameplayTagsEditor');
    }
    expect(conditionSource).toContain("condition.kind === 'eventBuffTagsMatch'");
    expect(buffEditorSource).toContain("setDefinitionTags('applyTags', $event)");
    expect(buffEditorSource).toContain("setDefinitionTags('extendTags', $event)");
  });
});
