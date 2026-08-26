import type { WeaponDefinition } from '../core/game-data/equipmentDefinition';
import { validateProjectWithGameData } from '../core/project/definitionValidation';
import { getProjectDefinitionLibrary } from '../core/project/projectDefinitionLibrary';
import type { EndaxisProjectDocument } from '../core/project/schema';
import { serializeProjectDocument } from '../core/project/serialization';
import {
  planWeaponInstanceMigration,
  type WeaponTraitMigrationPlan,
} from '../core/project/weaponInstanceMigration';
import {
  createWeaponGameDataMigrator,
  type WeaponGameDataMigrationOptions,
  type WeaponInstanceTraitLevelSelection,
} from './weaponGameDataMigration';

type ReviewOptions = Omit<
  WeaponGameDataMigrationOptions,
  'addedTraitLevels' | 'instanceAddedTraitLevels'
>;

export interface WeaponMigrationPreview {
  readonly fromRevision: string;
  readonly toRevision: string;
  readonly customInstanceCount: number;
  readonly instances: readonly {
    readonly scenarioId: string;
    readonly trackId: string;
    readonly sourceSlug: string;
    readonly targetSlug: string;
    readonly traits: readonly WeaponTraitMigrationPlan[];
  }[];
}

/** 原项目仍可单独打开；附带的定义快照只保存本项目引用的旧内置武器，不冒充整库历史快照。 */
export interface WeaponMigrationBackup {
  readonly format: 'endaxis-weapon-migration-backup-v1';
  readonly projectJson: string;
  readonly sourceRevision: string;
  readonly targetRevision: string;
  readonly sourceWeaponDefinitions: readonly WeaponDefinition[];
}

export type WeaponMigrationConfirmationResult =
  | { ok: true; value: EndaxisProjectDocument; warnings: readonly string[] }
  | {
      ok: false;
      kind:
        | 'not-confirmed'
        | 'busy'
        | 'already-completed'
        | 'stale'
        | 'invalid-choices'
        | 'backup-failed';
      errors: readonly string[];
    };

export interface WeaponMigrationReview {
  readonly preview: WeaponMigrationPreview;
  confirm(options: {
    readonly confirmed: boolean;
    readonly choices: readonly WeaponInstanceTraitLevelSelection[];
    /** 备份前后都读取当前文档；等待备份时继续编辑会使本次预览过期。 */
    readonly getCurrentProject: () => EndaxisProjectDocument;
    /** 由 UI/存储端确认写入成功；本用例不下载、不写磁盘，也不修改当前编辑会话。 */
    readonly persistBackup: (
      backup: WeaponMigrationBackup,
    ) => Promise<{ ok: true } | { ok: false; error: string }>;
  }): Promise<WeaponMigrationConfirmationResult>;
}

/**
 * 一次预览对应一个不可变项目/武器定义快照。只有显式确认、全部选择合法、备份成功且输入未变化，
 * 才返回可打开的新项目。源项目及自定义模板始终不改，默认库的正式版本发布是另一个边界。
 */
export function prepareWeaponMigrationReview(
  project: EndaxisProjectDocument,
  options: ReviewOptions,
): { ok: true; review: WeaponMigrationReview } | { ok: false; errors: readonly string[] } {
  const { source, target } = options;
  if (source.revision === target.revision || project.gameDataRevision !== source.revision)
    return {
      ok: false,
      errors: ['weapon migration requires the exact source and a distinct target revision'],
    };
  const validation = validateProjectWithGameData(project, source);
  if (!validation.ok)
    return { ok: false, errors: validation.issues.map(issue => `${issue.path}: ${issue.message}`) };
  const original = structuredClone(validation.value);
  const projectJson = serializeProjectDocument(original, true);
  const aliases = structuredClone(options.aliases);
  const traitKeyAliases = structuredClone(options.traitKeyAliases ?? {});
  const oldWeapons = new Map<string, WeaponDefinition>();
  const nextWeapons = new Map<string, WeaponDefinition>();
  const instances: WeaponMigrationPreview['instances'][number][] = [];
  let customInstanceCount = 0;
  const errors: string[] = [];
  const library = getProjectDefinitionLibrary(original);
  for (const scenario of original.scenarios) {
    for (const track of scenario.tracks) {
      if (!track?.weapon) continue;
      const instance = track.weapon;
      if (Object.hasOwn(library.weapons, instance.weaponSlug)) {
        customInstanceCount++;
        continue;
      }
      const nextSlug = Object.hasOwn(aliases, instance.weaponSlug)
        ? aliases[instance.weaponSlug]!
        : instance.weaponSlug;
      const oldDefinition = source.getWeapon(instance.weaponSlug);
      const nextDefinition = target.getWeapon(nextSlug);
      const path = `${scenario.id}/${track.id}`;
      if (!oldDefinition || !nextDefinition) {
        errors.push(`${path}: missing migration weapon definition`);
        continue;
      }
      oldWeapons.set(instance.weaponSlug, structuredClone(oldDefinition));
      nextWeapons.set(nextSlug, structuredClone(nextDefinition));
      const plan = planWeaponInstanceMigration(
        instance,
        oldDefinition,
        nextDefinition,
        Object.hasOwn(traitKeyAliases, nextSlug) ? traitKeyAliases[nextSlug] : undefined,
      );
      if (!plan.ok) {
        errors.push(...plan.issues.map(issue => `${path}.${issue.path}: ${issue.message}`));
        continue;
      }
      instances.push({
        scenarioId: scenario.id,
        trackId: track.id,
        sourceSlug: instance.weaponSlug,
        targetSlug: nextSlug,
        traits: plan.traits,
      });
    }
  }
  if (errors.length) return { ok: false, errors };
  const preview: WeaponMigrationPreview = {
    fromRevision: source.revision,
    toRevision: target.revision,
    customInstanceCount,
    instances,
  };
  const backup: WeaponMigrationBackup = {
    format: 'endaxis-weapon-migration-backup-v1',
    projectJson,
    sourceRevision: source.revision,
    targetRevision: target.revision,
    sourceWeaponDefinitions: [...oldWeapons.values()],
  };
  const dataIsCurrent = () =>
    source.revision === preview.fromRevision &&
    target.revision === preview.toRevision &&
    [...oldWeapons].every(
      ([slug, definition]) => JSON.stringify(source.getWeapon(slug)) === JSON.stringify(definition),
    ) &&
    [...nextWeapons].every(
      ([slug, definition]) => JSON.stringify(target.getWeapon(slug)) === JSON.stringify(definition),
    );
  let busy = false;
  let completed = false;
  return {
    ok: true,
    review: {
      // 外部修改预览对象不能改变真正执行的迁移或备份。
      get preview() {
        return structuredClone(preview);
      },
      async confirm(input) {
        const failure = (
          kind: Exclude<WeaponMigrationConfirmationResult, { ok: true }>['kind'],
          ...errors: string[]
        ): WeaponMigrationConfirmationResult => ({ ok: false, kind, errors });
        if (!input.confirmed)
          return failure('not-confirmed', 'migration requires explicit confirmation');
        if (completed)
          return failure('already-completed', 'migration review has already completed');
        if (busy) return failure('busy', 'migration backup is in progress');
        const isCurrent = () => {
          try {
            return (
              serializeProjectDocument(input.getCurrentProject(), true) === projectJson &&
              dataIsCurrent()
            );
          } catch {
            return false;
          }
        };
        if (!isCurrent())
          return failure('stale', 'project or weapon definitions changed; prepare a new review');
        let migrated;
        try {
          migrated = createWeaponGameDataMigrator({
            source: { ...source, getWeapon: slug => oldWeapons.get(slug) ?? null },
            target: { ...target, getWeapon: slug => nextWeapons.get(slug) ?? null },
            aliases,
            traitKeyAliases,
            instanceAddedTraitLevels: input.choices,
          }).migrate(original);
        } catch (error) {
          return failure('invalid-choices', error instanceof Error ? error.message : String(error));
        }
        if (!migrated.ok) return failure('invalid-choices', ...migrated.errors);
        busy = true;
        try {
          const persisted = await input.persistBackup(structuredClone(backup));
          if (!persisted.ok) return failure('backup-failed', persisted.error);
          if (!isCurrent())
            return failure(
              'stale',
              'project or weapon definitions changed during backup; original backup retained',
            );
          const finalValidation = validateProjectWithGameData(migrated.value, target);
          if (!finalValidation.ok)
            return failure(
              'stale',
              ...finalValidation.issues.map(issue => `${issue.path}: ${issue.message}`),
            );
          completed = true;
          return migrated;
        } catch (error) {
          return failure('backup-failed', error instanceof Error ? error.message : String(error));
        } finally {
          busy = false;
        }
      },
    },
  };
}
