import type { InteractionSession } from './interactionSession';

/** Service-created modals have a promise lifetime, rather than a component open prop. */
export function createAsyncModalBoundary(session: InteractionSession) {
  const pending = new Map<symbol, () => void>();
  let disposed = false;
  return {
    get active(): boolean {
      return pending.size > 0;
    },
    async run<T>(open: () => T | PromiseLike<T>): Promise<T> {
      if (disposed) throw new Error('Modal owner has been disposed');
      const token = Symbol('async-modal');
      // Keyboard isolation must already be active during gesture cancellation callbacks.
      pending.set(token, () => {});
      let release = () => {};
      try {
        release = session.block();
        if (disposed) throw new Error('Modal owner has been disposed');
        pending.set(token, release);
        const result = await open();
        if (disposed) throw new Error('Modal owner has been disposed');
        return result;
      } finally {
        pending.delete(token);
        release();
      }
    },
    dispose(): void {
      disposed = true;
      for (const release of pending.values()) release();
      pending.clear();
    },
  };
}
