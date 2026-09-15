import { expect, it } from 'vitest';
import { skillRuntimeIdentityFields, skillRuntimeTimingFields } from './skillRootInspectorFields';
import type { SkillDefinition } from '../../../../core/game-data/operatorDefinition';
it('edits runtime identity and timings without rewriting display width or other skill data', () => {
  const value: SkillDefinition = {
    key: 'custom',
    timelineBlockFrames: 25,
    scheduledSequences: [],
    blackboard: { value: [1, 2] },
  };
  const duration = skillRuntimeTimingFields.find(x => x.key === 'naturalDurationFrames')!;
  expect(duration.write(value, 60)).toEqual({ ...value, naturalDurationFrames: 60 });
  expect(duration.toggle({ ...value, naturalDurationFrames: 60 }, false)).toEqual({
    ...value,
    naturalDurationFrames: undefined,
  });
  const source = skillRuntimeIdentityFields.find(x => x.key === 'sourceSkillId')!;
  expect(source.write(value, 'native-id')).toEqual({ ...value, sourceSkillId: 'native-id' });
  expect(value).not.toHaveProperty('nativeSkillType');
  const cooldown = skillRuntimeTimingFields.find(x => x.key === 'cooldownFrames')!;
  expect(cooldown.write(value, [90, 60, 30])).toEqual({ ...value, cooldownFrames: [90, 60, 30] });
  expect(
    cooldown.toggle({ ...value, cooldownFrames: [90, 60, 30] }, false).cooldownFrames,
  ).toBeUndefined();
});
