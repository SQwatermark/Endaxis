export const THEME_TOKENS = [
  'canvas',
  'surface',
  'surfaceElevated',
  'surfaceInteractive',
  'textPrimary',
  'textSecondary',
  'textMuted',
  'border',
  'borderStrong',
  'accent',
  'accentText',
  'focus',
  'danger',
  'warning',
  'success',
  'shadow',
] as const;

export type ThemeToken = (typeof THEME_TOKENS)[number];
export type ThemeColorScheme = 'dark' | 'light';

export interface ThemeDefinition {
  readonly id: string;
  readonly colorScheme: ThemeColorScheme;
  readonly tokens: Readonly<Record<ThemeToken, string>>;
}

export interface ThemeTarget {
  readonly style: {
    setProperty(name: string, value: string): void;
  };
  setAttribute(name: string, value: string): void;
}

function toCssProperty(token: ThemeToken): string {
  return `--ea-${token.replace(/[A-Z]/g, character => `-${character.toLowerCase()}`)}`;
}

export function validateThemeDefinition(theme: ThemeDefinition): void {
  if (theme.id.length === 0) throw new Error('theme id must not be empty');
  for (const token of THEME_TOKENS) {
    if (typeof theme.tokens[token] !== 'string' || theme.tokens[token].length === 0) {
      throw new Error(`theme '${theme.id}' is missing token '${token}'`);
    }
  }
}

/** UI 框架主题注册表；战斗领域颜色不进入此边界。 */
export class ThemeRegistry {
  readonly #themes = new Map<string, ThemeDefinition>();

  constructor(themes: readonly ThemeDefinition[] = []) {
    themes.forEach(theme => this.register(theme));
  }

  register(theme: ThemeDefinition): void {
    validateThemeDefinition(theme);
    if (this.#themes.has(theme.id)) throw new Error(`duplicate theme id '${theme.id}'`);
    this.#themes.set(theme.id, theme);
  }

  get(id: string): ThemeDefinition | null {
    return this.#themes.get(id) ?? null;
  }

  apply(target: ThemeTarget, id: string): void {
    const theme = this.#themes.get(id);
    if (theme === undefined) throw new Error(`unknown theme '${id}'`);

    target.setAttribute('data-ea-theme', theme.id);
    target.setAttribute('data-color-scheme', theme.colorScheme);
    for (const token of THEME_TOKENS) {
      target.style.setProperty(toCssProperty(token), theme.tokens[token]);
    }
  }
}
