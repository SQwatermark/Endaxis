import { describe, expect, test } from 'vitest';

const vueSources = import.meta.glob<string>('../**/*.vue', {
  eager: true,
  import: 'default',
  query: '?raw',
});

// 新版界面与旧版的目录结构不同。只把已经接入设计系统的新版组件放进硬门禁，
// 其余页面迁移后再加入，不能因为合并上游就假装整个新版已经完成替换。
const adoptedFeaturePaths = new Set([
  '../ui/components/CustomNumberInput.vue',
  '../ui/timeline/TimelineEditor.vue',
  '../ui/timeline/components/BattleLogPanel.vue',
  '../ui/timeline/components/ContingencyContractPanel.vue',
  '../ui/timeline/components/DamageAnalysisDialog.vue',
  '../ui/timeline/components/DefinitionHistoryControls.vue',
  '../ui/timeline/components/EnemySettingsPanel.vue',
  '../ui/timeline/components/GearInstanceDialog.vue',
  '../ui/timeline/components/GearLoadoutBuildDialog.vue',
  '../ui/timeline/components/GearSelectionDialog.vue',
  '../ui/timeline/components/GearSetDefinitionWorkspaceDialog.vue',
  '../ui/timeline/components/GlobalResourcePanel.vue',
  '../ui/timeline/components/OperatorBuildDialog.vue',
  '../ui/timeline/components/OperatorLibraryMemberActions.vue',
  '../ui/timeline/components/OperatorPanelDialog.vue',
  '../ui/timeline/components/OperatorSelectionDialog.vue',
  '../ui/timeline/components/SkillDefinitionEditorDialog.vue',
  '../ui/timeline/components/TimelineActionBlock.vue',
  '../ui/timeline/components/TimelineActionContextMenu.vue',
  '../ui/timeline/components/TimelineActionInspector.vue',
  '../ui/timeline/components/TimelineBuffDetailDialog.vue',
  '../ui/timeline/components/TimelineCornerToolbar.vue',
  '../ui/timeline/components/TimelineDocumentMarkerInspector.vue',
  '../ui/timeline/components/TimelineDurationBarColorControls.vue',
  '../ui/timeline/components/TimelineEnemyEffects.vue',
  '../ui/timeline/components/TimelineEnemyStatusSections.vue',
  '../ui/timeline/components/TimelineExternalEventInspector.vue',
  '../ui/timeline/components/TimelineHeaderToolbar.vue',
  '../ui/timeline/components/TimelineHitDetailDialog.vue',
  '../ui/timeline/components/TimelineLibrarySkillInspector.vue',
  '../ui/timeline/components/TimelineMarkerContextMenu.vue',
  '../ui/timeline/components/TimelineResetDialog.vue',
  '../ui/timeline/components/TimelineRuler.vue',
  '../ui/timeline/components/TimelineShortcutHelpDialog.vue',
  '../ui/timeline/components/TimelineTrackHeader.vue',
  '../ui/timeline/components/TimelineWorkbenchShell.vue',
  '../ui/timeline/components/WeaponBuildDialog.vue',
  '../ui/timeline/components/WeaponSelectionDialog.vue',
]);
const featureSources = Object.entries(vueSources).filter(([path]) => adoptedFeaturePaths.has(path));

function filesMatching(pattern: RegExp) {
  return featureSources
    .filter(([, source]) => pattern.test(source))
    .map(([path]) => path)
    .sort();
}

describe('design-system usage boundaries', () => {
  test('actions use EaButton instead of unmanaged native buttons', () => {
    expect(filesMatching(/<button\b/)).toEqual([]);
  });

  test('legacy ea-btn modifier classes are fully retired', () => {
    expect(filesMatching(/(?:class="[^"]*|\.)ea-btn(?:--[\w-]+)?\b/)).toEqual([]);
  });

  test('dialogs use EaDialog instead of direct Element Plus dialogs', () => {
    expect(filesMatching(/<el-dialog\b/)).toEqual([]);
  });

  test('common form controls use design-system adapters', () => {
    expect(filesMatching(/<el-(?:input|input-number|select|switch|checkbox|radio)\b/)).toEqual([]);
  });

  test('select options stay behind design-system adapters', () => {
    expect(filesMatching(/<el-option(?:-group)?\b/)).toEqual([]);
  });

  test('native selects and textareas use design-system adapters', () => {
    expect(filesMatching(/<(?:select|textarea)\b/)).toEqual([]);
  });

  test('dialog footers use the shared action layout', () => {
    const mismatches = featureSources
      .filter(([, source]) => {
        const footerCount = source.match(/<template\s+#footer>/g)?.length ?? 0;
        const actionsCount = source.match(/<EaDialogActions\b/g)?.length ?? 0;
        return footerCount !== actionsCount;
      })
      .map(([path]) => path)
      .sort();

    expect(mismatches).toEqual([]);
  });

  test('native text, number, and checkbox inputs stay limited to documented hot-path controls', () => {
    const owners = featureSources
      .filter(([, source]) =>
        [...source.matchAll(/<input\b[\s\S]*?>/g)].some(match => {
          const type = match[0].match(/type=["']([^"']+)["']/)?.[1] ?? 'text';
          return ['text', 'number', 'checkbox'].includes(type);
        }),
      )
      .map(([path]) => path)
      .sort();

    expect(owners).toEqual(['../ui/components/CustomNumberInput.vue']);
  });
});
