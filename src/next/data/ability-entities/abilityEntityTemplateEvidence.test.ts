import { describe, expect, it } from 'vitest';
import {
  logicalAbilityEntityTemplates,
  unresolvedAbilityEntityTemplateReferences,
} from './abilityEntityTemplateEvidence';

describe('AbilityEntity template evidence adapter', () => {
  it('adapts all resolved templates including the recovered Liino template', () => {
    expect(logicalAbilityEntityTemplates).toHaveLength(60);
    expect(
      logicalAbilityEntityTemplates.some(
        template => template.id === 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target',
      ),
    ).toBe(true);
    expect(
      logicalAbilityEntityTemplates.some(
        template => template.id === 'abilityentity_chr_0035_liino_ult_skill_projhit',
      ),
    ).toBe(true);
    expect(unresolvedAbilityEntityTemplateReferences).toEqual({});
    expect(
      logicalAbilityEntityTemplates.find(
        value => value.id === 'abilityentity_chr_0012_avywen_combo_skill_lance',
      ),
    ).toMatchObject({
      bornTags: expect.arrayContaining(["Skill/Character/chr_0012_avywen/Lance/ComboLance"]),
      lifetime: { kind: 'limited', durationSeconds: 62 },
    });
    expect(
      logicalAbilityEntityTemplates.find(
        value => value.id === 'abilityentity_chr_0016_laevat_dung_inflict',
      )?.lifetime,
    ).toEqual({ kind: 'infinite' });
  });
});
