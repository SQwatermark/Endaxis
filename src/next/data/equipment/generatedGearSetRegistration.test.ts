import { describe, expect, it } from 'vitest';
import type { GearSetDefinition } from '../../core/game-data/equipmentDefinition';
import { registerGeneratedGearSetDefinitions } from './generatedGearSetRegistration';

describe('生成套装注册', () => {
  it('以原生定义替换旧模板并反转已替换身份的 alias', () => {
    const native: GearSetDefinition = { slug: 'suit_native' };
    const legacy: GearSetDefinition = { slug: 'set-legacy' };
    const retained: GearSetDefinition = { slug: 'set-retained' };
    expect(
      registerGeneratedGearSetDefinitions([native], [legacy, retained], {
        suit_native: 'set-legacy',
        suit_pending: 'set-retained',
      }),
    ).toEqual({
      definitions: [retained, native],
      aliases: { 'set-legacy': 'suit_native', suit_pending: 'set-retained' },
    });
  });
});
