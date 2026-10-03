import { createRenderer, h, nextTick, shallowRef, ssrContextKey, type ComponentOptions } from 'vue';
import { expect, it } from 'vitest';
import { i18n } from '../../i18n';
import DefinitionField from '../definition-editor/DefinitionField.vue';
import DefinitionValueCreator from '../definition-editor/DefinitionValueCreator.vue';
import NodeInspectorFields from '../action-graph/NodeInspectorFields.vue';
import ReferenceField from './ReferenceField.vue';

// Execute production setup/watchers and events. DOM interaction is covered separately by Playwright.
async function mountSetup(component: unknown, initial: Record<string, unknown>) {
  const props = shallowRef(initial);
  let state: any;
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
  const implementation = component as ComponentOptions;
  const stub = {
    ...implementation,
    setup(p: any, context: any) {
      state = implementation.setup!(p, context);
      return state;
    },
    render: () => null,
  };
  const app = renderer.createApp({ render: () => h(stub, props.value) });
  app.use(i18n).provide(ssrContextKey, { modules: new Set() });
  app.mount({});
  await nextTick();
  return {
    state,
    async update(next: Record<string, unknown>) {
      props.value = { ...props.value, ...next };
      await nextTick();
    },
    stop: () => app.unmount(),
  };
}

const candidates = { buff: [{ value: 'known', label: 'Known' }] };
const string = { kind: 'string' };

it('does not create record/array reference entries from unlisted or empty values', async () => {
  for (const schema of [
    { kind: 'array', element: string },
    { kind: 'record', value: string },
  ]) {
    const changes: unknown[] = [];
    const f = await mountSetup(DefinitionField, {
      name: 'refs',
      schema,
      value: schema.kind === 'array' ? [] : {},
      path: ['refs'],
      editable: true,
      referenceKind: 'buff',
      referenceChoices: candidates,
      onChange: (_path: unknown, value: unknown) => changes.push(value),
    });
    try {
      f.state.recordKey.value = 'slot';
      f.state.newItemValue.value = 'unlisted';
      (schema.kind === 'array' ? f.state.addArrayEntry : f.state.addRecordEntry)();
      expect(changes).toEqual([]);
      f.state.newItemValue.value = 'known';
      (schema.kind === 'array' ? f.state.addArrayEntry : f.state.addRecordEntry)();
      expect(changes).toEqual([schema.kind === 'array' ? ['known'] : { slot: 'known' }]);
    } finally {
      f.stop();
    }
  }
});

it('leaves a selected union value unchanged until its shared creator applies', async () => {
  const changes: unknown[] = [];
  const f = await mountSetup(DefinitionField, {
    name: 'refs',
    schema: { kind: 'union', variants: [string, { kind: 'null' }] },
    value: null,
    path: ['refs'],
    editable: true,
    referenceKind: 'buff',
    referenceChoices: candidates,
    onChange: (_path: unknown, value: unknown) => changes.push(value),
  });
  try {
    f.state.switchVariant(0);
    expect(f.state.referenceKind.value).toBe('buff');
    expect(f.state.pendingVariant.value.kind).toBe('string');
    expect(changes).toEqual([]);
    f.state.createValue('known');
    expect(changes).toEqual(['known']);
    expect(f.state.pendingVariantIndex.value).toBeNull();
  } finally {
    f.stop();
  }
});

it('restores an explicitly retained optional reference draft without choosing the first candidate', async () => {
  const changes: unknown[] = [];
  const f = await mountSetup(DefinitionField, {
    name: 'refs',
    schema: { ...string, optional: true },
    value: 'stale',
    path: ['refs'],
    editable: true,
    referenceKind: 'buff',
    referenceChoices: candidates,
    onChange: (_path: unknown, value: unknown) => changes.push(value),
  });
  try {
    f.state.toggleOptional(false);
    await f.update({ value: undefined });
    f.state.toggleOptional(true);
    expect(changes).toEqual([undefined, 'stale']);
  } finally {
    f.stop();
  }
});

it('requires a value in the creator, resets when its schema changes, and emits only on apply', async () => {
  const created: unknown[] = [];
  const f = await mountSetup(DefinitionValueCreator, {
    schema: string,
    editable: true,
    referenceKind: 'buff',
    referenceChoices: candidates,
    onCreate: (value: unknown) => created.push(value),
  });
  try {
    expect(f.state.complete.value).toBe(false);
    f.state.create();
    f.state.change([], 'known');
    expect(created).toEqual([]);
    expect(f.state.complete.value).toBe(true);
    f.state.create();
    expect(created).toEqual(['known']);
    await f.update({ schema: { kind: 'number' } });
    expect(f.state.complete.value).toBe(false);
  } finally {
    f.stop();
  }
});

it('candidate refresh never overwrites a node draft; rejection keeps it until explicit discard', async () => {
  const attempts: unknown[] = [];
  const f = await mountSetup(NodeInspectorFields, {
    kind: 'fixture',
    value: { parameters: { skillId: 'before' } },
    fields: [
      {
        path: ['parameters', 'skillId'],
        label: '',
        description: '',
        type: 'string',
        required: true,
        control: 'string',
        source: ['packages/game-data-contract/src/actions.ts:1:1'],
      },
    ],
    referenceChoices: { skill: [{ value: 'after', label: 'After' }] },
    applyValue: (value: unknown) => {
      attempts.push(value);
      return false;
    },
  });
  try {
    f.state.selectValue('parameters.skillId', 'after');
    expect(attempts).toEqual([{ parameters: { skillId: 'after' } }]);
    expect(f.state.pending.value).toBe(true);
    await f.update({ referenceChoices: { skill: [] } });
    expect(f.state.inputs.value['parameters.skillId']).toBe('after');
    expect(f.state.error.value).toBeTruthy();
    f.state.reset();
    expect(f.state.inputs.value['parameters.skillId']).toBe('before');
    expect(f.state.pending.value).toBe(false);
  } finally {
    f.stop();
  }
});

it('reference control rejects unknown events and cannot write while disabled', async () => {
  const changes: unknown[] = [];
  const f = await mountSetup(ReferenceField, {
    label: 'Buff',
    referenceKind: 'buff',
    choices: candidates.buff,
    onChange: (value: unknown) => changes.push(value),
  });
  try {
    f.state.change('unlisted');
    f.state.change('');
    expect(changes).toEqual([]);
    f.state.change('known');
    await f.update({ disabled: true });
    f.state.change('known');
    expect(changes).toEqual(['known']);
  } finally {
    f.stop();
  }
});
