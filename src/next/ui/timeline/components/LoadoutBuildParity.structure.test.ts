import { describe, expect, it } from 'vitest';
import loadoutEditorSource from '../useTimelineLoadoutEditor.ts?raw';
import legacyPresentationSource from '../../legacy/legacyPresentation.ts?raw';
import gearDialogSource from './GearSelectionDialog.vue?raw';
import gearBuildSource from './NextGearLoadoutBuildDialog.vue?raw';
import operatorBuildSource from './NextOperatorBuildDialog.vue?raw';
import weaponBuildSource from './NextWeaponBuildDialog.vue?raw';
import weaponTooltipSource from './NextWeaponSelectionTooltip.vue?raw';
import {
  getOperatorCombatSkillDescription,
  getOperatorGameName,
  getOperatorPotentialDescription,
  getOperatorTalentDescription,
  getWeaponGameName,
  getWeaponSkillDescription,
} from '../../legacy/legacyGameText';

describe('旧版构筑编辑行为兼容结构', () => {
  it('选择干员、武器和装备统一通过默认构筑工厂', () => {
    expect(loadoutEditorSource).toContain('createDefaultOperatorInstance(operator)');
    expect(loadoutEditorSource).toContain('createDefaultWeaponInstance(weapon)');
    expect(loadoutEditorSource).toContain('createDefaultGearInstance(gear, artificingTier)');
  });

  it('干员和武器拉满与选择共用同一套边界计算', () => {
    expect(operatorBuildSource).toContain('createDefaultOperatorInstance(currentDefinition)');
    expect(operatorBuildSource).toContain('getOperatorTrustMax(');
    expect(weaponBuildSource).toContain(
      'resolveMaxWeaponTraitLevels(weapon.definition, potential)',
    );
  });

  it('装备拉满只处理可精炼装备', () => {
    expect(gearBuildSource).toContain(
      'isEquipmentArtificable(build.definition.levelRequirement)',
    );
    expect(gearBuildSource).toContain('setUniformLevel(build, 3)');
  });

  it('富文本 tooltip 复用旧版展示边界并保留旧版排版类名', () => {
    expect(legacyPresentationSource).toContain('OperatorSkillTooltip');
    expect(legacyPresentationSource).toContain('EquipmentSelectionTooltip');
    expect(legacyPresentationSource).toContain('WeaponSelectionTooltip');
    expect(operatorBuildSource).toContain('<OperatorSkillTooltip');
    expect(operatorBuildSource).toContain('popper-class="operator-edit-tooltip-popper"');
    expect(gearDialogSource).toContain('<EquipmentSelectionTooltip');
    expect(weaponTooltipSource).toContain('<WeaponSelectionTooltip');
    expect(weaponTooltipSource).toContain('props.weapon.assetSlug ?? props.weapon.slug');
    expect(weaponTooltipSource).toContain('class="weapon-selection-preview"');
    expect(weaponTooltipSource).toContain('<GameRichTextRenderer');
  });

  it('AKEDB 新武器也通过 i18n 提供展示名，不向定义写入中文名', () => {
    expect(getWeaponGameName('bedazzling-night-debut', 'zh-CN')).toBe('曜夜的首演');
    expect(getWeaponGameName('bedazzling-night-debut', 'en')).toBe('Bedazzling Night Debut');
    expect(getWeaponSkillDescription('bedazzling-night-debut', 'skill3', 'zh-CN', 9)).toContain(
      '<@ba.vup>+44.8%</>',
    );
  });

  it('梨诺技能、天赋和潜能 tooltip 使用已有主线富文本证据', () => {
    expect(getOperatorGameName('liino', 'zh-CN')).toBe('梨诺');
    expect(getOperatorCombatSkillDescription('liino', 'ultimate', 'zh-CN')).toContain(
      '<@ba.key>高歌姿态</>',
    );
    expect(getOperatorTalentDescription('liino', 0, 0, 'zh-CN')).toContain(
      '<@ba.vup>+10%</>',
    );
    expect(getOperatorPotentialDescription('liino', 0, 'zh-CN')).toContain(
      '<#ba.return>返还</>',
    );
  });
});
