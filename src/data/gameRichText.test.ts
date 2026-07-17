import { describe, expect, test } from 'vitest';
import {
  getRichTextStyle,
  getRichTextTerm,
  parseGameRichText,
  resolveRichTextImage,
} from './gameRichText';

describe('game rich text', () => {
  test('parses style and term tags without dropping plain text', () => {
    expect(parseGameRichText('Deal <@ba.fire>Heat DMG</> and apply <#ba.burning>Combustion</>')).toEqual([
      { type: 'text', text: 'Deal ' },
      { type: 'style', id: 'ba.fire', children: [{ type: 'text', text: 'Heat DMG' }] },
      { type: 'text', text: ' and apply ' },
      { type: 'term', id: 'ba.burning', children: [{ type: 'text', text: 'Combustion' }] },
    ]);
  });

  test('parses converted internal image tags', () => {
    expect(parseGameRichText('<image="/icons/icon_energy_fusion_fire.webp">')).toEqual([
      { type: 'image', path: '/icons/icon_energy_fusion_fire.webp' },
    ]);
  });

  test('resolves localized battle term descriptions', () => {
    expect(getRichTextTerm('ba.fireburst', 'zh-CN')?.name).toBe('\u6cd5\u672f\u7206\u53d1 - \u707c\u70ed');
    expect(getRichTextTerm('ba.fireburst', 'en')?.name).toBe('Arts Burst: Heat');
  });

  test('uses Endaxis fixed dark rich text styles', () => {
    expect(getRichTextStyle('ba.key')).toEqual({ color: '#1da6e0', icon: null });
    expect(getRichTextStyle('ba.info')).toEqual({ color: '#8c8c8c', icon: null });
    expect(getRichTextStyle('ba.burning')).toEqual({
      color: '#f45511',
      icon: '/icons/icon_battle_debuff_burning.webp',
    });
    expect(getRichTextStyle('ba.fire')).toEqual({ color: '#f45511', icon: null });
  });

  test('uses internal icon paths only', () => {
    expect(resolveRichTextImage('/icons/icon_battle_debuff_burning.webp')).toBe(
      '/icons/icon_battle_debuff_burning.webp',
    );
    expect(resolveRichTextImage('icons/icon_energy_fusion_fire.webp')).toBe(
      '/icons/icon_energy_fusion_fire.webp',
    );
    expect(resolveRichTextImage('public/images/TermIcon/icon_term_ba_burning.png')).toBeNull();
  });
});
