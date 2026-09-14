import type { ScheduledExternalCombatEventInput } from './externalCombatEventRuntime';

export interface ExternalCombatEventRuntimeState {
  nextEventIndex: number;
  previousEvent: ScheduledExternalCombatEventInput | null;
}
