import { expect, it } from 'vitest';
import { appendBuffGraphChild } from './buffDamageModifierGraph';
import { buildActionSequenceMindMap, indexSkillStructureNodes } from './skillStructureMindMapModel';
import { pasteBuffGraphNode, moveBuffGraphNode } from './buffGraphOperations';
import { resolveStructureValue } from './skillStructureEditorCommands';
import type { ActionSequenceDefinition } from '../../core/game-data/operatorDefinition';

it('uses optional object ports for presentation/order and an array for child overrides', () => {
  const original: ActionSequenceDefinition = {
    steps: [
      {
        kind: 'applyBuff',
        parameters: { target: 'caster', buffId: 'test', definition: { stackingType: 'refresh' } },
      },
    ],
  };
  const prefix = 'steps[0].parameters.definition';
  const find = (doc: ActionSequenceDefinition, path: string) => {
    const node = [...indexSkillStructureNodes(buildActionSequenceMindMap(doc)).values()].find(
      node => node.sourcePath === `${prefix}.${path}`,
    );
    expect(node, path).toBeDefined();
    return node!;
  };
  const first = pasteBuffGraphNode(original, find(original, 'presentation'), {
    kind: 'buffPresentation',
    value: { iconId: 'test', visible: false },
  })!;
  expect(resolveStructureValue(first.root, `${prefix}.presentation`)).toEqual({
    iconId: 'test',
    visible: false,
  });
  expect(
    pasteBuffGraphNode(first.root, find(first.root, 'presentation'), {
      kind: 'buffPresentation',
      value: {},
    }),
  ).toBeUndefined();
  const order = appendBuffGraphChild(first.root, `${prefix}.presentation.orderPriority`);
  expect(find(order.root, 'presentation.orderPriority').canDelete).toBe(true);
  const child = appendBuffGraphChild(order.root, `${prefix}.childPresentations`);
  expect(find(child.root, 'childPresentations[0].presentation').canDelete).toBe(false);
  expect(find(child.root, 'childPresentations[0]').children.map(node => node.sourcePath)).toEqual([
    `${prefix}.childPresentations[0].presentation`,
  ]);
  const copy = pasteBuffGraphNode(child.root, find(child.root, 'childPresentations'), {
    kind: 'buffChildPresentation',
    value: resolveStructureValue(child.root, child.itemPath),
  })!;
  expect(resolveStructureValue(copy.root, `${prefix}.childPresentations`)).toHaveLength(2);
  expect(
    moveBuffGraphNode(
      copy.root,
      find(copy.root, 'childPresentations[1]'),
      find(copy.root, 'childPresentations[0]'),
      'before',
    )?.itemPath,
  ).toBe(`${prefix}.childPresentations[0]`);
  expect(
    pasteBuffGraphNode(copy.root, find(copy.root, 'childPresentations'), {
      kind: 'buffPresentation',
      value: {},
    }),
  ).toBeUndefined();
  expect(resolveStructureValue(original, `${prefix}.presentation`)).toBeUndefined();
});
