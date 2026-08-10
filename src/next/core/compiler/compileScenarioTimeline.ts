/**
 * 把项目中的干员轨道和技能释放位置编译为战斗运行时可直接装配的程序与输入。
 *
 * 每个技能释放编译成独立程序（携带 castId 与步骤 hitId），因此同干员同帧多次释放、
 * 同技能多次放置都能在运行时区分；伤害回执会携带 castId + hitId，投影不再按帧反推。
 * 还没做通的逐次释放编辑仍然直接报错。
 */
import type { CombatOperatorProgram } from '../combat/runtime/combatRuntimeAssembly';
import type { CompiledSkillProgram, ResolvedCombatStep } from './combatProgram';
import type { ScheduledSkillInput } from '../combat/runtime/combatInputRuntime';
import type { GameDataRepository } from '../game-data/gameDataRepository';
import type { OperatorDefinition, SkillDefinition } from '../game-data/operatorDefinition';
import type {
  CombatStepDocument,
  OperatorInstanceDocument,
  ScenarioDocument,
  SkillCastDocument,
} from '../project/schema';
import { compileSkill } from './compileSkill';
import {
  applyOperatorUpgradeSkillPatches,
  resolveActiveOperatorUpgrades,
} from './compileOperatorUpgrades';
import type { ResolvedScenarioBuild } from './resolveScenarioBuilds';

/** 场景时间轴进入运行时装配前的纯编译结果，不包含任何可变战斗状态。 */
export interface CompiledScenarioTimeline {
  readonly operators: readonly CombatOperatorProgram[];
  readonly inputs: readonly ScheduledSkillInput[];
}

type OperatorIndex = Pick<GameDataRepository, 'getOperator'>;

function requireOperator(
  build: OperatorInstanceDocument,
  index: OperatorIndex,
): OperatorDefinition {
  const operator = index.getOperator(build.operatorSlug);
  if (operator === null) {
    throw new Error(`operator definition '${build.operatorSlug}' does not exist`);
  }
  return operator;
}

function requireSkillLevel(build: OperatorInstanceDocument, levelSource: string): number {
  const level = build.skillLevels[levelSource];
  if (level === undefined) {
    throw new Error(`operator '${build.operatorSlug}' has no '${levelSource}' skill level`);
  }
  return level;
}

function assertSkillCanCompile(operator: OperatorDefinition, skill: SkillDefinition): void {
  if (skill.eventHandlers?.length) {
    throw new Error(
      `skill '${operator.slug}/${skill.key}' has event handlers, but skill event compilation is not connected`,
    );
  }
}

/** 文档步骤转运行时步骤；`hitId` 与定义步骤键一起随回执传递。 */
function projectDocumentStep(step: CombatStepDocument): ResolvedCombatStep {
  const base = {
    kind: step.kind,
    parameters: step.parameters,
    ...(step.sourceStepKey === undefined ? {} : { key: step.sourceStepKey }),
    ...(step.kind === 'dealDamage' || step.kind === 'dealFixedDamage' ? { hitId: step.hitId } : {}),
  };
  if (step.kind === 'conditional') {
    return {
      ...base,
      kind: step.kind,
      parameters: step.parameters,
      whenTrue: { steps: step.whenTrue.steps.map(projectDocumentStep) },
      ...(step.whenFalse === undefined
        ? {}
        : { whenFalse: { steps: step.whenFalse.steps.map(projectDocumentStep) } }),
    } as ResolvedCombatStep;
  }
  if (step.kind === 'once') {
    return {
      ...base,
      kind: step.kind,
      parameters: step.parameters,
      body: { steps: step.body.steps.map(projectDocumentStep) },
    } as ResolvedCombatStep;
  }
  return base as ResolvedCombatStep;
}

/** 从技能释放文档编译一个独立程序；定义默认值、等级与养成补丁仍以定义为准。 */
function compileCastSkillProgram(
  trackId: string,
  operator: OperatorDefinition,
  skill: SkillDefinition,
  skillLevel: number,
  cast: SkillCastDocument,
): CompiledSkillProgram {
  const source = cast.source;
  if (source.kind !== 'operatorSkill') {
    throw new Error(`skill cast '${cast.id}' uses unsupported source kind '${source.kind}'`);
  }
  const group = operator.skillGroups.find(candidate => candidate.key === source.skillGroupKey);
  if (group === undefined) {
    throw new Error(`operator '${operator.slug}' has no skill group '${source.skillGroupKey}'`);
  }
  const base = compileSkill({
    operatorId: trackId,
    skillGroupKey: group.key,
    skillType: group.skillType,
    skillLevel,
    skill,
  });
  return {
    ...base,
    castId: cast.id,
    timelineActions: cast.editable.scheduledSequences.map(scheduled => ({
      startFrame: scheduled.startFrame,
      sequence: { steps: scheduled.sequence.steps.map(projectDocumentStep) },
    })),
  };
}

/**
 * 编译干员定义中的全部技能（已应用养成补丁，不带 castId）。
 * 资源规则等与放置无关的解析使用这份名单；放置程序由 `compileCastSkillProgram` 单独产生。
 */
export function compileOperatorDefinitionSkills(
  trackId: string,
  build: OperatorInstanceDocument,
  operator: OperatorDefinition,
): readonly CompiledSkillProgram[] {
  const skills = operator.skillGroups.flatMap(group => {
    const skillLevel = requireSkillLevel(build, group.levelSource);
    const definitions = Array.isArray(group.skills) ? group.skills : [group.skills];
    return definitions.map(skill => {
      assertSkillCanCompile(operator, skill);
      return compileSkill({
        operatorId: trackId,
        skillGroupKey: group.key,
        skillType: group.skillType,
        skillLevel,
        skill,
      });
    });
  });
  return applyOperatorUpgradeSkillPatches(skills, resolveActiveOperatorUpgrades(build, operator));
}

function assertCastUsesDefinitionDefaults(cast: SkillCastDocument): void {
  const hasNestedEdits = cast.editable.scheduledSequences.some(
    scheduled =>
      scheduled.edited.length > 0 || scheduled.sequence.steps.some(step => step.edited.length > 0),
  );
  if (cast.edited.length > 0 || hasNestedEdits) {
    throw new Error(
      `skill cast '${cast.id}' contains user overrides, but per-cast overrides are not supported yet`,
    );
  }
}

function requireCastSkill(cast: SkillCastDocument, operator: OperatorDefinition): SkillDefinition {
  if (cast.source.kind !== 'operatorSkill') {
    throw new Error(`skill cast '${cast.id}' uses unsupported source kind '${cast.source.kind}'`);
  }
  const source = cast.source;
  const group = operator.skillGroups.find(candidate => candidate.key === source.skillGroupKey);
  if (group === undefined) {
    throw new Error(`operator '${operator.slug}' has no skill group '${source.skillGroupKey}'`);
  }
  const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
  const skill = skills.find(candidate => candidate.key === source.skillKey);
  if (skill === undefined) {
    throw new Error(
      `skill group '${operator.slug}/${group.key}' has no skill '${source.skillKey}'`,
    );
  }
  return skill;
}

interface ResolvedTimelineTrack {
  readonly track: NonNullable<ScenarioDocument['tracks'][number]>;
  readonly operatorInstance: OperatorInstanceDocument;
  readonly operator: OperatorDefinition;
}

function compileResolvedTimelineTracks(
  tracks: readonly ResolvedTimelineTrack[],
): CompiledScenarioTimeline {
  const operators: CombatOperatorProgram[] = [];
  const pendingInputs: (ScheduledSkillInput & { readonly order: number })[] = [];
  let order = 0;

  for (const { track, operatorInstance, operator } of tracks) {
    const skills: CompiledSkillProgram[] = [];
    for (const cast of track.skillCasts) {
      if (cast.editable.disabled) continue;
      assertCastUsesDefinitionDefaults(cast);
      const skill = requireCastSkill(cast, operator);
      assertSkillCanCompile(operator, skill);
      const source = cast.source;
      if (source.kind !== 'operatorSkill') {
        throw new Error(`skill cast '${cast.id}' uses unsupported source kind '${source.kind}'`);
      }
      const group = operator.skillGroups.find(candidate => candidate.key === source.skillGroupKey);
      if (group === undefined) {
        throw new Error(`operator '${operator.slug}' has no skill group '${source.skillGroupKey}'`);
      }
      const level = requireSkillLevel(operatorInstance, group.levelSource);
      skills.push(compileCastSkillProgram(track.id, operator, skill, level, cast));
      pendingInputs.push({
        frame: cast.placement.startFrame,
        operatorId: track.id,
        skillId: skill.key,
        castId: cast.id,
        order,
      });
      order += 1;
    }
    // 干员只要有构筑就进入运行时（技能列表可能为空），资源规则与面板解析依赖这份名单。
    operators.push({
      operatorId: track.id,
      skills: applyOperatorUpgradeSkillPatches(
        skills,
        resolveActiveOperatorUpgrades(operatorInstance, operator),
      ),
    });
  }

  pendingInputs.sort((left, right) => left.frame - right.frame || left.order - right.order);
  return {
    operators,
    inputs: pendingInputs.map(({ order: _order, ...input }) => input),
  };
}

/** 使用 Build Resolver 的共享结果编译每个技能释放的程序和时间轴输入。 */
export function compileResolvedScenarioTimeline(
  builds: readonly ResolvedScenarioBuild[],
): CompiledScenarioTimeline {
  const tracks = builds.map(build => ({
    track: build.track,
    operatorInstance: build.operatorInstance,
    operator: build.operator,
  }));
  return compileResolvedTimelineTracks(tracks);
}

/**
 * 按轨道序号和轨道内声明顺序收集输入，再稳定地按帧排序。
 * 同帧顺序会影响资源扣费和事件处理，因此不得按干员或技能身份二次排序。
 */
export function compileScenarioTimeline(
  scenario: ScenarioDocument,
  index: OperatorIndex,
): CompiledScenarioTimeline {
  const tracks: ResolvedTimelineTrack[] = [];
  const seenOperatorIds = new Set<string>();

  scenario.tracks.forEach((track, trackIndex) => {
    if (track === null) return;
    const operatorInstance = track.operator;
    if (operatorInstance === null) {
      if (track.skillCasts.length > 0) {
        throw new Error(`track ${trackIndex} has skill casts but no operator instance`);
      }
      return;
    }
    if (seenOperatorIds.has(track.id)) {
      throw new Error(`track '${track.id}' is assigned to multiple operator instances`);
    }
    seenOperatorIds.add(track.id);
    const operator = requireOperator(operatorInstance, index);
    tracks.push({ track, operatorInstance, operator });
  });
  return compileResolvedTimelineTracks(tracks);
}
