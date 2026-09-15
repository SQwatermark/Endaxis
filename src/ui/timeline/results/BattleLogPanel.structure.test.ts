import { describe, expect, it } from 'vitest';
import source from './BattleLogPanel.vue?raw';
import editorSource from '../TimelineEditor.vue?raw';

describe('BattleLogPanel structure', () => {
  it('keeps the legacy explicit-refresh, search and type-filter behavior', () => {
    expect(source).toContain('const snapshot = shallowRef');
    expect(source).toContain('const dirty = computed');
    expect(source).toContain('@click="refresh"');
    expect(source).toContain('v-model="keyword"');
    expect(source).toContain('v-for="event in availableEvents"');
    expect(source).toContain('@click="toggleEvent(event)"');
    expect(source).toContain('projectTimelineBattleLogGroups');
    expect(source).toContain('v-for="group in groupedEntries"');
    expect(source).toContain('const openGroupKey = ref<string | null>(null)');
    expect(source).toContain('@click="locateGroup(group, $event)"');
    expect(source).toContain('@click="locateEntry(group, entry)"');
  });

  it('opens and scrolls to the log group selected from the timeline', () => {
    expect(source).toContain('selectedCastId: string | null');
    expect(source).toContain('function syncSelectedCastGroup()');
    expect(source).toContain('candidate.castId === castId');
    expect(source).toContain("scrollIntoView({ block: 'nearest', behavior: 'smooth' })");
    expect(source).toContain('immediate: true');
    expect(source).toContain(':ref="element => setGroupElement(group.key, element)"');
    expect(editorSource).toContain(':selected-cast-id="selectedCastId"');
  });

  it('uses receipt battle frames directly; prepFrames is only a visual axis inset', () => {
    expect(source).not.toContain('prepFrames');
    expect(source).toContain('const absolute = Math.abs(frame)');
    expect(source).toContain("String(absolute % 30).padStart(2, '0')");
  });

  it('restores legacy filter presets, source names and timeline location', () => {
    expect(source).toContain('TIMELINE_BATTLE_LOG_PRESETS');
    expect(source).toContain('applyPreset(preset.id)');
    expect(source).toContain('sourceLabel(entry)');
    expect(source).toContain('summarizeTimelineBattleLogEntry');
    expect(source).toContain("emit('locate', entry.frame, group.castId)");
    expect(source).toContain("$t('battleLog.ui.jumpToTimeline')");
    expect(source).not.toContain('搜索事件、来源或字段');
    expect(source).not.toContain('没有符合筛选条件的事件');
  });

  it('matches the legacy skill-card hierarchy and semantic event sections', () => {
    expect(source).toContain('class="simlog-filters simlog-block"');
    expect(source).toContain('class="group simlog-block"');
    expect(source).toContain('class="group__title-row"');
    expect(source).toContain('class="group__timing"');
    expect(source).toContain('class="group__stats"');
    expect(source).toContain('groupSections(group.entries)');
    expect(source).toContain("type BattleLogSectionKind = 'damage' | 'effects' | 'sp'");
    expect(source).not.toContain('<details v-for="entry in group.entries"');
  });

  it('localizes Next receipt facts before falling back to legacy or raw event names', () => {
    expect(editorSource).toContain('battleLog.receiptTypes.${event}');
    expect(editorSource).toContain('battleLog.types.${event}');
    expect(editorSource).toContain(':damage-type-label="damageElementLabel"');
  });
});
