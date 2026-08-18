<script setup lang="ts">
/**
 * 战斗步骤编辑器的统一入口。
 *
 * 本组件只负责按 kind 路由到对应专用子编辑器，并绘制统一的外框与标题；
 * 具体字段编辑逻辑落在按领域拆分的子编辑器中，避免这里堆叠参数处理函数。
 */
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { CaretBottom, CaretRight } from '@element-plus/icons-vue';
import type { CombatStepDefinition } from '../../../core/game-data/operatorDefinition';
import ActionValueStepEditor from './ActionValueStepEditor.vue';
import DamageStepEditor from './DamageStepEditor.vue';
import HealStepEditor from './HealStepEditor.vue';
import ElementalReactionStepEditor from './ElementalReactionStepEditor.vue';
import BuffStepEditor from './BuffStepEditor.vue';
import BuffManagementStepEditor from './BuffManagementStepEditor.vue';
import MechanicStepEditor from './MechanicStepEditor.vue';
import ResourceStepEditor from './ResourceStepEditor.vue';
import StatusStepEditor from './StatusStepEditor.vue';
import BranchStepEditor from './BranchStepEditor.vue';
import EditorHelpHint from './EditorHelpHint.vue';
import EventListenerStepEditor from './EventListenerStepEditor.vue';
import TimeDilationStepEditor from './TimeDilationStepEditor.vue';
import AbilityEntityStepEditor from './AbilityEntityStepEditor.vue';
import SkillCooldownStepEditor from './SkillCooldownStepEditor.vue';
import {
  EDITABLE_COMBAT_STEP_KINDS,
  type EditableCombatStepKind,
} from '../skillDefinitionEditorViewModel';

const props = defineProps<{
  step: CombatStepDefinition;
  skillLevel: number;
  showHeader?: boolean;
  createStep?: (kind: EditableCombatStepKind) => CombatStepDefinition;
  duplicateStep?: (step: CombatStepDefinition) => CombatStepDefinition;
}>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();
const { t } = useI18n({ useScope: 'global' });
const collapsed = ref(false);

const stepHelp = computed(() => t(`nextTimeline.skillEditing.stepHelp.${props.step.kind}`));

const editable = computed(() => EDITABLE_COMBAT_STEP_KINDS.some(kind => kind === props.step.kind));

function forward(step: CombatStepDefinition): void {
  emit('update', step);
}
</script>

<template>
  <section class="step-editor">
    <header v-if="showHeader !== false">
      <div>
        <span>{{ t('nextTimeline.skillEditing.stepParameters') }}</span>
        <strong>{{ t(`nextTimeline.skillEditing.stepKinds.${step.kind}`) }}</strong>
        <EditorHelpHint :text="stepHelp" />
      </div>
      <button
        type="button"
        class="step-editor__collapse"
        :aria-expanded="!collapsed"
        :title="
          t(
            collapsed
              ? 'nextTimeline.skillEditing.expandStep'
              : 'nextTimeline.skillEditing.collapseStep',
          )
        "
        @click="collapsed = !collapsed"
      >
        <el-icon><CaretRight v-if="collapsed" /><CaretBottom v-else /></el-icon>
      </button>
    </header>

    <div v-show="!collapsed" class="step-editor__body">
      <template
        v-if="step.kind === 'startTimeDilation' || step.kind === 'startUltimateTimeDilation'"
      >
        <TimeDilationStepEditor :step="step" @update="forward" />
      </template>
      <template v-else-if="step.kind === 'adjustSkillCooldown'">
        <SkillCooldownStepEditor :step="step" @update="forward" />
      </template>
      <template
        v-else-if="
          step.kind === 'dealDamage' ||
          step.kind === 'dealFixedDamage' ||
          step.kind === 'dealStagger' ||
          step.kind === 'applyElementalInfliction'
        "
      >
        <DamageStepEditor :step="step" :skill-level="skillLevel" @update="forward" />
      </template>
      <template v-else-if="step.kind === 'heal'">
        <HealStepEditor :step="step" :skill-level="skillLevel" @update="forward" />
      </template>
      <template
        v-else-if="step.kind === 'modifyActionValue' || step.kind === 'calculateActionValue'"
      >
        <ActionValueStepEditor :step="step" :skill-level="skillLevel" @update="forward" />
      </template>
      <template
        v-else-if="step.kind === 'changeResource' || step.kind === 'changeResourceByActionValue'"
      >
        <ResourceStepEditor :step="step" :skill-level="skillLevel" @update="forward" />
      </template>
      <template v-else-if="step.kind === 'applyStatus' || step.kind === 'consumeStatus'">
        <StatusStepEditor :step="step" :skill-level="skillLevel" @update="forward" />
      </template>
      <template
        v-else-if="
          step.kind === 'applyElementalReaction' || step.kind === 'consumeElementalReaction'
        "
      >
        <ElementalReactionStepEditor :step="step" @update="forward" />
      </template>
      <template v-else-if="step.kind === 'applyBuff'">
        <BuffStepEditor
          :step="step"
          :skill-level="skillLevel"
          :create-step="createStep"
          :duplicate-step="duplicateStep"
          @update="forward"
        />
      </template>
      <template v-else-if="step.kind === 'spawnAbilityEntity'">
        <AbilityEntityStepEditor
          :step="step"
          :skill-level="skillLevel"
          :create-step="createStep"
          :duplicate-step="duplicateStep"
          @update="forward"
        />
      </template>
      <template
        v-else-if="
          step.kind === 'readBuffBlackboard' ||
          step.kind === 'readBuffStackCount' ||
          step.kind === 'finishBuffsByTag' ||
          step.kind === 'finishBuffsById' ||
          step.kind === 'holdBuffsById'
        "
      >
        <BuffManagementStepEditor :step="step" @update="forward" />
      </template>
      <template
        v-else-if="
          step.kind === 'createTimedMarker' ||
          step.kind === 'gainSquadUltimateEnergyFromSkillCost' ||
          step.kind === 'gainFinisherSp' ||
          step.kind === 'setContextFlag' ||
          step.kind === 'openComboWindow'
        "
      >
        <MechanicStepEditor :step="step" :skill-level="skillLevel" @update="forward" />
      </template>
      <template v-else-if="step.kind === 'conditional' || step.kind === 'once'">
        <BranchStepEditor
          :step="step"
          :skill-level="skillLevel"
          :create-step="createStep"
          :duplicate-step="duplicateStep"
          @update="forward"
        />
      </template>
      <template v-else-if="step.kind === 'listenForCombatEvents'">
        <EventListenerStepEditor
          :step="step"
          :skill-level="skillLevel"
          :create-step="createStep"
          :duplicate-step="duplicateStep"
          @update="forward"
        />
      </template>

      <p v-else-if="!editable" class="step-editor__unsupported">
        {{ t('nextTimeline.skillEditing.unsupportedStepEditor') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.step-editor {
  min-width: 0;
  container-type: inline-size;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-workbench-panel);
}

.step-editor > header {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 12px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.step-editor > header div {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.step-editor__collapse {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  background: transparent;
  color: var(--ea-fg-muted);
  cursor: pointer;
}

.step-editor__collapse:hover {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}

.step-editor > header span,
.step-editor :deep(label > span),
.step-editor :deep(em) {
  color: var(--ea-fg-muted);
  font-size: 10px;
}

.step-editor :deep(.step-editor__grid) {
  display: grid;
  grid-template-columns: repeat(2, minmax(240px, 1fr));
  gap: 12px 16px;
  padding: 14px;
}

.step-editor :deep(.step-editor__grid > label) {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(88px, 112px) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}

.step-editor :deep(.step-editor__operand) {
  grid-column: 1 / -1;
}

@container (max-width: 560px) {
  .step-editor :deep(.step-editor__grid) {
    grid-template-columns: 1fr;
  }
}

.step-editor :deep(input[type='number']),
.step-editor :deep(input[type='text']),
.step-editor :deep(select) {
  min-width: 0;
  max-width: 100%;
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  padding: 0 6px;
}

.step-editor :deep(em) {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.step-editor :deep(fieldset) {
  margin: 0 14px 14px;
  padding: 10px;
  border: 1px solid var(--ea-border-soft);
}

.step-editor :deep(legend) {
  padding: 0 5px;
  color: var(--ea-fg-muted);
  font-size: 10px;
}

.step-editor :deep(.step-editor__check) {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 3px 14px 3px 0;
}

.step-editor :deep(.step-editor__check--field) {
  display: flex !important;
  grid-template-columns: auto 1fr !important;
  justify-content: flex-start;
  margin-right: 0;
}

.step-editor__unsupported {
  margin: 0;
  padding: 24px;
  color: var(--ea-fg-muted);
  text-align: center;
}
</style>
