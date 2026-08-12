/**
 * 把项目中的干员轨道和技能释放位置编译为战斗运行时可直接装配的程序与输入。
 *
 * 每个技能块先选定技能模板或自定义技能定义，再通过 `compileSkill` 编译；
 * 不再从存档快照读取时间轴。`disabled` 从 `presentation` 读取。
 * 尚未闭环的逐次释放编辑仍显式失败。
 */
import type { CombatOperatorProgram } from '../combat/runtime/combatRuntimeAssembly';
import type { CompiledSkillProgram } from './combatProgram';
import type { ScheduledSkillInput } from '../combat/runtime/combatInputRuntime';
import type { GameDataRepository } from '../game-data/gameDataRepository';
import type { OperatorDefinition, SkillDefinition } from '../game-data/operatorDefinition';
import type {
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
import {
  resolveEffectiveSkillDefinition,
  type ResolvedSkillDefinition,
} from './resolveSkillDefinition';

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

function assertSkillCanCompile(definition: SkillDefinition): void {
  if (definition.eventHandlers?.length) {
    throw new Error(`skill has event handlers, but skill event compilation is not connected`);
  }
}

/** 编译一次技能释放。等级和养成效果在这里按当前项目配置计算。 */
function compileCastSkillProgram(
  trackId: string,
  cast: SkillCastDocument,
  resolved: ResolvedSkillDefinition,
  level: number,
): CompiledSkillProgram {
  const definition = resolved.definition;
  assertSkillCanCompile(definition);
  const base = compileSkill({
    operatorId: trackId,
    skillGroupKey: resolved.group.key,
    skillType: resolved.group.skillType,
    skillLevel: level,
    skill: definition,
  });
  return {
    ...base,
    castId: cast.id,
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
      assertSkillCanCompile(skill);
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
      if (cast.presentation?.disabled) continue;
      if (cast.source.kind === 'custom') {
        throw new Error(`skill cast '${cast.id}' uses unsupported source kind 'custom'`);
      }
      const resolved = resolveEffectiveSkillDefinition(cast, operator);
      const level = requireSkillLevel(operatorInstance, resolved.group.levelSource);
      skills.push(compileCastSkillProgram(track.id, cast, resolved, level));
      pendingInputs.push({
        frame: cast.placement.startFrame,
        operatorId: track.id,
        skillId: resolved.definition.key,
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
