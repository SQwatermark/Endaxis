import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import actionSequenceSource from './actions/ActionSequenceGraphEditor.vue?raw';
import equipmentContributionSource from './equipment/EquipmentContributionGraphEditor.vue?raw';
import gearSource from './equipment/GearDefinitionWorkspaceDialog.vue?raw';
import gearSetSource from './equipment/GearSetDefinitionWorkspaceDialog.vue?raw';
import operatorSource from './operators/OperatorDefinitionWorkspaceDialog.vue?raw';
import skillEditorSource from './skills/SkillDefinitionEditor.vue?raw';
import skillSource from './skills/SkillDefinitionEditorDialog.vue?raw';
import weaponSource from './equipment/WeaponDefinitionWorkspaceDialog.vue?raw';

const graphLayoutSource = readFileSync(
  new URL('./definitionGraphViewport.css', import.meta.url),
  'utf8',
);
const workspaceLayoutSource = readFileSync(
  new URL('./definitionWorkspaceLayout.css', import.meta.url),
  'utf8',
);

const ROOT_WORKSPACES = [operatorSource, weaponSource, gearSource, gearSetSource, skillSource];

describe('definition workspace layout contract', () => {
  it('gives every root definition editor the same near-fullscreen workspace', () => {
    for (const source of ROOT_WORKSPACES) {
      expect(source).toContain('width="min(1600px, calc(100vw - 32px))"');
      expect(source).toContain('top="16px"');
      expect(source).toContain('definition-workspace-dialog');
    }
    expect(workspaceLayoutSource).toContain('height: calc(100dvh - 32px)');
  });

  it('bounds inspectors instead of taking a percentage from growing canvases', () => {
    expect(workspaceLayoutSource).toContain(
      '--definition-inspector-width: clamp(320px, 25vw, 420px)',
    );
    for (const source of [
      actionSequenceSource,
      equipmentContributionSource,
      skillEditorSource,
      graphLayoutSource,
    ]) {
      expect(source).toContain('var(--definition-inspector-width');
      expect(source).not.toMatch(/minmax\([^\n]+, (?:34|40|42)%\)/);
    }
  });

  it('keeps root navigation and one save footer available on independent object pages', () => {
    expect(operatorSource).not.toContain('editingFocusedDefinition');
    expect(operatorSource).toContain('@click="selectSection(\'home\')"');
    expect(operatorSource.match(/class="workspace-footer"/g)).toHaveLength(1);
    expect(operatorSource).not.toContain('保存行为返回后');
  });
});
