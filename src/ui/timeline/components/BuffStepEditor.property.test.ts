import { createRenderer, h, shallowRef, ssrContextKey } from 'vue';
import { createI18n } from 'vue-i18n';
import { expect, it, vi } from 'vitest';
import Editor from './BuffStepEditor.vue';
import { createDefinitionEditContext } from '../definitionEditContext';

it('edits definition scalars from the latest root and records their precise field without forwarding', () => {
  const root = shallowRef<any>({ stackingType: 'refresh', durationSeconds: 10 });
  const commit = vi.fn((value, _focus) => {
    root.value = value;
  });
  const binding = createDefinitionEditContext({ read: () => root.value, commit }).root;
  let editor: any;
  const forward = vi.fn();
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
  const app = renderer.createApp({
    render: () =>
      h(
        {
          ...(Editor as any),
          setup(props: any, context: any) {
            editor = (Editor as any).setup(props, context);
            return editor;
          },
          render: () => null,
        },
        {
          step: {
            kind: 'applyBuff',
            parameters: {
              target: 'caster',
              definition: { stackingType: 'refresh', durationSeconds: 1 },
            },
          },
          skillLevel: 1,
          definitionBinding: binding,
          onUpdate: forward,
        },
      ),
  });
  app.use(createI18n({ legacy: false, locale: 'zh', messages: {} }));
  app.provide(ssrContextKey, { modules: new Set() });
  app.mount({});
  try {
    root.value = { ...root.value, maxStackCount: 3 };
    editor.setDefinitionScalar('durationSeconds', 15);
    expect(root.value).toEqual({ stackingType: 'refresh', durationSeconds: 15, maxStackCount: 3 });
    expect(commit).toHaveBeenLastCalledWith(root.value, ['durationSeconds']);
    editor.setDefinitionScalar('durationSeconds', undefined);
    expect(root.value).not.toHaveProperty('durationSeconds');
    expect(forward).not.toHaveBeenCalled();
  } finally {
    app.unmount();
  }
});
