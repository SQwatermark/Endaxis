import { createRenderer, h, nextTick, shallowRef, ssrContextKey, type ComponentOptions } from 'vue';
import { expect, it } from 'vitest';
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
  app.mount({});
  const edit = () => {
    panel.selectedBuffId.value = 'qa';
    panel.updateBuffStep({
      kind: 'applyBuff',
      parameters: { definition: { stackingType: 'refresh' } },
    });
    panel.saveEntities({
      ...perlica.abilityEntityDefinitions,
      qa: { lifetime: { kind: 'infinite' } },
    });
  };
  try {
    edit();
    await nextTick();
    expect(currentDefinition().buffDefinitions!.qa!.durationSeconds).toBe(10);
    expect(currentDefinition().abilityEntityDefinitions!.qa!.deathReleaseDelaySeconds).toBe(2);
    expect(saves).toBe(0);
    visible.value = false;
    await nextTick();
    visible.value = true;
    await nextTick();
    expect(panel.isDirty.value).toBe(false);
    expect(panel.draft.value).toEqual(definition.value);
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
    expect(panel.draft.value.abilityEntityDefinitions.qa).not.toHaveProperty(
      'deathReleaseDelaySeconds',
    );
  } finally {
    app.unmount();
  }
});
