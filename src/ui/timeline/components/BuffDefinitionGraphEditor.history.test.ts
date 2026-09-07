import { createRenderer, h, nextTick, shallowRef, ssrContextKey, type ComponentOptions } from 'vue';
import { expect, it, vi } from 'vitest';
import Graph from './BuffDefinitionGraphEditor.vue';

it('records Inspector edits and invalidates redo when editing after undo', async () => {
  vi.stubGlobal('document', { addEventListener() {}, removeEventListener() {} });
  const definition = shallowRef<any>({
    scheduledSequences: [{ startFrame: 0, sequence: { steps: [] } }],
  });
  let panel: any;
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
    ...(Graph as ComponentOptions),
    setup(props: any, ctx: any) {
      panel = (Graph as any).setup(props, ctx);
      return panel;
    },
    render: () => null,
  };
  const app = renderer.createApp({
    render: () =>
      h(wrapped, {
        buffId: 'test',
        definition: definition.value,
        skillLevel: 1,
        onUpdate: (value: unknown) => {
          definition.value = value;
        },
      }),
  });
  app.provide(ssrContextKey, { modules: new Set() });
  app.mount({});
  try {
    const edits = [
      () =>
        panel.updateRootStep({
          kind: 'applyBuff',
          parameters: {
            definition: { ...definition.value, durationSeconds: 5 },
          },
        }),
      () => {
        panel.selectedPath.value = 'scheduledSequences[0]';
        panel.updateSequenceFrame('startFrame', { target: { value: '12' } });
      },
      () => {
        panel.selectedPath.value = 'lifecycleSequences.start.steps[0]';
        panel.editing.property.value.child('kind').update(() => 'finishCurrentAbilityEntity');
      },
      () => {
        panel.selectedPath.value = 'abilityEventResponses[0]';
        panel.updateResponse({ event: 'outputDamage', priority: 1, sequence: { steps: [] } });
      },
    ];
    // Exercise each actual Inspector handler, not a duplicate history implementation.
    for (const edit of edits) {
      definition.value = {
        scheduledSequences: [{ startFrame: 0, sequence: { steps: [] } }],
        lifecycleSequences: {
          start: { steps: [{ kind: 'finishActionOwnerAbilityEntity', parameters: {} }] },
        },
        abilityEventResponses: [{ event: 'outputDamage', priority: 0, sequence: { steps: [] } }],
      };
      await nextTick();
      const before = JSON.parse(JSON.stringify(definition.value));
      edit();
      await nextTick();
      const edited = JSON.parse(JSON.stringify(definition.value));
      expect(edited).not.toEqual(before);
      await panel.restoreStructureHistory('undo');
      expect(definition.value).toEqual(before);
      await panel.restoreStructureHistory('redo');
      expect(definition.value).toEqual(edited);
      await panel.restoreStructureHistory('undo');
      edit();
      await nextTick();
      expect(panel.history.canRedo.value).toBe(false);
      await panel.restoreStructureHistory('redo');
      expect(definition.value).toEqual(edited);
    }
  } finally {
    app.unmount();
    vi.unstubAllGlobals();
  }
});
