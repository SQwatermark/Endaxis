import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import type { BuffApplicationHandle } from '../buffs/combatBuffs';

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
      for (const registration of this.#registrations.splice(0)) registration.dispose();
      for (const cleanup of this.#cleanup.splice(0)) cleanup();
      // Ability._RemoveAllChildBuff re-reads Count each iteration, unlike Skill.CastEnd's snapshot.
      for (let index = 0; index < this.#children.length; index++) {
        this.#children[index]!.finish('other', null);
      }
    } finally {
      this.#children.length = 0;
      this.#enabled = false;
      this.#disposing = false;
      this.#disposed = true;
    }
  }
}
