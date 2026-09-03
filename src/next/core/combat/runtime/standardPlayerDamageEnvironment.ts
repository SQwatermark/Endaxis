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
import {
  ElementalInflictionOperationExecutor,
  type ElementalInflictionEvent,
  type ElementalInflictionEventPayload,
} from './elementalInflictionOperationExecutor';
import { ComboSkillConditionRuntime } from './comboSkillConditionRuntime';
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
  CombatDamageExecutorContext,
  CombatRuntimeAssemblyOptions,
} from './combatRuntimeAssembly';
import { CombatVitals } from './combatVitals';
import { CombatVitalsRuntime } from './combatVitalsRuntime';
import { PlayerDamageOperationExecutor } from './playerDamageOperationExecutor';
import type { CombatOperationExecutor } from './skillRuntime';
import type { FrameRuntime } from './combatSimulation';
import {
  initializeEnemyCombatAttributes,
  resolveStaticPlayerDamageSnapshots,
} from './staticPlayerDamageSnapshots';
import type { GameplayTagRegistry } from '../tags/gameplayTags';
import { HealOperationExecutor, type ResolvedHealTarget } from './healOperationExecutor';
import { compareCombatNumbers } from './numericComparison';
import type { RegisterBuffAbilityEventAction } from './buffLifecycleSequenceRuntime';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import {
  hasAbilityEventActionContextBinding,
  resolveAbilityEventActionContextBinding,
} from '../events/abilityEventActionContext';
import type { CombatResources } from './combatResources';
import { BuffProgressRecorder, type BuffProgressCurve } from './buffProgressRecorder';
import type { HealModifierSide } from '../heal/healModifiers';
import type { GameplayTagPredefine } from '../tags/gameplayTagPredefine';
import { OrdinaryKnockDownRuntime } from './ordinaryKnockDownRuntime';
import {
  KnockDownOperationExecutor,
  type KnockDownAbilityEvent,
} from './knockDownOperationExecutor';

type DamageStep = Extract<ResolvedCombatStep, { kind: 'dealDamage' | 'dealFixedDamage' }>;

const MULTIPLICATIVE_ATTRIBUTE_SLOTS = new Set(['finalMultiplier', 'baseFinalMultiplier']);

/**
 * 只有“一项属性修正、一个非单位槽位”才可自动摘要。
 * 这里记录原始事实，不在战斗回执中写本地化名称或猜测复杂 Buff 的总效果。
 */
function simpleAttributeModifierFact(buff: CombatBuff<string>):
  | {
      readonly simpleModifierAttribute: string;
      readonly simpleModifierSlot: string;
      readonly simpleModifierValue: number;
    }
  | undefined {
  if (buff.attributeModifiers.length !== 1) return undefined;
  const modifier = buff.attributeModifiers[0]!;
  const changed = Object.entries(modifier.values).filter(([slot, value]) => {
    const identity = MULTIPLICATIVE_ATTRIBUTE_SLOTS.has(slot) ? 1 : 0;
    return Math.abs(value - identity) > 0.0000001;
  });
  if (changed.length !== 1) return undefined;
  const [slot, value] = changed[0]!;
  return {
    simpleModifierAttribute: modifier.attribute,
    simpleModifierSlot: slot,
    simpleModifierValue: value,
  };
}

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
  | 'registerEquipmentAbilityEventAction'
  | 'registerComboSkillCondition'
  | 'comboConditionEligibility'
  | 'resolveVitals'
  | 'resolveOperatorVitals'
  | 'probabilitySamples'
  | 'readSourceAttributeValue'
  | 'emitOperatorEnterFight'
  | 'emitExternalOperatorHit'
  | 'emitExternalOperatorWeaknessTriggeredOutput'
  | 'emitExternalEnemyWeaknessSet'
  | 'emitBuffLifecycleAbilityEvent'
>;

export type StandardPlayerDamageEvent =
  | KnockDownAbilityEvent
  | 'enterFight'
  | 'ownerHpZero'
  | 'ownerDead'
  | 'ownerSwitchedToCenter'
  | 'ownerSwitchedToGuard'
  | 'abilityEntitySpawned'
  | 'abilityEntityFinished'
  | 'beforeDamageAction'
  | 'beforeCalculateDamage'
  | 'beforeTakeDamage'
  | 'beforeTakePhysicalInfliction'
  | 'beforeOutputPhysicalInfliction'
  | 'afterOutputPhysicalInfliction'
  | 'beforeTakeSpellInfliction'
  | 'beforeOutputDamage'
  | 'beforeKillEntity'
  | 'afterKillEntity'
  | 'takeDamage'
  | 'takeCriticalDamage'
  | 'outputDamage'
  | 'outputCriticalDamage'
  | 'outputHeal'
  | 'receiveHeal'
  | 'beforeOutputPoiseDamage'
  | 'beforeTakePoiseDamage'
  | 'takePoiseDamage'
  | 'poiseZero'
  | 'beforeOutputInfliction'
  | 'beforeOutputSpellBurst'
  | 'beforeTakeInfliction'
  | 'afterOutputInfliction'
  | 'afterTakeInfliction'
  | 'elementalInflictionStarted'
  | 'poiseRecovered'
  | 'beforeCastSkill'
  | 'afterSkillApplyCost'
  | 'skillEnd'
  | 'pendingComboSkillsCleared'
  | 'beforeOutputBuff'
  | 'beforeAddedBuff'
  | 'outputBuff'
  | 'addedBuff'
  | 'finishedBuff'
  | 'buffEndsEarly'
  | 'buffConsumed'
  | 'buffAbsorbed'
  | 'buffEnhanceChanged'
  | 'afterOutputWeaknessTriggered'
  | 'weaknessSet'
  | 'customAbilityEvent';

export interface StandardPlayerDamageEnvironmentOptions {
  /** 暴击样本和命中特殊倍率必须由具有证据的上层策略提供。 */
  readonly criticalSamples: CriticalSampleSource;
  /** RandomUtil.Dice 的独立样本源，不与暴击随机流混用。 */
  readonly probabilitySamples?: ProbabilitySampleSource;
  readonly resolveNonRandomRuntimeSnapshot: (
    context: CombatDamageExecutorContext,
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
  /** 原生角色专属 HUD 直接跟踪的 Buff；与通用图标进度标志相互独立。 */
  readonly passiveProgressBuffIdsByOperator?: ReadonlyMap<string, ReadonlySet<string>>;
  /**
   * 普通倒地的显式装配端口。到期策略必须来自当前闭包的消费者审计；
   * 不默认注入零秒起身，也不因存在本端口就放开标准场景预检。
   */
  readonly knockDown?: {
    readonly predefine: GameplayTagPredefine;
    readonly onDurationElapsed: (runtime: OrdinaryKnockDownRuntime) => void;
  };
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
  readonly #enemyAttributes: CombatAttributeSet<string>;
  readonly #enemyBuffs: CombatBuffContainer<string>;
  readonly #enemyBuffRuntime: BuffDefinitionOperationTarget<string>;
  readonly #enemyKnockDown: OrdinaryKnockDownRuntime | null;
  readonly #operatorBuffRuntimes = new Map<string, BuffDefinitionOperationTarget<string>>();
  readonly #inflictionAdapters = new Map<string, ElementalInflictionBuffAdapter<string>>();
  readonly #reactionModifiers = new Map<
    string,
    NonNullable<import('./combatRuntimeAssembly').CombatOperatorProgram['reactionModifiers']>
  >();
  #resolveAbilitySystemSourceId: (entityId: string) => string = entityId => entityId;
  readonly #reactions = new ElementalReactionContainer();
  readonly #operatorPanels = new Map<string, ResolvedOperatorPanel>();
  readonly #operatorVitals = new Map<string, CombatVitals>();
  readonly #buffProgress = new BuffProgressRecorder();
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
    this.#enemyAttributes = enemyAttributes;
    this.#enemyBuffs = new CombatBuffContainer(
      'enemy',
      enemyAttributes,
      options.tagRegistry,
      null,
      undefined,
      (buff, reason) => this.#recordBuffFinished(buff, reason),
      (buff, sourceId) => this.#recordOwnedBuffEnhanceChanged('enemy', buff, sourceId),
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
      event => this.#emit('enemy', 'beforeAddedBuff', event),
    );
    // 敌人生命账本由场景装配层创建并注入，环境只持有引用，不在首次绑定时另行构造。
    this.#enemyVitals = options.enemyVitals;
    this.#enemyKnockDown =
      options.knockDown === undefined
        ? null
        : new OrdinaryKnockDownRuntime(
            this.#enemyBuffs,
            options.knockDown.predefine,
            options.knockDown.onDurationElapsed,
          );
    // 对象字面量中的 getter 会把自己的 this 绑定为字面量本身，因此用箭头闭包引用环境实例。
    const vitalsRuntimeOf = (): FrameRuntime | null => this.#enemyVitalsRuntime;
    this.runtimeOptions = {
      ...(options.probabilitySamples === undefined
        ? {}
        : { probabilitySamples: options.probabilitySamples }),
      enemyBuffRuntime: this.#enemyBuffRuntime,
      bindBattleRuntime: context => {
        this.#bindBattleRuntime(context, true);
        return {
          enemyVitalsRuntime: this.#enemyVitalsRuntime,
          enemyControlRuntime: this.#enemyKnockDown,
        };
      },
      get enemyVitalsRuntime() {
        return vitalsRuntimeOf();
      },
      createOperatorBuffRuntime: (operatorId, panel, reactionModifiers) => {
        if (reactionModifiers !== undefined)
          this.#reactionModifiers.set(operatorId, reactionModifiers);
        if (panel !== undefined) {
          this.#operatorPanels.set(operatorId, panel);
          this.#ensureOperatorVitals(operatorId, panel);
        }
        return this.#operatorBuffRuntime(operatorId, panel);
      },
      resolveUltimateEnergyGainMultiplier: operatorId =>
        this.#operatorBuffRuntime(operatorId).container.attributes.get('UltimateSpGainScalar'),
      createAbilityEntityBuffRuntime: (entityId, entityBlackboard, target, bornTags) => {
        const container = new CombatBuffContainer(
          entityId,
          new CombatAttributeSet<string>(),
          options.tagRegistry,
          null,
          entityBlackboard,
          (buff, reason) => this.#recordOwnedBuffFinished(entityId, buff, reason),
          (buff, sourceId) => this.#recordOwnedBuffEnhanceChanged(entityId, buff, sourceId),
        );
        container.addEntityTags(bornTags);
        return new BuffDefinitionOperationTarget(
          container,
          {
            get: () => undefined,
            compile: entry => this.#compileInlineBuffDefinition(entry),
          },
          target,
          this.#buffAbilityEventRegistrar(entityId),
          event => this.#emit(entityId, 'addedBuff', event),
          event => this.#emit(event.sourceId, 'beforeOutputBuff', event),
          event => this.#emit(event.sourceId, 'outputBuff', event),
          event => this.#emit(entityId, 'beforeAddedBuff', event),
        );
      },
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
      emitExternalEnemyWeaknessSet: () =>
        this.#emit('enemy', 'weaknessSet', {
          sourceId: 'enemy',
          targetId: 'enemy',
        }),
      emitBuffLifecycleAbilityEvent: (event, payload) =>
        this.#emit(payload.sourceId, event, payload),
      createEquipmentEventOperationExecutor: context => this.#createOperationExecutor(context),
      registerEquipmentAbilityEventAction: (operatorId, event, priority, handle) =>
        this.eventsFor(operatorId).registerAction(event, priority, context =>
          handle(
            context.payload,
            this.#resolveAbilityEventRuntimeActionContext(event, context.payload),
          ),
        ),
      registerComboSkillCondition: registration =>
        this.comboConditions.registerPendingCondition(registration),
      // 固定木桩投影：没有干员死亡或敌方沉默状态；不把 HP=0 当 markDie，也不猜查询 Tag。
      // 未来若引入这两类外部事实，调用方必须覆盖该资格端口。
      comboConditionEligibility: { isAlive: () => true, isSilenced: () => false },
      resolveVitals: (target, operatorId, buffSourceId) => {
        if (target === 'enemy') return this.enemyVitals;
        if (target === 'caster') return this.#requireOperatorVitals(operatorId);
        return this.#resolveHealTarget(target, operatorId, this.#requireClock().frame, buffSourceId)
          .vitals;
      },
      resolveOperatorVitals: operatorId => this.#requireOperatorVitals(operatorId),
    };
  }

  get buffProgressCurves(): readonly BuffProgressCurve[] {
    return this.#buffProgress.snapshot();
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

  #createOperationExecutor(context: CombatDamageExecutorContext): CombatOperationExecutor {
    const program = 'program' in context ? context.program : undefined;
    const operatorId =
      'program' in context
        ? (context.sourceOperatorId ?? context.program.operatorId)
        : context.operatorId;
    if ('program' in context && context.resolveAbilitySystemSourceId !== undefined) {
      this.#resolveAbilitySystemSourceId = context.resolveAbilitySystemSourceId;
    }
    this.#bindBattleRuntime(context);
    if (context.panel !== undefined) {
      this.#operatorPanels.set(operatorId, context.panel);
      this.#ensureOperatorVitals(operatorId, context.panel);
    }
    const operatorBuffs = this.#operatorBuffRuntime(operatorId, context.panel).container;
    const damage = new PlayerDamageOperationExecutor({
      sourceOperatorId: operatorId,
      castId: program?.castId,
      skillId: program?.skillId,
      skillType: program?.skillType,
      ...('program' in context
        ? {}
        : {
            sourceActionId: `equipment:${context.source.kind}:${context.source.slug}:${context.handlerKey}`,
          }),
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
          this.#enemyAttributes,
        ),
      criticalSamples: this.options.criticalSamples,
      isCriticalForced: step =>
        step.key !== undefined &&
        (program?.simulationInputs?.forcedCriticalStepKeys ?? []).includes(step.key),
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
      emitPreparationEvent: (event, payload) => this.#emit(operatorId, event, payload),
      // PoiseDamageOutputScalar 的基础值为 1；构筑面板保存 BaseAddition 的增量。
      resolvePoiseMultipliers: () => ({
        output: 1 + (context.panel?.staggerDamagePercent ?? 0),
        taken: 1,
      }),
      applyPoiseModifiers: (timing, side, poiseContext) =>
        this.#buffContainer(side, operatorBuffs).applyPoiseModifiers(timing, side, poiseContext),
      isSourceControlled: () => {
        if (this.options.isOperatorControlled === undefined || this.#clock === null) return false;
        return this.options.isOperatorControlled(operatorBuffs.ownerId, this.#clock.frame);
      },
      emitHealthSourceEvent: (event, payload) => {
        if (event === 'afterKillEntity') {
          context.semanticEvents.emit({
            kind: 'enemyDefeated',
            sourceOperatorId: operatorId,
            tags: payload.tags,
            gameplayTags: payload.gameplayTags,
            features: payload.features,
          });
          return;
        }
        this.#emit(operatorId, event, payload);
      },
      emitHealthTargetEvent: (event, payload) => this.#emit('enemy', event, payload),
      absorbHealthDamage: (damageType, value) => this.#enemyBuffs.absorbDamage(damageType, value),
      emitPoiseSourceEvent: (event, modifier) => this.#emit(operatorId, event, modifier),
      emitPoiseTargetEvent: (event, modifier) => this.#emit('enemy', event, modifier),
      emitSemanticHit: step => {
        context.semanticEvents.emit({
          kind: 'damageTagHit',
          sourceOperatorId: operatorId,
          tags: step.parameters.tags,
          gameplayTags: step.parameters.gameplayTags ?? [],
          features: step.parameters.features ?? [],
        });
        if (program !== undefined && program.skillGroupKey.length > 0) {
          context.semanticEvents.emit({
            kind: 'skillHit',
            sourceOperatorId: operatorId,
            skillGroupKey: program.skillGroupKey,
          });
        }
      },
      // 配装元素链仍需独立闭环，不能因 HP 伤害可用而自动开放。
      delegate: 'program' in context ? this.#createReactionExecutor(context) : strictTerminal,
    });
    const delegate = 'program' in context ? this.#createKnockDownExecutor(context, damage) : damage;
    return this.#createHealExecutor(context, operatorId, delegate);
  }

  #createKnockDownExecutor(
    context: CombatOperationExecutorContext,
    delegate: CombatOperationExecutor,
  ): CombatOperationExecutor {
    const control = this.#enemyKnockDown;
    if (control === null) return delegate;
    const sourceId = context.program.operatorId;
    const record = (event: string) =>
      context.receipt.record({
        frame: context.clock.frame,
        time: context.clock.time,
        event,
        sourceId,
        targetId: 'enemy',
        data: { type: 'knockDown' },
      });
    return new KnockDownOperationExecutor({
      sourceId,
      target: this.#enemyBuffRuntime,
      // 固定木桩不安装 markDie；HP 账本归零不等于原生死亡标记。
      isTargetAlive: () => true,
      predefine: control.predefine,
      getControl: () => control,
      readSourceDurationAddition: () =>
        this.#operatorBuffRuntime(sourceId).container.attributes.get('KnockDownTimeAddition'),
      resolveBuffDefinition: id => context.buffDefinitions?.[id],
      emit: (event, payload) => {
        const output =
          event === 'beforeOutputKnockDown' ||
          event === 'afterOutputKnockDown' ||
          event === 'beforeOutputPhysicalInfliction' ||
          event === 'afterOutputPhysicalInfliction';
        this.#emit(output ? sourceId : 'enemy', event, payload);
        // 旧语义消费者仍在专属来源事件发生的时点同步运行，不能延迟到整个根动作返回。
        if (event === 'afterOutputKnockDown') {
          context.semanticEvents.emit({
            kind: 'knockDownOutput',
            sourceOperatorId: sourceId,
            targetId: 'enemy',
          });
        } else if (event === 'afterOutputPhysicalInfliction') {
          context.semanticEvents.emit({
            kind: 'physicalInflictionApplied',
            sourceOperatorId: sourceId,
            targetId: 'enemy',
            type: 'knockDown',
            skillCastInfo: payload.skillCastInfo,
          });
        }
      },
      onNoGuard: () => record('PhysicalNoGuardApplied'),
      // 木桩不安装敌人动作/动画控制回调，组件的 Buff、标签、计时和事件已经保留。
      onControlApplied: () => {},
      onPhysicalInflictionApplied: () => record('PhysicalInflictionApplied'),
      delegate,
    });
  }

  #createHealExecutor(
    context: Pick<CombatOperationExecutorContext, 'clock' | 'receipt' | 'semanticEvents'>,
    sourceOperatorId: string,
    delegate: CombatOperationExecutor,
  ): CombatOperationExecutor {
    return new HealOperationExecutor({
      sourceOperatorId,
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
          sourceOperatorId,
          context.clock.frame,
          buffSourceId,
          buffOwnerId,
        ),
      resolveContextTarget: operatorId => ({
        operatorId,
        vitals: this.#requireOperatorVitals(operatorId),
      }),
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
          tags: event.tags,
        });
      },
      delegate,
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
        return target.matchesEntityTags(condition.tags, condition.tagQueryType);
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
      case 'targetPoiseCompare':
        return this.#enemyVitals.hasPoise
          ? compareCombatNumbers(
              this.#enemyVitals.poise,
              resolveNumber(condition.value),
              condition.operator,
            )
          : condition.returnValueIfMissing;
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
      applyOperation: (operation: ElementalInflictionOperation, skillCastInfo) =>
        adapter.apply(operation, { skillCastInfo }),
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
      triggerSpellBurst: payload => this.#onSpellBurstTriggered(payload),
      emitSourceEvent: (event, payload) =>
        this.#emitInfliction(context.program.operatorId, event, payload),
      emitTargetEvent: (event, payload) => this.#emitInfliction('enemy', event, payload),
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
    if (!this.#enemyAttributes.has('FireResistance')) {
      initializeEnemyCombatAttributes(this.#enemyAttributes, context.enemy.defenderAttributes);
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
        (buff, sourceId) => this.#recordOwnedBuffEnhanceChanged(operatorId, buff, sourceId),
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
        event => this.#emit(operatorId, 'beforeAddedBuff', event),
      );
      runtime.configureAdvancedObserver(() =>
        this.#buffProgress.sample(operatorId, container.buffs, this.#requireClock().frame),
      );
      this.#operatorBuffRuntimes.set(operatorId, runtime);
    }
    return runtime;
  }

  #buffAbilityEventRegistrar(entityId: string): RegisterBuffAbilityEventAction {
    return (event, priority: number, handle, samePriorityKey?: string) =>
      this.eventsFor(entityId).registerAction(
        event,
        priority,
        context => {
          const payload = context.payload;
          handle(payload, this.#resolveAbilityEventRuntimeActionContext(event, payload));
        },
        samePriorityKey,
      );
  }

  #resolveAbilityEventRuntimeActionContext(
    event: import('../../../../../packages/game-data-contract/src/abilityEvents').AbilityEvent,
    payload: unknown,
  ): import('../events/abilityEventActionContext').AbilityEventRuntimeActionContext | undefined {
    if (
      !hasAbilityEventActionContextBinding(event) ||
      typeof payload !== 'object' ||
      payload === null ||
      typeof (payload as { sourceId?: unknown }).sourceId !== 'string' ||
      typeof (payload as { targetId?: unknown }).targetId !== 'string'
    )
      return undefined;
    const ids = resolveAbilityEventActionContextBinding(
      event,
      payload as { sourceId: string; targetId: string },
    );
    return {
      inputTarget: this.#runtimeTargetFromEntityId(ids.inputTargetId),
      triggerTarget:
        ids.triggerTargetId === null ? null : this.#runtimeTargetFromEntityId(ids.triggerTargetId),
    };
  }

  #runtimeTargetFromEntityId(entityId: string): RuntimeTargetRef {
    if (entityId === 'enemy') return { kind: 'enemy' };
    const abilityEntity = /^ability-entity:([1-9]\d*)$/.exec(entityId);
    if (abilityEntity !== null)
      return { kind: 'abilityEntity', instanceId: Number(abilityEntity[1]) };
    return { kind: 'operator', operatorId: entityId };
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
              const blackboard = { ...result.blackboardValues } as Record<string, number>;
              const reaction =
                incomingElement === 'nature'
                  ? 'corrosion'
                  : incomingElement === 'electric'
                    ? 'electrification'
                    : incomingElement === 'cryo'
                      ? 'frozen'
                      : 'burning';
              const modifier = this.#reactionModifiers
                .get(operatorId)
                ?.find(candidate => candidate.reaction === reaction);
              if (modifier !== undefined) {
                if (typeof blackboard.duration !== 'number') {
                  throw new Error(`reaction '${reaction}' has no numeric duration output`);
                }
                blackboard.duration += modifier.durationSecondsAddition;
                if (modifier.effectivenessAddition !== 0) {
                  if (reaction !== 'corrosion') {
                    throw new Error(
                      `reaction '${reaction}' effectiveness modifier has no connected factory output`,
                    );
                  }
                  const multiplier = 1 + modifier.effectivenessAddition;
                  for (const key of [
                    'def_decrease_tick',
                    'max_def_decrease',
                    'start_def_decrease',
                  ]) {
                    if (typeof blackboard[key] !== 'number') {
                      throw new Error(`corrosion factory has no numeric '${key}' output`);
                    }
                    blackboard[key] *= multiplier;
                  }
                }
              }
              return blackboard;
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
        event => this.#emit(operatorId, 'beforeOutputBuff', event),
        event => this.#emit(operatorId, 'outputBuff', event),
        event => this.#emit('enemy', 'beforeAddedBuff', event),
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
    sourceId = this.#resolveAbilitySystemSourceId(sourceId);
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
    // 原生 StoreAttributeValue(Specific/Level) 读取当前角色等级；等级不是 Buff 可修改的
    // CombatAttributeSet 槽位，因此从同一次构筑解析得到的面板身份直接返回。
    if (request.attribute.kind === 'specific' && request.attribute.key === 'level') {
      return panel.level;
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
  #onSpellBurstTriggered(payload: {
    readonly burstType: string;
    readonly sourceId: string;
    readonly skillCastInfo?: import('./skillCastInfo').CombatSkillCastInfo;
  }): void {
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
    this.#emit(payload.sourceId, 'beforeOutputSpellBurst', {
      sourceId: payload.sourceId,
      targetId: 'enemy',
      burstType: payload.burstType,
      skillCastInfo: payload.skillCastInfo ?? null,
    });
    executeSpellBurst({
      skillCastInfo: payload.skillCastInfo ?? null,
      definition,
      sourceId: payload.sourceId,
      attack: resolveOperatorAttack(panel, operatorAttributes),
      enhance: operatorAttributes.get('PhysicalAndSpellInflictionEnhance'),
      criticalRate: operatorAttributes.get('criticalRate'),
      criticalDamageIncrease: operatorAttributes.get('criticalDamageIncrease'),
      weaknessDamageMultiplier: operatorAttributes.get('weaknessDamageMultiplier'),
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
          criticalRate: payload.canCritical ? attributes.get('criticalRate') : 0,
          criticalDamageIncrease: attributes.get('criticalDamageIncrease'),
          weaknessDamageMultiplier: attributes.get('weaknessDamageMultiplier'),
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
      gameplayTags: [],
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
    const simpleModifier = simpleAttributeModifierFact(buff);
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
          hasFiniteLifetime: buff.remainingDuration !== null,
          sourceActionId: buff.sourceActionId,
          ...(simpleModifier ?? {}),
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
          ...(currentPresentation?.showInHeadBarCommon === undefined
            ? {}
            : { showInHeadBarCommon: currentPresentation.showInHeadBarCommon }),
          ...(currentPresentation?.showInHeadBarAttached === undefined
            ? {}
            : { showInHeadBarAttached: currentPresentation.showInHeadBarAttached }),
          ...(currentPresentation?.showInSquadIcon === undefined
            ? {}
            : { showInSquadIcon: currentPresentation.showInSquadIcon }),
          ...(currentPresentation?.onlyShowForMainCharacter === undefined
            ? {}
            : { onlyShowForMainCharacter: currentPresentation.onlyShowForMainCharacter }),
          ...(currentPresentation?.showProgressInHpBar === undefined
            ? {}
            : { showProgressInHpBar: currentPresentation.showProgressInHpBar }),
          ...(currentPresentation?.showProgressInNormalSkillButton === undefined
            ? {}
            : {
                showProgressInNormalSkillButton:
                  currentPresentation.showProgressInNormalSkillButton,
              }),
          ...(currentPresentation?.useWeakProgressInNormalSkillButton === undefined
            ? {}
            : {
                useWeakProgressInNormalSkillButton:
                  currentPresentation.useWeakProgressInNormalSkillButton,
              }),
          ...(currentPresentation?.showProgressInUltimateSkillButton === undefined
            ? {}
            : {
                showProgressInUltimateSkillButton:
                  currentPresentation.showProgressInUltimateSkillButton,
              }),
          ...(currentPresentation?.showWarningBackground === undefined
            ? {}
            : { showWarningBackground: currentPresentation.showWarningBackground }),
          ...(currentPresentation?.iconStyleInSquad === undefined
            ? {}
            : { iconStyleInSquad: currentPresentation.iconStyleInSquad }),
          ...(currentPresentation?.abnormalColorType === undefined
            ? {}
            : { abnormalColorType: currentPresentation.abnormalColorType }),
          ...(currentPresentation?.orderPriority === undefined
            ? {}
            : {
                orderUseDirectoryValue: currentPresentation.orderPriority.useDirectoryValue,
                orderPriorityValue: currentPresentation.orderPriority.value,
                orderPriorityCategory: currentPresentation.orderPriority.category,
              }),
        },
      });
    recordPresentation('BuffApplied', buff.definition.id, presentation);
    if (ownerId !== 'enemy') {
      this.#buffProgress.register(
        ownerId,
        buff,
        buff.definition.id,
        presentation,
        clock.frame,
        this.options.passiveProgressBuffIdsByOperator?.get(ownerId)?.has(buff.definition.id) ===
          true,
      );
    }
    for (const child of buff.definition.childPresentations ?? []) {
      recordPresentation(
        'BuffPresentationStarted',
        child.buffId,
        child.presentation,
        buff.definition.id,
      );
      if (ownerId !== 'enemy') {
        this.#buffProgress.register(ownerId, buff, child.buffId, child.presentation, clock.frame);
      }
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
    if (ownerId !== 'enemy') {
      this.#buffProgress.finish(ownerId, buff, this.#clock.frame);
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
      buffTags: buff.definition.applyTags ?? [],
      reason,
    });
    if (reason === 'early' || reason === 'ignite') {
      // combat-spec/consume-buff-single：提前消费在 OnFinishedBuff 之后同步广播
      // OnBuffEndsEarly，并携带同一 FinishBuffEventData。
      this.#emit(ownerId, 'buffEndsEarly', {
        sourceId: ownerId,
        targetId: ownerId,
        buffId: buff.definition.id,
        buffTags: buff.definition.applyTags ?? [],
        reason,
      });
    }
  }

  /** 原生层数变化既是事件，也是 HUD/时间轴需要的离散事实。 */
  #recordOwnedBuffEnhanceChanged(
    ownerId: string,
    buff: CombatBuff<string>,
    sourceId: string,
  ): void {
    if (this.#clock === null || this.#receipt === null) {
      throw new Error(`Buff on '${ownerId}' changed before the environment was bound to a battle`);
    }
    this.#receipt.record({
      frame: this.#clock.frame,
      time: this.#clock.time,
      event: 'BuffEnhanceChanged',
      sourceId,
      targetId: ownerId,
      data: {
        buffId: buff.definition.id,
        instanceId: buff.instanceId,
        layers: buff.enhanceCount,
      },
    });
    this.#emit(ownerId, 'buffEnhanceChanged', {
      sourceId,
      targetId: ownerId,
      buffId: buff.definition.id,
      enhanceCount: buff.enhanceCount,
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

  /** 随战斗环境创建一次；由角色装配显式安装条件，不按技能块重复注册。 */
  readonly comboConditions = new ComboSkillConditionRuntime();

  #emitInfliction(
    entityId: string,
    event: ElementalInflictionEvent,
    payload: ElementalInflictionEventPayload,
  ): void {
    this.eventsFor(entityId).dispatch({ event, payload }, [], {
      onAbilityEvent: () => this.comboConditions.onAbilityEvent({ event, payload }),
    });
  }

  #emit(entityId: string, event: StandardPlayerDamageEvent, payload: unknown): void {
    this.eventsFor(entityId).dispatch(
      { event, payload },
      [],
      event === 'afterTakePhysicalInfliction' ||
        event === 'beforeAddedBuff' ||
        event === 'addedBuff' ||
        event === 'outputBuff' ||
        event === 'buffEndsEarly' ||
        event === 'beforeTakeDamage' ||
        event === 'beforeOutputDamage' ||
        event === 'takeDamage' ||
        event === 'outputDamage' ||
        event === 'poiseZero' ||
        event === 'buffConsumed' ||
        event === 'buffAbsorbed' ||
        event === 'weaknessSet'
        ? {
            onAbilityEvent: () =>
              this.comboConditions.onAbilityEvent(
                event === 'afterTakePhysicalInfliction'
                  ? {
                      event,
                      payload:
                        payload as import('./knockDownOperationExecutor').KnockDownEventPayload,
                    }
                  : event === 'beforeAddedBuff' || event === 'addedBuff' || event === 'outputBuff'
                    ? {
                        event,
                        payload: payload as import('./buffOperationExecutor').BuffAppliedEvent,
                      }
                    : event === 'buffEndsEarly'
                      ? {
                          event,
                          payload: payload as {
                            readonly sourceId: string;
                            readonly targetId: string;
                            readonly buffId: string;
                            readonly buffTags: readonly string[];
                            readonly reason: 'ignite' | 'early';
                          },
                        }
                      : event === 'poiseZero'
                        ? {
                            event,
                            payload: payload as import('../damage/poiseDamage').PoiseDamageModifier,
                          }
                        : event === 'buffConsumed' || event === 'buffAbsorbed'
                          ? {
                              event,
                              payload:
                                payload as import('./buffOperationExecutor').BuffConsumedEvent & {
                                  readonly sourceId: string;
                                },
                            }
                          : event === 'weaknessSet'
                            ? {
                                event,
                                payload: payload as {
                                  readonly sourceId: string;
                                  readonly targetId: string;
                                },
                              }
                            : {
                                event,
                                payload:
                                  payload as import('../damage/healthDamage').HealthDamageEventPayload,
                              },
              ),
          }
        : undefined,
    );
    if (event === 'takeDamage' && isCriticalDamagePayload(payload)) {
      this.eventsFor(entityId).dispatch({ event: 'takeCriticalDamage', payload }, []);
    }
    if (event === 'outputDamage' && isCriticalDamagePayload(payload)) {
      this.eventsFor(entityId).dispatch({ event: 'outputCriticalDamage', payload }, []);
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
