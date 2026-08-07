/**
 * 单个技能从等级化目录定义进入运行时程序的编译边界。
 * 调用前必须给出有效等级；调用后所有数值均已解析，运行时不得再访问养成配置。
 */
import type {
  ActionSequenceDefinition,
  CombatStepDefinition,
  LevelValues,
  SkillDefinition,
  SkillType,
  StatusModifierDefinition,
} from '../game-data/operatorDefinition';
import type {
  CompiledSkillProgram,
  ResolvedActionSequence,
  ResolvedCombatStep,
  ResolvedStatusModifier,
} from './combatProgram';
import { gameplayTagId } from '../combat/tags/gameplayTags';

/** 编译一个技能所需的目录定义、等级和稳定来源身份。 */
export interface CompileSkillInput {
  readonly operatorId: string;
  readonly skillGroupKey: string;
  readonly skillType: SkillType;
  readonly skillLevel: number;
  readonly skill: SkillDefinition;
}

function resolveLevelValue(value: LevelValues, skillLevel: number, path: string): number {
  const resolved = typeof value === 'number' ? value : value[skillLevel - 1];
  if (resolved === undefined) {
    throw new RangeError(`${path} has no value for skill level ${skillLevel}`);
  }
  if (!Number.isFinite(resolved)) throw new TypeError(`${path} must resolve to a finite number`);
  return resolved;
}

function resolveStatusModifier(
  modifier: StatusModifierDefinition,
  skillLevel: number,
  path: string,
): ResolvedStatusModifier {
  switch (modifier.kind) {
    case 'attackPercent':
      return {
        kind: modifier.kind,
        value: resolveLevelValue(modifier.value, skillLevel, `${path}.value`),
      };
    case 'susceptibility':
      return {
        kind: modifier.kind,
        damageTypes: modifier.damageTypes,
        value: resolveLevelValue(modifier.value, skillLevel, `${path}.value`),
        ...(modifier.attributeScaling === undefined
          ? {}
          : {
              attributeScaling: {
                attribute: modifier.attributeScaling.attribute,
                coefficient: resolveLevelValue(
                  modifier.attributeScaling.coefficient,
                  skillLevel,
                  `${path}.attributeScaling.coefficient`,
                ),
              },
            }),
        ...(modifier.cap === undefined
          ? {}
          : { cap: resolveLevelValue(modifier.cap, skillLevel, `${path}.cap`) }),
      };
    case 'slowed':
    case 'blockResourceGain':
    case 'resourceCostMultiplier':
    case 'skillCooldownMultiplier':
      return modifier;
  }
}

function resolveStep(
  step: CombatStepDefinition,
  skillLevel: number,
  path: string,
): ResolvedCombatStep {
  const keyed = step.key === undefined ? {} : { key: step.key };
  switch (step.kind) {
    case 'dealDamage':
      return {
        ...keyed,
        kind: step.kind,
        parameters: {
          damageType: step.parameters.damageType,
          ...(step.parameters.calculation === undefined
            ? {}
            : { calculation: step.parameters.calculation }),
          attackScale: resolveLevelValue(
            step.parameters.attackScale,
            skillLevel,
            `${path}.parameters.attackScale`,
          ),
          ...(step.parameters.calculationMultiplier === undefined
            ? {}
            : {
                calculationMultiplier: resolveLevelValue(
                  step.parameters.calculationMultiplier,
                  skillLevel,
                  `${path}.parameters.calculationMultiplier`,
                ),
              }),
          tags: step.parameters.tags,
          ...(step.parameters.stagger === undefined
            ? {}
            : {
                stagger: resolveLevelValue(
                  step.parameters.stagger,
                  skillLevel,
                  `${path}.parameters.stagger`,
                ),
              }),
          ...(step.parameters.attackScalePerStatusStack === undefined
            ? {}
            : {
                attackScalePerStatusStack: {
                  ...step.parameters.attackScalePerStatusStack,
                  coefficient: resolveLevelValue(
                    step.parameters.attackScalePerStatusStack.coefficient,
                    skillLevel,
                    `${path}.parameters.attackScalePerStatusStack.coefficient`,
                  ),
                },
              }),
        },
      };
    case 'changeResource':
      return {
        ...keyed,
        kind: step.kind,
        parameters: {
          resource: step.parameters.resource,
          amount: resolveLevelValue(
            step.parameters.amount,
            skillLevel,
            `${path}.parameters.amount`,
          ),
          recipient: step.parameters.recipient,
          ...(step.parameters.spGainKind === undefined
            ? {}
            : { spGainKind: step.parameters.spGainKind }),
          ...(step.parameters.spGainSource === undefined
            ? {}
            : { spGainSource: step.parameters.spGainSource }),
        },
      };
    case 'applyStatus':
      return {
        ...keyed,
        kind: step.kind,
        parameters: {
          statusKey: step.parameters.statusKey,
          target: step.parameters.target,
          ...(step.parameters.stacks === undefined ? {} : { stacks: step.parameters.stacks }),
          ...(step.parameters.maxStacks === undefined
            ? {}
            : { maxStacks: step.parameters.maxStacks }),
          ...(step.parameters.durationFrames === undefined
            ? {}
            : {
                durationFrames: resolveLevelValue(
                  step.parameters.durationFrames,
                  skillLevel,
                  `${path}.parameters.durationFrames`,
                ),
              }),
          ...(step.parameters.modifiers === undefined
            ? {}
            : {
                modifiers: step.parameters.modifiers.map((modifier, index) =>
                  resolveStatusModifier(
                    modifier,
                    skillLevel,
                    `${path}.parameters.modifiers[${index}]`,
                  ),
                ),
              }),
        },
      };
    case 'conditional':
      return {
        ...keyed,
        kind: step.kind,
        parameters: step.parameters,
        whenTrue: resolveSequence(step.whenTrue, skillLevel, `${path}.whenTrue`),
        ...(step.whenFalse === undefined
          ? {}
          : { whenFalse: resolveSequence(step.whenFalse, skillLevel, `${path}.whenFalse`) }),
      };
    case 'readBuffBlackboard':
      return {
        ...keyed,
        kind: step.kind,
        parameters: {
          ...step.parameters,
          buffTagIds: step.parameters.buffTagIds.map(gameplayTagId),
        },
      };
    case 'finishBuffsByTag':
      return {
        ...keyed,
        kind: step.kind,
        parameters: {
          ...step.parameters,
          buffTagIds: step.parameters.buffTagIds.map(gameplayTagId),
        },
      };
    case 'gainSquadUltimateEnergyFromSkillCost':
      return {
        ...keyed,
        kind: step.kind,
        parameters: {
          coefficient: resolveLevelValue(
            step.parameters.coefficient,
            skillLevel,
            `${path}.parameters.coefficient`,
          ),
        },
      };
    case 'applyElementalInfliction':
    case 'applyElementalReaction':
    case 'consumeElementalReaction':
    case 'applyBuff':
    case 'gainFinisherSp':
    case 'consumeStatus':
    case 'setContextFlag':
      return { ...keyed, kind: step.kind, parameters: step.parameters } as ResolvedCombatStep;
  }
}

function resolveSequence(
  sequence: ActionSequenceDefinition,
  skillLevel: number,
  path: string,
): ResolvedActionSequence {
  return {
    steps: sequence.steps.map((step, index) =>
      resolveStep(step, skillLevel, `${path}.steps[${index}]`),
    ),
  };
}

export function compileSkill(input: CompileSkillInput): CompiledSkillProgram {
  if (!Number.isInteger(input.skillLevel) || input.skillLevel <= 0) {
    throw new RangeError('skillLevel must be a positive integer');
  }
  if (!Number.isInteger(input.skill.timelineBlockFrames) || input.skill.timelineBlockFrames < 0) {
    throw new RangeError(
      `skill '${input.skill.key}' must use non-negative integer timelineBlockFrames`,
    );
  }
  const costs = (input.skill.costs ?? []).map((cost, index) => ({
    resource: cost.resource,
    value: resolveLevelValue(cost.value, input.skillLevel, `costs[${index}].value`),
  }));
  const initialBlackboard = Object.fromEntries(
    Object.entries(input.skill.blackboard ?? {}).map(([key, value]) => [
      key,
      resolveLevelValue(value, input.skillLevel, `blackboard.${key}`),
    ]),
  );
  if (costs.length > 1) {
    throw new Error(
      `skill '${input.skill.key}' has multiple costs, but native CastData has one cost`,
    );
  }
  if (costs.some(cost => cost.value < 0)) {
    throw new RangeError(`skill '${input.skill.key}' cost must not be negative`);
  }
  if (costs.length > 0 && input.skill.costFrame === undefined) {
    throw new Error(`skill '${input.skill.key}' has costs but no recovered costFrame`);
  }
  if (
    input.skill.costFrame !== undefined &&
    (!Number.isInteger(input.skill.costFrame) || input.skill.costFrame < 0)
  ) {
    throw new RangeError(`skill '${input.skill.key}' must use a non-negative integer costFrame`);
  }

  return {
    operatorId: input.operatorId,
    skillGroupKey: input.skillGroupKey,
    skillId: input.skill.key,
    skillType: input.skillType,
    skillLevel: input.skillLevel,
    initialBlackboard,
    timelineBlockFrames: input.skill.timelineBlockFrames,
    ...(input.skill.cooldownFrames === undefined
      ? {}
      : {
          cooldownFrames: resolveLevelValue(
            input.skill.cooldownFrames,
            input.skillLevel,
            'cooldownFrames',
          ),
        }),
    ...(input.skill.costFrame === undefined ? {} : { costFrame: input.skill.costFrame }),
    costs,
    timelineActions: input.skill.scheduledSequences.map((scheduled, index) => ({
      startFrame: scheduled.startFrame,
      sequence: resolveSequence(
        scheduled.sequence,
        input.skillLevel,
        `scheduledSequences[${index}].sequence`,
      ),
    })),
  };
}
