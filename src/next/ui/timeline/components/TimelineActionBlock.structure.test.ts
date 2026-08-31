import { describe, expect, it } from 'vitest';
import editorSource from '../NextTimelineEditor.vue?raw';
import source from './TimelineActionBlock.vue?raw';

describe('TimelineActionBlock legacy visual parity', () => {
  it('keeps projected geometry and the legacy skill-type borders', () => {
    expect(source).toContain('left: `${props.left}px`');
    expect(source).toContain('width: `${Math.max(1, props.width)}px`');
    expect(source).toContain('height: 50px');
    expect(source).toContain('border: 2px dashed var(--action-accent)');
    expect(source).toContain("[data-skill-type='basicAttack']");
    expect(source).toContain("[data-skill-type='comboSkill']");
    expect(source).toContain("[data-skill-type='ultimate']");
  });

  it('keeps document-order stacking deterministic and raises selected or moving actions', () => {
    expect(editorSource).toContain('v-for="(cast, castIndex) in track.skillCasts"');
    expect(editorSource).toContain(':stack-order="castIndex"');
    expect(source).toContain(
      'zIndex: `calc(${props.moving ? 20000 : props.selected ? 10000 : 2} + ${props.stackOrder ?? 0})`',
    );
    expect(source).toContain('.timeline-action-block.is-selected');
    expect(source).toContain('border: 2px dashed var(--ea-action-selected, #fff)');
  });

  it('projects receipt-confirmed perfect combo evidence onto both ruler and action block', () => {
    expect(editorSource).toContain(':perfect="perfectComboCastIds.has(cast.id)"');
    expect(source).toContain("'is-perfect-combo': perfect");
    expect(source).toContain('.timeline-action-block.is-perfect-combo::after');
    expect(source).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('keeps status marks, hit markers and ultimate side bars as independent overlays', () => {
    expect(source).toContain('class="hit-marker"');
    expect(source).toContain('class="warning-mark"');
    expect(source).toContain('class="status-mark lock-mark"');
    expect(source).toContain('class="status-mark disabled-mark"');
    expect(source).toContain('ultimate-side-bar--left');
    expect(source).toContain('ultimate-side-bar--right');
  });

  it('renders long validation warnings in a viewport-bounded dark tooltip', () => {
    expect(source).toContain(':content="warningText || warningFallbackText || \'\'"');
    expect(editorSource).toContain(':warning-fallback-text="t(\'common.warning\')"');
    expect(source).toContain('popper-class="next-timeline-warning-tooltip"');
    expect(source).toContain('max-width: min(320px, calc(100vw - 48px))');
    expect(source).toContain('overflow-wrap: anywhere');
  });

  it('shows connection ports only for focused candidates and excludes the drag source', () => {
    expect(source).toContain('const showConnectionPorts = computed');
    expect(source).toContain(
      'return hovered.value && props.connectionSourceActionId !== props.actionId',
    );
    expect(source).toContain('return hovered.value || props.selected === true');
    expect(source).toContain('v-show="showConnectionPorts"');
    expect(editorSource).toContain(':connection-dragging="connectionDrag !== null"');
    expect(editorSource).toContain(
      ':connection-source-action-id="connectionDrag?.skillCastId ?? null"',
    );
    expect(editorSource).toContain(':connection-target-valid="isConnectionTargetValid(cast.id)"');
    expect(editorSource).toContain(
      'canCreateSkillCastConnection(scenario.value, drag.skillCastId, targetSkillCastId)',
    );
    expect(editorSource).toContain('if (targetSkillCastId === drag.skillCastId) return;');
    expect(source).toContain("'is-invalid-target': connectionTargetValid === false");
    expect(source).toContain('.connection-port.is-invalid-target');
    expect(source).toContain('pointer-events: none');
  });
});
