import { createRenderer, h, nextTick, shallowRef, ssrContextKey } from 'vue';
import { createI18n } from 'vue-i18n';
import { expect, it, vi } from 'vitest';
import Workspace from './ActionSequenceWorkspace.vue';
import Graph from './ActionSequenceGraphEditor.vue';
import Form from './ActionSequenceEditor.vue';

it('retains one history across graph/form unmounts and does not replay into a replaced sequence', async () => {
  vi.stubGlobal('document', { addEventListener() {}, removeEventListener() {} });
  const initial = {
    steps: [{ kind: 'finishActionOwnerAbilityEntity', parameters: {}, key: 'initial' }],
  };
  const sequence = shallowRef<any>(initial);
  let workspace: any;
  let child: any;
  const wrap = (component: any) => ({
    ...component,
    setup(props: any, ctx: any) {
      child = component.setup(props, ctx);
      return child;
    },
    render: () => null,
  });
  const graph = wrap(Graph);
  const form = wrap(Form);
  const createStep = () => initial.steps[0];
  const duplicateStep = (value: any) => structuredClone(value);
  const host = {
    ...(Workspace as any),
    setup(props: any, ctx: any) {
      workspace = (Workspace as any).setup(props, ctx);
      return workspace;
    },
    // Mount both real child setups; DOM/template layout is verified separately in browser.
    render: () =>
      h(workspace.view.value === 'graph' ? graph : form, {
        sequence: sequence.value,
        skillLevel: 1,
        createStep,
        duplicateStep,
        sharedHistory: workspace.history,
        standaloneHistory: true,
      }),
  };
  const app = createRenderer<object, object>({
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
  }).createApp({
    render: () =>
      h(host, {
        sequence: sequence.value,
        skillLevel: 1,
        createStep,
        duplicateStep,
        onUpdate: (value: unknown) => {
          sequence.value = value;
        },
      }),
  });
  app.provide(ssrContextKey, { modules: new Set() });
  app.use(createI18n({ legacy: false, locale: 'zh-CN', messages: {} }));
  app.mount({});
  try {
    const history = workspace.history;
    child.selectNode({ id: 'action-sequence:step:0' });
    child.updateValue({ ...initial.steps[0], key: 'graph-edit' });
    await nextTick();
    workspace.showDetails('steps[0]');
    await nextTick();
    expect(workspace.formPath.value).toBe('steps[0]');
    expect(child.history).toBe(history);
    child.replaceStep({ ...initial.steps[0], key: 'form-edit' });
    await nextTick();
    workspace.view.value = 'graph';
    await nextTick();
    expect(child.history).toBe(history);
    child.history.restore('undo');
    await nextTick();
    expect(sequence.value.steps[0].key).toBe('graph-edit');
    child.history.restore('undo');
    await nextTick();
    expect(sequence.value).toEqual(initial);
    child.history.restore('redo');
    await nextTick();
    child.history.restore('redo');
    await nextTick();
    expect(sequence.value.steps[0].key).toBe('form-edit');
    sequence.value = { steps: [] };
    await nextTick();
    expect(history.canUndo.value).toBe(false);
    expect(history.canRedo.value).toBe(false);
  } finally {
    app.unmount();
    vi.unstubAllGlobals();
  }
});
