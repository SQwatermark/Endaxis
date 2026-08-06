export interface GameLevelEventContext<Event, Payload = unknown> {
  readonly event: Event;
  readonly payload: Payload;
}

export type GameLevelEventHandler<Event, Payload = unknown> = (
  context: GameLevelEventContext<Event, Payload>,
) => void;

/** Synchronous level-event broadcast in registration order. */
export class GameLevelEventDispatcher<Event, Payload = unknown> {
  readonly #callbacks = new Map<Event, GameLevelEventHandler<Event, Payload>[]>();

  registerCallback(event: Event, callback: GameLevelEventHandler<Event, Payload>): void {
    const callbacks = this.#callbacks.get(event);
    if (callbacks === undefined) {
      this.#callbacks.set(event, [callback]);
      return;
    }
    callbacks.push(callback);
  }

  dispatch(context: GameLevelEventContext<Event, Payload>): void {
    for (const callback of this.#callbacks.get(context.event)?.slice() ?? []) callback(context);
  }
}
