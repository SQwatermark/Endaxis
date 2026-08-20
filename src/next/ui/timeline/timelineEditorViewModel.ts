/**
 * 将新版存档和只读干员定义投影为时间轴 UI 的稳定读取模型。
 * 这里不保存编辑状态、不翻译文本，也不调用战斗模拟；组件只能把身份交给 i18n 和命令层处理。
 */
import type { OperatorDefinition, SkillType } from '../../core/game-data/operatorDefinition';
import type {
  DefinitionActionSource,
  ScenarioDocument,
  SkillCastDocument,
  TrackIndex,
} from '../../core/project/schema';
import {
  resolveEffectiveSkillDefinition,
  type ResolvedSkillDefinition,
} from '../../core/compiler/resolveSkillDefinition';
import { projectOperatorSupport, type OperatorSupportViewModel } from './operatorSupportViewModel';
import { projectCastHitMarkers, type TimelineHitMarker } from './timelineHitProjection';

/** UI 投影读取干员定义的最小端口。 */
export interface TimelineOperatorIndex {
  getOperator(slug: string): OperatorDefinition | null;
}

/** 技能库中一次拖放所代表的单个技能或有序技能链。 */
export interface TimelineSkillLibraryEntryViewModel {
  readonly skillGroupKey: string;
  readonly skillType: SkillType;
  readonly level: number;
  readonly skills: readonly {
    readonly skillKey: string;
    readonly timelineBlockFrames: number;
    readonly source: Extract<DefinitionActionSource, { kind: 'operatorSkill' }>;
  }[];
}

/** 已放置技能块的稳定身份与几何输入。 */
export interface TimelineSkillCastViewModel {
  readonly id: string;
  readonly startFrame: number;
  readonly durationFrames: number;
  readonly source: SkillCastDocument['source'];
  readonly skillType: SkillType | null;
  /** 已投影的命中点；UI 直接消费，不再从存档或定义重新推算。 */
  readonly hitMarkers: readonly TimelineHitMarker[];
  readonly disabled: boolean;
  readonly locked: boolean;
  readonly edited: boolean;
  readonly color?: string | null;
}

/** 一条轨道在编辑器中需要的定义身份、技能库和已放置动作。 */
export interface TimelineTrackViewModel {
  readonly trackIndex: TrackIndex;
  readonly operatorInstanceId: string | null;
  readonly operatorSlug: string | null;
  readonly operatorSupport: OperatorSupportViewModel | null;
  readonly initialUltimateEnergy: number;
  readonly maxUltimateEnergy: number | null;
  readonly skillLibrary: readonly TimelineSkillLibraryEntryViewModel[];
  readonly skillCasts: readonly TimelineSkillCastViewModel[];
  readonly issues: readonly string[];
}

/**
 * 从终结技定义中解析能量上限。原生资源上限与终结技消耗一致；若定义缺失或出现多个不同
 * 消耗值，则保持未知并交给后续资源规则解析器处理，UI 不自行猜测。
 */ export function resolveOperatorMaxUltimateEnergy(
  operator: OperatorDefinition,
  skillLevel: number,
): number | null {
  const values = new Set<number>();
  for (const group of operator.skillGroups) {
    if (group.skillType !== 'ultimate') continue;
    const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
    for (const skill of skills) {
      for (const cost of skill.costs ?? []) {
        if (cost.resource !== 'ultimateEnergy') continue;
        const value = typeof cost.value === 'number' ? cost.value : cost.value[skillLevel - 1];
        if (value !== undefined) values.add(value);
      }
    }
  }
  return values.size === 1 ? [...values][0]! : null;
}

/** 时间轴页面的一次只读投影；模拟结果会在后续作为独立投影并入。 */
export interface TimelineEditorViewModel {
  readonly scenarioId: string;
  readonly scenarioName: string;
  readonly prepFrames: number;
  readonly durationFrames: number;
  readonly tracks: readonly TimelineTrackViewModel[];
}

function projectSkillCast(
  skillCast: SkillCastDocument,
  resolved: ResolvedSkillDefinition | null,
  issues: string[],
  abilityEntityDefinitions?: OperatorDefinition['abilityEntityDefinitions'],
): TimelineSkillCastViewModel {
  const source = skillCast.source;
  const skillType = resolved?.group.skillType ?? null;
  if (source.kind === 'operatorSkill' && skillType === null) {
    issues.push(`missing skill group '${source.skillGroupKey}' for cast '${skillCast.id}'`);
  }
  return {
    id: skillCast.id,
    startFrame: skillCast.placement.startFrame,
    durationFrames: resolved !== null ? resolved.definition.timelineBlockFrames : 0,
    source: skillCast.source,
    skillType,
    hitMarkers:
      resolved !== null
        ? projectCastHitMarkers(skillCast, resolved.definition, abilityEntityDefinitions)
        : [],
    disabled: skillCast.presentation?.disabled ?? false,
    locked: skillCast.presentation?.locked ?? false,
    edited: skillCast.customDefinition !== undefined,
    ...(skillCast.presentation?.color === undefined ? {} : { color: skillCast.presentation.color }),
  };
}

function projectTrack(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  index: TimelineOperatorIndex,
): TimelineTrackViewModel {
  const track = scenario.tracks[trackIndex];
  if (track === null) {
    return {
      trackIndex,
      operatorInstanceId: null,
      operatorSlug: null,
      operatorSupport: null,
      initialUltimateEnergy: 0,
      maxUltimateEnergy: null,
      skillLibrary: [],
      skillCasts: [],
      issues: [],
    };
  }

  const issues: string[] = [];
  const operatorInstance = track.operator;
  if (track.operator === null) {
    issues.push(`missing operator instance`);
  }
  const operator =
    operatorInstance === null ? null : index.getOperator(operatorInstance.operatorSlug);
  if (operatorInstance !== null && operator === null) {
    issues.push(`missing operator definition '${operatorInstance.operatorSlug}'`);
  }

  const skillLibrary =
    operator === null || operatorInstance === null
      ? []
      : operator.skillGroups.map(group => {
          const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
          return {
            skillGroupKey: group.key,
            skillType: group.skillType,
            level: operatorInstance.skillLevels[group.levelSource] ?? 1,
            skills: skills.map(skill => ({
              skillKey: skill.key,
              timelineBlockFrames: skill.timelineBlockFrames,
              source: {
                kind: 'operatorSkill' as const,
                skillGroupKey: group.key,
                skillKey: skill.key,
              },
            })),
          };
        });

  const skillCasts = track.skillCasts.map(skillCast => {
    const resolved =
      operator !== null && operatorInstance !== null
        ? resolveEffectiveSkillDefinition(skillCast, operator)
        : null;
    return projectSkillCast(skillCast, resolved, issues, operator?.abilityEntityDefinitions);
  });

  return {
    trackIndex,
    operatorInstanceId: track.id,
    operatorSlug: operatorInstance?.operatorSlug ?? null,
    operatorSupport: operator === null ? null : projectOperatorSupport(operator),
    initialUltimateEnergy: track.initialState.ultimateEnergy,
    maxUltimateEnergy:
      track.initialState.maxUltimateEnergyOverride ??
      (operator === null || operatorInstance === null
        ? null
        : resolveOperatorMaxUltimateEnergy(operator, operatorInstance.skillLevels.ultimate ?? 1)),
    skillLibrary,
    skillCasts,
    issues,
  };
}

/** 从一个场景生成不含任何可变引用的时间轴页面模型。 */
export function projectTimelineEditor(
  scenario: ScenarioDocument,
  index: TimelineOperatorIndex,
): TimelineEditorViewModel {
  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    prepFrames: scenario.battle.prepFrames,
    durationFrames: scenario.battle.durationFrames,
    tracks: ([0, 1, 2, 3] as const).map(trackIndex => projectTrack(scenario, trackIndex, index)),
  };
}
