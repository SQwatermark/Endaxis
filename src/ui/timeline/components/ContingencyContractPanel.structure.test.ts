import { describe, expect, it } from 'vitest';
import source from './ContingencyContractPanel.vue?raw';

describe('ContingencyContractPanel legacy interaction parity', () => {
  it('keeps the native three-row square-tag geometry and conflict links', () => {
    expect(source).toContain('const COLUMN_WIDTH = 76');
    expect(source).toContain('const COLUMN_GAP = 12');
    expect(source).toContain('const ROW_HEIGHT = 58');
    expect(source).toContain('const ROW_GAP = 22');
    expect(source).toContain('const TAG_SIZE = 58');
    expect(source).toContain('const MAX_SCORE_ROW = 3');
    expect(source).toContain('class="cc-conflict-link"');
    expect(source).toContain('grid-template-columns: minmax(0, 1fr) 280px');
  });

  it('keeps no-op tags selectable while enforcing native prerequisite keys', () => {
    expect(source).toContain('@click="toggle(cell.tag)"');
    expect(source).not.toContain(':disabled="cell.tag.support');
    expect(source).toContain("'is-locked': isLocked(cell.tag)");
    expect(source).toContain('isContingencyContractTagLocked');
    expect(source).toContain('opacity: 0.38');
    expect(source).toContain('该词条在Endaxis中无实际效果');
    expect(source).toContain("cell.tag.support === 'omitted'");
    expect(source).toContain("cell.tag.support === 'blocked'");
    expect(source).not.toContain("cell.tag.support !== 'supported'");
    expect(source).toContain('class="cc-tag-tooltip-no-effect"');
    expect(source).toContain('color: rgba(255, 255, 255, 0.5)');
  });

  it('keeps the old red selection treatment and readable theme-specific tooltip', () => {
    expect(source).toContain('background: #a91512');
    expect(source).toContain('popper-class="cc-tag-tooltip-popper"');
    expect(source).toContain(
      ":global(html[data-theme='light'] .cc-tag-tooltip-popper.el-popper.is-dark)",
    );
    expect(source).toContain('<EaTooltip');
    expect(source).toContain('--ea-floating-border: color-mix(');
    expect(source).not.toContain('background: var(--ea-tooltip-bg, #fff)');
  });
});
