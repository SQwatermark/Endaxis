const READY_EPSILON = 0.00001;

/** 冷却和失衡恢复使用的原生单周期计时器状态。 */
export class PeriodicTimer {
  #period = -1;
  #remaining = -1;
  #passed = 0;

  get isValid(): boolean {
    return this.#period > 0;
  }

  get isReady(): boolean {
    return Math.abs(this.#remaining) <= READY_EPSILON;
  }

  get progress(): number {
    return this.#period === 0 ? 1 : Math.min(1, Math.max(0, 1 - this.#remaining / this.#period));
  }

  reset(period: number, waitFirstPeriod: boolean): void {
    this.#period = Math.max(0, period);
    this.#remaining = waitFirstPeriod ? this.#period : 0;
    this.#passed = 0;
  }

  markInvalid(): void {
    this.#period = -1;
    this.#remaining = -1;
  }

  update(deltaTime: number): boolean {
    if (deltaTime < 0) throw new RangeError('timer delta must not be negative');
    this.#remaining -= deltaTime;
    this.#passed += deltaTime;
    if (this.#remaining > 0) return false;
    this.#remaining = 0;
    this.#passed = this.#period;
    return true;
  }
}
