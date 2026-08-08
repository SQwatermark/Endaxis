/**
 * 描述一次技能释放在战斗运行时中的来源身份。
 * 该值只在单场模拟内流转并由 Buff 等实例复制，不属于项目存档或编辑器对象身份。
 */
export interface CombatSkillCastInfo {
  /** 单场运行时内的非零释放序号；0 保留为“没有来源施法”。 */
  readonly skillCastId: number;
  /** 最初发起本次施法链的技能；当前直接释放时就是正在执行的技能。 */
  readonly originSkillId: string;
  /** 本次施法在当前时刻已经实际扣除且未返还的技力。 */
  readonly nonReturnedSpCost: number;
}

/** 为单场模拟按技能实际启动顺序分配确定性施法序号。 */
export class SkillCastIdAllocator {
  #nextId = 1;

  allocate(): number {
    const result = this.#nextId;
    this.#nextId += 1;
    return result;
  }
}
