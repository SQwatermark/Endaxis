import { describe, expect, it } from 'vitest';
import { SimulationRandomSource, type SimulationRandomSettings } from './simulationRandom';
import { createSimulationRandomState } from './simulationRandomState';

function createSource(settings: SimulationRandomSettings): SimulationRandomSource {
  const state = createSimulationRandomState();
  return new SimulationRandomSource(settings, () => state);
}

describe('SimulationRandomSource', () => {
  it('移出闭包后仍逐项保持既有随机序列', () => {
    const source = createSource({
      mode: 'sampled',
      globalSeed: 123,
      castSeeds: new Map([['cast-a', 7]]),
    });
    expect(Array.from({ length: 5 }, () => source.nextCriticalSample())).toEqual([
      0.920615452574566, 0.48073568590916693, 0.7334760089870542, 0.9312194793019444,
      0.015476783737540245,
    ]);
    expect(
      Array.from({ length: 5 }, () => source.nextCriticalSample({ castId: 'cast-a' })),
    ).toEqual([
      0.7268687353935093, 0.06759811472147703, 0.545253983931616, 0.20232562767341733,
      0.14300074707716703,
    ]);
  });

  it.each(['expected', 'sampled'] as const)(
    '%s：取样端口每次解析当前数据，不继续消费已离开的分支',
    mode => {
      let state = createSimulationRandomState();
      const source = new SimulationRandomSource({ mode, globalSeed: 123 }, () => state);
      source.nextCriticalSample();
      const saved = structuredClone(state);
      const expected = [source.nextCriticalSample(), source.nextProbabilitySample()];
      const abandoned = state;
      const abandonedCopy = structuredClone(abandoned);
      state = structuredClone(saved);
      expect([source.nextCriticalSample(), source.nextProbabilitySample()]).toEqual(expected);
      expect(abandoned).toEqual(abandonedCopy);
    },
  );

  it('uses stable evenly distributed streams in expected mode', () => {
    const source = createSource({ mode: 'expected', globalSeed: 99 });

    expect([source.nextCriticalSample(), source.nextCriticalSample()]).toEqual([0.5, 0.25]);
    expect([source.nextProbabilitySample(), source.nextProbabilitySample()]).toEqual([0.5, 0.25]);
  });

  it('keeps unrelated expected-mode sources on independent even sequences', () => {
    const source = createSource({ mode: 'expected', globalSeed: 99 });

    expect(source.nextCriticalSample({ expectedSequenceId: 'operator-a' })).toBe(0.5);
    expect(source.nextCriticalSample({ expectedSequenceId: 'operator-b' })).toBe(0.5);
    expect(source.nextCriticalSample({ expectedSequenceId: 'operator-a' })).toBe(0.25);
    expect(source.nextProbabilitySample({ expectedSequenceId: 'operator-a' })).toBe(0.5);
  });

  it('replays sampled mode from the same seed and separates random categories', () => {
    const first = createSource({ mode: 'sampled', globalSeed: 123 });
    const second = createSource({ mode: 'sampled', globalSeed: 123 });

    expect([
      first.nextCriticalSample(),
      first.nextProbabilitySample(),
      first.nextCriticalSample(),
    ]).toEqual([
      second.nextCriticalSample(),
      second.nextProbabilitySample(),
      second.nextCriticalSample(),
    ]);
  });

  it('lets a cast seed isolate one skill block from the global stream', () => {
    const castSeeds = new Map([['cast-a', 7]]);
    const withLocalCast = createSource({
      mode: 'sampled',
      globalSeed: 123,
      castSeeds,
    });
    const sameLocalCast = createSource({
      mode: 'sampled',
      globalSeed: 999,
      castSeeds,
    });

    expect(withLocalCast.nextCriticalSample({ castId: 'cast-a' })).toBe(
      sameLocalCast.nextCriticalSample({ castId: 'cast-a' }),
    );
    expect(withLocalCast.nextCriticalSample()).not.toBe(sameLocalCast.nextCriticalSample());
  });

  it('keeps expected mode independent from saved seeds', () => {
    const first = createSource({
      mode: 'expected',
      globalSeed: 1,
      castSeeds: new Map([['cast-a', 2]]),
    });
    const second = createSource({
      mode: 'expected',
      globalSeed: 999,
      castSeeds: new Map([['cast-a', 1000]]),
    });

    expect([
      first.nextCriticalSample({ castId: 'cast-a' }),
      first.nextCriticalSample({ castId: 'cast-a' }),
    ]).toEqual([
      second.nextCriticalSample({ castId: 'cast-a' }),
      second.nextCriticalSample({ castId: 'cast-a' }),
    ]);
  });

  it('恢复时固定全局配置和已消费施放种子，但允许修改未来施放种子', () => {
    const state = createSimulationRandomState();
    const original = new SimulationRandomSource(
      { mode: 'sampled', globalSeed: 123, castSeeds: new Map([['cast-a', 7]]) },
      () => state,
    );
    original.nextCriticalSample({ castId: 'cast-a' });
    const saved = structuredClone(state);

    expect(
      () =>
        new SimulationRandomSource(
          {
            mode: 'sampled',
            globalSeed: 123,
            castSeeds: new Map([
              ['cast-a', 7],
              ['cast-b', 99],
            ]),
          },
          () => structuredClone(saved),
        ),
    ).not.toThrow();
    expect(
      () =>
        new SimulationRandomSource(
          { mode: 'sampled', globalSeed: 124, castSeeds: new Map([['cast-a', 7]]) },
          () => structuredClone(saved),
        ),
    ).toThrow('random configuration does not match');
    expect(
      () =>
        new SimulationRandomSource(
          { mode: 'sampled', globalSeed: 123, castSeeds: new Map([['cast-a', 8]]) },
          () => structuredClone(saved),
        ),
    ).toThrow("consumed cast 'cast-a' does not match");
  });

  it.each([-1, 0x100000000, 1.5])('rejects invalid seed %s', seed => {
    expect(() => createSource({ mode: 'sampled', globalSeed: seed })).toThrow(
      '32-bit unsigned integer',
    );
  });
});
