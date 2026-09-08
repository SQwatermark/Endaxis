import { expect, it } from 'vitest';
import { appendBuffGraphChild } from './buffDamageModifierGraph';
import { buildActionSequenceMindMap, indexSkillStructureNodes } from './skillStructureMindMapModel';
import { moveBuffGraphNode, pasteBuffGraphNode } from './buffGraphOperations';
import { resolveStructureValue } from './skillStructureEditorCommands';
import type { ActionSequenceDefinition } from '../../core/game-data/operatorDefinition';

it('keeps shields and absorption rules in distinct array ports with full nested paths', () => {
  const original: ActionSequenceDefinition = {
    steps: [
      {
        kind: 'applyBuff',
        parameters: { target: 'caster', buffId: 'shield', definition: { stackingType: 'refresh' } },
      },
    ],
  };
  const prefix = 'steps[0].parameters.definition.shields';
  const find = (doc: ActionSequenceDefinition, path: string) => {
    const result = [...indexSkillStructureNodes(buildActionSequenceMindMap(doc)).values()].find(
      node => node.sourcePath === path,
    );
    expect(result, path).toBeDefined();
    return result!;
  };
  const added = appendBuffGraphChild(original, prefix);
  const member = find(added.root, added.itemPath);
  expect(member.payloadKind).toBe('buffShield');
  expect(member.children.map(node => node.sourcePath)).toEqual([`${prefix}[0].damageAbsorptions`]);
  const absorption = appendBuffGraphChild(added.root, `${prefix}[0].damageAbsorptions`);
  expect(resolveStructureValue(absorption.root, absorption.itemPath)).toEqual({
    damageType: 'physical',
    ratio: 1,
    scale: 1,
  });
  const copy = pasteBuffGraphNode(
    absorption.root,
    find(absorption.root, `${prefix}[0].damageAbsorptions`),
    {
      kind: 'buffShieldAbsorption',
      value: resolveStructureValue(absorption.root, absorption.itemPath),
    },
  )!;
  expect(resolveStructureValue(copy.root, `${prefix}[0].damageAbsorptions`)).toHaveLength(2);
  expect(
    pasteBuffGraphNode(copy.root, find(copy.root, prefix), {
      kind: 'buffShieldAbsorption',
      value: {},
    }),
  ).toBeUndefined();
  const moved = moveBuffGraphNode(
    copy.root,
    find(copy.root, copy.itemPath),
    find(copy.root, absorption.itemPath),
    'before',
  )!;
  expect(moved.itemPath).toBe(absorption.itemPath);
  expect(resolveStructureValue(original, prefix)).toBeUndefined();
});
