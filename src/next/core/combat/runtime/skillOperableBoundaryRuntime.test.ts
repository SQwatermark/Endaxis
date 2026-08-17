import { describe, expect, it } from 'vitest';
import { SkillOperableBoundaryRuntime } from './skillOperableBoundaryRuntime';

describe('SkillOperableBoundaryRuntime', () => {
  it('scale=1：累计 30 次 1 帧后，在 frameEndExclusive=30 返回一次边界', () => {
    const runtime = new SkillOperableBoundaryRuntime();
    runtime.begin('cast:normal', 30);

    for (let frame = 1; frame <= 29; frame += 1) {
      expect(runtime.advance(1, frame)).toEqual([]);
    }
    expect(runtime.advance(1, 30)).toEqual([
      { castId: 'cast:normal', actualEndFrame: 30 },
    ]);
    // 到达后移除，不得重复返回。
    expect(runtime.advance(1, 31)).toEqual([]);
    // 稳定 castId 在一次场景内不应重复使用，完成后也不能再次登记。
    expect(() => runtime.begin('cast:normal', 30)).toThrow('duplicate');
  });

  it('scale=0.5：施法者实体减速时需要 60 个实际帧才返回', () => {
    const runtime = new SkillOperableBoundaryRuntime();
    runtime.begin('cast:slowed', 30);

    for (let frame = 1; frame <= 59; frame += 1) {
      expect(runtime.advance(0.5, frame)).toEqual([]);
    }
    expect(runtime.advance(0.5, 60)).toEqual([
      { castId: 'cast:slowed', actualEndFrame: 60 },
    ]);
  });

  it('全局冻结但施法者被排除：调用方仍按 delta=1 推进，30 帧后返回', () => {
    const runtime = new SkillOperableBoundaryRuntime();
    runtime.begin('cast:excluded', 30);

    for (let frame = 1; frame <= 29; frame += 1) {
      expect(runtime.advance(1, frame)).toEqual([]);
    }
    expect(runtime.advance(1, 30)).toEqual([
      { castId: 'cast:excluded', actualEndFrame: 30 },
    ]);
  });

  it('0.2 帧增量累计 150 次时不会因浮点误差晚一帧', () => {
    const runtime = new SkillOperableBoundaryRuntime();
    runtime.begin('cast:fractional', 30);

    for (let frame = 1; frame <= 149; frame += 1) {
      expect(runtime.advance(0.2, frame)).toEqual([]);
    }
    expect(runtime.advance(0.2, 150)).toEqual([
      { castId: 'cast:fractional', actualEndFrame: 150 },
    ]);
  });

  it('与 sequence 是否结束无关，多个 cast 可以重叠跟踪并各自返回一次', () => {
    const runtime = new SkillOperableBoundaryRuntime();
    runtime.begin('cast:short', 10);
    runtime.begin('cast:long', 20);

    for (let frame = 1; frame <= 9; frame += 1) {
      expect(runtime.advance(1, frame)).toEqual([]);
    }
    expect(runtime.advance(1, 10)).toEqual([
      { castId: 'cast:short', actualEndFrame: 10 },
    ]);
    // 短序列已经到达，但长序列仍继续累计；本模块不关心前者的 sequence 是否自然结束。
    for (let frame = 11; frame <= 19; frame += 1) {
      expect(runtime.advance(1, frame)).toEqual([]);
    }
    expect(runtime.advance(1, 20)).toEqual([
      { castId: 'cast:long', actualEndFrame: 20 },
    ]);
  });

  it('拒绝非法输入、0 delta 不推进，并拒绝同 castId 重复登记', () => {
    const runtime = new SkillOperableBoundaryRuntime();

    expect(() => runtime.begin('', 30)).toThrow('castId');
    expect(() => runtime.begin('cast:bad', 0)).toThrow('durationFrames');
    expect(() => runtime.begin('cast:bad', Number.NaN)).toThrow('durationFrames');

    runtime.begin('cast:once', 10);
    expect(() => runtime.begin('cast:once', 10)).toThrow('duplicate');

    expect(() => runtime.advance(-1, 1)).toThrow('deltaFrames');
    expect(() => runtime.advance(Number.POSITIVE_INFINITY, 1)).toThrow('deltaFrames');
    expect(() => runtime.advance(1, 1.5)).toThrow('frameEndExclusive');
    expect(() => runtime.advance(1, -1)).toThrow('frameEndExclusive');

    expect(runtime.advance(0, 10)).toEqual([]);
    expect(runtime.advance(1, 1)).toEqual([]);
  });
});
