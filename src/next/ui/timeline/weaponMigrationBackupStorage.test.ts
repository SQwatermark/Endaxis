import { describe, expect, it } from 'vitest';
import { createEmptyProject } from '../../core/project/createProject';
import type { WeaponMigrationBackup } from '../../application/weaponMigrationReview';
import { createWeaponMigrationBackupStorage } from './weaponMigrationBackupStorage';

function fixture() {
  const map = new Map<string, string>();
  const port = {
    get length() {
      return map.size;
    },
    key: (index: number) => [...map.keys()][index] ?? null,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
  const backup: WeaponMigrationBackup = {
    format: 'endaxis-weapon-migration-backup-v1',
    sourceRevision: 'v1',
    targetRevision: 'v2',
    sourceWeaponDefinitions: [],
    projectJson: JSON.stringify(
      createEmptyProject({ createdWith: 'test', gameDataRevision: 'v1' }),
    ),
  };
  return { map, port, backup };
}

describe('browser migration backups', () => {
  it('survives adapter recreation and preserves exact original project JSON', async () => {
    const { port, backup } = fixture();
    expect(await createWeaponMigrationBackupStorage(port, () => 'one').save(backup)).toEqual({
      ok: true,
      id: 'one',
    });
    const restored = createWeaponMigrationBackupStorage(port).list();
    expect(restored.errors).toEqual([]);
    expect(restored.records[0]!.backup).toEqual(backup);
  });
  it('never overwrites an existing backup', async () => {
    const { port, backup, map } = fixture();
    const store = createWeaponMigrationBackupStorage(port, () => 'one');
    await store.save(backup);
    const original = [...map];
    expect((await store.save(backup)).ok).toBe(false);
    expect([...map]).toEqual(original);
  });
  it.each(['quota', 'blocked', 'readback'] as const)('fails closed for %s storage', async mode => {
    const { port, backup } = fixture();
    const modified = {
      ...port,
      getItem:
        mode === 'blocked'
          ? () => {
              throw new Error('denied');
            }
          : mode === 'readback'
            ? () => null
            : port.getItem,
      setItem:
        mode === 'quota'
          ? () => {
              throw new Error('quota');
            }
          : port.setItem,
    };
    expect((await createWeaponMigrationBackupStorage(modified, () => 'one').save(backup)).ok).toBe(
      false,
    );
  });
  it('reports corrupt records without deleting them or reading unrelated values', () => {
    const { map, port } = fixture();
    map.set('unrelated', 'not-json');
    map.set('endaxis:next:weapon-migration-backup:bad', 'not-json');
    const list = createWeaponMigrationBackupStorage(port).list();
    expect(list.records).toEqual([]);
    expect(list.errors).toHaveLength(1);
    expect(map.size).toBe(2);
  });
  it('rejects invalid backup content before writing', async () => {
    const { map, port, backup } = fixture();
    const store = createWeaponMigrationBackupStorage(port, () => 'one');
    expect((await store.save({ ...backup, projectJson: '{}' })).ok).toBe(false);
    expect((await store.save({ ...backup, sourceRevision: 'wrong' })).ok).toBe(false);
    expect((await store.save({ ...backup, targetRevision: 'v1' })).ok).toBe(false);
    expect(map.size).toBe(0);
  });
});
