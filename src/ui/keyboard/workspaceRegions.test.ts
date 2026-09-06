import { describe, expect, it } from 'vitest';
import { reactive, toRaw } from 'vue';
import operator from '../timeline/components/OperatorDefinitionWorkspaceDialog.vue?raw';
import weapon from '../timeline/components/WeaponDefinitionWorkspaceDialog.vue?raw';
import gear from '../timeline/components/GearDefinitionWorkspaceDialog.vue?raw';
import gearSet from '../timeline/components/GearSetDefinitionWorkspaceDialog.vue?raw';
import skillEditor from '../timeline/components/SkillDefinitionEditor.vue?raw';
import { createSkillEditorDraft } from '../timeline/skillDefinitionEditorViewModel';
import type { SkillDefinition } from '../../core/game-data/operatorDefinition';

describe('definition workspace regions', () => {
  it.each([operator, weapon, gear, gearSet])(
    'wraps the whole dialog including named slots',
    source => {
      const template = source.slice(source.indexOf('<template>'));
      expect(template.indexOf('<InputRegionBoundary')).toBeLessThan(template.indexOf('<el-dialog'));
      expect(template.indexOf('</InputRegionBoundary>')).toBeGreaterThan(
        template.indexOf('</el-dialog>'),
      );
    },
  );
  it('unwraps the reactive definition before making an isolated skill draft', () => {
    const definition = reactive({ scheduledSequences: [] } as unknown as SkillDefinition);
    const draft = createSkillEditorDraft(toRaw(definition), undefined);
    expect(draft).not.toBe(toRaw(definition));
    expect(draft.scheduledSequences).not.toBe(definition.scheduledSequences);
    expect(skillEditor.match(/toRaw\(props.template\)/g)).toHaveLength(3);
    expect(skillEditor.match(/toRaw\(props.customDefinition\)/g)).toHaveLength(3);
  });
});
