import type { EndaxisProjectDocument } from '../core/project/schema';
import {
  nextGameDataRepository,
  weaponV1MigrationSource,
  weaponV2R1MigrationSource,
} from '../data/gameDataRepository';
import {
  nextWeaponRegistration,
  weaponV1TraitKeyAliases,
} from '../data/equipment/nextWeaponDefinitions';
import { prepareWeaponMigrationReview } from './weaponMigrationReview';

/** 只提供已经发布的精确迁移边；不将未知历史版本当成 v1。 */
export function prepareDefaultWeaponMigration(project: EndaxisProjectDocument) {
  if (project.gameDataRevision === weaponV2R1MigrationSource.revision)
    return prepareWeaponMigrationReview(project, {
      source: weaponV2R1MigrationSource,
      target: nextGameDataRepository,
      aliases: {},
    });
  return prepareWeaponMigrationReview(project, {
    source: weaponV1MigrationSource,
    target: nextGameDataRepository,
    aliases: nextWeaponRegistration.aliases,
    traitKeyAliases: weaponV1TraitKeyAliases,
  });
}

export function canMigrateWeaponRevision(revision: string): boolean {
  return (
    revision === weaponV1MigrationSource.revision || revision === weaponV2R1MigrationSource.revision
  );
}
