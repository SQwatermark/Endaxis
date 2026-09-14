/**
 * 场景随机流的全部可变数据。两张表只保存整数，不保存随机函数或闭包。
 * 状态由调用方持有；复制后可独立推进，替换后继续取样，不需要重新创建随机算法。
 */
export interface SimulationRandomState {
  /** 随机模式各来源的当前 Mulberry32 整数状态。 */
  readonly streams: Map<string, number>;
  /** 期望模式各来源已经消费的均匀样本数量。 */
  readonly evenIndices: Map<string, number>;
}

/** 创建尚未取样的随机状态，不预装之后技能块的种子或施放计划。 */
export function createSimulationRandomState(): SimulationRandomState {
  return { streams: new Map(), evenIndices: new Map() };
}
