import { describe, expect, it } from 'vitest';
import timelineEditorSource from '../NextTimelineEditor.vue?raw';
import buildDialogSource from './NextGearLoadoutBuildDialog.vue?raw';
import workspaceSource from './GearDefinitionWorkspaceDialog.vue?raw';

describe('GearDefinitionWorkspaceDialog structure', () => {
  it('materializes and switches a selected gear slot through the project library', () => {
    expect(timelineEditorSource).toContain('deriveProjectGearTemplate');
    expect(timelineEditorSource).toContain('switchTrackToCompatibleGearTemplate');
    expect(timelineEditorSource).toContain('replaceProjectGearTemplateDefinition');
    expect(timelineEditorSource).toContain('@edit-definition="openGearDefinitionWorkspace"');
    expect(buildDialogSource).toContain("'edit-definition': [slot: LoadoutGearSlot]");
  });

  it('keeps the inspector layer-local and validates without raw JSON editing', () => {
    expect(workspaceSource).toContain('validateGearDefinition');
    expect(workspaceSource).toContain("selectedSection = ref<'base' | number>('base')");
    expect(workspaceSource).toContain('baseDefense');
    expect(workspaceSource).toContain('gearSetSlug');
    expect(workspaceSource).not.toContain('<textarea');
  });

  it('uses materialized names and inherited assets for custom gear cards', () => {
    expect(buildDialogSource).toContain('definition.displayName');
    expect(buildDialogSource).toContain('definition.assetSlug ?? definition.slug');
    expect(buildDialogSource).toContain('编辑装备定义');
  });
});
