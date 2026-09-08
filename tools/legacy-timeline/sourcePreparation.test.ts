import { expect, it } from 'vitest';
import { prepareLegacySource, type ConversionMappings } from './sourcePreparation';
const source = { skillId: 'battleSkill', sourceSkillKey: 'battleSkill', type: 'battleSkill' };
const target = {
  kind: 'operatorSkill',
  skillGroupKey: 'battleSkill',
  skillKey: 'battleSkill',
} as const;
const mappings: ConversionMappings = {
  operators: { old: 'perlica' },
  skills: { old: [{ source, target }] },
  weapons: { oldWeapon: 'wpn_sword_0022' },
  gears: { oldGear: 'item_equip_example' },
};
function input() {
  return {
    version: '1.0.0',
    timeUnit: 'frame',
    fps: 60,
    scenarioList: [
      {
        id: 's',
        data: {
          systemConstants: { staggerBreakDuration: 600 },
          battleDuration: 7200,
          tracks: [{ id: 'old', actions: [{ ...source, startTime: 623, logicalStartTime: 623 }] }],
          operators: [{ operatorSlug: 'old' }],
          weapons: [{ weaponSlug: 'oldWeapon' }],
          gears: [{ gearPieceId: 'oldGear' }],
        },
      },
    ],
  };
}
it('maps four identity categories and quantizes source frames without modifying input', () => {
  const value = input();
  const before = JSON.stringify(value);
  const result = prepareLegacySource(value, mappings);
  const d = result.source.scenarioList[0].data;
  expect(result.issues).toEqual([]);
  expect(d.tracks[0].id).toBe('perlica');
  expect(d.operators[0].operatorSlug).toBe('perlica');
  expect(d.tracks[0].actions[0].convertedSource).toEqual(target);
  expect(d.weapons[0].weaponSlug).toBe('wpn_sword_0022');
  expect(d.gears[0].gearPieceId).toBe('item_equip_example');
  expect(d.tracks[0].actions[0].startTime).toBe(312);
  expect(d.battleDuration).toBe(3600);
  expect(d.systemConstants.staggerBreakDuration).toBe(300);
  expect(JSON.stringify(value)).toBe(before);
});
it('does not guess missing, duplicate, segmented or variant skill mappings', () => {
  expect(prepareLegacySource(input()).unresolvedSkills).toHaveLength(1);
  expect(
    prepareLegacySource(input(), {
      skills: {
        old: [
          { source, target },
          { source, target },
        ],
      },
    }).issues[0]?.message,
  ).toContain('不唯一');
  for (const field of [{ segmentIndex: 2 }, { variantKey: 'enhanced' }]) {
    const value = input();
    Object.assign(value.scenarioList[0]!.data.tracks[0]!.actions[0]!, field);
    expect(prepareLegacySource(value, mappings).unresolvedSkills).toHaveLength(1);
  }
});
it('supports audited per-action overrides and blocks nonempty unsupported user settings', () => {
  expect(prepareLegacySource(input(), { actions: { 's/0/0': target } }).unresolvedSkills).toEqual(
    [],
  );
  const value = input();
  Object.assign(value.scenarioList[0]!.data, { characterOverrides: { old: { hp: 1 } } });
  expect(prepareLegacySource(value, mappings).issues[0]?.path).toContain('characterOverrides');
});
it('rejects unknown time units and reports differing logical/display times', () => {
  const value = input();
  value.fps = 0;
  expect(() => prepareLegacySource(value)).toThrow('fps');
  value.fps = 60;
  value.scenarioList[0]!.data.tracks[0]!.actions[0]!.logicalStartTime = 600;
  expect(prepareLegacySource(value, mappings).issues[0]?.message).toContain('起点不同');
});

it('rebases absolute times before rounding and leaves durations unchanged', () => {
  const value = input();
  Object.assign(value.scenarioList[0]!.data, {
    prepDuration: 299,
    simulationStartline: 299,
    simulationEndline: 4762,
    cycleBoundaries: [{ time: 600 }],
    switchEvents: [{ time: 298, trackIndex: 1 }],
  });
  const action = value.scenarioList[0]!.data.tracks[0]!.actions[0]!;
  action.startTime = action.logicalStartTime = 302;
  const result = prepareLegacySource(value, mappings);
  const d = result.source.scenarioList[0].data;
  expect(d.prepDuration).toBe(150);
  expect(d.battleDuration).toBe(3600);
  expect(d.systemConstants.staggerBreakDuration).toBe(300);
  expect(d.tracks[0].actions[0].startTime).toBe(2);
  expect(d.simulationStartline).toBe(0);
  expect(d.simulationEndline).toBe(2232);
  expect(d.cycleBoundaries[0].time).toBe(151);
  expect(d.switchEvents[0].time).toBe(-0);
  expect(result.times.find(t => t.path.endsWith('actions[0].startTime'))?.sourceOrigin).toBe(299);
});
