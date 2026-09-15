import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import actionBlockSource from '../interaction/TimelineActionBlock.vue?raw';
import skillCardSource from '../library/SkillLibraryCard.vue?raw';
import workbenchSource from './TimelineWorkbenchShell.vue?raw';
import trackHeaderSource from './TimelineTrackHeader.vue?raw';

const controlStyles = readFileSync(
  new URL('../../../design-system/styles/controls.css', import.meta.url),
  'utf8',
);

describe('Next timeline light-theme selector scoping', () => {
  it('never compiles icon and component filters onto the html theme root', () => {
    for (const source of [actionBlockSource, skillCardSource, workbenchSource, trackHeaderSource]) {
      expect(source).not.toMatch(/:global\(html\[data-theme='light'\]\)\s+/);
    }

    expect(controlStyles).toContain("html[data-theme='light'] .ea-activity-rail-button__icon");
    expect(skillCardSource).toContain(":global(html[data-theme='light'] .weapon-icon-inner)");
    expect(actionBlockSource).toContain(
      ":global(html[data-theme='light'] .timeline-action-block:hover)",
    );
  });
});
