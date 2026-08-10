/**
 * 在原生 PlayerController 所在的 Frame 阶段消费已编译施放输入。
 * 输入必须按帧有序；同帧输入保持声明顺序，不能在运行时按干员或技能身份重排。
 */
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';
import type { FrameRuntime } from './combatSimulation';

/** 用户操作序列中一次确定到逻辑帧的技能施放请求。 */
export interface ScheduledSkillInput {
  readonly frame: number;
  readonly operatorId: string;
  readonly skillId: string;
  /** 文档中的技能释放身份；同技能多次放置靠它区分。 */
  readonly castId?: string;
}

export interface CombatInputRuntimeOptions {
  readonly clock: CombatClock;
  readonly inputs: readonly ScheduledSkillInput[];
  readonly receipt: CombatReceiptSink;
  readonly tryStartSkill: (operatorId: string, skillId: string, castId?: string) => boolean;
}

/** 保持输入顺序并在当前帧同步提交施放请求。 */
export class CombatInputRuntime implements FrameRuntime {
  readonly #clock: CombatClock;
  readonly #inputs: readonly ScheduledSkillInput[];
  readonly #receipt: CombatReceiptSink;
  readonly #tryStartSkill: CombatInputRuntimeOptions['tryStartSkill'];
  #nextInputIndex = 0;

  constructor(options: CombatInputRuntimeOptions) {
    this.#clock = options.clock;
    this.#inputs = [...options.inputs];
    this.#receipt = options.receipt;
    this.#tryStartSkill = options.tryStartSkill;
    let previousFrame = -1;
    for (const [index, input] of this.#inputs.entries()) {
      if (!Number.isInteger(input.frame) || input.frame < 0) {
        throw new RangeError(`inputs[${index}].frame must be a non-negative integer`);
      }
      if (input.frame < previousFrame) {
        throw new Error('scheduled skill inputs must be ordered by frame');
      }
      previousFrame = input.frame;
    }
  }

  advanceFrame(): void {
    this.applyCurrentFrame();
  }

  /** 装配完成后调用一次可消费发生在初始第 0 帧的输入。 */
  applyCurrentFrame(): void {
    while (this.#inputs[this.#nextInputIndex]?.frame === this.#clock.frame) {
      const input = this.#inputs[this.#nextInputIndex]!;
      this.#nextInputIndex += 1;
      const accepted = this.#tryStartSkill(input.operatorId, input.skillId, input.castId);
      this.#receipt.record({
        frame: this.#clock.frame,
        time: this.#clock.time,
        event: 'SkillInputProcessed',
        sourceId: input.operatorId,
        data: {
          skillId: input.skillId,
          ...(input.castId === undefined ? {} : { castId: input.castId }),
          accepted,
        },
      });
    }
  }
}
