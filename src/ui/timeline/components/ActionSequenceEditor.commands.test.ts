import { createRenderer, h, nextTick, shallowRef, ssrContextKey } from 'vue';
import { createI18n } from 'vue-i18n';
import { expect, it } from 'vitest';
import Editor from './ActionSequenceEditor.vue';

it('routes sequence edits through root commands and preserves selection and input isolation', async () => {
  const original = {
    steps: [
      { kind: 'finishActionOwnerAbilityEntity', parameters: {}, key: 'a' },
      { kind: 'finishActionOwnerAbilityEntity', parameters: {}, key: 'b' },
    ],
  };
  const sequence = shallowRef<any>(original);
  let panel: any;
  let updates = 0;
  const component = {
    ...(Editor as any),
    setup(props: any, ctx: any) {
      panel = (Editor as any).setup(props, ctx);
      return panel;
    },
    render: () => null,
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
      h(component, {
        sequence: sequence.value,
        skillLevel: 1,
        createStep: () => ({ kind: 'finishActionOwnerAbilityEntity', parameters: {}, key: 'new' }),
        duplicateStep: (step: any) => ({ ...step, key: `${step.key}-copy` }),
        onUpdate: (value: any) => {
          sequence.value = value;
          updates++;
        },
      }),
  });
  app.use(createI18n({ legacy: false, locale: 'zh-CN', messages: {} }));
  app.provide(ssrContextKey, { modules: new Set() });
  app.mount({});
  try {
    panel.moveStep(-1);
    expect(updates).toBe(0);
    panel.moveStep(1);
    await nextTick();
    expect(panel.selectedStepIndex.value).toBe(1);
    expect(sequence.value.steps.map((s: any) => s.key)).toEqual(['b', 'a']);
    panel.duplicateSelectedStep();
    await nextTick();
    expect(panel.selectedStepIndex.value).toBe(2);
    expect(sequence.value.steps[2].key).toBe('a-copy');
    panel.replaceStep({ ...sequence.value.steps[2], key: 'edited' });
    await nextTick();
    expect(sequence.value.steps[2].key).toBe('edited');
    panel.removeSelectedStep();
    await nextTick();
    expect(panel.selectedStepIndex.value).toBe(1);
    panel.appendStep('finishActionOwnerAbilityEntity');
    await nextTick();
    expect(panel.selectedStepIndex.value).toBe(2);
    expect(sequence.value.steps[2].key).toBe('new');
    expect(original.steps.map(s => s.key)).toEqual(['a', 'b']);
    expect(updates).toBe(5);
  } finally {
    app.unmount();
  }
});
