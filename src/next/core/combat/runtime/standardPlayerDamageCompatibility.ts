/**
 * 在启动模拟前检查编译产物是否完全落在标准玩家生命伤害环境的能力边界内。
 * 本模块只报告结构化问题，不读取运行时状态；环境扩展能力时应先更新这里，再接入执行器。
 */
import type { CompiledSkillProgram, ResolvedActionSequence } from '../../compiler/combatProgram';
import type { CombatCondition } from '../../game-data/operatorDefinition';
import type { CombatOperatorProgram } from './combatRuntimeAssembly';
import type { ScheduledSkillInput } from './combatInputRuntime';

export const STANDARD_PLAYER_DAMAGE_COMPATIBILITY_CODES = [
  'unsupported-step',
  'unsupported-condition',
  'unsupported-damage-calculation',
  'unsupported-damage-field',
  'unsupported-resource-change',
] as const;

/** 标准伤害预检问题的稳定分类；UI 可以凭它自行翻译。 */
export type StandardPlayerDamageCompatibilityCode =
  (typeof STANDARD_PLAYER_DAMAGE_COMPATIBILITY_CODES)[number];

/** 一项问题同时保留机器可读分类和可定位到编译产物的路径。 */
export interface StandardPlayerDamageCompatibilityIssue {
  readonly code: StandardPlayerDamageCompatibilityCode;
  readonly path: string;
  readonly detail: string;
}

/** 预检只扫描本次模拟实际可能触发的技能，同时检查全局装配缺口。 */
export interface StandardPlayerDamageCompatibilityInput {
  readonly operators: readonly CombatOperatorProgram[];
  readonly inputs?: readonly ScheduledSkillInput[];
  readonly endFrame: number;
  /** 未提供元素附着定义时，`applyElementalInfliction` 仍视为不支持步骤。 */
  readonly supportsElementalInfliction?: boolean;
}

/** 预检失败时一次携带全部问题，避免逐个修复后才发现下一项。 */
export class StandardPlayerDamageCompatibilityError extends Error {
  constructor(readonly issues: readonly StandardPlayerDamageCompatibilityIssue[]) {
    super(
      [
        `standard player damage profile is incompatible with ${issues.length} compiled operation(s):`,
        ...issues.map(issue => `${issue.path}: ${issue.detail}`),
      ].join('\n'),
    );
    this.name = 'StandardPlayerDamageCompatibilityError';
  }
}

type IssueCollector = (issue: StandardPlayerDamageCompatibilityIssue) => void;

interface CompatibilityFlags {
  readonly elementalInfliction: boolean;
}

function report(
  collect: IssueCollector,
  code: StandardPlayerDamageCompatibilityCode,
  path: string,
  detail: string,
): void {
  collect(Object.freeze({ code, path, detail }));
}

function inspectCondition(condition: CombatCondition, path: string, collect: IssueCollector): void {
  switch (condition.kind) {
    case 'combatActive':
    case 'singleEnemyPresent':
    case 'actionValueCompare':
    case 'timedMarkerPresent':
    case 'elementalReactionActive':
      return;
    case 'healthCompare':
      if (condition.target !== 'enemy') {
        report(
          collect,
          'unsupported-condition',
          path,
          "healthCompare for 'caster' requires operator vitals",
        );
      }
      return;
    case 'not':
      inspectCondition(condition.condition, `${path}.condition`, collect);
      return;
    case 'all':
    case 'any':
      condition.conditions.forEach((child, index) =>
        inspectCondition(child, `${path}.conditions[${index}]`, collect),
      );
      return;
    default:
      report(collect, 'unsupported-condition', path, `condition '${condition.kind}'`);
  }
}

function inspectSequence(
  sequence: ResolvedActionSequence,
  path: string,
  collect: IssueCollector,
  flags: CompatibilityFlags,
  source: 'skill' | 'equipment' = 'skill',
): void {
  sequence.steps.forEach((step, index) => {
    const stepPath = `${path}.steps[${index}]`;
    switch (step.kind) {
      case 'dealDamage': {
        if (source === 'equipment') {
          report(
            collect,
            'unsupported-step',
            stepPath,
            'equipment-triggered damage requires a recovered source-classification path',
          );
          return;
        }
        const parameters = step.parameters;
        if (parameters.damageType === 'lifeDrain') {
          report(
            collect,
            'unsupported-damage-calculation',
            `${stepPath}.parameters.damageType`,
            "damage type 'lifeDrain' uses a separate native calculation",
          );
        }
        if (parameters.attackScalePerStatusStack !== undefined) {
          report(
            collect,
            'unsupported-damage-field',
            `${stepPath}.parameters.attackScalePerStatusStack`,
            'status-scaled attack requires a status-aware damage resolver',
          );
        }
        return;
      }
      case 'dealFixedDamage':
        if (source === 'equipment') {
          report(
            collect,
            'unsupported-step',
            stepPath,
            'equipment-triggered damage requires a recovered source-classification path',
          );
          return;
        }
        if (step.parameters.damageType === 'lifeDrain') {
          report(
            collect,
            'unsupported-damage-calculation',
            `${stepPath}.parameters.damageType`,
            "damage type 'lifeDrain' uses a separate native calculation",
          );
        }
        return;
      case 'applyElementalInfliction':
        if (source === 'equipment') {
          report(
            collect,
            'unsupported-step',
            stepPath,
            'equipment-triggered infliction requires a recovered source-classification path',
          );
          return;
        }
        if (!flags.elementalInfliction) {
          report(
            collect,
            'unsupported-step',
            stepPath,
            'elemental infliction requires an elemental infliction document',
          );
        }
        return;
      case 'applyElementalReaction':
      case 'consumeElementalReaction':
        return;
      case 'dealStagger':
      case 'modifyActionValue':
      case 'calculateActionValue':
      case 'createTimedMarker':
      case 'gainSquadUltimateEnergyFromSkillCost':
      case 'gainFinisherSp':
      case 'openComboWindow':
        return;
      case 'changeResource':
      case 'changeResourceByActionValue': {
        const { resource, recipient } = step.parameters;
        const supported =
          (resource === 'sp' && recipient === 'team') ||
          (resource === 'ultimateEnergy' && recipient === 'caster');
        if (!supported) {
          report(
            collect,
            'unsupported-resource-change',
            `${stepPath}.parameters`,
            `resource '${resource}' for recipient '${recipient}'`,
          );
        }
        return;
      }
      case 'conditional':
        inspectCondition(step.parameters.condition, `${stepPath}.parameters.condition`, collect);
        inspectSequence(step.whenTrue, `${stepPath}.whenTrue`, collect, flags, source);
        if (step.whenFalse !== undefined) {
          inspectSequence(step.whenFalse, `${stepPath}.whenFalse`, collect, flags, source);
        }
        return;
      case 'once':
        inspectSequence(step.body, `${stepPath}.body`, collect, flags, source);
        return;
      default:
        report(collect, 'unsupported-step', stepPath, `step '${step.kind}'`);
    }
  });
}

function inspectProgram(
  program: CompiledSkillProgram,
  scheduledFrames: readonly number[],
  endFrame: number,
  operatorPath: string,
  collect: IssueCollector,
  flags: CompatibilityFlags,
): void {
  const programPath = `${operatorPath}.skills['${program.skillId}']`;
  program.timelineActions.forEach((action, index) => {
    if (!scheduledFrames.some(castFrame => castFrame + action.startFrame <= endFrame)) return;
    inspectSequence(
      action.sequence,
      `${programPath}.timelineActions[${index}].sequence`,
      collect,
      flags,
    );
  });
}

function indexScheduledFrames(
  inputs: readonly ScheduledSkillInput[],
  endFrame: number,
): ReadonlyMap<string, ReadonlyMap<string, readonly number[]>> {
  const index = new Map<string, Map<string, number[]>>();
  for (const input of inputs) {
    if (input.frame > endFrame) continue;
    let operatorSkills = index.get(input.operatorId);
    if (operatorSkills === undefined) {
      operatorSkills = new Map();
      index.set(input.operatorId, operatorSkills);
    }
    const frames = operatorSkills.get(input.skillId);
    if (frames === undefined) operatorSkills.set(input.skillId, [input.frame]);
    else frames.push(input.frame);
  }
  return index;
}

/**
 * 检查完整干员编译结果，包括尚未安装进标准入口的装备事件监听器。
 * 返回顺序与干员、技能、时间动作和步骤的声明顺序一致，便于稳定测试与展示。
 */
export function inspectStandardPlayerDamageCompatibility(
  input: StandardPlayerDamageCompatibilityInput,
): readonly StandardPlayerDamageCompatibilityIssue[] {
  if (!Number.isInteger(input.endFrame) || input.endFrame < 0) {
    throw new RangeError('endFrame must be a non-negative integer');
  }
  const issues: StandardPlayerDamageCompatibilityIssue[] = [];
  const collect: IssueCollector = issue => issues.push(issue);
  const flags: CompatibilityFlags = {
    elementalInfliction: input.supportsElementalInfliction ?? false,
  };
  const scheduledFrames = indexScheduledFrames(input.inputs ?? [], input.endFrame);

  input.operators.forEach((operator, operatorIndex) => {
    const operatorPath = `operators[${operatorIndex}]('${operator.operatorId}')`;
    const operatorScheduledFrames = scheduledFrames.get(operator.operatorId);
    operator.skills.forEach(program => {
      const skillScheduledFrames = operatorScheduledFrames?.get(program.skillId);
      if (skillScheduledFrames === undefined) return;
      inspectProgram(program, skillScheduledFrames, input.endFrame, operatorPath, collect, flags);
    });
    operator.equipmentContributions?.forEach((contribution, contributionIndex) => {
      contribution.eventHandlers.forEach((handler, handlerIndex) => {
        const handlerPath = `${operatorPath}.equipmentContributions[${contributionIndex}].eventHandlers[${handlerIndex}]`;
        if (handler.condition !== undefined) {
          inspectCondition(handler.condition, `${handlerPath}.condition`, collect);
        }
        inspectSequence(handler.sequence, `${handlerPath}.sequence`, collect, flags, 'equipment');
      });
    });
  });

  return Object.freeze(issues);
}

/** 在任何运行时对象推进前拒绝不完整的标准伤害模拟。 */
export function assertStandardPlayerDamageCompatibility(
  input: StandardPlayerDamageCompatibilityInput,
): void {
  const issues = inspectStandardPlayerDamageCompatibility(input);
  if (issues.length > 0) throw new StandardPlayerDamageCompatibilityError(issues);
}
