/**
 * 分开保存伤害动作的固定身份和 Reset 时取到的攻击数值。
 * 可变数据只以数字索引为键，复制切面后不会因动作对象身份变化而丢失快照。
 * 动作索引属于当前宿主的程序绑定，恢复时复用同一绑定，不恢复或复用其编号。
 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';

export interface DamageCalculationSnapshot {
  readonly attack: number;
  readonly attackScale: number;
  readonly baseValue: number;
}

export type DamageCalculationSnapshotState = Map<number, DamageCalculationSnapshot>;

/** 同一动作对象重复 Reset 使用同一索引；内容相同的不同动作不能合并。 */
export class DamageCalculationSnapshotProgram {
  readonly #slots = new WeakMap<ResolvedCombatOperationStep, number>();
  #nextSlot = 0;

  find(step: ResolvedCombatOperationStep): number | undefined {
    return this.#slots.get(step);
  }

  register(step: ResolvedCombatOperationStep): number {
    const existing = this.find(step);
    if (existing !== undefined) return existing;
    const slot = this.#nextSlot++;
    this.#slots.set(step, slot);
    return slot;
  }
}

/** 过渡绑定：执行时把固定动作解析为索引，所有数值只写入 runtimeState。 */
export class DamageCalculationSnapshots {
  constructor(
    readonly program = new DamageCalculationSnapshotProgram(),
    readonly runtimeState: DamageCalculationSnapshotState = new Map(),
  ) {}

  get size(): number {
    return this.runtimeState.size;
  }

  has(step: ResolvedCombatOperationStep): boolean {
    const slot = this.program.find(step);
    return slot !== undefined && this.runtimeState.has(slot);
  }

  get(step: ResolvedCombatOperationStep): DamageCalculationSnapshot | undefined {
    const slot = this.program.find(step);
    return slot === undefined ? undefined : this.runtimeState.get(slot);
  }

  set(step: ResolvedCombatOperationStep, snapshot: DamageCalculationSnapshot): void {
    this.runtimeState.set(this.program.register(step), { ...snapshot });
  }

  clear(): void {
    this.runtimeState.clear();
  }
}
