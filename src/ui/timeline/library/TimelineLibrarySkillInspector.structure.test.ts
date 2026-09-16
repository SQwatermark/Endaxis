import { describe, expect, it } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
import source from './TimelineLibrarySkillInspector.vue?raw';

describe('TimelineLibrarySkillInspector', () => {
  it('presents source facts without turning library grouping into simulation input', () => {
    expect(source).toContain('timeline.libraryInspector.operator');
    expect(source).toContain('timeline.inspector.labels.sourceKind');
    expect(source).toContain('timeline.inspector.labels.skillType');
    expect(source).toContain('timeline.libraryInspector.skillGroupId');
    expect(source).toContain('timeline.libraryInspector.level');
    expect(source).toContain('timeline.libraryInspector.durationFrames');
    expect(source).not.toContain('playerAction');
    expect(source).not.toContain('nativeSkillType');
  });

  it('shows the complete ordered chain and delegates definition editing to the operator workspace', () => {
    expect(source).toContain('timeline.libraryInspector.skillChain');
    expect(source).toContain('v-for="(segment, index) in segments"');
    expect(source).toContain("$emit('editOperatorDefinition')");
    expect(editorSource).toContain('@edit-operator-definition="openOperatorDefinitionWorkspace"');
  });

  it('is mutually exclusive with a selected timeline action', () => {
    expect(editorSource).toContain(
      "tool === 'inspector' && selectedLibraryEntry === null && selectedConsumableUse === null",
    );
    expect(editorSource).toContain(
      'if (selection.primaryId !== null) selectedLibrarySkill.value = null;',
    );
    expect(editorSource).toMatch(
      /function clearTimelineSelection\(\): void \{\s+selectedLibrarySkill\.value = null;/,
    );
  });
});
