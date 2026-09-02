import { describe, expect, it } from 'vitest';
import workspaceSource from './OperatorDefinitionWorkspaceDialog.vue?raw';
import runtimeBehaviorSource from './OperatorRuntimeBehaviorDialog.vue?raw';
import upgradeModifierSource from './OperatorUpgradeModifierEditor.vue?raw';
import upgradeBehaviorSource from './OperatorUpgradeBehaviorDialog.vue?raw';
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
    expect(workspaceSource).toContain('{{ ATTRIBUTE_LABELS[key] }}');
  });

  it('supports explicit ordered skill-group and skill collection operations', () => {
    expect(workspaceSource).toContain('function duplicateGroup()');
    expect(workspaceSource).toContain('function removeGroup()');
    expect(workspaceSource).toContain('function moveGroup(offset: -1 | 1)');
    expect(workspaceSource).toContain('function duplicateSkill()');
    expect(workspaceSource).toContain('function removeSkill()');
    expect(workspaceSource).toContain('function moveSkill(offset: -1 | 1)');
  });

  it('edits trust progression and separates character blackboard scopes', () => {
    expect(workspaceSource).toContain('DEFAULT_TRUST_ATTRIBUTE_BONUS');
    expect(workspaceSource).toContain('function updateTrustValues');
    expect(workspaceSource).toContain('function addUpgrade()');
    expect(workspaceSource).toContain('function moveUpgrade(offset: -1 | 1)');
    expect(workspaceSource).toContain('固定模型下无可观察效果');
    expect(workspaceSource).toContain('与每次技能释放重置的技能黑板不同');
    expect(workspaceSource).toContain('function toggleEntityBlackboardEntryType');
  });

  it('edits build-resolved entity blackboard initializers with explicit comparison semantics', () => {
    expect(workspaceSource).toContain('function addEntityBlackboardInitializer()');
    expect(workspaceSource).toContain('function updateEntityBlackboardInitializer(');
    expect(workspaceSource).toContain('在创建技能实例前比较最终构筑四维');
    expect(workspaceSource).toContain('COMPARISON_OPERATORS');
  });

  it('edits character-installed passive and event sequences outside timeline skills', () => {
    expect(workspaceSource).toContain('OperatorRuntimeBehaviorDialog');
    expect(runtimeBehaviorSource).toContain('ActionSequenceEditor');
    expect(runtimeBehaviorSource).toContain('SkillBlackboardEditor');
    expect(runtimeBehaviorSource).toContain('这些行为随角色进入战斗安装');
    expect(runtimeBehaviorSource).toContain('角色创建时启用一次');
    expect(runtimeBehaviorSource).toContain('严格按列表顺序执行');
    expect(runtimeBehaviorSource).not.toContain('<textarea');
  });

  it('provides discriminated semantic forms for every supported upgrade modifier', () => {
    expect(workspaceSource).toContain('UPGRADE_MODIFIER_KINDS');
    expect(workspaceSource).toContain('function createUpgradeModifier(');
    expect(workspaceSource).toContain('OperatorUpgradeModifierEditor');
    expect(upgradeModifierSource).toContain('条件伤害加算');
    expect(upgradeModifierSource).toContain('修改技能初始黑板');
    expect(upgradeModifierSource).toContain('基础面板修正');
    expect(upgradeModifierSource).toContain('反应效果强度加算');
    expect(upgradeModifierSource).toContain('1 表示不改变，1.15 表示乘以 115%');
    expect(upgradeModifierSource).not.toContain('<textarea');
  });

  it('separates upgrade initialization, event handlers and installed passive programs', () => {
    expect(workspaceSource).toContain('OperatorUpgradeBehaviorDialog');
    expect(upgradeBehaviorSource).toContain('启用养成时执行一次');
    expect(upgradeBehaviorSource).toContain('事件条件命中后执行');
    expect(upgradeBehaviorSource).toContain('附属被动启用时执行');
    expect(upgradeBehaviorSource).toContain('元素反应生效');
    expect(upgradeBehaviorSource).toContain('获得技力');
    expect(upgradeBehaviorSource).toContain('消费 Buff');
    expect(upgradeBehaviorSource).toContain('SkillBlackboardEditor');
    expect(upgradeBehaviorSource).toContain('ActionSequenceEditor');
    expect(upgradeBehaviorSource).not.toContain('<textarea');
  });

  it('keeps nested definition navigation in the same workspace instead of stacking dialogs', () => {
    expect(runtimeBehaviorSource).not.toContain('<el-dialog');
    expect(upgradeBehaviorSource).not.toContain('<el-dialog');
    expect(comboDefinitionsSource).not.toContain('<el-dialog');
    expect(abilityEntityDefinitionsSource).not.toContain('<el-dialog');
    expect(skillEditorDialogSource).toContain('v-if="embedded && visible');
    expect(workspaceSource).toContain('v-if="showSkillEditor && selectedSkill"');
    expect(workspaceSource).toContain('v-if="showEntityEditor"');
    expect(workspaceSource).toContain('v-if="showComboEditor"');
    expect(workspaceSource).toContain('v-else-if="showRuntimeBehaviorEditor"');
  });

  it('edits combo registrations separately from attachment event conditions', () => {
    expect(workspaceSource).toContain('OperatorComboDefinitionsDialog');
    expect(comboDefinitionsSource).toContain('角色原生连携条件');
    expect(comboDefinitionsSource).toContain('附着事件常驻条件');
    expect(comboDefinitionsSource).toContain('角色进入战斗时安装一次，不按技能块重复安装');
    expect(comboDefinitionsSource).toContain('监听事件');
    expect(comboDefinitionsSource).toContain('每次注册复制的字面黑板');
    expect(comboDefinitionsSource).not.toContain('<textarea');
  });
});
