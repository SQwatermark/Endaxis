import type { WeaponMigrationBackup } from '../../application/weaponMigrationReview';
import { parseProjectDocument } from '../../core/project/serialization';
import { validateWeaponDefinition } from '../../core/game-data/equipmentDefinitionValidation';

const PREFIX = 'endaxis:next:weapon-migration-backup:';
export interface StoredWeaponMigrationBackup {
  readonly id: string;
  readonly createdAt: string;
  readonly backup: WeaponMigrationBackup;
}
type StoragePort = Pick<Storage, 'length' | 'key' | 'getItem' | 'setItem'>;

function parseRecord(text: string): StoredWeaponMigrationBackup {
  const record = JSON.parse(text) as StoredWeaponMigrationBackup;
  if (
    !record ||
    typeof record.id !== 'string' ||
    !record.id ||
    typeof record.createdAt !== 'string' ||
    !Number.isFinite(Date.parse(record.createdAt)) ||
    record.backup?.format !== 'endaxis-weapon-migration-backup-v1' ||
    typeof record.backup.projectJson !== 'string' ||
    typeof record.backup.sourceRevision !== 'string' ||
    typeof record.backup.targetRevision !== 'string' ||
    !record.backup.targetRevision ||
    record.backup.sourceRevision === record.backup.targetRevision ||
    !Array.isArray(record.backup.sourceWeaponDefinitions)
  )
    throw new Error('迁移备份结构无效');
  const project = parseProjectDocument(record.backup.projectJson);
  if (
    !project.ok ||
    project.value.gameDataRevision !== record.backup.sourceRevision ||
    record.backup.sourceWeaponDefinitions.some(
      definition => validateWeaponDefinition(definition).length > 0,
    )
  )
    throw new Error('迁移备份内容校验失败');
  return record;
}

/** 不覆盖旧备份；写入后回读确认。空间不足/存储被禁用时拒绝迁移，不退化为假成功的下载。 */
export function createWeaponMigrationBackupStorage(
  storage: StoragePort,
  createId: () => string = () => crypto.randomUUID(),
  now: () => string = () => new Date().toISOString(),
) {
  return {
    async save(
      backup: WeaponMigrationBackup,
    ): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
      try {
        const id = createId();
        const key = PREFIX + id;
        const text = JSON.stringify({ id, createdAt: now(), backup });
        parseRecord(text);
        if (storage.getItem(key) !== null) throw new Error('备份身份冲突，未覆盖已有备份');
        storage.setItem(key, text);
        if (storage.getItem(key) !== text) throw new Error('备份写入后回读不一致');
        return { ok: true, id };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
      }
    },
    list(): { records: readonly StoredWeaponMigrationBackup[]; errors: readonly string[] } {
      const records: StoredWeaponMigrationBackup[] = [];
      const errors: string[] = [];
      for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index);
        if (!key?.startsWith(PREFIX)) continue;
        try {
          const record = parseRecord(storage.getItem(key) ?? 'null');
          if (PREFIX + record.id !== key) throw new Error('备份身份不匹配');
          records.push(record);
        } catch (error) {
          errors.push(`${key}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      return { records: records.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), errors };
    },
  };
}
