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
  '../ui/timeline/results/BattleLogPanel.vue',
  '../ui/timeline/components/ContingencyContractPanel.vue',
  '../ui/timeline/results/DamageAnalysisDialog.vue',
  '../ui/timeline/definitions/DefinitionHistoryControls.vue',
  '../ui/timeline/components/EnemySettingsPanel.vue',
  '../ui/timeline/library/GearInstanceDialog.vue',
  '../ui/timeline/library/GearLoadoutBuildDialog.vue',
  '../ui/timeline/library/GearSelectionDialog.vue',
  '../ui/timeline/definitions/equipment/GearSetDefinitionWorkspaceDialog.vue',
  '../ui/timeline/components/GlobalResourcePanel.vue',
  '../ui/timeline/library/OperatorBuildDialog.vue',
  '../ui/timeline/definitions/operators/OperatorLibraryMemberActions.vue',
  '../ui/timeline/library/OperatorPanelDialog.vue',
  '../ui/timeline/library/OperatorSelectionDialog.vue',
  '../ui/timeline/definitions/skills/SkillDefinitionEditorDialog.vue',
  '../ui/timeline/interaction/TimelineActionBlock.vue',
  '../ui/timeline/interaction/TimelineActionContextMenu.vue',
  '../ui/timeline/interaction/TimelineActionInspector.vue',
  '../ui/timeline/results/TimelineBuffDetailDialog.vue',
  '../ui/timeline/components/TimelineCornerToolbar.vue',
  '../ui/timeline/interaction/TimelineDocumentMarkerInspector.vue',
  '../ui/timeline/results/TimelineDurationBarColorControls.vue',
  '../ui/timeline/results/TimelineEnemyEffects.vue',
  '../ui/timeline/results/TimelineEnemyStatusSections.vue',
  '../ui/timeline/interaction/TimelineExternalEventInspector.vue',
  '../ui/timeline/components/TimelineHeaderToolbar.vue',
  '../ui/timeline/results/TimelineHitDetailDialog.vue',
  '../ui/timeline/library/TimelineLibrarySkillInspector.vue',
  '../ui/timeline/interaction/TimelineMarkerContextMenu.vue',
  '../ui/timeline/components/TimelineResetDialog.vue',
  '../ui/timeline/components/TimelineRuler.vue',
  '../ui/timeline/interaction/TimelineShortcutHelpDialog.vue',
  '../ui/timeline/components/TimelineTrackHeader.vue',
  '../ui/timeline/components/TimelineWorkbenchShell.vue',
  '../ui/timeline/library/WeaponBuildDialog.vue',
  '../ui/timeline/library/WeaponSelectionDialog.vue',
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
