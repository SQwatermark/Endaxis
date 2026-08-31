<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RefreshLeft } from '@element-plus/icons-vue';
import type { SkillType, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import type { EditableBarDocument, SkillCastDocument } from '../../../core/project/schema';
import type { TimelineConnectionPort } from '../timelineConnections';

interface InspectorConnection {
  readonly id: string;
  readonly outgoing: boolean;
  readonly otherLabel: string;
  readonly targetKind: 'skillCast' | 'damageHit';
  readonly targetStepKey?: string;
  readonly fromPort: TimelineConnectionPort;
  readonly toPort: TimelineConnectionPort;
  readonly consumption: boolean;
}

interface InspectorConnectionPatch {
  readonly fromPort?: TimelineConnectionPort;
  readonly toPort?: TimelineConnectionPort;
  readonly consumption?: boolean;
}

const props = defineProps<{
  cast: SkillCastDocument | null;
  label: string;
  skillType: SkillType | null;
  edited: boolean;
  diffCount: number;
  templateDefinition: SkillDefinition | null;
  currentDefinition: SkillDefinition | null;
  maximumFrame: number;
  connections: readonly InspectorConnection[];
  connectionToolEnabled: boolean;
}>();

const emit = defineEmits<{
  editDefinition: [];
  resetDefinition: [];
  setCameraTargetAngle: [angleDegrees: number | null];
  setStartFrame: [frame: number];
  setLocked: [locked: boolean];
  setDisabled: [disabled: boolean];
  setColor: [color: string | null];
  addCustomBar: [];
  setCustomBars: [bars: readonly EditableBarDocument[]];
  beginConnection: [];
  removeConnection: [connectionId: string];
  updateConnection: [connectionId: string, patch: InspectorConnectionPatch];
}>();

const { t } = useI18n({ useScope: 'global' });
const connectionPorts: readonly TimelineConnectionPort[] = ['top', 'right', 'bottom', 'left'];

function connectionPort(event: Event): TimelineConnectionPort {
  return (event.target as HTMLSelectElement).value as TimelineConnectionPort;
}

function connectionPortLabel(port: TimelineConnectionPort): string {
  return t(`connection.portPosition.${port}`);
}

function sourceKindLabel(kind: SkillCastDocument['source']['kind']): string {
  return t(`nextTimeline.inspector.sourceKinds.${kind}`);
}

function skillTypeLabel(type: SkillType): string {
  const key: Record<SkillType, string> = {
    basicAttack: 'attack',
    battleSkill: 'skill',
    comboSkill: 'link',
    ultimate: 'ultimate',
    finisher: 'execution',
    plungingAttack: 'dive',
  };
  return t(`skillType.${key[type]}`);
}

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

function commitStartFrame(event: Event): void {
  const frame = Number((event.target as HTMLInputElement).value);
  if (Number.isInteger(frame) && frame >= 0 && frame <= props.maximumFrame) {
    emit('setStartFrame', frame);
  }
}

function updateCustomBar(
  barId: string,
  patch: Partial<Pick<EditableBarDocument, 'text' | 'offsetFrames' | 'durationFrames' | 'color'>>,
): void {
  if (props.cast === null) return;
  emit(
    'setCustomBars',
    (props.cast.presentation?.customBars ?? []).map(bar =>
      bar.id === barId ? { ...bar, ...patch } : bar,
    ),
  );
}

function updateCustomBarFrame(
  bar: EditableBarDocument,
  field: 'offsetFrames' | 'durationFrames',
  event: Event,
): void {
  const value = Number((event.target as HTMLInputElement).value);
  if (Number.isInteger(value) && value >= 0) updateCustomBar(bar.id, { [field]: value });
}

function removeCustomBar(barId: string): void {
  if (props.cast === null) return;
  emit(
    'setCustomBars',
    (props.cast.presentation?.customBars ?? []).filter(bar => bar.id !== barId),
  );
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
            <div class="readonly-field">{{ sourceKindLabel(cast.source.kind) }}</div>
          </div>
          <div v-if="skillType !== null" class="form-group">
            <span>{{ t('nextTimeline.inspector.labels.skillType') }}</span>
            <div class="readonly-field">{{ skillTypeLabel(skillType) }}</div>
          </div>
          <label class="form-group">
            <span>{{ t('nextTimeline.inspector.labels.startFrame') }}</span>
            <input
              class="number-field"
              type="number"
              min="0"
              :max="maximumFrame"
              step="1"
              :value="cast.placement.startFrame"
              @change="commitStartFrame"
            />
          </label>
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
          <label class="form-group toggle-field">
            <span>{{ t('nextTimeline.inspector.labels.locked') }}</span>
            <input
              type="checkbox"
              :checked="cast.presentation?.locked ?? false"
              @change="$emit('setLocked', ($event.target as HTMLInputElement).checked)"
            />
          </label>
          <label class="form-group toggle-field">
            <span>{{ t('nextTimeline.inspector.labels.disabled') }}</span>
            <input
              type="checkbox"
              :checked="cast.presentation?.disabled ?? false"
              @change="$emit('setDisabled', ($event.target as HTMLInputElement).checked)"
            />
          </label>
          <label class="form-group attribute-grid__wide">
            <span>{{ t('nextTimeline.inspector.labels.color') }}</span>
            <div class="color-editor">
              <input
                type="color"
                :value="cast.presentation?.color ?? '#8c8c8c'"
                @change="$emit('setColor', ($event.target as HTMLInputElement).value)"
              />
              <code>{{ cast.presentation?.color ?? '—' }}</code>
              <button type="button" @click="$emit('setColor', null)">
                {{ t('battleLog.ui.clear') }}
              </button>
            </div>
          </label>
        </div>
      </section>

      <section class="section-container">
        <div class="panel-tag-mini">
          {{ t('propertiesPanel.bars.title') }} ({{ cast.presentation?.customBars?.length ?? 0 }})
        </div>
        <button type="button" class="section-add" @click="$emit('addCustomBar')">＋</button>
        <div v-if="(cast.presentation?.customBars?.length ?? 0) === 0" class="empty-hint">
          {{ t('propertiesPanel.bars.empty') }}
        </div>
        <div v-else class="custom-bars">
          <article
            v-for="bar in cast.presentation?.customBars ?? []"
            :key="bar.id"
            class="bar-card"
          >
            <div class="bar-card__header">
              <input
                class="text-field"
                type="text"
                :value="bar.text"
                :placeholder="t('propertiesPanel.bars.namePlaceholder')"
                @change="
                  updateCustomBar(bar.id, { text: ($event.target as HTMLInputElement).value })
                "
              />
              <button type="button" class="remove-button" @click="removeCustomBar(bar.id)">
                ×
              </button>
            </div>
            <div class="attribute-grid">
              <label class="form-group">
                <span>{{ t('nextTimeline.inspector.labels.customBarOffsetFrames') }}</span>
                <input
                  class="number-field"
                  type="number"
                  min="0"
                  step="1"
                  :value="bar.offsetFrames"
                  @change="updateCustomBarFrame(bar, 'offsetFrames', $event)"
                />
              </label>
              <label class="form-group">
                <span>{{ t('nextTimeline.inspector.labels.customBarDurationFrames') }}</span>
                <input
                  class="number-field"
                  type="number"
                  min="0"
                  step="1"
                  :value="bar.durationFrames"
                  @change="updateCustomBarFrame(bar, 'durationFrames', $event)"
                />
              </label>
            </div>
            <div class="bar-color-editor">
              <input
                type="color"
                :value="bar.color ?? '#69c0ff'"
                :title="t('nextTimeline.inspector.labels.color')"
                @change="
                  updateCustomBar(bar.id, { color: ($event.target as HTMLInputElement).value })
                "
              />
              <code>{{ bar.color ?? '#69c0ff' }}</code>
              <button type="button" @click="updateCustomBar(bar.id, { color: undefined })">
                {{ t('battleLog.ui.clear') }}
              </button>
            </div>
          </article>
        </div>
      </section>

      <section class="section-container">
        <div class="panel-tag-mini">{{ t('propertiesPanel.connections.title') }}</div>
        <div class="connection-summary">
          <span>
            {{ t('propertiesPanel.connections.currentCount') }}: {{ connections.length }}
          </span>
          <button type="button" class="connection-add" @click="$emit('beginConnection')">
            {{
              connectionToolEnabled
                ? t('propertiesPanel.connections.chooseTarget')
                : t('propertiesPanel.connections.new')
            }}
          </button>
        </div>
        <small v-if="connectionToolEnabled" class="field-help">
          {{ t('nextTimeline.inspector.connectionDragHelp') }}
        </small>
        <div v-if="connections.length === 0" class="empty-hint">
          {{ t('propertiesPanel.connections.empty') }}
        </div>
        <div v-else class="connections-list">
          <article
            v-for="connection in connections"
            :key="connection.id"
            class="connection-card"
            :class="connection.outgoing ? 'is-outgoing' : 'is-incoming'"
          >
            <div class="connection-card__title">
              <span>{{ connection.outgoing ? label : connection.otherLabel }}</span>
              <b>→</b>
              <span>{{ connection.outgoing ? connection.otherLabel : label }}</span>
              <button
                type="button"
                class="remove-button"
                @click="$emit('removeConnection', connection.id)"
              >
                ×
              </button>
            </div>
            <div v-if="connection.targetKind === 'damageHit'" class="connection-hit">
              HIT · {{ connection.targetStepKey }}
            </div>
            <div class="connection-ports">
              <label>
                <span>{{ t('propertiesPanel.connections.outPort') }}</span>
                <select
                  :value="connection.fromPort"
                  @change="
                    $emit('updateConnection', connection.id, {
                      fromPort: connectionPort($event),
                    })
                  "
                >
                  <option v-for="port in connectionPorts" :key="port" :value="port">
                    {{ connectionPortLabel(port) }}
                  </option>
                </select>
              </label>
              <label v-if="connection.targetKind === 'skillCast'">
                <span>{{ t('propertiesPanel.connections.inPort') }}</span>
                <select
                  :value="connection.toPort"
                  @change="
                    $emit('updateConnection', connection.id, {
                      toPort: connectionPort($event),
                    })
                  "
                >
                  <option v-for="port in connectionPorts" :key="port" :value="port">
                    {{ connectionPortLabel(port) }}
                  </option>
                </select>
              </label>
            </div>
            <label class="connection-consumption">
              <input
                type="checkbox"
                :checked="connection.consumption"
                @change="
                  $emit('updateConnection', connection.id, {
                    consumption: ($event.target as HTMLInputElement).checked,
                  })
                "
              />
              <span>{{ t('propertiesPanel.connections.consume') }}</span>
            </label>
          </article>
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

.section-add {
  position: absolute;
  top: 2px;
  right: 6px;
  border: 0;
  background: transparent;
  color: var(--ea-gold);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.empty-hint {
  padding: 6px 0;
  color: var(--ea-fg-muted);
  text-align: center;
}

.custom-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar-card {
  min-width: 0;
  padding: 8px;
  border: 1px solid color-mix(in srgb, #69c0ff 40%, var(--ea-border-soft));
  background: color-mix(in srgb, #69c0ff 5%, transparent);
}

.bar-card__header {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.bar-color-editor {
  min-width: 0;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.bar-color-editor input {
  width: 28px;
  height: 24px;
  padding: 1px;
  border: 1px solid var(--ea-border-strong);
  background: var(--ea-workbench-panel);
}

.bar-color-editor code {
  min-width: 0;
  overflow: hidden;
  color: var(--ea-fg-muted);
  text-overflow: ellipsis;
}

.bar-color-editor button {
  border: 1px solid var(--ea-border-soft);
  background: transparent;
  color: var(--ea-fg);
  cursor: pointer;
}

.text-field {
  min-width: 0;
  flex: 1;
  box-sizing: border-box;
  padding: 6px 7px;
  border: 1px solid var(--ea-border-strong);
  background: var(--ea-workbench-panel);
  color: var(--ea-fg);
}

.remove-button {
  flex: 0 0 auto;
  border: 1px solid color-mix(in srgb, #ff5a5f 55%, var(--ea-border-soft));
  background: transparent;
  color: #ff8a8e;
  cursor: pointer;
}

.connection-summary,
.connection-card__title,
.connection-ports,
.connection-consumption {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.connection-summary {
  justify-content: space-between;
  color: var(--ea-fg-muted);
  font-size: 11px;
}

.connection-add {
  border: 1px solid color-mix(in srgb, var(--ea-gold) 65%, var(--ea-border-soft));
  background: color-mix(in srgb, var(--ea-gold) 8%, transparent);
  color: var(--ea-gold);
  cursor: pointer;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.connection-card {
  min-width: 0;
  padding: 8px;
  border: 1px solid var(--ea-border-soft);
  border-left: 2px solid #8b5cf6;
  background: var(--ea-workbench-panel);
}

.connection-card.is-incoming {
  border-left-color: #22c55e;
}

.connection-card__title span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connection-card__title span:last-of-type {
  flex: 1;
}

.connection-hit {
  margin: 6px 0;
  color: #ff7277;
  font:
    10px Consolas,
    monospace;
  overflow-wrap: anywhere;
}

.connection-ports {
  margin-top: 8px;
}

.connection-ports label {
  min-width: 0;
  flex: 1;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 4px;
  color: var(--ea-fg-muted);
  font-size: 10px;
}

.connection-ports select {
  min-width: 0;
  border: 1px solid var(--ea-border-strong);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}

.connection-consumption {
  margin-top: 8px;
  color: var(--ea-fg-muted);
  font-size: 10px;
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

.toggle-field {
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
}

.toggle-field input {
  accent-color: var(--ea-gold);
}

.color-editor {
  min-width: 0;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 6px;
}

.color-editor input {
  width: 34px;
  height: 28px;
  padding: 1px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
}

.color-editor code {
  min-width: 0;
  overflow: hidden;
  color: var(--ea-fg-secondary);
  text-overflow: ellipsis;
}

.color-editor button {
  height: 28px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
  cursor: pointer;
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
