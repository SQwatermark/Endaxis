import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { APPEARANCE_STORAGE_KEY, readStoredAppearance, setAppearance } from './appearance';

function installDomMocks() {
  const store = new Map<string, string>();
  const classSet = new Set<string>(['dark']);
  const attrs = new Map<string, string>([['data-theme', 'dark']]);

  vi.stubGlobal('localStorage', {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
  });

  vi.stubGlobal('document', {
    documentElement: {
      setAttribute: (key: string, value: string) => {
        attrs.set(key, value);
      },
      getAttribute: (key: string) => (attrs.has(key) ? attrs.get(key)! : null),
      classList: {
        toggle: (token: string, force?: boolean) => {
          const on = force === undefined ? !classSet.has(token) : !!force;
          if (on) classSet.add(token);
          else classSet.delete(token);
          return on;
        },
        contains: (token: string) => classSet.has(token),
      },
    },
  });
}

describe('appearance', () => {
  beforeEach(() => {
    installDomMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('applies the selected theme to the page and persists it', () => {
    setAppearance('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('light');
    expect(readStoredAppearance()).toBe('light');

    expect(setAppearance('dark')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(readStoredAppearance()).toBe('dark');
  });
});
