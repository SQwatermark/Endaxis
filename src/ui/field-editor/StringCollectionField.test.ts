import { createRenderer, h, nextTick, shallowRef, ssrContextKey, type ComponentOptions } from 'vue';
import { expect, it } from 'vitest';
import { i18n } from '../../i18n';
import { referenceCatalog } from './referenceTestFixtures';
import type { ReferenceChoices } from '../definition-editor/fieldInputConfig';
import StringCollectionField from './StringCollectionField.vue';

async function mount(
  value: readonly string[] | undefined,
  editable = true,
  referenceChoices: ReferenceChoices = { buff: referenceCatalog() },
) {
  const changes: (readonly string[] | undefined)[] = [];
  let discards = 0;
  const props = shallowRef({
    value,
    editable,
    label: 'Values',
    kind: 'reference',
    referenceKind: 'buff',
    referenceChoices,
    onChange: (value: readonly string[] | undefined) => changes.push(value),
    onDiscard: () => discards++,
  });
  const implementation = StringCollectionField as ComponentOptions;
  let state: any;
  const stub = {
    ...implementation,
    setup(p: any, ctx: any) {
      state = implementation.setup!(p, ctx);
      return state;
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
  }).createApp({ render: () => h(stub, props.value) });
  app.use(i18n).provide(ssrContextKey, { modules: new Set() });
  app.mount({});
  await nextTick();
  return {
    state,
    changes,
    get discards() {
      return discards;
    },
    stop: () => app.unmount(),
    async update(next: Partial<typeof props.value>) {
      props.value = { ...props.value, ...next };
      await nextTick();
    },
  };
}

it('stages append/reorder/delete and preserves duplicate rows until one atomic apply', async () => {
  const original = Object.freeze(['known', 'stale', 'known']);
  const panel = await mount(original);
  try {
    panel.state.begin();
    panel.state.move(2, -1);
    panel.state.remove(0);
    panel.state.choice.value = 'known';
    panel.state.add();
    expect(panel.state.draft.value).toEqual(['known', 'stale', 'known']);
    expect(panel.changes).toEqual([]);
    panel.state.remove(1);
    await panel.state.apply();
    expect(panel.changes).toEqual([['known', 'known']]);
    expect(original).toEqual(['known', 'stale', 'known']);
  } finally {
    panel.stop();
  }
});
it('distinguishes absent and empty, cancels without publishing and retains rejected proposals', async () => {
  const panel = await mount(undefined);
  try {
    panel.state.begin();
    panel.state.empty();
    expect(panel.state.draft.value).toEqual([]);
    panel.state.discard();
    expect(panel.changes).toEqual([]);
    panel.state.begin();
    panel.state.empty();
    await panel.state.apply();
    expect(panel.changes).toEqual([[]]);
    expect(panel.state.error.value).toBe('rejected');
    panel.state.choice.value = 'known';
    panel.state.add();
    expect(panel.discards).toBe(2);
    expect(panel.state.error.value).toBe('');
    await panel.state.apply();
    await panel.update({ value: ['known'] });
    expect(panel.state.editing.value).toBe(false);
    panel.state.begin();
    panel.state.empty(true);
    await panel.state.apply();
    expect(panel.changes.at(-1)).toBeUndefined();
  } finally {
    panel.stop();
  }
});
it('rechecks the latest catalog at apply without clearing an in-progress draft', async () => {
  const panel = await mount([]);
  try {
    panel.state.begin();
    panel.state.choice.value = 'known';
    panel.state.add();
    await panel.update({ referenceChoices: { buff: referenceCatalog('buff', []) } });
    expect(panel.state.draft.value).toEqual(['known']);
    await panel.state.apply();
    expect(panel.changes).toEqual([]);
    expect(panel.state.error.value).toBe('invalid');
    panel.state.remove(0);
    panel.state.discard();
    expect(panel.discards).toBe(1);
  } finally {
    panel.stop();
  }
});
it('readonly transitions and external replacement invalidate drafts and forged mutation events', async () => {
  const panel = await mount(['known']);
  try {
    panel.state.begin();
    panel.state.remove(0);
    await panel.update({ value: ['known', 'known'] });
    expect(panel.state.editing.value).toBe(false);
    panel.state.begin();
    await panel.update({ editable: false });
    panel.state.begin();
    panel.state.choice.value = 'known';
    panel.state.add();
    panel.state.replace(0, 'known');
    panel.state.move(0, 1);
    panel.state.empty();
    await panel.state.apply();
    expect(panel.changes).toEqual([]);
    expect(panel.state.editing.value).toBe(false);
  } finally {
    panel.stop();
  }
});
it('rejects rapid duplicate Apply and ignores an older acceptance after cancel/reopen', async () => {
  const panel = await mount([]);
  try {
    panel.state.begin();
    panel.state.choice.value = 'known';
    panel.state.add();
    const first = panel.state.apply();
    const second = panel.state.apply();
    panel.state.discard();
    panel.state.begin();
    await Promise.all([first, second]);
    expect(panel.changes).toHaveLength(1);
    expect(panel.state.error.value).toBe('');
    expect(panel.state.draft.value).toEqual([]);
  } finally {
    panel.stop();
  }
});
