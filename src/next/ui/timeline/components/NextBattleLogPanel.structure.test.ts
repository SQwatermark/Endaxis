import { describe, expect, it } from 'vitest';
import source from './NextBattleLogPanel.vue?raw';
import editorSource from '../NextTimelineEditor.vue?raw';

describe('NextBattleLogPanel structure', () => {
  it('keeps the legacy explicit-refresh, search, type-filter and detail behavior', () => {
    expect(source).toContain('const snapshot = ref');
    expect(source).toContain('const dirty = ref');
    expect(source).toContain('@click="refresh"');
    expect(source).toContain('v-model="keyword"');
    expect(source).toContain('v-for="event in availableEvents"');
    expect(source).toContain('@click="toggleEvent(event)"');
    expect(source).toContain('projectTimelineBattleLogGroups');
    expect(source).toContain('<details v-for="group in groupedEntries"');
    expect(source).toContain('<details v-for="entry in group.entries"');
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
    expect(source).toContain('receiptFieldLabel(String(key))');
    expect(source).toContain('receiptFieldValue(String(key), value)');
    expect(source).toContain("emit('locate', group.firstFrame, group.castId)");
    expect(source).toContain("$t('battleLog.ui.jumpToTimeline')");
    expect(source).toContain("$t('battleLog.ui.source')");
    expect(source).toContain("$t('battleLog.ui.target')");
    expect(source).not.toContain('搜索事件、来源或字段');
    expect(source).not.toContain('没有符合筛选条件的事件');
  });

  it('localizes Next receipt facts before falling back to legacy or raw event names', () => {
    expect(editorSource).toContain('battleLog.receiptTypes.${event}');
    expect(editorSource).toContain('battleLog.types.${event}');
    expect(editorSource).toContain(':damage-type-label="damageElementLabel"');
  });
});
