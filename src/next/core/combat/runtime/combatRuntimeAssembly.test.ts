import { describe, expect, it, vi } from 'vitest';
import type {
  CompiledOperatorPassiveProgram,
  CompiledSkillProgram,
  CompiledSkillSlotGroup,
} from '../../compiler/combatProgram';
import { compileOperatorBuffDefinitions, compileSkill } from '../../compiler/compileSkill';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer } from '../buffs/combatBuffs';
import {
  CompiledCombatBuffDefinitions,
  type CombatBuffDefinitionEntry,
} from '../buffs/combatBuffDefinitions';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { GameplayTagRegistry } from '../tags/gameplayTags';
import { CombatStatusContainer } from '../status/combatStatuses';
import { CombatRuntimeAssembly, type CombatEnemyProgram } from './combatRuntimeAssembly';
import { BuffDefinitionOperationTarget } from './buffDefinitionOperationTarget';
import { ActionBlackboard } from './actionBlackboard';
import { CombatVitals } from './combatVitals';
import type { CombatOperationExecutor } from './skillRuntime';
import {
  logicalAbilityEntityRuntimeId,
  type RuntimeTargetRef,
} from '../../game-data/logicalAbilityEntity';
import { gilbertaBattleSkill } from '../../../data/operators/generated-definitions/gilberta/gilberta.operator.generated';
import { gilberta as gilbertaGeneratedOperator } from '../../../data/operators/gilberta';

const emptyEnemyBuffRuntime = {
  ownerId: 'enemy',
  advanceFrame: () => undefined,
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

const testEnemy: CombatEnemyProgram = {
  source: { kind: 'custom', level: 90 },
  rank: 'mob',
  health: 1000,
  superArmor: 0,
  defenderAttributes: {
    defense: 0,
    shelterDamageMultiplier: 0,
    breakingAttackDamageTakenMultiplier: 1,
    resistances: {
      physical: { percent: 0, damageTakenMultiplier: 1 },
      heat: { percent: 0, damageTakenMultiplier: 1 },
      electric: { percent: 0, damageTakenMultiplier: 1 },
      cryo: { percent: 0, damageTakenMultiplier: 1 },
      nature: { percent: 0, damageTakenMultiplier: 1 },
      ether: { percent: 0, damageTakenMultiplier: 1 },
    },
  },
  stagger: {
    maximum: 100,
    knotThresholds: [0.5],
    knotBreakDurationFrames: 30,
    brokenDurationFrames: 300,
    finisherSpRecovery: 100,
  },
};

function asBuffRuntime(container: CombatBuffContainer<string>) {
  return {
    ownerId: container.ownerId,
    entityBlackboard: container.entityBlackboard,
    advanceFrame: () => container.tick(1 / 30),
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
  enemyBuffRuntime: ConstructorParameters<
    typeof CombatRuntimeAssembly
  >[0]['enemyBuffRuntime'] = emptyEnemyBuffRuntime,
  createOperatorBuffRuntime?: ConstructorParameters<
    typeof CombatRuntimeAssembly
  >[0]['createOperatorBuffRuntime'],
  enemy: CombatEnemyProgram = testEnemy,
  timeDilation?: ConstructorParameters<typeof CombatRuntimeAssembly>[0]['timeDilation'],
  createAbilityEntityBuffRuntime?: ConstructorParameters<
    typeof CombatRuntimeAssembly
  >[0]['createAbilityEntityBuffRuntime'],
  initialEntityBlackboard?: Readonly<Record<string, number>>,
  skillSlotGroups?: readonly CompiledSkillSlotGroup[],
  emitAbilityEvent?: ConstructorParameters<typeof CombatRuntimeAssembly>[0]['emitAbilityEvent'],
  buffDefinitions?: ConstructorParameters<
    typeof CombatRuntimeAssembly
  >[0]['operators'][number]['buffDefinitions'],
  passivePrograms?: readonly CompiledOperatorPassiveProgram[],
  panel?: ConstructorParameters<typeof CombatRuntimeAssembly>[0]['operators'][number]['panel'],
  inputs?: ConstructorParameters<typeof CombatRuntimeAssembly>[0]['inputs'],
  playerActionRoutes?: ConstructorParameters<
    typeof CombatRuntimeAssembly
  >[0]['operators'][number]['playerActionRoutes'],
): CombatRuntimeAssembly {
  return new CombatRuntimeAssembly({
    enemy,
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
          allowedUltimateEnergyRecoveryTags: null,
        },
      ],
    },
    enemyBuffRuntime,
    ...(timeDilation === undefined ? {} : { timeDilation }),
    operators: [
      {
        operatorId: 'operator',
        skills: programs,
        ...(buffDefinitions === undefined ? {} : { buffDefinitions }),
        ...(skillSlotGroups === undefined ? {} : { skillSlotGroups }),
        ...(playerActionRoutes === undefined ? {} : { playerActionRoutes }),
        ...(initialEntityBlackboard === undefined ? {} : { initialEntityBlackboard }),
        ...(passivePrograms === undefined ? {} : { passivePrograms }),
        ...(panel === undefined ? {} : { panel }),
      },
    ],
    createOperationExecutor: () => rejectingExecutor,
    ...(inputs === undefined ? {} : { inputs }),
    ...(createOperatorBuffRuntime === undefined ? {} : { createOperatorBuffRuntime }),
    ...(createAbilityEntityBuffRuntime === undefined ? {} : { createAbilityEntityBuffRuntime }),
    ...(isOperatorControlled === undefined ? {} : { isOperatorControlled }),
    ...(resolveVitals === undefined ? {} : { resolveVitals }),
    ...(emitAbilityEvent === undefined ? {} : { emitAbilityEvent }),
  });
}

describe('CombatRuntimeAssembly', () => {
  it('warns on a mismatched player slot but executes the explicitly placed skill', () => {
    const base = skill({ skillId: 'battleSkill', castId: 'cast:base', costs: [] });
    const replacement = skill({
      skillId: 'battleSkillDuringUltimate',
      castId: 'cast:replacement',
      costs: [{ resource: 'sp', value: 150 }],
    });
    const assembly = createAssembly(
      [base, replacement],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
      undefined,
      undefined,
      undefined,
      [
        {
          skillGroupKey: 'battleSkill',
          baseSkillKey: 'battleSkill',
          replacementSkillKeys: ['battleSkillDuringUltimate'],
        },
      ],
      undefined,
      undefined,
      undefined,
      undefined,
      [
        {
          frame: 0,
          operatorId: 'operator',
          skillId: 'battleSkillDuringUltimate',
          castId: 'cast:replacement',
          action: 'battleSkill',
        },
      ],
      {
        battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
      },
    );

    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'SkillInputResolvedToDifferentSkill',
        data: expect.objectContaining({
          skillId: 'battleSkillDuringUltimate',
          actualSkillId: 'battleSkill',
        }),
      }),
    );
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'SkillStarted',
        data: expect.objectContaining({ skillId: 'battleSkillDuringUltimate' }),
      }),
    );

    assembly.advanceFrame();
    expect(assembly.resources.sp).toBe(-49);
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'SpChanged',
        data: expect.objectContaining({ actualValue: -150, currentValue: -49 }),
      }),
    );
  });

  it('resolves the combo action to the active HUD candidate before the static combo slot', () => {
    const first = skill({ skillId: 'combo-stage-1', skillType: 'comboSkill', costs: [] });
    const second = skill({ skillId: 'combo-stage-2', skillType: 'comboSkill', costs: [] });
    const assembly = createAssembly(
      [first, second],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
      undefined,
      undefined,
      undefined,
      [
        {
          skillGroupKey: 'comboSkill',
          baseSkillKey: 'combo-stage-1',
          stableInputSkillKeys: ['combo-stage-1', 'combo-stage-2'],
          replacementSkillKeys: [],
        },
      ],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' } },
    );
    assembly.comboWindows.open('operator', 'combo-stage-2');

    expect(assembly.tryStartPlayerInput('operator', 'combo-stage-2', undefined, 'comboSkill')).toBe(
      true,
    );
    expect(
      assembly.receipt.entries.some(entry => entry.event === 'SkillInputResolvedToDifferentSkill'),
    ).toBe(false);
  });

  it('resolves descendant Buff definitions from the source skill after crossing to a teammate', () => {
    const sourceBuffs = new CombatBuffContainer('source', new CombatAttributeSet<string>());
    const allyBuffs = new CombatBuffContainer('ally', new CombatAttributeSet<string>());
    const compileInline = (entry: CombatBuffDefinitionEntry) => ({
      id: entry.id,
      stackingType: entry.stackingType,
    });
    const sourceRuntime = new BuffDefinitionOperationTarget(sourceBuffs, {
      get: () => undefined,
      compile: compileInline,
    });
    const allyRuntime = new BuffDefinitionOperationTarget(allyBuffs, {
      get: () => undefined,
      compile: compileInline,
    });
    const childDefinition = { stackingType: 'unique' as const };
    const parentDefinition = {
      stackingType: 'unique' as const,
      lifecycleSequences: {
        enable: {
          steps: [
            {
              kind: 'applyBuff' as const,
              parameters: {
                buffId: 'source-child',
                target: 'buffOwner' as const,
                inheritSourceSkillCastInfo: true,
              },
            },
          ],
        },
      },
    };
    const sourceSkill = skill({
      operatorId: 'source',
      skillId: 'support',
      castId: 'support-cast',
      costs: [],
      costFrame: undefined,
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'applyBuff',
                parameters: {
                  buffId: 'source-parent',
                  target: 'partyExceptCaster',
                  inheritSourceSkillCastInfo: true,
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = new CombatRuntimeAssembly({
      enemy: testEnemy,
      resources: {
        sp: 0,
        maxSp: 300,
        returnedSp: 0,
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
        squad: ['source', 'ally'].map(operatorId => ({
          operatorId,
          ultimateEnergy: 0,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          allowedUltimateEnergyRecoveryTags: null,
        })),
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
      operators: [
        {
          operatorId: 'source',
          skills: [sourceSkill],
          buffRuntime: sourceRuntime,
          buffDefinitions: {
            'source-parent': parentDefinition,
            'source-child': childDefinition,
          },
        },
        { operatorId: 'ally', skills: [], buffRuntime: allyRuntime },
      ],
      createOperationExecutor: () => rejectingExecutor,
    });

    expect(assembly.tryStartSkill('source', 'support', 'support-cast')).toBe(true);
    expect(allyBuffs.getCountById('source-parent')).toBe(1);
    expect(allyBuffs.getCountById('source-child')).toBe(1);
    expect(sourceBuffs.getCountById('source-child')).toBe(0);
  });

  it('emits before-cast events for both direct and deferred skill starts', () => {
    const emitAbilityEvent = vi.fn();
    const first = skill({ skillId: 'first', costs: [], costFrame: undefined });
    const second = skill({
      skillGroupKey: 'ultimate',
      skillId: 'second',
      skillType: 'ultimate',
      costs: [],
      costFrame: undefined,
    });
    const assembly = createAssembly(
      [first, second],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      emitAbilityEvent,
    );

    expect(assembly.tryStartSkill('operator', 'first')).toBe(true);
    assembly.requestPostSkillCast('operator', { skillId: 'second' });
    assembly.advanceFrame();

    expect(emitAbilityEvent.mock.calls).toEqual([
      [
        'operator',
        'beforeCastSkill',
        {
          sourceId: 'operator',
          targetId: 'operator',
          skillType: 'battleSkill',
          skillId: 'first',
          skillCastId: 1,
          skillCastInfo: {
            skillCastId: 1,
            originSkillId: 'first',
            originSkillType: 'battleSkill',
            nonReturnedSpCost: 0,
          },
          attachBuffToCurrentSkill: expect.any(Function),
        },
      ],
      [
        'operator',
        'skillEnd',
        {
          event: 'skillEnd',
          kind: 'abilitySkill',
          sourceId: 'operator',
          targetId: 'operator',
          skillType: 'battleSkill',
          skillId: 'first',
          skillCastId: 1,
        },
      ],
      [
        'operator',
        'beforeCastSkill',
        {
          sourceId: 'operator',
          targetId: 'operator',
          skillType: 'ultimate',
          skillId: 'second',
          skillCastId: 2,
          skillCastInfo: {
            skillCastId: 2,
            originSkillId: 'second',
            originSkillType: 'ultimate',
            nonReturnedSpCost: 0,
          },
          attachBuffToCurrentSkill: expect.any(Function),
        },
      ],
    ]);
  });

  it('keeps a frame-zero slot change on the current release and selects it next time', () => {
    const base = skill({
      castId: 'ultimate-cast',
      skillGroupKey: 'ultimate',
      skillId: 'ultimate',
      skillType: 'ultimate',
      costs: [],
      costFrame: undefined,
      timelineActions: [
        {
          startFrame: 0,
          endFrame: 1,
          sequence: {
            steps: [
              {
                kind: 'changeSkillSlot',
                parameters: { skillGroupKey: 'ultimate', targetSkillKey: 'arcana' },
              },
            ],
          },
        },
      ],
    });
    const arcana = skill({
      castId: 'ultimate-cast',
      skillGroupKey: 'ultimate',
      skillId: 'arcana',
      skillType: 'ultimate',
      costs: [],
      costFrame: undefined,
      timelineActions: [
        {
          startFrame: 0,
          endFrame: 1,
          sequence: {
            steps: [
              {
                kind: 'changeSkillSlot',
                parameters: { skillGroupKey: 'ultimate', targetSkillKey: 'ultimate' },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly(
      [base, arcana],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
      undefined,
      undefined,
      undefined,
      [
        {
          skillGroupKey: 'ultimate',
          baseSkillKey: 'ultimate',
          replacementSkillKeys: ['arcana'],
        },
      ],
    );

    expect(assembly.tryStartSkill('operator', 'ultimate', 'ultimate-cast')).toBe(true);
    expect(
      assembly.receipt.entries.filter(entry => entry.event === 'SkillStarted').at(-1)?.data
        ?.skillId,
    ).toBe('ultimate');
    assembly.advanceFrames(2);

    expect(assembly.tryStartSkill('operator', 'ultimate', 'ultimate-cast')).toBe(true);
    expect(
      assembly.receipt.entries.filter(entry => entry.event === 'SkillStarted').at(-1)?.data
        ?.skillId,
    ).toBe('arcana');
    expect(
      assembly.receipt.entries
        .filter(entry => entry.event === 'SkillSlotChanged')
        .map(entry => [entry.data?.skillGroupKey, entry.data?.targetSkillKey]),
    ).toEqual([
      ['ultimate', 'arcana'],
      ['ultimate', 'ultimate'],
    ]);
  });

  it('installs static entity blackboard values before creating skill runtimes', () => {
    const entityBlackboard = new ActionBlackboard();
    const operatorBuffRuntime = {
      ...emptyEnemyBuffRuntime,
      ownerId: 'operator',
      entityBlackboard,
    };

    createAssembly(
      [skill()],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      () => operatorBuffRuntime,
      testEnemy,
      undefined,
      undefined,
      { EntityBB_form: 1 },
    );

    expect(entityBlackboard.getNumber('EntityBB_form')).toBe(1);
  });

  it('runs logical AbilityEntity spawn steps through the shared scene directory', () => {
    const program = skill({
      costs: [],
      costFrame: undefined,
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'spawnAbilityEntity',
                parameters: {
                  abilityEntityId: 'fixture_entity',
                  definition: {
                    lifetime: { kind: 'limited', durationSeconds: 5 },
                    childSkill: {
                      skillId: 'fixture_child',
                      initialBlackboard: {},
                      timelineActions: [],
                    },
                  },
                  target: 'enemy',
                  overrideDurationSeconds: { kind: 'constant', value: 2 },
                  saveToContextKey: 'spawned',
                  dieWhenSourceDies: false,
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly(
      [program],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
    );

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);
    expect(assembly.abilityEntities.activeCount).toBe(1);
    expect(assembly.receipt.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: 'AbilityEntitySpawned',
          sourceId: 'operator',
          data: expect.objectContaining({
            abilityEntityId: 'fixture_entity',
            remainingDurationSeconds: 2,
          }),
        }),
        expect.objectContaining({
          event: 'AbilityEntityChildSkillRequested',
          data: expect.objectContaining({ childSkillId: 'fixture_child' }),
        }),
      ]),
    );
  });

  it('advances a logical AbilityEntity lifetime with its entity time scale', () => {
    const assembly = createAssembly(
      [],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
      {
        config: {},
        timeManagerDeltaMode: 0,
      },
    );
    const entity = assembly.abilityEntities.spawn({
      abilityEntityId: 'fixture_entity',
      definition: { lifetime: { kind: 'limited', durationSeconds: 1 } },
      ownerId: 'operator',
      source: { kind: 'operator', operatorId: 'operator' },
    });
    if (entity.kind !== 'abilityEntity') throw new Error('spawn must return an AbilityEntity');
    assembly.timeDilation!.startEntity({
      entityId: logicalAbilityEntityRuntimeId(entity.instanceId),
      durationSeconds: 10,
      slot: 'Test/TimeSlot1',
      priority: 10,
      curve: () => 0.5,
    });

    assembly.simulation.advanceFrames(30);

    const snapshot = assembly.abilityEntities.snapshot(entity);
    expect(snapshot.remainingDurationSeconds).toBeCloseTo(0.5);
    expect(snapshot.elapsedDurationSeconds).toBeCloseTo(0.5);
  });

  it('runs an AbilityEntity child timeline on the same entity time scale', () => {
    const program = skill({
      costs: [],
      costFrame: undefined,
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'spawnAbilityEntity',
                parameters: {
                  abilityEntityId: 'fixture_entity',
                  dieWhenSourceDies: false,
                  definition: {
                    lifetime: { kind: 'limited', durationSeconds: 10 },
                    childSkill: {
                      skillId: 'fixture_child',
                      initialBlackboard: {},
                      timelineActions: [
                        {
                          startFrame: 2,
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
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly(
      [program],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
      {
        config: {},
        timeManagerDeltaMode: 0,
      },
    );

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);
    const [entity] = assembly.abilityEntities.findAll();
    if (entity?.kind !== 'abilityEntity') throw new Error('spawn must return an AbilityEntity');
    assembly.timeDilation!.startEntity({
      entityId: logicalAbilityEntityRuntimeId(entity.instanceId),
      durationSeconds: 10,
      slot: 'Test/TimeSlot1',
      priority: 10,
      curve: () => 0.5,
    });

    assembly.advanceFrames(3);
    expect(
      assembly.receipt.entries.some(
        entry => entry.event === 'SpChanged' && entry.data?.requestedValue === 10,
      ),
    ).toBe(false);
    assembly.advanceFrame();
    expect(
      assembly.receipt.entries.some(
        entry => entry.event === 'SpChanged' && entry.data?.requestedValue === 10,
      ),
    ).toBe(true);
  });

  it('lets an AbilityEntity Buff lifecycle finish its owning entity through the shared chain', () => {
    let entityBuffs: CombatBuffContainer<string> | undefined;
    const ownerHpZeroCleanupStates: boolean[] = [];
    const emitAbilityEvent = vi.fn((_entityId, event) => {
      if (event === 'ownerHpZero') {
        ownerHpZeroCleanupStates.push(entityBuffs?.buffs[0]?.isFinished ?? true);
      }
    });
    const createAbilityEntityBuffRuntime = vi.fn(
      (entityId: string, blackboard: ActionBlackboard, target: RuntimeTargetRef) => {
        entityBuffs = new CombatBuffContainer(
          entityId,
          new CombatAttributeSet<string>(),
          undefined,
          null,
          blackboard,
        );
        return new BuffDefinitionOperationTarget(
          entityBuffs,
          {
            get: () => undefined,
            compile: entry => ({
              id: entry.id,
              stackingType: entry.stackingType,
              triggerIntervalSeconds: entry.triggerIntervalSeconds,
              waitFirstTriggerInterval: entry.waitFirstTriggerInterval,
              maxTriggerCount: entry.maxTriggerCount,
            }),
          },
          target,
        );
      },
    );
    const program = skill({
      castId: 'entity-buff-cast',
      costs: [],
      costFrame: undefined,
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'spawnAbilityEntity',
                parameters: {
                  abilityEntityId: 'buff-host',
                  dieWhenSourceDies: false,
                  definition: {
                    lifetime: { kind: 'limited', durationSeconds: 10 },
                    childSkill: {
                      skillId: 'buff-child',
                      initialBlackboard: {},
                      timelineActions: [
                        {
                          startFrame: 0,
                          sequence: {
                            steps: [
                              {
                                kind: 'applyBuff',
                                parameters: {
                                  buffId: 'entity-monitor',
                                  target: 'currentAbilityEntity',
                                  inheritSourceSkillCastInfo: true,
                                  definition: {
                                    stackingType: 'unique',
                                    triggerIntervalSeconds: 1 / 30,
                                    waitFirstTriggerInterval: true,
                                    maxTriggerCount: 1,
                                    lifecycleSequences: {
                                      trigger: {
                                        steps: [
                                          {
                                            kind: 'applyBuff',
                                            parameters: {
                                              buffId: 'entity-trigger-result',
                                              target: 'buffOwner',
                                              inheritSourceSkillCastInfo: true,
                                              definition: { stackingType: 'unique' },
                                            },
                                          },
                                          { kind: 'finishCurrentAbilityEntity', parameters: {} },
                                        ],
                                      },
                                    },
                                  },
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly(
      [program],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
      undefined,
      createAbilityEntityBuffRuntime,
      undefined,
      undefined,
      emitAbilityEvent,
    );

    expect(assembly.tryStartSkill('operator', 'skill', 'entity-buff-cast')).toBe(true);
    expect(createAbilityEntityBuffRuntime).toHaveBeenCalledOnce();
    expect(entityBuffs?.buffs.map(buff => buff.definition.id)).toEqual(['entity-monitor']);
    expect(assembly.abilityEntities.activeCount).toBe(1);
    assembly.advanceFrames(1);
    expect(assembly.abilityEntities.activeCount).toBe(1);
    assembly.advanceFrames(1);
    expect(assembly.abilityEntities.activeCount).toBe(0);
    expect(entityBuffs?.buffs[0]?.isFinished).toBe(true);
    expect(entityBuffs?.buffs.map(buff => buff.definition.id)).toEqual([
      'entity-monitor',
      'entity-trigger-result',
    ]);
    expect(ownerHpZeroCleanupStates).toEqual([false]);
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'AbilityEntityFinished',
        data: expect.objectContaining({ reason: 'explicit' }),
      }),
    );
  });

  it('runs Gilberta generated caster-health monitor through the assembled entity Buff chain', () => {
    let entityBuffs: CombatBuffContainer<string> | undefined;
    const createAbilityEntityBuffRuntime = (
      entityId: string,
      blackboard: ActionBlackboard,
      target: RuntimeTargetRef,
    ) => {
      entityBuffs = new CombatBuffContainer(
        entityId,
        new CombatAttributeSet<string>(),
        undefined,
        null,
        blackboard,
      );
      return new BuffDefinitionOperationTarget(
        entityBuffs,
        {
          get: () => undefined,
          compile: entry => ({
            id: entry.id,
            stackingType: entry.stackingType,
            priority: entry.priority,
            maxStackCount: entry.maxStackCount,
            triggerIntervalSeconds: entry.triggerIntervalSeconds,
            waitFirstTriggerInterval: entry.waitFirstTriggerInterval,
            maxTriggerCount: entry.maxTriggerCount,
          }),
        },
        target,
      );
    };
    const compiled = compileSkill({
      operatorId: 'operator',
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 1,
      skill: gilbertaBattleSkill,
      abilityEntityDefinitions: gilbertaGeneratedOperator.abilityEntityDefinitions,
    });
    const spawnAction = compiled.timelineActions.find(action =>
      action.sequence.steps.some(step => step.kind === 'spawnAbilityEntity'),
    );
    if (spawnAction === undefined) throw new Error('Gilberta generated spawn action is missing');
    const program: CompiledSkillProgram = {
      ...compiled,
      skillId: 'gilberta-monitor-fixture',
      castId: 'gilberta-monitor-cast',
      timelineBlockFrames: 1,
      costFrame: undefined,
      costs: [],
      timelineActions: [{ ...spawnAction, startFrame: 0 }],
    };
    const operatorVitals = new CombatVitals({
      health: 0,
      maxHealth: 100,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const assembly = createAssembly(
      [program],
      undefined,
      () => operatorVitals,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
      undefined,
      createAbilityEntityBuffRuntime,
      undefined,
      undefined,
      undefined,
      compileOperatorBuffDefinitions(gilbertaGeneratedOperator.buffDefinitions),
    );

    expect(assembly.tryStartSkill('operator', program.skillId, program.castId)).toBe(true);
    expect(assembly.abilityEntities.activeCount).toBe(1);
    expect(entityBuffs?.buffs.map(buff => buff.definition.id)).toEqual([
      'buff_chr_0013_aglina_normal_skill_monitor',
    ]);
    expect(
      assembly.abilityEntities.notifySourceDied({ kind: 'operator', operatorId: 'operator' }),
    ).toBe(0);
    assembly.advanceFrames(6);

    expect(assembly.abilityEntities.activeCount).toBe(0);
    expect(entityBuffs?.buffs[0]?.isFinished).toBe(true);
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'AbilityEntityFinished',
        // 蓝图未启用 dieWhenSourceDies；实体由监视 Buff 的显式结束动作关闭。
        data: expect.objectContaining({ reason: 'explicit' }),
      }),
    );
  });

  it('resolves owner/entity-id AbilityEntity targets through the assembled time-dilation chain', () => {
    const program = skill({
      costs: [],
      costFrame: undefined,
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'startTimeDilation',
                parameters: {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 1 },
                  slot: 'Test/TimeSlot1',
                  priority: 10,
                  curve: { kind: 'named', key: 'half' },
                  finishByAction: false,
                  targets: [],
                  abilityEntityTargets: [
                    {
                      kind: 'ownerSpawned',
                      abilityEntityIds: ['marked'],
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly(
      [program],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
      {
        config: {
          curves: new Map([['half', () => 0.5]]),
        },
        timeManagerDeltaMode: 0,
      },
    );
    const markedEntity = assembly.abilityEntities.spawn({
      abilityEntityId: 'marked',
      definition: {
        lifetime: { kind: 'limited', durationSeconds: 2 },
      },
      ownerId: 'operator',
      source: { kind: 'operator', operatorId: 'operator' },
    });
    assembly.abilityEntities.spawn({
      abilityEntityId: 'plain',
      definition: { lifetime: { kind: 'limited', durationSeconds: 2 } },
      ownerId: 'operator',
      source: { kind: 'operator', operatorId: 'operator' },
    });
    if (markedEntity.kind !== 'abilityEntity') throw new Error('spawn must return an entity');

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);

    expect(assembly.timeDilation!.entityInstances.map(instance => instance.entityId)).toEqual([
      logicalAbilityEntityRuntimeId(markedEntity.instanceId),
    ]);
  });

  it('shares one cooldown ledger across placed casts of the same skill', () => {
    const assembly = createAssembly([
      skill({ castId: 'cast:1', cooldownFrames: 10, costs: [], costFrame: 0 }),
      skill({ castId: 'cast:2', cooldownFrames: 10, costs: [], costFrame: 0 }),
    ]);

    expect(assembly.tryStartSkill('operator', 'skill', 'cast:1')).toBe(true);
    assembly.advanceFrame();
    expect(assembly.tryStartSkill('operator', 'skill', 'cast:2')).toBe(true);

    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'SkillCooldownUnavailableAtStart',
        data: expect.objectContaining({ castId: 'cast:2', skillId: 'skill' }),
      }),
    );
  });

  it('applies a scoped native cooldown multiplier to the shared combo-skill ledger', () => {
    const panel = {
      operatorId: 'operator',
      level: 90,
      attributes: { strength: 0, agility: 0, intellect: 0, will: 0 },
      attack: 1,
      attackBeforeAttributeScalar: 1,
      mainAttribute: 'strength' as const,
      secondaryAttribute: 'agility' as const,
      health: 1,
      defense: 0,
      criticalRate: 0,
      criticalDamage: 0,
      artsIntensity: 0,
      ultimateEnergyGainEfficiency: 1,
      skillCooldownReduction: 0,
      staggerDamagePercent: 0,
      combatModifiers: [
        {
          kind: 'skillCooldownMultiplier' as const,
          skillTypes: 'comboSkill' as const,
          value: 0.85,
        },
      ],
      receipt: [],
    };
    const programs = ['cast:1', 'cast:2', 'cast:3'].map(castId =>
      skill({
        castId,
        skillGroupKey: 'comboSkill',
        skillType: 'comboSkill',
        cooldownFrames: 10,
        costs: [],
        costFrame: 0,
      }),
    );
    const assembly = createAssembly(
      programs,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      panel,
    );

    expect(assembly.tryStartSkill('operator', 'skill', 'cast:1')).toBe(true);
    for (let frame = 0; frame < 8; frame += 1) assembly.advanceFrame();
    expect(assembly.tryStartSkill('operator', 'skill', 'cast:2')).toBe(true);
    assembly.advanceFrame();
    expect(assembly.tryStartSkill('operator', 'skill', 'cast:3')).toBe(true);

    const cooldownEvents = assembly.receipt.entries.filter(entry =>
      entry.event.startsWith('SkillCooldown'),
    );
    expect(cooldownEvents.map(entry => entry.event)).toEqual([
      'SkillCooldownReserved',
      'SkillCooldownUnavailableAtStart',
      'SkillCooldownReady',
      'SkillCooldownReserved',
    ]);
  });

  it('multiplies scoped global cooldown reductions without affecting other skill types', () => {
    const panel = {
      operatorId: 'operator',
      level: 90,
      attributes: { strength: 0, agility: 0, intellect: 0, will: 0 },
      attack: 1,
      attackBeforeAttributeScalar: 1,
      mainAttribute: 'strength' as const,
      secondaryAttribute: 'agility' as const,
      health: 1,
      defense: 0,
      criticalRate: 0,
      criticalDamage: 0,
      artsIntensity: 0,
      ultimateEnergyGainEfficiency: 1,
      skillCooldownReduction: 0,
      staggerDamagePercent: 0,
      combatModifiers: [
        {
          kind: 'skillCooldownReduction' as const,
          skillTypes: ['comboSkill'] as const,
          value: 0.5,
          modifierId: 'global:combo-cooldown',
        },
      ],
      receipt: [],
    };
    const assembly = createAssembly(
      [
        skill({
          castId: 'combo:1',
          skillGroupKey: 'comboSkill',
          skillType: 'comboSkill',
          cooldownFrames: 10,
          costs: [],
          costFrame: 0,
        }),
        skill({
          castId: 'combo:2',
          skillGroupKey: 'comboSkill',
          skillType: 'comboSkill',
          cooldownFrames: 10,
          costs: [],
          costFrame: 0,
        }),
      ],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      panel,
    );

    expect(assembly.tryStartSkill('operator', 'skill', 'combo:1')).toBe(true);
    for (let frame = 0; frame < 4; frame += 1) assembly.advanceFrame();
    expect(assembly.tryStartSkill('operator', 'skill', 'combo:2')).toBe(true);
    assembly.advanceFrame();
    expect(assembly.receipt.entries.map(entry => entry.event)).toContain('SkillCooldownReady');
  });

  it('inherits normalized cooldown progress when changing a skill slot', () => {
    const base = skill({
      castId: 'battle-cast',
      skillId: 'battleSkill',
      cooldownFrames: 10,
      costs: [],
      costFrame: 0,
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'changeSkillSlot',
                parameters: {
                  skillGroupKey: 'battleSkill',
                  targetSkillKey: 'battleSkillEnd',
                  inheritOriginSkillCooldownProgress: true,
                },
              },
            ],
          },
        },
      ],
    });
    const end = skill({
      castId: 'battle-cast',
      skillId: 'battleSkillEnd',
      cooldownFrames: 20,
      costs: [],
      costFrame: 0,
    });
    const assembly = createAssembly(
      [base, end],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
      undefined,
      undefined,
      undefined,
      [
        {
          skillGroupKey: 'battleSkill',
          baseSkillKey: 'battleSkill',
          replacementSkillKeys: ['battleSkillEnd'],
        },
      ],
    );

    expect(assembly.tryStartSkill('operator', 'battleSkill', 'battle-cast')).toBe(true);
    assembly.advanceFrames(2);
    expect(
      assembly.receipt.entries.find(entry => entry.event === 'SkillSlotChanged')?.data,
    ).toEqual(
      expect.objectContaining({
        previousSkillKey: 'battleSkill',
        targetSkillKey: 'battleSkillEnd',
        inheritOriginSkillCooldownProgress: true,
        inheritedCooldownProgress: 0,
      }),
    );

    expect(assembly.tryStartSkill('operator', 'battleSkill', 'battle-cast')).toBe(true);
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'SkillCooldownUnavailableAtStart',
        data: expect.objectContaining({ skillId: 'battleSkillEnd' }),
      }),
    );
  });

  it('changes an unplaced skill group without fabricating cooldown ledgers', () => {
    const ultimate = skill({
      castId: 'ultimate-cast',
      skillGroupKey: 'ultimate',
      skillId: 'ultimate',
      skillType: 'ultimate',
      costs: [],
      costFrame: undefined,
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'changeSkillSlot',
                parameters: {
                  skillGroupKey: 'comboSkill',
                  targetSkillKey: 'enhancedComboSkill',
                  inheritOriginSkillCooldownProgress: true,
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly(
      [ultimate],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
      undefined,
      undefined,
      undefined,
      [
        {
          skillGroupKey: 'comboSkill',
          baseSkillKey: 'comboSkill',
          replacementSkillKeys: ['enhancedComboSkill'],
        },
      ],
    );

    expect(assembly.tryStartSkill('operator', 'ultimate', 'ultimate-cast')).toBe(true);
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'SkillSlotChanged',
        data: expect.objectContaining({
          skillGroupKey: 'comboSkill',
          previousSkillKey: 'comboSkill',
          targetSkillKey: 'enhancedComboSkill',
          inheritOriginSkillCooldownProgress: true,
        }),
      }),
    );
  });

  it('rejects conflicting cooldown definitions for placed casts of the same skill', () => {
    expect(() =>
      createAssembly([
        skill({ castId: 'cast:1', cooldownFrames: 10, costs: [], costFrame: 0 }),
        skill({ castId: 'cast:2', cooldownFrames: 20, costs: [], costFrame: 0 }),
      ]),
    ).toThrow("skill 'skill' of 'operator' has inconsistent cooldown configuration");

    expect(() =>
      createAssembly([
        skill({ castId: 'cast:1', cooldownFrames: undefined, costs: [], costFrame: 0 }),
        skill({ castId: 'cast:2', cooldownFrames: 20, costs: [], costFrame: 0 }),
      ]),
    ).toThrow("skill 'skill' of 'operator' has inconsistent cooldown configuration");
  });

  it('routes time-dilation clocks without moving later actual-frame inputs', () => {
    const casterDeltas: Array<{ selfScaledDeltaSeconds: number }> = [];
    const otherDeltas: Array<{ selfScaledDeltaSeconds: number }> = [];
    const makeBuffRuntime = (ownerId: string, sink: Array<{ selfScaledDeltaSeconds: number }>) => ({
      ...emptyEnemyBuffRuntime,
      ownerId,
      advanceWithDeltas: (deltas: { selfScaledDeltaSeconds: number }) => sink.push(deltas),
    });
    const freeze = skill({
      operatorId: 'caster',
      skillId: 'freeze',
      castId: 'freeze-cast',
      costs: [],
      costFrame: undefined,
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'startTimeDilation',
                parameters: {
                  scope: 'global',
                  durationSeconds: { kind: 'constant', value: 1 },
                  slot: 'Test/TimeSlot1',
                  priority: 10,
                  curve: { kind: 'named', key: 'half' },
                  finishByAction: false,
                  ignoredTargets: ['controlled'],
                },
              },
            ],
          },
        },
      ],
    });
    const followUp = skill({ operatorId: 'other', skillId: 'follow-up' });
    const assembly = new CombatRuntimeAssembly({
      enemy: testEnemy,
      resources: {
        sp: 0,
        maxSp: 300,
        returnedSp: 0,
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
        squad: ['caster', 'other'].map(operatorId => ({
          operatorId,
          ultimateEnergy: 0,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          allowedUltimateEnergyRecoveryTags: null,
        })),
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
      operators: [
        {
          operatorId: 'caster',
          skills: [freeze],
          buffRuntime: makeBuffRuntime('caster', casterDeltas),
        },
        {
          operatorId: 'other',
          skills: [followUp],
          buffRuntime: makeBuffRuntime('other', otherDeltas),
        },
      ],
      inputs: [{ frame: 1, operatorId: 'other', skillId: 'follow-up' }],
      timeDilation: {
        config: {
          curves: new Map([['half', () => 0.5]]),
        },
        timeManagerDeltaMode: 2,
      },
      isOperatorControlled: operatorId => operatorId === 'other',
      createOperationExecutor: () => rejectingExecutor,
    });

    expect(assembly.tryStartSkill('caster', 'freeze', 'freeze-cast')).toBe(true);
    expect(
      assembly.receipt.entries.find(entry => entry.event === 'TimeDilationStarted'),
    ).toMatchObject({
      frame: 0,
      sourceId: 'caster',
      data: { kind: 'global', sourceActionId: 'freeze', currentScale: 0.5 },
    });
    assembly.advanceFrame();

    expect(casterDeltas[0]?.selfScaledDeltaSeconds).toBeCloseTo(1 / 60);
    expect(otherDeltas[0]?.selfScaledDeltaSeconds).toBeCloseTo(1 / 30);
    expect(
      assembly.receipt.entries.find(entry => entry.event === 'SkillInputProcessed'),
    ).toMatchObject({
      frame: 1,
      data: { scheduledActualFrame: 1 },
    });

    assembly.advanceFrames(3);

    expect(
      assembly.receipt.entries.find(entry => entry.event === 'SkillOperableBoundaryReached'),
    ).toMatchObject({
      frame: 4,
      sourceId: 'caster',
      data: { castId: 'freeze-cast', durationFrames: 2 },
    });
  });

  it('advances enemy Buff lifetime and periodic triggers with each native clock domain', () => {
    const triggerCounts = new Map([
      ['default', 0],
      ['global', 0],
      ['self', 0],
    ]);
    const definitions = (['default', 'global', 'self'] as const).map(timeClock => ({
      id: `${timeClock}-clock`,
      stackingType: 'unique' as const,
      timeClock,
      durationSeconds: 1 / 30,
      triggerIntervalSeconds: 1 / 60,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      actions: {
        trigger: () => triggerCounts.set(timeClock, triggerCounts.get(timeClock)! + 1),
      },
    }));
    const enemyBuffs = new CombatBuffContainer<string>('enemy', new CombatAttributeSet<string>());
    const enemyBuffRuntime = new BuffDefinitionOperationTarget(enemyBuffs, {
      get: id => definitions.find(definition => definition.id === id),
    });
    for (const definition of definitions) {
      enemyBuffRuntime.apply({
        buffId: definition.id,
        sourceId: 'operator',
        blackboardValues: {},
      });
    }
    const assembly = createAssembly(
      [],
      undefined,
      undefined,
      enemyBuffRuntime,
      undefined,
      undefined,
      {
        config: {},
        timeManagerDeltaMode: 2,
      },
    );
    assembly.timeDilation!.startGlobal({
      durationSeconds: 1,
      slot: 'Test/TimeSlot1',
      priority: 1,
      constantScale: 0.5,
    });
    assembly.timeDilation!.startEntity({
      entityId: 'enemy',
      durationSeconds: 1,
      slot: 'Test/TimeSlot2',
      priority: 1,
      curve: () => 0.5,
    });

    assembly.advanceFrame();

    expect(enemyBuffs.getCountById('default-clock')).toBe(0);
    expect(enemyBuffs.getCountById('global-clock')).toBe(1);
    expect(enemyBuffs.getCountById('self-clock')).toBe(1);
    expect(Object.fromEntries(triggerCounts)).toEqual({ default: 2, global: 1, self: 0 });

    assembly.advanceFrame();

    expect(enemyBuffs.getCountById('global-clock')).toBe(0);
    expect(enemyBuffs.getCountById('self-clock')).toBe(1);
    expect(Object.fromEntries(triggerCounts)).toEqual({ default: 2, global: 2, self: 1 });
  });

  it('installs equipment event handlers and executes their resource sequence', () => {
    const assembly = new CombatRuntimeAssembly({
      enemy: testEnemy,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
      operators: [
        {
          operatorId: 'operator',
          skills: [],
          equipmentContributions: [
            {
              source: { kind: 'weaponTrait', slug: 'fixture-weapon', traitKey: 'skill' },
              selectedLevel: 1,
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
            },
          ],
        },
      ],
      createOperationExecutor: () => rejectingExecutor,
      createEquipmentEventOperationExecutor: () => rejectingExecutor,
    });

    assembly.semanticEvents.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator',
      tags: ['normalSkill'],
    });

    expect(assembly.resources.sp).toBe(10);
    expect(assembly.receipt.entries.at(-1)).toMatchObject({
      event: 'SpChanged',
      sourceId: 'operator',
      data: {
        skillId: 'equipment:weaponTrait:fixture-weapon:gain-sp',
        actualValue: 10,
      },
    });
  });

  it('requires an explicit terminal executor when equipment events are present', () => {
    expect(
      () =>
        new CombatRuntimeAssembly({
          enemy: testEnemy,
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
          enemyBuffRuntime: emptyEnemyBuffRuntime,
          operators: [
            {
              operatorId: 'operator',
              skills: [],
              equipmentContributions: [
                {
                  source: { kind: 'gearSet', slug: 'fixture-set' },
                  selectedLevel: 1,
                  modifiers: [],
                  eventHandlers: [
                    {
                      key: 'handler',
                      event: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'team' },
                      sequence: { steps: [] },
                    },
                  ],
                },
              ],
            },
          ],
          createOperationExecutor: () => rejectingExecutor,
        }),
    ).toThrow("operator 'operator' has equipment event handlers but no equipment event executor");
  });

  it('executes inline Buff lifecycle steps through the originating cast operation chain', () => {
    const buffs = new CombatBuffContainer<string>('operator', new CombatAttributeSet<string>());
    const buffRuntime = new BuffDefinitionOperationTarget(buffs, {
      get: () => undefined,
      compile: entry => ({
        id: entry.id,
        stackingType: entry.stackingType,
        durationSeconds: entry.durationSeconds,
      }),
    });
    const program = skill({
      castId: 'cast-1',
      costFrame: undefined,
      costs: [],
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'applyBuff',
                parameters: {
                  buffId: 'resource-buff',
                  target: 'caster',
                  inheritSourceSkillCastInfo: true,
                  definition: {
                    stackingType: 'unique',
                    lifecycleSequences: {
                      start: {
                        steps: [
                          {
                            kind: 'changeResource',
                            parameters: {
                              resource: 'sp',
                              amount: 20,
                              recipient: 'team',
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly(
      [program],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      () => buffRuntime,
    );

    expect(assembly.tryStartSkill('operator', 'skill', 'cast-1')).toBe(true);
    expect(assembly.resources.sp).toBe(120);
    expect(buffs.buffs[0]?.skillCastInfo).toMatchObject({
      originSkillId: 'skill',
      originCastId: 'cast-1',
    });
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({ event: 'SpChanged', sourceId: 'operator' }),
    );
  });

  it('dispatches a successful Buff application to an active skill listener', () => {
    const buffs = new CombatBuffContainer<string>('operator', new CombatAttributeSet<string>());
    const buffRuntime = new BuffDefinitionOperationTarget(buffs, {
      get: () => undefined,
      compile: entry => ({ id: entry.id, stackingType: entry.stackingType }),
    });
    const program = skill({
      costFrame: undefined,
      costs: [],
      timelineActions: [
        {
          startFrame: 0,
          endFrame: 2,
          sequence: {
            steps: [
              {
                kind: 'listenForCombatEvents',
                parameters: {
                  responses: [
                    {
                      key: 'on-added-buff',
                      event: { kind: 'buffApplied' },
                      condition: { kind: 'eventBuffIdMatch', buffIds: ['watched-buff'] },
                      sequence: {
                        steps: [
                          {
                            kind: 'changeResource',
                            parameters: {
                              resource: 'sp',
                              amount: 7,
                              recipient: 'team',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: 'applyBuff',
                parameters: {
                  buffId: 'watched-buff',
                  target: 'caster',
                  definition: { stackingType: 'unique' },
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly(
      [program],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      () => buffRuntime,
    );

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);
    expect(assembly.resources.sp).toBe(107);
  });

  it('keeps passive combat event listeners active after their enable sequence completes', () => {
    const program = skill({
      costFrame: undefined,
      costs: [],
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'changeResource',
                parameters: {
                  resource: 'sp',
                  amount: 10,
                  recipient: 'team',
                  spGainKind: 'gain',
                  spGainSource: 'skill',
                },
              },
            ],
          },
        },
      ],
    });
    const passivePrograms: readonly CompiledOperatorPassiveProgram[] = [
      {
        key: 'skill-sp-listener',
        initialBlackboard: {},
        enableSequence: {
          steps: [
            {
              kind: 'listenForCombatEvents',
              parameters: {
                responses: [
                  {
                    key: 'on-skill-sp',
                    event: { kind: 'spGained', source: 'skill', gainKind: 'gain' },
                    phase: 'dataAction',
                    priority: 0,
                    sequence: {
                      steps: [
                        {
                          kind: 'changeResource',
                          parameters: {
                            resource: 'ultimateEnergy',
                            amount: 9,
                            recipient: 'caster',
                          },
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
    ];
    const assembly = createAssembly(
      [program],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      testEnemy,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      passivePrograms,
    );

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);
    expect(assembly.resources.getUltimateEnergy('operator')).toBe(9);
  });

  it('dispatches active airborne output before continuing the authored sequence', () => {
    const program = skill({
      costFrame: undefined,
      costs: [],
      timelineActions: [
        {
          startFrame: 0,
          endFrame: 2,
          sequence: {
            steps: [
              {
                kind: 'listenForCombatEvents',
                parameters: {
                  responses: [
                    {
                      key: 'before-output-airborne',
                      event: { kind: 'airborneOutput' },
                      sequence: {
                        steps: [
                          {
                            kind: 'changeResource',
                            parameters: { resource: 'sp', amount: 9, recipient: 'team' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              { kind: 'outputAirborne', parameters: { target: 'enemy' } },
              {
                kind: 'changeResource',
                parameters: { resource: 'sp', amount: 1, recipient: 'team' },
              },
            ],
          },
        },
      ],
    });
    const assembly = createAssembly([program]);

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);
    expect(assembly.resources.sp).toBe(110);
    expect(
      assembly.receipt.entries
        .map(entry => entry.event)
        .filter(event => event === 'AirborneOutput' || event === 'SpChanged'),
    ).toEqual(['AirborneOutput', 'SpChanged', 'SpChanged']);
  });

  it('executes party Buff lifecycle steps relative to each actual operator owner', () => {
    const sourceBuffs = new CombatBuffContainer<string>('source', new CombatAttributeSet<string>());
    const allyBuffs = new CombatBuffContainer<string>('ally', new CombatAttributeSet<string>());
    const createBuffRuntime = (container: CombatBuffContainer<string>) =>
      new BuffDefinitionOperationTarget(container, {
        get: () => undefined,
        compile: entry => ({ id: entry.id, stackingType: entry.stackingType }),
      });
    const sourceBuffRuntime = createBuffRuntime(sourceBuffs);
    const allyBuffRuntime = createBuffRuntime(allyBuffs);
    const program = skill({
      operatorId: 'source',
      castId: 'party-cast',
      costFrame: undefined,
      costs: [],
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'applyBuff',
                parameters: {
                  buffId: 'party-owner-buff',
                  target: 'party',
                  inheritSourceSkillCastInfo: true,
                  definition: {
                    stackingType: 'unique',
                    lifecycleSequences: {
                      start: {
                        steps: [
                          {
                            kind: 'changeResource',
                            parameters: {
                              resource: 'ultimateEnergy',
                              amount: 10,
                              recipient: 'caster',
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = new CombatRuntimeAssembly({
      enemy: testEnemy,
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
            operatorId: 'source',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            allowedUltimateEnergyRecoveryTags: null,
          },
          {
            operatorId: 'ally',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
      operators: [
        { operatorId: 'source', skills: [program], buffRuntime: sourceBuffRuntime },
        { operatorId: 'ally', skills: [], buffRuntime: allyBuffRuntime },
      ],
      createOperationExecutor: () => rejectingExecutor,
    });

    expect(assembly.tryStartSkill('source', 'skill', 'party-cast')).toBe(true);
    expect(sourceBuffs.buffs).toHaveLength(1);
    expect(allyBuffs.buffs).toHaveLength(1);
    expect(assembly.resources.snapshot().squad).toEqual([
      expect.objectContaining({ operatorId: 'source', ultimateEnergy: 10 }),
      expect.objectContaining({ operatorId: 'ally', ultimateEnergy: 10 }),
    ]);
    expect(
      assembly.receipt.entries.filter(entry => entry.event === 'UltimateEnergyChanged'),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sourceId: 'source', targetId: 'source' }),
        expect.objectContaining({ sourceId: 'ally', targetId: 'ally' }),
      ]),
    );
  });

  it.each(['equipment', 'missing-root', 'upgrade'] as const)(
    'initialization child Buff requires its equipment Ability root (%s)',
    owner => {
      const buffs = new CombatBuffContainer<string>('operator', new CombatAttributeSet<string>());
      const buffRuntime = new BuffDefinitionOperationTarget(buffs, {
        get: () => undefined,
        compile: entry => ({ id: entry.id, stackingType: entry.stackingType }),
      });
      const sequence = {
        steps: [
          {
            kind: 'applyBuff',
            parameters: {
              buffId: 'equipment-child',
              target: 'caster',
              ...(owner === 'upgrade' ? {} : { source: 'eventSource' as const }),
              asChildBuff: true,
              definition: { stackingType: 'unique' },
            },
          },
        ],
      } as const;
      const create = () =>
        new CombatRuntimeAssembly({
          enemy: testEnemy,
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
          enemyBuffRuntime: emptyEnemyBuffRuntime,
          operators: [
            {
              operatorId: 'operator',
              skills: [],
              buffRuntime,
              equipmentContributions: [
                {
                  source: { kind: 'weaponTrait', slug: 'fixture', traitKey: 'skill' },
                  selectedLevel: 1,
                  modifiers: [],
                  eventHandlers: [],
                  initializationSequence: sequence,
                },
              ],
              initializationPrograms: [
                {
                  key: 'fixture',
                  sequence,
                  ...(owner === 'upgrade'
                    ? {}
                    : {
                        equipmentContributionIndex: owner === 'equipment' ? 0 : 99,
                      }),
                },
              ],
            },
          ],
          createOperationExecutor: () => rejectingExecutor,
          // Initialization-only Ability must not require an event terminal executor.
        });
      if (owner !== 'equipment') {
        expect(create).toThrow(
          owner === 'upgrade'
            ? 'requires a Buff, Ability, or Skill owner context'
            : "equipment Ability '99' is not active",
        );
        return;
      }
      const assembly = create();
      expect(buffs.buffs).toHaveLength(1);
      const child = buffs.buffs[0]!;
      expect(child.sourceId).toBe('operator');
      expect(child.isFinished).toBe(false);
      expect(assembly.receipt.entries).toContainEqual(
        expect.objectContaining({
          event: 'OperatorUpgradeInitialized',
          frame: 0,
        }),
      );
    },
  );

  it('enables compiled passive programs once after Buff runtimes are configured', () => {
    const buffs = new CombatBuffContainer<string>('operator', new CombatAttributeSet<string>());
    const buffRuntime = new BuffDefinitionOperationTarget(buffs, {
      get: () => undefined,
      compile: entry => ({ id: entry.id, stackingType: entry.stackingType }),
    });
    const assembly = new CombatRuntimeAssembly({
      enemy: testEnemy,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
      operators: [
        {
          operatorId: 'operator',
          skills: [],
          buffRuntime,
          initializationPrograms: [
            {
              key: 'potential:potential1',
              sequence: {
                steps: [
                  {
                    kind: 'applyBuff',
                    parameters: {
                      buffId: 'potential-marker',
                      target: 'caster',
                      definition: {
                        stackingType: 'unique',
                        blackboard: { ratio: 0.5 },
                      },
                      blackboardAssignments: {
                        ratio: { kind: 'constant', value: 0.5 },
                      },
                    },
                  },
                ],
              },
            },
          ],
          passivePrograms: [
            {
              key: 'talent-aura',
              initialBlackboard: { attackIncrease: 0.2 },
              enableSequence: {
                steps: [
                  {
                    kind: 'applyBuff',
                    parameters: {
                      buffId: 'talent-aura',
                      target: 'caster',
                      definition: {
                        stackingType: 'unique',
                        lifecycleSequences: {
                          start: {
                            steps: [
                              {
                                kind: 'changeResource',
                                parameters: {
                                  resource: 'sp',
                                  amount: 20,
                                  recipient: 'team',
                                },
                              },
                            ],
                          },
                        },
                      },
                      blackboardAssignments: {
                        attackIncrease: { kind: 'blackboard', key: 'attackIncrease' },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
      createOperationExecutor: () => rejectingExecutor,
    });

    expect(buffs.buffs).toHaveLength(2);
    expect(buffs.buffs[0]?.sourceActionId).toBe('upgrade-initialization:potential:potential1');
    expect(buffs.buffs[0]?.blackboard.getNumber('ratio')).toBeCloseTo(0.5);
    expect(buffs.buffs[1]?.sourceActionId).toBe('passive:talent-aura');
    expect(buffs.buffs[1]?.blackboard.getNumber('attackIncrease')).toBeCloseTo(0.2);
    expect(assembly.resources.sp).toBe(20);
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({ event: 'SpChanged', sourceId: 'operator' }),
    );
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        frame: 0,
        event: 'OperatorUpgradeInitialized',
        sourceId: 'operator',
        data: { key: 'potential:potential1' },
      }),
    );
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        frame: 0,
        event: 'PassiveSkillEnabled',
        sourceId: 'operator',
        data: { passiveKey: 'talent-aura' },
      }),
    );
  });

  it('executes operator upgrade reaction events through the shared Buff runtime', () => {
    const attributes = new CombatAttributeSet<string>();
    attributes.define('Atk', 500, { minimum: 0, maximum: 10000 });
    const buffs = new CombatBuffContainer<string>('operator', attributes);
    const buffRuntime = new BuffDefinitionOperationTarget(buffs, {
      get: () => undefined,
      compile: entry =>
        new CompiledCombatBuffDefinitions('test', [entry], {
          emitElementalInflictionStarted: () => undefined,
        }).get(entry.id)!,
    });
    const assembly = new CombatRuntimeAssembly({
      enemy: testEnemy,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
      operators: [
        {
          operatorId: 'operator',
          skills: [],
          buffRuntime,
          upgradeEventPrograms: [
            {
              key: 'potential:attackAfterElectrification:0',
              event: { kind: 'reactionApplied', reaction: 'electrification' },
              initialBlackboard: {},
              sequence: {
                steps: [
                  {
                    kind: 'applyBuff',
                    parameters: {
                      buffId: 'attack-up',
                      target: 'caster',
                      definition: {
                        stackingType: 'enhanceAndRefresh',
                        maxStackCount: 2,
                        durationSeconds: 5,
                        attributeModifiers: [
                          { attribute: 'Atk', slot: 'baseMultiplier', value: 0.2 },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
      createOperationExecutor: () => rejectingExecutor,
    });

    const event = {
      kind: 'reactionApplied' as const,
      sourceOperatorId: 'operator',
      reaction: 'electrification' as const,
    };
    assembly.semanticEvents.emit(event);
    expect(attributes.get('Atk')).toBe(600);
    assembly.semanticEvents.emit(event);
    expect(attributes.get('Atk')).toBe(700);
    expect(buffs.getCountByIds(['attack-up'])).toBe(2);
  });

  it('executes operator upgrade events only for actual skill-source SP gains', () => {
    const attributes = new CombatAttributeSet<string>();
    attributes.define('Atk', 500, { minimum: 0, maximum: 10000 });
    const buffs = new CombatBuffContainer<string>('operator', attributes);
    const buffRuntime = new BuffDefinitionOperationTarget(buffs, {
      get: () => undefined,
      compile: entry =>
        new CompiledCombatBuffDefinitions('test', [entry], {
          emitElementalInflictionStarted: () => undefined,
        }).get(entry.id)!,
    });
    const gainSkill = skill({
      skillId: 'sp-skill',
      costs: [],
      costFrame: undefined,
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'changeResource',
                parameters: {
                  resource: 'sp',
                  amount: 20,
                  recipient: 'team',
                  spGainKind: 'gain',
                  spGainSource: 'skill',
                },
              },
            ],
          },
        },
      ],
    });
    const assembly = new CombatRuntimeAssembly({
      enemy: testEnemy,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
      operators: [
        {
          operatorId: 'operator',
          skills: [gainSkill],
          buffRuntime,
          initializationPrograms: [
            {
              key: 'skill-sp-buff-listener',
              sequence: {
                steps: [
                  {
                    kind: 'applyBuff',
                    parameters: {
                      buffId: 'skill-sp-listener',
                      target: 'caster',
                      definition: {
                        stackingType: 'unique',
                        abilityEventResponses: [
                          {
                            event: 'skillSpGained',
                            priority: 0,
                            sequence: {
                              steps: [
                                {
                                  kind: 'applyBuff',
                                  parameters: {
                                    buffId: 'skill-sp-listener-attack',
                                    target: 'caster',
                                    definition: {
                                      stackingType: 'unique',
                                      attributeModifiers: [
                                        {
                                          attribute: 'Atk',
                                          slot: 'baseMultiplier',
                                          value: 0.1,
                                        },
                                      ],
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
          upgradeEventPrograms: [
            {
              key: 'potential:skill-sp-attack:0',
              event: { kind: 'spGained', source: 'skill', gainKind: 'gain' },
              initialBlackboard: {},
              sequence: {
                steps: [
                  {
                    kind: 'applyBuff',
                    parameters: {
                      buffId: 'skill-sp-attack',
                      target: 'caster',
                      definition: {
                        stackingType: 'enhanceAndRefresh',
                        maxStackCount: 5,
                        durationSeconds: 10,
                        attributeModifiers: [
                          { attribute: 'Atk', slot: 'baseMultiplier', value: 0.1 },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
      createOperationExecutor: () => rejectingExecutor,
    });

    expect(assembly.tryStartSkill('operator', 'sp-skill')).toBe(true);
    assembly.advanceFrame();
    expect(assembly.resources.sp).toBe(20);
    expect(attributes.get('Atk')).toBe(600);
    expect(buffs.getCountByIds(['skill-sp-attack'])).toBe(1);
    expect(buffs.getCountByIds(['skill-sp-listener-attack'])).toBe(1);
  });

  it('opens and consumes the matching combo window without blocking other skills', () => {
    const opener = skill({
      skillId: 'combo-stage-1',
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'openComboWindow',
                parameters: { nextSkillKey: 'combo-stage-2' },
              },
            ],
          },
        },
      ],
    });
    const stage2 = skill({ skillId: 'combo-stage-2', skillType: 'comboSkill' });
    const unrelated = skill({ skillId: 'unrelated' });
    const assembly = createAssembly([opener, stage2, unrelated]);

    expect(assembly.tryStartSkill('operator', 'combo-stage-1')).toBe(true);
    expect(assembly.comboWindows.first?.nextSkillKey).toBe('combo-stage-2');

    expect(assembly.tryStartSkill('operator', 'unrelated')).toBe(true);
    expect(assembly.comboWindows.first?.nextSkillKey).toBe('combo-stage-2');

    expect(assembly.tryStartSkill('operator', 'combo-stage-2')).toBe(true);
    expect(assembly.comboWindows.first).toBeUndefined();
    expect(
      assembly.receipt.entries.some(entry => entry.event === 'ComboWindowUnavailableAtStart'),
    ).toBe(false);
  });

  it('installs operator combo registrations once and opens a window from a semantic event', () => {
    const assembly = new CombatRuntimeAssembly({
      enemy: testEnemy,
      resources: {
        sp: 100,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
      operators: [
        {
          operatorId: 'operator',
          skills: [],
          comboSkillRegistrations: [
            {
              skillKey: 'comboSkill',
              priority: 'default',
              blackboard: { coefficient: 1.5 },
              rules: [
                {
                  trigger: {
                    kind: 'damageTagHit',
                    tag: 'normalAttackLastCombo',
                    scope: 'team',
                  },
                },
              ],
            },
          ],
        },
      ],
      createOperationExecutor: () => rejectingExecutor,
    });

    assembly.semanticEvents.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'another-operator',
      tags: ['normalAttackLastCombo'],
    });

    expect(assembly.comboWindows.first).toMatchObject({
      operatorId: 'operator',
      nextSkillKey: 'comboSkill',
      blackboard: { coefficient: 1.5 },
    });
    expect(
      assembly.receipt.entries.filter(entry => entry.event === 'ComboWindowOpened'),
    ).toHaveLength(1);
  });

  it('records a diagnostic fact but still starts a combo skill without a window', () => {
    const combo = skill({ skillId: 'comboSkill', skillType: 'comboSkill' });
    const assembly = createAssembly([combo]);

    expect(assembly.tryStartSkill('operator', 'comboSkill')).toBe(true);
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'ComboWindowUnavailableAtStart',
        sourceId: 'operator',
        data: expect.objectContaining({ skillId: 'comboSkill', reason: 'windowMissing' }),
      }),
    );
  });

  it('advances an environment-created operator Buff runtime as the ability-system owner', () => {
    const advanceFrame = vi.fn();
    const operatorBuffRuntime = {
      ...emptyEnemyBuffRuntime,
      ownerId: 'operator',
      advanceFrame,
    };
    const createOperatorBuffRuntime = vi.fn(() => operatorBuffRuntime);
    const assembly = createAssembly(
      [],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      createOperatorBuffRuntime,
    );

    assembly.advanceFrames(3);
    expect(createOperatorBuffRuntime).toHaveBeenCalledOnce();
    expect(createOperatorBuffRuntime).toHaveBeenCalledWith('operator', undefined, undefined);
    expect(advanceFrame).toHaveBeenCalledTimes(3);
  });

  it('advances the enemy Buff runtime once per combat frame', () => {
    const advanceFrame = vi.fn();
    const assembly = createAssembly([], undefined, undefined, {
      ...emptyEnemyBuffRuntime,
      advanceFrame,
    });

    assembly.advanceFrames(3);
    expect(advanceFrame).toHaveBeenCalledTimes(3);
  });

  it('rejects an enemy Buff runtime with a mismatched owner', () => {
    expect(() =>
      createAssembly([], undefined, undefined, {
        ...emptyEnemyBuffRuntime,
        ownerId: 'operator',
      }),
    ).toThrow("enemy Buff runtime owner must be 'enemy'");
  });

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

  it('evaluates rank conditions from the compiled scenario enemy', () => {
    const program = skill({
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: { condition: { kind: 'enemyRankIn', ranks: ['elite', 'boss'] } },
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
    const assembly = createAssembly(
      [program],
      undefined,
      undefined,
      emptyEnemyBuffRuntime,
      undefined,
      { ...testEnemy, rank: 'elite' },
    );

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
      enemy: testEnemy,
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
      enemyBuffRuntime: emptyEnemyBuffRuntime,
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
      'SkillEnded',
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
        durationSeconds: 1 / 30,
        applyTags: [path],
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
                    buffTags: [path],
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
      enemy: testEnemy,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: asBuffRuntime(enemyBuffs),
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
    assembly.advanceFrame();
    expect(enemyBuffs.getCountById('conduct')).toBe(0);
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
      enemy: testEnemy,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
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
      enemy: testEnemy,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
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
      enemy: testEnemy,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
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
      enemy: testEnemy,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
          {
            operatorId: 'operator-b',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
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

  it.each([
    {
      target: 'casterAndControlledOperator' as const,
      operatorIds: ['operator-a', 'operator-b', 'operator-c'],
      expected: ['operator-a', 'operator-c'],
    },
    {
      target: 'casterAndLowestHealthRatioOperatorExceptCaster' as const,
      operatorIds: ['operator-a', 'operator-b', 'operator-c'],
      expected: ['operator-a', 'operator-b'],
    },
    {
      target: 'casterAndLowestHealthRatioOperatorExceptCaster' as const,
      operatorIds: ['operator-a'],
      expected: ['operator-a'],
    },
  ])(
    'routes the proven teammate collection $target with $operatorIds',
    ({ target, operatorIds, expected }) => {
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
      const createVitals = (health: number) =>
        new CombatVitals({
          health,
          maxHealth: 100,
          maxPoise: 0,
          poise: 0,
          poiseRecoveryTime: 0,
          poiseRecoveryTimeMultiplier: 1,
          poiseBrokenEndTime: 0,
          poiseImmune: false,
        });
      const vitals = new Map([
        ['operator-a', createVitals(100)],
        ['operator-b', createVitals(20)],
        ['operator-c', createVitals(80)],
      ]);
      const program = skill({
        operatorId: 'operator-a',
        costFrame: undefined,
        costs: [],
        timelineActions: [
          {
            startFrame: 0,
            sequence: {
              steps: [{ kind: 'applyBuff', parameters: { buffId: 'shield', target } }],
            },
          },
        ],
      });
      const assembly = new CombatRuntimeAssembly({
        enemy: testEnemy,
        resources: {
          sp: 0,
          maxSp: 300,
          returnedSp: 0,
          sharedSpGain: { baseGainEfficiency: 1 },
          spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
          squad: operatorIds.map(operatorId => ({
            operatorId,
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            allowedUltimateEnergyRecoveryTags: null,
          })),
        },
        enemyBuffRuntime: emptyEnemyBuffRuntime,
        operators: operatorIds.map(operatorId => ({
          operatorId,
          skills: operatorId === 'operator-a' ? [program] : [],
          buffRuntime: createBuffRuntime(operatorId),
        })),
        isOperatorControlled:
          target === 'casterAndControlledOperator'
            ? operatorId => operatorId === 'operator-c'
            : undefined,
        resolveOperatorVitals:
          operatorIds.length > 1 ? operatorId => vitals.get(operatorId)! : undefined,
        createOperationExecutor: () => rejectingExecutor,
      });

      expect(assembly.tryStartSkill('operator-a', 'skill')).toBe(true);
      expect(appliedTo).toEqual(expected);
    },
  );

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
      enemy: testEnemy,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
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
      enemy: testEnemy,
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
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
      operators: [
        {
          operatorId: 'operator',
          skills: [program],
          skillSlotGroups: [
            {
              skillGroupKey: 'battleSkill',
              baseSkillKey: 'skill',
              replacementSkillKeys: [],
            },
          ],
          playerActionRoutes: {
            battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
          },
        },
      ],
      inputs: [{ frame: 1, operatorId: 'operator', skillId: 'skill', action: 'battleSkill' }],
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
      'SkillEnded',
    ]);
  });
});
