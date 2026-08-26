<script setup lang="ts">
import type {
  SkillBuffAbilityEventResponse,
  SkillBuffIgniteEventResponse,
} from '../../../core/game-data/operatorDefinition';

const ABILITY_EVENTS = [
  'enterFight',
  'ownerHpZero',
  'beforeTakeDamage',
  'takeCriticalDamage',
  'outputDamage',
  'beforeCastSkill',
  'skillEnd',
  'beforeAddedBuff',
  'addedBuff',
  'finishedBuff',
] as const satisfies readonly SkillBuffAbilityEventResponse['event'][];

const props = defineProps<
  | { kind: 'ability'; response: SkillBuffAbilityEventResponse }
  | { kind: 'ignite'; response: SkillBuffIgniteEventResponse }
>();
const emit = defineEmits<{
  update: [response: SkillBuffAbilityEventResponse | SkillBuffIgniteEventResponse];
}>();

function setAbilityEvent(event: Event): void {
  if (props.kind !== 'ability') return;
  emit('update', {
    ...props.response,
    event: (event.target as HTMLSelectElement).value as SkillBuffAbilityEventResponse['event'],
  });
}

function setPriority(event: Event): void {
  if (props.kind !== 'ability') return;
  const priority = Number((event.target as HTMLInputElement).value);
  if (Number.isInteger(priority)) emit('update', { ...props.response, priority });
}

function setIgniteType(event: Event): void {
  if (props.kind !== 'ignite') return;
  emit('update', { ...props.response, igniteType: (event.target as HTMLInputElement).value });
}

function setFinishAfterIgnited(event: Event): void {
  if (props.kind !== 'ignite') return;
  emit('update', {
    ...props.response,
    finishAfterIgnited: (event.target as HTMLInputElement).checked,
  });
}
</script>

<template>
  <section class="response-inspector">
    <header>
      <strong>{{ kind === 'ability' ? 'Buff Ability 事件响应' : 'Buff 点燃响应' }}</strong>
      <span>{{ kind === 'ability' ? response.event : response.igniteType }}</span>
    </header>
    <template v-if="kind === 'ability'">
      <label>
        <span>事件</span>
        <select :value="response.event" @change="setAbilityEvent">
          <option v-for="event in ABILITY_EVENTS" :key="event" :value="event">{{ event }}</option>
        </select>
      </label>
      <label>
        <span>优先级（整数）</span>
        <input type="number" step="1" :value="response.priority" @change="setPriority" />
      </label>
    </template>
    <template v-else>
      <label>
        <span>点燃类型</span>
        <input :value="response.igniteType" @change="setIgniteType" />
      </label>
      <label class="check-field">
        <input
          type="checkbox"
          :checked="response.finishAfterIgnited"
          @change="setFinishAfterIgnited"
        />
        <span>触发后结束 Buff</span>
      </label>
    </template>
    <p>响应序列在画布的子节点中编辑。</p>
  </section>
</template>

<style scoped>
.response-inspector {
  min-width: 0;
  display: grid;
  gap: 12px;
}
header {
  min-width: 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ea-border-soft);
}
header span,
label span,
p {
  color: var(--ea-fg-muted);
  font-size: 11px;
}
header span {
  min-width: 0;
  overflow-wrap: anywhere;
}
label {
  min-width: 0;
  display: grid;
  gap: 6px;
}
input,
select {
  width: 100%;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}
.check-field {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
}
.check-field input {
  width: 16px;
  height: 16px;
}
p {
  margin: 0;
}
</style>
