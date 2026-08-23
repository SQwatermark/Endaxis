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
  ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE,
  createOperatorAttackAttributes,
  resolveOperatorAttack,
} from '../attributes/operatorAttackAttributes';
import {
  MAIN_ATTRIBUTE_ATTACK_FACTOR,
  SECONDARY_ATTRIBUTE_ATTACK_FACTOR,
} from '../../game-data/battleConstants';
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
import type { CompoundStatusFactoriesDocument } from '../infliction/compoundStatusFactories';
import { executeCompoundStatusFactory } from '../infliction/compoundStatusFactory';
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
import { resolvePlayerActiveDamageInput } from '../damage/playerActiveDamageInput';
import { calculatePlayerActiveDamage } from '../damage/playerActiveDamage';
import { executeHealthDamage } from '../damage/healthDamage';
import { AbilityEventDispatcher } from '../events/abilityEventDispatcher';
import type { CriticalSampleSource } from '../random/criticalSampleSource';
import type { ProbabilitySampleSource } from '../random/probabilitySampleSource';
import { BuffDefinitionOperationTarget } from './buffDefinitionOperationTarget';
import type {
  CombatBattleRuntimeContext,
  CombatOperationExecutorContext,
  CombatRuntimeAssemblyOptions,
} from './combatRuntimeAssembly';
import { CombatVitals } from './combatVitals';
import { CombatVitalsRuntime } from './combatVitalsRuntime';
import { PlayerDamageOperationExecutor } from './playerDamageOperationExecutor';
import type { CombatOperationExecutor } from './skillRuntime';
import type { FrameRuntime } from './combatSimulation';
import {
  initializeEnemyResistanceAttributes,
  resolveStaticPlayerDamageSnapshots,
} from './staticPlayerDamageSnapshots';
import { gameplayTagId, type GameplayTagRegistry } from '../tags/gameplayTags';
import { HealOperationExecutor, type ResolvedHealTarget } from './healOperationExecutor';
import { compareCombatNumbers } from './numericComparison';
import type { RegisterBuffAbilityEventAction } from './buffLifecycleSequenceRuntime';
import type { CombatResources } from './combatResources';
import type { HealModifierSide } from '../heal/healModifiers';

type DamageStep = Extract<ResolvedCombatStep, { kind: 'dealDamage' | 'dealFixedDamage' }>;
type EnvironmentOptions = Pick<
  CombatRuntimeAssemblyOptions,
  | 'enemyBuffRuntime'
  | 'bindBattleRuntime'
  | 'enemyVitalsRuntime'
  | 'createOperatorBuffRuntime'
  | 'createAbilityEntityBuffRuntime'
  | 'resolveUltimateEnergyGainMultiplier'
  | 'createOperationExecutor'
  | 'emitAbilityEvent'
  | 'createEquipmentEventOperationExecutor'
  | 'resolveVitals'
  | 'resolveOperatorVitals'
  | 'probabilitySamples'
  | 'readSourceAttributeValue'
  | 'emitOperatorEnterFight'
  | 'emitExternalOperatorHit'
  | 'emitExternalOperatorWeaknessTriggeredOutput'
>;

export type StandardPlayerDamageEvent =
  | 'enterFight'
  | 'ownerHpZero'
  | 'beforeDamageAction'
  | 'beforeCalculateDamage'
  | 'beforeTakeDamage'
  | 'beforeTakePhysicalInfliction'
  | 'beforeTakeSpellInfliction'
  | 'beforeOutputDamage'
  | 'beforeKillEntity'
  | 'afterKillEntity'
  | 'takeDamage'
  | 'takeCriticalDamage'
  | 'outputDamage'
  | 'outputHeal'
  | 'receiveHeal'
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
  | 'finishedBuff'
  | 'afterOutputWeaknessTriggered';

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
  /** 异类附着按元素方向读取的原生短生命周期工厂。 */
  readonly compoundStatusFactories?: CompoundStatusFactoriesDocument;
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
  readonly #enemyResistanceAttributes: CombatAttributeSet<string>;
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
  #boundByAssembly = false;

  constructor(readonly options: StandardPlayerDamageEnvironmentOptions) {
    const enemyAttributes = new CombatAttributeSet<string>();
    this.#enemyResistanceAttributes = enemyAttributes;
    this.#enemyBuffs = new CombatBuffContainer(
      'enemy',
      enemyAttributes,
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
      event => {
        this.#recordOwnedBuffApplied('enemy', event, this.#enemyBuffs);
        this.#emit('enemy', 'addedBuff', event);
      },
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
      bindBattleRuntime: context => {
        this.#bindBattleRuntime(context, true);
        return { enemyVitalsRuntime: this.#enemyVitalsRuntime };
      },
      get enemyVitalsRuntime() {
        return vitalsRuntimeOf();
      },
      createOperatorBuffRuntime: (operatorId, panel) => {
        if (panel !== undefined) {
          this.#operatorPanels.set(operatorId, panel);
          this.#ensureOperatorVitals(operatorId, panel);
        }
        return this.#operatorBuffRuntime(operatorId, panel);
      },
      resolveUltimateEnergyGainMultiplier: operatorId =>
        this.#operatorBuffRuntime(operatorId).container.attributes.get('UltimateSpGainScalar'),
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
      emitExternalOperatorHit: (operatorId, payload) => {
        this.#emit(operatorId, 'beforeTakeDamage', payload);
        this.#emit(operatorId, 'takeDamage', payload);
      },
      emitExternalOperatorWeaknessTriggeredOutput: operatorId =>
        this.#emit(operatorId, 'afterOutputWeaknessTriggered', {
          sourceId: operatorId,
          targetId: 'enemy',
        }),
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
    this.#bindBattleRuntime(context);
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
      skillType: context.program.skillType,
      targetId: 'enemy',
      targetVitals: this.enemyVitals,
      clock: context.clock,
      receipt: context.receipt,
      ...(context.panel?.attackDetail === undefined
        ? {}
        : {
            attackDetail: {
              panelAttack: context.panel.attack,
              ...context.panel.attackDetail,
              mainAttribute: context.panel.mainAttribute,
              secondaryAttribute: context.panel.secondaryAttribute,
              attributes: context.panel.attributes,
              coefficients: Object.fromEntries(
                Object.keys(ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE).map(attribute => [
                  attribute,
                  (context.panel!.mainAttribute === attribute ? MAIN_ATTRIBUTE_ATTACK_FACTOR : 0) +
                    (context.panel!.secondaryAttribute === attribute
                      ? SECONDARY_ATTRIBUTE_ATTACK_FACTOR
                      : 0),
                ]),
              ) as Record<keyof typeof ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE, number>,
            },
          }),
      captureAttributeSnapshots: step =>
        resolveStaticPlayerDamageSnapshots(
          context,
          step,
          operatorBuffs.attributes,
          this.#enemyResistanceAttributes,
        ),
      criticalSamples: this.options.criticalSamples,
      isCriticalForced: step =>
        step.key !== undefined &&
        (context.program.simulationInputs?.forcedCriticalStepKeys ?? []).includes(step.key),
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
        if (context.program.skillGroupKey.length > 0) {
          context.semanticEvents.emit({
            kind: 'skillHit',
            sourceOperatorId: context.program.operatorId,
            skillGroupKey: context.program.skillGroupKey,
          });
        }
      },
      delegate: this.#createReactionExecutor(context),
    });
    return new HealOperationExecutor({
      sourceOperatorId: context.program.operatorId,
      clock: context.clock,
      receipt: context.receipt,
      resolveSourceAttribute: (sourceOperatorId, attribute) =>
        this.#readSourceAttributeValue(sourceOperatorId, {
          attribute: { kind: 'specific', key: attribute },
          stage: 'finalNonConverted',
        }),
      resolveTarget: (target, buffSourceId, buffOwnerId) =>
        this.#resolveHealTarget(
          target,
          context.program.operatorId,
          context.clock.frame,
          buffSourceId,
          buffOwnerId,
        ),
      applyHealModifiers: (timing, side, healContext) =>
        this.#healBuffContainer(
          side,
          healContext.healerId,
          healContext.receiverId,
        ).applyHealModifiers(timing, side, healContext),
      resolveHealingIncrease: (side, operatorId) =>
        this.#readSourceAttributeValue(operatorId, {
          attribute: {
            kind: 'specific',
            key: side === 'healer' ? 'healOutputIncrease' : 'healTakenIncrease',
          },
          stage: 'finalNonConverted',
        }),
      emitSuccessfulHeal: event => {
        if (event.event === 'outputHeal') {
          this.#emit(event.sourceId, event.event, event);
          return;
        }
        this.#emit(event.targetId, event.event, event);
        context.semanticEvents.emit({
          kind: 'operatorHealed',
          sourceOperatorId: event.sourceId,
          targetOperatorId: event.targetId,
          requestedHealing: event.requestedHealing,
          actualHealing: event.actualHealing,
          overhealing: event.overhealing,
          tagIds: event.tagIds,
        });
      },
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

  #bindBattleRuntime(context: CombatBattleRuntimeContext, byAssembly = false): void {
    if (this.#boundByAssembly && this.#clock !== context.clock) {
      throw new Error('standard player damage environment cannot be shared across battle clocks');
    }
    if (this.#boundByAssembly && this.#receipt !== context.receipt) {
      throw new Error('standard player damage environment cannot be shared across battle receipts');
    }
    if (this.#boundByAssembly && this.#resources !== context.resources) {
      throw new Error(
        'standard player damage environment cannot be shared across battle resources',
      );
    }
    if (this.#enemyIdentity !== null && this.#enemyIdentity !== context.enemy) {
      throw new Error('standard player damage environment cannot be shared across enemies');
    }
    this.#clock = context.clock;
    this.#receipt = context.receipt;
    this.#resources = context.resources;
    this.#enemyIdentity = context.enemy;
    if (byAssembly) this.#boundByAssembly = true;
    if (!this.#enemyResistanceAttributes.has('FireResistance')) {
      initializeEnemyResistanceAttributes(
        this.#enemyResistanceAttributes,
        context.enemy.defenderAttributes,
      );
    }
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
    buffOwnerId?: string,
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
    if (target === 'buffOwner') {
      if (buffOwnerId === undefined) {
        throw new Error("heal target 'buffOwner' requires a Buff lifecycle owner");
      }
      return {
        operatorId: buffOwnerId,
        vitals: this.#requireOperatorVitals(buffOwnerId),
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
      const container = new CombatBuffContainer(
        operatorId,
        panel === undefined
          ? new CombatAttributeSet<string>()
          : createOperatorAttackAttributes(panel),
        this.options.tagRegistry,
        null,
        undefined,
        (buff, reason) => this.#recordOwnedBuffFinished(operatorId, buff, reason),
      );
      runtime = new BuffDefinitionOperationTarget(
        container,
        {
          get: () => undefined,
          compile: entry => this.#compileInlineBuffDefinition(entry),
        },
        undefined,
        this.#buffAbilityEventRegistrar(operatorId),
        event => {
          this.#recordOwnedBuffApplied(operatorId, event, container);
          this.#emit(operatorId, 'addedBuff', event);
        },
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
      onAttackScaledDamageTriggered: payload => this.#onBuffDamageTriggered(payload),
      readAttribute: (request, buff) => this.#readSourceAttributeValue(buff.sourceId, request),
    });
    return definitions.get(entry.id)!;
  }
  #inflictionAdapter(operatorId: string): ElementalInflictionBuffAdapter<string> {
    let adapter = this.#inflictionAdapters.get(operatorId);
    if (adapter === undefined) {
      const resolveCompoundStatusBlackboard =
        this.options.compoundStatusFactories === undefined
          ? undefined
          : (
              consumedElement: 'heat' | 'electric' | 'cryo' | 'nature',
              incomingElement: 'heat' | 'electric' | 'cryo' | 'nature',
              inputBlackboard: Readonly<Record<string, number>>,
            ) => {
              const catalog = this.options.compoundStatusFactories!;
              const factory = catalog.factories.find(
                entry =>
                  entry.consumedElement === consumedElement &&
                  entry.incomingElement === incomingElement,
              );
              if (factory === undefined) {
                throw new Error(
                  `compound status '${consumedElement}->${incomingElement}' has no factory`,
                );
              }
              const settings = this.#ensureSkillSettings();
              const enhance = this.#operatorBuffRuntime(operatorId).container.attributes.get(
                'PhysicalAndSpellInflictionEnhance',
              );
              const result = executeCompoundStatusFactory(
                factory,
                inputBlackboard,
                enhance,
                settings,
              );
              const definition = this.#ensureElementalDefinitions().getCompoundStatus(
                consumedElement,
                incomingElement,
              );
              if (definition.id !== result.buffId) {
                throw new Error(
                  `compound-status factory '${factory.id}' creates '${result.buffId}', ` +
                    `but the registered definition is '${definition.id}'`,
                );
              }
              return result.blackboardValues as Readonly<Record<string, number>>;
            };
      adapter = new ElementalInflictionBuffAdapter(
        this.#enemyBuffs,
        operatorId,
        this.#ensureElementalDefinitions(),
        undefined,
        event => {
          this.#recordOwnedBuffApplied('enemy', event, this.#enemyBuffs);
          this.#emit('enemy', 'addedBuff', event);
        },
        resolveCompoundStatusBlackboard,
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
      onAttackScaledDamageTriggered: payload => this.#onBuffDamageTriggered(payload),
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
    if (request.attribute.kind === 'specific' && request.attribute.key === 'maxHealth') {
      return this.#requireOperatorVitals(sourceId).maxHealth;
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
      enhance: operatorAttributes.get('PhysicalAndSpellInflictionEnhance'),
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

  /** 执行复合状态 Buff 生命周期中的原生 DamageAction。 */
  #onBuffDamageTriggered(payload: {
    readonly damageType: import('../../game-data/operatorDefinition').DamageType;
    readonly attackScale: number;
    readonly tags: readonly DamageTag[];
    readonly features: readonly DamageFeature[];
    readonly canCritical: boolean;
    readonly sourceId: string;
  }): void {
    const panel = this.#operatorPanels.get(payload.sourceId);
    if (panel === undefined) {
      throw new Error(`buff damage source operator '${payload.sourceId}' has no resolved panel`);
    }
    const attributes = this.#operatorBuffRuntime(payload.sourceId, panel).container.attributes;
    const attack = resolveOperatorAttack(panel, attributes);
    const step = {
      kind: 'dealDamage' as const,
      parameters: {
        damageType: payload.damageType,
        attackScale: payload.attackScale,
        tags: payload.tags,
        features: payload.features,
      },
    };
    const damage = calculatePlayerActiveDamage(
      resolvePlayerActiveDamageInput({
        step,
        finalAttackValue: attack * payload.attackScale,
        attacker: {
          attack,
          criticalRate: payload.canCritical
            ? panel.criticalRate + attributes.get('criticalRate')
            : 0,
          criticalDamageIncrease: panel.criticalDamage + attributes.get('criticalDamageIncrease'),
          weaknessDamageMultiplier: 1,
          igniteDamageMultiplier: 1,
          physicalInflictionDamageMultiplier: 1,
        },
        defender: this.#requireEnemyIdentity().defenderAttributes,
        runtime: {
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: payload.tags.includes('fireAbnormal'),
          appliesPhysicalInflictionDamageMultiplier:
            payload.features.includes('physicalInfliction'),
          // 原生 DamageAction 明确禁止暴击时，不应推进暴击随机流；否则持续伤害会改变后续技能的暴击序列。
          criticalSample: payload.canCritical
            ? this.options.criticalSamples.nextCriticalSample()
            : 1,
        },
      }),
    );
    const state = executeHealthDamage({
      sourceId: payload.sourceId,
      targetId: 'enemy',
      damageType: payload.damageType,
      tags: payload.tags,
      features: payload.features,
      result: damage,
      target: this.enemyVitals,
      clock: this.#requireClock(),
      receipt: this.#requireReceipt(),
      emitSourceEvent: (event, eventPayload) => this.#emit(payload.sourceId, event, eventPayload),
      emitTargetEvent: (event, eventPayload) => this.#emit('enemy', event, eventPayload),
    });
    this.#requireReceipt().record({
      frame: this.#requireClock().frame,
      time: this.#requireClock().time,
      event: 'BuffDamageApplied',
      sourceId: payload.sourceId,
      targetId: 'enemy',
      data: {
        damageType: payload.damageType,
        attackScale: payload.attackScale,
        value: damage.value,
        actualDamage: state.actualDamage,
        remainingHealth: state.currentHealth,
      },
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

  /** Buff 施加成功后记录实例身份与原生展示数据，供时间轴还原生命周期和图标。 */
  #recordOwnedBuffApplied(
    ownerId: string,
    event: import('./buffOperationExecutor').BuffAppliedEvent,
    container: CombatBuffContainer<string>,
  ): void {
    if (this.#clock === null || this.#receipt === null) {
      throw new Error(
        `Buff on '${ownerId}' was applied before the environment was bound to a battle`,
      );
    }
    const clock = this.#clock;
    const receipt = this.#receipt;
    const buff = [...container.buffs]
      .reverse()
      .find(candidate => !candidate.isFinished && candidate.definition.id === event.buffId);
    if (buff === undefined) {
      throw new Error(`Applied Buff '${event.buffId}' on '${ownerId}' has no active instance`);
    }
    const presentation = buff.definition.presentation;
    const recordPresentation = (
      eventName: 'BuffApplied' | 'BuffPresentationStarted',
      buffId: string,
      currentPresentation:
        NonNullable<CombatBuff<string>['definition']['presentation']> | undefined,
      parentBuffId?: string,
    ): void =>
      receipt.record({
        frame: clock.frame,
        time: clock.time,
        event: eventName,
        sourceId: event.sourceId,
        targetId: ownerId,
        data: {
          buffId,
          instanceId: buff.instanceId,
          layers: buff.enhanceCount,
          ...(parentBuffId === undefined ? {} : { parentBuffId }),
          ...(currentPresentation?.iconId === undefined
            ? {}
            : { iconId: currentPresentation.iconId }),
          ...(currentPresentation?.iconPath === undefined
            ? {}
            : { iconPath: currentPresentation.iconPath }),
          ...(currentPresentation?.visible === undefined
            ? {}
            : { visible: currentPresentation.visible }),
        },
      });
    recordPresentation('BuffApplied', buff.definition.id, presentation);
    for (const child of buff.definition.childPresentations ?? []) {
      recordPresentation(
        'BuffPresentationStarted',
        child.buffId,
        child.presentation,
        buff.definition.id,
      );
    }
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
        instanceId: buff.instanceId,
        reason,
        layers: buff.enhanceCount,
      },
    });
    for (const child of buff.definition.childPresentations ?? []) {
      this.#receipt.record({
        frame: this.#clock.frame,
        time: this.#clock.time,
        event: 'BuffPresentationFinished',
        targetId: ownerId,
        data: {
          buffId: child.buffId,
          parentBuffId: buff.definition.id,
          instanceId: buff.instanceId,
          reason,
          layers: buff.enhanceCount,
        },
      });
    }
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

  #healBuffContainer(
    side: HealModifierSide,
    healerId: string,
    receiverId: string,
  ): CombatBuffContainer<string> {
    const operatorId = side === 'healer' ? healerId : receiverId;
    return this.#operatorBuffRuntime(operatorId, this.#operatorPanels.get(operatorId)).container;
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
