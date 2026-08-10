import { describe, expect, it } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { CombatBuffDefinitionsDocument } from '../buffs/combatBuffDefinitions';
import type { SkillSettingsDocument } from '../infliction/skillSettings';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { CombatResources } from './combatResources';
import type { CombatOperationExecutorContext } from './combatRuntimeAssembly';
import { StandardPlayerDamageEnvironment } from './standardPlayerDamageEnvironment';

const damageStep: Extract<ResolvedCombatStep, { kind: 'dealDamage' }> = {
  kind: 'dealDamage',
  parameters: { damageType: 'electric', attackScale: 1, tags: ['normalSkill'] },
};

function createContext(): CombatOperationExecutorContext {
  return {
    program: {
      operatorId: 'operator',
      skillGroupKey: 'battleSkill',
      skillId: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 1,
      initialBlackboard: {},
      timelineBlockFrames: 1,
      costs: [],
      timelineActions: [],
    },
    enemy: {
      source: { kind: 'custom', level: 90 },
      health: 10000,
      superArmor: 0,
      defenderAttributes: {
        defense: 200,
        shelterDamageMultiplier: 0,
        breakingAttackDamageTakenMultiplier: 1,
        resistances: {
          physical: { percent: 0, damageTakenMultiplier: 1 },
          heat: { percent: 0, damageTakenMultiplier: 1 },
          electric: { percent: 20, damageTakenMultiplier: 1 },
          cryo: { percent: 0, damageTakenMultiplier: 1 },
          nature: { percent: 0, damageTakenMultiplier: 1 },
          ether: { percent: 0, damageTakenMultiplier: 1 },
        },
      },
      stagger: {
        maximum: 300,
        nodeCount: 1,
        nodeDurationFrames: 60,
        brokenDurationFrames: 300,
        finisherRecovery: 100,
      },
    },
    panel: {
      operatorId: 'operator',
      attributes: { strength: 0, agility: 0, intellect: 0, will: 0 },
      attack: 700,
      health: 5000,
      defense: 0,
      criticalRate: 0.15,
      criticalDamage: 0.6,
      artsIntensity: 0,
      ultimateEnergyGainEfficiency: 1,
      skillCooldownReduction: 0,
      staggerDamagePercent: 0,
      combatModifiers: [
        { kind: 'damageBonus', damageTypes: 'electric', skillTypes: 'battleSkill', value: 0.2 },
      ],
      receipt: [],
    },
    equipmentContributions: [],
    clock: new CombatClock(),
    resources: new CombatResources({
      sp: 0,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: false,
      normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
      squad: [],
    }),
    receipt: new CombatReceiptCollector(),
  };
}

function createEnvironment(): StandardPlayerDamageEnvironment {
  return new StandardPlayerDamageEnvironment({
    criticalSamples: { nextCriticalSample: () => 1 },
    resolveNonRandomRuntimeSnapshot: () => ({
      runtimeExtensionMultiplier: 1,
      appliesIgniteDamageMultiplier: false,
      appliesPhysicalInflictionDamageMultiplier: false,
    }),
  });
}

function createInflictionEnvironment(): StandardPlayerDamageEnvironment {
  const document: CombatBuffDefinitionsDocument = {
    schemaVersion: 1,
    revision: 'test',
    buffs: [
      {
        id: 'attachment.electric',
        stackingType: 'enhanceAndRefresh',
        stackingKey: 'attachment.electric',
        maxStackCount: 4,
        durationSeconds: 10,
        role: { kind: 'elementalAttachment', element: 'electric' },
        actions: { afterEnhance: [{ kind: 'emitElementalInflictionStarted' }] },
      },
      {
        id: 'burst.electric',
        stackingType: 'unlimited',
        role: { kind: 'elementalBurst', element: 'electric' },
      },
    ],
  };
  return new StandardPlayerDamageEnvironment({
    criticalSamples: { nextCriticalSample: () => 1 },
    resolveNonRandomRuntimeSnapshot: () => ({
      runtimeExtensionMultiplier: 1,
      appliesIgniteDamageMultiplier: false,
      appliesPhysicalInflictionDamageMultiplier: false,
    }),
    elementalInflictionDocument: document,
  });
}

/** 只有附着、没有爆发定义；重复施加时按严格定义失败。 */
function createAttachmentOnlyEnvironment(): StandardPlayerDamageEnvironment {
  const document: CombatBuffDefinitionsDocument = {
    schemaVersion: 1,
    revision: 'test',
    buffs: [
      {
        id: 'attachment.electric',
        stackingType: 'enhanceAndRefresh',
        stackingKey: 'attachment.electric',
        maxStackCount: 4,
        durationSeconds: 10,
        role: { kind: 'elementalAttachment', element: 'electric' },
      },
    ],
  };
  return new StandardPlayerDamageEnvironment({
    criticalSamples: { nextCriticalSample: () => 1 },
    resolveNonRandomRuntimeSnapshot: () => ({
      runtimeExtensionMultiplier: 1,
      appliesIgniteDamageMultiplier: false,
      appliesPhysicalInflictionDamageMultiplier: false,
    }),
    elementalInflictionDocument: document,
  });
}

/** 假 SkillSetting：法术爆发伤害倍率第 1 列 = 1.5，无增强公式。 */
function createSkillSettings(): SkillSettingsDocument {
  return {
    schemaVersion: 1,
    revision: 'test',
    data: [
      {
        key: '法术爆发伤害倍率',
        values: [1.5, 2, 2.5, 3],
        enhanceFormulaKey: '',
      },
    ],
    enhanceFormulas: [],
  };
}

describe('StandardPlayerDamageEnvironment', () => {
  it('reuses one operator Buff runtime for assembly operations and damage modifiers', () => {
    const environment = createEnvironment();
    const createRuntime = environment.runtimeOptions.createOperatorBuffRuntime;

    expect(createRuntime).toBeDefined();
    expect(createRuntime?.('operator')).toBe(createRuntime?.('operator'));
    expect(createRuntime?.('operator')?.ownerId).toBe('operator');
  });

  it('executes the strict standard life-damage subset with compiled panel and enemy inputs', () => {
    const context = createContext();
    const environment = createEnvironment();
    const events: string[] = [];
    for (const event of [
      'beforeDamageAction',
      'beforeCalculateDamage',
      'beforeOutputDamage',
      'outputDamage',
    ] as const) {
      environment
        .eventsFor('operator')
        .registerAction(event, 10, ({ event: current }) => events.push(current));
    }
    for (const event of ['beforeTakeDamage', 'takeDamage'] as const) {
      environment
        .eventsFor('enemy')
        .registerAction(event, 10, ({ event: current }) => events.push(current));
    }

    const executor = environment.runtimeOptions.createOperationExecutor(context);

    expect(executor.execute(damageStep)).toBe(true);
    expect(environment.enemyVitals.health).toBe(9776);
    expect(events).toEqual([
      'beforeDamageAction',
      'beforeCalculateDamage',
      'beforeTakeDamage',
      'beforeOutputDamage',
      'takeDamage',
      'outputDamage',
    ]);
  });

  it('applies poise damage and recovers after the break duration', () => {
    const context = createContext();
    const receipt = context.receipt as CombatReceiptCollector;
    const environment = createEnvironment();
    const executor = environment.runtimeOptions.createOperationExecutor(context);

    expect(
      executor.execute({
        ...damageStep,
        parameters: { ...damageStep.parameters, stagger: 10 },
      }),
    ).toBe(true);
    expect(environment.enemyVitals.poise).toBe(290);
    expect(receipt.entries.at(-1)).toMatchObject({
      event: 'PoiseApplied',
      data: { requestedDelta: -10, currentPoise: 290 },
    });

    expect(executor.execute({ kind: 'dealStagger', parameters: { value: 300 } })).toBe(true);
    expect(environment.enemyVitals.poise).toBe(0);
    expect(receipt.entries.at(-1)?.data?.brokePoise).toBe(true);

    const vitalsRuntime = environment.enemyVitalsRuntime;
    expect(vitalsRuntime).not.toBeNull();
    for (let frame = 0; frame < 320; frame += 1) vitalsRuntime!.advanceFrame();
    expect(environment.enemyVitals.poise).toBe(300);
    expect(receipt.entries.some(entry => entry.event === 'PoiseRecovered')).toBe(true);
  });

  it('executes index elemental infliction and consumes attachments on bursts', () => {
    const context = createContext();
    const receipt = context.receipt as CombatReceiptCollector;
    const environment = createInflictionEnvironment();
    const executor = environment.runtimeOptions.createOperationExecutor(context);
    const step = {
      kind: 'applyElementalInfliction' as const,
      parameters: { element: 'electric' as const, isExtra: false },
    };

    expect(executor.execute(step)).toBe(true);
    expect(receipt.entries.at(-1)).toMatchObject({
      event: 'ElementalInflictionApplied',
      data: {
        requestedElement: 'electric',
        currentElement: 'electric',
        outcomeKind: 'attachmentOnly',
      },
    });

    expect(executor.execute(step)).toBe(true);
    expect(receipt.entries.at(-1)).toMatchObject({
      event: 'ElementalInflictionApplied',
      data: { outcomeKind: 'burst', currentLayers: 2 },
    });
  });

  it('records a burst without applying a missing burst buff definition', () => {
    const context = createContext();
    const environment = createAttachmentOnlyEnvironment();
    const executor = environment.runtimeOptions.createOperationExecutor(context);
    const step = {
      kind: 'applyElementalInfliction' as const,
      parameters: { element: 'electric' as const, isExtra: false },
    };

    expect(executor.execute(step)).toBe(true);
    // 定义中没有爆发条目，第二次同元素施加按严格定义失败，而不是静默跳过。
    expect(() => executor.execute(step)).toThrow(
      "buff definition is missing elemental burst 'electric'",
    );
  });

  it('executes a real spell burst with SkillSetting when the burst buff is triggered', () => {
    const context = createContext();
    const receipt = context.receipt as CombatReceiptCollector;
    const environment = new StandardPlayerDamageEnvironment({
      criticalSamples: { nextCriticalSample: () => 1 },
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      elementalInflictionDocument: {
        schemaVersion: 1,
        revision: 'test',
        buffs: [
          {
            id: 'attachment.electric',
            stackingType: 'enhanceAndRefresh',
            stackingKey: 'attachment.electric',
            maxStackCount: 4,
            durationSeconds: 10,
            role: { kind: 'elementalAttachment', element: 'electric' },
          },
          {
            id: 'burst.electric',
            stackingType: 'unlimited',
            durationSeconds: 5,
            triggerIntervalSeconds: 1,
            waitFirstTriggerInterval: true,
            maxTriggerCount: 1,
            role: { kind: 'elementalBurst', element: 'electric' },
            actions: {
              trigger: [{ kind: 'triggerSpellBurst', burstType: 'Pulse' }],
            },
            spellBurst: {
              burstType: 'Pulse',
              damageType: 'electric',
              skillSettingDataKey: '法术爆发伤害倍率',
              skillSettingColumn: 1,
              atkScaleBase: 50,
            },
          },
        ],
      },
      spellInflictionSettings: createSkillSettings(),
    });
    const executor = environment.runtimeOptions.createOperationExecutor(context);
    const step = {
      kind: 'applyElementalInfliction' as const,
      parameters: { element: 'electric' as const, isExtra: false },
    };

    // 第一次施加附着；第二次触发爆发 Buff，等待 1 秒触发间隔后打出伤害。
    expect(executor.execute(step)).toBe(true);
    expect(executor.execute(step)).toBe(true);
    const buffRuntime = environment.runtimeOptions.enemyBuffRuntime;
    for (let frame = 0; frame < 31; frame += 1) buffRuntime.advanceFrame();
    const burst = receipt.entries.find(entry => entry.event === 'SpellBurstApplied');
    expect(burst).toMatchObject({
      sourceId: 'operator',
      data: { burstType: 'Pulse', skillScale: 1.5, enhanceFactor: 1 },
    });
    expect((burst?.data?.value ?? 0) as number).toBeGreaterThan(0);
    // 敌人实际掉了血（数值经过防御与抗性修正，不断言具体值）。
    expect(environment.enemyVitals.health).toBeLessThan(10000);
  });

  it('fails explicitly when a burst needs the unavailable infliction-enhance attribute', () => {
    const context = createContext();
    const environment = new StandardPlayerDamageEnvironment({
      criticalSamples: { nextCriticalSample: () => 1 },
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      elementalInflictionDocument: {
        schemaVersion: 1,
        revision: 'test',
        buffs: [
          {
            id: 'attachment.electric',
            stackingType: 'enhanceAndRefresh',
            stackingKey: 'attachment.electric',
            maxStackCount: 4,
            durationSeconds: 10,
            role: { kind: 'elementalAttachment', element: 'electric' },
          },
          {
            id: 'burst.electric',
            stackingType: 'unlimited',
            durationSeconds: 5,
            triggerIntervalSeconds: 1,
            waitFirstTriggerInterval: true,
            maxTriggerCount: 1,
            role: { kind: 'elementalBurst', element: 'electric' },
            actions: {
              trigger: [{ kind: 'triggerSpellBurst', burstType: 'Pulse' }],
            },
            spellBurst: {
              burstType: 'Pulse',
              damageType: 'electric',
              skillSettingDataKey: '法术爆发伤害倍率',
              skillSettingColumn: 1,
              atkScaleBase: 50,
            },
          },
        ],
      },
      spellInflictionSettings: {
        schemaVersion: 1,
        revision: 'test',
        data: [{ key: '法术爆发伤害倍率', values: [1.5, 2, 2.5, 3], enhanceFormulaKey: 'linear' }],
        enhanceFormulas: [{ key: 'linear', kind: 'linear', paramA: 0.5 }],
      },
    });
    const executor = environment.runtimeOptions.createOperationExecutor(context);
    const step = {
      kind: 'applyElementalInfliction' as const,
      parameters: { element: 'electric' as const, isExtra: false },
    };

    expect(executor.execute(step)).toBe(true);
    expect(executor.execute(step)).toBe(true);
    const buffRuntime = environment.runtimeOptions.enemyBuffRuntime;
    expect(() => {
      for (let frame = 0; frame < 40; frame += 1) buffRuntime.advanceFrame();
    }).toThrow('requires the source infliction-enhance attribute');
  });

  it('fails explicitly when a burst triggers without SkillSetting data', () => {
    const context = createContext();
    const environment = new StandardPlayerDamageEnvironment({
      criticalSamples: { nextCriticalSample: () => 1 },
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      elementalInflictionDocument: {
        schemaVersion: 1,
        revision: 'test',
        buffs: [
          {
            id: 'attachment.electric',
            stackingType: 'enhanceAndRefresh',
            stackingKey: 'attachment.electric',
            maxStackCount: 4,
            durationSeconds: 10,
            role: { kind: 'elementalAttachment', element: 'electric' },
          },
          {
            id: 'burst.electric',
            stackingType: 'unlimited',
            durationSeconds: 5,
            triggerIntervalSeconds: 1,
            waitFirstTriggerInterval: true,
            maxTriggerCount: 1,
            role: { kind: 'elementalBurst', element: 'electric' },
            actions: {
              trigger: [{ kind: 'triggerSpellBurst', burstType: 'Pulse' }],
            },
            spellBurst: {
              burstType: 'Pulse',
              damageType: 'electric',
              skillSettingDataKey: '法术爆发伤害倍率',
              skillSettingColumn: 1,
              atkScaleBase: 50,
            },
          },
        ],
      },
    });
    const executor = environment.runtimeOptions.createOperationExecutor(context);
    const step = {
      kind: 'applyElementalInfliction' as const,
      parameters: { element: 'electric' as const, isExtra: false },
    };

    expect(executor.execute(step)).toBe(true);
    // 第二次施加触发爆发 Buff，推进 1 秒触发间隔后因缺少 SkillSetting 明确失败。
    expect(executor.execute(step)).toBe(true);
    const buffRuntime = environment.runtimeOptions.enemyBuffRuntime;
    expect(() => {
      for (let frame = 0; frame < 40; frame += 1) buffRuntime.advanceFrame();
    }).toThrow('requires SkillSetting data');
  });

  it('records attachment expiry as a BuffFinished fact for effect segments', () => {
    const context = createContext();
    const receipt = context.receipt as CombatReceiptCollector;
    const environment = createInflictionEnvironment();
    const executor = environment.runtimeOptions.createOperationExecutor(context);
    const step = {
      kind: 'applyElementalInfliction' as const,
      parameters: { element: 'electric' as const, isExtra: false },
    };

    expect(executor.execute(step)).toBe(true);
    const buffRuntime = environment.runtimeOptions.enemyBuffRuntime;
    for (let frame = 0; frame < 310; frame += 1) buffRuntime.advanceFrame();

    const finished = receipt.entries.filter(entry => entry.event === 'BuffFinished');
    expect(finished.length).toBe(1);
    expect(finished[0]).toMatchObject({
      targetId: 'enemy',
      data: {
        buffId: 'attachment.electric',
        reason: 'lifetime',
        layers: 1,
      },
    });
  });

  it('applies reactions with levels and evaluates reaction conditions', () => {
    const context = createContext();
    const receipt = context.receipt as CombatReceiptCollector;
    const environment = createEnvironment();
    const executor = environment.runtimeOptions.createOperationExecutor(context);
    const step = {
      kind: 'applyElementalReaction' as const,
      parameters: {
        reaction: 'electrification' as const,
        target: 'enemy' as const,
        durationSeconds: 5,
        effectiveness: 1,
      },
    };

    expect(executor.execute(step)).toBe(true);
    expect(executor.execute(step)).toBe(true);
    expect(receipt.entries.at(-1)).toMatchObject({
      event: 'ElementalReactionApplied',
      data: { reaction: 'electrification', level: 2, previousLevel: 1 },
    });
    expect(
      executor.evaluate({
        kind: 'elementalReactionActive',
        reaction: 'electrification',
        minimumLevel: 2,
      }),
    ).toBe(true);
    expect(executor.evaluate({ kind: 'elementalReactionActive', reaction: 'corrosion' })).toBe(
      false,
    );
  });

  it('rejects operations outside the recovered subset', () => {
    const environment = createEnvironment();
    const executor = environment.runtimeOptions.createOperationExecutor(createContext());

    expect(() =>
      executor.execute({
        kind: 'applyBuff',
        parameters: { buffId: 'buff:missing', target: 'enemy' },
      }),
    ).toThrow("does not support 'applyBuff'");
  });
});
