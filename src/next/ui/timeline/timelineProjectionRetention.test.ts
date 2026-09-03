import { describe, expect, it } from 'vitest';
import source from './NextTimelineEditor.vue?raw';
import actionBlockSource from './components/TimelineActionBlock.vue?raw';

function projectionSource(startMarker: string, endMarker: string): string {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return source.slice(start, end);
}

describe('Next timeline simulation projection retention', () => {
  it('keeps cast starts and time-dilation bands while a drag simulation is pending', () => {
    const projections = projectionSource(
      'const skillCastActualStartFrames = computed',
      '\nconst timelineWidth = computed',
    );

    expect(projections).toContain('projectSkillCastActualStartFrames');
    expect(projections).toContain('projectSkillCastActualDurationFrames');
    expect(projections).toContain('projectTimelineTimeDilationBands');
    expect(projections).not.toContain('timelineTimeMapping');
    expect(projections).not.toContain('simulationStale.value');
  });

  it('marks only started casts without a published local boundary as duration-pending', () => {
    const projection = projectionSource(
      'function castActualDurationPending',
      '\nfunction timelinePointerActualFrame',
    );

    expect(projection).toContain('definitionDurationFrames > 0');
    expect(projection).toContain('skillCastActualStartFrames.value.has(castId)');
    expect(projection).toContain('!skillCastActualDurationFrames.value.has(castId)');
    expect(source).toContain(':duration-pending="castActualDurationPending');
    expect(actionBlockSource).toContain("'is-duration-pending': durationPending");
    expect(actionBlockSource).toContain('class="duration-pending-tail"');
  });

  it('does not independently clear hit projections while the published snapshot is stale', () => {
    const hitProjection = projectionSource(
      'const castHitEffects = computed',
      '\n/** 敌人瞬时效果标记',
    );

    expect(hitProjection).toContain('const current = simulationRun.value');
    expect(hitProjection).toContain('projectTimelineHitActualFrames');
    expect(hitProjection).not.toContain('simulationStale.value');
    expect(actionBlockSource).not.toContain('transition: all');
    expect(actionBlockSource).toContain('background-color 0.15s ease');
    expect(actionBlockSource).toContain('transform 0.15s cubic-bezier');
    expect(source).toContain('hitId: $event');
    expect(source).toContain('candidate.hitId === target.hitId');
  });

  it('keeps legacy hit-marker press timing and forced-critical feedback', () => {
    expect(actionBlockSource).toContain("'is-forced-crit': hit.forcedCritical");
    expect(actionBlockSource).toContain('@mousedown.stop.prevent="$emit(\'hitClick\', hit.hitId)"');
    expect(actionBlockSource).not.toContain('@click.stop="$emit(\'hitClick\', hit.hitId)"');
    expect(actionBlockSource).toMatch(/\.hit-marker\.is-forced-crit\s*\{[^}]*#ff6b6b/s);
    expect(source).toContain('forcedCriticalStepKeys');
  });

  it('keeps legacy skill-type border rules and ultimate side bars without overriding state', () => {
    expect(actionBlockSource).toContain("skillType === 'ultimate' && !disabled");
    expect(actionBlockSource).toContain('ultimate-side-bar--left');
    expect(actionBlockSource).toContain('ultimate-side-bar--right');
    expect(actionBlockSource).toContain('border: 2px dashed var(--action-accent)');
    expect(actionBlockSource).toContain(
      ".timeline-action-block:not(.is-selected):not(.is-disabled)[data-skill-type='basicAttack']",
    );
    expect(actionBlockSource).toContain(
      ".timeline-action-block:not(.is-selected):not(.is-disabled)[data-skill-type='comboSkill']",
    );
    expect(actionBlockSource).toContain(
      ".timeline-action-block:not(.is-selected):not(.is-disabled)[data-skill-type='ultimate']",
    );
  });

  it('projects actual runtime cooldown intervals onto their reserving cast', () => {
    expect(source).toContain('projectSkillCooldownTimelineViz');
    expect(source).toContain('cooldownBarsForCast(cast.id, cast.startFrame)');
    expect(actionBlockSource).toContain('class="cooldown-timeline-bar"');
    expect(actionBlockSource).toContain("'is-pending': !bar.completed");
    expect(actionBlockSource).toContain('class="cooldown-timeline-bar__start"');
    expect(actionBlockSource).toContain('class="cooldown-timeline-bar__end"');
    expect(actionBlockSource).toMatch(/\.cooldown-timeline-bar\s*\{[^}]*border-top: 2px/s);
  });

  it('keeps custom duration bars as independent two-ended 2px annotations', () => {
    expect(actionBlockSource).toContain('class="custom-timeline-bar"');
    expect(actionBlockSource).toContain('class="custom-timeline-bar__start"');
    expect(actionBlockSource).toContain('class="custom-timeline-bar__end"');
    expect(actionBlockSource).toContain('class="custom-timeline-bar__duration"');
    expect(actionBlockSource).toMatch(/\.custom-timeline-bar\s*\{[^}]*border-top: 2px/s);
    expect(actionBlockSource).toMatch(/\.custom-timeline-bar__duration\s*\{[^}]*font-size: 10px/s);
  });

  it('feeds workbench result panels only from Next documents and simulation projections', () => {
    expect(source).toContain(':rules="scenario.battle.resourceRules"');
    expect(source).toContain(':modifiers="scenario.globalConfig.modifiers"');
    expect(source).toContain(':cast="selectedCastModel?.cast ?? null"');
    expect(source).toContain(':entries="simulationRun?.receiptEntries ?? []"');
    expect(source).toContain('<div v-else class="simulation-panel__empty">—</div>');
    expect(source).not.toContain('useTimelineStore');
    expect(source).not.toContain("from '../../../stores/timelineStore'");
  });

  it('keeps the legacy vertical breathing room around the whole track stack', () => {
    expect(source).toContain('<div class="track-stack">');
    expect(source).toMatch(/\.track-stack\s*\{[^}]*padding: 20px 0;/s);
    expect(source).toMatch(/\.track-stack\s*\{[^}]*box-sizing: border-box;/s);
  });

  it('resizes only adjacent compact tracks and persists the local view heights', () => {
    expect(source).toContain(
      "const TRACK_HEIGHTS_STORAGE_KEY = 'endaxis-next:timeline-compact-track-heights:v1'",
    );
    expect(source).toContain('compactHeight: compactTrackHeights.value[trackIndex]');
    expect(source).toContain('resizeTimelineTrackPair(');
    expect(source).toContain("buffLayoutMode === 'compact'");
    expect(source).toContain('@pointerdown="beginCompactTrackResize($event, track.trackIndex)"');
    expect(source).toContain('@dblclick.stop="resetCompactTrackPair(track.trackIndex)"');
    expect(source).toContain("classList.add('is-next-track-resizing')");
  });

  it('uses the legacy bottom scrollbar as the shared horizontal timeline shift', () => {
    expect(source).toContain('ref="timelineHorizontalScrollbar"');
    expect(source).toContain('@scroll="updateTimelineHorizontalScroll"');
    expect(source).toContain('scrollbar.scrollLeft = viewport.scrollLeft');
    expect(source).toContain('viewport.scrollLeft = scrollbar.scrollLeft');
    expect(source).toContain(':style="{ width: `${timelineWidth}px` }"');
    expect(source).toMatch(
      /\.timeline-workspace\s*\{[^}]*grid-template-rows: minmax\(0, 1fr\) 12px/s,
    );
    expect(source).toMatch(/\.timeline-horizontal-scrollbar\s*\{[^}]*margin-left: 180px/s);
    expect(source).toMatch(/\.timeline-scroll\s*\{[^}]*overflow-x: hidden/s);
  });

  it('separates the active placement track from the mutually exclusive inspector identity', () => {
    expect(source).toContain('const timelineSelection = shallowRef(');
    expect(source).toContain('selectTimelineTrackIdentity(timelineSelection.value, trackIndex)');
    expect(source).toContain('selectTimelineActionsIdentity(');
    expect(source).toContain('selectTimelineMarkerIdentity(');
    expect(source).toContain('clearTimelineEditorSelection(timelineSelection.value)');
    expect(source).toContain(':selected="isTrackIdentitySelected(track.trackIndex)"');
    expect(source).not.toContain('const selectedMarker = ref<');
  });

  it('keeps the legacy Alt edge snapping and Shift edge-alignment gesture', () => {
    expect(source).toContain("if (event.shiftKey) return leftHalf ? 'alignStart' : 'alignEnd'");
    expect(source).toContain("return leftHalf ? 'snapBefore' : 'snapAfter'");
    expect(source).toContain(
      'if (!event.altKey || sourceCastId === null || sourceCastId === targetCastId) return false',
    );
    expect(source).toContain('if (alignSelectedCastToTarget(event, skillCastId)) return');
    expect(source).toContain("commitScenario('alignSkillCast'");
  });

  it('blocks timeline shortcuts while the hit detail is open', () => {
    const modalGuard = projectionSource(
      'const hasModalPanel = computed',
      '\nuseKeyboardShortcutScope',
    );

    expect(modalGuard).toContain('hitDetailTarget.value !== null');
  });

  it('writes cast movement directly in the actual-time domain', () => {
    const gesture = projectionSource(
      'interface TimelineCastMoveGesture',
      '\nconst castMoveGesture',
    );
    const projection = projectionSource(
      'function castActualStartFrame',
      '\nfunction gaugeCurveFor',
    );
    const movement = projectionSource('function beginCastMove', '\nasync function finishCastMove');

    expect(gesture).not.toContain('TimelineDisplayTime');
    expect(movement).not.toContain('toLogicalFrame');
    expect(projection).toContain('return gesture.previewActualFrame');
    expect(movement).toContain('pointerOffsetActualFrames');
    expect(movement).toContain('passedTimelineDragThreshold');
    expect(movement).toContain('dragStarted: false');
    expect(movement).toContain('resolveTimelineCastMoveFrame');
    expect(movement).toContain('frame.placementFrame');
    expect(source).toContain('projectTimelineEdgeAutoScrollDelta');
    expect(source).toContain('castMoveAutoScrollFrame = requestAnimationFrame(tick)');
    expect(source).toContain('cancelAnimationFrame(castMoveAutoScrollFrame)');
  });

  it('updates drag-dependent simulation projections at interactive frequency', () => {
    const movement = projectionSource('function beginCastMove', '\nasync function finishCastMove');

    expect(source).toContain('const LIVE_SIMULATION_RATE_HZ = 30');
    expect(source).toContain('const LIVE_SIMULATION_INTERVAL_MS = 1000 / LIVE_SIMULATION_RATE_HZ');
    expect(movement).toContain(
      'lastCastMoveSimulationAt = performance.now() - LIVE_SIMULATION_INTERVAL_MS',
    );
    expect(movement).toContain('now - lastCastMoveSimulationAt >= LIVE_SIMULATION_INTERVAL_MS');
    expect(movement).toContain('void nextTick(simulateNow)');
  });

  it('shows time dilation on its source block and expands it only for hovered or selected casts', () => {
    expect(source).toContain('castTimeDilationSegments');
    expect(source).toContain(':time-dilation-segments=');
    expect(actionBlockSource).toContain('class="time-dilation-segment"');
    expect(actionBlockSource).toContain('class="time-dilation-shimmer"');
    expect(actionBlockSource).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.time-dilation-shimmer/,
    );
    expect(source).toContain('const highlightedTimeDilationSourceIds = computed');
    expect(source).toContain('@hover-change="setCastHovered(cast.id, $event)"');
    expect(source).toContain(':source-cast-ids="highlightedTimeDilationSourceIds"');
    expect(source.match(/<TimelineTimeDilationBands/g)).toHaveLength(1);
  });

  it('keeps the legacy inherited label typography and lets narrow labels overflow', () => {
    expect(actionBlockSource).toContain('font-family: inherit');
    expect(actionBlockSource).toContain('font-size: inherit');
    expect(actionBlockSource).toContain('font-weight: 700');
    expect(actionBlockSource).toContain('line-height: normal');
    expect(actionBlockSource).toMatch(/\.action-label\s*\{[^}]*overflow: visible/s);
    expect(actionBlockSource).not.toContain('text-overflow: ellipsis');
  });
});
