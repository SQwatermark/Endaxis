/** 同一目标内一个叠层组的成员与计数。成员只保存该目标容器内的 Buff 实例编号。 */
export interface BuffStackingState {
  readonly members: number[];
  currentStackCount: number;
  maxStackCount: number;
}

export function createBuffStackingState(): BuffStackingState {
  return { members: [], currentStackCount: 0, maxStackCount: 0 };
}
