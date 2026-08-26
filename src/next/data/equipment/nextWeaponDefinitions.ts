import { generatedWeaponDefinitions } from './generated-weapons/index.generated';
import { registerGeneratedWeaponDefinitions } from './generatedWeaponRegistration';
import { legacyWeaponDefinitions } from '../revisions/weapons-v1';

export const nextWeaponRegistration = registerGeneratedWeaponDefinitions(
  generatedWeaponDefinitions,
  legacyWeaponDefinitions,
);
if (nextWeaponRegistration.issues.some(issue => issue.code !== 'legacyTraitLayoutMismatch'))
  throw new Error('generated weapon registration has unresolved identities');
export const nextWeaponDefinitions = nextWeaponRegistration.definitions;

/** 已审计的旧第二条攻击词条改键；产品迁移策略，不进入战斗逻辑。 */
export const weaponV1TraitKeyAliases: Readonly<Record<string, Readonly<Record<string, string>>>> =
  Object.freeze(
    Object.fromEntries(
      ['jiminy-12', 'darhoff-7', 'peco-5', 'opero-77', 'tarr-11'].map(slug => {
        const target = nextWeaponRegistration.aliases[slug];
        if (!target) throw new Error(`missing weapon migration identity '${slug}'`);
        return [target, Object.freeze({ skill3: 'skill2' })];
      }),
    ),
  );
