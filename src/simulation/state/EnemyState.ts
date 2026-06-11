import type { BaseGameState } from '@/simulation/state/BaseGameState.ts';
import type { EnemySnapshot, EnemyConfig } from '@/simulation/state/types.ts';
import type {
  InflictionState,
  VulnerabilityState,
  SolidificationState,
  CombustionState,
  ElectrificationState,
  CorrosionState,
  BreachState,
  EnemyStatusSnapshot,
  EnemyStatusEntry,
} from '@/simulation/engine/types';
import type { SimulationEngine } from '../engine/SimulationEngine';

export class EnemyState implements BaseGameState<EnemySnapshot> {
  private stagger: number = 0;

  private breakEndTime: number = 0;
  private lockEndTime: number = -1;

  nodeStep: number = 0;
  private currentTime: number = 0;

  /** Per-operator stagger contributions for the current stagger cycle. */
  private staggerContributions: Record<string, number> = {};
  /** Frozen contributions from the most recent break (persists through stagger window). */
  private lastBreakContributions: Record<string, number> = {};

  // ─── Absorbed from EnemySimState ─────────────────────────────────────────
  infliction: InflictionState | null = null;
  vulnerability: VulnerabilityState | null = null;
  solidification: SolidificationState | null = null;
  combustion: CombustionState | null = null;
  electrification: ElectrificationState | null = null;
  corrosion: CorrosionState | null = null;
  breach: BreachState | null = null;
  /** Unified map of all enemy StatusEffect entries (both stat-bearing and pure state). */
  enemyStatusEffects = new Map<string, EnemyStatusEntry>();

  constructor(
    readonly config: EnemyConfig,
    private engine: SimulationEngine,
  ) {
    this.nodeStep = this.config.maxStagger / (this.config.staggerNodeCount + 1);
  }

  isLocked(currentTime: number): boolean {
    return currentTime < this.lockEndTime - 0.0001;
  }

  isBroken(currentTime: number): boolean {
    return currentTime < this.breakEndTime - 0.0001;
  }

  addStagger(
    amount: number,
    currentTime: number,
  ): {
    broken: boolean;
    breakEnd?: number;
    nodeReachedIndex?: number;
    nodeEndTime?: number;
  } {
    if (this.isBroken(currentTime)) {
      return { broken: true };
    }

    const oldStagger = this.stagger;
    this.stagger = Math.max(0, this.stagger + amount);

    if (this.isLocked(currentTime)) {
      return { broken: false };
    }

    const hasNodes = this.config.staggerNodeCount > 0;

    if (this.stagger >= this.config.maxStagger - 0.0001) {
      this.stagger = 0;
      this.lastBreakContributions = { ...this.staggerContributions };
      this.staggerContributions = {};
      const breakDuration = this.config.staggerBreakDuration;
      const breakEnd = this.engine.getShiftedTime(currentTime, breakDuration);
      this.breakEndTime = breakEnd;
      this.lock(breakEnd);
      return { broken: true, breakEnd };
    }

    if (hasNodes) {
      const prevNodeIdx = Math.floor(oldStagger / this.nodeStep + 0.0001);
      const currNodeIdx = Math.floor(this.stagger / this.nodeStep + 0.0001);

      if (currNodeIdx > prevNodeIdx) {
        const nodeDuration = this.config.staggerNodeDuration;
        const nodeEnd = this.engine.getShiftedTime(currentTime, nodeDuration);
        this.lock(nodeEnd);
        return {
          broken: false,
          nodeReachedIndex: currNodeIdx,
          nodeEndTime: nodeEnd,
        };
      }
    }

    return { broken: false };
  }

  getStagger() {
    return this.stagger;
  }

  /** Record a stagger contribution from a source. Caps total at maxStagger (excess discarded). */
  addStaggerContribution(sourceId: string, amount: number): void {
    const currentTotal = Object.values(this.staggerContributions).reduce((s, v) => s + v, 0);
    const cappedAmount = Math.min(amount, this.config.maxStagger - currentTotal);
    if (cappedAmount > 0) {
      this.staggerContributions[sourceId] =
        (this.staggerContributions[sourceId] ?? 0) + cappedAmount;
    }
  }

  /** Get stagger contribution fractions from the most recent break. Returns { sourceId: fraction }. */
  getStaggerContributionFractions(): Record<string, number> {
    const total = Object.values(this.lastBreakContributions).reduce((s, v) => s + v, 0);
    if (total <= 0) return {};
    const result: Record<string, number> = {};
    for (const [id, val] of Object.entries(this.lastBreakContributions)) {
      result[id] = val / total;
    }
    return result;
  }

  advanceTime(_dt: number, currentTime: number) {
    this.currentTime = currentTime;
  }

  snapshot(): EnemySnapshot {
    return {
      stagger: this.stagger,
      isBroken: this.isBroken(this.currentTime),
      isLocked: this.isLocked(this.currentTime),
      breakEndTime: this.breakEndTime,
      lockEndTime: this.lockEndTime,
    };
  }

  applyStatus(entry: EnemyStatusEntry): void {
    const existing = this.enemyStatusEffects.get(entry.id);
    const newStacks = Math.min((existing?.stacks ?? 0) + entry.stacks, entry.maxStacks);
    this.enemyStatusEffects.set(entry.id, { ...entry, stacks: newStacks });
  }

  expireStatus(id: string): void {
    this.enemyStatusEffects.delete(id);
  }

  hasStatus(id: string): boolean {
    return this.enemyStatusEffects.has(id);
  }

  getStatusStacks(id: string, currentTime: number): number {
    const e = this.enemyStatusEffects.get(id);
    if (!e || currentTime >= e.expiresAt) return 0;
    return e.stacks;
  }

  /** Returns the consumedStacks snapshotted onto the entry, or undefined if absent.
   *  Handles @instanceKey suffix from scheduleDotTicks (falls back to base-id scan). */
  getStatusConsumedStacks(id: string, _currentTime: number): Record<string, number> | undefined {
    const exact = this.enemyStatusEffects.get(id);
    if (exact) return exact.consumedStacks;
    for (const [key, entry] of this.enemyStatusEffects) {
      if (!key) continue;
      if (key.split('@')[0] === id) return entry.consumedStacks;
    }
    return undefined;
  }

  /** Decrements stacks by n. Removes the entry if stacks reach 0. Returns entry metadata (with remaining stacks). */
  consumeStatusStacks(
    id: string,
    n: number,
    time: number,
  ): {
    remaining: number;
    maxStacks: number;
    expiresAt: number;
    sourceId: string;
    icon?: string;
  } | null {
    const entry = this.enemyStatusEffects.get(id);
    if (!entry || time >= entry.expiresAt) return null;
    const remaining = entry.stacks - n;
    if (remaining <= 0) {
      // Mark depleted but keep in map — caller is responsible for deletion
      // (deferred so onStatusConsumed triggers can still read the entry)
      entry.stacks = 0;
      return {
        remaining: 0,
        maxStacks: entry.maxStacks,
        expiresAt: entry.expiresAt,
        sourceId: entry.sourceId,
        icon: entry.icon,
      };
    }
    entry.stacks = remaining;
    return {
      remaining,
      maxStacks: entry.maxStacks,
      expiresAt: entry.expiresAt,
      sourceId: entry.sourceId,
      icon: entry.icon,
    };
  }

  /** Snapshot of all enemy status fields for hit-condition evaluation. */
  statusSnapshot(): EnemyStatusSnapshot {
    return {
      infliction: this.infliction,
      vulnerability: this.vulnerability,
      solidification: this.solidification,
      combustion: this.combustion,
      electrification: this.electrification,
      corrosion: this.corrosion,
      breach: this.breach,
      enemyStatusEffects: new Map(this.enemyStatusEffects),
    };
  }

  private lock(untilTime: number) {
    this.lockEndTime = untilTime;
  }
}
