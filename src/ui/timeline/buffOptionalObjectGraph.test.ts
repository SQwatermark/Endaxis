import { expect, it } from 'vitest';
import {
  BUFF_OPTIONAL_OBJECTS,
  buildBuffOptionalObjects,
  appendBuffOptionalObject,
} from './buffOptionalObjectGraph';
import { pasteBuffGraphNode } from './buffGraphOperations';

it.each(['sustainedProtection', 'role', 'spellBurst'] as const)(
  'adds and copies the optional %s object without overwriting it',
  key => {
    const document = {};
    const nodes = buildBuffOptionalObjects(document);
    const empty = nodes.find(node => node.sourcePath === key)!;
    expect(empty.canAddChild).toBe('buffMember');
    const added = appendBuffOptionalObject(document, key)!;
    expect(added.root).toEqual({ [key]: BUFF_OPTIONAL_OBJECTS[key].create() });
    expect(appendBuffOptionalObject(added.root, key)).toBeUndefined();
    const copied = pasteBuffGraphNode(document, empty, {
      kind: BUFF_OPTIONAL_OBJECTS[key].payload,
      value: BUFF_OPTIONAL_OBJECTS[key].create(),
    })!;
    expect(copied.root).toEqual(added.root);
    const full = buildBuffOptionalObjects(added.root).find(node => node.sourcePath === key)!;
    expect(full.canDelete).toBe(true);
    expect(full.canMove).toBe(false);
    expect(
      pasteBuffGraphNode(added.root, full, { kind: BUFF_OPTIONAL_OBJECTS[key].payload, value: {} }),
    ).toBeUndefined();
    expect(document).toEqual({});
  },
);
