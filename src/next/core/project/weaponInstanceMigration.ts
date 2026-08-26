import type { WeaponDefinition } from '../game-data/equipmentDefinition';
import type { WeaponInstanceDocument } from './schema';
import type { ValidationIssue } from './validation';

export type WeaponInstanceMigrationResult =
  | { ok: true; value: WeaponInstanceDocument; addedTraitKeys: readonly string[] }
  | { ok: false; issues: readonly ValidationIssue[] };

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
  for (const key of Object.keys(addedTraitLevels)) {
    if (!targetKeys.has(key) || sourceIndex.has(key)) {
      issue('traitLevels', `explicit new level is not for an added trait: '${key}'`);
    }
  }
  const addedTraitKeys: string[] = [];
  const levels = target.traits.map((trait, index) => {
    const previousIndex = sourceIndex.get(trait.key);
    const level =
      previousIndex === undefined
        ? Object.hasOwn(addedTraitLevels, trait.key)
          ? addedTraitLevels[trait.key]
          : undefined
        : instance.traitLevels[previousIndex];
    if (previousIndex === undefined) addedTraitKeys.push(trait.key);
    if (level === undefined) {
      issue(`traitLevels[${index}]`, `added trait '${trait.key}' requires an explicit level`);
    } else if (!Number.isInteger(level) || level < 1 || level > trait.levelCount) {
      issue(`traitLevels[${index}]`, `level ${level} is outside target trait '${trait.key}'`);
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
