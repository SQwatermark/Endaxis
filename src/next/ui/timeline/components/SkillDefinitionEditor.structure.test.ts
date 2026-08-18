import { describe, expect, it } from 'vitest';
import editorSource from './SkillDefinitionEditor.vue?raw';
import inspectorSource from './TimelineActionInspector.vue?raw';
import stepEditorSource from './CombatStepEditor.vue?raw';
import branchEditorSource from './BranchStepEditor.vue?raw';
import eventListenerStepEditorSource from './EventListenerStepEditor.vue?raw';
import scheduledSequenceEditorSource from './ScheduledSequenceEditor.vue?raw';
import actionSequenceEditorSource from './ActionSequenceEditor.vue?raw';
import stepTypePickerSource from './StepTypePicker.vue?raw';
import buffStepEditorSource from './BuffStepEditor.vue?raw';
import abilityEntityStepEditorSource from './AbilityEntityStepEditor.vue?raw';
import abilityEntityTargetQueryEditorSource from './AbilityEntityTargetQueryEditor.vue?raw';
import timeDilationStepEditorSource from './TimeDilationStepEditor.vue?raw';
import { COMBAT_STEP_KINDS } from '../../../core/game-data/operatorDefinition';
import { EDITABLE_COMBAT_STEP_KINDS } from '../skillDefinitionEditorViewModel';
import { STEP_TYPE_GROUPS } from '../stepTypePickerCatalog';
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

  it('添加步骤由加号打开统一类型选单，顶层与嵌套序列使用相同交互', () => {
    expect(actionSequenceEditorSource).toContain('StepTypePicker');
    expect(branchEditorSource).toContain('StepTypePicker');
    expect(actionSequenceEditorSource).not.toContain('newStepKind');
    expect(branchEditorSource).not.toContain('newStepKind');
    expect(stepTypePickerSource).toContain('aria-haspopup="menu"');
    expect(stepTypePickerSource).toContain("emit('select', kind)");

    const listedKinds = STEP_TYPE_GROUPS.flatMap(group => group.kinds);
    expect(new Set(listedKinds).size).toBe(listedKinds.length);
    expect([...listedKinds].sort()).toEqual([...EDITABLE_COMBAT_STEP_KINDS].sort());
  });

  it('顶层与递归步骤参数都提供统一折叠入口', () => {
    expect(actionSequenceEditorSource).toContain('detailCollapsed');
    expect(actionSequenceEditorSource).toContain(':aria-expanded="!detailCollapsed"');
    expect(stepEditorSource).toContain('class="step-editor__collapse"');
    expect(stepEditorSource).toContain(':aria-expanded="!collapsed"');
    for (const locale of [zhCN, en, ru]) {
      const messages = locale.nextTimeline.skillEditing as Record<string, unknown>;
      expect(messages).toHaveProperty('collapseStep');
      expect(messages).toHaveProperty('expandStep');
    }
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

  it('能力实体使用内联定义表单并递归复用子技能时间轴编辑器', () => {
    expect(stepEditorSource).toContain('AbilityEntityStepEditor');
    expect(abilityEntityStepEditorSource).toContain('RecursiveScheduledSequenceEditor');
    expect(abilityEntityStepEditorSource).toContain('SkillBlackboardEditor');
    expect(abilityEntityStepEditorSource).toContain('ActionValueOperandEditor');
    expect(abilityEntityStepEditorSource).toContain('definition.childSkill');
    expect(abilityEntityStepEditorSource).not.toContain('templateId');
    expect(abilityEntityStepEditorSource).not.toContain('setBornTag');
    expect(abilityEntityStepEditorSource).not.toContain('appendBornTag');
  });

  it('时间膨胀表单完整编辑能力实体 ID 与 Context 查询', () => {
    expect(timeDilationStepEditorSource).toContain('AbilityEntityTargetQueryEditor');
    expect(timeDilationStepEditorSource).toContain('ignoredAbilityEntityTargets');
    expect(timeDilationStepEditorSource).toContain('abilityEntityTargets');
    expect(abilityEntityTargetQueryEditorSource).toContain("{ kind: 'ownerSpawned' }");
    expect(abilityEntityTargetQueryEditorSource).toContain("{ kind, contextKey: '' }");
    expect(abilityEntityTargetQueryEditorSource).toContain('query.abilityEntityIds');
    expect(abilityEntityTargetQueryEditorSource).not.toContain('bornTag');
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
      'abilityEntityId',
      'abilityEntityDefinition',
      'abilityEntityChildTimeline',
      'abilityEntityTimeDilationQueries',
      'abilityEntityQueryKind',
      'abilityEntityQueryKinds',
      'abilityEntityQueryContextKey',
      'abilityEntityQueryIds',
      'abilityEntityQueryAllOwnerSpawned',
      'addAbilityEntityQuery',
      'deleteAbilityEntityQuery',
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
