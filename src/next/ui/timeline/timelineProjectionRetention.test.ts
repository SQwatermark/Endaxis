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
      '\n/** 敌人效果面板数据',
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
    expect(movement).toContain('resolveTimelineCastMoveFrame');
    expect(movement).toContain('frame.placementFrame');
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
