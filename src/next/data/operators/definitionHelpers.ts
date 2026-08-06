import type {
  ActionSequenceDefinition,
  CombatCondition,
  CombatStepDefinition,
  CombatStepKind,
  CombatStepParameters,
  CombatTarget,
  DamageType,
  DealDamageParameters,
  ElementalReaction,
  LevelValues,
  ScheduledSequenceDefinition,
  SkillDefinition,
} from '../../core/game-data/operatorDefinition';

type ImmediateStepKind = Exclude<CombatStepKind, 'conditional'>;

/** Creates one immediate operation while preserving its discriminated-union type. */
export function step<K extends ImmediateStepKind>(
  kind: K,
  parameters: CombatStepParameters[K],
  key?: string,
): Extract<CombatStepDefinition, { kind: K }> {
  return { kind, parameters, ...(key ? { key } : {}) } as Extract<
    CombatStepDefinition,
    { kind: K }
  >;
}

export function sequence(...steps: CombatStepDefinition[]): ActionSequenceDefinition {
  return { steps };
}

export function not(condition: CombatCondition): CombatCondition {
  return { kind: 'not', condition };
}

export function all(...conditions: CombatCondition[]): CombatCondition {
  return { kind: 'all', conditions };
}

export function statusActive(
  statusKey: string,
  target: CombatTarget = 'caster',
  minimumStacks?: number,
): CombatCondition {
  return {
    kind: 'statusActive',
    statusKey,
    target,
    ...(minimumStacks === undefined ? {} : { minimumStacks }),
  };
}

export function statusStacksExactly(
  statusKey: string,
  stacks: number,
  target: CombatTarget = 'caster',
): CombatCondition {
  return all(
    statusActive(statusKey, target, stacks),
    not(statusActive(statusKey, target, stacks + 1)),
  );
}

export function reactionActive(
  reaction: ElementalReaction,
  minimumLevel?: number,
): CombatCondition {
  return {
    kind: 'elementalReactionActive',
    reaction,
    ...(minimumLevel === undefined ? {} : { minimumLevel }),
  };
}

export function branch(
  condition: CombatCondition,
  whenTrue: ActionSequenceDefinition,
  whenFalse?: ActionSequenceDefinition,
): Extract<CombatStepDefinition, { kind: 'conditional' }> {
  return {
    kind: 'conditional',
    parameters: { condition },
    whenTrue,
    ...(whenFalse ? { whenFalse } : {}),
  };
}

interface ConditionalCase {
  condition: CombatCondition;
  sequence: ActionSequenceDefinition;
}

/** Builds an ordered if/else-if chain and executes only the first matching case. */
export function firstMatching(
  cases: readonly ConditionalCase[],
  fallback?: ActionSequenceDefinition,
): CombatStepDefinition {
  const [current, ...remaining] = cases;
  if (!current) {
    throw new Error('firstMatching requires at least one case');
  }

  const whenFalse = remaining.length ? sequence(firstMatching(remaining, fallback)) : fallback;
  return branch(current.condition, current.sequence, whenFalse);
}

export function scheduled(
  frame: number,
  actionSequence: ActionSequenceDefinition,
  endFrame = frame,
): ScheduledSequenceDefinition {
  return { startFrame: frame, endFrame, sequence: actionSequence };
}

type DamageOptions = Omit<DealDamageParameters, 'damageType' | 'attackScale' | 'tags'>;

export interface BasicAttackOptions extends DamageOptions {
  availability?: CombatCondition;
  final?: boolean;
  spRecovery?: LevelValues;
  lastHitEndFrame?: number;
}

/** Binds an operator's damage type while leaving each hit's scale and tags explicit. */
export function damageOfType(damageType: DamageType) {
  return (
    attackScale: DealDamageParameters['attackScale'],
    tags: DealDamageParameters['tags'],
    options: DamageOptions = {},
  ): DealDamageParameters => ({ damageType, attackScale, tags, ...options });
}

/** Creates one segment of a normal-attack chain with an explicit damage type. */
export function basicAttackOfType(damageType: DamageType) {
  return (
    key: string,
    durationFrames: number,
    hitFrames: number | readonly number[],
    attackScale: LevelValues,
    options: BasicAttackOptions = {},
  ): SkillDefinition => {
    const { availability, final = false, spRecovery, lastHitEndFrame, ...damageOptions } = options;
    const frames = typeof hitFrames === 'number' ? [hitFrames] : hitFrames;
    const tags = final
      ? (['normalAttack', 'normalAttackLastCombo'] as const)
      : (['normalAttack'] as const);

    return {
      key,
      durationFrames,
      ...(availability ? { availability } : {}),
      scheduledSequences: frames.map((frame, index) => {
        const last = index === frames.length - 1;
        return scheduled(
          frame,
          sequence(
            step('dealDamage', { damageType, attackScale, tags, ...damageOptions }),
            ...(last && spRecovery !== undefined
              ? [
                  step('changeResource', {
                    resource: 'sp',
                    amount: spRecovery,
                    recipient: 'team',
                  }),
                ]
              : []),
          ),
          last ? (lastHitEndFrame ?? frame) : frame,
        );
      }),
    };
  };
}

export function multiplyLevelValues(values: number, multiplier: number): number;
export function multiplyLevelValues(values: readonly number[], multiplier: number): number[];
export function multiplyLevelValues(values: LevelValues, multiplier: number): LevelValues;
export function multiplyLevelValues(values: LevelValues, multiplier: number): LevelValues {
  return typeof values === 'number' ? values * multiplier : values.map(value => value * multiplier);
}

export function scaleDamageByStatusStacks(
  damage: DealDamageParameters,
  statusKey: string,
  coefficient: LevelValues,
  target: CombatTarget = 'caster',
): DealDamageParameters {
  return {
    ...damage,
    attackScalePerStatusStack: { statusKey, target, coefficient },
  };
}

/** Creates one damage-only scheduled sequence for each source hit frame. */
export function damageHits(
  frames: readonly number[],
  parameters: DealDamageParameters,
): ScheduledSequenceDefinition[] {
  return frames.map(frame => scheduled(frame, sequence(step('dealDamage', parameters))));
}

/** Converts percentages copied from source tables into decimal combat multipliers. */
export function percentages(values: readonly number[]): number[] {
  return values.map(value => value / 100);
}

export function secondsToFrames(value: number): number;
export function secondsToFrames(values: readonly number[]): number[];
export function secondsToFrames(values: LevelValues): LevelValues {
  return typeof values === 'number' ? values * 30 : values.map(value => value * 30);
}
