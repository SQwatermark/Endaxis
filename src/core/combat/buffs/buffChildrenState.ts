/** 父 Buff 持有的子实例引用。按附着顺序保存，目标与实例编号共同确定身份。 */
import type { BuffReference } from './buffReference';

export interface BuffChildrenState {
  readonly members: Map<string, BuffReference>;
}

export function createBuffChildrenState(): BuffChildrenState {
  return { members: new Map() };
}
