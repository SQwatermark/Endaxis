import { describe, expect, it, vi } from 'vitest';
import { perlica } from '../../../data/operators/perlica';
import type { SkillDefinition } from '../../game-data/operatorDefinition';
import { compileSkill } from '../../compiler/compileSkill';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { CombatResources } from './combatResources';
import { CombatSimulation } from './combatSimulation';
import { SkillRuntime, type CombatOperationExecutor } from './skillRuntime';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';

function findPerlicaSkill(key: string): SkillDefinition {
  for (const group of perlica.skillGroups) {
    const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
    const skill = skills.find(candidate => candidate.key === key);
    if (skill !== undefined) return skill;
  }
  throw new Error(`missing Perlica skill '${key}'`);
}

function createBattleSkillRuntime(
  initialSp: number,
  costFrame?: number,
  cooldownFrames?: number,
  skillDefinition: SkillDefinition = findPerlicaSkill('battleSkill'),
) {
  const clock = new CombatClock();
  const resources = new CombatResources({
    sp: initialSp,
    maxSp: 300,
    returnedSp: 0,
    sharedSpGain: { baseGainEfficiency: 1 },
    spRecovery: { valuePerSecond: 10, pauseDuration: 1, pauseRemaining: 0 },
    ultimateEnergySystemUnlocked: true,
    normalSkillUltimateEnergy: { selfGainPerSp: 0.1, otherGainPerSp: 0.2 },
    squad: [
      {
        operatorId: 'perlica',
        ultimateEnergy: 0,
        maxUltimateEnergy: 100,
        ultimateEnergyGainMultiplier: 1,
        allowedUltimateEnergyRecoveryTagIds: null,
      },
    ],
  });
  const receipt = new CombatReceiptCollector();
  const semanticEvents = new CombatSemanticEventRuntime();
  const operations: CombatOperationExecutor = {
    execute: vi.fn(() => true),
    evaluate: vi.fn(() => true),
  };
  const compiledProgram = compileSkill({
    operatorId: 'perlica',
    skillGroupKey: 'battleSkill',
    skillType: 'battleSkill',
    skillLevel: 12,
    skill:
      costFrame === undefined && cooldownFrames === undefined
        ? skillDefinition
        : {
            ...skillDefinition,
            ...(costFrame === undefined ? {} : { costFrame }),
            ...(cooldownFrames === undefined ? {} : { cooldownFrames }),
          },
  });
  let nextSkillCastId = 1;
  const runtime = new SkillRuntime(compiledProgram, {
    clock,
    resources,
    receipt,
    operations,
    allocateSkillCastId: () => nextSkillCastId++,
    semanticEvents,
  });
  const simulation = new CombatSimulation(clock);
  simulation.add(runtime);
  return { clock, resources, receipt, operations, runtime, semanticEvents, simulation };
}

describe('SkillRuntime', () => {
  it('exposes the native rounded local execute frame to timeline actions', () => {
    const fixture = createBattleSkillRuntime(300, undefined, undefined, {
      key: 'local-frame-fixture',
      timelineBlockFrames: 10,
      scheduledSequences: [
        {
          startFrame: 0,
          endFrame: 10,
          sequence: { steps: [{ kind: 'repeatEachTick', parameters: {}, body: { steps: [] } }] },
        },
      ],
    });

    fixture.runtime.tryStart();
    fixture.runtime.advance(1 / 60, 0);
    expect(fixture.runtime.operationContext.getCurrentTimelineFrame?.()).toBe(0);

    fixture.runtime.advance(1 / 30, 0);
    expect(fixture.runtime.passedFrames).toBe(1.5);
    expect(fixture.runtime.operationContext.getCurrentTimelineFrame?.()).toBe(2);
  });

  it('时间轴跳转改写本次释放的局部帧并跳过中间调度项', () => {
    const fixture = createBattleSkillRuntime(300, undefined, undefined, {
      key: 'timeline-jump-fixture',
      timelineBlockFrames: 6,
      scheduledSequences: [
        {
          startFrame: 1,
          endFrame: 2,
          sequence: {
            steps: [{ kind: 'jumpTimeline', parameters: { destinationFrame: 5 } }],
          },
        },
        {
          startFrame: 3,
          sequence: {
            steps: [
              {
                kind: 'setContextFlag',
                parameters: { flag: 'skipped', value: true, target: 'caster' },
              },
            ],
          },
        },
        {
          startFrame: 5,
          sequence: {
            steps: [
              {
                kind: 'setContextFlag',
                parameters: { flag: 'destination', value: true, target: 'caster' },
              },
            ],
          },
        },
      ],
    });

    fixture.runtime.tryStart();
    fixture.simulation.advanceFrames(1);

    expect(fixture.runtime.passedFrames).toBe(5);
    expect(fixture.operations.execute).not.toHaveBeenCalled();
    expect(fixture.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'SkillTimelineJumped',
        data: expect.objectContaining({ destinationFrame: 5 }),
      }),
    );

    fixture.simulation.advanceFrames(1);

    expect(fixture.operations.execute).toHaveBeenCalledTimes(1);
    expect(fixture.operations.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'setContextFlag',
        parameters: expect.objectContaining({ flag: 'destination' }),
      }),
      expect.anything(),
    );
  });

  it('只在调度区间内响应技能临时监听事件，并在中断时立即注销', () => {
    const fixture = createBattleSkillRuntime(300, undefined, undefined, {
      key: 'listener-fixture',
      timelineBlockFrames: 4,
      scheduledSequences: [
        {
          startFrame: 1,
          endFrame: 4,
          sequence: {
            steps: [
              {
                kind: 'listenForCombatEvents',
                parameters: {
                  responses: [
                    {
                      key: 'normal-skill-hit',
                      event: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
                      condition: { kind: 'combatActive' },
                      sequence: {
                        steps: [
                          {
                            kind: 'setContextFlag',
                            parameters: { flag: 'first', value: true, target: 'caster' },
                          },
                          {
                            kind: 'setContextFlag',
                            parameters: { flag: 'second', value: true, target: 'caster' },
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
    });
    const emit = () =>
      fixture.semanticEvents.emit({
        kind: 'damageTagHit',
        sourceOperatorId: 'perlica',
        tags: ['normalSkill'],
      });

    fixture.runtime.tryStart();
    emit();
    expect(fixture.operations.execute).not.toHaveBeenCalled();

    fixture.simulation.advanceFrames(1);
    emit();
    expect(fixture.operations.evaluate).toHaveBeenCalledWith(
      { kind: 'combatActive' },
      expect.objectContaining({
        blackboard: fixture.runtime.operationContext.blackboard,
        event: {
          kind: 'damageTagHit',
          sourceOperatorId: 'perlica',
          tags: ['normalSkill'],
        },
      }),
    );
    expect(vi.mocked(fixture.operations.execute).mock.calls.map(call => call[0])).toMatchObject([
      { kind: 'setContextFlag', parameters: { flag: 'first' } },
      { kind: 'setContextFlag', parameters: { flag: 'second' } },
    ]);

    fixture.runtime.interrupt('castNextSkill');
    emit();
    expect(fixture.operations.execute).toHaveBeenCalledTimes(2);
  });

  it('allows a synchronous skill event response to jump the hosting timeline', () => {
    const fixture = createBattleSkillRuntime(300, undefined, undefined, {
      key: 'listener-jump-fixture',
      timelineBlockFrames: 8,
      scheduledSequences: [
        {
          startFrame: 1,
          endFrame: 8,
          sequence: {
            steps: [
              {
                kind: 'listenForCombatEvents',
                parameters: {
                  responses: [
                    {
                      key: 'jump-on-buff',
                      event: { kind: 'buffApplied' },
                      sequence: {
                        steps: [{ kind: 'jumpTimeline', parameters: { destinationFrame: 6 } }],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });

    fixture.runtime.tryStart();
    fixture.simulation.advanceFrames(1);
    fixture.semanticEvents.emit({
      kind: 'buffApplied',
      targetId: 'perlica',
      sourceId: 'enemy',
      buffId: 'buff.enemy.catch',
      buffTagIds: [],
    });

    expect(fixture.runtime.passedFrames).toBe(6);
    expect(fixture.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'SkillTimelineJumped',
        data: expect.objectContaining({ destinationFrame: 6 }),
      }),
    );
  });

  it('同一次释放只执行一次共享作用域，并在下一次释放时重置', () => {
    const onceStep = {
      kind: 'once',
      parameters: { scopeKey: 'normal-attack-sp' },
      body: {
        steps: [
          {
            kind: 'setContextFlag',
            parameters: { flag: 'executed', value: true, target: 'caster' },
          },
        ],
      },
    } as const;
    const fixture = createBattleSkillRuntime(300, undefined, undefined, {
      key: 'once-fixture',
      timelineBlockFrames: 2,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              onceStep,
              {
                kind: 'setContextFlag',
                parameters: { flag: 'continued', value: true, target: 'caster' },
              },
            ],
          },
        },
        { startFrame: 1, sequence: { steps: [onceStep] } },
      ],
    });
    vi.mocked(fixture.operations.execute).mockReturnValueOnce(false);

    fixture.runtime.tryStart();
    fixture.simulation.advanceFrames(1);
    expect(fixture.operations.execute).toHaveBeenCalledTimes(2);

    fixture.runtime.end();
    fixture.runtime.tryStart();
    expect(fixture.operations.execute).toHaveBeenCalledTimes(4);
  });

  it('为每个运行实例隔离动作黑板并在再次释放时重置', () => {
    const first = createBattleSkillRuntime(300);
    const second = createBattleSkillRuntime(300);

    first.runtime.operationContext.blackboard.assignDynamic('count', 2);
    expect(second.runtime.operationContext.blackboard.getNumber('count')).toBeUndefined();

    first.runtime.tryStart();
    expect(first.runtime.skillCastInfo).toEqual({
      skillCastId: 1,
      originSkillId: 'battleSkill',
      nonReturnedSpCost: 100,
    });
    first.runtime.operationContext.blackboard.assignDynamic('count', 3);
    first.runtime.end();
    first.runtime.tryStart();

    expect(first.runtime.operationContext.blackboard.getNumber('count')).toBeUndefined();
    expect(first.runtime.skillCastInfo.skillCastId).toBe(2);
  });

  it('applies frame-zero cost during the native initial tick', () => {
    const fixture = createBattleSkillRuntime(300);

    expect(fixture.runtime.tryStart()).toBe(true);
    expect(fixture.runtime.skillCastInfo.nonReturnedSpCost).toBe(100);

    expect(fixture.runtime.appliedCost).toBe(true);
    expect(fixture.resources.sp).toBe(200);
    expect(fixture.receipt.entries.map(entry => entry.event)).toEqual([
      'SkillStarted',
      'SpChanged',
      'SkillCostApplied',
    ]);
  });

  it('updates the current skill-cast info only when delayed cost is actually paid', () => {
    const fixture = createBattleSkillRuntime(300, 3);

    fixture.runtime.tryStart();
    expect(fixture.runtime.skillCastInfo.nonReturnedSpCost).toBe(0);
    expect(fixture.resources.sp).toBe(300);

    fixture.simulation.advanceFrames(3);
    expect(fixture.runtime.skillCastInfo.nonReturnedSpCost).toBe(100);
    expect(fixture.resources.sp).toBe(200);
  });

  it('executes Perlica hit steps in source order at relative frame 13', () => {
    const fixture = createBattleSkillRuntime(300);
    fixture.runtime.tryStart();

    fixture.simulation.advanceFrames(13);

    expect(fixture.operations.execute).toHaveBeenCalledTimes(3);
    expect(vi.mocked(fixture.operations.execute).mock.calls.map(([step]) => step.kind)).toEqual([
      'applyElementalInfliction',
      'dealDamage',
      'gainSquadUltimateEnergyFromSkillCost',
    ]);
    expect(
      fixture.receipt.entries
        .filter(entry => entry.event === 'CombatStepReached')
        .map(entry => entry.data?.kind),
    ).toEqual(['applyElementalInfliction', 'dealDamage', 'gainSquadUltimateEnergyFromSkillCost']);
    // 时间轴动作全部执行后技能在同一帧自然结束。
    expect(fixture.receipt.entries.at(-1)).toMatchObject({
      frame: 13,
      time: 13 / 30,
      event: 'SkillEnded',
    });
  });

  it('reports insufficient SP without preventing the scheduled skill simulation', () => {
    const fixture = createBattleSkillRuntime(99);

    expect(fixture.runtime.tryStart()).toBe(true);

    expect(fixture.runtime.state).toBe('casting');
    expect(fixture.resources.sp).toBe(99);
    expect(fixture.receipt.entries.map(entry => entry.event)).toEqual([
      'SkillCostUnavailableAtStart',
      'SkillStarted',
      'SkillCostRejected',
    ]);

    fixture.simulation.advanceFrames(13);
    expect(fixture.operations.execute).toHaveBeenCalledTimes(3);
    expect(
      fixture.receipt.entries.filter(entry => entry.event === 'SkillCostRejected'),
    ).toHaveLength(1);
  });

  it('continues the native timeline when shared resource is unavailable at the cost point', () => {
    const program = compileSkill({
      operatorId: 'perlica',
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 12,
      skill: { ...findPerlicaSkill('battleSkill'), costFrame: 3 },
    });
    const clock = new CombatClock();
    const resources = new CombatResources({
      sp: 100,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 10, pauseDuration: 1, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.1, otherGainPerSp: 0.2 },
      squad: [],
    });
    const receipt = new CombatReceiptCollector();
    const operations: CombatOperationExecutor = {
      execute: vi.fn(() => true),
      evaluate: vi.fn(() => true),
    };
    const runtime = new SkillRuntime(program, {
      clock,
      resources,
      receipt,
      operations,
      allocateSkillCastId: () => 1,
    });
    const simulation = new CombatSimulation(clock);
    simulation.add(runtime);
    expect(runtime.tryStart()).toBe(true);
    expect(resources.pay('other', [{ resource: 'sp', value: 100 }]).paid).toBe(true);

    simulation.advanceFrames(13);

    expect(runtime.appliedCost).toBe(false);
    // 扣费失败不阻止时间轴动作，动作执行完毕后技能自然结束。
    expect(runtime.state).toBe('ended');
    expect(operations.execute).toHaveBeenCalledTimes(3);
    expect(receipt.entries.some(entry => entry.event === 'SkillCostRejected')).toBe(true);
    expect(receipt.entries.at(-1)?.event).toBe('SkillEnded');
  });

  it('refunds a reserved cooldown when interrupted before the recovered commit frame', () => {
    const fixture = createBattleSkillRuntime(300, 3, 10);

    fixture.runtime.tryStart();
    fixture.simulation.advanceFrames(2);
    fixture.runtime.interrupt('castNextSkill');

    expect(fixture.runtime.cooldown.ready).toBe(true);
    expect(fixture.receipt.entries.map(entry => entry.event)).toContain('SkillCooldownRefunded');
  });

  it('records an unavailable cooldown but still simulates the authored cast', () => {
    const fixture = createBattleSkillRuntime(300, 3, 10);

    fixture.runtime.tryStart();
    fixture.simulation.advanceFrames(3);
    fixture.runtime.interrupt('castNextSkill');
    expect(fixture.runtime.cooldown.remainingFrames).toBe(7);

    expect(fixture.runtime.tryStart()).toBe(true);
    expect(fixture.runtime.state).toBe('casting');
    expect(fixture.runtime.cooldown.remainingFrames).toBe(7);
    expect(fixture.receipt.entries.map(entry => entry.event)).toContain(
      'SkillCooldownUnavailableAtStart',
    );

    fixture.simulation.advanceFrames(7);
    expect(fixture.runtime.cooldown.ready).toBe(true);
    expect(fixture.receipt.entries.map(entry => entry.event)).toContain('SkillCooldownReady');
  });
});
