import { describe, expect, it } from 'vitest';
import source from './OperatorPassiveUiWidget.vue?raw';

describe('OperatorPassiveUiWidget native prefab geometry', () => {
  it('renders Tangtang as the native single droplet state instead of two invented slots', () => {
    expect(source).toContain('return { width: 64, height: 44 }');
    expect(source).toContain('class="tangtang-droplet"');
    expect(source).not.toContain('v-for="index in 2"');
  });

  it('uses Laevat leaf positions and mirror transforms from RectTransform evidence', () => {
    expect(source).toContain('.laevatain-leaf--1');
    expect(source).toContain('top: 2px');
    expect(source).toContain('left: 15px');
    expect(source).toContain('transform: scaleY(-1)');
    expect(source).toContain('transform: scaleX(-1)');
  });

  it('keeps Zhuang Fangyi points in the native diamond ordering', () => {
    expect(source).toContain('[-13.94, 0]');
    expect(source).toContain('[-0.2, 13.7]');
    expect(source).toContain('[13.5, 0]');
    expect(source).not.toContain('(index % 3) * 12');
  });

  it('uses the native Arcane and Liino layer dimensions', () => {
    expect(source).toContain('width: 42px');
    expect(source).toContain('height: 33px');
    expect(source).toContain('width: 18px');
    expect(source).toContain('height: 24px');
    expect(source).toContain('left: 43px');
    expect(source).toContain('top: 24px');
  });
});
