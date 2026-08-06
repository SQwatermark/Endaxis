import { describe, expect, it } from 'vitest';
import { createSkillSettingSource, parseSkillSettingCatalog } from './skillSettingCatalog';

describe('skillSettingCatalog', () => {
  it('parses generated settings and builds lookup indexes', () => {
    const catalog = parseSkillSettingCatalog(createCatalog());
    const source = createSkillSettingSource(catalog);

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
    const catalog = createCatalog();
    catalog.enhanceFormulas = [];

    expect(() => parseSkillSettingCatalog(catalog)).toThrow(
      "setting 'compound' references missing formula 'linear'",
    );
  });

  it('rejects data that no longer has four columns', () => {
    const catalog = createCatalog();
    catalog.data[0]!.values = [1, 2, 3];

    expect(() => parseSkillSettingCatalog(catalog)).toThrow('expected four-element array');
  });

  it('rejects unknown formula types', () => {
    const catalog = createCatalog();
    catalog.enhanceFormulas[0]!.formulaType = 'quadratic';

    expect(() => parseSkillSettingCatalog(catalog)).toThrow("unknown formula 'quadratic'");
  });
});

function createCatalog(): {
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
