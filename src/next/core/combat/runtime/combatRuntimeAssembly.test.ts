import { describe, expect, it } from 'vitest';
import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer } from '../buffs/combatBuffs';
import { GameplayTagRegistry, gameplayTagIdFromPath } from '../tags/gameplayTags';
import { CombatRuntimeAssembly } from './combatRuntimeAssembly';
import type { CombatOperationExecutor } from './skillRuntime';

const emptyEnemyBuffs = {
  getCountByIds: () => 0,
  finishByIds: () => 0,
  holdByIds: () => ({ release: () => undefined }),
  getCountByTags: () => 0,
  findFirstByTags: () => undefined,
  finishByTags: () => 0,
};

const rejectingExecutor: CombatOperationExecutor = {
  execute: () => false,
  evaluate: () => false,
};

function asBuffRuntime(container: CombatBuffContainer<string>) {
  return {
    advanceFrame: () => undefined,
    getCountByIds: (ids: readonly string[]) => container.getCountByIds(ids),
    finishByIds: (ids: readonly string[], reason: 'early' | 'absorbed' | 'other') =>
      container.finishByIds(ids, reason),
    holdByIds: (ids: readonly string[]) => container.holdByIds(ids),
    getCountByTags: (...args: Parameters<typeof container.getCountByTags>) =>
      container.getCountByTags(...args),
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

function createAssembly(programs: readonly CompiledSkillProgram[]): CombatRuntimeAssembly {
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
  });
}

describe('CombatRuntimeAssembly', () => {
  it('runs resource recovery before the skill cost frame and records the result', () => {
    const assembly = createAssembly([skill()]);
    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);

    assembly.advanceFrame();

    expect(assembly.resources.sp).toBe(1);
    expect(assembly.receipt.entries.map(entry => entry.event)).toEqual([
      'SkillStarted',
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
                  tagQueryType: 'hasAny',
                  buffTagIds: [gameplayTagIdFromPath(path)],
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
      'SkillStarted',
      'SkillCostApplied',
      'SkillInputProcessed',
    ]);
  });
});
