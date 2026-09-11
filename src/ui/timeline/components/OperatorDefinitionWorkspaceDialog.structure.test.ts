import { describe, expect, it } from 'vitest';
import workspaceSource from './OperatorDefinitionWorkspaceDialog.vue?raw';
import homeSource from './OperatorDefinitionHome.vue?raw';
import upgradeGraphSource from './OperatorUpgradeGraphPage.vue?raw';
import upgradePickerSource from './UpgradeModifierTypePicker.vue?raw';
import upgradeLabels from '../upgradeModifierLabels.ts?raw';
import runtimeBehaviorSource from './OperatorRuntimeBehaviorDialog.vue?raw';
import upgradeModifierSource from './OperatorUpgradeModifierEditor.vue?raw';
import upgradeBehaviorSource from './OperatorUpgradeBehaviorDialog.vue?raw';
import sequenceWorkspaceSource from './ActionSequenceWorkspace.vue?raw';
import comboDefinitionsSource from './OperatorComboDefinitionsDialog.vue?raw';
import skillEditorDialogSource from './SkillDefinitionEditorDialog.vue?raw';
import abilityEntityDefinitionsSource from './AbilityEntityDefinitionsDialog.vue?raw';

describe('OperatorDefinitionWorkspaceDialog structure', () => {
  it('distinguishes stable identities from editable authored identity fields', () => {
    expect(workspaceSource).toContain('项目内稳定引用身份');
    expect(workspaceSource).toContain('来源游戏数据身份');
    expect(workspaceSource).toContain("updateIdentity('displayName'");
    expect(workspaceSource).toContain("updateIdentity('assetSlug'");
    expect(workspaceSource).toContain("updateIdentity('weaponType'");
    expect(workspaceSource).toContain("updateIdentity('mainAttribute'");
    expect(workspaceSource).toContain("updateIdentity('secondaryAttribute'");
  });

  it('uses semantic panel labels instead of leaking attribute storage keys', () => {
    expect(workspaceSource).toContain("strength: '力量'");
    expect(workspaceSource).toContain("intellect: '智识'");
    expect(homeSource).toContain('{{ label }}');
    expect(homeSource).toContain("emit('growth', key, index, $event)");
  });

  it('supports explicit ordered skill-group and skill collection operations', () => {
    expect(workspaceSource).toContain('function duplicateGroup()');
    expect(workspaceSource).toContain('function removeGroup()');
    expect(workspaceSource).toContain('function moveGroup(offset: -1 | 1)');
    expect(workspaceSource).toContain('@update="replaceGroup(selectedGroupIndex, $event)"');
    expect(workspaceSource).not.toContain('function duplicateSkill()');
    expect(workspaceSource).not.toContain('function removeSkill()');
    expect(workspaceSource).not.toContain('function moveSkill(offset: -1 | 1)');
  });

  it('blocks saving invalid definitions and reports placed skill references before commit', () => {
    expect(workspaceSource).toContain('requiredSkillReferences');
    expect(workspaceSource).toContain("轴上技能块 '${reference.castId}' 仍引用");
    expect(workspaceSource).toContain(':disabled="!isDirty || draftIssues.length > 0"');
  });

  it('edits trust progression and separates character blackboard scopes', () => {
    expect(workspaceSource).toContain('DEFAULT_TRUST_ATTRIBUTE_BONUS');
    expect(workspaceSource).toContain('function updateTrustValue');
    expect(workspaceSource).not.toContain('function addUpgrade()');
    expect(workspaceSource).not.toContain('function moveUpgrade(offset: -1 | 1)');
    expect(homeSource).toContain('[0, 1, 2, 3, 4]');
    expect(upgradeGraphSource).toContain('模型适用性');
    expect(workspaceSource).toContain('与每次技能释放重置的技能黑板不同');
    expect(workspaceSource).toContain('function toggleEntityBlackboardEntryType');
  });

  it('edits build-resolved entity blackboard initializers with explicit comparison semantics', () => {
    expect(workspaceSource).toContain('<OperatorInitializationPage');
    expect(workspaceSource).toContain(':history="initializationHistory"');
    expect(workspaceSource).not.toContain('class="initializer-row"');
  });

  it('edits character-installed passive and event sequences outside timeline skills', () => {
    expect(workspaceSource).toContain('OperatorRuntimeGraphPage');
    expect(runtimeBehaviorSource).toContain('ActionSequenceWorkspace');
    expect(runtimeBehaviorSource).toContain(':shared-history="sequenceHistory"');
    expect(runtimeBehaviorSource).toContain('SkillBlackboardEditor');
    expect(runtimeBehaviorSource).toContain('这些行为随角色进入战斗安装');
    expect(runtimeBehaviorSource).toContain('角色创建时启用一次');
    expect(runtimeBehaviorSource).toContain('严格按列表顺序执行');
    expect(runtimeBehaviorSource).not.toContain('<textarea');
  });

  it('provides discriminated semantic forms for every supported upgrade modifier', () => {
    expect(upgradePickerSource).toContain('UPGRADE_MODIFIER_KINDS');
    expect(workspaceSource).toContain('function createUpgradeModifier(');
    expect(upgradeGraphSource).toContain('OperatorUpgradeModifierEditor');
    expect(upgradeLabels).toContain('条件伤害加算');
    expect(upgradeLabels).toContain('修改技能初始黑板');
    expect(upgradeLabels).toContain('基础面板修正');
    expect(upgradeLabels).toContain('反应效果强度加算');
    expect(upgradeModifierSource).toContain('1 表示不改变，1.15 表示乘以 115%');
    expect(upgradeModifierSource).not.toContain('<textarea');
  });

  it('separates upgrade initialization, event handlers and installed passive programs', () => {
    expect(workspaceSource).toContain('OperatorUpgradeGraphPage');
    expect(workspaceSource).not.toContain('编辑行为结构');
    expect(upgradeBehaviorSource).toContain('启用养成时执行一次');
    expect(upgradeBehaviorSource).toContain('事件条件命中后执行');
    expect(upgradeBehaviorSource).toContain('附属被动启用时执行');
    expect(upgradeBehaviorSource).toContain(
      '<option value="elementalAttachmentConsumed">元素附着被消耗</option>',
    );
    expect(upgradeBehaviorSource).toContain('获得技力');
    expect(upgradeBehaviorSource).toContain('消费 Buff');
    expect(upgradeBehaviorSource).toContain('SkillBlackboardEditor');
    expect(upgradeBehaviorSource).toContain('ActionSequenceWorkspace');
    expect(sequenceWorkspaceSource).toContain('ActionSequenceEditor');
    expect(sequenceWorkspaceSource).toContain('ActionSequenceGraphEditor');
    expect(sequenceWorkspaceSource.match(/:shared-history="history"/g)).toHaveLength(2);
    expect(upgradeBehaviorSource).not.toContain('<textarea');
  });

  it('keeps nested definition navigation in the same workspace instead of stacking dialogs', () => {
    expect(runtimeBehaviorSource).not.toContain('<el-dialog');
    expect(upgradeBehaviorSource).not.toContain('<el-dialog');
    expect(comboDefinitionsSource).not.toContain('<el-dialog');
    expect(abilityEntityDefinitionsSource).not.toContain('<el-dialog');
    expect(skillEditorDialogSource).toContain('v-if="embedded && visible');
    expect(workspaceSource).toContain('v-if="showSkillEditor && selectedSkill"');
    expect(workspaceSource).toContain(':shared-history="entityHistory"');
    expect(workspaceSource).not.toContain('showEntityEditor');
    expect(workspaceSource).toContain('v-else-if="showComboEditor"');
    expect(workspaceSource).toContain('v-else-if="showRuntimeBehaviorEditor"');
  });

  it('edits combo registrations separately from attachment event conditions', () => {
    expect(workspaceSource).toContain('OperatorComboGraphPage');
    expect(comboDefinitionsSource).toContain('角色原生连携条件');
    expect(comboDefinitionsSource).toContain('附着事件常驻条件');
    expect(comboDefinitionsSource).toContain('角色进入战斗时安装一次，不按技能块重复安装');
    expect(comboDefinitionsSource).toContain('监听事件');
    expect(comboDefinitionsSource).toContain('每次注册复制的字面黑板');
    expect(comboDefinitionsSource).not.toContain('<textarea');
  });
});
