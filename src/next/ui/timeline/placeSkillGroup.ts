/**
 * 把新版干员目录中的技能库条目转换为存档中的稳定放置数据。
 * 本层只生成目录默认值和身份，不执行模拟；调用方必须提供可进入撤销历史的稳定 ID 分配器。
 */
import { compileSkill } from '../../core/compiler/compileSkill';
import type { ResolvedCombatStep } from '../../core/compiler/combatProgram';
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import type {
  ActionSequenceDocument,
  CombatStepDocument,
  ScenarioDocument,
  SkillCastDocument,
  TrackIndex,
} from '../../core/project/schema';

/** 放置命令生成稳定文档身份所需的端口。 */
export type TimelineDocumentIdKind =
  'skillCast' | 'placementGroup' | 'scheduledSequence' | 'hit' | 'customBar' | 'connection';

export interface TimelineDocumentIdAllocator {
  allocate(kind: TimelineDocumentIdKind): string;
}

export interface PlaceSkillGroupInput {
  readonly scenario: ScenarioDocument;
  readonly trackIndex: TrackIndex;
  readonly operator: OperatorDefinition;
  readonly skillGroupKey: string;
  /** 只放置技能组中的指定技能；省略时按声明顺序放置完整技能组。 */
  readonly skillKey?: string;
  readonly startFrame: number;
  readonly ids: TimelineDocumentIdAllocator;
}

/** 放置后的新场景及本次创建的技能块身份。 */
export interface PlaceSkillGroupResult {
  readonly scenario: ScenarioDocument;
  readonly skillCastIds: readonly string[];
}

function clonePlainValue<T>(value: T): T {
  if (Array.isArray(value)) return value.map(clonePlainValue) as T;
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, clonePlainValue(entry)]),
    ) as T;
  }
  return value;
}

function projectStep(
  step: ResolvedCombatStep,
  ids: TimelineDocumentIdAllocator,
): CombatStepDocument {
  const base = {
    kind: step.kind,
    parameters: clonePlainValue(step.parameters),
    ...(step.key === undefined ? {} : { sourceStepKey: step.key }),
    edited: [],
  };
  if (step.kind === 'conditional') {
    return {
      ...base,
      kind: step.kind,
      parameters: clonePlainValue(step.parameters),
      whenTrue: projectSequence(step.whenTrue, ids),
      ...(step.whenFalse === undefined ? {} : { whenFalse: projectSequence(step.whenFalse, ids) }),
    };
  }
  if (step.kind === 'once') {
    return {
      ...base,
      kind: step.kind,
      parameters: clonePlainValue(step.parameters),
      body: projectSequence(step.body, ids),
    };
  }
  if (step.kind === 'dealDamage' || step.kind === 'dealFixedDamage') {
    return {
      ...base,
      kind: step.kind,
      parameters: clonePlainValue(step.parameters),
      hitId: step.key ?? ids.allocate('hit'),
    } as CombatStepDocument;
  }
  return base as CombatStepDocument;
}

function projectSequence(
  sequence: { readonly steps: readonly ResolvedCombatStep[] },
  ids: TimelineDocumentIdAllocator,
): ActionSequenceDocument {
  return { steps: sequence.steps.map(step => projectStep(step, ids)) };
}

/**
 * 按技能组声明顺序放置一个技能或技能链。
 * 多段普攻等序列以前一段块宽为下一段起点，不擅自加入动画空隙。
 */
export function placeSkillGroup(input: PlaceSkillGroupInput): PlaceSkillGroupResult {
  if (!Number.isInteger(input.startFrame) || input.startFrame < 0) {
    throw new RangeError('startFrame must be a non-negative integer');
  }
  const track = input.scenario.tracks[input.trackIndex];
  if (track === null) throw new Error(`track ${input.trackIndex} is empty`);
  if (track.operatorBuildId === null)
    throw new Error(`track ${input.trackIndex} has no operator build`);
  const operatorBuild = input.scenario.builds.operators[track.operatorBuildId];
  if (operatorBuild === undefined) {
    throw new Error(`operator build '${track.operatorBuildId}' does not exist`);
  }
  if (operatorBuild.operatorSlug !== input.operator.slug) {
    throw new Error(
      `operator build '${operatorBuild.id}' references '${operatorBuild.operatorSlug}', not '${input.operator.slug}'`,
    );
  }
  const group = input.operator.skillGroups.find(candidate => candidate.key === input.skillGroupKey);
  if (group === undefined) {
    throw new Error(
      `operator '${input.operator.slug}' has no skill group '${input.skillGroupKey}'`,
    );
  }
  const level = operatorBuild.skillLevels[group.levelSource];
  if (level === undefined) {
    throw new Error(
      `operator build '${operatorBuild.id}' has no '${group.levelSource}' skill level`,
    );
  }

  const groupSkills = Array.isArray(group.skills) ? group.skills : [group.skills];
  const skills =
    input.skillKey === undefined
      ? groupSkills
      : groupSkills.filter(skill => skill.key === input.skillKey);
  if (skills.length === 0) {
    throw new Error(`skill group '${input.skillGroupKey}' has no skill '${input.skillKey ?? ''}'`);
  }
  const placementGroupId = skills.length > 1 ? input.ids.allocate('placementGroup') : undefined;
  const created: SkillCastDocument[] = [];
  let nextStartFrame = input.startFrame;

  skills.forEach((skill, index) => {
    const program = compileSkill({
      operatorId: operatorBuild.id,
      skillGroupKey: group.key,
      skillType: group.skillType,
      skill,
      skillLevel: level,
    });
    const skillCastId = input.ids.allocate('skillCast');
    const spCost = program.costs.find(cost => cost.resource === 'sp')?.value;
    const ultimateEnergyCost = program.costs.find(
      cost => cost.resource === 'ultimateEnergy',
    )?.value;
    created.push({
      id: skillCastId,
      source: { kind: 'operatorSkill', skillGroupKey: group.key, skillKey: skill.key },
      placement: { startFrame: nextStartFrame },
      ...(placementGroupId === undefined
        ? {}
        : {
            placementGroup: {
              id: placementGroupId,
              skillGroupKey: group.key,
              index,
              total: skills.length,
            },
          }),
      editable: {
        durationFrames: program.timelineBlockFrames,
        ...(program.cooldownFrames === undefined ? {} : { cooldownFrames: program.cooldownFrames }),
        ...(spCost === undefined ? {} : { spCost }),
        ...(ultimateEnergyCost === undefined ? {} : { ultimateEnergyCost }),
        locked: false,
        disabled: false,
        scheduledSequences: program.timelineActions.map(action => ({
          id: input.ids.allocate('scheduledSequence'),
          startFrame: action.startFrame,
          sequence: projectSequence(action.sequence, input.ids),
          edited: [],
        })),
        customBars: [],
      },
      edited: [],
    });
    nextStartFrame += program.timelineBlockFrames;
  });

  const tracks = [...input.scenario.tracks] as ScenarioDocument['tracks'];
  tracks[input.trackIndex] = { ...track, skillCasts: [...track.skillCasts, ...created] };
  return {
    scenario: { ...input.scenario, tracks },
    skillCastIds: created.map(skillCast => skillCast.id),
  };
}
