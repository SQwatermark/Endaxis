import { describe, expect, it } from 'vitest';
import source from './TimelineEnemyStatusSections.vue?raw';
import editorSource from '../TimelineEditor.vue?raw';
import shellSource from './TimelineWorkbenchShell.vue?raw';
import curvesSource from './TimelineResourceCurves.vue?raw';
import hudSource from './EnemyCombatHudSnapshot.vue?raw';
import effectsSource from './TimelineEnemyEffects.vue?raw';
import gridSource from './TimelineMonitorGrid.vue?raw';

describe('TimelineEnemyStatusSections legacy layout contract', () => {
  it('shares the dynamic status height between CSS and divider resizing', () => {
    expect(source).toContain('monitorSectionBodyMinimums(props.afflictionMinimumHeight)');
    expect(source).toContain('resizeMonitorSectionBodies(');
    expect(source).toContain('minimumBodyHeight.value');
    expect(source).toContain('minimumBodyHeight.affliction + MONITOR_SECTION_TOPBAR_HEIGHT');
  });
  it('uses defined foreground tokens for collapsed labels and expand arrows in both themes', () => {
    expect(source).toContain('opacity: 0.88');
    expect(source).toContain('color: var(--ea-fg-secondary)');
    expect(source).not.toContain('--ea-text-');
  });
  it('expands sections on the shell notification without resetting their weights', () => {
    expect(source).toContain('() => props.expandAllToken');
    expect(source).toContain('for (const key of sectionKeys) collapsed[key] = false');
    expect(editorSource).toContain(':expand-all-token="expandAllToken"');
  });
  it('anchors the collapsed stack to the bottom without spacing its rows apart', () => {
    expect(source).toContain('justify-content: safe flex-end');
    expect(source).toContain('flex: var(--section-weight) 1 14px');
    expect(source).toContain('flex: 0 0 14px');
    expect(source).not.toMatch(/\border\s*:/);
    expect(editorSource).toContain('flex: 1 0 auto');
  });

  it('uses the old editor 2:1:3 expanded-section weights without changing DOM order', () => {
    expect(source).toContain('affliction: 2');
    expect(source).toContain('poise: 1');
    expect(source).toContain('sp: 3');
    expect(source).toContain("'--section-weight': sectionWeights[key]");
  });
  it('owns three collapsible sections and delegates the third collapse to the whole panel', () => {
    expect(source).toContain("type SectionKey = 'affliction' | 'poise' | 'sp'");
    expect(source).toContain('v-for="key in sectionKeys"');
    expect(source).toContain(':aria-expanded="!collapsed[key]"');
    expect(source).toContain('window.localStorage.setItem(COLLAPSE_STORAGE_KEY');
    expect(source).toContain('sectionKeys.every(sectionKey => next[sectionKey])');
    expect(source).toContain("emit('collapsePanel')");
    expect(shellSource).toContain('v-if="bottomTool !== \'enemy\'"');
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
    expect(curvesSource).toContain('const CHART_TOP = 0');
    expect(curvesSource).toContain('const CHART_BOTTOM = 0');
    expect(curvesSource).toContain('function linePath');
    expect(curvesSource).toContain('function displayPoints');
    expect(curvesSource).toContain(
      "row.kind === 'poise' ? poiseDisplayPoints(row.points, duration.value) : row.points",
    );
    expect(curvesSource).not.toContain('function stepPath');
    expect(curvesSource).not.toContain('pointMarkerX');
    expect(curvesSource).toContain('poise-broken-pattern');
    expect(curvesSource).toContain('class="sp-warning-tag"');
    expect(editorSource).toContain(':poise-broken-segments="poiseBrokenSegments"');
    expect(curvesSource).toContain('v-for="value in [300, 200, 100]"');
    expect(curvesSource).toContain('curve-fill-${row.kind}');
    expect(editorSource).toContain('const enemyLastDamageFrame = computed');
    expect(editorSource).toContain('frame: enemyLastDamageFrame.value ?? 0');
    expect(effectsSource).toContain('summarizeLastHitBuffs(buffs.value, props.snapshotFrame)');
    expect(effectsSource).toContain('class="last-hit-buffs"');
    expect(curvesSource).toContain('stroke-width: 2');
    expect(curvesSource).toContain('color: #ff7875');
  });

  it('lets enemy effect items scroll out of view and preserves legacy duration-bar feedback', () => {
    // 旧版非伤害瞬时图标左对齐时间点，同帧图标横向错开；不夹到视口边缘。
    expect(effectsSource).toMatch(/x:\s*pointX\(marker.frame\)\s*\+/);
    expect(effectsSource).toContain('statusRows.value.markerPositions[index]?.slot');
    expect(effectsSource).not.toContain('function clamp');
    expect(effectsSource).not.toContain('enemy-effects__empty');
    expect(effectsSource).toContain('.anomaly-duration-bar:hover');
    expect(effectsSource).toContain('overflow: visible');
    expect(effectsSource).toContain('pointX(buff.durationEndFrame ?? buff.endFrame)');
  });

  it('lays all enemy buffs together so source placement cannot create overlapping lanes', () => {
    expect(editorSource).toContain('targetId === SINGLE_ENEMY_TARGET_ID');
    expect(editorSource).toContain('? [...layoutBuffTimelineSegments(displaySegments)]');
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

  it('shares the old prep tint, zero boundary and dashed five-second grid across monitor rows', () => {
    expect(curvesSource).toContain('<TimelineMonitorGrid');
    expect(effectsSource).toContain('<TimelineMonitorGrid');
    expect(gridSource).toContain('const GRID_LINE_FRAME_STEP = 150');
    expect(gridSource).toContain('class="monitor-grid__prep"');
    expect(gridSource).toContain('class="monitor-grid__zero"');
    expect(gridSource).toContain('stroke: #333');
    expect(gridSource).toContain('stroke-dasharray: 2');
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
