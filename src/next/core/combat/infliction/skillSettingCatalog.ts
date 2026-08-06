export const SKILL_SETTING_CATALOG_SCHEMA_VERSION = 1;

export type InflictionEnhanceFormula =
  | { readonly kind: 'none' }
  | { readonly kind: 'linear'; readonly paramA: number }
  | { readonly kind: 'saturating'; readonly paramA: number; readonly paramB: number };

export interface CompoundStatusSkillSetting {
  readonly values: readonly number[];
  readonly enhanceFormulaKey: string;
}

export interface CompoundStatusSkillSettingSource {
  getSetting(dataKey: string): CompoundStatusSkillSetting | undefined;
  getEnhanceFormula(formulaKey: string): InflictionEnhanceFormula | undefined;
}

export interface SkillSettingCatalogDocument {
  readonly schemaVersion: typeof SKILL_SETTING_CATALOG_SCHEMA_VERSION;
  readonly revision: string;
  readonly data: readonly ({ readonly key: string } & CompoundStatusSkillSetting)[];
  readonly enhanceFormulas: readonly ({ readonly key: string } & InflictionEnhanceFormula)[];
}

/** Strict boundary for the generated subset of the native SkillSetting asset. */
export function parseSkillSettingCatalog(input: unknown): SkillSettingCatalogDocument {
  const root = requireObject(input, '$');
  requireOnlyKeys(root, '$', ['schemaVersion', 'revision', 'data', 'enhanceFormulas']);
  if (root.schemaVersion !== SKILL_SETTING_CATALOG_SCHEMA_VERSION) {
    throw new Error(`$.schemaVersion: expected ${SKILL_SETTING_CATALOG_SCHEMA_VERSION}`);
  }
  if (!Array.isArray(root.data)) throw new Error('$.data: expected array');
  if (!Array.isArray(root.enhanceFormulas)) {
    throw new Error('$.enhanceFormulas: expected array');
  }

  const data = root.data.map((entry, index) => parseSetting(entry, `$.data[${index}]`));
  const enhanceFormulas = root.enhanceFormulas.map((entry, index) =>
    parseFormula(entry, `$.enhanceFormulas[${index}]`),
  );
  requireUniqueKeys(data, '$.data');
  requireUniqueKeys(enhanceFormulas, '$.enhanceFormulas');
  requireFormulaReferences(data, enhanceFormulas);
  return {
    schemaVersion: SKILL_SETTING_CATALOG_SCHEMA_VERSION,
    revision: requireNonEmptyString(root.revision, '$.revision'),
    data,
    enhanceFormulas,
  };
}

export function createSkillSettingSource(
  catalog: SkillSettingCatalogDocument,
): CompoundStatusSkillSettingSource {
  const settings = new Map(catalog.data.map(entry => [entry.key, entry]));
  const formulas = new Map(catalog.enhanceFormulas.map(entry => [entry.key, entry]));
  return {
    getSetting: dataKey => settings.get(dataKey),
    getEnhanceFormula: formulaKey => formulas.get(formulaKey),
  };
}

function parseSetting(
  input: unknown,
  path: string,
): { readonly key: string } & CompoundStatusSkillSetting {
  const setting = requireObject(input, path);
  requireOnlyKeys(setting, path, ['key', 'values', 'enhanceFormulaKey']);
  if (!Array.isArray(setting.values) || setting.values.length !== 4) {
    throw new Error(`${path}.values: expected four-element array`);
  }
  return {
    key: requireNonEmptyString(setting.key, `${path}.key`),
    values: setting.values.map((value, index) =>
      requireFiniteNumber(value, `${path}.values[${index}]`),
    ),
    enhanceFormulaKey: requireString(setting.enhanceFormulaKey, `${path}.enhanceFormulaKey`),
  };
}

function parseFormula(
  input: unknown,
  path: string,
): { readonly key: string } & InflictionEnhanceFormula {
  const formula = requireObject(input, path);
  requireOnlyKeys(formula, path, ['key', 'formulaType', 'paramA', 'paramB']);
  const key = requireNonEmptyString(formula.key, `${path}.key`);
  const kind = requireString(formula.formulaType, `${path}.formulaType`);
  const paramA = requireFiniteNumber(formula.paramA, `${path}.paramA`);
  const paramB = requireFiniteNumber(formula.paramB, `${path}.paramB`);
  switch (kind) {
    case 'none':
      return { key, kind };
    case 'linear':
      return { key, kind, paramA };
    case 'saturating':
      return { key, kind, paramA, paramB };
    default:
      throw new Error(`${path}.formulaType: unknown formula '${kind}'`);
  }
}

function requireFormulaReferences(
  data: SkillSettingCatalogDocument['data'],
  formulas: SkillSettingCatalogDocument['enhanceFormulas'],
): void {
  const formulaKeys = new Set(formulas.map(formula => formula.key));
  for (const setting of data) {
    if (setting.enhanceFormulaKey !== '' && !formulaKeys.has(setting.enhanceFormulaKey)) {
      throw new Error(
        `$.data: setting '${setting.key}' references missing formula ` +
          `'${setting.enhanceFormulaKey}'`,
      );
    }
  }
}

function requireUniqueKeys(entries: readonly { readonly key: string }[], path: string): void {
  const keys = new Set<string>();
  for (const entry of entries) {
    if (keys.has(entry.key)) throw new Error(`${path}: duplicate key '${entry.key}'`);
    keys.add(entry.key);
  }
}

function requireObject(input: unknown, path: string): Readonly<Record<string, unknown>> {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error(`${path}: expected object`);
  }
  return input as Readonly<Record<string, unknown>>;
}

function requireOnlyKeys(
  input: Readonly<Record<string, unknown>>,
  path: string,
  keys: readonly string[],
): void {
  const allowed = new Set(keys);
  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) throw new Error(`${path}: unknown property '${key}'`);
  }
}

function requireString(input: unknown, path: string): string {
  if (typeof input !== 'string') throw new Error(`${path}: expected string`);
  return input;
}

function requireNonEmptyString(input: unknown, path: string): string {
  const value = requireString(input, path);
  if (value.length === 0) throw new Error(`${path}: expected non-empty string`);
  return value;
}

function requireFiniteNumber(input: unknown, path: string): number {
  if (typeof input !== 'number' || !Number.isFinite(input)) {
    throw new Error(`${path}: expected finite number`);
  }
  return input;
}
