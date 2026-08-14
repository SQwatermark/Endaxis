import { describe, expect, it } from 'vitest';
import editorSource from './SkillDefinitionEditor.vue?raw';
import inspectorSource from './TimelineActionInspector.vue?raw';
import stepEditorSource from './CombatStepEditor.vue?raw';
import branchEditorSource from './BranchStepEditor.vue?raw';
import eventListenerStepEditorSource from './EventListenerStepEditor.vue?raw';
import scheduledSequenceEditorSource from './ScheduledSequenceEditor.vue?raw';
import actionSequenceEditorSource from './ActionSequenceEditor.vue?raw';
import buffStepEditorSource from './BuffStepEditor.vue?raw';
import { COMBAT_STEP_KINDS } from '../../../core/game-data/operatorDefinition';
import zhCN from '../../../../i18n/locales/zh-CN.json';
import en from '../../../../i18n/locales/en.json';
import ru from '../../../../i18n/locales/ru.json';

describe('SkillDefinitionEditor structure', () => {
  it('差异数量由 i18n 参数插值，不对已翻译文本做字符串替换', () => {
    expect(editorSource).toContain(
      "t('nextTimeline.skillEditing.diffCount', { count: view.diffCount })",
    );
    expect(editorSource).not.toContain("replace('{count}'");
  });

  it('步骤列表和参数标题不暴露内部 key 或原始参数字段名', () => {
    expect(editorSource).not.toContain('step.parameterNames.join');
    expect(editorSource).not.toContain('<small v-if="step.key"');
    expect(stepEditorSource).not.toContain('{{ step.key }}');
  });

  it('步骤编辑器按当前步骤身份重建，避免切换后保留上一项视图', () => {
    expect(editorSource).toContain('ScheduledSequenceEditor');
    expect(scheduledSequenceEditorSource).toContain('ActionSequenceEditor');
    expect(scheduledSequenceEditorSource).not.toContain('CombatStepEditor');
    expect(actionSequenceEditorSource).toContain('CombatStepEditor');
    expect(eventListenerStepEditorSource).toContain('ActionSequenceEditor');
    expect(eventListenerStepEditorSource).toContain('CombatEventTriggerEditor');
  });

  it('Buff 生命周期复用通用动作序列编辑器', () => {
    expect(buffStepEditorSource).toContain('ActionSequenceEditor');
    for (const key of [
      'start',
      'enable',
      'disable',
      'beforeEnhance',
      'enhanceChanged',
      'afterEnhance',
      'trigger',
      'finish',
    ]) {
      expect(buffStepEditorSource).toContain(`'${key}'`);
    }
    for (const locale of [zhCN, en, ru]) {
      const messages = locale.nextTimeline.skillEditing as Record<string, unknown>;
      expect(messages).toHaveProperty('buffLifecycle');
      expect(messages).toHaveProperty('enableBuffLifecycle');
      expect(messages).toHaveProperty('buffLifecycleKinds');
    }
  });

  it('Next 属性面板只使用自身完整的翻译命名空间', () => {
    expect(inspectorSource).not.toContain("t('propertiesPanel.sections.");
    expect(inspectorSource).not.toContain("t('propertiesPanel.labels.");
    expect(inspectorSource).toContain("t('nextTimeline.inspector.sections.basic')");
  });

  it('步骤表单按自身容器宽度收缩，不依赖浏览器视口断点', () => {
    expect(stepEditorSource).toContain('container-type: inline-size');
    expect(stepEditorSource).toContain('@container (max-width: 560px)');
    expect(stepEditorSource).toContain('grid-template-columns: minmax(88px, 112px) minmax(0, 1fr)');
    expect(stepEditorSource).not.toContain('@media (max-width: 1120px)');
  });

  it('高价值步骤编辑器使用的翻译在三种语言中齐全', () => {
    const keys = [
      'operandConstant',
      'operandBlackboard',
      'operandBlackboardKey',
      'operandConstantValue',
      'fixedValue',
      'blackboardKey',
      'operation',
      'operandLeft',
      'operandRight',
      'statusKey',
      'target',
      'durationFrames',
      'stacks',
      'maxStacks',
      'targets',
      'reaction',
      'reactions',
      'durationSeconds',
      'effectiveness',
      'markerId',
      'autoFinishByAction',
      'coefficient',
      'factor',
      'contextFlag',
      'contextValueType',
      'valueTypes',
      'booleanValues',
    ];
    for (const locale of [zhCN, en, ru]) {
      const messages = locale.nextTimeline.skillEditing as Record<string, unknown>;
      for (const key of keys) expect(messages).toHaveProperty(key);
      const stepHelp = messages.stepHelp as Record<string, unknown>;
      for (const kind of COMBAT_STEP_KINDS) expect(stepHelp).toHaveProperty(kind);
      expect(messages).toHaveProperty('fieldHelp');
    }
  });

  it('路由组件不再承载具体步骤参数编辑逻辑', () => {
    for (const name of ['setDamageType', 'setModifyOperation', 'setResource', 'setStatusKey']) {
      expect(stepEditorSource).not.toContain(`function ${name}`);
    }
    for (const component of [
      'DamageStepEditor',
      'ActionValueStepEditor',
      'ResourceStepEditor',
      'StatusStepEditor',
      'ElementalReactionStepEditor',
      'MechanicStepEditor',
      'BuffStepEditor',
      'BuffManagementStepEditor',
      'BranchStepEditor',
      'EventListenerStepEditor',
    ]) {
      expect(stepEditorSource).toContain(component);
    }
    for (const component of ['SkillBlackboardEditor', 'SkillAvailabilityEditor']) {
      expect(editorSource).toContain(component);
    }
    expect(branchEditorSource).toContain('CombatConditionEditor');
  });
});
