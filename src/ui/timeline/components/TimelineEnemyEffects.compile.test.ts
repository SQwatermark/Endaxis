import { expect, it } from 'vitest';
import { compileScript, compileStyle, compileTemplate, parse } from '@vue/compiler-sfc';
import source from './TimelineEnemyEffects.vue?raw';

it('keeps every effect icon above every duration segment without per-item stacking contexts', () => {
  const rule = (selector: string) => source.slice(source.indexOf(`${selector} {`)).split('}')[0]!;
  for (const selector of ['.effect-marker', '.anomaly-icon-box']) {
    expect(rule(selector)).toContain('z-index: 10;');
  }
  for (const selector of ['.anomaly-duration-bar', '.attachment-continuation']) {
    expect(rule(selector)).toContain('z-index: 1;');
  }
  // A parent stacking context would trap an icon beneath later siblings' duration bars.
  expect(rule('.attachment-item')).not.toMatch(/z-index|transform|isolation|opacity|filter/);
});

it('compiles the enemy attachment animation and retained duration-bar branch', () => {
  const { descriptor, errors } = parse(source);
  expect(errors).toEqual([]);
  expect(() => compileScript(descriptor, { id: 'enemy-effects' })).not.toThrow();
  expect(
    compileTemplate({
      source: descriptor.template!.content,
      filename: 'TimelineEnemyEffects.vue',
      id: 'enemy-effects',
    }).errors,
  ).toEqual([]);
  for (const style of descriptor.styles)
    expect(
      compileStyle({
        source: style.content,
        filename: 'TimelineEnemyEffects.vue',
        id: 'enemy-effects',
        scoped: true,
      }).errors,
    ).toEqual([]);
});
