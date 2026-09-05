import { describe, expect, it } from 'vitest';
import corner from './TimelineCornerToolbar.vue?raw';
import header from './TimelineHeaderToolbar.vue?raw';
import enemy from './EnemySettingsPanel.vue?raw';
import zhCN from '../../../i18n/locales/zh-CN.json';

describe('legacy panel visual contracts', () => {
  it('explicitly sizes the SCALE thumb instead of using the browser default', () => {
    expect(corner).toContain('input::-webkit-slider-thumb');
    expect(corner).toContain('input::-moz-range-thumb');
    expect(corner).toContain('appearance: none');
    expect(corner).toContain('width: 8px');
    expect(corner).toContain('height: 2px');
  });

  it('separates tools, project actions and preferences, with appearance on its own row', () => {
    expect(header.indexOf("t('timeline.header.sectionEditTools')")).toBeLessThan(
      header.indexOf("t('timeline.header.sectionProject')"),
    );
    expect(header).toContain('preference-row preference-row--appearance');
    expect(header).toContain('class="tool-check"');
    expect(header).toContain('class="shortcuts-button"');
    expect(header).toContain('<span>{{ labels.open }}</span>');
    expect(header).toContain('<span>{{ labels.export }}</span>');
    expect(header).toContain('<span>{{ labels.reset }}</span>');
    expect(header).toContain('popper-class="next-header-display"');
    expect(header).toContain('.next-header-more.el-popover.el-popper');
    expect(header).toContain('background: var(--ea-popover-bg)');
  });

  it('uses legacy card sizing and puts the enemy tier on the portrait', () => {
    expect(enemy).toContain('height: 64px');
    expect(enemy).toContain('width: 42px');
    expect(enemy).toContain('class="tier-strip"');
    expect(enemy).toContain('ea-btn--glass-cut');
    expect(enemy).toContain("t('resourceMonitor.enemy.desc'");
    expect(enemy).toContain('max: candidate.stagger.maximum');
    expect(enemy).toContain('nodes: candidate.stagger.knotThresholds.length');
    expect(enemy).toContain("t('resourceMonitor.enemy.specialGroup')");
    expect(enemy).toContain("t('resourceMonitor.enemy.standardGroup')");
    expect(enemy).toContain("selected: enemy.source.kind === 'custom'");
    expect(zhCN.resourceMonitor.enemy.desc).toContain('{nodes}');
    expect(zhCN.resourceMonitor.enemy.desc).not.toContain('|');
  });

  it('keeps the legacy active-enemy module structure', () => {
    expect(enemy).toContain('v-if="enemy.source.kind !== \'custom\'"');
    expect(enemy).toContain('class="scan-line"');
    expect(enemy).toContain('width: 32px');
    expect(enemy).toContain('height: 32px');
    expect(enemy).toContain('animation: enemy-scan 3s infinite linear');
    expect(enemy).toContain('gap: 8px');
  });

  it('renders appearance with vector icons and explicit accessible state', () => {
    expect(header).toContain(':aria-label="labels.appearanceLight"');
    expect(header).toContain(':aria-pressed="appearance === \'dark\'"');
    expect(header).not.toContain('◐');
  });
});
