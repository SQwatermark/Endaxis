import { describe, expect, it } from 'vitest';
import type { ResolvedSkillBuffLifecycleSequences } from '../../compiler/combatProgram';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer, type CombatBuffDefinition } from '../buffs/combatBuffs';
import { attachBuffLifecycleSequences } from './buffLifecycleSequenceRuntime';
import type { CombatOperationExecutor } from './skillRuntime';
import { AbilityEventDispatcher } from '../events/abilityEventDispatcher';
import { EventContextConditionExecutor } from './eventContextConditionExecutor';

describe('attachBuffLifecycleSequences', () => {
  it('为每个 Buff 实例隔离黑板和 once 状态', () => {
    const reached: number[] = [];
    const operations: CombatOperationExecutor = {
      execute(_step, context): boolean {
        reached.push(context!.blackboard.getNumber('instance')!);
        return true;
      },
      evaluate: () => true,
    };
    const once = {
      kind: 'once',
      parameters: { scopeKey: 'enable-once' },
      body: {
        steps: [
          {
            kind: 'setContextFlag',
            parameters: { flag: 'reached', value: true, target: 'caster' },
          },
        ],
      },
    } as const;
    const sequences: ResolvedSkillBuffLifecycleSequences = {
      enable: { steps: [once] },
    };
    const base: CombatBuffDefinition<never> = {
      id: 'isolated',
      stackingType: 'unlimited',
      blackboard: { instance: 0 },
    };
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    const definition = attachBuffLifecycleSequences(base, sequences, () => operations);

    const first = container.add(definition, 'source', { blackboardValues: { instance: 1 } })!;
    const second = container.add(definition, 'source', { blackboardValues: { instance: 2 } })!;
    first.disable();
    first.enable();

    expect(second.isEnabled).toBe(true);
    expect(reached).toEqual([1, 2]);
  });

  it('拒绝把新序列和旧生命周期回调混装到同一定义', () => {
    const definition: CombatBuffDefinition<never> = {
      id: 'mixed',
      stackingType: 'unique',
      actions: { start: () => undefined },
    };
    const operations: CombatOperationExecutor = {
      execute: () => true,
      evaluate: () => true,
    };

    expect(() => attachBuffLifecycleSequences(definition, {}, () => operations)).toThrow(
      'cannot mix legacy lifecycle actions',
    );
  });

  it('按实例来源选择操作链，而不把来源固化到共享定义', () => {
    const reached: string[] = [];
    const executor = (sourceId: string): CombatOperationExecutor => ({
      execute: () => {
        reached.push(sourceId);
        return true;
      },
      evaluate: () => true,
    });
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'shared', stackingType: 'unlimited' },
      {
        start: {
          steps: [
            {
              kind: 'setContextFlag',
              parameters: { flag: 'started', value: true, target: 'caster' },
            },
          ],
        },
      },
      buff => executor(buff.sourceId),
    );
    const container = new CombatBuffContainer<never>('enemy', new CombatAttributeSet<never>());

    container.add(definition, 'operator-a');
    container.add(definition, 'operator-b');

    expect(reached).toEqual(['operator-a', 'operator-b']);
  });

  it('为 Buff 实例保留独立目标组并支持同步逐目标执行', () => {
    const reached: number[] = [];
    const operations: CombatOperationExecutor = {
      execute(step, context): boolean {
        if (step.kind === 'findOwnerSpawnedAbilityEntities') {
          context!.targetContext!.set('seals', [
            { kind: 'abilityEntity', instanceId: 11 },
            { kind: 'abilityEntity', instanceId: 12 },
          ]);
        } else {
          const current = context?.currentTarget;
          if (current?.kind === 'abilityEntity') reached.push(current.instanceId);
        }
        return true;
      },
      evaluate: () => true,
    };
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'target-context', stackingType: 'unique' },
      {
        enable: {
          steps: [
            {
              kind: 'findOwnerSpawnedAbilityEntities',
              parameters: { saveToContextKey: 'seals', abilityEntityIds: ['seal'] },
            },
            {
              kind: 'forEachContextTarget',
              parameters: { contextKey: 'seals' },
              body: {
                steps: [
                  {
                    kind: 'setContextFlag',
                    parameters: { flag: 'visited', value: true, target: 'caster' },
                  },
                ],
              },
            },
          ],
        },
      },
      () => operations,
    );
    const container = new CombatBuffContainer<never>('enemy', new CombatAttributeSet<never>());

    container.add(definition, 'operator');

    expect(reached).toEqual([11, 12]);
  });

  it('只在 Buff 启用期间订阅承伤事件并把伤害属性交给事件条件', () => {
    const reached: string[] = [];
    const terminal: CombatOperationExecutor = {
      execute: (_step, context) => {
        reached.push(context!.event!.kind);
        return true;
      },
      evaluate: condition => {
        throw new Error(`unexpected terminal condition '${condition.kind}'`);
      },
    };
    const dispatcher = new AbilityEventDispatcher<'beforeTakeDamage', unknown>();
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'damage-listener', stackingType: 'unique' },
      {},
      () => new EventContextConditionExecutor(terminal),
      undefined,
      [
        {
          event: 'beforeTakeDamage',
          priority: 7,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: {
                    kind: 'eventDamageTagsMatch',
                    match: 'hasAll',
                    tags: ['normalSkill'],
                  },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'conditional',
                      parameters: { condition: { kind: 'eventSourceMatchesBuffSource' } },
                      whenTrue: {
                        steps: [
                          {
                            kind: 'setContextFlag',
                            parameters: { flag: 'matched', value: true, target: 'caster' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      (event, priority, handle) =>
        dispatcher.registerAction(event, priority, context => handle(context.payload)),
    );
    const container = new CombatBuffContainer<never>('enemy', new CombatAttributeSet<never>());
    const buff = container.add(definition, 'seal')!;
    const dispatch = (tags: readonly string[], sourceId = 'seal') =>
      dispatcher.dispatch(
        {
          event: 'beforeTakeDamage',
          payload: {
            sourceId,
            targetId: 'enemy',
            tags,
            features: [],
          },
        },
        [],
      );

    dispatch(['normalAttack']);
    dispatch(['normalSkill'], 'other-source');
    dispatch(['normalSkill']);
    buff.disable();
    dispatch(['normalSkill']);
    buff.enable();
    dispatch(['normalSkill']);
    buff.finish();
    dispatch(['normalSkill']);

    expect(reached).toEqual(['abilityDamage', 'abilityDamage']);
  });
});
