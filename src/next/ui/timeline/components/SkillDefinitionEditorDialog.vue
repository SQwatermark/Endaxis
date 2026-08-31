<script setup lang="ts">
/**
 * 技能逻辑编辑的独立工作区。属性面板只负责打开它；草稿、保存和取消均在弹窗边界内完成。
 * 弹窗关闭不会写场景，只有 save 事件会把完整定义交给编辑器命令层校验。
 */
import { computed, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';
import SkillDefinitionEditor from './SkillDefinitionEditor.vue';
import { ABILITY_ENTITY_IDS_KEY } from '../abilityEntityEditorContext';

const props = defineProps<{
  visible: boolean;
  embedded?: boolean;
  title: string;
  templateDefinition: SkillDefinition | null;
  customDefinition: SkillDefinition | undefined;
  skillLevel: number;
  abilityEntityIds?: readonly string[];
  buffIds?: readonly string[];
  showReferencePins?: boolean;
  allowInvalidSave?: boolean;
}>();

const emit = defineEmits<{
  'update:visible': [visible: boolean];
  save: [definition: SkillDefinition];
  reset: [];
  reference: [reference: { readonly kind: 'buff' | 'entity'; readonly id: string }];
}>();
const { t } = useI18n({ useScope: 'global' });
provide(
  ABILITY_ENTITY_IDS_KEY,
  computed(() => props.abilityEntityIds ?? []),
);

const labels = () => ({
  section: t('nextTimeline.skillEditing.section'),
  customized: t('nextTimeline.skillEditing.customized'),
  timelineBlockFrames: t('nextTimeline.skillEditing.timelineBlockFrames'),
  cooldownFrames: t('nextTimeline.skillEditing.cooldownFrames'),
  levelArrayValue: t('nextTimeline.skillEditing.levelArray'),
  costFrame: t('nextTimeline.skillEditing.costFrame'),
  costs: t('nextTimeline.skillEditing.costs'),
  costResource: t('nextTimeline.skillEditing.resource'),
  costValue: t('nextTimeline.skillEditing.value'),
  scheduledSequences: t('nextTimeline.skillEditing.sequences'),
  startFrame: t('nextTimeline.skillEditing.startFrame'),
  endFrame: t('nextTimeline.skillEditing.endFrame'),
  stepKinds: t('nextTimeline.skillEditing.steps'),
  save: t('nextTimeline.skillEditing.save'),
  cancel: t('nextTimeline.skillEditing.cancel'),
  reset: t('nextTimeline.skillEditing.reset'),
  overview: t('nextTimeline.skillEditing.overview'),
  structure: t('nextTimeline.skillEditing.structure'),
  sequence: t('nextTimeline.skillEditing.sequence'),
});
</script>

<template>
  <SkillDefinitionEditor
    v-if="embedded && visible && templateDefinition !== null"
    :template="templateDefinition"
    :custom-definition="customDefinition"
    :skill-level="skillLevel"
    :buff-ids="buffIds"
    :labels="labels()"
    :show-reference-pins="showReferencePins"
    :allow-invalid-save="allowInvalidSave"
    @save="emit('save', $event)"
    @cancel="emit('update:visible', false)"
    @reset="emit('reset')"
    @reference="emit('reference', $event)"
  />
  <el-dialog
    v-else
    :model-value="visible"
    :title="`${t('nextTimeline.skillEditing.section')} · ${title}`"
    width="min(1500px, 96vw)"
    append-to-body
    destroy-on-close
    class="skill-definition-dialog"
    @update:model-value="emit('update:visible', $event)"
  >
    <SkillDefinitionEditor
      v-if="templateDefinition !== null"
      :template="templateDefinition"
      :custom-definition="customDefinition"
      :skill-level="skillLevel"
      :buff-ids="buffIds"
      :labels="labels()"
      :show-reference-pins="showReferencePins"
      :allow-invalid-save="allowInvalidSave"
      @save="emit('save', $event)"
      @cancel="emit('update:visible', false)"
      @reset="emit('reset')"
      @reference="emit('reference', $event)"
    />
  </el-dialog>
</template>
