import { describe, expect, it } from 'vitest';
import timelineEditorSource from '../NextTimelineEditor.vue?raw';
import buildDialogSource from './NextGearLoadoutBuildDialog.vue?raw';
import workspaceSource from './GearDefinitionWorkspaceDialog.vue?raw';
import gearSetWorkspaceSource from './GearSetDefinitionWorkspaceDialog.vue?raw';
import contributionEditorSource from './EquipmentContributionGraphEditor.vue?raw';
import contributionTypePickerSource from './EquipmentContributionTypePicker.vue?raw';
import eventTriggerEditorSource from './CombatEventTriggerEditor.vue?raw';
import conditionTypePickerSource from './CombatConditionTypePicker.vue?raw';
import conditionEditorSource from './CombatConditionEditor.vue?raw';
import weaponWorkspaceSource from './WeaponDefinitionWorkspaceDialog.vue?raw';
import equipmentBuffDialogSource from './EquipmentBuffDefinitionsDialog.vue?raw';

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

  it('edits presentation identity and closes the ordered trait collection workflow', () => {
    expect(workspaceSource).toContain("updateBase('assetSlug'");
    expect(workspaceSource).toContain("updateBase('iconPath'");
    expect(workspaceSource).toContain('function addTrait()');
    expect(workspaceSource).toContain('function removeTrait()');
    expect(workspaceSource).toContain('function moveTrait(offset: -1 | 1)');
    expect(workspaceSource).toContain('项目内稳定引用身份');
  });

  it('uses materialized names and inherited assets for custom gear cards', () => {
    expect(buildDialogSource).toContain('definition.displayName');
    expect(buildDialogSource).toContain('definition.assetSlug ?? definition.slug');
    expect(buildDialogSource).toContain('nextTimeline.customDefinition.editGear');
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
    expect(contributionEditorSource).toContain('@move-node="moveNode"');
    expect(contributionEditorSource).toContain('@node-action="nodeAction"');
    expect(contributionEditorSource).toContain('@history-action="restoreHistory"');
    expect(contributionEditorSource).toContain('@add-child="beginAdd"');
    expect(contributionEditorSource).toContain('StepTypePicker');
    expect(contributionEditorSource).toContain('@close="pendingAdd = null"');
    expect(contributionEditorSource).toContain('EquipmentContributionTypePicker');
    expect(contributionEditorSource).toContain(':clipboard-kind="clipboard?.kind"');
    expect(contributionEditorSource).toContain('duplicateSkillEditorDetachedStep');
    expect(contributionEditorSource).not.toContain('<textarea');
  });

  it('edits every top-level contribution field without a raw JSON escape hatch', () => {
    expect(contributionEditorSource).toContain('initializationBlackboardEntries');
    expect(contributionEditorSource).toContain('createInitializationSequence');
    expect(contributionEditorSource).toContain('EquipmentBuffDefinitionsDialog');
    expect(contributionEditorSource).toContain('不属于技能的初始黑板');
    expect(contributionEditorSource).toContain('每场战斗一次');
    expect(contributionEditorSource).not.toContain('<textarea');
    expect(equipmentBuffDialogSource).toContain('BuffDefinitionGraphEditor');
    expect(equipmentBuffDialogSource).toContain('collectReferences');
    expect(equipmentBuffDialogSource).not.toContain('<el-dialog');
    expect(equipmentBuffDialogSource).not.toContain('<textarea');
  });

  it('adds contribution structures through an explicit mouse-position type picker', () => {
    expect(contributionTypePickerSource).toContain('<Teleport to="body">');
    expect(contributionTypePickerSource).toContain('props.anchor.x');
    expect(contributionTypePickerSource).toContain('EQUIPMENT_PANEL_STATS');
    expect(contributionTypePickerSource).toContain('DAMAGE_TYPES');
    expect(contributionTypePickerSource).toContain('EDITABLE_COMBAT_EVENT_TRIGGER_KINDS');
    expect(eventTriggerEditorSource).toContain('createCombatEventTriggerDraft');
  });

  it('edits every modifier variant in the layer-local inspector', () => {
    expect(contributionEditorSource).toContain('modifierAttributes');
    expect(contributionEditorSource).toContain('setModifierOperation');
    expect(contributionEditorSource).toContain('EQUIPMENT_PANEL_STATS');
    expect(contributionEditorSource).toContain('toggleDamageType');
    expect(contributionEditorSource).toContain('toggleSkillType');
    expect(contributionEditorSource).toContain('clearSkillTypeFilter');
    expect(contributionEditorSource).not.toContain('v-for="(value, key) in selectedModifier"');
  });

  it('projects event conditions into the map and keeps their inspector layer-local', () => {
    expect(contributionEditorSource).toContain('CombatConditionTypePicker');
    expect(contributionEditorSource).toContain('appendCondition');
    expect(contributionEditorSource).toContain('deleteStructureValueAtPath');
    expect(contributionEditorSource).toContain('layer-only');
    expect(conditionTypePickerSource).toContain('COMBAT_CONDITION_KINDS');
    expect(conditionTypePickerSource).toContain('createCombatCondition');
    expect(conditionEditorSource).toContain('!layerOnly && condition.kind');
  });
});
