import { createRenderer, h, nextTick, shallowRef, ssrContextKey, type ComponentOptions } from 'vue';
import { expect, it } from 'vitest';
import { i18n } from '../../i18n';
import DefinitionField from '../definition-editor/DefinitionField.vue';
import DefinitionValueCreator from '../definition-editor/DefinitionValueCreator.vue';
import NodeInspectorFields from '../action-graph/NodeInspectorFields.vue';
import ReferenceField from './ReferenceField.vue';
import StringOperandField from './StringOperandField.vue';
import { unknownBlackboardContext } from '@/application/editor/blackboardFieldContext';
import { actionNodeSchemas, dataNodeSchemas } from '../action-graph/actionNodeSchemas.generated';
import { validReferenceDraft } from './referenceDraftValidation';
import { referenceCatalog, referenceCandidate } from './referenceTestFixtures';
import { referenceNavigationKey, type ReferenceNavigator } from './referenceNavigation';

// Execute production setup/watchers and events. DOM interaction is covered separately by Playwright.
async function mountSetup(
  component: unknown,
  initial: Record<string, unknown>,
  navigate?: ReferenceNavigator,
) {
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
  if (navigate) app.provide(referenceNavigationKey, navigate);
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

const candidates = { buff: referenceCatalog() };
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
    referenceChoices: { skill: referenceCatalog('skill', ['after']) },
    applyValue: (value: unknown) => {
      attempts.push(value);
      return false;
    },
  });
  try {
    f.state.selectValue('parameters.skillId', 'after');
    expect(attempts).toEqual([{ parameters: { skillId: 'after' } }]);
    expect(f.state.pending.value).toBe(true);
    await f.update({ referenceChoices: { skill: referenceCatalog('skill', []) } });
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
    f.state.change(JSON.stringify(['project', 'project:known']));
    await f.update({ disabled: true });
    f.state.change(JSON.stringify(['project', 'project:known']));
    expect(changes).toEqual(['known']);
  } finally {
    f.stop();
  }
});

it('rejects duplicate and invisible selections and retains stale IDs on catalog refresh', async () => {
  const changes: unknown[] = [];
  const a = referenceCandidate('known');
  const b = referenceCandidate('known', 'buff', {
    identity: 'builtin:known',
    source: { id: 'builtin', label: 'Built-in', kind: 'builtin' },
  });
  const f = await mountSetup(ReferenceField, {
    label: 'Buff',
    referenceKind: 'buff',
    value: 'known',
    choices: { ...referenceCatalog(), candidates: [a, b] },
    onChange: (value: unknown) => changes.push(value),
  });
  try {
    expect(f.state.state.value).toBe('ambiguous');
    expect(
      f.state.options.value
        .filter((option: any) => option.value.startsWith('['))
        .every((option: any) => option.disabled),
    ).toBe(true);
    f.state.change(JSON.stringify(['project', a.identity]));
    await f.update({
      choices: {
        ...referenceCatalog(),
        owner: 'other',
        candidates: [{ ...a, scope: 'owner', owner: 'original' }],
      },
    });
    expect(f.state.state.value).toBe('invisible');
    f.state.change(JSON.stringify(['project', a.identity]));
    await f.update({ choices: undefined });
    expect(f.state.state.value).toBe('contextUnknown');
    expect(f.state.options.value.some((option: any) => option.label === 'known')).toBe(true);
    expect(changes).toEqual([]);
  } finally {
    f.stop();
  }
});

it('navigates a read-only field and target only while uniquely resolved', async () => {
  const target = { assetId: 'builtin', resourcePath: ['buffs', 0] };
  const candidate = referenceCandidate('known', 'buff', { writable: false, target });
  const visits: unknown[] = [];
  const f = await mountSetup(
    ReferenceField,
    {
      label: 'Buff',
      referenceKind: 'buff',
      value: 'known',
      disabled: true,
      choices: { ...referenceCatalog(), candidates: [candidate] },
    },
    async next => {
      visits.push(next);
    },
  );
  try {
    expect(f.state.canNavigate.value).toBe(true);
    await f.state.openTarget();
    expect(visits).toEqual([target]);
    await f.update({
      choices: {
        ...referenceCatalog(),
        candidates: [candidate, { ...candidate, identity: 'duplicate' }],
      },
    });
    expect(f.state.canNavigate.value).toBe(false);
    await f.state.openTarget();
    expect(visits).toEqual([target]);
  } finally {
    f.stop();
  }
});

it('creator revalidates new reference leaves after refresh without discarding drafts', async () => {
  for (const [schema, value] of [
    [string, 'known'],
    [{ kind: 'array', element: string }, ['known']],
    [
      { kind: 'record', value: { kind: 'union', variants: [string, { kind: 'null' }] } },
      { first: 'known' },
    ],
  ]) {
    const created: unknown[] = [];
    const f = await mountSetup(DefinitionValueCreator, {
      schema,
      editable: true,
      referenceKind: 'buff',
      referenceChoices: candidates,
      onCreate: (next: unknown) => created.push(next),
    });
    try {
      f.state.change([], value);
      expect(f.state.complete.value).toBe(true);
      await f.update({ referenceChoices: { buff: referenceCatalog('buff', []) } });
      expect(f.state.complete.value).toBe(false);
      f.state.create();
      expect(created).toEqual([]);
      expect(f.state.value.value).toEqual(value);
      await f.update({ referenceChoices: candidates });
      f.state.create();
      expect(created).toEqual([value]);
    } finally {
      f.stop();
    }
  }
});

it('node apply revalidates changed reference IDs and keeps rejected drafts pending', async () => {
  const attempts: unknown[] = [];
  const f = await mountSetup(NodeInspectorFields, {
    kind: 'fixture',
    value: { skillId: 'stale', text: 'before' },
    fields: [
      {
        path: ['skillId'],
        label: '',
        description: '',
        type: 'string',
        required: true,
        control: 'string',
        source: ['packages/game-data-contract/src/actions.ts:1:1'],
      },
      {
        path: ['text'],
        label: '',
        description: '',
        type: 'string',
        required: true,
        control: 'string',
      },
    ],
    referenceChoices: { skill: referenceCatalog('skill', ['after']) },
    applyValue: (value: unknown) => {
      attempts.push(value);
      return true;
    },
  });
  try {
    f.state.change('text', 'next');
    expect(f.state.apply()).toBe(true);
    expect(attempts).toEqual([{ skillId: 'stale', text: 'next' }]);
    f.state.change('skillId', 'after');
    await f.update({ referenceChoices: { skill: referenceCatalog('skill', []) } });
    expect(f.state.apply()).toBe(false);
    expect(attempts).toHaveLength(1);
    expect(f.state.inputs.value.skillId).toBe('after');
    expect(f.state.pending.value).toBe(true);
  } finally {
    f.stop();
  }
});

it('validates semantic object children without inheriting the container family', () => {
  const schema = {
    kind: 'object',
    fields: {
      arbitrary: { kind: 'string' },
      buffId: {
        kind: 'string',
        optional: true,
        source: ['packages/game-data-contract/src/actions.ts:1:1'],
      },
    },
  } as const;
  expect(validReferenceDraft(schema, { arbitrary: 'free text' }, candidates, 'buff')).toBe(true);
  expect(
    validReferenceDraft(schema, { arbitrary: 'free text', buffId: 'known' }, candidates, 'skill'),
  ).toBe(true);
  expect(validReferenceDraft(schema, { arbitrary: 'free text', buffId: 'stale' }, candidates)).toBe(
    false,
  );
  expect(
    validReferenceDraft(
      { kind: 'union', variants: [{ kind: 'null' }, { kind: 'string' }] },
      null,
      candidates,
      'buff',
    ),
  ).toBe(true);
});

it('switches string operand branches atomically and cancellation preserves the stored expression', async () => {
  const changes: unknown[] = [];
  const f = await mountSetup(StringOperandField, {
    value: 'known',
    label: 'Buff',
    editable: true,
    required: true,
    referenceKind: 'buff',
    referenceChoices: candidates,
    onChange: (v: unknown) => changes.push(v),
  });
  try {
    f.state.chooseMode('blackboard');
    expect(changes).toEqual([]);
    f.state.apply();
    expect(changes).toEqual([]);
    f.state.changeKey('runtimeBuff');
    f.state.reset();
    expect(f.state.mode.value).toBe('literal');
    expect(changes).toEqual([]);
    f.state.chooseMode('blackboard');
    f.state.changeKey('runtimeBuff');
    f.state.apply();
    expect(changes).toEqual([{ blackboardKey: 'runtimeBuff' }]);
    await f.update({ value: changes[0] });
    f.state.chooseMode('literal');
    expect(f.state.literal.value).toBe('');
    f.state.changeLiteral('known');
    await f.update({ referenceChoices: { buff: referenceCatalog('buff', []) } });
    f.state.apply();
    expect(changes).toHaveLength(1);
    expect(f.state.literal.value).toBe('known');
  } finally {
    f.stop();
  }
});

it('blocks known numeric string reads and respects read-only string operands', async () => {
  const changes: unknown[] = [];
  const context = {
    ...unknownBlackboardContext(),
    status: 'known',
    scopes: [{ id: 'current', label: 'root' }],
    candidates: [
      {
        key: 'amount',
        valueType: 'number',
        readable: true,
        writable: true,
        scope: 'current',
        source: 'root',
      },
    ],
  };
  const f = await mountSetup(StringOperandField, {
    value: { blackboardKey: 'old' },
    label: 'Read',
    editable: true,
    required: true,
    blackboardContext: context,
    onChange: (v: unknown) => changes.push(v),
  });
  try {
    f.state.changeKey('amount');
    f.state.apply();
    expect(changes).toEqual([]);
    expect(f.state.valid.value).toBe(false);
    await f.update({ editable: false });
    f.state.chooseMode('literal');
    f.state.changeKey('external');
    f.state.apply();
    f.state.unset();
    expect(changes).toEqual([]);
    expect(f.state.mode.value).toBe('blackboard');
    expect(f.state.key.value).toBe('amount');
  } finally {
    f.stop();
  }
});

it('node string operand commit revalidates catalogs and keeps refused drafts', async () => {
  const field = actionNodeSchemas.applyBuff.fields.find(f => f.path.at(-1) === 'buffId')!;
  const accepted: unknown[] = [];
  const f = await mountSetup(NodeInspectorFields, {
    value: { kind: 'applyBuff', parameters: { buffId: 'old' } },
    kind: 'applyBuff',
    fields: [field],
    referenceChoices: candidates,
    applyValue: (v: unknown) => {
      accepted.push(v);
      return false;
    },
  });
  try {
    f.state.changeStructured(field, 'known');
    expect(accepted).toHaveLength(1);
    expect(f.state.pending.value).toBe(true);
    expect(f.state.inputs.value['parameters.buffId']).toBe('"known"');
    await f.update({ referenceChoices: { buff: referenceCatalog('buff', []) } });
    expect(f.state.apply()).toBe(false);
    expect(accepted).toHaveLength(1);
    f.state.changeStructured(field, { blackboardKey: 'runtimeBuff' });
    expect(accepted).toHaveLength(2);
    expect(accepted[1]).toEqual({
      kind: 'applyBuff',
      parameters: { buffId: { blackboardKey: 'runtimeBuff' } },
    });
  } finally {
    f.stop();
  }
});

it('creates typed string operands without a separate untyped union branch chooser', async () => {
  const created: unknown[] = [];
  const schema = {
    kind: 'union',
    variants: [
      { kind: 'string' },
      { kind: 'object', fields: { blackboardKey: { kind: 'string' } } },
    ],
    semantics: { type: 'ActionStringOperand', aliases: ['ActionStringOperand'] },
  };
  const f = await mountSetup(DefinitionValueCreator, {
    schema,
    editable: true,
    referenceKind: 'buff',
    referenceChoices: candidates,
    onCreate: (v: unknown) => created.push(v),
  });
  try {
    expect(f.state.variants.value).toHaveLength(1);
    f.state.change([], { blackboardKey: 'runtimeBuff' });
    expect(f.state.complete.value).toBe(true);
    f.state.create();
    expect(created).toEqual([{ blackboardKey: 'runtimeBuff' }]);
  } finally {
    f.stop();
  }
});

it('keeps level-value editing after an explicit constant replaces a connection', async () => {
  const field = actionNodeSchemas.dealStagger.fields.find(f => f.path.at(-1) === 'value')!;
  const f = await mountSetup(NodeInspectorFields, {
    value: { parameters: { value: { kind: 'constant', value: 7 } } },
    kind: 'dealStagger',
    fields: [field],
    applyValue: () => true,
  });
  try {
    expect(f.state.levelText(field)).toBe('7');
  } finally {
    f.stop();
  }
});

it('revalidates mapping sources on retry while retaining the exact staged mapping', async () => {
  const field = actionNodeSchemas.applyBuff.fields.find(
    f => f.path.at(-1) === 'blackboardAssignments',
  )!;
  const attempted: unknown[] = [];
  const f = await mountSetup(NodeInspectorFields, {
    value: { kind: 'applyBuff', parameters: { buffId: 'known', blackboardAssignments: {} } },
    kind: 'applyBuff',
    fields: [field],
    applyValue: (v: unknown) => {
      attempted.push(v);
      return false;
    },
  });
  try {
    f.state.changeStructured(field, { power: { kind: 'blackboard', key: 'source' } });
    expect(attempted).toHaveLength(1);
    const staged = f.state.inputs.value['parameters.blackboardAssignments'];
    await f.update({
      blackboardContext: {
        status: 'known',
        scopes: [{ id: 'current', label: 'root' }],
        parameters: [],
        candidates: [
          {
            key: 'source',
            valueType: 'string',
            readable: true,
            writable: true,
            scope: 'current',
            source: 'root',
          },
        ],
      },
    });
    expect(f.state.apply()).toBe(false);
    expect(attempted).toHaveLength(1);
    expect(f.state.inputs.value['parameters.blackboardAssignments']).toBe(staged);
    f.state.changeStructured(field, { power: { kind: 'blackboard', key: 'source', fallback: 7 } });
    expect(attempted).toHaveLength(2);
  } finally {
    f.stop();
  }
});

it('child discard removes a rejected structured proposal before a later parent apply', async () => {
  for (const name of ['buffId', 'blackboardAssignments']) {
    const field = actionNodeSchemas.applyBuff.fields.find(f => f.path.at(-1) === name)!;
    const value = {
      kind: 'applyBuff',
      parameters: { buffId: 'known', blackboardAssignments: { old: 1 } },
    };
    let accepts = false;
    const attempts: unknown[] = [];
    const f = await mountSetup(NodeInspectorFields, {
      value,
      kind: 'applyBuff',
      fields: [field],
      referenceChoices: candidates,
      applyValue: (v: unknown) => {
        attempts.push(v);
        return accepts;
      },
    });
    try {
      f.state.changeStructured(
        field,
        name === 'buffId' ? { blackboardKey: 'runtimeBuff' } : { new: 2 },
      );
      expect(f.state.pending.value).toBe(true);
      f.state.discardStructured(field);
      expect(f.state.pending.value).toBe(false);
      accepts = true;
      expect(f.state.apply()).toBe(true);
      expect(attempts).toHaveLength(1);
    } finally {
      f.stop();
    }
  }
});

it('the string child sends discard only for user cancellation, never a parent refresh', async () => {
  let discards = 0;
  const f = await mountSetup(StringOperandField, {
    value: 'known',
    label: 'Buff',
    editable: true,
    onDiscard: () => discards++,
  });
  try {
    f.state.chooseMode('blackboard');
    f.state.discard();
    expect(discards).toBe(1);
    await f.update({ value: 'another' });
    expect(discards).toBe(1);
  } finally {
    f.stop();
  }
});

it('discards a rejected structured proposal across readonly transitions before a later parent apply', async () => {
  const field = dataNodeSchemas['boolean:all']!.fields[0]!;
  const original = { kind: 'all', conditions: [] };
  const proposals: unknown[] = [];
  let accept = false;
  const panel = await mountSetup(NodeInspectorFields, {
    value: original,
    kind: 'all',
    fields: [field],
    readonly: false,
    applyValue: (value: unknown) => {
      proposals.push(value);
      return accept;
    },
  });
  try {
    panel.state.changeStructured(field, [{ kind: 'constant', value: false }]);
    expect(panel.state.pending.value).toBe(true);
    expect(proposals).toHaveLength(1);
    await panel.update({ readonly: true });
    await panel.update({ readonly: false });
    accept = true;
    expect(panel.state.apply()).toBe(true);
    expect(proposals).toHaveLength(1);
    expect(panel.state.pending.value).toBe(false);
    expect(original.conditions).toEqual([]);
  } finally {
    panel.stop();
  }
});

it('typed collections apply through real history once, preserving siblings and duplicate order on reopen', async () => {
  const { DefinitionDraftSession } = await import('@/application/editor/definitionDraftSession');
  const { updateResourceGraph } = await import('@/application/editor/actionGraphResourceEditing');
  const graph = {
    nodes: {
      finish: {
        action: {
          kind: 'finishBuffsById' as const,
          parameters: {
            target: 'caster' as const,
            reason: 'other' as const,
            buffIds: ['known', 'stale', 'known'],
          },
        },
        next: null,
      },
    },
  };
  const history = new DefinitionDraftSession({ actionGraph: { main: graph, macros: {} } }, true);
  const before = history.current;
  const field = actionNodeSchemas.finishBuffsById.fields.find(f => f.path.at(-1) === 'buffIds')!;
  const f = await mountSetup(NodeInspectorFields, {
    kind: 'finishBuffsById',
    value: graph.nodes.finish.action,
    fields: [field],
    referenceChoices: candidates,
    applyValue: (action: typeof graph.nodes.finish.action) =>
      history.update(owner =>
        updateResourceGraph(owner, { kind: 'main' }, graph => ({
          ...graph,
          nodes: { ...graph.nodes, finish: { ...graph.nodes.finish!, action } },
        })),
      ),
  });
  try {
    f.state.changeStructured(field, ['stale', 'known', 'known', 'known']);
    expect(history.current.actionGraph.main.nodes.finish!.action.parameters).toEqual({
      target: 'caster',
      reason: 'other',
      buffIds: ['stale', 'known', 'known', 'known'],
    });
    const applied = history.current;
    expect(history.undo()).toBe(true);
    expect(history.current).toBe(before);
    expect(history.undo()).toBe(false);
    expect(history.redo()).toBe(true);
    expect(history.current).toBe(applied);
    expect(JSON.parse(JSON.stringify(history.exportDefinition()))).toEqual(applied);
    await f.update({ value: applied.actionGraph.main.nodes.finish!.action });
    f.state.changeStructured(field, ['unknown-new']);
    expect(history.current).toBe(applied);
    expect(f.state.error.value).not.toBe('');
    f.state.discardStructured(field);
    expect(f.state.pending.value).toBe(false);
    expect(history.undo()).toBe(true);
    expect(history.current).toBe(before);
  } finally {
    f.stop();
  }
});
it('cannot use an enclosing entity catalog when an owner override is persisted or pending', async () => {
  const attempts: unknown[] = [];
  const fields = actionNodeSchemas.findOwnerSpawnedAbilityEntities.fields;
  const ids = fields.find(f => f.path.at(-1) === 'abilityEntityIds')!;
  const f = await mountSetup(NodeInspectorFields, {
    kind: 'findOwnerSpawnedAbilityEntities',
    value: { kind: 'findOwnerSpawnedAbilityEntities', parameters: { saveToContextKey: 'targets' } },
    fields,
    referenceChoices: { abilityEntity: referenceCatalog('abilityEntity') },
    applyValue: (value: unknown) => {
      attempts.push(value);
      return true;
    },
  });
  try {
    f.state.change('parameters.ownerContextKey', 'another-owner');
    expect(f.state.collectionChoices(ids)).toBeUndefined();
    f.state.changeStructured(ids, ['known']);
    expect(attempts).toEqual([]);
    await f.update({
      value: {
        kind: 'findOwnerSpawnedAbilityEntities',
        parameters: { saveToContextKey: 'targets', ownerContextKey: 'other' },
      },
    });
    expect(f.state.collectionChoices(ids)).toBeUndefined();
  } finally {
    f.stop();
  }
});
it('tag creation checks semantic syntax and updated reference collections before emitting', async () => {
  const { definitionSchemas } = await import('../definition-editor/definitionSchemas.generated');
  const created: unknown[] = [];
  const f = await mountSetup(DefinitionValueCreator, {
    schema: definitionSchemas.abilityEntity.fields.bornTags,
    editable: true,
    onCreate: (value: unknown) => created.push(value),
  });
  try {
    f.state.change([], ['Custom/Tag', 'Custom/Tag']);
    expect(f.state.complete.value).toBe(true);
    f.state.create();
    expect(created).toEqual([['Custom/Tag', 'Custom/Tag']]);
    f.state.change([], ['Custom//Tag']);
    expect(f.state.complete.value).toBe(false);
    f.state.create();
    expect(created).toHaveLength(1);
  } finally {
    f.stop();
  }
});
it('optional tag leaves unset through the original parser and required leaves still reject empty', async () => {
  const attempts: unknown[] = [];
  const optional = actionNodeSchemas.changeResource.fields.find(
    f => f.path.at(-1) === 'ultimateRecoveryTag',
  )!;
  const f = await mountSetup(NodeInspectorFields, {
    kind: 'changeResource',
    value: { parameters: { ultimateRecoveryTag: 'Custom/Tag' } },
    fields: [optional],
    applyValue: (value: unknown) => {
      attempts.push(value);
      return true;
    },
  });
  try {
    f.state.selectValue('parameters.ultimateRecoveryTag', '');
    expect(attempts).toEqual([{ parameters: {} }]);
  } finally {
    f.stop();
  }
});
it('scalar tags bound suggestions and reset custom drafts on readonly changes', async () => {
  const { default: GameplayTagField } = await import('./GameplayTagField.vue');
  const changes: unknown[] = [];
  const f = await mountSetup(GameplayTagField, {
    value: 'Custom/Old',
    label: 'Tag',
    disabled: false,
    allowUnset: true,
    onChange: (value: unknown) => changes.push(value),
  });
  try {
    f.state.text.value = '';
    expect(f.state.options.value.length).toBeLessThanOrEqual(51);
    f.state.text.value = 'Custom/New';
    await f.update({ disabled: true });
    expect(f.state.text.value).toBe('Custom/Old');
    f.state.apply();
    f.state.unset();
    expect(changes).toEqual([]);
    await f.update({ disabled: false });
    f.state.unset();
    expect(changes).toEqual(['']);
  } finally {
    f.stop();
  }
});
