import { createSSRApp, h } from 'vue';
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { i18n } from '../../i18n';
import DefinitionField from '../definition-editor/DefinitionField.vue';
import NodeInspectorFields from '../action-graph/NodeInspectorFields.vue';
import ReferenceField from './ReferenceField.vue';
import type { DefinitionFieldSchema } from '../definition-editor/fieldSchema';

function render(component: Parameters<typeof h>[0], props: Record<string, unknown>) {
  return renderToString(
    createSSRApp({ render: () => h(component, props) })
      .use(i18n)
      .provide(ID_INJECTION_KEY, { prefix: 100, current: 0 })
      .provide(ZINDEX_INJECTION_KEY, { current: 0 }),
  );
}
const string: DefinitionFieldSchema = { kind: 'string' };
const choices = [{ value: 'known', label: 'Known buff' }];

describe('shared reference rendering', () => {
  it.each([
    [undefined, undefined, 'unset', 'contextUnknown'],
    [undefined, [], 'unset', 'empty'],
    ['stale', [], 'unresolved', 'empty'],
    ['stale', undefined, 'contextUnknown', 'contextUnknown'],
    ['known', choices, 'listed', 'available'],
  ])(
    'keeps identity and candidate states separate (%s)',
    async (value, candidates, state, catalog) => {
      const html = await render(ReferenceField, {
        value,
        choices: candidates,
        referenceKind: 'buff',
        label: 'Buff',
        disabled: true,
      });
      expect(html).toContain(`data-reference-state="${state}"`);
      expect(html).toContain(`data-reference-catalog="${catalog}"`);
      if (value) expect(html).toContain(value);
      expect(html).toContain('ea-select');
      expect(html).not.toContain('ea-input ');
    },
  );

  it.each([
    { kind: 'string' },
    { kind: 'string', optional: true },
    { kind: 'union', variants: [string, { kind: 'null' }] },
  ] satisfies DefinitionFieldSchema[])(
    'preserves existing reference through $kind',
    async schema => {
      const html = await render(DefinitionField, {
        name: 'slot',
        value: 'stale',
        schema,
        path: ['slot'],
        editable: false,
        referenceKind: 'buff',
        referenceChoices: { buff: [] },
      });
      expect(html).toContain('data-reference-kind="buff"');
      expect(html).toContain('data-reference-state="unresolved"');
      expect(html).not.toContain('ea-input ');
    },
  );

  it.each([
    [{ kind: 'array', element: string }, ['stale']],
    [{ kind: 'record', value: string }, { arbitraryKey: 'stale' }],
  ] as const)(
    'uses reference controls for existing and new container entries',
    async (schema, value) => {
      const html = await render(DefinitionField, {
        name: 'slot',
        value,
        schema,
        path: ['slot'],
        root: true,
        editable: true,
        referenceKind: 'buff',
        referenceChoices: { buff: [] },
      });
      expect(html.match(/data-reference-kind="buff"/g)).toHaveLength(2);
      expect(html).toContain('data-reference-state="unresolved"');
      expect(html).toContain('data-reference-state="unset"');
    },
  );

  it('does not spread a container reference family into object properties', async () => {
    const html = await render(DefinitionField, {
      name: 'slot',
      value: { blackboardKey: 'dynamic-key' },
      schema: { kind: 'object', fields: { blackboardKey: string } },
      path: ['slot'],
      root: true,
      editable: true,
      referenceKind: 'buff',
      referenceChoices: { buff: [] },
    });
    expect(html).not.toContain('data-reference-kind=');
    expect(html).toContain('ea-input');
  });

  it('keeps a node reference typed without a supplied catalog, leaving ordinary text alone', async () => {
    const html = await render(NodeInspectorFields, {
      kind: 'fixture',
      value: { skillKey: 'stale', text: 'ordinary' },
      applyValue: () => true,
      fields: [
        {
          path: ['skillKey'],
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
    });
    expect(html).toContain('data-reference-kind="skill"');
    expect(html).toContain('data-reference-catalog="contextUnknown"');
    expect(html).toContain('ea-input');
  });
});
