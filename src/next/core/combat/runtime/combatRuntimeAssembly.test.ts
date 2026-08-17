import { describe, expect, it, vi } from 'vitest';
import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer } from '../buffs/combatBuffs';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { GameplayTagRegistry, gameplayTagIdFromPath } from '../tags/gameplayTags';
import { CombatStatusContainer } from '../status/combatStatuses';
import { CombatRuntimeAssembly, type CombatEnemyProgram } from './combatRuntimeAssembly';
import { BuffDefinitionOperationTarget } from './buffDefinitionOperationTarget';
import { ActionBlackboard } from './actionBlackboard';
import { CombatVitals } from './combatVitals';
import type { CombatOperationExecutor } from './skillRuntime';
import {
  logicalAbilityEntityRuntimeId,
  type LogicalAbilityEntityTemplate,
  type RuntimeTargetRef,
} from '../../game-data/logicalAbilityEntity';

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
  abilityEntityTemplates: readonly LogicalAbilityEntityTemplate[] = [],
  timeDilation?: ConstructorParameters<typeof CombatRuntimeAssembly>[0]['timeDilation'],
  createAbilityEntityBuffRuntime?: ConstructorParameters<
    typeof CombatRuntimeAssembly
  >[0]['createAbilityEntityBuffRuntime'],
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
          allowedUltimateEnergyRecoveryTagIds: null,
        },
      ],
    },
    enemyBuffRuntime,
    abilityEntityTemplates,
    ...(timeDilation === undefined ? {} : { timeDilation }),
    operators: [{ operatorId: 'operator', skills: programs }],
    createOperationExecutor: () => rejectingExecutor,
    ...(createOperatorBuffRuntime === undefined ? {} : { createOperatorBuffRuntime }),
    ...(createAbilityEntityBuffRuntime === undefined ? {} : { createAbilityEntityBuffRuntime }),
    ...(isOperatorControlled === undefined ? {} : { isOperatorControlled }),
    ...(resolveVitals === undefined ? {} : { resolveVitals }),
  });
}

describe('CombatRuntimeAssembly', () => {
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
                  templateId: 'fixture_entity',
                  childSkillId: 'fixture_child',
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
      [
        {
          id: 'fixture_entity',
          bornTagIds: [],
          lifetime: { kind: 'limited', durationSeconds: 5 },
          maxStackingCount: -1,
        },
      ],
    );

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);
    expect(assembly.abilityEntities.activeCount).toBe(1);
    expect(assembly.receipt.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: 'AbilityEntitySpawned',
          sourceId: 'operator',
          data: expect.objectContaining({
            templateId: 'fixture_entity',
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
      [
        {
          id: 'fixture_entity',
          bornTagIds: [],
          lifetime: { kind: 'limited', durationSeconds: 1 },
          maxStackingCount: -1,
        },
      ],
      {
        config: { priorities: new Map([[10, 10]]) },
        timeManagerDeltaMode: 0,
      },
    );
    const entity = assembly.abilityEntities.spawn({
      templateId: 'fixture_entity',
      ownerId: 'operator',
      source: { kind: 'operator', operatorId: 'operator' },
    });
    if (entity.kind !== 'abilityEntity') throw new Error('spawn must return an AbilityEntity');
    assembly.timeDilation!.startEntity({
      entityId: logicalAbilityEntityRuntimeId(entity.instanceId),
      durationSeconds: 10,
      slot: 1,
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
                  templateId: 'fixture_entity',
                  childSkillId: 'fixture_child',
                  dieWhenSourceDies: false,
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
      [
        {
          id: 'fixture_entity',
          bornTagIds: [],
          lifetime: { kind: 'limited', durationSeconds: 10 },
          maxStackingCount: -1,
        },
      ],
      {
        config: { priorities: new Map([[10, 10]]) },
        timeManagerDeltaMode: 0,
      },
    );

    expect(assembly.tryStartSkill('operator', 'skill')).toBe(true);
    const [entity] = assembly.abilityEntities.findAll();
    if (entity?.kind !== 'abilityEntity') throw new Error('spawn must return an AbilityEntity');
    assembly.timeDilation!.startEntity({
      entityId: logicalAbilityEntityRuntimeId(entity.instanceId),
      durationSeconds: 10,
      slot: 1,
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
                  templateId: 'buff-host',
                  childSkillId: 'buff-child',
                  dieWhenSourceDies: false,
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
      [
        {
          id: 'buff-host',
          bornTagIds: [],
          lifetime: { kind: 'limited', durationSeconds: 10 },
          maxStackingCount: -1,
        },
      ],
      undefined,
      createAbilityEntityBuffRuntime,
    );

    expect(assembly.tryStartSkill('operator', 'skill', 'entity-buff-cast')).toBe(true);
    expect(createAbilityEntityBuffRuntime).toHaveBeenCalledOnce();
    expect(entityBuffs?.buffs).toHaveLength(1);
    expect(assembly.abilityEntities.activeCount).toBe(1);
    assembly.advanceFrames(1);
    expect(assembly.abilityEntities.activeCount).toBe(0);
    expect(entityBuffs?.buffs[0]?.isFinished).toBe(true);
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'AbilityEntityFinished',
        data: expect.objectContaining({ reason: 'explicit' }),
      }),
    );
  });

  it('resolves owner/tag AbilityEntity targets through the assembled time-dilation chain', () => {
    const marked = gameplayTagIdFromPath('AbilityEntity/Test/Marked');
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
                  slot: 1,
                  priority: 10,
                  curve: { kind: 'named', key: 'half' },
                  finishByAction: false,
                  targets: [],
                  abilityEntityTargets: [
                    {
                      kind: 'ownerSpawned',
                      tagQuery: { type: 'hasAny', tagIds: [marked] },
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
      [
        {
          id: 'marked',
          bornTagIds: [marked],
          lifetime: { kind: 'limited', durationSeconds: 2 },
          maxStackingCount: -1,
        },
        {
          id: 'plain',
          bornTagIds: [],
          lifetime: { kind: 'limited', durationSeconds: 2 },
          maxStackingCount: -1,
        },
      ],
      {
        config: {
          priorities: new Map([[10, 10]]),
          curves: new Map([['half', () => 0.5]]),
        },
        timeManagerDeltaMode: 0,
      },
    );
    const markedEntity = assembly.abilityEntities.spawn({
      templateId: 'marked',
      ownerId: 'operator',
      source: { kind: 'operator', operatorId: 'operator' },
    });
    assembly.abilityEntities.spawn({
      templateId: 'plain',
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

  it('routes time-dilation clocks through the assembled ability systems', () => {
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
                  slot: 1,
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
          allowedUltimateEnergyRecoveryTagIds: null,
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
          priorities: new Map([[10, 10]]),
          curves: new Map([['half', () => 0.5]]),
        },
        timeManagerDeltaMode: 2,
      },
      isOperatorControlled: operatorId => operatorId === 'other',
      createOperationExecutor: () => rejectingExecutor,
    });

    expect(assembly.tryStartSkill('caster', 'freeze')).toBe(true);
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
    expect(assembly.receipt.entries.some(entry => entry.event === 'SkillInputProcessed')).toBe(
      false,
    );

    assembly.advanceFrame();

    expect(
      assembly.receipt.entries.find(entry => entry.event === 'SkillInputProcessed'),
    ).toMatchObject({ frame: 2, data: { timelineFrame: 1 } });
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
            allowedUltimateEnergyRecoveryTagIds: null,
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
            allowedUltimateEnergyRecoveryTagIds: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
      operators: [
        {
          operatorId: 'operator',
          skills: [],
          buffRuntime,
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

    expect(buffs.buffs).toHaveLength(1);
    expect(buffs.buffs[0]?.sourceActionId).toBe('passive:talent-aura');
    expect(buffs.buffs[0]?.blackboard.getNumber('attackIncrease')).toBeCloseTo(0.2);
    expect(assembly.resources.sp).toBe(20);
    expect(assembly.receipt.entries).toContainEqual(
      expect.objectContaining({ event: 'SpChanged', sourceId: 'operator' }),
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
            allowedUltimateEnergyRecoveryTagIds: null,
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
    expect(createOperatorBuffRuntime).toHaveBeenCalledWith('operator', undefined);
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
            allowedUltimateEnergyRecoveryTagIds: null,
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
            allowedUltimateEnergyRecoveryTagIds: null,
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
            allowedUltimateEnergyRecoveryTagIds: null,
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
            allowedUltimateEnergyRecoveryTagIds: null,
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
            allowedUltimateEnergyRecoveryTagIds: null,
          },
          {
            operatorId: 'operator-b',
            ultimateEnergy: 0,
            maxUltimateEnergy: 100,
            ultimateEnergyGainMultiplier: 1,
            allowedUltimateEnergyRecoveryTagIds: null,
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
            allowedUltimateEnergyRecoveryTagIds: null,
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
            allowedUltimateEnergyRecoveryTagIds: null,
          },
        ],
      },
      enemyBuffRuntime: emptyEnemyBuffRuntime,
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
      'SkillEnded',
    ]);
  });
});
