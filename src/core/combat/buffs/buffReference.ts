/** 单场战斗中定位一个 Buff 实例；各目标容器独立分配编号，因此必须同时保留所属目标。 */
export interface BuffReference {
  readonly ownerId: string;
  readonly instanceId: number;
}

/** 字符串键只用于索引，不承载解析规则；JSON 编码避免目标名称含分隔符时碰撞。 */
export function buffReferenceKey(reference: BuffReference): string {
  return JSON.stringify([reference.ownerId, reference.instanceId]);
}
