import { nextTick } from 'vue';
import { expect, it } from 'vitest';
import { mountSetup } from '../../test/componentSetup';
import NodeLevelValues from './NodeLevelValues.vue';

it('keeps invalid drafts local and commits valid level values', async () => {
  const changes: string[] = [];
  const mounted = await mountSetup(NodeLevelValues, {
    text: '[2,5]',
    required: false,
    label: '技能数值',
    onChange: (text: string) => {
      changes.push(text);
      void mounted.update({ text });
    },
  });
  const panel = mounted.state;
  try {
    panel.drafts.value[0] = '';
    panel.update(0, '');
    expect(changes).toEqual([]);
    expect(panel.drafts.value[0]).toBe('2');

    panel.update(0, '3.5');
    await nextTick();
    expect(changes).toEqual(['[3.5,5]']);
    expect(panel.drafts.value).toEqual(['3.5', '5']);
    panel.switchMode('single');
    expect(changes.at(-1)).toBe('3.5');
  } finally {
    mounted.stop();
  }
});
