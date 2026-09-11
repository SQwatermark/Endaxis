import { describe, expect, it } from 'vitest';
import loadoutEditorSource from '../useTimelineLoadoutEditor.ts?raw';
import presentationSource from '../../presentation.ts?raw';
import equipmentTooltipSource from './EquipmentSelectionTooltip.vue?raw';
import operatorTooltipSource from './OperatorSkillTooltip.vue?raw';
import gearDialogSource from './GearSelectionDialog.vue?raw';
import gearBuildSource from './GearLoadoutBuildDialog.vue?raw';
import gearInstanceSource from './GearInstanceDialog.vue?raw';
import operatorBuildSource from './OperatorBuildDialog.vue?raw';
import weaponBuildSource from './WeaponBuildDialog.vue?raw';
import weaponTooltipSource from './WeaponSelectionTooltip.vue?raw';
import operatorSelectionSource from './OperatorSelectionDialog.vue?raw';
import weaponSelectionSource from './WeaponSelectionDialog.vue?raw';
import loadoutBuildProgressionSource from '../loadoutBuildProgression.ts?raw';
import {
  getOperatorCombatSkillDescription,
  getOperatorGameName,
  getOperatorPotentialDescription,
  getOperatorTalentDescription,
  getWeaponGameName,
  getWeaponSkillDescription,
} from '../../gameText';

describe('旧版构筑编辑行为兼容结构', () => {
  it('选择干员、武器和装备统一通过默认构筑工厂', () => {
    expect(loadoutEditorSource).toContain('createDefaultOperatorInstance(operator)');
    expect(loadoutEditorSource).toContain('createDefaultWeaponInstance(weapon)');
    expect(loadoutEditorSource).toContain('createDefaultGearInstance(gear, artificingTier)');
  });

  it('干员和武器拉满与选择共用同一套边界计算', () => {
    expect(operatorBuildSource).toContain('projectMaxOperatorChanges(operator, currentDefinition)');
    expect(operatorBuildSource).toContain('projectOperatorProgressionChange(');
    expect(operatorBuildSource).toContain('getOperatorTrustMax(');
    expect(loadoutBuildProgressionSource).toContain('createDefaultOperatorInstance(definition)');
    expect(loadoutBuildProgressionSource).toContain('getWeaponTraitBounds(');
    expect(weaponBuildSource).toContain('projectMaxWeaponChanges(weapon)');
    expect(loadoutBuildProgressionSource).toContain(
      'resolveMaxWeaponTraitLevels(weapon.definition, potential)',
    );
    expect(weaponBuildSource).toContain('projectWeaponPotentialChange(weapon, nextPotential)');
    expect(weaponBuildSource).toContain('projectWeaponProgressionChange(');
    expect(weaponBuildSource).toContain('traitDisplayLevels(key)');
    expect(weaponBuildSource).toContain('getWeaponTraitValueText(trait, traitLevel(key))');
    expect(weaponBuildSource).toContain('class="skill-value"');
  });

  it('装备拉满只处理可精炼装备', () => {
    expect(gearBuildSource).toContain('isEquipmentArtificable(build.definition.levelRequirement)');
    expect(gearBuildSource).toContain('resolveMaxGearArtificingLevels(build.definition)');
    expect(gearBuildSource).toContain('resolveGearArtificingLevels(build.definition, level)');
  });

  it('装备实例编辑与项目级定义编辑保持两个独立入口', () => {
    expect(gearBuildSource).toContain('<GearInstanceDialog');
    expect(gearBuildSource).toContain("t('actionLibrary.buttons.editItem')");
    expect(gearBuildSource).toContain("emit('edit-definition', slot.slot)");
    expect(gearBuildSource).toContain('getGearDefinitionInstanceAffixRows');
    expect(gearInstanceSource).toContain("emit('update', levels)");
    expect(gearInstanceSource).not.toContain('edit-definition');
  });

  it('自定义定义入口随当前语言显示，并区分首次自定义与继续编辑', () => {
    expect(operatorBuildSource).toContain('timeline.customDefinition.customizeOperator');
    expect(operatorBuildSource).toContain('timeline.customDefinition.editOperator');
    expect(weaponBuildSource).toContain('timeline.customDefinition.customizeWeapon');
    expect(weaponBuildSource).toContain('timeline.customDefinition.editWeapon');
    expect(gearBuildSource).toContain('timeline.customDefinition.customizeGear');
    expect(gearBuildSource).toContain('timeline.customDefinition.editGear');
    expect(operatorBuildSource).not.toContain('>\n            自定义干员\n');
  });

  it('干员与武器的自定义入口跟随旧版放在突破操作旁', () => {
    const operatorPromotion = operatorBuildSource.indexOf('{{ promotionLabel() }}');
    const operatorDefinition = operatorBuildSource.indexOf(
      "t('timeline.customDefinition.customizeOperator')",
    );
    const operatorPotential = operatorBuildSource.indexOf('v-if="potentialCount > 0"');
    expect(operatorPromotion).toBeGreaterThan(-1);
    expect(operatorDefinition).toBeGreaterThan(operatorPromotion);
    expect(operatorDefinition).toBeLessThan(operatorPotential);

    const weaponTuning = weaponBuildSource.indexOf('{{ tuningLabel() }}');
    const weaponDefinition = weaponBuildSource.indexOf(
      "t('timeline.customDefinition.customizeWeapon')",
    );
    const weaponPotential = weaponBuildSource.indexOf("t('armory.common.potential')");
    const weaponFooter = weaponBuildSource.indexOf('<template #footer>');
    expect(weaponTuning).toBeGreaterThan(-1);
    expect(weaponDefinition).toBeGreaterThan(weaponTuning);
    expect(weaponDefinition).toBeLessThan(weaponPotential);
    expect(weaponDefinition).toBeLessThan(weaponFooter);
  });

  it('装备构筑与实例编辑保留旧版卡片尺寸和品质文案', () => {
    expect(gearBuildSource).toMatch(/\.gear-slot-card\s*\{[\s\S]*?min-height:\s*230px;/);
    expect(gearInstanceSource).toContain('getEquipmentQualityTier(');
    expect(gearInstanceSource).toContain('getGameQualityName(quality.value, locale.value)');
    expect(gearInstanceSource).not.toContain('Lv{{ gear.definition.levelRequirement }}');
    expect(gearInstanceSource).toContain('class="stat-value-inline"');
  });

  it('干员构筑面板恢复旧版元素标签的语义色', () => {
    expect(operatorBuildSource).toContain("elementColors[definition.value?.element ?? '']");
    expect(operatorBuildSource).toContain(
      ':style="{ color: elementColor, borderColor: elementColor }"',
    );
  });

  it('富文本 tooltip 使用正式数据定义并保留既有排版类名', () => {
    expect(presentationSource).toContain('GameRichTextRenderer');
    expect(operatorTooltipSource).toContain('listOperatorSkillDefinitionBindings');
    expect(equipmentTooltipSource).not.toContain("from '@/data'");
    expect(operatorBuildSource).toContain('<OperatorSkillTooltip');
    expect(operatorBuildSource).toContain('popper-class="operator-edit-tooltip-popper"');
    expect(gearDialogSource).toContain('<EquipmentSelectionTooltip');
    expect(weaponTooltipSource).not.toContain('<WeaponSelectionTooltip');
    expect(weaponTooltipSource).not.toContain('hasLegacyWeaponPresentation');
    expect(weaponTooltipSource).toContain('props.weapon.baseAttackAtLevelNodes.at(-1)');
    expect(weaponTooltipSource).toContain('props.weapon.assetSlug ?? props.weapon.slug');
    expect(weaponTooltipSource).toContain('class="weapon-selection-preview"');
    expect(weaponTooltipSource).toContain('<GameRichTextRenderer');
  });

  it('选择器保留旧版可观察结构，但不读取旧 Store 或旧武器定义', () => {
    for (const source of [operatorSelectionSource, weaponSelectionSource]) {
      expect(source).toContain('class="char-selector-dialog"');
      expect(source).toContain('class="selector-header"');
      expect(source).toContain('class="roster-scroll-container"');
      expect(source).toContain('class="roster-grid"');
      expect(source).toContain('class="roster-card');
      expect(source).not.toContain('useTimelineStore');
    }
    expect(weaponSelectionSource).toContain('definition.assetSlug ?? definition.slug');
    expect(weaponTooltipSource).not.toContain("from '@/data'");
    expect(weaponTooltipSource).not.toContain('getWeapon(');
  });

  it('干员、武器和装备选择器只按当前语言的显示名称搜索', () => {
    for (const source of [operatorSelectionSource, weaponSelectionSource, gearDialogSource]) {
      expect(source).toContain('matchesLocalizedNameSearch(');
    }
    expect(operatorSelectionSource).not.toContain('searchTerms:');
    expect(weaponSelectionSource).not.toContain('item.definition.slug,');
    expect(gearDialogSource).not.toContain('item.definition.gearSetSlug,');
  });

  it('干员实例面板的技能图标以可交互光标提示 tooltip', () => {
    expect(operatorBuildSource).toMatch(/\.skill-icon-frame\s*\{[\s\S]*?cursor:\s*pointer;/);
  });

  it('四类构筑弹窗共用窄视口外壳，不让固定桌面宽度截断内容', () => {
    for (const source of [
      operatorBuildSource,
      weaponBuildSource,
      gearBuildSource,
      gearInstanceSource,
    ]) {
      expect(source).toContain('next-armory-dialog');
      expect(source).toContain("import './armoryDialog.css'");
    }
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
    expect(getOperatorTalentDescription('liino', 0, 0, 'zh-CN')).toContain('<@ba.vup>+10%</>');
    expect(getOperatorPotentialDescription('liino', 0, 'zh-CN')).toContain('<#ba.return>返还</>');
  });
});
