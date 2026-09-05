/**
 * 提供遵守全部语义令牌契约的默认主题。它们只是 UI 默认配置，
 * 不能被核心逻辑用来判断语言、伤害类型或任何战斗状态。
 */
import type { ThemeDefinition } from './themeRegistry';

export const BUILTIN_THEMES = [
  {
    id: 'endaxis-dark',
    colorScheme: 'dark',
    tokens: {
      canvas: '#111315',
      surface: '#1b1e21',
      surfaceElevated: '#24282c',
      surfaceInteractive: '#2d3237',
      textPrimary: '#f3f5f6',
      textSecondary: '#c1c7cc',
      textMuted: '#858e95',
      border: '#3b4147',
      borderStrong: '#5b646c',
      accent: '#f0d500',
      accentText: '#141414',
      focus: '#55b8ff',
      danger: '#ff5c62',
      warning: '#f2b84b',
      success: '#55c88a',
      shadow: 'rgba(0, 0, 0, 0.48)',
    },
  },
  {
    id: 'endaxis-light',
    colorScheme: 'light',
    tokens: {
      canvas: '#eef0f1',
      surface: '#ffffff',
      surfaceElevated: '#f7f8f8',
      surfaceInteractive: '#e7eaec',
      textPrimary: '#202428',
      textSecondary: '#4f5961',
      textMuted: '#77828b',
      border: '#cbd1d5',
      borderStrong: '#9da7ae',
      accent: '#d6bd00',
      accentText: '#151515',
      focus: '#0077c8',
      danger: '#c9363e',
      warning: '#a86700',
      success: '#187b4b',
      shadow: 'rgba(23, 29, 33, 0.2)',
    },
  },
] as const satisfies readonly ThemeDefinition[];
