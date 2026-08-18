/**
 * 零空间、单敌人模型中的逻辑能力实体目录。
 *
 * 它不保存坐标、碰撞体或朝向；所有空间查找均从同一活动实例集合开始，
 * 然后只应用 owner、生成期已解析的实体身份和存活等仍有战斗意义的筛选。
 */
import type {
  OwnerSpawnedAbilityEntityQuery,
  RuntimeTargetRef,
} from '../../game-data/logicalAbilityEntity';
import { ActionBlackboard, type ActionBlackboardValue } from './actionBlackboard';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import type { FrameRuntime } from './combatSimulation';
import { TimedMarkerContainer } from './timedMarkers';

export type LogicalAbilityEntityFinishReason =
  'durationExpired' | 'explicit' | 'ownerFinished' | 'sourceDied';

/** 编译后生成步骤携带的自包含蓝图；运行时只依赖子技能身份。 */
export interface LogicalAbilityEntityDefinition {
  readonly lifetime:
    { readonly kind: 'limited'; readonly durationSeconds: number } | { readonly kind: 'infinite' };
  readonly childSkill?: { readonly skillId: string };
}

export interface LogicalAbilityEntitySpawnRequest {
  readonly abilityEntityId: string;
  readonly definition: LogicalAbilityEntityDefinition;
  readonly ownerId: string;
  readonly source: RuntimeTargetRef;
  readonly target?: RuntimeTargetRef;
  readonly overrideDurationSeconds?: number;
  readonly dieWhenSourceDies?: boolean;
  readonly blackboardAssignments?: Readonly<Record<string, ActionBlackboardValue>>;
  readonly sourceSkillCastId?: number;
  /** 由操作解释链创建；目录只负责用实体局部时间推进和对称结束。 */
  readonly createChildRuntime?: (
    entity: RuntimeTargetRef,
    blackboard: ActionBlackboard,
  ) => LogicalAbilityEntityChildRuntime;
}

export interface LogicalAbilityEntityChildRuntime {
  start(): void;
  advance(deltaSeconds: number): void;
  finish(): void;
}

export interface LogicalAbilityEntitySnapshot {
  readonly instanceId: number;
  readonly abilityEntityId: string;
  readonly ownerId: string;
  readonly source: RuntimeTargetRef;
  readonly sourceSkillCastId?: number;
  readonly target?: RuntimeTargetRef;
  readonly childSkillId?: string;
  readonly remainingDurationSeconds: number | null;
  readonly elapsedDurationSeconds: number;
  readonly dieWhenSourceDies: boolean;
  readonly blackboard: Readonly<Record<string, ActionBlackboardValue>>;
}

export interface LogicalAbilityEntityRuntimeHooks {
  spawned?(snapshot: LogicalAbilityEntitySnapshot): void;
  childSkillRequested?(snapshot: LogicalAbilityEntitySnapshot, skillId: string): void;
  finished?(snapshot: LogicalAbilityEntitySnapshot, reason: LogicalAbilityEntityFinishReason): void;
}

interface LogicalAbilityEntityInstance {
  readonly instanceId: number;
  readonly abilityEntityId: string;
  readonly definition: LogicalAbilityEntityDefinition;
  readonly ownerId: string;
  readonly source: RuntimeTargetRef;
  readonly sourceSkillCastId?: number;
  target?: RuntimeTargetRef;
  readonly dieWhenSourceDies: boolean;
  readonly blackboard: ActionBlackboard;
  readonly timedMarkers: TimedMarkerContainer;
  remainingDurationSeconds: number | null;
  elapsedDurationSeconds: number;
  readonly childRuntimes: LogicalAbilityEntityChildRuntime[];
}

function requireDuration(value: number, name: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative finite number`);
  }
  return value;
}

/** 一场战斗唯一的能力实体实例目录。 */
export class LogicalAbilityEntityRuntime implements FrameRuntime {
  readonly #instances = new Map<number, LogicalAbilityEntityInstance>();
  readonly #deadSources: RuntimeTargetRef[] = [];
  readonly #hooks: LogicalAbilityEntityRuntimeHooks;
  readonly #resolveDeltaSeconds: (snapshot: LogicalAbilityEntitySnapshot) => number;
  #nextInstanceId = 1;

  constructor(options: {
    readonly hooks?: LogicalAbilityEntityRuntimeHooks;
    /** 后续时间膨胀接线点；省略时使用一帧的普通实体时间。 */
    readonly resolveDeltaSeconds?: (snapshot: LogicalAbilityEntitySnapshot) => number;
  }) {
    this.#hooks = options.hooks ?? {};
    this.#resolveDeltaSeconds = options.resolveDeltaSeconds ?? (() => COMBAT_FRAME_INTERVAL);
  }

  get activeCount(): number {
    return this.#instances.size;
  }

  isActive(target: RuntimeTargetRef): boolean {
    return target.kind === 'abilityEntity' && this.#instances.has(target.instanceId);
  }

  spawn(request: LogicalAbilityEntitySpawnRequest): RuntimeTargetRef {
    if (request.abilityEntityId.length === 0) throw new Error('AbilityEntity id must not be empty');
    if (
      request.sourceSkillCastId !== undefined &&
      (!Number.isInteger(request.sourceSkillCastId) || request.sourceSkillCastId <= 0)
    ) {
      throw new RangeError('AbilityEntity source skill-cast id must be a positive integer');
    }
    if (request.definition.lifetime.kind === 'limited') {
      requireDuration(request.definition.lifetime.durationSeconds, 'AbilityEntity duration');
    }
    if (request.ownerId.length === 0) throw new Error('AbilityEntity owner id must not be empty');
    const remainingDurationSeconds =
      request.overrideDurationSeconds === undefined
        ? request.definition.lifetime.kind === 'limited'
          ? request.definition.lifetime.durationSeconds
          : null
        : requireDuration(request.overrideDurationSeconds, 'override duration');
    const instanceId = this.#nextInstanceId++;
    let instance!: LogicalAbilityEntityInstance;
    instance = {
      instanceId,
      abilityEntityId: request.abilityEntityId,
      definition: request.definition,
      ownerId: request.ownerId,
      source: request.source,
      ...(request.sourceSkillCastId === undefined
        ? {}
        : { sourceSkillCastId: request.sourceSkillCastId }),
      ...(request.target === undefined ? {} : { target: request.target }),
      dieWhenSourceDies: request.dieWhenSourceDies ?? false,
      blackboard: new ActionBlackboard(request.blackboardAssignments),
      timedMarkers: new TimedMarkerContainer(`abilityEntity:${instanceId}`, {
        get time() {
          return instance.elapsedDurationSeconds;
        },
      }),
      remainingDurationSeconds,
      elapsedDurationSeconds: 0,
      childRuntimes: [],
    };
    this.#instances.set(instance.instanceId, instance);
    const snapshot = this.#snapshot(instance);
    this.#hooks.spawned?.(snapshot);
    const target = { kind: 'abilityEntity' as const, instanceId: instance.instanceId };
    if (request.createChildRuntime !== undefined) {
      this.startChildSkill(
        target,
        instance.definition.childSkill?.skillId ?? '<spawn-child>',
        request.createChildRuntime,
      );
    } else if (instance.definition.childSkill !== undefined) {
      this.#hooks.childSkillRequested?.(snapshot, instance.definition.childSkill.skillId);
    }
    return target;
  }

  /** 在既有实例上启动额外子时间轴；调用者负责提供已经编译的隐藏技能。 */
  startChildSkill(
    entity: RuntimeTargetRef,
    skillId: string,
    createRuntime: (
      entity: RuntimeTargetRef,
      blackboard: ActionBlackboard,
    ) => LogicalAbilityEntityChildRuntime,
  ): void {
    if (skillId.length === 0) throw new Error('AbilityEntity child skill id must not be empty');
    const instance = this.#requireInstance(entity);
    this.#hooks.childSkillRequested?.(this.#snapshot(instance), skillId);
    const runtime = createRuntime(entity, instance.blackboard);
    instance.childRuntimes.push(runtime);
    runtime.start();
  }

  /** 零空间范围查找：返回全部活动实例，不应用距离、半径或形状裁剪。 */
  findAll(): readonly RuntimeTargetRef[] {
    return [...this.#instances.keys()].map(instanceId => ({ kind: 'abilityEntity', instanceId }));
  }

  findOwnerSpawned(query: OwnerSpawnedAbilityEntityQuery): readonly RuntimeTargetRef[] {
    if (
      query.sourceSkillCastId !== undefined &&
      (!Number.isInteger(query.sourceSkillCastId) || query.sourceSkillCastId <= 0)
    ) {
      throw new RangeError('AbilityEntity query skill-cast id must be a positive integer');
    }
    const result: RuntimeTargetRef[] = [];
    for (const instance of this.#instances.values()) {
      if (instance.ownerId !== query.ownerId) continue;
      if (
        query.abilityEntityIds !== undefined &&
        !query.abilityEntityIds.includes(instance.abilityEntityId)
      ) {
        continue;
      }
      if (
        query.sourceSkillCastId !== undefined &&
        instance.sourceSkillCastId !== query.sourceSkillCastId
      ) {
        continue;
      }
      result.push({ kind: 'abilityEntity', instanceId: instance.instanceId });
    }
    return result;
  }

  snapshot(target: RuntimeTargetRef): LogicalAbilityEntitySnapshot {
    return this.#snapshot(this.#requireInstance(target));
  }

  /** 同一实例的子技能与 Buff 共用这一持久黑板；不对场景外暴露实例对象。 */
  entityBlackboard(target: RuntimeTargetRef): ActionBlackboard {
    return this.#requireInstance(target).blackboard;
  }

  /** 能力实体标记使用已经过实体时间膨胀结算的局部 elapsed time。 */
  timedMarkers(target: RuntimeTargetRef): TimedMarkerContainer {
    return this.#requireInstance(target).timedMarkers;
  }

  setTarget(entity: RuntimeTargetRef, target: RuntimeTargetRef): void {
    this.#requireInstance(entity).target = target;
  }

  isSourceDead(entity: RuntimeTargetRef): boolean {
    const source = this.#requireInstance(entity).source;
    return this.#deadSources.some(dead => this.#sameTarget(dead, source));
  }

  /** SetAbilityEntityDuration 的 Assign 路径设置当前剩余时长。 */
  setRemainingDuration(entity: RuntimeTargetRef, seconds: number): void {
    this.#requireInstance(entity).remainingDurationSeconds = requireDuration(
      seconds,
      'remaining duration',
    );
  }

  finish(entity: RuntimeTargetRef, reason: LogicalAbilityEntityFinishReason = 'explicit'): void {
    const instance = this.#requireInstance(entity);
    this.#instances.delete(instance.instanceId);
    for (const runtime of instance.childRuntimes) runtime.finish();
    this.#hooks.finished?.(this.#snapshot(instance), reason);
  }

  finishOwnerSpawned(ownerId: string): number {
    const targets = this.findOwnerSpawned({ ownerId });
    for (const target of targets) this.finish(target, 'ownerFinished');
    return targets.length;
  }

  notifySourceDied(source: RuntimeTargetRef): number {
    if (!this.#deadSources.some(dead => this.#sameTarget(dead, source))) {
      this.#deadSources.push(source);
    }
    const targets = [...this.#instances.values()]
      .filter(instance => instance.dieWhenSourceDies && this.#sameTarget(instance.source, source))
      .map(instance => ({ kind: 'abilityEntity' as const, instanceId: instance.instanceId }));
    for (const target of targets) this.finish(target, 'sourceDied');
    return targets.length;
  }

  advanceFrame(): void {
    for (const instance of [...this.#instances.values()]) {
      const delta = requireDuration(
        this.#resolveDeltaSeconds(this.#snapshot(instance)),
        'AbilityEntity delta',
      );
      instance.elapsedDurationSeconds += delta;
      if (instance.remainingDurationSeconds !== null) {
        instance.remainingDurationSeconds = Math.max(0, instance.remainingDurationSeconds - delta);
        if (instance.remainingDurationSeconds === 0) {
          this.finish(
            { kind: 'abilityEntity', instanceId: instance.instanceId },
            'durationExpired',
          );
          continue;
        }
      }
      for (const runtime of instance.childRuntimes) runtime.advance(delta);
    }
  }

  #requireInstance(target: RuntimeTargetRef): LogicalAbilityEntityInstance {
    if (target.kind !== 'abilityEntity') {
      throw new Error(`target '${target.kind}' is not an AbilityEntity`);
    }
    const instance = this.#instances.get(target.instanceId);
    if (instance === undefined) {
      throw new Error(`unknown or finished AbilityEntity instance '${target.instanceId}'`);
    }
    return instance;
  }

  #snapshot(instance: LogicalAbilityEntityInstance): LogicalAbilityEntitySnapshot {
    return Object.freeze({
      instanceId: instance.instanceId,
      abilityEntityId: instance.abilityEntityId,
      ownerId: instance.ownerId,
      source: instance.source,
      ...(instance.sourceSkillCastId === undefined
        ? {}
        : { sourceSkillCastId: instance.sourceSkillCastId }),
      ...(instance.target === undefined ? {} : { target: instance.target }),
      ...(instance.definition.childSkill === undefined
        ? {}
        : { childSkillId: instance.definition.childSkill.skillId }),
      remainingDurationSeconds: instance.remainingDurationSeconds,
      elapsedDurationSeconds: instance.elapsedDurationSeconds,
      dieWhenSourceDies: instance.dieWhenSourceDies,
      blackboard: instance.blackboard.snapshot(),
    });
  }

  #sameTarget(left: RuntimeTargetRef, right: RuntimeTargetRef): boolean {
    if (left.kind !== right.kind) return false;
    if (left.kind === 'enemy') return true;
    if (left.kind === 'operator' && right.kind === 'operator') {
      return left.operatorId === right.operatorId;
    }
    return (
      left.kind === 'abilityEntity' &&
      right.kind === 'abilityEntity' &&
      left.instanceId === right.instanceId
    );
  }
}
