import { createSSRApp, h, type ComponentOptions } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { expect, it, vi } from 'vitest';
import Editor from './CombatBuffPresentationEditor.vue';

it('shows own fields immediately but leaves the order object to the graph', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(Editor, {
          layerOnly: true,
          presentation: {
            iconId: 'sample',
            visible: false,
            orderPriority: { useDirectoryValue: false, value: 2, category: 'x' },
          },
        }),
    }),
  );
  expect(html).toContain('value="sample"');
  expect(html).toContain('终结技按钮显示进度');
  expect(html).not.toContain('排序优先级');
  expect(html).not.toContain('<header');
});

it('clearing the last field keeps an empty graph object instead of deleting the selected node', async () => {
  const update = vi.fn();
  let editor: any;
  await renderToString(
    createSSRApp({
      render: () =>
        h(
          {
            ...(Editor as ComponentOptions),
            setup(props: any, context: any) {
              editor = (Editor as any).setup(props, context);
              return editor;
            },
            ssrRender: () => {},
          },
          { layerOnly: true, presentation: { visible: false }, onUpdate: update },
        ),
    }),
  );
  editor.setBoolean('visible', { target: { value: '' } });
  expect(update).toHaveBeenLastCalledWith({});
});
