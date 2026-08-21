import { describe, expect, it } from 'vitest';
import editorSource from './TimeDilationStepEditor.vue?raw';
import curveEditorSource from './TimeScaleCurveEditor.vue?raw';

describe('TimeDilationStepEditor structure', () => {
  it('selects recovered native slots and shared named curves instead of exposing raw text fields', () => {
    expect(editorSource).toContain('TIME_DILATION_SLOT_DEFINITIONS');
    expect(editorSource).toContain('TIME_DILATION_NAMED_CURVE_KEYS');
    expect(editorSource).toContain('v-for="option in slotOptions"');
    expect(editorSource).toContain('v-for="key in namedCurveOptions"');
  });

  it('renders named curves read-only and inline curves with the same visual editor', () => {
    expect(editorSource).toContain('TimeScaleCurveEditor');
    expect(editorSource).toContain(':readonly="step.parameters.curve.kind === \'named\'"');
    expect(editorSource).toContain('@update="setInlineCurveKeys"');
    expect(editorSource).toContain('time: 1,');
    expect(curveEditorSource).toContain('@pointerdown.prevent="startDrag(index, $event)"');
    expect(curveEditorSource).toContain('@dblclick="addKey"');
    expect(curveEditorSource).toContain('evaluateTimeScaleCurve');
  });
});
