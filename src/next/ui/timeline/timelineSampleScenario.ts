/**
 * Next 时间轴的可交互样本项目。
 *
 * Arclight 终结技直接引用当前生成定义，其中的能力实体与子技能时间线来自
 * 版本化生成证据；这里不复制或改写游戏规则，只提供一个可立即打开的技能块。
 */
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioDocument, TrackIndex } from '../../core/project/schema';
import { arclight, perlica } from '../../data/operators';

export const ABILITY_ENTITY_SAMPLE_TRACK_INDEX = 1 satisfies TrackIndex;
export const ABILITY_ENTITY_SAMPLE_CAST_ID = 'skillCast:next-sample:arclight-ultimate';

export function createTimelineSampleScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('next-sample:scenario:1', 'Next');
  scenario.battle.durationFrames = 900;
  scenario.tracks[0] = {
    id: 'track:next-sample:perlica',
    operator: {
      operatorSlug: perlica.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  scenario.tracks[ABILITY_ENTITY_SAMPLE_TRACK_INDEX] = {
    id: 'track:next-sample:arclight',
    operator: {
      operatorSlug: arclight.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 90 },
    skillCasts: [
      {
        id: ABILITY_ENTITY_SAMPLE_CAST_ID,
        source: { kind: 'operatorSkill', skillGroupKey: 'ultimate', skillKey: 'ultimate' },
        placement: { startFrame: 30 },
        // 该生成技能可正常进入定义编辑器；模拟侧仍有已知的零倍率终结技时间停滞，
        // 示例默认禁用执行，避免把既有运行时故障伪装成编辑器故障。
        presentation: { disabled: true },
      },
    ],
  };
  return scenario;
}
