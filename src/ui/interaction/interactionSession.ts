import { shallowRef } from 'vue';

export interface InteractionLease {
  readonly owner: string;
  readonly isCurrent: () => boolean;
  readonly release: () => void;
}

/** One workbench, one editing gesture. Labels describe owners; leases identify attempts. */
export function createInteractionSession() {
  const current = shallowRef<InteractionLease | null>(null);
  let cancelCurrent: (() => void) | null = null;
  return {
    get current() {
      return current.value;
    },
    tryStart(owner: string, onCancel: () => void): InteractionLease | null {
      if (current.value !== null) return null;
      const lease: InteractionLease = {
        owner,
        isCurrent: () => current.value === lease,
        release: () => {
          if (current.value !== lease) return;
          current.value = null;
          cancelCurrent = null;
        },
      };
      current.value = lease;
      cancelCurrent = onCancel;
      return lease;
    },
    cancel(): boolean {
      const callback = cancelCurrent;
      if (callback === null) return false;
      current.value = null;
      cancelCurrent = null;
      callback();
      return true;
    },
  };
}

export type InteractionSession = ReturnType<typeof createInteractionSession>;
