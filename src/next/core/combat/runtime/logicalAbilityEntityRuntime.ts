/**
 * 零空间、单敌人模型中的逻辑能力实体目录。
 *
 * 它不保存坐标、碰撞体或朝向；所有空间查找均从同一活动实例集合开始，
 * 然后只应用 owner、标签和存活等仍有战斗意义的筛选。
 */
import type {
  LogicalAbilityEntityTemplate,
  OwnerSpawnedAbilityEntityQuery,
  RuntimeTargetRef,
} from '../../game-data/logicalAbilityEntity';
import { ActionBlackboard, type ActionBlackboardValue } from './actionBlackboard';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import type { FrameRuntime } from './combatSimulation';
import { GameplayTagRegistry } from '../tags/gameplayTags';

export type LogicalAbilityEntityFinishReason =
  'durationExpired' | 'explicit' | 'ownerFinished' | 'sourceDied';

export interface LogicalAbilityEntitySpawnRequest {
  readonly templateId: string;
  readonly ownerId: string;
  readonly source: RuntimeTargetRef;
  readonly target?: RuntimeTargetRef;
  readonly childSkillId?: string;
  readonly overrideDurationSeconds?: number;
  readonly dieWhenSourceDies?: boolean;
  readonly blackboardAssignments?: Readonly<Record<string, ActionBlackboardValue>>;
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
  readonly templateId: string;
  readonly ownerId: string;
  readonly source: RuntimeTargetRef;
  readonly target?: RuntimeTargetRef;
  readonly childSkillId?: string;
  readonly bornTagIds: LogicalAbilityEntityTemplate['bornTagIds'];
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
  readonly template: LogicalAbilityEntityTemplate;
  readonly ownerId: string;
  readonly source: RuntimeTargetRef;
  target?: RuntimeTargetRef;
  readonly childSkillId?: string;
  readonly dieWhenSourceDies: boolean;
  readonly blackboard: ActionBlackboard;
  remainingDurationSeconds: number | null;
  elapsedDurationSeconds: number;
  childRuntime?: LogicalAbilityEntityChildRuntime;
}

function requireDuration(value: number, name: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative finite number`);
  }
  return value;
}

/** 一场战斗唯一的能力实体实例目录。 */
export class LogicalAbilityEntityRuntime implements FrameRuntime {
  readonly #templates = new Map<string, LogicalAbilityEntityTemplate>();
  readonly #instances = new Map<number, LogicalAbilityEntityInstance>();
  readonly #tagRegistry: GameplayTagRegistry;
  readonly #hooks: LogicalAbilityEntityRuntimeHooks;
  readonly #resolveDeltaSeconds: (snapshot: LogicalAbilityEntitySnapshot) => number;
  #nextInstanceId = 1;

  constructor(options: {
    readonly templates: readonly LogicalAbilityEntityTemplate[];
    readonly tagRegistry?: GameplayTagRegistry;
    readonly hooks?: LogicalAbilityEntityRuntimeHooks;
    /** 后续时间膨胀接线点；省略时使用一帧的普通实体时间。 */
    readonly resolveDeltaSeconds?: (snapshot: LogicalAbilityEntitySnapshot) => number;
  }) {
    this.#tagRegistry = options.tagRegistry ?? new GameplayTagRegistry([]);
    this.#hooks = options.hooks ?? {};
    this.#resolveDeltaSeconds = options.resolveDeltaSeconds ?? (() => COMBAT_FRAME_INTERVAL);
    for (const template of options.templates) {
      if (template.id.length === 0) throw new Error('AbilityEntity template id must not be empty');
      if (this.#templates.has(template.id)) {
        throw new Error(`duplicate AbilityEntity template '${template.id}'`);
      }
      if (template.lifetime.kind === 'limited') {
        requireDuration(template.lifetime.durationSeconds, 'template duration');
      }
      this.#templates.set(template.id, Object.freeze({ ...template }));
    }
  }

  get activeCount(): number {
    return this.#instances.size;
  }

  isActive(target: RuntimeTargetRef): boolean {
    return target.kind === 'abilityEntity' && this.#instances.has(target.instanceId);
  }

  spawn(request: LogicalAbilityEntitySpawnRequest): RuntimeTargetRef {
    const template = this.#templates.get(request.templateId);
    if (template === undefined) {
      throw new Error(`unknown AbilityEntity template '${request.templateId}'`);
    }
    if (request.ownerId.length === 0) throw new Error('AbilityEntity owner id must not be empty');
    const remainingDurationSeconds =
      request.overrideDurationSeconds === undefined
        ? template.lifetime.kind === 'limited'
          ? template.lifetime.durationSeconds
          : null
        : requireDuration(request.overrideDurationSeconds, 'override duration');
    const instance: LogicalAbilityEntityInstance = {
      instanceId: this.#nextInstanceId++,
      template,
      ownerId: request.ownerId,
      source: request.source,
      ...(request.target === undefined ? {} : { target: request.target }),
      ...(request.childSkillId === undefined ? {} : { childSkillId: request.childSkillId }),
      dieWhenSourceDies: request.dieWhenSourceDies ?? false,
      blackboard: new ActionBlackboard(request.blackboardAssignments),
      remainingDurationSeconds,
      elapsedDurationSeconds: 0,
    };
    this.#instances.set(instance.instanceId, instance);
    const snapshot = this.#snapshot(instance);
    this.#hooks.spawned?.(snapshot);
    if (instance.childSkillId !== undefined) {
      this.#hooks.childSkillRequested?.(snapshot, instance.childSkillId);
    }
    const target = { kind: 'abilityEntity' as const, instanceId: instance.instanceId };
    if (request.createChildRuntime !== undefined) {
      instance.childRuntime = request.createChildRuntime(target, instance.blackboard);
      instance.childRuntime.start();
    }
    return target;
  }

  /** 零空间范围查找：返回全部活动实例，不应用距离、半径或形状裁剪。 */
  findAll(): readonly RuntimeTargetRef[] {
    return [...this.#instances.keys()].map(instanceId => ({ kind: 'abilityEntity', instanceId }));
  }

  findOwnerSpawned(query: OwnerSpawnedAbilityEntityQuery): readonly RuntimeTargetRef[] {
    const result: RuntimeTargetRef[] = [];
    for (const instance of this.#instances.values()) {
      if (instance.ownerId !== query.ownerId) continue;
      const tags = query.tagQuery;
      if (
        tags !== undefined &&
        !this.#tagRegistry.query(
          instance.template.bornTagIds,
          tags.tagIds,
          tags.type,
          tags.exact ?? false,
        )
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

  setTarget(entity: RuntimeTargetRef, target: RuntimeTargetRef): void {
    this.#requireInstance(entity).target = target;
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
    instance.childRuntime?.finish();
    this.#hooks.finished?.(this.#snapshot(instance), reason);
  }

  finishOwnerSpawned(ownerId: string): number {
    const targets = this.findOwnerSpawned({ ownerId });
    for (const target of targets) this.finish(target, 'ownerFinished');
    return targets.length;
  }

  notifySourceDied(source: RuntimeTargetRef): number {
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
      instance.childRuntime?.advance(delta);
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
      templateId: instance.template.id,
      ownerId: instance.ownerId,
      source: instance.source,
      ...(instance.target === undefined ? {} : { target: instance.target }),
      ...(instance.childSkillId === undefined ? {} : { childSkillId: instance.childSkillId }),
      bornTagIds: instance.template.bornTagIds,
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
