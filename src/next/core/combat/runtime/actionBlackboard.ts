/**
 * 管理技能 direct blackboard，并按原生查找顺序回退读取干员 entity blackboard。
 * 普通键随技能实例重置；`EntityBB_` 动态写入会路由到同一干员共享的实体黑板。
 */
import type { ActionValueOperand } from '../../game-data/operatorDefinition';

export type ActionBlackboardValue = string | number | null;

const FLOAT_ASSIGNMENT_EPSILON = 0.00001;
const ENTITY_BLACKBOARD_PREFIX = 'EntityBB_';

/** 数据驱动战斗行为使用的分层可变值容器，不承担存档持久化。 */
export class ActionBlackboard {
  readonly #values = new Map<string, ActionBlackboardValue>();
  readonly #entityBlackboard?: ActionBlackboard;

  constructor(
    values?: Readonly<Record<string, ActionBlackboardValue>>,
    entityBlackboard?: ActionBlackboard,
  ) {
    this.#entityBlackboard = entityBlackboard;
    this.assign(values);
  }

  assign(values?: Readonly<Record<string, ActionBlackboardValue>>): void {
    if (values === undefined) return;
    for (const [key, value] of Object.entries(values)) this.#values.set(key, value);
  }

  getString(key: string): string | undefined {
    const value = this.#getValue(key);
    return typeof value === 'string' ? value : undefined;
  }

  getNumber(key: string): number | undefined {
    const value = this.#getValue(key);
    return typeof value === 'number' ? value : undefined;
  }

  assignDynamic(key: string, value: number): boolean {
    const target = this.#dynamicTarget(key);
    const current = target.#getDirectValue(key);
    if (typeof current === 'number' && Math.abs(current - value) <= FLOAT_ASSIGNMENT_EPSILON) {
      return false;
    }
    target.#values.set(key, value);
    return true;
  }

  /**
   * 原生 AssignDynamic 本身不做 epsilon 检查。调用方已按 GetFloat 比较（可能读到 direct 遮蔽）
   * 后必须用此入口，不能再按目标实体板的另一个值跳过赋值。既有融合比较入口仍保持不变。
   */
  assignDynamicUnconditionally(key: string, value: number): void {
    this.#dynamicTarget(key).#values.set(key, value);
  }

  #dynamicTarget(key: string): ActionBlackboard {
    return key.startsWith(ENTITY_BLACKBOARD_PREFIX) ? (this.#entityBlackboard ?? this) : this;
  }

  snapshot(): Readonly<Record<string, ActionBlackboardValue>> {
    return Object.fromEntries(this.#values);
  }

  restore(values: Readonly<Record<string, ActionBlackboardValue>>): void {
    this.#values.clear();
    this.assign(values);
  }

  /** 创建子 SkillData direct 作用域；独立逻辑宿主可同时创建自己的 entity blackboard。 */
  createLocalScope(
    initialValues: Readonly<Record<string, ActionBlackboardValue>>,
    inheritDirect: boolean,
    entityInitialValues?: Readonly<Record<string, ActionBlackboardValue>>,
  ): ActionBlackboard {
    return new ActionBlackboard(
      inheritDirect ? { ...initialValues, ...this.snapshot() } : initialValues,
      entityInitialValues === undefined
        ? this.#entityBlackboard
        : new ActionBlackboard(entityInitialValues),
    );
  }

  #getValue(key: string): ActionBlackboardValue | undefined {
    if (this.#values.has(key)) return this.#values.get(key);
    return this.#entityBlackboard === undefined
      ? undefined
      : this.#entityBlackboard.#getDirectValue(key);
  }

  #getDirectValue(key: string): ActionBlackboardValue | undefined {
    return this.#values.get(key);
  }
}

/** 严格解析动作操作数；黑板键缺失时不能使用序列化默认值掩盖数据错误。 */
export function resolveActionValueOperand(
  operand: ActionValueOperand,
  blackboard: ActionBlackboard,
): number {
  if (operand.kind === 'constant') return operand.value;
  const value = blackboard.getNumber(operand.key);
  if (value === undefined) {
    throw new Error(`action blackboard value '${operand.key}' is missing`);
  }
  return value;
}
