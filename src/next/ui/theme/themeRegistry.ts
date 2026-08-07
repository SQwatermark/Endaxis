/**
 * 主题系统与具体 UI 根节点之间的边界。调用方只能注册完整主题并应用到自己的根节点，
 * 战斗领域颜色和用户项目数据不得进入这里。
 */
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

/** 组件可依赖的稳定语义主题令牌。 */
export type ThemeToken = (typeof THEME_TOKENS)[number];
/** 供浏览器和原生控件选择明暗表现的主题类别。 */
export type ThemeColorScheme = 'dark' | 'light';

/** 一个完整主题；必须覆盖全部令牌，不能依赖回退颜色。 */
export interface ThemeDefinition {
  readonly id: string;
  readonly colorScheme: ThemeColorScheme;
  readonly tokens: Readonly<Record<ThemeToken, string>>;
}

/** 主题变量写入目标，通常是新版应用的根元素。 */
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
