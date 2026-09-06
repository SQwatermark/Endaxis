import { createRenderer, h, nextTick, shallowRef, ssrContextKey, type ComponentOptions } from 'vue';
import { expect, it } from 'vitest';
import Graph from './EquipmentContributionGraphEditor.vue';
import weaponSource from './WeaponDefinitionWorkspaceDialog.vue?raw';
import gearSource from './GearDefinitionWorkspaceDialog.vue?raw';
import setSource from './GearSetDefinitionWorkspaceDialog.vue?raw';

it('keeps history across label changes and discards it when the host changes editing context', async () => {
  const context = shallowRef('0:0');
  const label = shallowRef('same-name');
  const contribution = shallowRef<any>({ initializationSequence: { steps: [] } });
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
        key: context.value,
        label: label.value,
        level: 1,
        contribution: contribution.value,
        onUpdate: (value: unknown) => {
          contribution.value = value;
        },
      }),
  });
  app.provide(ssrContextKey, { modules: new Set() });
  app.mount({});
  try {
    await panel.removeInitializationSequence();
    expect(contribution.value).not.toHaveProperty('initializationSequence');
    label.value = 'renamed';
    await nextTick();
    expect(panel.undoStack.value).toHaveLength(1);
    await panel.restoreHistory('undo');
    expect(contribution.value.initializationSequence).toEqual({ steps: [] });
    await panel.restoreHistory('redo');
    expect(contribution.value).not.toHaveProperty('initializationSequence');
    context.value = '0:1'; // A different trait, same display label.
    contribution.value = { initializationBlackboard: { other: 2 } };
    await nextTick();
    expect(panel.undoStack.value).toHaveLength(0);
    await panel.restoreHistory('undo');
    expect(contribution.value).toEqual({ initializationBlackboard: { other: 2 } });
    panel.createInitializationSequence();
    await nextTick();
    context.value = '1:1'; // Deletion replaces the selected trait at the same index.
    contribution.value = {};
    await nextTick();
    expect(panel.undoStack.value).toHaveLength(0);
    expect(panel.redoStack.value).toHaveLength(0);
  } finally {
    app.unmount();
  }
});

it('hosts key graph sessions by selection/replacement rather than mutable labels', () => {
  for (const source of [weaponSource, gearSource]) {
    expect(source).toContain(':key="`${contributionEditorRevision}:${selectedTraitIndex}`"');
    const remove = source.slice(
      source.indexOf('function removeTrait'),
      source.indexOf('function moveTrait'),
    );
    expect(remove).toContain('contributionEditorRevision.value += 1');
  }
  expect(setSource).toContain(':key="draft.slug"');
});
