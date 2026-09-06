import { expect, it } from 'vitest';
import { compileScript, compileStyle, compileTemplate, parse } from '@vue/compiler-sfc';
import source from './TimelineEnemyEffects.vue?raw';

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
