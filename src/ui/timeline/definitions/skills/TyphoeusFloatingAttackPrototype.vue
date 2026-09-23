<script setup lang="ts">
/** 开发用验收入口：用真实生成定义检查大型内联技能的分层浏览体验。 */
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SkillDefinition } from '../../../../core/game-data/operatorDefinition';
import { typhoeusChr_0034_typhoea_floating_attack1 } from '../../../../data/operators/typhoeus.generated';
import SkillDefinitionEditor from './SkillDefinitionEditor.vue';

const { t } = useI18n({ useScope: 'global' });
const customDefinition = ref<SkillDefinition>();
const editorVersion = ref(0);
const labels = computed(() => ({
  section: t('timeline.skillEditing.section'),
  customized: t('timeline.skillEditing.customized'),
  timelineBlockFrames: t('timeline.skillEditing.timelineBlockFrames'),
  cooldownFrames: t('timeline.skillEditing.cooldownFrames'),
  levelArrayValue: t('timeline.skillEditing.levelArray'),
  costFrame: t('timeline.skillEditing.costFrame'),
  costs: t('timeline.skillEditing.costs'),
  costResource: t('timeline.skillEditing.resource'),
  costValue: t('timeline.skillEditing.value'),
  scheduledSequences: t('timeline.skillEditing.sequences'),
  startFrame: t('timeline.skillEditing.startFrame'),
  endFrame: t('timeline.skillEditing.endFrame'),
  stepKinds: t('timeline.skillEditing.steps'),
  save: t('timeline.skillEditing.save'),
  cancel: t('timeline.skillEditing.cancel'),
  reset: t('timeline.skillEditing.reset'),
  overview: t('timeline.skillEditing.overview'),
  structure: t('timeline.skillEditing.structure'),
  sequence: t('timeline.skillEditing.sequence'),
}));

function reset() {
  customDefinition.value = undefined;
  editorVersion.value++;
}
</script>

<template>
  <main class="prototype-page">
    <header>
      <div>
        <h1>提弗洛斯 · 浮空普攻 1</h1>
        <p>按时间入口进入，再逐层查看动作、分支和作用域。右侧仍编辑原技能定义。</p>
      </div>
      <RouterLink to="/timeline">返回时间轴</RouterLink>
    </header>
    <SkillDefinitionEditor
      :key="editorVersion"
      :template="typhoeusChr_0034_typhoea_floating_attack1"
      :custom-definition="customDefinition"
      :skill-level="3"
      :labels="labels"
      initial-flow-view
      @save="customDefinition = $event"
      @cancel="editorVersion++"
      @reset="reset"
    />
    <p class="prototype-note">此入口仅在开发模式提供；保存只影响当前页面，不写入项目。</p>
  </main>
</template>

<style scoped>
.prototype-page {
  min-height: 100vh;
  padding: 24px;
  background: var(--ea-workbench-panel);
  color: var(--ea-fg);
}
.prototype-page > header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
}
h1 {
  margin: 0 0 8px;
  font-size: 20px;
}
p {
  margin: 0;
  color: var(--ea-fg-muted);
}
a {
  color: var(--ea-gold);
}
.prototype-note {
  margin-top: 12px;
  font-size: 12px;
}
:deep(.skill-editor) {
  height: calc(100vh - 160px);
}
</style>
