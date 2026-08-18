/**
 * 用户时间轴上的外部战斗事实。
 *
 * 这些输入只唤醒干员监听器，不模拟敌方技能、AI、伤害公式或生命扣减。
 */
import type { DamageFeature, DamageTag } from '../../game-data/operatorDefinition';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';
import type { FrameRuntime } from './combatSimulation';
import type { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';

export interface ScheduledExternalCombatEventInput {
  readonly frame: number;
  readonly targetOperatorIds: readonly string[];
  readonly event: {
    readonly kind: 'operatorHit';
    readonly tags: readonly DamageTag[];
    readonly features: readonly DamageFeature[];
  };
}

export interface ExternalCombatEventRuntimeOptions {
  readonly clock: CombatClock;
  readonly events: readonly ScheduledExternalCombatEventInput[];
  readonly semanticEvents: CombatSemanticEventRuntime;
  readonly receipt: CombatReceiptSink;
  /** 项目逻辑帧；未提供时与实际战斗帧一致。 */
  readonly resolveTimelineFrame?: () => number;
}

export class ExternalCombatEventRuntime implements FrameRuntime {
  readonly #clock: CombatClock;
  readonly #events: readonly ScheduledExternalCombatEventInput[];
  readonly #semanticEvents: CombatSemanticEventRuntime;
  readonly #receipt: CombatReceiptSink;
  readonly #resolveTimelineFrame: () => number;
  #nextEventIndex = 0;

  constructor(options: ExternalCombatEventRuntimeOptions) {
    this.#clock = options.clock;
    this.#events = [...options.events];
    this.#semanticEvents = options.semanticEvents;
    this.#receipt = options.receipt;
    this.#resolveTimelineFrame = options.resolveTimelineFrame ?? (() => this.#clock.frame);
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
    const timelineFrame = this.#resolveTimelineFrame();
    if (!Number.isFinite(timelineFrame) || timelineFrame < 0) {
      throw new RangeError('timeline frame must be a non-negative finite number');
    }
    while (true) {
      const input = this.#events[this.#nextEventIndex];
      if (input === undefined || input.frame > timelineFrame + Number.EPSILON) break;
      this.#nextEventIndex += 1;
      for (const operatorId of input.targetOperatorIds) {
        this.#semanticEvents.emit({
          kind: input.event.kind,
          targetOperatorId: operatorId,
          tags: input.event.tags,
          features: input.event.features,
        });
        this.#receipt.record({
          frame: this.#clock.frame,
          time: this.#clock.time,
          event: 'ExternalOperatorHitProcessed',
          sourceId: 'enemy',
          targetId: operatorId,
          data: { timelineFrame },
        });
      }
    }
  }
}
