<script setup lang="ts">
/** 编辑事件监听器使用的战斗事件筛选。 */
import { useI18n } from 'vue-i18n';
import {
  COMBAT_TARGETS,
  DAMAGE_ELEMENTS,
  DAMAGE_TAGS,
  type CombatEventTrigger,
  type CombatTarget,
  type DamageElement,
  type DamageTag,
  type SkillTriggerScope,
} from '../../../core/game-data/operatorDefinition';
import EditorFieldLabel from './EditorFieldLabel.vue';

const props = defineProps<{ event: CombatEventTrigger }>();
const emit = defineEmits<{ update: [event: CombatEventTrigger] }>();
const { t } = useI18n({ useScope: 'global' });
const KINDS = [
  'buffApplied',
  'damageTagHit',
  'elementalInflictionApplied',
  'skillHit',
  'enemyDefeated',
  'statusExpired',
  'statusConsumed',
] as const;
const SCOPES = ['operator', 'team'] as const;

function setKind(kind: CombatEventTrigger['kind']): void {
  switch (kind) {
    case 'buffApplied':
      emit('update', { kind });
      break;
    case 'damageTagHit':
      emit('update', { kind, tag: 'normalSkill', scope: 'operator' });
      break;
    case 'elementalInflictionApplied':
      emit('update', { kind, elements: 'heat', scope: 'operator' });
      break;
    case 'skillHit':
      emit('update', { kind, skillGroupKey: 'skill', scope: 'operator' });
      break;
    case 'enemyDefeated':
      emit('update', { kind, scope: 'operator' });
      break;
    case 'statusExpired':
      emit('update', { kind, statusKey: 'status', target: 'caster' });
      break;
    case 'statusConsumed':
      emit('update', { kind, statusKey: 'status', target: 'caster' });
      break;
  }
}

function setScope(scope: SkillTriggerScope): void {
  const event = props.event;
  if (
    event.kind === 'damageTagHit' ||
    event.kind === 'elementalInflictionApplied' ||
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
.event-trigger-grid select {
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  padding: 0 6px;
}
</style>
