import { describe, expect, it } from 'vitest';
import buffEditorSource from './BuffStepEditor.vue?raw';
import buffManagementSource from './BuffManagementStepEditor.vue?raw';
import conditionSource from './CombatConditionEditor.vue?raw';
import tagEditorSource from './GameplayTagIdsEditor.vue?raw';
import healSource from './HealStepEditor.vue?raw';
import resourceSource from './ResourceStepEditor.vue?raw';

describe('GameplayTagIdsEditor structure', () => {
  it('offers the versioned path catalog while preserving signed ids', () => {
    expect(tagEditorSource).toContain('GAMEPLAY_TAG_DEFINITIONS');
    expect(tagEditorSource).toContain('parseGameplayTagReference');
    expect(tagEditorSource).toContain('<datalist :id="datalistId">');
    expect(tagEditorSource).toContain('<code>{{ id }}</code>');
  });

  it('replaces every editable raw GameplayTag number list', () => {
    for (const source of [buffManagementSource, conditionSource, healSource, resourceSource]) {
      expect(source).toContain('GameplayTagIdsEditor');
    }
    expect(conditionSource).toContain("condition.kind === 'eventBuffTagsMatch'");
    expect(buffEditorSource).toContain("setDefinitionTagIds('applyTagIds', $event)");
    expect(buffEditorSource).toContain("setDefinitionTagIds('extendTagIds', $event)");
  });
});
