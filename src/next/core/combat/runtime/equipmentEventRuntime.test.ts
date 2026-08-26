import { describe, expect, it, vi } from 'vitest';
import type { CompiledEquipmentContribution } from '../../compiler/compileEquipment';
import type { CombatOperationExecutor } from './skillRuntime';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { EquipmentEventRuntime } from './equipmentEventRuntime';

const contribution: CompiledEquipmentContribution = {
  source: { kind: 'weaponTrait', slug: 'fixture-weapon', traitKey: 'skill' },
  selectedLevel: 3,
  modifiers: [],
  eventHandlers: [
    {
      key: 'gain-sp',
      event: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
      condition: { kind: 'combatActive' },
      sequence: {
        steps: [
          {
            kind: 'changeResource',
            parameters: { resource: 'sp', amount: 10, recipient: 'team' },
          },
        ],
      },
    },
  ],
};

describe('EquipmentEventRuntime', () => {
  it('keeps passive Ability children until disposal and cleans them in creation order', () => {
    const events = new CombatSemanticEventRuntime();
    const finished: number[] = [];
    let nextChild = 0;
    const runtime = new EquipmentEventRuntime(events, 'operator:a', [contribution], () => ({
      execute: (_step, context) => {
        const id = ++nextChild;
        context!.addAbilityChildBuff!({
          finish: () => {
            finished.push(id);
            return true;
          },
        });
        return true;
      },
      evaluate: () => true,
    }));
    for (let count = 0; count < 2; count += 1) {
      events.emit({ kind: 'damageTagHit', sourceOperatorId: 'operator:a', tags: ['normalSkill'] });
    }
    expect(finished).toEqual([]);
    runtime.dispose();
    expect(finished).toEqual([1, 2]);
    runtime.dispose();
    expect(finished).toEqual([1, 2]);
  });
  it('executes a matching handler once with explicit equipment source identity', () => {
    const events = new CombatSemanticEventRuntime();
    const executed: string[] = [];
    const createExecutor = vi.fn(context => {
      const executor: CombatOperationExecutor = {
        execute: step => {
          executed.push(step.kind);
          return true;
        },
        evaluate: condition => condition.kind === 'combatActive',
      };
      expect(context).toMatchObject({
        operatorId: 'operator:a',
        source: { kind: 'weaponTrait', slug: 'fixture-weapon', traitKey: 'skill' },
        handlerKey: 'gain-sp',
        event: { kind: 'damageTagHit', sourceOperatorId: 'operator:a' },
      });
      return executor;
    });
    new EquipmentEventRuntime(events, 'operator:a', [contribution], createExecutor);

    events.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalSkill'],
    });

    expect(createExecutor).toHaveBeenCalledOnce();
    expect(executed).toEqual(['changeResource']);
  });

  it('does not execute steps when the condition fails', () => {
    const events = new CombatSemanticEventRuntime();
    const execute = vi.fn(() => true);
    new EquipmentEventRuntime(events, 'operator:a', [contribution], () => ({
      execute,
      evaluate: () => false,
    }));

    events.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalSkill'],
    });
    expect(execute).not.toHaveBeenCalled();
  });

  it('stops receiving events after disposal', () => {
    const events = new CombatSemanticEventRuntime();
    const createExecutor = vi.fn<() => CombatOperationExecutor>(() => ({
      execute: () => true,
      evaluate: () => true,
    }));
    const runtime = new EquipmentEventRuntime(events, 'operator:a', [contribution], createExecutor);
    runtime.dispose();

    events.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalSkill'],
    });
    expect(createExecutor).not.toHaveBeenCalled();
  });

  it('按原生数据动作优先级降序、同级注册顺序执行', () => {
    const events = new CombatSemanticEventRuntime();
    const executed: string[] = [];
    const handlers = [
      { ...contribution.eventHandlers[0]!, key: 'same-first', priority: 2 },
      { ...contribution.eventHandlers[0]!, key: 'high', priority: 5 },
      { ...contribution.eventHandlers[0]!, key: 'same-second', priority: 2 },
    ];
    new EquipmentEventRuntime(
      events,
      'operator:a',
      [{ ...contribution, eventHandlers: handlers }],
      context => ({
        execute: () => {
          executed.push(context.handlerKey);
          return true;
        },
        evaluate: () => true,
      }),
    );

    events.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalSkill'],
    });
    expect(executed).toEqual(['high', 'same-first', 'same-second']);
  });

  it('通过独立端口注册原生 AbilitySystem 事件并归一化负载', () => {
    const events = new CombatSemanticEventRuntime();
    let registered: ((payload: unknown) => void) | undefined;
    const execute = vi.fn(() => true);
    const createExecutor = vi.fn(
      () =>
        ({
          execute,
          evaluate: () => true,
        }) satisfies CombatOperationExecutor,
    );
    new EquipmentEventRuntime(
      events,
      'operator:a',
      [
        {
          ...contribution,
          eventHandlers: [
            {
              ...contribution.eventHandlers[0]!,
              event: undefined,
              abilityEvent: 'beforeCastSkill',
              priority: 3,
            },
          ],
        },
      ],
      createExecutor,
      (operatorId, event, priority, handle) => {
        expect({ operatorId, event, priority }).toEqual({
          operatorId: 'operator:a',
          event: 'beforeCastSkill',
          priority: 3,
        });
        registered = handle;
        return { dispose: vi.fn() };
      },
    );

    registered?.({
      sourceId: 'operator:a',
      targetId: 'enemy',
      skillType: 'battleSkill',
      skillId: 'skill:a',
      skillCastId: 7,
    });
    expect(createExecutor).toHaveBeenCalledWith(
      expect.objectContaining({
        event: expect.objectContaining({
          kind: 'abilitySkill',
          event: 'beforeCastSkill',
          skillCastId: 7,
        }),
      }),
    );
    expect(execute).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        eventSkillCastInfo: expect.objectContaining({
          skillCastId: 7,
          originSkillId: 'skill:a',
          originSkillType: 'battleSkill',
        }),
      }),
    );
  });
});
