<script setup lang="ts">
/**
 * Next 动作属性面板的基础字段区，照录旧版 PropertiesPanel 的头部与双列输入布局。
 *
 * 组件只显示持久化字段并发出编辑意图；定义默认值恢复、命中编辑和连接管理由后续独立模块负责。
 */
import { useI18n } from 'vue-i18n';
import type { SkillType } from '../../../core/game-data/operatorDefinition';
import type { EditableActionValues, SkillCastDocument } from '../../../core/project/schema';
import type { BasicEditableSkillCastField } from '../timelineDocumentCommands';

const props = defineProps<{
  cast: SkillCastDocument | null;
  label: string;
  skillType: SkillType | null;
}>();

const emit = defineEmits<{
  update: [
    field: BasicEditableSkillCastField,
    value: EditableActionValues[BasicEditableSkillCastField],
  ];
}>();

const { t } = useI18n({ useScope: 'global' });

function readNumber(event: Event): number | null {
  const value = Number((event.target as HTMLInputElement).value);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function updateInteger(field: BasicEditableSkillCastField, event: Event): void {
  const value = readNumber(event);
  if (value === null) return;
  emit('update', field, Math.round(value));
}

function updateNumber(field: BasicEditableSkillCastField, event: Event): void {
  const value = readNumber(event);
  if (value !== null) emit('update', field, value);
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
        <div class="panel-tag-mini">{{ t('propertiesPanel.sections.basic') }}</div>
        <div class="attribute-grid">
          <label class="form-group">
            <span>{{ t('propertiesPanel.labels.durationS') }}</span>
            <input
              type="number"
              min="0"
              step="1"
              :value="cast.editable.durationFrames"
              @change="updateInteger('durationFrames', $event)"
            />
          </label>
          <label v-if="skillType === 'comboSkill'" class="form-group">
            <span>{{ t('propertiesPanel.labels.cooldownS') }}</span>
            <input
              type="number"
              min="0"
              step="1"
              :value="cast.editable.cooldownFrames ?? 0"
              @change="updateInteger('cooldownFrames', $event)"
            />
          </label>
          <label v-if="skillType === 'comboSkill'" class="form-group">
            <span>{{ t('propertiesPanel.labels.followupDelayS') }}</span>
            <input
              type="number"
              min="0"
              step="1"
              :value="cast.editable.comboFollowupDelayFrames ?? 0"
              @change="updateInteger('comboFollowupDelayFrames', $event)"
            />
          </label>
          <label v-if="skillType === 'comboSkill'" class="form-group">
            <span>{{ t('propertiesPanel.labels.triggerWindowS') }}</span>
            <input
              type="number"
              min="0"
              step="1"
              :value="cast.editable.triggerWindowFrames ?? 0"
              @change="updateInteger('triggerWindowFrames', $event)"
            />
          </label>
          <label v-if="skillType === 'battleSkill'" class="form-group">
            <span>{{ t('propertiesPanel.labels.spCost') }}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              :value="cast.editable.spCost ?? 0"
              @change="updateNumber('spCost', $event)"
            />
          </label>
          <label v-if="skillType === 'ultimate'" class="form-group">
            <span>{{ t('propertiesPanel.labels.gaugeCost') }}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              :value="cast.editable.ultimateEnergyCost ?? 0"
              @change="updateNumber('ultimateEnergyCost', $event)"
            />
          </label>
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
}

.section-container {
  position: relative;
  padding: 20px 10px 12px;
  border: 1px solid var(--ea-border-soft);
  border-left: 2px solid var(--ea-border-strong);
  background: var(--ea-fill-soft);
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

.form-group input,
.readonly-field {
  width: 100%;
  height: 28px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg-secondary);
  padding: 0 7px;
  font:
    12px/28px Consolas,
    monospace;
  text-align: center;
}

.form-group input:focus {
  border-color: var(--ea-gold);
  outline: 0;
}

.readonly-field {
  overflow: hidden;
  color: var(--ea-fg-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
