import { describe, expect, it } from 'vitest';
import { arcane, perlica, zhuangFangyi } from './operators';
import { createGameDataRepository, nextGameDataRepository } from './gameDataCatalog';

describe('gameDataCatalog', () => {
  it('indexes every explicitly registered Next operator', () => {
    expect(nextGameDataRepository.getOperators()).toEqual([perlica, arcane, zhuangFangyi]);
    expect(nextGameDataRepository.getOperator(perlica.slug)).toBe(perlica);
    expect(nextGameDataRepository.getOperator(arcane.slug)).toBe(arcane);
    expect(nextGameDataRepository.getOperator(zhuangFangyi.slug)).toBe(zhuangFangyi);
    expect(nextGameDataRepository.getOperator('missing')).toBeNull();
  });

  it('keeps not-yet-migrated catalog families explicitly empty', () => {
    expect(nextGameDataRepository.getWeapons()).toEqual([]);
    expect(nextGameDataRepository.getGears()).toEqual([]);
    expect(nextGameDataRepository.getGearSets()).toEqual([]);
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
