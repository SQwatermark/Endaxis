import { describe, expect, it } from 'vitest';
import source from './TimelineEnemyStatusSections.vue?raw';
import editorSource from '../TimelineEditor.vue?raw';
import shellSource from './TimelineWorkbenchShell.vue?raw';
import curvesSource from './TimelineResourceCurves.vue?raw';
import hudSource from './EnemyCombatHudSnapshot.vue?raw';

describe('TimelineEnemyStatusSections legacy layout contract', () => {
  it('anchors the collapsed stack to the bottom without spacing its rows apart', () => {
    expect(source).toContain('justify-content: flex-end');
    expect(source).toContain('flex: var(--section-weight) 1 14px');
    expect(source).toContain('flex: 0 0 14px');
    expect(source).not.toMatch(/\border\s*:/);
    expect(editorSource).toContain('flex: 1 0 auto');
  });

  it('uses the old editor 2:1:3 expanded-section weights without changing DOM order', () => {
    expect(source).toContain('affliction: 2');
    expect(source).toContain('poise: 1');
    expect(source).toContain('sp: 3');
    expect(source).toContain(':style="{ \'--section-weight\': sectionWeights[key] }"');
  });
  it('owns three collapsible sections and delegates the third collapse to the whole panel', () => {
    expect(source).toContain("type SectionKey = 'affliction' | 'poise' | 'sp'");
    expect(source).toContain('v-for="key in sectionKeys"');
    expect(source).toContain(':aria-expanded="!collapsed[key]"');
    expect(source).toContain('window.localStorage.setItem(COLLAPSE_STORAGE_KEY');
    expect(source).toContain('sectionKeys.every(sectionKey => next[sectionKey])');
    expect(source).toContain("emit('collapsePanel')");
    expect(shellSource).toContain(':collapse-panel="collapseBottom"');
    expect(editorSource).toContain('@collapse-panel="collapsePanel"');
  });

  it('restores the old draggable, persisted section proportions without adding layout gaps', () => {
    expect(source).toContain("'endaxis:resource-monitor-sections:v1'");
    expect(source).toContain('resizePairForLower(key)');
    expect(source).toContain('@pointerdown="beginSectionResize(key, $event)"');
    expect(source).toContain("window.addEventListener('pointermove', onMove)");
    expect(source).toContain('.section-resize-handle');
    expect(source).toContain('height: 0');
  });

  it('uses the legacy monitor readout and curve constants', () => {
    expect(hudSource).toContain('padding: 8px 10px');
    expect(hudSource).toContain('gap: 6px');
    expect(hudSource).toContain('gauge__value-max');
    expect(curvesSource).toContain('const POINT_RADIUS = 2');
    expect(curvesSource).toContain('const SP_NEGATIVE_BUFFER = 40');
    expect(curvesSource).toContain('stroke-width: 2');
    expect(curvesSource).toContain('color: #ff7875');
  });

  it('keeps the 180px summary column aligned with the timeline content column', () => {
    expect(source).toContain('left: calc(180px + (100% - 180px) / 2)');
    expect(source).toContain('width: 180px');
    expect(editorSource).toContain(':track-header-width="TIMELINE_TRACK_HEADER_WIDTH"');
  });

  it('lets each visualization fill its complete section body without dead vertical space', () => {
    expect(source).toContain('.section-content > :deep(*)');
    expect(source).toContain('height: 100%');
  });

  it('renders affliction, poise and SP in old-editor vertical order', () => {
    expect(editorSource.indexOf('<template #affliction>')).toBeLessThan(
      editorSource.indexOf('<template #poise>'),
    );
    expect(editorSource.indexOf('<template #poise>')).toBeLessThan(
      editorSource.indexOf('<template #sp>'),
    );
    expect(editorSource).toContain(':visible-kinds="[\'poise\']"');
    expect(editorSource).toContain(':visible-kinds="[\'sp\']"');
  });

  it('does not place the performance audit inside the enemy bottom section', () => {
    const enemyStart = editorSource.indexOf('v-else-if="tool === \'enemy\'"');
    const rightStart = editorSource.indexOf('<template #right');
    const enemyPanel = editorSource.slice(enemyStart, rightStart);
    expect(enemyPanel).not.toContain('<SimulationPerformanceAudit');
    expect(editorSource.slice(rightStart)).toContain('v-else-if="tool === \'performance\'"');
  });
});
