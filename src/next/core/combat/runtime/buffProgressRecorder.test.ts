import { describe, expect, it } from 'vitest';
import type { CombatBuff } from '../buffs/combatBuffs';
import { BuffProgressRecorder } from './buffProgressRecorder';

describe('BuffProgressRecorder', () => {
  it('compresses linear samples while preserving a paused interval', () => {
    const recorder = new BuffProgressRecorder();
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
        showInHpBar: false,
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
    const recorder = new BuffProgressRecorder();
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

  it('records Buffs used only by the main-character HP bar progress', () => {
    const recorder = new BuffProgressRecorder();
    const buff = {
      instanceId: 9,
      remainingDuration: 3,
      isFinished: false,
    } as CombatBuff<string>;
    recorder.register('operator:2', buff, 'buff:hp-progress', { showProgressInHpBar: true }, 4);

    expect(recorder.snapshot()[0]).toMatchObject({
      targetId: 'operator:2',
      buffId: 'buff:hp-progress',
      showInBattleSkillButton: false,
      showInUltimateButton: false,
      showInHpBar: true,
      points: [{ frame: 4, ratio: 1 }],
    });
  });
});
