<script setup lang="ts">
/**
 * 编辑技能释放条件。
 * 条件只用于合法性诊断，模拟仍会执行用户放入时间轴的技能，因此这里不会配置“阻止释放”。
 */
import { useI18n } from 'vue-i18n';
import type { CombatCondition } from '../../../core/game-data/operatorDefinition';
import { createCombatCondition } from '../combatConditionEditorViewModel';
import CombatConditionEditor from './CombatConditionEditor.vue';
import EditorFieldLabel from './EditorFieldLabel.vue';

defineProps<{ availability: CombatCondition | undefined }>();
const emit = defineEmits<{ update: [availability: CombatCondition | undefined] }>();
const { t } = useI18n({ useScope: 'global' });

function toggle(enabled: boolean): void {
  emit('update', enabled ? createCombatCondition('combatActive') : undefined);
}
</script>

<template>
  <section class="editor-section">
    <h4>{{ t('nextTimeline.skillEditing.availability') }}</h4>
    <label class="availability-toggle">
      <input
        type="checkbox"
        :checked="availability !== undefined"
        @change="toggle(($event.target as HTMLInputElement).checked)"
      />
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.enableAvailability')"
        :help="t('nextTimeline.skillEditing.fieldHelp.availability')"
      />
    </label>
    <CombatConditionEditor
      v-if="availability !== undefined"
      :condition="availability"
      @update="emit('update', $event)"
    />
  </section>
</template>

<style scoped>
.availability-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
</style>
