import type { ActionBlackboardValue } from '../runtime/actionBlackboard';
import type {
  CompoundStatusFactoryEntry,
  CompoundStatusFactoryScalar,
} from './compoundStatusFactoryCatalog';

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

export interface CompoundStatusFactoryResult {
  readonly buffId: string;
  readonly blackboardValues: Readonly<Record<string, ActionBlackboardValue>>;
}

/** Reproduces ReadSkillSettingData followed by the factory's CreateBuffAction. */
export function executeCompoundStatusFactory(
  factory: CompoundStatusFactoryEntry,
  inputBlackboard: Readonly<Record<string, ActionBlackboardValue>>,
  sourceInflictionEnhance: number,
  settings: CompoundStatusSkillSettingSource,
): CompoundStatusFactoryResult {
  const blackboard: Record<string, ActionBlackboardValue> = {
    ...factory.blackboard,
    ...inputBlackboard,
  };

  for (const lookup of factory.skillSettingLookups) {
    const column = roundToEvenFloat32(resolveScalar(lookup.column, blackboard)) - 1;
    const setting = settings.getSetting(lookup.dataKey);
    if (setting === undefined || column < 0 || column >= setting.values.length) continue;

    let value = Math.fround(setting.values[column]!);
    if (setting.enhanceFormulaKey.length !== 0) {
      const formula = settings.getEnhanceFormula(setting.enhanceFormulaKey);
      if (formula !== undefined) {
        value = Math.fround(value * resolveEnhanceFactor(formula, sourceInflictionEnhance));
      }
    }
    blackboard[lookup.storeKey] = value;
  }

  const output: Record<string, ActionBlackboardValue> = {};
  for (const assignment of factory.createdBuff.blackboardAssignments) {
    if (!(assignment.inputKey in blackboard)) {
      throw new Error(
        `compound-status factory '${factory.id}' is missing Blackboard key ` +
          `'${assignment.inputKey}'`,
      );
    }
    output[assignment.targetKey] = blackboard[assignment.inputKey]!;
  }
  return { buffId: factory.createdBuff.buffId, blackboardValues: output };
}

function resolveScalar(
  scalar: CompoundStatusFactoryScalar,
  blackboard: Readonly<Record<string, ActionBlackboardValue>>,
): number {
  if (typeof scalar === 'number') return scalar;
  const value = blackboard[scalar.blackboardKey];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Blackboard key '${scalar.blackboardKey}' is not a finite number`);
  }
  return value;
}

function resolveEnhanceFactor(
  formula: InflictionEnhanceFormula,
  sourceInflictionEnhance: number,
): number {
  switch (formula.kind) {
    case 'none':
      return 1;
    case 'linear':
      return Math.fround(formula.paramA * sourceInflictionEnhance + 1);
    case 'saturating':
      return Math.fround(
        (formula.paramA * sourceInflictionEnhance) / (formula.paramB + sourceInflictionEnhance) + 1,
      );
  }
}

function roundToEvenFloat32(value: number): number {
  const floatValue = Math.fround(value);
  const floor = Math.floor(floatValue);
  const fraction = floatValue - floor;
  if (fraction < 0.5) return floor;
  if (fraction > 0.5) return floor + 1;
  return floor % 2 === 0 ? floor : floor + 1;
}
