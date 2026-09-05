import type { CombatBuffContainer } from '../buffs/combatBuffs';
import type { GameplayTagPredefine } from '../tags/gameplayTagPredefine';
import { PeriodicTimer } from './periodicTimer';

/** 普通倒地切片的内部控制结果；成功与仅打断互斥，不由 Buff 添加结果推断。 */
export type KnockDownControlResult = 'failure' | 'success' | 'interruption';

export type KnockDownComponentEvent =
  | 'beforeTakeKnockDown'
  | 'beforeApplyPhysics'
  | 'beforeOutputKnockDown'
  | 'forceTriggerWeakness'
  | 'afterTakeKnockDown'
  | 'afterApplyPhysics'
  | 'afterOutputKnockDown';

/** 一次调用的来源与同步事件端口，不保存到实体的跨帧状态中。 */
export interface KnockDownComponentInvocation {
  readonly readSourceDurationAddition: () => number;
  readonly emit: (event: KnockDownComponentEvent) => void;
  /** 原生控制器尾部回调；可以再次改变控制状态。 */
  readonly onApplied: () => void;
}

/**
 * combat-spec/knockdown-action.md 的普通倒地数值切片。
 * 只持有控制阶段和 PeriodicTimer，标签仍在原有 Buff 容器中；不实现敌人动作、朝向或浮空。
 * 宿主必须显式绑定到期策略与实体 delta，不能偷偷用 Buff 时钟或零秒起身替代。
 */
export class OrdinaryKnockDownRuntime {
  readonly #timer = new PeriodicTimer();
  #active = false;

  constructor(
    readonly entity: CombatBuffContainer<string>,
    readonly predefine: GameplayTagPredefine,
    readonly onDurationElapsed: (runtime: OrdinaryKnockDownRuntime) => void,
  ) {}

  get active(): boolean {
    return this.#active;
  }
  get remaining(): number {
    return this.#timer.isValid ? this.#timer.remaining : 0;
  }

  apply(duration: number, invocation: KnockDownComponentInvocation): KnockDownControlResult {
    invocation.emit('beforeTakeKnockDown');
    invocation.emit('beforeApplyPhysics');
    invocation.emit('beforeOutputKnockDown');
    const interruptionTag = this.predefine.getTag('SkillWeaknessInterrupted');
    const interrupted = this.entity.hasEntityTag(interruptionTag);
    if (interrupted) this.entity.removeEntityTags([interruptionTag]);
    if (!this.predefine.canAddTag(this.entity, this.predefine.getTag('KnockDown')))
      return interrupted ? 'interruption' : 'failure';

    // 重复倒地也先退出旧状态；不取 max(旧剩余量, 新时长)。
    if (this.#active) this.exit();
    const adjustedDuration = Math.fround(
      Math.fround(duration) + Math.fround(invocation.readSourceDurationAddition()),
    );
    invocation.emit('forceTriggerWeakness');
    // 弱点回调之后实际 AddTag 再查一次免疫；安装失败不推翻已确定的 Success。
    this.predefine.addTagIfNotHaving(this.entity, 'KnockDown');
    this.#active = true;
    this.#timer.reset(adjustedDuration, true);
    invocation.emit('afterTakeKnockDown');
    invocation.emit('afterApplyPhysics');
    invocation.emit('afterOutputKnockDown');
    invocation.onApplied();
    return 'success';
  }

  /** 零/负时长产生无效计时器，不能误当作立即退出。 */
  advance(entityDeltaSeconds: number): void {
    if (!Number.isFinite(entityDeltaSeconds) || entityDeltaSeconds < 0)
      throw new RangeError('knock-down entity delta must be finite and non-negative');
    if (this.#active && this.#timer.isValid && this.#timer.update(entityDeltaSeconds))
      this.onDurationElapsed(this);
  }

  exit(): void {
    this.predefine.removeTagIfHaving(this.entity, 'KnockDown');
    this.#timer.markInvalid();
    this.#active = false;
  }
}
