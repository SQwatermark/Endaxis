/**
 * 单个参战实体的 Buff、技能、延迟施放和 Action 帧阶段编排。
 * 技能顺序必须由定义编译结果显式传入；该层不负责推断队伍顺序、输入许可或目标选择。
 */
import type { FrameRuntime } from './combatSimulation';
import type { SkillType } from '../../game-data/operatorDefinition';
import type { RuntimeSkillInterruptReason, RuntimeSkillState } from './skillRuntime';

/** AbilitySystem 编排技能所需的最小生命周期端口。 */
export interface AbilitySkillRuntime extends FrameRuntime {
  readonly skillId: string;
  /** 文档中的技能释放身份；同技能多次放置时用于唯一寻址。 */
  readonly castId?: string;
  readonly skillType: SkillType;
  readonly state: RuntimeSkillState;
  canStart(): boolean;
  tryStart(): boolean;
  interrupt(reason: RuntimeSkillInterruptReason): void;
}

/** 同一技能多次放置时用 (skillId, castId) 唯一寻址；单元测试程序缺省为空。 */
export function abilitySkillKey(skill: Pick<AbilitySkillRuntime, 'skillId' | 'castId'>): string {
  return `${skill.skillId}\u0000${skill.castId ?? ''}`;
}

/** 按唯一身份调用技能启动的端口。 */
export interface AbilitySkillStarter {
  tryStartByKey(key: string): boolean;
}

/** 原生单槽延迟施放目前已进入模拟器的稳定字段。 */
export interface PostSkillCastRequest {
  readonly skillId: string;
  readonly castId?: string;
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
      const key = abilitySkillKey(skill);
      if (this.#skillsById.has(key)) {
        throw new Error(`duplicate ability skill '${key}'`);
      }
      this.#skillsById.set(key, skill);
    }
  }

  get currentSkillId(): string | null {
    return this.#currentSkill?.skillId ?? null;
  }

  tryStartSkill(skillId: string, castId?: string): boolean {
    const skill = this.#requireSkill(skillId, castId);
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
    this.#requireSkill(request.skillId, request.castId);
    this.#postSkillCastRequest = { ...request };
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
    const nextSkill = this.#requireSkill(request.skillId, request.castId);
    if (nextSkill.tryStart()) this.#currentSkill = nextSkill;
  }

  #requireSkill(skillId: string, castId?: string): AbilitySkillRuntime {
    const skill = this.#skillsById.get(abilitySkillKey({ skillId, castId }));
    if (skill === undefined) {
      const suffix = castId === undefined ? '' : ` (cast ${castId})`;
      throw new Error(`unknown ability skill '${skillId}'${suffix}`);
    }
    return skill;
  }
}
