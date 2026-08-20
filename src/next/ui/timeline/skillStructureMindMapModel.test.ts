import { describe, expect, it } from 'vitest';
import type { SkillDefinition } from '../../core/game-data/operatorDefinition';
import {
  buildAbilityEntityStructureMindMap,
  buildBuffStructureMindMap,
  buildSkillStructureMindMap,
  findSkillStructureNodeForPath,
  indexSkillStructureNodes,
} from './skillStructureMindMapModel';

describe('skillStructureMindMapModel', () => {
  it('projects settings, sequences, nested branches, and definition references', () => {
    const skill = {
      key: 'testSkill',
      timelineBlockFrames: 20,
      scheduledSequences: [
        {
          startFrame: 5,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: { condition: { kind: 'combatActive' } },
                whenTrue: {
                  steps: [
                    {
                      kind: 'spawnAbilityEntity',
                      parameters: { abilityEntityId: 'entity.test' },
                    },
                  ],
                },
                whenFalse: { steps: [] },
              },
            ],
          },
        },
      ],
    } as unknown as SkillDefinition;

    const root = buildSkillStructureMindMap(skill, {
      blackboard: 'Blackboard',
      availability: 'Availability',
      sequence: 'Sequence',
    });
    const nodes = indexSkillStructureNodes(root);

    expect(root.children.map(node => node.label)).toEqual([
      'Blackboard',
      'Availability',
      'Sequence 1',
    ]);
    expect(nodes.get('sequence:0')?.editorSection).toBe(0);
    expect(root.canAddChild).toBe('sequence');
    expect(nodes.get('sequence:0')?.canAddChild).toBe('step');
    expect(nodes.get('sequence:0:step:0:false')?.canAddChild).toBe('step');
    expect(findSkillStructureNodeForPath(root, '$.scheduledSequences[0].endFrame').id).toBe(
      'sequence:0',
    );
    expect(
      findSkillStructureNodeForPath(
        root,
        '$.scheduledSequences[0].sequence.steps[0].whenTrue.steps[0].parameters.abilityEntityId',
      ).id,
    ).toBe('sequence:0:step:0:true:step:0');
    expect(nodes.get('sequence:0:step:0')?.details['步骤类型']).toBe('conditional');
    expect(nodes.get('sequence:0:step:0:true:step:0')?.reference).toEqual({
      kind: 'entity',
      id: 'entity.test',
    });
  });

  it('projects Buff lifecycle and ability-entity child timelines through the same node model', () => {
    const buff = buildBuffStructureMindMap('buff.test', {
      stackingType: 'refresh',
      lifecycleSequences: {
        trigger: {
          steps: [{ kind: 'changeResource', parameters: { resource: 'sp', amount: 1 } }],
        },
      },
    } as never);
    const buffNodes = indexSkillStructureNodes(buff);
    expect(buff.canAddChild).toBe('lifecycle');
    expect(buffNodes.get('buff:lifecycle:trigger')?.canAddChild).toBe('step');
    expect(buffNodes.get('buff:lifecycle:trigger:step:0')?.sourcePath).toBe(
      'lifecycleSequences.trigger.steps[0]',
    );

    const entity = buildAbilityEntityStructureMindMap('entity.test', {
      lifetime: { kind: 'limited', durationSeconds: 10 },
      childSkill: {
        skillId: 'entity-child',
        scheduledSequences: [
          {
            startFrame: 3,
            sequence: {
              steps: [{ kind: 'finishCurrentAbilityEntity', parameters: {} }],
            },
          },
        ],
      },
    });
    const entityNodes = indexSkillStructureNodes(entity);
    expect(entityNodes.get('entity:child-skill')?.canAddChild).toBe('sequence');
    expect(entityNodes.get('entity:sequence:0')?.canAddChild).toBe('step');
    expect(entityNodes.get('entity:sequence:0:step:0')?.sourcePath).toBe(
      'childSkill.scheduledSequences[0].sequence.steps[0]',
    );

    const entityWithoutChildSkill = buildAbilityEntityStructureMindMap('entity.empty', {
      lifetime: { kind: 'infinite' },
    });
    expect(entityWithoutChildSkill.canAddChild).toBe('childSkill');
  });
});
