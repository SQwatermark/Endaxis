import type { ScheduledSkillInput } from './combatInputRuntime';

export interface SkillInputGroupRuntimeState {
  readonly anchorCastId: string;
  nextIndex: number;
  previous: ScheduledSkillInput | null;
  stopped: boolean;
}

export interface CombatInputRuntimeState {
  nextInputIndex: number;
  readonly continuation: {
    nextIndex: number;
    previous: ScheduledSkillInput | null;
    stopped: boolean;
  };
  readonly groups: SkillInputGroupRuntimeState[];
}
