<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RefreshLeft } from '@element-plus/icons-vue';
import type { SkillType, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import type { SkillCastDocument } from '../../../core/project/schema';

const props = defineProps<{
  cast: SkillCastDocument | null;
  label: string;
  skillType: SkillType | null;
  edited: boolean;
  diffCount: number;
  templateDefinition: SkillDefinition | null;
  currentDefinition: SkillDefinition | null;
}>();

const emit = defineEmits<{
  editDefinition: [];
  resetDefinition: [];
  setCameraTargetAngle: [angleDegrees: number | null];
}>();

const { t } = useI18n({ useScope: 'global' });

function commitCameraTargetAngle(event: Event): void {
  const raw = (event.target as HTMLInputElement).value.trim();
  if (raw.length === 0) {
    emit('setCameraTargetAngle', null);
    return;
  }
  const angle = Number(raw);
  if (Number.isFinite(angle) && angle >= -180 && angle <= 180) {
    emit('setCameraTargetAngle', angle);
  }
}
</script>

<template>
  <section class="properties-panel">
    <header class="panel-header">
      <div class="header-icon-bar"></div>
      <h3>{{ cast === null ? t('propertiesPanel.noSelection') : label }}</h3>
    </header>

    <div v-if="cast !== null" class="scrollable-content">
      <section class="section-container">
        <div class="panel-tag-mini">{{ t('nextTimeline.inspector.sections.basic') }}</div>
        <div class="attribute-grid">
          <div class="form-group">
            <span>{{ t('nextTimeline.inspector.labels.actionId') }}</span>
            <div class="readonly-field">{{ cast.id }}</div>
          </div>
          <div class="form-group">
            <span>{{ t('nextTimeline.inspector.labels.sourceKind') }}</span>
            <div class="readonly-field">{{ cast.source.kind }}</div>
          </div>
          <div class="form-group">
            <span>{{ t('nextTimeline.inspector.labels.startFrame') }}</span>
            <div class="readonly-field">{{ cast.placement.startFrame }}</div>
          </div>
        </div>
      </section>

      <section class="section-container">
        <div class="panel-tag-mini">{{ t('nextTimeline.inspector.sections.simulation') }}</div>
        <div class="attribute-grid">
          <label class="form-group attribute-grid__wide">
            <span>{{ t('nextTimeline.inspector.labels.cameraTargetAngle') }}</span>
            <input
              class="number-field"
              type="number"
              min="-180"
              max="180"
              step="any"
              :value="cast.simulationInputs?.cameraToTargetSignedAngleDegrees ?? ''"
              :placeholder="t('nextTimeline.inspector.labels.unset')"
              @change="commitCameraTargetAngle"
            />
            <small class="field-help">{{
              t('nextTimeline.inspector.cameraTargetAngleHelp')
            }}</small>
          </label>
        </div>
      </section>

      <section
        v-if="templateDefinition !== null && currentDefinition !== null"
        class="section-container"
      >
        <div class="panel-tag-mini">{{ t('nextTimeline.skillEditing.section') }}</div>
        <div class="definition-status definition-status--stacked">
          <strong>
            {{
              edited
                ? t('nextTimeline.skillEditing.customized')
                : t('nextTimeline.skillEditing.usesTemplate')
            }}
          </strong>
          <span v-if="edited">{{
            t('nextTimeline.skillEditing.diffCount', { count: diffCount })
          }}</span>
          <div class="definition-actions">
            <button type="button" class="definition-edit" @click="$emit('editDefinition')">
              {{ t('nextTimeline.skillEditing.edit') }}
            </button>
            <button
              v-if="edited"
              type="button"
              class="definition-reset"
              @click="$emit('resetDefinition')"
            >
              <RefreshLeft />
              <span>{{ t('nextTimeline.skillEditing.reset') }}</span>
            </button>
          </div>
        </div>
      </section>

      <section v-if="edited && templateDefinition === null" class="section-container">
        <div class="panel-tag-mini">{{ t('nextTimeline.skillEditing.section') }}</div>
        <div class="definition-status">
          <span>{{ t('nextTimeline.skillEditing.diffCount', { count: diffCount }) }}</span>
          <button
            type="button"
            class="definition-reset"
            :title="t('nextTimeline.skillEditing.reset')"
            @click="$emit('resetDefinition')"
          >
            <RefreshLeft />
            <span>{{ t('nextTimeline.skillEditing.reset') }}</span>
          </button>
        </div>
      </section>

      <section class="section-container">
        <div class="panel-tag-mini">{{ t('nextTimeline.inspector.sections.presentation') }}</div>
        <div class="attribute-grid">
          <div class="form-group">
            <span>{{ t('nextTimeline.inspector.labels.locked') }}</span>
            <div class="readonly-field">{{ cast.presentation?.locked ?? false }}</div>
          </div>
          <div class="form-group">
            <span>{{ t('nextTimeline.inspector.labels.disabled') }}</span>
            <div class="readonly-field">{{ cast.presentation?.disabled ?? false }}</div>
          </div>
          <div class="form-group" :class="{ 'attribute-grid__wide': true }">
            <span>{{ t('nextTimeline.inspector.labels.color') }}</span>
            <div class="readonly-field">
              <span
                v-if="cast.presentation?.color"
                class="color-swatch"
                :style="{ background: cast.presentation.color }"
              ></span>
              {{ cast.presentation?.color ?? '—' }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.properties-panel {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  overflow-y: auto;
  background: var(--ea-workbench-panel);
  color: var(--ea-fg);
  font-size: 13px;
}

.panel-header {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.header-icon-bar {
  width: 4px;
  height: 18px;
  flex: 0 0 auto;
  background: var(--ea-gold);
}

.panel-header h3 {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  color: var(--ea-fg);
  font-size: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scrollable-content {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-container {
  position: relative;
  padding: 20px 10px 12px;
  border: 1px solid var(--ea-border-soft);
  border-left: 2px solid var(--ea-border-strong);
  background: var(--ea-fill-soft);
}

.number-field {
  width: 100%;
  box-sizing: border-box;
  padding: 7px 8px;
  border: 1px solid var(--ea-border-strong);
  background: var(--ea-workbench-panel);
  color: var(--ea-fg);
}

.field-help {
  color: var(--ea-fg-muted);
  font-size: 11px;
  line-height: 1.45;
}

.panel-tag-mini {
  position: absolute;
  top: 0;
  left: 0;
  padding: 2px 8px;
  background: var(--ea-active-fill);
  color: var(--ea-fg-muted);
  font-size: 10px;
  font-weight: 700;
}

.attribute-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 8px;
}

.attribute-grid__wide {
  grid-column: 1 / -1;
}

.form-group {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--ea-fg-muted);
  font-size: 10px;
}

.readonly-field {
  width: 100%;
  height: 28px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg-muted);
  padding: 0 7px;
  font:
    12px/28px Consolas,
    monospace;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.color-swatch {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid var(--ea-border);
  flex-shrink: 0;
}

.definition-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--ea-fg-muted);
  font-size: 11px;
}

.definition-status--stacked {
  align-items: stretch;
  flex-direction: column;
}

.definition-status--stacked strong {
  color: var(--ea-fg);
  font-size: 12px;
}

.definition-actions {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px;
}

.definition-edit {
  height: 28px;
  border: 1px solid var(--ea-gold);
  border-radius: 2px;
  background: var(--ea-active-fill);
  color: var(--ea-fg);
  cursor: pointer;
}

.definition-reset {
  height: 26px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 8px;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  cursor: pointer;
}

.definition-reset:hover {
  border-color: var(--ea-gold);
}

.definition-reset svg {
  width: 13px;
  height: 13px;
}
</style>
