import type { GameDataRepository } from '../core/game-data/gameDataRepository';
import { validateProjectWithGameData } from '../core/project/definitionValidation';
import { getProjectDefinitionLibrary } from '../core/project/projectDefinitionLibrary';
import { migrateWeaponInstance } from '../core/project/weaponInstanceMigration';
import type { GameDataRevisionMigrator } from './openProject';

export interface WeaponGameDataMigrationOptions {
  readonly source: GameDataRepository;
  readonly target: GameDataRepository;
  /** 已审计的武器身份映射，不根据 slug 拼写推断。 */
  readonly aliases: Readonly<Record<string, string>>;
  /** 经审计的旧词条键 -> 新词条键；同名以外的身份绝不从数组位置推断。 */
  readonly traitKeyAliases?: Readonly<Record<string, Readonly<Record<string, string>>>>;
  /** 以目标武器 ID / 新增词条键索引的显式迁移选择，未提供时失败关闭。 */
  readonly addedTraitLevels?: Readonly<Record<string, Readonly<Record<string, number>>>>;
}

/**
 * 接入既有显式版本迁移端口；只迁移内置武器实例，不替换项目模板或改写技能块。
 * 任一轨道失败都不返回半成品，不修改输入；新版本号只在全部引用校验后写入结果。
 */
export function createWeaponGameDataMigrator(
  options: WeaponGameDataMigrationOptions,
): GameDataRevisionMigrator {
  const { source, target } = options;
  if (source.revision === target.revision)
    throw new Error('weapon migration requires distinct revisions');
  const aliases = { ...options.aliases };
  const addedLevels = structuredClone(options.addedTraitLevels ?? {});
  const traitAliases = structuredClone(options.traitKeyAliases ?? {});
  return {
    fromRevision: source.revision,
    toRevision: target.revision,
    migrate(project) {
      if (project.gameDataRevision !== source.revision) {
        return { ok: false, errors: ['project does not match weapon migration source revision'] };
      }
      const original = validateProjectWithGameData(project, source);
      if (!original.ok) {
        return {
          ok: false,
          errors: original.issues.map(issue => `${issue.path}: ${issue.message}`),
        };
      }
      const value = structuredClone(original.value);
      const library = getProjectDefinitionLibrary(value);
      const errors: string[] = [];
      const warnings: string[] = [];
      value.scenarios.forEach((scenario, scenarioIndex) => {
        scenario.tracks.forEach((track, trackIndex) => {
          const instance = track?.weapon;
          if (!instance || Object.hasOwn(library.weapons, instance.weaponSlug)) return;
          const path = `$.scenarios[${scenarioIndex}].tracks[${trackIndex}].weapon`;
          const nextSlug = Object.hasOwn(aliases, instance.weaponSlug)
            ? aliases[instance.weaponSlug]!
            : instance.weaponSlug;
          const oldDefinition = source.getWeapon(instance.weaponSlug);
          const nextDefinition = target.getWeapon(nextSlug);
          if (!oldDefinition || !nextDefinition) {
            errors.push(
              `${path}.weaponSlug: missing migration definition for '${instance.weaponSlug}' -> '${nextSlug}'`,
            );
            return;
          }
          const result = migrateWeaponInstance(
            instance,
            oldDefinition,
            nextDefinition,
            Object.hasOwn(addedLevels, nextSlug) ? addedLevels[nextSlug] : undefined,
            Object.hasOwn(traitAliases, nextSlug) ? traitAliases[nextSlug] : undefined,
          );
          if (!result.ok) {
            errors.push(...result.issues.map(issue => `${path}.${issue.path}: ${issue.message}`));
            return;
          }
          track!.weapon = result.value;
          for (const key of result.addedTraitKeys) {
            warnings.push(
              `${path}: 新词条 '${key}' 使用显式选择的等级 ${addedLevels[nextSlug]![key]}，非原存档恢复值`,
            );
          }
        });
      });
      if (errors.length > 0) return { ok: false, errors };
      value.gameDataRevision = target.revision;
      const validated = validateProjectWithGameData(value, target);
      return validated.ok
        ? { ok: true, value, warnings }
        : {
            ok: false,
            errors: validated.issues.map(issue => `${issue.path}: ${issue.message}`),
          };
    },
  };
}
