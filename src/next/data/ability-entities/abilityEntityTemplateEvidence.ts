import evidence from './ability-entity-templates-1.4.4.json';
import { gameplayTagId } from '../../core/combat/tags/gameplayTags';
import type { LogicalAbilityEntityTemplate } from '../../core/game-data/logicalAbilityEntity';

type EvidenceTemplate = {
  readonly gameId: string;
  readonly bornTagIds: readonly number[];
  readonly lifeTypeNativeValue: number;
  readonly durationSeconds: number;
  readonly maxStackingCount: number;
};

function finiteNonNegative(value: number, path: string): number {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${path} must be non-negative`);
  return value;
}

function adaptTemplate(value: EvidenceTemplate, key: string): LogicalAbilityEntityTemplate {
  if (value.gameId !== key)
    throw new Error(`AbilityEntity evidence identity mismatch for '${key}'`);
  const nativeValues = evidence.lifeTypeNativeValues;
  const lifetime =
    value.lifeTypeNativeValue === nativeValues.limited
      ? ({
          kind: 'limited',
          durationSeconds: finiteNonNegative(value.durationSeconds, `${key}.durationSeconds`),
        } as const)
      : value.lifeTypeNativeValue === nativeValues.infinite
        ? ({ kind: 'infinite' } as const)
        : (() => {
            throw new Error(
              `AbilityEntity '${key}' has unknown LifeType ${value.lifeTypeNativeValue}`,
            );
          })();
  return Object.freeze({
    id: key,
    bornTagIds: Object.freeze(value.bornTagIds.map(gameplayTagId)),
    lifetime,
    maxStackingCount: value.maxStackingCount,
  });
}

if (evidence.format !== 'EndaxisLogicalAbilityEntityTemplateEvidence') {
  throw new Error(`unsupported AbilityEntity evidence format '${evidence.format}'`);
}
if (evidence.spatialModel !== 'zero-distance-all-instances-single-enemy') {
  throw new Error(`unsupported AbilityEntity spatial model '${evidence.spatialModel}'`);
}

/** 当前 1.4.4 VFS 证据中可供模拟器直接使用的全部逻辑能力实体模板。 */
export const logicalAbilityEntityTemplates: readonly LogicalAbilityEntityTemplate[] = Object.freeze(
  Object.entries(evidence.templates)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => adaptTemplate(value, key)),
);

/** AKEDB 有引用但当前 VFS manifest 无模板的显式审计边界。 */
export const unresolvedAbilityEntityTemplateReferences = Object.freeze(
  evidence.unresolvedReferences,
);
