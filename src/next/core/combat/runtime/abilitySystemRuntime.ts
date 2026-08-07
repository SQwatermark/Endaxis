/**
 * 单个参战实体的 Buff、技能、延迟施放和 Action 帧阶段编排。
 * 技能顺序必须由目录编译结果显式传入；该层不负责推断队伍顺序、输入许可或目标选择。
 */
import type { FrameRuntime } from './combatSimulation';
import type { SkillType } from '../../game-data/operatorDefinition';
import type { RuntimeSkillInterruptReason, RuntimeSkillState } from './skillRuntime';

/** AbilitySystem 编排技能所需的最小生命周期端口。 */
export interface AbilitySkillRuntime extends FrameRuntime {
  readonly skillId: string;
  readonly skillType: SkillType;
  readonly state: RuntimeSkillState;
  canStart(): boolean;
  tryStart(): boolean;
  interrupt(reason: RuntimeSkillInterruptReason): void;
}

/** 原生单槽延迟施放目前已进入模拟器的稳定字段。 */
export interface PostSkillCastRequest {
  readonly skillId: string;
}

export interface AbilitySystemRuntimeOptions {
  readonly buffRuntime?: FrameRuntime;
  /** 保持普通攻击、主动、被动、通用技能的原生构造顺序。 */
  readonly skills: readonly AbilitySkillRuntime[];
  readonly actionRuntime?: FrameRuntime;
}

/** 按原生 PreLateTick 主干顺序推进一个实体的战斗能力。 */
export class AbilitySystemRuntime implements FrameRuntime {
  readonly #buffRuntime?: FrameRuntime;
  readonly #skills: readonly AbilitySkillRuntime[];
  readonly #skillsById = new Map<string, AbilitySkillRuntime>();
  readonly #actionRuntime?: FrameRuntime;
  #currentSkill: AbilitySkillRuntime | null = null;
  #postSkillCastRequest: PostSkillCastRequest | null = null;

  constructor(options: AbilitySystemRuntimeOptions) {
    this.#buffRuntime = options.buffRuntime;
    this.#skills = [...options.skills];
    this.#actionRuntime = options.actionRuntime;
    for (const skill of this.#skills) {
      if (this.#skillsById.has(skill.skillId)) {
        throw new Error(`duplicate ability skill '${skill.skillId}'`);
      }
      this.#skillsById.set(skill.skillId, skill);
    }
  }

  get currentSkillId(): string | null {
    return this.#currentSkill?.skillId ?? null;
  }

  tryStartSkill(skillId: string): boolean {
    const skill = this.#requireSkill(skillId);
    if (!skill.canStart()) return false;
    const previousSkill = this.#currentSkill?.state === 'casting' ? this.#currentSkill : null;

    this.#currentSkill = skill;
    previousSkill?.interrupt('castNextSkill');
    if (!skill.tryStart()) {
      throw new Error(`skill '${skillId}' became unavailable during synchronous cast start`);
    }
    return true;
  }

  /** 同一帧多次写入会覆盖旧值；消费前先清槽，使消费期间的新请求留到下一帧。 */
  requestPostSkillCast(request: PostSkillCastRequest): void {
    this.#requireSkill(request.skillId);
    this.#postSkillCastRequest = { skillId: request.skillId };
  }

  advanceFrame(): void {
    this.#buffRuntime?.advanceFrame();
    for (const skill of this.#skills) skill.advanceFrame();
    if (this.#currentSkill?.state !== 'casting') this.#currentSkill = null;
    this.#flushPostSkillCastRequest();
    this.#actionRuntime?.advanceFrame();
  }

  #flushPostSkillCastRequest(): void {
    const request = this.#postSkillCastRequest;
    if (request === null) return;
    this.#postSkillCastRequest = null;

    this.#currentSkill?.interrupt('castNextSkill');
    this.#currentSkill = null;
    const nextSkill = this.#requireSkill(request.skillId);
    if (nextSkill.tryStart()) this.#currentSkill = nextSkill;
  }

  #requireSkill(skillId: string): AbilitySkillRuntime {
    const skill = this.#skillsById.get(skillId);
    if (skill === undefined) throw new Error(`unknown ability skill '${skillId}'`);
    return skill;
  }
}
