import { describe, expect, it } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';
import { CombatVitals } from './combatVitals';
import { RuntimeTargetContext } from './runtimeTargetContext';
import { TargetContextOperationExecutor } from './targetContextOperationExecutor';

const terminal = {
  execute: () => false,
  evaluate: () => false,
};

function vitals(health: number): CombatVitals {
  return new CombatVitals({
    health,
    maxHealth: 1000,
    maxPoise: 0,
    poise: 0,
    poiseRecoveryTime: 0,
    poiseRecoveryTimeMultiplier: 0,
    poiseBrokenEndTime: 0,
    poiseImmune: false,
  });
}

describe('TargetContextOperationExecutor', () => {
  it('snapshots the controlled identity, then excludes it from lowest-health selection', () => {
    const ledgers = new Map([
      ['operator:main', vitals(100)],
      ['operator:z-lowest', vitals(500)],
      ['operator:a-near-tie', vitals(500.5)],
    ]);
    let controlledId = 'operator:main';
    const executor = new TargetContextOperationExecutor('operator:ember', terminal, id => id, {
      listOperatorIds: () => [...ledgers.keys()],
      isOperatorControlled: operatorId => operatorId === controlledId,
      resolveVitals: operatorId => ledgers.get(operatorId)!,
    });
    const targetContext = new RuntimeTargetContext();
    const context = { blackboard: new ActionBlackboard(), targetContext };

    executor.execute(
      {
        kind: 'findCharacterTeamTargets',
        parameters: {
          saveToContextKey: 'Main',
          selection: { kind: 'controlledOperator' },
        },
      },
      context,
    );
    controlledId = 'operator:z-lowest';
    executor.execute(
      {
        kind: 'findCharacterTeamTargets',
        parameters: {
          saveToContextKey: 'CureTarget',
          selection: {
            kind: 'lowestHealthRatioOperator',
            excludedContextKey: 'Main',
          },
        },
      },
      context,
    );

    expect(targetContext.get('Main')).toEqual([{ kind: 'operator', operatorId: 'operator:main' }]);
    // 0.001 内沿用文档化的稳定实例 ID 投影，不声称复现原生对象哈希。
    expect(targetContext.get('CureTarget')).toEqual([
      { kind: 'operator', operatorId: 'operator:a-near-tie' },
    ]);
    ledgers.get('operator:a-near-tie')!.heal(499.5);
    ledgers.get('operator:z-lowest')!.takeDamage(400);
    expect(targetContext.get('CureTarget')).toEqual([
      { kind: 'operator', operatorId: 'operator:a-near-tie' },
    ]);
  });

  it('overwrites a previous context group with an empty query result', () => {
    const targetContext = new RuntimeTargetContext();
    targetContext.set('Saved', [{ kind: 'operator', operatorId: 'operator:old' }]);
    const executor = new TargetContextOperationExecutor('operator', terminal, id => id, {
      listOperatorIds: () => [],
      isOperatorControlled: () => false,
      resolveVitals: () => {
        throw new Error('empty query must not resolve vitals');
      },
    });
    executor.execute(
      {
        kind: 'findCharacterTeamTargets',
        parameters: {
          saveToContextKey: 'Saved',
          selection: { kind: 'lowestHealthRatioOperator' },
        },
      },
      { blackboard: new ActionBlackboard(), targetContext },
    );
    expect(targetContext.get('Saved')).toEqual([]);
  });

  it('excludes the current skill caster before choosing the lowest-health teammate', () => {
    const ledgers = new Map([
      ['operator:catcher', vitals(100)],
      ['operator:ally', vitals(500)],
    ]);
    const targetContext = new RuntimeTargetContext();
    const executor = new TargetContextOperationExecutor('operator:catcher', terminal, id => id, {
      listOperatorIds: () => [...ledgers.keys()],
      isOperatorControlled: () => false,
      resolveVitals: operatorId => ledgers.get(operatorId)!,
    });

    executor.execute(
      {
        kind: 'findCharacterTeamTargets',
        parameters: {
          saveToContextKey: 'Ally',
          selection: { kind: 'lowestHealthRatioOperator', excludeCaster: true },
        },
      },
      { blackboard: new ActionBlackboard(), targetContext },
    );

    expect(targetContext.get('Ally')).toEqual([{ kind: 'operator', operatorId: 'operator:ally' }]);
  });

  it('excludes the current forEach operator target before choosing the lowest-health teammate', () => {
    const ledgers = new Map([
      ['operator:main', vitals(100)],
      ['operator:ally', vitals(500)],
    ]);
    const targetContext = new RuntimeTargetContext();
    const executor = new TargetContextOperationExecutor(
      'operator:aura-source',
      terminal,
      id => id,
      {
        listOperatorIds: () => [...ledgers.keys()],
        isOperatorControlled: operatorId => operatorId === 'operator:main',
        resolveVitals: operatorId => ledgers.get(operatorId)!,
      },
    );
    executor.execute(
      {
        kind: 'findCharacterTeamTargets',
        parameters: {
          saveToContextKey: 'CureTarget',
          selection: { kind: 'lowestHealthRatioOperator', excludeCurrentTarget: true },
        },
      },
      {
        blackboard: new ActionBlackboard(),
        targetContext,
        currentTarget: { kind: 'operator', operatorId: 'operator:main' },
      },
    );
    expect(targetContext.get('CureTarget')).toEqual([
      { kind: 'operator', operatorId: 'operator:ally' },
    ]);
  });

  it('resolves a Buff SourceFinder group through the AbilitySystem source chain', () => {
    const executor = new TargetContextOperationExecutor('operator:holder', terminal, id =>
      id === 'ability-entity:7' ? 'operator:xaihi' : id,
    );
    const targetContext = new RuntimeTargetContext();
    executor.execute(
      {
        kind: 'mergeContextTargets',
        parameters: {
          saveToContextKey: 'seraph',
          sources: [{ kind: 'target', target: 'buffSource' }],
        },
      },
      {
        blackboard: new ActionBlackboard(),
        targetContext,
        buffSourceId: 'ability-entity:7',
      },
    );
    expect(targetContext.get('seraph')).toEqual([
      { kind: 'operator', operatorId: 'operator:xaihi' },
    ]);
  });

  it('merges the current forEach target without re-resolving its identity', () => {
    const executor = new TargetContextOperationExecutor('operator:holder', terminal);
    const targetContext = new RuntimeTargetContext();
    executor.execute(
      {
        kind: 'mergeContextTargets',
        parameters: {
          saveToContextKey: 'healTarget',
          sources: [{ kind: 'target', target: 'currentTarget' }],
        },
      },
      {
        blackboard: new ActionBlackboard(),
        targetContext,
        currentTarget: { kind: 'operator', operatorId: 'operator:controlled' },
      },
    );
    expect(targetContext.get('healTarget')).toEqual([
      { kind: 'operator', operatorId: 'operator:controlled' },
    ]);
  });

  it('initializes, merges and deduplicates event targets by stable identity', () => {
    const executor = new TargetContextOperationExecutor('operator', terminal);
    const targetContext = new RuntimeTargetContext();
    const context = {
      blackboard: new ActionBlackboard(),
      targetContext,
      event: {
        kind: 'abilitySpellInfliction' as const,
        event: 'beforeTakeInfliction' as const,
        sourceId: 'operator',
        targetId: 'enemy',
        element: 'nature' as const,
      },
    };

    executor.execute(
      { kind: 'mergeContextTargets', parameters: { saveToContextKey: 'seen', sources: [] } },
      context,
    );
    expect(
      executor.evaluate(
        { kind: 'contextTargetContains', parentContextKey: 'seen', child: 'eventTarget' },
        context,
      ),
    ).toBe(false);

    const merge = {
      kind: 'mergeContextTargets' as const,
      parameters: {
        saveToContextKey: 'seen',
        sources: [
          { kind: 'target' as const, target: 'eventTarget' as const },
          { kind: 'context' as const, contextKey: 'seen' },
        ],
      },
    };
    executor.execute(merge, context);
    executor.execute(merge, context);
    expect(targetContext.get('seen')).toEqual([{ kind: 'enemy' }]);
    expect(
      executor.evaluate(
        { kind: 'contextTargetContains', parentContextKey: 'seen', child: 'eventTarget' },
        context,
      ),
    ).toBe(true);
  });
});
