import { createRenderer, h, nextTick, shallowRef, ssrContextKey, type ComponentOptions } from 'vue';
import { createI18n } from 'vue-i18n';
import { expect, it } from 'vitest';
import BattleLogPanel from './BattleLogPanel.vue';
import type { TimelineBattleLogSnapshot } from '../timelineBattleLogProjection';

const log = (name: string, damage: number): TimelineBattleLogSnapshot => ({
  entries: [
    {
      sequence: 1,
      frame: 30,
      time: 1,
      event: 'DamageApplied',
      sourceId: 'track:1',
      targetId: 'enemy',
      data: { castId: 'cast:1', value: damage, damageType: 'electric' },
    },
  ],
  resolveCastOwners: () => [
    { castId: 'cast:1', label: '战技', operatorLabel: name, sourceId: 'track:1' },
  ],
});

// Mounted production setup and watchers, deliberately without a DOM/template.
// Browser rendering and pointer/keyboard activation are separate verification.
async function mount(initial: TimelineBattleLogSnapshot | null) {
  const current = shallowRef(initial);
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
  const component = {
    ...(BattleLogPanel as ComponentOptions),
    setup(props: any, context: any) {
      panel = (BattleLogPanel as any).setup(props, context);
      return panel;
    },
    render: () => null,
  };
  const app = renderer.createApp({
    render: () =>
      h(component, {
        log: current.value,
        selectedCastId: null,
        eventLabel: String,
        damageTypeLabel: String,
      }),
  });
  app.use(createI18n({ legacy: false, locale: 'en', messages: { en: {} } }));
  app.provide(ssrContextKey, { modules: new Set() });
  app.mount({});
  await nextTick();
  return { current, panel, stop: () => app.unmount() };
}

it('holds receipts, group labels and source labels until one explicit refresh', async () => {
  const first = log('佩丽卡', 100);
  const f = await mount(first);
  try {
    expect(f.panel.sourceLabel(first.entries[0])).toBe('佩丽卡 · 战技');
    expect(f.panel.groupedEntries.value[0].damage).toBe(100);
    f.current.value = log('弧光', 500);
    await nextTick();
    expect(f.panel.dirty.value).toBe(true);
    expect(f.panel.snapshot.value).toBe(first);
    expect(f.panel.sourceLabel(first.entries[0])).toBe('佩丽卡 · 战技');
    expect(f.panel.groupedEntries.value[0].damage).toBe(100);
    expect(f.panel.ownerBySourceId.value.get('track:1').operatorLabel).toBe('佩丽卡');
    f.panel.refresh();
    expect(f.panel.dirty.value).toBe(false);
    expect(f.panel.sourceLabel(first.entries[0])).toBe('弧光 · 战技');
    expect(f.panel.groupedEntries.value[0].damage).toBe(500);
  } finally {
    f.stop();
  }
});

it('loads the first publication but does not auto-refresh a published empty log', async () => {
  const f = await mount(null);
  try {
    const empty = { entries: [], resolveCastOwners: () => [] };
    f.current.value = empty;
    await nextTick();
    expect(f.panel.snapshot.value).toBe(empty);
    f.current.value = log('佩丽卡', 100);
    await nextTick();
    expect(f.panel.entries.value).toEqual([]);
    expect(f.panel.dirty.value).toBe(true);
    f.panel.refresh();
    expect(f.panel.entries.value).toHaveLength(1);
    f.panel.clearEvents();
    expect(f.panel.filteredEntries.value).toHaveLength(0);
  } finally {
    f.stop();
  }
});

it('relocalizes the retained snapshot without refreshing to a newer publication', async () => {
  const language = shallowRef('zh');
  const first = log('unused', 100);
  const f = await mount({
    ...first,
    resolveCastOwners: () => [
      {
        castId: 'cast:1',
        sourceId: 'track:1',
        label: language.value === 'zh' ? '战技' : 'Battle skill',
        operatorLabel: language.value === 'zh' ? '佩丽卡' : 'Perlica',
      },
    ],
  });
  try {
    f.current.value = log('弧光', 500);
    await nextTick();
    language.value = 'en';
    expect(f.panel.sourceLabel(first.entries[0])).toBe('Perlica · Battle skill');
    expect(f.panel.groupedEntries.value[0].damage).toBe(100);
    expect(f.panel.dirty.value).toBe(true);
  } finally {
    f.stop();
  }
});

it('clears the retained log when its publication scope is cleared', async () => {
  const f = await mount(log('佩丽卡', 100));
  try {
    f.current.value = null;
    await nextTick();
    expect(f.panel.entries.value).toEqual([]);
    expect(f.panel.castOwners.value).toEqual([]);
    expect(f.panel.dirty.value).toBe(false);
    f.current.value = log('弧光', 500);
    await nextTick();
    expect(f.panel.groupedEntries.value[0].damage).toBe(500);
    expect(f.panel.sourceLabel(f.panel.entries.value[0])).toBe('弧光 · 战技');
  } finally {
    f.stop();
  }
});
