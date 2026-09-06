import { createRenderer, h, nextTick, shallowRef, ssrContextKey, type ComponentOptions } from 'vue';
import { expect, it } from 'vitest';
import Graph from './AbilityEntityDefinitionGraphEditor.vue';
import type { AbilityEntityDefinition } from '../../../core/game-data/operatorDefinition';

it('keeps all entity Inspector changes in the same undo/redo transaction history', async () => {
  const initial = (): AbilityEntityDefinition => ({
    lifetime: { kind: 'limited', durationSeconds: 10 },
    childSkill: {
      skillId: 'child',
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [{ kind: 'finishActionOwnerAbilityEntity', parameters: {} }],
          },
        },
      ],
    },
  });
  const definition = shallowRef(initial());
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
    ...(Graph as ComponentOptions),
    setup(props: any, ctx: any) {
      panel = (Graph as any).setup(props, ctx);
      return panel;
    },
    render: () => null,
  };
  const app = renderer.createApp({
    render: () =>
      h(wrapped, {
        abilityEntityId: 'entity',
        definition: definition.value,
        skillLevel: 1,
        onUpdate: (value: AbilityEntityDefinition) => {
          definition.value = value;
        },
      }),
  });
  app.provide(ssrContextKey, { modules: new Set() });
  app.mount({});
  const event = (value: string) => ({ target: { value } });
  const select = (path: string) => {
    const node = [...panel.nodeIndex.value.values()].find(
      (node: any) => node.sourcePath === path,
    ) as any;
    expect(node, path).toBeDefined();
    panel.selectNode({ id: node.id });
  };
  try {
    const edits = [
      () => panel.setLifetimeKind(event('infinite')),
      () => panel.setLifetimeDurationValue(20),
      () => panel.setBornTags([1]),
      () => panel.setOptionalDefinitionNumber('maxStackingCount', 3),
      () => panel.setDeathReleaseDelay(event('2')),
      () => {
        select('childSkill');
        return panel.updateChildSkillId(event('renamed'));
      },
      () => {
        select('childSkill');
        panel.updateChildBlackboard({ value: 2 });
      },
      () => {
        select('childSkill.scheduledSequences[0]');
        panel.updateSequenceFrame('startFrame', event('12'));
      },
      () => {
        select('childSkill.scheduledSequences[0].sequence.steps[0]');
        panel.updateStep({ kind: 'finishCurrentAbilityEntity', parameters: {} });
      },
    ];
    for (const edit of edits) {
      definition.value = initial();
      await nextTick();
      const before = JSON.parse(JSON.stringify(definition.value));
      await edit();
      await nextTick();
      const after = JSON.parse(JSON.stringify(definition.value));
      expect(after).not.toEqual(before);
      await panel.restoreStructureHistory('undo');
      expect(definition.value).toEqual(before);
      await panel.restoreStructureHistory('redo');
      expect(definition.value).toEqual(after);
      await panel.restoreStructureHistory('undo');
      await edit();
      await nextTick();
      expect(panel.canRedoStructure.value).toBe(false);
      await panel.restoreStructureHistory('redo');
      expect(definition.value).toEqual(after);
    }
  } finally {
    app.unmount();
  }
});
