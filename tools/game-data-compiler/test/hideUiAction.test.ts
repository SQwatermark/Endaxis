import { describe, expect, it } from 'vitest';
import { parseHideUiActionSource } from '../src/source/presentationActions.ts';

const action = {
  $type: 'Beyond.Gameplay.Core.HideUIAction+Data, Gameplay.Beyond',
  isEnable: true,
  priorityLevel: 'Default',
  priorityOffset: 0,
  serverActionIndex: 1,
};

describe('HideUIAction source preservation', () => {
  it.each([true, false])(
    'preserves onlyBlockInput=%s without equating the branches',
    onlyBlockInput => {
      expect(parseHideUiActionSource({ ...action, onlyBlockInput }, 'action')).toEqual({
        kind: 'hideUi',
        onlyBlockInput,
      });
    },
  );

  it.each([undefined, null, 0, 'false'])(
    'rejects missing or non-boolean flag %s',
    onlyBlockInput => {
      expect(() => parseHideUiActionSource({ ...action, onlyBlockInput }, 'action')).toThrow();
    },
  );
});
