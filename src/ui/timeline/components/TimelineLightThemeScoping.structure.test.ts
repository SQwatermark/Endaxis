import { describe, expect, it } from 'vitest';
import actionBlockSource from './TimelineActionBlock.vue?raw';
import skillCardSource from './SkillLibraryCard.vue?raw';
import workbenchSource from './TimelineWorkbenchShell.vue?raw';

describe('Next timeline light-theme selector scoping', () => {
  it('never compiles icon and component filters onto the html theme root', () => {
    for (const source of [actionBlockSource, skillCardSource, workbenchSource]) {
      expect(source).not.toMatch(/:global\(html\[data-theme='light'\]\)\s+/);
    }

    expect(workbenchSource).toContain(":global(html[data-theme='light'] .activity-button img)");
    expect(skillCardSource).toContain(":global(html[data-theme='light'] .weapon-icon-inner)");
    expect(actionBlockSource).toContain(
      ":global(html[data-theme='light'] .timeline-action-block:hover)",
    );
  });
});
