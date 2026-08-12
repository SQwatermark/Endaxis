/**
 * 把新版干员定义中的技能库条目转换为存档中的稳定放置数据。
 * 本层只生成定义默认值和身份，不执行模拟；调用方必须提供可进入撤销历史的稳定 ID 分配器。
 */
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import type { ScenarioDocument, SkillCastDocument, TrackIndex } from '../../core/project/schema';

/** 放置命令生成稳定文档身份所需的端口。 */
export type TimelineDocumentIdKind =
  'track' | 'skillCast' | 'scheduledSequence' | 'hit' | 'customBar' | 'connection';

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

/**
 * 按技能组声明顺序放置一个技能或技能链。
 * 多段普攻等序列以前一段块宽为下一段起点，不擅自加入动画空隙。
 * 不展开 `LevelValues`，不预编译；技能定义在编译时按当前等级重新解析。
 */
export function placeSkillGroup(input: PlaceSkillGroupInput): PlaceSkillGroupResult {
  if (!Number.isInteger(input.startFrame) || input.startFrame < 0) {
    throw new RangeError('startFrame must be a non-negative integer');
  }
  const track = input.scenario.tracks[input.trackIndex];
  if (track === null) throw new Error(`track ${input.trackIndex} is empty`);
  const operatorInstance = track.operator;
  if (operatorInstance === null)
    throw new Error(`track ${input.trackIndex} has no operator instance`);
  if (operatorInstance.operatorSlug !== input.operator.slug) {
    throw new Error(
      `track '${track.id}' operator references '${operatorInstance.operatorSlug}', not '${input.operator.slug}'`,
    );
  }
  const group = input.operator.skillGroups.find(candidate => candidate.key === input.skillGroupKey);
  if (group === undefined) {
    throw new Error(
      `operator '${input.operator.slug}' has no skill group '${input.skillGroupKey}'`,
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
  const created: SkillCastDocument[] = [];
  let nextStartFrame = input.startFrame;

  skills.forEach(skill => {
    const skillCastId = input.ids.allocate('skillCast');
    created.push({
      id: skillCastId,
      source: { kind: 'operatorSkill', skillGroupKey: group.key, skillKey: skill.key },
      placement: { startFrame: nextStartFrame },
    });
    nextStartFrame += skill.timelineBlockFrames;
  });

  const tracks = [...input.scenario.tracks] as ScenarioDocument['tracks'];
  tracks[input.trackIndex] = { ...track, skillCasts: [...track.skillCasts, ...created] };
  return {
    scenario: { ...input.scenario, tracks },
    skillCastIds: created.map(skillCast => skillCast.id),
  };
}
