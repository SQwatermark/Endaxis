import { describe, expect, it } from 'vitest';
import { createProjectGameDataRepository } from './projectGameDataRepository';

describe('project game data repository', () => {
  it('creates an empty-page repository without local preview files', async () => {
    const repository = await createProjectGameDataRepository(undefined);
    expect(repository.getOperators()).toEqual([]);
    expect(repository.getWeapons()).toEqual([]);
    expect(repository.getGears()).toEqual([]);
    expect(repository.getGearSets()).toEqual([]);
    expect(repository.hasAllDefinitions()).toBe(false);
  });
  it('loads only referenced definitions before the selection catalog is requested', async () => {
    const repository = await createProjectGameDataRepository({
      scenarios: [
        {
          operators: [
            {
              operatorSlug: 'perlica',
              weaponSlug: 'wpn_sword_0026',
              gearSlug: 'item_equip_t4_parts_wuling02_hand_02',
            },
            { operatorSlug: 'arcane', gearSetSlug: 'suit_wisdwill01' },
          ],
        },
      ],
    });

    expect(repository.getOperators().map(value => value.slug)).toEqual(['perlica', 'arcane']);
    expect(repository.getWeapons().map(value => value.slug)).toEqual(['wpn_sword_0026']);
    expect(repository.getGears().map(value => value.slug)).toEqual([
      'item_equip_t4_parts_wuling02_hand_02',
    ]);
    expect(repository.getGearSets().map(value => value.slug)).toEqual(['suit_wisdwill01']);
    expect(repository.getOperator('typhoeus')).toBeNull();
    expect(repository.hasAllDefinitions()).toBe(false);

    await repository.ensureAllDefinitions();

    expect(repository.getOperators()).toHaveLength(31);
    expect(repository.getWeapons()).toHaveLength(79);
    expect(repository.getOperator('typhoeus')).not.toBeNull();
    expect(repository.hasAllDefinitions()).toBe(true);
  });
});
