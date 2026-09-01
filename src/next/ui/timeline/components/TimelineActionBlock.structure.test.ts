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
    expect(source).toContain(
      ".timeline-action-block:not(.is-disabled)[data-skill-type='ultimate']",
    );
    expect(source).toContain(
      ".timeline-action-block:not(.is-selected):not(.is-disabled)[data-skill-type='basicAttack']",
    );
    expect(source).toContain(
      ".timeline-action-block:not(.is-selected):not(.is-disabled)[data-skill-type='comboSkill']",
    );
  });

  it('derives default accents from skill type and operator element while preserving custom colors', () => {
    expect(editorSource).toContain('const OPERATOR_ELEMENT_SKILL_COLORS');
    expect(editorSource).toContain("heat: '#ff4d4f'");
    expect(editorSource).toContain("comboSkill'\n        ? '#fdd900'");
    expect(editorSource).toContain('editorGameDataRepository.getOperator(operatorSlug)?.element');
    expect(editorSource).toContain(
      ':color="cast.color ?? skillAccentColor(cast.skillType, track.operatorSlug)"',
    );
    expect(editorSource).toContain(
      ':accent-color="skillAccentColor(entry.skillType, selectedTrackModel.operatorSlug)"',
    );
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
    expect(source).toContain(
      'd="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"',
    );
    expect(source).toMatch(/\.warning-mark\s*\{[^}]*top: 2px;[^}]*right: 2px;/s);
    expect(source).not.toContain("content: '!'");
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
