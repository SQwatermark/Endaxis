import { describe, expect, it } from 'vitest';
import type { CombatBuff } from '../buffs/combatBuffs';
import { SkillButtonProgressRecorder } from './skillButtonProgressRecorder';

describe('SkillButtonProgressRecorder', () => {
  it('compresses linear samples while preserving a paused interval', () => {
    const recorder = new SkillButtonProgressRecorder();
    const state = { instanceId: 7, remainingDuration: 1, isFinished: false };
    const buff = state as CombatBuff<string>;
    recorder.register(
      'operator:1',
      buff,
      'buff:progress',
      {
        showProgressInNormalSkillButton: true,
        useWeakProgressInNormalSkillButton: true,
      },
      0,
    );
    state.remainingDuration = 0.9;
    recorder.sample('operator:1', [buff], 1);
    state.remainingDuration = 0.8;
    recorder.sample('operator:1', [buff], 2);
    recorder.register(
      'operator:1',
      buff,
      'buff:progress',
      { showProgressInNormalSkillButton: true },
      2,
    );
    recorder.sample('operator:1', [buff], 3);
    state.remainingDuration = 0.7;
    recorder.sample('operator:1', [buff], 4);

    expect(recorder.snapshot()).toEqual([
      {
        targetId: 'operator:1',
        buffId: 'buff:progress',
        instanceId: 7,
        showInBattleSkillButton: true,
        showInUltimateButton: false,
        weakBattleSkillStyle: true,
        points: [
          { frame: 0, ratio: 1 },
          { frame: 2, ratio: 0.8 },
          { frame: 3, ratio: 0.8 },
          { frame: 4, ratio: 0.7 },
        ],
      },
    ]);
  });

  it('records a zero endpoint when the runtime Buff finishes', () => {
    const recorder = new SkillButtonProgressRecorder();
    const buff = {
      instanceId: 3,
      remainingDuration: 2,
      isFinished: false,
    } as CombatBuff<string>;
    recorder.register(
      'operator:1',
      buff,
      'buff:ultimate-progress',
      { showProgressInUltimateSkillButton: true },
      5,
    );
    recorder.finish('operator:1', buff, 65);
    expect(recorder.snapshot()[0]?.points).toEqual([
      { frame: 5, ratio: 1 },
      { frame: 65, ratio: 0 },
    ]);
  });
});
