import { describe, expect, it } from 'vitest';

import { projectNativeDamageElement } from '../src/index.ts';

describe('公共原生元素投影', () => {
  it('为角色、伤害和条件数据复用同一组稳定身份', () => {
    expect(projectNativeDamageElement('Physical', 'fixture')).toBe('physical');
    expect(projectNativeDamageElement('Fire', 'fixture')).toBe('heat');
    expect(projectNativeDamageElement('Pulse', 'fixture')).toBe('electric');
    expect(projectNativeDamageElement('Cryst', 'fixture')).toBe('cryo');
    expect(projectNativeDamageElement('Natural', 'fixture')).toBe('nature');
  });

  it('拒绝没有证据的原生身份', () => {
    expect(() => projectNativeDamageElement('Ether', 'fixture')).toThrow(
      'unsupported native damage element "Ether"',
    );
  });
});
