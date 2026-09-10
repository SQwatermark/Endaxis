import type { CompiledProjectileCallbackSkillProgram } from '../../compiler/combatProgram';
import type { TimelineActionProcessor } from '../timeline/timelineActionProcessor';
import type { BuffApplicationHandle } from './buffOperationExecutor';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { CombatOperationContext } from './skillRuntime';
import { COMBAT_FRAMES_PER_SECOND } from './combatClock';
import { SkillTimelineJumpGate } from './skillTimelineJump';

/**
 * Persistent action-program part of a detached callback. The projectile scheduler
 * owns component/reset phases. This does not impersonate the source AbilitySystem
 * or emit its SkillEnd; complete callback-owner event hosting remains separate.
 */
export class ProjectileCallbackActionRuntime {
  readonly #timeline: TimelineActionProcessor;
  readonly #sequenceRuntime: CombatActionSequenceRuntime;
  readonly #attachedBuffs = new Set<BuffApplicationHandle>();
  #passedFrames = 0;
  readonly #timelineJump = new SkillTimelineJumpGate();
  #started = false;
  #ended = false;
  #castFrameTick = false;
  #finishRequested = false;

  constructor(
    readonly program: CompiledProjectileCallbackSkillProgram,
    parent: CombatOperationContext,
    execution: CombatActionSequenceRuntime,
  ) {
    if (!Number.isInteger(program.naturalDurationFrames) || program.naturalDurationFrames < 1)
      throw new RangeError('projectile callback requires a positive native duration');
    const context: CombatOperationContext = {
      ...parent,
      // One direct board for the whole callback; all intervals share entity fallback.
      blackboard: parent.blackboard.createLocalScope(program.initialBlackboard, true),
      attachBuffToCurrentSkill: buff => this.#attachedBuffs.add(buff),
      detachBuffFromCurrentSkill: buff => this.#attachedBuffs.delete(buff),
      requestTimelineJump: frame => this.#jump(frame),
      requestTimelineFinish: () => {
        this.#timeline.finish(this.#passedFrames, {});
        this.#finishRequested = true;
      },
      getCurrentTimelineFrame: () => {
        const lower = Math.floor(this.#passedFrames);
        const fraction = this.#passedFrames - lower;
        return fraction < 0.5 ? lower : fraction > 0.5 ? lower + 1 : lower + (lower % 2);
      },
    };
    this.#sequenceRuntime = new CombatActionSequenceRuntime(
      execution.operations,
      context,
      execution.hooks,
      execution.semanticEvents,
      execution.ownerOperatorId,
    );
    this.#timeline = this.#sequenceRuntime.createTimeline(program.timelineActions);
  }

  start(): void {
    if (this.#started) throw new Error('callback action program has already started');
    this.#started = true;
    this.#castFrameTick = true;
    this.#sequenceRuntime.reset();
    this.#timeline.reset({});
    this.#timeline.tick(0, 0, {});
  }

  /** Called once in the Battle phase; a Default-phase cast still gets a zero-delta Tick. */
  advance(deltaSeconds: number): void {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0)
      throw new RangeError('callback delta must be finite and non-negative');
    if (!this.#started || this.#ended) return;
    const delta = this.#castFrameTick ? 0 : deltaSeconds;
    this.#castFrameTick = false;
    this.#passedFrames += delta * COMBAT_FRAMES_PER_SECOND;
    this.#timeline.tick(this.#passedFrames, delta, {});
    if (this.#finishRequested || this.#passedFrames >= this.program.naturalDurationFrames)
      this.end();
  }

  end(): void {
    if (!this.#started || this.#ended) return;
    const attached = [...this.#attachedBuffs];
    this.#timeline.end(this.#passedFrames, {});
    for (const buff of attached) buff.finish('other', null);
    for (const buff of attached) this.#attachedBuffs.delete(buff);
    this.#ended = true;
  }

  #jump(frame: number): void {
    this.#timelineJump.execute(
      frame,
      this.#passedFrames,
      this.program.naturalDurationFrames,
      () => {
        this.#timeline.jumpTo(frame, Math.min(frame, this.#passedFrames), {});
        this.#passedFrames = frame;
      },
      () => this.end(),
    );
  }
}
