import type { ExternalOperatorHitPayload } from '../events/combatAbilityEvent';
/**
 * 用户时间轴上的外部战斗事实。
 *
 * 这些输入只唤醒干员监听器，不模拟敌方技能、AI、伤害公式或生命扣减。
 */
import type { DamageFeature, DamageTag } from '../../game-data/operatorDefinition';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';
import type { FrameRuntime } from './combatSimulation';

export interface ScheduledExternalCombatEventInput {
  readonly frame: number;
  readonly targetOperatorIds: readonly string[];
  readonly event:
    | {
        readonly kind: 'operatorHit';
        readonly damageType?: import('../../game-data/operatorDefinition').DamageType;
        readonly tags: readonly DamageTag[];
        readonly features: readonly DamageFeature[];
      }
    | { readonly kind: 'operatorWeaknessTriggeredOutput' }
    | { readonly kind: 'enemyWeaknessSet' }
    | { readonly kind: 'comboCooldownControl'; readonly mode: 'cooldown' | 'ready' };
}

export interface ExternalCombatEventRuntimeOptions {
  readonly controlComboCooldown?: (operatorId: string, mode: 'cooldown' | 'ready') => void;
  readonly clock: CombatClock;
  readonly events: readonly ScheduledExternalCombatEventInput[];
  /** 将受击事实同步投递给 Buff Ability 监听器；不执行伤害或生命扣减。 */
  readonly emitOperatorHitAbilityEvent?: (
    operatorId: string,
    payload: ExternalOperatorHitPayload,
  ) => void;
  /** 在攻击者 AbilitySystem 上发射弱点触发后的输出事件；敌人保持唯一木桩目标。 */
  readonly emitOperatorWeaknessTriggeredOutput?: (operatorId: string) => void;
  /** 唯一敌人发布无目标 OnSetWeakness；由全局连携监听器消费。 */
  readonly emitEnemyWeaknessSet?: () => void;
  readonly receipt: CombatReceiptSink;
}

export class ExternalCombatEventRuntime implements FrameRuntime {
  readonly #controlComboCooldown: ExternalCombatEventRuntimeOptions['controlComboCooldown'];
  readonly #clock: CombatClock;
  readonly #events: readonly ScheduledExternalCombatEventInput[];
  readonly #emitOperatorHitAbilityEvent: ExternalCombatEventRuntimeOptions['emitOperatorHitAbilityEvent'];
  readonly #emitOperatorWeaknessTriggeredOutput: ExternalCombatEventRuntimeOptions['emitOperatorWeaknessTriggeredOutput'];
  readonly #emitEnemyWeaknessSet: ExternalCombatEventRuntimeOptions['emitEnemyWeaknessSet'];
  readonly #receipt: CombatReceiptSink;
  #nextEventIndex = 0;

  constructor(options: ExternalCombatEventRuntimeOptions) {
    this.#controlComboCooldown = options.controlComboCooldown;
    this.#clock = options.clock;
    this.#events = [...options.events];
    this.#emitOperatorHitAbilityEvent = options.emitOperatorHitAbilityEvent;
    this.#emitOperatorWeaknessTriggeredOutput = options.emitOperatorWeaknessTriggeredOutput;
    this.#emitEnemyWeaknessSet = options.emitEnemyWeaknessSet;
    this.#receipt = options.receipt;
    let previousFrame = -1;
    for (const [index, input] of this.#events.entries()) {
      if (!Number.isInteger(input.frame) || input.frame < 0) {
        throw new RangeError(`events[${index}].frame must be a non-negative integer`);
      }
      if (
        input.targetOperatorIds.length === 0 ||
        input.targetOperatorIds.some(id => id.length === 0)
      ) {
        throw new TypeError(`events[${index}].targetOperatorIds must not be empty`);
      }
      if (input.frame < previousFrame) {
        throw new Error('scheduled external event inputs must be ordered by frame');
      }
      previousFrame = input.frame;
    }
  }

  advanceFrame(): void {
    this.applyCurrentFrame();
  }

  applyCurrentFrame(): void {
    const actualFrame = this.#clock.frame;
    while (true) {
      const input = this.#events[this.#nextEventIndex];
      if (input === undefined || input.frame > actualFrame) break;
      this.#nextEventIndex += 1;
      if (input.event.kind === 'comboCooldownControl') {
        if (this.#controlComboCooldown === undefined)
          throw new Error('combo cooldown control handler is missing');
        for (const operatorId of input.targetOperatorIds) {
          this.#controlComboCooldown(operatorId, input.event.mode);
        }
        continue;
      }
      if (input.event.kind === 'enemyWeaknessSet') {
        this.#emitEnemyWeaknessSet?.();
        this.#receipt.record({
          frame: this.#clock.frame,
          time: this.#clock.time,
          event: 'ExternalEnemyWeaknessSetProcessed',
          sourceId: 'enemy',
          targetId: 'enemy',
          data: { scheduledActualFrame: input.frame },
        });
        continue;
      }
      for (const operatorId of input.targetOperatorIds) {
        if (input.event.kind === 'operatorWeaknessTriggeredOutput') {
          this.#emitOperatorWeaknessTriggeredOutput?.(operatorId);
          this.#receipt.record({
            frame: this.#clock.frame,
            time: this.#clock.time,
            event: 'ExternalOperatorWeaknessTriggeredOutputProcessed',
            sourceId: operatorId,
            targetId: 'enemy',
            data: { scheduledActualFrame: input.frame },
          });
          continue;
        }
        if (this.#emitOperatorHitAbilityEvent === undefined) {
          throw new Error('external operator hit requires an ability event publisher');
        }
        this.#emitOperatorHitAbilityEvent(operatorId, {
          external: true,
          sourceId: 'enemy',
          targetId: operatorId,
          ...(input.event.damageType === undefined ? {} : { damageType: input.event.damageType }),
          tags: input.event.tags,
          features: input.event.features,
        });
        this.#receipt.record({
          frame: this.#clock.frame,
          time: this.#clock.time,
          event: 'ExternalOperatorHitProcessed',
          sourceId: 'enemy',
          targetId: operatorId,
          data: { scheduledActualFrame: input.frame },
        });
      }
    }
  }
}
