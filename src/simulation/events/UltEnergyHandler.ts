import type { EventHandler } from '@/simulation/events/EventHandler.ts';
import type { UltEnergyChangeEvent } from '@/simulation/events/event.types.ts';
import type { SimulationContext } from '@/simulation/engine/SimulationContext.ts';

export class UltEnergyHandler implements EventHandler<UltEnergyChangeEvent> {
  handle(e: UltEnergyChangeEvent, ctx: SimulationContext) {
    ctx.simLog({
      type: 'ULT_ENERGY_CHANGE',
      time: e.time,
      payload: {
        actorId: e.payload.actorId,
        change: e.payload.change,
        sourceId: e.payload.sourceId,
      },
    });
  }
}
