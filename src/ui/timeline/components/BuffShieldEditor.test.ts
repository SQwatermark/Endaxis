import { createSSRApp, h, type ComponentOptions } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { expect, it, vi } from 'vitest';
import Editor from './BuffShieldEditor.vue';
import Absorption from './BuffShieldAbsorptionInspector.vue';
import { createBuffShield } from '../buffShieldGraph';

it('shows the shield formula but not absorption children in the layer Inspector', async () => {
  const shield = {
    ...createBuffShield(),
    value: {
      attribute: 'HpMax',
      attributeSource: 'buffSource' as const,
      multiplier: { blackboardKey: 'shield' },
      addition: 3,
    },
    damageAbsorptions: [{ damageType: 'electric' as const, ratio: 0.5, scale: 2 }],
  };
  const layer = await renderToString(
    createSSRApp({ render: () => h(Editor, { shields: [shield], singleEntry: true }) }),
  );
  expect(layer).toContain('value="HpMax"');
  expect(layer).toContain('value="shield"');
  expect(layer).not.toContain('分伤害类型吸收');
  expect(layer).not.toContain('display:none');
  const standalone = await renderToString(
    createSSRApp({ render: () => h(Editor, { shields: [shield] }) }),
  );
  expect(standalone).toContain('分伤害类型吸收');
  const absorption = await renderToString(
    createSSRApp({ render: () => h(Absorption, { absorption: shield.damageAbsorptions[0]! }) }),
  );
  expect(absorption).toContain('value="electric"');
  expect(absorption).toContain('value="0.5"');
  expect(absorption).toContain('value="2"');
});

it('does not reset same-kind shield values and preserves independent shield properties on switching', async () => {
  const shield = { ...createBuffShield(), absorbCount: 3, value: { blackboardKey: 'shield' } };
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
          { shields: [shield], onUpdate: update },
        ),
    }),
  );
  editor.setValueKind(0, shield, { target: { value: 'direct' } });
  editor.setValueKind(0, shield, { target: { value: 'unknown' } });
  expect(update).not.toHaveBeenCalled();
  editor.setValueKind(0, shield, { target: { value: 'attribute' } });
  expect(update).toHaveBeenLastCalledWith([
    { ...shield, value: { attribute: 'HpMax', multiplier: 1, addition: 0 } },
  ]);
});
