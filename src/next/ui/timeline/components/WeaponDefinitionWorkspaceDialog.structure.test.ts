import { describe, expect, it } from 'vitest';
import timelineEditorSource from '../NextTimelineEditor.vue?raw';
import buildDialogSource from './NextWeaponBuildDialog.vue?raw';
import workspaceSource from './WeaponDefinitionWorkspaceDialog.vue?raw';

describe('WeaponDefinitionWorkspaceDialog structure', () => {
  it('derives a project template and atomically switches the equipped instance', () => {
    expect(timelineEditorSource).toContain('deriveProjectWeaponTemplate');
    expect(timelineEditorSource).toContain('switchTrackToCompatibleWeaponTemplate');
    expect(timelineEditorSource).toContain('replaceProjectWeaponTemplateDefinition');
    expect(timelineEditorSource).toContain('@edit-definition="openWeaponDefinitionWorkspace"');
    expect(timelineEditorSource).toContain('showWeaponDefinitionWorkspace.value ||');
    expect(buildDialogSource).toContain("'edit-definition': []");
  });

  it('edits validated weapon layers without exposing raw JSON', () => {
    expect(workspaceSource).toContain('validateWeaponDefinition');
    expect(workspaceSource).toContain('baseAttackAtLevelNodes');
    expect(workspaceSource).toContain("selectedSection = ref<'base' | number>('base')");
    expect(workspaceSource).toContain("selectedSection === 'base'");
    expect(workspaceSource).not.toContain('<textarea');
  });

  it('uses the materialized display identity and original text assets in the build dialog', () => {
    expect(buildDialogSource).toContain('definition.displayName');
    expect(buildDialogSource).toContain('definition.assetSlug');
    expect(buildDialogSource).toContain('getWeaponSkillDescription(weaponTextSlug.value');
  });
});
