/**
 * 完整战斗装配的检查点会话。
 *
 * 检查点只持有数据图副本；恢复工厂必须用同一棵切面树的固定程序建立新装配。候选完整成功前，
 * 当前装配不会被替换。丢弃检查点句柄后，WeakMap 不再保留对应历史数据。
 */
import type { CombatStateGraph } from './combatStateGraph';
import type { CombatRuntimeAssembly } from './combatRuntimeAssembly';

const combatCheckpointIdentity: unique symbol = Symbol('combat runtime checkpoint');

export interface CombatRuntimeCheckpoint {
  readonly [combatCheckpointIdentity]: true;
}

export type RestoreCombatRuntimeAssembly = (graph: CombatStateGraph) => CombatRuntimeAssembly;

export class CombatRuntimeSession {
  #current: CombatRuntimeAssembly;
  readonly #restoreAssembly: RestoreCombatRuntimeAssembly;
  readonly #checkpoints = new WeakMap<CombatRuntimeCheckpoint, CombatStateGraph>();
  #phase: 'idle' | 'advancing' | 'saving' | 'restoring' | 'faulted' = 'idle';
  #generation = 0;

  constructor(current: CombatRuntimeAssembly, restoreAssembly: RestoreCombatRuntimeAssembly) {
    this.#current = current;
    this.#restoreAssembly = restoreAssembly;
  }

  get frame(): number {
    return this.#current.clock.frame;
  }

  /** 恢复后换代；观察缓存和外部句柄可据此拒绝旧分支。 */
  get generation(): number {
    return this.#generation;
  }

  readState(): CombatStateGraph {
    this.#assertIdle('read');
    return structuredClone(this.#current.stateGraph);
  }

  advanceFrame(): void {
    this.advanceFrames(1);
  }

  advanceFrames(count: number): void {
    this.#assertIdle('advance');
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new RangeError('combat session frame count must be a non-negative safe integer');
    }
    this.#phase = 'advancing';
    try {
      this.#current.advanceFrames(count);
      this.#phase = 'idle';
    } catch (error) {
      this.#phase = 'faulted';
      throw error;
    }
  }

  save(): CombatRuntimeCheckpoint {
    this.#assertIdle('save');
    this.#phase = 'saving';
    try {
      const checkpoint: CombatRuntimeCheckpoint = Object.freeze({
        [combatCheckpointIdentity]: true as const,
      });
      this.#checkpoints.set(checkpoint, structuredClone(this.#current.stateGraph));
      return checkpoint;
    } finally {
      this.#phase = 'idle';
    }
  }

  /** 从保存点建立完全独立的试探会话；父会话不登记候选，也不改变当前分支。 */
  fork(
    checkpoint: CombatRuntimeCheckpoint,
    restoreAssembly: RestoreCombatRuntimeAssembly = this.#restoreAssembly,
  ): CombatRuntimeSession {
    this.#assertIdle('fork');
    const saved = this.#requireCheckpoint(checkpoint);
    return new CombatRuntimeSession(restoreAssembly(structuredClone(saved)), restoreAssembly);
  }

  /** 显式释放仍被调用方持有句柄的历史数据；之后该句柄不能再恢复或分叉。 */
  discardCheckpoint(checkpoint: CombatRuntimeCheckpoint): void {
    this.#assertIdle('discard checkpoint');
    if (!this.#checkpoints.delete(checkpoint)) {
      throw new Error('checkpoint does not belong to this combat session');
    }
  }

  restore(
    checkpoint: CombatRuntimeCheckpoint,
    restoreAssembly: RestoreCombatRuntimeAssembly = this.#restoreAssembly,
  ): void {
    if (this.#phase !== 'idle' && this.#phase !== 'faulted') {
      throw new Error(`cannot restore combat session while ${this.#phase}`);
    }
    const saved = this.#requireCheckpoint(checkpoint);
    const previousPhase = this.#phase;
    this.#phase = 'restoring';
    try {
      const candidate = restoreAssembly(structuredClone(saved));
      this.#current = candidate;
      this.#generation += 1;
      this.#phase = 'idle';
    } catch (error) {
      this.#phase = previousPhase;
      throw error;
    }
  }

  #assertIdle(operation: string): void {
    if (this.#phase !== 'idle') {
      throw new Error(`cannot ${operation} combat session while ${this.#phase}`);
    }
  }

  #requireCheckpoint(checkpoint: CombatRuntimeCheckpoint): CombatStateGraph {
    const saved = this.#checkpoints.get(checkpoint);
    if (saved === undefined) throw new Error('checkpoint does not belong to this combat session');
    return saved;
  }
}
