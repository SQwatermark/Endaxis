import {
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

export type ElementalInflictionTypeSource = 'Fire' | 'Pulse' | 'Cryst' | 'Natural';

export interface ElementalInflictionActionSource {
  readonly kind: 'elementalInfliction';
  readonly source: TargetReferenceSource;
  readonly target: TargetReferenceSource;
  readonly element: ElementalInflictionTypeSource;
  readonly isExtra: boolean;
}

/**
 * 与 combat-spec SpellInflictionDataAdapter 同构的严格来源切片。动作会进入元素附着生命周期，
 * 不能像表现或空间动作一样省略。
 */
export function parseElementalInflictionActionSource(
  value: unknown,
  path: string,
): ElementalInflictionActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'source',
      'target',
      'inflictionType',
      'isExtra',
    ]),
    path,
  );
  const element = requireNonEmptyString(action.inflictionType, `${path}.inflictionType`);
  if (!['Fire', 'Pulse', 'Cryst', 'Natural'].includes(element))
    throw new Error(
      `${path}.inflictionType: unsupported elemental infliction ${JSON.stringify(element)}`,
    );
  return {
    kind: 'elementalInfliction',
    source: parseTargetReferenceSource(action.source, `${path}.source`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    element: element as ElementalInflictionTypeSource,
    isExtra: requireBoolean(action.isExtra, `${path}.isExtra`),
  };
}
