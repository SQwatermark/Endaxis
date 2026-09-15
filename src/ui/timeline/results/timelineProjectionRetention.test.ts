import { describe, expect, it } from 'vitest';
import source from '../TimelineEditor.vue?raw';
import castMoveSource from '../interaction/useTimelineCastMove.ts?raw';
import actionBlockSource from '../interaction/TimelineActionBlock.vue?raw';
import hitDetailSource from './TimelineHitDetailDialog.vue?raw';

function projectionSource(startMarker: string, endMarker: string, text = source): string {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker, start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return text.slice(start, end);
}

describe('Next timeline simulation projection retention', () => {
  it('keeps preparation frames when navigating from a published battle log', () => {
    const navigation = projectionSource(
      'function locateBattleLogEntry',
      '\nfunction pointerInTimelineSurface',
    );
    expect(navigation).toContain('-scenario.value.battle.prepFrames');
    expect(navigation).toContain('Math.min(scenario.value.battle.durationFrames, frame)');
    expect(navigation).toContain('timelineFramePx(targetFrame)');
    expect(navigation).not.toContain('Math.max(0, Math.min');
  });
  it('keeps cast starts and time-dilation bands while a drag simulation is pending', () => {
    const projections = projectionSource(
      'const publishedSkillCastActualStartFrames = computed',
      '\nconst timelineWidth = computed',
    );

    expect(projections).toContain('projectSkillCastActualStartFrames');
    expect(projections).toContain('projectSkillCastActualDurationFrames');
    expect(projections).toContain('projectTimelineTimeDilationBands');
    expect(projections).toContain('publishedSkillCastActualStartFrames.value');
    expect(projections).toContain('publishedSkillCastActualDurationFrames.value');
    expect(projections).toContain('publishedTimeDilationBands.value');
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
    const publishedHits = projectionSource(
      'const hitReceipts = computed',
      '\nconst castHitEffects = computed',
    );
    const hitProjection = projectionSource(
      'const castHitEffects = computed',
      '\n/** 敌人瞬时效果标记',
    );

    expect(hitProjection).toContain('const current = simulationRun.value');
    expect(publishedHits).toContain('projectTimelineHitReceipts(publishedReceiptEntries.value)');
    expect(publishedHits).not.toContain('simulationStale.value');
    expect(hitProjection).toContain(
      'projectCompatibleHitFrames(hitReceipts.value.damages, compatibleSkillCastReceiptIds.value)',
    );
    expect(hitProjection).not.toContain('simulationStale.value');
    expect(actionBlockSource).not.toContain('transition: all');
    expect(actionBlockSource).toContain('background-color 0.15s ease');
    expect(actionBlockSource).toContain('transform 0.15s cubic-bezier');
    const hitSelection = projectionSource('@hit-click="', '@connection-pointer-down="');
    expect(hitSelection).toContain('(hitId, executionFrame) =>');
    expect(hitSelection).toMatch(/hitDetailTarget\s*=\s*\{[\s\S]*castId: cast.id,\s*hitId,/);
    expect(hitSelection).toContain('...(executionFrame === undefined ? {} : { executionFrame })');
    expect(source).toContain('candidate.hitId === target.hitId');
  });

  it('keeps legacy hit-marker press timing and highlights resolved or forced critical hits', () => {
    expect(actionBlockSource).toContain("'is-critical': hit.critical");
    expect(actionBlockSource).toContain("'is-forced-crit': hit.forcedCritical");
    expect(actionBlockSource).toContain(
      '@mousedown.stop.prevent="$emit(\'hitClick\', hit.hitId, hit.executionFrame)"',
    );
    expect(actionBlockSource).not.toMatch(/@click[^=]*="\$emit\('hitClick'/);
    expect(actionBlockSource).toMatch(
      /\.hit-marker\.is-critical,\s*\.hit-marker\.is-forced-crit\s*\{[^}]*#ff6b6b/s,
    );
    expect(source).toContain('critical: hit.label.damage.some(damage => damage.isCritical)');
    expect(source).toContain('criticalOverrides');
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
    expect(source).toContain(':log="battleLogSnapshot"');
    expect(source).toMatch(
      /usePublishedSimulationDisplay\(\s*publishedSimulation,\s*editorGameDataRepository/,
    );
    expect(source).toContain('<div v-else class="simulation-panel__empty">—</div>');
    expect(source).not.toContain('useTimelineStore');
    expect(source).not.toContain("from '../../stores/timelineStore'");
  });

  it('keeps the four-track stack flush with its vertical bounds', () => {
    expect(source).toContain('<div class="track-stack">');
    expect(source).not.toMatch(/\.track-stack\s*\{[^}]*padding:/s);
    expect(source).toMatch(/\.track-stack\s*\{[^}]*box-sizing: border-box;/s);
  });

  it('resizes only adjacent compact tracks and persists the local view heights', () => {
    expect(source).toContain(
      "const TRACK_HEIGHTS_STORAGE_KEY = 'endaxis:timeline-compact-track-heights:v1'",
    );
    expect(source).toContain('compactHeight: displayedCompactTrackHeights.value[trackIndex]');
    expect(source).toContain('resolveCompactTrackHeights(');
    expect(source).toContain('timelineViewportHeight.value - TIMELINE_RULER_HEIGHT');
    expect(source).toContain('resizeTimelineTrackPair(');
    expect(source).toContain("buffLayoutMode === 'compact'");
    expect(source).toContain("'is-compact-buff-layout': buffLayoutMode === 'compact'");
    expect(source).toContain('.timeline-scroll.is-compact-buff-layout');
    expect(source).toContain('@pointerdown="beginCompactTrackResize($event, track.trackIndex)"');
    // 上游双击重置整组轨道权重，不是仅重置当前相邻两条。
    expect(source).toContain('@dblclick.stop="resetCompactTrackLayout()"');
    expect(source).toContain('compactTrackHeights.value.map(() => TIMELINE_TRACK_BASE_HEIGHT)');
    expect(source).toContain("classList.add('is-track-resizing')");
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
    expect(source).toContain('useTimelineCastMove({');
    expect(castMoveSource).toContain('if (alignSelectedCastToTarget(event, skillCastId)) return');
    expect(source).toContain("commitScenario('alignSkillCast'");
  });

  it('blocks timeline shortcuts while the hit detail is open', () => {
    const modalGuard = projectionSource(
      'const hasTimelineContextMenu = computed',
      '\nuseKeyboardShortcutScope',
    );

    expect(modalGuard).not.toContain('hitDetailTarget.value !== null');
    expect(hitDetailSource).toContain('<InputRegionBoundary');
    expect(hitDetailSource).toContain(':active="visible" modal');
  });

  it('feeds the matching published operator panel into the legacy-shaped hit detail', () => {
    expect(source).toContain('const hitDetailOperatorPanel = computed');
    expect(source).toContain(
      'current.operatorPanels.find(panel => panel.operatorId === operatorId)',
    );
    expect(source).toContain(':operator-panel="hitDetailOperatorPanel"');
    expect(source).toContain(':contribution-source-label="hitDetailContributionSourceLabel"');
  });

  it('writes cast movement directly in the actual-time domain', () => {
    const gesture = projectionSource(
      'interface TimelineCastMoveGesture',
      '\n  const castMoveGesture',
      castMoveSource,
    );
    const projection = projectionSource(
      'function castActualStartFrame',
      '\nfunction castActualDurationFrame',
    );
    const displayedStarts = projectionSource(
      'const displayedSkillCastStartFrames = computed',
      '\nconst skillCastGroupsByTrack = computed',
    );
    const movement = projectionSource(
      'function beginCastMove',
      '\n  async function finishCastMove',
      castMoveSource,
    );

    expect(gesture).not.toContain('TimelineDisplayTime');
    expect(movement).not.toContain('toLogicalFrame');
    expect(projection).toContain(
      'return displayedSkillCastStartFrames.value.get(castId) ?? placementFrame',
    );
    expect(displayedStarts).toContain('projectMovingSkillCastStartFrames(');
    expect(displayedStarts).toContain('previewActualFrame: gesture.previewActualFrame');
    expect(displayedStarts).toContain('castIds: gesture.skillCastIds');
    expect(movement).toContain('pointerOffsetActualFrames');
    expect(movement).toContain('passedTimelineDragThreshold');
    expect(movement).toContain('dragStarted: false');
    expect(movement).toContain('resolveTimelineCastMovePointerFrame');
    expect(movement).toContain('laneLeftPx: lane.getBoundingClientRect().left');
    expect(movement).toContain('frame.placementFrame');
    expect(source).toContain('projectTimelineEdgeAutoScrollDelta');
    expect(castMoveSource).toContain('castMoveAutoScrollFrame = requestAnimationFrame(tick)');
    expect(castMoveSource).toContain('cancelAnimationFrame(castMoveAutoScrollFrame)');
  });

  it('lets the single-flight scheduler follow every authored drag position', () => {
    const movement = projectionSource(
      'function beginCastMove',
      '\n  async function finishCastMove',
      castMoveSource,
    );

    expect(movement).toContain('scenario.value = movedScenario');
    expect(movement).not.toContain('lastCastMoveSimulationAt');
    expect(movement).not.toContain('void nextTick(simulateNow)');
    expect(source).not.toContain('LIVE_SIMULATION_RATE_HZ');
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
    const blockStyle = actionBlockSource.match(/\.timeline-action-block\s*\{([^}]*)\}/)?.[1];
    const labelStyle = actionBlockSource.match(/\.action-label\s*\{([^}]*)\}/)?.[1];
    expect(blockStyle).toBeDefined();
    expect(labelStyle).toBeDefined();
    expect(blockStyle).toContain('font-family: inherit');
    expect(blockStyle).toContain('font-size: inherit');
    expect(blockStyle).toContain('font-weight: 700');
    expect(blockStyle).toContain('line-height: normal');
    expect(blockStyle).toContain('overflow: visible');
    expect(labelStyle).toContain('overflow: visible');
    expect(labelStyle).not.toContain('text-overflow: ellipsis');
    expect(blockStyle).not.toContain('text-overflow: ellipsis');
  });
});
