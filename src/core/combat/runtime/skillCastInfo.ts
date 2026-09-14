/**
 * 描述一次技能释放在战斗运行时中的来源身份。
 * 该值只在单场模拟内流转并由 Buff 等实例复制，不属于项目存档或编辑器对象身份。
 */
export interface CombatSkillCastInfo {
  /** 单场运行时内的非零释放序号；0 保留为“没有来源施法”。 */
  readonly skillCastId: number;
  /** 最初发起本次施法链的技能；当前直接释放时就是正在执行的技能。 */
  readonly originSkillId: string;
  /** 最初发起本次施法链的技能类型，供 Buff 来源条件稳定读取。 */
  readonly originSkillType: import('../../game-data/operatorDefinition').SkillType;
  /** 时间轴上的技能块身份；单元测试或非时间轴技能可以缺失。 */
  readonly originCastId?: string;
  /** 本次施法在当前时刻已经实际扣除且未返还的技力。 */
  readonly nonReturnedSpCost: number;
}

/** 为单场模拟按技能实际启动顺序分配确定性施法序号。 */
export class SkillCastIdAllocator {
  readonly runtimeState: SkillCastIdState;

  constructor(restoredState: SkillCastIdState = { nextId: 1 }) {
    if (!Number.isSafeInteger(restoredState.nextId) || restoredState.nextId <= 0) {
      throw new RangeError('next skill cast id must be a positive safe integer');
    }
    this.runtimeState = restoredState;
  }

  allocate(): number {
    return allocateSkillCastId(this.runtimeState);
  }
}

/** 下一次实际施放使用的编号；与实体编号分别计数。 */
export interface SkillCastIdState {
  nextId: number;
}

export function allocateSkillCastId(state: SkillCastIdState): number {
  const result = state.nextId;
  if (!Number.isSafeInteger(result) || result <= 0) {
    throw new RangeError('skill cast id space is exhausted');
  }
  state.nextId += 1;
  return result;
}
