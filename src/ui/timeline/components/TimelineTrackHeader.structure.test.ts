import { describe, expect, test } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
import source from './TimelineTrackHeader.vue?raw';

describe('TimelineTrackHeader old-editor behavior parity', () => {
  test('keeps the 24px reorder column, 44px avatar, weapon and four gear slots', () => {
    expect(source).toContain('grid-template-columns: 24px minmax(0, 1fr)');
    expect(source).toContain('width: 44px');
    expect(source).toContain('class="weapon-slot"');
    expect(source).toContain("['armor', 'gloves', 'accessory1', 'accessory2'] as const");
  });

  test('matches the old editor avatar outer size instead of shrinking its image inside 44px', () => {
    const sharedAvatarRule = source.slice(
      source.indexOf('.avatar,\n.empty-avatar'),
      source.indexOf('.empty-avatar {', source.indexOf('.avatar,\n.empty-avatar')),
    );
    const emptyAvatarRule = source.slice(
      source.indexOf('.empty-avatar {', source.indexOf('.avatar,\n.empty-avatar')),
      source.indexOf('.empty-avatar::before'),
    );

    expect(sharedAvatarRule).not.toContain('box-sizing: border-box');
    expect(emptyAvatarRule).toContain('box-sizing: border-box');
  });

  test('stretches with the shared loose-effect row height instead of staying at 160px', () => {
    expect(source).toContain('height: 100%');
    expect(source).toContain('min-height: 0');
    expect(source).toContain('top: calc(50% - 54px)');
    expect(source).toContain('top: calc(50% - 29px)');
    expect(source).toContain('top: calc(50% + 33px)');
    expect(editorSource).toContain(
      'height: `${trackEffectLayout(track.trackIndex, track.operatorInstanceId).height}px`',
    );
    expect(editorSource).toContain(
      "'--timeline-action-top': `${trackEffectLayout(track.trackIndex, track.operatorInstanceId).actionTop}px`",
    );
  });

  test('uses the old compact number control and placeholder geometry', () => {
    expect(source).toContain(
      "import CustomNumberInput from '../../components/CustomNumberInput.vue'",
    );
    expect(source).toContain('--initial-gauge-input-width: 54px');
    expect(source).toContain('class="initial-gauge-input-wrap"');
    expect(source).toContain('class="weapon-placeholder"');
    expect(source).toContain('class="gear-placeholder"');
    expect(source).not.toContain('<span v-else aria-hidden="true">+</span>');
  });

  test('shows only compiler-compatible resolved three-piece set hints', () => {
    expect(source).toContain('activeGearSetLabel');
    expect(source).toContain('class="set-bonus-hint"');
    expect(editorSource).toContain('projectActiveGearSetLabels');
    expect(editorSource).toContain(':active-gear-set-label="activeGearSetLabelsByTrack');
  });

  test('makes empty and occupied avatar selection keyboard reachable', () => {
    expect(source.match(/:aria-label="labels\.operator"/g)).toHaveLength(2);
    expect(source).toContain(':aria-label="$t(\'common.moveUp\')"');
    expect(source).toContain(':aria-label="$t(\'common.moveDown\')"');
  });

  test('shows reorder source and target feedback and clears cancelled native drags', () => {
    expect(source).toContain("'is-reorder-source': reorderSource");
    expect(source).toContain("'is-reorder-target': reorderTarget");
    expect(source).toContain('@dragend.stop="$emit(\'reorderDragEnd\')"');
    expect(editorSource).toContain('function finishTrackOrderDrag()');
    expect(editorSource).toContain('@reorder-drag-end="finishTrackOrderDrag"');
  });
});
