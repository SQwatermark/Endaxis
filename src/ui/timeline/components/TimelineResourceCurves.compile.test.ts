import { describe, expect, it } from 'vitest';
import { compileScript, compileStyle, compileTemplate, parse } from '@vue/compiler-sfc';
import source from './TimelineResourceCurves.vue?raw';

describe('TimelineResourceCurves compilation', () => {
  it('renders receipt intervals using measured poise height and shared timeline coordinates', () => {
    expect(source).toContain('new ResizeObserver(update)');
    expect(source).toContain('sizeObserver?.disconnect()');
    expect(source).toContain('rowHeight(row) / 2 + 4');
    expect(source).toContain('pointX(segment.endFrame) - pointX(segment.startFrame)');
    expect(source).toContain('<TimelineMonitorGrid');
    expect(source).toMatch(/<\/script>\s*<template>/);
    expect(source).toContain("row.kind === 'poise' ? Math.round(value) : value");
    expect(source).toContain('formatNumber(readoutValue(row))');
  });

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
