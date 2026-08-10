/**
 * 标准战斗环境：一场模拟里敌人的血量、失衡、元素附着和反应都由它管。
 *
 * 能做的就做，做不了的（Buff、瞬时属性、没确认的随机等）直接报错，
 * 绝不用假数据糊弄。调用方必须把命中时需要的数值显式传进来。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer, type BuffFinishReason, type CombatBuff } from '../buffs/combatBuffs';
import {
  compileCombatBuffCatalog,
  CompiledCombatBuffCatalog,
  type CombatBuffCatalogDocument,
} from '../buffs/combatBuffCatalog';
import { COMBAT_FRAME_INTERVAL, type CombatClock } from './combatClock';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { ResolvedOperatorPanel } from '../../compiler/resolveOperatorPanel';
import type { DamageModifierSide } from '../damage/playerDamageContext';
import type { PlayerDamageNonRandomRuntimeSnapshot } from '../damage/playerActiveDamageInput';
import { ElementalInflictionBuffAdapter } from '../infliction/elementalInflictionBuffAdapter';
import type { ElementalInflictionOperation } from '../infliction/elementalInfliction';
import { ElementalReactionContainer } from '../infliction/elementalReactionState';
import { createSkillSettingSource } from '../infliction/skillSettingCatalog';
import type {
  CompoundStatusSkillSettingSource,
  SkillSettingCatalogDocument,
} from '../infliction/skillSettingCatalog';
import { ElementalInflictionOperationExecutor } from './elementalInflictionOperationExecutor';
import { ElementalReactionOperationExecutor } from './elementalReactionOperationExecutor';
import { executeSpellBurst } from './spellBurstRuntime';
import { AbilityEventDispatcher } from '../events/abilityEventDispatcher';
import type { CriticalSampleSource } from '../random/criticalSampleSource';
import { CatalogBuffOperationTarget } from './catalogBuffOperationTarget';
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

type DamageStep = Extract<ResolvedCombatStep, { kind: 'dealDamage' | 'dealFixedDamage' }>;
type EnvironmentOptions = Pick<
  CombatRuntimeAssemblyOptions,
  | 'enemyBuffRuntime'
  | 'enemyVitalsRuntime'
  | 'createOperatorBuffRuntime'
  | 'createOperationExecutor'
  | 'resolveVitals'
>;

export type StandardPlayerDamageEvent =
  | 'beforeDamageAction'
  | 'beforeCalculateDamage'
  | 'beforeTakeDamage'
  | 'beforeOutputDamage'
  | 'takeDamage'
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
  | 'poiseRecovered';

export interface StandardPlayerDamageEnvironmentOptions {
  /** 暴击样本和命中特殊倍率必须由具有证据的上层策略提供。 */
  readonly criticalSamples: CriticalSampleSource;
  readonly resolveNonRandomRuntimeSnapshot: (
    context: CombatOperationExecutorContext,
    step: DamageStep,
  ) => PlayerDamageNonRandomRuntimeSnapshot;
  /** 提供后，`applyElementalInfliction` 步骤按目录附着状态机执行。 */
  readonly elementalInflictionDocument?: CombatBuffCatalogDocument;
  /** 法术爆发倍率来源；缺失时爆发触发会明确失败。 */
  readonly spellInflictionSettings?: SkillSettingCatalogDocument;
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

/** 一场模拟独占的标准生命/失衡伤害状态所有者。 */
export class StandardPlayerDamageEnvironment {
  readonly runtimeOptions: EnvironmentOptions;
  readonly #enemyBuffs = new CombatBuffContainer(
    'enemy',
    new CombatAttributeSet<string>(),
    undefined,
    null,
    undefined,
    (buff, reason) => this.#recordBuffFinished(buff, reason),
  );
  readonly #enemyBuffRuntime = new CatalogBuffOperationTarget(this.#enemyBuffs, {
    get: () => undefined,
  });
  readonly #operatorBuffRuntimes = new Map<string, CatalogBuffOperationTarget<string>>();
  readonly #events = new Map<string, AbilityEventDispatcher<StandardPlayerDamageEvent, unknown>>();
  readonly #inflictionAdapters = new Map<string, ElementalInflictionBuffAdapter<string>>();
  readonly #reactions = new ElementalReactionContainer();
  readonly #operatorPanels = new Map<string, ResolvedOperatorPanel>();
  #clock: CombatClock | null = null;
  #receipt: CombatReceiptSink | null = null;
  #elementalCatalog: CompiledCombatBuffCatalog<string> | null = null;
  #skillSettings: CompoundStatusSkillSettingSource | null = null;
  #enemyVitals: CombatVitals | null = null;
  #enemyVitalsRuntime: CombatVitalsRuntime | null = null;
  #enemyIdentity: CombatOperationExecutorContext['enemy'] | null = null;

  constructor(readonly options: StandardPlayerDamageEnvironmentOptions) {
    // 对象字面量中的 getter 会把自己的 this 绑定为字面量本身，因此用箭头闭包引用环境实例。
    const vitalsRuntimeOf = (): FrameRuntime | null => this.#enemyVitalsRuntime;
    this.runtimeOptions = {
      enemyBuffRuntime: this.#enemyBuffRuntime,
      get enemyVitalsRuntime() {
        return vitalsRuntimeOf();
      },
      createOperatorBuffRuntime: operatorId => this.#operatorBuffRuntime(operatorId),
      createOperationExecutor: context => this.#createOperationExecutor(context),
      resolveVitals: target => {
        if (target !== 'enemy') {
          throw new Error('standard player damage environment has no operator vitals');
        }
        return this.enemyVitals;
      },
    };
  }

  get enemyVitals(): CombatVitals {
    if (this.#enemyVitals === null) {
      throw new Error('standard player damage environment has not been bound to an enemy');
    }
    return this.#enemyVitals;
  }

  /** 已绑定敌人时返回账本推进器；空场景（从未绑定敌人）返回 null。 */
  get enemyVitalsRuntime(): FrameRuntime | null {
    return this.#enemyVitalsRuntime;
  }

  /** 尚未创建任何技能运行时的空场景返回 null，不会为读取结果而凭空创建生命账本。 */
  get currentEnemyHealth(): number | null {
    return this.#enemyVitals?.health ?? null;
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
    this.#clock = context.clock;
    this.#receipt = context.receipt;
    if (context.panel !== undefined) {
      this.#operatorPanels.set(context.program.operatorId, context.panel);
    }
    const operatorBuffs = this.#operatorBuffRuntime(context.program.operatorId).container;
    return new PlayerDamageOperationExecutor({
      sourceOperatorId: context.program.operatorId,
      targetId: 'enemy',
      targetVitals: this.enemyVitals,
      clock: context.clock,
      receipt: context.receipt,
      captureAttributeSnapshots: step => resolveStaticPlayerDamageSnapshots(context, step),
      criticalSamples: this.options.criticalSamples,
      resolveNonRandomRuntimeSnapshot: step =>
        this.options.resolveNonRandomRuntimeSnapshot(context, step),
      applyDamageModifiers: (timing, side, damageContext) =>
        this.#buffContainer(side, operatorBuffs).applyDamageModifiers(timing, side, damageContext),
      addInstantAttributeModifier: (_side, request) => {
        throw new Error(
          `instant attribute '${request.attribute}' is not available in the standard life-damage subset`,
        );
      },
      clearInstantAttributeModifiers: side =>
        this.#buffContainer(side, operatorBuffs).attributes.clearInstantModifiers(),
      emitPreparationEvent: (event, payload) =>
        this.#emit(context.program.operatorId, event, payload),
      // 失衡倍率目前只有证据不足的来源；装备/处决失衡增益接入后在此聚合。
      resolvePoiseMultipliers: () => ({ output: 1, taken: 1 }),
      emitHealthSourceEvent: (event, payload) =>
        this.#emit(context.program.operatorId, event, payload),
      emitHealthTargetEvent: (event, payload) => this.#emit('enemy', event, payload),
      emitPoiseSourceEvent: (event, modifier) =>
        this.#emit(context.program.operatorId, event, modifier),
      emitPoiseTargetEvent: (event, modifier) => this.#emit('enemy', event, modifier),
      delegate: this.#createReactionExecutor(context),
    });
  }

  #createReactionExecutor(context: CombatOperationExecutorContext): CombatOperationExecutor {
    return new ElementalReactionOperationExecutor({
      sourceOperatorId: context.program.operatorId,
      targetId: 'enemy',
      clock: context.clock,
      receipt: context.receipt,
      container: this.#reactions,
      delegate: this.#createInflictionExecutor(context),
    });
  }

  #createInflictionExecutor(context: CombatOperationExecutorContext): CombatOperationExecutor {
    if (this.options.elementalInflictionDocument === undefined) return strictTerminal;
    const adapter = this.#inflictionAdapter(context.program.operatorId);
    return new ElementalInflictionOperationExecutor({
      sourceOperatorId: context.program.operatorId,
      targetId: 'enemy',
      skillId: context.program.skillId,
      clock: context.clock,
      receipt: context.receipt,
      getExistingAttachment: () => adapter.getExistingAttachment(),
      applyOperation: (operation: ElementalInflictionOperation) => adapter.apply(operation),
      emitSourceEvent: (event, payload) => this.#emit(context.program.operatorId, event, payload),
      emitTargetEvent: (event, payload) => this.#emit('enemy', event, payload),
      delegate: strictTerminal,
    });
  }

  #bindEnemy(context: CombatOperationExecutorContext): void {
    if (this.#enemyIdentity !== null && this.#enemyIdentity !== context.enemy) {
      throw new Error('standard player damage environment cannot be shared across enemies');
    }
    if (this.#enemyVitals !== null) return;
    this.#enemyIdentity = context.enemy;
    const singleNodeStagger = context.enemy.stagger.nodeCount === 1;
    const vitals = new CombatVitals({
      health: context.enemy.health,
      maxHealth: context.enemy.health,
      // 单节点失衡映射到 CombatVitals 账本，起始为满值并随失衡伤害消耗；
      // 多节点失衡尚未接入单节点账本，保持无账本状态而不做近似塞入。
      maxPoise: singleNodeStagger ? context.enemy.stagger.maximum : 0,
      poise: singleNodeStagger ? context.enemy.stagger.maximum : 0,
      poiseRecoveryTime: context.enemy.stagger.brokenDurationFrames * COMBAT_FRAME_INTERVAL,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    this.#enemyVitals = vitals;
    this.#enemyVitalsRuntime = new CombatVitalsRuntime({
      ownerId: 'enemy',
      clock: context.clock,
      vitals,
      receipt: context.receipt,
      emitOwnerEvent: event => this.#emit('enemy', event, {}),
    });
  }

  #operatorBuffRuntime(operatorId: string): CatalogBuffOperationTarget<string> {
    let runtime = this.#operatorBuffRuntimes.get(operatorId);
    if (runtime === undefined) {
      runtime = new CatalogBuffOperationTarget(
        new CombatBuffContainer(operatorId, new CombatAttributeSet<string>()),
        { get: () => undefined },
      );
      this.#operatorBuffRuntimes.set(operatorId, runtime);
    }
    return runtime;
  }

  #inflictionAdapter(operatorId: string): ElementalInflictionBuffAdapter<string> {
    let adapter = this.#inflictionAdapters.get(operatorId);
    if (adapter === undefined) {
      adapter = new ElementalInflictionBuffAdapter(
        this.#enemyBuffs,
        operatorId,
        this.#ensureElementalCatalog(),
      );
      this.#inflictionAdapters.set(operatorId, adapter);
    }
    return adapter;
  }

  #ensureElementalCatalog(): CompiledCombatBuffCatalog<string> {
    if (this.#elementalCatalog !== null) return this.#elementalCatalog;
    const document = this.options.elementalInflictionDocument;
    if (document === undefined) {
      throw new Error('elemental infliction requires an elemental infliction document');
    }
    this.#elementalCatalog = compileCombatBuffCatalog(document, {
      emitElementalInflictionStarted: payload =>
        this.#emit('enemy', 'elementalInflictionStarted', payload),
      onSpellBurstTriggered: payload => this.#onSpellBurstTriggered(payload),
    });
    return this.#elementalCatalog;
  }

  /** 爆发 Buff 触发时执行爆发伤害；数据缺失处明确报错，不假装打出伤害。 */
  #onSpellBurstTriggered(payload: { readonly burstType: string; readonly sourceId: string }): void {
    const catalog = this.#ensureElementalCatalog();
    const definition = catalog.getSpellBurst(payload.burstType);
    if (definition === null) {
      throw new Error(`spell burst '${payload.burstType}' is not declared in the buff catalog`);
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
    executeSpellBurst({
      definition,
      sourceId: payload.sourceId,
      attack: panel.attack,
      // 来源附着增强属性尚未在面板落地；以 0 作为中性基线，增强公式退化为 1。
      enhance: 0,
      criticalRate: panel.criticalRate,
      criticalDamageIncrease: panel.criticalDamage,
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
    if (this.#clock === null || this.#receipt === null) {
      throw new Error('enemy buff finished before the environment was bound to a battle');
    }
    this.#receipt.record({
      frame: this.#clock.frame,
      time: this.#clock.time,
      event: 'BuffFinished',
      targetId: 'enemy',
      data: {
        buffId: buff.definition.id,
        reason,
        layers: buff.enhanceCount,
      },
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
  }
}
