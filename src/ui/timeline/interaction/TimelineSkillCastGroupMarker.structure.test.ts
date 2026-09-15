import { describe, expect, it } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
import source from './TimelineSkillCastGroupMarker.vue?raw';

describe('TimelineSkillCastGroupMarker layout', () => {
  it('uses the bracket itself as the group marker without covering skill-block status marks', () => {
    expect(editorSource).toContain('<TimelineSkillCastGroupMarker');
    expect(source).toContain('class="group-select-hitbox"');
    expect(source).toMatch(/\.group-select-hitbox\s*\{[^}]*inset: 0;/s);
    expect(source).toMatch(/\.group-select-hitbox\s*\{[^}]*background: transparent;/s);
    expect(source).toContain('.group-select-hitbox.ea-button:hover:not(:disabled)');
    expect(source).not.toContain('class="group-label"');
  });

  it('retains the full translated label for tooltip and accessible selection', () => {
    expect(source).toContain(':title="label"');
    expect(source).toContain(':aria-label="label"');
  });
});
