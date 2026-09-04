import { describe, expect, it } from 'vitest';
import {
  parseSkillSettingDumpSource,
  renderSkillSettingDocument,
} from '../src/source/skillSettingDumpSource.ts';

const dump = `MonoBehaviour Base
\tSpellInflictionData spellInflictionDataList
\t\tArray Array
\t\tint size = 1
\t\t\t[0]
\t\t\tSpellInflictionData data
\t\t\t\tstring key = "倍率"
\t\t\t\tstring desc = ""
\t\t\t\tvector values
\t\t\t\t\tArray Array
\t\t\t\t\tint size = 4
\t\t\t\t\t\t[0]
\t\t\t\t\t\tfloat data = 1
\t\t\t\t\t\t[1]
\t\t\t\t\t\tfloat data = 1.5
\t\t\t\t\t\t[2]
\t\t\t\t\t\tfloat data = 2
\t\t\t\t\t\t[3]
\t\t\t\t\t\tfloat data = 2.5
\t\t\t\tstring enhanceFormulaKey = "Damage"
\tPhysicalAndSpellInflictionEnhanceFormula physicalAndSpellInflictionEnhanceFormulaList
\t\tArray Array
\t\tint size = 1
\t\t\t[0]
\t\t\tPhysicalAndSpellInflictionEnhanceFormula data
\t\t\t\tstring key = "Damage"
\t\t\t\tint formulaType = 1
\t\t\t\tdouble paramA = 0.01
\t\t\t\tdouble paramB = 1
\tPoiseGuardConfig unrelatedTail
`;

describe('SkillSetting TypeTree source', () => {
  it('extracts the exact infliction subset and renders the runtime document', () => {
    const source = parseSkillSettingDumpSource(dump, 'SkillSetting.fixture');
    expect(source).toMatchObject({
      data: [{ key: '倍率', values: [1, 1.5, 2, 2.5], enhanceFormulaKey: 'Damage' }],
      enhanceFormulas: [{ key: 'Damage', formulaType: 'linear', paramA: 0.01, paramB: 1 }],
    });
    expect(JSON.parse(renderSkillSettingDocument(source, 'game@1'))).toMatchObject({
      schemaVersion: 1,
      revision: 'game@1',
      data: source.data,
      enhanceFormulas: source.enhanceFormulas,
    });
  });

  it('rejects truncated columns, missing formulas and non-contiguous rows', () => {
    expect(() =>
      parseSkillSettingDumpSource(
        dump.replace('\t\t\t\t\tint size = 4', '\t\t\t\t\tint size = 3'),
        'columns',
      ),
    ).toThrow('expected four SkillSetting columns');
    expect(() =>
      parseSkillSettingDumpSource(
        dump.replace('enhanceFormulaKey = "Damage"', 'enhanceFormulaKey = "Missing"'),
        'formula',
      ),
    ).toThrow('missing formula Missing');
    expect(() =>
      parseSkillSettingDumpSource(
        dump.replace(
          '\t\t\t[0]\n\t\t\tSpellInflictionData',
          '\t\t\t[1]\n\t\t\tSpellInflictionData',
        ),
        'index',
      ),
    ).toThrow('non-contiguous SkillSetting data index');
  });
});
