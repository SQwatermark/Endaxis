import { describe, expect, it } from 'vitest';
import type { ResolvedSkillBuffLifecycleSequences } from '../../compiler/combatProgram';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer, type CombatBuffDefinition } from '../buffs/combatBuffs';
import {
  attachBuffLifecycleSequences,
  readEventSkillCastInfo,
} from './buffLifecycleSequenceRuntime';
import type { CombatOperationExecutor } from './skillRuntime';
import { AbilityEventDispatcher } from '../events/abilityEventDispatcher';
import { EventContextConditionExecutor } from './eventContextConditionExecutor';

describe('attachBuffLifecycleSequences', () => {
  it('区分空来源与遗漏来源，接受处决类型且不从其他字段覆盖显式空来源', () => {
    const cast = { skillCastId: 3, skillId: 'finisher', skillType: 'finisher' };
    expect(readEventSkillCastInfo(cast)).toEqual({
      skillCastId: 3,
      originSkillId: 'finisher',
      originSkillType: 'finisher',
      nonReturnedSpCost: 0,
    });
    expect(readEventSkillCastInfo({ ...cast, skillCastInfo: null })).toBeNull();
    expect(readEventSkillCastInfo({})).toBeUndefined();
    expect(() => readEventSkillCastInfo({ skillCastInfo: { originSkillType: 'unknown' } })).toThrow(
      'invalid skill cast identity',
    );
  });

  it('把技能槽替换绑定到 Buff 启用边界并在结束时还原', () => {
    const changes: Array<{ targetSkillKey: string; inherit: boolean | undefined }> = [];
    const operations: CombatOperationExecutor = {
      execute: step => {
        if (step.kind === 'changeSkillSlot') {
          changes.push({
            targetSkillKey: step.parameters.targetSkillKey,
            inherit: step.parameters.inheritOriginSkillCooldownProgress,
          });
        }
        return true;
      },
      evaluate: () => true,
    };
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'ultimate-form', stackingType: 'unique' },
      {},
      () => operations,
      undefined,
      [],
      undefined,
      [],
      [],
      [
        {
          skillGroupKey: 'battleSkill',
          targetSkillKey: 'battleSkillDuringUltimate',
          revertedSkillKey: 'battleSkill',
          inheritOriginSkillCooldownProgress: true,
        },
      ],
    );

    const buff = container.add(definition, 'operator')!;
    expect(changes).toEqual([{ targetSkillKey: 'battleSkillDuringUltimate', inherit: true }]);

    buff.finish('lifetime');
    expect(changes).toEqual([
      { targetSkillKey: 'battleSkillDuringUltimate', inherit: true },
      { targetSkillKey: 'battleSkill', inherit: true },
    ]);
  });

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

  it('按 Buff 实例局部时钟推进时间线，并在停用后从头重新启用', () => {
    const reached: number[] = [];
    const operations: CombatOperationExecutor = {
      execute: (_step, context) => {
        reached.push(context!.blackboard.getNumber('instance')!);
        return true;
      },
      evaluate: () => true,
    };
    const container = new CombatBuffContainer<never>('enemy', new CombatAttributeSet<never>());
    const definition = attachBuffLifecycleSequences<never>(
      {
        id: 'scheduled',
        stackingType: 'unlimited',
        blackboard: { instance: 0 },
      },
      {},
      () => operations,
      undefined,
      [],
      undefined,
      [
        {
          startFrame: 2,
          sequence: {
            steps: [
              {
                kind: 'setContextFlag',
                parameters: { flag: 'reached', value: true, target: 'caster' },
              },
            ],
          },
        },
      ],
    );
    const first = container.add(definition, 'source', { blackboardValues: { instance: 1 } })!;
    container.add(definition, 'source', { blackboardValues: { instance: 2 } });

    container.tick(1 / 30);
    first.disable();
    container.tick(1 / 30);
    expect(reached).toEqual([2]);

    first.enable();
    container.tick(1 / 30);
    expect(reached).toEqual([2]);
    container.tick(1 / 30);
    expect(reached).toEqual([2, 1]);
  });

  it('让启用序列的作用域操作持续到 Buff 停用或结束', () => {
    const reached: string[] = [];
    const operations: CombatOperationExecutor = {
      execute: () => {
        reached.push('apply');
        return true;
      },
      end: () => reached.push('finish'),
      evaluate: () => true,
    };
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'persistent-aura', stackingType: 'unlimited' },
      {
        enable: {
          steps: [
            {
              kind: 'applyBuff',
              parameters: {
                buffId: 'aura-child',
                target: 'enemy',
                finishByAction: true,
              },
            },
          ],
        },
      },
      () => operations,
    );
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    const disabled = container.add(definition, 'source')!;

    expect(reached).toEqual(['apply']);
    disabled.disable();
    expect(reached).toEqual(['apply', 'finish']);

    const finished = container.add(definition, 'source')!;
    expect(reached).toEqual(['apply', 'finish', 'apply']);
    finished.finish();
    expect(reached).toEqual(['apply', 'finish', 'apply', 'finish']);
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
      (event, priority, handle) => {
        if (event !== 'beforeTakeDamage') throw new Error(`unexpected event '${event}'`);
        return dispatcher.registerAction(event, priority, context => handle(context.payload));
      },
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

  it('把失衡归零事件保留为带来源身份的 Ability 事件', () => {
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
    const dispatcher = new AbilityEventDispatcher<'poiseZero', unknown>();
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'poise-listener', stackingType: 'unique' },
      {},
      () => new EventContextConditionExecutor(terminal, sourceId => sourceId === 'operator'),
      undefined,
      [
        {
          event: 'poiseZero',
          priority: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: { condition: { kind: 'eventSourceControlled' } },
                whenTrue: {
                  steps: [
                    {
                      kind: 'setContextFlag',
                      parameters: { flag: 'broken', value: true, target: 'caster' },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      (event, priority, handle) => {
        if (event !== 'poiseZero') throw new Error(`unexpected event '${event}'`);
        return dispatcher.registerAction(event, priority, context => handle(context.payload));
      },
    );
    const container = new CombatBuffContainer<never>('enemy', new CombatAttributeSet<never>());
    container.add(definition, 'abilityentity.arcane')!;

    dispatcher.dispatch(
      {
        event: 'poiseZero',
        payload: {
          sourceId: 'operator',
          targetId: 'enemy',
          finalDelta: -10,
          actualDelta: -10,
          ignorePoiseImmune: false,
          cancelled: false,
        },
      },
      [],
    );

    expect(reached).toEqual(['abilityPoise']);
  });

  it('只在 Buff 启用期间订阅击杀语义事件', () => {
    const reached: string[] = [];
    let handler:
      | ((event: {
          readonly kind: 'enemyDefeated';
          readonly sourceOperatorId: string;
          readonly tags: readonly ['normalSkill'];
        }) => void)
      | undefined;
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'kill-listener', stackingType: 'unique' },
      {},
      () => ({
        execute: (_step, context) => {
          reached.push(context!.event!.kind);
          return true;
        },
        evaluate: () => true,
      }),
      undefined,
      [
        {
          event: 'afterKillEntity',
          priority: 3,
          sequence: {
            steps: [
              {
                kind: 'setContextFlag',
                parameters: { flag: 'extended', value: true, target: 'caster' },
              },
            ],
          },
        },
      ],
      undefined,
      [],
      [],
      [],
      (_event, _priority, callback) => {
        handler = callback as typeof handler;
        return { dispose: () => (handler = undefined) };
      },
    );
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    const buff = container.add(definition, 'operator')!;
    const event = {
      kind: 'enemyDefeated',
      sourceOperatorId: 'operator',
      tags: ['normalSkill'],
    } as const;

    handler!(event);
    buff.disable();
    expect(handler).toBeUndefined();
    buff.enable();
    handler!(event);
    buff.finish();
    expect(handler).toBeUndefined();
    expect(reached).toEqual(['enemyDefeated', 'enemyDefeated']);
  });

  it('把编译后的 Skill/Gain 技力事实作为 Buff 语义事件上下文', () => {
    const reached: string[] = [];
    let handler:
      | ((event: {
          readonly kind: 'spGained';
          readonly sourceOperatorId: string;
          readonly source: 'skill';
          readonly gainKind: 'gain';
          readonly amount: number;
        }) => void)
      | undefined;
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'skill-sp-listener', stackingType: 'unique' },
      {},
      () => ({
        execute: (_step, context) => {
          reached.push(context!.event!.kind);
          return true;
        },
        evaluate: () => true,
      }),
      undefined,
      [
        {
          event: 'skillSpGained',
          priority: 0,
          sequence: {
            steps: [
              {
                kind: 'setContextFlag',
                parameters: { flag: 'reached', value: true, target: 'caster' },
              },
            ],
          },
        },
      ],
      undefined,
      [],
      [],
      [],
      (_event, _priority, callback) => {
        handler = callback as typeof handler;
        return { dispose: () => (handler = undefined) };
      },
    );
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    container.add(definition, 'operator')!;

    handler!({
      kind: 'spGained',
      sourceOperatorId: 'operator',
      source: 'skill',
      gainKind: 'gain',
      amount: 20,
    });
    expect(reached).toEqual(['spGained']);
  });

  it('事件响应可以结束正在执行响应的 Buff 并立即注销自身订阅', () => {
    let executions = 0;
    const terminal: CombatOperationExecutor = {
      execute: (step, context) => {
        if (step.kind !== 'finishCurrentBuff') {
          throw new Error(`unexpected operation '${step.kind}'`);
        }
        executions += 1;
        return context!.finishCurrentBuff!(step.parameters.reason);
      },
      evaluate: condition => {
        throw new Error(`unexpected condition '${condition.kind}'`);
      },
    };
    const dispatcher = new AbilityEventDispatcher<'beforeTakeDamage', unknown>();
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'self-finishing-listener', stackingType: 'unique' },
      {},
      () => terminal,
      undefined,
      [
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: {
            steps: [{ kind: 'finishCurrentBuff', parameters: { reason: 'early' } }],
          },
        },
      ],
      (event, priority, handle) => {
        if (event !== 'beforeTakeDamage') throw new Error(`unexpected event '${event}'`);
        return dispatcher.registerAction(event, priority, context => handle(context.payload));
      },
    );
    const container = new CombatBuffContainer<never>('enemy', new CombatAttributeSet<never>());
    const buff = container.add(definition, 'seal')!;
    const dispatch = () =>
      dispatcher.dispatch(
        {
          event: 'beforeTakeDamage',
          payload: {
            sourceId: 'seal',
            targetId: 'enemy',
            tags: ['normalSkill'],
            features: [],
          },
        },
        [],
      );

    dispatch();
    dispatch();

    expect(executions).toBe(1);
    expect(buff.isFinished).toBe(true);
  });

  it('按原始技能与结束 Buff 身份暂停并恢复当前 Buff 计时', () => {
    const terminal: CombatOperationExecutor = {
      execute: (step, context) => {
        if (step.kind !== 'setCurrentBuffTimePaused') {
          throw new Error(`unexpected operation '${step.kind}'`);
        }
        context!.setCurrentBuffTimePaused!(step.parameters.paused);
        return true;
      },
      evaluate: condition => {
        throw new Error(`unexpected condition '${condition.kind}'`);
      },
    };
    const dispatcher = new AbilityEventDispatcher<'beforeCastSkill' | 'finishedBuff', unknown>();
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'combo-timer', stackingType: 'unique', durationSeconds: 1 },
      {},
      () => new EventContextConditionExecutor(terminal),
      undefined,
      [
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: { kind: 'eventSkillIdIn', skillIds: ['native-power-attack'] },
                },
                whenTrue: {
                  steps: [{ kind: 'setCurrentBuffTimePaused', parameters: { paused: true } }],
                },
              },
            ],
          },
        },
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: { kind: 'eventBuffIdMatch', buffIds: ['resume-marker'] },
                },
                whenTrue: {
                  steps: [{ kind: 'setCurrentBuffTimePaused', parameters: { paused: false } }],
                },
              },
            ],
          },
        },
      ],
      (event, priority, handle) => {
        if (event !== 'beforeCastSkill' && event !== 'finishedBuff') {
          throw new Error(`unexpected event '${event}'`);
        }
        return dispatcher.registerAction(event, priority, context => handle(context.payload));
      },
    );
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    const buff = container.add(definition, 'operator')!;

    dispatcher.dispatch(
      {
        event: 'beforeCastSkill',
        payload: {
          sourceId: 'operator',
          targetId: 'operator',
          skillType: 'finisher',
          skillId: 'native-power-attack',
          skillCastId: 1,
        },
      },
      [],
    );
    buff.tick(2);
    expect(buff.remainingDuration).toBe(1);

    dispatcher.dispatch(
      {
        event: 'finishedBuff',
        payload: {
          sourceId: 'operator',
          targetId: 'operator',
          buffId: 'resume-marker',
          reason: 'other',
        },
      },
      [],
    );
    buff.tick(1);
    expect(buff.isFinished).toBe(true);
  });

  it('把同事件同优先级响应注册为一个回调并保持各序列独立短路', () => {
    let registered = 0;
    let handleAdded: ((payload: unknown) => void) | undefined;
    let reached = 0;
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'same-priority', stackingType: 'unique' },
      {},
      () => ({
        execute: () => {
          reached += 1;
          return true;
        },
        evaluate: () => false,
      }),
      undefined,
      [
        {
          event: 'addedBuff',
          priority: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: { condition: { kind: 'casterControlled' } },
                whenTrue: {
                  steps: [
                    {
                      kind: 'setContextFlag',
                      parameters: { flag: 'first', value: true, target: 'caster' },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          event: 'addedBuff',
          priority: 0,
          sequence: {
            steps: [
              {
                kind: 'setContextFlag',
                parameters: { flag: 'second', value: true, target: 'caster' },
              },
            ],
          },
        },
      ],
      (_event, _priority, handle) => {
        registered += 1;
        handleAdded = handle;
        return { dispose: () => undefined };
      },
    );
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());

    container.add(definition, 'source');
    handleAdded?.({
      sourceId: 'source',
      targetId: 'operator',
      buffId: 'added',
      buffTagIds: [],
    });

    expect(registered).toBe(1);
    expect(reached).toBe(1);
  });

  it('executes a matching ignite response with the ignite source and then finishes the Buff', () => {
    const reached: string[] = [];
    const terminal: CombatOperationExecutor = {
      execute: (_step, context) => {
        reached.push(context?.buffSourceId ?? '<missing>');
        return true;
      },
      evaluate: condition => {
        throw new Error(`unexpected condition '${condition.kind}'`);
      },
    };
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'frozen', stackingType: 'unique' },
      {},
      () => terminal,
      undefined,
      [],
      undefined,
      [],
      [
        {
          igniteType: 'EndminUlt',
          finishAfterIgnited: true,
          sequence: {
            steps: [
              {
                kind: 'setContextFlag',
                parameters: { flag: 'reached', value: true, target: 'caster' },
              },
            ],
          },
        },
      ],
    );
    const container = new CombatBuffContainer<never>('enemy', new CombatAttributeSet<never>());
    const buff = container.add(definition, 'original-source')!;

    expect(container.ignite('PhysicalStatus', 'operator')).toBe(0);
    expect(container.ignite('EndminUlt', 'operator')).toBe(1);
    expect(reached).toEqual(['operator']);
    expect(buff.finishReason).toBe('other');
  });
});
