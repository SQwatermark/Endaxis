import { describe, expect, it } from 'vitest';
import project from '../../tmp/public-6aa244-sim-retimed-20260913/project.json';
import { createProjectGameDataRepository } from './projectGameDataRepository';

describe('project game data repository', () => {
  it('loads only referenced definitions before the selection catalog is requested', async () => {
    const repository = await createProjectGameDataRepository(project);

    expect(repository.getOperators().map(value => value.slug)).toEqual([
      'zhuang-fangyi',
      'arcane',
      'liino',
      'perlica',
    ]);
    expect(repository.getWeapons()).toHaveLength(4);
    expect(repository.getGears()).toHaveLength(13);
    expect(repository.getGearSets()).toHaveLength(4);
    expect(repository.getOperator('typhoeus')).toBeNull();
    expect(repository.hasAllDefinitions()).toBe(false);

    await repository.ensureAllDefinitions();

    expect(repository.getOperators()).toHaveLength(31);
    expect(repository.getWeapons()).toHaveLength(79);
    expect(repository.getOperator('typhoeus')).not.toBeNull();
    expect(repository.hasAllDefinitions()).toBe(true);
  });
});
