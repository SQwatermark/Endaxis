import { createRenderer, h, nextTick, shallowRef, ssrContextKey, type ComponentOptions } from 'vue';
import { expect, it } from 'vitest';
import { createI18n } from 'vue-i18n';
import Workspace from './OperatorDefinitionWorkspaceDialog.vue';
import { perlica } from '../../../data/operators/perlica';
import { createEmptyProject } from '../../../core/project/createProject';
import { ProjectEditorSession } from '../../../application/editor/projectEditorSession';
import {
  deriveProjectOperatorTemplate,
  getProjectDefinitionLibrary,
  replaceProjectOperatorTemplateDefinition,
} from '../../../core/project/projectDefinitionLibrary';
import {
  parseProjectDocument,
  serializeProjectDocument,
} from '../../../core/project/serialization';
import type { OperatorDefinition } from '../../../core/game-data/operatorDefinition';

it('keeps canceled Buff/entity drafts isolated and persists full replacement snapshots in one project transaction', async () => {
  const id = 'project:operator:objects-qa';
  const project = deriveProjectOperatorTemplate(
    createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' }),
    {
      id,
      name: 'Object editing QA',
      baseTemplateId: perlica.slug,
      definition: {
        ...perlica,
        buffDefinitions: {
          ...perlica.buffDefinitions,
          qa: { stackingType: 'refresh', durationSeconds: 10 },
        },
        abilityEntityDefinitions: {
          ...perlica.abilityEntityDefinitions,
          qa: { lifetime: { kind: 'limited', durationSeconds: 10 }, deathReleaseDelaySeconds: 2 },
        },
      },
    },
  );
  const session = new ProjectEditorSession(project);
  const currentDefinition = () =>
    getProjectDefinitionLibrary(session.snapshot.project).operators[id]!.definition;
  const definition = shallowRef(currentDefinition());
  const visible = shallowRef(true);
  let panel: any;
  let saves = 0;
  const renderer = createRenderer<object, object>({
    insert() {},
    remove() {},
    patchProp() {},
    setText() {},
    setElementText() {},
    createElement: () => ({}),
    createText: () => ({}),
    createComment: () => ({}),
    parentNode: () => null,
    nextSibling: () => null,
  });
  const wrapped = {
    ...(Workspace as ComponentOptions),
    setup(props: any, ctx: any) {
      panel = (Workspace as any).setup(props, ctx);
      return panel;
    },
    render: () => null,
  };
  const app = renderer.createApp({
    render: () =>
      h(wrapped, {
        visible: visible.value,
        baseDefinition: definition.value,
        customDefinition: definition.value,
        skillLevel: 1,
        'onUpdate:visible': (value: boolean) => {
          visible.value = value;
        },
        onSave: (value: OperatorDefinition) => {
          session.commit('saveOperatorTemplate', project =>
            replaceProjectOperatorTemplateDefinition(project, id, value),
          );
          definition.value = currentDefinition();
          saves++;
        },
      }),
  });
  app.provide(ssrContextKey, { modules: new Set() });
  app.use(createI18n({ legacy: false, locale: 'zh-CN', messages: {} }));
  app.mount({});
  const edit = () => {
    panel.selectSection('buffs');
    panel.openBuffDetail('qa');
    panel.updateBuffStep({
      kind: 'applyBuff',
      parameters: { definition: { stackingType: 'refresh' } },
    });
    panel.entityHistory.commit(
      {
        ...perlica.abilityEntityDefinitions,
        qa: { lifetime: { kind: 'infinite' } },
      },
      { path: '', objectId: 'qa' },
    );
  };
  try {
    // Focus is scoped to the active section; leaving/canceling does not alter the draft.
    const initial = JSON.stringify(panel.draft.value);
    panel.selectSection('skills');
    panel.showSkillEditor.value = true;
    const originalSkill = panel.selectedSkill.value;
    panel.selectedSkillHistory.commit({ ...originalSkill, timelineBlockFrames: 123 }, { path: '' });
    await nextTick();
    expect(panel.selectedSkill.value.timelineBlockFrames).toBe(123);
    expect(panel.showSkillEditor.value).toBe(true);
    panel.openReferencedDefinition({ kind: 'buff', id: 'qa' });
    expect(panel.referenceOrigins.value).toHaveLength(1);
    panel.returnToReferenceOrigin();
    expect(panel.section.value).toBe('skills');
    expect(panel.showSkillEditor.value).toBe(true);
    expect(panel.selectedSkill.value.timelineBlockFrames).toBe(123);
    panel.selectSection('buffs');
    panel.history.restore('undo');
    await nextTick();
    expect(panel.section.value).toBe('skills');
    expect(panel.showSkillEditor.value).toBe(true);
    expect(panel.selectedSkill.value).toEqual(originalSkill);
    expect(panel.history.canUndo.value).toBe(false);
    panel.selectSection('buffs');
    expect(panel.buffDetailOpen.value).toBe(false);
    panel.openBuffDetail('qa');
    expect(panel.focusedPage.value).toBe(true);
    // 详情只改变页面，不进入旧的子草稿保存模式，也不产生历史。
    expect(panel.history.canUndo.value).toBe(false);
    panel.buffDetailOpen.value = false;
    expect(JSON.stringify(panel.draft.value)).toBe(initial);
    panel.history.commit({
      ...panel.draft.value,
      passiveUi: {
        kind: 'buffProgress',
        appearance: 'liinoMusic',
        normalBuffId: 'qa',
        ultimateBuffId: 'qa',
      },
    });
    panel.openBuffDetail('qa');
    expect(panel.selectedBuffReferences.value.length).toBeGreaterThan(0);
    panel.removeBuff();
    expect(panel.draft.value.buffDefinitions?.qa).toBeUndefined();
    expect(panel.draft.value.passiveUi.normalBuffId).toBe('qa');
    expect(
      panel.draftIssues.value.some((issue: { message: string }) => issue.message.includes("'qa'")),
    ).toBe(true);
    panel.history.restore('undo');
    await nextTick();
    expect(panel.draft.value.buffDefinitions.qa).toBeDefined();
    panel.history.restore('undo');
    await nextTick();
    panel.addBuff();
    const addedId = panel.selectedBuffId.value;
    panel.history.restore('undo');
    await nextTick();
    expect(panel.buffDetailOpen.value).toBe(false);
    panel.history.restore('redo');
    await nextTick();
    expect(panel.buffDetailOpen.value).toBe(true);
    expect(panel.selectedBuffId.value).toBe(addedId);
    panel.removeBuff();
    expect(panel.buffDetailOpen.value).toBe(false);
    panel.history.restore('undo');
    await nextTick();
    expect(panel.buffDetailOpen.value).toBe(true);
    expect(panel.selectedBuffId.value).toBe(addedId);
    // 重新打开根草稿以继续原项目保存验证。
    visible.value = false;
    await nextTick();
    visible.value = true;
    await nextTick();
    for (const [section, flag] of [
      ['runtime', 'showRuntimeBehaviorEditor'],
      ['runtime', 'showComboEditor'],
    ]) {
      panel.selectSection(section);
      expect(panel.editingBehavior.value).toBe(false);
      panel[flag!].value = true;
      expect(panel.editingBehavior.value).toBe(true);
      panel[flag!].value = false;
      expect(panel.editingBehavior.value).toBe(false);
      expect(JSON.stringify(panel.draft.value)).toBe(initial);
    }
    panel.selectSection('progression');
    expect(panel.editingBehavior.value).toBe(true);
    expect(panel.upgradeSlots.value).toHaveLength(2);
    expect(panel.addUpgrade).toBeUndefined();
    expect(panel.removeUpgrade).toBeUndefined();
    expect(panel.moveUpgrade).toBeUndefined();
    panel.progressionKind.value = 'potentials';
    expect(panel.upgradeSlots.value).toHaveLength(5);
    const originalPotential = panel.draft.value.potentials[4];
    panel.selectedUpgradeIndex.value = 4;
    panel.upgradeHistory.commit(
      { ...originalPotential, initializationSequence: { steps: [] } },
      { path: 'initializationSequence' },
    );
    expect(panel.draft.value.potentials).toHaveLength(5);
    expect(panel.draft.value.potentials[4].initializationSequence.steps).toEqual([]);
    panel.history.restore('undo');
    expect(panel.draft.value.potentials[4]).toEqual(originalPotential);
    const originalGrowth = [...panel.draft.value.attributes.baseAttack];
    expect(originalGrowth).toHaveLength(6);
    panel.updatePanelStat('baseAttack', 5, { target: { value: '123' } });
    expect(panel.draft.value.attributes.baseAttack).toEqual([...originalGrowth.slice(0, 5), 123]);
    expect(panel.draft.value.attributes.baseAttack).toHaveLength(6);
    panel.history.restore('undo');
    expect(panel.draft.value.attributes.baseAttack).toEqual(originalGrowth);
    panel.updatePanelStat('baseAttack', 89, { target: { value: '999' } });
    panel.updatePanelStat('baseAttack', 0, { target: { value: '' } });
    expect(panel.draft.value.attributes.baseAttack).toEqual(originalGrowth);
    panel.selectSection('runtime');
    panel.showComboEditor.value = true;
    const originalConditions = panel.draft.value.comboSkillConditions;
    panel.comboHistory.commit(
      { ...panel.comboDocument.value, comboSkillConditions: [] },
      { path: 'comboSkillConditions[0].sequence.steps[0]', objectId: '0' },
    );
    panel.selectSection('buffs');
    panel.history.restore('undo');
    await nextTick();
    expect(panel.section.value).toBe('runtime');
    expect(panel.showComboEditor.value).toBe(true);
    expect(panel.draft.value.comboSkillConditions).toEqual(originalConditions);
    expect(currentDefinition().comboSkillConditions).toEqual(originalConditions);
    edit();
    await nextTick();
    expect(currentDefinition().buffDefinitions!.qa!.durationSeconds).toBe(10);
    expect(currentDefinition().abilityEntityDefinitions!.qa!.deathReleaseDelaySeconds).toBe(2);
    expect(saves).toBe(0);
    // 两类附属定义共用根历史，切换分类不要求先保存。
    panel.entityHistory.restore('undo');
    await nextTick();
    expect(panel.section.value).toBe('entities');
    expect(panel.draft.value.abilityEntityDefinitions.qa.deathReleaseDelaySeconds).toBe(2);
    panel.entityHistory.restore('undo');
    await nextTick();
    expect(panel.section.value).toBe('buffs');
    expect(panel.buffDetailOpen.value).toBe(true);
    expect(panel.draft.value.buffDefinitions.qa.durationSeconds).toBe(10);
    panel.entityHistory.restore('redo');
    panel.entityHistory.restore('redo');
    await nextTick();
    visible.value = false;
    await nextTick();
    visible.value = true;
    await nextTick();
    expect(panel.isDirty.value).toBe(false);
    expect(panel.draft.value).toEqual(definition.value);
    expect(panel.history.canUndo.value).toBe(false);
    expect(panel.history.canRedo.value).toBe(false);
    edit();
    await nextTick();
    panel.save();
    await nextTick();
    expect(saves).toBe(1);
    const saved = session.snapshot.project;
    const loaded = parseProjectDocument(serializeProjectDocument(saved));
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) throw new Error('saved project must reload');
    const objects = getProjectDefinitionLibrary(loaded.value).operators[id]!.definition;
    expect(objects.buffDefinitions!.qa).toEqual({ stackingType: 'refresh' });
    expect(objects.abilityEntityDefinitions!.qa).toEqual({ lifetime: { kind: 'infinite' } });
    expect(objects.skillGroups).toEqual(
      getProjectDefinitionLibrary(project).operators[id]!.definition.skillGroups,
    );
    expect(session.undo()).toBe(true);
    expect(session.snapshot.project).toBe(project);
    expect(session.undo()).toBe(false);
    expect(session.redo()).toBe(true);
    expect(session.snapshot.project).toBe(saved);
    visible.value = true;
    await nextTick();
    expect(panel.isDirty.value).toBe(false);
    expect(panel.draft.value.buffDefinitions.qa).not.toHaveProperty('durationSeconds');
    expect(panel.history.canUndo.value).toBe(false);
    expect(panel.draft.value.abilityEntityDefinitions.qa).not.toHaveProperty(
      'deathReleaseDelaySeconds',
    );
  } finally {
    app.unmount();
  }
});
