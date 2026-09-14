/** 全局 Buff 的寿命、子实例引用与共享技力修正，按创建顺序归入同名组。 */
import type { BuffReference } from '../buffs/buffReference';
import type { ActionBlackboardState } from './actionBlackboardState';
import type {
  SharedSpGainModifier,
  SharedSpRecoveryModifier,
} from '../resources/sharedSpGainModifiers';

export interface GlobalBuffInstanceState {
  readonly id: string;
  readonly instanceId: number;
  readonly sourceId: string;
  readonly sourceActionOwnerId: string | undefined;
  readonly sourceActionId: string | undefined;
  readonly blackboard: ActionBlackboardState;
  readonly children: BuffReference[];
  readonly sharedSpGainModifiers: readonly SharedSpGainModifier[];
  readonly sharedSpRecoveryModifiers: readonly SharedSpRecoveryModifier[];
  remainingDuration: number | null;
  finished: boolean;
}

export interface GlobalBuffState {
  nextInstanceId: number;
  readonly groups: Map<string, GlobalBuffInstanceState[]>;
}

export function createGlobalBuffState(): GlobalBuffState {
  return { nextInstanceId: 1, groups: new Map() };
}
