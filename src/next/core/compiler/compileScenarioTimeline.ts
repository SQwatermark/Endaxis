/**
 * 把项目中的干员轨道和技能释放位置编译为战斗运行时可直接装配的程序与输入。
 * 本层只连接稳定目录身份和用户操作顺序；尚未闭环的养成修正、逐次释放编辑与武器技能必须显式失败。
 */
import type { CombatOperatorProgram } from '../combat/runtime/combatRuntimeAssembly';
import type { ScheduledSkillInput } from '../combat/runtime/combatInputRuntime';
import type { GameDataRepository } from '../game-data/gameDataRepository';
import type { OperatorDefinition, SkillDefinition } from '../game-data/operatorDefinition';
import type { OperatorBuildDocument, ScenarioDocument, SkillCastDocument } from '../project/schema';
import { compileSkill } from './compileSkill';
import type { ResolvedScenarioBuild } from './resolveScenarioBuilds';

/** 场景时间轴进入运行时装配前的纯编译结果，不包含任何可变战斗状态。 */
export interface CompiledScenarioTimeline {
  readonly operators: readonly CombatOperatorProgram[];
  readonly inputs: readonly ScheduledSkillInput[];
}

type OperatorCatalog = Pick<GameDataRepository, 'getOperator'>;

function requireOperator(
  build: OperatorBuildDocument,
  catalog: OperatorCatalog,
): OperatorDefinition {
  const operator = catalog.getOperator(build.operatorSlug);
  if (operator === null) {
    throw new Error(`operator definition '${build.operatorSlug}' does not exist`);
  }
  return operator;
}

function assertUpgradesAreNotActive(
  build: OperatorBuildDocument,
  operator: OperatorDefinition,
): void {
  if (build.potential !== 0) {
    throw new Error(
      `operator build '${build.id}' enables potential ${build.potential}, but upgrade compilation is not connected`,
    );
  }
  const activeTalent = Object.entries(build.talentStates).find(([, level]) => level > 0);
  if (activeTalent !== undefined) {
    throw new Error(
      `operator build '${build.id}' enables talent '${activeTalent[0]}', but upgrade compilation is not connected`,
    );
  }
  if (operator.eventHandlers?.length) {
    throw new Error(
      `operator '${operator.slug}' has event handlers, but operator event compilation is not connected`,
    );
  }
}

function requireSkillLevel(build: OperatorBuildDocument, levelSource: string): number {
  const level = build.skillLevels[levelSource];
  if (level === undefined) {
    throw new Error(`operator build '${build.id}' has no '${levelSource}' skill level`);
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

function compileOperatorPrograms(
  build: OperatorBuildDocument,
  operator: OperatorDefinition,
): CombatOperatorProgram {
  assertUpgradesAreNotActive(build, operator);
  const skills = operator.skillGroups.flatMap(group => {
    const skillLevel = requireSkillLevel(build, group.levelSource);
    const definitions = Array.isArray(group.skills) ? group.skills : [group.skills];
    return definitions.map(skill => {
      assertSkillCanCompile(operator, skill);
      return compileSkill({
        operatorId: build.id,
        skillGroupKey: group.key,
        skillType: group.skillType,
        skillLevel,
        skill,
      });
    });
  });
  const duplicateSkillId = skills.find(
    (skill, index) => skills.findIndex(candidate => candidate.skillId === skill.skillId) !== index,
  );
  if (duplicateSkillId !== undefined) {
    throw new Error(
      `operator '${operator.slug}' has duplicate runtime skill id '${duplicateSkillId.skillId}'`,
    );
  }
  return { operatorId: build.id, skills };
}

function assertCastUsesCatalogDefaults(cast: SkillCastDocument): void {
  const hasNestedEdits = cast.editable.scheduledSequences.some(
    scheduled =>
      scheduled.edited.length > 0 || scheduled.sequence.steps.some(step => step.edited.length > 0),
  );
  if (cast.edited.length > 0 || hasNestedEdits) {
    throw new Error(
      `skill cast '${cast.id}' contains user overrides, but per-cast program compilation is not connected`,
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
  readonly operatorBuild: OperatorBuildDocument;
  readonly operator: OperatorDefinition;
}

function compileResolvedTimelineTracks(
  tracks: readonly ResolvedTimelineTrack[],
): CompiledScenarioTimeline {
  const operators: CombatOperatorProgram[] = [];
  const pendingInputs: (ScheduledSkillInput & { readonly order: number })[] = [];
  let order = 0;

  for (const { track, operatorBuild, operator } of tracks) {
    operators.push(compileOperatorPrograms(operatorBuild, operator));
    for (const cast of track.skillCasts) {
      if (cast.editable.disabled) continue;
      assertCastUsesCatalogDefaults(cast);
      const skill = requireCastSkill(cast, operator);
      pendingInputs.push({
        frame: cast.placement.startFrame,
        operatorId: operatorBuild.id,
        skillId: skill.key,
        order,
      });
      order += 1;
    }
  }

  pendingInputs.sort((left, right) => left.frame - right.frame || left.order - right.order);
  return {
    operators,
    inputs: pendingInputs.map(({ order: _order, ...input }) => input),
  };
}

/** 使用 Build Resolver 的共享结果编译技能程序和时间轴输入。 */
export function compileResolvedScenarioTimeline(
  builds: readonly ResolvedScenarioBuild[],
): CompiledScenarioTimeline {
  return compileResolvedTimelineTracks(builds);
}

/**
 * 按轨道序号和轨道内声明顺序收集输入，再稳定地按帧排序。
 * 同帧顺序会影响资源扣费和事件处理，因此不得按干员或技能身份二次排序。
 */
export function compileScenarioTimeline(
  scenario: ScenarioDocument,
  catalog: OperatorCatalog,
): CompiledScenarioTimeline {
  const tracks: ResolvedTimelineTrack[] = [];
  const seenOperatorIds = new Set<string>();

  scenario.tracks.forEach((track, trackIndex) => {
    if (track === null) return;
    if (track.operatorBuildId === null) {
      if (track.skillCasts.length > 0) {
        throw new Error(`track ${trackIndex} has skill casts but no operator build`);
      }
      return;
    }
    const build = scenario.builds.operators[track.operatorBuildId];
    if (build === undefined) {
      throw new Error(`operator build '${track.operatorBuildId}' does not exist`);
    }
    if (seenOperatorIds.has(build.id)) {
      throw new Error(`operator build '${build.id}' is assigned to multiple tracks`);
    }
    seenOperatorIds.add(build.id);
    const operator = requireOperator(build, catalog);
    tracks.push({ track, operatorBuild: build, operator });
  });
  return compileResolvedTimelineTracks(tracks);
}
