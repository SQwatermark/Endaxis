import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import type { BuffApplicationHandle } from '../buffs/combatBuffs';

/** Adapter failure handling, not native gameplay behavior: finish cleanup, then report all errors. */
export function runAbilityHostCleanup(actions: Iterable<() => void>): void {
  const errors: unknown[] = [];
  for (const action of actions) {
    try {
      action();
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) throw new AggregateError(errors, 'Ability host cleanup failed');
}

export function failAfterAbilityHostCleanup(error: unknown, actions: Iterable<() => void>): never {
  try {
    runAbilityHostCleanup(actions);
  } catch (cleanupError) {
    throw new AggregateError([error, cleanupError], 'Ability initialization and cleanup failed');
  }
  throw error;
}

/** Ownership shared by projected passive Abilities, not a new battle-event dispatcher. */
export class AbilityEventHostLifecycle {
  readonly #registrations: AbilityEventRegistration[] = [];
  readonly #children: BuffApplicationHandle[] = [];
  readonly #cleanup: (() => void)[] = [];
  #enabled = false;
  #disposing = false;
  #disposed = false;

  get canExecuteAction(): boolean {
    return this.#enabled;
  }

  get acceptsEvents(): boolean {
    return this.#enabled && !this.#disposing && !this.#disposed;
  }

  enable(): void {
    if (this.#disposing || this.#disposed) throw new Error('cannot enable a disposed Ability host');
    this.#enabled = true;
  }

  register(registration: AbilityEventRegistration): void {
    if (this.#disposing || this.#disposed) {
      registration.dispose();
      throw new Error('cannot register with a disposed Ability host');
    }
    this.#registrations.push(registration);
  }

  addChildBuff(child: BuffApplicationHandle): void {
    if (this.#disposed) throw new Error('cannot attach a child to a disposed Ability host');
    this.#children.push(child);
  }

  onDisable(cleanup: () => void): void {
    if (this.#disposing || this.#disposed) throw new Error('cannot extend a disposed Ability host');
    this.#cleanup.push(cleanup);
  }

  dispose(): void {
    if (this.#disposing || this.#disposed) return;
    this.#disposing = true;
    try {
      runAbilityHostCleanup(this.#cleanupActions());
    } finally {
      this.#children.length = 0;
      this.#enabled = false;
      this.#disposing = false;
      this.#disposed = true;
    }
  }

  *#cleanupActions(): Generator<() => void> {
    for (const registration of this.#registrations.splice(0)) yield () => registration.dispose();
    yield* this.#cleanup.splice(0);
    // Keep the native live-list traversal even when an earlier adapter callback failed.
    for (let index = 0; index < this.#children.length; index++) {
      const child = this.#children[index]!;
      yield () => {
        child.finish('other', null);
      };
    }
  }
}
