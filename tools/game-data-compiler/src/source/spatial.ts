import {
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireNumber,
  requireRecord,
} from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

export type Vector3Source = readonly [number, number, number];
export type QuaternionSource = readonly [number, number, number, number];

export interface AdvancedDirectionSource {
  readonly directionType: string;
  readonly sourceMountPoint: string;
  readonly targetMountPoint: string;
  readonly customSourceAndTarget: boolean;
  readonly clampToXZ: boolean;
  readonly invertDirection: boolean;
  /** 仅部分原生实例序列化这两个字段，不能从 customSourceAndTarget 反推其存在性。 */
  readonly source: TargetReferenceSource | null;
  readonly target: TargetReferenceSource | null;
}

export function parseVector3Source(value: unknown, path: string): Vector3Source {
  const vector = requireRecord(value, path);
  requireExactFields(vector, new Set(['x', 'y', 'z']), path);
  return [
    requireNumber(vector.x, `${path}.x`),
    requireNumber(vector.y, `${path}.y`),
    requireNumber(vector.z, `${path}.z`),
  ];
}

export function parseQuaternionSource(value: unknown, path: string): QuaternionSource {
  const quaternion = requireRecord(value, path);
  requireExactFields(quaternion, new Set(['x', 'y', 'z', 'w']), path);
  return [
    requireNumber(quaternion.x, `${path}.x`),
    requireNumber(quaternion.y, `${path}.y`),
    requireNumber(quaternion.z, `${path}.z`),
    requireNumber(quaternion.w, `${path}.w`),
  ];
}

export function parseAdvancedDirectionSource(
  value: unknown,
  path: string,
): AdvancedDirectionSource {
  const direction = requireRecord(value, path);
  const hasSource = 'source' in direction;
  const hasTarget = 'target' in direction;
  if (hasSource !== hasTarget) {
    throw new Error(`${path}: source and target must be serialized together`);
  }
  const fields = new Set([
    'directionType',
    'sourceMountPoint',
    'targetMountPoint',
    'customSourceAndTarget',
    'clampToXZ',
    'invertDirection',
  ]);
  if (hasSource) {
    fields.add('source');
    fields.add('target');
  }
  requireExactFields(direction, fields, path);
  return {
    directionType: requireNonEmptyString(direction.directionType, `${path}.directionType`),
    sourceMountPoint: requireNonEmptyString(direction.sourceMountPoint, `${path}.sourceMountPoint`),
    targetMountPoint: requireNonEmptyString(direction.targetMountPoint, `${path}.targetMountPoint`),
    customSourceAndTarget: requireBoolean(
      direction.customSourceAndTarget,
      `${path}.customSourceAndTarget`,
    ),
    clampToXZ: requireBoolean(direction.clampToXZ, `${path}.clampToXZ`),
    invertDirection: requireBoolean(direction.invertDirection, `${path}.invertDirection`),
    source: hasSource ? parseTargetReferenceSource(direction.source, `${path}.source`) : null,
    target: hasTarget ? parseTargetReferenceSource(direction.target, `${path}.target`) : null,
  };
}
