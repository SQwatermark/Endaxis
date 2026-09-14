/** 分支动作只保存选中的程序下标，分支序列自身的进度由战斗数据另行持有。 */
export interface BranchActionState {
  activeBranch: number | null;
}

export function createBranchActionState(): BranchActionState {
  return { activeBranch: null };
}
