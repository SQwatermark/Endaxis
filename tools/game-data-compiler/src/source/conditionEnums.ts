import { requireNativeEnum } from './primitives.ts';

// Beyond.CompareType，常量证据见 combat-spec/docs/target-resolution.md。
const COMPARISONS = new Map([
  [0, 'LT'], [1, 'LE'], [2, 'GT'], [3, 'GE'], [4, 'Equals'],
] as const);

export function readCompareType(value: unknown, path: string) {
  return requireNativeEnum(value, COMPARISONS, path);
}
