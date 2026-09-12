import { describe, expect, it } from 'vitest';
import { SimulationRandomSource } from './simulationRandom';

describe('SimulationRandomSource', () => {
  it('uses stable evenly distributed streams in expected mode', () => {
    const source = new SimulationRandomSource({ mode: 'expected', globalSeed: 99 });

    expect([source.nextCriticalSample(), source.nextCriticalSample()]).toEqual([0.5, 0.25]);
    expect([source.nextProbabilitySample(), source.nextProbabilitySample()]).toEqual([0.5, 0.25]);
  });

  it('keeps unrelated expected-mode sources on independent even sequences', () => {
    const source = new SimulationRandomSource({ mode: 'expected', globalSeed: 99 });

    expect(source.nextCriticalSample({ expectedSequenceId: 'operator-a' })).toBe(0.5);
    expect(source.nextCriticalSample({ expectedSequenceId: 'operator-b' })).toBe(0.5);
    expect(source.nextCriticalSample({ expectedSequenceId: 'operator-a' })).toBe(0.25);
    expect(source.nextProbabilitySample({ expectedSequenceId: 'operator-a' })).toBe(0.5);
  });

  it('replays sampled mode from the same seed and separates random categories', () => {
    const first = new SimulationRandomSource({ mode: 'sampled', globalSeed: 123 });
    const second = new SimulationRandomSource({ mode: 'sampled', globalSeed: 123 });

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
    const withLocalCast = new SimulationRandomSource({
      mode: 'sampled',
      globalSeed: 123,
      castSeeds,
    });
    const sameLocalCast = new SimulationRandomSource({
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
    const first = new SimulationRandomSource({
      mode: 'expected',
      globalSeed: 1,
      castSeeds: new Map([['cast-a', 2]]),
    });
    const second = new SimulationRandomSource({
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

  it.each([-1, 0x100000000, 1.5])('rejects invalid seed %s', seed => {
    expect(() => new SimulationRandomSource({ mode: 'sampled', globalSeed: seed })).toThrow(
      '32-bit unsigned integer',
    );
  });
});
