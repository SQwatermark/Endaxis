/**
 * 在原生 PlayerController 所在的 Frame 阶段消费已编译施放输入。
 * 输入必须按帧有序；同帧输入保持声明顺序，不能在运行时按干员或技能身份重排。
 */
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';
import type { FrameRuntime } from './combatSimulation';
import type { PlayerSkillInput } from '../../game-data/operatorDefinition';

/** 用户操作序列中一次确定到实际战斗帧的技能施放请求。 */
export interface ScheduledSkillInput {
  readonly frame: number;
  readonly operatorId: string;
  readonly skillId: string;
  /** 玩家尝试执行的四类语义动作；与设备键位和技能库分组无关。 */
  readonly action?: PlayerSkillInput;
  /** 文档中的技能释放身份；同技能多次放置靠它区分。 */
  readonly castId?: string;
}

export interface CombatInputRuntimeOptions {
  readonly clock: CombatClock;
  readonly inputs: readonly ScheduledSkillInput[];
  readonly receipt: CombatReceiptSink;
  readonly tryStartSkill: (
    operatorId: string,
    skillId: string,
    castId?: string,
    action?: PlayerSkillInput,
  ) => boolean;
  /** 仅供临时放置规划：锚定首段，按真实输入阶段寻找后续段的接续帧。 */
  readonly continuationPlan?: {
    readonly castIds: readonly string[];
    readonly canContinue: (input: ScheduledSkillInput, previous: ScheduledSkillInput) => boolean;
  };
}

/** 保持输入顺序并在当前帧同步提交施放请求。 */
export class CombatInputRuntime implements FrameRuntime {
  readonly #clock: CombatClock;
  readonly #inputs: readonly ScheduledSkillInput[];
  readonly #receipt: CombatReceiptSink;
  readonly #tryStartSkill: CombatInputRuntimeOptions['tryStartSkill'];
  #nextInputIndex = 0;
  readonly #continuationInputs: readonly ScheduledSkillInput[];
  readonly #canContinue: CombatInputRuntimeOptions['continuationPlan'];
  #previousContinuationInput: ScheduledSkillInput | undefined;
  #nextContinuationIndex = 1;
  #continuationStopped = false;

  constructor(options: CombatInputRuntimeOptions) {
    this.#clock = options.clock;
    this.#receipt = options.receipt;
    this.#tryStartSkill = options.tryStartSkill;
    let previousFrame = Number.NEGATIVE_INFINITY;
    for (const [index, input] of options.inputs.entries()) {
      if (!Number.isInteger(input.frame)) {
        throw new RangeError(`inputs[${index}].frame must be an integer`);
      }
      if (input.frame < previousFrame) {
        throw new Error('scheduled skill inputs must be ordered by frame');
      }
      previousFrame = input.frame;
    }
    this.#canContinue = options.continuationPlan;
    const castIds = options.continuationPlan?.castIds ?? [];
    if (options.continuationPlan !== undefined) {
      if (castIds.length < 2 || new Set(castIds).size !== castIds.length) {
        throw new Error('continuation plan requires at least two unique cast IDs');
      }
      this.#continuationInputs = castIds.map(castId => {
        const matches = options.inputs.filter(input => input.castId === castId);
        if (matches.length !== 1) {
          throw new Error(`continuation plan cast '${castId}' must match exactly one input`);
        }
        return matches[0]!;
      });
      if (
        this.#continuationInputs.some(
          input => input.operatorId !== this.#continuationInputs[0]!.operatorId,
        )
      ) {
        throw new Error('continuation plan inputs must belong to the same operator');
      }
    } else {
      this.#continuationInputs = [];
    }
    const deferredCastIds = new Set(castIds.slice(1));
    this.#inputs = options.inputs.filter(
      input => input.castId === undefined || !deferredCastIds.has(input.castId),
    );
  }

  advanceFrame(): void {
    this.applyCurrentFrame();
  }

  /** 装配完成后调用一次可消费发生在初始第 0 帧的输入。 */
  applyCurrentFrame(): void {
    const actualFrame = this.#clock.frame;
    while (true) {
      const input = this.#inputs[this.#nextInputIndex];
      if (input === undefined || input.frame > actualFrame) break;
      this.#nextInputIndex += 1;
      const anchor = this.#continuationInputs[0];
      if (
        anchor !== undefined &&
        input.castId !== anchor.castId &&
        input.operatorId === anchor.operatorId &&
        this.#previousContinuationInput !== undefined
      ) {
        // Never move a generated continuation past another authored operation on this operator.
        this.#continuationStopped = true;
      }
      const accepted = this.#processInput(input);
      if (anchor !== undefined && input.castId === anchor.castId) {
        this.#previousContinuationInput = { ...input, frame: actualFrame };
        if (!accepted) this.#continuationStopped = true;
      }
    }
    const previous = this.#previousContinuationInput;
    const continuation = this.#continuationInputs[this.#nextContinuationIndex];
    if (
      this.#continuationStopped ||
      previous === undefined ||
      continuation === undefined ||
      actualFrame <= previous.frame
    )
      return;
    const input = { ...continuation, frame: actualFrame };
    if (!this.#canContinue!.canContinue(input, previous)) return;
    // At most one continuation per real frame, including repeated applyCurrentFrame calls.
    this.#nextContinuationIndex += 1;
    this.#previousContinuationInput = input;
    if (!this.#processInput(input)) this.#continuationStopped = true;
  }

  #processInput(input: ScheduledSkillInput): boolean {
    const accepted =
      input.action === undefined
        ? this.#tryStartSkill(input.operatorId, input.skillId, input.castId)
        : this.#tryStartSkill(input.operatorId, input.skillId, input.castId, input.action);
    this.#receipt.record({
      frame: this.#clock.frame,
      time: this.#clock.time,
      event: 'SkillInputProcessed',
      sourceId: input.operatorId,
      data: {
        skillId: input.skillId,
        ...(input.castId === undefined ? {} : { castId: input.castId }),
        accepted,
        scheduledActualFrame: input.frame,
      },
    });
    return accepted;
  }
}
