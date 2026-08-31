<script setup lang="ts">
/** 编辑原生术法爆发事件身份；这里只选择已进入统一契约的四种身份。 */
import { useI18n } from 'vue-i18n';
import type { CombatStepDefinition } from '../../../core/game-data/operatorDefinition';
import EditorFieldLabel from './EditorFieldLabel.vue';

type SpellBurstStep = Extract<CombatStepDefinition, { kind: 'triggerSpellBurst' }>;
type SpellBurstType = SpellBurstStep['parameters']['burstType'];

const SPELL_BURST_TYPES = [
  'Fire',
  'Pulse',
  'Cryst',
  'Natural',
] as const satisfies readonly SpellBurstType[];

const props = defineProps<{ step: SpellBurstStep }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();
const { t } = useI18n({ useScope: 'global' });

function setBurstType(event: Event): void {
  const burstType = (event.target as HTMLSelectElement).value as SpellBurstType;
  if (!SPELL_BURST_TYPES.includes(burstType)) return;
  emit('update', { ...props.step, parameters: { burstType } });
}
</script>

<template>
  <div class="step-editor__grid">
    <label>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.spellBurstType')"
        :help="t('nextTimeline.skillEditing.fieldHelp.spellBurstType')"
      />
      <select :value="step.parameters.burstType" @change="setBurstType">
        <option v-for="burstType in SPELL_BURST_TYPES" :key="burstType" :value="burstType">
          {{ t(`nextTimeline.skillEditing.spellBurstTypes.${burstType}`) }}
        </option>
      </select>
    </label>
  </div>
</template>
