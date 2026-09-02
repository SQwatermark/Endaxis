<script setup lang="ts">
/** 编辑事件监听器使用的战斗事件筛选。 */
import { useI18n } from 'vue-i18n';
import {
  COMBAT_TARGETS,
  DAMAGE_ELEMENTS,
  DAMAGE_TAGS,
  PHYSICAL_INFLICTION_TYPES,
  SKILL_TRIGGER_SCOPES,
  SP_GAIN_KINDS,
  SP_GAIN_SOURCES,
  type CombatEventTrigger,
  type CombatTarget,
  type DamageElement,
  type DamageTag,
  type PhysicalInflictionType,
  type SkillTriggerScope,
  type SpGainKind,
  type SpGainSource,
} from '../../../core/game-data/operatorDefinition';
import EditorFieldLabel from './EditorFieldLabel.vue';
import {
  createCombatEventTriggerDraft,
  EDITABLE_COMBAT_EVENT_TRIGGER_KINDS,
} from '../combatEventTriggerCatalog';

const props = defineProps<{ event: CombatEventTrigger }>();
const emit = defineEmits<{ update: [event: CombatEventTrigger] }>();
const { t } = useI18n({ useScope: 'global' });
const KINDS = EDITABLE_COMBAT_EVENT_TRIGGER_KINDS;
const SCOPES = SKILL_TRIGGER_SCOPES;

function setKind(kind: CombatEventTrigger['kind']): void {
  if (!KINDS.includes(kind as (typeof KINDS)[number])) return;
  emit('update', createCombatEventTriggerDraft(kind as (typeof KINDS)[number]));
}

function setScope(scope: SkillTriggerScope): void {
  const event = props.event;
  if (
    event.kind === 'damageTagHit' ||
    event.kind === 'elementalInflictionApplied' ||
    event.kind === 'physicalInflictionApplied' ||
    event.kind === 'skillHit' ||
    event.kind === 'enemyDefeated'
  )
    emit('update', { ...event, scope });
}

function setText(value: string): void {
  const event = props.event;
  if (event.kind === 'skillHit') emit('update', { ...event, skillGroupKey: value });
  else if (event.kind === 'statusExpired' || event.kind === 'statusConsumed')
    emit('update', { ...event, statusKey: value });
}

function setHealRole(value: string): void {
  if (props.event.kind !== 'operatorHealed') return;
  emit(
    'update',
    value === 'source' ? { ...props.event, role: 'source' } : { kind: 'operatorHealed' },
  );
}

function setBuffIds(value: string): void {
  if (props.event.kind !== 'buffConsumed') return;
  const buffIds = value
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean);
  emit('update', buffIds.length === 0 ? { kind: 'buffConsumed' } : { ...props.event, buffIds });
}

function setSpGainSource(value: string): void {
  if (props.event.kind !== 'spGained') return;
  const { source: _source, ...event } = props.event;
  emit('update', value === '' ? event : { ...event, source: value as SpGainSource });
}

function setSpGainKind(value: string): void {
  if (props.event.kind !== 'spGained') return;
  const { gainKind: _gainKind, ...event } = props.event;
  emit('update', value === '' ? event : { ...event, gainKind: value as SpGainKind });
}
</script>

<template>
  <div class="event-trigger-grid">
    <label>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.triggerKind')"
        :help="t('nextTimeline.skillEditing.fieldHelp.eventTrigger')"
      />
      <select
        :value="event.kind"
        @change="setKind(($event.target as HTMLSelectElement).value as CombatEventTrigger['kind'])"
      >
        <option v-for="kind in KINDS" :key="kind" :value="kind">
          {{ t(`nextTimeline.skillEditing.triggerKinds.${kind}`) }}
        </option>
      </select>
    </label>
    <label
      v-if="
        event.kind === 'damageTagHit' ||
        event.kind === 'elementalInflictionApplied' ||
        event.kind === 'physicalInflictionApplied' ||
        event.kind === 'skillHit' ||
        event.kind === 'enemyDefeated'
      "
    >
      <span>{{ t('nextTimeline.skillEditing.triggerScope') }}</span>
      <select
        :value="event.scope"
        @change="setScope(($event.target as HTMLSelectElement).value as SkillTriggerScope)"
      >
        <option v-for="scope in SCOPES" :key="scope" :value="scope">
          {{ t(`nextTimeline.skillEditing.triggerScopes.${scope}`) }}
        </option>
      </select>
    </label>
    <label v-if="event.kind === 'operatorHealed'">
      <span>{{ t('nextTimeline.skillEditing.eventRole') }}</span>
      <select
        :value="event.role ?? ''"
        @change="setHealRole(($event.target as HTMLSelectElement).value)"
      >
        <option value="">{{ t('nextTimeline.skillEditing.eventRoles.target') }}</option>
        <option value="source">{{ t('nextTimeline.skillEditing.eventRoles.source') }}</option>
      </select>
    </label>
    <label v-else-if="event.kind === 'buffConsumed'">
      <span>{{ t('nextTimeline.skillEditing.buffIds') }}</span>
      <textarea
        :value="event.buffIds?.join('\n') ?? ''"
        :placeholder="t('nextTimeline.skillEditing.anyValue')"
        @input="setBuffIds(($event.target as HTMLTextAreaElement).value)"
      />
    </label>
    <template v-else-if="event.kind === 'spGained'">
      <label>
        <span>{{ t('nextTimeline.skillEditing.spGainSource') }}</span>
        <select
          :value="event.source ?? ''"
          @change="setSpGainSource(($event.target as HTMLSelectElement).value)"
        >
          <option value="">{{ t('nextTimeline.skillEditing.anyValue') }}</option>
          <option v-for="source in SP_GAIN_SOURCES" :key="source" :value="source">
            {{ t(`nextTimeline.skillEditing.spGainSources.${source}`) }}
          </option>
        </select>
      </label>
      <label>
        <span>{{ t('nextTimeline.skillEditing.spGainKind') }}</span>
        <select
          :value="event.gainKind ?? ''"
          @change="setSpGainKind(($event.target as HTMLSelectElement).value)"
        >
          <option value="">{{ t('nextTimeline.skillEditing.anyValue') }}</option>
          <option v-for="kind in SP_GAIN_KINDS" :key="kind" :value="kind">
            {{ t(`nextTimeline.skillEditing.spGainKinds.${kind}`) }}
          </option>
        </select>
      </label>
    </template>
    <label v-if="event.kind === 'damageTagHit'">
      <span>{{ t('nextTimeline.skillEditing.damageTag') }}</span>
      <select
        :value="event.tag"
        @change="
          emit('update', { ...event, tag: ($event.target as HTMLSelectElement).value as DamageTag })
        "
      >
        <option v-for="tag in DAMAGE_TAGS" :key="tag" :value="tag">
          {{ t(`nextTimeline.skillEditing.damageTagNames.${tag}`) }}
        </option>
      </select>
    </label>
    <label v-else-if="event.kind === 'elementalInflictionApplied'">
      <span>{{ t('nextTimeline.skillEditing.element') }}</span>
      <select
        :value="Array.isArray(event.elements) ? event.elements[0] : event.elements"
        @change="
          emit('update', {
            ...event,
            elements: ($event.target as HTMLSelectElement).value as DamageElement,
          })
        "
      >
        <option v-for="element in DAMAGE_ELEMENTS" :key="element" :value="element">
          {{ t(`nextTimeline.skillEditing.damageTypes.${element}`) }}
        </option>
      </select>
    </label>
    <label v-else-if="event.kind === 'physicalInflictionApplied'">
      <span>{{ t('nextTimeline.skillEditing.physicalInflictionType') }}</span>
      <select
        :value="Array.isArray(event.types) ? event.types[0] : event.types"
        @change="
          emit('update', {
            ...event,
            types: ($event.target as HTMLSelectElement).value as PhysicalInflictionType,
          })
        "
      >
        <option v-for="type in PHYSICAL_INFLICTION_TYPES" :key="type" :value="type">
          {{ t(`nextTimeline.skillEditing.physicalInflictionTypes.${type}`) }}
        </option>
      </select>
    </label>
    <label v-else-if="event.kind === 'skillHit'">
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.skillGroupKey')"
        :help="t('nextTimeline.skillEditing.fieldHelp.eventSkillGroupKey')"
      />
      <input
        type="text"
        :value="event.skillGroupKey"
        @input="setText(($event.target as HTMLInputElement).value)"
      />
    </label>
    <template v-else-if="event.kind === 'statusExpired' || event.kind === 'statusConsumed'">
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.statusKey')"
          :help="t('nextTimeline.skillEditing.fieldHelp.eventStatusKey')"
        />
        <input
          type="text"
          :value="event.statusKey"
          @input="setText(($event.target as HTMLInputElement).value)"
        />
      </label>
      <label>
        <span>{{ t('nextTimeline.skillEditing.target') }}</span>
        <select
          :value="event.target"
          @change="
            emit('update', {
              ...event,
              target: ($event.target as HTMLSelectElement).value as CombatTarget,
            })
          "
        >
          <option v-for="target in COMBAT_TARGETS" :key="target" :value="target">
            {{ t(`nextTimeline.skillEditing.targets.${target}`) }}
          </option>
        </select>
      </label>
    </template>
  </div>
</template>

<style scoped>
.event-trigger-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.event-trigger-grid label {
  display: grid;
  gap: 6px;
}
.event-trigger-grid input,
.event-trigger-grid select,
.event-trigger-grid textarea {
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  padding: 0 6px;
}
.event-trigger-grid textarea {
  min-height: 64px;
  height: auto;
  resize: vertical;
  padding-block: 6px;
}
</style>
