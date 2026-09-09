import { withAbilityEventResponseContext } from './abilityEventResponseContext';
import type { AbilityEventPayloadMap } from '../events/combatAbilityEvent';
import { describe, expect, it } from 'vitest';
import { createKillEvent } from '../events/killEventTestFixture';
import type { ResolvedSkillBuffLifecycleSequences } from '../../compiler/combatProgram';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer, type CombatBuffDefinition } from '../buffs/combatBuffs';
import { readSkillCastInfoFromPayload } from './abilityEventPayload';
import { attachBuffLifecycleSequences } from './buffLifecycleSequenceRuntime';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import { ActionBlackboard } from './actionBlackboard';
import { AbilityEventDispatcher } from '../events/abilityEventDispatcher';
import { EventContextConditionExecutor } from './eventContextConditionExecutor';
import { BuffOperationExecutor } from './buffOperationExecutor';

describe('attachBuffLifecycleSequences', () => {
  it.each([false, true])(
    '倒地兼容响应复用目标/来源作用域，不给手工标记补原生信息：native=%s',
    native => {
      const container = new CombatBuffContainer<never>('owner', new CombatAttributeSet<never>());
      let receive!: Parameters<
        import('./buffLifecycleSequenceRuntime').RegisterBuffSemanticEventAction
      >[2];
      let disposed = false;
      const contexts: import('./skillRuntime').CombatOperationContext[] = [];
      const snapshots: unknown[] = [];
      const definition = attachBuffLifecycleSequences<never>(
        { id: 'knock-response', stackingType: 'unique' },
        {},
        () => ({
          execute: (_step, context) => {
            contexts.push(context!);
            snapshots.push({
              event: context?.event,
              source: context?.eventSkillCastInfo,
              owner: context?.actionOwnerId,
              actionSource: context?.actionSourceId,
              input: context?.actionInputTarget,
              trigger: context?.targetContext?.getOptional('trigger'),
            });
            return true;
          },
          evaluate: () => true,
        }),
        undefined,
        [
          {
            event: 'outputKnockDown',
            priority: 0,
            sequence: {
              steps: [
                {
                  kind: 'setContextFlag',
                  parameters: { flag: 'seen', value: true, target: 'caster' },
                },
              ],
            },
          },
        ],
        undefined,
        [],
        [],
        [],
        (_event, _priority, handle) => {
          receive = handle;
          return {
            dispose: () => {
              disposed = true;
            },
          };
        },
      );
      const buff = container.add(definition, 'buff-source')!;
      const published = native
        ? {
            event: 'afterOutputKnockDown' as const,
            payload: {
              sourceId: 'owner',
              targetId: 'enemy',
              fromAirborne: true,
              skillCastInfo: null,
            },
          }
        : { kind: 'knockDownOutput' as const, sourceOperatorId: 'owner', targetId: 'enemy' };
      const targets = {
        inputTarget: { kind: 'enemy' as const },
        triggerTarget: { kind: 'operator' as const, operatorId: 'owner' },
      };
      receive(published, native ? targets : undefined);
      expect(snapshots).toEqual([
        {
          event: published,
          source: native ? null : undefined,
          owner: 'owner',
          actionSource: 'buff-source',
          input: native ? targets.inputTarget : undefined,
          trigger: native ? [targets.triggerTarget] : undefined,
        },
      ]);
      expect(contexts[0]?.event).toBeUndefined();
      expect(contexts[0]?.targetContext?.getOptional('trigger')).toBeUndefined();
      buff.finish('other');
      expect(disposed).toBe(true);
    },
  );

  it.each(
    [undefined, 42].flatMap(processing =>
      [false, true].map(hasSource => ({ processing, hasSource })),
    ),
  )(
    'SkillAffix独立编号 processing=$processing hasSource=$hasSource',
    ({ processing, hasSource }) => {
      const container = new CombatBuffContainer<never>('owner', new CombatAttributeSet<never>());
      const callbacks = new Set<
        Parameters<import('./buffLifecycleSequenceRuntime').RegisterBuffAbilityEventAction>[2]
      >();
      const definition = attachBuffLifecycleSequences<never>(
        { id: 'affix', stackingType: 'unique' },
        { enable: { steps: [{ kind: 'skillAffix', parameters: {} }] } },
        () =>
          new BuffOperationExecutor({
            sourceId: 'source',
            resolveTarget: () => container,
            readProcessingSkillCastId: owner => {
              expect(owner).toBe('owner');
              return processing;
            },
            delegate: { execute: () => false, evaluate: () => false },
          }),
        undefined,
        [],
        (event, _priority, callback) => {
          expect(event).toBe('skillEnd');
          callbacks.add(callback);
          return {
            dispose: () => {
              callbacks.delete(callback);
            },
          };
        },
      );
      const ordinary = {
        skillCastId: 999,
        originSkillId: 'original',
        originSkillType: 'battleSkill' as const,
        nonReturnedSpCost: 0,
      };
      const buff = container.add(
        definition,
        'source',
        hasSource ? { skillCastInfo: ordinary } : undefined,
      )!;
      expect(buff.affixSkillCastId).toBe(processing ?? 0);
      expect(buff.skillCastInfo).toEqual(hasSource ? ordinary : null);
      expect(callbacks.size).toBe(processing === undefined ? 0 : 1);
      const emit = (sourceId: string, skillCastId: number) => {
        for (const callback of [...callbacks])
          callback({
            event: 'skillEnd',
            payload: {
              sourceId,
              targetId: sourceId,
              skillId: 'skill',
              skillType: 'battleSkill',
              skillCastId,
            },
          });
      };
      emit('other', 42);
      emit('owner', 999);
      expect(buff.isFinished).toBe(false);
      emit('owner', 42);
      expect(buff.isFinished).toBe(processing !== undefined);
      buff.finish('other');
      expect(callbacks.size).toBe(0);
      expect(buff.affixSkillCastId).toBe(processing ?? 0);
    },
  );

  it('前序动作失败不提前执行SkillAffix或注册监听', () => {
    const container = new CombatBuffContainer<never>('owner', new CombatAttributeSet<never>());
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'blocked-affix', stackingType: 'unique' },
      {
        enable: {
          steps: [
            {
              kind: 'setContextFlag',
              parameters: { flag: 'failure', value: true, target: 'caster' },
            },
            { kind: 'skillAffix', parameters: {} },
          ],
        },
      },
      () =>
        new BuffOperationExecutor({
          sourceId: 'owner',
          resolveTarget: () => container,
          readProcessingSkillCastId: () => {
            throw new Error('must not read');
          },
          delegate: { execute: () => false, evaluate: () => false },
        }),
    );
    expect(container.add(definition, 'owner')!.affixSkillCastId).toBe(0);
  });

  it('limited counts in Buff events retain Buff provenance, not event or candidate affix identity', () => {
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    const cast = (id: number) => ({
      skillCastId: id,
      originSkillId: 'skill',
      originSkillType: 'battleSkill' as const,
      nonReturnedSpCost: 0,
    });
    const seal = { id: 'seal', stackingType: 'unlimited' as const };
    const matching = container.add(seal, 'operator', { skillCastInfo: cast(42) })!;
    matching.recordBuffAffixSkillCastId(99);
    container.add(seal, 'operator', { skillCastInfo: cast(99) })!.recordBuffAffixSkillCastId(42);
    container.add(seal, 'operator', { skillCastInfo: cast(42) })!.finish('other');
    let handle:
      | Parameters<import('./buffLifecycleSequenceRuntime').RegisterBuffAbilityEventAction>[2]
      | undefined;
    let reached = 0;
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'listener', stackingType: 'unique' },
      {},
      () =>
        new BuffOperationExecutor({
          sourceId: 'operator',
          resolveTarget: () => container,
          resolveEventTarget: () => container,
          delegate: {
            execute: () => {
              reached++;
              return true;
            },
            evaluate: () => false,
          },
        }),
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
                  condition: {
                    kind: 'buffIdStackCompare',
                    target: 'buffOwner',
                    buffIds: ['seal'],
                    sameSourceSkillCast: true,
                    operator: 'equal',
                    value: { kind: 'constant', value: 1 },
                  },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'setContextFlag',
                      parameters: {
                        flag: 'matched',
                        value: true,
                        target: 'caster',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      (_event, _priority, callback) => {
        handle = callback;
        return { dispose: () => undefined };
      },
    );
    container.add(definition, 'operator', { skillCastInfo: cast(42) });
    const event = {
      sourceId: 'operator',
      targetId: 'operator',
      skillType: 'battleSkill' as const,
      skillId: 'later-skill',
      skillCastId: 99,
    };
    handle!({ event: 'beforeCastSkill', payload: event });
    expect(reached).toBe(1);
    matching.finish('other');
    handle!({ event: 'beforeCastSkill', payload: event });
    expect(reached).toBe(1);
  });

  it('自定义事件保留原始对象，不虚构施法来源', () => {
    const published = {
      event: 'customAbilityEvent' as const,
      payload: {
        sourceId: 'liino',
        targetId: 'liino',
        eventName: 'liino_comboskill_end',
        eventParam: 0,
      },
    };
    const context: CombatOperationContext = { blackboard: new ActionBlackboard() };
    withAbilityEventResponseContext(context, published, undefined, () => {
      expect(context.event).toBe(published);
      expect(context.eventSkillCastInfo).toBeUndefined();
    });
  });

  it('护盾事件保留原始对象和独立数值', () => {
    const published = {
      event: 'afterAddedShield' as const,
      payload: {
        sourceId: 'operator',
        targetId: 'operator',
        gainedValue: 120,
        currentValue: 350,
      },
    };
    const context: CombatOperationContext = { blackboard: new ActionBlackboard() };
    withAbilityEventResponseContext(context, published, undefined, () => {
      expect(context.event).toBe(published);
      expect(context.eventSkillCastInfo).toBeUndefined();
    });
  });

  it('区分空来源与遗漏来源，接受处决类型且不从其他字段覆盖显式空来源', () => {
    const cast = { skillCastId: 3, skillId: 'finisher', skillType: 'finisher' };
    expect(readSkillCastInfoFromPayload(cast)).toBeUndefined();
    const explicit = {
      skillCastId: 3,
      originSkillId: 'finisher',
      originSkillType: 'finisher',
      nonReturnedSpCost: 0,
    };
    expect(readSkillCastInfoFromPayload({ ...cast, skillCastInfo: explicit })).toBe(explicit);
    expect(readSkillCastInfoFromPayload({ ...cast, skillCastInfo: null })).toBeNull();
    expect(readSkillCastInfoFromPayload({})).toBeUndefined();
    expect(() => readSkillCastInfoFromPayload({ event: 'skillEnd', payload: cast })).toThrow(
      'Expected ability event payload',
    );
    expect(() =>
      readSkillCastInfoFromPayload({ skillCastInfo: { originSkillType: 'unknown' } }),
    ).toThrow('invalid skill cast identity');
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
        reached.push(context!.event!.kind ?? 'native');
        return true;
      },
      evaluate: condition => {
        throw new Error(`unexpected terminal condition '${condition.kind}'`);
      },
    };
    const dispatcher = new AbilityEventDispatcher<'beforeTakeDamage', AbilityEventPayloadMap>();
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
        return dispatcher.registerAction(event, priority, context => handle(context));
      },
    );
    const container = new CombatBuffContainer<never>('enemy', new CombatAttributeSet<never>());
    const buff = container.add(definition, 'seal')!;
    const dispatch = (
      tags: readonly import('../../game-data/operatorDefinition').DamageTag[],
      sourceId = 'seal',
    ) =>
      dispatcher.dispatch(
        {
          event: 'beforeTakeDamage',
          payload: {
            ...createKillEvent(sourceId).payload,
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

    expect(reached).toEqual(['native', 'native']);
  });

  it('把失衡归零事件保留为带来源身份的 Ability 事件', () => {
    const reached: string[] = [];
    const terminal: CombatOperationExecutor = {
      execute: (_step, context) => {
        reached.push(context!.event!.kind ?? 'native');
        return true;
      },
      evaluate: condition => {
        throw new Error(`unexpected terminal condition '${condition.kind}'`);
      },
    };
    const dispatcher = new AbilityEventDispatcher<'poiseZero', AbilityEventPayloadMap>();
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
        return dispatcher.registerAction(event, priority, context => handle(context));
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
        },
      },
      [],
    );

    expect(reached).toEqual(['native']);
  });

  it('只在 Buff 启用期间订阅原生击杀事件', () => {
    const reached: string[] = [];
    const received: unknown[] = [];
    let handler:
      ((event: import('../events/combatAbilityEvent').NativeKillEvent) => void) | undefined;
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'kill-listener', stackingType: 'unique' },
      {},
      () => ({
        execute: (_step, context) => {
          const event = context!.event!;
          received.push(event);
          reached.push('payload' in event ? event.event : event.kind);
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
      (_event, _priority, callback) => {
        handler = callback;
        return { dispose: () => (handler = undefined) };
      },
    );
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    const buff = container.add(definition, 'operator')!;
    const event = createKillEvent();

    handler!(event);
    buff.disable();
    expect(handler).toBeUndefined();
    buff.enable();
    handler!(event);
    buff.finish();
    expect(handler).toBeUndefined();
    expect(reached).toEqual(['afterKillEntity', 'afterKillEntity']);
    expect(received).toHaveLength(2);
    expect(received[0]).toBe(event);
    expect(received[1]).toBe(event);
  });

  it.each([
    ['skill', 'gain'],
    ['normalAttack', 'gain'],
    ['skill', 'refund'],
  ] as const)('Buff OnObtainAtb 不提前过滤 %s/%s', (source, gainKind) => {
    const reached: string[] = [];
    let handler:
      ((event: import('../events/combatAbilityEvent').SpGainAbilityEvent) => void) | undefined;
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'skill-sp-listener', stackingType: 'unique' },
      {},
      () => ({
        execute: (_step, context) => {
          reached.push(context!.event!.kind ?? 'native');
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
      (_event, _priority, callback) => {
        handler = callback;
        return { dispose: () => (handler = undefined) };
      },
    );
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    container.add(definition, 'operator')!;

    handler!({
      event: 'skillSpGained',
      payload: {
        sourceOperatorId: 'operator',
        source,
        gainKind,
        requestedAmount: 20,
        amount: 0,
      },
    });
    expect(reached).toEqual(['native']);
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
    const dispatcher = new AbilityEventDispatcher<'beforeTakeDamage', AbilityEventPayloadMap>();
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
        return dispatcher.registerAction(event, priority, context => handle(context));
      },
    );
    const container = new CombatBuffContainer<never>('enemy', new CombatAttributeSet<never>());
    const buff = container.add(definition, 'seal')!;
    const dispatch = () =>
      dispatcher.dispatch(
        {
          event: 'beforeTakeDamage',
          payload: {
            ...createKillEvent('seal').payload,
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
    const dispatcher = new AbilityEventDispatcher<
      'beforeCastSkill' | 'finishedBuff',
      AbilityEventPayloadMap
    >();
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
        return dispatcher.registerAction(event, priority, context => handle(context));
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
          buffTags: [],
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
    let handleAdded:
      | Parameters<import('./buffLifecycleSequenceRuntime').RegisterBuffAbilityEventAction>[2]
      | undefined;
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
      event: 'addedBuff',
      payload: {
        sourceId: 'source',
        targetId: 'operator',
        buffId: 'added',
        buffTags: [],
      },
    });

    expect(registered).toBe(1);
    expect(reached).toBe(1);
  });

  it('叠层回调使用本次来源，满层仍回调，且不重置实例 once 状态', () => {
    const reached: unknown[] = [];
    const callback = {
      steps: [
        {
          kind: 'setContextFlag' as const,
          parameters: { flag: 'callback', value: true, target: 'caster' as const },
        },
      ],
    };
    const definition = attachBuffLifecycleSequences<never>(
      { id: 'layer', stackingType: 'enhanceAndRefresh', maxStackCount: 2 },
      {
        afterEnhance: {
          steps: [
            ...callback.steps,
            { kind: 'once', parameters: { scopeKey: 'per-buff' }, body: callback },
          ],
        },
      },
      (buff, sourceId = buff.sourceId) => ({
        execute: (_step, context) => {
          reached.push([
            sourceId,
            context?.actionSourceId,
            buff.enhanceCount,
            context?.buffSourceId,
          ]);
          return true;
        },
        evaluate: () => true,
      }),
    );
    const container = new CombatBuffContainer<never>('enemy', new CombatAttributeSet<never>());
    const buff = container.add(definition, 'creator')!;
    expect(reached).toEqual([]);
    container.add(definition, 'teammate-a');
    container.add(definition, 'teammate-b');
    expect(reached).toEqual([
      ['teammate-a', 'teammate-a', 2, 'creator'],
      ['teammate-a', 'teammate-a', 2, 'creator'],
      ['teammate-b', 'teammate-b', 2, 'creator'],
    ]);
    expect(buff.sourceId).toBe('creator');
  });

  it('executes a matching ignite response with the ignite source and then finishes the Buff', () => {
    const reached: string[] = [];
    const cast = {
      skillCastId: 52,
      originSkillId: 'ignite-skill',
      originSkillType: 'battleSkill' as const,
      nonReturnedSpCost: 0,
    };
    const terminal: CombatOperationExecutor = {
      execute: (_step, context) => {
        reached.push(context?.buffSourceId ?? '<missing>');
        expect(context?.skillCastInfo).toEqual(cast);
        expect(context?.actionSourceId).toBe('operator');
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
        {
          igniteType: 'EndminUlt',
          finishAfterIgnited: false,
          sequence: {
            steps: [
              {
                kind: 'setContextFlag',
                parameters: { flag: 'must-not-run', value: true, target: 'caster' },
              },
            ],
          },
        },
      ],
    );
    const container = new CombatBuffContainer<never>('enemy', new CombatAttributeSet<never>());
    const originalCast = { ...cast, skillCastId: 12, originSkillId: 'original-skill' };
    const buff = container.add(definition, 'original-source', { skillCastInfo: originalCast })!;

    expect(container.ignite('PhysicalStatus', 'operator')).toBe(0);
    expect(container.ignite('EndminUlt', 'operator', cast)).toBe(1);
    expect(reached).toEqual(['operator']);
    expect(buff.finishReason).toBe('ignite');
    expect(buff.skillCastInfo).toEqual(originalCast);
    expect(buff.sourceId).toBe('original-source');
  });
});

it('物理后置 Buff 监听使用原始注册口并随启停注销，保留挂载端口', () => {
  const dispatcher = new AbilityEventDispatcher<
    'afterOutputPhysicalInfliction',
    import('../events/combatAbilityEvent').AbilityEventPayloadMap
  >();
  const received: unknown[] = [];
  const definition = attachBuffLifecycleSequences<never>(
    { id: 'physical-listener', stackingType: 'unique' },
    {},
    () => ({
      execute: (_step, context) => {
        received.push(context!.event);
        return true;
      },
      evaluate: () => true,
    }),
    undefined,
    [
      {
        event: 'afterOutputPhysicalInfliction',
        priority: 3,
        sequence: {
          steps: [
            { kind: 'setContextFlag', parameters: { flag: 'seen', value: true, target: 'caster' } },
          ],
        },
      },
    ],
    (event, priority, handle) => {
      if (event !== 'afterOutputPhysicalInfliction') throw new Error('unexpected event');
      return dispatcher.registerAction(event, priority, published => handle(published));
    },
  );
  const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
  const buff = container.add(definition, 'operator')!;
  const published = {
    event: 'afterOutputPhysicalInfliction' as const,
    payload: {
      sourceId: 'operator',
      targetId: 'enemy',
      type: 'fracture' as const,
      skillCastInfo: null,
      attachBuffToCurrentSkill: () => {},
    },
  };
  dispatcher.dispatch(published, []);
  buff.disable();
  dispatcher.dispatch(published, []);
  buff.enable();
  dispatcher.dispatch(published, []);
  buff.finish();
  dispatcher.dispatch(published, []);
  expect(received).toHaveLength(2);
  expect(received[0]).toBe(published);
  expect(received[1]).toBe(published);
});
