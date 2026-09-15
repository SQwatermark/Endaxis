import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import cornerToolbarSource from '../ui/timeline/components/TimelineCornerToolbar.vue?raw';
import enemySettingsSource from '../ui/timeline/components/EnemySettingsPanel.vue?raw';
import globalResourceSource from '../ui/timeline/components/GlobalResourcePanel.vue?raw';
import timelineEditorSource from '../ui/timeline/TimelineEditor.vue?raw';
import actionInspectorSource from '../ui/timeline/interaction/TimelineActionInspector.vue?raw';
import documentMarkerInspectorSource from '../ui/timeline/interaction/TimelineDocumentMarkerInspector.vue?raw';
import externalEventInspectorSource from '../ui/timeline/interaction/TimelineExternalEventInspector.vue?raw';
import headerToolbarSource from '../ui/timeline/components/TimelineHeaderToolbar.vue?raw';
import rulerSource from '../ui/timeline/components/TimelineRuler.vue?raw';
import trackHeaderSource from '../ui/timeline/components/TimelineTrackHeader.vue?raw';
import workbenchShellSource from '../ui/timeline/components/TimelineWorkbenchShell.vue?raw';

const elementPlusStyles = readFileSync(
  new URL('./styles/element-plus.css', import.meta.url),
  'utf8',
);
const patternStyles = readFileSync(new URL('./styles/patterns.css', import.meta.url), 'utf8');

const controlStyles = readFileSync(new URL('./styles/controls.css', import.meta.url), 'utf8');
const dialogStyles = readFileSync(new URL('./styles/dialogs.css', import.meta.url), 'utf8');
const tokenStyles = readFileSync(new URL('./styles/tokens.css', import.meta.url), 'utf8');

function getRuleBody(source: string, selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.match(new RegExp(`${escapedSelector}\\s*\\{([^}]+)\\}`))?.[1] ?? '';
}

function getBlockBody(source: string, header: string) {
  const headerIndex = source.indexOf(header);
  if (headerIndex < 0) return '';

  const openingBrace = source.indexOf('{', headerIndex + header.length);
  if (openingBrace < 0) return '';

  let depth = 1;
  for (let index = openingBrace + 1; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(openingBrace + 1, index);
  }

  return '';
}

function unguardedHoverCount(source: string) {
  const styleBlocks = [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)];
  const styleSource = styleBlocks.length ? styleBlocks.map(match => match[1]).join('\n') : source;
  const tokens = styleSource.match(
    /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)\s*\{|:hover|[{}]/g,
  );
  if (!tokens) return 0;

  const guardedStack = [false];
  let count = 0;

  for (const token of tokens) {
    if (token.startsWith('@media')) {
      guardedStack.push(true);
    } else if (token === '{') {
      guardedStack.push(guardedStack.at(-1) || false);
    } else if (token === '}') {
      if (guardedStack.length > 1) guardedStack.pop();
    } else if (!guardedStack.at(-1)) {
      count += 1;
    }
  }

  return count;
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
    expect(controlStyles).toMatch(
      /\.ea-activity-rail-button\.ea-button\[aria-pressed='true'\]\s*\{[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;/s,
    );
  });

  test('keeps compact numeric controls on the right edge like the legacy panels', () => {
    for (const source of [
      actionInspectorSource,
      cornerToolbarSource,
      documentMarkerInspectorSource,
      enemySettingsSource,
      externalEventInspectorSource,
      globalResourceSource,
      rulerSource,
    ]) {
      expect(source).not.toContain(':controls="false"');
      expect(source).toContain('controls-position="right"');
    }
  });

  test('keeps the current operator name as a heading and header commands on design-system type', () => {
    expect(timelineEditorSource).toContain('<h3 class="operator-heading">');
    expect(timelineEditorSource).not.toMatch(/<EaButton[^>]*class="operator-heading"/s);
    expect(headerToolbarSource).not.toMatch(/\.ea-button\s*\{[^}]*font:\s*inherit;/s);
  });

  test('gives shared tooltip and popover adapters one floating-surface contract', () => {
    const rule = getRuleBody(patternStyles, '.ea-floating-surface');

    expect(rule).toContain('background: var(--ea-floating-bg) !important;');
    expect(rule).toContain('border: 1px solid var(--ea-floating-border) !important;');
    expect(rule).toContain('box-shadow: var(--ea-floating-shadow) !important;');
  });

  test('keeps shared floating-surface arrows attached to the matching surface color', () => {
    const rule = getRuleBody(
      elementPlusStyles,
      '.ea-floating-surface.el-popper > .el-popper__arrow::before',
    );

    expect(rule).toContain('background: var(--ea-floating-bg) !important;');
  });

  test('routes Element Plus adapter surfaces through shared theme colors', () => {
    expect(elementPlusStyles).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(/i);
    expect(elementPlusStyles).toContain('background-color: var(--ea-dialog-bg) !important;');
    expect(elementPlusStyles).toContain('background-color: var(--ea-fill-input) !important;');
    expect(elementPlusStyles).toContain('color: var(--ea-control-placeholder) !important;');
    expect(elementPlusStyles).toContain('box-shadow: var(--ea-floating-shadow) !important;');
  });

  test('routes shared pattern colors through design tokens', () => {
    expect(patternStyles).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(/i);
    expect(patternStyles).toContain('--ea-range-track: var(--ea-border-strong);');
    expect(patternStyles).toContain('color: var(--ea-fg-secondary);');
  });

  test('keeps shared drawers on the panel surface with an unpadded content body', () => {
    const drawerRule = getRuleBody(dialogStyles, '.ea-drawer.el-drawer');
    const bodyRule = getRuleBody(dialogStyles, '.ea-drawer .el-drawer__body');

    expect(drawerRule).toContain('background: var(--ea-panel) !important;');
    expect(bodyRule).toContain('padding: 0 !important;');
    expect(bodyRule).toContain('background: var(--ea-panel) !important;');
  });

  test('gives dialog close controls one square, background-free interaction contract', () => {
    const closeRule = getRuleBody(dialogStyles, '.ea-dialog .el-dialog__headerbtn');
    const closeComponentRule = getRuleBody(controlStyles, '.ea-close-button--md.ea-button');
    const hoverMedia = getBlockBody(controlStyles, '@media (hover: hover) and (pointer: fine)');
    const hoverRule = getRuleBody(hoverMedia, '.ea-close-button.ea-button:hover:not(:disabled)');

    expect(closeRule).toContain('width: 32px;');
    expect(closeRule).toContain('height: 32px;');
    expect(closeRule).toContain('background: transparent;');
    expect(closeComponentRule).toContain('width: 32px;');
    expect(closeComponentRule).toContain('height: 32px;');
    expect(hoverRule).toContain('background: transparent;');
    expect(hoverRule).toContain('color: var(--ea-gold);');
    expect(dialogStyles).not.toContain('ea-dialog-close-button');
  });

  test('limits shared hover feedback to devices with a fine hover pointer', () => {
    const hoverMedia = getBlockBody(controlStyles, '@media (hover: hover) and (pointer: fine)');
    const allHoverRules = controlStyles.match(/:hover/g)?.length ?? 0;
    const guardedHoverRules = hoverMedia.match(/:hover/g)?.length ?? 0;

    expect(guardedHoverRules).toBe(allHoverRules);
  });

  test('keeps pressed buttons visually selected while hovered', () => {
    const hoverMedia = getBlockBody(controlStyles, '@media (hover: hover) and (pointer: fine)');
    const rule = getRuleBody(hoverMedia, ".ea-button[aria-pressed='true']:hover:not(:disabled)");

    expect(rule).toContain('border-color: var(--ea-gold);');
    expect(rule).toContain('color: var(--ea-gold);');
  });

  test('sizes teleported select options with the matching control tokens', () => {
    for (const size of ['sm', 'md', 'lg']) {
      const rule = getRuleBody(
        elementPlusStyles,
        `.ea-select-popper--${size} .el-select-dropdown__item`,
      );

      expect(rule).toContain(`height: var(--ea-control-height-${size}) !important;`);
      expect(rule).toContain(`font-size: var(--ea-control-font-size-${size}) !important;`);
      expect(rule).toContain(`line-height: var(--ea-control-height-${size}) !important;`);
    }
  });

  test('provides a shared four-pixel spacing scale', () => {
    expect(tokenStyles).toContain('--ea-space-1: 4px;');
    expect(tokenStyles).toContain('--ea-space-2: 8px;');
    expect(tokenStyles).toContain('--ea-space-3: 12px;');
    expect(tokenStyles).toContain('--ea-space-4: 16px;');
    expect(tokenStyles).toContain('--ea-space-6: 24px;');
  });

  test('guards shared surface hover rules on touch devices', () => {
    expect(unguardedHoverCount(elementPlusStyles)).toBe(0);
    expect(unguardedHoverCount(patternStyles)).toBe(0);
  });
});
