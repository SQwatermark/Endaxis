import { describe, expect, it } from 'vitest';
import timelineEditorSource from '../NextTimelineEditor.vue?raw';
import buildDialogSource from './NextGearLoadoutBuildDialog.vue?raw';
import workspaceSource from './GearDefinitionWorkspaceDialog.vue?raw';
import gearSetWorkspaceSource from './GearSetDefinitionWorkspaceDialog.vue?raw';
import contributionEditorSource from './EquipmentContributionGraphEditor.vue?raw';
import weaponWorkspaceSource from './WeaponDefinitionWorkspaceDialog.vue?raw';

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

  it('navigates explicitly from a saved gear draft into a project gear set template', () => {
    expect(workspaceSource).toContain("'edit-gear-set': [definition: GearDefinition]");
    expect(workspaceSource).toContain('进入套装模板前会先保存当前装备草稿');
    expect(timelineEditorSource).toContain('deriveProjectGearSetTemplate');
    expect(timelineEditorSource).toContain('replaceProjectGearSetTemplateDefinition');
    expect(timelineEditorSource).toContain('saveProjectGearBeforeEditingSet');
    expect(gearSetWorkspaceSource).toContain('validateGearSetDefinition');
    expect(gearSetWorkspaceSource).not.toContain('<textarea');
  });

  it('shares the same layer-local contribution graph across weapons, gear and sets', () => {
    for (const source of [workspaceSource, weaponWorkspaceSource, gearSetWorkspaceSource]) {
      expect(source).toContain('EquipmentContributionGraphEditor');
    }
    expect(contributionEditorSource).toContain('SkillStructureMindMap');
    expect(contributionEditorSource).toContain('CombatEventTriggerEditor');
    expect(contributionEditorSource).toContain('CombatStepEditor');
    expect(contributionEditorSource).toContain('inspector-only');
    expect(contributionEditorSource).not.toContain('<textarea');
  });
});
