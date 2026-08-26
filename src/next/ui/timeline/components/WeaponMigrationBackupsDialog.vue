<script setup lang="ts">
import type { StoredWeaponMigrationBackup } from '../weaponMigrationBackupStorage';
defineProps<{ records: readonly StoredWeaponMigrationBackup[]; errors: readonly string[] }>();
defineEmits<{ close: []; download: [record: StoredWeaponMigrationBackup, original: boolean] }>();
</script>
<template>
  <el-dialog
    :model-value="true"
    title="武器迁移备份"
    width="min(760px, 94vw)"
    @update:model-value="!$event && $emit('close')"
  >
    <p>备份仅保存在当前站点的此浏览器中，清理浏览器数据会丢失。建议导出原项目和完整备份包。</p>
    <div class="backup-list">
      <article v-for="record in records" :key="record.id">
        <div>
          <strong>{{ new Date(record.createdAt).toLocaleString() }}</strong
          ><small>{{ record.backup.sourceRevision }} → {{ record.backup.targetRevision }}</small>
        </div>
        <el-button @click="$emit('download', record, true)">导出原项目</el-button>
        <el-button @click="$emit('download', record, false)">导出备份包</el-button>
      </article>
      <p v-if="!records.length">尚无迁移备份。</p>
    </div>
    <p v-for="error in errors" :key="error" class="backup-error" role="alert">{{ error }}</p>
    <template #footer><el-button @click="$emit('close')">关闭</el-button></template>
  </el-dialog>
</template>
<style scoped>
.backup-list {
  max-height: 50vh;
  overflow: auto;
}
article {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color);
}
article > div {
  flex: 1 1 240px;
  min-width: 0;
}
small {
  display: block;
  overflow-wrap: anywhere;
  font-size: 11px;
  color: var(--el-text-color-secondary);
}
.backup-error {
  color: var(--el-color-danger);
  overflow-wrap: anywhere;
}
</style>
