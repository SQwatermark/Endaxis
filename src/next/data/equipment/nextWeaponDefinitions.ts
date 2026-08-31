import { generatedWeaponDefinitions } from './generated-weapons/index.generated';
import { registerGeneratedWeaponDefinitions } from './generatedWeaponRegistration';
import { weaponPresentationSlugByAsset } from './weaponPresentationSlugs';

export const nextWeaponRegistration = registerGeneratedWeaponDefinitions(
  generatedWeaponDefinitions,
  weaponPresentationSlugByAsset,
);
if (nextWeaponRegistration.missingPresentationAssets.length > 0)
  throw new Error('generated weapon registration has unresolved identities');
export const nextWeaponDefinitions = nextWeaponRegistration.definitions;
