/** 作用域缓存与黑板整图恢复，确保恢复后命中原缓存，。 */
import { describe, expect, it } from 'vitest';
import { StateStepper } from '../runtime/stateStepper';
import { createActionScopeState } from '../state/actionState';
import { createActionBlackboardState } from '../state/foundationState';
import { getActionScopeBlackboard, resetActionScopes } from './sequenceControl';

describe('action scope data', () => {
  it('restores cache identity and reset branches together', () => {
    const session = new StateStepper(
      {
        scopes: createActionScopeState(),
        parent: createActionBlackboardState(),
        creations: 0,
      },
      (step, input: 'run' | 'reset') => {
        const state = step.state;
        if (input === 'reset') {
          resetActionScopes(state.scopes);
          return;
        }
        getActionScopeBlackboard(
          state.scopes,
          state.parent,
          {
            scopeKey: 'scope',
            initialValues: {},
            inheritParent: false,
          },
          () => {
            state.creations += 1;
            return createActionBlackboardState({ value: state.creations });
          },
        );
      },
    );
    session.step('run');
    const cached = session.save();
    session.step('reset');
    session.step('run');
    expect(session.read().creations).toBe(2);
    session.restore(cached);
    session.step('run');
    const restored = session.read();
    expect(restored.creations).toBe(1);
    expect(restored.scopes.blackboards.has(restored.parent)).toBe(true);
  });

  it('does not cache execution scopes', () => {
    const state = createActionScopeState();
    const parent = createActionBlackboardState();
    const parameters = {
      scopeKey: 'scope',
      lifetime: 'execution' as const,
      initialValues: {},
      inheritParent: false,
    };
    const first = getActionScopeBlackboard(state, parent, parameters, () =>
      createActionBlackboardState(),
    );
    const second = getActionScopeBlackboard(state, parent, parameters, () =>
      createActionBlackboardState(),
    );
    expect(first).not.toBe(second);
    expect(state.blackboards.size).toBe(0);
  });
});
