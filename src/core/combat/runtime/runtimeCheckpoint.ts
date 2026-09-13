/**
 * 战斗运行时切面的公共协议。
 *
 * 切面只保存在同一进程、同一个运行时实例中恢复所需的状态，不是存档格式，也不要求可序列化。
 * 静态程序、定义和无状态回调不进入切面；每个参与者只保存自己拥有的可变状态。
 */

/** 一个运行时组件保存和恢复自身可变状态的端口。 */
export interface RuntimeCheckpointParticipant<State = unknown> {
  /** 返回与组件后续修改隔离的状态；不能返回仍会被原组件原地修改的集合。 */
  captureCheckpointState(): State;
  /** 在修改组件前检查状态是否仍可恢复。 */
  validateCheckpointState?(state: State): void;
  /** 完整替换组件的可变状态，不能追加、合并或重新执行过去的行为。 */
  restoreCheckpointState(state: State): void;
}

interface RegisteredParticipant {
  readonly key: string;
  readonly participant: RuntimeCheckpointParticipant;
}

interface RuntimeCheckpointPayload {
  readonly owner: object;
  readonly states: readonly unknown[];
}

const checkpointPayloads = new WeakMap<RuntimeCheckpoint, RuntimeCheckpointPayload>();

/**
 * 某一时刻已经发生状态的不透明切面。
 * 它可以在所属控制器上重复恢复，但不能交给另一场战斗或读写内部状态。
 */
export class RuntimeCheckpoint {
  readonly frame: number;

  constructor(frame: number, payload: RuntimeCheckpointPayload) {
    if (!Number.isInteger(frame)) throw new RangeError('checkpoint frame must be an integer');
    this.frame = frame;
    checkpointPayloads.set(this, payload);
    Object.freeze(this);
  }
}

/**
 * 按固定顺序管理一场战斗的切面参与者。
 * 第一次保存后参与者集合被冻结；动态实体必须由其稳定所有者作为内部状态保存和恢复。
 */
export class RuntimeCheckpointController {
  readonly #owner = {};
  readonly #readFrame: () => number;
  readonly #participants: RegisteredParticipant[] = [];
  readonly #keys = new Set<string>();
  #topologyFrozen = false;
  #busy = false;

  constructor(readFrame: () => number) {
    this.#readFrame = readFrame;
  }

  register<State>(key: string, participant: RuntimeCheckpointParticipant<State>): void {
    if (this.#topologyFrozen) {
      throw new Error(`cannot register checkpoint participant '${key}' after the first capture`);
    }
    if (key.length === 0) throw new Error('checkpoint participant key must not be empty');
    if (this.#keys.has(key)) throw new Error(`duplicate checkpoint participant '${key}'`);
    this.#keys.add(key);
    this.#participants.push({ key, participant: participant as RuntimeCheckpointParticipant });
  }

  capture(): RuntimeCheckpoint {
    return this.#exclusive('capture', () => {
      const frame = this.#readFrame();
      if (!Number.isInteger(frame)) throw new RangeError('checkpoint frame must be an integer');
      this.#topologyFrozen = true;
      const states = this.#participants.map(({ participant }) =>
        participant.captureCheckpointState(),
      );
      return new RuntimeCheckpoint(frame, { owner: this.#owner, states });
    });
  }

  restore(checkpoint: RuntimeCheckpoint): void {
    this.#exclusive('restore', () => {
      const payload = checkpointPayloads.get(checkpoint);
      if (payload?.owner !== this.#owner) {
        throw new Error('checkpoint belongs to another runtime');
      }
      if (payload.states.length !== this.#participants.length) {
        throw new Error('checkpoint participant topology changed after capture');
      }
      for (let index = 0; index < this.#participants.length; index += 1) {
        this.#participants[index]!.participant.validateCheckpointState?.(payload.states[index]);
      }
      // 后注册的组件通常依赖先注册的基础账本，逆序恢复可以先撤销依赖方。
      for (let index = this.#participants.length - 1; index >= 0; index -= 1) {
        this.#participants[index]!.participant.restoreCheckpointState(payload.states[index]);
      }
    });
  }

  #exclusive<Result>(operation: string, run: () => Result): Result {
    if (this.#busy) throw new Error(`cannot ${operation} during another checkpoint operation`);
    this.#busy = true;
    try {
      return run();
    } finally {
      this.#busy = false;
    }
  }
}
