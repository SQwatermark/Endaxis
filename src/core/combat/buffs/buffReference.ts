import { type BuffReference } from '../state/foundationState';

/** 字符串键只用于索引，不承载解析规则；JSON 编码避免目标名称含分隔符时碰撞。 */
export function buffReferenceKey(reference: BuffReference): string {
  return JSON.stringify([reference.ownerId, reference.instanceId]);
}
