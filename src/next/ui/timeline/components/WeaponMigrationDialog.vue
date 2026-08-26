<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WeaponMigrationPreview } from '../../../application/weaponMigrationReview';
import type { WeaponInstanceTraitLevelSelection } from '../../../application/weaponGameDataMigration';
import type { EndaxisProjectDocument } from '../../../core/project/schema';
import { getOperatorGameName, getWeaponGameName } from '../../legacy/legacyGameText';

const props = defineProps<{
  preview: WeaponMigrationPreview;
  project: EndaxisProjectDocument;
  busy: boolean;
  error: string;
}>();
const emit = defineEmits<{
  cancel: [];
  confirm: [choices: readonly WeaponInstanceTraitLevelSelection[]];
}>();
const { locale } = useI18n();
const values = ref<Record<string, number | ''>>({});
const key = (scenario: string, track: string, trait: string) =>
  JSON.stringify([scenario, track, trait]);
const rows = computed(() =>
  props.preview.instances.map(instance => {
    const scenario = props.project.scenarios.find(scenario => scenario.id === instance.scenarioId)!;
    const track = scenario.tracks.find(track => track?.id === instance.trackId)!;
    const slug = track.operator?.operatorSlug;
    const custom = slug ? props.project.definitionLibrary?.operators[slug] : undefined;
    return {
      ...instance,
      scenarioName: scenario.name,
      operatorName: slug ? (custom?.name ?? getOperatorGameName(slug, locale.value)) : '未配置干员',
      weaponName: getWeaponGameName(instance.sourceSlug, locale.value),
    };
  }),
);
const missingCount = computed(() =>
  rows.value.reduce(
    (count, row) =>
      count +
      row.traits.filter(
        trait =>
          trait.sourceKey === undefined &&
          !Number.isInteger(values.value[key(row.scenarioId, row.trackId, trait.key)]),
      ).length,
    0,
  ),
);
function confirm() {
  if (props.busy || missingCount.value) return;
  emit(
    'confirm',
    rows.value.map(row => ({
      scenarioId: row.scenarioId,
      trackId: row.trackId,
      levels: Object.fromEntries(
        row.traits
          .filter(trait => trait.sourceKey === undefined)
          .map(trait => [
            trait.key,
            Number(values.value[key(row.scenarioId, row.trackId, trait.key)]),
          ]),
      ),
    })),
  );
}
</script>

<template>
  <el-dialog
    :model-value="true"
    title="更新项目武器数据"
    width="min(900px, 94vw)"
    :close-on-click-modal="false"
    :close-on-press-escape="!busy"
    :show-close="!busy"
    @update:model-value="!$event && !busy && emit('cancel')"
  >
    <p>此项目使用旧武器库。已有词条等级按身份保留；新增词条请逐实例选择。</p>
    <p class="migration-note">
      确认后先在此浏览器保存原项目备份，再打开迁移副本。原文件不会被覆盖；迁移后请重新导出项目。
    </p>
    <p class="migration-version">{{ preview.fromRevision }} → {{ preview.toRevision }}</p>
    <div class="migration-table-wrap">
      <table class="migration-table">
        <thead>
          <tr>
            <th>场景 / 干员</th>
            <th>武器</th>
            <th>词条与等级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="JSON.stringify([row.scenarioId, row.trackId])">
            <td>
              {{ row.scenarioName }}<small>{{ row.operatorName }}</small>
            </td>
            <td>{{ row.weaponName }}</td>
            <td>
              <div v-for="trait in row.traits" :key="trait.key" class="migration-trait">
                <template v-if="trait.sourceKey !== undefined">
                  <span>{{
                    trait.sourceKey === trait.key ? trait.key : `${trait.sourceKey} → ${trait.key}`
                  }}</span>
                  <span>{{ trait.savedLevel }} 级 · 保留</span>
                </template>
                <template v-else>
                  <label :for="key(row.scenarioId, row.trackId, trait.key)"
                    >{{ trait.key }} · 新增</label
                  >
                  <select
                    :id="key(row.scenarioId, row.trackId, trait.key)"
                    v-model="values[key(row.scenarioId, row.trackId, trait.key)]"
                    :disabled="busy"
                    :aria-label="`${row.scenarioName} ${row.operatorName} ${row.weaponName} ${trait.key} 新增等级`"
                  >
                    <option :value="undefined" disabled>请选择等级</option>
                    <option v-for="level in trait.levelCount" :key="level" :value="level">
                      {{ level }} 级
                    </option>
                  </select>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="rows.length === 0">没有需要迁移的内置武器，仅更新项目数据版本。</p>
    </div>
    <p v-if="preview.customInstanceCount" class="migration-note">
      {{ preview.customInstanceCount }} 个自定义武器实例保持不变。
    </p>
    <p v-if="error" class="migration-error" role="alert">{{ error }}</p>
    <template #footer>
      <span v-if="missingCount" class="migration-note">还需选择 {{ missingCount }} 个等级</span>
      <el-button :disabled="busy" @click="emit('cancel')">取消</el-button>
      <el-button type="primary" :disabled="missingCount > 0" :loading="busy" @click="confirm"
        >备份并迁移打开</el-button
      >
    </template>
  </el-dialog>
</template>

<style scoped>
.migration-note {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
.migration-version {
  font-size: 11px;
  overflow-wrap: anywhere;
}
.migration-table-wrap {
  max-height: 48vh;
  overflow: auto;
}
.migration-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
th,
td {
  text-align: left;
  vertical-align: top;
  padding: 8px;
  border-bottom: 1px solid var(--el-border-color);
  overflow-wrap: anywhere;
}
th {
  position: sticky;
  top: 0;
  background: var(--el-bg-color);
}
th:last-child {
  width: 42%;
}
small {
  display: block;
  color: var(--el-text-color-secondary);
}
.migration-trait {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 30px;
  font-size: 12px;
}
select {
  max-width: 100%;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 4px;
}
.migration-error {
  color: var(--el-color-danger);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
