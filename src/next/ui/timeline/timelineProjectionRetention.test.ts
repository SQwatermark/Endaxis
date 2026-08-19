import { describe, expect, it } from 'vitest';
import source from './NextTimelineEditor.vue?raw';

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
    expect(projections).toContain('projectTimelineTimeDilationBands');
    expect(projections).not.toContain('timelineTimeMapping');
    expect(projections).not.toContain('simulationStale.value');
  });

  it('does not independently clear hit projections while the published snapshot is stale', () => {
    const hitProjection = projectionSource(
      'const castHitEffects = computed',
      '\n/** 敌人效果面板数据',
    );

    expect(hitProjection).toContain('const current = simulationRun.value');
    expect(hitProjection).not.toContain('simulationStale.value');
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
});
