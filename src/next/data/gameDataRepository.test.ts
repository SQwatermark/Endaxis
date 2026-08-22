import { describe, expect, it } from 'vitest';
import {
  akekuri,
  arcane,
  arclight,
  camille,
  chenQianyu,
  daPan,
  ember,
  endministrator,
  estella,
  fluorite,
  gilberta,
  lastRite,
  laevatain,
  lifeng,
  mifu,
  perlica,
  pogranichnik,
  rossi,
  tangtang,
  yvonne,
  zhuangFangyi,
} from './operators';
import {
  sharedGearDefinitions,
  sharedGearSetDefinitions,
  sharedWeaponDefinitions,
} from './equipment';
import {
  createGameDataRepository,
  NEXT_GAME_DATA_REVISION,
  nextGameDataRepository,
} from './gameDataRepository';

describe('gameDataRepository', () => {
  it('exposes the explicit definition revision', () => {
    expect(nextGameDataRepository.revision).toBe(NEXT_GAME_DATA_REVISION);
    expect(NEXT_GAME_DATA_REVISION).not.toBe('');
  });

  it('indexes every explicitly registered Next operator', () => {
    expect(nextGameDataRepository.getOperators()).toEqual([
      perlica,
      arcane,
      zhuangFangyi,
      arclight,
      gilberta,
      lifeng,
      estella,
      daPan,
      ember,
      akekuri,
      fluorite,
      endministrator,
      lastRite,
      chenQianyu,
      rossi,
      camille,
      pogranichnik,
      tangtang,
      laevatain,
      mifu,
      yvonne,
    ]);
    expect(nextGameDataRepository.getOperator(perlica.slug)).toBe(perlica);
    expect(nextGameDataRepository.getOperator(arcane.slug)).toBe(arcane);
    expect(nextGameDataRepository.getOperator(zhuangFangyi.slug)).toBe(zhuangFangyi);
    expect(nextGameDataRepository.getOperator(arclight.slug)).toBe(arclight);
    expect(nextGameDataRepository.getOperator(gilberta.slug)).toBe(gilberta);
    expect(nextGameDataRepository.getOperator(lifeng.slug)).toBe(lifeng);
    expect(nextGameDataRepository.getOperator(estella.slug)).toBe(estella);
    expect(nextGameDataRepository.getOperator(daPan.slug)).toBe(daPan);
    expect(nextGameDataRepository.getOperator(ember.slug)).toBe(ember);
    expect(nextGameDataRepository.getOperator(akekuri.slug)).toBe(akekuri);
    expect(nextGameDataRepository.getOperator(fluorite.slug)).toBe(fluorite);
    expect(nextGameDataRepository.getOperator(endministrator.slug)).toBe(endministrator);
    expect(nextGameDataRepository.getOperator(lastRite.slug)).toBe(lastRite);
    expect(nextGameDataRepository.getOperator(chenQianyu.slug)).toBe(chenQianyu);
    expect(nextGameDataRepository.getOperator(rossi.slug)).toBe(rossi);
    expect(nextGameDataRepository.getOperator(camille.slug)).toBe(camille);
    expect(nextGameDataRepository.getOperator(tangtang.slug)).toBe(tangtang);
    expect(nextGameDataRepository.getOperator(laevatain.slug)).toBe(laevatain);
    expect(nextGameDataRepository.getOperator(mifu.slug)).toBe(mifu);
    expect(nextGameDataRepository.getOperator(yvonne.slug)).toBe(yvonne);
    expect(nextGameDataRepository.getOperator(pogranichnik.slug)).toBe(pogranichnik);
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

  it('indexes adapted enemy definitions without using the legacy store', () => {
    const enemy = nextGameDataRepository.getEnemy('eny-0125-fdcentur');

    expect(nextGameDataRepository.getEnemies()).toContain(enemy);
    expect(enemy).toMatchObject({
      id: 'eny-0125-fdcentur',
      gameId: 'eny_0125_fdcentur',
      rank: 'boss',
      defense: 100,
      superArmor: 30,
      finisherMultiplier: 1.75,
    });
    expect(enemy?.levelHp).toContainEqual({ level: 90, hp: 2476341 });
    expect(nextGameDataRepository.getEnemy('missing')).toBeNull();
  });

  it('keeps native rank independent from the legacy display tier', () => {
    expect(nextGameDataRepository.getEnemy('eny-0007-mimicw')).toMatchObject({
      gameId: 'eny_0007_mimicw',
      tier: 'advanced',
      rank: 'elite',
    });
  });

  it('rejects duplicate stable identities while building a index', () => {
    expect(() =>
      createGameDataRepository({ revision: 'fixture', operators: [perlica, perlica] }),
    ).toThrow("duplicate operator definition 'perlica'");
  });

  it('captures definitions instead of retaining the mutable input array', () => {
    const operators = [perlica];
    const repository = createGameDataRepository({ revision: 'fixture', operators });
    operators.push(arcane);

    expect(repository.getOperators()).toEqual([perlica]);
    expect(repository.getOperator(perlica.slug)).toBe(perlica);
    expect(repository.getOperator(arcane.slug)).toBeNull();
    expect(Object.isFrozen(repository)).toBe(true);
  });

  it('rejects an empty revision and duplicate enemy identities', () => {
    const enemy = nextGameDataRepository.getEnemy('eny-0125-fdcentur')!;

    expect(() => createGameDataRepository({ revision: '' })).toThrow(
      'game data revision must not be empty',
    );
    expect(() =>
      createGameDataRepository({ revision: 'fixture', enemies: [enemy, enemy] }),
    ).toThrow("duplicate enemy definition 'eny-0125-fdcentur'");
  });
});
