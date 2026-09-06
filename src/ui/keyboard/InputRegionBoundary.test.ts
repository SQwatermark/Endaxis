import { describe, expect, it } from 'vitest';
import boundary from './InputRegionBoundary.vue?raw';
import dialog from '../timeline/components/SkillDefinitionEditorDialog.vue?raw';

describe('skill modal region wiring', () => {
  it('registers the boundary fallback in its own region without adding layout DOM', () => {
    expect(boundary).toContain('useKeyboardInputRegion(');
    expect(boundary).toContain('region,');
    expect(boundary).toContain('priority: -1');
    expect(boundary).toContain('handle: () => false');
    expect(boundary).toMatch(/<template>\s*<slot\s*\/>\s*<\/template>/);
  });
  it('wraps only the modal editor, leaving embedded mode in its existing owner', () => {
    const template = dialog.slice(dialog.indexOf('<template>'));
    const embedded = template.slice(0, template.indexOf('<el-dialog'));
    expect(embedded).not.toContain('<InputRegionBoundary');
    expect(template).toContain(
      '<InputRegionBoundary label="skill-definition-dialog" :active="visible" modal>',
    );
    expect(template.indexOf('<InputRegionBoundary')).toBeLessThan(
      template.lastIndexOf('<SkillDefinitionEditor'),
    );
    expect(template.lastIndexOf('</InputRegionBoundary>')).toBeLessThan(
      template.indexOf('</el-dialog>'),
    );
  });
});
