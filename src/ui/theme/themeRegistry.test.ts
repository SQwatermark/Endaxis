import { describe, expect, it, vi } from 'vitest';
import { BUILTIN_THEMES } from './builtinThemes';
import { ThemeRegistry, type ThemeDefinition, type ThemeTarget } from './themeRegistry';

function createTarget(): ThemeTarget {
  return {
    style: { setProperty: vi.fn() },
    setAttribute: vi.fn(),
  };
}

describe('ThemeRegistry', () => {
  it('applies a selected theme through semantic CSS properties', () => {
    const registry = new ThemeRegistry(BUILTIN_THEMES);
    const target = createTarget();

    registry.apply(target, 'endaxis-dark');

    expect(target.setAttribute).toHaveBeenCalledWith('data-ea-theme', 'endaxis-dark');
    expect(target.setAttribute).toHaveBeenCalledWith('data-color-scheme', 'dark');
    expect(target.style.setProperty).toHaveBeenCalledWith('--ea-surface-elevated', '#24282c');
  });

  it('accepts additional complete themes without changing the registry type', () => {
    const registry = new ThemeRegistry();
    const custom: ThemeDefinition = {
      ...BUILTIN_THEMES[0],
      id: 'custom-dark',
    };

    registry.register(custom);

    expect(registry.get('custom-dark')).toBe(custom);
  });

  it('rejects incomplete runtime theme data before applying it', () => {
    const incomplete = {
      id: 'incomplete',
      colorScheme: 'dark',
      tokens: { canvas: '#000' },
    } as unknown as ThemeDefinition;

    expect(() => new ThemeRegistry([incomplete])).toThrow(
      "theme 'incomplete' is missing token 'surface'",
    );
  });
});
