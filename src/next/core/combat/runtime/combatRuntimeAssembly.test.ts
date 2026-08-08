import { describe, expect, it, vi } from 'vitest';
import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer } from '../buffs/combatBuffs';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { GameplayTagRegistry, gameplayTagIdFromPath } from '../tags/gameplayTags';
import { CombatStatusContainer } from '../status/combatStatuses';
import { CombatRuntimeAssembly } from './combatRuntimeAssembly';
import { CombatVitals } from './combatVitals';
import type { CombatOperationExecutor } from './skillRuntime';

const emptyEnemyBuffs = {
  ownerId: 'enemy',
  getCountByIds: () => 0,
  finishByIds: () => 0,
  holdByIds: () => ({ release: () => undefined }),
  getCountByTags: () => 0,
  matchesEntityTags: () => false,
  findFirstByIds: () => undefined,
  findFirstByTags: () => undefined,
  finishByTags: () => 0,
};

const rejectingExecutor: CombatOperationExecutor = {
  execute: () => false,
  evaluate: () => false,
};

function asBuffRuntime(container: CombatBuffContainer<string>) {
  return {
    ownerId: container.ownerId,
    entityBlackboard: container.entityBlackboard,
    advanceFrame: () => undefined,
    getCountByIds: (ids: readonly string[]) => container.getCountByIds(ids),
    findFirstByIds: (ids: readonly string[]) => container.findFirstByIds(ids),
    finishByIds: (ids: readonly string[], reason: 'early' | 'absorbed' | 'other') =>
      container.finishByIds(ids, reason),
    holdByIds: (ids: readonly string[]) => container.holdByIds(ids),
    getCountByTags: (...args: Parameters<typeof container.getCountByTags>) =>
      container.getCountByTags(...args),
    matchesEntityTags: (...args: Parameters<typeof container.matchesEntityTags>) =>
      container.matchesEntityTags(...args),
    findFirstByTags: (...args: Parameters<typeof container.findFirstByTags>) =>
      container.findFirstByTags(...args),
    finishByTags: (...args: Parameters<typeof container.finishByTags>) =>
      container.finishByTags(...args),
  };
}

function skill(overrides: Partial<CompiledSkillProgram> = {}): CompiledSkillProgram {
  return {
    operatorId: 'operator',
    skillGroupKey: 'battleSkill',
    skillId: 'skill',
    skillType: 'battleSkill',
    skillLevel: 1,
    initialBlackboard: {},
    timelineBlockFrames: 2,
    costFrame: 1,
    costs: [{ resource: 'sp', value: 100 }],
    timelineActions: [],
    ...overrides,
  };
}

function createAssembly(
  programs: readonly CompiledSkillProgram[],
  isOperatorControlled?: (operatorId: string, frame: number) => boolean,
  resolveVitals?: ConstructorParameters<typeof CombatRuntimeAssembly>[0]['resolveVitals'],
): CombatRuntimeAssembly {
  return new CombatRuntimeAssembly({
    resources: {
      sp: 100,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 30, pauseDuration: 1, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
      squad: [
        {
          operatorId: 'operator',
          ultimateEnergy: 0,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          canGainUntaggedUltimateEnergy: true,
        },
      ],
    },
    enemyBuffs: emptyEnemyBuffs,
    operators: [{ operatorId: 'operator', skills: programs }],
    createOperationExecutor: () => rejectingExecutor,
    ...(isOperatorControlled === undefined ? {} : { isOperatorControlled }),
    ...(resolveVitals === undefined ? {} : { resolveVitals }),
  });
}

describe('CombatRuntimeAssembly', () => {
  it('evaluates health conditions against the current combat vitals', () => {
    const enemyVitals = new CombatVitals({
      health: 400,
      maxHealth: 1000,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const program = skill({
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: {
                    kind: 'healthCompare',
                    target: 'enemy',
                    valueType: 'ratio',
                    operator: 'less',
                    value: { kind: 'constant', value: 0.5 },
                  },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'changeResource',
                      parameters: { resource: 'sp', amount: 20, recipient: 'team' },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly([program], undefined, target => {
      expect(target).toBe('enemy');
      return enemyVitals;
    });

    assembly.tryStartSkill('operator', 'skill');

    expect(assembly.resources.sp).toBe(120);
  });

  it('routes semantic status actions and conditions through one frame-driven owner', () => {
    const receipt = new CombatReceiptCollector();
    const program = skill({
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'applyStatus',
                parameters: { statusKey: 'ready', target: 'caster' },
              },
              {
                kind: 'conditional',
                parameters: {
                  condition: {
                    kind: 'statusActive',
                    statusKey: 'ready',
                    target: 'caster',
                  },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'changeResource',
                      parameters: { resource: 'sp', amount: 1, recipient: 'team' },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = new CombatRuntimeAssembly({
      resources: {
        sp: 0,
        maxSp: 300,
        returnedSp: 0,
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
        ultimateEnergySystemUnlocked: false,
        normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
        squad: [],
      },
      enemyBuffs: emptyEnemyBuffs,
      operators: [
        {
          operatorId: 'operator',
          skills: [program],
          statusContainer: new CombatStatusContainer('operator', [
            {
              statusKey: 'ready',
              applyStacks: 1,
              maxStacks: 1,
              durationFrames: 2,
              durationStacking: 'refresh',
              consumeStacks: 'all',
            },
          ]),
        },
      ],
      createOperationExecutor: () => rejectingExecutor,
      receipt,
    });

    assembly.tryStartSkill('operator', 'skill');
    expect(assembly.resources.sp).toBe(1);
    assembly.advanceFrames(2);
    expect(
      receipt.entries
        .filter(entry => entry.event === 'StatusChanged')
        .map(entry => entry.data?.reason),
    ).toEqual(['applied', 'expired']);
  });

  it('evaluates caster control conditions from the current simulation frame', () => {
    const isOperatorControlled = vi.fn(() => true);
    const program = skill({
      timelineActions: [
        {
          startFrame: 1,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: { condition: { kind: 'casterControlled' } },
                whenTrue: {
                  steps: [
                    {
                      kind: 'changeResource',
                      parameters: { resource: 'sp', amount: 20, recipient: 'team' },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly([program], isOperatorControlled);

    assembly.tryStartSkill('operator', 'skill');
    assembly.advanceFrame();

    expect(isOperatorControlled).toHaveBeenCalledWith('operator', 1);
    expect(assembly.resources.sp).toBe(21);
  });

  it('rejects caster control conditions when the scenario did not provide control state', () => {
    const program = skill({
      timelineActions: [
        {
          startFrame: 1,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: { condition: { kind: 'casterControlled' } },
                whenTrue: { steps: [] },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly([program]);

    assembly.tryStartSkill('operator', 'skill');

    expect(() => assembly.advanceFrame()).toThrow(
      "skill 'skill' requires the current controlled operator",
    );
  });

  it('runs resource recovery before the skill cost frame and records the result', () => {
    const assembly = createAssembly([skill()]);
    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);

    assembly.advanceFrame();

    expect(assembly.resources.sp).toBe(1);
    expect(assembly.receipt.entries.map(entry => entry.event)).toEqual([
      'SkillStarted',
      'SpChanged',
      'SpChanged',
      'SkillCostApplied',
    ]);
  });

  it('wraps delegate executors with shared-resource behavior', () => {
    const refundProgram = skill({
      skillId: 'refund',
      costFrame: undefined,
      costs: [],
      timelineActions: [
        {
          startFrame: 1,
          sequence: {
            steps: [
              {
                kind: 'changeResource',
                parameters: {
                  resource: 'sp',
                  amount: 20,
                  recipient: 'team',
                  spGainKind: 'refund',
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly([refundProgram]);
    expect(assembly.tryStartSkill('operator', 'refund')).toBe(true);

    assembly.advanceFrame();

    expect(assembly.resources.sp).toBe(121);
    expect(assembly.resources.returnedSp).toBe(20);
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({ event: 'SpChanged', sourceId: 'operator' }),
    );
  });

  it('rejects mismatched operator ownership instead of silently reparenting skills', () => {
    expect(() => createAssembly([skill({ operatorId: 'other' })])).toThrow(
      "skill 'skill' belongs to 'other', expected 'operator'",
    );
  });

  it('wires enemy buff blackboard reads into the skill operation chain', () => {
    const path = 'buff/status/conduct';
    const enemyBuffs = new CombatBuffContainer(
      'enemy',
      new CombatAttributeSet(),
      new GameplayTagRegistry([path]),
    );
    enemyBuffs.add(
      {
        id: 'conduct',
        stackingType: 'unlimited',
        applyTags: [gameplayTagIdFromPath(path)],
        blackboard: { count: 4 },
      },
      'operator',
    );
    let observedValue: number | undefined;
    const program = skill({
      costFrame: undefined,
      costs: [],
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'readBuffBlackboard',
                parameters: {
                  target: 'enemy',
                  query: {
                    kind: 'tag',
                    tagQueryType: 'hasAny',
                    buffTagIds: [gameplayTagIdFromPath(path)],
                  },
                  desiredKey: 'count',
                  outputKey: 'conductCount',
                },
              },
              {
                kind: 'setContextFlag',
                parameters: { flag: 'observed', value: true, target: 'caster' },
              },
            ],
          },
        },
      ],
    });
    const assembly = new CombatRuntimeAssembly({
      resources: {
        sp: 0,
        maxSp: 300,
        returnedSp: 0,
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
        squad: [
          {
            operatorId: 'operator',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            canGainUntaggedUltimateEnergy: true,
          },
        ],
      },
      enemyBuffs,
      operators: [{ operatorId: 'operator', skills: [program] }],
      createOperationExecutor: () => ({
        execute: (_step, context) => {
          observedValue = context?.blackboard.getNumber('conductCount');
          return true;
        },
        evaluate: () => false,
      }),
    });

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);
    expect(observedValue).toBe(4);
  });

  it('evaluates action blackboard comparisons inside the assembled executor chain', () => {
    let reachedBranch = false;
    const program = skill({
      costFrame: undefined,
      costs: [],
      initialBlackboard: { swordCount: 3 },
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: {
                    kind: 'actionValueCompare',
                    left: { kind: 'blackboard', key: 'swordCount' },
                    operator: 'greaterOrEqual',
                    right: { kind: 'constant', value: 3 },
                  },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'setContextFlag',
                      parameters: { flag: 'reached', value: true, target: 'caster' },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = new CombatRuntimeAssembly({
      resources: {
        sp: 0,
        maxSp: 300,
        returnedSp: 0,
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
        squad: [
          {
            operatorId: 'operator',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            canGainUntaggedUltimateEnergy: true,
          },
        ],
      },
      enemyBuffs: emptyEnemyBuffs,
      operators: [{ operatorId: 'operator', skills: [program] }],
      createOperationExecutor: () => ({
        execute: step => {
          reachedBranch = step.kind === 'setContextFlag';
          return true;
        },
        evaluate: () => false,
      }),
    });

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);
    expect(reachedBranch).toBe(true);
  });

  it('shares entity blackboard values between different skills of one operator', () => {
    let reachedBranch = false;
    const writer = skill({
      skillId: 'writer',
      costFrame: undefined,
      costs: [],
      timelineBlockFrames: 1,
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'modifyActionValue',
                parameters: {
                  key: 'EntityBB_SwordNum',
                  operation: 'add',
                  value: { kind: 'constant', value: 1 },
                },
              },
            ],
          },
        },
      ],
    });
    const reader = skill({
      skillId: 'reader',
      costFrame: undefined,
      costs: [],
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: {
                    kind: 'actionValueCompare',
                    left: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                    operator: 'greaterOrEqual',
                    right: { kind: 'constant', value: 1 },
                  },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'setContextFlag',
                      parameters: { flag: 'reached', value: true, target: 'caster' },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = new CombatRuntimeAssembly({
      resources: {
        sp: 0,
        maxSp: 300,
        returnedSp: 0,
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
        squad: [
          {
            operatorId: 'operator',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            canGainUntaggedUltimateEnergy: true,
          },
        ],
      },
      enemyBuffs: emptyEnemyBuffs,
      operators: [{ operatorId: 'operator', skills: [writer, reader] }],
      createOperationExecutor: () => ({
        execute: step => {
          reachedBranch ||= step.kind === 'setContextFlag';
          return true;
        },
        evaluate: () => false,
      }),
    });

    expect(assembly.tryStartSkill('operator', 'writer')).toBe(true);
    assembly.advanceFrame();
    expect(assembly.tryStartSkill('operator', 'reader')).toBe(true);
    expect(reachedBranch).toBe(true);
  });

  it('uses the same entity blackboard for an operator buff runtime and its skills', () => {
    const casterBuffs = new CombatBuffContainer('operator', new CombatAttributeSet());
    casterBuffs.entityBlackboard.assignDynamic('EntityBB_SwordNum', 4);
    let reachedBranch = false;
    const reader = skill({
      costFrame: undefined,
      costs: [],
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: {
                    kind: 'actionValueCompare',
                    left: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                    operator: 'equal',
                    right: { kind: 'constant', value: 4 },
                  },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'setContextFlag',
                      parameters: { flag: 'reached', value: true, target: 'caster' },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = new CombatRuntimeAssembly({
      resources: {
        sp: 0,
        maxSp: 300,
        returnedSp: 0,
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
        squad: [
          {
            operatorId: 'operator',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            canGainUntaggedUltimateEnergy: true,
          },
        ],
      },
      enemyBuffs: emptyEnemyBuffs,
      operators: [
        { operatorId: 'operator', skills: [reader], buffRuntime: asBuffRuntime(casterBuffs) },
      ],
      createOperationExecutor: () => ({
        execute: step => {
          reachedBranch ||= step.kind === 'setContextFlag';
          return true;
        },
        evaluate: () => false,
      }),
    });

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);
    expect(reachedBranch).toBe(true);
  });

  it('routes party Buff applications to every configured operator runtime', () => {
    const appliedTo: string[] = [];
    const createBuffRuntime = (ownerId: string) => ({
      ownerId,
      advanceFrame: () => undefined,
      apply: () => {
        appliedTo.push(ownerId);
        return true;
      },
      getCountByIds: () => 0,
      finishByIds: () => 0,
      holdByIds: () => ({ release: () => undefined }),
      getCountByTags: () => 0,
      matchesEntityTags: () => false,
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    });
    const program = skill({
      operatorId: 'operator-a',
      costFrame: undefined,
      costs: [],
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'applyBuff',
                parameters: { buffId: 'party-buff', target: 'party' },
              },
            ],
          },
        },
      ],
    });
    const assembly = new CombatRuntimeAssembly({
      resources: {
        sp: 0,
        maxSp: 300,
        returnedSp: 0,
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
        squad: [
          {
            operatorId: 'operator-a',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            canGainUntaggedUltimateEnergy: true,
          },
          {
            operatorId: 'operator-b',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            canGainUntaggedUltimateEnergy: true,
          },
        ],
      },
      enemyBuffs: emptyEnemyBuffs,
      operators: [
        {
          operatorId: 'operator-a',
          skills: [program],
          buffRuntime: createBuffRuntime('operator-a'),
        },
        {
          operatorId: 'operator-b',
          skills: [],
          buffRuntime: createBuffRuntime('operator-b'),
        },
      ],
      createOperationExecutor: () => rejectingExecutor,
    });

    expect(assembly.tryStartSkill('operator-a', 'skill')).toBe(true);
    expect(appliedTo).toEqual(['operator-b', 'operator-a']);
  });

  it('routes caster Buff identity operations to that operator Buff runtime', () => {
    const casterBuffs = new CombatBuffContainer('operator', new CombatAttributeSet());
    const previous = casterBuffs.add({ id: 'sword-trigger', stackingType: 'unique' }, 'operator');
    const program = skill({
      costFrame: undefined,
      costs: [],
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['sword-trigger'],
                    operator: 'greaterOrEqual',
                    value: 1,
                  },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'finishBuffsById',
                      parameters: {
                        target: 'caster',
                        buffIds: ['sword-trigger'],
                        reason: 'other',
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
    const assembly = new CombatRuntimeAssembly({
      resources: {
        sp: 0,
        maxSp: 300,
        returnedSp: 0,
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
        squad: [
          {
            operatorId: 'operator',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            canGainUntaggedUltimateEnergy: true,
          },
        ],
      },
      enemyBuffs: emptyEnemyBuffs,
      operators: [
        { operatorId: 'operator', skills: [program], buffRuntime: asBuffRuntime(casterBuffs) },
      ],
      createOperationExecutor: () => rejectingExecutor,
    });

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);
    expect(previous?.finishReason).toBe('other');
  });

  it('processes frame input after recovery and before the skill cost tick', () => {
    const program = skill({ costFrame: 0 });
    const assembly = new CombatRuntimeAssembly({
      resources: {
        sp: 99,
        maxSp: 300,
        returnedSp: 0,
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecovery: { valuePerSecond: 30, pauseDuration: 1, pauseRemaining: 0 },
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
        squad: [
          {
            operatorId: 'operator',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            canGainUntaggedUltimateEnergy: true,
          },
        ],
      },
      enemyBuffs: emptyEnemyBuffs,
      operators: [{ operatorId: 'operator', skills: [program] }],
      inputs: [{ frame: 1, operatorId: 'operator', skillId: 'skill' }],
      createOperationExecutor: () => rejectingExecutor,
    });

    assembly.advanceFrame();

    expect(assembly.resources.sp).toBe(0);
    expect(assembly.receipt.entries.map(entry => entry.event)).toEqual([
      'SpChanged',
      'SkillStarted',
      'SpChanged',
      'SkillCostApplied',
      'SkillInputProcessed',
    ]);
  });
});
