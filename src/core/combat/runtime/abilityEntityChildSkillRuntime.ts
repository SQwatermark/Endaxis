/**
 * 能力实体子技能的局部时间轴实例。
 *
 * 它只复用普通技能的动作序列解释器，不创建第二份施法、费用或冷却模型。
 */
import type { CombatExecutionContext } from '../actions/combatStep';
import type { CompiledAbilityEntityChildSkillProgram } from '../../compiler/combatProgram';
import {
  logicalAbilityEntityRuntimeId,
  type RuntimeTargetRef,
} from '../../game-data/logicalAbilityEntity';
import { TimelineActionProcessor } from '../timeline/timelineActionProcessor';
import { COMBAT_FRAMES_PER_SECOND } from './combatClock';
import { ActionBlackboard } from './actionBlackboard';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import type { CombatSkillCastInfo } from './skillCastInfo';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import { RuntimeTargetContext } from './runtimeTargetContext';
import type { LogicalAbilityEntityChildRuntime } from './logicalAbilityEntityRuntime';

export class AbilityEntityChildSkillRuntime implements LogicalAbilityEntityChildRuntime {
  readonly #context: CombatExecutionContext = {};
  readonly #operationContext: CombatOperationContext;
  readonly #sequenceRuntime: CombatActionSequenceRuntime;
  readonly #timeline: TimelineActionProcessor;
  #passedFrames = 0;
  #started = false;
  #finished = false;

  constructor(
    program: CompiledAbilityEntityChildSkillProgram,
    dependencies: {
      readonly entity: Extract<RuntimeTargetRef, { readonly kind: 'abilityEntity' }>;
      readonly entityBlackboard: ActionBlackboard;
      readonly operations: CombatOperationExecutor;
      readonly ownerOperatorId: string;
      readonly semanticEvents?: CombatSemanticEventRuntime;
      readonly inheritedSkillCastInfo?: CombatSkillCastInfo;
      readonly addAbilityChildBuff?: (child: { finish(reason: 'other'): boolean }) => void;
    },
  ) {
    // 原生实体技能先有自身 SkillData 默认值，再由 SpawnAbilityEntity.assignBlackboard
    // 的来源快照覆盖同名 direct key；实体黑板仍作为 EntityBB_ 的后备所有者。
    const blackboard = new ActionBlackboard(
      { ...program.initialBlackboard, ...dependencies.entityBlackboard.snapshot() },
      dependencies.entityBlackboard,
    );
    const runtime = this;
    this.#operationContext = {
      blackboard,
      damageCalculationSnapshots: new Map(),
      targetContext: new RuntimeTargetContext(),
      currentTarget: dependencies.entity,
      actionOwnerAbilityEntity: dependencies.entity,
      requestTimelineJump: destinationFrame => this.#requestTimelineJump(destinationFrame),
      requestTimelineFinish: () => this.#requestTimelineFinish(),
      getCurrentTimelineFrame: () => roundToEven(runtime.#passedFrames),
      ...(dependencies.addAbilityChildBuff === undefined
        ? {}
        : { addAbilityChildBuff: dependencies.addAbilityChildBuff }),
      ...(dependencies.inheritedSkillCastInfo === undefined
        ? {}
        : { skillCastInfo: dependencies.inheritedSkillCastInfo }),
    };
    this.#sequenceRuntime = new CombatActionSequenceRuntime(
      dependencies.operations,
      this.#operationContext,
      {},
      dependencies.semanticEvents,
      logicalAbilityEntityRuntimeId(dependencies.entity.instanceId),
    );
    this.#timeline = new TimelineActionProcessor(
      program.timelineActions.map(action => ({
        startFrame: action.startFrame,
        ...(action.endFrame === undefined ? {} : { endFrame: action.endFrame }),
        sequence: this.#sequenceRuntime.createSequence(action.sequence),
      })),
    );
  }

  start(): void {
    if (this.#started) throw new Error('AbilityEntity child skill has already started');
    this.#started = true;
    this.#sequenceRuntime.reset();
    this.#operationContext.damageCalculationSnapshots!.clear();
    this.#timeline.reset(this.#context);
    // 与普通技能一致，生成当帧立即执行一次零增量 Tick。
    this.#timeline.tick(0, 0, this.#context);
  }

  advance(deltaSeconds: number): void {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) {
      throw new RangeError('AbilityEntity child skill delta must be non-negative and finite');
    }
    if (!this.#started || this.#finished || this.#timeline.isComplete) return;
    this.#passedFrames += deltaSeconds * COMBAT_FRAMES_PER_SECOND;
    this.#timeline.tick(this.#passedFrames, deltaSeconds, this.#context);
  }

  finish(): void {
    if (!this.#started || this.#finished) return;
    this.#finished = true;
    this.#timeline.end(this.#passedFrames, this.#context);
  }

  #requestTimelineJump(destinationFrame: number): void {
    if (!this.#started || this.#finished) {
      throw new Error('AbilityEntity child skill cannot jump outside an active timeline');
    }
    this.#timeline.jumpTo(destinationFrame, this.#passedFrames, this.#context);
    this.#passedFrames = destinationFrame;
  }

  #requestTimelineFinish(): void {
    if (!this.#started || this.#finished) {
      throw new Error('AbilityEntity child skill cannot finish outside an active timeline');
    }
    this.#timeline.finish(this.#passedFrames, this.#context);
  }
}

function roundToEven(value: number): number {
  const lower = Math.floor(value);
  const fraction = value - lower;
  if (fraction < 0.5) return lower;
  if (fraction > 0.5) return lower + 1;
  return lower % 2 === 0 ? lower : lower + 1;
}
