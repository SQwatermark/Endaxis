import { describe, expect, it, vi } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { ScenarioEditorSession } from './scenarioEditorSession';

describe('ScenarioEditorSession', () => {
  it('把一次有效命令记录为一次会话修订', () => {
    const initial = createEmptyScenario('scenario:1', '初始场景');
    const session = new ScenarioEditorSession(initial);

    expect(
      session.commit('renameScenario', scenario => ({ ...scenario, name: '修改后场景' })),
    ).toBe(true);
    expect(session.snapshot).toMatchObject({
      revision: 1,
      lastCommand: 'renameScenario',
      scenario: { name: '修改后场景' },
    });
    expect(initial.name).toBe('初始场景');
  });

  it('无变化命令不会制造历史修订或通知', () => {
    const session = new ScenarioEditorSession(createEmptyScenario('scenario:1', '场景'));
    const subscriber = vi.fn();
    session.subscribe(subscriber);

    expect(session.commit('noop', scenario => scenario)).toBe(false);
    expect(session.snapshot.revision).toBe(0);
    expect(subscriber).not.toHaveBeenCalled();
  });

  it('只通知仍处于订阅状态的消费者', () => {
    const session = new ScenarioEditorSession(createEmptyScenario('scenario:1', '场景'));
    const subscriber = vi.fn();
    const unsubscribe = session.subscribe(subscriber);

    session.commit('extendBattle', scenario => ({
      ...scenario,
      battle: { ...scenario.battle, durationFrames: 60 },
    }));
    unsubscribe();
    session.commit('extendBattleAgain', scenario => ({
      ...scenario,
      battle: { ...scenario.battle, durationFrames: 90 },
    }));

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber.mock.calls[0]?.[0].revision).toBe(1);
  });
});
