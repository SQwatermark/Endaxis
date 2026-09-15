<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
  error: string | null;
}>();
const { t } = useI18n();
</script>

<template>
  <aside v-if="error !== null" class="simulation-error-notice" role="alert" :title="error">
    <strong>{{ t('timeline.simulationFailed') }}</strong>
    <span>{{ error }}</span>
  </aside>
</template>

<style scoped>
.simulation-error-notice {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 3000;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 3px;
  width: 360px;
  height: 64px;
  padding: 9px 12px;
  border: 1px solid rgb(210 75 75 / 45%);
  border-radius: 6px;
  background: var(--ea-bg-elevated);
  box-shadow: 0 6px 18px rgb(0 0 0 / 22%);
  color: var(--ea-fg-muted);
  font-size: 11px;
  pointer-events: none;
}

.simulation-error-notice strong {
  color: #d94b4b;
  font-size: 12px;
  line-height: 16px;
}

.simulation-error-notice span {
  display: -webkit-box;
  min-width: 0;
  overflow: hidden;
  line-height: 15px;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

@media (max-width: 480px) {
  .simulation-error-notice {
    right: 12px;
    bottom: 12px;
    width: calc(100vw - 24px);
  }
}
</style>
