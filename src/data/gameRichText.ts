import { i18n } from '@/i18n';
import battleTermsEn from '../i18n/game-locales/en/battleTerms.json';
import battleTermsZh from '../i18n/game-locales/zh/battleTerms.json';

type GameLocale = 'en' | 'zh';

type RichTextTermEntry = {
  name?: string;
  description?: string;
  styleId?: string;
  iconPath?: string;
};

type BattleTermsLocaleTable = {
  terms?: Record<string, RichTextTermEntry>;
};

export type GameRichTextNode =
  | { type: 'text'; text: string }
  | { type: 'image'; path: string }
  | { type: 'style'; id: string; children: GameRichTextNode[] }
  | { type: 'term'; id: string; children: GameRichTextNode[] };

export type ResolvedRichTextStyle = {
  color: string | null;
  icon: string | null;
};

export type ResolvedRichTextTerm = {
  id: string;
  name: string;
  description: string;
  styleId: string;
  icon: string | null;
};

const battleTermsTables = {
  en: battleTermsEn as BattleTermsLocaleTable,
  zh: battleTermsZh as BattleTermsLocaleTable,
};

const RICH_TEXT_STYLES: Record<string, ResolvedRichTextStyle> = {
  'ba.airborne': { color: '#a68360', icon: '/icons/icon_battle_physical_airborne.webp' },
  'ba.burning': { color: '#f45511', icon: '/icons/icon_battle_debuff_burning.webp' },
  'ba.conduct': { color: '#cc9900', icon: '/icons/icon_battle_debuff_conduct.webp' },
  'ba.corrupt': { color: '#6d9a00', icon: '/icons/icon_battle_debuff_corrupt.webp' },
  'ba.crush': { color: '#a68360', icon: '/icons/icon_battle_physical_crush.webp' },
  'ba.cryst': { color: '#009cad', icon: null },
  'ba.crystbreak': { color: '#009cad', icon: '/icons/icon_battle_debuff_crystbreak.webp' },
  'ba.crystinflict': { color: '#009cad', icon: '/icons/icon_energy_fusion_cryst.webp' },
  'ba.ether': { color: '#9959ff', icon: null },
  'ba.fire': { color: '#f45511', icon: null },
  'ba.fireinflict': { color: '#f45511', icon: '/icons/icon_energy_fusion_fire.webp' },
  'ba.fracture': { color: '#a68360', icon: '/icons/icon_battle_physical_fracture.webp' },
  'ba.frozen': { color: '#009cad', icon: '/icons/icon_battle_debuff_frozen.webp' },
  'ba.heal': { color: '#6d9a00', icon: null },
  'ba.info': { color: '#8c8c8c', icon: null },
  'ba.key': { color: '#1da6e0', icon: null },
  'ba.knockdown': { color: '#a68360', icon: '/icons/icon_battle_physical_knockdown.webp' },
  'ba.natur': { color: '#6d9a00', icon: null },
  'ba.naturalinflict': { color: '#6d9a00', icon: '/icons/icon_energy_fusion_nature.webp' },
  'ba.noguard': { color: '#a68360', icon: '/icons/icon_battle_physical_no_guard.webp' },
  'ba.pd': { color: '#a68360', icon: null },
  'ba.phy': { color: '#a68360', icon: null },
  'ba.poise': { color: '#bb6a26', icon: null },
  'ba.pulse': { color: '#cc9900', icon: null },
  'ba.pulseinflict': { color: '#cc9900', icon: '/icons/icon_energy_fusion_pulse.webp' },
  'ba.vdown': { color: '#e54545', icon: null },
  'ba.vup': { color: '#5988ff', icon: null },
};

function resolveGameLocale(localeLike?: string | null): GameLocale {
  const locale = String(localeLike || i18n.global.locale.value || '').toLowerCase();
  return locale.startsWith('zh') ? 'zh' : 'en';
}

function getBattleTermsTable(locale?: string | null) {
  return battleTermsTables[resolveGameLocale(locale)];
}

export function resolveRichTextImage(path: string) {
  const normalized = String(path || '').replace(/\\/g, '/').trim();
  if (normalized.startsWith('/icons/')) return normalized;
  if (normalized.startsWith('icons/')) return `/${normalized}`;
  return null;
}

export function getRichTextStyle(id: string): ResolvedRichTextStyle {
  return RICH_TEXT_STYLES[id] ?? { color: null, icon: null };
}

export function getRichTextTerm(
  id: string,
  locale?: string | null,
): ResolvedRichTextTerm | null {
  const term = getBattleTermsTable(locale).terms?.[id];
  if (!term) return null;
  return {
    id,
    name: term.name || id,
    description: term.description || '',
    styleId: term.styleId || '',
    icon: term.iconPath ? resolveRichTextImage(term.iconPath) : null,
  };
}

export function parseGameRichText(text: string): GameRichTextNode[] {
  return parseNodes(String(text || ''), 0, String(text || '').length).nodes;
}

function parseNodes(
  text: string,
  start: number,
  end: number,
): { nodes: GameRichTextNode[]; index: number } {
  const nodes: GameRichTextNode[] = [];
  let index = start;
  let textBuffer = '';

  function pushText() {
    if (!textBuffer) return;
    nodes.push({ type: 'text', text: textBuffer });
    textBuffer = '';
  }

  while (index < end) {
    if (text.startsWith('</>', index)) break;

    if (text[index] !== '<') {
      textBuffer += text[index];
      index += 1;
      continue;
    }

    const imageMatch = text.slice(index).match(/^<image="([^"]+)">/);
    if (imageMatch) {
      pushText();
      nodes.push({
        type: 'image',
        path: imageMatch[1] ?? '',
      });
      index += imageMatch[0].length;
      continue;
    }

    const tagMatch = text.slice(index).match(/^<([@#])([^>]+)>/);
    if (!tagMatch) {
      textBuffer += text[index];
      index += 1;
      continue;
    }

    const tagStart = index;
    const tagLength = tagMatch[0].length;
    const closeIndex = findMatchingClose(text, index + tagLength, end);
    if (closeIndex < 0) {
      textBuffer += text[index];
      index += 1;
      continue;
    }

    pushText();
    nodes.push({
      type: tagMatch[1] === '@' ? 'style' : 'term',
      id: tagMatch[2] ?? '',
      children: parseNodes(text, index + tagLength, closeIndex).nodes,
    });
    index = closeIndex + 3;

    if (index <= tagStart) index = tagStart + 1;
  }

  pushText();
  return { nodes, index };
}

function findMatchingClose(text: string, start: number, end: number) {
  let depth = 1;
  let index = start;
  while (index < end) {
    if (text.startsWith('</>', index)) {
      depth -= 1;
      if (depth === 0) return index;
      index += 3;
      continue;
    }
    if (/^<[@#][^>]+>/.test(text.slice(index))) depth += 1;
    index += 1;
  }
  return -1;
}
