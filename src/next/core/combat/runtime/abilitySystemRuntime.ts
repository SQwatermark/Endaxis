/**
 * 单个参战实体的 Buff、技能、延迟施放和 Action 帧阶段编排。
 * 技能顺序必须由定义编译结果显式传入；该层不负责推断队伍顺序、输入许可或目标选择。
 */
import type { FrameRuntime } from './combatSimulation';
import type { SkillType } from '../../game-data/operatorDefinition';
import type { RuntimeSkillInterruptReason, RuntimeSkillState } from './skillRuntime';
import { uniformAbilityTickDeltas, type AbilityTickDeltas } from './timeDilationRuntime';
import { COMBAT_FRAME_INTERVAL } from './combatClock';

/** AbilitySystem 编排技能所需的最小生命周期端口。 */
export interface AbilitySkillRuntime extends FrameRuntime {
  readonly skillId: string;
  /** 文档中的技能释放身份；同技能多次放置时用于唯一寻址。 */
  readonly castId?: string;
  readonly skillType: SkillType;
  readonly state: RuntimeSkillState;
  canStart(): boolean;
  /** 本次启动前合并进动作黑板的运行时参数，例如连携候选携带的黑板。 */
  prepareStartBlackboard?(values: Readonly<Record<string, number>>): void;
  tryStart(): boolean;
  interrupt(reason: RuntimeSkillInterruptReason): void;
  /** 时间膨胀启用后分别推进技能时间线和冷却。 */
  advance?(timelineDeltaSeconds: number, cooldownDeltaSeconds: number): void;
}

/** Buff 运行时按定义为每个实例选择默认、全局或实体时钟。 */
export interface AbilityBuffRuntime extends FrameRuntime {
  advanceWithDeltas?(deltas: AbilityTickDeltas): void;
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
  readonly buffRuntime?: AbilityBuffRuntime;
  /** 保持普通攻击、主动、被动、通用技能的原生构造顺序。 */
  readonly skills: readonly AbilitySkillRuntime[];
  /** 同一放置身份下可由战斗动作切换的技能形态。 */
  readonly skillSlotGroups?: readonly {
    readonly skillGroupKey: string;
    readonly baseSkillKey: string;
    readonly replacementSkillKeys: readonly string[];
  }[];
  readonly actionRuntime?: FrameRuntime;
  readonly resolveTickDeltas?: () => AbilityTickDeltas;
  /** 帧末延迟施放在真正启动前回到装配根，复用施放前事件与运行时参数准备。 */
  readonly beforePostSkillCastStart?: (request: PostSkillCastRequest) => void;
}

/** 按原生 PreLateTick 主干顺序推进一个实体的战斗能力。 */
export class AbilitySystemRuntime implements FrameRuntime {
  readonly #buffRuntime?: AbilityBuffRuntime;
  readonly #skills: readonly AbilitySkillRuntime[];
  readonly #skillsById = new Map<string, AbilitySkillRuntime>();
  readonly #skillSlotGroups = new Map<
    string,
    {
      readonly baseSkillKey: string;
      readonly allowedSkillKeys: ReadonlySet<string>;
      currentSkillKey: string;
    }
  >();
  readonly #slotGroupByBaseSkill = new Map<string, string>();
  readonly #actionRuntime?: FrameRuntime;
  readonly #resolveTickDeltas: () => AbilityTickDeltas;
  readonly #beforePostSkillCastStart?: (request: PostSkillCastRequest) => void;
  #currentSkill: AbilitySkillRuntime | null = null;
  #postSkillCastRequest: PostSkillCastRequest | null = null;

  constructor(options: AbilitySystemRuntimeOptions) {
    this.#buffRuntime = options.buffRuntime;
    this.#skills = [...options.skills];
    this.#actionRuntime = options.actionRuntime;
    this.#beforePostSkillCastStart = options.beforePostSkillCastStart;
    this.#resolveTickDeltas =
      options.resolveTickDeltas ?? (() => uniformAbilityTickDeltas(COMBAT_FRAME_INTERVAL));
    for (const skill of this.#skills) {
      const key = abilitySkillKey(skill);
      if (this.#skillsById.has(key)) {
        throw new Error(`duplicate ability skill '${key}'`);
      }
      this.#skillsById.set(key, skill);
    }
    for (const group of options.skillSlotGroups ?? []) {
      if (this.#skillSlotGroups.has(group.skillGroupKey)) {
        throw new Error(`duplicate ability skill slot group '${group.skillGroupKey}'`);
      }
      if (this.#slotGroupByBaseSkill.has(group.baseSkillKey)) {
        throw new Error(`ability skill '${group.baseSkillKey}' owns multiple slot groups`);
      }
      const allowedSkillKeys = new Set([group.baseSkillKey, ...group.replacementSkillKeys]);
      if (allowedSkillKeys.size !== group.replacementSkillKeys.length + 1) {
        throw new Error(`ability skill slot group '${group.skillGroupKey}' has duplicate variants`);
      }
      this.#skillSlotGroups.set(group.skillGroupKey, {
        baseSkillKey: group.baseSkillKey,
        allowedSkillKeys,
        currentSkillKey: group.baseSkillKey,
      });
      this.#slotGroupByBaseSkill.set(group.baseSkillKey, group.skillGroupKey);
    }
  }

  get currentSkillId(): string | null {
    return this.#currentSkill?.skillId ?? null;
  }

  /** 只改变后续释放的槽位解析；已经进入 casting 的实例保持原引用。 */
  changeSkillSlot(skillGroupKey: string, targetSkillKey: string): void {
    const group = this.#skillSlotGroups.get(skillGroupKey);
    if (group === undefined) {
      throw new Error(`unknown ability skill slot group '${skillGroupKey}'`);
    }
    if (!group.allowedSkillKeys.has(targetSkillKey)) {
      throw new Error(
        `skill '${targetSkillKey}' is not a variant of ability skill slot group '${skillGroupKey}'`,
      );
    }
    group.currentSkillKey = targetSkillKey;
  }

  canStartSkill(skillId: string, castId?: string): boolean {
    return this.#requireSkill(skillId, castId).canStart();
  }

  prepareSkillStartBlackboard(
    skillId: string,
    castId: string | undefined,
    values: Readonly<Record<string, number>>,
  ): void {
    const skill = this.#requireSkill(skillId, castId);
    if (skill.prepareStartBlackboard === undefined) {
      if (Object.keys(values).length > 0) {
        throw new Error(`skill '${skillId}' cannot receive start blackboard values`);
      }
      return;
    }
    skill.prepareStartBlackboard(values);
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
    const deltas = this.#resolveTickDeltas();
    if (this.#buffRuntime?.advanceWithDeltas !== undefined) {
      this.#buffRuntime.advanceWithDeltas(deltas);
    } else {
      this.#buffRuntime?.advanceFrame();
    }
    for (const skill of this.#skills) {
      if (skill.advance !== undefined) {
        skill.advance(deltas.selfScaledDeltaSeconds, deltas.skillCooldownDeltaSeconds);
      } else {
        skill.advanceFrame();
      }
    }
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
    this.#beforePostSkillCastStart?.(request);
    if (nextSkill.tryStart()) this.#currentSkill = nextSkill;
  }

  #requireSkill(skillId: string, castId?: string): AbilitySkillRuntime {
    const slotGroupKey = this.#slotGroupByBaseSkill.get(skillId);
    const resolvedSkillId =
      slotGroupKey === undefined
        ? skillId
        : this.#skillSlotGroups.get(slotGroupKey)!.currentSkillKey;
    const skill = this.#skillsById.get(abilitySkillKey({ skillId: resolvedSkillId, castId }));
    if (skill === undefined) {
      const suffix = castId === undefined ? '' : ` (cast ${castId})`;
      throw new Error(`unknown ability skill '${resolvedSkillId}'${suffix}`);
    }
    return skill;
  }
}
