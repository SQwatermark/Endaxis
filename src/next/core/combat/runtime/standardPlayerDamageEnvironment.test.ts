import { fixtureGameplayTagRegistry } from '../../../../../tools/game-data-compiler/test/gameplayTagFixtures.ts';
import { describe, expect, it, vi } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { CombatBuffDefinitionsDocument } from '../buffs/combatBuffDefinitions';
import type { SkillSettingsDocument } from '../infliction/skillSettings';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import damageFixture from '../../../../../tools/game-data-compiler/test/fixtures/avywenna-return-damage.json';
import { parseDamageActionSource } from '../../../../../tools/game-data-compiler/src/source/damageActions.ts';
import { compileEventTargetSimpleDamageOperationSource } from '../../../../../tools/game-data-compiler/src/compiler/simpleDamageOperation.ts';
import { scalarFixture } from '../../../../../tools/game-data-compiler/test/sourceFixtures.ts';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import { CombatResources } from './combatResources';
import type {
  CombatEnemyProgram,
  CombatOperationExecutorContext,
  EquipmentEventOperationExecutorContext,
} from './combatRuntimeAssembly';
import { CombatRuntimeAssembly } from './combatRuntimeAssembly';
import { StandardPlayerDamageEnvironment } from './standardPlayerDamageEnvironment';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { createEnemyCombatVitals } from './combatVitalsFactory';
import { CombatVitalsConditionExecutor } from './combatVitalsConditionExecutor';
import { ActionBlackboard } from './actionBlackboard';
import { BuffDefinitionOperationTarget } from './buffDefinitionOperationTarget';
import { elementalAttachments } from '../../../data/buffs/elementalAttachments';
import { skillSettings } from '../../../data/combat/skillSettings';
import { ELEMENTAL_INFLICTION_EVENTS } from './elementalInflictionOperationExecutor';
import { EventContextConditionExecutor } from './eventContextConditionExecutor';
import type { PendingComboCondition } from './comboSkillConditionRuntime';
import { parseUnityComboSkillConditionsSource } from '../../../../../tools/game-data-compiler/src/source/unityComboSkillConditions.ts';
import { compilePendingComboConditionSource } from '../../../../../tools/game-data-compiler/src/compiler/comboSkillConditions.ts';
import { unityComboConditionFixture } from '../../../../../tools/game-data-compiler/test/unityComboConditionFixture.ts';
import { compileActionSequence } from '../../compiler/compileSkill';
import type { ActionSequenceDefinition } from '../../game-data/operatorDefinition';
import { validateSkillDefinition } from '../../game-data/validateSkillDefinition';
import { ActionBlackboardOperationExecutor } from './actionBlackboardOperationExecutor';
import { BuffOperationExecutor } from './buffOperationExecutor';
import { TargetContextOperationExecutor } from './targetContextOperationExecutor';
import {
  ATTRIBUTE_MODIFIER_SOURCES,
  CombatAttributeModifier,
  attributeModifierValues,
} from '../attributes/combatAttributes';

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

function createEnvironment(
  enemy: CombatEnemyProgram = testEnemy,
  criticalSample = 1,
): StandardPlayerDamageEnvironment {
  return new StandardPlayerDamageEnvironment({
    criticalSamples: { nextCriticalSample: () => criticalSample },
    resolveNonRandomRuntimeSnapshot: () => ({
      runtimeExtensionMultiplier: 1,
      appliesIgniteDamageMultiplier: false,
      appliesPhysicalInflictionDamageMultiplier: false,
    }),
    enemyVitals: createEnemyCombatVitals(enemy),
  });
}

function createEquipmentContext(): EquipmentEventOperationExecutorContext {
  const { program: _program, equipmentContributions: _contributions, ...battle } = createContext();
  return {
    ...battle,
    operatorId: 'operator',
    source: { kind: 'weaponTrait', slug: 'fixture', traitKey: 'effect' },
    handlerKey: 'additional-hit',
    event: {
      kind: 'physicalInflictionApplied',
      sourceOperatorId: 'operator',
      targetId: 'enemy',
      type: 'airborne',
    },
  };
}

it.each(['criticalRate', 'criticalDamageIncrease'] as const)(
  '即时 %s 最终乘法作用于完整面板，结束后下一击恢复',
  attribute => {
    const original = createContext();
    const context = {
      ...original,
      program: { ...original.program, statModifiers: { criticalRate: 0.3 } },
    };
    const environment = createEnvironment(testEnemy, 0.1);
    const samples = vi.spyOn(environment.options.criticalSamples, 'nextCriticalSample');
    const executor = environment.runtimeOptions.createOperationExecutor(context);
    const blackboard = new ActionBlackboard({ multiplier: 0, atk_scale_lance: 1 });
    const runtime = new CombatActionSequenceRuntime(executor, { blackboard });
    // 原生形状 → 公共投影 → 正式编译 → 实际环境；不用手写运行时修正绕过生成链。
    const raw = structuredClone(damageFixture[0]!.branch.failActions.actionData[0]!);
    const projected = compileEventTargetSimpleDamageOperationSource(
      parseDamageActionSource(
        {
          ...raw,
          damageUnits: [
            {
              ...raw.damageUnits[0]!,
              damageProcessors: [
                {
                  $type: 'Beyond.Gameplay.Core.InstantModifyAttribute, Gameplay.Beyond',
                  modifyTargetSide: 'Attacker',
                  modifier: {
                    modifyAttributeType: 'Specific',
                    attributeType:
                      attribute === 'criticalRate' ? 'CriticalRate' : 'CriticalDamageIncrease',
                    formulaItem: 'FinalMultiplier',
                    param: scalarFixture(0, 'multiplier'),
                  },
                },
              ],
            },
          ],
        },
        'critical.damage',
        {},
      ),
      'critical.damage',
    );
    const sequence = runtime.createSequence(compileActionSequence({ steps: [projected] }, 1));
    sequence.executeInstant({});
    expect(samples).toHaveBeenCalledTimes(attribute === 'criticalRate' ? 0 : 1);
    executor.execute(damageStep);
    blackboard.assignDynamic('multiplier', 1);
    sequence.executeInstant({});
    const hits = (context.receipt as CombatReceiptCollector).entries.filter(
      entry => entry.event === 'DamageApplied',
    );
    expect(hits).toHaveLength(3);
    expect(hits[0]!.data?.criticalMultiplier).toBe(1);
    expect(hits[0]!.data?.isCritical).toBe(attribute !== 'criticalRate');
    expect(hits[1]!.data?.criticalMultiplier).toBe(1.6);
    expect(hits[2]!.data?.criticalMultiplier).toBe(1.6);
    expect(samples).toHaveBeenCalledTimes(attribute === 'criticalRate' ? 2 : 3);
  },
);

it.each(['burst', 'buff'] as const)(
  '%s 旁路读取完整暴击属性，不重复加入面板或继承技能加成',
  route => {
    const run = (sample: number, finalMultiplier: number) => {
      const base = createContext();
      const context = {
        ...base,
        program: { ...base.program, statModifiers: { criticalRate: 0.8 } },
      };
      const environment = new StandardPlayerDamageEnvironment({
        criticalSamples: { nextCriticalSample: () => sample },
        resolveNonRandomRuntimeSnapshot: () => ({
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: false,
        }),
        enemyVitals: createEnemyCombatVitals(testEnemy),
        spellInflictionSettings: createSkillSettings(),
        elementalInflictionDocument: {
          schemaVersion: 1,
          revision: 'critical-test',
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
                trigger:
                  route === 'burst'
                    ? [{ kind: 'triggerSpellBurst', burstType: 'Pulse' }]
                    : [
                        {
                          kind: 'dealAttackScaledDamage',
                          damageType: 'electric',
                          attackScale: 1,
                          tags: [],
                          features: [],
                          canCritical: true,
                        },
                      ],
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
      const owner = environment.runtimeOptions.createOperatorBuffRuntime!(
        'operator',
        context.panel,
      );
      if (!(owner instanceof BuffDefinitionOperationTarget))
        throw new Error('fixture Buff runtime');
      owner.container.attributes.addModifier(
        new CombatAttributeModifier(
          'criticalRate',
          attributeModifierValues('finalMultiplier', finalMultiplier),
          ATTRIBUTE_MODIFIER_SOURCES.buff,
          'runtime',
        ),
      );
      owner.container.attributes.addModifier(
        new CombatAttributeModifier(
          'criticalDamageIncrease',
          attributeModifierValues('finalMultiplier', 2),
          ATTRIBUTE_MODIFIER_SOURCES.buff,
          'runtime',
        ),
      );
      for (let i = 0; i < 2; i++)
        executor.execute({
          kind: 'applyElementalInfliction',
          parameters: { element: 'electric', isExtra: false },
        });
      for (let frame = 0; frame < 31; frame++)
        environment.runtimeOptions.enemyBuffRuntime.advanceFrame();
      const hits = (context.receipt as CombatReceiptCollector).entries.filter(
        entry => entry.event === 'DamageApplied',
      );
      expect(hits).toHaveLength(1);
      return hits[0]!.data;
    };
    expect(run(0.2, 1)).toMatchObject({ isCritical: false, criticalMultiplier: 1 });
    expect(run(0.1, 1)).toMatchObject({ isCritical: true, criticalMultiplier: 2.2 });
    expect(run(0.1, 0)).toMatchObject({ isCritical: false, criticalMultiplier: 1 });
  },
);

it('技能编译保留即时 Atk 修正，只影响当前命中且每次读取当前黑板', () => {
  const context = createContext();
  const environment = createEnvironment();
  const executor = environment.runtimeOptions.createOperationExecutor(context);
  const blackboard = new ActionBlackboard({ bonus: 0.5 });
  const compiled = compileActionSequence(
    {
      steps: [
        {
          kind: 'dealDamage',
          parameters: {
            ...damageStep.parameters,
            instantAttributeModifiers: [
              {
                targetSide: 'attacker',
                attribute: 'Atk',
                slot: 'baseMultiplier',
                value: { kind: 'blackboard', key: 'bonus' },
                attributeTiming: 'runtime',
              },
            ],
          },
        },
      ],
    },
    1,
  );
  const runtime = new CombatActionSequenceRuntime(executor, { blackboard });
  const sequence = runtime.createSequence(compiled);
  sequence.executeInstant({});
  executor.execute(damageStep);
  blackboard.assignDynamic('bonus', 1);
  sequence.executeInstant({});
  executor.execute(damageStep);
  const hits = (context.receipt as CombatReceiptCollector).entries.filter(
    entry => entry.event === 'DamageApplied',
  );
  // 基础攻击 700、战技增伤 20%、防御除以 3、电抗 20%。即时攻击不残留到下一击。
  const base = ((700 * 1.2) / 3) * 0.8;
  expect(hits).toHaveLength(4);
  for (const [index, scale] of [1.5, 1, 2, 1].entries()) {
    expect(hits[index]!.data?.value).toBeCloseTo(base * scale);
  }
});

it('装备末端从真实配装上下文结算伤害，不继承触发技能或发送伪技能命中', () => {
  const context = createEquipmentContext();
  const environment = createEnvironment();
  const events: unknown[] = [];
  environment
    .eventsFor('operator')
    .registerAction('outputDamage', 0, event => events.push(event.payload));
  let skillHits = 0;
  context.semanticEvents.register({
    ownerOperatorId: 'operator',
    trigger: { kind: 'skillHit', skillGroupKey: 'battleSkill', scope: 'operator' },
    phase: 'dataAction',
    handle: () => {
      skillHits += 1;
    },
  });
  const executor = environment.runtimeOptions.createEquipmentEventOperationExecutor!(context);
  executor.execute(
    { ...damageStep, parameters: { ...damageStep.parameters, tags: [] } },
    {
      blackboard: new ActionBlackboard(),
      eventSkillCastInfo: {
        skillCastId: 42,
        originSkillId: 'trigger-skill',
        originSkillType: 'battleSkill',
        nonReturnedSpCost: 100,
      },
    },
  );
  expect(events).toHaveLength(1);
  expect(events[0]).toMatchObject({ skillCastInfo: null });
  const hit = (context.receipt as CombatReceiptCollector).entries.find(
    entry => entry.event === 'DamageApplied',
  )!;
  expect(hit.data?.value).toBeCloseTo((700 / 3) * 0.8);
  expect(hit.data?.sourceActionId).toBe('equipment:weaponTrait:fixture:additional-hit');
  expect(hit.data?.castId).toBeUndefined();
  expect(hit.data?.skillType).toBeUndefined();
  expect(skillHits).toBe(0);
});

it('装备末端满血治疗仍按 output、receive 顺序发布事件，且不需要任何主动技能', () => {
  const context = createEquipmentContext();
  const environment = createEnvironment();
  const events: string[] = [];
  for (const event of ['outputHeal', 'receiveHeal'] as const) {
    environment.eventsFor('operator').registerAction(event, 0, current => {
      expect(current.payload).toMatchObject({
        requestedHealing: 100,
        actualHealing: 0,
        overhealing: 100,
      });
      events.push(event);
    });
  }
  const executor = environment.runtimeOptions.createEquipmentEventOperationExecutor!(context);
  expect(
    executor.execute({ kind: 'heal', parameters: { target: 'caster', amount: 100, tags: [] } }),
  ).toBe(true);
  expect(events).toEqual(['outputHeal', 'receiveHeal']);
});

it('publishes take/output critical events only for a critical health-damage result', () => {
  const reached: string[] = [];
  const nonCritical = createEnvironment(testEnemy, 1);
  nonCritical
    .eventsFor('enemy')
    .registerAction('takeCriticalDamage', 0, () => reached.push('non-critical'));
  nonCritical
    .eventsFor('operator')
    .registerAction('outputCriticalDamage', 0, () => reached.push('non-critical-output'));
  expect(
    nonCritical.runtimeOptions.createOperationExecutor(createContext()).execute(damageStep),
  ).toBe(true);

  const critical = createEnvironment(testEnemy, 0);
  critical.eventsFor('enemy').registerAction('takeCriticalDamage', 0, ({ payload }) => {
    const result = (payload as { result: { isCritical: boolean } }).result;
    expect(result.isCritical).toBe(true);
    reached.push('critical');
  });
  critical.eventsFor('operator').registerAction('outputCriticalDamage', 0, ({ payload }) => {
    const result = (payload as { result: { isCritical: boolean } }).result;
    expect(result.isCritical).toBe(true);
    reached.push('critical-output');
  });
  expect(critical.runtimeOptions.createOperationExecutor(createContext()).execute(damageStep)).toBe(
    true,
  );

  expect(reached).toEqual(['critical', 'critical-output']);
});

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
      {
        id: 'attachment.heat',
        stackingType: 'enhanceAndRefresh',
        stackingKey: 'attachment.heat',
        maxStackCount: 4,
        durationSeconds: 10,
        role: { kind: 'elementalAttachment', element: 'heat' },
      },
      {
        id: 'status.electric.heat',
        stackingType: 'unlimited',
        role: {
          kind: 'compoundStatus',
          consumedElement: 'electric',
          incomingElement: 'heat',
        },
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
  it.each(['heat', 'electric', 'cryo', 'nature'] as const)(
    '%s 五条真实条件由 assembly 自动注册，连续技能附着共享实体板且不重复安装',
    element => {
      for (const [deckGate, placeCombo] of [
        [0, true],
        [1, true],
        [0, false],
        [1, false],
      ] as const) {
        const context = createContext();
        const environment = new StandardPlayerDamageEnvironment({
          criticalSamples: { nextCriticalSample: () => 1 },
          resolveNonRandomRuntimeSnapshot: () => ({
            runtimeExtensionMultiplier: 1,
            appliesIgniteDamageMultiplier: false,
            appliesPhysicalInflictionDamageMultiplier: false,
          }),
          enemyVitals: createEnemyCombatVitals(testEnemy),
          elementalInflictionDocument: elementalAttachments,
          spellInflictionSettings: skillSettings,
        });
        const fixture = unityComboConditionFixture();
        const programs = parseUnityComboSkillConditionsSource(
          fixture.conditions,
          fixture.references,
          'fixture.combo',
        ).conditions.map((source, index) => {
          const compiled = compilePendingComboConditionSource(source, {
            gameplayTagRegistry: fixtureGameplayTagRegistry,
            actionOwnerTarget: 'caster',
            actionSourceTarget: 'caster',
            actionTargetTarget: 'eventTarget',
          });
          return {
            key: `${index}`,
            skillGroupKey: 'combo',
            event: compiled.event,
            initialValues: { consumed_type: 0, consumed_layer: 0 },
            sequence: compileActionSequence(compiled.sequence as ActionSequenceDefinition, 1),
          };
        });
        const pending: string[] = [];
        const combo = {
          ...context.program,
          operatorId: 'owner',
          skillGroupKey: 'combo',
          skillId: 'combo',
          skillType: 'comboSkill' as const,
          cooldownFrames: 300,
          costFrame: 0,
        };
        const assembly = new CombatRuntimeAssembly({
          ...environment.runtimeOptions,
          enemy: testEnemy,
          resources: context.resources.snapshot(),
          operators: [
            {
              operatorId: 'owner',
              panel: context.panel,
              // 零放置和重复放置拥有同一份常驻配置，均只安装五条条件。
              skillCooldownPrograms: [combo],
              skills: placeCombo
                ? [
                    { ...combo, castId: 'a' },
                    { ...combo, castId: 'b' },
                  ]
                : [],
              initialEntityBlackboard: {
                EntityBB_consumed_type: 0,
                EntityBB_wisd_greater_will: deckGate,
              },
              skillSlotGroups: [
                { skillGroupKey: 'combo', baseSkillKey: 'combo', replacementSkillKeys: [] },
              ],
              comboConditionPrograms: programs,
            },
            {
              operatorId: 'operator',
              panel: context.panel,
              skills: [
                {
                  ...context.program,
                  timelineActions: [
                    {
                      startFrame: 0,
                      sequence: {
                        steps: [
                          {
                            kind: 'applyElementalInfliction',
                            parameters: { element, isExtra: false },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
          comboConditionEligibility: { isAlive: () => true, isSilenced: () => false },
          onPendingComboCondition: (ownerId, program, value) => {
            expect(ownerId).toBe('owner');
            expect(value).toMatchObject({
              inputTarget: { kind: 'operator', operatorId: 'operator' },
              triggerTarget: { kind: 'enemy' },
              assignPairs: { consumed_type: 0, consumed_layer: 0 },
            });
            pending.push(program.key);
          },
        });
        expect(assembly.tryStartSkill('operator', 'battleSkill')).toBe(true);
        expect(pending).toEqual([
          ...(element === 'nature' ? ['0'] : []),
          ...(deckGate === 0 ? ['4'] : []),
        ]);
        pending.length = 0;
        assembly.simulation.advanceFrame();
        expect(assembly.tryStartSkill('operator', 'battleSkill')).toBe(true);
        expect(pending).toEqual([
          { nature: '0', heat: '1', electric: '2', cryo: '3' }[element],
          ...(deckGate === 0 ? ['4'] : []),
        ]);
        const entity =
          environment.runtimeOptions.createOperatorBuffRuntime!('owner')!.entityBlackboard!;
        expect(entity.getNumber('EntityBB_consumed_type')).toBe(
          deckGate === 0 ? { heat: 0, electric: 1, cryo: 2, nature: 3 }[element] : 0,
        );
        assembly.disposeComboSkillConditions();
        assembly.disposeComboSkillConditions();
        pending.length = 0;
        assembly.simulation.advanceFrame();
        assembly.tryStartSkill('operator', 'battleSkill');
        expect(pending).toEqual([]);
      }
    },
  );
  it.each(['heat', 'electric', 'cryo', 'nature'] as const)(
    '%s 真实五条条件经 RID 来源/公共编译，在连续两次附着前查询旧层数',
    element => {
      for (const deckGate of [0, 1]) {
        const context = createContext();
        const environment = new StandardPlayerDamageEnvironment({
          criticalSamples: { nextCriticalSample: () => 1 },
          resolveNonRandomRuntimeSnapshot: () => ({
            runtimeExtensionMultiplier: 1,
            appliesIgniteDamageMultiplier: false,
            appliesPhysicalInflictionDamageMultiplier: false,
          }),
          enemyVitals: createEnemyCombatVitals(testEnemy),
          elementalInflictionDocument: elementalAttachments,
          spellInflictionSettings: skillSettings,
        });
        const executor = environment.runtimeOptions.createOperationExecutor(context);
        const terminal = {
          execute: () => {
            throw new Error('unexpected operation');
          },
          evaluate: () => {
            throw new Error('unexpected condition');
          },
        };
        const queries = new BuffOperationExecutor({
          sourceId: 'owner',
          resolveTarget: () => {
            throw new Error('wrong target channel');
          },
          resolveEventTarget: id => {
            expect(id).toBe('enemy');
            return environment.runtimeOptions.enemyBuffRuntime;
          },
          delegate: new TargetContextOperationExecutor('owner', terminal),
        });
        const operations = new ActionBlackboardOperationExecutor(
          new EventContextConditionExecutor(queries),
        );
        const fixture = unityComboConditionFixture();
        const source = parseUnityComboSkillConditionsSource(
          fixture.conditions,
          fixture.references,
          'fixture.combo',
        );
        const entity = new ActionBlackboard({
          EntityBB_consumed_type: 0,
          EntityBB_wisd_greater_will: deckGate,
        });
        const pending: number[] = [];
        source.conditions.forEach((condition, index) => {
          const compiled = compilePendingComboConditionSource(condition, {
            gameplayTagRegistry: fixtureGameplayTagRegistry,
            actionOwnerTarget: 'caster',
            actionSourceTarget: 'caster',
            actionTargetTarget: 'eventTarget',
          });
          expect(
            validateSkillDefinition({
              key: 'check',
              timelineBlockFrames: 1,
              scheduledSequences: [{ startFrame: 0, sequence: compiled.sequence }],
            }),
          ).toEqual([]);
          environment.comboConditions.registerPendingCondition({
            event: compiled.event,
            ownerId: 'owner',
            sourceId: 'owner',
            entityBlackboard: entity,
            initialValues: { consumed_type: 0, consumed_layer: 0 },
            sequence: compileActionSequence(compiled.sequence as ActionSequenceDefinition, 1),
            operations,
            isOwnerAlive: () => true,
            isOwnerSilenced: () => false,
            currentComboCooldown: () => ({ oneReady: true, maxPassedTime: 0, startCdFrame: 0 }),
            resolveTarget: id =>
              id === 'enemy' ? { kind: 'enemy' } : { kind: 'operator', operatorId: id },
            onPending: p => {
              pending.push(index);
              expect(p.assignPairs).toEqual({ consumed_type: 0, consumed_layer: 0 });
            },
          });
        });
        const step = {
          kind: 'applyElementalInfliction' as const,
          parameters: { element, isExtra: false },
        };
        executor.execute(step);
        expect(pending).toEqual([
          ...(element === 'nature' ? [0] : []),
          ...(deckGate === 0 ? [4] : []),
        ]);
        pending.length = 0;
        executor.execute(step);
        expect(pending).toEqual([
          { nature: 0, heat: 1, electric: 2, cryo: 3 }[element],
          ...(deckGate === 0 ? [4] : []),
        ]);
        expect(entity.getNumber('EntityBB_consumed_type')).toBe(
          deckGate === 0 ? { heat: 0, electric: 1, cryo: 2, nature: 3 }[element] : 0,
        );
      }
    },
  );

  it.each(['heat', 'electric', 'cryo', 'nature'] as const)(
    '%s 真实附着按 callback→action→combo 分派四阶段，前置检查先于 Buff 写入',
    element => {
      const context = createContext();
      const environment = new StandardPlayerDamageEnvironment({
        criticalSamples: { nextCriticalSample: () => 1 },
        resolveNonRandomRuntimeSnapshot: () => ({
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: false,
        }),
        enemyVitals: createEnemyCombatVitals(testEnemy),
        elementalInflictionDocument: elementalAttachments,
        spellInflictionSettings: skillSettings,
      });
      const executor = environment.runtimeOptions.createOperationExecutor(context);
      const order: string[] = [];
      const pending: PendingComboCondition[] = [];
      const operations = new EventContextConditionExecutor({
        execute: () => {
          throw new Error('unexpected');
        },
        evaluate: () => {
          throw new Error('unexpected');
        },
      });
      const entity = new ActionBlackboard({ EntityBB_type: -1 });
      for (const type of ELEMENTAL_INFLICTION_EVENTS) {
        const publisher = type.includes('Output') ? 'operator' : 'enemy';
        environment
          .eventsFor(publisher)
          .registerCallback(type, () => order.push(`${type}:callback`));
        environment
          .eventsFor(publisher)
          .registerAction(type, 0, () => order.push(`${type}:action`));
        environment.comboConditions.registerPendingCondition({
          event: type,
          ownerId: 'owner',
          sourceId: 'owner',
          entityBlackboard: entity,
          initialValues: {},
          operations,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: {
                    kind: 'eventInflictionElementIn',
                    elements: [element],
                    outputKey: 'EntityBB_type',
                  },
                },
                whenTrue: { steps: [] },
              },
            ],
          },
          isOwnerAlive: () => true,
          isOwnerSilenced: () => false,
          currentComboCooldown: () => ({ oneReady: true, maxPassedTime: 0, startCdFrame: 0 }),
          resolveTarget: id =>
            id === 'enemy' ? { kind: 'enemy' } : { kind: 'operator', operatorId: id },
          onPending: p => {
            order.push(`${type}:combo`);
            pending.push(p);
            const applied = (context.receipt as CombatReceiptCollector).entries.some(
              entry => entry.event === 'BuffApplied',
            );
            expect(applied).toBe(type.startsWith('after'));
            expect(entity.getNumber('EntityBB_type')).toBe(
              { heat: 0, electric: 1, cryo: 2, nature: 3 }[element],
            );
          },
        });
      }
      expect(
        executor.execute({
          kind: 'applyElementalInfliction',
          parameters: { element, isExtra: false },
        }),
      ).toBe(true);
      expect(order).toEqual(
        ELEMENTAL_INFLICTION_EVENTS.flatMap(type => [
          `${type}:callback`,
          `${type}:action`,
          `${type}:combo`,
        ]),
      );
      expect(pending).toHaveLength(4);
      expect(pending[1]).toMatchObject({
        inputTarget: { kind: 'operator', operatorId: 'operator' },
        triggerTarget: { kind: 'enemy' },
        assignPairs: {},
      });
    },
  );

  it('reads MaxUltimateSp from the bound combat resource ledger', () => {
    const environment = createEnvironment();
    const baseContext = createContext();
    const context = {
      ...baseContext,
      resources: new CombatResources({
        ...baseContext.resources.snapshot(),
        ultimateEnergySystemUnlocked: true,
        squad: [
          {
            operatorId: 'operator',
            ultimateEnergy: 40,
            maxUltimateEnergy: 80,
            ultimateEnergyGainMultiplier: 1,
            allowedUltimateEnergyRecoveryTags: null,
          },
        ],
      }),
    };
    environment.runtimeOptions.createOperationExecutor(context);

    expect(
      environment.runtimeOptions.readSourceAttributeValue?.('operator', {
        attribute: { kind: 'specific', key: 'maxUltimateEnergy' },
        stage: 'armedNonConverted',
        useFloor: false,
        divisor: { kind: 'constant', value: 1 },
        multiplier: { kind: 'constant', value: 1 },
        base: { kind: 'constant', value: 0 },
        targetKey: 'usp_step',
      }),
    ).toBe(80);
  });

  it('reads MaxHp from the bound operator health ledger', () => {
    const environment = createEnvironment();
    const context = createContext();
    environment.runtimeOptions.createOperationExecutor(context);

    expect(
      environment.runtimeOptions.readSourceAttributeValue?.('operator', {
        attribute: { kind: 'specific', key: 'maxHealth' },
        stage: 'finalNonConverted',
        useFloor: false,
        divisor: { kind: 'constant', value: 1 },
        multiplier: { kind: 'constant', value: 1 },
        base: { kind: 'constant', value: 0 },
        targetKey: 'max_hp',
      }),
    ).toBe(5000);
  });

  it('副属性快照在执行时读取非转换阶段，并保留技能黑板乘加公式', () => {
    const environment = createEnvironment();
    const baseContext = createContext();
    if (baseContext.panel === undefined) throw new Error('fixture panel');
    const context = {
      ...baseContext,
      panel: {
        ...baseContext.panel,
        attributes: { ...baseContext.panel.attributes, will: 100 },
      },
    };
    environment.runtimeOptions.createOperationExecutor(context);
    const runtime = environment.runtimeOptions.createOperatorBuffRuntime?.(
      'operator',
      context.panel,
    );
    if (!(runtime instanceof BuffDefinitionOperationTarget))
      throw new Error('fixture Buff runtime');
    const read = environment.runtimeOptions.readSourceAttributeValue!;
    const blackboard = new ActionBlackboard({ sub_ratio: 0.02 });
    const executor = new ActionBlackboardOperationExecutor(
      {
        execute: () => false,
        evaluate: () => false,
      },
      undefined,
      { sourceId: 'operator', read },
    );
    const parameters = {
      attribute: { kind: 'secondary' },
      stage: 'finalNonConverted',
      useFloor: false,
      divisor: { kind: 'blackboard', key: 'unused-divisor' },
      multiplier: { kind: 'blackboard', key: 'sub_ratio' },
      base: { kind: 'constant', value: 1 },
      targetKey: 'atb_up',
    } as const;
    const execute = () =>
      executor.execute({ kind: 'storeSourceAttributeValue', parameters }, { blackboard });
    expect(execute()).toBe(true);
    expect(blackboard.getNumber('atb_up')).toBeCloseTo(3);
    for (const [source, value] of [
      [ATTRIBUTE_MODIFIER_SOURCES.buff, 25],
      [ATTRIBUTE_MODIFIER_SOURCES.converted, 1000],
    ] as const) {
      runtime.container.attributes.addModifier(
        new CombatAttributeModifier(
          'will',
          attributeModifierValues('addition', value),
          source,
          'runtime',
        ),
      );
    }
    execute();
    expect(blackboard.getNumber('atb_up')).toBeCloseTo(3.5);
    expect(read('operator', { ...parameters, stage: 'armedNonConverted' })).toBe(100);
    blackboard.assignDynamic('sub_ratio', 0.04);
    execute();
    expect(blackboard.getNumber('atb_up')).toBeCloseTo(6);
  });

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
              tags: ['Skill/Character/Common/Affixes/Slow'],
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
    enemyBuffs.container.addEntityTags(['Skill/Character/Common/Affixes/Slow']);
    const healthBeforeTaggedHit = environment.enemyVitals.health;
    expect(executor.execute(damageStep)).toBe(true);
    const taggedDamage = healthBeforeTaggedHit - environment.enemyVitals.health;

    expect(normalDamage).toBe(224);
    // 面板已有同区间 +20%，天赋再加 +20%，因此区间倍率从 1.2 变为 1.4。
    expect(taggedDamage).toBeCloseTo(normalDamage * (1.4 / 1.2));
  });

  it('filters defender vulnerability by the current damage type', () => {
    const environment = createEnvironment();
    const context = createContext();
    const executor = environment.runtimeOptions.createOperationExecutor(context);
    const enemyBuffs = environment.runtimeOptions.enemyBuffRuntime;
    if (!(enemyBuffs instanceof BuffDefinitionOperationTarget)) {
      throw new Error('enemy Buff runtime is unavailable');
    }
    enemyBuffs.apply({
      buffId: 'buff.spell-vulnerable',
      sourceId: 'operator',
      blackboardValues: {},
      definition: {
        stackingType: 'unique',
        damageModifiers: [
          {
            enabledSide: 'defender',
            condition: { kind: 'eventDamageTypesMatch', damageTypes: ['electric'] },
            processors: [
              { kind: 'damageScale', side: 'defender', zone: 'vulnerable', addition: 0.3 },
            ],
          },
        ],
      },
    });

    const beforeElectric = environment.enemyVitals.health;
    expect(executor.execute(damageStep)).toBe(true);
    const electricDamage = beforeElectric - environment.enemyVitals.health;

    const physicalStep = {
      ...damageStep,
      parameters: { ...damageStep.parameters, damageType: 'physical' as const },
    };
    const beforePhysical = environment.enemyVitals.health;
    expect(executor.execute(physicalStep)).toBe(true);
    const physicalDamage = beforePhysical - environment.enemyVitals.health;

    const baseline = createEnvironment();
    const baselineExecutor = baseline.runtimeOptions.createOperationExecutor(createContext());
    const beforeBaseline = baseline.enemyVitals.health;
    expect(baselineExecutor.execute(physicalStep)).toBe(true);

    expect(electricDamage).toBeGreaterThan(224);
    expect(physicalDamage).toBeCloseTo(beforeBaseline - baseline.enemyVitals.health);
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
          tags: [],
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

  it('publishes successful heals to both ability sides before the receiver semantic event', () => {
    const environment = new StandardPlayerDamageEnvironment({
      criticalSamples: { nextCriticalSample: () => 1 },
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      enemyVitals: createEnemyCombatVitals(testEnemy),
      isOperatorControlled: operatorId => operatorId === 'operator:receiver',
    });
    const order: string[] = [];
    environment.eventsFor('operator:healer').registerAction('outputHeal', 0, ({ payload }) => {
      expect(payload).toMatchObject({
        sourceId: 'operator:healer',
        targetId: 'operator:receiver',
        actualHealing: 0,
      });
      order.push('output');
    });
    environment.eventsFor('operator:receiver').registerAction('receiveHeal', 0, () => {
      order.push('receive');
    });

    const context = createContext();
    const semanticEvents = context.semanticEvents;
    semanticEvents.register({
      ownerOperatorId: 'operator:receiver',
      trigger: { kind: 'operatorHealed' },
      phase: 'skill',
      handle: () => order.push('semantic'),
    });
    const executor = environment.runtimeOptions.createOperationExecutor({
      ...context,
      program: { ...context.program, operatorId: 'operator:healer' },
      panel: {
        ...context.panel!,
        operatorId: 'operator:healer',
        attributes: { ...context.panel!.attributes, will: 100 },
      },
    });
    environment.runtimeOptions.createOperationExecutor({
      ...createContext(),
      program: { ...context.program, operatorId: 'operator:receiver' },
      panel: { ...context.panel!, operatorId: 'operator:receiver' },
      semanticEvents,
    });

    expect(
      executor.execute({
        kind: 'heal',
        parameters: {
          target: 'controlledOperator',
          attribute: 'will',
          multiplier: 1,
          addition: 0,
          tags: [],
        },
      }),
    ).toBe(true);
    expect(order).toEqual(['output', 'receive', 'semantic']);
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

  it('applies the resolved equipment poise-output addition to every stagger hit', () => {
    const base = createContext();
    const context = {
      ...base,
      panel: { ...base.panel!, staggerDamagePercent: 0.2 },
    };
    const receipt = context.receipt as CombatReceiptCollector;
    const environment = createEnvironment();
    const executor = environment.runtimeOptions.createOperationExecutor(context);

    expect(
      executor.execute({
        ...damageStep,
        parameters: { ...damageStep.parameters, stagger: 10 },
      }),
    ).toBe(true);
    expect(environment.enemyVitals.poise).toBe(288);
    expect(receipt.entries.at(-1)).toMatchObject({
      event: 'PoiseApplied',
      data: { calculatedDamage: 12, requestedDelta: -12, currentPoise: 288 },
    });
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

  it('publishes the actual attachment layers consumed by a different incoming element', () => {
    const context = createContext();
    const consumed: number[] = [];
    context.semanticEvents.register({
      ownerOperatorId: 'operator',
      trigger: { kind: 'elementalAttachmentConsumed' },
      phase: 'dataAction',
      handle: event => {
        if (event.event.kind === 'elementalAttachmentConsumed') {
          consumed.push(event.event.layers);
        }
      },
    });
    const executor = createInflictionEnvironment().runtimeOptions.createOperationExecutor(context);

    expect(
      executor.execute({
        kind: 'applyElementalInfliction',
        parameters: { element: 'electric', isExtra: false },
      }),
    ).toBe(true);
    expect(
      executor.execute({
        kind: 'applyElementalInfliction',
        parameters: { element: 'electric', isExtra: false },
      }),
    ).toBe(true);
    expect(
      executor.execute({
        kind: 'applyElementalInfliction',
        parameters: { element: 'heat', isExtra: false },
      }),
    ).toBe(true);

    expect(consumed).toEqual([2]);
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
    expect(receipt.entries.find(entry => entry.event === 'BuffApplied')).toMatchObject({
      sourceId: 'operator',
      targetId: 'enemy',
      data: {
        buffId: 'attachment.electric',
        instanceId: 1,
        layers: 1,
      },
    });
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

  it('executes all four generated 1.4.4 spell bursts through the standard environment', () => {
    const expectedBurstTypes = {
      heat: 'Fire',
      electric: 'Pulse',
      cryo: 'Cryst',
      nature: 'Natural',
    } as const;

    for (const [element, burstType] of Object.entries(expectedBurstTypes)) {
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
        elementalInflictionDocument: elementalAttachments,
        spellInflictionSettings: skillSettings,
      });
      const executor = environment.runtimeOptions.createOperationExecutor(context);
      const step = {
        kind: 'applyElementalInfliction' as const,
        parameters: {
          element: element as keyof typeof expectedBurstTypes,
          isExtra: false,
        },
      };

      expect(executor.execute(step)).toBe(true);
      expect(executor.execute(step)).toBe(true);
      for (let frame = 0; frame < 31; frame += 1) {
        environment.runtimeOptions.enemyBuffRuntime.advanceFrame();
      }

      expect(receipt.entries.find(entry => entry.event === 'SpellBurstApplied')).toMatchObject({
        sourceId: 'operator',
        data: { burstType, skillScale: 1.6, enhanceFactor: 1 },
      });
      expect(environment.enemyVitals.health).toBeLessThan(testEnemy.health);
    }
  });

  it('uses the resolved panel infliction-enhance attribute for spell bursts', () => {
    const baseContext = createContext();
    if (baseContext.panel === undefined) throw new Error('test fixture requires a resolved panel');
    const receipt = new CombatReceiptCollector();
    const context: CombatOperationExecutorContext = {
      ...baseContext,
      panel: { ...baseContext.panel, artsIntensity: 2 },
      receipt,
    };
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
    for (let frame = 0; frame < 40; frame += 1) buffRuntime.advanceFrame();
    expect(receipt.entries.find(entry => entry.event === 'SpellBurstApplied')).toMatchObject({
      data: { enhanceFactor: 2 },
    });
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
        instanceId: 1,
        reason: 'lifetime',
        layers: 1,
      },
    });
  });

  it('records visible operator Buff instances with their native icon identity', () => {
    const context = createContext();
    const receipt = context.receipt as CombatReceiptCollector;
    const environment = createEnvironment();
    environment.runtimeOptions.createOperationExecutor(context);
    const runtime = environment.runtimeOptions.createOperatorBuffRuntime!('operator');

    expect(
      runtime.apply!({
        buffId: 'buff:operator-visible',
        sourceId: 'operator',
        blackboardValues: {},
        definition: {
          stackingType: 'unique',
          durationSeconds: 5,
          presentation: {
            visible: true,
            iconId: 'icon_battle_buff_atk_up',
            iconPath: '/icons/icon_battle_buff_atk_up.webp',
          },
          childPresentations: [
            {
              buffId: 'buff:operator-visible:child',
              presentation: {
                visible: true,
                iconPath: '/icons/icon_battle_buff_child.webp',
              },
            },
          ],
        },
      }),
    ).toBe(true);
    expect(receipt.entries.find(entry => entry.event === 'BuffApplied')).toMatchObject({
      event: 'BuffApplied',
      sourceId: 'operator',
      targetId: 'operator',
      data: {
        buffId: 'buff:operator-visible',
        instanceId: 1,
        layers: 1,
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
      },
    });
    expect(receipt.entries.find(entry => entry.event === 'BuffPresentationStarted')).toMatchObject({
      targetId: 'operator',
      data: {
        buffId: 'buff:operator-visible:child',
        parentBuffId: 'buff:operator-visible',
        instanceId: 1,
        iconPath: '/icons/icon_battle_buff_child.webp',
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
