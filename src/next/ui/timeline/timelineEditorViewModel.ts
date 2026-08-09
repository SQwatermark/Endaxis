/**
 * 将新版项目文档和只读干员目录投影为时间轴 UI 的稳定读取模型。
 * 这里不保存编辑状态、不翻译文本，也不调用战斗模拟；组件只能把身份交给 i18n 和命令层处理。
 */
import type { OperatorDefinition, SkillType } from '../../core/game-data/operatorDefinition';
import type {
  CatalogActionSource,
  ScenarioDocument,
  SkillCastDocument,
  TrackIndex,
} from '../../core/project/schema';

/** UI 投影读取干员目录的最小端口。 */
export interface TimelineOperatorCatalog {
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
    readonly source: Extract<CatalogActionSource, { kind: 'operatorSkill' }>;
  }[];
}

/** 已放置技能块的稳定身份与几何输入。 */
export interface TimelineSkillCastViewModel {
  readonly id: string;
  readonly startFrame: number;
  readonly durationFrames: number;
  readonly source: SkillCastDocument['source'];
  readonly disabled: boolean;
  readonly locked: boolean;
  readonly color?: string | null;
}

/** 一条轨道在编辑器中需要的目录身份、技能库和已放置动作。 */
export interface TimelineTrackViewModel {
  readonly trackIndex: TrackIndex;
  readonly operatorBuildId: string | null;
  readonly operatorSlug: string | null;
  readonly skillLibrary: readonly TimelineSkillLibraryEntryViewModel[];
  readonly skillCasts: readonly TimelineSkillCastViewModel[];
  readonly issues: readonly string[];
}

/** 时间轴页面的一次只读投影；模拟结果会在后续作为独立投影并入。 */
export interface TimelineEditorViewModel {
  readonly scenarioId: string;
  readonly scenarioName: string;
  readonly prepFrames: number;
  readonly durationFrames: number;
  readonly tracks: readonly TimelineTrackViewModel[];
}

function projectSkillCast(skillCast: SkillCastDocument): TimelineSkillCastViewModel {
  return {
    id: skillCast.id,
    startFrame: skillCast.placement.startFrame,
    durationFrames: skillCast.editable.durationFrames,
    source: skillCast.source,
    disabled: skillCast.editable.disabled,
    locked: skillCast.editable.locked,
    ...(skillCast.editable.color === undefined ? {} : { color: skillCast.editable.color }),
  };
}

function projectTrack(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  catalog: TimelineOperatorCatalog,
): TimelineTrackViewModel {
  const track = scenario.tracks[trackIndex];
  if (track === null) {
    return {
      trackIndex,
      operatorBuildId: null,
      operatorSlug: null,
      skillLibrary: [],
      skillCasts: [],
      issues: [],
    };
  }

  const issues: string[] = [];
  const operatorBuild =
    track.operatorBuildId === null
      ? null
      : (scenario.builds.operators[track.operatorBuildId] ?? null);
  if (track.operatorBuildId !== null && operatorBuild === null) {
    issues.push(`missing operator build '${track.operatorBuildId}'`);
  }
  const operator = operatorBuild === null ? null : catalog.getOperator(operatorBuild.operatorSlug);
  if (operatorBuild !== null && operator === null) {
    issues.push(`missing operator definition '${operatorBuild.operatorSlug}'`);
  }

  const skillLibrary =
    operator === null || operatorBuild === null
      ? []
      : operator.skillGroups.map(group => {
          const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
          return {
            skillGroupKey: group.key,
            skillType: group.skillType,
            level: operatorBuild.skillLevels[group.levelSource] ?? 1,
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

  return {
    trackIndex,
    operatorBuildId: track.operatorBuildId,
    operatorSlug: operatorBuild?.operatorSlug ?? null,
    skillLibrary,
    skillCasts: track.skillCasts.map(projectSkillCast),
    issues,
  };
}

/** 从一个场景生成不含任何可变引用的时间轴页面模型。 */
export function projectTimelineEditor(
  scenario: ScenarioDocument,
  catalog: TimelineOperatorCatalog,
): TimelineEditorViewModel {
  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    prepFrames: scenario.battle.prepFrames,
    durationFrames: scenario.battle.durationFrames,
    tracks: ([0, 1, 2, 3] as const).map(trackIndex => projectTrack(scenario, trackIndex, catalog)),
  };
}
