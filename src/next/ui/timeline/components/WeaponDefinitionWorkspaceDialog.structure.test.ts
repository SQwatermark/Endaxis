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

  it('定义保存等待场景 watcher 标脏后只启动一份新模拟', () => {
    expect(timelineEditorSource).toContain('function refreshSimulationAfterDefinitionChange()');
    expect(timelineEditorSource).toContain('void nextTick(simulateNow)');
    expect(timelineEditorSource).toMatch(
      /function saveWeaponDefinition[\s\S]*?refreshSimulationAfterDefinitionChange\(\);[\s\S]*?function resetWeaponDefinition/,
    );
    expect(timelineEditorSource).toMatch(
      /function restoreEditorHistory[\s\S]*?refreshSimulationAfterDefinitionChange\(\);[\s\S]*?return true/,
    );
  });

  it('edits validated weapon layers without exposing raw JSON', () => {
    expect(workspaceSource).toContain('validateWeaponDefinition');
    expect(workspaceSource).toContain('baseAttackAtLevelNodes');
    expect(workspaceSource).toContain("selectedSection = ref<'base' | number>('base')");
    expect(workspaceSource).toContain("selectedSection === 'base'");
    expect(workspaceSource).not.toContain('<textarea');
  });

  it('edits presentation identity and closes the ordered trait collection workflow', () => {
    expect(workspaceSource).toContain("updateIdentity('assetSlug'");
    expect(workspaceSource).toContain("updateIdentity('iconPath'");
    expect(workspaceSource).toContain('function addTrait()');
    expect(workspaceSource).toContain('function removeTrait()');
    expect(workspaceSource).toContain('function moveTrait(offset: -1 | 1)');
    expect(workspaceSource).toContain('项目内稳定引用身份');
  });

  it('uses the materialized display identity and original text assets in the build dialog', () => {
    expect(buildDialogSource).toContain('definition.displayName');
    expect(buildDialogSource).toContain('definition.assetSlug');
    expect(buildDialogSource).toContain('getWeaponSkillDescription(weaponTextSlug.value');
  });
});
