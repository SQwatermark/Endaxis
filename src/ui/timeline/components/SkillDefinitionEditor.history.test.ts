import { createSSRApp, h, type ComponentOptions } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import SkillDefinitionEditor from './SkillDefinitionEditor.vue';
import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';

describe('skill inspector history integration', () => {
  const input = (value: string) => ({ target: { value } });
  const edits: [string, (editor: any) => void][] = [
    [
      'combat step',
      editor =>
        editor.replaceSelectedCombatStep({
          kind: 'finishCurrentAbilityEntityWhenSourceDies',
          parameters: {},
        }),
    ],
    ['width', editor => editor.setField('timelineBlockFrames', input('20'))],
    ['cooldown', editor => editor.setField('cooldownFrames', input('40'))],
    ['cost frame', editor => editor.setField('costFrame', input('2'))],
    ['enhancement buff', editor => editor.setEnhancementStateBuffId(input('custom-buff'))],
    ['blackboard', editor => editor.setBlackboard({ test: 1 })],
    ['cost value', editor => editor.setCostValue(0, input('25'))],
    ['cost resource', editor => editor.setCostResource(0, input('ultimateEnergy'))],
    ['add cost', editor => editor.appendCost()],
    ['remove cost', editor => editor.removeCost(0)],
    [
      'delete selected step',
      editor => editor.runStructureNodeAction('delete', editor.selectedStructureNode.value),
    ],
  ];
  it.each(edits)('records %s and restores the complete draft on undo/redo', async (_name, edit) => {
    const template: SkillDefinition = {
      key: 'test',
      timelineBlockFrames: 10,
      costs: [{ resource: 'sp', value: 10 }],
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: { steps: [{ kind: 'finishCurrentAbilityEntity', parameters: {} }] },
        },
      ],
    };
    let editor: any;
    // Exercise the real parent draft handlers. No template, browser input or
    // nested curve rendering is claimed by this setup-level integration test.
    const component = {
      ...(SkillDefinitionEditor as ComponentOptions),
      setup(props: any, context: any) {
        editor = (SkillDefinitionEditor as any).setup(props, context);
        return editor;
      },
      ssrRender: () => {},
    };
    const app = createSSRApp({
      render: () =>
        h(component, {
          template,
          customDefinition: undefined,
          skillLevel: 1,
          labels: {},
        }),
    });
    app.use(
      createI18n({
        legacy: false,
        locale: 'en',
        messages: { en: {} },
        missingWarn: false,
        fallbackWarn: false,
      }),
    );
    await renderToString(app);
    await editor.selectStructurePath('scheduledSequences[0].sequence.steps[0]');
    const before = JSON.parse(JSON.stringify(editor.draft.value));
    await edit(editor);
    const afterSelection = editor.selectedStructureSourcePath.value;
    const after = JSON.parse(JSON.stringify(editor.draft.value));
    expect(after).not.toEqual(before);
    expect(editor.structureUndoStack.value).toHaveLength(1);
    expect(template.scheduledSequences[0]!.sequence.steps[0]!.kind).toBe(
      'finishCurrentAbilityEntity',
    );
    await editor.restoreStructureHistory('undo');
    expect(editor.draft.value).toEqual(before);
    expect(editor.selectedStructureSourcePath.value).toBe(
      'scheduledSequences[0].sequence.steps[0]',
    );
    editor.removeCost(999);
    expect(editor.structureUndoStack.value).toHaveLength(0);
    expect(editor.structureRedoStack.value).toHaveLength(1);
    await editor.restoreStructureHistory('redo');
    expect(editor.draft.value).toEqual(after);
    expect(editor.selectedStructureSourcePath.value).toBe(afterSelection);
  });
});
