import { describe, expect, it } from 'vitest';
import type { SkillDefinition } from '../../core/game-data/operatorDefinition';
import {
  buildAbilityEntityStructureMindMap,
  buildBuffStructureMindMap,
  buildEquipmentContributionMindMap,
  buildSkillStructureMindMap,
  findSkillStructureNodeForPath,
  indexSkillStructureNodes,
} from './skillStructureMindMapModel';

describe('skillStructureMindMapModel', () => {
  it('projects settings, sequences, nested branches, and definition references', () => {
    const skill = {
      key: 'testSkill',
      timelineBlockFrames: 20,
      availability: {
        kind: 'any',
        conditions: [{ kind: 'combatActive' }, { kind: 'casterControlled' }],
      },
      eventHandlers: [
        {
          key: 'after-hit',
          event: { kind: 'skillHit', skillGroupKey: 'battleSkill', scope: 'operator' },
          condition: { kind: 'combatActive' },
          scheduledSequences: [
            {
              startFrame: 2,
              sequence: { steps: [{ kind: 'finishTimeline', parameters: {} }] },
            },
          ],
        },
      ],
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
              {
                kind: 'listenForCombatEvents',
                parameters: {
                  responses: [
                    {
                      key: 'on-hit',
                      event: { kind: 'buffApplied' },
                      condition: { kind: 'combatActive' },
                      sequence: {
                        steps: [{ kind: 'finishTimeline', parameters: {} }],
                      },
                    },
                    {
                      key: 'on-airborne',
                      event: { kind: 'airborneOutput' },
                      sequence: { steps: [] },
                    },
                  ],
                },
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
      '技能事件响应',
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
    expect(nodes.get('availability')?.payloadKind).toBe('combatCondition');
    expect(nodes.get('availability')?.canAddChild).toBe('combatCondition');
    expect(nodes.get('availability:condition:1')?.sourcePath).toBe('availability.conditions[1]');
    expect(nodes.get('sequence:0:step:0:condition')?.sourcePath).toBe(
      'scheduledSequences[0].sequence.steps[0].parameters.condition',
    );
    expect(nodes.get('sequence:0:step:0:condition')?.canDelete).toBe(false);
    expect(nodes.get('sequence:0:step:1')?.canAddChild).toBe('eventResponse');
    expect(nodes.get('sequence:0:step:1:response:0')?.sourcePath).toBe(
      'scheduledSequences[0].sequence.steps[1].parameters.responses[0]',
    );
    expect(nodes.get('sequence:0:step:1:response:0:condition')?.sourcePath).toBe(
      'scheduledSequences[0].sequence.steps[1].parameters.responses[0].condition',
    );
    expect(nodes.get('sequence:0:step:1:response:0:sequence:step:0')?.sourcePath).toBe(
      'scheduledSequences[0].sequence.steps[1].parameters.responses[0].sequence.steps[0]',
    );
    expect(nodes.get('sequence:0:step:1:response:1')?.canAddChild).toBe('combatCondition');
    expect(nodes.get('skill:handlers')?.canAddChild).toBe('skillEventHandler');
    expect(nodes.get('skill:handler:0')?.sourcePath).toBe('eventHandlers[0]');
    expect(nodes.get('skill:handler:0:condition')?.sourcePath).toBe('eventHandlers[0].condition');
    expect(nodes.get('skill:handler:0:sequences')?.canAddChild).toBe('sequence');
    expect(nodes.get('skill:handler:0:sequence:0')?.sourcePath).toBe(
      'eventHandlers[0].scheduledSequences[0]',
    );
    expect(nodes.get('skill:handler:0:sequence:0')?.canDelete).toBe(false);
    expect(nodes.get('sequence:0:step:0:true:step:0')?.reference).toEqual({
      kind: 'entity',
      id: 'entity.test',
    });

    const withoutAvailability = buildSkillStructureMindMap({
      ...skill,
      availability: undefined,
    });
    expect(indexSkillStructureNodes(withoutAvailability).get('availability')?.canAddChild).toBe(
      'combatCondition',
    );
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

  it('projects equipment modifiers and event response sequences into the shared map', () => {
    const root = buildEquipmentContributionMindMap({
      modifiers: [{ kind: 'panelStat', stat: 'criticalRate', value: [0.1, 0.2] }],
      eventHandlers: [
        {
          key: 'on-hit',
          event: { kind: 'skillHit', skillGroupKey: 'battleSkill', scope: 'operator' },
          condition: {
            kind: 'all',
            conditions: [
              { kind: 'combatActive' },
              { kind: 'not', condition: { kind: 'casterControlled' } },
            ],
          },
          sequence: {
            steps: [
              {
                kind: 'changeResource',
                parameters: { resource: 'sp', amount: 1, recipient: 'caster' },
              },
            ],
          },
        },
        {
          key: 'without-condition',
          event: { kind: 'buffApplied' },
          sequence: { steps: [] },
        },
      ],
    });
    const nodes = indexSkillStructureNodes(root);

    expect(nodes.get('equipment:modifier:0')?.sourcePath).toBe('modifiers[0]');
    expect(nodes.get('equipment:modifier:0')?.payloadKind).toBe('equipmentModifier');
    expect(nodes.get('equipment:modifiers')?.acceptsChildKind).toBe('equipmentModifier');
    expect(nodes.get('equipment:modifiers')?.canAddChild).toBe('equipmentModifier');
    expect(nodes.get('equipment:handler:0')?.sourcePath).toBe('eventHandlers[0]');
    expect(nodes.get('equipment:handler:0')?.payloadKind).toBe('equipmentHandler');
    expect(nodes.get('equipment:handler:0:condition')?.sourcePath).toBe(
      'eventHandlers[0].condition',
    );
    expect(nodes.get('equipment:handler:0:condition')?.canAddChild).toBe('combatCondition');
    expect(nodes.get('equipment:handler:0:condition')?.canMove).toBe(false);
    expect(nodes.get('equipment:handler:0:condition:condition:0')?.sourcePath).toBe(
      'eventHandlers[0].condition.conditions[0]',
    );
    expect(nodes.get('equipment:handler:0:condition:condition:1:condition')?.sourcePath).toBe(
      'eventHandlers[0].condition.conditions[1].condition',
    );
    expect(nodes.get('equipment:handler:0:condition:condition:1:condition')?.canDelete).toBe(false);
    expect(nodes.get('equipment:handler:1')?.canAddChild).toBe('combatCondition');
    expect(nodes.get('equipment:handlers')?.canAddChild).toBe('equipmentHandler');
    expect(nodes.get('equipment:handler:0:sequence:step:0')?.sourcePath).toBe(
      'eventHandlers[0].sequence.steps[0]',
    );
  });
});
