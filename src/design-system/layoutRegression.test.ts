import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import cornerToolbarSource from '../ui/timeline/components/TimelineCornerToolbar.vue?raw';
import enemySettingsSource from '../ui/timeline/components/EnemySettingsPanel.vue?raw';
import timelineEditorSource from '../ui/timeline/TimelineEditor.vue?raw';
import headerToolbarSource from '../ui/timeline/components/TimelineHeaderToolbar.vue?raw';
import trackHeaderSource from '../ui/timeline/components/TimelineTrackHeader.vue?raw';
import workbenchShellSource from '../ui/timeline/components/TimelineWorkbenchShell.vue?raw';

const elementPlusStyles = readFileSync(
  new URL('./styles/element-plus.css', import.meta.url),
  'utf8',
);
const patternStyles = readFileSync(new URL('./styles/patterns.css', import.meta.url), 'utf8');

function getRuleBody(source: string, selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.match(new RegExp(`${escapedSelector}\\s*\\{([^}]+)\\}`))?.[1] ?? '';
}

describe('design-system layout regressions', () => {
  test('lets the enemy summary compound button grow around its content', () => {
    const rule = getRuleBody(enemySettingsSource, '.enemy-select-module');

    expect(rule).toMatch(/\bheight:\s*auto\s*;/);
  });

  test('keeps the generic popper arrow fill overridable by feature poppers', () => {
    expect(elementPlusStyles).toContain(
      ':where(.el-popper[data-popper-placement] > .el-popper__arrow)::before',
    );
    expect(elementPlusStyles).not.toContain(
      '.el-popper.el-popper.el-popper[data-popper-placement] > .el-popper__arrow::before',
    );
  });

  test('keeps feature-sized icon buttons from inheriting generic icon-only dimensions', () => {
    expect(trackHeaderSource).toMatch(
      /\.avatar-trigger\s*\{[^}]*width:\s*44px;[^}]*min-width:\s*44px;[^}]*height:\s*44px;/s,
    );
    expect(cornerToolbarSource).toMatch(
      /\.zoom-step\.ea-button\.ea-button--icon-only\s*\{[^}]*width:\s*10px;[^}]*height:\s*10px;/s,
    );
    expect(workbenchShellSource).toMatch(
      /\.panel-chrome__button\.ea-button\.ea-button--icon-only\s*\{[^}]*width:\s*20px;[^}]*height:\s*20px;/s,
    );
  });

  test('does not apply the generic pressed fill to checklist and activity buttons', () => {
    expect(patternStyles).toMatch(
      /\.header-more-check-row\.ea-button\[aria-pressed='true'\]\s*\{[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;/s,
    );
    expect(workbenchShellSource).toMatch(
      /\.activity-button\.ea-button\[aria-pressed='true'\]\s*\{[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;/s,
    );
  });

  test('keeps the current operator name as a heading and header commands on design-system type', () => {
    expect(timelineEditorSource).toContain('<h3 class="operator-heading">');
    expect(timelineEditorSource).not.toMatch(/<EaButton[^>]*class="operator-heading"/s);
    expect(headerToolbarSource).not.toMatch(/\.ea-button\s*\{[^}]*font:\s*inherit;/s);
  });
});
