import { describe, expect, it } from 'vitest';
import { createSkillSettingSource, parseSkillSettings } from './skillSettings';

describe('skillSettings', () => {
  it('parses generated settings and builds lookup indexes', () => {
    const index = parseSkillSettings(createSettings());
    const source = createSkillSettingSource(index);

    expect(source.getSetting('compound')).toEqual({
      key: 'compound',
      values: [1, 2, 3, 4],
      enhanceFormulaKey: 'linear',
    });
    expect(source.getEnhanceFormula('linear')).toEqual({
      key: 'linear',
      kind: 'linear',
      paramA: 0.25,
    });
  });

  it('rejects missing formula references', () => {
    const index = createSettings();
    index.enhanceFormulas = [];

    expect(() => parseSkillSettings(index)).toThrow(
      "setting 'compound' references missing formula 'linear'",
    );
  });

  it('rejects data that no longer has four columns', () => {
    const index = createSettings();
    index.data[0]!.values = [1, 2, 3];

    expect(() => parseSkillSettings(index)).toThrow('expected four-element array');
  });

  it('rejects unknown formula types', () => {
    const index = createSettings();
    index.enhanceFormulas[0]!.formulaType = 'quadratic';

    expect(() => parseSkillSettings(index)).toThrow("unknown formula 'quadratic'");
  });
});

function createSettings(): {
  schemaVersion: number;
  revision: string;
  data: { key: string; values: number[]; enhanceFormulaKey: string }[];
  enhanceFormulas: {
    key: string;
    formulaType: string;
    paramA: number;
    paramB: number;
  }[];
} {
  return {
    schemaVersion: 1,
    revision: 'fixture',
    data: [{ key: 'compound', values: [1, 2, 3, 4], enhanceFormulaKey: 'linear' }],
    enhanceFormulas: [{ key: 'linear', formulaType: 'linear', paramA: 0.25, paramB: 3 }],
  };
}
