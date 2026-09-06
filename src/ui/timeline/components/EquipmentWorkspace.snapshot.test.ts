import { createRenderer, h, nextTick, shallowRef, ssrContextKey, type ComponentOptions } from 'vue';
import { expect, it } from 'vitest';
import { OPERATOR_WEAPON_TYPES } from '../../../core/game-data/operatorDefinition';
import WeaponWorkspace from './WeaponDefinitionWorkspaceDialog.vue';
import GearWorkspace from './GearDefinitionWorkspaceDialog.vue';
import GearSetWorkspace from './GearSetDefinitionWorkspaceDialog.vue';

const contribution = {
  initializationBlackboard: { custom: 1 },
  initializationSequence: { steps: [] },
};
const trait = { key: 'trait', levelCount: 1, ...contribution };
const cases = [
  {
    name: 'weapon',
    component: WeaponWorkspace,
    definition: {
      slug: 'weapon',
      rarity: 3,
      weaponType: OPERATOR_WEAPON_TYPES[0],
      baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
      traits: [trait],
    },
  },
  {
    name: 'gear',
    component: GearWorkspace,
    definition: {
      slug: 'gear',
      slotType: 'armor',
      levelRequirement: 1,
      baseDefense: 1,
      traits: [
        {
          ...trait,
          display: {
            kind: 'modifier',
            modifier: { kind: 'panelStat', stat: 'attackFlat', value: 1 },
          },
        },
      ],
    },
  },
  { name: 'set', component: GearSetWorkspace, definition: { slug: 'set', ...contribution } },
];

// Production setup/save/watchers, without template rendering. The browser fixture verifies
// the graph's actual deletion and history controls separately.
it.each(cases)(
  '$name replaces graph snapshots, saves deletions, and resets canceled drafts on reopen',
  async ({ name, component, definition }) => {
    const visible = shallowRef(true);
    const saved: any[] = [];
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
    const wrapped = {
      ...(component as ComponentOptions),
      setup(props: any, context: any) {
        panel = (component as any).setup(props, context);
        return panel;
      },
      render: () => null,
    };
    const app = renderer.createApp({
      render: () =>
        h(wrapped, {
          visible: visible.value,
          baseDefinition: definition,
          customDefinition: definition,
          gearSetIds: [],
          onSave: (value: unknown) => saved.push(value),
          'onUpdate:visible': (value: boolean) => {
            visible.value = value;
          },
        }),
    });
    app.provide(ssrContextKey, { modules: new Set() });
    app.mount({});
    const before = JSON.stringify(definition);
    try {
      const update = (value: object) => {
        if (name === 'set') panel.updateContribution(value);
        else {
          panel.selectedSection.value = 0;
          panel.updateTraitContribution(value);
        }
      };
      const owned = () => (name === 'set' ? panel.draft.value : panel.draft.value.traits[0]);
      update({});
      expect(owned()).not.toHaveProperty('initializationSequence');
      expect(owned()).not.toHaveProperty('initializationBlackboard');
      expect(panel.isDirty.value).toBe(true);
      expect(JSON.stringify(definition)).toBe(before);
      update(contribution); // Undo snapshot from the graph.
      expect(panel.isDirty.value).toBe(false);
      update({}); // Redo deletion.
      expect(panel.issues.value).toEqual([]);
      panel.save();
      expect(saved).toHaveLength(1);
      const savedOwned = name === 'set' ? saved[0] : saved[0].traits[0];
      expect(savedOwned).not.toHaveProperty('initializationSequence');
      expect(savedOwned).not.toHaveProperty('initializationBlackboard');
      expect(saved[0].slug).toBe(definition.slug);
      await nextTick();
      visible.value = true;
      await nextTick();
      expect(owned().initializationSequence).toEqual({ steps: [] });
      update({});
      visible.value = false; // Cancel: no save event.
      await nextTick();
      visible.value = true;
      await nextTick();
      expect(panel.isDirty.value).toBe(false);
      expect(saved).toHaveLength(1);
      expect(JSON.stringify(definition)).toBe(before);
    } finally {
      app.unmount();
    }
  },
);
