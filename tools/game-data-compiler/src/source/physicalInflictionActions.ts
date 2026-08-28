import {
  requireBoolean,
  requireExactFields,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';
import { parseAdvancedDirectionSource, type AdvancedDirectionSource } from './spatial.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

/** 原生枚举，不是正式输出协议；身份与数值见 combat-spec/docs/knockdown-action.md。 */
export type ControlledStateDeadOptionSource = 'AllValid' | 'OnlyAlive' | 'OnlyDead';
export type AbilityActionReturnTrueMethodSource =
  'Always' | 'BothSuccessAndInterrupted' | 'OnlySuccess' | 'OnlyInterrupted';

/** 击倒不是纯敌人动作：入口有破防门、状态 Buff 和独立返回策略，不归木桩表现动作。 */
export interface KnockDownActionSource {
  readonly kind: 'knockDown';
  readonly source: TargetReferenceSource;
  readonly target: TargetReferenceSource;
  readonly forceKnockDown: boolean;
  readonly duration: ScalarSource;
  readonly faceDirection: AdvancedDirectionSource;
  readonly immobilizedTime: number;
  readonly isExtra: boolean;
  readonly deadOption: ControlledStateDeadOptionSource;
  readonly returnTrueWhen: AbilityActionReturnTrueMethodSource;
}

export function parseKnockDownActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): KnockDownActionSource {
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
      'targetSettings',
      'forceKnockDown',
      'duration',
      'faceDirection',
      'immobilizedTime',
      'isExtra',
      'deadOption',
      'returnTrueWhen',
    ]),
    path,
  );
  const deadOption = requireString(action.deadOption, `${path}.deadOption`);
  if (deadOption !== 'AllValid' && deadOption !== 'OnlyAlive' && deadOption !== 'OnlyDead') {
    throw new Error(`${path}.deadOption: unsupported ControlledStateDeadOption ${deadOption}`);
  }
  const returnTrueWhen = requireString(action.returnTrueWhen, `${path}.returnTrueWhen`);
  if (
    returnTrueWhen !== 'Always' &&
    returnTrueWhen !== 'BothSuccessAndInterrupted' &&
    returnTrueWhen !== 'OnlySuccess' &&
    returnTrueWhen !== 'OnlyInterrupted'
  ) {
    throw new Error(`${path}.returnTrueWhen: unsupported ReturnTrueMethod ${returnTrueWhen}`);
  }
  return {
    kind: 'knockDown',
    source: parseTargetReferenceSource(action.source, `${path}.source`),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    forceKnockDown: requireBoolean(action.forceKnockDown, `${path}.forceKnockDown`),
    duration: parseScalarSource(action.duration, `${path}.duration`, inheritedBlackboard),
    faceDirection: parseAdvancedDirectionSource(action.faceDirection, `${path}.faceDirection`),
    immobilizedTime: requireNumber(action.immobilizedTime, `${path}.immobilizedTime`),
    isExtra: requireBoolean(action.isExtra, `${path}.isExtra`),
    deadOption,
    returnTrueWhen,
  };
}
