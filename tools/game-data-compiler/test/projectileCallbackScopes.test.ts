import { describe, expect, it } from 'vitest';
import { compileSynchronousProjectileCallbackScopesSource } from '../src/compiler/projectileCallbackScopes.ts';
import type { ProjectileLaunchActionSource } from '../src/source/referenceActions.ts';

const launch = {
  kind: 'projectileLaunch',
  projectileId: 'projectile_empty_entity_board',
  assignBlackboard: true,
  assignEntityBlackboard: true,
  assignments: [],
  callbacks: [{ event: 'hit', enabled: true, skillId: 'projectile_hit' }],
} as unknown as ProjectileLaunchActionSource;

describe('synchronous projectile callback scope', () => {
  it('accepts an enabled but empty entity assignment list with an evidenced empty template board', () => {
    const result = compileSynchronousProjectileCallbackScopesSource({
      sourcePath: 'skill.LaunchProjectile',
      launch,
      template: {
        projectileId: launch.projectileId,
        entityBlackboard: [],
      },
      invocations: [
        {
          event: 'hit',
          skillId: 'projectile_hit',
          declaredBlackboard: [],
          sequence: { steps: [] },
        },
      ],
    });

    expect(result.parameters.entityInitialValues).toEqual({});
    expect(result.body.steps).toHaveLength(1);
  });

  it('projects non-empty projectile entity assignments from the parent action board', () => {
    const result = compileSynchronousProjectileCallbackScopesSource({
      sourcePath: 'skill.LaunchProjectile',
      launch: {
        ...launch,
        assignments: [
          {
            targetKey: 'EntityBB_value',
            valueType: 'Numeric',
            numericValue: 1,
            stringValue: '',
            useDirectValue: true,
            inputValueKey: '',
          },
        ],
      },
      template: {
        projectileId: launch.projectileId,
        entityBlackboard: [],
      },
      invocations: [],
    });
    expect(result.parameters.entityAssignments).toEqual({
      EntityBB_value: { kind: 'constant', value: 1 },
    });
  });
});
