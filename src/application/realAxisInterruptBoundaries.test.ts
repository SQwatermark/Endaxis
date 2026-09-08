import { expect, it } from 'vitest';
import { createEmptyScenario } from '../core/project/createProject';
import type { TrackDocument } from '../core/project/schema';
import { createEditorSimulationService } from './editorSimulationService';

const boundaries: readonly {
  slug: string;
  current: string;
  next: string;
  group: string;
  gap: number;
  nextGroup?: string;
  withTangtang?: boolean;
}[] = [
  { slug: 'mifu', current: 'basicAttack1', next: 'basicAttack2', group: 'basicAttack', gap: 8 },
  { slug: 'rossi', current: 'basicAttack4', next: 'basicAttack5', group: 'basicAttack', gap: 32 },
  { slug: 'arcane', current: 'basicAttack2', next: 'basicAttack3', group: 'basicAttack', gap: 13 },
  { slug: 'arcane', current: 'basicAttack3', next: 'basicAttack4', group: 'basicAttack', gap: 22 },
  { slug: 'arcane', current: 'basicAttack5', next: 'basicAttack1', group: 'basicAttack', gap: 42 },
  { slug: 'arcane', current: 'ultimate', next: 'basicAttack1', group: 'ultimate', gap: 73 },
  {
    slug: 'arcane',
    current: 'comboSkill',
    next: 'finisher',
    group: 'comboSkill',
    nextGroup: 'finisher',
    gap: 46,
    withTangtang: true,
  },
  {
    slug: 'arcane',
    current: 'finisher',
    next: 'arcana',
    group: 'finisher',
    nextGroup: 'ultimate',
    gap: 51,
  },
];

it.each(boundaries)(
  '$slug $current→$next：旧间隔 $gap 告警但保留输入，留足时间后可接续',
  async ({ slug, current, next, group, gap, nextGroup = 'basicAttack', withTangtang = false }) => {
    const service = createEditorSimulationService();
    for (const interval of [gap, 300]) {
      const startFrame = next === 'arcana' ? 310 : 10;
      const scenario = createEmptyScenario('interrupt-boundary', '原轴接续边界');
      const track: TrackDocument = {
        id: slug,
        operator: {
          operatorSlug: slug,
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
        skillCasts: [
          {
            id: 'first',
            source: { kind: 'operatorSkill', skillGroupKey: group, skillKey: current },
            placement: { startFrame },
          },
          {
            id: 'next',
            source: { kind: 'operatorSkill', skillGroupKey: nextGroup, skillKey: next },
            placement: { startFrame: startFrame + interval },
          },
        ],
      };
      scenario.tracks[0] = track;
      if (next === 'arcana') {
        track.skillCasts.unshift({
          id: 'activate',
          source: { kind: 'operatorSkill', skillGroupKey: 'ultimate', skillKey: 'ultimate' },
          placement: { startFrame: 1 },
        });
      }
      if (withTangtang) {
        scenario.tracks[1] = {
          ...structuredClone(track),
          id: 'tangtang',
          operator: { ...track.operator!, operatorSlug: 'tangtang' },
          skillCasts: [
            {
              id: 'teammate',
              source: {
                kind: 'operatorSkill',
                skillGroupKey: 'comboSkill',
                skillKey: 'comboSkill',
              },
              placement: { startFrame: 18 },
            },
          ],
        };
      }
      const before = structuredClone(scenario);
      const run = await service.simulate(scenario, startFrame + interval + 150);
      const blocked = run.receiptEntries.filter(
        e => e.event === 'SkillInputCannotInterruptCurrentSkill' && e.data?.castId === 'next',
      );
      expect(blocked).toHaveLength(interval === gap ? 1 : 0);
      if (blocked.length) expect(blocked[0]?.data?.currentSkillId).toBe(current);
      expect(
        run.receiptEntries.find(
          e => e.event === 'SkillInputProcessed' && e.data?.castId === 'next',
        ),
      ).toMatchObject({ frame: startFrame + interval, data: { accepted: true, skillId: next } });
      expect(scenario).toEqual(before);
    }
  },
);
