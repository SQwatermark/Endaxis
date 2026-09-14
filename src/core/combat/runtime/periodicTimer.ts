/** 冷却与失衡恢复使用的现有计时器绑定，算法和状态分别定义。 */
import { createPeriodicTimerState } from '../state/environmentState';
import {
  isPeriodicTimerValid,
  isPeriodicTimerReady,
  readPeriodicTimerProgress,
  resetPeriodicTimer,
  setPeriodicTimerRemaining,
  invalidatePeriodicTimer,
  updatePeriodicTimer,
} from './periodicTimerExecution';

export class PeriodicTimer {
  readonly #state = createPeriodicTimerState();
  get remaining(): number {
    return this.#state.remaining;
  }
  get passed(): number {
    return this.#state.passed;
  }
  get isValid(): boolean {
    return isPeriodicTimerValid(this.#state);
  }
  get isReady(): boolean {
    return isPeriodicTimerReady(this.#state);
  }
  get progress(): number {
    return readPeriodicTimerProgress(this.#state);
  }
  reset(period: number, waitFirstPeriod: boolean): void {
    return resetPeriodicTimer(this.#state, period, waitFirstPeriod);
  }
  setRemaining(remaining: number): void {
    return setPeriodicTimerRemaining(this.#state, remaining);
  }
  markInvalid(): void {
    return invalidatePeriodicTimer(this.#state);
  }
  update(deltaTime: number): boolean {
    return updatePeriodicTimer(this.#state, deltaTime);
  }
}
