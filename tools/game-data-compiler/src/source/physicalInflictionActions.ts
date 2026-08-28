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

interface PhysicalInflictionActionBaseSource {
  readonly attacker: TargetReferenceSource;
  readonly target: TargetReferenceSource;
  readonly blowOffDistance: ScalarSource;
  readonly distanceRandomRange: ScalarSource;
  readonly overwriteHeight: boolean;
  readonly blowOffHeight: ScalarSource;
  readonly direction: AdvancedDirectionSource;
  readonly totalTime: ScalarSource;
  readonly isExtra: boolean;
  readonly deadOption: ControlledStateDeadOptionSource;
  readonly immobilizedTime: number;
}

export interface FractureActionSource extends PhysicalInflictionActionBaseSource {
  readonly kind: 'fracture';
}

export interface CrushActionSource extends PhysicalInflictionActionBaseSource {
  readonly kind: 'crush';
  readonly damageMultiplier: ScalarSource;
  readonly ignoreHitEffect: boolean;
}

export type PhysicalInflictionActionSource = FractureActionSource | CrushActionSource;

export function parsePhysicalInflictionActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  kind: PhysicalInflictionActionSource['kind'],
): PhysicalInflictionActionSource {
  const action = requireRecord(value, path);
  const fields = new Set([
    '$type',
    'isEnable',
    'priorityLevel',
    'priorityOffset',
    'serverActionIndex',
    'attackerTargetSettings',
    'targetSettings',
    'blowOffDistance',
    'distanceRandomRange',
    'overwriteHeight',
    'blowOffHeight',
    'directionSettings',
    'totalTime',
    'isExtra',
    'deadOption',
    'immobilizedTime',
  ]);
  if (kind === 'crush') {
    fields.add('damageMultiplier');
    fields.add('ignoreHitEffect');
  }
  requireExactFields(action, fields, path);
  const deadOption = requireString(action.deadOption, `${path}.deadOption`);
  if (deadOption !== 'AllValid' && deadOption !== 'OnlyAlive' && deadOption !== 'OnlyDead')
    throw new Error(`${path}.deadOption: unsupported ControlledStateDeadOption ${deadOption}`);
  const base: PhysicalInflictionActionBaseSource = {
    attacker: parseTargetReferenceSource(
      action.attackerTargetSettings,
      `${path}.attackerTargetSettings`,
    ),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    blowOffDistance: parseScalarSource(
      action.blowOffDistance,
      `${path}.blowOffDistance`,
      inheritedBlackboard,
    ),
    distanceRandomRange: parseScalarSource(
      action.distanceRandomRange,
      `${path}.distanceRandomRange`,
      inheritedBlackboard,
    ),
    overwriteHeight: requireBoolean(action.overwriteHeight, `${path}.overwriteHeight`),
    blowOffHeight: parseScalarSource(
      action.blowOffHeight,
      `${path}.blowOffHeight`,
      inheritedBlackboard,
    ),
    direction: parseAdvancedDirectionSource(action.directionSettings, `${path}.directionSettings`),
    totalTime: parseScalarSource(action.totalTime, `${path}.totalTime`, inheritedBlackboard),
    isExtra: requireBoolean(action.isExtra, `${path}.isExtra`),
    deadOption,
    immobilizedTime: requireNumber(action.immobilizedTime, `${path}.immobilizedTime`),
  };
  return kind === 'fracture'
    ? { kind, ...base }
    : {
        kind,
        ...base,
        damageMultiplier: parseScalarSource(
          action.damageMultiplier,
          `${path}.damageMultiplier`,
          inheritedBlackboard,
        ),
        ignoreHitEffect: requireBoolean(action.ignoreHitEffect, `${path}.ignoreHitEffect`),
      };
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
