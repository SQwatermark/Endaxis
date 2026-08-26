import { beforeAll, describe, expect, it } from 'vitest';
import { createSSRApp, h, type Component } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { i18n, setLocale } from '@/i18n';
import { getGearPiece } from '@/data';
import { bedazzlingNightDebut } from '../../../data/equipment/akedbWeaponDefinitions';
import {
  getGearPieceGameName,
  getOperatorPotentialDescription,
  getOperatorTalentDescription,
} from '../../legacy/legacyGameText';
import {
  EquipmentSelectionTooltip,
  GameRichTextRenderer,
  getLegacyGearSelectionAffixRows,
  OperatorSkillTooltip,
} from '../../legacy/legacyPresentation';
import NextWeaponSelectionTooltip from './NextWeaponSelectionTooltip.vue';

async function renderComponent(component: Component, props: Record<string, unknown>) {
  const app = createSSRApp({
    render: () => h(component, props),
  });
  app.use(i18n);
  return renderToString(app);
}

describe('构筑 tooltip 渲染', () => {
  beforeAll(async () => {
    await setLocale('zh-CN', ['operators', 'weapons', 'gears']);
  });

  it('梨诺终结技名称、等级和富文本进入干员技能 tooltip', async () => {
    const html = await renderComponent(OperatorSkillTooltip, {
      operatorSlug: 'liino',
      skillKey: 'ultimate',
      skillLevel: 12,
      skillTypeName: '终结技',
    });

    expect(html).toContain('operator-skill-tooltip');
    expect(html).toContain('晨星的协奏曲');
    expect(html).toContain('终结技');
    expect(html).toContain('高歌姿态');
    expect(html).toContain('game-rich-text');
  });

  it('曜夜选择 tooltip 按潜能状态渲染正确等级和值', async () => {
    const normalHtml = await renderComponent(NextWeaponSelectionTooltip, {
      weapon: bedazzlingNightDebut,
      name: '曜夜的首演',
      fullPotential: false,
    });
    const fullHtml = await renderComponent(NextWeaponSelectionTooltip, {
      weapon: bedazzlingNightDebut,
      name: '曜夜的首演',
      fullPotential: true,
    });

    expect(normalHtml).toContain('weapon-selection-preview');
    expect(normalHtml).toContain('曜夜的首演');
    expect(normalHtml).toContain('医疗·闪耀帷幕');
    expect(normalHtml).toContain('Lv4');
    expect(normalHtml).toContain('+25.6%');
    expect(normalHtml).toContain('game-rich-text');

    expect(fullHtml).toContain('Lv9');
    expect(fullHtml).toContain('+44.8%');
    expect(fullHtml).toContain('+9.8%');
  });

  it('装备选择 tooltip 渲染词条和套装富文本', async () => {
    const assetSlug = 'xiranflow-light-armor';
    const piece = getGearPiece(assetSlug);
    expect(piece).toBeDefined();
    const affixRows = getLegacyGearSelectionAffixRows(
      assetSlug,
      (key, named) => String(i18n.global.t(key, named ?? {})),
      'zh-CN',
    );
    const html = await renderComponent(EquipmentSelectionTooltip, {
      equipment: {
        id: assetSlug,
        canonicalId: assetSlug,
        name: getGearPieceGameName(assetSlug, 'zh-CN'),
        category: piece?.setSlug ?? '',
      },
      affixRows,
    });

    expect(affixRows.length).toBeGreaterThan(0);
    expect(html).toContain('equipment-selection-preview');
    expect(html).toContain('壤流轻甲');
    expect(html).toContain('equipment-selection-preview__affix-row');
    expect(html).toContain('equipment-selection-preview__set-bonus');
    expect(html).toContain('game-rich-text');
  });

  it('梨诺天赋和潜能描述可由统一富文本组件渲染', async () => {
    const talentHtml = await renderComponent(GameRichTextRenderer, {
      text: getOperatorTalentDescription('liino', 0, 0, 'zh-CN'),
      locale: 'zh-CN',
    });
    const potentialHtml = await renderComponent(GameRichTextRenderer, {
      text: getOperatorPotentialDescription('liino', 0, 'zh-CN'),
      locale: 'zh-CN',
    });

    expect(talentHtml).toContain('game-rich-text');
    expect(talentHtml).toContain('+10%');
    expect(potentialHtml).toContain('game-rich-text');
    expect(potentialHtml).toContain('返还');
  });
});
