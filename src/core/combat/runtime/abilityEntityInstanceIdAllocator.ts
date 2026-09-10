/**
 * 一场战斗内所有带 AbilitySystem 的逻辑实体共用的实例编号分配器。
 * 投射物和普通能力实体不能各自从 1 开始，否则 RuntimeTargetRef 会发生身份碰撞。
 */
export class AbilityEntityInstanceIdAllocator {
  #next = 1;

  allocate(): number {
    const value = this.#next;
    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new RangeError('ability entity instance id space is exhausted');
    }
    this.#next += 1;
    return value;
  }
}
