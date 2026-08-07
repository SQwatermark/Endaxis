import { describe, expect, it } from 'vitest';
import { GameplayTagRegistry, gameplayTagId, gameplayTagIdFromPath } from './gameplayTags';

describe('GameplayTag', () => {
  it('使用 UTF-8 路径的 CRC32 作为有符号身份', () => {
    expect(gameplayTagIdFromPath('123456789')).toBe(-873187034);
    expect(() => gameplayTagId(0x80000000)).toThrow(/signed 32-bit/);
  });

  it('非精确查询允许子标签匹配父标签', () => {
    const registry = new GameplayTagRegistry(['Combat/Buff/Pulse']);
    const child = gameplayTagIdFromPath('Combat/Buff/Pulse');
    const parent = gameplayTagIdFromPath('Combat/Buff');

    expect(registry.matches(child, parent)).toBe(true);
    expect(registry.matches(child, parent, true)).toBe(false);
  });

  it('支持原生四种容器查询语义', () => {
    const registry = new GameplayTagRegistry(['Combat/Buff/Pulse', 'Combat/Buff/Heat']);
    const pulse = gameplayTagIdFromPath('Combat/Buff/Pulse');
    const heat = gameplayTagIdFromPath('Combat/Buff/Heat');
    const missing = gameplayTagIdFromPath('Combat/Buff/Nature');

    expect(registry.query([pulse, heat], [pulse, missing], 'hasAny')).toBe(true);
    expect(registry.query([pulse, heat], [pulse, heat], 'hasAll')).toBe(true);
    expect(registry.query([pulse], [missing], 'exceptAny')).toBe(true);
    expect(registry.query([pulse], [pulse, missing], 'exceptAll')).toBe(true);
  });
});
