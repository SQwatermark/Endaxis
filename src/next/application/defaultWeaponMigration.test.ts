import { describe, expect, it } from 'vitest';
import { createEmptyProject } from '../core/project/createProject';
import { validateWeaponDefinition } from '../core/game-data/equipmentDefinitionValidation';
import { nextGameDataRepository, weaponV1MigrationSource } from '../data/gameDataRepository';
import { legacyWeaponDefinitions } from '../data/revisions/weapons-v1';
import {
  nextWeaponDefinitions,
  nextWeaponRegistration,
} from '../data/equipment/nextWeaponDefinitions';
import { createWeaponMigrationBackupStorage } from '../ui/timeline/weaponMigrationBackupStorage';
import { openProject } from './openProject';
import { prepareDefaultWeaponMigration } from './defaultWeaponMigration';

describe('published generated weapon revision', () => {
  it('pins all v1 weapon definitions independently of mutable legacy adapters', async () => {
    expect(legacyWeaponDefinitions).toHaveLength(77);
    const text = JSON.stringify(
      [...legacyWeaponDefinitions].sort((a, b) => a.slug.localeCompare(b.slug)),
    );
    const digest = new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)),
    );
    expect(Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('')).toBe(
      '07fcf18abfd172525e3ce087b96a55cfbdceb92ea241807b9f738e408edf8aa7',
    );
    expect(
      legacyWeaponDefinitions.flatMap(definition => validateWeaponDefinition(definition)),
    ).toEqual([]);
    expect(nextGameDataRepository.revision).not.toBe(weaponV1MigrationSource.revision);
    const targetText = JSON.stringify(
      [...nextWeaponDefinitions].sort((a, b) => a.slug.localeCompare(b.slug)),
    );
    const targetDigest = new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(targetText)),
    );
    // 发布门禁：重新生成武器后必须显式决定 revision/迁移边，不能无声覆盖同一版本。
    expect([
      nextGameDataRepository.revision,
      Array.from(targetDigest, byte => byte.toString(16).padStart(2, '0')).join(''),
    ]).toEqual([
      'endaxis-next-definitions-v2-weapons-1.4.4-r1',
      '58c2f3ca62fb70c164b9c0b34dbf48397be7443ce4771ff057467f432641e740',
    ]);
    expect(nextGameDataRepository.getWeapons()).toEqual(nextWeaponDefinitions);
    expect(Object.keys(nextWeaponRegistration.aliases)).toHaveLength(77);
  });

  it.each(legacyWeaponDefinitions)(
    'migrates $slug through the production edge and persistent backup adapter',
    async weapon => {
      const project = createEmptyProject({
        createdWith: 'test',
        gameDataRevision: weaponV1MigrationSource.revision,
      });
      project.scenarios[0]!.tracks[0] = {
        id: 'track:test',
        operator: null,
        weapon: {
          weaponSlug: weapon.slug,
          level: 90,
          potential: 0,
          tuned: true,
          traitLevels: weapon.traits.map(() => 2),
        },
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 0 },
        skillCasts: [],
      };
      expect(openProject(project, { gameDataRepository: nextGameDataRepository }).kind).toBe(
        'game-data-revision-mismatch',
      );
      const prepared = prepareDefaultWeaponMigration(project);
      if (!prepared.ok) throw new Error(prepared.errors.join('\n'));
      const choices = prepared.review.preview.instances.map(instance => ({
        scenarioId: instance.scenarioId,
        trackId: instance.trackId,
        levels: Object.fromEntries(
          instance.traits
            .filter(trait => trait.sourceKey === undefined)
            .map(trait => [trait.key, 3]),
        ),
      }));
      const map = new Map<string, string>();
      const storage = createWeaponMigrationBackupStorage(
        {
          get length() {
            return map.size;
          },
          key: index => [...map.keys()][index] ?? null,
          getItem: key => map.get(key) ?? null,
          setItem: (key, value) => {
            map.set(key, value);
          },
        },
        () => 'test-backup',
      );
      const result = await prepared.review.confirm({
        confirmed: true,
        choices,
        getCurrentProject: () => project,
        persistBackup: storage.save,
      });
      if (!result.ok) throw new Error(result.errors.join('\n'));
      expect(openProject(result.value, { gameDataRepository: nextGameDataRepository }).kind).toBe(
        'opened',
      );
      expect(storage.list().errors).toEqual([]);
      expect(JSON.parse(storage.list().records[0]!.backup.projectJson)).toEqual(project);
      expect(result.value.scenarios[0]!.tracks[0]!.weapon!.weaponSlug).toBe(
        nextWeaponRegistration.aliases[weapon.slug],
      );
    },
  );

  it('does not treat unknown or already current revisions as v1', () => {
    for (const revision of ['unknown', nextGameDataRepository.revision])
      expect(
        prepareDefaultWeaponMigration(
          createEmptyProject({ createdWith: 'test', gameDataRevision: revision }),
        ).ok,
      ).toBe(false);
  });
});
