/**
 * 标准战斗环境：一场模拟里敌人的元素附着、反应和 Buff 都由它管；
 * 敌人生命与失衡账本由场景装配层创建并以明确依赖注入，本环境只持有同一实例。
 *
 * 能做的就做，做不了的（Buff、瞬时属性、没确认的随机等）直接报错，
 * 绝不用假数据糊弄。调用方必须把命中时需要的数值显式传进来。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { DamageFeature, DamageTag, HealTarget } from '../../game-data/operatorDefinition';
import {
  ATTRIBUTE_MODIFIER_SOURCES,
  CombatAttributeModifier,
  CombatAttributeSet,
} from '../attributes/combatAttributes';
import {
  createOperatorAttackAttributes,
  resolveOperatorAttack,
} from '../attributes/operatorAttackAttributes';
import { CombatBuffContainer, type BuffFinishReason, type CombatBuff } from '../buffs/combatBuffs';
import {
  compileCombatBuffDefinitions,
  CompiledCombatBuffDefinitions,
  type CombatBuffDefinitionsDocument,
} from '../buffs/combatBuffDefinitions';
import type { CombatClock } from './combatClock';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { ResolvedOperatorPanel } from '../../compiler/resolveOperatorPanel';
import type { DamageModifierSide } from '../damage/playerDamageContext';
import type { DamageModifierExternalCondition } from '../damage/damageModifiers';
import type { PlayerDamageNonRandomRuntimeSnapshot } from '../damage/playerActiveDamageInput';
import { ElementalInflictionBuffAdapter } from '../infliction/elementalInflictionBuffAdapter';
import type { ElementalInflictionOperation } from '../infliction/elementalInfliction';
import { ElementalReactionContainer } from '../infliction/elementalReactionState';
import { createSkillSettingSource } from '../infliction/skillSettings';
import type {
  CompoundStatusSkillSettingSource,
  SkillSettingsDocument,
} from '../infliction/skillSettings';
import { ElementalInflictionOperationExecutor } from './elementalInflictionOperationExecutor';
import { ElementalReactionOperationExecutor } from './elementalReactionOperationExecutor';
import { executeSpellBurst } from './spellBurstRuntime';
import { AbilityEventDispatcher } from '../events/abilityEventDispatcher';
import type { CriticalSampleSource } from '../random/criticalSampleSource';
import type { ProbabilitySampleSource } from '../random/probabilitySampleSource';
import { BuffDefinitionOperationTarget } from './buffDefinitionOperationTarget';
import type {
  CombatOperationExecutorContext,
  CombatRuntimeAssemblyOptions,
} from './combatRuntimeAssembly';
import { CombatVitals } from './combatVitals';
import { CombatVitalsRuntime } from './combatVitalsRuntime';
import { PlayerDamageOperationExecutor } from './playerDamageOperationExecutor';
import type { CombatOperationExecutor } from './skillRuntime';
import type { FrameRuntime } from './combatSimulation';
import { resolveStaticPlayerDamageSnapshots } from './staticPlayerDamageSnapshots';
import { gameplayTagId, type GameplayTagRegistry } from '../tags/gameplayTags';
import { HealOperationExecutor, type ResolvedHealTarget } from './healOperationExecutor';
import { compareCombatNumbers } from './numericComparison';
import type { RegisterBuffAbilityEventAction } from './buffLifecycleSequenceRuntime';
import type { CombatResources } from './combatResources';

type DamageStep = Extract<ResolvedCombatStep, { kind: 'dealDamage' | 'dealFixedDamage' }>;
type EnvironmentOptions = Pick<
  CombatRuntimeAssemblyOptions,
  | 'enemyBuffRuntime'
  | 'enemyVitalsRuntime'
  | 'createOperatorBuffRuntime'
  | 'createAbilityEntityBuffRuntime'
  | 'createOperationExecutor'
  | 'emitAbilityEvent'
  | 'createEquipmentEventOperationExecutor'
  | 'resolveVitals'
  | 'resolveOperatorVitals'
  | 'probabilitySamples'
  | 'readSourceAttributeValue'
  | 'emitOperatorEnterFight'
  | 'emitExternalOperatorHit'
>;

export type StandardPlayerDamageEvent =
  | 'enterFight'
  | 'ownerHpZero'
  | 'beforeDamageAction'
  | 'beforeCalculateDamage'
  | 'beforeTakeDamage'
  | 'beforeOutputDamage'
  | 'beforeKillEntity'
  | 'afterKillEntity'
  | 'takeDamage'
  | 'takeCriticalDamage'
  | 'outputDamage'
  | 'beforeOutputPoiseDamage'
  | 'beforeTakePoiseDamage'
  | 'takePoiseDamage'
  | 'poiseZero'
  | 'beforeOutputInfliction'
  | 'beforeTakeInfliction'
  | 'afterOutputInfliction'
  | 'afterTakeInfliction'
  | 'elementalInflictionStarted'
  | 'poiseRecovered'
  | 'beforeCastSkill'
  | 'skillEnd'
  | 'beforeOutputBuff'
  | 'outputBuff'
  | 'addedBuff'
  | 'finishedBuff';

export interface StandardPlayerDamageEnvironmentOptions {
  /** 暴击样本和命中特殊倍率必须由具有证据的上层策略提供。 */
  readonly criticalSamples: CriticalSampleSource;
  /** RandomUtil.Dice 的独立样本源，不与暴击随机流混用。 */
  readonly probabilitySamples?: ProbabilitySampleSource;
  readonly resolveNonRandomRuntimeSnapshot: (
    context: CombatOperationExecutorContext,
    step: DamageStep,
  ) => PlayerDamageNonRandomRuntimeSnapshot;
  /** 提供后，`applyElementalInfliction` 步骤按定义附着状态机执行。 */
  readonly elementalInflictionDocument?: CombatBuffDefinitionsDocument;
  /** 法术爆发倍率来源；缺失时爆发触发会明确失败。 */
  readonly spellInflictionSettings?: SkillSettingsDocument;
  /**
   * 本次模拟唯一的敌人生命账本，由场景装配层创建并注入。
   * 伤害写入、生命条件求值和失衡恢复推进都引用这一实例，环境不再自行构造或回退到静态生命值。
   */
  readonly enemyVitals: CombatVitals;
  /** 当前游戏版本的完整标签层级；缺省时只执行裸 ID 精确匹配。 */
  readonly tagRegistry?: GameplayTagRegistry;
  /** 当前帧主控身份由场景控制时间线提供；仅在伤害修正使用该条件时需要。 */
  readonly isOperatorControlled?: (operatorId: string, frame: number) => boolean;
}

const strictTerminal: CombatOperationExecutor = {
  execute(step): boolean {
    throw new Error(`standard player damage environment does not support '${step.kind}'`);
  },
  evaluate(condition): boolean {
    throw new Error(
      `standard player damage environment cannot evaluate condition '${condition.kind}'`,
    );
  },
};

/** 一场模拟独占的标准生命/失衡伤害环境；敌人生命账本由场景装配层注入并共享。 */
export class StandardPlayerDamageEnvironment {
  readonly runtimeOptions: EnvironmentOptions;
  readonly #events = new Map<string, AbilityEventDispatcher<StandardPlayerDamageEvent, unknown>>();
  readonly #enemyBuffs: CombatBuffContainer<string>;
  readonly #enemyBuffRuntime: BuffDefinitionOperationTarget<string>;
  readonly #operatorBuffRuntimes = new Map<string, BuffDefinitionOperationTarget<string>>();
  readonly #inflictionAdapters = new Map<string, ElementalInflictionBuffAdapter<string>>();
  readonly #reactions = new ElementalReactionContainer();
  readonly #operatorPanels = new Map<string, ResolvedOperatorPanel>();
  readonly #operatorVitals = new Map<string, CombatVitals>();
  #clock: CombatClock | null = null;
  #receipt: CombatReceiptSink | null = null;
  #elementalDefinitions: CompiledCombatBuffDefinitions<string> | null = null;
  #skillSettings: CompoundStatusSkillSettingSource | null = null;
  readonly #enemyVitals: CombatVitals;
  #enemyVitalsRuntime: CombatVitalsRuntime | null = null;
  #enemyIdentity: CombatOperationExecutorContext['enemy'] | null = null;
  #resources: CombatResources | null = null;

  constructor(readonly options: StandardPlayerDamageEnvironmentOptions) {
    this.#enemyBuffs = new CombatBuffContainer(
      'enemy',
      new CombatAttributeSet<string>(),
      options.tagRegistry,
      null,
      undefined,
      (buff, reason) => this.#recordBuffFinished(buff, reason),
    );
    this.#enemyBuffRuntime = new BuffDefinitionOperationTarget(
      this.#enemyBuffs,
      {
        get: () => undefined,
        compile: entry => this.#compileInlineBuffDefinition(entry),
      },
      undefined,
      this.#buffAbilityEventRegistrar('enemy'),
      event => this.#emit('enemy', 'addedBuff', event),
      event => this.#emit(event.sourceId, 'beforeOutputBuff', event),
      event => this.#emit(event.sourceId, 'outputBuff', event),
    );
    // 敌人生命账本由场景装配层创建并注入，环境只持有引用，不在首次绑定时另行构造。
    this.#enemyVitals = options.enemyVitals;
    // 对象字面量中的 getter 会把自己的 this 绑定为字面量本身，因此用箭头闭包引用环境实例。
    const vitalsRuntimeOf = (): FrameRuntime | null => this.#enemyVitalsRuntime;
    this.runtimeOptions = {
      ...(options.probabilitySamples === undefined
        ? {}
        : { probabilitySamples: options.probabilitySamples }),
      enemyBuffRuntime: this.#enemyBuffRuntime,
      get enemyVitalsRuntime() {
        return vitalsRuntimeOf();
      },
      createOperatorBuffRuntime: (operatorId, panel) => {
        if (panel !== undefined) this.#ensureOperatorVitals(operatorId, panel);
        return this.#operatorBuffRuntime(operatorId, panel);
      },
      createAbilityEntityBuffRuntime: (entityId, entityBlackboard, target) =>
        new BuffDefinitionOperationTarget(
          new CombatBuffContainer(
            entityId,
            new CombatAttributeSet<string>(),
            options.tagRegistry,
            null,
            entityBlackboard,
            (buff, reason) => this.#recordOwnedBuffFinished(entityId, buff, reason),
          ),
          {
            get: () => undefined,
            compile: entry => this.#compileInlineBuffDefinition(entry),
          },
          target,
          this.#buffAbilityEventRegistrar(entityId),
          event => this.#emit(entityId, 'addedBuff', event),
          event => this.#emit(event.sourceId, 'beforeOutputBuff', event),
          event => this.#emit(event.sourceId, 'outputBuff', event),
        ),
      createOperationExecutor: context => this.#createOperationExecutor(context),
      readSourceAttributeValue: (sourceId, request) =>
        this.#readSourceAttributeValue(sourceId, request),
      emitAbilityEvent: (entityId, event, payload) => this.#emit(entityId, event, payload),
      emitOperatorEnterFight: operatorId =>
        this.#emit(operatorId, 'enterFight', {
          sourceId: operatorId,
          targetId: operatorId,
        }),
      emitExternalOperatorHit: (operatorId, payload) =>
        this.#emit(operatorId, 'takeDamage', payload),
      // 配装事件的通用操作由装配根处理；未闭环的末端操作必须严格失败。
      createEquipmentEventOperationExecutor: () => strictTerminal,
      resolveVitals: (target, operatorId, buffSourceId) => {
        if (target === 'enemy') return this.enemyVitals;
        if (target === 'caster') return this.#requireOperatorVitals(operatorId);
        return this.#resolveHealTarget(target, operatorId, this.#requireClock().frame, buffSourceId)
          .vitals;
      },
      resolveOperatorVitals: operatorId => this.#requireOperatorVitals(operatorId),
    };
  }

  get enemyVitals(): CombatVitals {
    return this.#enemyVitals;
  }

  /** 已绑定敌人时返回账本推进器；空场景（从未绑定敌人）返回 null。 */
  get enemyVitalsRuntime(): FrameRuntime | null {
    return this.#enemyVitalsRuntime;
  }

  /** 返回本场战斗内指定实体独占的事件中心，供后续 Buff、天赋和活动机制注册监听。 */
  eventsFor(entityId: string): AbilityEventDispatcher<StandardPlayerDamageEvent, unknown> {
    let dispatcher = this.#events.get(entityId);
    if (dispatcher === undefined) {
      dispatcher = new AbilityEventDispatcher();
      this.#events.set(entityId, dispatcher);
    }
    return dispatcher;
  }

  #createOperationExecutor(context: CombatOperationExecutorContext): CombatOperationExecutor {
    this.#bindEnemy(context);
    this.#resources = context.resources;
    this.#clock = context.clock;
    this.#receipt = context.receipt;
    if (context.panel !== undefined) {
      this.#operatorPanels.set(context.program.operatorId, context.panel);
      this.#ensureOperatorVitals(context.program.operatorId, context.panel);
    }
    const operatorBuffs = this.#operatorBuffRuntime(
      context.program.operatorId,
      context.panel,
    ).container;
    const damage = new PlayerDamageOperationExecutor({
      sourceOperatorId: context.program.operatorId,
      castId: context.program.castId,
      targetId: 'enemy',
      targetVitals: this.enemyVitals,
      clock: context.clock,
      receipt: context.receipt,
      captureAttributeSnapshots: step =>
        resolveStaticPlayerDamageSnapshots(context, step, operatorBuffs.attributes),
      criticalSamples: this.options.criticalSamples,
      resolveNonRandomRuntimeSnapshot: step =>
        this.options.resolveNonRandomRuntimeSnapshot(context, step),
      applyDamageModifiers: (timing, side, damageContext) =>
        this.#buffContainer(side, operatorBuffs).applyDamageModifiers(
          timing,
          side,
          damageContext,
          (condition, resolveNumber) =>
            this.#evaluateDamageModifierCondition(
              condition,
              operatorBuffs,
              damageContext,
              resolveNumber,
            ),
        ),
      addInstantAttributeModifier: (side, request) => {
        const attributes = this.#buffContainer(side, operatorBuffs).attributes;
        if (!attributes.has(request.attribute)) {
          throw new Error(
            `instant attribute '${request.attribute}' is not available on the ${side} side`,
          );
        }
        attributes.addModifier(
          new CombatAttributeModifier(
            request.attribute,
            request.values,
            ATTRIBUTE_MODIFIER_SOURCES.instant,
            request.timing,
          ),
        );
      },
      clearInstantAttributeModifiers: side =>
        this.#buffContainer(side, operatorBuffs).attributes.clearInstantModifiers(),
      emitPreparationEvent: (event, payload) =>
        this.#emit(context.program.operatorId, event, payload),
      // 失衡倍率目前只有证据不足的来源；装备/处决失衡增益接入后在此聚合。
      resolvePoiseMultipliers: () => ({ output: 1, taken: 1 }),
      emitHealthSourceEvent: (event, payload) => {
        if (event === 'afterKillEntity') {
          context.semanticEvents.emit({
            kind: 'enemyDefeated',
            sourceOperatorId: context.program.operatorId,
            tags: payload.tags,
            features: payload.features,
          });
          return;
        }
        this.#emit(context.program.operatorId, event, payload);
      },
      emitHealthTargetEvent: (event, payload) => this.#emit('enemy', event, payload),
      absorbHealthDamage: (damageType, value) => this.#enemyBuffs.absorbDamage(damageType, value),
      emitPoiseSourceEvent: (event, modifier) =>
        this.#emit(context.program.operatorId, event, modifier),
      emitPoiseTargetEvent: (event, modifier) => this.#emit('enemy', event, modifier),
      emitSemanticHit: step => {
        context.semanticEvents.emit({
          kind: 'damageTagHit',
          sourceOperatorId: context.program.operatorId,
          tags: step.parameters.tags,
          features: step.parameters.features ?? [],
        });
        context.semanticEvents.emit({
          kind: 'skillHit',
          sourceOperatorId: context.program.operatorId,
          skillGroupKey: context.program.skillGroupKey,
        });
      },
      delegate: this.#createReactionExecutor(context),
    });
    return new HealOperationExecutor({
      sourceOperatorId: context.program.operatorId,
      clock: context.clock,
      receipt: context.receipt,
      resolveSourceAttribute: attribute => {
        if (attribute === 'maxHealth') {
          return this.#requireOperatorVitals(context.program.operatorId).maxHealth;
        }
        if (context.panel === undefined) {
          throw new Error(
            `operator '${context.program.operatorId}' requires a resolved panel for healing`,
          );
        }
        return context.panel.attributes[attribute];
      },
      resolveTarget: (target, buffSourceId) =>
        this.#resolveHealTarget(
          target,
          context.program.operatorId,
          context.clock.frame,
          buffSourceId,
        ),
      delegate: damage,
    });
  }

  #createReactionExecutor(context: CombatOperationExecutorContext): CombatOperationExecutor {
    return new ElementalReactionOperationExecutor({
      sourceOperatorId: context.program.operatorId,
      castId: context.program.castId,
      targetId: 'enemy',
      clock: context.clock,
      receipt: context.receipt,
      container: this.#reactions,
      emitReactionApplied: reaction =>
        context.semanticEvents.emit({
          kind: 'reactionApplied',
          sourceOperatorId: context.program.operatorId,
          reaction,
        }),
      delegate: this.#createInflictionExecutor(context),
    });
  }

  #evaluateDamageModifierCondition(
    condition: DamageModifierExternalCondition,
    operatorBuffs: CombatBuffContainer<string>,
    damageContext: import('../damage/playerDamageContext').PlayerDamageContext,
    resolveNumber: (value: import('../damage/damageModifiers').DamageModifierNumber) => number,
  ): boolean {
    switch (condition.kind) {
      case 'entityTagMatch': {
        const target = condition.target === 'caster' ? operatorBuffs : this.#enemyBuffs;
        return target.matchesEntityTags(
          condition.tagIds.map(gameplayTagId),
          condition.tagQueryType,
        );
      }
      case 'casterControlled':
        if (this.options.isOperatorControlled === undefined || this.#clock === null) {
          throw new Error(
            'caster-controlled damage modifier requires the scenario control timeline',
          );
        }
        return this.options.isOperatorControlled(operatorBuffs.ownerId, this.#clock.frame);
      case 'buffIdCountCompare': {
        const target = condition.target === 'caster' ? operatorBuffs : this.#enemyBuffs;
        return compareCombatNumbers(
          target.getCountByIds(condition.buffIds),
          resolveNumber(condition.value),
          condition.operator,
        );
      }
      case 'eventDamageTagsMatch':
        return matchDamageProperties(damageContext.tags, condition.tags, condition.match);
      case 'eventDamageFeaturesMatch':
        return matchDamageProperties(damageContext.features, condition.features, condition.match);
      case 'eventDamageTypesMatch':
        return condition.damageTypes.includes(damageContext.damageType);
      case 'targetHealthCompare': {
        const current =
          condition.valueType === 'ratio'
            ? this.#enemyVitals.health / this.#enemyVitals.maxHealth
            : this.#enemyVitals.health;
        return compareCombatNumbers(current, resolveNumber(condition.value), condition.operator);
      }
    }
  }

  #createInflictionExecutor(context: CombatOperationExecutorContext): CombatOperationExecutor {
    if (this.options.elementalInflictionDocument === undefined) return strictTerminal;
    const adapter = this.#inflictionAdapter(context.program.operatorId);
    return new ElementalInflictionOperationExecutor({
      sourceOperatorId: context.program.operatorId,
      castId: context.program.castId,
      targetId: 'enemy',
      skillId: context.program.skillId,
      clock: context.clock,
      receipt: context.receipt,
      getExistingAttachment: () => adapter.getExistingAttachment(),
      applyOperation: (operation: ElementalInflictionOperation) => adapter.apply(operation),
      emitSemanticAttachmentConsumed: attachment =>
        context.semanticEvents.emit({
          kind: 'elementalAttachmentConsumed',
          sourceOperatorId: context.program.operatorId,
          targetId: 'enemy',
          element: attachment.element,
          layers: attachment.layers,
        }),
      emitSemanticInfliction: element =>
        context.semanticEvents.emit({
          kind: 'elementalInflictionApplied',
          sourceOperatorId: context.program.operatorId,
          elements: [element],
        }),
      emitSourceEvent: (event, payload) => this.#emit(context.program.operatorId, event, payload),
      emitTargetEvent: (event, payload) => this.#emit('enemy', event, payload),
      delegate: strictTerminal,
    });
  }

  #bindEnemy(context: CombatOperationExecutorContext): void {
    if (this.#enemyIdentity !== null && this.#enemyIdentity !== context.enemy) {
      throw new Error('standard player damage environment cannot be shared across enemies');
    }
    this.#enemyIdentity = context.enemy;
    if (this.#enemyVitalsRuntime !== null) return;
    // 生命账本在场景装配层创建；这里只按本场时钟与回执把它的逐帧推进器接入运行时。
    this.#enemyVitalsRuntime = new CombatVitalsRuntime({
      ownerId: 'enemy',
      clock: context.clock,
      vitals: this.#enemyVitals,
      receipt: context.receipt,
      emitOwnerEvent: event => this.#emit('enemy', event, {}),
    });
  }

  #ensureOperatorVitals(operatorId: string, panel: ResolvedOperatorPanel): CombatVitals {
    const existing = this.#operatorVitals.get(operatorId);
    if (existing !== undefined) return existing;
    const vitals = new CombatVitals({
      health: panel.health,
      maxHealth: panel.health,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 0,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    this.#operatorVitals.set(operatorId, vitals);
    return vitals;
  }

  #requireOperatorVitals(operatorId: string): CombatVitals {
    const vitals = this.#operatorVitals.get(operatorId);
    if (vitals === undefined) {
      throw new Error(`operator '${operatorId}' has no resolved health ledger`);
    }
    return vitals;
  }

  #resolveHealTarget(
    target: HealTarget,
    sourceOperatorId: string,
    frame: number,
    buffSourceId?: string,
  ): ResolvedHealTarget {
    if (target === 'buffSource') {
      if (buffSourceId === undefined) {
        throw new Error("heal target 'buffSource' requires a Buff lifecycle source");
      }
      return {
        operatorId: buffSourceId,
        vitals: this.#requireOperatorVitals(buffSourceId),
      };
    }
    if (target === 'caster') {
      return {
        operatorId: sourceOperatorId,
        vitals: this.#requireOperatorVitals(sourceOperatorId),
      };
    }
    const isControlled = this.options.isOperatorControlled;
    if (isControlled === undefined) {
      throw new Error(`heal target '${target}' requires the scenario control timeline`);
    }
    const controlled = [...this.#operatorVitals.keys()].filter(operatorId =>
      isControlled(operatorId, frame),
    );
    if (controlled.length !== 1) {
      throw new Error(`heal target '${target}' requires exactly one controlled operator`);
    }
    if (target === 'controlledOperator') {
      const operatorId = controlled[0]!;
      return { operatorId, vitals: this.#requireOperatorVitals(operatorId) };
    }
    const candidates = [...this.#operatorVitals.entries()].filter(
      ([operatorId]) => target === 'lowestHealthRatioOperator' || operatorId !== controlled[0],
    );
    if (candidates.length === 0) {
      throw new Error(`heal target '${target}' has no non-controlled operator`);
    }
    let selected = candidates[0]!;
    for (const candidate of candidates.slice(1)) {
      if (
        candidate[1].health / candidate[1].maxHealth <
        selected[1].health / selected[1].maxHealth
      ) {
        selected = candidate;
      }
    }
    return { operatorId: selected[0], vitals: selected[1] };
  }

  #operatorBuffRuntime(
    operatorId: string,
    panel?: ResolvedOperatorPanel,
  ): BuffDefinitionOperationTarget<string> {
    let runtime = this.#operatorBuffRuntimes.get(operatorId);
    if (runtime === undefined) {
      runtime = new BuffDefinitionOperationTarget(
        new CombatBuffContainer(
          operatorId,
          panel === undefined
            ? new CombatAttributeSet<string>()
            : createOperatorAttackAttributes(panel),
          this.options.tagRegistry,
          null,
          undefined,
          (buff, reason) => this.#recordOwnedBuffFinished(operatorId, buff, reason),
        ),
        {
          get: () => undefined,
          compile: entry => this.#compileInlineBuffDefinition(entry),
        },
        undefined,
        this.#buffAbilityEventRegistrar(operatorId),
        event => this.#emit(operatorId, 'addedBuff', event),
        event => this.#emit(event.sourceId, 'beforeOutputBuff', event),
        event => this.#emit(event.sourceId, 'outputBuff', event),
      );
      this.#operatorBuffRuntimes.set(operatorId, runtime);
    }
    return runtime;
  }

  #buffAbilityEventRegistrar(entityId: string): RegisterBuffAbilityEventAction {
    return (
      event,
      priority: number,
      handle: (payload: unknown) => void,
      samePriorityKey?: string,
    ) =>
      this.eventsFor(entityId).registerAction(
        event,
        priority,
        context => handle(context.payload),
        samePriorityKey,
      );
  }

  #compileInlineBuffDefinition(
    entry: import('../buffs/combatBuffDefinitions').CombatBuffDefinitionEntry,
  ): import('../buffs/combatBuffs').CombatBuffDefinition<string> {
    const definitions = new CompiledCombatBuffDefinitions(`inline:${entry.id}`, [entry], {
      emitElementalInflictionStarted: payload =>
        this.#emit('enemy', 'elementalInflictionStarted', payload),
      onSpellBurstTriggered: payload => this.#onSpellBurstTriggered(payload),
      readAttribute: (request, buff) => this.#readSourceAttributeValue(buff.sourceId, request),
    });
    return definitions.get(entry.id)!;
  }
  #inflictionAdapter(operatorId: string): ElementalInflictionBuffAdapter<string> {
    let adapter = this.#inflictionAdapters.get(operatorId);
    if (adapter === undefined) {
      adapter = new ElementalInflictionBuffAdapter(
        this.#enemyBuffs,
        operatorId,
        this.#ensureElementalDefinitions(),
        undefined,
        event => this.#emit('enemy', 'addedBuff', event),
      );
      this.#inflictionAdapters.set(operatorId, adapter);
    }
    return adapter;
  }

  #ensureElementalDefinitions(): CompiledCombatBuffDefinitions<string> {
    if (this.#elementalDefinitions !== null) return this.#elementalDefinitions;
    const document = this.options.elementalInflictionDocument;
    if (document === undefined) {
      throw new Error('elemental infliction requires an elemental infliction document');
    }
    this.#elementalDefinitions = compileCombatBuffDefinitions(document, {
      emitElementalInflictionStarted: payload =>
        this.#emit('enemy', 'elementalInflictionStarted', payload),
      onSpellBurstTriggered: payload => this.#onSpellBurstTriggered(payload),
      readAttribute: (request, buff) => this.#readSourceAttributeValue(buff.sourceId, request),
    });
    return this.#elementalDefinitions;
  }

  #readSourceAttributeValue(
    sourceId: string,
    request: {
      readonly attribute:
        | { readonly kind: 'specific'; readonly key: string }
        | { readonly kind: 'main' | 'secondary' | 'all' };
      readonly stage: 'armedNonConverted' | 'finalNonConverted';
    },
  ): number {
    if (request.attribute.kind === 'specific' && request.attribute.key === 'maxUltimateEnergy') {
      if (this.#resources === null) {
        throw new Error('combat resource ledger is not bound');
      }
      return this.#resources.getMaxUltimateEnergy(sourceId);
    }
    const panel = this.#operatorPanels.get(sourceId);
    if (panel === undefined) {
      throw new Error(`combat attribute source operator '${sourceId}' has no resolved panel`);
    }
    const attributes = this.#operatorBuffRuntime(sourceId, panel).container.attributes;
    const keys =
      request.attribute.kind === 'specific'
        ? [request.attribute.key]
        : request.attribute.kind === 'main'
          ? [panel.mainAttribute]
          : request.attribute.kind === 'secondary'
            ? [panel.secondaryAttribute]
            : (['strength', 'agility', 'intellect', 'will'] as const);
    return keys.reduce((total, key) => {
      if (!attributes.has(key)) {
        throw new Error(`combat attribute source '${sourceId}' has no attribute '${key}'`);
      }
      return (
        total +
        (request.stage === 'armedNonConverted'
          ? attributes.getArmed(key, ATTRIBUTE_MODIFIER_SOURCES.nonConverted)
          : attributes.get(key, ATTRIBUTE_MODIFIER_SOURCES.nonConverted))
      );
    }, 0);
  }

  /** 爆发 Buff 触发时执行爆发伤害；数据缺失处明确报错，不假装打出伤害。 */
  #onSpellBurstTriggered(payload: { readonly burstType: string; readonly sourceId: string }): void {
    const index = this.#ensureElementalDefinitions();
    const definition = index.getSpellBurst(payload.burstType);
    if (definition === null) {
      throw new Error(`spell burst '${payload.burstType}' is not declared in the buff definition`);
    }
    if (this.options.spellInflictionSettings === undefined) {
      throw new Error(
        `spell burst '${payload.burstType}' requires SkillSetting data; export it from the game and inject spellInflictionSettings`,
      );
    }
    const panel = this.#operatorPanels.get(payload.sourceId);
    if (panel === undefined) {
      throw new Error(`spell burst source operator '${payload.sourceId}' has no resolved panel`);
    }
    const settings = this.#ensureSkillSettings();
    const operatorAttributes = this.#operatorBuffRuntime(payload.sourceId, panel).container
      .attributes;
    executeSpellBurst({
      definition,
      sourceId: payload.sourceId,
      attack: resolveOperatorAttack(panel, operatorAttributes),
      // 来源附着增强属性尚未在面板落地；需要增强公式的爆发会在此明确失败。
      enhance: null,
      criticalRate: panel.criticalRate + operatorAttributes.get('criticalRate'),
      criticalDamageIncrease:
        panel.criticalDamage + operatorAttributes.get('criticalDamageIncrease'),
      criticalSample: this.options.criticalSamples.nextCriticalSample(),
      settings,
      defender: this.#requireEnemyIdentity().defenderAttributes,
      target: this.enemyVitals,
      clock: this.#requireClock(),
      receipt: this.#requireReceipt(),
      emitSourceEvent: (event, eventPayload) => this.#emit(payload.sourceId, event, eventPayload),
      emitTargetEvent: (event, eventPayload) => this.#emit('enemy', event, eventPayload),
    });
  }

  #ensureSkillSettings(): CompoundStatusSkillSettingSource {
    const document = this.options.spellInflictionSettings;
    if (document === undefined) {
      throw new Error('spell burst requires SkillSetting data');
    }
    if (this.#skillSettings === null) {
      this.#skillSettings = createSkillSettingSource(document);
    }
    return this.#skillSettings;
  }

  #requireEnemyIdentity(): NonNullable<CombatOperationExecutorContext['enemy']> {
    if (this.#enemyIdentity === null) {
      throw new Error('standard player damage environment has not been bound to an enemy');
    }
    return this.#enemyIdentity;
  }

  #requireClock(): CombatClock {
    // 爆发只会在技能运行时触发，此时绑定敌人的执行器上下文时钟仍然可用。
    const clock = this.#clock;
    if (clock === null) {
      throw new Error('standard player damage environment has no battle clock');
    }
    return clock;
  }

  #requireReceipt(): CombatReceiptSink {
    const receipt = this.#receipt;
    if (receipt === null) {
      throw new Error('standard player damage environment has no battle receipt');
    }
    return receipt;
  }

  /** 敌人 Buff 结束（到期、消费、驱散等）时记录结束事实，供效果投影画段。 */
  #recordBuffFinished(buff: CombatBuff<string>, reason: BuffFinishReason): void {
    this.#recordOwnedBuffFinished('enemy', buff, reason);
  }

  #recordOwnedBuffFinished(
    ownerId: string,
    buff: CombatBuff<string>,
    reason: BuffFinishReason,
  ): void {
    if (this.#clock === null || this.#receipt === null) {
      throw new Error(`Buff on '${ownerId}' finished before the environment was bound to a battle`);
    }
    this.#receipt.record({
      frame: this.#clock.frame,
      time: this.#clock.time,
      event: 'BuffFinished',
      targetId: ownerId,
      data: {
        buffId: buff.definition.id,
        reason,
        layers: buff.enhanceCount,
      },
    });
    this.#emit(ownerId, 'finishedBuff', {
      sourceId: ownerId,
      targetId: ownerId,
      buffId: buff.definition.id,
      reason,
    });
  }

  #buffContainer(
    side: DamageModifierSide,
    operatorBuffs: CombatBuffContainer<string>,
  ): CombatBuffContainer<string> {
    return side === 'attacker' ? operatorBuffs : this.#enemyBuffs;
  }

  #emit(entityId: string, event: StandardPlayerDamageEvent, payload: unknown): void {
    this.eventsFor(entityId).dispatch({ event, payload }, []);
    if (event === 'takeDamage' && isCriticalDamagePayload(payload)) {
      this.eventsFor(entityId).dispatch({ event: 'takeCriticalDamage', payload }, []);
    }
  }
}

function isCriticalDamagePayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  const result = (payload as { readonly result?: unknown }).result;
  return (
    typeof result === 'object' &&
    result !== null &&
    (result as { readonly isCritical?: unknown }).isCritical === true
  );
}

function matchDamageProperties<T extends DamageTag | DamageFeature>(
  actualValues: readonly T[],
  expectedValues: readonly T[],
  match: 'exact' | 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll',
): boolean {
  const actual = new Set(actualValues);
  const hasAny = expectedValues.some(value => actual.has(value));
  const hasAll = expectedValues.every(value => actual.has(value));
  switch (match) {
    case 'exact':
      return actual.size === new Set(expectedValues).size && hasAll;
    case 'hasAny':
      return hasAny;
    case 'hasAll':
      return hasAll;
    case 'exceptAny':
      return !hasAny;
    case 'exceptAll':
      return !hasAll;
  }
}
