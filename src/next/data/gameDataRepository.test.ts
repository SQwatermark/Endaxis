import { describe, expect, it } from 'vitest';
import {
  alesh,
  antal,
  akekuri,
  ardelia,
  avywenna,
  catcher,
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
  liino,
  mifu,
  perlica,
  pogranichnik,
  rossi,
  snowshine,
  tangtang,
  wulfgard,
  xaihi,
  yvonne,
  zhuangFangyi,
} from './operators';
import {
  nextGearDefinitionRegistration,
  nextGearDefinitions,
  sharedGearDefinitions,
  sharedGearSetDefinitions,
} from './equipment';
import {
  createGameDataRepository,
  NEXT_GAME_DATA_REVISION,
  nextGameDataRepository,
} from './gameDataRepository';
import {
  nextWeaponDefinitions,
  nextWeaponRegistration,
} from './equipment/nextWeaponDefinitions';

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
      liino,
      mifu,
      yvonne,
      snowshine,
      wulfgard,
      antal,
      alesh,
      xaihi,
      avywenna,
      catcher,
      ardelia,
    ]);
    expect(nextGameDataRepository.getOperator(perlica.slug)).toBe(perlica);
    expect(nextGameDataRepository.getOperator(alesh.slug)).toBe(alesh);
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
    expect(nextGameDataRepository.getOperator(liino.slug)).toBe(liino);
    expect(nextGameDataRepository.getOperator(mifu.slug)).toBe(mifu);
    expect(nextGameDataRepository.getOperator(yvonne.slug)).toBe(yvonne);
    expect(nextGameDataRepository.getOperator(pogranichnik.slug)).toBe(pogranichnik);
    expect(nextGameDataRepository.getOperator(snowshine.slug)).toBe(snowshine);
    expect(nextGameDataRepository.getOperator(wulfgard.slug)).toBe(wulfgard);
    expect(nextGameDataRepository.getOperator(antal.slug)).toBe(antal);
    expect(nextGameDataRepository.getOperator(xaihi.slug)).toBe(xaihi);
    expect(nextGameDataRepository.getOperator(avywenna.slug)).toBe(avywenna);
    expect(nextGameDataRepository.getOperator(catcher.slug)).toBe(catcher);
    expect(nextGameDataRepository.getOperator(ardelia.slug)).toBe(ardelia);
    expect(nextGameDataRepository.getOperator('missing')).toBeNull();
  });

  it('registers complete and explicitly marked partial equipment definitions', () => {
    expect(nextGameDataRepository.getWeapons()).toEqual(nextWeaponDefinitions);
    expect(nextGameDataRepository.getGears()).toEqual(nextGearDefinitions);
    expect(nextGameDataRepository.getGearSets()).toEqual(sharedGearSetDefinitions);
    expect(nextGameDataRepository.getWeapon('tarr-11')?.slug).toBe('tarr-11');
    expect(nextGameDataRepository.getGear('xiranflow-light-armor')).not.toBeNull();
    const xiranflowAliasTarget =
      nextGearDefinitionRegistration.gearAliases['xiranflow-light-armor'];
    expect(xiranflowAliasTarget).toBeDefined();
    expect(nextGameDataRepository.getGear('xiranflow-light-armor')?.slug).toBe(
      'xiranflow-light-armor',
    );
    expect(nextGameDataRepository.getGear(xiranflowAliasTarget!)?.slug).toBe(xiranflowAliasTarget);
    expect(nextGameDataRepository.getGearSet('aic-fieldwork')).not.toBeNull();
    expect(nextGameDataRepository.getWeapons()).toHaveLength(77);
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

  it('resolves legacy gear identities through identity-preserving alias views', () => {
    const gear = sharedGearDefinitions[0]!;
    const gearSet = sharedGearSetDefinitions[0]!;
    const repository = createGameDataRepository({
      revision: 'fixture',
      gears: [gear],
      gearAliases: { 'legacy-gear': gear.slug },
      gearSets: [gearSet],
      gearSetAliases: { 'legacy-set': gearSet.slug },
    });

    expect(repository.getGears()).toEqual([gear]);
    expect(repository.getGearSets()).toEqual([gearSet]);
    expect(repository.getGear('legacy-gear')).toEqual({ ...gear, slug: 'legacy-gear' });
    expect(repository.getGearSet('legacy-set')).toEqual({ ...gearSet, slug: 'legacy-set' });
    expect(repository.getGear('legacy-gear')?.slug).toBe('legacy-gear');
    expect(repository.getGearSet('legacy-set')?.slug).toBe('legacy-set');
    expect(Object.isFrozen(repository.getGear('legacy-gear'))).toBe(true);
  });

  it('resolves registered weapon presentation slugs without changing the native catalog', () => {
    const [legacySlug, nativeSlug] = Object.entries(nextWeaponRegistration.aliases)[0]!;
    const native = nextGameDataRepository.getWeapon(nativeSlug);

    expect(native).not.toBeNull();
    expect(nextGameDataRepository.getWeapon(legacySlug)).toEqual({ ...native, slug: legacySlug });
    expect(nextGameDataRepository.getWeapon(legacySlug)?.slug).toBe(legacySlug);
    expect(nextGameDataRepository.getWeapons()).toEqual(nextWeaponDefinitions);
  });

  it('rejects aliases that are redundant, shadow definitions or target missing definitions', () => {
    const gear = sharedGearDefinitions[0]!;

    expect(() =>
      createGameDataRepository({
        revision: 'fixture',
        gears: [gear],
        gearAliases: { [gear.slug]: gear.slug },
      }),
    ).toThrow(`redundant gear alias '${gear.slug}'`);
    expect(() =>
      createGameDataRepository({
        revision: 'fixture',
        gears: [gear],
        gearAliases: { [gear.slug]: 'other' },
      }),
    ).toThrow(`gear alias '${gear.slug}' shadows a definition`);
    expect(() =>
      createGameDataRepository({
        revision: 'fixture',
        gears: [gear],
        gearAliases: { legacy: 'missing' },
      }),
    ).toThrow("gear alias 'legacy' targets unknown definition 'missing'");
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
