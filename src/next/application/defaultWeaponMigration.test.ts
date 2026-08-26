import { describe, expect, it } from 'vitest';
import { createEmptyProject } from '../core/project/createProject';
import { validateWeaponDefinition } from '../core/game-data/equipmentDefinitionValidation';
import {
  nextGameDataRepository,
  weaponV1MigrationSource,
  weaponV2R1MigrationSource,
} from '../data/gameDataRepository';
import type { WeaponMigrationBackup } from './weaponMigrationReview';
import { legacyWeaponDefinitions } from '../data/revisions/weapons-v1';
import {
  nextWeaponDefinitions,
  nextWeaponRegistration,
} from '../data/equipment/nextWeaponDefinitions';
import { createWeaponMigrationBackupStorage } from '../ui/timeline/weaponMigrationBackupStorage';
import { openProject } from './openProject';
import { canMigrateWeaponRevision, prepareDefaultWeaponMigration } from './defaultWeaponMigration';

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
      'endaxis-next-definitions-v2-weapons-1.4.4-r2',
      '412cadadedb380c8013ff54e8e3254b6233645483d93f06933f11823506be20a',
    ]);
    expect(nextGameDataRepository.getWeapons()).toEqual(nextWeaponDefinitions);
    expect(Object.keys(nextWeaponRegistration.aliases)).toHaveLength(77);
  });

  it('保留 r1 整库哈希，r2 仅修正已审计的两把武器', async () => {
    const previous = weaponV2R1MigrationSource.getWeapons();
    const digest = new Uint8Array(
      await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(
          JSON.stringify([...previous].sort((a, b) => a.slug.localeCompare(b.slug))),
        ),
      ),
    );
    expect(Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('')).toBe(
      '58c2f3ca62fb70c164b9c0b34dbf48397be7443ce4771ff057467f432641e740',
    );
    expect(
      previous
        .filter(
          weapon =>
            JSON.stringify(weapon) !==
            JSON.stringify(nextGameDataRepository.getWeapon(weapon.slug)),
        )
        .map(weapon => weapon.slug),
    ).toEqual(['wpn_pistol_0005', 'wpn_sword_0010']);
    expect(canMigrateWeaponRevision(weaponV2R1MigrationSource.revision)).toBe(true);
    expect(canMigrateWeaponRevision(weaponV1MigrationSource.revision)).toBe(true);
    expect(canMigrateWeaponRevision('unknown')).toBe(false);
    expect(canMigrateWeaponRevision(nextGameDataRepository.revision)).toBe(false);
  });

  it.each(weaponV2R1MigrationSource.getWeapons())(
    'r1 $slug 备份后升级且保留全部等级和项目内容',
    async weapon => {
      const project = createEmptyProject({
        createdWith: 'test',
        gameDataRevision: weaponV2R1MigrationSource.revision,
      });
      project.scenarios[0]!.tracks[0] = {
        id: 'track:r1',
        operator: null,
        weapon: {
          weaponSlug: weapon.slug,
          level: 90,
          potential: 5,
          tuned: true,
          traitLevels: weapon.traits.map((trait, index) => (index === 0 ? 1 : trait.levelCount)),
        },
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 0 },
        skillCasts: [],
      };
      const prepared = prepareDefaultWeaponMigration(project);
      if (!prepared.ok) throw new Error(prepared.errors.join('\n'));
      expect(
        prepared.review.preview.instances
          .flatMap(instance => instance.traits)
          .every(trait => trait.sourceKey === trait.key),
      ).toBe(true);
      const backups: WeaponMigrationBackup[] = [];
      const result = await prepared.review.confirm({
        confirmed: true,
        choices: [],
        getCurrentProject: () => project,
        persistBackup: async backup => {
          backups.push(backup);
          return { ok: true };
        },
      });
      if (!result.ok) throw new Error(result.errors.join('\n'));
      expect(result.value).toEqual({
        ...project,
        gameDataRevision: nextGameDataRepository.revision,
      });
      expect(openProject(result.value, { gameDataRepository: nextGameDataRepository }).kind).toBe(
        'opened',
      );
      expect(backups).toHaveLength(1);
      expect(JSON.parse(backups[0]!.projectJson)).toEqual(project);
      expect(backups[0]!.sourceWeaponDefinitions).toEqual([weapon]);
    },
  );

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
