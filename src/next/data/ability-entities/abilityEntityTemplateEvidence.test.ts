import { describe, expect, it } from 'vitest';
import {
  logicalAbilityEntityTemplates,
  unresolvedAbilityEntityTemplateReferences,
} from './abilityEntityTemplateEvidence';

describe('AbilityEntity template evidence adapter', () => {
  it('adapts all resolved templates without inventing the missing Liino template', () => {
    expect(logicalAbilityEntityTemplates).toHaveLength(59);
    expect(
      logicalAbilityEntityTemplates.some(
        template => template.id === 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target',
      ),
    ).toBe(true);
    expect(unresolvedAbilityEntityTemplateReferences).toHaveProperty(
      'abilityentity_chr_0035_liino_ult_skill_projhit',
    );
    expect(
      logicalAbilityEntityTemplates.find(
        value => value.id === 'abilityentity_chr_0012_avywen_combo_skill_lance',
      ),
    ).toMatchObject({
      bornTagIds: expect.arrayContaining([1447025331]),
      lifetime: { kind: 'limited', durationSeconds: 62 },
    });
    expect(
      logicalAbilityEntityTemplates.find(
        value => value.id === 'abilityentity_chr_0016_laevat_dung_inflict',
      )?.lifetime,
    ).toEqual({ kind: 'infinite' });
  });
});
