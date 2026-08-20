/**
 * 把项目中的干员轨道和技能释放位置编译为战斗运行时可直接装配的程序与输入。
 *
 * 每个技能块先选定技能模板或自定义技能定义，再通过 `compileSkill` 编译；
 * 不再从存档快照读取时间轴。`disabled` 从 `presentation` 读取。
 * 基于干员模板的完整 `customDefinition` 会直接参与编译；只有不携带战斗定义的自由展示块失败。
 */
import type { CombatOperatorProgram } from '../combat/runtime/combatRuntimeAssembly';
import type {
  CompiledAbilityEntityChildSkillProgram,
  CompiledComboSkillRegistration,
  ResolvedActionSequence,
  ResolvedCombatStep,
  CompiledSkillProgram,
  CompiledSkillSlotGroup,
} from './combatProgram';
import type { ScheduledSkillInput } from '../combat/runtime/combatInputRuntime';
import type { GameDataRepository } from '../game-data/gameDataRepository';
import type {
  LevelValues,
  OperatorBuffDefinitions,
  OperatorDefinition,
} from '../game-data/operatorDefinition';
import type {
  OperatorInstanceDocument,
  ScenarioDocument,
  SkillCastDocument,
} from '../project/schema';
import { compileOperatorBuffDefinitions, compileSkill } from './compileSkill';
import {
  applyOperatorUpgradeSkillPatches,
  compileOperatorInitializationPrograms,
  compileOperatorUpgradeEventPrograms,
  compileOperatorPassivePrograms,
  resolveActiveOperatorUpgrades,
} from './compileOperatorUpgrades';
import type { ResolvedScenarioBuild } from './resolveScenarioBuilds';
import {
  resolveEffectiveSkillDefinition,
  type ResolvedSkillDefinition,
} from './resolveSkillDefinition';
import { deriveHitId } from '../combat/timeline/deriveHitId';

function bindChildSkillHitIds(
  childSkill: CompiledAbilityEntityChildSkillProgram,
  castId: string,
): CompiledAbilityEntityChildSkillProgram {
  return {
    ...childSkill,
    timelineActions: childSkill.timelineActions.map(action => ({
      ...action,
      sequence: bindSequenceHitIds(action.sequence, castId),
    })),
  };
}

function bindStepHitIds(step: ResolvedCombatStep, castId: string): ResolvedCombatStep {
  switch (step.kind) {
    case 'dealDamage':
    case 'dealFixedDamage':
      return step.key === undefined ? step : { ...step, hitId: deriveHitId(castId, step.key) };
    case 'conditional':
      return {
        ...step,
        whenTrue: bindSequenceHitIds(step.whenTrue, castId),
        ...(step.whenFalse === undefined
          ? {}
          : { whenFalse: bindSequenceHitIds(step.whenFalse, castId) }),
      };
    case 'once':
    case 'repeatEachTick':
    case 'forEachContextTarget':
      return { ...step, body: bindSequenceHitIds(step.body, castId) };
    case 'spawnAbilityEntity': {
      const definition = step.parameters.definition;
      if (definition === undefined) return step;
      const childSkill = definition.childSkill;
      if (childSkill === undefined) return step;
      return {
        ...step,
        parameters: {
          ...step.parameters,
          definition: {
            ...definition,
            childSkill: bindChildSkillHitIds(childSkill, castId),
          },
        },
      };
    }
    case 'startCurrentAbilityEntityChildSkill':
      return {
        ...step,
        parameters: {
          childSkill: bindChildSkillHitIds(step.parameters.childSkill, castId),
        },
      };
    case 'listenForCombatEvents':
      return {
        ...step,
        parameters: {
          responses: step.parameters.responses.map(response => ({
            ...response,
            sequence: bindSequenceHitIds(response.sequence, castId),
          })),
        },
      };
    default:
      return step;
  }
}

function bindSequenceHitIds(
  sequence: ResolvedActionSequence,
  castId: string,
): ResolvedActionSequence {
  return { steps: sequence.steps.map(step => bindStepHitIds(step, castId)) };
}

function bindProgramHitIds(program: CompiledSkillProgram, castId: string): CompiledSkillProgram {
  return {
    ...program,
    castId,
    timelineActions: program.timelineActions.map(action => ({
      ...action,
      sequence: bindSequenceHitIds(action.sequence, castId),
    })),
    ...(program.abilityEntityDefinitions === undefined
      ? {}
      : {
          abilityEntityDefinitions: Object.fromEntries(
            Object.entries(program.abilityEntityDefinitions).map(([id, definition]) => [
              id,
              definition.childSkill === undefined
                ? definition
                : {
                    ...definition,
                    childSkill: bindChildSkillHitIds(definition.childSkill, castId),
                  },
            ]),
          ),
        }),
  };
}

/** 场景时间轴进入运行时装配前的纯编译结果，不包含任何可变战斗状态。 */
export interface CompiledScenarioTimeline {
  readonly operators: readonly CombatOperatorProgram[];
  readonly inputs: readonly ScheduledSkillInput[];
}

type OperatorIndex = Pick<GameDataRepository, 'getOperator'> &
  Partial<
    Pick<GameDataRepository, 'getCommonBuffDefinitions' | 'getCommonAbilityEntityDefinitions'>
  >;

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

function resolveLevelValue(value: LevelValues, level: number, path: string): number {
  const resolved = typeof value === 'number' ? value : value[level - 1];
  if (resolved === undefined) throw new RangeError(`${path} has no value for skill level ${level}`);
  if (!Number.isFinite(resolved)) throw new TypeError(`${path} must resolve to a finite number`);
  return resolved;
}

function compileComboSkillRegistrations(
  build: OperatorInstanceDocument,
  operator: OperatorDefinition,
): readonly CompiledComboSkillRegistration[] {
  return (operator.comboSkillRegistrations ?? []).map((registration, index) => {
    const group = operator.skillGroups.find(candidate => {
      const skills = Array.isArray(candidate.skills) ? candidate.skills : [candidate.skills];
      return skills.some(skill => skill.key === registration.skillKey);
    });
    if (group === undefined) {
      throw new Error(
        `operator '${operator.slug}' combo registration ${index} references missing skill '${registration.skillKey}'`,
      );
    }
    if (group.skillType !== 'comboSkill') {
      throw new Error(
        `operator '${operator.slug}' combo registration '${registration.skillKey}' is not a combo skill`,
      );
    }
    const level = requireSkillLevel(build, group.levelSource);
    return {
      skillKey: registration.skillKey,
      priority: registration.priority,
      blackboard: Object.fromEntries(
        Object.entries(registration.blackboard ?? {}).map(([key, value]) => [
          key,
          resolveLevelValue(
            value,
            level,
            `operator '${operator.slug}'.comboSkillRegistrations[${index}].blackboard.${key}`,
          ),
        ]),
      ),
      rules: registration.rules,
    };
  });
}

/** 编译一次技能释放。等级和养成效果在这里按当前项目配置计算。 */
function compileCastSkillPrograms(
  trackId: string,
  cast: SkillCastDocument,
  resolved: ResolvedSkillDefinition,
  level: number,
  abilityEntityDefinitions: OperatorDefinition['abilityEntityDefinitions'],
): readonly CompiledSkillProgram[] {
  const definition = resolved.definition;
  const definitions = [definition, ...(resolved.group.replacementSkills ?? [])];
  return definitions.map(skill =>
    bindProgramHitIds(
      compileSkill({
        operatorId: trackId,
        skillGroupKey: resolved.group.key,
        skillType: resolved.group.skillType,
        skillLevel: level,
        skill,
        abilityEntityDefinitions,
      }),
      cast.id,
    ),
  );
}

function compileSkillSlotGroups(operator: OperatorDefinition): readonly CompiledSkillSlotGroup[] {
  return operator.skillGroups.flatMap(group => {
    const replacements = group.replacementSkills ?? [];
    if (replacements.length === 0) return [];
    const placedSkills = Array.isArray(group.skills) ? group.skills : [group.skills];
    if (placedSkills.length !== 1) {
      throw new Error(
        `operator '${operator.slug}' skill group '${group.key}' cannot combine a placed skill chain with replacement skills`,
      );
    }
    return [
      {
        skillGroupKey: group.key,
        baseSkillKey: placedSkills[0]!.key,
        replacementSkillKeys: replacements.map(skill => skill.key),
      },
    ];
  });
}

/**
 * 编译干员定义中的全部技能（已应用养成补丁，不带 castId）。
 * 资源规则等与放置无关的解析使用这份名单；放置程序由 `compileCastSkillProgram` 单独产生。
 */
export function compileOperatorDefinitionSkills(
  trackId: string,
  build: OperatorInstanceDocument,
  operator: OperatorDefinition,
  commonAbilityEntityDefinitions: OperatorDefinition['abilityEntityDefinitions'] = {},
): readonly CompiledSkillProgram[] {
  const duplicateAbilityEntityIds = [
    ...Object.keys(operator.abilityEntityDefinitions ?? {}),
  ].filter(id => id in commonAbilityEntityDefinitions);
  if (duplicateAbilityEntityIds.length > 0) {
    throw new Error(
      `operator '${operator.slug}' duplicates shared AbilityEntity definitions: ${[...new Set(duplicateAbilityEntityIds)].join(', ')}`,
    );
  }
  const abilityEntityDefinitions = {
    ...commonAbilityEntityDefinitions,
    ...operator.abilityEntityDefinitions,
  };
  const skills = operator.skillGroups.flatMap(group => {
    const skillLevel = requireSkillLevel(build, group.levelSource);
    const definitions = [
      ...(Array.isArray(group.skills) ? group.skills : [group.skills]),
      ...(group.replacementSkills ?? []),
    ];
    return definitions.map(skill => {
      return compileSkill({
        operatorId: trackId,
        skillGroupKey: group.key,
        skillType: group.skillType,
        skillLevel,
        skill,
        abilityEntityDefinitions,
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
  commonBuffDefinitions?: OperatorBuffDefinitions,
  commonAbilityEntityDefinitions: OperatorDefinition['abilityEntityDefinitions'] = {},
): CompiledScenarioTimeline {
  const operators: CombatOperatorProgram[] = [];
  const pendingInputs: (ScheduledSkillInput & { readonly order: number })[] = [];
  let order = 0;
  const compiledCommonBuffDefinitions = compileOperatorBuffDefinitions(commonBuffDefinitions);

  for (const { track, operatorInstance, operator } of tracks) {
    const duplicateAbilityEntityIds = [
      ...Object.keys(operator.abilityEntityDefinitions ?? {}),
    ].filter(id => id in commonAbilityEntityDefinitions);
    if (duplicateAbilityEntityIds.length > 0) {
      throw new Error(
        `operator '${operator.slug}' duplicates shared AbilityEntity definitions: ${[...new Set(duplicateAbilityEntityIds)].join(', ')}`,
      );
    }
    const abilityEntityDefinitions = {
      ...commonAbilityEntityDefinitions,
      ...operator.abilityEntityDefinitions,
    };
    const activeUpgrades = resolveActiveOperatorUpgrades(operatorInstance, operator);
    const skills: CompiledSkillProgram[] = [];
    for (const cast of track.skillCasts) {
      if (cast.presentation?.disabled) continue;
      if (cast.source.kind === 'custom') {
        throw new Error(
          `skill cast '${cast.id}' is a presentation-only custom action without a SkillDefinition`,
        );
      }
      const resolved = resolveEffectiveSkillDefinition(cast, operator);
      const level = requireSkillLevel(operatorInstance, resolved.group.levelSource);
      skills.push(
        ...compileCastSkillPrograms(track.id, cast, resolved, level, abilityEntityDefinitions),
      );
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
    const compiledSkills = applyOperatorUpgradeSkillPatches(skills, activeUpgrades);
    const compiledOperatorBuffDefinitions = compileOperatorBuffDefinitions(
      operator.buffDefinitions,
    );
    const duplicateBuffIds = Object.keys(compiledOperatorBuffDefinitions).filter(
      buffId => buffId in compiledCommonBuffDefinitions,
    );
    if (duplicateBuffIds.length > 0) {
      throw new Error(
        `operator '${operator.slug}' duplicates shared Buff definitions: ${duplicateBuffIds.join(', ')}`,
      );
    }
    const buffDefinitions = {
      ...compiledCommonBuffDefinitions,
      ...compiledOperatorBuffDefinitions,
    };
    operators.push({
      operatorId: track.id,
      ...(Object.keys(buffDefinitions).length === 0 ? {} : { buffDefinitions }),
      comboSkillRegistrations: compileComboSkillRegistrations(operatorInstance, operator),
      skillSlotGroups: compileSkillSlotGroups(operator),
      initializationPrograms: compileOperatorInitializationPrograms(activeUpgrades),
      passivePrograms: compileOperatorPassivePrograms(activeUpgrades),
      upgradeEventPrograms: compileOperatorUpgradeEventPrograms(activeUpgrades),
      skills: compiledSkills,
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
  commonBuffDefinitions?: OperatorBuffDefinitions,
  commonAbilityEntityDefinitions?: OperatorDefinition['abilityEntityDefinitions'],
): CompiledScenarioTimeline {
  const tracks = builds.map(build => ({
    track: build.track,
    operatorInstance: build.operatorInstance,
    operator: build.operator,
  }));
  return compileResolvedTimelineTracks(
    tracks,
    commonBuffDefinitions,
    commonAbilityEntityDefinitions,
  );
}

/**
 * 按轨道序号和轨道内声明顺序收集实际帧输入，再稳定地按帧排序。
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
  return compileResolvedTimelineTracks(
    tracks,
    index.getCommonBuffDefinitions?.(),
    index.getCommonAbilityEntityDefinitions?.(),
  );
}
