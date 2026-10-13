import { expect, it } from 'vitest';
import { formatCombatStateInspection } from './combatStateInspection';

it('保留 Map、Set 内容和共享引用，不丢失循环黑板或特殊数值', () => {
  const blackboard = new Map<string, unknown>();
  blackboard.set('self', blackboard);
  blackboard.set('unbounded', Infinity);
  const source = { blackboard, alias: blackboard, tags: new Set(['Frozen']), missing: undefined };
  expect(JSON.parse(formatCombatStateInspection(source))).toEqual({
    blackboard: {
      $type: 'Map',
      entries: [
        ['self', { $ref: '$["blackboard"]' }],
        ['unbounded', 'Infinity'],
      ],
    },
    alias: { $ref: '$["blackboard"]' },
    tags: { $type: 'Set', values: ['Frozen'] },
    missing: { $type: 'undefined' },
  });
  expect(blackboard.get('self')).toBe(blackboard);
});
