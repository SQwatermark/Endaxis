import { describe, expect, it } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { CombatBuffDefinitionsDocument } from '../buffs/combatBuffDefinitions';
import type { SkillSettingsDocument } from '../infliction/skillSettings';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { CombatResources } from './combatResources';
import type { CombatEnemyProgram, CombatOperationExecutorContext } from './combatRuntimeAssembly';
import { StandardPlayerDamageEnvironment } from './standardPlayerDamageEnvironment';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { createEnemyCombatVitals } from './combatVitalsFactory';
import { CombatVitalsConditionExecutor } from './combatVitalsConditionExecutor';
import { ActionBlackboard } from './actionBlackboard';
import { BuffDefinitionOperationTarget } from './buffDefinitionOperationTarget';
import { gameplayTagId } from '../tags/gameplayTags';

const damageStep: Extract<ResolvedCombatStep, { kind: 'dealDamage' }> = {
  kind: 'dealDamage',
  parameters: { damageType: 'electric', attackScale: 1, tags: ['normalSkill'] },
};

const testEnemy: CombatEnemyProgram = {
  source: { kind: 'custom', level: 90 },
  rank: 'mob',
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
    knotThresholds: [0.5],
    knotBreakDurationFrames: 60,
    brokenDurationFrames: 300,
    finisherSpRecovery: 100,
  },
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
    enemy: testEnemy,
    panel: {
      operatorId: 'operator',
      level: 1,
      attributes: { strength: 0, agility: 0, intellect: 0, will: 0 },
      attack: 700,
      attackBeforeAttributeScalar: 700,
      mainAttribute: 'intellect',
      secondaryAttribute: 'will',
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
    semanticEvents: new CombatSemanticEventRuntime(),
  };
}

function createEnvironment(enemy: CombatEnemyProgram = testEnemy): StandardPlayerDamageEnvironment {
  return new StandardPlayerDamageEnvironment({
    criticalSamples: { nextCriticalSample: () => 1 },
    resolveNonRandomRuntimeSnapshot: () => ({
      runtimeExtensionMultiplier: 1,
      appliesIgniteDamageMultiplier: false,
      appliesPhysicalInflictionDamageMultiplier: false,
    }),
    enemyVitals: createEnemyCombatVitals(enemy),
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
    enemyVitals: createEnemyCombatVitals(testEnemy),
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
    enemyVitals: createEnemyCombatVitals(testEnemy),
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
    const panel = createContext().panel;
    expect(createRuntime?.('operator', panel)).toBe(createRuntime?.('operator', panel));
    expect(createRuntime?.('operator', panel)?.ownerId).toBe('operator');
  });

  it('applies a Buff blackboard damage bonus only while the target entity tag matches', () => {
    const environment = createEnvironment();
    const context = createContext();
    const executor = environment.runtimeOptions.createOperationExecutor(context);
    const operatorBuffs = environment.runtimeOptions.createOperatorBuffRuntime?.(
      'operator',
      context.panel,
    );
    if (!(operatorBuffs instanceof BuffDefinitionOperationTarget)) {
      throw new Error('operator Buff runtime is unavailable');
    }
    operatorBuffs.apply({
      buffId: 'buff.fluorite.talent-1',
      sourceId: 'operator',
      blackboardValues: {},
      definition: {
        stackingType: 'unique',
        blackboard: { dmg_up: 0.2 },
        damageModifiers: [
          {
            enabledSide: 'attacker',
            condition: {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tagIds: [1925762097],
            },
            processors: [
              {
                kind: 'damageScale',
                side: 'attacker',
                zone: 'normal',
                addition: { blackboardKey: 'dmg_up' },
              },
            ],
          },
        ],
      },
    });

    const healthBeforeNormalHit = environment.enemyVitals.health;
    expect(executor.execute(damageStep)).toBe(true);
    const normalDamage = healthBeforeNormalHit - environment.enemyVitals.health;

    const enemyBuffs = environment.runtimeOptions.enemyBuffRuntime;
    if (!(enemyBuffs instanceof BuffDefinitionOperationTarget)) {
      throw new Error('enemy Buff runtime is unavailable');
    }
    enemyBuffs.container.addEntityTags([gameplayTagId(1925762097)]);
    const healthBeforeTaggedHit = environment.enemyVitals.health;
    expect(executor.execute(damageStep)).toBe(true);
    const taggedDamage = healthBeforeTaggedHit - environment.enemyVitals.health;

    expect(normalDamage).toBe(224);
    // 面板已有同区间 +20%，天赋再加 +20%，因此区间倍率从 1.2 变为 1.4。
    expect(taggedDamage).toBeCloseTo(normalDamage * (1.4 / 1.2));
  });

  it('evaluates attached-Buff damage bonuses against the enemy current health ratio', () => {
    const environment = createEnvironment();
    const context = createContext();
    const executor = environment.runtimeOptions.createOperationExecutor(context);
    const operatorBuffs = environment.runtimeOptions.createOperatorBuffRuntime?.(
      'operator',
      context.panel,
    );
    if (!(operatorBuffs instanceof BuffDefinitionOperationTarget)) {
      throw new Error('operator Buff runtime is unavailable');
    }
    operatorBuffs.apply({
      buffId: 'buff.chen.potential-1',
      sourceId: 'operator',
      blackboardValues: { extra_dmg: 0.2, hp_remain: 0.5 },
      definition: {
        stackingType: 'unique',
        blackboard: { extra_dmg: 0, hp_remain: 0.5 },
        damageModifiers: [
          {
            enabledSide: 'attacker',
            condition: {
              kind: 'targetHealthCompare',
              target: 'enemy',
              valueType: 'ratio',
              operator: 'less',
              value: { blackboardKey: 'hp_remain' },
            },
            processors: [
              {
                kind: 'damageScale',
                side: 'attacker',
                zone: 'normal',
                addition: { blackboardKey: 'extra_dmg' },
              },
            ],
          },
        ],
      },
    });

    const healthBeforeHigh = environment.enemyVitals.health;
    expect(executor.execute(damageStep)).toBe(true);
    const highHealthDamage = healthBeforeHigh - environment.enemyVitals.health;
    environment.enemyVitals.takeDamage(environment.enemyVitals.maxHealth);
    environment.enemyVitals.heal(environment.enemyVitals.maxHealth * 0.49);
    const healthBeforeLow = environment.enemyVitals.health;
    expect(executor.execute(damageStep)).toBe(true);
    const lowHealthDamage = healthBeforeLow - environment.enemyVitals.health;

    expect(highHealthDamage).toBe(224);
    expect(lowHealthDamage).toBeCloseTo(highHealthDamage * (1.4 / 1.2));
  });

  it('shares the scene-injected vitals instance across damage writes and poise', () => {
    const vitals = createEnemyCombatVitals(testEnemy);
    const environment = new StandardPlayerDamageEnvironment({
      criticalSamples: { nextCriticalSample: () => 1 },
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      enemyVitals: vitals,
    });

    expect(environment.enemyVitals).toBe(vitals);
    expect(environment.runtimeOptions.resolveVitals!('enemy', 'operator')).toBe(vitals);

    const executor = environment.runtimeOptions.createOperationExecutor(createContext());
    expect(executor.execute(damageStep)).toBe(true);
    // 生命写入与失衡读取落在同一实例上：生命下降而失衡仍为满值，不存在两份镜像状态。
    expect(vitals.health).toBeLessThan(vitals.maxHealth);
    expect(vitals.poise).toBe(testEnemy.stagger.maximum);
    expect(environment.enemyVitals.health).toBe(vitals.health);
  });

  it('creates full-health operator ledgers and resolves the controlled heal target', () => {
    const environment = new StandardPlayerDamageEnvironment({
      criticalSamples: { nextCriticalSample: () => 1 },
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      enemyVitals: createEnemyCombatVitals(testEnemy),
      isOperatorControlled: operatorId => operatorId === 'operator:b',
    });
    const sourceBase = createContext();
    const sourceReceipt = new CombatReceiptCollector();
    const source: CombatOperationExecutorContext = {
      ...sourceBase,
      receipt: sourceReceipt,
      program: { ...sourceBase.program, operatorId: 'operator:a' },
      panel: {
        ...sourceBase.panel!,
        operatorId: 'operator:a',
        attributes: { ...sourceBase.panel!.attributes, will: 100 },
      },
    };
    const targetBase = createContext();
    const target: CombatOperationExecutorContext = {
      ...targetBase,
      program: { ...targetBase.program, operatorId: 'operator:b' },
      panel: { ...targetBase.panel!, operatorId: 'operator:b' },
    };
    const sourceExecutor = environment.runtimeOptions.createOperationExecutor(source);
    environment.runtimeOptions.createOperationExecutor(target);
    const targetVitals = environment.runtimeOptions.resolveVitals!('caster', 'operator:b');
    targetVitals.takeDamage(250);

    expect(
      sourceExecutor.execute({
        kind: 'heal',
        parameters: {
          target: 'controlledOperator',
          attribute: 'will',
          multiplier: 2,
          addition: 0,
          tagIds: [],
        },
      }),
    ).toBe(true);
    expect(targetVitals.health).toBe(4950);
    expect(sourceReceipt.entries.at(-1)).toMatchObject({
      event: 'HealingApplied',
      sourceId: 'operator:a',
      targetId: 'operator:b',
      data: { requestedHealing: 200, actualHealing: 200, overhealing: 0 },
    });
  });

  it('evaluates health conditions against the shared post-damage vitals', () => {
    const environment = createEnvironment();
    const executor = environment.runtimeOptions.createOperationExecutor(createContext());
    expect(executor.execute(damageStep)).toBe(true);
    expect(environment.enemyVitals.health).toBeLessThan(testEnemy.health);

    const conditions = new CombatVitalsConditionExecutor({
      resolveTarget: target => environment.runtimeOptions.resolveVitals!(target, 'operator'),
      delegate: { execute: () => true, evaluate: () => true },
    });
    // 生命比例已低于 1，证明条件读取的是伤害写入后的同一账本。
    expect(
      conditions.evaluate(
        {
          kind: 'healthCompare',
          target: 'enemy',
          valueType: 'ratio',
          operator: 'less',
          value: { kind: 'constant', value: 1 },
        },
        { blackboard: new ActionBlackboard() },
      ),
    ).toBe(true);
  });

  it('executes the strict standard life-damage subset with compiled panel and enemy inputs', () => {
    const context = createContext();
    const environment = createEnvironment();
    const events: string[] = [];
    context.semanticEvents.register({
      ownerOperatorId: 'operator',
      trigger: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
      phase: 'dataAction',
      handle: () => events.push(`semantic:${environment.enemyVitals.health}`),
    });
    context.semanticEvents.register({
      ownerOperatorId: 'operator',
      trigger: { kind: 'skillHit', skillGroupKey: 'battleSkill', scope: 'operator' },
      phase: 'dataAction',
      handle: () => events.push('semantic:skill'),
    });
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
      'semantic:9776',
      'semantic:skill',
    ]);
  });

  it('bridges a lethal health write to the unified enemy-defeated event', () => {
    const baseContext = createContext();
    const lowHealthEnemy = { ...testEnemy, health: 100 };
    const context: CombatOperationExecutorContext = { ...baseContext, enemy: lowHealthEnemy };
    const environment = createEnvironment(lowHealthEnemy);
    const events: string[] = [];
    environment
      .eventsFor('operator')
      .registerAction('afterKillEntity', 10, () => events.push('internal:afterKillEntity'));
    context.semanticEvents.register({
      ownerOperatorId: 'operator',
      trigger: { kind: 'enemyDefeated', scope: 'operator' },
      phase: 'dataAction',
      handle: ({ event }) => {
        expect(event.kind).toBe('enemyDefeated');
        if (event.kind === 'enemyDefeated') {
          expect(event.features).toEqual(['canBreakWeakness']);
        }
        events.push(`defeated:${environment.enemyVitals.health}`);
      },
    });

    const executor = environment.runtimeOptions.createOperationExecutor(context);
    expect(
      executor.execute({
        ...damageStep,
        parameters: { ...damageStep.parameters, features: ['canBreakWeakness'] },
      }),
    ).toBe(true);

    expect(events).toEqual(['defeated:0']);
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
      enemyVitals: createEnemyCombatVitals(testEnemy),
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
      enemyVitals: createEnemyCombatVitals(testEnemy),
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
      enemyVitals: createEnemyCombatVitals(testEnemy),
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
