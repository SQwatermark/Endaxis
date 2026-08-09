/**
 * 为场景模拟装配当前已闭环的标准玩家生命伤害子集。
 *
 * 该环境拥有单场战斗的敌人生命、实体事件与伤害修正注册表，但不会为尚未恢复的暴击随机流、
 * 失衡、元素附着或未知操作补默认行为。调用方必须显式提供命中运行时快照；超出子集时会失败。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer } from '../buffs/combatBuffs';
import type { DamageModifierSide } from '../damage/playerDamageContext';
import type { PlayerDamageNonRandomRuntimeSnapshot } from '../damage/playerActiveDamageInput';
import { AbilityEventDispatcher } from '../events/abilityEventDispatcher';
import type { CriticalSampleSource } from '../random/criticalSampleSource';
import { CatalogBuffOperationTarget } from './catalogBuffOperationTarget';
import type {
  CombatOperationExecutorContext,
  CombatRuntimeAssemblyOptions,
} from './combatRuntimeAssembly';
import { CombatVitals } from './combatVitals';
import { PlayerDamageOperationExecutor } from './playerDamageOperationExecutor';
import type { CombatOperationExecutor } from './skillRuntime';
import { resolveStaticPlayerDamageSnapshots } from './staticPlayerDamageSnapshots';

type DamageStep = Extract<ResolvedCombatStep, { kind: 'dealDamage' | 'dealFixedDamage' }>;
type EnvironmentOptions = Pick<
  CombatRuntimeAssemblyOptions,
  'enemyBuffRuntime' | 'createOperatorBuffRuntime' | 'createOperationExecutor' | 'resolveVitals'
>;

export type StandardPlayerDamageEvent =
  | 'beforeDamageAction'
  | 'beforeCalculateDamage'
  | 'beforeTakeDamage'
  | 'beforeOutputDamage'
  | 'takeDamage'
  | 'outputDamage';

export interface StandardPlayerDamageEnvironmentOptions {
  /** 暴击样本和命中特殊倍率必须由具有证据的上层策略提供。 */
  readonly criticalSamples: CriticalSampleSource;
  readonly resolveNonRandomRuntimeSnapshot: (
    context: CombatOperationExecutorContext,
    step: DamageStep,
  ) => PlayerDamageNonRandomRuntimeSnapshot;
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

/** 一场模拟独占的标准生命伤害状态所有者。 */
export class StandardPlayerDamageEnvironment {
  readonly runtimeOptions: EnvironmentOptions;
  readonly #enemyBuffs = new CombatBuffContainer('enemy', new CombatAttributeSet<string>());
  readonly #enemyBuffRuntime = new CatalogBuffOperationTarget(this.#enemyBuffs, {
    get: () => undefined,
  });
  readonly #operatorBuffRuntimes = new Map<string, CatalogBuffOperationTarget<string>>();
  readonly #events = new Map<string, AbilityEventDispatcher<StandardPlayerDamageEvent, unknown>>();
  #enemyVitals: CombatVitals | null = null;
  #enemyIdentity: CombatOperationExecutorContext['enemy'] | null = null;

  constructor(readonly options: StandardPlayerDamageEnvironmentOptions) {
    this.runtimeOptions = {
      enemyBuffRuntime: this.#enemyBuffRuntime,
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
      resolvePoiseMultipliers: () => {
        throw new Error('standard player damage environment does not support poise damage');
      },
      emitHealthSourceEvent: (event, payload) =>
        this.#emit(context.program.operatorId, event, payload),
      emitHealthTargetEvent: (event, payload) => this.#emit('enemy', event, payload),
      emitPoiseSourceEvent: () => {
        throw new Error('standard player damage environment does not support poise events');
      },
      emitPoiseTargetEvent: () => {
        throw new Error('standard player damage environment does not support poise events');
      },
      delegate: strictTerminal,
    });
  }

  #bindEnemy(context: CombatOperationExecutorContext): void {
    if (this.#enemyIdentity !== null && this.#enemyIdentity !== context.enemy) {
      throw new Error('standard player damage environment cannot be shared across enemies');
    }
    if (this.#enemyVitals !== null) return;
    this.#enemyIdentity = context.enemy;
    this.#enemyVitals = new CombatVitals({
      health: context.enemy.health,
      maxHealth: context.enemy.health,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: true,
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
