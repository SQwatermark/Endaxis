import type { WeaponDefinition } from '../game-data/equipmentDefinition';
import type { WeaponInstanceDocument } from './schema';
import type { ValidationIssue } from './validation';

export type WeaponInstanceMigrationResult =
  | { ok: true; value: WeaponInstanceDocument; addedTraitKeys: readonly string[] }
  | { ok: false; issues: readonly ValidationIssue[] };

export interface WeaponTraitMigrationPlan {
  readonly key: string;
  readonly levelCount: number;
  readonly sourceKey?: string;
  readonly savedLevel?: number;
}

/**
 * 按两个确定版本中的稳定词条键迁移用户输入，而非按下标或修正数值猜身份。
 * 新增词条的等级必须由调用方显式决定；没有原始输入就不能声称恢复了用户构筑。
 */
export function migrateWeaponInstance(
  instance: WeaponInstanceDocument,
  source: WeaponDefinition,
  target: WeaponDefinition,
  addedTraitLevels: Readonly<Record<string, number>> = {},
  traitKeyAliases: Readonly<Record<string, string>> = {},
): WeaponInstanceMigrationResult {
  const plan = planWeaponInstanceMigration(instance, source, target, traitKeyAliases);
  if (!plan.ok) return plan;
  const issues: ValidationIssue[] = [];
  for (const key of Object.keys(addedTraitLevels)) {
    if (!plan.traits.some(trait => trait.key === key && trait.sourceKey === undefined)) {
      issues.push({
        path: 'traitLevels',
        message: `explicit new level is not for an added trait: '${key}'`,
      });
    }
  }
  const addedTraitKeys: string[] = [];
  const levels = plan.traits.map((trait, index) => {
    const level =
      trait.sourceKey === undefined
        ? Object.hasOwn(addedTraitLevels, trait.key)
          ? addedTraitLevels[trait.key]
          : undefined
        : trait.savedLevel;
    if (trait.sourceKey === undefined) addedTraitKeys.push(trait.key);
    if (level === undefined) {
      issues.push({
        path: `traitLevels[${index}]`,
        message: `added trait '${trait.key}' requires an explicit level`,
      });
    } else if (!Number.isInteger(level) || level < 1 || level > trait.levelCount) {
      issues.push({
        path: `traitLevels[${index}]`,
        message: `level ${level} is outside target trait '${trait.key}'`,
      });
    }
    return level!;
  });
  return issues.length > 0
    ? { ok: false, issues }
    : {
        ok: true,
        value: { ...instance, weaponSlug: target.slug, traitLevels: levels },
        addedTraitKeys,
      };
}

/** 预览和执行共用身份解析；缺少新增等级在预览中是待选择项，不是损坏存档。 */
export function planWeaponInstanceMigration(
  instance: WeaponInstanceDocument,
  source: WeaponDefinition,
  target: WeaponDefinition,
  traitKeyAliases: Readonly<Record<string, string>> = {},
):
  | { ok: true; traits: readonly WeaponTraitMigrationPlan[] }
  | { ok: false; issues: readonly ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  const issue = (path: string, message: string) => issues.push({ path, message });
  if (instance.weaponSlug !== source.slug) issue('weaponSlug', 'source weapon identity mismatch');
  if (source.weaponType !== target.weaponType) issue('weaponSlug', 'weapon type changed');
  for (const [label, definition] of [
    ['source', source],
    ['target', target],
  ] as const) {
    const keys = definition.traits.map(trait => trait.key);
    if (keys.some(key => key.length === 0) || new Set(keys).size !== keys.length) {
      issue('traitLevels', `${label} weapon has empty or duplicate trait keys`);
    }
    if (
      definition.traits.some(trait => !Number.isInteger(trait.levelCount) || trait.levelCount < 1)
    )
      issue('traitLevels', `${label} weapon has invalid trait level capacity`);
  }
  if (instance.traitLevels.length !== source.traits.length) {
    issue('traitLevels', 'saved trait count does not match source definition');
  }
  const mappedKey = (key: string) =>
    Object.hasOwn(traitKeyAliases, key) ? traitKeyAliases[key]! : key;
  const sourceIndex = new Map(source.traits.map((trait, index) => [mappedKey(trait.key), index]));
  const targetKeys = new Set(target.traits.map(trait => trait.key));
  if (sourceIndex.size !== source.traits.length)
    issue('traitLevels', 'trait aliases merge distinct saved inputs');
  for (const [key, nextKey] of Object.entries(traitKeyAliases)) {
    if (!source.traits.some(trait => trait.key === key) || !targetKeys.has(nextKey)) {
      issue('traitLevels', `unknown trait alias '${key}' -> '${nextKey}'`);
    }
  }
  source.traits.forEach((trait, index) => {
    const level = instance.traitLevels[index];
    if (!Number.isInteger(level) || level! < 1 || level! > trait.levelCount) {
      issue(`traitLevels[${index}]`, `invalid saved level for '${trait.key}'`);
    }
    if (!targetKeys.has(mappedKey(trait.key)))
      issue('traitLevels', `target removed trait '${trait.key}'`);
  });
  const traits = target.traits.map((trait, index): WeaponTraitMigrationPlan => {
    const previousIndex = sourceIndex.get(trait.key);
    const level = previousIndex === undefined ? undefined : instance.traitLevels[previousIndex];
    if (
      previousIndex !== undefined &&
      (!Number.isInteger(level) || level! < 1 || level! > trait.levelCount)
    ) {
      issue(`traitLevels[${index}]`, `level ${level} is outside target trait '${trait.key}'`);
    }
    return {
      key: trait.key,
      levelCount: trait.levelCount,
      ...(previousIndex === undefined
        ? {}
        : { sourceKey: source.traits[previousIndex]!.key, savedLevel: level! }),
    };
  });
  return issues.length > 0 ? { ok: false, issues } : { ok: true, traits };
}
