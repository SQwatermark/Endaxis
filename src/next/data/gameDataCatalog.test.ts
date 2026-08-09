import { describe, expect, it } from 'vitest';
import { arcane, perlica, zhuangFangyi } from './operators';
import {
  sharedGearDefinitions,
  sharedGearSetDefinitions,
  sharedWeaponDefinitions,
} from './equipment';
import { createGameDataRepository, nextGameDataRepository } from './gameDataCatalog';

describe('gameDataCatalog', () => {
  it('indexes every explicitly registered Next operator', () => {
    expect(nextGameDataRepository.getOperators()).toEqual([perlica, arcane, zhuangFangyi]);
    expect(nextGameDataRepository.getOperator(perlica.slug)).toBe(perlica);
    expect(nextGameDataRepository.getOperator(arcane.slug)).toBe(arcane);
    expect(nextGameDataRepository.getOperator(zhuangFangyi.slug)).toBe(zhuangFangyi);
    expect(nextGameDataRepository.getOperator('missing')).toBeNull();
  });

  it('registers complete and explicitly marked partial equipment definitions', () => {
    expect(nextGameDataRepository.getWeapons()).toEqual(sharedWeaponDefinitions);
    expect(nextGameDataRepository.getGears()).toEqual(sharedGearDefinitions);
    expect(nextGameDataRepository.getGearSets()).toEqual(sharedGearSetDefinitions);
    expect(nextGameDataRepository.getWeapon('tarr-11')).not.toBeNull();
    expect(nextGameDataRepository.getGear('xiranflow-light-armor')).not.toBeNull();
    expect(nextGameDataRepository.getGearSet('aic-fieldwork')).not.toBeNull();
    expect(nextGameDataRepository.getWeapon('lone-barge')).not.toBeNull();
    expect(nextGameDataRepository.getGearSet('xiranflow')).not.toBeNull();
    expect(nextGameDataRepository.getWeapon('missing')).toBeNull();
    expect(nextGameDataRepository.getGear('missing')).toBeNull();
    expect(nextGameDataRepository.getGearSet('missing')).toBeNull();
    expect(nextGameDataRepository.getMechanic('missing')).toBeNull();
  });

  it('rejects duplicate stable identities while building a catalog', () => {
    expect(() => createGameDataRepository({ operators: [perlica, perlica] })).toThrow(
      "duplicate operator definition 'perlica'",
    );
  });

  it('captures definitions instead of retaining the mutable input array', () => {
    const operators = [perlica];
    const repository = createGameDataRepository({ operators });
    operators.push(arcane);

    expect(repository.getOperators()).toEqual([perlica]);
    expect(repository.getOperator(perlica.slug)).toBe(perlica);
    expect(repository.getOperator(arcane.slug)).toBeNull();
    expect(Object.isFrozen(repository)).toBe(true);
  });
});
