import type { EndaxisProjectDocument } from '../core/project/schema';
import { nextGameDataRepository, weaponV1MigrationSource } from '../data/gameDataRepository';
import {
  nextWeaponRegistration,
  weaponV1TraitKeyAliases,
} from '../data/equipment/nextWeaponDefinitions';
import { prepareWeaponMigrationReview } from './weaponMigrationReview';

/** 只提供已经发布的精确迁移边；不将未知历史版本当成 v1。 */
export function prepareDefaultWeaponMigration(project: EndaxisProjectDocument) {
  return prepareWeaponMigrationReview(project, {
    source: weaponV1MigrationSource,
    target: nextGameDataRepository,
    aliases: nextWeaponRegistration.aliases,
    traitKeyAliases: weaponV1TraitKeyAliases,
  });
}
