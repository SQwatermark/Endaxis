import { PeriodicTimer } from './periodicTimer';

const POISE_EPSILON = 0.00001;

export interface CombatVitalsSnapshot {
  readonly health: number;
  readonly maxPoise: number;
  readonly poise: number;
  readonly poiseRecoveryTime: number;
  readonly poiseRecoveryTimeMultiplier: number;
  readonly poiseBrokenEndTime: number;
  readonly poiseImmune: boolean;
}

export interface HealthDamageResult {
  readonly requestedDamage: number;
  readonly actualDamage: number;
  readonly previousHealth: number;
  readonly currentHealth: number;
}

export type PoiseTimerTransition = 'poiseRecovered' | 'poiseBrokenTagEnded';

/** 不掺杂技能、事件分发或展示职责的生命与失衡状态。 */
export class CombatVitals {
  #health: number;
  #poise: number;
  #poiseImmune: boolean;
  #stopPoiseRecovery = false;
  #hasPoiseBrokenTag = false;
  readonly #maxPoise: number;
  readonly #poiseRecoveryTime: number;
  readonly #poiseRecoveryTimeMultiplier: number;
  readonly #poiseBrokenEndTime: number;
  readonly #poiseRecoveryTimer = new PeriodicTimer();
  readonly #poiseBrokenEndTimer = new PeriodicTimer();

  constructor(snapshot: CombatVitalsSnapshot) {
    for (const [name, value] of Object.entries(snapshot)) {
      if (typeof value === 'number' && (!Number.isFinite(value) || value < 0)) {
        throw new RangeError(`${name} must be a non-negative finite number`);
      }
    }
    if (snapshot.poise > snapshot.maxPoise + POISE_EPSILON) {
      throw new RangeError('poise exceeds maxPoise');
    }
    this.#health = snapshot.health;
    this.#maxPoise = snapshot.maxPoise;
    this.#poise = snapshot.poise;
    this.#poiseRecoveryTime = snapshot.poiseRecoveryTime;
    this.#poiseRecoveryTimeMultiplier = snapshot.poiseRecoveryTimeMultiplier;
    this.#poiseBrokenEndTime = snapshot.poiseBrokenEndTime;
    this.#poiseImmune = snapshot.poiseImmune;
  }

  get health(): number {
    return this.#health;
  }
  get poise(): number {
    return this.#poise;
  }
  get hasPoise(): boolean {
    return this.#maxPoise > POISE_EPSILON;
  }
  get poiseImmune(): boolean {
    return this.#poiseImmune;
  }
  get inPoiseRecovery(): boolean {
    return this.#poiseRecoveryTimer.isValid && !this.#poiseRecoveryTimer.isReady;
  }
  get poiseRecoveryProgress(): number {
    return this.#poiseRecoveryTimer.isValid ? this.#poiseRecoveryTimer.progress : 0;
  }
  get hasPoiseBrokenTag(): boolean {
    return this.#hasPoiseBrokenTag;
  }
  set stopPoiseRecovery(value: boolean) {
    this.#stopPoiseRecovery = value;
  }
  set poiseImmune(value: boolean) {
    this.#poiseImmune = value;
  }

  takeDamage(value: number): HealthDamageResult {
    const previousHealth = this.#health;
    const requestedDamage = Math.max(0, value);
    this.#health = Math.max(0, this.#health - requestedDamage);
    return {
      requestedDamage,
      actualDamage: previousHealth - this.#health,
      previousHealth,
      currentHealth: this.#health,
    };
  }

  applyPoiseDelta(delta: number): number {
    if (!this.hasPoise) return 0;
    const previousPoise = this.#poise;
    const next = Math.min(this.#maxPoise, Math.max(0, this.#poise + delta));
    if (Math.abs(next - this.#poise) > POISE_EPSILON) this.#poise = next;
    return this.#poise - previousPoise;
  }

  beginPoiseBreakIfZero(): boolean {
    if (!this.hasPoise || this.inPoiseRecovery || Math.abs(this.#poise) > POISE_EPSILON) {
      return false;
    }
    const recoveryTime = this.#poiseRecoveryTime * this.#poiseRecoveryTimeMultiplier;
    if (recoveryTime > 0) this.#poiseRecoveryTimer.reset(recoveryTime, true);
    this.#poiseBrokenEndTimer.markInvalid();
    this.#hasPoiseBrokenTag = true;
    return true;
  }

  tick(
    deltaTime: number,
    onTransition?: (transition: PoiseTimerTransition) => void,
  ): readonly PoiseTimerTransition[] {
    const transitions: PoiseTimerTransition[] = [];
    if (
      this.#poiseRecoveryTimer.isValid &&
      !this.#stopPoiseRecovery &&
      this.#poiseRecoveryTimer.update(deltaTime)
    ) {
      this.#poiseRecoveryTimer.markInvalid();
      this.#poise = this.#maxPoise;
      if (this.#poiseBrokenEndTime > 0) {
        this.#poiseBrokenEndTimer.reset(this.#poiseBrokenEndTime, true);
      } else {
        this.#hasPoiseBrokenTag = false;
      }
      transitions.push('poiseRecovered');
      onTransition?.('poiseRecovered');
    }
    if (this.#poiseBrokenEndTimer.isValid && this.#poiseBrokenEndTimer.update(deltaTime)) {
      this.#poiseBrokenEndTimer.markInvalid();
      this.#hasPoiseBrokenTag = false;
      transitions.push('poiseBrokenTagEnded');
      onTransition?.('poiseBrokenTagEnded');
    }
    return transitions;
  }
}
