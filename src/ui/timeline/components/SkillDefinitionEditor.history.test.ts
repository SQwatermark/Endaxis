import { createSSRApp, h, type ComponentOptions } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import SkillDefinitionEditor from './SkillDefinitionEditor.vue';
import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';

describe('skill inspector history integration', () => {
  it('records a combat-step replacement and restores the complete draft on undo/redo', async () => {
    const template: SkillDefinition = {
      key: 'test',
      timelineBlockFrames: 10,
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
    editor.replaceSelectedCombatStep({
      kind: 'finishCurrentAbilityEntityWhenSourceDies',
      parameters: {},
    });
    const after = JSON.parse(JSON.stringify(editor.draft.value));
    expect(after).not.toEqual(before);
    expect(editor.structureUndoStack.value).toHaveLength(1);
    expect(template.scheduledSequences[0]!.sequence.steps[0]!.kind).toBe(
      'finishCurrentAbilityEntity',
    );
    await editor.restoreStructureHistory('undo');
    expect(editor.draft.value).toEqual(before);
    await editor.restoreStructureHistory('redo');
    expect(editor.draft.value).toEqual(after);
  });
});
