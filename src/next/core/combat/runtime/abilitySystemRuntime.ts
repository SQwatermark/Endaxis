/**
 * 单个参战实体的 Buff、技能、延迟施放和 Action 帧阶段编排。
 * 技能顺序必须由定义编译结果显式传入；该层不负责推断队伍顺序、输入许可或目标选择。
 */
import type { FrameRuntime } from './combatSimulation';
import type { NativeSkillType, SkillType } from '../../game-data/operatorDefinition';
import type { PlayerSkillInput, SkillDefinition } from '../../game-data/operatorDefinition';
import type {
  AfterSkillCastStart,
  RuntimeSkillInterruptReason,
  RuntimeSkillState,
} from './skillRuntime';
import type { BuffApplicationHandle } from './buffOperationExecutor';
import type { CombatSkillCastInfo } from './skillCastInfo';
import { uniformAbilityTickDeltas, type AbilityTickDeltas } from './timeDilationRuntime';
import { COMBAT_FRAME_INTERVAL, COMBAT_FRAMES_PER_SECOND } from './combatClock';
import {
  SkillOperableBoundaryRuntime,
  type SkillOperableBoundaryFact,
} from './skillOperableBoundaryRuntime';

/** AbilitySystem 编排技能所需的最小生命周期端口。 */
export interface AbilitySkillRuntime extends FrameRuntime {
  readonly skillId: string;
  /** 原生动作继承白名单使用的表内 Skill ID；缺省时与 skillId 相同。 */
  readonly transitionSkillId?: string;
  readonly inputWindows?: SkillDefinition['inputWindows'];
  /** 文档中的技能释放身份；同技能多次放置时用于唯一寻址。 */
  readonly castId?: string;
  readonly skillType: SkillType;
  readonly nativeSkillType?: NativeSkillType;
  /** 场景技能块在宿主局部时钟中的可操作宽度；非场景测试运行时可省略。 */
  readonly timelineBlockFrames?: number;
  readonly state: RuntimeSkillState;
  /** 当前技能局部整数执行帧；仅 casting 实例提供。 */
  readonly currentTimelineFrame?: number;
  /** 原生当前技能可打断状态；只有读取 mustBeforeExclusiveTime 的切换路径才要求提供。 */
  readonly canInterrupt?: boolean;
  readonly skillCastInfo?: CombatSkillCastInfo;
  canStart(): boolean;
  /** 本次启动前合并进动作黑板的运行时参数，例如连携候选携带的黑板。 */
  prepareStartBlackboard?(values: Readonly<Record<string, number>>): void;
  prepareAfterCastStart?(callback: AfterSkillCastStart): void;
  /** 装配层在施放前事件之前预分配的原生技能释放序号。 */
  prepareSkillCastId?(skillCastId: number): void;
  prepareDeferredCast?(input: {
    readonly skipApplyCost: boolean;
    readonly inheritedSkillCastInfo?: CombatSkillCastInfo;
  }): void;
  prepareForcedTimelineCast?(): void;
  attachBuffToCast?(skillCastId: number, buff: BuffApplicationHandle): void;
  attachInheritedBuff?(buff: BuffApplicationHandle): void;
  trySwitchToBuffCast?(currentSkill?: {
    readonly skillType: SkillType;
    readonly skillCastInfo: CombatSkillCastInfo;
    readonly canInterrupt: boolean;
  }): boolean;
  tryStart(): boolean;
  interrupt(
    reason: RuntimeSkillInterruptReason,
    transition?: import('./skillRuntime').RuntimeSkillTransition,
  ): void;
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

function fallbackNativeSkillType(skillType: SkillType): NativeSkillType {
  return skillType === 'basicAttack' || skillType === 'plungingAttack'
    ? 'attack'
    : skillType === 'finisher'
      ? 'breakingAttack'
      : skillType === 'battleSkill'
        ? 'normalSkill'
        : skillType === 'comboSkill'
          ? 'comboSkill'
          : 'ultimateSkill';
}

function nativeSkillInterruptPriority(skillType: NativeSkillType): number {
  return {
    passiveSkill: 0,
    attack: 1,
    breakingAttack: 2,
    normalSkill: 2,
    attachSkill: 4,
    dodge: 6,
    comboSkill: 5,
    ultimateSkill: 7,
    extraActiveSkill: 2,
  }[skillType];
}

/** 按唯一身份调用技能启动的端口。 */
export interface AbilitySkillStarter {
  tryStartByKey(key: string): boolean;
}

/** 原生单槽延迟施放目前已进入模拟器的稳定字段。 */
export interface PostSkillCastRequest {
  readonly skillId: string;
  readonly castId?: string;
  readonly skipApplyCost?: boolean;
  readonly inheritedSkillCastInfo?: CombatSkillCastInfo;
  /** 玩家技能槽输入解析当前替换形态；原生 CastSkill 的显式 Skill ID 必须关闭该解析。 */
  readonly resolveSkillSlot?: boolean;
}

export interface AbilitySystemRuntimeOptions {
  readonly buffRuntime?: AbilityBuffRuntime;
  /** 保持普通攻击、主动、被动、通用技能的原生构造顺序。 */
  readonly skills: readonly AbilitySkillRuntime[];
  /** 完整技能目录的推进顺序；每个身份先更新共享冷却，再更新其放置实例。未放置身份只有冷却。 */
  readonly skillTickPlan?: readonly {
    readonly skillId: string;
    readonly advanceCooldown: (deltaSeconds: number) => void;
  }[];
  /** 同一放置身份下可由战斗动作切换的技能形态。 */
  readonly skillSlotGroups?: readonly {
    readonly skillGroupKey: string;
    readonly input?: PlayerSkillInput;
    readonly defaultForInput?: boolean;
    readonly baseSkillKey: string;
    readonly stableInputSkillKeys?: readonly string[];
    readonly replacementSkillKeys: readonly string[];
  }[];
  /** 四类语义动作的显式原生路由；存在时完全取代技能组推导。 */
  readonly playerActionRoutes?: import('../../game-data/operatorDefinition').OperatorPlayerActionRoutes;
  readonly playerActionModes?: readonly import('../../game-data/operatorDefinition').OperatorPlayerActionModeDefinition[];
  readonly actionRuntime?: FrameRuntime;
  readonly resolveTickDeltas?: () => AbilityTickDeltas;
  /** 帧末延迟施放在真正启动前回到装配根，复用施放前事件与运行时参数准备。 */
  readonly beforePostSkillCastStart?: (request: PostSkillCastRequest) => void;
  /** 提供后才发布场景技能块的实例级实际结束边界。 */
  readonly resolveActualFrame?: () => number;
  readonly onSkillOperableBoundaryReached?: (fact: SkillOperableBoundaryFact) => void;
}

/** 按原生 PreLateTick 主干顺序推进一个实体的战斗能力。 */
export class AbilitySystemRuntime implements FrameRuntime {
  readonly #buffRuntime?: AbilityBuffRuntime;
  readonly #skills: readonly AbilitySkillRuntime[];
  readonly #skillTickPlan?: readonly {
    readonly advanceCooldown: (deltaSeconds: number) => void;
    readonly skills: readonly AbilitySkillRuntime[];
  }[];
  readonly #skillsById = new Map<string, AbilitySkillRuntime>();
  readonly #nativeSkillTypeBySkillId = new Map<string, NativeSkillType>();
  readonly #skillSlotGroups = new Map<
    string,
    {
      readonly baseSkillKey: string;
      readonly input: PlayerSkillInput;
      readonly defaultForInput: boolean;
      readonly stableInputSkillKeys: ReadonlySet<string>;
      readonly allowedSkillKeys: ReadonlySet<string>;
      currentSkillKey: string;
    }
  >();
  readonly #slotGroupByStableInputSkill = new Map<string, string>();
  readonly #slotGroupByAllowedSkill = new Map<string, string>();
  readonly #defaultSlotGroupByInput = new Map<PlayerSkillInput, string>();
  readonly #playerActionRoutes?: import('../../game-data/operatorDefinition').OperatorPlayerActionRoutes;
  readonly #playerActionModes = new Map<
    string,
    import('../../game-data/operatorDefinition').OperatorPlayerActionModeDefinition
  >();
  readonly #activePlayerActionModeByLayer = new Map<string, string>();
  readonly #skillKeysByTransitionSkillId = new Map<string, Set<string>>();
  readonly #actionRuntime?: FrameRuntime;
  readonly #resolveTickDeltas: () => AbilityTickDeltas;
  readonly #beforePostSkillCastStart?: (request: PostSkillCastRequest) => void;
  readonly #operableBoundaries: SkillOperableBoundaryRuntime | null;
  readonly #resolveActualFrame?: () => number;
  readonly #onSkillOperableBoundaryReached?: (fact: SkillOperableBoundaryFact) => void;
  readonly #registeredOperableBoundaryCastIds = new Set<string>();
  #currentSkill: AbilitySkillRuntime | null = null;
  #postSkillCastRequest: PostSkillCastRequest | null = null;

  constructor(options: AbilitySystemRuntimeOptions) {
    this.#buffRuntime = options.buffRuntime;
    this.#skills = [...options.skills];
    this.#actionRuntime = options.actionRuntime;
    this.#playerActionRoutes = options.playerActionRoutes;
    for (const mode of options.playerActionModes ?? []) {
      if (this.#playerActionModes.has(mode.modeId)) {
        throw new Error(`duplicate player-action mode '${mode.modeId}'`);
      }
      this.#playerActionModes.set(mode.modeId, mode);
      if (mode.defaultEnabled) {
        if (this.#activePlayerActionModeByLayer.has(mode.modeLayer)) {
          throw new Error(`multiple default player-action modes use layer '${mode.modeLayer}'`);
        }
        this.#activePlayerActionModeByLayer.set(mode.modeLayer, mode.modeId);
      }
    }
    this.#beforePostSkillCastStart = options.beforePostSkillCastStart;
    if (
      (options.resolveActualFrame === undefined) !==
      (options.onSkillOperableBoundaryReached === undefined)
    ) {
      throw new Error(
        'ability skill operable boundary projection requires both actual frame and observer',
      );
    }
    this.#resolveActualFrame = options.resolveActualFrame;
    this.#onSkillOperableBoundaryReached = options.onSkillOperableBoundaryReached;
    this.#operableBoundaries =
      options.resolveActualFrame === undefined ? null : new SkillOperableBoundaryRuntime();
    this.#resolveTickDeltas =
      options.resolveTickDeltas ?? (() => uniformAbilityTickDeltas(COMBAT_FRAME_INTERVAL));
    for (const skill of this.#skills) {
      const key = abilitySkillKey(skill);
      if (this.#skillsById.has(key)) {
        throw new Error(`duplicate ability skill '${key}'`);
      }
      this.#skillsById.set(key, skill);
      const nativeSkillType = skill.nativeSkillType ?? fallbackNativeSkillType(skill.skillType);
      const previousNativeSkillType = this.#nativeSkillTypeBySkillId.get(skill.skillId);
      if (previousNativeSkillType !== undefined && previousNativeSkillType !== nativeSkillType) {
        throw new Error(`ability skill '${skill.skillId}' has inconsistent native SkillType`);
      }
      this.#nativeSkillTypeBySkillId.set(skill.skillId, nativeSkillType);
      const transitionSkillId = skill.transitionSkillId ?? skill.skillId;
      const skillKeys = this.#skillKeysByTransitionSkillId.get(transitionSkillId) ?? new Set();
      skillKeys.add(skill.skillId);
      this.#skillKeysByTransitionSkillId.set(transitionSkillId, skillKeys);
    }
    if (options.skillTickPlan !== undefined) {
      const ids = new Set<string>();
      this.#skillTickPlan = options.skillTickPlan.map(entry => {
        if (ids.has(entry.skillId))
          throw new Error(`duplicate skill tick identity '${entry.skillId}'`);
        ids.add(entry.skillId);
        return {
          advanceCooldown: entry.advanceCooldown,
          skills: this.#skills.filter(skill => skill.skillId === entry.skillId),
        };
      });
      for (const skill of this.#skills) {
        if (!ids.has(skill.skillId))
          throw new Error(`skill '${skill.skillId}' is missing from tick plan`);
      }
    }
    for (const group of options.skillSlotGroups ?? []) {
      if (this.#skillSlotGroups.has(group.skillGroupKey)) {
        throw new Error(`duplicate ability skill slot group '${group.skillGroupKey}'`);
      }
      const stableInputSkillKeys = group.stableInputSkillKeys ?? [group.baseSkillKey];
      const baseSkill = this.#skills.find(skill => skill.skillId === group.baseSkillKey);
      const input =
        group.input ??
        (baseSkill === undefined
          ? 'battleSkill'
          : baseSkill.skillType === 'basicAttack' ||
              baseSkill.skillType === 'finisher' ||
              baseSkill.skillType === 'plungingAttack'
            ? 'basicAttack'
            : baseSkill.skillType === 'battleSkill'
              ? 'battleSkill'
              : baseSkill.skillType === 'comboSkill'
                ? 'comboSkill'
                : 'ultimate');
      // 基础命令映射必须来自原生 SkillDataBundle.defaultCmdMapping / ModeData，
      // 不能由 Endaxis 的技能库分组反推。旧调用方未提供证据时不登记默认槽。
      const defaultForInput = group.defaultForInput ?? false;
      if (!stableInputSkillKeys.includes(group.baseSkillKey)) {
        throw new Error(
          `ability skill slot group '${group.skillGroupKey}' does not include its base skill`,
        );
      }
      const allowedSkillKeys = new Set([...stableInputSkillKeys, ...group.replacementSkillKeys]);
      if (
        allowedSkillKeys.size !==
        stableInputSkillKeys.length + group.replacementSkillKeys.length
      ) {
        throw new Error(`ability skill slot group '${group.skillGroupKey}' has duplicate variants`);
      }
      for (const skillKey of stableInputSkillKeys) {
        if (this.#slotGroupByStableInputSkill.has(skillKey)) {
          throw new Error(`ability skill '${skillKey}' owns multiple slot groups`);
        }
        this.#slotGroupByStableInputSkill.set(skillKey, group.skillGroupKey);
      }
      for (const skillKey of allowedSkillKeys) {
        if (this.#slotGroupByAllowedSkill.has(skillKey)) {
          throw new Error(`ability skill '${skillKey}' owns multiple slot groups`);
        }
        this.#slotGroupByAllowedSkill.set(skillKey, group.skillGroupKey);
      }
      this.#skillSlotGroups.set(group.skillGroupKey, {
        baseSkillKey: group.baseSkillKey,
        input,
        defaultForInput,
        stableInputSkillKeys: new Set(stableInputSkillKeys),
        allowedSkillKeys,
        currentSkillKey: group.baseSkillKey,
      });
      if (defaultForInput) {
        if (this.#defaultSlotGroupByInput.has(input)) {
          throw new Error(`multiple default ability skill slots use input '${input}'`);
        }
        this.#defaultSlotGroupByInput.set(input, group.skillGroupKey);
      }
    }
  }

  get currentSkillId(): string | null {
    return this.#currentSkill?.skillId ?? null;
  }

  get currentSkillType(): SkillType | undefined {
    return this.#currentSkill?.state === 'casting' ? this.#currentSkill.skillType : undefined;
  }

  get currentNativeSkillType(): NativeSkillType | undefined {
    return this.#currentSkill?.state === 'casting'
      ? this.#nativeSkillTypeBySkillId.get(this.#currentSkill.skillId)
      : undefined;
  }

  /** ChangeSkillType 修改同一原生技能身份的运行时类型，不改变玩家操作槽位。 */
  changeNativeSkillType(skillId: string, nativeSkillType: NativeSkillType): void {
    if (!this.#nativeSkillTypeBySkillId.has(skillId)) {
      throw new Error(`unknown ability skill '${skillId}' for native SkillType mutation`);
    }
    this.#nativeSkillTypeBySkillId.set(skillId, nativeSkillType);
  }

  get currentSkillTimelineFrame(): number | undefined {
    return this.#currentSkill?.state === 'casting'
      ? this.#currentSkill.currentTimelineFrame
      : undefined;
  }

  /** 读取当前槽位身份；未知组不回退为基础技能。 */
  currentSkillKeyForSlot(skillGroupKey: string): string {
    const group = this.#skillSlotGroups.get(skillGroupKey);
    if (group === undefined) {
      throw new Error(`unknown ability skill slot group '${skillGroupKey}'`);
    }
    return group.currentSkillKey;
  }

  /** 只改变后续释放的槽位解析；已经进入 casting 的实例保持原引用。 */
  changeSkillSlot(skillGroupKey: string, targetSkillKey: string): string {
    const group = this.#skillSlotGroups.get(skillGroupKey);
    if (group === undefined) {
      throw new Error(`unknown ability skill slot group '${skillGroupKey}'`);
    }
    if (!group.allowedSkillKeys.has(targetSkillKey)) {
      throw new Error(
        `skill '${targetSkillKey}' is not a variant of ability skill slot group '${skillGroupKey}'`,
      );
    }
    const previousSkillKey = group.currentSkillKey;
    group.currentSkillKey = targetSkillKey;
    return previousSkillKey;
  }

  /**
   * 按玩家操作解析当前槽位，并与时间轴块显式声明的具体技能核对。
   * 基础状态下，多段稳定输入各自保持身份；换槽后，同组玩家操作只会解析到当前替换技能。
   */
  resolvePlayerInputSkill(
    expectedSkillKey: string,
    action?: PlayerSkillInput,
  ):
    | { readonly status: 'matched'; readonly actualSkillKey: string }
    | { readonly status: 'mismatched'; readonly actualSkillKey: string }
    | { readonly status: 'notApplicable'; readonly reason: string }
    | { readonly status: 'unknown'; readonly reason: string } {
    if (this.#playerActionRoutes !== undefined) {
      const matchingInputs = Object.entries(this.#playerActionRoutes).flatMap(([input, route]) => {
        if (route === undefined) return [];
        if (action !== undefined && input !== action) return [];
        if (route.kind === 'basicAttack') {
          return route.skillKeys.includes(expectedSkillKey) ? [input as PlayerSkillInput] : [];
        }
        const group = this.#skillSlotGroups.get(route.skillSlotKey);
        return group?.allowedSkillKeys.has(expectedSkillKey) === true
          ? [input as PlayerSkillInput]
          : [];
      });
      if (matchingInputs.length === 0) {
        return {
          status: 'unknown',
          reason:
            action === undefined
              ? 'skill is not reachable from an imported player action route'
              : `skill is not reachable from player action '${action}'`,
        };
      }
      if (matchingInputs.length > 1) {
        return { status: 'unknown', reason: 'skill is reachable from multiple player actions' };
      }
      const input = matchingInputs[0]!;
      const route = this.#playerActionRoutes[input]!;
      if (route.kind === 'skillSlot') {
        const actualSkillKey = this.#skillSlotGroups.get(route.skillSlotKey)!.currentSkillKey;
        return actualSkillKey === expectedSkillKey
          ? { status: 'matched', actualSkillKey }
          : { status: 'mismatched', actualSkillKey };
      }
      const mapped = this.#resolveCurrentBasicAttackMapping(expectedSkillKey);
      if (mapped !== null) return mapped;
      const modeMapped = this.#resolveActiveModeBasicAttackMapping(expectedSkillKey);
      if (modeMapped !== null) return modeMapped;
      const expectedSkillType = this.#skills.find(
        skill => skill.skillId === expectedSkillKey,
      )?.skillType;
      if (expectedSkillType === 'finisher' || expectedSkillType === 'plungingAttack') {
        // 处决和下落攻击与普通攻击共用输入，但由敌人处决状态或角色腾空状态选择。
        // Next 尚未建模这两项空间/敌人状态；缺少显式命令映射时不能拿 A1 默认映射
        // 反证时间轴上已经明确放置的特殊攻击。
        return {
          status: 'notApplicable',
          reason: 'special basic-attack selection state is outside simulation scope',
        };
      }
      if (route.defaultSkillKey === undefined) {
        return { status: 'unknown', reason: 'native basic-attack command mapping is not imported' };
      }
      return route.defaultSkillKey === expectedSkillKey
        ? { status: 'matched', actualSkillKey: route.defaultSkillKey }
        : { status: 'mismatched', actualSkillKey: route.defaultSkillKey };
    }

    return {
      status: 'unknown',
      reason: 'operator has no imported player action routes',
    };
  }

  #resolveCurrentBasicAttackMapping(
    expectedSkillKey: string,
  ):
    | { readonly status: 'matched'; readonly actualSkillKey: string }
    | { readonly status: 'mismatched'; readonly actualSkillKey: string }
    | { readonly status: 'unknown'; readonly reason: string }
    | null {
    const current = this.#currentSkill?.state === 'casting' ? this.#currentSkill : null;
    if (current === null || current.currentTimelineFrame === undefined) return null;
    const frame = current.currentTimelineFrame;
    const mappings = (current.inputWindows?.commandMappings ?? []).filter(
      window =>
        window.input === 'basicAttack' && window.startFrame <= frame && frame <= window.endFrame,
    );
    const targets = new Set(mappings.map(mapping => mapping.targetSourceSkillId));
    if (targets.size > 1) {
      return {
        status: 'unknown',
        reason: 'multiple active command mappings have unresolved priority',
      };
    }
    if (targets.size === 0) {
      return current.inputWindows?.hasConditionalActions === true
        ? { status: 'unknown', reason: 'current skill has conditional input actions' }
        : null;
    }
    const target = [...targets][0]!;
    if (target === null) {
      return { status: 'unknown', reason: 'active command mapping has no direct skill route' };
    }
    const keys = this.#skillKeysByTransitionSkillId.get(target);
    if (keys === undefined || keys.size !== 1) {
      return { status: 'unknown', reason: `command mapping target '${target}' is not unique` };
    }
    const actualSkillKey = [...keys][0]!;
    return actualSkillKey === expectedSkillKey
      ? { status: 'matched', actualSkillKey }
      : { status: 'mismatched', actualSkillKey };
  }

  #resolveActiveModeBasicAttackMapping(
    expectedSkillKey: string,
  ):
    | { readonly status: 'matched'; readonly actualSkillKey: string }
    | { readonly status: 'mismatched'; readonly actualSkillKey: string }
    | { readonly status: 'unknown'; readonly reason: string }
    | null {
    const mappings = [...this.#activePlayerActionModeByLayer.values()].flatMap(modeId => {
      const mapping = this.#playerActionModes.get(modeId)?.commandMappings?.basicAttack;
      return mapping === undefined ? [] : [mapping];
    });
    if (mappings.length === 0) return null;
    if (mappings.length > 1) {
      return { status: 'unknown', reason: 'multiple active modes override basic-attack routing' };
    }
    const mapping = mappings[0]!;
    if (mapping.skillKey === undefined) {
      return {
        status: 'unknown',
        reason: `active mode maps basic attack to unconverted native skill '${mapping.sourceSkillId}'`,
      };
    }
    return mapping.skillKey === expectedSkillKey
      ? { status: 'matched', actualSkillKey: mapping.skillKey }
      : { status: 'mismatched', actualSkillKey: mapping.skillKey };
  }

  /** SwitchModeAction 在一个 modeLayer 上替换活动模式，并返回按动作寿命恢复的句柄。 */
  activatePlayerActionMode(modeId: string): { finish(): void } {
    const mode = this.#playerActionModes.get(modeId);
    if (mode === undefined) throw new Error(`unknown player-action mode '${modeId}'`);
    const previousModeId = this.#activePlayerActionModeByLayer.get(mode.modeLayer);
    this.#activePlayerActionModeByLayer.set(mode.modeLayer, modeId);
    let finished = false;
    return {
      finish: () => {
        if (finished) return;
        finished = true;
        if (this.#activePlayerActionModeByLayer.get(mode.modeLayer) !== modeId) return;
        if (previousModeId === undefined)
          this.#activePlayerActionModeByLayer.delete(mode.modeLayer);
        else this.#activePlayerActionModeByLayer.set(mode.modeLayer, previousModeId);
      },
    };
  }

  evaluatePlayerInputInterruption(
    expectedSkillKey: string,
    castId?: string,
  ):
    | { readonly status: 'allowed' }
    | { readonly status: 'blocked'; readonly currentSkillKey: string }
    | { readonly status: 'unknown'; readonly reason: string } {
    const current = this.#currentSkill?.state === 'casting' ? this.#currentSkill : null;
    if (current === null) return { status: 'allowed' };
    const next = this.#requireSkill(expectedSkillKey, castId, false);
    const nextSourceSkillId = next.transitionSkillId ?? next.skillId;
    const frame = current.currentTimelineFrame;
    if (frame !== undefined) {
      const explicitlyAllowed = (current.inputWindows?.allowedNextSkills ?? []).some(
        window =>
          window.startFrame <= frame &&
          frame <= window.endFrame &&
          window.sourceSkillIds.includes(nextSourceSkillId),
      );
      if (explicitlyAllowed) return { status: 'allowed' };
    }
    if (current.inputWindows === undefined) {
      // 只有 exclusiveFrame 无法排除尚未迁移的 AllowedNextSkill 旁路。
      return { status: 'allowed' };
    }
    if (next.skillType === 'plungingAttack') return { status: 'allowed' };
    const nextNativeSkillType = this.#nativeSkillTypeBySkillId.get(next.skillId)!;
    const currentNativeSkillType = this.#nativeSkillTypeBySkillId.get(current.skillId)!;
    if (
      nativeSkillInterruptPriority(nextNativeSkillType) >
      nativeSkillInterruptPriority(currentNativeSkillType)
    )
      return { status: 'allowed' };
    if (current.canInterrupt === true) return { status: 'allowed' };
    if (current.canInterrupt === undefined) {
      return { status: 'unknown', reason: 'current skill has no recovered interrupt boundary' };
    }
    if (current.inputWindows?.hasConditionalActions === true) {
      return { status: 'unknown', reason: 'current skill has conditional next-skill actions' };
    }
    return { status: 'blocked', currentSkillKey: current.skillId };
  }

  canStartSkill(skillId: string, castId?: string, resolveSkillSlot = true): boolean {
    return this.#requireSkill(skillId, castId, resolveSkillSlot).canStart();
  }

  resolveSkillId(skillId: string, castId?: string, resolveSkillSlot = true): string {
    return this.#requireSkill(skillId, castId, resolveSkillSlot).skillId;
  }

  prepareSkillStartBlackboard(
    skillId: string,
    castId: string | undefined,
    values: Readonly<Record<string, number>>,
    resolveSkillSlot = true,
  ): void {
    const skill = this.#requireSkill(skillId, castId, resolveSkillSlot);
    if (skill.prepareStartBlackboard === undefined) {
      if (Object.keys(values).length > 0) {
        throw new Error(`skill '${skillId}' cannot receive start blackboard values`);
      }
      return;
    }
    skill.prepareStartBlackboard(values);
  }

  prepareSkillCastId(
    skillId: string,
    castId: string | undefined,
    skillCastId: number,
    resolveSkillSlot = true,
  ): void {
    const skill = this.#requireSkill(skillId, castId, resolveSkillSlot);
    if (skill.prepareSkillCastId === undefined) {
      throw new Error(`skill '${skillId}' cannot receive a prepared skill cast id`);
    }
    skill.prepareSkillCastId(skillCastId);
  }

  prepareDeferredCast(
    skillId: string,
    castId: string | undefined,
    input: {
      readonly skipApplyCost: boolean;
      readonly inheritedSkillCastInfo?: CombatSkillCastInfo;
    },
  ): void {
    const skill = this.#requireSkill(skillId, castId);
    if (skill.prepareDeferredCast === undefined) {
      throw new Error(`skill '${skillId}' cannot receive a deferred cast request`);
    }
    skill.prepareDeferredCast(input);
  }

  prepareAfterSkillCastStart(
    skillId: string,
    castId: string | undefined,
    callback: AfterSkillCastStart,
    resolveSkillSlot = true,
  ): void {
    const skill = this.#requireSkill(skillId, castId, resolveSkillSlot);
    if (skill.prepareAfterCastStart === undefined)
      throw new Error(`skill '${skillId}' cannot receive afterCastStart preparation`);
    skill.prepareAfterCastStart(callback);
  }

  attachBuffToSkillCast(
    skillId: string,
    castId: string | undefined,
    skillCastId: number,
    buff: BuffApplicationHandle,
    resolveSkillSlot = true,
  ): void {
    const skill = this.#requireSkill(skillId, castId, resolveSkillSlot);
    if (skill.attachBuffToCast === undefined) {
      throw new Error(`skill '${skillId}' cannot attach Buff instances`);
    }
    skill.attachBuffToCast(skillCastId, buff);
  }

  tryStartSkill(skillId: string, castId?: string): boolean {
    return this.#tryStartSkill(skillId, castId, true, false);
  }

  /** 时间轴玩家输入执行显式技能，不允许槽位解析静默替换其身份。 */
  tryStartTimelineSkill(skillId: string, castId?: string): boolean {
    return this.#tryStartSkill(skillId, castId, false, true);
  }

  #tryStartSkill(
    skillId: string,
    castId: string | undefined,
    resolveSkillSlot: boolean,
    forceTimelinePayment: boolean,
  ): boolean {
    const skill = this.#requireSkill(skillId, castId, resolveSkillSlot);
    if (!skill.canStart()) return false;
    if (forceTimelinePayment) {
      if (skill.prepareForcedTimelineCast === undefined) {
        throw new Error(`skill '${skillId}' cannot receive a forced timeline cast`);
      }
      skill.prepareForcedTimelineCast();
    }
    const previousSkill = this.#currentSkill?.state === 'casting' ? this.#currentSkill : null;

    if (
      skill.trySwitchToBuffCast?.(
        previousSkill?.skillCastInfo === undefined
          ? undefined
          : {
              skillType: previousSkill.skillType,
              skillCastInfo: previousSkill.skillCastInfo,
              get canInterrupt() {
                const value = previousSkill.canInterrupt;
                if (value === undefined) {
                  throw new Error(
                    `current skill '${previousSkill.skillId}' does not expose canInterrupt`,
                  );
                }
                return value;
              },
            },
      ) === true
    ) {
      return true;
    }

    this.#currentSkill = skill;
    if (previousSkill !== null) this.#interruptForNextSkill(previousSkill, skill);
    if (!skill.tryStart()) {
      throw new Error(`skill '${skillId}' became unavailable during synchronous cast start`);
    }
    this.#beginSkillOperableBoundary(skill);
    return true;
  }

  /** 同一帧多次写入会覆盖旧值；消费前先清槽，使消费期间的新请求留到下一帧。 */
  requestPostSkillCast(request: PostSkillCastRequest): void {
    this.#requireSkill(request.skillId, request.castId, request.resolveSkillSlot !== false);
    this.#postSkillCastRequest = { ...request };
  }

  advanceFrame(): void {
    const deltas = this.#resolveTickDeltas();
    if (this.#buffRuntime?.advanceWithDeltas !== undefined) {
      this.#buffRuntime.advanceWithDeltas(deltas);
    } else {
      this.#buffRuntime?.advanceFrame();
    }
    if (this.#skillTickPlan !== undefined) {
      for (const entry of this.#skillTickPlan) {
        entry.advanceCooldown(deltas.skillCooldownDeltaSeconds);
        for (const skill of entry.skills) {
          // 此模式下冷却由目录唯一推进，技能实例不能再推进第二次。
          if (skill.advance !== undefined) skill.advance(deltas.selfScaledDeltaSeconds, 0);
          else skill.advanceFrame();
        }
      }
    } else {
      for (const skill of this.#skills) {
        if (skill.advance !== undefined) {
          skill.advance(deltas.selfScaledDeltaSeconds, deltas.skillCooldownDeltaSeconds);
        } else {
          skill.advanceFrame();
        }
      }
    }
    if (this.#operableBoundaries !== null) {
      const actualFrame = this.#resolveActualFrame!();
      for (const fact of this.#operableBoundaries.advance(
        deltas.selfScaledDeltaSeconds * COMBAT_FRAMES_PER_SECOND,
        actualFrame,
      )) {
        this.#onSkillOperableBoundaryReached!(fact);
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

    const previousSkill = this.#currentSkill?.state === 'casting' ? this.#currentSkill : null;
    this.#currentSkill = null;
    const nextSkill = this.#requireSkill(
      request.skillId,
      request.castId,
      request.resolveSkillSlot !== false,
    );
    if (previousSkill !== null) this.#interruptForNextSkill(previousSkill, nextSkill);
    this.#beforePostSkillCastStart?.(request);
    if (nextSkill.tryStart()) {
      this.#currentSkill = nextSkill;
      this.#beginSkillOperableBoundary(nextSkill);
    }
  }

  #interruptForNextSkill(previousSkill: AbilitySkillRuntime, nextSkill: AbilitySkillRuntime): void {
    previousSkill.interrupt('castNextSkill', {
      nextSkillId: nextSkill.transitionSkillId ?? nextSkill.skillId,
      attachBuffToNextSkill: buff => {
        if (nextSkill.attachInheritedBuff === undefined) {
          throw new Error(`skill '${nextSkill.skillId}' cannot inherit Buff instances`);
        }
        nextSkill.attachInheritedBuff(buff);
      },
    });
  }

  #beginSkillOperableBoundary(skill: AbilitySkillRuntime): void {
    if (
      this.#operableBoundaries === null ||
      skill.castId === undefined ||
      skill.timelineBlockFrames === undefined ||
      skill.timelineBlockFrames === 0
    ) {
      return;
    }
    // 一个场景放置身份只发布一次 UI 边界；技能槽替换或测试侧重复启动不伪造第二个块。
    if (this.#registeredOperableBoundaryCastIds.has(skill.castId)) return;
    this.#registeredOperableBoundaryCastIds.add(skill.castId);
    this.#operableBoundaries.begin(
      skill.castId,
      skill.timelineBlockFrames,
      this.#resolveActualFrame!(),
    );
  }

  #requireSkill(skillId: string, castId?: string, resolveSkillSlot = true): AbilitySkillRuntime {
    const slotGroupKey = resolveSkillSlot
      ? this.#slotGroupByStableInputSkill.get(skillId)
      : undefined;
    const slotGroup =
      slotGroupKey === undefined ? undefined : this.#skillSlotGroups.get(slotGroupKey)!;
    const resolvedSkillId =
      slotGroup === undefined || slotGroup.currentSkillKey === slotGroup.baseSkillKey
        ? skillId
        : slotGroup.currentSkillKey;
    const skill = this.#skillsById.get(abilitySkillKey({ skillId: resolvedSkillId, castId }));
    if (skill === undefined) {
      const suffix = castId === undefined ? '' : ` (cast ${castId})`;
      throw new Error(`unknown ability skill '${resolvedSkillId}'${suffix}`);
    }
    return skill;
  }
}
