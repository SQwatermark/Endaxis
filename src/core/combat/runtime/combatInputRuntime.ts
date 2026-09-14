/**
 * 在原生 PlayerController 所在的 Frame 阶段消费已编译施放输入。
 * 输入必须按帧有序；同帧输入保持声明顺序，不能在运行时按干员或技能身份重排。
 */
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';
import type { FrameRuntime } from './combatSimulation';
import type { PlayerSkillInput } from '../../game-data/operatorDefinition';
import { processCombatSkillInput } from './combatInputExecution';

/** 一次技能输入。固定输入已确定实际帧；组后段在运行时到达边界后才确定实际帧。 */
export interface ScheduledSkillInput {
  /** 固定输入的实际帧；尚未启动的组后段仅携带锚点帧，供编译预检使用。 */
  readonly frame: number;
  readonly operatorId: string;
  readonly skillId: string;
  /** 玩家尝试执行的四类语义动作；与设备键位和技能库分组无关。 */
  readonly action?: PlayerSkillInput;
  /** 文档中的技能释放身份；同技能多次放置靠它区分。 */
  readonly castId?: string;
  /** 动态组与固定输入落在同帧时，仍按轨道和块的原始声明顺序执行。 */
  readonly declarationOrder?: number;
}

/** 一条持久连续组；禁用成员已由编译器跳过，锚点身份仍指向原始组头。 */
export interface SkillInputGroup {
  readonly anchorCastId: string;
  readonly castIds: readonly string[];
}

interface SkillInputGroupState {
  readonly anchorCastId: string;
  readonly inputs: readonly ScheduledSkillInput[];
  nextIndex: number;
  previous?: ScheduledSkillInput;
  stopped: boolean;
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
  readonly skillInputGroups?: {
    readonly groups: readonly SkillInputGroup[];
    /** 只检查前段实际块边界；不把技能路由或资源许可变成自动等待条件。 */
    readonly canContinue: (previous: ScheduledSkillInput) => boolean;
  };
  /** 仅供临时放置规划：锚定首段，按真实输入阶段寻找后续段的接续帧。 */
  readonly continuationPlan?: {
    readonly castIds: readonly string[];
    readonly canContinue: (input: ScheduledSkillInput, previous: ScheduledSkillInput) => boolean;
    readonly ignoreInputFailures?: boolean;
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
  readonly #groups: readonly SkillInputGroupState[];
  readonly #groupByCastId = new Map<string, SkillInputGroupState>();
  readonly #groupOptions: CombatInputRuntimeOptions['skillInputGroups'];
  readonly #declarationOrder = new Map<ScheduledSkillInput, number>();

  constructor(options: CombatInputRuntimeOptions) {
    this.#clock = options.clock;
    this.#receipt = options.receipt;
    this.#tryStartSkill = options.tryStartSkill;
    this.#groupOptions = options.skillInputGroups;
    let previousFrame = Number.NEGATIVE_INFINITY;
    for (const [index, input] of options.inputs.entries()) {
      if (!Number.isInteger(input.frame)) {
        throw new RangeError(`inputs[${index}].frame must be an integer`);
      }
      if (input.frame < previousFrame) {
        throw new Error('scheduled skill inputs must be ordered by frame');
      }
      previousFrame = input.frame;
      this.#declarationOrder.set(input, input.declarationOrder ?? index);
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
    const inputsByCastId = new Map<string, ScheduledSkillInput[]>();
    for (const input of options.inputs) {
      if (input.castId === undefined) continue;
      const matches = inputsByCastId.get(input.castId) ?? [];
      matches.push(input);
      inputsByCastId.set(input.castId, matches);
    }
    const anchors = new Set<string>();
    this.#groups = (options.skillInputGroups?.groups ?? []).map(group => {
      if (group.anchorCastId.length === 0 || anchors.has(group.anchorCastId))
        throw new Error('skill input groups require unique non-empty anchors');
      anchors.add(group.anchorCastId);
      if (group.castIds.length === 0) throw new Error('skill input group has no enabled members');
      const inputs = group.castIds.map(castId => {
        const matches = inputsByCastId.get(castId);
        if (matches?.length !== 1)
          throw new Error(`skill input group cast '${castId}' must match exactly one input`);
        if (this.#groupByCastId.has(castId) || castIds.includes(castId))
          throw new Error(`skill input group cast '${castId}' belongs to multiple groups`);
        return matches[0]!;
      });
      if (new Set(group.castIds).size !== group.castIds.length)
        throw new Error('skill input group requires unique cast IDs');
      if (inputs.some(input => input.operatorId !== inputs[0]!.operatorId))
        throw new Error('skill input group inputs must belong to the same operator');
      const state: SkillInputGroupState = {
        anchorCastId: group.anchorCastId,
        inputs,
        nextIndex: 0,
        stopped: false,
      };
      group.castIds.forEach(castId => this.#groupByCastId.set(castId, state));
      group.castIds.slice(1).forEach(castId => deferredCastIds.add(castId));
      return state;
    });
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
    const ready: {
      readonly input: ScheduledSkillInput;
      readonly group?: SkillInputGroupState;
      readonly order: number;
    }[] = [];
    while (true) {
      const input = this.#inputs[this.#nextInputIndex];
      if (input === undefined || input.frame > actualFrame) break;
      this.#nextInputIndex += 1;
      ready.push({ input, order: this.#declarationOrder.get(input)! });
    }
    // 就绪状态在输入阶段开始时读取；本帧刚启动的组不能在同帧再推进一段。
    for (const group of this.#groups) {
      const previous = group.previous;
      const input = group.inputs[group.nextIndex];
      if (
        group.stopped ||
        previous === undefined ||
        input === undefined ||
        actualFrame <= previous.frame ||
        !this.#groupOptions!.canContinue(previous)
      )
        continue;
      ready.push({
        input: { ...input, frame: actualFrame },
        group,
        order: this.#declarationOrder.get(input)!,
      });
    }
    ready.sort((left, right) => left.input.frame - right.input.frame || left.order - right.order);
    for (const candidate of ready) {
      const { input } = candidate;
      if (candidate.group?.stopped) continue;
      const anchor = this.#continuationInputs[0];
      if (
        anchor !== undefined &&
        input.castId !== anchor.castId &&
        input.operatorId === anchor.operatorId &&
        this.#previousContinuationInput !== undefined &&
        this.#canContinue?.ignoreInputFailures !== true
      ) {
        // Never move a generated continuation past another authored operation on this operator.
        this.#continuationStopped = true;
      }
      const accepted = this.#processInput(input);
      const ownGroup =
        input.castId === undefined ? undefined : this.#groupByCastId.get(input.castId);
      if (ownGroup !== undefined) {
        ownGroup.previous = { ...input, frame: actualFrame };
        ownGroup.nextIndex += 1;
        if (!accepted) this.#stopGroup(ownGroup, 'inputRejected');
      }
      if (candidate.group === undefined && accepted) {
        this.#stopOtherGroupsForInput(input, ownGroup);
      }
      if (anchor !== undefined && input.castId === anchor.castId) {
        this.#previousContinuationInput = { ...input, frame: actualFrame };
        if (!accepted && this.#canContinue?.ignoreInputFailures !== true)
          this.#continuationStopped = true;
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
    const accepted = this.#processInput(input);
    if (accepted) this.#stopOtherGroupsForInput(input);
    if (!accepted && this.#canContinue?.ignoreInputFailures !== true)
      this.#continuationStopped = true;
  }

  #stopOtherGroupsForInput(input: ScheduledSkillInput, ownGroup?: SkillInputGroupState): void {
    for (const group of this.#groups) {
      if (
        group === ownGroup ||
        group.stopped ||
        group.previous === undefined ||
        group.previous.operatorId !== input.operatorId ||
        group.inputs[group.nextIndex] === undefined
      )
        continue;
      // 另一项作者操作已接管本轨道。即使前段自然结束而没有中断回执，也不跨过它补放旧组。
      this.#stopGroup(group, 'interruptedByFixedInput', input.castId);
    }
  }

  #stopGroup(
    group: SkillInputGroupState,
    reason: 'inputRejected' | 'interruptedByFixedInput',
    interruptingCastId?: string,
  ): void {
    group.stopped = true;
    const next = group.inputs[group.nextIndex];
    // 最后一段失败已有输入回执；只有尚未启动的后缀需要额外阻断事实。
    if (next === undefined || group.previous === undefined) return;
    this.#receipt.record({
      frame: this.#clock.frame,
      time: this.#clock.time,
      event: 'SkillInputGroupBlocked',
      sourceId: group.previous.operatorId,
      data: {
        anchorCastId: group.anchorCastId,
        castId: next.castId!,
        previousCastId: group.previous.castId!,
        reason,
        ...(interruptingCastId === undefined ? {} : { interruptingCastId }),
      },
    });
  }

  #processInput(input: ScheduledSkillInput): boolean {
    return processCombatSkillInput(input, this.#clock.frame, this.#tryStartSkill, this.#receipt);
  }
}
