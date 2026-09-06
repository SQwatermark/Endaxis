<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
  running: boolean;
  stale: boolean;
  error: string | null;
  hasResult: boolean;
}>();
const { t } = useI18n();
</script>

<template>
  <div v-if="running || stale || error !== null" class="simulation-status" role="status">
    <span v-if="error !== null" class="simulation-status__error" :title="error">
      {{ t('timeline.simulationFailed') }}：{{ error }}
    </span>
    <span v-else-if="running" class="simulation-status__running">
      {{ t('timeline.simulating') }}
    </span>
    <span v-else>{{ t('timeline.simulationPending') }}</span>
    <span v-if="stale && hasResult" class="simulation-status__stale">
      {{ t('timeline.simulationPreviousResult') }}
    </span>
  </div>
</template>

<style scoped>
.simulation-status {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  min-width: 0;
  padding: 4px 8px;
  border-bottom: 1px solid var(--ea-border-soft);
  color: var(--ea-fg-muted);
  font-size: 11px;
}
.simulation-status__running {
  color: var(--ea-gold);
}
.simulation-status__error {
  min-width: 0;
  color: #f5222d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.simulation-status__stale {
  flex-shrink: 0;
}
</style>
