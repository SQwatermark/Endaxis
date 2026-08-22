import { describe, expect, it } from 'vitest';
import editorSource from './SkillDefinitionEditor.vue?raw';
import inspectorSource from './TimelineActionInspector.vue?raw';
import stepEditorSource from './CombatStepEditor.vue?raw';
import branchEditorSource from './BranchStepEditor.vue?raw';
import eventListenerStepEditorSource from './EventListenerStepEditor.vue?raw';
import scheduledSequenceEditorSource from './ScheduledSequenceEditor.vue?raw';
import actionSequenceEditorSource from './ActionSequenceEditor.vue?raw';
import stepTypePickerSource from './StepTypePicker.vue?raw';
import conditionTypePickerSource from './CombatConditionTypePicker.vue?raw';
import conditionEditorSource from './CombatConditionEditor.vue?raw';
import responseInspectorSource from './CombatEventResponseInspector.vue?raw';
import skillHandlerInspectorSource from './SkillEventHandlerInspector.vue?raw';
import buffStepEditorSource from './BuffStepEditor.vue?raw';
import abilityEntityStepEditorSource from './AbilityEntityStepEditor.vue?raw';
import abilityEntityGraphEditorSource from './AbilityEntityDefinitionGraphEditor.vue?raw';
import buffGraphEditorSource from './BuffDefinitionGraphEditor.vue?raw';
import buffEventResponseInspectorSource from './BuffEventResponseInspector.vue?raw';
import structureMapSource from './SkillStructureMindMap.vue?raw';
import timelineEditorSource from '../NextTimelineEditor.vue?raw';
import abilityEntityTargetQueryEditorSource from './AbilityEntityTargetQueryEditor.vue?raw';
import timeDilationStepEditorSource from './TimeDilationStepEditor.vue?raw';
import healStepEditorSource from './HealStepEditor.vue?raw';
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

  it('技能右栏只编辑当前导图节点，不再重复渲染子步骤列表', () => {
    expect(editorSource).toContain('CombatStepEditor');
    expect(editorSource).toContain('inspector-only');
    expect(editorSource).not.toContain('ScheduledSequenceEditor');
    expect(editorSource).not.toContain('ActionSequenceEditor');
    expect(scheduledSequenceEditorSource).toContain('ActionSequenceEditor');
    expect(scheduledSequenceEditorSource).not.toContain('CombatStepEditor');
    expect(actionSequenceEditorSource).toContain('CombatStepEditor');
    expect(eventListenerStepEditorSource).toContain('ActionSequenceEditor');
    expect(eventListenerStepEditorSource).toContain('CombatEventTriggerEditor');
  });

  it('Buff 与能力实体定义也使用纯当前层 Inspector，并从导图节点添加子项', () => {
    for (const source of [buffGraphEditorSource, abilityEntityGraphEditorSource]) {
      expect(source).toContain('SkillStructureMindMap');
      expect(source).toContain('@add-child="beginAdd"');
      expect(source).toContain('CombatStepEditor');
      expect(source).toContain('inspector-only');
      expect(source).toContain('hide-trigger');
      expect(source).toContain(':anchor="insertAnchor"');
      expect(source).not.toContain('ActionSequenceEditor');
      expect(source).not.toContain('ScheduledSequenceEditor');
    }
    expect(abilityEntityGraphEditorSource).not.toContain('AbilityEntityStepEditor');
    expect(abilityEntityGraphEditorSource).toContain("selectedId === 'entity:lifetime'");
    expect(abilityEntityGraphEditorSource).toContain('setLifetimeKind');
    expect(buffGraphEditorSource).toContain('lifecyclePickerStyle');
    expect(buffGraphEditorSource).toContain('@keydown.esc.stop="pendingMode = \'\'"');
  });

  it('Buff Inspector 渲染图标且清空路径时保留其余原生展示身份', () => {
    expect(buffStepEditorSource).toContain('class="buff-icon-preview"');
    expect(buffStepEditorSource).toContain(':src="previewIconPath"');
    expect(buffStepEditorSource).toContain('presentation?.iconId');
    expect(buffStepEditorSource).toContain('remainingPresentation');
    expect(buffStepEditorSource).not.toContain("if (iconPath === '') delete next.presentation");
  });

  it('正式导图贯通拖放与本地结构剪贴板，并提供可见粘贴入口', () => {
    for (const source of [editorSource, buffGraphEditorSource, abilityEntityGraphEditorSource]) {
      expect(source).toContain('@move-node="moveStructureNode"');
      expect(source).toContain('@node-action="runStructureNodeAction"');
      expect(source).toContain('clipboard-kind');
    }
    expect(structureMapSource).toContain("emit('moveNode'");
    expect(structureMapSource).toContain('粘贴到此处');
    expect(structureMapSource).toContain('剪贴板：');
    expect(structureMapSource).toContain('clipboardKind !== undefined');
    expect(structureMapSource).toContain('node-drag-handle');
    expect(structureMapSource).toContain('transferCollapsedState');
    expect(structureMapSource).toContain("emit('historyAction', event.shiftKey ? 'redo' : 'undo')");
    expect(structureMapSource).toContain('event.stopImmediatePropagation()');
    for (const source of [editorSource, buffGraphEditorSource, abilityEntityGraphEditorSource]) {
      expect(source).toContain('transferCollapsedState(operation.source.id, movedNode.id)');
      expect(source).toContain('@history-action="restoreStructureHistory"');
      expect(source).toContain(':can-undo="canUndoStructure"');
      expect(source).toContain(':can-redo="canRedoStructure"');
    }
    expect(timelineEditorSource).toContain('showOperatorDefinitionWorkspace.value ||');
    expect(timelineEditorSource).toContain('showSkillDefinitionEditor.value ||');
  });

  it('结构图选择沿 sourcePath 精确定位顶层和递归步骤', () => {
    expect(editorSource).toContain('selectedStructureSourcePath');
    expect(editorSource).toContain('resolveSkillStructureValue');
    expect(editorSource).toContain('replaceCombatStepAtPath');
    expect(editorSource).toContain('@add-child="beginAddChild"');
    expect(scheduledSequenceEditorSource).toContain(':selected-path="selectedStepPath"');
    expect(actionSequenceEditorSource).toContain('match(/^steps\\[(\\d+)\\]/)');
    expect(actionSequenceEditorSource).toContain(':selected-path="nestedSelectedPath"');
    expect(stepEditorSource).toContain(':selected-path="selectedPath"');
    expect(branchEditorSource).toContain('match(/^(whenTrue|whenFalse|body)\\.steps\\[(\\d+)\\]/)');
    expect(branchEditorSource).toContain(':selected-path="nestedSelectedPath"');
  });

  it('添加步骤由加号打开统一类型选单，顶层与嵌套序列使用相同交互', () => {
    expect(actionSequenceEditorSource).toContain('StepTypePicker');
    expect(branchEditorSource).toContain('StepTypePicker');
    expect(actionSequenceEditorSource).not.toContain('newStepKind');
    expect(branchEditorSource).not.toContain('newStepKind');
    expect(stepTypePickerSource).toContain('aria-haspopup="menu"');
    expect(stepTypePickerSource).toContain("emit('select', kind)");
    expect(stepTypePickerSource).toContain('props.anchor');
    expect(stepTypePickerSource).toContain('@keydown.esc.stop="close"');
    expect(stepTypePickerSource).toContain("emit('close')");

    const listedKinds = STEP_TYPE_GROUPS.flatMap(group => group.kinds);
    expect(new Set(listedKinds).size).toBe(listedKinds.length);
    expect([...listedKinds].sort()).toEqual([...EDITABLE_COMBAT_STEP_KINDS].sort());
  });

  it('技能可用条件与分支条件使用导图节点和纯本层 Inspector', () => {
    expect(editorSource).toContain('CombatConditionTypePicker');
    expect(editorSource).toContain('appendConditionToPendingTarget');
    expect(editorSource).toContain('selectedCombatCondition');
    expect(editorSource).toContain('layer-only');
    expect(editorSource).not.toContain('SkillAvailabilityEditor');
    expect(branchEditorSource).toContain("step.kind === 'conditional' && !inspectorOnly");
    expect(conditionTypePickerSource).toContain('COMBAT_CONDITION_KINDS');
    expect(conditionEditorSource).toContain('!layerOnly && condition.kind');
  });

  it('临时事件监听器把响应、条件和序列展开到技能导图', () => {
    expect(editorSource).toContain('selectedEventResponse');
    expect(editorSource).toContain('CombatEventResponseInspector');
    expect(editorSource).toContain('appendEventResponse');
    expect(editorSource).toContain("kind: 'eventResponse'");
    expect(responseInspectorSource).toContain('CombatEventTriggerEditor');
    expect(responseInspectorSource).not.toContain('ActionSequenceEditor');
    expect(stepEditorSource).toContain('v-if="!inspectorOnly"');
    expect(stepEditorSource).toContain('事件响应在左侧导图中添加和选择');
  });

  it('技能顶层事件处理器通过导图编辑条件与调度序列', () => {
    expect(editorSource).toContain('selectedSkillEventHandler');
    expect(editorSource).toContain('appendSkillEventHandler');
    expect(editorSource).toContain('createSkillEventHandlerDraft');
    expect(editorSource).toContain('SkillEventHandlerInspector');
    expect(skillHandlerInspectorSource).toContain('CombatEventTriggerEditor');
    expect(skillHandlerInspectorSource).not.toContain('ScheduledSequenceEditor');
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

  it('Buff 事件响应在导图展开，右栏只编辑响应本层字段', () => {
    expect(buffGraphEditorSource).toContain('selectedAbilityResponse');
    expect(buffGraphEditorSource).toContain('selectedIgniteResponse');
    expect(buffGraphEditorSource).toContain('createBuffAbilityEventResponseDraft');
    expect(buffGraphEditorSource).toContain('createBuffIgniteEventResponseDraft');
    expect(buffGraphEditorSource).toContain('BuffEventResponseInspector');
    expect(buffEventResponseInspectorSource).toContain('ABILITY_EVENTS');
    expect(buffEventResponseInspectorSource).not.toContain('ActionSequenceEditor');
  });

  it('Buff 调度序列贯通集合操作、帧 Inspector 和步骤树', () => {
    expect(buffGraphEditorSource).toContain('selectedSequence');
    expect(buffGraphEditorSource).toContain('appendSequence');
    expect(buffGraphEditorSource).toContain('updateSequenceFrame');
    expect(buffGraphEditorSource).toContain("kind: 'scheduledSequence'");
    expect(buffGraphEditorSource).toContain('copySequence');
    expect(buffGraphEditorSource).toContain("await selectPath('scheduledSequences')");
  });

  it('Buff 内部条件与监听响应具备正式导图编辑操作', () => {
    expect(buffGraphEditorSource).toContain('selectedCombatCondition');
    expect(buffGraphEditorSource).toContain('selectedEventResponse');
    expect(buffGraphEditorSource).toContain('CombatConditionTypePicker');
    expect(buffGraphEditorSource).toContain('CombatConditionEditor');
    expect(buffGraphEditorSource).toContain('CombatEventResponseInspector');
    expect(buffGraphEditorSource).toContain('appendCondition');
    expect(buffGraphEditorSource).toContain('appendEventResponse');
    expect(buffGraphEditorSource).toContain("node.payloadKind === 'combatCondition'");
    expect(buffGraphEditorSource).toContain("node.payloadKind === 'eventResponse'");
    expect(buffGraphEditorSource).toContain('runtimeSequences');
  });

  it('能力实体子技能复用条件与监听响应的递归编辑语义', () => {
    expect(abilityEntityGraphEditorSource).toContain('selectedCombatCondition');
    expect(abilityEntityGraphEditorSource).toContain('selectedEventResponse');
    expect(abilityEntityGraphEditorSource).toContain('CombatConditionTypePicker');
    expect(abilityEntityGraphEditorSource).toContain('CombatEventResponseInspector');
    expect(abilityEntityGraphEditorSource).toContain('appendCondition');
    expect(abilityEntityGraphEditorSource).toContain('appendEventResponse');
    expect(abilityEntityGraphEditorSource).toContain("node.payloadKind === 'combatCondition'");
    expect(abilityEntityGraphEditorSource).toContain("node.payloadKind === 'eventResponse'");
  });

  it('固定结构字段使用端口关系的连线与节点轮廓', () => {
    expect(structureMapSource).toContain("node.relationToParent === 'port'");
    expect(structureMapSource).toContain('固定字段端口');
    expect(structureMapSource).toContain('.edge-layer path.port');
    expect(structureMapSource).toContain('.map-node.port');
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

  it('治疗步骤使用正常技能表单编辑完整公式与目标', () => {
    expect(stepEditorSource).toContain('HealStepEditor');
    expect(healStepEditorSource).toContain('HEAL_TARGETS');
    expect(healStepEditorSource).toContain('OPERATOR_ATTRIBUTES');
    expect(healStepEditorSource).toContain('ActionValueOperandEditor');
    expect(healStepEditorSource).toContain('tagIds');
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
    for (const source of [buffGraphEditorSource, abilityEntityGraphEditorSource]) {
      expect(source).toContain('container-type: inline-size');
      expect(source).toContain('@container (max-width: 420px)');
    }
    expect(editorSource).toContain('@media (max-width: 820px)');
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
      'HealStepEditor',
    ]) {
      expect(stepEditorSource).toContain(component);
    }
    expect(editorSource).toContain('SkillBlackboardEditor');
    expect(editorSource).toContain('CombatConditionEditor');
    expect(branchEditorSource).toContain('CombatConditionEditor');
  });
});
