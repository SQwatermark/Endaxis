import { describe, expect, it } from 'vitest';
import { compileScript, compileStyle, compileTemplate, parse } from '@vue/compiler-sfc';
import source from './TimelineResourceCurves.vue?raw';

describe('TimelineResourceCurves compilation', () => {
  it('keeps the template, script bindings and scoped styles valid', () => {
    const { descriptor, errors } = parse(source);
    expect(errors).toEqual([]);
    const script = compileScript(descriptor, { id: 'resource-curves-test' });
    const template = compileTemplate({
      source: descriptor.template!.content,
      filename: 'TimelineResourceCurves.vue',
      id: 'resource-curves-test',
      compilerOptions: { bindingMetadata: script.bindings },
    });
    expect(template.errors).toEqual([]);
    for (const style of descriptor.styles) {
      expect(
        compileStyle({
          source: style.content,
          filename: 'TimelineResourceCurves.vue',
          id: 'resource-curves-test',
          scoped: true,
        }).errors,
      ).toEqual([]);
    }
  });
});
