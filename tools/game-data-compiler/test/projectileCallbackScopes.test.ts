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

  it('removes single-enemy bounce bookkeeping after its empty target consumer is omitted', () => {
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
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: {
                    kind: 'actionValueCompare',
                    left: { kind: 'blackboard', key: 'EntityBB_bounced' },
                    operator: 'equal',
                    right: { kind: 'constant', value: 0 },
                  },
                  alwaysNext: true,
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'modifyActionValue',
                      parameters: {
                        key: 'EntityBB_bounced',
                        operation: 'assign',
                        value: { kind: 'constant', value: 1 },
                      },
                    },
                    {
                      kind: 'mergeContextTargets',
                      parameters: { saveToContextKey: 'extra_target', sources: [] },
                    },
                  ],
                },
              },
              {
                kind: 'dealDamage',
                parameters: {
                  damageType: 'electric',
                  attackScale: { kind: 'constant', value: 1 },
                  tags: [],
                  features: [],
                  stagger: { kind: 'constant', value: 0 },
                },
              },
            ],
          },
        },
      ],
    });

    const callbackScope = result.body.steps[0];
    expect(callbackScope).toMatchObject({
      kind: 'withActionBlackboardScope',
      body: { steps: [{ kind: 'dealDamage' }] },
    });
  });
});
